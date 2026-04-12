import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson03: Lesson = {
  id: "python-beginner-03",
  language: "python",
  track: "beginner",
  order: 3,
  title: "숫자와 글자 — 자료형",
  subtitle: "값의 종류를 알고, 서로 바꾸기",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 🧬 값의 종류 — 자료형 (Type)

프로그래밍에서 **값은 종류가 있어요**. 숫자는 숫자끼리, 글자는 글자끼리 다르게 취급돼요.
이 "종류"를 **자료형(Type)** 이라고 부릅니다.

이번 챕터에서 배울 것:
- 기본 자료형 4가지: **정수 / 실수 / 문자열 / 불리언**
- \`type()\` 으로 자료형 확인하기
- **형 변환** — 숫자를 글자로, 글자를 숫자로
- 왜 \`"5" + 5\` 는 에러가 나는가`,
    },
    {
      type: "markdown",
      source: `## 4가지 기본 자료형

| 자료형 | 영어 | 예시 |
|---|---|---|
| **정수** | \`int\` | \`42\`, \`-7\`, \`0\` |
| **실수** | \`float\` | \`3.14\`, \`-0.5\`, \`2.0\` |
| **문자열** | \`str\` | \`"안녕"\`, \`'hello'\` |
| **불리언** | \`bool\` | \`True\`, \`False\` |

\`type()\` 함수로 어떤 자료형인지 확인할 수 있어요:`,
    },
    {
      type: "code",
      source: `print(type(42))
print(type(3.14))
print(type("안녕"))
print(type(True))`,
    },
    {
      type: "markdown",
      source: `실행해보면 \`<class 'int'>\` 같이 나와요. \`class\` 는 지금은 그냥 "종류" 라고 생각하세요.

---

## 🔢 정수(int) vs 실수(float)

**소수점이 있으면 실수, 없으면 정수** 예요.`,
    },
    {
      type: "code",
      source: `a = 10
b = 10.0
c = 10 / 3

print(a, type(a))
print(b, type(b))
print(c, type(c))`,
    },
    {
      type: "markdown",
      source: `재미있는 사실:
- **나누기(\`/\`) 결과는 항상 실수**예요. \`10 / 2\` 도 \`5.0\` (int 5 가 아님)
- **정수 나누기** 를 하려면 \`//\` (슬래시 두 개)를 써요. \`10 // 3\` → \`3\``,
    },
    {
      type: "code",
      source: `print(10 / 3)    # 3.333...
print(10 // 3)   # 3
print(10 % 3)    # 1  (나머지)`,
    },
    {
      type: "markdown",
      source: `## 🔤 문자열(str)

**따옴표로 감싼 값**은 모두 문자열이에요. 숫자를 따옴표로 감싸면 더 이상 숫자가 아니고, "숫자처럼 생긴 글자"가 됩니다.`,
    },
    {
      type: "code",
      source: `number = 42
text = "42"

print(type(number))
print(type(text))

# 숫자끼리는 더할 수 있지만
print(number + number)

# 문자열끼리 + 는 '이어붙이기' 가 돼요
print(text + text)`,
    },
    {
      type: "markdown",
      source: `**문자열의 \`+\` 는 "이어붙이기"**:
- \`"Hello" + "World"\` → \`"HelloWorld"\`
- \`"42" + "42"\` → \`"4242"\` (덧셈이 아니에요!)

**문자열의 \`*\` 는 "반복"**:
- \`"ha" * 3\` → \`"hahaha"\``,
    },
    {
      type: "code",
      source: `print("안녕" + " " + "Python")
print("=" * 20)`,
    },
    {
      type: "markdown",
      source: `## 🚨 섞어 쓰면 에러나요

**서로 다른 자료형은 그냥 더할 수 없어요**. 예를 들어:`,
    },
    {
      type: "code",
      source: `age = 25
message = "나이: " + age   # ❌ TypeError`,
    },
    {
      type: "markdown",
      source: `위 코드를 실행하면 에러가 납니다. 왜냐면:
- \`"나이: "\` 는 문자열
- \`age\` 는 숫자
- 다른 종류라 \`+\` 로 합칠 수 없어요

**해결법**: **형 변환** — 한쪽을 다른 쪽에 맞추면 돼요.`,
    },
    {
      type: "markdown",
      source: `## 🔄 형 변환 (Type Conversion)

| 함수 | 변환 | 예시 |
|---|---|---|
| \`int(x)\` | 정수로 | \`int("42")\` → \`42\` |
| \`float(x)\` | 실수로 | \`float("3.14")\` → \`3.14\` |
| \`str(x)\` | 문자열로 | \`str(42)\` → \`"42"\` |
| \`bool(x)\` | 불리언으로 | \`bool(1)\` → \`True\` |`,
    },
    {
      type: "code",
      source: `age = 25

# 방법 1: 숫자를 문자열로 변환
message = "나이: " + str(age)
print(message)

# 방법 2: f-string — 가장 편한 방법
message = f"나이: {age}"
print(message)`,
    },
    {
      type: "markdown",
      source: `### ✨ f-string — 최고의 방법

**\`f"..."\` 앞에 \`f\` 를 붙이면** 문자열 안에 \`{변수}\` 를 넣을 수 있어요. 자동으로 형 변환까지 해줘요.

\`\`\`python
name = "철수"
age = 25
print(f"{name}은 {age}살이에요")
\`\`\``,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

다음 정보로 자기 소개 문장을 만들어 출력해보세요:
- 이름: "지수"
- 나이: 30
- 도시: "서울"

출력 결과: \`지수는 30살이고, 서울에 살아요.\``,
    },
    {
      type: "code",
      source: `name = "지수"
age = 30
city = "서울"

# 여기에 f-string을 써서 한 줄로 출력해보세요
`,
      hints: [
        "`f\"...\"` 안에 중괄호 `{}` 를 써서 변수를 넣을 수 있어요.",
        "`f\"{name}는...\"` 처럼 시작해보세요.",
        `정답 형태: \`f"{name}는 {age}살이고, {city}에 살아요."\``,
      ],
      solution: `name = "지수"
age = 30
city = "서울"

print(f"{name}는 {age}살이고, {city}에 살아요.")`,
    },
    {
      type: "markdown",
      source: `## 🔢 문자열을 숫자로

반대 방향 — **사용자가 글자로 입력한 숫자**(예: \`"15"\`) 를 진짜 숫자로 바꾸고 싶을 때:`,
    },
    {
      type: "code",
      source: `user_input = "15"    # 문자열

# 이대로 더하면 이어붙이기가 돼요
print(user_input + user_input)  # "1515"

# int() 로 변환하면 진짜 숫자
number = int(user_input)
print(number + number)  # 30`,
    },
    {
      type: "markdown",
      source: `**주의**: \`int()\` 는 **숫자로 바꿀 수 있는 문자열**만 처리할 수 있어요.
- \`int("42")\` → \`42\` ✅
- \`int("3.14")\` → ❌ (실수는 \`float("3.14")\` 를 써야 해요)
- \`int("안녕")\` → ❌ (숫자가 아니에요)

실패하면 \`ValueError\` 가 발생합니다.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

두 개의 문자열 \`"100"\` 과 \`"50"\` 이 있어요. 이 둘을 **진짜 숫자로 바꿔서 더한 결과**를 출력해보세요.

출력 결과: \`150\``,
    },
    {
      type: "code",
      source: `a = "100"
b = "50"

# a 와 b 를 int 로 변환해서 더한 결과를 출력하세요
`,
      hints: [
        "문자열을 숫자로 바꾸려면 `int()` 를 써요.",
        "`int(a) + int(b)` 처럼 변환한 뒤 더하세요.",
        "`print(int(a) + int(b))` 한 줄이면 돼요.",
      ],
      solution: `a = "100"
b = "50"

print(int(a) + int(b))`,
    },
    {
      type: "markdown",
      source: `## ✅ 불리언(bool) 맛보기

**\`True\` / \`False\`** 두 가지만 있는 자료형이에요. 주로 "조건" 을 표현할 때 써요.`,
    },
    {
      type: "code",
      source: `is_student = True
is_adult = False

print(is_student)
print(is_adult)

# 비교 결과는 불리언
print(10 > 5)      # True
print(10 == 5)     # False
print("a" == "a")  # True`,
    },
    {
      type: "markdown",
      source: `> 💡 \`==\` 는 **"같다"** 는 비교 연산자예요. \`=\` (대입)와 헷갈리지 마세요!

불리언은 다음 챕터에서 배울 **조건문(\`if\`)** 에서 본격적으로 쓰여요.`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 3 완료!

오늘 배운 것:
- ✅ 자료형 4가지: \`int\`, \`float\`, \`str\`, \`bool\`
- ✅ \`type()\` 으로 자료형 확인
- ✅ 형 변환: \`int()\`, \`str()\`, \`float()\`
- ✅ f-string 으로 쉽게 문자열 만들기
- ✅ \`/\`, \`//\`, \`%\` 나누기의 차이

**다음 챕터에서는**: \`input()\` 으로 사용자 입력을 받고, 조건문 \`if\` 를 배워요.

아래에서 자유롭게 실험해보세요:`,
    },
    {
      type: "code",
      source: `# 여기서 자유롭게 실험해보세요
`,
    },
  ],
  quiz: {
    title: "챕터 3 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `print("10" + "20")`,
        options: ["30", "1020", "\"10\" + \"20\"", "에러가 난다"],
        correctIndex: 1,
        explanation:
          '따옴표 안에 있으니 숫자가 아니라 문자열이에요. 문자열의 +는 이어붙이기(concatenation)라서 "1020"이 돼요.',
      },
      {
        type: "multiple-choice",
        question: "`type(3.0)` 의 결과는?",
        options: [
          "<class 'int'>",
          "<class 'float'>",
          "<class 'str'>",
          "<class 'number'>",
        ],
        correctIndex: 1,
        explanation: "소수점이 있으면 실수(float)예요. 3.0도 float입니다.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `age = 25\nprint(f"나이: {age}세")`,
        options: ["나이: age세", "나이: 25세", "나이: {age}세", "에러가 난다"],
        correctIndex: 1,
        explanation:
          "f-string에서 {age}는 변수 age의 값(25)으로 치환돼요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `print(int("10") + int("20"))`,
        options: ["1020", "30", "\"30\"", "에러가 난다"],
        correctIndex: 1,
        explanation:
          "int()로 문자열을 정수로 변환하면 진짜 숫자끼리 더하기가 돼서 30이에요.",
      },
    ],
  } satisfies Quiz,
};
