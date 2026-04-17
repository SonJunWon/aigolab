import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNotebookStore } from "../store/notebookStore";
import { useAutoSaveStore } from "../store/autoSaveStore";
import { downloadIpynb } from "../utils/exportNotebook";
import { Notebook } from "../components/notebook/Notebook";
import { useLanguageRuntime } from "../hooks/useLanguageRuntime";
import { useAutoSave } from "../hooks/useAutoSave";
import { loadNotebook } from "../storage/notebookRepo";

const PLAYGROUND_ID = "playground:sql:v2";

const DEFAULT_CELLS = [
  {
    type: "markdown" as const,
    source: `# 🗄️ SQL Playground

자유롭게 SQL 쿼리를 작성하고 실행해보세요.
브라우저 내장 SQLite 데이터베이스에 **Chinook 샘플 데이터**가 준비되어 있습니다.

SELECT 결과는 테이블 형태로, INSERT/UPDATE/DELETE 결과는 텍스트로 표시됩니다.

### 샘플 테이블 (단수형, 첫 글자 대문자)
\`Artist\`, \`Album\`, \`Track\`, \`Genre\`, \`Customer\`, \`Invoice\`, \`InvoiceLine\`, \`Employee\`, \`MediaType\`, \`Playlist\`, \`PlaylistTrack\``,
  },
  {
    type: "code" as const,
    source: `-- 아티스트 목록 조회 (상위 10개)
SELECT ArtistId, Name
FROM Artist
LIMIT 10;`,
  },
  {
    type: "code" as const,
    source: `-- 장르별 트랙 수 조회
SELECT g.Name AS Genre, COUNT(*) AS TrackCount
FROM Track t
JOIN Genre g ON t.GenreId = g.GenreId
GROUP BY g.Name
ORDER BY TrackCount DESC;`,
  },
];

export function SqlPlaygroundPage() {
  const cells = useNotebookStore((s) => s.cells);
  const loadCells = useNotebookStore((s) => s.loadCells);
  const { status, version } = useLanguageRuntime("sql");
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
        loadCells(saved.cells, "sql");
      } else {
        loadCells(DEFAULT_CELLS, "sql");
      }
      setLoadState("ready");
    })();

    return () => { cancelled = true; };
  }, [loadCells]);

  const statusDot = {
    idle:    { cls: "bg-colab-textDim", title: "대기" },
    loading: { cls: "bg-colab-yellow animate-pulse", title: "SQLite 로딩 중..." },
    ready:   { cls: "bg-colab-green", title: `SQLite ${version ?? ""} 준비됨` },
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
            <span className="text-lg">🗄️</span>
            <div>
              <h1 className="text-base font-medium text-colab-text">SQL Playground</h1>
              <p className="text-[11px] text-colab-textDim">Chinook 샘플 DB로 자유롭게 쿼리 실습</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadIpynb(cells, "playground-sql.ipynb")}
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
