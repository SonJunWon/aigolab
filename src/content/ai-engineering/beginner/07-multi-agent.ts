import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson07: Lesson = {
  id: "ai-eng-07-multi-agent",
  language: "ai-engineering",
  track: "beginner",
  order: 7,
  title: "멀티 에이전트 — 조사·집필·검토 삼각팀",
  subtitle: "여러 AI 에이전트가 협업해 하나의 결과물을 만들기",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🤝 왜 에이전트를 여러 개 쓰는가?

Ch06 의 이메일 에이전트는 혼자 다 했어요. 간단한 일엔 충분하지만 **복잡한 일** 에선 한계가 옵니다.

### 단일 에이전트의 한계

| 문제 | 설명 |
|---|---|
| **전문성 분산** | 하나가 조사도, 글도, 검토도 잘 하긴 어려움 |
| **컨텍스트 폭발** | 대화가 길어지면 초반 지시를 잊음 (context window 한계) |
| **모니터링 어려움** | "이 에이전트가 지금 뭐 하는 거지?" 파악 힘듦 |
| **재사용 불가** | 에이전트 하나를 통으로 만들면 다른 프로젝트에 부분 활용 불가 |

### 멀티 에이전트 = 역할 분리

마치 **팀 프로젝트**:
- 🔍 **조사자**: 주제를 리서치해 키 포인트 정리
- ✍️ **집필자**: 키 포인트를 바탕으로 블로그 글 작성
- 🔎 **검토자**: 초안을 읽고 피드백·수정 제안

각자 **다른 system prompt** + **다른 tool 세트** 를 갖고, 결과를 **다음 에이전트의 입력** 으로 넘깁니다.

## 이 장에서 배울 것
1. **2-에이전트 체인** (조사 → 집필) — 기본 패턴
2. **메시지 전달 프로토콜** — 에이전트 간 JSON 계약
3. **3-에이전트 파이프라인** (조사 → 집필 → 검토) — 피드백 루프
4. 위험: 연쇄 환각·비용·교착 대응
5. 미션: 자유 주제 블로그 글 자동 생성`,
    },

    {
      type: "markdown",
      source: `## 🔗 2-에이전트 체인 — 가장 간단한 멀티 에이전트

**패턴**: Agent A 의 output → Agent B 의 input.

\`\`\`
사용자: "AI 에이전트에 대해 블로그 글 써줘"
  ↓
[🔍 조사자 에이전트]
  system: "너는 기술 리서처야. 주제의 핵심 포인트 5개를 JSON 으로 정리"
  output: { points: ["...", "...", ...] }
  ↓
[✍️ 집필자 에이전트]
  system: "너는 블로그 작가야. 제공된 포인트를 바탕으로 한국어 블로그 글 작성"
  input: 조사자의 output
  output: 블로그 글 완성본
  ↓
사용자에게 최종 글 반환
\`\`\`

핵심:
- 각 에이전트는 **독립적인 chatWithTools 호출** (또는 단순 chat)
- 에이전트 간 데이터 교환은 **JavaScript 변수** (JSON 객체)
- 오케스트레이션은 **학생 코드** 에서 직접 (프레임워크 없음)`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 2-에이전트 체인: 조사자 → 집필자

// Step 1: 조사자 — 핵심 포인트 추출 (구조화 출력)
const ResearchSchema = z.object({
  topic: z.string(),
  points: z.array(z.object({
    title: z.string(),
    detail: z.string(),
  })).describe("핵심 포인트 3~5개"),
});

const researchResult = await chat({
  provider: "gemini",
  responseSchema: toJsonSchema(ResearchSchema),
  messages: [
    {
      role: "system",
      content: "너는 기술 리서처야. 주제의 핵심 포인트 3~5개를 title/detail 구조로 정리해.",
    },
    {
      role: "user",
      content: "주제: AI 에이전트가 소프트웨어 개발을 어떻게 바꾸고 있는가",
    },
  ],
});

const research = ResearchSchema.parse(researchResult.json);
console.log("🔍 조사 완료:", research.points.length, "포인트");
research.points.forEach((p, i) => console.log(\`  \${i+1}. \${p.title}\`));

// Step 2: 집필자 — 블로그 글 작성
const draft = await chat({
  provider: "gemini",
  stream: true,
  messages: [
    {
      role: "system",
      content: "너는 한국어 기술 블로그 작가야. 제공된 리서치 포인트를 바탕으로 600~800자 블로그 글을 작성해. 서론·본론·결론 구조. 친근하지만 전문적인 어조.",
    },
    {
      role: "user",
      content: "아래 리서치 결과를 바탕으로 블로그 글을 써줘:\\n\\n" +
        research.points.map((p, i) => \`\${i+1}. \${p.title}: \${p.detail}\`).join("\\n"),
    },
  ],
});

console.log("\\n✍️ 블로그 글:");
console.log(draft.text);`,
      hints: [
        "조사자는 responseSchema 로 JSON 강제 — 집필자의 input 으로 쓰기 쉽게.",
        "집필자는 stream:true — 글이 써지는 과정을 실시간 관찰.",
        "두 에이전트를 연결하는 건 JavaScript 변수(research.points). 프레임워크 불필요.",
      ],
    },

    {
      type: "markdown",
      source: `## 📝 메시지 전달 프로토콜 — 에이전트 간 계약

방금 조사자 → 집필자 사이에 **JSON 객체** 가 오갔어요. 이게 **에이전트 간 프로토콜**.

실무에선 이 계약을 **명확히 문서화** 합니다:

\`\`\`
조사자 output contract (zod):
  z.object({ topic, points: [{title, detail}] })

집필자 input contract:
  위 스키마를 문자열로 직렬화해 user 메시지로 전달

검토자 input contract:
  { draftText: string, originalPoints: Point[] }
\`\`\`

### 왜 중요?
- 에이전트 하나를 **교체** 해도 계약만 지키면 다른 에이전트 영향 없음
- **디버깅** 용이 — 계약 불일치 시 zod.parse 에서 즉시 감지
- **재사용** 가능 — 같은 조사자를 다른 파이프라인에서 활용`,
    },

    {
      type: "markdown",
      source: `## 🔄 3-에이전트 파이프라인 — 피드백 루프

이번엔 **검토자** 를 추가. 검토자가 "수정 필요" 판정하면 **집필자에게 되돌아감** (1회).

\`\`\`
사용자 → [🔍 조사] → [✍️ 집필] → [🔎 검토]
                                        ↓
                              승인?  YES → 최종 반환
                                     NO  → [✍️ 재집필] → 최종 반환
\`\`\`

이 패턴이 **Critic Loop** — 품질 게이트로 자주 쓰임.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 3-에이전트 파이프라인: 조사 → 집필 → 검토 (→ 선택적 재집필)

const topic = "2026년 주목해야 할 AI 트렌드 3가지";

// Agent 1: 조사자
console.log("🔍 조사 시작...");
const ResearchSchema = z.object({
  points: z.array(z.object({ title: z.string(), detail: z.string() })),
});

const researchRes = await chat({
  provider: "gemini",
  responseSchema: toJsonSchema(ResearchSchema),
  messages: [
    { role: "system", content: "기술 리서처. 핵심 포인트 3개를 title/detail JSON 으로." },
    { role: "user", content: "주제: " + topic },
  ],
});
const research = ResearchSchema.parse(researchRes.json);
console.log("  포인트:", research.points.map(p => p.title).join(", "));

// Agent 2: 집필자
console.log("\\n✍️ 초안 작성...");
const draftRes = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "한국어 블로그 작가. 500자 이내. 서론·본론·결론." },
    { role: "user", content: "리서치:\\n" + research.points.map((p,i) => \`\${i+1}. \${p.title}: \${p.detail}\`).join("\\n") },
  ],
});
let finalDraft = draftRes.text;
console.log("  초안 길이:", finalDraft.length, "자");

// Agent 3: 검토자
console.log("\\n🔎 검토...");
const ReviewSchema = z.object({
  approved: z.boolean(),
  feedback: z.string().describe("수정이 필요한 경우 구체적 피드백"),
  score: z.number().int().min(1).max(10),
});

const reviewRes = await chat({
  provider: "gemini",
  responseSchema: toJsonSchema(ReviewSchema),
  messages: [
    { role: "system", content: "글 검토자. approved/feedback/score(1~10) JSON 반환. 7점 이상이면 approved:true." },
    { role: "user", content: "검토할 블로그 초안:\\n\\n" + finalDraft },
  ],
});
const review = ReviewSchema.parse(reviewRes.json);
console.log(\`  점수: \${review.score}/10, 승인: \${review.approved}\`);

if (!review.approved) {
  console.log("  피드백:", review.feedback);
  console.log("\\n✍️ 재집필...");
  const reviseRes = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "한국어 블로그 작가. 검토 피드백을 반영해 글을 수정해." },
      { role: "user", content: \`원본:\\n\${finalDraft}\\n\\n피드백:\\n\${review.feedback}\\n\\n수정해서 전체를 다시 써줘.\` },
    ],
  });
  finalDraft = reviseRes.text;
  console.log("  수정본 길이:", finalDraft.length, "자");
}

console.log("\\n📄 최종 글:");
console.log(finalDraft);`,
      hints: [
        "검토자의 score 기준 (7점) 을 바꿔보면 '승인/반려' 비율이 달라져요.",
        "피드백 루프를 while 로 만들면 여러 번 재집필 가능 — 실제 사용 시 반드시 max 반복 제한.",
        "3 에이전트 모두 같은 provider(gemini) 사용. 실무에선 조사=Groq(빠름), 집필=Gemini(품질) 식 혼합 가능.",
      ],
    },

    {
      type: "markdown",
      source: `## ⚠️ 멀티 에이전트 위험

| 위험 | 원인 | 대응 |
|---|---|---|
| **연쇄 환각** | 조사자가 틀린 정보 → 집필자가 확신 | 조사자에 출처 요구 + 검토자가 사실 확인 |
| **비용 폭증** | 3 에이전트 × 반복 = chat 6~10회 | 반복 1회 제한 + 작은 모델(flash) 활용 |
| **교착** | 검토자가 항상 "수정 필요" → 무한 루프 | max 반복 + "2회 수정 후 강제 승인" 규칙 |
| **전달 오류** | 에이전트 간 JSON 스키마 불일치 | zod 계약 + 각 단계에서 parse 검증 |

### 실무 팁
- **작은 모델 먼저** — 비용 체크. 큰 모델은 최종 품질 검증에만
- **각 에이전트를 독립 테스트** — 전체 파이프라인 전에 단위 검증
- **로그 필수** — 어디서 품질이 떨어지는지 추적 (onStep 활용)

## Ch07 정리

- ✅ 멀티 에이전트의 이유 — 전문성 분리, 컨텍스트 관리, 재사용성
- ✅ 2-에이전트 체인 (조사 → 집필)
- ✅ 메시지 전달 프로토콜 (zod JSON 계약)
- ✅ 3-에이전트 파이프라인 + Critic Loop (조사 → 집필 → 검토 → 재집필)
- ✅ 위험 관리 (환각·비용·교착·전달 오류)

### 🚀 Phase 3 완주!
Ch06 단일 에이전트 + Ch07 멀티 에이전트 — **Agent 패턴의 기초** 를 마스터했어요.

**Phase 4 예고**: Ch08~10 에서는 **RAG** (Retrieval-Augmented Generation) 를 다룹니다.
에이전트가 "자기가 모르는 것" 을 **문서에서 찾아 읽고** 답하게 하는 기술이에요. 🔍📄`,
    },

    {
      type: "markdown",
      source: `## 🎯 미션: 자유 주제 블로그 글 자동 생성

### 요구사항
- **3-에이전트 파이프라인** 구현 (조사 → 집필 → 검토)
- 주제는 **자유** (AI, 여행, 요리, 스포츠... 아무거나)
- 검토자가 반려 시 **최대 1회** 재집필
- 최종 글을 console 에 출력

### 보너스
- 조사자에 tool 붙이기 (예: 가상 검색 tool)
- 검토 점수 기준 커스텀 (5점? 8점?)
- 4번째 에이전트 "편집자" 추가 (맞춤법·어조 통일)`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// TODO: 자유 주제 3-에이전트 파이프라인 구현
// 1. 조사자 — responseSchema 로 포인트 추출
// 2. 집필자 — 포인트 기반 블로그 글 작성
// 3. 검토자 — approved/feedback/score 반환
// 4. 반려 시 1회 재집필
// 5. 최종 글 출력

throw new Error("미구현 — 위 3-에이전트 셀을 참고해 자유 주제로 만들어보세요!");`,
      hints: [
        "위 3-에이전트 셀의 코드를 그대로 가져와 topic 만 바꿔도 동작해요.",
        "차별화: tool 추가 (가상 검색), 4번째 에이전트 (편집자), score 기준 커스텀.",
        "비용이 걱정되면 maxTokens 를 300~500 으로 제한해 각 에이전트가 짧게 답하게.",
      ],
      solution: `// 예시: 여행 블로그
const topic = "2026년 한국인이 가장 가고 싶은 유럽 도시 TOP 3";

const PointsSchema = z.object({
  points: z.array(z.object({ title: z.string(), detail: z.string() })),
});

// 조사
const researchRes = await chat({
  provider: "gemini",
  responseSchema: toJsonSchema(PointsSchema),
  messages: [
    { role: "system", content: "여행 리서처. 핵심 포인트 3개를 JSON 으로." },
    { role: "user", content: topic },
  ],
});
const pts = PointsSchema.parse(researchRes.json);
console.log("🔍 조사:", pts.points.map(p => p.title));

// 집필
const draftRes = await chat({
  provider: "gemini",
  stream: true,
  messages: [
    { role: "system", content: "여행 블로거. 한국어 500자. 설렘을 담아." },
    { role: "user", content: pts.points.map((p,i) => \`\${i+1}. \${p.title}: \${p.detail}\`).join("\\n") },
  ],
});
let final = draftRes.text;

// 검토
const ReviewS = z.object({ approved: z.boolean(), feedback: z.string(), score: z.number() });
const revRes = await chat({
  provider: "gemini",
  responseSchema: toJsonSchema(ReviewS),
  messages: [
    { role: "system", content: "글 품질 검토자. score 1~10, 7+ 이면 approved." },
    { role: "user", content: final },
  ],
});
const rev = ReviewS.parse(revRes.json);
console.log(\`\\n🔎 점수: \${rev.score}, 승인: \${rev.approved}\`);

if (!rev.approved) {
  const fix = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "수정 작가. 피드백 반영해 전체 재작성." },
      { role: "user", content: \`원본:\\n\${final}\\n피드백:\\n\${rev.feedback}\` },
    ],
  });
  final = fix.text;
}

console.log("\\n📄 최종:\\n" + final);`,
    },
  ],

  quiz: {
    title: "Ch07 — 멀티 에이전트 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "단일 에이전트 대신 멀티 에이전트를 쓰는 주된 이유가 아닌 것은?",
        options: [
          "전문성 분리 — 각 에이전트가 하나의 역할에 집중",
          "컨텍스트 폭발 방지 — 대화를 짧게 유지",
          "반드시 비용이 줄어든다",
          "재사용성 — 같은 에이전트를 다른 파이프라인에서 활용",
        ],
        correctIndex: 2,
        explanation:
          "멀티 에이전트는 오히려 비용이 올라갈 수 있어요 (chat 여러 번). 비용 절감이 아니라 품질·모니터링·재사용성이 주 이유.",
      },
      {
        type: "multiple-choice",
        question: "에이전트 간 데이터 전달에 zod 스키마를 쓰는 이유는?",
        options: [
          "LLM 이 zod 만 이해해서",
          "에이전트 간 계약을 명확히 하고, 불일치 시 parse 에서 즉시 감지 가능",
          "토큰 비용을 줄이기 위해",
          "zod 가 암호화를 지원해서",
        ],
        correctIndex: 1,
        explanation:
          "한 에이전트의 output 이 다음 에이전트의 input 과 맞지 않으면 파이프라인이 깨져요. zod 계약으로 각 단계에서 검증하면 디버깅·교체·재사용이 쉬워집니다.",
      },
      {
        type: "multiple-choice",
        question: "Critic Loop (검토 루프) 의 교착 위험을 방지하는 방법은?",
        options: [
          "검토자를 삭제한다",
          "max 반복 제한 (예: '2회 수정 후 강제 승인') + 점수 기준 완화",
          "temperature 를 0 으로 고정",
          "WebLLM 을 사용",
        ],
        correctIndex: 1,
        explanation:
          "검토자가 '영원히 수정 필요' 라고 하면 무한 루프. 반복 상한 + '기준 미달이어도 N회 후 강제 종료' 규칙이 필수.",
      },
      {
        type: "multiple-choice",
        question: "3-에이전트 파이프라인에서 '연쇄 환각' 이란?",
        options: [
          "GPU 과열",
          "조사자가 잘못된 사실 → 집필자가 확신 있게 틀린 내용 작성 → 검토자도 놓침",
          "네트워크 지연",
          "모델이 한국어를 못 함",
        ],
        correctIndex: 1,
        explanation:
          "초기 에이전트의 오류가 파이프라인을 타고 증폭되는 현상. 조사자에 출처 요구 + 검토자에 사실 확인 지시 + 사람 최종 승인이 방어책.",
      },
      {
        type: "multiple-choice",
        question: "이 레슨의 멀티 에이전트 오케스트레이션은 어떻게 구현되나요?",
        options: [
          "특별한 Agent SDK 프레임워크 사용",
          "학생의 JavaScript/TypeScript 코드에서 chat/chatWithTools 를 순차 호출 + 변수로 결과 전달",
          "서버 사이드 워크플로우 엔진",
          "WebLLM 내부 에이전트 모드",
        ],
        correctIndex: 1,
        explanation:
          "프레임워크 없이 기존 chat / chatWithTools 를 조합. 오케스트레이션은 '학생 코드 = 지휘자'. Phase 2 에서 배운 도구만으로 에이전트 시스템이 완성됩니다.",
      },
    ],
  } satisfies Quiz,
};
