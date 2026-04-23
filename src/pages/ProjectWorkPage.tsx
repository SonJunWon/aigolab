import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { editor as MonacoEditor } from "monaco-editor";
import { FileTree } from "../components/ide/FileTree";
import { EditorTabs } from "../components/ide/EditorTabs";
import { IdeEditor } from "../components/ide/IdeEditor";
import { OutputPanel } from "../components/ide/OutputPanel";
import { ProjectGuidePanel } from "../components/project/ProjectGuidePanel";
import { getProjectById } from "../content/projects";
import { usePyodideStatus } from "../hooks/usePyodideStatus";
import { useStudyTimeTracking } from "../hooks/useStudyTimeTracking";
import { useFileStore } from "../store/fileStore";
import { runActiveFile } from "../runtime/fileRunner";
import { pythonRunner } from "../runtime/pythonRunner";
import { useEntitlements } from "../hooks/useEntitlements";
import { canAccessProject } from "../content/access";
import { LockedContentScreen } from "../components/paywall/LockedContentScreen";

const MIN_OUTPUT_H = 40;
const MAX_OUTPUT_H = 600;
const DEFAULT_OUTPUT_H = 180;

// 패널 상태 localStorage 키
const PANEL_KEY = "project_work_panels";
interface PanelState {
  treeOpen: boolean;
  guideOpen: boolean;
  outputHeight: number;
  outputCollapsed: boolean;
}
const DEFAULT_PANELS: PanelState = {
  treeOpen: true,
  guideOpen: true,
  outputHeight: DEFAULT_OUTPUT_H,
  outputCollapsed: false,
};
function loadPanels(): PanelState {
  try {
    const raw = localStorage.getItem(PANEL_KEY);
    return raw ? { ...DEFAULT_PANELS, ...JSON.parse(raw) } : DEFAULT_PANELS;
  } catch {
    return DEFAULT_PANELS;
  }
}
function savePanels(p: PanelState) {
  try {
    localStorage.setItem(PANEL_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

/**
 * 프로젝트 모드 IDE 페이지.
 *
 * 레이아웃: [FileTree | Editor+Output | GuidePanel]
 * 각 패널 접이식. 가이드 단계 클릭 → 에디터에서 해당 `## STEP N:` 주석으로 스크롤.
 */
export function ProjectWorkPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;
  const { status, version } = usePyodideStatus();

  const running = useFileStore((s) => s.running);
  const activeFile = useFileStore((s) => s.activeFile);
  const storeLoadProject = useFileStore((s) => s.loadProject);

  // 접근 권한 — PRO 프로젝트 URL 직접 입력 시 하드 잠금
  const { entitlements, loading: entitlementsLoading } = useEntitlements();

  // 학습 시간 추적
  useStudyTimeTracking(!!project);

  // 패널 상태
  const [panels, setPanels] = useState<PanelState>(loadPanels());
  useEffect(() => {
    savePanels(panels);
  }, [panels]);

  // 모바일 드로어 (트리, 가이드 각각)
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);

  // 출력 패널 드래그
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);
  useEffect(() => {
    const getY = (e: MouseEvent | TouchEvent) =>
      "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startY - getY(e);
      const h = Math.min(
        MAX_OUTPUT_H,
        Math.max(MIN_OUTPUT_H, dragRef.current.startH + delta)
      );
      setPanels((p) => ({ ...p, outputHeight: h }));
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
    dragRef.current = { startY: clientY, startH: panels.outputHeight };
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  // ── 프로젝트 로드 (마운트 시) ──
  useEffect(() => {
    if (!project) return;
    const files: Record<string, { name: string; content: string; language: string }> = {};
    for (const [key, file] of Object.entries(project.starterFiles)) {
      files[key] = file;
    }
    storeLoadProject(files);
  }, [project, storeLoadProject]);

  // ── Monaco editor 참조 + 스크롤 + 하이라이트 ──
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorReady = useCallback((ed: MonacoEditor.IStandaloneCodeEditor) => {
    editorRef.current = ed;
  }, []);

  const scrollToMarker = useCallback((marker: string | undefined) => {
    const ed = editorRef.current;
    if (!ed || !marker) return;
    const model = ed.getModel();
    if (!model) return;

    // `## STEP N:` 형태의 주석 라인 찾기
    const pattern = new RegExp(`^\\s*##\\s*${marker.replace(/\s+/g, "\\s+")}:`, "i");
    const totalLines = model.getLineCount();
    let targetLine = -1;
    for (let i = 1; i <= totalLines; i++) {
      if (pattern.test(model.getLineContent(i))) {
        targetLine = i;
        break;
      }
    }
    if (targetLine === -1) return;

    // 해당 라인부터 다음 STEP 주석까지 범위 찾기
    let endLine = totalLines;
    for (let i = targetLine + 1; i <= totalLines; i++) {
      if (/^\s*##\s*STEP\s+\d+:/i.test(model.getLineContent(i))) {
        endLine = i - 1;
        break;
      }
    }

    // 스크롤 + 하이라이트
    ed.revealLineInCenter(targetLine);
    ed.setPosition({ lineNumber: targetLine, column: 1 });
    ed.focus();

    // 이전 데코레이션 제거 후 범위 강조
    decorationsRef.current = ed.deltaDecorations(decorationsRef.current, [
      {
        range: {
          startLineNumber: targetLine,
          startColumn: 1,
          endLineNumber: endLine,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "project-step-highlight",
          linesDecorationsClassName: "project-step-marker",
        },
      },
    ]);

    // 3초 뒤 하이라이트 제거
    setTimeout(() => {
      if (editorRef.current && decorationsRef.current.length > 0) {
        decorationsRef.current = editorRef.current.deltaDecorations(
          decorationsRef.current,
          []
        );
      }
    }, 3000);
  }, []);

  // ── 재시작 (starter 로 복원) ──
  const resetStarter = () => {
    if (!project) return;
    if (!confirm("에디터 내용을 초기 starter 코드로 되돌리시겠어요? (진행도는 유지)")) return;
    const files: Record<string, { name: string; content: string; language: string }> = {};
    for (const [key, file] of Object.entries(project.starterFiles)) {
      files[key] = file;
    }
    storeLoadProject(files);
  };

  // ── 중단 ──
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

  if (!project) return <Navigate to="/projects" replace />;

  // PRO 프로젝트 접근 제어 — URL 직접 입력 우회 차단
  if (!entitlementsLoading && !canAccessProject(project.id, entitlements)) {
    return (
      <LockedContentScreen
        icon={project.icon}
        title={project.title}
        kind="AI 프로젝트"
        backTo="/projects"
        backLabel="← 프로젝트 목록"
      />
    );
  }

  const isReady = status === "ready";
  const statusDot = {
    idle: { cls: "bg-colab-textDim", label: "대기" },
    loading: { cls: "bg-colab-yellow animate-pulse", label: "Pyodide 로딩 중..." },
    ready: { cls: "bg-colab-green", label: `Python ${version ?? ""}` },
    error: { cls: "bg-colab-red", label: "로딩 실패" },
  }[status];

  const toggleOutput = () =>
    setPanels((p) => ({ ...p, outputCollapsed: !p.outputCollapsed }));

  return (
    <div className="h-screen flex flex-col bg-colab-bg text-colab-text overflow-hidden">
      {/* 스크롤 하이라이트 스타일 (컴포넌트 한정 ok) */}
      <style>{`
        .project-step-highlight {
          background: rgba(139, 92, 246, 0.18);
          transition: background 0.5s ease;
        }
        .project-step-marker {
          background: #7c3aed;
          width: 3px !important;
          margin-left: 3px;
        }
      `}</style>

      {/* 상단 바 */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-colab-subtle bg-colab-bg shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* 모바일 트리 토글 */}
          <button
            onClick={() => setMobileTreeOpen((o) => !o)}
            className="md:hidden p-1.5 rounded text-colab-textDim hover:text-colab-text"
            aria-label="파일 탐색기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <Link
            to="/projects"
            className="text-sm text-colab-textDim hover:text-colab-accent transition-colors"
          >
            ←
          </Link>
          <span className="text-lg">{project.icon}</span>
          <h1 className="text-sm font-medium text-colab-text truncate max-w-[200px] sm:max-w-none">
            {project.title}
          </h1>
          <span className="text-[11px] text-colab-textDim hidden md:inline">
            프로젝트 모드
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* 데스크탑 패널 토글 */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setPanels((p) => ({ ...p, treeOpen: !p.treeOpen }))}
              className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                panels.treeOpen
                  ? "border-colab-accent/50 text-colab-accent"
                  : "border-colab-subtle text-colab-textDim hover:text-colab-text"
              }`}
              title="파일 트리 (Cmd+Shift+E)"
            >
              📁
            </button>
            <button
              onClick={() => setPanels((p) => ({ ...p, guideOpen: !p.guideOpen }))}
              className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                panels.guideOpen
                  ? "border-colab-accent/50 text-colab-accent"
                  : "border-colab-subtle text-colab-textDim hover:text-colab-text"
              }`}
              title="가이드 (Cmd+B)"
            >
              📋 가이드
            </button>
          </div>

          {/* 모바일 가이드 토글 */}
          <button
            onClick={() => setMobileGuideOpen((o) => !o)}
            className="md:hidden text-[11px] px-2 py-1 rounded border border-colab-subtle text-colab-textDim"
          >
            📋
          </button>

          {/* Run / Stop */}
          {!running ? (
            <button
              onClick={runActiveFile}
              disabled={!isReady || !activeFile}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs rounded-lg
                         bg-colab-green text-colab-bg font-medium
                         hover:bg-colab-green/80 disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs rounded-lg bg-colab-red text-white font-medium hover:bg-colab-red/80"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
              Stop
            </button>
          )}

          <button
            onClick={resetStarter}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-colab-subtle
                       text-colab-textDim hover:text-colab-text hover:border-colab-red transition-colors"
            title="에디터를 starter 코드로 되돌리기 (진행도 유지)"
          >
            ↺ 재시작
          </button>

          <div className="flex items-center gap-2 text-xs text-colab-textDim">
            <span className={`w-2 h-2 rounded-full ${statusDot.cls}`} />
            <span className="hidden md:inline">{statusDot.label}</span>
          </div>
        </div>
      </header>

      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 모바일 오버레이 */}
        {(mobileTreeOpen || mobileGuideOpen) && (
          <div
            className="md:hidden absolute inset-0 bg-black/50 z-30"
            onClick={() => {
              setMobileTreeOpen(false);
              setMobileGuideOpen(false);
            }}
          />
        )}

        {/* 파일 트리 */}
        <div
          className={`
            shrink-0 border-r border-colab-subtle bg-colab-panel overflow-hidden
            md:static
            ${panels.treeOpen ? "md:w-48" : "md:w-0"}
            absolute top-0 bottom-0 left-0 w-[72%] max-w-[260px] z-40 transition-all duration-200
            ${mobileTreeOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* 모바일 닫기 버튼 */}
          {mobileTreeOpen && (
            <button
              onClick={() => setMobileTreeOpen(false)}
              className="md:hidden absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-colab-bg/90 text-colab-text hover:bg-colab-hover flex items-center justify-center shadow-lg"
              aria-label="파일 탐색기 닫기"
            >
              ✕
            </button>
          )}
          <FileTree />
        </div>

        {/* 에디터 + 출력 */}
        <div className="flex-1 flex flex-col min-w-0">
          <EditorTabs />
          <div className="flex-1 min-h-0">
            <IdeEditor onEditorReady={handleEditorReady} />
          </div>

          {/* 드래그 핸들 */}
          <div
            onMouseDown={(e) => startDrag(e.clientY)}
            onTouchStart={(e) => {
              const t = e.touches[0];
              if (t) startDrag(t.clientY);
            }}
            className="h-2 sm:h-1.5 shrink-0 bg-colab-subtle hover:bg-colab-accent/60 cursor-row-resize transition-colors touch-none"
          />

          <div
            className="shrink-0 overflow-hidden transition-all"
            style={{ height: panels.outputCollapsed ? 32 : panels.outputHeight }}
          >
            <OutputPanel
              collapsed={panels.outputCollapsed}
              onToggle={toggleOutput}
            />
          </div>
        </div>

        {/* 가이드 패널 */}
        <div
          className={`
            shrink-0 border-l border-colab-subtle bg-brand-panel overflow-hidden
            md:static
            ${panels.guideOpen ? "md:w-[340px]" : "md:w-0"}
            absolute top-0 bottom-0 right-0 w-[92%] max-w-[420px] z-40 transition-all duration-200
            ${mobileGuideOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
          `}
        >
          {/* 모바일 닫기 버튼 */}
          {mobileGuideOpen && (
            <button
              onClick={() => setMobileGuideOpen(false)}
              className="md:hidden absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-brand-bg/90 text-brand-text hover:bg-brand-hover flex items-center justify-center shadow-lg"
              aria-label="가이드 패널 닫기"
            >
              ✕
            </button>
          )}
          <ProjectGuidePanel
            project={project}
            progressKey={`project_progress_${project.id}`}
            onStepClick={(marker) => {
              scrollToMarker(marker);
              if (mobileGuideOpen) setMobileGuideOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
