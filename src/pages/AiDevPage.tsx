/**
 * AI 앱 개발 코너 랜딩 페이지 — /ai-dev
 *
 * 히어로 + 두 트랙(12강, 워크샵) + 학습 로드맵 + 앱 갤러리
 */

import { Link } from "react-router-dom";
import { useProgressStore } from "../store/progressStore";
import { WORKSHOP_LESSONS } from "../content/ai-engineering/workshops";

/* ─── 워크샵 앱 갤러리 ─── */
const APP_GALLERY = [
  { icon: "🤖", name: "AI 챗봇", ws: "W01" },
  { icon: "📄", name: "문서 Q&A", ws: "W02" },
  { icon: "🌐", name: "번역기", ws: "W03" },
  { icon: "🎥", name: "유튜브 기획", ws: "W04" },
  { icon: "📝", name: "자막 생성", ws: "W05" },
  { icon: "🖼️", name: "이미지 분석", ws: "W06" },
  { icon: "🎬", name: "숏폼 메이커", ws: "W07" },
  { icon: "✍️", name: "블로그 작성", ws: "W08" },
  { icon: "📊", name: "감정 분석", ws: "W09" },
  { icon: "📧", name: "이메일 비서", ws: "W10" },
  { icon: "🎴", name: "학습 카드", ws: "W11" },
  { icon: "🚀", name: "AI SaaS", ws: "W12" },
  { icon: "🎨", name: "썸네일", ws: "W26" },
  { icon: "⚡", name: "워크플로우", ws: "W31" },
  { icon: "🏗️", name: "노코드 빌더", ws: "W38" },
  { icon: "🦄", name: "스타트업", ws: "W40" },
];

export function AiDevPage() {
  const isCompleted = useProgressStore((s) => s.isCompleted);
  const workshopDone = WORKSHOP_LESSONS.filter((l) =>
    isCompleted("ai-engineering", "beginner", l.id)
  ).length;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">

        {/* ─── 히어로 ─── */}
        <section className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-xs text-brand-accent font-medium mb-4">
            42개 워크샵 · 8단계 · 무료 API
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-4xl sm:text-5xl mr-2">🚀</span>
            AI 앱 개발
          </h1>
          <p className="text-base sm:text-lg text-brand-textDim mb-6 max-w-xl mx-auto">
            AI 이론을 넘어 — 직접 만들고, 실행하고, 배포하는 공간.
            <br className="hidden sm:block" />
            코딩 경험 없어도, 글을 쓸 수 있으면 앱을 만들 수 있어요.
          </p>

          {/* CTA 제거 — 아래 트랙 카드가 직접 진입점 역할 */}
        </section>

        {/* ─── 두 트랙 ─── */}
        <section className="mb-12 sm:mb-16">
          <div className="grid md:grid-cols-2 gap-5">
            {/* AI 엔지니어링 트랙 */}
            <Link
              to="/coding/learn/ai-engineering/beginner"
              className="group p-6 sm:p-8 rounded-2xl border border-brand-subtle bg-gradient-to-br from-violet-500/8 to-brand-panel/80
                         hover:border-brand-primary/60 hover:shadow-lg hover:shadow-brand-primary/10 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl sm:text-4xl">🤖</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-semibold group-hover:text-brand-primary transition-colors">
                      AI 엔지니어링 트랙
                    </h2>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-green text-white font-semibold">
                      12강
                    </span>
                  </div>
                  <p className="text-xs text-brand-textDim">개념과 기법을 체계적으로</p>
                </div>
              </div>
              <p className="text-sm text-brand-textDim mb-4 leading-relaxed">
                프롬프트 · 구조화 출력 · CoT · Tool Calling · 에이전트 · RAG.
                무료 API 키만으로 12강 체계적 커리큘럼.
              </p>
              <div className="flex flex-wrap gap-2">
                {["WebLLM", "Gemini", "Groq", "RAG", "Agent"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] bg-violet-500/10 text-violet-300">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-xs text-brand-textDim">
                📖 12강 · ⏱️ ~8시간 · 📝 60+ 퀴즈
              </div>
            </Link>

            {/* 바이브코딩 워크샵 */}
            <Link
              to="/ai-dev/workshop"
              className="group p-6 sm:p-8 rounded-2xl border border-brand-subtle bg-gradient-to-br from-cyan-500/8 to-brand-panel/80
                         hover:border-brand-accent/60 hover:shadow-lg hover:shadow-brand-accent/10 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl sm:text-4xl">🛠️</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-semibold group-hover:text-brand-accent transition-colors">
                      바이브코딩 워크샵
                    </h2>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-accent text-white font-semibold">
                      42개
                    </span>
                  </div>
                  <p className="text-xs text-brand-textDim">실전 앱을 직접 만들기</p>
                </div>
              </div>
              <p className="text-sm text-brand-textDim mb-4 leading-relaxed">
                MD 레시피 + AI 코딩 도구 = 완성도 있는 프로그램.
                기초부터 SaaS 런칭까지 8단계 학습 곡선.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Claude Code", "Cursor", "MD 레시피", "Supabase", "Vercel"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] bg-cyan-500/10 text-cyan-300">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-brand-textDim">
                <span>🛠️ {WORKSHOP_LESSONS.length}개 워크샵</span>
                <span>·</span>
                <span>✅ {workshopDone}개 완료</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ─── 만들 수 있는 앱 갤러리 ─── */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-2 text-center">
            워크샵에서 만드는 앱들
          </h2>
          <p className="text-xs text-brand-textDim text-center mb-6">
            42개 워크샵 · 기초 챗봇부터 SaaS 런칭까지
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {APP_GALLERY.map((app) => (
              <div
                key={app.ws}
                className="text-center p-3 rounded-xl border border-brand-subtle/40 bg-brand-panel/30
                           hover:border-brand-accent/30 transition-all"
              >
                <div className="text-2xl mb-1">{app.icon}</div>
                <div className="text-[10px] font-medium truncate">{app.name}</div>
                <div className="text-[9px] text-brand-textDim">{app.ws}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 학습 로드맵 ─── */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-6 text-center">
            추천 순서
          </h2>
          <div className="max-w-lg mx-auto space-y-3">
            {[
              { icon: "🤖", label: "12강 커리큘럼", desc: "AI 개념·기법 학습", color: "border-violet-500/30 bg-violet-500/5" },
              { icon: "🛠️", label: "바이브코딩 워크샵", desc: "실전 앱 42개 제작", color: "border-cyan-500/30 bg-cyan-500/5" },
            ].map((item, i) => (
              <div key={i}>
                <div className={`flex items-center gap-4 p-4 rounded-xl border ${item.color}`}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-brand-textDim">{item.desc}</div>
                  </div>
                  <span className="ml-auto text-xs text-brand-textDim">Step {i + 1}</span>
                </div>
                {i === 0 && (
                  <div className="flex justify-center py-1">
                    <span className="text-brand-textDim text-sm">↓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-brand-textDim text-center">
            12강으로 기법을 배우고 → 워크샵에서 실제 앱으로 조립. 또는 바로 워크샵부터 시작해도 OK.
          </p>
        </section>

        {/* ─── 진도 대시보드 링크 ─── */}
        <section className="mb-12 sm:mb-16">
          <Link
            to="/ai-dev/progress"
            className="group block p-5 sm:p-6 rounded-xl border border-brand-subtle bg-brand-panel/60
                       hover:border-brand-accent/40 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="text-base font-semibold group-hover:text-brand-accent transition-colors">
                    학습 진도 대시보드
                  </div>
                  <div className="text-xs text-brand-textDim">
                    Phase별 완료 현황과 다음 추천 워크샵 확인
                  </div>
                </div>
              </div>
              <span className="text-brand-textDim group-hover:text-brand-accent group-hover:translate-x-1 transition-all text-lg">→</span>
            </div>
          </Link>
        </section>

      </div>
    </div>
  );
}
