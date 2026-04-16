import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson06: Lesson = {
  id: "ai-eng-06-single-agent",
  language: "ai-engineering",
  track: "beginner",
  order: 6,
  title: "단일 에이전트 — 이메일 초안 에이전트",
  subtitle: "CoT + Tool Calling 을 조합해 '일하는 AI' 만들기",
  estimatedMinutes: 40,
  cells: [
    {
      type: "markdown",
      source: `# 🤖 ==에이전트== = 생각 + 행동 + 관찰

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

Ch04 에서 **==CoT== (생각)**, Ch05 에서 **==Tool Calling== (행동)** 을 배웠습니다.
이 둘을 합치면? — 바로 **에이전트 (Agent)** 입니다.

## Think → Act → Observe 루프

\`\`\`
사용자: "내일 회의 참석자에게 안내 메일 써줘"
  ↓
[🧠 Think] 먼저 내일 회의 일정을 확인해야겠어
  ↓
[🔧 Act]   getSchedule({ date: "2026-04-17" }) 호출
  ↓
[👁️ Observe] 회의: 오후 2시, 참석자: 김철수, 박영희, 이민수
  ↓
[🧠 Think] 이제 참석자 이메일을 찾아야지
  ↓
[🔧 Act]   getContacts({ names: ["김철수","박영희","이민수"] }) 호출
  ↓
[👁️ Observe] 이메일: cs@..., yh@..., ms@...
  ↓
[🧠 Think] 정보 충분. 안내 메일 초안 작성하자
  ↓
[✅ Answer] "안녕하세요, 내일 4/17 오후 2시 회의 안내드립니다..."
\`\`\`

### 핵심 인사이트
- **\`chatWithTools\` 가 이미 이 루프의 구현체**. Ch05 에서 이미 만들었어요!
- 에이전트 = chatWithTools + 좋은 system prompt + 적절한 tool 세트
- "새로운 SDK" 가 아니라 **기존 도구의 조합**

## 이 장에서 배울 것
1. 에이전트 프롬프트 설계 (system 에 목표·제약·도구 사용 지침)
2. 최소 에이전트 (1 tool) → 이메일 에이전트 (3 tool)
3. **AgentTraceViewer** — 사고·행동 타임라인 자동 시각화
4. 에이전트 안전 — 도구 권한·승인·로그 감사
5. 미션: 나만의 에이전트`,
    },

    {
      type: "markdown",
      source: `## 🎯 최소 에이전트 — tool 1개로 시작

에이전트의 **가장 작은 형태**: system prompt + chatWithTools + tool 1개.

포인트: **==system prompt== 에 "너는 ____ 에이전트야" 라고 역할 부여** 하는 것이 핵심.
일반 chatWithTools 호출과 에이전트의 차이는 결국 **==프롬프트== 설계의 질**입니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 최소 에이전트 — 계산기 tool 1개
const calculator = {
  name: "calculator",
  description: "두 숫자의 사칙연산을 정확히 수행. op 는 add/sub/mul/div 중 하나.",
  parameters: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" },
      op: { type: "string", enum: ["add", "sub", "mul", "div"] },
    },
    required: ["a", "b", "op"],
  },
  execute: async ({ a, b, op }: { a: number; b: number; op: string }) => {
    const ops: Record<string, (x: number, y: number) => number> = {
      add: (x, y) => x + y,
      sub: (x, y) => x - y,
      mul: (x, y) => x * y,
      div: (x, y) => y !== 0 ? x / y : NaN,
    };
    return { result: (ops[op] ?? ops.add)(a, b) };
  },
};

const res = await chatWithTools({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: "너는 수학 교사 에이전트야. 학생의 수학 질문에 반드시 calculator 도구를 사용해 정확히 답해. 중간 풀이 과정도 설명해.",
    },
    {
      role: "user",
      content: "사과 3봉지를 샀는데 각 봉지에 12개씩 들어있어. 친구한테 7개 줬으면 몇 개 남아?",
    },
  ],
  tools: [calculator],
  toolChoice: "any",
});

console.log(res.text);`,
      hints: [
        "system 에 '반드시 도구를 사용해' 를 명시하면 모델이 자기 산수 대신 calculator 를 씀.",
        "셀 결과에 에이전트 실행 로그 (🔧 도구 호출 → 📨 결과) 가 자동 표시됨.",
        "toolChoice:'any' 가 없으면 모델이 '36-7=29 이야~' 하고 직접 답할 수 있음.",
      ],
    },

    {
      type: "markdown",
      source: `## 📧 이메일 초안 에이전트

이제 tool 3개를 가진 실전 에이전트를 만듭니다.

### Tool 설계

| Tool | 역할 |
|---|---|
| \`getSchedule\` | 날짜로 회의 일정 조회 |
| \`getContacts\` | 이름 목록 → 이메일 조회 |
| \`draftEmail\` | 수신자·제목·본문 → 이메일 초안 생성 |

### 에이전트 프롬프트 설계 포인트
- **목표**: "사용자 요청에 맞는 이메일 초안을 작성"
- **순서 지침**: "먼저 일정 확인 → 참석자 연락처 → 초안 작성"
- **제약**: "실제 전송은 하지 않고 초안만 표시"
- **톤**: "비즈니스 정중한 한국어"`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 데모용 mock tool 3개
const getSchedule = {
  name: "getSchedule",
  description: "날짜(YYYY-MM-DD)로 회의 일정을 조회. 제목·시간·참석자 이름 반환.",
  parameters: {
    type: "object",
    properties: { date: { type: "string", description: "YYYY-MM-DD" } },
    required: ["date"],
  },
  execute: async () => ({
    title: "Q2 전략 회의",
    time: "14:00",
    attendees: ["김철수", "박영희", "이민수"],
  }),
};

const getContacts = {
  name: "getContacts",
  description: "이름 목록으로 이메일 주소를 조회.",
  parameters: {
    type: "object",
    properties: { names: { type: "array", items: { type: "string" } } },
    required: ["names"],
  },
  execute: async ({ names }: { names: string[] }) =>
    names.map((n) => ({ name: n, email: n.replace(/[가-힣]/g, "") + "@company.com" })),
};

const draftEmail = {
  name: "draftEmail",
  description: "이메일 초안 생성. to·subject·body 를 받아 포맷된 이메일 문자열 반환.",
  parameters: {
    type: "object",
    properties: {
      to: { type: "array", items: { type: "string" } },
      subject: { type: "string" },
      body: { type: "string" },
    },
    required: ["to", "subject", "body"],
  },
  execute: async ({ to, subject, body }: { to: string[]; subject: string; body: string }) =>
    \`To: \${to.join(", ")}\\nSubject: \${subject}\\n\\n\${body}\`,
};

const res = await chatWithTools({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 이메일 초안 에이전트야.
순서:
1. getSchedule 로 내일 일정 확인
2. getContacts 로 참석자 이메일 조회
3. draftEmail 로 안내 메일 초안 작성
제약: 실제 전송은 안 함. 초안만 보여줘. 한국어 비즈니스 정중체.\`,
    },
    {
      role: "user",
      content: "내일 회의 참석자에게 안내 메일 써줘.",
    },
  ],
  tools: [getSchedule, getContacts, draftEmail],
});

console.log("\\n📧 최종 결과:");
console.log(res.text);`,
      hints: [
        "에이전트 실행 로그에서 3단계 (일정→연락처→초안) 가 순차적으로 보이는지 확인.",
        "system 에 순서를 명시하면 모델이 더 체계적으로 tool 을 호출. 안 쓰면 순서가 뒤바뀌기도.",
        "execute 는 mock — 실제 서비스라면 Google Calendar API, 주소록 API 등을 호출하겠죠.",
      ],
    },

    {
      type: "markdown",
      source: `## 🛡️ 에이전트 안전 — 왜 중요한가

에이전트는 **자율적으로 tool 을 호출** 합니다. 편리하지만 위험도 있어요.

| 위험 | 예시 | 방어 |
|---|---|---|
| **권한 초과** | 읽기만 허용했는데 삭제 tool 호출 | tool 목록에 읽기용만 포함 |
| **무한 루프** | 같은 tool 을 계속 호출 | maxIterations 제한 (기본 5) |
| **비용 폭증** | 반복 API 호출 → 유료 한도 초과 | 반복 수 + 토큰 총량 제한 |
| **==환각== 기반 행동** | 잘못된 정보로 이메일 전송 | "초안만, 전송은 사람 승인" |
| **민감 데이터 노출** | tool 결과에 개인정보 포함 → 로그 유출 | 로그 필터링 + 암호화 |

### 실무 원칙 3가지
1. **최소 권한** — 에이전트에 꼭 필요한 tool 만 주기
2. **Human-in-the-loop** — 위험 행동(전송·삭제·결제)은 사람 승인 후 실행
3. **감사 로그** — onStep 으로 모든 tool 호출·결과를 기록 (AgentTraceViewer 가 바로 이것)

## 💡 정리

에이전트는 **"새로운 기술"이 아니라 기존 기술의 조합**입니다:
- \`system prompt\` → 목표·순서·제약 (Ch02)
- \`responseSchema\` → 구조화된 판단 (Ch03)
- \`stream + CoT\` → 투명한 사고 과정 (Ch04)
- \`chatWithTools\` → 행동 루프 (Ch05)
- **AgentTraceViewer** → 사고·행동 시각화 (지금)

**다음 Ch07** 에선 이 에이전트를 **여러 개 조합** 합니다. 🚀`,
    },

    {
      type: "markdown",
      source: `## 🎯 미션: 나만의 에이전트

### 요구사항
- tool **3개 이상** 정의
- **system prompt** 에 목표·순서·제약 명시
- \`chatWithTools\` 로 실행
- 에이전트 실행 로그(도구 호출 과정) 가 셀에 자동 표시되는지 확인

### 아이디어
- 🍳 레시피 에이전트 — searchRecipe, checkIngredients, scaleRecipe
- 📊 보고서 에이전트 — fetchData, analyze, formatReport
- 🎮 퀴즈 출제 에이전트 — pickTopic, generateQuestion, validateAnswer
- ✈️ 여행 플래너 — searchFlights, checkWeather, suggestItinerary`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// TODO: 여기에 나만의 에이전트를 만들어보세요
// 1) tool 3개 이상 정의 (name, description, parameters, execute)
// 2) system prompt 에 에이전트 역할·순서·제약 명시
// 3) chatWithTools 로 호출
// 4) 결과 + 에이전트 로그 확인

throw new Error("미구현 — 위 아이디어 참고해 자유롭게 만들어보세요!");`,
      hints: [
        "mock execute 를 활용하세요: async () => ({ result: '...' }). 실제 API 불필요.",
        "system 에 '1단계: ... 2단계: ... 3단계: ...' 로 순서를 명시하면 모델이 체계적.",
        "toolChoice: 'any' 면 모델이 tool 을 반드시 거쳐 답. 에이전트에선 보통 any 권장.",
      ],
      solution: `// 예시: 레시피 에이전트
const searchRecipe = {
  name: "searchRecipe",
  description: "요리 이름으로 레시피(재료·단계) 검색",
  parameters: {
    type: "object",
    properties: { dish: { type: "string" } },
    required: ["dish"],
  },
  execute: async ({ dish }: { dish: string }) => ({
    dish,
    ingredients: ["파스타 면 200g", "올리브오일 2T", "마늘 3쪽", "페페론치노 2개", "소금"],
    steps: ["면 삶기 (8분)", "마늘+고추 올리브오일에 볶기", "면 합치고 면수 2T 추가", "소금 간"],
  }),
};

const checkIngredients = {
  name: "checkIngredients",
  description: "냉장고 재고 확인 — 있는/없는 재료 분류",
  parameters: {
    type: "object",
    properties: { ingredients: { type: "array", items: { type: "string" } } },
    required: ["ingredients"],
  },
  execute: async ({ ingredients }: { ingredients: string[] }) => ({
    have: ingredients.filter((_, i) => i % 2 === 0),
    need: ingredients.filter((_, i) => i % 2 !== 0),
  }),
};

const scaleRecipe = {
  name: "scaleRecipe",
  description: "레시피를 N인분으로 재조정",
  parameters: {
    type: "object",
    properties: {
      ingredients: { type: "array", items: { type: "string" } },
      servings: { type: "number" },
    },
    required: ["ingredients", "servings"],
  },
  execute: async ({ ingredients, servings }: { ingredients: string[]; servings: number }) => ({
    servings,
    scaled: ingredients.map((i) => \`\${i} (x\${servings})\`),
  }),
};

const res = await chatWithTools({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 요리 도우미 에이전트야.
순서: 1) searchRecipe 로 레시피 검색 2) checkIngredients 로 냉장고 확인
3) scaleRecipe 로 인원수 조정 4) 최종 쇼핑 목록 + 요리 순서 안내.
한국어 친근 존댓말.\`,
    },
    { role: "user", content: "오늘 저녁 알리오올리오 3인분 만들고 싶어. 재료 뭐 사야 해?" },
  ],
  tools: [searchRecipe, checkIngredients, scaleRecipe],
});

console.log("\\n🍳 최종 답:");
console.log(res.text);`,
    },
  ],

  quiz: {
    title: "Ch06 — 단일 에이전트 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "에이전트의 Think-Act-Observe 루프에서 'Act' 에 해당하는 것은?",
        options: [
          "system prompt 에 역할 부여",
          "Tool 을 호출해 외부 정보를 가져오거나 행동을 수행",
          "response.text 를 출력",
          "temperature 를 조절",
        ],
        correctIndex: 1,
        explanation:
          "'Think' = CoT 추론, 'Act' = Tool Calling 실행, 'Observe' = 결과를 히스토리에 반영. 이 루프가 chatWithTools 가 자동으로 하는 일.",
      },
      {
        type: "multiple-choice",
        question: "에이전트와 단순 chatWithTools 호출의 핵심 차이는?",
        options: [
          "완전히 다른 SDK 를 사용",
          "에이전트는 system prompt 에 목표·순서·제약을 체계적으로 설계한 chatWithTools 활용",
          "에이전트는 tool 없이 동작",
          "에이전트는 WebLLM 에서만 동작",
        ],
        correctIndex: 1,
        explanation:
          "에이전트 = chatWithTools + 잘 설계된 프롬프트. 기술적으로 새로운 건 없고 **프롬프트 설계의 질** 이 에이전트의 수준을 결정.",
      },
      {
        type: "multiple-choice",
        question: "에이전트 안전의 3대 원칙이 아닌 것은?",
        options: [
          "최소 권한 — 필요한 tool 만 제공",
          "Human-in-the-loop — 위험 행동은 사람 승인",
          "감사 로그 — 모든 호출 기록",
          "무제한 반복 — 항상 최선의 답을 위해 제한 없이 시도",
        ],
        correctIndex: 3,
        explanation:
          "무제한 반복은 무한 루프·비용 폭증 위험. maxIterations 제한이 필수. 나머지 3개는 실무 필수 원칙.",
      },
      {
        type: "multiple-choice",
        question: "system prompt 에 '1단계: 일정 확인 → 2단계: 연락처 조회 → 3단계: 초안 작성' 으로 순서를 명시하는 이유는?",
        options: [
          "토큰 비용을 줄이기 위해",
          "모델이 tool 호출 순서를 체계적으로 따르도록 유도 — 미명시 시 순서가 뒤바뀌거나 빠지는 경우 있음",
          "한국어 문법에 필수",
          "에이전트가 tool 정의를 읽지 못해서",
        ],
        correctIndex: 1,
        explanation:
          "LLM 은 프롬프트에 명시된 순서를 따르는 경향이 있어요. 비명시 시 모델이 자기 판단으로 순서를 바꾸거나 일부 step 을 건너뛸 수 있음.",
      },
      {
        type: "multiple-choice",
        question: "AgentTraceViewer 는 무엇을 보여주나요?",
        options: [
          "코드 편집 히스토리",
          "에이전트의 Think-Act-Observe 각 단계를 타임라인으로 시각화 — 🧠 생각, 🔧 도구 호출, 📨 결과, ✅ 답변",
          "GPU 사용량 그래프",
          "API 키 목록",
        ],
        correctIndex: 1,
        explanation:
          "chatWithTools 의 onStep 이벤트가 자동으로 OutputChunk 'agent-step' 으로 렌더. 각 단계가 카드 형태로 세로 타임라인에 나열.",
      },
    ],
  } satisfies Quiz,
};
