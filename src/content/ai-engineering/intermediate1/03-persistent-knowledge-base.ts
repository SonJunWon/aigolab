import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson03: Lesson = {
  id: "ai-eng-m1-03-persistent-kb",
  language: "ai-engineering",
  track: "intermediate1",
  order: 3,
  title: "영속 지식 베이스 — 트윈을 디스크에",
  subtitle: "새로고침하면 사라지는 트윈을, 한 번 만들고 계속 쓰기",
  estimatedMinutes: 40,
  cells: [
    {
      type: "markdown",
      source: `# 💾 영속 지식 베이스

> 💡 보라색 점선 밑줄 = 전문 용어. 올리면 설명이 나옵니다.

지금까지 트윈은 \`new VectorStore()\` — **인메모리**였습니다.
새로고침하면 사라지고, 매번 임베딩을 **다시 계산**해야 했죠. 느리고 돈도 듭니다.

### 이 강의 목표
- 트윈을 **직렬화**(serialize)해서 저장하고, 그대로 **복원**(rehydrate)하기
- ==localStorage== 로 **새로고침 후에도 살아있는** 트윈 만들기 — 임베딩 재계산 0
- 관리형 ==벡터 DB== (pgvector·Pinecone)로의 확장 (개념 + 의사코드)
- 중1-01 의 **SDK 번역표가 처음 실전 적용**되는 강입니다 (\`VectorStore\` → 영속 저장소).`,
    },

    {
      type: "markdown",
      source: `## 🪜 저장 계층 사다리

| 단계 | 저장 위치 | 영속성 | 규모 | 언제 |
|---|---|---|---|---|
| 인메모리 | 변수 (\`VectorStore\`) | ❌ 새로고침 시 소멸 | 수백 | 데모·실습 |
| ==localStorage== | 브라우저 | ✅ 같은 브라우저 | ~수MB | 개인용·작은 트윈 |
| ==IndexedDB== | 브라우저 | ✅ 같은 브라우저 | 큼 | 브라우저 앱 본격 |
| 관리형 ==벡터 DB== | 서버 | ✅ 어디서나·다중 사용자 | 무제한 | 프로덕션 |

> 핵심은 모두 같습니다 — **임베딩(숫자 배열) + 텍스트 + 메타데이터를 통째로 보관**.
> 위로 올라갈수록 "더 오래, 더 많이, 더 여럿이" 쓸 수 있을 뿐, **개념과 패턴은 동일**합니다.

이번 강은 **localStorage** 까지 직접 하고, 벡터 DB 는 개념으로 다리를 놓습니다.`,
    },

    {
      type: "markdown",
      source: `## 📦 영속화의 핵심 — 임베딩까지 통째로 저장

흔한 실수: "텍스트만 저장하고, 불러올 때 임베딩을 다시 계산" → **느리고 비쌈**.

올바른 방법: **임베딩(숫자 배열)도 함께 저장**해서, 불러올 때 **재계산 0**.

\`\`\`
트윈 1개 = { id, text, embedding: [0.12, -0.04, ...384개], meta }
                                  └ 이걸 같이 저장해야 진짜 영속
\`\`\`

아래에서 먼저 **직렬화 → 복원 라운드트립**을 해봅니다 (어디서나 동작).`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 트윈 직렬화 → 복원 라운드트립 (저장소 없이 개념 먼저)
const texts = [
  "환불은 구매 후 14일 이내 가능하다.",
  "배송은 보통 2-3일 걸린다.",
  "고객센터는 평일 9시부터 18시까지.",
];

// ① 임베딩 계산 (비용 발생 지점)
const vecs = await embed(texts);
const docs = texts.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] }));

// ② 직렬화 — 임베딩까지 통째로 JSON 문자열로
const serialized = JSON.stringify(docs);
console.log("직렬화 크기:", serialized.length, "자 (임베딩 포함)");

// ③ 복원 — 다른 곳/다른 시점이라 가정하고 문자열에서 되살리기
const restored = JSON.parse(serialized) as typeof docs;
const twin = new VectorStore();
twin.add(restored);            // 👈 재임베딩 없이 바로 트윈 복원!

// ④ 복원된 트윈으로 검색되는지 확인
const [qVec] = await embed(["환불 며칠까지 돼요?"]);
const found = twin.search(qVec, 1);
console.log("\\n복원된 트윈 검색:", found[0].text, \`(유사도 \${found[0].score.toFixed(3)})\`);
console.log("👉 임베딩을 같이 저장했으니, 복원 시 재계산이 필요 없습니다.");`,
      hints: [
        "직렬화 크기가 큰 이유 = 임베딩 384개 숫자 × 청크 수. 텍스트보다 임베딩이 훨씬 큽니다.",
        "복원할 때 embed 를 다시 호출하지 않는 게 핵심 — 그게 영속화의 이득(속도·비용).",
        "이 'serialized' 문자열을 localStorage·IndexedDB·파일·DB 어디에 넣든 원리는 같습니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 💾 진짜 영속 — localStorage 에 저장

이제 그 직렬화 문자열을 ==localStorage== 에 넣어, **새로고침 후에도** 트윈이 살아있게 합니다.
패턴은 **캐시-우선**(cache-first):

\`\`\`
저장된 게 있나? ── 있음 → 불러와서 바로 사용 (임베딩 재계산 X)
              └─ 없음 → 임베딩 계산 → 저장 → 사용
\`\`\``,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// localStorage 로 영속 트윈 — 두 번째 실행부터 재계산 0
const KEY = "twin-demo:v1";
const texts = [
  "AIGoLab 중급1 은 '지식과 컨텍스트' 트랙이다.",
  "핵심 개념은 런타임 지식 트윈이다.",
  "트윈은 임베딩과 함께 저장하면 영속된다.",
];

// 안전하게 읽기 (localStorage 가 막힌 환경 대비)
function loadCache(): any[] | null {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; }
  catch { return null; }
}

let docs = loadCache();
if (docs) {
  console.log("♻️ localStorage 에서 트윈 복원 —", docs.length, "청크, 임베딩 재계산 건너뜀!");
} else {
  console.log("🆕 저장된 트윈 없음 → 임베딩 계산 중...");
  const vecs = await embed(texts);
  docs = texts.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] }));
  try { localStorage.setItem(KEY, JSON.stringify(docs)); console.log("💾 저장 완료 — 다음 실행부터 재계산 안 함"); }
  catch { console.log("⚠️ localStorage 사용 불가 — 이번엔 메모리만 사용"); }
}

const twin = new VectorStore();
twin.add(docs);
const [qVec] = await embed(["중급1 의 핵심 개념은?"]);
console.log("\\n검색:", twin.search(qVec, 1)[0].text);

console.log("\\n👉 이 셀을 한 번 더 실행하거나, 페이지를 새로고침한 뒤 실행해 보세요.");
console.log("   두 번째부터는 '♻️ 복원' 메시지가 뜨고 임베딩 계산이 사라집니다.");
console.log("   (정리: localStorage.removeItem('" + KEY + "') 로 캐시 삭제 가능)");`,
      hints: [
        "처음 실행은 '🆕 계산', 두 번째 실행부터 '♻️ 복원' — 이게 영속화의 체감 포인트.",
        "loadCache 를 try/catch 로 감싼 이유: 시크릿 모드·정책에 따라 localStorage 가 막힐 수 있어 graceful 하게.",
        "texts 를 바꿨는데 옛 결과가 나오면 캐시 때문 — removeItem 으로 지우거나 KEY 를 'v2' 로 올리세요(캐시 무효화).",
      ],
    },

    {
      type: "markdown",
      source: `## 🚀 확장 — 관리형 벡터 DB (개념 + 의사코드)

브라우저 저장은 **그 브라우저 안**에서만 삽니다. 여러 사용자·서버·대용량이면 **관리형 벡터 DB**로.

중1-01 의 **SDK 번역표**가 여기서 적용됩니다:

\`\`\`
여기(플랫폼)          실제 프로덕션
new VectorStore()  →  pgvector / Pinecone / Weaviate / LanceDB
store.add(docs)    →  await index.upsert(docs)
store.search(q, k) →  await index.query({ vector: q, topK: k })
\`\`\`

### 의사코드 — pgvector 예 (서버에서)
\`\`\`sql
-- 1) 확장 + 테이블 (embedding 컬럼이 핵심)
create extension if not exists vector;
create table kb (id text primary key, text text, embedding vector(384));

-- 2) 저장 (upsert)
insert into kb (id, text, embedding) values ($1, $2, $3);

-- 3) 검색 — 코사인 거리로 가장 가까운 K개
select id, text, 1 - (embedding <=> $1) as score
from kb order by embedding <=> $1 limit 5;
\`\`\`

> 보이시나요? \`<=>\` 는 우리가 손으로 짠 \`cosineSimilarity\` 를 DB 가 대신 해주는 것뿐.
> **개념은 그대로**, "누가 검색을 해주느냐" 만 브라우저 → DB 로 바뀝니다.`,
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 내 트윈 영속화 + 재방문 시뮬레이션

\`saveTwin\` / \`loadTwin\` 함수를 완성하세요.
- \`saveTwin(docs)\`: docs 를 localStorage 에 저장
- \`loadTwin()\`: 저장된 게 있으면 복원, 없으면 \`null\``,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `const KEY = "my-twin:v1";

// 🎯 TODO: 두 함수를 완성하세요.
function saveTwin(docs: any[]): void {
  // TODO: localStorage 에 JSON 문자열로 저장 (try/catch)
}
function loadTwin(): any[] | null {
  // TODO: 저장된 게 있으면 JSON 복원해서 반환, 없으면 null (try/catch)
  return null;
}

// --- 아래는 그대로 ---
const texts = ["내 트윈 첫 사실.", "내 트윈 둘째 사실.", "내 트윈 셋째 사실."];
let docs = loadTwin();
if (docs) {
  console.log("♻️ 복원됨:", docs.length, "청크");
} else {
  const vecs = await embed(texts);
  docs = texts.map((text, i) => ({ id: \`m\${i}\`, text, embedding: vecs[i] }));
  saveTwin(docs);
  console.log("💾 새로 저장:", docs.length, "청크");
}
const twin = new VectorStore();
twin.add(docs);
console.log("트윈 크기:", twin.size, "→ 다시 실행하면 '♻️ 복원' 이 떠야 성공");`,
      hints: [
        "saveTwin: try { localStorage.setItem(KEY, JSON.stringify(docs)); } catch {}",
        "loadTwin: try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch { return null; }",
        "두 번째 실행에서 '♻️ 복원' 이 뜨면 영속화 성공. removeItem 으로 초기화 가능.",
      ],
      solution: `const KEY = "my-twin:v1";

function saveTwin(docs: any[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(docs)); } catch { /* 저장 불가 환경 무시 */ }
}
function loadTwin(): any[] | null {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; }
  catch { return null; }
}

const texts = ["내 트윈 첫 사실.", "내 트윈 둘째 사실.", "내 트윈 셋째 사실."];
let docs = loadTwin();
if (docs) {
  console.log("♻️ 복원됨:", docs.length, "청크");
} else {
  const vecs = await embed(texts);
  docs = texts.map((text, i) => ({ id: \`m\${i}\`, text, embedding: vecs[i] }));
  saveTwin(docs);
  console.log("💾 새로 저장:", docs.length, "청크");
}
const twin = new VectorStore();
twin.add(docs);
console.log("트윈 크기:", twin.size);`,
    },

    {
      type: "markdown",
      source: `## 🧭 중1-03 정리

- ✅ 영속화의 핵심 = **임베딩까지 통째로 저장** → 복원 시 재계산 0
- ✅ **직렬화/복원** 라운드트립 (어디서나 동작) → ==localStorage== 로 실제 영속
- ✅ **캐시-우선** 패턴: 있으면 복원, 없으면 계산 후 저장
- ✅ 확장: 관리형 ==벡터 DB== (pgvector \`<=>\` = 우리 \`cosineSimilarity\`). **개념은 그대로**, SDK 번역표 적용.

### 다음 강 — 중1-04 청킹·인덱싱 심화
트윈을 영속화했으니, 이제 **무엇을 어떻게 잘라 담을지**:
- 고정 길이의 약점 → ==overlap== ·문장/의미 단위·재귀 분할
- 청크 ==메타데이터== (출처·페이지·위치) — 다음다음 강 '인용' 의 토대`,
    },
  ],

  quiz: {
    title: "중1-03 — 영속 지식 베이스 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "트윈을 영속화할 때 텍스트만 저장하면 생기는 문제는?",
        options: [
          "텍스트가 손상된다",
          "불러올 때마다 임베딩을 다시 계산해야 해서 느리고 비싸다",
          "검색이 불가능해진다",
          "localStorage 가 꽉 찬다",
        ],
        correctIndex: 1,
        explanation: "영속화의 이득은 '재계산 0'. 임베딩(숫자 배열)을 함께 저장해야 복원 시 embed 를 다시 부르지 않아 빠르고 저렴하다.",
      },
      {
        type: "multiple-choice",
        question: "캐시-우선(cache-first) 패턴의 흐름으로 올바른 것은?",
        options: [
          "항상 임베딩을 새로 계산한 뒤 저장한다",
          "저장된 게 있으면 복원해 쓰고, 없을 때만 계산 후 저장한다",
          "저장은 하지 않고 매번 계산한다",
          "검색할 때마다 저장소를 비운다",
        ],
        correctIndex: 1,
        explanation: "있으면 복원(재계산 X), 없으면 계산→저장. 두 번째 실행부터 임베딩 비용이 사라진다.",
      },
      {
        type: "multiple-choice",
        question: "localStorage 접근을 try/catch 로 감싸는 이유는?",
        options: [
          "속도를 높이려고",
          "시크릿 모드·브라우저 정책 등으로 막혔을 때 앱이 죽지 않고 메모리로 graceful 하게 동작하도록",
          "암호화를 위해",
          "임베딩을 압축하려고",
        ],
        correctIndex: 1,
        explanation: "localStorage 는 환경에 따라 막힐 수 있다. try/catch 로 실패 시 메모리만 쓰게 하면 견고해진다.",
      },
      {
        type: "multiple-choice",
        question: "pgvector 의 `embedding <=> $1` 연산자가 대응되는, 우리가 손으로 짠 것은?",
        options: ["chunkText", "cosineSimilarity(벡터 유사도)", "JSON.stringify", "embed"],
        correctIndex: 1,
        explanation: "<=> 는 벡터 거리(유사도) 연산. 인메모리에서 cosineSimilarity 로 하던 일을 DB 가 대신한다. 개념은 동일, 실행 주체만 다르다.",
      },
    ],
  } satisfies Quiz,
};
