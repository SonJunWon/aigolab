import { useNotebookStore } from "../../store/notebookStore";
import { useNotebookShortcuts } from "../../hooks/useNotebookShortcuts";
import { CellShell } from "./CellShell";
import { Toolbar } from "./Toolbar";

interface Props {
  /** 최상단에 Toolbar(제목 + 액션) 표시 여부. Lesson 모드에서는 false. */
  showToolbar?: boolean;
}

export function Notebook({ showToolbar = true }: Props) {
  const cells = useNotebookStore((s) => s.cells);
  const selectedCellId = useNotebookStore((s) => s.selectedCellId);
  const selectCell = useNotebookStore((s) => s.selectCell);
  const addCellAtEnd = useNotebookStore((s) => s.addCellAtEnd);

  // 글로벌 단축키 등록
  useNotebookShortcuts();

  return (
    <div className="flex flex-col bg-colab-bg min-h-full">
      {showToolbar && <Toolbar />}

      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-6">
        <div className="space-y-2">
          {cells.map((cell) => (
            <CellShell
              key={cell.id}
              cell={cell}
              isSelected={selectedCellId === cell.id}
              onSelect={() => selectCell(cell.id)}
            />
          ))}
        </div>

        {/* 하단 셀 추가 버튼 */}
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => addCellAtEnd("code")}
            className="px-4 py-1.5 text-xs rounded border border-colab-subtle text-colab-text
                       hover:bg-colab-hover transition-colors"
          >
            + 코드
          </button>
          <button
            onClick={() => addCellAtEnd("markdown")}
            className="px-4 py-1.5 text-xs rounded border border-colab-subtle text-colab-text
                       hover:bg-colab-hover transition-colors"
          >
            + 텍스트
          </button>
        </div>
      </main>
    </div>
  );
}
