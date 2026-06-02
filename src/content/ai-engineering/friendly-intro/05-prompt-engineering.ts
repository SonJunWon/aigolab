import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson05 as orig } from "../intro/05-prompt-engineering";

/** 친화 하이브리드 — 입문준비 05강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson05: Lesson = {
  id: "ai-intro-05-prompt-engineering",
  language: "ai-engineering",
  track: "intro",
  order: 5,
  title: "프롬프트 엔지니어링",
  subtitle: "AI에게 '잘' 말하는 기술 — 역할·맥락·예시·형식·조건",
  estimatedMinutes: 18,
  cells: [
    {
      type: "markdown",
      source: `# 🎯 05강. 프롬프트 엔지니어링

⏱️ 18분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> 같은 AI라도 **어떻게 부탁하느냐**에 따라 답이 천차만별이에요. 막연한 부탁은 막연한 답을 부르고, **잘 설계한 부탁(프롬프트)** 은 쓸 만한 답을 만듭니다. 그 '잘 말하는 기술'을 배워요.`,
    },
    {
      type: "markdown",
      source: `## 1. 나쁜 부탁 vs 좋은 부탁 — 직접 비교

> 🃏 **좋은 프롬프트 공식** 🧩
> **역할 + 맥락 + (예시) + 형식 + 구체 조건(길이·대상·톤)**

먼저 '막연한 부탁'을 실행해보고, 결과를 기억해두세요. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `이번엔 **같은 주제를 공식대로** 부탁해봐요. 답이 얼마나 달라지는지 비교! 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 2. 공식 직접 적용해보기

> 🃏 역할·조건을 넣어 내 손으로 프롬프트를 설계해봅니다. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `## 3. 재사용할 '템플릿' 만들기 ♻️

> 🃏 자주 쓰는 부탁은 **빈칸 있는 템플릿**으로 만들어두면 편해요. AI에게 템플릿을 만들어 달라고 해봅시다. 👇`,
    },
    code[3],
    code[4],
    {
      type: "markdown",
      source: `## 4. 자유 실습 — 나만의 프롬프트

배운 공식으로 자유롭게 프롬프트를 만들어 실행해보세요. 👇`,
    },
    code[5],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 좋은 답은 **좋은 부탁**에서 나온다.
> **역할 + 맥락 + 예시 + 형식 + 구체 조건** 을 갖춰 부탁하라. 막연한 부탁은 막연한 답을 부른다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
