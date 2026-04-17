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
import { saveAdminInquiry } from "./adminInquiry";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // API 키 확인
  const hasKey = !!(getKey("groq") || getKey("gemini"));

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
        await saveAdminInquiry({
          userId: user.id,
          userEmail: user.email ?? "",
          question: text,
          aiResponse: res.text,
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
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                     bg-gradient-to-r from-brand-accent to-cyan-500 text-white
                     shadow-lg shadow-brand-accent/30 hover:shadow-xl hover:scale-105
                     transition-all flex items-center justify-center text-2xl"
          title="AI 도우미"
        >
          💬
        </button>
      )}

      {/* 채팅 패널 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[520px]
                        flex flex-col rounded-2xl border border-brand-subtle bg-brand-bg
                        shadow-2xl shadow-black/30 overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-subtle bg-brand-panel/80">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <div className="text-sm font-semibold text-brand-text">AI 도우미</div>
                <div className="text-[10px] text-brand-textDim">학습 질문, 오류 해결, 서비스 안내</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-textDim
                         hover:bg-brand-hover hover:text-brand-text transition-colors"
            >
              ✕
            </button>
          </div>

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
        </div>
      )}
    </>
  );
}
