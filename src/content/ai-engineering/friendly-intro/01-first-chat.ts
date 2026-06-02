import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson01 as orig } from "../intro/01-first-chat";

/** 친화 하이브리드 — 입문준비 01강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson01: Lesson = {
  id: "ai-intro-01-first-chat",
  language: "ai-engineering",
  track: "intro",
  order: 1,
  title: "AI와 첫 대화",
  subtitle: "AI에게 질문을 보내고, 잘하는 것과 약한 것을 직접 체험",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 💬 01강. AI와 첫 대화

⏱️ 15분 · 🧰 API 키만 등록돼 있으면 OK

> 🃏 **30초 미리보기**
> AI에게 직접 여러 질문을 던져보며, AI가 **잘하는 것(지식·글쓰기)** 과 **약한 것(최신 정보·정확한 계산)** 을 몸으로 느껴봅니다. 또 **같은 질문도 답이 달라지는** 것과 **대화가 이어지는** 것도 체험해요.`,
    },
    {
      type: "markdown",
      source: `## 1. 아는 걸 물어보기

> 🃏 AI는 방대한 글을 학습해서 **지식 질문**에 잘 답해요. 아래 셀을 실행해보세요. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. 글쓰기도 잘해요 ✍️

> 🃏 AI는 **이야기·시·문구** 같은 창작도 잘합니다. 짧은 이야기를 만들어 달라고 해볼게요. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. AI가 약한 것 — 최신 정보·정확한 계산 ⚠️

> 🃏 AI는 **훈련 시점까지의 지식**만 알고, 복잡한 계산은 실수할 수 있어요. 일부러 어려운 질문을 던져보고 한계를 관찰해봐요. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `## 4. 같은 질문, 다른 답 🎲

> 🃏 AI는 같은 질문에도 **매번 조금씩 다른 답**을 만들어요(자유도). 아래 셀을 **여러 번** 실행해 차이를 느껴보세요. 👇`,
    },
    code[3],
    {
      type: "markdown",
      source: `## 5. 대화는 이어진다 🔗

> 🃏 이전 말을 **기억한 채** 대화를 이어갈 수 있어요. 맥락이 어떻게 유지되는지 보세요. 👇`,
    },
    code[4],
    {
      type: "markdown",
      source: `## 6. 자유 실습 — 마음껏 물어보기

아래 셀의 질문을 바꿔 자유롭게 대화해보세요. 👇`,
    },
    code[5],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## AI는 **지식·글쓰기에 강하고, 최신 정보·정확한 계산엔 약하다.**
> 같은 질문도 답이 달라질 수 있고, 대화는 이어진다. 직접 던져보며 감을 잡는 게 핵심이에요.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
