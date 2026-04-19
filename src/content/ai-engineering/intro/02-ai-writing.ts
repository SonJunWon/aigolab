import type { Lesson } from "../../../types/lesson";

export const lesson02: Lesson = {
  id: "ai-intro-02-ai-writing",
  language: "ai-engineering",
  track: "intro",
  order: 2,
  title: "AI로 글쓰기",
  subtitle: "나만의 AI 작가를 만들어보자",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# AI로 글쓰기

AI는 글쓰기를 아주 잘 합니다. 이야기, 시, 편지, 자기소개 등 다양한 글을 만들 수 있어요.

이번 강의에서는 AI에게 **다양한 종류의 글**을 쓰게 해보고,
내가 원하는 스타일로 글을 조절하는 방법을 배웁니다.

## 이번 강의에서 배울 것
| # | 내용 |
|---|------|
| 1 | AI에게 이야기 만들게 하기 |
| 2 | AI에게 시(詩) 쓰게 하기 |
| 3 | system 메시지로 AI에게 '역할' 부여하기 |
| 4 | 자기소개서 작성 도우미 만들기 |`,
    },
    {
      type: "markdown",
      source: `## 실습 1: 짧은 이야기 만들기

AI에게 주제를 주고 이야기를 만들어 달라고 해봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const response = await chat({
  messages: [
    { role: "user", content: "바다 속 학교에 다니는 문어 친구들의 재미있는 하루를 짧은 이야기로 써줘. 5줄 이내로." }
  ],
});

console.log(response.text);`,
      hints: ["주제를 바꿔서 여러 번 실행해보세요! '우주', '숲속', '미래 도시' 등 원하는 배경으로 바꿀 수 있어요."],
    },
    {
      type: "markdown",
      source: `## 실습 2: 시(詩) 쓰기

AI는 시도 잘 씁니다. 운율이 있는 글, 감성적인 글도 가능해요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const response = await chat({
  messages: [
    { role: "user", content: "'봄'이라는 주제로 4줄짜리 짧은 시를 써줘. 따뜻한 느낌으로." }
  ],
});

console.log(response.text);`,
      hints: ["주제를 '비 오는 날', '별', '우정' 등으로 바꿔보세요."],
    },
    {
      type: "markdown",
      source: `## AI에게 '역할' 부여하기 — system 메시지

지금까지는 \`role: "user"\` 메시지만 보냈죠?
이제 **\`role: "system"\`** 메시지를 배워볼 거예요.

system 메시지는 **AI에게 역할이나 규칙을 알려주는 것**입니다.

| role | 누구의 말? | 예시 |
|------|-----------|------|
| system | 규칙 설정자 (AI에게 보이는 지시) | "너는 동화 작가야" |
| user | 사용자 (나) | "이야기 써줘" |
| assistant | AI의 답변 | (AI가 생성) |

system 메시지를 쓰면 AI가 **그 역할에 맞게** 답변해요!`,
    },
    {
      type: "markdown",
      source: `### 실습 3: 동화 작가 AI`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// system 메시지로 AI를 '동화 작가'로 만들어봅시다
const response = await chat({
  messages: [
    { role: "system", content: "너는 어린이를 위한 동화 작가야. 모든 이야기는 교훈이 있고, 쉽고 따뜻한 말로 써줘." },
    { role: "user", content: "거짓말을 자꾸 하는 여우에 대한 짧은 이야기를 써줘." },
  ],
});

console.log(response.text);`,
      hints: [
        "system 메시지가 있을 때와 없을 때 답변 스타일이 어떻게 달라지는지 비교해보세요.",
        "system의 content를 '코미디 작가', '공포 소설 작가' 등으로 바꾸면 완전히 다른 스타일이 나와요!",
      ],
    },
    {
      type: "markdown",
      source: `### 실습 4: 래퍼 AI

system 메시지를 바꾸면 완전히 다른 스타일이 됩니다!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 이번에는 래퍼로 만들어봅시다
const response = await chat({
  messages: [
    { role: "system", content: "너는 한국어 래퍼야. 모든 답변을 라임이 맞는 랩 가사 스타일로 해줘. 짧게 4줄로." },
    { role: "user", content: "코딩 공부에 대해 랩 해줘!" },
  ],
});

console.log(response.text);`,
    },
    {
      type: "markdown",
      source: `### 실습 5: 자기소개서 도우미

실용적인 활용도 해볼까요? 자기소개서를 도와주는 AI를 만들어봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const response = await chat({
  messages: [
    { role: "system", content: "너는 자기소개서 작성을 도와주는 전문가야. 사용자의 정보를 받으면 자연스럽고 매력적인 자기소개서를 써줘." },
    { role: "user", content: "이름: 김하늘, 취미: 그림 그리기와 레고 조립, 잘하는 것: 친구들에게 이야기 들려주기, 꿈: 게임 만드는 사람" },
  ],
});

console.log(response.text);`,
      hints: ["자신의 정보로 바꿔서 실행해보세요! 나만의 자기소개서를 AI가 만들어줘요."],
    },
    {
      type: "markdown",
      source: `## 자유 실습

system 메시지와 user 메시지를 자유롭게 바꿔서 나만의 AI 작가를 만들어보세요!

아이디어:
- "너는 요리 레시피 전문가야" → "냉장고에 계란, 김치, 밥이 있어. 뭘 만들 수 있어?"
- "너는 여행 가이드야" → "제주도 1박 2일 여행 계획 세워줘"
- "너는 퀴즈 출제자야" → "재미있는 과학 퀴즈 3개 내줘"`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const response = await chat({
  messages: [
    { role: "system", content: "여기에 AI의 역할을 적으세요" },
    { role: "user", content: "여기에 요청을 적으세요" },
  ],
});

console.log(response.text);`,
    },
    {
      type: "markdown",
      source: `# Ch02 정리

| 배운 것 | 내용 |
|---------|------|
| AI 글쓰기 | 이야기, 시, 편지 등 다양한 글을 생성할 수 있다 |
| system 메시지 | AI에게 역할(작가, 전문가 등)을 부여하는 방법 |
| 스타일 제어 | system 메시지를 바꾸면 같은 질문에도 완전히 다른 답이 나온다 |
| 실용 활용 | 자기소개서, 레시피, 여행 계획 등 실생활에 활용 가능 |

**다음 강의**: AI로 그림 그리기 — 말로 설명하면 AI가 그림을 그려줘요!`,
    },
  ],

  quiz: {
    title: "Ch02 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "AI에게 '동화 작가' 역할을 주려면 어떤 메시지를 사용해야 하나요?",
        options: [
          "role: \"user\" 메시지에 '동화 작가처럼 써줘'라고 적는다",
          "role: \"system\" 메시지에 AI의 역할을 지정한다",
          "role: \"assistant\" 메시지에 직접 예시를 적는다",
          "별도의 설정 파일을 만든다",
        ],
        correctIndex: 1,
        explanation: "system 메시지(role: \"system\")는 AI에게 역할, 성격, 규칙 등을 설정하는 데 사용됩니다.",
      },
      {
        type: "multiple-choice",
        question: "system 메시지를 '코미디 작가'에서 '공포 소설 작가'로 바꾸면 어떻게 되나요?",
        options: [
          "AI가 오류를 일으킨다",
          "아무 변화가 없다",
          "같은 질문에도 완전히 다른 스타일의 답이 나온다",
          "AI가 역할 변경을 거부한다",
        ],
        correctIndex: 2,
        explanation: "system 메시지를 바꾸면 AI의 답변 스타일이 완전히 달라집니다. 이것이 AI 글쓰기에서 가장 강력한 도구예요!",
      },
      {
        type: "multiple-choice",
        question: "messages 배열에서 각 role의 의미로 올바른 것은?",
        options: [
          "system=AI의 답, user=규칙, assistant=질문",
          "system=규칙/역할, user=내 질문, assistant=AI의 답",
          "system=서버, user=브라우저, assistant=데이터베이스",
          "세 가지 role은 모두 같은 역할을 한다",
        ],
        correctIndex: 1,
        explanation: "system은 AI에게 역할/규칙을 알려주고, user는 사용자의 질문/요청이고, assistant는 AI의 답변입니다.",
      },
    ],
  },
};
