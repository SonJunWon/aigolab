/**
 * 바이브코딩 워크샵 목록 페이지 — /ai-dev/workshop
 *
 * Phase별 그룹핑 + 진도 표시 + 카드 강화
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { WORKSHOP_LESSONS } from "../content/ai-engineering/workshops";
import { useProgressStore } from "../store/progressStore";
import type { Lesson } from "../types/lesson";

/* ─── Phase 정의 ─── */
interface Phase {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;       // Tailwind accent color class
  bgGradient: string;  // 헤더 배경 그라디언트
  orderRange: [number, number]; // order 범위 (inclusive)
}

const PHASES: Phase[] = [
  {
    id: 0,
    title: "환경 설정",
    subtitle: "AI 개발 환경 구축",
    icon: "⚙️",
    color: "text-gray-400",
    bgGradient: "from-gray-500/10 to-gray-600/5",
    orderRange: [99, 100],
  },
  {
    id: 1,
    title: "Phase 1: 기초",
    subtitle: "API 호출 + 결과 표시",
    icon: "🌱",
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/10 to-emerald-600/5",
    orderRange: [101, 106],
  },
  {
    id: 2,
    title: "Phase 2: 실전 도구",
    subtitle: "완성도 있는 단독 앱",
    icon: "🔧",
    color: "text-blue-400",
    bgGradient: "from-blue-500/10 to-blue-600/5",
    orderRange: [107, 111],
  },
  {
    id: 3,
    title: "Phase 3: 풀스택",
    subtitle: "DB + 인증 + 배포",
    icon: "🏗️",
    color: "text-violet-400",
    bgGradient: "from-violet-500/10 to-violet-600/5",
    orderRange: [112, 116],
  },
  {
    id: 4,
    title: "Phase 4: 통합",
    subtitle: "외부 서비스 연동",
    icon: "🔗",
    color: "text-cyan-400",
    bgGradient: "from-cyan-500/10 to-cyan-600/5",
    orderRange: [117, 121],
  },
  {
    id: 5,
    title: "Phase 5: 크리에이터",
    subtitle: "콘텐츠 제작 도구",
    icon: "🎨",
    color: "text-pink-400",
    bgGradient: "from-pink-500/10 to-pink-600/5",
    orderRange: [122, 126],
  },
  {
    id: 6,
    title: "Phase 6: AI 에이전트",
    subtitle: "자동화 + 멀티에이전트",
    icon: "🤖",
    color: "text-amber-400",
    bgGradient: "from-amber-500/10 to-amber-600/5",
    orderRange: [127, 131],
  },
  {
    id: 7,
    title: "Phase 7: 수익화",
    subtitle: "결제 연동 + 실무 도구",
    icon: "💰",
    color: "text-orange-400",
    bgGradient: "from-orange-500/10 to-orange-600/5",
    orderRange: [132, 136],
  },
  {
    id: 8,
    title: "Phase 8: 최종 종합",
    subtitle: "앱을 만드는 앱 → SaaS 런칭",
    icon: "🚀",
    color: "text-red-400",
    bgGradient: "from-red-500/10 to-red-600/5",
    orderRange: [137, 140],
  },
];

/* ─── 난이도 뱃지 ─── */
function getDifficulty(order: number): { label: string; cls: string } {
  if (order <= 100) return { label: "입문", cls: "bg-gray-500/20 text-gray-300" };
  if (order <= 106) return { label: "기초", cls: "bg-emerald-500/20 text-emerald-300" };
  if (order <= 111) return { label: "초급", cls: "bg-blue-500/20 text-blue-300" };
  if (order <= 116) return { label: "중급", cls: "bg-violet-500/20 text-violet-300" };
  if (order <= 126) return { label: "중급+", cls: "bg-cyan-500/20 text-cyan-300" };
  if (order <= 131) return { label: "고급", cls: "bg-amber-500/20 text-amber-300" };
  if (order <= 136) return { label: "고급+", cls: "bg-orange-500/20 text-orange-300" };
  return { label: "최고급", cls: "bg-red-500/20 text-red-300" };
}

/* ─── Phase에 속하는 워크샵 필터 ─── */
function getLessonsForPhase(phase: Phase): Lesson[] {
  return WORKSHOP_LESSONS.filter(
    (l) => l.order >= phase.orderRange[0] && l.order <= phase.orderRange[1]
  );
}

/* ─── 메인 컴포넌트 ─── */
export function WorkshopListPage() {
  const isCompleted = useProgressStore((s) => s.isCompleted);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const togglePhase = (phaseId: number) =>
    setCollapsed((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));

  // 전체 통계
  const totalLessons = WORKSHOP_LESSONS.length;
  const completedCount = WORKSHOP_LESSONS.filter((l) =>
    isCompleted("ai-engineering", "beginner", l.id)
  ).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {/* ─── 상단 네비 ─── */}
        <div className="mb-6">
          <Link
            to="/ai-dev"
            className="text-sm text-brand-textDim hover:text-brand-accent transition-colors"
          >
            ← AI 앱 개발
          </Link>
        </div>

        {/* ─── 히어로 ─── */}
        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-brand-accent/10 via-brand-panel to-brand-panel border border-brand-subtle">
          <div className="flex items-start gap-4">
            <div className="text-4xl sm:text-5xl">🛠️</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">바이브코딩 워크샵</h1>
              <p className="text-sm text-brand-textDim mb-4">
                MD 레시피 + AI 코딩 도구 = 완성도 있는 프로그램
              </p>

              {/* 전체 진도 바 */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-brand-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-accent to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs text-brand-textDim shrink-0">
                  {completedCount} / {totalLessons} ({progressPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center p-3 rounded-lg bg-brand-bg/50">
              <div className="text-lg font-bold text-brand-accent">{totalLessons}</div>
              <div className="text-[10px] text-brand-textDim">워크샵</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-brand-bg/50">
              <div className="text-lg font-bold text-brand-accent">8</div>
              <div className="text-[10px] text-brand-textDim">단계</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-brand-bg/50">
              <div className="text-lg font-bold text-brand-accent">무료</div>
              <div className="text-[10px] text-brand-textDim">API만 사용</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-brand-textDim mb-8">
          💡 코딩 경험 없어도 OK — 글을 쓸 수 있으면 앱을 만들 수 있어요.
        </p>

        {/* ─── Phase별 그룹 ─── */}
        <div className="space-y-6">
          {PHASES.map((phase) => {
            const lessons = getLessonsForPhase(phase);
            if (lessons.length === 0) return null;

            const phaseCompleted = lessons.filter((l) =>
              isCompleted("ai-engineering", "beginner", l.id)
            ).length;
            const phaseTotal = lessons.length;
            const phasePct = Math.round((phaseCompleted / phaseTotal) * 100);
            const isCollapsed = collapsed[phase.id] ?? false;

            return (
              <div key={phase.id} className="rounded-xl border border-brand-subtle overflow-hidden">
                {/* Phase 헤더 */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className={`w-full p-4 sm:p-5 flex items-center justify-between gap-3
                              bg-gradient-to-r ${phase.bgGradient}
                              hover:brightness-110 transition-all cursor-pointer text-left`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{phase.icon}</span>
                    <div className="min-w-0">
                      <h2 className={`text-base sm:text-lg font-semibold ${phase.color}`}>
                        {phase.title}
                      </h2>
                      <p className="text-xs text-brand-textDim">{phase.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {/* 미니 진도 */}
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-brand-subtle rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            phasePct === 100 ? "bg-emerald-400" : "bg-brand-accent"
                          }`}
                          style={{ width: `${phasePct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-brand-textDim w-12 text-right">
                        {phaseCompleted}/{phaseTotal}
                      </span>
                    </div>
                    {/* 접기/펼치기 화살표 */}
                    <span className={`text-brand-textDim transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}>
                      ▾
                    </span>
                  </div>
                </button>

                {/* 워크샵 카드 목록 */}
                {!isCollapsed && (
                  <div className="divide-y divide-brand-subtle/50">
                    {lessons.map((lesson) => {
                      const done = isCompleted("ai-engineering", "beginner", lesson.id);
                      const diff = getDifficulty(lesson.order);

                      return (
                        <Link
                          key={lesson.id}
                          to={`/ai-dev/workshop/${lesson.id}`}
                          className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5
                                     bg-brand-panel/40 hover:bg-brand-panel/80 transition-all"
                        >
                          {/* 완료 체크 / 번호 */}
                          <div
                            className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold
                                        ${done
                                          ? "bg-emerald-500/20 text-emerald-400"
                                          : "bg-brand-subtle/60 text-brand-textDim group-hover:bg-brand-accent/15 group-hover:text-brand-accent"
                                        } transition-colors`}
                          >
                            {done ? "✓" : lesson.order <= 100 ? "00" : String(lesson.order - 100).padStart(2, "0")}
                          </div>

                          {/* 제목 + 부제 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm sm:text-base font-medium truncate transition-colors
                                            ${done ? "text-brand-textDim" : "text-brand-text group-hover:text-brand-accent"}`}
                              >
                                {lesson.title}
                              </h3>
                            </div>
                            {lesson.subtitle && (
                              <p className="text-[11px] sm:text-xs text-brand-textDim truncate mt-0.5">
                                {lesson.subtitle}
                              </p>
                            )}
                          </div>

                          {/* 메타 뱃지 */}
                          <div className="shrink-0 flex items-center gap-2">
                            <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${diff.cls}`}>
                              {diff.label}
                            </span>
                            <span className="text-[11px] text-brand-textDim whitespace-nowrap">
                              {lesson.estimatedMinutes}분
                            </span>
                            <span className="text-brand-textDim group-hover:text-brand-accent transition-colors">
                              →
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── 하단 안내 ─── */}
        <div className="mt-8 p-6 rounded-xl border border-dashed border-brand-subtle text-center">
          <p className="text-sm text-brand-textDim">
            총 {totalLessons}개 워크샵 — 기초부터 SaaS 런칭까지 단계별로 도전해보세요
          </p>
        </div>
      </div>
    </div>
  );
}
