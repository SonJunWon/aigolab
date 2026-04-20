import type { Lesson } from "../../../types/lesson";

export const lesson09: Lesson = {
  id: "ai-intro-08-internet-api",
  language: "ai-engineering",
  track: "intro",
  order: 9,
  title: "인터넷과 API",
  subtitle: "컴퓨터들이 서로 대화하는 방법 — 요청과 응답",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 인터넷과 API

우리가 유튜브를 보거나, 카카오톡으로 메시지를 보낼 때 — 이 모든 것이 **인터넷**을 통해 일어나요.
그런데 정확히 어떻게 작동하는 걸까요?

그리고 우리가 지금까지 사용해온 \`chat()\` 함수도 사실 **API**라는 것을 사용하고 있어요!

## 이번 강의에서 배울 것
| # | 내용 |
|---|------|
| 1 | 인터넷이 어떻게 작동하는지 간단히 이해하기 |
| 2 | API가 무엇인지 알기 |
| 3 | 요청(Request)과 응답(Response) 패턴 |
| 4 | API 키가 왜 필요한지 이해하기 |`,
    },
    {
      type: "markdown",
      source: `## 인터넷은 어떻게 작동할까?

인터넷을 아주 간단하게 설명하면:

\`\`\`
내 컴퓨터(브라우저) → 요청 → 서버(다른 컴퓨터) → 응답 → 내 컴퓨터
\`\`\`

1. **내가 주소를 입력해요** (예: www.google.com)
2. **요청이 서버로 전달돼요** (인터넷 케이블을 타고!)
3. **서버가 결과를 만들어요** (검색 결과 페이지)
4. **응답이 내 컴퓨터로 돌아와요** (화면에 표시!)

> 비유: 편지를 보내는 것과 비슷해요! 내가 편지(요청)를 보내면, 상대방이 답장(응답)을 보내주는 거예요.

### 서버란?

**서버(Server)** = 다른 컴퓨터의 요청을 받아서 처리해주는 컴퓨터
- 구글 서버: 검색 결과를 만들어줌
- 유튜브 서버: 동영상을 보내줌
- AI 서버: AI 답변을 만들어줌

"서버"라는 말이 어려우면, **"일해주는 컴퓨터"** 라고 생각하면 돼요!`,
    },
    {
      type: "markdown",
      source: `## API란 무엇인가?

**API** = Application Programming Interface (애플리케이션 프로그래밍 인터페이스)

이름이 어렵지만, 쉽게 설명하면:

> API는 **식당의 메뉴판** 같은 거예요!

### 식당 비유

| 식당 | API |
|------|-----|
| 손님 (나) | 내 프로그램 |
| 메뉴판 | API (사용 가능한 기능 목록) |
| 주문 | 요청 (Request) |
| 웨이터 | 인터넷 |
| 주방 | 서버 |
| 음식 | 응답 (Response) |

식당에서:
1. 메뉴판을 보고 주문해요 (API 문서를 보고 요청)
2. 웨이터가 주문을 전달해요 (인터넷이 요청을 전달)
3. 주방에서 요리해요 (서버가 처리)
4. 음식이 나와요 (응답이 돌아옴)

**중요**: 주방에서 어떻게 요리하는지 몰라도 메뉴판만 보면 주문할 수 있죠?
API도 마찬가지! 서버 내부가 어떻게 작동하는지 몰라도 API만 알면 사용할 수 있어요.`,
    },
    {
      type: "markdown",
      source: `### 실습 1: chat() 함수 = API 사용하기

사실 우리가 계속 사용해온 \`chat()\` 함수가 바로 **API를 사용하는 것**이에요!

\`\`\`
chat() 호출 → 인터넷 → AI 서버 → AI가 답변 생성 → 인터넷 → 우리에게 응답
\`\`\`

아래 셀을 실행하면서 이 과정을 생각해보세요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// chat()을 호출하면 인터넷을 통해 AI 서버에 요청이 갑니다!
const response = await chat({
  messages: [
    {
      role: "user",
      content: "API가 뭔지 초등학생에게 설명하듯이 3줄로 알려줘.",
    },
  ],
});

console.log("AI의 응답:", response.text);
console.log("---");
console.log("응답까지 걸린 시간:", response.latencyMs, "ms");
console.log("(이 시간 동안 인터넷을 통해 서버와 대화한 거예요!)");`,
      hints: [
        "latencyMs는 요청을 보내고 응답을 받기까지 걸린 시간(밀리초)이에요.",
        "인터넷 속도, 서버 상태에 따라 매번 시간이 달라질 수 있어요.",
      ],
    },
    {
      type: "markdown",
      source: `### 실습 2: 요청(Request)과 응답(Response)

모든 API 통신은 이 패턴을 따라요:

| 단계 | 이름 | 설명 |
|------|------|------|
| 1 | **요청 (Request)** | 내가 서버에게 "이것 좀 해줘!" |
| 2 | **처리** | 서버가 열심히 일함 |
| 3 | **응답 (Response)** | 서버가 "여기 결과야!" |

이걸 코드에서 확인해봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 요청과 응답을 자세히 살펴봅시다

// 1단계: 요청 만들기
const myRequest = {
  messages: [
    { role: "user" as const, content: "바나나가 노란 이유를 한 문장으로 알려줘." },
  ],
};

console.log("=== 요청(Request) ===");
console.log("보내는 메시지:", myRequest.messages[0].content);
console.log("");

// 2단계: API 호출 (서버에 요청 보내기)
console.log("서버에 요청을 보내는 중...");
const response = await chat(myRequest);

// 3단계: 응답 확인
console.log("");
console.log("=== 응답(Response) ===");
console.log("받은 답변:", response.text);`,
      hints: [
        "요청(Request): 우리가 보내는 질문",
        "응답(Response): 서버가 보내주는 답변",
        "이 패턴은 인터넷의 거의 모든 곳에서 사용돼요!",
      ],
    },
    {
      type: "markdown",
      source: `## API 키는 왜 필요할까?

API를 사용하려면 보통 **API 키(Key)** 가 필요해요.

> 비유: API 키는 **회원카드** 같은 거예요!

| 식당 | API |
|------|-----|
| 회원카드 | API 키 |
| 회원만 주문 가능 | 키가 있어야 API 사용 가능 |
| 주문 횟수 기록 | 사용량 추적 |
| 비회원은 이용 불가 | 키 없으면 접근 거부 |

### API 키가 필요한 이유

1. **누가 사용하는지 확인** — 아무나 못 쓰게 하려고
2. **사용량 제한** — 무한정 쓰면 서버가 힘드니까
3. **비용 청구** — 사용한 만큼 돈을 내야 하니까
4. **보안** — 나쁜 사람이 악용하지 못하게

> 중요: API 키는 **비밀번호처럼** 다른 사람에게 보여주면 안 돼요! 다른 사람이 내 키로 API를 쓰면 내가 요금을 내야 해요.`,
    },
    {
      type: "markdown",
      source: `### 실습 3: API가 사용되는 실제 예시

AI에게 우리 주변에서 API가 어떻게 사용되는지 물어봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 일상에서 API가 쓰이는 예시를 물어봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "초등학생이 이해할 수 있게, 일상에서 API가 사용되는 예시 5가지를 알려줘. 각각 어떤 요청을 보내고 어떤 응답을 받는지도 설명해줘.",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "날씨 앱, 지도 앱, 번역 앱 등 대부분의 앱이 API를 사용해요.",
        "앱이 서버에 요청을 보내고, 결과를 받아서 화면에 보여주는 거예요.",
      ],
    },
    {
      type: "markdown",
      source: `### 실습 4: 우리가 사용 중인 API 정리

지금 이 학습 플랫폼에서 chat()을 호출할 때 일어나는 일을 AI에게 정리해달라고 해봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// chat() API의 전체 흐름을 정리해봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "다음 과정을 초등학생이 이해할 수 있게 순서대로 설명해줘: 1) 사용자가 chat() 함수를 호출한다 2) 인터넷을 통해 AI 서버에 요청이 간다 3) AI가 답변을 생성한다 4) 응답이 돌아온다. 각 단계를 재미있는 비유와 함께 설명해줘.",
    },
  ],
});

console.log(response.text);`,
    },
    {
      type: "markdown",
      source: `## 정리: 인터넷 통신의 핵심 패턴

\`\`\`
  내 컴퓨터          인터넷           서버
  ┌──────┐                      ┌──────┐
  │      │ ── 요청(Request) ──→ │      │
  │ 브라  │                      │ 서버  │
  │ 우저  │ ←─ 응답(Response) ── │      │
  └──────┘                      └──────┘
\`\`\`

이 **요청 → 응답** 패턴은 인터넷의 기본 원리예요.
웹사이트, 앱, AI 서비스 모두 이 패턴으로 작동합니다!`,
    },
    {
      type: "markdown",
      source: `# Ch08 정리

| 배운 것 | 내용 |
|---------|------|
| 인터넷 작동 원리 | 내 컴퓨터 → 요청 → 서버 → 응답 → 내 컴퓨터 |
| API | 프로그램끼리 대화하는 방법 (식당의 메뉴판 같은 것) |
| 요청/응답 | 모든 인터넷 통신의 기본 패턴 |
| API 키 | API를 사용하기 위한 회원카드 (비밀번호처럼 관리!) |
| chat() | 우리가 사용 중인 AI API |

**다음 강의**: 코딩 기초 — 프로그래밍의 기본 개념을 배워봅시다!`,
    },
  ],

  quiz: {
    title: "Ch08 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "인터넷에서 내 컴퓨터가 서버에게 데이터를 달라고 하는 것을 무엇이라 하나요?",
        options: [
          "응답 (Response)",
          "요청 (Request)",
          "다운로드 (Download)",
          "업로드 (Upload)",
        ],
        correctIndex: 1,
        explanation:
          "내 컴퓨터가 서버에게 '이것 좀 해줘!'라고 보내는 것을 요청(Request)이라고 해요. 서버가 보내주는 결과가 응답(Response)이에요.",
      },
      {
        type: "multiple-choice",
        question: "API를 식당에 비유하면, API는 무엇과 가장 비슷할까요?",
        options: [
          "주방 (음식 만드는 곳)",
          "메뉴판 (주문할 수 있는 목록)",
          "테이블 (앉는 곳)",
          "계산서 (돈 내는 곳)",
        ],
        correctIndex: 1,
        explanation:
          "API는 메뉴판과 같아요. 메뉴판을 보고 주문하듯이, API 문서를 보고 어떤 기능을 사용할 수 있는지 알 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "API 키를 다른 사람에게 보여주면 어떤 문제가 생길 수 있나요?",
        options: [
          "아무 문제 없다",
          "컴퓨터가 고장난다",
          "다른 사람이 내 키로 API를 쓰고 내가 요금을 낼 수 있다",
          "인터넷이 느려진다",
        ],
        correctIndex: 2,
        explanation:
          "API 키는 비밀번호와 같아요. 다른 사람이 내 키로 API를 사용하면 사용 요금이 나에게 청구될 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question: "우리가 chat() 함수를 호출하면 어떤 일이 일어나나요?",
        options: [
          "내 컴퓨터 안에서만 계산이 이루어진다",
          "인터넷을 통해 AI 서버에 요청이 가고, 응답이 돌아온다",
          "AI가 내 컴퓨터에 설치된다",
          "아무 일도 일어나지 않는다",
        ],
        correctIndex: 1,
        explanation:
          "chat() 함수는 인터넷을 통해 AI 서버에 요청을 보내고, AI가 만든 답변을 응답으로 받아오는 API 호출이에요.",
      },
    ],
  },
};
