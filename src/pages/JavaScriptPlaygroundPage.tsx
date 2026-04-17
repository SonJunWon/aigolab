import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNotebookStore } from "../store/notebookStore";
import { useAutoSaveStore } from "../store/autoSaveStore";
import { downloadIpynb } from "../utils/exportNotebook";
import { Notebook } from "../components/notebook/Notebook";
import { useLanguageRuntime } from "../hooks/useLanguageRuntime";
import { useAutoSave } from "../hooks/useAutoSave";
import { loadNotebook } from "../storage/notebookRepo";

const PLAYGROUND_ID = "playground:javascript";

const DEFAULT_CELLS = [
  {
    type: "markdown" as const,
    source: `# 📜 JavaScript Playground

자유롭게 JavaScript 코드를 작성하고 실험해보세요.
\`console.log()\`로 출력하고, 셀 단위로 실행할 수 있어요.

작성한 코드는 **자동으로 저장**됩니다.`,
  },
  {
    type: "code" as const,
    source: `// 여기에 JavaScript 코드를 작성하세요
console.log("Hello, JavaScript Playground!");

// 변수, 함수, 배열, 객체 등 자유롭게 실험해보세요
const fruits = ["사과", "바나나", "딸기"];
fruits.forEach((fruit, i) => console.log(\`\${i + 1}. \${fruit}\`));
`,
  },
];

export function JavaScriptPlaygroundPage() {
  const cells = useNotebookStore((s) => s.cells);
  const loadCells = useNotebookStore((s) => s.loadCells);
  const { status, version } = useLanguageRuntime("javascript");
  const saveStatus = useAutoSaveStore((s) => s.status);
  const [loadState, setLoadState] = useState<"loading" | "ready">("loading");

  useAutoSave(PLAYGROUND_ID, loadState === "ready");

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");

    (async () => {
      const saved = await loadNotebook(PLAYGROUND_ID);
      if (cancelled) return;

      if (saved && saved.cells.length > 0) {
        loadCells(saved.cells, "javascript");
      } else {
        loadCells(DEFAULT_CELLS, "javascript");
      }
      setLoadState("ready");
    })();

    return () => { cancelled = true; };
  }, [loadCells]);

  const statusDot = {
    idle:    { cls: "bg-colab-textDim", title: "대기" },
    loading: { cls: "bg-colab-yellow animate-pulse", title: "JavaScript 런타임 로딩 중..." },
    ready:   { cls: "bg-colab-green", title: `JavaScript ${version ?? ""} 준비됨` },
    error:   { cls: "bg-colab-red", title: "로딩 실패" },
  }[status];

  const saveLabel =
    {
      idle:   { cls: "text-colab-textDim",              text: "저장 대기" },
      dirty:  { cls: "text-colab-yellow",               text: "● 변경됨" },
      saving: { cls: "text-colab-yellow animate-pulse", text: "● 저장 중..." },
      saved:  { cls: "text-colab-green",                text: "✓ 저장됨" },
      error:  { cls: "text-colab-red",                  text: "✕ 저장 실패" },
    }[saveStatus] ?? { cls: "text-colab-textDim", text: "저장 대기" };

  return (
    <div className="min-h-screen bg-colab-bg flex flex-col">
      <div className="border-b border-colab-subtle bg-colab-bg sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/coding" className="text-sm text-colab-textDim hover:text-colab-accent transition-colors" title="코딩 실습으로">
              ←
            </Link>
            <span className="text-lg">📜</span>
            <div>
              <h1 className="text-base font-medium text-colab-text">JavaScript Playground</h1>
              <p className="text-[11px] text-colab-textDim">자유롭게 코딩하고 실험하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadIpynb(cells, "playground-js.ipynb")}
              className="px-3 py-1 text-xs rounded border border-colab-subtle text-colab-textDim hover:text-colab-text hover:border-colab-accent transition-colors"
              title=".ipynb 파일로 다운로드"
            >
              ↓ .ipynb
            </button>
            <span className={`text-[11px] ${saveLabel.cls}`}>{saveLabel.text}</span>
            <span className={`w-2 h-2 rounded-full ${statusDot.cls}`} title={statusDot.title} />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Notebook showToolbar={false} />
      </div>
    </div>
  );
}
