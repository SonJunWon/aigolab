import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PROJECTS, type ProjectCategory } from "../content/projects";
import { Markdown } from "../components/Markdown";

const CATEGORIES: { id: ProjectCategory | "all"; label: string; icon: string }[] = [
  { id: "all",             label: "전체",        icon: "🧪" },
  { id: "classification",  label: "분류",        icon: "🏷️" },
  { id: "nlp",             label: "NLP",         icon: "💬" },
  { id: "unsupervised",    label: "추천·군집",   icon: "🎯" },
  { id: "timeseries",      label: "시계열",      icon: "📈" },
  { id: "anomaly",         label: "이상 탐지",   icon: "🔍" },
  { id: "generative",      label: "생성 모델",   icon: "✨" },
  { id: "data-analysis",   label: "데이터 분석", icon: "📊" },
];

/**
 * AI 프로젝트 목록 — 아코디언 방식.
 *
 * - 한 번에 하나의 프로젝트만 펼침
 * - URL 쿼리 `?open=:id` 로 특정 프로젝트 펼쳐진 상태 접근 가능
 * - 펼친 카드: 설명 + "🚀 프로젝트 시작하기" CTA → /projects/:id/work
 */
export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const openFromUrl = searchParams.get("open");
  const catFromUrl = (searchParams.get("cat") || "all") as ProjectCategory | "all";
  const [openId, setOpenId] = useState<string | null>(openFromUrl);
  const [activeCat, setActiveCat] = useState<ProjectCategory | "all">(catFromUrl);

  // URL → state 동기화 (뒤로가기 등)
  useEffect(() => {
    setOpenId(openFromUrl);
  }, [openFromUrl]);
  useEffect(() => {
    setActiveCat(catFromUrl);
  }, [catFromUrl]);

  // 카테고리 필터 적용
  const visibleProjects = useMemo(() => {
    if (activeCat === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeCat);
  }, [activeCat]);

  // 카테고리별 프로젝트 수 (배지 표시용)
  const countsByCat = useMemo(() => {
    const map: Record<string, number> = { all: PROJECTS.length };
    for (const p of PROJECTS) {
      if (p.category) map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, []);

  const selectCategory = (cat: ProjectCategory | "all") => {
    setActiveCat(cat);
    const next = new URLSearchParams(searchParams);
    if (cat === "all") next.delete("cat");
    else next.set("cat", cat);
    setSearchParams(next, { replace: true });
  };

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    // URL 업데이트 — 기존 파라미터(cat 등) 유지하며 open 만 토글
    const nextParams = new URLSearchParams(searchParams);
    if (next) {
      nextParams.set("open", next);
    } else {
      nextParams.delete("open");
    }
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-12">
        <header className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">🧪 AI 프로젝트</h1>
          <p className="text-sm sm:text-base text-brand-textDim">
            실제 데이터로 머신러닝 모델을 만들어보세요. 브라우저에서 바로 실행!
          </p>
        </header>

        {/* 카테고리 필터 — 모바일은 가로 스크롤, 데스크탑은 wrap */}
        <div
          className="mb-5 sm:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:flex-wrap gap-2 overflow-x-auto sm:overflow-visible scrollbar-hide snap-x snap-mandatory"
          role="tablist"
          aria-label="카테고리 필터"
        >
          {CATEGORIES.map((c) => {
            const count = countsByCat[c.id] ?? 0;
            const isActive = activeCat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => selectCategory(c.id)}
                disabled={count === 0}
                role="tab"
                aria-selected={isActive}
                className={`shrink-0 snap-start text-xs px-3 py-2 sm:py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-brand-primary bg-brand-primary/15 text-brand-primary"
                    : "border-brand-subtle text-brand-textDim hover:text-brand-text hover:border-brand-primary/50"
                } ${count === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {c.icon} {c.label}
                <span className="ml-1 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {visibleProjects.length === 0 && (
            <div className="text-center py-12 text-brand-textDim text-sm border border-dashed border-brand-subtle rounded-xl">
              이 카테고리에는 아직 프로젝트가 없어요.
            </div>
          )}
          {visibleProjects.map((p) => {
            const isOpen = openId === p.id;
            return (
              <div
                key={p.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  isOpen
                    ? "border-brand-primary/50 bg-brand-panel shadow-lg shadow-brand-primary/5"
                    : "border-brand-subtle bg-brand-panel hover:border-brand-primary/30"
                }`}
              >
                {/* 헤더 — 클릭 시 아코디언 토글 */}
                <button
                  onClick={() => toggle(p.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center gap-3 sm:gap-5 group"
                  aria-expanded={isOpen}
                >
                  <div className="text-3xl sm:text-4xl shrink-0">{p.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary">
                        {p.difficulty === "beginner" ? "입문" : "중급"}
                      </span>
                      {/* 모바일: 태그 2개만 보여주기 */}
                      {p.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-brand-subtle text-brand-textDim"
                        >
                          {t}
                        </span>
                      ))}
                      {p.tags.length > 2 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-subtle text-brand-textDim hidden sm:inline-block">
                          +{p.tags.length - 2}
                        </span>
                      )}
                      {/* 모바일: 약 X분·N단계 를 tag 줄에 인라인으로 */}
                      <span className="sm:hidden text-[10px] text-brand-textDim ml-auto shrink-0">
                        ⏱ {p.estimatedMinutes}분 · {p.steps.length}단계
                      </span>
                    </div>
                    <h3
                      className={`text-base sm:text-lg font-semibold transition-colors leading-snug ${
                        isOpen ? "text-brand-primary" : "group-hover:text-brand-primary"
                      }`}
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-textDim leading-snug mt-0.5">{p.subtitle}</p>
                  </div>
                  {/* 데스크탑 전용: 시간/단계 우측 메타 */}
                  <div className="shrink-0 text-right hidden sm:block">
                    <div className="text-xs text-brand-textDim mb-1">
                      약 {p.estimatedMinutes}분
                    </div>
                    <div className="text-[11px] text-brand-textDim">
                      {p.steps.length}단계
                    </div>
                  </div>
                  <div
                    className={`shrink-0 text-lg sm:text-xl text-brand-textDim transition-transform ${
                      isOpen ? "rotate-180 text-brand-primary" : ""
                    }`}
                  >
                    ▼
                  </div>
                </button>

                {/* 펼친 본문 — 상단 CTA + 브리핑 */}
                {isOpen && (
                  <div className="border-t border-brand-subtle px-4 sm:px-5 py-4 sm:py-5 bg-brand-bg/40 space-y-4 sm:space-y-5">
                    {/* 🚀 CTA — 펼친 후 즉시 보이도록 맨 위 */}
                    <Link
                      to={`/projects/${p.id}/work`}
                      className="block w-full text-center py-3.5 rounded-xl bg-brand-primary text-white font-medium text-sm hover:bg-brand-primaryDim transition-colors shadow-lg shadow-brand-primary/20"
                    >
                      🚀 프로젝트 시작하기
                    </Link>

                    {/* 설명 마크다운 */}
                    <div className="prose prose-invert max-w-none">
                      <Markdown content={p.description} />
                    </div>

                    {/* 단계 미리보기 (제목만) */}
                    <div>
                      <div className="text-xs text-brand-textDim uppercase tracking-wider mb-2">
                        📋 단계 개요
                      </div>
                      <ol className="space-y-1.5 text-sm">
                        {p.steps.map((s, i) => {
                          const title = typeof s === "string" ? s : s.title;
                          return (
                            <li key={i} className="flex items-start gap-2">
                              <span className="shrink-0 w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-medium flex items-center justify-center mt-0.5">
                                {i + 1}
                              </span>
                              <span className="text-brand-text">{title}</span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 하단 안내 */}
        <div className="mt-10 p-5 rounded-xl border border-dashed border-brand-subtle text-center">
          <p className="text-brand-textDim text-sm">
            💡 프로젝트 시작 시 <strong className="text-brand-text">IDE</strong>가 열리고{" "}
            <strong className="text-brand-text">우측 가이드 패널</strong>에서 단계별로 따라갈 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
}
