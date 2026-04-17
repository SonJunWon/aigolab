import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W12 — 나만의 AI SaaS.
 *
 * Part A: Supabase + Vercel 핵심 개념 체험 (LLM 셀)
 * Part B: MD 레시피로 AI SaaS 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW12: Lesson = {
  id: "ai-eng-w12-ai-saas",
  language: "ai-engineering",
  track: "beginner",
  order: 112,
  title: "W12: 나만의 AI SaaS",
  subtitle: "Supabase + Vercel로 진짜 서비스 배포하기",
  estimatedMinutes: 180,
  cells: [
    {
      type: "markdown",
      source: `# 🚀 나만의 AI SaaS 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**회원가입 → 로그인 → AI 기능 사용 → 하루 20회 무료 제한** 이 있는 진짜 ==SaaS== 웹서비스를 만들고, 인터넷에 배포합니다.

### 완성 모습
\`\`\`
┌──────────────────────────────────────┐
│  🚀 AI Writer — 나만의 AI 서비스      │
├──────────────────────────────────────┤
│                                      │
│  📧 이메일  [user@example.com      ] │
│  🔑 비밀번호 [••••••••             ] │
│  [로그인]  아직 계정이 없나요? 회원가입  │
│                                      │
├──────────────────────────────────────┤
│         ↓ 로그인 성공 후 ↓            │
├──────────────────────────────────────┤
│                                      │
│  👋 안녕하세요, user@example.com!     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 오늘 사용량: ████████░░ 16/20  │  │
│  │ 남은 횟수:  4회                 │  │
│  └────────────────────────────────┘  │
│                                      │
│  💬 AI 에게 물어보세요:               │
│  ┌────────────────────────────────┐  │
│  │ 블로그 글 주제를 추천해줘        │  │
│  └────────────────────────────────┘  │
│  [✨ 생성하기]                        │
│                                      │
├──────────────────────────────────────┤
│  🌐 배포 완료!                        │
│  https://my-ai-saas.vercel.app       │
└──────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | Supabase + 배포 핵심 개념 체험 | 60분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 AI SaaS 완성 & 배포 | 120분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **Part B 전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)`,
    },

    // ─── Part A: Supabase + Vercel 핵심 개념 ───
    {
      type: "markdown",
      source: `## Part A: Supabase + 배포 핵심 개념 체험 (60분)

지금까지 만든 앱들은 "내 컴퓨터에서만" 돌아갔어요.
진짜 서비스(==SaaS==)를 만들려면 3가지가 더 필요해요:

1. **인증** — 누가 쓰고 있는지 알아야 함 (회원가입/로그인)
2. **데이터 저장** — 사용량 기록을 서버에 저장
3. **배포** — 인터넷에 올려서 누구나 접속하게

==Supabase== 가 1번과 2번을, Vercel 이 3번을 해결해줍니다!`,
    },

    {
      type: "markdown",
      source: `### A-1. Supabase 이해하기 — 백엔드 없이 백엔드 만들기

==Supabase== 는 **오픈소스 Firebase 대안**이에요.
쉽게 말해, 서버를 직접 만들지 않아도 **데이터베이스 + 인증 + API** 를 바로 쓸 수 있는 서비스입니다.

\`\`\`
기존 방식:                   Supabase 방식:
프론트엔드                    프론트엔드
    ↓                             ↓
백엔드 서버 (직접 개발)        Supabase (자동 제공)
    ↓                             ↓
데이터베이스 (직접 설치)       PostgreSQL (자동 생성)
\`\`\`

데이터를 저장하고 불러오는 걸 AI 에게 시뮬레이션해봅시다!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-1: Supabase 개념 — 데이터 저장과 조회를 이해하자
// (실제 Supabase 코드와 동일한 패턴을 AI 가 시뮬레이션합니다)

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 Supabase 시뮬레이터야. 사용자가 데이터 작업을 요청하면,
실제 Supabase JavaScript SDK 코드를 보여주고,
그 코드가 실행되면 어떤 결과가 나올지 JSON 으로 시뮬레이션해줘.

형식:
📝 코드:
\\\`\\\`\\\`typescript
// Supabase SDK 코드
\\\`\\\`\\\`

📊 실행 결과 (시뮬레이션):
\\\`\\\`\\\`json
{ ... }
\\\`\\\`\\\`

💡 설명: (중학생이 이해할 수 있게)

모든 텍스트는 한국어로.\`,
    },
    {
      role: "user",
      content: \`Supabase 에 "usage_logs" 테이블이 있어.
컬럼: id, user_id, action, created_at

1. user_id="user_123" 으로 새 사용 기록 3개를 넣어줘 (action: "chat", "translate", "chat")
2. 그 다음, user_123 의 오늘 사용 기록을 전부 조회해줘
3. 총 몇 번 사용했는지 세어줘\`,
    },
  ],
});

console.log("🗄️ Supabase 데이터 작업 시뮬레이션:\\n");
console.log(response.text);`,
      hints: [
        "supabase.from('테이블명').insert([...]) 로 데이터를 넣어요.",
        "supabase.from('테이블명').select('*').eq('컬럼', 값) 으로 조회해요.",
        "실제 Supabase 는 PostgreSQL 데이터베이스를 사용합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 인증 흐름 이해 — 로그인은 어떻게 동작할까?

"로그인" 은 단순히 비밀번호를 확인하는 게 아니에요.
서버가 **토큰(token)** 이라는 "출입증" 을 발급해주는 거예요.

\`\`\`
1. [사용자] → 이메일+비밀번호 전송 → [Supabase Auth]
2. [Supabase Auth] → 비밀번호 확인 → 맞으면 토큰 발급
3. [사용자] → 매 요청마다 토큰 첨부 → [서버: "아, user_123 이구나"]
\`\`\`

==Supabase== 가 이 복잡한 과정을 딱 2줄 코드로 만들어줍니다!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-2: 인증 흐름 — 회원가입 → 로그인 → 토큰 확인
const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 인증(Authentication) 교육 AI 야.
Supabase Auth 를 사용한 인증 흐름을 단계별로 설명해줘.

각 단계마다:
1. 실제 Supabase 코드 (TypeScript)
2. 서버에서 일어나는 일 (비유로 설명)
3. 반환되는 데이터 (시뮬레이션 JSON)

중학생이 이해할 수 있게, 비유를 많이 써줘.
토큰을 "놀이공원 팔찌" 에 비유하면 좋겠어.\`,
    },
    {
      role: "user",
      content: \`아래 3단계를 순서대로 설명해줘:

1단계: 회원가입 (email: "student@test.com", password: "mypassword123")
   - supabase.auth.signUp() 코드
   - 비밀번호는 어떻게 저장되는지 (해시)

2단계: 로그인
   - supabase.auth.signInWithPassword() 코드
   - 토큰(JWT)이 뭔지, 어떻게 생겼는지

3단계: 현재 로그인한 사용자 확인
   - supabase.auth.getUser() 코드
   - 보호된 페이지에서 토큰을 어떻게 쓰는지\`,
    },
  ],
});

console.log("🔐 인증 흐름 이해하기:\\n");
console.log(response.text);`,
      hints: [
        "비밀번호는 절대 그대로 저장하지 않아요. '해시(hash)' 라는 암호화를 거칩니다.",
        "JWT 토큰은 '놀이공원 팔찌' 같은 거예요 — 한 번 발급받으면 매번 입장권 안 보여줘도 돼요.",
        "supabase.auth.getUser() 로 '지금 로그인한 사람이 누구인지' 확인할 수 있어요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 사용량 제한 설계 — 무료 티어는 하루 20번!

==SaaS== 에서 ==rate limiting== 은 필수예요. 무료 사용자가 하루에 API 를 10,000번 호출하면 서버 비용이 폭발하거든요 💸

핵심 아이디어:
1. 사용자가 AI 기능을 쓸 때마다 **DB 에 기록**
2. 오늘 날짜로 **몇 번 썼는지 세기**
3. 20번 넘으면 → **"오늘 무료 사용량을 초과했습니다"**`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-3: 사용량 제한(Rate Limiting) 시스템 설계
const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 SaaS 설계 전문 AI 야.
사용량 제한(rate limiting) 시스템을 설계해줘.

다음 형식으로 답해:

📊 테이블 설계:
\\\`\\\`\\\`sql
CREATE TABLE ...
\\\`\\\`\\\`

📝 사용량 체크 로직 (TypeScript + Supabase):
\\\`\\\`\\\`typescript
// 코드
\\\`\\\`\\\`

🔄 전체 흐름도:
(ASCII 그림)

💡 중학생에게 설명하듯 쉽게.\`,
    },
    {
      role: "user",
      content: \`무료 사용자는 하루 20번까지 AI 기능을 쓸 수 있는 시스템을 설계해줘.

요구사항:
- Supabase (PostgreSQL) 사용
- usage_logs 테이블: user_id, action, created_at
- "오늘 몇 번 썼는지" 세는 쿼리
- 20번 넘으면 차단하는 로직
- "남은 횟수" 를 사용자에게 보여주는 코드
- 자정이 되면 자동으로 리셋 (날짜 기준)

보너스: 유료 플랜이면 제한 없는 로직도 추가해줘.\`,
    },
  ],
});

console.log("⏱️ 사용량 제한 시스템 설계:\\n");
console.log(response.text);`,
      hints: [
        "WHERE created_at >= '오늘 00:00' 으로 오늘 사용량만 셀 수 있어요.",
        "프론트엔드에서 API 호출 전에 남은 횟수를 먼저 체크하면 UX 가 좋아져요.",
        "실제 SaaS 는 무료/유료 플랜별로 제한 횟수가 달라요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-4. 배포 파이프라인 — GitHub 에 올리면 자동으로 배포!

코드를 인터넷에 공개하는 과정은 이렇게 간단해요:

\`\`\`
[내 컴퓨터]  →  git push  →  [GitHub 저장소]
                                    ↓ (자동 감지)
[사용자 접속] ← https://~.vercel.app ← [Vercel 빌드 & 배포]
\`\`\`

==환경변수== 는 코드에 넣으면 안 되고, Vercel 대시보드에서 따로 설정해요!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-4: GitHub → Vercel 자동 배포 파이프라인 이해
const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 DevOps 교육 AI 야.
GitHub + Vercel 배포 파이프라인을 단계별로 설명해줘.

각 단계를 이렇게 설명해:
1. 🖥️ 어디서 하는 작업인지
2. 📝 실행할 명령어 또는 클릭할 버튼
3. 🔍 뒤에서 무슨 일이 일어나는지
4. ✅ 결과

환경변수(VITE_SUPABASE_URL 등) 설정도 꼭 포함해.
중학생이 이해할 수 있게 설명해줘.\`,
    },
    {
      role: "user",
      content: \`React + Vite 프로젝트를 GitHub → Vercel 로 배포하는 전체 과정을 알려줘.

포함할 내용:
1. GitHub 저장소 만들기 + 코드 올리기 (git init, git push)
2. Vercel 에서 GitHub 연결하기
3. 환경변수 설정하기:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_GEMINI_API_KEY
4. 자동 배포 확인 (커밋할 때마다 자동 업데이트)
5. 커스텀 도메인 연결 (선택사항)

환경변수를 코드에 하드코딩하면 안 되는 이유도 설명해줘.\`,
    },
  ],
});

console.log("🌐 GitHub → Vercel 배포 파이프라인:\\n");
console.log(response.text);`,
      hints: [
        "Vercel 은 GitHub 저장소를 연결하면, push 할 때마다 자동으로 빌드+배포해줘요.",
        "==환경변수== 는 코드에 넣으면 GitHub 에 비밀번호가 공개돼요! Vercel 설정에서 따로 입력하세요.",
        "VITE_ 로 시작하는 환경변수만 프론트엔드에서 접근 가능해요 (Vite 규칙).",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

AI ==SaaS== 의 핵심 개념을 모두 체험했어요:
- ✅ ==Supabase== 로 데이터 저장/조회 (SQL + SDK)
- ✅ 인증 흐름 (회원가입 → 로그인 → 토큰)
- ✅ ==rate limiting== 설계 (하루 20회 무료 제한)
- ✅ GitHub → Vercel 자동 배포 파이프라인

이제 Part B 에서 **진짜 동작하는 AI SaaS 를 만들고 인터넷에 배포** 합니다!

> 💡 Part B 의 핵심: Supabase Auth + 사용량 추적 DB + Gemini AI + Vercel 배포

---

## Part B: MD 레시피로 AI SaaS 완성 (120분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [완성된 AI SaaS]
                                                    ↓
                                            [GitHub push]
                                                    ↓
                                            [Vercel 자동 배포]
                                                    ↓
                                        https://my-ai-saas.vercel.app 🎉
\`\`\`

아래의 **MD 레시피** 를 복사해서 AI 코딩 도구에 전달하면 됩니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# 나만의 AI SaaS 웹앱 제작 요청서

## 프로젝트 개요
회원가입/로그인 기능이 있고, 로그인한 사용자가 AI 텍스트 생성 기능을
하루 20회까지 무료로 사용할 수 있는 SaaS 웹서비스를 만들어주세요.
Supabase 로 인증과 데이터를 관리하고, Vercel 로 배포합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @supabase/supabase-js (인증 + 데이터베이스)
- @google/genai (Gemini SDK — AI 기능)

## Supabase 테이블 설정 (SQL)

프로젝트 시작 전, Supabase SQL Editor 에서 아래를 실행해주세요:

\\\`\\\`\\\`sql
-- 사용량 기록 테이블
CREATE TABLE usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL DEFAULT 'chat',
  prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 사용량 조회를 위한 인덱스
CREATE INDEX idx_usage_logs_user_date
  ON usage_logs (user_id, created_at DESC);

-- Row Level Security 활성화
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- 본인 기록만 읽기/쓰기 가능
CREATE POLICY "Users can read own logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자 프로필 테이블 (관리자 구분용)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 회원가입 시 자동으로 프로필 생성하는 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
\\\`\\\`\\\`

## 기능 요구사항

### 1. 인증 (Supabase Auth)
- 이메일/비밀번호 회원가입
  - 이메일 형식 검증
  - 비밀번호 최소 6자 검증
  - 가입 성공 시 자동 로그인
- 이메일/비밀번호 로그인
  - 로그인 실패 시 에러 메시지 ("이메일 또는 비밀번호가 틀렸습니다")
  - 로딩 스피너 표시
- 로그아웃 버튼 (헤더 우측)
- 보호된 라우트: 로그인 안 한 사용자는 로그인 페이지로 리다이렉트
- 세션 유지: 새로고침해도 로그인 상태 유지

### 2. 사용자 대시보드
- 헤더: "👋 안녕하세요, {이메일}!" 인사말
- 오늘 사용량 프로그레스 바:
  - "오늘 사용량: ████████░░ 16/20"
  - 20% 이하: 초록색 / 50~80%: 노란색 / 80% 이상: 빨간색
- 남은 횟수 크게 표시
- 최근 사용 기록 목록 (최신 5개, 시각 + 프롬프트 미리보기)

### 3. AI 기능 (핵심 SaaS 기능)
- 텍스트 생성 챗봇:
  - 큰 텍스트 입력창 (placeholder: "AI 에게 물어보세요...")
  - [✨ 생성하기] 버튼
  - 생성 중 로딩 애니메이션 (타이핑 효과)
  - AI 응답을 카드 형태로 표시
  - 응답 복사 버튼
- 빠른 프리셋 버튼들:
  - "📝 블로그 글 작성" / "💡 아이디어 브레인스토밍" / "📧 이메일 작성" / "🔄 텍스트 요약"
  - 클릭하면 해당 프롬프트 템플릿이 입력창에 자동 입력
- Gemini 2.5 Flash 사용

### 4. 사용량 추적 (Supabase DB)
- AI 기능 호출할 때마다 usage_logs 테이블에 기록:
  - user_id: 현재 로그인 사용자
  - action: "chat"
  - prompt: 사용자 입력 (처음 100자만)
  - created_at: 자동 (now())
- 사용량 조회 쿼리:
  - 오늘 날짜 (한국 시간 KST 기준) 의 레코드 수 카운트
  - 대시보드에 실시간 반영

### 5. 사용량 제한 (Rate Limiting)
- 무료 티어: 하루 20회
- AI 기능 호출 전 사용량 체크:
  - 20회 미만 → 정상 실행 + 카운트 증가
  - 20회 이상 → 차단 + "사용량 초과" 페이지로 이동
- "사용량 초과" 페이지:
  - 🚫 큰 아이콘
  - "오늘 무료 사용량(20회)을 초과했습니다"
  - "내일 자정에 초기화됩니다"
  - 오늘 사용 기록 요약 표시
  - [대시보드로 돌아가기] 버튼

### 6. 관리자 통계 (Admin)
- profiles 테이블에서 role="admin" 인 사용자만 접근
- 관리자 대시보드:
  - 총 가입 사용자 수
  - 오늘 총 API 호출 수 (전체 사용자)
  - 최근 가입 사용자 목록 (최신 10명)
- 관리자 계정은 Supabase 대시보드에서 직접 role 변경

### 7. 환경변수 가이드
- .env.local 파일:
  \\\`\\\`\\\`
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
  VITE_GEMINI_API_KEY=AIzaSy...
  \\\`\\\`\\\`
- 각 키를 어디서 발급받는지 주석으로 설명:
  - Supabase: 프로젝트 Settings → API
  - Gemini: https://aistudio.google.com/apikey
- .gitignore 에 .env.local 반드시 포함

### 8. Vercel 배포 안내
- README.md 에 배포 가이드 포함:
  1. GitHub 에 코드 push
  2. vercel.com 에서 Import Project
  3. Environment Variables 에 3개 키 입력
  4. Deploy 클릭
  5. 완료! https://프로젝트명.vercel.app

### 9. 다크/라이트 모드
- 다크 모드 기본 (배경: #0f172a, 카드: #1e293b, 텍스트: #e2e8f0)
- 라이트 모드 (배경: #f8fafc, 카드: white, 텍스트: #1e293b)
- 🌙/☀️ 토글 버튼 (헤더)
- localStorage 로 선호 모드 저장

### 10. 반응형 디자인
- 모바일: 단일 컬럼, 터치 친화적 버튼
- 데스크탑: 사이드바 + 메인 영역

## 프로젝트 구조
\\\`\\\`\\\`
src/
├── lib/
│   └── supabase.ts          # Supabase 클라이언트 초기화
├── components/
│   ├── Auth.tsx              # 로그인/회원가입 폼
│   ├── Dashboard.tsx         # 사용자 대시보드
│   ├── ChatInterface.tsx     # AI 채팅 UI
│   ├── UsageBar.tsx          # 사용량 프로그레스 바
│   ├── UsageExceeded.tsx     # 사용량 초과 페이지
│   ├── AdminStats.tsx        # 관리자 통계
│   ├── Header.tsx            # 헤더 (로그아웃, 다크모드 토글)
│   └── ProtectedRoute.tsx    # 로그인 필수 래퍼
├── hooks/
│   ├── useAuth.ts            # 인증 상태 관리
│   └── useUsage.ts           # 사용량 조회/체크
├── App.tsx
└── main.tsx
\\\`\\\`\\\`

## 실행 방법
npm install → .env.local 설정 → npm run dev → localhost:5173

## 주의사항
- API 키를 소스 코드에 절대 하드코딩하지 마세요
- .env.local 은 .gitignore 에 반드시 포함
- 모든 텍스트는 한국어로
- Supabase RLS(Row Level Security) 반드시 활성화
- TypeScript strict 모드
- 비밀번호는 Supabase 가 자동으로 해시 처리 (직접 저장 X)
\`\`\`

---

### 사전 준비 — Supabase 프로젝트 만들기

**Part B 를 시작하기 전에** 아래 작업을 먼저 해주세요:

1. [supabase.com](https://supabase.com) 에서 무료 계정 생성
2. "New Project" → 프로젝트 이름 입력 → 리전 "Northeast Asia (Seoul)" 선택
3. 프로젝트 생성 완료 후 → **Settings → API** 에서:
   - \`Project URL\` → 이것이 \`VITE_SUPABASE_URL\`
   - \`anon public\` 키 → 이것이 \`VITE_SUPABASE_ANON_KEY\`
4. **SQL Editor** 에서 위 MD 레시피의 SQL 코드 실행
5. [aistudio.google.com/apikey](https://aistudio.google.com/apikey) 에서 Gemini API 키 발급

### 사용 방법

**🅰️ Claude Code 사용자:**
\`\`\`bash
mkdir my-ai-saas && cd my-ai-saas
claude
# 위 마크다운 전체를 붙여넣기
# Claude 가 파일 생성 제안 → Accept
# claude 에서 나온 후:
npm install
# .env.local 파일에 3개 키 입력
npm run dev
\`\`\`

**🅱️ Cursor 사용자:**
1. 새 폴더 열기 → 터미널에서 \`npm init -y\`
2. **Cmd+I** → 위 마크다운 붙여넣기
3. Cursor 가 생성한 파일들 승인
4. 터미널: \`npm install && npm run dev\`
5. \`.env.local\` 파일에 3개 키 입력

### 💡 커스텀 팁
- "유료 플랜 결제 (Stripe) 추가해줘" → 실제 SaaS 수익 모델!
- "Google 소셜 로그인 추가해줘" → supabase.auth.signInWithOAuth()
- "사용량 리포트 이메일 발송 기능 추가해줘" → Edge Functions
- "다국어 지원 (영어/한국어) 추가해줘" → i18n

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 AI SaaS 가 완성되면 MD 레시피에 아래를 추가해서 AI 에게 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 사용 기록 CSV 내보내기 |
| ⭐ | 프로필 페이지 (닉네임, 프로필 이미지) |
| ⭐⭐ | Google 소셜 로그인 |
| ⭐⭐ | 유료 플랜 (Stripe 결제 연동) |
| ⭐⭐⭐ | 실시간 관리자 대시보드 (Supabase Realtime) |
| ⭐⭐⭐ | 커스텀 도메인 + SEO 최적화 |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**

## ✅ W12 완료!

- ✅ Part A: ==Supabase== 데이터 관리 → 인증 흐름 → ==rate limiting== 설계 → 배포 파이프라인
- ✅ Part B: MD 레시피 → AI ==SaaS== 웹앱 완성 (인증 + AI + 사용량 제한 + Vercel 배포)
- ✅ 도전: AI 에게 기능 추가 요청

### 다음 워크샵 예고
**W13: AI 블로그 플랫폼** — AI 가 글을 써주고, SEO 최적화하고, 자동으로 발행하는 블로그 플랫폼을 만듭니다. 마크다운 에디터 + AI 어시스턴트 + 자동 태그 생성까지!`,
    },
  ],

  quiz: {
    title: "W12 — 나만의 AI SaaS 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "Supabase 의 RLS(Row Level Security) 가 하는 역할은 무엇인가요?",
        options: [
          "데이터베이스 속도를 빠르게 하는 캐시 기능",
          "각 사용자가 자기 데이터만 읽고 쓸 수 있도록 제한하는 보안 규칙",
          "테이블을 자동으로 백업하는 기능",
          "SQL 문법 오류를 자동으로 수정하는 기능",
        ],
        correctIndex: 1,
        explanation:
          "RLS (Row Level Security) 는 '행(row) 수준 보안' 이에요. 예를 들어 user_id 가 본인인 데이터만 조회/수정할 수 있게 해서, 다른 사용자의 데이터를 볼 수 없게 합니다.",
      },
      {
        type: "multiple-choice",
        question:
          "SaaS 에서 무료 사용자의 하루 API 호출을 20회로 제한하려면 어떻게 해야 할까요?",
        options: [
          "프론트엔드 JavaScript 변수에 카운터를 저장한다",
          "매 호출 시 DB 에 기록하고, 오늘 날짜 기준으로 호출 수를 세어 20회 초과 시 차단한다",
          "API 키를 하루에 20번만 사용할 수 있게 설정한다",
          "사용자 비밀번호를 20자 이상으로 제한한다",
        ],
        correctIndex: 1,
        explanation:
          "프론트엔드 변수는 새로고침하면 초기화되고 조작도 가능해요. 서버(DB) 에 기록하고 서버에서 체크해야 확실한 제한이 됩니다. usage_logs 테이블에 매 호출을 기록하고, 오늘 날짜로 COUNT 하는 방식이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "Vercel 에 배포할 때 환경변수(VITE_SUPABASE_URL 등) 를 설정하는 올바른 방법은?",
        options: [
          "코드 파일 안에 직접 문자열로 넣는다",
          "GitHub README 에 키 값을 적어둔다",
          "Vercel 대시보드의 Environment Variables 설정에서 입력한다",
          "package.json 의 scripts 에 키를 넣는다",
        ],
        correctIndex: 2,
        explanation:
          "환경변수(API 키, DB URL 등) 를 코드나 GitHub 에 넣으면 전 세계에 공개돼요! Vercel 대시보드에서 따로 설정하면 서버에서만 안전하게 관리됩니다. .env.local 은 로컬 개발용이고, .gitignore 에 포함시켜야 해요.",
      },
    ],
  } satisfies Quiz,
};
