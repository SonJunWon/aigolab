import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson10: Lesson = {
  id: "ai-eng-10-hybrid-rag",
  language: "ai-engineering",
  track: "beginner",
  order: 10,
  title: "Hybrid RAG + Re-ranking",
  subtitle: "키워드 + 벡터 검색 결합으로 RAG 품질 끌어올리기",
  estimatedMinutes: 40,
  cells: [
    {
      type: "markdown",
      source: `# 🔀 벡터 검색만으로는 부족할 때

Ch09 의 RAG 는 **벡터 검색** 만 사용. 대부분 잘 작동하지만 약점이 있어요.

### 벡터 검색의 약점
| 상황 | 문제 |
|---|---|
| "AES-GCM" 같은 **정확한 기술 용어** 검색 | 의미는 비슷해도 정확한 단어 매칭 실패 |
| "Error 코드 404" | 숫자·코드 같은 **리터럴 매칭** 이 필요한 경우 |
| 새로운 약어·고유명사 | 임베딩 모델이 학습 안 한 용어 |

### 해법: Hybrid (벡터 + 키워드) 검색
1. **벡터 검색** — 의미적 유사도 (Ch08~09)
2. **키워드 검색 (BM25)** — 단어 빈도 기반 정확 매칭
3. **결합** — 두 결과를 합쳐 순위 재조정
4. **(선택) LLM Re-ranking** — 상위 후보를 LLM 이 다시 평가

## 이 장에서 배울 것
1. 간단한 BM25 키워드 검색 구현
2. Hybrid 결합 (Reciprocal Rank Fusion)
3. LLM Re-ranking
4. 미션: Hybrid RAG 전체 파이프라인`,
    },

    {
      type: "markdown",
      source: `## 🔤 BM25 — 키워드 검색의 표준

**BM25** 는 "검색어의 각 단어가 문서에 얼마나 자주, 얼마나 독점적으로 나타나는지" 를 점수화.

### 간단 구현 (교육용)
- 문서마다 단어 빈도 (term frequency) 계산
- 쿼리 단어가 문서에 많이 있을수록 점수 ↑
- 너무 흔한 단어 (예: "는", "을") 는 가치 ↓ (IDF 효과)

아래 셀에서 미니 BM25 를 직접 구현해봅시다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 교육용 간단 BM25 — 실무에선 라이브러리 사용 권장
function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[\\s,.!?;:'"()\\[\\]{}]+/).filter(t => t.length > 1);
}

function bm25Search(docs: string[], query: string, topK = 3) {
  const queryTokens = tokenize(query);
  const N = docs.length;
  const avgDl = docs.reduce((s, d) => s + tokenize(d).length, 0) / N;
  const k1 = 1.2, b = 0.75;

  // IDF 계산
  const idf: Record<string, number> = {};
  for (const qt of queryTokens) {
    const df = docs.filter(d => tokenize(d).includes(qt)).length;
    idf[qt] = Math.log((N - df + 0.5) / (df + 0.5) + 1);
  }

  // 각 문서 점수
  const scored = docs.map((doc, idx) => {
    const tokens = tokenize(doc);
    const dl = tokens.length;
    let score = 0;
    for (const qt of queryTokens) {
      const tf = tokens.filter(t => t === qt).length;
      score += (idf[qt] ?? 0) * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / avgDl));
    }
    return { idx, text: doc, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}

// 테스트
const docs = [
  "API 키는 AES-GCM 으로 암호화되어 브라우저에만 저장됩니다.",
  "WebLLM 은 브라우저에서 LLM 을 직접 실행하는 기술입니다.",
  "Gemini 무료 티어는 일 1500회 요청을 지원합니다.",
  "Python, JavaScript, SQL, AI 엔지니어링 트랙이 있습니다.",
  "구조화 출력은 responseSchema 로 JSON 응답을 강제합니다.",
];

const query = "AES-GCM 암호화";
const results = bm25Search(docs, query);

console.log("🔤 BM25 검색:", query);
results.forEach((r, i) => {
  console.log(\`  \${i+1}. [점수 \${r.score.toFixed(2)}] \${r.text.substring(0, 60)}...\`);
});`,
      hints: [
        "BM25 는 '정확한 단어 매칭' 에 강함. 'AES-GCM' 이라는 특정 용어를 포함한 문서가 1위.",
        "벡터 검색은 '보안' / '암호화' 같은 유사 의미도 잡지만 'AES-GCM' 정확 매칭은 약할 수 있음.",
        "두 검색의 장단점이 상호 보완적 — 그래서 Hybrid 가 효과적.",
      ],
    },

    {
      type: "markdown",
      source: `## 🔀 Hybrid 결합 — Reciprocal Rank Fusion (RRF)

두 검색 결과를 합치는 가장 간단하면서 효과적인 방법:

**RRF 공식**: \`score = Σ (1 / (k + rank))\` (k = 60 이 표준)

- 각 검색 결과에서 문서의 **순위** 를 사용
- 벡터 검색 1위 + BM25 3위인 문서: \`1/(60+1) + 1/(60+3) ≈ 0.032\`
- 두 검색에서 모두 상위인 문서가 최종 상위로`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// Hybrid: 벡터 + BM25 결합 (RRF)

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
      score += (idf[q]??0) * (tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * tokens.length / avgDl));
    }
    return { idx, text: doc, score };
  }).sort((a, b) => b.score - a.score).slice(0, topK);
}

const docs = [
  "API 키는 AES-GCM 으로 암호화되어 브라우저에만 저장됩니다.",
  "WebLLM 은 브라우저에서 LLM 을 직접 실행하는 기술입니다.",
  "Gemini 무료 티어는 일 1500회 요청을 지원합니다.",
  "Python, JavaScript, SQL, AI 엔지니어링 트랙이 있습니다.",
  "보안을 위해 모든 키는 디바이스별 암호키로 보호됩니다.",
];

const query = "API 키 보안 암호화";

// 벡터 검색
const vecs = await embed(docs);
const [qVec] = await embed([query]);
const vecResults = docs.map((text, i) => ({
  idx: i, text, score: cosineSimilarity(qVec, vecs[i]),
})).sort((a, b) => b.score - a.score);

// BM25
const bm25Results = bm25Search(docs, query);

// RRF 결합
const K = 60;
const rrfScores = new Map<number, number>();
vecResults.forEach((r, rank) => {
  rrfScores.set(r.idx, (rrfScores.get(r.idx) ?? 0) + 1 / (K + rank + 1));
});
bm25Results.forEach((r, rank) => {
  rrfScores.set(r.idx, (rrfScores.get(r.idx) ?? 0) + 1 / (K + rank + 1));
});

const hybrid = Array.from(rrfScores.entries())
  .map(([idx, score]) => ({ idx, text: docs[idx], score }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);

console.log("🔍 벡터 Top 3:", vecResults.slice(0, 3).map(r => \`[\${r.idx}] \${r.score.toFixed(3)}\`));
console.log("🔤 BM25 Top 3:", bm25Results.slice(0, 3).map(r => \`[\${r.idx}] \${r.score.toFixed(2)}\`));
console.log("\\n🔀 Hybrid (RRF) Top 3:");
hybrid.forEach((r, i) => {
  console.log(\`  \${i+1}. [doc \${r.idx}] RRF \${r.score.toFixed(4)} — \${r.text.substring(0, 50)}...\`);
});`,
      hints: [
        "문서 [0] (AES-GCM) 이 벡터·BM25 모두에서 상위 → RRF 에서도 1위.",
        "문서 [4] (보안·암호키) 는 벡터에서 높지만 BM25 에서 'AES-GCM' 이 없어 중위 → Hybrid 2위쯤.",
        "K=60 은 경험적 표준. 작은 K 는 상위 결과를 더 강조, 큰 K 는 순위 차이를 줄임.",
      ],
    },

    {
      type: "markdown",
      source: `## 🏆 LLM Re-ranking — 최종 품질 높이기

Hybrid 검색 후 **상위 5~10개 후보** 를 LLM 에게 보내 "이 중 질문에 가장 관련 있는 순서대로 정렬해줘" 요청.

### 왜?
- 벡터·BM25 는 **통계적** 유사도 — 의미의 **뉘앙스** 를 놓칠 수 있음
- LLM 은 "이 문맥에서 이 청크가 진짜 도움이 되나?" 를 **언어 이해** 로 판단
- Re-ranking 후 Top 3 만 RAG context 로 → 정확도 ↑ + 토큰 절약

### 비용
- 추가 LLM 호출 1회 (짧은 프롬프트)
- 실시간 서비스에선 latency 추가 (100~500ms)
- 오프라인 처리·배치 분석엔 항상 권장

## 🧭 Ch10 정리

- ✅ BM25 키워드 검색 — 정확한 단어 매칭에 강함
- ✅ Hybrid = 벡터 + BM25 결합 (RRF 공식)
- ✅ LLM Re-ranking — 검색 후보를 LLM 이 재평가
- ✅ 벡터 검색의 약점 (리터럴·고유명사) 을 키워드가 보완

### 🎉 Phase 4 완주!
Ch08 임베딩 → Ch09 RAG 기초 → Ch10 Hybrid RAG.
"LLM 이 모르는 것을 문서에서 찾아 답하는" RAG 전 과정을 마스터했습니다.

### Phase 5 예고
- Ch11: LLM **생태계 비교** — WebLLM 1B vs Groq 70B vs Gemini 를 나란히 벤치마크
- Ch12: **종합 프로젝트** — 12강 전체 기법을 조합한 AI 튜터 구축 🎓`,
    },
  ],

  quiz: {
    title: "Ch10 — Hybrid RAG 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "벡터 검색이 약한 상황은?",
        options: [
          "의미가 비슷한 문장 검색",
          "AES-GCM, Error 404 같은 정확한 기술 용어·코드 리터럴 매칭",
          "긴 문서 요약",
          "다국어 검색",
        ],
        correctIndex: 1,
        explanation: "벡터 검색은 '의미적 유사도' 기반. 특정 용어·코드·숫자의 정확한 문자열 매칭은 BM25 같은 키워드 검색이 더 잘 잡아.",
      },
      {
        type: "multiple-choice",
        question: "RRF (Reciprocal Rank Fusion) 는 무엇을 하나요?",
        options: [
          "임베딩 벡터를 압축",
          "벡터 검색과 키워드 검색의 순위를 결합해 최종 순위를 만듦",
          "문서를 청킹",
          "LLM 모델을 선택",
        ],
        correctIndex: 1,
        explanation: "각 검색에서의 순위를 1/(k+rank) 점수로 변환, 합산해서 두 검색 모두에서 상위인 문서가 최종 상위로.",
      },
      {
        type: "multiple-choice",
        question: "LLM Re-ranking 의 역할은?",
        options: [
          "검색 인덱스 구축",
          "Hybrid 검색 상위 후보를 LLM 이 언어 이해로 재평가해 최종 순위 조정",
          "문서를 삭제",
          "임베딩 모델 학습",
        ],
        correctIndex: 1,
        explanation: "통계적 유사도가 놓치는 의미 뉘앙스를 LLM 이 잡아냄. 추가 비용·지연은 있지만 정확도 향상.",
      },
      {
        type: "multiple-choice",
        question: "Hybrid RAG 의 최종 파이프라인 순서는?",
        options: [
          "청킹 → LLM Re-rank → 임베딩 → 답변",
          "청킹 → 임베딩+BM25 인덱싱 → Hybrid 검색 → (선택) Re-ranking → LLM 답변",
          "LLM 답변 → 검색 → Re-ranking",
          "Re-ranking → 청킹 → 검색 → 답변",
        ],
        correctIndex: 1,
        explanation: "인덱싱(임베딩+BM25) → Hybrid 검색 → Re-ranking → LLM context 주입 → 답변 이 표준 순서.",
      },
    ],
  } satisfies Quiz,
};
