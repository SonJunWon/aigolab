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

/* ─── 학습 코너 (넘버링 섹션) ─── */
const LEARNING_SECTIONS = [
  {
    num: "001.",
    label: "COURSES",
    title: "AI 강의",
    desc: "AI · 머신러닝 · 딥러닝 이론을 챕터별로 배우고 퀴즈로 점검해요.",
    meta: "5개 강의 · 퀴즈",
    to: "/courses",
  },
  {
    num: "002.",
    label: "CODING",
    title: "코딩 실습",
    desc: "Python · JavaScript · SQL. 노트북과 IDE 환경이 브라우저 안에서 열립니다.",
    meta: "26챕터 · Playground · IDE",
    to: "/coding",
  },
  {
    num: "003.",
    label: "PROJECTS",
    title: "AI 프로젝트",
    desc: "실제 데이터로 ML 모델을 만들어보는 미니 프로젝트.",
    meta: "5개 프로젝트 · 입문–중급",
    to: "/projects",
  },
];

/* ─── 특징 (넘버링 리스트) ─── */
const FEATURES = [
  {
    num: "001.",
    title: "설치 없이, 브라우저에서 바로 시작",
    desc: "Python, JavaScript가 브라우저 안에서 실행됩니다. 복잡한 환경설정 없이 링크를 열면 바로 코딩을 시작할 수 있어요. 노트북, 태블릿, 어디서든 접속 가능합니다.",
    tags: ["Pyodide · Python 3.12", "WebLLM", "Monaco Editor"],
  },
  {
    num: "002.",
    title: "중학생도 따라할 수 있는 친절한 설계",
    desc: "모든 설명은 쉬운 한국어로 작성되어 있고, 전문 용어에는 마우스를 올리면 뜻이 나옵니다. 막혔을 때 단계별 힌트를 열 수 있고, 에러 메시지도 한국어로 번역됩니다.",
    tags: ["단계별 힌트", "용어 팝업", "에러 한국어 번역", "챕터별 퀴즈"],
  },
  {
    num: "003.",
    title: "100% 무료 API로 42개 앱 완성",
    desc: "Google Gemini (하루 1,500회), Groq (하루 14,400회) 무료 API 키만 사용합니다. 유료 결제 없이 챗봇부터 SaaS까지 42개 실전 앱을 만들 수 있어요.",
    tags: ["Gemini 무료", "Groq 무료", "Supabase 무료", "Vercel 무료"],
  },
  {
    num: "004.",
    title: "이론과 실전을 한 곳에서",
    desc: "AI 엔지니어링 강의로 프롬프트, RAG, 에이전트 등 핵심 기법을 배우고, 바이브코딩 워크샵에서 실제 앱으로 조립합니다. 배움 → 만들기 → 배포까지 하나의 플랫폼에서 완결돼요.",
    tags: ["체계적 커리큘럼", "42개 워크샵", "8단계 난이도"],
  },
];

const ROADMAP = ["Python 기초", "AI 이론", "데이터 분석", "머신러닝", "AI 엔지니어링", "바이브코딩"];

const TICKER_TEXT = "AIGoLab — AI를 시작하는 가장 쉬운 실험실 — ";

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

      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-28 pb-14 sm:pb-24">
        <div className="flex items-center justify-between pb-4 border-b border-brand-line mb-10 sm:mb-16 animate-rise">
          <span className="mono-label">AIGOLAB / LAB:00</span>
          <span className="mono-label hidden sm:inline">01. LEARN&nbsp;&nbsp;02. BUILD&nbsp;&nbsp;03. SHIP</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 sm:mb-8 animate-rise">
          AI를 시작하는
          <br />
          가장 쉬운 실험실<span className="text-brand-primary">.</span>
        </h1>

        <p className="max-w-2xl text-sm sm:text-base text-brand-textDim leading-relaxed mb-8 animate-rise">
          AIGoLab은 누구나 AI를 배우고 직접 만들어볼 수 있는 실습형 학습 플랫폼입니다.
          복잡한 설치 없이 브라우저에서 바로 코딩하고, AI 이론부터 실전 앱 개발까지
          단계별로 안내합니다. 프로그래밍이 처음이어도, AI가 낯설어도 괜찮아요.
        </p>

        {/* 타이핑 애니메이션 */}
        <div className="h-7 mb-10 font-mono text-sm sm:text-base text-brand-primary">
          <span className="text-brand-textDim">&gt;&nbsp;</span>
          {typed}
          <span className="animate-pulse ml-0.5">_</span>
        </div>

        {/* CTA — 흰 라인 박스 2셀 */}
        <div className="grid sm:grid-cols-2 border border-brand-line max-w-3xl">
          <Link
            to="/ai-dev"
            className="group flex items-center justify-between gap-6 px-6 py-5
                       hover:bg-brand-panel transition-colors"
          >
            <span>
              <span className="mono-label block mb-1">42 PROJECTS</span>
              <span className="text-base font-semibold group-hover:text-brand-primary transition-colors">
                AI 앱 개발 시작하기
              </span>
            </span>
            <span className="text-xl text-brand-primary group-hover:translate-x-1.5 transition-transform">→</span>
          </Link>
          <Link
            to="/courses"
            className="group flex items-center justify-between gap-6 px-6 py-5
                       border-t sm:border-t-0 sm:border-l border-brand-line
                       hover:bg-brand-panel transition-colors"
          >
            <span>
              <span className="mono-label block mb-1">COURSES</span>
              <span className="text-base font-semibold group-hover:text-brand-primary transition-colors">
                AI 강의 둘러보기
              </span>
            </span>
            <span className="text-xl text-brand-primary group-hover:translate-x-1.5 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* ─── 브랜드 티커 ─── */}
      <div className="border-y border-brand-line overflow-hidden py-3 select-none" aria-hidden="true">
        <div className="animate-ticker flex whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-brand-textDim/70">
          <span className="shrink-0">{TICKER_TEXT.repeat(6)}</span>
          <span className="shrink-0">{TICKER_TEXT.repeat(6)}</span>
        </div>
      </div>

      {/* ─── 학습 코너 — 라인 공유 3셀 그리드 ─── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-24">
        <div className="flex items-baseline justify-between mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">학습 코너</h2>
          <span className="mono-label">SECTIONS / 03</span>
        </div>

        <div className="grid md:grid-cols-3 border border-brand-line">
          {LEARNING_SECTIONS.map((s, i) => (
            <Link
              key={s.to}
              to={s.to}
              className={`group flex flex-col p-6 sm:p-8 hover:bg-brand-panel transition-colors
                          ${i > 0 ? "border-t md:border-t-0 md:border-l border-brand-line" : ""}`}
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="mono-label text-brand-primary">{s.num}</span>
                <span className="mono-label">{s.label}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-brand-textDim leading-relaxed mb-6 flex-1">{s.desc}</p>
              <div className="flex items-center justify-between border-t border-brand-line pt-4">
                <span className="font-mono text-[11px] text-brand-textDim">{s.meta}</span>
                <span className="text-lg text-brand-primary group-hover:translate-x-1.5 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 만들 수 있는 앱 캐러셀 ─── */}
      <section className="py-14 sm:py-24 border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-8 sm:mb-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-snug">
              하나씩 따라가다 보면,
              <br className="sm:hidden" /> 어느새 만들고 있을 앱들
            </h2>
            <span className="mono-label shrink-0 ml-4">SHOWCASE / W01–W40</span>
          </div>
          <p className="mt-3 font-mono text-[11px] text-brand-textDim">
            ← 좌우로 스크롤 →
          </p>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex gap-px overflow-x-auto snap-x snap-mandatory bg-brand-line
                          border border-brand-line scrollbar-thin scrollbar-thumb-brand-subtle scrollbar-track-transparent">
            {SHOWCASE_APPS.map((app) => (
              <div
                key={app.ws}
                className="snap-start shrink-0 w-60 sm:w-72 p-5 sm:p-6 bg-brand-bg"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] text-brand-primary">{app.ws}</span>
                  <span className="text-xl grayscale opacity-80">{app.icon}</span>
                </div>
                <div className="text-base font-semibold mb-2">{app.name}</div>
                <p className="text-xs text-brand-textDim leading-relaxed mb-4">{app.desc}</p>
                <div className="font-mono text-[10px] uppercase tracking-wider text-brand-textDim">
                  {app.tags.join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 숫자 통계 — 라인 공유 4셀 ─── */}
      <section className="border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4">
          {[
            { num: "42", label: "워크샵", sub: "PROJECTS" },
            { num: "12", label: "강 커리큘럼", sub: "AI ENGINEERING" },
            { num: "8", label: "단계 로드맵", sub: "BASIC → SAAS" },
            { num: "0", label: "원으로 시작", sub: "FREE API" },
          ].map((s, i) => (
            <div
              key={i}
              className={`py-8 sm:py-10 px-4 sm:px-6 ${i > 0 ? "border-l border-brand-line" : ""} ${
                i >= 2 ? "border-t sm:border-t-0 border-brand-line" : ""
              }`}
            >
              <div className="font-mono text-3xl sm:text-4xl font-bold text-brand-primary mb-1">{s.num}</div>
              <div className="text-sm font-medium">{s.label}</div>
              <div className="mono-label mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 특징 — 넘버링 리스트 ─── */}
      <section className="border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-24">
          <div className="flex items-baseline justify-between mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">왜 AIGoLab인가요</h2>
            <span className="mono-label">WHY / 04</span>
          </div>

          <div>
            {FEATURES.map((f) => (
              <div
                key={f.num}
                className="grid sm:grid-cols-[100px_1fr] gap-2 sm:gap-8 py-8 sm:py-10 border-t border-brand-line"
              >
                <span className="font-mono text-sm text-brand-primary">{f.num}</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-sm text-brand-textDim leading-relaxed mb-4 max-w-3xl">{f.desc}</p>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-brand-textDim">
                    {f.tags.join("  ·  ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 학습 로드맵 ─── */}
      <section className="border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex items-baseline justify-between mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">추천 학습 로드맵</h2>
            <span className="mono-label">ROADMAP / 06</span>
          </div>
          <div className="flex items-center gap-x-4 gap-y-3 flex-wrap">
            {ROADMAP.map((label, i) => (
              <div key={label} className="flex items-center gap-4">
                <div className="text-sm text-brand-text">
                  <span className="font-mono text-[10px] text-brand-primary mr-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </div>
                {i < ROADMAP.length - 1 && <span className="text-brand-textDim/40 font-mono">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 고객 지원 — 라인 공유 2셀 ─── */}
      <section className="border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid sm:grid-cols-2 border border-brand-line">
            <Link
              to="/notices"
              className="group flex items-center justify-between gap-4 p-5 sm:p-6
                         hover:bg-brand-panel transition-colors"
            >
              <div>
                <span className="mono-label block mb-1">NOTICE</span>
                <span className="text-sm font-medium group-hover:text-brand-primary transition-colors">공지사항</span>
                <span className="text-xs text-brand-textDim ml-3">서비스 소식과 업데이트</span>
              </div>
              <span className="text-brand-primary group-hover:translate-x-1.5 transition-transform">→</span>
            </Link>
            <Link
              to="/faq"
              className="group flex items-center justify-between gap-4 p-5 sm:p-6
                         border-t sm:border-t-0 sm:border-l border-brand-line
                         hover:bg-brand-panel transition-colors"
            >
              <div>
                <span className="mono-label block mb-1">FAQ</span>
                <span className="text-sm font-medium group-hover:text-brand-primary transition-colors">자주 묻는 질문</span>
                <span className="text-xs text-brand-textDim ml-3">이용 방법, PRO, 오류 해결</span>
              </div>
              <span className="text-brand-primary group-hover:translate-x-1.5 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
