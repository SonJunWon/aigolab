import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 09강 — 실전 ③ 강화.
 * 골든 PR 평가(재현율·오탐율) + 예산 제한기(우아한 중단) + 최소 권한 안전.
 */
export const lessonC09: Lesson = {
  id: "ai-eng-a2-c09-eval-budget-safety",
  language: "ai-engineering",
  track: "advanced2",
  order: 29,
  title: "C9. 🏗 실전 ③ 강화 — 평가·예산·안전",
  subtitle: "돌아가는 시스템에서 믿을 수 있는 시스템으로 — 출고 조건 3종",
  estimatedMinutes: 55,
  cells: [
    {
      type: "markdown",
      source: `# 🏗 고급2·C9강. 실전 ③ 강화
### — 평가·예산·안전

⏱️ 55분 · 🧰 API 키 · 🗺️ ⑤ 신뢰 축의 완성 · 선수: C8

> 💡 C8의 v1은 돌아가지만, 세 질문에 답하지 못하면 출고할 수 없어요.
> **"얼마나 잘 잡나?"** (평가 — 실행마다 다른데 무엇이 진짜 성능인가)
> **"최악의 경우 얼마가 나가나?"** (예산 — PR이 거대하면 검증 비용이 폭발한다)
> **"이 조직이 사고 칠 수 있는 최악은?"** (안전 — 리뷰 시스템이 코드를 고치면 안 된다)
> 오늘 세 가드를 달아 **출고 가능한 v2**를 만듭니다. B7의 성적표, C4의 예산 가드,
> C2의 화이트리스트가 실전 시스템 위에서 완성되는 강입니다.

### 이 강에서
- 골든 PR 5건 — 심은 결함 목록으로 재현율·오탐율 측정 + 회귀
- 예산 제한기 — 소진 시 '우아한 중단'(부분 결과 반환)
- 최소 권한 감사 — 전원 읽기 전용의 증명`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 강화 1. 골든 PR 평가 하네스 — 조직의 성적표 (B7의 코드화) ══

// 골든 PR: 심은 결함의 '정답지'가 붙은 시험 문제 (실전은 5건 이상 — 여기선 구조를 위해 2건)
type GoldenPR = { name: string; code: string; planted: string[] };  // planted = "file:line" 정답 목록
const GOLDEN: GoldenPR[] = [
  {
    name: "빈 배열 나누기",
    code: \`export function avg(ns: number[]) { return ns.reduce((a,b)=>a+b,0) / ns.length; } // stats.ts L1\`,
    planted: ["stats.ts:1"],
  },
  {
    name: "깨끗한 코드 (오탐 함정!)",  // 경계 케이스 — 심은 결함 0개. 여기서 뭔가 '발견'되면 전부 오탐
    code: \`export function clamp(n: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, n)); } // util.ts L1\`,
    planted: [],
  },
];

// reviewCompany(C8)가 반환한 발견 목록을 정답지와 대조
type Score = { recall: number; falsePositives: number };
function grade(found: string[], planted: string[]): Score {
  const hit = planted.filter((p) => found.includes(p)).length;
  return {
    recall: planted.length ? hit / planted.length : 1,             // 심은 것 중 잡은 비율
    falsePositives: found.filter((f) => !planted.includes(f)).length, // 정답지에 없는 발견 수
  };
}

// (데모: C8 시스템의 결과를 mock — 실전에서는 reviewCompany를 직접 호출)
const mockRun = (g: GoldenPR): string[] => (g.planted.length ? g.planted : Math.random() < 0.3 ? ["util.ts:1"] : []);
console.log("📊 골든 PR 성적표:");
for (const g of GOLDEN) {
  const s = grade(mockRun(g), g.planted);
  console.log(\`  [\${g.name}] 재현율 \${(s.recall * 100).toFixed(0)}% · 오탐 \${s.falsePositives}건\`);
}
console.log("👉 설정 변경(문턱·지침·모델) 때마다 이 성적표를 다시 돌린다 — 조직의 회귀 평가.\\n");

// ══ 강화 2. 예산 제한기 — 우아한 중단 (C4 가드의 완성형) ══
class Budget {
  spent = 0;
  constructor(public limit: number) {}
  charge(cost: number): boolean {           // 지출 시도 — 한도 내면 true
    if (this.spent + cost > this.limit) return false;
    this.spent += cost; return true;
  }
}

// 검증 단계에 예산을 끼운다: 소진되면 '중단'이 아니라 '미검증 표시로 부분 반환'
type Finding = { loc: string; claim: string };
async function verifyWithBudget(findings: Finding[], budget: Budget) {
  const confirmed: Finding[] = [], unverified: Finding[] = [];
  for (const f of findings) {
    if (!budget.charge(3)) {                 // 검증단 3인 ≈ 비용 3
      unverified.push(f);                    // 💡 빈손 실패가 아니라 '미검증' 라벨로 반환
      continue;
    }
    confirmed.push(f);                       // (데모 — 실전은 C8 runVerifier 3인)
  }
  return { confirmed, unverified };
}

const many: Finding[] = Array.from({ length: 6 }, (_, i) => ({ loc: \`app.ts:\${i + 1}\`, claim: \`발견 \${i + 1}\` }));
const budget = new Budget(10);               // 검증 3명 × 3발견 = 9까지만 가능
const { confirmed, unverified } = await verifyWithBudget(many, budget);
console.log(\`💰 예산 회계: \${budget.spent}/\${budget.limit} 사용\`);
console.log(\`✅ 검증 완료 \${confirmed.length}건 · ⚠️ 예산 소진으로 미검증 \${unverified.length}건 (보고서에 '미검증' 섹션으로 명시)\`);
console.log("👉 예산 초과의 올바른 반응 = 우아한 중단: 부분 결과 + 정직한 라벨. 침묵 금지(B6)의 완성형.\\n");

// ══ 강화 3. 최소 권한 감사 — 조직이 사고 칠 수 없음을 '증명' ══
const ROLE_TOOLS: Record<string, string[]> = {   // C2 레지스트리의 화이트리스트
  finder: ["read_code"], verifier: ["read_code"], reporter: [],
};
const WRITE_TOOLS = ["write_file", "exec_shell", "send_message"];  // 위험 능력 목록
const violations = Object.entries(ROLE_TOOLS)
  .flatMap(([role, tools]) => tools.filter((t) => WRITE_TOOLS.includes(t)).map((t) => \`\${role}가 \${t} 보유\`));
console.log("🔒 최소 권한 감사:", violations.length ? \`❌ 위반 — \${violations.join(", ")}\` : "✅ 전원 읽기 전용 — 이 조직은 코드를 고치거나 무언가를 보낼 물리적 능력이 없다");`,
      hints: [
        "골든 PR 2번('깨끗한 코드')이 B7 경계 케이스의 코드리뷰 버전이에요 — 결함 0개짜리 PR에서 발견이 나오면 전부 오탐. 오탐율을 재려면 '아무것도 없어야 하는 시험지'가 반드시 필요합니다.",
        "Budget.charge가 boolean을 반환하는 설계: 예외를 던지지 않고 호출자가 경로를 바꾸게(미검증 라벨) 합니다 — C4의 '에러도 지시'와 같은 철학.",
        "최소 권한 감사가 코드 몇 줄인 이유: C2에서 화이트리스트를 '데이터'로 만들어뒀기 때문이에요. 선언적 정의는 감사 가능성이라는 보너스를 줍니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 📈 평가 운용의 실전 감각

> **비결정성과 싸우는 법** — 같은 골든 PR도 실행마다 결과가 다를 수 있어요(C8 관전 포인트 ②).
> 그래서 성적은 1회가 아니라 **N회 평균**으로: 골든 5건 × 3회 = 15실행의 평균 재현율/오탐율이
> 그 설정의 진짜 성적입니다. 1회 성적으로 문턱을 조정하는 건 동전 한 번 던져 확률을 정하는 것.
>
> **문턱 튜닝의 정석 (C8 연구 노트의 답)** — 문턱 1/3·2/3·3/3 각각으로 골든 세트를 돌려
> '재현율-오탐' 곡선을 그립니다. 우리 요구(오탐 억제 1순위)에서는 오탐이 급증하기 직전의
> 가장 낮은 문턱이 정답 — **숫자가 다이얼의 위치를 정해줍니다.**

## 🔒 안전 설계의 마지막 질문

전원 읽기 전용을 증명했지만, 실전 출고 전 한 가지를 더 물어야 합니다:
**"이 시스템의 출력(리뷰 보고서)을 누가 소비하는가?"**
사람이 읽고 판단한다면 — 현재 설계로 충분. 하지만 보고서가 **자동으로** 머지를 막거나
코드를 수정하는 파이프라인에 연결된다면, 그 연결점이 새로운 위험 능력이 됩니다.
읽기 전용 조직도 출력이 실행되는 순간 쓰기 조직이 돼요 — B6의 '발송 권한' 교훈이
시스템 경계에서 다시 등장하는 겁니다. **안전 감사는 조직 내부가 아니라 경계에서 끝납니다.**`,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C9

1. **N회 평균 구현**: 골든 세트를 3회 돌려 평균·표준편차를 내는 evalSuite()를 짜라. 표준편차가 큰 골든 케이스는 무엇을 의미하는가? (힌트: 그 PR이 문턱 경계에 있다 — 가장 정보가 많은 시험 문제다.)
2. **예산 우선순위**: 예산이 부족할 때 어떤 발견부터 검증해야 하나? severity 순 정렬을 verifyWithBudget에 추가하라 — '한정 예산은 아픈 곳부터'(B5 수위 감각)의 코드화.
3. **경계 감사**: 리뷰 보고서를 Slack으로 자동 발송하는 기능을 추가한다고 가정하고, 위험 분석과 안전장치(사람 확인? 발송 내용 제한?)를 설계하라 — B6 사고의 예방 연습.

> 🎯 **(전부 잊어도 이것만)**
> ## 출고 조건 3종 — **골든 세트 성적표**(재현율·오탐율, N회 평균, 깨끗한 시험지 포함) · **예산 제한기**(소진 시 '미검증' 라벨의 우아한 부분 반환) · **최소 권한 감사**(화이트리스트가 데이터라서 가능).
> 안전 감사는 조직 내부가 아니라 **경계**(출력을 누가 소비하나)에서 끝난다.

📎 **다음 강 — C10. 완성 🎓**: 마지막 질문 하나가 남았습니다 — 이 골격, 코드리뷰에만 쓸 수 있나요? 같은 부품으로 '리서치 뉴스룸'을 한 강 안에 조립하며 재사용성을 증명하고, 여러분만의 시스템을 설계하는 캡스톤으로 시리즈를 닫습니다.`,
    },
  ],

  quiz: {
    title: "고급2·C9강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "골든 세트에 '깨끗한 코드'(심은 결함 0개) PR을 반드시 넣는 이유는?",
        options: [
          "시험이 너무 어려우면 안 되니까",
          "오탐율은 '아무것도 발견되지 않아야 하는 시험지'에서만 정확히 측정되기 때문",
          "깨끗한 코드가 채점이 빨라서",
        ],
        correctIndex: 1,
        explanation:
          "결함 있는 PR만으로는 재현율만 보여요. 결함 0개 PR에서 나온 발견은 전부 오탐 — 오탐 억제가 1순위인 이 시스템의 급소를 재는 시험지입니다.",
      },
      {
        type: "multiple-choice",
        question: "예산 소진 시 '우아한 중단'의 구현은?",
        options: [
          "전체 실행을 즉시 throw로 중단하고 빈손으로 반환",
          "검증 못 한 발견을 '미검증' 라벨로 분리해 부분 결과와 함께 정직하게 반환",
          "예산을 몰래 늘려서 계속 진행",
        ],
        correctIndex: 1,
        explanation:
          "빈손 실패보다 부분 성공(C4), 그리고 실패의 침묵 금지(B6) — 미검증 섹션이 있는 보고서는 불완전하지만 정직하고, 그래서 신뢰할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "'안전 감사는 경계에서 끝난다'가 뜻하는 것은?",
        options: [
          "조직 내부가 읽기 전용이어도, 출력이 자동 실행되는 연결점이 있으면 그곳이 새로운 위험 능력이다",
          "국경 검문소에서 감사를 받아야 한다",
          "읽기 전용이면 어디에 연결해도 무조건 안전하다",
        ],
        correctIndex: 0,
        explanation:
          "읽기 전용 조직도 출력이 실행되는 순간 쓰기 조직이 됩니다. 시스템의 위험은 내부 권한과 '출력을 누가 소비하는가'를 함께 봐야 완성돼요.",
      },
    ],
  } satisfies Quiz,
};
