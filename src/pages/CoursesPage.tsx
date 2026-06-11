import { Link } from "react-router-dom";
import { COURSE_GROUPS } from "../content/courses/groups";
import { getCourseById } from "../content/courses";

/**
 * AI 강의 메뉴 — 코스 그룹 목록 (/courses).
 * 0. AI 살펴보기(이용 가능) + 1~5. 딥러닝·지식증류·강화학습·양자화·지식증강(준비 중).
 * 그룹 카드 클릭 → /courses/group/:groupId (그룹 내 강의 목록).
 */
export function CoursesPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-12">
        <header className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">📚 AI 강의</h1>
          <p className="text-sm sm:text-base text-brand-textDim">
            AI 이론을 코스별로 — 큰 그림부터 딥러닝·강화학습 같은 심화 주제까지.
          </p>
        </header>

        <div className="space-y-4 sm:space-y-5">
          {COURSE_GROUPS.map((group) => {
            const available = group.status === "available";
            const lessonCount = group.courseIds.filter((id) => getCourseById(id)).length;

            const inner = (
              <>
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                  <div className={`shrink-0 grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${group.color} text-2xl sm:text-3xl ${available ? "" : "grayscale opacity-60"}`}>
                    {group.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-subtle text-brand-textDim font-medium">
                        코스 {group.order}
                      </span>
                      {available ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-green/15 text-brand-green font-semibold">
                          {lessonCount}강 · 이용 가능
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold">
                          준비 중
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg sm:text-xl font-semibold mt-1 transition-colors ${
                      available ? "group-hover:text-brand-primary" : "text-brand-textDim"
                    }`}>
                      {group.title}
                    </h3>
                  </div>
                  <span className={`shrink-0 self-start text-xl transition-all ${
                    available
                      ? "text-brand-textDim group-hover:text-brand-primary group-hover:translate-x-1"
                      : "text-brand-textDim"
                  }`}>
                    {available ? "→" : "🔒"}
                  </span>
                </div>
                <p className="text-sm text-brand-textDim leading-relaxed mb-3">
                  {group.subtitle}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] bg-brand-primary/10 text-brand-primary/90">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            );

            const baseCls = `block p-5 sm:p-6 rounded-2xl border transition-all group ${
              available
                ? "border-brand-subtle bg-brand-panel hover:border-brand-primary/50 hover:shadow-lg hover:shadow-brand-primary/5"
                : "border-dashed border-brand-subtle/70 bg-brand-panel/40 cursor-default"
            }`;

            return available ? (
              <Link key={group.id} to={`/courses/group/${group.id}`} className={baseCls}>
                {inner}
              </Link>
            ) : (
              <div key={group.id} className={baseCls} aria-disabled="true">
                {inner}
              </div>
            );
          })}
        </div>

        {/* 안내 */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-xl border border-dashed border-brand-subtle text-center">
          <p className="text-brand-textDim text-sm">
            💡 <span className="text-brand-primary font-medium">‘AI 살펴보기’</span>로 큰 그림을 먼저 잡아보세요. 딥러닝·강화학습 등 심화 코스는 순차적으로 열립니다.
          </p>
        </div>
      </div>
    </div>
  );
}
