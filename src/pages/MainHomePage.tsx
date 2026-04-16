import { Link } from "react-router-dom";

export function MainHomePage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-6xl px-6">
        {/* ─── Hero ─── */}
        <section className="pt-20 pb-16 text-center">
          <h1
            className="text-6xl font-bold mb-5"
            style={{
              background: "linear-gradient(to right, #7C3AED, #a78bfa, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AIGoLab
          </h1>
          <p className="text-2xl text-brand-text font-medium mb-3">
            AI를 시작하는 가장 쉬운 실험실
          </p>
          <p className="text-base text-brand-textDim">
            AI GoLab (AI 고랩) — 브라우저만으로, 설치 없이, 이론부터 실습까지
          </p>
        </section>

        {/* ─── 학습 코너 ─── */}
        <section className="pb-12">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-6 text-center">
            📚 학습 코너
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {/* AI 강의 */}
            <Link
              to="/courses"
              className="group p-6 rounded-xl border border-brand-subtle bg-brand-panel/80
                         hover:border-brand-primary/40 hover:shadow-lg hover:shadow-brand-primary/5 transition-all"
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-brand-primary transition-colors">AI 강의</h3>
              <p className="text-sm text-brand-textDim mb-3">
                AI/머신러닝/딥러닝 이론을 챕터별로 배우고 퀴즈로 점검해요.
              </p>
              <div className="flex items-center gap-4 text-xs text-brand-textDim">
                <span>📖 5개 강의</span>
                <span>🎯 퀴즈</span>
              </div>
            </Link>

            {/* 코딩 실습 */}
            <Link
              to="/coding"
              className="group p-6 rounded-xl border border-brand-subtle bg-brand-panel/80
                         hover:border-brand-primary/60 hover:shadow-lg hover:shadow-brand-primary/5
                         transition-all"
            >
              <div className="text-3xl mb-3">🐍</div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-brand-primary transition-colors">
                코딩 실습
              </h3>
              <p className="text-sm text-brand-textDim mb-3">
                Python · JavaScript · SQL. 노트북 + IDE 환경.
              </p>
              <div className="flex items-center gap-4 text-xs text-brand-textDim">
                <span>📖 26챕터</span>
                <span>🧪 Playground</span>
                <span>💻 IDE</span>
              </div>
            </Link>

            {/* AI 프로젝트 */}
            <Link
              to="/projects"
              className="group p-6 rounded-xl border border-brand-subtle bg-brand-panel/80
                         hover:border-brand-accent/40 hover:shadow-lg hover:shadow-brand-accent/5 transition-all"
            >
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-brand-accent transition-colors">AI 프로젝트</h3>
              <p className="text-sm text-brand-textDim mb-3">
                실제 데이터로 ML 모델을 만들어보는 미니 프로젝트.
              </p>
              <div className="flex items-center gap-4 text-xs text-brand-textDim">
                <span>🧪 5개 프로젝트</span>
                <span>📊 입문 · 중급</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ─── AI 앱 개발 코너 ─── */}
        <section className="pb-12">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-6 text-center">
            🚀 AI 앱 개발
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {/* AI 엔지니어링 트랙 → 커리큘럼 직행 */}
            <Link
              to="/coding/learn/ai-engineering/beginner"
              className="group p-6 rounded-xl border border-brand-primary/30 bg-gradient-to-br from-violet-500/10 to-brand-panel/80
                         hover:border-brand-primary/60 hover:shadow-lg hover:shadow-brand-primary/10 transition-all"
            >
              <div className="text-3xl mb-3">🤖</div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold group-hover:text-brand-primary transition-colors">
                  AI 엔지니어링 트랙
                </h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-green text-white font-semibold">
                  12강
                </span>
              </div>
              <p className="text-sm text-brand-textDim mb-3">
                프롬프트 · 구조화 · CoT · Tool · 에이전트 · RAG — 무료 API 키만으로.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-brand-textDim">
                <span>🦙 WebLLM</span>
                <span>✨ Gemini</span>
                <span>⚡ Groq</span>
                <span>🔍 RAG</span>
              </div>
            </Link>

            {/* 바이브코딩 워크샵 → 전용 목록 페이지 */}
            <Link
              to="/ai-dev/workshop"
              className="group p-6 rounded-xl border border-brand-accent/30 bg-gradient-to-br from-cyan-500/10 to-brand-panel/80
                         hover:border-brand-accent/60 hover:shadow-lg hover:shadow-brand-accent/10 transition-all"
            >
              <div className="text-3xl mb-3">🛠️</div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold group-hover:text-brand-accent transition-colors">
                  바이브코딩 워크샵
                </h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-accent text-white font-semibold">
                  NEW
                </span>
              </div>
              <p className="text-sm text-brand-textDim mb-3">
                MD 레시피 + AI 코딩 도구 = 완성도 있는 프로그램. 코딩 경험 없어도 OK.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-brand-textDim">
                <span>💻 Claude Code</span>
                <span>🖱️ Cursor</span>
                <span>📄 MD 레시피</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ─── 마이페이지 ─── */}
        <section className="pb-12">
          <div className="max-w-md mx-auto">
            <Link
              to="/my"
              className="group block p-5 rounded-xl border border-brand-subtle bg-brand-panel/80
                         hover:border-brand-primary/40 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">👤</div>
                <div>
                  <h3 className="text-base font-semibold group-hover:text-brand-primary transition-colors">마이페이지</h3>
                  <p className="text-xs text-brand-textDim">진도 · 스트릭 · 수료증</p>
                </div>
                <span className="ml-auto text-brand-textDim group-hover:text-brand-primary text-lg">→</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ─── 학습 로드맵 ─── */}
        <section className="pb-16">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-6 text-center">
            추천 학습 로드맵
          </h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { label: "Python 기초", icon: "🐍", active: true },
              { label: "AI 이론", icon: "🧠", active: true },
              { label: "데이터 분석", icon: "📊", active: true },
              { label: "머신러닝", icon: "🤖", active: true },
              { label: "AI 엔지니어링", icon: "🦙", active: true },
              { label: "바이브코딩", icon: "🛠️", active: true },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2
                    ${
                      step.active
                        ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
                        : "bg-brand-subtle/30 text-brand-textDim/50 border border-brand-subtle/50"
                    }`}
                >
                  <span>{step.icon}</span>
                  {step.label}
                </div>
                {i < 5 && (
                  <span className="text-brand-textDim/30">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── 특징 ─── */}
        <section className="pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌐",
                title: "설치 없이 브라우저에서",
                desc: "Python이 브라우저 안에서 실행됩니다. 다운로드, 설치, 환경설정 필요 없어요.",
              },
              {
                icon: "🎯",
                title: "입문자를 위한 친절한 설계",
                desc: "단계별 힌트, 에러 한국어 번역, 챕터별 퀴즈로 막힘 없는 학습.",
              },
              {
                icon: "💻",
                title: "진짜 코딩 환경",
                desc: "VS Code 에디터, 멀티 파일, import 지원. 학습을 넘어 실전 개발까지.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-brand-subtle/50 bg-brand-panel/40"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-semibold mb-1 text-brand-text">
                  {f.title}
                </h3>
                <p className="text-xs text-brand-textDim leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
