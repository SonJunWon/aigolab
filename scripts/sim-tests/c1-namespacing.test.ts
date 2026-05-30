/**
 * C1 — 로그아웃/사용자전환 시 IndexedDB 데이터 격리 (실제 db.ts + 가짜 IndexedDB).
 *
 * 실제 storage/db.ts 의 notebooks/md 스토어에 대해, 구현한 것과 동일한
 * 네임스페이스 규칙(usr:<uid>:<key>)과 레거시 마이그레이션 로직을 적용해
 *  ① 레거시 데이터가 현재 사용자로 이관되는가
 *  ② 다른 사용자가 그 데이터를 읽지 못하는가(유출 차단)
 * 를 검증한다. (네임스페이스 규칙은 src/storage/localOwner.ts 와 동일)
 */
import "fake-indexeddb/auto";
import { getDB, getMdDB } from "../../src/storage/db";
import { check, done } from "./_assert";

const OWNER_PREFIX = "usr:";
const ownedKey = (owner: string, key: string) => `${OWNER_PREFIX}${owner}:${key}`;

// localOwnerMigration.ts 와 동일한 로직(레거시 → 현재 사용자 네임스페이스)
async function runMigration(userId: string) {
  const db = await getDB();
  const keys = (await db.getAllKeys("notebooks")) as string[];
  for (const key of keys) {
    if (key.startsWith(OWNER_PREFIX)) continue;
    const value = await db.get("notebooks", key);
    if (!value) continue;
    const newKey = `${OWNER_PREFIX}${userId}:${key}`;
    if (!(await db.get("notebooks", newKey))) await db.put("notebooks", { ...value, id: newKey });
    await db.delete("notebooks", key);
  }
  const mdb = await getMdDB();
  for (const f of await mdb.getAll("mdFolders")) {
    if (!(f as { ownerId?: string }).ownerId) await mdb.put("mdFolders", { ...f, ownerId: userId });
  }
  for (const f of await mdb.getAll("mdFiles")) {
    if (!(f as { ownerId?: string }).ownerId) await mdb.put("mdFiles", { ...f, ownerId: userId });
  }
}

const db = await getDB();
const mdb = await getMdDB();

// ── 1) 레거시(네임스페이스 없는) 데이터 시드 ──
await db.put("notebooks", { id: "ide-project", cells: [], updatedAt: 1, files: { a: 1 } } as never);
await db.put("notebooks", { id: "python-beginner-01", cells: [{ type: "code", source: "print(1)" }], updatedAt: 1 } as never);
await mdb.put("mdFiles", { id: "f1", name: "secret.md", folderId: null, content: "A의 비밀노트", order: 0, isFavorite: false, createdAt: 1, updatedAt: 1 });

// ── 2) 사용자 A 로 마이그레이션 ──
await runMigration("userA");

const legacyGone = (await db.get("notebooks", "ide-project")) === undefined;
const aHasProject = (await db.get("notebooks", ownedKey("userA", "ide-project"))) !== undefined;
const aHasLesson = (await db.get("notebooks", ownedKey("userA", "python-beginner-01"))) !== undefined;
check("마이그레이션 후 레거시 키 제거됨", legacyGone);
check("마이그레이션 후 A 네임스페이스로 프로젝트 이관됨", aHasProject);
check("마이그레이션 후 A 네임스페이스로 레슨노트북 이관됨", aHasLesson);

const mdAfter = await mdb.getAll("mdFiles");
check("마이그레이션 후 마크다운에 ownerId=userA 태깅됨", mdAfter.every((f) => (f as { ownerId?: string }).ownerId === "userA"));

// ── 3) 사용자 B 전환: B 는 A 데이터를 못 읽어야 함(유출 차단) ──
const bSeesProject = (await db.get("notebooks", ownedKey("userB", "ide-project"))) !== undefined;
const bSeesLesson = (await db.get("notebooks", ownedKey("userB", "python-beginner-01"))) !== undefined;
check("B 는 A 의 IDE 프로젝트를 읽지 못함(유출 차단)", bSeesProject === false);
check("B 는 A 의 레슨노트북을 읽지 못함(유출 차단)", bSeesLesson === false);

const bMdView = (await mdb.getAll("mdFiles")).filter((f) => (f as { ownerId?: string }).ownerId === "userB");
check("B 의 마크다운 뷰는 비어 있음(A 노트 안 보임)", bMdView.length === 0);
const aMdView = (await mdb.getAll("mdFiles")).filter((f) => (f as { ownerId?: string }).ownerId === "userA");
check("A 재로그인 시 A 의 노트는 그대로 보임(소실 없음)", aMdView.length === 1);

// ── 4) B 가 새 데이터 작성 → A/B 공존, 충돌 없음 ──
await db.put("notebooks", { id: ownedKey("userB", "ide-project"), cells: [], updatedAt: 2, files: { b: 9 } } as never);
const aProj = (await db.get("notebooks", ownedKey("userA", "ide-project"))) as { files?: Record<string, number> };
const bProj = (await db.get("notebooks", ownedKey("userB", "ide-project"))) as { files?: Record<string, number> };
check("B 작성 후에도 A 데이터 불변(네임스페이스 분리)", aProj?.files?.a === 1 && bProj?.files?.b === 9);

done("C1 namespacing isolation");
