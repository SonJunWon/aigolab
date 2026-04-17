import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W39 — AI 커뮤니티 플랫폼.
 *
 * Part A: 콘텐츠 모더레이션·추천 피드·사용자 관심사 프로파일링을 LLM 으로 체험 (LLM 셀)
 * Part B: MD 레시피로 게시판 + 댓글 + 팔로우 + AI 모더레이션 + 실시간 알림 완성 (Claude Code / Cursor)
 */
export const workshopW39: Lesson = {
  id: "ai-eng-w39-community-platform",
  language: "ai-engineering",
  track: "beginner",
  order: 139,
  title: "W39: AI 커뮤니티 플랫폼",
  subtitle: "AI 모더레이션 + 추천 피드가 있는 커뮤니티",
  estimatedMinutes: 240,
  cells: [
    {
      type: "markdown",
      source: `# 🏘️ AI 커뮤니티 플랫폼 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**게시글·댓글·좋아요·팔로우 기능이 있는 커뮤니티에, AI 가 유해 콘텐츠를 자동 차단하고, 사용자 관심사를 분석해서 맞춤형 피드를 추천하는 플랫폼** — 글을 쓰면 AI 가 먼저 검수하고, 피드를 열면 내 취향에 맞는 글이 위에 올라옵니다.

### 완성 모습
\`\`\`
┌─ AI Community ─────────────────────────────────────────────┐
│  🏘️ 커뮤니티       [🏠 피드]  [🔥 인기]  [👤 MY]  🌙 다크  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🤖 AI 추천 피드                      🔍 검색 · 태그 필터   │
│  ┌──────────────────────────────────────────────────┐      │
│  │ 👤 김서연 · @seoyeon · 3시간 전                   │      │
│  │ 📌 [React] [TypeScript]                          │      │
│  │                                                  │      │
│  │ React 19 의 새로운 use() 훅이 정말 편리하네요!    │      │
│  │ 서버 컴포넌트에서 데이터 패칭이 훨씬 깔끔해       │      │
│  │ 졌습니다. 간단한 예제 공유합니다...               │      │
│  │                                                  │      │
│  │ ❤️ 42  💬 12  🔖 8         [댓글 보기]             │      │
│  └──────────────────────────────────────────────────┘      │
│                                                            │
│  ┌──────────────────────────────────────────────────┐      │
│  │ 👤 이준혁 · @junhyuk · 5시간 전                   │      │
│  │ 📌 [AI] [Python]                                 │      │
│  │                                                  │      │
│  │ LangChain vs LlamaIndex 비교 정리했어요.          │      │
│  │ RAG 파이프라인 구축 시 각각의 장단점...           │      │
│  │                                                  │      │
│  │ ❤️ 67  💬 23  🔖 15        [댓글 보기]             │      │
│  └──────────────────────────────────────────────────┘      │
│                                                            │
├──── 💬 댓글 섹션 ──────────────────────────────────────────┤
│  │ 👤 박민수 · 2시간 전                              │      │
│  │   LangChain 은 체이닝이 직관적이고, LlamaIndex   │      │
│  │   는 인덱싱이 강력하죠. 저는 둘 다 씁니다 😄     │      │
│  │   ❤️ 5  [답글]                                    │      │
│  │                                                  │      │
│  │   ↳ 👤 이준혁 · 1시간 전                         │      │
│  │     맞아요! 프로젝트 성격에 따라 선택하면 돼요    │      │
│  │     ❤️ 2  [답글]                                  │      │
│                                                            │
├──── 👤 프로필 ─────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐      │
│  │  🖼️ 김서연                                       │      │
│  │  @seoyeon · 가입 2026.01                         │      │
│  │  "풀스택 개발자 지망생 🚀"                        │      │
│  │                                                  │      │
│  │  📝 게시글 28   👥 팔로워 142   👤 팔로잉 85      │      │
│  │  🏷️ 관심: React, TypeScript, AI, Python          │      │
│  │                                                  │      │
│  │  [팔로우]  [메시지]                               │      │
│  └──────────────────────────────────────────────────┘      │
│                                                            │
├──── 🛡️ AI 모더레이션 (관리자) ─────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐      │
│  │ 📊 오늘 통계                                     │      │
│  │ ✅ 승인: 156건  ⚠️ 경고: 8건  🚫 차단: 3건       │      │
│  │                                                  │      │
│  │ ⚠️ 검토 대기                                      │      │
│  │ #1082 "..." — 혐오 표현 감지 (신뢰도 87%)        │      │
│  │   [✅ 승인]  [⚠️ 경고 후 게시]  [🚫 차단]         │      │
│  └──────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 콘텐츠 모더레이션 + 추천 알고리즘 + 관심사 프로파일링 | 80분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 풀스택 커뮤니티 플랫폼 완성 | 160분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - ==Supabase== 프로젝트 생성 경험 (W02+ 에서 사용했다면 OK)`,
    },

    // ─── Part A: AI 모더레이션 & 추천 엔진 ───
    {
      type: "markdown",
      source: `## Part A: AI 모더레이션 & 추천 엔진 (80분)

커뮤니티 플랫폼의 핵심은 **건강한 환경을 유지**하면서 **사용자가 원하는 콘텐츠를 빠르게 발견**하게 하는 거예요.

핵심 개념 3가지:
1. **콘텐츠 모더레이션** — 유해 콘텐츠(혐오·스팸·폭력)를 AI 가 자동 감지하고 분류
2. **스마트 콘텐츠 추천** — 사용자 행동(좋아요·댓글·읽은 글)을 분석해서 관심 글 추천
3. **사용자 관심사 프로파일링** — 활동 이력으로 관심 분야·전문 수준을 자동 파악

> 📌 **==콘텐츠 모더레이션== 이란?** — 사용자가 올리는 글·댓글이 커뮤니티 규칙을 지키는지 검사하는 과정이에요. 사람이 일일이 확인하면 느리고 힘드니까, AI 가 먼저 걸러주고 사람은 애매한 건만 판단합니다. Reddit, YouTube, 네이버 카페 모두 이 시스템을 쓰고 있어요.`,
    },

    {
      type: "markdown",
      source: `### A-1. 콘텐츠 모더레이션 — 유해 콘텐츠 자동 감지

사용자가 글을 작성하면 **게시 전에** AI 가 내용을 분석합니다. ==독성(toxicity)== 수치를 측정하고, 혐오 표현·스팸·개인정보 노출 등을 감지해서 자동 승인 / 경고 후 게시 / 차단 중 하나로 분류해요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 콘텐츠 모더레이션 — 게시글 유해도 분석 + 자동 판정
const postsToReview = [
  {
    id: "p-001",
    author: "dev_kim",
    title: "React 19 새 기능 정리",
    content: "React 19에서 use() 훅이 추가됐어요. 서버 컴포넌트에서 프로미스를 직접 읽을 수 있습니다. 간단한 예제를 공유합니다.",
    tags: ["react", "javascript"],
  },
  {
    id: "p-002",
    author: "troll_99",
    title: "이런 코드 짜는 사람은 개발 접어라",
    content: "이딴 식으로 코드 짜는 놈들은 진짜 머리가 나쁜 거 아닌가? 프로그래밍 하지 마라 제발. 수준이 바닥이야.",
    tags: ["rant"],
  },
  {
    id: "p-003",
    author: "helpful_lee",
    title: "면접 준비 꿀팁 공유",
    content: "연락처: 010-1234-5678, 이메일: lee@example.com 으로 연락 주시면 무료 멘토링 해드립니다. 이력서도 첨부합니다.",
    tags: ["career"],
  },
];

const systemPrompt = \`너는 커뮤니티 콘텐츠 안전 전문가야.
게시글 배열을 분석해서 각 글의 유해도를 판정해.

[분석 항목]
- toxicity: 전체 유해도 (0.0 ~ 1.0)
- categories: 해당되는 유해 카테고리
  - hate_speech: 혐오 표현, 차별, 비하
  - harassment: 괴롭힘, 인신공격, 모욕
  - spam: 광고, 낚시, 도배
  - pii_exposure: 개인정보 노출 (전화번호, 이메일, 주소)
  - violence: 폭력, 위협
  - sexual: 성적 콘텐츠
  - none: 문제 없음

[판정 기준]
- toxicity < 0.3 → "approved" (자동 승인)
- 0.3 ≤ toxicity < 0.7 → "warn" (경고 후 게시, 관리자 검토)
- toxicity ≥ 0.7 → "blocked" (자동 차단)

[응답 형식 — JSON]
{
  "reviews": [
    {
      "postId": "p-001",
      "toxicity": 0.05,
      "categories": ["none"],
      "verdict": "approved",
      "reason": "판정 사유",
      "suggestion": "작성자에게 보낼 메시지 (차단/경고 시)"
    }
  ],
  "summary": {
    "total": 3,
    "approved": 1,
    "warned": 1,
    "blocked": 1
  }
}

[규칙]
- pii_exposure 는 toxicity 와 별개로 반드시 감지 (연락처, 이메일 등)
- 기술 비판과 인신공격을 구분 ("이 코드는 비효율적" vs "이런 코드 짜는 놈은")
- suggestion 은 건설적이고 친절하게
- 한국어로 작성\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 게시글들을 검토해줘:\\n\\\${JSON.stringify(postsToReview, null, 2)}\` },
  ],
});

try {
  const result = JSON.parse(res.text);
  console.log("🛡️ AI 모더레이션 결과");
  console.log("═".repeat(50));

  const icons: Record<string, string> = {
    approved: "✅",
    warn: "⚠️",
    blocked: "🚫",
  };

  result.reviews?.forEach((r: any) => {
    const post = postsToReview.find((p) => p.id === r.postId);
    console.log(\`\\n\\\${icons[r.verdict] || "❓"} [\\\${r.verdict.toUpperCase()}] \\\${post?.title}\`);
    console.log(\`   작성자: \\\${post?.author}\`);
    console.log(\`   독성 수치: \\\${(r.toxicity * 100).toFixed(0)}%\`);
    console.log(\`   카테고리: \\\${r.categories?.join(", ")}\`);
    console.log(\`   사유: \\\${r.reason}\`);
    if (r.suggestion) {
      console.log(\`   💬 안내: \\\${r.suggestion}\`);
    }
  });

  const s = result.summary;
  if (s) {
    console.log("\\n📊 요약");
    console.log(\`   전체: \\\${s.total}건 | ✅ \\\${s.approved} | ⚠️ \\\${s.warned} | 🚫 \\\${s.blocked}\`);
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: AI 가 게시 전에 글을 검수해서 유해 콘텐츠를 자동 차단해요.",
        "toxicity 수치는 0~1 사이 실수 — 0.7 이상이면 자동 차단, 0.3~0.7 은 관리자 검토예요.",
        "개인정보(PII) 노출은 독성과 별개로 항상 감지해야 해요 — 전화번호, 이메일, 주소 등.",
        "실무에서는 Perspective API, OpenAI Moderation API 같은 전용 서비스를 병행합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 스마트 콘텐츠 추천 — 사용자 활동 → 맞춤 피드

사용자가 어떤 글에 좋아요를 누르고, 어떤 태그의 글을 자주 읽고, 어떤 댓글을 달았는지 분석하면 **관심 있을 만한 새 글**을 추천할 수 있어요. ==협업 필터링==과 ==콘텐츠 기반 필터링==을 AI 가 결합합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 스마트 콘텐츠 추천 — 사용자 활동 분석 → 맞춤 피드 순위
const userActivity = {
  userId: "user-kim",
  displayName: "김서연",
  recentLikes: [
    { postId: "p-101", tags: ["react", "typescript"], category: "tutorial" },
    { postId: "p-102", tags: ["nextjs", "react"], category: "tip" },
    { postId: "p-103", tags: ["ai", "langchain"], category: "tutorial" },
    { postId: "p-104", tags: ["typescript", "design-pattern"], category: "discussion" },
    { postId: "p-105", tags: ["react", "testing"], category: "tutorial" },
  ],
  recentComments: [
    { postId: "p-201", tags: ["react", "performance"], sentiment: "positive" },
    { postId: "p-202", tags: ["ai", "rag"], sentiment: "curious" },
  ],
  bookmarks: [
    { postId: "p-301", tags: ["career", "interview"], category: "guide" },
    { postId: "p-302", tags: ["typescript", "advanced"], category: "tutorial" },
  ],
  following: ["user-lee", "user-park", "user-choi"],
};

const candidatePosts = [
  { id: "c-01", title: "React Server Components 실전 가이드", tags: ["react", "nextjs", "rsc"], author: "user-lee", category: "tutorial", likes: 89 },
  { id: "c-02", title: "Python 데코레이터 완벽 정리", tags: ["python", "advanced"], author: "user-new", category: "tutorial", likes: 45 },
  { id: "c-03", title: "TypeScript 5.5 새 기능 총정리", tags: ["typescript", "news"], author: "user-park", category: "tip", likes: 123 },
  { id: "c-04", title: "AI 에이전트 아키텍처 비교", tags: ["ai", "agent", "langchain"], author: "user-choi", category: "discussion", likes: 67 },
  { id: "c-05", title: "Docker 입문 가이드", tags: ["docker", "devops"], author: "user-new2", category: "tutorial", likes: 34 },
  { id: "c-06", title: "React Testing Library 실전 팁", tags: ["react", "testing", "jest"], author: "user-lee", category: "tip", likes: 56 },
];

const systemPrompt = \`너는 커뮤니티 피드 추천 전문가야.
사용자 활동 데이터와 후보 게시글 목록을 분석해서 개인화 피드를 만들어.

[추천 기준 — 가중치]
1. 태그 관련성 (40%) — 사용자가 좋아요/댓글/북마크한 글의 태그와 얼마나 겹치는지
2. 팔로잉 작성자 (25%) — 팔로우한 사람의 글 우선
3. 카테고리 선호 (20%) — 자주 소비하는 카테고리(tutorial, tip, discussion) 우선
4. 인기도 (15%) — 좋아요 수 반영 (너무 과하지 않게)

[응답 형식 — JSON]
{
  "userId": "user-kim",
  "recommendedFeed": [
    {
      "postId": "c-01",
      "title": "게시글 제목",
      "score": 0.92,
      "reasons": ["태그 react·nextjs 관심 높음", "팔로우 중인 user-lee 작성"],
      "tagMatch": ["react", "nextjs"],
      "isFollowingAuthor": true
    }
  ],
  "userProfile": {
    "topInterests": ["react", "typescript", "ai"],
    "preferredCategory": "tutorial",
    "activityLevel": "active"
  }
}

[규칙]
- score 는 0.0 ~ 1.0 사이, 높을수록 추천도 높음
- 모든 후보를 score 내림차순으로 정렬
- reasons 는 한국어로 추천 사유 2~3개
- tagMatch 는 사용자 관심 태그와 겹치는 태그만
- 한국어로 작성\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: \`사용자 활동:\\n\\\${JSON.stringify(userActivity, null, 2)}\\n\\n후보 게시글:\\n\\\${JSON.stringify(candidatePosts, null, 2)}\`,
    },
  ],
});

try {
  const result = JSON.parse(res.text);
  console.log("🤖 AI 추천 피드 결과");
  console.log("═".repeat(50));
  console.log(\`👤 \\\${userActivity.displayName} 님 맞춤 피드\\n\`);

  result.recommendedFeed?.forEach((r: any, i: number) => {
    const medal = ["🥇", "🥈", "🥉"][i] || \`\\\${i + 1}.\`;
    const follow = r.isFollowingAuthor ? " 👥" : "";
    console.log(\`\\\${medal} [\\\${(r.score * 100).toFixed(0)}점] \\\${r.title}\\\${follow}\`);
    console.log(\`   🏷️ 매칭 태그: \\\${r.tagMatch?.join(", ") || "없음"}\`);
    r.reasons?.forEach((reason: string) => {
      console.log(\`   💡 \\\${reason}\`);
    });
  });

  const profile = result.userProfile;
  if (profile) {
    console.log("\\n📊 사용자 프로필 요약");
    console.log(\`   🎯 관심사: \\\${profile.topInterests?.join(", ")}\`);
    console.log(\`   📂 선호 카테고리: \\\${profile.preferredCategory}\`);
    console.log(\`   📈 활동 수준: \\\${profile.activityLevel}\`);
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 좋아요·댓글·북마크 데이터로 사용자 관심사를 파악하고, 후보 글에 점수를 매겨요.",
        "==협업 필터링== 은 '비슷한 사용자가 좋아한 것' 기반, ==콘텐츠 기반 필터링== 은 '같은 태그/카테고리' 기반이에요.",
        "팔로우 중인 작성자의 글은 가중치를 높여서 소셜 연결을 강화해요.",
        "실무에서는 추천 결과를 캐싱하고, 클릭률(CTR)을 측정해서 모델을 개선합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 사용자 관심사 프로파일링 — 활동 이력 → 전문 분야 분석

사용자의 **전체 활동 이력**(작성한 글·댓글·좋아요·팔로우)을 종합 분석하면 관심 분야·전문 수준·활동 패턴을 파악할 수 있어요. 이 프로필은 추천 피드뿐 아니라 **"비슷한 관심사를 가진 사람" 추천**, **뱃지 부여**, **맞춤 알림** 등에도 쓰입니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 사용자 관심사 프로파일링 — 활동 이력 → 전문 분야 + 뱃지 + 추천 사용자
const userHistory = {
  userId: "user-kim",
  displayName: "김서연",
  joinedAt: "2026-01-15",
  posts: [
    { title: "React 커스텀 훅 5가지 패턴", tags: ["react", "hooks"], likes: 89, comments: 15 },
    { title: "TypeScript 제네릭 실전 활용법", tags: ["typescript", "advanced"], likes: 134, comments: 28 },
    { title: "AI 챗봇 만들면서 배운 것들", tags: ["ai", "chatbot", "react"], likes: 67, comments: 22 },
    { title: "Zustand vs Jotai 상태관리 비교", tags: ["react", "state-management"], likes: 98, comments: 19 },
    { title: "Next.js 14 App Router 마이그레이션 후기", tags: ["nextjs", "react"], likes: 156, comments: 31 },
  ],
  commentedTopics: ["react", "typescript", "ai", "nextjs", "testing", "career"],
  likedTags: {
    react: 45, typescript: 38, ai: 22, nextjs: 18,
    python: 8, docker: 5, career: 12, testing: 15,
  },
  followers: 142,
  following: 85,
};

const communityUsers = [
  { userId: "user-lee", displayName: "이준혁", topTags: ["ai", "python", "langchain"], followers: 230 },
  { userId: "user-park", displayName: "박민수", topTags: ["react", "typescript", "nextjs"], followers: 189 },
  { userId: "user-choi", displayName: "최하은", topTags: ["react", "testing", "cypress"], followers: 95 },
  { userId: "user-jung", displayName: "정태윤", topTags: ["devops", "docker", "kubernetes"], followers: 167 },
  { userId: "user-han", displayName: "한소희", topTags: ["typescript", "design-pattern", "ddd"], followers: 112 },
];

const systemPrompt = \`너는 커뮤니티 사용자 분석 전문가야.
사용자의 활동 이력을 종합 분석해서 관심사 프로필을 만들어.

[응답 형식 — JSON]
{
  "profile": {
    "userId": "user-kim",
    "displayName": "김서연",
    "expertiseLevel": "intermediate | advanced | expert",
    "primaryDomain": "주 분야",
    "interests": [
      { "topic": "react", "level": "expert", "confidence": 0.95 },
      { "topic": "typescript", "level": "advanced", "confidence": 0.88 }
    ],
    "activitySummary": "활동 요약 (2~3문장)",
    "strengths": ["강점1", "강점2"],
    "badges": [
      { "name": "뱃지명", "icon": "이모지", "reason": "부여 사유" }
    ]
  },
  "recommendations": {
    "usersToFollow": [
      {
        "userId": "user-id",
        "displayName": "이름",
        "reason": "추천 사유",
        "commonInterests": ["공통 관심사"]
      }
    ],
    "topicsToExplore": ["새로 탐구할 주제"],
    "growthTip": "성장 조언 (1~2문장)"
  }
}

[규칙]
- interests 는 confidence 내림차순, 최대 6개
- confidence 는 게시글 수 + 좋아요 수 + 댓글 활동을 종합
- badges 는 최대 3개, 실제 데이터 기반으로만 (과장 금지)
- usersToFollow 는 communityUsers 중에서 관심사 겹치는 사람만
- 한국어로 작성\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: \`사용자 이력:\\n\\\${JSON.stringify(userHistory, null, 2)}\\n\\n커뮤니티 사용자:\\n\\\${JSON.stringify(communityUsers, null, 2)}\`,
    },
  ],
});

try {
  const result = JSON.parse(res.text);
  const p = result.profile;
  console.log("👤 사용자 프로필 분석");
  console.log("═".repeat(50));
  console.log(\`🧑‍💻 \\\${p.displayName} (@\\\${p.userId})\`);
  console.log(\`📈 전문 수준: \\\${p.expertiseLevel}\`);
  console.log(\`🎯 주 분야: \\\${p.primaryDomain}\`);
  console.log(\`📝 \\\${p.activitySummary}\`);

  console.log("\\n🏷️ 관심사 분석:");
  p.interests?.forEach((interest: any) => {
    const bar = "█".repeat(Math.round(interest.confidence * 10)) + "░".repeat(10 - Math.round(interest.confidence * 10));
    console.log(\`   \\\${interest.topic.padEnd(18)} [\\\${bar}] \\\${(interest.confidence * 100).toFixed(0)}% · \\\${interest.level}\`);
  });

  console.log("\\n💪 강점:", p.strengths?.join(" · "));

  console.log("\\n🏅 뱃지:");
  p.badges?.forEach((b: any) => {
    console.log(\`   \\\${b.icon} \\\${b.name} — \\\${b.reason}\`);
  });

  const rec = result.recommendations;
  if (rec) {
    console.log("\\n👥 추천 팔로우:");
    rec.usersToFollow?.forEach((u: any) => {
      console.log(\`   👤 \\\${u.displayName} — \\\${u.reason}\`);
      console.log(\`      공통: \\\${u.commonInterests?.join(", ")}\`);
    });

    console.log("\\n🌱 탐구 추천:", rec.topicsToExplore?.join(", "));
    console.log("💡 성장 팁:", rec.growthTip);
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 게시글·댓글·좋아요를 종합 분석해서 사용자의 관심사와 전문 수준을 파악해요.",
        "confidence 수치는 활동량(게시글 수 + 좋아요 수 + 댓글)을 기반으로 산출해요.",
        "뱃지 시스템은 사용자 동기부여에 매우 효과적 — 활동을 유도하는 ==게이미피케이션== 전략이에요.",
        "실무에서는 이 프로필을 주기적으로 갱신하고, '비슷한 관심사' 추천에 활용합니다.",
      ],
    },

    // ─── Part B: 풀스택 구현 레시피 ───
    {
      type: "markdown",
      source: `## Part B: AI 커뮤니티 플랫폼 만들기 (160분)

> 🛠️ Part B 는 Claude Code 또는 Cursor 에서 아래 ==프롬프트==를 사용해 만들어요.
> 코드를 직접 입력하는 게 아니라, AI 에게 지시해서 프로젝트를 생성합니다.

---

### 🔧 기술 스택

| 영역 | 기술 | 역할 |
|---|---|---|
| 프론트엔드 | React + TypeScript + Vite | ==SPA== 기반 커뮤니티 UI |
| 스타일 | Tailwind CSS | 유틸리티 기반 반응형 디자인 |
| 백엔드/DB | Supabase | 인증 + PostgreSQL + ==RLS== + ==Realtime== |
| AI | @google/genai (Gemini) | 콘텐츠 모더레이션 + 추천 피드 |
| 실시간 | Supabase Realtime | 알림·새 댓글·좋아요 실시간 수신 |
| 라우팅 | React Router v7 | 페이지 내비게이션 |
| 상태 관리 | Zustand | 클라이언트 상태 관리 |

### 📐 데이터 모델

\`\`\`
profiles
├── id (uuid, PK → auth.users)
├── username (text, unique)
├── display_name (text)
├── avatar_url (text)
├── bio (text)
├── interests (text[])           ← AI 가 자동 업데이트
├── expertise_level (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

posts
├── id (uuid, PK)
├── author_id (uuid → profiles)
├── title (text)
├── content (text)
├── category (text)              ← tutorial, tip, discussion, question
├── tags (text[])
├── status (text)                ← draft, pending, published, blocked
├── moderation_score (real)      ← AI 독성 수치 0~1
├── moderation_reason (text)
├── like_count (integer, default 0)
├── comment_count (integer, default 0)
├── bookmark_count (integer, default 0)
├── created_at (timestamptz)
└── updated_at (timestamptz)

comments
├── id (uuid, PK)
├── post_id (uuid → posts)
├── author_id (uuid → profiles)
├── parent_id (uuid → comments)  ← 대댓글 (null 이면 최상위)
├── content (text)
├── like_count (integer, default 0)
├── created_at (timestamptz)
└── updated_at (timestamptz)

likes
├── id (uuid, PK)
├── user_id (uuid → profiles)
├── target_type (text)           ← 'post' | 'comment'
├── target_id (uuid)
├── created_at (timestamptz)
└── UNIQUE(user_id, target_type, target_id)

bookmarks
├── id (uuid, PK)
├── user_id (uuid → profiles)
├── post_id (uuid → posts)
├── created_at (timestamptz)
└── UNIQUE(user_id, post_id)

follows
├── id (uuid, PK)
├── follower_id (uuid → profiles)
├── following_id (uuid → profiles)
├── created_at (timestamptz)
└── UNIQUE(follower_id, following_id)

notifications
├── id (uuid, PK)
├── user_id (uuid → profiles)    ← 알림 받는 사람
├── actor_id (uuid → profiles)   ← 알림 유발자
├── type (text)                  ← like, comment, follow, mention
├── target_type (text)           ← 'post' | 'comment'
├── target_id (uuid)
├── message (text)
├── is_read (boolean, default false)
├── created_at (timestamptz)
└── INDEX(user_id, is_read, created_at DESC)
\`\`\`

### 🗂️ 프로젝트 구조

\`\`\`
src/
├── components/
│   ├── auth/          ← Login, Register, AuthGuard
│   ├── post/          ← PostCard, PostDetail, PostForm, PostList
│   ├── comment/       ← CommentThread, CommentForm, CommentItem
│   ├── feed/          ← FeedView, RecommendedFeed, TrendingFeed
│   ├── profile/       ← ProfileCard, ProfilePage, EditProfile
│   ├── follow/        ← FollowButton, FollowerList, FollowingList
│   ├── notification/  ← NotificationBell, NotificationList
│   ├── moderation/    ← ModerationDashboard, ReviewQueue
│   ├── search/        ← SearchBar, SearchResults, TagFilter
│   └── layout/        ← Header, Sidebar, MobileNav, ThemeToggle
├── hooks/
│   ├── useAuth.ts
│   ├── usePosts.ts
│   ├── useComments.ts
│   ├── useLikes.ts
│   ├── useBookmarks.ts
│   ├── useFollow.ts
│   ├── useNotifications.ts
│   ├── useModeration.ts
│   └── useRecommendation.ts
├── lib/
│   ├── supabase.ts       ← Supabase 클라이언트
│   ├── gemini.ts         ← Gemini AI 클라이언트
│   ├── moderation.ts     ← AI 모더레이션 로직
│   ├── recommendation.ts ← AI 추천 피드 로직
│   └── realtime.ts       ← Supabase Realtime 구독
├── stores/
│   ├── authStore.ts
│   ├── feedStore.ts
│   └── notificationStore.ts
├── pages/
│   ├── HomePage.tsx      ← 피드 (추천 / 최신 / 인기)
│   ├── PostPage.tsx      ← 게시글 상세 + 댓글
│   ├── ProfilePage.tsx   ← 사용자 프로필 + 게시글
│   ├── SearchPage.tsx    ← 검색 + 태그 필터
│   ├── BookmarkPage.tsx  ← 내 북마크
│   ├── NotificationPage.tsx
│   └── admin/
│       └── ModerationPage.tsx ← 관리자 모더레이션 대시보드
├── types/
│   └── index.ts
└── App.tsx
\`\`\`

---

### 📋 AI 에게 전달할 프롬프트 (복사해서 사용)

아래 프롬프트를 Claude Code 나 Cursor 에 붙여넣으세요:

\`\`\`
AI 커뮤니티 플랫폼을 만들어줘.

[기술 스택]
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- Supabase (인증 + PostgreSQL + RLS + Realtime)
- @google/genai (Gemini) — 콘텐츠 모더레이션 + 추천 피드
- React Router v7
- Zustand (상태 관리)

[핵심 기능]
1. 인증 + 프로필: 회원가입/로그인/로그아웃, 프로필 편집 (이름·바이오·아바타·관심 태그)
2. 게시글 CRUD: 제목·본문·카테고리(tutorial/tip/discussion/question)·태그, 마크다운 지원
3. AI 콘텐츠 모더레이션: 게시 전 Gemini 로 독성 검사 → 자동승인/경고/차단, moderation_score 저장
4. 댓글 시스템: 대댓글(threading) 지원, parent_id 로 트리 구조
5. 좋아요/북마크: 게시글·댓글 좋아요, 게시글 북마크, 토글 방식
6. 팔로우 시스템: 사용자 팔로우/언팔로우, 팔로워·팔로잉 수 표시
7. Supabase Realtime 알림: 내 글에 댓글/좋아요, 누군가 나를 팔로우 → 실시간 알림
8. AI 추천 피드: 사용자 좋아요·댓글·태그 활동 분석 → Gemini 로 맞춤 피드 순위
9. 검색: 제목·본문 텍스트 검색 + 태그 필터 + 카테고리 필터
10. 관리자 모더레이션 대시보드: 차단/경고 글 목록, 수동 승인/차단, 통계

[피드 종류]
- 추천 (AI): 로그인 사용자만, 관심사 기반 정렬
- 최신: 전체 공개, created_at DESC
- 인기: 전체 공개, like_count DESC (이번 주)
- 팔로잉: 팔로우한 사람의 글만

[Supabase Realtime 설정]
- notifications 테이블에 INSERT 트리거
- 클라이언트에서 user_id 기준 구독
- 알림 벨 아이콘에 읽지 않은 개수 뱃지

[디자인]
- 다크/라이트 모드 토글
- 반응형 (모바일: 하단 내비게이션, 데스크탑: 사이드바)
- 카드형 게시글 레이아웃
- 무한 스크롤 또는 페이지네이션

[RLS 정책]
- profiles: 누구나 읽기, 본인만 수정
- posts: published 는 누구나 읽기, 본인만 CUD
- comments: 게시글 열람 가능하면 읽기, 본인만 CUD
- likes/bookmarks: 본인만 CUD
- follows: 누구나 읽기(팔로워 수), 본인만 CUD
- notifications: 본인 것만 읽기/수정

[환경 변수]
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_GEMINI_API_KEY=...
\`\`\`

---

### ⏱️ Part B 단계별 진행 (160분)

| 단계 | 시간 | 작업 |
|---|---|---|
| 1 | 15분 | Vite 프로젝트 생성 + Tailwind + Supabase + 라우팅 + 다크모드 |
| 2 | 15분 | Supabase 스키마 생성 (테이블 + RLS + 트리거) |
| 3 | 20분 | 인증 + 프로필 CRUD |
| 4 | 25분 | 게시글 CRUD + AI 모더레이션 + 카테고리/태그 |
| 5 | 20분 | 댓글 (threading) + 좋아요 + 북마크 |
| 6 | 15분 | 팔로우 시스템 + 팔로워/팔로잉 목록 |
| 7 | 20분 | Realtime 알림 + 알림 벨 + AI 추천 피드 |
| 8 | 15분 | 검색 + 관리자 모더레이션 대시보드 |
| 9 | 15분 | 반응형 + 최종 테스트 + 배포 |`,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

기본 구현을 마쳤다면, 다음 기능을 추가해 보세요:

### 도전 1: 실시간 채팅 (DM)
사용자 간 1:1 다이렉트 메시지 기능을 추가하세요. Supabase Realtime 의 ==Broadcast== 채널을 사용하면 별도 서버 없이도 실시간 채팅이 가능합니다.

### 도전 2: AI 요약 피드
하루 동안 인기 게시글 10개를 AI 가 요약해서 "오늘의 커뮤니티 다이제스트" 를 자동 생성하세요. 매일 아침 알림으로 보내주면 더 좋아요.

### 도전 3: 평판 시스템
좋아요 수·댓글 수·채택 답변 수 등을 기반으로 ==평판 점수==를 계산하세요. Stack Overflow 처럼 일정 점수 이상이면 태그 편집·글 수정 제안 등 추가 권한을 부여합니다.

### 도전 4: 마크다운 에디터 강화
게시글 작성 시 코드 하이라이팅·이미지 업로드(Supabase Storage)·미리보기를 지원하는 풍부한 ==마크다운 에디터==를 만들어 보세요.`,
    },
  ],

  quiz: {
    title: "W39: AI 커뮤니티 플랫폼 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice" as const,
        question: "AI 콘텐츠 모더레이션에서 toxicity 수치가 0.5인 게시글의 적절한 처리는?",
        options: [
          "자동 승인 (문제 없음)",
          "경고 후 게시 + 관리자 검토",
          "자동 차단",
          "작성자 계정 정지",
        ],
        correctIndex: 1,
        explanation:
          "toxicity 0.3~0.7 구간은 애매한 영역이므로 경고 후 게시하고 관리자가 최종 판단합니다. 0.3 미만은 자동 승인, 0.7 이상은 자동 차단이에요.",
      },
      {
        type: "multiple-choice" as const,
        question: "콘텐츠 추천 시스템에서 '협업 필터링'의 원리는?",
        options: [
          "게시글의 태그와 카테고리를 분석한다",
          "비슷한 취향의 사용자가 좋아한 콘텐츠를 추천한다",
          "작성자의 팔로워 수를 기준으로 추천한다",
          "최신 게시글을 우선 표시한다",
        ],
        correctIndex: 1,
        explanation:
          "협업 필터링은 '나와 비슷한 사용자가 좋아한 것은 나도 좋아할 것'이라는 가정 기반이에요. 콘텐츠 자체가 아니라 사용자 행동 패턴을 분석합니다.",
      },
      {
        type: "multiple-choice" as const,
        question: "댓글의 대댓글(threading) 구조를 구현할 때 사용하는 DB 컬럼은?",
        options: [
          "depth (정수, 깊이 레벨)",
          "parent_id (자기 참조 외래키)",
          "thread_index (순서 번호)",
          "reply_to (텍스트, 원 댓글 내용)",
        ],
        correctIndex: 1,
        explanation:
          "parent_id 는 같은 테이블의 다른 댓글을 가리키는 자기 참조(self-referencing) 외래키예요. null 이면 최상위 댓글, 값이 있으면 대댓글입니다.",
      },
      {
        type: "multiple-choice" as const,
        question: "Supabase Realtime 으로 알림을 구현할 때 올바른 방법은?",
        options: [
          "setInterval 로 3초마다 DB 를 폴링한다",
          "notifications 테이블 INSERT 를 구독하고 user_id 로 필터링한다",
          "모든 테이블 변경을 구독하고 클라이언트에서 필터링한다",
          "WebSocket 서버를 별도로 구축한다",
        ],
        correctIndex: 1,
        explanation:
          "Supabase Realtime 은 PostgreSQL 의 변경 사항을 WebSocket 으로 전달해요. notifications 테이블에 INSERT 이벤트를 구독하고 user_id 로 필터링하면 본인 알림만 받습니다.",
      },
      {
        type: "multiple-choice" as const,
        question: "RLS(Row Level Security) 에서 posts 테이블의 올바른 읽기 정책은?",
        options: [
          "모든 사용자가 모든 게시글을 읽을 수 있다",
          "status 가 'published' 인 게시글만 누구나 읽을 수 있다",
          "로그인한 사용자만 게시글을 읽을 수 있다",
          "팔로우한 사용자의 게시글만 읽을 수 있다",
        ],
        correctIndex: 1,
        explanation:
          "RLS 정책으로 status = 'published' 인 게시글만 공개 읽기를 허용해요. draft(임시저장)나 blocked(차단) 상태의 글은 작성자 본인만 볼 수 있습니다.",
      },
    ],
  } satisfies Quiz,
};
