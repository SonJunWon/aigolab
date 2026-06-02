import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson10 as orig } from "../intro/10-coding-basics";

/** 친화 하이브리드 — 입문준비 10강. 실제 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson10: Lesson = {
  id: "ai-intro-10-coding-basics",
  language: "ai-engineering",
  track: "intro",
  order: 10,
  title: "코딩 기초",
  subtitle: "변수·출력·계산·조건문·배열 — 비유로 쉽게, 코드로 직접",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 💻 10강. 코딩 기초

⏱️ 20분 · 🧰 코드 셀 실행만 하면 OK

> 🃏 **30초 미리보기**
> 코딩은 어렵지 않아요 — **상자에 값 담기(변수)·화면에 보여주기(출력)·계산·만약에(조건문)·목록(배열)** 다섯 가지면 기초가 끝나요. 비유로 이해하고 **직접 실행**하며 익혀봐요.`,
    },
    {
      type: "markdown",
      source: `## 1. 변수 = 이름표 붙인 상자 📦

> 🃏 값을 **상자에 담고 이름을 붙이면** 나중에 그 이름으로 꺼내 써요. \`const myName = "김코딩"\` → myName 상자에 "김코딩"을 담는 것. 실행해보세요. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. 출력 = 화면에 보여주기 🖨️

> 🃏 \`console.log(...)\` 는 **괄호 안의 것을 화면에 보여줘요.** 코딩의 "말하기"예요. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. 문자열 = 글자 데이터 🔤

> 🃏 따옴표로 감싼 글자(\`"안녕하세요"\`)가 **문자열**이에요. 이어 붙이거나 길이를 잴 수 있어요. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `## 4. 계산 = 사칙연산 ➕

> 🃏 \`+ - * /\` 로 계산해요. (계산은 컴퓨터가 정확하죠!) 👇`,
    },
    code[3],
    {
      type: "markdown",
      source: `## 5. 조건문 = '만약에 ~라면' 🔀

> 🃏 **조건문**은 상황에 따라 다르게 행동하게 해요. "만약 점수가 90 이상이면 A" 처럼요. 두 예시를 실행해보세요. 👇`,
    },
    code[4],
    code[5],
    {
      type: "markdown",
      source: `## 6. 배열 = 목록 📋

> 🃏 **배열**은 여러 값을 **한 줄로 담는 목록**이에요. \`["사과","바나나"]\` 처럼. 순서대로 꺼내 쓸 수 있어요. 👇`,
    },
    code[6],
    {
      type: "markdown",
      source: `## 7. AI에게 연습 문제 받기 🎓

> 🃏 막히면 AI가 최고의 과외 선생님! 코딩 연습 문제를 만들어 달라고 해봅시다. 👇`,
    },
    code[7],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 코딩 기초 = **상자(변수) · 보여주기(출력) · 계산 · 만약에(조건문) · 목록(배열).**
> 이 다섯 개면 시작은 충분하다. 막히면 AI에게 물어보며 직접 실행해보는 게 가장 빠른 길이다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
