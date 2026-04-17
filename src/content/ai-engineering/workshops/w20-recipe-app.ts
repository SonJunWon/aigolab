import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W20 — AI 레시피 추천 앱.
 *
 * Part A: 재료 → 레시피 생성 + 영양 정보 + 대체 재료 (LLM 셀)
 * Part B: React+TS+Vite+Tailwind+@google/genai 풀스택 레시피 앱
 */
export const workshopW20: Lesson = {
  id: "ai-eng-w20-recipe-app",
  language: "ai-engineering",
  track: "beginner",
  order: 120,
  title: "W20: AI 레시피 추천 앱",
  subtitle: "냉장고 재료 입력하면 AI가 레시피 추천",
  estimatedMinutes: 120,
  cells: [
    {
      type: "markdown",
      source: `# 🍳 AI 레시피 추천 앱 — 냉장고 파먹기의 끝판왕

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 할 것

**냉장고에 있는 재료를 입력하면 AI 가 레시피를 추천하고, 영양 정보까지 알려주는 앱**을 만듭니다.
텍스트로 재료를 입력하거나, 사진을 찍으면 ==Gemini Vision== 이 재료를 자동 인식합니다!

### 완성 앱 미리보기
\`\`\`
┌─────────────────────────────────────────────────────────┐
│  🍳 AI 레시피 추천                        🌙 ☀️         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📷 사진으로 재료 인식    또는    ✏️ 직접 입력           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🥚 달걀 ✕  🧅 양파 ✕  🧄 마늘 ✕  🥕 당근 ✕   │   │
│  │  [재료 입력... ▾ 자동완성]               [추가]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  식이 필터: [채식] [비건] [글루텐프리] [저탄수화물]      │
│                                                         │
│          [ 🤖 레시피 추천받기 ]                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🍛 달걀 볶음밥           난이도: ⭐ 쉬움        │   │
│  │  조리시간: 15분                                  │   │
│  │                                                   │   │
│  │  📋 재료: 달걀 2개, 양파 1/2, 마늘 2쪽, 당근 1/3 │   │
│  │                                                   │   │
│  │  📝 조리 순서              ⏱️ 타이머              │   │
│  │  ☑ 1. 양파·당근 잘게 썰기     [3:00 시작]        │   │
│  │  ☐ 2. 기름 두르고 마늘 볶기   [2:00 시작]        │   │
│  │  ☐ 3. 채소 넣고 중불 볶기     [3:00 시작]        │   │
│  │  ☐ 4. 밥+달걀 넣고 볶기       [5:00 시작]        │   │
│  │  ☐ 5. 간장·소금으로 간 맞추기 [1:00 시작]        │   │
│  │                                                   │   │
│  │  💡 팁: 찬밥을 쓰면 더 맛있어요!                  │   │
│  │                                                   │   │
│  │  📊 영양 정보 (1인분 기준)                        │   │
│  │  ┌──────┬──────┬──────┬──────┐                    │   │
│  │  │ 칼로리 │ 단백질 │ 탄수화물│ 지방  │                    │   │
│  │  │ 420   │ 15g  │  52g │ 16g │                    │   │
│  │  └──────┴──────┴──────┴──────┘                    │   │
│  │                                                   │   │
│  │  [❤️ 저장] [📤 공유] [🔄 다른 레시피]              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 재료→레시피 AI 로직 체험 (3개 LLM 셀) | 40분 | 이 페이지 |
| **Part B** | 풀스택 레시피 앱 구현 가이드 | 80분 | 내 컴퓨터 (VS Code + 터미널) |

> ⚠️ **전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 + Gemini API 키 발급`,
    },

    // ─── Part A: 재료 → 레시피 AI 로직 ───
    {
      type: "markdown",
      source: `## Part A: 재료 → 레시피 AI 로직 (40분)

냉장고 재료를 AI 에게 주면 어떤 요리를 만들 수 있는지 알아봅시다.
3개의 ==LLM== 셀로 핵심 로직을 체험합니다.

---

### A-1: 재료 → 레시피 생성 🍳

**재료 목록을 주면 AI 가 레시피를 만들어줍니다.**

==프롬프트 엔지니어링== 핵심:
- **JSON 형식** 으로 응답 요청 → 앱에서 바로 파싱 가능
- **난이도·시간·팁** 까지 포함 → 실용적인 레시피 카드 완성
- **한국어** 지정 → 한국 음식 포함 + 한국식 계량 (숟가락, 종이컵)`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// === 재료 → 레시피 생성 ===
// ingredients 배열을 수정해서 냉장고 속 재료를 넣어보세요!

const ingredients = ["달걀", "양파", "마늘", "당근", "밥", "간장"];

const systemPrompt = \`너는 한국 가정요리 전문 셰프 AI 야.
사용자가 재료 목록을 주면 만들 수 있는 요리 레시피를 추천해.

반드시 아래 JSON 형식으로만 응답해:
{
  "recipeName": "요리 이름",
  "difficulty": "쉬움 | 보통 | 어려움",
  "cookingTime": "총 조리시간 (분 단위)",
  "servings": "몇 인분",
  "ingredients": [
    { "name": "재료명", "amount": "양 (한국식 계량)" }
  ],
  "steps": [
    { "order": 1, "description": "조리 설명", "timerMinutes": 3 }
  ],
  "tips": ["요리 팁 1", "요리 팁 2"]
}

규칙:
1. 주어진 재료만 사용 (소금·설탕·식용유 같은 기본 양념은 허용)
2. 한국 가정에서 쉽게 따라할 수 있는 요리 추천
3. steps 의 timerMinutes 는 해당 단계의 대략적인 소요 시간
4. tips 는 초보자에게 도움되는 실용적 조언\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`재료: \${ingredients.join(", ")}\\n이 재료로 만들 수 있는 맛있는 요리 하나를 추천해줘!\` },
  ],
});

// JSON 파싱
const text = res.text.replace(/\`\`\`json?\\n?/g, "").replace(/\`\`\`/g, "").trim();
const recipe = JSON.parse(text);

console.log(\`🍳 \${recipe.recipeName}\`);
console.log(\`   난이도: \${recipe.difficulty} | 시간: \${recipe.cookingTime} | \${recipe.servings}\`);
console.log("\\n📋 재료:");
for (const ing of recipe.ingredients) {
  console.log(\`   - \${ing.name}: \${ing.amount}\`);
}
console.log("\\n📝 조리 순서:");
for (const step of recipe.steps) {
  console.log(\`   \${step.order}. \${step.description} (⏱️ \${step.timerMinutes}분)\`);
}
console.log("\\n💡 팁:");
for (const tip of recipe.tips) {
  console.log(\`   - \${tip}\`);
}`,
      hints: [
        "JSON 형식 응답 요청 = 앱에서 바로 recipe.steps[0].description 처럼 접근 가능.",
        "한국식 계량(숟가락, 종이컵)을 프롬프트에 명시하면 더 실용적인 결과가 나와요.",
        "재료를 바꿔보세요! 김치+참치+밥 → 김치볶음밥, 두부+고추장+파 → 두부조림 등.",
        "steps 에 timerMinutes 를 넣으면 앱에서 단계별 타이머 기능을 만들 수 있어요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2: 영양 정보 추정 🥗

**레시피가 나오면 AI 가 영양 정보를 추정합니다.**

칼로리·단백질·탄수화물·지방 — 다이어트나 건강 관리에 유용한 정보를 자동으로 계산해요.
물론 정확한 의학적 수치는 아니지만, **대략적인 참고값**으로는 충분합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// === 영양 정보 추정 ===
// 레시피 정보를 바탕으로 AI 가 영양 성분을 추정합니다

const recipeInfo = \`
요리: 달걀 볶음밥
재료: 달걀 2개, 양파 1/2개, 마늘 2쪽, 당근 1/3개, 밥 1공기, 간장 1숟가락, 식용유 1숟가락
분량: 1인분
\`;

const systemPrompt = \`너는 영양학 전문가 AI 야.
주어진 요리와 재료 정보를 보고 1인분 기준 영양 정보를 추정해.

반드시 아래 JSON 형식으로만 응답해:
{
  "dishName": "요리 이름",
  "servingSize": "1인분 기준 설명",
  "nutrition": {
    "calories": 420,
    "protein": 15,
    "carbs": 52,
    "fat": 16,
    "fiber": 3,
    "sodium": 580
  },
  "unit": {
    "calories": "kcal",
    "protein": "g",
    "carbs": "g",
    "fat": "g",
    "fiber": "g",
    "sodium": "mg"
  },
  "healthTips": ["건강 관련 팁 1", "팁 2"],
  "disclaimer": "AI 추정치이며 실제와 다를 수 있습니다"
}

규칙:
1. 한국 식품영양 데이터 기준으로 최대한 현실적으로 추정
2. 조리 중 기름 흡수량도 고려
3. healthTips 는 이 음식의 영양 장단점 조언\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 레시피의 영양 정보를 추정해줘:\\n\${recipeInfo}\` },
  ],
});

const text = res.text.replace(/\`\`\`json?\\n?/g, "").replace(/\`\`\`/g, "").trim();
const info = JSON.parse(text);
const n = info.nutrition;
const u = info.unit;

console.log(\`📊 \${info.dishName} — 영양 정보 (\${info.servingSize})\`);
console.log("─".repeat(45));
console.log(\`  🔥 칼로리:  \${n.calories} \${u.calories}\`);
console.log(\`  💪 단백질:  \${n.protein}\${u.protein}\`);
console.log(\`  🍚 탄수화물: \${n.carbs}\${u.carbs}\`);
console.log(\`  🧈 지방:    \${n.fat}\${u.fat}\`);
console.log(\`  🌾 식이섬유: \${n.fiber}\${u.fiber}\`);
console.log(\`  🧂 나트륨:  \${n.sodium}\${u.sodium}\`);
console.log("─".repeat(45));
console.log("\\n💡 건강 팁:");
for (const tip of info.healthTips) {
  console.log(\`   - \${tip}\`);
}
console.log(\`\\n⚠️ \${info.disclaimer}\`);`,
      hints: [
        "AI 영양 추정은 참고용! 정확한 수치가 필요하면 식품의약품안전처 DB 를 사용하세요.",
        "calories, protein, carbs, fat 4가지가 앱에서 차트로 보여줄 핵심 데이터.",
        "disclaimer 필드를 항상 UI 에 표시하는 게 좋아요 — 의학적 조언이 아니라는 점을 명시.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3: 대체 재료 제안 🔄

**재료가 부족할 때 AI 가 대체 재료를 추천합니다.**

"버터가 없어요" → "식용유나 마가린으로 대체 가능!" 같은 실용적인 조언.
알레르기나 식이 제한(비건, 글루텐프리)에도 유용합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// === 대체 재료 제안 ===
// 없는 재료에 대해 AI 가 대체품을 추천합니다

const recipe = "된장찌개";
const availableIngredients = ["두부", "양파", "마늘", "고추"];
const missingIngredients = ["애호박", "대파", "멸치육수"];
const dietaryRestriction = "없음"; // "비건", "글루텐프리", "저탄수화물" 등

const systemPrompt = \`너는 한국 요리 재료 전문가 AI 야.
사용자가 만들려는 요리에서 빠진 재료에 대해 대체 재료를 제안해.

반드시 아래 JSON 형식으로만 응답해:
{
  "originalRecipe": "원래 요리",
  "substitutions": [
    {
      "missing": "없는 재료",
      "alternatives": [
        {
          "name": "대체 재료",
          "ratio": "원래 재료 대비 비율 (예: 1:1)",
          "taste": "맛 변화 설명",
          "difficulty": "구하기 쉬움 | 보통 | 어려움"
        }
      ]
    }
  ],
  "modifiedTips": ["대체 재료 사용 시 조리 팁"],
  "canStillMake": true
}

규칙:
1. 각 빠진 재료마다 2~3개 대안 제시
2. 식이 제한이 있으면 그에 맞는 대안만 제시
3. 맛 변화가 크면 솔직하게 알려줘
4. canStillMake = 대체 재료로도 원래 요리가 성립하는지 판단\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: \`요리: \${recipe}
보유 재료: \${availableIngredients.join(", ")}
없는 재료: \${missingIngredients.join(", ")}
식이 제한: \${dietaryRestriction}

대체 재료를 추천해줘!\`,
    },
  ],
});

const text = res.text.replace(/\`\`\`json?\\n?/g, "").replace(/\`\`\`/g, "").trim();
const result = JSON.parse(text);

console.log(\`🔄 "\${result.originalRecipe}" 대체 재료 제안\`);
console.log(\`   만들 수 있나요? \${result.canStillMake ? "✅ 네!" : "❌ 어려워요"}\`);
console.log("─".repeat(50));

for (const sub of result.substitutions) {
  console.log(\`\\n❌ 없는 재료: \${sub.missing}\`);
  for (const alt of sub.alternatives) {
    console.log(\`   ✅ → \${alt.name} (\${alt.ratio})\`);
    console.log(\`        맛: \${alt.taste}\`);
    console.log(\`        구하기: \${alt.difficulty}\`);
  }
}

console.log("\\n💡 조리 팁:");
for (const tip of result.modifiedTips) {
  console.log(\`   - \${tip}\`);
}`,
      hints: [
        "대체 재료 기능은 사용자 이탈을 줄여요 — '재료 없네, 포기' 대신 '이걸로 해보자!'",
        "식이 제한 필터(비건/글루텐프리)와 결합하면 알레르기 안전 레시피가 됩니다.",
        "canStillMake 필드로 '이 조합으로는 무리...' 판단도 자동화할 수 있어요.",
        "missingIngredients 를 바꿔보세요! '된장' 을 빼면 된장찌개가 성립할까요?",
      ],
    },

    // ─── Part A 완료 ───
    {
      type: "markdown",
      source: `## ✅ Part A 완료!

3개의 AI 로직을 체험했습니다:

| 기능 | 입력 | 출력 |
|---|---|---|
| 레시피 생성 | 재료 목록 | 요리명, 단계별 조리법, 팁 |
| 영양 정보 | 레시피 + 재료량 | 칼로리, 단백질, 탄수화물, 지방 |
| 대체 재료 | 없는 재료 | 대안 목록 + 맛 변화 + 조리 팁 |

이제 Part B 에서 이 로직들을 하나의 **풀스택 레시피 앱**으로 조립합니다!

---

## Part B: 풀스택 레시피 앱 (80분)

> 🎯 **VS Code + 터미널**에서 진행합니다. AI(Claude Code/Cursor)에게 아래 명세를 전달하세요.

\`\`\`
[Part A 에서 체험한 AI 로직] → [React 앱으로 조립] → [완성된 레시피 추천 앱]
\`\`\``,
    },

    // ─── Part B: 풀스택 레시피 앱 구현 가이드 ───
    {
      type: "markdown",
      source: `### 📋 기술 스택

| 영역 | 기술 | 역할 |
|---|---|---|
| 프레임워크 | React + TypeScript + Vite | 앱 기본 구조 |
| 스타일링 | Tailwind CSS | 반응형 UI + 다크모드 |
| AI | @google/genai (Gemini) | 레시피 생성 + 영양 정보 + 대체 재료 |
| 이미지 인식 | Gemini Vision | 사진으로 재료 자동 인식 |
| 상태 관리 | React useState/useReducer | 재료·레시피·필터 상태 |
| 저장 | localStorage | 즐겨찾기 레시피 |
| 공유 | Web Share API / URL 복사 | 레시피 공유 |

### 🏗️ 프로젝트 생성

AI 에게 이렇게 요청하세요:

> "React + TypeScript + Vite + Tailwind 으로 AI 레시피 추천 앱을 만들어줘.
> @google/genai 패키지로 Gemini API 를 사용해.
> 환경변수는 VITE_GEMINI_API_KEY 로 설정해줘."

\`\`\`bash
npm create vite@latest ai-recipe-app -- --template react-ts
cd ai-recipe-app
npm install @google/genai
npm install -D tailwindcss @tailwindcss/vite
\`\`\``,
    },

    {
      type: "markdown",
      source: `### 🎨 기능 1: 재료 입력 (태그 스타일 + 자동완성)

**사용자가 재료를 입력하면 태그로 추가되는 인터랙티브 UI.**

\`\`\`
┌─────────────────────────────────────────────┐
│  🥚 달걀 ✕  🧅 양파 ✕  🧄 마늘 ✕           │
│  ┌─────────────────────────────┐            │
│  │ 당 ▾                        │  [추가]    │
│  ├─────────────────────────────┤            │
│  │  🥕 당근                    │            │
│  │  🍗 닭가슴살                │            │
│  │  🫘 당면                    │            │
│  └─────────────────────────────┘            │
└─────────────────────────────────────────────┘
\`\`\`

AI 에게 이렇게 요청하세요:

> "IngredientInput 컴포넌트를 만들어줘.
> - 입력하면 한국 식재료 목록에서 자동완성 드롭다운
> - Enter 또는 클릭으로 태그 추가
> - 각 태그에 ✕ 버튼으로 삭제
> - 이모지 매핑: 달걀→🥚, 양파→🧅, 고기→🥩 등
> - Tailwind 으로 태그 스타일링"

#### 자동완성용 식재료 목록

\`\`\`typescript
const KOREAN_INGREDIENTS = [
  { name: "달걀", emoji: "🥚", category: "단백질" },
  { name: "양파", emoji: "🧅", category: "채소" },
  { name: "마늘", emoji: "🧄", category: "채소" },
  { name: "당근", emoji: "🥕", category: "채소" },
  { name: "감자", emoji: "🥔", category: "채소" },
  { name: "두부", emoji: "🫘", category: "단백질" },
  { name: "김치", emoji: "🥬", category: "반찬" },
  { name: "밥", emoji: "🍚", category: "탄수화물" },
  { name: "라면", emoji: "🍜", category: "탄수화물" },
  { name: "돼지고기", emoji: "🥩", category: "단백질" },
  { name: "닭가슴살", emoji: "🍗", category: "단백질" },
  { name: "참치캔", emoji: "🐟", category: "단백질" },
  // ... AI 에게 50개 이상 생성 요청!
];
\`\`\``,
    },

    {
      type: "markdown",
      source: `### 🥗 기능 2: 식이 필터

**채식·비건·글루텐프리·저탄수화물 등 식이 제한을 선택하는 토글 버튼.**

\`\`\`
식이 필터:
  [🥬 채식]  [🌱 비건]  [🚫 글루텐프리]  [🥑 저탄수화물]
   ☑ 활성    ☐ 비활성     ☐ 비활성          ☐ 비활성
\`\`\`

AI 프롬프트에 식이 제한을 전달하면 해당 조건에 맞는 레시피만 추천합니다:

\`\`\`typescript
// 시스템 프롬프트에 추가
const dietaryFilters = selectedFilters.join(", ");
const dietaryPrompt = dietaryFilters
  ? \`\\n식이 제한: \${dietaryFilters}. 이 조건에 맞는 레시피만 추천해.\`
  : "";
\`\`\`

### 🤖 기능 3: AI 레시피 생성

Part A 에서 만든 프롬프트를 ==React Hook== 으로 감싸세요.

> "useRecipeAI 커스텀 훅을 만들어줘.
> - generateRecipe(ingredients, filters) → 레시피 JSON
> - estimateNutrition(recipe) → 영양 정보 JSON
> - suggestSubstitutes(recipe, missing) → 대체 재료 JSON
> - 각 함수는 loading, error 상태 포함
> - @google/genai 의 GoogleGenAI 클래스 사용"

\`\`\`typescript
// 사용 예시
const { generateRecipe, isLoading, error } = useRecipeAI();

const handleGenerate = async () => {
  const recipe = await generateRecipe(ingredients, filters);
  setRecipe(recipe);
  // 영양 정보도 자동으로 이어서 요청
  const nutrition = await estimateNutrition(recipe);
  setNutrition(nutrition);
};
\`\`\``,
    },

    {
      type: "markdown",
      source: `### 📋 기능 4: 레시피 카드 (체크박스 + 영양 차트)

**AI 가 생성한 레시피를 카드 형태로 보여주는 UI.**

\`\`\`
┌─────────────────────────────────────┐
│  🍛 달걀 볶음밥                     │
│  ⭐ 쉬움 · ⏱️ 15분 · 🍽️ 1인분     │
│─────────────────────────────────────│
│  📝 조리 순서                       │
│  ☑ 1. 양파·당근 잘게 썰기           │
│  ☐ 2. 기름 두르고 마늘 볶기 [⏱️]   │
│  ☐ 3. 채소 넣고 중불 볶기   [⏱️]   │
│  ☐ 4. 밥+달걀 넣고 볶기     [⏱️]   │
│  ☐ 5. 간 맞추기             [⏱️]   │
│─────────────────────────────────────│
│  📊 영양 정보                       │
│  ████████░░  칼로리 420kcal         │
│  ███░░░░░░░  단백질 15g             │
│  ██████░░░░  탄수화물 52g           │
│  ██░░░░░░░░  지방 16g               │
│─────────────────────────────────────│
│  [❤️ 저장]  [📤 공유]  [🔄 다시]    │
└─────────────────────────────────────┘
\`\`\`

AI 에게:

> "RecipeCard 컴포넌트를 만들어줘.
> - steps 를 체크박스 리스트로 표시 (완료하면 줄긋기)
> - 각 step 옆에 타이머 시작 버튼
> - 영양 정보를 가로 바 차트로 시각화 (Tailwind bg-gradient)
> - 하단에 저장/공유/다시생성 버튼
> - Tailwind dark:bg-gray-800 다크모드 지원"`,
    },

    {
      type: "markdown",
      source: `### ⏱️ 기능 5: 조리 타이머

**각 조리 단계마다 개별 타이머를 제공합니다.**

\`\`\`
┌──────────────────────────────┐
│  ⏱️ Step 3: 채소 볶기        │
│                              │
│       02:47                  │
│    ████████░░░░░░            │
│                              │
│  [⏸️ 일시정지]  [🔄 초기화]  │
│                              │
│  🔔 완료 시 알림             │
└──────────────────────────────┘
\`\`\`

AI 에게:

> "CookingTimer 컴포넌트를 만들어줘.
> - minutes prop 으로 시간 설정
> - 시작/일시정지/초기화 버튼
> - 원형 또는 바 형태 프로그레스
> - 완료 시 브라우저 알림 (Notification API)
> - 여러 타이머 동시 실행 가능"

\`\`\`typescript
// 타이머 훅 예시
const useTimer = (initialMinutes: number) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, seconds]);

  // 완료 시 알림
  useEffect(() => {
    if (seconds === 0 && isRunning) {
      new Notification("⏱️ 타이머 완료!", {
        body: "다음 단계로 넘어가세요!",
      });
      setIsRunning(false);
    }
  }, [seconds, isRunning]);

  return { seconds, isRunning, start, pause, reset };
};
\`\`\``,
    },

    {
      type: "markdown",
      source: `### 💾 기능 6: 즐겨찾기 저장 (localStorage)

**마음에 드는 레시피를 저장하고 나중에 다시 볼 수 있습니다.**

AI 에게:

> "useFavorites 커스텀 훅을 만들어줘.
> - localStorage 에 레시피 배열 저장/불러오기
> - addFavorite(recipe), removeFavorite(id), getFavorites()
> - 중복 방지 (같은 recipeName 이면 덮어쓰기)"

\`\`\`typescript
const useFavorites = () => {
  const KEY = "ai-recipe-favorites";

  const getFavorites = (): Recipe[] =>
    JSON.parse(localStorage.getItem(KEY) || "[]");

  const addFavorite = (recipe: Recipe) => {
    const favs = getFavorites().filter(f => f.recipeName !== recipe.recipeName);
    localStorage.setItem(KEY, JSON.stringify([recipe, ...favs]));
  };

  // ...
};
\`\`\`

### 📤 기능 7: 레시피 공유

**레시피를 링크로 공유하거나 텍스트로 복사합니다.**

\`\`\`typescript
const shareRecipe = async (recipe: Recipe) => {
  const text = \`🍳 \${recipe.recipeName}\\n\\n\` +
    recipe.steps.map((s, i) => \`\${i+1}. \${s.description}\`).join("\\n");

  if (navigator.share) {
    // 모바일: 네이티브 공유 시트
    await navigator.share({ title: recipe.recipeName, text });
  } else {
    // 데스크톱: 클립보드 복사
    await navigator.clipboard.writeText(text);
    alert("레시피가 복사되었습니다! 📋");
  }
};
\`\`\``,
    },

    {
      type: "markdown",
      source: `### 📷 기능 8: 사진으로 재료 인식 (Gemini Vision)

**냉장고 사진을 찍으면 ==Gemini Vision== 이 재료를 자동 인식합니다!**

\`\`\`
[📷 사진 촬영/업로드]
        ↓
  Gemini Vision 분석
        ↓
  "달걀, 양파, 당근, 우유, 김치 발견!"
        ↓
  자동으로 재료 태그 추가
\`\`\`

AI 에게:

> "이미지 업로드 컴포넌트를 만들어줘.
> - 카메라 촬영 또는 갤러리 선택
> - Gemini Vision API 로 이미지 분석
> - 인식된 재료를 자동으로 태그에 추가
> - 인식 결과를 사용자가 확인/수정 가능"

\`\`\`typescript
// Gemini Vision 으로 재료 인식
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const recognizeIngredients = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{
      role: "user",
      parts: [
        { text: \`이 사진에서 식재료를 찾아서 JSON 배열로 알려줘.
형식: [{"name": "재료명", "confidence": 0.95}]
한국어로 답해. 확신도(confidence)가 0.7 이상인 것만.\` },
        { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
      ],
    }],
  });

  const text = response.text
    .replace(/\\\`\\\`\\\`json?\\n?/g, "").replace(/\\\`\\\`\\\`/g, "").trim();
  return JSON.parse(text);
};
\`\`\`

> 💡 ==Gemini Vision== 은 이미지+텍스트를 동시에 이해하는 ==멀티모달== AI 에요.
> 사진 속 재료 인식 정확도가 놀라울 정도로 높습니다!`,
    },

    {
      type: "markdown",
      source: `### 🌙 기능 9: 다크/라이트 모드

**Tailwind 의 dark: 접두사로 간단하게 구현합니다.**

AI 에게:

> "다크모드 토글을 만들어줘.
> - localStorage 에 테마 저장
> - 시스템 설정 감지 (prefers-color-scheme)
> - 헤더에 ☀️/🌙 토글 버튼
> - Tailwind dark: 클래스 활용"

\`\`\`typescript
// 다크모드 훅
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(d => !d) };
};
\`\`\`

### 🏁 앱 전체 구조

\`\`\`
src/
├── components/
│   ├── IngredientInput.tsx    ← 재료 태그 입력 + 자동완성
│   ├── DietaryFilter.tsx      ← 식이 필터 토글
│   ├── RecipeCard.tsx         ← 레시피 카드 (체크박스 + 영양)
│   ├── CookingTimer.tsx       ← 조리 타이머
│   ├── ImageUpload.tsx        ← 사진 재료 인식
│   ├── FavoritesList.tsx      ← 즐겨찾기 목록
│   └── ThemeToggle.tsx        ← 다크/라이트 토글
├── hooks/
│   ├── useRecipeAI.ts         ← AI 레시피/영양/대체재료
│   ├── useTimer.ts            ← 카운트다운 타이머
│   ├── useFavorites.ts        ← localStorage 즐겨찾기
│   └── useDarkMode.ts         ← 다크모드
├── data/
│   └── ingredients.ts         ← 한국 식재료 목록 (자동완성용)
├── types/
│   └── recipe.ts              ← Recipe, Nutrition 타입 정의
├── App.tsx                    ← 메인 레이아웃
└── main.tsx                   ← 엔트리포인트
\`\`\``,
    },

    // ─── 도전 과제 + 완료 ───
    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 앱이 완성되면 이 기능들에 도전해보세요!

| 난이도 | 도전 내용 |
|---|---|
| ⭐ | 재료 카테고리별 그룹핑 (채소/단백질/탄수화물 탭) |
| ⭐ | 레시피 히스토리 — 이전에 생성한 레시피 목록 보기 |
| ⭐⭐ | 한 번에 3개 레시피 추천 → 사용자가 선택 |
| ⭐⭐ | 음성 입력 — "달걀이랑 양파 있어" 말하면 자동 추가 (Web Speech API) |
| ⭐⭐ | 장보기 목록 — 대체 재료 대신 진짜 사러 갈 재료 정리 |
| ⭐⭐⭐ | 식단 플래너 — 월~금 식단을 AI 가 자동 계획 (영양 균형 고려) |
| ⭐⭐⭐ | ==PWA== 설정 — 오프라인에서도 저장된 레시피 열람 가능 |

각 도전을 AI 에게 요청할 때:
> "내 AI 레시피 앱에 [기능] 을 추가해줘. React + TypeScript + Tailwind + Gemini API 사용 중이야."

## ✅ W20 완료!

축하합니다! 🎉 AI 가 냉장고를 분석해서 레시피를 추천하는 앱을 만들었습니다.

- ✅ Part A: 재료→레시피·영양정보·대체재료 AI 로직 체험
- ✅ Part B: 태그입력·필터·레시피카드·타이머·저장·공유·이미지인식·다크모드
- ✅ 도전: 음성입력·식단플래너·==PWA==

### 배운 핵심 기술

\`\`\`
재료 입력 (태그 + 자동완성 + 📷 Vision)
           ↓
    식이 필터 적용
           ↓
   Gemini 로 레시피 생성
           ↓
  레시피 카드 (체크박스 + ⏱️ 타이머)
           ↓
    📊 영양 정보 차트
           ↓
  ❤️ 저장 + 📤 공유
\`\`\`

### 다음 워크샵 예고
**W21: AI 여행 플래너** — 여행지·날짜·예산을 입력하면 AI 가 맞춤형 여행 일정을 짜주는 앱.
날씨 API 연동, 지도 표시, 예산 계산까지 — 진짜 쓸 수 있는 여행 도우미를 만듭니다! ✈️`,
    },
  ],

  quiz: {
    title: "W20 — AI 레시피 추천 앱 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "AI 에게 레시피를 JSON 형식으로 응답하도록 요청하는 이유는?",
        options: [
          "JSON 이 텍스트보다 AI 가 생성하기 쉬워서",
          "JSON 은 프로그래밍 언어에서 바로 파싱해서 UI 에 활용할 수 있어서",
          "JSON 이 더 적은 토큰을 사용해서 비용이 절감되어서",
          "JSON 형식이 아니면 Gemini API 가 오류를 반환해서",
        ],
        correctIndex: 1,
        explanation:
          "JSON 으로 응답받으면 recipe.steps[0].description 처럼 코드에서 바로 접근 가능합니다. 이를 통해 레시피 카드, 타이머, 영양 차트 등 UI 컴포넌트에 데이터를 쉽게 전달할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question:
          "Gemini Vision 으로 냉장고 사진에서 재료를 인식하려면 API 에 무엇을 전달해야 하나요?",
        options: [
          "사진 파일의 URL 만 전달",
          "사진의 Base64 인코딩 데이터와 분석 요청 텍스트를 함께 전달",
          "사진을 먼저 OCR 처리한 텍스트를 전달",
          "사진을 Google Photos 에 업로드한 뒤 공유 링크를 전달",
        ],
        correctIndex: 1,
        explanation:
          "Gemini Vision 은 멀티모달 AI 로, 이미지 데이터(Base64)와 텍스트 프롬프트를 동시에 받아 분석합니다. inlineData 에 이미지를, text 에 분석 요청을 함께 보내면 됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "레시피 앱에서 '대체 재료 제안' 기능이 사용자 경험에 주는 가장 큰 이점은?",
        options: [
          "AI API 호출 횟수를 늘려서 더 정확한 결과를 얻을 수 있다",
          "재료가 부족해도 요리를 포기하지 않고 대안을 찾을 수 있다",
          "원래 레시피보다 더 맛있는 요리를 만들 수 있다",
          "사용자의 요리 실력이 자동으로 향상된다",
        ],
        correctIndex: 1,
        explanation:
          "대체 재료 기능은 사용자 이탈을 줄이는 핵심 기능입니다. '재료가 없네, 포기' 대신 '이걸로 해보자!' 로 전환되어 앱 활용도가 크게 높아집니다. 알레르기나 식이 제한(비건 등)에도 유용해요.",
      },
    ],
  } satisfies Quiz,
};
