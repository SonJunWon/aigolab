import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * Ch04 — Chain of Thought + 스트리밍.
 *
 * 목표:
 *   - 추론형 문제에서 "바로 답" vs "생각하고 답" 의 정답률 차이 체감
 *   - Let's think step by step 기법 익히기
 *   - stream: true + onToken 으로 "AI 가 생각하는 과정" 실시간 관찰
 *   - Groq Llama 3.3 70B 로 70B 급 reasoning 경험
 *   - 미션: 논리 퍼즐 풀이 Thought Stream
 *
 * 실행: 기본 Gemini. 70B reasoning 실습은 Groq 사용 (키 필요).
 */
export const lesson04: Lesson = {
  id: "ai-eng-04-chain-of-thought",
  language: "ai-engineering",
  track: "beginner",
  order: 4,
  title: "Chain of Thought — 생각을 흘려보며 배운다",
  subtitle: "스트리밍 + CoT 로 AI 의 사고 과정을 실시간 관찰",
  estimatedMinutes: 35,
  cells: [
    // ─────────────────────────────────────────────
    // 1. 오리엔테이션
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `# 🧠 AI 는 "생각" 할 수 있을까?

Ch01~03 까지 LLM 에게 **질문 → 답변** 을 받았어요. 그런데 어려운 추론 문제에선 **그냥 답만 받으면 자주 틀립니다**.

놀라운 사실: LLM 에게 **"생각하고 답해라"** 한 줄만 추가해도 정답률이 훨씬 올라가요.
이게 **Chain of Thought (CoT, 사고의 연쇄)** 기법입니다.

## 이 장에서 배울 것

| # | 주제 |
|---|---|
| 1 | CoT 없이 vs 있이 — **정답률 직접 비교** |
| 2 | **Let's think step by step** 의 마법 한 줄 |
| 3 | **스트리밍** — AI 가 생각하는 걸 토큰 단위로 실시간 관찰 (🧠 Thought Stream UI) |
| 4 | **Groq Llama 3.3 70B** 로 진짜 큰 모델의 추론 |
| 5 | CoT 의 한계 — 환각과 비용 |
| 6 | 미션: 논리 퍼즐 풀이를 스트리밍으로 공개`,
    },

    // ─────────────────────────────────────────────
    // 2. Zero-shot 실패 사례
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🎯 먼저 보자 — "바로 답" 의 한계

아래 고전 추론 문제를 \`temperature: 0.0\` 로 고정해 실행해볼게요.
temperature 가 0 이면 모델이 **항상 같은 답** 을 내요. 여러 번 실행하면 오답이 꾸준히 재현됩니다.

> **문제**: 방에 3명이 있다. 각자 1시간에 인형을 2개씩 만든다.
> 6명이 같은 방에서 4시간 동안 작업하면 인형 몇 개를 만들까?

정답은 **48개** (6명 × 2개 × 4시간). 모델이 어떻게 답하는지 보세요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const problem = \`방에 3명이 있다. 각자 1시간에 인형을 2개씩 만든다.
6명이 같은 방에서 4시간 동안 작업하면 인형 몇 개를 만들까?

답만 숫자로 간결하게 말해.\`;

const response = await chat({
  provider: "gemini",
  temperature: 0.0,
  maxTokens: 50,
  messages: [{ role: "user", content: problem }],
});

console.log("AI 답:", response.text);
console.log("정답은 48개. 맞혔나요?");`,
      hints: [
        "'답만 숫자로' 제약을 걸면 모델이 계산 과정 없이 바로 답 — 틀릴 확률 상승.",
        "temperature: 0 은 결정적이라 같은 답을 반복. 실패가 꾸준히 재현됩니다.",
        "이 문제는 본래 쉬워 보이는데 LLM 이 의외로 자주 틀리는 대표 사례.",
      ],
    },

    // ─────────────────────────────────────────────
    // 3. CoT 소개
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## ✨ 한 줄로 바뀐다 — "단계별로 생각하자"

위에서 틀렸다면 (혹은 맞혔다면 — 가끔은 맞기도 해요), 이번엔 **이 한 줄만 추가** 합니다:

> "**Let's think step by step.**"
> ("단계별로 생각하자.")

이 짧은 지시가 LLM 의 내부 추론 과정을 풀어내 **중간 단계를 출력**, 스스로 답을 검토할 기회를 줍니다.

### 왜 작동하나?
LLM 은 "다음 토큰 확률" 을 연쇄적으로 계산하는 모델이에요. 중간 단계를 **텍스트로 명시** 하면:
1. 그 단계 자체가 다음 토큰의 맥락이 되어 실수를 줄임
2. 잘못된 추론을 스스로 수정할 여지가 생김
3. 인간이 보고 **어디서 틀렸는지** 확인하기도 쉬움

### 실무에선
- GPT-4 클래스의 큰 모델은 내부적으로 CoT 를 자동 적용하기도 함
- 작은 모델일수록 CoT 유도 효과가 큼
- "think step by step" 외에도 다양한 변형 (ReAct, Self-Ask 등)`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 위 문제에 CoT 한 줄만 추가
const problem = \`방에 3명이 있다. 각자 1시간에 인형을 2개씩 만든다.
6명이 같은 방에서 4시간 동안 작업하면 인형 몇 개를 만들까?

단계별로 생각한 뒤 마지막에 "정답: N개" 형태로 답해.\`;

const response = await chat({
  provider: "gemini",
  temperature: 0.0,
  maxTokens: 400,
  messages: [{ role: "user", content: problem }],
});

console.log(response.text);`,
      hints: [
        "maxTokens 를 넉넉히 (400) — CoT 는 중간 단계를 쓰기 때문에 길어져요.",
        "마지막에 '정답: N개' 형식을 지정하면 파싱하기 쉬운 구조가 됨.",
        "같은 프롬프트를 Gemini 대신 task:'offline' (WebLLM 1B) 로 돌려보세요. CoT 효과 차이가 모델 크기에 따라 다름.",
      ],
    },

    // ─────────────────────────────────────────────
    // 4. 스트리밍 소개
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🌊 더 재밌어진다 — 스트리밍으로 "생각을 본다"

지금까지 \`response.text\` 를 **다 받은 뒤** 출력했어요. 그런데 긴 CoT 답변을 2~5초 기다리는 건 지루합니다.

**스트리밍** 을 켜면 모델이 **토큰 하나씩 생성할 때마다** 즉시 UI 로 흘러와요.
- ChatGPT 사용 경험과 동일한 "타이핑" 효과
- 사용자 체감 대기 시간 급감
- **CoT 와 조합** 하면 AI 의 사고 과정이 눈앞에서 펼쳐짐

### 사용법

\`\`\`ts
const response = await chat({
  stream: true,     // ← 이것만 추가
  messages: [...],
});
\`\`\`

이 플랫폼 런타임이 \`stream: true\` 를 감지하면 셀 결과 영역에 자동으로 **🧠 생각 중...** 블록이 나타나고 토큰이 실시간으로 쌓여요 (커서가 깜빡이는 이탤릭 박스).

스트리밍이 끝난 최종 텍스트는 여전히 \`response.text\` 에도 들어있으니 이후 처리는 동일합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// stream: true — 토큰이 실시간으로 셀 결과 영역에 흘러나옵니다
const response = await chat({
  provider: "gemini",
  stream: true,
  temperature: 0.0,
  maxTokens: 500,
  messages: [
    {
      role: "user",
      content: \`방에 3명이 있다. 각자 1시간에 인형을 2개씩 만든다.
6명이 같은 방에서 4시간 동안 작업하면 인형 몇 개를 만들까?

단계별로 천천히 생각한 뒤 마지막에 "정답: N개" 형태로 답해.\`,
    },
  ],
});

// 스트리밍이 끝난 뒤 최종 결과 확인
console.log("\\n── 최종 결과 ──");
console.log("총 길이:", response.text.length, "자");
console.log("소요 시간:", response.latencyMs, "ms");`,
      hints: [
        "셀 실행 즉시 🧠 Thought Stream 박스가 나타나고 토큰이 흘러나옵니다.",
        "stream: true 가 아니면 (또는 생략하면) 기존처럼 전체 응답을 다 받은 뒤 출력.",
        "toString 도 쉬움 — 스트리밍이 끝나면 response.text 에 전체 문자열이 채워져 있음.",
      ],
    },

    // ─────────────────────────────────────────────
    // 5. 70B 모델로 체감
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## ⚡ 진짜 큰 모델 — Groq Llama 3.3 70B

Gemini Flash 도 훌륭하지만 **추론 성능만으로는** Llama 3.3 70B 가 한 단계 위입니다.
Groq 은 이 모델을 **초당 500+ 토큰** 의 속도로 서비스해요 — 스트리밍에 특히 어울립니다.

### Groq 키 필요
Ch02 의 "Step 3: Groq 키 발급" 부분을 따라 \`gsk_...\` 키를 등록했으면 바로 사용 가능.
아직이면 지금 등록 (상단 🔑 버튼) 하고 이어서 실행하세요.

### 어려운 문제로 비교
다음 셀은 논리 퍼즐을 Groq 70B 로 돌립니다. 스트리밍으로 보면 작은 모델과 **사고의 깊이** 차이를 체감할 수 있어요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// Groq Llama 3.3 70B — reasoning 에 최적
const puzzle = \`세 명의 친구 A, B, C 가 있습니다.
- A 는 사과를 좋아하고 바나나를 싫어한다.
- B 는 A 가 싫어하는 것을 좋아한다.
- C 는 B 가 싫어하는 것을 좋아하고, A 가 좋아하는 것도 좋아한다.
- 각자 과일은 사과 또는 바나나 중 하나만 좋아한다 (겹칠 수 있음).

B 가 싫어하는 것은? C 가 좋아하는 과일을 모두 나열하면?

단계별로 논리를 전개하며 답하라.\`;

const response = await chat({
  provider: "groq",
  stream: true,
  temperature: 0.0,
  maxTokens: 800,
  messages: [{ role: "user", content: puzzle }],
});

console.log("\\n── 최종 ──");
console.log("토큰 수:", response.tokensUsed?.output);
console.log("속도:",
  response.tokensUsed && response.latencyMs
    ? Math.round((response.tokensUsed.output * 1000) / response.latencyMs) + " tok/s"
    : "계산 불가"
);`,
      hints: [
        "Groq 키 없으면 'missing-key' 에러 + 자동 모달 오픈. 키 등록 후 재실행.",
        "같은 퍼즐을 provider:'gemini' 로 바꿔 속도·품질 비교. 보통 Groq 가 훨씬 빠름 (500 tok/s).",
        "Groq 이 부담되면 provider:'gemini' 그대로 두고 이 셀의 논리 추론 스타일을 비교.",
      ],
    },

    // ─────────────────────────────────────────────
    // 6. CoT 한계
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## ⚠️ CoT 의 한계 — "자신감 있게 틀림"

CoT 는 만능이 아니에요. 오히려 **그럴듯해 보이는 잘못된 추론** 을 만들어내기도 합니다.

### 자주 발생하는 실패 유형

| 유형 | 설명 |
|---|---|
| **환각 (Hallucination)** | 중간 단계에서 잘못된 사실을 "사실"로 전제 |
| **산수 오류** | 단계는 맞는데 마지막 덧셈에서 틀림 (LLM 은 계산기 아님) |
| **순환 추론** | 결론을 전제로 사용하는 수학적 trickery |
| **비용 급증** | CoT 는 토큰 4~10배 사용 → 요금·레이트 리밋 부담 |

### 방어책
1. **검증 단계 추가** — "마지막에 답을 한 번 더 검토해" 지시
2. **외부 도구 연결** — 산수는 계산기로, 지식은 검색으로 (Ch05 Tool Calling)
3. **여러 번 샘플링 + 다수결** — self-consistency 기법
4. **작은 모델엔 무리하지 않기** — 1B 은 CoT 효과 제한적

### "자신감 있게 틀림" 예시`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 약간 꼬인 산수 — CoT 도 종종 틀림
const tricky = \`한 병에 소주가 360ml 있다.
주전자에 3병 반을 따르고, 그중 15%를 쏟았다.
그리고 새로 1/4병을 더 채웠다.
지금 주전자에 든 양은 몇 ml 인가?

단계별로 생각한 뒤 마지막에 "정답: N ml" 로 답해. 꼭 한 번 더 검토해보고 답해.\`;

const response = await chat({
  provider: "gemini",
  stream: true,
  temperature: 0.0,
  maxTokens: 600,
  messages: [{ role: "user", content: tricky }],
});

// 정답 계산 (JS 가 정확)
const correctAnswer = (3.5 * 360 * 0.85) + (0.25 * 360);
console.log("\\n── 정답 (JavaScript 계산) ──");
console.log(correctAnswer + " ml");`,
      hints: [
        "모델이 단계를 틀리진 않아도 '0.85' 곱하기나 최종 덧셈에서 실수하는 경우가 있어요.",
        "'한 번 더 검토해' 지시는 self-reflection 기법의 단순 버전.",
        "산수 작업이 반복된다면 Tool Calling (Ch05) 에서 '계산기 함수' 를 붙여 해결.",
      ],
    },

    // ─────────────────────────────────────────────
    // 7. 미션
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🎯 미션: 논리 퍼즐 리즈너

학생이 직접 **논리 퍼즐 풀이 함수** 를 작성합니다.

### 요구사항

\`\`\`ts
interface PuzzleResult {
  thinking: string;   // 추론 과정
  answer: string;     // 최종 답
}

async function solvePuzzle(problem: string): Promise<PuzzleResult>;
\`\`\`

### 조건
- **스트리밍 켜기** (\`stream: true\`) — 학생이 실시간으로 모델이 생각하는 걸 본다
- CoT 유도 — "단계별로 생각하라" 지시 포함
- **Groq 70B** 사용 (더 나은 reasoning)
- 응답에서 **추론 부분 / 최종 답** 을 분리해 리턴
  - 단순 규칙: "정답:" 뒤의 줄이 답, 그 앞이 thinking

### 힌트
- system prompt 로 "너는 논리적으로 사고하는 AI" 같은 역할 부여
- 프롬프트 마지막에 \`"\\n\\n정답:"\` 으로 유도 종결 시그니처 넣기
- text.split("정답:") 로 분리, 양쪽 trim
- stream:true 이지만 최종 response.text 에 전체가 담겨있음 — 분리 파싱 가능`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `async function solvePuzzle(problem: string) {
  // TODO: 여기를 채우세요
  //  1) system prompt 로 논리적 AI 역할 설정
  //  2) user 에 problem + "단계별 추론 후 정답: ..." 형식 요청
  //  3) stream: true + provider 'groq' 로 chat 호출
  //  4) response.text 를 "정답:" 으로 split, thinking/answer 분리 반환
  throw new Error("아직 미구현 — 힌트 보고 완성하세요");
}

const puzzle = \`3개의 상자가 있다. 각각 "A", "B", "C" 라벨이 붙어있다.
- 상자 A 라벨은 "금이 여기에 있다"
- 상자 B 라벨은 "금은 A 에 있다"
- 상자 C 라벨은 "금은 B 에 있다"
세 라벨 중 정확히 하나만 진실이다. 금은 어느 상자에 있는가?\`;

const result = await solvePuzzle(puzzle);
console.log("\\n── 최종 답 ──");
console.log(result.answer);`,
      hints: [
        "기본 골격:\\nconst response = await chat({\\n  provider: 'groq',\\n  stream: true,\\n  temperature: 0,\\n  maxTokens: 800,\\n  messages: [\\n    { role: 'system', content: '너는 논리적으로 단계별 추론하는 AI 야. 항상 마지막에 \"정답: ...\" 줄로 마무리해.' },\\n    { role: 'user', content: problem + '\\\\n\\\\n단계별로 추론한 뒤 \"정답: ...\" 로 답해.' },\\n  ],\\n});",
        "text.split('정답:') 로 최대 2조각 분리. 없으면 전체가 thinking, 답은 '알 수 없음'.",
        "Groq 키 없으면 provider 를 gemini 로 바꿔도 동작. 속도는 Gemini 가 좀 느림.",
      ],
      solution: `async function solvePuzzle(problem: string) {
  const response = await chat({
    provider: "groq",
    stream: true,
    temperature: 0.0,
    maxTokens: 800,
    messages: [
      {
        role: "system",
        content:
          '너는 논리적으로 단계별 추론하는 AI 야. 항상 마지막에 "정답: ..." 줄로 마무리해.',
      },
      {
        role: "user",
        content: problem + '\\n\\n단계별로 추론한 뒤 "정답: ..." 로 답해.',
      },
    ],
  });

  const parts = response.text.split("정답:");
  const thinking = parts[0]?.trim() ?? "";
  const answer = parts.length > 1 ? parts[1]!.trim() : "알 수 없음";

  return { thinking, answer };
}

const puzzle = \`3개의 상자가 있다. 각각 "A", "B", "C" 라벨이 붙어있다.
- 상자 A 라벨은 "금이 여기에 있다"
- 상자 B 라벨은 "금은 A 에 있다"
- 상자 C 라벨은 "금은 B 에 있다"
세 라벨 중 정확히 하나만 진실이다. 금은 어느 상자에 있는가?\`;

const result = await solvePuzzle(puzzle);

console.log("\\n── 추론 ──");
console.log(result.thinking);
console.log("\\n── 최종 답 ──");
console.log(result.answer);`,
    },

    // ─────────────────────────────────────────────
    // 8. 정리
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🧭 Ch04 정리 + Ch05 예고

### 오늘 배운 것
- ✅ **Zero-shot 의 한계** — 추론 문제를 자주 틀림
- ✅ **Chain of Thought** — "단계별로 생각하자" 한 줄의 위력
- ✅ **스트리밍** (\`stream:true\`) — AI 가 생각하는 걸 실시간 관찰
- ✅ **Groq Llama 3.3 70B** 로 70B 급 reasoning 체감
- ✅ CoT 의 **한계** — 환각, 산수 오류, 비용 증가
- ✅ 방어책 — 검증 단계 / 외부 도구 / self-consistency

### Ch05 예고 — Tool Calling (AI 에게 팔을 달아주기)
CoT 는 "생각" 이었다면 Ch05 는 **"행동"** 입니다.
- 모델이 **외부 함수** 를 호출할 수 있게
- 날씨 API · 계산기 · 데이터베이스 조회 · 이메일 전송까지
- 학생이 자기 **TypeScript 함수** 를 정의 → AI 가 적절한 순간에 호출
- **\`chatWithTools\`** 헬퍼로 tool 호출 루프 자동화

CoT + Tool Calling 조합이 바로 **Agent (에이전트)** 의 기초 — Phase 3 에서 깊이 파고듭니다.`,
    },
  ],

  quiz: {
    title: "Ch04 — Chain of Thought 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "Chain of Thought 기법의 핵심 아이디어는?",
        options: [
          "모델 크기를 키운다",
          "temperature 를 올린다",
          "모델이 **중간 추론 단계를 텍스트로 출력** 하도록 유도해 각 단계를 다음 토큰의 맥락으로 활용",
          "GPU 를 여러 대 쓴다",
        ],
        correctIndex: 2,
        explanation:
          "CoT 는 모델이 중간 추론을 글로 풀어내게 해서 다음 토큰 생성에 그 과정을 맥락으로 사용하게 만들어요. 단순히 '바로 답' 보다 정답률이 크게 오릅니다.",
      },
      {
        type: "multiple-choice",
        question: "\"Let's think step by step.\" 만 추가해도 효과가 있는 이유는?",
        options: [
          "그 문구 자체에 암호가 숨어있다",
          "LLM 이 'step by step' 계열 훈련 데이터를 많이 봤기 때문에 그 뒤로 단계별 추론 패턴이 자연스럽게 이어짐",
          "API 서버가 특별 플래그로 처리한다",
          "temperature 를 자동으로 낮춘다",
        ],
        correctIndex: 1,
        explanation:
          "해당 문구는 공개 데이터(논문·튜토리얼·코딩 Q&A)에 자주 등장하는 'CoT 유도 표현'. LLM 은 패턴 예측기라 이 신호 이후 단계별 추론 형식을 자연스럽게 따라가는 경향이 있어요.",
      },
      {
        type: "multiple-choice",
        question: "`chat({ stream: true, ... })` 를 호출하면 UI 에 어떤 일이 벌어지나요?",
        options: [
          "셀이 자동으로 재실행됨",
          "셀 결과 영역에 🧠 Thought Stream 박스가 나타나고 토큰이 실시간으로 누적됨 (커서 깜빡임)",
          "WebLLM 모델이 다시 다운로드됨",
          "결과가 파일로 저장됨",
        ],
        correctIndex: 1,
        explanation:
          "런타임의 onToken 콜백이 notebookStore 로 흘러 appendThoughtToken 을 호출합니다. CellOutput 이 이를 보고 'thought' 스트림을 보라색 이탤릭 + 커서 애니메이션으로 렌더링해요.",
      },
      {
        type: "multiple-choice",
        question: "CoT 의 흔한 실패 유형이 아닌 것은?",
        options: [
          "환각 — 중간 단계에 잘못된 사실을 도입",
          "산수 오류 — LLM 은 엄밀한 계산기가 아님",
          "토큰 비용 급증",
          "WebGPU 가 정상 동작하지 않음",
        ],
        correctIndex: 3,
        explanation:
          "WebGPU 는 WebLLM 실행 환경 이슈로, CoT 기법 자체의 실패 유형이 아닙니다. 환각/산수/비용 세 가지가 CoT 를 쓸 때 주의해야 할 대표적 함정.",
      },
      {
        type: "multiple-choice",
        question: "Groq Llama 3.3 70B 를 이 레슨에서 쓰는 이유는?",
        options: [
          "가장 저렴해서",
          "reasoning 능력이 Flash 급보다 한 단계 위고 Groq 은 초당 500+ 토큰의 스트리밍 속도를 제공 → CoT 경험이 드라마틱",
          "한국어만 전문적으로 훈련되었기 때문",
          "이미지 생성을 지원",
        ],
        correctIndex: 1,
        explanation:
          "Groq 의 특징: 70B 급 추론 품질 + 극단적으로 빠른 스트리밍. CoT 는 출력 토큰이 많아 속도 차이가 체감됩니다. Gemini Flash 도 훌륭하지만 추론 복잡도가 올라갈수록 70B 쪽이 안정적.",
      },
      {
        type: "multiple-choice",
        question: "CoT 에서 산수 오류를 줄이는 가장 실질적인 방법은?",
        options: [
          "temperature 를 높인다",
          "더 큰 모델로 바꾼다 — 그것만으로 완전히 해결됨",
          "계산 작업은 외부 도구(계산기 함수)로 위임 — Ch05 Tool Calling",
          "CoT 를 쓰지 않는다",
        ],
        correctIndex: 2,
        explanation:
          "LLM 은 본질적으로 계산기가 아니라 확률적 토큰 예측기입니다. 큰 모델도 긴 자릿수 곱셈에서 실수해요. 믿을 수 있는 계산은 외부 함수로 위임 — 이게 Tool Calling 이 해결하는 문제.",
      },
    ],
  } satisfies Quiz,
};
