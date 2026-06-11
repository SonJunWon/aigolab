import { Link } from "react-router-dom";
import type { CourseSummary } from "../../types/course";
import { isCoursePro } from "../../content/tier";
import { canAccessCourse } from "../../content/access";
import { useEntitlements } from "../../hooks/useEntitlements";
import { ProBadge } from "../paywall/ProBadge";
import { usePaywall } from "../paywall/usePaywall";

const levelLabel = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
};

const categoryLabel = {
  "ai-basics": "AI 기초",
  ml: "머신러닝",
  dl: "딥러닝",
  data: "데이터",
};

/**
 * AI 강의 카드 목록 (PRO 잠금 + 페이월 처리 포함).
 * /courses 그룹 메뉴와 /courses/group/:groupId 그룹 상세에서 공용.
 */
export function CourseCardList({ courses }: { courses: CourseSummary[] }) {
  const { showPaywall, modal } = usePaywall();
  const { entitlements } = useEntitlements();

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {courses.map((course) => {
          // pro 콘텐츠인데 접근 권한 없는 경우에만 잠금
          const isPro =
            isCoursePro(course.id) && !canAccessCourse(course.id, entitlements);

          const inner = (
            <div className="flex items-center gap-3 sm:gap-5">
              <div className={`shrink-0 text-3xl sm:text-4xl ${isPro ? "grayscale opacity-70" : ""}`}>
                {course.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  {isPro && <ProBadge size="sm" />}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary font-medium">
                    {categoryLabel[course.category]}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-subtle text-brand-textDim">
                    {levelLabel[course.level]}
                  </span>
                </div>
                <h3 className={`text-base sm:text-lg font-semibold transition-colors ${
                  isPro ? "text-brand-text group-hover:text-amber-400" : "text-brand-text group-hover:text-brand-primary"
                }`}>
                  {course.title}
                </h3>
                {course.subtitle && (
                  <p className="text-xs sm:text-sm text-brand-textDim mt-0.5 leading-snug">
                    {course.subtitle}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[11px] sm:text-xs text-brand-textDim">
                  약 {course.estimatedMinutes}분
                </div>
                <span className={`inline-block text-xl mt-1 transition-all ${
                  isPro
                    ? "text-brand-textDim group-hover:text-amber-400"
                    : "text-brand-textDim group-hover:text-brand-primary group-hover:translate-x-1"
                }`}>
                  {isPro ? "🔒" : "→"}
                </span>
              </div>
            </div>
          );

          const baseCls = `block p-4 sm:p-6 rounded-xl border transition-all group ${
            isPro
              ? "border-brand-subtle/80 bg-brand-panel hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5 text-left w-full"
              : "border-brand-subtle bg-brand-panel hover:border-brand-primary/50 hover:shadow-lg hover:shadow-brand-primary/5"
          }`;

          return isPro ? (
            <button
              key={course.id}
              type="button"
              onClick={() =>
                showPaywall({
                  title: course.title,
                  kind: `AI 강의 · ${categoryLabel[course.category]}`,
                  icon: course.icon,
                })
              }
              className={baseCls}
            >
              {inner}
            </button>
          ) : (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className={baseCls}
            >
              {inner}
            </Link>
          );
        })}
      </div>
      {modal}
    </>
  );
}
