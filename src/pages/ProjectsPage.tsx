import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PROJECTS } from "../content/projects";
import { Markdown } from "../components/Markdown";

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
  const [openId, setOpenId] = useState<string | null>(openFromUrl);

  // URL → state 동기화 (뒤로가기 등)
  useEffect(() => {
    setOpenId(openFromUrl);
  }, [openFromUrl]);

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    // URL 업데이트 (북마크·공유 가능)
    if (next) {
      setSearchParams({ open: next }, { replace: true });
    } else {
      searchParams.delete("open");
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">🧪 AI 프로젝트</h1>
          <p className="text-brand-textDim">
            실제 데이터로 머신러닝 모델을 만들어보세요. 브라우저에서 바로 실행!
          </p>
        </header>

        <div className="space-y-3">
          {PROJECTS.map((p) => {
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
                  className="w-full text-left p-5 flex items-center gap-5 group"
                  aria-expanded={isOpen}
                >
                  <div className="text-4xl shrink-0">{p.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary">
                        {p.difficulty === "beginner" ? "입문" : "중급"}
                      </span>
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-brand-subtle text-brand-textDim"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3
                      className={`text-lg font-semibold transition-colors ${
                        isOpen ? "text-brand-primary" : "group-hover:text-brand-primary"
                      }`}
                    >
                      {p.title}
                    </h3>
                    <p className="text-sm text-brand-textDim">{p.subtitle}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs text-brand-textDim mb-1">
                      약 {p.estimatedMinutes}분
                    </div>
                    <div className="text-[11px] text-brand-textDim">
                      {p.steps.length}단계
                    </div>
                  </div>
                  <div
                    className={`shrink-0 text-xl text-brand-textDim transition-transform ${
                      isOpen ? "rotate-180 text-brand-primary" : ""
                    }`}
                  >
                    ▼
                  </div>
                </button>

                {/* 펼친 본문 — 브리핑 + CTA */}
                {isOpen && (
                  <div className="border-t border-brand-subtle px-5 py-5 bg-brand-bg/40 space-y-5">
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

                    {/* CTA */}
                    <Link
                      to={`/projects/${p.id}/work`}
                      className="block w-full text-center py-3 rounded-xl bg-brand-primary text-white font-medium text-sm hover:bg-brand-primaryDim transition-colors"
                    >
                      🚀 프로젝트 시작하기
                    </Link>
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
