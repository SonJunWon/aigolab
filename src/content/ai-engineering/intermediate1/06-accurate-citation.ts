import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson06: Lesson = {
  id: "ai-eng-m1-06-accurate-citation",
  language: "ai-engineering",
  track: "intermediate1",
  order: 6,
  title: "정확한 인용 — 트윈의 출처",
  subtitle: "답변에 출처를 정직하게 달고, 근거 밖이면 거부한다",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 📌 정확한 인용 (Citation)

> 💡 보라색 점선 밑줄 = 전문 용어.

근거를 잘 꺼냈어도, 답변이 **어느 근거에서 나왔는지** 추적할 수 없으면 신뢰하기 어렵습니다.
입문 12강 Capstone 은 \`[출처 N]\` 을 달았지만, 그 번호가 **실제 청크와 맞지 않는** 문제가 있었어요.
이번 강에서 **번호 = 실제 근거** 가 되도록 정확한 인용을 구현합니다.

### 배울 것
- 검색 결과에 **번호를 매겨** context 주입 → 답변의 \`[N]\` 을 **원문으로 역추적**
- 청크 ==메타데이터== (중1-04)로 "어느 문서·어디" 까지 표시
- ==faithfulness== — 근거 밖이면 **거부** (환각 억제)`,
    },

    {
      type: "markdown",
      source: `## 🤔 입문 12강의 문제 — 번호가 안 맞았다

\`\`\`
[입문 방식] searchKB 가 rank(1·2·3)만 돌려줌 → LLM 이 [출처 1] 이라 써도
            그게 '검색 1위' 인지 '실제 청크 c5' 인지 추적 불가 😢
\`\`\`

### 이번 강의 해법
\`\`\`
[개선] 검색 결과를 번호↔청크로 '매핑 보관' →
       context 에 [1] 청크A / [2] 청크B 로 번호 부여 →
       LLM 이 [1] 이라 인용하면 → 매핑으로 청크A(meta.source)까지 역추적 ✅
\`\`\``,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 번호 매긴 근거 → 답변의 [N] 을 원문으로 역추적
const sections = [
  { source: "환불정책.md", text: "환불은 구매 후 14일 이내 신청할 수 있다." },
  { source: "환불정책.md", text: "환불 승인 시 왕복 배송비는 고객이 부담한다." },
  { source: "배송안내.md", text: "일반 배송은 2-3일 소요된다." },
];

const vecs = await embed(sections.map(s => s.text));
const store = new VectorStore();
store.add(sections.map((s, i) => ({ id: \`c\${i}\`, text: s.text, embedding: vecs[i], meta: { source: s.source } })));

const question = "환불하면 며칠 안에 되고, 배송비는 누가 내나요?";
const [qVec] = await embed([question]);
const hits = store.search(qVec, 3);   // 👈 이 배열을 '매핑' 으로 보관

// 번호 매긴 context — [1],[2],[3] 이 hits[0],hits[1],hits[2] 와 1:1 대응
const context = hits.map((h, i) => \`[\${i + 1}] \${h.text}\`).join("\\n");

const answer = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "아래 근거만 사용해 한국어로 답하고, 각 문장 끝에 사용한 근거 번호를 [N] 형식으로 표기해. 근거에 없으면 추측하지 마." },
    { role: "user", content: \`근거:\\n\${context}\\n\\n질문: \${question}\` },
  ],
});

console.log("💬 답변:\\n" + answer.text);

// 답변의 [N] 을 실제 청크/출처로 역추적
console.log("\\n🔎 인용 역추적:");
const cited = [...answer.text.matchAll(/\\[(\\d+)\\]/g)].map(m => Number(m[1]));
[...new Set(cited)].forEach((n) => {
  const h = hits[n - 1];
  if (h) console.log(\`  [\${n}] → \${(h.meta as any).source}: "\${h.text}"\`);
});
console.log("\\n👉 [N] 이 실제 근거 청크·출처 파일로 정확히 이어집니다(입문의 부정확 문제 해결).");`,
      hints: [
        "핵심은 hits 배열을 버리지 않고 '매핑' 으로 보관하는 것 — [N] → hits[N-1] → meta.source.",
        "system 의 '각 문장 끝에 [N]' 지시가 모델이 인용을 달게 만듭니다.",
        "정규식 /\\[(\\d+)\\]/g 로 답변에서 인용 번호만 추출해 역추적합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🚫 근거 밖이면 거부 — faithfulness

정확한 인용의 다른 한 축은 **"모르면 모른다"** 입니다(==faithfulness==, 근거 충실도).
근거에 없는 걸 그럴듯하게 지어내면(환각), 인용은 무의미해져요.

\`\`\`
[좋은 RAG] 근거에 있음  → 인용과 함께 답
           근거에 없음  → "제공된 문서에 없습니다" (거부)
\`\`\`

아래에서 **근거 밖 질문**엔 거부하고, **근거 안 질문**엔 인용하는지 대비해 봅니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 근거 안/밖 질문 대비 — 거부가 작동하는지
const sections = [
  { source: "환불정책.md", text: "환불은 구매 후 14일 이내 신청할 수 있다." },
  { source: "환불정책.md", text: "환불 승인 시 배송비는 고객이 부담한다." },
];
const vecs = await embed(sections.map(s => s.text));
const store = new VectorStore();
store.add(sections.map((s, i) => ({ id: \`c\${i}\`, text: s.text, embedding: vecs[i], meta: { source: s.source } })));

async function answerWithRefusal(question: string) {
  const [qVec] = await embed([question]);
  const hits = store.search(qVec, 2);
  const context = hits.map((h, i) => \`[\${i + 1}] \${h.text}\`).join("\\n");
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "아래 근거만 사용. 답할 수 있으면 [N] 인용과 함께 답하고, 근거에 없으면 정확히 '제공된 문서에 없습니다' 라고만 답해." },
      { role: "user", content: \`근거:\\n\${context}\\n\\n질문: \${question}\` },
    ],
  });
  console.log(\`Q: \${question}\\nA: \${res.text.trim()}\\n\`);
}

await answerWithRefusal("환불은 며칠 이내에 신청하나요?");   // 근거 안 → 인용 답
await answerWithRefusal("해외 배송도 되나요?");              // 근거 밖 → 거부
console.log("👉 근거 밖 질문엔 '문서에 없습니다' 로 거부해야 신뢰할 수 있는 RAG.");`,
      hints: [
        "거부 문구를 정확한 한 문장으로 지정하면, 후처리(거부 감지)나 UI 표시가 쉬워집니다.",
        "거부가 안 되고 지어내면 — system 을 더 단호하게 하거나 검색 score 임계값으로 '근거 부족 시 아예 호출 안 함' 을 겁니다.",
        "faithfulness 측정(근거로 뒷받침되는 문장 비율)은 중2 평가 강에서 자동화합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 인용 + 거부를 갖춘 답변 함수

\`answerWithCitation(question)\` 를 완성하세요.
- 검색 → 번호 매긴 근거로 답(각 문장에 \`[N]\`)
- 근거 밖이면 "제공된 문서에 없습니다"
- 답변에서 사용된 인용 번호를 **출처와 함께** 출력`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const sections = [
  { source: "보안.md", text: "API 키는 AES-GCM 으로 암호화되어 브라우저에만 저장된다." },
  { source: "보안.md", text: "키는 서버로 전송되지 않는다." },
  { source: "요금.md", text: "Gemini 무료 티어는 일 1500회를 지원한다." },
];
const vecs = await embed(sections.map(s => s.text));
const store = new VectorStore();
store.add(sections.map((s, i) => ({ id: \`c\${i}\`, text: s.text, embedding: vecs[i], meta: { source: s.source } })));

// 🎯 TODO: 검색 → 번호 context → 인용 답변 → 역추적 출력
async function answerWithCitation(question: string): Promise<void> {
  const [qVec] = await embed([question]);
  const hits = store.search(question ? qVec : qVec, 3);
  // TODO 1: context 를 [1],[2],[3] 형태로
  // TODO 2: chat 호출 (system: 근거만, [N] 인용, 없으면 '제공된 문서에 없습니다')
  // TODO 3: 답변 출력 + [N] 을 hits[N-1].meta.source 로 역추적 출력
}

await answerWithCitation("API 키는 어떻게 저장되나요?");
await answerWithCitation("환불 규정이 뭔가요?");   // 근거 밖 → 거부 기대`,
      hints: [
        "const context = hits.map((h,i)=>`[${i+1}] ${h.text}`).join('\\n');",
        "정규식: [...res.text.matchAll(/\\[(\\d+)\\]/g)].map(m=>Number(m[1]))",
        "역추적: const h = hits[n-1]; console.log(`[${n}] → ${(h.meta as any).source}`);",
      ],
      solution: `const sections = [
  { source: "보안.md", text: "API 키는 AES-GCM 으로 암호화되어 브라우저에만 저장된다." },
  { source: "보안.md", text: "키는 서버로 전송되지 않는다." },
  { source: "요금.md", text: "Gemini 무료 티어는 일 1500회를 지원한다." },
];
const vecs = await embed(sections.map(s => s.text));
const store = new VectorStore();
store.add(sections.map((s, i) => ({ id: \`c\${i}\`, text: s.text, embedding: vecs[i], meta: { source: s.source } })));

async function answerWithCitation(question: string): Promise<void> {
  const [qVec] = await embed([question]);
  const hits = store.search(qVec, 3);
  const context = hits.map((h, i) => \`[\${i + 1}] \${h.text}\`).join("\\n");
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "아래 근거만 사용. 답할 수 있으면 각 문장 끝에 [N] 인용을 달고, 근거에 없으면 정확히 '제공된 문서에 없습니다' 라고만 답해." },
      { role: "user", content: \`근거:\\n\${context}\\n\\n질문: \${question}\` },
    ],
  });
  console.log(\`Q: \${question}\`);
  console.log("A:", res.text.trim());
  const cited = [...new Set([...res.text.matchAll(/\\[(\\d+)\\]/g)].map(m => Number(m[1])))];
  cited.forEach((n) => {
    const h = hits[n - 1];
    if (h) console.log(\`   [\${n}] → \${(h.meta as any).source}: "\${h.text}"\`);
  });
  console.log("");
}

await answerWithCitation("API 키는 어떻게 저장되나요?");
await answerWithCitation("환불 규정이 뭔가요?");`,
    },

    {
      type: "markdown",
      source: `## 🧭 중1-06 정리

- ✅ 검색 결과를 **번호↔청크로 매핑** → 답변의 \`[N]\` 을 **원문·출처로 역추적**
- ✅ 입문 12강 "[출처 N] 부정확" 문제 **정면 해결**
- ✅ ==faithfulness== — 근거 밖이면 **정해진 문구로 거부** (환각 억제)

### 다음 강 — 중1-07 멀티턴 & 지식 갱신
이제 트윈이 **대화** 속에서 살아 움직이게:
- "그건 어떻게 해?" 같은 맥락 의존 질문을 **독립 질의로 재작성**
- 대화 메모리, 그리고 문서 추가/삭제 시 **트윈 갱신**`,
    },
  ],

  quiz: {
    title: "중1-06 — 정확한 인용 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "입문 12강의 [출처 N] 이 부정확했던 근본 원인은?",
        options: [
          "임베딩 모델이 약해서",
          "검색이 rank 만 돌려주고 번호↔실제 청크 매핑을 보관하지 않아 역추적이 불가능해서",
          "temperature 가 높아서",
          "청크가 너무 작아서",
        ],
        correctIndex: 1,
        explanation: "번호가 실제 어느 청크인지 매핑을 잃으면 [N] 은 신뢰할 수 없다. 검색 결과 배열을 보관해 [N]→hits[N-1]→meta 로 이어야 정확한 인용이 된다.",
      },
      {
        type: "multiple-choice",
        question: "정확한 인용을 구현하는 핵심 단계는?",
        options: [
          "검색 결과를 버리고 LLM 이 알아서 출처를 만들게 한다",
          "검색 결과에 번호를 매겨 context 에 넣고, 그 번호↔청크 매핑을 보관해 답변의 [N] 을 역추적한다",
          "temperature 를 0 으로 둔다",
          "모든 청크를 한 번호로 묶는다",
        ],
        correctIndex: 1,
        explanation: "번호 매긴 근거를 주고 매핑을 보관하면, LLM 이 단 [N] 을 실제 청크·출처로 정확히 되짚을 수 있다.",
      },
      {
        type: "multiple-choice",
        question: "faithfulness(근거 충실도)를 높이는 기본 장치는?",
        options: [
          "근거에 없어도 그럴듯하게 답하게 한다",
          "근거 밖이면 정해진 문구('제공된 문서에 없습니다')로 거부하게 한다",
          "인용을 모두 제거한다",
          "검색 K 를 무한대로 한다",
        ],
        correctIndex: 1,
        explanation: "근거 밖 질문에 지어내지 않고 거부하는 것이 환각 억제의 핵심. 정해진 거부 문구는 후처리·UI 표시도 쉽게 한다.",
      },
    ],
  } satisfies Quiz,
};
