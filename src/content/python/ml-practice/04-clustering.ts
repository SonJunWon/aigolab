import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson04: Lesson = {
  id: "python-ml-04",
  language: "python",
  track: "ml-practice" as any,
  order: 4,
  title: "클러스터링 — 비슷한 것끼리 묶기",
  subtitle: "정답 없이 데이터를 그룹으로 나누는 비지도 학습을 배워봅시다",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 🔵 클러스터링 — 비슷한 것끼리 묶기

지금까지는 정답(label)이 있는 **지도 학습**을 했습니다.
이번에는 정답 없이 데이터를 그룹으로 나누는 **비지도 학습(Unsupervised Learning)**을 배웁니다!

이번 챕터에서 배울 것:
- **KMeans**: 가장 기본적인 클러스터링 알고리즘
- **엘보우 방법**: 최적의 클러스터 수(K) 찾기
- **실루엣 점수**: 클러스터링 품질 평가`,
    },
    {
      type: "markdown",
      source: `## 🔧 라이브러리 준비`,
    },
    {
      type: "code",
      source: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score

print("준비 완료!")`,
    },
    {
      type: "markdown",
      source: `## 🎯 샘플 데이터 만들기

\`make_blobs\`로 뚜렷한 그룹이 있는 데이터를 생성합니다.`,
    },
    {
      type: "code",
      source: `# 3개 그룹, 2차원 데이터
X, y_true = make_blobs(n_samples=300, centers=3, cluster_std=1.0, random_state=42)

print(f"데이터 크기: {X.shape}")
print(f"X 범위: [{X.min():.1f}, {X.max():.1f}]")
print(f"실제 그룹: {np.bincount(y_true)}")`,
    },
    {
      type: "markdown",
      source: `## 🔵 KMeans 클러스터링

KMeans는 K개의 중심점(centroid)을 정하고, 각 데이터를 가장 가까운 중심점에 배정합니다.
이 과정을 반복하여 최적의 그룹을 찾습니다.`,
    },
    {
      type: "code",
      source: `# KMeans로 3개 그룹 찾기
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(X)

labels = kmeans.labels_
centers = kmeans.cluster_centers_

print(f"클러스터별 샘플 수: {np.bincount(labels)}")
print(f"\\n중심점 좌표:")
for i, c in enumerate(centers):
    print(f"  클러스터 {i}: ({c[0]:.2f}, {c[1]:.2f})")

print(f"\\nInertia (클러스터 내 거리 합): {kmeans.inertia_:.2f}")`,
    },
    {
      type: "markdown",
      source: `## 📐 엘보우 방법 (Elbow Method)

K를 몇으로 해야 할까요? **엘보우 방법**은 K를 변화시키며 **inertia**(클러스터 내 거리 합)를 관찰합니다.
inertia가 급격히 줄어들다가 완만해지는 지점(팔꿈치 모양)이 최적의 K입니다.`,
    },
    {
      type: "code",
      source: `inertias = []
K_range = range(1, 8)

for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append(km.inertia_)

print("K | Inertia")
print("-" * 20)
for k, inertia in zip(K_range, inertias):
    bar = "█" * int(inertia / max(inertias) * 30)
    print(f"{k} | {inertia:8.1f} {bar}")

print("\\n→ K=3에서 inertia가 크게 줄어든 후 완만해지는 것을 확인하세요!")`,
    },
    {
      type: "markdown",
      source: `## 📊 실루엣 점수 (Silhouette Score)

**실루엣 점수**는 각 데이터가 자기 클러스터에 얼마나 잘 속해 있는지를 측정합니다.
- **1에 가까움**: 매우 잘 분리됨
- **0 근처**: 경계에 있음
- **-1에 가까움**: 잘못된 클러스터에 배정됨`,
    },
    {
      type: "code",
      source: `for k in range(2, 6):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X)
    sil = silhouette_score(X, labels)
    print(f"K={k}: 실루엣 점수 = {sil:.4f}")

print("\\n→ 실루엣 점수가 가장 높은 K가 최적입니다!")`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 1: 고객 세분화

\`make_blobs\`로 고객 데이터(4개 그룹)를 시뮬레이션하고,
KMeans로 클러스터링한 뒤 각 클러스터의 중심점과 실루엣 점수를 출력하세요.

**조건:**
- make_blobs: 400샘플, 4그룹, 특성 3개, cluster_std=1.5, random_state=0
- KMeans: n_clusters=4, random_state=0, n_init=10
- 각 클러스터의 중심점과 실루엣 점수 출력`,
    },
    {
      type: "code",
      source: `# Mission 1: 여기에 코드를 작성하세요
# 1) make_blobs로 데이터 생성
# 2) KMeans(n_clusters=4) 학습
# 3) 각 클러스터 중심점 출력
# 4) 실루엣 점수 출력

`,
      hints: [
        "make_blobs(n_samples=400, centers=4, n_features=3, cluster_std=1.5, random_state=0)",
        "kmeans.cluster_centers_로 중심점을 확인할 수 있습니다",
        "silhouette_score(X, kmeans.labels_)로 실루엣 점수를 계산하세요",
      ],
      solution: `from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

# 1) 데이터 생성
X, _ = make_blobs(n_samples=400, centers=4, n_features=3, cluster_std=1.5, random_state=0)

# 2) KMeans 학습
kmeans = KMeans(n_clusters=4, random_state=0, n_init=10)
kmeans.fit(X)

# 3) 중심점 출력
print("=== 고객 세그먼트 중심점 ===")
for i, center in enumerate(kmeans.cluster_centers_):
    count = (kmeans.labels_ == i).sum()
    print(f"세그먼트 {i}: {np.round(center, 2)} (고객 {count}명)")

# 4) 실루엣 점수
sil = silhouette_score(X, kmeans.labels_)
print(f"\\n실루엣 점수: {sil:.4f}")`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 2: 최적 K 찾기

\`make_blobs\`로 데이터를 만든 뒤 (실제 그룹 수는 비공개!),
엘보우 방법과 실루엣 점수를 함께 사용하여 최적의 K를 찾으세요.

**조건:**
- make_blobs(n_samples=500, centers=5, cluster_std=1.2, random_state=7)
- K=2~8까지 inertia와 실루엣 점수를 모두 계산
- 최적 K를 출력`,
    },
    {
      type: "code",
      source: `# Mission 2: 여기에 코드를 작성하세요
# 1) make_blobs로 데이터 생성
# 2) K=2~8까지 inertia와 실루엣 점수 계산
# 3) 가장 높은 실루엣 점수의 K를 최적 K로 출력

`,
      hints: [
        "for k in range(2, 9)로 반복하세요 (실루엣 점수는 K>=2부터 계산 가능)",
        "inertia와 silhouette_score를 둘 다 리스트에 저장하세요",
        "실루엣 점수가 가장 높은 K를 np.argmax로 찾으세요",
      ],
      solution: `from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

# 1) 데이터 생성
X, _ = make_blobs(n_samples=500, centers=5, cluster_std=1.2, random_state=7)

# 2) K=2~8 분석
K_range = range(2, 9)
inertias = []
sil_scores = []

print("K | Inertia    | 실루엣 점수")
print("-" * 35)
for k in K_range:
    km = KMeans(n_clusters=k, random_state=0, n_init=10)
    labels = km.fit_predict(X)
    inertias.append(km.inertia_)
    sil = silhouette_score(X, labels)
    sil_scores.append(sil)
    print(f"{k} | {km.inertia_:10.1f} | {sil:.4f}")

# 3) 최적 K
best_k = list(K_range)[np.argmax(sil_scores)]
print(f"\\n최적 K: {best_k} (실루엣 점수: {max(sil_scores):.4f})")`,
    },
  ],
  quiz: {
    title: "클러스터링 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "KMeans 클러스터링은 어떤 종류의 학습인가요?",
        options: [
          "지도 학습 (Supervised Learning)",
          "비지도 학습 (Unsupervised Learning)",
          "강화 학습 (Reinforcement Learning)",
          "반지도 학습 (Semi-supervised Learning)",
        ],
        correctIndex: 1,
        explanation:
          "KMeans는 정답 레이블 없이 데이터의 패턴만으로 그룹을 나누는 비지도 학습(Unsupervised Learning) 알고리즘입니다.",
      },
      {
        type: "multiple-choice",
        question: "엘보우 방법에서 inertia가 의미하는 것은?",
        options: [
          "클러스터의 개수",
          "각 데이터와 가장 가까운 중심점 사이 거리의 총합",
          "정확도",
          "클러스터 간의 거리",
        ],
        correctIndex: 1,
        explanation:
          "Inertia는 각 데이터 포인트와 소속 클러스터 중심점 사이 거리의 제곱합입니다. 작을수록 클러스터 내 데이터가 밀집되어 있습니다.",
      },
      {
        type: "predict-output",
        question: "다음 코드의 출력은?",
        code: `from sklearn.cluster import KMeans
import numpy as np
X = np.array([[0, 0], [0, 1], [10, 10], [10, 11]])
km = KMeans(n_clusters=2, random_state=0, n_init=10).fit(X)
print(sorted(np.bincount(km.labels_)))`,
        options: ["[1, 3]", "[2, 2]", "[0, 4]", "[1, 1, 2]"],
        correctIndex: 1,
        explanation:
          "데이터가 (0,0)/(0,1) 그룹과 (10,10)/(10,11) 그룹으로 뚜렷이 나뉘므로, 각 클러스터에 2개씩 배정됩니다.",
      },
      {
        type: "multiple-choice",
        question: "실루엣 점수가 -0.2라면 어떤 의미인가요?",
        options: [
          "클러스터링이 잘 되었다",
          "데이터가 경계에 있다",
          "일부 데이터가 잘못된 클러스터에 배정되었을 가능성이 높다",
          "클러스터 수가 너무 적다",
        ],
        correctIndex: 2,
        explanation:
          "실루엣 점수가 음수이면 해당 데이터가 다른 클러스터에 더 가까이 있다는 뜻으로, 잘못된 클러스터에 배정되었을 가능성이 높습니다.",
      },
    ],
  } satisfies Quiz,
};
