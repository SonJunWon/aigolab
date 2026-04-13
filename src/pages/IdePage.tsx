import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FileTree } from "../components/ide/FileTree";
import { EditorTabs } from "../components/ide/EditorTabs";
import { IdeEditor } from "../components/ide/IdeEditor";
import { OutputPanel } from "../components/ide/OutputPanel";
import { usePyodideStatus } from "../hooks/usePyodideStatus";
import { useProjectAutoSave } from "../hooks/useProjectAutoSave";
import { useIdeShortcuts } from "../hooks/useIdeShortcuts";
import { useFileStore } from "../store/fileStore";
import { runActiveFile } from "../runtime/fileRunner";
import { pythonRunner } from "../runtime/pythonRunner";
import { loadProject } from "../storage/projectRepo";
import { downloadProjectZip } from "../utils/exportProject";
import { importProjectZip } from "../utils/importProject";

const MIN_OUTPUT_H = 40;
const MAX_OUTPUT_H = 600;
const DEFAULT_OUTPUT_H = 200;

export function IdePage() {
  const { status, version } = usePyodideStatus();
  const running = useFileStore((s) => s.running);
  const activeFile = useFileStore((s) => s.activeFile);
  const storeLoadProject = useFileStore((s) => s.loadProject);
  const setLoaded = useFileStore((s) => s.setLoaded);
  const saveStatus = useFileStore((s) => s.saveStatus);
  const dirtyCount = useFileStore((s) => s.dirtyFiles.size);

  // 출력 패널 높이 + 접기 상태
  const [outputHeight, setOutputHeight] = useState(DEFAULT_OUTPUT_H);
  const [outputCollapsed, setOutputCollapsed] = useState(false);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);

  // 모바일 사이드바 드로어
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 파일 전환 시 모바일 드로어 자동 닫기
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeFile]);

  const toggleOutput = useCallback(() => {
    setOutputCollapsed((c) => !c);
  }, []);

  // 단축키
  useIdeShortcuts({ onToggleOutput: toggleOutput });

  // 마운트 시 저장된 프로젝트 복원
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await loadProject();
      if (cancelled) return;
      if (saved && Object.keys(saved).length > 0) {
        storeLoadProject(saved);
      } else {
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storeLoadProject, setLoaded]);

  // 자동 저장
  useProjectAutoSave();

  // 출력 패널 드래그 리사이즈 (마우스 + 터치)
  useEffect(() => {
    const getClientY = (e: MouseEvent | TouchEvent) =>
      "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startY - getClientY(e);
      const newH = Math.min(
        MAX_OUTPUT_H,
        Math.max(MIN_OUTPUT_H, dragRef.current.startH + delta)
      );
      setOutputHeight(newH);
    };
    const onEnd = () => {
      dragRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  const startDrag = (clientY: number) => {
    dragRef.current = { startY: clientY, startH: outputHeight };
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  // ZIP 내보내기
  const handleExportZip = async () => {
    const files = useFileStore.getState().files;
    await downloadProjectZip(files);
  };

  // 전체 초기화 — 기본 프로젝트(main.py + src/)로 되돌림
  const handleReset = () => {
    if (
      !confirm(
        "현재 프로젝트가 삭제되고 기본 예제로 돌아갑니다. 계속할까요?\n(미리 ↓ ZIP으로 백업하세요)"
      )
    ) {
      return;
    }
    useFileStore.getState().resetToDefault();
    useFileStore.getState().appendOutput({
      stream: "system",
      text: "✓ 기본 프로젝트로 초기화됨",
    });
  };

  // ZIP 가져오기
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImportClick = () => fileInputRef.current?.click();
  const handleImportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일 재선택 허용
    if (!file) return;

    const hasContent = Object.keys(useFileStore.getState().files).length > 0;
    if (
      hasContent &&
      !confirm(
        "현재 프로젝트가 ZIP 내용으로 덮어씌워집니다. 계속할까요?\n(미리 ↓ ZIP으로 백업하세요)"
      )
    ) {
      return;
    }

    try {
      const { files: imported, skipped } = await importProjectZip(file);
      if (Object.keys(imported).length === 0) {
        alert("ZIP에서 읽을 수 있는 텍스트 파일이 없습니다.");
        return;
      }
      useFileStore.getState().importFiles(imported);
      useFileStore.getState().appendOutput({
        stream: "system",
        text: `✓ ZIP 가져오기 완료: ${Object.keys(imported).length}개 파일${
          skipped.length ? ` (바이너리 ${skipped.length}개 스킵)` : ""
        }`,
      });
    } catch (err) {
      console.error("[IDE] ZIP 가져오기 실패:", err);
      alert(`ZIP 가져오기 실패: ${err instanceof Error ? err.message : "알 수 없는 오류"}`);
    }
  };

  // 실행 중단
  const handleStop = async () => {
    useFileStore.getState().appendOutput({
      stream: "system",
      text: "⏹ 실행 중단 중... (Pyodide 재시작)",
    });
    useFileStore.getState().setRunning(false);
    await pythonRunner.terminate();
    useFileStore.getState().appendOutput({
      stream: "system",
      text: "✓ Pyodide 재시작 완료",
    });
  };

  const isReady = status === "ready";

  const statusDot = {
    idle: { cls: "bg-colab-textDim", label: "대기" },
    loading: {
      cls: "bg-colab-yellow animate-pulse",
      label: "Pyodide 로딩 중...",
    },
    ready: { cls: "bg-colab-green", label: `Python ${version ?? ""}` },
    error: { cls: "bg-colab-red", label: "로딩 실패" },
  }[status];

  const saveLabel = {
    idle:   { cls: "text-colab-textDim",              text: "" },
    dirty:  { cls: "text-colab-yellow",               text: `● 저장 대기 (${dirtyCount})` },
    saving: { cls: "text-colab-yellow animate-pulse", text: "● 저장 중..." },
    saved:  { cls: "text-colab-green",                text: "✓ 저장됨" },
    error:  { cls: "text-colab-red",                  text: "✕ 저장 실패" },
  }[saveStatus];

  return (
    <div className="h-screen flex flex-col bg-colab-bg text-colab-text overflow-hidden">
      {/* ─── 상단 바 ─── */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-colab-subtle bg-colab-bg shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* 모바일 사이드바 토글 */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="md:hidden p-1.5 rounded text-colab-textDim hover:text-colab-text hover:bg-colab-hover transition-colors"
            aria-label="파일 탐색기 열기"
            aria-expanded={sidebarOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <Link
            to="/"
            className="text-sm text-colab-textDim hover:text-colab-accent transition-colors shrink-0"
            title="홈으로"
          >
            ←
          </Link>
          <span className="text-lg shrink-0">💻</span>
          <h1 className="text-sm font-medium text-colab-text shrink-0">
            <span className="hidden sm:inline">Python </span>IDE
          </h1>
          <span className="text-[11px] text-colab-textDim hidden lg:inline truncate">
            <kbd>⌘/Ctrl+Enter</kbd> 실행 · <kbd>⌘S</kbd> 저장 ·{" "}
            <kbd>⌘W</kbd> 탭 닫기
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Run 버튼 */}
          {!running ? (
            <button
              onClick={runActiveFile}
              disabled={!isReady || !activeFile}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs rounded-lg
                         bg-colab-green text-colab-bg font-medium
                         hover:bg-colab-green/80 disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Run
              {activeFile && (
                <span className="opacity-70 ml-0.5 hidden sm:inline max-w-[140px] truncate">
                  {activeFile.split("/").pop()}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs rounded-lg
                         bg-colab-red text-white font-medium
                         hover:bg-colab-red/80 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
              >
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
              Stop
            </button>
          )}

          {/* 프로젝트 저장 상태 */}
          {saveLabel.text && (
            <span
              className={`hidden md:inline text-[11px] ${saveLabel.cls}`}
              title="프로젝트 자동 저장 상태"
            >
              {saveLabel.text}
            </span>
          )}

          {/* ZIP 가져오기 */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            onChange={handleImportChange}
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-colab-subtle
                       text-colab-textDim hover:text-colab-text hover:border-colab-accent transition-colors"
            title="ZIP 파일에서 프로젝트 가져오기"
          >
            ↑ ZIP
          </button>

          {/* ZIP 내보내기 */}
          <button
            onClick={handleExportZip}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-colab-subtle
                       text-colab-textDim hover:text-colab-text hover:border-colab-accent transition-colors"
            title="프로젝트를 ZIP으로 다운로드"
          >
            ↓ ZIP
          </button>

          {/* 초기화 */}
          <button
            onClick={handleReset}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-colab-subtle
                       text-colab-textDim hover:text-colab-text hover:border-colab-red transition-colors"
            title="기본 예제 프로젝트로 되돌리기"
          >
            ↺ 초기화
          </button>

          {/* Pyodide 상태 */}
          <div className="flex items-center gap-2 text-xs text-colab-textDim">
            <span className={`w-2 h-2 rounded-full ${statusDot.cls}`} />
            <span className="hidden md:inline">{statusDot.label}</span>
          </div>
        </div>
      </header>

      {/* ─── 메인: 사이드바 + 에디터 + 출력 ─── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 모바일 드로어 오버레이 */}
        {sidebarOpen && (
          <div
            className="md:hidden absolute inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* 사이드바
            - 데스크탑(md+): 인라인 고정 너비
            - 모바일: 절대 배치 드로어, sidebarOpen에 따라 슬라이드 */}
        <div
          className={`
            shrink-0 border-r border-colab-subtle bg-colab-panel overflow-hidden
            md:static md:w-48 md:translate-x-0
            absolute top-0 bottom-0 left-0 w-60 z-40
            transition-transform duration-200
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <FileTree />
        </div>

        {/* 에디터 + 출력 */}
        <div className="flex-1 flex flex-col min-w-0">
          <EditorTabs />

          {/* 에디터 */}
          <div className="flex-1 min-h-0">
            <IdeEditor />
          </div>

          {/* 드래그 핸들 (마우스 + 터치) */}
          <div
            onMouseDown={(e) => startDrag(e.clientY)}
            onTouchStart={(e) => {
              const t = e.touches[0];
              if (t) startDrag(t.clientY);
            }}
            className="h-2 sm:h-1.5 shrink-0 bg-colab-subtle hover:bg-colab-accent/60 cursor-row-resize transition-colors touch-none"
            aria-label="출력 패널 크기 조절"
            role="separator"
          />

          {/* 출력 패널 */}
          <div
            className="shrink-0 overflow-hidden transition-all"
            style={{ height: outputCollapsed ? 32 : outputHeight }}
          >
            <OutputPanel
              collapsed={outputCollapsed}
              onToggle={toggleOutput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
