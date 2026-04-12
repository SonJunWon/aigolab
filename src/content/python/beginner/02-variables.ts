import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson02: Lesson = {
  id: "python-beginner-02",
  language: "python",
  track: "beginner",
  order: 2,
  title: "값을 기억하는 변수",
  subtitle: "= 기호로 값을 저장하고 다시 꺼내 쓰기",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 📦 값을 기억하는 변수

이전 챕터에서는 \`print()\` 로 결과를 바로 출력했어요.
이번엔 값을 **저장해뒀다가 나중에 꺼내 쓰는 법**을 배워봅시다.

이번 챕터에서 배울 것:
- **변수**(variable) 가 뭔지
- \`=\` 기호로 **값 저장하기**
- 저장한 값을 **다시 사용하기**
- **재할당**: 변수 안의 값을 바꾸기
- 변수 이름을 짓는 **규칙**`,
    },
    {
      type: "markdown",
      source: `## 📝 변수란?

변수는 **값을 담는 상자**라고 생각하면 쉬워요.
상자에 **이름표**를 붙이고, 그 이름으로 안에 든 값을 꺼내 씁니다.

Python에서는 \`=\` 기호로 값을 저장합니다.

\`\`\`python
name = "김철수"
age = 25
\`\`\`

위 코드는 이렇게 읽어요:
- "\`name\` 이라는 상자에 \`"김철수"\` 를 넣어라"
- "\`age\` 라는 상자에 \`25\` 를 넣어라"

> 💬 **주의**: \`=\` 는 "같다"가 아니라 **"넣어라(대입)"** 라는 뜻이에요. "같다"는 \`==\` 로 표현합니다 (나중에 배워요).`,
    },
    {
      type: "code",
      source: `name = "김철수"
age = 25

print(name)
print(age)`,
    },
    {
      type: "markdown",
      source: `위 코드를 실행하면 \`김철수\` 와 \`25\` 가 출력됩니다.

**변수를 한 번 만들어두면 같은 값을 여러 번 쓸 수 있어요.**`,
    },
    {
      type: "code",
      source: `message = "안녕하세요!"

print(message)
print(message)
print(message)`,
    },
    {
      type: "markdown",
      source: `## 🔄 변수끼리 계산하기

변수에 담긴 숫자도 당연히 계산할 수 있어요.`,
    },
    {
      type: "code",
      source: `price = 1500
count = 3

total = price * count
print(total)`,
    },
    {
      type: "markdown",
      source: `**작동 순서**:
1. \`price\` 에 1500을 넣음
2. \`count\` 에 3을 넣음
3. \`price * count\` 를 계산해서 (\`1500 * 3 = 4500\`) \`total\` 에 넣음
4. \`total\` 을 출력 → \`4500\``,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

다음 정보를 변수에 담고, 합계를 계산해서 출력해보세요:
- 사과 가격: 2000원
- 바나나 가격: 1500원
- 오렌지 가격: 3000원

출력 결과: \`6500\``,
    },
    {
      type: "code",
      source: `# 사과, 바나나, 오렌지 가격을 각각 변수에 담아 보세요.
# 그리고 세 변수를 더해서 출력해보세요.
`,
      hints: [
        "먼저 세 개의 변수를 만들어요. 예: `apple = 2000`",
        "세 변수를 모두 만들었으면 `+` 로 더해서 새 변수에 담거나, 바로 `print()` 안에 넣어요.",
        "`print(apple + banana + orange)` 처럼 한 줄로도 가능해요.",
      ],
      solution: `apple = 2000
banana = 1500
orange = 3000

print(apple + banana + orange)`,
    },
    {
      type: "markdown",
      source: `## 🔁 변수의 값 바꾸기 (재할당)

변수는 **이름표가 붙은 상자**니까, **안의 내용물만 바꿀 수 있어요**.
같은 변수에 \`=\` 로 새 값을 넣으면 이전 값은 사라지고 **새 값으로 덮어쓰기** 됩니다.`,
    },
    {
      type: "code",
      source: `x = 10
print(x)      # 10

x = 20
print(x)      # 20

x = x + 5     # 기존 값에 5를 더한다
print(x)      # 25`,
    },
    {
      type: "markdown",
      source: `마지막 줄이 재미있어요: **\`x = x + 5\`**

수학에서는 "x가 x+5와 같다?" 가 말이 안 되지만, 프로그래밍에서 \`=\` 는 **"오른쪽을 계산해서 왼쪽에 넣어라"** 라는 뜻이에요. 그래서:
1. 먼저 오른쪽 \`x + 5\` 를 계산 → \`20 + 5 = 25\`
2. 그 결과를 \`x\` 에 다시 넣음
3. \`x\` 는 이제 \`25\``,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

어떤 숫자에 **2를 곱하고, 그 다음 3을 더하는** 코드를 만들어보세요.
아래 코드를 완성해 실행하면 \`23\` 이 나와야 해요.`,
    },
    {
      type: "code",
      source: `number = 10
# 여기에 number 를 2배로 만드는 코드
# 여기에 number 에 3을 더하는 코드

print(number)`,
      hints: [
        "재할당을 써야 해요. `number = number * 2` 로 2배가 돼요.",
        "그 다음 줄에 `number = number + 3` 을 쓰면 3이 더해져요.",
        "순서 중요! 먼저 2배 (10 → 20), 그 다음 +3 (20 → 23)",
      ],
      solution: `number = 10
number = number * 2
number = number + 3

print(number)`,
    },
    {
      type: "markdown",
      source: `## 📋 변수 이름 규칙

변수 이름은 아무렇게나 지을 수 없어요. 몇 가지 규칙이 있습니다:

✅ **가능한 것**:
- 영문자 (\`a-z\`, \`A-Z\`), 숫자 (\`0-9\`), 밑줄 (\`_\`)
- 한국어도 가능 (\`나이 = 25\`) — 하지만 권장하지는 않음

❌ **불가능한 것**:
- 숫자로 시작 (\`2price\` ❌ → \`price2\` ✅)
- 공백 포함 (\`my name\` ❌ → \`my_name\` ✅)
- Python 예약어 (\`if\`, \`for\`, \`print\` 등)

**권장 스타일**:
- 소문자 + 밑줄로 연결: \`user_name\`, \`total_price\`
- 의미 있는 이름: \`x\` 보다 \`age\` 가 좋아요`,
    },
    {
      type: "code",
      source: `# 아래는 모두 유효한 변수 이름이에요
user_name = "Alice"
age2 = 30
_private = "내부용"
THE_ANSWER = 42

print(user_name, age2, _private, THE_ANSWER)`,
    },
    {
      type: "markdown",
      source: `> 💡 \`print\` 는 값 여러 개를 쉼표(\`,\`) 로 구분해서 한 줄에 출력할 수 있어요.`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 2 완료!

오늘 배운 것:
- ✅ \`=\` 로 변수에 값을 저장
- ✅ 변수로 계산하기
- ✅ \`x = x + 1\` 같은 재할당
- ✅ 변수 이름 규칙

**다음 챕터에서는**: 값의 **종류(자료형)** 를 배워요. 숫자와 글자는 어떻게 다른지, 서로 바꾸는 법까지!

아래 빈 셀에서 자유롭게 실험해보세요:`,
    },
    {
      type: "code",
      source: `# 여기서 자유롭게 실험해보세요
`,
    },
  ],
  quiz: {
    title: "챕터 2 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `x = 5\nx = x + 3\nprint(x)`,
        options: ["5", "3", "8", "에러가 난다"],
        correctIndex: 2,
        explanation: "x에 5를 넣고, x+3(=8)을 다시 x에 넣었으니 8이에요.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 올바른 변수 이름은?",
        options: ["2name", "my name", "my_name", "for"],
        correctIndex: 2,
        explanation:
          "변수 이름은 숫자로 시작할 수 없고, 공백을 포함할 수 없고, Python 예약어(for 등)는 쓸 수 없어요. my_name은 밑줄로 연결해서 OK.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `a = 10\nb = a\na = 20\nprint(b)`,
        options: ["10", "20", "30", "에러가 난다"],
        correctIndex: 0,
        explanation:
          "b = a 시점에 a는 10이었으므로 b에 10이 복사돼요. 이후 a가 바뀌어도 b는 그대로 10.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `price = 1000\ncount = 3\ntotal = price * count\ncount = 5\nprint(total)`,
        options: ["5000", "3000", "1000", "에러가 난다"],
        correctIndex: 1,
        explanation:
          "total = price * count 시점에 count는 3이니까 total은 3000. 이후 count를 바꿔도 total은 이미 계산된 값이라 그대로.",
      },
    ],
  } satisfies Quiz,
};
