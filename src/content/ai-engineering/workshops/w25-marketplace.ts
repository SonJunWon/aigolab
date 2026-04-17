import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W25 — AI 마켓플레이스.
 *
 * Part A: 플랫폼에서 앱 설명 생성 + AI 검색 + 리뷰 요약 체험 (LLM 셀)
 * Part B: MD 레시피로 AI 앱 템플릿 마켓플레이스 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW25: Lesson = {
  id: "ai-eng-w25-marketplace",
  language: "ai-engineering",
  track: "beginner",
  order: 125,
  title: "W25: AI 마켓플레이스",
  subtitle: "AI 앱 템플릿을 등록·검색·공유하는 플랫폼",
  estimatedMinutes: 240,
  cells: [
    {
      type: "markdown",
      source: `# 🏪 AI 마켓플레이스 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**AI 앱 템플릿을 등록·검색·포크·결제할 수 있는 마켓플레이스 플랫폼** — 개발자가 만든 AI 앱 템플릿을 다른 사용자가 검색하고, 리뷰를 남기고, 한 번에 ==포크==해서 자기 프로젝트로 가져가는 "AI 앱 스토어" 입니다.

### 완성 모습
\`\`\`
┌─ AI Marketplace ──────────────────────────────────────────────┐
│  🏪 AI Template Market    [🔍 검색...]   👤 로그인  🌙 다크   │
├───────────────────────────────────────────────────────────────┤
│  📂 카테고리: [전체] [챗봇] [이미지] [문서] [코드] [데이터]   │
│  🔥 인기순 | ⭐ 평점순 | 🕐 최신순 | 💰 무료만               │
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐│
│  │ 🤖 AI 챗봇      │  │ 🎨 이미지 생성기│  │ 📄 문서 분석기 ││
│  │   Pro Template   │  │   Free Template │  │   Pro Template ││
│  │                  │  │                 │  │                ││
│  │ ⭐ 4.8 (124)    │  │ ⭐ 4.5 (87)     │  │ ⭐ 4.9 (56)    ││
│  │ 👤 dev_kim      │  │ 👤 ai_park      │  │ 👤 ml_lee      ││
│  │ 💰 $9.99        │  │ 🆓 무료         │  │ 💰 $14.99      ││
│  │                  │  │                 │  │                ││
│  │ [🔍 상세] [⤵ Fork]│ │ [🔍 상세] [⤵ Fork]│ [🔍 상세] [⤵ Fork]│
│  └─────────────────┘  └─────────────────┘  └────────────────┘│
│                                                               │
│  ┌─ AI 추천 ✨ ───────────────────────────────────────────────┐│
│  │ "이전에 챗봇 템플릿을 포크하셨네요!                        ││
│  │  이 고급 RAG 챗봇 템플릿도 관심 있으실 거예요." — AI      ││
│  └────────────────────────────────────────────────────────────┘│
│                                                               │
│  [📦 내 템플릿 관리]  [📊 판매 대시보드]  [🛡️ 관리자 패널]    │
└───────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 앱 설명 생성 + AI 검색 + 리뷰 요약 | 80분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 마켓플레이스 웹앱 완성 | 160분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - ==Supabase== 무료 계정 (Part B 에서 DB + 인증 사용)`,
    },

    // ─── Part A: 마켓플레이스 AI 엔진 ───
    {
      type: "markdown",
      source: `## Part A: 마켓플레이스 AI 엔진 만들기 (80분)

마켓플레이스의 핵심은 **좋은 템플릿을 쉽게 찾고, 믿고 고를 수 있게** 하는 것이에요.
AI 를 활용하면 이 과정을 획기적으로 개선할 수 있습니다.

핵심 개념 3가지:
1. **앱 설명 생성** — 개발자가 코드와 기능을 입력하면 AI 가 매력적인 마켓 설명문을 작성
2. **==시맨틱 검색==** — 사용자의 자연어 질의를 이해해 가장 관련 있는 템플릿을 추천
3. **리뷰 요약** — 수십 개 리뷰를 AI 가 분석해 장단점·핵심 의견을 한눈에 정리`,
    },

    {
      type: "markdown",
      source: `### A-1. 앱 설명 생성기 — 코드 → 마켓 설명문

개발자가 템플릿의 기능 목록과 기술 스택을 입력하면, AI 가 마켓플레이스에 올릴 **매력적인 설명문** 을 자동 생성합니다.
제목, 한 줄 소개, 주요 기능, 사용 기술, 설치 방법, 스크린샷 설명까지 — 마케팅 카피를 AI 에게 맡기는 거예요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 앱 설명 생성기 — 기능 목록 → 마켓플레이스 설명문
const templateInfo = {
  name: "Smart RAG Chatbot",
  techStack: ["React", "TypeScript", "Supabase", "OpenAI", "LangChain"],
  features: [
    "PDF/DOCX 업로드 후 문서 기반 질의응답",
    "벡터 DB 로 시맨틱 검색 지원",
    "대화 히스토리 저장 및 이어하기",
    "소스 문서 인용 표시",
    "다크/라이트 모드 반응형 UI",
  ],
  category: "챗봇",
  targetUser: "문서가 많은 팀, 고객지원 자동화가 필요한 스타트업",
};

const systemPrompt = \`너는 AI 앱 마켓플레이스의 상품 설명 작성 전문가야.
개발자가 제공하는 템플릿 정보를 바탕으로 매력적인 마켓 설명문을 JSON 으로 작성해.

[응답 형식]
{
  "title": "눈에 띄는 마켓 제목 (30자 이내)",
  "tagline": "한 줄 소개 (50자 이내, 이모지 포함)",
  "description": "3~4문장 설명 (가치 제안 중심)",
  "highlights": ["핵심 기능 1", "핵심 기능 2", "핵심 기능 3", "핵심 기능 4"],
  "techBadges": ["기술1", "기술2"],
  "useCases": ["사용 사례 1", "사용 사례 2", "사용 사례 3"],
  "setupSteps": ["설치 단계 1", "설치 단계 2", "설치 단계 3"],
  "suggestedPrice": "무료" | "$X.XX",
  "seoKeywords": ["키워드1", "키워드2", "키워드3"]
}

[규칙]
- 한국어로 작성
- 가치 제안을 앞에 배치 (기술 나열보다 "이걸 쓰면 뭐가 좋은지")
- highlights 는 이모지 + 한 줄로 간결하게
- setupSteps 는 초보자도 따라할 수 있게\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 템플릿의 마켓 설명문을 작성해줘:\\n\\n\${JSON.stringify(templateInfo, null, 2)}\` },
  ],
});

try {
  const listing = JSON.parse(res.text);
  console.log("🏪 마켓 설명문 생성 결과");
  console.log("═".repeat(50));
  console.log("📌 제목:", listing.title);
  console.log("💬 태그라인:", listing.tagline);
  console.log("\\n📝 설명:");
  console.log("  ", listing.description);
  console.log("\\n✨ 하이라이트:");
  listing.highlights?.forEach((h: string) => console.log("  •", h));
  console.log("\\n🏷️ 기술:", listing.techBadges?.join(" · "));
  console.log("\\n🎯 사용 사례:");
  listing.useCases?.forEach((u: string) => console.log("  →", u));
  console.log("\\n📦 설치 단계:");
  listing.setupSteps?.forEach((s: string, i: number) =>
    console.log(\`  \${i + 1}. \${s}\`)
  );
  console.log("\\n💰 추천 가격:", listing.suggestedPrice);
  console.log("🔑 SEO:", listing.seoKeywords?.join(", "));
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 개발자는 기능만 나열하고, AI 가 마케팅 관점 설명문을 만들어요.",
        "highlights 에 이모지를 넣으면 마켓 카드에서 눈에 잘 띄어요.",
        "suggestedPrice 를 AI 가 제안하지만, 최종 가격은 개발자가 결정해요.",
        "실무에서는 이 프로세스를 템플릿 등록 폼의 '자동 생성' 버튼에 연결합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. AI 기반 시맨틱 검색 — 자연어로 템플릿 찾기

일반 키워드 검색은 "챗봇" 이라고 정확히 입력해야 챗봇 템플릿이 나와요.
==시맨틱 검색==은 "고객 질문에 자동으로 답하는 도구" 같은 자연어로도 관련 템플릿을 찾아줍니다.
AI 가 질의 의도를 파악하고, 각 템플릿과의 관련성을 점수로 매기는 방식이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// AI 시맨틱 검색 — 자연어 질의 → 템플릿 추천
const catalog = [
  {
    id: "t-001",
    title: "Smart RAG Chatbot",
    description: "PDF 문서를 업로드하면 내용 기반으로 질의응답하는 AI 챗봇",
    category: "챗봇",
    tags: ["RAG", "문서분석", "LangChain"],
    rating: 4.8,
    price: "$9.99",
  },
  {
    id: "t-002",
    title: "AI Image Generator",
    description: "텍스트 프롬프트로 고품질 이미지를 생성하는 웹앱 템플릿",
    category: "이미지",
    tags: ["DALL-E", "Stable Diffusion", "생성AI"],
    rating: 4.5,
    price: "무료",
  },
  {
    id: "t-003",
    title: "Code Review Assistant",
    description: "GitHub PR 코드를 자동 분석해 버그와 개선점을 제안하는 도구",
    category: "코드",
    tags: ["코드리뷰", "GitHub", "CI/CD"],
    rating: 4.7,
    price: "$4.99",
  },
  {
    id: "t-004",
    title: "AI 번역 + 로컬라이제이션",
    description: "웹앱의 다국어 번역을 AI 로 자동화하고 컨텍스트를 유지하는 도구",
    category: "문서",
    tags: ["번역", "i18n", "다국어"],
    rating: 4.3,
    price: "무료",
  },
  {
    id: "t-005",
    title: "Data Dashboard Builder",
    description: "CSV/API 데이터를 AI 가 분석해 자동으로 차트와 대시보드를 구성",
    category: "데이터",
    tags: ["시각화", "분석", "차트"],
    rating: 4.6,
    price: "$12.99",
  },
  {
    id: "t-006",
    title: "AI 고객지원 봇",
    description: "FAQ 와 제품 문서를 학습해 고객 문의에 자동 응대하는 챗봇",
    category: "챗봇",
    tags: ["고객지원", "FAQ", "자동응답"],
    rating: 4.9,
    price: "$19.99",
  },
];

const userQuery = "고객 질문에 자동으로 답변해주는 AI 를 만들고 싶어요";

const systemPrompt = \`너는 AI 앱 마켓플레이스의 검색 엔진이야.
사용자의 자연어 검색 질의를 분석하고, 카탈로그에서 가장 관련 있는 템플릿을 추천해.

[카탈로그]
\${JSON.stringify(catalog, null, 2)}

[응답 형식]
{
  "queryIntent": "사용자가 원하는 것 (한 줄)",
  "results": [
    {
      "id": "템플릿 ID",
      "relevanceScore": 0.0~1.0,
      "matchReason": "왜 이 템플릿이 적합한지 (한 줄)"
    }
  ],
  "suggestedFilters": ["추천 카테고리 필터1", "필터2"],
  "alternativeQuery": "더 정확한 결과를 위한 검색어 제안"
}

[규칙]
- results 는 relevanceScore 내림차순으로 최대 3개
- 0.3 미만 관련성은 제외
- matchReason 은 사용자 질의와 템플릿의 연결 고리를 명확하게\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`검색 질의: "\${userQuery}"\` },
  ],
});

try {
  const search = JSON.parse(res.text);
  console.log("🔍 AI 시맨틱 검색 결과");
  console.log("═".repeat(50));
  console.log("💭 질의 의도:", search.queryIntent);
  console.log("\\n📋 추천 템플릿:");
  search.results?.forEach((r: any, i: number) => {
    const tpl = catalog.find((c) => c.id === r.id);
    console.log(\`\\n  \${i + 1}위. \${tpl?.title ?? r.id}\`);
    console.log(\`     ⭐ \${tpl?.rating ?? "?"} | 💰 \${tpl?.price ?? "?"}\`);
    console.log(\`     📊 관련성: \${(r.relevanceScore * 100).toFixed(0)}%\`);
    console.log(\`     💡 \${r.matchReason}\`);
  });
  console.log("\\n🏷️ 추천 필터:", search.suggestedFilters?.join(", "));
  console.log("🔄 더 나은 검색어:", search.alternativeQuery);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 키워드 매칭이 아니라 '의미' 로 검색 — '자동 답변' ≈ '챗봇', '고객지원' 을 이해해요.",
        "relevanceScore 로 정렬하면 가장 적합한 템플릿이 위로 올라가요.",
        "실무에서는 Embedding 벡터 + 코사인 유사도로 더 정확한 시맨틱 검색을 구현해요.",
        "alternativeQuery 는 검색 결과가 적을 때 사용자에게 제안할 수 있어요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 리뷰 요약 — 수십 개 리뷰를 한눈에

마켓플레이스에서 템플릿을 고를 때, 리뷰 100개를 다 읽을 순 없어요.
AI 가 전체 리뷰를 분석해 **장점·단점·핵심 의견** 을 요약하면, 사용자는 한눈에 판단할 수 있습니다.
앱스토어의 "리뷰 요약" 기능과 같은 원리예요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 리뷰 요약기 — 다수의 사용자 리뷰 → 장단점 + 핵심 인사이트
const reviews = [
  { user: "dev_kim", rating: 5, text: "RAG 성능이 정말 좋아요. PDF 200페이지도 빠르게 처리합니다. 코드 구조도 깔끔해서 커스텀하기 편했어요." },
  { user: "startup_lee", rating: 4, text: "고객지원에 바로 적용했더니 문의 50% 줄었어요. 다만 초기 설정이 좀 복잡합니다. 가이드가 더 자세했으면." },
  { user: "ml_park", rating: 5, text: "벡터 검색 정확도가 높아요. Supabase pgvector 연동이 매끄럽습니다. 비용도 저렴하고 추천!" },
  { user: "junior_choi", rating: 3, text: "기능은 좋은데 문서가 부족해요. env 설정에서 한 시간 헤맸습니다. 초보자에겐 진입장벽이 있어요." },
  { user: "freelancer_oh", rating: 5, text: "클라이언트 프로젝트에 바로 사용했습니다. 디자인이 깔끔하고 반응형도 완벽해요. 이 가격에 이 퀄리티는 대박." },
  { user: "pm_jung", rating: 4, text: "비개발자인데도 배포까지 성공했어요! Vercel 원클릭 배포가 특히 좋았습니다. 대화 히스토리 저장도 잘 돼요." },
  { user: "cto_han", rating: 4, text: "팀 내부 지식 관리 도구로 쓰고 있어요. 소스 인용 표시가 신뢰도를 높여줍니다. API 키 관리 부분은 개선 필요." },
  { user: "student_yoon", rating: 2, text: "TypeScript 초보인데 에러가 많이 나요. 버전 호환 문제인 것 같은데 이슈에 답변이 느려요." },
  { user: "agency_seo", rating: 5, text: "3개 클라이언트에 납품했어요. 커스텀 자유도가 높고 코드가 타입 안전해서 유지보수가 편합니다." },
  { user: "data_lim", rating: 4, text: "한국어 문서 처리 성능이 좋아요. 영어 대비 90% 정도 정확도. 다국어 지원이 추가되면 완벽할 것 같아요." },
];

const systemPrompt = \`너는 마켓플레이스 리뷰 분석 AI 야.
여러 사용자 리뷰를 종합 분석해 구매 결정에 도움되는 요약을 JSON 으로 작성해.

[응답 형식]
{
  "overallSentiment": "매우 긍정" | "긍정" | "보통" | "부정" | "매우 부정",
  "averageRating": 숫자,
  "totalReviews": 숫자,
  "summary": "전체 리뷰를 2~3문장으로 종합 요약",
  "pros": ["장점 1", "장점 2", "장점 3"],
  "cons": ["단점 1", "단점 2"],
  "keyInsights": [
    { "topic": "주제", "detail": "인사이트 내용", "mentionCount": 숫자 }
  ],
  "bestFor": "이런 사람에게 추천",
  "notFor": "이런 사람에게 비추천",
  "improvementSuggestions": ["개선 제안 1", "개선 제안 2"]
}

[규칙]
- 한국어로 작성
- pros/cons 는 빈도 높은 순서
- keyInsights 는 가장 많이 언급된 주제 3~5개
- bestFor/notFor 로 타겟 사용자를 명확하게\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 리뷰들을 분석해줘:\\n\\n\${JSON.stringify(reviews, null, 2)}\` },
  ],
});

try {
  const analysis = JSON.parse(res.text);
  console.log("📊 리뷰 종합 분석");
  console.log("═".repeat(50));
  console.log(\`⭐ 평균 \${analysis.averageRating}/5 (\${analysis.totalReviews}개 리뷰)\`);
  console.log(\`😊 전체 감정: \${analysis.overallSentiment}\`);
  console.log(\`\\n📝 요약: \${analysis.summary}\`);

  console.log("\\n👍 장점:");
  analysis.pros?.forEach((p: string) => console.log("  ✅", p));

  console.log("\\n👎 단점:");
  analysis.cons?.forEach((c: string) => console.log("  ⚠️", c));

  console.log("\\n🔑 핵심 인사이트:");
  analysis.keyInsights?.forEach((k: any) =>
    console.log(\`  💡 [\${k.topic}] \${k.detail} (언급 \${k.mentionCount}회)\`)
  );

  console.log(\`\\n🎯 추천 대상: \${analysis.bestFor}\`);
  console.log(\`🚫 비추천 대상: \${analysis.notFor}\`);

  console.log("\\n💡 개선 제안:");
  analysis.improvementSuggestions?.forEach((s: string) =>
    console.log("  →", s)
  );
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 10개 리뷰도 직접 읽기 귀찮은데, AI 가 장단점을 정리해주면 구매 결정이 빨라져요.",
        "keyInsights 의 mentionCount 로 '가장 많이 언급된 이슈' 를 파악할 수 있어요.",
        "bestFor/notFor 는 마켓 상세 페이지에 배너로 넣으면 전환율이 올라가요.",
        "실무에선 새 리뷰가 올 때마다 요약을 갱신하는 배치 작업을 돌립니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

마켓플레이스의 세 가지 AI 엔진을 검증했어요:
- ✅ **앱 설명 생성** — 기술 정보 → 매력적인 마켓 설명문 (JSON 구조)
- ✅ **==시맨틱 검색==** — 자연어 질의로 가장 관련 있는 템플릿 추천
- ✅ **리뷰 요약** — 다수 리뷰 → 장단점·핵심 인사이트·추천 대상 정리

이제 이걸 **인증 + DB + 결제** 가 붙은 풀스택 마켓플레이스로 만듭니다.

---

## Part B: MD 레시피로 풀스택 웹앱 완성 (160분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [AI 마켓플레이스 웹앱]
\`\`\`

이 프로젝트는 **==Supabase==** 를 백엔드로 사용해요.
인증, 데이터베이스, 스토리지를 하나의 서비스에서 해결할 수 있어 1인 개발에 최적입니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 마켓플레이스 제작 요청서

## 프로젝트 개요
AI 앱 템플릿을 등록·검색·포크·결제할 수 있는 마켓플레이스 플랫폼을 만들어주세요.
개발자가 만든 AI 앱 템플릿을 공유하고, 사용자가 리뷰/평점을 남기고, 관리자가 승인하는 구조입니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini SDK) — 설명 생성, 검색, 리뷰 요약
- Supabase (인증 + PostgreSQL + Storage)
- Stripe (프리미엄 템플릿 결제 — 선택)
- Lucide React (아이콘)

## Supabase 설정

### 테이블 스키마

\\\`\\\`\\\`sql
-- 사용자 프로필 (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 템플릿 (마켓의 핵심 테이블)
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('챗봇', '이미지', '문서', '코드', '데이터', '기타')),
  tags TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  price_cents INTEGER DEFAULT 0,  -- 0 = 무료
  repo_url TEXT,
  demo_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  setup_steps TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  fork_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 리뷰 + 평점
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, author_id)  -- 사용자당 1개 리뷰
);

-- 포크 기록
CREATE TABLE forks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  forked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, user_id)
);

-- AI 생성 리뷰 요약 (캐싱)
CREATE TABLE review_summaries (
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE PRIMARY KEY,
  summary JSONB NOT NULL,
  review_count INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE forks ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_summaries ENABLE ROW LEVEL SECURITY;

-- profiles: 누구나 읽기, 본인만 수정
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- templates: 승인된 것만 공개, 작성자/관리자만 수정
CREATE POLICY "templates_read" ON templates FOR SELECT USING (status = 'approved' OR author_id = auth.uid());
CREATE POLICY "templates_insert" ON templates FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "templates_update" ON templates FOR UPDATE USING (author_id = auth.uid());

-- reviews: 누구나 읽기, 인증 사용자만 작성
CREATE POLICY "reviews_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = author_id);

-- forks: 본인 기록만 접근
CREATE POLICY "forks_read" ON forks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "forks_insert" ON forks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- review_summaries: 누구나 읽기
CREATE POLICY "summaries_read" ON review_summaries FOR SELECT USING (true);
\\\`\\\`\\\`

### 관리자 권한 RLS (추가)
\\\`\\\`\\\`sql
-- 관리자는 모든 템플릿 수정 가능 (승인/거절)
CREATE POLICY "admin_templates_update" ON templates FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
\\\`\\\`\\\`

## 기능 요구사항

### 1. 인증
- Supabase Auth (이메일/비밀번호 + GitHub OAuth)
- 로그인/회원가입 모달
- 사용자 프로필 페이지 (아바타, 이름, 바이오, 등록한 템플릿 목록)

### 2. 템플릿 등록 (CRUD)
- 등록 폼: 제목, 카테고리, 태그, 기술 스택, 설명, 데모 URL, 레포 URL, 스크린샷 업로드, 가격
- "AI 로 설명 생성" 버튼: 기능 목록 → 마켓 설명문 자동 작성 (Part A 의 A-1 패턴)
- 등록 시 status = 'pending' → 관리자 승인 후 공개
- 내 템플릿 수정/삭제

### 3. 검색 + 필터링
- 상단 검색바: AI 시맨틱 검색 (Part A 의 A-2 패턴)
- 카테고리 필터 탭: 챗봇 / 이미지 / 문서 / 코드 / 데이터 / 기타
- 정렬: 인기순(포크 수) / 평점순 / 최신순 / 무료만
- 검색 결과는 카드 그리드 레이아웃

### 4. 템플릿 상세 페이지
- 스크린샷 갤러리 (캐러셀)
- 설명 + 하이라이트 + 기술 스택 배지
- 설치 단계 (스텝바이스텝)
- 데모 링크 + 레포 링크
- "⤵️ Fork" 버튼 (레포 URL 을 새 탭으로 열기 + fork_count 증가)

### 5. 리뷰 + 평점
- 별점 (1~5) + 텍스트 리뷰 작성
- 리뷰 목록 (최신순)
- AI 리뷰 요약 배너: 장점 3개 / 단점 2개 / 추천 대상 (Part A 의 A-3 패턴)
  - 리뷰 5개 이상이면 자동 생성, review_summaries 에 캐싱
  - 새 리뷰 작성 시 요약 갱신

### 6. 사용자 프로필
- 내 등록 템플릿 목록 + 상태 (pending/approved/rejected)
- 내 포크 히스토리
- 내 리뷰 목록

### 7. 관리자 패널 (/admin)
- 보류(pending) 템플릿 목록 → 승인/거절 버튼
- 전체 사용자 목록 (역할 변경)
- 신고된 리뷰 관리
- 통계 대시보드: 총 템플릿 수, 일일 등록 수, 인기 카테고리 차트

### 8. Stripe 결제 (선택 — 도전 과제)
- 유료 템플릿 (price_cents > 0) 에 "구매하기" 버튼
- Stripe Checkout 세션 → 결제 완료 → 포크 허용
- 판매자 대시보드: 매출 통계

### 9. UI/UX
- 반응형: 데스크톱 3열 → 태블릿 2열 → 모바일 1열 카드 그리드
- 다크/라이트 모드 토글
- 로딩 스켈레톤, 토스트 알림
- 빈 상태 일러스트 ("아직 템플릿이 없어요")

## 환경 변수 (.env)
\\\`\\\`\\\`
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key  # 선택
\\\`\\\`\\\`

## 폴더 구조 (참고)
\\\`\\\`\\\`
src/
  components/
    layout/         # Header, Footer, Sidebar
    auth/           # LoginModal, SignUpModal, ProfileMenu
    templates/      # TemplateCard, TemplateForm, TemplateDetail
    search/         # SearchBar, FilterTabs, SortDropdown
    reviews/        # ReviewForm, ReviewList, ReviewSummary
    admin/          # AdminPanel, PendingList, UserManager
    common/         # Button, Modal, Rating, Skeleton, Toast
  pages/
    Home.tsx        # 카테고리별 인기 템플릿 + AI 추천
    Search.tsx      # 검색 결과 그리드
    Detail.tsx      # 템플릿 상세
    Profile.tsx     # 사용자 프로필
    MyTemplates.tsx # 내 템플릿 관리
    Admin.tsx       # 관리자 패널
    Submit.tsx      # 템플릿 등록
  hooks/
    useAuth.ts
    useTemplates.ts
    useReviews.ts
    useSearch.ts
  lib/
    supabase.ts     # Supabase 클라이언트
    gemini.ts       # AI 기능 (설명 생성, 검색, 요약)
    stripe.ts       # Stripe 결제 (선택)
  types/
    index.ts        # Template, Review, Profile, Fork 타입
\\\`\\\`\\\`
\`\`\`

---

위 마크다운을 **Claude Code** 또는 **Cursor** 에 전달하면, AI 가 전체 프로젝트를 생성해 줍니다.`,
    },

    {
      type: "markdown",
      source: `### 🔧 핵심 구현 포인트

#### 1. Supabase 클라이언트 초기화

\`\`\`typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
\`\`\`

#### 2. AI 설명 생성 핵심 로직

\`\`\`typescript
// src/lib/gemini.ts — generateDescription()
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function generateDescription(templateInfo: TemplateInput) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \`기능: \${templateInfo.features.join(", ")}
기술: \${templateInfo.techStack.join(", ")}
카테고리: \${templateInfo.category}
매력적인 마켓 설명문을 JSON 으로 작성해.\`,
  });
  return JSON.parse(response.text ?? "{}");
}
\`\`\`

#### 3. ==RLS== 로 보안 자동화

Supabase 의 ==RLS== (Row Level Security) 는 DB 레벨에서 접근 제어를 해요.
\`auth.uid()\` 로 현재 로그인 사용자를 확인하니, API 에서 별도 인증 로직이 필요 없습니다.

\`\`\`
요청 → Supabase → RLS 정책 체크 → 허용/거부
\`\`\`

#### 4. 관리자 패널 접근 제어

\`\`\`typescript
// 프론트에서 라우트 보호
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (profile?.role !== "admin") {
  navigate("/");
}
\`\`\`

> 💡 프론트 체크는 UX 용이고, 실제 보안은 RLS 정책이 담당해요. 둘 다 있어야 안전!`,
    },

    {
      type: "markdown",
      source: `### 🏆 도전 과제 — 더 멋진 마켓플레이스로

기본 기능이 완성됐다면, 다음 기능을 추가해 보세요!

### 레벨 1 — 기본 확장
- **태그 자동 추천**: 설명문 기반으로 AI 가 관련 태그 5개 제안
- **유사 템플릿 추천**: 상세 페이지 하단에 "이런 템플릿도 관심 있으실 거예요"
- **인기 키워드 클라우드**: 검색 트렌드를 워드 클라우드로 시각화

### 레벨 2 — 중급 도전
- **버전 관리**: 템플릿 업데이트 시 버전 히스토리 (v1.0.0, v1.1.0 ...)
- **비교 기능**: 두 템플릿을 나란히 비교 (기능, 평점, 가격, 기술 스택)
- **Stripe 구독**: 월간 구독으로 모든 프리미엄 템플릿 접근 (All Access Pass)
- **이메일 알림**: 관심 카테고리에 새 템플릿 등록 시 알림 (Supabase Edge Function)

### 레벨 3 — 프로 도전
- **라이브 프리뷰**: StackBlitz/CodeSandbox ==임베드==로 템플릿 미리 실행
- **AI 코드 분석**: 등록된 레포 URL 의 코드 품질을 AI 가 평가 (보안, 구조, 의존성)
- **수익 공유**: 리퍼럴 시스템 — 추천 링크로 판매 시 커미션 지급
- **==PWA==**: 오프라인 브라우징 + 푸시 알림 (새 템플릿, 리뷰 알림)

---

## 🎉 W25 완료!

이번 워크샵에서 배운 것:
- ✅ **AI 설명 생성** — 기술 정보를 매력적인 마켓 설명문으로 자동 변환
- ✅ **==시맨틱 검색==** — 자연어 의도 파악으로 관련 템플릿 추천
- ✅ **리뷰 요약** — 다수 리뷰를 장단점·핵심 인사이트로 요약
- ✅ **==Supabase== + ==RLS==** — 인증·DB·보안을 하나의 서비스로 해결
- ✅ **마켓플레이스 아키텍처** — 등록 → 승인 → 검색 → 리뷰 → 결제 전체 흐름

> 🔮 **다음 워크샵 W26** 에서는 또 다른 실전 AI 프로젝트를 만들어 봅니다. 기대해 주세요!`,
    },
  ],
  quiz: {
    title: "W25 — AI 마켓플레이스 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "마켓플레이스에서 AI 시맨틱 검색이 키워드 검색보다 나은 이유는?",
        options: [
          "속도가 더 빨라서",
          "사용자의 자연어 의도를 이해해 정확히 일치하지 않는 단어도 관련 결과를 반환하니까",
          "서버 비용이 더 저렴해서",
          "데이터베이스 인덱스가 필요 없어서",
        ],
        correctIndex: 1,
        explanation:
          "시맨틱 검색은 단어 자체가 아니라 '의미'를 기반으로 검색합니다. '자동 답변 도구'로 검색해도 '챗봇' 템플릿을 찾을 수 있어요. 키워드 검색은 정확한 단어가 일치해야만 결과가 나옵니다.",
      },
      {
        type: "multiple-choice",
        question:
          "Supabase RLS(Row Level Security)가 마켓플레이스 보안에서 담당하는 역할은?",
        options: [
          "프론트엔드에서 관리자 메뉴를 숨기는 역할",
          "API 요청 속도를 제한하는 역할",
          "데이터베이스 레벨에서 사용자별 데이터 접근 권한을 자동으로 통제하는 역할",
          "비밀번호를 암호화하는 역할",
        ],
        correctIndex: 2,
        explanation:
          "RLS 는 DB 자체에서 auth.uid() 를 확인해 '이 사용자가 이 행을 읽을/쓸 수 있는가' 를 판단합니다. 프론트엔드 체크는 우회될 수 있지만, RLS 는 Supabase 서버에서 강제되므로 진짜 보안 계층이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "템플릿 등록 시 status 를 'pending' 으로 설정하고 관리자 승인을 거치는 이유는?",
        options: [
          "서버 부하를 줄이기 위해",
          "스팸·악성 템플릿·저품질 콘텐츠를 사전에 걸러 마켓 품질을 유지하려고",
          "Stripe 결제 연동에 시간이 걸려서",
          "AI 가 설명문을 생성하는 데 시간이 필요해서",
        ],
        correctIndex: 1,
        explanation:
          "마켓플레이스의 신뢰도는 콘텐츠 품질에 달려 있어요. 관리자 승인 프로세스(moderation)로 스팸, 악성 코드, 저품질 템플릿을 사전에 차단해야 사용자가 안심하고 이용할 수 있습니다.",
      },
    ],
  } satisfies Quiz,
};
