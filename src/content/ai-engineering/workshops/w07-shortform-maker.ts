import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W07 — AI 숏폼 콘텐츠 메이커.
 *
 * Part A: 플랫폼에서 장면별 스크립트·이미지 키워드·내레이션 다듬기 체험 (LLM 셀)
 * Part B: MD 레시피로 숏폼 콘텐츠 메이커 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW07: Lesson = {
  id: "ai-eng-w07-shortform-maker",
  language: "ai-engineering",
  track: "beginner",
  order: 107,
  title: "W07: AI 숏폼 콘텐츠 메이커",
  subtitle: "주제 하나로 릴스·숏츠 영상 스크립트부터 이미지까지",
  estimatedMinutes: 120,
  cells: [
    {
      type: "markdown",
      source: `# 🎬 AI 숏폼 콘텐츠 메이커

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**주제 하나만 입력하면 ==숏폼== 영상에 필요한 모든 걸 AI 가 만들어주는 웹앱** — 장면별 스크립트, 이미지 검색, ==TTS== 미리듣기, 타임라인 편집까지.

### 완성 모습
\`\`\`
┌──────────────────────────────────────┐
│  🎬 AI 숏폼 콘텐츠 메이커            │
├──────────────────────────────────────┤
│  주제: [오늘 하루 5분 스트레칭   ]    │
│  장르: [교육 ▾]  길이: [60초 ▾]      │
│  [🚀 스크립트 생성]                   │
├──────────────────────────────────────┤
│  Scene 1 (0-8초)   Scene 2 (8-16초)  │
│  ┌──────────────┐  ┌──────────────┐  │
│  │ 🖼️ [이미지]   │  │ 🖼️ [이미지]   │  │
│  │ 나레이션:     │  │ 나레이션:     │  │
│  │ "안녕하세요!  │  │ "첫 번째 동작 │  │
│  │  오늘은..."   │  │  은 목 돌리기 │  │
│  │ 🔊 [재생]     │  │  입니다"      │  │
│  │ 📷 이미지 4장  │  │ 🔊 [재생]     │  │
│  └──────────────┘  └──────────────┘  │
├──────────────────────────────────────┤
│ ◀ ━━━█━━━━━━━━━━━━━━━━━━━━━━━━ ▶    │
│  S1  S2  S3  S4  S5  S6  S7  S8     │
│        ▲ 타임라인 뷰                  │
├──────────────────────────────────────┤
│  [▶ 전체 재생] [📥 스크립트 내보내기] │
└──────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 장면 스크립트·이미지 키워드·내레이션 다듬기 | 40분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 실제 웹앱 완성 | 80분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **Part B 전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)`,
    },

    // ─── Part A: 숏폼 스크립트 생성 체험 ───
    {
      type: "markdown",
      source: `## Part A: AI 숏폼 스크립트 생성 체험 (40분)

==숏폼== 영상(릴스, 숏츠, 틱톡)은 보통 30~90초 짧은 영상이에요.
짧지만 **기승전결이 있는 스크립트** 가 핵심!

AI 에게 주제를 주면 장면별로 나레이션, 화면 설명, 시간 배분까지 자동으로 만들어줍니다.

> 💡 이 파트에서 배우는 기술 3가지:
> 1. 장면별 스크립트 구조화 생성
> 2. 이미지 검색 키워드 추출
> 3. ==TTS== 최적화 내레이션 다듬기`,
    },

    {
      type: "markdown",
      source: `### A-1. 장면별 스크립트 생성

주제 하나를 주면 AI 가 5~8개 장면으로 나눠서 각각 나레이션, 화면 설명, 예상 시간을 만들어요.
이게 ==숏폼== 영상 제작의 첫 단계입니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-1: 주제 → 장면별 숏폼 스크립트 생성
const topic = "하루 5분 아침 스트레칭으로 건강해지기";
const genre = "교육";
const duration = 60; // 초

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 숏폼 영상 전문 작가야. 사용자가 주제를 주면 \${duration}초짜리 숏폼 영상 스크립트를 장면별로 만들어.

반드시 아래 JSON 형식으로만 답해. 다른 텍스트 없이 JSON 만 출력해.

{
  "title": "영상 제목",
  "totalDuration": \${duration},
  "scenes": [
    {
      "sceneNumber": 1,
      "narration": "나레이션 텍스트 (말할 내용)",
      "visualDescription": "화면에 보일 장면 설명",
      "duration": 8
    }
  ]
}

규칙:
- 장르: \${genre}
- 장면은 5~8개
- 각 장면의 duration 합 = \${duration}초
- 나레이션은 해당 시간에 자연스럽게 읽을 수 있는 분량
- 첫 장면은 시선을 끄는 훅(hook)으로 시작
- 마지막 장면은 행동 유도(CTA)로 끝내기\`,
    },
    { role: "user", content: \`주제: \${topic}\` },
  ],
});

console.log("🎬 장면별 스크립트:");
console.log(response.text);

try {
  const script = JSON.parse(response.text);
  console.log(\`\\n📊 총 \${script.scenes.length}개 장면, \${script.totalDuration}초\`);
  for (const s of script.scenes) {
    console.log(\`\\n── Scene \${s.sceneNumber} (\${s.duration}초) ──\`);
    console.log(\`🎙️ 나레이션: \${s.narration}\`);
    console.log(\`🖼️ 화면: \${s.visualDescription}\`);
  }
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "topic 을 바꿔보세요 — '1분 요리 레시피', 'AI 뉴스 요약', '여행 브이로그 팁' 등!",
        "genre 를 '유머' 나 '동기부여' 로 바꾸면 톤이 완전 달라져요.",
        "duration 을 30 이나 90 으로 바꾸면 장면 수와 분량이 자동 조절됩니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 이미지 검색 키워드 추출

각 장면에 어울리는 이미지를 찾으려면 **영어 검색 키워드** 가 필요해요.
==Unsplash API== 는 영어 키워드로 검색해야 결과가 좋거든요.
AI 에게 화면 설명을 주면 검색에 딱 맞는 영어 키워드를 뽑아줍니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-2: 장면 설명 → Unsplash 검색용 영어 키워드 추출
const scenes = [
  "활기찬 아침, 창문으로 햇살이 들어오는 밝은 방",
  "매트 위에서 목을 천천히 돌리는 여성",
  "양팔을 하늘로 뻗으며 기지개를 켜는 모습",
  "의자에 앉아 허리를 비트는 스트레칭 동작",
  "운동 후 물을 마시며 미소 짓는 사람",
  "달력에 체크 표시를 하며 루틴 기록하는 손",
];

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 이미지 검색 키워드 전문가야.
한국어 장면 설명을 받으면 Unsplash 이미지 검색에 최적화된 영어 키워드를 추출해.

반드시 아래 JSON 형식으로만 답해. 다른 텍스트 없이 JSON 만 출력해.

{
  "scenes": [
    {
      "sceneIndex": 0,
      "koreanDescription": "원본 한국어 설명",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "searchQuery": "best single search query for unsplash"
    }
  ]
}

규칙:
- keywords 는 3~5개
- searchQuery 는 가장 좋은 결과가 나올 단일 검색어
- 추상적 단어보다 구체적 사물/장면 위주
- 사람이 포함된 장면은 'person' 이나 'people' 키워드 포함\`,
    },
    {
      role: "user",
      content: \`아래 장면들에 대한 검색 키워드를 추출해줘:\\n\${scenes.map((s, i) => \`\${i + 1}. \${s}\`).join("\\n")}\`,
    },
  ],
});

console.log("🔍 이미지 검색 키워드:");
console.log(response.text);

try {
  const result = JSON.parse(response.text);
  for (const s of result.scenes) {
    console.log(\`\\n── 장면 \${s.sceneIndex + 1} ──\`);
    console.log(\`🇰🇷 \${s.koreanDescription}\`);
    console.log(\`🏷️ 키워드: \${s.keywords.join(", ")}\`);
    console.log(\`🔎 검색어: \${s.searchQuery}\`);
  }
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "Unsplash 는 무료 이미지 사이트로, API 키만 있으면 프로그램에서 검색할 수 있어요.",
        "영어 키워드가 중요한 이유: Unsplash 이미지 대부분이 영어 태그로 분류되어 있거든요.",
        "scenes 배열을 다른 주제의 장면 설명으로 바꿔보세요!",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 내레이션 다듬기 — TTS 최적화

==TTS==(Text-to-Speech)로 읽을 나레이션은 사람이 읽는 것과 달라요.
괄호, 특수문자, 줄임말을 정리하고 **쉼표로 호흡** 을 넣어야 자연스럽게 들립니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-3: 나레이션 텍스트 → TTS 최적화 버전으로 다듬기
const rawNarrations = [
  "안녕하세요! (웃으며) 오늘은 아침 5분 스트레칭을 알려드릴게요~",
  "첫 번째 동작은... 목 돌리기입니다. 좌→우로 천천히!",
  "다음은 기지개! 양팔을 쭉~ 올려보세요 (3초 유지)",
  "마지막으로 허리 비틀기!! 의자에서도 OK👍",
  "매일 5분이면 충분합니다 ㅎㅎ 내일도 같이 해요! (구독&좋아요)",
];

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 TTS(Text-to-Speech) 전문 편집자야.
나레이션 텍스트를 TTS 엔진이 자연스럽게 읽을 수 있도록 다듬어.

반드시 아래 JSON 형식으로만 답해. 다른 텍스트 없이 JSON 만 출력해.

{
  "narrations": [
    {
      "original": "원본 텍스트",
      "polished": "다듬어진 텍스트",
      "changes": ["변경 사항 설명"]
    }
  ]
}

다듬기 규칙:
- 괄호 안 연출 지시 제거: (웃으며), (3초 유지) 등
- 특수문자 제거: →, ~, !, 이모지 등
- 줄임말 풀기: OK → 오케이
- 자연스러운 쉼 추가: 문장 사이에 쉼표
- ㅎㅎ, ㅋㅋ 같은 인터넷 표현 제거
- '구독&좋아요' 같은 표현을 자연스러운 문장으로
- 물결표(~) 대신 자연스러운 늘임 처리
- 느낌표 연속(!!) → 하나로 또는 마침표로\`,
    },
    {
      role: "user",
      content: \`아래 나레이션들을 TTS 용으로 다듬어줘:\\n\${rawNarrations.map((n, i) => \`\${i + 1}. \${n}\`).join("\\n")}\`,
    },
  ],
});

console.log("🎙️ TTS 최적화 결과:");
console.log(response.text);

try {
  const result = JSON.parse(response.text);
  for (const n of result.narrations) {
    console.log("\\n── 변환 ──");
    console.log(\`❌ 원본: \${n.original}\`);
    console.log(\`✅ 다듬: \${n.polished}\`);
    console.log(\`📝 변경: \${n.changes.join(", ")}\`);
  }
} catch {
  console.log("⚠️ JSON 파싱 실패 — 다시 실행해보세요!");
}`,
      hints: [
        "Web Speech API 의 TTS 는 특수문자를 이상하게 읽거나 건너뛰어요. 그래서 전처리가 필수!",
        "쉼표(,)를 넣으면 TTS 가 잠깐 쉬어요. 호흡 조절에 아주 중요합니다.",
        "rawNarrations 를 여러분의 대본으로 바꿔서 테스트해보세요!",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

숏폼 콘텐츠 제작의 AI 핵심 기술 3가지를 체험했어요:
- ✅ 주제 → 장면별 스크립트 자동 생성 (나레이션 + 화면 설명 + 시간 배분)
- ✅ 화면 설명 → ==Unsplash API== 검색용 영어 키워드 추출
- ✅ 나레이션 → ==TTS== 최적화 텍스트 다듬기

이제 Part B 에서 **실제 웹앱** 으로 만들어봅시다! 타임라인 에디터, 이미지 검색, TTS 미리듣기까지 모두 포함됩니다.

---

## Part B: MD 레시피로 웹앱 완성 (80분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [완성된 숏폼 콘텐츠 메이커]
\`\`\`

아래의 **MD 레시피** 를 복사해서 AI 코딩 도구에 전달하면 됩니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 숏폼 콘텐츠 메이커 웹앱 제작 요청서

## 프로젝트 개요
주제를 입력하면 AI 가 숏폼 영상(릴스/숏츠/틱톡)용 콘텐츠를 자동 생성해주는 웹앱.
장면별 스크립트, 이미지 검색, TTS 미리듣기, 타임라인 편집 기능 포함.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크 모드)
- @google/genai (Gemini SDK — 스크립트 생성)
- Web Speech API (브라우저 내장 TTS)
- Unsplash API (무료 이미지 검색)

## 기능 요구사항

### 1. 주제 입력 영역
- 텍스트 입력란: "어떤 주제로 숏폼을 만들까요?"
- 장르 선택 드롭다운: 교육 / 동기부여 / 요리 / 여행 / IT팁 / 유머
- 영상 길이 선택: 30초 / 60초 / 90초 (라디오 버튼 또는 세그먼트)
- [🚀 스크립트 생성] 버튼
- 로딩 중 스피너 + "AI 가 스크립트를 작성하고 있어요..." 텍스트

### 2. AI 스크립트 생성 (Gemini API)
- 주제 + 장르 + 길이를 조합해 프롬프트 구성
- 응답을 JSON 으로 파싱:
  \\\`\\\`\\\`json
  {
    "title": "영상 제목",
    "scenes": [
      {
        "sceneNumber": 1,
        "narration": "나레이션 텍스트",
        "visualDescription": "화면에 보일 장면 설명",
        "duration": 8
      }
    ]
  }
  \\\`\\\`\\\`
- 5~8개 장면, 각 장면의 duration 합 = 선택한 영상 길이
- 첫 장면은 후킹(hook), 마지막은 CTA

### 3. 장면 카드 레이아웃
- 그리드 또는 가로 스크롤 카드 배치
- 각 카드에 표시:
  - 장면 번호 + 예상 시간 (예: "Scene 1 · 8초")
  - 나레이션 텍스트 (textarea 로 직접 편집 가능)
  - 화면 설명 (회색 텍스트, 읽기 전용)
  - 선택된 이미지 썸네일 (없으면 빈 플레이스홀더)
  - [🔊 재생] 버튼 (해당 장면 나레이션 TTS)
  - [📷 이미지 검색] 버튼

### 4. Unsplash 이미지 검색
- 각 장면의 화면 설명에서 자동으로 영어 키워드 추출 (Gemini 활용)
- Unsplash API 로 해당 키워드 검색
  \\\`\\\`\\\`
  GET https://api.unsplash.com/search/photos?query={keyword}&per_page=4
  Authorization: Client-ID {UNSPLASH_ACCESS_KEY}
  \\\`\\\`\\\`
- 검색 결과 4장을 그리드로 표시
- 이미지 클릭 시 해당 장면에 선택 (테두리 하이라이트)
- 수동으로 키워드를 바꿔서 재검색 가능

### 5. Web Speech TTS 미리듣기
- 브라우저 내장 Web Speech API 사용 (추가 설치 없음):
  \\\`\\\`\\\`typescript
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 1.0;
  speechSynthesis.speak(utterance);
  \\\`\\\`\\\`
- 각 장면 [🔊 재생] 버튼: 해당 나레이션만 읽기
- [▶ 전체 재생] 버튼: 모든 장면 순서대로 읽기 (장면 간 0.5초 간격)
- 재생 중인 장면 카드 하이라이트
- [⏹ 중지] 버튼으로 언제든 멈추기
- TTS 속도 조절 슬라이더 (0.8x ~ 1.5x)

### 6. 타임라인 뷰
- 하단에 가로 스크롤 타임라인 바
- 각 장면이 duration 비율에 맞는 너비의 블록으로 표시
- 블록에 장면 번호 + 시간 표시
- 현재 TTS 재생 위치 인디케이터 (빨간 세로줄)
- 장면 블록 클릭 시 해당 카드로 스크롤
- 전체 시간 표시 (예: "0:00 / 1:00")

### 7. 내보내기 기능
- [📥 스크립트 내보내기] 버튼:
  - 전체 스크립트를 마크다운 형식으로 다운로드
  - 제목, 장면별 나레이션, 화면 설명, 시간 포함
- [📷 이미지 일괄 다운로드] 버튼:
  - 선택된 장면 이미지들을 개별 다운로드 (scene-1.jpg, scene-2.jpg, ...)

### 8. API 키 관리
- 첫 실행 시 설정 모달:
  - Gemini API 키 입력란 + 발급 안내 링크
  - Unsplash Access Key 입력란 + 발급 안내 링크
    (https://unsplash.com/developers 에서 무료 앱 등록)
  - [저장] 버튼
- localStorage 에 두 키 모두 저장
- 상단 ⚙️ 버튼으로 키 변경/삭제

### 9. 디자인
- 다크 모드 기본 (배경: #0f172a, 카드: #1e293b)
- 라이트 모드 토글 (상단 🌙/☀️)
- 반응형: 모바일은 카드 세로 배치, 데스크탑은 그리드
- 카드 hover 시 살짝 떠오르는 그림자 애니메이션
- TTS 재생 중 카드에 pulse 효과
- 타임라인 바 부드러운 스크롤

### 10. 나레이션 TTS 전처리
- 스크립트 생성 후 자동으로 나레이션 다듬기:
  - 괄호 안 연출 지시 제거
  - 특수문자, 이모지 제거
  - 자연스러운 쉼표 추가
- "원본 / TTS 버전" 토글로 둘 다 확인 가능

## 환경 변수
GEMINI_API_KEY, UNSPLASH_ACCESS_KEY 모두 런타임에 사용자 입력 (하드코딩 금지)

## 실행 방법
npm install → npm run dev → localhost:5173 에서 확인

## 주의사항
- API 키를 소스 코드에 절대 하드코딩하지 마세요
- 모든 UI 텍스트는 한국어
- Unsplash API 무료 플랜: 시간당 50회 제한 — 안내 문구 필요
- Web Speech API 는 브라우저마다 지원 음성이 다름 — 한국어 음성 자동 선택
- TypeScript strict 모드
\`\`\`

---

### 사용 방법

**🅰️ Claude Code 사용자:**
\`\`\`bash
mkdir shortform-maker && cd shortform-maker
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
- "자막 SRT 파일 내보내기" 기능 추가 요청 가능
- "AI 가 BGM 분위기도 추천" 기능 추가 가능
- "영상 비율 선택 (9:16 세로, 1:1 정사각)" 추가 가능
- "장면 순서 드래그&드롭으로 변경" 추가 가능

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 숏폼 메이커가 완성되면 MD 레시피에 아래를 추가해서 AI 에게 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 스크립트를 SRT 자막 파일로 내보내기 |
| ⭐ | 장면별 BGM 분위기 추천 태그 |
| ⭐⭐ | 장면 순서 드래그&드롭 재배치 |
| ⭐⭐ | 영상 비율 프리셋 (9:16 세로, 1:1 정사각, 16:9 가로) |
| ⭐⭐⭐ | 장면별 텍스트 오버레이 편집기 (폰트, 색상, 위치) |
| ⭐⭐⭐ | 장면 이미지 + 나레이션 → 실제 MP4 슬라이드쇼 생성 (FFmpeg WASM) |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**

## ✅ W07 완료!

- ✅ Part A: AI 숏폼 스크립트 생성 체험 (장면별 구조화/이미지 키워드/TTS 최적화)
- ✅ Part B: MD 레시피 → 숏폼 콘텐츠 메이커 웹앱 완성
- ✅ 도전: AI 에게 기능 추가 요청

### 다음 워크샵 예고
**W08: AI 블로그 작성기** — 주제와 키워드를 입력하면 AI 가 SEO 최적화된 블로그 글을 구조부터 본문까지 자동 작성.
콘텐츠 마케팅의 시작을 AI 와 함께!`,
    },
  ],

  quiz: {
    title: "W07 — 숏폼 콘텐츠 메이커 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "숏폼 영상 스크립트를 AI 에게 생성시킬 때, JSON 응답에 포함시킨 장면별 정보가 아닌 것은?",
        options: [
          "나레이션 텍스트 (narration)",
          "화면에 보일 장면 설명 (visualDescription)",
          "장면별 예상 시간 (duration)",
          "배경 음악 파일 경로 (bgmPath)",
        ],
        correctIndex: 3,
        explanation:
          "AI 스크립트 생성에서는 나레이션, 화면 설명, 시간 배분을 구조화하지만, BGM 파일 경로는 별도 처리가 필요한 영역이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "Web Speech API 의 TTS 를 사용할 때, 나레이션 텍스트를 미리 다듬어야 하는 이유는?",
        options: [
          "다듬지 않으면 API 호출이 거부되기 때문에",
          "TTS 엔진이 괄호, 특수문자, 이모지를 이상하게 읽거나 건너뛰기 때문에",
          "한국어는 TTS 로 읽을 수 없어서 영어로 변환해야 하기 때문에",
          "다듬어야 비용이 절약되기 때문에",
        ],
        correctIndex: 1,
        explanation:
          "TTS 엔진은 (웃으며), →, ~ 같은 특수문자를 의도와 다르게 읽어요. 쉼표로 호흡을 넣고 불필요한 기호를 제거하면 훨씬 자연스럽게 들립니다.",
      },
      {
        type: "multiple-choice",
        question:
          "Unsplash API 로 장면에 맞는 이미지를 검색할 때, 화면 설명을 영어 키워드로 변환하는 이유는?",
        options: [
          "Unsplash 가 한국어를 전혀 지원하지 않아서",
          "영어 키워드가 더 정확하고 다양한 검색 결과를 보여주기 때문에",
          "한국어로 검색하면 유료이기 때문에",
          "API 가 자동으로 번역해주지 않아서",
        ],
        correctIndex: 1,
        explanation:
          "Unsplash 의 이미지 대부분이 영어 태그로 분류되어 있어서, 영어 키워드로 검색하면 훨씬 정확하고 풍부한 결과를 얻을 수 있어요.",
      },
    ],
  } satisfies Quiz,
};
