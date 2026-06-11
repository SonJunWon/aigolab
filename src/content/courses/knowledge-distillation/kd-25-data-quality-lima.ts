import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 25강 — 데이터 품질이 9할 (LIMA, 모듈 5 시작)
 * 품질>양. 코드 검증: 로컬 venv(sklearn 1.9) 통과 — 정성 80개(0.99) > 잘못라벨 3000개(0.67).
 */
export const kd25: Course = {
  id: "kd-25-data-quality-lima",
  title: "데이터 품질이 9할 — LIMA",
  subtitle: "왜 적은 정성 데이터가 대량을 이기나",
  icon: "💎",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 225,
  sections: [
    {
      type: "text",
      content: `# 💎 모듈 5 시작 — 좋은 어댑터의 재료는 '좋은 데이터'

모듈 3·4에서 **어떻게** 학습하는지(LoRA·DoRA…)를 다 배웠어요. 이제 남은 건 **무엇으로** — 바로 **데이터**입니다. 그리고 핵심 한 줄:

> 🃏 **LIMA의 발견 — "Less Is More for Alignment"**
> 잘 고른 **약 1,000개**의 데이터가, 대충 모은 **5만 개**보다 더 좋은 SFT 결과를 냈어요.
> → SFT에서 모델은 **새 지식을 배우는 게 아니라**(그건 사전학습에서 이미), 사용자 의도에 맞춰 **'어떻게 답할지'(형식·스타일)** 를 배워요. 그래서 **양보다 품질**이 결정적.

> 🪄 **비유**: 요리를 배울 때 **검증된 레시피 100개** 가 **출처 불명 1만 개** 보다 낫죠. 엉터리 레시피는 배울수록 **나쁜 습관**만 들어요.

> ⚠️ **나쁜 데이터는 '중립'이 아니라 '해롭다'**: 잘못 라벨된 데이터는 그냥 무의미한 게 아니라, 모델에게 **틀린 패턴을 적극적으로 가르쳐** 성능을 끌어내려요(아래 코드로 확인).`,
    },
    {
      type: "code",
      title: "🧪 정성 80개 vs 잘못 라벨된 3000개",
      content: `같은 문제를 ① **올바르게 라벨된 80개** vs ② **잘못된 가이드라인으로 라벨된 3000개** 로 학습시켜 정확도를 비교해요. \`▶ 실행\` (sklearn 첫 로드는 조금 걸려요)`,
      code: `import numpy as np
from sklearn.linear_model import LogisticRegression
rng = np.random.default_rng(0)

# 진짜 규칙: 두 특성의 합 > 0 이면 정답 1
def clean(n):
    X = rng.normal(0, 1, (n, 2))
    y = (X[:, 0] + X[:, 1] > 0).astype(int)
    return X, y

X_test, y_test = clean(3000)               # 깨끗한 시험지

# (A) 소량 고품질: 80개, 올바른 라벨
X_a, y_a = clean(80)

# (B) 대량 저품질: 3000개인데 '잘못된 가이드라인'으로 라벨링
X_b = rng.normal(0, 1, (3000, 2))
y_b = (X_b[:, 0] > 0.8).astype(int)        # 틀린 규칙(한 특성만·잘못된 경계)

acc_a = LogisticRegression().fit(X_a, y_a).score(X_test, y_test)
acc_b = LogisticRegression().fit(X_b, y_b).score(X_test, y_test)
print(f"(A) 정성 데이터   80개·올바른 라벨    → 정확도 {acc_a:.3f}")
print(f"(B) 대충 데이터 3000개·잘못된 가이드  → 정확도 {acc_b:.3f}")
winner = "A (소량 고품질)" if acc_a > acc_b else "B (대량)"
print(f"\\n🏆 승자: {winner} — 37배 적어도 깨끗하면 이긴다 = LIMA의 교훈")
print("나쁜 데이터는 '틀린 패턴'을 가르쳐 오히려 해로워요!")`,
      codeLanguage: "python",
      codeHint: "B의 잘못된 규칙(X_b[:,0] > 0.8)을 올바른 규칙으로 바꿔보세요 — 그럼 대량이 이겨요. 즉 '대량'이 나쁜 게 아니라 '대량인데 품질이 나쁜 것'이 문제예요.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - **LIMA**: SFT는 품질이 9할. 잘 고른 소량(~1k) > 대충 모은 대량(50k).
> - SFT에서 모델은 새 지식이 아니라 **'답하는 방식'** 을 배움 → 깨끗한 예시가 결정적.
> - 나쁜 데이터는 **중립이 아니라 해로움**(틀린 패턴 학습).

그럼 그 '좋은 데이터'를 **어디서, 어떻게** 구할까요? 다음 강에서 **수집·구축 전략**(출처·합성·라이선스·데이터 누수)을 봅니다. 🧺`,
    },
  ],
  quiz: {
    title: "25강 — 데이터 품질 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "LIMA가 보여준 핵심 교훈은?",
        options: [
          "데이터는 무조건 많을수록 좋다",
          "잘 고른 소량(~1k)이 대충 모은 대량(50k)보다 더 좋은 SFT 결과를 낼 수 있다",
          "데이터 품질은 중요하지 않다",
        ],
        correctIndex: 1,
        explanation:
          "LIMA(Less Is More for Alignment)는 잘 큐레이션된 약 1천 개가 대충 모은 5만 개보다 나은 결과를 냈어요. SFT에선 양보다 품질이 결정적입니다.",
      },
      {
        type: "multiple-choice",
        question: "SFT에서 모델이 주로 배우는 것은?",
        options: [
          "완전히 새로운 방대한 지식",
          "사용자 의도에 맞춰 '어떻게 답할지'(형식·스타일·정렬)",
          "아무것도 배우지 않는다",
        ],
        correctIndex: 1,
        explanation:
          "지식은 대부분 사전학습에서 이미 들어있어요. SFT는 '답하는 방식'을 정렬하는 단계라, 깨끗하고 일관된 예시가 특히 중요합니다.",
      },
      {
        type: "multiple-choice",
        question: "잘못 라벨된(저품질) 데이터의 영향은?",
        options: [
          "그냥 무의미할 뿐 해는 없다",
          "틀린 패턴을 적극적으로 가르쳐 성능을 떨어뜨린다",
          "항상 성능을 높인다",
        ],
        correctIndex: 1,
        explanation:
          "저품질 데이터는 중립이 아니라 해로워요. 코드에서 잘못된 가이드라인으로 라벨된 대량 데이터가 소량 정성 데이터보다 정확도가 크게 낮았죠.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-26-data-collection",
};
