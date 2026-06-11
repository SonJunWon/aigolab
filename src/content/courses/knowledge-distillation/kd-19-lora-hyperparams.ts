import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 19강 — LoRA 하이퍼파라미터 깊이 (모듈 4 시작)
 * rank·alpha·target modules·lr·epoch·과적합. 코드 검증: 로컬 numpy 통과(본질 랭크6서 오차 급감).
 */
export const kd19: Course = {
  id: "kd-19-lora-hyperparams",
  title: "LoRA 하이퍼파라미터 깊이",
  subtitle: "포스트잇의 크기·세기·위치를 튜닝하기",
  icon: "🎛️",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 22,
  order: 219,
  sections: [
    {
      type: "text",
      content: `# 🎛️ 모듈 4 시작 — LoRA를 '제대로' 다루기

모듈 3에서 LoRA로 포스트잇을 붙였다면, 이제 **그 포스트잇을 어떻게 튜닝**하느냐가 성패를 가릅니다. 핵심 다이얼 5개를 봅시다.

> 🃏 **LoRA 핵심 하이퍼파라미터**
> - **rank (r)** — 어댑터의 '용량'. 클수록 표현력↑·파라미터↑·과적합 위험↑. 보통 **8~32**.
> - **alpha (α)** — 어댑터를 얼마나 세게 반영할지. 실제 적용은 \`W + (α/r)·B·A\` → **유효 배율 = α/r**. 보통 α=r 또는 α=2r.
> - **target modules** — 어디에 포스트잇을 붙일지(\`q_proj·k_proj·v_proj·o_proj\` 등 어텐션 + MLP). 많이 붙일수록 표현력↑·비용↑.
> - **learning rate** — LoRA는 보통 풀 파인튜닝보다 **크게**(예: 2e-4).
> - **epoch** — 소량 데이터에선 **1~3**이면 충분. 더 돌리면 **과적합**(훈련은 잘, 새 입력은 못).

> 🪄 **비유**: 포스트잇의 **크기(r)** · **글씨 진하기(α)** · **붙이는 위치(target)** · **쓰는 속도(lr)** · **덧쓰는 횟수(epoch)** 를 조절하는 것.

> 🔑 **가장 헷갈리는 α/r**: α는 따로 의미가 있는 게 아니라 **r과의 비율(α/r)** 로 세기가 정해져요. r을 2배 키우면서 같은 세기를 원하면 α도 2배.`,
    },
    {
      type: "code",
      title: "🧪 rank 다이얼 — 클수록 무조건 좋을까?",
      content: `진짜 변화량(ΔW)은 보통 **본질 랭크**가 정해져 있어요. r을 키우며 ① 학습 파라미터와 ② 복원 오차가 어떻게 변하는지 보세요. \`▶ 실행\``,
      code: `import numpy as np
rng = np.random.default_rng(0)
d = 256

# 진짜 변화량 ΔW: 본질 랭크 6 + 약간의 잡음
true_r = 6
A0 = rng.normal(0, 1, (d, true_r)); B0 = rng.normal(0, 1, (true_r, d))
deltaW = A0 @ B0 + 0.05 * rng.normal(0, 1, (d, d))
U, S, Vt = np.linalg.svd(deltaW, full_matrices=False)

print(f"{'rank r':>7} {'학습params':>12} {'복원오차':>10}")
for r in [1, 2, 4, 6, 8, 16, 32]:
    approx = (U[:, :r] * S[:r]) @ Vt[:r, :]      # 랭크 r 어댑터로 근사
    err = np.linalg.norm(approx - deltaW) / np.linalg.norm(deltaW)
    params = 2 * d * r                            # A(d×r)+B(r×d)
    print(f"{r:>7} {params:>12,} {err:>9.3f}")

print("\\n→ 본질 랭크(6) 근처서 오차 급감, 그 이상은 params만↑ (용량 낭비·과적합 위험)")
print("→ 그래서 r=8~16이 '가성비' 구간. 무조건 크게가 답이 아니에요!")

# alpha/r 유효 배율
r, alpha = 8, 16
print(f"\\nLoRA 적용식: W + (alpha/r)·B·A   |  alpha={alpha}, r={r} → 유효 배율 {alpha/r}")`,
      codeLanguage: "python",
      codeHint: "true_r(본질 랭크)을 3이나 12로 바꿔보세요. 오차가 급감하는 r 위치가 본질 랭크를 따라 움직여요. alpha도 8·32로 바꿔 유효 배율(α/r) 변화를 확인!",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - **r**: 표현력 다이얼. 본질 랭크를 넘기면 오차는 안 줄고 비용·과적합만↑. **8~32**가 무난.
> - **α/r**: 어댑터 세기. r을 바꾸면 α도 같이 조정해 세기를 유지.
> - **target modules**: 많이 붙일수록 표현력↑·비용↑(보통 어텐션 q/k/v/o부터).
> - **lr은 크게(2e-4급), epoch은 작게(1~3)** — 많이 돌리면 과적합.

좋은 r·α를 골랐어도, 학습 **초반 수렴**이 느릴 수 있어요. 다음 강 **LoRA+** 는 A와 B에 **다른 학습률**을 줘 이 문제를 풉니다. 🤹`,
    },
  ],
  quiz: {
    title: "19강 — LoRA 하이퍼파라미터 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "LoRA에서 alpha의 실제 역할은?",
        options: [
          "어댑터의 랭크를 정한다",
          "α/r 비율로 어댑터 반영 '세기'(유효 배율)를 정한다",
          "학습 데이터 개수를 정한다",
        ],
        correctIndex: 1,
        explanation:
          "LoRA는 W + (α/r)·B·A 로 적용돼요. α 단독이 아니라 r과의 비율 α/r 이 어댑터의 세기를 결정합니다. r을 2배 키우면 같은 세기엔 α도 2배.",
      },
      {
        type: "multiple-choice",
        question: "rank(r)을 본질 랭크보다 훨씬 크게 키우면?",
        options: [
          "복원 오차가 계속 크게 줄어 항상 이득",
          "오차는 거의 안 줄고 학습 파라미터·과적합 위험만 늘어난다",
          "모델이 사라진다",
        ],
        correctIndex: 1,
        explanation:
          "변화량의 본질 랭크를 넘어서면 추가 랭크는 오차를 거의 못 줄이고 비용·과적합 위험만 키워요. 그래서 r=8~16 정도가 가성비 구간입니다.",
      },
      {
        type: "multiple-choice",
        question: "소량 데이터로 LoRA를 학습할 때 epoch에 대한 설명으로 옳은 것은?",
        options: [
          "많이 돌릴수록 항상 좋다",
          "보통 1~3이면 충분하고, 너무 많이 돌리면 과적합된다",
          "epoch은 LoRA와 무관하다",
        ],
        correctIndex: 1,
        explanation:
          "소량 SFT 데이터에선 1~3 epoch이면 충분해요. 더 돌리면 훈련 데이터는 잘 맞추지만 새 입력엔 약해지는 과적합이 옵니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-20-lora-plus",
};
