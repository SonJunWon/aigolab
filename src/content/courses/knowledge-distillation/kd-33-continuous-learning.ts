import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 33강 — Continuous Learning (망각 방지, 모듈 6)
 * catastrophic forgetting + 리허설/어댑터 완화. 코드 검증: 로컬 venv(sklearn 1.9) 통과.
 * A학습(A0.98)→B만이어학습(A0.50 망각)→리허설(A0.73 회복).
 */
export const kd33: Course = {
  id: "kd-33-continuous-learning",
  title: "Continuous Learning — 새 과목 배우다 옛것 까먹기",
  subtitle: "catastrophic forgetting과 리허설·어댑터로 완화",
  icon: "🧠",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 22,
  order: 233,
  sections: [
    {
      type: "text",
      content: `# 🧠 이어 배우다 옛것을 까먹는다 — 파국적 망각

모델에 **새 능력(B)** 을 이어서 가르치면 좋겠죠. 그런데 함정이 있어요.

> 🃏 **Catastrophic Forgetting(파국적 망각)**
> 이미 A를 배운 모델에게 **B만 이어서 학습**시키면, 가중치가 B에 맞춰 덮어써지며 **A를 갑자기 까먹어요**. 사람처럼 서서히가 아니라 **급격히** 무너지는 게 특징.

> 🃏 **완화 전략 3가지**
> - **① 리허설(rehearsal)**: B를 배울 때 **옛 데이터(A)를 일부 섞어** 함께 학습 → A를 잊지 않게.
> - **② 어댑터 분리(LoRA)**: 도메인마다 **별도 어댑터**를 두고(24강 스왑) 베이스는 안 건드리기 → 서로 간섭 없음.
> - **③ 작은 학습률·정규화**: 기존 지식을 덜 덮어쓰게 살살.

> 🪄 **비유**: 새 과목을 벼락치기하다 **지난 과목을 통째로 까먹는 것**. 복습(리허설)을 섞거나, 과목별 **노트(어댑터)** 를 따로 쓰면 막을 수 있어요.`,
    },
    {
      type: "code",
      title: "🧪 망각을 눈으로 — 그리고 리허설로 막기",
      content: `A를 배운 모델에 ① B만 이어학습(→A 망각) vs ② A를 섞어 학습(리허설→A 유지) 을 비교해요. \`▶ 실행\` (sklearn 첫 로드 잠깐)`,
      code: `import numpy as np
from sklearn.linear_model import SGDClassifier
rng = np.random.default_rng(0)

def task(rule, n=400):
    X = rng.normal(0, 1, (n, 4))
    return X, rule(X).astype(int)

# 두 과목: A는 특성0 기준, B는 특성1 기준 (규칙이 다름)
XA, yA = task(lambda X: X[:, 0] > 0)
XB, yB = task(lambda X: X[:, 1] > 0)
XA_te, yA_te = task(lambda X: X[:, 0] > 0, 1000)
XB_te, yB_te = task(lambda X: X[:, 1] > 0, 1000)

def fresh(): return SGDClassifier(loss="log_loss", random_state=0)

# ① 과목 A 학습
clf = fresh()
for _ in range(30): clf.partial_fit(XA, yA, classes=[0, 1])
print(f"① A 학습 후       → A {clf.score(XA_te,yA_te):.2f}   B {clf.score(XB_te,yB_te):.2f}")

# ② B만 이어 학습 (순차) → A를 까먹나?
for _ in range(30): clf.partial_fit(XB, yB)
print(f"② B만 이어학습    → A {clf.score(XA_te,yA_te):.2f}   B {clf.score(XB_te,yB_te):.2f}   ← A 급락 = 망각!")

# ③ 리허설: A를 섞어서 B 학습 → A 유지
clf = fresh()
for _ in range(30): clf.partial_fit(XA, yA, classes=[0, 1])
Xmix, ymix = np.vstack([XA, XB]), np.concatenate([yA, yB])
for _ in range(30):
    idx = rng.permutation(len(Xmix))
    clf.partial_fit(Xmix[idx], ymix[idx])
print(f"③ 리허설(A 섞어)  → A {clf.score(XA_te,yA_te):.2f}   B {clf.score(XB_te,yB_te):.2f}   ← A 회복!")
print("\\n👉 B만 학습하면 A를 까먹지만, 옛 데이터(A)를 섞으면(리허설) A를 지켜요")`,
      codeLanguage: "python",
      codeHint: "②에서 B 학습 반복 수(30)를 늘리면 A를 더 심하게 까먹어요. ③의 리허설에서 A 비율을 늘리면 A는 더 잘 지키지만 B 학습이 느려지는 트레이드오프가 보입니다.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - **Catastrophic Forgetting**: 새것(B)만 이어 학습하면 옛것(A)을 **급격히** 까먹음.
> - 완화: **① 리허설(옛 데이터 섞기) · ② 어댑터 분리(LoRA 스왑) · ③ 작은 lr/정규화**.
> - 그래서 멀티 도메인은 한 모델에 욱여넣기보다 **도메인별 어댑터**(24강)가 안전한 경우가 많아요.

이제 모델을 만들고 이어 배우는 법까지 봤어요. 마지막 질문 — **"잘 됐는지 어떻게 평가하지?"** 코스의 대미, **LLM-as-a-Judge** 로 마무리합니다. ⚖️`,
    },
  ],
  quiz: {
    title: "33강 — Continuous Learning 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "Catastrophic Forgetting(파국적 망각)이란?",
        options: [
          "모델이 천천히 모든 걸 잊는 것",
          "새 능력만 이어 학습할 때 기존 능력을 급격히 잃는 현상",
          "데이터가 사라지는 것",
        ],
        correctIndex: 1,
        explanation:
          "이미 배운 A 위에 B만 이어 학습하면 가중치가 B에 맞춰 덮어써지며 A를 급격히 까먹어요. 코드에서 A 정확도가 0.98→0.50으로 무너졌죠.",
      },
      {
        type: "multiple-choice",
        question: "리허설(rehearsal)로 망각을 막는 방법은?",
        options: [
          "옛 데이터를 모두 버린다",
          "새것(B)을 배울 때 옛 데이터(A)를 일부 섞어 함께 학습한다",
          "학습률을 크게 키운다",
        ],
        correctIndex: 1,
        explanation:
          "B를 학습할 때 A 데이터를 섞으면 A의 패턴을 계속 복습해 잊지 않아요. 코드에서 리허설로 A가 0.50에서 회복됐습니다.",
      },
      {
        type: "multiple-choice",
        question: "멀티 도메인에서 망각을 피하는 구조적 방법은?",
        options: [
          "도메인마다 별도 LoRA 어댑터를 두고 스왑(베이스는 그대로)",
          "모든 도메인을 한 가중치에 계속 덮어쓴다",
          "어댑터를 쓰지 않는다",
        ],
        correctIndex: 0,
        explanation:
          "도메인별 어댑터를 따로 두면(24강 스왑) 베이스를 건드리지 않아 서로 간섭·망각이 없어요. 멀티 도메인엔 어댑터 분리가 안전합니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-34-llm-as-judge",
};
