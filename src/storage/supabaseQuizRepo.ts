/**
 * Supabase 퀴즈 결과 + AI 강의 진도 저장/로드.
 */
import { supabase } from "../lib/supabase";

// ─── 퀴즈 결과 ───

export interface QuizResult {
  quiz_id: string;
  score: number;
  total: number;
  completed_at: string;
}

export async function saveQuizResult(
  userId: string, quizId: string, score: number, total: number
): Promise<void> {
  const { error } = await supabase.from("quiz_results").upsert({
    user_id: userId, quiz_id: quizId, score, total,
    completed_at: new Date().toISOString(),
  }, { onConflict: "user_id,quiz_id" });
  if (error) console.error("[supabase] saveQuizResult:", error.message);
}

export async function loadQuizResults(userId: string): Promise<QuizResult[]> {
  const { data, error } = await supabase
    .from("quiz_results").select("quiz_id,score,total,completed_at")
    .eq("user_id", userId);
  if (error) { console.error("[supabase] loadQuizResults:", error.message); return []; }
  return data ?? [];
}

// ─── AI 강의 진도 ───

export interface CourseProgressData {
  course_id: string;
  completed: boolean;
  quiz_score: number | null;
  quiz_total: number | null;
  last_viewed_at: string;
}

export async function saveCourseProgress(
  userId: string, courseId: string, completed: boolean,
  quizScore?: number, quizTotal?: number
): Promise<void> {
  const { error } = await supabase.from("course_progress").upsert({
    user_id: userId, course_id: courseId, completed,
    quiz_score: quizScore ?? null, quiz_total: quizTotal ?? null,
    last_viewed_at: new Date().toISOString(),
  }, { onConflict: "user_id,course_id" });
  if (error) console.error("[supabase] saveCourseProgress:", error.message);
}

export async function loadAllCourseProgress(userId: string): Promise<CourseProgressData[]> {
  const { data, error } = await supabase
    .from("course_progress").select("*").eq("user_id", userId);
  if (error) { console.error("[supabase] loadCourseProgress:", error.message); return []; }
  return (data ?? []).map(d => ({
    course_id: d.course_id, completed: d.completed,
    quiz_score: d.quiz_score, quiz_total: d.quiz_total,
    last_viewed_at: d.last_viewed_at,
  }));
}
