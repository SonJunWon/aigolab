/**
 * 공지사항 페이지 — /notices
 *
 * 초기에는 정적 데이터. 추후 Supabase 연동.
 * 비로그인도 열람 가능.
 */

import { useState } from "react";
import { Link } from "react-router-dom";

/* ─── 공지사항 데이터 ─── */
interface Notice {
  id: string;
  title: string;
  content: string;
  category: "update" | "event" | "maintenance" | "general";
  pinned: boolean;
  date: string; // YYYY-MM-DD
}

const CATEGORY_META: Record<Notice["category"], { label: string; icon: string; cls: string }> = {
  update: { label: "업데이트", icon: "🚀", cls: "bg-brand-accent/15 text-brand-accent" },
  event: { label: "이벤트", icon: "🎉", cls: "bg-pink-500/15 text-pink-400" },
  maintenance: { label: "점검", icon: "🔧", cls: "bg-amber-500/15 text-amber-400" },
  general: { label: "일반", icon: "📢", cls: "bg-brand-textDim/15 text-brand-textDim" },
};

const NOTICES: Notice[] = [
  {
    id: "n001",
    title: "AIGoLab 서비스를 시작합니다",
    content: "AIGoLab은 누구나 AI를 배우고 직접 만들어볼 수 있는 실습형 학습 플랫폼입니다. Python, JavaScript, SQL 코딩 실습부터 AI 엔지니어링 12강, 바이브코딩 워크샵 42개까지 — 브라우저에서 바로 시작하세요.\n\n프로그래밍이 처음이어도, AI가 낯설어도 괜찮습니다. 단계별 힌트, 한국어 에러 번역, 챕터별 퀴즈로 누구나 자신만의 AI 앱을 완성할 수 있습니다.",
    category: "general",
    pinned: true,
    date: "2026-02-01",
  },
  {
    id: "n002",
    title: "AI 엔지니어링 12강 커리큘럼 완성",
    content: "AI 엔지니어링 트랙 12강이 모두 완성되었습니다.\n\n• Ch01~02: WebLLM, Gemini 프롬프팅 (FREE)\n• Ch03~12: 구조화 출력, CoT, Tool Calling, 에이전트, RAG 등 (PRO)\n\n무료 API 키(Gemini, Groq)만으로 모든 실습을 진행할 수 있습니다. 'AI 앱 개발 → AI 엔지니어링 트랙'에서 시작하세요.",
    category: "update",
    pinned: false,
    date: "2026-02-15",
  },
  {
    id: "n003",
    title: "바이브코딩 워크샵 W00~W40 전체 오픈",
    content: "바이브코딩 워크샵 42개가 모두 준비되었습니다!\n\n• Phase 1 (W01~W06): 기초 — AI 챗봇, 문서 Q&A, 번역기, 유튜브 기획기, 자막 생성기, 이미지 분석기\n• Phase 2 (W07~W11): 실전 도구 — 숏폼 메이커, 블로그 작성기, 감정 분석, 이메일 비서, 학습카드\n• Phase 3~8: 풀스택, 통합, 크리에이터, AI 에이전트, 수익화, 최종 종합\n\nW00(환경 설정)부터 차근차근 시작해보세요. 각 워크샵 상세 페이지에서 완성 모습과 학습 흐름을 미리 확인할 수 있습니다.",
    category: "update",
    pinned: true,
    date: "2026-03-05",
  },
  {
    id: "n004",
    title: "학습 진도 대시보드 추가",
    content: "워크샵 학습 진도를 한눈에 확인할 수 있는 대시보드가 추가되었습니다.\n\n• Phase별 완료 현황 시각화\n• 다음 추천 워크샵 안내\n• 전체 진도율 표시\n\n'AI 앱 개발' 페이지 하단의 '학습 진도 대시보드'에서 확인하세요.",
    category: "update",
    pinned: false,
    date: "2026-03-20",
  },
  {
    id: "n005",
    title: "PRO 콘텐츠 정식 오픈",
    content: "이전에 '오픈 예정'으로 안내드렸던 PRO 콘텐츠가 정식으로 오픈되었습니다.\n\nPRO 이용 시 다음 콘텐츠 전체를 사용하실 수 있습니다:\n• Python 중급·데이터 과학·ML 실습 트랙\n• AI 강의 07~10 (프롬프트·비전·윤리·에이전트)\n• AI 엔지니어링 12강 중 Ch03~12\n• 바이브코딩 워크샵 Phase 2~8 (W07~W40)\n• AI 프로젝트 11개\n\nFREE 콘텐츠는 변동 없이 그대로 이용하실 수 있습니다. 이용 방법은 마이페이지에서 확인해주세요.",
    category: "general",
    pinned: true,
    date: "2026-04-05",
  },
  {
    id: "n006",
    title: "AI 입문 준비 과정 14강 오픈",
    content: "AI와 코딩이 처음인 분을 위한 'AI 입문 준비' 14강이 모두 오픈되었습니다.\n\n• Ch00: AIGoLab 시작하기\n• Ch01~03: AI와 첫 대화 / AI로 글쓰기 / AI로 그림 그리기\n• Ch04~06: AI 작동 원리 / 프롬프트 엔지니어링 / 마크다운\n• Ch07~09: AI 활용 유형 / 파일 확장자 / 인터넷과 API\n• Ch10~13: 코딩 기초 / 개발 도구 / 바이브 코딩 / 다음 단계\n\n채팅·그림 그리기·코드 작성까지 — 브라우저에서 바로 체험할 수 있습니다. 'AI 앱 개발 → AI 입문 준비'에서 시작하세요.",
    category: "update",
    pinned: false,
    date: "2026-04-20",
  },
  {
    id: "n007",
    title: "Python 머신러닝 실습 트랙 11강 완성",
    content: "scikit-learn 으로 머신러닝을 처음부터 끝까지 따라가는 'ML 실습' 트랙 11강이 모두 준비되었습니다.\n\n회귀·분류·클러스터링부터 앙상블·부스팅·모델 해석·이탈 예측·차원 축소(PCA)까지, 실전 데이터셋으로 손을 움직이며 익히는 코스입니다.\n\n선수 학습: Python 입문 + 데이터 과학 트랙. '코딩 실습 → Python → 머신러닝 실습'에서 시작하세요.",
    category: "update",
    pinned: false,
    date: "2026-02-20",
  },
  {
    id: "n008",
    title: "Python 데이터 과학 트랙 10강 완성",
    content: "데이터 분석에 필요한 핵심 도구를 모두 다루는 '데이터 과학' 트랙 10강이 준비되었습니다.\n\n• NumPy / Pandas / Matplotlib 기초\n• 데이터 정제·결합·그룹 분석\n• 시각화와 미니 프로젝트\n\nPython 입문을 마치셨다면 자연스럽게 다음 단계로 이어집니다. '코딩 실습 → Python → 데이터 과학'에서 시작하세요.",
    category: "update",
    pinned: false,
    date: "2026-04-14",
  },
  {
    id: "n009",
    title: "AI 강의 10강 전체 오픈",
    content: "AI 개념을 짧고 굵게 학습할 수 있는 AI 강의 10강이 모두 오픈되었습니다.\n\n• 01~06 (FREE): AI란 무엇인가, 머신러닝 기초, 데이터와 AI, 딥러닝 기초, NLP 기초, 생성형 AI\n• 07~10 (PRO): 프롬프트 엔지니어링, 컴퓨터 비전, AI 윤리, AI 에이전트\n\n각 강의는 인라인 코드 실행과 미니 퀴즈로 구성됩니다. '강좌' 메뉴에서 시작하세요.",
    category: "update",
    pinned: false,
    date: "2026-03-15",
  },
];

/* ─── 컴포넌트 ─── */
export function NoticesPage() {
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Notice["category"] | null>(null);

  const filtered = NOTICES
    .filter((n) => !categoryFilter || n.category === categoryFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const openNotice = filtered.find((n) => n.id === selectedNotice);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">공지사항</h1>
          <p className="text-sm text-brand-textDim">
            AIGoLab의 새로운 소식을 확인하세요
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${!categoryFilter
                ? "bg-brand-accent/15 text-brand-accent border border-brand-accent/30"
                : "bg-brand-panel text-brand-textDim border border-brand-subtle hover:border-brand-accent/30"
              }`}
          >
            전체
          </button>
          {(Object.entries(CATEGORY_META) as [Notice["category"], typeof CATEGORY_META["update"]][]).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(categoryFilter === key ? null : key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${categoryFilter === key
                  ? "bg-brand-accent/15 text-brand-accent border border-brand-accent/30"
                  : "bg-brand-panel text-brand-textDim border border-brand-subtle hover:border-brand-accent/30"
                }`}
            >
              {meta.icon} {meta.label}
            </button>
          ))}
        </div>

        {/* 상세 보기 */}
        {openNotice ? (
          <div>
            <button
              onClick={() => setSelectedNotice(null)}
              className="text-sm text-brand-textDim hover:text-brand-accent transition-colors mb-4"
            >
              ← 목록으로
            </button>
            <article className="p-6 rounded-xl border border-brand-subtle bg-brand-panel/60">
              <div className="flex items-center gap-2 mb-3">
                {openNotice.pinned && <span className="text-xs">📌</span>}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${CATEGORY_META[openNotice.category].cls}`}>
                  {CATEGORY_META[openNotice.category].icon} {CATEGORY_META[openNotice.category].label}
                </span>
                <span className="text-xs text-brand-textDim">{openNotice.date}</span>
              </div>
              <h2 className="text-xl font-bold mb-4">{openNotice.title}</h2>
              <div className="text-sm text-brand-textDim leading-relaxed whitespace-pre-line">
                {openNotice.content}
              </div>
            </article>
          </div>
        ) : (
          /* 목록 */
          <div className="space-y-3">
            {filtered.map((notice) => {
              const meta = CATEGORY_META[notice.category];
              return (
                <button
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice.id)}
                  className="w-full text-left p-4 sm:p-5 rounded-xl border border-brand-subtle bg-brand-panel/40
                             hover:bg-brand-panel/80 hover:border-brand-accent/30 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {notice.pinned && <span className="text-xs">📌</span>}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${meta.cls}`}>
                      {meta.icon} {meta.label}
                    </span>
                    <span className="text-[11px] text-brand-textDim">{notice.date}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-medium group-hover:text-brand-accent transition-colors">
                    {notice.title}
                  </h3>
                </button>
              );
            })}
          </div>
        )}

        {/* 하단 */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="text-sm text-brand-textDim hover:text-brand-accent transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
