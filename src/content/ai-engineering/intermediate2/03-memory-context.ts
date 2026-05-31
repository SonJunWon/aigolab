import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson03: Lesson = {
  id: "ai-eng-m2-03-memory-context",
  language: "ai-engineering",
  track: "intermediate2",
  order: 3,
  title: "에이전트 메모리 & 컨텍스트 관리",
  subtitle: "긴 대화를 견디기 — 슬라이딩 윈도우·요약·장기 트윈",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🧠 에이전트 메모리

> 💡 보라색 점선 밑줄 = 전문 용어.

에이전트가 오래 대화하면 ==컨텍스트 윈도우== 가 가득 차 **초반 지시를 잊습니다**(중급1 02강의 컨텍스트 폭발).
이 강에서 에이전트가 긴 대화를 견디게 하는 메모리 전략을 배웁니다.

### 메모리 두 종류
| 종류 | 무엇 | 구현 |
|---|---|---|
| **단기 메모리** | 지금 대화의 최근 맥락 | messages 배열 (제한 필요) |
| **장기 메모리** | 영속되는 지식·사실 | ==트윈== (중급1 RAG) — 필요할 때 검색해 불러옴 |

### 전략 3가지
- ==슬라이딩 윈도우== — 최근 N턴만 유지
- **대화 요약** — 오래된 대화를 한 단락으로 압축해 보존
- **장기 적재** — 중요한 사실은 트윈에 저장 후 필요 시 검색`,
    },

    {
      type: "markdown",
      source: `## 🪟 슬라이딩 윈도우 — 최근 N턴만

가장 단순한 전략: system 은 항상 유지하고, **최근 N개 대화 턴만** 남깁니다.

\`\`\`
[system][1][2][3][4][5][6]  →  윈도우(4)  →  [system][3][4][5][6]
\`\`\`

단점: 잘려나간 옛 맥락은 사라짐 → 중요한 건 **요약**하거나 **트윈에 적재**해 보완.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 슬라이딩 윈도우 — system 유지 + 최근 N턴만 모델에 전달
type Msg = { role: "system" | "user" | "assistant"; content: string };

function windowed(history: Msg[], keep = 4): Msg[] {
  const system = history.filter((m) => m.role === "system");
  const turns = history.filter((m) => m.role !== "system");
  return [...system, ...turns.slice(-keep)];  // 최근 keep 턴만
}

// 긴 대화 흉내
const history: Msg[] = [
  { role: "system", content: "너는 사용자의 비서야. 사용자가 알려준 정보를 기억해." },
  { role: "user", content: "내 이름은 준원이야." },
  { role: "assistant", content: "반가워요 준원님!" },
  { role: "user", content: "나는 커피를 좋아해." },
  { role: "assistant", content: "기억할게요." },
  { role: "user", content: "오늘 날씨 좋네." },
  { role: "assistant", content: "그렇네요!" },
];

const sent = windowed(history, 4);
console.log("전체 대화 턴:", history.length, "→ 모델에 보낼:", sent.length);
console.log("보낼 메시지:", sent.map((m) => \`\${m.role}:\${m.content.slice(0, 12)}\`));

// 윈도우가 작으면 '이름' 같은 초반 정보가 잘려 모델이 잊습니다
const res = await chat({ provider: "gemini", messages: [...sent, { role: "user", content: "내 이름이 뭐였지?" }] });
console.log("\\n💬", res.text.trim());
console.log("👉 윈도우(4)가 '이름' 턴을 잘라내면 모델이 못 맞힙니다 → 다음: 요약으로 보존.");`,
      hints: [
        "keep 을 6으로 늘리면 '이름' 턴이 살아 모델이 맞힙니다. 윈도우 크기 = 기억 범위 트레이드오프.",
        "system 은 항상 유지 — 역할·규칙은 잊으면 안 되니까.",
        "잘려나간 중요한 사실은 다음 셀의 '요약' 또는 트윈 적재로 보존합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 📝 대화 요약 — 오래된 맥락을 압축

윈도우 밖으로 밀려나는 대화를 버리지 말고, **LLM 으로 한 단락 요약**해 system 옆에 보존합니다.

\`\`\`
[system] + [오래된 대화 요약] + [최근 N턴]
            └ "사용자 이름은 준원, 커피를 좋아함" (압축)
\`\`\`

이렇게 하면 토큰은 아끼면서 핵심 사실은 유지됩니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 대화 요약 — 오래된 턴을 한 단락으로 압축해 보존
type Msg = { role: "system" | "user" | "assistant"; content: string };

async function summarizeOld(turns: Msg[]): Promise<string> {
  const text = turns.map((m) => \`\${m.role}: \${m.content}\`).join("\\n");
  const r = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "다음 대화에서 '기억해야 할 사용자 사실'만 한 단락으로 요약해. 잡담은 버려." },
      { role: "user", content: text },
    ],
    maxTokens: 120,
  });
  return r.text.trim();
}

const old: Msg[] = [
  { role: "user", content: "내 이름은 준원이야." },
  { role: "assistant", content: "반가워요!" },
  { role: "user", content: "나는 커피를 좋아하고 알레르기는 견과류야." },
  { role: "assistant", content: "메모했어요." },
  { role: "user", content: "오늘 날씨 얘기나 하자." },
  { role: "assistant", content: "좋아요~" },
];

const memo = await summarizeOld(old);
console.log("🗜️ 압축된 장기 기억:\\n", memo);

// 요약을 system 옆에 넣고 최근 대화만 + 질문
const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: \`너는 비서야. [사용자 메모] \${memo}\` },
    { role: "user", content: "내가 못 먹는 게 뭐였지?" },
  ],
});
console.log("\\n💬", res.text.trim());
console.log("👉 잡담은 버리고 '이름·취향·알레르기' 만 압축 보존 → 옛 대화를 잊지 않습니다.");`,
      hints: [
        "요약 system 에 '기억해야 할 사실만, 잡담 버려' 를 명시하면 노이즈가 줄어요.",
        "요약은 주기적으로(예: N턴마다) 갱신하거나, 윈도우 밖으로 밀려날 때 누적합니다.",
        "더 영속이 필요하면 이 메모를 트윈(VectorStore)에 저장해 '장기 메모리' 로 검색합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🔗 장기 메모리 = 트윈

대화 요약도 길어지면 한계가 옵니다. 진짜 장기 기억은 **중급1의 트윈**(VectorStore)에 저장하고, 필요할 때 **검색해서** 불러오는 거예요.

\`\`\`
중요한 사실 발생 → embed → 트윈에 저장(append)
나중에 관련 질문 → 트윈 검색 → 관련 기억만 컨텍스트로
\`\`\`

> 단기(윈도우/요약)와 장기(트윈)를 **함께** 쓰면 에이전트가 사실상 무한히 기억할 수 있습니다.
> 미션에서 슬라이딩 윈도우 + 요약을 한 함수로 합칩니다.`,
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 윈도우 + 요약 결합

\`prepareMessages(history, keep)\` 를 완성하세요.
- 최근 \`keep\` 턴은 그대로
- 그보다 오래된 턴은 **요약 한 단락**으로 압축해 system 옆에 삽입`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `type Msg = { role: "system" | "user" | "assistant"; content: string };

async function summarizeOld(turns: Msg[]): Promise<string> {
  if (turns.length === 0) return "";
  const text = turns.map((m) => \`\${m.role}: \${m.content}\`).join("\\n");
  const r = await chat({ provider: "gemini", messages: [
    { role: "system", content: "기억할 사용자 사실만 한 단락으로 요약." },
    { role: "user", content: text }], maxTokens: 120 });
  return r.text.trim();
}

// 🎯 TODO: 오래된 턴은 요약, 최근 keep 턴은 그대로
async function prepareMessages(history: Msg[], keep = 4): Promise<Msg[]> {
  const system = history.find((m) => m.role === "system");
  const turns = history.filter((m) => m.role !== "system");
  // TODO 1: const recent = 최근 keep 턴
  // TODO 2: const old = 그보다 오래된 턴 → summarizeOld 로 요약
  // TODO 3: [system(+요약), ...recent] 반환
  return turns;  // ← 고치세요
}

const history: Msg[] = [
  { role: "system", content: "너는 비서야." },
  { role: "user", content: "내 이름은 준원, 알레르기는 견과류." },
  { role: "assistant", content: "메모했어요." },
  { role: "user", content: "날씨 얘기." }, { role: "assistant", content: "네~" },
  { role: "user", content: "점심 얘기." }, { role: "assistant", content: "네~" },
];
const msgs = await prepareMessages(history, 2);
const res = await chat({ provider: "gemini", messages: [...msgs, { role: "user", content: "내 알레르기가 뭐였지?" }] });
console.log("💬", res.text.trim(), "\\n👉 견과류를 기억하면 성공.");`,
      hints: [
        "const recent = turns.slice(-keep); const old = turns.slice(0, -keep);",
        "const memo = await summarizeOld(old); const sys = {role:'system', content:`${system?.content} [메모] ${memo}`};",
        "return [sys, ...recent];",
      ],
      solution: `type Msg = { role: "system" | "user" | "assistant"; content: string };

async function summarizeOld(turns: Msg[]): Promise<string> {
  if (turns.length === 0) return "";
  const text = turns.map((m) => \`\${m.role}: \${m.content}\`).join("\\n");
  const r = await chat({ provider: "gemini", messages: [
    { role: "system", content: "기억할 사용자 사실만 한 단락으로 요약." },
    { role: "user", content: text }], maxTokens: 120 });
  return r.text.trim();
}

async function prepareMessages(history: Msg[], keep = 4): Promise<Msg[]> {
  const system = history.find((m) => m.role === "system");
  const turns = history.filter((m) => m.role !== "system");
  const recent = turns.slice(-keep);
  const old = turns.slice(0, -keep);
  const memo = await summarizeOld(old);
  const sys: Msg = { role: "system", content: \`\${system?.content ?? ""}\${memo ? " [사용자 메모] " + memo : ""}\` };
  return [sys, ...recent];
}

const history: Msg[] = [
  { role: "system", content: "너는 비서야." },
  { role: "user", content: "내 이름은 준원, 알레르기는 견과류." },
  { role: "assistant", content: "메모했어요." },
  { role: "user", content: "날씨 얘기." }, { role: "assistant", content: "네~" },
  { role: "user", content: "점심 얘기." }, { role: "assistant", content: "네~" },
];
const msgs = await prepareMessages(history, 2);
const res = await chat({ provider: "gemini", messages: [...msgs, { role: "user", content: "내 알레르기가 뭐였지?" }] });
console.log("💬", res.text.trim());`,
    },

    {
      type: "markdown",
      source: `## 🧭 중2-03 정리

- ✅ ==슬라이딩 윈도우== — 최근 N턴만 유지(+system 항상 유지)
- ✅ **대화 요약** — 오래된 맥락을 한 단락으로 압축 보존 (토큰↓ 사실 유지)
- ✅ **장기 메모리 = ==트윈==** — 중요한 사실을 RAG 로 저장·검색 (사실상 무한 기억)

### 다음 강 — 중2-04 실연동 + HITL
이제 에이전트가 **실제로 행동**하게 — 그리고 위험은 **사람이 승인**:
- 외부 API/==MCP== 도구 소비 · ==Human-in-the-loop== 승인 게이트`,
    },
  ],

  quiz: {
    title: "중2-03 — 메모리 & 컨텍스트 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "슬라이딩 윈도우 전략에서 보통 항상 유지하는 것은?",
        options: ["가장 오래된 대화", "system 메시지(역할·규칙)", "임베딩", "토큰 카운터"],
        correctIndex: 1,
        explanation: "최근 N턴만 남기되 system(역할·규칙)은 항상 유지한다. 잊으면 에이전트가 정체성을 잃기 때문.",
      },
      {
        type: "multiple-choice",
        question: "대화 요약(summary) 전략의 이점은?",
        options: [
          "토큰을 무한히 쓸 수 있다",
          "오래된 맥락을 한 단락으로 압축해 토큰을 아끼면서 핵심 사실을 보존한다",
          "임베딩이 필요 없어진다",
          "모델이 더 커진다",
        ],
        correctIndex: 1,
        explanation: "윈도우 밖 대화를 버리지 않고 요약해 system 옆에 두면, 토큰은 절약하면서 이름·취향·제약 같은 핵심을 잊지 않는다.",
      },
      {
        type: "multiple-choice",
        question: "에이전트의 '장기 메모리' 를 사실상 무한히 만드는 방법은?",
        options: [
          "윈도우를 무한대로 늘린다",
          "중요한 사실을 트윈(VectorStore)에 저장하고 필요할 때 검색해 불러온다",
          "모든 대화를 system 에 넣는다",
          "요약을 하지 않는다",
        ],
        correctIndex: 1,
        explanation: "단기(윈도우/요약) + 장기(트윈 RAG)를 결합하면, 필요한 기억만 검색해 컨텍스트에 넣으므로 사실상 무한 기억이 된다.",
      },
    ],
  } satisfies Quiz,
};
