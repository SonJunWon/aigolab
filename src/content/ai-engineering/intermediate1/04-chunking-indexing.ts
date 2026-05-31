import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson04: Lesson = {
  id: "ai-eng-m1-04-chunking-indexing",
  language: "ai-engineering",
  track: "intermediate1",
  order: 4,
  title: "청킹·인덱싱 심화 — 트윈의 기억 조직화",
  subtitle: "무엇을 어떻게 잘라 담느냐가 검색 품질을 좌우한다",
  estimatedMinutes: 40,
  cells: [
    {
      type: "markdown",
      source: `# ✂️ 청킹·인덱싱 심화

> 💡 보라색 점선 밑줄 = 전문 용어.

검색 품질의 **출발점**은 청킹입니다. 아무리 좋은 검색기도 **잘못 잘린 조각**에선 좋은 답을 못 찾아요.
입문 9강에서 문단 청커를 만들었지만 ==overlap== 은 hint 로만 봤죠 — 이번엔 **코드로** 완성합니다.

### 배울 것
- 고정 길이의 약점과 ==overlap== (겹침) 청킹 — 경계 정보 보호
- 같은 문서, 다른 청킹 → **검색 품질 차이** 직접 비교
- 청크 ==메타데이터== (출처·위치) — 다음 강 '정확한 인용' 의 토대`,
    },

    {
      type: "markdown",
      source: `## ✂️ 청킹 전략 — 트레이드오프

| 전략 | 방법 | 장점 | 약점 |
|---|---|---|---|
| 고정 길이 | N자마다 자르기 | 단순·균일 | 문장·단어 **중간 잘림** |
| 문장/문단 | 구분자로 분리 | 의미 단위 보존 | 길이 들쭉날쭉 |
| ==overlap== | 끝 일부를 다음에 겹침 | **경계 정보 보호** | 약간 중복·용량↑ |
| 재귀 분할 | 문단→문장→단어 순 시도 | 균형 | 구현 복잡 |

### 왜 overlap 이 중요한가
\`\`\`
원문: "...환불은 14일 이내 가능하다. | 단, 배송비는 고객 부담이다..."
                            ↑ 여기서 자르면
청크A: "...환불은 14일 이내 가능하다."
청크B: "단, 배송비는 고객 부담이다..."
→ "환불 시 배송비?" 질문이 두 청크에 걸쳐 어느 쪽도 완전치 않음 😢
\`\`\`
**overlap** 은 청크 끝 일부를 다음 청크 앞에도 넣어 이 경계 문제를 줄입니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// overlap 청커 — 입문 9강이 hint 로만 남긴 것을 코드로
function chunkWithOverlap(text: string, size = 80, overlap = 20): string[] {
  const clean = text.replace(/\\s+/g, " ").trim();
  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    chunks.push(clean.slice(start, end));
    if (end >= clean.length) break;
    start = end - overlap;        // 👈 뒤로 overlap 만큼 되돌아가 겹치게
  }
  return chunks;
}

const doc = "환불은 구매 후 14일 이내 가능하다. 단, 환불 시 배송비는 고객 부담이다. 교환은 7일 이내만 된다. 디지털 상품은 환불 불가다.";

const noOverlap = chunkWithOverlap(doc, 40, 0);
const withOverlap = chunkWithOverlap(doc, 40, 15);

console.log("── overlap 없음 ──");
noOverlap.forEach((c, i) => console.log(\`  [\${i}] \${c}\`));
console.log("\\n── overlap 15자 ──");
withOverlap.forEach((c, i) => console.log(\`  [\${i}] \${c}\`));
console.log("\\n👉 overlap 쪽은 인접 청크가 경계 문장을 함께 품어, '환불+배송비' 처럼 걸친 정보가 한 청크에 살아남습니다.");`,
      hints: [
        "overlap=0 이면 경계에서 정보가 둘로 쪼개집니다. overlap 을 주면 그 경계가 양쪽 청크에 모두 보존돼요.",
        "size/overlap 비율이 중요 — overlap 이 size 의 10~25% 가 흔한 출발점.",
        "실무에선 LangChain RecursiveCharacterTextSplitter 가 문단→문장→단어 순으로 자연 경계를 우선합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🔬 같은 문서, 다른 청킹 → 검색 품질 비교

청킹 전략이 검색 결과를 어떻게 바꾸는지 **직접** 봅니다.
경계에 걸친 질문("환불 시 배송비")으로 두 트윈을 검색해 비교해요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 두 청킹 전략으로 트윈을 만들어 같은 질문 검색
function chunkWithOverlap(text: string, size: number, overlap: number): string[] {
  const clean = text.replace(/\\s+/g, " ").trim();
  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    chunks.push(clean.slice(start, end));
    if (end >= clean.length) break;
    start = end - overlap;
  }
  return chunks;
}

const doc = "환불은 구매 후 14일 이내 가능하다. 단, 환불 시 배송비는 고객 부담이다. 교환은 7일 이내만 된다. 디지털 상품은 환불 불가다.";
const question = "환불할 때 배송비는 누가 내나요?";

async function buildAndSearch(label: string, chunks: string[]) {
  const vecs = await embed(chunks);
  const store = new VectorStore();
  store.add(chunks.map((text, i) => ({ id: \`c\${i}\`, text, embedding: vecs[i] })));
  const [qVec] = await embed([question]);
  const top = store.search(qVec, 1)[0];
  console.log(\`[\${label}] 최상위 (유사도 \${top.score.toFixed(3)}): \${top.text}\`);
}

await buildAndSearch("overlap 없음", chunkWithOverlap(doc, 30, 0));
await buildAndSearch("overlap 12자", chunkWithOverlap(doc, 30, 12));
console.log("\\n👉 overlap 쪽 최상위 청크에 '환불'+'배송비' 가 함께 들어 있으면 답하기 좋은 근거입니다.");`,
      hints: [
        "결과는 모델·임베딩에 따라 다를 수 있어요 — 경향(겹침이 경계 정보를 잘 살림)을 보세요.",
        "size 를 더 줄이면(예: 20) 경계 문제가 심해져 차이가 또렷해질 수 있습니다.",
        "검색 품질 평가의 정석은 '질문→정답 청크' 쌍을 여럿 만들어 recall 을 재는 것(중2 평가 강에서 다룸).",
      ],
    },

    {
      type: "markdown",
      source: `## 🏷️ 청크 메타데이터 — 인용의 토대

청크를 저장할 때 **출처 정보**를 함께 넣으면, 나중에 답변에 "어디서 왔는지"를 달 수 있어요.
\`VectorStore\` 의 \`meta\` 필드가 그 자리입니다.

\`\`\`
{ id, text, embedding, meta: { source: "환불정책.md", chunkIndex: 1, page: 3 } }
                              └ 다음 강(중1-06 인용)에서 이걸로 출처를 표시
\`\`\``,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 메타데이터를 붙여 저장 → 검색 결과에 출처 표시
const sections = [
  { source: "환불정책.md", text: "환불은 구매 후 14일 이내 가능하다." },
  { source: "환불정책.md", text: "환불 시 배송비는 고객 부담이다." },
  { source: "배송안내.md", text: "배송은 보통 2-3일 소요된다." },
  { source: "FAQ.md",      text: "디지털 상품은 환불이 불가하다." },
];

const vecs = await embed(sections.map(s => s.text));
const store = new VectorStore();
store.add(sections.map((s, i) => ({
  id: \`c\${i}\`,
  text: s.text,
  embedding: vecs[i],
  meta: { source: s.source, chunkIndex: i },   // 👈 출처 메타데이터
})));

const [qVec] = await embed(["환불 며칠 이내에 돼요?"]);
const found = store.search(qVec, 2);

console.log("🔍 검색 결과 (출처 포함):");
found.forEach((r) => {
  const m = r.meta as { source: string; chunkIndex: number };
  console.log(\`  • [\${m.source}#\${m.chunkIndex}] (유사도 \${r.score.toFixed(3)}) \${r.text}\`);
});
console.log("\\n👉 meta.source 덕분에 '이 답의 근거는 환불정책.md' 라고 출처를 달 수 있습니다.");`,
      hints: [
        "meta 는 자유 형식 객체 — source, page, url, createdAt 등 필요한 걸 담으세요.",
        "검색 결과(SearchResult)는 원본 doc 의 meta 를 그대로 보존합니다.",
        "이 메타데이터가 중1-06 '정확한 인용' 과 중2 에이전트의 출처 추적에 그대로 쓰입니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 메타데이터 청커

\`indexDocument(source, text)\` 를 완성하세요.
문서를 overlap 청킹하고, 각 청크에 \`{ source, chunkIndex }\` 메타를 붙여 트윈에 저장합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `function chunkWithOverlap(text: string, size = 50, overlap = 12): string[] {
  const clean = text.replace(/\\s+/g, " ").trim();
  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    chunks.push(clean.slice(start, end));
    if (end >= clean.length) break;
    start = end - overlap;
  }
  return chunks;
}

const store = new VectorStore();

// 🎯 TODO: 청킹 + 메타데이터 + 저장
async function indexDocument(source: string, text: string): Promise<void> {
  const chunks = chunkWithOverlap(text);
  // TODO: chunks 를 embed 하고, meta:{source, chunkIndex} 를 붙여 store.add
}

await indexDocument("정책.md", "환불은 14일 이내. 환불 시 배송비는 고객 부담. 디지털 상품은 환불 불가.");
const [qVec] = await embed(["배송비 누가 내요?"]);
const found = store.search(qVec, 1)[0];
console.log("결과:", found?.text);
console.log("출처:", (found?.meta as any)?.source, "#", (found?.meta as any)?.chunkIndex);
console.log("👉 출처가 '정책.md' 로 찍히면 성공.");`,
      hints: [
        "const vecs = await embed(chunks); 로 한 번에 임베딩.",
        "store.add(chunks.map((text,i)=>({ id:`${source}-${i}`, text, embedding: vecs[i], meta:{ source, chunkIndex:i } })));",
        "여러 문서를 indexDocument 로 계속 넣으면 트윈이 누적됩니다(id 충돌만 피하면 됨).",
      ],
      solution: `function chunkWithOverlap(text: string, size = 50, overlap = 12): string[] {
  const clean = text.replace(/\\s+/g, " ").trim();
  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    chunks.push(clean.slice(start, end));
    if (end >= clean.length) break;
    start = end - overlap;
  }
  return chunks;
}

const store = new VectorStore();

async function indexDocument(source: string, text: string): Promise<void> {
  const chunks = chunkWithOverlap(text);
  const vecs = await embed(chunks);
  store.add(chunks.map((t, i) => ({
    id: \`\${source}-\${i}\`,
    text: t,
    embedding: vecs[i],
    meta: { source, chunkIndex: i },
  })));
}

await indexDocument("정책.md", "환불은 14일 이내. 환불 시 배송비는 고객 부담. 디지털 상품은 환불 불가.");
const [qVec] = await embed(["배송비 누가 내요?"]);
const found = store.search(qVec, 1)[0];
console.log("결과:", found?.text);
console.log("출처:", (found?.meta as any)?.source, "#", (found?.meta as any)?.chunkIndex);`,
    },

    {
      type: "markdown",
      source: `## 🧭 중1-04 정리

- ✅ 고정 길이의 경계 문제 → ==overlap== 으로 걸친 정보 보호 (코드로 완성)
- ✅ 같은 문서라도 **청킹 전략이 검색 품질을 바꾼다**
- ✅ 청크 ==메타데이터== (\`meta.source\` 등) = **인용의 토대**

### 다음 강 — 중1-05 고급 검색·재랭킹
잘 잘라 담았으니, 이제 **정확히 꺼내기**:
- 벡터 검색의 약점 → ==BM25== 키워드 + ==RRF== **하이브리드** (입문 10강 복습)
- 입문 10강이 **약속만 하고 빠뜨린 ==Re-ranking== 을 코드로** 구현`,
    },
  ],

  quiz: {
    title: "중1-04 — 청킹·인덱싱 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "overlap(겹침) 청킹이 해결하는 문제는?",
        options: [
          "임베딩 비용을 0으로 만든다",
          "청크 경계에 걸친 정보가 둘로 쪼개져 어느 쪽도 완전치 않게 되는 문제",
          "토큰 윈도우를 늘린다",
          "검색을 키워드 기반으로 바꾼다",
        ],
        correctIndex: 1,
        explanation: "경계에서 잘린 정보를 양쪽 청크가 함께 품도록 끝 일부를 겹쳐 보존한다. 약간의 중복·용량 증가가 대가.",
      },
      {
        type: "multiple-choice",
        question: "청크 meta 필드에 source·chunkIndex 를 넣는 주된 이유는?",
        options: [
          "검색 속도를 높이려고",
          "나중에 답변에 '어느 문서·어느 위치' 인지 출처를 달기 위해",
          "임베딩 차원을 줄이려고",
          "overlap 을 자동 계산하려고",
        ],
        correctIndex: 1,
        explanation: "메타데이터는 인용(citation)의 토대. 검색 결과에 출처가 따라오면 답변의 근거를 추적·표시할 수 있다(중1-06).",
      },
      {
        type: "multiple-choice",
        question: "청킹 전략 비교에서 옳지 않은 설명은?",
        options: [
          "고정 길이는 단순하지만 문장 중간을 자를 수 있다",
          "문단 기반은 의미 단위를 보존하지만 길이가 들쭉날쭉하다",
          "overlap 은 경계 정보를 보호하지만 약간 중복된다",
          "청킹 전략은 검색 품질에 아무 영향이 없다",
        ],
        correctIndex: 3,
        explanation: "청킹은 검색 품질의 출발점. 같은 문서라도 어떻게 자르냐에 따라 '정답 청크' 가 찾아지는지가 달라진다.",
      },
    ],
  } satisfies Quiz,
};
