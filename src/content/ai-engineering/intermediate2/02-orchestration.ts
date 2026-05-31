import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson02: Lesson = {
  id: "ai-eng-m2-02-orchestration",
  language: "ai-engineering",
  track: "intermediate2",
  order: 2,
  title: "오케스트레이션 패턴 — 여러 에이전트 조율",
  subtitle: "router · supervisor · 병렬 — 한 에이전트로 안 될 때",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🎼 오케스트레이션

> 💡 보라색 점선 밑줄 = 전문 용어.

한 에이전트에 모든 도구·지시를 욱여넣으면 — 지시를 헷갈리고, 컨텍스트가 폭발하고, 디버깅이 어려워집니다.
**여러 전문 에이전트로 나누고 조율**하는 게 오케스트레이션입니다.

### 세 가지 핵심 패턴
| 패턴 | 설명 | 언제 |
|---|---|---|
| ==router== | 질의를 분류해 **알맞은 전문 에이전트로 분배** | 요청 종류가 다양할 때 |
| ==supervisor== | 상위 에이전트가 하위들을 **지휘·종합** | 복합 작업을 단계로 쪼갤 때 |
| **병렬(parallel)** | 독립 하위작업을 **동시 실행** | 작업끼리 의존이 없을 때 |

> 입문 7강의 고정 파이프라인(조사→집필→검토)에서 한 발 더 — **동적 분기·병렬·계층**으로.`,
    },

    {
      type: "markdown",
      source: `## 🧭 Router — 질의를 분류해 분배

\`\`\`
사용자 질문 ──▶ [분류 에이전트] ──┬─ "계산"  → 계산 에이전트
                                  ├─ "검색"  → RAG 에이전트
                                  └─ "잡담"  → 일반 대화
\`\`\`

분류는 ==responseSchema== 로 카테고리를 강제하면 안전합니다(입문 3강의 응용).
아래에서 라우터를 직접 만듭니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// Router 에이전트 — 질의 분류 후 알맞은 처리로 분배
async function route(question: string): Promise<string> {
  // ① 분류 (카테고리 강제)
  const Cat = z.object({ category: z.enum(["calc", "knowledge", "chat"]) });
  const cls = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "질문을 calc(계산)/knowledge(사실·지식 질문)/chat(잡담) 중 하나로 분류해 JSON 으로." },
      { role: "user", content: question },
    ],
    responseSchema: toJsonSchema(Cat),
  });
  const { category } = Cat.parse(cls.json);
  console.log(\`🧭 분류: \${category}\`);

  // ② 분기 — 각 카테고리별 '전문 처리'
  if (category === "calc") {
    const calc = {
      name: "calc", description: "사칙연산",
      parameters: { type: "object", properties: { a: { type: "number" }, b: { type: "number" }, op: { type: "string" } }, required: ["a", "b", "op"] },
      execute: async ({ a, b, op }: any) => ({ result: op === "mul" ? a * b : op === "add" ? a + b : op === "sub" ? a - b : a / b }),
    };
    const r = await chatWithTools(
      { provider: "gemini", messages: [{ role: "system", content: "calc 도구로만 계산." }, { role: "user", content: question }], tools: [calc], toolChoice: "any" },
      {},
    );
    return r.text;
  }
  if (category === "knowledge") {
    const r = await chat({ provider: "gemini", messages: [{ role: "system", content: "사실 위주로 간결히 한국어로 답해." }, { role: "user", content: question }] });
    return r.text;
  }
  const r = await chat({ provider: "gemini", messages: [{ role: "system", content: "친근하게 짧게 답해." }, { role: "user", content: question }] });
  return r.text;
}

for (const q of ["12 곱하기 8은?", "대한민국 수도는?", "오늘 기분 어때?"]) {
  console.log(\`\\n❓ \${q}\`);
  console.log("💬", (await route(q)).trim());
}
console.log("\\n👉 질문마다 다른 전문 처리로 분배됩니다 — 이게 라우터 오케스트레이션.");`,
      hints: [
        "분류를 responseSchema(enum)로 강제하면 'calc/knowledge/chat' 외 값이 안 나와 분기가 안전합니다.",
        "각 분기는 '전문 에이전트' — 계산은 도구 강제, 지식은 간결, 잡담은 친근. system prompt 가 전문성을 만듭니다.",
        "실무에선 분기마다 다른 모델(task)·도구·트윈을 붙여 비용·품질을 최적화합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ⚡ 병렬 — 독립 작업 동시에

작업끼리 의존이 없으면 \`Promise.all\` 로 **동시 실행**해 지연을 줄입니다.

\`\`\`
순차: 작업A(2초) → 작업B(2초) → 작업C(2초) = 6초
병렬: [A, B, C] 동시            = 2초
\`\`\`

단, **서로 결과가 필요하면 순차**여야 합니다(예: 조사 → 그 결과로 집필).`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 병렬 vs 순차 — 독립 요약 3개를 동시에
const topics = ["RAG 란?", "임베딩이란?", "에이전트란?"];

async function summarize(topic: string): Promise<string> {
  const r = await chat({
    provider: "gemini",
    messages: [{ role: "system", content: "한 문장으로 아주 짧게 정의해." }, { role: "user", content: topic }],
    maxTokens: 80,
  });
  return r.text.trim();
}

// 병렬 — 세 요약을 동시에 (서로 독립이므로)
const results = await Promise.all(topics.map((t) => summarize(t)));
topics.forEach((t, i) => console.log(\`• \${t} → \${results[i]}\`));
console.log("\\n👉 세 작업이 동시에 진행돼, 순차보다 빠릅니다(독립 작업일 때만).");
console.log("⚠️ 서로 결과가 필요하면(조사→집필) 병렬이 아니라 순차여야 합니다.");`,
      hints: [
        "Promise.all 은 모든 작업이 끝날 때까지 기다리되 동시에 진행 — 독립 작업의 지연을 크게 줄임.",
        "병렬은 무료 티어 RPM(분당 요청) 한도를 빨리 소진할 수 있으니 개수에 주의.",
        "의존이 있으면(A결과가 B입력) 병렬 불가 — supervisor 가 순서를 지휘합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 👑 Supervisor (개념)

상위 **supervisor 에이전트**가 목표를 받아 하위 작업으로 쪼개고, 적절한 하위 에이전트를 호출해 결과를 **종합**합니다.

\`\`\`
[Supervisor] "여행 계획 짜줘"
   ├─→ [날씨 에이전트]  날씨 조회
   ├─→ [장소 에이전트]  명소 추천
   └─→ 종합 → 최종 일정
\`\`\`

구현은 결국 **router + 병렬/순차 + 종합 chat** 의 조합입니다. 미션에서 라우터를 직접 확장해 봅니다.`,
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 라우터에 카테고리 추가

\`route\` 에 **"translate"(번역)** 카테고리를 추가하세요.
분류 enum 에 translate 를 넣고, 해당 분기에서 "영어로 번역" 처리를 합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 🎯 TODO: enum 에 "translate" 추가 + 분기 추가
async function route(question: string): Promise<string> {
  const Cat = z.object({ category: z.enum(["knowledge", "chat"]) });  // TODO: "translate" 추가
  const cls = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "질문을 분류해 JSON 으로. (knowledge=지식, chat=잡담)" },  // TODO: translate 설명 추가
      { role: "user", content: question },
    ],
    responseSchema: toJsonSchema(Cat),
  });
  const { category } = Cat.parse(cls.json);
  console.log("🧭 분류:", category);

  // TODO: if (category === "translate") { ... 영어 번역 ... }
  if (category === "knowledge") {
    return (await chat({ provider: "gemini", messages: [{ role: "system", content: "사실 위주로 간결히." }, { role: "user", content: question }] })).text;
  }
  return (await chat({ provider: "gemini", messages: [{ role: "system", content: "친근하게 짧게." }, { role: "user", content: question }] })).text;
}

console.log(await route("이 문장을 번역해줘: 안녕하세요"));`,
      hints: [
        "z.enum([\"knowledge\",\"chat\",\"translate\"]) 로 카테고리 추가.",
        "system 분류 지시에 'translate=번역 요청' 설명을 더해 모델이 잘 분류하게.",
        "translate 분기: chat(system:'한국어를 영어로 번역만 출력', user:question)",
      ],
      solution: `async function route(question: string): Promise<string> {
  const Cat = z.object({ category: z.enum(["knowledge", "chat", "translate"]) });
  const cls = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "질문을 분류해 JSON 으로. knowledge=지식 질문, chat=잡담, translate=번역 요청." },
      { role: "user", content: question },
    ],
    responseSchema: toJsonSchema(Cat),
  });
  const { category } = Cat.parse(cls.json);
  console.log("🧭 분류:", category);

  if (category === "translate") {
    return (await chat({ provider: "gemini", messages: [{ role: "system", content: "사용자 문장을 영어로 번역만 출력." }, { role: "user", content: question }] })).text;
  }
  if (category === "knowledge") {
    return (await chat({ provider: "gemini", messages: [{ role: "system", content: "사실 위주로 간결히." }, { role: "user", content: question }] })).text;
  }
  return (await chat({ provider: "gemini", messages: [{ role: "system", content: "친근하게 짧게." }, { role: "user", content: question }] })).text;
}

console.log(await route("이 문장을 번역해줘: 안녕하세요"));`,
    },

    {
      type: "markdown",
      source: `## 🧭 중2-02 정리

- ✅ ==router== — 분류(responseSchema enum)로 알맞은 전문 에이전트에 분배
- ✅ **병렬** — 독립 작업은 \`Promise.all\` 로 동시 실행(지연 ↓), 의존 있으면 순차
- ✅ ==supervisor== — 목표를 쪼개 하위 에이전트를 지휘·종합 (router+병렬/순차+종합)

### 다음 강 — 중2-03 메모리 & 컨텍스트 관리
에이전트가 **긴 대화**를 견디게:
- 단기(대화)/장기(==트윈==) 메모리 · 슬라이딩 윈도우 · 대화 요약 압축`,
    },
  ],

  quiz: {
    title: "중2-02 — 오케스트레이션 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "router 패턴에서 분류를 responseSchema(enum)로 강제하는 이유는?",
        options: [
          "속도를 높이려고",
          "정해진 카테고리 외 값이 나오지 않아 분기가 안전해지기 때문",
          "임베딩을 줄이려고",
          "토큰을 늘리려고",
        ],
        correctIndex: 1,
        explanation: "enum 으로 카테고리를 강제하면 모델이 'calc/knowledge/chat' 외 값을 내지 않아, 뒤따르는 if 분기가 깨지지 않는다.",
      },
      {
        type: "multiple-choice",
        question: "Promise.all 병렬 실행이 적합한 경우는?",
        options: [
          "작업 A의 결과가 작업 B의 입력일 때",
          "작업들이 서로 독립적이어서 동시에 진행해도 될 때",
          "무한 루프가 필요할 때",
          "토큰을 0으로 만들 때",
        ],
        correctIndex: 1,
        explanation: "병렬은 독립 작업에만 적합. 의존이 있으면(조사→집필) 순차여야 한다. 병렬은 지연을 줄이지만 RPM 한도를 빨리 쓴다.",
      },
      {
        type: "multiple-choice",
        question: "supervisor 패턴을 한 줄로 요약하면?",
        options: [
          "모델을 더 크게 바꾸는 것",
          "상위 에이전트가 목표를 하위 작업으로 쪼개 하위 에이전트를 지휘하고 결과를 종합하는 것",
          "모든 도구를 제거하는 것",
          "캐시를 비우는 것",
        ],
        correctIndex: 1,
        explanation: "supervisor 는 목표를 분해→하위 에이전트 호출(병렬/순차)→종합. 구현은 router + 병렬/순차 + 종합 chat 의 조합이다.",
      },
    ],
  } satisfies Quiz,
};
