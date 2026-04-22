/**
 * 마크다운 워크스페이스 — /my/markdown
 *
 * 좌측: 파일 탐색기
 * 우측: Monaco 에디터 + 마크다운 미리보기 (분할/편집/미리보기 모드)
 */

import { useEffect, useState, useCallback, useMemo, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import { useMdFileStore } from "../store/mdFileStore";
import { FileExplorer } from "../components/markdown/FileExplorer";
import { PromptFormEditor } from "../components/markdown/PromptFormEditor";

const MonacoEditor = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.default })),
);

type ViewMode = "split" | "edit" | "preview" | "prompt";

export function MdWorkspacePage() {
  const {
    init,
    initialized,
    activeFileId,
    folders,
    updateFileContent,
    getActiveFile,
    createFile,
  } = useMdFileStore();

  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [localContent, setLocalContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadMessage, setLoadMessage] = useState("데이터베이스 연결 중...");
  const [initError, setInitError] = useState<string | null>(null);
  const initAttempted = useRef(false);

  // 초기화 (프로그레시브 바 연동)
  useEffect(() => {
    if (initAttempted.current) return;
    initAttempted.current = true;

    let progressTimer: ReturnType<typeof setInterval>;

    const doInit = async () => {
      try {
        setLoadProgress(10);
        setLoadMessage("데이터베이스 연결 중...");

        // 프로그레시브 바 애니메이션 (실제 진행과 별개로 시각적 피드백)
        progressTimer = setInterval(() => {
          setLoadProgress((prev) => {
            if (prev >= 85) return prev; // 85%에서 멈춤 — 실제 완료 시 100%로
            return prev + Math.random() * 15;
          });
        }, 300);

        setLoadProgress(30);
        setLoadMessage("폴더 및 파일 불러오는 중...");

        await init();

        setLoadProgress(100);
        setLoadMessage("완료!");
        clearInterval(progressTimer);
      } catch (err) {
        clearInterval(progressTimer);
        setInitError(
          err instanceof Error ? err.message : "초기화에 실패했습니다. 페이지를 새로고침해주세요.",
        );
      }
    };

    doInit();

    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [init]);

  // 활성 파일이 프롬프트/프로젝트 폴더 트리에 속하는지 재귀 체크
  const isInFolderTree = useCallback((folderId: string | null, targetName: string): boolean => {
    if (!folderId) return false;
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return false;
    if (folder.name === targetName) return true;
    // 상위 폴더를 재귀적으로 확인
    return isInFolderTree(folder.parentId, targetName);
  }, [folders]);

  const isPromptFolder = useMemo(() => {
    const file = getActiveFile();
    return file ? isInFolderTree(file.folderId, "프롬프트") : false;
  }, [activeFileId, getActiveFile, isInFolderTree]);

  const isProjectFolder = useMemo(() => {
    const file = getActiveFile();
    return file ? isInFolderTree(file.folderId, "프로젝트") : false;
  }, [activeFileId, getActiveFile, isInFolderTree]);

  // 활성 파일 변경 시 콘텐츠 로드 + 모드 자동 전환
  useEffect(() => {
    const file = getActiveFile();
    if (file) {
      setLocalContent(file.content);
      setIsDirty(false);
      // 프롬프트/프로젝트 폴더면 자동으로 프롬프트 모드
      if (isPromptFolder || isProjectFolder) {
        setViewMode("prompt");
      } else if (viewMode === "prompt") {
        setViewMode("split");
      }
    } else {
      setLocalContent("");
      setIsDirty(false);
    }
  }, [activeFileId, getActiveFile, isPromptFolder, isProjectFolder]);

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

  if (initError) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-3xl mb-3">⚠️</div>
          <div className="text-sm text-red-400 mb-2">{initError}</div>
          <div className="text-xs text-brand-textDim mb-4">
            다른 탭에서 AIGoLab이 열려 있다면 닫고 다시 시도해주세요.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm bg-brand-accent text-white hover:brightness-110 transition-all"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-72 text-center">
          <div className="text-3xl mb-4">📝</div>
          <div className="text-sm text-brand-text mb-3">마크다운 워크스페이스</div>

          {/* 프로그레시브 바 */}
          <div className="w-full h-2 bg-brand-subtle/30 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-brand-accent rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(loadProgress, 100)}%` }}
            />
          </div>

          <div className="text-xs text-brand-textDim">{loadMessage}</div>
          <div className="text-[10px] text-brand-textDim/50 mt-1">
            {Math.round(loadProgress)}%
          </div>
        </div>
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
            {(["prompt", "edit", "split", "preview"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-[11px] transition-colors
                  ${viewMode === mode ? "bg-brand-accent text-white" : "text-brand-textDim hover:text-brand-text"}`}
              >
                {mode === "prompt" ? "프롬프트" : mode === "edit" ? "편집" : mode === "split" ? "분할" : "미리보기"}
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
              {/* 프롬프트 양식 모드 */}
              {viewMode === "prompt" && activeFileId && (
                <div className="flex-1 overflow-hidden">
                  <PromptFormEditor
                    key={activeFileId}
                    content={localContent}
                    onContentChange={(() => {
                      // 파일 ID를 클로저에 고정 — 파일 전환 후 저장이 엉뚱한 파일에 가는 것 방지
                      const fileId = activeFileId;
                      return (newContent: string) => {
                        setLocalContent(newContent);
                        updateFileContent(fileId, newContent);
                      };
                    })()}
                  />
                </div>
              )}

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
                  <div className="p-6 max-w-none md-prose">
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

/* ─── 마크다운 미리보기 (marked 라이브러리 사용) ─── */
function MdPreview({ content }: { content: string }) {
  const html = useMemo(() => {
    try {
      return marked(content, { breaks: true, gfm: true }) as string;
    } catch {
      return `<p>${content}</p>`;
    }
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
