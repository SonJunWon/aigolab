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
  {
    id: "movie-recommendation",
    title: "영화 추천 시스템",
    subtitle: "콘텐츠 기반 추천 알고리즘 만들기",
    icon: "🎬",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    tags: ["pandas", "cosine similarity", "추천"],
    description: `## 🎬 영화 추천 시스템 프로젝트

**목표**: 영화 장르 정보를 활용하여 콘텐츠 기반 추천 시스템을 만듭니다.

사용자가 좋아하는 영화를 입력하면, 장르 유사도를 계산하여
가장 비슷한 영화를 추천해주는 시스템입니다.

### 배울 것
- Pandas DataFrame으로 영화 데이터 구성
- 장르 원-핫 인코딩
- 코사인 유사도 계산
- 유사도 기반 영화 추천`,
    steps: [
      "영화 데이터 생성: 제목, 장르 정보를 DataFrame으로 구성",
      "장르 원-핫 인코딩: 각 장르를 0/1 벡터로 변환",
      "코사인 유사도 함수 구현: 두 벡터 간 유사도 계산",
      "유사도 행렬 생성: 모든 영화 쌍의 유사도 계산",
      "추천 함수 구현: 입력 영화와 가장 유사한 영화 N개 반환",
      "다양한 영화로 추천 테스트 및 결과 분석",
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🎬 영화 추천 시스템 프로젝트
# 장르 유사도를 기반으로 영화를 추천합니다.

import numpy as np
import pandas as pd

# 1. 영화 데이터 생성
movies = pd.DataFrame({
    "title": [
        "인셉션", "인터스텔라", "다크나이트", "어벤져스",
        "아이언맨", "겨울왕국", "토이스토리", "코코",
        "기생충", "올드보이", "부산행", "반지의 제왕",
        "해리포터", "스파이더맨", "라라랜드", "위플래쉬",
    ],
    "genres": [
        "액션,SF,스릴러", "SF,드라마,모험", "액션,스릴러,범죄", "액션,SF,모험",
        "액션,SF,모험", "애니메이션,판타지,뮤지컬", "애니메이션,코미디,가족", "애니메이션,판타지,음악",
        "드라마,스릴러,코미디", "스릴러,드라마,미스터리", "액션,스릴러,공포", "판타지,모험,액션",
        "판타지,모험,가족", "액션,SF,모험", "드라마,뮤지컬,로맨스", "드라마,음악",
    ],
})

print("=== 영화 데이터 ===")
print(movies.to_string(index=False))

# 2. 장르 원-핫 인코딩
all_genres = set()
for g in movies["genres"]:
    all_genres.update(g.split(","))
all_genres = sorted(all_genres)

print(f"\\n전체 장르 목록 ({len(all_genres)}개): {all_genres}")

genre_matrix = np.zeros((len(movies), len(all_genres)))
for i, g in enumerate(movies["genres"]):
    for genre in g.split(","):
        genre_matrix[i, all_genres.index(genre)] = 1

# 3. 코사인 유사도 계산
def cosine_similarity(a, b):
    """두 벡터 간 코사인 유사도를 계산합니다."""
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

# 4. 유사도 행렬 생성
n = len(movies)
similarity_matrix = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        similarity_matrix[i, j] = cosine_similarity(genre_matrix[i], genre_matrix[j])

print("\\n=== 유사도 행렬 (상위 5x5) ===")
sim_df = pd.DataFrame(similarity_matrix, index=movies["title"], columns=movies["title"])
print(sim_df.iloc[:5, :5].round(2).to_string())

# 5. 추천 함수
def recommend(title, top_n=5):
    """입력 영화와 가장 유사한 영화를 추천합니다."""
    if title not in movies["title"].values:
        print(f"'{title}'을(를) 찾을 수 없습니다.")
        return
    idx = movies[movies["title"] == title].index[0]
    scores = list(enumerate(similarity_matrix[idx]))
    # 자기 자신 제외, 유사도 높은 순 정렬
    scores = [(i, s) for i, s in scores if i != idx]
    scores.sort(key=lambda x: x[1], reverse=True)

    print(f"\\n'{title}' 장르: {movies.iloc[idx]['genres']}")
    print(f"--- 추천 영화 TOP {top_n} ---")
    for rank, (i, score) in enumerate(scores[:top_n], 1):
        print(f"  {rank}. {movies.iloc[i]['title']} (유사도: {score:.2f}) - {movies.iloc[i]['genres']}")

# 6. 추천 테스트
recommend("인셉션")
recommend("겨울왕국")
recommend("기생충")
`,
        language: "python",
      },
    },
  },
  {
    id: "digit-recognition",
    title: "손글씨 숫자 인식",
    subtitle: "이미지 분류 모델 만들기",
    icon: "🔢",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    tags: ["scikit-learn", "분류", "MNIST"],
    description: `## 🔢 손글씨 숫자 인식 프로젝트

**목표**: 8x8 픽셀 손글씨 숫자 이미지를 인식하는 분류 모델을 만듭니다.

sklearn에 내장된 digits 데이터셋(0~9 숫자, 8x8 이미지)을 사용합니다.
SVM 분류기를 학습시켜 손글씨 숫자를 자동으로 판별합니다.

### 배울 것
- 이미지 데이터의 구조 이해 (8x8 픽셀)
- 데이터 전처리 및 시각화
- SVM(Support Vector Machine) 분류기 학습
- 혼동 행렬을 통한 모델 성능 분석`,
    steps: [
      "데이터 로드: sklearn.datasets.load_digits()",
      "데이터 탐색: 이미지 형태, 클래스 분포 확인",
      "이미지 시각화: 텍스트 기반으로 숫자 이미지 출력",
      "훈련/테스트 분할 및 SVM 모델 학습",
      "정확도 평가 및 혼동 행렬 분석",
      "개별 숫자 예측 테스트 및 오분류 사례 확인",
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🔢 손글씨 숫자 인식 프로젝트
# 8x8 픽셀 이미지를 분류하는 SVM 모델을 만듭니다.

import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# 1. 데이터 로드
digits = load_digits()
print("=== 데이터셋 정보 ===")
print(f"이미지 개수: {len(digits.images)}")
print(f"이미지 크기: {digits.images[0].shape} (8x8 픽셀)")
print(f"클래스: {digits.target_names}")
print(f"특성 수: {digits.data.shape[1]} (8x8 = 64)")

# 2. 클래스별 분포 확인
print("\\n=== 클래스별 샘플 수 ===")
unique, counts = np.unique(digits.target, return_counts=True)
for digit, count in zip(unique, counts):
    bar = "█" * (count // 5)
    print(f"  숫자 {digit}: {count}개 {bar}")

# 3. 이미지 시각화 (텍스트 기반)
def show_digit(image, label):
    """8x8 이미지를 텍스트로 시각화합니다."""
    chars = " .:-=+*#%@"
    print(f"--- 숫자: {label} ---")
    for row in image:
        line = ""
        for pixel in row:
            idx = min(int(pixel / 16 * len(chars)), len(chars) - 1)
            line += chars[idx] * 2
        print(line)

print("\\n=== 샘플 이미지 ===")
for i in range(3):
    show_digit(digits.images[i], digits.target[i])
    print()

# 4. 훈련/테스트 분할 및 모델 학습
X_train, X_test, y_train, y_test = train_test_split(
    digits.data, digits.target, test_size=0.2, random_state=42
)
print(f"훈련 데이터: {len(X_train)}개, 테스트 데이터: {len(X_test)}개")

# SVM 분류기 학습
model = SVC(kernel="rbf", gamma="scale", random_state=42)
model.fit(X_train, y_train)
print("SVM 모델 학습 완료!")

# 5. 예측 및 평가
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"\\n=== 모델 성능 ===")
print(f"정확도: {accuracy:.2%}")

print("\\n=== 분류 보고서 ===")
print(classification_report(y_test, predictions, target_names=[str(i) for i in range(10)]))

# 혼동 행렬
cm = confusion_matrix(y_test, predictions)
print("=== 혼동 행렬 ===")
print("예측 →  ", "  ".join(f"{i}" for i in range(10)))
for i, row in enumerate(cm):
    print(f"실제 {i}: ", "  ".join(f"{v:2d}" if v > 0 else " ." for v in row))

# 6. 오분류 사례 확인
wrong = np.where(predictions != y_test)[0]
print(f"\\n=== 오분류 사례 ({len(wrong)}개) ===")
for idx in wrong[:5]:
    print(f"  실제: {y_test[idx]}, 예측: {predictions[idx]}")
    show_digit(X_test[idx].reshape(8, 8), f"실제={y_test[idx]}, 예측={predictions[idx]}")
    print()
`,
        language: "python",
      },
    },
  },
  {
    id: "sentiment-analysis",
    title: "감성 분석기",
    subtitle: "텍스트의 감정을 판별하는 프로그램",
    icon: "💬",
    difficulty: "beginner",
    estimatedMinutes: 30,
    tags: ["NLP", "분류", "텍스트"],
    description: `## 💬 감성 분석기 프로젝트

**목표**: 텍스트에 담긴 감정(긍정/부정/중립)을 판별하는 프로그램을 만듭니다.

별도의 ML 라이브러리 없이 순수 파이썬만으로 구현합니다.
긍정/부정 키워드 사전을 활용한 규칙 기반 감성 분석입니다.

### 배울 것
- 텍스트 전처리 (토큰화, 정규화)
- 키워드 기반 감성 점수 계산
- 부정어 처리 ("안 좋다" → 부정)
- 분석 결과 시각화 및 정확도 평가`,
    steps: [
      "긍정/부정 키워드 사전 구축",
      "텍스트 전처리: 공백 분리, 소문자 변환",
      "감성 점수 계산 함수 구현",
      "부정어(안, 못, 없) 처리 로직 추가",
      "테스트 문장으로 감성 분석 실행",
      "정답 레이블과 비교하여 정확도 평가",
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 💬 감성 분석기 프로젝트
# 키워드 기반으로 텍스트의 감정을 분석합니다.

# 1. 긍정/부정 키워드 사전 구축
positive_words = {
    "좋다", "좋아", "좋은", "훌륭", "최고", "멋진", "멋지다",
    "행복", "기쁘다", "기쁜", "만족", "추천", "사랑", "감동",
    "재미있다", "재밌다", "재밌는", "유익", "편리", "깨끗",
    "친절", "맛있다", "맛있는", "완벽", "대박", "굿", "짱",
    "감사", "예쁜", "예쁘다", "뛰어난", "우수", "즐거운",
}

negative_words = {
    "나쁘다", "나쁜", "싫다", "싫은", "별로", "최악", "짜증",
    "실망", "불만", "불편", "화나다", "화난", "슬프다", "슬픈",
    "지루하다", "지루한", "아쉽다", "아쉬운", "힘들다", "어렵다",
    "비싸다", "비싼", "느리다", "느린", "더럽다", "불친절",
    "맛없다", "맛없는", "후회", "망", "거짓", "부족",
}

# 부정어 목록 (뒤에 오는 감성을 반전시킴)
negation_words = {"안", "못", "없다", "없는", "아니", "절대"}

print(f"긍정 키워드: {len(positive_words)}개")
print(f"부정 키워드: {len(negative_words)}개")
print(f"부정어: {len(negation_words)}개")

# 2. 텍스트 전처리
def tokenize(text):
    """텍스트를 단어 단위로 분리합니다."""
    # 간단한 공백 기반 토큰화
    tokens = text.strip().split()
    return tokens

# 3. 감성 점수 계산
def analyze_sentiment(text):
    """텍스트의 감성 점수를 계산합니다.
    양수: 긍정, 음수: 부정, 0: 중립
    """
    tokens = tokenize(text)
    score = 0
    details = []

    for i, token in enumerate(tokens):
        # 이전 단어가 부정어인지 확인
        is_negated = i > 0 and tokens[i - 1] in negation_words

        if token in positive_words:
            if is_negated:
                score -= 1  # 부정어 + 긍정 = 부정
                details.append(f"  '{tokens[i-1]} {token}' → -1 (부정어 반전)")
            else:
                score += 1
                details.append(f"  '{token}' → +1 (긍정)")
        elif token in negative_words:
            if is_negated:
                score += 1  # 부정어 + 부정 = 긍정
                details.append(f"  '{tokens[i-1]} {token}' → +1 (부정어 반전)")
            else:
                score -= 1
                details.append(f"  '{token}' → -1 (부정)")

    # 감성 레이블 결정
    if score > 0:
        label = "긍정 😊"
    elif score < 0:
        label = "부정 😞"
    else:
        label = "중립 😐"

    return {"text": text, "score": score, "label": label, "details": details}

# 4. 결과 출력 함수
def print_result(result):
    """분석 결과를 보기 좋게 출력합니다."""
    print(f"\\n📝 \"{result['text']}\"")
    print(f"   결과: {result['label']} (점수: {result['score']:+d})")
    if result["details"]:
        for d in result["details"]:
            print(f"   {d}")

# 5. 테스트 문장으로 분석
test_sentences = [
    ("이 영화 정말 재미있다 최고", "긍정"),
    ("음식이 맛있고 서비스도 친절 추천", "긍정"),
    ("완전 별로 실망 다시 안 간다", "부정"),
    ("가격이 비싸다 맛없다 후회", "부정"),
    ("안 좋은 경험이었다", "부정"),
    ("나쁘다고 할 수 없는 맛", "긍정"),
    ("그냥 보통이었다", "중립"),
    ("감동 받았고 행복 했다", "긍정"),
    ("지루하다 재미없다 시간 낭비", "부정"),
    ("친절 하고 깨끗 하지만 비싸다", "긍정"),
]

print("\\n" + "=" * 50)
print("       감성 분석 테스트 결과")
print("=" * 50)

correct = 0
total = len(test_sentences)

for text, expected in test_sentences:
    result = analyze_sentiment(text)
    print_result(result)

    # 예측 레이블 추출 (이모지 제거)
    predicted = result["label"].split()[0]
    is_correct = predicted == expected
    if is_correct:
        correct += 1
    status = "✅" if is_correct else "❌"
    print(f"   정답: {expected} {status}")

# 6. 정확도 평가
print("\\n" + "=" * 50)
print(f"  정확도: {correct}/{total} ({correct/total:.0%})")
print("=" * 50)

# 사용자 입력 테스트
print("\\n=== 추가 분석 테스트 ===")
custom_texts = [
    "오늘 날씨도 좋은 멋진 하루",
    "이 제품은 별로 추천 안 한다",
    "감사합니다 만족 합니다 대박",
]
for text in custom_texts:
    result = analyze_sentiment(text)
    print_result(result)
`,
        language: "python",
      },
    },
  },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
