import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson06: Lesson = {
  id: "python-beginner-06",
  language: "python",
  track: "beginner",
  order: 6,
  title: "여러 값을 한 번에 — 리스트",
  subtitle: "대괄호 []로 값들을 묶고, 꺼내고, 바꾸기",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 📋 여러 값을 한 번에 — 리스트

지금까지 변수 하나에 값 하나만 넣었죠. 하지만 실제로는 **여러 데이터를 묶어서** 다뤄야 할 때가 많아요.

- 학생 5명의 점수
- 장바구니에 담은 상품들
- 이번 달 매일의 기온

이럴 때 쓰는 게 **리스트(list)** 입니다.

이번 챕터에서 배울 것:
- 리스트 만들기: \`[1, 2, 3]\`
- **인덱싱**: 특정 위치의 값 꺼내기
- **슬라이싱**: 범위로 잘라내기
- 리스트 **수정, 추가, 삭제**
- 반복문과 함께 사용
- **리스트 컴프리헨션**: 한 줄로 리스트 만들기`,
    },
    {
      type: "markdown",
      source: `## 📦 리스트 만들기

대괄호 \`[ ]\` 안에 쉼표로 값을 나열하면 리스트가 돼요.`,
    },
    {
      type: "code",
      source: `fruits = ["사과", "바나나", "오렌지"]
numbers = [10, 20, 30, 40, 50]
mixed = [1, "hello", True, 3.14]  # 다른 타입도 섞을 수 있어요
empty = []  # 빈 리스트

print(fruits)
print(f"개수: {len(fruits)}")`,
    },
    {
      type: "markdown",
      source: `\`len()\` 함수는 리스트의 **길이(원소 개수)** 를 알려줘요.

---

## 🔍 인덱싱 — 특정 위치의 값 꺼내기

리스트의 각 원소는 **번호(인덱스)** 로 접근해요. **0부터** 시작!

\`\`\`
 인덱스:  0        1        2
fruits = ["사과", "바나나", "오렌지"]
 역순:   -3       -2       -1
\`\`\``,
    },
    {
      type: "code",
      source: `fruits = ["사과", "바나나", "오렌지"]

print(fruits[0])    # 사과 (첫 번째)
print(fruits[1])    # 바나나 (두 번째)
print(fruits[-1])   # 오렌지 (마지막)
print(fruits[-2])   # 바나나 (뒤에서 두 번째)`,
    },
    {
      type: "markdown",
      source: `## ✂️ 슬라이싱 — 범위로 잘라내기

\`리스트[시작:끝]\` 으로 부분 리스트를 만들 수 있어요. **끝 인덱스는 포함 안 됨** (range와 같은 규칙).`,
    },
    {
      type: "code",
      source: `nums = [10, 20, 30, 40, 50]

print(nums[1:4])    # [20, 30, 40] — 1번부터 3번까지
print(nums[:3])     # [10, 20, 30] — 처음부터 2번까지
print(nums[2:])     # [30, 40, 50] — 2번부터 끝까지
print(nums[:])      # [10, 20, 30, 40, 50] — 전체 복사`,
    },
    {
      type: "markdown",
      source: `## ✏️ 리스트 수정

리스트는 **값을 바꿀 수 있어요** (문자열은 못 바꾸는데, 리스트는 가능).`,
    },
    {
      type: "code",
      source: `colors = ["빨강", "파랑", "초록"]
print("변경 전:", colors)

colors[1] = "노랑"   # 두 번째 원소를 바꿈
print("변경 후:", colors)`,
    },
    {
      type: "markdown",
      source: `## ➕ 원소 추가/삭제

| 메서드 | 동작 | 예시 |
|---|---|---|
| \`.append(값)\` | 맨 끝에 추가 | \`fruits.append("포도")\` |
| \`.insert(위치, 값)\` | 특정 위치에 삽입 | \`fruits.insert(0, "포도")\` |
| \`.pop()\` | 맨 끝 제거 + 반환 | \`last = fruits.pop()\` |
| \`.pop(위치)\` | 특정 위치 제거 | \`fruits.pop(0)\` |
| \`.remove(값)\` | 값으로 찾아 제거 | \`fruits.remove("바나나")\` |`,
    },
    {
      type: "code",
      source: `fruits = ["사과", "바나나"]

fruits.append("오렌지")
print(fruits)   # ["사과", "바나나", "오렌지"]

fruits.insert(1, "포도")
print(fruits)   # ["사과", "포도", "바나나", "오렌지"]

removed = fruits.pop()
print(f"제거됨: {removed}, 남은 것: {fruits}")`,
    },
    {
      type: "markdown",
      source: `## 🔁 리스트 + 반복문

챕터 5에서 배운 \`for\` 로 리스트의 모든 원소를 순회할 수 있어요.`,
    },
    {
      type: "code",
      source: `scores = [85, 92, 78, 95, 88]

total = 0
for score in scores:
    total += score

average = total / len(scores)
print(f"평균: {average}")`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

5명의 점수가 들어있는 리스트에서 **최고 점수**와 **최저 점수**를 찾아 출력하세요.
Python에는 \`max()\`, \`min()\` 함수가 있지만, **반복문으로 직접 찾아보세요.**

출력 예시:
\`\`\`
최고: 95
최저: 72
\`\`\``,
    },
    {
      type: "code",
      source: `scores = [85, 72, 95, 88, 79]

# 반복문으로 최고/최저 찾기
`,
      hints: [
        "`highest = scores[0]` 으로 첫 값을 기준으로 잡고 시작하세요.",
        "`for score in scores:` 로 순회하면서 `if score > highest:` 이면 `highest = score` 로 갱신하세요.",
        "최저도 같은 방식: `lowest = scores[0]`, 순회하면서 `if score < lowest:` 이면 갱신.",
      ],
      solution: `scores = [85, 72, 95, 88, 79]

highest = scores[0]
lowest = scores[0]

for score in scores:
    if score > highest:
        highest = score
    if score < lowest:
        lowest = score

print(f"최고: {highest}")
print(f"최저: {lowest}")`,
    },
    {
      type: "markdown",
      source: `## ✨ 리스트 컴프리헨션 — 한 줄로 리스트 만들기

**리스트 컴프리헨션(list comprehension)** 은 Python의 가장 멋진 기능 중 하나예요.
반복문 + 조건을 **한 줄**로 압축해서 새 리스트를 만들 수 있어요.

\`\`\`python
[표현식 for 변수 in 반복가능한것]
[표현식 for 변수 in 반복가능한것 if 조건]
\`\`\``,
    },
    {
      type: "code",
      source: `# 1~10의 제곱 리스트
squares = [x ** 2 for x in range(1, 11)]
print(squares)

# 짝수만 필터링
evens = [x for x in range(1, 21) if x % 2 == 0]
print(evens)

# 문자열 변환
names = ["alice", "bob", "charlie"]
upper_names = [name.upper() for name in names]
print(upper_names)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

리스트 컴프리헨션으로 **1~30 중 3의 배수만** 들어있는 리스트를 만들고 출력하세요.

출력: \`[3, 6, 9, 12, 15, 18, 21, 24, 27, 30]\``,
    },
    {
      type: "code",
      source: `# 리스트 컴프리헨션으로 3의 배수 리스트 만들기
`,
      hints: [
        "`[x for x in range(1, 31)]` 이 1~30 전체 리스트예요.",
        "`if x % 3 == 0` 조건을 뒤에 붙이면 3의 배수만 걸러져요.",
        "완성형: `[x for x in range(1, 31) if x % 3 == 0]`",
      ],
      solution: `multiples_of_3 = [x for x in range(1, 31) if x % 3 == 0]
print(multiples_of_3)`,
    },
    {
      type: "markdown",
      source: `## 🧰 유용한 리스트 함수/메서드

| 함수 | 설명 | 예시 |
|---|---|---|
| \`len(list)\` | 길이 | \`len([1,2,3])\` → 3 |
| \`sum(list)\` | 합계 | \`sum([1,2,3])\` → 6 |
| \`max(list)\` | 최댓값 | \`max([1,2,3])\` → 3 |
| \`min(list)\` | 최솟값 | \`min([1,2,3])\` → 1 |
| \`sorted(list)\` | 정렬 (원본 변경 X) | \`sorted([3,1,2])\` → [1,2,3] |
| \`list.sort()\` | 정렬 (원본 변경 O) | \`[3,1,2].sort()\` |
| \`list.reverse()\` | 뒤집기 (원본 변경) | |
| \`값 in list\` | 포함 여부 | \`"사과" in fruits\` → True |`,
    },
    {
      type: "code",
      source: `nums = [30, 10, 50, 20, 40]

print(f"합계: {sum(nums)}")
print(f"최대: {max(nums)}")
print(f"정렬: {sorted(nums)}")
print(f"포함?: {20 in nums}")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 6 완료!

오늘 배운 것:
- ✅ \`[]\` 로 리스트 만들기
- ✅ 인덱싱 (\`[0]\`, \`[-1]\`) 과 슬라이싱 (\`[1:4]\`)
- ✅ \`.append()\`, \`.pop()\`, \`.remove()\` 등
- ✅ 반복문으로 리스트 순회 + 누적 계산
- ✅ **리스트 컴프리헨션** — Python의 킬러 기능
- ✅ \`sum()\`, \`max()\`, \`min()\`, \`sorted()\`, \`in\`

**다음 챕터에서는**: 키-값 쌍으로 데이터를 정리하는 **딕셔너리** 를 배워요.

아래에서 자유롭게 실험해보세요:`,
    },
    {
      type: "code",
      source: `# 여기서 자유롭게 실험해보세요
`,
    },
  ],
  quiz: {
    title: "챕터 6 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `fruits = ["사과", "바나나", "오렌지"]\nprint(fruits[1])`,
        options: ["사과", "바나나", "오렌지", "에러가 난다"],
        correctIndex: 1,
        explanation: "인덱스는 0부터 시작해요. [0]이 사과, [1]이 바나나.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `nums = [10, 20, 30, 40]\nprint(nums[1:3])`,
        options: ["[10, 20, 30]", "[20, 30]", "[20, 30, 40]", "[10, 20]"],
        correctIndex: 1,
        explanation: "슬라이싱 [1:3]은 인덱스 1부터 2까지 (3은 포함 안 함). 결과는 [20, 30].",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 리스트에 몇 개의 원소가 남아있을까요?",
        code: `x = [1, 2, 3]\nx.append(4)\nx.pop()\nprint(len(x))`,
        options: ["2", "3", "4", "에러가 난다"],
        correctIndex: 1,
        explanation: "[1,2,3]에 4를 추가하면 [1,2,3,4] (4개), pop()으로 마지막 제거하면 [1,2,3] (3개).",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `result = [x * 2 for x in range(4)]\nprint(result)`,
        options: ["[0, 2, 4, 6]", "[2, 4, 6, 8]", "[0, 1, 2, 3]", "[1, 2, 3, 4]"],
        correctIndex: 0,
        explanation: "range(4)는 0,1,2,3. 각각 *2 하면 0,2,4,6.",
      },
    ],
  } satisfies Quiz,
};
