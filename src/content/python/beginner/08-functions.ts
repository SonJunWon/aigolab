import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson08: Lesson = {
  id: "python-beginner-08",
  language: "python",
  track: "beginner",
  order: 8,
  title: "코드를 묶어서 재사용 — 함수",
  subtitle: "def 로 나만의 명령어 만들기",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 🔧 코드를 묶어서 재사용 — 함수

같은 코드를 여러 번 쓰고 있다면? **함수(function)** 로 묶어두면 **한 번만 쓰고 여러 번 호출** 할 수 있어요.

사실 이미 함수를 많이 써왔어요:
- \`print()\` — 출력하는 함수
- \`len()\` — 길이를 세는 함수
- \`type()\` — 타입을 알려주는 함수

이번 챕터에서는 **내가 직접 함수를 만드는 법** 을 배워요.

이번 챕터에서 배울 것:
- \`def\` 로 함수 정의하기
- **매개변수**: 함수에 값 전달하기
- **return**: 결과 돌려주기
- **기본값** 매개변수
- **여러 개의 return** 과 조건부 반환`,
    },
    {
      type: "markdown",
      source: `## 📝 가장 기본 — 함수 정의

\`\`\`python
def 함수이름():
    실행할 코드
\`\`\`

\`def\` 로 시작하고, 이름 뒤에 괄호 \`()\`, 콜론 \`:\`, 그리고 들여쓰기.`,
    },
    {
      type: "code",
      source: `def greet():
    print("안녕하세요!")
    print("Python 세계에 오신 것을 환영합니다!")

# 함수 호출 (이름 뒤에 괄호)
greet()
greet()   # 몇 번이든 호출 가능`,
    },
    {
      type: "markdown",
      source: `**정의**(def)와 **호출**(함수이름())은 별개예요:
- \`def greet():\` → "이런 함수가 있다"고 **등록**만 하는 것
- \`greet()\` → 실제로 **실행**하는 것

정의만 하고 호출 안 하면 아무 일도 안 일어나요.`,
    },
    {
      type: "markdown",
      source: `## 📥 매개변수 — 함수에 값 넘기기

괄호 안에 **변수 이름**을 넣으면 호출할 때 값을 전달할 수 있어요.`,
    },
    {
      type: "code",
      source: `def greet(name):
    print(f"안녕하세요, {name}님!")

greet("철수")
greet("영희")
greet("민수")`,
    },
    {
      type: "code",
      source: `# 매개변수 여러 개도 가능
def introduce(name, age, city):
    print(f"저는 {name}이고, {age}살이며, {city}에 살아요.")

introduce("철수", 25, "서울")
introduce("영희", 22, "부산")`,
    },
    {
      type: "markdown",
      source: `## 📤 return — 결과 돌려주기

\`print()\` 는 화면에 보여주기만 해요. **결과를 변수에 저장**하고 싶으면 \`return\` 을 써요.`,
    },
    {
      type: "code",
      source: `def add(a, b):
    return a + b

result = add(3, 5)
print(result)   # 8

# return 값을 바로 사용할 수도 있어요
print(add(10, 20))   # 30
print(add(100, add(3, 5)))   # 108`,
    },
    {
      type: "markdown",
      source: `### return vs print

| | \`print()\` | \`return\` |
|---|---|---|
| **역할** | 화면에 보여주기 | 호출한 곳에 값 돌려주기 |
| **저장** | 변수에 저장 ❌ | 변수에 저장 ✅ |
| **계산에 사용** | 불가 | 가능 |

> 💡 함수가 \`return\` 없이 끝나면 \`None\` 을 돌려줘요.`,
    },
    {
      type: "code",
      source: `def with_return(x):
    return x * 2

def with_print(x):
    print(x * 2)

a = with_return(5)
b = with_print(5)   # 화면에 10이 출력됨

print(f"a = {a}")   # 10
print(f"b = {b}")   # None ← print는 값을 돌려주지 않아요!`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**원의 넓이를 계산하는 함수** \`circle_area(radius)\` 를 만들어보세요.

공식: 넓이 = π × r²

\`math\` 모듈의 \`math.pi\` 를 쓰세요. 반지름 5를 넣으면 약 \`78.54\` 가 나와야 해요.`,
    },
    {
      type: "code",
      source: `import math

# circle_area 함수를 만들고, 반지름 5로 호출해서 결과를 출력하세요
`,
      hints: [
        "`def circle_area(radius):` 로 시작하세요.",
        "함수 안에서 `return math.pi * radius ** 2` 를 쓰세요.",
        "호출: `print(circle_area(5))`",
      ],
      solution: `import math

def circle_area(radius):
    return math.pi * radius ** 2

print(circle_area(5))`,
    },
    {
      type: "markdown",
      source: `## 🎁 기본값 매개변수

매개변수에 **기본값**을 줄 수 있어요. 호출할 때 값을 안 넣으면 기본값이 사용돼요.`,
    },
    {
      type: "code",
      source: `def greet(name, greeting="안녕하세요"):
    print(f"{greeting}, {name}님!")

greet("철수")                    # 기본값 사용
greet("영희", "반갑습니다")      # 직접 지정`,
    },
    {
      type: "markdown",
      source: `> ⚠️ **기본값 매개변수는 뒤쪽에!**
> \`def f(a="x", b)\` ← ❌ 에러
> \`def f(a, b="x")\` ← ✅ OK`,
    },
    {
      type: "markdown",
      source: `## 🔀 조건부 return

함수 안에서 \`if\` 와 함께 **여러 곳에서 return** 할 수 있어요.`,
    },
    {
      type: "code",
      source: `def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

print(grade(85))   # B
print(grade(72))   # C
print(grade(95))   # A`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**피즈버즈(FizzBuzz)** 함수를 만들어보세요. 프로그래밍 면접의 고전 문제예요.

규칙:
- 3의 배수면 \`"Fizz"\` 반환
- 5의 배수면 \`"Buzz"\` 반환
- 3과 5 모두의 배수면 \`"FizzBuzz"\` 반환
- 아무것도 아니면 **숫자 자체** 반환

그리고 1부터 20까지 결과를 출력하세요.`,
    },
    {
      type: "code",
      source: `# fizzbuzz(n) 함수를 만들고, 1~20까지 결과를 출력하세요
`,
      hints: [
        "`def fizzbuzz(n):` 으로 시작하세요.",
        "**3과 5 모두의 배수** 를 먼저 체크해야 해요 (`n % 15 == 0` 또는 `n % 3 == 0 and n % 5 == 0`). 왜냐면 3의 배수를 먼저 체크하면 15도 거기서 걸려요.",
        "`for i in range(1, 21): print(fizzbuzz(i))` 로 1~20 출력.",
      ],
      solution: `def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    else:
        return n

for i in range(1, 21):
    print(fizzbuzz(i))`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 8 완료 — 입문 과정 완결!

오늘 배운 것:
- ✅ \`def\` 로 함수 정의
- ✅ **매개변수** 로 값 전달
- ✅ \`return\` 으로 결과 돌려주기
- ✅ \`return\` vs \`print\` 의 차이
- ✅ **기본값** 매개변수
- ✅ 조건부 \`return\` (등급 판별, FizzBuzz)

---

## 🏆 Python 입문 과정을 모두 마쳤습니다!

8챕터를 통해 배운 것을 정리하면:

| 챕터 | 배운 것 |
|---|---|
| 1 | \`print()\`, 문자열, 기본 계산 |
| 2 | 변수, 할당, 재할당 |
| 3 | 자료형, 형변환, f-string |
| 4 | 조건문 (if/elif/else) |
| 5 | 반복문 (for/while) |
| 6 | 리스트, 슬라이싱, 컴프리헨션 |
| 7 | 딕셔너리 |
| 8 | 함수 (def/return) |

이 8가지면 **대부분의 간단한 프로그램**을 만들 수 있어요. 축하합니다! 🎉

아래에서 자유롭게 실험해보세요:`,
    },
    {
      type: "code",
      source: `# 축하합니다! 자유롭게 코딩해보세요 🎉
`,
    },
  ],
  quiz: {
    title: "챕터 8 퀴즈 (최종)",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `def double(x):\n    return x * 2\n\nresult = double(double(3))\nprint(result)`,
        options: ["6", "9", "12", "에러가 난다"],
        correctIndex: 2,
        explanation: "double(3)=6, double(6)=12. 함수의 return 값을 다시 함수에 넘길 수 있어요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `def mystery(x):\n    print(x * 2)\n\nresult = mystery(5)\nprint(result)`,
        options: ["10\\n10", "10\\nNone", "None\\n10", "에러가 난다"],
        correctIndex: 1,
        explanation: "mystery는 print만 하고 return이 없어요. 그래서 result는 None. 화면에 10이 먼저 나오고 그 다음 None.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `def greet(name, emoji="👋"):\n    return f"{emoji} {name}"\n\nprint(greet("철수"))\nprint(greet("영희", "🎉"))`,
        options: ["👋 철수\\n🎉 영희", "👋 철수\\n👋 영희", "에러가 난다", "철수\\n영희"],
        correctIndex: 0,
        explanation: "첫 호출은 기본값 👋, 두 번째는 직접 🎉를 넘겼어요.",
      },
      {
        type: "multiple-choice",
        question: "`return` 과 `print()` 의 가장 큰 차이는?",
        options: [
          "둘 다 같은 역할이다",
          "return은 화면에 출력, print는 값을 돌려줌",
          "return은 값을 돌려줘서 저장/계산에 쓸 수 있고, print는 화면에 보여줄 뿐",
          "print만 함수 안에서 쓸 수 있다",
        ],
        correctIndex: 2,
        explanation: "return은 호출한 곳에 값을 돌려줘서 변수에 저장하거나 계산에 사용 가능. print는 화면에 보여주기만 하고 None을 반환.",
      },
    ],
  } satisfies Quiz,
};
