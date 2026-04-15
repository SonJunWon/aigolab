# Phase 2 — v4.3.0 상세 설계

**작성일**: 2026-04-16
**범위**: Ch03 구조화 출력 · Ch04 Chain-of-Thought · Ch05 Tool Calling
**목표 릴리즈**: v4.3.0 (MINOR)
**상태**: 📝 기획 단계
**참조**: [ROADMAP.md](../ROADMAP.md), [v4.0 PLAN](../v4.0/PLAN.md)

> ℹ️ **버전 정정**: ROADMAP 초안은 Phase 2 를 `v4.1.0` 에 배치했지만, v4.1.x / v4.2.0 은 이미 키 UX / 녹화 인프라로 소비됨. Phase 2 는 **v4.3.0** 에 정착.

---

## 🎯 Phase 2 목표 (Goal-Backward)

**사용자 스토리 3개** — Phase 2 완료 시점에 학생이 할 수 있어야 할 것:

> **Ch03 스토리**: 학생이 `z.object({name: z.string(), age: z.number()}).parse(r.json)` 식으로 LLM 응답을 **타입 안전하게** 받아 쓴다. 자유 텍스트 파싱 지옥을 탈출.

> **Ch04 스토리**: 학생이 수학 추론 문제 ("5명이 3일간 120개를 만들면 8명은 5일간?") 를 주고, 모델이 **단계별 추론을 토큰씩 스트리밍** 하며 풀이 과정을 보여주는 걸 실시간 관찰. 필요하면 중간에 개입.

> **Ch05 스토리**: 학생이 `const getWeather = (city) => ...` 같은 **자기 TypeScript 함수**를 정의하고, `chat()` 에 tool 로 넘겨 "서울 날씨 알려줘" → 모델이 `getWeather("서울")` 호출 → 결과 받아 자연어 답변을 조립하는 **전체 루프**를 코드로 작성.

이 3가지 — **구조화·추론·도구** — 가 실무 LLM 앱의 3대 텍스트 패턴. Phase 3 의 Agent 로 이어지는 필수 전제.

---

## 📐 아키텍처 델타 (Phase 1 대비)

```
                          [Ch03]              [Ch04]                 [Ch05]
                          JSON Schema         Streaming              Tool Calling
                              │                   │                       │
┌─────────────────────────────┴───────────────────┴───────────────────────┴──────┐
│              ChatRequest 확장 (types.ts)                                        │
│   + responseSchema?    + stream?/onToken?    + tools?/toolChoice?              │
│                                                                                 │
│              ChatResponse 확장                                                   │
│   + json?  (parsed)    + chunks stream       + toolCalls[]                     │
└────────────────────────────────────────────────────────────────────────────────┘
                              │                   │                       │
                              ↓                   ↓                       ↓
         Gemini adapter: config.responseSchema · streamGenerateContent · functionDeclarations
         Groq adapter  : response_format        · stream:true          · tools[] (OpenAI 호환)
         WebLLM adapter: (Ch03 만 부분 지원, Ch04/05 는 "미지원 안내" 배지)
```

### 설계 원칙
- **학생 코드는 여전히 provider 무관** — `task`/`provider` 선택만 바뀜
- **Ch03 ≈ Phase 1 패턴 확장**, Ch04 ≈ **신규 스트리밍 경로**, Ch05 ≈ **신규 tool-call 루프**
- 세 기능 모두 **시뮬레이션 녹화/재생 호환** 해야 함 (Trace 포맷 확장)
- 키 없는 학생 경로: Ch03 은 Gemini 녹화본, Ch04/05 는 녹화본 + 시뮬레이션 tool 실행

---

## 🧩 Task Breakdown

### T1. `ChatRequest` / `ChatResponse` 확장 (`src/lib/llm/types.ts`)

```ts
export interface ChatRequest {
  messages: Message[];
  task?: Task;
  provider?: Provider;
  temperature?: number;
  maxTokens?: number;
  simulation?: Trace;

  // ─── Phase 2 신규 ───
  /** JSON Schema (zod 기반 권장) — 모델이 해당 스키마에 맞는 JSON 반환 강제 */
  responseSchema?: JsonSchema;
  /** true 면 onToken 콜백으로 부분 결과 스트리밍 */
  stream?: boolean;
  /** 사용할 tool 함수 목록 (Ch05) */
  tools?: ToolDefinition[];
  /** tool 호출 강제 수준 — "auto" (기본) / "any" / "none" / {name} */
  toolChoice?: ToolChoice;
}

export interface ChatResponse {
  text: string;
  provider: Provider;
  model: string;
  tokensUsed?: { input: number; output: number };
  latencyMs: number;
  raw?: unknown;

  // ─── Phase 2 신규 ───
  /** responseSchema 있으면 파싱된 객체 (실패 시 undefined, text 는 JSON 원문) */
  json?: unknown;
  /** 모델이 호출하려는 tool 목록 (Ch05). 없으면 undefined. */
  toolCalls?: ToolCall[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: JsonSchema;
  /** 실제 실행 함수 — 루프에서 호출 */
  execute: (args: Record<string, unknown>) => unknown | Promise<unknown>;
}

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  /** 모델 제공자 식별자 (Gemini function-call id, Groq tool_call id) */
  id?: string;
}

export type ToolChoice = "auto" | "any" | "none" | { name: string };

export type JsonSchema = Record<string, unknown>; // 자유 JSON Schema
```

### T2. 스트리밍 콜백 (`LlmRunCallbacks` 확장)

```ts
export interface LlmRunCallbacks {
  onStdout?, onStderr?, onProgress?, replayTraces?;  // 기존

  /** 스트리밍 chunk — Ch04 Thought Stream 에서 토큰 단위 업데이트 */
  onToken?: (chunk: string) => void;
}
```

- `wrappedChat` 이 `req.stream === true` 일 때 어댑터의 스트리밍 경로 호출
- 각 chunk 를 `callbacks.onToken` 으로 전달
- `onStdout` 은 기존 `console.log` 경로와 분리 — Thought Stream 전용

### T3. Gemini 어댑터 확장 (`providers/gemini.ts`)

**Ch03 구조화 출력**:
```ts
const response = await ai.models.generateContent({
  model,
  contents,
  config: {
    systemInstruction: system,
    temperature: req.temperature,
    maxOutputTokens: req.maxTokens,
    responseMimeType: req.responseSchema ? "application/json" : undefined,
    responseSchema: req.responseSchema,   // JSON Schema 그대로 전달
  },
});
// response.text 가 JSON 문자열. try-parse 해서 json 필드 채움.
```

**Ch04 스트리밍**:
```ts
const stream = await ai.models.generateContentStream({ ... });
for await (const chunk of stream) {
  onToken?.(chunk.text);
}
```

**Ch05 Tool Calling**:
```ts
config: {
  tools: [{ functionDeclarations: req.tools.map(toFnDecl) }],
  toolConfig: { functionCallingConfig: { mode: mapMode(req.toolChoice) } },
}
// response.functionCalls -> 우리 ToolCall[] 로 매핑
```

### T4. Groq 어댑터 확장 (`providers/groq.ts`)

OpenAI 호환이라 상대적으로 단순:
- **구조화**: `response_format: { type: "json_schema", json_schema: {...} }`
- **스트리밍**: `stream: true` + 비동기 iterator
- **Tool calling**: `tools: [{type:"function", function:{name, parameters}}]` + `tool_choice`

### T5. WebLLM 어댑터 — 부분 지원

- **Ch03**: 모델이 약해서 schema 준수율 낮음. "best effort" 로 만들어주되, 실패 시 json 필드 undefined.
- **Ch04**: 스트리밍은 OpenAI-compatible API 로 가능. 체감 속도는 느림 (브라우저 WebGPU).
- **Ch05**: **미지원** — `tools` 지정 시 `LlmError("unsupported-env", "WebLLM 은 tool calling 미지원")`
- UI: 셀에서 WebLLM + tool 조합 선택 시 배지로 안내

### T6. Tool Call 루프 헬퍼 (`src/lib/llm/toolLoop.ts` 신규)

```ts
/**
 * 한 번의 chat 호출이 아니라 "tool call → execute → continue" 사이클을 자동으로 도는 헬퍼.
 * 학생은 Ch05 중반에 이걸 쓰기 전, 먼저 raw 루프를 손으로 짜본다 (학습 가치).
 */
export async function chatWithTools(
  req: ChatRequest,
  opts?: { maxIterations?: number; onStep?: (step: ToolLoopStep) => void },
): Promise<ChatResponse> {
  const messages = [...req.messages];
  let iter = 0;
  const maxIter = opts?.maxIterations ?? 5;

  while (iter++ < maxIter) {
    const res = await chat({ ...req, messages });
    if (!res.toolCalls || res.toolCalls.length === 0) return res;

    // assistant 메시지 추가 + 각 tool 실행해 결과 push
    messages.push({ role: "assistant", content: res.text, toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      const tool = req.tools?.find((t) => t.name === call.name);
      if (!tool) throw new LlmError("unknown", `Tool not found: ${call.name}`);
      const result = await tool.execute(call.args);
      messages.push({ role: "tool", content: JSON.stringify(result), toolCallId: call.id });
      opts?.onStep?.({ call, result });
    }
  }
  throw new LlmError("unknown", `Tool loop exceeded ${maxIter} iterations`);
}
```

- `Message` 타입도 확장 필요: `role: "tool"` 추가 + `toolCalls?`, `toolCallId?` 필드

### T7. Thought Stream 셀 렌더 (`LlmCodeCell` 확장)

- `onToken` 이 흐르는 동안 누적 텍스트를 셀 하단에 실시간 표시
- 완료되면 일반 stdout 으로 확정
- 시각 힌트: "🧠 생각 중..." 반짝이는 커서
- 구현: `notebookStore` 에 `appendToken(cellId, chunk)` 액션 (stdout 말단에 이어붙이기)
- `stream: "thought"` OutputChunk 타입 추가 검토

### T8. JSON Schema 비주얼 에디터 (선택 — Ch03 후반)

**목적**: 학생이 `{type:"object", properties:{...}}` 문법 암기 없이 스키마 작성.
- 최소 버전: 필드 추가/제거, 타입(string/number/boolean/array/object) 토글, required 체크박스
- 결과는 zod 코드 또는 JSON 양쪽으로 export
- **범위 결정**: 이번 Phase 에선 **스펙만** 작성 — 실제 구현은 학생 피드백 받은 뒤 v4.4.x 에서

### T9. Ch03 레슨 작성 — "자유 텍스트 지옥에서 탈출"

**구성안** (약 25분):
1. 📖 "LLM 응답을 코드가 쓰려면 문제" — regex 파싱의 비참함
2. 🤖 naive: system="JSON 으로 답해" — 40% 실패율 직접 체험 (temperature 0.1 로도 실패하는 예)
3. 📖 JSON Schema · responseSchema 소개
4. 🤖 `responseSchema` 주고 재실행 — 100% 성공
5. 📖 zod 로 런타임 검증 (이미 타입 추론 + 런타임 가드)
6. 🤖 zod schema → JSON Schema 변환 + chat + parse 실습
7. 📖 enum · array 패턴
8. 🤖 미션: 리뷰 텍스트 → `{sentiment, topics, actionItems[]}` 추출기
9. 📝 퀴즈 4문항

### T10. Ch04 레슨 작성 — "생각을 흘려보며 배운다"

**구성안** (약 30분):
1. 📖 "바로 답" vs "생각하고 답" — 정답률 차이 체감
2. 🤖 수학 문제 — CoT 없이: 종종 틀림
3. 📖 "Let's think step by step" — 한 줄로 CoT 유도
4. 🤖 같은 문제 + CoT 프롬프트 — 정답 ↑
5. 📖 스트리밍 — 모델이 생각하는 걸 **실시간으로 본다**
6. 🤖 `stream: true` + `onToken` 으로 Thought Stream 경험
7. 📖 복잡한 추론: 3 에이전트 가위바위보 시뮬레이션
8. 🤖 Groq Llama 3.3 70B 로 70B 급의 reasoning 체감
9. 📖 CoT 의 한계 (환각·비용)
10. 🤖 미션: 논리 퍼즐 풀이 + 스트리밍으로 사고 과정 공개
11. 📝 퀴즈 4문항

### T11. Ch05 레슨 작성 — "AI 에게 팔을 달아주자"

**구성안** (약 35분):
1. 📖 LLM 의 한계 — 날씨 모름, 계산기 필요, DB 접근 불가
2. 📖 Tool Calling 개념 — 함수 스펙을 LLM 에 알려주고, 모델이 호출 의도를 반환
3. 🤖 raw 루프 1단계 — `getWeather` 함수 1개 등록, 호출 → 결과 → 자연어 답변 조립
4. 📖 학생이 루프 직접 짜기 — `response.toolCalls` 읽고 실행하고 다시 chat 호출
5. 🤖 실습: 2개 tool (`getWeather`, `getCurrentTime`) 등록 + 혼합 질문
6. 📖 `chatWithTools` 헬퍼 — 루프 자동화
7. 🤖 같은 실습을 헬퍼로 재작성 — 코드 단순화 경험
8. 📖 `toolChoice: "any"` / `{name}` 로 호출 강제
9. 🤖 미션: 학생이 **자기 tool 하나** 를 정의 (예: 이름 목록에서 랜덤 선택) + 질문 응답에 활용
10. 📝 퀴즈 4문항

### T12. 시뮬레이션 포맷 v2 (녹화/재생 확장)

기존 `Trace` 는 단일 `input/output` 쌍. Phase 2 확장:
```ts
export interface Trace {
  version: 2;   // 기존 1 호환 유지 (replayTrace 에서 버전별 분기)
  input: ChatRequest;
  output: ChatResponse;
  /** 스트리밍 녹화 시 토큰 순서 재현용 (옵션) */
  tokens?: { delay: number; chunk: string }[];
  /** Ch05 tool 루프 녹화 — 각 tool 호출·결과 */
  toolSteps?: { call: ToolCall; result: unknown }[];
  recordedAt: string;
}
```

- `replayTrace` 가 `tokens` 있으면 delay 순서로 `onToken` 방출
- 재생 모드에서 `toolCalls` 도 재현되어야 학생이 루프 작성 과정 체감 가능

### T13. tier/access 업데이트

**Phase 2 레슨은 Pro 로 시작 (ROADMAP 정책)**:
- `FREE_AI_ENG_LESSON_IDS` 에는 추가하지 않음
- Ch03~05 = `ai-eng-03-structured-output` / `ai-eng-04-chain-of-thought` / `ai-eng-05-tool-calling`

### T14. 빌드 / 번들 영향 평가

- zod 런타임 추가: 약 12KB gzip — 수용 가능
- 스트리밍 코드 추가: 미미
- tool loop 헬퍼: <1KB
- 예상 메인 번들 증가: +15~20KB gzip

---

## 📦 의존성 (신규 추가)

```json
{
  "dependencies": {
    "zod": "^3.25.x"
  }
}
```

- 선택: `@google/genai` 의 `Schema` / `FunctionDeclaration` 타입 재사용 가능 — 별도 변환 유틸만
- Groq 는 OpenAI 호환이라 별도 의존성 불필요

---

## 🎯 성공 지표 (Acceptance Criteria)

### 기능 (필수)
- [ ] Ch03 마지막 셀에서 리뷰 3건 입력 → schema 대로 `{sentiment, topics, actionItems[]}` 객체 3개 반환
- [ ] Ch04 에서 `stream:true` 로 수학 문제 풀이 시 토큰 단위로 화면 갱신 (2 tok/s 이상)
- [ ] Ch05 raw 루프 실습: `getWeather("서울")` → 결과 → 자연어 답변 성공
- [ ] Ch05 `chatWithTools` 헬퍼로 동일 실습 재현 — 학생 코드 ≤10 줄
- [ ] Gemini / Groq 모두에서 tool call 동작
- [ ] WebLLM 에서 Ch03 구조화 출력 70% 이상 성공 (best effort)
- [ ] 시뮬레이션 녹화본 재생 시 스트리밍 토큰·tool 호출까지 복원

### 품질 (기대)
- [ ] Ch03 이탈률 < 20% (기초 개념이라 쉬운 성공 경험 필요)
- [ ] Ch04 스트리밍 첫 토큰 지연 < 1초 (Groq), < 2초 (Gemini)
- [ ] Ch05 첫 성공까지 평균 < 10분

### 회귀 방지
- [ ] Ch01/Ch02 기존 경로 무영향 (기존 레슨은 Phase 2 필드 사용 안 함)
- [ ] Python/JS/SQL 트랙 무영향
- [ ] `task: "offline"` 은 여전히 WebLLM, tool 지정 시 명확히 실패

---

## ⚠️ 리스크

| 리스크 | 확률 | 영향 | 대응 |
|---|---|---|---|
| Gemini responseSchema 와 zod 간 변환 경계 케이스 | 🟡 중 | 중 | 초기엔 JSON Schema 직접 입력 허용, zod 는 wrapper 로만 |
| Groq stream chunk 포맷 차이 (OpenAI 호환이긴 하나) | 🟢 낮 | 소 | 어댑터 내 정규화 |
| Tool 실행 중 학생 코드 무한 루프 | 🟡 중 | 중 | `chatWithTools` maxIterations 기본 5 + 타이머 |
| 학생이 tool 에 네트워크·fs 접근 — 보안 | 🟢 낮 | 중 | 기존 브라우저 샌드박스로 충분, 문서에 "학생 본인 환경" 명시 |
| 스트리밍 녹화본 재생 시 타이밍 부정확 | 🟡 중 | 소 | delay 배열 저장, setTimeout chain |
| Phase 1 의 `Trace version: 1` 호환성 | 🟢 낮 | 중 | `replayTrace` 에 version switch, v1 은 계속 동작 |
| WebLLM tool calling 지원 요구 | 🟡 중 | 소 | 명시적 "미지원" + 레슨에서 Gemini 이전 안내 |

---

## 📝 작업 순서 (추천)

1. **T1·T2** 타입 확장 — 이후 모든 작업의 기반 (반나절)
2. **T3** Gemini 어댑터 — Ch03·Ch04·Ch05 셋 다 쓰임 (1일)
3. **T4** Groq 어댑터 — T3 패턴 재사용 (반나절)
4. **T5** WebLLM 어댑터 부분 지원 + 미지원 에러 (반나절)
5. **T6** Tool loop 헬퍼 (반나절)
6. **T7** Thought Stream UI — Ch04 전제 (반나절)
7. **T12** 시뮬레이션 포맷 v2 — 녹화 가능해야 UAT 가능 (반나절)
8. **T9** Ch03 레슨 작성 (1일)
9. **T10** Ch04 레슨 작성 (1일)
10. **T11** Ch05 레슨 작성 (1.5일)
11. **T13** tier/access (5분)
12. **T14** 번들 확인 + 빌드 (30분)
13. 릴리즈

**예상 총 공수**: 6~7 작업일 (≈ 40~50 시간, 4~6 세션)

---

## 🔄 Phase 3 로의 연결

Phase 2 는 Phase 3 의 에이전트 토대:
- **Tool Calling (T6)** → Ch06 단일 에이전트에서 그대로 재사용
- **Thought Stream (T7)** → Agent Trace Viewer 의 기반 컴포넌트
- **Chain-of-Thought (T10)** → 에이전트의 planning 단계 원리
- **JSON Schema (T9)** → Agent 간 메시지 계약 (Ch07 multi-agent)

Phase 2 성공 = Phase 3 가 "새 개념" 없이 **조합만으로** 만들어짐.

---

## 🚦 착수 전 최종 확인 체크리스트

- [ ] `@google/genai` 1.50.0 의 `generateContentStream` / `FunctionDeclaration` 최신 API 재확인
- [ ] `groq-sdk` 1.1.2 의 `stream:true` + tool_calls 실제 응답 shape 확인
- [ ] zod v4 (있는지) 또는 v3.25 결정
- [ ] Ch04 Thought Stream UX 디자인 확정 (커서 모양, 속도 제한)
- [ ] Ch05 녹화 포맷 — tool 실행 결과도 저장할지 (학생이 재생 시 함수 없어도 진행하려면 YES)

이 5가지를 착수 첫 1시간 안에 검증하고 T1 부터.

---

## 🏁 릴리즈 기준

- [ ] T1~T14 완료
- [ ] `npm run build` 통과
- [ ] Ch03~05 각각 실제 Gemini 키로 한 사이클 UAT 통과
- [ ] 녹화본 첨부된 상태로 키 없이 Ch03~05 완주 가능
- [ ] CHANGELOG v4.3.0 작성
- [ ] v4.3.0 태그 + push
