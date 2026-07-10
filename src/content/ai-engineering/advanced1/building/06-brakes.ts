import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급1 시리즈C(하네스 만들기) 06강 — 브레이크 설계.
 * 권한 모드 상태기계 + 위험 작업 분류기 + 승인 관문(HITL)을 루프에 심는다.
 */
export const lessonC06: Lesson = {
  id: "ai-eng-a1-c06-brakes",
  language: "ai-engineering",
  track: "advanced1",
  order: 26,
  title: "C6. 브레이크 설계 — 샌드박스·권한·HITL",
  subtitle: "'하지 말라고 말했다'를 '할 수 없게 만들었다'로 — 안전의 구조화",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🛡️ 고급1·C6강. 브레이크 설계
### — 샌드박스 · 권한 · HITL

⏱️ 50분 · 🧰 API 키 · 🗺️ 구현 대상: **⑤ 가드레일** · 선수: C1, C2

> 💡 A5의 선언 — 안전은 부탁(지침)이 아니라 **구조(몸)** 에 심는다. 오늘 그 구조를 짭니다.
> 3중 브레이크: ① **도구 미지급**(애초에 손이 없음) ② **권한 상태기계**(모드별로 할 수 있는 일이 다름) ③ **승인 관문**(빨간불 작업은 사람을 기다림 — ==HITL==).

### 이 강에서
- 권한 모드(readonly / approve / auto)를 **루프의 구조**로 구현
- 위험 작업 분류기 — 규칙 기반 1차 + 애매하면 LLM 2차
- 승인 대기를 '실패'가 아니라 '결과'로 반환하는 PENDING 패턴`,
    },
    {
      type: "markdown",
      source: `## 🚦 설계도 — 브레이크는 어디에 다나

C1 루프에서 도구 실행 직전, 단 한 곳입니다:

\`\`\`
res = chat(messages, tools)
for (call of res.toolCalls):
    verdict = 게이트(call, mode)          // ← 여기. 유일한 관문.
    if (verdict === "deny")    result = { error: "이 모드에서 금지된 작업" }
    if (verdict === "pending") result = { pending: "사람의 승인 대기 중" }
    if (verdict === "allow")   result = await tool.execute(call.args)
    messages.push(tool result)
\`\`\`

포인트: deny 도 pending 도 **throw 가 아니라 결과**입니다(C2의 원칙). 모델은 '거부됐구나 → 다른 방법을 찾거나 사용자에게 안내'로 **루프를 계속** 돌 수 있어요. 브레이크는 차를 세우는 장치지, 엔진을 부수는 장치가 아닙니다.

도구에는 위험 표식을 달아둡니다 — B3의 '쓰기 도구에 별표'를 타입으로:
\`\`\`ts
{ name, description, parameters, execute,
  risk: "read" | "write" | "irreversible" }   // ← 하네스만 보는 메타데이터 (모델은 안 봄)
\`\`\``,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 권한 상태기계 + 승인 관문이 달린 루프 ──
type Risk = "read" | "write" | "irreversible";
type Mode = "readonly" | "approve" | "auto";

// 모드 × 위험도 → 판정 테이블. 코드 몇 줄이지만 이게 A5·B5 전체의 구조화다.
function gate(risk: Risk, mode: Mode): "allow" | "pending" | "deny" {
  if (mode === "readonly") return risk === "read" ? "allow" : "deny";
  if (mode === "approve")  return risk === "read" ? "allow" : "pending";
  /* auto */               return risk === "irreversible" ? "pending" : "allow";
  // auto 모드조차 비가역은 사람을 기다린다 — 빨간불 3원칙의 마지막 보루
}

const tools = [
  { name: "search_docs", description: "사내 문서 검색", risk: "read" as Risk,
    parameters: { type: "object", properties: { q: { type: "string" } }, required: ["q"] },
    execute: async ({ q }: any) => ({ found: [\`'\${q}' 관련 문서 3건\`] }) },
  { name: "update_doc", description: "문서 내용 수정", risk: "write" as Risk,
    parameters: { type: "object", properties: { id: { type: "string" }, content: { type: "string" } }, required: ["id", "content"] },
    execute: async ({ id }: any) => ({ ok: true, id }) },
  { name: "delete_doc", description: "문서 영구 삭제. 복구 불가.", risk: "irreversible" as Risk,
    parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    execute: async ({ id }: any) => ({ deleted: id }) },
];

const approvalQueue: any[] = [];   // 승인 대기함 — 실전에선 UI/알림으로 사람에게 감

async function runGatedAgent(goal: string, mode: Mode, maxTurns = 5) {
  const messages: any[] = [
    { role: "system", content: \`너는 문서 관리 에이전트다. 현재 권한 모드: \${mode}.
작업이 거부되거나 승인 대기가 되면, 우기지 말고 상황을 사용자에게 정리해 보고하라.\` },
    { role: "user", content: goal },
  ];
  for (let t = 0; t < maxTurns; t++) {
    const res = await chat({ provider: "gemini", messages, tools });
    if (!res.toolCalls?.length) return res.text;
    messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      const tool = tools.find((x) => x.name === call.name)!;
      const verdict = gate(tool.risk, mode);
      let result: any;
      if (verdict === "deny") result = { error: \`권한 거부: \${mode} 모드에서 \${tool.risk} 작업 불가\` };
      else if (verdict === "pending") {
        approvalQueue.push({ tool: call.name, args: call.args });
        result = { pending: "사람의 승인 대기에 등록됨. 승인 전에는 실행되지 않는다." };
      } else result = await tool.execute(call.args as any);
      console.log(\`\${verdict === "allow" ? "🟢" : verdict === "pending" ? "🟡" : "🔴"} \${call.name} → \${JSON.stringify(result).slice(0, 80)}\`);
      messages.push({ role: "tool", content: JSON.stringify(result), toolCallId: call.id });
    }
  }
  return "(최대 턴 도달)";
}

// 같은 부탁, 두 모드 — 몸의 구조가 행동을 어떻게 바꾸나
for (const mode of ["readonly", "approve"] as Mode[]) {
  console.log(\`\\n===== mode: \${mode} =====\`);
  const answer = await runGatedAgent("오래된 계약서 문서를 찾아서 '만료' 표시로 수정해줘.", mode);
  console.log("💬", (answer ?? "").slice(0, 150));
}
console.log("\\n🗂️ 승인 대기함:", JSON.stringify(approvalQueue));
console.log("👉 approve 모드에서 검색(read)은 즉시, 수정(write)은 대기함으로 갔는지 확인.");
console.log("   그리고 에이전트가 '대기 중'을 사용자에게 정직하게 보고하는지 — 브레이크 밟혀도 루프는 산다.");`,
      hints: [
        "gate() 판정 테이블이 B5 '권한 정책 1장'의 코드화 — 정책 문서와 코드가 1:1 대응하는 게 좋은 하네스예요.",
        "risk 필드를 모델에게 안 보여주는 이유: 모델이 '이건 read 라고 우기면 되는구나'를 배우면 안 되니까. 판정 근거는 하네스 소유.",
        "auto 모드에서도 irreversible 은 pending — 신뢰가 쌓여도 마지막 빨간불은 남겨둡니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 🕵️ 애매한 작업 — 2단 분류기

risk 라벨은 도구 단위인데, 위험은 **인자에서** 올 때가 있어요. \`update_doc\` 은 write 지만, content 가 "전체 삭제"라면? \`run_command\` 도구라면 명령어에 따라 read 도 irreversible 도 됩니다.

> **2단 분류 패턴**
> 1차 — **규칙 기반** (빠르고 결정적): 도구의 risk 라벨 + 인자 패턴 검사 (\`rm|delete|drop|--force\` 등 위험 패턴 → 즉시 승격)
> 2차 — **LLM 판정** (애매할 때만): "이 도구 호출이 되돌릴 수 없거나 외부로 나가거나 돈이 움직이는 일인가?"를 구조화 출력으로
>
> 순서가 중요합니다. **규칙이 먼저** — 결정적 규칙으로 잡을 수 있는 걸 LLM에 맡기면 느리고 비싸고 확률적이에요. LLM은 규칙의 그물을 빠져나간 애매함 전담.

그리고 샌드박스: 브라우저 실습에선 흉내만 내지만, 실전 격리의 3요소는 기억해두세요 — **작업 디렉토리 제한**(경로 탈출 차단), **타임아웃**(무한 실행 차단), **네트워크 허용목록**(데이터 유출 차단). 전부 '모델을 설득'이 아니라 '물리적으로 불가능'을 만드는 장치입니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 2단 분류기: 규칙 먼저, LLM은 애매함 전담 ──
function ruleClassify(name: string, args: any): "read" | "write" | "irreversible" | "unclear" {
  const s = \`\${name} \${JSON.stringify(args)}\`.toLowerCase();
  if (/(delete|remove|drop|rm |--force|destroy)/.test(s)) return "irreversible";
  if (/^(get_|search_|read_|list_|fetch_)/.test(name)) return "read";
  if (/^(update_|write_|create_|send_)/.test(name)) return "write";
  return "unclear";
}

async function llmClassify(name: string, args: any) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "도구 호출의 위험도를 판정하라. irreversible=되돌릴 수 없음/외부 발신/금전, write=내부 상태 변경, read=조회만." },
      { role: "user", content: \`도구: \${name}\\n인자: \${JSON.stringify(args)}\` },
    ],
    responseSchema: {
      type: "object",
      properties: {
        risk: { type: "string", enum: ["read", "write", "irreversible"] },
        reason: { type: "string" },
      },
      required: ["risk", "reason"],
    },
  });
  return res.json as { risk: string; reason: string };
}

const calls = [
  { name: "search_docs", args: { q: "계약서" } },
  { name: "update_doc", args: { id: "d1", content: "전체 내용을 비우고 삭제 예정 표시" } },  // write 탈을 쓴 위험
  { name: "run_command", args: { cmd: "git status" } },
  { name: "run_command", args: { cmd: "rm -rf ./backup" } },
];

for (const c of calls) {
  const rule = ruleClassify(c.name, c.args);
  if (rule !== "unclear") { console.log(\`⚡ 규칙: \${c.name}(\${JSON.stringify(c.args).slice(0,40)}) → \${rule}\`); continue; }
  const llm = await llmClassify(c.name, c.args);
  console.log(\`🤖 LLM: \${c.name}(\${JSON.stringify(c.args).slice(0,40)}) → \${llm.risk} (\${llm.reason})\`);
}
console.log("\\n👉 'git status' 와 'rm -rf' 가 규칙에서 갈리고, '탈을 쓴 write' 같은 애매함만 LLM으로 갔는지 확인.");
console.log("   분류기 결과를 C6 gate() 에 연결하면 — 인자 수준까지 보는 브레이크 완성.");`,
      hints: [
        "규칙 패턴은 보수적으로 — 오탐(과잉 승격)은 승인 한 번의 비용이지만, 미탐은 사고의 비용입니다.",
        "LLM 판정을 gate 에 연결할 때는 'LLM이 read 라고 해도 규칙이 irreversible 이면 규칙 우선' — 완화는 못 하고 승격만 가능하게.",
        "update_doc 사례처럼 위험이 인자에 숨는 것 — A6 환자 ③(실계정 삭제)이 바로 이 유형이었어요.",
      ],
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C6

1. **승인 후 재개**: approvalQueue 의 항목을 사람이 승인하면 해당 도구를 실행하고 그 결과로 대화를 이어가는 resume 흐름을 설계하라 (C8 직렬화와 만난다).
2. **인젝션 × 게이트**: C3의 오염된 도구 결과 실험에 gate 를 결합하라 — 인젝션이 '이 문서를 삭제하라'로 유도해도 pending 에서 멈추는가? 지침 방어가 뚫려도 구조 방어가 잡는 것을 확인.
3. **모드 자동 강등**: 도구 실패가 연속 3회면 auto → approve 로 스스로 강등하는 '신뢰 하락' 로직을 설계하라. 반대(자동 승격)는 왜 위험한가? (B5 승격 조건은 왜 사람이 정해야 하나)

> 🎯 **(전부 잊어도 이것만)**
> ## 브레이크 = **판정 테이블(모드×위험도) 하나를 도구 실행 직전에.** deny/pending 도 throw 가 아니라 결과다.
> 분류는 규칙 먼저, LLM은 애매함 전담(승격만 가능). 그리고 auto 모드에도 비가역의 빨간불은 남겨라 — 신뢰가 쌓여도 마지막 벨트는 풀지 않는다.

📎 **다음 강 — C7. 분신술**: 브레이크까지 달린 에이전트를 이제 **여러 개** 부립니다. 서브에이전트 스폰과 컨텍스트 격리 — 큰일을 쪼개서 책상 여러 개로.`,
    },
  ],

  quiz: {
    title: "고급1·C6강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "승인 관문(게이트)을 다는 올바른 위치는?",
        options: [
          "chat() 호출 직전 (모델이 생각하기 전에)",
          "도구 실행 직전 — toolCall 을 받고 execute 를 부르기 전 단 한 곳",
          "루프가 다 끝난 후",
        ],
        correctIndex: 1,
        explanation:
          "생각은 자유롭게, 행동은 관문을 통과해서. toolCall(요청서)과 execute(실행) 사이가 하네스가 개입할 유일하고 충분한 지점이에요.",
      },
      {
        type: "multiple-choice",
        question: "게이트에서 deny/pending 판정이 나면?",
        options: [
          "throw 해서 에이전트를 즉시 종료한다",
          "'거부됨/대기 중'을 결과로 되먹여 모델이 다음 행동(대안·보고)을 정하게 한다",
          "몰래 실행하고 로그만 남긴다",
        ],
        correctIndex: 1,
        explanation:
          "브레이크는 차를 세우지 엔진을 부수지 않아요. 거부도 관측 가능한 결과로 — 에이전트는 승인 대기를 사용자에게 정직하게 보고하며 살아있습니다.",
      },
      {
        type: "multiple-choice",
        question: "위험 분류에서 '규칙 먼저, LLM은 애매함 전담' 순서인 이유는?",
        options: [
          "LLM이 규칙보다 항상 부정확해서 아예 못 믿기 때문",
          "결정적 규칙으로 잡히는 것을 LLM에 맡기면 느리고 비싸고 확률적이기 때문 — LLM은 규칙의 그물을 빠져나간 것만",
          "규칙 코드가 더 짧아서",
        ],
        correctIndex: 1,
        explanation:
          "rm -rf 같은 명백한 위험은 정규식 한 줄로 0원에 확정 판정됩니다. LLM 판정은 '탈을 쓴 위험' 같은 애매함 전담이고, 완화가 아닌 승격만 허용해요.",
      },
    ],
  } satisfies Quiz,
};
