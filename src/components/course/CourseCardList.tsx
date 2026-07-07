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
        {courses.map((course, i) => {
          // pro 콘텐츠인데 접근 권한 없는 경우에만 잠금
          const isPro =
            isCoursePro(course.id) && !canAccessCourse(course.id, entitlements);

          const inner = (
            <div className="grid sm:grid-cols-[70px_1fr_auto] gap-2 sm:gap-6 items-start text-left">
              <span
                className={`font-mono text-sm ${
                  isPro ? "text-amber-400/80" : "text-brand-primary"
                }`}
              >
                {String(i + 1).padStart(2, "0")}.
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {isPro && <ProBadge size="sm" />}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-brand-textDim">
                    {categoryLabel[course.category]} · {levelLabel[course.level]}
                  </span>
                </div>
                <h3 className={`text-base sm:text-lg font-semibold transition-colors ${
                  isPro ? "text-brand-text group-hover:text-amber-400" : "text-brand-text group-hover:text-brand-primary"
                }`}>
                  {course.title}
                </h3>
                {course.subtitle && (
                  <p className="text-sm sm:text-base text-brand-textDim mt-1 leading-snug">
                    {course.subtitle}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right self-center">
                <div className="font-mono text-[11px] text-brand-textDim">
                  {course.estimatedMinutes}min
                </div>
                <span className={`inline-block text-xl mt-1 ${
                  isPro
                    ? "text-amber-400/80"
                    : "text-brand-primary group-hover:translate-x-1.5 transition-transform"
                }`}>
                  {isPro ? "🔒" : "→"}
                </span>
              </div>
            </div>
          );

          const baseCls = `block w-full border border-brand-line p-4 sm:p-6 transition-colors group hover:bg-brand-panel ${
            isPro ? "hover:border-amber-400/60" : "hover:border-brand-primary"
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
