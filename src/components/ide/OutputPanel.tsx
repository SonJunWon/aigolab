import { useFileStore } from "../../store/fileStore";

const streamColor: Record<string, string> = {
  stdout: "text-colab-text",
  stderr: "text-colab-red",
  error: "text-colab-red",
  result: "text-colab-green",
  system: "text-colab-textDim italic",
  figure: "text-colab-text",
};

interface Props {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function OutputPanel({ collapsed, onToggle }: Props) {
  const output = useFileStore((s) => s.output);
  const running = useFileStore((s) => s.running);
  const clearOutput = useFileStore((s) => s.clearOutput);

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-colab-subtle bg-colab-bg shrink-0">
        <div className="flex items-center gap-2">
          {onToggle && (
            <button
              onClick={onToggle}
              className="text-[10px] text-colab-textDim hover:text-colab-text transition-colors"
              title={collapsed ? "출력 펼치기" : "출력 접기"}
            >
              {collapsed ? "▶" : "▼"}
            </button>
          )}
          <span className="text-xs font-medium text-colab-textDim uppercase tracking-wider">
            출력
          </span>
          {running && (
            <span className="w-2 h-2 rounded-full bg-colab-yellow animate-pulse" />
          )}
          {!collapsed && output.length > 0 && (
            <span className="text-[10px] text-colab-textDim">
              ({output.length}줄)
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={clearOutput}
            className="text-[11px] text-colab-textDim hover:text-colab-text transition-colors"
          >
            지우기
          </button>
        )}
      </div>

      {/* 출력 로그 */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-4 py-2 bg-colab-bg font-mono text-[13px] leading-relaxed">
          {output.length === 0 ? (
            <span className="text-colab-textDim text-xs italic">
              ▶ Run 을 누르면 결과가 여기에 표시됩니다. (F5 또는 ⌘+Enter)
            </span>
          ) : (
            output.map((line, i) => {
              if (line.stream === "figure" && line.dataUrl) {
                return (
                  <div key={i} className="my-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-colab-textDim uppercase tracking-wider">
                        📊 Figure
                      </span>
                      <a
                        href={line.dataUrl}
                        download={`figure-${i + 1}.png`}
                        className="text-[10px] text-colab-textDim hover:text-colab-accent transition-colors"
                        title="PNG 다운로드"
                      >
                        ↓ PNG
                      </a>
                    </div>
                    <div className="rounded border border-colab-subtle bg-white p-2 inline-block max-w-full">
                      <img
                        src={line.dataUrl}
                        alt={`matplotlib figure ${i + 1}`}
                        className="max-w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              }
              return (
                <pre
                  key={i}
                  className={`m-0 whitespace-pre-wrap break-words ${
                    streamColor[line.stream] ?? "text-colab-text"
                  }`}
                >
                  {line.text}
                </pre>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
