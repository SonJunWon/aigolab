import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson04 as orig } from "../intro/04-ai-principles";

/** 친화 하이브리드 — 입문준비 04강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson04: Lesson = {
  id: "ai-intro-04-ai-principles",
  language: "ai-engineering",
  track: "intro",
  order: 4,
  title: "AI의 원리와 한계",
  subtitle: "AI는 '다음 말 잇기' — 그래서 잘하고, 그래서 틀린다",
  estimatedMinutes: 18,
  cells: [
    {
      type: "markdown",
      source: `# 🧠 04강. AI의 원리와 한계

⏱️ 18분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> AI는 사실 **"다음에 올 그럴듯한 말을 이어 붙이는" 도구**예요. 이 원리 하나로 AI가 **왜 잘하고, 왜 틀리는지(지어냄·계산 실수)** 가 전부 설명됩니다. 직접 실험하며 확인해봐요.`,
    },
    {
      type: "markdown",
      source: `## 1. AI의 정체 — '다음 말 잇기' 🔮

> 🃏 **자동완성의 초강력 버전**
> AI는 정답을 "아는" 게 아니라, 지금까지의 글을 보고 **다음에 올 가장 그럴듯한 말**을 이어 붙여요. 그게 쌓여 문장·답이 됩니다.

아래에서 AI가 '패턴을 이어가는' 모습을 직접 보세요. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. 그래서 모르면 '지어낸다' — 환각 ⚠️

> 🃏 '다음 말 잇기'라서, AI는 모르는 것도 **그럴듯하게 지어내요**(==환각==). 존재하지 않는 것을 물어보면 어떻게 답하는지 보세요. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. 계산·글자 세기에 약하다 🔢

> 🃏 AI는 계산기가 아니라 '말 잇기' 도구라, **복잡한 계산·글자 수 세기·뒤집기·상태 추적** 에서 실수가 잦아요. 여러 문제로 한계를 확인해봐요. 👇`,
    },
    code[2],
    code[3],
    code[4],
    code[5],
    {
      type: "markdown",
      source: `## 4. 한계를 다루는 법 🛡️

> 🃏 **두 가지 요령**
> 1) **"모르면 모른다고 해"** 라고 미리 지시 → 지어냄을 줄임
> 2) **확인 질문을 함께** 시키기 → AI가 스스로 점검

아래에서 '솔직하게 답하기'와 '확인 질문'을 시켜보세요. 👇`,
    },
    code[6],
    code[7],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## AI는 **"다음 말을 잇는" 도구.** 그래서 글·지식엔 강하고, **모르면 지어내고(환각) 계산엔 약하다.**
> 중요한 답은 **다시 확인**하고, "모르면 모른다고 해"라고 미리 일러두자.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
