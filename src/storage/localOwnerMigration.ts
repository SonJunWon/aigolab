/**
 * 로컬(IndexedDB) 데이터 소유자 네임스페이스 마이그레이션 — 1회 수행.
 *
 * 네임스페이스 도입(C1 수정) 이전에 저장된 레거시 데이터는 소유자 구분이
 * 없다. 업데이트 후 첫 로그인 사용자가 기존 로컬 데이터를 "이어받도록"
 * 다음을 수행한다 (단일 사용자 기기 가정 — 대부분의 케이스):
 *
 * - notebooks 스토어: 프리픽스 없는 키 → `usr:<uid>:<원래키>` 로 재키잉.
 * - 마크다운 DB(mdFolders/mdFiles): `ownerId` 없는 레코드 → 현재 사용자로 태깅.
 *
 * localStorage 플래그로 전 디바이스에서 1회만 실행한다. 첫 실행으로 모든
 * 레거시 데이터가 소유자에게 귀속되므로, 이후 로그인하는 다른 사용자는
 * 깨끗한 네임스페이스에서 시작한다(유출 없음).
 *
 * ⚠️ 반드시 runAiIntroIdMigration() 이후에 실행해야 한다. aiIntro 마이그레이션은
 * 프리픽스 없는 키를 전제로 동작하기 때문.
 */

import { getDB, getMdDB } from "./db";
import { OWNER_PREFIX } from "./localOwner";

const FLAG_KEY = "aigolab.localOwnerMigration.v1";

export async function runLocalOwnerMigration(userId: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (!userId) return;
  if (localStorage.getItem(FLAG_KEY) === "done") return;

  const prefix = `${OWNER_PREFIX}${userId}:`;

  try {
    // 1) notebooks: 프리픽스 없는 레거시 키 → 사용자 네임스페이스 키
    const db = await getDB();
    const keys = (await db.getAllKeys("notebooks")) as string[];
    for (const key of keys) {
      if (key.startsWith(OWNER_PREFIX)) continue; // 이미 네임스페이스 적용됨
      const value = await db.get("notebooks", key);
      if (!value) continue;
      const newKey = `${prefix}${key}`;
      const exists = await db.get("notebooks", newKey);
      if (!exists) {
        await db.put("notebooks", { ...value, id: newKey });
      }
      await db.delete("notebooks", key);
    }

    // 2) 마크다운: ownerId 없는 레거시 레코드 → 현재 사용자로 태깅
    const mdb = await getMdDB();
    const folders = await mdb.getAll("mdFolders");
    for (const folder of folders) {
      if (folder.ownerId) continue;
      await mdb.put("mdFolders", { ...folder, ownerId: userId });
    }
    const files = await mdb.getAll("mdFiles");
    for (const file of files) {
      if (file.ownerId) continue;
      await mdb.put("mdFiles", { ...file, ownerId: userId });
    }

    localStorage.setItem(FLAG_KEY, "done");
    console.log("[local-owner-migration] done for", userId);
  } catch (err) {
    console.warn("[local-owner-migration] failed:", err);
  }
}
