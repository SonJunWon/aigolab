import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const workshopW00Mac: Lesson = {
  id: "ai-eng-w00-mac",
  language: "ai-engineering",
  track: "beginner",
  order: 100,
  title: "W00: 내 맥을 AI 작업실로 🍎",
  subtitle: "맥에서 Claude Code · Gemini · OpenAI 개발 환경 만들기",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🍎 맥(Mac) 사용자를 위한 AI 개발 환경 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

> ⚠️ **이 강의는 맥(MacBook, iMac, Mac mini) 전용입니다.**
> 윈도우 사용자는 **W00 윈도우 편** 으로 가세요.

## 이 강의가 끝나면

| 도구 | 역할 |
|---|---|
| ✅ Node.js | 프로그램 실행 엔진 |
| ✅ VS Code (또는 Cursor) | 코드 편집기 |
| ✅ Claude Code 또는 Cursor AI | AI 코딩 도우미 |
| ✅ Gemini ==API 키== | AI 서비스 출입증 |

한 단계씩 **천천히** 따라하세요. 건너뛰면 이후 워크샵이 안 됩니다.`,
    },

    // ─── 터미널 여는 법 ───
    {
      type: "markdown",
      source: `## 📍 단계 0: 터미널 여는 법 (가장 중요!)

**터미널** 은 컴퓨터에게 글자로 명령을 내리는 창이에요. "파일 탐색기" 가 그래픽으로 파일을 보여준다면, 터미널은 **글자로** 같은 일을 합니다. 개발자의 기본 도구.

### 🍎 맥에서 터미널 여는 방법 3가지

**방법 1: Spotlight 검색 (가장 추천)**
1. 키보드에서 **⌘ (Command) + 스페이스바** 를 동시에 누르세요
2. 화면 중앙에 검색창이 뜹니다
3. "**터미널**" 이라고 입력 (또는 "**terminal**")
4. **터미널.app** 이 검색 결과에 나타남 → **Enter** 또는 클릭
5. 검은색(또는 흰색) 창이 뜨면 성공! ✅

**방법 2: Finder 에서 찾기**
1. 하단 Dock 에서 **Finder** (웃는 얼굴 아이콘) 클릭
2. 상단 메뉴 → **이동** → **유틸리티** (또는 키보드 ⌘+Shift+U)
3. **터미널.app** 더블클릭

**방법 3: Launchpad 에서 찾기**
1. Dock 에서 **Launchpad** (로켓 아이콘) 클릭
2. 상단 검색에 "터미널" 입력
3. **터미널** 아이콘 클릭

### 터미널이 열리면 이런 모습이에요

\`\`\`
Last login: Thu Apr 17 00:00:00 on ttys000
사용자이름@MacBook ~ %
\`\`\`

- 마지막 줄에 \`%\` 또는 \`$\` 가 보이면 **명령어를 입력할 준비 완료**
- 이 뒤에 글자를 입력하고 **Enter** 를 누르면 명령이 실행됩니다

### 💡 터미널 Dock 에 고정하기 (추천)

앞으로 자주 쓰니까 쉽게 접근하게 해놓아요:
1. 터미널이 열린 상태에서 Dock 의 터미널 아이콘을 **오른쪽 클릭** (또는 Control+클릭)
2. **옵션** → **Dock에 유지** 체크

이제 Dock 에서 한 번 클릭으로 터미널을 열 수 있어요.`,
    },

    // ─── Node.js ───
    {
      type: "markdown",
      source: `## 📍 단계 1: Node.js 설치 (10분)

**Node.js** = 프로그램을 실행시켜주는 엔진. 이것 없이는 우리가 만들 코드가 돌아가지 않아요.

### 설치 방법

1. 브라우저(Safari 또는 Chrome) 에서 주소창에 입력:
\`\`\`
https://nodejs.org
\`\`\`

2. 큰 초록색 버튼 두 개 중 **왼쪽 "LTS"** 를 클릭
   - LTS = 안정적인 버전이라는 뜻
   - 오른쪽 "Current" 는 **선택하지 마세요** (불안정할 수 있음)

3. \`.pkg\` 파일이 다운로드됨 → 다운로드 폴더에서 **더블클릭**

4. 설치 마법사 화면:
   - **[계속]** 클릭
   - **[계속]** 클릭
   - 약관 → **[동의]** 클릭
   - **[설치]** 클릭
   - 맥 비밀번호(잠금 해제할 때 쓰는 그 비밀번호) 입력 → **[소프트웨어 설치]**

5. "설치가 완료되었습니다" → **[닫기]**

### 설치 확인

1. **터미널** 열기 (단계 0 에서 배운 방법)
2. 아래 글자를 **그대로** 입력하고 Enter:
\`\`\`
node --version
\`\`\`
3. \`v22.x.x\` 같은 버전 번호가 나오면 **성공!** ✅

### ❗ 안 되면?
- "command not found" → 터미널을 **닫고 새로 열어서** 다시 시도
- 여전히 안 되면 → 컴퓨터 **재시작** 후 다시`,
    },

    // ─── VS Code ───
    {
      type: "markdown",
      source: `## 📍 단계 2: VS Code 설치 (5분)

**VS Code** = 코드를 보고 편집하는 도구. 메모장의 업그레이드 버전.

1. 브라우저에서:
\`\`\`
https://code.visualstudio.com
\`\`\`

2. 큰 파란 버튼 **"Download for Mac"** 클릭

3. 다운받은 \`.zip\` 파일을 더블클릭 → 압축 해제

4. 나타난 **Visual Studio Code** 를 **응용 프로그램 폴더** 로 드래그
   - Finder 열기 → 왼쪽에 "응용 프로그램" → 여기로 끌어다 놓기

5. 응용 프로그램에서 **Visual Studio Code** 더블클릭해서 실행

6. "인터넷에서 다운로드한 앱입니다" 경고 → **[열기]** 클릭

7. VS Code 화면이 뜨면 **성공!** ✅

> 💡 **Cursor** (https://cursor.com) 를 대신 쓸 수도 있어요 — AI 기능이 더 강력한 VS Code 기반 편집기. 무료 플랜 있음.`,
    },

    // ─── AI 도구 ───
    {
      type: "markdown",
      source: `## 📍 단계 3: AI 코딩 도구 선택 + 설치 (10분)

### 🚨 두 가지 중 하나를 선택하세요

| 도구 | 특징 | 비용 |
|---|---|---|
| **🅰️ Claude Code** | 터미널에서 AI 와 대화 | Pro $20/월 또는 API 키 |
| **🅱️ Cursor** | VS Code 같은 화면에서 AI | 무료 시작 가능 |

> "잘 모르겠다" → **🅱️ Cursor** 부터 시작 (무료 + 시각적)

---

### 🅰️ Claude Code 설치

1. **터미널** 열기
2. 아래 명령어 입력 후 Enter:
\`\`\`
npm install -g @anthropic-ai/claude-code
\`\`\`
   - 1~2분 걸릴 수 있어요. 글자가 주르륵 나오는 건 정상.
   - "npm" 은 단계 1 에서 Node.js 와 함께 설치된 도구

3. 설치 확인:
\`\`\`
claude --version
\`\`\`

4. 처음 실행:
\`\`\`
claude
\`\`\`
   - 브라우저가 열리며 Anthropic 로그인/가입 → 완료 후 터미널로 돌아옴

---

### 🅱️ Cursor 설치

1. 브라우저: \`https://cursor.com\` → **[Download]**
2. \`.dmg\` 파일 열기 → Cursor 를 응용 프로그램으로 드래그
3. Cursor 실행 → 계정 만들기 (GitHub 또는 이메일)
4. **⌘+I** 로 AI 채팅 열기 → 성공! ✅`,
    },

    // ─── API 키 ───
    {
      type: "markdown",
      source: `## 📍 단계 4: Gemini 무료 API 키 발급 (5분)

1. 브라우저에서:
\`\`\`
https://aistudio.google.com/apikey
\`\`\`

2. Google 계정으로 로그인

3. 이용약관 동의 → **[Continue]**

4. **[+ Create API key]** → **[Create API key in new project]**

5. \`AIzaSy...\` 로 시작하는 키 생성 → 📋 **복사**

6. 안전한 곳에 저장 (메모앱 등)

> 💡 이 키는 **일일 1,500회 무료**. 워크샵 하기에 충분합니다.
> ⚠️ 키는 비밀번호처럼 — **절대 공유하지 마세요**.`,
    },

    // ─── 테스트 ───
    {
      type: "markdown",
      source: `## 📍 단계 5: 첫 테스트 — "Hello AI" (10분)

### 🅰️ Claude Code 선택한 분

1. 터미널에서:
\`\`\`
mkdir hello-ai
cd hello-ai
npm init -y
npm install @google/genai
\`\`\`

2. Claude 실행:
\`\`\`
claude
\`\`\`

3. Claude 에게 이렇게 입력:
> @google/genai 패키지로 Gemini 에 "안녕하세요" 보내고 응답 출력하는 index.js 만들어줘. API 키는 환경변수 GEMINI_API_KEY 에서 읽어.

4. Claude 가 코드 생성 → **Accept**

5. 실행:
\`\`\`
GEMINI_API_KEY=여러분키 node index.js
\`\`\`

AI 응답이 나오면 **완료!** 🎉

### 🅱️ Cursor 선택한 분

1. Cursor → **File > Open Folder** → 새 폴더 \`hello-ai\` 만들어 열기
2. **⌘+\`** (백틱) 로 터미널 열기
3. \`npm init -y && npm install @google/genai\`
4. **⌘+I** → 위와 같은 메시지 입력
5. 생성된 코드 승인 → 터미널에서 실행

## ✅ 맥 환경 구축 완료!

이제 **W01: 나만의 AI 챗봇 만들기** 로 넘어가세요. 🚀`,
    },
  ],
  quiz: {
    title: "W00 Mac — 환경 구축 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "맥에서 터미널을 가장 빠르게 여는 방법은?",
        options: [
          "Safari 에서 검색",
          "⌘ + 스페이스바 → '터미널' 입력 → Enter (Spotlight 검색)",
          "App Store 에서 다운로드",
          "시스템 환경설정에서 활성화",
        ],
        correctIndex: 1,
        explanation: "Spotlight(⌘+Space) 은 맥에서 앱을 가장 빠르게 찾는 방법. '터미널' 입력하면 바로 열 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "Node.js 설치 후 터미널에서 'command not found: node' 가 나오면?",
        options: [
          "Node.js 를 다시 구매",
          "터미널을 닫고 새로 열기 — 설치 후 터미널 재시작 필요",
          "맥을 포맷",
          "Safari 업데이트",
        ],
        correctIndex: 1,
        explanation: "설치 직후엔 기존 터미널이 새 프로그램을 못 찾을 수 있어요. 닫고 새로 열면 PATH 가 갱신됩니다.",
      },
    ],
  } satisfies Quiz,
};
