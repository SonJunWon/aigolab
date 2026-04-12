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

const MIN_OUTPUT_H = 40;
const MAX_OUTPUT_H = 600;
const DEFAULT_OUTPUT_H = 200;

export function IdePage() {
  const { status, version } = usePyodideStatus();
  const running = useFileStore((s) => s.running);
  const activeFile = useFileStore((s) => s.activeFile);
  const storeLoadProject = useFileStore((s) => s.loadProject);
  const setLoaded = useFileStore((s) => s.setLoaded);

  // 출력 패널 높이 + 접기 상태
  const [outputHeight, setOutputHeight] = useState(DEFAULT_OUTPUT_H);
  const [outputCollapsed, setOutputCollapsed] = useState(false);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);

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

  // 출력 패널 드래그 리사이즈
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startY - e.clientY;
      const newH = Math.min(
        MAX_OUTPUT_H,
        Math.max(MIN_OUTPUT_H, dragRef.current.startH + delta)
      );
      setOutputHeight(newH);
    };
    const onMouseUp = () => {
      dragRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    dragRef.current = { startY: e.clientY, startH: outputHeight };
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
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

  return (
    <div className="h-screen flex flex-col bg-colab-bg text-colab-text overflow-hidden">
      {/* ─── 상단 바 ─── */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-colab-subtle bg-colab-bg shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-sm text-colab-textDim hover:text-colab-accent transition-colors"
            title="홈으로"
          >
            ←
          </Link>
          <span className="text-lg">💻</span>
          <h1 className="text-sm font-medium text-colab-text">Python IDE</h1>
          <span className="text-[11px] text-colab-textDim hidden sm:inline">
            <kbd>⌘/Ctrl+Enter</kbd> 실행 · <kbd>⌘S</kbd> 저장 ·{" "}
            <kbd>⌘W</kbd> 탭 닫기
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Run 버튼 */}
          {!running ? (
            <button
              onClick={runActiveFile}
              disabled={!isReady || !activeFile}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-lg
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
                <span className="opacity-70 ml-0.5">
                  {activeFile.split("/").pop()}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-lg
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

          {/* Pyodide 상태 */}
          <div className="flex items-center gap-2 text-xs text-colab-textDim">
            <span className={`w-2 h-2 rounded-full ${statusDot.cls}`} />
            <span className="hidden sm:inline">{statusDot.label}</span>
          </div>
        </div>
      </header>

      {/* ─── 메인: 사이드바 + 에디터 + 출력 ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* 사이드바 */}
        <div className="w-48 shrink-0 border-r border-colab-subtle bg-colab-panel overflow-hidden">
          <FileTree />
        </div>

        {/* 에디터 + 출력 */}
        <div className="flex-1 flex flex-col min-w-0">
          <EditorTabs />

          {/* 에디터 */}
          <div className="flex-1 min-h-0">
            <IdeEditor />
          </div>

          {/* 드래그 핸들 */}
          <div
            onMouseDown={startDrag}
            className="h-1.5 shrink-0 bg-colab-subtle hover:bg-colab-accent/60 cursor-row-resize transition-colors"
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
