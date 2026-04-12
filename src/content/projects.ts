/**
 * ML 미니 프로젝트 데이터.
 */

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  difficulty: "beginner" | "intermediate";
  estimatedMinutes: number;
  tags: string[];
  description: string;  // 마크다운
  steps: string[];      // 단계별 가이드
  starterFiles: Record<string, { name: string; content: string; language: string }>;
}

export const PROJECTS: Project[] = [
  {
    id: "iris-classification",
    title: "아이리스 꽃 분류",
    subtitle: "첫 번째 머신러닝 모델 만들기",
    icon: "🌸",
    difficulty: "beginner",
    estimatedMinutes: 30,
    tags: ["scikit-learn", "분류", "입문"],
    description: `## 🌸 아이리스 꽃 분류 프로젝트

**목표**: 꽃잎과 꽃받침의 크기를 보고 아이리스 꽃의 종류를 예측하는 ML 모델을 만듭니다.

이 프로젝트는 머신러닝의 "Hello World"와 같습니다.
scikit-learn의 내장 데이터셋을 사용하며, 브라우저에서 바로 실행됩니다.

### 배울 것
- 데이터셋 로드 및 탐색
- 훈련/테스트 데이터 분할
- 분류 모델 학습 (Decision Tree)
- 모델 정확도 평가`,
    steps: [
      "데이터셋 로드: sklearn.datasets.load_iris()",
      "데이터 탐색: 특성 이름, 클래스, 샘플 수 확인",
      "훈련/테스트 분할: train_test_split (80:20)",
      "모델 학습: DecisionTreeClassifier",
      "예측 및 정확도 평가: accuracy_score",
      "새 데이터로 예측 테스트",
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🌸 아이리스 꽃 분류 프로젝트
# 아래 단계를 따라 코드를 완성하세요.

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# 1. 데이터 로드
iris = load_iris()
print(f"특성 이름: {iris.feature_names}")
print(f"클래스: {iris.target_names}")
print(f"데이터 크기: {iris.data.shape}")

# 2. 훈련/테스트 분할
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)
print(f"\\n훈련 데이터: {X_train.shape[0]}개")
print(f"테스트 데이터: {X_test.shape[0]}개")

# 3. 모델 학습
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
print("\\n모델 학습 완료!")

# 4. 예측 및 평가
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"정확도: {accuracy:.2%}")

# 5. 새 데이터로 예측
new_flower = [[5.1, 3.5, 1.4, 0.2]]
prediction = model.predict(new_flower)
print(f"\\n새 꽃 예측: {iris.target_names[prediction[0]]}")
`,
        language: "python",
      },
    },
  },
  {
    id: "titanic-survival",
    title: "타이타닉 생존자 예측",
    subtitle: "데이터 전처리부터 모델링까지",
    icon: "🚢",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    tags: ["pandas", "scikit-learn", "분류", "전처리"],
    description: `## 🚢 타이타닉 생존자 예측 프로젝트

**목표**: 타이타닉 승객 데이터를 분석하고, 생존 여부를 예측하는 모델을 만듭니다.

유명한 Kaggle 데이터 분석 입문 프로젝트입니다.
실제 데이터를 시뮬레이션하여 브라우저에서 실행합니다.

### 배울 것
- Pandas로 데이터 탐색 (EDA)
- 결측값 처리, 특성 엔지니어링
- 여러 모델 비교 (Decision Tree, Random Forest)
- 모델 성능 평가`,
    steps: [
      "시뮬레이션 데이터 생성 (실제 타이타닉 데이터 기반)",
      "데이터 탐색: describe(), info(), 생존율 분석",
      "결측값 처리: 나이 중앙값 대체",
      "특성 엔지니어링: 성별 인코딩, 불필요 컬럼 제거",
      "모델 학습: DecisionTree vs RandomForest",
      "정확도 비교 및 특성 중요도 분석",
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🚢 타이타닉 생존자 예측 프로젝트
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# 1. 시뮬레이션 데이터 생성
np.random.seed(42)
n = 200
data = pd.DataFrame({
    "Pclass": np.random.choice([1, 2, 3], n, p=[0.2, 0.3, 0.5]),
    "Sex": np.random.choice(["male", "female"], n),
    "Age": np.random.normal(30, 12, n).clip(1, 80).round(),
    "SibSp": np.random.choice([0, 1, 2, 3], n, p=[0.6, 0.2, 0.1, 0.1]),
    "Fare": np.random.exponential(30, n).round(2),
})
# 생존 확률: 여성, 1등석, 젊은 나이일수록 높음
survival_prob = (
    (data["Sex"] == "female").astype(float) * 0.4 +
    (data["Pclass"] == 1).astype(float) * 0.2 +
    (data["Age"] < 18).astype(float) * 0.15 +
    np.random.normal(0.2, 0.1, n)
).clip(0, 1)
data["Survived"] = (survival_prob > 0.5).astype(int)

print("=== 데이터 미리보기 ===")
print(data.head(10))
print(f"\\n전체: {len(data)}명, 생존: {data['Survived'].sum()}명 ({data['Survived'].mean():.1%})")

# 2. 특성 엔지니어링
data["Sex_encoded"] = (data["Sex"] == "female").astype(int)
features = ["Pclass", "Sex_encoded", "Age", "SibSp", "Fare"]

X = data[features]
y = data["Survived"]

# 3. 훈련/테스트 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. 모델 비교
models = {
    "Decision Tree": DecisionTreeClassifier(max_depth=5, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42),
}

print("\\n=== 모델 비교 ===")
for name, model in models.items():
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    acc = accuracy_score(y_test, pred)
    print(f"{name}: 정확도 {acc:.2%}")

# 5. 특성 중요도 (Random Forest)
rf = models["Random Forest"]
importance = pd.Series(rf.feature_importances_, index=features).sort_values(ascending=False)
print("\\n=== 특성 중요도 ===")
for feat, imp in importance.items():
    bar = "█" * int(imp * 30)
    print(f"{feat:15s} {bar} {imp:.3f}")
`,
        language: "python",
      },
    },
  },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
