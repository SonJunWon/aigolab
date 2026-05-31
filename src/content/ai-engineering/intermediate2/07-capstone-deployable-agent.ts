import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson07: Lesson = {
  id: "ai-eng-m2-07-capstone-deployable-agent",
  language: "ai-engineering",
  track: "intermediate2",
  order: 7,
  title: "Capstone — 배포형 에이전트",
  subtitle: "지식 트윈 검색 + 행동 도구 + HITL + 관측을 하나로",
  estimatedMinutes: 60,
  cells: [
    {
      type: "markdown",
      source: `# 🏗️ Capstone — 배포형 에이전트

> 💡 보라색 점선 밑줄 = 전문 용어.

중급2 의 모든 것을 묶습니다. 트윈에서 **알고(검색)**, 도구로 **행동하되(HITL)**, 과정을 **관측**하는 에이전트.

### 통합 기술 스택
| 능력 | 기술 | 강 |
|---|---|---|
| 안다 | ==트윈== 검색 도구(RAG) | 중급1 + 중2-04 |
| 한다 | 행동 도구 + ==HITL== 승인 게이트 | 중2-04 |
| 조율 | 견고한 루프 + onStep | 중2-01 |
| 견딘다 | 메모리(필요 시) | 중2-03 |
| 측정 | 평가셋·트레이싱 | 중2-05 |
| 운영 | 캐싱·보안 | 중2-06 |`,
    },

    {
      type: "markdown",
      source: `## 🗺️ 아키텍처

\`\`\`
사용자 ──▶ 에이전트(chatWithTools)
              ├─ 🔍 searchKB     (읽기) 트윈에서 근거 검색 → 자동
              ├─ 🎫 createTicket (쓰기) 문의 티켓 생성 → HITL 승인 게이트
              └─ onStep 으로 모든 행동 관측
\`\`\`

읽기 도구(트윈 검색)는 자동, 쓰기 도구(티켓 생성)는 **승인 후에만**. 아래가 참조 구현입니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 📦 배포형 에이전트 — 트윈 검색(읽기) + 티켓 생성(쓰기, HITL) + 관측

// ── 지식 트윈 (중급1) ──
const kb = new VectorStore();
async function seedKB() {
  const docs = [
    "환불은 구매 후 14일 이내 신청할 수 있다.",
    "환불 승인 시 배송비는 고객이 부담한다.",
    "디지털 상품은 환불되지 않는다.",
  ];
  const vecs = await embed(docs);
  kb.add(docs.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] })));
}
await seedKB();

// ── 행동 상태 (HITL) ──
const tickets: string[] = [];
let approved = false;   // 사람의 승인 (UI 버튼 가정)

// 🔍 읽기 도구 — 트윈 검색 (자동)
const searchKB = {
  name: "searchKB",
  description: "회사 정책 지식베이스에서 질문 관련 근거를 검색한다.",
  parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  execute: async ({ query }: { query: string }) => {
    const [qv] = await embed([query]);
    const hits = kb.search(qv, 2);
    return { results: hits.map((h, i) => ({ n: i + 1, text: h.text, score: Number(h.score.toFixed(3)) })) };
  },
};

// 🎫 쓰기 도구 — 티켓 생성 (HITL 게이트)
const createTicket = {
  name: "createTicket",
  description: "해결 못 한 문의를 상담 티켓으로 생성한다. (위험 행동 — 승인 필요)",
  parameters: { type: "object", properties: { summary: { type: "string" } }, required: ["summary"] },
  execute: async ({ summary }: { summary: string }) => {
    if (!approved) return { status: "pending_approval", summary, note: "승인 필요, 생성 안 함" };
    tickets.push(summary);
    return { status: "created", id: tickets.length };
  },
};

async function run(userMsg: string) {
  const res = await chatWithTools(
    { provider: "gemini",
      messages: [
        { role: "system", content: "고객지원 에이전트. 먼저 searchKB 로 근거를 찾아 [N] 인용과 함께 답해. 근거로 답할 수 없으면 createTicket 으로 티켓 생성을 시도(승인 필요)." },
        { role: "user", content: userMsg }],
      tools: [searchKB, createTicket], toolChoice: "auto" },
    { maxIterations: 6, onStep: (s) => console.log(\`🔧 [\${s.iteration}] \${s.call.name} → \${JSON.stringify(s.result).slice(0, 70)}\`) },
  );
  console.log("💬", res.text.trim(), "\\n");
}

console.log("=== Q1: 근거로 답 가능 ===");
await run("환불은 며칠 이내에 신청해?");
console.log("=== Q2: 근거 밖 → 티켓 시도(승인 전이라 대기) ===");
await run("해외 직배송 환불 절차가 궁금해");
console.log("티켓함:", tickets.length, "(0 — 승인 전이라 생성 안 됨)");`,
      hints: [
        "searchKB(읽기)는 자동, createTicket(쓰기)는 승인 전 pending_approval — 권한 성격 분리(중2-04).",
        "toolChoice:'auto' 로 에이전트가 상황에 따라 검색/티켓을 스스로 선택합니다.",
        "onStep 으로 어떤 도구를 어떤 순서로 썼는지 관측(중2-05). 근거 인용은 중급1 06강 패턴.",
      ],
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 나만의 배포형 에이전트

참조 구현을 바탕으로 **여러분 도메인**의 에이전트를 만드세요.

### 요구사항
1. **읽기 도구** 1개 — 내 도메인 트윈 검색(seedKB 를 내 문서로)
2. **쓰기 도구** 1개 — 위험 행동에 **HITL 승인 게이트**(승인 전 pending_approval)
3. \`onStep\` 으로 행동 **관측** 로그
4. 근거로 답 가능한 질문 + 근거 밖(→ 쓰기 도구 시도) 질문 둘 다 테스트

### 보너스
- 중2-05 평가셋으로 성공률 측정 / 중2-06 캐싱 적용`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 🎯 TODO: 참조 구현을 내 도메인으로 채우세요.
const kb = new VectorStore();
async function seedKB() {
  // TODO: 내 도메인 문서로 교체
  const docs = ["내 도메인 사실 1.", "내 도메인 사실 2.", "내 도메인 사실 3."];
  const vecs = await embed(docs);
  kb.add(docs.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] })));
}
await seedKB();

const actions: string[] = [];
let approved = false;

const searchKB = {
  name: "searchKB", description: "지식베이스에서 근거 검색",
  parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  execute: async ({ query }: { query: string }) => {
    const [qv] = await embed([query]);
    return { results: kb.search(qv, 2).map((h, i) => ({ n: i + 1, text: h.text })) };
  },
};

// TODO: 위험 쓰기 도구 + HITL 게이트 (createTicket 참고)

async function run(msg: string) {
  const res = await chatWithTools(
    { provider: "gemini",
      messages: [
        { role: "system", content: "먼저 searchKB 로 근거를 찾아 답해. 근거 밖이면 쓰기 도구 시도(승인 필요)." },
        { role: "user", content: msg }],
      tools: [searchKB /* TODO: , 쓰기도구 */], toolChoice: "auto" },
    { onStep: (s) => console.log("🔧", s.call.name, "→", JSON.stringify(s.result).slice(0, 60)) },
  );
  console.log("💬", res.text.trim());
}
await run("내 도메인 사실 1에 대해 알려줘");`,
      hints: [
        "쓰기 도구 execute 첫 줄: if (!approved) return { status:'pending_approval', ... };",
        "tools 배열에 쓰기 도구를 추가하고, 근거 밖 질문으로 테스트하세요.",
        "seedKB 의 docs 를 진짜 내 도메인 문장으로 바꿔야 검색이 의미 있어집니다.",
      ],
      solution: `const kb = new VectorStore();
async function seedKB() {
  const docs = [
    "우리 카페는 매일 오전 8시에 문을 연다.",
    "원두는 에티오피아·콜롬비아 두 종을 쓴다.",
    "테이크아웃은 500원 할인된다.",
  ];
  const vecs = await embed(docs);
  kb.add(docs.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] })));
}
await seedKB();

const actions: string[] = [];
let approved = false;

const searchKB = {
  name: "searchKB", description: "카페 정보 지식베이스에서 근거 검색",
  parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  execute: async ({ query }: { query: string }) => {
    const [qv] = await embed([query]);
    return { results: kb.search(qv, 2).map((h, i) => ({ n: i + 1, text: h.text })) };
  },
};

const fileComplaint = {
  name: "fileComplaint", description: "해결 못 한 문의를 컴플레인으로 접수(위험 — 승인 필요)",
  parameters: { type: "object", properties: { summary: { type: "string" } }, required: ["summary"] },
  execute: async ({ summary }: { summary: string }) => {
    if (!approved) return { status: "pending_approval", summary, note: "승인 필요" };
    actions.push(summary);
    return { status: "filed", id: actions.length };
  },
};

async function run(msg: string) {
  const res = await chatWithTools(
    { provider: "gemini",
      messages: [
        { role: "system", content: "카페 지원 에이전트. 먼저 searchKB 로 근거를 찾아 답해. 근거 밖이면 fileComplaint 시도(승인 필요)." },
        { role: "user", content: msg }],
      tools: [searchKB, fileComplaint], toolChoice: "auto" },
    { onStep: (s) => console.log("🔧", s.call.name, "→", JSON.stringify(s.result).slice(0, 60)) },
  );
  console.log("💬", res.text.trim(), "\\n");
}

await run("몇 시에 열어요?");                 // 근거로 답
await run("주차장 있어요?");                  // 근거 밖 → 컴플레인 시도(대기)
console.log("접수함:", actions.length, "(승인 전 0)");`,
    },

    {
      type: "markdown",
      source: `## 🎓 중급2 수료 — 트랙 완성

이제 여러분은 **지식 트윈에 손발을 단 프로덕션 에이전트**를 만들 수 있습니다:
- ✅ 견고한 단일 에이전트(에러·재시도·관측) — 중2-01
- ✅ 오케스트레이션(router·병렬·supervisor) — 중2-02
- ✅ 메모리·컨텍스트 관리(윈도우·요약·장기 트윈) — 중2-03
- ✅ 실연동 + ==HITL== 승인 게이트 + ==MCP== 소비 — 중2-04
- ✅ 평가·관측(평가셋·faithfulness·트레이싱) — 중2-05
- ✅ 비용·속도·보안(라우팅·캐싱·인젝션 방어) — 중2-06
- ✅ 이 모두를 묶은 **배포형 에이전트** — Capstone

### 🎉 AI 엔지니어링 트랙 전체 여정
\`\`\`
입문자 12강 (기본기)
  → 중급1 8강 (지식 트윈을 짓다 — "안다")
  → 중급2 7강 (트윈에 손발을 달다 — "한다")
  → 바이브코딩 워크샵 (배포형 앱 실전)
\`\`\`

> 다음 단계: **==MCP 특별강의==** 로 트윈·도구를 외부와 표준 연결하거나,
> **바이브코딩 워크샵** 에서 배운 에이전트를 실제 제품으로 배포해 보세요.
> 트윈은 "안다", 에이전트는 "한다" — 이제 여러분은 **둘 다 만드는 쪽**에 섰습니다.`,
    },
  ],

  quiz: {
    title: "중2-Capstone — 통합 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "이 Capstone 에이전트에서 searchKB(읽기)와 createTicket(쓰기)을 다르게 다루는 이유는?",
        options: [
          "읽기가 더 비싸서",
          "쓰기는 세상을 바꾸는 위험 행동이라 HITL 승인 게이트가 필요하고, 읽기는 자동이어도 안전해서",
          "읽기는 임베딩이 필요 없어서",
          "둘은 사실 같다",
        ],
        correctIndex: 1,
        explanation: "권한을 성격별로 분리 — 조회(읽기)는 자동, 티켓 생성·전송·삭제(쓰기)는 승인 후에만(중2-04). 인젝션이 성공해도 위험 행동은 게이트로 막힌다.",
      },
      {
        type: "multiple-choice",
        question: "AI 엔지니어링 트랙 전체에서 '트윈' 과 '에이전트' 의 관계를 한 줄로 하면?",
        options: [
          "둘은 무관하다",
          "트윈은 '안다'(지식·검색), 에이전트는 '한다'(도구·행동) — 에이전트가 트윈을 지식 소스로 삼는다",
          "에이전트가 트윈을 대체한다",
          "트윈이 에이전트를 훈련시킨다",
        ],
        correctIndex: 1,
        explanation: "중급1(트윈)은 지식을, 중급2(에이전트)는 행동을 담당. 에이전트는 searchKB 같은 도구로 트윈에서 알고, 행동 도구로 한다.",
      },
      {
        type: "multiple-choice",
        question: "Capstone 에이전트를 프로덕션에 올릴 때 함께 갖춰야 할 것으로 거리가 먼 것은?",
        options: [
          "평가셋으로 품질 측정(중2-05)",
          "캐싱·키 보안·인젝션 방어(중2-06)",
          "onStep 트레이싱으로 관측(중2-01·05)",
          "temperature 를 항상 2.0 으로 고정",
        ],
        correctIndex: 3,
        explanation: "프로덕션엔 평가·관측·비용·보안이 함께 필요하다. temperature 2.0 고정은 출력을 불안정하게 만들 뿐 운영 요건과 무관하다.",
      },
    ],
  } satisfies Quiz,
};
