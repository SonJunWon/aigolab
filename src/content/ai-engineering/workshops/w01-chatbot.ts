import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W01 — 나만의 AI 챗봇 만들기.
 *
 * Part A: 플랫폼에서 챗봇 두뇌 만들기 (LLM 셀)
 * Part B: MD 레시피로 실제 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW01: Lesson = {
  id: "ai-eng-w01-chatbot",
  language: "ai-engineering",
  track: "beginner",
  order: 101,
  title: "W01: 나만의 AI 챗봇 만들기",
  subtitle: "MD 레시피 한 장으로 진짜 동작하는 챗봇 완성",
  estimatedMinutes: 90,
  cells: [
    {
      type: "markdown",
      source: `# 🤖 나만의 AI 챗봇 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**진짜 동작하는 AI 챗봇 웹앱** — 브라우저에서 열면 채팅창이 나오고, 메시지를 보내면 AI 가 답합니다.

### 완성 모습
\`\`\`
┌─────────────────────────────┐
│  🤖 나의 AI 챗봇            │
├─────────────────────────────┤
│                             │
│  👤 안녕! 오늘 뭐 하면 좋을까? │
│                             │
│  🤖 안녕하세요! 오늘 날씨가   │
│     좋다면 산책을 추천해요.   │
│     실내라면 새로운 요리에    │
│     도전해보는 건 어떨까요?   │
│                             │
│  👤 요리 추천해줘!           │
│                             │
│  🤖 간단하면서 맛있는 알리오  │
│     올리오는 어떠세요? ...    │
│                             │
├─────────────────────────────┤
│ [메시지 입력...]    [전송]   │
└─────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 챗봇 두뇌 만들기 | 30분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 웹앱 완성 | 60분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **Part B 전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)`,
    },

    // ─── Part A: 챗봇 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 챗봇 두뇌 만들기 (30분)

챗봇의 핵심은 3가지:
1. **대화 히스토리** — 이전 대화를 기억
2. **성격 (==system prompt==)** — 어떤 톤으로 답할지
3. **==LLM== 호출** — 메시지를 보내고 답을 받기

이 3가지를 LLM 셀에서 먼저 만들고 검증합니다.`,
    },

    {
      type: "markdown",
      source: `### A-1. 가장 간단한 챗봇 — 한 턴 대화

\`chat()\` 한 번 호출 = 한 턴. 이게 챗봇의 기본 단위.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 가장 간단한 챗봇 — 한 턴
const response = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "너는 친절한 한국어 챗봇이야. 짧고 따뜻하게 답해." },
    { role: "user", content: "안녕! 오늘 뭐 하면 좋을까?" },
  ],
});

console.log("🤖:", response.text);`,
      hints: [
        "이게 챗봇의 전부예요 — system prompt + user message + chat() 호출.",
        "system 을 바꾸면 챗봇 성격이 변해요: '너는 해적 말투를 쓰는 AI야' 등.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 멀티턴 대화 — 히스토리 관리

진짜 챗봇은 **이전 대화를 기억**해야 해요. messages 배열에 계속 쌓으면 됩니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 멀티턴 챗봇 — 대화 히스토리 누적
const history: Array<{role: string; content: string}> = [
  { role: "system", content: "너는 친절한 요리 전문 챗봇이야. 한국어로 짧게 답해." },
];

// 대화 시뮬레이션 — 실제 앱에서는 사용자 입력을 받아 반복
const userMessages = [
  "오늘 저녁 뭐 먹을까?",
  "파스타 좋아! 쉬운 레시피 알려줘.",
  "재료 중에 마늘 없으면 뭘로 대체해?",
];

for (const msg of userMessages) {
  // 사용자 메시지 히스토리에 추가
  history.push({ role: "user", content: msg });

  // AI 호출 — 전체 히스토리 전달
  const res = await chat({
    provider: "gemini",
    messages: history,
  });

  // AI 응답 히스토리에 추가
  history.push({ role: "assistant", content: res.text });

  console.log("👤:", msg);
  console.log("🤖:", res.text);
  console.log();
}

console.log("── 총", history.length, "턴 대화 완료 ──");`,
      hints: [
        "핵심: history 배열에 user → assistant → user → assistant 순서로 쌓기.",
        "3번째 질문 '마늘 대체' 는 이전 대화(파스타)를 기억해야 답할 수 있어요.",
        "history 가 너무 길면 토큰 비용 증가 — 실무에선 최근 N턴만 유지하는 전략 사용.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 성격 커스텀 — 나만의 챗봇 개성

system prompt 를 바꿔 다양한 성격의 챗봇을 만들어보세요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 성격별 챗봇 비교
const personalities = [
  { name: "친절 선생님", system: "너는 초등학교 선생님이야. 쉽고 따뜻하게 설명해. 이모지 사용." },
  { name: "츤데레 고양이", system: "너는 츤데레 고양이야. 도움은 주지만 귀찮은 척해. 냥 붙여." },
  { name: "셰프 봇", system: "너는 미쉐린 셰프야. 요리 관련만 답하고 다른 질문은 '저는 요리 전문이에요' 라고 해." },
];

const question = "비가 오는 날 뭐 하면 좋을까?";

for (const p of personalities) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: p.system },
      { role: "user", content: question },
    ],
  });

  console.log(\`── \${p.name} ──\`);
  console.log("🤖:", res.text);
  console.log();
}`,
      hints: [
        "같은 질문에 완전 다른 답 — system prompt 하나가 챗봇의 정체성을 결정.",
        "셰프 봇은 요리와 관련 없는 질문을 거절하는지 확인해보세요.",
        "이 system prompt 를 Part B 에서 실제 웹앱에 그대로 넣습니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

챗봇의 세 가지 핵심을 검증했어요:
- ✅ \`chat()\` 로 AI 호출
- ✅ \`history\` 배열로 멀티턴 대화
- ✅ \`system prompt\` 로 성격 커스텀

이제 이걸 **실제 웹앱** 으로 만듭니다.

---

## Part B: MD 레시피로 웹앱 완성 (60분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [완성된 챗봇 앱]
\`\`\`

아래의 **MD 레시피** 를 복사해서 AI 코딩 도구에 전달하면 됩니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 챗봇 웹앱 제작 요청서

## 프로젝트 개요
브라우저에서 동작하는 AI 챗봇 웹앱을 만들어주세요.
Google Gemini API 를 사용합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크 모드)
- @google/genai (Gemini SDK)

## 기능 요구사항

### 1. 채팅 UI
- 화면 중앙에 채팅 영역 (최대 너비 640px, 높이는 화면 전체 활용)
- 상단 고정 헤더: 챗봇 이름 "🤖 AI 어시스턴트" + 우측에 ⚙️ 설정 버튼 + 🗑️ 대화 초기화 버튼
- 중앙 메시지 영역:
  - 사용자 메시지 = 오른쪽 정렬, 파란색(#3b82f6) 배경 말풍선
  - AI 메시지 = 왼쪽 정렬, 회색(#374151) 배경 말풍선
  - 각 메시지에 보낸 시간 표시 (오전/오후 HH:MM)
  - **중요: 새 메시지가 추가될 때마다 자동으로 맨 아래로 스크롤** (useEffect + scrollIntoView 또는 scrollTo)
  - 메시지 영역이 넘치면 위로 스크롤 가능 (overflow-y: auto)
- 하단 고정 입력 영역:
  - 텍스트 입력창 (placeholder: "메시지를 입력하세요...")
  - Enter 키로 전송 (Shift+Enter 는 줄바꿈)
  - 전송 버튼 (화살표 아이콘)
  - AI 응답 대기 중에는 입력 비활성화 + "생각 중..." 텍스트 표시
  - 빈 메시지 전송 방지

### 2. 대화 로직
- 시스템 프롬프트: "너는 친절한 한국어 AI 어시스턴트야. 사용자의 질문에 도움이 되는 답변을 해줘. 답변은 간결하되 충분히 설명해. 이모지를 적절히 사용해."
- 대화 히스토리를 배열로 관리
- **히스토리 관리 전략**: 전체 대화를 저장하되, API 호출 시에는 시스템 프롬프트 + 최근 10턴(user+assistant 20개 메시지)만 전달 — 오래된 대화는 토큰 절약을 위해 잘라냄
- 전체 대화가 50턴 넘으면 "대화가 길어졌어요. 새 대화를 시작하시겠어요?" 안내
- Gemini 2.5 Flash 모델 사용
- API 호출 실패 시 에러 메시지를 채팅에 표시: "⚠️ 응답을 받지 못했어요. 다시 시도해주세요." + 재시도 버튼

### 3. AI 응답 중 UX
- 응답 대기 중: AI 말풍선에 "..." 점 3개가 순서대로 깜빡이는 타이핑 애니메이션
- 전송 버튼이 "중지" 버튼으로 변경 (AbortController 로 요청 취소 가능)
- 응답 완료 후 입력창에 자동 포커스

### 4. API 키 관리
- 첫 실행 시 세련된 API 키 입력 모달:
  - "🔑 Gemini API 키를 입력하세요" 제목
  - 입력란 (type=password, 토글로 보이기/숨기기)
  - "https://aistudio.google.com/apikey 에서 무료 발급" 안내 링크
  - [저장] 버튼
- localStorage 에 키 저장
- 상단 ⚙️ 버튼 클릭 → 키 변경 또는 삭제 가능

### 5. 추가 편의 기능
- 대화 초기화 버튼 (🗑️) — 확인 다이얼로그 후 히스토리 클리어
- 메시지 길게 누르기(또는 더블클릭) → 클립보드에 복사 + "복사됨!" 토스트
- 페이지 새로고침해도 대화 유지 (localStorage 에 히스토리 저장/복원)
- 빈 상태일 때 중앙에 "안녕하세요! 무엇이든 물어보세요 🤖" 같은 환영 메시지
- 다크 모드 / 라이트 모드 토글 (상단 헤더에 🌙/☀️ 버튼)

### 6. 디자인
- 다크 모드 기본 (배경: #0f172a, 카드: #1e293b, 텍스트: #e2e8f0)
- 라이트 모드 (배경: #f8fafc, 카드: white, 텍스트: #1e293b)
- 반응형 (모바일에서 전체 화면, 데스크탑에서 중앙 640px)
- 부드러운 메시지 등장 애니메이션 (fade-in + slide-up)
- 스크롤바 커스텀 (얇고 둥근 형태)

## 환경 변수
GEMINI_API_KEY 는 런타임에 사용자가 입력 (하드코딩 금지)

## 실행 방법
npm install → npm run dev → localhost:5173 에서 확인

## 주의사항
- API 키를 소스 코드에 절대 하드코딩하지 마세요
- 모든 텍스트는 한국어로
- console.error 로 에러 로깅
- TypeScript strict 모드
\`\`\`

---

### 사용 방법

**🅰️ Claude Code 사용자:**
\`\`\`bash
mkdir my-chatbot && cd my-chatbot
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

### 💡 커스텀 팁
- 시스템 프롬프트를 바꾸면 성격이 변해요 (Part A 에서 실험한 것!)
- "Gemini" 대신 "Groq" 으로 바꾸면 더 빠른 챗봇
- "채팅 히스토리 내보내기" 기능 추가 요청 가능
- "다크/라이트 모드 토글" 추가 요청 가능

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 챗봇이 완성되면 MD 레시피에 아래를 추가해서 AI 에게 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 대화 내역 초기화 버튼 |
| ⭐ | 메시지 복사 버튼 |
| ⭐⭐ | 채팅 내역 JSON 다운로드 |
| ⭐⭐ | 성격 선택 드롭다운 (친절/츤데레/셰프) |
| ⭐⭐⭐ | 마크다운 렌더링 (AI 답변에 코드블록 등) |
| ⭐⭐⭐ | 스트리밍 응답 (글자가 타이핑되듯) |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**

## ✅ W01 완료!

- ✅ Part A: 챗봇 두뇌 (LLM 호출 + 히스토리 + 성격)
- ✅ Part B: MD 레시피 → 실제 웹앱 완성
- ✅ 커스텀: AI 에게 기능 추가 요청

### 다음 워크샵 예고
**W02: 문서 Q&A 봇** — 내 PDF/문서를 올리면 질문에 답하는 RAG 챗봇.
Ch09 RAG 기법을 실제 앱으로 조립합니다.`,
    },
  ],

  quiz: {
    title: "W01 — 챗봇 만들기 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "챗봇이 이전 대화를 '기억' 하게 하려면?",
        options: [
          "temperature 를 높인다",
          "messages 배열에 이전 user/assistant 턴을 계속 쌓아서 전달",
          "새 API 키를 발급받는다",
          "모델을 더 큰 것으로 바꾼다",
        ],
        correctIndex: 1,
        explanation: "LLM 은 '상태' 가 없어요. 매 호출마다 전체 히스토리를 보내야 이전 맥락을 이해합니다.",
      },
      {
        type: "multiple-choice",
        question: "바이브 코딩에서 'MD 레시피' 의 역할은?",
        options: [
          "프로그래밍 언어",
          "AI 코딩 도구에 전달하면 코드를 생성해주는 '프로그램 설명서/요청서'",
          "데이터베이스 파일",
          "이미지 파일",
        ],
        correctIndex: 1,
        explanation: "MD 레시피 = 만들고 싶은 프로그램의 상세 요구사항. AI 도구가 이걸 읽고 코드를 자동 생성.",
      },
      {
        type: "multiple-choice",
        question: "챗봇 앱에서 에러가 나면 어떻게 해야 하나요?",
        options: [
          "처음부터 다시 시작",
          "에러 메시지를 AI 에게 그대로 붙여넣고 '이 에러가 나와요' 라고 하면 수정해줌",
          "다른 프로젝트를 시작",
          "포기",
        ],
        correctIndex: 1,
        explanation: "바이브 코딩의 핵심 — 에러도 AI 에게 보여주면 해결. 대화하듯 문제를 풀어나가요.",
      },
    ],
  } satisfies Quiz,
};
