import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson01: Lesson = {
  id: "python-intermediate-01",
  language: "python",
  track: "intermediate",
  order: 1,
  title: "Python 30분 속성",
  subtitle: "다른 언어에서 넘어온 개발자를 위한 빠른 핵심 정리",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# Python 30분 속성

Java, JavaScript, C++ 등 다른 언어를 이미 아는 개발자를 위한 핵심 정리입니다.
"이런 건 Python에서 어떻게 하지?"에 빠르게 답하는 것이 목표입니다.

이번 챕터에서 다룰 내용:
- Python vs 다른 언어 비교
- 변수, 타입, 문자열
- 조건문, 반복문, 함수
- Python만의 Truthy/Falsy 규칙`,
    },
    {
      type: "markdown",
      source: `## Python vs 다른 언어 — 한눈에 비교

| 항목 | Java / C++ / JS | Python |
|------|-----------------|--------|
| 문장 끝 | \`;\` 세미콜론 필수 | 세미콜론 없음 |
| 블록 구분 | \`{ }\` 중괄호 | **들여쓰기(indentation)** |
| 타입 선언 | \`int x = 5;\` / \`let x = 5\` | \`x = 5\` (그냥 대입) |
| 메인 함수 | \`public static void main\` / 없음 | 없음 (스크립트 바로 실행) |
| 컴파일 | 필요 (Java, C++) | 인터프리터 (바로 실행) |
| 변수 타입 | 정적 (Java, C++) / 동적 (JS) | **동적 타입** |

핵심: **들여쓰기가 문법**입니다. 탭/스페이스를 잘못 쓰면 \`IndentationError\`가 발생합니다.`,
    },
    {
      type: "code",
      source: `# 다른 언어: if (x > 0) { console.log("양수"); }
# Python:
x = 10
if x > 0:
    print("양수")    # 4칸 들여쓰기가 블록을 결정`,
    },
    {
      type: "markdown",
      source: `## 변수와 타입

Python에는 \`var\`, \`let\`, \`const\` 같은 키워드가 없습니다.
그냥 이름에 값을 대입하면 변수가 생깁니다.

타입 힌트(type hint)는 Python 3.5+에서 **선택적으로** 사용 가능합니다.
런타임에 강제되지 않고, IDE와 린터를 위한 것입니다.`,
    },
    {
      type: "code",
      source: `# 타입 선언 없이 바로 대입
name = "Python"        # str
count = 42             # int
pi = 3.14              # float
is_valid = True        # bool (대문자 주의!)

# 타입 힌트 (선택적, 런타임에 강제 안 됨)
age: int = 25
greeting: str = "Hello"

# JS의 const에 해당하는 것은 없음 — 관례상 대문자로 표현
MAX_RETRY = 3

print(type(name))      # <class 'str'>
print(type(count))     # <class 'int'>`,
    },
    {
      type: "markdown",
      source: `## 문자열 포매팅 — f-string

JS의 템플릿 리터럴(\\\`\${}\\\`), Java의 \`String.format()\`에 해당하는 것이
Python의 **f-string** (Python 3.6+)입니다.`,
    },
    {
      type: "code",
      source: `name = "김개발"
lang = "Python"
years = 3

# f-string — 가장 현대적이고 권장되는 방식
print(f"{name}은 {lang}을 {years}년째 사용 중")

# 표현식도 가능
print(f"내년이면 {years + 1}년차")
print(f"이름 길이: {len(name)}글자")

# 포맷 지정
price = 49900
print(f"가격: {price:,}원")        # 쉼표 구분: 49,900원
print(f"파이: {3.14159:.2f}")      # 소수점 2자리: 3.14`,
    },
    {
      type: "markdown",
      source: `## 조건문

- 괄호 \`( )\` 불필요 (써도 되지만 Pythonic하지 않음)
- \`else if\` 대신 **\`elif\`**
- \`switch/case\` 대신 \`match/case\` (Python 3.10+) 또는 \`if/elif\` 체인`,
    },
    {
      type: "code",
      source: `score = 85

# 괄호 없이, elif 사용
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"점수: {score}, 등급: {grade}")

# Python 3.10+ match/case (다른 언어의 switch와 유사)
status = 404
match status:
    case 200:
        msg = "OK"
    case 404:
        msg = "Not Found"
    case _:
        msg = "Unknown"

print(f"HTTP {status}: {msg}")`,
    },
    {
      type: "markdown",
      source: `## 반복문

전통적인 \`for(int i=0; i<n; i++)\`은 없습니다.
Python의 \`for\`는 항상 **이터러블을 순회**합니다.`,
    },
    {
      type: "code",
      source: `# range()로 숫자 반복 — C-style for 대체
for i in range(5):          # 0, 1, 2, 3, 4
    print(i, end=" ")
print()

# range(start, stop, step)
for i in range(1, 10, 2):   # 1, 3, 5, 7, 9
    print(i, end=" ")
print()

# 리스트 직접 순회 (인덱스 불필요!)
languages = ["Python", "Java", "Go"]
for lang in languages:
    print(f"I know {lang}")

# while도 동일하게 사용
n = 5
while n > 0:
    print(n, end=" ")
    n -= 1  # n-- 은 Python에 없음!`,
    },
    {
      type: "markdown",
      source: `## 함수

- \`def\` 키워드 사용
- 리턴 타입 선언은 선택적 (\`-> int\`)
- **여러 값을 동시에 리턴** 가능 (튜플)
- 기본값 파라미터, 키워드 인자 지원`,
    },
    {
      type: "code",
      source: `# 기본 함수
def greet(name: str, times: int = 1) -> str:
    return f"Hello, {name}! " * times

print(greet("Python"))
print(greet("Python", 3))
print(greet(times=2, name="Java"))  # 키워드 인자 (순서 무관)

# 여러 값 리턴 (튜플)
def min_max(numbers):
    return min(numbers), max(numbers)

lo, hi = min_max([3, 1, 4, 1, 5, 9])
print(f"최소: {lo}, 최대: {hi}")`,
    },
    {
      type: "markdown",
      source: `## Truthy / Falsy

Python에서 **Falsy**로 평가되는 값들:

| 값 | 설명 |
|---|------|
| \`None\` | JS의 \`null\`, Java의 \`null\` |
| \`0\`, \`0.0\` | 숫자 0 |
| \`""\` | 빈 문자열 |
| \`[]\`, \`()\`, \`{}\` | 빈 컬렉션 |
| \`False\` | 불리언 거짓 |

이것 외에는 모두 **Truthy**입니다.`,
    },
    {
      type: "code",
      source: `# Truthy/Falsy 활용
items = []

# 다른 언어: if (items.length > 0)
# Python: 빈 리스트는 Falsy
if items:
    print("아이템 있음")
else:
    print("비어있음")

# None 체크
result = None
if result is None:   # == 대신 is 사용 (identity 비교)
    print("결과 없음")

# or를 이용한 기본값 (JS의 || 와 동일)
username = "" or "Anonymous"
print(username)  # "Anonymous"`,
    },
    {
      type: "markdown",
      source: `## 미션 1: FizzBuzz 한 줄 챌린지

1부터 20까지 FizzBuzz를 **리스트 컴프리헨션 한 줄**로 만들어보세요.

규칙:
- 3의 배수: "Fizz"
- 5의 배수: "Buzz"
- 15의 배수: "FizzBuzz"
- 그 외: 숫자 그대로

힌트: 리스트 컴프리헨션 + 삼항 연산자를 중첩할 수 있습니다.
\`[표현식 for x in range(...)]\``,
    },
    {
      type: "code",
      source: `# FizzBuzz 1~20을 리스트로 만들어보세요
# result = [... for i in range(1, 21)]

result = ___

print(result)`,
      hints: [
        "삼항 연산자: `\"Fizz\" if i % 3 == 0 else i` 형태로 사용합니다.",
        "중첩 삼항: `\"FizzBuzz\" if 조건 else \"Fizz\" if 조건 else ...` 순서로 작성합니다.",
        "15의 배수를 가장 먼저 체크해야 합니다. 3과 5 모두의 배수이므로 뒤에 두면 Fizz나 Buzz에 잡힙니다.",
      ],
      solution: `result = ["FizzBuzz" if i % 15 == 0 else "Fizz" if i % 3 == 0 else "Buzz" if i % 5 == 0 else i for i in range(1, 21)]

print(result)`,
    },
    {
      type: "markdown",
      source: `## 미션 2: 변수 교환과 다중 할당

Python에서는 임시 변수 없이 두 변수를 교환할 수 있습니다.

아래 과제를 완성하세요:
1. \`a\`와 \`b\`의 값을 한 줄로 교환
2. 리스트 \`[1, 2, 3]\`의 각 요소를 변수 \`x, y, z\`에 한 줄로 할당
3. 한 줄에 여러 변수 동시 초기화: \`first\`, \`second\`, \`third\`를 각각 10, 20, 30으로`,
    },
    {
      type: "code",
      source: `# 1. 변수 교환 (temp 변수 없이!)
a = "hello"
b = "world"
# 여기서 a와 b를 교환하세요
___

print(f"a={a}, b={b}")  # a=world, b=hello

# 2. 리스트 언패킹
data = [1, 2, 3]
# data의 각 요소를 x, y, z에 할당하세요
___

print(f"x={x}, y={y}, z={z}")  # x=1, y=2, z=3

# 3. 다중 할당
# first=10, second=20, third=30을 한 줄로
___

print(f"{first}, {second}, {third}")  # 10, 20, 30`,
      hints: [
        "Python에서 변수 교환: `a, b = b, a` — 이것이 전부입니다!",
        "리스트 언패킹: `x, y, z = 리스트` 형태로 할당할 수 있습니다.",
        "다중 할당: `a, b, c = 값1, 값2, 값3` 형태로 한 줄에 여러 변수를 초기화합니다.",
      ],
      solution: `# 1. 변수 교환 (temp 변수 없이!)
a = "hello"
b = "world"
a, b = b, a

print(f"a={a}, b={b}")  # a=world, b=hello

# 2. 리스트 언패킹
data = [1, 2, 3]
x, y, z = data

print(f"x={x}, y={y}, z={z}")  # x=1, y=2, z=3

# 3. 다중 할당
first, second, third = 10, 20, 30

print(f"{first}, {second}, {third}")  # 10, 20, 30`,
    },
    {
      type: "markdown",
      source: `## 챕터 정리

| 다른 언어 | Python |
|-----------|--------|
| \`int x = 5;\` | \`x = 5\` |
| \`"Hi " + name\` | \`f"Hi {name}"\` |
| \`else if\` | \`elif\` |
| \`for(i=0;i<n;i++)\` | \`for i in range(n):\` |
| \`x++\` | \`x += 1\` (증감 연산자 없음) |
| \`temp=a; a=b; b=temp;\` | \`a, b = b, a\` |
| \`null\` | \`None\` |
| \`return new int[]{a,b};\` | \`return a, b\` |

다음 챕터에서는 이 기초 위에 **Pythonic한 코드 작성법**을 배웁니다.`,
    },
    {
      type: "code",
      source: `# 자유 실험 공간
`,
    },
  ],
  quiz: {
    title: "챕터 1 퀴즈 — Python 기본 문법",
    questions: [
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `x = 10\ny = 3\nprint(f"{x // y}, {x % y}")`,
        options: ["3.33, 1", "3, 1", "3.0, 1.0", "에러"],
        correctIndex: 1,
        explanation:
          "`//`는 정수 나눗셈(floor division), `%`는 나머지 연산입니다. 10 // 3 = 3, 10 % 3 = 1.",
      },
      {
        type: "multiple-choice",
        question: "Python에서 Falsy가 아닌 값은?",
        options: ['`""`', "`[0]`", "`0`", "`None`"],
        correctIndex: 1,
        explanation:
          "`[0]`은 요소가 하나 있는 리스트이므로 Truthy입니다. 빈 컬렉션`[]`만 Falsy입니다.",
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `a, b = "X", "Y"\na, b = b, a\nprint(a + b)`,
        options: ['"XY"', '"YX"', "에러", '"X Y"'],
        correctIndex: 1,
        explanation:
          "`a, b = b, a`로 교환 후 a=\"Y\", b=\"X\"가 됩니다. 문자열 `+` 연산으로 \"YX\"가 출력됩니다.",
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `def calc(a, b=2):\n    return a ** b\n\nprint(calc(3), calc(3, 3))`,
        options: ["6 9", "9 27", "9 9", "에러"],
        correctIndex: 1,
        explanation:
          "`**`는 거듭제곱 연산자입니다. `calc(3)`은 3**2=9, `calc(3,3)`은 3**3=27입니다.",
      },
    ],
  } satisfies Quiz,
};
