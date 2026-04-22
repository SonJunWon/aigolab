/**
 * 마크다운 워크스페이스 — /my/markdown
 *
 * 좌측: 파일 탐색기
 * 우측: Monaco 에디터 + 마크다운 미리보기 (분할/편집/미리보기 모드)
 */

import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useMdFileStore } from "../store/mdFileStore";
import { FileExplorer } from "../components/markdown/FileExplorer";

const MonacoEditor = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.default })),
);

type ViewMode = "split" | "edit" | "preview";

export function MdWorkspacePage() {
  const {
    init,
    initialized,
    activeFileId,
    updateFileContent,
    getActiveFile,
    createFile,
  } = useMdFileStore();

  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [localContent, setLocalContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // 초기화
  useEffect(() => {
    init();
  }, [init]);

  // 활성 파일 변경 시 콘텐츠 로드
  useEffect(() => {
    const file = getActiveFile();
    if (file) {
      setLocalContent(file.content);
      setIsDirty(false);
    } else {
      setLocalContent("");
      setIsDirty(false);
    }
  }, [activeFileId, getActiveFile]);

  // 자동 저장 (1.5초 디바운스)
  const handleContentChange = useCallback(
    (value: string | undefined) => {
      const newContent = value ?? "";
      setLocalContent(newContent);
      setIsDirty(true);

      if (saveTimer) clearTimeout(saveTimer);
      const timer = setTimeout(() => {
        if (activeFileId) {
          updateFileContent(activeFileId, newContent);
          setIsDirty(false);
        }
      }, 1500);
      setSaveTimer(timer);
    },
    [activeFileId, updateFileContent, saveTimer],
  );

  // Ctrl+S 수동 저장
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (activeFileId && isDirty) {
          if (saveTimer) clearTimeout(saveTimer);
          updateFileContent(activeFileId, localContent);
          setIsDirty(false);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeFileId, localContent, isDirty, updateFileContent, saveTimer]);

  const activeFile = getActiveFile();
  const charCount = localContent.length;
  const lineCount = localContent.split("\n").length;

  if (!initialized) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-brand-textDim text-sm">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-brand-bg text-brand-text">
      {/* 상단 툴바 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-brand-subtle bg-brand-panel/40">
        <div className="flex items-center gap-3">
          <Link
            to="/my"
            className="text-xs text-brand-textDim hover:text-brand-accent transition-colors"
          >
            ← 마이페이지
          </Link>
          <span className="text-sm font-semibold">마크다운 워크스페이스</span>
          {activeFile && (
            <span className="text-xs text-brand-textDim">
              — {activeFile.name} {isDirty && <span className="text-amber-400">●</span>}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 뷰 모드 탭 */}
          <div className="flex rounded-lg border border-brand-subtle overflow-hidden">
            {(["edit", "split", "preview"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-[11px] transition-colors
                  ${viewMode === mode ? "bg-brand-accent text-white" : "text-brand-textDim hover:text-brand-text"}`}
              >
                {mode === "edit" ? "편집" : mode === "split" ? "분할" : "미리보기"}
              </button>
            ))}
          </div>

          <button
            onClick={() => createFile("새 문서", null)}
            className="px-3 py-1 rounded-lg text-[11px] border border-brand-subtle text-brand-textDim
                       hover:text-brand-text hover:border-brand-accent/40 transition-colors"
          >
            + 새 문서
          </button>
        </div>
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측: 파일 탐색기 */}
        <div className="w-56 shrink-0">
          <FileExplorer />
        </div>

        {/* 우측: 에디터 + 미리보기 */}
        <div className="flex-1 flex overflow-hidden">
          {activeFile ? (
            <>
              {/* 에디터 */}
              {(viewMode === "edit" || viewMode === "split") && (
                <div className={`${viewMode === "split" ? "w-1/2" : "w-full"} border-r border-brand-subtle`}>
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-full text-brand-textDim text-sm">
                        에디터 로딩 중...
                      </div>
                    }
                  >
                    <MonacoEditor
                      height="100%"
                      language="markdown"
                      theme="vs-dark"
                      value={localContent}
                      onChange={handleContentChange}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineHeight: 22,
                        wordWrap: "on",
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        renderWhitespace: "none",
                        lineNumbers: "on",
                        tabSize: 2,
                      }}
                    />
                  </Suspense>
                </div>
              )}

              {/* 미리보기 */}
              {(viewMode === "preview" || viewMode === "split") && (
                <div
                  className={`${viewMode === "split" ? "w-1/2" : "w-full"} overflow-y-auto`}
                >
                  <div className="p-6 max-w-none prose prose-invert prose-sm">
                    <MdPreview content={localContent} />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* 파일 미선택 시 */
            <div className="flex-1 flex flex-col items-center justify-center text-brand-textDim">
              <div className="text-4xl mb-4">📝</div>
              <div className="text-sm mb-2">파일을 선택하거나 새 문서를 만들어보세요</div>
              <div className="text-[11px] text-brand-textDim/60 space-y-1">
                <div>좌측에서 파일을 클릭하면 편집할 수 있습니다</div>
                <div>Ctrl+S로 저장 · 1.5초 후 자동 저장</div>
              </div>
              <button
                onClick={() => createFile("새 문서", null)}
                className="mt-4 px-4 py-2 rounded-lg text-sm bg-brand-accent text-white hover:brightness-110 transition-all"
              >
                + 새 문서 만들기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 상태바 */}
      {activeFile && (
        <div className="flex items-center justify-between px-4 py-1 border-t border-brand-subtle text-[10px] text-brand-textDim bg-brand-panel/30">
          <div className="flex items-center gap-3">
            <span>줄 {lineCount}</span>
            <span>·</span>
            <span>{charCount}자</span>
            <span>·</span>
            <span>약 {Math.max(1, Math.ceil(charCount / 250))}분 읽기</span>
          </div>
          <div className="flex items-center gap-3">
            <span>UTF-8</span>
            <span>·</span>
            <span>{isDirty ? "수정됨 ●" : "저장됨 ✓"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── 간단한 마크다운 미리보기 ─── */
function MdPreview({ content }: { content: string }) {
  // 간단한 마크다운 → HTML 변환 (기본적인 것만)
  const html = simpleMarkdownToHtml(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function simpleMarkdownToHtml(md: string): string {
  let html = md
    // 코드 블록
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
      return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
    })
    // 인라인 코드
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // 제목
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // 굵게/기울임
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // 취소선
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    // 인용
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // 구분선
    .replace(/^---$/gm, "<hr />")
    // 목록 (간단)
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
    // 링크
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // 줄바꿈
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br />");

  // 연속 li를 ul로 감싸기 (간단)
  html = html.replace(/((?:<li>.*?<\/li>(?:<br \/>)?)+)/g, "<ul>$1</ul>");

  return `<p>${html}</p>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
