import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getLessonById, getCurriculum } from "../content";
import { getLanguage, getTrack } from "../content/languages";
import { useNotebookStore } from "../store/notebookStore";
import { useProgressStore } from "../store/progressStore";
import { useAutoSaveStore } from "../store/autoSaveStore";
import { Notebook } from "../components/notebook/Notebook";
import { QuizPanel } from "../components/quiz/QuizPanel";
import { useLanguageRuntime } from "../hooks/useLanguageRuntime";
import { getRuntime } from "../runtime/registry";
import { useAutoSave } from "../hooks/useAutoSave";
import { useStudyTimeTracking } from "../hooks/useStudyTimeTracking";
import { loadNotebook, deleteNotebook } from "../storage/notebookRepo";
import { downloadIpynb } from "../utils/exportNotebook";
import type { Language, Lesson, Track } from "../types/lesson";

export function LessonPage() {
  const { language, track, lessonId } = useParams<{
    language: string;
    track: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const cells = useNotebookStore((s) => s.cells);
  const loadCells = useNotebookStore((s) => s.loadCells);
  const saveStatus = useAutoSaveStore((s) => s.status);

  const ensureLoaded = useProgressStore((s) => s.ensureLoaded);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const setCurrent = useProgressStore((s) => s.setCurrent);
  const isCompleted = useProgressStore((s) => s.isCompleted);

  const lang = language ? getLanguage(language) : undefined;
  const trk = track ? getTrack(track) : undefined;
  const lesson =
    lang && trk && lessonId
      ? getLessonById(lang.id as Language, trk.id as Track, lessonId)
      : undefined;

  // 레슨의 언어에 맞춰 런타임 init (Python이면 Pyodide, JS면 JS Worker)
  const { status, version } = useLanguageRuntime(lesson?.language ?? "python");

  // 저장된 노트북을 먼저 로드했는지 추적
  //   null   = 아직 로드 시도 안 함 (또는 레슨 없음)
  //   "loading" = IDB 조회 중
  //   "ready"   = 로드 완료 → 자동 저장 ON
  const [loadState, setLoadState] = useState<"loading" | "ready">("loading");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // 오버플로 메뉴 바깥 클릭 시 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  // 자동 저장 — loadState가 ready일 때만 활성화
  useAutoSave(lesson?.id ?? null, loadState === "ready");

  // 학습 시간 추적 (로그인 사용자만)
  useStudyTimeTracking(!!lesson);

  // 진도 초기 로드
  useEffect(() => {
    if (lang && trk) {
      void ensureLoaded(lang.id as Language, trk.id as Track);
    }
  }, [lang, trk, ensureLoaded]);

  // 레슨 전환 시: 저장된 노트북이 있으면 그걸로, 없으면 원본 레슨으로 로드
  useEffect(() => {
    if (!lesson) return;

    let cancelled = false;
    setLoadState("loading");

    (async () => {
      const saved = await loadNotebook(lesson.id);
      if (cancelled) return;

      // ── 머지 전략 (v3.18.3 안전화) ──
      // 1. 저장본 없음 → lesson 원본
      // 2. 저장본의 code 셀 개수가 lesson 과 정확히 같음
      //    → lesson 을 base 로 markdown 은 최신, code 만 순서대로 saved 에서 복원
      //      (사용자가 작성한 코드 보존 + 안내문 업데이트)
      // 3. 저장본의 code 셀 개수가 lesson 과 다름 (콘텐츠 업데이트 후)
      //    → saved 의 code 가 어느 lesson 셀에 대응되는지 알 수 없음
      //      → lesson 원본 사용 (사용자 코드 손실 ⚠️)
      //    이전 v3.18.1 머지는 큐 기반으로 매칭했지만, 신규 셀이 중간에
      //    추가되면 미션 빈칸 코드가 다른 셀에 잘못 매핑돼 NameError 발생.
      //    따라서 셀 구조가 바뀌면 안전하게 원본 사용.
      const lessonCodeCells = lesson.cells.filter((c) => c.type === "code");
      const savedCodeCells = saved
        ? saved.cells.filter((c) => c.type === "code")
        : [];

      if (!saved || saved.cells.length === 0) {
        loadCells(lesson.cells, lesson.language);
      } else if (savedCodeCells.length === lessonCodeCells.length) {
        // 코드 셀 개수 일치 → 순서대로 안전 매칭
        const savedCodeQueue = savedCodeCells.map((c) => c.source);
        let qIdx = 0;
        const merged = lesson.cells.map((lessonCell) => {
          if (lessonCell.type === "code") {
            const userSource = savedCodeQueue[qIdx];
            qIdx += 1;
            return {
              type: lessonCell.type,
              source: userSource,
              hints: lessonCell.hints,
              solution: lessonCell.solution,
            };
          }
          // markdown 은 항상 lesson 최신
          return {
            type: lessonCell.type,
            source: lessonCell.source,
            hints: lessonCell.hints,
            solution: lessonCell.solution,
          };
        });
        loadCells(merged, lesson.language);
      } else {
        // 셀 구조 변경됨 → 안전하게 lesson 원본 사용
        // (사용자 코드 손실은 안내가 필요하면 향후 toast 추가 고려)
        console.warn(
          `[lesson] 콘텐츠 구조 변경 감지 (saved code: ${savedCodeCells.length}, lesson code: ${lessonCodeCells.length}) — 원본으로 재로드`
        );
        loadCells(lesson.cells, lesson.language);
      }
      setLoadState("ready");

      // 현재 보고 있는 레슨으로 기록 (완료 표시는 아님)
      if (lang && trk) {
        void setCurrent(lang.id as Language, trk.id as Track, lesson.id);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lesson, loadCells, lang, trk, setCurrent]);

  if (!lang || !trk) return <Navigate to="/coding" replace />;
  if (!lesson) return <Navigate to={`/coding/learn/${lang.id}/${trk.id}`} replace />;

  // 이전/다음 챕터 찾기
  const curriculum = getCurriculum(lang.id as Language, trk.id as Track);
  const currentIdx =
    curriculum?.summaries.findIndex((s) => s.id === lesson.id) ?? -1;
  const prevLesson =
    currentIdx > 0 ? curriculum?.summaries[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && currentIdx < (curriculum?.summaries.length ?? 0) - 1
      ? curriculum?.summaries[currentIdx + 1]
      : null;

  const alreadyDone = isCompleted(
    lang.id as Language,
    trk.id as Track,
    lesson.id
  );

  // 언어별 런타임 라벨
  const runtimeLabel =
    lesson.language === "javascript" ? "JavaScript" : "Python";
  const statusDot = {
    idle:    { cls: "bg-colab-textDim", title: "대기" },
    loading: { cls: "bg-colab-yellow animate-pulse", title: `${runtimeLabel} 로딩 중...` },
    ready:   { cls: "bg-colab-green", title: `${runtimeLabel} ${version ?? ""} 준비됨` },
    error:   { cls: "bg-colab-red", title: "로딩 실패" },
  }[status];

  const saveLabel =
    {
      idle:   { cls: "text-colab-textDim",              text: "저장 대기" },
      dirty:  { cls: "text-colab-yellow",               text: "● 변경됨" },
      saving: { cls: "text-colab-yellow animate-pulse", text: "● 저장 중..." },
      saved:  { cls: "text-colab-green",                text: "✓ 저장됨" },
      error:  { cls: "text-colab-red",                  text: "✕ 저장 실패" },
    }[saveStatus] ?? { cls: "text-colab-textDim", text: `? ${saveStatus}` };

  // ─── "다음 →" 버튼: 현재 챕터 완료 표시 후 이동 ───
  const handleNext = async (nextLessonId?: string) => {
    await completeLesson(lang.id as Language, trk.id as Track, lesson.id);
    if (nextLessonId) {
      navigate(`/coding/learn/${lang.id}/${trk.id}/${nextLessonId}`);
    } else {
      // 마지막 챕터: 완료 기록만 하고 커리큘럼으로 돌아감
      navigate(`/coding/learn/${lang.id}/${trk.id}`);
    }
  };

  // ─── "처음부터 다시": 저장 삭제 후 원본 레슨 재주입 ───
  const handleReset = async () => {
    if (!confirm("사용자가 수정한 내용이 모두 사라지고 원본 레슨으로 돌아갑니다. 계속할까요?")) {
      return;
    }
    await deleteNotebook(lesson.id);
    loadCells((lesson as Lesson).cells, lesson.language);
  };

  // ─── 런타임 재시작: 변수/함수 셰도잉 등 막혔을 때 회복용 ───
  const [restarting, setRestarting] = useState(false);
  const handleRestartRuntime = async () => {
    if (restarting) return;
    if (
      !confirm(
        "런타임을 재시작합니다. 셀에서 만들었던 모든 변수·함수가 사라져요. 계속할까요?"
      )
    ) {
      return;
    }
    setRestarting(true);
    try {
      await getRuntime(lesson.language).terminate();
    } finally {
      setRestarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-colab-bg flex flex-col">
      {/* 레슨 헤더 */}
      <div className="border-b border-colab-subtle bg-colab-bg sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link
              to={`/coding/learn/${lang.id}/${trk.id}`}
              className="shrink-0 text-sm text-colab-textDim hover:text-colab-accent transition-colors"
              title="커리큘럼으로"
            >
              ←
            </Link>
            <div className="shrink-0 text-base sm:text-lg">{lang.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] text-colab-textDim flex items-center gap-1.5 truncate">
                <span className="truncate">
                  <span className="hidden sm:inline">{lang.name} · {trk.name} · </span>
                  챕터 {lesson.order}
                </span>
                {alreadyDone && (
                  <span className="text-colab-green shrink-0" title="완료한 챕터">
                    ✓
                  </span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-medium text-colab-text truncate">
                {lesson.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 저장 상태 — 데스크탑 전용 (모바일은 플로팅 배지로 노출) */}
            <span
              className={`hidden md:inline text-[11px] ${saveLabel.cls}`}
              title="노트북 자동 저장 상태"
            >
              {saveLabel.text}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${statusDot.cls}`}
              title={statusDot.title}
            />

            {/* 데스크탑: .ipynb + 런타임 재시작 + 리셋 */}
            <button
              onClick={() => downloadIpynb(cells, `${lesson.id}.ipynb`)}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs rounded border border-colab-subtle text-colab-textDim hover:text-colab-text hover:border-colab-accent transition-colors"
              title=".ipynb 파일로 다운로드"
            >
              ↓ .ipynb
            </button>
            <button
              onClick={handleRestartRuntime}
              disabled={restarting}
              title="런타임 재시작 (변수·함수 모두 초기화)"
              className="hidden sm:inline-flex px-3 py-1.5 text-xs rounded border border-colab-subtle text-colab-textDim hover:text-colab-text hover:border-colab-yellow transition-colors disabled:opacity-50"
            >
              {restarting ? "🔄 재시작 중..." : "🔄 런타임"}
            </button>
            <button
              onClick={handleReset}
              title="처음부터 다시 (저장된 내용 삭제)"
              className="hidden sm:inline-flex px-3 py-1.5 text-xs rounded border border-colab-subtle text-colab-textDim hover:text-colab-text hover:border-colab-red transition-colors"
            >
              ↺ 리셋
            </button>
            {prevLesson && (
              <Link
                to={`/coding/learn/${lang.id}/${trk.id}/${prevLesson.id}`}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs rounded border border-colab-subtle text-colab-textDim hover:text-colab-text hover:border-colab-accent transition-colors"
              >
                ← 이전
              </Link>
            )}

            {/* 모바일: 오버플로 메뉴 */}
            <div ref={menuRef} className="relative sm:hidden">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="더 보기"
                aria-expanded={menuOpen}
                className="px-2.5 py-1.5 text-xs rounded border border-colab-subtle text-colab-textDim hover:text-colab-text hover:border-colab-accent transition-colors"
              >
                ⋯
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-44 rounded-lg border border-colab-subtle bg-colab-panel shadow-lg shadow-black/40 z-30 py-1">
                  {prevLesson && (
                    <Link
                      to={`/coding/learn/${lang.id}/${trk.id}/${prevLesson.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 text-xs text-colab-text hover:bg-colab-hover transition-colors"
                    >
                      ← 이전 챕터
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      downloadIpynb(cells, `${lesson.id}.ipynb`);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-colab-text hover:bg-colab-hover transition-colors"
                  >
                    ↓ .ipynb 다운로드
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      void handleRestartRuntime();
                    }}
                    disabled={restarting}
                    className="w-full text-left px-3 py-2 text-xs text-colab-text hover:bg-colab-hover transition-colors disabled:opacity-50"
                  >
                    {restarting ? "🔄 재시작 중..." : "🔄 런타임 재시작"}
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      void handleReset();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-colab-text hover:bg-colab-hover transition-colors"
                  >
                    ↺ 처음부터 다시
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNext(nextLesson?.id)}
              className="px-2.5 sm:px-3 py-1.5 text-xs rounded bg-colab-accent text-colab-bg hover:bg-colab-accentDim transition-colors font-medium whitespace-nowrap"
            >
              {nextLesson ? "다음 →" : "✓ 완료"}
            </button>
          </div>
        </div>
      </div>

      {/* 노트북 */}
      <div className="flex-1">
        <Notebook showToolbar={false} />
      </div>

      {/* 퀴즈 (레슨에 quiz가 있으면 표시) */}
      {lesson.quiz && (
        <QuizPanel
          key={lesson.id}
          quiz={lesson.quiz}
          quizId={lesson.id}
          onNext={nextLesson ? () => handleNext(nextLesson.id) : undefined}
        />
      )}

      {/* 저장 상태 플로팅 배지 — 화면 우측 하단에 고정 */}
      <div
        className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full
                   bg-colab-panel border border-colab-subtle shadow-lg shadow-black/30
                   pointer-events-none select-none"
      >
        <span className={`text-xs font-medium ${saveLabel.cls}`}>
          {saveLabel.text}
        </span>
      </div>
    </div>
  );
}
