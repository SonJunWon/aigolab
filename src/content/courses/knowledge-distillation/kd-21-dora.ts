import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 21강 — DoRA (크기·방향 분해, 모듈 4)
 * 가중치를 magnitude·direction으로 분해해 더 정밀. 코드 검증: 로컬 numpy 통과(분해 오차≈0, 크기 독립 제어).
 */
export const kd21: Course = {
  id: "kd-21-dora",
  title: "DoRA — 크기 따로, 방향 따로",
  subtitle: "가중치를 크기·방향으로 분해해 더 정밀하게",
  icon: "🧭",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 221,
  sections: [
    {
      type: "text",
      content: `# 🧭 DoRA — 가중치를 둘로 쪼개기

LoRA는 가중치를 \`W + B·A\` 로 **통째로** 바꿔요. 그런데 가중치 하나하나(벡터)에는 사실 두 가지 정보가 섞여 있어요.

> 🃏 **모든 가중치 벡터 = 크기 × 방향**
> 벡터 \`w\` 는 **크기(magnitude, ||w||)** 와 **방향(direction, w/||w||)** 으로 항상 분해돼요. \`w = m · (V/||V||)\`.

> 🃏 **DoRA(Weight-Decomposed LoRA)의 아이디어**
> 사전학습 가중치를 **크기 m** 과 **방향 V** 로 분해한 뒤,
> - **방향**은 LoRA 어댑터(B·A)로 학습하고,
> - **크기 m** 은 **별도의 작은 파라미터**로 따로 학습.
> → 크기와 방향을 **독립적으로** 조절하니, 통째로 바꾸는 LoRA보다 **풀 파인튜닝(FFT)에 가까운 정밀한 학습 패턴**을 얻어요.

> 🪄 **비유**: 스피커를 조절할 때 **음량(크기)** 과 **방향(어디로 쏠지)** 을 **따로 된 다이얼**로 돌리는 것. 한 다이얼로 둘을 동시에 건드리는 것(LoRA)보다 미세 조정이 쉽죠.

> 🔑 연구에서 DoRA는 LoRA와 **추론 비용은 같으면서**(학습 후 다시 W로 병합 가능) 정확도가 더 높게 나오는 경우가 많아요.`,
    },
    {
      type: "code",
      title: "🧪 분해와 독립 제어 — 크기만 바꿔보기",
      content: `가중치를 크기·방향으로 분해(복원 오차≈0)한 뒤, **방향은 그대로 두고 크기만** 1.5배로 바꿔봐요. DoRA가 둘을 따로 제어한다는 걸 확인! \`▶ 실행\``,
      code: `import numpy as np
rng = np.random.default_rng(2)
d, r = 128, 4
W = rng.normal(0, 1, (d, d))     # 사전학습 가중치

# ① 컬럼별 크기(m)·방향(V/||V||)으로 분해
m = np.linalg.norm(W, axis=0, keepdims=True)
Vdir = W / m
print("분해:  W = m · (V/||V||)")
print(f"  복원 오차: {np.linalg.norm(Vdir * m - W):.2e}   (≈0 = 완벽 분해)")

# ② DoRA식 업데이트: 방향은 LoRA(B·A)로, 크기 m은 따로
B = rng.normal(0, 0.02, (d, r)); A = rng.normal(0, 0.02, (r, d))
W_dir = W + B @ A                                  # 방향 갱신(작게)
m_new = m * 1.5                                    # 크기만 1.5배 (방향 불변)
W_dora = m_new * (W_dir / np.linalg.norm(W_dir, axis=0, keepdims=True))

col = 0
print(f"\\n[컬럼 0]  원래 크기 {m[0, col]:.3f}")
print(f"  DoRA로 크기만 ×1.5 → {np.linalg.norm(W_dora[:, col]):.3f}")
cos = (W[:, col] @ W_dora[:, col]) / (np.linalg.norm(W[:, col]) * np.linalg.norm(W_dora[:, col]))
print(f"  방향 유사도(cos) {cos:.4f}  ≈ 1 → 방향은 보존, 크기만 바뀜")
print("\\n👉 크기·방향을 '따로' 정밀 제어 = DoRA. LoRA는 둘이 엉켜 같이 움직여요.")`,
      codeLanguage: "python",
      codeHint: "m_new 배율(1.5)을 0.5·2.0으로 바꿔보세요. cos 유사도는 계속 ≈1(방향 보존)이고 크기만 변해요. 어댑터 B·A를 키우면 방향(cos)이 더 많이 바뀝니다.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - 모든 가중치 = **크기(magnitude) × 방향(direction)**.
> - **DoRA**: 방향은 LoRA로, **크기는 따로** 학습 → 독립 제어 → **FFT에 가까운 정밀 학습**.
> - 추론 비용은 LoRA와 동일(다시 W로 병합 가능). 정확도는 보통 LoRA보다↑.

DoRA가 '무엇을' 얼마나 바꿀지 정밀하게 했다면, 다음 강 **AdaLoRA** 는 '어느 층에' 랭크(용량)를 더 줄지 **적응적으로 배분**합니다. 📊`,
    },
  ],
  quiz: {
    title: "21강 — DoRA 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "DoRA가 가중치를 분해하는 두 요소는?",
        options: [
          "크기(magnitude)와 방향(direction)",
          "실수부와 허수부",
          "행과 열",
        ],
        correctIndex: 0,
        explanation:
          "DoRA는 가중치를 크기(||w||)와 방향(w/||w||)으로 분해해요. w = m·(V/||V||) 형태입니다.",
      },
      {
        type: "multiple-choice",
        question: "DoRA에서 방향과 크기는 각각 어떻게 학습되나?",
        options: [
          "둘 다 통째로 한 번에",
          "방향은 LoRA 어댑터로, 크기는 별도 파라미터로 따로",
          "둘 다 학습하지 않는다",
        ],
        correctIndex: 1,
        explanation:
          "DoRA는 방향을 LoRA(B·A)로 학습하고 크기 m은 별도로 학습해요. 독립 제어 덕분에 풀 파인튜닝에 가까운 정밀한 학습 패턴을 얻습니다.",
      },
      {
        type: "multiple-choice",
        question: "DoRA의 추론 비용에 대한 설명으로 옳은 것은?",
        options: [
          "LoRA보다 항상 훨씬 무겁다",
          "학습 후 다시 W로 병합 가능해 LoRA와 추론 비용이 같다",
          "추론이 불가능하다",
        ],
        correctIndex: 1,
        explanation:
          "DoRA는 학습이 끝나면 원래 가중치 형태로 병합할 수 있어 추론 시 LoRA와 동일한 비용을 내면서 정확도는 더 높은 경우가 많아요.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-22-adalora",
};
