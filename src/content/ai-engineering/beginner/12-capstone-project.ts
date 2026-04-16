import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson12: Lesson = {
  id: "ai-eng-12-capstone-project",
  language: "ai-engineering",
  track: "beginner",
  order: 12,
  title: "종합 프로젝트 — AI 문서 Q&A 시스템",
  subtitle: "12강 전체 기법을 하나의 앱으로 조립",
  estimatedMinutes: 60,
  cells: [
    {
      type: "markdown",
      source: `# 🎓 종합 프로젝트 — 12강의 총결산

축하합니다! 여기까지 온 여러분은 이미 LLM 앱 개발의 핵심을 모두 배웠어요.

### 12강에서 배운 기술 스택

| # | 기법 | SDK API |
|---|---|---|
| 01 | 브라우저 내 LLM | \`chat({ task: "offline" })\` |
| 02 | 프롬프트 엔지니어링 | system prompt / few-shot / temperature |
| 03 | 구조화 출력 | \`responseSchema\` + zod |
| 04 | Chain of Thought | \`stream: true\` + onToken |
| 05 | Tool Calling | \`tools[]\` + \`chatWithTools\` |
| 06 | 단일 에이전트 | Think-Act-Observe 루프 |
| 07 | 멀티 에이전트 | 파이프라인 + Critic Loop |
| 08 | 임베딩 | \`embed()\` + 코사인 유사도 |
| 09 | RAG | 청킹 → 벡터 검색 → LLM context 주입 |
| 10 | Hybrid RAG | BM25 + RRF + Re-ranking |
| 11 | 생태계 비교 | 1B vs 70B vs Gemini 벤치마크 |

### 이 프로젝트에서 조립할 것

**"AI 문서 Q&A 시스템"** — 사용자가 문서를 입력하면:
1. **청킹 + 임베딩 + 저장** (Ch08~09)
2. 질문에 대해 **Hybrid 검색** (Ch10)
3. 검색 결과를 **구조화 출력** 으로 정리 (Ch03)
4. CoT **스트리밍** 으로 답변 생성 (Ch04)
5. 답변에 **출처 번호** 첨부
6. 전체 과정이 **에이전트** 로 자동 오케스트레이션 (Ch06)

모든 기법이 **하나의 함수 호출** 로 합쳐집니다.`,
    },

    {
      type: "markdown",
      source: `## 🏗️ 아키텍처

\`\`\`
사용자: "이 문서에서 보안은 어떻게 처리돼?"
  ↓
[에이전트 시작]
  ↓
[🔧 Tool: indexDocument] 문서 청킹 + 임베딩 + VectorStore 저장
  ↓
[🔧 Tool: searchKB]     질문 임베딩 → Hybrid 검색 (벡터 + 키워드)
  ↓
[🧠 Think + Stream]     검색된 context 기반으로 CoT 답변 생성
  ↓
[✅ Answer]              출처 번호가 달린 구조화 답변
\`\`\`

### 필요한 tool 3개
1. \`indexDocument(text)\` — 문서를 청킹 + 임베딩 + 저장
2. \`searchKB(query)\` — 질문으로 관련 청크 검색
3. \`generateAnswer(question, context)\` — 검색 결과 기반 답변 (사실은 에이전트가 직접)

실제로 tool 은 2개 (indexDocument + searchKB) 만 쓰고, 답변은 에이전트가 context 를 보고 직접 작성합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 종합 프로젝트: AI 문서 Q&A 시스템 ──

// 유틸: 청커
function chunkText(text: string, maxLen = 300): string[] {
  const paras = text.split(/\\n\\n+/).filter(p => p.trim());
  const chunks: string[] = [];
  let current = "";
  for (const p of paras) {
    if (current.length + p.length > maxLen && current) {
      chunks.push(current.trim());
      current = "";
    }
    current += (current ? "\\n\\n" : "") + p;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// 유틸: 간단 BM25
function tokenize(t: string) { return t.toLowerCase().split(/[\\s,.!?;:]+/).filter(t => t.length > 1); }
function bm25Score(docs: string[], query: string) {
  const qt = tokenize(query), N = docs.length;
  const avgDl = docs.reduce((s, d) => s + tokenize(d).length, 0) / N;
  return docs.map((doc, idx) => {
    const tokens = tokenize(doc);
    let score = 0;
    for (const q of qt) {
      const df = docs.filter(d => tokenize(d).includes(q)).length;
      const tf = tokens.filter(t => t === q).length;
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
      score += idf * (tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * tokens.length / avgDl));
    }
    return { idx, score };
  });
}

// ── 전역 VectorStore ──
const kb = new VectorStore();
let kbTexts: string[] = [];

// ── Tool 정의 ──
const indexDocument = {
  name: "indexDocument",
  description: "문서 텍스트를 받아 청킹 + 임베딩 후 지식 베이스에 저장. 이미 저장됐으면 건너뜀.",
  parameters: {
    type: "object",
    properties: { text: { type: "string", description: "저장할 문서 전체 텍스트" } },
    required: ["text"],
  },
  execute: async ({ text }: { text: string }) => {
    if (kb.size > 0) return { status: "already indexed", chunks: kb.size };
    const chunks = chunkText(text);
    kbTexts = chunks;
    const vecs = await embed(chunks);
    kb.add(chunks.map((t, i) => ({ id: \`c\${i}\`, text: t, embedding: vecs[i] })));
    return { status: "indexed", chunks: chunks.length };
  },
};

const searchKB = {
  name: "searchKB",
  description: "질문으로 지식 베이스에서 관련 청크 Top 3 검색 (Hybrid: 벡터 + BM25).",
  parameters: {
    type: "object",
    properties: { query: { type: "string" } },
    required: ["query"],
  },
  execute: async ({ query }: { query: string }) => {
    if (kb.size === 0) return { error: "KB 비어있음. 먼저 indexDocument 호출 필요." };

    // 벡터 검색
    const [qVec] = await embed([query]);
    const vecResults = kb.search(qVec, 5);

    // BM25
    const bm25Results = bm25Score(kbTexts, query);

    // RRF 결합
    const K = 60;
    const scores = new Map<string, number>();
    vecResults.forEach((r, rank) => {
      scores.set(r.id, (scores.get(r.id) ?? 0) + 1 / (K + rank + 1));
    });
    bm25Results.sort((a, b) => b.score - a.score).slice(0, 5).forEach((r, rank) => {
      const id = \`c\${r.idx}\`;
      scores.set(id, (scores.get(id) ?? 0) + 1 / (K + rank + 1));
    });

    const hybrid = Array.from(scores.entries())
      .map(([id, score]) => {
        const doc = vecResults.find(r => r.id === id) ?? { id, text: kbTexts[parseInt(id.slice(1))] ?? "", score: 0 };
        return { id, text: (doc as { text: string }).text, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return { results: hybrid.map((r, i) => ({ rank: i + 1, text: r.text, score: r.score.toFixed(4) })) };
  },
};

// ── 에이전트 실행 ──
const document = \`AIGoLab은 브라우저 기반 AI 교육 플랫폼입니다.
Python, JavaScript, SQL, AI 엔지니어링 트랙을 제공합니다.

WebLLM 기술로 브라우저 안에서 직접 LLM을 실행할 수 있어 인터넷 없이도 AI 실습이 가능합니다.
모델은 IndexedDB에 캐시되어 두 번째부터는 수 초 내 준비됩니다.

API 키는 Web Crypto AES-GCM으로 암호화되어 사용자 브라우저에만 저장됩니다.
서버로 전송되지 않으며 디바이스별 non-extractable CryptoKey로 보호됩니다.

Gemini 2.5 Flash 무료 티어는 일 1500회 요청을 지원하며
Groq Llama 3.3 70B는 일 14400회 무료입니다.

구조화 출력, Chain of Thought, Tool Calling, 에이전트, RAG까지
12강으로 구성된 체계적 커리큘럼을 제공합니다.\`;

const question = "이 플랫폼의 보안은 어떻게 처리되나요?";

console.log("📄 문서 길이:", document.length, "자");
console.log("❓ 질문:", question);
console.log();

const res = await chatWithTools({
  provider: "gemini",
  stream: true,
  messages: [
    {
      role: "system",
      content: \`너는 문서 Q&A 에이전트야.
순서:
1. indexDocument 로 문서를 지식 베이스에 저장
2. searchKB 로 질문 관련 청크 검색
3. 검색된 청크만 참고해 한국어로 답변. 각 정보 뒤에 [출처 N] 형태로 청크 번호를 표기해.
context 에 없는 내용은 "문서에 해당 정보가 없습니다" 라고 해.\`,
    },
    {
      role: "user",
      content: \`문서:\\n\${document}\\n\\n질문: \${question}\`,
    },
  ],
  tools: [indexDocument, searchKB],
});

console.log("\\n💬 최종 답변:");
console.log(res.text);`,
      hints: [
        "에이전트 로그에서 indexDocument → searchKB → 최종 답변 3단계가 보이는지 확인.",
        "question 을 바꿔보세요: '어떤 언어 트랙이 있어?', '오프라인 실습이 가능한가?', '무료 한도는?' 등.",
        "문서 자체를 바꿔보세요 — 자기 회사 소개, 논문 초록, 제품 설명서 등 아무 텍스트나 가능.",
      ],
    },

    {
      type: "markdown",
      source: `## 🎯 미션: 나만의 문서 Q&A 시스템

### 요구사항
1. **자신만의 문서** 를 사용 (위키, 블로그, 수업 자료 등 아무거나)
2. indexDocument + searchKB tool 활용 (위 코드 재사용 OK)
3. 최소 **3개 질문** 을 던져 답변 품질 확인
4. 답변에 **[출처 N]** 이 정확히 달리는지 확인

### 보너스
- 청크 크기 변경 (100자 vs 500자) 으로 검색 품질 비교
- Groq provider 로 바꿔 속도 차이 체감
- 답변을 구조화 출력 (responseSchema) 으로 받아 JSON 으로 정리`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// TODO: 위 에이전트 코드를 기반으로 나만의 문서 Q&A 시스템을 만들어보세요!
//
// 1. document 변수에 본인만의 텍스트 붙여넣기
// 2. question 을 3가지 이상 바꿔가며 실행
// 3. 답변의 [출처 N] 이 실제 청크와 맞는지 확인
//
// 위 셀의 코드를 그대로 복사해 document 와 question 만 바꿔도 됩니다!

throw new Error("미구현 — 나만의 문서를 넣고 실행해보세요!");`,
      hints: [
        "위 셀 코드를 그대로 복사 → document 와 question 만 변경하면 됩니다.",
        "한국어 위키피디아에서 관심 주제 복사 붙여넣기 → 즉석 Q&A 시스템 완성.",
        "3개 질문 중 1개는 '문서에 없는 내용' 으로 → '정보 없음' 답변하는지 확인.",
      ],
      solution: `// 예시: 한국의 계절 문서로 Q&A

// 유틸 (위 셀에서 복사)
function chunkText(text: string, maxLen = 300): string[] {
  const paras = text.split(/\\n\\n+/).filter(p => p.trim());
  const chunks: string[] = [];
  let current = "";
  for (const p of paras) {
    if (current.length + p.length > maxLen && current) { chunks.push(current.trim()); current = ""; }
    current += (current ? "\\n\\n" : "") + p;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function tokenize(t: string) { return t.toLowerCase().split(/[\\s,.!?;:]+/).filter(t => t.length > 1); }
function bm25Score(docs: string[], query: string) {
  const qt = tokenize(query), N = docs.length;
  const avgDl = docs.reduce((s, d) => s + tokenize(d).length, 0) / N;
  return docs.map((doc, idx) => {
    const tokens = tokenize(doc);
    let score = 0;
    for (const q of qt) {
      const df = docs.filter(d => tokenize(d).includes(q)).length;
      const tf = tokens.filter(t => t === q).length;
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
      score += idf * (tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * tokens.length / avgDl));
    }
    return { idx, score };
  });
}

const kb2 = new VectorStore();
let kb2Texts: string[] = [];

const indexDoc2 = {
  name: "indexDocument",
  description: "문서를 청킹+임베딩 후 저장",
  parameters: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
  execute: async ({ text }: { text: string }) => {
    if (kb2.size > 0) return { status: "already indexed", chunks: kb2.size };
    const chunks = chunkText(text);
    kb2Texts = chunks;
    const vecs = await embed(chunks);
    kb2.add(chunks.map((t, i) => ({ id: \`c\${i}\`, text: t, embedding: vecs[i] })));
    return { status: "indexed", chunks: chunks.length };
  },
};

const searchKB2 = {
  name: "searchKB",
  description: "질문으로 관련 청크 Top 3 Hybrid 검색",
  parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  execute: async ({ query }: { query: string }) => {
    const [qVec] = await embed([query]);
    const vecR = kb2.search(qVec, 5);
    const bm25R = bm25Score(kb2Texts, query).sort((a, b) => b.score - a.score).slice(0, 5);
    const K = 60, scores = new Map<string, number>();
    vecR.forEach((r, rank) => scores.set(r.id, (scores.get(r.id) ?? 0) + 1 / (K + rank + 1)));
    bm25R.forEach((r, rank) => { const id = \`c\${r.idx}\`; scores.set(id, (scores.get(id) ?? 0) + 1 / (K + rank + 1)); });
    return { results: Array.from(scores.entries())
      .map(([id, score]) => ({ id, text: kb2Texts[parseInt(id.slice(1))] ?? "", score: score.toFixed(4) }))
      .sort((a, b) => parseFloat(b.score) - parseFloat(a.score)).slice(0, 3) };
  },
};

const myDoc = \`한국은 사계절이 뚜렷한 나라입니다.

봄(3~5월)에는 벚꽃이 피고 기온이 10~20도 사이입니다.
진해, 여의도 등이 대표적인 벚꽃 명소입니다.

여름(6~8월)에는 장마와 무더위가 있으며 기온이 30도를 넘깁니다.
해수욕장과 계곡이 인기 피서지입니다.

가을(9~11월)에는 단풍이 아름답고 기온이 10~25도로 쾌적합니다.
설악산, 내장산 등이 단풍 명소로 유명합니다.

겨울(12~2월)에는 눈이 오고 기온이 영하로 떨어집니다.
스키장과 온천이 인기 있는 겨울 활동입니다.\`;

const questions = [
  "한국에서 벚꽃을 볼 수 있는 곳은?",
  "겨울에 할 수 있는 활동은?",
  "한국의 인구는?",  // 문서에 없는 질문
];

for (const q of questions) {
  console.log("\\n❓", q);
  const res = await chatWithTools({
    provider: "gemini",
    messages: [
      { role: "system", content: "문서 Q&A 에이전트. indexDocument → searchKB → 답변. [출처 N] 표기. 없으면 '정보 없음'." },
      { role: "user", content: \`문서:\\n\${myDoc}\\n\\n질문: \${q}\` },
    ],
    tools: [indexDoc2, searchKB2],
  });
  console.log("💬", res.text);
}`,
    },

    {
      type: "markdown",
      source: `## 🎓 12강 완주! 수료를 축하합니다

### 여러분이 할 수 있게 된 것

1. ✅ **브라우저에서 AI 실행** (WebLLM + WebGPU)
2. ✅ **클라우드 LLM API** 자유롭게 호출 (Gemini / Groq)
3. ✅ **프롬프트 엔지니어링** 3대 기법 (system / few-shot / temperature)
4. ✅ **JSON Schema + zod** 로 구조화 출력 (타입 안전 + 런타임 검증)
5. ✅ **Chain of Thought** 로 복잡한 추론 + 스트리밍
6. ✅ **Tool Calling** 으로 외부 함수 연동
7. ✅ **단일/멀티 에이전트** 시스템 설계
8. ✅ **임베딩 + 벡터 검색** (브라우저 내 Transformers.js)
9. ✅ **RAG 전체 파이프라인** (청킹 → 임베딩 → 검색 → 답변)
10. ✅ **Hybrid RAG** (BM25 + 벡터 + Re-ranking)
11. ✅ **LLM 생태계 비교** 와 적재적소 선택
12. ✅ **종합 시스템** 구축 (이 프로젝트)

### 다음은?
- 🏢 **실무 적용** — 이 기술로 사내 챗봇, 고객 지원, 문서 검색 시스템 구축
- 📚 **심화 학습** — Fine-tuning, RLHF, 벡터 DB (Pinecone/Weaviate), LangChain/LlamaIndex
- 🤝 **커뮤니티** — AIGoLab 에서 다른 학습자와 프로젝트 공유

### 🦙 Built with Llama · ✨ Powered by Gemini · ⚡ Accelerated by Groq

> "AI 를 사용하는 것과 AI 를 만드는 것은 완전히 다른 경험이다.
> 여러분은 이제 **만드는 쪽** 에 섰습니다." 🚀`,
    },
  ],

  quiz: {
    title: "Ch12 — 종합 프로젝트 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "이 종합 프로젝트의 AI 문서 Q&A 시스템이 사용하는 기법 조합은?",
        options: [
          "임베딩만",
          "chatWithTools 에이전트 + 청킹 + Hybrid 검색 (벡터+BM25) + 구조화 답변 + 스트리밍",
          "Tool Calling 만",
          "WebLLM 만",
        ],
        correctIndex: 1,
        explanation: "12강의 기법이 하나로 합쳐짐: 에이전트(Ch06) 가 tool(Ch05) 로 문서 인덱싱(Ch09) + Hybrid 검색(Ch10) 을 오케스트레이션하고, 스트리밍(Ch04) 으로 답변 생성.",
      },
      {
        type: "multiple-choice",
        question: "RAG 에서 답변에 '[출처 N]' 을 표기하는 이유는?",
        options: [
          "코드 컨벤션",
          "사용자가 AI 답변의 근거를 확인하고, 환각(hallucination) 을 감지할 수 있도록",
          "토큰 수를 줄이기 위해",
          "JSON 포맷 요구사항",
        ],
        correctIndex: 1,
        explanation: "출처 표기는 RAG 의 핵심 가치 — '이 정보가 어떤 청크에서 왔는지' 추적 가능성. 사용자가 틀린 답변을 발견하기 쉬워짐.",
      },
      {
        type: "multiple-choice",
        question: "12강을 완주한 후 다음 학습으로 적합하지 않은 것은?",
        options: [
          "Fine-tuning 으로 도메인 특화 모델 만들기",
          "Pinecone/Weaviate 같은 관리형 벡터 DB 사용",
          "LangChain/LlamaIndex 프레임워크 학습",
          "HTML 기초 배우기 — AI 와 무관하지만 필수",
        ],
        correctIndex: 3,
        explanation: "HTML 은 웹 기초지만 AI 엔지니어링 심화와는 별개. Fine-tuning, 벡터 DB, LLM 프레임워크가 자연스러운 다음 단계.",
      },
    ],
  } satisfies Quiz,
};
