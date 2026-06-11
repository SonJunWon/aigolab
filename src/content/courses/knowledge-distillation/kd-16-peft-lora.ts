import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 16강 — PEFT & LoRA 기본 (모듈 3)
 * 저랭크 어댑터만 학습. 코드 검증: 로컬 numpy 통과(3.12% 파라미터, 복원 오차 0).
 */
export const kd16: Course = {
  id: "kd-16-peft-lora",
  title: "PEFT & LoRA — 포스트잇만 붙이기",
  subtitle: "베이스는 그대로, 작은 어댑터만 학습",
  icon: "🪡",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 22,
  order: 216,
  sections: [
    {
      type: "text",
      content: `# 🪡 PEFT — 전체 말고 '일부만' 똑똑하게

FFT의 메모리 폭탄을 푸는 답이 **PEFT(Parameter-Efficient Fine-Tuning, 효율적 파인튜닝)** 예요. 그 대표 주자가 **LoRA**.

> 🃏 **LoRA(Low-Rank Adaptation)의 아이디어**
> 거대한 가중치 W는 **그대로 얼리고(동결)**, 그 옆에 **아주 작은 어댑터(저랭크 행렬 A·B)** 만 새로 학습. 모델은 \`W + A·B\` 로 동작.
> → 학습하는 건 **전체의 1~3%뿐!** 메모리·시간이 확 준다.

> 🪄 **비유**: 두꺼운 책(W)을 다시 쓰지 않고, **포스트잇(A·B)** 만 붙여 내용을 보정. 원본은 멀쩡, 포스트잇만 갈아끼우면 됨.

> 🃏 **왜 '저랭크'면 충분할까?**
> 파인튜닝으로 생기는 **변화량(ΔW)** 은 보통 '방향이 몇 개 안 되는' **저랭크**예요. 그래서 작은 A·B로도 그 변화를 거의 다 표현할 수 있어요(아래 코드로 확인!).`,
    },
    {
      type: "code",
      title: "🧪 LoRA 수학 — 1~3%만 학습해도 되는 이유",
      content: `① LoRA가 **학습 파라미터를 몇 배 줄이는지**, ② 작은 어댑터로 **변화를 표현할 수 있는지** 직접 확인해요. \`▶ 실행\``,
      code: `import numpy as np
rng = np.random.default_rng(0)
d, r = 512, 8   # 큰 가중치 d×d, LoRA 랭크 r (아주 작게)

# ① 학습 파라미터 비교
full = d * d              # FFT: W 전체
lora = d * r + r * d      # LoRA: A(d×r) + B(r×d) 만
print(f"전체 파인튜닝 학습 파라미터: {full:,}")
print(f"LoRA(r={r}) 학습 파라미터:     {lora:,}")
print(f"→ LoRA는 전체의 {lora/full*100:.2f}% 만 학습! ({full//lora}배 적음)\\n")

# ② 작은 A·B로 '변화량'을 표현할 수 있나? (저랭크 업데이트 복원)
true_A = rng.normal(0, 1, (d, r)); true_B = rng.normal(0, 1, (r, d))
deltaW = true_A @ true_B                       # 파인튜닝이 만드는 변화(저랭크)
U, S, Vt = np.linalg.svd(deltaW, full_matrices=False)
A, B = U[:, :r] * S[:r], Vt[:r, :]             # 랭크 r 어댑터로 근사
err = np.linalg.norm(A @ B - deltaW) / np.linalg.norm(deltaW)
print(f"작은 어댑터(A·B)로 변화 복원 오차: {err:.6f}  (≈0 = 거의 완벽)")
print("👉 베이스는 얼리고 작은 포스트잇(A·B)만 학습해도 변화를 표현 = LoRA의 마법!")`,
      codeLanguage: "python",
      codeHint: "r(랭크)을 4·16·64로 바꿔보세요. r이 클수록 표현력↑·학습 파라미터↑. 보통 r=8~16이면 충분해요.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - **PEFT/LoRA**: 베이스는 동결, 작은 어댑터(A·B)만 학습 → **1~3%만 학습**.
> - 파인튜닝 변화량은 보통 **저랭크** → 작은 어댑터로 충분.
> - 메모리·시간 급감 → 개인 GPU·무료 Colab에서도 가능(다음 강 QLoRA).

LoRA로 메모리를 줄였지만, **베이스 모델 자체를 메모리에 올리는 것**도 부담이죠. 다음 강 **QLoRA** 가 베이스를 **4비트로 압축**해 무료 Colab까지 내려옵니다. 🗜️`,
    },
  ],
  quiz: {
    title: "16강 — PEFT & LoRA 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "LoRA의 핵심 아이디어는?",
        options: [
          "모든 가중치를 다시 학습한다",
          "베이스 가중치는 얼리고 작은 어댑터(저랭크 A·B)만 학습한다",
          "모델을 삭제한다",
        ],
        correctIndex: 1,
        explanation:
          "LoRA는 큰 W를 동결하고 작은 A·B 어댑터만 학습해요(W + A·B). 학습 파라미터가 전체의 1~3%로 줄어 메모리·시간이 급감합니다.",
      },
      {
        type: "multiple-choice",
        question: "작은 어댑터(저랭크)로 충분한 이유는?",
        options: [
          "파인튜닝이 만드는 변화량(ΔW)이 보통 저랭크라서",
          "변화가 무작위라서",
          "모델이 작아서",
        ],
        correctIndex: 0,
        explanation:
          "파인튜닝으로 생기는 변화는 '방향이 몇 개 안 되는' 저랭크인 경우가 많아, 작은 A·B로도 그 변화를 거의 다 표현할 수 있어요(코드의 복원 오차 ≈0).",
      },
      {
        type: "multiple-choice",
        question: "LoRA를 '포스트잇'에 비유한 이유는?",
        options: [
          "원본(책=베이스)은 그대로 두고 작은 포스트잇(어댑터)만 붙여 보정하니까",
          "책을 버려서",
          "포스트잇이 크니까",
        ],
        correctIndex: 0,
        explanation:
          "베이스 모델은 멀쩡히 두고 작은 어댑터만 학습·교체하는 게 포스트잇을 붙였다 떼는 것과 같아요. 원본 보존 + 가벼움이 장점입니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-17-qlora",
};
