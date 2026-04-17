/**
 * 관리자 — 공지사항 편집기 (정적 데이터 기반).
 *
 * 현재는 코드 내 데이터를 보여주고 수정 가이드를 안내합니다.
 * 추후 Supabase 연동 시 실시간 CRUD로 전환.
 */

import { useState } from "react";

interface Notice {
  id: string;
  title: string;
  category: string;
  pinned: boolean;
  date: string;
  content: string;
}

// NoticesPage 의 정적 데이터와 동기화 (임포트하지 않고 독립적으로 관리)
const CURRENT_NOTICES: Notice[] = [
  { id: "n001", title: "AIGoLab 서비스를 시작합니다", category: "general", pinned: true, date: "2026-02-01", content: "" },
  { id: "n002", title: "AI 엔지니어링 12강 커리큘럼 완성", category: "update", pinned: false, date: "2026-02-15", content: "" },
  { id: "n003", title: "바이브코딩 워크샵 W00~W40 전체 오픈", category: "update", pinned: true, date: "2026-03-05", content: "" },
  { id: "n004", title: "학습 진도 대시보드 추가", category: "update", pinned: false, date: "2026-03-20", content: "" },
  { id: "n005", title: "PRO 콘텐츠 오픈 예정 안내", category: "general", pinned: false, date: "2026-04-10", content: "" },
];

const CATEGORY_LABELS: Record<string, string> = {
  update: "🚀 업데이트",
  event: "🎉 이벤트",
  maintenance: "🔧 점검",
  general: "📢 일반",
};

export function AdminNoticesEditor() {
  const [notices] = useState(CURRENT_NOTICES);

  return (
    <div>
      {/* 안내 */}
      <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
        현재 공지사항은 코드 내 정적 데이터로 관리됩니다.
        수정하려면 <code className="px-1.5 py-0.5 bg-brand-bg rounded text-xs">src/pages/NoticesPage.tsx</code> 의 NOTICES 배열을 편집하세요.
        추후 Supabase 연동 시 이 화면에서 직접 CRUD가 가능해집니다.
      </div>

      {/* 현재 등록된 공지 목록 */}
      <div className="space-y-2">
        {notices.map((n) => (
          <div key={n.id} className="flex items-center gap-3 p-3 rounded-lg border border-brand-subtle bg-brand-panel/60">
            <span className="text-xs text-brand-textDim shrink-0">{n.id}</span>
            {n.pinned && <span className="text-xs shrink-0">📌</span>}
            <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium
              ${n.category === "update" ? "bg-brand-accent/15 text-brand-accent" : "bg-brand-textDim/15 text-brand-textDim"}`}>
              {CATEGORY_LABELS[n.category] ?? n.category}
            </span>
            <span className="flex-1 text-sm truncate">{n.title}</span>
            <span className="text-xs text-brand-textDim shrink-0">{n.date}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-brand-textDim">
        총 {notices.length}개 공지사항
      </div>
    </div>
  );
}
