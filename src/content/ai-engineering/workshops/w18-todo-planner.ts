import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W18 — AI 투두 플래너.
 *
 * Part A: 자연어 파싱 + AI 우선순위 + 일일 플랜 체험 (LLM 셀)
 * Part B: MD 레시피로 칸반 보드 + PWA 오프라인 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW18: Lesson = {
  id: "ai-eng-w18-todo-planner",
  language: "ai-engineering",
  track: "beginner",
  order: 118,
  title: "W18: AI 투두 플래너",
  subtitle: "자연어로 할일 추가하고 AI가 우선순위 정리",
  estimatedMinutes: 120,
  cells: [
    // ─── 인트로 ───
    {
      type: "markdown",
      source: `# 📋 AI 투두 플래너 — 자연어로 할일 관리하기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**자연어로 할일을 추가하면 AI 가 파싱하고, 우선순위를 매기고, ==칸반== 보드에 정리하는 투두 앱.**
오프라인에서도 작동하는 ==PWA== 로 만들어서 스마트폰 홈 화면에 설치할 수 있습니다.

### 완성 모습
\`\`\`
┌─ AI 투두 플래너 ───────────────────────────────────────────────────────┐
│  📋 AI Todo Planner                              🌙 다크모드  [+ 추가] │
├────────────────────────────────────────────────────────────────────────┤
│  💬 "내일까지 보고서 쓰기, 금요일 회의 준비, 매주 월요일 운동"          │
│     [AI 파싱하기]                                                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  📌 할일 (Todo)         🔄 진행중 (Doing)       ✅ 완료 (Done)         │
│  ┌──────────────┐      ┌──────────────┐       ┌──────────────┐        │
│  │ 🔴 보고서 쓰기│      │ 🟡 회의 준비  │       │ ✅ 장보기     │        │
│  │ 📅 내일까지   │      │ 📅 금요일     │       │ 완료 04/17   │        │
│  │ drag ≡       │      │ drag ≡       │       │              │        │
│  ├──────────────┤      └──────────────┘       └──────────────┘        │
│  │ 🟢 운동      │                                                     │
│  │ 🔁 매주 월요일│                                                     │
│  │ drag ≡       │                                                     │
│  └──────────────┘                                                     │
│                                                                        │
│  [🤖 AI 일일 플랜 생성]  [📊 통계]                                     │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 자연어 파싱 + 우선순위 + 일일 플랜 | 40분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 칸반 보드 + PWA 웹앱 완성 | 80분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 자연어 → AI 투두 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: AI 투두 두뇌 만들기 (40분)

일반 투두 앱은 사용자가 제목, 날짜, 우선순위를 하나하나 입력해야 해요.
우리는 **AI 가 자연어를 분석해서 자동으로 구조화** 합니다.

핵심 개념 3가지:
1. **자연어 파싱** — "내일까지 보고서 쓰기" → \`{ title: "보고서 쓰기", dueDate: "내일" }\`
2. **AI 우선순위** — 마감일, 중요도, 의존성을 고려한 자동 정렬
3. **일일 플랜** — 남은 시간과 에너지를 고려한 시간표 생성`,
    },

    // ─── A-1: 자연어 → 할일 파싱 ───
    {
      type: "markdown",
      source: `### A-1. 자연어 → 할일 파싱 — 한 줄로 여러 할일 추가

사람은 할일을 자유롭게 말합니다:
- "내일까지 보고서 쓰기, 금요일 회의 준비"
- "매주 월요일 운동하기"
- "엄마 생신 선물 사기 — 다음주 화요일 전에"

AI 에게 이런 자연어를 **JSON 구조** 로 바꾸게 하면, 코드에서 바로 사용할 수 있어요.
==JSON 모드== 로 응답 형식을 강제합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 자연어 → 구조화된 할일 JSON 파싱
const today = new Date().toISOString().split("T")[0]; // 오늘 날짜

const systemPrompt = \`너는 할일(todo) 파싱 AI 야.
사용자가 자연어로 할일을 말하면, 아래 JSON 배열로 변환해.

오늘 날짜: \${today}

[응답 형식 — 반드시 JSON 배열로]
[
  {
    "title": "할일 제목",
    "dueDate": "YYYY-MM-DD 또는 null",
    "isRecurring": false,
    "recurringPattern": null,
    "category": "work | personal | health | study | other",
    "estimatedMinutes": 30
  }
]

[규칙]
1. "내일" → 오늘 +1일, "금요일" → 이번주 금요일, "다음주" → +7일 계산
2. "매주", "매일" 등 반복 패턴이면 isRecurring=true, recurringPattern 에 설명
3. estimatedMinutes 는 합리적으로 추정 (회의=60, 운동=40, 보고서=90 등)
4. 한 문장에 여러 할일이 있으면 각각 별도 객체로 분리
5. 반드시 JSON 배열만 응답해. 설명 텍스트 없이.\`;

// 테스트: 다양한 자연어 입력
const inputs = [
  "내일까지 보고서 쓰기, 금요일 회의 준비",
  "매주 월요일 아침 운동, 매일 영어 공부 30분",
  "엄마 생신 선물 사기 — 다음주 화요일 전에, 주말에 장보기",
];

for (const input of inputs) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: input },
    ],
  });

  console.log("💬 입력:", input);
  try {
    const todos = JSON.parse(res.text);
    for (const todo of todos) {
      const recurring = todo.isRecurring ? \` 🔁 \${todo.recurringPattern}\` : "";
      const due = todo.dueDate ? \` 📅 \${todo.dueDate}\` : "";
      console.log(\`  📌 \${todo.title} [\${todo.category}] ~\${todo.estimatedMinutes}분\${due}\${recurring}\`);
    }
  } catch {
    console.log("  ⚠️ JSON 파싱 실패:", res.text.slice(0, 100));
  }
  console.log("─".repeat(50));
}`,
      hints: [
        "핵심: system prompt 에 오늘 날짜를 넣어야 '내일', '금요일' 같은 상대 날짜를 계산할 수 있어요.",
        "JSON 배열로 응답하게 하면 여러 할일을 한번에 파싱할 수 있습니다.",
        "실제 앱에서는 JSON.parse 실패 시 재시도 로직이 필요해요 (AI 가 가끔 설명을 덧붙이거든요).",
      ],
    },

    // ─── A-2: AI 우선순위 추천 ───
    {
      type: "markdown",
      source: `### A-2. AI 우선순위 추천 — 뭘 먼저 할까?

할일이 쌓이면 **뭘 먼저 해야 할지** 가 고민이에요.
AI 에게 할일 목록을 주고, 마감일 · 중요도 · 소요시간을 고려한 우선순위를 추천받습니다.

==아이젠하워 매트릭스== (긴급/중요 2x2) 같은 프레임워크를 AI 에게 가르치면
더 체계적인 추천이 가능해요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// AI 우선순위 추천 — 마감일·중요도 기반 정렬
const today = new Date().toISOString().split("T")[0];

const tasks = [
  { id: 1, title: "프로젝트 발표 자료 만들기", dueDate: "2026-04-18", category: "work", estimatedMinutes: 120 },
  { id: 2, title: "운동하기", dueDate: null, category: "health", estimatedMinutes: 40, isRecurring: true },
  { id: 3, title: "엄마 생신 선물 사기", dueDate: "2026-04-22", category: "personal", estimatedMinutes: 60 },
  { id: 4, title: "영어 단어 암기", dueDate: null, category: "study", estimatedMinutes: 30, isRecurring: true },
  { id: 5, title: "팀 회의록 정리", dueDate: "2026-04-17", category: "work", estimatedMinutes: 45 },
  { id: 6, title: "치과 예약", dueDate: "2026-04-25", category: "personal", estimatedMinutes: 15 },
  { id: 7, title: "블로그 글 초안", dueDate: "2026-04-20", category: "work", estimatedMinutes: 90 },
];

const systemPrompt = \`너는 생산성 코치 AI 야.
사용자의 할일 목록을 분석해서 우선순위를 추천해.

오늘 날짜: \${today}

[분석 프레임워크 — 아이젠하워 매트릭스]
- 🔴 긴급+중요: 마감 임박(1~2일) + 업무/중요 약속 → 최우선
- 🟡 중요+비긴급: 마감 여유 있지만 중요한 것 → 2순위 (시간 확보)
- 🟢 긴급+비중요: 빨리 끝낼 수 있는 작은 일 → 3순위 (빠르게 처리)
- ⚪ 비긴급+비중요: 나중에 해도 되는 것 → 4순위

[응답 형식 — 반드시 JSON 으로]
{
  "prioritizedTasks": [
    {
      "id": 1,
      "title": "할일 제목",
      "priority": "🔴 긴급+중요" | "🟡 중요" | "🟢 빠르게" | "⚪ 나중에",
      "reason": "이 순위인 이유 (한 줄)",
      "suggestedOrder": 1
    }
  ],
  "advice": "오늘의 전체 조언 (한 줄)"
}\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`오늘의 할일 목록:\\n\${JSON.stringify(tasks, null, 2)}\` },
  ],
});

try {
  const result = JSON.parse(res.text);
  console.log("🎯 AI 우선순위 추천\\n");
  for (const t of result.prioritizedTasks) {
    console.log(\`  \${t.suggestedOrder}. \${t.priority} \${t.title}\`);
    console.log(\`     → \${t.reason}\`);
  }
  console.log(\`\\n💡 조언: \${result.advice}\`);
} catch {
  console.log("AI 응답:", res.text);
}`,
      hints: [
        "핵심: 아이젠하워 매트릭스를 system prompt 에 넣으면 AI 가 체계적으로 분류해요.",
        "마감일까지 남은 일수 계산을 AI 에게 맡기면, 오늘 날짜를 꼭 알려줘야 합니다.",
        "실제 앱에서는 사용자의 과거 완료 패턴도 반영하면 더 정확한 추천이 됩니다.",
      ],
    },

    // ─── A-3: 일일 플랜 생성 ───
    {
      type: "markdown",
      source: `### A-3. 일일 플랜 생성 — AI 가 시간표를 짜준다

할일의 우선순위를 정했으면, 이제 **오늘 하루 시간표** 를 짜야 해요.
AI 에게 가용 시간과 할일 목록을 주면, 현실적인 일일 플랜을 생성합니다.

포인트: AI 가 **예상 소요시간 + 집중력 곡선 + 휴식** 까지 고려하면
단순 나열보다 훨씬 실용적인 플랜이 됩니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// AI 일일 플랜 생성 — 시간표 + 휴식 배치
const today = new Date().toISOString().split("T")[0];

const mySchedule = {
  availableFrom: "09:00",
  availableUntil: "18:00",
  lunchBreak: "12:00-13:00",
  existingMeetings: [
    { time: "10:00-10:30", title: "팀 스탠드업" },
    { time: "15:00-16:00", title: "프로젝트 리뷰" },
  ],
};

const todayTasks = [
  { title: "팀 회의록 정리", estimatedMinutes: 45, priority: "🔴 긴급+중요" },
  { title: "프로젝트 발표 자료 만들기", estimatedMinutes: 120, priority: "🔴 긴급+중요" },
  { title: "블로그 글 초안", estimatedMinutes: 90, priority: "🟡 중요" },
  { title: "영어 단어 암기", estimatedMinutes: 30, priority: "🟢 빠르게" },
  { title: "운동하기", estimatedMinutes: 40, priority: "🟢 빠르게" },
  { title: "이메일 정리", estimatedMinutes: 20, priority: "⚪ 나중에" },
];

const systemPrompt = \`너는 시간 관리 전문 AI 야.
사용자의 가용 시간과 할일 목록을 보고 현실적인 일일 플랜을 짜줘.

오늘 날짜: \${today}

[시간 배치 규칙]
1. 오전(09~12시): 집중력 높은 시간 → 🔴 긴급+중요 작업 배치
2. 점심 후(13~14시): 가벼운 작업 → 🟢 빠르게 처리할 것
3. 오후(14~18시): 보통 집중력 → 🟡 중요 작업 + 나머지
4. 큰 작업(90분+)은 25분 작업 + 5분 휴식 (포모도로) 로 분할
5. 기존 회의 시간은 비워둬야 함
6. 하루에 다 못하면 솔직히 "내일로 미룰 항목" 을 알려줘

[응답 형식 — 반드시 JSON 으로]
{
  "dailyPlan": [
    {
      "time": "09:00-09:45",
      "task": "할일 제목",
      "type": "work | break | meeting",
      "note": "짧은 설명"
    }
  ],
  "totalWorkMinutes": 300,
  "deferred": ["내일로 미룬 항목"],
  "tip": "오늘의 생산성 팁 (한 줄)"
}\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: \`내 스케줄:\\n\${JSON.stringify(mySchedule, null, 2)}\\n\\n오늘 할일:\\n\${JSON.stringify(todayTasks, null, 2)}\`,
    },
  ],
});

try {
  const plan = JSON.parse(res.text);
  console.log("📅 오늘의 AI 플랜\\n");
  for (const slot of plan.dailyPlan) {
    const icon = slot.type === "break" ? "☕" : slot.type === "meeting" ? "👥" : "💼";
    console.log(\`  \${slot.time}  \${icon} \${slot.task}\`);
    if (slot.note) console.log(\`              → \${slot.note}\`);
  }
  console.log(\`\\n⏱️ 총 작업 시간: \${plan.totalWorkMinutes}분\`);
  if (plan.deferred?.length) {
    console.log(\`📌 내일로 미룸: \${plan.deferred.join(", ")}\`);
  }
  console.log(\`💡 팁: \${plan.tip}\`);
} catch {
  console.log("AI 응답:", res.text);
}`,
      hints: [
        "핵심: 가용 시간(기존 회의 제외)과 할일 소요시간을 함께 주면 AI 가 현실적 플랜을 짜요.",
        "포모도로 기법(25분+5분)을 규칙에 넣으면 긴 작업이 자동 분할됩니다.",
        "실제 앱에서는 사용자의 완료 기록을 분석해 예상 시간을 보정할 수 있어요.",
      ],
    },

    // ─── Part A 완료 ───
    {
      type: "markdown",
      source: `## ✅ Part A 완료!

3개의 AI 두뇌를 만들었어요:

| 기능 | 입력 | 출력 |
|---|---|---|
| 자연어 파싱 | "내일까지 보고서 쓰기" | 구조화된 JSON 할일 |
| 우선순위 추천 | 할일 목록 | 아이젠하워 매트릭스 기반 정렬 |
| 일일 플랜 | 할일 + 스케줄 | 시간표 + 휴식 + 미룰 항목 |

이제 Part B 에서 이 AI 두뇌를 **칸반 보드 + PWA 웹앱** 으로 조립합니다!

---`,
    },

    // ─── Part B: MD 레시피 ───
    {
      type: "markdown",
      source: `## Part B: AI 투두 플래너 웹앱 만들기 (80분)

Claude Code 또는 Cursor 에게 아래 프롬프트를 복사해서 넘기세요.
**한번에 완성되는 풀스택 ==PWA== 앱입니다.**

---

### 🤖 AI 에게 보낼 프롬프트

\`\`\`markdown
# AI 투두 플래너 — React + TypeScript + Vite + Tailwind + @google/genai

## 프로젝트 개요
자연어 입력 → AI 파싱 → 칸반 보드로 할일을 관리하는 PWA 앱.
오프라인에서도 작동하고, 스마트폰 홈 화면에 설치 가능.

## 기술 스택
- React 18 + TypeScript + Vite
- Tailwind CSS 4 + Lucide React 아이콘
- @google/genai (Gemini API) — 자연어 파싱, 우선순위, 일일 플랜
- @hello-pangea/dnd — 드래그 앤 드롭 (칸반 보드)
- localStorage — 할일 데이터 영속화
- PWA (manifest.json + service worker) — 오프라인 지원

## 핵심 기능

### 1. 자연어 할일 입력
- 텍스트 입력창에 "내일까지 보고서, 금요일 회의 준비" 입력
- "AI 파싱" 버튼 클릭 → Gemini API 가 JSON 으로 파싱
- 파싱된 할일이 칸반 보드의 "할일" 열에 자동 추가
- 파싱 결과 미리보기 → 사용자 확인 후 추가

### 2. 칸반 보드 (3열)
- 할일(Todo) → 진행중(Doing) → 완료(Done)
- 드래그 앤 드롭으로 열 간 이동 (@hello-pangea/dnd)
- 열 내에서도 순서 변경 가능
- 각 카드에 표시: 제목, 우선순위 배지(🔴🟡🟢⚪), 마감일, 카테고리
- 카드 클릭 → 상세 보기/편집 모달

### 3. AI 우선순위 추천
- "AI 정렬" 버튼 → 현재 할일 목록을 Gemini 에 전송
- 아이젠하워 매트릭스(긴급/중요) 기반 우선순위 추천
- 추천 결과를 칸반 보드에 반영 (사용자 승인 후)

### 4. 일일 플랜 생성
- "오늘의 플랜" 버튼 → 가용 시간 입력 모달
- AI 가 할일 + 가용 시간 고려한 시간표 생성
- 포모도로(25분+5분) 기반 분할
- 타임라인 뷰로 시각화

### 5. 반복 할일
- "매주 월요일 운동" 같은 반복 패턴 인식
- 🔁 아이콘으로 표시
- 완료 시 다음 반복 자동 생성

### 6. 마감일 표시
- 📅 마감일 배지
- D-day 카운트다운 (D-1, D-day, D+2 ...)
- 마감 지난 항목은 빨간색 강조

### 7. 다크/라이트 모드
- 시스템 설정 감지 + 수동 토글
- Tailwind dark: 클래스 활용
- 선택 localStorage 에 저장

### 8. PWA (오프라인 지원)
- manifest.json: 앱 이름, 아이콘(SVG 기반), 테마 색상, display: standalone
- Service Worker (vite-plugin-pwa):
  - 정적 에셋 프리캐시
  - 오프라인 폴백 페이지
  - API 호출은 온라인 시에만 (오프라인이면 "오프라인 모드" 알림)
- 설치 프롬프트 UI ("홈 화면에 추가")

### 9. localStorage 영속화
- 할일 목록, 보드 상태, 설정을 localStorage 에 저장
- 탭 간 동기화 (storage 이벤트 리스닝)
- JSON 직렬화/역직렬화 유틸

## 페이지 구조
- / — 메인 (칸반 보드 + 자연어 입력)
- 단일 페이지 앱 (SPA), 모달로 상세/설정 처리

## 디자인 가이드
- Tailwind 기본 색상: indigo(주), gray(보조)
- 카드: rounded-xl shadow-md, 호버 시 shadow-lg
- 우선순위 배지: 🔴 bg-red-100 / 🟡 bg-yellow-100 / 🟢 bg-green-100 / ⚪ bg-gray-100
- 반응형: 모바일은 열을 세로 스택, 데스크톱은 3열 가로
- 애니메이션: 카드 추가 시 fade-in, 드래그 시 그림자 효과

## 환경변수
- VITE_GEMINI_API_KEY — Gemini API 키 (.env 파일)

## 폴더 구조
src/
  components/
    KanbanBoard.tsx      — 3열 칸반 보드
    TaskCard.tsx          — 할일 카드 컴포넌트
    TaskModal.tsx         — 할일 상세/편집 모달
    NaturalInput.tsx      — 자연어 입력 + AI 파싱
    DailyPlan.tsx         — 일일 플랜 타임라인
    PriorityBadge.tsx     — 우선순위 배지
    Header.tsx            — 헤더 (다크모드 토글)
    InstallPrompt.tsx     — PWA 설치 프롬프트
  hooks/
    useLocalStorage.ts    — localStorage 영속화 훅
    useTasks.ts           — 할일 CRUD + 보드 상태 관리
    useAI.ts              — Gemini API 호출 (파싱/우선순위/플랜)
    useDarkMode.ts        — 다크모드 상태 관리
  lib/
    gemini.ts             — @google/genai 초기화 + 프롬프트
    prompts.ts            — AI 프롬프트 템플릿 (파싱/우선순위/플랜)
  types/
    task.ts               — Task, Column, DailyPlan 타입 정의
  App.tsx
  main.tsx
\`\`\`

---

### 💡 빌드 & 실행

\`\`\`bash
# 프로젝트 생성
npm create vite@latest ai-todo-planner -- --template react-ts
cd ai-todo-planner

# 의존성 설치
npm install @google/genai @hello-pangea/dnd lucide-react
npm install -D tailwindcss @tailwindcss/vite vite-plugin-pwa

# 환경변수
echo "VITE_GEMINI_API_KEY=여기에_API_키" > .env

# 실행
npm run dev
\`\`\`

### ✨ 추가 팁

- **오프라인 테스트**: 크롬 DevTools → Network → Offline 체크 후 새로고침
- **PWA 설치 테스트**: 크롬 주소창 오른쪽 설치 아이콘 클릭
- **모바일 테스트**: \`npm run dev -- --host\` 후 같은 Wi-Fi 에서 폰 접속`,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

기본 앱을 완성한 후 도전해보세요!

### 도전 1: AI 회고 기능
완료된 할일을 분석해서 주간 회고를 생성합니다.
- 이번 주 완료한 항목 목록
- 예상 시간 vs 실제 시간 비교
- 다음 주 제안 사항

### 도전 2: 팀 칸반 (실시간 협업)
Firebase Realtime DB 를 연결해서 팀원과 보드를 공유합니다.
- 팀원 아바타 표시
- 실시간 카드 이동 동기화
- 담당자 지정

### 도전 3: 음성 입력
Web Speech API 로 음성을 텍스트로 변환 후 AI 파싱합니다.
- 마이크 버튼 추가
- 한국어 음성 인식
- 인식 결과 → 자연어 파싱 파이프라인 연결

### 도전 4: 캘린더 동기화
Google Calendar API 와 연동하여:
- 기존 일정을 가용 시간에서 자동 제외
- 일일 플랜을 캘린더에 자동 등록
- 마감일을 캘린더 이벤트로 생성

---`,
    },

    // ─── 완료 + W19 예고 ───
    {
      type: "markdown",
      source: `## 🎉 W18 완료!

축하합니다! AI 투두 플래너를 완성했어요.

### 배운 것 정리

| 개념 | 설명 |
|---|---|
| **자연어 파싱** | 사람의 말을 AI 가 JSON 구조로 변환 |
| **아이젠하워 매트릭스** | 긴급/중요 기준으로 우선순위 분류 |
| **일일 플랜 생성** | 가용 시간 + 할일 → AI 시간표 |
| **==칸반== 보드** | 할일/진행중/완료 3열 워크플로우 |
| **==PWA==** | 오프라인 지원 + 홈 화면 설치 가능한 웹앱 |
| **드래그 앤 드롭** | @hello-pangea/dnd 라이브러리 활용 |

### 다음 워크샵 예고

> 🏋️ **W19: AI 운동 트래커** — 운동 기록을 AI 가 분석하고, 맞춤 루틴을 추천하는 피트니스 앱을 만듭니다!`,
    },
  ],

  quiz: {
    title: "W18 퀴즈 — AI 투두 플래너",
    questions: [
      {
        type: "multiple-choice",
        question:
          "자연어 '내일까지 보고서 쓰기' 를 AI 가 구조화된 데이터로 변환할 때, system prompt 에 반드시 포함해야 하는 정보는?",
        options: [
          "AI 모델의 버전 정보",
          "오늘 날짜 (상대 날짜 계산용)",
          "사용자의 이메일 주소",
          "이전 대화 히스토리 전체",
        ],
        correctIndex: 1,
        explanation:
          "'내일', '금요일' 같은 상대 날짜를 정확히 계산하려면 AI 가 오늘 날짜를 알아야 합니다. system prompt 에 오늘 날짜를 넣어주는 것이 핵심이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "아이젠하워 매트릭스에서 '마감이 내일인 팀 프로젝트 발표 자료' 는 어디에 해당할까요?",
        options: [
          "긴급하지 않음 + 중요하지 않음 → 나중에",
          "긴급함 + 중요하지 않음 → 빠르게 처리",
          "긴급함 + 중요함 → 최우선",
          "긴급하지 않음 + 중요함 → 시간 확보",
        ],
        correctIndex: 2,
        explanation:
          "마감이 내일(긴급) + 팀 프로젝트 발표(중요) → '긴급+중요' 영역입니다. 아이젠하워 매트릭스에서 최우선으로 처리해야 할 항목이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "PWA(Progressive Web App) 가 오프라인에서 작동하려면 필수적으로 필요한 것은?",
        options: [
          "React Server Components",
          "Service Worker + 캐시 전략",
          "WebSocket 연결",
          "CDN 호스팅",
        ],
        correctIndex: 1,
        explanation:
          "PWA 의 오프라인 지원 핵심은 Service Worker 입니다. 정적 에셋을 미리 캐시(프리캐시)하고, 네트워크 요청을 가로채서 캐시된 응답을 반환하는 방식으로 오프라인에서도 앱이 작동합니다.",
      },
    ],
  } satisfies Quiz,
};
