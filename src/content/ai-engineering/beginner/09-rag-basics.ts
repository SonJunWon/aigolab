import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson09: Lesson = {
  id: "ai-eng-09-rag-basics",
  language: "ai-engineering",
  track: "beginner",
  order: 9,
  title: "RAG 기초 — 청킹·검색·답변",
  subtitle: "LLM 이 '자기가 모르는 것' 을 문서에서 찾아 읽고 답하기",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 📄 ==RAG== — Retrieval-Augmented Generation

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

### ==LLM== 의 치명적 약점
- 훈련 시점 이후의 정보를 **모름**
- 조직 내부 문서를 **못 읽음**
- 긴 문서를 한번에 **못 담음** (context window 한계)

### RAG 가 해결하는 방법
> "질문과 관련 있는 문서 **조각**만 찾아서 프롬프트에 끼워 넣자"

### 5단계 파이프라인
\`\`\`
[문서] → ❶ ==청킹== → ❷ ==임베딩== → ❸ ==벡터== 저장
                                        ↓
[질문] → ❹ 임베딩 → 벡터 검색 (Top-K) → 관련 청크 ← ❸
                                        ↓
                              ❺ LLM (질문 + 검색된 context) → 답변
\`\`\`

이 장에서 **전체 5단계를 손으로 짭니다**.`,
    },

    {
      type: "markdown",
      source: `## ❶ 청킹 — 문서를 작은 조각으로

긴 문서를 통째로 임베딩하면 의미가 뭉뜽뚱해져 검색 정확도가 떨어져요.
**300~500자** 단위로 잘라야 각 조각의 의미가 선명해집니다.

### 청킹 전략
| 전략 | 설명 | 장점 |
|---|---|---|
| 고정 길이 | 300자마다 자르기 | 단순·균일 |
| 문단 기반 | \\n\\n 으로 분리 | 의미 단위 보존 |
| 겹침 (overlap) | 50자씩 겹치게 | 경계에 걸친 정보 보호 |

아래 셀에서 간단한 청커를 만들어봅시다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 간단한 청커 — 문단 기반 (빈 줄로 분리) + 최대 길이 제한
function chunkText(text: string, maxLen = 400): string[] {
  const paragraphs = text.split(/\\n\\n+/).filter(p => p.trim());
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if (current.length + para.length > maxLen && current) {
      chunks.push(current.trim());
      current = "";
    }
    current += (current ? "\\n\\n" : "") + para;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// 예시 문서 — AIGoLab 소개
const doc = \`AIGoLab은 브라우저 기반 AI 교육 플랫폼입니다.
Python, JavaScript, SQL, AI 엔지니어링 트랙을 제공합니다.

WebLLM 기술로 브라우저 안에서 직접 LLM을 실행할 수 있어
인터넷 연결 없이도 AI 실습이 가능합니다.

API 키는 Web Crypto AES-GCM으로 암호화되어
사용자 브라우저에만 저장됩니다. 서버로 전송되지 않습니다.

Gemini 2.5 Flash 무료 티어는 일 1500회 요청을 지원하며
Groq Llama 3.3 70B는 일 14400회 무료입니다.

구조화 출력, Chain of Thought, Tool Calling, 에이전트 패턴까지
12강으로 구성된 체계적 커리큘럼을 제공합니다.\`;

const chunks = chunkText(doc, 200);
console.log("청크 수:", chunks.length);
chunks.forEach((c, i) => {
  console.log(\`\\n── 청크 \${i + 1} (\${c.length}자) ──\`);
  console.log(c);
});`,
      hints: [
        "maxLen 을 100 으로 줄이면 청크가 더 잘게 나뉨 — 검색 정밀도 ↑ 하지만 맥락 ↓.",
        "overlap 구현은 보너스: 현재 청크 끝 50자를 다음 청크 앞에도 포함.",
        "실무에선 LangChain 의 RecursiveCharacterTextSplitter 같은 라이브러리가 이 역할.",
      ],
    },

    {
      type: "markdown",
      source: `## ❷❸ 임베딩 + 벡터 저장 → ❹ 검색

Ch08 에서 배운 \`embed\` + \`VectorStore\` 를 청크에 적용합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 문서 → 청킹 → 임베딩 → 저장 → 검색 — 전체 파이프라인

function chunkText(text: string, maxLen = 200): string[] {
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

const doc = \`AIGoLab은 브라우저 기반 AI 교육 플랫폼입니다.
Python, JavaScript, SQL, AI 엔지니어링 트랙을 제공합니다.

WebLLM 기술로 브라우저 안에서 직접 LLM을 실행할 수 있어 인터넷 없이도 실습 가능합니다.

API 키는 AES-GCM으로 암호화되어 브라우저에만 저장됩니다. 서버로 전송되지 않습니다.

Gemini 무료 티어는 일 1500회, Groq는 일 14400회 무료입니다.

12강 커리큘럼: 구조화 출력, CoT, Tool Calling, 에이전트, RAG까지 체계적으로 배웁니다.\`;

// ❶ 청킹
const chunks = chunkText(doc);
console.log("청크 수:", chunks.length);

// ❷ 임베딩
const chunkVecs = await embed(chunks);

// ❸ 벡터 저장
const store = new VectorStore();
store.add(chunks.map((text, i) => ({
  id: \`chunk-\${i}\`,
  text,
  embedding: chunkVecs[i],
})));

// ❹ 질문 임베딩 + 검색
const question = "API 키는 어떻게 보관되나요?";
const [qVec] = await embed([question]);
const results = store.search(qVec, 2);

console.log("\\n🔍 질문:", question);
console.log("\\n검색 결과 (Top 2):");
results.forEach((r, i) => {
  console.log(\`  \${i+1}. [유사도 \${r.score.toFixed(3)}] \${r.text.substring(0, 80)}...\`);
});`,
      hints: [
        "질문을 바꿔보세요: '어떤 언어를 배울 수 있어?', '무료 한도는?', '오프라인에서 되나?' 등.",
        "Top 2 → Top 3 으로 바꾸면 context 가 풍부해지지만 프롬프트가 길어짐.",
        "검색 결과의 score 가 0.3 미만이면 '관련 없는 청크' — 필터링 기준으로 사용 가능.",
      ],
    },

    {
      type: "markdown",
      source: `## ❺ LLM 에 context 주입 — RAG 완성

검색된 청크를 LLM 프롬프트의 **context** 로 끼워 넣으면 RAG 완성!

\`\`\`
[system] 너는 질문-답변 AI 야. 아래 context 만 참고해서 답해.
         context 에 없는 내용은 "모르겠습니다" 라고 해.

[user]   context:
         "API 키는 AES-GCM 으로 암호화..."
         "서버로 전송되지 않습니다..."

         질문: API 키는 어떻게 보관되나요?
\`\`\`

이 패턴이 **RAG 의 전부** — 의외로 단순하죠?`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 전체 RAG 파이프라인 — 청킹부터 LLM 답변까지

function chunkText(text: string, maxLen = 200): string[] {
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

const doc = \`AIGoLab은 브라우저 기반 AI 교육 플랫폼입니다. Python, JavaScript, SQL, AI 엔지니어링 트랙 제공.

WebLLM 기술로 브라우저에서 직접 LLM 실행. 인터넷 없이도 AI 실습 가능.

API 키는 AES-GCM으로 암호화, 브라우저에만 저장. 서버 전송 없음.

Gemini 일 1500회, Groq 일 14400회 무료.

12강 커리큘럼: 구조화 출력, CoT, Tool Calling, 에이전트, RAG.\`;

// 파이프라인
const chunks = chunkText(doc);
const vecs = await embed(chunks);
const store = new VectorStore();
store.add(chunks.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] })));

// 질문
const question = "이 플랫폼에서 오프라인으로 AI 를 돌릴 수 있나요?";
const [qVec] = await embed([question]);
const topChunks = store.search(qVec, 2);

// LLM 에 context 주입
const context = topChunks.map(c => c.text).join("\\n\\n");

const answer = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: "너는 질문-답변 AI 야. 아래 context 만 참고해서 한국어로 답해. context 에 없는 내용은 '제공된 문서에 해당 정보가 없습니다' 라고 해.",
    },
    {
      role: "user",
      content: \`context:\\n\${context}\\n\\n질문: \${question}\`,
    },
  ],
});

console.log("🔍 질문:", question);
console.log("\\n📄 참조 청크:");
topChunks.forEach((c, i) => console.log(\`  [\${i+1}] \${c.text.substring(0, 60)}... (유사도 \${c.score.toFixed(3)})\`));
console.log("\\n💬 RAG 답변:");
console.log(answer.text);`,
      hints: [
        "system 에 'context 에 없는 내용은 모르겠다고 해' — hallucination 방지의 가장 기본 방어.",
        "질문을 '결제 방법은?' 처럼 context 에 없는 것으로 바꾸면 모델이 '정보 없음' 으로 답하는지 확인.",
        "topChunks 에 score 가 낮은 것도 섞이면 오히려 답변 품질이 떨어질 수 있음 — score 기준 필터링 유용.",
      ],
    },

    {
      type: "markdown",
      source: `## 🧭 Ch09 정리

- ✅ RAG 5단계 파이프라인 완성: 청킹 → 임베딩 → 저장 → 검색 → LLM 답변
- ✅ 청킹 전략 (문단 기반 + maxLen)
- ✅ VectorStore 로 의미 검색
- ✅ LLM context 주입 패턴 ("context 에 없는 건 모른다")

### Ch10 예고 — Hybrid RAG
벡터 검색만으로는 부족할 때:
- **키워드(==BM25==) 검색** — 정확한 단어 매칭이 필요한 경우
- **==Hybrid==** — 벡터 + 키워드 검색 결합
- **==Re-ranking==** — LLM 이 검색 결과를 다시 평가해 순위 조정

RAG 품질을 한 단계 끌어올리는 기법들입니다.`,
    },
  ],

  quiz: {
    title: "Ch09 — RAG 기초 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "RAG 의 5단계를 올바른 순서로 나열한 것은?",
        options: [
          "임베딩 → 청킹 → 검색 → 저장 → 답변",
          "청킹 → 임베딩 → 벡터 저장 → 질문 검색 → LLM 답변 생성",
          "LLM 답변 → 검색 → 임베딩 → 저장 → 청킹",
          "검색 → 청킹 → 답변 → 임베딩 → 저장",
        ],
        correctIndex: 1,
        explanation: "문서를 청킹 → 각 청크를 임베딩 → 벡터 저장 → 질문 임베딩으로 검색 → 검색된 context 를 LLM 에 주입해 답변 생성.",
      },
      {
        type: "multiple-choice",
        question: "문서를 청킹하는 이유는?",
        options: [
          "파일 크기를 줄이기 위해",
          "긴 문서를 통째로 임베딩하면 의미가 뭉뜽해져 검색 정확도가 떨어지기 때문",
          "LLM 이 짧은 문장만 읽을 수 있어서",
          "암호화를 위해",
        ],
        correctIndex: 1,
        explanation: "작은 청크는 의미가 선명해 검색 시 '이 조각이 질문과 관련 있다' 판단이 정확해짐. 너무 작으면 맥락 손실, 너무 크면 의미 희석.",
      },
      {
        type: "multiple-choice",
        question: "RAG 에서 hallucination 을 줄이는 기본 방법은?",
        options: [
          "temperature 를 2.0 으로 올린다",
          "system prompt 에 '제공된 context 에 없는 내용은 모르겠다고 답해' 지시",
          "임베딩 모델을 제거한다",
          "VectorStore 를 비운다",
        ],
        correctIndex: 1,
        explanation: "context grounding — '너의 지식이 아니라 주어진 문서만 참고하라' 지시가 hallucination 방어의 출발점.",
      },
      {
        type: "multiple-choice",
        question: "VectorStore 검색 결과의 score 가 0.15 인 청크는?",
        options: [
          "매우 관련 높은 문서",
          "질문과 거의 관련 없는 문서 — context 에 포함하면 오히려 답변 품질 저하 가능",
          "정확히 같은 의미",
          "암호화된 문서",
        ],
        correctIndex: 1,
        explanation: "코사인 유사도 0.15 는 매우 낮음. 이런 청크를 context 에 넣으면 noise 가 되어 LLM 이 혼란. score 0.3+ 이상만 필터링하는 전략이 일반적.",
      },
    ],
  } satisfies Quiz,
};
