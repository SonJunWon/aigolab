/**
 * 노트북 저장소 CRUD.
 */

import { getDB, type StoredCell, type StoredNotebook } from "./db";

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
  const db = await getDB();
  const record: StoredNotebook = {
    id,
    cells,
    updatedAt: Date.now(),
    ...(lessonHash !== undefined ? { lessonHash } : {}),
  };
  await db.put("notebooks", record);
}

export async function loadNotebook(
  id: string
): Promise<StoredNotebook | undefined> {
  const db = await getDB();
  return db.get("notebooks", id);
}

export async function deleteNotebook(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("notebooks", id);
}

export async function listNotebookIds(): Promise<string[]> {
  const db = await getDB();
  return db.getAllKeys("notebooks");
}
