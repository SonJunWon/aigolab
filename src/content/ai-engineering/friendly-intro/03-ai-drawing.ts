import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson03 as orig } from "../intro/03-ai-drawing";

/** 친화 하이브리드 — 입문준비 03강. 코드 셀(generateImage 포함)·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson03: Lesson = {
  id: "ai-intro-03-ai-drawing",
  language: "ai-engineering",
  track: "intro",
  order: 3,
  title: "AI로 그림 그리기",
  subtitle: "말로 설명하면 AI가 그림으로 — 프롬프트가 구체적일수록 좋다",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 🎨 03강. AI로 그림 그리기

⏱️ 15분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> 글로 설명하면 AI가 **그림을 그려줘요**(이미지 생성). 핵심은 **설명(프롬프트)을 얼마나 구체적으로** 하느냐 — 막연하면 평범하게, 구체적이면 멋지게 나옵니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 먼저 '그림 설명문'을 AI에게 받아보기

> 🃏 좋은 그림은 좋은 **설명문**에서 나와요. AI에게 그림 묘사를 만들어 달라고 해봅시다. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. 진짜로 그려보기 🖼️

> 🃏 \`generateImage()\` 에 설명을 주면 그림이 생성돼요. **한국어로 적어도 자동 번역**됩니다. 실행해보세요. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. 스타일을 바꿔보기

> 🃏 "애니메이션 풍", "수채화 풍", "사진 같은" 처럼 **스타일**을 덧붙이면 분위기가 확 달라져요. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `## 4. 막연함 vs 구체적 — 직접 비교 🔬

> 🃏 같은 소재라도 **막연한 설명**과 **구체적인 설명**의 결과가 얼마나 다른지 나란히 봅니다. 👇`,
    },
    code[3],
    code[4],
    {
      type: "markdown",
      source: `## 5. 자유 실습 — 내가 원하는 그림

아래 설명을 바꿔 원하는 그림을 그려보세요. (색·장소·분위기·스타일을 구체적으로!) 👇`,
    },
    code[5],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 그림의 품질은 **설명(프롬프트)의 구체성**에 달렸다.
> 무엇을·어디서·어떤 분위기·어떤 스타일인지 구체적으로 적을수록 원하는 그림에 가까워진다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
