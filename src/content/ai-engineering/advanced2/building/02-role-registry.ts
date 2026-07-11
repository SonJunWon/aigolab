import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 02강 — 역할의 코드화.
 * 역할 = {지침, 도구 화이트리스트, 모델 티어, 턴 제한} 선언적 레지스트리 + 모델 믹스.
 */
export const lessonC02: Lesson = {
  id: "ai-eng-a2-c02-role-registry",
  language: "ai-engineering",
  track: "advanced2",
  order: 22,
  title: "C2. 역할의 코드화 — 에이전트 정의 레지스트리",
  subtitle: "직무기술서를 데이터로 — 역할 파일 하나가 곧 채용 공고다",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🏇 고급2·C2강. 역할의 코드화
### — 에이전트 정의 레지스트리

⏱️ 45분 · 🧰 API 키 · 🗺️ 구현 대상: ② 역할 · 선수: C1

> 💡 C1의 오케스트레이터는 조사원 하나만 부릴 수 있었어요. 실전 팀에는 reader, writer, critic…
> 역할이 늘어납니다. 역할마다 spawnTool을 복사-붙여넣기로 늘리면? — 곧 지옥이 열려요.
> 해법은 A2에서 배운 **직무기술서를 데이터로** 만드는 것.
> 역할 = \`{ 지침, 도구 화이트리스트, 모델 티어, 턴 제한 }\` — 이 선언 하나가 채용 공고입니다.

### 이 강에서
- 역할 정의 객체와 레지스트리 — 선언과 실행의 분리
- 도구 화이트리스트 — 역할이 좁을수록 정확하고 안전하다 (A2의 '칼')
- 모델 믹스 — 싼 모델에 기계적 일, 비싼 모델에 판단 일`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 스타터 (C1과 동일) ──
type Tool = { name: string; description: string; parameters: any; execute: (args: any) => Promise<any> };
async function runAgent(system: string, mission: string, tools: Tool[], maxTurns = 5): Promise<string> {
  const messages: any[] = [{ role: "system", content: system }, { role: "user", content: mission }];
  for (let t = 0; t < maxTurns; t++) {
    const res = await chat({ provider: "gemini", messages, tools });
    if (!res.toolCalls?.length) return res.text ?? "";
    messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      const tool = tools.find((x) => x.name === call.name)!;
      messages.push({ role: "tool", content: JSON.stringify(await tool.execute(call.args as any)), toolCallId: call.id });
    }
  }
  return "(최대 턴 도달)";
}

// ── 공용 도구함 (실전에서는 read/write/search 등) ──
const readDoc: Tool = {
  name: "read_doc", description: "문서를 읽어 내용을 반환.",
  parameters: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
  execute: async ({ name }: any) => ({ content: \`[\${name}] 3분기 매출 12% 증가, 고객 불만은 배송 지연에 집중...\` }),
};
const writeDraft: Tool = {
  name: "write_draft", description: "초안을 저장소에 기록.",
  parameters: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
  execute: async ({ text }: any) => ({ saved: true, length: text.length }),
};

// ── 오늘의 핵심: 역할 정의 레지스트리 ──
// 직무기술서(A2·B2)의 코드 버전 — 선언(데이터)과 실행(엔진)의 분리
type RoleDef = {
  system: string;        // 지침 (레시피)
  tools: string[];       // 도구 화이트리스트 (칼 — 이름만 선언)
  maxTurns: number;      // 턴 제한 (폭주 가드)
  // 실전에서는 model 티어도: "cheap" | "smart" — 아래 '모델 믹스' 참고
};

const REGISTRY: Record<string, RoleDef> = {
  reader: {
    system: "너는 자료 분석가다. read_doc으로 문서만 읽고 사실을 표로 보고하라. 의견 금지.",
    tools: ["read_doc"],           // 읽기만 — 쓰기 도구는 목록에 없다
    maxTurns: 4,
  },
  writer: {
    system: "너는 보고서 작가다. 주어진 사실 표만 근거로 3줄 요약을 쓰고 write_draft로 저장하라. 사실 추가 금지.",
    tools: ["write_draft"],        // 쓰기만 — 원문을 다시 뒤지지 못한다 (B3 파이프라인 계약!)
    maxTurns: 3,
  },
  critic: {
    system: "너는 적대적 검토자다. 칭찬 금지. 주장의 근거 부재·논리 비약만 표로 지적하라. 총평 금지.",
    tools: [],                     // 도구 없음 — 읽고 지적만
    maxTurns: 2,
  },
};

const TOOLBOX: Record<string, Tool> = { read_doc: readDoc, write_draft: writeDraft };

// 레지스트리 실행 엔진 — 역할 이름 하나로 채용·투입
async function runRole(role: string, mission: string): Promise<string> {
  const def = REGISTRY[role];
  if (!def) throw new Error(\`미등록 역할: \${role}\`);
  const tools = def.tools.map((n) => TOOLBOX[n]);   // 화이트리스트만 지급
  return runAgent(def.system, mission, tools, def.maxTurns);
}

// ── 시운전: 같은 임무, 다른 역할 ──
const factTable = await runRole("reader", "3분기 실적 문서(q3-report)를 분석해 사실 표를 만들어라.");
console.log("📄 reader:\\n", factTable);
const draft = await runRole("writer", \`다음 사실 표로 경영 요약을 작성하라:\\n\${factTable}\`);
console.log("\\n✍️ writer:\\n", draft);
const review = await runRole("critic", \`다음 요약을 검토하라:\\n\${draft}\`);
console.log("\\n🥊 critic:\\n", review);`,
      hints: [
        "REGISTRY가 곧 B8 매뉴얼 2장(직무기술서 묶음)의 코드 버전이에요. 역할을 고치고 싶으면 코드가 아니라 '데이터'를 고칩니다 — 실전에서는 이 정의를 md/json 파일로 빼서 비개발자도 편집하게 해요.",
        "writer에게 read_doc을 안 준 것이 핵심 — '표에 없는 사실 추가 금지'(B3)를 지침으로도 말하지만, 도구 화이트리스트로는 물리적으로 강제합니다. 지침은 어길 수 있어도 없는 손은 못 씁니다.",
        "critic의 tools가 빈 배열인 것도 설계예요 — 검토자에게 도구를 주면 검토 대신 재조사를 시작하는 월권이 생깁니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 💰 모델 믹스 — 조직의 인건비 설계

역할 정의에 한 칸을 더 하면 조직의 **인건비 구조**가 생깁니다: 모델 티어.

| 역할 | 일의 성격 | 어울리는 티어 | 이유 |
|------|----------|--------------|------|
| reader | 기계적 추출 | **싼 모델** | 창의성 불필요, 물량이 많음 |
| writer | 구성·서술 | 중간 | 문장력 필요 |
| critic / 오케스트레이터 | **판단** | 비싼 모델 | 틀리면 아픈 결정 (B5 수위 감각) |

\`\`\`
// RoleDef에 model 칸 추가 → runRole에서 chat({ provider: def.model, ... })
reader:  { ..., model: "groq"   }   // 빠르고 저렴
critic:  { ..., model: "gemini" }   // 판단력 우선
\`\`\`

> **원칙: 비싼 모델은 판단에, 싼 모델은 물량에.**
> 전원 비싼 모델 = A6 비용 폭발 코스. 전원 싼 모델 = 검증이 뚫리는 조직.
> 성적표(B7·C9)가 이 믹스의 정답을 알려줍니다 — 감으로 정하지 마세요.

## 🧱 화이트리스트 = 코드로 쓰는 안전벨트

고급1 A5의 '멈출 줄 아는 하네스'가 조직에서는 **주지 않는 것**으로 진화합니다.
- 지침 "쓰지 마라" → 모델이 어길 수 있음 (확률적)
- 화이트리스트에서 제외 → **물리적으로 불가능** (결정적)
B6에서 배운 '발송 권한 회수'의 코드 버전이에요. 실전 아크(C9)에서 파인더·검증단을
전원 읽기 전용으로 만드는 근거가 됩니다.`,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C2

1. **화이트리스트 실증**: writer의 tools에 read_doc을 슬쩍 추가하고 '표에 없는 사실 추가 금지' 지침은 유지한 채 재실행하라. writer가 재조사를 시작하는가? 지침과 화이트리스트 중 어느 쪽이 더 신뢰할 수 있는 가드인가.
2. **레지스트리 외부화**: REGISTRY를 JSON 문자열로 빼서 파싱해 로딩하게 바꿔라. 역할 추가가 '배포 없는 편집'이 되는 순간 — 조직 개편의 비용이 어떻게 변하는가?
3. **모델 믹스 A/B**: reader를 groq(저렴)로 바꾸고 결과 품질을 비교하라. 어떤 역할부터 싼 모델로 내려도 안전한가? (힌트: 산출물이 표처럼 기계적일수록.)

> 🎯 **(전부 잊어도 이것만)**
> ## 역할 = **{ 지침, 도구 화이트리스트, 모델 티어, 턴 제한 }** 의 선언. 레지스트리가 있으면 조직 개편이 코드 수정이 아니라 **데이터 편집**이 된다.
> 그리고 화이트리스트는 코드로 쓰는 안전벨트 — 지침은 어길 수 있어도 **없는 손은 못 쓴다.**

📎 **다음 강 — C3. 지휘 패턴 구현 ①**: 역할들이 준비됐으니 이제 편성입니다. 코드가 흐름을 쥐는 결정적 오케스트레이션 — 파이프라인 체인과 Promise 팬아웃, 그리고 동시성 캡·부분 실패 처리라는 실전 근육을 답니다.`,
    },
  ],

  quiz: {
    title: "고급2·C2강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "writer 역할에 read_doc 도구를 주지 않은 이유는?",
        options: [
          "read_doc이 비싼 도구라서",
          "'표에 없는 사실 추가 금지'를 지침(확률적)이 아니라 화이트리스트(물리적)로 강제하기 위해",
          "writer 모델이 읽기를 못해서",
        ],
        correctIndex: 1,
        explanation:
          "지침은 어길 수 있지만 없는 손은 못 씁니다. 도구 화이트리스트는 B3의 파이프라인 계약을 코드로 강제하는 안전벨트예요.",
      },
      {
        type: "multiple-choice",
        question: "역할 정의를 코드가 아닌 데이터(레지스트리)로 두는 이득은?",
        options: [
          "실행 속도가 빨라진다",
          "조직 개편이 코드 수정·배포가 아니라 데이터 편집이 된다",
          "모델이 레지스트리를 더 좋아한다",
        ],
        correctIndex: 1,
        explanation:
          "선언과 실행을 분리하면 역할 추가·수정이 가벼워지고, md/json로 빼면 비개발자도 직무기술서를 편집할 수 있어요 — B8 매뉴얼의 코드 버전.",
      },
      {
        type: "multiple-choice",
        question: "모델 믹스의 원칙으로 알맞은 것은?",
        options: [
          "전원 최고급 모델 — 품질이 최우선",
          "전원 최저가 모델 — 비용이 최우선",
          "비싼 모델은 판단(critic·오케스트레이터)에, 싼 모델은 물량(기계적 추출)에",
        ],
        correctIndex: 2,
        explanation:
          "전원 비싼 모델은 비용 폭발, 전원 싼 모델은 검증이 뚫려요. 틀리면 아픈 자리에 비싼 판단력을 배치하는 게 조직의 인건비 설계입니다.",
      },
    ],
  } satisfies Quiz,
};
