import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson02 as orig } from "../intro/02-ai-writing";

/** 친화 하이브리드 — 입문준비 02강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson02: Lesson = {
  id: "ai-intro-02-ai-writing",
  language: "ai-engineering",
  track: "intro",
  order: 2,
  title: "AI로 글쓰기",
  subtitle: "이야기·시·자기소개 — 역할(system)을 주면 글이 달라진다",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# ✍️ 02강. AI로 글쓰기

⏱️ 15분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> AI를 **글쓰기 도우미**로 써봅니다. 그냥 부탁하는 것과, AI에게 **역할(예: "너는 동화 작가야")** 을 주는 것이 어떻게 다른지 체험해요. 역할 한 줄이 글의 **톤과 질**을 바꿉니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 일단 글을 부탁해보기

> 🃏 AI에게 글을 써달라고 하면 바로 만들어줘요. 먼저 기본 요청을 해봅시다. 👇`,
    },
    code[0],
    code[1],
    {
      type: "markdown",
      source: `## 2. 역할을 주면 달라진다 — system 메시지 🎭

> 🃏 **역할 지정(system)**
> 대화 맨 앞에 *"너는 ○○야"* 를 깔면, AI가 그 캐릭터로 일관되게 써요.
> "너는 **동화 작가**야" → 따뜻하고 쉬운 이야기 / "너는 **시인**이야" → 운율 있는 표현

아래에서 AI를 '동화 작가'로 만들어 글을 받아보세요. 👇`,
    },
    code[2],
    code[3],
    {
      type: "markdown",
      source: `## 3. 더 다양한 글 만들기

> 🃏 자기소개·축하 메시지·광고 문구 등 무엇이든 됩니다. 조건(길이·톤·대상)을 구체적으로 줄수록 좋아요. 👇`,
    },
    code[4],
    code[5],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 글쓰기는 AI에게 **역할(system)** 을 주는 순간 확 좋아진다.
> "너는 ○○야" + 구체적 조건(길이·톤·대상)을 곁들이면, 잡담 상대가 전문 작가가 된다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
