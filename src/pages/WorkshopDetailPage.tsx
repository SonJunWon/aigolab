/**
 * 워크샵 상세 소개 페이지 — /ai-dev/workshop/:workshopId
 *
 * 목록 → [이 페이지] → 실습 시작
 * 워크샵의 첫 번째 마크다운 셀에서 소개 정보를 추출하여 표시
 */

import { Link, Navigate, useParams } from "react-router-dom";
import { WORKSHOP_LESSONS } from "../content/ai-engineering/workshops";
import { useProgressStore } from "../store/progressStore";
import type { Lesson } from "../types/lesson";

/* ─── Phase 메타 ─── */
interface PhaseMeta {
  label: string;
  icon: string;
  color: string;
  bg: string;
}

function getPhaseMeta(order: number): PhaseMeta {
  if (order <= 100) return { label: "환경 설정", icon: "⚙️", color: "text-gray-400", bg: "bg-gray-500/10" };
  if (order <= 106) return { label: "Phase 1: 기초", icon: "🌱", color: "text-emerald-400", bg: "bg-emerald-500/10" };
  if (order <= 111) return { label: "Phase 2: 실전", icon: "🔧", color: "text-blue-400", bg: "bg-blue-500/10" };
  if (order <= 116) return { label: "Phase 3: 풀스택", icon: "🏗️", color: "text-violet-400", bg: "bg-violet-500/10" };
  if (order <= 121) return { label: "Phase 4: 통합", icon: "🔗", color: "text-cyan-400", bg: "bg-cyan-500/10" };
  if (order <= 126) return { label: "Phase 5: 크리에이터", icon: "🎨", color: "text-pink-400", bg: "bg-pink-500/10" };
  if (order <= 131) return { label: "Phase 6: AI 에이전트", icon: "🤖", color: "text-amber-400", bg: "bg-amber-500/10" };
  if (order <= 136) return { label: "Phase 7: 수익화", icon: "💰", color: "text-orange-400", bg: "bg-orange-500/10" };
  return { label: "Phase 8: 최종 종합", icon: "🚀", color: "text-red-400", bg: "bg-red-500/10" };
}

/* ─── 난이도 ─── */
function getDifficulty(order: number): { label: string; stars: number; cls: string } {
  if (order <= 100) return { label: "입문", stars: 1, cls: "text-gray-400" };
  if (order <= 106) return { label: "기초", stars: 1, cls: "text-emerald-400" };
  if (order <= 111) return { label: "초급", stars: 2, cls: "text-blue-400" };
  if (order <= 116) return { label: "중급", stars: 3, cls: "text-violet-400" };
  if (order <= 126) return { label: "중급+", stars: 3, cls: "text-cyan-400" };
  if (order <= 131) return { label: "고급", stars: 4, cls: "text-amber-400" };
  if (order <= 136) return { label: "고급+", stars: 4, cls: "text-orange-400" };
  return { label: "최고급", stars: 5, cls: "text-red-400" };
}

/* ─── 워크샵 셀에서 정보 추출 ─── */
function extractWorkshopInfo(lesson: Lesson) {
  const markdownCells = lesson.cells.filter((c) => c.type === "markdown");
  const firstMd = markdownCells[0]?.source ?? "";

  // ASCII 목업 추출 (``` 블록)
  const codeBlockMatch = firstMd.match(/```[\s\S]*?```/);
  const asciiMockup = codeBlockMatch?.[0]?.replace(/```/g, "").trim() ?? null;

  // "이 워크샵에서 만들 것" 이후 첫 문장 추출
  const descMatch = firstMd.match(/이 워크샵에서 만들 것[\s\S]*?\n\n\*\*(.*?)\*\*/);
  const mainDesc = descMatch?.[1] ?? lesson.subtitle ?? "";

  // Part A / Part B 셀 개수
  const llmCodeCount = lesson.cells.filter((c) => c.type === "llm-code").length;
  const hasQuiz = !!lesson.quiz;

  // 학습 키워드 추출 (== == 용어)
  const glossaryTerms: string[] = [];
  for (const cell of lesson.cells) {
    if (cell.type === "markdown") {
      const matches = cell.source.matchAll(/==([^=]+)==/g);
      for (const m of matches) {
        const term = m[1].trim();
        if (!glossaryTerms.includes(term)) glossaryTerms.push(term);
      }
    }
  }

  return { asciiMockup, mainDesc, llmCodeCount, hasQuiz, glossaryTerms };
}

/* ─── 이전/다음 워크샵 찾기 ─── */
function findAdjacentWorkshops(lessonId: string) {
  const idx = WORKSHOP_LESSONS.findIndex((l) => l.id === lessonId);
  return {
    prev: idx > 0 ? WORKSHOP_LESSONS[idx - 1] : null,
    next: idx < WORKSHOP_LESSONS.length - 1 ? WORKSHOP_LESSONS[idx + 1] : null,
  };
}

/* ─── 메인 컴포넌트 ─── */
export function WorkshopDetailPage() {
  const { workshopId } = useParams<{ workshopId: string }>();
  const isCompleted = useProgressStore((s) => s.isCompleted);

  const lesson = WORKSHOP_LESSONS.find((l) => l.id === workshopId);
  if (!lesson) return <Navigate to="/ai-dev/workshop" replace />;

  const phase = getPhaseMeta(lesson.order);
  const diff = getDifficulty(lesson.order);
  const done = isCompleted("ai-engineering", "beginner", lesson.id);
  const info = extractWorkshopInfo(lesson);
  const { prev, next } = findAdjacentWorkshops(lesson.id);

  const workshopNum = lesson.order <= 100
    ? "W00"
    : `W${String(lesson.order - 100).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">

        {/* ─── 네비게이션 ─── */}
        <div className="mb-6 flex items-center gap-2 text-sm text-brand-textDim">
          <Link to="/ai-dev/workshop" className="hover:text-brand-accent transition-colors">
            ← 워크샵 목록
          </Link>
          <span>/</span>
          <span className={phase.color}>{phase.icon} {phase.label}</span>
        </div>

        {/* ─── 히어로 카드 ─── */}
        <div className="rounded-2xl border border-brand-subtle overflow-hidden mb-8">
          {/* 상단 배너 */}
          <div className={`px-6 sm:px-8 pt-6 sm:pt-8 pb-4 ${phase.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${phase.bg} ${phase.color} border border-current/20`}>
                {workshopNum}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${phase.bg} ${diff.cls}`}>
                {"★".repeat(diff.stars)}{"☆".repeat(5 - diff.stars)} {diff.label}
              </span>
              {done && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400">
                  ✓ 완료
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{lesson.title}</h1>
            {lesson.subtitle && (
              <p className="text-base text-brand-textDim">{lesson.subtitle}</p>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="px-6 sm:px-8 py-4 bg-brand-panel/60 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-brand-subtle/50">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-brand-textDim mb-0.5">예상 시간</div>
              <div className="text-sm font-medium">약 {lesson.estimatedMinutes}분</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-brand-textDim mb-0.5">실습 셀</div>
              <div className="text-sm font-medium">{info.llmCodeCount}개 LLM 셀</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-brand-textDim mb-0.5">퀴즈</div>
              <div className="text-sm font-medium">{info.hasQuiz ? `${lesson.quiz!.questions.length}문항` : "없음"}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-brand-textDim mb-0.5">구성</div>
              <div className="text-sm font-medium">Part A + B</div>
            </div>
          </div>
        </div>

        {/* ─── 완성 모습 (ASCII 목업) ─── */}
        {info.asciiMockup && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">완성 모습</h2>
            <div className="p-4 sm:p-6 rounded-xl bg-brand-panel border border-brand-subtle overflow-x-auto">
              <pre className="text-xs sm:text-sm text-brand-textDim font-mono whitespace-pre leading-relaxed">
                {info.asciiMockup}
              </pre>
            </div>
          </div>
        )}

        {/* ─── 이런 걸 배워요 ─── */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">이런 걸 배워요</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-panel/60 border border-brand-subtle/50">
              <span className="text-lg shrink-0">🧠</span>
              <div>
                <div className="text-sm font-medium mb-0.5">Part A — 핵심 개념 실습</div>
                <div className="text-xs text-brand-textDim">
                  LLM 셀에서 {info.llmCodeCount}개 실습으로 핵심 기술을 먼저 검증해요
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-panel/60 border border-brand-subtle/50">
              <span className="text-lg shrink-0">🛠️</span>
              <div>
                <div className="text-sm font-medium mb-0.5">Part B — MD 레시피로 앱 완성</div>
                <div className="text-xs text-brand-textDim">
                  AI 코딩 도구에 레시피를 붙여넣으면 실제 웹앱이 만들어져요
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 핵심 키워드 ─── */}
        {info.glossaryTerms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">핵심 키워드</h2>
            <div className="flex flex-wrap gap-2">
              {info.glossaryTerms.slice(0, 12).map((term) => (
                <span
                  key={term}
                  className="px-3 py-1 rounded-full text-xs bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── 학습 흐름 ─── */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">학습 흐름</h2>
          <div className="relative pl-6 border-l-2 border-brand-subtle space-y-4">
            <div className="relative">
              <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-brand-accent" />
              <div className="text-sm font-medium">Part A: 핵심 기술 실습</div>
              <div className="text-xs text-brand-textDim">이 페이지의 LLM 셀에서 직접 실행하며 배워요</div>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-brand-accent/60" />
              <div className="text-sm font-medium">Part B: MD 레시피 → 실제 앱</div>
              <div className="text-xs text-brand-textDim">내 컴퓨터에서 Claude Code / Cursor로 완성</div>
            </div>
            {info.hasQuiz && (
              <div className="relative">
                <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-brand-accent/30" />
                <div className="text-sm font-medium">확인 퀴즈</div>
                <div className="text-xs text-brand-textDim">{lesson.quiz!.questions.length}문항으로 배운 내용 점검</div>
              </div>
            )}
            <div className="relative">
              <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-emerald-400/60" />
              <div className="text-sm font-medium">도전 과제</div>
              <div className="text-xs text-brand-textDim">추가 기능을 AI에게 요청해서 앱을 키워보세요</div>
            </div>
          </div>
        </div>

        {/* ─── CTA 버튼 ─── */}
        <div className="mb-10">
          <Link
            to={`/coding/learn/ai-engineering/beginner/${lesson.id}`}
            className="block w-full py-4 rounded-xl text-center font-semibold text-base
                       bg-gradient-to-r from-brand-accent to-cyan-500 text-white
                       hover:brightness-110 transition-all shadow-lg shadow-brand-accent/20"
          >
            {done ? "다시 학습하기" : "학습 시작하기"} →
          </Link>
        </div>

        {/* ─── 이전/다음 워크샵 ─── */}
        <div className="flex items-stretch gap-3">
          {prev ? (
            <Link
              to={`/ai-dev/workshop/${prev.id}`}
              className="flex-1 p-4 rounded-xl border border-brand-subtle bg-brand-panel/40
                         hover:border-brand-accent/40 transition-all group"
            >
              <div className="text-[10px] text-brand-textDim mb-1">← 이전</div>
              <div className="text-sm font-medium group-hover:text-brand-accent transition-colors truncate">
                {prev.title}
              </div>
            </Link>
          ) : <div className="flex-1" />}
          {next ? (
            <Link
              to={`/ai-dev/workshop/${next.id}`}
              className="flex-1 p-4 rounded-xl border border-brand-subtle bg-brand-panel/40
                         hover:border-brand-accent/40 transition-all group text-right"
            >
              <div className="text-[10px] text-brand-textDim mb-1">다음 →</div>
              <div className="text-sm font-medium group-hover:text-brand-accent transition-colors truncate">
                {next.title}
              </div>
            </Link>
          ) : <div className="flex-1" />}
        </div>

      </div>
    </div>
  );
}
