import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 28강 — 데이터 정제·필터링 ① 중복·길이·룰 (모듈 5)
 * 기본 필터 + 전후 통계. 코드 검증: 로컬 venv(pandas 3.0) 통과(6→3, 단계별 -1).
 */
export const kd28: Course = {
  id: "kd-28-cleaning-basic",
  title: "데이터 정제 ① — 중복·길이·룰 필터",
  subtitle: "썩은 재료를 골라내는 기본 라인",
  icon: "🧹",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 228,
  sections: [
    {
      type: "text",
      content: `# 🧹 정제 라인 ① — 기본 필터 3종

게이트를 통과한 데이터도 한 번 더 **정제 라인**을 거쳐요. 가장 기본이 되는 세 필터부터.

> 🃏 **기본 필터 3종 (순서대로)**
> - **① 중복 제거(dedup)**: 완전히 같은(또는 거의 같은) 예시 제거 → **다양성** 확보·과대표집 방지.
> - **② 길이 필터(length)**: 너무 짧음(무성의) / 너무 김(노이즈·잘림) 제거.
> - **③ 룰 필터(rule)**: 금칙어·깨진 인코딩·형식 오류 등 **규칙 기반** 제거.

> 🃏 **왜 순서가 중요?** 보통 **싸고 확실한 필터부터**(dedup → length → rule). 앞에서 많이 걸러내면 뒤 단계가 처리할 양이 줄어요.

> 🃏 **전/후 통계를 꼭 남겨라**: 각 단계가 **몇 개를 왜 제거했는지** 기록해야, 나중에 "데이터가 왜 이렇게 줄었지?"를 추적하고 필터가 너무 빡센지 점검할 수 있어요.

> 🪄 **비유**: 식재료 손질 라인 — **똑같은 것 추려내고(dedup) → 상태 안 좋은 크기 거르고(length) → 상한 것 골라내기(rule)**. 단계마다 버린 양을 기록.`,
    },
    {
      type: "code",
      title: "🧪 dedup → length → rule, 전후 통계",
      content: `pandas로 6개 예시에 세 필터를 차례로 적용하고 **각 단계가 몇 개를 제거했는지** 통계를 봐요. \`▶ 실행\` (pandas 첫 로드 잠깐 걸려요)`,
      code: `import pandas as pd

df = pd.DataFrame({
    "instruction": ["합 구하기", "합 구하기", "평균 구하기", "정렬하기", "빈 응답", "불량"],
    "output": [
        "def s(x): return sum(x)",
        "def s(x): return sum(x)",                       # 중복
        "def m(x): return sum(x)/len(x)",
        "def so(x): return sorted(x)",
        "",                                              # 너무 짧음
        "그건 멍청한 질문이라서 대답하지 않겠습니다",        # 금칙어
    ],
})

n0 = len(df); steps = [("시작", n0)]
df = df.drop_duplicates(subset=["instruction", "output"]); steps.append(("① dedup", len(df)))
df = df[df["output"].str.len() >= 10];                   steps.append(("② length≥10", len(df)))
BAN = ["멍청", "바보", "욕설"]
df = df[~df["output"].str.contains("|".join(BAN))];      steps.append(("③ rule(금칙어)", len(df)))

print(f"{'단계':>14}{'남은수':>7}{'제거':>7}")
prev = n0
for name, cnt in steps:
    removed = "" if name == "시작" else f"-{prev - cnt}"
    print(f"{name:>14}{cnt:>7}{removed:>7}")
    prev = cnt
print(f"\\n최종 {len(df)}개 (시작 {n0}개에서 {n0 - len(df)}개 제거):")
for _, r in df.iterrows():
    print("  ✅", r["instruction"], "→", r["output"])`,
      codeLanguage: "python",
      codeHint: "필터 순서를 바꿔보세요(rule을 먼저). 최종 결과는 같아도 각 단계가 거르는 수가 달라져요. 길이 기준(10)이나 금칙어 목록도 바꿔 영향을 확인!",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - 기본 필터 3종: **dedup(다양성) → length(무성의/노이즈) → rule(금칙어·형식)**.
> - **싸고 확실한 필터부터** 적용해 뒷단 부담↓.
> - **단계별 전/후 통계 기록**이 필수 — 필터가 과한지·왜 줄었는지 추적.

여기까진 '형식·중복' 위주였어요. 다음 강은 더 까다로운 **내용 차원** — **독성·편향·다양성·도메인 균형** 필터로 들어갑니다. ⚖️`,
    },
  ],
  quiz: {
    title: "28강 — 데이터 정제 ① 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "중복 제거(dedup)가 중요한 이유는?",
        options: [
          "파일 용량만 줄이려고",
          "같은 예시 과대표집을 막고 다양성을 확보하려고",
          "중복은 성능을 항상 높여서",
        ],
        correctIndex: 1,
        explanation:
          "같은 예시가 여러 번 들어가면 그 패턴이 과대표집돼 편향되고 다양성이 떨어져요. dedup으로 균형 잡힌 데이터를 만듭니다.",
      },
      {
        type: "multiple-choice",
        question: "기본 필터를 적용하는 일반적 순서는?",
        options: [
          "비싼 필터부터 무작위로",
          "싸고 확실한 필터부터(dedup → length → rule)",
          "순서는 전혀 상관없다",
        ],
        correctIndex: 1,
        explanation:
          "보통 싸고 확실한 필터(dedup·length)를 먼저 적용해 데이터를 줄인 뒤, 더 복잡한 규칙 필터를 적용하면 뒷단 부담이 줄어요.",
      },
      {
        type: "multiple-choice",
        question: "정제 단계마다 전/후 통계를 기록하는 이유는?",
        options: [
          "보기 좋으라고",
          "무엇이 왜 얼마나 제거됐는지 추적하고 필터가 과한지 점검하려고",
          "통계는 필요 없다",
        ],
        correctIndex: 1,
        explanation:
          "각 단계가 몇 개를 왜 제거했는지 남겨야 데이터가 줄어든 원인을 추적하고, 필터가 지나치게 빡센지 점검할 수 있어요.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-29-cleaning-safety",
};
