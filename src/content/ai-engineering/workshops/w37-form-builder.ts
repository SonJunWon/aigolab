import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W37 — AI 폼 빌더 & 설문 분석.
 *
 * Part A: 설문 문항 자동 생성·응답 분석·인사이트 리포트를 LLM 으로 체험 (LLM 셀)
 * Part B: MD 레시피로 드래그앤드롭 폼 빌더 + 공유 링크 + 응답 대시보드 + AI 분석 완성 (Claude Code / Cursor)
 */
export const workshopW37: Lesson = {
  id: "ai-eng-w37-form-builder",
  language: "ai-engineering",
  track: "beginner",
  order: 137,
  title: "W37: AI 폼 빌더 & 설문 분석",
  subtitle: "드래그앤드롭으로 폼 만들고 AI가 응답 분석",
  estimatedMinutes: 180,
  cells: [
    {
      type: "markdown",
      source: `# 📋 AI 폼 빌더 & 설문 분석 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**드래그앤드롭으로 설문 폼을 만들고, 공유 링크로 응답을 수집하고, AI 가 응답을 분석해서 인사이트 리포트를 생성하는 폼 빌더 플랫폼** — Google Forms 를 직접 만들고, 거기에 AI 분석까지 얹는 프로젝트예요.

### 완성 모습
\`\`\`
┌─ AI Form Builder ─────────────────────────────────────────────┐
│  📋 내 폼 빌더        [📝 새 폼]  [📊 대시보드]  🌙 다크      │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  📝 폼 에디터                          미리보기               │
│  ┌──────────────────────┐  ┌─────────────────────────┐       │
│  │ 🔤 고객 만족도 설문    │  │ 고객 만족도 설문         │       │
│  │                      │  │                         │       │
│  │ [필드 추가 ▼]        │  │ 1. 이름 (필수)           │       │
│  │  📝 텍스트           │  │ ┌───────────────────┐   │       │
│  │  📋 선택 (드롭다운)   │  │ │                   │   │       │
│  │  ⭐ 별점 (1~5)       │  │ └───────────────────┘   │       │
│  │  ☑️ 체크박스          │  │                         │       │
│  │  🔘 라디오           │  │ 2. 서비스 만족도 ⭐       │       │
│  │  📅 날짜             │  │ ☆ ☆ ☆ ☆ ☆              │       │
│  │                      │  │                         │       │
│  │ ─ 드래그로 순서 변경 ─ │  │ 3. 추천 의향             │       │
│  │ ┌────────────────┐   │  │ ○ 매우 그렇다            │       │
│  │ │ ≡ 이름 (텍스트)  │   │  │ ○ 그렇다               │       │
│  │ │ ≡ 만족도 (별점)  │   │  │ ○ 보통                 │       │
│  │ │ ≡ 추천 (라디오)  │   │  │ ○ 아니다               │       │
│  │ │ ≡ 의견 (텍스트)  │   │  │                         │       │
│  │ └────────────────┘   │  │ 4. 자유 의견              │       │
│  │                      │  │ ┌───────────────────┐   │       │
│  │ [🔗 공유 링크 생성]   │  │ │                   │   │       │
│  │ [📥 템플릿 불러오기]  │  │ └───────────────────┘   │       │
│  └──────────────────────┘  └─────────────────────────┘       │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│  📊 응답 대시보드 (42명 응답)                                  │
│  ┌───────────────────────────────────────────────────────┐    │
│  │ 서비스 만족도           추천 의향                       │    │
│  │ ⭐⭐⭐⭐ 4.2 평균       매우 그렇다 ████████ 45%       │    │
│  │ ★★★★★ ██████ 35%     그렇다     ██████ 30%          │    │
│  │ ★★★★☆ ████████ 40%   보통       ████ 20%             │    │
│  │ ★★★☆☆ ████ 20%       아니다     ██ 5%                │    │
│  │ ★★☆☆☆ █ 5%                                          │    │
│  │                                                       │    │
│  │ 🤖 AI 인사이트 리포트                                  │    │
│  │ ┌───────────────────────────────────────────────────┐ │    │
│  │ │ 📈 핵심 발견:                                     │ │    │
│  │ │ • 전반적 만족도 높음 (4.2/5), 특히 30대가 호평     │ │    │
│  │ │ • 추천 의향과 만족도 간 강한 양의 상관관계 (r=0.82)│ │    │
│  │ │ • "배송 속도" 키워드가 자유 의견에서 가장 자주 등장 │ │    │
│  │ │                                                   │ │    │
│  │ │ ⚠️ 주의 사항:                                     │ │    │
│  │ │ • 만족도 3점 이하 응답자의 80%가 "고객센터" 언급    │ │    │
│  │ │ [📥 Excel 내보내기]  [📄 PDF 리포트]               │ │    │
│  │ └───────────────────────────────────────────────────┘ │    │
│  └───────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 설문 문항 생성 + 응답 분석 + 인사이트 리포트 | 60분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 풀스택 폼 빌더 완성 | 120분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - ==드래그앤드롭== 개념 이해 (HTML5 Drag & Drop 또는 라이브러리)`,
    },

    // ─── Part A: AI 설문 엔진 ───
    {
      type: "markdown",
      source: `## Part A: AI 설문 엔진 만들기 (60분)

폼 빌더의 핵심은 **주제만 알려주면 적절한 설문 문항을 자동 생성**하고, **수집된 응답을 분석**하고, **실행 가능한 인사이트를 도출**하는 거예요.

핵심 개념 3가지:
1. **설문 문항 자동 생성** — 주제와 목적을 입력하면 AI 가 다양한 필드 타입의 문항 생성
2. **응답 데이터 분석** — 수집된 응답을 통계적으로 분석 (평균, 분포, 상관관계)
3. **인사이트 리포트** — 분석 결과를 사람이 이해하기 쉬운 보고서로 정리

> 📌 **==폼 빌더== 란?** — 코딩 없이 설문지·신청서·피드백 양식을 만드는 도구예요. Google Forms, Typeform, SurveyMonkey 같은 서비스가 대표적입니다.`,
    },

    {
      type: "markdown",
      source: `### A-1. 설문 문항 자동 생성 — 주제 → 폼 필드 JSON

설문을 처음부터 만들기는 번거롭죠. 주제와 목적만 알려주면 AI 가 적절한 질문 유형(텍스트, 선택, 별점, 체크박스 등)과 선택지까지 자동으로 생성합니다. ==UX 리서치==에서 좋은 설문 설계 원칙도 반영해요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 설문 문항 자동 생성 — 주제 + 목적 → 폼 필드 JSON
const surveyRequest = {
  topic: "온라인 쇼핑몰 고객 만족도",
  purpose: "서비스 개선 포인트를 찾고 재구매 의향을 파악",
  targetAudience: "최근 3개월 내 구매 고객",
  maxQuestions: 8,
};

const systemPrompt = \`너는 UX 리서치 전문가이자 설문 설계사야.
주어진 주제와 목적에 맞는 설문 문항을 다양한 필드 타입으로 생성해.

[지원 필드 타입]
- text: 단답형 텍스트 (이름, 이메일, 짧은 의견)
- textarea: 장문 텍스트 (자유 의견, 상세 피드백)
- select: 드롭다운 선택 (하나만 선택)
- radio: 라디오 버튼 (하나만 선택, 선택지가 적을 때)
- checkbox: 체크박스 (복수 선택 가능)
- rating: 별점 (1~5 또는 1~10)
- date: 날짜 선택

[응답 형식 — JSON]
{
  "formTitle": "설문 제목",
  "formDescription": "설문 설명 (1~2문장)",
  "fields": [
    {
      "order": 1,
      "label": "질문 텍스트",
      "type": "text | textarea | select | radio | checkbox | rating | date",
      "required": true/false,
      "placeholder": "입력 안내 텍스트 (text/textarea 전용)",
      "options": ["선택지1", "선택지2"],
      "ratingMax": 5,
      "validation": "email | phone | none",
      "description": "질문 보충 설명 (선택)"
    }
  ],
  "designTips": "설문 개선 팁 1~2줄"
}

[설문 설계 원칙]
- 첫 질문은 쉬운 것 (이름, 나이대 등)으로 시작
- 민감한 질문은 뒤로 배치
- 필드 타입을 다양하게 믹스 (text만 나열하면 피로)
- 필수/선택을 적절히 구분
- rating 은 기준점 명시 (1=매우 불만족, 5=매우 만족)\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 설문을 설계해줘:\\n\${JSON.stringify(surveyRequest, null, 2)}\` },
  ],
});

try {
  const form = JSON.parse(res.text);
  console.log("📋 설문 자동 생성 결과");
  console.log("═".repeat(50));
  console.log("📝 제목:", form.formTitle);
  console.log("📄 설명:", form.formDescription);

  console.log("\\n📑 문항 목록:");
  const typeIcons: Record<string, string> = {
    text: "🔤", textarea: "📝", select: "📋",
    radio: "🔘", checkbox: "☑️", rating: "⭐", date: "📅",
  };
  form.fields?.forEach((f: any) => {
    const icon = typeIcons[f.type] || "❓";
    const req = f.required ? " (필수)" : " (선택)";
    console.log(\`  \${icon} [\${f.order}] \${f.label}\${req} — \${f.type}\`);
    if (f.options?.length) {
      console.log(\`     선택지: \${f.options.join(" / ")}\`);
    }
    if (f.description) {
      console.log(\`     💬 \${f.description}\`);
    }
  });

  console.log("\\n💡 설문 개선 팁:", form.designTips);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 필드 타입(text, rating, radio 등)을 다양하게 섞어야 응답자 피로를 줄일 수 있어요.",
        "첫 질문은 쉬운 것으로 시작 — 심리학에서 '문간에 발 들여놓기(foot-in-the-door)' 기법이에요.",
        "rating 필드에 기준점(1=불만, 5=만족)을 명시해야 응답 품질이 올라가요.",
        "실무에서는 이 JSON 을 DB 에 저장하고 폼 렌더링 엔진이 동적으로 UI 를 그려요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 응답 데이터 분석 — 수집된 응답 → 통계 요약

설문 응답이 수십~수백 개 모이면 일일이 읽을 수 없어요. AI 에게 응답 데이터를 넘기면 **문항별 통계**(평균, 분포, 최빈값)와 **문항 간 ==상관관계==** 를 자동으로 계산합니다. 이게 ==정량 분석==의 기본이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 설문 응답 분석 — 수집된 응답 데이터 → 통계 요약
const surveyData = {
  formTitle: "온라인 쇼핑몰 고객 만족도",
  totalResponses: 42,
  fields: [
    { label: "연령대", type: "select" },
    { label: "서비스 만족도", type: "rating", ratingMax: 5 },
    { label: "추천 의향", type: "radio" },
    { label: "재구매 의향", type: "radio" },
    { label: "가장 좋았던 점", type: "checkbox" },
    { label: "개선 의견", type: "textarea" },
  ],
  responses: [
    { "연령대": "20대", "서비스 만족도": 5, "추천 의향": "매우 그렇다", "재구매 의향": "그렇다", "가장 좋았던 점": ["빠른 배송", "다양한 상품"], "개선 의견": "배송 추적이 더 정확했으면 좋겠어요" },
    { "연령대": "30대", "서비스 만족도": 4, "추천 의향": "그렇다", "재구매 의향": "매우 그렇다", "가장 좋았던 점": ["가격", "빠른 배송"], "개선 의견": "고객센터 연결이 느려요" },
    { "연령대": "20대", "서비스 만족도": 3, "추천 의향": "보통", "재구매 의향": "보통", "가장 좋았던 점": ["다양한 상품"], "개선 의견": "반품 절차가 복잡해요. 고객센터 전화 연결도 오래 걸림" },
    { "연령대": "40대", "서비스 만족도": 5, "추천 의향": "매우 그렇다", "재구매 의향": "매우 그렇다", "가장 좋았던 점": ["빠른 배송", "가격", "친절한 상담"], "개선 의견": "만족합니다. 포인트 적립이 더 많으면 좋겠어요" },
    { "연령대": "30대", "서비스 만족도": 2, "추천 의향": "아니다", "재구매 의향": "보통", "가장 좋았던 점": ["다양한 상품"], "개선 의견": "상품 사진과 실물이 달라요. 교환하려니 택배비 부담" },
    { "연령대": "20대", "서비스 만족도": 4, "추천 의향": "그렇다", "재구매 의향": "그렇다", "가장 좋았던 점": ["빠른 배송", "앱 편의성"], "개선 의견": "특별한 불만 없어요" },
    { "연령대": "50대", "서비스 만족도": 4, "추천 의향": "그렇다", "재구매 의향": "그렇다", "가장 좋았던 점": ["친절한 상담", "가격"], "개선 의견": "글씨가 좀 작아요. 시니어 모드가 있으면 좋겠어요" },
    { "연령대": "30대", "서비스 만족도": 5, "추천 의향": "매우 그렇다", "재구매 의향": "매우 그렇다", "가장 좋았던 점": ["빠른 배송", "가격", "앱 편의성"], "개선 의견": "전체적으로 매우 만족!" },
  ],
};

const systemPrompt = \`너는 데이터 분석 전문가야.
설문 응답 데이터를 분석해서 문항별 통계와 전체 요약을 생성해.

[응답 형식 — JSON]
{
  "summary": {
    "totalResponses": 숫자,
    "completionRate": "응답 완료율 (%)",
    "averageCompletionTime": "예상 평균 소요 시간"
  },
  "fieldAnalysis": [
    {
      "label": "문항 라벨",
      "type": "필드 타입",
      "stats": {
        "distribution": { "선택지": 응답수, ... },
        "average": 숫자 (rating 전용),
        "mode": "최빈값",
        "topKeywords": ["키워드1", "키워드2"] (textarea 전용)
      }
    }
  ],
  "correlations": [
    {
      "field1": "문항1",
      "field2": "문항2",
      "relationship": "양의 상관 | 음의 상관 | 상관 없음",
      "strength": "강함 | 보통 | 약함",
      "description": "설명"
    }
  ],
  "overallSummary": "전체 요약 2~3문장"
}

[규칙]
- rating 문항은 평균·표준편차·분포 계산
- radio/select 는 선택지별 응답 수와 비율
- checkbox 는 각 옵션 선택 빈도
- textarea 는 주요 키워드 추출 + 감성 분석 (긍정/부정/중립)
- 문항 간 의미 있는 상관관계가 있으면 반드시 표시\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 설문 응답을 분석해줘:\\n\${JSON.stringify(surveyData, null, 2)}\` },
  ],
});

try {
  const analysis = JSON.parse(res.text);
  console.log("📊 응답 분석 결과");
  console.log("═".repeat(50));
  console.log("📈 총 응답:", analysis.summary?.totalResponses, "건");
  console.log("✅ 완료율:", analysis.summary?.completionRate);

  console.log("\\n📑 문항별 분석:");
  analysis.fieldAnalysis?.forEach((f: any) => {
    console.log(\`\\n  📌 \${f.label} (\${f.type})\`);
    if (f.stats?.average !== undefined) {
      console.log(\`     ⭐ 평균: \${f.stats.average}\`);
    }
    if (f.stats?.mode) {
      console.log(\`     🏆 최빈값: \${f.stats.mode}\`);
    }
    if (f.stats?.distribution) {
      Object.entries(f.stats.distribution).forEach(([k, v]) => {
        console.log(\`     \${k}: \${v}명\`);
      });
    }
    if (f.stats?.topKeywords?.length) {
      console.log(\`     🔑 키워드: \${f.stats.topKeywords.join(", ")}\`);
    }
  });

  if (analysis.correlations?.length) {
    console.log("\\n🔗 상관관계:");
    analysis.correlations.forEach((c: any) => {
      console.log(\`  \${c.field1} ↔ \${c.field2}: \${c.relationship} (\${c.strength})\`);
      console.log(\`     \${c.description}\`);
    });
  }

  console.log("\\n📝 전체 요약:", analysis.overallSummary);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 필드 타입에 따라 분석 방법이 달라요 — rating 은 평균, radio 는 분포, textarea 는 키워드 추출.",
        "상관관계(correlation)는 두 문항 응답이 함께 변하는 정도예요. 만족도가 높으면 추천 의향도 높다면 양의 상관.",
        "textarea 응답은 정량화가 어렵기 때문에 키워드 추출과 감성 분석을 사용해요.",
        "실무에서는 응답이 수백~수천 개라 DB 쿼리로 집계하고, AI 는 해석만 담당합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 인사이트 리포트 생성 — 분석 결과 → 실행 가능한 보고서

통계 숫자만으로는 의사결정을 내리기 어려워요. AI 가 분석 결과를 **비전문가도 이해할 수 있는 리포트**로 바꿔줍니다. 핵심 발견(key findings), 주의 사항(alerts), 구체적 개선 제안(action items)이 포함돼요. 이게 ==정성 분석==과 ==데이터 스토리텔링==이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 인사이트 리포트 생성 — 분석 결과 → 의사결정 보고서
const analysisResult = {
  formTitle: "온라인 쇼핑몰 고객 만족도",
  totalResponses: 42,
  period: "2026-03-01 ~ 2026-04-15",
  fieldAnalysis: [
    {
      label: "서비스 만족도",
      type: "rating",
      average: 4.2,
      distribution: { "5점": 15, "4점": 17, "3점": 7, "2점": 2, "1점": 1 },
    },
    {
      label: "추천 의향",
      type: "radio",
      distribution: { "매우 그렇다": 19, "그렇다": 13, "보통": 7, "아니다": 3 },
    },
    {
      label: "재구매 의향",
      type: "radio",
      distribution: { "매우 그렇다": 16, "그렇다": 15, "보통": 8, "아니다": 3 },
    },
    {
      label: "가장 좋았던 점",
      type: "checkbox",
      selectionCounts: { "빠른 배송": 32, "가격": 24, "다양한 상품": 18, "앱 편의성": 12, "친절한 상담": 8 },
    },
    {
      label: "개선 의견",
      type: "textarea",
      topKeywords: ["고객센터", "배송 추적", "반품", "교환", "포인트"],
      sentimentBreakdown: { positive: 18, neutral: 14, negative: 10 },
    },
  ],
  correlations: [
    { field1: "서비스 만족도", field2: "추천 의향", relationship: "양의 상관", strength: "강함" },
    { field1: "서비스 만족도", field2: "재구매 의향", relationship: "양의 상관", strength: "보통" },
  ],
};

const systemPrompt = \`너는 비즈니스 인사이트 전문 애널리스트야.
설문 분석 결과를 바탕으로 경영진이 바로 활용할 수 있는 인사이트 리포트를 생성해.

[응답 형식 — JSON]
{
  "report": {
    "title": "리포트 제목",
    "executiveSummary": "3줄 이내 핵심 요약 (숫자 포함)",
    "keyFindings": [
      {
        "icon": "이모지",
        "title": "발견 제목",
        "detail": "구체적 수치와 함께 설명",
        "impact": "high | medium | low"
      }
    ],
    "alerts": [
      {
        "severity": "critical | warning | info",
        "title": "알림 제목",
        "detail": "상세 설명",
        "affectedPercentage": "영향받는 응답자 비율"
      }
    ],
    "actionItems": [
      {
        "priority": 1,
        "action": "구체적 개선 행동",
        "expectedImpact": "예상 효과",
        "effort": "low | medium | high",
        "timeline": "예상 소요 기간"
      }
    ],
    "trendsAndPatterns": "패턴 및 추세 설명 (2~3문장)",
    "nextSurveyRecommendation": "다음 설문에서 추가로 물어볼 것"
  }
}

[규칙]
- 모든 발견에 구체적 숫자를 포함 (% 또는 절대값)
- action items 는 우선순위 + 난이도 + 타임라인까지
- alerts 는 부정적 시그널을 절대 놓치지 마
- 전문 용어 사용 최소화 — 비전문가가 읽을 수 있게
- 한국어로 작성\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 분석 결과로 인사이트 리포트를 만들어줘:\\n\${JSON.stringify(analysisResult, null, 2)}\` },
  ],
});

try {
  const { report } = JSON.parse(res.text);
  console.log("🤖 AI 인사이트 리포트");
  console.log("═".repeat(50));
  console.log("📋", report.title);
  console.log("\\n📌 핵심 요약:");
  console.log("  ", report.executiveSummary);

  console.log("\\n🔍 핵심 발견:");
  report.keyFindings?.forEach((f: any) => {
    const badge = f.impact === "high" ? "🔴" : f.impact === "medium" ? "🟡" : "🟢";
    console.log(\`  \${f.icon} \${f.title} \${badge}\`);
    console.log(\`     \${f.detail}\`);
  });

  if (report.alerts?.length) {
    console.log("\\n⚠️ 주의 알림:");
    report.alerts.forEach((a: any) => {
      const sev = { critical: "🔴", warning: "🟡", info: "🔵" };
      console.log(\`  \${sev[a.severity as keyof typeof sev] || "⬜"} \${a.title}\`);
      console.log(\`     \${a.detail}\`);
      if (a.affectedPercentage) console.log(\`     영향 범위: \${a.affectedPercentage}\`);
    });
  }

  console.log("\\n✅ 개선 행동 계획:");
  report.actionItems?.forEach((a: any) => {
    const effort = { low: "🟢 쉬움", medium: "🟡 보통", high: "🔴 어려움" };
    console.log(\`  [\${a.priority}] \${a.action}\`);
    console.log(\`     💡 효과: \${a.expectedImpact}\`);
    console.log(\`     ⚙️ 난이도: \${effort[a.effort as keyof typeof effort] || a.effort} | ⏱️ \${a.timeline}\`);
  });

  console.log("\\n📈 패턴 및 추세:");
  console.log("  ", report.trendsAndPatterns);
  console.log("\\n📋 다음 설문 추천:");
  console.log("  ", report.nextSurveyRecommendation);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 숫자(정량)만으로는 부족하고, '왜 그런지'와 '뭘 해야 하는지'까지 알려줘야 좋은 리포트예요.",
        "alerts 는 부정적 시그널을 놓치지 않기 위한 안전장치 — 만족도 낮은 그룹의 패턴을 잡아요.",
        "action items 에 우선순위 + 난이도 + 타임라인이 있으면 실무에서 바로 실행 가능해요.",
        "데이터 스토리텔링 = 숫자를 '이야기'로 바꾸는 기술. 경영진은 숫자보다 스토리에 반응해요.",
      ],
    },

    // ─── Part B: 풀스택 구현 레시피 ───
    {
      type: "markdown",
      source: `## Part B: AI 폼 빌더 플랫폼 만들기 (120분)

> 🛠️ Part B 는 Claude Code 또는 Cursor 에서 아래 ==프롬프트==를 사용해 만들어요.
> 코드를 직접 입력하는 게 아니라, AI 에게 지시해서 프로젝트를 생성합니다.

---

### 🔧 기술 스택

| 영역 | 기술 | 역할 |
|---|---|---|
| 프론트엔드 | React + TypeScript + Vite | ==SPA== 기반 폼 빌더 UI |
| 스타일 | Tailwind CSS | 유틸리티 기반 반응형 디자인 |
| 드래그앤드롭 | @dnd-kit/core + @dnd-kit/sortable | 필드 순서 변경 + 드래그 추가 |
| 백엔드/DB | Supabase | 인증 + PostgreSQL + ==RLS== |
| AI | @google/genai (Gemini) | 문항 생성 + 응답 분석 + 리포트 |
| 차트 | recharts | 응답 시각화 (bar, pie, line) |
| 내보내기 | xlsx + file-saver | ==CSV==/Excel 다운로드 |

### 📐 데이터 모델

\`\`\`
forms
├── id (uuid, PK)
├── user_id (uuid → auth.users)
├── title (text)
├── description (text)
├── fields (jsonb)              ← 필드 배열 [{order, label, type, options, required, ...}]
├── theme (jsonb)               ← 색상, 로고, 배경 설정
├── share_slug (text, unique)   ← 공유용 짧은 URL
├── is_active (boolean)         ← 응답 수집 중/종료
├── template_category (text)    ← 템플릿 분류 (nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

responses
├── id (uuid, PK)
├── form_id (uuid → forms)
├── answers (jsonb)             ← {필드라벨: 응답값, ...}
├── respondent_meta (jsonb)     ← {ip_hash, user_agent, duration_sec}
├── submitted_at (timestamptz)
└── is_complete (boolean)

analysis_reports
├── id (uuid, PK)
├── form_id (uuid → forms)
├── report (jsonb)              ← AI 가 생성한 인사이트 리포트
├── response_count (integer)    ← 분석 시점의 응답 수
├── generated_at (timestamptz)
└── model_used (text)
\`\`\`

---

### 🚀 Claude Code / Cursor 프롬프트

아래 프롬프트를 복사해서 터미널(Claude Code) 또는 Composer(Cursor) 에 붙여 넣으세요:

\`\`\`
AI 폼 빌더 & 설문 분석 플랫폼을 만들어줘.

[기술 스택]
- React + TypeScript + Vite + Tailwind CSS
- @dnd-kit/core + @dnd-kit/sortable (드래그앤드롭)
- Supabase (Auth + PostgreSQL + RLS)
- @google/genai (Gemini 2.0 Flash)
- recharts (차트)
- xlsx + file-saver (Excel 내보내기)

[필수 기능]

1. 인증
   - Supabase Auth (이메일/비밀번호 + Google OAuth)
   - 폼 생성자 / 응답자 구분 (응답자는 로그인 불필요)

2. 폼 에디터 (드래그앤드롭)
   - 왼쪽: 필드 타입 팔레트 (text, textarea, select, radio, checkbox, rating, date)
   - 가운데: 드래그로 필드 추가 + 순서 변경 (@dnd-kit/sortable)
   - 오른쪽: 선택된 필드의 속성 편집 (라벨, 필수여부, 선택지, placeholder)
   - 필드 복제, 삭제, 그룹핑
   - 실시간 미리보기 (오른쪽 패널 또는 split view)
   - "AI 로 문항 생성" 버튼 — 주제 입력하면 필드 자동 생성

3. 폼 미리보기 & 공유
   - 모바일/데스크톱 미리보기 토글
   - 공유 링크 생성 (share_slug 기반 짧은 URL)
   - QR 코드 생성 (qrcode 라이브러리)
   - 링크 복사 버튼
   - 폼 활성/비활성 토글 (응답 수집 시작/종료)

4. 응답 수집 (공개 페이지)
   - /form/:slug 경로로 접근 (로그인 불필요)
   - 각 필드 타입에 맞는 입력 UI 렌더링
   - 필수 필드 유효성 검사
   - 제출 후 "감사합니다" 페이지
   - 중복 응답 방지 (브라우저 fingerprint)

5. 응답 대시보드
   - 문항별 차트 (rating→bar, radio/select→pie, checkbox→horizontal bar)
   - 응답 수 추이 (날짜별 line chart)
   - 텍스트 응답 목록 (검색, 필터)
   - 개별 응답 상세 보기 (타임라인)
   - 실시간 응답 알림 (Supabase realtime)

6. AI 인사이트 리포트
   - "AI 분석" 버튼 → 전체 응답 분석
   - 핵심 발견 (key findings) + 주의 사항 (alerts)
   - 문항 간 상관관계 분석
   - 개선 제안 (action items) + 우선순위
   - 리포트 히스토리 (이전 분석 결과 보관)

7. 내보내기
   - CSV/Excel 다운로드 (xlsx 라이브러리)
   - PDF 리포트 다운로드 (AI 분석 결과 포함)
   - 응답 필터링 후 내보내기 (날짜 범위, 특정 조건)

8. 폼 템플릿
   - 카테고리별 미리 만든 템플릿 (고객 만족도, 이벤트 피드백, 직원 설문, NPS 등)
   - "이 템플릿으로 시작하기" → 에디터에 필드 자동 로드
   - 내 폼을 템플릿으로 저장

9. UI/UX
   - 다크/라이트 모드 토글
   - 반응형 (모바일/태블릿/데스크톱)
   - 로딩 스켈레톤
   - Toast 알림
   - 폼 에디터 undo/redo (Ctrl+Z / Ctrl+Y)

[Supabase RLS 정책]
- forms: 본인 것만 CRUD, 공개 폼(is_active=true)은 slug로 누구나 읽기
- responses: 폼 소유자만 읽기, 누구나 생성 (공개 폼에 응답)
- analysis_reports: 폼 소유자만 읽기/생성

[환경 변수]
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
\`\`\`

---

### 📁 예상 폴더 구조

\`\`\`
src/
├── components/
│   ├── auth/              # LoginForm, SignupForm, AuthGuard
│   ├── form-editor/       # FieldPalette, FieldCanvas, FieldProperties
│   │   ├── DragField.tsx  # 드래그 가능한 필드 컴포넌트
│   │   ├── SortableField.tsx  # 정렬 가능한 캔버스 필드
│   │   └── FieldConfig.tsx    # 필드 속성 편집 패널
│   ├── form-renderer/     # FormPage, FieldRenderer, SubmitSuccess
│   ├── dashboard/         # ResponseChart, ResponseTable, ResponseTimeline
│   ├── analysis/          # InsightReport, FindingCard, AlertCard, ActionList
│   ├── templates/         # TemplateGrid, TemplateCard, TemplatePreview
│   ├── share/             # ShareLink, QRCode, ShareModal
│   └── ui/                # Button, Card, Modal, Toast, Skeleton, Tabs
├── hooks/
│   ├── useAuth.ts
│   ├── useForms.ts
│   ├── useResponses.ts
│   ├── useAnalysis.ts
│   └── useDragDrop.ts
├── lib/
│   ├── supabase.ts        # Supabase 클라이언트
│   ├── gemini.ts          # Gemini AI 클라이언트
│   ├── export.ts          # CSV/Excel 내보내기
│   └── qrcode.ts          # QR 코드 생성
├── pages/
│   ├── Home.tsx
│   ├── FormEditor.tsx
│   ├── FormPreview.tsx
│   ├── PublicForm.tsx      # /form/:slug (공개 응답 페이지)
│   ├── Dashboard.tsx
│   └── Templates.tsx
├── types/
│   └── database.ts        # Supabase 타입
├── App.tsx
└── main.tsx
\`\`\``,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

기본 폼 빌더가 완성되면 아래 기능을 추가해 보세요!

### 도전 1: 조건부 로직 (Conditional Logic) 🔀
\`\`\`
폼에 조건부 표시 기능을 추가해줘.

- "만족도가 3점 이하일 때만 불만 사유 질문 표시" 같은 규칙
- 필드 속성 패널에 "조건 추가" UI
- 조건: 특정 필드의 값이 [같다/다르다/이상/이하] 일 때 보이기/숨기기
- 여러 조건 AND/OR 조합
- 미리보기에서 조건부 동작 테스트 가능
\`\`\`

### 도전 2: 실시간 협업 편집 👥
\`\`\`
여러 사람이 동시에 폼을 편집할 수 있게 해줘.

- Supabase Realtime 으로 실시간 동기화
- 다른 편집자의 커서 위치 표시
- 필드 잠금 (다른 사람이 편집 중인 필드 표시)
- 변경 히스토리 (누가 언제 무엇을 수정했는지)
- 최대 5명 동시 편집
\`\`\`

### 도전 3: AI 후속 질문 (Smart Follow-up) 🤖
\`\`\`
응답 내용에 따라 AI 가 실시간으로 후속 질문을 생성해줘.

- 사용자가 "불만족" 선택 시 → AI 가 "어떤 점이 불만족스러우셨나요?" 질문 자동 추가
- textarea 에 특정 키워드 감지 → 관련 심화 질문 표시
- 최대 2개까지 후속 질문 자동 생성
- 후속 질문 응답도 함께 저장/분석
\`\`\`

### 도전 4: 다국어 폼 🌍
\`\`\`
하나의 폼을 여러 언어로 제공해줘.

- 폼 에디터에서 "번역 추가" (AI 자동 번역)
- 응답자가 언어 선택 (한국어/영어/일본어/중국어)
- 각 언어별 공유 링크 (/form/:slug?lang=ko)
- 응답은 원본 언어로 수집, 분석은 번역 후 통합
\`\`\`

### 도전 5: 응답 파이프라인 자동화 🔄
\`\`\`
응답이 들어올 때 자동 작업을 실행해줘.

- 슬랙/이메일 알림 (새 응답 도착 시)
- Google Sheets 자동 동기화
- 특정 조건 응답 시 담당자에게 알림 (불만족 응답 → CS팀)
- 응답 N개 도달 시 자동 AI 분석 리포트 생성
- Supabase Edge Functions 활용
\`\`\``,
    },

    // ─── 핵심 개념 정리 ───
    {
      type: "markdown",
      source: `## 📚 핵심 개념 정리

### 이 워크샵에서 배운 것

| 개념 | 설명 | 활용 |
|---|---|---|
| ==폼 빌더== | 코딩 없이 설문/양식을 만드는 도구 | 드래그앤드롭으로 필드 추가·순서 변경 |
| ==드래그앤드롭== | 요소를 끌어서 옮기는 UI 패턴 | @dnd-kit 으로 폼 필드 정렬 |
| ==정량 분석== | 숫자로 측정 가능한 데이터 분석 | 평균, 분포, 비율 계산 |
| ==정성 분석== | 텍스트·의견 등 비정형 데이터 분석 | 키워드 추출, 감성 분석 |
| ==상관관계== | 두 변수가 함께 변하는 정도 | 만족도↔추천 의향 관계 파악 |
| ==데이터 스토리텔링== | 데이터를 이해하기 쉬운 이야기로 변환 | 경영진용 인사이트 리포트 |
| ==RLS== | 행 수준 보안 | "내 폼만 내가 관리" 접근 제어 |
| ==CSV== | 쉼표로 구분된 값 (표 형식 데이터) | 엑셀·구글시트 호환 내보내기 |

### 실무에서 이 기술이 쓰이는 곳

- **Google Forms** — 드래그앤드롭 폼 빌더 + 자동 차트
- **Typeform** — 대화형 설문 + 조건부 로직
- **SurveyMonkey** — 설문 + AI 분석 + 리포트
- **Tally** — 코딩 없는 폼 빌더 (Notion 스타일)
- **Jotform** — 드래그앤드롭 + 결제 연동 + 자동화
- **Microsoft Forms** — Office 365 통합 설문 도구`,
    },
  ],

  quiz: {
    title: "W37: AI 폼 빌더 & 설문 분석 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "설문 문항을 설계할 때, 첫 번째 질문을 쉬운 것(이름, 나이대 등)으로 시작하는 이유는?",
        options: [
          "데이터베이스 정렬을 쉽게 하려고",
          "응답자의 심리적 진입 장벽을 낮추기 위해",
          "필수 필드 유효성 검사를 먼저 하려고",
          "AI 가 분석하기 쉬운 데이터를 먼저 수집하려고",
        ],
        correctIndex: 1,
        explanation:
          "심리학의 '문간에 발 들여놓기(foot-in-the-door)' 기법이에요. 쉬운 질문으로 시작하면 응답자가 부담 없이 설문을 시작하게 되고, 이후 질문에도 계속 답할 확률이 높아집니다. 설문 이탈률을 줄이는 핵심 전략이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "설문 응답 분석에서 rating(별점) 문항과 textarea(서술형) 문항의 분석 방법이 다른 이유는?",
        options: [
          "textarea 가 저장 공간을 더 많이 써서",
          "rating 은 숫자(정량)이고 textarea 는 텍스트(정성)라서 분석 도구가 다르기 때문",
          "textarea 응답은 보통 짧아서 분석할 게 없기 때문",
          "rating 은 AI 없이도 분석 가능하기 때문",
        ],
        correctIndex: 1,
        explanation:
          "rating 은 숫자 데이터라 평균·표준편차·분포를 바로 계산할 수 있어요 (정량 분석). 반면 textarea 는 자유 텍스트라 키워드 추출·감성 분석·토픽 모델링 같은 NLP 기법이 필요합니다 (정성 분석). 데이터 형태에 따라 분석 방법이 완전히 달라요.",
      },
      {
        type: "multiple-choice",
        question:
          "AI 인사이트 리포트에서 'action items(개선 행동)'에 우선순위·난이도·타임라인을 함께 제시하는 이유는?",
        options: [
          "리포트가 길어 보여서 신뢰감을 주기 위해",
          "의사결정자가 '무엇을 먼저, 얼마나 쉽게, 언제까지' 실행할지 바로 판단할 수 있게 하려고",
          "AI 모델의 정확도를 높이기 위해",
          "데이터베이스에 저장하기 편하게 구조화하려고",
        ],
        correctIndex: 1,
        explanation:
          "아무리 좋은 분석도 실행으로 이어지지 않으면 소용없어요. 우선순위(뭘 먼저), 난이도(얼마나 쉬운지), 타임라인(얼마나 걸리는지)을 함께 제시하면 의사결정자가 바로 행동 계획을 세울 수 있습니다. 이것이 '실행 가능한(actionable) 인사이트'의 핵심이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "폼 빌더에서 공개 응답 페이지(/form/:slug)에 로그인을 요구하지 않는 주된 이유는?",
        options: [
          "Supabase Auth 가 익명 사용자를 지원하지 않아서",
          "응답률을 최대화하기 위해 — 로그인은 응답의 큰 장벽이 됨",
          "개인정보보호법 때문에 로그인을 받으면 안 돼서",
          "서버 비용을 줄이기 위해",
        ],
        correctIndex: 1,
        explanation:
          "설문의 핵심 목표는 최대한 많은 응답을 수집하는 것이에요. 로그인을 요구하면 응답률이 크게 떨어집니다. 그래서 대부분의 설문 도구(Google Forms, Typeform 등)는 응답자에게 로그인을 요구하지 않아요. 대신 중복 방지는 브라우저 fingerprint 같은 기술로 처리합니다.",
      },
      {
        type: "predict-output",
        question:
          "다음 코드에서 설문 응답 통계를 계산합니다. 출력 결과는?",
        code: `const ratings = [5, 4, 3, 5, 4, 4, 2, 5];
const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;

const dist: Record<number, number> = {};
ratings.forEach(r => { dist[r] = (dist[r] || 0) + 1; });

const mode = Object.entries(dist)
  .sort((a, b) => b[1] - a[1])[0][0];

console.log(\`평균: \${avg}, 최빈값: \${mode}점, 응답: \${ratings.length}건\`);`,
        options: [
          "평균: 4, 최빈값: 5점, 응답: 8건",
          "평균: 4, 최빈값: 4점, 응답: 8건",
          "평균: 3.5, 최빈값: 5점, 응답: 8건",
          "평균: 4.5, 최빈값: 4점, 응답: 8건",
        ],
        correctIndex: 1,
        explanation:
          "ratings 합계 = 5+4+3+5+4+4+2+5 = 32, 32/8 = 4이므로 평균은 4. 분포를 보면 5점=3개, 4점=3개, 3점=1개, 2점=1개. Object.entries 후 응답수(b[1]-a[1])로 정렬하면 5점과 4점이 3개로 동률인데, sort 는 안정 정렬이 아닐 수 있지만 여기서는 5가 먼저 들어가므로... 사실 dist 객체의 키 순서에 따라 entries 순서가 결정되고, 숫자 키는 오름차순이라 {2:1, 3:1, 4:3, 5:3}이 됩니다. sort 후 b[1]-a[1]로 내림차순 정렬하면 4점(3개)과 5점(3개)이 동률이고, sort 는 동률일 때 원래 순서를 유지하므로 4가 먼저 옵니다. 따라서 mode = '4'.",
      },
    ],
  } satisfies Quiz,
};
