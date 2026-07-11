import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급3 시리즈C(운영 만들기) 06강 — 회귀 게이트.
 * 변경→골든 자동 실행→성적 하락 차단. 유의미한 차이의 감각.
 */
export const lessonC06: Lesson = {
  id: "ai-eng-a3-c06-regression-gate",
  language: "ai-engineering",
  track: "advanced3",
  order: 26,
  title: "C6. 회귀 게이트 — 개선의 관문",
  subtitle: "변경은 게이트를 통과해야 반영된다 — 그리고 1회 차이는 차이가 아니다",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🎛 고급3·C6강. 회귀 게이트
### — 개선의 관문

⏱️ 50분 · 🧰 API 키 · 🗺️ 운영 루프: **④ 개선의 코드화** · 선수: C3(평가 러너)

> 💡 B5의 개선 대장 규칙 — '회귀 없이 반영 없음' — 을 코드로 강제합니다.
> 게이트의 구조는 단순해요: 변경안 → 골든 세트 자동 실행(C3 러너) → **하락이면 차단.**
> 어려운 건 마지막 판정입니다: 8.2 vs 8.0은 하락인가, 노이즈인가?
> LLM 시스템은 실행마다 결과가 달라서(비결정성) —
> **1회 차이는 차이가 아닙니다. N회 평균과 변동폭을 함께** 봐야 해요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 회귀 게이트 — 변경안이 통과해야 하는 관문 ══
type Variant = { version: string; systemPrompt: string };  // '변경'의 최소 단위 = 지침
type GoldenCase = { name: string; input: string; kind: "대표" | "경계" };

const GOLDEN: GoldenCase[] = [
  { name: "일반 요약", input: "반도체 수출 12% 증가(산업부). 규제 초안 발표(관보). 신제품 3종 출시(각사 보도자료).", kind: "대표" },
  { name: "출처 혼재", input: "A사 매출 급증(공시). B사 위기설(익명 커뮤니티 글). C사 신공장(보도자료).", kind: "대표" },
  { name: "자료 빈약", input: "이번 주 관련 소식 거의 없음. 소규모 인사 이동 1건.", kind: "경계" },  // 공백 보고를 지키는가
];

// 산출물 채점 (C3 축약판 — 루브릭 고정)
async function score(sys: string, input: string): Promise<number> {
  const out = await chat({ provider: "gemini", messages: [{ role: "system", content: sys }, { role: "user", content: input }] });
  const j = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: '채점: [정확성]출처 있는 사실만 [정직성]자료 없으면 없다고 하는가 [간결성]. 1~10 정수. JSON만: {"score":n}' },
      { role: "user", content: out.text ?? "" },
    ],
  });
  try { return JSON.parse((j.text ?? "").replace(/\`\`\`json|\`\`\`/g, "").trim()).score ?? -1; } catch { return -1; }
}

// N회 평균 + 변동폭 — '1회 차이는 차이가 아니다'의 구현
async function evalVariant(v: Variant, n = 2): Promise<{ mean: number; spread: number; perCase: Record<string, number> }> {
  const perCase: Record<string, number> = {};
  const all: number[] = [];
  for (const g of GOLDEN) {
    const scores: number[] = [];
    for (let i = 0; i < n; i++) { const s = await score(v.systemPrompt, g.input); if (s > 0) scores.push(s); }
    perCase[g.name] = +(scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1)).toFixed(1);
    all.push(...scores);
  }
  const mean = all.reduce((a, b) => a + b, 0) / all.length;
  const spread = Math.max(...all) - Math.min(...all);
  return { mean: +mean.toFixed(2), spread, perCase };
}

// ══ 게이트 판정 — 유의미성 규칙: 하락폭이 변동폭의 절반을 넘어야 '진짜 하락' ══
function gate(base: Awaited<ReturnType<typeof evalVariant>>, cand: Awaited<ReturnType<typeof evalVariant>>): { pass: boolean; reason: string } {
  const noise = Math.max(base.spread, cand.spread) / 2;
  const drop = base.mean - cand.mean;
  // 케이스별 검사 — 평균이 올라도 경계 케이스가 무너지면 차단 (B5 '전부 재실행'의 이유)
  for (const g of GOLDEN) {
    const caseDrop = base.perCase[g.name] - cand.perCase[g.name];
    if (caseDrop > Math.max(noise, 1))
      return { pass: false, reason: \`케이스 '\${g.name}'(\${g.kind}) 하락 \${caseDrop.toFixed(1)} — 평균이 올라도 경계가 무너지면 차단\` };
  }
  if (drop > noise) return { pass: false, reason: \`전체 평균 하락 \${drop.toFixed(2)} > 노이즈 \${noise.toFixed(2)}\` };
  return { pass: true, reason: \`통과 — 평균 \${base.mean} → \${cand.mean} (노이즈 범위 \${noise.toFixed(2)} 고려)\` };
}

// ── 시운전: '더 짧게' 개선안을 게이트에 ──
const baseVariant: Variant = { version: "v12", systemPrompt: "너는 브리핑 작가다. 출처 있는 사실만, 자료가 없으면 '자료 부족'을 명시하고, 5줄 이내로." };
const candidate: Variant = { version: "v13-cand", systemPrompt: "너는 브리핑 작가다. 최대한 짧고 강렬하게 2줄로만 써라." };  // '정직성' 조항이 사라졌다!

console.log("⏳ 기준 버전 평가...");
const b = await evalVariant(baseVariant);
console.log("v12:", JSON.stringify(b));
console.log("⏳ 후보 버전 평가...");
const c = await evalVariant(candidate);
console.log("v13-cand:", JSON.stringify(c));

const verdict = gate(b, c);
console.log(\`\\n\${verdict.pass ? "✅ 게이트 통과 — 카나리로 진행(C7)" : "🚫 게이트 차단"}: \${verdict.reason}\`);
console.log("\\n👉 '짧게'가 경계 케이스(자료 빈약)의 정직성을 무너뜨렸다면 — B5에서 손으로 잡던 그 사고를 코드가 잡은 것.");`,
      hints: [
        "gate()의 유의미성 규칙 — 하락폭을 변동폭(spread)의 절반과 비교. 통계적으로 거칠지만 '1회 차이로 일희일비하지 않는다'는 원칙을 코드에 새긴 것. 실전은 N을 늘리고 표준편차를 쓰세요.",
        "케이스별 검사가 전체 평균보다 먼저인 순서 — 평균은 대표 케이스가 끌어올릴 수 있어요. 경계 케이스의 하락을 평균이 가리는 것(심슨의 역설 축소판)을 막습니다.",
        "후보 지침에서 '자료 부족 명시' 조항이 사라진 것이 심은 함정 — '짧게'라는 목표와 무관해 보이는 정직성이 부서지는, A5에서 배운 바로 그 패턴입니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 🚪 게이트의 자리 — 개선 대장과의 연결

\`\`\`
개선안(근거는 C4·C5에서) → [회귀 게이트: 자동] → 통과 시 카나리(C7) → 승격 → 대장 기록 + version++
                              └ 차단 시: 사유와 함께 반려 — 기각이 아니라 퇴고 요청 (B5)
\`\`\`

게이트가 자동이 되면 달라지는 것: 회귀가 **귀찮지 않아져서** 실제로 돌아갑니다.
손 회귀(B5)의 가장 큰 적은 "이 정도 변경은 그냥…"이라는 유혹이었어요 —
자동 게이트는 유혹 자체를 제거합니다. **규율의 자동화가 규율의 완성**이에요.

## 🔬 연구 노트 — C6

1. **N의 경제학**: n=2/3/5로 게이트를 돌려 판정 안정성(같은 후보에 같은 판정이 나오는가)과 비용을 비교하라 — 골든 세트 크기 × N × 2버전이 게이트 1회 비용이다.
2. **박제 사고 회귀**: B6 포스트모템에서 박제한 사고 케이스를 GOLDEN에 추가하라 — '같은 사고로 두 번 안 당한다'가 게이트에서 자동 보장되는 구조를 확인.
3. **게이트 우회 감사**: version이 대장 없이 바뀐 run 레코드(C1)를 탐지하는 감사 함수를 짜라 — 게이트를 우회한 변경을 잡는 마지막 그물.

> 🎯 **(전부 잊어도 이것만)**
> ## 회귀 게이트 = 변경안 → 골든 자동 평가(N회 평균) → **하락이면 차단.** 판정은 노이즈(변동폭)를 고려하고, 케이스별 검사가 평균보다 먼저 — 평균이 경계의 붕괴를 가리게 하지 마라.
> 규율의 자동화가 규율의 완성 — 게이트가 자동이면 "이 정도는 그냥"이라는 유혹이 사라진다.

📎 **다음 강 — C7. 실전 아크 시작 🏗**: 게이트를 통과한 변경의 다음 관문 — 현장. '코드리뷰 회사 운영 30일' 시뮬레이션의 1주차, 카나리 라우터를 짓습니다.`,
    },
  ],

  quiz: {
    title: "고급3·C6강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "'1회 차이는 차이가 아니다'를 게이트가 구현하는 방법은?",
        options: [
          "차이가 나면 무조건 통과시킨다",
          "N회 평균을 내고, 하락폭이 변동폭(노이즈) 기준을 넘을 때만 '진짜 하락'으로 판정한다",
          "차이를 반올림해서 없앤다",
        ],
        correctIndex: 1,
        explanation:
          "LLM 시스템은 비결정적이라 8.2 vs 8.0은 노이즈일 수 있어요. 평균과 변동폭을 함께 봐야 일희일비하지 않는 게이트가 됩니다.",
      },
      {
        type: "multiple-choice",
        question: "케이스별 검사를 전체 평균 검사보다 먼저 하는 이유는?",
        options: [
          "케이스별이 계산이 빨라서",
          "대표 케이스의 상승이 경계 케이스의 붕괴를 평균으로 가릴 수 있기 때문",
          "평균은 믿을 수 없는 통계라서",
        ],
        correctIndex: 1,
        explanation:
          "'짧게' 개선이 평균을 올리면서 '자료 빈약' 케이스의 정직성을 무너뜨리는 식 — 평균 뒤에 숨은 붕괴를 케이스별 검사가 잡습니다.",
      },
      {
        type: "multiple-choice",
        question: "'규율의 자동화가 규율의 완성'이 뜻하는 것은?",
        options: [
          "자동화하면 규율이 필요 없어진다",
          "손 회귀의 적은 '이 정도는 그냥'이라는 유혹 — 게이트가 자동이면 회귀가 귀찮지 않아 실제로 돌아간다",
          "규율은 기계만 지킬 수 있다",
        ],
        correctIndex: 1,
        explanation:
          "B5의 손 회귀가 안 지켜지는 이유는 게으름이 아니라 마찰이에요. 마찰을 0으로 만드는 것이 자동화의 진짜 가치입니다.",
      },
    ],
  } satisfies Quiz,
};
