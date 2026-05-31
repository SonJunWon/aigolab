import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson08: Lesson = {
  id: "ai-eng-m1-08-capstone-domain-twin",
  language: "ai-engineering",
  track: "intermediate1",
  order: 8,
  title: "Capstone — 도메인 지식 트윈 RAG",
  subtitle: "출처를 추적하고, 영속하며, 대화로 이어지는 도메인 Q&A 트윈을 완성한다",
  estimatedMinutes: 60,
  cells: [
    {
      type: "markdown",
      source: `# 🏗️ Capstone — 도메인 지식 트윈

> 💡 보라색 점선 밑줄 = 전문 용어.

중급1 에서 배운 모든 것을 하나로 묶습니다.
**모델을 다시 훈련시키지 않고**, 옆에 **잘 조직되고·정확히 검색되고·출처를 달고·대화로 이어지는** 지식 트윈을 짓습니다.

### 조립할 기술 스택
| 단계 | 기술 | 배운 강 |
|---|---|---|
| 조각내기 | overlap 청킹 + ==메타데이터== | 중1-04 |
| 저장 | 임베딩 + 영속(직렬화/localStorage) | 중1-03 |
| 꺼내기 | 하이브리드 검색 + 재랭킹 | 중1-05 |
| 답하기 | 번호 인용 + 근거 밖 거부 | 중1-06 |
| 잇기 | query rewriting (멀티턴) | 중1-07 |
| 배치 | 컨텍스트 우선순위 | 중1-02 |`,
    },

    {
      type: "markdown",
      source: `## 🗺️ 아키텍처

\`\`\`
문서들 ──▶ ❶ overlap 청킹 + meta(source) ──▶ ❷ embed ──▶ 트윈(VectorStore, 영속 가능)
                                                              │
대화 + 후속질문 ──▶ ❸ query rewriting(독립 질의) ──▶ ❹ 검색 ─┘
                                                              │
                                            ❺ 번호 매긴 근거 + 컨텍스트 배치
                                                              │
                                  ❻ LLM: [N] 인용 답변 (근거 밖이면 거부)
                                                              │
                                            ❼ [N] → 원문·출처 역추적
\`\`\`

아래 셀이 **참조 구현** — 그대로 돌려보고, 다음 미션에서 직접 만듭니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 📦 도메인 지식 트윈 RAG — 참조 구현 (인덱싱 → 멀티턴 인용 답변)

// ❶ overlap 청킹
function chunk(text: string, size = 60, overlap = 15): string[] {
  const clean = text.replace(/\\s+/g, " ").trim();
  const out: string[] = []; let s = 0;
  while (s < clean.length) {
    const e = Math.min(s + size, clean.length);
    out.push(clean.slice(s, e));
    if (e >= clean.length) break;
    s = e - overlap;
  }
  return out;
}

const store = new VectorStore();

// ❶❷ 인덱싱: 청킹 + 메타 + 임베딩 + 저장
async function indexDoc(source: string, text: string) {
  const chunks = chunk(text);
  const vecs = await embed(chunks);
  store.add(chunks.map((t, i) => ({ id: \`\${source}-\${i}\`, text: t, embedding: vecs[i], meta: { source } })));
}

// ❸ query rewriting
async function rewrite(history: {role:string;content:string}[], q: string): Promise<string> {
  if (history.length === 0) return q;
  const r = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "이전 대화를 참고해 마지막 질문을 독립 검색 질의 한 문장으로 다시 써. 질문만 출력." },
      { role: "user", content: \`대화:\\n\${history.map(h => h.role + ": " + h.content).join("\\n")}\\n\\n마지막 질문: \${q}\` },
    ],
  });
  return r.text.trim();
}

// ❹❺❻❼ 검색 + 인용 답변 + 역추적
async function ask(history: {role:string;content:string}[], q: string) {
  const sq = await rewrite(history, q);
  const [qv] = await embed([sq]);
  const hits = store.search(qv, 3);
  const context = hits.map((h, i) => \`[\${i + 1}] \${h.text}\`).join("\\n");
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "아래 근거만 사용. 답할 수 있으면 문장 끝에 [N] 인용. 근거에 없으면 '제공된 문서에 없습니다'." },
      { role: "user", content: \`근거:\\n\${context}\\n\\n질문: \${sq}\` },
    ],
  });
  console.log(\`\\n❓ \${q}  (검색질의: \${sq})\`);
  console.log("💬 " + res.text.trim());
  [...new Set([...res.text.matchAll(/\\[(\\d+)\\]/g)].map(m => Number(m[1])))].forEach(n => {
    const h = hits[n - 1]; if (h) console.log(\`   └ [\${n}] \${(h.meta as any).source}: "\${h.text}"\`);
  });
}

// 데모 — 도메인 문서 인덱싱 후 멀티턴 대화
await indexDoc("환불정책.md", "환불은 구매 후 14일 이내 신청 가능하다. 환불 승인 시 왕복 배송비는 고객이 부담한다. 디지털 상품은 환불되지 않는다.");
await indexDoc("요금.md", "프리미엄은 월 9900원이며 광고 제거와 무제한 저장을 제공한다.");
console.log("트윈 크기:", store.size, "청크");

const history: {role:string;content:string}[] = [];
await ask(history, "환불은 며칠 이내에 신청해?");
history.push({ role: "user", content: "환불은 며칠 이내에 신청해?" }, { role: "assistant", content: "14일 이내입니다." });
await ask(history, "그때 배송비는 누가 내?");   // 멀티턴: '그때'→'환불 시'
await ask(history, "해외 배송도 돼?");          // 근거 밖 → 거부`,
      hints: [
        "indexDoc 를 여러 번 부르면 트윈이 누적됩니다(여러 도메인 문서).",
        "ask 는 rewrite→검색→인용답변→역추적의 한 사이클. history 를 누적하면 멀티턴이 됩니다.",
        "영속화하려면 중1-03 처럼 store 의 docs 를 직렬화해 localStorage 에 저장/복원하면 됩니다(보너스).",
      ],
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 나만의 도메인 트윈

참조 구현을 바탕으로, **여러분의 도메인**(취미·업무·관심사) Q&A 트윈을 만드세요.

### 요구사항
1. \`indexDoc\` 으로 **서로 다른 출처 2개 이상** 인덱싱
2. 멀티턴 대화 — 두 번째 질문은 **맥락 의존**("그건…", "그럼…")
3. 답변에 \`[N]\` 인용 + **출처 역추적** 출력
4. 근거 밖 질문엔 **거부** 확인

### 보너스
- 중1-05 재랭킹을 \`ask\` 에 끼워 검색 품질 ↑
- 중1-03 직렬화로 트윈 **영속화**`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 🎯 TODO: 참조 구현을 가져와 '나만의 도메인' 으로 채우세요.
function chunk(text: string, size = 60, overlap = 15): string[] {
  const clean = text.replace(/\\s+/g, " ").trim();
  const out: string[] = []; let s = 0;
  while (s < clean.length) {
    const e = Math.min(s + size, clean.length);
    out.push(clean.slice(s, e));
    if (e >= clean.length) break;
    s = e - overlap;
  }
  return out;
}
const store = new VectorStore();

async function indexDoc(source: string, text: string) {
  const chunks = chunk(text);
  const vecs = await embed(chunks);
  store.add(chunks.map((t, i) => ({ id: \`\${source}-\${i}\`, text: t, embedding: vecs[i], meta: { source } })));
}

// TODO: rewrite, ask 를 참조 구현에서 가져오세요.

// TODO: 내 도메인 문서 2개 이상 인덱싱
// await indexDoc("나의문서1.md", "...");
// await indexDoc("나의문서2.md", "...");

// TODO: 멀티턴 대화 — 맥락 의존 질문 + 근거 밖 질문 포함
console.log("미션: 참조 구현을 채워 나만의 도메인 트윈을 완성하세요. (정답 보기 참고)");`,
      hints: [
        "참조 구현 셀의 rewrite·ask 함수를 그대로 복사해 오세요.",
        "출처가 다른 문서 2개를 넣어야 인용 역추적에서 '어느 문서' 가 의미를 가집니다.",
        "두 번째 질문을 '그건/그럼' 으로 시작해 query rewriting 이 작동하는지 확인하세요.",
      ],
      solution: `function chunk(text: string, size = 60, overlap = 15): string[] {
  const clean = text.replace(/\\s+/g, " ").trim();
  const out: string[] = []; let s = 0;
  while (s < clean.length) {
    const e = Math.min(s + size, clean.length);
    out.push(clean.slice(s, e));
    if (e >= clean.length) break;
    s = e - overlap;
  }
  return out;
}
const store = new VectorStore();

async function indexDoc(source: string, text: string) {
  const chunks = chunk(text);
  const vecs = await embed(chunks);
  store.add(chunks.map((t, i) => ({ id: \`\${source}-\${i}\`, text: t, embedding: vecs[i], meta: { source } })));
}
async function rewrite(history: {role:string;content:string}[], q: string): Promise<string> {
  if (history.length === 0) return q;
  const r = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "이전 대화를 참고해 마지막 질문을 독립 검색 질의 한 문장으로 다시 써. 질문만 출력." },
      { role: "user", content: \`대화:\\n\${history.map(h => h.role + ": " + h.content).join("\\n")}\\n\\n마지막 질문: \${q}\` },
    ],
  });
  return r.text.trim();
}
async function ask(history: {role:string;content:string}[], q: string) {
  const sq = await rewrite(history, q);
  const [qv] = await embed([sq]);
  const hits = store.search(qv, 3);
  const context = hits.map((h, i) => \`[\${i + 1}] \${h.text}\`).join("\\n");
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "아래 근거만 사용. 답하면 문장 끝에 [N] 인용. 없으면 '제공된 문서에 없습니다'." },
      { role: "user", content: \`근거:\\n\${context}\\n\\n질문: \${sq}\` },
    ],
  });
  console.log(\`\\n❓ \${q}  (검색질의: \${sq})\`);
  console.log("💬 " + res.text.trim());
  [...new Set([...res.text.matchAll(/\\[(\\d+)\\]/g)].map(m => Number(m[1])))].forEach(n => {
    const h = hits[n - 1]; if (h) console.log(\`   └ [\${n}] \${(h.meta as any).source}: "\${h.text}"\`);
  });
}

// 내 도메인 — 홈카페 예시
await indexDoc("원두.md", "에티오피아 예가체프는 꽃향과 산미가 특징이다. 다크로스트보다 미디엄이 향을 잘 살린다.");
await indexDoc("추출.md", "핸드드립 적정 물온도는 90-93도다. 분쇄도가 가늘수록 쓴맛이 강해진다.");
console.log("트윈 크기:", store.size, "청크");

const history: {role:string;content:string}[] = [];
await ask(history, "예가체프는 어떤 맛이야?");
history.push({ role: "user", content: "예가체프는 어떤 맛이야?" }, { role: "assistant", content: "꽃향과 산미가 특징입니다." });
await ask(history, "그거 내릴 때 물온도는?");   // 맥락 의존
await ask(history, "우유 스티밍 온도는?");       // 근거 밖 → 거부`,
    },

    {
      type: "markdown",
      source: `## 🎓 중급1 수료 — 지식 트윈을 지을 수 있게 되었습니다

여러분이 이제 할 수 있는 것:
- ✅ 학습 vs 트윈을 구분하고, **언제 RAG 를 쓸지** 판단 (중1-01)
- ✅ 컨텍스트를 **예산 안에서 잘 배치** (중1-02)
- ✅ 트윈을 **영속화** (중1-03)
- ✅ **overlap 청킹 + 메타데이터** 로 조직 (중1-04)
- ✅ **하이브리드 검색 + 재랭킹** 으로 정확히 검색 (중1-05)
- ✅ **정확한 인용 + 근거 밖 거부** (중1-06)
- ✅ **멀티턴 + 지식 갱신** (중1-07)
- ✅ 이 모두를 묶은 **도메인 Q&A 트윈** (Capstone)

### 다음 여정
- **✦ MCP 특별강의** — 이 트윈을 노션·드라이브 등 **외부와 표준으로 연결**(Model **Context** Protocol)
- **📙 중급2 — 에이전틱** — 트윈에 **손발**을 달아, 검색을 넘어 **행동**하는 에이전트로

> 트윈은 "안다". 다음은 트윈이 "한다" 입니다.`,
    },
  ],

  quiz: {
    title: "중1-Capstone — 통합 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "도메인 지식 트윈 RAG 의 한 사이클(ask) 순서로 올바른 것은?",
        options: [
          "검색 → 재작성 → 답변 → 인용",
          "(멀티턴) 질의 재작성 → 검색 → 번호 매긴 근거로 인용 답변 → 출처 역추적",
          "답변 → 검색 → 청킹 → 임베딩",
          "임베딩 → 거부 → 재작성 → 저장",
        ],
        correctIndex: 1,
        explanation: "맥락 의존 질문을 독립 질의로 재작성(07) → 검색(05) → 번호 근거로 인용 답변·거부(06) → [N] 을 출처로 역추적. 중급1 전 강의 통합이다.",
      },
      {
        type: "multiple-choice",
        question: "인용 역추적([N]→출처)이 가능하려면 인덱싱 단계에서 꼭 해야 하는 것은?",
        options: [
          "temperature 를 0 으로 둔다",
          "청크에 meta(source 등)를 붙여 저장하고, 검색 결과 배열을 보관해 번호와 매핑한다",
          "모든 청크를 하나로 합친다",
          "임베딩을 저장하지 않는다",
        ],
        correctIndex: 1,
        explanation: "메타데이터(중1-04)와 번호↔청크 매핑(중1-06)이 있어야 답변의 [N] 을 실제 문서·위치로 되짚을 수 있다.",
      },
      {
        type: "multiple-choice",
        question: "이 Capstone 이 '학습(파인튜닝)' 대신 '트윈(RAG)' 으로 도메인 지식을 다루는 이유로 가장 적절한 것은?",
        options: [
          "RAG 가 항상 더 똑똑해서",
          "도메인 문서는 자주 바뀌고 출처가 중요하므로, 재훈련 없이 즉시 갱신·추적 가능한 트윈이 적합해서",
          "임베딩이 가중치를 바꾸기 때문에",
          "파인튜닝이 불가능해서",
        ],
        correctIndex: 1,
        explanation: "중1-01 의 결정 기준 그대로 — 자주 바뀌고·출처가 중요하고·도메인 전용인 지식은 트윈의 영역. 즉시 갱신과 인용 추적이 핵심 이점이다.",
      },
    ],
  } satisfies Quiz,
};
