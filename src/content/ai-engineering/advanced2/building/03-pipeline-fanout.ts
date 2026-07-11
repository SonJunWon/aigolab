import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 03강 — 지휘 패턴 구현 ①.
 * 결정적 오케스트레이션: 파이프라인 체인 + 팬아웃/팬인(동시성 캡·부분 실패).
 */
export const lessonC03: Lesson = {
  id: "ai-eng-a2-c03-pipeline-fanout",
  language: "ai-engineering",
  track: "advanced2",
  order: 23,
  title: "C3. 지휘 패턴 구현 ① — 파이프라인과 팬아웃",
  subtitle: "코드가 흐름을 쥔다 — 동시성 캡과 부분 실패라는 실전 근육",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🏇 고급2·C3강. 지휘 패턴 구현 ①
### — 파이프라인과 팬아웃

⏱️ 50분 · 🧰 API 키 · 🗺️ 구현 대상: ③ 지휘 (결정적) · 선수: C1·C2

> 💡 A3의 지휘 패턴 동물원을 이제 코드로 짓습니다. 오늘은 **결정적(deterministic)** 진영 —
> 흐름을 **코드가** 쥐는 파이프라인과 팬아웃이에요.
> 뼈대는 놀랄 만큼 단순합니다: 파이프라인 = **함수 체인**, 팬아웃 = **Promise.all.**
> 실력 차이는 뼈대가 아니라 두 실전 근육에서 납니다 — **동시성 캡**과 **부분 실패 처리.**

### 이 강에서
- 파이프라인: runRole 체인 + 인수인계 계약 (B3의 코드 버전)
- 팬아웃/팬인: 병렬 스폰 → 취합 (B4의 코드 버전)
- 동시성 캡(한꺼번에 몇 명까지)·부분 실패(한 명이 죽어도 팀은 산다)`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 스타터 + C2 레지스트리 (압축) ──
type Tool = { name: string; description: string; parameters: any; execute: (args: any) => Promise<any> };
async function runAgent(system: string, mission: string, tools: Tool[], maxTurns = 5): Promise<string> {
  const messages: any[] = [{ role: "system", content: system }, { role: "user", content: mission }];
  for (let t = 0; t < maxTurns; t++) {
    const res = await chat({ provider: "gemini", messages, tools });
    if (!res.toolCalls?.length) return res.text ?? "";
    messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      const tool = tools.find((x) => x.name === call.name)!;
      messages.push({ role: "tool", content: JSON.stringify(await tool.execute(call.args as any)), toolCallId: call.id });
    }
  }
  return "(최대 턴 도달)";
}
const summarizer = (topic: string) =>
  runAgent("너는 요약 전담원이다. 형식: 핵심 1줄 / 근거 1줄. 그 외 금지.", \`다음 주제의 핵심 동향을 요약하라: \${topic}\`, []);

// ══ 패턴 1. 파이프라인 — 함수 체인 + 인수인계 계약 ══
async function pipeline(topic: string): Promise<string> {
  // 각 단계의 반환값이 다음 단계의 입력 — B3 인수인계 계약이 '함수 시그니처'가 된다
  const facts = await runAgent("사실 수집가. | 사실 | 근거 | 표만 출력.", \`\${topic} 관련 사실 3개\`, []);
  const draft = await runAgent("작가. 주어진 표만 근거로 3줄 작성. 사실 추가 금지.", \`사실 표:\\n\${facts}\`, []);
  const final = await runAgent("교정자. 주장 변경 금지, 문장만 다듬기.", \`초안:\\n\${draft}\`, []);
  return final;
}

// ══ 패턴 2. 팬아웃/팬인 — 실전 근육 2종 장착 ══
// 근육 ①: 동시성 캡 — 100개 팬아웃해도 동시에 N명만 (요금·rate limit 보호)
async function withConcurrency<T>(jobs: (() => Promise<T>)[], cap: number): Promise<T[]> {
  const results: T[] = new Array(jobs.length);
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const i = next++;
      results[i] = await jobs[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(cap, jobs.length) }, worker));
  return results;
}

// 근육 ②: 부분 실패 — 한 명이 죽어도 null로 표시하고 팀은 전진
async function safeRun(job: () => Promise<string>): Promise<string | null> {
  try { return await job(); } catch { return null; }
}

const topics = ["전기차 배터리", "생성형 AI 규제", "리테일 미디어", "우주 발사체", "대체 단백질"];
console.time("팬아웃(캡 2)");
const reports = await withConcurrency(
  topics.map((t) => () => safeRun(() => summarizer(t))),
  2, // 다섯 명을 동시에 풀지 않고 2명씩 — 캡을 5로 바꿔 시간을 비교해보라
);
console.timeEnd("팬아웃(캡 2)");

const ok = reports.filter((r): r is string => r !== null);
console.log(\`\\n생존 보고: \${ok.length}/\${topics.length} (실패 \${reports.length - ok.length}건은 null 처리)\`);

// 팬인(취합) — B4 취합자의 코드 버전
const merged = await runAgent(
  "취합자. 보고들을 중복 정리하고, 상충은 지우지 말고 표시하고, 빠진 주제를 명시하라.",
  \`보고 \${ok.length}건:\\n\${ok.map((r, i) => \`[\${i + 1}] \${r}\`).join("\\n")}\\n원래 주제 목록: \${topics.join(", ")}\`,
  [],
);
console.log("\\n🏁 취합 보고:\\n", merged);`,
      hints: [
        "withConcurrency가 이 강의 진짜 선물이에요 — 실전에서 팬아웃 20갈래를 캡 없이 풀면 rate limit과 요금이 동시에 터집니다. 캡 2와 5로 시간·안정성을 직접 비교해보세요.",
        "safeRun이 null을 반환하는 설계: 한 갈래의 실패가 Promise.all 전체를 죽이면 안 됩니다(부분 실패 격리). 대신 취합자에게 '빠진 주제 명시'를 시켜 실패가 침묵하지 않게(B6) 했어요.",
        "파이프라인의 각 단계 반환값이 곧 인수인계 계약 — 실전에서는 이걸 C5에서 배울 JSON 스키마로 굳힙니다. 지금은 문자열 계약.",
      ],
    },
    {
      type: "markdown",
      source: `## ⚖️ 배리어(barrier)는 정말 필요한가

팬아웃 후 **모두 끝나기를 기다렸다가** 다음 단계로 가는 것 — 이걸 배리어라고 합니다.
위 코드의 취합이 배리어예요 (보고 전체가 있어야 중복·상충 정리가 되니 정당).

그런데 배리어가 **불필요한데 습관적으로** 들어가는 경우가 흔합니다:

| 상황 | 배리어 필요? |
|------|-------------|
| 취합·중복 제거·전체 비교 | ✅ 전체 결과가 필요 — 정당 |
| 각 보고를 **독립적으로** 후처리(번역·검증) | ❌ 끝난 것부터 바로 다음 단계로 (스트리밍 파이프라인) |
| '0건이면 전체 중단' 판단 | ✅ 개수를 세야 하므로 정당 |

배리어의 비용: **가장 느린 갈래가 전체를 기다리게 합니다.** 5갈래 중 4개가 10초, 1개가 60초면
배리어 뒤 단계는 60초를 기다려요. 독립 후처리라면 갈래별로 \`파이프라인을 이어 붙이는\` 편이
벽시계 시간을 크게 줄입니다 — 실전 아크(C8)에서 이 최적화를 실제로 씁니다.

## 🧭 결정적 지휘의 사용 설명서

C1의 표를 실무 언어로 다시:
- 흐름이 **미리 그려지는** 일 (브리핑·리뷰·정기 보고) → **오늘의 패턴** (예측 가능, 디버깅 쉬움, 비용 일정)
- 흐름이 **해봐야 아는** 일 (원인 불명 장애 조사) → 다음 강의 슈퍼바이저
실전 시스템의 8할은 결정적 지휘로 충분합니다. 동적 지휘는 필요한 곳에만 — 비싸고 예측이 어려우니까요.`,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C3

1. **캡 튜닝**: 캡을 1(직렬)·2·5(전부)로 바꾸며 총 시간을 재라. 캡 증가의 이득이 줄어드는 지점(수확 체감)이 보이는가? rate limit에 걸리면 어디부터 무너지는가.
2. **스트리밍 파이프라인**: 취합 전에 각 보고를 독립 검증하는 단계를 추가하되, 배리어 없이 '끝난 갈래부터 검증'하도록 재구성하라. 벽시계 시간이 얼마나 주는가?
3. **실패 주입**: summarizer가 30% 확률로 throw하게 만들고 5갈래를 돌려라. 취합 보고의 '빠진 주제' 칸이 정확한가? 부분 실패 격리가 없다면 무슨 일이 벌어졌겠는가.

> 🎯 **(전부 잊어도 이것만)**
> ## 결정적 지휘의 뼈대는 단순하다 — 파이프라인 = **함수 체인**, 팬아웃 = **Promise 병렬.** 실력은 근육에서 갈린다: **동시성 캡**(요금·한도 보호)과 **부분 실패 격리**(한 명이 죽어도 팀은 전진 + 실패는 취합에 명시).
> 그리고 배리어는 전체 결과가 필요할 때만 — 습관적 배리어는 가장 느린 갈래에게 전체를 저당 잡히는 것.

📎 **다음 강 — C4. 슈퍼바이저 루프**: 이제 동적 진영입니다. 오케스트레이터가 delegate 도구로 계획→위임→재계획을 도는 구조 — 그리고 반드시 함께 다는 폭주 가드 3종(깊이·인원·예산)을 구현합니다.`,
    },
  ],

  quiz: {
    title: "고급2·C3강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "팬아웃에 동시성 캡을 다는 이유는?",
        options: [
          "코드를 더 길게 만들어 있어 보이게 하려고",
          "갈래를 한꺼번에 풀면 API rate limit과 비용이 동시에 터질 수 있어서",
          "Promise.all이 3개 이상을 지원하지 않아서",
        ],
        correctIndex: 1,
        explanation:
          "100갈래 팬아웃도 동시에는 N명만 돌게 하는 게 실전 근육이에요. 캡 튜닝으로 속도와 안정성의 균형점을 찾습니다.",
      },
      {
        type: "multiple-choice",
        question: "한 갈래가 실패했을 때의 올바른 처리는?",
        options: [
          "전체 팬아웃을 즉시 중단하고 처음부터 다시",
          "실패를 null로 격리해 팀은 전진시키되, 취합 보고에 '빠진 주제'로 명시한다",
          "실패한 갈래를 조용히 빼고 성공한 것만으로 완성된 척한다",
        ],
        correctIndex: 1,
        explanation:
          "부분 실패 격리 + 침묵 금지(B6)의 결합이에요. 한 명의 실패가 전체를 죽여도 안 되고, 실패가 안 보이게 사라져도 안 됩니다.",
      },
      {
        type: "multiple-choice",
        question: "배리어(전원 대기)가 정당한 경우는?",
        options: [
          "각 보고를 독립적으로 번역할 때",
          "취합·중복 제거처럼 전체 결과를 한 번에 봐야 할 때",
          "언제나 — 기다림은 미덕이므로",
        ],
        correctIndex: 1,
        explanation:
          "배리어는 가장 느린 갈래에게 전체를 저당 잡히는 비용이 있어요. 독립 후처리는 끝난 갈래부터 이어가는 스트리밍 파이프라인이 빠릅니다.",
      },
    ],
  } satisfies Quiz,
};
