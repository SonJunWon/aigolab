import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급1 시리즈C(하네스 만들기) 01강 — 최소 하네스.
 * chat() 원시 호출만으로 에이전트 루프를 직접 구현. chatWithTools 와 비교.
 */
export const lessonC01: Lesson = {
  id: "ai-eng-a1-c01-minimal-harness",
  language: "ai-engineering",
  track: "advanced1",
  order: 21,
  title: "C1. 40줄의 에이전트 — 최소 하네스",
  subtitle: "while 루프 + 도구 호출 분기 = 에이전트의 전부라는 충격",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🔩 고급1·C1강. 40줄의 에이전트 — 최소 하네스
### 시리즈 C "하네스 만들기" 시작

⏱️ 45분 · 🧰 API 키(Gemini/Groq) · 🎓 선수: 시리즈 A 필수, B 권장, 입문 5~6강(Tool Calling)

> 💡 시리즈 C의 목표: **미니 Claude Code를 바닥부터 만든다.** 매 강마다 5대 기관을 하나씩 코드로 구현하고, C10에서 전부 조립합니다.

### 시리즈 C 전체 지도
\`\`\`
C1 최소 하네스(루프)      ← 지금 여기      C6 브레이크(권한·HITL)
C2 도구 설계               C7 분신술(서브에이전트)
C3 지침 아키텍처           C8 살아있는 런타임(중단·재개)
C4 컨텍스트 공학(컴팩션)   C9 평가 하네스(트레이스·회귀)
C5 파일 기반 메모리        C10 캡스톤 — 미니 Claude Code
\`\`\`

### 이 강에서
- \`chatWithTools\`(기성 하네스)를 **쓰지 않고**, 원시 \`chat()\` 호출만으로 ==에이전트 루프== 를 직접 구현
- 종료 조건 설계: 자연 종료 vs 최대 턴
- 마지막에 기성품과 비교 — "하네스가 이 정도로 단순한 거였어?"`,
    },
    {
      type: "markdown",
      source: `## 🔁 루프의 해부도 — 우리가 만들 것

A2에서 비유로 배운 심장 박동을 코드로 옮기면 이게 전부입니다:

\`\`\`
messages = [system, user]
while (턴 < 최대):
  res = chat(messages, tools)        // 🧠 Think
  if (res.toolCalls 없음): return res.text   // ✅ 자연 종료
  for (call of res.toolCalls):
    result = 도구실행(call)           // 🛠️ Act
    messages.push(assistant + tool)  // 👀 Observe (결과를 대화에 되먹임)
\`\`\`

핵심 계약 두 가지:
1. **모델은 글만 쓴다** — \`res.toolCalls\` 는 "이 도구를 이 인자로 불러줘"라는 **요청서**일 뿐. 실행은 우리 코드(하네스)가.
2. **결과는 대화에 되먹인다** — \`role:"assistant"\`(요청서 원본) + \`role:"tool"\`(실행 결과) 메시지를 append. 이게 A2의 '관찰'입니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 최소 하네스: chat() 원시 호출로 에이전트 루프 직접 구현 ──
// 도구 2개: 시계와 계산기 (일부러 단순하게 — 오늘의 주인공은 도구가 아니라 '루프')
const tools = [
  {
    name: "get_time",
    description: "현재 날짜와 시각을 반환.",
    parameters: { type: "object", properties: {} },
    execute: async () => ({ now: new Date().toString() }),
  },
  {
    name: "calculator",
    description: "사칙연산. a, b, op(add/sub/mul/div).",
    parameters: {
      type: "object",
      properties: {
        a: { type: "number" }, b: { type: "number" },
        op: { type: "string", enum: ["add", "sub", "mul", "div"] },
      },
      required: ["a", "b", "op"],
    },
    execute: async ({ a, b, op }: any) => {
      const r: Record<string, number> = { add: a + b, sub: a - b, mul: a * b, div: b ? a / b : NaN };
      return { result: r[op] };
    },
  },
];

// ── 여기가 하네스의 심장 — 약 25줄 ──
async function runAgent(userGoal: string, maxTurns = 6) {
  const messages: any[] = [
    { role: "system", content: "너는 도구를 활용해 일을 끝내는 에이전트다. 계산은 반드시 calculator로." },
    { role: "user", content: userGoal },
  ];
  for (let turn = 1; turn <= maxTurns; turn++) {
    const res = await chat({ provider: "gemini", messages, tools });   // 🧠 Think
    if (!res.toolCalls?.length) {
      console.log(\`✅ [turn \${turn}] 자연 종료\`);
      return res.text;                                                  // 도구 요청이 없으면 = 최종 답
    }
    messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      const tool = tools.find((t) => t.name === call.name);
      const result = tool ? await tool.execute(call.args as any) : { error: "unknown tool" }; // 🛠️ Act
      console.log(\`🔧 [turn \${turn}] \${call.name}(\${JSON.stringify(call.args)}) → \${JSON.stringify(result)}\`);
      messages.push({ role: "tool", content: JSON.stringify(result), toolCallId: call.id }); // 👀 Observe
    }
  }
  return "⚠️ 최대 턴 도달 — 여기까지의 진행 상황을 보고해야 한다";
}

const answer = await runAgent("지금이 몇 시인지 알려주고, 올해 남은 개월 수 × 4주를 계산해줘.");
console.log("\\n💬 최종 답:", answer);`,
      hints: [
        "루프 종료의 1차 신호는 res.toolCalls 가 비는 것 — 모델이 '더 부를 도구가 없다'고 판단한 순간이에요.",
        "assistant(요청서) → tool(결과) 순서로 append 해야 제공자가 호출·결과를 매칭합니다 (toolCallId 연결).",
        "maxTurns 는 A2의 '뱅뱅 도는 루프' 방지 안전장치 — 없으면 요금 폭탄의 지름길.",
      ],
    },
    {
      type: "markdown",
      source: `## 🛑 종료 조건 — 루프는 '잘 멈추는 것'이 실력

방금 코드에는 종료 경로가 2개 있었어요. 실전 하네스에는 최소 4개가 필요합니다.

| 종료 경로 | 트리거 | 우리 코드 |
|-----------|--------|-----------|
| ① 자연 종료 | toolCalls 없음 (목표 달성) | ✅ 구현 |
| ② 최대 턴 | maxTurns 도달 | ✅ 구현 (보고 문구만) |
| ③ 사용자 중단 | 사람이 멈춤 | C8에서 |
| ④ 예산 초과 | 토큰/비용 한도 | C4에서 |

> ⚠️ **②의 함정**: 최대 턴에서 그냥 문자열을 던지면 '나쁜 멈춤'(A2)이에요. 실전에서는 마지막으로 chat() 을 한 번 더 불러 **"여기까지 한 일과 막힌 지점을 요약 보고"** 시키는 게 정석입니다. (직접 개선해보세요 — 이번 강의 연구 과제 1번.)

## 🆚 기성품과 비교 — chatWithTools

우리가 만든 runAgent 는 사실 이 플랫폼의 \`chatWithTools\` 와 같은 물건이에요:
\`\`\`ts
const res = await chatWithTools({ provider: "gemini", messages, tools }, { maxIterations: 6 });
\`\`\`
그럼 왜 직접 만들었을까요? **이제부터 매 강마다 이 루프의 내부를 개조할 것이기 때문입니다.** 기성품은 개조가 안 돼요. C2부터 도구 설계, C4에서 루프 안에 컴팩션, C6에서 승인 관문을 심습니다 — 전부 이 25줄 위에.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 연구 실험: 종료 조건이 없으면? maxTurns 를 1로 줄여 '이른 강제 종료'를 관찰 ──
// (무한 루프 대신 반대 극단으로 안전하게 실험)
const messages: any[] = [
  { role: "system", content: "계산은 반드시 calculator 도구로 하는 에이전트다." },
  { role: "user", content: "3 × 12 를 계산한 뒤, 그 결과에서 7을 빼줘." },  // 도구 2회가 필요한 과제
];
const calculator = {
  name: "calculator",
  description: "사칙연산. a, b, op(add/sub/mul/div).",
  parameters: { type: "object", properties: { a: { type: "number" }, b: { type: "number" }, op: { type: "string", enum: ["add","sub","mul","div"] } }, required: ["a","b","op"] },
  execute: async ({ a, b, op }: any) => ({ result: ({ add: a+b, sub: a-b, mul: a*b, div: b ? a/b : NaN } as any)[op] }),
};

const res1 = await chat({ provider: "gemini", messages, tools: [calculator], toolChoice: "any" });
console.log("1턴째 toolCalls:", JSON.stringify(res1.toolCalls));
console.log("→ 여기서 루프를 끊으면(maxTurns=1) 과제는 절반만 수행됨.");
console.log("→ 관찰: 에이전트의 능력은 모델이 아니라 '루프를 몇 바퀴 허용하나'라는 하네스 설정에도 갇힌다.");`,
      hints: [
        "같은 모델·같은 도구인데 maxTurns 하나로 '유능함'이 달라지는 걸 확인하는 실험이에요.",
        "실전 기본값 잡는 법: 대표 과제가 필요로 하는 턴 수 × 2 + 여유 1~2턴.",
      ],
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C1

1. **우아한 강제 종료**: maxTurns 도달 시 chat() 을 한 번 더 불러 진행 상황 보고를 시키도록 runAgent 를 개선하라. 이때 그 마지막 호출에는 tools 를 주지 말아야 하는 이유를 설명하라. (힌트: 종료하려는 순간에 또 요청서가 오면?)
2. **루프 1바퀴의 비용 구조**: res.tokensUsed 를 누적해 턴별 입력 토큰을 출력해보라. 턴이 갈수록 입력이 커지는 이유는? (힌트: messages 는 매 턴 통째로 전송된다 — C4의 예고편)
3. **병렬 도구 호출**: toolCalls 가 한 턴에 2개 이상 오면 순차 실행 중이다. Promise.all 로 바꿔도 안전한 도구와 위험한 도구를 구분하라.

> 🎯 **(전부 잊어도 이것만)**
> ## 에이전트 루프 = **chat() 호출 + toolCalls 분기 + 결과 되먹임 + 종료 조건.** 약 25줄.
> 신비는 없다 — 있는 건 설계 결정들뿐이다(몇 바퀴 허용할지, 어떻게 멈출지). 그리고 이제 이 25줄이 우리의 개조 대상이다.

📎 **다음 강 — C2. 도구는 API가 아니라 UI다**: 루프는 돌지만 도구가 엉성하면 모델이 헛손질합니다. 스키마·description·에러 반환 설계로 '모델이 잘 쓸 수 있는 도구'를 만듭니다.`,
    },
  ],

  quiz: {
    title: "고급1·C1강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "에이전트 루프에서 모델과 하네스의 역할 분담으로 맞는 것은?",
        options: [
          "모델이 도구를 직접 실행하고 하네스는 구경한다",
          "모델은 toolCalls(요청서)만 쓰고, 실행과 결과 되먹임은 하네스 코드가 한다",
          "하네스가 다음 행동을 결정하고 모델은 실행만 한다",
        ],
        correctIndex: 1,
        explanation:
          "모델은 끝까지 글(요청서)만 씁니다. execute 호출, role:'tool' 메시지 append — 손을 움직이는 건 전부 우리가 짠 루프예요.",
      },
      {
        type: "multiple-choice",
        question: "루프의 '자연 종료' 신호는?",
        options: [
          "res.text 가 빈 문자열일 때",
          "res.toolCalls 가 없을 때 — 모델이 더 부를 도구가 없다고 판단한 순간",
          "maxTurns 에 도달했을 때",
        ],
        correctIndex: 1,
        explanation:
          "toolCalls 가 비면 모델이 최종 답을 낸 것 — 목표 달성 종료예요. maxTurns 는 자연 종료가 아니라 안전장치(강제 종료)입니다.",
      },
      {
        type: "multiple-choice",
        question: "도구 실행 결과를 대화에 되먹이는 올바른 방법은?",
        options: [
          "user 메시지로 '결과는 이래'라고 붙인다",
          "assistant(요청서 원본) 다음에 role:'tool' 메시지를 toolCallId 와 함께 append 한다",
          "system 프롬프트를 결과로 교체한다",
        ],
        correctIndex: 1,
        explanation:
          "assistant → tool 순서와 toolCallId 연결이 제공자 규약이에요. 이 되먹임이 루프의 '관찰' 단계입니다.",
      },
    ],
  } satisfies Quiz,
};
