import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W05 — AI 자막 생성기.
 *
 * Part A: 플랫폼에서 자막 처리 로직 만들기 (LLM 셀)
 * Part B: MD 레시피로 실제 자막 생성기 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW05: Lesson = {
  id: "ai-eng-w05-subtitle-generator",
  language: "ai-engineering",
  track: "beginner",
  order: 105,
  title: "W05: AI 자막 생성기",
  subtitle: "음성을 텍스트로, 텍스트를 자막으로 — 번역까지 한 번에",
  estimatedMinutes: 120,
  cells: [
    {
      type: "markdown",
      source: `# 🎬 AI 자막 생성기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**음성/영상 파일을 올리면 자막을 자동 생성하고, 번역하고, SRT 파일로 다운로드** 할 수 있는 웹앱을 만듭니다.

### 완성 모습
\`\`\`
┌──────────────────────────────────────┐
│  🎬 AI 자막 생성기                    │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🎵 audio-interview.mp3      │    │
│  │     ⏱️ 03:42                 │    │
│  │     [▶ 재생]  [⏹ 정지]       │    │
│  └──────────────────────────────┘    │
│                                      │
│  📝 자막 목록                         │
│  ┌──────────────────────────────┐    │
│  │ 00:00:01 → 00:00:04          │    │
│  │ 안녕하세요, 오늘 인터뷰를      │    │
│  │ 시작하겠습니다.                │    │
│  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │    │
│  │ 00:00:05 → 00:00:08          │    │
│  │ 첫 번째 질문입니다.            │    │
│  │ AI 개발을 시작한 계기가...     │    │
│  └──────────────────────────────┘    │
│                                      │
│  🌐 번역: [한국어 ▾] → [영어 ▾]      │
│                                      │
│  [📥 SRT 다운로드] [📄 TXT 다운로드]  │
└──────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 자막 처리 로직 만들기 | 40분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 웹앱 완성 | 80분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **Part B 전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)`,
    },

    // ─── Part A: 자막 처리 로직 ───
    {
      type: "markdown",
      source: `## Part A: 자막 처리 로직 만들기 (40분)

자막 생성의 핵심은 3단계:
1. **==transcription==** — 음성을 텍스트로 변환
2. **자막 분할** — 긴 텍스트를 시간별 ==SRT== 형식으로 나누기
3. **번역** — 자막을 다른 언어로 옮기기

Part A 에서는 "이미 음성 인식이 끝난 텍스트" 를 받아서 자막으로 가공하는 로직을 만듭니다.

> 💡 실제 음성 인식은 Part B 에서 ==Web Speech API== 로 무료로 처리합니다!`,
    },

    {
      type: "markdown",
      source: `### A-1. 텍스트를 자막 형식으로 변환

긴 텍스트를 자막 세그먼트로 쪼개야 해요.
사람이 읽기 편한 길이 (한 줄 30~40자, 2~4초) 로 AI 가 나눠줍니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 텍스트를 자막 세그먼트로 분할
const transcript = \`안녕하세요, 오늘 인터뷰를 시작하겠습니다. 첫 번째 질문입니다. AI 개발을 시작한 계기가 무엇인가요? 저는 대학교 때 머신러닝 수업을 듣고 매력을 느꼈어요. 특히 자연어 처리 분야가 재미있었습니다. 그래서 졸업 후에 AI 스타트업에 입사했고, 지금은 음성 인식 기술을 연구하고 있습니다.\`;

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 자막 편집 전문가야. 주어진 텍스트를 자막 세그먼트로 나눠.

규칙:
- 한 세그먼트당 2~4초 분량 (약 15~40자)
- 문장의 자연스러운 끊김 지점에서 나누기
- 각 세그먼트에 순서 번호와 대략적 시간 부여
- JSON 배열로 출력: [{ "index": 1, "start": "00:00:01", "end": "00:00:04", "text": "..." }, ...]
- 시간은 HH:MM:SS 형식\`
    },
    {
      role: "user",
      content: \`다음 텍스트를 자막 세그먼트로 나눠줘:\\n\\n\${transcript}\`
    },
  ],
});

console.log("📝 자막 세그먼트:");
console.log(response.text);`,
      hints: [
        "AI 가 텍스트를 읽고 자연스러운 위치에서 끊어줘요.",
        "실제 앱에서는 Web Speech API 가 제공하는 타임스탬프를 활용합니다.",
        "세그먼트 길이가 너무 길면 읽기 어렵고, 너무 짧으면 자막이 깜빡여요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 자막 번역

자막 세그먼트를 그대로 유지하면서 다른 언어로 번역합니다.
타임스탬프는 건드리지 않고, 텍스트만 번역하는 게 핵심!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 자막 번역 — 타임스탬프 유지, 텍스트만 번역
const subtitles = [
  { index: 1, start: "00:00:01", end: "00:00:04", text: "안녕하세요, 오늘 인터뷰를 시작하겠습니다." },
  { index: 2, start: "00:00:05", end: "00:00:08", text: "첫 번째 질문입니다. AI 개발을 시작한 계기가 무엇인가요?" },
  { index: 3, start: "00:00:09", end: "00:00:13", text: "저는 대학교 때 머신러닝 수업을 듣고 매력을 느꼈어요." },
  { index: 4, start: "00:00:14", end: "00:00:17", text: "특히 자연어 처리 분야가 재미있었습니다." },
  { index: 5, start: "00:00:18", end: "00:00:23", text: "졸업 후에 AI 스타트업에 입사했고, 지금은 음성 인식 기술을 연구하고 있습니다." },
];

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 전문 자막 번역가야. 자막 세그먼트를 영어로 번역해.

규칙:
- index, start, end 는 절대 변경하지 마
- text 만 영어로 번역
- 자막 특성상 간결하게 번역 (구어체 유지)
- 같은 JSON 배열 형식으로 출력\`
    },
    {
      role: "user",
      content: \`다음 자막을 영어로 번역해줘:\\n\\n\${JSON.stringify(subtitles, null, 2)}\`
    },
  ],
});

console.log("🌐 번역된 자막:");
console.log(response.text);`,
      hints: [
        "핵심: 타임스탬프는 그대로, 텍스트만 번역!",
        "구어체 번역이 중요해요 — 자막은 문어체보다 자연스러운 말투가 좋아요.",
        "target language 를 바꾸면 일본어, 중국어 등 다양한 언어로 번역 가능!",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 자막 품질 개선

AI 가 나눈 자막이 항상 완벽하진 않아요.
줄 길이가 너무 길거나, 끊김이 부자연스러울 수 있습니다.
AI 에게 "품질 검토" 를 시키면 더 좋은 자막이 됩니다!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 자막 품질 개선 — 가독성 + 자연스러운 끊김
const rawSubtitles = [
  { index: 1, start: "00:00:01", end: "00:00:06", text: "안녕하세요 오늘 인터뷰를 시작하겠습니다 첫 번째 질문입니다" },
  { index: 2, start: "00:00:07", end: "00:00:15", text: "AI 개발을 시작한 계기가 무엇인가요 저는 대학교 때 머신러닝 수업을 듣고 매력을 느꼈어요 특히 자연어 처리 분야가 재미있었습니다" },
];

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 자막 QA 전문가야. 자막 품질을 개선해.

점검 항목:
1. 한 세그먼트가 40자 넘으면 → 2개로 분리 (시간도 적절히 분배)
2. 구두점 누락 → 추가 (마침표, 쉼표, 물음표)
3. 줄 끊김이 부자연스러우면 → 자연스러운 위치로 조정
4. 개선된 JSON 배열 출력
5. 변경 사항 요약도 함께 알려줘\`
    },
    {
      role: "user",
      content: \`다음 자막의 품질을 개선해줘:\\n\\n\${JSON.stringify(rawSubtitles, null, 2)}\`
    },
  ],
});

console.log("✨ 개선된 자막:");
console.log(response.text);`,
      hints: [
        "index 2 가 너무 길어요 — AI 가 자동으로 쪼개줍니다.",
        "구두점이 없으면 자막을 읽기 어려워요. AI 가 적절히 넣어줍니다.",
        "실제 서비스에서는 사람이 최종 검수하지만, AI 가 1차 정리해주면 훨씬 빨라요!",
      ],
    },

    {
      type: "markdown",
      source: `### A-4. SRT 형식 생성

==SRT== 는 가장 널리 쓰이는 자막 파일 형식이에요.
유튜브, VLC, 넷플릭스 등 대부분의 플레이어가 지원합니다.

\`\`\`
1
00:00:01,000 --> 00:00:04,000
안녕하세요, 오늘 인터뷰를
시작하겠습니다.

2
00:00:05,000 --> 00:00:08,000
첫 번째 질문입니다.
\`\`\`

이 형식을 코드로 만들어봅시다!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 자막 데이터 → SRT 형식 문자열 변환
const subtitles = [
  { index: 1, start: "00:00:01", end: "00:00:04", text: "안녕하세요, 오늘 인터뷰를 시작하겠습니다." },
  { index: 2, start: "00:00:05", end: "00:00:08", text: "첫 번째 질문입니다. AI 개발을 시작한 계기가 무엇인가요?" },
  { index: 3, start: "00:00:09", end: "00:00:13", text: "저는 대학교 때 머신러닝 수업을 듣고 매력을 느꼈어요." },
  { index: 4, start: "00:00:14", end: "00:00:17", text: "특히 자연어 처리 분야가 재미있었습니다." },
  { index: 5, start: "00:00:18", end: "00:00:23", text: "졸업 후 AI 스타트업에 입사해서 음성 인식 기술을 연구하고 있습니다." },
];

// SRT 형식 변환 함수
function toSRT(subs: typeof subtitles): string {
  return subs.map(s => {
    // SRT 는 밀리초까지 표기: HH:MM:SS,mmm
    const startSrt = s.start + ",000";
    const endSrt = s.end + ",000";
    return \`\${s.index}\\n\${startSrt} --> \${endSrt}\\n\${s.text}\`;
  }).join("\\n\\n");
}

const srtContent = toSRT(subtitles);

console.log("📄 SRT 파일 내용:");
console.log("─".repeat(40));
console.log(srtContent);
console.log("─".repeat(40));
console.log("\\n✅ 이 내용을 .srt 파일로 저장하면 자막 파일 완성!");
console.log("총", subtitles.length, "개 세그먼트");`,
      hints: [
        "SRT 형식: 번호 → 시간(,밀리초) → 텍스트 → 빈 줄 반복.",
        "시간 구분자가 콜론(:) 이 아니라 쉼표(,) 인 게 포인트! (00:00:01,000)",
        "이 toSRT 함수를 Part B 에서 그대로 다운로드 기능에 사용합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

자막 생성의 핵심 로직을 모두 검증했어요:
- ✅ 텍스트 → 자막 세그먼트 분할 (AI)
- ✅ 자막 번역 (타임스탬프 유지)
- ✅ 자막 품질 개선 (AI QA)
- ✅ SRT 형식 변환 (코드)

이제 이걸 **실제 웹앱** 으로 만듭니다.

---

## Part B: MD 레시피로 웹앱 완성 (80분)

Part A 에서 만든 로직을 **진짜 동작하는 자막 생성기** 로 조립합니다.

### 🔑 핵심 기술

| 기술 | 역할 | 비용 |
|---|---|---|
| **==Web Speech API==** | 음성 → 텍스트 변환 | 🆓 무료 (브라우저 내장) |
| **Gemini API** | 자막 분할 + 번역 + 품질 개선 | 🆓 무료 티어 |

> 💡 **Whisper 같은 유료 API 대신** 브라우저에 내장된 Web Speech API 를 사용해요!
> Chrome, Edge 에서 가장 잘 동작하고, 한국어도 지원합니다.

아래 MD 레시피를 복사해서 Claude Code 나 Cursor 에 붙여넣으세요.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피

\`\`\`markdown
# AI 자막 생성기 (Subtitle Generator)

## 프로젝트 개요
음성/영상 파일을 업로드하면 브라우저 Speech Recognition 으로 텍스트를 추출하고,
AI 로 자막 세그먼트를 생성/번역/개선한 뒤 SRT 파일로 다운로드하는 웹앱.

## 기술 스택
- React 19 + TypeScript + Vite
- Tailwind CSS 4
- @google/genai (Gemini API)
- Web Speech API (SpeechRecognition) — 브라우저 내장, 무료

## 핵심 기능

### 1. 파일 업로드
- 드래그 앤 드롭 영역
- accept: audio/*, video/* (mp3, wav, mp4, webm 등)
- 업로드 시 파일명, 크기, 재생 시간 표시
- HTML5 Audio 엘리먼트로 재생 가능

### 2. 음성 인식 (Web Speech API)
- SpeechRecognition (window.SpeechRecognition || window.webkitSpeechRecognition)
- lang: 'ko-KR' (한국어 기본, 언어 선택 가능)
- continuous: true, interimResults: true
- 오디오 재생하면서 마이크로 수음 → 실시간 텍스트 변환
- 주의: Web Speech API 는 마이크 입력 기반이므로,
  오디오를 스피커로 재생하고 마이크가 수음하는 방식
  (또는 가상 오디오 디바이스 안내)
- 브라우저 호환성 안내: Chrome/Edge 권장, Safari/Firefox 제한적

### 3. 실시간 트랜스크립션
- 인식 진행 중: interim 결과 회색으로 표시
- 인식 완료: final 결과 검은색으로 누적
- 진행률 표시 (오디오 재생 위치 기준)
- 전체 텍스트 편집 가능 (textarea)

### 4. AI 자막 세그먼트 생성
- 전체 텍스트를 Gemini API 로 전송
- 프롬프트: "이 텍스트를 자막 세그먼트로 나눠줘.
  한 세그먼트 15~40자, 2~4초 분량,
  자연스러운 끊김 지점, JSON 배열로 출력"
- 결과: [{ index, start, end, text }] 배열

### 5. 자막 에디터
- 각 세그먼트를 카드 형태로 표시
- 인라인 편집: 텍스트 클릭하면 수정 가능
- 시간 조정: start, end 시간을 직접 수정 가능
- 세그먼트 합치기 / 분리 버튼
- 드래그로 순서 변경

### 6. 번역 패널
- 소스 언어 / 타겟 언어 선택 드롭다운
- 지원 언어: 한국어, 영어, 일본어, 중국어, 스페인어
- "번역" 버튼 클릭 → Gemini API 로 각 세그먼트 번역
- 원본/번역 나란히 표시 (2컬럼)
- 번역도 인라인 수정 가능

### 7. 미리보기 플레이어
- 업로드한 오디오/영상 재생
- 현재 재생 시간에 맞는 자막 하이라이트
- 자막이 화면 하단에 오버레이 표시 (실제 영상 자막처럼)

### 8. 내보내기
- SRT 파일 다운로드 (원본 언어)
- SRT 파일 다운로드 (번역 언어)
- TXT 트랜스크립트 다운로드 (타임스탬프 없이 텍스트만)
- 파일명 자동 생성: 원본파일명_subtitles_ko.srt

### 9. 설정
- Gemini API 키 입력 + localStorage 저장
- 다크/라이트 모드 토글
- 음성 인식 언어 기본값 설정
- 자막 스타일 설정 (글자 크기, 배경색)

## UI 레이아웃
- 상단: 헤더 (제목 + 다크모드 + 설정)
- 좌측: 파일 업로드 + 오디오 플레이어 + 자막 미리보기
- 우측: 자막 에디터 (원본 + 번역 탭)
- 하단: 내보내기 버튼 그룹

## 스타일
- 깔끔한 미니멀 디자인
- 자막 카드: 둥근 모서리, 호버 시 편집 모드
- 재생 중인 자막: 파란색 하이라이트
- 반응형: 모바일에서는 위아래 스택

## SRT 포맷 참고
\\\`\\\`\\\`
1
00:00:01,000 --> 00:00:04,000
안녕하세요, 오늘 인터뷰를
시작하겠습니다.

2
00:00:05,000 --> 00:00:08,000
첫 번째 질문입니다.
\\\`\\\`\\\`
\`\`\`

---

### 🚀 사용 방법

1. 위 MD 레시피를 복사
2. Claude Code 또는 Cursor 에서 새 프로젝트 생성
3. MD 레시피를 붙여넣기: "이 요구사항대로 만들어줘"
4. \`npm run dev\` 로 실행
5. 브라우저에서 열고 API 키 입력
6. 오디오 파일 업로드 → 음성 인식 시작!

### ⚠️ Web Speech API 주의사항

- **Chrome / Edge 에서만 안정적** — Safari, Firefox 는 제한적
- **마이크 권한 필요** — 브라우저가 마이크 접근을 요청해요
- **오디오 파일을 스피커로 재생 → 마이크로 수음** 하는 방식이라 조용한 환경 권장
- 더 정확한 인식이 필요하면 Whisper API 로 업그레이드 가능 (유료)`,
    },

    {
      type: "markdown",
      source: `### 💬 바이브 코딩 추가 요청 예시

기본 앱이 완성되면, AI 에게 이런 요청을 해보세요:

> "음성 인식 결과가 부정확할 때 수동으로 텍스트를 입력할 수 있는 모드도 추가해줘"

> "자막 세그먼트를 클릭하면 해당 시간으로 오디오가 점프하는 기능 넣어줘"

> "번역 시 전문 용어 사전을 미리 등록할 수 있게 해줘"

> "자막 스타일을 미리보기에서 실시간으로 바꿀 수 있게 해줘 — 글꼴, 크기, 색상, 위치"

에러가 나면 에러 메시지를 그대로 AI 에게 붙여넣고 "이 에러가 나와요"
라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**`,
    },

    {
      type: "markdown",
      source: `## 🏆 도전 과제

자막 생성기가 동작하면, 이런 기능을 추가해보세요:

| 난이도 | 도전 | 힌트 |
|---|---|---|
| ⭐ | 자막에 화자 구분 추가 (화자1, 화자2) | AI 에게 "화자가 바뀌는 지점 구분해줘" 요청 |
| ⭐⭐ | 유튜브 URL 입력 → 자막 생성 | youtube-dl 로 오디오 추출 (서버 필요) |
| ⭐⭐ | 실시간 회의록 모드 — 마이크로 바로 녹음 + 자막 | MediaRecorder + Web Speech API 동시 사용 |
| ⭐⭐⭐ | 자막을 타임라인 UI 로 편집 (영상 편집기처럼) | 드래그로 세그먼트 길이 조절 |`,
    },

    {
      type: "markdown",
      source: `## ✅ W05 완료!

- ✅ Part A: 자막 분할 + 번역 + 품질 개선 + SRT 변환
- ✅ Part B: MD 레시피 → 실제 자막 생성기 웹앱 완성
- ✅ 커스텀: AI 에게 기능 추가 요청

### 핵심 정리

| 개념 | 설명 |
|---|---|
| **==Web Speech API==** | 브라우저 내장 음성 인식 — 무료! |
| **==SRT==** | 자막 파일 형식 (번호 + 시간 + 텍스트) |
| **==transcription==** | 음성을 텍스트로 변환하는 과정 |
| **자막 세그먼트** | 하나의 자막 단위 (시작~종료 시간 + 텍스트) |

### 다음 워크샵 예고
**W06: AI 이미지 분석기** — 이미지를 업로드하면 AI 가 내용을 설명하고 분석하는 앱.
멀티모달 AI 의 핵심을 실제 앱으로 만들어봅니다.`,
    },
  ],

  quiz: {
    title: "W05 — 자막 생성기 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "브라우저에서 무료로 음성 인식을 하려면 어떤 API 를 사용하나요?",
        options: [
          "Whisper API (OpenAI)",
          "Web Speech API (브라우저 내장)",
          "Google Cloud Speech-to-Text",
          "Amazon Transcribe",
        ],
        correctIndex: 1,
        explanation:
          "Web Speech API 는 Chrome, Edge 등 브라우저에 내장된 무료 음성 인식 기능이에요. 별도 API 키나 비용 없이 사용할 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question:
          "SRT 자막 파일에서 시간 표기 형식으로 올바른 것은?",
        options: [
          "00:00:01.000 -> 00:00:04.000",
          "00:00:01,000 --> 00:00:04,000",
          "0:0:1 - 0:0:4",
          "[00:01] ~ [00:04]",
        ],
        correctIndex: 1,
        explanation:
          "SRT 형식은 HH:MM:SS,mmm --> HH:MM:SS,mmm 으로 표기해요. 밀리초 구분자가 점(.) 이 아니라 쉼표(,) 인 게 특징!",
      },
      {
        type: "multiple-choice",
        question:
          "자막 번역 시 가장 중요한 규칙은?",
        options: [
          "번역 품질을 위해 자막 순서를 재배치한다",
          "타임스탬프는 유지하고 텍스트만 번역한다",
          "모든 세그먼트를 하나로 합친 뒤 번역한다",
          "기계 번역은 정확하므로 검수가 필요 없다",
        ],
        correctIndex: 1,
        explanation:
          "자막 번역의 핵심은 타임스탬프(시간 정보)를 그대로 두고 텍스트만 바꾸는 거예요. 시간이 바뀌면 영상과 자막이 안 맞게 됩니다!",
      },
    ],
  } satisfies Quiz,
};
