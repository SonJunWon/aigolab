import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 20강 — LoRA+ (학습률 비대칭, 모듈 4)
 * A·B에 다른 학습률로 수렴 개선. 코드 검증: 로컬 numpy 통과(LoRA+가 더 빨리 수렴).
 */
export const kd20: Course = {
  id: "kd-20-lora-plus",
  title: "LoRA+ — 두 손에 다른 무게",
  subtitle: "A·B에 다른 학습률을 줘 더 빨리 수렴",
  icon: "🤹",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 220,
  sections: [
    {
      type: "text",
      content: `# 🤹 LoRA+ — 같은 어댑터, 다른 학습률

LoRA의 어댑터는 두 행렬 **A와 B**로 이루어져요(\`ΔW = B·A\`). 그런데 둘은 출발점이 달라요.

> 🃏 **LoRA의 비대칭 초기화**
> - **B = 0** 으로 시작(처음엔 어댑터가 모델을 안 건드리게).
> - **A = 작은 난수** 로 시작.
> → 학습 첫 순간, **B=0이라 A의 그래디언트도 0**! A는 한동안 거의 안 움직이고 B만 먼저 커져요. 출발이 한쪽으로 쏠린 거죠.

> 🃏 **LoRA+의 처방**
> A와 B에 **같은 학습률**을 주던 걸 바꿔서, **B의 학습률을 A보다 크게**(예: λ=8~16배) 줍니다. 한쪽으로 쏠린 출발을 보정해 **수렴이 빨라지고 성능도 약간 향상**돼요.

> 🪄 **비유**: 양손으로 짐을 드는데 한 손(B)이 더 무거운 짐을 맡았다면, **그 손에 더 힘(학습률)을 실어줘야** 균형 있게 빨리 듭니다.`,
    },
    {
      type: "code",
      title: "🧪 LoRA vs LoRA+ — 수렴 속도 비교",
      content: `목표 변화량(T)을 어댑터 \`B·A\`로 맞추는 토이예요. **같은 학습률**(LoRA) vs **B에 8배**(LoRA+) 의 손실 곡선을 비교해요. \`▶ 실행\``,
      code: `import numpy as np
rng = np.random.default_rng(1)
d, r = 64, 4

# 맞춰야 할 목표 변화량(저랭크)
T = rng.normal(0, 1, (d, r)) @ rng.normal(0, 1, (r, d))
T /= np.linalg.norm(T)

def train(lr_A, lr_B, steps=60):
    A = rng.normal(0, 0.01, (r, d)); B = np.zeros((d, r))   # LoRA 초기화: B=0
    losses = []
    for _ in range(steps):
        E = B @ A - T                       # 현재 오차
        gA = B.T @ E; gB = E @ A.T          # 그래디언트
        A -= lr_A * gA; B -= lr_B * gB      # 갱신
        losses.append(np.linalg.norm(E) / np.linalg.norm(T))
    return losses

base = 0.5
lora  = train(base, base)        # 같은 학습률
loraP = train(base, base * 8)    # LoRA+: B에 8배

print(f"{'step':>5}{'LoRA':>10}{'LoRA+':>10}")
for s in [0, 5, 15, 30, 59]:
    print(f"{s:>5}{lora[s]:>10.3f}{loraP[s]:>10.3f}")
print(f"\\n최종 손실  LoRA {lora[-1]:.3f}  vs  LoRA+ {loraP[-1]:.3f}  (작을수록 잘 수렴)")
print("👉 B=0 초기엔 A 그래디언트가 0 → B를 빨리 키우는 LoRA+가 훨씬 빨리 풀려요!")`,
      codeLanguage: "python",
      codeHint: "B의 배율(8)을 1·4·16으로 바꿔보세요. 1이면 일반 LoRA. 적당히 키우면 빨라지지만, 너무 키우면(예: 50) 불안정해질 수 있어요.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - LoRA는 **B=0·A=난수** 비대칭 초기화 → 출발이 한쪽으로 쏠림.
> - **LoRA+**: **B의 학습률을 A보다 크게**(λ배) 줘 보정 → **수렴↑·성능 소폭↑**.
> - 코드만 거의 안 바꾸고(학습률 하나 추가) 얻는 공짜 개선에 가까워요.

LoRA+는 '학습률'을 손봤죠. 다음 강 **DoRA** 는 한 발 더 나가, 가중치를 **크기와 방향으로 분해**해 더 정밀하게 학습합니다. 🧭`,
    },
  ],
  quiz: {
    title: "20강 — LoRA+ 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "LoRA에서 B를 0으로 초기화하기 때문에 생기는 현상은?",
        options: [
          "학습이 절대 안 된다",
          "학습 초기에 A의 그래디언트가 0이 되어 A가 한동안 거의 안 움직인다",
          "B가 영원히 0이다",
        ],
        correctIndex: 1,
        explanation:
          "ΔW=B·A에서 B=0이면 A의 그래디언트(B^T·E)도 0이라, 처음엔 B만 커지고 A는 정체돼요. 이 비대칭이 LoRA+가 보정하려는 지점입니다.",
      },
      {
        type: "multiple-choice",
        question: "LoRA+의 핵심 아이디어는?",
        options: [
          "A와 B에 똑같은 학습률을 준다",
          "B의 학습률을 A보다 크게(λ배) 줘 쏠린 출발을 보정한다",
          "어댑터를 두 개 쓴다",
        ],
        correctIndex: 1,
        explanation:
          "LoRA+는 B의 학습률을 A보다 크게 설정해 B=0 초기화로 생긴 불균형을 보정합니다. 수렴이 빨라지고 성능도 약간 좋아져요.",
      },
      {
        type: "multiple-choice",
        question: "LoRA+를 적용하는 비용에 대한 설명으로 옳은 것은?",
        options: [
          "모델 구조를 통째로 바꿔야 한다",
          "학습률 설정(B에 배율) 하나만 추가하면 되는 가벼운 개선이다",
          "데이터를 2배 모아야 한다",
        ],
        correctIndex: 1,
        explanation:
          "LoRA+는 어댑터 구조는 그대로 두고 B의 학습률 배율만 추가하면 돼요. 코드 변화가 작아 '거의 공짜' 개선에 가깝습니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-21-dora",
};
