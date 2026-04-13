/**
 * 마이페이지 최근 활동 피드 빌더.
 *
 * 데이터 소스:
 * - quiz_results: 레슨 퀴즈 또는 강의 퀴즈. quiz_id가 lesson.id 또는 course.id
 * - course_progress (completed=true): 강의 수료 이벤트
 *
 * 중복 제거:
 * - 강의 퀴즈를 풀면 quiz_results + course_progress.completed 둘 다 기록됨 → course_progress를 대표로 하고 해당 quiz_result는 스킵
 */

import { getCurriculum } from "../content";
import { getCourseById, COURSES } from "../content/courses";
import { getLanguage, getTrack } from "../content/languages";
import type { Language, Track, Lesson, LessonSummary } from "../types/lesson";
import type { QuizResult, CourseProgressData } from "../storage/supabaseQuizRepo";

export interface FeedItem {
  id: string;              // 고유 키 (React key)
  type: "lesson_quiz" | "course_completed";
  timestamp: string;       // ISO 문자열
  title: string;           // 예: "함수의 기초" / "AI란 무엇인가"
  subtitle?: string;       // 예: "Python 입문 · 8/10"
  icon: string;            // 앞에 붙는 이모지
  link?: string;           // 상세 링크 (클릭 이동)
}

// ─── 레슨 검색 (모든 언어/트랙 순회) ──────────────────────

const LANGUAGES_TO_SEARCH: Language[] = ["python"];
const TRACKS_TO_SEARCH: Track[] = [
  "beginner",
  "intermediate",
  "data-science",
  "ml-practice",
];

interface LessonLocation {
  language: Language;
  track: Track;
  lesson: Lesson | LessonSummary;
}

/** quiz_id가 어느 레슨인지 찾기 (없으면 null) */
function findLessonLocation(lessonId: string): LessonLocation | null {
  for (const lang of LANGUAGES_TO_SEARCH) {
    for (const trk of TRACKS_TO_SEARCH) {
      const c = getCurriculum(lang, trk);
      if (!c) continue;
      const summary = c.summaries.find((s) => s.id === lessonId);
      if (summary) {
        return { language: lang, track: trk, lesson: summary };
      }
    }
  }
  return null;
}

// ─── 피드 빌더 ──────────────────────────────────────────

/**
 * 피드 아이템 목록 생성 (시간 내림차순, 기본 limit=10).
 */
export function buildActivityFeed(
  quizResults: QuizResult[],
  courseProgress: CourseProgressData[],
  limit = 10
): FeedItem[] {
  const items: FeedItem[] = [];

  // 강의 ID 집합 (dedupe용)
  const courseIds = new Set(COURSES.map((c) => c.id));
  const courseCompletedIds = new Set(
    courseProgress.filter((c) => c.completed).map((c) => c.course_id)
  );

  // 1. 퀴즈 결과 → 레슨 퀴즈만 피드에 추가 (강의 퀴즈는 course_progress로 대체)
  for (const q of quizResults) {
    if (courseIds.has(q.quiz_id)) continue; // 강의 퀴즈는 스킵

    const location = findLessonLocation(q.quiz_id);
    if (!location) continue; // 레슨을 못 찾으면 스킵 (구 레슨 ID일 수 있음)

    const lang = getLanguage(location.language);
    const trk = getTrack(location.track);
    const percent = q.total > 0 ? Math.round((q.score / q.total) * 100) : 0;

    items.push({
      id: `quiz:${q.quiz_id}:${q.completed_at}`,
      type: "lesson_quiz",
      timestamp: q.completed_at,
      title: location.lesson.title,
      subtitle: `${lang?.name ?? ""} · ${trk?.name ?? ""} · ${q.score}/${q.total} (${percent}%)`,
      icon: "🎯",
      link: `/coding/learn/${location.language}/${location.track}/${q.quiz_id}`,
    });
  }

  // 2. 강의 수료 → 피드에 추가
  for (const c of courseProgress) {
    if (!c.completed) continue;
    if (!courseCompletedIds.has(c.course_id)) continue;

    const course = getCourseById(c.course_id);
    if (!course) continue;

    const scoreSuffix =
      c.quiz_score !== null && c.quiz_total !== null && c.quiz_total > 0
        ? ` · 퀴즈 ${c.quiz_score}/${c.quiz_total}`
        : "";

    items.push({
      id: `course:${c.course_id}:${c.last_viewed_at}`,
      type: "course_completed",
      timestamp: c.last_viewed_at,
      title: course.title,
      subtitle: `AI 강의 수료${scoreSuffix}`,
      icon: course.icon || "📚",
      link: `/courses/${c.course_id}`,
    });
  }

  // 시간 내림차순 정렬, 상위 N개
  items.sort((a, b) =>
    a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0
  );

  return items.slice(0, limit);
}

// ─── 상대 시간 포맷 ──────────────────────────────────

/**
 * 예: "방금 전", "3분 전", "2시간 전", "5일 전", "2026년 3월 15일"
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 0) return "방금 전"; // 시계 왜곡 대비
  if (diffSec < 60) return "방금 전";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
  if (diffSec < 7 * 86400) return `${Math.floor(diffSec / 86400)}일 전`;

  // 7일 이상은 절대 날짜
  return then.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
