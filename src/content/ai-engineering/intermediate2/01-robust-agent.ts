import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson01: Lesson = {
  id: "ai-eng-m2-01-robust-agent",
  language: "ai-engineering",
  track: "intermediate2",
  order: 1,
  title: "에이전트 재정의 & 견고한 단일 에이전트",
  subtitle: "에이전트 = 스스로 다음 행동을 정하는 루프. 실패해도 죽지 않게.",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🦾 트윈에 손발을 단다 — 에이전틱

> 💡 보라색 점선 밑줄 = 전문 용어. 올리면 설명이 나와요.

중급1 에서 만든 **지식 트윈**은 "안다"였습니다. 중급2 는 트윈에 **손발**을 달아 "한다"로 확장합니다.

### 중급2 전체 지도 (트윈에 손발 달기)
\`\`\`
중2-01 견고한 단일 에이전트   ← 지금 여기
중2-02 오케스트레이션         (여러 에이전트 조율)
중2-03 메모리 & 컨텍스트 관리  (긴 대화 견디기)
중2-04 실연동 + HITL          (실제 행동 + 사람 승인)
중2-05 평가 & 관측            (느낌 아닌 숫자)
중2-06 비용·속도·보안         (프로덕션 운영)
중2-Capstone 배포형 에이전트
\`\`\`

### 이 강에서
- 에이전트를 **다시 정의** — "tool 유무"가 아니라 **스스로 다음 행동을 결정하는 ==제어 흐름=="**
- 입문 mock 의 한계를 넘어 **실패해도 죽지 않는** 에이전트 (에러·재시도·검증)`,
    },

    {
      type: "markdown",
      source: `## 🔁 에이전트 = Think → Act → Observe 루프

\`\`\`
[🧠 Think]  다음에 뭘 할지 결정 (LLM 추론)
   ↓
[🛠️ Act]   도구 실행 (코드)
   ↓
[👀 Observe] 결과를 보고 → 다시 Think... (목표 달성까지 반복)
\`\`\`

입문 5·6강의 \`chatWithTools\` 가 이미 이 루프의 구현체예요.
\`\`\`ts
chatWithTools(req, { maxIterations, onStep })  // req: {provider, messages, tools, toolChoice}
\`\`\`
- **req.tools**: 에이전트가 쓸 수 있는 도구들
- **onStep**: 매 도구 실행 후 호출 — 사고/행동 로그(==관측성==)
- **maxIterations**: 무한 루프 방지 (기본 5)

> 에이전트의 본질은 "새 SDK" 가 아니라 **루프 + 좋은 도구 + 좋은 지시**입니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 가장 기본적인 단일 에이전트 — 계산기 도구 + onStep 으로 행동 관측
const calculator = {
  name: "calculator",
  description: "정확한 사칙연산. a, b 와 연산(op: add/sub/mul/div)을 받아 계산.",
  parameters: {
    type: "object",
    properties: {
      a: { type: "number" }, b: { type: "number" },
      op: { type: "string", enum: ["add", "sub", "mul", "div"] },
    },
    required: ["a", "b", "op"],
  },
  execute: async ({ a, b, op }: { a: number; b: number; op: string }) => {
    const ops: Record<string, number> = { add: a + b, sub: a - b, mul: a * b, div: b ? a / b : NaN };
    return { result: ops[op] };
  },
};

const res = await chatWithTools(
  {
    provider: "gemini",
    messages: [
      { role: "system", content: "너는 계산을 반드시 calculator 도구로만 하는 에이전트야. 암산 금지." },
      { role: "user", content: "사과 3봉지 × 12개에서 7개를 먹으면 몇 개 남아?" },
    ],
    tools: [calculator],
    toolChoice: "any",
  },
  {
    maxIterations: 6,
    onStep: (step) => console.log(\`🔧 [iter \${step.iteration}] \${step.call.name}(\${JSON.stringify(step.call.args)}) → \${JSON.stringify(step.result)}\`),
  },
);

console.log("\\n💬 최종 답:", res.text);
console.log("👉 onStep 로그에 도구 호출이 순서대로 찍히면 Think→Act→Observe 루프가 도는 것.");`,
      hints: [
        "toolChoice:'any' 가 도구를 반드시 거치게 만듭니다(암산으로 빠지지 않게).",
        "onStep 의 step 은 {call:{name,args}, result, iteration} — 에이전트의 사고 로그.",
        "셀 결과에 AgentTraceViewer(도구 호출 타임라인)도 자동 표시됩니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🛡️ 견고함 — 실패해도 죽지 않는 에이전트

입문의 mock 도구는 **항상 성공**했어요. 실제 도구는 실패합니다 — 네트워크 오류, 타임아웃, 잘못된 입력.

견고한 에이전트의 3원칙:
1. **execute 안에서 try/catch** — 실패를 던지지 말고 \`{ error: "..." }\` 로 **반환** → 모델이 보고 대처
2. **재시도(retry)** — 일시적 실패는 몇 번 더 시도
3. **결과 검증** — 도구 반환값을 ==zod== 로 검증해 쓰레기 데이터 차단

> 핵심: 도구가 실패해도 **에이전트 전체가 죽으면 안 된다**. 실패를 "관측 가능한 결과"로 바꿔 모델이 다음 행동을 정하게 하라.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 가끔 실패하는 도구 + 재시도 래퍼 + 실패를 '결과'로 반환
// (데모를 위해 호출 카운터로 처음 1회는 일부러 실패시킴)
let calls = 0;
async function flakyFetchPrice(item: string): Promise<{ price: number }> {
  calls++;
  if (calls === 1) throw new Error("일시적 네트워크 오류");  // 첫 호출은 실패
  const prices: Record<string, number> = { "사과": 1500, "바나나": 3000 };
  return { price: prices[item] ?? 0 };
}

// 재시도 래퍼 — 일시적 실패를 몇 번 더 시도
async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= tries; i++) {
    try { return await fn(); }
    catch (e) { lastErr = e; console.log(\`  ⚠️ 시도 \${i} 실패: \${(e as Error).message}\`); }
  }
  throw lastErr;
}

const getPrice = {
  name: "getPrice",
  description: "상품명으로 가격을 조회한다.",
  parameters: { type: "object", properties: { item: { type: "string" } }, required: ["item"] },
  // execute 는 던지지 않고 '결과'로 성공/실패를 반환 → 에이전트가 죽지 않음
  execute: async ({ item }: { item: string }) => {
    try {
      const r = await withRetry(() => flakyFetchPrice(item));
      return { ok: true, ...r };
    } catch (e) {
      return { ok: false, error: (e as Error).message };  // 실패도 '관측 가능한 결과'
    }
  },
};

const res = await chatWithTools(
  {
    provider: "gemini",
    messages: [
      { role: "system", content: "getPrice 도구로 가격을 조회해 한국어로 답해. 조회 실패 시 사용자에게 정중히 알려." },
      { role: "user", content: "사과 가격 알려줘" },
    ],
    tools: [getPrice],
    toolChoice: "any",
  },
  { onStep: (s) => console.log(\`🔧 \${s.call.name} → \${JSON.stringify(s.result)}\`) },
);
console.log("\\n💬", res.text);
console.log("👉 첫 시도는 실패했지만 재시도로 복구 → 에이전트가 죽지 않고 답을 냅니다.");`,
      hints: [
        "execute 가 throw 하면 루프가 깨질 수 있음 → 실패를 { ok:false, error } 로 '반환' 하는 게 견고함의 핵심.",
        "withRetry 는 일시적 오류(네트워크 등)에 효과적. 영구 오류(잘못된 입력)는 재시도해도 소용없으니 구분 권장.",
        "calls 카운터는 데모용 — 실제론 진짜 네트워크 호출이 들어갑니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 50% 실패 도구에서 완수하기

\`unreliableTool\` 이 50% 확률로 실패합니다(데모는 호출 횟수로 흉내).
\`withRetry\` 와 **실패를 결과로 반환**하는 패턴을 적용해, 에이전트가 끝까지 답을 내게 하세요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `let n = 0;
async function unreliableLookup(city: string): Promise<{ temp: number }> {
  n++;
  if (n % 2 === 1) throw new Error("타임아웃");  // 홀수 호출 실패 (≈50%)
  const t: Record<string, number> = { "서울": 18, "부산": 21 };
  return { temp: t[city] ?? 15 };
}

// 🎯 TODO 1: withRetry 래퍼 구현 (tries 회 재시도)
// 🎯 TODO 2: getWeather.execute 에서 withRetry 사용 + 실패 시 {ok:false,error} 반환

const getWeather = {
  name: "getWeather",
  description: "도시 이름으로 현재 기온을 조회.",
  parameters: { type: "object", properties: { city: { type: "string" } }, required: ["city"] },
  execute: async ({ city }: { city: string }) => {
    // TODO: 여기에 재시도 + 실패 처리
    return await unreliableLookup(city);  // ← 지금은 그대로라 실패 시 죽음. 고치세요.
  },
};

const res = await chatWithTools(
  { provider: "gemini",
    messages: [
      { role: "system", content: "getWeather 로 기온을 조회해 답해. 실패하면 정중히 알려." },
      { role: "user", content: "서울 기온 알려줘" }],
    tools: [getWeather], toolChoice: "any" },
  { onStep: (s) => console.log("🔧", s.call.name, "→", JSON.stringify(s.result)) },
);
console.log("💬", res.text);`,
      hints: [
        "withRetry: for 루프 안에서 try{return await fn()}catch{계속}, 끝까지 실패하면 throw 또는 실패객체 반환.",
        "execute: try { const r = await withRetry(()=>unreliableLookup(city)); return {ok:true,...r}; } catch { return {ok:false,error:'조회 실패'}; }",
        "재시도가 짝수 호출에서 성공하므로 보통 복구됩니다 — 에이전트가 죽지 않는 게 목표.",
      ],
      solution: `let n = 0;
async function unreliableLookup(city: string): Promise<{ temp: number }> {
  n++;
  if (n % 2 === 1) throw new Error("타임아웃");
  const t: Record<string, number> = { "서울": 18, "부산": 21 };
  return { temp: t[city] ?? 15 };
}

async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  let last: unknown;
  for (let i = 1; i <= tries; i++) {
    try { return await fn(); }
    catch (e) { last = e; console.log(\`  ⚠️ 시도 \${i} 실패\`); }
  }
  throw last;
}

const getWeather = {
  name: "getWeather",
  description: "도시 이름으로 현재 기온을 조회.",
  parameters: { type: "object", properties: { city: { type: "string" } }, required: ["city"] },
  execute: async ({ city }: { city: string }) => {
    try {
      const r = await withRetry(() => unreliableLookup(city));
      return { ok: true, ...r };
    } catch {
      return { ok: false, error: "기온 조회에 실패했습니다" };
    }
  },
};

const res = await chatWithTools(
  { provider: "gemini",
    messages: [
      { role: "system", content: "getWeather 로 기온을 조회해 답해. 실패하면 정중히 알려." },
      { role: "user", content: "서울 기온 알려줘" }],
    tools: [getWeather], toolChoice: "any" },
  { onStep: (s) => console.log("🔧", s.call.name, "→", JSON.stringify(s.result)) },
);
console.log("💬", res.text);`,
    },

    {
      type: "markdown",
      source: `## 🧭 중2-01 정리

- ✅ 에이전트 = **스스로 다음 행동을 정하는 ==제어 흐름==** (Think→Act→Observe), \`chatWithTools\` 가 구현체
- ✅ ==관측성== — \`onStep\` 으로 도구 호출/결과를 로그 (AgentTraceViewer)
- ✅ 견고함 3원칙 — execute 에서 **실패를 결과로 반환** / **재시도** / **결과 검증**

### 다음 강 — 중2-02 오케스트레이션
도구 하나짜리 에이전트를 넘어, **여러 에이전트를 조율**합니다:
- ==router== (질의 분류 후 분배) · ==supervisor== (계층형) · **병렬 실행**`,
    },
  ],

  quiz: {
    title: "중2-01 — 견고한 단일 에이전트 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "이 강에서 다시 정의한 '에이전트' 의 본질은?",
        options: [
          "tool 을 쓰면 에이전트, 안 쓰면 아니다",
          "스스로 다음 행동을 결정하는 제어 흐름(Think→Act→Observe 루프)",
          "더 큰 모델을 쓰는 것",
          "여러 모델을 동시에 쓰는 것",
        ],
        correctIndex: 1,
        explanation: "에이전트의 본질은 tool 유무가 아니라 '스스로 다음 행동을 정하는 루프'. chatWithTools 가 그 구현체이고, 좋은 지시·도구가 수준을 결정한다.",
      },
      {
        type: "multiple-choice",
        question: "견고한 에이전트에서 도구 실행(execute)이 실패할 때 권장 방식은?",
        options: [
          "예외를 그대로 던져 에이전트를 멈춘다",
          "실패를 { ok:false, error } 같은 '관측 가능한 결과'로 반환해 모델이 대처하게 한다",
          "실패를 무시하고 빈 값을 반환한다",
          "무한 재시도한다",
        ],
        correctIndex: 1,
        explanation: "execute 가 throw 하면 루프가 깨질 수 있다. 실패를 결과로 반환하면 에이전트가 죽지 않고 사용자에게 정중히 알리는 등 다음 행동을 정할 수 있다.",
      },
      {
        type: "multiple-choice",
        question: "chatWithTools 의 onStep 콜백의 용도는?",
        options: [
          "토큰 비용을 0으로 만든다",
          "매 도구 실행 후 호출·결과를 받아 진행을 로그/관측(관측성)한다",
          "모델을 교체한다",
          "임베딩을 생성한다",
        ],
        correctIndex: 1,
        explanation: "onStep(step:{call,result,iteration})은 에이전트의 사고/행동 로그. 디버깅·감사·UI 표시에 쓰이며 AgentTraceViewer 가 이를 시각화한다.",
      },
    ],
  } satisfies Quiz,
};
