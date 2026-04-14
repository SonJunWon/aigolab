import { Link } from "react-router-dom";
import { COURSE_SUMMARIES } from "../content/courses";
import { isCoursePro } from "../content/tier";
import { ProBadge } from "../components/paywall/ProBadge";
import { usePaywall } from "../components/paywall/usePaywall";

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

export function CoursesPage() {
  const { showPaywall, modal } = usePaywall();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-12">
        <header className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">📚 AI 강의</h1>
          <p className="text-sm sm:text-base text-brand-textDim">
            AI/머신러닝/딥러닝 이론을 단계별로 배워보세요.
          </p>
        </header>

        <div className="space-y-3 sm:space-y-4">
          {COURSE_SUMMARIES.map((course) => {
            const isPro = isCoursePro(course.id);

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

        {/* 추가 예정 안내 */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-xl border border-dashed border-brand-subtle text-center">
          <p className="text-brand-textDim text-sm">
            💡 일부 강의엔 <span className="text-brand-primary font-medium">브라우저에서 바로 실행되는 Python 실습</span>이 포함돼 있어요. 🔒 표시 강의는 PRO 출시 후 이용 가능합니다.
          </p>
        </div>
      </div>
      {modal}
    </div>
  );
}
