/**
 * Supabase 기반 진도 저장/로드.
 * 로그인한 사용자만 사용. 비로그인 시 기존 IndexedDB 사용.
 */

import { supabase } from "../lib/supabase";

export interface SupabaseProgress {
  language: string;
  track: string;
  completed_lessons: string[];
  current_lesson: string | null;
  last_studied_at: string;
}

/**
 * 특정 트랙의 진도 로드.
 */
export async function loadProgressFromSupabase(
  userId: string,
  language: string,
  track: string
): Promise<SupabaseProgress | null> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("language", language)
    .eq("track", track)
    .limit(1);

  if (error) {
    console.error("[supabase] loadProgress error:", error.message);
    return null;
  }

  const row = data?.[0];
  if (!row) return null;

  return {
    language: row.language,
    track: row.track,
    completed_lessons: row.completed_lessons ?? [],
    current_lesson: row.current_lesson,
    last_studied_at: row.last_studied_at,
  };
}

/**
 * 모든 진도 로드 (이어서 학습 배너용).
 */
export async function loadAllProgressFromSupabase(
  userId: string
): Promise<SupabaseProgress[]> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("[supabase] loadAllProgress error:", error.message);
    return [];
  }
  if (!data) return [];

  return data.map((d) => ({
    language: d.language,
    track: d.track,
    completed_lessons: d.completed_lessons ?? [],
    current_lesson: d.current_lesson,
    last_studied_at: d.last_studied_at,
  }));
}

/**
 * 레슨 완료 기록.
 */
export async function markLessonCompletedInSupabase(
  userId: string,
  language: string,
  track: string,
  lessonId: string
): Promise<void> {
  // 기존 진도 가져오기
  const existing = await loadProgressFromSupabase(userId, language, track);

  if (existing) {
    const completed = existing.completed_lessons.includes(lessonId)
      ? existing.completed_lessons
      : [...existing.completed_lessons, lessonId];

    const { error } = await supabase
      .from("user_progress")
      .update({
        completed_lessons: completed,
        current_lesson: lessonId,
        last_studied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("language", language)
      .eq("track", track);

    if (error) console.error("[supabase] markComplete update error:", error.message);
    else console.log("[supabase] markComplete OK (update)", lessonId);
  } else {
    const { error } = await supabase.from("user_progress").insert({
      user_id: userId,
      language,
      track,
      completed_lessons: [lessonId],
      current_lesson: lessonId,
      last_studied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) console.error("[supabase] markComplete insert error:", error.message);
    else console.log("[supabase] markComplete OK (insert)", lessonId);
  }
}

/**
 * 현재 레슨 업데이트 (완료 표시 없이).
 */
export async function setCurrentLessonInSupabase(
  userId: string,
  language: string,
  track: string,
  lessonId: string
): Promise<void> {
  const existing = await loadProgressFromSupabase(userId, language, track);

  if (existing) {
    await supabase
      .from("user_progress")
      .update({
        current_lesson: lessonId,
        last_studied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("language", language)
      .eq("track", track);
  } else {
    await supabase.from("user_progress").insert({
      user_id: userId,
      language,
      track,
      completed_lessons: [],
      current_lesson: lessonId,
      last_studied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}

/**
 * IDB 진도를 Supabase로 마이그레이션 (첫 로그인 시).
 * 서버에 이미 데이터가 있으면 병합 (더 많은 완료 기록을 유지).
 */
export async function migrateProgressToSupabase(
  userId: string,
  localProgress: Array<{
    language: string;
    track: string;
    completedLessons: string[];
    currentLesson?: string;
    lastStudiedAt: number;
  }>
): Promise<void> {
  for (const local of localProgress) {
    const remote = await loadProgressFromSupabase(
      userId,
      local.language,
      local.track
    );

    // 병합: 두 소스의 완료 목록 합치기
    const mergedCompleted = remote
      ? [
          ...new Set([
            ...remote.completed_lessons,
            ...local.completedLessons,
          ]),
        ]
      : local.completedLessons;

    // 최신 currentLesson 사용
    const localTime = local.lastStudiedAt;
    const remoteTime = remote
      ? new Date(remote.last_studied_at).getTime()
      : 0;
    const currentLesson =
      localTime > remoteTime
        ? local.currentLesson
        : remote?.current_lesson ?? local.currentLesson;

    if (remote) {
      await supabase
        .from("user_progress")
        .update({
          completed_lessons: mergedCompleted,
          current_lesson: currentLesson,
          last_studied_at: new Date(
            Math.max(localTime, remoteTime)
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("language", local.language)
        .eq("track", local.track);
    } else {
      await supabase.from("user_progress").insert({
        user_id: userId,
        language: local.language,
        track: local.track,
        completed_lessons: mergedCompleted,
        current_lesson: currentLesson,
        last_studied_at: new Date(localTime).toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }
}
