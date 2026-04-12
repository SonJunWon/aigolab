import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson04: Lesson = {
  id: "python-beginner-04",
  language: "python",
  track: "beginner",
  order: 4,
  title: "선택의 순간 — 조건문",
  subtitle: "if / elif / else 로 상황에 따라 다르게 동작하기",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 🚦 선택의 순간 — 조건문

지금까지의 코드는 **위에서 아래로 순서대로** 실행됐어요.
하지만 실제 프로그램은 상황에 따라 **다르게 동작**해야 할 때가 많죠.

- 점수가 60점 이상이면 "합격", 아니면 "불합격"
- 비가 오면 우산, 안 오면 선글라스
- 로그인 상태면 환영 메시지, 아니면 로그인 화면

이번 챕터에서 배울 것:
- \`if\` / \`elif\` / \`else\` 로 **분기**하기
- **비교 연산자**: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`
- **논리 연산자**: \`and\`, \`or\`, \`not\`
- **중첩** 조건문`,
    },
    {
      type: "markdown",
      source: `## 🎯 가장 기본 — if

\`if\` 는 "만약 ~라면"이라는 뜻이에요.

\`\`\`python
if 조건:
    조건이 참일 때 실행할 코드
\`\`\`

**중요한 3가지**:
1. \`if\` 뒤에 **조건**을 적는다
2. 조건 끝에 반드시 **콜론(\`:\`)**
3. 다음 줄은 **들여쓰기**(공백 4칸)`,
    },
    {
      type: "code",
      source: `age = 20

if age >= 18:
    print("성인입니다")
    print("투표할 수 있어요")

print("프로그램 끝")`,
    },
    {
      type: "markdown",
      source: `실행 결과:
- \`age\` 가 \`20\` → \`age >= 18\` 은 \`True\` → 들여쓴 코드 실행
- 들여쓰기가 끝나면 조건문 바깥 (마지막 \`print\`)으로 나옴

**\`age = 15\` 로 바꾸고** 실행해보세요. 조건이 \`False\` 가 되어 "성인입니다" 가 안 나와요.`,
    },
    {
      type: "markdown",
      source: `## ⚖️ 비교 연산자

조건을 만들 때 쓰는 기호들:

| 연산자 | 뜻 | 예시 |
|---|---|---|
| \`==\` | 같다 | \`x == 10\` |
| \`!=\` | 다르다 | \`x != 0\` |
| \`<\` | 작다 | \`x < 5\` |
| \`>\` | 크다 | \`x > 100\` |
| \`<=\` | 작거나 같다 | \`x <= 18\` |
| \`>=\` | 크거나 같다 | \`score >= 60\` |

> ⚠️ **\`=\` 와 \`==\` 는 달라요!**
> - \`=\` : 값을 **대입** (저장)
> - \`==\` : 값이 **같은지 비교**
> 헷갈리면 에러 찾는 데 한참 걸립니다 🙂`,
    },
    {
      type: "code",
      source: `x = 10

print(x == 10)   # True
print(x != 10)   # False
print(x > 5)     # True
print(x < 5)     # False
print(x >= 10)   # True
print(x <= 10)   # True`,
    },
    {
      type: "markdown",
      source: `## 🛣️ if ~ else — 양자택일

"조건이 맞으면 A, 아니면 B" 는 \`if ~ else\` 로 표현해요.

\`\`\`python
if 조건:
    조건이 참일 때
else:
    조건이 거짓일 때
\`\`\``,
    },
    {
      type: "code",
      source: `score = 75

if score >= 60:
    print("합격 🎉")
else:
    print("불합격 😢")`,
    },
    {
      type: "markdown",
      source: `## 🎭 여러 갈래 — elif

세 가지 이상의 선택이 있을 땐 \`elif\` ("else if" 의 줄임) 를 써요.

\`\`\`python
if 조건1:
    A
elif 조건2:
    B
elif 조건3:
    C
else:
    D (모두 아닐 때)
\`\`\`

**위에서부터 순서대로** 조건을 확인해서 **처음 맞는 것** 하나만 실행해요.`,
    },
    {
      type: "code",
      source: `score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"점수: {score}, 등급: {grade}")`,
    },
    {
      type: "markdown",
      source: `**작동 원리**:
- \`85 >= 90\` ? → False, 다음으로
- \`85 >= 80\` ? → **True, "B" 배정, 탈출**
- 나머지 \`elif\` 와 \`else\` 는 **검사하지 않음**`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

나이를 받아서 어떤 그룹인지 출력하는 코드를 만들어보세요:
- \`age < 13\` → \`"어린이"\`
- \`13 <= age < 20\` → \`"청소년"\`
- \`20 <= age < 65\` → \`"성인"\`
- \`age >= 65\` → \`"어르신"\`

아래 셀에서 \`age = 25\` 면 \`"성인"\` 이 나와야 해요.`,
    },
    {
      type: "code",
      source: `age = 25

# 여기에 if/elif/else 로 조건을 작성하세요
`,
      hints: [
        "`if age < 13:` 로 시작하세요.",
        "중간 조건은 `elif age < 20:` 처럼 쓰면 돼요 — 앞에서 이미 걸러졌으니 작은 조건만 필요해요.",
        "마지막은 `else:` 로 65세 이상을 처리하면 깔끔해요.",
      ],
      solution: `age = 25

if age < 13:
    print("어린이")
elif age < 20:
    print("청소년")
elif age < 65:
    print("성인")
else:
    print("어르신")`,
    },
    {
      type: "markdown",
      source: `## 🔗 논리 연산자 — 조건 묶기

여러 조건을 한 번에 확인할 땐 **논리 연산자**를 써요.

| 연산자 | 뜻 | 예시 |
|---|---|---|
| \`and\` | 둘 다 참이어야 함 | \`x > 0 and x < 10\` |
| \`or\`  | 하나만 참이면 됨 | \`x == "사과" or x == "배"\` |
| \`not\` | 참/거짓 뒤집기 | \`not is_admin\` |`,
    },
    {
      type: "code",
      source: `age = 25
has_license = True

# 둘 다 만족해야 함
if age >= 18 and has_license:
    print("운전 가능")
else:
    print("운전 불가")`,
    },
    {
      type: "code",
      source: `day = "일요일"

# 하나만 맞아도 됨
if day == "토요일" or day == "일요일":
    print("주말입니다! 🎉")
else:
    print("평일입니다 😴")`,
    },
    {
      type: "markdown",
      source: `## 🎂 구간 조건 더 쉽게 쓰기

Python은 \`a < x < b\` 같은 **연쇄 비교**를 지원해요:

\`\`\`python
if 13 <= age < 20:   # 청소년
    ...
\`\`\`

대부분의 다른 언어는 \`age >= 13 and age < 20\` 으로 써야 하지만, Python은 수학식처럼 쓸 수 있어요.`,
    },
    {
      type: "code",
      source: `temperature = 22

if 18 <= temperature <= 26:
    print("쾌적한 온도입니다")
elif temperature < 18:
    print("좀 추워요 🥶")
else:
    print("좀 더워요 🥵")`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**윤년 판별 프로그램** 을 만들어보세요.

**윤년 규칙**:
- 4로 나누어 떨어지면 윤년
- **단, 100으로 나누어 떨어지면 윤년이 아님**
- **그러나, 400으로 나누어 떨어지면 다시 윤년**

예시:
- 2024 → 윤년 ✅ (4로 나누어 떨어지고 100 아님)
- 2100 → 평년 ❌ (100으로 나누어 떨어지지만 400 아님)
- 2000 → 윤년 ✅ (400으로 나누어 떨어짐)
- 2023 → 평년 ❌`,
    },
    {
      type: "code",
      source: `year = 2024

# 윤년이면 "윤년입니다", 아니면 "평년입니다" 출력
`,
      hints: [
        "`and` 와 `or` 를 조합해야 해요.",
        "조건: `(4로 나눠지고 100으로 안 나눠짐) 또는 (400으로 나눠짐)` 이면 윤년이에요.",
        "`%` 연산자가 나머지예요. `year % 4 == 0` 은 \"4로 나누어 떨어진다\" 는 뜻.",
      ],
      solution: `year = 2024

if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print("윤년입니다")
else:
    print("평년입니다")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 4 완료!

오늘 배운 것:
- ✅ \`if\` / \`elif\` / \`else\` 로 분기
- ✅ 비교 연산자 6가지
- ✅ \`and\`, \`or\`, \`not\` 로 조건 묶기
- ✅ 연쇄 비교 (\`18 <= x <= 26\`)
- ✅ 들여쓰기의 중요성

**다음 챕터에서는**: 같은 일을 반복하는 **반복문** (\`for\`, \`while\`) 을 배워요.

아래에서 자유롭게 실험해보세요:`,
    },
    {
      type: "code",
      source: `# 여기서 자유롭게 실험해보세요
`,
    },
  ],
  quiz: {
    title: "챕터 4 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `x = 15\nif x > 20:\n    print("크다")\nelif x > 10:\n    print("중간")\nelse:\n    print("작다")`,
        options: ["크다", "중간", "작다", "에러가 난다"],
        correctIndex: 1,
        explanation: "x=15는 >20이 아니지만 >10은 맞아요. elif는 위 조건이 거짓이고 자기 조건이 참일 때 실행돼요.",
      },
      {
        type: "multiple-choice",
        question: "`=` 와 `==` 의 차이는?",
        options: ["둘 다 같은 뜻이다", "= 는 대입, == 는 비교", "= 는 비교, == 는 대입", "== 는 에러가 나는 문법이다"],
        correctIndex: 1,
        explanation: "`=`는 값을 저장(대입)하는 것이고, `==`는 두 값이 같은지 비교하는 것이에요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `age = 25\nhas_ticket = False\n\nif age >= 18 and has_ticket:\n    print("입장 가능")\nelse:\n    print("입장 불가")`,
        options: ["입장 가능", "입장 불가", "True", "에러가 난다"],
        correctIndex: 1,
        explanation: "and는 둘 다 참이어야 해요. age>=18은 True지만 has_ticket이 False라서 전체가 False.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `score = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelif score >= 70:\n    grade = \"C\"\nprint(grade)`,
        options: ["A", "B", "C", "에러가 난다"],
        correctIndex: 1,
        explanation: "85는 >=90이 아니지만 >=80은 맞아요. 처음 맞는 조건 하나만 실행되니까 B.",
      },
    ],
  } satisfies Quiz,
};
