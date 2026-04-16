import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson11: Lesson = {
  id: "ai-eng-11-llm-comparison",
  language: "ai-engineering",
  track: "beginner",
  order: 11,
  title: "LLM 생태계 비교 실습",
  subtitle: "WebLLM 1B vs Groq 70B vs Gemini — 같은 질문, 다른 세계",
  estimatedMinutes: 35,
  cells: [
    {
      type: "markdown",
      source: `# 🔬 같은 ==프롬프트==, 세 개의 다른 AI

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

지금까지 각 챕터에서 **한 ==Provider== 에 집중** 했어요.
이 장에선 **==WebLLM== (1B) · Groq (70B) · Gemini (수천억+)** 세 ==모델==을 **나란히** 돌려 비교합니다.

### 왜 비교하나?
- 모델 선택은 실무의 **가장 중요한 설계 결정** 중 하나
- 크면 항상 좋은가? → 속도·비용·프라이버시 트레이드오프
- 각 모델의 **강점 영역** 을 파악해야 적재적소에 배치

### 비교 축 5가지
| 축 | 측정 방법 |
|---|---|
| 📝 **한국어 품질** | 동일 프롬프트의 자연스러움 |
| ⚡ **속도** (latencyMs) | 응답 시간 직접 측정 |
| 🔢 **==토큰== 효율** | input/output 토큰 수 |
| 🧠 **추론력** | 수학·논리 문제 정답률 |
| 🛡️ **지시 준수** | system prompt 제약 따르기 |

> ⚠️ **3개 키 모두 필요**: WebLLM(자동), Gemini(Ch02), Groq(Ch02 Step 3). 상단 🔑 확인.`,
    },

    {
      type: "markdown",
      source: `## 📝 비교 1: 한국어 품질

같은 창작 프롬프트를 세 모델에 **동시** 전달. 결과를 눈으로 비교.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const prompt = "봄비가 내리는 서울 골목을 묘사하는 3문장짜리 짧은 산문을 써줘.";

const providers = [
  { name: "WebLLM 1B", opts: { task: "offline" as const, maxTokens: 150 } },
  { name: "Gemini Flash", opts: { provider: "gemini" as const, maxTokens: 150 } },
  { name: "Groq 70B", opts: { provider: "groq" as const, maxTokens: 150 } },
];

for (const p of providers) {
  try {
    const res = await chat({
      ...p.opts,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });
    console.log(\`── \${p.name} (\${res.latencyMs}ms) ──\`);
    console.log(res.text);
    console.log();
  } catch (e) {
    console.log(\`── \${p.name}: \${e instanceof Error ? e.message : String(e)} ──\\n\`);
  }
}`,
      hints: [
        "WebLLM 1B 는 한국어가 어색하거나 부서질 수 있음 — Ch01 에서 본 현상.",
        "Gemini 는 가장 자연스러운 한국어를 내는 경우가 많음 (거대 모델 + 한국어 데이터 풍부).",
        "Groq 70B 는 속도가 극단적으로 빠르면서 품질도 높음 — 두 마리 토끼.",
      ],
    },

    {
      type: "markdown",
      source: `## 🧠 비교 2: 추론력

수학 문제를 CoT 없이 "답만" 요구. 모델 크기별 정답률 차이 관찰.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const mathProblem = "15명이 각자 하루에 4개의 케이크를 만듭니다. 3일 후 총 몇 개? 숫자만 답해.";
const correctAnswer = 180;

const providers = [
  { name: "WebLLM 1B", opts: { task: "offline" as const } },
  { name: "Gemini", opts: { provider: "gemini" as const } },
  { name: "Groq 70B", opts: { provider: "groq" as const } },
];

console.log("정답:", correctAnswer);
console.log();

for (const p of providers) {
  try {
    const res = await chat({
      ...p.opts,
      temperature: 0,
      maxTokens: 20,
      messages: [{ role: "user", content: mathProblem }],
    });
    const num = parseInt(res.text.replace(/[^0-9]/g, ""));
    const correct = num === correctAnswer;
    console.log(\`\${correct ? "✅" : "❌"} \${p.name}: \${res.text.trim()} (\${res.latencyMs}ms)\`);
  } catch (e) {
    console.log(\`⚠️ \${p.name}: \${e instanceof Error ? e.message : String(e)}\`);
  }
}`,
      hints: [
        "temperature 0 + '숫자만 답해' — 순수 추론력 비교. CoT 없는 직답.",
        "WebLLM 1B 는 50%+ 확률로 틀림. Gemini/Groq 는 보통 맞춤.",
        "3번 실행해서 일관성 확인. temp 0 이라 같은 답이 나와야 정상.",
      ],
    },

    {
      type: "markdown",
      source: `## ⚡ 비교 3: 속도 벤치마크

같은 프롬프트에 대해 **latencyMs + 토큰 효율** 을 정량적으로 비교.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const prompt = "TypeScript 에서 Promise.all 의 사용법을 한국어로 짧게 설명하고 코드 예시 1개.";

const providers = [
  { name: "WebLLM 1B", opts: { task: "offline" as const } },
  { name: "Gemini", opts: { provider: "gemini" as const } },
  { name: "Groq 70B", opts: { provider: "groq" as const } },
];

console.log("── 속도 벤치마크 ──\\n");

for (const p of providers) {
  try {
    const res = await chat({
      ...p.opts,
      maxTokens: 300,
      messages: [{ role: "user", content: prompt }],
    });
    const tokPerSec = res.tokensUsed && res.latencyMs
      ? Math.round((res.tokensUsed.output * 1000) / res.latencyMs)
      : "N/A";
    console.log(\`\${p.name}:\`);
    console.log(\`  지연: \${res.latencyMs}ms\`);
    console.log(\`  출력 토큰: \${res.tokensUsed?.output ?? "?"}\`);
    console.log(\`  속도: \${tokPerSec} tok/s\`);
    console.log();
  } catch (e) {
    console.log(\`\${p.name}: \${e instanceof Error ? e.message : String(e)}\\n\`);
  }
}`,
      hints: [
        "Groq 가 보통 500+ tok/s 로 가장 빠름 — 전용 LPU 하드웨어.",
        "Gemini 는 200~400 tok/s. WebLLM 은 5~30 tok/s (브라우저 GPU 의존).",
        "속도만이 아니라 '품질 대비 속도' 가 실무 선택 기준.",
      ],
    },

    {
      type: "markdown",
      source: `## 📊 비교 결과 정리

| 축 | WebLLM 1B | Groq 70B | Gemini Flash |
|---|---|---|---|
| 한국어 품질 | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 속도 | ⭐ (5~30 tok/s) | ⭐⭐⭐⭐⭐ (500+) | ⭐⭐⭐ (200~400) |
| 추론력 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 비용 | 🆓 무한 | 🆓 14,400/일 | 🆓 1,500/일 |
| 프라이버시 | ⭐⭐⭐⭐⭐ 완전 로컬 | ⭐⭐ 클라우드 | ⭐⭐ 클라우드 |
| 오프라인 | ✅ | ❌ | ❌ |

### 실무 가이드라인
- **프라이버시 필수** → WebLLM (데이터 외부 유출 제로)
- **속도 최우선** (에이전트·CoT 연쇄) → Groq
- **품질 최우선** (고객 대면·복잡 추론) → Gemini
- **비용 최소화** → WebLLM (무제한) + Groq (14K/일)
- **혼합 전략** → task 기반 라우팅으로 자동 분배 (이미 우리 SDK 가 지원!)

## 🧭 Ch12 예고 — 종합 프로젝트
12강 전체 기법을 하나의 앱으로 조립합니다. 🚀`,
    },
  ],

  quiz: {
    title: "Ch11 — LLM 생태계 비교 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "WebLLM 1B 의 가장 큰 강점은?",
        options: [
          "가장 높은 한국어 품질",
          "완전 로컬 실행 — 데이터 외부 유출 제로 + 오프라인 + 무제한",
          "가장 빠른 응답 속도",
          "Tool Calling 지원",
        ],
        correctIndex: 1,
        explanation: "1B 는 품질·속도에선 열세지만 프라이버시·오프라인·무제한이라는 고유 가치가 있음.",
      },
      {
        type: "multiple-choice",
        question: "Groq 가 속도 경쟁에서 압도적인 이유는?",
        options: [
          "모델이 가장 작아서",
          "전용 LPU (Language Processing Unit) 하드웨어로 추론에 특화",
          "프롬프트를 무시하고 빈 답을 내서",
          "한국어를 지원하지 않아서 빠름",
        ],
        correctIndex: 1,
        explanation: "Groq 은 GPU 가 아닌 자체 설계 LPU 칩으로 500+ tok/s. 70B 모델에서도 이 속도가 나오는 건 하드웨어 혁신 덕.",
      },
      {
        type: "multiple-choice",
        question: "실무에서 '에이전트 체인' (chatWithTools 반복 호출) 에 가장 적합한 provider 는?",
        options: [
          "WebLLM — 오프라인이니까",
          "Groq — 500+ tok/s 속도로 반복 호출의 누적 지연을 최소화",
          "반드시 Gemini 만 사용",
          "모델은 상관없고 temperature 만 중요",
        ],
        correctIndex: 1,
        explanation: "에이전트는 chat 을 여러 번 호출하므로 누적 latency 가 큼. Groq 의 초고속이 체감 UX 를 크게 개선.",
      },
    ],
  } satisfies Quiz,
};
