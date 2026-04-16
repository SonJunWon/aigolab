/**
 * AgentTraceViewer — chatWithTools 의 onStep 이벤트를 타임라인으로 시각화.
 *
 * 각 step 이 카드로 표시: [🧠 생각] → [🔧 도구: name] → [📨 결과: ...] → [✅ 답변]
 * 보라색 세로 타임라인 바 + 좌측 dot + 우측 내용 카드.
 * 스트리밍 중엔 마지막 카드에 pulse 애니메이션.
 */

import type { OutputChunk } from "../../types/notebook";

interface Props {
  steps: OutputChunk[];
}

const icons: Record<string, string> = {
  think: "🧠",
  "tool-call": "🔧",
  "tool-result": "📨",
  answer: "✅",
};

const labels: Record<string, string> = {
  think: "생각 중",
  "tool-call": "도구 호출",
  "tool-result": "결과 수신",
  answer: "최종 답변",
};

const dotColors: Record<string, string> = {
  think: "bg-brand-primary",
  "tool-call": "bg-brand-accent",
  "tool-result": "bg-colab-green",
  answer: "bg-colab-green",
};

export function AgentTraceViewer({ steps }: Props) {
  if (steps.length === 0) return null;

  return (
    <div className="px-4 py-3 border-b border-colab-subtle/40 bg-brand-primary/5">
      <div className="text-[11px] text-brand-primary font-medium mb-3 flex items-center gap-1.5">
        <span>🤖</span>
        <span>에이전트 실행 로그</span>
        <span className="text-colab-textDim">({steps.length} 단계)</span>
      </div>

      <div className="relative pl-6">
        {/* 세로 타임라인 바 */}
        <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-brand-primary/20" />

        {steps.map((chunk, i) => {
          const step = chunk.agentStep;
          if (!step) return null;
          const icon = icons[step.type] ?? "❓";
          const label = labels[step.type] ?? step.type;
          const dotColor = dotColors[step.type] ?? "bg-colab-textDim";
          const isLast = i === steps.length - 1;

          return (
            <div key={i} className="relative mb-3 last:mb-0">
              {/* 좌측 dot */}
              <div
                className={`absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full ${dotColor} ${
                  isLast ? "animate-pulse" : ""
                }`}
              />
              {/* 카드 */}
              <div className="ml-2 p-2.5 rounded-lg bg-colab-bg/80 border border-colab-subtle/50">
                <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                  <span>{icon}</span>
                  <span className="font-medium text-colab-text">{label}</span>
                  {step.agentName && (
                    <span className="text-colab-textDim">· {step.agentName}</span>
                  )}
                </div>
                <pre className="m-0 text-[12px] text-colab-text font-mono whitespace-pre-wrap break-words leading-relaxed">
                  {step.content}
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
