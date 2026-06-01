/**
 * AiTryCell — 친화 강의용 "AI에게 직접 물어보기" 입력창.
 *
 * 코드 없이 프롬프트를 입력해 실제 chat() 을 호출하고 답을 보여준다.
 * cell.source 는 JSON: { title?, prompt?, placeholder?, note?, showTemp? }
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { chat, LlmError } from "../../lib/llm";
import type { Cell } from "../../types/notebook";

interface Props {
  cell: Cell;
  isSelected: boolean;
}

interface Config {
  title?: string;
  prompt?: string;
  placeholder?: string;
  note?: string;
  showTemp?: boolean;
  /** "offline"(WebLLM·키 불필요, 기본) | "fast"(클라우드, 키 필요) */
  task?: "offline" | "fast" | "reasoning";
}

export function AiTryCell({ cell }: Props) {
  const cfg = useMemo<Config>(() => {
    try {
      return JSON.parse(cell.source || "{}");
    } catch {
      return {};
    }
  }, [cell.source]);

  const [input, setInput] = useState(cfg.prompt ?? "");
  const [temp, setTemp] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [needKey, setNeedKey] = useState(false);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<
    { phase: "downloading" | "loading" | "ready"; pct: number } | null
  >(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    setAnswer("");
    setError("");
    setNeedKey(false);
    setProgress(null);
    try {
      const res = await chat(
        {
          messages: [{ role: "user", content: text }],
          // 기본은 키 불필요 브라우저 AI(WebLLM) — 일반 사용자가 설정 없이 바로 체험.
          task: cfg.task ?? "offline",
          ...(cfg.showTemp ? { temperature: temp } : {}),
        },
        {
          onProgress: (e) =>
            setProgress({ phase: e.phase, pct: Math.round((e.progress ?? 0) * 100) }),
        },
      );
      setProgress(null);
      setAnswer(res.text);
    } catch (e) {
      if (e instanceof LlmError && e.reason === "missing-key") {
        setNeedKey(true);
      } else {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className="my-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🤖</span>
        <span className="font-semibold text-sm text-emerald-300">
          {cfg.title ?? "AI에게 직접 물어보기"}
        </span>
      </div>
      {cfg.note && (
        <p className="text-xs text-brand-textDim mb-2 whitespace-pre-line">{cfg.note}</p>
      )}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={cfg.placeholder ?? "여기에 입력해보세요..."}
        rows={3}
        className="w-full rounded-lg bg-brand-bg/60 border border-brand-subtle px-3 py-2 text-sm
                   text-brand-text resize-y focus:outline-none focus:border-emerald-400/60"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
        }}
      />

      <div className="flex items-center gap-3 mt-2 flex-wrap">
        {cfg.showTemp && (
          <div className="flex items-center gap-1 text-xs text-brand-textDim">
            🎚️ 자유도:
            {[0, 1].map((t) => (
              <button
                key={t}
                onClick={() => setTemp(t)}
                className={`px-2 py-0.5 rounded-md border text-xs transition-colors
                  ${temp === t
                    ? "bg-emerald-500/30 border-emerald-400/60 text-emerald-200"
                    : "border-brand-subtle text-brand-textDim hover:text-brand-text"}`}
              >
                {t === 0 ? "0 (안정)" : "1 (다양)"}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="ml-auto px-4 py-1.5 rounded-lg text-sm font-medium text-white
                     bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "생각 중…" : "▶ 보내기"}
        </button>
      </div>

      {loading && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
            <span>
              {progress?.phase === "downloading"
                ? "🧠 첫 실행이에요! 브라우저 AI를 내려받는 중… (한 번만 받으면 다음부턴 빨라요)"
                : progress?.phase === "loading"
                  ? "⏳ AI 모델을 준비하는 중…"
                  : "💭 AI가 생각하는 중…"}
            </span>
            {progress && progress.pct > 0 && <span className="tabular-nums">{progress.pct}%</span>}
          </div>
          <div className="h-2 rounded-full bg-brand-bg/70 overflow-hidden">
            <div
              className={`h-full bg-emerald-500 transition-all duration-300 ${
                progress && progress.pct > 0 ? "" : "animate-pulse w-1/3"
              }`}
              style={progress && progress.pct > 0 ? { width: `${progress.pct}%` } : undefined}
            />
          </div>
        </div>
      )}

      {needKey && (
        <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs text-amber-200">
          🔑 실제 AI를 쓰려면 무료 API 키 등록이 필요해요.{" "}
          <Link to="/my/api-keys" className="underline font-medium">키 등록하기 →</Link>
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300">
          ⚠️ {error}
        </div>
      )}
      {answer && (
        <div className="mt-3 rounded-lg bg-brand-bg/50 border border-brand-subtle px-3 py-2">
          <div className="text-[11px] text-brand-textDim mb-1">💬 AI 답변</div>
          <div className="text-sm whitespace-pre-wrap text-brand-text">{answer}</div>
        </div>
      )}
    </div>
  );
}
