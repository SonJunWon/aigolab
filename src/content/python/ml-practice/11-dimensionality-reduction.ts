import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson11: Lesson = {
  id: "python-ml-11",
  language: "python",
  track: "ml-practice" as const,
  order: 11,
  title: "차원 축소와 PCA — 고차원을 2D 로 펼치기",
  subtitle: "주성분 분석으로 정보를 최대한 보존하며 축을 갈아끼우기",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🧭 차원 축소와 PCA

> 📌 이 챕터는 **matplotlib 시각화** 를 예외적으로 사용합니다.
> PCA 의 가치는 "고차원을 2D 로 펼쳐서 **눈으로 보는 것**" 이 본질이기 때문이에요.
> Pyodide 환경은 \`plt.show()\` 없이 그래프가 셀 출력에 자동 렌더링됩니다 (v3.17.0+).

이번 챕터에서 배울 것:
- **차원의 저주** — 왜 고차원이 문제인가
- **PCA 의 원리** — 분산을 가장 많이 보존하는 새 축
- **SVD 로 직접 구현** — \`np.linalg.svd\` 로 PCA 를 손수 조립
- **sklearn.PCA** — 같은 결과를 한 줄로
- **설명 분산 비율** — 몇 개 PC 로 충분한가
- **Loadings** — 어떤 원 특성이 어떤 PC 에 기여하는가
- **iris 시각화** — 4D → 2D, 종이 어떻게 갈라지는가`,
    },
    {
      type: "markdown",
      source: `## 📉 차원의 저주 — 왜 차원을 줄여야 할까

피처가 많으면 좋을 것 같지만, 실제로는 여러 문제가 생깁니다:

| 문제 | 설명 |
|---|---|
| **시각화 불가** | 4차원 이상은 그릴 수 없음 — 패턴을 눈으로 못 찾음 |
| **샘플 희박성** | 차원이 늘면 공간 부피가 폭발해 데이터가 '드문드문' |
| **거리 왜곡** | KNN·클러스터링의 '가까움' 개념이 무의미해짐 |
| **과적합** | 피처 수 ≈ 샘플 수면 모델이 노이즈까지 외움 |
| **연산 비용** | 모든 알고리즘이 느려짐 |

> 💡 **해법**: 정보를 최대한 지키면서 차원을 줄이자 → **차원 축소 (dimensionality reduction)**`,
    },
    {
      type: "markdown",
      source: `## 🧭 PCA — 주성분 분석의 아이디어

**Principal Component Analysis**:
1. 데이터의 **분산이 가장 큰 방향** 을 첫 번째 새 축으로 (= PC1)
2. PC1 에 **수직** 이면서 남은 분산이 가장 큰 방향을 PC2 로
3. 계속 반복해 원래 차원 수만큼 새 축을 만듦 — 서로 **직교 (orthogonal)**

> 🎯 포인트: "분산이 크다 = 데이터를 잘 구별한다" 는 가정.
> PC1, PC2 에 **분산의 대부분** 이 몰려 있으면, 나머지 축을 버려도 거의 같은 그림이 됨.

### 수학적으로는?
데이터 행렬 X 를 중심화(평균 빼기)한 뒤 **특이값 분해 (SVD)** 하면:

\`\`\`
X = U · Σ · Vᵀ

- V 의 열 = 주축 벡터 (loadings)
- Σ 의 대각 = 특이값 (분산과 연결됨)
- U · Σ = 새 좌표계에서의 점들 (scores)
\`\`\`

이제 이걸 numpy 로 직접 해봅시다.`,
    },
    {
      type: "markdown",
      source: `## 🧮 SVD 로 PCA 직접 구현

sklearn 한 줄로 끝낼 수 있는 걸 **굳이 손으로 조립** 하는 이유: **블랙박스를 열어보면 두려움이 없어져요.** 이 셀 하나 이해하면 앞으로 어떤 PCA 변형(Kernel PCA, ICA 등)을 만나도 당황하지 않습니다.`,
    },
    {
      type: "code",
      source: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler

iris = load_iris()
X, y = iris.data, iris.target
feature_names = iris.feature_names
target_names = iris.target_names

# 1) 표준화 — PCA 는 스케일에 민감 (분산 기반이라)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print(f"원 데이터 shape: {X.shape}  ({X.shape[1]}차원)")
print(f"표준화 후 각 특성의 평균/표준편차:")
for i, name in enumerate(feature_names):
    print(f"  {name:<22} mean={X_scaled[:, i].mean():+.3f}  std={X_scaled[:, i].std():.3f}")

# 2) SVD 분해: X_scaled = U · diag(S) · VT
U, S, VT = np.linalg.svd(X_scaled, full_matrices=False)

print(f"\\nU shape:  {U.shape}   ← 샘플 × 성분")
print(f"S shape:  {S.shape}   ← 특이값 (내림차순)")
print(f"VT shape: {VT.shape}  ← 성분 × 특성 (V 의 전치)")
print(f"\\n특이값 S: {np.round(S, 3)}   ← 클수록 중요한 성분")`,
    },
    {
      type: "markdown",
      source: `### 설명 분산 비율 — 몇 개 PC 로 충분?

특이값 S 는 분산의 **√n** 배. 그래서 설명 분산은 \`S² / (n-1)\`, 비율은 그걸 총합으로 나눈 값.`,
    },
    {
      type: "code",
      source: `n = X_scaled.shape[0]
explained_variance = (S ** 2) / (n - 1)
explained_ratio = explained_variance / explained_variance.sum()
cumulative = np.cumsum(explained_ratio)

print(f"{'PC':>4}  {'설명분산':>10}  {'비율':>8}  {'누적비율':>8}")
print("-" * 40)
for i, (ev, r, c) in enumerate(zip(explained_variance, explained_ratio, cumulative), start=1):
    bar = "█" * int(r * 30)
    print(f"PC{i:>2}  {ev:>10.3f}  {r:>7.1%}  {c:>7.1%}  {bar}")

print(f"\\n→ PC1+PC2 만으로 {cumulative[1]:.1%} 설명. 4차원을 2차원으로 줄여도 정보 손실이 적음!")`,
    },
    {
      type: "markdown",
      source: `### 주성분 점수 (scores) — 새 좌표계에서의 점들`,
    },
    {
      type: "code",
      source: `# scores = U · diag(S) = X_scaled · V  (둘 다 같은 값)
scores = U @ np.diag(S)
# 동치: scores = X_scaled @ VT.T

print(f"새 좌표 (scores) shape: {scores.shape}   ← 원본과 샘플 수는 같음")
print(f"\\n처음 5개 샘플의 PC1, PC2 좌표:")
print(f"{'샘플':>5}  {'PC1':>8}  {'PC2':>8}  {'실제 종':<15}")
for i in range(5):
    print(f"{i:>5}  {scores[i, 0]:>8.3f}  {scores[i, 1]:>8.3f}  {target_names[y[i]]}")`,
    },
    {
      type: "markdown",
      source: `## 🎯 sklearn.PCA 로 같은 결과 재현

직접 한 게 맞는지 검증하려면, 같은 답을 내는 다른 구현과 비교하는 게 최고. \`sklearn.decomposition.PCA\` 는 내부적으로 **정확히 같은 SVD** 를 씁니다.`,
    },
    {
      type: "code",
      source: `from sklearn.decomposition import PCA

pca = PCA(n_components=2)
scores_sklearn = pca.fit_transform(X_scaled)

print("== sklearn PCA ==")
print(f"explained_variance_ratio_: {pca.explained_variance_ratio_.round(4)}")
print(f"누적: {pca.explained_variance_ratio_.sum():.4f}")
print()
print("== 내가 직접 계산한 것 ==")
print(f"PC1, PC2 비율:             {explained_ratio[:2].round(4)}")
print(f"누적:                       {explained_ratio[:2].sum():.4f}")

# 부호는 구현에 따라 반전될 수 있음 (수학적으로 등가) — 절대값 비교
diff = np.abs(np.abs(scores_sklearn) - np.abs(scores[:, :2])).max()
print(f"\\n두 방법의 최대 차이: {diff:.2e}   ← 0에 매우 가까우면 일치")`,
    },
    {
      type: "markdown",
      source: `> 💡 sklearn PCA 가 부호를 뒤집는 경우가 있어요 (수학적으로 \`+v\` 도 \`-v\` 도 같은 주축 — 분산은 같음).
> 그래서 절대값으로 비교하거나, 시각화 결과만 **좌우 반전** 되어 보일 수 있습니다.`,
    },
    {
      type: "markdown",
      source: `## 🌸 iris 를 2D 로 시각화 — 본격 차원 축소의 맛

4차원 iris 를 **PC1, PC2 평면** 에 뿌리면 3 종이 눈으로 갈라지는지 확인해봅시다.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt

plt.figure(figsize=(7, 5))

colors = ["#e74c3c", "#2ecc71", "#3498db"]
markers = ["o", "s", "^"]

for i, species in enumerate(target_names):
    mask = y == i
    plt.scatter(
        scores_sklearn[mask, 0],
        scores_sklearn[mask, 1],
        c=colors[i], marker=markers[i],
        label=species, s=60, alpha=0.75, edgecolor="white"
    )

plt.xlabel(f"PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)")
plt.ylabel(f"PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)")
plt.title("Iris — 4차원 꽃을 2D 평면에 투영")
plt.legend(title="종")
plt.grid(alpha=0.3)
plt.tight_layout()`,
    },
    {
      type: "markdown",
      source: `> 🔎 관찰 포인트:
> - **setosa (빨강)** 가 왼쪽에 뚜렷하게 분리 — 선형 분류기로도 쉬움
> - **versicolor / virginica** 는 일부 겹침 — 두 종은 세밀한 차이로 구별
> - 가로축(PC1) 이 세로축(PC2) 보다 훨씬 더 넓게 퍼져 있음 — 설명 분산 차이를 눈으로 확인
>
> 이 그림 하나가 "왜 PCA 가 20세기 통계학의 히트작인가" 를 설명해줍니다.`,
    },
    {
      type: "markdown",
      source: `## 🏹 Loadings — 원래 특성이 어느 PC 에 기여했나

\`VT\` 의 첫 두 행이 **PC1, PC2 의 방향벡터** 입니다. 각 성분은 원 특성이 얼마나 기여하는지를 나타내요.`,
    },
    {
      type: "code",
      source: `loadings = VT[:2].T   # shape (4, 2) — 특성별 (PC1 기여, PC2 기여)

print(f"{'특성':<25} {'PC1':>8} {'PC2':>8}")
print("-" * 45)
for name, (l1, l2) in zip(feature_names, loadings):
    print(f"{name:<25} {l1:>+8.3f} {l2:>+8.3f}")

# 같은 정보를 sklearn 의 components_ 에서도 얻을 수 있음
print(f"\\nsklearn pca.components_ (부호만 다를 수 있음):")
for i, comp in enumerate(pca.components_, 1):
    print(f"  PC{i}: {comp.round(3)}")`,
    },
    {
      type: "code",
      source: `# Biplot: scores 산점도 위에 loading 화살표 오버레이
fig, ax = plt.subplots(figsize=(7, 5))

for i, species in enumerate(target_names):
    mask = y == i
    ax.scatter(scores_sklearn[mask, 0], scores_sklearn[mask, 1],
               c=colors[i], marker=markers[i], s=40, alpha=0.5,
               label=species, edgecolor="white")

# loading 벡터를 데이터 스케일에 맞춰 증폭
scale = 3.0
for name, (l1, l2) in zip(feature_names, loadings):
    ax.arrow(0, 0, l1 * scale, l2 * scale,
             head_width=0.08, color="black", length_includes_head=True)
    ax.text(l1 * scale * 1.15, l2 * scale * 1.15, name,
            fontsize=9, ha="center", color="black")

ax.axhline(0, color="gray", lw=0.5)
ax.axvline(0, color="gray", lw=0.5)
ax.set_xlabel(f"PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)")
ax.set_ylabel(f"PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)")
ax.set_title("Iris PCA Biplot — 점 + loading 화살표")
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()`,
    },
    {
      type: "markdown",
      source: `> 📚 **Biplot 읽는 법**:
> - **화살표 방향** — 그 특성이 증가하는 방향
> - **화살표 길이** — PC1/PC2 에 대한 기여도 (길수록 중요)
> - **petal length / petal width** 가 PC1 에 크게 기여 (가로 방향으로 뻗음) → 종 구별의 주역
> - **sepal width** 는 PC2 방향 (세로) — 종 구별에는 PC1 만큼 결정적이지 않음
>
> 이 관찰이 바로 **lec05 에서 본 "petal 계열이 중요하다"** 와 일치합니다. DT 의 feature_importances 와 PCA 가 같은 결론!`,
    },
    {
      type: "markdown",
      source: `## ⚠️ PCA 의 함정 3가지

1. **표준화 필수** — 스케일 큰 특성이 분산을 독점. \`StandardScaler\` 안 하면 PCA 결과 왜곡
2. **선형 관계만** — 곡선 형태의 구조는 못 잡음 (비선형은 Kernel PCA, t-SNE, UMAP)
3. **해석 어려움** — PC1 은 원 특성들의 **가중 합** — "PC1 = 0.52·petal_length + 0.58·petal_width + ..." 같은 식. 의미는 loadings 로 해석 가능하지만 직관적이진 않음`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 — wine 데이터를 2D 로 압축

\`load_wine()\` (샘플 178, 특성 **13개**, 3 클래스) 를 PCA 로 **2D 시각화** 하고 설명 분산 비율을 확인하세요.

**조건:**
1. StandardScaler 로 표준화
2. PCA(n_components=2) 로 변환
3. PC1 vs PC2 산점도 출력 (클래스별 색)
4. 설명 분산 비율과 누적 비율 출력
5. 만약 누적 **95%** 를 만족하려면 PC 가 몇 개 필요한지도 계산`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import load_wine
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import numpy as np

wine = load_wine()
X, y = wine.data, wine.target

# 여기에 코드를 작성하세요
`,
      hints: [
        "X_scaled = StandardScaler().fit_transform(X) — PCA 전 반드시 표준화",
        "PCA(n_components=2) 로 2D 시각화, 별도로 PCA() 전체를 fit 해서 누적 분산 계산",
        "np.cumsum(pca_full.explained_variance_ratio_) >= 0.95 를 찾으면 최소 PC 개수",
        "산점도: for c in [0,1,2]: plt.scatter(scores[y==c, 0], scores[y==c, 1], label=wine.target_names[c])",
      ],
      solution: `from sklearn.datasets import load_wine
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import numpy as np

wine = load_wine()
X, y = wine.data, wine.target

# 1) 표준화
X_scaled = StandardScaler().fit_transform(X)

# 2) 전체 PCA — 누적 분산 분석용
pca_full = PCA().fit(X_scaled)
cum = np.cumsum(pca_full.explained_variance_ratio_)

print(f"{'PC':>4} {'비율':>8} {'누적':>8}")
for i, (r, c) in enumerate(zip(pca_full.explained_variance_ratio_, cum), 1):
    marker = " ← 95%↑" if c >= 0.95 and cum[i-2 if i>1 else 0] < 0.95 else ""
    print(f"PC{i:>2} {r:>7.1%} {c:>7.1%}{marker}")

n95 = int(np.searchsorted(cum, 0.95)) + 1
print(f"\\n→ 누적 95% 를 넘기려면 최소 PC {n95} 개 필요")

# 3) 2D 시각화
pca2 = PCA(n_components=2)
scores = pca2.fit_transform(X_scaled)

plt.figure(figsize=(7, 5))
colors = ["#e74c3c", "#2ecc71", "#3498db"]
for i, name in enumerate(wine.target_names):
    mask = y == i
    plt.scatter(scores[mask, 0], scores[mask, 1],
                c=colors[i], label=name, alpha=0.75, edgecolor="white", s=50)

plt.xlabel(f"PC1 ({pca2.explained_variance_ratio_[0]*100:.1f}%)")
plt.ylabel(f"PC2 ({pca2.explained_variance_ratio_[1]*100:.1f}%)")
plt.title(f"Wine PCA — 13D → 2D (누적 {pca2.explained_variance_ratio_.sum()*100:.1f}%)")
plt.legend()
plt.grid(alpha=0.3)
plt.tight_layout()`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 11 완료

- ✅ **차원의 저주** 와 차원 축소의 동기
- ✅ **SVD 직접 구현** 으로 PCA 를 블랙박스에서 꺼내봤음
- ✅ **sklearn.PCA** 와의 일치 확인
- ✅ **설명 분산 비율** 로 정보 보존 정도 판단
- ✅ **Loadings / Biplot** 으로 특성 기여도 해석
- ✅ iris 4D → 2D, wine 13D → 2D 실전 시각화

### 다음 스텝
- **t-SNE / UMAP** — 비선형 차원 축소 (Kaggle·논문의 단골 시각화)
- **Kernel PCA** — 커널 트릭으로 비선형 구조 포착
- **Autoencoder** — 신경망 기반 차원 축소 (Ch15 CNN 이후)`,
    },
    { type: "code", source: `# 자유 실험 영역 — digits(64D → 2D) 로 해보기 같은 것도 재밌어요\n` },
  ],
  quiz: {
    title: "챕터 11 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "PCA 를 수행하기 전 일반적으로 StandardScaler 를 적용하는 이유는?",
        options: [
          "계산 속도를 빠르게 하기 위해",
          "PCA 는 분산 기반이라 스케일이 큰 특성이 주성분을 독점하기 때문",
          "PCA 가 음수 값을 처리하지 못해서",
          "sklearn 이 표준화를 요구하는 내부 검증이 있어서",
        ],
        correctIndex: 1,
        explanation:
          "PCA 는 분산이 가장 큰 방향을 찾는데, 표준화하지 않으면 값 범위가 큰 특성(예: proline 수백 단위)이 분산을 지배해 다른 특성이 무시됩니다.",
      },
      {
        type: "multiple-choice",
        question: "`explained_variance_ratio_` 의 합이 0.86 이라는 것은?",
        options: [
          "모델 정확도가 86%",
          "현재 선택한 주성분들이 원 데이터 변동의 86% 를 설명한다",
          "86% 의 데이터가 학습에 사용됨",
          "PC1 이 86%",
        ],
        correctIndex: 1,
        explanation:
          "설명 분산 비율은 '이 주성분들로 원 데이터의 변동을 얼마나 보존하는가' 를 뜻합니다. 0.86 이면 14% 정보 손실.",
      },
      {
        type: "predict-output",
        question: "다음 코드의 출력은?",
        code: `import numpy as np
from sklearn.decomposition import PCA
X = np.array([[1, 2], [2, 4], [3, 6], [4, 8]], dtype=float)
pca = PCA(n_components=2)
pca.fit(X)
print(pca.explained_variance_ratio_.round(2))`,
        options: [
          "[1.   0.  ]",
          "[0.5  0.5 ]",
          "[0.75 0.25]",
          "[0.   1.  ]",
        ],
        correctIndex: 0,
        explanation:
          "두 특성이 완벽히 선형 관계 (y = 2x) 라 분산이 단 하나의 방향에 몰려 있습니다. PC1 이 100% 설명, PC2 는 0%.",
      },
      {
        type: "multiple-choice",
        question: "Loadings (주축 벡터) 에 대한 올바른 설명은?",
        options: [
          "각 샘플의 새 좌표 (scores) 와 같은 말이다",
          "각 원 특성이 해당 주성분에 기여하는 가중치 (방향·크기)",
          "각 주성분의 설명 분산 비율",
          "PCA 에서 사용된 샘플 수",
        ],
        correctIndex: 1,
        explanation:
          "Loadings 는 V 의 열벡터 (또는 sklearn 의 components_) 로, 원 특성이 새 주성분 축에 얼마나·어느 방향으로 기여하는지를 나타냅니다. biplot 의 화살표가 바로 이 값.",
      },
    ],
  } satisfies Quiz,
};
