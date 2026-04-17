/**
 * FAQ 페이지 — /faq
 *
 * 정적 데이터 기반. 카테고리별 아코디언.
 * 비로그인도 열람 가능.
 */

import { useState } from "react";
import { Link } from "react-router-dom";

/* ─── FAQ 데이터 ─── */
interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: "general",
    title: "일반",
    icon: "💡",
    items: [
      {
        q: "AIGoLab은 무엇인가요?",
        a: "AIGoLab은 AI를 배우고 직접 앱을 만들어볼 수 있는 실습형 학습 플랫폼입니다. 브라우저에서 바로 코딩하고, AI 이론부터 실전 앱 개발까지 단계별로 안내합니다.",
      },
      {
        q: "어떤 기기에서 이용할 수 있나요?",
        a: "데스크탑, 노트북, 태블릿 등 최신 웹 브라우저(Chrome, Edge, Safari)가 설치된 기기에서 이용 가능합니다. 모바일에서도 열람은 가능하지만, 코딩 실습은 데스크탑 환경을 권장합니다.",
      },
      {
        q: "프로그래밍을 처음 배우는데 가능한가요?",
        a: "네, 가능합니다. 모든 커리큘럼은 프로그래밍 경험이 전혀 없는 분을 기준으로 설계되었습니다. 단계별 힌트, 한국어 에러 번역, 용어 팝업 등 초보자를 위한 기능이 준비되어 있습니다.",
      },
      {
        q: "설치해야 하는 프로그램이 있나요?",
        a: "코딩 실습과 AI 강의는 브라우저만 있으면 됩니다. 별도 설치가 필요 없습니다. 다만 바이브코딩 워크샵의 Part B(실제 앱 제작)에서는 Node.js와 VS Code/Cursor 설치가 필요합니다.",
      },
      {
        q: "학습 데이터는 어디에 저장되나요?",
        a: "로그인 상태에서는 서버(Supabase)에 저장되어 어떤 기기에서든 이어서 학습할 수 있습니다. 비로그인 시에는 해당 브라우저의 로컬 저장소(IndexedDB)에만 저장됩니다.",
      },
    ],
  },
  {
    id: "account",
    title: "회원",
    icon: "👤",
    items: [
      {
        q: "회원가입은 어떻게 하나요?",
        a: "이메일+비밀번호로 가입하거나, Google 계정으로 간편 로그인할 수 있습니다. 이메일 가입 시 확인 메일이 발송되며, 메일의 링크를 클릭하면 가입이 완료됩니다.",
      },
      {
        q: "비밀번호를 잊었어요.",
        a: "로그인 페이지에서 '비밀번호 찾기' 기능을 이용하세요. 가입 시 사용한 이메일로 비밀번호 재설정 링크가 발송됩니다. Google 로그인 사용자는 Google 계정 설정에서 비밀번호를 관리하세요.",
      },
      {
        q: "회원 탈퇴는 어떻게 하나요?",
        a: "마이페이지에서 회원 탈퇴를 요청할 수 있습니다. 탈퇴 시 학습 진도, 프로필 등 모든 데이터가 삭제되며 복구할 수 없습니다.",
      },
      {
        q: "로그인하지 않으면 무엇을 이용할 수 있나요?",
        a: "메인 홈, AI 앱 개발 소개, 코딩 실습 소개, AI 강의 목록, FAQ, 공지사항을 열람할 수 있습니다. 실제 학습 콘텐츠(커리큘럼, 워크샵, Playground 등)는 로그인이 필요합니다.",
      },
    ],
  },
  {
    id: "pro",
    title: "PRO · 구독",
    icon: "⭐",
    items: [
      {
        q: "PRO와 일반(FREE)의 차이는 무엇인가요?",
        a: "FREE는 입문 레벨 콘텐츠(Python 입문, AI 강의 01~06, 워크샵 Phase 1 등)를 이용할 수 있습니다. PRO는 중급 이상 콘텐츠(Python 중급, AI 강의 07~10, 워크샵 Phase 2~8, AI 프로젝트 전체)를 추가로 이용할 수 있습니다.",
      },
      {
        q: "PRO는 어떻게 이용할 수 있나요?",
        a: "PRO 콘텐츠는 도서 구매자에게 제공됩니다. 도서에 포함된 인증 코드를 마이페이지에서 등록하면 PRO가 활성화됩니다. 자세한 안내는 추후 공지를 통해 알려드리겠습니다.",
      },
      {
        q: "PRO 이용 기간이 있나요?",
        a: "도서 구매를 통한 PRO 활성화는 별도의 기간 제한 없이 이용 가능합니다. 다만 향후 정책이 변경될 수 있으며, 변경 시 사전에 공지합니다.",
      },
      {
        q: "어떤 콘텐츠가 PRO인가요?",
        a: "워크샵 목록, 커리큘럼 페이지에서 'PRO' 뱃지가 표시된 콘텐츠가 PRO 전용입니다. 대체로 중급 이상 난이도의 콘텐츠가 해당됩니다.",
      },
    ],
  },
  {
    id: "learning",
    title: "학습",
    icon: "📚",
    items: [
      {
        q: "어디서부터 시작하면 좋을까요?",
        a: "프로그래밍이 처음이라면 '코딩 실습 → Python 입문'부터 시작하세요. AI에 관심이 있다면 'AI 앱 개발 → AI 엔지니어링 12강'을 추천합니다. 코딩 경험이 있고 바로 앱을 만들고 싶다면 '바이브코딩 워크샵'을 시작하세요.",
      },
      {
        q: "워크샵은 순서대로 해야 하나요?",
        a: "Phase 1(W01~W06)은 순서대로 하는 것을 권장합니다. 이후 Phase는 관심 있는 워크샵을 자유롭게 선택할 수 있습니다. 각 워크샵 상세 페이지에서 '사전 준비' 항목을 확인하세요.",
      },
      {
        q: "학습 진도는 어떻게 확인하나요?",
        a: "AI 앱 개발 → 학습 진도 대시보드에서 Phase별 완료 현황과 다음 추천 워크샵을 확인할 수 있습니다. 마이페이지에서도 전체 학습 통계를 볼 수 있습니다.",
      },
      {
        q: "바이브코딩 워크샵이란 무엇인가요?",
        a: "마크다운 레시피(MD 파일)를 AI 코딩 도구(Claude Code, Cursor 등)에 전달하면 실제 동작하는 웹앱이 만들어지는 실습입니다. Part A에서 핵심 개념을 배우고, Part B에서 실제 앱을 완성합니다.",
      },
      {
        q: "AI 엔지니어링 12강과 워크샵의 차이는?",
        a: "12강은 AI 기법(프롬프트, RAG, 에이전트 등)을 체계적으로 배우는 이론+실습 과정입니다. 워크샵은 이 기법들을 활용해 실제 앱(챗봇, 번역기, 대시보드 등)을 만드는 프로젝트 과정입니다.",
      },
    ],
  },
  {
    id: "tech",
    title: "기술 · 오류",
    icon: "🔧",
    items: [
      {
        q: "코드가 실행되지 않아요.",
        a: "브라우저를 새로고침(Cmd+Shift+R)해 보세요. 그래도 안 되면 런타임 재시작 버튼(🔄 리셋)을 클릭하세요. Python/JavaScript 런타임이 브라우저에서 초기화됩니다.",
      },
      {
        q: "에러 메시지가 나와요.",
        a: "에러 메시지를 읽어보세요 — 대부분 한국어 설명이 포함되어 있습니다. 힌트 보기를 활용하면 해결 방법을 안내받을 수 있습니다. 그래도 해결이 안 되면 게시판에 에러 메시지와 함께 질문해 주세요.",
      },
      {
        q: "작성한 코드가 사라졌어요.",
        a: "로그인 상태에서 작성한 코드는 자동 저장됩니다. 비로그인 상태에서는 브라우저 데이터를 지우면 사라질 수 있습니다. 중요한 코드는 로그인 후 작업하는 것을 권장합니다.",
      },
      {
        q: "지원하는 브라우저는 무엇인가요?",
        a: "Chrome, Edge, Safari 최신 버전을 권장합니다. Firefox에서도 대부분 동작하지만, 일부 기능(Web Speech API 등)이 제한될 수 있습니다. Internet Explorer는 지원하지 않습니다.",
      },
      {
        q: "API 키는 어떻게 발급받나요?",
        a: "AI 엔지니어링 실습과 워크샵에서는 Gemini API 키가 필요합니다. Google AI Studio(aistudio.google.com)에서 무료로 발급받을 수 있으며, 실습 페이지 상단의 '🔑 키 등록' 버튼에서 등록하세요.",
      },
    ],
  },
];

/* ─── 컴포넌트 ─── */
export function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // 검색 필터
  const filteredData = FAQ_DATA
    .filter((cat) => !selectedCategory || cat.id === selectedCategory)
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          !search ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const totalCount = FAQ_DATA.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">자주 묻는 질문</h1>
          <p className="text-sm text-brand-textDim">
            {totalCount}개의 질문과 답변이 준비되어 있습니다
          </p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="질문을 검색하세요..."
            className="w-full px-4 py-3 rounded-xl bg-brand-panel border border-brand-subtle
                       text-brand-text text-sm placeholder:text-brand-textDim/50
                       focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${!selectedCategory
                ? "bg-brand-accent/15 text-brand-accent border border-brand-accent/30"
                : "bg-brand-panel text-brand-textDim border border-brand-subtle hover:border-brand-accent/30"
              }`}
          >
            전체
          </button>
          {FAQ_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${selectedCategory === cat.id
                  ? "bg-brand-accent/15 text-brand-accent border border-brand-accent/30"
                  : "bg-brand-panel text-brand-textDim border border-brand-subtle hover:border-brand-accent/30"
                }`}
            >
              {cat.icon} {cat.title}
            </button>
          ))}
        </div>

        {/* FAQ 목록 */}
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-brand-textDim text-sm">
            검색 결과가 없습니다
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((cat) => (
              <div key={cat.id}>
                <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>{cat.icon}</span>
                  {cat.title}
                </h2>
                <div className="space-y-2">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.id}-${idx}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-brand-subtle overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-start gap-3 p-4 text-left hover:bg-brand-panel/60 transition-colors"
                        >
                          <span className="shrink-0 text-brand-accent text-sm mt-0.5">Q</span>
                          <span className="flex-1 text-sm font-medium text-brand-text">{item.q}</span>
                          <span className={`shrink-0 text-brand-textDim transition-transform ${isOpen ? "rotate-180" : ""}`}>
                            ▾
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pl-10">
                            <p className="text-sm text-brand-textDim leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 하단 */}
        <div className="mt-12 text-center">
          <p className="text-xs text-brand-textDim mb-2">
            찾는 답변이 없으신가요?
          </p>
          <Link
            to="/"
            className="text-sm text-brand-accent hover:underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
