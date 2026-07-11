import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급3 시리즈C(운영 만들기) 08강 — 실전 ② 비용 거버너와 알람.
 * 운영 30일 아크 2주차: 일일 예산·성능 저하 모드·행동 가능한 2단 알람.
 */
export const lessonC08: Lesson = {
  id: "ai-eng-a3-c08-cost-governor",
  language: "ai-engineering",
  track: "advanced3",
  order: 28,
  title: "C8. 🏗 실전 ② 비용 거버너와 알람 설계",
  subtitle: "운영 30일 아크 2주차: 폭증하는 날에도 우아하게 버티기",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🏗 고급3·C8강. 실전 ② 비용 거버너와 알람 설계
### — 운영 30일 아크 2주차

⏱️ 50분 · 🧰 API 키 · 🗺️ ⑤ 통제의 코드화 · 선수: C7

> 💡 **2주차 시나리오**: 대형 릴리즈 주간 — 평소 10건이던 PR이 하루 60건으로 폭증.
> 검증단 3인 × 발견당 = 비용이 기하급수로 뜁니다. 그냥 두면 월 예산이 이틀에 소진.
> 그렇다고 시스템을 꺼버리면? 릴리즈 주간에 리뷰가 없는 게 더 위험하죠.
> 답은 **우아한 성능 저하(graceful degradation)** — 예산에 맞춰 검증 수위를
> 자동으로 낮추며 버티고, 그 사실을 정직하게 알리는 거버너입니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 비용 거버너 — 일일 예산과 3단 운전 모드 ══
type Mode = "정상" | "절약" | "생존";
class Governor {
  spent = 0;
  constructor(public dailyBudget: number) {}
  get mode(): Mode {
    const r = this.spent / this.dailyBudget;
    return r < 0.6 ? "정상" : r < 0.9 ? "절약" : "생존";
  }
  charge(cost: number): boolean {
    if (this.spent + cost > this.dailyBudget) return false;  // 초과 — 호출자가 경로 변경 (C4 고급2의 철학)
    this.spent += cost;
    return true;
  }
  // 모드가 검증 수위를 결정한다 — 우아한 저하의 핵심
  verifierCount(): number { return this.mode === "정상" ? 3 : this.mode === "절약" ? 1 : 0; }
}

// 리뷰 1건 (mock 비용 모델: 파인더 3 + 검증관 n×발견)
type DayResult = { reviewed: number; skipped: number; degraded: number };
function simulateDay(prs: number, gov: Governor): DayResult {
  const res: DayResult = { reviewed: 0, skipped: 0, degraded: 0 };
  for (let i = 0; i < prs; i++) {
    const findCost = 3;                       // 파인더 팬아웃
    const findings = 1 + (i % 3);             // 발견 1~3건
    const vCount = gov.verifierCount();       // 모드에 따른 검증 수위
    const verifyCost = findings * vCount;
    if (!gov.charge(findCost + verifyCost)) { res.skipped++; continue; }   // 예산 완전 소진 — 대기열로
    res.reviewed++;
    if (vCount < 3) res.degraded++;           // 낮은 수위로 처리됨 — 보고서에 표시!
  }
  return res;
}

// ── 2주차 시뮬레이션: 평소 → 폭증 ──
const week = [10, 12, 60, 58, 45, 20, 11];   // 수요일부터 릴리즈 폭증
console.log("📅 2주차 운영 일지 (일일 예산 150):");
for (const [d, prs] of week.entries()) {
  const gov = new Governor(150);              // 매일 리셋
  const r = simulateDay(prs, gov);
  const bar = gov.mode === "정상" ? "🟢" : gov.mode === "절약" ? "🟡" : "🔴";
  console.log(\`Day\${d + 1} PR \${String(prs).padStart(2)}건 → 처리 \${r.reviewed} (저하모드 \${r.degraded}) · 대기 \${r.skipped} · 지출 \${gov.spent}/150 \${bar} \${gov.mode}\`);
}

// ══ 알람 설계 — 행동 가능한 것만, 2단으로 (A6 알람 피로 + B6 원칙의 코드화) ══
type Alarm = { level: "notice" | "act"; msg: string };
function alarmsOf(gov: Governor, r: DayResult): Alarm[] {
  const out: Alarm[] = [];
  // notice: 정보 — 일지에 적재만 (즉시 알림 아님)
  if (r.degraded > 0) out.push({ level: "notice", msg: \`저하 모드 처리 \${r.degraded}건 — 보고서에 '검증 축소' 표시됨\` });
  // act: 지금 행동 — 사람 호출 (행동 문자열 필수!)
  if (r.skipped > 0) out.push({ level: "act", msg: \`대기열 \${r.skipped}건 — 오늘 중 결정 필요: ①내일 예산 선차입 ②수동 검토 ③대기 유지\` });
  if (gov.mode === "생존") out.push({ level: "act", msg: \`생존 모드 도달 — 폭증이 계속되면 일일 예산 자체를 재협상하라 (장부 B7)\` });
  return out;
}
const lastGov = new Governor(150); const lastDay = simulateDay(60, lastGov);
console.log("\\n🔔 알람 (폭증일):");
for (const a of alarmsOf(lastGov, lastDay)) console.log(\`  [\${a.level}] \${a.msg}\`);
console.log("\\n👉 폭증일에도 시스템은 죽지 않았다 — 수위를 낮추고, 낮췄다고 정직하게 표시하고, 사람에게는 '결정할 것'만 올렸다.");`,
      hints: [
        "verifierCount()가 모드에 따라 3→1→0으로 줄어드는 것이 '우아한 저하'의 심장 — 검증 3인(고급2 C8)은 평시의 사치이고, 폭증일엔 1인 검증이 무검증보다 낫습니다. 단, 저하 처리분은 보고서에 반드시 표시(정직).",
        "알람의 act 레벨에 '결정 선택지'까지 담은 것 — B6 첫 행동 카드의 원칙(판단은 미리)이 알람 문구에도 적용돼요. '대기열 있음'만 알리면 새벽의 운영자는 다시 백지 앞에 섭니다.",
        "매일 예산 리셋 — 어제의 폭증이 오늘을 굶기지 않게. 반대로 '예산 선차입'은 사람의 결정 사항으로 남겨둡니다(자동화하면 상한의 의미가 사라져요).",
      ],
    },
    {
      type: "markdown",
      source: `## 🛡 저하 모드의 윤리 — 정직한 축소

성능 저하 모드에서 가장 중요한 건 기술이 아니라 **정직**입니다:
- 검증 1인으로 처리한 리뷰에는 보고서에 **"⚠️ 축소 검증"** 라벨 — 받는 사람이 신뢰 수준을 알게
- 대기열로 넘어간 PR은 **침묵 금지** — "오늘 미처리 12건, 내일 오전 처리 예정" 공지
- 이 정직함이 곧 A4의 교훈: **신뢰는 사고가 아니라 대응에서 갈립니다.** 축소를 숨긴 시스템은
  들키는 순간 전체 신뢰를 잃어요.

## 🔬 연구 노트 — C8

1. **모드 문턱 튜닝**: 0.6/0.9 문턱을 조정해 '저하 처리 비율 vs 대기열 크기'의 균형점을 찾아라 — 문턱이 곧 서비스 정책이다.
2. **우선순위 대기열**: skipped를 그냥 버리지 말고 severity 추정치 순으로 정렬해 '내일 예산의 첫 손님'이 되게 하라 — 고급2 C9 연구 노트('아픈 곳부터')의 재등장.
3. **거버너의 계기판 합류**: mode 변화 이력을 run 레코드에 남겨 텔레메트리(C2)가 '이번 주 저하 모드 시간 비율'을 집계하게 하라 — 저하가 일상이 되면 그건 저하가 아니라 예산 부족이다.

> 🎯 **(전부 잊어도 이것만)**
> ## 폭증의 답은 정지가 아니라 **우아한 저하** — 예산 잔량이 검증 수위(3→1→0)를 정하고, 축소는 보고서에 정직하게 표시하며, 대기열은 침묵하지 않는다.
> 알람은 2단 — notice(적재)와 act(결정 선택지 포함). 그리고 저하가 일상이 되면 그건 예산 재협상의 신호다.

📎 **다음 강 — C9. 실전 ③ 사고의 날**: 3주차, 드디어 올 것이 옵니다 — 모델 제공사의 조용한 업데이트로 오탐률이 급증. 경보→분류→재현→임시조치→포스트모템→박제, 사고 대응의 전 과정을 코드로 완주합니다.`,
    },
  ],

  quiz: {
    title: "고급3·C8강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "PR 폭증일에 시스템을 끄는 대신 '우아한 저하'를 택하는 이유는?",
        options: [
          "끄는 버튼이 없어서",
          "릴리즈 주간에 리뷰 공백이 더 위험하므로 — 1인 검증이 무검증보다 낫고, 축소를 정직하게 표시하면 신뢰가 유지된다",
          "저하 모드가 요금이 더 싸서",
        ],
        correctIndex: 1,
        explanation:
          "정지는 가장 쉬운 대응이지만 가장 비싼 공백을 만들어요. 수위를 낮추며 버티되 '축소 검증' 라벨로 정직하게 — 신뢰는 대응에서 갈립니다.",
      },
      {
        type: "multiple-choice",
        question: "act 레벨 알람에 '결정 선택지(①선차입 ②수동 ③대기)'까지 담는 이유는?",
        options: [
          "알람을 길게 만들어 중요해 보이게",
          "판단은 미리, 실행만 당일에(B6) — 선택지 없는 알람은 새벽의 운영자를 백지 앞에 세운다",
          "선택지가 3개면 알람이 무료라서",
        ],
        correctIndex: 1,
        explanation:
          "행동 가능한 알람의 완성형은 '무슨 일'+'무엇을 고를지'예요. 첫 행동 카드의 원칙이 알람 문구에도 적용됩니다.",
      },
      {
        type: "multiple-choice",
        question: "'저하 모드 시간 비율'을 계기판에 올려야 하는 이유는?",
        options: [
          "저하 모드가 부끄러워서 숨기려고",
          "저하가 일상이 되면 그건 저하가 아니라 만성 예산 부족 — 장부(B7)에서 예산 자체를 재협상할 신호이기 때문",
          "이모지를 하나 더 쓰고 싶어서",
        ],
        correctIndex: 1,
        explanation:
          "비상 수단이 상시 가동되면 설계가 틀린 거예요. 저하 비율의 추이가 '예산 증액 vs 시스템 축소' 결정의 근거가 됩니다.",
      },
    ],
  } satisfies Quiz,
};
