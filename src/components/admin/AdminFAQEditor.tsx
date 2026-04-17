/**
 * 관리자 — FAQ 편집기 (정적 데이터 기반).
 *
 * 현재는 코드 내 데이터를 보여주고 수정 가이드를 안내합니다.
 * 추후 Supabase 연동 시 실시간 CRUD로 전환.
 */

import { useState } from "react";

interface FAQItem {
  q: string;
  category: string;
}

// FAQPage 의 카테고리별 질문 수 요약
const FAQ_SUMMARY = [
  { id: "general", title: "💡 일반", count: 7 },
  { id: "account", title: "👤 회원", count: 6 },
  { id: "pro", title: "⭐ PRO · 구독", count: 6 },
  { id: "learning", title: "📚 학습", count: 7 },
  { id: "tech", title: "🔧 기술 · 오류", count: 8 },
];

// 대표 질문 목록 (전체는 FAQPage.tsx 에서 관리)
const FAQ_QUESTIONS: FAQItem[] = [
  { q: "AIGoLab은 무엇인가요?", category: "general" },
  { q: "AIGoLab에는 어떤 학습 콘텐츠가 있나요?", category: "general" },
  { q: "프로그래밍을 처음 배우는데 가능한가요?", category: "general" },
  { q: "설치해야 하는 프로그램이 있나요?", category: "general" },
  { q: "회원가입은 어떻게 하나요?", category: "account" },
  { q: "이메일 확인 메일이 오지 않아요.", category: "account" },
  { q: "비밀번호를 잊었어요.", category: "account" },
  { q: "PRO와 일반(FREE)의 차이는 무엇인가요?", category: "pro" },
  { q: "PRO는 어떻게 이용할 수 있나요?", category: "pro" },
  { q: "FREE 콘텐츠만으로도 충분히 배울 수 있나요?", category: "pro" },
  { q: "어디서부터 시작하면 좋을까요?", category: "learning" },
  { q: "바이브코딩 워크샵이란 무엇인가요?", category: "learning" },
  { q: "코드가 실행되지 않아요.", category: "tech" },
  { q: "API 키는 어떻게 발급받나요?", category: "tech" },
  { q: "API 키가 작동하지 않아요.", category: "tech" },
];

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-emerald-500/15 text-emerald-400",
  account: "bg-blue-500/15 text-blue-400",
  pro: "bg-amber-500/15 text-amber-400",
  learning: "bg-violet-500/15 text-violet-400",
  tech: "bg-orange-500/15 text-orange-400",
};

export function AdminFAQEditor() {
  const [filter, setFilter] = useState<string | null>(null);
  const totalCount = FAQ_SUMMARY.reduce((sum, c) => sum + c.count, 0);
  const filtered = filter
    ? FAQ_QUESTIONS.filter((q) => q.category === filter)
    : FAQ_QUESTIONS;

  return (
    <div>
      {/* 안내 */}
      <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
        현재 FAQ는 코드 내 정적 데이터로 관리됩니다.
        수정하려면 <code className="px-1.5 py-0.5 bg-brand-bg rounded text-xs">src/pages/FAQPage.tsx</code> 의 FAQ_DATA 배열을 편집하세요.
        추후 Supabase 연동 시 이 화면에서 직접 CRUD가 가능해집니다.
      </div>

      {/* 카테고리별 통계 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {FAQ_SUMMARY.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(filter === cat.id ? null : cat.id)}
            className={`p-3 rounded-xl border text-center transition-colors
              ${filter === cat.id
                ? "border-brand-accent/50 bg-brand-accent/10"
                : "border-brand-subtle bg-brand-panel/60 hover:border-brand-accent/30"
              }`}
          >
            <div className="text-sm font-medium">{cat.title}</div>
            <div className="text-2xl font-bold text-brand-accent">{cat.count}</div>
          </button>
        ))}
      </div>

      <div className="text-xs text-brand-textDim mb-4">
        총 {totalCount}개 FAQ {filter ? `(${FAQ_SUMMARY.find((c) => c.id === filter)?.title} 필터)` : ""}
      </div>

      {/* 질문 목록 */}
      <div className="space-y-1.5">
        {filtered.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-brand-subtle bg-brand-panel/60">
            <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${CATEGORY_COLORS[item.category] ?? ""}`}>
              {item.category}
            </span>
            <span className="text-sm truncate">{item.q}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
