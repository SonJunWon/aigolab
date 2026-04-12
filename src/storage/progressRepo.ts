/**
 * 진도 저장소 CRUD.
 */

import { getDB, type StoredProgress } from "./db";

function progressKey(language: string, track: string): string {
  return `${language}:${track}`;
}

export async function loadProgress(
  language: string,
  track: string
): Promise<StoredProgress | undefined> {
  const db = await getDB();
  return db.get("progress", progressKey(language, track));
}

export async function saveProgress(progress: StoredProgress): Promise<void> {
  const db = await getDB();
  await db.put("progress", progress);
}

/**
 * 레슨을 완료로 표시. 이미 완료돼 있으면 무시.
 */
export async function markLessonCompleted(
  language: string,
  track: string,
  lessonId: string
): Promise<StoredProgress> {
  const db = await getDB();
  const key = progressKey(language, track);
  const existing = await db.get("progress", key);

  const updated: StoredProgress = existing
    ? {
        ...existing,
        completedLessons: existing.completedLessons.includes(lessonId)
          ? existing.completedLessons
          : [...existing.completedLessons, lessonId],
        currentLesson: lessonId,
        lastStudiedAt: Date.now(),
      }
    : {
        id: key,
        language,
        track,
        completedLessons: [lessonId],
        currentLesson: lessonId,
        lastStudiedAt: Date.now(),
      };

  await db.put("progress", updated);
  return updated;
}

/**
 * "현재 보고 있는 레슨"만 업데이트 (완료 표시 없이).
 */
export async function setCurrentLesson(
  language: string,
  track: string,
  lessonId: string
): Promise<void> {
  const db = await getDB();
  const key = progressKey(language, track);
  const existing = await db.get("progress", key);

  const updated: StoredProgress = existing
    ? { ...existing, currentLesson: lessonId, lastStudiedAt: Date.now() }
    : {
        id: key,
        language,
        track,
        completedLessons: [],
        currentLesson: lessonId,
        lastStudiedAt: Date.now(),
      };

  await db.put("progress", updated);
}

export async function resetProgress(
  language: string,
  track: string
): Promise<void> {
  const db = await getDB();
  await db.delete("progress", progressKey(language, track));
}

/**
 * 저장된 모든 진도 항목 가져오기.
 * "이어서 학습" 배너가 가장 최근 항목을 찾을 때 사용.
 */
export async function listAllProgress(): Promise<StoredProgress[]> {
  const db = await getDB();
  return db.getAll("progress");
}
