# Phase 1 — v4.0.0 상세 설계

**범위**: 통합 LLM SDK 기반 + Ch01 (WebLLM) + Ch02 (Gemini)
**목표 릴리즈**: v4.0.0
**상태**: 📝 기획 완료, 착수 대기
**참조**: [ROADMAP.md](../ROADMAP.md)

---

## 🎯 Phase 1 목표 (Goal-Backward)

**사용자 스토리**:

> 학습자가 AIGoLab 에 처음 들어와서 "AI 엔지니어링" 트랙을 클릭.
> Ch01 을 열면 **설치·가입·키 발급 없이** 브라우저에서 AI 모델이 로드되어 바로 대화 가능 (WebLLM).
> Ch02 로 넘어가면 Google Gemini API 키 발급 가이드가 나오고, **3분 내 첫 Gemini 호출** 을 성공적으로 경험.

**이걸 달성하면 Phase 1 완료.** 복잡해 보이지만 실은 다음 3가지를 만드는 일:

1. **LLM 통합 SDK 기반** — 이후 11강이 모두 이 위에서 작동
2. **Ch01 WebLLM 체험 레슨** — 시장 차별화 포인트 ("설치 없음")
3. **Ch02 Gemini 프롬프트 레슨** — BYOK 표준 흐름 확립

---

## 📐 아키텍처 개요

```
┌────────────────────────────────────────────────────────┐
│                    Lesson Cell (기존)                   │
│  markdown / code / quiz                                 │
└──────────────────┬─────────────────────────────────────┘
                   │ 신규: import { chat } from '@aigolab/llm'
                   ↓
┌────────────────────────────────────────────────────────┐
│              @aigolab/llm  — 통합 SDK                   │
│                                                         │
│   chat({ messages, task, provider? })                  │
│                                                         │
│   ┌──────────────────────────────────────────────┐    │
│   │          Router (task → provider)             │    │
│   └──────────────────────────────────────────────┘    │
│            ↓              ↓              ↓             │
│   ┌────────────┐  ┌───────────┐  ┌──────────────┐     │
│   │  Gemini    │  │   Groq    │  │   WebLLM     │     │
│   │  Adapter   │  │  Adapter  │  │   Adapter    │     │
│   └────────────┘  └───────────┘  └──────────────┘     │
│         │               │                │             │
└─────────┼───────────────┼────────────────┼────────────┘
          │               │                │
          ↓               ↓                ↓
   Google API        Groq API       브라우저 내 실행
    (학생 키)         (학생 키)      (@mlc-ai/web-llm)
```

### 핵심 설계 원칙
- **Provider 추상화**: 학생 코드에 provider 이름이 절대 직접 노출되지 않음 (task 기반 호출)
- **브라우저 전용**: 서버 사이드 프록시 없음 — 모든 호출은 학생 브라우저에서 직접
- **키는 로컬 only**: API 키는 localStorage 에 **AES 암호화** 저장, 네트워크 전송 없음
- **녹화/재생**: 모든 호출에 `simulation?: Trace` 옵션 — 키 없어도 녹화본 재생 가능

---

## 🧩 Task Breakdown

### T1. 통합 SDK 패키지 구조 (src/lib/llm/)

**파일 트리**:
```
src/lib/llm/
├── index.ts                  # public API (chat, embed, 등)
├── types.ts                  # Message, ChatRequest, Trace 등
├── router.ts                 # task → provider 라우팅
├── keys.ts                   # 암호화 localStorage 키 관리
├── simulation.ts             # Trace 재생 로직
├── providers/
│   ├── gemini.ts
│   ├── groq.ts
│   ├── webllm.ts
│   └── base.ts               # ProviderAdapter 인터페이스
└── routes.ts                 # task → provider 맵 (추후 yaml 전환 가능)
```

**핵심 인터페이스**:
```ts
// types.ts
export type Role = "system" | "user" | "assistant";
export interface Message { role: Role; content: string }

export interface ChatRequest {
  messages: Message[];
  task?: "fast" | "reasoning" | "multimodal" | "offline";
  provider?: "gemini" | "groq" | "webllm";   // 강제 지정 (비교 실습용)
  temperature?: number;
  maxTokens?: number;
  simulation?: Trace;                         // 키 없을 때 재생할 녹화
}

export interface ChatResponse {
  text: string;
  provider: string;
  model: string;
  tokensUsed?: { input: number; output: number };
  latencyMs: number;
  raw?: unknown;                              // 디버깅용
}

export interface Trace {
  version: 1;
  input: ChatRequest;
  output: ChatResponse;
  recordedAt: string;
}
```

**라우터 구현**:
```ts
// router.ts
const DEFAULT_ROUTES: Record<string, Array<Provider>> = {
  fast:        ["groq", "gemini"],
  reasoning:   ["groq", "gemini"],
  multimodal:  ["gemini"],
  offline:     ["webllm"],
};

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  if (req.simulation) return replayTrace(req.simulation);
  const providers = req.provider
    ? [req.provider]
    : DEFAULT_ROUTES[req.task ?? "fast"];

  let lastErr: unknown;
  for (const p of providers) {
    try {
      return await adapters[p].chat(req);
    } catch (e) {
      lastErr = e;
      continue;   // 다음 provider 시도
    }
  }
  throw new Error(`All providers failed: ${lastErr}`);
}
```

### T2. Provider 어댑터 3종

#### T2-1. Gemini 어댑터 (`providers/gemini.ts`)
- 의존성: `@google/generative-ai` (브라우저 호환)
- 키 소스: `keys.get("gemini")`
- 모델: 기본 `gemini-2.0-flash`
- 특이사항: 시스템 메시지가 별도 `systemInstruction` 필드

#### T2-2. Groq 어댑터 (`providers/groq.ts`)
- 의존성: `groq-sdk` (fetch 기반, 브라우저 OK)
- 키 소스: `keys.get("groq")`
- 모델: 기본 `llama-3.3-70b-versatile`
- 특이사항: OpenAI 호환 포맷이라 변환 단순

#### T2-3. WebLLM 어댑터 (`providers/webllm.ts`)
- 의존성: `@mlc-ai/web-llm`
- 키 불필요
- 모델: 기본 `Llama-3.2-1B-Instruct-q4f16_1-MLC` (1GB)
- 특이사항:
  - 첫 호출 시 모델 다운로드 (1~2분, IndexedDB 캐시)
  - 진행률 콜백을 UI 에 전파해야 함 (별도 이벤트)
  - WebGPU 필요 — 미지원 환경 감지 시 fallback 에러

### T3. 키 관리 (src/lib/llm/keys.ts)

- **저장**: `localStorage['aigolab.llm.keys.v1']`
- **암호화**: Web Crypto API AES-GCM, **디바이스 고유 키** 파생 (IndexedDB 에 salt 저장)
- **이유**: 평문 저장 시 XSS 한 번에 키 유출 — 암호화는 완벽한 방어는 아니지만 방어 심도 하나 추가
- **API**:
  ```ts
  await keys.set("gemini", "AIza...");
  const key = await keys.get("gemini");
  await keys.remove("gemini");
  keys.list(); // ["gemini", "groq"]
  ```
- **마이그레이션**: 키가 없으면 Ch02 에서 첫 실행 시 **키 입력 모달** 자동 오픈

### T4. 키 입력 UI 컴포넌트

- 경로: `src/components/llm/KeySetupModal.tsx`
- 트리거: 통합 SDK 호출 시 키 없음 에러 → 모달 자동 오픈
- 구성:
  - 3단계 캐러셀 (Gemini 가이드, Groq 가이드, 완료 확인)
  - 각 단계에 스크린샷 + 발급 링크 + 붙여넣기 입력
  - "나는 키 없이 시뮬레이션 모드로" 버튼
- 검증:
  - Gemini 키 패턴: `/^AIza[A-Za-z0-9-_]{20,}$/`
  - Groq 키 패턴: `/^gsk_[A-Za-z0-9]{30,}$/`
  - 붙여넣은 즉시 1회 테스트 호출로 유효성 확인

### T5. Ch01 — "AI 가 브라우저에 산다" (WebLLM)

**파일**: `src/content/python/... 아님 — 신규 트랙 경로 필요`

**⚠️ 신규 트랙 등록 필요**:
```
src/content/ai-engineering/
├── index.ts
├── 01-webllm-intro.ts
└── 02-gemini-prompting.ts
```

그리고 `src/content/languages.ts` 에 신규 트랙 추가:
```ts
{
  id: "ai-engineering",
  name: "AI 엔지니어링",
  description: "브라우저 내 AI 부터 Agent·RAG 까지. 무료 티어만으로 12강 완주.",
  estimatedHours: 15,
  tier: "pro",   // Ch01~02 는 free, 나머지는 pro (tier.ts 확장 필요)
}
```

**Ch01 구성안**:
1. markdown: "설치 없이 AI 를 돌려봅시다"
2. code: WebLLM 로드 (진행률 표시)
3. markdown: "모델이 여러분 브라우저 안에 있어요"
4. code: 첫 chat 호출 — "안녕" → 응답
5. markdown: 파라미터 탐구 (temperature, max_tokens)
6. code: 같은 질문 · 다른 temperature — 결과 비교
7. markdown: 브라우저 내 실행의 장단점
8. code: 자유 실험
9. quiz: 3~4문항

**의존성**:
- `@mlc-ai/web-llm`: ^0.2.x (2026 기준 최신 확인 필요)
- **코드 셀에서 이 패키지가 import 가능해야** — 현재 Pyodide 환경은 JS 번들에서 직접 import 불가. **새 유형의 셀 타입 또는 Python-JS bridge 필요**.

### T6. Ch02 — 프롬프트 엔지니어링 기초 (Gemini)

**구성안**:
1. markdown: "Gemini 키 5분 발급" 가이드 + 링크
2. code: 첫 호출 — `chat({ messages: [{role:"user", content:"안녕"}], provider:"gemini" })`
3. markdown: System prompt 의 힘
4. code: system prompt 차이로 답변 스타일 바뀌는 실습
5. markdown: Few-shot prompting
6. code: 감정 분류를 예제 3개로 가르치기
7. markdown: 온도와 창의성
8. code: temperature 0.0 vs 1.0 비교
9. markdown: 실전 팁 (명확성·컨텍스트·제약)
10. 미션: 제품 설명 생성기 구현
11. quiz

### T7. 신규 셀 타입 — LLM 셀

기존 셀 타입: `markdown`, `code` (Pyodide Python), `quiz`
**필요한 신규**: `llm-code` — Python 이 아니라 **TypeScript/JS 런타임** 에서 `@aigolab/llm` 을 호출

**결정 사항**:
- **옵션 A**: 셀 type 확장 — `{ type: "llm-code", source: string, language: "ts" }`
  → 에디터는 Monaco TS 모드, 실행은 동적 import + eval (샌드박스)
- **옵션 B**: 기존 code 셀 유지하고, Pyodide 에서 브라우저 JS 함수 bridge 호출
  → Pyodide 의 `pyodide.runPythonAsync` 내에서 `js.aigolab.chat(...)` 식으로
- **추천**: **옵션 A** — AI 엔지니어링 실무는 TypeScript 가 주류, Python 브릿지는 2단계 복잡성

### T8. 타입 정의 확장 (src/types/lesson.ts)

```ts
export type CellType = "markdown" | "code" | "llm-code" | "quiz";

export interface LlmCodeCell {
  type: "llm-code";
  source: string;           // TypeScript 코드
  language: "typescript";
  // 학생이 실행 전 키 없을 때 대체 재생용
  simulation?: {
    trace: Trace;
    note?: string;          // "이 셀은 녹화본 재생 중입니다"
  };
  hints?: string[];
  solution?: string;
}
```

### T9. LLM 셀 실행 환경

- 경로: `src/runtime/llm-runtime.ts`
- 방식:
  1. 학생 코드를 TypeScript 컴파일 (TS + esbuild-wasm)
  2. 실행 컨텍스트에 `chat`, `embed` 등 `@aigolab/llm` API 를 주입
  3. `console.log` 출력을 셀 결과 영역에 스트리밍
  4. Trace 기록 — 성공한 실행은 simulation 녹화본으로 내보낼 수 있게
- 안전장치:
  - 네트워크 요청은 승인된 도메인만 (gemini, groq, webllm CDN)
  - 비용 발생 호출 전 확인 프롬프트 옵션

### T10. 시뮬레이션 녹화/재생

- **녹화 (강사용)**:
  - 관리자 모드에서 "Record" 토글
  - 셀 실행 시 모든 request/response 를 Trace 로 저장
  - JSON 파일 다운로드 → lesson 에 첨부
- **재생 (학생용)**:
  - `chat({ simulation: trace })` 호출 시 실제 네트워크 안 타고 `trace.output` 반환
  - 지연 시간(latencyMs) 만큼 `setTimeout` 으로 현실감
  - UI 에 "📼 시뮬레이션 재생 중" 배지 표시

---

## 📦 의존성 (신규 추가)

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.x",
    "groq-sdk": "^0.x",
    "@mlc-ai/web-llm": "^0.2.x"
  },
  "devDependencies": {
    "esbuild-wasm": "^0.x"
  }
}
```

**주의사항**:
- `@mlc-ai/web-llm` 은 WASM 큼 (5~10MB) — 동적 import (`await import(...)`) 로 Ch01 열 때만 로드
- 번들 사이즈 현재 1.9MB (gzip 583KB) → Phase 1 후 예상 2.2MB 수준
- `esbuild-wasm` 은 LLM 셀 컴파일용, 필요 시 로드

---

## 🎯 성공 지표 (Acceptance Criteria)

### 기능 (필수)
- [ ] 사용자가 키 없이 Ch01 열고 WebLLM 모델 다운로드 완료 후 첫 응답 수신
- [ ] 사용자가 Ch02 에서 키 입력 모달 거쳐 Gemini 키 저장
- [ ] 저장된 Gemini 키로 `chat()` 호출 성공, 응답 수신
- [ ] 네트워크 끊긴 상태에서 Ch01 WebLLM 은 여전히 작동 (캐시 후)
- [ ] 키 없이 Ch02 접근 시 시뮬레이션 녹화본 재생으로 진도 가능
- [ ] 통합 SDK 의 `task:"fast"` 호출이 Groq 와 Gemini 간 자동 페일오버
- [ ] Monaco 에디터에서 TS 코드 셀 편집·실행 가능

### 성능 (기대)
- [ ] Ch01 WebLLM 첫 다운로드: 2분 이내 (1GB 모델 기준, 평균 인터넷)
- [ ] WebLLM 재방문: 3초 이내 준비 완료 (IndexedDB 캐시)
- [ ] Gemini 첫 응답 지연: 2초 이내
- [ ] 플랫폼 번들 추가 크기: +500KB 이내 (핵심 SDK), WebLLM 은 동적

### UX (기대)
- [ ] 키 발급 가이드가 캡처 포함되어 5분 내 완료 가능
- [ ] 모델 다운로드 중 **진행률 프로그레스 바** 표시
- [ ] LLM 응답이 **토큰 단위 스트리밍** 되어 살아있는 느낌
- [ ] 에러 메시지가 친절 (429 → "일일 한도 초과 — 대체 provider 로 자동 전환 중")

---

## ⚠️ 리스크

| 리스크 | 확률 | 영향 | 대응 |
|---|---|---|---|
| `@mlc-ai/web-llm` API 가 2026년 기준 변경됨 | 🟡 중 | 중 | 착수 직후 실제 설치·동작 확인 후 버전 고정 |
| WebGPU 미지원 브라우저 (Safari 구버전) | 🟡 중 | 소 (사용자 일부만) | fallback 메시지 + Chrome 권장 안내 |
| Gemini 지역 제한 사용자 | 🟢 낮 | 소 | Groq 를 대체로 자동 선택 |
| TS 셀 타입 추가가 기존 lesson 로더와 충돌 | 🟡 중 | 중 | 기존 `CellType` 에 추가만 하고 런타임 switch 는 안전한 default |
| localStorage 크로스 오리진 이슈 | 🟢 낮 | 소 | Vercel 배포 한 도메인이므로 무관 |
| esbuild-wasm 번들 크기 | 🟡 중 | 중 | Phase 2~5 까지 LLM 셀 없이는 로드 안 함 |

---

## 📝 작업 순서 (추천)

1. **T1** 통합 SDK 뼈대 + T2-3 WebLLM 어댑터 (하나라도 끝까지 동작시켜 검증)
2. **T2-1** Gemini 어댑터 (실제 키로 호출 성공)
3. **T3** 키 관리 모듈
4. **T4** 키 입력 모달 UI
5. **T8** lesson 타입 확장
6. **T7·T9** LLM 셀 타입 + 런타임
7. **T10** 시뮬레이션 기반 (녹화/재생 최소 버전)
8. **T5** Ch01 WebLLM 레슨 작성 + 녹화
9. **T6** Ch02 Gemini 레슨 작성 + 녹화
10. 빌드 검증 + 버전 bump + 릴리즈

---

## 🔄 Phase 2 로의 연결

Phase 1 이 정립하는 기반 위에서 Phase 2 가 자연스럽게 얹힘:
- **T1~T3** 통합 SDK → Phase 2 의 Ch03~05 가 동일 API 사용
- **T7~T9** LLM 셀 → Phase 2 에서 Tool calling 셀 타입 추가 확장
- **T10** 시뮬레이션 → Phase 2~5 전 챕터에서 재사용

Phase 1 성공 = 남은 4 phases 를 안정적으로 빌드할 수 있는 토대.

---

## 🚦 착수 전 마지막 확인

1. **WebLLM 버전** — 2026년 4월 기준 `@mlc-ai/web-llm` 안정 버전이 Llama 3.2 1B 지원 확인 필요 (npm 페이지 체크)
2. **Gemini SDK 브라우저 호환** — `@google/generative-ai` 공식이 브라우저 번들 제공하는지 (Node 전용일 경우 `@google/genai` 검토)
3. **Groq SDK** — 브라우저 `dangerouslyAllowBrowser: true` 플래그 명시 필요
4. **라이선스** — WebLLM 이 가져오는 Llama 모델은 Meta 라이선스 — 교육 목적 OK 이지만 약관 링크 표시
5. **tier.ts 확장 규모** — 기존 구독 모델 확장 범위 결정 (새 tier 추가 vs 기존 재활용)

이 5가지를 착수 첫 30분 안에 확인하고 시작.

---

## ✅ 2026-04-15 사전 확인 결과

### 🔴 [1] WebLLM — 확정
- **버전**: `@mlc-ai/web-llm` **^0.2.82** 고정
- **Llama 3.2 1B 모델 ID (확정)**:
  - 기본: `Llama-3.2-1B-Instruct-q4f16_1-MLC` (879 MB VRAM, q4f16 권장)
  - 옵션: `Llama-3.2-1B-Instruct-q4f32_1-MLC` (1128 MB, 정밀도 우선)
  - 옵션: `Llama-3.2-3B-Instruct-q4f16_1-MLC` (Ch11 비교용)
- **Llama 3.2 3B 도 지원** — Ch11 "LLM 생태계 비교" 에서 1B vs 3B 체감 실습 가능

### 🔴 [2] Google Gemini SDK — **PLAN 수정 필수**
- ⚠️ **중대 변경**: `@google/generative-ai` 는 **2025-11-30 부로 DEPRECATED**
- ✅ **신 SDK**: **`@google/genai`** (통합 GenAI SDK, 최신 v1.48.0)
- **2026-06-24 이후** `@google/generative-ai` 완전 제거 예정
- 우리는 **처음부터 `@google/genai` 로 시작** (마이그레이션 비용 제거)
- 브라우저 호환: 공식 지원, fetch 기반

**T2-1 Gemini 어댑터 수정사항**:
```ts
// 변경 전 (PLAN 초안)
import { GoogleGenerativeAI } from "@google/generative-ai";

// 변경 후 (확정)
import { GoogleGenAI } from "@google/genai";
```

### 🟡 [3] Groq SDK — 확정 (주의 필요)
- **패키지**: `groq-sdk` (공식)
- **브라우저 사용**: `dangerouslyAllowBrowser: true` 플래그 필수
- **보안 경고**: SDK 가 명시적으로 "클라이언트 코드에 비밀 키 노출" 경고
- **대응**: 키 입력 모달에 **"Groq 키는 브라우저에 저장되며, 유출 시 타인이 여러분 계정으로 호출 가능" 경고 문구** 추가
- **기본 모델**: `llama-3.3-70b-versatile` (128K 컨텍스트, tool use, JSON mode 지원)

```ts
import Groq from "groq-sdk";
const client = new Groq({
  apiKey: userKey,
  dangerouslyAllowBrowser: true,
});
```

### 🟢 [4] Llama 3.2 라이선스 — OK, 의무사항 있음
- **상용 + 교육 사용 모두 허용** (Community License)
- **필수 의무 2가지**:
  1. **"Built with Llama" 배지** 를 웹사이트에 prominently 표시
  2. **Llama Community License 링크·사본** 제공
- **MAU 7억 제한**: 우리는 해당 없음 (완전 무관)

**UI 추가 요구사항 (T4·T5 에 반영)**:
- Ch01 WebLLM 셀 결과 영역 하단에 **"Built with Llama 🦙"** 배지
- footer 또는 Ch01 마크다운 말미에 **라이선스 링크**
- 복사 가능한 attribution 텍스트:
  > "이 레슨은 Meta 의 Llama 3.2 모델을 사용합니다 — [Built with Llama]."

### 🟢 [5] tier.ts 확장 전략 — 구조 검토 완료

**현재 구조** (src/content/tier.ts):
- `isLessonPro(lang, track)` 가 **lang === "python"** 만 보는 제한적 구조
- `FREE_COURSE_IDS` / `FREE_PROJECT_IDS` 는 Set 기반 하드코딩

**필요한 확장** — 2단계 접근:

**단계 1: Language 타입 확장** (src/types/lesson.ts)
```ts
// 변경 전
export type Language = "python" | "javascript" | "sql";

// 변경 후
export type Language = "python" | "javascript" | "sql" | "ai-engineering";
```

**단계 2: isLessonPro 로직 확장** (src/content/tier.ts)
```ts
// AI 엔지니어링 트랙의 Ch03~12 는 pro, Ch01~02 는 free
const FREE_AI_ENG_LESSON_IDS: ReadonlySet<string> = new Set([
  "ai-eng-01-webllm-intro",
  "ai-eng-02-gemini-prompting",
]);

export function isLessonPro(lang: Language, track: Track, lessonId?: string): boolean {
  if (lang === "python" && track !== "beginner") return true;
  if (lang === "ai-engineering" && lessonId) {
    return !FREE_AI_ENG_LESSON_IDS.has(lessonId);
  }
  return false;
}
```

**호환성**: `lessonId` 가 optional 파라미터이므로 기존 호출부 수정 불필요 — 점진적 마이그레이션 가능.

---

## 🔧 PLAN 확정 변경 요약

이번 확인으로 다음 3개가 **확정 변경**:

| 항목 | 변경 전 (초안) | 변경 후 (확정) |
|---|---|---|
| Gemini 패키지 | `@google/generative-ai` | **`@google/genai`** |
| WebLLM 기본 모델 | (미정) | **`Llama-3.2-1B-Instruct-q4f16_1-MLC`** |
| Llama 의무사항 | (미반영) | **"Built with Llama" 배지 + 라이선스 링크** |

의존성 섹션도 다음으로 갱신:
```json
{
  "dependencies": {
    "@google/genai": "^1.48.0",
    "groq-sdk": "^0.x",
    "@mlc-ai/web-llm": "^0.2.82"
  }
}
```

---

## 🚀 착수 준비 완료

5개 확인 모두 통과. **T1 부터 코딩 착수 가능**. 다음 세션 시작 시:
1. 이 PLAN.md 의 "Task Breakdown" 순서대로
2. 확정된 패키지 버전으로 `npm install`
3. `src/lib/llm/` 디렉토리부터 생성

**예상 소요**: 핵심 SDK (T1~T4) 8~12 시간, Ch01/Ch02 레슨 (T5~T6) 6~8 시간, LLM 셀 런타임 (T7~T10) 10~16 시간. 총 24~36 시간 = 3~5 개 작업 세션.
