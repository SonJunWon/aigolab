import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급1 시리즈C(하네스 만들기) 05강 — 수첩 달기(파일 기반 메모리).
 * localStorage 메모리 저장소 + '무엇을 저장할지'도 모델에게(responseSchema) + 재시작 실험.
 */
export const lessonC05: Lesson = {
  id: "ai-eng-a1-c05-file-memory",
  language: "ai-engineering",
  track: "advanced1",
  order: 25,
  title: "C5. 수첩 달기 — 파일 기반 메모리",
  subtitle: "세션이 죽어도 살아남는 기억 — 저장 판단까지 모델에게 맡기는 설계",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 📓 고급1·C5강. 수첩 달기
### — 파일 기반 메모리

⏱️ 45분 · 🧰 API 키 · 🗺️ 구현 대상: **④ 기억** · 선수: C1, C4

> 💡 컴팩션(C4)은 세션 **안**의 생존술이었어요. 세션이 끝나면? 책상째 치워집니다.
> 오늘 만드는 건 책상 밖 서랍 — **세션을 넘어 살아남는 수첩**입니다. 실전 하네스(Claude Code 의 메모리 디렉토리 등)가 쓰는 구조 그대로: ① 저장소 ② 회수(세션 시작 시 주입) ③ **저장 판단도 모델에게.**

### 이 강에서
- localStorage 기반 메모리 저장소 (실전의 파일 시스템을 브라우저로 시뮬레이션)
- 세션 시작 시 수첩을 시스템 프롬프트에 주입 — C3 빌더의 3층에 연결
- ==구조화 출력== 으로 모델이 '기억할 가치'를 스스로 판정하게`,
    },
    {
      type: "markdown",
      source: `## 🗄️ 설계 — 수첩의 3가지 결정

**결정 ① 무엇을 적나** — B4에서 배운 그대로: 오래 가는 사실만(취향·규칙·진행 중 프로젝트). 일회성·틀린 것 금지. 이걸 규칙 문장으로 만들어 **판정 프롬프트**에 넣습니다.

**결정 ② 어떤 형태로** — 한 건 = 한 항목, 짧은 문장. 통짜 일기가 아니라 **개별 카드**여야 나중에 선별 주입·삭제가 됩니다.
\`\`\`ts
interface MemoryItem { id: string; fact: string; topic: string; savedAt: string; }
\`\`\`

**결정 ③ 언제 꺼내나** — 매 세션 시작 시 전부? 수첩이 두꺼워지면 그 자체가 책상을 덮어요(A4). 시작은 '전부 주입'으로, 커지면 topic 필터·검색 주입으로 진화시킵니다. (검색 주입의 끝판왕이 중급1의 지식 트윈 — VectorStore 로 이 수첩을 업그레이드하는 게 연구 노트 3번.)`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 수첩 v1: localStorage 저장소 + 저장 판단은 모델에게 ──
const MEM_KEY = "a1c05-memory";
const loadMemory = (): any[] => JSON.parse(localStorage.getItem(MEM_KEY) ?? "[]");
const saveMemory = (items: any[]) => localStorage.setItem(MEM_KEY, JSON.stringify(items));

// 대화가 끝날 때 호출 — '기억할 가치'를 모델이 구조화 출력으로 판정
async function extractMemories(transcript: string) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: \`대화에서 '다음 세션에도 유효할 사실'만 추출하라.
저장 기준: 사용자의 지속적 취향/규칙, 진행 중 프로젝트의 확정 사항.
저장 금지: 일회성 정보(오늘 메뉴, 이번 문서의 오타), 추측, 잡담.
없으면 빈 배열을 반환하라.\` },
      { role: "user", content: transcript },
    ],
    responseSchema: {
      type: "object",
      properties: {
        memories: {
          type: "array",
          items: {
            type: "object",
            properties: { fact: { type: "string" }, topic: { type: "string" } },
            required: ["fact", "topic"],
          },
        },
      },
      required: ["memories"],
    },
  });
  return ((res.json as any)?.memories ?? []) as { fact: string; topic: string }[];
}

// ── 세션 1: 대화하고, 끝날 때 수첩에 기록 ──
localStorage.removeItem(MEM_KEY);   // 실험 초기화
const session1 = \`[user] 나는 마케팀 김서연이야. 보고서는 항상 표로 정리해줘.
[user] 아 그리고 오늘 점심은 김치찌개 먹었어. 맛있더라.
[assistant] 알겠습니다! 표 정리 선호 기억할게요.
[user] 지금 '루미' 신제품 런칭 프로젝트를 하고 있어. 출시일은 6월 12일이야.\`;

const extracted = await extractMemories(session1);
const memory = extracted.map((m, i) => ({ id: \`m\${Date.now()}-\${i}\`, ...m, savedAt: new Date().toISOString() }));
saveMemory(memory);
console.log("📓 수첩에 기록된 것:", memory.map((m) => \`[\${m.topic}] \${m.fact}\`));
console.log("👉 점심 메뉴가 걸러졌는지 확인 — 판정 프롬프트의 '저장 금지' 조항이 일하는 순간.");`,
      hints: [
        "responseSchema 를 쓰면 res.json 으로 파싱된 배열이 옵니다 — '기억 추출'이 자유 텍스트가 아니라 구조화 파이프라인이 되는 것.",
        "저장 기준/금지를 시스템 프롬프트에 명문화한 것이 B4 '무엇을 적고 무엇을 적지 말까'의 코드화예요.",
        "실전 하네스는 localStorage 대신 파일(메모리 디렉토리 + 인덱스)을 씁니다 — 구조는 동일.",
      ],
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 세션 2: '재시작' — 새 messages 배열(깨끗한 책상)에 수첩만 주입 ──
const MEM_KEY = "a1c05-memory";
const memory: any[] = JSON.parse(localStorage.getItem(MEM_KEY) ?? "[]");

// C3 프롬프트 빌더의 3층에 '수첩' 층이 추가되는 순간
function buildSystemWithMemory(mems: any[]) {
  const memBlock = mems.length
    ? \`── 사용자에 대한 기억 (이전 세션에서 저장) ──\\n\${mems.map((m) => \`- [\${m.topic}] \${m.fact}\`).join("\\n")}\`
    : "";
  return \`너는 업무 비서다.\\n\\n\${memBlock}\`;
}

// 완전히 새로운 세션 — 이전 대화는 단 한 줄도 없다
const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: buildSystemWithMemory(memory) },
    { role: "user", content: "그 프로젝트 진행 상황 보고서 초안 좀 잡아줘." },   // '그 프로젝트'라고만 말한다
  ],
});
console.log("💬 새 세션의 첫 답:\\n", (res.text ?? "").slice(0, 300));
console.log("\\n👉 채점 포인트: ① '루미'와 출시일을 아는가(수첩 회수 성공) ② 표로 정리하는가(취향 기억)");
console.log("   비교 실험: buildSystemWithMemory([]) 로 바꿔 실행하면 '어떤 프로젝트요?'가 나온다 — 수첩 없는 비서.");`,
      hints: [
        "'그 프로젝트'라는 대명사가 통하는 것 — 이게 세션을 넘은 기억의 체감 순간이에요.",
        "수첩 주입은 시스템 프롬프트의 한 층(C3) — 안 변하는 코어보다는 뒤, 대화 이력보다는 앞이 자연스러운 자리입니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 🧹 수첩의 위생 — 오염·비대·충돌

수첩은 만들면 끝이 아니라 **운영**이 시작됩니다. B4의 '메모리 대청소'를 하네스 기능으로:

| 문제 | 증상 | 코드 대책 |
|------|------|-----------|
| **오염** | 틀린/철 지난 기억이 매 세션 주입 | 삭제 API + '기억이 현실과 충돌하면 사용자에게 확인' 지침 |
| **비대** | 수첩 자체가 책상을 덮음 (A4 재발) | 항목 수 상한 + topic 필터 주입 + 오래된 항목 아카이브 |
| **충돌** | "표 선호" vs 새 대화 "이번엔 줄글로" | **최신 발언 우선** 규칙을 코어에 명시 — 수첩은 기본값, 현재 지시가 항상 이긴다 |

> 💡 세 번째가 미묘하게 중요해요. 수첩이 강해지면 에이전트가 **과거에 갇힙니다** — "저번에 표 좋아하셨잖아요"를 반복하는 비서. 기억은 기본값(default)이지 족쇄가 아니다 — 이 한 줄을 코어(C3의 1층)에 넣어두세요.`,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C5

1. **저장 판정 평가**: '저장해야 할 대화' 5개와 '저장하면 안 되는 대화' 5개로 골든 케이스를 만들어 extractMemories 의 정밀도/재현율을 측정하라 (B7의 코드화 — C9에서 정식으로).
2. **중복 병합**: 같은 사실이 표현만 다르게 두 번 저장되는 문제("표 선호" / "표로 정리 좋아함")를 저장 전 유사도 검사로 막아보라 — cosineSimilarity + embed 활용.
3. **검색 주입으로 진화**: 수첩이 100건이 되면 전부 주입은 파산이다. VectorStore 에 수첩을 넣고 현재 질문과 관련된 3건만 주입하는 v2를 만들어라 — 이 순간 수첩이 중급1의 '지식 트윈'과 만난다.

> 🎯 **(전부 잊어도 이것만)**
> ## 기억 = **저장소 + 시작 시 주입 + 저장 판단(이것도 모델에게, 단 기준은 하네스가 명문화).**
> 수첩은 운영이 반이다 — 오염은 삭제로, 비대는 선별 주입으로, 충돌은 '현재 지시 우선' 규칙으로. 기억은 기본값이지 족쇄가 아니다.

📎 **다음 강 — C6. 브레이크 설계**: 루프·도구·컨텍스트·기억까지 달린 우리 에이전트는 이제 꽤 위험해질 수 있는 몸입니다. 권한 상태기계와 승인 관문 — A5·B5의 원칙을 구조로 굳힙니다.`,
    },
  ],

  quiz: {
    title: "고급1·C5강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "컴팩션(C4)과 메모리(C5)의 관계로 맞는 것은?",
        options: [
          "같은 기능의 다른 이름이다",
          "컴팩션은 세션 안에서 책상을 지키는 기술, 메모리는 세션이 끝나도 살아남는 서랍",
          "메모리가 있으면 컴팩션은 필요 없다",
        ],
        correctIndex: 1,
        explanation:
          "컴팩션은 진행 중인 대화의 생존술이고, 메모리는 세션 경계를 넘는 지속성이에요. 실전 하네스에는 둘 다 필요합니다.",
      },
      {
        type: "multiple-choice",
        question: "'무엇을 저장할지'를 모델에게 맡길 때 하네스가 해야 할 일은?",
        options: [
          "아무 지침 없이 '알아서 기억해'라고 한다",
          "저장 기준·금지 조항을 명문화한 판정 프롬프트 + 구조화 출력 스키마를 제공한다",
          "모든 대화를 통째로 저장한다",
        ],
        correctIndex: 1,
        explanation:
          "판단은 모델이 하되 기준은 하네스가 정합니다. responseSchema 로 결과를 구조화하면 저장 파이프라인이 안정돼요.",
      },
      {
        type: "multiple-choice",
        question: "수첩의 기억과 사용자의 현재 지시가 충돌하면?",
        options: [
          "수첩이 이긴다 — 기록이 우선이다",
          "현재 지시가 이긴다 — 기억은 기본값이지 족쇄가 아니다",
          "에이전트가 무작위로 하나를 고른다",
        ],
        correctIndex: 1,
        explanation:
          "기억이 강해지면 에이전트가 과거에 갇혀요. '최신 발언 우선'을 코어 규칙으로 명시하는 게 수첩 운영의 핵심 위생입니다.",
      },
    ],
  } satisfies Quiz,
};
