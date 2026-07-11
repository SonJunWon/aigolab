import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급3 시리즈C(운영 만들기) 10강 — 실전 ④ 운영 센터 완성 + 캡스톤.
 * 운영 30일 아크 4주차: 부품 총조립 → 30일 완주 확인 → 3부작 완결.
 */
export const lessonC10: Lesson = {
  id: "ai-eng-a3-c10-capstone-ops-center",
  language: "ai-engineering",
  track: "advanced3",
  order: 30,
  title: "C10. 🏗 실전 ④ 운영 센터 완성 + 캡스톤",
  subtitle: "운영 30일 완주 — 그리고 3부작 대장정의 끝",
  estimatedMinutes: 60,
  cells: [
    {
      type: "markdown",
      source: `# 🏗 고급3·C10강. 실전 ④ 운영 센터 완성
### — 운영 30일 아크 4주차 · 3부작 완결

⏱️ 60분 · 🧰 API 키 · 🗺️ 전 부품 총조립 · 선수: C1~C9

> 💡 마지막 주입니다. C1~C9의 부품 — 계면·텔레메트리·평가·현장 신호·분류기·게이트·
> 카나리·거버너·사고 대응 — 을 **운영 센터 하나**로 조립하고,
> 30일 시뮬레이션(평시→개선→폭증→사고→회복)을 처음부터 끝까지 통과시킵니다.
> 그리고 캡스톤 — 여러분의 시스템(고급2 캡스톤)에 여러분의 운영 센터를 다는 것으로
> **AI 에이전트 엔지니어링 3부작이 완결**됩니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 운영 센터 — 부품 총조립 (각 부품은 C1~C9의 축약 인터페이스) ══
type RunRecord = { id: string; ts: number; version: string; route: string; ok: boolean; cost: number; quality: number; falsePos: number; findings: number; failure_kind?: string };

class OpsCenter {
  log: RunRecord[] = [];
  version = "v13";
  canaryPct = 0;                                  // C7 라우터 다이얼
  verifyThreshold: 2 | 3 = 2;                     // C9 임시 조치 다이얼
  governor = { dailyBudget: 150, spent: 0 };      // C8
  golden: string[] = ["g1", "g2", "g3"];          // C6 (사고 박제로 자란다)
  ledger: string[] = [];                          // B5 개선 대장

  ingest(rec: RunRecord) { this.log.push(rec); }  // C1 계면 — 센터의 유일한 입력

  // C2 텔레메트리: 주간 판정
  weeklyJudge(week: RunRecord[]): { light: string; actions: string[] } {
    const fp = week.reduce((a, r) => a + r.falsePos, 0) / Math.max(week.reduce((a, r) => a + r.findings, 0), 1);
    const q = week.reduce((a, r) => a + r.quality, 0) / Math.max(week.length, 1);
    const actions: string[] = [];
    if (fp > 0.3) actions.push("오탐 급증 — 사고 절차(C9): 분류→재현→임시 다이얼");
    if (q < 7) actions.push("품질 하락 — 골든 재실행 + 현장 대조(C3·C4)");
    if (this.governor.spent > this.governor.dailyBudget * 6) actions.push("주간 예산 초과 — 거버너 점검(C8)");
    return { light: actions.length ? (fp > 0.3 ? "🔴" : "🟡") : "🟢", actions };
  }

  // C6+C7: 변경의 이중 관문 — 게이트 통과 → 카나리 → 승격
  applyChange(desc: string, gatePass: boolean, canaryGood: boolean): string {
    if (!gatePass) { this.ledger.push(\`기각(게이트): \${desc}\`); return "🚫 게이트 차단"; }
    this.canaryPct = 20;
    if (!canaryGood) { this.canaryPct = 0; this.ledger.push(\`롤백(카나리): \${desc}\`); return "↩️ 카나리 롤백"; }
    this.canaryPct = 0;
    this.version = "v" + (parseInt(this.version.slice(1)) + 1);
    this.ledger.push(\`승격: \${desc} → \${this.version}\`);
    return \`✅ 승격 → \${this.version}\`;
  }

  // C9: 사고 절차
  incident(kind: string, fix: string, plantedCase: string): string {
    this.verifyThreshold = 3;                     // 임시 다이얼 (만료일은 대장에!)
    this.golden.push(plantedCase);                // 박제 — 시험이 자란다
    this.ledger.push(\`사고(\${kind}) → 임시: 문턱 3/3(만료 2주) / 방지책: \${fix} — 게이트 거쳐 반영 예정\`);
    return \`🚑 대응 완료 — 골든 \${this.golden.length}건으로 성장\`;
  }
}

// ── 30일 완주 리포트 (1~3주는 C7~C9에서 완료 — 여기선 전체 궤적 요약) ──
const center = new OpsCenter();
console.log("📅 운영 30일 완주 리포트");
console.log("W1 (평시+개선):", center.applyChange("검증관 시나리오 필수화", true, true));
console.log("W2 (폭증):      🟡 저하 모드 3일 — 대기열 정직 공지, 예산 재협상 안건 등록");
console.log("W3 (사고):     ", center.incident("모델 드리프트·오탐 급증", "주간 골든 자동 실행(감지 3일→1일)", "g-incident-day15"));
console.log("W4 (회복+정리):", center.applyChange("주간 골든 자동 실행 추가", true, true));
console.log("\\n📒 개선 대장:"); center.ledger.forEach((l, i) => console.log(\`  \${i + 1}. \${l}\`));
console.log(\`\\n🏁 최종 상태: \${center.version} · 골든 \${center.golden.length}건 · 문턱 \${center.verifyThreshold}/3(만료 예정)\`);
console.log("\\n👉 30일 동안 시스템은 두 번 성장했고(승격 2), 한 번 아팠고(사고 1), 시험은 3→4건으로 자랐다.");
console.log("   숫자로 남은 한 달 — 이것이 '기르는 것'의 실체다.");`,
      hints: [
        "OpsCenter의 입력이 ingest(rec) 하나뿐인 것 — C1 계면 원칙이 총조립에서도 지켜집니다. 대상 시스템이 코드리뷰 회사든 뉴스룸이든 이 센터는 그대로예요.",
        "applyChange의 이중 관문(게이트→카나리) — C6은 실험실, C7은 현장. 두 관문을 명시적 절차로 굳히면 '금요일 오후의 즉흥 반영'이 구조적으로 불가능해집니다.",
        "incident가 golden.push를 포함하는 것 — 사고마다 시험이 자라는 순환(A4 박제)이 메서드 한 줄에 박제됐어요. 30일 뒤 골든이 3→4건이 된 것이 이 시스템의 '면역 기록'입니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 🎓 캡스톤 — 여러분의 운영 센터

> **캡스톤 요구사항** (고급2 캡스톤 시스템에 운영 계층을 단다)
> 1. **계면**: 여러분 시스템의 run 레코드 정의 (version 필수! — C1)
> 2. **관측·평가**: 텔레메트리 3숫자 + 평가 러너(판정자 골든 포함 — C2·C3)
> 3. **개선 관문**: 회귀 게이트 + 카나리 라우터 (이중 관문 — C6·C7)
> 4. **통제**: 거버너(우아한 저하 + 정직 라벨)와 2단 알람 (C8)
> 5. **사고 리허설**: 드리프트 1건을 주입해 감지→대응→박제 완주 (C9)
> 6. **30일 계획**: B8 플레이북과 연결 — 코드(센터)와 문서(플레이북)가 한 쌍

## 🏁 3부작 대장정의 끝 — 전체 지도

> | | 고급1 하네스 | 고급2 멀티에이전트 | 고급3 평가·운영 |
> |------|-------------|-------------------|----------------|
> | 준 것 | 에이전트에게 **몸** | 에이전트들에게 **조직** | 조직에게 **삶** |
> | 지도 | 5대 기관 | 5대 설계 축 | 운영 루프 5국면 |
> | 척추 | 같은 뇌, 다른 몸 | 마차단이 도시를 옮긴다 | 계속 달리게 하는 기술 |
> | 균형 | 멈출 줄 아는 것이 먼저 | 멀티는 답이 아니라 비용 | 측정 없는 개선은 감상 |
>
> 그리고 하나의 원 — 에이전트의 루프(생각→행동→관찰)로 시작한 여정이
> 운영의 루프(관측→평가→진단→개선)로 닫힙니다. **같은 박동, 계속 커지는 몸.**
> 만들고, 조직하고, 기르는 사람 — 그것이 AI 에이전트 엔지니어입니다.

## 🔭 남은 지평선 (연구 과제)
- **자가 운영**: 운영 센터의 판단(문턱·예산·승격)을 에이전트에게 맡긴다면? — 운영 루프를 에이전트가 도는 재귀. 어디까지 맡기고 어디서 사람이 남나 (5대 기관의 가드레일이 답의 힌트)
- **멀티 시스템 운영**: 시스템 10개의 운영 센터들을 묶는 '운영의 운영' — 조직 설계(고급2)가 운영 계층에 재적용된다
- **조직 차원 거버넌스**: 팀·회사 규모의 AI 운영 정책 — 기술을 넘어 제도의 영역으로`,
    },
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 운영 센터 = 계면 하나(ingest)로 들어와 **관측→평가→진단→개선→통제**가 맞물려 도는 기계. 변경은 이중 관문(게이트→카나리), 사고는 시험을 기른다(박제).
> 30일이 숫자로 남으면 — 승격 2, 사고 1, 골든 3→4 — 그것이 '기르는 것'의 실체다.

📎 **고급3 완결 · AI 에이전트 엔지니어링 3부작 대장정 완결.** 🎉
축하합니다. 하네스로 몸을 만들고, 멀티에이전트로 조직을 짓고, 평가·운영으로 살아있게 만드는 —
72강의 여정을 완주하셨습니다. 이제 여러분의 시스템을 만들고, 조직하고, 기르세요.

👇 아래 **퀴즈 시작**을 눌러 마지막 배움을 확인해보세요.`,
    },
  ],

  quiz: {
    title: "고급3·C10강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "운영 센터의 입력이 ingest(run 레코드) 하나뿐인 설계의 의미는?",
        options: [
          "입력이 적을수록 버그가 적어서",
          "계면 원칙(C1)의 총조립 버전 — 대상 시스템이 무엇이든 같은 운영 센터로 기를 수 있다",
          "레코드가 비싸서 아껴 쓰려고",
        ],
        correctIndex: 1,
        explanation:
          "코드리뷰 회사든 뉴스룸이든 브리핑 팀이든 — 레코드 계약만 지키면 센터는 그대로예요. 고급2 '골격 이식'의 운영판 완성형입니다.",
      },
      {
        type: "multiple-choice",
        question: "변경의 '이중 관문'(게이트→카나리)이 각각 검증하는 것은?",
        options: [
          "게이트는 실험실(골든 세트), 카나리는 현장(실제 트래픽) — 시험과 현장의 이중 성적표(A3)가 절차로 굳은 것",
          "게이트는 문법, 카나리는 맞춤법",
          "둘은 같은 것을 두 번 검사한다",
        ],
        correctIndex: 0,
        explanation:
          "시험은 빠르고 현장은 정직하다(A3) — 두 성적표가 개선 절차의 두 관문이 됐어요. 하나만 통과한 변경은 반영되지 않습니다.",
      },
      {
        type: "multiple-choice",
        question: "3부작을 관통하는 '하나의 원'이란?",
        options: [
          "세 트랙의 로고가 모두 원형이다",
          "에이전트의 루프(생각→행동→관찰)로 시작한 여정이 운영의 루프(관측→평가→진단→개선)로 닫힌다 — 같은 박동, 커지는 몸",
          "수강료가 환불된다는 뜻",
        ],
        correctIndex: 1,
        explanation:
          "고급1 A2의 심장 박동이 고급3에서 시스템 차원으로 재등장했죠. 만들고, 조직하고, 기르는 사람 — AI 에이전트 엔지니어의 완성입니다.",
      },
    ],
  } satisfies Quiz,
};
