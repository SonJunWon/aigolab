/**
 * 일자별 학습 활동 저장/로드 (daily_activity 테이블).
 * - 체류 시간 누적 (study_seconds)
 * - 완료 카운트 누적 (completed_count): 레슨·퀴즈·강의·프로젝트 완료 시 +1
 *
 * 날짜는 KST(UTC+9) 기준. 사용자가 어디서 접속하든 한국 자정 기준으로 스트릭 계산.
 */

import { supabase } from "../lib/supabase";

export interface DailyActivity {
  activity_date: string;   // "YYYY-MM-DD"
  study_seconds: number;
  completed_count: number;
}

// ─── KST 날짜 유틸 ──────────────────────────────────────

/** 주어진 시각의 KST 기준 "YYYY-MM-DD". 인자 없으면 현재. */
export function kstDateString(date: Date = new Date()): string {
  // UTC+9 시각으로 변환 후 날짜 부분만 추출
  const kstMs = date.getTime() + 9 * 60 * 60 * 1000;
  return new Date(kstMs).toISOString().slice(0, 10);
}

/** KST 기준으로 두 "YYYY-MM-DD" 간의 일수 차이 (a - b). */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const aUtc = Date.UTC(ay, am - 1, ad);
  const bUtc = Date.UTC(by, bm - 1, bd);
  return Math.round((aUtc - bUtc) / (24 * 60 * 60 * 1000));
}

/** "YYYY-MM-DD"에 n일을 더한 날짜 문자열. */
export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d) + n * 24 * 60 * 60 * 1000;
  return new Date(utc).toISOString().slice(0, 10);
}

// ─── Supabase API ──────────────────────────────────────

/**
 * 오늘자 학습 시간을 증가시킴 (upsert).
 * 기존 레코드가 있으면 study_seconds += seconds, 없으면 새로 생성.
 */
export async function addStudySeconds(
  userId: string,
  seconds: number
): Promise<void> {
  if (seconds <= 0) return;
  const today = kstDateString();

  // 기존 레코드 조회
  const { data: existing } = await supabase
    .from("daily_activity")
    .select("study_seconds")
    .eq("user_id", userId)
    .eq("activity_date", today)
    .maybeSingle();

  const newSeconds = (existing?.study_seconds ?? 0) + seconds;

  const { error } = await supabase.from("daily_activity").upsert(
    {
      user_id: userId,
      activity_date: today,
      study_seconds: newSeconds,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,activity_date" }
  );
  if (error) {
    console.error("[activity] addStudySeconds error:", error.message);
  }
}

/**
 * 오늘자 완료 카운트를 1 증가 (레슨·퀴즈·강의·프로젝트 완료 시 호출).
 */
export async function incrementCompletedToday(userId: string): Promise<void> {
  const today = kstDateString();

  const { data: existing } = await supabase
    .from("daily_activity")
    .select("completed_count")
    .eq("user_id", userId)
    .eq("activity_date", today)
    .maybeSingle();

  const newCount = (existing?.completed_count ?? 0) + 1;

  const { error } = await supabase.from("daily_activity").upsert(
    {
      user_id: userId,
      activity_date: today,
      completed_count: newCount,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,activity_date" }
  );
  if (error) {
    console.error("[activity] incrementCompletedToday error:", error.message);
  }
}

/**
 * 특정 기간 동안의 일자별 활동 로드 (히트맵, 스트릭 계산용).
 * 기본: 최근 100일.
 */
export async function loadRecentActivity(
  userId: string,
  days = 100
): Promise<DailyActivity[]> {
  const today = kstDateString();
  const from = addDays(today, -(days - 1));

  const { data, error } = await supabase
    .from("daily_activity")
    .select("activity_date, study_seconds, completed_count")
    .eq("user_id", userId)
    .gte("activity_date", from)
    .lte("activity_date", today)
    .order("activity_date", { ascending: false });

  if (error) {
    console.error("[activity] loadRecentActivity error:", error.message);
    return [];
  }
  return (data ?? []) as DailyActivity[];
}

/**
 * 전체 기간 활동 로드 (총 학습 시간 합계용).
 */
export async function loadAllActivity(userId: string): Promise<DailyActivity[]> {
  const { data, error } = await supabase
    .from("daily_activity")
    .select("activity_date, study_seconds, completed_count")
    .eq("user_id", userId)
    .order("activity_date", { ascending: false });

  if (error) {
    console.error("[activity] loadAllActivity error:", error.message);
    return [];
  }
  return (data ?? []) as DailyActivity[];
}

// ─── 스트릭 계산 ──────────────────────────────────────

const MIN_STUDY_SECONDS_FOR_STREAK = 5 * 60; // 5분

/** 하루가 "활동일"로 인정되는 조건: 5분 체류 OR 1개 완료 */
function isActiveDay(a: DailyActivity): boolean {
  return a.study_seconds >= MIN_STUDY_SECONDS_FOR_STREAK || a.completed_count >= 1;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  /** 오늘이 활동일인가 */
  todayActive: boolean;
}

/**
 * 최근 활동 배열(desc 순)로부터 스트릭 계산.
 * - 현재 스트릭: 오늘(또는 어제)부터 역으로 연속된 활동일 수
 * - 최장 스트릭: 전체 기간 중 연속 최대
 */
export function calculateStreak(activity: DailyActivity[]): StreakInfo {
  const activeDays = activity
    .filter(isActiveDay)
    .map((a) => a.activity_date)
    .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)); // desc

  if (activeDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0, todayActive: false };
  }

  const today = kstDateString();
  const yesterday = addDays(today, -1);
  const mostRecent = activeDays[0];
  const todayActive = mostRecent === today;

  // 현재 스트릭: 오늘 또는 어제부터 이어지면 유효
  let currentStreak = 0;
  if (mostRecent === today || mostRecent === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < activeDays.length; i++) {
      const diff = daysBetween(activeDays[i - 1], activeDays[i]);
      if (diff === 1) currentStreak++;
      else break;
    }
  }

  // 최장 스트릭
  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < activeDays.length; i++) {
    const diff = daysBetween(activeDays[i - 1], activeDays[i]);
    if (diff === 1) {
      run++;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 1;
    }
  }

  return { currentStreak, longestStreak, todayActive };
}
