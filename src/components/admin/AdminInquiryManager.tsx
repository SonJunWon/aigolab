/**
 * 관리자 — 사용자 문의 관리 (@관리자 멘션).
 */

import { useCallback, useEffect, useState } from "react";
import {
  listAllInquiries,
  replyToInquiry,
  deleteInquiry,
  type AdminInquiry,
} from "../../storage/supabaseInquiryRepo";

export function AdminInquiryManager() {
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");

  const reload = useCallback(async () => {
    const list = await listAllInquiries();
    setInquiries(list);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = inquiries.filter((i) => {
    if (filter === "pending") return i.status === "pending";
    if (filter === "replied") return i.status === "replied";
    return true;
  });

  const selected = inquiries.find((i) => i.id === selectedId);

  const handleReply = async () => {
    if (!selectedId || !replyText.trim()) return;
    await replyToInquiry(selectedId, replyText.trim());
    setReplyText("");
    setSelectedId(null);
    await reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 문의를 삭제하시겠습니까?")) return;
    await deleteInquiry(id);
    if (selectedId === id) setSelectedId(null);
    await reload();
  };

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;

  return (
    <div>
      {/* 통계 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl border border-brand-subtle bg-brand-panel text-center">
          <div className="text-2xl font-bold text-brand-text">{inquiries.length}</div>
          <div className="text-xs text-brand-textDim">전체 문의</div>
        </div>
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-center">
          <div className="text-2xl font-bold text-amber-400">{pendingCount}</div>
          <div className="text-xs text-brand-textDim">대기 중</div>
        </div>
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center">
          <div className="text-2xl font-bold text-emerald-400">{inquiries.length - pendingCount}</div>
          <div className="text-xs text-brand-textDim">답변 완료</div>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-4">
        {(["all", "pending", "replied"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${filter === f
                ? "bg-brand-accent/15 text-brand-accent border border-brand-accent/30"
                : "bg-brand-panel text-brand-textDim border border-brand-subtle hover:border-brand-accent/30"
              }`}
          >
            {f === "all" ? "전체" : f === "pending" ? "⏳ 대기" : "✅ 답변됨"}
          </button>
        ))}
        <button
          onClick={reload}
          className="ml-auto px-3 py-1.5 rounded-lg text-xs text-brand-textDim border border-brand-subtle hover:border-brand-accent/30 transition-colors"
        >
          ↻ 새로고침
        </button>
      </div>

      {/* 상세 보기 */}
      {selected ? (
        <div className="rounded-xl border border-brand-subtle bg-brand-panel/60 p-5">
          <button
            onClick={() => setSelectedId(null)}
            className="text-xs text-brand-textDim hover:text-brand-accent mb-3"
          >
            ← 목록으로
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
              ${selected.status === "pending" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}>
              {selected.status === "pending" ? "⏳ 대기" : "✅ 답변됨"}
            </span>
            <span className="text-xs text-brand-textDim">{selected.user_email}</span>
            <span className="text-xs text-brand-textDim">{new Date(selected.created_at).toLocaleString("ko-KR")}</span>
          </div>

          <div className="mb-4">
            <div className="text-[10px] text-brand-textDim uppercase tracking-wider mb-1">사용자 질문</div>
            <div className="p-3 rounded-lg bg-brand-bg text-sm">{selected.question}</div>
          </div>

          <div className="mb-4">
            <div className="text-[10px] text-brand-textDim uppercase tracking-wider mb-1">AI 응답</div>
            <div className="p-3 rounded-lg bg-brand-bg text-sm text-brand-textDim">{selected.ai_response}</div>
          </div>

          {selected.admin_reply ? (
            <div className="mb-4">
              <div className="text-[10px] text-brand-textDim uppercase tracking-wider mb-1">관리자 답변</div>
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-sm">{selected.admin_reply}</div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="text-[10px] text-brand-textDim uppercase tracking-wider mb-1">관리자 답변 작성</div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="답변을 입력하세요..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-brand-bg border border-brand-subtle text-sm text-brand-text
                           placeholder:text-brand-textDim/50 focus:outline-none focus:border-brand-accent resize-none"
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="mt-2 px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium
                           hover:brightness-110 disabled:opacity-30 transition-all"
              >
                답변 저장
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 목록 */
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-brand-textDim text-sm border border-dashed border-brand-subtle rounded-xl">
              {inquiries.length === 0 ? "아직 문의가 없습니다" : "해당 필터에 맞는 문의가 없습니다"}
            </div>
          ) : (
            filtered.map((inq) => (
              <div
                key={inq.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-brand-subtle bg-brand-panel/60
                           hover:border-brand-accent/30 transition-colors"
              >
                <button
                  onClick={() => setSelectedId(inq.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                      ${inq.status === "pending" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}>
                      {inq.status === "pending" ? "⏳" : "✅"}
                    </span>
                    <span className="text-xs text-brand-textDim">{inq.user_email}</span>
                    <span className="text-[10px] text-brand-textDim">{new Date(inq.created_at).toLocaleDateString("ko-KR")}</span>
                  </div>
                  <div className="text-sm truncate">{inq.question}</div>
                </button>
                <button
                  onClick={() => handleDelete(inq.id)}
                  className="shrink-0 text-xs text-brand-textDim hover:text-red-400 transition-colors p-1"
                  title="삭제"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
