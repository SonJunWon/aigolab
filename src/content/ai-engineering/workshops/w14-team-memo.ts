import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W14 — AI 팀 협업 메모보드.
 *
 * Part A: 메모 분류·요약·액션 아이템 추출 체험 (LLM 셀)
 * Part B: MD 레시피로 Supabase Realtime 기반 팀 메모보드 완성 (Claude Code / Cursor)
 */
export const workshopW14: Lesson = {
  id: "ai-eng-w14-team-memo",
  language: "ai-engineering",
  track: "beginner",
  order: 114,
  title: "W14: AI 팀 협업 메모보드",
  subtitle: "실시간 동기화되는 팀 메모장 + AI 요약·분류",
  estimatedMinutes: 180,
  cells: [
    {
      type: "markdown",
      source: `# 📋 AI 팀 협업 메모보드 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**팀원들이 실시간으로 메모를 공유하고, AI 가 자동 분류·요약·액션 아이템 추출까지 해주는 협업 메모보드** — Supabase ==Realtime== 으로 여러 사람이 동시에 작업하고, 변경 사항이 즉시 반영됩니다.

### 완성 모습
\`\`\`
┌──────────────────────────────────────────────────────┐
│  📋 팀 메모보드            🔍 검색   🌙  👤민지 👤서준 │
├──────────────────────┬────────────────────────────────┤
│                      │  🤖 AI 요약 사이드바            │
│  📌 고정된 메모       │  ┌────────────────────────┐    │
│  ┌────────────────┐  │  │ 📊 오늘의 요약          │    │
│  │ 🟡 할일         │  │  │                        │    │
│  │ 서버 배포 확인  │  │  │ 회의에서 3개 결정사항,  │    │
│  │    📌 — 서준   │  │  │ 할일 5개, 아이디어 2개  │    │
│  └────────────────┘  │  │ 가 논의됨.              │    │
│                      │  └────────────────────────┘    │
│  일반 메모            │                                │
│  ┌────────────────┐  │  ✅ 액션 아이템               │
│  │ 🔵 아이디어     │  │  □ 서준: 서버 배포 (목요일)   │
│  │ 온보딩 개선안   │  │  □ 민지: 디자인 시안 (금요일)  │
│  │       — 민지   │  │  ☑ 지훈: API 문서 업데이트     │
│  ├────────────────┤  │                                │
│  │ 🟢 회의록       │  │  📂 카테고리별 현황            │
│  │ 스프린트 회의   │  │  🟡 할일: 5개                  │
│  │ 결정: API v2로  │  │  🔵 아이디어: 3개              │
│  │       — 지훈   │  │  🟢 회의록: 2개                │
│  ├────────────────┤  │  🟣 참고자료: 1개              │
│  │ 🟣 참고자료     │  │                                │
│  │ Supabase 가이드 │  │                                │
│  │       — 서준   │  │                                │
│  └────────────────┘  │                                │
│                      │                                │
│  [+ 새 메모 추가]     │                                │
└──────────────────────┴────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 메모 분류·요약·액션 아이템 추출 체험 | 60분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 팀 메모보드 앱 완성 | 120분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **Part B 전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)
> Part B 는 Supabase 프로젝트가 필요합니다 (무료 플랜 OK). https://supabase.com`,
    },

    // ─── Part A: 메모 분류·요약·액션 아이템 추출 ───
    {
      type: "markdown",
      source: `## Part A: 메모 분류·요약·액션 아이템 추출 체험 (60분)

팀에서 메모가 쌓이면 금방 정리가 안 돼요. AI 가 해결합니다:
1. **자동 분류** — 메모를 카테고리별로 색깔 태그 (🟡할일 / 🔵아이디어 / 🟢회의록 / 🟣참고자료)
2. **요약 생성** — 여러 메모를 한 문장으로 요약
3. **액션 아이템 추출** — 회의록에서 "누가, 뭘, 언제까지" 를 자동으로 뽑아냄

==Realtime== 은 서버와 클라이언트가 항상 연결되어 있어서 변경 즉시 전파하는 기술이에요. ==WebSocket== 이라는 양방향 통신 프로토콜 위에서 동작합니다.

> 💡 ==WebSocket== 은 HTTP 와 달리 한 번 연결하면 서버↔클라이언트 양쪽에서 자유롭게 데이터를 보낼 수 있는 프로토콜이에요!`,
    },

    {
      type: "markdown",
      source: `### A-1. 메모 자동 분류 — 카테고리 색깔 태그 달기

팀 메모를 하나하나 분류하기 귀찮죠? AI 에게 맡기면 됩니다.
4가지 카테고리: 🟡 할일 / 🔵 아이디어 / 🟢 회의록 / 🟣 참고자료`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-1: 메모를 4가지 카테고리로 자동 분류
const memos = [
  "금요일까지 로그인 페이지 디자인 완성하기",
  "온보딩 플로우에 튜토리얼 영상 추가하면 좋겠다",
  "스프린트 회의: API v2 채택 결정, 다음 주 월요일 시작",
  "Supabase Row Level Security 공식 문서 링크: https://supabase.com/docs/guides/auth",
  "서버 모니터링 대시보드 만들어야 함 — 지훈 담당",
  "사용자 피드백: 다크 모드 지원 요청이 많음",
  "주간 회의 요약 — DB 마이그레이션 일정 확정, QA 금요일 시작",
  "React Query vs SWR 비교 아티클 정리해둠",
];

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 팀 메모 분류 AI야. 메모 목록을 받으면 각 메모를 4가지 카테고리 중 하나로 분류해.
반드시 JSON 배열로만 답해. 다른 텍스트 없이.

[
  {
    "memo": "원본 메모 텍스트",
    "category": "todo | idea | meeting | reference",
    "emoji": "🟡 | 🔵 | 🟢 | 🟣",
    "label": "할일 | 아이디어 | 회의록 | 참고자료",
    "confidence": 0.0~1.0,
    "reason": "이 카테고리로 분류한 이유 (한 줄)"
  }
]

분류 기준:
- todo (🟡 할일): 해야 할 일, 마감일 언급, "~하기", 담당자 지정
- idea (🔵 아이디어): 제안, "~하면 좋겠다", 개선안, 피드백
- meeting (🟢 회의록): 회의 내용, 결정사항, 논의 결과
- reference (🟣 참고자료): 링크, 문서, 비교 정리, 학습 자료\`,
    },
    {
      role: "user",
      content: \`이 메모들을 분류해줘:\\n\${memos.map((m, i) => \`\${i + 1}. \${m}\`).join("\\n")}\`,
    },
  ],
});

console.log("📋 메모 자동 분류 결과:");
console.log(response.text);

try {
  const classified = JSON.parse(response.text);
  const grouped: Record<string, typeof classified> = {};

  for (const item of classified) {
    const key = item.label;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }

  for (const [label, items] of Object.entries(grouped)) {
    console.log(\`\\n── \${(items as any[])[0].emoji} \${label} (\${(items as any[]).length}개) ──\`);
    for (const item of items as any[]) {
      console.log(\`  • \${item.memo}\`);
      console.log(\`    신뢰도: \${Math.round(item.confidence * 100)}% | \${item.reason}\`);
    }
  }
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "memos 배열에 자기 팀의 실제 메모를 넣어보세요!",
        "confidence 가 낮은 메모는 여러 카테고리에 걸칠 수 있어요. 실제 앱에서는 사용자가 수정할 수 있게 합니다.",
        "실제 앱에서는 새 메모를 작성하면 자동으로 분류되어 색깔 태그가 붙습니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 메모 요약 — 여러 메모를 한 눈에 정리

팀 메모가 20개, 30개 쌓이면 다 읽을 시간이 없어요.
AI 에게 "오늘 메모 요약해줘" 하면 핵심만 뽑아줍니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-2: 여러 메모를 요약 보고서로 생성
const teamMemos = [
  { author: "민지", text: "로그인 페이지 디자인 시안 3개 완성. 팀 투표 필요", category: "할일" },
  { author: "서준", text: "서버 배포 스크립트 작성 완료. 목요일 배포 예정", category: "할일" },
  { author: "지훈", text: "스프린트 회의 — API v2 채택 결정. REST → GraphQL 전환은 보류", category: "회의록" },
  { author: "민지", text: "온보딩 플로우에 인터랙티브 튜토리얼 추가 제안", category: "아이디어" },
  { author: "서준", text: "Redis 캐싱 도입하면 응답 속도 3배 개선 가능. 벤치마크 결과 첨부", category: "아이디어" },
  { author: "지훈", text: "API 문서 업데이트 완료. Swagger UI 배포함", category: "할일" },
  { author: "민지", text: "QA 시작 — 회원가입 플로우에서 버그 2개 발견. 이슈 등록함", category: "할일" },
  { author: "서준", text: "Supabase RLS 설정 가이드 정리해둠. Notion 링크 공유", category: "참고자료" },
];

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 팀 협업 요약 AI야. 팀 메모 목록을 받으면 간결한 요약 보고서를 생성해.
반드시 JSON 으로만 답해.

{
  "summary": "전체 상황을 2-3문장으로 요약",
  "highlights": ["핵심 포인트 1", "핵심 포인트 2", "핵심 포인트 3"],
  "by_category": {
    "할일": { "count": 0, "summary": "할일 카테고리 요약" },
    "아이디어": { "count": 0, "summary": "아이디어 카테고리 요약" },
    "회의록": { "count": 0, "summary": "회의록 카테고리 요약" },
    "참고자료": { "count": 0, "summary": "참고자료 카테고리 요약" }
  },
  "by_member": {
    "이름": { "count": 0, "focus": "이 사람이 주로 다루는 주제" }
  },
  "urgent": ["긴급하거나 시간 제한이 있는 항목"]
}\`,
    },
    {
      role: "user",
      content: \`오늘의 팀 메모를 요약해줘:\\n\${teamMemos.map(m => \`[\${m.category}] \${m.author}: \${m.text}\`).join("\\n")}\`,
    },
  ],
});

console.log("📊 팀 메모 요약 보고서:");
console.log(response.text);

try {
  const report = JSON.parse(response.text);

  console.log(\`\\n📝 전체 요약:\\n  \${report.summary}\`);

  console.log("\\n⭐ 핵심 포인트:");
  for (const h of report.highlights) {
    console.log(\`  • \${h}\`);
  }

  console.log("\\n📂 카테고리별:");
  for (const [cat, info] of Object.entries(report.by_category)) {
    const { count, summary } = info as { count: number; summary: string };
    console.log(\`  \${cat} (\${count}개): \${summary}\`);
  }

  if (report.urgent?.length > 0) {
    console.log("\\n🚨 긴급:");
    for (const u of report.urgent) {
      console.log(\`  ⚡ \${u}\`);
    }
  }
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "teamMemos 에 자기 팀 메모를 넣으면 실제 업무 요약을 받을 수 있어요!",
        "by_member 필드로 누가 어떤 일을 주로 하는지 한눈에 파악할 수 있습니다.",
        "실제 앱에서는 사이드바에 이 요약이 실시간으로 업데이트됩니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 액션 아이템 추출 — 회의록에서 "누가, 뭘, 언제까지" 뽑기

회의 끝나고 "그래서 누가 뭘 하기로 했지?" 하는 순간, AI 가 정리해줍니다.
회의록 텍스트를 넣으면 **담당자·할 일·마감일** 을 자동으로 추출해요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-3: 회의록에서 액션 아이템 자동 추출
const meetingNotes = \`
스프린트 14 주간 회의 (2026-04-17 오후 2시)
참석: 민지, 서준, 지훈, 하은

1. 지난주 리뷰
- 민지: 로그인 UI 완성. 소셜 로그인은 다음 스프린트로.
- 서준: 서버 배포 파이프라인 구축 완료. 목요일에 스테이징 배포할 예정.
- 지훈: API 문서 80% 완성. 이번 주 금요일까지 마무리.

2. 이번 주 계획
- 민지가 회원가입 플로우 디자인 시안을 수요일까지 공유하기로 함.
- 서준은 Redis 캐싱 POC 를 진행하고 금요일에 결과 공유.
- 하은이 QA 테스트 케이스를 목요일까지 작성.
- 지훈은 API v2 엔드포인트 구현 시작. 다음 주 수요일까지 1차 완료 목표.

3. 결정사항
- REST 유지, GraphQL 전환은 Q3 에 재논의.
- 다크 모드 우선순위 올림 — 사용자 요청 많음. 민지가 다음 스프린트에 착수.
- 모니터링 도구는 Grafana 로 통일.
\`;

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 회의록 분석 AI야. 회의록 텍스트를 받으면 액션 아이템을 추출해.
반드시 JSON 으로만 답해.

{
  "meeting_title": "회의 제목",
  "date": "날짜",
  "attendees": ["참석자1", "참석자2"],
  "decisions": [
    { "decision": "결정 내용", "context": "배경 설명" }
  ],
  "action_items": [
    {
      "assignee": "담당자",
      "task": "할 일 (명확하고 구체적으로)",
      "deadline": "마감일 (없으면 null)",
      "priority": "high | medium | low",
      "status": "pending"
    }
  ],
  "follow_ups": ["다음 회의에서 확인할 사항"]
}

규칙:
- 모호한 표현도 구체적 액션 아이템으로 변환
- 마감일이 명시되지 않았으면 null
- priority 는 마감일 임박 + 중요도로 판단\`,
    },
    {
      role: "user",
      content: \`이 회의록에서 액션 아이템을 추출해줘:\\n\${meetingNotes}\`,
    },
  ],
});

console.log("✅ 액션 아이템 추출 결과:");
console.log(response.text);

try {
  const result = JSON.parse(response.text);

  console.log(\`\\n📅 \${result.meeting_title} (\${result.date})\`);
  console.log(\`👥 참석: \${result.attendees.join(", ")}\`);

  console.log("\\n📌 결정사항:");
  for (const d of result.decisions) {
    console.log(\`  ✓ \${d.decision}\`);
  }

  console.log("\\n📋 액션 아이템:");
  const priorityIcon: Record<string, string> = { high: "🔴", medium: "🟡", low: "🟢" };
  for (const item of result.action_items) {
    const icon = priorityIcon[item.priority] || "⚪";
    const deadline = item.deadline ? \` (⏰ \${item.deadline})\` : "";
    console.log(\`  \${icon} □ \${item.assignee}: \${item.task}\${deadline}\`);
  }

  if (result.follow_ups?.length > 0) {
    console.log("\\n🔄 다음 회의 확인:");
    for (const f of result.follow_ups) {
      console.log(\`  → \${f}\`);
    }
  }
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "meetingNotes 에 실제 회의록을 넣어보세요 — 놀라울 만큼 정확하게 뽑아냅니다!",
        "priority 가 high 인 항목은 앱에서 빨간색으로 강조 표시됩니다.",
        "실제 앱에서는 추출된 액션 아이템이 체크리스트로 변환되어 담당자에게 알림이 갑니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

AI 팀 메모 관리의 핵심을 모두 체험했어요:
- ✅ 메모 자동 분류 — 4가지 카테고리 (할일/아이디어/회의록/참고자료) + 색깔 태그
- ✅ 메모 요약 — 여러 메모를 카테고리별·멤버별 보고서로 정리
- ✅ 액션 아이템 추출 — 회의록에서 "누가, 뭘, 언제까지" 자동 추출

이제 Part B 에서 **==Realtime== 으로 여러 사람이 동시에 사용하는 팀 메모보드** 를 만듭니다!

> 💡 Part B 의 핵심 기술: Supabase Auth + DB + ==Realtime== 구독 → 메모 CRUD → AI 분류/요약/액션 아이템

---

## Part B: MD 레시피로 웹앱 완성 (120분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [완성된 팀 메모보드]
\`\`\`

아래의 **MD 레시피** 를 복사해서 AI 코딩 도구에 전달하면 됩니다.

### 사전 준비: Supabase 프로젝트

1. https://supabase.com 에서 무료 계정 생성
2. "New Project" → 프로젝트 이름 입력 → 비밀번호 설정
3. Settings → API 에서 **Project URL** 과 **anon key** 복사
4. 이 값들을 Part B 의 \`.env\` 파일에 넣습니다`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 팀 협업 메모보드 웹앱 제작 요청서

## 프로젝트 개요
팀원들이 실시간으로 메모를 공유하고, AI 가 자동 분류·요약·액션 아이템 추출을
해주는 협업 메모보드를 만들어주세요.
Supabase (Auth + DB + Realtime) + Google Gemini 2.5 Flash 를 사용합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- Supabase (@supabase/supabase-js)
  - Auth: 이메일/비밀번호 회원가입·로그인
  - Database: PostgreSQL (메모 테이블)
  - Realtime: 메모 변경 실시간 구독
- @google/genai (Gemini SDK)

## Supabase 테이블 스키마

### memos 테이블
\\\`\\\`\\\`sql
create table memos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  content text not null,
  category text check (category in ('todo', 'idea', 'meeting', 'reference')) default 'todo',
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS 활성화
alter table memos enable row level security;

-- 로그인한 사용자만 모든 메모 읽기 가능
create policy "Authenticated users can read all memos"
  on memos for select
  to authenticated
  using (true);

-- 본인 메모만 생성
create policy "Users can create own memos"
  on memos for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 본인 메모만 수정
create policy "Users can update own memos"
  on memos for update
  to authenticated
  using (auth.uid() = user_id);

-- 본인 메모만 삭제
create policy "Users can delete own memos"
  on memos for delete
  to authenticated
  using (auth.uid() = user_id);
\\\`\\\`\\\`

### Realtime 활성화
Supabase 대시보드 → Database → Replication 에서 memos 테이블 Realtime 활성화.

## 기능 요구사항

### 1. 인증 (Supabase Auth)
- 이메일 + 비밀번호 회원가입 / 로그인 화면
  - 세련된 폼 (이메일 입력, 비밀번호 입력, 로그인/회원가입 탭 전환)
  - 유효성 검사 (이메일 형식, 비밀번호 6자 이상)
- 로그인 후 상단에 사용자 이름(이메일 앞부분) + 아바타 표시
- 로그아웃 버튼

### 2. 메모 CRUD
- 새 메모 추가:
  - 하단 또는 상단에 입력 영역 (textarea + 카테고리 선택 드롭다운)
  - 카테고리: 🟡 할일, 🔵 아이디어, 🟢 회의록, 🟣 참고자료
  - "추가" 버튼 또는 Ctrl+Enter 로 저장
- 메모 카드 표시:
  - 카테고리별 색상 왼쪽 테두리 (🟡 노랑, 🔵 파랑, 🟢 초록, 🟣 보라)
  - 작성자 이름, 작성 시간 (상대 시간: "3분 전")
  - 고정(📌) 아이콘: 클릭하면 상단에 고정
- 메모 수정: 더블클릭 → 인라인 편집 모드
- 메모 삭제: 본인 메모만 삭제 버튼 표시 (확인 다이얼로그)

### 3. 실시간 동기화 (Supabase Realtime)
- memos 테이블에 Realtime 구독:
  - INSERT → 새 메모가 다른 사용자 화면에 즉시 나타남
  - UPDATE → 수정·고정 상태 변경이 즉시 반영
  - DELETE → 삭제된 메모가 즉시 사라짐
- 연결 상태 표시: 🟢 실시간 연결됨 / 🔴 연결 끊김
- 새 메모 도착 시 슬라이드-인 애니메이션

### 4. AI 기능 (Gemini)
- "🤖 AI 요약" 버튼:
  - 현재 모든 메모를 Gemini 에 보내서 요약 생성
  - 사이드바에 요약 표시: 전체 요약 + 카테고리별 현황
- "📋 액션 아이템 추출" 버튼:
  - 회의록 카테고리 메모에서 액션 아이템 자동 추출
  - 체크리스트 UI (체크 가능)
- 새 메모 작성 시 "🏷️ AI 자동 분류" 토글:
  - ON 이면 메모 내용을 AI 가 분석해서 카테고리 자동 설정
  - 사용자가 수동으로 변경 가능

### 5. 검색 + 필터
- 상단 검색바: 메모 내용 실시간 필터링
- 카테고리 필터 버튼 (전체 / 🟡 / 🔵 / 🟢 / 🟣)
- 고정 메모는 항상 상단에 표시

### 6. 팀 멤버 표시
- 상단 헤더에 현재 접속 중인 팀원 아바타 (이름 첫 글자)
- Supabase Presence 로 온라인 상태 추적

### 7. 레이아웃
- 왼쪽: 메모 리스트 (스크롤, 고정 메모 상단)
- 오른쪽 사이드바: AI 요약 + 액션 아이템 + 카테고리 현황
  - 모바일에서는 탭으로 전환
- 상단 헤더: 앱 이름, 검색, 다크/라이트 토글, 접속 멤버, 로그아웃

### 8. 디자인
- 다크 모드 기본 (배경: #0f172a, 카드: #1e293b, 텍스트: #e2e8f0)
- 라이트 모드 (배경: #f8fafc, 카드: white, 텍스트: #1e293b)
- 다크/라이트 모드 토글 (🌙/☀️)
- 반응형: 모바일 1열 + 사이드바 접기 / 데스크탑 2열
- 카테고리 색상 (Tailwind):
  - todo: yellow-400 테두리 + yellow-400/10 배경
  - idea: blue-400 테두리 + blue-400/10 배경
  - meeting: green-400 테두리 + green-400/10 배경
  - reference: purple-400 테두리 + purple-400/10 배경
- 새 메모 도착 시 slide-in 애니메이션 (Tailwind animate)
- 고정 메모 📌 펄스 효과

### 9. 환경 변수
\\\`\\\`\\\`.env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
\\\`\\\`\\\`

API 키는 .env 파일에서 관리 (소스 코드에 하드코딩 절대 금지).
.env 를 .gitignore 에 추가.

## 실행 방법
npm install → npm run dev → localhost:5173 에서 확인

## 주의사항
- Supabase RLS 정책 반드시 적용 (인증된 사용자만 접근)
- Realtime 구독은 컴포넌트 언마운트 시 해제 (메모리 누수 방지)
- 모든 텍스트는 한국어로
- TypeScript strict 모드
- API 키를 소스 코드에 절대 하드코딩하지 마세요
- AI 요청 실패 시 친절한 에러 메시지
\`\`\`

---

### 사용 방법

**🅰️ Claude Code 사용자:**
\`\`\`bash
mkdir team-memo-board && cd team-memo-board
claude
# 위 마크다운 전체를 붙여넣기
# Claude 가 파일 생성 제안 → Accept
# claude 에서 나온 후:
npm install
npm run dev
\`\`\`

**🅱️ Cursor 사용자:**
1. 새 폴더 열기 → 터미널에서 \`npm init -y\`
2. **Cmd+I** → 위 마크다운 붙여넣기
3. Cursor 가 생성한 파일들 승인
4. 터미널: \`npm install && npm run dev\`

### ⚠️ Supabase 설정 주의

1. **Realtime 활성화**: Supabase 대시보드 → Database → Replication → memos 테이블 체크
2. **RLS 정책**: SQL Editor 에서 위 스키마의 RLS 정책을 실행
3. **Auth 설정**: Authentication → Providers → Email 활성화 확인

이 3가지를 빠뜨리면 앱이 작동하지 않아요!

### 💡 커스텀 팁
- "메모에 파일 첨부 기능 추가해줘" — Supabase Storage 활용
- "메모에 댓글 기능 추가해줘" — comments 테이블 추가
- "AI 가 매일 아침 어제 메모 요약 이메일 보내줘" — Edge Function + Resend
- "메모에 태그 시스템 추가해줘" — 다대다 관계 테이블
- "마크다운 렌더링 지원해줘" — react-markdown 라이브러리

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 팀 메모보드가 완성되면 MD 레시피에 아래를 추가해서 AI 에게 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 메모에 마크다운 렌더링 지원 |
| ⭐ | 메모 드래그&드롭으로 순서 변경 |
| ⭐⭐ | 메모에 파일/이미지 첨부 (Supabase Storage) |
| ⭐⭐ | 메모에 댓글 스레드 기능 |
| ⭐⭐⭐ | AI 가 매일 아침 팀 요약 이메일 발송 (Supabase Edge Function + Resend) |
| ⭐⭐⭐ | 메모 간 관계 연결 (그래프 뷰로 시각화) |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**

## ✅ W14 완료!

- ✅ Part A: 메모 자동 분류 → 요약 보고서 → 액션 아이템 추출
- ✅ Part B: MD 레시피 → Supabase ==Realtime== 팀 메모보드 완성 (인증 + CRUD + 실시간 동기화 + AI 분류/요약)
- ✅ 도전: AI 에게 기능 추가 요청

### 핵심 개념 정리

| 개념 | 설명 |
|---|---|
| ==Realtime== | 서버 변경 사항이 클라이언트에 즉시 전파되는 기술 |
| ==WebSocket== | HTTP 와 달리 양방향 통신이 가능한 프로토콜 |
| RLS (Row Level Security) | 데이터베이스 행 단위 접근 제어 — "내 메모만 수정 가능" 같은 규칙 |
| Presence | 현재 접속 중인 사용자를 실시간으로 추적하는 기능 |

### 다음 워크샵 예고
**W15: AI 포트폴리오 빌더** — 지금까지 만든 프로젝트들을 모아서 나만의 AI 포트폴리오 웹사이트를 자동 생성합니다.
이력서 분석, 프로젝트 설명 자동 작성, 반응형 디자인까지 — AI 가 당신을 대신 소개합니다!`,
    },
  ],

  quiz: {
    title: "W14 — AI 팀 협업 메모보드 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "Supabase Realtime 이 사용하는 통신 프로토콜은 무엇인가요?",
        options: [
          "HTTP 폴링 — 클라이언트가 주기적으로 서버에 요청을 보냄",
          "WebSocket — 한 번 연결 후 서버↔클라이언트 양방향 통신",
          "SMTP — 이메일 프로토콜로 데이터를 전송",
          "FTP — 파일 전송 프로토콜로 데이터를 동기화",
        ],
        correctIndex: 1,
        explanation:
          "Supabase Realtime 은 WebSocket 프로토콜을 사용합니다. HTTP 폴링과 달리 한 번 연결하면 서버와 클라이언트가 자유롭게 양방향으로 데이터를 주고받을 수 있어서 실시간 동기화에 적합해요.",
      },
      {
        type: "multiple-choice",
        question:
          "Supabase 의 Row Level Security (RLS) 를 사용하는 이유로 올바른 것은?",
        options: [
          "데이터베이스 성능을 향상시키기 위해",
          "프론트엔드 코드를 간소화하기 위해",
          "인증된 사용자가 자신의 데이터만 수정할 수 있도록 행 단위 접근을 제어하기 위해",
          "Realtime 구독을 활성화하기 위한 필수 조건이기 때문에",
        ],
        correctIndex: 2,
        explanation:
          "RLS 는 데이터베이스 행 단위로 접근 권한을 제어합니다. '내 메모만 수정/삭제 가능' 같은 보안 규칙을 DB 레벨에서 강제하므로, 프론트엔드 코드를 우회하더라도 다른 사용자의 데이터를 변경할 수 없어요.",
      },
      {
        type: "multiple-choice",
        question:
          "팀 메모보드에서 AI 가 회의록 메모를 분석할 때 추출하는 '액션 아이템' 의 핵심 구성요소가 아닌 것은?",
        options: [
          "담당자 (assignee) — 누가 할 것인가",
          "할 일 (task) — 구체적으로 무엇을 할 것인가",
          "감정 분석 (sentiment) — 참석자들의 기분 상태",
          "마감일 (deadline) — 언제까지 할 것인가",
        ],
        correctIndex: 2,
        explanation:
          "액션 아이템의 핵심은 '누가(담당자), 뭘(할 일), 언제까지(마감일)' 입니다. 감정 분석은 액션 아이템 추출과는 관련이 없어요. 회의록에서 실행 가능한 구체적 행동을 뽑아내는 것이 목표입니다.",
      },
    ],
  } satisfies Quiz,
};
