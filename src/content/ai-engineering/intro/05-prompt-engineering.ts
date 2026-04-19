import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson05: Lesson = {
  id: "ai-intro-05-prompt-engineering",
  language: "ai-engineering",
  track: "intro",
  order: 5,
  title: "프롬프트 엔지니어링",
  subtitle: "AI에게 잘 부탁하는 기술",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 프롬프트 엔지니어링

같은 AI에게 같은 질문을 해도, **어떻게 물어보느냐**에 따라 답이 완전히 달라집니다.

AI에게 **더 좋은 답**을 받기 위해 **질문을 잘 만드는 기술**을
**프롬프트 엔지니어링(Prompt Engineering)** 이라고 해요.

이번 강의에서는 AI에게 잘 부탁하는 4가지 핵심 기술을 배웁니다.

## 이번 강의에서 배울 것
| # | 기술 | 핵심 |
|---|------|------|
| 1 | 구체적으로 말하기 | 막연한 질문 → 정확한 질문 |
| 2 | 배경 정보 주기 | AI가 상황을 이해하도록 |
| 3 | 원하는 형식 지정하기 | 표, 목록, 단계별 등 |
| 4 | 단계별로 생각시키기 | 복잡한 문제를 나눠서 풀기 |`,
    },
    {
      type: "markdown",
      source: `## 기술 1: 구체적으로 말하기

AI에게 막연하게 물어보면 막연한 답이 돌아옵니다.

| ❌ 막연한 프롬프트 | ✅ 구체적인 프롬프트 |
|------------------|-------------------|
| "운동에 대해 알려줘" | "초등학생이 집에서 할 수 있는 10분 스트레칭 루틴 알려줘" |
| "맛있는 거 추천해줘" | "초등학생이 직접 만들 수 있는 간단한 간식 3가지 추천해줘" |
| "공부 도와줘" | "초등학교 5학년 수학 분수의 덧셈을 예제와 함께 설명해줘" |`,
    },
    {
      type: "markdown",
      source: `### 실습 1: 막연한 질문 vs 구체적인 질문`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 먼저 막연한 질문을 해봅시다
const vague = await chat({
  messages: [
    { role: "user", content: "동물에 대해 알려줘" }
  ],
});

console.log("=== 막연한 질문 ===");
console.log(vague.text);

// 이제 구체적인 질문을 해봅시다
const specific = await chat({
  messages: [
    { role: "user", content: "북극에 사는 동물 3가지를 골라서, 각각 이름, 특징, 추위를 견디는 비결을 간단히 알려줘." }
  ],
});

console.log("\\n=== 구체적인 질문 ===");
console.log(specific.text);`,
      hints: [
        "막연한 질문은 너무 넓은 답이 나오고, 구체적인 질문은 딱 원하는 답이 나와요!",
        "구체적으로 만드는 팁: 누가, 무엇을, 어떻게, 몇 개 — 이런 정보를 넣어보세요.",
      ],
    },
    {
      type: "markdown",
      source: `## 기술 2: 배경 정보(맥락) 주기

AI는 나에 대해 아무것도 몰라요. 그래서 **배경 정보를 알려주면** 훨씬 좋은 답을 줍니다.

예시:
- ❌ "영어 공부 방법 알려줘"
- ✅ "나는 초등학교 5학년이고, 영어 단어를 잘 외우지 못해. 재미있게 영어 단어를 외우는 방법 3가지 알려줘"`,
    },
    {
      type: "markdown",
      source: `### 실습 2: 배경 정보를 넣어서 질문하기`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 배경 정보 없는 질문
const noContext = await chat({
  messages: [
    { role: "user", content: "책 추천해줘" }
  ],
});

console.log("=== 배경 정보 없이 ===");
console.log(noContext.text);

// 배경 정보가 있는 질문
const withContext = await chat({
  messages: [
    { role: "user", content: "나는 초등학교 4학년이고 모험 이야기를 좋아해. 해리포터는 이미 읽었어. 비슷한 느낌의 재미있는 판타지 소설 3권 추천해줘. 각각 왜 재미있는지도 한 줄로 알려줘." }
  ],
});

console.log("\\n=== 배경 정보 포함 ===");
console.log(withContext.text);`,
      hints: [
        "배경 정보를 주면 AI가 나에게 맞는 맞춤형 답변을 해줘요.",
        "나이, 수준, 관심사, 이미 아는 것 등을 알려주면 좋아요.",
      ],
    },
    {
      type: "markdown",
      source: `## 기술 3: 원하는 형식 지정하기

AI에게 **답변의 형식**을 정해줄 수 있어요.

| 지정 방법 | 예시 |
|----------|------|
| 목록으로 | "5가지를 번호 매겨서 알려줘" |
| 표로 | "표 형식으로 정리해줘" |
| 짧게 | "3문장 이내로 요약해줘" |
| 비교 형태 | "장점과 단점을 나란히 비교해줘" |
| 특정 톤으로 | "초등학생도 이해할 수 있게 쉬운 말로" |`,
    },
    {
      type: "markdown",
      source: `### 실습 3: 형식을 지정해서 질문하기`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 형식을 지정해서 깔끔한 답을 받아봅시다
const response = await chat({
  messages: [
    { role: "user", content: "태양계의 행성 8개를 표로 정리해줘. 열은 '행성 이름', '태양에서의 순서', '특징 한 줄'로 해줘. 초등학생이 이해할 수 있는 쉬운 말로 써줘." }
  ],
});

console.log(response.text);`,
      hints: [
        "'표로', '목록으로', '3문장으로' 같은 형식 지정을 빼보고 결과를 비교해보세요.",
        "형식을 지정하면 AI의 답이 훨씬 깔끔하고 읽기 좋아져요!",
      ],
    },
    {
      type: "markdown",
      source: `## 기술 4: 단계별로 생각시키기

복잡한 문제는 AI에게 **"단계별로 생각해봐"** 라고 말하면 더 정확한 답이 나와요.

이것을 **'Chain of Thought (생각의 사슬)'** 기법이라고 합니다.

| ❌ 바로 답을 요구 | ✅ 단계별로 생각시키기 |
|----------------|-------------------|
| "답이 뭐야?" | "단계별로 풀어봐" |
| "맞아, 틀려?" | "이유를 설명하면서 답해줘" |`,
    },
    {
      type: "markdown",
      source: `### 실습 4: 단계별 사고 비교`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 바로 답을 요구하는 경우
const direct = await chat({
  messages: [
    { role: "user", content: "사과 3개에 2000원이면 사과 12개는 얼마야? 답만 말해줘." }
  ],
});

console.log("=== 바로 답 요구 ===");
console.log(direct.text);

// 단계별로 생각시키는 경우
const stepByStep = await chat({
  messages: [
    { role: "user", content: "사과 3개에 2000원이면 사과 12개는 얼마야? 단계별로 풀이 과정을 보여주면서 답해줘." }
  ],
});

console.log("\\n=== 단계별 풀이 ===");
console.log(stepByStep.text);`,
      hints: [
        "'단계별로 생각해봐'를 추가하면 AI가 중간 과정을 보여주면서 더 정확하게 답해요.",
        "수학 문제뿐만 아니라 복잡한 질문에도 이 기술이 효과적이에요!",
      ],
    },
    {
      type: "markdown",
      source: `## 자유 실습: 4가지 기술 모두 활용하기

배운 4가지 기술을 모두 합쳐서 프롬프트를 만들어보세요!

1. **구체적으로** — 무엇을 원하는지 명확히
2. **배경 정보** — 나의 상황 설명
3. **형식 지정** — 표, 목록, 짧게 등
4. **단계별 사고** — 과정을 보여달라고`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 4가지 기술을 모두 활용한 프롬프트 예시
const response = await chat({
  messages: [
    { role: "user", content: "나는 초등학교 5학년이고 여름방학 독후감 숙제가 있어. (배경 정보)\\n\\n'어린 왕자'를 읽었는데, 이 책의 핵심 메시지를 3가지로 정리해줘. (구체적으로 + 형식 지정)\\n\\n각 메시지가 왜 중요한지 이유도 단계적으로 설명해줘. (단계별 사고)\\n\\n초등학생 눈높이에 맞게 쉬운 말로 써줘." }
  ],
});

console.log(response.text);`,
      hints: [
        "책 제목이나 상황을 자신의 것으로 바꿔보세요!",
        "4가지 기술을 모두 넣으면 정말 좋은 답변을 받을 수 있어요.",
      ],
    },
    {
      type: "markdown",
      source: `# Ch05 정리

| 기술 | 핵심 | 예시 키워드 |
|------|------|-----------|
| 구체적으로 말하기 | 막연한 질문 → 정확한 질문 | "3가지", "초등학생 수준으로" |
| 배경 정보 주기 | AI가 나의 상황을 이해하도록 | "나는 ~이고", "~를 이미 알아" |
| 형식 지정하기 | 원하는 모양으로 답 받기 | "표로", "목록으로", "3문장으로" |
| 단계별 사고 | 복잡한 문제를 나눠서 풀기 | "단계별로", "이유를 설명하면서" |

**프롬프트 엔지니어링 = AI를 잘 쓰는 핵심 능력!**
이 4가지만 잘 써도 AI의 답변 품질이 확 달라집니다.

**다음 강의**: AI 종류 알아보기 — ChatGPT, Gemini, Claude... 뭐가 다를까?`,
    },
  ],

  quiz: {
    title: "Ch05 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "'프롬프트 엔지니어링'이란 무엇인가요?",
        options: [
          "AI를 만드는 프로그래밍 기술",
          "AI에게 더 좋은 답을 받기 위해 질문을 잘 만드는 기술",
          "AI의 속도를 빠르게 만드는 기술",
          "AI에게 그림을 그리게 하는 기술",
        ],
        correctIndex: 1,
        explanation:
          "프롬프트 엔지니어링은 AI에게 질문(프롬프트)을 잘 작성해서 원하는 답을 효과적으로 얻는 기술입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "다음 중 가장 좋은 프롬프트는 무엇인가요?",
        options: [
          "뭔가 알려줘",
          "과학에 대해 알려줘",
          "초등학교 5학년이 이해할 수 있게, 물이 끓는 원리를 3단계로 설명해줘",
          "과학 재미있어?",
        ],
        correctIndex: 2,
        explanation:
          "좋은 프롬프트는 구체적(물이 끓는 원리), 배경 정보(초등 5학년), 형식 지정(3단계), 쉬운 말 요청이 포함되어 있습니다.",
      },
      {
        type: "multiple-choice",
        question:
          "AI에게 복잡한 문제를 풀게 할 때, 정확도를 높이려면 어떻게 해야 하나요?",
        options: [
          "빨리 답하라고 재촉한다",
          "같은 질문을 여러 번 반복한다",
          "'단계별로 풀어봐'라고 요청해서 과정을 보여달라고 한다",
          "질문을 최대한 짧게 줄인다",
        ],
        correctIndex: 2,
        explanation:
          "'단계별로 생각해봐(Chain of Thought)' 기법을 사용하면 AI가 중간 과정을 보여주면서 더 정확한 답을 내놓을 가능성이 높아집니다.",
      },
      {
        type: "multiple-choice",
        question:
          "'배경 정보(맥락) 주기'가 중요한 이유는?",
        options: [
          "AI가 내 이름을 기억하게 하려고",
          "AI가 나의 상황에 맞는 맞춤형 답변을 할 수 있으니까",
          "AI가 더 빨리 답하게 하려고",
          "AI가 다른 사람의 정보를 가져오지 않도록",
        ],
        correctIndex: 1,
        explanation:
          "AI는 나에 대해 아무것도 모르기 때문에, 나이, 수준, 상황 등 배경 정보를 알려주면 나에게 맞는 맞춤형 답변을 해줄 수 있습니다.",
      },
    ],
  } satisfies Quiz,
};
