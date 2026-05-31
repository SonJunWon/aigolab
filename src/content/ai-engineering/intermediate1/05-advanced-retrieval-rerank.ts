import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson05: Lesson = {
  id: "ai-eng-m1-05-advanced-retrieval-rerank",
  language: "ai-engineering",
  track: "intermediate1",
  order: 5,
  title: "고급 검색·재랭킹 — 트윈에서 정확히 꺼내기",
  subtitle: "하이브리드 검색 복습 + 입문이 약속만 한 Re-ranking 을 코드로",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🏆 고급 검색 · 재랭킹

> 💡 보라색 점선 밑줄 = 전문 용어.

트윈을 잘 잘라 담았으니, 이제 **정확히 꺼내는** 차례입니다.
입문 10강에서 ==BM25== ·==Hybrid== 까지 배웠지만, **==Re-ranking== 은 설명만** 하고 코드가 없었죠.
이번 강에서 그 **재랭킹을 코드로** 완성합니다.

### 배울 것
- 벡터 검색의 약점(정확 용어 매칭) → BM25 키워드 + ==RRF== **하이브리드** (빠른 복습)
- ==Re-ranking== — 후보를 LLM 이 **언어 이해로 다시 줄 세우기** (입문 미완 보강)
- ==cross-encoder== 재랭커 개념과 "언제 켜나"`,
    },

    {
      type: "markdown",
      source: `## 🔀 하이브리드 복습 — 벡터 + BM25 + RRF

| 검색 | 강점 | 약점 |
|---|---|---|
| 벡터(의미) | 유사 의미('보안'↔'암호화')도 잡음 | 정확 용어('AES-GCM') 약함 |
| ==BM25== (키워드) | 정확 단어 매칭 강함 | 의미 유사어 못 잡음 |

**==RRF==** 로 둘의 **순위**를 합칩니다: \`score = Σ 1/(k + rank)\` (k=60 표준).
두 검색에서 **모두 상위**인 문서가 최종 상위로 올라옵니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 하이브리드 검색 (벡터 + BM25 + RRF) — 입문 10강 복습
function tokenize(t: string) { return t.toLowerCase().split(/[\\s,.!?;:]+/).filter(t => t.length > 1); }

function bm25Search(docs: string[], query: string, topK = 5) {
  const qt = tokenize(query), N = docs.length;
  const avgDl = docs.reduce((s, d) => s + tokenize(d).length, 0) / N;
  const idf: Record<string, number> = {};
  for (const q of qt) {
    const df = docs.filter(d => tokenize(d).includes(q)).length;
    idf[q] = Math.log((N - df + 0.5) / (df + 0.5) + 1);
  }
  return docs.map((doc, idx) => {
    const tokens = tokenize(doc);
    let score = 0;
    for (const q of qt) {
      const tf = tokens.filter(t => t === q).length;
      score += (idf[q] ?? 0) * (tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * tokens.length / avgDl));
    }
    return { idx, text: doc, score };
  }).sort((a, b) => b.score - a.score).slice(0, topK);
}

const docs = [
  "API 키는 AES-GCM 으로 암호화되어 브라우저에만 저장됩니다.",
  "보안을 위해 모든 키는 디바이스별 암호키로 보호됩니다.",
  "Gemini 무료 티어는 일 1500회 요청을 지원합니다.",
  "WebLLM 은 브라우저에서 LLM 을 직접 실행합니다.",
];
const query = "API 키 보안 암호화";

const vecs = await embed(docs);
const [qVec] = await embed([query]);
const vec = docs.map((text, i) => ({ idx: i, text, score: cosineSimilarity(qVec, vecs[i]) }))
  .sort((a, b) => b.score - a.score);
const bm25 = bm25Search(docs, query);

const K = 60, rrf = new Map<number, number>();
vec.forEach((r, rank) => rrf.set(r.idx, (rrf.get(r.idx) ?? 0) + 1 / (K + rank + 1)));
bm25.forEach((r, rank) => rrf.set(r.idx, (rrf.get(r.idx) ?? 0) + 1 / (K + rank + 1)));
const hybrid = [...rrf.entries()].map(([idx, score]) => ({ idx, text: docs[idx], score }))
  .sort((a, b) => b.score - a.score);

console.log("🔀 Hybrid Top:");
hybrid.forEach((r, i) => console.log(\`  \${i + 1}. [doc \${r.idx}] RRF \${r.score.toFixed(4)} — \${r.text.slice(0, 40)}...\`));`,
      hints: [
        "doc[0](AES-GCM)은 벡터·BM25 모두 상위 → RRF 1위. doc[1]은 의미는 가깝지만 'AES-GCM' 단어가 없어 BM25 약함.",
        "K=60 은 표준. 작은 K 는 상위를 더 강조.",
        "하이브리드까지가 입문 10강 범위 — 다음 셀이 그 위에 '재랭킹' 을 얹습니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🏆 Re-ranking — LLM 이 다시 줄 세우기 (입문 미완 보강)

하이브리드는 **통계적** 유사도예요. "이 문맥에서 진짜 도움이 되나?" 라는 **뉘앙스**는 놓칠 수 있습니다.
그래서 상위 후보 5~10개를 **LLM 에게 보내** "질문에 도움 되는 순서로 다시 정렬해줘" 시킵니다.

\`\`\`
하이브리드 Top-N (대충 추린 후보)
        ↓  LLM 재랭커 ("이 질문에 가장 쓸모 있는 순서로")
정제된 Top-K  →  이것만 RAG context 로 → 정확도 ↑ + 토큰 절약
\`\`\`

아래에서 \`responseSchema\` 로 **순위 배열**을 받아 재정렬합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// LLM 재랭킹 — 후보를 언어 이해로 다시 줄 세우기
const question = "회원이 환불을 신청하면 배송비는 누가 부담하나요?";

// 하이브리드가 추렸다고 가정한 후보들 (순서는 '대충')
const candidates = [
  "환불은 구매 후 14일 이내 신청할 수 있다.",            // 관련 있지만 배송비 언급 없음
  "신상품 할인 쿠폰은 회원 가입 시 자동 지급된다.",        // 거의 무관(회원 단어만 겹침)
  "환불 승인 시 왕복 배송비는 전액 고객이 부담한다.",      // 질문 핵심 정답
  "교환은 7일 이내, 단순 변심도 가능하다.",               // 인접 주제
];

// ① 순위 스키마
const Ranking = z.object({
  order: z.array(z.number()).describe("질문에 도움 되는 순서대로의 후보 번호(0부터)"),
});

// ② LLM 에게 재정렬 요청
const listed = candidates.map((c, i) => \`[\${i}] \${c}\`).join("\\n");
const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "너는 검색 재랭커다. 질문에 실제로 도움 되는 순서대로 후보 번호를 정렬해 JSON 으로 답해." },
    { role: "user", content: \`질문: \${question}\\n\\n후보:\\n\${listed}\` },
  ],
  responseSchema: toJsonSchema(Ranking),
});

const { order } = Ranking.parse(res.json);

console.log("🔢 하이브리드 원래 순서: [0,1,2,3]");
console.log("🏆 LLM 재랭킹 순서:", order);
console.log("\\n재랭킹 Top 2 (이것만 context 로):");
order.slice(0, 2).forEach((idx, rank) => console.log(\`  \${rank + 1}. [\${idx}] \${candidates[idx]}\`));
console.log("\\n👉 정답인 [2](배송비 고객 부담)이 위로 올라오고, 무관한 [1](쿠폰)이 밀리면 성공.");`,
      hints: [
        "responseSchema 로 순위 배열을 강제 → res.json 에 파싱된 객체, Ranking.parse 로 런타임 검증(중급 답게 안전).",
        "통계 검색은 '환불·회원' 단어가 겹치는 [1] 을 잘못 올릴 수 있지만, LLM 은 '쿠폰은 배송비와 무관' 을 이해합니다.",
        "재랭킹 후 상위 K개만 context 로 쓰면 정확도↑ + 토큰↓ — 추가 LLM 호출 1회가 비용.",
      ],
    },

    {
      type: "markdown",
      source: `## 🧩 또 다른 재랭커 — cross-encoder & 언제 켜나

| 재랭커 | 방식 | 특징 |
|---|---|---|
| **LLM 재랭커** | 후보를 프롬프트로 보고 정렬 | 유연·강력, 호출 비용·지연 |
| **==cross-encoder==** | 질문+후보를 한 쌍으로 넣어 관련도 점수 (예: bge-reranker) | 전용 모델, 빠르고 저렴, 별도 인프라 |

> **bi-encoder vs cross-encoder**: 우리가 쓴 임베딩 검색은 질문·문서를 **따로** 인코딩(bi-encoder)해 빠르지만 거칠어요.
> cross-encoder 는 질문·문서를 **함께** 보고 정밀하게 채점 — 느려서 **상위 후보에만** 적용합니다(=재랭킹).

### 언제 재랭킹을 켜나
- ✅ 정확도가 중요하고, 지연 100~500ms 를 감내할 수 있을 때
- ✅ 밤새 처리·배치 분석처럼 시간 여유가 있을 때 → **항상 권장**
- ⚠️ 초저지연 실시간 채팅이면 후보 수를 줄이거나 cross-encoder 로`,
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 재랭킹 함수 만들기

\`rerank(question, candidates, topK)\` 를 완성하세요.
후보를 LLM 으로 재정렬하고 **상위 topK 개의 텍스트 배열**을 반환합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 🎯 TODO: rerank 완성 — LLM 으로 재정렬 후 상위 topK 텍스트 반환
async function rerank(question: string, candidates: string[], topK = 2): Promise<string[]> {
  const Ranking = z.object({ order: z.array(z.number()) });
  const listed = candidates.map((c, i) => \`[\${i}] \${c}\`).join("\\n");
  // TODO: chat 으로 responseSchema=toJsonSchema(Ranking) 호출
  // TODO: order 를 parse 해서 상위 topK 인덱스의 candidates 를 반환
  return [];
}

const question = "비밀번호를 잊어버렸을 때 어떻게 하나요?";
const candidates = [
  "비밀번호 재설정은 로그인 화면의 '비밀번호 찾기' 로 가능하다.",
  "회원 등급은 구매 금액에 따라 자동 산정된다.",
  "이메일 인증 후 새 비밀번호를 설정할 수 있다.",
  "포인트는 결제 시 1% 적립된다.",
];

const top = await rerank(question, candidates, 2);
console.log("재랭킹 Top 2:");
top.forEach((t, i) => console.log(\`  \${i + 1}. \${t}\`));
console.log("👉 비밀번호 관련 [0],[2] 가 올라오면 성공.");`,
      hints: [
        "const res = await chat({ provider:'gemini', messages:[{role:'system',content:'재랭커...'},{role:'user',content:`질문:${question}\\n후보:\\n${listed}`}], responseSchema: toJsonSchema(Ranking) });",
        "const { order } = Ranking.parse(res.json);",
        "return order.slice(0, topK).map(i => candidates[i]);",
      ],
      solution: `async function rerank(question: string, candidates: string[], topK = 2): Promise<string[]> {
  const Ranking = z.object({ order: z.array(z.number()) });
  const listed = candidates.map((c, i) => \`[\${i}] \${c}\`).join("\\n");
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "너는 검색 재랭커다. 질문에 도움 되는 순서대로 후보 번호를 정렬해 JSON 으로 답해." },
      { role: "user", content: \`질문: \${question}\\n\\n후보:\\n\${listed}\` },
    ],
    responseSchema: toJsonSchema(Ranking),
  });
  const { order } = Ranking.parse(res.json);
  return order.slice(0, topK).map((i) => candidates[i]).filter(Boolean);
}

const question = "비밀번호를 잊어버렸을 때 어떻게 하나요?";
const candidates = [
  "비밀번호 재설정은 로그인 화면의 '비밀번호 찾기' 로 가능하다.",
  "회원 등급은 구매 금액에 따라 자동 산정된다.",
  "이메일 인증 후 새 비밀번호를 설정할 수 있다.",
  "포인트는 결제 시 1% 적립된다.",
];
const top = await rerank(question, candidates, 2);
console.log("재랭킹 Top 2:");
top.forEach((t, i) => console.log(\`  \${i + 1}. \${t}\`));`,
    },

    {
      type: "markdown",
      source: `## 🧭 중1-05 정리

- ✅ 하이브리드(벡터+==BM25==+==RRF==) 복습 — 의미·정확 매칭의 상호 보완
- ✅ **==Re-ranking== 을 코드로** 완성 (입문 10강 미완 보강) — \`responseSchema\` 로 순위 배열 받기
- ✅ ==cross-encoder== 개념과 "언제 켜나" (정확도↔지연 트레이드오프)

### 다음 강 — 중1-06 정확한 인용
좋은 근거를 정확히 꺼냈으니, 이제 **출처를 정직하게** 답에 답니다:
- 청크 ==메타데이터== 로 답변→원문 **역추적**
- 입문 12강의 "[출처 N] 부정확" 문제 정면 해결
- 근거 밖이면 **거부** (환각 억제)`,
    },
  ],

  quiz: {
    title: "중1-05 — 고급 검색·재랭킹 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "벡터 검색과 BM25 를 RRF 로 결합하는 이유는?",
        options: [
          "임베딩을 저장하지 않으려고",
          "의미 유사도(벡터)와 정확 용어 매칭(BM25)의 강점을 상호 보완하려고",
          "LLM 호출을 없애려고",
          "청크를 더 잘게 자르려고",
        ],
        correctIndex: 1,
        explanation: "벡터는 유사 의미를, BM25 는 정확 단어를 잘 잡는다. RRF 는 두 검색의 순위를 합쳐 둘 다에서 상위인 문서를 최종 상위로 올린다.",
      },
      {
        type: "multiple-choice",
        question: "LLM 재랭킹이 통계적 검색(벡터/BM25)보다 나은 점은?",
        options: [
          "항상 더 빠르고 싸다",
          "'이 문맥에서 진짜 도움이 되나' 라는 의미적 뉘앙스를 언어 이해로 판단한다",
          "임베딩이 필요 없다",
          "메타데이터를 자동 생성한다",
        ],
        correctIndex: 1,
        explanation: "단어가 겹쳐도 무관한 후보를 통계 검색은 올릴 수 있다. LLM 은 질문과의 실제 관련성을 이해해 재정렬한다. 대가는 추가 호출 비용·지연.",
      },
      {
        type: "multiple-choice",
        question: "cross-encoder 재랭커를 보통 '상위 후보에만' 적용하는 이유는?",
        options: [
          "정확도가 낮아서",
          "질문+후보를 함께 인코딩해 정밀하지만 느려서, 전체 문서에 쓰면 비용이 큼",
          "메모리에 안 들어가서",
          "임베딩과 호환되지 않아서",
        ],
        correctIndex: 1,
        explanation: "bi-encoder(임베딩)는 빠르지만 거칠어 전체 검색에, cross-encoder 는 정밀하지만 느려 상위 후보 재랭킹에 쓴다 — 2단계 retrieve-then-rerank.",
      },
      {
        type: "multiple-choice",
        question: "재랭킹 결과를 responseSchema 로 받는 이점은?",
        options: [
          "모델이 자유 텍스트로 답해 파싱이 쉬워진다",
          "순위 배열 형식을 강제하고 response.json 으로 바로 받아, zod 로 런타임 검증까지 할 수 있다",
          "임베딩 비용이 사라진다",
          "BM25 가 필요 없어진다",
        ],
        correctIndex: 1,
        explanation: "responseSchema 로 {order:number[]} 를 강제하면 파싱 지옥 없이 구조화 결과를 얻고, zod.parse 로 형식 위반을 잡을 수 있다(입문 3강의 응용).",
      },
    ],
  } satisfies Quiz,
};
