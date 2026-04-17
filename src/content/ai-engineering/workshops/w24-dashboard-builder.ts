import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W24 — AI 대시보드 빌더.
 *
 * Part A: 플랫폼에서 데이터 분석 + 차트 추천 + 인사이트 생성 체험 (LLM 셀)
 * Part B: MD 레시피로 드래그&드롭 AI 대시보드 빌더 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW24: Lesson = {
  id: "ai-eng-w24-dashboard-builder",
  language: "ai-engineering",
  track: "beginner",
  order: 124,
  title: "W24: AI 대시보드 빌더",
  subtitle: "데이터 올리면 AI가 최적의 차트와 대시보드 자동 구성",
  estimatedMinutes: 180,
  cells: [
    {
      type: "markdown",
      source: `# 📊 AI 대시보드 빌더 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**CSV/JSON 파일을 업로드하면 AI 가 데이터를 분석하고 최적의 ==차트==를 추천해서 ==대시보드==를 자동 구성하는 앱** — 자연어로 "매출 추이 보여줘" 하면 즉시 차트가 나타나는 나만의 ==BI== 도구입니다.

### 완성 모습
\`\`\`
┌─ AI Dashboard Builder ──────────────────────────────────────┐
│  📊 My Dashboard          🔍 자연어 질의   🌙 다크모드     │
├─────────────────────────────────────────────────────────────┤
│  📁 데이터: sales_2026.csv (1,247행 × 8열)   [+ 업로드]    │
│                                                             │
│  🤖 AI 추천: "매출 데이터에 시계열+카테고리 구조 감지.      │
│   Line·Bar·Pie 차트 3개를 추천합니다"                       │
│                                                             │
│  ┌─ 월별 매출 추이 📈 ──────┐  ┌─ 카테고리별 비중 🥧 ────┐ │
│  │    ╭──╮                  │  │        ╱◜▔▔▔◝╲          │ │
│  │ ╭──╯  ╰──╮   ╭──        │  │      ╱ 전자  40% ╲       │ │
│  │─╯        ╰───╯          │  │     │ 의류 25%    │      │ │
│  │ 1월  3월  5월  7월      │  │      ╲ 식품 20% ╱        │ │
│  │              [⋯ 드래그]  │  │        ╲기타15%╱          │ │
│  └──────────────────────────┘  └─────────────────────────┘ │
│                                                             │
│  ┌─ 지역별 매출 비교 📊 ───────────────────────────────────┐│
│  │  서울 ████████████████ 45%                              ││
│  │  부산 ██████████ 28%                                    ││
│  │  대구 ██████ 17%                                        ││
│  │  기타 ████ 10%                       [⋯ 드래그]         ││
│  └──────────────────────────────────────────────────────────┘│
│                                                             │
│  💬 "상반기 매출이 가장 높은 카테고리는?"                    │
│  🤖 → "전자 카테고리가 상반기 매출 42%로 1위입니다"         │
│                                                             │
│  [📤 공유 URL]  [🖼️ 이미지 내보내기]  [⚙️ 설정]            │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 데이터 분석 + 차트 추천 + 인사이트 생성 | 60분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 AI 대시보드 빌더 웹앱 완성 | 120분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 데이터 분석 AI 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 데이터 분석 AI 두뇌 만들기 (60분)

==CSV==나 ==JSON== 형식의 원본 데이터는 숫자와 텍스트 덩어리예요. AI 를 사용하면 데이터의 구조를 파악하고, 어떤 차트가 적합한지 추천받을 수 있습니다.

핵심 개념 3가지:
1. **데이터 분석 + 차트 추천** — 컬럼 타입·분포 분석 → 최적 ==시각화== 타입 자동 선택
2. **자연어 → 차트 설정** — "월별 매출 추이 보여줘" → Chart.js 설정 JSON 자동 생성
3. **데이터 인사이트 생성** — 데이터에서 핵심 트렌드·이상값·패턴을 AI 가 찾아 설명`,
    },

    {
      type: "markdown",
      source: `### A-1. 데이터 분석 + 차트 추천 — 어떤 차트가 적합할까?

==CSV== 데이터를 주면 AI 가 각 컬럼의 타입(날짜, 숫자, 카테고리)을 분석하고, 데이터 특성에 맞는 차트 타입을 추천합니다.
이 패턴이 대시보드 빌더의 핵심이에요 — 사용자가 차트를 고를 필요 없이 AI 가 최적의 ==시각화==를 제안합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 데이터 분석 + 차트 추천 — CSV 데이터 → 컬럼 분석 + 최적 차트 추천
const csvData = \`
month,category,sales,profit,customers
2026-01,전자,12500,3200,890
2026-02,전자,13800,3600,920
2026-03,전자,15200,4100,1050
2026-01,의류,8200,2100,650
2026-02,의류,7800,1900,610
2026-03,의류,9500,2500,730
2026-01,식품,6800,1500,480
2026-02,식품,7200,1700,510
2026-03,식품,7600,1800,540
2026-01,가구,4200,1100,280
2026-02,가구,4500,1200,310
2026-03,가구,5100,1400,360
\`;

const systemPrompt = \`너는 데이터 분석 + 시각화 전문 AI 야. CSV 데이터를 받으면 반드시 아래 JSON 형식으로만 답해.

[응답 형식]
{
  "columns": [
    { "name": "컬럼명", "type": "date|number|category", "uniqueCount": 숫자, "sample": ["값1", "값2"] }
  ],
  "rowCount": 숫자,
  "recommendations": [
    {
      "chartType": "line|bar|pie|scatter|area",
      "title": "차트 제목 (한국어)",
      "xAxis": "컬럼명",
      "yAxis": "컬럼명",
      "groupBy": "컬럼명 또는 null",
      "reason": "이 차트를 추천하는 이유 (1문장)"
    }
  ]
}

[규칙]
- columns 는 모든 컬럼 정보를 포함
- recommendations 는 최대 4개, 데이터에 가장 적합한 순서로
- 시계열 데이터가 있으면 반드시 line 차트를 포함
- 카테고리 비율 데이터가 있으면 pie 차트를 포함\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 CSV 데이터를 분석하고 차트를 추천해줘:\\n\\n\${csvData}\` },
  ],
});

try {
  const analysis = JSON.parse(res.text);
  console.log("📊 데이터 분석 결과");
  console.log("═".repeat(50));
  console.log(\`📋 행 수: \${analysis.rowCount}\`);
  console.log("\\n📐 컬럼 분석:");
  analysis.columns.forEach((col: any) =>
    console.log(\`   • \${col.name} (\${col.type}) — 고유값 \${col.uniqueCount}개\`)
  );
  console.log("\\n🎯 차트 추천:");
  analysis.recommendations.forEach((rec: any, i: number) => {
    const icon = { line: "📈", bar: "📊", pie: "🥧", scatter: "🔵", area: "📉" }[rec.chartType] || "📊";
    console.log(\`\\n   \${i + 1}. \${icon} \${rec.title} [\${rec.chartType}]\`);
    console.log(\`      X: \${rec.xAxis} → Y: \${rec.yAxis}\${rec.groupBy ? \` (그룹: \${rec.groupBy})\` : ""}\`);
    console.log(\`      💡 \${rec.reason}\`);
  });
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 컬럼 타입 분석이 차트 추천의 기초예요. date → line, category → bar/pie.",
        "groupBy 를 사용하면 한 차트에 여러 시리즈를 겹쳐 표시할 수 있어요.",
        "실무에선 데이터 크기가 크면 샘플링 후 분석하고, 전체 데이터로 렌더링합니다.",
        "recommendations 순서가 곧 대시보드 레이아웃 우선순위가 됩니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 자연어 → 차트 설정 — "매출 추이 보여줘"

사용자가 자연어로 질문하면, AI 가 그에 맞는 Chart.js 설정 ==JSON==을 생성합니다.
이게 자연어 쿼리 바의 핵심이에요 — 사용자는 차트 옵션을 몰라도 원하는 ==시각화==를 바로 얻습니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 자연어 → Chart.js 설정 JSON 변환
const dataSchema = \`
[데이터 스키마]
테이블: sales_2026
컬럼:
- month (date): 2026-01 ~ 2026-03
- category (category): 전자, 의류, 식품, 가구
- sales (number): 4200 ~ 15200
- profit (number): 1100 ~ 4100
- customers (number): 280 ~ 1050
\`;

const userQuery = "카테고리별 매출 비중을 파이 차트로 보여줘";

const systemPrompt = \`너는 데이터 시각화 설정 생성 AI 야. 데이터 스키마와 사용자 질문을 받으면 Chart.js 호환 설정을 JSON 으로 답해.

[응답 형식]
{
  "chartType": "line|bar|pie|doughnut|scatter|radar|area",
  "title": "차트 제목 (한국어)",
  "config": {
    "labels": ["라벨1", "라벨2"],
    "datasets": [
      {
        "label": "시리즈명",
        "data": [숫자1, 숫자2],
        "backgroundColor": ["색상1", "색상2"]
      }
    ]
  },
  "options": {
    "responsive": true,
    "plugins": { "legend": { "position": "top|bottom|left|right" } }
  },
  "dataQuery": "이 차트를 만들기 위해 필요한 데이터 집계 설명"
}

[규칙]
- config 은 Chart.js data 속성에 바로 사용 가능해야 함
- 색상은 보기 좋은 파스텔 톤 HEX 코드 사용
- 데이터 값은 스키마에서 합리적으로 추정한 집계값
- dataQuery 는 실제 SQL 이 아니라 한국어 설명\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`\${dataSchema}\\n\\n사용자 질문: \${userQuery}\` },
  ],
});

try {
  const chart = JSON.parse(res.text);
  const icon = { line: "📈", bar: "📊", pie: "🥧", doughnut: "🍩", scatter: "🔵", radar: "🕸️", area: "📉" }[chart.chartType] || "📊";
  console.log(\`\${icon} 생성된 차트 설정\`);
  console.log("═".repeat(50));
  console.log(\`📌 제목: \${chart.title}\`);
  console.log(\`📊 타입: \${chart.chartType}\`);
  console.log(\`\\n🏷️ 라벨: \${chart.config.labels.join(", ")}\`);
  chart.config.datasets.forEach((ds: any, i: number) => {
    console.log(\`\\n📊 시리즈 \${i + 1}: \${ds.label}\`);
    console.log(\`   데이터: [\${ds.data.join(", ")}]\`);
    if (ds.backgroundColor) {
      console.log(\`   🎨 색상: \${Array.isArray(ds.backgroundColor) ? ds.backgroundColor.join(", ") : ds.backgroundColor}\`);
    }
  });
  console.log(\`\\n💡 데이터 질의: \${chart.dataQuery}\`);
  console.log("\\n✅ 이 JSON 을 Chart.js 에 그대로 전달하면 차트가 렌더링됩니다!");
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 자연어 → JSON 변환으로 사용자가 차트 옵션을 몰라도 시각화 가능.",
        "Chart.js config 형식을 그대로 생성하면 프론트엔드에서 바로 렌더링할 수 있어요.",
        "dataQuery 는 실제 데이터 필터링/집계 로직의 설계도 역할을 합니다.",
        "실무에선 실제 데이터를 집계한 후 config.datasets.data 에 넣습니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 데이터 인사이트 생성 — AI 가 찾는 핵심 패턴

데이터에서 트렌드, ==이상값==, 상관관계를 AI 가 자동으로 발견하고 비즈니스 인사이트로 정리합니다.
대시보드 상단에 "🤖 AI 인사이트" 카드를 넣으면 사용자가 데이터를 더 깊게 이해할 수 있어요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 데이터 인사이트 생성 — 핵심 트렌드·이상값·패턴 발견
const salesData = \`
month,category,sales,profit,customers
2026-01,전자,12500,3200,890
2026-02,전자,13800,3600,920
2026-03,전자,15200,4100,1050
2026-04,전자,14100,3400,980
2026-05,전자,16800,4500,1120
2026-06,전자,18200,5100,1250
2026-01,의류,8200,2100,650
2026-02,의류,7800,1900,610
2026-03,의류,9500,2500,730
2026-04,의류,11200,3100,880
2026-05,의류,12800,3600,960
2026-06,의류,14500,4200,1080
2026-01,식품,6800,1500,480
2026-02,식품,7200,1700,510
2026-03,식품,7600,1800,540
2026-04,식품,7400,1600,520
2026-05,식품,7100,1500,490
2026-06,식품,7800,1900,550
\`;

const systemPrompt = \`너는 비즈니스 데이터 분석가 AI 야. 데이터를 받으면 핵심 인사이트를 발견해서 아래 JSON 형식으로 답해.

[응답 형식]
{
  "summary": "데이터 전체 한줄 요약",
  "insights": [
    {
      "type": "trend|anomaly|correlation|comparison",
      "title": "인사이트 제목 (한국어)",
      "description": "상세 설명 (2-3문장)",
      "severity": "high|medium|low",
      "relatedColumns": ["관련 컬럼들"],
      "suggestedAction": "권장 조치 (1문장)"
    }
  ],
  "highlights": {
    "topPerformer": "최고 성과 카테고리/항목",
    "growthRate": "전체 성장률 (%)",
    "riskArea": "주의가 필요한 영역"
  }
}

[규칙]
- insights 는 3~5개, severity 가 높은 것부터 정렬
- 숫자 기반 근거를 반드시 포함 (예: "45% 증가", "3개월 연속 하락")
- suggestedAction 은 비즈니스 관점의 실행 가능한 제안\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 매출 데이터에서 인사이트를 찾아줘:\\n\\n\${salesData}\` },
  ],
});

try {
  const result = JSON.parse(res.text);
  console.log("🧠 AI 데이터 인사이트");
  console.log("═".repeat(50));
  console.log(\`📋 요약: \${result.summary}\`);

  console.log("\\n🔍 주요 인사이트:");
  const typeIcon: Record<string, string> = { trend: "📈", anomaly: "⚠️", correlation: "🔗", comparison: "⚖️" };
  const sevColor: Record<string, string> = { high: "🔴", medium: "🟡", low: "🟢" };
  result.insights.forEach((ins: any, i: number) => {
    console.log(\`\\n   \${i + 1}. \${typeIcon[ins.type] || "📊"} \${ins.title} \${sevColor[ins.severity] || ""}\`);
    console.log(\`      \${ins.description}\`);
    console.log(\`      → 💡 \${ins.suggestedAction}\`);
  });

  console.log("\\n🏆 하이라이트:");
  console.log(\`   🥇 최고 성과: \${result.highlights.topPerformer}\`);
  console.log(\`   📈 성장률: \${result.highlights.growthRate}\`);
  console.log(\`   ⚠️ 주의 영역: \${result.highlights.riskArea}\`);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 인사이트를 severity 로 정렬하면 중요한 정보를 먼저 보여줄 수 있어요.",
        "type 필드로 아이콘/색상을 다르게 표시하면 대시보드가 직관적이 됩니다.",
        "suggestedAction 은 대시보드에 '다음 단계' 카드로 표시하면 유용해요.",
        "실무에선 인사이트를 주기적으로 갱신하고 알림으로 보내기도 합니다.",
      ],
    },

    // ─── Part B: 대시보드 빌더 레시피 ───
    {
      type: "markdown",
      source: `## Part B: AI 대시보드 빌더 웹앱 만들기 (120분)

아래 ==레시피==를 **통째로 복사**해서 Claude Code 나 Cursor 에 붙여넣으세요.
AI 코딩 도구가 전체 프로젝트를 자동 생성합니다.

---

### 📋 복사할 레시피

\`\`\`markdown
# AI 대시보드 빌더 — 프로젝트 레시피

## 기술 스택
- **프레임워크**: React 19 + TypeScript + Vite
- **스타일링**: Tailwind CSS 4
- **AI**: @google/genai (Gemini API)
- **차트**: Chart.js + react-chartjs-2 (또는 Recharts)
- **드래그&드롭**: @dnd-kit/core + @dnd-kit/sortable
- **파일 파싱**: PapaParse (CSV), 내장 JSON.parse
- **이미지 내보내기**: html2canvas
- **상태 관리**: Zustand

## 환경 변수
\\\`.env\\\` 파일에:
\\\`\\\`\\\`
VITE_GEMINI_API_KEY=your-gemini-api-key
\\\`\\\`\\\`

## 핵심 기능 (9가지)

### 1. CSV/JSON 파일 업로드 + 파싱
- 드래그&드롭 또는 클릭으로 파일 업로드
- CSV 는 PapaParse 로, JSON 은 JSON.parse 로 파싱
- 파싱 후 컬럼 이름, 타입(date/number/category), 행 수 자동 감지
- 최대 10,000행 지원, 초과 시 샘플링 안내

### 2. 데이터 미리보기 테이블
- 업로드된 데이터를 스프레드시트 스타일 테이블로 표시
- 첫 100행 미리보기 + 페이지네이션
- 컬럼 헤더에 타입 아이콘 (📅 날짜, 🔢 숫자, 🏷️ 카테고리)
- 정렬, 필터 기본 기능

### 3. AI 차트 타입 추천
- 데이터 업로드 시 자동으로 Gemini API 호출
- 컬럼 타입과 분포를 분석해서 최적의 차트 3~4개 추천
- 추천마다 이유 설명 표시
- "추천 차트 모두 추가" 원클릭 버튼

### 4. 드래그&드롭 대시보드 레이아웃
- @dnd-kit 으로 차트 카드를 자유롭게 배치
- 그리드 레이아웃 (2열, 3열 선택 가능)
- 차트 크기 조절 (small/medium/large)
- 차트 순서 변경, 삭제 지원

### 5. 자연어 쿼리 바
- 상단 검색 바에 "월별 매출 추이 보여줘" 입력
- Gemini 가 질문 → Chart.js config JSON 변환
- 생성된 차트를 대시보드에 자동 추가
- 최근 쿼리 히스토리 표시

### 6. 다양한 차트 타입
- Line (시계열 추이)
- Bar (카테고리 비교)
- Pie / Doughnut (비율)
- Scatter (상관관계)
- Area (누적 추이)
- 각 차트별 옵션 패널 (제목, 색상, 범례 위치)

### 7. AI 인사이트 카드
- 데이터 분석 후 핵심 인사이트 3~5개 자동 생성
- 트렌드/이상값/상관관계/비교 타입별 아이콘
- severity(high/medium/low) 별 색상 구분
- 인사이트 카드도 대시보드에 배치 가능

### 8. 대시보드 공유 URL
- 현재 대시보드 레이아웃을 JSON 으로 직렬화
- Base64 인코딩해서 URL 파라미터로 공유
- 공유 URL 열면 동일한 레이아웃 복원
- 클립보드 복사 버튼

### 9. 이미지 내보내기
- html2canvas 로 대시보드 영역 캡처
- PNG 파일로 다운로드
- 내보내기 전 배경색 자동 보정

## UI 레이아웃

\\\`\\\`\\\`
Header: 로고 + 자연어 쿼리 바 + 다크모드 토글
├── Sidebar: 데이터 업로드 + AI 추천 + 차트 목록
└── Main: 드래그&드롭 대시보드 그리드
    ├── Chart Card (드래그 가능)
    ├── Chart Card (크기 조절 가능)
    ├── Insight Card (AI 인사이트)
    └── + 차트 추가 버튼
Footer: 공유 URL + 이미지 내보내기 + 데이터 정보
\\\`\\\`\\\`

## 컴포넌트 구조

\\\`\\\`\\\`
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx          — 로고 + 쿼리 바 + 다크모드
│   │   ├── Sidebar.tsx         — 데이터 업로드 + 추천 패널
│   │   └── Footer.tsx          — 공유 + 내보내기
│   ├── Upload/
│   │   ├── FileDropZone.tsx    — 드래그&드롭 업로드 영역
│   │   └── DataPreview.tsx     — 데이터 미리보기 테이블
│   ├── Dashboard/
│   │   ├── DashboardGrid.tsx   — @dnd-kit 그리드 레이아웃
│   │   ├── ChartCard.tsx       — 개별 차트 카드 (드래그 가능)
│   │   ├── InsightCard.tsx     — AI 인사이트 카드
│   │   └── AddChartButton.tsx  — 차트 추가 버튼
│   ├── Charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── ScatterChart.tsx
│   │   └── AreaChart.tsx
│   └── Query/
│       ├── QueryBar.tsx        — 자연어 입력 바
│       └── QueryHistory.tsx    — 최근 쿼리 목록
├── hooks/
│   ├── useGemini.ts            — Gemini API 호출 훅
│   ├── useDataParser.ts        — CSV/JSON 파싱 훅
│   └── useDashboard.ts         — 대시보드 상태 관리 훅
├── stores/
│   └── dashboardStore.ts       — Zustand 스토어
├── utils/
│   ├── chartConfig.ts          — Chart.js 기본 설정
│   ├── shareUrl.ts             — URL 직렬화/역직렬화
│   └── exportImage.ts          — html2canvas 내보내기
├── types/
│   └── dashboard.ts            — 타입 정의
├── App.tsx
└── main.tsx
\\\`\\\`\\\`

## 핵심 타입 정의

\\\`\\\`\\\`typescript
interface DataColumn {
  name: string;
  type: 'date' | 'number' | 'category';
  uniqueCount: number;
  sample: string[];
}

interface ParsedData {
  columns: DataColumn[];
  rows: Record<string, any>[];
  rowCount: number;
  fileName: string;
}

interface ChartWidget {
  id: string;
  chartType: 'line' | 'bar' | 'pie' | 'doughnut' | 'scatter' | 'area';
  title: string;
  config: any; // Chart.js config
  size: 'small' | 'medium' | 'large';
  position: number;
}

interface InsightWidget {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'comparison';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  position: number;
}

type DashboardWidget = ChartWidget | InsightWidget;
\\\`\\\`\\\`

## 스타일 가이드
- 다크모드: bg-gray-900, 차트 카드 bg-gray-800, 텍스트 gray-100
- 라이트모드: bg-gray-50, 차트 카드 bg-white, 텍스트 gray-900
- 차트 카드: rounded-xl shadow-lg, 호버 시 ring-2 ring-blue-400
- 드래그 중: opacity-50, ring-2 ring-dashed
- 쿼리 바: 상단 고정, backdrop-blur-sm
- 반응형: 모바일 1열, 태블릿 2열, 데스크탑 3열
\\\`\\\`\\\`

---

💡 **Part A 에서 배운 핵심이 레시피에 녹아있어요:**
- A-1 데이터 분석 → 기능 3 (AI 차트 추천)
- A-2 자연어 → JSON → 기능 5 (자연어 쿼리 바)
- A-3 인사이트 → 기능 7 (AI 인사이트 카드)`,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

### 도전 1: 실시간 데이터 연결
Google Sheets API 나 Airtable API 연동으로 실시간 데이터 갱신. 웹소켓으로 차트 자동 업데이트.

### 도전 2: 대시보드 템플릿
"매출 분석", "마케팅 KPI", "인사 현황" 등 사전 정의된 대시보드 템플릿 제공. 데이터만 올리면 자동 매핑.

### 도전 3: 협업 기능
여러 사용자가 동일 대시보드를 동시에 편집하는 실시간 협업. Yjs 같은 CRDT 라이브러리 활용.

### 도전 4: 자연어 데이터 변환
"매출을 만원 단위로 바꿔줘", "월별로 합산해줘" 같은 데이터 ==전처리== 명령을 자연어로 처리.`,
    },

    // ─── 마무리 ───
    {
      type: "markdown",
      source: `## 🎉 마무리

축하합니다! 이제 여러분은 **AI 대시보드 빌더**를 만들 수 있어요.

### 이 워크샵에서 배운 것

| 개념 | 설명 | 활용 |
|---|---|---|
| 데이터 분석 + 차트 추천 | AI 가 컬럼 타입·분포를 분석해 최적 차트 제안 | ==BI== 도구의 핵심 |
| 자연어 → 차트 설정 | 질문을 Chart.js config JSON 으로 변환 | 비개발자도 시각화 가능 |
| 인사이트 자동 생성 | 트렌드·이상값·패턴을 AI 가 발견 | 데이터 기반 의사결정 |
| 드래그&드롭 레이아웃 | @dnd-kit 으로 자유 배치 | 맞춤형 대시보드 |

### 다음 단계
- 🔗 실시간 데이터 소스 연결 (API, 웹소켓)
- 🤖 GPT-4o/Claude 모델로 더 정교한 분석
- 📱 모바일 최적화 대시보드
- 🔒 팀 공유 + 접근 권한 관리`,
    },
  ],

  quiz: {
    title: "W24: AI 대시보드 빌더 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "CSV 데이터를 업로드할 때, AI 가 차트를 추천하려면 가장 먼저 해야 할 분석은 무엇인가요?",
        options: [
          "각 셀의 글꼴 크기 확인",
          "각 컬럼의 데이터 타입(날짜/숫자/카테고리) 분석",
          "파일 확장자 확인",
          "행 번호 부여",
        ],
        correctIndex: 1,
        explanation:
          "차트 추천의 기초는 컬럼 타입 분석이에요. 날짜 → 시계열 차트(line), 카테고리 → 비교 차트(bar/pie), 숫자 쌍 → 산점도(scatter) 등 데이터 특성에 따라 적합한 시각화가 달라집니다.",
      },
      {
        type: "multiple-choice",
        question:
          "자연어 쿼리 바에서 '월별 매출 추이 보여줘'를 처리할 때, AI 가 생성하는 최종 출력 형식은?",
        options: [
          "SQL 쿼리문",
          "차트 이미지 파일 (PNG)",
          "Chart.js 호환 설정 JSON",
          "마크다운 테이블",
        ],
        correctIndex: 2,
        explanation:
          "AI 가 자연어를 Chart.js config JSON 으로 변환하면, 프론트엔드에서 이 JSON 을 그대로 Chart.js 에 전달해 즉시 렌더링할 수 있어요. 이 '자연어 → 구조화된 설정' 패턴이 AI 대시보드의 핵심입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "AI 인사이트 카드에서 severity(중요도)를 high/medium/low 로 구분하는 이유는?",
        options: [
          "서버 비용을 절약하기 위해",
          "사용자가 중요한 정보를 먼저 볼 수 있도록 우선순위를 매기기 위해",
          "차트 색상을 자동으로 결정하기 위해",
          "데이터 파싱 순서를 정하기 위해",
        ],
        correctIndex: 1,
        explanation:
          "인사이트에 중요도를 부여하면 사용자가 가장 긴급한 트렌드나 이상값부터 확인할 수 있어요. 대시보드에서는 high → red, medium → yellow, low → green 같은 시각적 구분으로 직관성을 높입니다.",
      },
    ],
  } satisfies Quiz,
};
