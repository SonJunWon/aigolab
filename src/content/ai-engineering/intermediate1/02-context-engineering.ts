import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson02: Lesson = {
  id: "ai-eng-m1-02-context-engineering",
  language: "ai-engineering",
  track: "intermediate1",
  order: 2,
  title: "컨텍스트 엔지니어링 — 트윈의 작업 기억",
  subtitle: "트윈을 크게 만드는 것과, 트윈을 잘 배치하는 것은 다르다",
  estimatedMinutes: 40,
  cells: [
    {
      type: "markdown",
      source: `# 🪟 컨텍스트 엔지니어링

> 💡 **보라색 점선 밑줄** 단어는 전문 용어 — 올리면 설명이 나옵니다.

중1-01 에서 **지식 트윈**을 만들었습니다. 그런데 트윈이 아무리 좋아도,
모델에게 **어떻게 보여주느냐**에 따라 답 품질이 크게 달라져요.

### 이 강의 한 줄
> "트윈을 **크게** 만드는 것" 과 "트윈을 **잘 배치**하는 것" 은 다르다.
> 컨텍스트는 무한하지 않다 — 한정된 ==컨텍스트 윈도우== 라는 작업대 위에 근거를 **잘 놓는** 기술이 컨텍스트 엔지니어링.

### 배울 것
- ==컨텍스트 윈도우== 의 물리학 — 토큰 예산·비용·지연
- ==lost-in-the-middle== — 가운데 정보를 흘려보내는 현상
- 한정된 예산 안에서 근거를 **우선순위로 배치**하기`,
    },

    {
      type: "markdown",
      source: `## 🪟 컨텍스트 윈도우 = 모델의 작업대

모델은 한 번에 일정량의 ==토큰== 만 볼 수 있어요. 이게 컨텍스트 윈도우입니다.

\`\`\`
[ system 지시 ][ 검색된 트윈 근거 ][ 대화 기록 ][ 이번 질문 ]
└────────────── 컨텍스트 윈도우 (토큰 예산) ──────────────┘
\`\`\`

### 트레이드오프 — 길수록 좋은 게 아니다
| 컨텍스트를 늘리면 | 결과 |
|---|---|
| 💰 비용 | 토큰당 과금 → **선형 증가** |
| 🐢 지연 | 입력이 길수록 **느려짐** |
| 🎯 정확도 | 무관한 근거가 섞이면 오히려 **떨어짐** (noise) |

> 그래서 "관련 청크를 **많이** 넣자" 가 아니라 "**딱 맞는** 근거를, **좋은 자리**에 넣자" 가 핵심.
아래에서 길이에 따른 지연을 직접 재 봅니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 컨텍스트 길이 → 지연 체감 (같은 질문, context 길이만 다르게)
const question = "한 문장으로 답해: 고양이는 어떤 동물?";

// 짧은 컨텍스트
const short = "고양이는 포유류다.";
// 긴 컨텍스트 — 무관한 채움 문장 다수 (트윈에 noise 가 많은 상황 모사)
const filler = Array.from({ length: 40 }, (_, i) =>
  \`참고\${i}: 이것은 질문과 무관한 채움 문장입니다. 길이를 늘리기 위한 텍스트.\`
).join("\\n");
const long = filler + "\\n고양이는 포유류다.\\n" + filler;

async function ask(label: string, context: string) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "context 만 근거로 아주 짧게 답해." },
      { role: "user", content: \`context:\\n\${context}\\n\\n질문: \${question}\` },
    ],
  });
  console.log(\`[\${label}] context \${context.length}자 → \${res.latencyMs}ms\`);
  console.log("  답:", res.text.trim());
}

await ask("짧은 컨텍스트", short);
await ask("긴 컨텍스트", long);
console.log("\\n👉 보통 긴 쪽이 더 느립니다. 비용도 입력 토큰에 비례해 늘어나요.");
console.log("👉 핵심 근거('고양이는 포유류') 한 줄은 같은데, 채움이 많을수록 손해.");`,
      hints: [
        "latencyMs 는 네트워크·서버 상황에 따라 출렁입니다. 여러 번 돌려 경향을 보세요(긴 쪽이 평균적으로 느림).",
        "실무에선 길이=비용. 입력 토큰 1개도 과금되므로 '무관한 청크'는 돈 낭비 + noise.",
        "다음 셀에선 '같은 근거를 어디에 두느냐' 가 정확도에 미치는 영향을 봅니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🕳️ lost-in-the-middle — 가운데를 흘려보낸다

긴 컨텍스트에서 모델은 **맨 앞과 맨 뒤**를 잘 기억하고, **가운데**는 놓치는 경향이 있어요.
사람도 긴 목록의 중간을 잊는 것과 비슷합니다.

\`\`\`
정확도 ▲
 높음  ●                         ●
      │ ＼                     ／
 낮음 │   ●●●●●●●●●●●●●●●●●●●●●
      └─────────────────────────▶ 근거의 위치
        앞      가운데      뒤
\`\`\`

> ⚠️ 최신 모델은 이 현상이 **약해지는** 추세예요. 아래 실습에서 효과가 약하면,
> 채움 문장을 더 늘리거나 모델을 바꿔 보세요. **"가능하면 핵심 근거를 끝에 둔다"** 는 원칙은 여전히 유효합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 같은 정답을 '앞 / 가운데 / 뒤' 에 두고 회수되는지 비교
const needle = "비밀 코드는 보라매-7782 이다.";
const question = "비밀 코드가 뭐야? 코드만 답해.";

// 방해 문장 더미
const noise = (n: number) => Array.from({ length: n }, (_, i) =>
  \`잡담\${i}: 오늘 날씨와 점심 메뉴에 대한 무관한 이야기.\`).join("\\n");

const layouts = {
  "앞":     needle + "\\n" + noise(30),
  "가운데": noise(15) + "\\n" + needle + "\\n" + noise(15),
  "뒤":     noise(30) + "\\n" + needle,
};

for (const [pos, context] of Object.entries(layouts)) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "context 에서 찾아 코드만 답해." },
      { role: "user", content: \`context:\\n\${context}\\n\\n질문: \${question}\` },
    ],
  });
  const ok = res.text.includes("보라매-7782");
  console.log(\`[근거 위치: \${pos}] \${ok ? "✅ 회수" : "❌ 놓침"} → \${res.text.trim()}\`);
}
console.log("\\n👉 가운데에서 더 자주 놓치면 lost-in-the-middle. (최신 모델은 약할 수 있음)");
console.log("👉 원칙: 가장 중요한 근거는 컨텍스트의 '끝(질문 직전)' 에 두자.");`,
      hints: [
        "효과가 안 보이면 noise(30) 을 noise(80) 으로 늘리거나 needle 을 더 평범한 문장으로 바꿔보세요.",
        "현대 모델은 견고해지는 중 — '안 틀리는 것' 자체가 좋은 소식이지만, 원칙(중요한 건 끝에)은 안전장치로 유지.",
        "RAG 에서 검색 상위 청크를 '질문 가까이' 배치하는 게 이 원칙의 실전 적용입니다.",
      ],
    },

    {
      type: "markdown",
      source: `## 🧱 컨텍스트 배치 패턴

좋은 컨텍스트 레이아웃의 기본형:

\`\`\`
[system]  역할 + 규칙 (예: "아래 근거만 사용, 없으면 모른다고")
[근거]    검색된 트윈 청크 — score 높은 순, 가장 중요한 건 끝쪽
[대화]    이전 대화 요약 (필요할 때만)
[user]    이번 질문  ← 모델이 가장 마지막에 읽는 = 가장 잘 기억
\`\`\`

### 토큰 예산 = 돈과 자리
- 예산이 1000 토큰인데 청크가 20개면 **다 못 넣음** → **점수순으로 잘라야** 함.
- "관련 없는 청크를 버리는 것" 도 컨텍스트 엔지니어링의 일부.

아래에서 **우선순위 컨텍스트 빌더**를 만듭니다 — 예산 안에서 점수순으로 채우기.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 우선순위 컨텍스트 빌더 — 토큰 예산 안에서 점수 높은 근거만, 중요한 건 끝에
type Scored = { text: string; score: number };

// (대략) 토큰 ≈ 글자수/2 로 가정한 간이 추정기
const estTokens = (s: string) => Math.ceil(s.length / 2);

function buildContext(chunks: Scored[], budgetTokens: number): string {
  // ① 점수 높은 순 정렬
  const sorted = [...chunks].sort((a, b) => b.score - a.score);
  // ② 예산 안에서 채우기
  const picked: Scored[] = [];
  let used = 0;
  for (const c of sorted) {
    const t = estTokens(c.text);
    if (used + t > budgetTokens) continue; // 예산 초과분은 버림
    picked.push(c); used += t;
  }
  // ③ '가장 중요한 근거를 끝에' — 점수 오름차순으로 배치(끝이 최고점)
  picked.sort((a, b) => a.score - b.score);
  console.log(\`예산 \${budgetTokens}토큰 중 \${used}토큰 사용, \${picked.length}/\${chunks.length} 청크 선택\`);
  return picked.map(c => \`(score \${c.score.toFixed(2)}) \${c.text}\`).join("\\n");
}

const chunks: Scored[] = [
  { text: "환불은 구매 후 14일 이내 가능하다.", score: 0.91 },
  { text: "고객센터 운영시간은 평일 9-18시.", score: 0.42 },
  { text: "배송은 보통 2-3일 소요된다.", score: 0.55 },
  { text: "환불 시 배송비는 고객 부담이다.", score: 0.88 },
  { text: "회원가입은 무료다.", score: 0.12 },
];

console.log(buildContext(chunks, 60));
console.log("\\n👉 점수 낮은 '회원가입 무료'·'운영시간' 은 예산에서 밀려 제외. 환불 관련 고득점이 끝에.");`,
      hints: [
        "estTokens 는 간이 추정 — 실무에선 tiktoken 같은 정확한 토크나이저를 씁니다.",
        "budgetTokens 를 20 으로 줄이면 최고점 1~2개만 남습니다. 예산이 곧 선택압.",
        "③ '중요한 건 끝에' 가 lost-in-the-middle 방어. 질문은 이 context 뒤에 붙으니 최고점이 질문에 가장 가까워짐.",
      ],
    },

    {
      type: "markdown",
      source: `## 🎯 미션 — 내 예산 컨텍스트 빌더

\`buildContext\` 에 **최소 점수 필터**를 추가하세요.
score 가 \`minScore\` 미만인 청크는 예산이 남아도 **넣지 않습니다**(noise 차단).`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `type Scored = { text: string; score: number };
const estTokens = (s: string) => Math.ceil(s.length / 2);

// 🎯 TODO: minScore 미만 청크는 제외하도록 한 줄을 추가하세요.
function buildContext(chunks: Scored[], budgetTokens: number, minScore = 0.3): string {
  const sorted = [...chunks]
    // TODO: 여기에 minScore 필터 추가  .filter(...)
    .sort((a, b) => b.score - a.score);

  const picked: Scored[] = [];
  let used = 0;
  for (const c of sorted) {
    const t = estTokens(c.text);
    if (used + t > budgetTokens) continue;
    picked.push(c); used += t;
  }
  picked.sort((a, b) => a.score - b.score);
  console.log(\`사용 \${used}토큰, \${picked.length}/\${chunks.length} 청크 (minScore \${minScore})\`);
  return picked.map(c => \`(\${c.score.toFixed(2)}) \${c.text}\`).join("\\n");
}

const chunks: Scored[] = [
  { text: "환불은 14일 이내 가능.", score: 0.91 },
  { text: "회원가입은 무료다.", score: 0.12 },
  { text: "환불 배송비는 고객 부담.", score: 0.88 },
  { text: "오늘 점심은 김치찌개.", score: 0.05 },
];

console.log(buildContext(chunks, 100, 0.3));
console.log("\\n👉 score 0.12, 0.05 청크는 예산이 남아도 제외돼야 정답.");`,
      hints: [
        ".filter(c => c.score >= minScore) 를 .sort 앞에 넣으면 됩니다.",
        "noise 차단은 비용 절감 + 정확도 향상 둘 다 잡습니다.",
        "minScore 기준은 도메인마다 달라요 — 검색 score 분포를 보고 정합니다(중1-05 에서 더 다룸).",
      ],
      solution: `type Scored = { text: string; score: number };
const estTokens = (s: string) => Math.ceil(s.length / 2);

function buildContext(chunks: Scored[], budgetTokens: number, minScore = 0.3): string {
  const sorted = [...chunks]
    .filter(c => c.score >= minScore)
    .sort((a, b) => b.score - a.score);

  const picked: Scored[] = [];
  let used = 0;
  for (const c of sorted) {
    const t = estTokens(c.text);
    if (used + t > budgetTokens) continue;
    picked.push(c); used += t;
  }
  picked.sort((a, b) => a.score - b.score);
  console.log(\`사용 \${used}토큰, \${picked.length}/\${chunks.length} 청크 (minScore \${minScore})\`);
  return picked.map(c => \`(\${c.score.toFixed(2)}) \${c.text}\`).join("\\n");
}

const chunks: Scored[] = [
  { text: "환불은 14일 이내 가능.", score: 0.91 },
  { text: "회원가입은 무료다.", score: 0.12 },
  { text: "환불 배송비는 고객 부담.", score: 0.88 },
  { text: "오늘 점심은 김치찌개.", score: 0.05 },
];

console.log(buildContext(chunks, 100, 0.3));`,
    },

    {
      type: "markdown",
      source: `## 🧭 중1-02 정리

- ✅ 컨텍스트 윈도우 = 한정된 작업대. **길수록 비싸고 느리고, noise 면 부정확**.
- ✅ ==lost-in-the-middle== — 가운데 근거를 놓치기 쉬움 → **중요한 건 끝(질문 직전)에**.
- ✅ 배치 패턴: \`system → 근거(점수순) → 대화 → 질문\`.
- ✅ **우선순위 빌더**: 예산 안에서 점수순 + 최소점수 필터로 noise 차단.

### 다음 강 — 중1-03 영속 지식 베이스
지금까지 트윈은 **인메모리** — 새로고침하면 사라집니다.
- IndexedDB 로 트윈을 **디스크에 영속화**
- 관리형 벡터 DB(pgvector·Pinecone) 로의 확장
- SDK 번역표(중1-01)가 **처음 실전 적용**됩니다.`,
    },
  ],

  quiz: {
    title: "중1-02 — 컨텍스트 엔지니어링 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "컨텍스트를 무조건 길게(청크를 많이) 넣으면 생기는 문제가 아닌 것은?",
        options: [
          "토큰 비용이 늘어난다",
          "응답이 느려진다",
          "무관한 근거가 noise 가 되어 정확도가 떨어질 수 있다",
          "모델의 가중치가 변경된다",
        ],
        correctIndex: 3,
        explanation: "컨텍스트를 넣는 것은 런타임 트윈일 뿐, 가중치(학습된 뇌)는 바뀌지 않는다. 비용↑·지연↑·noise 로 인한 정확도↓ 가 길이의 대가다.",
      },
      {
        type: "multiple-choice",
        question: "lost-in-the-middle 현상에 대한 실전 원칙으로 가장 적절한 것은?",
        options: [
          "가장 중요한 근거를 컨텍스트 가운데에 둔다",
          "가장 중요한 근거를 컨텍스트 끝(질문 직전)에 둔다",
          "근거를 무작위로 섞는다",
          "근거를 모두 system 에만 넣는다",
        ],
        correctIndex: 1,
        explanation: "모델은 앞·뒤를 잘 기억하고 가운데를 흘리기 쉽다. 질문은 맨 뒤에 오므로, 중요한 근거를 끝(질문 가까이)에 두면 가장 잘 반영된다.",
      },
      {
        type: "multiple-choice",
        question: "토큰 예산이 부족해 청크를 다 못 넣을 때 올바른 전략은?",
        options: [
          "아무거나 먼저 들어온 순서로 자른다",
          "검색 score 높은 순으로 채우고, 낮은 것·예산 초과분은 버린다",
          "모든 청크를 절반씩 잘라 넣는다",
          "예산을 무시하고 다 넣는다",
        ],
        correctIndex: 1,
        explanation: "예산은 곧 선택압. score 높은 근거 우선, 최소점수 미만은 noise 라 제외. 자르는 것도 컨텍스트 엔지니어링의 일부다.",
      },
      {
        type: "multiple-choice",
        question: "최신 모델에서 lost-in-the-middle 효과가 약하게 나타날 때 올바른 태도는?",
        options: [
          "현상이 거짓이므로 배치는 신경 쓸 필요 없다",
          "모델이 견고해진 것은 좋은 일이며, '중요한 건 끝에' 원칙은 안전장치로 유지한다",
          "일부러 가운데에 넣어 모델을 시험한다",
          "컨텍스트를 최대한 길게 만든다",
        ],
        correctIndex: 1,
        explanation: "모델이 견고해지는 건 환영할 일. 다만 환경·길이에 따라 재현될 수 있으므로, 비용이 들지 않는 안전장치(중요한 건 끝에)는 유지하는 게 합리적이다.",
      },
    ],
  } satisfies Quiz,
};
