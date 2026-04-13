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

        {/* ─── 4대 코너 ─── */}
        <section className="pb-16">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-6 text-center">
            학습 코너
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
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
                <span>🎯 강의별 퀴즈</span>
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
                Python 입문 · 중급 · 데이터과학 · ML 실습. 노트북 + IDE 환경.
              </p>
              <div className="flex items-center gap-4 text-xs text-brand-textDim">
                <span>📖 26챕터</span>
                <span>🧪 Playground</span>
                <span>💻 IDE</span>
              </div>
            </Link>

            {/* 프로젝트 */}
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

            {/* 마이페이지 */}
            <Link
              to="/my"
              className="group p-6 rounded-xl border border-brand-subtle bg-brand-panel/80
                         hover:border-brand-primary/40 hover:shadow-lg hover:shadow-brand-primary/5 transition-all"
            >
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-brand-primary transition-colors">마이페이지</h3>
              <p className="text-sm text-brand-textDim mb-3">
                학습 진도, 스트릭, 활동 히트맵, 수료증까지 한눈에.
              </p>
              <div className="flex items-center gap-4 text-xs text-brand-textDim">
                <span>🔥 스트릭</span>
                <span>📊 통계</span>
                <span>🏆 수료증</span>
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
              { label: "Python 중급", icon: "⚡", active: true },
              { label: "AI 이론", icon: "🧠", active: true },
              { label: "데이터 분석", icon: "📊", active: true },
              { label: "머신러닝", icon: "🤖", active: true },
              { label: "딥러닝", icon: "🧬", active: true },
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
