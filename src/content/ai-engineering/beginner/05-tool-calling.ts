import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * Ch05 — Tool Calling (AI 에게 팔 달아주기).
 *
 * 목표:
 *   - LLM 이 외부 함수를 "호출할 의도" 를 돌려주면, 코드가 실제 실행 후 결과를 다시 모델에 주입
 *   - raw 루프를 직접 짜보고, 이후 chatWithTools 헬퍼로 단순화
 *   - 학생이 자기 TypeScript 함수를 tool 로 등록해 자연어 질문에 연결
 *   - Phase 3 Agent 로의 가교
 *
 * 실행: Gemini / Groq 지원. WebLLM 은 미지원 (tools 지정 시 unsupported-env 에러).
 */
export const lesson05: Lesson = {
  id: "ai-eng-05-tool-calling",
  language: "ai-engineering",
  track: "beginner",
  order: 5,
  title: "Tool Calling — AI 에게 팔을 달아주자",
  subtitle: "외부 함수와 LLM 을 연결해 실제 '행동하는 AI' 만들기",
  estimatedMinutes: 45,
  cells: [
    // ─────────────────────────────────────────────
    // 1. 오리엔테이션
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `# 🦾 AI 는 "모른다" 를 인정할 수 있어야 한다

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

지금까지의 LLM 은 **"훈련 시점의 지식"** 만 가지고 있어요.
- "오늘 서울 날씨는?" → 모름 (실시간 정보 없음)
- "357 × 129 는?" → 계산 실수 가능 (LLM 은 계산기가 아님)
- "내 스케줄 확인" → 모름 (개인 데이터 접근 불가)

**==Tool Calling==** 은 이 한계를 정면 돌파합니다.
> **"모델은 생각만 하고, 실제 행동은 코드가 한다."**

### 흐름

1. 학생 코드: "너는 \`getWeather(city)\` 같은 함수를 쓸 수 있어" 라고 LLM 에 알림
2. 사용자: "서울 날씨 알려줘"
3. LLM: "알겠어, \`getWeather({city:'서울'})\` 을 호출해줘" 라는 **의도** 만 반환
4. 학생 코드: 실제 \`getWeather("서울")\` 실행 → 결과 획득
5. 학생 코드: 결과를 **tool 메시지** 로 히스토리에 추가 후 다시 LLM 호출
6. LLM: "서울은 22도, 맑음입니다." 같은 **자연어 답변**

이 루프가 ==에이전트== (Agent) 의 가장 기본 패턴입니다.

### 이 장에서 배울 것
| # | 내용 |
|---|---|
| 1 | Tool 스펙 정의 — name · description · parameters · execute |
| 2 | **raw 루프를 손으로** — 한 번 호출 + 결과 주입 + 재호출 |
| 3 | 2개 tool 혼합 질문 |
| 4 | **chatWithTools** 헬퍼로 루프 자동화 |
| 5 | \`toolChoice\` 로 호출 강도 제어 |
| 6 | 미션: 학생이 자기 tool 정의 + AI 연결 |

> ⚠️ **Groq 또는 Gemini 키 필요** (WebLLM 미지원). 상단 🔑 에서 확인.`,
    },

    // ─────────────────────────────────────────────
    // 2. Tool 정의 구조
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 📐 Tool 한 개의 생김새

각 tool 은 **네 요소** 로 이뤄집니다:

\`\`\`ts
{
  name: "getWeather",                    // 고유 이름 (영문, 함수명 스타일)
  description: "도시 이름으로 현재 날씨 조회",  // 모델이 "언제 부를지" 판단하는 근거
  parameters: {                          // 인자 JSON Schema
    type: "object",
    properties: {
      city: { type: "string", description: "도시 이름 (한국어)" },
    },
    required: ["city"],
  },
  execute: async ({ city }) => {         // 실제 실행 함수
    // ... 여기선 데모용 더미 데이터
    return { city, temp: 22, sky: "맑음" };
  },
}
\`\`\`

### description 이 가장 중요
모델은 함수 이름·파라미터를 **description 의 문장** 에서 해석해요.
- 나쁨: "날씨 함수"
- 좋음: "도시 이름(한국어)을 입력하면 현재 기온(섭씨)과 하늘 상태를 반환"

명확히 적을수록 모델이 엉뚱한 호출을 덜 합니다.

### 모델 응답의 변화

\`chat({ tools: [getWeatherTool] })\` 로 호출하면 응답이 달라집니다:

| 필드 | 의미 |
|---|---|
| \`response.text\` | 모델의 자연어 응답 (tool 호출이 있으면 비거나 짧음) |
| **\`response.toolCalls\`** | 호출하려는 tool 목록 — \`[{name, args, id}]\` |

tool 호출이 없으면 \`toolCalls\` 는 \`undefined\`.`,
    },

    // ─────────────────────────────────────────────
    // 3. Raw 루프 1단계 — 단순 호출
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🔧 raw 루프 1단계 — 호출 의도 받기

먼저 \`getWeather\` 하나만 등록하고, 모델이 **호출 의도** 를 돌려주는 걸 관찰합니다.
이 단계에선 **아직 실행하지 않아요** — 다음 셀에서 실행.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const getWeather = {
  name: "getWeather",
  description: "도시 이름(한국어)을 입력하면 현재 기온(섭씨)과 하늘 상태를 반환한다.",
  parameters: {
    type: "object",
    properties: {
      city: { type: "string", description: "도시 이름 (예: 서울)" },
    },
    required: ["city"],
  },
  execute: async ({ city }: { city: string }) => {
    // 데모용 — 실제론 기상청 API 호출 등
    const fake = { "서울": 22, "부산": 24, "제주": 26 };
    return { city, temp: (fake as any)[city] ?? 20, sky: "맑음" };
  },
};

const response = await chat({
  provider: "gemini",
  messages: [
    { role: "user", content: "서울의 날씨는 지금 어때?" },
  ],
  tools: [getWeather],
});

console.log("── response.text ──");
console.log(response.text || "(비어있음)");

console.log("\\n── response.toolCalls ──");
console.log(JSON.stringify(response.toolCalls, null, 2));`,
      hints: [
        "모델은 대부분 response.text 가 비거나 짧고, response.toolCalls 에 호출 의도 반환.",
        "toolCalls 구조: [{ name:'getWeather', args:{city:'서울'}, id:'...' }]",
        "provider 를 'groq' 로 바꿔도 동일 인터페이스 — 결과만 provider 별로 살짝 다를 수 있음.",
      ],
    },

    // ─────────────────────────────────────────────
    // 4. Raw 루프 2단계 — 실행 + 재호출
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🔁 raw 루프 2단계 — 실행 + 재호출

이번엔 **전체 루프** 를 손으로 짭니다:
1. chat 호출 → toolCalls 반환
2. 각 toolCall 에 대해 execute 실행
3. 결과를 **tool 메시지** 로 messages 배열에 추가
4. 다시 chat 호출 → 이번엔 toolCalls 없이 최종 자연어 답변

> 💡 **핵심**: tool 결과를 "tool" role 메시지로 히스토리에 쌓으면 다음 호출에서 모델이 자연어로 답합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const getWeather = {
  name: "getWeather",
  description: "도시 이름으로 현재 날씨 조회",
  parameters: {
    type: "object",
    properties: { city: { type: "string" } },
    required: ["city"],
  },
  execute: async ({ city }: { city: string }) => {
    return { city, temp: 22, sky: "맑음" };
  },
};

// 1회차 — 모델이 tool 호출 의도 반환
const messages: any[] = [
  { role: "user", content: "서울 날씨 알려줘." },
];

const first = await chat({
  provider: "gemini",
  messages,
  tools: [getWeather],
});

console.log("── 1회차 toolCalls ──");
console.log(first.toolCalls);

if (!first.toolCalls || first.toolCalls.length === 0) {
  console.log("tool 호출 안 함 — 그대로 답변:", first.text);
} else {
  // 2. assistant 의 "호출 의도" 턴을 히스토리에 반영
  messages.push({
    role: "assistant",
    content: first.text,
    toolCalls: first.toolCalls,
  });

  // 3. 각 tool 실행 + tool 메시지 append
  for (const call of first.toolCalls) {
    const result = await getWeather.execute(call.args as { city: string });
    console.log("  실행:", call.name, "→", result);

    messages.push({
      role: "tool",
      content: JSON.stringify(result),
      toolCallId: call.id,
    });
  }

  // 4. 2회차 — 결과를 받아 최종 자연어 답변
  const second = await chat({
    provider: "gemini",
    messages,
    tools: [getWeather],
  });

  console.log("\\n── 2회차 최종 답 ──");
  console.log(second.text);
}`,
      hints: [
        "messages 배열을 계속 확장하며 대화 히스토리를 유지하는 게 핵심.",
        "role 'tool' 메시지는 어느 toolCall 에 대한 결과인지 toolCallId 로 연결.",
        "assistant 의 tool 호출 턴을 빼먹으면 모델이 '방금 뭐 호출했지?' 맥락을 잃어 오작동.",
      ],
    },

    // ─────────────────────────────────────────────
    // 5. 2개 tool
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🧰 tool 2개 — 혼합 질문

이번엔 \`getWeather\` 와 \`getCurrentTime\` 두 개를 등록하고, **두 정보가 모두 필요한 질문** 을 합니다.

> "지금 서울 시간하고 날씨 알려줘."

모델은 **한 번에 두 tool 을 호출** 할 수도 있고, **순차적으로** 호출할 수도 있어요.
어떻게 처리하는지 관찰해보세요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const tools = [
  {
    name: "getWeather",
    description: "도시 이름으로 현재 날씨 조회",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
    execute: async ({ city }: { city: string }) => ({ city, temp: 22, sky: "맑음" }),
  },
  {
    name: "getCurrentTime",
    description: "도시 이름으로 현재 현지 시각 조회 (24시간 형식)",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
    execute: async ({ city }: { city: string }) => ({
      city,
      time: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
    }),
  },
];

const messages: any[] = [
  { role: "user", content: "지금 서울 시간하고 날씨 알려줘." },
];

// 최대 5 iteration 까지 반복
for (let i = 1; i <= 5; i++) {
  const res = await chat({ provider: "gemini", messages, tools });

  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log(\`\\n✅ [iter \${i}] 최종 답:\`, res.text);
    break;
  }

  console.log(\`[iter \${i}] tool 호출 \${res.toolCalls.length} 건:\`);
  messages.push({ role: "assistant", content: res.text, toolCalls: res.toolCalls });

  for (const call of res.toolCalls) {
    const tool = tools.find((t) => t.name === call.name);
    if (!tool) continue;
    const result = await tool.execute(call.args as any);
    console.log(\`  - \${call.name}(\${JSON.stringify(call.args)}) → \${JSON.stringify(result)}\`);
    messages.push({
      role: "tool",
      content: JSON.stringify(result),
      toolCallId: call.id,
    });
  }
}`,
      hints: [
        "모델이 한 턴에 여러 tool 을 동시 호출할 수도 있고, 한 번에 하나씩 순차 호출할 수도 있어요.",
        "Gemini 는 보통 순차적, Groq 은 병렬 호출을 잘 씁니다.",
        "for 루프 상한 없이 돌면 무한 루프 위험 — 반드시 maxIterations 같은 안전장치.",
      ],
    },

    // ─────────────────────────────────────────────
    // 6. chatWithTools 헬퍼 소개
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🛠️ 루프를 자동화하자 — \`chatWithTools\`

방금 for 루프에서 한 일을 라이브러리로 감쌉니다. 이 플랫폼이 제공하는 **\`chatWithTools\`** 는:
- **tool 이 없는 답변** 이 나올 때까지 자동 반복
- maxIterations 로 무한 루프 방지 (기본 5)
- onStep 콜백으로 각 tool 실행 상태를 UI 에 흘릴 수 있음
- import 없이 \`chat\` 처럼 바로 사용 가능

\`\`\`ts
const res = await chatWithTools({
  provider: "gemini",
  messages: [{ role: "user", content: "지금 서울 시간과 날씨" }],
  tools: [getWeather, getCurrentTime],
}, {
  onStep: (step) => console.log(\`[step \${step.iteration}] \${step.call.name}\`, step.result),
});

console.log(res.text);  // 최종 자연어 답
\`\`\`

같은 질문을 **헬퍼 한 번의 호출** 로 해결해봅시다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const tools = [
  {
    name: "getWeather",
    description: "도시 이름으로 현재 날씨 조회",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
    execute: async ({ city }: { city: string }) => ({ city, temp: 22, sky: "맑음" }),
  },
  {
    name: "getCurrentTime",
    description: "도시 이름으로 현재 현지 시각 조회",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
    execute: async ({ city }: { city: string }) => ({
      city,
      time: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
    }),
  },
];

const res = await chatWithTools(
  {
    provider: "gemini",
    messages: [{ role: "user", content: "지금 서울 시간하고 날씨 알려줘." }],
    tools,
  },
  {
    maxIterations: 5,
    onStep: (step) => {
      console.log(
        \`🔧 [iter \${step.iteration}] \${step.call.name}(\${JSON.stringify(step.call.args)})\`
      );
      console.log(\`   → \${JSON.stringify(step.result)}\`);
    },
  },
);

console.log("\\n✅ 최종 답:");
console.log(res.text);`,
      hints: [
        "훨씬 짧아진 코드로 동일 효과. 핵심 로직(iteration 관리, 메시지 히스토리, tool 실행)이 모두 헬퍼 안으로.",
        "onStep 으로 중간 진행을 UI 에 보여주기 좋음 — 에이전트의 '사고 로그' 느낌.",
        "헬퍼는 내부적으로 chat() 을 여러 번 부르므로 토큰·latency 가 비교적 큼 (당연).",
      ],
    },

    // ─────────────────────────────────────────────
    // 7. toolChoice 강제
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🎯 toolChoice — 호출 강도 제어

기본값은 \`"auto"\` — 모델이 스스로 "지금 tool 필요한지" 판단해요. 하지만 UX 상 **반드시 tool 을 쓰게 하고 싶을** 때:

| 값 | 의미 |
|---|---|
| \`"auto"\` | 모델이 판단 (기본) |
| \`"any"\` | **무조건 어떤 tool 이든** 호출 강제 |
| \`"none"\` | tool 정보만 참고, 호출은 금지 (검토용) |
| \`{ name: "fn" }\` | 특정 tool 만 호출 강제 |

### 사용 예 — 반드시 계산기를 쓰게

\`\`\`ts
await chatWithTools({
  provider: "gemini",
  messages: [{ role: "user", content: "3 더하기 5는?" }],
  tools: [calculator],
  toolChoice: "any",   // 모델이 "직접 8이라고 말하지 말고 반드시 calculator 써라"
});
\`\`\`

다음 셀에서 동작 차이 비교:`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const calculator = {
  name: "calculator",
  description: "두 숫자의 합을 정확히 계산",
  parameters: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" },
    },
    required: ["a", "b"],
  },
  execute: async ({ a, b }: { a: number; b: number }) => ({ sum: a + b }),
};

// ── auto (기본) ── 간단한 덧셈은 모델이 자기가 답해버림
const autoRes = await chatWithTools({
  provider: "gemini",
  messages: [{ role: "user", content: "3 더하기 5는?" }],
  tools: [calculator],
  // toolChoice 생략 = "auto"
});
console.log("[auto]", autoRes.text);

// ── any 강제 ── 반드시 calculator 를 거침
const anyRes = await chatWithTools(
  {
    provider: "gemini",
    messages: [{ role: "user", content: "3 더하기 5는?" }],
    tools: [calculator],
    toolChoice: "any",
  },
  {
    onStep: (s) => console.log("[any] 경유:", s.call.name, s.call.args, "→", s.result),
  },
);
console.log("[any]", anyRes.text);`,
      hints: [
        "auto 에선 모델이 '자기도 아는 걸' 이라며 그냥 답하기도 함. 사용자가 왜 숫자를 직접 계산하는지 의심 못함.",
        "any 로 강제하면 모든 답이 calculator 를 거침 — 감사 로그·비용 추적에 유리.",
        "{name:'calculator'} 로 특정 tool 만 강제 가능. 예: 보안 민감 작업에 특정 API 만 쓰게.",
      ],
    },

    // ─────────────────────────────────────────────
    // 8. 미션
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🎯 미션: 나만의 tool 만들기

학생이 **자기 아이디어의 tool** 을 하나 정의하고, 자연어 질문을 그 tool 과 연결해봅니다.

### 요구사항

\`\`\`ts
interface MissionResult {
  userQuestion: string;  // 사용자 원문
  toolUsed: string;      // 호출된 tool 이름
  toolArgs: unknown;     // 호출 인자
  toolResult: unknown;   // 실행 결과
  finalAnswer: string;   // LLM 의 최종 자연어 답
}

async function runMission(): Promise<MissionResult>;
\`\`\`

### 자유롭게 정할 것
1. **tool 하나 정의** — 예: 주사위 굴리기, 랜덤 이름 생성, 간단 환율 계산, 피보나치 수
2. tool 을 쓰지 않으면 답할 수 없는 **사용자 질문** 작성
3. \`chatWithTools\` 로 해결 + \`onStep\` 에서 호출 정보 캡처
4. 결과를 \`MissionResult\` 객체로 리턴

### 팁
- \`tools\` 배열에 **여러 개** 넣어 모델이 적절한 걸 고르게 해도 OK
- \`toolChoice: "any"\` 로 강제하면 모델이 "그냥 자기 지식" 으로 답하는 걸 방지
- execute 안에선 어떤 JS 도 가능 (Math.random, Date, fetch 등)`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `interface MissionResult {
  userQuestion: string;
  toolUsed: string;
  toolArgs: unknown;
  toolResult: unknown;
  finalAnswer: string;
}

async function runMission(): Promise<MissionResult> {
  // TODO: 아래 5단계
  //  1) 원하는 tool 정의 (name/description/parameters/execute)
  //  2) userQuestion 결정 (tool 없이는 답 못하는 형태)
  //  3) onStep 으로 호출 정보 캡처
  //  4) chatWithTools 호출 (toolChoice:'any' 권장)
  //  5) { userQuestion, toolUsed, toolArgs, toolResult, finalAnswer } 반환
  throw new Error("미구현 — 힌트를 참고해 완성하세요");
}

const result = await runMission();
console.log("── 미션 결과 ──");
console.log(JSON.stringify(result, null, 2));`,
      hints: [
        "간단한 예 아이디어:\\n  - rollDice(sides) — 1~sides 중 무작위 정수\\n  - reverseString(text) — 문자열 뒤집기\\n  - convertTemp(celsius) — 섭씨 → 화씨\\n  - randomPick(items) — 배열에서 무작위 한 개",
        "onStep 에서 캡처하려면: let captured; const res = await chatWithTools(...,{ onStep: (s)=>{ captured = s; } });",
        "finalAnswer 는 res.text, toolUsed/Args/Result 는 captured 에서 꺼내기.",
      ],
      solution: `interface MissionResult {
  userQuestion: string;
  toolUsed: string;
  toolArgs: unknown;
  toolResult: unknown;
  finalAnswer: string;
}

async function runMission(): Promise<MissionResult> {
  // 1) tool 정의 — 주사위 + 랜덤 선택 2개
  const rollDice = {
    name: "rollDice",
    description: "정수 sides 를 받아 1부터 sides 사이의 무작위 정수 하나를 반환. 주사위 굴리기.",
    parameters: {
      type: "object",
      properties: {
        sides: { type: "integer", description: "주사위 면 수 (예: 6)" },
      },
      required: ["sides"],
    },
    execute: async ({ sides }: { sides: number }) => ({
      sides,
      result: Math.floor(Math.random() * sides) + 1,
    }),
  };

  const randomPick = {
    name: "randomPick",
    description: "문자열 배열 items 에서 무작위로 하나를 반환.",
    parameters: {
      type: "object",
      properties: {
        items: { type: "array", items: { type: "string" } },
      },
      required: ["items"],
    },
    execute: async ({ items }: { items: string[] }) => ({
      choice: items[Math.floor(Math.random() * items.length)],
    }),
  };

  const userQuestion = "12면 주사위 하나 굴려줘. 그 숫자에 따라 오늘 저녁 뭐 먹을지도 정해줘 — 후보: 짜장면/초밥/떡볶이/피자.";

  let capturedCall: any = null;
  let capturedResult: any = null;

  const res = await chatWithTools(
    {
      provider: "gemini",
      messages: [{ role: "user", content: userQuestion }],
      tools: [rollDice, randomPick],
      toolChoice: "any",
    },
    {
      onStep: (step) => {
        // 마지막 호출 저장
        capturedCall = step.call;
        capturedResult = step.result;
      },
    },
  );

  return {
    userQuestion,
    toolUsed: capturedCall?.name ?? "(none)",
    toolArgs: capturedCall?.args ?? null,
    toolResult: capturedResult ?? null,
    finalAnswer: res.text,
  };
}

const result = await runMission();
console.log("── 미션 결과 ──");
console.log(JSON.stringify(result, null, 2));`,
    },

    // ─────────────────────────────────────────────
    // 9. 정리 + Phase 3 예고
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🧭 Ch05 정리 + Phase 2 완주 + Phase 3 예고

### 오늘 배운 것
- ✅ LLM 의 한계 인식 — 실시간 정보·계산·외부 데이터는 **직접 하지 않는다**
- ✅ **Tool Definition** 구조 — name / description / parameters / execute
- ✅ **raw 루프** — chat → toolCalls → execute → tool 메시지 → 다시 chat
- ✅ **chatWithTools** 헬퍼로 루프 자동화 + onStep 추적
- ✅ **toolChoice** 로 호출 강제 (auto / any / none / {name})
- ✅ 자기 tool 정의 + 자연어 질문 연결

### 🎉 Phase 2 완주!
Ch03 구조화 출력 → Ch04 CoT 스트리밍 → Ch05 Tool Calling 까지.

이제 여러분은 **실무 LLM 앱의 3대 텍스트 패턴** 을 손으로 코드화 할 수 있습니다:
| 패턴 | 핵심 | 대표 사용 |
|---|---|---|
| 구조화 출력 | responseSchema + ==zod== | 데이터 추출, ==API== 응답 |
| ==CoT== + 스트리밍 | stream + 단계별 사고 | 복잡한 추론, 설명 |
| Tool Calling | tools + chatWithTools | 실시간 정보, 외부 액션 |

### Phase 3 예고 — 단일/멀티 에이전트
Tool Calling + CoT + 구조화 출력 조합이 **에이전트 (Agent)** 의 본체입니다.
- Ch06 단일 에이전트 — "이메일 초안 에이전트"
- Ch07 멀티 에이전트 — "조사·집필·검토 삼각팀"

Phase 3 부턴 **"사용자가 목표만 주면 AI 가 알아서 일하는"** 시스템을 만듭니다. 🚀`,
    },
  ],

  quiz: {
    title: "Ch05 — Tool Calling 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "Tool Calling 에서 LLM 의 역할은?",
        options: [
          "직접 외부 API 를 호출한다",
          "호출하려는 함수·인자의 \"의도\" 만 JSON 으로 돌려주고, 실제 실행은 코드가 한다",
          "함수를 작성한다",
          "서버에 코드를 배포한다",
        ],
        correctIndex: 1,
        explanation:
          'LLM 은 자신에게 제공된 tool 목록을 보고 "이 함수를 이 인자로 호출하는 게 좋겠다"는 **의도** 를 `toolCalls` 로 반환. 진짜 실행은 우리 코드가. 이 분리가 안전·감사 가능성을 보장.',
      },
      {
        type: "multiple-choice",
        question: "Tool Definition 의 4요소 중 모델 판단에 **가장 큰 영향** 을 주는 것은?",
        options: ["name", "description", "parameters", "execute"],
        correctIndex: 1,
        explanation:
          "모델은 description 의 자연어를 읽어 '언제 부를지' 를 결정합니다. name 은 단순 식별자, parameters 는 인자 모양, execute 는 런타임이 쓸 실제 구현 — 모두 중요하지만 **호출 여부를 정하는 근거는 description**.",
      },
      {
        type: "multiple-choice",
        question: "raw 루프에서 tool 실행 결과를 모델에 알리는 방법은?",
        options: [
          "messages 에 role=\"user\" 로 추가",
          "messages 에 role=\"tool\" + toolCallId 로 추가",
          "체내 변수로 저장",
          "알릴 필요 없음 — 모델이 자동으로 안다",
        ],
        correctIndex: 1,
        explanation:
          'tool 결과는 role="tool" 메시지로 히스토리에 쌓아야 다음 chat 호출에서 모델이 참고합니다. toolCallId 는 어느 호출에 대한 결과인지 연결하는 식별자.',
      },
      {
        type: "multiple-choice",
        question: "`chatWithTools` 헬퍼의 역할은?",
        options: [
          "tool 없이도 chat 을 부른다",
          "WebLLM 에서 tool 을 지원하게 한다",
          "\"chat → toolCalls → execute → tool 메시지 → chat 재호출\" 루프를 자동 반복, 최종 자연어 답변까지",
          "tool 코드를 생성한다",
        ],
        correctIndex: 2,
        explanation:
          "직접 손으로 짜던 for 루프를 라이브러리로 감쌌어요. maxIterations 로 무한 루프 방지 + onStep 으로 진행 상황 스트리밍도 지원.",
      },
      {
        type: "multiple-choice",
        question: "`toolChoice: \"any\"` 는 어떤 효과가 있나요?",
        options: [
          "tool 이 하나도 등록돼 있지 않아도 동작",
          "모델이 \"자기가 답할 수 있는 것\" 이라도 반드시 어떤 tool 이든 호출하게 강제",
          "응답 속도를 올린다",
          "tool 파라미터 검증을 생략",
        ],
        correctIndex: 1,
        explanation:
          "모델이 쉬운 질문엔 tool 을 건너뛰고 자기 지식으로 답하는 경향을 차단. 감사 로그·비용 추적 · 특정 데이터 소스 고정이 필요한 상황에 유용.",
      },
      {
        type: "multiple-choice",
        question: "WebLLM (Llama 3.2 1B) 에서 `tools` 를 지정하면?",
        options: [
          "정상 동작",
          "결과 품질이 낮음 (best effort)",
          "LlmError(\"unsupported-env\") — WebLLM 은 tool calling 미지원",
          "자동으로 Groq 로 페일오버",
        ],
        correctIndex: 2,
        explanation:
          "WebLLM 이 사용하는 소형 모델은 tool calling 을 지원하지 않아요. 우리 어댑터는 req.tools 가 있으면 명시적으로 unsupported-env 를 던져 혼란을 방지. Gemini/Groq 로 전환해야 합니다.",
      },
    ],
  } satisfies Quiz,
};
