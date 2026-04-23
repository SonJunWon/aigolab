/**
 * AIGoLab 챗봇 — 플로팅 위젯.
 *
 * - 우하단 플로팅 버튼 → 클릭하면 채팅 패널 오픈
 * - Groq → Gemini 릴레이 (기존 LLM 라우터 활용)
 * - @관리자 멘션 시 Supabase에 문의 저장
 * - 로그인 사용자만 사용 가능
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { chat, getKey } from "../../lib/llm";
import { CHATBOT_SYSTEM_PROMPT } from "./systemPrompt";
import { createInquiry, listMyInquiries, type AdminInquiry } from "../../storage/supabaseInquiryRepo";
import { sendTelegramNotification } from "../../lib/telegramNotify";
import type { Message } from "../../lib/llm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isAdminMention?: boolean;
}

export function ChatBot() {
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"chat" | "inquiries">("chat");
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasKey, setHasKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // 문의 목록 + 미확인 답변 카운트 갱신
  useEffect(() => {
    if (!user) return;
    (async () => {
      const list = await listMyInquiries(user.id);
      setInquiries(list);
      // 읽음 상태는 localStorage에서 관리
      const readKey = `aigolab-read-replies-${user.id}`;
      const readIds: string[] = JSON.parse(localStorage.getItem(readKey) ?? "[]");
      const unread = list.filter((i) => i.status === "replied" && !readIds.includes(i.id)).length;
      setUnreadCount(unread);
    })();
  }, [user, isOpen, tab]);

  // API 키 확인 — getKey는 Promise를 반환하므로 비동기로 풀어서 상태에 저장한다.
  // 사용자가 다른 탭에서 키를 등록한 뒤 챗봇을 열 수도 있으므로 isOpen 변경 시마다 재검사.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [groq, gemini] = await Promise.all([getKey("groq"), getKey("gemini")]);
        if (!cancelled) setHasKey(!!(groq || gemini));
      } catch {
        if (!cancelled) setHasKey(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isOpen, user]);

  // 메시지 전송
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !user) return;

    setInput("");
    setError(null);

    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      timestamp: Date.now(),
      isAdminMention: text.includes("@관리자"),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history: Message[] = [
        { role: "system", content: CHATBOT_SYSTEM_PROMPT },
        ...messages.slice(-20).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: text },
      ];

      const res = await chat({
        messages: history,
        task: "fast",
      });

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (text.includes("@관리자")) {
        const cleanQuestion = text.replace("@관리자", "").trim();
        await createInquiry({
          userId: user.id,
          userEmail: user.email ?? "",
          question: cleanQuestion,
          aiResponse: res.text,
        });
        // 텔레그램으로 관리자 알림 (서버 프록시 경유, 사용자 이메일은 JWT 에서 도출)
        sendTelegramNotification({
          question: cleanQuestion,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "응답을 받지 못했어요.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, user]);

  // 로그인 안 된 상태면 렌더링 안 함 — 모든 hooks 이후에 배치
  if (!user) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 group">
          {/* 말풍선 툴팁 */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg
                          bg-brand-panel border border-brand-subtle shadow-lg
                          text-xs text-brand-text whitespace-nowrap
                          opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                          transition-all duration-300 pointer-events-none">
            무엇이든 물어보세요!
            <div className="absolute top-full right-5 w-2 h-2 bg-brand-panel border-r border-b border-brand-subtle rotate-45 -translate-y-1" />
          </div>
          {/* 펄스 링 */}
          <div className="absolute inset-0 rounded-full bg-brand-accent/20 animate-ping" />
          {/* 버튼 */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full
                       bg-gradient-to-r from-brand-accent to-cyan-500 text-white
                       shadow-lg shadow-brand-accent/30
                       hover:shadow-2xl hover:shadow-brand-accent/40 hover:scale-110
                       active:scale-95
                       transition-all duration-200 ease-out
                       flex items-center justify-center text-2xl"
            title="AI 도우미"
          >
            💬
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* 채팅 패널 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[520px]
                        flex flex-col rounded-2xl border border-brand-subtle bg-brand-bg
                        shadow-2xl shadow-black/30 overflow-hidden">
          {/* 헤더 */}
          <div className="border-b border-brand-subtle bg-brand-panel/80">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span className="text-sm font-semibold text-brand-text">AI 도우미</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-textDim
                           hover:bg-brand-hover hover:text-brand-text transition-colors text-sm"
              >
                ✕
              </button>
            </div>
            {/* 탭 */}
            <div className="flex px-4 gap-1">
              <button
                onClick={() => setTab("chat")}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors
                  ${tab === "chat" ? "text-brand-accent border-brand-accent" : "text-brand-textDim border-transparent hover:text-brand-text"}`}
              >
                채팅
              </button>
              <button
                onClick={() => setTab("inquiries")}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors relative
                  ${tab === "inquiries" ? "text-brand-accent border-brand-accent" : "text-brand-textDim border-transparent hover:text-brand-text"}`}
              >
                내 문의
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ─── 내 문의 탭 ─── */}
          {tab === "inquiries" && (
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {inquiries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-2xl mb-2">📩</div>
                  <p className="text-sm text-brand-textDim">아직 문의 내역이 없습니다</p>
                  <p className="text-xs text-brand-textDim mt-1">채팅에서 @관리자를 입력하면 관리자에게 문의할 수 있어요</p>
                </div>
              ) : (
                inquiries.map((inq) => {
                  const isReplied = inq.status === "replied";
                  const readKey = `aigolab-read-replies-${user!.id}`;
                  const readIds: string[] = JSON.parse(localStorage.getItem(readKey) ?? "[]");
                  const isUnread = isReplied && !readIds.includes(inq.id);
                  return (
                    <div
                      key={inq.id}
                      className={`rounded-xl border p-3 text-sm space-y-2
                        ${isUnread ? "border-brand-accent/50 bg-brand-accent/5" : "border-brand-subtle bg-brand-panel/40"}`}
                      onClick={() => {
                        if (isUnread && user) {
                          const rk = `aigolab-read-replies-${user.id}`;
                          const ids: string[] = JSON.parse(localStorage.getItem(rk) ?? "[]");
                          if (!ids.includes(inq.id)) { ids.push(inq.id); localStorage.setItem(rk, JSON.stringify(ids)); }
                          setUnreadCount((c) => Math.max(0, c - 1));
                        }
                      }}
                    >
                      {/* 상태 + 날짜 */}
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium
                          ${isReplied ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                          {isReplied ? "✅ 답변 완료" : "⏳ 대기 중"}
                        </span>
                        {isUnread && <span className="text-[9px] text-brand-accent font-medium">NEW</span>}
                        <span className="text-[10px] text-brand-textDim ml-auto">
                          {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      {/* 내 질문 */}
                      <div>
                        <div className="text-[10px] text-brand-textDim mb-0.5">내 질문</div>
                        <div className="text-xs text-brand-text">{inq.question}</div>
                      </div>
                      {/* 관리자 답변 */}
                      {inq.admin_reply && (
                        <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                          <div className="text-[10px] text-emerald-400 mb-0.5">🛡️ 관리자 답변</div>
                          <div className="text-xs text-brand-text">{inq.admin_reply}</div>
                        </div>
                      )}
                      {/* AI 답변 */}
                      {!inq.admin_reply && inq.ai_response && (
                        <div>
                          <div className="text-[10px] text-brand-textDim mb-0.5">🤖 AI 답변</div>
                          <div className="text-xs text-brand-textDim">{inq.ai_response}</div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ─── 채팅 탭: 메시지 영역 ─── */}
          {tab === "chat" && <>
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* 환영 메시지 */}
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">🤖</div>
                <p className="text-sm text-brand-text font-medium mb-1">안녕하세요!</p>
                <p className="text-xs text-brand-textDim leading-relaxed">
                  학습 질문, 에러 해결, 서비스 이용법 등
                  <br />무엇이든 물어보세요.
                </p>
                {!hasKey && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                    채팅을 사용하려면 Gemini 또는 Groq API 키를 등록해주세요.
                    AI 엔지니어링 실습 페이지에서 등록할 수 있습니다.
                  </div>
                )}
                <div className="mt-4 space-y-1.5">
                  {["Python 입문은 어디서 시작하나요?", "워크샵 순서가 궁금해요", "PRO는 어떻게 이용하나요?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      className="block w-full text-left px-3 py-2 rounded-lg border border-brand-subtle
                                 text-xs text-brand-textDim hover:border-brand-accent/40 hover:text-brand-accent transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed
                    ${msg.role === "user"
                      ? "bg-brand-accent/20 text-brand-text rounded-br-sm"
                      : "bg-brand-panel border border-brand-subtle text-brand-text rounded-bl-sm"
                    }`}
                >
                  {msg.isAdminMention && (
                    <div className="text-[10px] text-amber-400 mb-1">📩 관리자에게 전달됩니다</div>
                  )}
                  <div className="whitespace-pre-line">{msg.content}</div>
                  <div className="text-[9px] text-brand-textDim mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl bg-brand-panel border border-brand-subtle rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-brand-textDim animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-brand-textDim animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-brand-textDim animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="border-t border-brand-subtle px-3 py-3 bg-brand-panel/60">
            <div className="text-[9px] text-brand-textDim mb-1.5 px-1">
              💡 @관리자 를 입력하면 관리자에게 직접 문의할 수 있어요
            </div>
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasKey ? "질문을 입력하세요..." : "API 키를 먼저 등록해주세요"}
                disabled={!hasKey || loading}
                rows={1}
                className="flex-1 px-3 py-2 rounded-lg bg-brand-bg border border-brand-subtle
                           text-sm text-brand-text placeholder:text-brand-textDim/50 resize-none
                           focus:outline-none focus:border-brand-accent disabled:opacity-50
                           transition-colors"
                style={{ maxHeight: "80px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !hasKey || loading}
                className="shrink-0 w-9 h-9 rounded-lg bg-brand-accent text-white flex items-center justify-center
                           hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </div>
          </>}
        </div>
      )}
    </>
  );
}
