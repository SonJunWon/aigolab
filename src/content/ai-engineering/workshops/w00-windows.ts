import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const workshopW00Windows: Lesson = {
  id: "ai-eng-w00-windows",
  language: "ai-engineering",
  track: "beginner",
  order: 99,
  title: "W00: 내 PC를 AI 작업실로 🪟",
  subtitle: "윈도우에서 Claude Code · Gemini · OpenAI 개발 환경 만들기",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🪟 윈도우(Windows) 사용자를 위한 AI 개발 환경 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

> ⚠️ **이 강의는 윈도우(Windows 10/11) 전용입니다.**
> 맥 사용자는 **W00 맥 편** 으로 가세요.

## 이 강의가 끝나면

| 도구 | 역할 |
|---|---|
| ✅ Node.js | 프로그램 실행 엔진 |
| ✅ VS Code (또는 Cursor) | 코드 편집기 |
| ✅ Claude Code 또는 Cursor AI | AI 코딩 도우미 |
| ✅ Gemini ==API 키== | AI 서비스 출입증 |`,
    },

    // ─── 터미널 여는 법 ───
    {
      type: "markdown",
      source: `## 📍 단계 0: 명령 프롬프트(터미널) 여는 법

**명령 프롬프트** (또는 PowerShell) 는 컴퓨터에게 글자로 명령을 내리는 창이에요. 윈도우의 "터미널" 입니다.

### 🪟 윈도우에서 여는 방법 3가지

**방법 1: 검색 (가장 추천)**
1. 화면 **왼쪽 아래** 의 🔍 **돋보기 아이콘** 클릭 (또는 키보드 **⊞ Windows 키** 누르기)
2. "**cmd**" 라고 입력
3. **"명령 프롬프트"** 가 검색 결과에 나타남 → 클릭
4. 검은 창이 뜨면 성공! ✅

> 💡 "cmd" 대신 **"PowerShell"** 을 검색해도 됩니다. PowerShell 이 더 최신이지만 둘 다 괜찮아요.

**방법 2: 시작 메뉴에서**
1. 왼쪽 아래 **⊞ 시작** 버튼 클릭
2. 앱 목록 스크롤 → **"Windows 시스템"** 폴더 → **"명령 프롬프트"**
   (또는 **"Windows Terminal"** 이 있으면 그걸 클릭)

**방법 3: 키보드 단축키**
1. **⊞ Windows 키 + R** 동시 누르기
2. "실행" 창이 뜸 → **cmd** 입력 → **Enter**
3. 명령 프롬프트 열림

### 열리면 이런 모습

\`\`\`
Microsoft Windows [Version 10.0.xxxxx]
(c) Microsoft Corporation. All rights reserved.

C:\\Users\\사용자이름>
\`\`\`

- \`C:\\Users\\사용자이름>\` 뒤에 커서가 깜빡이면 **명령어 입력 준비 완료**
- 여기에 글자를 입력하고 **Enter** 를 누르면 명령이 실행됩니다

### 💡 작업 표시줄에 고정하기

자주 쓰니까 쉽게 접근:
1. 명령 프롬프트가 열린 상태에서 **작업 표시줄의 아이콘** 을 오른쪽 클릭
2. **"작업 표시줄에 고정"** 클릭`,
    },

    // ─── Node.js ───
    {
      type: "markdown",
      source: `## 📍 단계 1: Node.js 설치 (10분)

1. 브라우저(Edge 또는 Chrome) 에서:
\`\`\`
https://nodejs.org
\`\`\`

2. 큰 초록색 버튼 **"LTS"** 클릭 (왼쪽 버튼)

3. \`.msi\` 파일 다운로드 → 더블클릭

4. 설치 마법사:
   - **[Next]** 클릭
   - "I accept..." 체크 → **[Next]**
   - 설치 경로 **기본값 그대로** → **[Next]**
   - **[Next]** → **[Install]**
   - "이 앱이 변경을 허용하시겠습니까?" → **[예]**
   - 설치 완료 → **[Finish]**

5. **확인** — 명령 프롬프트 **새로 열기** (단계 0 방법):
\`\`\`
node --version
\`\`\`
\`v22.x.x\` 나오면 성공! ✅

### ❗ 안 되면?
- **컴퓨터 재시작** 후 다시 시도
- "내부 또는 외부 명령이 아닙니다" → 명령 프롬프트를 닫고 **새로** 열기`,
    },

    // ─── VS Code ───
    {
      type: "markdown",
      source: `## 📍 단계 2: VS Code 설치 (5분)

1. 브라우저: \`https://code.visualstudio.com\`
2. **"Download for Windows"** 클릭
3. \`.exe\` 파일 실행 → **[다음]** 계속 → 설치 완료
4. VS Code 실행 → 화면 뜨면 성공! ✅

> 💡 **Cursor** (\`https://cursor.com\`) 도 대안 — AI 기능 더 강력. 무료 플랜 있음.`,
    },

    // ─── AI 도구 ───
    {
      type: "markdown",
      source: `## 📍 단계 3: AI 코딩 도구 선택 (10분)

| 도구 | 특징 | 비용 |
|---|---|---|
| **🅰️ Claude Code** | 명령 프롬프트에서 AI 대화 | Pro $20/월 또는 API 키 |
| **🅱️ Cursor** | VS Code 화면에서 AI | 무료 시작 가능 |

### 🅰️ Claude Code

1. **PowerShell** 열기 (검색 → "PowerShell" → **관리자 권한으로 실행**)
2. 입력:
\`\`\`
npm install -g @anthropic-ai/claude-code
\`\`\`
3. 확인: \`claude --version\`
4. 첫 실행: \`claude\` → Anthropic 로그인

### 🅱️ Cursor

1. \`https://cursor.com\` → Download → \`.exe\` 실행 → 설치
2. 계정 만들기 → **Ctrl+I** 로 AI 채팅 → 성공! ✅`,
    },

    // ─── API 키 ───
    {
      type: "markdown",
      source: `## 📍 단계 4: Gemini 무료 API 키 (5분)

1. \`https://aistudio.google.com/apikey\` → Google 로그인
2. **[+ Create API key]** → **[Create API key in new project]**
3. \`AIzaSy...\` 키 복사 → 안전한 곳에 저장
4. 일일 **1,500회 무료** — 워크샵에 충분`,
    },

    // ─── 테스트 ───
    {
      type: "markdown",
      source: `## 📍 단계 5: 첫 테스트 (10분)

### 🅰️ Claude Code

명령 프롬프트에서:
\`\`\`
mkdir hello-ai
cd hello-ai
npm init -y
npm install @google/genai
claude
\`\`\`
Claude 에게: "Gemini 에 안녕 보내는 index.js 만들어줘"
\`\`\`
set GEMINI_API_KEY=여러분키 && node index.js
\`\`\`

### 🅱️ Cursor

1. Cursor → File > Open Folder → 새 폴더 열기
2. **Ctrl+\`** 터미널 → \`npm init -y && npm install @google/genai\`
3. **Ctrl+I** → "Gemini 에 안녕 보내는 index.js" 요청
4. 실행:
\`\`\`
$env:GEMINI_API_KEY="여러분키"; node index.js
\`\`\`

AI 응답 나오면 **완료!** 🎉 → **W01 챗봇 만들기** 로 넘어가세요.`,
    },
  ],
  quiz: {
    title: "W00 Windows — 환경 구축 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "윈도우에서 명령 프롬프트를 가장 빠르게 여는 방법은?",
        options: [
          "제어판에서 찾기",
          "⊞ Windows 키 누르고 'cmd' 입력 → Enter",
          "인터넷 익스플로러 실행",
          "설정 앱에서 활성화",
        ],
        correctIndex: 1,
        explanation: "시작 메뉴 검색이 가장 빠릅니다. 'cmd' 또는 'PowerShell' 을 입력하면 바로 찾을 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "윈도우에서 환경변수로 API 키를 전달하는 명령어는?",
        options: [
          "export GEMINI_API_KEY=키",
          "set GEMINI_API_KEY=키 && node index.js (CMD) 또는 $env:GEMINI_API_KEY='키'; node index.js (PowerShell)",
          "GEMINI_API_KEY=키 node index.js",
          "API_KEY 키",
        ],
        correctIndex: 1,
        explanation: "윈도우 CMD 는 'set' 명령, PowerShell 은 '$env:' 문법을 사용. 맥의 export 와 다릅니다.",
      },
    ],
  } satisfies Quiz,
};
