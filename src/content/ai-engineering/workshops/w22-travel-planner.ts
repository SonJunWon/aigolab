import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W22 — AI 여행 플래너.
 *
 * Part A: 플랫폼에서 일정 생성 + 예산 최적화 + 현지 팁 체험 (LLM 셀)
 * Part B: MD 레시피로 Leaflet 지도 + Unsplash 사진 + PDF 다운로드 여행 플래너 웹앱 완성
 */
export const workshopW22: Lesson = {
  id: "ai-eng-w22-travel-planner",
  language: "ai-engineering",
  track: "beginner",
  order: 122,
  title: "W22: AI 여행 플래너",
  subtitle: "목적지와 예산만 입력하면 AI가 완벽한 여행 일정 생성",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 🗺️ AI 여행 플래너 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**목적지·일수·예산만 입력하면 AI 가 시간대별 일정을 생성하고, ==Leaflet== 지도에 마커를 찍고, ==Unsplash== 사진을 붙여서 ==PDF== 로 다운로드할 수 있는 여행 플래너** — 친구에게 공유 링크까지 보낼 수 있는 나만의 AI 여행사입니다.

### 완성 모습
\`\`\`
┌─ AI 여행 플래너 ──────────────────────────────────────────────┐
│  🗺️ AI Trip Planner       [🌙 다크모드]  [📥 PDF 다운로드]   │
├───────────────────────────────────────────────────────────────┤
│  📍 목적지: [도쿄        ]  📅 일수: [4]  💰 예산: [150만원]  │
│  🎯 여행 스타일: [맛집 ✓] [관광 ✓] [쇼핑] [자연] [문화 ✓]    │
│  [✨ AI 일정 생성하기]                                        │
│                                                               │
│  ┌─ Day 1: 도쿄 도착 & 시부야 탐험 ────────────────────────┐ │
│  │ 🕐 10:00  나리타공항 → 시부야 (스카이라이너 ¥2,520)     │ │
│  │ 🕐 12:30  이치란 라멘 시부야점 🍜 (¥1,200)              │ │
│  │ 🕐 14:00  시부야 스크램블 교차로 & 하치코 동상 📸       │ │
│  │ 🕐 16:00  메이지 신궁 산책 🌿 (무료)                    │ │
│  │ 🕐 18:30  시부야 센터가이 저녁 쇼핑 🛍️ (~¥5,000)       │ │
│  │ 📊 Day 1 예산: ¥15,720 (약 14만원)                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ 🗺️ 지도 ───────────────────────┐ ┌─ 📷 장소 사진 ─────┐ │
│  │  [Leaflet 지도]                  │ │ 🖼️ 시부야 교차로    │ │
│  │    📍 시부야역                   │ │ 🖼️ 메이지 신궁      │ │
│  │    📍 메이지 신궁                │ │ 🖼️ 이치란 라멘      │ │
│  │    📍 이치란 라멘                │ │    (Unsplash)       │ │
│  │  ─── 이동 경로 점선 ───          │ └─────────────────────┘ │
│  └──────────────────────────────────┘                         │
│                                                               │
│  [💾 저장하기]  [🔗 공유 링크]  [📥 PDF]   여행 목록: 3개     │
└───────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 일정 생성 + 예산 최적화 + 현지 팁 AI 체험 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 여행 플래너 풀스택 웹앱 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 여행 일정 AI 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 여행 일정 AI 두뇌 만들기 (50분)

여행 일정을 짜는 건 시간이 오래 걸려요. AI 를 활용하면 **목적지·일수·예산** 세 가지만으로 ==시간대별== 일정을 자동 생성할 수 있습니다.

핵심 개념 3가지:
1. **일정 생성** — 목적지/일수/예산/스타일 → 시간대별 ==구조화된 JSON== 일정
2. **예산 최적화** — 전체 일정의 비용을 분석하고 절약 포인트 제안
3. **현지 팁** — 관광객이 놓치기 쉬운 숨은 명소와 현지인 꿀팁

---

### 🛠️ 1단계: AI 여행 일정 생성기

목적지, 일수, 예산, 여행 스타일을 입력하면 **시간대별 상세 일정** 을 ==JSON== 으로 생성합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 🗺️ AI 여행 일정 생성기
// 목적지·일수·예산 → 시간대별 상세 일정 (JSON)
const response = await chat({
  model: "gemini-2.0-flash",
  system: \`당신은 전문 여행 플래너입니다.
사용자가 목적지, 일수, 예산, 여행 스타일을 주면
시간대별 상세 일정을 JSON 으로 생성합니다.

반드시 아래 JSON 형식을 지키세요:
{
  "destination": "도시명",
  "days": 숫자,
  "budget": { "total": "문자열", "currency": "KRW" },
  "itinerary": [
    {
      "day": 1,
      "theme": "Day 1 테마",
      "slots": [
        {
          "time": "10:00",
          "place": "장소명",
          "activity": "활동 설명",
          "cost": "예상 비용",
          "lat": 위도,
          "lng": 경도,
          "tip": "한줄 팁"
        }
      ],
      "dailyBudget": "이 날 예상 총비용"
    }
  ]
}\`,
  prompt: \`여행 계획을 세워주세요:
- 목적지: 교토 (일본)
- 일수: 3일
- 예산: 100만원
- 스타일: 문화체험, 맛집 위주

JSON 형식으로만 응답해주세요.\`
});

// JSON 파싱 & 출력
const text = typeof response === "string" ? response : response.text;
const cleaned = text.replace(/\`\`\`json?\\n?/g, "").replace(/\`\`\`/g, "").trim();
const plan = JSON.parse(cleaned);

console.log("📍 목적지:", plan.destination);
console.log("📅 일수:", plan.days + "일");
console.log("💰 총 예산:", plan.budget?.total);
console.log("\\n─── 일정 미리보기 ───");
for (const day of plan.itinerary) {
  console.log(\`\\n🗓️ Day \${day.day}: \${day.theme}\`);
  for (const slot of day.slots) {
    console.log(\`  🕐 \${slot.time}  \${slot.place} — \${slot.activity} (\${slot.cost})\`);
  }
  console.log(\`  📊 일일 예산: \${day.dailyBudget}\`);
}`,
      hints: [
        "system 프롬프트에 JSON 스키마를 명시하면 AI 가 구조화된 응답을 줘요",
        "lat/lng 좌표를 포함하면 나중에 지도에 마커를 바로 찍을 수 있어요",
        "여행 스타일(맛집, 관광, 쇼핑 등)에 따라 일정이 크게 달라집니다",
      ],
    },

    {
      type: "markdown",
      source: `### 분석: 일정 생성 프롬프트 패턴 🔍

핵심 기법:
- **==구조화된 출력== (Structured Output)** — JSON 스키마를 system 에 명시하면 파싱 가능한 응답을 받을 수 있어요
- **좌표 포함** — 각 장소의 lat/lng 를 요청하면 지도 연동이 바로 됩니다
- **비용 분리** — 슬롯마다 비용을 넣으면 일별/전체 예산 관리가 가능해요

> 💡 \`response.text\` 에서 JSON 을 추출할 때 코드펜스(\\\`\\\`\\\`)를 제거하는 전처리가 필요합니다.

---

### 🛠️ 2단계: AI 예산 최적화 어드바이저

생성된 일정의 전체 비용을 분석하고, **절약 팁과 대안 장소** 를 제안합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 💰 AI 예산 최적화 어드바이저
// 일정의 비용을 분석하고 절약 포인트 제안
const itinerarySummary = \`
교토 3일 여행 일정:
Day 1: 후시미이나리 신사(무료) → 니시키 시장 점심(¥2,000) → 기요미즈데라(¥400) → 기온 거리 산책 → 가이세키 저녁(¥8,000)
Day 2: 아라시야마 대나무숲(무료) → 두부 요리 점심(¥1,800) → 금각사(¥500) → 철학의 길 → 이자카야 저녁(¥4,000)
Day 3: 닌자사(¥600) → 라멘 점심(¥1,200) → 교토역 쇼핑 → 말차 카페(¥800) → 귀국
교통: 교토 버스 1일권 ¥700 × 3일 = ¥2,100
숙소: 게스트하우스 ¥5,000/박 × 2박 = ¥10,000
총 예상: 약 ¥31,400 (약 28만원)\`;

const response = await chat({
  model: "gemini-2.0-flash",
  system: \`당신은 여행 예산 전문 어드바이저입니다.
여행 일정을 분석하고 예산 최적화 방안을 제안합니다.

반드시 아래 JSON 형식으로 응답하세요:
{
  "totalEstimate": "총 예상 비용",
  "breakdown": { "food": "식비", "transport": "교통비", "attraction": "입장료", "accommodation": "숙소", "shopping": "쇼핑/기타" },
  "savingTips": [
    { "category": "카테고리", "tip": "절약 팁", "savings": "절약 금액" }
  ],
  "alternatives": [
    { "original": "원래 항목", "alternative": "대안", "reason": "추천 이유" }
  ],
  "budgetScore": "A~F 등급 (A=매우 효율적)"
}\`,
  prompt: \`아래 여행 일정의 예산을 분석하고 최적화 방안을 제안해주세요.
예산 한도: 100만원 (항공편 별도)

\${itinerarySummary}

JSON 형식으로만 응답해주세요.\`
});

const text = typeof response === "string" ? response : response.text;
const cleaned = text.replace(/\`\`\`json?\\n?/g, "").replace(/\`\`\`/g, "").trim();
const budget = JSON.parse(cleaned);

console.log("💰 예산 분석 결과");
console.log("━".repeat(40));
console.log("📊 총 예상:", budget.totalEstimate);
console.log("🏷️ 등급:", budget.budgetScore);
console.log("\\n📋 항목별 내역:");
for (const [key, val] of Object.entries(budget.breakdown || {})) {
  const labels: Record<string, string> = { food: "🍜 식비", transport: "🚌 교통", attraction: "🎫 입장료", accommodation: "🏨 숙소", shopping: "🛍️ 쇼핑" };
  console.log(\`  \${labels[key] || key}: \${val}\`);
}
console.log("\\n💡 절약 팁:");
for (const tip of budget.savingTips || []) {
  console.log(\`  ✂️ [\${tip.category}] \${tip.tip} → 약 \${tip.savings} 절약\`);
}
console.log("\\n🔄 대안 제안:");
for (const alt of budget.alternatives || []) {
  console.log(\`  \${alt.original} → \${alt.alternative} (\${alt.reason})\`);
}`,
      hints: [
        "일정 텍스트를 통째로 prompt 에 넣으면 AI 가 비용을 파악할 수 있어요",
        "breakdown 으로 카테고리별 비용 비율을 파악하면 어디서 줄일지 보여요",
        "savingTips 와 alternatives 를 분리하면 UI 에서 탭으로 나눌 수 있어요",
      ],
    },

    {
      type: "markdown",
      source: `### 분석: 예산 최적화 패턴 🔍

핵심 기법:
- **컨텍스트 주입** — 이전 단계에서 만든 일정을 그대로 prompt 에 넣어 분석
- **다중 출력 구조** — breakdown(내역) + savingTips(절약) + alternatives(대안) 을 한 번에 요청
- **등급 시스템** — budgetScore 로 직관적 평가를 제공

> 💡 실제 앱에서는 1단계 일정 생성 결과를 바로 2단계 입력으로 ==파이프라인== 연결합니다.

---

### 🛠️ 3단계: AI 현지인 꿀팁 가이드

관광객이 놓치기 쉬운 **숨은 명소, 현지 맛집, 교통 팁, 문화 에티켓** 을 알려줍니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 🏮 AI 현지인 꿀팁 가이드
// 관광객이 놓치기 쉬운 숨은 정보 제공
const response = await chat({
  model: "gemini-2.0-flash",
  system: \`당신은 해당 도시에 10년 이상 거주한 현지인 가이드입니다.
관광객이 놓치기 쉬운 숨은 명소와 실용적인 팁을 알려줍니다.

반드시 아래 JSON 형식으로 응답하세요:
{
  "city": "도시명",
  "hiddenGems": [
    { "name": "장소명", "why": "추천 이유", "bestTime": "최적 방문 시간", "lat": 위도, "lng": 경도 }
  ],
  "localFood": [
    { "dish": "음식명", "restaurant": "맛집", "price": "가격대", "tip": "주문 팁" }
  ],
  "transportHacks": [
    { "hack": "교통 팁", "savings": "절약 효과" }
  ],
  "etiquette": [
    { "rule": "에티켓", "reason": "이유" }
  ],
  "seasonalAdvice": "방문 시기별 조언"
}\`,
  prompt: \`교토 3일 여행에 대한 현지인 꿀팁을 알려주세요.
- 여행 시기: 4월 (벚꽃 시즌)
- 스타일: 문화체험, 맛집
- 특별히 궁금한 것: 관광객이 잘 모르는 벚꽃 명소, 교토 로컬 맛집

JSON 형식으로만 응답해주세요.\`
});

const text = typeof response === "string" ? response : response.text;
const cleaned = text.replace(/\`\`\`json?\\n?/g, "").replace(/\`\`\`/g, "").trim();
const tips = JSON.parse(cleaned);

console.log(\`🏮 \${tips.city} 현지인 가이드\`);
console.log("━".repeat(40));

console.log("\\n🔮 숨은 명소:");
for (const gem of tips.hiddenGems || []) {
  console.log(\`  📍 \${gem.name} — \${gem.why}\`);
  console.log(\`     ⏰ 최적 시간: \${gem.bestTime}\`);
}

console.log("\\n🍱 로컬 맛집:");
for (const food of tips.localFood || []) {
  console.log(\`  🍽️ \${food.dish} @ \${food.restaurant} (\${food.price})\`);
  console.log(\`     💬 팁: \${food.tip}\`);
}

console.log("\\n🚃 교통 꿀팁:");
for (const t of tips.transportHacks || []) {
  console.log(\`  🎫 \${t.hack} → \${t.savings}\`);
}

console.log("\\n🙏 에티켓:");
for (const e of tips.etiquette || []) {
  console.log(\`  ⚠️ \${e.rule} — \${e.reason}\`);
}

console.log(\`\\n🌸 시즌 조언: \${tips.seasonalAdvice}\`);`,
      hints: [
        "현지인 페르소나를 system 에 부여하면 더 깊이 있는 팁이 나와요",
        "hiddenGems 에도 좌표를 포함하면 지도에 '숨은 명소' 레이어를 추가할 수 있어요",
        "계절(시기)을 prompt 에 넣으면 시즌별 맞춤 조언을 받을 수 있습니다",
      ],
    },

    // ─── Part A 완료 → Part B 전환 ───
    {
      type: "markdown",
      source: `## ✅ Part A 완료!

여행 플래너의 세 가지 AI 엔진을 검증했어요:
- ✅ **일정 생성** — 목적지/일수/예산/스타일 → 시간대별 JSON 일정 (좌표 포함)
- ✅ **예산 최적화** — 비용 분석 + 절약 팁 + 대안 장소 제안
- ✅ **현지 팁** — 숨은 명소 + 로컬 맛집 + 교통 꿀팁 + 에티켓

이제 이걸 **==Leaflet== 지도 + ==Unsplash== 사진 + ==PDF== 다운로드** 가 붙은 풀스택 앱으로 만듭니다.

---

## Part B: MD 레시피로 풀스택 웹앱 완성 (100분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [AI 여행 플래너 웹앱]
\`\`\`

지도에 마커를 표시하려면 ==Leaflet== 라이브러리를 사용합니다. 무료이고 가벼우며 OSM(OpenStreetMap) 타일을 기본 제공해 별도 API 키가 필요 없어요.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 여행 플래너 제작 요청서

## 프로젝트 개요
목적지·일수·예산을 입력하면 AI 가 시간대별 여행 일정을 생성하고,
Leaflet 지도에 장소 마커를 표시하고, Unsplash 사진을 보여주며,
완성된 일정을 PDF 로 다운로드할 수 있는 여행 플래너를 만들어주세요.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini SDK)
- Leaflet + react-leaflet (지도)
- Unsplash API (장소 사진, Access Key 필요)
- html2pdf.js (PDF 다운로드)
- localStorage (여행 저장)
- Lucide React (아이콘)

## 환경 변수
\\\`\\\`\\\`
VITE_GEMINI_API_KEY=your_gemini_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
\\\`\\\`\\\`

## 기능 요구사항

### 1. 여행 입력 폼
- 목적지 텍스트 입력 (자동완성 추천: 인기 도시 목록)
- 여행 일수 선택 (1~14일, 숫자 입력 또는 +/- 버튼)
- 예산 입력 (원화, 만원 단위)
- 여행 스타일 토글 칩: 맛집, 관광, 쇼핑, 자연, 문화, 액티비티, 휴양
- "✨ AI 일정 생성하기" 버튼 (로딩 중 스켈레톤 UI)

### 2. AI 일정 생성 (Gemini)
- system 프롬프트에 JSON 스키마 명시
- 응답 구조:
  \\\`\\\`\\\`json
  {
    "destination": "도시명",
    "days": 3,
    "budget": { "total": "100만원", "currency": "KRW" },
    "itinerary": [
      {
        "day": 1,
        "theme": "Day 1 테마",
        "slots": [
          {
            "time": "10:00",
            "place": "장소명",
            "activity": "활동 설명",
            "cost": "예상 비용",
            "lat": 35.0116,
            "lng": 135.7681,
            "tip": "한줄 팁",
            "photoKeyword": "Unsplash 검색 키워드"
          }
        ],
        "dailyBudget": "일별 예산 합계"
      }
    ]
  }
  \\\`\\\`\\\`
- 생성 중 "AI가 최적의 일정을 만들고 있어요..." 애니메이션
- 에러 시 재시도 버튼

### 3. 일정 타임라인 뷰
- Day 탭 (Day 1 / Day 2 / ... / 전체)
- 각 슬롯: 시간, 장소, 활동, 비용, 팁을 카드형으로 표시
- 슬롯 카드 클릭 시 지도 해당 마커로 이동 + 팝업
- 드래그 앤 드롭으로 슬롯 순서 변경 가능
- 슬롯 삭제/수정 기능
- 일별 예산 합계 프로그레스 바

### 4. Leaflet 지도
- react-leaflet 사용, OSM 타일 (API 키 불필요)
- 일정의 모든 장소를 마커로 표시
- 마커 클릭 시 팝업: 장소명, 시간, 활동, 비용
- Day 별 색상 구분 (Day 1: 파랑, Day 2: 초록, Day 3: 빨강 ...)
- 마커 간 점선 경로 표시 (이동 순서)
- 지도 범위 자동 맞춤 (fitBounds)
- Day 탭 전환 시 해당 날짜 마커만 표시

### 5. Unsplash 사진
- 각 장소의 photoKeyword 로 Unsplash API 검색
- 슬롯 카드에 대표 사진 1장 표시
- 사진 클릭 시 라이트박스로 크게 보기
- Unsplash 크레딧 표시 (photographer 링크)
- API 호출 최소화: 결과 localStorage 캐싱
- API 키 없으면 placeholder 이미지 대체

### 6. PDF 다운로드
- html2pdf.js 사용
- "📥 PDF 다운로드" 버튼 클릭 시 현재 일정을 PDF 로 생성
- PDF 내용: 제목, 일정표, 지도 스크린샷, 예산 요약, 현지 팁
- A4 세로 레이아웃, 깔끔한 타이포그래피
- 다운로드 파일명: "AI여행플래너_도쿄_3일.pdf"

### 7. 여행 저장 & 관리
- localStorage 에 여행 일정 저장
- 저장된 여행 목록 사이드패널
- 여행 제목 편집 가능
- 여행 삭제 (확인 다이얼로그)
- 여행 복제 기능

### 8. 공유 기능
- "🔗 공유 링크" 버튼: 일정 데이터를 base64 인코딩 후 URL 해시로 생성
- 링크 복사 버튼 (클립보드)
- 공유 링크 접속 시 자동으로 일정 로드

### 9. 예산 대시보드
- 일별 예산 파이 차트 (CSS 만으로 구현)
- 카테고리별 지출 비율 (식비/교통/입장료/쇼핑/숙소)
- 예산 초과 경고 (빨간 배지)
- 전체 대비 사용 비율 프로그레스 바

### 10. UI/UX
- 다크/라이트 모드 토글 (시스템 설정 감지)
- 완전 반응형 (모바일: 지도 아래로, 데스크톱: 사이드바 지도)
- 로딩 중 스켈레톤 UI
- 빈 상태 일러스트 ("여행을 계획해보세요!")
- 토스트 알림 (저장 완료, 복사 완료 등)

## 컴포넌트 구조
\\\`\\\`\\\`
src/
├── components/
│   ├── TripForm.tsx          (입력 폼)
│   ├── Timeline.tsx          (일정 타임라인)
│   ├── TimelineSlot.tsx      (개별 슬롯 카드)
│   ├── TripMap.tsx           (Leaflet 지도)
│   ├── PhotoGallery.tsx      (Unsplash 사진)
│   ├── BudgetDashboard.tsx   (예산 대시보드)
│   ├── SavedTrips.tsx        (저장된 여행 목록)
│   ├── PdfExport.tsx         (PDF 다운로드)
│   └── ShareLink.tsx         (공유 링크)
├── hooks/
│   ├── useGemini.ts          (AI 일정 생성)
│   ├── useUnsplash.ts        (사진 검색)
│   └── useTrips.ts           (여행 CRUD)
├── types/
│   └── trip.ts               (타입 정의)
└── App.tsx
\\\`\\\`\\\`

## 핵심 타입
\\\`\\\`\\\`typescript
interface Trip {
  id: string;
  title: string;
  destination: string;
  days: number;
  budget: { total: string; currency: string };
  styles: string[];
  itinerary: DayPlan[];
  createdAt: string;
}

interface DayPlan {
  day: number;
  theme: string;
  slots: TimeSlot[];
  dailyBudget: string;
}

interface TimeSlot {
  time: string;
  place: string;
  activity: string;
  cost: string;
  lat: number;
  lng: number;
  tip: string;
  photoKeyword: string;
  photoUrl?: string;
}
\\\`\\\`\\\`

## Gemini 프롬프트 예시
\\\`\\\`\\\`
당신은 전문 여행 플래너입니다.
목적지, 일수, 예산, 여행 스타일을 받아 시간대별 상세 일정을 생성합니다.
각 장소에 위도/경도 좌표와 Unsplash 검색용 키워드를 포함합니다.
반드시 JSON 형식으로만 응답하세요.
\\\`\\\`\\\`

## Leaflet 설정
- CDN 타일: https://\{s\}.tile.openstreetmap.org/\{z\}/\{x\}/\{y\}.png
- 기본 줌: 13
- 마커 아이콘: Lucide 아이콘으로 커스텀 (또는 기본 Leaflet 마커)
- 경로 표시: Polyline (점선, 색상 Day 별)

## Unsplash API
- 엔드포인트: https://api.unsplash.com/search/photos?query=\{keyword\}&per_page=1
- 헤더: Authorization: Client-ID \{VITE_UNSPLASH_ACCESS_KEY\}
- 응답에서 results[0].urls.regular 사용
- 크레딧: results[0].user.name + results[0].user.links.html

## 실행 방법
\\\`\\\`\\\`bash
npm create vite@latest ai-travel-planner -- --template react-ts
cd ai-travel-planner
npm install @google/genai leaflet react-leaflet html2pdf.js lucide-react
npm install -D @types/leaflet
# .env 에 API 키 설정
npm run dev
\\\`\\\`\\\`
\`\`\``,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

Part B 를 완성한 후 아래 기능을 추가해보세요!

### 🟢 기본
1. **AI 예산 최적화 탭** — Part A 의 2단계를 웹앱에 통합. 일정 생성 후 "💡 예산 최적화" 버튼으로 절약 팁 표시
2. **AI 현지 팁 패널** — Part A 의 3단계를 통합. 숨은 명소를 지도에 다른 색 마커로 표시
3. **날씨 연동** — OpenWeatherMap API 로 여행 날짜의 예상 날씨 표시 (우산 필요 여부)

### 🟡 심화
4. **다중 도시 여행** — "도쿄 → 교토 → 오사카" 같은 ==멀티 스톱== 일정 지원. 도시 간 이동 수단/시간도 AI 가 추천
5. **항공편 검색 연동** — Skyscanner Affiliate API 로 최저가 항공편 표시
6. **실시간 환율** — 예산을 현지 통화로 자동 환산 (ExchangeRate API)

### 🔴 고급
7. **AI 일정 대화형 수정** — "2일차 오후에 쇼핑 대신 온천 넣어줘" 같은 자연어로 일정 수정
8. **여행 동행자 모드** — 여러 사람의 스타일을 조합해 모두가 만족하는 일정 생성
9. **여행 후 기록** — 실제 방문 사진 업로드 + AI 여행기 자동 생성 + 블로그 포맷 내보내기`,
    },
  ],

  quiz: {
    title: "W22 — 여행 플래너 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "AI 에게 여행 일정을 JSON 형식으로 받기 위해 가장 효과적인 방법은?",
        options: [
          "prompt 에 '구조화된 형식으로 응답해줘' 라고만 쓴다",
          "system 프롬프트에 정확한 JSON 스키마를 명시한다",
          "temperature 를 0 으로 설정하면 항상 JSON 이 나온다",
          "모델을 가장 큰 것으로 선택하면 자동으로 JSON 을 준다",
        ],
        correctIndex: 1,
        explanation:
          "system 프롬프트에 JSON 스키마를 명시하면 AI 가 해당 구조에 맞춰 응답합니다. Structured Output 패턴의 핵심 기법입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "Leaflet 지도를 사용할 때 OpenStreetMap 타일의 장점으로 올바른 것은?",
        options: [
          "Google Maps 보다 해상도가 높다",
          "별도의 API 키 없이 무료로 사용할 수 있다",
          "실시간 교통 정보를 기본 제공한다",
          "위성 사진을 기본으로 보여준다",
        ],
        correctIndex: 1,
        explanation:
          "OpenStreetMap(OSM) 타일은 무료이고 API 키가 필요 없어서, Leaflet 과 함께 사용하면 빠르게 지도 기능을 구현할 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question:
          "여행 일정 공유 기능에서 base64 인코딩 + URL 해시 방식의 장점은?",
        options: [
          "데이터가 암호화되어 보안이 완벽하다",
          "서버 없이 클라이언트만으로 공유가 가능하다",
          "URL 길이 제한이 없어 무한한 데이터를 담을 수 있다",
          "SEO 에 유리하여 검색엔진에 노출된다",
        ],
        correctIndex: 1,
        explanation:
          "base64 + URL 해시 방식은 백엔드 서버 없이 클라이언트만으로 데이터를 공유할 수 있습니다. 단, URL 길이 제한(약 2,000자)이 있어 대용량 데이터에는 부적합합니다.",
      },
    ],
  } satisfies Quiz,
};
