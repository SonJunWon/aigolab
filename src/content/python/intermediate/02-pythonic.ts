import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson02: Lesson = {
  id: "python-intermediate-02",
  language: "python",
  track: "intermediate",
  order: 2,
  title: "Pythonic 코드 작성법",
  subtitle: "다른 언어 스타일을 Python답게 바꾸기",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# Pythonic 코드 작성법

"Pythonic"이란 Python의 철학과 관용구(idiom)에 맞는 코드 스타일을 뜻합니다.
다른 언어에서 넘어온 개발자가 가장 많이 하는 실수는 **Java/C++ 스타일을 그대로 Python에 옮기는 것**입니다.

이번 챕터에서 다룰 내용:
- List / Dict / Set Comprehension
- \`enumerate()\`, \`zip()\`
- Unpacking과 삼항 연산자
- Walrus operator \`:=\`
- \`any()\`와 \`all()\``,
    },
    {
      type: "markdown",
      source: `## List Comprehension

다른 언어에서는 빈 리스트를 만들고 반복문으로 \`append\`/\`push\` 합니다.
Python에서는 **리스트 컴프리헨션** 한 줄로 끝냅니다.

\`\`\`
[표현식 for 변수 in 이터러블 if 조건]
\`\`\``,
    },
    {
      type: "code",
      source: `# --- 다른 언어 스타일 (비추천) ---
squares_old = []
for i in range(10):
    squares_old.append(i ** 2)

# --- Pythonic 스타일 ---
squares = [i ** 2 for i in range(10)]

print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 조건 필터링 포함
evens = [i for i in range(20) if i % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# 표현식에서 변환도 가능
words = ["hello", "WORLD", "Python"]
lower_words = [w.lower() for w in words]
print(lower_words)  # ['hello', 'world', 'python']`,
    },
    {
      type: "markdown",
      source: `## Dict / Set Comprehension

리스트뿐 아니라 딕셔너리와 셋도 컴프리헨션으로 생성할 수 있습니다.`,
    },
    {
      type: "code",
      source: `# Dict Comprehension: {키: 값 for ...}
names = ["alice", "bob", "charlie"]
name_lengths = {name: len(name) for name in names}
print(name_lengths)  # {'alice': 5, 'bob': 3, 'charlie': 7}

# 기존 딕셔너리 변환
prices = {"apple": 1000, "banana": 500, "cherry": 2000}
expensive = {k: v for k, v in prices.items() if v >= 1000}
print(expensive)  # {'apple': 1000, 'cherry': 2000}

# Set Comprehension: {표현식 for ...}
sentence = "hello world hello python"
unique_lengths = {len(w) for w in sentence.split()}
print(unique_lengths)  # {5, 6} — 중복 제거됨`,
    },
    {
      type: "markdown",
      source: `## enumerate() — 인덱스가 필요할 때

다른 언어 습관: \`for(int i=0; i<arr.length; i++)\` 또는 별도 카운터 변수 사용.
Python에서는 **\`enumerate()\`** 를 씁니다.`,
    },
    {
      type: "code",
      source: `langs = ["Python", "Java", "Go", "Rust"]

# --- 비추천: 인덱스를 수동 관리 ---
# i = 0
# for lang in langs:
#     print(f"{i}: {lang}")
#     i += 1

# --- 역시 비추천: range(len(...)) ---
# for i in range(len(langs)):
#     print(f"{i}: {langs[i]}")

# --- Pythonic ---
for i, lang in enumerate(langs):
    print(f"{i}: {lang}")

print("---")

# start 파라미터로 시작 번호 지정
for i, lang in enumerate(langs, start=1):
    print(f"{i}. {lang}")`,
    },
    {
      type: "markdown",
      source: `## zip() — 병렬 순회

두 개 이상의 이터러블을 동시에 순회합니다.
다른 언어에서 같은 인덱스로 두 배열을 접근하던 패턴을 대체합니다.`,
    },
    {
      type: "code",
      source: `names = ["Alice", "Bob", "Charlie"]
scores = [85, 92, 78]

# --- 비추천 ---
# for i in range(len(names)):
#     print(f"{names[i]}: {scores[i]}")

# --- Pythonic ---
for name, score in zip(names, scores):
    print(f"{name}: {score}점")

print("---")

# 3개 이상도 가능
grades = ["B", "A", "C"]
for name, score, grade in zip(names, scores, grades):
    print(f"{name}: {score}점 ({grade})")

# zip으로 딕셔너리 생성
score_dict = dict(zip(names, scores))
print(score_dict)  # {'Alice': 85, 'Bob': 92, 'Charlie': 78}`,
    },
    {
      type: "markdown",
      source: `## Unpacking (구조 분해)

JS의 구조 분해 할당(destructuring)과 비슷하지만, Python이 더 강력합니다.`,
    },
    {
      type: "code",
      source: `# 기본 unpacking
a, b = 1, 2
print(a, b)  # 1 2

# 스타 언패킹 (*) — 나머지를 리스트로 받기
first, *rest = [1, 2, 3, 4, 5]
print(first)  # 1
print(rest)   # [2, 3, 4, 5]

# 중간 것만 건너뛰기
first, *_, last = [10, 20, 30, 40, 50]
print(first, last)  # 10 50

# 함수 리턴값 언패킹
def get_user():
    return "김개발", 28, "서울"

name, age, city = get_user()
print(f"{name}, {age}세, {city}")

# 중첩 언패킹
(a, b), c = [1, 2], 3
print(a, b, c)  # 1 2 3`,
    },
    {
      type: "markdown",
      source: `## 삼항 연산자

다른 언어: \`condition ? valueA : valueB\`
Python: \`valueA if condition else valueB\`

읽는 순서가 "값 - 조건 - 대안값"이라 자연어에 가깝습니다.`,
    },
    {
      type: "code",
      source: `age = 20

# 다른 언어: status = age >= 18 ? "성인" : "미성년"
status = "성인" if age >= 18 else "미성년"
print(status)  # 성인

# 실전 활용: 리스트 컴프리헨션 안에서
numbers = [1, -2, 3, -4, 5]
abs_values = [n if n >= 0 else -n for n in numbers]
print(abs_values)  # [1, 2, 3, 4, 5]

# 중첩 삼항 (가독성 주의)
score = 75
grade = "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "F"
print(grade)  # C`,
    },
    {
      type: "markdown",
      source: `## Walrus Operator \`:=\` (Python 3.8+)

**대입과 동시에 그 값을 사용**할 수 있는 연산자입니다.
"바다코끼리 연산자"라고도 불립니다 (\`:=\`가 바다코끼리 눈과 이빨처럼 보여서).

\`while\` 루프나 \`if\` 조건에서 임시 변수를 줄여줍니다.`,
    },
    {
      type: "code",
      source: `# --- walrus 없이 ---
line = input("입력> ") if False else "hello"  # 예시용
# while line != "quit":
#     process(line)
#     line = input("입력> ")

# --- walrus 사용 ---
# while (line := input("입력> ")) != "quit":
#     process(line)

# 실전 예시: 리스트 컴프리헨션에서 계산 결과 재사용
import math
numbers = [1, 4, 9, 15, 16, 25, 30]

# 제곱근이 정수인 것만 필터 + 변환 (계산 한 번만)
results = [
    (n, int(root))
    for n in numbers
    if (root := math.sqrt(n)) == int(root)
]
print(results)  # [(1, 1), (4, 2), (9, 3), (16, 4), (25, 5)]

# if 문에서 활용
data = [1, 2, 3, 4, 5]
if (n := len(data)) > 3:
    print(f"데이터가 {n}개로, 3개를 초과합니다")`,
    },
    {
      type: "markdown",
      source: `## any()와 all()

JS의 \`Array.some()\`과 \`Array.every()\`에 해당합니다.
반복문 없이 조건 검사를 한 줄로 처리합니다.`,
    },
    {
      type: "code",
      source: `scores = [85, 92, 78, 95, 88]

# any(): 하나라도 True면 True (JS의 some())
has_perfect = any(s == 100 for s in scores)
has_over_90 = any(s > 90 for s in scores)
print(f"만점 있음: {has_perfect}")    # False
print(f"90점 초과 있음: {has_over_90}")  # True

# all(): 모두 True여야 True (JS의 every())
all_pass = all(s >= 60 for s in scores)
all_over_80 = all(s > 80 for s in scores)
print(f"전원 합격: {all_pass}")       # True
print(f"전원 80초과: {all_over_80}")   # False

# 실전: 비밀번호 검증
password = "MyP@ss123"
checks = [
    len(password) >= 8,
    any(c.isupper() for c in password),
    any(c.islower() for c in password),
    any(c.isdigit() for c in password),
]
print(f"비밀번호 유효: {all(checks)}")  # True`,
    },
    {
      type: "markdown",
      source: `## 미션 1: 명령형 코드를 Pythonic하게 변환

아래의 Java/C++ 스타일 코드를 Pythonic한 코드로 바꿔보세요.
각각 **한 줄**로 변환하는 것이 목표입니다.`,
    },
    {
      type: "code",
      source: `# --- 변환 대상 1: 짝수의 제곱 리스트 ---
# result1 = []
# for i in range(1, 11):
#     if i % 2 == 0:
#         result1.append(i ** 2)
# 위 코드를 한 줄로:
result1 = ___

print(result1)  # [4, 16, 36, 64, 100]

# --- 변환 대상 2: 문자열 리스트에서 3글자 이상만 대문자로 ---
# words = ["hi", "hello", "ok", "python", "go"]
# result2 = []
# for w in words:
#     if len(w) >= 3:
#         result2.append(w.upper())
words = ["hi", "hello", "ok", "python", "go"]
result2 = ___

print(result2)  # ['HELLO', 'PYTHON']

# --- 변환 대상 3: 숫자를 "짝수"/"홀수"로 변환 ---
# numbers = [1, 2, 3, 4, 5]
# result3 = []
# for n in numbers:
#     if n % 2 == 0:
#         result3.append("짝수")
#     else:
#         result3.append("홀수")
numbers = [1, 2, 3, 4, 5]
result3 = ___

print(result3)  # ['홀수', '짝수', '홀수', '짝수', '홀수']`,
      hints: [
        "리스트 컴프리헨션 기본 형태: `[표현식 for x in 이터러블 if 조건]`",
        "변환 대상 3은 조건부 표현식(삼항)을 사용합니다: `[A if 조건 else B for x in ...]`",
        "변환 대상 2: `[w.upper() for w in words if len(w) >= 3]` — 필터는 for 뒤에 붙습니다.",
      ],
      solution: `result1 = [i ** 2 for i in range(1, 11) if i % 2 == 0]

print(result1)  # [4, 16, 36, 64, 100]

words = ["hi", "hello", "ok", "python", "go"]
result2 = [w.upper() for w in words if len(w) >= 3]

print(result2)  # ['HELLO', 'PYTHON']

numbers = [1, 2, 3, 4, 5]
result3 = ["짝수" if n % 2 == 0 else "홀수" for n in numbers]

print(result3)  # ['홀수', '짝수', '홀수', '짝수', '홀수']`,
    },
    {
      type: "markdown",
      source: `## 미션 2: zip + 컴프리헨션으로 두 리스트 병렬 처리

두 리스트가 주어집니다:
- \`students\`: 학생 이름
- \`scores\`: 해당 학생의 점수

아래 과제를 완성하세요:
1. \`zip\`을 사용하여 80점 이상인 학생의 이름만 담은 리스트 생성
2. \`zip\`과 dict comprehension으로 \`{이름: 등급}\` 딕셔너리 생성
   (90 이상 "A", 80 이상 "B", 나머지 "C")
3. \`enumerate\`와 \`zip\`을 조합하여 \`"1. Alice: 85점"\` 형태의 문자열 리스트 생성`,
    },
    {
      type: "code",
      source: `students = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
scores = [85, 72, 91, 68, 95]

# 1. 80점 이상 학생 이름 리스트
honor = ___
print(honor)  # ['Alice', 'Charlie', 'Eve']

# 2. {이름: 등급} 딕셔너리 (A: 90+, B: 80+, C: 나머지)
grades = ___
print(grades)  # {'Alice': 'B', 'Bob': 'C', 'Charlie': 'A', 'Diana': 'C', 'Eve': 'A'}

# 3. "순번. 이름: 점수점" 형태 문자열 리스트 (1번부터)
report = ___
print(report)
# ['1. Alice: 85점', '2. Bob: 72점', '3. Charlie: 91점', '4. Diana: 68점', '5. Eve: 95점']`,
      hints: [
        "1번: `[name for name, score in zip(students, scores) if 조건]` 형태입니다.",
        "2번: dict comprehension에서 삼항을 중첩합니다: `{name: (\"A\" if s >= 90 else \"B\" if s >= 80 else \"C\") for name, s in zip(...)}`",
        "3번: `enumerate(zip(students, scores), start=1)`로 인덱스와 두 리스트를 동시에 순회합니다.",
      ],
      solution: `students = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
scores = [85, 72, 91, 68, 95]

# 1. 80점 이상 학생 이름 리스트
honor = [name for name, score in zip(students, scores) if score >= 80]
print(honor)  # ['Alice', 'Charlie', 'Eve']

# 2. {이름: 등급} 딕셔너리
grades = {name: ("A" if s >= 90 else "B" if s >= 80 else "C") for name, s in zip(students, scores)}
print(grades)  # {'Alice': 'B', 'Bob': 'C', 'Charlie': 'A', 'Diana': 'C', 'Eve': 'A'}

# 3. "순번. 이름: 점수점" 형태 문자열 리스트
report = [f"{i}. {name}: {score}점" for i, (name, score) in enumerate(zip(students, scores), start=1)]
print(report)`,
    },
    {
      type: "markdown",
      source: `## 챕터 정리

| 비추천 (다른 언어 스타일) | Pythonic |
|--------------------------|----------|
| \`for i in range(len(arr))\` | \`for i, v in enumerate(arr)\` |
| 두 배열 같은 인덱스 접근 | \`for a, b in zip(arr1, arr2)\` |
| \`result=[]; for...: result.append()\` | \`[expr for x in iter]\` |
| \`condition ? a : b\` | \`a if condition else b\` |
| \`temp = calc(); if temp:\` | \`if (temp := calc()):\` |
| \`arr.some(fn)\` / \`arr.every(fn)\` | \`any()\` / \`all()\` |

다음 챕터에서는 Python의 **데이터 구조(list, dict, set, tuple)** 를 깊이 다룹니다.`,
    },
    {
      type: "code",
      source: `# 자유 실험 공간
`,
    },
  ],
  quiz: {
    title: "챕터 2 퀴즈 — Pythonic 코드",
    questions: [
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `first, *mid, last = [10, 20, 30, 40, 50]\nprint(mid)`,
        options: ["[20, 30, 40]", "[10, 20, 30]", "20, 30, 40", "에러"],
        correctIndex: 0,
        explanation:
          "스타 언패킹(`*mid`)은 처음과 마지막을 제외한 나머지를 리스트로 받습니다. first=10, mid=[20,30,40], last=50.",
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `names = ["A", "B", "C"]\nnums = [1, 2]\nprint(list(zip(names, nums)))`,
        options: [
          "[('A', 1), ('B', 2), ('C', None)]",
          "[('A', 1), ('B', 2)]",
          "에러 — 길이가 다르면 안 됨",
          "[('A', 1), ('B', 2), ('C',)]",
        ],
        correctIndex: 1,
        explanation:
          "`zip()`은 가장 짧은 이터러블에 맞춰 멈춥니다. 'C'는 짝이 없어 무시됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "다음 중 `[x**2 for x in range(5) if x % 2 == 1]`의 결과는?",
        options: ["[0, 1, 4, 9, 16]", "[1, 9]", "[0, 4, 16]", "[1, 4, 9]"],
        correctIndex: 1,
        explanation:
          "range(5)에서 홀수(x%2==1)는 1, 3입니다. 1**2=1, 3**2=9이므로 결과는 [1, 9].",
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `data = [0, "", None, "hello", 42, []]\nprint(any(data), all(data))`,
        options: ["True True", "True False", "False False", "False True"],
        correctIndex: 1,
        explanation:
          "`any()`는 하나라도 Truthy면 True (\"hello\"와 42가 Truthy). `all()`은 모두 Truthy여야 하는데 0, \"\", None, []가 Falsy이므로 False.",
      },
    ],
  } satisfies Quiz,
};
