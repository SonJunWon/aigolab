import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W13 — AI 블로그 플랫폼.
 *
 * Part A: AI 글 생성, 댓글 감정 필터, 추천 태그/SEO 체험 (LLM 셀)
 * Part B: MD 레시피로 Supabase 기반 블로그 플랫폼 완성 (Claude Code / Cursor)
 */
export const workshopW13: Lesson = {
  id: "ai-eng-w13-blog-platform",
  language: "ai-engineering",
  track: "beginner",
  order: 113,
  title: "W13: AI 블로그 플랫폼",
  subtitle: "AI가 글을 쓰고 Supabase가 저장하는 나만의 블로그",
  estimatedMinutes: 180,
  cells: [
    {
      type: "markdown",
      source: `# 📰 AI 블로그 플랫폼 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**AI 가 블로그 글을 작성하고, ==Supabase== 가 저장·공개하며, 댓글과 좋아요까지 갖춘 풀스택 블로그 플랫폼** — W08 에서 만든 AI 글 생성 에이전트를 진짜 블로그 서비스로 확장합니다.

### 완성 모습
\`\`\`
┌──────────────────────────────────────────────┐
│  📰 AI Blog Platform            🌙  [로그인] │
├──────────────────────────────────────────────┤
│  태그: [전체] [AI] [개발] [디자인] [생산성]    │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 🤖 GPT vs Claude: 2026년 비교 가이드   │  │
│  │ AI 모델을 선택하는 건 늘 고민이죠...    │  │
│  │ 🏷️ #AI #비교 #가이드   ⏱️ 5분 읽기     │  │
│  │ ❤️ 12  💬 3         2026-04-17          │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ ✍️ 바이브 코딩으로 사이드 프로젝트 시작  │  │
│  │ 코드를 직접 안 짜도 앱을 만들 수 있어... │  │
│  │ 🏷️ #바이브코딩 #생산성  ⏱️ 3분 읽기     │  │
│  │ ❤️ 8   💬 1         2026-04-16          │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [✨ AI 로 새 글 쓰기]                        │
└──────────────────────────────────────────────┘

    ↓ 글 클릭 시

┌──────────────────────────────────────────────┐
│  ← 목록으로     📰 AI Blog Platform    🌙    │
├──────────────────────────────────────────────┤
│                                              │
│  # GPT vs Claude: 2026년 비교 가이드          │
│  🏷️ #AI #비교 #가이드   ⏱️ 5분 읽기          │
│  작성: 2026-04-17  |  ❤️ 12 [좋아요]         │
│                                              │
│  ## 서론                                     │
│  프론트엔드 개발자라면 AI 모델 선택이...       │
│  ...                                         │
│  ## 결론                                     │
│  두 모델 모두 훌륭하지만...                    │
│                                              │
│  ── 💬 댓글 3개 ──                            │
│  🧑 홍길동: 좋은 비교 감사합니다! (1시간 전)   │
│  🧑 김영희: Claude 가 더 좋다고 생각해요 (30분)│
│  ┌──────────────────────────────────┐        │
│  │ 댓글을 입력하세요...              │        │
│  └──────────────────────────────────┘        │
│  [💬 댓글 달기]                               │
└──────────────────────────────────────────────┘

    ↓ "AI 로 새 글 쓰기" 클릭 시

┌──────────────────────────────────────────────┐
│  ✨ AI 블로그 글 작성                    [✕]  │
├──────────────────────────────────────────────┤
│                                              │
│  주제: [바이브 코딩의 미래          ]         │
│  톤:   [전문적 ▾]   독자: [개발자 ▾]         │
│                                              │
│  [✨ AI 글 생성]                              │
│                                              │
│  ── 마크다운 에디터 ──                        │
│  ┌────────────────┬─────────────────┐        │
│  │ # 바이브 코딩의  │ 바이브 코딩의    │        │
│  │ 미래             │ 미래             │        │
│  │                  │                  │        │
│  │ ## 서론          │ 서론             │        │
│  │ 바이브 코딩이란..│ 바이브 코딩이란..│        │
│  │   (편집)         │   (미리보기)     │        │
│  └────────────────┴─────────────────┘        │
│                                              │
│  [📤 블로그에 발행]                           │
└──────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | AI 글 생성 + 댓글 필터 + SEO 체험 | 60분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 풀스택 블로그 완성 | 120분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **Part B 전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)

### W08 → W13 진화

W08 에서 AI 블로그 **작성기** 를 만들었죠? 이번엔 그걸 **진짜 블로그 서비스** 로 업그레이드해요:

| W08 블로그 작성기 | W13 블로그 플랫폼 |
|---|---|
| AI 가 글을 생성 | AI 가 글을 생성 + 댓글 검열 + SEO 최적화 |
| localStorage 에 저장 | ==Supabase== ==데이터베이스== 에 저장 |
| 내 컴퓨터에서만 보임 | 공개 URL 로 누구나 읽기 가능 |
| 댓글/좋아요 없음 | ==실시간== 댓글 + 좋아요 |
| 로그인 없음 | ==인증== (Supabase Auth) |

> 💡 **핵심**: 로컬 도구 → 풀스택 서비스로 진화하는 과정이 이 워크샵의 핵심이에요!`,
    },

    // ─── Part A: AI 블로그 기능 체험 ───
    {
      type: "markdown",
      source: `## Part A: AI 블로그 기능 체험 (60분)

블로그 플랫폼에 필요한 3가지 AI 기능을 하나씩 만들어볼게요:

1. **AI 글 생성** — 주제를 주면 제목, 본문, 발췌문, 태그, 읽기 시간까지 한 번에
2. **댓글 감정 필터** — 악성 댓글을 AI 가 자동으로 걸러내기
3. **AI 추천 태그 + SEO** — 글에 맞는 태그와 검색 엔진 최적화 메타 생성`,
    },

    {
      type: "markdown",
      source: `### A-1. 📝 AI 글 생성 + 메타데이터

W08 에서는 조사→집필→편집 3단계였지만, 이번엔 **한 번의 호출로 구조화된 블로그 포스트 전체** 를 생성해요.
핵심은 ==구조화된 출력== — AI 에게 JSON 형식으로 답하라고 지시하는 거예요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-1: AI 블로그 포스트 생성 — 제목, 본문, 발췌문, 태그, 읽기 시간까지
const topic = "초보자를 위한 바이브 코딩 입문";
const tone = "친근한";
const audience = "비개발자";

const postResponse = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 전문 블로그 작가 AI 야. 주제를 받으면 완전한 블로그 포스트를 생성해.

반드시 아래 JSON 형식으로만 답해 (마크다운 코드블록 없이 순수 JSON):

{
  "title": "매력적인 블로그 제목",
  "slug": "url-friendly-slug-in-english",
  "excerpt": "2-3문장 발췌문 (목록에서 미리보기용)",
  "tags": ["태그1", "태그2", "태그3"],
  "readingTimeMinutes": 5,
  "body": "## 서론\\n본문 마크다운...\\n## 본론\\n...\\n## 결론\\n..."
}

규칙:
- 본문(body)은 마크다운 형식, 서론/본론/결론 구조
- 톤과 독자에 맞게 어휘 수준 조절
- slug 는 영문 소문자 + 하이픈
- readingTimeMinutes 는 글자 수 / 500 으로 추정
- 태그는 3-5개, 한국어\`,
    },
    {
      role: "user",
      content: \`주제: \${topic}\\n톤: \${tone}\\n독자: \${audience}\`,
    },
  ],
});

// JSON 파싱
let post;
try {
  post = JSON.parse(postResponse.text);
} catch {
  // JSON 블록으로 감싸진 경우 처리
  const jsonMatch = postResponse.text.match(/\\{[\\s\\S]*\\}/);
  post = JSON.parse(jsonMatch![0]);
}

console.log("📰 생성된 블로그 포스트");
console.log("─".repeat(40));
console.log("제목:", post.title);
console.log("슬러그:", post.slug);
console.log("발췌문:", post.excerpt);
console.log("태그:", post.tags.join(", "));
console.log("읽기 시간:", post.readingTimeMinutes + "분");
console.log("─".repeat(40));
console.log("\\n📄 본문 미리보기:\\n");
console.log(post.body.slice(0, 300) + "...");`,
      hints: [
        "AI 에게 JSON 형식으로 답하라고 하면 프로그래밍으로 바로 활용할 수 있어요 — 이게 ==구조화된 출력==!",
        "slug 는 URL 에 사용할 수 있는 영문 소문자 + 하이픈 형태예요 (예: /blog/vibe-coding-intro).",
        "readingTimeMinutes 로 '5분 읽기' 같은 정보를 목록에 표시할 수 있어요.",
        "topic, tone, audience 를 바꿔서 다양한 글을 생성해보세요!",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 🛡️ 댓글 감정 필터 — AI 모더레이션

블로그에 악성 댓글이 달리면 곤란하죠? AI 가 댓글을 분석해서 **게시 가능 여부를 판단** 해요.
이걸 ==콘텐츠 모더레이션== 이라고 합니다 — 커뮤니티를 건강하게 유지하는 핵심 기능이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-2: 댓글 감정 필터 — 악성 댓글 자동 검열
const testComments = [
  "정말 유익한 글이네요! 많이 배웠습니다 😊",
  "이 글 완전 쓰레기, 쓴 사람 바보 아님?",
  "좋은 내용이지만 두 번째 섹션에 오류가 있는 것 같아요. 확인 부탁드립니다.",
  "홍보 링크: 돈 벌고 싶으면 여기 클릭 → spam.example.com",
  "다른 관점도 있을 수 있지만, 잘 정리해주셨어요.",
];

console.log("🛡️ 댓글 감정 필터 테스트");
console.log("═".repeat(50));

for (const comment of testComments) {
  const filterResult = await chat({
    provider: "gemini",
    messages: [
      {
        role: "system",
        content: \`너는 블로그 댓글 모더레이터 AI 야. 댓글을 분석해서 게시 가능 여부를 판단해.

반드시 아래 JSON 형식으로만 답해 (마크다운 코드블록 없이 순수 JSON):

{
  "approved": true/false,
  "sentiment": "positive" | "negative" | "neutral",
  "reason": "판단 이유 한 줄",
  "toxicityScore": 0.0~1.0,
  "category": "normal" | "spam" | "hate" | "harassment" | "inappropriate"
}

기준:
- toxicityScore 0.7 이상이면 approved: false
- 스팸 링크가 포함되면 approved: false, category: "spam"
- 욕설/비하 표현이 있으면 approved: false, category: "hate" 또는 "harassment"
- 건설적 비판은 approved: true (비판 ≠ 악성)\`,
      },
      {
        role: "user",
        content: comment,
      },
    ],
  });

  let result;
  try {
    result = JSON.parse(filterResult.text);
  } catch {
    const jsonMatch = filterResult.text.match(/\\{[\\s\\S]*\\}/);
    result = JSON.parse(jsonMatch![0]);
  }

  const icon = result.approved ? "✅" : "🚫";
  const sentimentEmoji =
    result.sentiment === "positive" ? "😊" :
    result.sentiment === "negative" ? "😠" : "😐";

  console.log(\`\\n\${icon} \${sentimentEmoji} [\${result.category}] 독성: \${result.toxicityScore}\`);
  console.log(\`   댓글: "\${comment.slice(0, 40)}..."\`);
  console.log(\`   이유: \${result.reason}\`);
  console.log("─".repeat(50));
}`,
      hints: [
        "==콘텐츠 모더레이션== 은 댓글, 리뷰 등 사용자 콘텐츠를 자동으로 검사하는 기능이에요.",
        "toxicityScore 로 수치화하면 '0.5 이상은 관리자 검토' 같은 정책을 만들 수 있어요.",
        "건설적 비판(세 번째 댓글)은 통과시키는 게 중요해요 — 비판 ≠ 악성!",
        "Part B 에서 이 필터가 댓글 작성 API 에 자동으로 연결돼요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 🏷️ AI 추천 태그 + SEO 메타

블로그 글을 발행할 때 태그와 ==SEO== 메타 설명을 직접 쓰기 귀찮죠?
AI 가 글 내용을 분석해서 자동으로 추천해줍니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-3: AI 추천 태그 + SEO 메타 생성
const blogContent = \`# 바이브 코딩으로 사이드 프로젝트 시작하기

## 서론
코드를 직접 짜지 않아도 앱을 만들 수 있는 시대가 왔습니다.
바이브 코딩이란 AI 에게 자연어로 설명하면 코드를 생성해주는 새로운 개발 방식이에요.

## 바이브 코딩이란?
2025년부터 Claude, Cursor 같은 AI 도구가 폭발적으로 성장하면서,
프로그래밍 경험이 없는 사람도 아이디어만으로 웹앱을 만들 수 있게 되었습니다.
핵심은 "대화하듯 앱을 만든다" 는 거예요.

## 시작하는 방법
1. Claude Code 또는 Cursor 설치
2. 프로젝트 아이디어를 자연어로 설명
3. AI 가 생성한 코드를 실행하고 피드백
4. 반복하며 앱을 키워가기

## 결론
바이브 코딩은 비개발자도 사이드 프로젝트를 시작할 수 있는 강력한 도구입니다.\`;

const seoResponse = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 블로그 SEO 전문가 AI 야. 블로그 글을 분석해서 태그와 SEO 메타데이터를 생성해.

반드시 아래 JSON 형식으로만 답해 (마크다운 코드블록 없이 순수 JSON):

{
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
  "metaDescription": "검색 엔진에 표시될 150자 이내 설명",
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "ogTitle": "소셜 미디어 공유 시 표시될 제목 (60자 이내)",
  "ogDescription": "소셜 미디어 공유 시 표시될 설명 (100자 이내)",
  "suggestedSlug": "url-friendly-slug",
  "readability": {
    "level": "쉬움" | "보통" | "어려움",
    "suggestion": "가독성 개선 제안 한 줄"
  }
}

규칙:
- 태그는 글 내용에서 핵심 주제 추출, 한국어, 5개
- metaDescription 은 검색 결과에 보이는 요약 (클릭 유도)
- keywords 는 영문 SEO 키워드
- 가독성 분석도 포함\`,
    },
    {
      role: "user",
      content: blogContent,
    },
  ],
});

let seo;
try {
  seo = JSON.parse(seoResponse.text);
} catch {
  const jsonMatch = seoResponse.text.match(/\\{[\\s\\S]*\\}/);
  seo = JSON.parse(jsonMatch![0]);
}

console.log("🏷️ AI 추천 태그 + SEO 메타");
console.log("═".repeat(50));
console.log("\\n📌 추천 태그:", seo.tags.join(" | "));
console.log("\\n🔍 SEO 메타 설명:");
console.log("  ", seo.metaDescription);
console.log("\\n🔑 키워드:", seo.keywords.join(", "));
console.log("\\n🔗 OG 제목:", seo.ogTitle);
console.log("📱 OG 설명:", seo.ogDescription);
console.log("🌐 추천 슬러그:", seo.suggestedSlug);
console.log("\\n📖 가독성:", seo.readability.level);
console.log("   제안:", seo.readability.suggestion);`,
      hints: [
        "==SEO== (Search Engine Optimization)는 구글 같은 검색 엔진에서 글이 잘 찾아지도록 최적화하는 거예요.",
        "metaDescription 은 구글 검색 결과에서 제목 아래에 표시되는 설명이에요.",
        "OG (Open Graph) 태그는 카카오톡, 트위터 등에서 링크를 공유할 때 미리보기에 사용돼요.",
        "Part B 에서는 글을 발행할 때 이 SEO 메타가 자동으로 HTML head 에 들어가요.",
      ],
    },

    // ─── Part A 완료 + Part B 시작 ───
    {
      type: "markdown",
      source: `## ✅ Part A 완료!

블로그 플랫폼에 필요한 3가지 AI 기능을 체험했어요:
- ✅ 📝 AI 글 생성 — ==구조화된 출력== 으로 제목/본문/태그/읽기시간 한 번에 생성
- ✅ 🛡️ 댓글 감정 필터 — ==콘텐츠 모더레이션== 으로 악성 댓글 자동 차단
- ✅ 🏷️ 추천 태그 + SEO — 검색 엔진 최적화 메타 데이터 자동 생성

> 💡 **핵심 교훈**: AI 에게 JSON 형식으로 답하라고 하면 프로그래밍에서 바로 활용할 수 있어요. 이게 ==구조화된 출력== 의 힘!

---

## Part B: MD 레시피로 풀스택 블로그 완성 (120분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [완성된 AI 블로그 플랫폼]
\`\`\`

### ⚠️ Supabase 준비 (Part B 전에 필요!)

이번 워크샵은 ==Supabase== (==BaaS==)를 사용해요. 무료 계정이 필요합니다:

1. [supabase.com](https://supabase.com) 접속 → **Start your project** (GitHub 로그인)
2. **New Project** 생성 (이름: \`ai-blog\`, 비밀번호 설정, 지역: Northeast Asia)
3. 프로젝트 대시보드에서 **Project URL** 과 **anon key** 복사
4. 이 두 값을 MD 레시피의 환경 변수에 넣을 거예요

아래의 **MD 레시피** 를 복사해서 AI 코딩 도구에 전달하면 됩니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 블로그 플랫폼 웹앱 제작 요청서

## 프로젝트 개요
AI 가 블로그 글을 작성하고, Supabase 에 저장하며,
공개 URL 로 누구나 읽고 댓글/좋아요를 남길 수 있는 풀스택 블로그 플랫폼.
Google Gemini 2.5 Flash API + Supabase 를 사용합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini SDK)
- @supabase/supabase-js (Supabase 클라이언트)
- react-router-dom (라우팅)
- react-markdown + remark-gfm (마크다운 렌더링)
- react-split-pane 또는 직접 구현 (에디터/미리보기 분할)

## Supabase 데이터베이스 설정

아래 SQL 을 Supabase SQL Editor 에서 실행해주세요:

\\\`\\\`\\\`sql
-- 사용자 프로필 (auth.users 확장)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default 'Anonymous',
  avatar_url text,
  created_at timestamptz default now()
);

-- 블로그 포스트
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  body text not null,
  tags text[] default '{}',
  reading_time_minutes int default 1,
  meta_description text default '',
  og_title text default '',
  og_description text default '',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 댓글
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  sentiment text default 'neutral',
  approved boolean default true,
  created_at timestamptz default now()
);

-- 좋아요
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- 좋아요 개수 뷰
create or replace view public.post_like_counts as
select post_id, count(*) as like_count
from public.likes
group by post_id;

-- 댓글 개수 뷰
create or replace view public.post_comment_counts as
select post_id, count(*) as comment_count
from public.comments
where approved = true
group by post_id;

-- RLS (Row Level Security) 정책
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

-- profiles: 누구나 읽기, 본인만 수정
create policy "profiles: anyone read" on public.profiles for select using (true);
create policy "profiles: owner update" on public.profiles for update using (auth.uid() = id);
create policy "profiles: insert on signup" on public.profiles for insert with check (auth.uid() = id);

-- posts: 공개 글 누구나 읽기, 작성자만 CRUD
create policy "posts: anyone read published" on public.posts for select using (published = true or auth.uid() = author_id);
create policy "posts: author insert" on public.posts for insert with check (auth.uid() = author_id);
create policy "posts: author update" on public.posts for update using (auth.uid() = author_id);
create policy "posts: author delete" on public.posts for delete using (auth.uid() = author_id);

-- comments: 누구나 읽기, 로그인 사용자 작성, 본인 삭제
create policy "comments: anyone read" on public.comments for select using (approved = true);
create policy "comments: auth insert" on public.comments for insert with check (auth.uid() = author_id);
create policy "comments: owner delete" on public.comments for delete using (auth.uid() = author_id);

-- likes: 누구나 읽기, 로그인 사용자 토글
create policy "likes: anyone read" on public.likes for select using (true);
create policy "likes: auth insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes: owner delete" on public.likes for delete using (auth.uid() = user_id);

-- Realtime 활성화
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.likes;

-- 프로필 자동 생성 함수 (회원가입 시)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Anonymous'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
\\\`\\\`\\\`

## 기능 요구사항

### 1. 인증 (Supabase Auth)
- 이메일/비밀번호 회원가입 + 로그인
- 로그인 상태면 우상단에 프로필명 + [로그아웃]
- 비로그인 시 글 읽기만 가능 (댓글/좋아요/작성 불가)

### 2. 블로그 목록 페이지 (/)
- 발행된(published) 포스트 목록을 카드 형태로 표시
- 각 카드: 제목, 발췌문, 태그, 읽기 시간, 좋아요 수, 댓글 수, 작성일
- 상단 태그 필터 바: [전체] + 사용된 태그 목록, 클릭하면 해당 태그만 필터
- 카드 클릭 시 글 상세 페이지로 이동
- 우하단 FAB: [✨ AI 로 새 글 쓰기] (로그인 시만 표시)

### 3. 글 상세 페이지 (/blog/:slug)
- 포스트 제목, 태그, 읽기 시간, 작성일
- 마크다운 렌더링된 본문 (react-markdown)
- 좋아요 버튼: ❤️ + 개수, 클릭하면 토글 (로그인 필요)
- 댓글 섹션 (아래쪽):
  - 댓글 목록 (작성자명, 내용, 시간)
  - Supabase Realtime 으로 새 댓글 실시간 반영
  - 댓글 입력란 + [💬 댓글 달기] 버튼 (로그인 필요)
  - 댓글 작성 시 AI 감정 필터 자동 적용:
    - toxicityScore 0.7 이상이면 "부적절한 댓글입니다" 알림, 저장 안 함
    - 통과하면 Supabase 에 저장
- SEO: head 에 meta description, og:title, og:description 설정

### 4. AI 글 작성 페이지 (/write) — 로그인 필요
- 주제 입력, 톤 선택, 독자 선택
- [✨ AI 글 생성] 버튼 → AI 가 JSON 으로 포스트 생성
- 생성 결과를 마크다운 에디터에 로드
- 좌우 분할: 마크다운 에디터(좌) + 실시간 미리보기(우)
- 태그 자동 추천 (AI SEO 기능), 사용자가 수정 가능
- [📤 발행] 버튼: Supabase 에 저장 + 목록 페이지로 이동
- [📝 임시 저장] 버튼: published=false 로 저장

### 5. 내 글 관리 (/my-posts) — 로그인 필요
- 내가 작성한 글 목록 (발행 + 임시 저장 구분)
- 각 글: [수정] [삭제] [발행/비공개 토글]

### 6. 다크/라이트 모드
- 🌙/☀️ 토글 버튼
- 다크 모드 기본 (배경: slate-900 계열)
- localStorage 에 설정 저장

### 7. 반응형 디자인
- 모바일: 카드 1열, 에디터/미리보기 탭 전환
- 데스크탑: 카드 2열, 에디터/미리보기 좌우 분할

### 8. API 키 관리
- Gemini API 키: 설정 모달에서 입력, localStorage 저장
- Supabase URL + anon key: .env 파일 (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

## 환경 변수 (.env)
\\\`\\\`\\\`
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
\\\`\\\`\\\`

GEMINI_API_KEY 는 런타임에 사용자가 입력 (하드코딩 금지)

## 라우팅 구조
- / → 블로그 목록
- /blog/:slug → 글 상세
- /write → AI 글 작성 (로그인 필요)
- /my-posts → 내 글 관리 (로그인 필요)
- /login → 로그인/회원가입

## 실행 방법
npm install → .env 설정 → npm run dev → localhost:5173 에서 확인

## 주의사항
- API 키를 소스 코드에 절대 하드코딩하지 마세요
- 모든 텍스트는 한국어로
- Supabase RLS 정책이 핵심 — 보안은 서버에서
- 댓글 AI 필터는 클라이언트에서 호출하되, 차단 로그는 console.warn
- TypeScript strict 모드
- 에러 핸들링: Supabase/AI 호출 실패 시 사용자 친화적 메시지
\`\`\`

---

### 사용 방법

**🅰️ Claude Code 사용자:**
\`\`\`bash
mkdir ai-blog-platform && cd ai-blog-platform
claude
# 위 마크다운 전체를 붙여넣기
# Claude 가 파일 생성 제안 → Accept
# claude 에서 나온 후:
npm install
# .env 파일에 Supabase URL + anon key 입력
# Supabase SQL Editor 에서 위 SQL 실행
npm run dev
\`\`\`

**🅱️ Cursor 사용자:**
1. 새 폴더 열기 → 터미널에서 \`npm init -y\`
2. **Cmd+I** → 위 마크다운 붙여넣기
3. Cursor 가 생성한 파일들 승인
4. \`.env\` 파일 생성 + Supabase 정보 입력
5. Supabase SQL Editor 에서 위 SQL 실행
6. 터미널: \`npm install && npm run dev\`

### 💡 커스텀 팁
- "이미지 업로드 기능 (Supabase Storage)" 추가 요청 가능
- "마크다운에 코드 하이라이팅 (Prism.js)" 추가 가능
- "RSS 피드 생성" 으로 블로그 구독 기능 추가
- "구글 Analytics 연동" 으로 방문 통계 추가
- "다국어 번역 (W03 번역기 연동)" 으로 글 자동 번역

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 블로그 플랫폼이 완성되면 MD 레시피에 아래를 추가해서 AI 에게 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 포스트 검색 기능 (제목 + 본문 풀텍스트 검색) |
| ⭐ | 인기 글 정렬 (좋아요 순, 댓글 순, 최신 순) |
| ⭐⭐ | 블로그 포스트 시리즈 기능 (1편, 2편, 3편 연결) |
| ⭐⭐ | Supabase Storage 로 포스트 썸네일 이미지 업로드 |
| ⭐⭐ | RSS 피드 자동 생성 (/rss.xml) |
| ⭐⭐⭐ | AI 가 댓글에 자동 답글 작성 (블로그 주인 설정 시) |
| ⭐⭐⭐ | 커스텀 도메인 연결 + Vercel 배포 가이드 |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**`,
    },

    {
      type: "markdown",
      source: `## ✅ W13 완료!

- ✅ Part A: AI 블로그 기능 체험 (글 생성 + 댓글 필터 + SEO)
- ✅ Part B: MD 레시피 → Supabase 기반 풀스택 블로그 플랫폼 완성
- ✅ 도전: AI 에게 기능 추가 요청

### 이번에 배운 핵심 개념

| 개념 | 설명 |
|---|---|
| ==구조화된 출력== | AI 에게 JSON 등 정해진 형식으로 답하게 해서 프로그래밍에서 바로 활용하는 기법 |
| ==콘텐츠 모더레이션== | AI 가 사용자 콘텐츠(댓글, 리뷰 등)를 자동으로 검사해서 부적절한 내용을 차단하는 것 |
| ==SEO== | 검색 엔진 최적화 — 구글 등에서 내 글이 잘 검색되도록 메타데이터를 설정하는 것 |
| ==BaaS== | Backend as a Service — Supabase 처럼 서버 코드 없이 DB, 인증, 실시간 기능을 제공하는 서비스 |
| ==RLS== | Row Level Security — 데이터베이스 행 단위로 "누가 읽고/쓸 수 있는지" 를 제어하는 보안 정책 |

### W08 → W13 성장 체크

\`\`\`
W08 블로그 작성기          W13 블로그 플랫폼
─────────────────          ─────────────────
로컬 도구                → 풀스택 서비스
localStorage             → Supabase DB
혼자 보는 글             → 공개 URL (/blog/:slug)
글 생성만                → 생성 + 모더레이션 + SEO
인증 없음                → 이메일 로그인
댓글 없음                → 실시간 댓글 + AI 필터
좋아요 없음              → 좋아요 토글
\`\`\`

### 다음 워크샵 예고
**W14: AI 코드 리뷰어** — 코드를 붙여넣으면 AI 가 버그, 보안 취약점, 개선점을 분석하고
리뷰 코멘트를 달아주는 도구를 만듭니다. GitHub PR 리뷰 스타일의 인라인 코멘트가 핵심이에요!`,
    },
  ],

  quiz: {
    title: "W13 — AI 블로그 플랫폼 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "AI 에게 JSON 형식으로 답하라고 지시하는 이유는 무엇인가요?",
        options: [
          "JSON 이 마크다운보다 예쁘게 보여서",
          "AI 응답을 프로그래밍에서 바로 파싱하고 활용할 수 있어서",
          "JSON 으로 답하면 AI 가 더 정확한 답을 만들어서",
          "Supabase 가 JSON 만 저장할 수 있어서",
        ],
        correctIndex: 1,
        explanation:
          "구조화된 출력(Structured Output)의 핵심은 AI 응답을 JSON.parse() 로 바로 파싱해서 title, tags, body 같은 필드를 프로그래밍에서 직접 활용할 수 있다는 점이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "댓글 AI 감정 필터에서 '건설적 비판' 댓글은 어떻게 처리해야 하나요?",
        options: [
          "비판이니까 무조건 차단",
          "toxicityScore 와 관계없이 모두 통과",
          "비판 ≠ 악성이므로, toxicityScore 가 낮으면 통과시킴",
          "관리자가 수동으로 검토",
        ],
        correctIndex: 2,
        explanation:
          "건설적 비판은 커뮤니티에 유익하므로 차단하면 안 돼요. AI 필터는 toxicityScore 기준으로 판단하고, '오류가 있는 것 같아요' 같은 정중한 비판은 독성 점수가 낮아 통과됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "Supabase RLS(Row Level Security)에서 'posts: anyone read published' 정책의 역할은?",
        options: [
          "관리자만 모든 글을 읽을 수 있음",
          "로그인한 사용자만 글을 읽을 수 있음",
          "발행된(published=true) 글은 누구나 읽을 수 있고, 미발행 글은 작성자만 볼 수 있음",
          "모든 글을 아무나 읽고 수정할 수 있음",
        ],
        correctIndex: 2,
        explanation:
          "RLS 정책 'published = true or auth.uid() = author_id' 는 공개 글은 누구나, 임시 저장(비공개) 글은 작성자만 볼 수 있도록 행 단위 보안을 적용하는 거예요.",
      },
    ],
  } satisfies Quiz,
};
