import type { Lesson } from "../../../types/lesson";

export const lesson01: Lesson = {
  id: "ai-intro-01-first-chat",
  language: "ai-engineering",
  track: "intro",
  order: 1,
  title: "AI와 첫 대화",
  subtitle: "30초 만에 AI 써보기 — 질문하고 답 받기",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# AI와 첫 대화

이전 강의에서 AI에게 인사를 보내봤죠?
이번에는 좀 더 다양한 질문을 해보면서, **AI가 잘 하는 것**과 **못 하는 것**을 직접 체험해 봅시다.

## 이번 강의에서 배울 것
| # | 내용 |
|---|------|
| 1 | AI에게 다양한 종류의 질문 해보기 |
| 2 | AI가 잘 하는 것 vs 어려워하는 것 |
| 3 | 같은 질문에도 매번 다른 답이 나오는 이유 |
| 4 | 대화를 이어가는 방법 (여러 메시지) |`,
    },
    {
      type: "markdown",
      source: `## AI에게 질문해보기

AI는 정말 다양한 질문에 답할 수 있어요. 아래 셀들을 하나씩 실행해보세요!

### 실습 1: 지식 질문`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 지식 질문을 해봅시다
const response = await chat({
  messages: [
    { role: "user", content: "태양은 왜 뜨거운 거야? 초등학생이 이해할 수 있게 설명해줘." }
  ],
});

console.log(response.text);`,
      hints: ["▶ 버튼을 눌러 실행해보세요. AI가 쉬운 말로 설명해줄 거예요."],
    },
    {
      type: "markdown",
      source: `### 실습 2: 창작 요청

AI는 이야기나 시를 만들 수도 있어요!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 짧은 이야기를 만들어 달라고 해봅시다
const response = await chat({
  messages: [
    { role: "user", content: "우주를 여행하는 고양이에 대한 짧은 이야기를 3줄로 만들어줘." }
  ],
});

console.log(response.text);`,
      hints: ["같은 셀을 여러 번 실행하면 매번 다른 이야기가 나와요!"],
    },
    {
      type: "markdown",
      source: `### 실습 3: AI가 어려워하는 질문

AI가 **모든 것을 잘 하는 건 아닙니다.** 아래 질문을 실행해보세요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 어려운 질문을 해봅시다
const response = await chat({
  messages: [
    { role: "user", content: "오늘 서울 날씨가 어때?" }
  ],
});

console.log(response.text);`,
      hints: [
        "AI는 실시간 정보를 모릅니다. 인터넷 검색을 할 수 없기 때문이에요.",
        "AI의 지식은 학습 시점까지만 있어서, '오늘'의 정보는 알 수 없습니다.",
      ],
    },
    {
      type: "markdown",
      source: `## AI가 잘 하는 것 vs 어려워하는 것

| 잘 하는 것 | 어려워하는 것 |
|-----------|-------------|
| 지식 설명 (과학, 역사, 수학 등) | 실시간 정보 (오늘 날씨, 뉴스) |
| 글쓰기 (이야기, 시, 편지) | 개인 정보 (내 이름, 내 일정) |
| 번역, 요약, 정리 | 정확한 계산 (가끔 틀림!) |
| 코드 작성, 디버깅 | 미래 예측 |
| 아이디어 제안 | 감정, 느낌 (흉내만 냄) |

> 핵심: AI는 **"학습한 패턴을 바탕으로 그럴듯한 텍스트를 생성"** 하는 것이에요.
> 실시간 정보를 검색하거나, 진짜로 '생각'하는 것이 아닙니다.`,
    },
    {
      type: "markdown",
      source: `## 같은 질문, 다른 답?

AI에게 같은 질문을 두 번 해보면 **매번 조금씩 다른 답**이 나와요.
이것은 버그가 아니라, AI가 작동하는 방식 때문입니다.

AI는 다음 단어를 **확률적으로** 선택해요. 매번 약간 다른 선택을 하기 때문에 답이 달라지는 거예요.

아래 셀을 **2~3번 반복 실행**해보세요. 답이 어떻게 달라지는지 비교해보세요!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 이 셀을 여러 번 실행해보세요!
const response = await chat({
  messages: [
    { role: "user", content: "사과를 한 단어로 설명해줘." }
  ],
});

console.log("AI의 답:", response.text);`,
      hints: ["Shift+Enter를 여러 번 눌러보세요. 매번 다른 한 단어가 나올 거예요."],
    },
    {
      type: "markdown",
      source: `## 대화를 이어가기

AI에게 **여러 번 말을 주고받을 수도** 있어요.
\`messages\` 배열에 이전 대화 내용을 함께 보내면 됩니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI와 대화를 이어가봅시다
const response = await chat({
  messages: [
    { role: "user", content: "내가 좋아하는 동물은 강아지야." },
    { role: "assistant", content: "강아지를 좋아하시는군요! 어떤 종류의 강아지를 좋아하세요?" },
    { role: "user", content: "골든 리트리버! 이 강아지에 대해 재미있는 사실 하나 알려줘." },
  ],
});

console.log(response.text);`,
      hints: [
        "messages 배열에 이전 대화를 넣으면, AI가 맥락을 기억합니다.",
        "role이 'user'이면 내가 한 말, 'assistant'이면 AI가 한 말이에요.",
      ],
      solution: `// AI와 대화를 이어가봅시다
const response = await chat({
  messages: [
    { role: "user", content: "내가 좋아하는 동물은 강아지야." },
    { role: "assistant", content: "강아지를 좋아하시는군요! 어떤 종류의 강아지를 좋아하세요?" },
    { role: "user", content: "골든 리트리버! 이 강아지에 대해 재미있는 사실 하나 알려줘." },
  ],
});

console.log(response.text);
console.log("---");
console.log("응답 시간:", response.latencyMs, "ms");`,
    },
    {
      type: "markdown",
      source: `## 자유 실습

아래 셀에서 \`content\`를 바꿔서 AI에게 자유롭게 질문해보세요!
여러 번 실행하면서 AI의 답변을 비교해보는 것도 좋아요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 자유롭게 질문을 바꿔보세요!
const response = await chat({
  messages: [
    { role: "user", content: "여기에 질문을 입력하세요" }
  ],
});

console.log(response.text);`,
    },
    {
      type: "markdown",
      source: `# Ch01 정리

| 배운 것 | 내용 |
|---------|------|
| 다양한 질문 | AI는 지식 설명, 창작, 번역 등 다양한 일을 할 수 있다 |
| AI의 한계 | 실시간 정보, 개인 정보, 정확한 계산은 어려워한다 |
| 확률적 답변 | 같은 질문에도 매번 조금씩 다른 답이 나온다 |
| 대화 이어가기 | messages 배열에 이전 대화를 넣으면 맥락을 유지한다 |

**다음 강의**: AI로 글쓰기 — 나만의 작가를 만들어 봅시다!`,
    },
  ],

  quiz: {
    title: "Ch01 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "AI에게 '오늘 서울 날씨가 어때?'라고 물으면 정확한 답을 줄 수 있을까요?",
        options: [
          "정확한 날씨를 알려준다",
          "인터넷을 검색해서 알려준다",
          "실시간 정보는 알 수 없어서 정확하지 않다",
          "날씨 앱을 자동으로 열어준다",
        ],
        correctIndex: 2,
        explanation: "AI는 인터넷을 검색하지 않으며, 학습 시점 이후의 실시간 정보는 알 수 없습니다.",
      },
      {
        type: "multiple-choice",
        question: "AI에게 같은 질문을 두 번 하면 어떻게 되나요?",
        options: [
          "항상 똑같은 답이 나온다",
          "매번 조금씩 다른 답이 나올 수 있다",
          "두 번째에는 답을 거부한다",
          "오류가 발생한다",
        ],
        correctIndex: 1,
        explanation: "AI는 다음 단어를 확률적으로 선택하기 때문에, 같은 질문에도 매번 조금씩 다른 답이 나올 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "AI와 대화를 이어가려면 어떻게 해야 하나요?",
        options: [
          "AI가 자동으로 이전 대화를 기억한다",
          "messages 배열에 이전 대화 내용을 함께 보낸다",
          "특별한 명령어를 입력한다",
          "대화를 이어갈 수 없다",
        ],
        correctIndex: 1,
        explanation: "messages 배열에 이전 user/assistant 메시지를 넣어서 보내면, AI가 맥락을 파악하고 대화를 이어갈 수 있습니다.",
      },
    ],
  },
};
