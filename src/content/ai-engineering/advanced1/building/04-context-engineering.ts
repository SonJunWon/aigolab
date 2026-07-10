import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급1 시리즈C(하네스 만들기) 04강 — 좁은 책상의 공학.
 * 토큰 예산 회계, 자동 컴팩션 구현, 프롬프트 캐시 경계 설계.
 */
export const lessonC04: Lesson = {
  id: "ai-eng-a1-c04-context-engineering",
  language: "ai-engineering",
  track: "advanced1",
  order: 24,
  title: "C4. 좁은 책상의 공학 — 컨텍스트 예산·컴팩션·캐싱",
  subtitle: "messages 는 매 턴 통째로 전송된다 — 회계 없는 루프는 파산한다",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🗜️ 고급1·C4강. 좁은 책상의 공학
### — 컨텍스트 예산 · 컴팩션 · 캐싱

⏱️ 50분 · 🧰 API 키 · 🗺️ 구현 대상: **③ 컨텍스트** · 선수: C1

> 💡 C1 연구 노트 2번의 답부터: **messages 배열은 매 턴 통째로 다시 전송됩니다.** 10턴짜리 에이전트의 마지막 턴은 앞 9턴 전체를 입력으로 지불해요. 회계 없는 루프는 느려지고, 비싸지고, A4의 법칙대로 — 흐려집니다.
> 오늘은 하네스에서 가장 공학적인 부분: **재고, 줄이고, 재활용하는** 세 기술입니다.

### 이 강에서
- **토큰 회계**: 책상 사용량을 매 턴 측정하는 계기판
- **자동 ==컴팩션==**: 예산 초과 시 오래된 턴을 요약으로 바꿔치기 — B4 '요약 이어달리기'의 자동화
- **캐시 경계**: 프롬프트 캐시가 재사용할 수 있게 '안 변하는 앞부분' 설계 (C3 층 순서의 회수)`,
    },
    {
      type: "markdown",
      source: `## 📊 1단계 — 계기판: 재지 않으면 다스릴 수 없다

정밀한 토크나이저가 없어도 시작할 수 있어요. 실용 근사치: **한국어·코드 혼합 기준 1토큰 ≈ 2~4자.** 계기판의 목적은 정확한 요금 계산이 아니라 **추세와 임계점 감지**입니다.

\`\`\`ts
const estTokens = (s: string) => Math.ceil(s.length / 3);        // 근사 계기판
const contextSize = (msgs: {content: string}[]) =>
  msgs.reduce((sum, m) => sum + estTokens(m.content ?? ""), 0);
\`\`\`

그리고 진짜 수치는 응답이 알려줍니다 — \`res.tokensUsed.input\` 을 매 턴 로그로. 근사치와 실측치를 함께 두면 계기판이 스스로 보정돼요.

> ⚠️ 잊기 쉬운 비용: 시스템 프롬프트(C3)와 **도구 정의 전체**(C2)도 매 턴 전송됩니다. 도구 20개 = 매 턴 그 설명서 20장 값을 냅니다. A3 '과연결'의 요금 고지서예요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 자동 컴팩션이 달린 루프: 예산을 넘으면 오래된 턴을 요약으로 교체 ──
const estTokens = (s: string) => Math.ceil((s ?? "").length / 3);
const contextSize = (msgs: any[]) => msgs.reduce((n, m) => n + estTokens(m.content), 0);

const BUDGET = 700;        // 실습용으로 일부러 작게 (실전은 수만 토큰)
const KEEP_RECENT = 4;     // 최근 N개 메시지는 원본 유지 (지금 하는 일이니까)

async function compactIfNeeded(messages: any[]): Promise<any[]> {
  if (contextSize(messages) <= BUDGET) return messages;

  const [system, ...rest] = messages;                       // 시스템은 절대 요약하지 않는다
  const old = rest.slice(0, -KEEP_RECENT);
  const recent = rest.slice(-KEEP_RECENT);
  if (!old.length) return messages;

  // 요약도 LLM에게 — 단, '무엇을 남길지'를 명시한 요약 지침이 품질을 가른다
  const sum = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "대화를 인수인계 문서로 요약하라. 반드시 포함: ①확정된 결정 ②기각된 안(부활 방지) ③미해결 이슈 ④숫자·이름 등 구체 값. 5줄 이내." },
      { role: "user", content: old.map((m: any) => \`[\${m.role}] \${m.content}\`).join("\\n") },
    ],
  });
  const compacted = [
    system,
    { role: "user", content: \`<summary>이전 대화 요약:\\n\${sum.text}</summary>\` },
    ...recent,
  ];
  console.log(\`🗜️ 컴팩션: \${contextSize(messages)} → \${contextSize(compacted)} tok (추정)\`);
  return compacted;
}

// ── 데모: 긴 회의 대화를 흘려 넣으며 계기판·컴팩션 동작 관찰 ──
let messages: any[] = [{ role: "system", content: "너는 회의 비서다. 결정사항을 정확히 추적하라." }];
const meeting = [
  "신제품 이름 후보는 루미, 노바, 온도 세 개야.",
  "노바는 상표 문제로 기각됐어. 잊지 마.",
  "출시일은 5월에서 6월 12일로 연기됐어.",
  "패키지 예산은 3천만 원으로 확정. 디자인 A안도 기각.",
  "다음 주 화요일에 시식회를 열기로 했어. 장소는 미정.",
  "루미로 최종 확정했어. 슬로건 논의는 다음 회의로.",
];
for (const line of meeting) {
  messages.push({ role: "user", content: line + " 알겠으면 한 줄로 복명복창해." });
  messages = await compactIfNeeded(messages);
  const res = await chat({ provider: "gemini", messages });
  messages.push({ role: "assistant", content: res.text ?? "" });
  console.log(\`[\${contextSize(messages)} tok] \${(res.text ?? "").slice(0, 60)}\`);
}

// 최종 시험: 요약 너머의 기억을 묻는다
messages.push({ role: "user", content: "지금까지 기각된 안을 전부 나열하고, 제품명·출시일을 말해봐." });
const final = await chat({ provider: "gemini", messages });
console.log("\\n📋 최종 점검:", final.text);
console.log("\\n👉 '노바 기각'과 'A안 기각'이 살아남았다면 — 요약 지침의 ②(기각된 안) 덕분이다.");
console.log("   요약 지침에서 ②를 지우고 다시 돌려보라. 기각안이 부활하는 A6 실패를 직접 목격하게 된다.");`,
      hints: [
        "KEEP_RECENT 가 너무 작으면 '지금 하던 일'까지 요약돼 방금 말한 걸 되묻는 에이전트가 됩니다 — 최근은 원본, 과거는 요약.",
        "시스템 메시지를 요약 대상에서 제외하는 이유: 헌법(C3)이 요약되는 순간 하네스의 정체성이 녹아내려요.",
        "실전에서는 res.tokensUsed.input 이 BUDGET 의 70~80%를 넘는 시점에 미리 컴팩션하는 게 안전합니다 (임계 직전 여유).",
      ],
    },
    {
      type: "markdown",
      source: `## ♻️ 3단계 — 캐시 경계: 안 변하는 것을 앞에

제공자들은 **프롬프트 캐시**를 지원합니다: 직전 요청과 **앞부분이 정확히 같으면** 그 구간의 연산을 재사용해 더 싸고 빠르게 처리해요. 하네스 설계자에게 이건 규칙 하나로 요약됩니다:

> **변하지 않는 것 → 앞에 고정. 자주 변하는 것 → 뒤에.**

\`\`\`
[캐시 히트 구간]  정적 코어 + 도구 정의 + 프로젝트 지침     ← 턴이 바뀌어도 동일
────────── 캐시 경계 ──────────
[매 턴 변동 구간] 동적 조각(날짜·잔여 턴) + 대화 이력       ← 여기부터 새로 계산
\`\`\`

C3에서 '층 순서 = 캐시 설계'라고 했던 이유예요. 흔한 캐시 파괴범 셋:
1. 시스템 프롬프트 **맨 앞**에 현재 시각 삽입 → 매 턴 첫 글자부터 불일치, 캐시 전멸
2. 도구 목록을 턴마다 재정렬 → 같은 도구인데 캐시 미스
3. 컴팩션을 너무 자주 → 이력 앞부분이 계속 바뀜 (그래서 컴팩션은 임계점에서 **한 번에 크게**)`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 컴팩션의 대가 측정: 정보 손실률 실험 (연구 노트 겸 실습) ──
// 원본 대화에 '사실' 10개를 심고, 컴팩션 후 몇 개가 살아남는지 센다.
const facts = [
  "예산은 3200만 원", "담당자는 김서연", "마감은 8월 3일", "회의실은 7층 B",
  "로고 색은 #2E7D32", "타깃은 2030 직장인", "B안은 기각", "유통은 온라인 전용",
  "시제품 수량 150개", "다음 회의는 금요일 10시",
];
const dialogue = facts.map((f, i) => ({ role: "user", content: \`메모 \${i + 1}: \${f}\` }));

const sum = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "대화를 인수인계 문서로 요약하라. 반드시 포함: 확정 결정·기각안·구체 숫자/이름. 5줄 이내." },
    { role: "user", content: dialogue.map((m) => m.content).join("\\n") },
  ],
});

const survived = facts.filter((f) => {
  const key = f.split(" ").pop()!;             // 각 사실의 핵심 토막(값)으로 생존 판정
  return (sum.text ?? "").includes(key);
});
console.log("요약본:\\n" + sum.text);
console.log(\`\\n📉 생존한 사실: \${survived.length}/10\`);
console.log("소실:", facts.filter((f) => !survived.includes(f)));
console.log("\\n👉 이 숫자가 '컴팩션의 정보 손실률' — 요약 지침을 바꿔가며(5줄→8줄, 포함 항목 추가) 손실률이 어떻게 변하는지 측정해보라.");
console.log("   압축률과 손실률은 트레이드오프다. 하네스 설계란 이 트레이드오프에 숫자를 붙이는 일.");`,
      hints: [
        "생존 판정을 문자열 포함으로 하는 건 근사치 — 더 엄밀하게는 요약본만 주고 10개 사실을 퀴즈로 물어보는 방법이 있어요 (LLM 채점, C9 예고).",
        "요약을 '표 형식으로'라고 지시하면 손실률이 어떻게 변하는지도 흥미로운 실험입니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C4

1. **컴팩션 트리거 튜닝**: 예산의 50%/80%/95%에서 트리거할 때 각각의 문제(잦은 요약으로 캐시 파괴 vs 임계 초과 위험)를 정리하고 자기 기준을 세워라.
2. **2단 압축**: 요약의 요약이 필요해지는 초장기 세션을 위해, \`<summary>\` 조각이 3개 쌓이면 그것들을 다시 하나로 합치는 2차 컴팩터를 설계하라. 손실률은 어떻게 복리로 쌓이나?
3. **도구 정의 다이어트**: 도구 8개 중 이번 턴에 필요할 법한 3개만 전송하는 '동적 도구 로딩'을 구현하면 무엇이 좋아지고(비용) 무엇이 위험해지나(모델이 도구 존재를 모름)?

> 🎯 **(전부 잊어도 이것만)**
> ## messages 는 매 턴 통째로 전송된다 — 그래서 하네스는 **재고(토큰 회계), 줄이고(컴팩션), 재활용한다(캐시 경계).**
> 컴팩션 요약 지침에는 반드시 '기각된 안'을 포함시켜라(부활 방지). 그리고 안 변하는 것을 앞에 — 층 순서가 곧 요금표다.

📎 **다음 강 — C5. 수첩 달기**: 컴팩션은 세션 안의 생존술이고, 세션이 끝나면 책상은 치워집니다. 세션을 넘어 살아남는 기억 — 파일 기반 메모리를 구현합니다.`,
    },
  ],

  quiz: {
    title: "고급1·C4강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "턴이 갈수록 에이전트가 느려지고 비싸지는 근본 이유는?",
        options: [
          "모델이 피로해지기 때문",
          "messages 배열(이력+시스템+도구 정의)이 매 턴 통째로 다시 전송되기 때문",
          "제공자가 오래 쓰면 요금을 올리기 때문",
        ],
        correctIndex: 1,
        explanation:
          "마지막 턴은 앞의 모든 턴을 입력으로 지불해요. 도구 정의와 시스템 프롬프트도 매 턴 값을 냅니다 — 그래서 회계·컴팩션·캐시가 필요해요.",
      },
      {
        type: "multiple-choice",
        question: "컴팩션 구현에서 지켜야 할 것이 아닌 것은?",
        options: [
          "시스템 프롬프트는 요약 대상에서 제외한다",
          "최근 N개 메시지는 원본으로 유지한다",
          "요약 지침에서 '기각된 안'은 빼도 된다 — 어차피 버린 것이니까",
        ],
        correctIndex: 2,
        explanation:
          "기각 기록이 요약에서 빠지면 다음 턴에 기각안이 새 아이디어처럼 부활합니다(A6 실패학). 요약 지침의 필수 항목이에요.",
      },
      {
        type: "multiple-choice",
        question: "프롬프트 캐시를 살리는 설계는?",
        options: [
          "시스템 프롬프트 맨 앞에 현재 시각을 넣는다",
          "변하지 않는 것(코어·도구 정의·프로젝트 지침)을 앞에 고정하고, 변하는 것을 뒤에 둔다",
          "도구 목록을 매 턴 무작위로 섞는다",
        ],
        correctIndex: 1,
        explanation:
          "캐시는 '앞부분이 정확히 같을 때' 재사용됩니다. 맨 앞의 시각 한 줄이 캐시 전체를 파괴해요 — 동적 조각은 뒤로.",
      },
    ],
  } satisfies Quiz,
};
