import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W30 — AI 웹 스크래퍼 빌더.
 *
 * Part A: 플랫폼에서 HTML 구조 분석 + 추출 규칙 생성 + 데이터 정제 체험 (LLM 셀)
 * Part B: MD 레시피로 URL 입력 → AI 분석 → 데이터 추출 → CSV/JSON 내보내기 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW30: Lesson = {
  id: "ai-eng-w30-web-scraper",
  language: "ai-engineering",
  track: "beginner",
  order: 130,
  title: "W30: AI 웹 스크래퍼 빌더",
  subtitle: "URL만 입력하면 AI가 데이터 추출 규칙 자동 생성",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 🕷️ AI 웹 스크래퍼 빌더 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**URL 만 입력하면 AI 가 페이지 구조를 분석하고, 데이터 추출 규칙을 자동 생성하고, 깔끔한 테이블로 정리해 CSV/JSON 내보내기까지 해 주는 웹 ==스크래핑== 도구** — 코드 한 줄 없이 원하는 데이터를 뽑아내는 "AI 데이터 수집기" 입니다.

### 완성 모습
\`\`\`
       URL 입력                AI 분석                데이터 테이블             내보내기
  ┌──────────────┐       ┌──────────────┐       ┌──────────────────┐      ┌──────────┐
  │ https://...  │ ───▶  │ 🤖 HTML 구조 │ ───▶  │ 이름  | 가격     │ ───▶ │ 📥 CSV   │
  │   [분석 시작] │       │   분석 중... │       │ ──── | ────     │      │ 📥 JSON  │
  └──────────────┘       │ 필드 3개 발견 │       │ 상품A | ₩12,000 │      └──────────┘
                         └──────────────┘       │ 상품B | ₩8,500  │
                                                └──────────────────┘

┌─ AI Web Scraper ──────────────────────────────────────────────────┐
│  🕷️ Scraper Builder       [📜 히스토리] [⏰ 예약] [🌙 다크모드]  │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  🔗 URL: [https://example.com/products____________] [🔍 분석]     │
│                                                                   │
│  ┌─ AI 분석 결과 ─────────────────────────────────────────────┐   │
│  │ 📊 페이지 타입: 상품 목록 (Product Listing)                │   │
│  │ 🏷️ 발견된 필드:                                           │   │
│  │   ✅ 상품명  — .product-card h2          [포함 ▼]          │   │
│  │   ✅ 가격    — .product-card .price      [포함 ▼]          │   │
│  │   ✅ 이미지  — .product-card img[src]    [포함 ▼]          │   │
│  │   ☐ 설명    — .product-card .desc       [제외 ▼]          │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ ==CSS selector== 편집기 ──────────────────────────────────┐   │
│  │  상품명: [.product-card h2           ]  🎯 미리보기: 3건  │   │
│  │  가격:   [.product-card .price       ]  🎯 미리보기: 3건  │   │
│  │  이미지: [.product-card img[src]     ]  🎯 미리보기: 3건  │   │
│  │  [+ 필드 추가]                        [🔄 다시 분석]      │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ 데이터 미리보기 (12건) ───────────────────────────────────┐   │
│  │  # │ 상품명          │ 가격      │ 이미지 URL              │   │
│  │ ── │ ─────────────── │ ──────── │ ──────────────────────── │   │
│  │  1 │ 노트북 Pro 15   │ ₩1,290,000│ https://img.ex/01.jpg  │   │
│  │  2 │ 무선 마우스     │ ₩35,000   │ https://img.ex/02.jpg  │   │
│  │  3 │ USB-C 허브      │ ₩28,000   │ https://img.ex/03.jpg  │   │
│  │ [🔍 필터] [✏️ 편집] [🗑️ 행 삭제]                          │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [📥 CSV 다운로드]  [📥 JSON 다운로드]  [💾 규칙 저장]            │
└───────────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | HTML 구조 분석 + 추출 규칙 생성 + 데이터 정제 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 웹 스크래퍼 웹앱 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 웹 스크래퍼 AI 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 웹 스크래퍼 AI 두뇌 만들기 (50분)

웹 페이지에서 원하는 데이터를 뽑으려면 HTML 구조를 이해해야 해요. 하지만 AI 가 있으면 **HTML 을 직접 읽지 않아도** 됩니다. AI 가 페이지 구조를 분석하고, ==CSS selector== 를 자동 생성하고, 추출한 데이터를 깔끔하게 정리해 줍니다.

핵심 개념 3가지:
1. **HTML 구조 분석** — AI 가 페이지의 반복 패턴(목록, 카드, 테이블)을 찾아 데이터 필드를 자동 식별
2. **추출 규칙 생성** — 식별된 필드마다 ==CSS selector== 를 만들어 정확히 원하는 데이터만 추출
3. **데이터 정제/변환** — 추출한 원시 텍스트에서 가격 포맷, 날짜 변환, 불필요한 공백 제거 등 자동 클리닝

### 셀 실행 방법
1. 각 코드 셀의 ▶️ 버튼을 클릭하세요.
2. AI 가 JSON 형식으로 분석 결과를 생성합니다.
3. 힌트(💡)를 참고하면 결과를 더 잘 이해할 수 있어요.`,
    },

    // ─── LLM 셀 1: HTML 구조 분석 ───
    {
      type: "markdown",
      source: `### 🔍 실습 1: HTML 구조 분석

샘플 HTML 을 AI 에게 보내면 **페이지 타입**, **반복 패턴**, **추출 가능한 필드** 를 자동으로 식별합니다.

> ==스크래핑== 의 첫 단계는 "이 페이지에 어떤 데이터가 있는가?" 를 파악하는 것이에요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🔍 AI HTML 구조 분석기
const sampleHtml = \`
<div class="product-list">
  <div class="product-card">
    <img src="https://img.example.com/laptop.jpg" alt="노트북 Pro 15">
    <h2 class="product-name">노트북 Pro 15</h2>
    <span class="price">₩1,290,000</span>
    <p class="description">15인치 고성능 노트북, M3 칩셋</p>
    <span class="rating">⭐ 4.8 (234)</span>
    <a href="/products/laptop-pro-15" class="detail-link">상세보기</a>
  </div>
  <div class="product-card">
    <img src="https://img.example.com/mouse.jpg" alt="무선 마우스">
    <h2 class="product-name">무선 마우스 Ergo</h2>
    <span class="price">₩35,000</span>
    <p class="description">인체공학 무선 마우스, 조용한 클릭</p>
    <span class="rating">⭐ 4.5 (89)</span>
    <a href="/products/mouse-ergo" class="detail-link">상세보기</a>
  </div>
  <div class="product-card">
    <img src="https://img.example.com/hub.jpg" alt="USB-C 허브">
    <h2 class="product-name">USB-C 허브 7-in-1</h2>
    <span class="price">₩28,000</span>
    <p class="description">HDMI + USB3.0 x3 + SD + PD 충전</p>
    <span class="rating">⭐ 4.3 (156)</span>
    <a href="/products/usb-hub" class="detail-link">상세보기</a>
  </div>
</div>
\`;

const systemPrompt = \`너는 웹 스크래핑 전문가야.
사용자가 HTML 코드를 주면 구조를 분석해서 아래 JSON 형식으로 응답해:

{
  "pageType": "product-list | article-list | table | single-item | other",
  "containerSelector": "반복 요소의 부모 CSS selector",
  "itemSelector": "각 아이템의 CSS selector",
  "itemCount": 숫자,
  "fields": [
    {
      "name": "필드 이름 (영문)",
      "label": "필드 라벨 (한국어)",
      "selector": "CSS selector",
      "attribute": "textContent | href | src | alt 등",
      "sampleValues": ["샘플값1", "샘플값2"],
      "dataType": "text | number | url | image | date"
    }
  ],
  "pagination": {
    "detected": true/false,
    "selector": "다음 페이지 버튼 CSS selector 또는 null",
    "pattern": "URL 패턴 설명 또는 null"
  },
  "warnings": ["주의사항1", "주의사항2"]
}
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 HTML 의 구조를 분석하고 추출 가능한 데이터 필드를 알려줘:\\n\\n\${sampleHtml}\` },
  ],
});

try {
  const analysis = JSON.parse(res.text);
  console.log("🔍 HTML 구조 분석 결과");
  console.log("═".repeat(50));
  console.log(\`\\n📄 페이지 타입: \${analysis.pageType}\`);
  console.log(\`📦 컨테이너: \${analysis.containerSelector}\`);
  console.log(\`🔁 아이템: \${analysis.itemSelector} (x\${analysis.itemCount})\`);

  console.log("\\n🏷️ 발견된 필드:");
  analysis.fields?.forEach((f: any, i: number) => {
    console.log(\`  \${i + 1}. \${f.label} (\${f.name})\`);
    console.log(\`     selector: \${f.selector}\`);
    console.log(\`     속성: \${f.attribute}  |  타입: \${f.dataType}\`);
    console.log(\`     샘플: \${f.sampleValues?.slice(0, 2).join(", ")}\`);
  });

  console.log("\\n📑 페이지네이션:", analysis.pagination?.detected ? "감지됨" : "없음");
  if (analysis.warnings?.length) {
    console.log("\\n⚠️ 주의사항:");
    analysis.warnings.forEach((w: string, i: number) =>
      console.log(\`  \${i + 1}. \${w}\`)
    );
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "pageType 은 AI 가 HTML 패턴을 보고 자동 분류한 결과예요. 목록, 테이블, 단일 상세 등.",
        "CSS selector 의 점(.)은 class, 대괄호([src])는 속성을 의미합니다.",
        "sampleValues 를 보면 selector 가 정확한지 바로 확인할 수 있어요.",
        "pagination 은 다음 페이지 버튼이 있는지 감지합니다 — 대량 수집 시 필수!",
      ],
    },

    // ─── LLM 셀 2: 추출 규칙 생성 ───
    {
      type: "markdown",
      source: `### 🏗️ 실습 2: 추출 규칙 자동 생성

"이런 데이터를 뽑고 싶다" 고 자연어로 요청하면, AI 가 **정확한 ==CSS selector==** 와 **후처리 로직** 까지 포함한 추출 규칙을 생성합니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🏗️ AI 추출 규칙 생성기
const userRequest = "상품명, 가격(숫자만), 평점(숫자만), 상세 링크를 뽑아줘";

const htmlSnippet = \`
<div class="product-card">
  <img src="https://img.example.com/laptop.jpg" alt="노트북 Pro 15">
  <h2 class="product-name">노트북 Pro 15</h2>
  <span class="price">₩1,290,000</span>
  <p class="description">15인치 고성능 노트북</p>
  <span class="rating">⭐ 4.8 (234)</span>
  <a href="/products/laptop-pro-15" class="detail-link">상세보기</a>
</div>
\`;

const systemPrompt = \`너는 웹 데이터 추출 규칙 설계 전문가야.
사용자가 HTML 샘플과 원하는 데이터를 설명하면, 추출 규칙을 JSON 으로 만들어.

{
  "rules": [
    {
      "fieldName": "영문 필드명",
      "label": "한국어 라벨",
      "selector": "CSS selector",
      "attribute": "textContent | href | src",
      "transform": {
        "type": "none | regex | replace | number | split",
        "pattern": "정규식 패턴 (regex 타입일 때)",
        "replacement": "대체 문자 (replace 타입일 때)",
        "description": "변환 설명"
      },
      "fallback": "추출 실패 시 기본값",
      "example": { "raw": "원본 텍스트", "result": "변환 결과" }
    }
  ],
  "extractionCode": "TypeScript 추출 함수 코드 (querySelector 사용)",
  "estimatedFields": 숫자,
  "tips": ["팁1", "팁2"]
}
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`HTML 샘플:\\n\${htmlSnippet}\\n\\n요청: \${userRequest}\` },
  ],
});

try {
  const result = JSON.parse(res.text);
  console.log("🏗️ 추출 규칙 생성 결과");
  console.log("═".repeat(50));
  console.log(\`📊 총 \${result.estimatedFields}개 필드 규칙 생성\\n\`);

  result.rules?.forEach((r: any, i: number) => {
    console.log(\`── 규칙 \${i + 1}: \${r.label} (\${r.fieldName}) ──\`);
    console.log(\`   selector:  \${r.selector}\`);
    console.log(\`   속성:      \${r.attribute}\`);
    if (r.transform?.type !== "none") {
      console.log(\`   변환:      \${r.transform?.description}\`);
      if (r.transform?.pattern) console.log(\`   패턴:      \${r.transform.pattern}\`);
    }
    console.log(\`   예시:      "\${r.example?.raw}" → "\${r.example?.result}"\`);
    console.log(\`   fallback:  \${r.fallback}\\n\`);
  });

  if (result.tips?.length) {
    console.log("💡 팁:");
    result.tips.forEach((t: string, i: number) =>
      console.log(\`  \${i + 1}. \${t}\`)
    );
  }

  if (result.extractionCode) {
    console.log("\\n📝 추출 코드 미리보기:");
    console.log(result.extractionCode.slice(0, 300) + "...");
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "transform 의 regex 타입은 가격에서 쉼표와 원화 기호를 제거할 때 유용해요.",
        "fallback 값은 해당 필드를 못 찾았을 때 빈 문자열 대신 넣을 기본값입니다.",
        "extractionCode 를 그대로 웹앱에 붙여 넣으면 바로 작동해요!",
        "selector 가 여러 요소를 반환할 수 있으니 querySelectorAll + map 패턴이 일반적.",
      ],
    },

    // ─── LLM 셀 3: 데이터 정제/변환 ───
    {
      type: "markdown",
      source: `### 🧹 실습 3: 데이터 정제 및 변환

추출한 원시(raw) 데이터는 그대로 쓰기 어려운 경우가 많아요. AI 가 **가격 포맷 통일**, **날짜 표준화**, **중복 제거**, **타입 변환** 등 정제 파이프라인을 설계합니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🧹 AI 데이터 정제 파이프라인
const rawData = [
  { name: "  노트북 Pro 15  ", price: "₩1,290,000", rating: "⭐ 4.8 (234)", link: "/products/laptop-pro-15" },
  { name: "무선 마우스 Ergo", price: "₩35,000", rating: "⭐ 4.5 (89건)", link: "/products/mouse-ergo" },
  { name: "USB-C 허브 7-in-1 ", price: "28,000원", rating: "4.3점 (156)", link: "/products/usb-hub" },
  { name: "노트북 Pro 15", price: "1290000", rating: "4.8", link: "/products/laptop-pro-15" },
];

const systemPrompt = \`너는 데이터 정제 전문가야.
사용자가 웹에서 추출한 raw 데이터를 주면, 정제 규칙을 설계해서 아래 JSON 으로 응답해:

{
  "analysis": {
    "totalRows": 숫자,
    "duplicates": 숫자,
    "issues": ["문제점1", "문제점2"]
  },
  "cleaningPipeline": [
    {
      "step": 1,
      "operation": "trim | dedup | normalize | typecast | format",
      "target": "필드명 또는 all",
      "description": "한국어 설명",
      "before": "변환 전 예시",
      "after": "변환 후 예시"
    }
  ],
  "cleanedData": [
    { "필드명": "정제된 값" }
  ],
  "exportFormats": {
    "csv": "CSV 헤더 + 첫 2행 미리보기",
    "json": "JSON 미리보기 (첫 1개 객체)"
  },
  "qualityScore": 1-10,
  "qualityNotes": "품질 평가 코멘트"
}
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`추출한 raw 데이터를 정제해줘:\\n\\n\${JSON.stringify(rawData, null, 2)}\` },
  ],
});

try {
  const result = JSON.parse(res.text);
  console.log("🧹 데이터 정제 결과");
  console.log("═".repeat(50));

  const a = result.analysis;
  console.log(\`\\n📊 분석: \${a.totalRows}행, 중복 \${a.duplicates}건\`);
  if (a.issues?.length) {
    console.log("⚠️ 발견된 문제:");
    a.issues.forEach((issue: string) => console.log(\`   - \${issue}\`));
  }

  console.log("\\n🔧 정제 파이프라인:");
  result.cleaningPipeline?.forEach((step: any) => {
    console.log(\`  Step \${step.step}: \${step.description}\`);
    console.log(\`    대상: \${step.target} | 작업: \${step.operation}\`);
    console.log(\`    전: "\${step.before}" → 후: "\${step.after}"\`);
  });

  console.log("\\n✅ 정제된 데이터:");
  result.cleanedData?.forEach((row: any, i: number) => {
    console.log(\`  \${i + 1}. \${JSON.stringify(row)}\`);
  });

  console.log("\\n📥 내보내기 미리보기:");
  if (result.exportFormats?.csv) {
    console.log("  CSV:");
    console.log(\`    \${result.exportFormats.csv}\`);
  }

  console.log(\`\\n⭐ 품질 점수: \${result.qualityScore}/10\`);
  console.log(\`📝 \${result.qualityNotes}\`);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "trim 은 앞뒤 공백 제거, dedup 은 중복 행 제거를 의미해요.",
        "가격은 숫자로 변환해야 정렬/필터가 가능합니다 — '₩1,290,000' → 1290000.",
        "평점 포맷이 제각각('⭐ 4.8', '4.3점')인 것도 AI 가 통일해 줍니다.",
        "exportFormats 의 CSV 는 쉼표 구분 텍스트, JSON 은 배열 형태입니다.",
      ],
    },

    // ─── Part B: 웹앱으로 완성 ───
    {
      type: "markdown",
      source: `---

## Part B: 웹 스크래퍼 웹앱 완성하기 (100분)

Part A 에서 만든 AI 분석 능력을 **실제 URL 을 입력받는 웹앱** 으로 조립합니다.
아래 레시피를 통째로 복사해서 Claude Code 또는 Cursor 에 붙여 넣으세요.

> 🛠️ **도구**: VS Code + Claude Code (또는 Cursor AI)
> 💰 **비용**: Gemini API 무료 티어로 충분

---

### 📋 레시피 (복사해서 AI 에게 전달)

\`\`\`markdown
# AI 웹 스크래퍼 빌더 — 풀스택 레시피

## 프로젝트 개요
URL 을 입력하면 AI 가 HTML 구조를 분석하고, 데이터 추출 규칙을 자동 생성하며,
추출된 데이터를 테이블로 미리보기하고 CSV/JSON 으로 내보내는 웹앱.

## 기술 스택
- **프레임워크**: React 18 + TypeScript + Vite
- **스타일**: Tailwind CSS 4
- **AI**: @google/genai (Gemini 2.0 Flash)
- **상태관리**: React useState + useReducer
- **아이콘**: lucide-react

## 셋업
\\\`\\\`\\\`bash
npm create vite@latest ai-web-scraper -- --template react-ts
cd ai-web-scraper
npm install @google/genai lucide-react
npm install -D tailwindcss @tailwindcss/vite
\\\`\\\`\\\`

vite.config.ts 에 tailwindcss 플러그인 추가.
app.css 에 \\\`@import "tailwindcss";\\\` 추가.

## 환경 변수
\\\`\\\`\\\`
VITE_GEMINI_API_KEY=여기에_API_키
\\\`\\\`\\\`

## 핵심 기능

### 1. URL 입력 및 HTML 가져오기
- URL 입력 필드 + "분석" 버튼
- ==CORS== 프록시를 통해 HTML 가져오기 (corsproxy.io 또는 allorigins.win)
- 로딩 상태 표시 (스피너 + "AI 가 페이지를 분석하고 있어요...")
- URL 유효성 검사 (https:// 확인)

### 2. AI HTML 구조 분석
- 가져온 HTML 을 Gemini 에게 전송
- AI 가 페이지 타입(목록/테이블/단일) 식별
- 추출 가능한 필드 목록 자동 생성
- 각 필드마다 CSS selector + 데이터 타입 + 샘플값 표시
- 필드별 "포함/제외" 토글

### 3. CSS Selector 편집기
- AI 가 생성한 selector 를 사용자가 직접 수정 가능
- selector 수정 시 실시간 미리보기 (매칭 건수 표시)
- 필드 추가/삭제 기능
- "다시 분석" 버튼으로 AI 재분석

### 4. 데이터 미리보기 테이블
- 추출된 데이터를 깔끔한 테이블로 표시
- 열 정렬 (클릭 시 오름/내림차순)
- 행 편집 (셀 클릭 → 인라인 수정)
- 행 삭제/필터 기능
- 데이터 건수 표시

### 5. 데이터 정제
- AI 가 자동 정제 (공백 제거, 포맷 통일)
- 가격 → 숫자 변환
- 날짜 → ISO 형식 변환
- 중복 행 감지 및 하이라이트

### 6. CSV/JSON 내보내기
- "CSV 다운로드" 버튼 → .csv 파일 생성/다운로드
- "JSON 다운로드" 버튼 → .json 파일 생성/다운로드
- 파일명: {도메인}_{날짜}.csv/.json

### 7. 스크랩 히스토리
- localStorage 에 이전 스크랩 기록 저장
- URL, 날짜, 추출 건수, 사용한 규칙 표시
- 기록 클릭 → 동일 규칙으로 재실행
- 기록 삭제 기능

### 8. 예약 스크래핑 (컨셉)
- 크론 주기 선택 UI (매일/매주/매시간)
- "이 기능은 서버 측 구현이 필요합니다" 안내
- 예약 목록 표시 (UI 시뮬레이션)

## UI 구조

\\\`\\\`\\\`
App
├── Header (타이틀, 히스토리 버튼, 예약 버튼, 다크모드 토글)
├── UrlInputSection (URL 입력, 분석 버튼, 로딩 상태)
├── AnalysisResult (페이지 타입, 필드 목록, 포함/제외 토글)
├── SelectorEditor (필드별 CSS selector 편집, 미리보기 건수)
├── DataPreviewTable (데이터 테이블, 정렬, 편집, 필터, 삭제)
├── ExportButtons (CSV 다운로드, JSON 다운로드)
├── HistoryPanel (스크랩 기록 사이드 패널)
└── SchedulePanel (예약 스크래핑 개념 UI)
\\\`\\\`\\\`

## 다크/라이트 모드
- 시스템 설정 감지 + 수동 토글
- 라이트: 흰 배경, 슬레이트 텍스트
- 다크: slate-900 배경, slate-100 텍스트
- 토글 아이콘: Sun ↔ Moon

## 중요 구현 노트

### CORS 프록시
\\\`\\\`\\\`typescript
const fetchHtml = async (url: string): Promise<string> => {
  const proxyUrl = \\\\\\\`https://api.allorigins.win/raw?url=\\\\\\\${encodeURIComponent(url)}\\\\\\\`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error("페이지를 가져올 수 없습니다");
  return res.text();
};
\\\`\\\`\\\`

### AI 분석 프롬프트 구조
HTML 이 너무 길면 앞부분 5000자만 잘라서 전송.
"body 태그 내용만 분석해" 지시.
JSON 응답 강제 (마크다운 코드블록 제거 로직 포함).

### CSV 생성
\\\`\\\`\\\`typescript
const toCsv = (headers: string[], rows: string[][]): string => {
  const escape = (s: string) => \\\\\\\`"\\\\\\\${s.replace(/"/g, '""')}"\\\\\\\`;
  const headerLine = headers.map(escape).join(",");
  const dataLines = rows.map(r => r.map(escape).join(","));
  return [headerLine, ...dataLines].join("\\n");
};
\\\`\\\`\\\`

## 스타일 가이드
- 둥근 카드 (rounded-2xl, shadow-lg)
- 보라색 액센트 (violet-500/600) — 분석 버튼, 액티브 상태
- 초록색 성공 (emerald-500) — 추출 완료, 내보내기
- 부드러운 전환 (transition-all duration-300)
- 반응형 (모바일: 세로 스택, 데스크탑: 그리드)
\\\`\\\`\\\`

---

### 🏃 시작하기

1. 위 레시피를 **통째로 복사**
2. Claude Code 또는 Cursor 채팅에 붙여 넣기
3. \`npm run dev\` 로 확인
4. URL 을 입력하고 AI 분석 결과를 확인!

> 💡 **테스트 추천 URL**: 쇼핑몰 상품 목록, 뉴스 기사 목록, Wikipedia 테이블 등 반복 패턴이 있는 페이지가 좋아요.`,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `---

## 🚀 도전 과제

기본 레시피를 완성했다면, 아래 기능을 추가해 보세요!

### 도전 1: 🔄 페이지네이션 자동 처리
"다음 페이지" 버튼을 감지해서 여러 페이지를 연속 스크래핑. AI 가 페이지네이션 패턴(URL 파라미터, 버튼 selector)을 분석하고 자동으로 다음 페이지를 가져와 데이터를 합칩니다.

### 도전 2: 📊 데이터 시각화
추출한 데이터를 차트로 시각화. 가격 분포 히스토그램, 평점 분포 파이 차트, 시간별 추세 라인 차트 등. Chart.js 나 Recharts 라이브러리 활용.

### 도전 3: 🔔 변경 감지 알림
이전에 스크래핑한 데이터와 새 데이터를 비교해서 변경된 항목(가격 변동, 신규 추가, 삭제)을 하이라이트. diff 알고리즘으로 변경 내역 표시.

### 도전 4: 🧩 템플릿 라이브러리
자주 쓰는 사이트별 추출 규칙을 템플릿으로 저장/공유. "쿠팡 상품", "네이버 뉴스", "GitHub 리포지토리" 등 프리셋 제공.

### 도전 5: 🤖 AI 고급 분석
추출한 데이터에 대해 AI 에게 추가 질문: "가장 가성비 좋은 상품은?", "가격 트렌드는?", "이 데이터에서 인사이트를 뽑아줘" — 데이터 분석 어시스턴트 기능.`,
    },
  ],

  quiz: {
    title: "W30: AI 웹 스크래퍼 빌더 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "브라우저에서 다른 도메인의 HTML 을 가져올 때 발생하는 보안 제한은?",
        options: [
          "XSS (Cross-Site Scripting)",
          "CSRF (Cross-Site Request Forgery)",
          "==CORS== (Cross-Origin Resource Sharing) 정책",
          "SQL Injection",
        ],
        correctIndex: 2,
        explanation:
          "브라우저는 ==CORS== 정책에 의해 다른 도메인으로의 요청을 기본적으로 차단합니다. 이를 우회하기 위해 CORS 프록시 서버를 사용하거나, 서버 사이드에서 요청을 보내야 해요.",
      },
      {
        type: "multiple-choice",
        question:
          '==CSS selector== `div.product-card h2.title` 이 선택하는 요소는?',
        options: [
          "class 가 product-card 인 div 바로 안의 h2",
          "class 가 product-card 인 div 하위(자손) 중 class 가 title 인 h2",
          "class 가 product-card 이면서 title 인 div > h2",
          "id 가 product-card 인 요소 안의 h2",
        ],
        correctIndex: 1,
        explanation:
          "공백(descendant combinator)은 하위 어디든 있는 자손을 선택합니다. div.product-card 의 자손 중 h2.title 을 모두 매칭해요. 바로 아래 자식만 선택하려면 > 기호를 사용합니다.",
      },
      {
        type: "multiple-choice",
        question:
          "웹 ==스크래핑== 시 추출한 가격 데이터 '₩1,290,000' 을 숫자로 변환하는 가장 적절한 방법은?",
        options: [
          "parseInt('₩1,290,000')",
          "Number('₩1,290,000'.replace(/[^0-9]/g, ''))",
          "JSON.parse('₩1,290,000')",
          "'₩1,290,000'.toNumber()",
        ],
        correctIndex: 1,
        explanation:
          "정규식 /[^0-9]/g 로 숫자가 아닌 모든 문자(₩, 쉼표)를 제거한 뒤 Number() 로 변환하면 1290000 이 됩니다. parseInt 는 첫 번째 비숫자에서 멈추므로 NaN 이 돼요.",
      },
    ],
  } satisfies Quiz,
};
