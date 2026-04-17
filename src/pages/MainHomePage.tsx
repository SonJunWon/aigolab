import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/* ─── 타이핑 애니메이션 훅 ─── */
function useTypewriter(texts: string[], speed = 60, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const text = texts[idx];
    let charIdx = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        setDisplay(text.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx >= text.length) {
          deleting = true;
          timeout = setTimeout(tick, pause);
          return;
        }
      } else {
        setDisplay(text.slice(0, charIdx - 1));
        charIdx--;
        if (charIdx <= 0) {
          deleting = false;
          setIdx((prev) => (prev + 1) % texts.length);
          return;
        }
      }
      timeout = setTimeout(tick, deleting ? 30 : speed);
    };
    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, [idx, texts, speed, pause]);

  return display;
}

/* ─── 워크샵 앱 캐러셀 데이터 ─── */
const SHOWCASE_APPS = [
  { icon: "🤖", name: "AI 챗봇", ws: "W01", desc: "실시간 대화형 AI 챗봇. 성격 커스텀, 대화 히스토리 관리, 다크모드까지 완성도 있는 웹앱을 만들어요.", tags: ["Gemini API", "React"] },
  { icon: "📄", name: "문서 Q&A 봇", ws: "W02", desc: "내 문서를 올리면 질문에 답하는 RAG 챗봇. 텍스트 청킹, 관련 내용 검색, 출처 표시까지.", tags: ["RAG", "청킹"] },
  { icon: "🌐", name: "실시간 번역기", ws: "W03", desc: "7개 언어 자동 감지 + 번역. 격식체/캐주얼 톤 선택, 좌우 분할 UI, 원클릭 복사.", tags: ["다국어", "스트리밍"] },
  { icon: "🎥", name: "유튜브 기획기", ws: "W04", desc: "주제만 입력하면 제목 5개, 스크립트, SEO 태그, 썸네일 프롬프트를 자동 생성해요.", tags: ["SEO", "콘텐츠"] },
  { icon: "📊", name: "감정 분석", ws: "W09", desc: "CSV 리뷰 데이터를 업로드하면 AI가 긍정/부정 분류, 차트 시각화, 인사이트 리포트 생성.", tags: ["Chart.js", "분류"] },
  { icon: "✈️", name: "여행 플래너", ws: "W22", desc: "목적지와 예산만 입력하면 AI가 일정 생성. Leaflet 지도에 마커, PDF 다운로드까지.", tags: ["Leaflet", "PDF"] },
  { icon: "🎤", name: "면접 코치", ws: "W23", desc: "AI 면접관이 직무별 질문을 하고, 음성 답변을 실시간 평가. 취약 영역 분석 대시보드.", tags: ["Web Speech", "평가"] },
  { icon: "💰", name: "가계부 코치", ws: "W35", desc: "영수증 사진 찍으면 OCR 자동 입력. AI가 소비 패턴 분석하고 절약 팁을 제안해요.", tags: ["Gemini Vision", "Chart"] },
  { icon: "🏗️", name: "노코드 빌더", ws: "W38", desc: "자연어로 앱 설명하면 AI가 UI를 자동 생성. 실시간 미리보기, 속성 편집, 코드 내보내기.", tags: ["React", "Zustand"] },
  { icon: "🦄", name: "스타트업 런치", ws: "W40", desc: "아이디어 검증부터 랜딩페이지, 대기자 명단, 결제 연동까지 — AI로 SaaS를 런칭해요.", tags: ["Stripe", "Supabase"] },
];

export function MainHomePage() {
  const typed = useTypewriter([
    "AI 챗봇을 만들어보세요",
    "문서 Q&A 봇을 만들어보세요",
    "유튜브 기획기를 만들어보세요",
    "여행 플래너를 만들어보세요",
    "나만의 SaaS를 런칭하세요",
  ]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* ─── Hero ─── */}
        <section className="pt-16 sm:pt-24 pb-12 sm:pb-20 text-center">
          <h1
            className="text-5xl sm:text-7xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #a78bfa, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AIGoLab
          </h1>
          <p className="text-xl sm:text-2xl text-brand-text font-medium mb-2">
            AI를 시작하는 가장 쉬운 실험실
          </p>
          <p className="text-sm sm:text-base text-brand-textDim mb-6">
            브라우저만으로, 설치 없이, 이론부터 실전 앱 개발까지
          </p>

          {/* 타이핑 애니메이션 */}
          <div className="h-8 sm:h-10 flex items-center justify-center mb-8">
            <span className="text-base sm:text-lg text-brand-accent font-medium">
              {typed}
              <span className="animate-pulse ml-0.5">|</span>
            </span>
          </div>

          {/* CTA 배너 */}
          <Link
            to="/ai-dev"
            className="group block max-w-xl mx-auto p-6 rounded-2xl
                       bg-gradient-to-r from-brand-accent/15 via-cyan-500/10 to-violet-500/15
                       border border-brand-accent/30 hover:border-brand-accent/60
                       hover:shadow-xl hover:shadow-brand-accent/10 transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl">🚀</span>
                  <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-accent transition-colors">
                    AI 앱 개발
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-brand-accent/20 text-brand-accent">
                    42개 프로젝트
                  </span>
                </div>
                <p className="text-sm text-brand-textDim">
                  12강 이론 + 42개 실전 워크샵으로 AI 앱 개발자 되기
                </p>
              </div>
              <span className="shrink-0 text-xl text-brand-accent group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        </section>

        {/* ─── 만들 수 있는 앱 캐러셀 ─── */}
        <section className="pb-12 sm:pb-16 pt-10 sm:pt-12 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-brand-panel/30 rounded-2xl">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-2 text-center">
            하나씩 따라가다 보면, 어느새 이런 앱을 만들고 있을 거예요
          </h2>
          <p className="text-xs text-brand-textDim text-center mb-6">
            좌우로 스크롤해서 더 많은 앱을 확인하세요
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory
                          scrollbar-thin scrollbar-thumb-brand-subtle scrollbar-track-transparent">
            {SHOWCASE_APPS.map((app, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-56 sm:w-72 p-4 sm:p-5 rounded-xl border border-brand-subtle/50
                           bg-brand-panel/60 hover:border-brand-accent/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{app.icon}</span>
                  <div>
                    <div className="text-base font-semibold">{app.name}</div>
                    <div className="text-[10px] text-brand-accent">{app.ws}</div>
                  </div>
                </div>
                <p className="text-xs text-brand-textDim leading-relaxed mb-3">
                  {app.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {app.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md text-[9px] bg-brand-accent/10 text-brand-accent/70">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 학습 코너 ─── */}
        <section className="pb-12 sm:pb-16">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-6 text-center">
            학습 코너
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
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

            <Link
              to="/coding"
              className="group p-6 rounded-xl border border-brand-subtle bg-brand-panel/80
                         hover:border-brand-primary/60 hover:shadow-lg hover:shadow-brand-primary/5 transition-all"
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

        {/* ─── 숫자 통계 ─── */}
        <section className="pb-12 sm:pb-16 pt-10 sm:pt-12 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-brand-panel/20 rounded-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { num: "42", label: "워크샵", sub: "실전 프로젝트" },
              { num: "12", label: "강", sub: "AI 엔지니어링" },
              { num: "8", label: "단계", sub: "기초→SaaS" },
              { num: "무료", label: "API", sub: "Gemini·Groq" },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-brand-panel/40 border border-brand-subtle/50">
                <div className="text-2xl sm:text-3xl font-bold text-brand-accent">{s.num}</div>
                <div className="text-xs text-brand-text font-medium">{s.label}</div>
                <div className="text-[10px] text-brand-textDim">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>


        {/* ─── 특징 — 세로 풀 레이아웃 ─── */}
        <section className="pb-12 sm:pb-16 pt-10 sm:pt-12 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-brand-panel/30 rounded-2xl">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-2 text-center">
            왜 AIGoLab 인가요
          </h2>
          <p className="text-xs text-brand-textDim text-center mb-8">
            AI 학습의 진입 장벽을 낮추기 위해 설계되었어요
          </p>

          <div className="space-y-5 max-w-3xl mx-auto">
            {/* 1. 설치 없이 */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-brand-subtle bg-brand-panel/60">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center text-2xl">
                🌐
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1.5">설치 없이, 브라우저에서 바로 시작</h3>
                <p className="text-sm text-brand-textDim leading-relaxed mb-3">
                  Python, JavaScript가 브라우저 안에서 실행됩니다.
                  복잡한 환경설정 없이 링크를 열면 바로 코딩을 시작할 수 있어요.
                  노트북, 태블릿, 어디서든 접속 가능합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pyodide (Python 3.12)</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">WebLLM</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Monaco Editor</span>
                </div>
              </div>
            </div>

            {/* 2. 입문자 친화 */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-brand-subtle bg-brand-panel/60">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center text-2xl">
                🎯
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1.5">중학생도 따라할 수 있는 친절한 설계</h3>
                <p className="text-sm text-brand-textDim leading-relaxed mb-3">
                  모든 설명은 쉬운 한국어로 작성되어 있고, 전문 용어에는 마우스를 올리면 뜻이 나옵니다.
                  막혔을 때 단계별 힌트를 열 수 있고, 에러 메시지도 한국어로 번역됩니다.
                  각 챕터 끝에는 퀴즈로 이해도를 점검해요.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">단계별 힌트</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">용어 팝업</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">에러 한국어 번역</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">챕터별 퀴즈</span>
                </div>
              </div>
            </div>

            {/* 3. 무료 API */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-brand-subtle bg-brand-panel/60">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-2xl">
                🆓
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1.5">100% 무료 API로 42개 앱 완성</h3>
                <p className="text-sm text-brand-textDim leading-relaxed mb-3">
                  Google Gemini (하루 1,500회), Groq (하루 14,400회) 무료 API 키만 사용합니다.
                  유료 결제 없이 챗봇부터 SaaS까지 42개 실전 앱을 만들 수 있어요.
                  Supabase, Vercel 무료 플랜으로 실제 배포까지 가능합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">Gemini 무료</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">Groq 무료</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">Supabase 무료</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">Vercel 무료</span>
                </div>
              </div>
            </div>

            {/* 4. 이론 + 실전 */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-brand-subtle bg-brand-panel/60">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center text-2xl">
                🔄
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1.5">이론과 실전을 한 곳에서</h3>
                <p className="text-sm text-brand-textDim leading-relaxed mb-3">
                  AI 엔지니어링 12강으로 프롬프트, RAG, 에이전트 등 핵심 기법을 배우고,
                  바이브코딩 워크샵에서 배운 기법을 실제 앱으로 조립합니다.
                  배움 → 만들기 → 배포까지 하나의 플랫폼에서 완결돼요.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20">12강 커리큘럼</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20">42개 워크샵</span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20">8단계 난이도</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 학습 로드맵 ─── */}
        <section className="pb-16 sm:pb-20">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-6 text-center">
            추천 학습 로드맵
          </h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { label: "Python 기초", icon: "🐍" },
              { label: "AI 이론", icon: "🧠" },
              { label: "데이터 분석", icon: "📊" },
              { label: "머신러닝", icon: "🤖" },
              { label: "AI 엔지니어링", icon: "🦙" },
              { label: "바이브코딩", icon: "🛠️" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-lg text-sm flex items-center gap-2
                                bg-brand-primary/10 text-brand-text border border-brand-primary/20">
                  <span>{step.icon}</span>
                  {step.label}
                </div>
                {i < 5 && <span className="text-brand-textDim/40">→</span>}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
