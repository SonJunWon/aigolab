import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * Ch03 — 구조화 출력 (Structured Output / JSON Mode).
 *
 * 목표:
 *   - "자유 텍스트 파싱 지옥" 을 벗어나 LLM 응답을 JSON 객체로 직접 받기
 *   - responseSchema 로 모델이 스키마를 준수하게 강제
 *   - zod 로 런타임 검증까지 (타입 안전 + 오류 방어)
 *   - 리뷰 분석 미션 — { sentiment, topics, actionItems[] } 추출기
 *
 * 실행: Gemini (responseSchema 지원), 필요시 Groq 로 대체.
 * WebLLM 은 best-effort 만 지원 — 1B 모델이 스키마 준수율 낮음.
 */
export const lesson03: Lesson = {
  id: "ai-eng-03-structured-output",
  language: "ai-engineering",
  track: "beginner",
  order: 3,
  title: "구조화 출력 — JSON 지옥에서 탈출",
  subtitle: "LLM 응답을 타입 안전한 객체로 받는 법",
  estimatedMinutes: 35,
  cells: [
    // ─────────────────────────────────────────────
    // 1. 오리엔테이션
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `# 📦 자유 텍스트 파싱의 지옥

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

Ch02 까지 우리가 본 \`response.text\` 는 **자연어 문자열** 이었어요.
사람이 읽긴 좋지만, **코드가 그 안에서 값을 꺼내 쓰려면** 한숨이 나옵니다.

## 실제로 일어나는 일

다음 프롬프트를 ==LLM== 에 줬다고 합시다:
> "다음 리뷰의 감정·주제·개선 액션을 알려줘: '배송이 늦었어요. 박스도 찌그러져서 왔네요.'"

LLM 이 반환할 수 있는 답변:

\`\`\`
감정: 부정적
주제: 배송, 포장
개선 액션:
1. 배송 업체 재점검
2. 박스 보강
\`\`\`

이걸 **코드로 파싱** 하려면?
- "감정:" 뒤부터 줄 끝까지 정규식?
- "1." "2." 로 번호 리스트 분해?
- 다음번엔 "감정 :" 로 띄어쓰기 되면? "1)" 로 바뀌면? 줄바꿈이 다르면?

**매번 파싱 코드 다시 짜는 지옥**. 🔥

## 이 장에서 배울 것

| # | 내용 |
|---|---|
| 1 | **==Naive== 방법** 이 왜 실패하는지 직접 체험 (==JSON== 으로 답해 주세요) |
| 2 | **responseSchema** — 모델에게 ==스키마==를 강제로 알려주기 |
| 3 | **==zod==** 로 런타임 검증 (TypeScript 타입 + 런타임 가드) |
| 4 | **zod → JSON Schema** 자동 변환 (한 정의, 두 용도) |
| 5 | 실전: 제품 리뷰 배치 분석기`,
    },

    // ─────────────────────────────────────────────
    // 2. Naive 접근의 실패
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🪤 Naive 접근 — "JSON 으로 답해 주세요"

가장 직관적인 방법: **프롬프트로** "JSON 으로 답해" 라고 부탁. 되긴 되는데... 실패율이 높아요.

아래 셀은 \`temperature: 0.3\` 로 안정적으로 요청함에도 모델이:
- 마크다운 코드블록 감싸서 \`\`\`json ... \`\`\` 형태로 답하거나
- 앞에 "다음과 같습니다:" 같은 설명을 붙이거나
- 필드명을 살짝 바꾸거나 (sentiment → emotion)

등의 "거의 맞지만 파싱 깨지는" 답을 줄 수 있습니다. 여러 번 실행해보세요.`,
    },

    // ─────────────────────────────────────────────
    // 3. Naive 실험 셀
    // ─────────────────────────────────────────────
    {
      type: "llm-code",
      language: "typescript",
      source: `const prompt = \`다음 리뷰를 분석해 JSON 으로만 답해.

리뷰: "배송이 늦었어요. 박스도 찌그러져서 왔네요."

필드:
- sentiment: "positive" | "negative" | "neutral"
- topics: 주제 리스트 (한국어 명사)
- actionItems: 개선 액션 배열\`;

const response = await chat({
  provider: "gemini",
  temperature: 0.3,
  messages: [{ role: "user", content: prompt }],
});

console.log("── 원본 텍스트 ──");
console.log(response.text);

console.log("\\n── JSON.parse 시도 ──");
try {
  const data = JSON.parse(response.text);
  console.log("성공! topics:", data.topics);
} catch (e) {
  console.log("❌ 파싱 실패:", e instanceof Error ? e.message : String(e));
}`,
      hints: [
        "2~3번 실행해 '가끔 ```json ... ``` 코드블록 감싸는' 현상을 보세요. JSON.parse 는 그 즉시 터집니다.",
        "프롬프트에 '마크다운 블록 금지' / '순수 JSON만' 을 추가해도 완벽히 해결되지 않습니다.",
        "이 문제를 구조적으로 해결하는 게 이어질 responseSchema 접근입니다.",
      ],
    },

    // ─────────────────────────────────────────────
    // 4. responseSchema 소개
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🎯 해법: responseSchema

**responseSchema** 는 모델에게 "이 JSON Schema 를 **반드시 따라** JSON 으로 답하라" 고 강제하는 방법입니다.
\`chat()\` 옵션에 \`responseSchema\` 를 전달하면 자동으로:
1. 프롬프트에 "JSON 응답" 지시 자동 추가
2. 모델의 출력을 내부적으로 JSON 파싱
3. \`response.text\` 엔 JSON 문자열, **\`response.json\`** 엔 **파싱된 객체** 바로 들어옴

### JSON Schema 한 조각 예시

\`\`\`json
{
  "type": "object",
  "properties": {
    "sentiment": { "type": "string", "enum": ["positive", "negative", "neutral"] },
    "topics": { "type": "array", "items": { "type": "string" } },
    "actionItems": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["sentiment", "topics", "actionItems"]
}
\`\`\`

직접 이걸 손으로 쓰는 건 번거로워요. 그래서 **zod** 를 사용해 **TypeScript 코드로 작성 + 자동 변환** 합니다.`,
    },

    // ─────────────────────────────────────────────
    // 5. responseSchema 실습 (plain JSON Schema)
    // ─────────────────────────────────────────────
    {
      type: "llm-code",
      language: "typescript",
      source: `// 우선 JSON Schema 를 직접 써보기 — 뒤에서 zod 로 바꿉니다
const schema = {
  type: "object",
  properties: {
    sentiment: { type: "string", enum: ["positive", "negative", "neutral"] },
    topics: { type: "array", items: { type: "string" } },
    actionItems: { type: "array", items: { type: "string" } },
  },
  required: ["sentiment", "topics", "actionItems"],
};

const response = await chat({
  provider: "gemini",
  responseSchema: schema,
  messages: [
    {
      role: "user",
      content: \`다음 리뷰를 분석해:
"배송이 늦었어요. 박스도 찌그러져서 왔네요."\`,
    },
  ],
});

console.log("── response.text (JSON 문자열) ──");
console.log(response.text);

console.log("\\n── response.json (파싱된 객체) ──");
console.log(response.json);

// 이제 코드가 객체로 바로 접근 가능
const data = response.json as {
  sentiment: string;
  topics: string[];
  actionItems: string[];
};
console.log("\\n감정:", data.sentiment);
console.log("주제 수:", data.topics.length);`,
      hints: [
        "여러 번 실행해도 sentiment / topics / actionItems 세 필드가 **항상** 채워지는지 관찰하세요.",
        "response.json 은 이미 파싱돼 있어 JSON.parse 불필요. 타입만 단언하면 됩니다.",
        "enum 을 지정하면 모델이 ['positive','negative','neutral'] 외 다른 값을 내지 않습니다.",
      ],
    },

    // ─────────────────────────────────────────────
    // 6. zod 소개
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🛡️ zod — "타입 + 런타임 가드" 한 번에

방금 스키마는 **JSON 객체** 였어요. 하지만 두 가지 문제가 있습니다:
1. TypeScript 타입을 **따로 정의** 해야 함 (\`as { sentiment: ... }\`)
2. 런타임 검증이 없음 — 모델이 \`sentiment: "매우 부정"\` 같은 enum 외 값을 내도 \`response.json\` 엔 그대로 들어감

**zod** 는 한 정의로 **타입 + 런타임 검증** 을 모두 만듭니다:

\`\`\`ts
const Review = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  topics: z.array(z.string()),
  actionItems: z.array(z.string()),
});

// TypeScript 타입 추론
type ReviewT = z.infer<typeof Review>;  // { sentiment: ...; topics: string[]; ... }

// 런타임 검증
const data = Review.parse(response.json);  // 실패 시 ZodError throw
// const data: ReviewT — 이제 완전히 타입 안전
\`\`\`

### 왜 두 번 검증?
1. **responseSchema** — 모델이 **처음부터** 준수하도록 강제 (예방)
2. **zod.parse()** — 그래도 혹시 모를 오답에 대비 (방어)

### runtime 에 이미 주입됨
이 플랫폼은 학생 코드에 \`z\` 를 자동 주입해요. \`import { z } from "zod"\` 없이 바로 사용.`,
    },

    // ─────────────────────────────────────────────
    // 7. zod 실습
    // ─────────────────────────────────────────────
    {
      type: "llm-code",
      language: "typescript",
      source: `// 같은 스키마를 zod 로 정의
const Review = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  topics: z.array(z.string()).describe("리뷰의 주요 주제 2~5개"),
  actionItems: z.array(z.string()).describe("개선을 위한 구체적 액션 1~3개"),
});

// zod → JSON Schema 자동 변환 (toJsonSchema 도 자동 주입됨)
const schemaJson = toJsonSchema(Review);

const response = await chat({
  provider: "gemini",
  responseSchema: schemaJson,
  messages: [
    {
      role: "user",
      content: "리뷰: '배송이 늦었어요. 박스도 찌그러져서 왔네요.'",
    },
  ],
});

// zod 로 런타임 검증 — 스키마 불일치면 예외
const data = Review.parse(response.json);

// 이제 타입이 완벽히 안전
console.log("감정:", data.sentiment);   // "negative" 로 타입 좁혀짐
console.log("주제:", data.topics.join(", "));
console.log("\\n개선 액션:");
data.actionItems.forEach((action, i) => {
  console.log(\`  \${i + 1}. \${action}\`);
});`,
      hints: [
        "z.string().describe('...') 로 필드 설명 추가 — 모델이 이 설명을 참고해 더 정확히 답합니다.",
        "Review.parse(response.json) 은 실패 시 ZodError 던짐. try/catch 로 방어 가능.",
        "Review.safeParse() 는 던지지 않고 {success, data|error} 반환 — 에러 처리에 유용.",
      ],
    },

    // ─────────────────────────────────────────────
    // 8. 검증 실패 실습
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🔬 검증 실패는 어떻게 처리할까?

실전에선 모델이 드물게 **스키마를 어길** 수 있어요. 특히:
- 무료 티어 레이트 리밋 걸려 응답이 잘린 경우
- 작은 모델(WebLLM 1B)이 구조 유지 못한 경우
- 네트워크 에러로 부분 응답만 온 경우

**safeParse()** 를 쓰면 예외 없이 우아하게 처리할 수 있습니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const Review = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  topics: z.array(z.string()).min(1),
  actionItems: z.array(z.string()),
});

const response = await chat({
  provider: "gemini",
  responseSchema: toJsonSchema(Review),
  messages: [
    { role: "user", content: "리뷰: '이 제품 정말 완벽해요. 추천!'" },
  ],
});

// 에러 던지지 않는 검증
const result = Review.safeParse(response.json);

if (result.success) {
  console.log("✅ 검증 성공");
  console.log("감정:", result.data.sentiment);
  console.log("주제:", result.data.topics);
} else {
  console.log("❌ 스키마 불일치");
  console.log("원본 응답:", response.json);
  console.log("에러 상세:", result.error.issues);
}`,
      hints: [
        "topics 에 .min(1) 추가 — 빈 배열이면 검증 실패. 요구사항을 스키마에 직접 박아둘 수 있어요.",
        "result.error.issues 는 [{path, message, code}, ...] 배열. UI 에 사용자에게 표시하기 좋은 형태.",
        "긍정적인 리뷰에는 actionItems 가 비어있을 수 있음 — 그래도 스키마는 유효함.",
      ],
    },

    // ─────────────────────────────────────────────
    // 9. enum + nested
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🧱 중첩 객체 · 선택적 필드

실무 스키마는 보통 평면적이지 않아요. **중첩 객체 + 옵션 필드** 를 다루는 법:

\`\`\`ts
const OrderAnalysis = z.object({
  customer: z.object({
    sentiment: z.enum(["happy", "neutral", "upset"]),
    tier: z.enum(["new", "regular", "vip"]).optional(),   // 선택적
  }),
  issues: z.array(
    z.object({
      category: z.enum(["shipping", "product", "service"]),
      severity: z.number().int().min(1).max(5),            // 1~5 정수
      note: z.string(),
    })
  ),
  recommendCompensation: z.boolean(),
});
\`\`\`

다음 셀에서 중첩 스키마를 실제로 돌려봅시다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const OrderAnalysis = z.object({
  customer: z.object({
    sentiment: z.enum(["happy", "neutral", "upset"]),
    tier: z.enum(["new", "regular", "vip"]).optional(),
  }),
  issues: z.array(
    z.object({
      category: z.enum(["shipping", "product", "service"]),
      severity: z.number().int().min(1).max(5),
      note: z.string(),
    }),
  ),
  recommendCompensation: z.boolean(),
});

const reviewText = \`3개월째 단골인데 이번 주문은 정말 실망입니다.
배송은 예정보다 5일 늦었고, 받아보니 케이스에 스크래치가 있어요.
환불이나 바우처 아니면 다시는 안 살 것 같아요.\`;

const response = await chat({
  provider: "gemini",
  responseSchema: toJsonSchema(OrderAnalysis),
  messages: [{ role: "user", content: "분석할 고객 리뷰:\\n" + reviewText }],
});

const data = OrderAnalysis.parse(response.json);

console.log("고객 감정:", data.customer.sentiment);
console.log("고객 등급:", data.customer.tier ?? "미판별");
console.log("보상 권장:", data.recommendCompensation ? "예" : "아니오");
console.log("\\n이슈 분류:");
data.issues.forEach((issue, i) => {
  console.log(\`  \${i + 1}. [\${issue.category}] 심각도 \${issue.severity}/5 — \${issue.note}\`);
});`,
      hints: [
        "severity 에 .min(1).max(5) 붙여 모델이 1~5 범위로만 답하게 강제.",
        "tier 는 .optional() — 리뷰에 고객 등급 단서 없을 때 undefined 가능.",
        "리뷰 텍스트를 바꿔가며 실행해보세요. 중립적인 리뷰 / VIP 고객 리뷰 등.",
      ],
    },

    // ─────────────────────────────────────────────
    // 10. 미션 설명
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🎯 미션: 리뷰 배치 분석기

지금까지 배운 것을 **하나의 함수** 로 조립합니다.

### 요구사항

\`\`\`ts
interface ReviewBatch {
  reviews: string[];  // 리뷰 텍스트 배열
}

interface AnalysisResult {
  summary: {
    totalReviews: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
  };
  byReview: Array<{
    index: number;
    sentiment: "positive" | "negative" | "neutral";
    mainTopic: string;
    suggestedAction: string;
  }>;
  overallInsight: string;  // 전체 리뷰 패턴 한 줄 요약
}

async function analyzeReviews(batch: ReviewBatch): Promise<AnalysisResult>;
\`\`\`

### 작업 순서

1. zod 로 \`AnalysisResult\` 에 대응하는 스키마 작성
2. 리뷰 배열을 프롬프트에 포함 (번호로 구분해 입력)
3. \`responseSchema\` 전달해서 \`chat\` 호출
4. \`parse\` 로 검증 후 반환

막히면 힌트 → 정답 보기 순으로.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `interface ReviewBatch {
  reviews: string[];
}

async function analyzeReviews(batch: ReviewBatch) {
  // TODO: 여기를 채우세요
  //  1) zod 로 AnalysisResult 스키마 작성
  //  2) reviews 배열을 번호 매겨 프롬프트에 포함
  //  3) responseSchema 전달해 chat 호출
  //  4) parse 후 반환
  throw new Error("아직 미구현 — 힌트 참고해 완성해보세요");
}

// 테스트
const result = await analyzeReviews({
  reviews: [
    "최고의 제품이에요, 재구매 의사 있습니다!",
    "배송이 하루 지연. 제품 자체는 만족.",
    "불량품이었어요. 환불 요청합니다.",
    "그저 그래요, 가격 대비 딱 평범.",
  ],
});

console.log("총 리뷰:", result.summary.totalReviews);
console.log("긍정:", result.summary.positiveCount);
console.log("부정:", result.summary.negativeCount);
console.log("\\n통찰:", result.overallInsight);`,
      hints: [
        "스키마 구조 힌트:\\nconst AnalysisSchema = z.object({\\n  summary: z.object({\\n    totalReviews: z.number().int(),\\n    positiveCount: z.number().int(),\\n    negativeCount: z.number().int(),\\n    neutralCount: z.number().int(),\\n  }),\\n  byReview: z.array(z.object({\\n    index: z.number().int(),\\n    sentiment: z.enum(['positive','negative','neutral']),\\n    mainTopic: z.string(),\\n    suggestedAction: z.string(),\\n  })),\\n  overallInsight: z.string(),\\n});",
        "프롬프트에 리뷰를 번호로: '1) ...\\n2) ...\\n3) ...' 형태로 넣고 '각 리뷰를 index 1-based 로 분석' 명시.",
        "chat 호출 시 provider:'gemini', responseSchema: toJsonSchema(AnalysisSchema) 전달.",
      ],
      solution: `interface ReviewBatch {
  reviews: string[];
}

const AnalysisSchema = z.object({
  summary: z.object({
    totalReviews: z.number().int(),
    positiveCount: z.number().int(),
    negativeCount: z.number().int(),
    neutralCount: z.number().int(),
  }),
  byReview: z.array(
    z.object({
      index: z.number().int(),
      sentiment: z.enum(["positive", "negative", "neutral"]),
      mainTopic: z.string(),
      suggestedAction: z.string(),
    }),
  ),
  overallInsight: z.string(),
});

async function analyzeReviews(batch: ReviewBatch) {
  const numberedReviews = batch.reviews
    .map((r, i) => \`\${i + 1}) \${r}\`)
    .join("\\n");

  const response = await chat({
    provider: "gemini",
    responseSchema: toJsonSchema(AnalysisSchema),
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "너는 제품 리뷰 분석가야. 각 리뷰를 개별 분석하고, 전체 패턴을 한 줄로 요약해.",
      },
      {
        role: "user",
        content:
          \`다음 리뷰들을 분석해:\\n\\n\${numberedReviews}\\n\\n각 리뷰에 1-based index 를 붙여서 byReview 에 담고, summary 에 집계, overallInsight 에 전체 패턴을 한 줄로 요약.\`,
      },
    ],
  });

  return AnalysisSchema.parse(response.json);
}

const result = await analyzeReviews({
  reviews: [
    "최고의 제품이에요, 재구매 의사 있습니다!",
    "배송이 하루 지연. 제품 자체는 만족.",
    "불량품이었어요. 환불 요청합니다.",
    "그저 그래요, 가격 대비 딱 평범.",
  ],
});

console.log("총 리뷰:", result.summary.totalReviews);
console.log("긍정:", result.summary.positiveCount);
console.log("부정:", result.summary.negativeCount);
console.log("\\n통찰:", result.overallInsight);
console.log("\\n리뷰별:");
result.byReview.forEach((r) => {
  console.log(\`  [\${r.index}] \${r.sentiment} — \${r.mainTopic}\`);
  console.log(\`        → \${r.suggestedAction}\`);
});`,
    },

    // ─────────────────────────────────────────────
    // 11. 정리
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🧭 Ch03 정리 + Ch04 예고

### 오늘 배운 것
- ✅ 자유 텍스트 파싱의 고통 체험
- ✅ \`responseSchema\` 로 모델이 JSON 스키마를 따르도록 강제
- ✅ \`response.json\` 으로 파싱된 객체 자동 추출
- ✅ **zod** 로 타입 + 런타임 검증을 한 정의로
- ✅ \`toJsonSchema(zodSchema)\` 로 zod → JSON Schema 자동 변환
- ✅ 중첩 객체 · optional · enum · 숫자 range · array min 패턴

### 실무 팁
- **responseSchema** 는 제공자별 지원이 다름:
  - Gemini: 완벽 지원 (이 레슨 기본 선택)
  - Groq: OpenAI 호환 (strict:true 지원)
  - WebLLM: best-effort (1B 모델이라 준수율 낮음)
- 고위험 필드엔 반드시 **zod.parse** 로 이중 방어
- 스키마에 **describe()** 를 넣으면 모델이 해당 필드의 의미를 더 잘 이해

### Ch04 예고 — Chain of Thought + 스트리밍
Ch03 까지는 "**답만** 빨리 받기". Ch04 부터는:
- 모델이 **생각하는 과정을 토큰 단위로 실시간 관찰** (Thought Stream)
- Let's think step by step / CoT 기법
- 수학·논리 문제 정확도 급상승
- \`stream: true\` + \`onToken\` 활용

🧠 **"AI 가 고민하는 걸 보며 배운다"** — 완전히 다른 학습 경험이에요.`,
    },
  ],

  quiz: {
    title: "Ch03 — 구조화 출력 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "자유 텍스트 응답을 파싱하는 주요 문제점은?",
        options: [
          "토큰이 비싸진다",
          "모델 속도가 느려진다",
          "매번 포맷이 미묘하게 달라 정규식·수동 파싱이 취약 — 유지보수 지옥",
          "한국어 지원이 안 된다",
        ],
        correctIndex: 2,
        explanation:
          "같은 프롬프트에도 모델 응답 포맷은 미묘히 달라집니다. 마크다운 블록, 필드명, 띄어쓰기, 번호 스타일 등이 흔들리기 때문에 수동 파싱은 회귀 버그가 자주 생겨요.",
      },
      {
        type: "multiple-choice",
        question: "`responseSchema` 를 지정하면 `response` 객체에 무엇이 추가로 채워지나요?",
        options: [
          "response.code",
          "response.json — 파싱된 JavaScript 객체",
          "response.xml",
          "response.markdown",
        ],
        correctIndex: 1,
        explanation:
          "어댑터가 JSON 문자열을 내부적으로 파싱해 response.json 에 객체로 담아둡니다. response.text 엔 여전히 JSON 문자열 원문이 있어요.",
      },
      {
        type: "multiple-choice",
        question: "zod 의 역할은 무엇인가요?",
        options: [
          "LLM 모델 이름",
          "JSON 파서 라이브러리",
          "한 정의로 TypeScript 타입 + 런타임 검증을 모두 제공하는 스키마 라이브러리",
          "암호화 유틸",
        ],
        correctIndex: 2,
        explanation:
          "z.object({...}) 한 번 정의하면 z.infer<> 로 타입을, .parse() 로 런타임 검증을 동시에 얻을 수 있어요. 이중 정의 부담 해소 + 런타임 방어막까지.",
      },
      {
        type: "multiple-choice",
        question: "`Review.parse()` 와 `Review.safeParse()` 의 차이는?",
        options: [
          "parse 는 동기, safeParse 는 비동기",
          "parse 는 실패 시 ZodError throw, safeParse 는 {success, data|error} 객체 반환",
          "parse 는 유료, safeParse 는 무료",
          "차이 없음",
        ],
        correctIndex: 1,
        explanation:
          "실서비스에서는 모델 오류를 예외가 아닌 값으로 다루는 게 안전해서 safeParse 가 자주 쓰입니다. 잘못된 응답을 사용자에게 매끄럽게 보여줄 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "WebLLM 에서 `responseSchema` 를 지정했을 때 기대할 수 있는 동작은?",
        options: [
          "완벽한 JSON 준수",
          "컴파일 에러",
          "best-effort 준수 — 1B 모델이라 복잡한 스키마는 자주 어김",
          "자동으로 Gemini 로 페일오버",
        ],
        correctIndex: 2,
        explanation:
          "WebLLM 도 OpenAI 호환 response_format 을 받지만, 모델 크기가 작아 중첩·enum 많은 스키마에서 오류율이 올라갑니다. 클라우드 모델(Gemini/Groq) 권장.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 zod 에서 optional 필드를 선언하는 방법은?",
        options: [
          "z.optional.string()",
          "z.string().optional()",
          "z.string(?, true)",
          "z.string().nullable()  // 이것만 optional 에 해당",
        ],
        correctIndex: 1,
        explanation:
          ".optional() 을 체이닝해서 해당 필드를 선택적으로 만듭니다. .nullable() 은 '값이 null 도 올 수 있다' 는 다른 의미.",
      },
    ],
  } satisfies Quiz,
};
