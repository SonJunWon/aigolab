import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W23 — AI 면접 코치.
 *
 * Part A: 플랫폼에서 직무별 질문 생성 + 답변 평가 + 개선 제안 체험 (LLM 셀)
 * Part B: MD 레시피로 AI 면접 코치 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW23: Lesson = {
  id: "ai-eng-w23-interview-coach",
  language: "ai-engineering",
  track: "beginner",
  order: 123,
  title: "W23: AI 면접 코치",
  subtitle: "AI 면접관이 질문하고 내 답변을 실시간 평가",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 🎤 AI 면접 코치 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**직무별 면접 질문을 자동 생성하고, ==Web Speech API== 로 음성 답변을 받아 AI 가 실시간 피드백하는 면접 코치 앱** — 실제 면접처럼 연습하고 약점을 분석해 체계적으로 준비할 수 있습니다.

### 완성 모습
\`\`\`
┌─ AI 면접 코치 ───────────────────────────────────────────────┐
│  🎤 Interview Coach            📊 대시보드    🌙 다크모드    │
├──────────────────────────────────────────────────────────────┤
│  직무 선택: [프론트엔드 ✓] [백엔드] [데이터] [PM] [디자인]   │
│  경력: [신입 ✓] [3년차] [5년+]     난이도: [중급 ✓]         │
│                                                              │
│  ┌─ 면접 진행 중 (3/10) ⏱️ 02:15 ──────────────────────────┐│
│  │                                                          ││
│  │  🤖 면접관:                                              ││
│  │  "React의 Virtual DOM이 실제 DOM과 다른 점과,            ││
│  │   이것이 성능에 미치는 영향을 설명해 주세요."             ││
│  │                                                          ││
│  │  🎙️ [음성 답변 중...] ████████░░ 또는 ⌨️ [텍스트 입력]  ││
│  │                                                          ││
│  │  ┌─ AI 피드백 ─────────────────────────────────────────┐ ││
│  │  │ 📝 내용: ⭐⭐⭐⭐☆ (4/5)  핵심 개념 정확히 설명    │ ││
│  │  │ 🗣️ 전달: ⭐⭐⭐☆☆ (3/5)  구조화 필요              │ ││
│  │  │ ⏱️ 시간: ⭐⭐⭐⭐⭐ (5/5) 적절한 답변 시간         │ ││
│  │  │ 💡 개선: "STAR 기법으로 구조화하면 더 좋겠습니다"   │ ││
│  │  └─────────────────────────────────────────────────────┘ ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─ 약점 분석 대시보드 ─────────────────────────────────────┐│
│  │ 📊 카테고리별 점수         🔻 약점 TOP 3                ││
│  │ ▓▓▓▓▓▓▓░ CS기초 75%       1. 시스템 설계 (평균 2.1)    ││
│  │ ▓▓▓▓▓▓░░ React  65%       2. 자료구조 (평균 2.5)       ││
│  │ ▓▓▓▓░░░░ 설계   45%       3. 비동기 처리 (평균 2.8)    ││
│  │ ▓▓▓▓▓░░░ 행동   55%       📈 추천 학습 키워드 제공     ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  [📋 세션 기록]  [📊 대시보드]  [🔄 새 면접 시작]           │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 직무별 질문 생성 + 답변 평가 + 개선 제안 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 AI 면접 코치 웹앱 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 면접 AI 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 면접 AI 두뇌 만들기 (50분)

면접은 **질문의 질**과 **피드백의 정확성**이 핵심이에요. AI 를 활용하면 직무에 맞는 날카로운 질문을 생성하고, 답변의 강점과 약점을 즉시 분석할 수 있습니다.

핵심 개념 3가지:
1. **질문 생성** — 직무·경력·카테고리별 맞춤형 면접 질문 자동 생성
2. **답변 평가** — 내용·전달력·시간 관리 세 축으로 ==루브릭== 기반 채점
3. **개선 제안** — 약점을 진단하고 구체적인 개선 방향 + 모범 답안 제공

> 🎯 Part A 에서 이 세 가지를 LLM 셀로 직접 실험해 봅니다.`,
    },

    // ─── A-1: 직무별 면접 질문 생성 ───
    {
      type: "markdown",
      source: `### A-1. 직무별 면접 질문 생성 🏢

면접 질문은 직무마다 완전히 다릅니다. ==프롬프트 엔지니어링== 으로 직무·경력 수준·카테고리를 반영한 실전 질문을 만들어 봅시다.

**핵심 포인트:**
- \`jobType\` (프론트엔드, 백엔드, PM 등) 에 따라 질문 영역이 달라짐
- \`experience\` (신입/경력) 에 따라 난이도 조절
- ==JSON 모드== 로 구조화된 질문 배열 반환 → 앱에서 바로 사용 가능`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// A-1: 직무별 면접 질문 생성
const { chat } = await import("@anthropic-ai/sdk");

const jobType = "프론트엔드 개발자";
const experience = "신입 (0~2년)";
const count = 5;

const response = await chat({
  system: \`당신은 IT 기업 기술 면접관입니다.
주어진 직무와 경력 수준에 맞는 면접 질문을 생성합니다.

규칙:
- 각 질문에 카테고리(기술/행동/상황)와 난이도(1~5) 부여
- 질문은 실제 면접에서 나올 법한 구체적 내용
- 후속 질문(follow-up)도 1개씩 포함
- 반드시 아래 JSON 형식으로 응답

출력 형식:
{
  "questions": [
    {
      "index": 1,
      "category": "기술",
      "difficulty": 3,
      "question": "...",
      "followUp": "...",
      "evaluationCriteria": "..."
    }
  ]
}\`,
  messages: [
    {
      role: "user",
      content: \`직무: \${jobType}
경력: \${experience}
질문 수: \${count}개

카테고리 비율 — 기술 60%, 행동 20%, 상황 20%
면접 질문을 생성해 주세요.\`
    }
  ]
});

console.log("🏢 직무:", jobType, "| 경력:", experience);
console.log("━".repeat(50));
console.log(response);`,
      hints: [
        "jobType 을 '백엔드 개발자', 'PM', '데이터 분석가' 등으로 바꿔보세요",
        "experience 를 '경력 3~5년' 으로 바꾸면 난이도가 올라갑니다",
        "count 를 늘려서 더 많은 질문을 만들 수 있어요",
      ],
    },

    // ─── A-2: 답변 평가 + 점수 매기기 ───
    {
      type: "markdown",
      source: `### A-2. 답변 평가와 점수 매기기 📝

면접 답변을 세 가지 축으로 평가합니다:
- **내용 (Content)** — 기술적 정확성, 핵심 개념 포함 여부
- **전달 (Delivery)** — 논리적 구조, ==STAR 기법== 활용, 명확성
- **시간 관리 (Time)** — 적절한 답변 길이 (보통 1~3분)

AI 에게 ==루브릭== (채점 기준표)을 제공하면 일관된 평가가 가능해요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// A-2: 면접 답변 평가 시스템
const { chat } = await import("@anthropic-ai/sdk");

const question = "React의 Virtual DOM이 실제 DOM과 다른 점과, 이것이 성능에 미치는 영향을 설명해 주세요.";
const answer = "Virtual DOM은 메모리에 있는 가상의 DOM 트리입니다. React가 상태 변경을 감지하면 새 Virtual DOM을 만들고, 이전 것과 비교해서 바뀐 부분만 실제 DOM에 반영합니다. 이걸 diffing 알고리즘이라고 하는데, 전체 DOM을 다시 그리는 것보다 훨씬 빠릅니다.";
const answerTimeSeconds = 45;

const response = await chat({
  system: \`당신은 기술 면접 평가관입니다.
면접 질문과 지원자의 답변을 받아 3가지 축으로 평가합니다.

평가 루브릭:
1. 내용 (Content) 1~5점
   - 5: 핵심 개념 정확 + 깊이 있는 예시 + 트레이드오프 언급
   - 4: 핵심 개념 정확 + 예시 포함
   - 3: 기본 개념 맞지만 깊이 부족
   - 2: 부분적으로 맞지만 핵심 누락
   - 1: 틀리거나 관련 없는 답변

2. 전달 (Delivery) 1~5점
   - 5: STAR 기법 등 체계적 구조 + 명확한 논리 흐름
   - 4: 논리적이지만 구조 개선 여지
   - 3: 내용은 있으나 두서없음
   - 2: 횡설수설, 핵심 전달 실패
   - 1: 이해 불가

3. 시간 관리 (Time) 1~5점
   - 5: 1~2분 (적절)
   - 4: 2~3분 (약간 김)
   - 3: 30초~1분 (짧음) 또는 3~4분 (김)
   - 2: 15~30초 또는 4분+
   - 1: 10초 미만 또는 5분+

반드시 JSON 형식으로 응답:
{
  "scores": { "content": N, "delivery": N, "time": N },
  "totalAverage": N,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvement": "구체적 개선 제안",
  "modelAnswer": "이런 식으로 답변하면 더 좋습니다: ..."
}\`,
  messages: [
    {
      role: "user",
      content: \`질문: \${question}

지원자 답변: \${answer}

답변 소요 시간: \${answerTimeSeconds}초

위 답변을 평가해 주세요.\`
    }
  ]
});

console.log("📝 답변 평가 결과");
console.log("━".repeat(50));
console.log("질문:", question.slice(0, 50) + "...");
console.log("답변 시간:", answerTimeSeconds + "초");
console.log("━".repeat(50));
console.log(response);`,
      hints: [
        "answer 를 일부러 짧거나 틀리게 바꿔서 점수 변화를 확인해 보세요",
        "answerTimeSeconds 를 10이나 300으로 바꾸면 시간 점수가 달라집니다",
        "STAR 기법(상황-과제-행동-결과) 구조로 답변을 다시 작성해 보세요",
      ],
    },

    // ─── A-3: 약점 분석 + 개선 제안 ───
    {
      type: "markdown",
      source: `### A-3. 약점 분석과 맞춤 개선 제안 📊

여러 질문의 평가 결과를 모아서 **약점 패턴**을 분석합니다. 어떤 카테고리가 취약한지, 반복되는 실수는 무엇인지 AI 가 종합 진단하고 학습 로드맵을 제안해요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// A-3: 세션 종합 분석 + 약점 진단
const { chat } = await import("@anthropic-ai/sdk");

// 모의 세션 결과 (실제 앱에서는 각 답변 평가 결과가 누적됨)
const sessionResults = [
  { q: "Virtual DOM 설명", category: "기술-React", scores: { content: 4, delivery: 3, time: 5 } },
  { q: "클로저란 무엇인가", category: "기술-JS기초", scores: { content: 3, delivery: 2, time: 4 } },
  { q: "팀 갈등 해결 경험", category: "행동-협업", scores: { content: 3, delivery: 4, time: 3 } },
  { q: "대규모 트래픽 대응 설계", category: "기술-시스템설계", scores: { content: 2, delivery: 2, time: 3 } },
  { q: "REST vs GraphQL 비교", category: "기술-API", scores: { content: 4, delivery: 3, time: 5 } },
  { q: "실패에서 배운 경험", category: "행동-성장", scores: { content: 4, delivery: 4, time: 4 } },
];

const response = await chat({
  system: \`당신은 면접 코칭 전문가입니다.
면접 세션의 전체 결과를 분석해 종합 피드백을 제공합니다.

분석 항목:
1. 카테고리별 평균 점수
2. 약점 TOP 3 (가장 낮은 점수 영역)
3. 반복되는 패턴 (예: 전달력이 전반적으로 낮음)
4. 강점 (잘하는 영역)
5. 맞춤 학습 로드맵 (1주/2주/4주 플랜)

반드시 JSON 형식으로 응답:
{
  "overallScore": N,
  "categoryScores": { "카테고리": { "avg": N, "count": N } },
  "weaknesses": [
    { "area": "...", "avgScore": N, "diagnosis": "...", "studyKeywords": ["..."] }
  ],
  "strengths": [{ "area": "...", "avgScore": N, "comment": "..." }],
  "patterns": ["반복 패턴 1", "..."],
  "roadmap": {
    "week1": ["..."],
    "week2": ["..."],
    "week4": ["..."]
  },
  "encouragement": "응원 메시지"
}\`,
  messages: [
    {
      role: "user",
      content: \`직무: 프론트엔드 개발자 (신입)

면접 세션 결과:
\${sessionResults.map((r, i) =>
  \`\${i + 1}. [\${r.category}] "\${r.q}" → 내용:\${r.scores.content} 전달:\${r.scores.delivery} 시간:\${r.scores.time}\`
).join("\\n")}

총 \${sessionResults.length}개 질문 완료.
종합 분석과 학습 로드맵을 제공해 주세요.\`
    }
  ]
});

console.log("📊 면접 세션 종합 분석");
console.log("━".repeat(50));
console.log("총 질문 수:", sessionResults.length);
console.log("━".repeat(50));
console.log(response);`,
      hints: [
        "sessionResults 의 점수를 바꿔서 다른 약점 패턴을 관찰해 보세요",
        "직무를 백엔드, PM 등으로 바꾸면 카테고리 해석이 달라집니다",
        "질문 수를 10개 이상으로 늘리면 더 정밀한 분석이 나옵니다",
      ],
    },

    // ─── Part B: 풀스택 레시피 ───
    {
      type: "markdown",
      source: `---

## Part B: AI 면접 코치 웹앱 만들기 (100분)

> 🛠️ 여기서부터는 **내 컴퓨터**에서 진행합니다.
> Claude Code 또는 Cursor 에 아래 레시피를 붙여넣으세요.

---

### 📋 전체 레시피 (복사해서 사용)

\`\`\`markdown
# AI 면접 코치 — React + TypeScript + Vite + Tailwind + @google/genai

## 프로젝트 개요
직무별 면접 질문을 AI 가 생성하고, 사용자의 음성/텍스트 답변을 실시간 평가하는 면접 연습 앱.

## 기술 스택
- React 18 + TypeScript + Vite
- Tailwind CSS 4 (다크/라이트 모드)
- @google/genai (Gemini API — 질문 생성 + 답변 평가)
- Web Speech API (SpeechRecognition — 음성 입력)
- localStorage (세션 기록 저장)

## 환경 변수
\\\`\\\`\\\`
VITE_GEMINI_API_KEY=your-gemini-api-key
\\\`\\\`\\\`

## 핵심 기능

### 1. 직무 선택기 (JobSelector)
- 직무 목록: 프론트엔드, 백엔드, 풀스택, 데이터, PM, 디자인
- 경력 선택: 신입, 3년차, 5년+
- 난이도: 초급 / 중급 / 고급
- 질문 수 설정: 5 / 10 / 15개
- 선택 시 Zustand 또는 useState 로 상태 관리

### 2. AI 질문 생성 (QuestionGenerator)
- @google/genai 로 직무+경력+난이도에 맞는 질문 배열 생성
- JSON 모드 사용 (responseSchema 또는 프롬프트 내 JSON 강제)
- 카테고리: 기술(60%), 행동(20%), 상황(20%) 비율
- 각 질문에 난이도, 카테고리, 평가 기준 포함

### 3. 음성 답변 입력 (VoiceInput)
- Web Speech API (SpeechRecognition) 로 실시간 음성→텍스트 변환
- 한국어 인식 설정: lang = 'ko-KR'
- 음성 입력 시작/중지 버튼 + 실시간 텍스트 미리보기
- 텍스트 폴백: 음성 미지원 브라우저를 위한 textarea 입력
- 답변 시간 자동 측정 (타이머)

### 4. AI 피드백 (FeedbackPanel)
- 각 답변을 3축으로 평가:
  - 내용 (Content): 기술적 정확성, 핵심 포함 여부 (1~5)
  - 전달 (Delivery): 구조화, 논리 흐름, STAR 기법 (1~5)
  - 시간 (Time): 적절한 답변 시간 (1~5)
- 강점 / 약점 / 개선 제안 / 모범 답안 제공
- 점수를 별 아이콘 또는 프로그레스 바로 시각화

### 5. 답변 타이머 (AnswerTimer)
- 질문 표시 시 자동 시작
- 경과 시간 실시간 표시 (MM:SS)
- 1분 미만 / 1~3분 / 3분 초과에 따라 색상 변화
  - 녹색(적절) / 노란색(주의) / 빨간색(초과)
- 답변 완료 시 자동 정지, 소요 시간을 평가에 전달

### 6. 세션 기록 (SessionHistory)
- 면접 세션 단위로 localStorage 에 저장
- 세션별: 날짜, 직무, 경력, 질문 수, 평균 점수
- 질문별: 질문 텍스트, 답변 텍스트, 각 점수, 피드백
- 세션 목록 → 상세 보기 (아코디언 UI)

### 7. 약점 분석 대시보드 (WeakAreaDashboard)
- 모든 세션의 카테고리별 평균 점수 집계
- 가로 막대 차트로 시각화 (CSS 기반, 라이브러리 불필요)
- 약점 TOP 3 하이라이트 + AI 추천 학습 키워드
- 시간 추이 그래프 (최근 5개 세션 점수 변화)

### 8. 다크/라이트 모드
- Tailwind dark: 클래스 기반 토글
- 면접 진행 화면은 차분한 색상 (집중 모드)

## 페이지 구조

\\\`\\\`\\\`
src/
├── App.tsx                 # 메인 레이아웃 + 라우팅
├── components/
│   ├── JobSelector.tsx     # 직무·경력·난이도 선택
│   ├── InterviewSession.tsx # 면접 진행 메인 화면
│   ├── QuestionCard.tsx    # 질문 표시 카드
│   ├── VoiceInput.tsx      # 음성/텍스트 답변 입력
│   ├── AnswerTimer.tsx     # 답변 타이머
│   ├── FeedbackPanel.tsx   # AI 피드백 표시
│   ├── SessionHistory.tsx  # 세션 기록 목록
│   ├── WeakAreaDashboard.tsx # 약점 분석 대시보드
│   ├── ThemeToggle.tsx     # 다크/라이트 모드 토글
│   └── ScoreBar.tsx        # 점수 시각화 바
├── lib/
│   ├── gemini.ts           # @google/genai 설정 + 유틸
│   ├── prompts.ts          # 질문 생성 / 평가 프롬프트 모음
│   ├── speech.ts           # Web Speech API 래퍼
│   └── storage.ts          # localStorage 유틸
├── types/
│   └── interview.ts        # 타입 정의 (Question, Score 등)
└── index.css               # Tailwind 설정
\\\`\\\`\\\`

## 타입 정의 (types/interview.ts)

\\\`\\\`\\\`typescript
interface InterviewQuestion {
  index: number;
  category: "기술" | "행동" | "상황";
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  followUp: string;
  evaluationCriteria: string;
}

interface AnswerScore {
  content: number;   // 1~5
  delivery: number;  // 1~5
  time: number;      // 1~5
}

interface AnswerFeedback {
  scores: AnswerScore;
  totalAverage: number;
  strengths: string[];
  weaknesses: string[];
  improvement: string;
  modelAnswer: string;
}

interface InterviewRecord {
  question: InterviewQuestion;
  answer: string;
  answerTimeSeconds: number;
  feedback: AnswerFeedback;
}

interface InterviewSession {
  id: string;
  date: string;
  jobType: string;
  experience: string;
  difficulty: string;
  records: InterviewRecord[];
  overallScore: number;
}
\\\`\\\`\\\`

## 주요 구현 참고

### Web Speech API 래퍼 (lib/speech.ts)
\\\`\\\`\\\`typescript
// SpeechRecognition 타입 처리
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export function createRecognition(onResult: (text: string) => void) {
  const recognition = new SpeechRecognition();
  recognition.lang = "ko-KR";
  recognition.interimResults = true;  // 중간 결과도 표시
  recognition.continuous = true;      // 계속 인식

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(r => r[0].transcript)
      .join("");
    onResult(transcript);
  };

  return recognition;
}
\\\`\\\`\\\`

### 점수 시각화 (ScoreBar)
- width 를 퍼센트로 환산: score / 5 * 100
- 색상: 1~2 빨강, 3 노랑, 4~5 초록
- 애니메이션: transition-all duration-500

## 실행 방법
\\\`\\\`\\\`bash
npm create vite@latest interview-coach -- --template react-ts
cd interview-coach
npm install @google/genai
npx tailwindcss init -p
# .env 에 VITE_GEMINI_API_KEY 설정
npm run dev
\\\`\\\`\\\`
\`\`\``,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `---

## 🚀 도전 과제

기본 앱이 완성되면 이런 기능을 추가해 보세요:

### 도전 1: 모의 면접 모드 (난이도 ⭐⭐)
- 꼬리 질문(follow-up) 자동 진행
- 압박 면접 시뮬레이션 — "그게 정말 최선의 방법이었나요?" 같은 후속 질문
- 면접관 톤 선택: 친절형 / 중립형 / 압박형

### 도전 2: TTS 면접관 음성 (난이도 ⭐⭐⭐)
- ==Web Speech Synthesis API== 로 질문을 음성으로 읽어주기
- 면접관 목소리 선택 (남성/여성)
- 답변 대기 시간 동안 "생각할 시간을 드리겠습니다" 안내

### 도전 3: 영상 면접 분석 (난이도 ⭐⭐⭐⭐)
- 웹캠 녹화 + 시선 추적 (MediaRecorder API)
- 표정 분석 (TensorFlow.js face-landmarks-detection)
- 자세/시선/표정 피드백 추가

### 도전 4: 공유 & 경쟁 (난이도 ⭐⭐⭐)
- 면접 결과를 이미지로 저장 (html-to-image)
- 친구와 같은 질문셋으로 대결 모드
- 리더보드 (Supabase 연동)

> 💡 도전 과제는 선택 사항이에요. 기본 앱을 완성하는 것이 가장 중요합니다!`,
    },

    // ─── 마무리 ───
    {
      type: "markdown",
      source: `---

## 📚 마무리

### 이 워크샵에서 배운 것

| 개념 | 설명 |
|---|---|
| ==프롬프트 엔지니어링== | 직무·경력별 맞춤 질문 생성을 위한 체계적 프롬프트 설계 |
| ==루브릭== 기반 평가 | 내용·전달·시간 3축 채점 기준표로 일관된 AI 평가 |
| ==Web Speech API== | 브라우저 내장 음성 인식으로 핸즈프리 답변 입력 |
| ==JSON 모드== | 구조화된 AI 응답으로 앱에서 바로 데이터 활용 |
| ==STAR 기법== | 상황(Situation)-과제(Task)-행동(Action)-결과(Result) 답변 구조 |

### 다음 단계
- 🎯 실제 지원할 회사의 JD(직무 기술서)를 입력해서 맞춤 질문 생성
- 📊 일주일간 매일 10문제씩 연습하고 약점 대시보드 추이 확인
- 🤝 친구와 서로 면접관-지원자 역할 바꿔가며 실전 연습

> 🎤 면접은 실력 + 연습입니다. AI 코치와 함께 자신감을 키워 보세요!`,
    },
  ],
  quiz: {
    title: "W23: AI 면접 코치 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "AI 면접 코치에서 답변 평가의 세 가지 축이 아닌 것은?",
        options: [
          "내용 (Content) — 기술적 정확성",
          "전달 (Delivery) — 논리적 구조",
          "창의성 (Creativity) — 독창적 관점",
          "시간 관리 (Time) — 적절한 답변 길이",
        ],
        correctIndex: 2,
        explanation:
          "면접 답변 평가는 내용(Content), 전달(Delivery), 시간 관리(Time)의 세 축으로 이루어집니다. 창의성은 이 워크샵의 평가 기준에 포함되지 않습니다.",
      },
      {
        type: "multiple-choice",
        question:
          "Web Speech API의 SpeechRecognition에서 한국어 음성 인식을 설정하려면 어떤 속성을 사용하나요?",
        options: [
          'recognition.language = "korean"',
          'recognition.lang = "ko-KR"',
          'recognition.locale = "ko"',
          'recognition.setLanguage("ko-KR")',
        ],
        correctIndex: 1,
        explanation:
          "SpeechRecognition의 lang 속성에 BCP 47 언어 태그인 'ko-KR'을 설정하면 한국어 음성 인식이 활성화됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "STAR 기법에서 'T'가 의미하는 것은?",
        options: [
          "Team (팀) — 함께 일한 팀 구성원 설명",
          "Task (과제) — 해결해야 했던 과제 설명",
          "Time (시간) — 소요된 시간 설명",
          "Tool (도구) — 사용한 기술 도구 설명",
        ],
        correctIndex: 1,
        explanation:
          "STAR 기법은 Situation(상황), Task(과제), Action(행동), Result(결과)의 약자입니다. 면접 답변을 체계적으로 구조화하는 데 널리 사용되는 기법이에요.",
      },
    ],
  } satisfies Quiz,
};
