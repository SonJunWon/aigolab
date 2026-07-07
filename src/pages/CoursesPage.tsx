import { Link } from "react-router-dom";
import { COURSE_GROUPS } from "../content/courses/groups";
import { getCourseById } from "../content/courses";

/**
 * AI 강의 메뉴 — 코스 그룹 목록 (/courses).
 * 0. AI 살펴보기(이용 가능) + 1~5. 딥러닝·지식증류·강화학습·양자화·지식증강(준비 중).
 * 그룹 카드 클릭 → /courses/group/:groupId (그룹 내 강의 목록).
 * 에디토리얼 다크 스타일 — 넘버링 행 + 헤어라인 리스트.
 */
export function CoursesPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16">
        <header className="mb-10 sm:mb-14">
          <div className="flex items-baseline justify-between pb-4 border-b border-brand-line mb-6">
            <span className="mono-label">COURSES / 00–05</span>
            <span className="mono-label hidden sm:inline">THEORY · QUIZ</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
            AI 강의<span className="text-brand-primary">.</span>
          </h1>
          <p className="text-base sm:text-lg text-brand-textDim max-w-2xl">
            AI 이론을 코스별로 — 큰 그림부터 딥러닝·강화학습 같은 심화 주제까지.
          </p>
        </header>

        <div className="space-y-4">
          {COURSE_GROUPS.map((group) => {
            const available = group.status === "available";
            const lessonCount = group.courseIds.filter((id) => getCourseById(id)).length;
            const numLabel = String(group.order).padStart(3, "0") + ".";

            const inner = (
              <div className="grid sm:grid-cols-[90px_1fr_auto] gap-2 sm:gap-8">
                <span
                  className={`font-mono text-sm ${
                    available ? "text-brand-primary" : "text-brand-textDim/60"
                  }`}
                >
                  {numLabel}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3
                      className={`text-xl sm:text-2xl font-bold transition-colors ${
                        available
                          ? "group-hover:text-brand-primary"
                          : "text-brand-textDim"
                      }`}
                    >
                      {group.title}
                    </h3>
                    {available ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-brand-primary border border-brand-primary/40 px-2 py-0.5">
                        {lessonCount}강 · 이용 가능
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-brand-textDim border border-brand-subtle px-2 py-0.5">
                        준비 중
                      </span>
                    )}
                  </div>
                  <p className="text-base text-brand-textDim leading-relaxed mb-3 max-w-2xl">
                    {group.subtitle}
                  </p>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-brand-textDim">
                    {group.tags.join("  ·  ")}
                  </div>
                </div>
                <span
                  className={`hidden sm:block self-center text-xl ${
                    available
                      ? "text-brand-primary group-hover:translate-x-1.5 transition-transform"
                      : "text-brand-textDim/40"
                  }`}
                >
                  {available ? "→" : "×"}
                </span>
              </div>
            );

            return available ? (
              <Link
                key={group.id}
                to={`/courses/group/${group.id}`}
                className="group block border border-brand-line p-5 sm:p-7
                           hover:bg-brand-panel hover:border-brand-primary transition-colors"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={group.id}
                className="block border border-dashed border-brand-line/40 p-5 sm:p-7 opacity-60"
                aria-disabled="true"
              >
                {inner}
              </div>
            );
          })}
        </div>

        {/* 안내 */}
        <div className="mt-10 sm:mt-14 flex items-baseline gap-4">
          <span className="mono-label shrink-0">NOTE</span>
          <p className="text-base text-brand-textDim">
            <span className="text-brand-primary font-medium">‘AI 살펴보기’</span>로 큰 그림을 먼저
            잡아보세요. 딥러닝·강화학습 등 심화 코스는 순차적으로 열립니다.
          </p>
        </div>
      </div>
    </div>
  );
}
