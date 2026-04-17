import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W15 — AI 고객 지원 챗봇.
 *
 * Part A: 플랫폼에서 FAQ 기반 답변 + 에스컬레이션 + 대화 요약 체험 (LLM 셀)
 * Part B: MD 레시피로 고객 지원 챗봇 + 관리자 대시보드 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW15: Lesson = {
  id: "ai-eng-w15-support-chatbot",
  language: "ai-engineering",
  track: "beginner",
  order: 115,
  title: "W15: AI 고객 지원 챗봇",
  subtitle: "FAQ 학습형 고객 지원 챗봇 + 관리자 대시보드",
  estimatedMinutes: 180,
  cells: [
    {
      type: "markdown",
      source: `# 🎧 AI 고객 지원 챗봇 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**FAQ 를 학습한 AI 고객 지원 챗봇 + 관리자 대시보드** — 고객이 질문하면 FAQ 기반으로 정확히 답하고, 답할 수 없으면 상담원에게 ==에스컬레이션== 합니다. 관리자는 대시보드에서 모든 대화를 모니터링합니다.

### 완성 모습
\`\`\`
┌─ 고객 채팅 위젯 ────────────────┐    ┌─ 관리자 대시보드 ─────────────────────┐
│  🎧 고객지원 AI                  │    │  📊 Support Dashboard                 │
├──────────────────────────────────┤    ├───────────────────────────────────────┤
│                                  │    │  오늘 대화 47건  해결률 89%  ⭐ 4.2   │
│  🤖 안녕하세요! 무엇을 도와       │    │                                       │
│     드릴까요?                    │    │  🔍 [대화 검색...]                     │
│                                  │    │                                       │
│  👤 환불 절차가 어떻게 되나요?    │    │  ┌─ 최근 대화 ──────────────────────┐ │
│                                  │    │  │ 👤 김민수  14:32  "환불 절차..."  │ │
│  🤖 환불은 주문일로부터 7일       │    │  │    ✅ AI 해결  ⭐⭐⭐⭐⭐           │ │
│     이내에 가능합니다.            │    │  │ 👤 이수진  14:15  "배송 추적..."  │ │
│     [내 주문] 페이지에서...       │    │  │    ⚠️ 상담원 연결  ⭐⭐⭐           │ │
│                                  │    │  │ 👤 박지훈  13:58  "카드 결제..."  │ │
│  👤 7일 지났는데요 😢            │    │  │    ✅ AI 해결  ⭐⭐⭐⭐             │ │
│                                  │    │  └─────────────────────────────────┘ │
│  🤖 죄송합니다. 이 경우에는       │    │                                       │
│     상담원 연결이 필요합니다.     │    │  [FAQ 관리]  [통계]  [설정]           │
│     잠시만 기다려주세요! 🙋       │    │                                       │
├──────────────────────────────────┤    └───────────────────────────────────────┘
│ [메시지 입력...]        [전송]   │
│ 이 대화가 도움이 되셨나요? ⭐⭐⭐⭐⭐│
└──────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | FAQ 기반 답변 + 에스컬레이션 + 요약 | 60분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 풀스택 웹앱 완성 | 120분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 + 히스토리 관리 이해)`,
    },

    // ─── Part A: FAQ 기반 고객 지원 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: FAQ 기반 고객 지원 두뇌 만들기 (60분)

W01 에서 만든 챗봇은 범용 AI 였어요. 이번에는 **특정 FAQ 데이터에서만 답변하는** 전문 챗봇을 만듭니다.

핵심 개념 3가지:
1. **FAQ ==컨텍스트== 주입** — system prompt 에 FAQ 데이터를 넣어 AI 가 "아는 범위" 를 제한
2. **==에스컬레이션== 감지** — FAQ 로 답할 수 없는 질문을 자동 탐지하여 상담원에게 연결
3. **대화 요약** — 긴 대화를 관리자가 한눈에 볼 수 있도록 AI 가 자동 요약`,
    },

    {
      type: "markdown",
      source: `### A-1. FAQ 기반 답변 — 아는 것만 정확히 답하기

==system prompt== 에 FAQ 데이터를 통째로 넣으면, AI 는 그 범위 내에서만 답합니다.
이걸 **==그라운딩(Grounding)==** 이라고 해요 — AI 를 특정 데이터에 "접지" 시키는 거죠.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// FAQ 기반 고객 지원 챗봇 — 아는 것만 정확히 답하기
const FAQ_DATA = \`
[FAQ 목록]

Q: 환불 절차가 어떻게 되나요?
A: 주문일로부터 7일 이내에 [내 주문] 페이지에서 환불을 신청할 수 있습니다. 환불은 영업일 기준 3~5일 내에 원래 결제 수단으로 돌아갑니다.

Q: 배송은 얼마나 걸리나요?
A: 일반 배송은 2~3영업일, 빠른 배송은 당일~익일 배송입니다. 제주/도서산간 지역은 1~2일 추가됩니다.

Q: 주문을 취소하고 싶어요.
A: 배송 준비 전이면 [내 주문] 페이지에서 직접 취소 가능합니다. 이미 배송이 시작되면 수령 후 반품 절차를 이용해주세요.

Q: 카드 결제가 안 돼요.
A: 1) 카드 한도를 확인해주세요. 2) 3D Secure 인증이 필요할 수 있습니다. 3) 계속 실패하면 다른 카드나 계좌이체를 이용해주세요.

Q: 포인트는 어떻게 사용하나요?
A: 결제 시 '포인트 사용' 체크박스를 클릭하면 보유 포인트가 자동 적용됩니다. 최소 1,000포인트부터 사용 가능합니다.

Q: 영업 시간이 언제인가요?
A: 고객센터는 평일 09:00~18:00 운영됩니다. 주말/공휴일은 AI 챗봇이 24시간 응대합니다.
\`;

const systemPrompt = \`너는 "쇼핑몰 고객지원 AI" 야.
아래 FAQ 를 기반으로 고객 질문에 정확히 답해.

\${FAQ_DATA}

[규칙]
1. FAQ 에 있는 내용만 답변해. 추측하거나 지어내지 마.
2. 친절하고 공손한 말투를 사용해.
3. 답변 끝에 "더 궁금한 점이 있으시면 말씀해주세요!" 를 붙여.
4. FAQ 에 없는 질문이면 "죄송합니다. 해당 문의는 상담원 연결이 필요합니다." 라고 답해.\`;

// 고객 질문 테스트
const questions = [
  "환불은 언제까지 가능한가요?",
  "포인트 사용 최소 금액이 얼마에요?",
  "배송이 제주도면 며칠 걸려요?",
];

for (const q of questions) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: q },
    ],
  });

  console.log("👤 고객:", q);
  console.log("🤖 AI:", res.text);
  console.log("─".repeat(50));
}`,
      hints: [
        "핵심: FAQ 데이터를 system prompt 에 넣으면 AI 가 그 범위에서만 답해요.",
        "이 패턴을 'grounding(그라운딩)' 이라 해요 — Ch09 RAG 의 간단한 버전.",
        "FAQ 가 100개 이상이면 system prompt 가 너무 길어져요. 그때는 검색(RAG) 이 필요합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 답변 불가 감지 — 에스컬레이션 자동화

FAQ 에 없는 질문이 오면? AI 가 "모르겠어요" 를 정확히 감지하는 게 핵심.
==JSON 모드== 를 사용해 구조화된 응답을 받으면, 코드로 분기 처리가 쉬워집니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 에스컬레이션 감지 — FAQ 범위 밖 질문을 자동 탐지
const FAQ_DATA = \`
Q: 환불 절차가 어떻게 되나요?
A: 주문일로부터 7일 이내에 [내 주문] 페이지에서 환불 신청 가능합니다.

Q: 배송은 얼마나 걸리나요?
A: 일반 배송 2~3영업일, 빠른 배송 당일~익일입니다.

Q: 카드 결제가 안 돼요.
A: 카드 한도 확인 → 3D Secure 인증 → 다른 결제 수단 시도.
\`;

const systemPrompt = \`너는 고객지원 AI 야. FAQ 기반으로 답하되, 반드시 아래 JSON 형식으로만 답해.

\${FAQ_DATA}

[응답 형식 — 반드시 JSON 으로]
{
  "canAnswer": true/false,
  "answer": "고객에게 보여줄 답변",
  "confidence": "high" | "medium" | "low",
  "matchedFAQ": "매칭된 FAQ 질문 (없으면 null)",
  "escalationReason": "에스컬레이션 사유 (canAnswer=true 면 null)"
}

[규칙]
- FAQ 에 명확히 답이 있으면: canAnswer=true, confidence="high"
- FAQ 에서 유추 가능하지만 정확하지 않으면: canAnswer=true, confidence="medium"
- FAQ 에 전혀 없는 내용이면: canAnswer=false, confidence="low"
- canAnswer=false 면 answer 에 "상담원 연결이 필요합니다" 포함\`;

// 테스트: FAQ 안 / 밖 / 경계 질문
const testQuestions = [
  { q: "환불 언제까지 돼요?", expected: "FAQ 내 → canAnswer: true" },
  { q: "해외 배송도 하나요?", expected: "FAQ 밖 → canAnswer: false" },
  { q: "환불 7일 지났는데 방법 없나요?", expected: "경계 → confidence 확인" },
];

for (const { q, expected } of testQuestions) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: q },
    ],
  });

  console.log("👤 고객:", q);
  console.log("📋 기대:", expected);

  try {
    const parsed = JSON.parse(res.text);
    console.log("✅ canAnswer:", parsed.canAnswer);
    console.log("📊 confidence:", parsed.confidence);
    console.log("💬 답변:", parsed.answer);
    if (!parsed.canAnswer) {
      console.log("🚨 에스컬레이션:", parsed.escalationReason);
    }
  } catch {
    console.log("⚠️ JSON 파싱 실패 — 원본:", res.text.slice(0, 200));
  }
  console.log("─".repeat(50));
}`,
      hints: [
        "JSON 응답 + canAnswer 필드 = 코드에서 에스컬레이션 여부를 자동 분기.",
        "'해외 배송' 은 FAQ 에 없으니 canAnswer: false 가 나와야 정상.",
        "confidence 가 'medium' 이면 추가 확인을 권하는 UX 를 만들 수 있어요.",
        "실무에선 에스컬레이션 시 대화 내역을 상담원에게 자동 전달합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 대화 요약 — 관리자를 위한 자동 리포트

고객 상담이 끝나면 관리자가 하나하나 읽을 수 없잖아요?
AI 가 긴 대화를 **한 줄 요약 + 핵심 정보** 로 정리해주면 대시보드에서 빠르게 파악 가능!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 대화 요약 — 관리자 대시보드용 자동 리포트
const conversationLog = \`
[대화 기록]
고객: 주문한 상품이 아직 안 왔어요.
AI: 주문번호를 알려주시면 배송 상태를 확인해드리겠습니다.
고객: 주문번호 ORD-2024-8832 입니다.
AI: 확인했습니다. 해당 주문은 현재 배송 중이며, 내일(화요일) 도착 예정입니다.
고객: 근데 원래 오늘 오기로 했잖아요. 급한 건데...
AI: 불편을 드려 죄송합니다. 배송 지연에 대해 상담원 연결이 필요합니다. 잠시만 기다려주세요.
고객: 네 빨리 좀 해주세요.
AI: 상담원에게 연결 중입니다. 대기 번호는 3번입니다. 약 5분 소요됩니다.
고객: 알겠어요.
\`;

const summaryPrompt = \`아래 고객 상담 대화를 관리자용으로 요약해줘.
반드시 아래 JSON 형식으로 답해.

\${conversationLog}

[응답 형식]
{
  "summary": "한 줄 요약 (30자 이내)",
  "customerIssue": "고객 문제 설명",
  "resolution": "resolved" | "escalated" | "pending",
  "resolutionDetail": "해결/에스컬레이션 상세",
  "sentiment": "positive" | "neutral" | "negative",
  "tags": ["관련 태그 배열"],
  "actionRequired": true/false,
  "actionDetail": "필요한 후속 조치 (없으면 null)"
}\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "너는 고객 상담 분석 AI 야. 정확하고 간결하게 요약해." },
    { role: "user", content: summaryPrompt },
  ],
});

try {
  const report = JSON.parse(res.text);
  console.log("📋 대화 요약 리포트");
  console.log("═".repeat(40));
  console.log("📝 요약:", report.summary);
  console.log("❓ 문제:", report.customerIssue);
  console.log("📊 처리:", report.resolution, "→", report.resolutionDetail);
  console.log("😊 감정:", report.sentiment);
  console.log("🏷️ 태그:", report.tags?.join(", "));
  if (report.actionRequired) {
    console.log("🚨 후속 조치 필요:", report.actionDetail);
  } else {
    console.log("✅ 추가 조치 불필요");
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "대화 요약은 관리자 대시보드의 핵심 기능 — 수백 건을 한눈에 파악.",
        "sentiment 분석으로 불만 고객을 우선 처리할 수 있어요.",
        "tags 로 대화를 자동 분류하면 FAQ 개선에도 활용 가능!",
        "실무에선 이런 요약을 대화 종료 시 자동으로 생성해 DB 에 저장합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

고객 지원 챗봇의 세 가지 핵심을 검증했어요:
- ✅ **FAQ ==그라운딩==** — system prompt 에 FAQ 넣어서 "아는 것만" 답하기
- ✅ **==에스컬레이션== 감지** — JSON 구조로 canAnswer 판단 → 상담원 연결 분기
- ✅ **대화 요약** — 긴 대화를 관리자용 리포트로 자동 정리

이제 이걸 **Supabase DB + 관리자 대시보드** 가 붙은 풀스택 앱으로 만듭니다.

---

## Part B: MD 레시피로 풀스택 웹앱 완성 (120분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [고객 지원 챗봇 + 관리자 대시보드]
\`\`\`

이번 프로젝트는 W01 챗봇보다 훨씬 크지만, MD 레시피가 모든 것을 설명하니 AI 가 한 번에 만들 수 있어요.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 고객 지원 챗봇 + 관리자 대시보드 제작 요청서

## 프로젝트 개요
FAQ 기반 AI 고객 지원 챗봇과 관리자 대시보드를 만들어주세요.
고객은 채팅 위젯으로 질문하고, AI 가 FAQ 에서 답변합니다.
답변이 불가능하면 자동으로 상담원에게 에스컬레이션합니다.
관리자는 대시보드에서 모든 대화를 모니터링하고 FAQ 를 관리합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini SDK)
- Supabase (DB + Auth + Realtime)
- React Router (고객 채팅 / 관리자 대시보드 라우팅)
- Lucide React (아이콘)

## Supabase 테이블 설계

### conversations 테이블
- id: uuid (PK, default gen_random_uuid())
- customer_name: text (nullable, 익명이면 "고객#순번")
- status: text ("active" | "resolved" | "escalated")
- summary: text (nullable, AI 자동 요약)
- sentiment: text (nullable, "positive" | "neutral" | "negative")
- satisfaction_rating: integer (nullable, 1~5)
- tags: text[] (nullable)
- created_at: timestamptz (default now())
- updated_at: timestamptz (default now())

### messages 테이블
- id: uuid (PK, default gen_random_uuid())
- conversation_id: uuid (FK → conversations.id, ON DELETE CASCADE)
- role: text ("user" | "assistant" | "system")
- content: text
- metadata: jsonb (nullable, canAnswer/confidence 등 저장)
- created_at: timestamptz (default now())

### faqs 테이블
- id: uuid (PK, default gen_random_uuid())
- question: text
- answer: text
- category: text (nullable, "배송", "결제", "환불" 등)
- is_active: boolean (default true)
- usage_count: integer (default 0, AI 가 참조할 때마다 증가)
- created_at: timestamptz (default now())
- updated_at: timestamptz (default now())

## 기능 요구사항

### 1. 고객 채팅 위젯 (/ 경로)

#### 1-1. 채팅 UI
- 화면 우하단에 떠있는 채팅 버튼 (💬) — 클릭하면 채팅 위젯 펼침/접기
- 펼쳤을 때: 400x600px 채팅 창 (모바일에선 전체 화면)
- 상단: "🎧 고객지원 AI" 헤더 + 닫기(X) 버튼
- 중앙: 메시지 영역 (사용자=오른쪽 파란 말풍선, AI=왼쪽 회색 말풍선)
- 하단: 텍스트 입력 + 전송 버튼 (Enter 전송, Shift+Enter 줄바꿈)

#### 1-2. AI 답변 로직
- Supabase 에서 is_active=true 인 FAQ 목록을 조회
- FAQ 를 system prompt 에 주입하여 Gemini 에게 전달
- AI 응답을 JSON 으로 받아 파싱:
  - canAnswer=true → 답변 표시 + 해당 FAQ 의 usage_count 증가
  - canAnswer=false → "상담원 연결이 필요합니다. 잠시만 기다려주세요!" 표시 + conversation status → "escalated"
- 응답 대기 중: "..." 타이핑 애니메이션
- 에러 시: "⚠️ 응답을 받지 못했습니다. 다시 시도해주세요." + 재시도 버튼

#### 1-3. 대화 저장
- 새 대화 시작 시 conversations 레코드 생성
- 매 메시지마다 messages 레코드 저장
- 대화 종료 (위젯 닫기 또는 5분 비활성) 시 AI 자동 요약 생성 → conversations.summary 업데이트
- 대화 종료 시 만족도 평가 팝업 (⭐ 1~5) → conversations.satisfaction_rating 저장

#### 1-4. 대화 히스토리 관리
- 전체 대화 저장하되 API 호출 시 시스템 프롬프트 + 최근 10턴만 전달
- 30턴 초과 시 "대화가 길어졌어요. 새 대화를 시작해주세요." 안내

### 2. 관리자 대시보드 (/admin 경로)

#### 2-1. 대시보드 상단 통계
- 오늘 대화 수 / 이번 주 대화 수
- AI 해결률 (resolved 비율)
- 평균 만족도 (⭐ 표시)
- 에스컬레이션 비율
- 각 통계 카드는 클릭하면 필터된 대화 목록으로 이동

#### 2-2. 대화 목록
- 최신순 정렬 (무한 스크롤 또는 페이지네이션)
- 각 행: 고객명, 시작 시간, 요약(첫 줄), 상태 뱃지(✅해결/⚠️에스컬레이션/🔵진행중), 만족도 별
- 상태/감정/날짜 필터
- 검색 (대화 내용에서 키워드 검색)
- 행 클릭 → 대화 상세 (전체 메시지 히스토리)

#### 2-3. 대화 상세
- 전체 메시지 히스토리 (채팅 UI 처럼 말풍선)
- AI 응답마다 metadata 표시 (canAnswer, confidence, matchedFAQ)
- AI 요약 + 태그 + 감정 분석 결과 표시
- 상담원 메모 입력 필드 (향후 확장용)

#### 2-4. FAQ 관리 (CRUD)
- FAQ 목록 (카테고리별 탭)
- 새 FAQ 추가 (질문 + 답변 + 카테고리)
- 기존 FAQ 수정/삭제
- FAQ 활성/비활성 토글
- usage_count 표시 (인기 FAQ 순 정렬)
- FAQ 가 추가/수정되면 즉시 AI 답변에 반영

### 3. API 키 관리
- 첫 실행 시 Gemini API 키 + Supabase URL/Key 입력 모달
- localStorage 에 저장
- 설정 페이지에서 변경 가능

### 4. 디자인
- 다크 모드 기본 (배경: #0f172a, 카드: #1e293b, 텍스트: #e2e8f0)
- 라이트 모드 (배경: #f8fafc, 카드: white, 텍스트: #1e293b)
- 다크/라이트 토글 (🌙/☀️)
- 반응형: 모바일 → 채팅 전체화면, 대시보드 단일 컬럼
- 부드러운 애니메이션 (메시지 등장 fade-in, 위젯 열기/닫기 slide-up)
- 관리자 대시보드는 사이드바 레이아웃 (대화 목록 | FAQ 관리 | 통계)

### 5. 초기 FAQ 시드 데이터
앱 첫 실행 시 아래 FAQ 를 Supabase 에 자동 삽입 (이미 있으면 스킵):

| 카테고리 | 질문 | 답변 |
|---|---|---|
| 배송 | 배송은 얼마나 걸리나요? | 일반 배송 2~3영업일, 빠른 배송 당일~익일입니다. 제주/도서산간은 1~2일 추가. |
| 배송 | 배송 추적은 어디서 하나요? | [내 주문] 페이지에서 운송장 번호 클릭 시 배송 추적이 가능합니다. |
| 환불 | 환불은 어떻게 하나요? | 주문일로부터 7일 이내 [내 주문]에서 환불 신청 가능. 3~5영업일 내 원래 결제수단으로 환불. |
| 환불 | 부분 환불이 가능한가요? | 네, 여러 상품 주문 시 개별 상품 단위로 부분 환불이 가능합니다. |
| 결제 | 어떤 결제 수단을 사용할 수 있나요? | 신용/체크카드, 계좌이체, 카카오페이, 네이버페이, 포인트 결제가 가능합니다. |
| 결제 | 카드 결제가 안 돼요. | 카드 한도 확인 → 3D Secure 인증 확인 → 다른 카드/계좌이체 시도. 계속 실패 시 카드사 문의. |
| 회원 | 비밀번호를 잊어버렸어요. | 로그인 페이지 [비밀번호 찾기]에서 이메일 인증 후 재설정 가능합니다. |
| 회원 | 회원 탈퇴는 어떻게 하나요? | [마이페이지] → [계정 설정] → [회원 탈퇴]에서 가능합니다. 탈퇴 후 데이터는 30일간 보관. |
| 기타 | 영업 시간이 언제인가요? | 고객센터 평일 09:00~18:00. 주말/공휴일은 AI 챗봇이 24시간 응대. |
| 기타 | 포인트는 어떻게 적립되나요? | 결제 금액의 1%가 자동 적립됩니다. 리뷰 작성 시 추가 500포인트 지급. |

## 환경 변수
모든 키는 런타임에 사용자 입력 (하드코딩 금지):
- GEMINI_API_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY

## 실행 방법
npm install → npm run dev → localhost:5173 에서 확인
- / → 고객 채팅 위젯
- /admin → 관리자 대시보드

## 주의사항
- API 키를 소스 코드에 절대 하드코딩하지 마세요
- 모든 텍스트는 한국어로
- TypeScript strict 모드
- console.error 로 에러 로깅
- Supabase RLS 는 초기에는 비활성화 (개발 편의)
\`\`\`

---

### 사용 방법

**🅰️ Claude Code 사용자:**
\`\`\`bash
mkdir support-chatbot && cd support-chatbot
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

### 🗄️ Supabase 설정

Part B 시작 전에 Supabase 프로젝트가 필요해요:

1. [supabase.com](https://supabase.com) 에서 무료 프로젝트 생성
2. **SQL Editor** 에서 위 테이블 3개 생성 (AI 에게 "Supabase SQL 생성해줘" 요청)
3. **Settings → API** 에서 URL + anon key 복사
4. 앱 실행 시 입력 모달에 붙여넣기

> 💡 **Supabase 가 처음이라면?** AI 에게 "Supabase 초기 설정도 알려줘" 라고 추가 요청하세요.

### 💡 커스텀 팁
- FAQ 를 내 서비스에 맞게 수정하면 **진짜 고객 지원 봇** 완성
- 에스컬레이션 시 Slack/Discord 웹훅으로 알림 보내기 추가 가능
- 관리자 대시보드에 차트(Recharts) 추가하면 더 프로답게
- Supabase Realtime 으로 실시간 대화 모니터링 가능

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 앱이 완성되면 AI 에게 추가 기능을 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 대화 내역 CSV/JSON 내보내기 |
| ⭐ | FAQ 카테고리별 색상 뱃지 |
| ⭐⭐ | 자주 묻는 질문 자동 추천 (입력 중 autocomplete) |
| ⭐⭐ | Supabase Realtime 으로 새 대화 실시간 알림 |
| ⭐⭐ | 일별/주별 대화량 차트 (Recharts) |
| ⭐⭐⭐ | 에스컬레이션 시 Slack 웹훅 알림 |
| ⭐⭐⭐ | 대화 로그에서 FAQ 자동 생성 제안 ("이 질문이 자주 와요") |
| ⭐⭐⭐ | 다국어 지원 (한국어/영어/일본어 자동 감지) |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **대화하듯 앱을 키워가는 게 바이브 코딩!**

## ✅ W15 완료!

- ✅ Part A: FAQ ==그라운딩== + ==에스컬레이션== 감지 + 대화 요약
- ✅ Part B: MD 레시피 → 풀스택 고객 지원 챗봇 + 관리자 대시보드
- ✅ Supabase 로 대화 영구 저장 + FAQ CRUD

### W01 → W15 성장 비교

| | W01 챗봇 | W15 고객 지원 챗봇 |
|---|---|---|
| AI 답변 | 범용 (아무거나 답함) | FAQ 기반 (아는 것만 정확히) |
| 데이터 | localStorage | Supabase (영구 DB) |
| 에러 처리 | 기본 재시도 | 에스컬레이션 자동화 |
| 관리 | 없음 | 관리자 대시보드 |
| 분석 | 없음 | 대화 요약 + 감정 분석 + 통계 |

W01 의 "나만의 챗봇" 이 실무급 고객 지원 시스템으로 진화했어요! 🎉

### 다음 워크샵 예고
**W16: AI 코드 리뷰어** — GitHub PR 을 분석하고 코드 리뷰 코멘트를 자동 생성하는 AI 도구. 코드 품질 분석 + 보안 취약점 탐지 + 개선 제안까지 자동화합니다.`,
    },
  ],

  quiz: {
    title: "W15 — AI 고객 지원 챗봇 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "FAQ 데이터를 system prompt 에 넣어 AI 가 특정 정보 범위 내에서만 답하게 하는 기법을 무엇이라 하나요?",
        options: [
          "파인 튜닝 (Fine-tuning)",
          "그라운딩 (Grounding)",
          "프롬프트 인젝션 (Prompt Injection)",
          "토큰 제한 (Token Limiting)",
        ],
        correctIndex: 1,
        explanation:
          "그라운딩(Grounding)은 AI 를 특정 데이터에 '접지' 시키는 기법입니다. FAQ 를 system prompt 에 넣으면 AI 가 그 범위 내에서만 답해요. RAG 의 간단한 버전이기도 합니다.",
      },
      {
        type: "multiple-choice",
        question:
          "AI 가 FAQ 범위 밖의 질문을 받았을 때 자동으로 상담원에게 연결하는 것을 무엇이라 하나요?",
        options: [
          "리다이렉트 (Redirect)",
          "폴백 (Fallback)",
          "에스컬레이션 (Escalation)",
          "라우팅 (Routing)",
        ],
        correctIndex: 2,
        explanation:
          "에스컬레이션(Escalation)은 AI 가 처리할 수 없는 요청을 사람(상담원)에게 넘기는 것입니다. JSON 응답의 canAnswer 필드로 자동 감지할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question:
          "관리자 대시보드에서 AI 대화 요약이 중요한 이유는?",
        options: [
          "AI 모델 학습에 반드시 필요해서",
          "법적으로 의무사항이어서",
          "관리자가 수백 건의 대화를 일일이 읽지 않고도 핵심을 빠르게 파악할 수 있어서",
          "요약 없이는 Supabase 에 저장할 수 없어서",
        ],
        correctIndex: 2,
        explanation:
          "고객 상담은 하루에 수백 건이 생길 수 있어요. AI 가 각 대화를 한 줄로 요약해주면 관리자가 전체 현황을 빠르게 파악하고, 문제가 있는 대화만 골라볼 수 있습니다.",
      },
    ],
  } satisfies Quiz,
};
