import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 24강 — LoRA 어댑터 활용: 병합·교체·멀티 도메인 (모듈 4 마무리)
 * merge/swap, 베이스 1개+어댑터 여러 개 서빙. 코드 검증: 로컬 numpy 통과(병합 수식·서빙 절감).
 */
export const kd24: Course = {
  id: "kd-24-adapter-merge",
  title: "어댑터 활용 — 병합·교체·멀티 도메인",
  subtitle: "베이스 1개에 포스트잇 묶음을 갈아끼우기",
  icon: "🔌",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 224,
  sections: [
    {
      type: "text",
      content: `# 🔌 다 만든 어댑터, 어떻게 쓸까

LoRA로 도메인별 어댑터를 여러 개 만들었다고 해봐요(수학용·법률용·고객지원용…). 이걸 운영에서 어떻게 다루느냐가 모듈 4의 마무리예요.

> 🃏 **① 병합(Merge)**
> 학습이 끝난 어댑터를 베이스에 **합쳐 하나의 가중치로** 만들어요: \`W_merged = W + (α/r)·B·A\`.
> → 추론 시 **어댑터 계산이 사라져** 원래 모델과 **속도가 같아짐**. 단, 한 번 합치면 그 도메인 전용.

> 🃏 **② 교체(Swap)**
> 베이스는 **그대로 메모리에 두고**, 작은 어댑터만 **갈아끼워요**. 같은 베이스 위에서 수학 어댑터 ↔ 법률 어댑터를 즉시 전환. 어댑터는 수~수십 MB로 작아서 빠르게 바꿔낄 수 있어요.

> 🃏 **③ 멀티 도메인 서빙**
> **베이스 1개 + 어댑터 N개** 구조. 도메인마다 풀 모델을 N개 띄우는 대신, 무거운 베이스는 1개만 공유하고 가벼운 어댑터만 N개 → **메모리 대폭 절감**.

> 🪄 **비유**: 같은 교과서(베이스)에 **과목별 포스트잇 묶음(어댑터)** 을 상황 따라 갈아끼우기. 교과서를 과목 수만큼 살 필요가 없죠.`,
    },
    {
      type: "code",
      title: "🧪 병합 수식 + 멀티 도메인 서빙 비용",
      content: `어댑터를 베이스에 병합(\`W+(α/r)BA\`)하고, 도메인 N개를 ① 풀 모델 N개 vs ② 베이스 1개+어댑터 N개로 서빙할 때 메모리를 비교해요. \`▶ 실행\``,
      code: `import numpy as np
rng = np.random.default_rng(4)
d, r = 64, 4
alpha = 8
W = rng.normal(0, 1, (d, d))                      # 공유 베이스 (1개)

def adapter():  return rng.normal(0, 0.1, (d, r)), rng.normal(0, 0.1, (r, d))
B_math, A_math = adapter()                         # 수학 도메인 어댑터
B_law,  A_law  = adapter()                         # 법률 도메인 어댑터

# ① 병합: 어댑터를 베이스에 합쳐 독립 가중치로
def merge(B, A): return W + (alpha / r) * (B @ A)
W_math, W_law = merge(B_math, A_math), merge(B_law, A_law)
print("병합:  W_도메인 = W + (α/r)·B·A")
print(f"  베이스와 차이  math {np.linalg.norm(W_math - W):.3f}   law {np.linalg.norm(W_law - W):.3f}")
print("  → 같은 베이스에서 어댑터만 바꿔 서로 다른 모델이 됨(교체=swap)\\n")

# ② 멀티 도메인 서빙 메모리 비교
base_p = d * d          # 베이스 파라미터
adp_p  = 2 * d * r      # 어댑터 1개(A+B)
print("[서빙 메모리] 도메인 N개")
for N in [1, 5, 20]:
    full   = N * base_p              # 도메인마다 풀 모델
    shared = base_p + N * adp_p      # 베이스 1개 + 어댑터 N개(교체)
    print(f"  N={N:>2}:  풀모델 {full:>9,}   vs   공유+어댑터 {shared:>8,}   ({full/shared:.1f}배)")
print("\\n👉 도메인이 많아질수록 '베이스 1개+어댑터 N개'가 압도적으로 가벼움 = 멀티 도메인 서빙")`,
      codeLanguage: "python",
      codeHint: "N(도메인 수)을 더 키워보세요. N=1이면 거의 비슷하지만, N이 커질수록 공유 구조의 절감 효과가 급격히 커져요. 어댑터가 작을수록(r↓) 더 유리.",
    },
    {
      type: "text",
      content: `> ⚠️ **어댑터 '합산' 주의**: 두 어댑터를 단순히 더해 한 번에 쓰면(\`W + Δ1 + Δ2\`) 서로 **간섭**해 둘 다 망가질 수 있어요. 도메인이 다르면 보통 **교체(swap)** 하거나, 합칠 땐 **가중 병합·전용 기법**을 씁니다.

> 🎯 **(모듈 4 마무리)**
> - **병합(merge)**: \`W+(α/r)BA\` 로 합쳐 추론을 베이스만큼 빠르게(전용화).
> - **교체(swap)**: 베이스 공유 + 어댑터만 갈아끼우기.
> - **멀티 도메인 서빙**: 베이스 1개 + 어댑터 N개 → 메모리 대폭 절감.
> - 단, 어댑터 단순 합산은 간섭 주의.

🎉 **모듈 4 완료!** LoRA 하이퍼파라미터 → LoRA+ → DoRA → AdaLoRA → 데이터 합성 → 어댑터 운용까지, **SFT를 '제대로' 하는 심화 기술**을 모두 봤어요.
다음 **모듈 5** 에서는 이 모든 기법의 **재료 — 고품질 데이터 구축**(LIMA·정제·필터링·파이프라인)으로 들어갑니다. 🍳`,
    },
  ],
  quiz: {
    title: "24강 — 어댑터 활용 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "어댑터 '병합(merge)'의 효과는?",
        options: [
          "추론이 느려진다",
          "W+(α/r)·B·A로 합쳐 어댑터 계산이 사라지고 추론 속도가 베이스와 같아진다",
          "베이스가 삭제된다",
        ],
        correctIndex: 1,
        explanation:
          "병합하면 어댑터가 베이스에 흡수돼 추론 시 별도 어댑터 연산이 없어요. 그래서 원래 모델과 같은 속도가 됩니다(대신 그 도메인 전용).",
      },
      {
        type: "multiple-choice",
        question: "멀티 도메인 서빙에서 '베이스 1개 + 어댑터 N개' 구조의 장점은?",
        options: [
          "도메인이 많아질수록 풀 모델 N개보다 메모리가 훨씬 적게 든다",
          "어댑터가 필요 없다",
          "베이스를 N개 띄운다",
        ],
        correctIndex: 0,
        explanation:
          "무거운 베이스는 1개만 공유하고 가벼운 어댑터만 N개 두므로, 도메인이 늘수록 풀 모델을 N개 띄우는 것보다 메모리가 크게 절약됩니다.",
      },
      {
        type: "multiple-choice",
        question: "서로 다른 도메인 어댑터 두 개를 단순히 더해 한 번에 쓰면?",
        options: [
          "항상 둘 다 완벽히 작동한다",
          "서로 간섭해 성능이 망가질 수 있어, 보통 교체하거나 전용 병합 기법을 쓴다",
          "베이스가 2배 빨라진다",
        ],
        correctIndex: 1,
        explanation:
          "어댑터를 단순 합산하면 업데이트끼리 간섭할 수 있어요. 도메인이 다르면 교체(swap)하거나, 합칠 땐 가중 병합·전용 기법을 사용합니다.",
      },
    ],
  } satisfies Quiz,
};
