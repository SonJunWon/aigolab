import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getCourseById } from "../content/courses";
import { Markdown } from "../components/Markdown";
import { QuizPanel } from "../components/quiz/QuizPanel";
import { InlineCodeRunner } from "../components/course/InlineCodeRunner";
import { useAuthStore } from "../store/authStore";
import { saveCourseProgress } from "../storage/supabaseQuizRepo";
import { useStudyTimeTracking } from "../hooks/useStudyTimeTracking";
import { useEntitlements } from "../hooks/useEntitlements";
import { canAccessCourse } from "../content/access";
import { LockedContentScreen } from "../components/paywall/LockedContentScreen";
import type { CourseSection } from "../types/course";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getCourseById(courseId) : undefined;

  const user = useAuthStore((s) => s.user);

  // 접근 권한 — PRO 강의 URL 직접 입력 시 하드 잠금
  const { entitlements, loading: entitlementsLoading } = useEntitlements();

  // 강의 열람 기록 저장
  useEffect(() => {
    if (user && course) {
      void saveCourseProgress(user.id, course.id, false);
    }
  }, [user, course]);

  // 학습 시간 추적
  useStudyTimeTracking(!!course);

  if (!course) return <Navigate to="/courses" replace />;

  // PRO 강의 접근 제어 — URL 직접 입력 우회 차단
  if (!entitlementsLoading && !canAccessCourse(course.id, entitlements)) {
    return (
      <LockedContentScreen
        icon={course.icon}
        title={course.title}
        kind="AI 강의"
        backTo="/courses"
        backLabel="← 강의 목록"
      />
    );
  }

  const nextCourse = course.nextCourseId
    ? getCourseById(course.nextCourseId)
    : null;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-12">
        {/* 상단 네비 */}
        <nav className="mb-5 sm:mb-8">
          <Link
            to="/courses"
            className="text-sm text-brand-textDim hover:text-brand-primary transition-colors"
          >
            ← 강의 목록
          </Link>
        </nav>

        {/* 헤더 */}
        <header className="mb-7 sm:mb-10">
          <div className="flex items-start gap-2.5 sm:items-center sm:gap-3 mb-3">
            <span className="text-3xl sm:text-4xl shrink-0">{course.icon}</span>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-text leading-tight">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-sm sm:text-base text-brand-textDim mt-1">{course.subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-brand-textDim">
            <span>⏱ 약 {course.estimatedMinutes}분</span>
            <span>📖 {course.sections.length}개 섹션</span>
            {course.quiz && (
              <span>📝 퀴즈 {course.quiz.questions.length}문제</span>
            )}
          </div>
        </header>

        {/* 섹션들 */}
        <div className="space-y-6 sm:space-y-8">
          {course.sections.map((section, i) => (
            <SectionRenderer key={i} section={section} index={i} />
          ))}
        </div>

        {/* 퀴즈 */}
        {course.quiz && (
          <div className="mt-12">
            <QuizPanel
              key={course.id}
              quiz={course.quiz}
              quizId={course.id}
              onComplete={(score, total) => {
                if (user) {
                  void saveCourseProgress(user.id, course.id, true, score, total);
                }
              }}
              onNext={
                nextCourse
                  ? () => {
                      window.location.href = `/courses/${nextCourse.id}`;
                    }
                  : undefined
              }
            />
          </div>
        )}

        {/* 다음 강의 */}
        {nextCourse && (
          <div className="mt-8 sm:mt-10">
            <Link
              to={`/courses/${nextCourse.id}`}
              className="block p-4 sm:p-5 rounded-xl border border-brand-subtle bg-brand-panel
                         hover:border-brand-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl shrink-0">{nextCourse.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-brand-textDim mb-1">
                    다음 강의
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold group-hover:text-brand-primary transition-colors truncate">
                    {nextCourse.title}
                  </h3>
                </div>
                <span className="text-brand-primary text-xl group-hover:translate-x-1 transition-transform shrink-0">
                  →
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* 하단 */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-brand-subtle text-center">
          <Link
            to="/courses"
            className="text-sm text-brand-textDim hover:text-brand-primary transition-colors"
          >
            ← 강의 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 섹션 렌더러
// ─────────────────────────────────────────────────────────

function SectionRenderer({
  section,
}: {
  section: CourseSection;
  index: number;
}) {
  switch (section.type) {
    case "text":
      return <TextSection section={section} />;
    case "video":
      return <VideoSection section={section} />;
    case "link":
      return <LinkSection section={section} />;
    case "code":
      return <CodeSection section={section} />;
    default:
      return <TextSection section={section} />;
  }
}

function CodeSection({ section }: { section: CourseSection }) {
  return (
    <section>
      {section.title && (
        <h2 className="text-xl font-semibold text-brand-text mb-4">
          {section.title}
        </h2>
      )}
      {section.content && (
        <div className="mb-4">
          <Markdown content={section.content} />
        </div>
      )}
      <InlineCodeRunner
        initialCode={section.code ?? ""}
        language={section.codeLanguage ?? "python"}
        hint={section.codeHint}
      />
    </section>
  );
}

function TextSection({ section }: { section: CourseSection }) {
  return (
    <section>
      {section.title && (
        <h2 className="text-xl font-semibold text-brand-text mb-4">
          {section.title}
        </h2>
      )}
      <Markdown content={section.content} />
    </section>
  );
}

function VideoSection({ section }: { section: CourseSection }) {
  return (
    <section>
      {section.title && (
        <h2 className="text-xl font-semibold text-brand-text mb-4">
          {section.title}
        </h2>
      )}
      {section.content && (
        <p className="text-sm text-brand-textDim mb-4">{section.content}</p>
      )}
      {section.videoUrl && (
        <div className="relative w-full rounded-xl overflow-hidden border border-brand-subtle"
             style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={section.videoUrl}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={section.title ?? "영상"}
          />
        </div>
      )}
    </section>
  );
}

function LinkSection({ section }: { section: CourseSection }) {
  return (
    <section>
      {section.title && (
        <h2 className="text-xl font-semibold text-brand-text mb-4">
          {section.title}
        </h2>
      )}
      {section.content && (
        <p className="text-sm text-brand-textDim mb-3">{section.content}</p>
      )}
      {section.linkUrl && (
        <a
          href={section.linkUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-brand-subtle bg-brand-panel
                     hover:border-brand-accent/50 hover:shadow-lg transition-all group"
        >
          <span className="text-lg">🔗</span>
          <span className="text-sm text-brand-accent group-hover:underline">
            {section.linkLabel ?? section.linkUrl}
          </span>
          <span className="text-brand-textDim group-hover:translate-x-1 transition-transform">
            ↗
          </span>
        </a>
      )}
    </section>
  );
}
