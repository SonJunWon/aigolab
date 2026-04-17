import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W40 — AI 스타트업 런치패드 (FINAL BOSS).
 *
 * W25 마켓플레이스 + W36 강의 + W37 폼 + W39 커뮤니티 역량을 모두 합쳐
 * 아이디어 → 랜딩 → 웨이트리스트 → 베타 → 런칭 → 성장까지 SaaS 전 과정을 구축.
 *
 * Part A: LLM 셀 4개 (비즈니스 아이디어 검증, 랜딩 카피 생성, 베타 피드백 분석, 성장 지표 해석)
 * Part B: MD 레시피로 풀스택 SaaS MVP 완성 (Claude Code / Cursor)
 */
export const workshopW40: Lesson = {
  id: "ai-eng-w40-startup-launchpad",
  language: "ai-engineering",
  track: "beginner",
  order: 140,
  title: "W40: AI 스타트업 런치패드",
  subtitle: "아이디어부터 런칭까지 — AI로 SaaS 사업 시작하기",
  estimatedMinutes: 300,
  cells: [
    // ─── 인트로 ───
    {
      type: "markdown",
      source: `# 🚀 AI 스타트업 런치패드 — FINAL BOSS

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**아이디어 하나로 시작해서, AI가 시장을 검증하고, 랜딩 페이지를 만들고, 베타 유저를 모으고, 피드백을 분석하고, 결제까지 받는 진짜 ==SaaS== 제품** — 지금까지 배운 모든 기술을 총동원하는 파이널 보스 워크샵입니다.

### 완성 모습
\`\`\`
                     🚀 AI 스타트업 런치패드
  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │   💡 아이디어    →    🔍 AI 검증    →    📊 점수  │
  │   "AI 독서 앱"       시장/경쟁/실현      87/100   │
  │                                                  │
  ├──────────────────────────────────────────────────┤
  │                                                  │
  │   🎨 랜딩 페이지  →  📧 웨이트리스트  →  👥 베타  │
  │   AI가 카피 생성      이메일 수집         피드백   │
  │                                                  │
  ├──────────────────────────────────────────────────┤
  │                                                  │
  │   🔐 인증+온보딩  →  ⭐ 핵심 기능    →  💳 결제  │
  │   Supabase Auth      AI 파워드 SaaS    Stripe    │
  │                                                  │
  ├──────────────────────────────────────────────────┤
  │                                                  │
  │   📈 성장 대시보드                                │
  │   ┌────────────────────────────────────┐         │
  │   │ 방문 ██████████ 1,247              │         │
  │   │ 가입 ██████░░░░   623  (50%)       │         │
  │   │ 활성 ████░░░░░░   312  (50%)       │         │
  │   │ 결제 ██░░░░░░░░    78  (25%)       │         │
  │   │                                    │         │
  │   │ MRR: ₩3,120,000  Churn: 5.2%      │         │
  │   └────────────────────────────────────┘         │
  │                                                  │
  └──────────────────────────────────────────────────┘
\`\`\`

### 🏆 사용한 기술 총정리 — 어디서 배웠나?

이 워크샵은 **지금까지 만든 모든 프로젝트의 집대성**입니다:

| 기능 | 출처 워크샵 | 핵심 기술 |
|---|---|---|
| AI 아이디어 검증 | W05 감정 분석 + W34 계약 분석 | ==프롬프트 엔지니어링==, 구조화된 AI 출력 |
| 랜딩 페이지 빌더 | W20 포트폴리오 + W28 프레젠테이션 | AI 카피라이팅, 반응형 레이아웃 |
| 웨이트리스트 시스템 | W37 폼 빌더 + W29 소셜 미디어 | 폼 처리, 이메일 수집, Supabase |
| 베타 피드백 수집 | W37 폼 + W35 재무 코치 | 임베디드 폼, AI 분석 |
| 인증 + 온보딩 | W25 마켓플레이스 + W36 강의 | Supabase Auth, ==RLS==, 역할 관리 |
| 핵심 SaaS 기능 | W33 개인 비서 + W31 자동화 | AI 에이전트, API 연동, 커스터마이징 |
| Stripe 결제 | W25 마켓플레이스 | Stripe Checkout, 구독 관리 |
| 관리자 대시보드 | W36 강의 + W35 재무 코치 | 차트, KPI, 데이터 시각화 |
| 성장 퍼널 분석 | W29 소셜 미디어 + W30 웹 스크래퍼 | 퍼널 분석, ==MRR==, ==Churn Rate== |
| 커뮤니티/소통 | W39 커뮤니티 | 실시간 소통, 피드백 루프 |

> 💪 여기까지 온 당신, 이미 **풀스택 AI 엔지니어**입니다!

---

## Part A: AI 핵심 기능 직접 체험하기 🧪

> Part A에서는 스타트업에 필요한 4가지 AI 기능을 직접 코딩합니다.`,
    },

    // ─── Part A: LLM Cell 1 — 비즈니스 아이디어 검증 ───
    {
      type: "markdown",
      source: `### 실습 1: AI 비즈니스 아이디어 검증기 💡

창업 아이디어를 입력하면 AI가 **시장 규모, 경쟁 현황, 실현 가능성**을 분석해서 점수를 매깁니다.

> 🎯 핵심: ==프롬프트 엔지니어링==으로 구조화된 JSON 분석 결과를 받아내는 기법`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `import { chat } from "@/lib/llm";

// 🚀 비즈니스 아이디어 검증기
const idea = "AI가 사용자 독서 습관을 분석해서 맞춤 도서를 추천하는 구독 서비스";

const result = await chat({
  model: "gemini-2.0-flash",
  system: \`너는 실리콘밸리 VC(벤처캐피털) 파트너야.
스타트업 아이디어를 분석해서 반드시 아래 JSON 형식으로만 응답해.
다른 텍스트 없이 순수 JSON만 출력해.

{
  "summary": "한줄 요약",
  "market": {
    "size": "예상 시장 규모 (원 단위)",
    "growth": "시장 성장률",
    "score": 0~100
  },
  "competition": {
    "mainPlayers": ["경쟁사1", "경쟁사2"],
    "differentiator": "차별화 포인트",
    "score": 0~100
  },
  "feasibility": {
    "techStack": "필요 기술",
    "timeToMVP": "MVP까지 예상 기간",
    "score": 0~100
  },
  "overall": {
    "score": 0~100,
    "verdict": "GO / PIVOT / STOP",
    "nextSteps": ["다음 단계1", "다음 단계2", "다음 단계3"]
  }
}\`,
  message: \`아이디어: \${idea}\`,
});

// JSON 파싱 & 시각화
try {
  const analysis = JSON.parse(result);
  console.log("📊 아이디어 검증 결과\\n");
  console.log(\`💡 요약: \${analysis.summary}\`);
  console.log(\`\\n🏪 시장 규모: \${analysis.market.size} (성장률: \${analysis.market.growth})\`);
  console.log(\`   시장 점수: \${"█".repeat(Math.floor(analysis.market.score / 10))}\${"░".repeat(10 - Math.floor(analysis.market.score / 10))} \${analysis.market.score}/100\`);
  console.log(\`\\n⚔️ 주요 경쟁사: \${analysis.competition.mainPlayers.join(", ")}\`);
  console.log(\`   차별화: \${analysis.competition.differentiator}\`);
  console.log(\`   경쟁 점수: \${"█".repeat(Math.floor(analysis.competition.score / 10))}\${"░".repeat(10 - Math.floor(analysis.competition.score / 10))} \${analysis.competition.score}/100\`);
  console.log(\`\\n🔧 기술 스택: \${analysis.feasibility.techStack}\`);
  console.log(\`   MVP 기간: \${analysis.feasibility.timeToMVP}\`);
  console.log(\`   실현성 점수: \${"█".repeat(Math.floor(analysis.feasibility.score / 10))}\${"░".repeat(10 - Math.floor(analysis.feasibility.score / 10))} \${analysis.feasibility.score}/100\`);
  console.log(\`\\n🏆 종합 점수: \${analysis.overall.score}/100 → \${analysis.overall.verdict}\`);
  console.log(\`\\n📋 다음 단계:\`);
  analysis.overall.nextSteps.forEach((step: string, i: number) => {
    console.log(\`   \${i + 1}. \${step}\`);
  });
} catch {
  console.log("AI 응답:", result);
}`,
      hints: [
        "system 프롬프트에서 JSON 스키마를 명시하면 구조화된 응답을 받을 수 있어요",
        "score를 0~100 범위로 지정하면 시각화하기 편합니다",
        "verdict를 GO/PIVOT/STOP으로 한정하면 판단이 명확해져요",
      ],
    },

    // ─── Part A: LLM Cell 2 — 랜딩 페이지 카피 생성 ───
    {
      type: "markdown",
      source: `### 실습 2: AI 랜딩 페이지 카피 생성기 🎨

아이디어를 입력하면 AI가 **히어로 섹션, 기능 소개, 가격표, CTA** 등 랜딩 페이지의 모든 카피를 자동 생성합니다.

> 🎯 핵심: AI ==카피라이팅==으로 설득력 있는 마케팅 텍스트 생성`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `import { chat } from "@/lib/llm";

// 🎨 랜딩 페이지 카피 생성기
const product = {
  name: "ReadMind",
  description: "AI 맞춤 도서 추천 구독 서비스",
  target: "월 1권 이상 읽는 20~40대 직장인",
  pricing: { free: "월 3권 추천", pro: "₩9,900/월, 무제한 추천 + 독서 분석", enterprise: "₩29,900/월, 팀 독서 모임 + 리포트" },
};

const result = await chat({
  model: "gemini-2.0-flash",
  system: \`너는 세계 최고의 SaaS 랜딩 페이지 카피라이터야.
제품 정보를 받으면 각 섹션별 카피를 JSON으로 생성해.
한국어로, 감성적이면서도 설득력 있게 작성해.
반드시 순수 JSON만 출력해.

{
  "hero": {
    "headline": "메인 헤드라인 (10자 이내)",
    "subheadline": "서브 헤드라인 (30자 이내)",
    "cta": "CTA 버튼 텍스트"
  },
  "features": [
    { "icon": "이모지", "title": "기능명", "description": "설명 (20자 이내)" }
  ],
  "social_proof": {
    "stat1": { "number": "숫자", "label": "설명" },
    "stat2": { "number": "숫자", "label": "설명" },
    "stat3": { "number": "숫자", "label": "설명" }
  },
  "pricing": [
    { "plan": "플랜명", "price": "가격", "features": ["기능1", "기능2"], "cta": "버튼 텍스트", "popular": false }
  ],
  "faq": [
    { "question": "질문", "answer": "답변" }
  ],
  "final_cta": {
    "headline": "마지막 설득 문구",
    "cta": "최종 CTA 버튼"
  }
}\`,
  message: \`제품: \${product.name}
설명: \${product.description}
타겟: \${product.target}
가격: Free(\${product.pricing.free}), Pro(\${product.pricing.pro}), Enterprise(\${product.pricing.enterprise})\`,
});

try {
  const copy = JSON.parse(result);
  console.log("═══════════════════════════════════════");
  console.log(\`  🎯 \${copy.hero.headline}\`);
  console.log(\`  \${copy.hero.subheadline}\`);
  console.log(\`  [ \${copy.hero.cta} ]\`);
  console.log("═══════════════════════════════════════");

  console.log("\\n✨ 주요 기능");
  copy.features.forEach((f: { icon: string; title: string; description: string }) => {
    console.log(\`  \${f.icon} \${f.title} — \${f.description}\`);
  });

  console.log("\\n📊 신뢰 지표");
  const sp = copy.social_proof;
  console.log(\`  \${sp.stat1.number} \${sp.stat1.label} · \${sp.stat2.number} \${sp.stat2.label} · \${sp.stat3.number} \${sp.stat3.label}\`);

  console.log("\\n💰 가격표");
  copy.pricing.forEach((p: { plan: string; price: string; popular: boolean; features: string[]; cta: string }) => {
    const badge = p.popular ? " ⭐ 인기" : "";
    console.log(\`  ┌─ \${p.plan}\${badge} ─ \${p.price} ─┐\`);
    p.features.forEach((f: string) => console.log(\`  │ ✓ \${f}\`));
    console.log(\`  └─ [ \${p.cta} ] ─┘\\n\`);
  });

  console.log(\`🚀 \${copy.final_cta.headline}\`);
  console.log(\`   [ \${copy.final_cta.cta} ]\`);
} catch {
  console.log("AI 응답:", result);
}`,
      hints: [
        "hero.headline은 짧을수록 임팩트가 강해요 — 10자 이내가 황금 법칙",
        "social_proof에 구체적인 숫자가 있으면 신뢰도가 확 올라갑니다",
        "pricing에 popular: true인 플랜을 하나 두면 '앵커링 효과'가 생겨요",
      ],
    },

    // ─── Part A: LLM Cell 3 — 베타 피드백 분석 ───
    {
      type: "markdown",
      source: `### 실습 3: AI 베타 피드백 분석기 📝

베타 유저들의 자유 형식 피드백을 AI가 **카테고리 분류, 감정 분석, 우선순위 매기기**를 해줍니다.

> 🎯 핵심: 비정형 텍스트를 구조화된 인사이트로 변환하는 ==텍스트 마이닝== 기법`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `import { chat } from "@/lib/llm";

// 📝 베타 유저 피드백 (실제 서비스에서 수집된 것 가정)
const feedbacks = [
  "추천 정확도가 놀라워요! 근데 앱이 좀 느려요. 로딩 3초 이상 걸릴 때가 있어요.",
  "책 추천은 좋은데 구독 해지가 너무 어려워요. 설정에서 찾기 힘들었어요.",
  "완전 최고! 매주 추천받은 책 중 하나는 꼭 읽게 돼요. 독서 기록 기능도 추가해주세요.",
  "가격이 좀 비싼 것 같아요. 학생 할인 있으면 좋겠어요.",
  "UI가 예쁘고 깔끔해요. 다만 다크모드가 없어서 밤에 눈이 아파요.",
  "친구한테 추천했더니 가입했어요! 근데 소셜 공유 기능이 없네요.",
  "추천 알고리즘이 내 취향을 정확히 파악한 게 신기해요. 이대로만 가면 대박!",
  "앱 크래시가 가끔 나요. iOS 17에서 특히 심한 것 같아요.",
];

const result = await chat({
  model: "gemini-2.0-flash",
  system: \`너는 SaaS 제품 매니저야. 베타 피드백을 분석해서 JSON으로 정리해.
반드시 순수 JSON만 출력해.

{
  "summary": "전체 요약 (2줄)",
  "sentiment": { "positive": 0, "neutral": 0, "negative": 0 },
  "nps_estimate": 0~100,
  "categories": [
    {
      "name": "카테고리명",
      "count": 0,
      "priority": "P0|P1|P2",
      "items": [
        { "feedback": "원문 요약", "sentiment": "+|-|=", "action": "조치 사항" }
      ]
    }
  ],
  "top_actions": [
    { "priority": "P0|P1|P2", "action": "해야 할 일", "impact": "예상 효과", "effort": "S|M|L" }
  ],
  "killer_quote": "마케팅에 쓸 수 있는 최고의 유저 멘트"
}\`,
  message: \`피드백 \${feedbacks.length}건:\\n\${feedbacks.map((f, i) => \`\${i + 1}. \${f}\`).join("\\n")}\`,
});

try {
  const analysis = JSON.parse(result);
  console.log("📊 베타 피드백 분석 리포트\\n");
  console.log(\`📝 요약: \${analysis.summary}\\n\`);

  const s = analysis.sentiment;
  const total = s.positive + s.neutral + s.negative;
  console.log(\`😊 긍정: \${"█".repeat(Math.round(s.positive / total * 20))} \${s.positive}건\`);
  console.log(\`😐 중립: \${"█".repeat(Math.round(s.neutral / total * 20))} \${s.neutral}건\`);
  console.log(\`😞 부정: \${"█".repeat(Math.round(s.negative / total * 20))} \${s.negative}건\`);
  console.log(\`\\n📈 추정 NPS: \${analysis.nps_estimate}\\n\`);

  console.log("🏷️ 카테고리별 분석");
  analysis.categories.forEach((cat: { name: string; count: number; priority: string; items: { feedback: string; sentiment: string; action: string }[] }) => {
    console.log(\`\\n  [\${cat.priority}] \${cat.name} (\${cat.count}건)\`);
    cat.items.forEach((item) => {
      const emoji = item.sentiment === "+" ? "👍" : item.sentiment === "-" ? "👎" : "➖";
      console.log(\`    \${emoji} \${item.feedback}\`);
      console.log(\`       → \${item.action}\`);
    });
  });

  console.log("\\n\\n🎯 우선순위 액션 플랜");
  analysis.top_actions.forEach((a: { priority: string; action: string; impact: string; effort: string }, i: number) => {
    console.log(\`  \${i + 1}. [\${a.priority}] \${a.action} (효과: \${a.impact}, 공수: \${a.effort})\`);
  });

  console.log(\`\\n💬 킬러 인용: "\${analysis.killer_quote}"\`);
} catch {
  console.log("AI 응답:", result);
}`,
      hints: [
        "P0(즉시 수정) / P1(이번 스프린트) / P2(백로그) 분류가 PM의 핵심 스킬이에요",
        "NPS(Net Promoter Score)는 고객 충성도를 측정하는 지표예요",
        "effort를 S/M/L로 구분하면 우선순위 판단이 쉬워집니다",
      ],
    },

    // ─── Part A: LLM Cell 4 — 성장 지표 해석 ───
    {
      type: "markdown",
      source: `### 실습 4: AI 성장 지표 해석기 📈

==MRR==, ==Churn Rate==, ==CAC==, ==LTV== 같은 SaaS 핵심 지표를 AI가 분석하고, 성장 전략을 제안합니다.

> 🎯 핵심: 숫자 데이터를 AI가 인사이트로 변환하는 ==비즈니스 인텔리전스== 기법`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `import { chat } from "@/lib/llm";

// 📈 SaaS 성장 지표 (3개월치 데이터)
const metrics = {
  month1: { visits: 5200, signups: 420, activated: 210, paid: 42, churned: 5, revenue: 415800 },
  month2: { visits: 8700, signups: 780, activated: 390, paid: 89, paid_total: 126, churned: 12, revenue: 1247400 },
  month3: { visits: 12400, signups: 1100, activated: 605, paid: 121, paid_total: 235, churned: 18, revenue: 2326500 },
};

const result = await chat({
  model: "gemini-2.0-flash",
  system: \`너는 SaaS 성장 전문 분석가야. 3개월치 핵심 지표를 분석하고 전략을 제안해.
반드시 순수 JSON만 출력해.

{
  "funnel": {
    "visit_to_signup": "전환율%",
    "signup_to_active": "전환율%",
    "active_to_paid": "전환율%",
    "overall": "방문→결제 전환율%"
  },
  "growth": {
    "mrr": "월 반복 수익",
    "mrr_growth": "MRR 증가율%",
    "arr_projection": "연간 예상 수익",
    "churn_rate": "이탈률%",
    "ltv": "고객 생애 가치",
    "cac_estimate": "고객 획득 비용 (추정)"
  },
  "health": {
    "score": 0~100,
    "stage": "Pre-Seed|Seed|Series A|Growth",
    "strengths": ["강점1", "강점2"],
    "weaknesses": ["약점1", "약점2"]
  },
  "strategy": [
    { "area": "영역", "action": "전략", "expected_impact": "예상 효과", "timeline": "기간" }
  ],
  "one_liner": "투자자에게 한 줄로 어필할 피치"
}\`,
  message: \`3개월 지표:
Month1: 방문 \${metrics.month1.visits}, 가입 \${metrics.month1.signups}, 활성 \${metrics.month1.activated}, 결제 \${metrics.month1.paid}, 이탈 \${metrics.month1.churned}, 매출 ₩\${metrics.month1.revenue.toLocaleString()}
Month2: 방문 \${metrics.month2.visits}, 가입 \${metrics.month2.signups}, 활성 \${metrics.month2.activated}, 결제 \${metrics.month2.paid}(누적 \${metrics.month2.paid_total}), 이탈 \${metrics.month2.churned}, 매출 ₩\${metrics.month2.revenue.toLocaleString()}
Month3: 방문 \${metrics.month3.visits}, 가입 \${metrics.month3.signups}, 활성 \${metrics.month3.activated}, 결제 \${metrics.month3.paid}(누적 \${metrics.month3.paid_total}), 이탈 \${metrics.month3.churned}, 매출 ₩\${metrics.month3.revenue.toLocaleString()}
구독료: ₩9,900/월\`,
});

try {
  const report = JSON.parse(result);
  console.log("════════════════════════════════════════");
  console.log("  📈 SaaS 성장 분석 리포트");
  console.log("════════════════════════════════════════\\n");

  console.log("🔽 퍼널 전환율");
  console.log(\`  방문 → 가입: \${report.funnel.visit_to_signup}\`);
  console.log(\`  가입 → 활성: \${report.funnel.signup_to_active}\`);
  console.log(\`  활성 → 결제: \${report.funnel.active_to_paid}\`);
  console.log(\`  전체(방문→결제): \${report.funnel.overall}\\n\`);

  console.log("💰 수익 지표");
  console.log(\`  MRR: \${report.growth.mrr} (성장률: \${report.growth.mrr_growth})\`);
  console.log(\`  ARR 전망: \${report.growth.arr_projection}\`);
  console.log(\`  이탈률: \${report.growth.churn_rate}\`);
  console.log(\`  LTV: \${report.growth.ltv}\`);
  console.log(\`  CAC 추정: \${report.growth.cac_estimate}\\n\`);

  const h = report.health;
  console.log(\`🏥 건강 점수: \${"█".repeat(Math.floor(h.score / 10))}\${"░".repeat(10 - Math.floor(h.score / 10))} \${h.score}/100 → \${h.stage}\`);
  console.log(\`  💪 강점: \${h.strengths.join(", ")}\`);
  console.log(\`  ⚠️ 약점: \${h.weaknesses.join(", ")}\\n\`);

  console.log("🎯 성장 전략");
  report.strategy.forEach((s: { area: string; action: string; expected_impact: string; timeline: string }, i: number) => {
    console.log(\`  \${i + 1}. [\${s.area}] \${s.action}\`);
    console.log(\`     효과: \${s.expected_impact} · 기간: \${s.timeline}\`);
  });

  console.log(\`\\n🎤 원라인 피치: "\${report.one_liner}"\`);
} catch {
  console.log("AI 응답:", result);
}`,
      hints: [
        "MRR(Monthly Recurring Revenue)은 SaaS의 생명줄이에요",
        "LTV/CAC 비율이 3:1 이상이면 건강한 비즈니스입니다",
        "Churn Rate가 5% 이하면 양호, 10% 이상이면 위험 신호예요",
      ],
    },

    // ─── Part B: 풀스택 SaaS MVP 레시피 ───
    {
      type: "markdown",
      source: `---

## Part B: 풀스택 SaaS MVP 만들기 🏗️

> 🛠️ 아래 레시피를 **Claude Code** 또는 **Cursor**에 붙여 넣으면 완전한 SaaS MVP가 만들어집니다!

### 📐 시스템 아키텍처

\`\`\`
┌─ 프론트엔드 (React + Vite) ─────────────────────────────┐
│                                                          │
│  📄 Pages                          🧩 Components         │
│  ├─ LandingPage                   ├─ LandingBuilder      │
│  ├─ WaitlistPage                  ├─ WaitlistForm        │
│  ├─ AuthPage (로그인/가입)         ├─ BetaFeedbackForm    │
│  ├─ OnboardingPage                ├─ IdeaValidator       │
│  ├─ DashboardPage                 ├─ PricingTable        │
│  ├─ AdminPage                     ├─ FunnelChart         │
│  ├─ AppPage (핵심 SaaS 기능)      ├─ MRRChart            │
│  └─ BetaFeedbackPage              └─ ChurnChart          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  🔌 Services                                             │
│  ├─ supabase.ts (Auth + DB + RLS)                        │
│  ├─ gemini.ts (@google/genai)                            │
│  └─ stripe.ts (Checkout + Subscriptions)                 │
└──────────────────────────────────────────────────────────┘
          │              │               │
          ▼              ▼               ▼
   ┌─ Supabase ─┐  ┌─ Gemini ─┐  ┌─ Stripe ─┐
   │ Auth       │  │ 아이디어  │  │ 구독     │
   │ PostgreSQL │  │   검증    │  │ 결제     │
   │ RLS        │  │ 카피 생성 │  │ 웹훅     │
   │ Realtime   │  │ 피드백    │  │ 청구서   │
   └────────────┘  │   분석    │  └──────────┘
                   └──────────┘
\`\`\`

### 🗃️ 데이터베이스 스키마 (Supabase)

\`\`\`
profiles
├── id (uuid, PK → auth.users)
├── email (text)
├── name (text)
├── role ('user' | 'admin')
├── onboarding_completed (boolean, default false)
├── subscription_tier ('free' | 'pro' | 'enterprise')
├── stripe_customer_id (text, nullable)
└── created_at (timestamptz)

waitlist
├── id (uuid, PK)
├── email (text, unique)
├── referral_source (text, nullable)
├── signed_up_at (timestamptz)
└── converted (boolean, default false)

landing_pages
├── id (uuid, PK)
├── user_id (uuid → profiles)
├── slug (text, unique)
├── hero_headline (text)
├── hero_subheadline (text)
├── hero_cta (text)
├── features (jsonb)         ← [{ icon, title, description }]
├── pricing (jsonb)          ← [{ plan, price, features, popular }]
├── social_proof (jsonb)
├── faq (jsonb)
├── theme ('light' | 'dark' | 'gradient')
├── published (boolean, default false)
└── created_at (timestamptz)

beta_feedback
├── id (uuid, PK)
├── user_id (uuid → profiles, nullable)
├── email (text)
├── feedback_text (text)
├── category (text, nullable)    ← AI 자동 분류
├── sentiment (text, nullable)   ← positive/neutral/negative
├── priority (text, nullable)    ← P0/P1/P2
├── ai_analysis (jsonb, nullable)
└── submitted_at (timestamptz)

idea_validations
├── id (uuid, PK)
├── user_id (uuid → profiles)
├── idea_text (text)
├── analysis (jsonb)       ← AI 분석 결과 (market, competition, feasibility)
├── overall_score (integer)
├── verdict (text)         ← GO / PIVOT / STOP
└── created_at (timestamptz)

subscriptions
├── id (uuid, PK)
├── user_id (uuid → profiles)
├── stripe_subscription_id (text)
├── tier ('free' | 'pro' | 'enterprise')
├── status ('active' | 'canceled' | 'past_due')
├── current_period_start (timestamptz)
├── current_period_end (timestamptz)
└── created_at (timestamptz)

analytics_events
├── id (uuid, PK)
├── event_type (text)      ← 'visit' | 'signup' | 'activate' | 'pay' | 'churn'
├── user_id (uuid, nullable)
├── metadata (jsonb)
└── created_at (timestamptz)
\`\`\`

---

### 🚀 Claude Code / Cursor 프롬프트

아래 프롬프트를 복사해서 터미널(Claude Code) 또는 Composer(Cursor) 에 붙여 넣으세요:

\`\`\`
AI 스타트업 런치패드를 만들어줘. 아이디어 하나로 시작해서 실제 런칭까지 가능한 풀스택 SaaS MVP야.

[기술 스택]
- React + TypeScript + Vite + Tailwind CSS
- Supabase (Auth + PostgreSQL + RLS + Realtime)
- @google/genai (Gemini 2.0 Flash)
- Stripe (Checkout + Subscriptions + Customer Portal)
- recharts (대시보드 차트)
- react-router-dom (라우팅)
- react-hook-form + zod (폼 검증)

[필수 기능]

1. AI 비즈니스 아이디어 검증기
   - 아이디어 텍스트 입력
   - Gemini로 시장 규모, 경쟁 현황, 실현 가능성 분석
   - 종합 점수 (0~100) + 판정 (GO / PIVOT / STOP)
   - 분석 결과 저장 (idea_validations 테이블)
   - 이전 검증 이력 조회

2. AI 랜딩 페이지 빌더
   - 아이디어 기반으로 AI가 전체 카피 자동 생성
   - 섹션: Hero, Features, Social Proof, Pricing, FAQ, Final CTA
   - 테마 선택 (light / dark / gradient)
   - 실시간 미리보기 (split view)
   - 퍼블리싱 → 고유 slug URL로 공개
   - 카피 직접 수정도 가능 (AI 생성 후 편집)

3. 웨이트리스트 시스템
   - 랜딩 페이지의 CTA → 이메일 수집 폼
   - Supabase에 waitlist 저장
   - 중복 이메일 방지
   - 유입 경로(referral_source) 추적
   - 관리자: 웨이트리스트 목록 조회 + CSV 다운로드

4. 베타 피드백 수집 + AI 분석
   - 베타 유저용 피드백 제출 폼 (react-hook-form + zod)
   - 자유 형식 텍스트 + 선택 카테고리
   - AI 자동 분류: 카테고리, 감정, 우선순위 (P0/P1/P2)
   - 관리자: 피드백 대시보드 (카테고리별, 감정별 필터)
   - AI 종합 분석 버튼 (전체 피드백 요약 리포트)

5. 인증 + 온보딩
   - Supabase Auth (이메일/비밀번호 + Google OAuth)
   - 첫 로그인 시 온보딩 플로우 (3단계: 프로필, 목표, 플랜 선택)
   - 역할: user / admin
   - 프로필 관리

6. 핵심 SaaS 기능 (AI 파워드, 커스터마이징 가능)
   - 아이디어 검증 결과 기반으로 AI가 액션 플랜 생성
   - 경쟁사 분석 상세 리포트
   - 주간 인사이트 요약 (AI가 지표 변화 해석)
   - Pro 이상: 무제한 검증, 상세 리포트, 커스텀 분석

7. Stripe 구독 결제
   - 3가지 티어: Free / Pro (₩9,900/월) / Enterprise (₩29,900/월)
   - Free: 월 3회 검증, 기본 랜딩 1개
   - Pro: 무제한 검증, 랜딩 5개, 상세 분석
   - Enterprise: 전체 기능 + 팀 관리 + API 접근
   - Stripe Checkout Session으로 결제
   - Stripe Customer Portal로 구독 관리
   - 결제 성공 → subscriptions 테이블 + profiles.subscription_tier 업데이트

8. 관리자 대시보드
   - 전체 사용자 수, 구독자 분포, 매출 현황
   - MRR(Monthly Recurring Revenue) 차트 (recharts)
   - Churn Rate 추이 차트
   - 웨이트리스트 전환율
   - 피드백 요약 (AI 분석 결과)

9. 성장 대시보드 (사용자용)
   - 퍼널: 방문 → 가입 → 활성 → 결제
   - analytics_events 테이블 기반 집계
   - 주간/월간 추이 그래프
   - 이탈 지점 분석
   - 핵심 지표: MRR, Churn, LTV, CAC 추정

10. UI/UX
    - 다크/라이트 모드 토글
    - 반응형 (모바일/태블릿/데스크톱)
    - 로딩 스켈레톤 + 스피너
    - Toast 알림 (성공/에러/정보)
    - 사이드바 네비게이션 (대시보드)
    - 히어로 애니메이션 (랜딩 페이지)

[Supabase RLS 정책]
- profiles: 본인만 읽기/수정, admin은 전체 읽기
- waitlist: 누구나 insert (이메일 수집), admin만 select
- landing_pages: 본인만 CRUD, published=true면 누구나 읽기
- beta_feedback: 누구나 insert, 본인 + admin만 select
- idea_validations: 본인만 CRUD
- subscriptions: 본인만 읽기, 서버만 수정
- analytics_events: 서버만 insert, admin만 select

[환경 변수]
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret (서버 사이드용)
\`\`\`

---

### 📁 예상 폴더 구조

\`\`\`
src/
├── components/
│   ├── auth/              # LoginForm, SignupForm, AuthGuard
│   ├── landing/           # LandingBuilder, LandingPreview, SectionEditor
│   ├── waitlist/          # WaitlistForm, WaitlistTable
│   ├── feedback/          # FeedbackForm, FeedbackDashboard, FeedbackAnalysis
│   ├── idea/              # IdeaValidator, IdeaHistory, ScoreDisplay
│   ├── onboarding/        # OnboardingWizard, StepProfile, StepGoal, StepPlan
│   ├── dashboard/         # AdminDashboard, GrowthDashboard, FunnelChart
│   ├── pricing/           # PricingTable, PlanCard, FeatureComparison
│   ├── charts/            # MRRChart, ChurnChart, FunnelChart, GrowthLine
│   └── ui/                # Button, Card, Modal, Toast, Skeleton, Sidebar
├── hooks/
│   ├── useAuth.ts
│   ├── useLanding.ts
│   ├── useWaitlist.ts
│   ├── useFeedback.ts
│   ├── useIdea.ts
│   ├── useSubscription.ts
│   └── useAnalytics.ts
├── lib/
│   ├── supabase.ts        # Supabase 클라이언트
│   ├── gemini.ts          # Gemini AI 클라이언트
│   ├── stripe.ts          # Stripe 클라이언트
│   └── analytics.ts       # 이벤트 추적 유틸
├── pages/
│   ├── Landing.tsx         # 마케팅 랜딩 페이지
│   ├── PublicLanding.tsx   # 사용자가 만든 랜딩 (slug)
│   ├── Waitlist.tsx
│   ├── Auth.tsx
│   ├── Onboarding.tsx
│   ├── Dashboard.tsx
│   ├── Admin.tsx
│   ├── App.tsx             # 핵심 SaaS 기능
│   ├── Feedback.tsx
│   └── Pricing.tsx
├── types/
│   └── database.ts         # Supabase 타입
├── App.tsx
└── main.tsx
\`\`\``,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

MVP가 완성되면 진짜 스타트업으로 한 단계 더 나아가 보세요!

### 도전 1: AI 경쟁사 실시간 모니터링 🕵️
\`\`\`
경쟁사 웹사이트를 주기적으로 분석하는 기능을 추가해줘.

- 경쟁사 URL 등록 (최대 5개)
- 정기적으로 변경 사항 감지 (가격, 기능, 포지셔닝)
- AI가 변경 사항 요약 + 대응 전략 제안
- 이메일 또는 인앱 알림
- W30 웹 스크래퍼 기술 활용
\`\`\`

### 도전 2: A/B 테스트 엔진 🧪
\`\`\`
랜딩 페이지에 A/B 테스트 기능을 추가해줘.

- 히어로 헤드라인, CTA 텍스트, 가격표 변형 생성
- 방문자를 무작위로 A/B 그룹에 배정
- 전환율 비교 (가입률, 클릭률)
- 통계적 유의성 계산 (p-value)
- AI가 승자 분석 + 다음 실험 제안
\`\`\`

### 도전 3: 투자자 피치덱 생성기 📊
\`\`\`
현재 지표와 아이디어를 기반으로 투자자 피치덱을 자동 생성해줘.

- 10장 슬라이드 자동 구성 (문제, 해결, 시장, 경쟁, 비즈모델, 견인력, 팀, 재무, 요청, 비전)
- 실제 지표 데이터 자동 삽입 (MRR, 성장률, 유저 수)
- AI가 각 슬라이드 스크립트도 작성
- PDF/PPTX 다운로드
- W28 프레젠테이션 메이커 기술 활용
\`\`\`

### 도전 4: 팀 협업 + 역할 관리 👥
\`\`\`
Enterprise 티어에 팀 기능을 추가해줘.

- 팀 생성 + 멤버 초대 (이메일)
- 역할: owner / editor / viewer
- 공유 대시보드 (팀 전체 지표)
- 댓글 + 멘션 기능 (아이디어, 피드백에)
- 활동 로그 (누가 뭘 했는지)
- W39 커뮤니티 기술 활용
\`\`\`

### 도전 5: 자동 마케팅 파이프라인 📧
\`\`\`
웨이트리스트 → 온보딩 → 전환까지 자동 이메일 마케팅을 추가해줘.

- 웨이트리스트 등록 → 환영 이메일 (AI 작성)
- 3일 후 제품 소개 이메일
- 7일 후 베타 초대 이메일
- 비활성 유저 → 리인게이지먼트 이메일
- AI가 이메일 제목 A/B 테스트
- Resend 또는 Supabase Edge Functions 활용
\`\`\``,
    },

    // ─── 핵심 개념 정리 ───
    {
      type: "markdown",
      source: `## 📚 핵심 개념 정리

### 이 워크샵에서 배운 것

| 개념 | 설명 | 활용 |
|---|---|---|
| ==SaaS== | 서비스형 소프트웨어 (구독 모델) | 월정액으로 소프트웨어를 제공하는 비즈니스 |
| ==MRR== | 월간 반복 매출 | SaaS의 가장 중요한 수익 지표 |
| ==Churn Rate== | 이탈률 | 일정 기간 내 구독을 해지한 비율 |
| ==LTV== | 고객 생애 가치 | 한 고객이 전체 이용 기간 동안 지불하는 총액 |
| ==CAC== | 고객 획득 비용 | 한 명의 유료 고객을 얻는 데 드는 비용 |
| ==NPS== | 순추천지수 | "이 서비스를 추천하겠습니까?" 0~10 점수 |
| ==MVP== | 최소 기능 제품 | 핵심 가설을 검증할 수 있는 최소한의 제품 |
| ==Funnel== | 전환 퍼널 | 방문 → 가입 → 활성 → 결제 단계별 전환 흐름 |
| ==A/B Test== | 대조 실험 | 두 가지 버전을 비교해서 더 나은 쪽을 선택 |
| ==RLS== | 행 수준 보안 | DB 에서 사용자별 접근 권한을 행 단위로 제어 |
| ==Webhook== | 이벤트 알림 | 외부 서비스(Stripe)가 이벤트 발생 시 우리 서버를 호출 |
| ==프롬프트 엔지니어링== | AI 지시 기법 | 원하는 형식과 품질의 AI 출력을 얻는 기술 |

### 🏆 축하합니다! 전체 워크샵 여정을 완주했습니다!

\`\`\`
  W00 ─── W10 ─── W20 ─── W30 ─── W40 🏁
  기초      중급      고급      심화      FINAL BOSS
  │         │         │         │         │
  HTML      풀스택    SaaS      자동화    스타트업
  CSS       React     결제      에이전트  런칭
  JS/TS     Supabase  마케팅    분석      성장
\`\`\`

이제 당신은:
- 🤖 **AI 를 활용해** 아이디어를 검증하고 콘텐츠를 생성할 수 있고
- 🏗️ **풀스택 웹 앱**을 처음부터 끝까지 만들 수 있고
- 💳 **결제 시스템**을 연동해서 실제 수익을 만들 수 있고
- 📈 **데이터 기반**으로 의사결정하고 성장 전략을 세울 수 있습니다

> 🚀 **다음 단계:** 이 MVP를 실제로 배포하고, 첫 번째 유저를 모아보세요. Vercel 에 배포하면 5분이면 됩니다!

### 실무에서 이 기술이 쓰이는 곳

- **Y Combinator 스타트업들** — 빠른 MVP + 데이터 기반 성장
- **Indie Hackers** — 1인 창업자 SaaS 구축
- **Product Hunt** — 런칭 + 웨이트리스트 + 피드백 루프
- **Stripe Atlas** — SaaS 결제 + 구독 관리
- **Vercel / Supabase** — 모던 풀스택 인프라
- **Mixpanel / Amplitude** — 퍼널 분석 + 성장 지표 추적`,
    },
  ],

  quiz: {
    title: "W40: AI 스타트업 런치패드 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "SaaS 비즈니스에서 LTV/CAC 비율이 3:1이라는 것은 무엇을 의미하나요?",
        options: [
          "고객 3명 중 1명이 이탈한다",
          "고객이 생애 동안 지불하는 금액이 획득 비용의 3배다",
          "월 매출이 비용의 3배다",
          "3개월 안에 투자금을 회수한다",
        ],
        correctIndex: 1,
        explanation:
          "LTV(고객 생애 가치)가 CAC(고객 획득 비용)의 3배라는 뜻입니다. 예를 들어 한 고객을 얻는 데 ₩30,000이 들고, 그 고객이 총 ₩90,000을 지불한다면 LTV/CAC = 3:1이에요. 일반적으로 3:1 이상이면 건강한 비즈니스로 봅니다.",
      },
      {
        type: "multiple-choice",
        question:
          "AI가 생성한 랜딩 페이지 카피에서 'Social Proof(사회적 증거)' 섹션이 중요한 이유는?",
        options: [
          "SEO 점수가 올라가서",
          "페이지 로딩 속도가 빨라져서",
          "다른 사람들도 사용한다는 신뢰감을 줘서",
          "AI가 가장 정확하게 생성할 수 있어서",
        ],
        correctIndex: 2,
        explanation:
          "Social Proof(사회적 증거)는 '다른 사람들도 이 서비스를 쓰고 만족한다'는 신호를 보내서 방문자의 신뢰를 높입니다. '10,000명이 사용 중', '4.9점 평점' 같은 구체적인 숫자가 전환율을 크게 높여요.",
      },
      {
        type: "multiple-choice",
        question:
          "베타 피드백을 AI로 분석할 때, P0/P1/P2 우선순위 분류의 기준으로 가장 적절한 것은?",
        options: [
          "피드백 길이가 긴 순서",
          "긍정적인 피드백 우선",
          "서비스 안정성·보안에 영향을 미치는 정도",
          "최근에 제출된 순서",
        ],
        correctIndex: 2,
        explanation:
          "P0(즉시 수정)는 앱 크래시, 데이터 유실, 보안 취약점처럼 서비스 안정성에 직접 영향을 주는 이슈입니다. P1은 사용성 개선, P2는 있으면 좋은 기능(nice-to-have)이에요. 단순히 긍정/부정이나 제출 시간이 아니라, 비즈니스 임팩트가 기준이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "Stripe 구독(Subscription) 모델에서 webhook이 필요한 주된 이유는?",
        options: [
          "결제 페이지 디자인을 커스터마이징하려고",
          "결제 성공/실패/해지 같은 비동기 이벤트를 서버가 받아야 해서",
          "프론트엔드에서 직접 결제를 처리할 수 없어서",
          "결제 속도를 높이기 위해서",
        ],
        correctIndex: 1,
        explanation:
          "Stripe에서 구독 갱신, 결제 실패, 구독 해지 같은 이벤트는 사용자의 브라우저가 아닌 Stripe 서버에서 발생합니다. webhook으로 이 이벤트를 우리 서버가 받아야 DB(subscriptions 테이블)를 정확히 업데이트할 수 있어요. 이것이 없으면 결제 상태와 DB가 불일치해요.",
      },
      {
        type: "predict-output",
        question:
          "다음 코드는 SaaS 퍼널 전환율을 계산합니다. 출력 결과는?",
        code: `const funnel = {
  visits: 10000,
  signups: 2000,
  activated: 800,
  paid: 160,
};

const rates = {
  signup: (funnel.signups / funnel.visits * 100).toFixed(0),
  activate: (funnel.activated / funnel.signups * 100).toFixed(0),
  pay: (funnel.paid / funnel.activated * 100).toFixed(0),
  overall: (funnel.paid / funnel.visits * 100).toFixed(1),
};

console.log(\`가입: \${rates.signup}%, 활성: \${rates.activate}%, 결제: \${rates.pay}%, 전체: \${rates.overall}%\`);`,
        options: [
          "가입: 20%, 활성: 40%, 결제: 20%, 전체: 1.6%",
          "가입: 20%, 활성: 40%, 결제: 20%, 전체: 2.0%",
          "가입: 0.2%, 활성: 0.4%, 결제: 0.2%, 전체: 0.016%",
          "가입: 20%, 활성: 80%, 결제: 16%, 전체: 1.6%",
        ],
        correctIndex: 0,
        explanation:
          "signup: 2000/10000*100 = 20%, activate: 800/2000*100 = 40%, pay: 160/800*100 = 20%, overall: 160/10000*100 = 1.6%. 각 단계별 전환율은 20→40→20%이고, 방문에서 결제까지의 전체 전환율은 1.6%입니다. toFixed(0)은 정수로, toFixed(1)은 소수 첫째자리까지 표시해요.",
      },
    ],
  } satisfies Quiz,
};
