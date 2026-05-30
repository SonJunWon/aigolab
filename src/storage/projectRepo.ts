/**
 * IDE 프로젝트 저장/로드.
 *
 * IndexedDB의 notebooks 스토어를 재사용하되,
 * key는 "ide-project" 고정 (나중에 멀티 프로젝트 지원 시 확장).
 */

import { getDB } from "./db";
import { ownedKey } from "./localOwner";
import type { FileEntry } from "../store/fileStore";

// 기본 키. 실제 IDB 키는 로그인 사용자별 네임스페이스가 적용된다
// (`usr:<uid>:ide-project`) — 공용 기기 사용자 간 유출 방지(C1).
const PROJECT_KEY = "ide-project";

function projectKey(): string {
  return ownedKey(PROJECT_KEY);
}

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
    id: projectKey(),
    files,
    updatedAt: Date.now(),
  };
  // notebooks store에 저장 (key가 "usr:<uid>:ide-project"라 레슨 노트북과 충돌 없음)
  await db.put("notebooks", record as never);
}

export async function loadProject(): Promise<Record<
  string,
  FileEntry
> | null> {
  const db = await getDB();
  const record = (await db.get("notebooks", projectKey())) as unknown as
    | StoredProject
    | undefined;
  return record?.files ?? null;
}

export async function deleteProject(): Promise<void> {
  const db = await getDB();
  await db.delete("notebooks", projectKey());
}
