import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson13 as orig } from "../intro/13-next-steps";

/** 친화 하이브리드 — 입문준비 13강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson13: Lesson = {
  id: "ai-intro-13-next-steps",
  language: "ai-engineering",
  track: "intro",
  order: 13,
  title: "다음 단계",
  subtitle: "나에게 맞는 학습 경로 — 심화·워크샵·언어, 그리고 나만의 계획",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 🚀 13강. 다음 단계

⏱️ 15분 · 🧰 API 키 필요 · 🎓 입문준비 마무리

> 🃏 **30초 미리보기**
> 입문준비 과정을 끝낸 걸 축하해요! 🎉 이제 **어디로 더 나아갈지** 둘러봅니다 — AI 엔지니어링 심화·바이브코딩 워크샵·프로그래밍 언어. 마지막엔 **나만의 학습 계획**을 AI와 세워요.`,
    },
    {
      type: "markdown",
      source: `## 1. AI 엔지니어링 심화로 🧠

> 🃏 더 깊이 — 프롬프트·구조화·RAG·에이전트까지. 우리 플랫폼의 **AI 엔지니어링 입문/중급** 트랙으로 이어집니다. 알아봅시다. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. 바이브코딩 워크샵으로 🛠️

> 🃏 직접 **배포 가능한 AI 앱**을 만들어보는 실전 워크샵. 만들며 배우고 싶다면 여기! 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. 프로그래밍 언어 깊이 파기 🐍

> 🃏 코드를 더 단단히 — 파이썬 같은 언어를 차근차근. 어떤 언어가 나에게 맞을지 알아봐요. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `## 4. 나만의 학습 계획 세우기 🗺️

> 🃏 내 관심사·목표에 맞는 학습 로드맵을 AI에게 만들어 달라고 해봅시다. 👇`,
    },
    code[3],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 정답인 경로는 없다 — **내 관심과 목표에 맞게** 고르면 된다.
> 더 깊이(심화)·더 실전(워크샵)·더 단단히(언어) 중 끌리는 곳으로. 막히면 언제든 AI에게 길을 물어보자. 여기까지 온 당신, 멋져요! 🎉

👇 마지막 **퀴즈**로 입문준비 과정을 마무리해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
