import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson07: Lesson = {
  id: "ai-eng-m1-07-multiturn-update",
  language: "ai-engineering",
  track: "intermediate1",
  order: 7,
  title: "멀티턴 & 지식 갱신 — 살아있는 트윈",
  subtitle: "맥락 의존 질문을 독립 질의로 재작성하고, 트윈을 최신으로 유지한다",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🔄 멀티턴 & 지식 갱신

> 💡 보라색 점선 밑줄 = 전문 용어.

지금까지 RAG 는 **단발 질의** — 질문 하나, 검색 한 번이었어요.
하지만 실제 대화는 "그건 어떻게 해?", "그럼 그건?" 처럼 **앞 맥락에 기대는** 질문이 이어집니다.
이런 질문을 그대로 검색하면 **엉뚱한 걸** 찾아와요. 이번 강에서 해결합니다.

### 배울 것
- ==query rewriting== — 대화 맥락을 녹여 **독립 질의(standalone query)** 로 다시 쓰기
- 대화 메모리를 RAG 에 연결
- 지식 ==갱신== — 트윈에 문서 추가/삭제 시 **즉시 최신화**`,
    },

    {
      type: "markdown",
      source: `## 🕳️ 문제 — "그건 어떻게 해?" 는 검색이 안 된다

\`\`\`
사용자: 환불 규정 알려줘
AI:     환불은 14일 이내 가능합니다. [근거]
사용자: 그때 배송비는?      ← '그때' 가 뭐지? 이 문장만으론 검색 불가 😢
\`\`\`

검색기는 "그때 배송비는?" 만 보고는 **무엇의 배송비인지** 모릅니다.
해법: 이전 대화를 참고해 **"환불 시 배송비는 누가 부담하나?"** 같은 **독립 질의**로 다시 쓰는 것 = ==query rewriting==.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 맥락 의존 질문을 '그대로' 검색하면? — 실패 관찰
const sections = [
  "환불은 구매 후 14일 이내 신청할 수 있다.",
  "환불 승인 시 왕복 배송비는 고객이 부담한다.",
  "신규 회원은 가입 즉시 쿠폰을 받는다.",
];
const vecs = await embed(sections);
const store = new VectorStore();
store.add(sections.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] })));

// 맥락 없이 후속 질문만으로 검색
const followup = "그때 배송비는?";
const [v1] = await embed([followup]);
console.log("❓ 후속 질문 그대로:", followup);
console.log("  최상위:", store.search(v1, 1)[0].text);

// 사람이 손으로 독립 질의로 바꿔 검색
const rewritten = "환불 시 배송비는 누가 부담하나?";
const [v2] = await embed([rewritten]);
console.log("\\n✏️ 독립 질의로 재작성:", rewritten);
console.log("  최상위:", store.search(v2, 1)[0].text);
console.log("\\n👉 재작성한 쪽이 '배송비 고객 부담' 을 정확히 찾습니다. 맥락을 질의에 녹여야 검색이 됩니다.");`,
      hints: [
        "후속 질문 그대로는 '배송비' 단어만 걸려 엉뚱하거나 약하게 매칭됩니다.",
        "독립 질의는 '환불'+'배송비' 맥락을 모두 담아 정답 청크를 정확히 겨냥합니다.",
        "다음 셀에서 이 '손으로 다시 쓰기' 를 LLM 에게 자동으로 시킵니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✏️ query rewriting — LLM 이 독립 질의를 만든다

이전 대화 + 후속 질문을 LLM 에 주고 **"검색에 쓸 독립 질문 하나"** 로 다시 쓰게 합니다.

\`\`\`
[대화 기록] 사용자: 환불 규정? / AI: 14일 이내...
[후속]      그때 배송비는?
        ↓ LLM query rewriter
[독립 질의] 환불 시 배송비는 누가 부담하나?   → 이걸로 검색
\`\`\``,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// LLM 으로 질의 재작성 → 검색
const sections = [
  "환불은 구매 후 14일 이내 신청할 수 있다.",
  "환불 승인 시 왕복 배송비는 고객이 부담한다.",
  "교환은 7일 이내 가능하다.",
];
const vecs = await embed(sections);
const store = new VectorStore();
store.add(sections.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] })));

// 이전 대화
const history = [
  { role: "user", content: "환불 규정 알려줘" },
  { role: "assistant", content: "환불은 구매 후 14일 이내 신청할 수 있어요." },
];
const followup = "그때 배송비는 누가 내?";

// ① 재작성
const rw = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "이전 대화를 참고해 사용자의 마지막 질문을, 그 자체로 이해되는 '독립 검색 질의' 한 문장으로 다시 써. 질문만 출력." },
    { role: "user", content: \`이전 대화:\\n\${history.map(h => h.role + ": " + h.content).join("\\n")}\\n\\n마지막 질문: \${followup}\` },
  ],
});
const standalone = rw.text.trim();
console.log("✏️ 재작성된 독립 질의:", standalone);

// ② 재작성된 질의로 검색
const [qVec] = await embed([standalone]);
const hits = store.search(qVec, 1);
console.log("🔍 검색 최상위:", hits[0].text, \`(유사도 \${hits[0].score.toFixed(3)})\`);
console.log("\\n👉 '그때' 가 '환불 시' 로 풀려 정확히 검색됩니다. 이게 멀티턴 RAG 의 핵심 트릭.");`,
      hints: [
        "재작성 결과가 따옴표·접두어를 달고 나오면 .trim() 외에 간단 정제(앞뒤 따옴표 제거)를 해도 좋습니다.",
        "재작성은 짧은 호출이라 비용이 작지만, 매 턴 1회 추가됩니다 — 단발 질문엔 생략하는 최적화도 가능.",
        "대화가 길면 history 전체 대신 '요약' 을 넣습니다(중2 메모리 강에서 심화).",
      ],
    },

    {
      type: "markdown",
      source: `## 🌱 지식 갱신 — 살아있는 트윈

트윈의 가장 큰 장점은 **재훈련 없이 즉시 갱신**(중1-01). 문서가 추가되면 임베딩만 더하면 끝.

\`\`\`
새 정책 추가 → embed → store.add → 다음 질문부터 즉시 반영 ✅
오래된 정책   → 해당 청크 제거(또는 버전 메타로 무효화)
\`\`\`

아래에서 트윈에 새 사실을 넣자마자 답이 바뀌는 걸 봅니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 트윈 갱신 — 새 문서를 넣으면 즉시 반영
const store = new VectorStore();
async function addDoc(id: string, text: string) {
  const [v] = await embed([text]);
  store.add([{ id, text, embedding: v }]);
}
async function ask(q: string) {
  const [qv] = await embed([q]);
  const top = store.search(qv, 1)[0];
  return top ? top.text : "(트윈 비어있음)";
}

await addDoc("p1", "환불은 14일 이내 가능하다.");
console.log("Q: 영업시간 알려줘");
console.log("A1 (갱신 전):", await ask("영업시간이 언제야?"));

// 새 정책이 생겼다! 재훈련 없이 트윈에 추가
await addDoc("p2", "고객센터 영업시간은 평일 9시부터 18시까지다.");
console.log("\\nQ: 영업시간 알려줘 (방금 추가)");
console.log("A2 (갱신 후):", await ask("영업시간이 언제야?"));
console.log("\\n👉 모델을 다시 훈련하지 않고, 트윈에 한 줄 더해 즉시 답이 바뀌었습니다.");`,
      hints: [
        "갱신 전엔 영업시간 청크가 없어 엉뚱한 답/약한 매칭, 추가 후엔 정확히 답합니다.",
        "삭제/수정은 해당 id 청크를 제거하거나, meta 에 version·validUntil 을 둬 필터링합니다.",
        "영속 트윈(중1-03)에선 추가분만 저장소에 반영하면 됩니다(증분 인덱싱).",
      ],
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 멀티턴 RAG 한 사이클

\`multiTurnAnswer(history, followup)\` 를 완성하세요.
① 후속 질문을 독립 질의로 재작성 → ② 검색 → ③ 근거로 답변.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const sections = [
  "프리미엄 요금제는 월 9900원이다.",
  "프리미엄은 광고 제거와 무제한 저장을 제공한다.",
  "무료 요금제는 저장 용량이 1GB 로 제한된다.",
];
const vecs = await embed(sections);
const store = new VectorStore();
store.add(sections.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] })));

// 🎯 TODO: ① 재작성 ② 검색 ③ 답변
async function multiTurnAnswer(history: {role:string;content:string}[], followup: string): Promise<void> {
  // TODO 1: history + followup 으로 독립 질의 재작성 (chat)
  // TODO 2: 재작성 질의로 store.search
  // TODO 3: 근거를 context 로 chat 답변
}

const history = [
  { role: "user", content: "프리미엄 요금제 얼마야?" },
  { role: "assistant", content: "프리미엄은 월 9900원입니다." },
];
await multiTurnAnswer(history, "그거 쓰면 뭐가 좋아?");  // '그거' = 프리미엄
console.log("👉 '그거' 가 '프리미엄' 으로 풀려 혜택(광고 제거·무제한 저장)을 답하면 성공.");`,
      hints: [
        "재작성: chat(system:'이전 대화 참고해 독립 질의 한 문장으로', user: history+followup) → .text.trim()",
        "검색: const [qv]=await embed([standalone]); const hits=store.search(qv,2);",
        "답변: chat(system:'근거만 사용', user:`근거:\\n${context}\\n\\n질문:${standalone}`)",
      ],
      solution: `const sections = [
  "프리미엄 요금제는 월 9900원이다.",
  "프리미엄은 광고 제거와 무제한 저장을 제공한다.",
  "무료 요금제는 저장 용량이 1GB 로 제한된다.",
];
const vecs = await embed(sections);
const store = new VectorStore();
store.add(sections.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] })));

async function multiTurnAnswer(history: {role:string;content:string}[], followup: string): Promise<void> {
  const rw = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "이전 대화를 참고해 마지막 질문을 독립 검색 질의 한 문장으로 다시 써. 질문만 출력." },
      { role: "user", content: \`이전 대화:\\n\${history.map(h => h.role + ": " + h.content).join("\\n")}\\n\\n마지막 질문: \${followup}\` },
    ],
  });
  const standalone = rw.text.trim();
  console.log("✏️ 재작성:", standalone);

  const [qv] = await embed([standalone]);
  const hits = store.search(qv, 2);
  const context = hits.map((h, i) => \`[\${i + 1}] \${h.text}\`).join("\\n");

  const ans = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "아래 근거만 사용해 한국어로 답해. 없으면 '문서에 없음'." },
      { role: "user", content: \`근거:\\n\${context}\\n\\n질문: \${standalone}\` },
    ],
  });
  console.log("💬", ans.text.trim());
}

const history = [
  { role: "user", content: "프리미엄 요금제 얼마야?" },
  { role: "assistant", content: "프리미엄은 월 9900원입니다." },
];
await multiTurnAnswer(history, "그거 쓰면 뭐가 좋아?");`,
    },

    {
      type: "markdown",
      source: `## 🧭 중1-07 정리

- ✅ ==query rewriting== — 맥락 의존 질문을 **독립 질의**로 재작성해야 검색이 된다
- ✅ 멀티턴 RAG 사이클: **재작성 → 검색 → 근거로 답**
- ✅ 지식 ==갱신== — 재훈련 없이 트윈에 추가/삭제로 즉시 최신화 (트윈의 핵심 가치)

### 다음 — 중1-Capstone 도메인 지식 트윈 RAG
배운 모든 것을 묶습니다:
- 청킹·메타데이터(04) + 하이브리드·재랭킹(05) + 정확한 인용(06) + 멀티턴(07) + 영속(03)
- **출처를 클릭할 수 있는, 새로고침해도 살아있는, 대화형 도메인 Q&A 트윈**`,
    },
  ],

  quiz: {
    title: "중1-07 — 멀티턴 & 지식 갱신 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "'그때 배송비는?' 같은 후속 질문을 그대로 검색하면 안 되는 이유는?",
        options: [
          "질문이 너무 길어서",
          "'그때' 등 대명사·맥락이 빠져 검색기가 무엇을 찾을지 모르기 때문",
          "임베딩이 불가능해서",
          "토큰이 부족해서",
        ],
        correctIndex: 1,
        explanation: "후속 질문은 앞 대화에 기댄다. 맥락이 빠진 채 검색하면 엉뚱한 청크가 잡힌다. query rewriting 으로 독립 질의를 만들어야 한다.",
      },
      {
        type: "multiple-choice",
        question: "query rewriting(질의 재작성)이 하는 일은?",
        options: [
          "답변을 더 길게 만든다",
          "이전 대화 맥락을 녹여, 그 자체로 이해되는 독립 검색 질의로 다시 쓴다",
          "임베딩 차원을 늘린다",
          "검색을 생략한다",
        ],
        correctIndex: 1,
        explanation: "'그때 배송비는?' → '환불 시 배송비는 누가 부담하나?' 처럼 맥락을 질의에 담아야 검색기가 정답 청크를 겨냥한다.",
      },
      {
        type: "multiple-choice",
        question: "트윈(RAG)의 '지식 갱신' 이 학습(파인튜닝)보다 나은 점은?",
        options: [
          "GPU 가 더 많이 필요하다",
          "문서를 추가/삭제하면 재훈련 없이 즉시 반영된다",
          "출처를 숨길 수 있다",
          "토큰 비용이 0 이 된다",
        ],
        correctIndex: 1,
        explanation: "트윈의 핵심 가치(중1-01). 새 정책이 생기면 임베딩만 더하면 다음 질문부터 반영. 재훈련의 느림·비용이 없다.",
      },
    ],
  } satisfies Quiz,
};
