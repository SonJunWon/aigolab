import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W33 — AI 개인 비서 (올인원).
 *
 * Part A: 자연어 명령 파싱·일일 브리핑 생성·통합 검색을 LLM 으로 체험 (LLM 셀)
 * Part B: MD 레시피로 음성 + 텍스트 기반 올인원 비서 앱 완성 (Claude Code / Cursor)
 */
export const workshopW33: Lesson = {
  id: "ai-eng-w33-personal-assistant",
  language: "ai-engineering",
  track: "beginner",
  order: 133,
  title: "W33: AI 개인 비서 (올인원)",
  subtitle: "음성으로 명령하면 일정·메모·할일을 AI가 통합 관리",
  estimatedMinutes: 210,
  cells: [
    // ─── 인트로 ───
    {
      type: "markdown",
      source: `# 🗣️ AI 개인 비서 — 올인원 대시보드 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**음성이나 텍스트로 명령하면 AI 가 의도를 파악해서 일정·메모·할일을 통합 관리**해주는 개인 비서 앱을 만듭니다. 매일 아침 AI 가 오늘의 브리핑도 자동 생성해줘요.

### 완성 모습
\`\`\`
┌─ AI Personal Assistant ─────────────────────────────────────┐
│  🗣️ AI 개인 비서     [🎤 음성]  [⌨️ 텍스트]  🌙 다크        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🎤  "내일 오후 3시에 팀 미팅 잡아줘"                  │    │
│  │      ✅ 캘린더에 추가했어요: 내일 15:00 팀 미팅        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌── 📅 캘린더 ──────┐  ┌── 📝 메모 ──────────────┐        │
│  │ 오늘  4/17 (목)    │  │ 📌 프로젝트 아이디어     │        │
│  │ ─────────────────  │  │   AI 비서 앱 MVP 설계   │        │
│  │ 09:00 🟢 스탠드업  │  │                         │        │
│  │ 11:00 🔵 코드리뷰  │  │ 📌 회의록 0417          │        │
│  │ 14:00 🟡 점심약속  │  │   디자인 시안 확인       │        │
│  │ 15:00 🔴 팀 미팅   │  │                         │        │
│  └───────────────────┘  └─────────────────────────┘        │
│                                                             │
│  ┌── ✅ 할 일 ───────┐  ┌── 🌅 오늘의 브리핑 ─────┐        │
│  │ ☐ 보고서 초안 작성 │  │ 좋은 아침이에요! 오늘은  │        │
│  │ ☐ API 문서 업데이트 │  │ 일정 3개, 미완료 할일   │        │
│  │ ☑ 디자인 피드백    │  │ 2개가 있어요.           │        │
│  │ ☑ 테스트 코드 작성 │  │ 14시 점심약속 잊지      │        │
│  │                   │  │ 마세요! 🍽️              │        │
│  │ [+ 할 일 추가]    │  │                         │        │
│  └───────────────────┘  └─────────────────────────┘        │
│                                                             │
│  🔍 "지난주 회의에서 뭐 논의했지?"  → 메모 2건 검색됨       │
├─────────────────────────────────────────────────────────────┤
│  📊 일정: 4  메모: 7  할일: 2/4 완료  마지막 브리핑: 08:00  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 명령 파싱 + 일일 브리핑 + 통합 검색 | 70분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 올인원 비서 앱 완성 | 140분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - ==Web Speech API== — 브라우저 내장 음성 인식/합성 기능. 이번 워크샵에서 처음 다뤄요!`,
    },

    // ─── Part A: 비서 AI 엔진 ───
    {
      type: "markdown",
      source: `## Part A: 비서 AI 엔진 만들기 (70분)

개인 비서의 핵심은 **사용자의 자연어 명령을 정확한 ==인텐트==로 분류**하고, 적절한 모듈(캘린더/메모/할일)에 연결하는 것이에요.

핵심 개념 3가지:
1. **자연어 ==인텐트== 파싱** — "내일 3시 미팅 잡아줘" → \`{ intent: "calendar_add", date: "내일", time: "15:00", title: "미팅" }\`
2. **일일 브리핑 생성** — 오늘의 일정·할일·메모를 종합해서 자연스러운 아침 요약문 작성
3. **통합 검색** — "지난주 회의 내용" 같은 자연어 질의로 캘린더+메모+할일을 한번에 검색

> 📌 **==인텐트==(Intent) 란?** — 사용자 발화 속에 담긴 "의도". 챗봇·비서 앱의 핵심 개념으로, 자연어를 구조화된 명령으로 변환하는 첫 단계예요. Siri, Alexa, Google Assistant 모두 인텐트 분류 엔진이 핵심입니다.`,
    },

    // ─── A-1: 자연어 명령 파싱 ───
    {
      type: "markdown",
      source: `### A-1. 자연어 명령 파서 — 음성/텍스트 → 구조화된 인텐트

사용자가 "금요일 저녁 7시에 친구 생일파티 메모해줘" 같이 말하면, AI 가 ==인텐트==를 분류하고 필요한 파라미터를 추출합니다. 핵심은 **하나의 프롬프트로 분류 + 추출을 동시에** 하는 것이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 자연어 명령 → 인텐트 + 파라미터 추출
const commands = [
  "내일 오후 3시에 팀 미팅 잡아줘",
  "장보기 목록: 우유, 계란, 빵 메모해",
  "보고서 작성 할일 추가해줘, 금요일까지",
  "이번 주 일정 뭐 있어?",
  "오늘 브리핑 해줘",
];

const systemPrompt = \`너는 AI 개인 비서의 인텐트 파서야.
사용자의 자연어 명령을 분석해서 구조화된 JSON 으로 변환해.

[인텐트 목록]
- calendar_add: 일정 추가 → { date, time?, title, description? }
- calendar_query: 일정 조회 → { period, keyword? }
- memo_add: 메모 추가 → { title, content }
- memo_search: 메모 검색 → { query }
- todo_add: 할일 추가 → { title, deadline?, priority? }
- todo_query: 할일 조회 → { filter? }
- briefing: 일일 브리핑 요청 → { type: "morning" | "evening" }
- search: 통합 검색 → { query, modules?: ["calendar","memo","todo"] }

[응답 형식]
{
  "input": "원본 명령",
  "intent": "인텐트 ID",
  "confidence": 0.0~1.0,
  "params": { ... },
  "response": "사용자에게 보여줄 확인 메시지"
}

[규칙]
- 날짜/시간은 ISO 형식 또는 상대 표현 유지
- confidence 0.7 미만이면 되묻기 메시지 생성
- 한국어로 응답\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: \`다음 명령들을 각각 분석해서 JSON 배열로 반환해:\\n\${commands.map((c, i) => \`\${i + 1}. "\${c}"\`).join("\\n")}\`,
    },
  ],
});

try {
  const results = JSON.parse(res.text);
  console.log("🗣️ 인텐트 파싱 결과");
  console.log("═".repeat(55));

  const intentIcons: Record<string, string> = {
    calendar_add: "📅", calendar_query: "🔎📅",
    memo_add: "📝", memo_search: "🔎📝",
    todo_add: "✅", todo_query: "🔎✅",
    briefing: "🌅", search: "🔍",
  };

  (Array.isArray(results) ? results : [results]).forEach((r: any) => {
    const icon = intentIcons[r.intent] || "❓";
    console.log(\`\\n\${icon} "\${r.input}"\`);
    console.log(\`   인텐트: \${r.intent} (확신도: \${(r.confidence * 100).toFixed(0)}%)\`);
    console.log(\`   파라미터: \${JSON.stringify(r.params)}\`);
    console.log(\`   응답: \${r.response}\`);
  });
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 하나의 시스템 프롬프트로 '분류 + 추출'을 동시에 처리해요.",
        "confidence 값은 모호한 명령을 걸러내는 안전장치예요. 0.7 미만이면 되물어야 해요.",
        "실제 앱에서는 날짜 파싱 라이브러리(date-fns 등)로 '내일', '금요일' 같은 상대 표현을 절대 날짜로 변환해요.",
      ],
    },

    // ─── A-2: 일일 브리핑 생성 ───
    {
      type: "markdown",
      source: `### A-2. 일일 브리핑 생성기 — 오늘의 모든 것을 한 문단으로

아침에 앱을 열면 AI 가 오늘의 일정·할일·최근 메모를 종합해서 자연스러운 브리핑을 만들어줘요. 핵심은 **데이터를 컨텍스트로 주입**하고 AI 가 사람처럼 요약하게 만드는 것이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 일일 브리핑 생성 — 일정+할일+메모 → 자연스러운 아침 요약
const todayData = {
  date: "2026-04-17 (금)",
  weather: "맑음, 18°C",
  calendar: [
    { time: "09:00", title: "데일리 스탠드업", location: "Zoom" },
    { time: "11:00", title: "코드 리뷰", location: "회의실 B" },
    { time: "14:00", title: "점심 약속 — 지영", location: "강남 파스타집" },
    { time: "16:00", title: "스프린트 회고", location: "Zoom" },
  ],
  todos: [
    { title: "분기 보고서 초안", deadline: "오늘", done: false, priority: "high" },
    { title: "API 문서 업데이트", deadline: "내일", done: false, priority: "medium" },
    { title: "디자인 피드백 전달", deadline: "어제", done: true, priority: "high" },
    { title: "테스트 코드 작성", deadline: "이번 주", done: true, priority: "low" },
  ],
  recentMemos: [
    { title: "프로젝트 아이디어", preview: "AI 비서 앱 MVP 설계안..." },
    { title: "회의록 0416", preview: "디자인 시안 최종 확인, 다음 스프린트 목표..." },
  ],
};

const systemPrompt = \`너는 따뜻하고 유능한 AI 개인 비서야.
사용자의 오늘 데이터를 받아서 아침 브리핑을 생성해.

[브리핑 규칙]
- 인사 + 날씨로 시작
- 오늘 일정을 시간순으로 요약 (중요한 것 강조)
- 미완료 할일 중 긴급한 것 알림
- 기한 지난 할일 경고
- 최근 메모에서 관련 내용 연결
- 하루 마무리 격려 한마디
- 이모지 적절히 사용
- 3~5문단, 자연스러운 한국어\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: \`오늘의 데이터:\\n\${JSON.stringify(todayData, null, 2)}\\n\\n아침 브리핑을 만들어줘.\`,
    },
  ],
});

console.log("🌅 오늘의 아침 브리핑");
console.log("═".repeat(55));
console.log(\`📆 \${todayData.date} | ☀️ \${todayData.weather}\`);
console.log("─".repeat(55));
console.log(res.text);
console.log("─".repeat(55));
console.log(\`📊 일정 \${todayData.calendar.length}개 | 할일 \${todayData.todos.filter(t => !t.done).length}개 미완료 | 메모 \${todayData.recentMemos.length}건\`);`,
      hints: [
        "브리핑의 핵심은 '데이터 주입 + 톤 설정'이에요. 같은 데이터도 프롬프트 톤에 따라 완전히 다른 느낌이 나요.",
        "기한 지난 할일(overdue)을 감지해서 경고하는 게 실용적인 비서의 핵심 기능이에요.",
        "실제 앱에서는 날씨 API, 캘린더 API 를 연동하지만 여기서는 샘플 데이터로 체험해요.",
      ],
    },

    // ─── A-3: 통합 검색 ───
    {
      type: "markdown",
      source: `### A-3. 자연어 통합 검색 — 모든 데이터를 한번에

"지난주 회의에서 뭐 얘기했지?" 같은 자연어 질문으로 캘린더·메모·할일을 동시에 검색해요. AI 가 질의를 분석하고, 관련 데이터를 찾아서 자연어로 답변해줍니다. ==RAG== 패턴의 초경량 버전이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 자연어 통합 검색 — 질의 → 다중 모듈 검색 → 종합 답변
const allData = {
  calendar: [
    { date: "2026-04-10", time: "14:00", title: "디자인 리뷰 회의", notes: "로고 시안 3개 비교, 2번 채택" },
    { date: "2026-04-12", time: "10:00", title: "스프린트 플래닝", notes: "이번 스프린트: 인증 모듈, 대시보드 UI" },
    { date: "2026-04-15", time: "11:00", title: "클라이언트 미팅", notes: "요구사항 변경: 다크모드 필수, 납기 4/25" },
    { date: "2026-04-17", time: "09:00", title: "데일리 스탠드업", notes: "" },
  ],
  memos: [
    { date: "2026-04-10", title: "회의록 — 디자인 리뷰", content: "로고 후보: 미니멀(1), 그라디언트(2), 레트로(3). 투표 결과 2번 채택. 컬러 팔레트 수정 필요." },
    { date: "2026-04-12", title: "스프린트 목표", content: "인증: OAuth + JWT. 대시보드: 차트 3종, 필터, 엑셀 내보내기." },
    { date: "2026-04-14", title: "아이디어 노트", content: "AI 비서 앱 — 음성 명령, 일정 관리, 스마트 검색 기능 구상" },
    { date: "2026-04-16", title: "기술 조사", content: "Web Speech API 호환성: Chrome 95+, Edge 95+. Safari 부분 지원." },
  ],
  todos: [
    { created: "2026-04-11", title: "로고 최종 파일 요청", done: true },
    { created: "2026-04-12", title: "인증 모듈 설계", done: true },
    { created: "2026-04-13", title: "대시보드 와이어프레임", done: false },
    { created: "2026-04-15", title: "다크모드 구현", done: false },
  ],
};

const searchQuery = "지난주 회의에서 디자인 관련해서 뭐 결정했지?";

const systemPrompt = \`너는 AI 개인 비서의 검색 엔진이야.
사용자의 자연어 질문을 분석하고, 제공된 데이터에서 관련 항목을 찾아 답변해.

[검색 전략]
1. 질문에서 키워드·시간 범위·모듈 힌트를 추출
2. calendar, memos, todos 각각에서 관련 항목 매칭
3. 관련도 높은 순으로 정렬
4. 자연스러운 한국어 답변으로 종합

[응답 형식]
{
  "query_analysis": { "keywords": [...], "time_range": "...", "target_modules": [...] },
  "results": [
    { "module": "calendar|memo|todo", "date": "...", "title": "...", "relevance": 0.0~1.0, "excerpt": "..." }
  ],
  "answer": "종합 답변 (자연어)"
}\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: \`[데이터]\\n\${JSON.stringify(allData, null, 2)}\\n\\n[질문] \${searchQuery}\`,
    },
  ],
});

try {
  const search = JSON.parse(res.text);
  console.log("🔍 통합 검색 결과");
  console.log("═".repeat(55));
  console.log(\`질문: "\${searchQuery}"\`);
  console.log(\`키워드: \${search.query_analysis?.keywords?.join(", ")}\`);
  console.log(\`검색 범위: \${search.query_analysis?.time_range}\`);
  console.log(\`대상 모듈: \${search.query_analysis?.target_modules?.join(", ")}\`);

  console.log("\\n📋 검색된 항목:");
  const modIcons: Record<string, string> = { calendar: "📅", memo: "📝", todo: "✅" };
  search.results?.forEach((r: any, i: number) => {
    console.log(\`  \${i + 1}. \${modIcons[r.module] || "📄"} [\${r.date}] \${r.title}\`);
    console.log(\`     관련도: \${(r.relevance * 100).toFixed(0)}% | \${r.excerpt}\`);
  });

  console.log("\\n💬 답변:");
  console.log(search.answer);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "이건 초경량 RAG 패턴이에요. 실제 RAG 는 벡터 DB 로 유사도 검색하지만, 여기서는 전체 데이터를 컨텍스트로 넣어요.",
        "query_analysis 단계가 중요해요. AI 가 먼저 질문을 분석하고 → 그 분석을 기반으로 데이터를 검색해요.",
        "데이터가 많아지면 임베딩 + 벡터 검색이 필요해요. 이 패턴은 수백 건까지 충분히 작동합니다.",
      ],
    },

    // ─── Part B: 풀스택 앱 레시피 ───
    {
      type: "markdown",
      source: `## Part B: 올인원 비서 앱 만들기 (140분)

Part A 에서 만든 AI 엔진을 실제 앱으로 완성해요. 음성 입력, 위젯 대시보드, 데이터 영속성까지 갖춘 올인원 개인 비서입니다.

---

### 🛠️ 기술 스택

| 기술 | 역할 |
|---|---|
| **React + TypeScript** | UI 프레임워크 |
| **Vite** | 빌드 도구 |
| **Tailwind CSS** | 스타일링 |
| **@google/genai** | Gemini AI (인텐트 파싱·브리핑·검색) |
| **Web Speech API** | 브라우저 내장 음성 인식 |
| **localStorage** | 데이터 영속성 |

---

### 📂 프로젝트 구조

\`\`\`
ai-personal-assistant/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .env                       ← VITE_GEMINI_API_KEY
└── src/
    ├── main.tsx
    ├── App.tsx                ← 레이아웃 + 라우팅
    ├── index.css              ← Tailwind 지시어
    ├── types/
    │   └── assistant.ts       ← CalendarEvent, Memo, Todo, Intent 타입
    ├── stores/
    │   └── useAssistantStore.ts ← 전역 상태 (일정·메모·할일)
    ├── services/
    │   ├── aiService.ts       ← Gemini 인텐트 파싱·브리핑·검색
    │   ├── speechService.ts   ← Web Speech API 래퍼
    │   └── storageService.ts  ← localStorage CRUD
    └── components/
        ├── CommandBar.tsx      ← 음성+텍스트 명령 입력
        ├── CalendarWidget.tsx  ← 일정 위젯
        ├── MemoWidget.tsx      ← 메모 위젯
        ├── TodoWidget.tsx      ← 할일 위젯
        ├── BriefingWidget.tsx  ← AI 일일 브리핑
        ├── SearchResults.tsx   ← 통합 검색 결과
        └── ThemeToggle.tsx     ← 다크/라이트 전환
\`\`\`

---

### 1단계: 프로젝트 초기화 (10분)

\`\`\`bash
npm create vite@latest ai-personal-assistant -- --template react-ts
cd ai-personal-assistant
npm install @google/genai
npm install -D tailwindcss @tailwindcss/vite
\`\`\`

**.env** 파일 생성:
\`\`\`
VITE_GEMINI_API_KEY=여기에_API_키_입력
\`\`\`

**vite.config.ts**:
\`\`\`typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
\`\`\`

**src/index.css**:
\`\`\`css
@import "tailwindcss";
\`\`\`

---

### 2단계: 타입 정의 (5분)

**src/types/assistant.ts** — 모든 데이터 모델의 기반:
\`\`\`typescript
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;          // "2026-04-17"
  time?: string;         // "14:00"
  location?: string;
  notes?: string;
  color: "red" | "blue" | "green" | "yellow" | "purple";
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  deadline?: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}

export type IntentType =
  | "calendar_add" | "calendar_query"
  | "memo_add" | "memo_search"
  | "todo_add" | "todo_query"
  | "briefing" | "search";

export interface ParsedIntent {
  intent: IntentType;
  confidence: number;
  params: Record<string, unknown>;
  response: string;
}

export interface SearchResult {
  module: "calendar" | "memo" | "todo";
  date: string;
  title: string;
  relevance: number;
  excerpt: string;
}

export interface BriefingData {
  text: string;
  generatedAt: string;
  stats: {
    events: number;
    pendingTodos: number;
    recentMemos: number;
  };
}
\`\`\`

---

### 3단계: 서비스 레이어 (30분)

#### storageService.ts — localStorage 래퍼:
\`\`\`typescript
import type { CalendarEvent, Memo, Todo } from "../types/assistant";

const KEYS = {
  calendar: "pa-calendar",
  memos: "pa-memos",
  todos: "pa-todos",
} as const;

function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const storageService = {
  // Calendar
  getEvents: () => load<CalendarEvent>(KEYS.calendar),
  saveEvents: (events: CalendarEvent[]) => save(KEYS.calendar, events),
  addEvent: (event: CalendarEvent) => {
    const events = load<CalendarEvent>(KEYS.calendar);
    events.push(event);
    save(KEYS.calendar, events);
    return events;
  },

  // Memos
  getMemos: () => load<Memo>(KEYS.memos),
  saveMemos: (memos: Memo[]) => save(KEYS.memos, memos),
  addMemo: (memo: Memo) => {
    const memos = load<Memo>(KEYS.memos);
    memos.push(memo);
    save(KEYS.memos, memos);
    return memos;
  },

  // Todos
  getTodos: () => load<Todo>(KEYS.todos),
  saveTodos: (todos: Todo[]) => save(KEYS.todos, todos),
  addTodo: (todo: Todo) => {
    const todos = load<Todo>(KEYS.todos);
    todos.push(todo);
    save(KEYS.todos, todos);
    return todos;
  },
  toggleTodo: (id: string) => {
    const todos = load<Todo>(KEYS.todos);
    const idx = todos.findIndex((t) => t.id === id);
    if (idx >= 0) todos[idx].done = !todos[idx].done;
    save(KEYS.todos, todos);
    return todos;
  },
};
\`\`\`

#### speechService.ts — ==Web Speech API== 래퍼:
\`\`\`typescript
type SpeechCallback = (text: string) => void;

export function startListening(onResult: SpeechCallback, onError?: (e: string) => void) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    onError?.("이 브라우저는 음성 인식을 지원하지 않아요.");
    return null;
  }

  const recognition = new SR();
  recognition.lang = "ko-KR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const text = event.results[0][0].transcript;
    onResult(text);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError?.(\`음성 인식 오류: \${event.error}\`);
  };

  recognition.start();
  return recognition;
}

// 타입 보강 (Web Speech API)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
\`\`\`

#### aiService.ts — Gemini 통합:
\`\`\`typescript
import { GoogleGenAI } from "@google/genai";
import type { ParsedIntent, SearchResult, CalendarEvent, Memo, Todo } from "../types/assistant";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// 인텐트 파싱
export async function parseCommand(command: string): Promise<ParsedIntent> {
  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \`너는 AI 개인 비서의 인텐트 파서야.
사용자 명령: "\${command}"

[인텐트 목록]
- calendar_add / calendar_query
- memo_add / memo_search
- todo_add / todo_query
- briefing / search

JSON 으로 응답: { "intent": "...", "confidence": 0.0~1.0, "params": {...}, "response": "확인 메시지" }\`,
  });

  return JSON.parse(res.text || "{}");
}

// 일일 브리핑 생성
export async function generateBriefing(
  events: CalendarEvent[], todos: Todo[], memos: Memo[]
): Promise<string> {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });

  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \`너는 따뜻하고 유능한 AI 개인 비서야.
오늘: \${today}

[오늘 일정] \${JSON.stringify(events)}
[미완료 할일] \${JSON.stringify(todos.filter(t => !t.done))}
[최근 메모] \${JSON.stringify(memos.slice(-3))}

아침 브리핑을 3~5문단, 이모지 포함, 한국어로 작성해.\`,
  });

  return res.text || "브리핑을 생성하지 못했어요.";
}

// 자연어 검색
export async function searchAll(
  query: string,
  events: CalendarEvent[], memos: Memo[], todos: Todo[]
): Promise<{ results: SearchResult[]; answer: string }> {
  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \`너는 AI 개인 비서의 검색 엔진이야.
질문: "\${query}"

[데이터]
캘린더: \${JSON.stringify(events)}
메모: \${JSON.stringify(memos)}
할일: \${JSON.stringify(todos)}

JSON 응답: { "results": [{ "module", "date", "title", "relevance", "excerpt" }], "answer": "종합 답변" }\`,
  });

  return JSON.parse(res.text || '{"results":[],"answer":"검색 결과가 없어요."}');
}
\`\`\`

---

### 4단계: 상태 관리 (10분)

**src/stores/useAssistantStore.ts** — React ==컨텍스트== 또는 ==Zustand==:
\`\`\`typescript
import { useState, useCallback } from "react";
import type { CalendarEvent, Memo, Todo, BriefingData } from "../types/assistant";
import { storageService } from "../services/storageService";

// 간단한 커스텀 훅 (Zustand 없이도 가능)
export function useAssistantStore() {
  const [events, setEvents] = useState<CalendarEvent[]>(storageService.getEvents());
  const [memos, setMemos] = useState<Memo[]>(storageService.getMemos());
  const [todos, setTodos] = useState<Todo[]>(storageService.getTodos());
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isDark, setIsDark] = useState(
    localStorage.getItem("pa-theme") === "dark"
  );

  const addEvent = useCallback((event: CalendarEvent) => {
    const updated = storageService.addEvent(event);
    setEvents([...updated]);
  }, []);

  const addMemo = useCallback((memo: Memo) => {
    const updated = storageService.addMemo(memo);
    setMemos([...updated]);
  }, []);

  const addTodo = useCallback((todo: Todo) => {
    const updated = storageService.addTodo(todo);
    setTodos([...updated]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    const updated = storageService.toggleTodo(id);
    setTodos([...updated]);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("pa-theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return {
    events, memos, todos, briefing,
    isDark, addEvent, addMemo, addTodo,
    toggleTodo, setBriefing, toggleTheme,
  };
}
\`\`\`

---

### 5단계: 핵심 컴포넌트 (50분)

#### CommandBar.tsx — 음성+텍스트 통합 입력:
\`\`\`tsx
import { useState } from "react";
import { startListening } from "../services/speechService";
import { parseCommand } from "../services/aiService";
import type { ParsedIntent } from "../types/assistant";

interface Props {
  onIntent: (intent: ParsedIntent) => void;
}

export default function CommandBar({ onIntent }: Props) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("");

  const handleVoice = () => {
    setListening(true);
    setStatus("🎤 듣고 있어요...");
    startListening(
      (text) => {
        setInput(text);
        setListening(false);
        setStatus(\`인식됨: "\${text}"\`);
        handleSubmit(text);
      },
      (err) => {
        setListening(false);
        setStatus(err);
      }
    );
  };

  const handleSubmit = async (text?: string) => {
    const cmd = text || input;
    if (!cmd.trim()) return;
    setStatus("🤔 분석 중...");
    try {
      const intent = await parseCommand(cmd);
      setStatus(\`✅ \${intent.response}\`);
      onIntent(intent);
      setInput("");
    } catch {
      setStatus("❌ 명령을 이해하지 못했어요.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
      <div className="flex gap-2">
        <button
          onClick={handleVoice}
          disabled={listening}
          className={\`px-4 py-2 rounded-lg font-bold transition \${
            listening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }\`}
        >
          {listening ? "🎤 듣는 중..." : "🎤 음성"}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder='명령을 입력하세요... (예: "내일 3시 미팅 잡아줘")'
          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700
                     dark:border-gray-600 dark:text-white focus:ring-2
                     focus:ring-blue-400 outline-none"
        />
        <button
          onClick={() => handleSubmit()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg
                     hover:bg-green-600 font-bold"
        >
          ⌨️ 전송
        </button>
      </div>
      {status && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {status}
        </p>
      )}
    </div>
  );
}
\`\`\`

#### CalendarWidget.tsx:
\`\`\`tsx
import type { CalendarEvent } from "../types/assistant";

const colorMap: Record<string, string> = {
  red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export default function CalendarWidget({ events }: { events: CalendarEvent[] }) {
  const today = new Date().toISOString().split("T")[0];
  const todayEvents = events
    .filter((e) => e.date === today)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
      <h3 className="font-bold text-lg mb-3">
        📅 오늘의 일정 ({todayEvents.length})
      </h3>
      {todayEvents.length === 0 ? (
        <p className="text-gray-400 text-sm">오늘 일정이 없어요 🎉</p>
      ) : (
        <ul className="space-y-2">
          {todayEvents.map((e) => (
            <li key={e.id}
                className={\`p-2 rounded-lg \${colorMap[e.color] || colorMap.blue}\`}>
              <span className="font-mono text-sm">{e.time || "종일"}</span>
              <span className="ml-2 font-medium">{e.title}</span>
              {e.location && (
                <span className="ml-2 text-xs opacity-70">📍 {e.location}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
\`\`\`

#### TodoWidget.tsx:
\`\`\`tsx
import type { Todo } from "../types/assistant";

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
}

const priorityBadge: Record<string, string> = {
  high: "🔴", medium: "🟡", low: "🟢",
};

export default function TodoWidget({ todos, onToggle }: Props) {
  const sorted = [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const p = { high: 0, medium: 1, low: 2 };
    return p[a.priority] - p[b.priority];
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
      <h3 className="font-bold text-lg mb-3">
        ✅ 할 일 ({todos.filter((t) => !t.done).length}/{todos.length})
      </h3>
      <ul className="space-y-2">
        {sorted.map((t) => (
          <li key={t.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onToggle(t.id)}>
            <span className="text-lg">{t.done ? "☑️" : "☐"}</span>
            <span className={\`flex-1 \${t.done ? "line-through opacity-50" : ""}\`}>
              {t.title}
            </span>
            <span className="text-sm">{priorityBadge[t.priority]}</span>
            {t.deadline && (
              <span className="text-xs text-gray-400">{t.deadline}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

#### MemoWidget.tsx:
\`\`\`tsx
import type { Memo } from "../types/assistant";

export default function MemoWidget({ memos }: { memos: Memo[] }) {
  const sorted = [...memos].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
      <h3 className="font-bold text-lg mb-3">📝 메모 ({memos.length})</h3>
      <ul className="space-y-2">
        {sorted.slice(0, 5).map((m) => (
          <li key={m.id}
              className="p-2 bg-yellow-50 dark:bg-gray-700 rounded-lg">
            <div className="font-medium text-sm">
              {m.pinned ? "📌 " : ""}{m.title}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {m.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

#### BriefingWidget.tsx:
\`\`\`tsx
import type { BriefingData } from "../types/assistant";

interface Props {
  briefing: BriefingData | null;
  onGenerate: () => void;
  loading: boolean;
}

export default function BriefingWidget({ briefing, onGenerate, loading }: Props) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50
                    dark:from-indigo-900/30 dark:to-purple-900/30
                    rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">🌅 오늘의 브리핑</h3>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="text-sm px-3 py-1 bg-indigo-500 text-white
                     rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        >
          {loading ? "생성 중..." : "🔄 새로 만들기"}
        </button>
      </div>
      {briefing ? (
        <>
          <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
            {briefing.text}
          </div>
          <div className="mt-3 text-xs text-gray-400 flex gap-4">
            <span>📅 일정 {briefing.stats.events}개</span>
            <span>✅ 할일 {briefing.stats.pendingTodos}개</span>
            <span>📝 메모 {briefing.stats.recentMemos}건</span>
            <span>⏰ {briefing.generatedAt}</span>
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-sm">
          아직 브리핑이 없어요. "브리핑 해줘" 라고 말하거나 버튼을 눌러보세요!
        </p>
      )}
    </div>
  );
}
\`\`\`

---

### 6단계: 메인 앱 조립 (20분)

**src/App.tsx**:
\`\`\`tsx
import { useState, useCallback } from "react";
import { useAssistantStore } from "./stores/useAssistantStore";
import { generateBriefing, searchAll } from "./services/aiService";
import CommandBar from "./components/CommandBar";
import CalendarWidget from "./components/CalendarWidget";
import MemoWidget from "./components/MemoWidget";
import TodoWidget from "./components/TodoWidget";
import BriefingWidget from "./components/BriefingWidget";
import SearchResults from "./components/SearchResults";
import type { ParsedIntent, SearchResult } from "./types/assistant";

export default function App() {
  const store = useAssistantStore();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    results: SearchResult[];
    answer: string;
  } | null>(null);

  const handleIntent = useCallback(async (intent: ParsedIntent) => {
    const p = intent.params as Record<string, string>;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    switch (intent.intent) {
      case "calendar_add":
        store.addEvent({
          id, title: p.title || "새 일정",
          date: p.date || now.split("T")[0],
          time: p.time, location: p.location,
          color: "blue",
        });
        break;
      case "memo_add":
        store.addMemo({
          id, title: p.title || "새 메모",
          content: p.content || "", pinned: false,
          createdAt: now, updatedAt: now,
        });
        break;
      case "todo_add":
        store.addTodo({
          id, title: p.title || "새 할일",
          done: false, deadline: p.deadline,
          priority: (p.priority as "high" | "medium" | "low") || "medium",
          createdAt: now,
        });
        break;
      case "briefing":
        await handleBriefing();
        break;
      case "search":
      case "memo_search":
      case "calendar_query":
      case "todo_query":
        await handleSearch(p.query || p.keyword || p.filter || "");
        break;
    }
  }, [store]);

  const handleBriefing = async () => {
    setLoading(true);
    try {
      const text = await generateBriefing(
        store.events, store.todos, store.memos
      );
      store.setBriefing({
        text,
        generatedAt: new Date().toLocaleTimeString("ko-KR"),
        stats: {
          events: store.events.length,
          pendingTodos: store.todos.filter((t) => !t.done).length,
          recentMemos: store.memos.length,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const results = await searchAll(
        query, store.events, store.memos, store.todos
      );
      setSearchResults(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={\`min-h-screen transition-colors \${
      store.isDark ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }\`}>
      <header className="p-4 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">🗣️ AI 개인 비서</h1>
        <button
          onClick={store.toggleTheme}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700"
        >
          {store.isDark ? "☀️ 라이트" : "🌙 다크"}
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <CommandBar onIntent={handleIntent} />

        {searchResults && (
          <SearchResults
            results={searchResults.results}
            answer={searchResults.answer}
            onClose={() => setSearchResults(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalendarWidget events={store.events} />
          <MemoWidget memos={store.memos} />
          <TodoWidget todos={store.todos} onToggle={store.toggleTodo} />
          <BriefingWidget
            briefing={store.briefing}
            onGenerate={handleBriefing}
            loading={loading}
          />
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-400">
        📊 일정: {store.events.length} | 메모: {store.memos.length} |
        할일: {store.todos.filter((t) => !t.done).length}/
        {store.todos.length} 완료
      </footer>
    </div>
  );
}
\`\`\`

#### SearchResults.tsx:
\`\`\`tsx
import type { SearchResult } from "../types/assistant";

interface Props {
  results: SearchResult[];
  answer: string;
  onClose: () => void;
}

const modIcons: Record<string, string> = {
  calendar: "📅", memo: "📝", todo: "✅",
};

export default function SearchResults({ results, answer, onClose }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg
                    border-2 border-blue-200 dark:border-blue-800">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">🔍 검색 결과</h3>
        <button onClick={onClose}
                className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mb-3">
        <p className="text-sm">{answer}</p>
      </div>
      <ul className="space-y-2">
        {results.map((r, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span>{modIcons[r.module] || "📄"}</span>
            <span className="text-gray-400">[{r.date}]</span>
            <span className="font-medium">{r.title}</span>
            <span className="text-xs text-gray-400 ml-auto">
              {(r.relevance * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

---

### 7단계: 마무리 + 테스트 (15분)

\`\`\`bash
npm run dev
\`\`\`

**테스트 체크리스트:**
- [ ] 텍스트 입력으로 "내일 3시 미팅 잡아줘" → 캘린더에 추가되는지
- [ ] 🎤 음성 버튼 → 말하면 인식되고 명령 실행되는지
- [ ] "장보기 목록 메모해" → 메모 위젯에 추가되는지
- [ ] "보고서 작성 할일 추가" → 할일 위젯에 추가되는지
- [ ] "브리핑 해줘" → AI 가 오늘의 요약 생성하는지
- [ ] "지난주 회의 내용 찾아줘" → 통합 검색 결과 표시되는지
- [ ] 다크/라이트 모드 전환 작동하는지
- [ ] 새로고침해도 데이터 유지되는지 (localStorage)
- [ ] 할일 클릭 시 완료/미완료 토글되는지
- [ ] 모바일 반응형 레이아웃 확인`,
    },

    // ─── 챌린지 ───
    {
      type: "markdown",
      source: `## 🏆 도전 과제

### 🥉 브론즈: 반복 일정
- 매주/매달 반복 옵션 추가 (recurrence 필드)
- "매주 월요일 9시 스탠드업" 같은 명령 지원

### 🥈 실버: 스마트 알림
- 일정 시작 전 알림 (Notification API)
- 기한 임박 할일 자동 하이라이트
- 아침 자동 브리핑 (앱 첫 접속 시)

### 🥇 골드: 대화형 비서
- 이전 대화 기억 (대화 히스토리)
- "아까 추가한 미팅 취소해줘" 같은 맥락 있는 명령
- 음성 응답 (==Web Speech Synthesis API==)
- 주간/월간 리포트 AI 자동 생성`,
    },

    // ─── 퀴즈 ───
  ],

  quiz: {
    title: "W33 AI 개인 비서 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "AI 비서에서 '인텐트(Intent)'란 무엇인가요?",
        options: [
          "AI 모델의 학습 데이터",
          "사용자 발화 속에 담긴 의도를 분류한 것",
          "브라우저의 음성 인식 API",
          "캘린더 이벤트의 타입",
        ],
        correctIndex: 1,
        explanation:
          "인텐트는 '사용자가 무엇을 하려는지'를 구조화한 것이에요. 'calendar_add', 'memo_search' 같은 분류가 인텐트입니다. Siri, Alexa 등 모든 AI 비서의 핵심 구조예요.",
      },
      {
        type: "multiple-choice",
        question:
          "Web Speech API의 SpeechRecognition 에서 `lang` 속성을 'ko-KR'로 설정하면 어떤 효과가 있나요?",
        options: [
          "AI 모델이 한국어를 학습한다",
          "브라우저가 한국어 음성을 인식한다",
          "텍스트가 자동으로 한국어로 번역된다",
          "한국어 키보드가 자동으로 활성화된다",
        ],
        correctIndex: 1,
        explanation:
          "SpeechRecognition.lang 은 음성 인식 엔진에 어떤 언어를 인식할지 알려주는 설정이에요. 'ko-KR'은 한국어(대한민국)를 인식하도록 지정합니다.",
      },
      {
        type: "multiple-choice",
        question:
          "일일 브리핑 생성에서 가장 중요한 프롬프트 엔지니어링 기법은?",
        options: [
          "모델 온도를 0으로 설정",
          "사용자 데이터를 컨텍스트로 주입하고 톤/형식을 지정",
          "가능한 긴 프롬프트를 작성",
          "영어로 프롬프트를 작성한 후 번역",
        ],
        correctIndex: 1,
        explanation:
          "브리핑의 핵심은 '데이터 주입 + 톤 설정'이에요. 같은 일정·할일 데이터라도 '따뜻한 비서 톤'을 지정하면 결과가 완전히 달라집니다. 실제 데이터를 컨텍스트로 주입하는 것이 RAG 패턴의 기본이에요.",
      },
      {
        type: "predict-output",
        question:
          "다음 코드의 실행 결과를 예측하세요.",
        code: `const todos = [
  { title: "A", done: false, priority: "high" },
  { title: "B", done: true,  priority: "high" },
  { title: "C", done: false, priority: "low" },
];
const pending = todos.filter(t => !t.done);
console.log(pending.length, pending[0].title);`,
        options: [
          '3 "A"',
          '2 "A"',
          '1 "B"',
          '2 "C"',
        ],
        correctIndex: 1,
        explanation:
          "filter(t => !t.done) 은 done 이 false 인 항목만 남깁니다. A(false)와 C(false) 2개가 남고, 첫 번째는 A 이므로 '2 \"A\"'가 출력됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "이 워크샵에서 localStorage 를 데이터 저장소로 선택한 이유로 가장 적절한 것은?",
        options: [
          "가장 빠른 데이터베이스이기 때문",
          "서버 없이 브라우저에서 데이터를 영속할 수 있는 가장 간단한 방법",
          "여러 기기 간 데이터 동기화가 되기 때문",
          "복잡한 쿼리를 지원하기 때문",
        ],
        correctIndex: 1,
        explanation:
          "localStorage 는 서버나 DB 없이 브라우저에서 키-값 데이터를 영속할 수 있는 가장 간단한 방법이에요. 새로고침해도 유지됩니다. 다만 기기 간 동기화는 안 되고, 복잡한 쿼리도 불가능해요. MVP 에는 충분하지만 프로덕션에서는 Supabase 같은 서비스가 필요해요.",
      },
    ],
  } satisfies Quiz,
};
