import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급3 시리즈C(운영 만들기) 02강 — 텔레메트리 파이프라인.
 * 레코드→주간 집계→어제 대비 비교→신호등 판정의 자동화.
 */
export const lessonC02: Lesson = {
  id: "ai-eng-a3-c02-telemetry",
  language: "ai-engineering",
  track: "advanced3",
  order: 22,
  title: "C2. 텔레메트리 파이프라인 — 계기판의 배관",
  subtitle: "B2의 월요일 5분을 함수 하나로 — 집계·비교·신호등",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🎛 고급3·C2강. 텔레메트리 파이프라인
### — 계기판의 배관

⏱️ 45분 · 🧰 API 키 · 🗺️ 운영 루프: **① 관측의 코드화** · 선수: C1

> 💡 B2에서 손으로 채우던 주간 기록표(3숫자·기준선·신호등)를 오늘 자동화합니다.
> 원료는 C1의 run 레코드뿐 — ==텔레메트리== 는 거창한 게 아니라
> **집계(aggregate) → 비교(compare) → 판정(judge)** 세 함수의 파이프라인이에요.
> 설계 원칙은 B2 그대로: 3숫자만, 추이로, 행동과 연결.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── C1의 산출물: 2주치 run 레코드 (시뮬레이션 생성) ──
type RunRecord = { id: string; ts: number; version: string; ok: boolean; cost: number; quality?: number };
const DAY = 86400000, base = 1700000000000;
const LOG: RunRecord[] = [];
// 1주차: 건강 / 2주차: 품질 완만 하락 + 비용 상승 (드리프트 심기!)
for (let d = 0; d < 14; d++) {
  const week2 = d >= 7;
  LOG.push({
    id: \`run-\${d}\`, ts: base + d * DAY, version: "v12",
    ok: d !== 9,                                        // 10일째 실패 1건
    cost: 100 + (week2 ? d * 6 : 0),                    // 2주차 비용 상승
    quality: week2 ? 8.4 - (d - 7) * 0.15 : 8.3 + (d % 3) * 0.1,  // 2주차 완만 하락
  });
}

// ══ 배관 1. 집계 — 주 단위 3숫자 ══
type WeekStats = { week: number; quality: number; cost: number; failures: number; runs: number };
function aggregate(log: RunRecord[], t0: number): WeekStats[] {
  const weeks = new Map<number, RunRecord[]>();
  for (const r of log) {
    const w = Math.floor((r.ts - t0) / (7 * DAY));
    (weeks.get(w) ?? weeks.set(w, []).get(w)!).push(r);
  }
  return [...weeks.entries()].map(([week, rs]) => ({
    week,
    quality: +(rs.filter((r) => r.quality != null).reduce((a, r) => a + r.quality!, 0) / rs.filter((r) => r.quality != null).length).toFixed(2),
    cost: Math.round(rs.reduce((a, r) => a + r.cost, 0) / rs.length),
    failures: rs.filter((r) => !r.ok).length,
    runs: rs.length,
  })).sort((a, b) => a.week - b.week);
}

// ══ 배관 2. 비교 — 기준선은 '평소'(이전 주들의 평균) ══
function compare(stats: WeekStats[]) {
  const cur = stats[stats.length - 1];
  const hist = stats.slice(0, -1);
  const avg = (f: (s: WeekStats) => number) => hist.reduce((a, s) => a + f(s), 0) / hist.length;
  return {
    cur,
    dQuality: +(cur.quality - avg((s) => s.quality)).toFixed(2),
    dCostPct: Math.round(((cur.cost - avg((s) => s.cost)) / avg((s) => s.cost)) * 100),
    dFailures: cur.failures - avg((s) => s.failures),
  };
}

// ══ 배관 3. 판정 — 신호등 + '행동'을 문자열로 (B2 행동 연결의 코드화) ══
function judge(c: ReturnType<typeof compare>): { light: string; actions: string[] } {
  const actions: string[] = [];
  if (c.dQuality <= -0.5) actions.push("품질 급락 — 일지 정밀 조사 + 개선 착수(C6 게이트로)");
  else if (c.dQuality <= -0.2) actions.push("품질 완만 하락 — 다음 주 샘플 확대 채점");
  if (c.dCostPct >= 100) actions.push("비용 2배 — 거버너 점검(C8)");
  else if (c.dCostPct >= 30) actions.push("비용 +30% — 원인 갈래 확인");
  if (c.cur.failures >= 3) actions.push("실패 다발 — 분류기 리포트 확인(C5)");
  const light = actions.some((a) => a.includes("급락") || a.includes("2배") || a.includes("다발")) ? "🔴"
              : actions.length ? "🟡" : "🟢";
  return { light, actions };
}

// ── 파이프라인 실행: B2의 월요일 5분이 함수 셋으로 ──
const stats = aggregate(LOG, base);
console.log("📊 주간 집계:"); console.table(stats);
const cmp = compare(stats);
const verdict = judge(cmp);
console.log(\`\\n📈 이번 주: 품질 \${cmp.dQuality >= 0 ? "+" : ""}\${cmp.dQuality} · 비용 \${cmp.dCostPct >= 0 ? "+" : ""}\${cmp.dCostPct}% · 실패 \${cmp.cur.failures}건\`);
console.log(\`\${verdict.light} 판정\`);
verdict.actions.forEach((a) => console.log("  → " + a));
console.log("\\n👉 심어둔 드리프트(2주차 하락)를 배관이 자동으로 잡아냈다 — B2의 눈이 코드가 됐다.");`,
      hints: [
        "judge()가 문자열 '행동'을 반환하는 설계 — B2의 '행동 연결' 조건이 코드로 강제됩니다. 행동 없는 지표는 아예 judge에 못 들어와요(계기판 중독의 코드적 예방).",
        "기준선을 고정값이 아니라 '이전 주들의 평균'으로 계산 — 시스템이 성장하면 기준선도 따라 움직입니다. 단, 서서히 나빠지는 드리프트는 기준선도 함께 끌어내리니, 장기(첫 4주) 고정 기준선과 병행하는 변형을 연구 노트에서 다뤄요.",
        "aggregate가 주 단위인 이유는 B2와 동일 — 일 단위는 노이즈가 커서 '기분 탓' 논쟁이 재발합니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 🚨 판정에서 알람으로 — 마지막 1미터

배관의 끝은 사람에게 닿아야 합니다. A6 알람 피로를 기억하며:

| 판정 | 전달 |
|------|------|
| 🟢 | **아무것도 보내지 않는다** (주간 기록표에만 적재) — 초록 알람이 알람을 죽인다 |
| 🟡 | 주간 리뷰 때 보이도록 기록 + 메모 (즉시 알림 아님) |
| 🔴 | 즉시 알림 — 단, **행동 문자열과 함께** ("품질 급락" + 뭘 할지) |

'행동 가능한 것만, 행동과 함께' — B6 알람 설계 원칙이 배관의 마지막 밸브입니다.

## 🔬 연구 노트 — C2

1. **이중 기준선**: '이전 주 평균'(적응형)과 '첫 4주 고정'(절대) 두 기준선을 병행 계산하라. 서서히 진행되는 드리프트는 어느 쪽에서 먼저 보이는가?
2. **노이즈 실험**: quality에 ±0.5 무작위 노이즈를 섞고 judge의 문턱(-0.2)이 거짓 🟡를 얼마나 내는지 세라 — 문턱과 거짓 경보율의 관계가 B6 '거짓 경보율도 계기판에' 조언의 근거다.
3. **리포트 생성**: 집계·비교·판정을 markdown 주간 리포트 문자열로 조립하는 weeklyReport()를 짜라 — B3 주간 리뷰의 0~5분 구간이 완전 자동화된다.

> 🎯 **(전부 잊어도 이것만)**
> ## 텔레메트리 = **집계 → 비교 → 판정** 세 함수. 기준선은 '평소'(이전 주 평균), 판정은 반드시 **행동 문자열과 함께** — 행동 없는 지표는 배관에 못 들어온다.
> 그리고 🟢는 침묵한다 — 초록 알람이 알람을 죽인다.

📎 **다음 강 — C3. 평가 러너**: 레코드의 quality 필드는 아직 비어 있죠. 골든 세트 자동 채점과 LLM 판정자(그리고 판정자의 편향)로 그 칸을 채웁니다.`,
    },
  ],

  quiz: {
    title: "고급3·C2강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "judge()가 신호등과 함께 '행동 문자열'을 반환하게 설계한 이유는?",
        options: [
          "로그가 길어야 있어 보여서",
          "B2의 '행동과 연결' 조건을 코드로 강제 — 행동 없는 지표가 계기판에 들어오는 것 자체를 막는다",
          "문자열이 숫자보다 처리 속도가 빨라서",
        ],
        correctIndex: 1,
        explanation:
          "계기판 중독(A6)의 코드적 예방이에요. 🔴 알림에도 '뭘 할지'가 항상 붙어 나갑니다.",
      },
      {
        type: "multiple-choice",
        question: "🟢(정상) 판정 때 아무 알림도 보내지 않는 이유는?",
        options: [
          "좋은 소식은 아껴야 해서",
          "초록 알람이 쌓이면 알람 전체가 무시된다 — A6 알람 피로의 예방",
          "🟢 이모지 전송 비용이 비싸서",
        ],
        correctIndex: 1,
        explanation:
          "'정상입니다' 알림 100개 속에 '급락' 1개가 묻혀요. 알람은 행동이 필요한 것만.",
      },
      {
        type: "multiple-choice",
        question: "적응형 기준선(이전 주 평균)의 맹점은?",
        options: [
          "계산이 너무 어렵다",
          "서서히 나빠지는 드리프트는 기준선도 함께 끌어내려 경보가 늦어진다 — 장기 고정 기준선 병행이 보완책",
          "기준선은 법으로 고정해야 한다",
        ],
        correctIndex: 1,
        explanation:
          "매주 조금씩 나빠지면 '평소'도 나빠진 값이 되죠. 첫 4주 고정 기준선을 함께 보면 장기 드리프트가 잡힙니다.",
      },
    ],
  } satisfies Quiz,
};
