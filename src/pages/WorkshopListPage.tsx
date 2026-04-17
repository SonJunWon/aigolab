/**
 * 바이브코딩 워크샵 목록 페이지 — /ai-dev/workshop
 */

import { Link } from "react-router-dom";
import { WORKSHOP_LESSONS } from "../content/ai-engineering/workshops";

export function WorkshopListPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* 헤더 */}
        <div className="mb-2">
          <Link
            to="/ai-dev"
            className="text-sm text-brand-textDim hover:text-brand-accent transition-colors"
          >
            ← AI 앱 개발
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="text-4xl">🛠️</div>
          <div>
            <h1 className="text-2xl font-bold">바이브코딩 워크샵</h1>
            <p className="text-sm text-brand-textDim">
              MD 레시피 + AI 코딩 도구 = 완성도 있는 프로그램
            </p>
          </div>
        </div>

        <div className="mb-10 text-xs text-brand-textDim">
          💡 코딩 경험 없어도 OK — 글을 쓸 수 있으면 앱을 만들 수 있어요.
        </div>

        {/* 워크샵 목록 */}
        <div className="space-y-4">
          {WORKSHOP_LESSONS.map((lesson, idx) => (
            <Link
              key={lesson.id}
              to={`/coding/learn/ai-engineering/beginner/${lesson.id}`}
              className="group block p-6 rounded-xl border border-brand-subtle bg-brand-panel/80
                         hover:border-brand-accent/60 hover:shadow-lg hover:shadow-brand-accent/5 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-brand-accent/15 flex items-center justify-center text-sm font-bold text-brand-accent">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-brand-text group-hover:text-brand-accent transition-colors truncate">
                      {lesson.title}
                    </h3>
                    {lesson.subtitle && (
                      <p className="text-xs text-brand-textDim truncate mt-0.5">
                        {lesson.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 text-xs text-brand-textDim">
                  <span>약 {lesson.estimatedMinutes}분</span>
                  <span className="text-brand-textDim group-hover:text-brand-accent transition-colors">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 총 워크샵 수 안내 */}
        <div className="mt-8 p-6 rounded-xl border border-dashed border-brand-subtle text-center">
          <p className="text-sm text-brand-textDim">
            총 {WORKSHOP_LESSONS.length}개 워크샵 — 기초부터 SaaS 런칭까지 단계별로 도전해보세요
          </p>
        </div>
      </div>
    </div>
  );
}
