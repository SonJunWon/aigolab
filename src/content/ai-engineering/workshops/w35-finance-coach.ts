import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W35 — AI 가계부 & 재무 코치.
 *
 * Part A: 지출 분류·소비 패턴 분석·절약 코칭을 LLM 으로 체험 (LLM 셀)
 * Part B: MD 레시피로 React+Chart.js 기반 AI 가계부 앱 완성 (Claude Code / Cursor)
 */
export const workshopW35: Lesson = {
  id: "ai-eng-w35-finance-coach",
  language: "ai-engineering",
  track: "beginner",
  order: 135,
  title: "W35: AI 가계부 & 재무 코치",
  subtitle: "영수증 찍으면 자동 입력 + AI가 절약 코칭",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 💰 AI 가계부 & 재무 코치 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**영수증 사진만 찍으면 자동으로 가계부에 입력되고, AI 가 매달 소비 패턴을 분석해서 절약 코칭까지 해주는 앱** — ==OCR==로 영수증을 읽고, AI 가 카테고리를 분류하고, 차트로 한눈에 보여줍니다.

### 완성 모습
\`\`\`
┌─ AI 가계부 & 재무 코치 ──────────────────────────────────────┐
│  💰 My Finance Coach   [📷 영수증]  [✏️ 수동입력]  🌙 다크    │
├──────────────┬───────────────────────────────────────────────┤
│  📊 이번 달   │  🍩 카테고리별 지출 (Pie)                      │
│              │       ┌─────────────┐                         │
│  총 지출      │       │   🍔 식비    │                         │
│  ₩1,247,300  │       │    35%      │                         │
│              │       │  🚌 교통 12% │                         │
│  예산 대비    │       │  🛍️ 쇼핑 18% │                         │
│  ██████░░ 78%│       │  🎬 문화 8%  │                         │
│              │       └─────────────┘                         │
│  ⚠️ 식비 초과! │                                               │
│  ⚠️ 쇼핑 90% │  📈 월별 추이 (Bar)                            │
│              │  ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐                    │
│  최근 내역    │  │  ││  ││  ││  ││  ││▓▓│                    │
│  🍔 점심 8,500│  │▓▓││▓▓││▓▓││▓▓││▓▓││▓▓│                    │
│  🚌 버스 1,400│  1월  2월  3월  4월  5월  6월                    │
│  ☕ 카페 5,200│                                               │
│              ├───────────────────────────────────────────────┤
│              │  🤖 AI 코치 조언                               │
│              │  "이번 달 식비가 예산보다 23% 초과했어요.        │
│              │   점심 외식 빈도를 줄이면 월 ₩45,000 절약       │
│              │   가능해요! 🍱 도시락 2회/주 도전해볼까요?"      │
├──────────────┴───────────────────────────────────────────────┤
│  📂 카테고리: [전체] [식비] [교통] [쇼핑] [문화] [고정비]       │
│  📅 기간: [이번 달 ▾]   [📥 CSV 내보내기]                      │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 지출 분류 + 소비 패턴 분석 + 절약 코칭 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 React+Chart.js AI 가계부 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - Gemini API 키 — 영수증 ==OCR== 에 Gemini Vision 을 사용해요`,
    },

    // ─── Part A: 가계부 AI 엔진 ───
    {
      type: "markdown",
      source: `## Part A: 가계부 AI 엔진 만들기 (50분)

가계부 앱의 핵심은 **귀찮은 입력을 AI 가 대신하고, 쌓인 데이터에서 패턴을 찾아주는 것**이에요.

핵심 기능 3가지:
1. **지출 ==자동 분류==** — 내역 텍스트만 보고 카테고리를 AI 가 판단
2. **소비 패턴 분석** — 월별 데이터를 종합해서 트렌드와 이상 지출 감지
3. **절약 코칭** — 분석 결과를 바탕으로 실천 가능한 절약 팁 생성

> 📌 **==OCR== 이란?** — Optical Character Recognition, 이미지에서 텍스트를 추출하는 기술. 영수증 사진을 넣으면 가게 이름, 금액, 날짜, 품목을 텍스트로 뽑아줘요. Gemini Vision 은 이미지를 직접 이해하는 ==멀티모달== 모델이라 별도 OCR 엔진 없이 가능합니다.`,
    },

    {
      type: "markdown",
      source: `### A-1. 지출 자동 분류기 — 내역 텍스트 → 카테고리

"스타벅스 아메리카노 4,500원" 같은 텍스트를 AI 에게 주면, **카테고리 (식비/교통/쇼핑 등)** 를 자동으로 분류해줍니다. 실제 카드 내역이나 영수증 ==OCR== 결과를 이 분류기에 넣으면 수동 분류가 필요 없어져요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 지출 자동 분류기 — 내역 텍스트 → 카테고리 + 금액 추출
const expenses = [
  "스타벅스 아메리카노 4,500원",
  "카카오택시 강남→홍대 12,800원",
  "쿠팡 로켓배송 - 무선 이어폰 34,900원",
  "CGV 용산 영화 관람 15,000원",
  "KT 인터넷 요금 33,000원",
  "이마트 장보기 67,200원",
  "넷플릭스 프리미엄 17,000원",
  "GS25 삼각김밥 외 3건 8,400원",
];

const systemPrompt = \`너는 가계부 지출 분류 전문가야.
사용자가 보내는 지출 내역 텍스트를 분석해서 JSON 으로 분류해.

[카테고리]
- 식비: 식당, 카페, 배달, 편의점 음식
- 교통: 택시, 버스, 지하철, 주유
- 쇼핑: 의류, 전자기기, 생활용품 구매
- 문화: 영화, 공연, 도서, 게임
- 고정비: 통신, 보험, 구독, 관리비, 공과금
- 기타: 위에 해당 없는 항목

[응답 형식 — JSON 배열]
[
  {
    "text": "원본 내역",
    "store": "가게/서비스명",
    "amount": 숫자(원),
    "category": "카테고리명",
    "subcategory": "세부 분류",
    "confidence": 0.0~1.0
  }
]

[규칙]
- 금액은 숫자만 (콤마, '원' 제거)
- confidence 0.8 미만이면 "기타"로 분류
- 한 건에 여러 품목이면 대표 카테고리 사용\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 지출 내역들을 분류해줘:\\n\${expenses.join("\\n")}\` },
  ],
});

try {
  const items = JSON.parse(res.text);
  console.log("🏷️ 지출 자동 분류 결과");
  console.log("═".repeat(55));

  const categoryIcons: Record<string, string> = {
    식비: "🍔", 교통: "🚌", 쇼핑: "🛍️", 문화: "🎬", 고정비: "🏠", 기타: "📦"
  };

  let total = 0;
  const byCategory: Record<string, number> = {};

  items.forEach((item: any) => {
    const icon = categoryIcons[item.category] || "📦";
    console.log(\`  \${icon} [\${item.category}] \${item.store} — ₩\${item.amount.toLocaleString()} (확신도: \${Math.round(item.confidence * 100)}%)\`);
    total += item.amount;
    byCategory[item.category] = (byCategory[item.category] || 0) + item.amount;
  });

  console.log("\\n📊 카테고리별 합계:");
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, amt]) => {
      const pct = Math.round((amt / total) * 100);
      const bar = "█".repeat(Math.round(pct / 3)) + "░".repeat(Math.max(0, 15 - Math.round(pct / 3)));
      console.log(\`  \${categoryIcons[cat] || "📦"} \${cat.padEnd(4)} \${bar} \${pct}% (₩\${amt.toLocaleString()})\`);
    });

  console.log(\`\\n💰 총 지출: ₩\${total.toLocaleString()}\`);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 텍스트만 보고 AI 가 가게명·금액·카테고리를 자동으로 추출해요.",
        "confidence 값을 두면 애매한 항목을 '기타'로 분류하고 사용자에게 확인받을 수 있어요.",
        "실제 앱에서는 카드사 API 나 영수증 OCR 결과가 이 분류기의 입력이 됩니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 소비 패턴 분석기 — 월별 데이터 → 트렌드 & 이상 감지

한 달치 지출 데이터를 AI 에게 주면, **어떤 카테고리가 늘었는지, 이상 지출은 없는지, 전월 대비 변화**를 분석해줍니다. 차트를 그리기 전에 "무엇을 보여줘야 하는지"를 AI 가 정리해주는 거예요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 소비 패턴 분석기 — 월별 데이터 → 트렌드 인사이트
const monthlyData = {
  summary: {
    month: "2026년 3월",
    totalExpense: 1247300,
    budget: 1500000,
    transactionCount: 87,
  },
  byCategory: {
    식비: { amount: 436500, count: 34, budget: 400000 },
    교통: { amount: 149600, count: 18, budget: 150000 },
    쇼핑: { amount: 224700, count: 8, budget: 200000 },
    문화: { amount: 98000, count: 5, budget: 100000 },
    고정비: { amount: 263500, count: 7, budget: 270000 },
    기타: { amount: 75000, count: 15, budget: 100000 },
  },
  previousMonth: {
    totalExpense: 1098700,
    byCategory: {
      식비: 382000, 교통: 134200, 쇼핑: 156000,
      문화: 112500, 고정비: 263500, 기타: 50500,
    },
  },
  topExpenses: [
    { store: "쿠팡", amount: 89700, category: "쇼핑" },
    { store: "배달의민족", amount: 67200, category: "식비" },
    { store: "카카오택시", amount: 45600, category: "교통" },
  ],
};

const systemPrompt = \`너는 개인 재무 분석 전문가야.
월별 지출 데이터를 분석해서 소비 패턴 인사이트를 JSON 으로 제공해.

[응답 형식]
{
  "overview": "한 줄 요약",
  "budgetStatus": "전체 예산 대비 상태 평가",
  "trends": [
    {
      "category": "카테고리",
      "trend": "increase|decrease|stable",
      "changePercent": 숫자,
      "insight": "설명"
    }
  ],
  "alerts": [
    { "type": "over_budget|spike|unusual", "category": "카테고리", "message": "경고 메시지" }
  ],
  "topPatterns": [
    { "pattern": "패턴 설명", "impact": "영향", "suggestion": "제안" }
  ]
}

[규칙]
- 전월 대비 10% 이상 변화한 카테고리만 trends 에 포함
- 예산 초과 카테고리는 반드시 alerts 에 포함
- topPatterns 는 최대 3개, 실행 가능한 제안 포함
- 한국어로 작성\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 월별 지출 데이터를 분석해줘:\\n\${JSON.stringify(monthlyData, null, 2)}\` },
  ],
});

try {
  const analysis = JSON.parse(res.text);
  console.log("📊 소비 패턴 분석 리포트");
  console.log("═".repeat(55));
  console.log("📌", analysis.overview);
  console.log("💳", analysis.budgetStatus);

  if (analysis.trends?.length) {
    console.log("\\n📈 주요 트렌드:");
    const trendIcon: Record<string, string> = { increase: "🔺", decrease: "🔻", stable: "➡️" };
    analysis.trends.forEach((t: any) =>
      console.log(\`  \${trendIcon[t.trend] || "➡️"} \${t.category}: \${t.changePercent > 0 ? "+" : ""}\${t.changePercent}% — \${t.insight}\`)
    );
  }

  if (analysis.alerts?.length) {
    console.log("\\n⚠️ 경고:");
    analysis.alerts.forEach((a: any) =>
      console.log(\`  🚨 [\${a.type}] \${a.category}: \${a.message}\`)
    );
  }

  if (analysis.topPatterns?.length) {
    console.log("\\n🔍 핵심 패턴:");
    analysis.topPatterns.forEach((p: any, i: number) => {
      console.log(\`  \${i + 1}. \${p.pattern}\`);
      console.log(\`     영향: \${p.impact}\`);
      console.log(\`     제안: \${p.suggestion}\`);
    });
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 숫자 데이터를 AI 가 해석해서 '무엇이 문제인지' 알려줘요.",
        "전월 대비 변화율을 계산해주면 AI 가 더 정확한 트렌드를 파악해요.",
        "alerts 는 앱에서 빨간 배지나 푸시 알림으로 표시할 수 있어요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. AI 절약 코치 — 패턴 기반 실천 팁 생성

분석 결과를 바탕으로 **구체적이고 실천 가능한 절약 팁**을 생성합니다. "돈을 아끼세요" 같은 뻔한 조언이 아니라, 실제 소비 데이터를 기반으로 "화요일 점심 외식을 도시락으로 바꾸면 월 ₩52,000 절약" 같은 ==개인화== 된 코칭을 해줘요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// AI 절약 코치 — 소비 패턴 기반 맞춤 절약 팁
const userProfile = {
  monthlyIncome: 3200000,
  savingsGoal: 500000,
  currentSavings: 252700,  // 수입 - 지출
  habits: "주 3회 외식, 주말 카페 빈도 높음, 택시 이용 잦음",
  topSpending: [
    { category: "식비", amount: 436500, details: "배달 15회, 외식 12회, 카페 7회" },
    { category: "쇼핑", amount: 224700, details: "쿠팡 5회, 의류 2회, 전자기기 1회" },
    { category: "교통", amount: 149600, details: "택시 11회, 대중교통 7회" },
  ],
  alerts: ["식비 예산 초과 (109%)", "쇼핑 예산 임박 (112%)"],
};

const systemPrompt = \`너는 친근하고 실용적인 AI 재무 코치야.
사용자의 소비 데이터를 보고, 실천 가능한 절약 팁을 JSON 으로 제공해.

[응답 형식]
{
  "greeting": "한 줄 격려/공감 인사",
  "savingsGap": "목표 저축 vs 현재 차이 분석",
  "weeklyTips": [
    {
      "title": "팁 제목",
      "category": "관련 카테고리",
      "action": "구체적 행동",
      "expectedSaving": 예상 절약 금액(월),
      "difficulty": "easy|medium|hard",
      "emoji": "관련 이모지"
    }
  ],
  "monthlyChallenge": {
    "title": "이번 달 챌린지",
    "description": "설명",
    "target": "목표 금액",
    "steps": ["실천 단계들"]
  },
  "encouragement": "마무리 격려 메시지"
}

[규칙]
- 최소 4개 팁 제공, 각각 구체적 금액 명시
- 절약 금액 합이 저축 목표 갭을 메울 수 있어야 함
- 무리한 제안 금지 (예: "외식 완전 금지")
- 재미 요소 포함 (챌린지, 이모지)
- 한국어, 반말 친근체\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`내 소비 데이터를 보고 절약 코칭해줘:\\n\${JSON.stringify(userProfile, null, 2)}\` },
  ],
});

try {
  const coach = JSON.parse(res.text);
  console.log("🤖 AI 재무 코치");
  console.log("═".repeat(55));
  console.log("💬", coach.greeting);
  console.log("\\n📊 저축 상태:", coach.savingsGap);

  if (coach.weeklyTips?.length) {
    console.log("\\n💡 이번 주 절약 팁:");
    const diffIcon: Record<string, string> = { easy: "🟢", medium: "🟡", hard: "🔴" };
    coach.weeklyTips.forEach((tip: any, i: number) => {
      console.log(\`\\n  \${tip.emoji || "💡"} \${i + 1}. \${tip.title} \${diffIcon[tip.difficulty] || ""}\`);
      console.log(\`     📂 \${tip.category} | 🎯 \${tip.action}\`);
      console.log(\`     💰 예상 절약: 월 ₩\${tip.expectedSaving?.toLocaleString()}\`);
    });

    const totalSaving = coach.weeklyTips.reduce((s: number, t: any) => s + (t.expectedSaving || 0), 0);
    console.log(\`\\n  📈 팁 전체 실천 시 월 ₩\${totalSaving.toLocaleString()} 절약 가능!\`);
  }

  if (coach.monthlyChallenge) {
    const c = coach.monthlyChallenge;
    console.log("\\n🏆 이번 달 챌린지:", c.title);
    console.log("   ", c.description);
    console.log("   🎯 목표:", c.target);
    c.steps?.forEach((s: string, i: number) => console.log(\`   \${i + 1}. \${s}\`));
  }

  console.log("\\n✨", coach.encouragement);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 뻔한 조언이 아니라 실제 데이터 기반 '개인화된' 코칭이에요.",
        "difficulty 를 두면 사용자가 쉬운 것부터 실천할 수 있어요.",
        "monthlyChallenge 는 게이미피케이션 — 절약을 게임처럼 만들어줘요.",
      ],
    },

    // ─── Part B: MD 레시피 ───
    {
      type: "markdown",
      source: `## Part B: AI 가계부 앱 만들기 — 레시피 (100분)

> 🛠️ **이 레시피를 Claude Code 나 Cursor 에 복사**해서 완성하세요!

### 기술 스택

| 도구 | 용도 |
|---|---|
| **React + TypeScript + Vite** | 앱 프레임워크 |
| **Tailwind CSS** | 스타일링 + 다크모드 |
| **@google/generative-ai** | Gemini Vision ==OCR== + 지출 분류 + 코칭 |
| **Chart.js + react-chartjs-2** | 파이 · 바 · 라인 차트 |
| **localStorage** | 지출 데이터 영구 저장 |

### 프로젝트 셋업

\`\`\`bash
npm create vite@latest ai-finance-coach -- --template react-ts
cd ai-finance-coach
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install @google/generative-ai chart.js react-chartjs-2
\`\`\`

\`\`\`ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
\`\`\`

\`\`\`css
/* src/index.css */
@import "tailwindcss";
\`\`\`

### 핵심 데이터 타입

\`\`\`ts
// src/types.ts
export type Category = "식비" | "교통" | "쇼핑" | "문화" | "고정비" | "기타";

export interface Expense {
  id: string;
  date: string;          // "2026-03-15"
  store: string;         // "스타벅스"
  amount: number;        // 4500
  category: Category;
  subcategory?: string;  // "카페"
  memo?: string;
  source: "manual" | "ocr";  // 입력 방식
}

export interface Budget {
  category: Category;
  limit: number;         // 월 예산
}

export interface MonthlyReport {
  month: string;
  totalExpense: number;
  byCategory: Record<Category, { amount: number; count: number }>;
  aiInsight?: string;
}

export const CATEGORY_CONFIG: Record<Category, { icon: string; color: string }> = {
  식비: { icon: "🍔", color: "#FF6384" },
  교통: { icon: "🚌", color: "#36A2EB" },
  쇼핑: { icon: "🛍️", color: "#FFCE56" },
  문화: { icon: "🎬", color: "#4BC0C0" },
  고정비: { icon: "🏠", color: "#9966FF" },
  기타: { icon: "📦", color: "#FF9F40" },
};
\`\`\`

### 기능 1: 영수증 OCR (Gemini Vision)

\`\`\`ts
// src/lib/ocr.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

export async function extractReceipt(imageBase64: string): Promise<{
  store: string; amount: number; date: string; items: string[];
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    },
    \`이 영수증 이미지를 분석해서 다음 JSON 형식으로 추출해줘:
{
  "store": "가게명",
  "amount": 총금액(숫자),
  "date": "YYYY-MM-DD",
  "items": ["품목1 금액", "품목2 금액"]
}
한국어 영수증이야. 금액은 숫자만. 날짜를 못 찾으면 오늘 날짜 사용.\`,
  ]);

  return JSON.parse(result.response.text());
}
\`\`\`

### 기능 2: AI 자동 분류

\`\`\`ts
// src/lib/categorize.ts
export async function categorizeExpense(
  store: string, items: string[]
): Promise<{ category: Category; subcategory: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(\`
지출 분류기: 다음 내역의 카테고리를 JSON 으로 답해.
가게: \${store}
품목: \${items.join(", ")}

카테고리: 식비, 교통, 쇼핑, 문화, 고정비, 기타 중 하나.
응답: { "category": "카테고리", "subcategory": "세부분류" }
\`);

  return JSON.parse(result.response.text());
}
\`\`\`

### 기능 3: 차트 컴포넌트

\`\`\`tsx
// src/components/ExpensePieChart.tsx
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CATEGORY_CONFIG, type Category } from "../types";

ChartJS.register(ArcElement, Tooltip, Legend);

export function ExpensePieChart({ data }: {
  data: Record<Category, number>;
}) {
  const categories = Object.keys(data) as Category[];

  return (
    <Pie
      data={{
        labels: categories.map(c => \`\${CATEGORY_CONFIG[c].icon} \${c}\`),
        datasets: [{
          data: categories.map(c => data[c]),
          backgroundColor: categories.map(c => CATEGORY_CONFIG[c].color),
        }],
      }}
      options={{
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => \` ₩\${ctx.parsed.toLocaleString()}\`,
            },
          },
        },
      }}
    />
  );
}
\`\`\`

\`\`\`tsx
// src/components/MonthlyBarChart.tsx — 월별 지출 바 차트
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function MonthlyBarChart({ monthlyTotals }: {
  monthlyTotals: { month: string; amount: number }[];
}) {
  return (
    <Bar
      data={{
        labels: monthlyTotals.map(m => m.month),
        datasets: [{
          label: "월별 지출",
          data: monthlyTotals.map(m => m.amount),
          backgroundColor: "#6366f1",
        }],
      }}
      options={{
        scales: {
          y: { ticks: { callback: (v) => \`₩\${(+v / 10000).toFixed(0)}만\` } },
        },
      }}
    />
  );
}
\`\`\`

\`\`\`tsx
// src/components/TrendLineChart.tsx — 카테고리별 추이 라인 차트
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { CATEGORY_CONFIG, type Category } from "../types";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export function TrendLineChart({ data }: {
  data: { month: string; byCategory: Record<Category, number> }[];
}) {
  const categories = Object.keys(CATEGORY_CONFIG) as Category[];
  return (
    <Line
      data={{
        labels: data.map(d => d.month),
        datasets: categories.map(cat => ({
          label: \`\${CATEGORY_CONFIG[cat].icon} \${cat}\`,
          data: data.map(d => d.byCategory[cat] || 0),
          borderColor: CATEGORY_CONFIG[cat].color,
          tension: 0.3,
        })),
      }}
      options={{ plugins: { legend: { position: "bottom" } } }}
    />
  );
}
\`\`\`

### 기능 4: 예산 알림 & AI 코치

\`\`\`ts
// src/lib/budget-alert.ts
export function checkBudgetAlerts(
  expenses: Expense[], budgets: Budget[]
): { category: Category; spent: number; limit: number; percent: number }[] {
  const alerts: any[] = [];

  for (const budget of budgets) {
    const spent = expenses
      .filter(e => e.category === budget.category)
      .reduce((sum, e) => sum + e.amount, 0);
    const percent = Math.round((spent / budget.limit) * 100);

    if (percent >= 80) {
      alerts.push({ category: budget.category, spent, limit: budget.limit, percent });
    }
  }

  return alerts.sort((a, b) => b.percent - a.percent);
}
\`\`\`

\`\`\`ts
// src/lib/ai-coach.ts
export async function getWeeklyCoaching(
  expenses: Expense[], budgets: Budget[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const summary = buildMonthlySummary(expenses, budgets);

  const result = await model.generateContent(\`
너는 친근한 재무 코치야. 반말 친근체로 답해.
이번 달 소비 데이터를 보고 절약 팁 3개를 알려줘.

\${JSON.stringify(summary)}

형식: 각 팁마다 이모지 + 구체적 행동 + 예상 절약 금액.
격려하는 톤, 100자 이내로 간결하게.\`);

  return result.response.text();
}
\`\`\`

### 기능 5: CSV 내보내기

\`\`\`ts
// src/lib/export.ts
export function exportCSV(expenses: Expense[]): void {
  const header = "날짜,가게,금액,카테고리,세부분류,메모,입력방식";
  const rows = expenses.map(e =>
    \`\${e.date},\${e.store},\${e.amount},\${e.category},\${e.subcategory || ""},\${e.memo || ""},\${e.source}\`
  );
  const csv = [header, ...rows].join("\\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = \`가계부_\${new Date().toISOString().slice(0, 7)}.csv\`;
  a.click();
  URL.revokeObjectURL(url);
}
\`\`\`

### 기능 6: localStorage 영구 저장

\`\`\`ts
// src/lib/storage.ts
const STORAGE_KEY = "ai-finance-data";

interface StoredData {
  expenses: Expense[];
  budgets: Budget[];
}

export function loadData(): StoredData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { expenses: [], budgets: getDefaultBudgets() };
  return JSON.parse(raw);
}

export function saveData(data: StoredData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getDefaultBudgets(): Budget[] {
  return [
    { category: "식비", limit: 400000 },
    { category: "교통", limit: 150000 },
    { category: "쇼핑", limit: 200000 },
    { category: "문화", limit: 100000 },
    { category: "고정비", limit: 300000 },
    { category: "기타", limit: 100000 },
  ];
}
\`\`\`

### 확장 도전 🚀

| 난이도 | 도전 | 힌트 |
|---|---|---|
| ⭐ | 다중 통화 지원 (달러/엔 자동 환산) | 환율 API + Gemini 통화 감지 |
| ⭐⭐ | 고정비 자동 인식 (매달 비슷한 금액) | 3개월 데이터 비교로 패턴 감지 |
| ⭐⭐ | 카카오/토스 알림 문자 파싱 | 정규식 + AI 하이브리드 추출 |
| ⭐⭐⭐ | 친구와 더치페이 정산 기능 | 참여자별 금액 분배 + 송금 링크 |
| ⭐⭐⭐ | Supabase 연동 멀티 디바이스 동기화 | Row-Level Security + 실시간 구독 |`,
    },
  ],

  quiz: {
    title: "W35: AI 가계부 & 재무 코치 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "영수증 사진에서 가게명·금액·날짜를 추출하는 기술을 무엇이라 하나요?",
        options: [
          "OCR (Optical Character Recognition)",
          "NLP (Natural Language Processing)",
          "TTS (Text-To-Speech)",
          "GAN (Generative Adversarial Network)",
        ],
        correctIndex: 0,
        explanation:
          "OCR은 이미지 속 텍스트를 인식해 디지털 데이터로 변환하는 기술이에요. Gemini Vision 같은 멀티모달 모델은 별도 OCR 엔진 없이 이미지를 직접 이해할 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question:
          "AI 지출 분류기에서 confidence 값의 역할은 무엇인가요?",
        options: [
          "분류 결과의 정렬 순서를 결정한다",
          "분류 확신도를 나타내어 애매한 항목을 걸러낸다",
          "API 호출 비용을 계산한다",
          "차트의 색상 밝기를 결정한다",
        ],
        correctIndex: 1,
        explanation:
          "confidence 값이 낮으면 AI 가 확신하지 못하는 분류예요. 이런 항목은 '기타'로 분류하고 사용자에게 확인받으면 분류 정확도가 높아집니다.",
      },
      {
        type: "multiple-choice",
        question:
          "월별 소비 데이터를 시각화할 때, 카테고리별 비율을 보여주기에 가장 적합한 차트는?",
        options: [
          "라인 차트 (Line Chart)",
          "바 차트 (Bar Chart)",
          "파이 차트 (Pie Chart)",
          "산점도 (Scatter Plot)",
        ],
        correctIndex: 2,
        explanation:
          "파이 차트는 전체 대비 각 항목의 비율을 직관적으로 보여줘요. 카테고리별 지출 비중을 한눈에 파악하기 좋습니다. 시간에 따른 변화는 라인 차트가 적합해요.",
      },
      {
        type: "multiple-choice",
        question:
          "CSV 내보내기 코드에서 BOM(`\\uFEFF`)을 파일 앞에 추가하는 이유는?",
        options: [
          "파일 크기를 줄이기 위해",
          "엑셀에서 한글이 깨지지 않도록 UTF-8 인코딩을 알려주기 위해",
          "CSV 파서의 구분자를 지정하기 위해",
          "파일 다운로드 속도를 높이기 위해",
        ],
        correctIndex: 1,
        explanation:
          "BOM(Byte Order Mark)은 파일 앞에 붙는 특수 문자로, 엑셀 같은 프로그램에게 '이 파일은 UTF-8 인코딩이야'라고 알려줘요. 이게 없으면 엑셀에서 한글이 깨질 수 있습니다.",
      },
    ],
  } satisfies Quiz,
};
