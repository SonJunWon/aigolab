import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson12 as orig } from "../intro/12-vibe-coding";

/** 친화 하이브리드 — 입문준비 12강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson12: Lesson = {
  id: "ai-intro-12-vibe-coding",
  language: "ai-engineering",
  track: "intro",
  order: 12,
  title: "바이브 코딩",
  subtitle: "말로 부탁해 앱을 만들기 — AI에게 만들고·설명·수정 시키기",
  estimatedMinutes: 18,
  cells: [
    {
      type: "markdown",
      source: `# ✨ 12강. 바이브 코딩

⏱️ 18분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> **바이브 코딩**은 코드를 일일이 외워 치는 대신, **AI에게 말로 부탁해** 프로그램을 만드는 방식이에요. 만들고(생성)·이해하고(설명)·고치는(수정) 흐름을 직접 체험합니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 말로 부탁해 웹페이지 만들기 🌐

> 🃏 "이런 웹페이지 만들어줘" 라고 부탁하면 AI가 코드를 만들어줘요. 구체적으로 부탁할수록 좋아요. 실행해보세요. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. 만든 코드를 '설명'시키기 🔍

> 🃏 모르는 코드도 **AI에게 설명을 시키면** 이해돼요. 바이브 코딩의 핵심 습관 — **이해하며 만들기**. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. 코드를 '수정'시키기 🔧

> 🃏 "여기 색을 바꿔줘", "버튼을 추가해줘" 처럼 **고쳐 달라**고 하면 돼요. 대화로 다듬어 갑니다. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `## 4. 기획(레시피)을 코드로 🍳

> 🃏 마크다운으로 정리한 **기획서(레시피)** 를 AI에게 주면, 그에 맞는 코드를 만들어줘요. 기획 → 코드 파이프라인! 👇`,
    },
    code[3],
    {
      type: "markdown",
      source: `## 5. 자유 실습 — 나만의 바이브 코딩

만들고 싶은 걸 자유롭게 부탁해보세요. (만들기 → 설명 → 수정 순서로!) 👇`,
    },
    code[4],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 바이브 코딩 = **말로 부탁해 만들고 → 설명 듣고 → 고치기.**
> 코드를 외우는 게 아니라 **AI와 대화하며 다듬는다.** 구체적으로 부탁하고, 모르면 설명을 시키는 습관이 핵심이다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
