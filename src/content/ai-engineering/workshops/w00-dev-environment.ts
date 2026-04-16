import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W00 — 개발 환경 구축 (맥/윈도우).
 *
 * 바이브 코딩 워크샵의 제0강. 이후 모든 워크샵의 전제 조건.
 * 중학생 수준으로 모든 단계를 설명.
 * 맥/윈도우 두 갈래가 명확히 분리.
 */
export const workshopW00: Lesson = {
  id: "ai-eng-w00-dev-environment",
  language: "ai-engineering",
  track: "beginner",
  order: 100, // 워크샵은 100번대
  title: "W00: 개발 환경 구축 — AI 바이브 코딩을 위한 준비",
  subtitle: "맥과 윈도우에서 Claude Code · Gemini · OpenAI 개발 환경 만들기",
  estimatedMinutes: 60,
  cells: [
    // ─────────────────────────────────────────────
    // 도입
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `# 🛠️ 바이브 코딩을 위한 개발 환경 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 바이브 코딩이란?

**바이브 코딩 (Vibe Coding)** = AI 에게 "이런 프로그램 만들어줘" 라고 말하면 AI 가 코드를 대신 작성해주는 새로운 프로그래밍 방식.

여러분이 할 일:
1. **마크다운(MD) 파일** 에 "만들고 싶은 프로그램" 을 글로 설명
2. AI 코딩 도구 (Claude Code, Cursor 등) 에 이 파일을 전달
3. AI 가 코드를 생성 → 여러분이 실행 → **완성된 프로그램** 탄생!

코딩 경험이 없어도 됩니다. **글을 쓸 수 있으면** 프로그램을 만들 수 있어요.

## 이 강의에서 하는 것

| 단계 | 내용 | 소요 시간 |
|---|---|---|
| 1 | 내 컴퓨터가 맥인지 윈도우인지 확인 | 1분 |
| 2 | **Node.js** 설치 — 프로그램 실행 엔진 | 10분 |
| 3 | **VS Code** 설치 — 코드 편집기 | 5분 |
| 4 | **Claude Code** 설치 — AI 코딩 도우미 | 10분 |
| 5 | **API 키 발급** — Gemini · OpenAI · Anthropic | 15분 |
| 6 | 첫 프로젝트 만들기 — "Hello AI" 테스트 | 10분 |

> ⚠️ **한 단계씩 천천히** — 건너뛰지 마세요. 환경이 안 되면 이후 모든 워크샵이 안 됩니다.`,
    },

    // ─────────────────────────────────────────────
    // 단계 1: OS 확인
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 📍 단계 1: 내 컴퓨터 확인 (1분)

이 강의는 **두 갈래** 로 나뉩니다. 내 컴퓨터에 맞는 길을 따라가세요.

### 어떻게 확인하나요?

**🍎 맥 (Mac) 인 경우:**
- 화면 왼쪽 위에 **사과 🍎 로고** 가 있다
- 키보드에 **⌘ (Command)** 키가 있다
- MacBook, iMac, Mac mini 등

**🪟 윈도우 (Windows) 인 경우:**
- 화면 왼쪽 아래에 **윈도우 🪟 로고** 가 있다 (시작 메뉴)
- 키보드에 **⊞ (Windows)** 키가 있다
- 삼성, LG, HP, Dell 등 대부분의 노트북/데스크탑

---

> 🚨 **이 아래부터 맥과 윈도우 설명이 번갈아 나옵니다.**
> **🍎 맥** 이면 🍎 표시된 부분만, **🪟 윈도우** 면 🪟 표시된 부분만 따라하세요.
> 공통 부분은 **🌐** 으로 표시합니다.`,
    },

    // ─────────────────────────────────────────────
    // 단계 2: Node.js 설치
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 📍 단계 2: Node.js 설치 (10분)

### Node.js 가 뭔가요?

프로그램을 실행시켜주는 **엔진** 이에요. 자동차로 치면 엔진 없이는 달릴 수 없듯, Node.js 없이는 우리가 만들 프로그램이 실행되지 않아요.

---

### 🍎 맥에서 Node.js 설치

**방법 A: 직접 다운로드 (가장 쉬움)**

1. 브라우저에서 이 주소로 이동:
\`\`\`
https://nodejs.org
\`\`\`

2. 초록색 버튼 **"LTS"** (Long Term Support) 를 클릭해서 다운로드
   - 버전 숫자는 달라도 됩니다 (예: 22.x.x)
   - ⚠️ "Current" 가 아니라 **"LTS"** 를 선택하세요 (더 안정적)

3. 다운받은 파일 (\`.pkg\`) 을 더블클릭

4. 설치 마법사가 뜨면:
   - **[계속]** → **[계속]** → **[동의]** → **[설치]**
   - 비밀번호(맥 로그인 비밀번호) 입력 → **[소프트웨어 설치]**

5. "설치가 완료되었습니다" → **[닫기]**

6. **확인**: 터미널을 열어서 (🍎의 경우 Spotlight 검색에서 "터미널" 입력) 아래 명령어 입력:
\`\`\`
node --version
\`\`\`
\`v22.x.x\` 같은 버전이 나오면 성공! ✅

**방법 B: Homebrew 로 설치 (개발자 추천)**

이미 Homebrew 가 설치돼 있다면:
\`\`\`
brew install node
\`\`\`
Homebrew 가 뭔지 모르면 **방법 A** 로 하세요.

---

### 🪟 윈도우에서 Node.js 설치

1. 브라우저에서 이 주소로 이동:
\`\`\`
https://nodejs.org
\`\`\`

2. 초록색 버튼 **"LTS"** 를 클릭해서 다운로드
   - ⚠️ "Current" 가 아니라 **"LTS"** 선택

3. 다운받은 파일 (\`.msi\`) 을 더블클릭

4. 설치 마법사:
   - **[Next]** → **체크박스 "I accept..."** 체크 → **[Next]**
   - 설치 경로는 **기본값 그대로** (건드리지 마세요)
   - **"Automatically install the necessary tools"** 체크박스가 보이면 **체크** (선택)
   - **[Next]** → **[Install]** → 관리자 권한 "예" 클릭
   - 설치 완료 → **[Finish]**

5. **확인**:
   - **시작 메뉴** → "cmd" 검색 → **명령 프롬프트** 클릭 (또는 PowerShell)
   - 아래 명령어 입력:
\`\`\`
node --version
\`\`\`
\`v22.x.x\` 같은 버전이 나오면 성공! ✅

---

### ❗ 안 되면?

| 증상 | 해결 |
|---|---|
| "node 은(는) 내부 또는 외부 명령이 아닙니다" (윈도우) | 컴퓨터 **재시작** 후 다시 시도 |
| "command not found: node" (맥) | 터미널 **닫고 새로 열기** 후 다시 시도 |
| 여전히 안 됨 | Node.js 삭제 후 **재설치** — 위 단계 처음부터 |`,
    },

    // ─────────────────────────────────────────────
    // 단계 3: VS Code 설치
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 📍 단계 3: VS Code 설치 (5분)

### VS Code 가 뭔가요?

**코드 편집기** — 메모장의 업그레이드 버전이에요. 코드에 색을 입혀주고, 오타를 알려주고, AI 도구와 연결해줘요. 전 세계 개발자의 70% 이상이 사용하는 무료 도구.

---

### 🌐 맥 / 윈도우 공통

1. 브라우저에서 이 주소로 이동:
\`\`\`
https://code.visualstudio.com
\`\`\`

2. 큰 파란 버튼 **"Download for ..."** 클릭
   - 맥이면 "Download for Mac", 윈도우면 "Download for Windows" 로 자동 인식됨

3. 🍎 **맥**: 다운받은 \`.zip\` 파일 압축 해제 → \`Visual Studio Code.app\` 을 **응용 프로그램** 폴더로 드래그

4. 🪟 **윈도우**: 다운받은 \`.exe\` 파일 실행 → **[다음]** 계속 → 설치 완료

5. VS Code 실행해서 화면이 뜨면 성공! ✅

### 💡 선택 사항: Cursor (AI 특화 편집기)

VS Code 대신 **Cursor** (https://cursor.com) 를 쓸 수도 있어요.
VS Code 기반이지만 AI 기능이 더 강력합니다. 무료 플랜 있음.

> **초보자 추천**: VS Code 먼저 → 익숙해지면 Cursor 도 시도
> **AI 코딩에 올인**: 바로 Cursor 로 시작해도 OK`,
    },

    // ─────────────────────────────────────────────
    // 단계 4: Claude Code 설치
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 📍 단계 4: Claude Code 설치 (10분)

### Claude Code 가 뭔가요?

**터미널에서 AI 와 대화하며 코딩하는 도구** 예요. 마크다운 파일을 주면 AI 가 읽고, 코드를 생성하고, 파일을 만들고, 실행까지 해줘요. 바이브 코딩의 **핵심 도구**.

### 🚨 두 가지 방향이 있습니다

여기서 **두 갈래** 가 나뉩니다. 어떤 AI 코딩 도구를 사용할지 선택:

| 도구 | 장점 | 비용 | 추천 대상 |
|---|---|---|---|
| **Claude Code** | 터미널 기반, 강력한 코드 생성 | 유료 (Pro $20/월) 또는 API 키 사용 | AI 코딩 도구에 투자 의향 있는 분 |
| **Cursor** | VS Code 기반, 시각적, 무료 시작 가능 | 무료 플랜 (월 2000 completions) | 무료로 시작하고 싶은 분 |

> 💡 **둘 다 해봐도 됩니다.** 하지만 처음엔 **하나만** 집중하는 걸 추천.

---

### 🅰️ 방향 A: Claude Code 설치

**전제**: Anthropic 계정 + API 키 (또는 Pro 구독) 필요.

**🍎 맥에서:**

1. 터미널 열기 (Spotlight → "터미널")

2. 아래 명령어 입력:
\`\`\`
npm install -g @anthropic-ai/claude-code
\`\`\`
- \`npm\` 은 단계 2 에서 Node.js 설치할 때 같이 설치된 도구
- \`-g\` 는 "어디서든 쓸 수 있게 전역 설치" 라는 뜻
- 1~2분 걸릴 수 있어요

3. 설치 확인:
\`\`\`
claude --version
\`\`\`
버전 번호가 나오면 성공! ✅

4. 처음 실행:
\`\`\`
claude
\`\`\`
- Anthropic 로그인 화면이 뜸 → 계정 만들기 또는 로그인
- API 키 입력 또는 Pro 구독 연결

**🪟 윈도우에서:**

1. **PowerShell** 열기 (시작 메뉴 → "PowerShell" 검색 → **관리자 권한으로 실행**)

2. 아래 명령어 입력:
\`\`\`
npm install -g @anthropic-ai/claude-code
\`\`\`

3. 설치 확인:
\`\`\`
claude --version
\`\`\`

4. 처음 실행:
\`\`\`
claude
\`\`\`
- 이하 맥과 동일 (Anthropic 로그인)

---

### 🅱️ 방향 B: Cursor 설치 (무료 시작)

1. 브라우저에서:
\`\`\`
https://cursor.com
\`\`\`

2. **[Download]** → 맥 또는 윈도우용 자동 다운로드

3. 🍎 맥: \`.dmg\` 파일 열기 → Cursor 를 응용 프로그램으로 드래그
   🪟 윈도우: \`.exe\` 실행 → 설치 마법사 따라가기

4. Cursor 실행 → 계정 만들기 (GitHub 또는 이메일)

5. 설정에서 AI 모델 선택:
   - 무료: Claude 3.5 Sonnet / GPT-4o (월 2000 completions)
   - 유료: Pro $20/월 (무제한)

6. **Cmd+I** (맥) 또는 **Ctrl+I** (윈도우) 로 AI 채팅 열기 → 성공! ✅

---

### ❗ 어떤 걸 선택해야 하나요?

| 상황 | 추천 |
|---|---|
| "돈 쓰기 싫어, 무료만" | 🅱️ **Cursor** 무료 플랜 |
| "터미널이 편하고 강력한 도구 원해" | 🅰️ **Claude Code** |
| "둘 다 잘 모르겠어" | 🅱️ **Cursor** 먼저 → 익숙해지면 🅰️ |
| "최대한 많이 만들고 싶어" | 🅰️ Claude Code Pro ($20/월) |`,
    },

    // ─────────────────────────────────────────────
    // 단계 5: API 키 발급
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 📍 단계 5: 무료 API 키 발급 (15분)

### ==API 키==가 왜 필요한가요?

우리가 만들 프로그램이 AI 서비스 (Gemini, OpenAI 등) 와 대화하려면 **"출입증"** 이 필요해요. 그게 API 키입니다.

### 🚨 세 가지 AI 서비스를 등록합니다

| 서비스 | 용도 | 무료 한도 | 키 형태 |
|---|---|---|---|
| **Google Gemini** | 메인 AI (한국어 우수) | 일 1,500회 | \`AIza...\` |
| **OpenAI** | 범용 AI (GPT-4o 등) | $5 크레딧 (신규) | \`sk-...\` |
| **Anthropic** | Claude Code 용 | API 크레딧 별도 | \`sk-ant-...\` |

> 💡 **셋 다 만들 필요는 없어요.** Gemini 하나만으로도 워크샵 진행 가능.
> OpenAI 와 Anthropic 은 "더 다양한 AI 를 써보고 싶을 때" 추가.

---

### 🌐 5-1. Google Gemini 키 발급 (필수, 무료)

1. 브라우저에서:
\`\`\`
https://aistudio.google.com/apikey
\`\`\`

2. Google 계정으로 로그인

3. 이용약관 동의 → **[Continue]**

4. **[+ Create API key]** 클릭

5. **[Create API key in new project]** 선택

6. \`AIzaSy...\` 로 시작하는 키가 생성됨 → 📋 **복사**

7. **안전한 곳에 저장** (메모장, 1Password 등)
   - ⚠️ 이 키는 비밀번호처럼 취급하세요

---

### 🌐 5-2. OpenAI 키 발급 (선택, 무료 $5 크레딧)

1. 브라우저에서:
\`\`\`
https://platform.openai.com/api-keys
\`\`\`

2. OpenAI 계정 만들기 (이메일 + 전화번호 인증)
   - 이미 ChatGPT 계정이 있으면 그걸로 로그인

3. **[+ Create new secret key]** 클릭

4. 이름: \`my-vibe-coding\` (아무거나)

5. \`sk-...\` 로 시작하는 키 → 📋 **즉시 복사**
   - ⚠️ **이 키는 한 번만 보여줌** — 페이지 닫으면 다시 못 봄!

6. 안전한 곳에 저장

> 💡 신규 가입 시 **$5 무료 크레딧** (90일 유효). GPT-4o-mini 기준 수천 회 호출 가능.

---

### 🌐 5-3. Anthropic 키 발급 (Claude Code 선택한 분만)

1. 브라우저에서:
\`\`\`
https://console.anthropic.com/settings/keys
\`\`\`

2. Anthropic 계정 만들기 (이메일 인증)

3. **[+ Create Key]** 클릭

4. \`sk-ant-...\` 로 시작하는 키 → 📋 **즉시 복사**
   - 마찬가지로 한 번만 보여줌

5. 안전한 곳에 저장

> ⚠️ Anthropic API 는 **유료 크레딧 충전** 이 필요할 수 있어요 (최소 $5).
> Claude Code Pro 구독($20/월) 사용자는 API 키 대신 구독으로 사용 가능.`,
    },

    // ─────────────────────────────────────────────
    // 단계 6: 첫 프로젝트
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 📍 단계 6: 첫 프로젝트 — "Hello AI" (10분)

모든 설치가 끝났으면 **실제로 작동하는지** 확인합시다.

---

### 🅰️ Claude Code 사용자

**🍎 맥 터미널 / 🪟 윈도우 PowerShell:**

1. 프로젝트 폴더 만들기:
\`\`\`
mkdir hello-ai
cd hello-ai
npm init -y
npm install @google/genai
\`\`\`

2. Claude Code 실행:
\`\`\`
claude
\`\`\`

3. Claude 에게 입력:
\`\`\`
@google/genai 패키지를 사용해서 Gemini에 "안녕하세요, 저는 AI 바이브 코딩을 배우고 있어요"
라고 보내고 응답을 출력하는 index.js 파일을 만들어줘.
API 키는 환경변수 GEMINI_API_KEY 에서 읽어.
\`\`\`

4. Claude 가 코드를 생성하면 **[Accept]** 또는 **y** 로 승인

5. 실행:
\`\`\`
GEMINI_API_KEY=여러분의AIza키 node index.js     (맥)
set GEMINI_API_KEY=여러분의AIza키 && node index.js  (윈도우 CMD)
$env:GEMINI_API_KEY="여러분의AIza키"; node index.js  (윈도우 PowerShell)
\`\`\`

6. Gemini 의 한국어 응답이 나오면 **환경 구축 완료! 🎉**

---

### 🅱️ Cursor 사용자

1. Cursor 실행 → **File > Open Folder** → 새 폴더 \`hello-ai\` 만들어 열기

2. 터미널 열기: **Ctrl+\`** (백틱) 또는 메뉴 **Terminal > New Terminal**

3. 터미널에서:
\`\`\`
npm init -y
npm install @google/genai
\`\`\`

4. **Cmd+I** (맥) / **Ctrl+I** (윈도우) → AI 채팅 열기

5. AI 에게 입력:
\`\`\`
@google/genai 패키지를 사용해서 Gemini에 "안녕하세요" 라고 보내고
응답을 출력하는 index.js 파일을 만들어줘.
API 키는 환경변수 GEMINI_API_KEY 에서 읽어.
\`\`\`

6. 생성된 코드 승인 → 터미널에서 실행 (위와 동일 명령어)

7. 응답이 나오면 **완료! 🎉**

---

### ❗ 안 되면?

| 증상 | 해결 |
|---|---|
| "npm: command not found" | 단계 2 Node.js 설치 다시 확인. 터미널 재시작. |
| "claude: command not found" | \`npm install -g @anthropic-ai/claude-code\` 재실행 |
| "API key not valid" | 키 복사할 때 앞뒤 공백 확인. 키 재발급. |
| "GEMINI_API_KEY is not defined" | 환경변수 설정이 안 됨. 위 명령어 형식 정확히 확인 (맥/윈도우 다름) |
| Cursor 에서 AI 가 안 됨 | 설정 → AI 모델이 선택돼 있는지, 무료 한도 남았는지 확인 |`,
    },

    // ─────────────────────────────────────────────
    // 다음 워크샵 안내
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## ✅ 환경 구축 완료 — 축하합니다!

여러분의 컴퓨터에 이제 이것들이 준비됐어요:

| 도구 | 역할 | 확인 방법 |
|---|---|---|
| ✅ Node.js | 프로그램 실행 엔진 | \`node --version\` |
| ✅ VS Code / Cursor | 코드 편집기 | 프로그램 열기 |
| ✅ Claude Code 또는 Cursor AI | AI 코딩 도우미 | \`claude\` 또는 Cmd+I |
| ✅ Gemini API 키 | AI 서비스 출입증 | "Hello AI" 테스트 성공 |

### 🚀 다음 워크샵 예고

**W01: 나만의 AI 챗봇 만들기** — 이 환경을 이용해서:
1. **마크다운(MD) 레시피 파일** 을 다운로드
2. AI 코딩 도구에 전달
3. AI 가 코드 생성 → 실행 → **진짜 동작하는 챗봇** 완성!

환경만 되면 **30분이면 챗봇이 완성**됩니다. 기대하세요! 🤖

---

### 📋 이 강의에서 만든 키 정리 체크리스트

지금 안전한 곳에 저장돼 있는지 확인:

- [ ] **Gemini 키**: \`AIzaSy...\` — https://aistudio.google.com/apikey
- [ ] **(선택) OpenAI 키**: \`sk-...\` — https://platform.openai.com/api-keys
- [ ] **(선택) Anthropic 키**: \`sk-ant-...\` — https://console.anthropic.com/settings/keys

> 💾 **키 백업 팁**: 메모장 앱의 암호화 메모, 또는 1Password / Bitwarden 같은 비밀번호 관리자에 저장하면 안전해요.`,
    },
  ],

  quiz: {
    title: "W00 — 개발 환경 구축 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "Node.js 의 역할은 무엇인가요?",
        options: [
          "코드를 예쁘게 보여주는 편집기",
          "프로그램을 실행시켜주는 엔진 — 이것 없이는 우리가 만든 코드가 돌아가지 않음",
          "AI 와 대화하는 채팅 프로그램",
          "API 키를 저장하는 금고",
        ],
        correctIndex: 1,
        explanation:
          "Node.js 는 JavaScript/TypeScript 코드를 컴퓨터에서 실행할 수 있게 해주는 런타임(실행 엔진)이에요. 웹 개발·AI 앱 개발의 기본 인프라.",
      },
      {
        type: "multiple-choice",
        question: "Node.js 설치 시 'LTS' 와 'Current' 중 어떤 것을 선택해야 하나요?",
        options: [
          "Current — 항상 최신이 좋으니까",
          "LTS — Long Term Support 의 약자로 더 안정적이고 오래 지원됨",
          "둘 다 설치",
          "아무거나 상관없음",
        ],
        correctIndex: 1,
        explanation:
          "LTS 는 '장기 지원 버전' 으로 버그 수정이 꾸준히 나와요. Current 는 최신 기능이 있지만 불안정할 수 있어 초보자에겐 LTS 가 안전.",
      },
      {
        type: "multiple-choice",
        question: "Claude Code 와 Cursor 의 가장 큰 차이는?",
        options: [
          "Claude Code 는 맥 전용, Cursor 는 윈도우 전용",
          "Claude Code 는 터미널 기반, Cursor 는 VS Code 같은 시각적 편집기 기반",
          "Claude Code 는 무료, Cursor 는 유료만",
          "기능 차이 없음",
        ],
        correctIndex: 1,
        explanation:
          "Claude Code 는 터미널(명령줄)에서 텍스트로 AI 와 대화. Cursor 는 VS Code 처럼 시각적 편집기 안에 AI 가 통합. 취향과 용도에 따라 선택.",
      },
      {
        type: "multiple-choice",
        question: "API 키를 잃어버렸을 때 어떻게 하나요?",
        options: [
          "포기한다",
          "각 서비스의 API 키 페이지에서 기존 키 삭제 후 새로 발급 — 무료로 재발급 가능",
          "고객센터에 전화",
          "다른 사람 키를 빌린다",
        ],
        correctIndex: 1,
        explanation:
          "Gemini/OpenAI/Anthropic 모두 키 관리 페이지에서 언제든 삭제+재발급 가능해요. 키를 잃어버려도 걱정하지 마세요. 단, 유출된 키는 즉시 삭제!",
      },
      {
        type: "multiple-choice",
        question: "'바이브 코딩' 이란 무엇인가요?",
        options: [
          "음악을 들으며 코딩하는 것",
          "AI 에게 만들고 싶은 프로그램을 글로 설명하면 AI 가 코드를 대신 작성해주는 프로그래밍 방식",
          "빠르게 타이핑하는 코딩 기법",
          "특별한 프로그래밍 언어",
        ],
        correctIndex: 1,
        explanation:
          "바이브 코딩 = '감(vibe)으로 코딩'. AI 코딩 도구(Claude Code, Cursor)에 자연어로 원하는 걸 설명하면 AI 가 코드를 생성. 코딩 경험 없이도 프로그램을 만들 수 있어요.",
      },
    ],
  } satisfies Quiz,
};
