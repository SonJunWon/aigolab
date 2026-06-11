import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 6강 — Scaling Law (모듈 1)
 * 크기·데이터·성능의 거듭제곱 법칙. matplotlib 곡선 피팅+외삽. 코드 검증: 로컬 통과(a≈48.5, b≈0.118).
 */
export const kd06: Course = {
  id: "kd-06-scaling-law",
  title: "Scaling Law — 크면 좋아진다, 얼마나?",
  subtitle: "성능은 거듭제곱으로 '예측 가능하게' 변한다",
  icon: "📈",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 22,
  order: 206,
  sections: [
    {
      type: "text",
      content: `# 📈 스케일링 로 — 성능은 '예측 가능'하다

지금까지 "작은 모델로 큰 모델 능력을"을 배웠어요. 그런데 **애초에 모델을 키우면 성능이 어떻게 변할까요?** 놀랍게도 **법칙**이 있습니다.

> 🃏 **스케일링 로(Scaling Law)**
> 모델 크기(N)·데이터(D)·계산(C)을 키우면, 손실(loss, 낮을수록 좋음)이 **거듭제곱 꼴로 예측 가능하게** 내려가요.
> $$\\text{loss} \\approx a \\cdot N^{-b}$$
> 즉 "이만큼 키우면 이만큼 좋아진다"를 **미리 계산**할 수 있다는 거예요(GPT급 모델들도 이걸로 설계됨).

> 🪄 **비유**: 키가 클수록 농구에 유리하지만 **수익은 체감**해요. 150→180cm는 큰 차이, 210→215cm는 작은 차이. 모델도 똑같이 키울수록 이득이 줄어드는(거듭제곱) 곡선이에요.

> 🔑 왜 중요? **"우리 모델을 2배 키우면 얼마나 좋아질까?"** 를 돈 쓰기 전에 예측하니까. 그리고 다음 강에서 보듯, 이 법칙이 **"작은 모델이 매력적인 이유"** 를 수학으로 설명해줍니다.`,
    },
    {
      type: "code",
      title: "🧪 거듭제곱 법칙 직접 피팅 + 미래 예측",
      content: `여러 크기의 모델에서 잰 손실 데이터로 **거듭제곱 법칙을 피팅**하고, **아직 안 만든 10배 큰 모델**의 손실을 예측해볼게요.
\`▶ 실행\` — 그래프와 예측값이 나옵니다.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# 모델 크기(N) ↑ → 손실 ↓. 측정값 (약간의 노이즈 포함)
N = np.array([1e6, 3e6, 1e7, 3e7, 1e8, 3e8, 1e9])
rng = np.random.default_rng(0)
true_a, true_b = 50.0, 0.12
loss = true_a * N**(-true_b) * (1 + rng.normal(0, 0.02, size=N.size))

# 로그-로그 공간에서 직선 피팅 → 거듭제곱 지수 b 추정
slope, logA = np.polyfit(np.log(N), np.log(loss), 1)
a, b = np.exp(logA), -slope
print(f"📐 추정된 법칙:  loss ≈ {a:.1f} × N^(-{b:.3f})")

# 외삽: 아직 안 만든 10배 큰 모델의 손실을 '미리' 예측
N_future = 1e10
pred = a * N_future**(-b)
print(f"🔮 10배 큰 모델(N={N_future:.0e})의 손실 예측 ≈ {pred:.2f}")
print("   → 돈 쓰기 전에 '얼마나 좋아질지' 계산 가능!")

plt.figure(figsize=(5.2, 3.2))
plt.loglog(N, loss, "o", label="측정값")
xs = np.logspace(6, 10, 50)
plt.loglog(xs, a * xs**(-b), "-", label="피팅된 거듭제곱 법칙")
plt.scatter([N_future], [pred], color="red", zorder=5, label="예측(미래 모델)")
plt.xlabel("모델 크기 N (파라미터)"); plt.ylabel("손실(loss)")
plt.title("스케일링 로 — 크면 좋아진다(예측 가능)")
plt.legend(); plt.grid(True, which="both", alpha=0.3)`,
      codeLanguage: "python",
      codeHint: "로그-로그 그래프에서 거듭제곱 법칙은 '직선'이 돼요. 그래서 직선을 그어 미래(외삽)를 예측할 수 있습니다.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - 성능(손실)은 크기·데이터를 키우면 **거듭제곱으로 예측 가능**하게 좋아진다.
> - 로그-로그에서 **직선** → 미래 모델 성능을 **외삽으로 예측**.
> - 단, **수익 체감** — 키울수록 이득이 줄어든다.

그럼 자연스러운 질문: **"돈(계산)이 정해져 있으면, 모델을 키울까 데이터를 늘릴까?"** 다음 강 **Chinchilla**가 답을 줍니다 — 그리고 그 답이 **"작은 모델이 왜 똑똑한 선택인지"** 를 알려줘요. 🐭`,
    },
  ],
  quiz: {
    title: "6강 — Scaling Law 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "스케일링 로의 핵심 메시지는?",
        options: [
          "성능은 무작위라 예측 불가",
          "크기·데이터를 키우면 손실이 거듭제곱으로 '예측 가능하게' 내려간다",
          "모델은 키울수록 나빠진다",
        ],
        correctIndex: 1,
        explanation:
          "모델 크기·데이터·계산을 키우면 손실이 거듭제곱 꼴로 예측 가능하게 감소합니다. 그래서 '얼마나 키우면 얼마나 좋아질지'를 미리 계산할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "거듭제곱 법칙을 로그-로그 그래프로 그리면?",
        options: ["직선이 된다(그래서 외삽으로 미래 예측 가능)", "원이 된다", "사라진다"],
        correctIndex: 0,
        explanation:
          "loss ≈ a·N^(-b)는 로그를 취하면 직선이 됩니다. 직선을 연장(외삽)하면 아직 안 만든 큰 모델의 성능도 예측할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "'수익 체감'이 의미하는 것은?",
        options: [
          "키울수록 이득이 점점 커진다",
          "키울수록 추가 이득이 점점 줄어든다(농구 키 비유)",
          "이득이 일정하다",
        ],
        correctIndex: 1,
        explanation:
          "거듭제곱 곡선이라 모델을 키울수록 추가 성능 이득은 점점 작아집니다. 그래서 무작정 키우는 게 항상 답은 아니에요(다음 강 Chinchilla).",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-07-chinchilla",
};
