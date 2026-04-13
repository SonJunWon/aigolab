import {
  addDays,
  daysBetween,
  kstDateString,
} from "../storage/supabaseActivityRepo";
import type { DailyActivity } from "../storage/supabaseActivityRepo";

interface Props {
  activity: DailyActivity[];
  /** 표시할 주 수 (기본 13주 ≒ 3개월) */
  weeks?: number;
}

/**
 * GitHub 스타일 활동 히트맵.
 * - 가로: 주 (왼쪽이 과거)
 * - 세로: 요일 (일요일~토요일)
 * - 색 강도: 해당 날의 학습 시간에 비례
 */
export function ActivityHeatmap({ activity, weeks = 13 }: Props) {
  const today = kstDateString();

  // activity → Map으로 빠른 조회
  const map = new Map<string, DailyActivity>();
  for (const a of activity) map.set(a.activity_date, a);

  // 최근 totalDays일의 날짜 배열 (과거 → 오늘)
  // 시작점: 오늘이 속한 주의 토요일을 마지막으로 하여, weeks 주 전의 일요일부터 채움
  const todayDate = new Date(today + "T00:00:00Z");
  const todayDow = todayDate.getUTCDay(); // 0=일 ~ 6=토
  const lastCol = addDays(today, 6 - todayDow); // 이번 주 토요일 (미래 포함)
  const firstCol = addDays(lastCol, -(weeks * 7 - 1)); // weeks주 전 일요일

  const days: Array<{ date: string; inRange: boolean; act?: DailyActivity }> = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = addDays(firstCol, i);
    const inRange = daysBetween(d, today) >= 0; // 오늘 이하
    days.push({ date: d, inRange, act: map.get(d) });
  }

  // 색 강도 계산 (0~4)
  const intensity = (seconds: number): number => {
    if (seconds <= 0) return 0;
    if (seconds < 5 * 60) return 1;       // 5분 미만 — 옅게
    if (seconds < 15 * 60) return 2;      // 15분 미만
    if (seconds < 45 * 60) return 3;      // 45분 미만
    return 4;                              // 45분 이상 — 진하게
  };

  const colors = [
    "bg-brand-subtle/30",       // 0: 활동 없음
    "bg-brand-primary/25",      // 1
    "bg-brand-primary/45",      // 2
    "bg-brand-primary/70",      // 3
    "bg-brand-primary",          // 4
  ];

  // 행(요일)별로 재배열
  const rows: typeof days[] = [[], [], [], [], [], [], []];
  for (let i = 0; i < days.length; i++) {
    rows[i % 7].push(days[i]);
  }

  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="flex gap-2">
      {/* 요일 라벨 */}
      <div className="flex flex-col gap-[3px] pt-0">
        {dayLabels.map((d, i) => (
          <div
            key={d}
            className="h-[12px] text-[9px] text-brand-textDim/60 leading-[12px]"
            // 가독성 위해 홀수 요일만 표시 (월/수/금)
            style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 셀 그리드 */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex flex-col gap-[3px]">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-[3px]">
              {row.map((d) => {
                const secs = d.act?.study_seconds ?? 0;
                const cls = d.inRange ? colors[intensity(secs)] : "bg-transparent";
                const mins = Math.round(secs / 60);
                const title = d.inRange
                  ? secs > 0
                    ? `${d.date} · ${mins}분 학습${
                        d.act?.completed_count ? ` · ${d.act.completed_count}개 완료` : ""
                      }`
                    : `${d.date} · 활동 없음`
                  : "";
                return (
                  <div
                    key={d.date}
                    title={title}
                    className={`w-[12px] h-[12px] rounded-sm ${cls} ${
                      d.date === today ? "ring-1 ring-brand-accent" : ""
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="mt-3 flex items-center gap-1 text-[10px] text-brand-textDim/70">
          <span>적음</span>
          {colors.map((c, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-sm ${c}`} />
          ))}
          <span>많음</span>
        </div>
      </div>
    </div>
  );
}
