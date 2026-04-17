import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W06 — AI 이미지 분석기.
 *
 * Part A: 플랫폼에서 멀티모달 분석 체험 (LLM 셀)
 * Part B: MD 레시피로 드래그&드롭 이미지 분석 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW06: Lesson = {
  id: "ai-eng-w06-image-analyzer",
  language: "ai-engineering",
  track: "beginner",
  order: 106,
  title: "W06: AI 이미지 분석기",
  subtitle: "사진 한 장 넣으면 AI가 설명·태그·색상·분위기를 알려줘요",
  estimatedMinutes: 90,
  cells: [
    {
      type: "markdown",
      source: `# 🖼️ AI 이미지 분석기 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**사진을 넣으면 AI 가 분석해주는 웹앱** — 드래그&드롭으로 이미지를 올리면 설명, 감지된 객체, 색상 팔레트, 분위기, 해시태그가 카드로 나옵니다.

### 완성 모습
\`\`\`
┌──────────────────────────────────┐
│  🖼️ AI 이미지 분석기             │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │   📂 이미지를 여기에 놓거나  │  │
│  │      클릭해서 업로드         │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  [일반 설명] [대체텍스트] [SNS]   │
│  [상품 설명] [커스텀]             │
│                                  │
│  ── 분석 결과 ──                 │
│  📝 설명: 노을이 지는 해변가...   │
│  🏷️ 객체: 바다, 모래, 석양, 갈매기│
│  🎨 색상: 🟠 🟡 🔵 🟣           │
│  😊 분위기: 평화로움, 낭만적      │
│  #해변 #석양 #자연 #힐링          │
│                                  │
│  [📋 복사] [📥 다운로드]          │
└──────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | ==멀티모달== AI 분석 체험 | 30분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 실제 웹앱 완성 | 60분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **Part B 전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)`,
    },

    // ─── Part A: 멀티모달 분석 체험 ───
    {
      type: "markdown",
      source: `## Part A: 멀티모달 AI 분석 체험 (30분)

==멀티모달== AI 란 텍스트뿐 아니라 **이미지, 오디오, 영상** 까지 이해하는 AI 예요.
Gemini 같은 ==비전 모델== 에 이미지를 보내면 "사진 속에 뭐가 있는지" 알려줍니다.

이 플랫폼의 LLM 셀에서는 직접 이미지를 업로드할 수 없지만,
**텍스트로 장면을 묘사하고 AI 에게 분석을 요청**하는 방식으로
멀티모달 분석의 핵심 개념을 체험합니다.

> 💡 Part B 에서 진짜 이미지를 ==base64== 로 변환해 Gemini Vision API 에 보내는 앱을 만들어요!`,
    },

    {
      type: "markdown",
      source: `### A-1. 이미지 설명 생성 — 멀티모달 분석이란?

==비전 모델== 은 이미지를 받으면 "어떤 장면인지" 자연어로 설명해요.
여기서는 장면을 텍스트로 묘사한 뒤, AI 에게 "이 장면을 분석해줘" 라고 요청합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-1: 장면 묘사 → AI 이미지 설명 생성 체험
// 실제 멀티모달 API 에서는 이미지를 직접 보내지만,
// 여기서는 텍스트 묘사로 개념을 이해합니다.

const scene = \`
[장면 묘사]
- 해변가에 석양이 지고 있다
- 하늘은 주황색, 분홍색, 보라색 그라데이션
- 모래 위에 발자국이 있고 파도가 밀려온다
- 멀리 갈매기 세 마리가 날고 있다
- 오른쪽에 야자수 두 그루가 서 있다
\`;

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 이미지 분석 AI야. 사용자가 장면을 묘사하면,
실제 사진을 보는 것처럼 자연스러운 설명을 생성해.
마치 눈앞에 사진이 있는 것처럼 "이 사진은..." 으로 시작해.\`,
    },
    { role: "user", content: \`이 장면을 사진처럼 분석해서 설명해줘:\\n\${scene}\` },
  ],
});

console.log("📝 AI 이미지 설명:");
console.log(response.text);`,
      hints: [
        "실제 Gemini Vision API 에서는 이미지 파일을 직접 전달하면 이런 설명이 자동으로 나와요.",
        "Part B 에서 만들 앱은 사진을 드래그&드롭하면 이 과정이 자동으로 일어납니다.",
        "장면 묘사를 바꿔보세요 — 교실, 카페, 고양이 사진 등!",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 구조화된 분석 — JSON 으로 결과 받기

AI 에게 "JSON 형식으로 답해줘" 라고 하면 프로그램이 쉽게 처리할 수 있는 구조화된 결과를 받을 수 있어요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-2: 구조화된 이미지 분석 — JSON 출력
const scene = \`
[장면 묘사]
- 카페 내부, 나무 테이블 위에 라떼아트가 있는 커피 한 잔
- 옆에 펼쳐진 책과 안경
- 창밖으로 비가 내리는 모습
- 따뜻한 조명, 아늑한 분위기
\`;

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 이미지 분석 AI야. 장면을 분석해서 반드시 아래 JSON 형식으로만 답해.
다른 텍스트 없이 JSON 만 출력해.

{
  "description": "사진에 대한 2-3문장 설명",
  "objects": ["감지된 객체 목록"],
  "colors": ["주요 색상 목록 (한국어)"],
  "mood": "전체 분위기 한 줄",
  "tags": ["추천 해시태그 5개 (# 없이)"]
}\`,
    },
    { role: "user", content: \`이 장면을 분석해줘:\\n\${scene}\` },
  ],
});

console.log("🔍 구조화된 분석 결과:");
console.log(response.text);

// JSON 파싱 시도
try {
  const analysis = JSON.parse(response.text);
  console.log("\\n── 파싱 결과 ──");
  console.log("📝 설명:", analysis.description);
  console.log("🏷️ 객체:", analysis.objects.join(", "));
  console.log("🎨 색상:", analysis.colors.join(", "));
  console.log("😊 분위기:", analysis.mood);
  console.log("# 태그:", analysis.tags.map((t: string) => "#" + t).join(" "));
} catch {
  console.log("⚠️ JSON 파싱 실패 — AI 가 형식을 안 지켰을 수 있어요. 다시 실행해보세요!");
}`,
      hints: [
        "AI 가 JSON 형식을 안 지키면? system prompt 를 더 강하게 쓰거나, 응답 후 파싱 로직으로 처리.",
        "실제 앱에서는 이 JSON 을 카드 UI 로 예쁘게 보여줍니다.",
        "objects, colors, tags 는 배열 — 태그 칩, 색상 팔레트 UI 에 딱이에요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 맞춤 분석 프롬프트 — 용도별 분석 모드

같은 이미지라도 **분석 목적** 에 따라 완전 다른 결과가 나와요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-3: 분석 모드별 다른 결과
const scene = \`
[장면 묘사]
- 밝은 배경 위에 빨간색 운동화 한 켤레
- 흰색 밑창, 옆면에 작은 로고
- 깔끔하게 정면에서 촬영한 느낌
- 그림자가 살짝 보임
\`;

const modes = [
  {
    name: "일반 설명",
    prompt: "이 장면을 보고 자연스러운 한국어로 2-3문장 설명해줘.",
  },
  {
    name: "접근성 대체텍스트",
    prompt: \`이 장면을 웹 접근성용 alt 텍스트로 작성해줘.
시각장애인이 이해할 수 있도록 핵심 정보만 간결하게 (50자 이내).\`,
  },
  {
    name: "SNS 캡션 생성",
    prompt: \`이 장면에 어울리는 인스타그램 캡션을 만들어줘.
감성적 한 줄 + 해시태그 5개. 이모지 포함.\`,
  },
  {
    name: "상품 설명",
    prompt: \`이 장면을 쇼핑몰 상품 설명으로 작성해줘.
상품명, 주요 특징 3개, 추천 대상을 포함.\`,
  },
];

for (const mode of modes) {
  const res = await chat({
    provider: "gemini",
    messages: [
      {
        role: "system",
        content: "너는 이미지 분석 AI야. 장면 묘사를 실제 사진처럼 취급해서 요청대로 답해.",
      },
      { role: "user", content: \`\${mode.prompt}\\n\\n\${scene}\` },
    ],
  });

  console.log(\`── \${mode.name} ──\`);
  console.log(res.text);
  console.log();
}`,
      hints: [
        "같은 사진인데 용도에 따라 완전 다른 결과! 이게 프롬프트 엔지니어링의 힘.",
        "접근성 대체텍스트는 웹사이트에서 시각장애인을 위한 필수 기능이에요.",
        "Part B 에서 이 4가지 모드를 버튼으로 선택할 수 있게 만듭니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

멀티모달 AI 분석의 핵심을 체험했어요:
- ✅ AI 에게 장면을 묘사해서 설명 생성
- ✅ JSON 구조화 출력으로 프로그램이 쓸 수 있는 데이터 생성
- ✅ 용도별 분석 모드 (일반/접근성/SNS/상품)

이제 Part B 에서 **진짜 이미지를 드래그&드롭** 하면 Gemini Vision API 가 분석하는 앱을 만듭니다!

> 💡 Part B 의 핵심 기술: 이미지 파일 → ==base64== 인코딩 → Gemini ==비전 모델== 에 전달

---

## Part B: MD 레시피로 웹앱 완성 (60분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [완성된 이미지 분석 앱]
\`\`\`

아래의 **MD 레시피** 를 복사해서 AI 코딩 도구에 전달하면 됩니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 이미지 분석기 웹앱 제작 요청서

## 프로젝트 개요
이미지를 드래그&드롭으로 업로드하면 AI 가 분석해주는 웹앱을 만들어주세요.
Google Gemini 2.5 Flash 의 멀티모달(비전) 기능을 사용합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크 모드)
- @google/genai (Gemini SDK — 비전/멀티모달 지원)

## 기능 요구사항

### 1. 이미지 업로드 영역
- 화면 상단에 큰 드래그&드롭 존
  - 점선 테두리, 아이콘 + "이미지를 여기에 놓거나 클릭해서 업로드" 텍스트
  - 드래그 오버 시 테두리 색상 변경 + 배경 하이라이트
  - 클릭하면 파일 선택 다이얼로그 열기 (accept="image/*")
  - **클립보드 붙여넣기 지원** (Ctrl+V / Cmd+V 로 스크린샷 바로 분석)
- 파일 유효성 검사: 이미지 파일만 허용, 최대 10MB 제한
- 여러 장 업로드 가능 (최대 2장 — 비교 분석용)

### 2. 이미지 미리보기
- 업로드 후 썸네일 표시 (최대 너비 300px)
- 파일 정보: 파일명, 크기 (KB/MB), 해상도 (width x height)
- X 버튼으로 이미지 제거
- 2장 업로드 시 나란히 표시

### 3. 분석 모드 선택
- 버튼 그룹으로 5가지 모드 선택:
  - 📝 일반 설명: 사진에 대한 자연스러운 설명
  - ♿ 접근성 대체텍스트: 웹 alt 속성용 간결한 텍스트
  - 📱 SNS 캡션: 인스타그램용 감성 캡션 + 해시태그
  - 🛍️ 상품 설명: 쇼핑몰 상품 상세 설명
  - ✏️ 커스텀: 사용자가 직접 분석 요청 입력
- 커스텀 모드 선택 시 텍스트 입력란 표시
- 선택된 모드 버튼 하이라이트

### 4. Gemini Vision API 호출
- 이미지를 FileReader 로 base64 인코딩
- @google/genai SDK 사용:
  \\\`\\\`\\\`typescript
  import { GoogleGenAI } from "@google/genai";
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType: file.type, data: base64Data } },
        { text: modePrompt }
      ]
    }]
  });
  \\\`\\\`\\\`
- 일반 설명 모드일 때는 추가로 JSON 구조화 요청:
  설명, 감지된 객체 배열, 주요 색상 배열, 분위기, 추천 해시태그 배열
- 2장 업로드 시 두 이미지를 함께 보내고 "두 이미지를 비교 분석해줘" 요청

### 5. 분석 결과 표시
- 카드 형태의 깔끔한 레이아웃:
  - 📝 설명: 2-3문장 자연어 설명
  - 🏷️ 감지된 객체: 태그 칩 형태 (둥근 배지)
  - 🎨 주요 색상: 색상 원형 팔레트 (가능하면 실제 색 표시)
  - 😊 분위기: 한 줄 텍스트
  - # 해시태그: 클릭하면 복사되는 태그들
- 로딩 중 스켈레톤 UI + "🔍 이미지 분석 중..." 텍스트
- 에러 시 친절한 안내 메시지

### 6. 결과 활용 기능
- [📋 복사] 버튼: 분석 결과를 클립보드에 텍스트로 복사 + "복사됨!" 토스트
- [📥 다운로드] 버튼: 분석 결과를 .txt 파일로 다운로드 (파일명: 분석결과_날짜.txt)
- 각 섹션(설명/태그/해시태그)별 개별 복사 버튼

### 7. API 키 관리
- 첫 실행 시 세련된 API 키 입력 모달:
  - "🔑 Gemini API 키를 입력하세요" 제목
  - 입력란 (type=password, 토글로 보이기/숨기기)
  - "https://aistudio.google.com/apikey 에서 무료 발급" 안내 링크
  - [저장] 버튼
- localStorage 에 키 저장
- 상단 ⚙️ 버튼으로 키 변경/삭제

### 8. 디자인
- 다크 모드 기본 (배경: #0f172a, 카드: #1e293b, 텍스트: #e2e8f0)
- 라이트 모드 (배경: #f8fafc, 카드: white, 텍스트: #1e293b)
- 다크/라이트 모드 토글 (상단 헤더에 🌙/☀️)
- 반응형 (모바일 세로 레이아웃, 데스크탑 넓은 레이아웃)
- 드롭 존 호버/드래그 애니메이션
- 결과 카드 fade-in 애니메이션

## 환경 변수
GEMINI_API_KEY 는 런타임에 사용자가 입력 (하드코딩 금지)

## 실행 방법
npm install → npm run dev → localhost:5173 에서 확인

## 주의사항
- API 키를 소스 코드에 절대 하드코딩하지 마세요
- 모든 텍스트는 한국어로
- 큰 이미지는 리사이즈 후 전송 (최대 1024px) — 토큰 절약
- base64 인코딩 시 data:image/... 프리픽스 제거 후 전송
- TypeScript strict 모드
\`\`\`

---

### 사용 방법

**🅰️ Claude Code 사용자:**
\`\`\`bash
mkdir image-analyzer && cd image-analyzer
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
- "분석 히스토리 저장" 기능 추가 요청 가능
- "이미지 URL 입력해서 분석" 기능 추가 가능
- "분석 결과를 마크다운으로 내보내기" 추가 가능
- OCR 모드 추가: "이미지 속 텍스트를 읽어줘" 요청

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 이미지 분석기가 완성되면 MD 레시피에 아래를 추가해서 AI 에게 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 분석 결과 마크다운 다운로드 |
| ⭐ | 이미지 URL 입력으로 분석 |
| ⭐⭐ | OCR 모드 — 사진 속 텍스트 추출 |
| ⭐⭐ | 분석 히스토리 (이전 분석 목록 저장) |
| ⭐⭐⭐ | 실시간 카메라 캡처 → 즉시 분석 |
| ⭐⭐⭐ | 여러 장 일괄 분석 + 결과 비교 표 |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**

## ✅ W06 완료!

- ✅ Part A: ==멀티모달== AI 분석 개념 체험 (설명/구조화/모드별)
- ✅ Part B: MD 레시피 → 드래그&드롭 이미지 분석 웹앱 완성
- ✅ 도전: AI 에게 기능 추가 요청

### 다음 워크샵 예고
**W07: AI 숏폼 콘텐츠 메이커** — 주제를 입력하면 AI 가 숏폼 대본, 자막, 썸네일 텍스트를 자동 생성.
영상 제작의 가장 귀찮은 작업을 AI 가 대신해줍니다!`,
    },
  ],

  quiz: {
    title: "W06 — 이미지 분석기 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "멀티모달 AI 란 무엇인가요?",
        options: [
          "텍스트만 처리하는 AI",
          "텍스트, 이미지, 오디오 등 여러 형태의 데이터를 이해하는 AI",
          "여러 언어를 번역하는 AI",
          "여러 개의 AI 모델을 합친 것",
        ],
        correctIndex: 1,
        explanation:
          "멀티모달(multimodal) = '여러 형태'. 텍스트 + 이미지 + 오디오 등 다양한 입력을 함께 이해하는 AI 를 말해요.",
      },
      {
        type: "multiple-choice",
        question:
          "브라우저에서 이미지를 Gemini Vision API 에 보내려면 어떻게 변환해야 하나요?",
        options: [
          "이미지를 텍스트로 설명해서 보낸다",
          "FileReader 로 base64 인코딩해서 inlineData 로 전달",
          "이미지를 압축해서 ZIP 파일로 보낸다",
          "이미지 URL 만 보내면 된다",
        ],
        correctIndex: 1,
        explanation:
          "브라우저의 FileReader API 로 이미지를 base64 문자열로 변환한 뒤, Gemini SDK 의 inlineData 필드에 넣어 전송합니다.",
      },
      {
        type: "multiple-choice",
        question:
          "같은 이미지를 분석할 때 '접근성 대체텍스트' 모드와 'SNS 캡션' 모드의 결과가 다른 이유는?",
        options: [
          "다른 AI 모델을 사용해서",
          "이미지가 다르게 인코딩돼서",
          "시스템 프롬프트(분석 지시)가 다르기 때문에",
          "API 키가 달라서",
        ],
        correctIndex: 2,
        explanation:
          "같은 이미지 + 같은 모델이라도 프롬프트가 다르면 완전 다른 결과! 이게 프롬프트 엔지니어링의 핵심이에요.",
      },
    ],
  } satisfies Quiz,
};
