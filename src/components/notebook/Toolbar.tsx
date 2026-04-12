import { useNotebookStore } from "../../store/notebookStore";
import { usePyodideStatus } from "../../hooks/usePyodideStatus";
import { downloadIpynb } from "../../utils/exportNotebook";

/**
 * 노트북 상단 툴바 (Colab의 메뉴바 + 액션 바 영감).
 */
export function Toolbar() {
  const cells = useNotebookStore((s) => s.cells);
  const addCellAtEnd = useNotebookStore((s) => s.addCellAtEnd);
  const selectedCellId = useNotebookStore((s) => s.selectedCellId);
  const insertCellBelow = useNotebookStore((s) => s.insertCellBelow);
  const { status, version } = usePyodideStatus();

  const addCell = (type: "code" | "markdown") => {
    if (selectedCellId) insertCellBelow(selectedCellId, type);
    else addCellAtEnd(type);
  };

  const statusInfo = {
    idle:    { label: "대기 중...", color: "text-colab-textDim", dot: "bg-colab-textDim" },
    loading: { label: "Pyodide 로딩 중...", color: "text-colab-yellow", dot: "bg-colab-yellow animate-pulse" },
    ready:   { label: `연결됨 · Python ${version ?? ""}`, color: "text-colab-green", dot: "bg-colab-green" },
    error:   { label: "로딩 실패", color: "text-colab-red", dot: "bg-colab-red" },
  }[status];

  return (
    <div className="sticky top-0 z-10 bg-colab-bg border-b border-colab-subtle">
      {/* 상단: 제목 + 연결 상태 */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg">🐍</span>
          <h1 className="text-base font-medium text-colab-text">
            Untitled.ipynb
          </h1>
          <span className="text-xs text-colab-textDim">Python Notebook v0.2</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${statusInfo.color}`}>
          <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
          {statusInfo.label}
        </div>
      </div>

      {/* 하단: 액션 버튼들 */}
      <div className="flex items-center gap-1 px-4 py-1.5 border-t border-colab-subtle">
        <ToolbarButton onClick={() => addCell("code")} icon="+" label="코드" />
        <ToolbarButton onClick={() => addCell("markdown")} icon="+" label="텍스트" />
        <Divider />
        <ToolbarButton onClick={() => downloadIpynb(cells)} icon="↓" label=".ipynb" />
        <Divider />
        <span className="text-[11px] text-colab-textDim ml-2">
          <kbd>⌘/Ctrl + Enter</kbd> 실행 ·{" "}
          <kbd>Shift + Enter</kbd> 다음 셀 ·{" "}
          <kbd>Alt + Enter</kbd> 새 셀 ·{" "}
          <kbd>Esc</kbd> 그 다음 <kbd>B</kbd>(아래) <kbd>A</kbd>(위) <kbd>D D</kbd>(삭제) <kbd>M</kbd>(텍스트) <kbd>Y</kbd>(코드)
        </span>
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1 rounded text-xs text-colab-text
                 hover:bg-colab-hover transition-colors"
    >
      <span className="text-colab-textDim">{icon}</span>
      {label}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-4 bg-colab-subtle mx-1" />;
}
