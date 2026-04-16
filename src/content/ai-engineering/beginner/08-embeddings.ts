import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson08: Lesson = {
  id: "ai-eng-08-embeddings",
  language: "ai-engineering",
  track: "beginner",
  order: 8,
  title: "임베딩과 벡터 공간",
  subtitle: "텍스트를 숫자로 바꾸면 '의미'를 계산할 수 있다",
  estimatedMinutes: 35,
  cells: [
    {
      type: "markdown",
      source: `# 🧮 ==임베딩== — 텍스트를 숫자 ==벡터==로

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

지금까지 ==LLM== 에게 "텍스트 → 텍스트" 변환을 시켰어요. 이번엔 **"텍스트 → 숫자 배열"** 변환.

### 임베딩이란?
- 단어·문장·문서를 **고정 길이의 숫자 배열** (벡터) 로 변환하는 것
- 예: "서울의 날씨" → \`[0.12, -0.34, 0.56, ..., 0.78]\` (384차원)
- **의미가 비슷한 텍스트** 는 벡터 공간에서 **가까이** 위치
- "서울 날씨" 와 "수도 기온" 은 가깝고, "고양이 밥" 과는 멀다

### 왜 중요한가?
- **의미 검색** — 키워드 일치가 아니라 "뜻이 비슷한" 문서를 찾기
- **추천** — 사용자 관심사와 비슷한 콘텐츠
- **분류** — 벡터 거리 기반 자동 분류
- **==RAG==** — Ch09 에서 쓸 핵심 기술: "질문과 가장 관련 높은 문서" 검색

### 이 장에서
1. 브라우저 내 임베딩 모델 (Transformers.js, 22MB)
2. 코사인 유사도 계산
3. 의미 검색 실습
4. 벡터 거리로 클러스터링 체감

> ⏱️ 첫 실행 시 모델 다운로드 약 22MB (30초~1분). WebLLM 보다 훨씬 빠릅니다.`,
    },

    {
      type: "markdown",
      source: `## 🚀 첫 임베딩 — 텍스트를 벡터로 변환

\`embed(texts)\` 함수가 자동 주입돼 있어요. 문자열 배열을 주면 벡터 배열을 반환.

모델: \`all-MiniLM-L6-v2\` (22MB, 384차원, 한국어 포함 다국어).`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 첫 실행 시 22MB 모델 다운로드 (30초~1분). 이후 캐시됨.
const texts = [
  "오늘 서울 날씨가 좋다",
  "수도의 기온이 높아졌다",
  "고양이가 밥을 먹는다",
  "강아지가 산책을 한다",
];

const vectors = await embed(texts);

console.log("텍스트 수:", texts.length);
console.log("벡터 차원:", vectors[0].length);
console.log("\\n첫 벡터 (앞 10차원):");
console.log(vectors[0].slice(0, 10).map(v => v.toFixed(4)));`,
      hints: [
        "384차원 — 각 텍스트가 384개 숫자로 표현됨. 사람은 시각화 불가능하지만 수학적 거리 계산 가능.",
        "같은 텍스트는 항상 같은 벡터 (결정적). LLM 의 temperature 랜덤성과 다름.",
        "벡터 값은 보통 -1 ~ 1 사이 (정규화됨).",
      ],
    },

    {
      type: "markdown",
      source: `## 📐 ==코사인 유사도== — 벡터의 "닮은 정도"

두 벡터가 얼마나 같은 방향을 가리키는지 측정:
- **1.0** = 완전히 같은 방향 (의미 동일)
- **0.0** = 직교 (관련 없음)
- **-1.0** = 완전 반대 (실제론 드묾)

\`cosineSimilarity(a, b)\` 도 자동 주입.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const texts = [
  "오늘 서울 날씨가 좋다",     // 0
  "수도의 기온이 높아졌다",     // 1
  "고양이가 밥을 먹는다",       // 2
  "강아지가 산책을 한다",       // 3
  "내일 부산 비가 온다",        // 4
];

const vecs = await embed(texts);

// 모든 쌍의 유사도 계산
console.log("코사인 유사도 매트릭스:");
console.log("─".repeat(60));
for (let i = 0; i < texts.length; i++) {
  const row = [];
  for (let j = 0; j < texts.length; j++) {
    row.push(cosineSimilarity(vecs[i], vecs[j]).toFixed(2));
  }
  console.log(\`[\${i}] \${row.join("  ")}  ← \${texts[i]}\`);
}

console.log("\\n💡 관찰 포인트:");
console.log("- [0] 과 [1] (서울 날씨 vs 수도 기온):", cosineSimilarity(vecs[0], vecs[1]).toFixed(3));
console.log("- [0] 과 [2] (날씨 vs 고양이):", cosineSimilarity(vecs[0], vecs[2]).toFixed(3));
console.log("- [2] 와 [3] (고양이 vs 강아지):", cosineSimilarity(vecs[2], vecs[3]).toFixed(3));`,
      hints: [
        "[0] vs [1] 이 0.5~0.8 사이면 → 모델이 '날씨 관련' 의미적 유사성 인식.",
        "[0] vs [2] 가 0.1~0.3 이면 → '날씨' 와 '동물' 은 의미적으로 거리가 멂.",
        "[2] vs [3] 이 0.5+ 이면 → '고양이'/'강아지' 는 동물 카테고리로 가까움.",
      ],
    },

    {
      type: "markdown",
      source: `## 🔍 의미 검색 — VectorStore 실습

이제 \`VectorStore\` 를 써서 **질문과 가장 관련 높은 문서** 를 찾아봅시다.

\`VectorStore\` 는 문서와 벡터를 저장하고, 쿼리 벡터에 대해 코사인 유사도 기준 Top-K 검색.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 간단한 지식 베이스 — FAQ 5개
const faqs = [
  { id: "1", text: "AIGoLab 은 브라우저에서 AI 를 배우는 무료 교육 플랫폼입니다." },
  { id: "2", text: "Python, JavaScript, SQL, AI 엔지니어링 트랙이 있습니다." },
  { id: "3", text: "WebLLM 은 브라우저 안에서 LLM 을 직접 실행하는 기술입니다." },
  { id: "4", text: "API 키는 AES-GCM 으로 암호화되어 브라우저에만 저장됩니다." },
  { id: "5", text: "Gemini 무료 티어는 일 1500회 요청을 지원합니다." },
];

// 1. 임베딩 생성
const faqVectors = await embed(faqs.map(f => f.text));

// 2. VectorStore 에 저장
const store = new VectorStore();
store.add(faqs.map((faq, i) => ({
  ...faq,
  embedding: faqVectors[i],
})));
console.log("저장된 문서:", store.size, "건");

// 3. 질문으로 검색
const question = "이 플랫폼은 무료인가요?";
const [queryVec] = await embed([question]);
const results = store.search(queryVec, 3);

console.log("\\n🔍 질문:", question);
console.log("\\n결과 (Top 3):");
results.forEach((r, i) => {
  console.log(\`  \${i+1}. [유사도 \${r.score.toFixed(3)}] \${r.text}\`);
});`,
      hints: [
        "질문을 바꿔보세요: '보안은 어떻게 되나요?', '어떤 언어를 배울 수 있어?', 'API 한도는?' 등.",
        "검색 결과 순위가 직관과 맞는지 확인 — 키워드 매칭이 아니라 의미 매칭이라 '무료' 를 직접 안 써도 관련 문서 올라옴.",
        "store.search(queryVec, 1) 로 Top 1 만 가져올 수도. RAG 에선 보통 3~5.",
      ],
    },

    {
      type: "markdown",
      source: `## 🧭 Ch08 정리 + Ch09 예고

### 배운 것
- ✅ **임베딩** — 텍스트 → 384차원 숫자 벡터 변환 (Transformers.js, 브라우저 내 22MB)
- ✅ **코사인 유사도** — 벡터 간 의미적 "닮은 정도" (0~1)
- ✅ **VectorStore** — 문서 저장 + 유사도 기반 Top-K 검색
- ✅ **의미 검색** — 키워드 일치가 아닌 "뜻이 비슷한" 문서 찾기

### Ch09 예고 — RAG 기초
임베딩 + VectorStore + LLM = **RAG (Retrieval-Augmented Generation)**.
- 긴 문서를 **==청킹==** (작게 나누기)
- 각 청크를 **임베딩** 하여 VectorStore 에 저장
- 사용자 질문을 임베딩 → **가장 관련 높은 청크** 검색
- 검색된 청크를 LLM 프롬프트에 **context 로 주입**
- LLM 이 context 를 읽고 **출처 있는 답변** 생성

"LLM 이 모르는 것을 문서에서 찾아 읽고 답하는 기술" 의 시작입니다. 🔍📄`,
    },
  ],

  quiz: {
    title: "Ch08 — 임베딩 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "임베딩이란 무엇인가요?",
        options: [
          "텍스트를 이미지로 변환",
          "텍스트를 고정 길이의 숫자 벡터로 변환 — 의미가 비슷한 텍스트는 벡터 공간에서 가까이 위치",
          "텍스트를 암호화",
          "텍스트를 압축",
        ],
        correctIndex: 1,
        explanation: "임베딩은 텍스트의 '의미'를 숫자 벡터로 포착. 같은 의미의 텍스트는 벡터 공간에서 가깝고, 다른 의미는 멈.",
      },
      {
        type: "multiple-choice",
        question: "코사인 유사도 1.0 은 무엇을 의미하나요?",
        options: [
          "완전히 반대 의미",
          "관련 없음",
          "두 벡터가 완전히 같은 방향 — 의미가 거의 동일",
          "텍스트 길이가 같다",
        ],
        correctIndex: 2,
        explanation: "1.0 = 같은 방향, 0.0 = 직교(관련 없음), -1.0 = 반대 방향. 임베딩은 보통 0~1 사이.",
      },
      {
        type: "multiple-choice",
        question: "VectorStore.search(queryVec, 3) 은 무엇을 반환하나요?",
        options: [
          "쿼리 벡터와 가장 다른 문서 3개",
          "코사인 유사도가 높은 순으로 상위 3개 문서 (+ score)",
          "랜덤 문서 3개",
          "가장 긴 문서 3개",
        ],
        correctIndex: 1,
        explanation: "브루트포스 코사인 유사도로 전체 문서를 스캔, 점수 내림차순 정렬 후 상위 topK 반환.",
      },
      {
        type: "multiple-choice",
        question: "이 레슨의 임베딩 모델(all-MiniLM-L6-v2)의 벡터 차원은?",
        options: ["128", "256", "384", "768"],
        correctIndex: 2,
        explanation: "all-MiniLM-L6-v2 는 384차원. 작고 빠르면서 다국어를 잘 커버해 교육·프로토타이핑에 인기.",
      },
    ],
  } satisfies Quiz,
};
