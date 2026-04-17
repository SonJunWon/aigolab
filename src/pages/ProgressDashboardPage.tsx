/**
 * 진도 대시보드 — /ai-dev/progress
 *
 * 전체 학습 경로를 Phase별 로드맵으로 시각화
 * 현재 위치 하이라이트, 다음 추천 워크샵
 */

import { Link } from "react-router-dom";
import { WORKSHOP_LESSONS } from "../content/ai-engineering/workshops";
import { useProgressStore } from "../store/progressStore";

/* ─── Phase 정의 ─── */
const PHASES = [
  { id: 0, title: "환경 설정", icon: "⚙️", color: "text-gray-400", border: "border-gray-500/30", bg: "bg-gray-500/10", range: [99, 100] },
  { id: 1, title: "Phase 1: 기초", icon: "🌱", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", range: [101, 106] },
  { id: 2, title: "Phase 2: 실전", icon: "🔧", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", range: [107, 111] },
  { id: 3, title: "Phase 3: 풀스택", icon: "🏗️", color: "text-violet-400", border: "border-violet-500/30", bg: "bg-violet-500/10", range: [112, 116] },
  { id: 4, title: "Phase 4: 통합", icon: "🔗", color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10", range: [117, 121] },
  { id: 5, title: "Phase 5: 크리에이터", icon: "🎨", color: "text-pink-400", border: "border-pink-500/30", bg: "bg-pink-500/10", range: [122, 126] },
  { id: 6, title: "Phase 6: AI 에이전트", icon: "🤖", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10", range: [127, 131] },
  { id: 7, title: "Phase 7: 수익화", icon: "💰", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10", range: [132, 136] },
  { id: 8, title: "Phase 8: 최종", icon: "🚀", color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10", range: [137, 140] },
] as const;

export function ProgressDashboardPage() {
  const isCompleted = useProgressStore((s) => s.isCompleted);

  const totalLessons = WORKSHOP_LESSONS.length;
  const completedCount = WORKSHOP_LESSONS.filter((l) =>
    isCompleted("ai-engineering", "beginner", l.id)
  ).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // 다음 추천: 첫 번째 미완료 워크샵
  const nextWorkshop = WORKSHOP_LESSONS.find(
    (l) => !isCompleted("ai-engineering", "beginner", l.id)
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">

        {/* 네비게이션 */}
        <div className="mb-6">
          <Link to="/ai-dev" className="text-sm text-brand-textDim hover:text-brand-accent transition-colors">
            ← AI 앱 개발
          </Link>
        </div>

        {/* 히어로 */}
        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-brand-accent/10 via-brand-panel to-brand-panel border border-brand-subtle">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">학습 진도</h1>
          <p className="text-sm text-brand-textDim mb-6">
            기초부터 SaaS 런칭까지, 8단계 학습 여정
          </p>

          {/* 전체 진도 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-3 bg-brand-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-accent to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-brand-accent shrink-0">
              {progressPct}%
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-brand-textDim">
            <span>완료 {completedCount}개</span>
            <span>남은 {totalLessons - completedCount}개</span>
            <span>전체 {totalLessons}개</span>
          </div>
        </div>

        {/* 다음 추천 워크샵 */}
        {nextWorkshop && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-3">
              다음 추천
            </h2>
            <Link
              to={`/ai-dev/workshop/${nextWorkshop.id}`}
              className="group flex items-center gap-4 p-5 rounded-xl border border-brand-accent/30
                         bg-gradient-to-r from-brand-accent/8 to-brand-panel
                         hover:border-brand-accent/60 transition-all"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-accent/15 flex items-center justify-center text-xl font-bold text-brand-accent">
                {nextWorkshop.order <= 100 ? "00" : String(nextWorkshop.order - 100).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold group-hover:text-brand-accent transition-colors">
                  {nextWorkshop.title}
                </div>
                {nextWorkshop.subtitle && (
                  <p className="text-xs text-brand-textDim truncate mt-0.5">{nextWorkshop.subtitle}</p>
                )}
              </div>
              <span className="shrink-0 text-brand-accent group-hover:translate-x-1 transition-transform text-lg">→</span>
            </Link>
          </div>
        )}

        {/* Phase별 로드맵 */}
        <div className="space-y-4">
          {PHASES.map((phase) => {
            const lessons = WORKSHOP_LESSONS.filter(
              (l) => l.order >= phase.range[0] && l.order <= phase.range[1]
            );
            if (lessons.length === 0) return null;

            const done = lessons.filter((l) => isCompleted("ai-engineering", "beginner", l.id)).length;
            const total = lessons.length;
            const pct = Math.round((done / total) * 100);
            const allDone = done === total;

            return (
              <div key={phase.id} className={`rounded-xl border ${phase.border} ${phase.bg} p-4 sm:p-5`}>
                {/* Phase 헤더 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{phase.icon}</span>
                    <h3 className={`text-sm sm:text-base font-semibold ${phase.color}`}>{phase.title}</h3>
                    {allDone && <span className="text-xs text-emerald-400">✓ 완료</span>}
                  </div>
                  <span className="text-xs text-brand-textDim">{done}/{total}</span>
                </div>

                {/* 진도 바 */}
                <div className="h-1.5 bg-brand-subtle/50 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-emerald-400" : "bg-brand-accent"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* 워크샵 노드 */}
                <div className="flex flex-wrap gap-2">
                  {lessons.map((l) => {
                    const lDone = isCompleted("ai-engineering", "beginner", l.id);
                    const num = l.order <= 100 ? "00" : String(l.order - 100).padStart(2, "0");
                    return (
                      <Link
                        key={l.id}
                        to={`/ai-dev/workshop/${l.id}`}
                        title={l.title}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-medium
                                    border transition-all
                                    ${lDone
                                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                      : "bg-brand-panel/60 border-brand-subtle/50 text-brand-textDim hover:border-brand-accent/50 hover:text-brand-accent"
                                    }`}
                      >
                        {lDone ? "✓" : num}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 */}
        <div className="mt-8 text-center">
          <Link
            to="/ai-dev/workshop"
            className="text-sm text-brand-textDim hover:text-brand-accent transition-colors"
          >
            워크샵 목록 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
