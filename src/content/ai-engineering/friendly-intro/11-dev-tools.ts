import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson11 as orig } from "../intro/11-dev-tools";

/** 친화 하이브리드 — 입문준비 11강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson11: Lesson = {
  id: "ai-intro-11-dev-tools",
  language: "ai-engineering",
  track: "intro",
  order: 11,
  title: "개발 도구",
  subtitle: "터미널 · VS Code · Cursor — 개발자의 작업실 구경하기",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 🧰 11강. 개발 도구

⏱️ 15분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> 개발자들이 쓰는 도구를 구경해요 — **터미널**(명령 입력창)·**VS Code**(코드 작업실)·**Cursor**(AI가 들어간 작업실). 지금 당장 다 쓸 필요는 없고, **무엇인지 감만** 잡으면 충분해요.`,
    },
    {
      type: "markdown",
      source: `## 1. 터미널 = 컴퓨터에게 직접 명령하는 창 ⌨️

> 🃏 버튼 대신 **글자 명령**으로 컴퓨터를 다루는 검은 창이에요. 처음엔 낯설지만 익숙해지면 빠릅니다. AI에게 물어봅시다. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. VS Code / Cursor = 코드 작업실 🏠

> 🃏 **VS Code**: 전 세계가 쓰는 무료 코드 편집기 · **Cursor**: VS Code에 **AI가 내장**돼 말로 코딩하는 도구.
> 화가에게 작업실이 있듯, 개발자에겐 이런 작업실이 있어요. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. 나에게 맞는 도구 추천받기

> 🃏 내 상황(초보·관심분야)에 맞는 도구를 AI에게 추천받아봐요. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 개발 도구는 **터미널(명령 창) + 코드 작업실(VS Code/Cursor)** 이 핵심.
> 지금 다 쓸 필요 없다. 이런 게 있다는 것만 알아두고, 필요할 때 AI에게 물어가며 익히면 된다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
