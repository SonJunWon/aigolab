import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson00 as orig } from "../intro/00-getting-started";

/**
 * 친화 하이브리드 — 입문준비 00강.
 * 원본(intro/00)의 코드 셀(llm-code)과 퀴즈를 그대로 재사용하고,
 * 설명은 비개발자 친화 카드(🃏)로 감싼다. (코드 유지 + 친화 톤)
 */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson00: Lesson = {
  id: "ai-intro-00-getting-started",
  language: "ai-engineering",
  track: "intro",
  order: 0,
  title: "AIGoLab 시작하기",
  subtitle: "플랫폼 사용법 · 셀 실행 · API 키 등록을 한 번에",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 👋 00강. AIGoLab 시작하기

⏱️ 15분 · 🧰 웹 브라우저만 있으면 OK

> 🃏 **30초 미리보기**
> AIGoLab은 **읽고 → 직접 실행하고 → AI와 대화**하며 배우는 곳이에요. 설치 필요 없어요!
> 이 강의에선 ① 화면·셀 사용법 ② **API 키(=AI 회원증) 등록** ③ 첫 AI 대화까지 해봅니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 이 화면은 '노트북'이에요

> 🃏 **노트북 = 셀(칸)들의 모음** 📓
> - 📖 **설명 셀**: 지금 읽는 이 글처럼 개념을 설명 (읽기만)
> - ▶️ **코드 셀**: 코드를 직접 실행 (▶ 버튼 또는 **Cmd/Ctrl+Enter**)
> - 🤖 **AI 셀**: AI에게 질문을 보내 답을 받음 (API 키 필요)

먼저 아래 코드 셀을 직접 실행해보세요. **▶ 버튼**을 누르거나 **Cmd/Ctrl+Enter**! 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `잘하셨어요! 셀 아래에 결과가 나타났죠? 앞으로 모든 실습이 이렇게 **직접 실행**하는 방식이에요.

## 2. API 키 = 'AI 회원증' 🪪

> 🃏 **API 키란?**
> AI에게 질문을 보내려면 **회원증(API 키)** 이 필요해요.
> ✅ **무료** (하루 1,500회까지) ✅ Gmail만 있으면 **2분** ✅ 키는 **내 브라우저에만** 저장(안전)

> 🃏 **등록 방법 (2분)**
> 1) [Google AI Studio](https://aistudio.google.com/apikey) 접속 → Gmail 로그인
> 2) **'API 키 만들기'** 클릭 → \`AIzaSy...\` 로 시작하는 키 복사
> 3) [API 키 관리 페이지](/my/api-keys) 에서 Gemini 항목에 붙여넣고 **[등록]**
> 4) **[테스트]** 로 확인 — 끝!

> ⚠️ 키를 등록해야 아래 AI 셀이 작동해요. **지금 등록하고 돌아오세요!**`,
    },
    {
      type: "markdown",
      source: `## 3. AI에게 첫 인사 보내기 🤖

키를 등록했다면, 아래 AI 셀을 실행해 Gemini에게 인사를 보내봐요. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `🎉 AI와 첫 대화 성공!

> 🃏 **방금 일어난 일 (= AI 파이프라인)**
> 내 메시지 → AIGoLab이 Gemini에 전달 → AI가 답 생성 → 화면에 표시
> 앞으로 이 흐름을 점점 풍부하게 만들어 갈 거예요.

## 4. 자유 실습 — 직접 물어보기

아래 셀의 \`content\` 안 질문을 **원하는 내용으로 바꿔** 실행해보세요. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 읽지만 말고 **직접 실행하라.** 그게 가장 빠른 배움이다.
> 셀은 **Cmd/Ctrl+Enter**로 실행하고, AI를 쓰려면 **API 키(회원증)** 를 등록한다. 다음 강의부터 본격적으로 AI와 놀아봐요!

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
