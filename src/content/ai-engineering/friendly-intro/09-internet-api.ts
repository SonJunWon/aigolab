import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson09 as orig } from "../intro/09-internet-api";

/** 친화 하이브리드 — 입문준비 09강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson09: Lesson = {
  id: "ai-intro-09-internet-api",
  language: "ai-engineering",
  track: "intro",
  order: 9,
  title: "인터넷과 API",
  subtitle: "브라우저·서버·API — '식당 주문'으로 이해하는 데이터 흐름",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 🌐 09강. 인터넷과 API

⏱️ 15분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> 우리가 \`chat()\` 을 부르면 **인터넷을 통해 AI 서버에 요청**이 가고 답이 돌아와요. 이 흐름을 **식당 주문**에 빗대어 쉽게 이해하고, ==API== 가 뭔지 감 잡아봅니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 식당 주문으로 이해하기 🍽️

> 🃏 **데이터 흐름 = 식당 주문**
> 🧑 나(브라우저) → 📋 **주문(요청)** → 👨‍🍳 주방(서버/AI) → 🍜 **음식(응답)** → 나
> 인터넷은 이 '주문과 음식'을 **빠르게 오가게** 해주는 길이에요.

\`chat()\` 을 부르면 실제로 이 일이 일어나요. 실행해보세요. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. 요청과 응답 들여다보기 🔍

> 🃏 **요청**엔 "무엇을 원하는지", **응답**엔 "그 결과"가 담겨요. 한 번 자세히 살펴봅시다. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. API = '메뉴판 주문 방식' 📋

> 🃏 **API란?**
> 식당마다 **정해진 주문 방식(메뉴판)** 이 있듯, 서비스끼리 데이터를 주고받는 **약속된 창구**가 API예요.
> 날씨앱이 기상청 API로 날씨를 받고, 지도앱이 지도 API를 쓰는 것처럼요.

일상 속 API 예시를 AI에게 물어봅시다. 👇`,
    },
    code[2],
    code[3],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 인터넷은 **요청 → 응답**(식당 주문 → 음식)이 오가는 길, **API는 약속된 주문 창구**다.
> 우리가 쓴 \`chat()\` 도 인터넷으로 AI 서버에 요청을 보내고 답을 받는 API 호출이다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
