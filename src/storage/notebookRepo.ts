/**
 * 노트북 저장소 CRUD.
 */

import { getDB, type StoredCell, type StoredNotebook } from "./db";

export async function saveNotebook(
  id: string,
  cells: StoredCell[]
): Promise<void> {
  const db = await getDB();
  const record: StoredNotebook = {
    id,
    cells,
    updatedAt: Date.now(),
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
