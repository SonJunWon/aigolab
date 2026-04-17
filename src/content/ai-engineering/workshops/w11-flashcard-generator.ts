import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W11 — AI 학습 카드 생성기.
 *
 * Part A: 플랫폼에서 핵심 개념 추출 & 플래시카드 생성 체험 (LLM 셀)
 * Part B: MD 레시피로 PDF → 플래시카드 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW11: Lesson = {
  id: "ai-eng-w11-flashcard-generator",
  language: "ai-engineering",
  track: "beginner",
  order: 111,
  title: "W11: AI 학습 카드 생성기",
  subtitle: "PDF 올리면 AI가 퀴즈와 플래시카드를 자동 생성",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 🃏 AI 학습 카드 생성기 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**PDF/텍스트 파일을 올리면 AI 가 ==플래시카드== 와 퀴즈를 자동 생성하는 웹앱** — 카드를 뒤집고, 맞힌 횟수를 추적하고, 틀린 카드를 집중 복습합니다.

### 완성 모습
\`\`\`
┌──────────────────────────────────────┐
│  🃏 AI 학습 카드 생성기               │
├──────────────────────────────────────┤
│                                      │
│  📂 PDF/텍스트 파일 업로드            │
│  ┌──────────────────────────────┐    │
│  │  📄 chapter05-photosynthesis │    │
│  │     12개 개념 추출 완료 ✅     │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │   Q. 광합성에서 빛에너지를     │    │
│  │      흡수하는 색소는?          │    │
│  │                              │    │
│  │      👆 클릭해서 정답 보기      │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  ← 이전  [ 3 / 12 ]  다음 →         │
│                                      │
│  [몰랐어요 😅] [애매해요 🤔] [알았어요 ✅] │
│                                      │
│  ── 학습 현황 ──                      │
│  정답률: 75%  |  🔥 연속 5개 정답     │
│  취약 카드: 3개                       │
└──────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 핵심 개념 추출 & 카드 생성 체험 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 플래시카드 앱 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **Part B 전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)`,
    },

    // ─── Part A: 핵심 개념 추출 & 카드 생성 ───
    {
      type: "markdown",
      source: `## Part A: 핵심 개념 추출 & 카드 생성 체험 (50분)

==플래시카드== 학습의 핵심 아이디어는 간단해요:
1. **핵심 개념 추출** — 긴 글에서 중요한 내용을 골라낸다
2. **카드 생성** — 앞면(질문)과 뒷면(정답)을 만든다
3. **==spaced repetition==** — 틀린 카드를 더 자주 복습한다

AI 가 이 세 단계를 전부 자동으로 해줍니다!

> 💡 ==spaced repetition== 은 "간격 반복 학습". 기억이 사라지기 직전에 다시 보면 장기 기억에 남아요!`,
    },

    {
      type: "markdown",
      source: `### A-1. 핵심 개념 추출 — 긴 글에서 중요한 것만 골라내기

교과서 내용을 통째로 외울 수 없잖아요?
AI 에게 "핵심 개념만 뽑아줘" 라고 하면 JSON 으로 깔끔하게 정리해줍니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-1: 텍스트에서 핵심 개념을 JSON 배열로 추출
const passage = \`
광합성은 식물이 빛에너지를 이용하여 이산화탄소와 물로부터
포도당을 합성하는 과정이다. 이 반응은 엽록체에서 일어나며,
엽록소가 빛에너지를 흡수하는 역할을 한다.
광합성의 화학 반응식은 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ 이다.
광합성은 명반응과 암반응으로 나뉜다.
명반응은 빛이 필요하며 틸라코이드에서 일어나고,
암반응(캘빈 회로)은 빛 없이도 진행되며 스트로마에서 일어난다.
\`;

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 학습 도우미 AI야. 사용자가 텍스트를 주면,
핵심 개념을 추출해서 반드시 아래 JSON 형식으로만 답해.
다른 텍스트 없이 JSON 만 출력해.

[
  { "concept": "개념 이름", "definition": "쉬운 설명 (1-2문장)" }
]

중학생이 이해할 수 있는 쉬운 말로 설명해. 최대 8개.\`,
    },
    { role: "user", content: \`이 글에서 핵심 개념을 추출해줘:\\n\${passage}\` },
  ],
});

console.log("📚 추출된 핵심 개념:");
console.log(response.text);

try {
  const concepts = JSON.parse(response.text);
  console.log(\`\\n총 \${concepts.length}개 개념 추출 완료!\\n\`);
  for (const c of concepts) {
    console.log(\`  📌 \${c.concept}: \${c.definition}\`);
  }
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "passage 를 다른 과목 내용 (역사, 영어 등) 으로 바꿔보세요!",
        "실제 앱에서는 PDF 에서 추출한 텍스트가 여기에 들어갑니다.",
        "concept 과 definition 이 있으면 바로 플래시카드 앞면/뒷면이 됩니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 플래시카드 생성 — 다양한 형식의 카드 만들기

같은 개념이라도 **질문 형식**이 다르면 다른 각도에서 복습할 수 있어요.
==플래시카드== 의 유형: 정의형, 빈칸 채우기, O/X 퀴즈, 객관식`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-2: 핵심 개념 → 다양한 형식의 플래시카드 생성
const concepts = [
  { concept: "광합성", definition: "식물이 빛에너지로 포도당을 만드는 과정" },
  { concept: "엽록소", definition: "빛에너지를 흡수하는 초록색 색소" },
  { concept: "명반응", definition: "빛이 필요한 광합성 1단계, 틸라코이드에서 진행" },
];

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 플래시카드 생성 AI야. 개념 목록을 받으면
각 개념에 대해 4가지 형식의 카드를 만들어.
반드시 JSON 배열로만 답해. 다른 텍스트 없이.

[
  {
    "concept": "개념명",
    "cards": [
      { "type": "definition", "front": "질문", "back": "정답" },
      { "type": "fill-blank", "front": "___에 들어갈 말은?", "back": "정답" },
      { "type": "true-false", "front": "O/X: 진술문", "back": "O 또는 X + 설명" },
      { "type": "multiple-choice", "front": "질문", "options": ["A","B","C","D"], "answer": 0, "back": "정답 설명" }
    ]
  }
]

중학생 수준으로 쉽게 만들어.\`,
    },
    {
      role: "user",
      content: \`이 개념들로 플래시카드를 만들어줘:\\n\${JSON.stringify(concepts, null, 2)}\`,
    },
  ],
});

console.log("🃏 생성된 플래시카드:");
console.log(response.text);

try {
  const result = JSON.parse(response.text);
  for (const item of result) {
    console.log(\`\\n── \${item.concept} ──\`);
    for (const card of item.cards) {
      console.log(\`  [\${card.type}]\`);
      console.log(\`    앞: \${card.front}\`);
      console.log(\`    뒤: \${card.back}\`);
    }
  }
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "4가지 유형: definition(정의형), fill-blank(빈칸 채우기), true-false(O/X), multiple-choice(객관식)",
        "같은 '엽록소' 개념이 4가지 다른 질문으로 나옵니다 — 이래야 진짜 이해한 거예요!",
        "Part B 에서는 카드 유형별로 다른 UI 를 보여줍니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 난이도 조절 — 쉬움/보통/어려움 버전 만들기

같은 개념이라도 학습 수준에 따라 난이도가 달라야 해요.
AI 에게 "이 카드를 3가지 난이도로 만들어줘" 라고 하면 됩니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-3: 같은 개념을 쉬움/보통/어려움 3단계로
const concept = {
  name: "광합성",
  definition: "식물이 빛에너지를 이용하여 이산화탄소와 물로부터 포도당을 합성하는 과정",
};

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 학습 카드 난이도 조절 전문 AI야.
하나의 개념을 받으면 3가지 난이도의 플래시카드를 만들어.
반드시 JSON 으로만 답해.

{
  "easy": { "front": "초등학생도 알 수 있는 쉬운 질문", "back": "간단한 답" },
  "medium": { "front": "중학생 수준의 질문", "back": "좀 더 자세한 답" },
  "hard": { "front": "고등학생~대학생 수준의 심화 질문", "back": "전문적 답변" }
}

각 난이도의 차이가 확실하게 드러나야 해.\`,
    },
    {
      role: "user",
      content: \`이 개념을 3가지 난이도로 만들어줘:\\n개념: \${concept.name}\\n설명: \${concept.definition}\`,
    },
  ],
});

console.log("📊 난이도별 플래시카드:");
console.log(response.text);

try {
  const levels = JSON.parse(response.text);
  const labels = { easy: "🟢 쉬움", medium: "🟡 보통", hard: "🔴 어려움" };
  for (const [level, label] of Object.entries(labels)) {
    const card = levels[level as keyof typeof levels] as { front: string; back: string };
    console.log(\`\\n\${label}\`);
    console.log(\`  앞: \${card.front}\`);
    console.log(\`  뒤: \${card.back}\`);
  }
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "쉬움: '광합성이란 뭘까?' / 보통: '광합성의 반응물과 생성물은?' / 어려움: '명반응과 암반응의 차이를 설명하라'",
        "실제 앱에서는 사용자가 난이도를 선택하면 해당 카드만 보여줍니다.",
        "틀린 카드는 한 단계 쉬운 버전을 먼저 보여주는 것도 좋은 전략!",
      ],
    },

    {
      type: "markdown",
      source: `### A-4. 오답 선택지 생성 — 그럴듯한 ==distractor== 만들기

객관식 퀴즈에서 가장 어려운 건 **정답 비슷하지만 틀린 선택지** 를 만드는 거예요.
이걸 ==distractor== (오답 선택지) 라고 해요. AI 가 잘 만들어줍니다!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-4: 객관식 카드의 그럴듯한 오답 선택지 생성
const card = {
  question: "광합성에서 빛에너지를 흡수하는 색소는?",
  correctAnswer: "엽록소",
  topic: "생물 - 광합성",
};

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 교육용 퀴즈 출제 전문 AI야.
정답이 주어지면, 그럴듯하지만 틀린 오답 선택지(distractor) 3개를 생성해.
반드시 JSON 으로만 답해.

{
  "distractors": [
    { "text": "오답1", "why_wrong": "틀린 이유 설명" },
    { "text": "오답2", "why_wrong": "틀린 이유 설명" },
    { "text": "오답3", "why_wrong": "틀린 이유 설명" }
  ],
  "shuffled": ["선택지1", "선택지2", "선택지3", "선택지4"],
  "correct_index": 0
}

규칙:
- 오답은 같은 분야의 비슷한 용어로 (완전 엉뚱한 건 X)
- 난이도에 맞게 헷갈릴 만한 것으로
- shuffled 에서 정답 위치는 무작위로\`,
    },
    {
      role: "user",
      content: \`질문: \${card.question}\\n정답: \${card.correctAnswer}\\n과목: \${card.topic}\`,
    },
  ],
});

console.log("🔀 오답 선택지 생성 결과:");
console.log(response.text);

try {
  const result = JSON.parse(response.text);
  console.log("\\n── 왜 이 오답들인가? ──");
  for (const d of result.distractors) {
    console.log(\`  ❌ \${d.text} → \${d.why_wrong}\`);
  }
  console.log("\\n── 완성된 객관식 ──");
  console.log(\`Q. \${card.question}\`);
  result.shuffled.forEach((opt: string, i: number) => {
    const marker = i === result.correct_index ? "✅" : "  ";
    console.log(\`  \${marker} \${i + 1}. \${opt}\`);
  });
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "좋은 distractor = 같은 분야에서 비슷하지만 다른 개념. '미토콘드리아', '리보솜' 등이 나올 거예요.",
        "엉뚱한 오답 (예: '바나나') 은 너무 쉬워서 학습 효과가 없어요.",
        "why_wrong 이 있으면 오답을 골랐을 때 '왜 틀렸는지' 피드백을 줄 수 있어요.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

AI 플래시카드 생성의 핵심을 모두 체험했어요:
- ✅ 긴 텍스트에서 핵심 개념 추출 (JSON 구조화)
- ✅ 다양한 형식의 카드 생성 (정의형/빈칸/O·X/객관식)
- ✅ 난이도별 카드 생성 (쉬움/보통/어려움)
- ✅ 그럴듯한 ==distractor== (오답 선택지) 생성

이제 Part B 에서 **파일을 업로드하면 자동으로 카드가 생성되는 완전한 앱** 을 만듭니다!

> 💡 Part B 의 핵심 기술: PDF 텍스트 추출 → AI 개념 추출 → 카드 생성 → 뒤집기 UI + ==spaced repetition==

---

## Part B: MD 레시피로 웹앱 완성 (100분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [완성된 플래시카드 앱]
\`\`\`

아래의 **MD 레시피** 를 복사해서 AI 코딩 도구에 전달하면 됩니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 학습 카드 생성기 웹앱 제작 요청서

## 프로젝트 개요
PDF/텍스트 파일을 업로드하면 AI 가 핵심 개념을 추출하고,
자동으로 플래시카드와 퀴즈를 생성하는 학습 도구 웹앱을 만들어주세요.
Google Gemini 2.5 Flash 를 사용합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크 모드)
- @google/genai (Gemini SDK)
- pdfjs-dist (PDF 텍스트 추출)

## 기능 요구사항

### 1. 파일 업로드 영역
- 화면 상단에 드래그&드롭 존
  - 점선 테두리, 아이콘 + "PDF, TXT, MD 파일을 여기에 놓거나 클릭해서 업로드" 텍스트
  - 드래그 오버 시 테두리 색상 변경 + 배경 하이라이트
  - 클릭하면 파일 선택 다이얼로그 열기 (accept=".pdf,.txt,.md")
- 파일 유형별 텍스트 추출:
  - .pdf → pdfjs-dist 로 페이지별 텍스트 추출
  - .txt / .md → FileReader 로 직접 읽기
- 파일 정보 표시: 파일명, 크기, 추출된 텍스트 글자 수
- 텍스트 직접 입력도 가능 (textarea 탭)

### 2. 텍스트 미리보기 + 청크 표시
- 추출된 텍스트를 접을 수 있는 미리보기로 표시
- 긴 텍스트는 자동으로 청크 분할 (약 1000자 단위)
- 각 청크를 하이라이트 색상으로 구분 표시
- "총 N개 청크, 약 M개 개념 추출 예상" 안내

### 3. "카드 생성" 버튼 + 진행 상황
- 큰 "🃏 카드 생성하기" 버튼
- 생성 옵션:
  - 카드 유형 체크박스: ☑ 정의형 ☑ 빈칸 채우기 ☑ O/X ☑ 객관식
  - 난이도 선택: 🟢 쉬움 / 🟡 보통 / 🔴 어려움 (다중 선택 가능)
  - 카드 수 제한: 슬라이더 (10~50장)
- 생성 중 프로그레스 바:
  - "청크 1/5 처리 중..." → "개념 추출 중..." → "카드 생성 중..."
  - 각 단계별 진행률 표시

### 4. 플래시카드 UI
- **카드 뒤집기 애니메이션:**
  - CSS 3D transform (perspective + rotateY)
  - 앞면: 질문 (큰 글씨, 카드 유형 뱃지)
  - 뒷면: 정답 + 설명 (뒤집기 후 보이기)
  - 클릭 또는 스페이스바로 뒤집기
- **카드 네비게이션:**
  - ← 이전 / → 다음 버튼
  - 키보드 화살표 지원
  - 현재 위치 표시: "3 / 12"
  - 진행률 바 (상단)
- **자기 평가 버튼 (뒤집은 후 표시):**
  - [몰랐어요 😅] — 빨간색, 이 카드 자주 다시 보여줌
  - [애매해요 🤔] — 노란색, 가끔 다시 보여줌
  - [알았어요 ✅] — 초록색, 덜 자주 보여줌
- **카드 유형별 UI:**
  - 정의형: 앞면 "Q. 질문", 뒷면 "A. 정의"
  - 빈칸 채우기: 밑줄 표시 ___
  - O/X 퀴즈: O, X 버튼 2개 (선택 후 결과)
  - 객관식: 4개 선택지 버튼 (선택 후 정답 하이라이트)

### 5. 학습 현황 대시보드
- 정답률 원형 차트 (전체, 카드 유형별)
- 취약 카드 목록 (정답률 50% 이하 빨간 표시)
- 🔥 연속 정답 카운터 (streak)
- 오늘 학습한 카드 수 / 전체 카드 수
- 학습 히스토리 (날짜별 정답률 추이) — 간단한 막대 차트

### 6. 간격 반복 학습 (Spaced Repetition)
- 자기 평가 결과에 따라 카드 재등장 빈도 조절:
  - 몰랐어요 → 바로 다음에 다시
  - 애매해요 → 3~5장 후에 다시
  - 알았어요 → 현재 세션에서 제외, 복습 세션에서 등장
- "취약 카드만 복습" 모드
- "전체 셔플" 모드
- "새 카드만" 모드

### 7. 덱 관리
- 생성된 카드 세트를 "덱" 으로 저장 (localStorage)
- 덱 이름 지정, 수정, 삭제
- 여러 덱 목록 표시 (덱 선택 화면)
- 각 덱의 카드 수, 마지막 학습일, 정답률 표시

### 8. 내보내기
- CSV 내보내기 (Anki 호환 형식: front, back)
- 인쇄용 레이아웃: 카드를 2열 격자로 정리, Ctrl+P 로 인쇄
- JSON 내보내기 (백업용)

### 9. API 키 관리
- 첫 실행 시 세련된 API 키 입력 모달:
  - "🔑 Gemini API 키를 입력하세요" 제목
  - 입력란 (type=password, 토글로 보이기/숨기기)
  - "https://aistudio.google.com/apikey 에서 무료 발급" 안내 링크
  - [저장] 버튼
- localStorage 에 키 저장
- 상단 ⚙️ 버튼으로 키 변경/삭제

### 10. 디자인
- 다크 모드 기본 (배경: #0f172a, 카드: #1e293b, 텍스트: #e2e8f0)
- 라이트 모드 (배경: #f8fafc, 카드: white, 텍스트: #1e293b)
- 다크/라이트 모드 토글 (상단 헤더에 🌙/☀️)
- 반응형 (모바일 세로 레이아웃, 데스크탑 넓은 레이아웃)
- 카드 뒤집기: CSS perspective(1000px) + rotateY(180deg) + backface-visibility
- 정답/오답 피드백 애니메이션 (초록 체크 / 빨간 X)

## 환경 변수
GEMINI_API_KEY 는 런타임에 사용자가 입력 (하드코딩 금지)

## 실행 방법
npm install → npm run dev → localhost:5173 에서 확인

## 주의사항
- API 키를 소스 코드에 절대 하드코딩하지 마세요
- 모든 텍스트는 한국어로
- PDF 파싱 실패 시 친절한 에러 메시지 ("이 PDF 는 이미지만 있어서 텍스트 추출이 안 돼요")
- 큰 텍스트는 청크별로 AI 요청 (한 번에 너무 많이 보내지 않기)
- TypeScript strict 모드
\`\`\`

---

### 사용 방법

**🅰️ Claude Code 사용자:**
\`\`\`bash
mkdir flashcard-generator && cd flashcard-generator
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
- "이미지 속 텍스트(OCR) 도 카드로 만들어줘" 요청 가능
- "음성으로 문제 읽어줘 (TTS)" 기능 추가 가능
- "카드를 공유 링크로 보내기" 기능 추가 가능
- "AI 가 틀린 이유를 설명해주는 피드백" 추가 가능

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 플래시카드 앱이 완성되면 MD 레시피에 아래를 추가해서 AI 에게 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 카드를 JSON 파일로 백업/복원 |
| ⭐ | 카드 수동 편집 (앞면/뒷면 직접 수정) |
| ⭐⭐ | 이미지 속 텍스트(OCR) 로 카드 생성 |
| ⭐⭐ | 음성으로 문제 읽어주기 (Web Speech TTS) |
| ⭐⭐⭐ | 멀티플레이어 퀴즈 대결 모드 |
| ⭐⭐⭐ | AI 튜터: 틀린 문제에 대해 추가 설명 생성 |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**

## ✅ W11 완료!

- ✅ Part A: 핵심 개념 추출 → ==플래시카드== 생성 → 난이도 조절 → ==distractor== 생성
- ✅ Part B: MD 레시피 → PDF-to-카드 웹앱 완성 (뒤집기 UI + ==spaced repetition== + 덱 관리)
- ✅ 도전: AI 에게 기능 추가 요청

### 다음 워크샵 예고
**W12: 나만의 AI SaaS** — 지금까지 배운 모든 기술을 합쳐서, 실제 사용자에게 공개할 수 있는 나만의 AI 서비스를 만듭니다.
인증, 결제, 배포까지 — 아이디어를 현실로 만드는 마지막 워크샵!`,
    },
  ],

  quiz: {
    title: "W11 — AI 학습 카드 생성기 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "플래시카드 학습에서 'spaced repetition (간격 반복)' 이란 무엇인가요?",
        options: [
          "카드를 빠른 속도로 반복해서 보는 것",
          "틀린 카드를 더 자주, 맞힌 카드를 덜 자주 보여주는 학습 방식",
          "매일 같은 시간에 정해진 양을 공부하는 것",
          "한 번에 모든 카드를 외우는 벼락치기 학습법",
        ],
        correctIndex: 1,
        explanation:
          "Spaced repetition 은 기억이 사라지기 직전에 다시 복습하는 과학적 학습법이에요. 틀린 카드는 곧 다시, 맞힌 카드는 간격을 늘려서 보여줍니다.",
      },
      {
        type: "multiple-choice",
        question:
          "객관식 퀴즈에서 '오답 선택지 (distractor)' 를 잘 만드는 기준은?",
        options: [
          "정답과 완전히 다른 엉뚱한 단어로 만든다",
          "정답과 같은 분야의 비슷하지만 틀린 개념으로 만든다",
          "항상 '위의 모든 것' 을 포함시킨다",
          "오답 선택지는 AI 가 만들 수 없다",
        ],
        correctIndex: 1,
        explanation:
          "좋은 distractor 는 같은 분야의 비슷한 용어여야 해요. 예: '엽록소' 의 오답으로 '미토콘드리아', '리보솜' 은 좋지만 '바나나' 는 너무 쉬워서 학습 효과가 없어요.",
      },
      {
        type: "multiple-choice",
        question:
          "PDF 파일에서 텍스트를 추출하여 플래시카드를 만드는 전체 흐름으로 올바른 것은?",
        options: [
          "PDF → 이미지 변환 → OCR → 카드 생성",
          "PDF → pdfjs-dist 로 텍스트 추출 → 청크 분할 → AI 개념 추출 → 카드 생성",
          "PDF → ZIP 압축 → AI 에 전송 → 카드 수신",
          "PDF → base64 인코딩 → Gemini Vision 으로 분석",
        ],
        correctIndex: 1,
        explanation:
          "텍스트 기반 PDF 는 pdfjs-dist 라이브러리로 텍스트를 추출하고, 긴 텍스트는 청크로 나눈 뒤, AI 에게 각 청크에서 핵심 개념을 추출하여 카드를 생성합니다.",
      },
    ],
  } satisfies Quiz,
};
