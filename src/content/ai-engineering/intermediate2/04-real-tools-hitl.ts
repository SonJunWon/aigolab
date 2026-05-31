import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson04: Lesson = {
  id: "ai-eng-m2-04-real-tools-hitl",
  language: "ai-engineering",
  track: "intermediate2",
  order: 4,
  title: "실제 도구 연동 + Human-in-the-loop",
  subtitle: "에이전트가 실제로 행동하되, 위험한 일은 사람이 승인 (+ MCP 소비)",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🤝 실연동 + Human-in-the-loop

> 💡 보라색 점선 밑줄 = 전문 용어.

지금까지 도구는 **mock**(가짜)이었어요. 실제 도구는 **세상을 바꿉니다** — 메일을 보내고, 결제하고, 데이터를 지우죠.
그래서 위험한 행동은 **사람이 승인**한 뒤에만 실행해야 합니다 = ==Human-in-the-loop(HITL)==.

### 이 강에서
- 입문 6강의 "초안만, 전송은 사람" 원칙을 **승인 게이트**로 실제 구현
- 외부 API / ==MCP== 도구를 에이전트가 **소비**하는 패턴 (개념 + 의사코드)
- 안전: 읽기/쓰기 권한 분리, 위험 행동 차단`,
    },

    {
      type: "markdown",
      source: `## 🚦 HITL 승인 게이트

도구를 **읽기(read)** 와 **쓰기/행동(write)** 으로 나눕니다.
- **읽기**(조회·검색): 자동 실행 OK
- **쓰기**(전송·결제·삭제): **바로 실행하지 말고** "승인 대기" 상태를 반환 → 사람이 OK 하면 그때 실행

\`\`\`
에이전트: sendEmail 호출하려 함
   ↓
게이트: "실행 전 승인 필요" → 초안을 사람에게 보여줌
   ↓
사람: ✅ 승인  → 실제 전송
      ❌ 거절  → 중단
\`\`\``,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// HITL — 위험 행동(sendEmail)은 즉시 실행하지 않고 '승인 대기' 반환
// (데모: 승인은 변수로 시뮬레이션. 실제론 UI 버튼/사람 입력)

const outbox: string[] = [];           // 실제로 '보낸' 메일함
let humanApproved = false;             // ← 사람의 승인 (UI 버튼이라 가정)

const sendEmail = {
  name: "sendEmail",
  description: "이메일을 전송한다. (위험 행동 — 승인 필요)",
  parameters: {
    type: "object",
    properties: { to: { type: "string" }, subject: { type: "string" }, body: { type: "string" } },
    required: ["to", "subject", "body"],
  },
  execute: async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
    const draft = \`To: \${to}\\nSubject: \${subject}\\n\\n\${body}\`;
    if (!humanApproved) {
      // 🚦 승인 게이트 — 실제 전송 대신 '대기' 반환
      return { status: "pending_approval", draft, note: "사람의 승인이 필요합니다. 전송하지 않았습니다." };
    }
    outbox.push(draft);  // 승인된 경우에만 실제 행동
    return { status: "sent", to };
  },
};

// 1차 시도 — 승인 전
const r1 = await chatWithTools(
  { provider: "gemini",
    messages: [
      { role: "system", content: "사용자 요청대로 sendEmail 을 호출해. 결과 status 가 pending_approval 이면 사용자에게 초안을 보여주고 승인을 요청해." },
      { role: "user", content: "팀장님(boss@co.com)께 '내일 연차' 메일 보내줘" }],
    tools: [sendEmail], toolChoice: "any" },
  { onStep: (s) => console.log("🔧", s.call.name, "→", (s.result as any).status) },
);
console.log("💬 [승인 전]", r1.text.trim());
console.log("📭 실제 발송함 크기:", outbox.length, "(0이어야 정상 — 아직 안 보냄)");

// 사람이 ✅ 승인했다고 가정 → 재실행
humanApproved = true;
const r2 = await chatWithTools(
  { provider: "gemini",
    messages: [
      { role: "system", content: "승인되었다. sendEmail 을 호출해 전송하고 결과를 알려." },
      { role: "user", content: "방금 그 메일 전송 승인할게" }],
    tools: [sendEmail], toolChoice: "any" },
  {},
);
console.log("\\n💬 [승인 후]", r2.text.trim());
console.log("📬 실제 발송함 크기:", outbox.length, "(1이어야 정상 — 승인 후 전송)");`,
      hints: [
        "핵심: 위험 도구는 승인 전엔 'pending_approval' 만 반환하고 절대 실제 행동을 하지 않음.",
        "humanApproved 는 데모용 변수 — 실제론 UI 의 '승인' 버튼 클릭이나 별도 확인 단계.",
        "읽기 도구(조회)는 게이트 없이 자동, 쓰기 도구만 게이트 — 권한을 성격별로 나누세요.",
      ],
    },

    {
      type: "markdown",
      source: `## 🔌 MCP 도구 소비 (개념 + 의사코드)

지금 도구는 우리가 코드로 직접 정의했어요. 실무에선 ==MCP==(Model Context Protocol) 서버가 제공하는
**표준 도구**를 소비하는 경우가 많습니다 — 노션·깃허브·슬랙·구글 드라이브 등.

\`\`\`ts
// 의사코드 — MCP 클라이언트로 서버의 도구를 가져와 에이전트에 연결
const mcp = await connectMCP("https://mcp.notion.com");   // OAuth
const mcpTools = await mcp.listTools();                   // 서버가 제공하는 도구 목록
//  → 각 도구를 우리 ToolDefinition 형태로 변환해 chatWithTools(tools)에 합침
const tools = mcpTools.map(toToolDefinition);
await chatWithTools({ provider:"gemini", messages, tools }, { onStep });
\`\`\`

> 핵심: **도구의 출처가 내 코드든 MCP 서버든, 에이전트 입장에선 똑같이 "호출 가능한 도구"**.
> MCP 는 그 도구를 **표준 규격으로 외부에서 가져오는** 방법일 뿐입니다.
> (브라우저 노트북에선 실제 MCP 연결 대신 개념으로 다룹니다 — 자세한 건 MCP 특별강의.)

### MCP 도구 소비 시 안전
- 외부 도구도 **읽기/쓰기 구분 + 쓰기는 HITL**
- 권한 ==스코핑== (필요한 도구만), 토큰은 서버에 (클라 노출 금지)
- 외부에서 읽어온 콘텐츠 속 "지시문" 을 믿지 말 것 (==프롬프트 인젝션== — 중2-06)`,
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 삭제 도구에 승인 게이트

\`deleteFile\` 은 위험 행동입니다. 승인 전엔 **실제로 지우지 말고** "승인 대기" 를 반환하도록 게이트를 넣으세요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const files = ["a.txt", "b.txt", "secret.txt"];
let approved = false;

// 🎯 TODO: 승인 전이면 실제 삭제 대신 pending_approval 반환
const deleteFile = {
  name: "deleteFile",
  description: "파일을 삭제한다. (위험 — 승인 필요)",
  parameters: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
  execute: async ({ name }: { name: string }) => {
    // TODO: if (!approved) return { status:"pending_approval", target:name, note:"승인 필요, 삭제 안 함" };
    const i = files.indexOf(name);
    if (i >= 0) files.splice(i, 1);
    return { status: "deleted", name };
  },
};

const r1 = await chatWithTools(
  { provider: "gemini",
    messages: [
      { role: "system", content: "deleteFile 을 호출해. pending_approval 이면 사용자에게 승인을 요청해." },
      { role: "user", content: "secret.txt 지워줘" }],
    tools: [deleteFile], toolChoice: "any" },
  { onStep: (s) => console.log("🔧", s.call.name, "→", (s.result as any).status) },
);
console.log("💬", r1.text.trim());
console.log("남은 파일:", files, "→ secret.txt 가 아직 있어야 정상(승인 전).");`,
      hints: [
        "execute 맨 앞에 if (!approved) return { status:'pending_approval', target:name, note:'승인 필요' };",
        "승인 전에는 files 배열이 그대로여야 합니다(실제 삭제 금지).",
        "approved=true 로 바꿔 재실행하면 실제 삭제됨 — 읽기/쓰기 권한 분리의 핵심.",
      ],
      solution: `const files = ["a.txt", "b.txt", "secret.txt"];
let approved = false;

const deleteFile = {
  name: "deleteFile",
  description: "파일을 삭제한다. (위험 — 승인 필요)",
  parameters: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
  execute: async ({ name }: { name: string }) => {
    if (!approved) return { status: "pending_approval", target: name, note: "승인 필요, 삭제하지 않음" };
    const i = files.indexOf(name);
    if (i >= 0) files.splice(i, 1);
    return { status: "deleted", name };
  },
};

const r1 = await chatWithTools(
  { provider: "gemini",
    messages: [
      { role: "system", content: "deleteFile 을 호출해. pending_approval 이면 사용자에게 승인을 요청해." },
      { role: "user", content: "secret.txt 지워줘" }],
    tools: [deleteFile], toolChoice: "any" },
  { onStep: (s) => console.log("🔧", s.call.name, "→", (s.result as any).status) },
);
console.log("💬", r1.text.trim());
console.log("남은 파일:", files);`,
    },

    {
      type: "markdown",
      source: `## 🧭 중2-04 정리

- ✅ ==HITL== — 위험(쓰기) 행동은 즉시 실행 금지, **승인 대기 반환 → 사람 승인 후 실행**
- ✅ 도구를 **읽기/쓰기로 분리** — 읽기 자동, 쓰기 게이트
- ✅ ==MCP== 도구 소비 — 출처가 내 코드든 외부 서버든 에이전트엔 "호출 가능한 도구". 외부 도구도 HITL·스코핑·인젝션 방어

### 다음 강 — 중2-05 평가 & 관측
"잘 되는 것 같다" 가 아니라 **숫자로**:
- 평가셋으로 성공률 측정 · A/B 비교 · ==faithfulness== · 트레이싱`,
    },
  ],

  quiz: {
    title: "중2-04 — 실연동 & HITL 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "Human-in-the-loop(HITL) 승인 게이트가 꼭 필요한 도구는?",
        options: [
          "날씨 조회 같은 읽기 도구",
          "메일 전송·결제·삭제 같은 '세상을 바꾸는' 쓰기/행동 도구",
          "임베딩 생성",
          "토큰 카운트",
        ],
        correctIndex: 1,
        explanation: "읽기(조회)는 자동이어도 안전하지만, 전송·결제·삭제처럼 되돌리기 어려운 행동은 사람이 승인한 뒤에만 실행해야 한다.",
      },
      {
        type: "multiple-choice",
        question: "승인 게이트를 구현하는 핵심 방식은?",
        options: [
          "위험 도구를 아예 제거한다",
          "승인 전에는 실제 행동 대신 'pending_approval' 같은 대기 상태를 반환하고, 승인 후에만 실행한다",
          "temperature 를 0 으로 둔다",
          "모든 도구를 병렬 실행한다",
        ],
        correctIndex: 1,
        explanation: "execute 가 승인 전엔 행동하지 않고 초안/대기 상태를 반환 → 사람이 확인·승인하면 그때 실제 실행. 입문 6강 '초안만' 원칙의 구현.",
      },
      {
        type: "multiple-choice",
        question: "MCP 도구 소비에 대한 설명으로 옳은 것은?",
        options: [
          "MCP 도구는 보안 게이트가 필요 없다",
          "도구 출처가 내 코드든 MCP 서버든 에이전트엔 동일한 '호출 가능한 도구'이며, 외부 도구도 읽기/쓰기 분리·HITL·인젝션 방어가 필요하다",
          "MCP 는 임베딩 전용 프로토콜이다",
          "MCP 도구는 항상 자동 실행해도 된다",
        ],
        correctIndex: 1,
        explanation: "MCP 는 표준 규격으로 외부 도구를 가져오는 방법. 에이전트 입장에선 일반 도구와 같고, 외려 외부라서 권한 스코핑·HITL·프롬프트 인젝션 방어가 더 중요하다.",
      },
    ],
  } satisfies Quiz,
};
