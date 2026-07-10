import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급1 시리즈C(하네스 만들기) 09강 — 평가 하네스.
 * 트레이스 기록, 골든 태스크 자동 채점(LLM 판정자), 회귀 러너.
 */
export const lessonC09: Lesson = {
  id: "ai-eng-a1-c09-eval-harness",
  language: "ai-engineering",
  track: "advanced1",
  order: 29,
  title: "C9. 평가 하네스 — 트레이스에서 회귀까지",
  subtitle: "개선 1건을 숫자로 증명하기 — B7 생활 평가법의 완전 자동화",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 📏 고급1·C9강. 평가 하네스
### — 트레이스에서 회귀까지

⏱️ 50분 · 🧰 API 키 · 🗺️ 구현 대상: 평가(하네스의 6번째 기관) · 선수: C1, C8

> 💡 B7의 선언 — 평가 없는 튜닝은 미신이다. 수동 15분 루틴으로 시작했다면, 오늘은 그걸 **코드로 완전 자동화**합니다.
> 3부작: ① **트레이스**(모든 턴을 기록) ② **골든 태스크 + LLM 채점자**(기준표 자동 채점) ③ **회귀 러너**(지침 A vs B 를 숫자로 대결).
> 마지막 실습에서 실제 개선 1건을 **숫자로 증명**합니다.

### 이 강에서
- C8 이벤트 채널 → JSONL 트레이스로 굳히기
- ==골든 케이스== 채점을 예/아니오 기준표 + 구조화 출력으로 자동화
- ==회귀 평가== 러너: 같은 태스크 × 두 하네스 설정 × N회 반복`,
    },
    {
      type: "markdown",
      source: `## 📼 1부 — 트레이스: 평가의 원재료

C8의 onEvent 가 뿌리던 이벤트를 배열에 쌓으면 그게 트레이스입니다. 한 줄 = 한 사건(JSONL 스타일):

\`\`\`ts
{ ts: "...", type: "tool_call", name: "calculator", args: {...} }
{ ts: "...", type: "tool_result", name: "calculator", ok: true, ms: 812 }
{ ts: "...", type: "final", text: "...", turns: 3, tokensIn: 1420, tokensOut: 96 }
\`\`\`

트레이스가 있으면 채점자가 **결과만이 아니라 과정도** 채점할 수 있어요:
- "계산을 암산하지 않고 도구로 했는가" → tool_call 기록으로 판정
- "3턴 안에 끝냈는가" → turns 로 판정
- "거부됐을 때 우기지 않고 보고했는가" → 이벤트 순서로 판정

> 💡 결과 채점만 하면 '어쩌다 맞은 답'과 '올바른 과정으로 맞은 답'을 구분 못 합니다. 하네스 평가의 절반은 **과정 채점**이에요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 평가 하네스 v1: 트레이스 남기는 에이전트 + LLM 채점자 ──
const calc = {
  name: "calculator", description: "사칙연산. a,b,op(add/sub/mul/div). 계산은 반드시 이 도구로.",
  parameters: { type: "object", properties: { a: { type: "number" }, b: { type: "number" }, op: { type: "string", enum: ["add","sub","mul","div"] } }, required: ["a","b","op"] },
  execute: async ({ a, b, op }: any) => ({ result: ({ add: a+b, sub: a-b, mul: a*b, div: b ? a/b : NaN } as any)[op] }),
};

// 트레이스를 남기며 도는 루프 (C1 + C8 결합)
async function tracedRun(systemPrompt: string, task: string, maxTurns = 5) {
  const trace: any[] = [];
  const messages: any[] = [{ role: "system", content: systemPrompt }, { role: "user", content: task }];
  let turns = 0;
  for (let t = 1; t <= maxTurns; t++) {
    turns = t;
    const res = await chat({ provider: "gemini", messages, tools: [calc] });
    if (!res.toolCalls?.length) {
      trace.push({ type: "final", text: res.text, turns });
      return { text: res.text ?? "", trace, turns };
    }
    messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      trace.push({ type: "tool_call", name: call.name, args: call.args });
      const r = await calc.execute(call.args as any);
      trace.push({ type: "tool_result", ok: true });
      messages.push({ role: "tool", content: JSON.stringify(r), toolCallId: call.id });
    }
  }
  trace.push({ type: "final", text: "(미완)", turns });
  return { text: "(미완)", trace, turns };
}

// LLM 채점자 — 기준표(예/아니오) + 트레이스 + 구조화 출력. B7의 '새 책상에서 채점' 원칙 그대로.
async function judge(task: string, expected: string, output: string, trace: any[]) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "너는 엄격한 채점자다. 각 기준을 증거에 근거해 예/아니오로만 판정하라. 애매하면 아니오." },
      { role: "user", content: \`[과제] \${task}
[정답 기준] \${expected}
[에이전트의 답] \${output}
[행동 트레이스] \${JSON.stringify(trace)}

채점 기준:
1. correct: 최종 답이 정답 기준과 일치하는가
2. usedTool: 계산을 암산이 아니라 calculator 도구로 했는가 (트레이스 확인)
3. efficient: 불필요한 반복 없이 필요한 만큼의 도구 호출만 했는가\` },
    ],
    responseSchema: {
      type: "object",
      properties: {
        correct: { type: "boolean" }, usedTool: { type: "boolean" }, efficient: { type: "boolean" },
        note: { type: "string" },
      },
      required: ["correct", "usedTool", "efficient", "note"],
    },
  });
  return res.json as any;
}

// 시운전: 태스크 1건을 돌리고 채점까지
const { text, trace, turns } = await tracedRun(
  "계산은 반드시 calculator 도구로 하는 에이전트다.",
  "34 × 27 에서 100을 뺀 값은?",
);
console.log(\`답: \${text.slice(0, 60)} (turns: \${turns})\`);
console.log("트레이스:", JSON.stringify(trace.filter((e) => e.type === "tool_call")));
const score = await judge("34×27-100", "818", text, trace);
console.log("채점:", JSON.stringify(score));
console.log("\\n👉 usedTool 판정이 '답'이 아니라 '트레이스'에서 나온 것 — 과정 채점의 순간이다.");`,
      hints: [
        "채점자 시스템 프롬프트의 '애매하면 아니오' — 채점 인플레를 막는 보수적 기본값이에요.",
        "채점자에게 트레이스를 주는 것이 이 강의 핵심 — 결과 채점만으론 '어쩌다 맞음'을 못 걸러냅니다.",
        "채점자는 답을 만든 대화와 무관한 새 chat() 호출 — B7 '새 책상 채점' 원칙의 구현.",
      ],
    },
    {
      type: "markdown",
      source: `## ⚔️ 2부 — 회귀 러너: 지침 A vs B 의 대결

이제 부품이 다 있으니 조립합니다. 회귀 러너의 구조:

\`\`\`
for (설정 of [A안, B안]):
  for (태스크 of 골든_태스크들):
    for (i of 반복 N회):            ← LLM은 확률적 — 1회 비교는 소음
      결과 = tracedRun(설정, 태스크)
      점수 = judge(...)
  집계표 출력 (설정 × 태스크 × 기준별 통과율)
\`\`\`

반복 N회가 왜 필수인가 — 1회씩 비교하면 동전 던지기 두 번으로 동전의 우열을 가리는 격입니다. 실습에선 N=3, 실전에선 N=5~10.

> ⚠️ **채점자도 하네스다**: 채점자의 기준표가 모호하면 평가 전체가 미신으로 돌아갑니다(B7). 채점자 자신도 골든 케이스로 검증하세요 — '명백한 정답 5개, 명백한 오답 5개'를 채점시켜 채점자의 정확도부터 확인하는 것. 이걸 하지 않은 자동 평가는 **자동화된 미신**입니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 회귀 러너: '지침 개선 1건'을 숫자로 증명한다 ──
// 대결: 느슨한 지침(A) vs 도구 강제 + 검산 지침(B) — B2 3원칙 개선이 진짜 효과가 있나?
const promptA = "너는 계산을 도와주는 에이전트다.";
const promptB = "계산은 반드시 calculator 도구로 하라. 암산 금지. 최종 답 전에 도구 결과와 질문을 대조해 검산하라.";

const goldenTasks = [
  { task: "34 × 27 에서 100을 뺀 값은?", expected: "818" },
  { task: "1250을 8로 나눈 뒤 3을 곱하면?", expected: "468.75" },
  { task: "오늘 회의는 몇 시야?", expected: "모른다고 답해야 함 — 계산 문제가 아니며 정보가 없음" },  // 경계 케이스(B7)!
];

const N = 3;   // 반복 횟수 — 실전은 5~10
const results: any[] = [];
for (const [label, sys] of [["A", promptA], ["B", promptB]] as const) {
  for (const g of goldenTasks) {
    let pass = { correct: 0, usedTool: 0, efficient: 0 };
    for (let i = 0; i < N; i++) {
      const { text, trace } = await tracedRun(sys, g.task);
      const s = await judge(g.task, g.expected, text, trace);
      if (s.correct) pass.correct++;
      if (s.usedTool) pass.usedTool++;
      if (s.efficient) pass.efficient++;
    }
    results.push({ 설정: label, 태스크: g.task.slice(0, 18), ...pass });
  }
}

console.log(\`\\n📊 회귀 결과 (각 항목 = N=\${N}회 중 통과 횟수)\`);
console.table(results);
const total = (label: string, key: string) =>
  results.filter((r) => r.설정 === label).reduce((s, r) => s + r[key], 0);
console.log(\`\\n합계 — correct: A=\${total("A","correct")} vs B=\${total("B","correct")} | usedTool: A=\${total("A","usedTool")} vs B=\${total("B","usedTool")}\`);
console.log("\\n👉 읽는 법: B가 usedTool 에서 이기면 '도구 강제' 지침이 일한 것.");
console.log("   경계 케이스(회의 시간)에서 A/B 모두 '모른다'를 유지하는지도 봐야 한다 — 개선이 다른 걸 망치지 않았는가(회귀!).");
console.log("   이 표가 곧 B7 채점표의 자동화 — 이제 지침을 바꿀 때마다 이 셀 하나만 다시 돌리면 된다.");`,
      hints: [
        "경계 케이스(계산 문제가 아닌 질문)를 꼭 포함 — '도구 강제' 지침이 과하면 아무 데나 계산기를 두드리는 부작용이 생길 수 있어요. 그걸 잡는 게 회귀.",
        "console.table 집계가 B7의 손 채점표와 같은 모양인 것은 우연이 아닙니다 — 같은 방법론의 자동화니까.",
        "비용 절감 팁: 회귀는 지침이 바뀐 부분과 관련된 태스크부터 — 전체 재실행은 릴리즈 전에만.",
      ],
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C9

1. **채점자 검증**: 명백한 정답/오답 각 5건으로 judge() 자체의 정확도를 측정하라. '애매하면 아니오' 지침을 빼면 채점 인플레가 실제로 생기는가?
2. **과정 지표 확장**: 트레이스에 tokensUsed·latency 를 넣고 '품질은 같은데 더 싸고 빠른 설정'을 찾는 다목적 비교로 확장하라 — 실전 하네스 튜닝의 실제 모습.
3. **인젝션 회귀**: C3의 오염된 페이지 실험을 골든 태스크로 편입해 '인젝션 저항률'을 상시 회귀 항목으로 만들어라 — 보안도 숫자로 관리된다.

> 🎯 **(전부 잊어도 이것만)**
> ## 평가 하네스 = **트레이스(과정 기록) + 기준표 채점자(새 책상·구조화 출력·애매하면 아니오) + 회귀 러너(A/B × N회).**
> 결과만 채점하면 '어쩌다 맞음'에 속는다 — 과정을 채점하라. 그리고 채점자 자신부터 골든 케이스로 검증하라. 검증 안 된 자동 평가는 자동화된 미신이다.

📎 **다음 강 — C10. 캡스톤**: 부품이 전부 모였습니다. C1 루프 위에 C2~C9를 조립해 **나만의 미니 Claude Code** 를 완성하고, 고급2(멀티에이전트)로 가는 연구 과제를 받습니다.`,
    },
  ],

  quiz: {
    title: "고급1·C9강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "채점자에게 최종 답뿐 아니라 트레이스를 주는 이유는?",
        options: [
          "채점자가 심심하지 않게",
          "'어쩌다 맞은 답'과 '올바른 과정으로 맞은 답'을 구분하기 위해 — 과정 채점",
          "트레이스가 없으면 API 가 에러를 내서",
        ],
        correctIndex: 1,
        explanation:
          "'도구를 썼는가', '거부에 정직했는가' 같은 하네스 품질은 결과 텍스트에 안 보여요. 트레이스가 있어야 과정을 채점할 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question: "회귀 러너에서 각 설정을 N회 반복 실행하는 이유는?",
        options: [
          "API 무료 크레딧을 소진하려고",
          "LLM 출력은 확률적이라 1회 비교는 소음 — 반복 통과율로 비교해야 우열이 신뢰할 만하다",
          "반복할수록 모델이 학습돼 좋아지므로",
        ],
        correctIndex: 1,
        explanation:
          "1회씩 비교는 동전 두 번 던져 동전의 우열을 가리는 격이에요. N회 통과율(실전 5~10회)이 최소한의 통계적 예의입니다.",
      },
      {
        type: "multiple-choice",
        question: "'자동화된 미신'을 피하기 위해 해야 할 일은?",
        options: [
          "채점자 자신을 명백한 정답/오답 골든 케이스로 먼저 검증한다",
          "채점 점수가 높게 나오는 기준표로 바꾼다",
          "평가를 아예 안 하면 미신도 없다",
        ],
        correctIndex: 0,
        explanation:
          "채점자도 하네스예요. 기준표가 모호하거나 채점자가 관대하면 자동화가 미신을 대량생산합니다 — 채점자 정확도부터 측정하세요.",
      },
    ],
  } satisfies Quiz,
};
