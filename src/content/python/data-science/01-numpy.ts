import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson01: Lesson = {
  id: "python-ds-01",
  language: "python",
  track: "data-science" as any,
  order: 1,
  title: "NumPy — 숫자 배열의 힘",
  subtitle: "데이터 과학의 기초, NumPy 배열을 다뤄봅시다",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 🔢 NumPy — 숫자 배열의 힘

데이터 과학의 첫 번째 도구, **NumPy**를 배워봅시다!

이번 챕터에서 배울 것:
- **NumPy 배열** 생성과 기본 속성 (shape, dtype)
- **벡터화 연산** — 반복문 없이 빠른 계산
- **인덱싱과 슬라이싱** — 원하는 데이터 꺼내기
- **reshape와 통계 함수** — 배열 변형과 요약

Python 기초를 마친 여러분이라면 충분히 따라올 수 있어요! 🚀`,
    },
    {
      type: "markdown",
      source: `## 📦 NumPy 불러오기

NumPy는 관례적으로 \`np\`라는 이름으로 불러옵니다.`,
    },
    {
      type: "code",
      source: `import numpy as np

print("NumPy 버전:", np.__version__)
print("준비 완료!")`,
    },
    {
      type: "markdown",
      source: `## 🧱 배열(Array) 만들기

Python 리스트와 비슷하지만, NumPy 배열은 **같은 타입의 데이터**만 담고, **훨씬 빠릅니다**.

\`np.array()\`로 리스트를 배열로 변환할 수 있어요.`,
    },
    {
      type: "code",
      source: `# 1차원 배열
scores = np.array([85, 92, 78, 95, 88])
print("배열:", scores)
print("타입:", type(scores))
print("shape:", scores.shape)   # (5,) → 5개 원소의 1차원 배열
print("dtype:", scores.dtype)   # int64 또는 int32

# 2차원 배열
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
print("\\n2차원 배열:\\n", matrix)
print("shape:", matrix.shape)   # (2, 3) → 2행 3열`,
    },
    {
      type: "markdown",
      source: `### 💡 유용한 배열 생성 함수들

자주 쓰는 특별한 배열을 만드는 함수들이 있어요.`,
    },
    {
      type: "code",
      source: `# 0으로 채운 배열
zeros = np.zeros((2, 3))
print("zeros:\\n", zeros)

# 1로 채운 배열
ones = np.ones(5)
print("\\nones:", ones)

# 일정 간격의 숫자
seq = np.arange(0, 10, 2)   # 0부터 10 미만, 2 간격
print("\\narange:", seq)

# 균등 간격으로 나눈 숫자
lin = np.linspace(0, 1, 5)  # 0~1 사이를 5등분
print("\\nlinspace:", lin)`,
    },
    {
      type: "markdown",
      source: `## ⚡ 벡터화 연산 — NumPy의 핵심

Python 리스트로 원소별 계산을 하려면 반복문이 필요하지만,
NumPy 배열은 **반복문 없이** 한번에 계산합니다. 이것을 **벡터화(vectorization)**라고 해요.`,
    },
    {
      type: "code",
      source: `scores = np.array([85, 92, 78, 95, 88])

# 모든 점수에 5점 추가 (커브)
curved = scores + 5
print("커브 적용:", curved)

# 100점 만점 → 1.0 만점으로 변환
normalized = scores / 100
print("정규화:", normalized)

# 배열끼리 연산
bonus = np.array([2, 3, 5, 1, 4])
final = scores + bonus
print("보너스 적용:", final)

# 비교 연산 (True/False 배열)
print("90점 이상:", scores >= 90)`,
    },
    {
      type: "markdown",
      source: `## 🎯 인덱싱과 슬라이싱

Python 리스트와 비슷하지만, NumPy는 **조건 인덱싱**이라는 강력한 기능이 있어요.`,
    },
    {
      type: "code",
      source: `arr = np.array([10, 20, 30, 40, 50])

# 기본 인덱싱 (0부터 시작)
print("첫 번째:", arr[0])
print("마지막:", arr[-1])

# 슬라이싱
print("앞 3개:", arr[:3])
print("뒤 2개:", arr[-2:])

# 조건 인덱싱 (Boolean indexing) ⭐
print("30 이상:", arr[arr >= 30])

# 2차원 배열 인덱싱
matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])
print("\\n(1,2) 위치:", matrix[1, 2])   # 6
print("첫 번째 행:", matrix[0])         # [1, 2, 3]
print("두 번째 열:", matrix[:, 1])      # [2, 5, 8]`,
    },
    {
      type: "markdown",
      source: `## 🔄 reshape — 배열 모양 바꾸기

\`reshape()\`을 사용하면 전체 원소 수는 유지하면서 배열의 모양을 바꿀 수 있어요.`,
    },
    {
      type: "code",
      source: `# 1차원 → 2차원
arr = np.arange(1, 13)  # [1, 2, 3, ..., 12]
print("원래:", arr)
print("shape:", arr.shape)

reshaped = arr.reshape(3, 4)  # 3행 4열
print("\\nreshape(3,4):\\n", reshaped)

reshaped2 = arr.reshape(4, 3)  # 4행 3열
print("\\nreshape(4,3):\\n", reshaped2)

# -1을 쓰면 자동 계산
auto = arr.reshape(2, -1)  # 2행, 열은 자동 = 6
print("\\nreshape(2,-1):\\n", auto)`,
    },
    {
      type: "markdown",
      source: `## 📊 통계 함수 — 데이터 요약하기

NumPy의 통계 함수로 데이터를 빠르게 요약할 수 있어요.`,
    },
    {
      type: "code",
      source: `scores = np.array([85, 92, 78, 95, 88, 73, 91, 86])

print("합계:", np.sum(scores))
print("평균:", np.mean(scores))
print("표준편차:", np.std(scores))
print("최솟값:", np.min(scores))
print("최댓값:", np.max(scores))
print("중앙값:", np.median(scores))

# 2차원 배열에서 축(axis) 기준 계산
data = np.array([[85, 92, 78],
                 [90, 88, 95]])
print("\\n전체 평균:", np.mean(data))
print("행별 평균 (axis=1):", np.mean(data, axis=1))  # 각 학생 평균
print("열별 평균 (axis=0):", np.mean(data, axis=0))  # 각 과목 평균`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 1 — 학생 점수 배열 통계 계산

5명 학생의 국어, 영어, 수학 점수가 있습니다.
각 학생의 평균 점수와 각 과목의 평균 점수를 구해보세요.

\`\`\`
학생1: 국어 85, 영어 90, 수학 78
학생2: 국어 92, 영어 88, 수학 95
학생3: 국어 76, 영어 82, 수학 89
학생4: 국어 95, 영어 91, 수학 87
학생5: 국어 88, 영어 79, 수학 93
\`\`\``,
    },
    {
      type: "code",
      source: `import numpy as np

# 2차원 배열로 점수 입력 (5명 x 3과목)
scores = np.array([
    # 여기에 점수를 입력하세요
])

# 각 학생의 평균 (axis=?)
student_avg = ___
print("학생별 평균:", student_avg)

# 각 과목의 평균 (axis=?)
subject_avg = ___
print("과목별 평균:", subject_avg)

# 전체 최고 점수
top_score = ___
print("전체 최고 점수:", top_score)`,
      hints: [
        "scores 배열은 5행 3열이어야 해요. 각 행이 한 학생, 각 열이 한 과목이에요.",
        "학생별 평균은 행 방향으로 평균을 구하는 거예요: `np.mean(scores, axis=1)`",
        "과목별 평균은 열 방향: `np.mean(scores, axis=0)`, 최고 점수: `np.max(scores)`",
      ],
      solution: `import numpy as np

scores = np.array([
    [85, 90, 78],
    [92, 88, 95],
    [76, 82, 89],
    [95, 91, 87],
    [88, 79, 93],
])

student_avg = np.mean(scores, axis=1)
print("학생별 평균:", student_avg)

subject_avg = np.mean(scores, axis=0)
print("과목별 평균:", subject_avg)

top_score = np.max(scores)
print("전체 최고 점수:", top_score)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 2 — 행렬 곱셈

2x3 행렬과 3x2 행렬을 만들고 **행렬 곱셈**을 수행해보세요.
NumPy에서 행렬 곱셈은 \`@\` 연산자 또는 \`np.dot()\`을 사용합니다.

> 힌트: (2x3) @ (3x2) = (2x2) 결과가 나와야 해요!`,
    },
    {
      type: "code",
      source: `import numpy as np

# 2x3 행렬
A = np.array([
    # 여기에 값을 채우세요
])

# 3x2 행렬
B = np.array([
    # 여기에 값을 채우세요
])

# 행렬 곱셈
result = ___

print("A:\\n", A)
print("\\nB:\\n", B)
print("\\nA @ B:\\n", result)
print("결과 shape:", result.shape)`,
      hints: [
        "A는 2행 3열, B는 3행 2열이어야 행렬 곱이 가능해요.",
        "행렬 곱셈은 `A @ B` 또는 `np.dot(A, B)`로 계산해요.",
        "예: `A = np.array([[1,2,3],[4,5,6]])`, `B = np.array([[1,2],[3,4],[5,6]])`",
      ],
      solution: `import numpy as np

A = np.array([
    [1, 2, 3],
    [4, 5, 6],
])

B = np.array([
    [1, 2],
    [3, 4],
    [5, 6],
])

result = A @ B

print("A:\\n", A)
print("\\nB:\\n", B)
print("\\nA @ B:\\n", result)
print("결과 shape:", result.shape)`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 1 완료!

오늘 배운 것:
- ✅ NumPy 배열 생성 (array, zeros, ones, arange, linspace)
- ✅ shape, dtype으로 배열 속성 확인
- ✅ 벡터화 연산으로 빠른 계산
- ✅ 인덱싱, 슬라이싱, 조건 인덱싱
- ✅ reshape로 배열 모양 변환
- ✅ 통계 함수 (mean, std, sum, min, max)

**다음 챕터에서는**: 표 형태의 데이터를 다루는 **Pandas**를 배웁니다! 📊`,
    },
  ],
  quiz: {
    title: "챕터 1 퀴즈 — NumPy",
    questions: [
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `import numpy as np\narr = np.array([1, 2, 3, 4, 5])\nprint(arr * 2)`,
        options: [
          "[1, 2, 3, 4, 5, 1, 2, 3, 4, 5]",
          "[ 2  4  6  8 10]",
          "[2, 4, 6, 8, 10]",
          "에러가 난다",
        ],
        correctIndex: 1,
        explanation:
          "NumPy 배열의 * 연산은 각 원소에 곱하기를 적용합니다 (벡터화 연산). Python 리스트의 * 반복과는 다릅니다.",
      },
      {
        type: "multiple-choice",
        question: "np.array([[1,2],[3,4]]).shape의 결과는?",
        options: ["(4,)", "(2, 2)", "(1, 4)", "[2, 2]"],
        correctIndex: 1,
        explanation:
          "2행 2열의 2차원 배열이므로 shape는 (2, 2) 튜플입니다.",
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `import numpy as np\narr = np.array([10, 20, 30, 40, 50])\nprint(arr[arr > 25])`,
        options: [
          "[True, True, True]",
          "[30 40 50]",
          "[False False True True True]",
          "에러가 난다",
        ],
        correctIndex: 1,
        explanation:
          "arr > 25는 Boolean 배열 [False, False, True, True, True]을 만들고, 이것으로 인덱싱하면 True 위치의 값만 추출됩니다.",
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `import numpy as np\ndata = np.array([[1, 2], [3, 4]])\nprint(np.sum(data, axis=0))`,
        options: ["[3, 7]", "[4, 6]", "10", "[1, 3]"],
        correctIndex: 1,
        explanation:
          "axis=0은 행 방향(아래로)으로 합산합니다. 첫 번째 열: 1+3=4, 두 번째 열: 2+4=6 → [4, 6]",
      },
    ],
  } satisfies Quiz,
};
