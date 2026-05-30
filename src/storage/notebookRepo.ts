/**
 * 노트북 저장소 CRUD.
 */

import { getDB, type StoredCell, type StoredNotebook } from "./db";
import { ownedKey, ownerId, OWNER_PREFIX } from "./localOwner";

/**
 * lesson 의 모든 셀 source 를 합쳐 짧은 해시로 만든다 (v3.18.5+).
 * 콘텐츠 변경 감지용 — lesson 이 바뀌면 해시도 바뀜.
 *
 * djb2 변형 — 빠르고 짧은 결과 (32-bit hex).
 */
export function computeLessonHash(
  cells: ReadonlyArray<{ type: string; source: string }>
): string {
  const joined = cells.map((c) => `${c.type}:${c.source}`).join("\n\u0000\n");
  let hash = 5381;
  for (let i = 0; i < joined.length; i++) {
    hash = (hash * 33) ^ joined.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export async function saveNotebook(
  id: string,
  cells: StoredCell[],
  lessonHash?: string
): Promise<void> {
  try {
    const db = await Promise.race([
      getDB(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DB_TIMEOUT")), 3000),
      ),
    ]);
    const record: StoredNotebook = {
      // 실제 IDB 키는 사용자별 네임스페이스가 적용됨 (`usr:<uid>:<id>`).
      id: ownedKey(id),
      cells,
      updatedAt: Date.now(),
      ...(lessonHash !== undefined ? { lessonHash } : {}),
    };
    await db.put("notebooks", record);
  } catch (err) {
    console.warn("[saveNotebook] DB 접근 실패, 저장 건너뜀:", err);
  }
}

export async function loadNotebook(
  id: string
): Promise<StoredNotebook | undefined> {
  try {
    const db = await Promise.race([
      getDB(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DB_TIMEOUT")), 3000),
      ),
    ]);
    const record = await db.get("notebooks", ownedKey(id));
    // 반환 객체의 id 는 호출부가 기대하는 원래 논리 id 로 복원.
    return record ? { ...record, id } : undefined;
  } catch (err) {
    console.warn("[loadNotebook] DB 접근 실패, 원본 레슨 사용:", err);
    return undefined;
  }
}

export async function deleteNotebook(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("notebooks", ownedKey(id));
}

/**
 * 현재 소유자의 노트북 논리 id 목록 (네임스페이스 프리픽스 제거).
 */
export async function listNotebookIds(): Promise<string[]> {
  const db = await getDB();
  const keys = (await db.getAllKeys("notebooks")) as string[];
  const prefix = `${OWNER_PREFIX}${ownerId()}:`;
  return keys
    .filter((k) => k.startsWith(prefix))
    .map((k) => k.slice(prefix.length));
}
