import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급3 시리즈C(운영 만들기) 03강 — 평가 러너.
 * 골든 자동 채점(결정적) + LLM 판정자(루브릭·편향 대응) + N회 평균.
 */
export const lessonC03: Lesson = {
  id: "ai-eng-a3-c03-eval-runner",
  language: "ai-engineering",
  track: "advanced3",
  order: 23,
  title: "C3. 평가 러너 — LLM 판정자와 골든 세트의 자동화",
  subtitle: "판정자도 검증 대상이다 — 루브릭, 편향, 그리고 N회 평균",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🎛 고급3·C3강. 평가 러너
### — LLM 판정자와 골든 세트의 자동화

⏱️ 50분 · 🧰 API 키 · 🗺️ 운영 루프: **② 평가의 코드화** · 선수: C1·C2

> 💡 run 레코드의 quality 칸을 채울 차례입니다. 채점에는 두 종류가 있어요:
> **정답이 있는 것**(골든 세트의 심은 결함 — 코드로 채점)과
> **정답이 없는 것**(브리핑의 '좋음' — 사람이 하거나… **LLM에게 시킵니다**).
> LLM 판정자는 강력하지만 위험한 도구예요 — **판정자도 편향이 있고, 판정자도
> 검증 대상**이라는 걸 아는 사람만 안전하게 씁니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 1. 정답 있는 채점 — 결정적 (LLM 불필요, 고급2 C9의 재사용) ══
type Golden = { name: string; input: string; planted: string[] };  // 정답지
function gradeExact(found: string[], planted: string[]) {
  const hit = planted.filter((p) => found.includes(p)).length;
  return { recall: planted.length ? hit / planted.length : 1, falsePos: found.filter((f) => !planted.includes(f)).length };
}

// ══ 2. 정답 없는 채점 — LLM 판정자 ══
// 핵심은 판정자 프롬프트의 3요소: 루브릭(기준) · 척도 고정 · 근거 강제
async function llmJudge(output: string, rubric: string): Promise<{ score: number; reason: string }> {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: \`너는 채점 전담 판정자다.
루브릭: \${rubric}
규칙: ① 루브릭 항목별로만 판단 ② 점수는 1~10 정수 ③ 근거 없이 점수 금지 ④ 관대함 금지 — 7점은 '흠잡을 데 없음'에만.
JSON만 출력: {"score": n, "reason": "항목별 근거 1줄씩"}\` },
      { role: "user", content: \`채점 대상:\\n\${output}\` },
    ],
  });
  try { return JSON.parse((res.text ?? "").replace(/\`\`\`json|\`\`\`/g, "").trim()); }
  catch { return { score: -1, reason: "판정 형식 실패" }; }  // -1 = 무효표 (평균에서 제외)
}

const RUBRIC = "브리핑 채점: [정확성] 출처 있는 사실만인가 [완전성] 빠진 범위가 명시됐나 [간결성] 5줄 이내 핵심만인가";

// ══ 3. 판정 편향 대응 — 같은 산출물을 N회 채점해 평균 (비결정성 흡수) ══
async function judgeN(output: string, n = 3): Promise<number> {
  const scores: number[] = [];
  for (let i = 0; i < n; i++) {
    const j = await llmJudge(output, RUBRIC);
    if (j.score > 0) scores.push(j.score);
  }
  return scores.length ? +(scores.reduce((a, b) => a + b) / scores.length).toFixed(1) : -1;
}

// ── 시운전: 좋은 산출물 vs 나쁜 산출물 — 판정자가 구분하는가 ──
const goodOut = "1. 반도체 수출 12% 증가 (출처: 산업부 7월 통계) 2. 규제 초안 발표 (출처: 관보) — 미조사: 해외 반응";
const badOut = "업계가 전반적으로 좋아지고 있는 분위기다. 다들 기대하는 눈치. 앞으로도 성장할 것으로 보인다.";

const [goodScore, badScore] = [await judgeN(goodOut), await judgeN(badOut)];
console.log(\`✅ 좋은 산출물: \${goodScore}점 / ❌ 나쁜 산출물: \${badScore}점\`);
console.log(goodScore > badScore ? "👉 판정자가 품질 차이를 구분한다 — 채점 자동화 가능" : "⚠️ 구분 실패 — 루브릭을 다듬어라");

// ══ 4. 판정자의 골든 케이스 — 판정자도 검증 대상! ══
// '정답 점수대'를 아는 산출물 쌍으로 판정자 자체를 시험한다
const JUDGE_GOLDEN = [
  { out: goodOut, expect: "high" },   // 8점 이상이어야 정상
  { out: badOut, expect: "low" },     // 4점 이하여야 정상
];
let judgeOk = 0;
for (const g of JUDGE_GOLDEN) {
  const s = await judgeN(g.out, 2);
  const pass = g.expect === "high" ? s >= 7 : s <= 5;
  console.log(\`\${pass ? "✅" : "❌"} 판정자 검증 [\${g.expect}] → \${s}점\`);
  if (pass) judgeOk++;
}
console.log(\`\\n🧑‍⚖️ 판정자 신뢰도: \${judgeOk}/\${JUDGE_GOLDEN.length} — 이 검증을 통과한 판정자만 운영에 투입한다.\`);`,
      hints: [
        "루브릭의 '7점은 흠잡을 데 없음에만'이 관대화 편향 대응이에요 — LLM 판정자는 기본적으로 후합니다. 척도의 위쪽을 좁혀야 분별력이 생겨요.",
        "형식 실패를 -1(무효표)로 처리하고 평균에서 제외 — 0점 처리하면 형식 실패가 품질 급락으로 위장합니다. 실패와 낙제는 다른 것.",
        "JUDGE_GOLDEN(판정자의 골든 케이스)이 오늘의 진짜 교훈 — '누가 감시자를 감시하나'의 답은 '정답 점수대를 아는 시험 쌍'입니다. 루브릭을 고칠 때마다 이것부터 재실행하세요.",
      ],
    },
    {
      type: "markdown",
      source: `## ⚖️ LLM 판정자의 3대 편향 — 알고 쓰면 도구, 모르면 흉기

| 편향 | 증상 | 대응 |
|------|------|------|
| **관대화** | 웬만하면 7~8점 | 척도 위쪽 좁히기('7점은 완벽에만') + 나쁜 견본을 루브릭에 예시로 |
| **위치·순서** | 비교 채점 시 먼저 본 것 선호 | 비교 대신 **절대 채점**(하나씩) 또는 순서 뒤집어 2회 |
| **자기 선호** | 자기(같은 모델)가 쓴 글에 후함 | 판정자를 **다른 모델**로 (생산자·판정자 분리 — A5 '쓴 사람이 검사하지 않는다'의 모델판!) |

마지막 행에 주목 — 고급2 A5의 검증 원칙이 모델 차원에서 재등장합니다.
생산은 A 모델, 판정은 B 모델. 조직 설계의 원칙은 층을 바꿔도 살아 있어요.

## 🔬 연구 노트 — C3

1. **관대화 측정**: 루브릭에서 '관대함 금지' 줄을 빼고 20개 산출물을 채점해 분포를 그려라. 점수가 위쪽에 뭉치는가? 그 줄 하나의 효과를 숫자로.
2. **판정자 모델 분리**: llmJudge의 provider를 바꿔(groq 등) 같은 산출물을 채점하라. 두 판정자의 점수 상관이 낮은 항목은 루브릭이 모호하다는 신호다.
3. **run 레코드 합류**: judgeN의 결과를 C1 레코드의 quality 칸에 써넣는 evalPipeline()을 완성하라 — C2 텔레메트리의 품질 숫자가 이제 자동으로 흐른다.

> 🎯 **(전부 잊어도 이것만)**
> ## 정답 있는 건 코드로, 없는 건 LLM 판정자로 — 단 **루브릭·척도 고정·근거 강제 + N회 평균**, 그리고 3대 편향(관대화·순서·자기 선호) 대응.
> 판정자도 검증 대상이다 — **판정자의 골든 케이스**를 통과한 판정자만 운영에 투입하라.

📎 **다음 강 — C4. 현장 신호 수집**: 시험 점수는 자동화됐고, 이제 현장 평판(B4의 수정·재요청·무시)을 이벤트로 수집해 골든 점수와의 **불일치를 자동 감지**합니다.`,
    },
  ],

  quiz: {
    title: "고급3·C3강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "LLM 판정자의 형식 실패를 0점이 아니라 무효표(-1, 평균 제외)로 처리하는 이유는?",
        options: [
          "0은 불길한 숫자라서",
          "0점 처리하면 판정자의 형식 실패가 시스템의 품질 급락으로 위장되기 때문 — 실패와 낙제는 다르다",
          "무효표가 계산이 빨라서",
        ],
        correctIndex: 1,
        explanation:
          "판정 실패는 판정자의 문제, 낮은 점수는 산출물의 문제예요. 섞으면 텔레메트리(C2)가 거짓 경보를 냅니다.",
      },
      {
        type: "multiple-choice",
        question: "'자기 선호 편향'의 대응이 고급2 A5와 이어지는 지점은?",
        options: [
          "판정자에게 겸손을 가르친다",
          "생산 모델과 판정 모델을 분리한다 — '쓴 사람이 검사하지 않는다'의 모델 차원 재등장",
          "판정자에게 더 많은 보수를 준다",
        ],
        correctIndex: 1,
        explanation:
          "같은 모델은 자기 스타일의 글에 후해요. 검증 원칙(작성자·검토자 분리)은 층을 바꿔도(사람→에이전트→모델) 살아 있습니다.",
      },
      {
        type: "multiple-choice",
        question: "'판정자의 골든 케이스'(JUDGE_GOLDEN)가 하는 일은?",
        options: [
          "판정자에게 모범 답안을 외우게 한다",
          "정답 점수대를 아는 산출물 쌍으로 판정자 자체를 시험해, 루브릭 변경 때마다 판정자의 분별력을 회귀 검증한다",
          "판정자의 급여를 결정한다",
        ],
        correctIndex: 1,
        explanation:
          "'누가 감시자를 감시하나'의 답이에요. 좋은 것에 높게, 나쁜 것에 낮게 — 이 기본 분별을 통과한 판정자만 운영 투입.",
      },
    ],
  } satisfies Quiz,
};
