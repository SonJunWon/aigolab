import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 22강 — AdaLoRA (적응적 랭크 배분, 모듈 4)
 * 중요한 층에 랭크를 더. 코드 검증: 로컬 numpy 통과(적응 배분이 균등보다 오차↓).
 */
export const kd22: Course = {
  id: "kd-22-adalora",
  title: "AdaLoRA — 중요한 곳에 랭크를 더",
  subtitle: "층마다 다른 중요도에 맞춰 용량을 배분",
  icon: "📊",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 222,
  sections: [
    {
      type: "text",
      content: `# 📊 AdaLoRA — 랭크를 '공평하게' 말고 '현명하게'

지금까지 LoRA는 **모든 층에 똑같은 랭크 r**(예: 전부 r=8)을 붙였어요. 그런데 층마다 중요도가 다르다면?

> 🃏 **문제: 균등 배분은 비효율**
> 어떤 층(예: 어텐션)은 파인튜닝에서 크게 변해야 하고, 어떤 층은 거의 안 변해도 돼요. 그런데 모두에게 r=8을 주면 **중요한 층은 용량 부족, 안 중요한 층은 용량 낭비**.

> 🃏 **AdaLoRA의 아이디어 — 적응적 랭크 배분**
> 정해진 **총 랭크 예산**을 층의 **중요도에 비례**해 나눠줘요. 학습 중 어댑터를 SVD 형태로 보고 **덜 중요한 특이값(rank)을 잘라내고(prune)**, 그 예산을 **중요한 층에 더** 몰아줍니다.
> → 같은 총 예산으로 **더 낮은 오차** = 더 좋은 성능.

> 🪄 **비유**: 포스트잇 묶음이 한정돼 있을 때, **모든 페이지에 똑같이** 붙이는 대신 **중요한 페이지에 더 많이** 붙이는 것.`,
    },
    {
      type: "code",
      title: "🧪 균등 배분 vs 적응 배분 — 같은 예산, 다른 결과",
      content: `중요도(본질 랭크)가 제각각인 3개 층에 **총 18 랭크**를 ① 균등하게 vs ② 중요도(특이값 에너지) 비례로 나눠 복원 오차를 비교해요. \`▶ 실행\``,
      code: `import numpy as np
rng = np.random.default_rng(3)
d = 128

# 3개 층: 본질 랭크(중요도)가 제각각
ranks = {"attention": 12, "mlp": 6, "embed": 2}
deltas = {n: rng.normal(0, 1, (d, tr)) @ rng.normal(0, 1, (tr, d)) for n, tr in ranks.items()}

def approx_err(M, r):
    U, S, Vt = np.linalg.svd(M, full_matrices=False)
    return np.linalg.norm((U[:, :r] * S[:r]) @ Vt[:r, :] - M) / np.linalg.norm(M)

budget = 18                                   # 총 랭크 예산(3개 층 합)

# (a) 균등 배분: 각 6
uni = {n: 6 for n in deltas}
# (b) 적응 배분: 특이값 에너지(중요도)에 비례 — AdaLoRA식
energy = {n: np.linalg.svd(M, compute_uv=False).sum() for n, M in deltas.items()}
tot = sum(energy.values())
ada = {n: max(1, round(budget * energy[n] / tot)) for n in deltas}

print(f"총 예산 {budget} 랭크")
print(f"{'층':>10}{'균등':>8}{'적응':>8}")
for n in deltas:
    print(f"{n:>10}{uni[n]:>8}{ada[n]:>8}")

err_uni = sum(approx_err(deltas[n], uni[n]) for n in deltas) / 3
err_ada = sum(approx_err(deltas[n], ada[n]) for n in deltas) / 3
print(f"\\n평균 복원 오차  균등 {err_uni:.3f}  vs  적응 {err_ada:.3f}  (작을수록 좋음)")
print("👉 중요한 층(attention)에 랭크를 몰아주면 같은 예산으로 더 잘 맞춤 = AdaLoRA")`,
      codeLanguage: "python",
      codeHint: "ranks의 본질 랭크 값을 바꿔 층 중요도를 조절해보세요. 층 간 중요도 차이가 클수록 적응 배분의 이득이 커져요(차이가 없으면 균등과 비슷).",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - **균등 배분**: 모든 층에 같은 r → 중요한 층 부족·안 중요한 층 낭비.
> - **AdaLoRA**: 총 예산을 **중요도 비례**로 배분, 덜 중요한 랭크는 가지치기 → **같은 예산, 더 낮은 오차**.
> - 핵심 직관: **"어디에 용량을 쓸지"** 를 데이터가 정하게 한다.

이렇게 PEFT 신기법 4가지(하이퍼파라미터 튜닝·LoRA+·DoRA·AdaLoRA)를 봤어요. 다음 강은 잠시 방향을 틀어, **학습에 쓸 데이터를 교사 모델로 자동 생성**하는 법(= 또 다른 증류!)으로 갑니다. 🏭`,
    },
  ],
  quiz: {
    title: "22강 — AdaLoRA 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "AdaLoRA가 풀려는 문제는?",
        options: [
          "모든 층에 똑같은 랭크를 주는 균등 배분의 비효율",
          "학습률이 너무 큰 문제",
          "데이터가 부족한 문제",
        ],
        correctIndex: 0,
        explanation:
          "모든 층에 같은 r을 주면 중요한 층은 용량이 부족하고 덜 중요한 층은 낭비돼요. AdaLoRA는 이 균등 배분의 비효율을 해결합니다.",
      },
      {
        type: "multiple-choice",
        question: "AdaLoRA가 랭크를 배분하는 방식은?",
        options: [
          "무작위로 나눈다",
          "층의 중요도에 비례해 배분하고, 덜 중요한 랭크는 가지치기(prune)한다",
          "항상 첫 번째 층에 모두 준다",
        ],
        correctIndex: 1,
        explanation:
          "AdaLoRA는 어댑터를 SVD로 보고 중요도(특이값)가 낮은 랭크를 잘라내며, 그 예산을 중요한 층에 더 몰아줍니다.",
      },
      {
        type: "multiple-choice",
        question: "같은 총 랭크 예산에서 적응 배분이 균등 배분보다 나은 이유는?",
        options: [
          "용량을 중요한 층에 집중해 전체 오차를 더 낮추기 때문",
          "파라미터가 더 많아서",
          "데이터가 더 많아서",
        ],
        correctIndex: 0,
        explanation:
          "한정된 예산을 중요한 층에 집중하면 전체 복원 오차가 낮아져요. 층 간 중요도 차이가 클수록 이득이 큽니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-23-data-synthesis",
};
