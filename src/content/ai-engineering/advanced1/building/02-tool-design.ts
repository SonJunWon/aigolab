import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급1 시리즈C(하네스 만들기) 02강 — 도구 설계.
 * 스키마·description 품질 A/B, 에러를 결과로 반환, '도구 결과가 곧 컨텍스트'.
 */
export const lessonC02: Lesson = {
  id: "ai-eng-a1-c02-tool-design",
  language: "ai-engineering",
  track: "advanced1",
  order: 22,
  title: "C2. 도구는 API가 아니라 UI다 — 도구 설계",
  subtitle: "스키마와 description 은 모델을 위한 사용자 인터페이스",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🖐️ 고급1·C2강. 도구는 API가 아니라 UI다
### — 도구 설계

⏱️ 45분 · 🧰 API 키 · 🗺️ 구현 대상: **② 도구** · 선수: C1

> 💡 이 강의 한 문장: 도구의 name·description·스키마는 **모델이 읽는 사용자 인터페이스**다.
> 사람용 버튼에 라벨을 잘못 붙이면 사람이 잘못 누르듯, 도구 설명을 잘못 쓰면 모델이 잘못 부릅니다.
> 그리고 A3의 진실을 코드로 확인합니다 — **도구 결과가 곧 다음 컨텍스트.**

### 이 강에서
- 나쁜 스키마 vs 좋은 스키마 **A/B 행동 비교** (같은 모델, 다른 도구 정의)
- 에러를 던지지 않고 **결과로 반환** — 모델이 읽고 복구하게
- 도구 결과 다이어트 — 长 결과가 책상(컨텍스트)을 덮지 않게`,
    },
    {
      type: "markdown",
      source: `## 🏷️ 도구 정의의 3요소 — 전부 '모델이 읽는 글'

\`\`\`ts
{
  name: "search_orders",              // ① 이름: 동사_대상 — 뭘 하는지 이름만으로
  description: "주문 내역을 검색한다. 고객 문의에 답하기 전 반드시 먼저 호출.", // ② 언제 쓰는 물건인지
  parameters: { /* JSON Schema */ },  // ③ 인자: 타입·enum·설명으로 실수 봉쇄
  execute: async (args) => { ... },   // (이것만 모델이 안 읽음)
}
\`\`\`

> ⚠️ 흔한 착각: "execute 만 잘 짜면 된다." — 반대예요. 모델은 execute 를 못 봅니다. **모델의 세계에서 도구란 ①②③ 텍스트가 전부**입니다. 그래서 도구 설계는 코딩이 아니라 **테크니컬 라이팅**에 가깝습니다.

**description 작성 공식**: 무엇을 한다 + **언제 쓴다** + (헷갈릴 도구가 있으면) 언제 쓰지 않는다.
- 나쁨: "주문 API 래퍼"  ← 모델에게 무의미
- 좋음: "주문 내역 검색. 고객 문의 응대 전 반드시 호출. 환불 처리는 이 도구가 아니라 refund_order 사용."`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── A/B 실험: 같은 기능, 다른 정의 — 모델의 행동이 어떻게 갈리나 ──
// 시나리오: 날짜 범위로 매출을 조회하는 도구. 나쁜 버전은 실수 여지가 가득하다.
const badTool = {
  name: "getData",                                   // 뭘 가져오는지 이름에 없음
  description: "데이터를 가져온다",                    // 언제 쓰는지 없음
  parameters: {
    type: "object",
    properties: { from: { type: "string" }, to: { type: "string" } },  // 날짜 형식 미지정
    required: [],                                     // 필수 표시도 없음
  },
  execute: async (args: any) => ({ revenue: 12345678, currency: "KRW" }),
};

const goodTool = {
  name: "get_sales_revenue",
  description: "지정한 날짜 범위의 매출 합계를 조회한다. 매출·실적 질문에는 추측하지 말고 반드시 이 도구를 먼저 호출.",
  parameters: {
    type: "object",
    properties: {
      from: { type: "string", description: "시작일. YYYY-MM-DD 형식. 예: 2026-07-01" },
      to:   { type: "string", description: "종료일(포함). YYYY-MM-DD 형식." },
    },
    required: ["from", "to"],
  },
  execute: async (args: any) => ({ revenue: 12345678, currency: "KRW" }),
};

const ask = "저번 달 매출이 얼마였지?";
for (const [label, tool] of [["❌ bad", badTool], ["✅ good", goodTool]] as const) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: \`오늘은 2026-07-10 이다.\` },
      { role: "user", content: ask },
    ],
    tools: [tool],
  });
  console.log(\`\${label} → toolCalls: \${JSON.stringify(res.toolCalls ?? "(호출 안 함)")} | text: \${(res.text ?? "").slice(0, 60)}\`);
}
console.log("\\n👉 관찰 포인트: good 쪽이 ① 도구를 확실히 부르고 ② from/to 를 올바른 형식으로 채우는가.");
console.log("   bad 쪽은 호출을 건너뛰거나(추측 답변) 인자 형식이 제멋대로일 확률이 높다. 여러 번 실행해 비교!");`,
      hints: [
        "인자 실수를 막는 건 검증 코드가 아니라 스키마의 description·형식 명시가 1차 방어선이에요.",
        "'추측하지 말고 반드시 호출' 같은 사용 시점 지시는 description 이 시스템 프롬프트 역할을 나눠 갖는 것.",
        "LLM은 확률적이라 한 번의 결과로 단정 금지 — 3~5회 돌려 경향을 보세요 (C9 평가의 예고).",
      ],
    },
    {
      type: "markdown",
      source: `## 🧯 에러는 던지지 말고 '결과'로 — 복구 가능한 실패

C1 루프에서 execute 가 throw 하면? **루프 전체가 죽습니다.** A6의 실패학과 중급2 01강의 원칙을 코드 규약으로 굳힙니다:

\`\`\`ts
execute: async (args) => {
  try {
    // ... 실제 작업
  } catch (e) {
    return { error: "타임아웃. 잠시 후 재시도하거나 기간을 좁혀서 다시 시도하세요." };
  }
}
\`\`\`

에러 메시지도 **모델이 읽는 UI**예요. 좋은 에러의 3요소:
1. **무엇이** 잘못됐나 ("타임아웃" / "해당 날짜에 데이터 없음")
2. **다음에 뭘** 해볼 수 있나 ("기간을 좁혀 재시도" / "다른 도구 사용")
3. **짧게** — 스택 트레이스 500줄을 되먹이면 책상만 덮는다

> 💡 \`{ error: "Error: undefined is not a function at line 42..." }\` 를 그대로 반환하는 건 사람에게 기계어 매뉴얼을 주는 것. 모델을 위한 번역이 하네스의 일입니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── '도구 결과 = 컨텍스트' 실험: 뚱뚱한 결과 vs 다이어트한 결과 ──
// 검색 도구가 원본 그대로 40건을 토하면, 모델의 책상은 그 40건으로 덮인다.
const rows = Array.from({ length: 40 }, (_, i) => ({
  id: \`ORD-\${1000 + i}\`, customer: \`고객\${i}\`, amount: 10000 + i * 137,
  memo: "배송 관련 상세 메모 ".repeat(20),   // 실전에서 흔한 노이즈 필드
  status: i % 7 === 0 ? "refunded" : "paid",
}));

const fatResult = rows;                                        // ❌ 원본 통째로 (JSON 수천 자)
const slimResult = {                                           // ✅ 요약 + 필요한 것만
  total: rows.length,
  refunded: rows.filter((r) => r.status === "refunded").map((r) => ({ id: r.id, amount: r.amount })),
  note: "환불 건만 상세 포함. 다른 건이 필요하면 status 를 지정해 재검색.",
};

console.log("fat  결과 크기:", JSON.stringify(fatResult).length, "자");
console.log("slim 결과 크기:", JSON.stringify(slimResult).length, "자");

// 같은 질문을 두 결과로 되먹여 비교
for (const [label, result] of [["❌ fat", fatResult], ["✅ slim", slimResult]] as const) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "user", content: "환불된 주문이 몇 건이고 환불 총액이 얼마인지 알려줘." },
      { role: "assistant", content: "", toolCalls: [{ name: "search_orders", args: {}, id: "call-1" }] },
      { role: "tool", content: JSON.stringify(result), toolCallId: "call-1" },
    ],
  });
  console.log(\`\${label} → \${(res.text ?? "").slice(0, 100)}\`);
}
console.log("\\n👉 slim 이 보통 더 정확하고 빠르고 싸다. 도구가 반환하는 모든 글자는 책상 위에 올라간다 —");
console.log("   execute 안에서 요약·선별하는 것까지가 도구 설계다. (A3 '도구 결과가 곧 컨텍스트')");`,
      hints: [
        "다이어트 요령: 집계값 먼저, 상세는 질문과 관련된 것만, '더 필요하면 이렇게 재검색' 안내를 결과에 포함.",
        "note 필드처럼 도구 결과 안에 다음 행동 힌트를 심는 것도 훌륭한 UI — 결과도 모델이 읽는 글이니까.",
        "tokensUsed 를 비교해보면 fat/slim 의 비용 차이가 숫자로 보입니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C2

1. **enum 의 힘**: badTool 에 op 같은 자유 문자열 인자를 추가하고, enum 지정 전/후로 잘못된 인자 빈도를 비교하라. 스키마가 곧 가드레일임을 확인.
2. **도구 개수 실험**: 비슷한 이름의 더미 도구를 8개 추가하고(get_data, fetch_data, load_data…) 올바른 도구 선택률이 어떻게 무너지는지 관찰하라 — A3 '가위 7개' 문제의 정량 재현.
3. **에러 문구 A/B**: \`{error:"failed"}\` vs 3요소를 갖춘 에러로 재시도 성공률을 비교하라. 에러 메시지가 UI 라는 명제의 검증.

> 🎯 **(전부 잊어도 이것만)**
> ## 모델의 세계에서 도구 = **name + description + 스키마라는 '글'.** 도구 설계는 테크니컬 라이팅이다.
> 에러는 던지지 말고 '복구 힌트가 담긴 결과'로. 그리고 도구가 반환하는 모든 글자는 책상에 올라간다 — 요약·선별까지가 execute 의 일.

📎 **다음 강 — C3. 지침의 아키텍처**: 도구 위에서 루프를 지휘하는 규칙문(시스템 프롬프트)을 3층으로 조립하는 프롬프트 빌더를 만듭니다. B2에서 글로 쓴 헌법이 코드가 됩니다.`,
    },
  ],

  quiz: {
    title: "고급1·C2강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "'도구는 API가 아니라 UI다'의 의미로 가장 정확한 것은?",
        options: [
          "도구에 예쁜 그래픽 화면을 붙여야 한다",
          "모델이 보는 것은 name·description·스키마라는 글뿐이므로, 그 글의 품질이 도구 사용 품질을 결정한다",
          "execute 함수만 잘 짜면 나머지는 아무래도 좋다",
        ],
        correctIndex: 1,
        explanation:
          "모델은 execute 를 못 봅니다. 도구 정의 텍스트가 모델에게는 버튼 라벨이자 사용설명서 — 그래서 도구 설계는 테크니컬 라이팅이에요.",
      },
      {
        type: "multiple-choice",
        question: "execute 안에서 오류가 났을 때 올바른 처리는?",
        options: [
          "throw 해서 루프를 즉시 중단시킨다",
          "'무엇이 잘못됐고 다음에 뭘 해볼지'가 담긴 짧은 error 결과를 반환해 모델이 복구하게 한다",
          "빈 객체를 반환해 아무 일 없던 척한다",
        ],
        correctIndex: 1,
        explanation:
          "throw 는 에이전트 전체를 죽이고, 침묵은 환각을 부릅니다. 실패를 '복구 힌트가 담긴 관측 가능한 결과'로 바꾸는 게 하네스의 일이에요.",
      },
      {
        type: "multiple-choice",
        question: "도구 결과를 원본 그대로(40건 통째) 반환하면 생기는 문제는?",
        options: [
          "모델이 감동해서 더 열심히 한다",
          "결과 전체가 컨텍스트(책상)에 올라가 정확도는 떨어지고 비용은 올라간다",
          "아무 문제 없다 — 데이터는 많을수록 좋다",
        ],
        correctIndex: 1,
        explanation:
          "도구가 반환하는 모든 글자는 다음 턴의 입력이 됩니다. 집계·선별·재검색 안내까지 담은 다이어트 결과가 더 정확하고 싸요.",
      },
    ],
  } satisfies Quiz,
};
