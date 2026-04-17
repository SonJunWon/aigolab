import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W03 — AI 실시간 번역기.
 *
 * Part A: 플랫폼에서 번역 두뇌 만들기 (LLM 셀)
 * Part B: MD 레시피로 실제 번역기 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW03: Lesson = {
  id: "ai-eng-w03-translator",
  language: "ai-engineering",
  track: "beginner",
  order: 103,
  title: "W03: AI 실시간 번역기",
  subtitle: "자동 언어 감지 + 톤 조절이 되는 똑똑한 번역기 완성",
  estimatedMinutes: 60,
  cells: [
    {
      type: "markdown",
      source: `# 🌐 AI 실시간 번역기 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**자동 언어 감지 + 톤 조절이 되는 AI 번역기 웹앱** — 텍스트를 입력하면 자동으로 언어를 감지하고, 원하는 언어·톤으로 번역합니다.

### 완성 모습
\`\`\`
┌──────────────────────────────────────────────────┐
│  🌐 AI 실시간 번역기           🌙  🔑            │
├──────────────────────────────────────────────────┤
│  [한국어 (감지됨) ▾]    ↔    [English ▾]        │
│  톤: [🎩 격식체 ▾]                               │
├───────────────────────┬──────────────────────────┤
│                       │                          │
│  안녕하세요!            │  Hello!                  │
│  오늘 회의 자료를       │  Could you please send   │
│  보내주실 수 있나요?    │  me the meeting          │
│                       │  materials for today?     │
│            152자       │                  📋 복사  │
├───────────────────────┴──────────────────────────┤
│         [번역하기]                                │
└──────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 번역 두뇌 만들기 | 20분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 웹앱 완성 | 40분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)`,
    },

    // ─── Part A: 번역 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 번역 두뇌 만들기 (20분)

번역기의 핵심은 3가지:
1. **기본 번역** — 텍스트를 다른 언어로 바꾸기
2. **자동 언어 감지** — 입력 언어를 ==LLM== 이 알아서 판단
3. **톤 조절** — ==system prompt== 로 격식체/반말/비즈니스 등 스타일 제어

이 3가지를 LLM 셀에서 먼저 실험합니다.`,
    },

    {
      type: "markdown",
      source: `### A-1. 기본 번역 — 한 번의 호출로 번역

\`chat()\` 에 "번역해줘" 라고 요청하면 끝! 가장 간단한 번역기입니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 기본 번역 — 한국어 → 영어
const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: "너는 전문 번역가야. 사용자가 보낸 텍스트를 영어로 번역해. 번역 결과만 출력해. 다른 설명은 하지 마.",
    },
    {
      role: "user",
      content: "안녕하세요! 오늘 회의 자료를 보내주실 수 있나요?",
    },
  ],
});

console.log("📝 원문: 안녕하세요! 오늘 회의 자료를 보내주실 수 있나요?");
console.log("🌐 번역:", response.text);`,
      hints: [
        "system prompt 에서 '번역 결과만 출력해' 가 핵심 — 없으면 AI 가 설명을 덧붙여요.",
        "'영어로 번역해' 를 '일본어로 번역해' 로 바꾸면 일본어 번역기가 됩니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 자동 언어 감지 — AI 가 입력 언어를 알아서 판단

사용자가 어떤 언어로 입력할지 모르니까, AI 에게 먼저 **감지** 시킨 뒤 반대 언어로 번역합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 자동 언어 감지 + 번역
const inputText = "I love learning new languages!";

// 1단계: 언어 감지
const detectRes = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: "사용자가 보낸 텍스트의 언어를 감지해. 언어 이름만 한국어로 답해. 예: '영어', '한국어', '일본어'",
    },
    { role: "user", content: inputText },
  ],
});

const detected = detectRes.text.trim();
console.log("🔍 감지된 언어:", detected);

// 2단계: 감지된 언어에 따라 번역 방향 결정
const targetLang = detected === "한국어" ? "영어" : "한국어";

const translateRes = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 전문 번역가야. 사용자가 보낸 텍스트를 \${targetLang}로 번역해. 번역 결과만 출력해.\`,
    },
    { role: "user", content: inputText },
  ],
});

console.log("📝 원문:", inputText);
console.log(\`🌐 \${targetLang} 번역:\`, translateRes.text);`,
      hints: [
        "2번 호출하는 이유: 1번째로 언어를 감지하고, 2번째로 번역해요.",
        "실제 앱에서는 한 번의 프롬프트로 '감지 + 번역' 을 동시에 할 수도 있어요.",
        "inputText 를 일본어나 스페인어로 바꿔서 테스트해보세요!",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 번역 품질 향상 — 톤 조절

같은 문장도 **격식체 / 반말 / 비즈니스** 에 따라 번역이 달라져요. system prompt 하나로 제어합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 톤별 번역 비교
const text = "이 프로젝트 일정을 좀 앞당길 수 있을까요?";

const tones = [
  { name: "격식체", instruction: "매우 정중하고 격식 있는 표현으로 번역해." },
  { name: "캐주얼", instruction: "친구에게 말하듯 편하고 자연스럽게 번역해." },
  { name: "비즈니스", instruction: "비즈니스 이메일에 적합한 전문적인 톤으로 번역해." },
];

for (const tone of tones) {
  const res = await chat({
    provider: "gemini",
    messages: [
      {
        role: "system",
        content: \`너는 전문 번역가야. 사용자가 보낸 텍스트를 영어로 번역해. \${tone.instruction} 번역 결과만 출력해.\`,
      },
      { role: "user", content: text },
    ],
  });

  console.log(\`── \${tone.name} ──\`);
  console.log("🌐:", res.text);
  console.log();
}`,
      hints: [
        "같은 문장인데 톤에 따라 완전 다른 영어가 나와요!",
        "격식체는 'Could you possibly...', 캐주얼은 'Can we...' 느낌.",
        "이 톤 옵션을 Part B 에서 드롭다운으로 만듭니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

번역기의 세 가지 핵심을 검증했어요:
- ✅ \`chat()\` 로 텍스트 번역
- ✅ 자동 언어 감지 → 번역 방향 결정
- ✅ \`system prompt\` 로 톤(격식/캐주얼/비즈니스) 조절

이제 이걸 **실제 웹앱** 으로 만듭니다.

---

## Part B: MD 레시피로 웹앱 완성 (40분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [완성된 번역기 앱]
\`\`\`

아래의 **MD 레시피** 를 복사해서 AI 코딩 도구에 전달하면 됩니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 실시간 번역기 웹앱 제작 요청서

## 프로젝트 개요
브라우저에서 동작하는 AI 실시간 번역기 웹앱을 만들어주세요.
Google Gemini API 를 사용합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크 모드)
- @google/genai (Gemini SDK)

## 기능 요구사항

### 1. Side-by-Side 레이아웃
- 화면을 좌우로 나누기 (데스크탑: 50:50, 모바일: 상하 배치)
- 왼쪽: 입력 영역 (textarea, 자동 높이 조절, placeholder: "번역할 텍스트를 입력하세요...")
- 오른쪽: 출력 영역 (번역 결과 표시, 읽기 전용)
- 중앙에 ↔ 스왑 버튼 (입력/출력 언어와 텍스트를 동시에 교환)

### 2. 자동 언어 감지
- 입력 텍스트가 2글자 이상이면 Gemini API 로 언어 감지 실행
- 감지된 언어를 왼쪽 상단에 배지로 표시 (예: "🔍 한국어 감지됨")
- 감지 결과에 따라 출력 언어를 자동 추천 (한국어 입력 → 영어 출력 기본)
- 디바운스 적용 (500ms) — 타이핑 중에는 감지 호출하지 않음

### 3. 언어 선택 드롭다운
- 지원 언어: 한국어, English, 日本語, 中文, Español, Français, Deutsch
- 입력 언어 선택기 (왼쪽 상단) + 출력 언어 선택기 (오른쪽 상단)
- "자동 감지" 옵션을 입력 언어 첫 번째에 배치 (기본 선택)
- 같은 언어 쌍이면 경고 표시

### 4. 톤 선택기
- 드롭다운으로 톤 선택: 🎩 격식체, 😊 캐주얼, 💼 비즈니스
- 기본값: 격식체
- 톤에 따라 system prompt 가 바뀌어 번역 스타일이 달라짐

### 5. 번역 실행
- [번역하기] 버튼 클릭 또는 Ctrl+Enter 로 번역 실행
- 번역 중 로딩 애니메이션 (출력 영역에 "번역 중..." 텍스트 + 스피너)
- Gemini 2.5 Flash 모델 사용
- API 호출 실패 시 에러 메시지 표시 + 재시도 버튼

### 6. 복사 버튼 + 토스트
- 출력 영역 우측 하단에 📋 복사 버튼
- 클릭 시 번역 결과를 클립보드에 복사
- "복사되었습니다!" 토스트 알림 (2초 후 자동 사라짐, 우측 하단에 슬라이드 인)

### 7. 글자 수 표시
- 입력 영역 좌측 하단에 글자 수 표시 (예: "152자")
- 5000자 초과 시 경고 (빨간색 표시 + "5000자 이하로 입력해주세요")

### 8. API 키 관리
- 첫 실행 시 세련된 API 키 입력 모달:
  - "🔑 Gemini API 키를 입력하세요" 제목
  - 입력란 (type=password, 토글로 보이기/숨기기)
  - "https://aistudio.google.com/apikey 에서 무료 발급" 안내 링크
  - [저장] 버튼
- localStorage 에 키 저장
- 상단 🔑 버튼 클릭 → 키 변경 또는 삭제 가능

### 9. 디자인
- 다크 모드 기본 (배경: #0f172a, 카드: #1e293b, 텍스트: #e2e8f0)
- 라이트 모드 (배경: #f8fafc, 카드: white, 텍스트: #1e293b)
- 다크/라이트 모드 토글 (상단 헤더에 🌙/☀️ 버튼)
- 반응형 (모바일: 상하 배치, 데스크탑: 좌우 배치)
- 부드러운 애니메이션 (번역 결과 fade-in, 토스트 slide-in)
- 상단 헤더: "🌐 AI 실시간 번역기" + 우측에 모드 토글 + 키 관리

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
mkdir my-translator && cd my-translator
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
- 언어 목록에 태국어, 베트남어 등 추가 가능
- "번역 히스토리 저장" 기능 추가 요청 가능
- "음성 입력 (Web Speech API)" 을 추가하면 말로 번역!
- "PDF 파일 드래그 앤 드롭" 으로 문서 번역도 가능

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 번역기가 완성되면 MD 레시피에 아래를 추가해서 AI 에게 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 번역 히스토리 목록 (최근 10개) |
| ⭐ | 출력 텍스트 음성 재생 (Web Speech API) |
| ⭐⭐ | 실시간 번역 (타이핑하면 자동 번역, 디바운스) |
| ⭐⭐ | 여러 언어 동시 번역 (한 번에 3개 언어로) |
| ⭐⭐⭐ | 이미지 속 텍스트 번역 (OCR + 번역) |
| ⭐⭐⭐ | 번역 비교 모드 (격식체 vs 캐주얼 나란히) |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**

## ✅ W03 완료!

- ✅ Part A: 번역 두뇌 (기본 번역 + 언어 감지 + 톤 조절)
- ✅ Part B: MD 레시피 → 실제 번역기 웹앱 완성
- ✅ 커스텀: AI 에게 기능 추가 요청

### 다음 워크샵 예고
**W04: AI 유튜브 기획기** — 주제를 입력하면 제목·썸네일 문구·스크립트를 자동 생성하는 유튜브 콘텐츠 기획 도우미.`,
    },
  ],

  quiz: {
    title: "W03 — AI 번역기 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "AI 번역기에서 '자동 언어 감지' 를 구현하는 방법은?",
        options: [
          "사용자가 직접 입력 언어를 선택하게 한다",
          "LLM 에게 입력 텍스트의 언어가 무엇인지 먼저 물어본다",
          "텍스트의 글자 수를 세서 판단한다",
          "브라우저의 언어 설정을 읽는다",
        ],
        correctIndex: 1,
        explanation:
          "LLM 은 다국어를 이해하기 때문에 텍스트를 보여주고 '이 텍스트는 무슨 언어야?' 라고 물어보면 정확하게 감지해줍니다.",
      },
      {
        type: "multiple-choice",
        question:
          "같은 문장을 '격식체' 와 '캐주얼' 로 번역했을 때 결과가 다른 이유는?",
        options: [
          "다른 AI 모델을 사용해서",
          "API 키가 달라서",
          "system prompt 에서 톤 지시를 다르게 줬기 때문",
          "번역 언어가 달라서",
        ],
        correctIndex: 2,
        explanation:
          "system prompt 하나로 번역 스타일이 완전히 바뀝니다. '정중하게 번역해' vs '친구한테 말하듯 번역해' 지시의 차이예요.",
      },
      {
        type: "multiple-choice",
        question:
          "번역기 앱에서 '디바운스(debounce)' 를 적용하는 이유는?",
        options: [
          "번역 품질을 높이기 위해",
          "다크 모드를 지원하기 위해",
          "타이핑할 때마다 API 호출을 하면 비용이 낭비되니까, 입력이 멈춘 후 한 번만 호출하려고",
          "보안을 강화하기 위해",
        ],
        correctIndex: 2,
        explanation:
          "디바운스 = '입력이 멈추고 N밀리초 후에 실행'. 글자 하나 칠 때마다 API 를 호출하면 비용도, 서버 부하도 낭비예요.",
      },
    ],
  } satisfies Quiz,
};
