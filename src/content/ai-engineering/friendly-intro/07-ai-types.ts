import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson07 as orig } from "../intro/07-ai-types";

/** 친화 하이브리드 — 입문준비 07강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson07: Lesson = {
  id: "ai-intro-07-ai-types",
  language: "ai-engineering",
  track: "intro",
  order: 7,
  title: "AI 종류 알아보기",
  subtitle: "ChatGPT · Gemini · Claude … 그리고 실생활 활용 파이프라인",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 🤖 07강. AI 종류 알아보기

⏱️ 15분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> AI 챗봇은 하나가 아니에요 — **ChatGPT·Gemini·Claude** 등 여러 종류가 있고, 각자 잘하는 게 조금씩 달라요. 종류를 알아보고, AI를 **실생활 작업**(데이터 정리·대본 쓰기)에 써봅니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 대표 AI들

> 🃏 **주요 AI 비교** (큰 틀)
> 🟢 **ChatGPT**(OpenAI): 널리 쓰이는 만능형
> 🔵 **Gemini**(Google): 우리가 쓰는 AI, 무료 한도 넉넉
> 🟣 **Claude**(Anthropic): 길고 신중한 글에 강함
> → 큰 차이보다 **목적에 맞게 골라 쓰는** 게 중요해요.

지금 우리가 쓰는 AI에게 자기소개를 시켜볼까요? 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. 실생활 활용 ① 엉망인 데이터 정리 🧹

> 🃏 AI는 **지저분한 데이터를 깔끔하게 정리**하는 데 능해요. 실행해보세요. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. 실생활 활용 ② 콘텐츠 만들기 🎬

> 🃏 쇼츠 대본·기획안 같은 콘텐츠도 척척. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `## 4. 나만의 'AI 활용 파이프라인' 설계 🔗

> 🃏 한 번의 질문이 아니라 **여러 단계를 연결**(주제→초안→검토→완성)하면 훨씬 강력해요. 직접 설계해봅시다. 👇`,
    },
    code[3],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## AI는 여러 종류가 있고, **목적에 맞게 골라** 실생활 작업에 쓰면 된다.
> 한 번 묻고 끝이 아니라 **여러 단계를 연결(파이프라인)** 할 때 진짜 힘이 나온다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
