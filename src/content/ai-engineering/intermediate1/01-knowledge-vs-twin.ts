import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson01: Lesson = {
  id: "ai-eng-m1-01-knowledge-vs-twin",
  language: "ai-engineering",
  track: "intermediate1",
  order: 1,
  title: "두 개의 뇌 — 학습 vs 트윈",
  subtitle: "모델을 다시 훈련시키지 말고, 옆에 항상 최신인 '지식 트윈'을 붙여라",
  estimatedMinutes: 40,
  cells: [
    {
      type: "markdown",
      source: `# 🧠🧠 AI 의 두 개의 뇌

> 💡 **보라색 점선 밑줄** 단어는 전문 용어예요. 마우스를 올리면(모바일은 터치) 쉬운 설명이 나옵니다.

입문 12강에서 여러분은 RAG·임베딩·검색을 "기법"으로 배웠습니다.
중급1은 그 기법들을 **하나의 큰 그림** 아래 다시 세웁니다.

### 이 강에서 배울 것
| | 내용 |
|---|---|
| 🧠 핵심 개념 | AI 가 지식을 얻는 **두 경로** — ==학습== vs ==트윈== |
| 🔬 실습 | 맨몸 LLM 은 '내 정보' 를 모른다 → 트윈을 붙이면 답한다 |
| 🧭 판단 | "이 지식을 트윈에 둘까, 학습에 구울까?" 결정 트리 |
| 🌉 다리 | 플랫폼 헬퍼(\`chat\`/\`embed\`) → 실제 ==SDK== 번역표 |

### 중급1 전체 지도 (지식 트윈 짓기)
\`\`\`
중1-01 두 개의 뇌      ← 지금 여기 (개념 + 다리)
중1-02 컨텍스트 엔지니어링  (트윈의 작업 기억)
중1-03 영속 지식 베이스    (트윈을 디스크에)
중1-04 청킹·인덱싱 심화    (트윈의 기억 조직화)
중1-05 고급 검색·재랭킹    (트윈에서 정확히 꺼내기)
중1-06 정확한 인용         (트윈의 출처)
중1-07 멀티턴·지식 갱신     (살아있는 트윈)
중1-Capstone 도메인 트윈 RAG
\`\`\``,
    },

    {
      type: "markdown",
      source: `## 🧠 뇌 ①: 학습된 뇌  vs  🧠 뇌 ②: 런타임 트윈

AI 는 두 가지 방법으로 지식을 얻습니다.

- **==학습== (Training)**: 사전훈련·==파인튜닝== 으로 **가중치에 구워둔** 지식. 바꾸려면 다시 굽는다.
- **==트윈== (Runtime Twin)**: 우리가 실행 시점에 **컨텍스트로 얹어 주는** 지식. ==RAG== ·검색·메모리가 이 트윈을 만들고 갱신한다.

| | 🧠 학습된 뇌 (가중치) | 🧠 런타임 트윈 (컨텍스트/RAG) |
|---|---|---|
| 갱신 | 재훈련 필요 (느림·고비용) | 문서만 바꾸면 **즉시** |
| 출처 | 불명 ("그냥 안다") | **추적 가능** (어느 문서에서) |
| 지식 종류 | 범용 세상 지식 | **내 도메인** 지식 |
| 비용 | 한 번 비쌈, 이후 저렴 | 매 호출 토큰 비용 |

> **중급1 의 한 줄**
> "모델을 다시 훈련시키지 말고, 모델 **옆에** 항상 최신인 ==트윈== 을 붙여라.
> RAG·Context 엔지니어링이 그 트윈을 **짓고·조직하고·정확히 꺼내고·신뢰하게** 만드는 기술이다."

입문 Capstone 이 만든 게 사실 **조잡한 트윈**이었어요 — 새로고침하면 사라지고(인메모리), 출처가 흐릿했죠.
중급1 은 이 트윈을 **프로덕션급**으로 끌어올립니다.`,
    },

    {
      type: "markdown",
      source: `## 🔬 실습 1 — 맨몸 LLM 은 '내 정보' 를 모른다

먼저 트윈 **없이** 모델에게 우리만 아는 사실을 물어봅시다.
모델의 학습된 뇌엔 이 정보가 없으니, **모른다고 하거나 그럴듯하게 지어냅니다(==환각==)**.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 트윈 없이 — 학습된 뇌에만 의존
const question = "AIGoLab 의 중급1 트랙은 몇 강으로 구성되고, 핵심 개념은 무엇인가요?";

const answer = await chat({
  provider: "gemini",
  messages: [
    { role: "user", content: question },
  ],
});

console.log("❓ 질문:", question);
console.log("\\n🧠 맨몸 LLM 답변 (학습된 뇌만):");
console.log(answer.text);
console.log("\\n👉 모델은 'AIGoLab 중급1' 을 학습한 적이 없습니다. 모른다고 하거나, 그럴듯하게 지어낼 거예요(환각).");`,
      hints: [
        "모델이 '모르겠다' 고 하면 정직한 것, 구체적인 강 수를 단정하면 환각입니다.",
        "이게 바로 RAG 가 필요한 이유 — 모델의 학습 시점 이후·외부·내부 정보는 학습된 뇌에 없습니다.",
        "질문을 '오늘 우리 회사 점심 메뉴는?' 처럼 절대 알 수 없는 것으로 바꿔도 같은 현상을 봅니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🔬 실습 2 — 트윈을 붙이면?

이번엔 같은 질문에 **작은 지식 트윈**(우리만 아는 문서 몇 조각)을 붙여줍니다.
입문 9강에서 배운 \`embed\` + \`VectorStore\` 가 트윈을 만드는 도구예요 —
이번엔 "기법" 이 아니라 **"트윈을 짓는다"** 는 눈으로 보세요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 트윈을 붙여서 — 런타임 지식으로 답하게
// ① 우리만 아는 지식 조각들 = 트윈의 재료
const twinDocs = [
  "AIGoLab 중급1 트랙은 '지식과 컨텍스트' 로, 7강 + Capstone 으로 구성된다.",
  "중급1 의 핵심 개념은 '런타임 지식 트윈' — 학습된 뇌와 컨텍스트 트윈의 구분이다.",
  "중급1 은 RAG·Context 를 심화해 영속·인용·멀티턴 트윈을 짓는다.",
  "중급2 는 에이전틱 트랙으로, 트윈에 손발(도구·오케스트레이션)을 단다.",
];

// ② 트윈 구축: 임베딩 → 벡터 저장
const vecs = await embed(twinDocs);
const twin = new VectorStore();
twin.add(twinDocs.map((text, i) => ({ id: \`d\${i}\`, text, embedding: vecs[i] })));

// ③ 질문을 트윈에서 검색
const question = "AIGoLab 의 중급1 트랙은 몇 강으로 구성되고, 핵심 개념은 무엇인가요?";
const [qVec] = await embed([question]);
const found = twin.search(qVec, 2);
const context = found.map(r => r.text).join("\\n");

// ④ 검색된 트윈을 컨텍스트로 주입
const answer = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "아래 context 만 근거로 한국어로 답해. context 에 없으면 '문서에 없음' 이라고 해." },
    { role: "user", content: \`context:\\n\${context}\\n\\n질문: \${question}\` },
  ],
});

console.log("❓ 질문:", question);
console.log("\\n📄 트윈에서 찾은 근거:");
found.forEach((r, i) => console.log(\`  [\${i + 1}] (유사도 \${r.score.toFixed(3)}) \${r.text}\`));
console.log("\\n🧠+📄 트윈 붙인 답변:");
console.log(answer.text);
console.log("\\n👉 같은 모델인데, 옆에 트윈을 붙이니 정확히 답합니다. 모델을 재훈련하지 않았어요!");`,
      hints: [
        "twinDocs 에 새 사실을 한 줄 추가하면 — 재훈련 없이 — 모델이 그 사실도 답합니다. 이게 '즉시 갱신' 입니다.",
        "system 의 'context 에 없으면 문서에 없음' 이 환각 방어의 출발점(중1-06 에서 심화).",
        "지금은 인메모리라 새로고침하면 트윈이 사라집니다 — 중1-03 에서 영속화로 해결합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🧭 판단 — 트윈에 둘까, 학습에 구울까?

모든 걸 RAG 로 해결하진 않습니다. **결정 트리**:

\`\`\`
이 지식이…
├─ 자주 바뀐다 / 출처가 중요하다 / 내 도메인 전용?
│     → ✅ 트윈 (RAG·컨텍스트)   ← 중급1 의 영역
│
├─ 말투·포맷·페르소나를 항상 일정하게?
│     → 🔧 학습 (파인튜닝) 후보
│
├─ 지식이 아니라 '능력' 자체가 부족? (추론·전문 기술)
│     → 🔧 더 큰 모델 또는 파인튜닝
│
└─ 초저지연·초저비용으로 대량 처리? (컨텍스트 토큰 비용 제거)
      → 🔧 증류/파인튜닝
\`\`\`

> **핵심**: 대부분의 앱은 지식이 **자주 바뀌므로**, 재훈련보다 **트윈 갱신**이 옳습니다.
> 트윈으로 안 되는 것(말투·핵심 능력)을 만나면 그때 학습을 꺼냅니다.`,
    },

    {
      type: "markdown",
      source: `## 🌉 다리 — 플랫폼 헬퍼 → 실제 SDK

이 플랫폼은 \`chat\`·\`embed\`·\`VectorStore\`·\`z\` 를 **자동으로 주입**해 줍니다.
편하지만, **내 프로젝트로 옮기면** 직접 가져와야 해요. 중급1 내내 쓸 번역표:

| 여기(플랫폼 헬퍼) | 실제 세계 |
|---|---|
| \`chat({ ... })\` | AI SDK \`generateText\` / 각 provider SDK / AI Gateway |
| \`embed(texts)\` | \`@xenova/transformers\` 또는 OpenAI·Gemini embeddings API |
| \`new VectorStore()\` | ==pgvector== / Pinecone / Weaviate / LanceDB |
| \`z\` (자동 주입) | \`import { z } from "zod"\` |
| \`toJsonSchema(schema)\` | zod → JSON Schema 변환 헬퍼 |

> 즉, 지금 배우는 **개념과 패턴은 그대로**입니다. 옮길 때 바뀌는 건 "누가 그 함수를 주느냐" 뿐이에요.
> 중1-03 에서 \`VectorStore\` → 영속 저장소로 바꿀 때 이 번역표가 처음 실전 적용됩니다.`,
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 내 지식으로 미니 트윈 만들기

아래 \`myKnowledge\` 를 **여러분 자신·회사·관심사에 대한 사실 5줄**로 바꾸세요.
그리고 그 트윈에게 질문해 보세요. 모델이 **여러분만 아는 사실**을 답하면 성공!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 🎯 TODO: 아래 5줄을 '나만 아는 사실' 로 바꾸세요.
const myKnowledge = [
  "나는 ___ 을(를) 만들고 있다.",
  "그 프로젝트의 목표는 ___ 이다.",
  "사용하는 기술은 ___ 이다.",
  "가장 어려운 점은 ___ 이다.",
  "다음 마일스톤은 ___ 이다.",
];

// TODO: 트윈에게 물어볼 질문
const myQuestion = "내 프로젝트의 목표와 다음 마일스톤은?";

// --- 아래는 그대로 두세요 (트윈 구축 → 검색 → 답변) ---
const vecs = await embed(myKnowledge);
const twin = new VectorStore();
twin.add(myKnowledge.map((text, i) => ({ id: \`k\${i}\`, text, embedding: vecs[i] })));

const [qVec] = await embed([myQuestion]);
const found = twin.search(qVec, 3);
const context = found.map(r => r.text).join("\\n");

const answer = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "아래 context 만 근거로 한국어로 답해. 없으면 '문서에 없음'." },
    { role: "user", content: \`context:\\n\${context}\\n\\n질문: \${myQuestion}\` },
  ],
});

console.log("❓", myQuestion);
console.log("\\n📄 트윈 근거:");
found.forEach((r) => console.log(\`  - (\${r.score.toFixed(2)}) \${r.text}\`));
console.log("\\n💬 답변:\\n" + answer.text);`,
      hints: [
        "5줄을 진짜 여러분 정보로 바꿔야 '학습엔 없는데 트윈엔 있는' 효과를 체감합니다.",
        "질문을 트윈에 없는 것으로 바꾸면 '문서에 없음' 이 나오는지 확인 — 환각 방어가 작동하는지 보세요.",
        "지식을 한 줄 더 추가하고 다시 실행하면, 재훈련 없이 즉시 반영됩니다.",
      ],
      solution: `// 예시 solution — 실제 프로젝트(AIGoLab)로 채운 버전
const myKnowledge = [
  "나는 AIGoLab 이라는 브라우저 기반 AI 교육 플랫폼을 만들고 있다.",
  "목표는 입문자가 무료 API 키만으로 RAG·에이전트까지 배우게 하는 것이다.",
  "기술은 React + TypeScript + Vite, Supabase, Vercel 을 쓴다.",
  "가장 어려운 점은 PRO 콘텐츠 서버 게이팅과 캐시 정합성이다.",
  "다음 마일스톤은 중급1·중급2 트랙과 MCP 특별강의 집필이다.",
];
const myQuestion = "내 프로젝트의 목표와 다음 마일스톤은?";

const vecs = await embed(myKnowledge);
const twin = new VectorStore();
twin.add(myKnowledge.map((text, i) => ({ id: \`k\${i}\`, text, embedding: vecs[i] })));

const [qVec] = await embed([myQuestion]);
const found = twin.search(qVec, 3);
const context = found.map(r => r.text).join("\\n");

const answer = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "아래 context 만 근거로 한국어로 답해. 없으면 '문서에 없음'." },
    { role: "user", content: \`context:\\n\${context}\\n\\n질문: \${myQuestion}\` },
  ],
});

console.log("❓", myQuestion);
console.log("\\n📄 트윈 근거:");
found.forEach((r) => console.log(\`  - (\${r.score.toFixed(2)}) \${r.text}\`));
console.log("\\n💬 답변:\\n" + answer.text);`,
    },

    {
      type: "markdown",
      source: `## 🧭 중1-01 정리

- ✅ AI 의 **두 개의 뇌**: ==학습== (가중치, 재훈련) vs ==트윈== (컨텍스트/RAG, 즉시 갱신)
- ✅ 맨몸 LLM 은 '내 정보' 를 모름 → **트윈을 붙이면** 같은 모델이 정확히 답함
- ✅ **결정 트리**: 자주 바뀌는·출처 중요·도메인 지식 → 트윈 / 말투·핵심 능력 → 학습
- ✅ **SDK 번역표**: \`chat\`/\`embed\`/\`VectorStore\`/\`z\` → 실제 라이브러리

### 다음 강 — 중1-02 컨텍스트 엔지니어링
트윈을 만들었으니, 이제 **트윈을 잘 배치**하는 법:
- 컨텍스트 윈도우의 ==물리학== (토큰 예산·비용)
- ==lost-in-the-middle== (가운데 정보를 무시하는 현상)
- 한정된 예산 안에서 근거를 **우선순위로 배치**하기

"트윈을 크게 만드는 것" 과 "트윈을 잘 배치하는 것" 은 다릅니다.`,
    },
  ],

  quiz: {
    title: "중1-01 — 두 개의 뇌 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "'런타임 지식 트윈' 이 가리키는 것은?",
        options: [
          "모델의 가중치에 구워진 지식",
          "실행 시점에 컨텍스트/RAG 로 모델 옆에 얹어 주는 지식",
          "GPU 두 대를 병렬로 쓰는 기법",
          "모델을 복제해 두 개 띄우는 것",
        ],
        correctIndex: 1,
        explanation: "트윈 = 학습(가중치)이 아니라, 런타임에 컨텍스트로 주입하는 지식. RAG·검색·메모리가 이 트윈을 만든다. 즉시 갱신되고 출처를 추적할 수 있다.",
      },
      {
        type: "multiple-choice",
        question: "맨몸 LLM 에 'AIGoLab 중급1' 을 물었을 때 그럴듯한 거짓을 답하는 현상은?",
        options: ["오버피팅", "환각(hallucination)", "토큰 초과", "페일오버"],
        correctIndex: 1,
        explanation: "학습된 뇌에 없는 정보를 그럴듯하게 지어내는 것이 환각. 트윈(RAG)으로 근거를 주고 'context 에 없으면 모른다고 하라' 지시하면 줄어든다.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 '학습(파인튜닝)' 보다 '트윈(RAG)' 이 더 적합한 경우는?",
        options: [
          "모델의 말투를 항상 똑같이 고정하고 싶을 때",
          "추론 능력 자체가 부족할 때",
          "자주 바뀌고 출처가 중요한 내 도메인 문서를 다룰 때",
          "토큰 비용을 0 으로 만들고 싶을 때",
        ],
        correctIndex: 2,
        explanation: "자주 바뀌고·출처가 중요하고·도메인 전용인 지식은 트윈의 영역. 말투 고정·능력 부족·토큰비용 제거는 학습(파인튜닝/증류) 후보다.",
      },
      {
        type: "multiple-choice",
        question: "플랫폼이 자동 주입하는 `VectorStore` 를 실제 프로젝트로 옮길 때 대응되는 것은?",
        options: [
          "그대로 VectorStore 라는 전역이 어디서나 존재한다",
          "pgvector / Pinecone / Weaviate 같은 벡터 DB",
          "더 이상 필요 없다",
          "zod 로 대체된다",
        ],
        correctIndex: 1,
        explanation: "개념·패턴은 그대로, 옮길 때 바뀌는 건 '누가 그 기능을 주느냐' 뿐. VectorStore 의 실제 대응은 pgvector·Pinecone 등 벡터 DB(중1-03 에서 영속화로 처음 실전 적용).",
      },
    ],
  } satisfies Quiz,
};
