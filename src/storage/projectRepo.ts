/**
 * IDE 프로젝트 저장/로드.
 *
 * IndexedDB의 notebooks 스토어를 재사용하되,
 * key는 "ide-project" 고정 (나중에 멀티 프로젝트 지원 시 확장).
 */

import { getDB } from "./db";
import type { FileEntry } from "../store/fileStore";

const PROJECT_KEY = "ide-project";

interface StoredProject {
  id: string;
  files: Record<string, { name: string; content: string; language: string }>;
  updatedAt: number;
}

export async function saveProject(
  files: Record<string, FileEntry>
): Promise<void> {
  const db = await getDB();
  const record: StoredProject = {
    id: PROJECT_KEY,
    files,
    updatedAt: Date.now(),
  };
  // notebooks store에 저장 (key가 "ide-project"라 레슨 노트북과 충돌 없음)
  await db.put("notebooks", record as never);
}

export async function loadProject(): Promise<Record<
  string,
  FileEntry
> | null> {
  const db = await getDB();
  const record = (await db.get("notebooks", PROJECT_KEY)) as unknown as
    | StoredProject
    | undefined;
  return record?.files ?? null;
}

export async function deleteProject(): Promise<void> {
  const db = await getDB();
  await db.delete("notebooks", PROJECT_KEY);
}
