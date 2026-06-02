import type { Lesson, LessonCell } from "../../../types/lesson";
import { lesson08 as orig } from "../intro/08-file-extensions";

/** 친화 하이브리드 — 입문준비 08강. 코드 셀·퀴즈 재사용 + 친화 카드. */
const code = orig.cells.filter(
  (c): c is LessonCell => c.type === "llm-code" || c.type === "code",
);

export const lesson08: Lesson = {
  id: "ai-intro-08-file-extensions",
  language: "ai-engineering",
  track: "intro",
  order: 8,
  title: "파일 확장자",
  subtitle: ".md · .json · .html · .py … 파일 이름표가 알려주는 형식",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 📁 08강. 파일 확장자

⏱️ 15분 · 🧰 API 키 필요

> 🃏 **30초 미리보기**
> 파일 이름 끝의 \`.md\` \`.json\` \`.html\` 같은 **확장자는 '이 파일이 어떤 형식인지' 알려주는 이름표**예요. 형식을 알면 AI에게 "이 형식으로 만들어줘"라고 정확히 부탁할 수 있어요.`,
    },
    {
      type: "markdown",
      source: `## 1. 확장자 = 형식 이름표 🏷️

> 🃏 **자주 보는 확장자**
> 📝 \`.md\`(마크다운): 꾸민 글 · 📦 \`.json\`: 데이터 주고받는 형식 · 🌐 \`.html\`: 웹페이지 · 🐍 \`.py\`(파이썬)·🟨 \`.js\`(자바스크립트): 프로그램 코드

먼저 \`.md\`(마크다운) 형식 글을 AI에게 받아봐요. 👇`,
    },
    code[0],
    {
      type: "markdown",
      source: `## 2. \`.json\` — 데이터의 약속된 형식 📦

> 🃏 JSON은 **{ 이름: 값 }** 형태로 데이터를 정리하는 형식이에요. 앱끼리 데이터를 주고받을 때 많이 써요. 👇`,
    },
    code[1],
    {
      type: "markdown",
      source: `## 3. \`.html\` — 웹페이지의 뼈대 🌐

> 🃏 HTML은 웹페이지를 이루는 기본 형식이에요. 간단한 HTML을 만들어 봅시다. 👇`,
    },
    code[2],
    {
      type: "markdown",
      source: `## 4. \`.py\` vs \`.js\` — 두 인기 언어 🐍🟨

> 🃏 같은 일을 **파이썬(.py)** 과 **자바스크립트(.js)** 로 어떻게 다르게 쓰는지 비교해봐요. 👇`,
    },
    code[3],
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 확장자는 **파일의 형식 이름표**다.
> \`.md\`(꾸민 글) \`.json\`(데이터) \`.html\`(웹페이지) \`.py\`·\`.js\`(코드). 형식을 알면 AI에게 원하는 형식으로 정확히 부탁할 수 있다.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
  ],

  quiz: orig.quiz,
};
