import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급1 시리즈C(하네스 만들기) 08강 — 살아있는 런타임.
 * 스트리밍, 인터럽트(협조적 중단), 상태 직렬화·재개(체크포인트).
 */
export const lessonC08: Lesson = {
  id: "ai-eng-a1-c08-living-runtime",
  language: "ai-engineering",
  track: "advanced1",
  order: 28,
  title: "C8. 살아있는 런타임 — 스트리밍·중단·재개",
  subtitle: "오래 도는 에이전트는 끊기고, 멈춰지고, 다시 이어져야 한다",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 💓 고급1·C8강. 살아있는 런타임
### — 스트리밍 · 중단 · 재개

⏱️ 45분 · 🧰 API 키 · 🗺️ 구현 대상: 루프의 런타임 공학 · 선수: C1, C6

> 💡 지금까지의 루프는 '한 번 돌리면 끝까지 달리는' 일회용이었어요. 실전 에이전트는 다릅니다 —
> 사용자가 지켜보고(스트리밍), 중간에 끼어들고(인터럽트), 브라우저가 닫혀도 이어져야(재개) 합니다.
> 오늘의 발견: 이 셋의 열쇠가 전부 같은 곳에 있습니다 — **messages 배열이 에이전트의 상태 전부**라는 사실.

### 이 강에서
- 스트리밍: 기다림을 관측으로 바꾸기
- 협조적 인터럽트: 루프의 '턴 경계'에서 안전하게 멈추기
- 체크포인트: messages 직렬화 → 저장 → 다른 세션에서 재개`,
    },
    {
      type: "markdown",
      source: `## 📡 스트리밍 — 기다림을 관측으로

30초 걸리는 에이전트가 무언(無言)이면 사용자는 '죽었나?' 합니다. B6에서 배운 '조용한 실패'의 사촌 — **조용한 진행**도 나쁜 UX예요. 해법 두 층:

1. **토큰 스트리밍**: \`chat({ stream: true, ... })\` — 최종 텍스트가 생성되는 대로 화면에. (이 플랫폼에선 stream 지정 시 셀 출력에 토큰이 흐릅니다. 최종 결과는 평소처럼 ChatResponse 로 resolve.)
2. **단계 스트리밍**: 루프가 턴마다 '지금 뭘 하는지'를 방출 — C1에서 이미 console.log 로 하고 있던 것을 **정식 이벤트 채널**로 승격:

\`\`\`ts
type AgentEvent =
  | { type: "turn_start"; turn: number }
  | { type: "tool_call"; name: string; args: unknown }
  | { type: "tool_result"; name: string; summary: string }
  | { type: "final"; text: string };
// 루프가 onEvent(e) 콜백을 호출 — UI든 로그든 알림이든 구독자가 알아서
\`\`\`

> 💡 이 이벤트 스트림이 C9 트레이스의 원재료이기도 합니다. **관측 가능한 루프**는 한 번 만들면 UX(스트리밍)·디버깅(로그)·평가(트레이스)를 전부 먹여 살려요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 협조적 인터럽트 + 이벤트 채널이 달린 루프 ──
// 핵심: 강제 kill 이 아니라 '턴 경계에서 정중히 멈춤' — 도구 실행 도중에 자르지 않는다.
const calc = {
  name: "calculator",
  description: "사칙연산. a,b,op(add/sub/mul/div)",
  parameters: { type: "object", properties: { a: { type: "number" }, b: { type: "number" }, op: { type: "string", enum: ["add","sub","mul","div"] } }, required: ["a","b","op"] },
  execute: async ({ a, b, op }: any) => {
    await new Promise((r) => setTimeout(r, 800));          // 느린 도구 시뮬레이션
    return { result: ({ add: a+b, sub: a-b, mul: a*b, div: b ? a/b : NaN } as any)[op] };
  },
};

type Ctl = { interrupted: boolean };

async function runInterruptibleAgent(goal: string, ctl: Ctl, onEvent: (e: any) => void, maxTurns = 6) {
  const messages: any[] = [
    { role: "system", content: "계산은 반드시 calculator 도구로 한 번에 하나씩 수행하는 에이전트다." },
    { role: "user", content: goal },
  ];
  for (let turn = 1; turn <= maxTurns; turn++) {
    // ── 인터럽트 검문소: 턴 경계에서만 확인 (협조적 중단) ──
    if (ctl.interrupted) {
      messages.push({ role: "user", content: "<system-reminder>사용자가 중단을 요청했다. 지금까지의 진행 상황을 2줄로 보고하고 종료하라.</system-reminder>" });
      const bye = await chat({ provider: "gemini", messages });   // 마지막 보고엔 tools 없음 (C1 연구노트 1의 답)
      onEvent({ type: "final", text: \`⏸️ 중단됨 — \${bye.text}\` });
      return { messages, done: false };
    }
    onEvent({ type: "turn_start", turn });
    const res = await chat({ provider: "gemini", messages, tools: [calc] });
    if (!res.toolCalls?.length) {
      onEvent({ type: "final", text: res.text ?? "" });
      return { messages, done: true };
    }
    messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      onEvent({ type: "tool_call", name: call.name, args: call.args });
      const result = await calc.execute(call.args as any);        // 실행 중엔 중단 안 함 — 원자성
      onEvent({ type: "tool_result", name: call.name, summary: JSON.stringify(result) });
      messages.push({ role: "tool", content: JSON.stringify(result), toolCallId: call.id });
    }
  }
  return { messages, done: false };
}

// 데모: 2.2초 후 사용자가 중단 버튼을 누른다
const ctl: Ctl = { interrupted: false };
setTimeout(() => { ctl.interrupted = true; console.log("🖱️ [사용자] 중단 버튼 클릭!"); }, 2200);

const { messages, done } = await runInterruptibleAgent(
  "12×7을 구하고, 그 결과에 33을 더하고, 다시 2로 나눠줘. 단계별로 하나씩.",
  ctl,
  (e) => console.log(\`  [\${e.type}]\`, e.turn ?? e.name ?? "", e.summary ?? e.text ?? ""),
);
console.log(\`\\n완주 여부: \${done} / 대화 길이: \${messages.length}개 메시지\`);
console.log("👉 중단 시점의 messages 를 버리지 않고 반환한 것에 주목 — 다음 셀에서 이걸로 '재개'한다.");`,
      hints: [
        "인터럽트 검문을 턴 경계에만 두는 이유: 도구 실행 도중 자르면 '절반만 실행된 쓰기 작업' 같은 원자성 깨짐이 생겨요.",
        "중단 시 마지막 보고를 시키는 것 — A2 '좋은 멈춤 ②(정직한 종료)'의 구현입니다.",
        "실전에선 ctl 대신 AbortController 를 쓰고, 진행 중인 chat() 호출 자체도 abort 신호를 받게 합니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 💾 체크포인트 — messages 가 상태의 전부라는 축복

에이전트를 '이어서 하기' 하려면 무엇을 저장해야 할까요? 놀랍게도 목록이 짧습니다:

\`\`\`ts
interface Checkpoint {
  messages: Message[];      // 대화 이력 = 뇌가 아는 전부
  mode: Mode;               // C6 권한 모드
  turnCount: number;        // 예산 회계 (C4)
  savedAt: string;
}
// 직렬화: JSON.stringify(checkpoint) → 파일/localStorage/DB 어디든
\`\`\`

모델 쪽에는 저장할 상태가 **없습니다** — 모델은 매 호출이 백지에서 시작하고, 모든 맥락은 messages 로 다시 주입되니까요(A4 책상의 법칙이 여기선 축복). 하네스 쪽 상태(모드·회계·승인 대기함)만 챙기면 끝.

주의 둘:
1. **도구 실행 '도중' 저장 금지** — 반쯤 실행된 도구는 재개 시 재실행돼 이중 실행 사고(C6의 비가역이면 재앙). 체크포인트도 턴 경계에서만.
2. **재개 ≠ 그냥 이어 달리기** — 시간이 흘렀다면 3층 동적 조각(C3)이 낡았어요. 재개 시 '중단 후 N시간 경과. 상황이 바뀌었을 수 있으니 전제를 재확인하라' 리마인더를 주입하는 게 정석.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 체크포인트 저장 → '브라우저 재시작' 시뮬레이션 → 재개 ──
// (앞 셀의 중단된 messages 가 있다고 가정하고, 여기선 자체 제작해 독립 실행 가능하게)
const CKPT_KEY = "a1c08-checkpoint";

// 1) 중단 시점의 체크포인트 저장 (턴 경계에서!)
const checkpoint = {
  messages: [
    { role: "system", content: "계산은 반드시 calculator 도구로 한 번에 하나씩 수행하는 에이전트다." },
    { role: "user", content: "12×7을 구하고, 그 결과에 33을 더하고, 다시 2로 나눠줘. 단계별로 하나씩." },
    { role: "assistant", content: "", toolCalls: [{ name: "calculator", args: { a: 12, b: 7, op: "mul" }, id: "c1" }] },
    { role: "tool", content: JSON.stringify({ result: 84 }), toolCallId: "c1" },
  ],
  mode: "auto", turnCount: 1, savedAt: new Date().toISOString(),
};
localStorage.setItem(CKPT_KEY, JSON.stringify(checkpoint));
console.log("💾 체크포인트 저장:", checkpoint.messages.length, "메시지, 1턴 완료 상태(84까지 계산됨)");

// 2) ── 여기서 브라우저가 꺼졌다고 상상 ── 모든 변수 소멸. 남은 건 저장소뿐.

// 3) 재개: 저장소에서 복원 + 경과 리마인더 주입 + 루프 속행
const restored = JSON.parse(localStorage.getItem(CKPT_KEY)!);
const messages: any[] = [
  ...restored.messages,
  { role: "user", content: "<system-reminder>세션이 중단됐다가 재개되었다. 지금까지의 진행을 바탕으로 남은 작업을 이어서 완료하라.</system-reminder>" },
];
const calc = {
  name: "calculator", description: "사칙연산. a,b,op(add/sub/mul/div)",
  parameters: { type: "object", properties: { a: { type: "number" }, b: { type: "number" }, op: { type: "string", enum: ["add","sub","mul","div"] } }, required: ["a","b","op"] },
  execute: async ({ a, b, op }: any) => ({ result: ({ add: a+b, sub: a-b, mul: a*b, div: b ? a/b : NaN } as any)[op] }),
};
for (let t = restored.turnCount + 1; t <= 6; t++) {
  const res = await chat({ provider: "gemini", messages, tools: [calc] });
  if (!res.toolCalls?.length) { console.log(\`\\n✅ [재개 후 완주] \${res.text}\`); break; }
  messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
  for (const call of res.toolCalls) {
    const r = await calc.execute(call.args as any);
    console.log(\`🔧 [turn \${t}] \${call.name}(\${JSON.stringify(call.args)}) → \${JSON.stringify(r)}\`);
    messages.push({ role: "tool", content: JSON.stringify(r), toolCallId: call.id });
  }
}
console.log("\\n👉 84×1 재계산 없이 '33 더하기'부터 이어갔는가 — 그렇다면 재개 성공.");
console.log("   messages 가 상태의 전부라서 가능한 일. 이 직렬화가 C6 승인 대기(pending) 후 재개의 기반이기도 하다.");`,
      hints: [
        "재개 리마인더가 없으면 모델이 '처음부터 다시' 하는 경우가 생깁니다 — 이어달리기 선언은 명시적으로.",
        "restored.messages 를 수정 없이 그대로 쓰는 게 원칙 — 이력 조작은 재개가 아니라 위조예요.",
        "장시간 에이전트의 정석: 매 턴 경계마다 자동 체크포인트 + 실패 시 마지막 체크포인트에서 재시도.",
      ],
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C8

1. **스트리밍 결합**: 마지막 보고(중단 시)를 \`stream: true\` 로 바꿔 중단 보고가 실시간으로 흐르게 하라. 어떤 UX 차이가 생기나?
2. **이중 실행 사고 재현**: 일부러 도구 실행 '도중'(tool_call 이벤트와 tool_result 사이) 시점의 messages 로 체크포인트를 만들어 재개해보라 — 도구가 두 번 실행되는가? 이것이 '턴 경계 저장' 규칙의 근거.
3. **승인-재개 통합**: C6의 approvalQueue 항목이 승인되면, pending 결과를 실제 실행 결과로 교체하고 체크포인트에서 재개하는 전체 흐름을 설계하라 — 실전 HITL 의 완성형.

> 🎯 **(전부 잊어도 이것만)**
> ## 에이전트의 상태 = **messages 배열(+ 하네스 메타).** 그래서 직렬화 = JSON 한 줄, 재개 = 복원 + 리마인더 + 속행.
> 중단도 저장도 **턴 경계에서만** — 도구 실행의 원자성을 지켜라. 그리고 관측 가능한 루프(이벤트 채널) 하나가 UX·디버깅·평가를 전부 먹여 살린다.

📎 **다음 강 — C9. 평가 하네스**: 이벤트 채널을 트레이스로 굳히고, 골든 태스크와 LLM 채점자로 '지침을 바꿨더니 좋아졌나?'에 숫자로 답합니다. B7 생활 평가법의 완전 자동화입니다.`,
    },
  ],

  quiz: {
    title: "고급1·C8강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "에이전트를 중단·재개하기 위해 저장해야 할 핵심 상태는?",
        options: [
          "모델 내부의 신경망 가중치",
          "messages 배열 + 하네스 메타(권한 모드·턴 수) — 모델 쪽에는 저장할 상태가 없다",
          "GPU 메모리 덤프",
        ],
        correctIndex: 1,
        explanation:
          "모델은 매 호출 백지에서 시작하고 모든 맥락은 messages 로 재주입됩니다. 그래서 체크포인트가 JSON 직렬화 한 줄로 끝나요.",
      },
      {
        type: "multiple-choice",
        question: "인터럽트 검문과 체크포인트 저장을 '턴 경계에서만' 하는 이유는?",
        options
: [
          "코드가 짧아져서",
          "도구 실행 도중에 자르거나 저장하면 반쯤 실행된 작업의 원자성이 깨지고, 재개 시 이중 실행 사고가 나기 때문",
          "제공자 약관 때문",
        ],
        correctIndex: 1,
        explanation:
          "쓰기 도구가 절반 실행된 상태로 저장되면 재개 때 다시 실행돼요 — 비가역 작업이면 재앙. 협조적 중단(턴 경계)이 원자성을 지킵니다.",
      },
      {
        type: "multiple-choice",
        question: "재개 시 messages 를 복원한 뒤 해야 할 일은?",
        options: [
          "그대로 chat() 을 부르면 끝 — 아무것도 필요 없다",
          "'중단 후 재개됨, 이어서 완료하라' 리마인더를 주입하고, 시간이 흘렀다면 낡은 전제 재확인을 지시한다",
          "이력을 적당히 지우고 새로 시작한다",
        ],
        correctIndex: 1,
        explanation:
          "재개 선언이 없으면 처음부터 다시 하는 경우가 생기고, 시간 경과로 동적 조각(C3)이 낡았을 수 있어요. 이력은 수정 없이, 리마인더는 명시적으로.",
      },
    ],
  } satisfies Quiz,
};
