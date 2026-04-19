import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson11: Lesson = {
  id: "ai-intro-11-vibe-coding",
  language: "ai-engineering",
  track: "intro",
  order: 11,
  title: "바이브 코딩",
  subtitle: "AI에게 말로 설명하면 코드를 대신 짜준다고?",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 바이브 코딩이란?

여러분이 코딩을 전혀 몰라도 **말로 설명하면 AI가 코드를 대신 짜주는 것**, 이것이 바로 **바이브 코딩(Vibe Coding)** 입니다.

예를 들어볼게요:
- "파란색 배경에 '안녕하세요'라고 쓰인 웹페이지 만들어줘"
- "버튼을 누르면 숫자가 올라가는 카운터 만들어줘"

이렇게 **원하는 것을 말로 설명**하면, AI가 HTML, CSS, JavaScript 같은 코드를 만들어줍니다.

## 이번 강의에서 배울 것
| # | 내용 |
|---|------|
| 1 | 바이브 코딩이 뭔지 이해하기 |
| 2 | AI에게 원하는 것을 말로 설명하는 방법 |
| 3 | MD 레시피 — AI가 따라하는 설계도 |
| 4 | 직접 AI에게 코드를 만들어 달라고 해보기 |`,
    },
    {
      type: "markdown",
      source: `## 바이브 코딩의 핵심 아이디어

전통적인 코딩은 이런 과정이에요:
1. 프로그래밍 언어를 **몇 달~몇 년** 배운다
2. 코드를 **한 줄씩 직접** 작성한다
3. 오류가 나면 **직접 찾아서** 고친다

바이브 코딩은 완전히 달라요:
1. 원하는 것을 **한국어로 설명**한다
2. AI가 코드를 **대신 작성**한다
3. 결과를 보고 **"이 부분 바꿔줘"** 라고 말한다

> 핵심: 코드를 '쓰는' 능력 대신, **원하는 것을 잘 '설명하는' 능력**이 중요해집니다!`,
    },
    {
      type: "markdown",
      source: `## 실습 1: AI에게 웹페이지 만들어 달라고 하기

AI에게 간단한 웹페이지를 만들어 달라고 해봅시다.
HTML이 뭔지 몰라도 괜찮아요. AI가 다 만들어줍니다!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 웹페이지 코드를 만들어 달라고 해봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "하늘색 배경에 '나의 첫 웹페이지'라는 제목이 있고, 아래에 '바이브 코딩으로 만들었어요!'라는 글이 있는 간단한 HTML 페이지를 만들어줘. 글자는 가운데 정렬이고, 제목은 크고 굵게 해줘."
    }
  ],
});

console.log(response.text);`,
      hints: [
        "AI가 HTML 코드를 생성해줄 거예요. 코드를 몰라도 괜찮아요!",
        "결과로 나온 코드를 복사해서 .html 파일로 저장하면 진짜 웹페이지가 됩니다.",
      ],
    },
    {
      type: "markdown",
      source: `보셨나요? 여러분은 코드를 한 줄도 직접 쓰지 않았는데, AI가 완전한 웹페이지 코드를 만들어줬어요!

이것이 바이브 코딩의 힘입니다.`,
    },
    {
      type: "markdown",
      source: `## 실습 2: AI에게 코드 설명 요청하기

바이브 코딩에서 중요한 능력 중 하나는 **AI가 만든 코드를 이해하는 것**이에요.
코드를 완벽히 이해할 필요는 없지만, 대략 어떤 일을 하는지는 알면 좋아요.

AI에게 방금 만든 코드를 설명해 달라고 해봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 코드를 설명해 달라고 해봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: \`아래 HTML 코드가 뭘 하는 건지 초등학생도 이해할 수 있게 한 줄씩 설명해줘.

<html>
<head>
  <style>
    body { background-color: skyblue; text-align: center; }
    h1 { font-size: 36px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>나의 첫 웹페이지</h1>
  <p>바이브 코딩으로 만들었어요!</p>
</body>
</html>\`
    }
  ],
});

console.log(response.text);`,
      hints: [
        "AI가 각 줄이 무슨 뜻인지 쉽게 설명해줄 거예요.",
        "코드를 외울 필요는 없어요. 대략 어떤 역할인지만 알면 됩니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 실습 3: AI에게 코드 수정 요청하기

바이브 코딩의 또 다른 핵심은 **수정 요청**이에요.
결과가 마음에 안 들면, 코드를 직접 고치는 대신 AI에게 바꿔달라고 말하면 됩니다!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 기존 코드를 수정해 달라고 해봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "하늘색 배경에 '나의 첫 웹페이지'라는 제목이 있는 HTML을 만들어줘."
    },
    {
      role: "assistant",
      content: "<html><head><style>body{background-color:skyblue;text-align:center;}</style></head><body><h1>나의 첫 웹페이지</h1></body></html>"
    },
    {
      role: "user",
      content: "좋아! 여기에 다음 3가지를 추가해줘: 1) 배경색을 분홍색으로 바꿔줘 2) 귀여운 이모지를 제목 옆에 넣어줘 3) 아래에 오늘 날짜를 표시하는 부분도 추가해줘"
    }
  ],
});

console.log(response.text);`,
      hints: [
        "AI에게 수정 사항을 번호로 나열하면 더 정확하게 반영해줘요.",
        "이전 대화를 messages에 포함시키면 AI가 맥락을 이해하고 수정해줍니다.",
      ],
    },
    {
      type: "markdown",
      source: `## MD 레시피란?

바이브 코딩을 더 잘 하는 방법이 있어요. 바로 **MD 레시피**입니다.

**MD 레시피**는 AI에게 보내는 **설계도**예요. 마크다운(Markdown) 형식으로 내가 원하는 것을 정리해서 AI에게 주면, AI가 그대로 만들어줍니다.

### 예시: 간단한 자기소개 페이지 MD 레시피

\`\`\`
# 자기소개 웹페이지

## 디자인
- 배경: 연한 노란색
- 글자: 가운데 정렬
- 폰트: 둥근 느낌

## 내용
1. 제목: "안녕! 나는 [이름]이야"
2. 사진 자리 (동그란 원 모양)
3. 소개글: 3줄 정도
4. 좋아하는 것 목록 (이모지 포함)
5. 연락처 버튼

## 기능
- 버튼에 마우스를 올리면 색이 바뀜
- 스크롤하면 부드럽게 움직임
\`\`\`

이렇게 정리해서 AI에게 보내면, AI가 이 설계도를 보고 코드를 완성해줍니다!

> MD 레시피의 장점: 생각을 정리할 수 있고, AI가 빠뜨리는 부분 없이 만들어줍니다.`,
    },
    {
      type: "markdown",
      source: `## 실습 4: MD 레시피로 코드 만들기

직접 MD 레시피를 AI에게 보내봅시다!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// MD 레시피를 AI에게 보내서 코드를 만들어 봅시다
const mdRecipe = \`
# 나만의 명함 웹페이지

## 디자인
- 카드 모양 (둥근 모서리, 그림자 효과)
- 배경: 흰색 카드 + 연한 회색 바탕
- 크기: 가로 350px, 세로 자동

## 내용
1. 이름: "AI 탐험가" (굵고 큰 글씨)
2. 직업: "바이브 코딩 마스터"
3. 좋아하는 것: 🎮 게임, 📚 책, 🤖 AI (이모지 포함)
4. 한 줄 소개: "코딩 없이 AI로 뭐든 만들 수 있어요!"

## 스타일
- 모든 글자 가운데 정렬
- 이름은 파란색
- 카드에 마우스 올리면 살짝 커지는 효과
\`;

const response = await chat({
  messages: [
    {
      role: "user",
      content: "아래 MD 레시피를 보고 HTML+CSS 코드를 만들어줘. 완전한 HTML 파일로 만들어줘.\\n\\n" + mdRecipe
    }
  ],
});

console.log(response.text);`,
      hints: [
        "MD 레시피에 적은 내용이 그대로 코드로 변환되는 것을 확인해보세요.",
        "레시피 내용을 직접 수정해서 다시 실행해보세요! 이름이나 좋아하는 것을 바꿔보는 건 어떨까요?",
      ],
    },
    {
      type: "markdown",
      source: `## 바이브 코딩 잘 하는 팁

| 팁 | 설명 |
|-----|------|
| 구체적으로 설명하기 | "예쁘게 만들어줘" 보다 "파란색 배경에 둥근 버튼" 처럼 구체적으로 |
| 단계별로 요청하기 | 한 번에 다 말하지 말고, 조금씩 추가하기 |
| 결과 확인 후 수정하기 | 한 번에 완벽할 필요 없어요. 보면서 고치면 돼요 |
| MD 레시피 활용하기 | 복잡한 것을 만들 때는 먼저 설계도를 정리하기 |
| 예시 보여주기 | "이런 느낌으로 만들어줘" 하고 참고할 것을 알려주기 |`,
    },
    {
      type: "markdown",
      source: `## 자유 실습

아래 셀에서 여러분만의 아이디어로 AI에게 코드를 만들어 달라고 해보세요!

아이디어가 필요하면:
- 좋아하는 캐릭터 소개 페이지
- 오늘의 할 일 목록
- 간단한 퀴즈 페이지
- 생일 축하 카드`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 여러분만의 바이브 코딩을 해보세요!
const response = await chat({
  messages: [
    {
      role: "user",
      content: "여기에 만들고 싶은 것을 설명하세요"
    }
  ],
});

console.log(response.text);`,
    },
    {
      type: "markdown",
      source: `# Ch11 정리

| 배운 것 | 내용 |
|---------|------|
| 바이브 코딩 | 코드를 직접 쓰지 않고, AI에게 말로 설명해서 코드를 만드는 방법 |
| 코드 설명 요청 | AI가 만든 코드를 이해하기 위해 설명을 요청할 수 있다 |
| 수정 요청 | 결과가 마음에 안 들면 AI에게 구체적으로 수정을 요청한다 |
| MD 레시피 | 원하는 것을 마크다운으로 정리한 설계도. AI가 이를 따라 코드를 만든다 |

> 핵심 메시지: 코딩을 몰라도 **원하는 것을 잘 설명하는 능력**이 있으면
> AI와 함께 무엇이든 만들 수 있습니다!

**다음 강의**: 축하합니다! 마지막 강의에서 앞으로의 학습 방향을 알아봅시다!`,
    },
  ],

  quiz: {
    title: "Ch11 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "바이브 코딩이란 무엇인가요?",
        options: [
          "프로그래밍 언어를 암기해서 코드를 작성하는 것",
          "AI에게 원하는 것을 말로 설명해서 코드를 만드는 것",
          "코드를 복사해서 붙여넣기 하는 것",
          "컴퓨터가 자동으로 아무 코드나 만드는 것",
        ],
        correctIndex: 1,
        explanation:
          "바이브 코딩은 코드를 직접 쓰는 대신, AI에게 원하는 것을 자연어(한국어)로 설명해서 코드를 만드는 방법입니다.",
      },
      {
        type: "multiple-choice",
        question: "MD 레시피의 역할은 무엇인가요?",
        options: [
          "AI를 학습시키는 데이터",
          "완성된 프로그램 코드",
          "AI에게 보내는 설계도로, 원하는 것을 정리한 문서",
          "컴퓨터를 빠르게 만드는 설정 파일",
        ],
        correctIndex: 2,
        explanation:
          "MD 레시피는 마크다운 형식으로 원하는 것을 정리한 설계도예요. AI가 이 설계도를 보고 코드를 만들어줍니다.",
      },
      {
        type: "multiple-choice",
        question: "AI가 만든 코드가 마음에 안 들 때 어떻게 하면 좋을까요?",
        options: [
          "처음부터 다시 시작해야 한다",
          "코드를 직접 공부해서 고쳐야 한다",
          "AI에게 수정하고 싶은 부분을 구체적으로 말한다",
          "다른 AI를 사용해야 한다",
        ],
        correctIndex: 2,
        explanation:
          "바이브 코딩에서는 수정하고 싶은 부분을 AI에게 구체적으로 설명하면, AI가 코드를 수정해줍니다. 번호를 매겨서 요청하면 더 정확해요.",
      },
      {
        type: "multiple-choice",
        question: "바이브 코딩을 잘 하기 위해 가장 중요한 능력은?",
        options: [
          "프로그래밍 언어를 여러 개 아는 것",
          "타이핑 속도가 빠른 것",
          "원하는 것을 구체적으로 설명하는 것",
          "컴퓨터 하드웨어에 대해 잘 아는 것",
        ],
        correctIndex: 2,
        explanation:
          "바이브 코딩에서는 코드를 직접 쓰는 능력보다, 원하는 것을 명확하고 구체적으로 설명하는 능력이 가장 중요합니다.",
      },
    ],
  } satisfies Quiz,
};
