import type { Lesson } from "../../../types/lesson";

export const lesson11: Lesson = {
  id: "ai-intro-11-dev-tools",
  language: "ai-engineering",
  track: "intro",
  order: 11,
  title: "개발 도구",
  subtitle: "프로그래머가 사용하는 도구들 — 터미널, VS Code, Cursor",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 개발 도구

요리사에게 칼과 도마가 필요하듯, 프로그래머에게도 **도구**가 필요해요.

이번 강의에서는 프로그래머가 매일 사용하는 핵심 도구 3가지를 알아봅시다.

## 이번 강의에서 배울 것
| # | 내용 |
|---|------|
| 1 | 터미널 — 컴퓨터와 글자로 대화하기 |
| 2 | IDE(VS Code) — 코드를 쓰는 전용 프로그램 |
| 3 | Cursor — AI가 도와주는 코드 편집기 |`,
    },
    {
      type: "markdown",
      source: `## 1. 터미널(Terminal) — 컴퓨터와 글자로 대화하기

우리는 보통 **마우스로 클릭**해서 컴퓨터를 사용하죠?
하지만 프로그래머는 **글자를 입력**해서 컴퓨터에게 명령을 내리기도 해요.

이때 사용하는 것이 **터미널(Terminal)** 이에요.

### 터미널이란?

> 터미널 = 컴퓨터에게 **글자로 명령을 내리는 창**

마우스 클릭 대신 글자를 타이핑해서 컴퓨터를 조종하는 거예요.

| 마우스로 하는 것 | 터미널에서 하는 것 |
|----------------|-------------------|
| 폴더 더블클릭해서 열기 | \`cd 폴더이름\` 입력 |
| 파일 목록 보기 | \`ls\` 입력 |
| 새 폴더 만들기 | \`mkdir 폴더이름\` 입력 |
| 파일 삭제하기 | \`rm 파일이름\` 입력 |

### 왜 터미널을 쓸까?

1. **더 빠르다** — 클릭 여러 번 할 것을 한 줄로 끝낼 수 있어요
2. **자동화 가능** — 여러 명령을 한번에 실행할 수 있어요
3. **서버에서 필수** — 서버 컴퓨터는 화면이 없어서 터미널만 사용해요
4. **프로그래밍 도구 실행** — 대부분의 개발 도구가 터미널에서 실행돼요`,
    },
    {
      type: "markdown",
      source: `### 자주 쓰는 터미널 명령어

| 명령어 | 의미 | 하는 일 |
|--------|------|---------|
| \`ls\` | list | 현재 폴더의 파일/폴더 목록 보기 |
| \`cd\` | change directory | 다른 폴더로 이동하기 |
| \`mkdir\` | make directory | 새 폴더 만들기 |
| \`pwd\` | print working directory | 지금 어디에 있는지 확인 |
| \`cat\` | concatenate | 파일 내용 보기 |
| \`clear\` | clear | 터미널 화면 지우기 |

> 팁: 터미널은 직접 연습해야 익숙해져요. 지금은 "이런 게 있구나" 정도만 알아두세요!

### 터미널은 어디에서 열 수 있나요?

- **Mac**: Spotlight에서 "Terminal" 검색
- **Windows**: 시작 메뉴에서 "명령 프롬프트" 또는 "PowerShell" 검색
- **VS Code**: 프로그램 안에 터미널이 내장되어 있어요! (아래에서 설명)`,
    },
    {
      type: "markdown",
      source: `### 실습 1: AI에게 터미널 명령어 물어보기

터미널을 직접 실행할 수는 없지만, AI에게 터미널 사용법을 물어볼 수 있어요!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 터미널 명령어에 대해 물어봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "초등학생에게 터미널(Terminal)이 뭔지 설명해줘. 그리고 ls, cd, mkdir 명령어를 실제 예시와 함께 설명해줘. 마치 게임에서 캐릭터를 조종하는 것처럼 재미있게 비유해줘.",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "터미널은 마우스 대신 키보드로 컴퓨터를 조종하는 방법이에요.",
        "ls = 주변 살펴보기, cd = 이동하기, mkdir = 건물 짓기 같은 비유예요!",
      ],
    },
    {
      type: "markdown",
      source: `## 2. IDE (VS Code) — 코드를 쓰는 전용 프로그램

글을 쓸 때 메모장 대신 워드(Word)를 쓰면 편하죠?
코드를 쓸 때도 전용 프로그램이 있어요. 이것을 **IDE** 라고 해요.

**IDE** = Integrated Development Environment (통합 개발 환경)

> 쉽게 말하면: **코딩 전용 워드프로세서**

### VS Code란?

**VS Code (Visual Studio Code)** 는 마이크로소프트가 만든 **무료** 코드 편집기예요.
전 세계에서 가장 많이 사용하는 IDE 중 하나예요!

### VS Code가 제공하는 기능

| 기능 | 설명 | 비유 |
|------|------|------|
| 코드 색칠 | 코드를 종류별로 다른 색으로 표시 | 형광펜으로 중요한 부분 표시 |
| 자동 완성 | 코드를 타이핑하면 나머지를 추천 | 스마트폰 자동완성 |
| 오류 표시 | 틀린 부분에 빨간 밑줄 표시 | 맞춤법 검사기 |
| 내장 터미널 | VS Code 안에서 터미널 사용 가능 | 올인원 도구 |
| 확장 프로그램 | 기능을 추가할 수 있음 | 스마트폰 앱 설치 |
| 파일 탐색기 | 프로젝트 폴더 구조를 한눈에 | 파일 탐색기 |`,
    },
    {
      type: "markdown",
      source: `### VS Code 화면 구성

\`\`\`
┌────────────────────────────────────────────────┐
│  메뉴바 (File, Edit, View ...)                  │
├──────────┬─────────────────────────────────────┤
│          │                                     │
│  파일    │       코드 편집 영역                  │
│  탐색기  │                                     │
│          │   const name = "코딩";               │
│  📁 src  │   console.log(name);                │
│  📁 lib  │                                     │
│  📄 app  │                                     │
│          │                                     │
├──────────┴─────────────────────────────────────┤
│  터미널 (내장)                                   │
│  $ npm start                                   │
└────────────────────────────────────────────────┘
\`\`\`

왼쪽에는 파일 목록, 가운데에는 코드, 아래에는 터미널이 있어요!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 VS Code에 대해 더 자세히 물어봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "VS Code를 처음 설치한 초등학생에게, 가장 먼저 해야 할 5가지를 알려줘. 쉽고 재미있게 설명해줘.",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "VS Code는 code.visualstudio.com 에서 무료로 다운로드할 수 있어요.",
        "한국어 설정, 테마 변경, 확장 프로그램 설치 등이 처음 할 일이에요.",
      ],
    },
    {
      type: "markdown",
      source: `## 3. Cursor — AI가 도와주는 코드 편집기

**Cursor**는 VS Code를 기반으로 만든 **AI 코드 편집기**예요.
VS Code의 모든 기능에 **AI 기능이 추가**된 거예요!

### Cursor가 특별한 이유

| 기능 | 설명 |
|------|------|
| AI 코드 생성 | "로그인 페이지 만들어줘" → AI가 코드를 작성 |
| AI 코드 설명 | 이해 안 되는 코드를 선택하면 AI가 설명 |
| AI 오류 수정 | 에러가 나면 AI가 수정 방법 제안 |
| AI 채팅 | 코드에 대해 AI와 대화 가능 |

> Cursor = VS Code + AI 비서

### VS Code vs Cursor

| 항목 | VS Code | Cursor |
|------|---------|--------|
| 가격 | 무료 | 무료 (기본) + 유료 (고급) |
| 코드 편집 | O | O |
| 확장 프로그램 | O | O |
| AI 코드 생성 | 확장 프로그램 필요 | 기본 내장 |
| AI 채팅 | 확장 프로그램 필요 | 기본 내장 |

처음에는 VS Code로 시작해도 좋고, 바로 Cursor를 쓰는 것도 좋아요!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 개발 도구 추천을 받아봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "코딩을 처음 시작하는 초등학생에게 필요한 개발 도구를 추천해줘. 터미널, VS Code, Cursor 중에서 어떤 순서로 배우면 좋을지, 그리고 각각 왜 중요한지 설명해줘.",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "처음에는 VS Code 설치 → 터미널 기초 → Cursor 체험 순서가 좋아요.",
        "도구는 직접 써보면서 익히는 게 가장 좋은 방법이에요!",
      ],
    },
    {
      type: "markdown",
      source: `## 개발 도구 한눈에 정리

| 도구 | 한마디 | 비유 |
|------|--------|------|
| **터미널** | 글자로 컴퓨터에 명령 | 마법 주문 외우기 |
| **VS Code** | 코드 편집 전용 프로그램 | 코딩 전용 노트 |
| **Cursor** | AI가 도와주는 VS Code | AI 비서가 있는 노트 |

> 이 세 가지 도구는 앞으로 코딩을 하면서 매일 사용하게 될 거예요!
> 지금은 "이런 도구가 있구나" 정도만 알아두면 충분해요.`,
    },
    {
      type: "markdown",
      source: `# Ch10 정리

| 배운 것 | 내용 |
|---------|------|
| 터미널 | 글자로 컴퓨터에 명령을 내리는 도구 (ls, cd, mkdir 등) |
| VS Code | 전 세계에서 가장 많이 쓰는 무료 코드 편집기 |
| Cursor | VS Code + AI 기능이 합쳐진 코드 편집기 |
| IDE | 코드 편집, 실행, 디버깅을 한 곳에서 할 수 있는 프로그램 |

> 좋은 도구를 알면 코딩이 훨씬 쉽고 재미있어져요!

**다음 강의에서 계속**: 더 깊은 코딩 세계로 나아가봅시다!`,
    },
  ],

  quiz: {
    title: "Ch10 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "터미널(Terminal)은 어떤 도구인가요?",
        options: [
          "그림을 그리는 프로그램",
          "글자로 컴퓨터에 명령을 내리는 도구",
          "인터넷 브라우저",
          "음악을 듣는 프로그램",
        ],
        correctIndex: 1,
        explanation:
          "터미널은 마우스 대신 키보드로 글자를 입력해서 컴퓨터에 명령을 내리는 도구예요.",
      },
      {
        type: "multiple-choice",
        question: "터미널에서 현재 폴더의 파일 목록을 보는 명령어는?",
        options: ["cd", "mkdir", "ls", "pwd"],
        correctIndex: 2,
        explanation:
          "ls(list)는 현재 폴더에 있는 파일과 폴더 목록을 보여주는 명령어예요.",
      },
      {
        type: "multiple-choice",
        question: "Cursor가 VS Code와 다른 가장 큰 특징은?",
        options: [
          "디자인이 더 예쁘다",
          "AI 기능이 기본으로 내장되어 있다",
          "무료이다",
          "터미널이 없다",
        ],
        correctIndex: 1,
        explanation:
          "Cursor는 VS Code를 기반으로 AI 코드 생성, AI 채팅 등 AI 기능이 기본으로 내장된 코드 편집기예요.",
      },
    ],
  },
};
