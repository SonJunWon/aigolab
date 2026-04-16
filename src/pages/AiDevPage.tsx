/**
 * AI 앱 개발 코너 랜딩 페이지.
 *
 * 두 섹션:
 *   1. AI 엔지니어링 트랙 (12강 커리큘럼)
 *   2. 바이브코딩 워크샵 (실전 빌드)
 */

import { Link } from "react-router-dom";

export function AiDevPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">
            <span className="text-4xl mr-2">🚀</span>
            AI 앱 개발
          </h1>
          <p className="text-base text-brand-textDim">
            AI 이론을 넘어 — 직접 만들고, 실행하고, 완성하는 공간
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI 엔지니어링 트랙 → 커리큘럼 직접 이동 */}
          <Link
            to="/coding/learn/ai-engineering/beginner"
            className="group p-8 rounded-2xl border border-brand-subtle bg-brand-panel/80
                       hover:border-brand-primary/60 hover:shadow-lg hover:shadow-brand-primary/10 transition-all"
          >
            <div className="text-4xl mb-4">🤖</div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold group-hover:text-brand-primary transition-colors">
                AI 엔지니어링 트랙
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-green text-white font-semibold">
                12강 완성
              </span>
            </div>
            <p className="text-sm text-brand-textDim mb-4 leading-relaxed">
              프롬프트 · 구조화 출력 · CoT · Tool Calling · 에이전트 · RAG 까지.
              무료 API 키만으로 12강 체계적 커리큘럼.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-brand-textDim">
              <span>🦙 WebLLM</span>
              <span>✨ Gemini</span>
              <span>⚡ Groq</span>
              <span>🔍 RAG</span>
              <span>🤖 Agent</span>
            </div>
            <div className="mt-4 text-xs text-brand-textDim">
              📖 12강 · ⏱️ ~8시간 · 📝 60+ 퀴즈
            </div>
          </Link>

          {/* 바이브코딩 워크샵 → 전용 목록 페이지 */}
          <Link
            to="/ai-dev/workshop"
            className="group p-8 rounded-2xl border border-brand-subtle bg-brand-panel/80
                       hover:border-brand-accent/60 hover:shadow-lg hover:shadow-brand-accent/10 transition-all"
          >
            <div className="text-4xl mb-4">🛠️</div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold group-hover:text-brand-accent transition-colors">
                바이브코딩 워크샵
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-accent text-white font-semibold">
                NEW
              </span>
            </div>
            <p className="text-sm text-brand-textDim mb-4 leading-relaxed">
              마크다운 레시피 파일 + AI 코딩 도구 = 완성도 있는 프로그램.
              코딩 경험 없어도 글을 쓸 수 있으면 앱을 만들 수 있어요.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-brand-textDim">
              <span>💻 Claude Code</span>
              <span>🖱️ Cursor</span>
              <span>📄 MD 레시피</span>
              <span>🆓 무료 API</span>
            </div>
            <div className="mt-4 text-xs text-brand-textDim">
              🛠️ W00: 내 컴퓨터를 AI 작업실로 · 이후 워크샵 추가 예정
            </div>
          </Link>
        </div>

        {/* 학습 로드맵 */}
        <div className="mt-16 text-center">
          <h3 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-4">
            추천 순서
          </h3>
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
            {[
              { label: "12강 커리큘럼", icon: "🤖", desc: "개념·기법 학습" },
              { label: "→" },
              { label: "바이브코딩 워크샵", icon: "🛠️", desc: "실전 앱 제작" },
            ].map((item, i) =>
              item.icon ? (
                <div
                  key={i}
                  className="px-4 py-2 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-text"
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                  <div className="text-[10px] text-brand-textDim">{item.desc}</div>
                </div>
              ) : (
                <span key={i} className="text-brand-textDim text-lg">
                  {item.label}
                </span>
              ),
            )}
          </div>
          <p className="mt-4 text-xs text-brand-textDim">
            12강으로 기법을 배우고 → 워크샵에서 실제 앱으로 조립. 또는 바로 워크샵부터 시작해도 OK.
          </p>
        </div>
      </div>
    </div>
  );
}
