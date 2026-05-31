import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson05: Lesson = {
  id: "ai-eng-m2-05-evaluation-observability",
  language: "ai-engineering",
  track: "intermediate2",
  order: 5,
  title: "평가 & 관측 — 느낌이 아니라 숫자로",
  subtitle: "평가셋으로 성공률 측정 · A/B 비교 · faithfulness · 트레이싱",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 📊 평가 & 관측

> 💡 보라색 점선 밑줄 = 전문 용어.

"잘 되는 것 같다" 는 위험합니다. 프롬프트를 바꿨을 때 **정말 좋아졌는지**는 숫자로 봐야 해요.
이 강에서 에이전트/RAG 를 **측정**하는 법을 배웁니다.

### 배울 것
- ==평가셋(eval set)== 으로 **성공률** 측정
- ==A/B 비교== — 두 프롬프트/설정 중 무엇이 나은지
- ==faithfulness== — 답이 근거에 충실한가 (RAG 환각 측정)
- ==관측성== — 트레이싱·로깅으로 "왜 그런 답이 나왔나" 추적`,
    },

    {
      type: "markdown",
      source: `## 🧪 평가셋 — 정답이 있는 테스트 케이스

"질문 → 기대 결과" 쌍을 모아두고, 에이전트를 돌려 **얼마나 맞히는지** 셉니다.

\`\`\`
[{ q: "3×4는?", expect: "12" }, { q: "수도는?", expect: "서울" }, ...]
   → 각 케이스 실행 → 기대와 비교 → 성공률 %
\`\`\`

회귀 방지의 핵심: 프롬프트를 고칠 때마다 이 평가셋을 돌려 **점수가 떨어지지 않았는지** 확인.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 평가셋으로 에이전트 성공률 측정
const calc = {
  name: "calc", description: "사칙연산",
  parameters: { type: "object", properties: { a: { type: "number" }, b: { type: "number" }, op: { type: "string", enum: ["add","sub","mul","div"] } }, required: ["a","b","op"] },
  execute: async ({ a, b, op }: any) => ({ result: ({ add: a+b, sub: a-b, mul: a*b, div: a/b } as any)[op] }),
};

async function agent(q: string): Promise<string> {
  const r = await chatWithTools(
    { provider: "gemini", messages: [
      { role: "system", content: "계산은 calc 도구로만. 최종 답엔 숫자를 명확히 포함." },
      { role: "user", content: q }], tools: [calc], toolChoice: "any" }, {});
  return r.text;
}

// 평가셋 — 질문 + 기대값(정답이 답에 포함되면 통과)
const evalSet = [
  { q: "3 곱하기 4는?", expect: "12" },
  { q: "10 더하기 25는?", expect: "35" },
  { q: "100 나누기 4는?", expect: "25" },
];

let pass = 0;
for (const c of evalSet) {
  const out = await agent(c.q);
  const ok = out.includes(c.expect);
  console.log(\`\${ok ? "✅" : "❌"} \${c.q} → 기대 "\${c.expect}" / 답: \${out.trim().slice(0, 40)}\`);
  if (ok) pass++;
}
console.log(\`\\n📊 성공률: \${pass}/\${evalSet.length} (\${Math.round(pass / evalSet.length * 100)}%)\`);
console.log("👉 프롬프트를 고칠 때마다 이 점수를 돌려 회귀(점수 하락)를 막습니다.");`,
      hints: [
        "여기선 '정답 문자열 포함' 으로 채점 — 간단하지만 효과적. 복잡한 경우 LLM-as-judge 를 씁니다(다음 셀).",
        "평가셋은 작게 시작해 실패 사례가 나올 때마다 추가하면 점점 강해집니다.",
        "성공률을 기록해두면 프롬프트 A→B 변경의 효과를 객관적으로 비교할 수 있어요.",
      ],
    },

    {
      type: "markdown",
      source: `## ⚖️ A/B 비교 & faithfulness

### A/B 비교
두 프롬프트(또는 모델/설정)를 **같은 평가셋**으로 돌려 점수를 비교 → 더 나은 쪽 채택.

### faithfulness (RAG 충실도)
RAG 답이 **주어진 근거로 뒷받침되는가**? 근거에 없는 말을 지어내면(환각) faithfulness ↓.
측정법: 또 다른 LLM 에게 "이 답이 이 근거만으로 정당한가?" 를 판정시킴(==LLM-as-judge==).`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// faithfulness 채점 — LLM-as-judge 로 '근거 충실도' 판정
async function judgeFaithful(context: string, answer: string): Promise<boolean> {
  const V = z.object({ faithful: z.boolean(), reason: z.string() });
  const r = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "주어진 근거만으로 답이 정당한지 판정해. 근거에 없는 주장이 있으면 faithful=false. JSON 으로." },
      { role: "user", content: \`근거:\\n\${context}\\n\\n답변:\\n\${answer}\` },
    ],
    responseSchema: toJsonSchema(V),
  });
  return V.parse(r.json).faithful;
}

const context = "환불은 14일 이내 가능하다. 배송비는 고객 부담이다.";

// A: 근거에 충실한 답 / B: 근거에 없는 내용(환각) 섞은 답
const answerA = "환불은 14일 이내 가능하며 배송비는 고객 부담입니다.";
const answerB = "환불은 14일 이내 가능하고, 무료 사은품도 드립니다.";  // '사은품' 은 근거에 없음

console.log("A(충실) faithful:", await judgeFaithful(context, answerA));
console.log("B(환각) faithful:", await judgeFaithful(context, answerB));
console.log("👉 근거에 없는 '사은품' 을 넣은 B 는 faithful=false 로 잡혀야 합니다.");`,
      hints: [
        "LLM-as-judge: 평가 자체를 LLM 에게 맡기되, responseSchema 로 boolean+이유를 강제해 일관성 확보.",
        "judge 모델은 평가 대상과 분리해 편향을 줄이고, 여러 번 돌려 다수결하면 더 견고합니다.",
        "faithfulness 외에 answer relevance(질문 적합도)·retrieval recall(정답 청크 회수율)도 자주 봅니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🔭 관측성 — 트레이싱

운영 중인 에이전트가 이상한 답을 냈을 때, **무슨 일이 있었는지** 되짚을 수 있어야 합니다.
- \`onStep\` 으로 도구 호출/결과 로그 (중2-01)
- 각 요청에 **trace id** 를 붙여 입력·검색 근거·도구 호출·최종 답을 한 줄로 묶어 저장
- 실무 도구: LangSmith, Langfuse, OpenTelemetry 등

> 평가(사전: 배포 전 점수) + 관측(사후: 운영 중 추적) 이 한 쌍입니다.`,
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 두 프롬프트 A/B 평가

같은 평가셋으로 두 system 프롬프트의 성공률을 비교하세요.
\`runEval(systemPrompt)\` 을 완성하고, A/B 점수를 출력합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const evalSet = [
  { q: "대한민국 수도는?", expect: "서울" },
  { q: "물의 화학식은?", expect: "H2O" },
  { q: "1년은 몇 개월?", expect: "12" },
];

// 🎯 TODO: systemPrompt 로 각 질문에 답하고 expect 포함 여부로 성공률 계산
async function runEval(systemPrompt: string): Promise<number> {
  let pass = 0;
  // TODO: for (const c of evalSet) { chat 호출 → c.expect 포함이면 pass++ }
  return Math.round(pass / evalSet.length * 100);
}

const A = "간결하게 답해.";
const B = "정확한 사실만 핵심 단어로 짧게 답해. 불확실하면 모른다고 해.";
console.log("A 점수:", await runEval(A), "%");
console.log("B 점수:", await runEval(B), "%");
console.log("👉 더 높은 쪽을 채택 — 이게 프롬프트 A/B 평가.");`,
      hints: [
        "const r = await chat({ provider:'gemini', messages:[{role:'system',content:systemPrompt},{role:'user',content:c.q}] });",
        "if (r.text.includes(c.expect)) pass++;",
        "expect 를 'H2O' 처럼 정확 표기로 두면 채점이 명확합니다(대소문자 유의).",
      ],
      solution: `const evalSet = [
  { q: "대한민국 수도는?", expect: "서울" },
  { q: "물의 화학식은?", expect: "H2O" },
  { q: "1년은 몇 개월?", expect: "12" },
];

async function runEval(systemPrompt: string): Promise<number> {
  let pass = 0;
  for (const c of evalSet) {
    const r = await chat({ provider: "gemini", messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: c.q }] });
    if (r.text.includes(c.expect)) pass++;
  }
  return Math.round(pass / evalSet.length * 100);
}

const A = "간결하게 답해.";
const B = "정확한 사실만 핵심 단어로 짧게 답해. 불확실하면 모른다고 해.";
console.log("A 점수:", await runEval(A), "%");
console.log("B 점수:", await runEval(B), "%");`,
    },

    {
      type: "markdown",
      source: `## 🧭 중2-05 정리

- ✅ ==평가셋== 으로 **성공률** 측정 → 프롬프트 변경의 **회귀** 방지
- ✅ ==A/B 비교== — 같은 평가셋으로 두 설정 점수 비교 후 채택
- ✅ ==faithfulness== — ==LLM-as-judge== 로 근거 충실도(환각) 측정
- ✅ ==관측성== — onStep·trace id 로 운영 중 에이전트 추적

### 다음 강 — 중2-06 비용·속도·보안·가드레일
프로덕션 운영의 마지막 조각:
- task 라우팅 · 캐싱 · 키 보안(서버 프록시) · ==프롬프트 인젝션== 방어`,
    },
  ],

  quiz: {
    title: "중2-05 — 평가 & 관측 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "평가셋(eval set)을 두는 가장 큰 이유는?",
        options: [
          "토큰을 아끼려고",
          "프롬프트·모델을 바꿀 때 성공률이 떨어지지 않았는지(회귀) 객관적으로 확인하려고",
          "임베딩을 만들려고",
          "캐시를 비우려고",
        ],
        correctIndex: 1,
        explanation: "'질문→기대값' 쌍으로 성공률을 재면, 변경이 정말 개선인지/회귀인지 숫자로 알 수 있다. 실패 사례를 평가셋에 추가하며 강화한다.",
      },
      {
        type: "multiple-choice",
        question: "RAG 의 faithfulness 를 LLM-as-judge 로 측정한다는 것은?",
        options: [
          "사람이 일일이 읽는다",
          "또 다른 LLM 에게 '이 답이 주어진 근거만으로 정당한가' 를 판정시켜 환각을 잡는다",
          "임베딩 거리로 잰다",
          "토큰 수로 잰다",
        ],
        correctIndex: 1,
        explanation: "judge LLM 에게 근거+답을 주고 faithful 여부를 boolean 으로 강제(responseSchema)하면, 근거에 없는 주장(환각)을 자동으로 잡을 수 있다.",
      },
      {
        type: "multiple-choice",
        question: "평가와 관측의 관계로 가장 적절한 것은?",
        options: [
          "둘은 같은 것이다",
          "평가는 배포 전 점수, 관측은 운영 중 추적 — 사전·사후 한 쌍이다",
          "관측은 불필요하다",
          "평가는 한 번만 하면 된다",
        ],
        correctIndex: 1,
        explanation: "평가(사전)로 품질을 보장하고, 관측(사후: 트레이싱·로깅)으로 운영 중 이상을 되짚는다. 둘이 함께 있어야 신뢰할 수 있는 에이전트가 된다.",
      },
    ],
  } satisfies Quiz,
};
