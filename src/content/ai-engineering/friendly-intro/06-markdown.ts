import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson06 as orig } from "../intro/06-markdown";

/** 친화 하이브리드 — 입문준비 06강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson06: Lesson = {
  id: "ai-intro-06-markdown",
  language: "ai-engineering",
  track: "intro",
  order: 6,
  title: "마크다운",
  subtitle: "글을 깔끔하게 꾸미는 간단한 약속 — AI 답을 보기 좋게",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 📝 06강. 마크다운

⏱️ 15분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> **마크다운**은 \`#\`, \`-\`, \`**굵게**\` 같은 **간단한 기호로 글을 꾸미는 약속**이에요. 제목·목록·표를 쉽게 만들죠. AI 답변을 **보기 좋게** 받을 때 특히 유용합니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 마크다운이 뭐예요?

> 🃏 **꾸미기 기호 약속** ✨
> \`# 제목\` → 큰 제목 · \`- 항목\` → 목록 · \`**글자**\` → **굵게** · \`| | |\` → 표
> 복잡한 편집기 없이, **기호 몇 개로** 글에 구조를 줘요. (지금 보는 이 강의도 전부 마크다운!)

AI에게 **마크다운으로 정리해 달라**고 하면 답이 깔끔해져요. 실행해보세요. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. AI와 마크다운은 찰떡궁합 🤝

> 🃏 AI 답을 마크다운으로 받으면 **제목·표·목록**으로 정리돼 읽기 쉽고, 그대로 문서·노션에 붙여넣기 좋아요. 템플릿을 마크다운으로 만들어 달라고 해봅시다. 👇`,
    },
    code[1],
    code[2],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 마크다운 = **기호 몇 개로 글을 꾸미는 약속.**
> \`#\`(제목) \`-\`(목록) \`**\`(굵게) \`|\`(표)만 알아도 충분하다. AI에게 "마크다운으로 정리해줘"라고 하면 답이 깔끔해진다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
