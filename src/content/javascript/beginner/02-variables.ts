import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson02: Lesson = {
  id: "javascript-beginner-02",
  language: "javascript",
  track: "beginner",
  order: 2,
  title: "변수와 데이터 타입",
  subtitle: "let, const로 값을 저장하고 다양한 데이터 타입을 알아봅니다",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 📦 변수 — 값을 담는 상자

값을 한 번 쓰고 끝내면 아쉽잖아요? 다시 사용하려면 **이름표가 붙은 상자에 담아두면** 편합니다.
이 상자가 바로 **변수(variable)** 입니다.

이번 챕터에서 배울 것:
- \`let\` 과 \`const\` — 변수를 만드는 두 가지 방법
- 데이터 타입 — 숫자, 문자열, 불리언, undefined, null
- \`typeof\` — 값의 타입 확인하기
- 변수 이름 짓는 규칙`,
    },
    {
      type: "markdown",
      source: `## 🔧 변수 만들기 — \`let\` 과 \`const\`

변수를 만들 때 두 가지 키워드를 씁니다:

- **\`let\`** — 나중에 값을 **바꿀 수 있는** 변수
- **\`const\`** — 한 번 정하면 **바꿀 수 없는** 변수 (상수, constant)

문법은 똑같아요:
\`\`\`
let 이름 = 값;
const 이름 = 값;
\`\`\`

\`=\` 는 "같다"가 아니라 **"오른쪽 값을 왼쪽에 담아라"** 라는 뜻이에요.`,
    },
    {
      type: "code",
      source: `let age = 25;
const name = "철수";

console.log(age);
console.log(name);`,
    },
    {
      type: "markdown",
      source: `잘 작동했죠? \`age\` 라는 상자에 \`25\` 를, \`name\` 이라는 상자에 \`"철수"\` 를 담았고,
\`console.log()\` 로 그 값을 꺼내 보여줬습니다.

> 💡 변수 이름은 따옴표 **없이** 적습니다. 따옴표는 글자(문자열)에만 써요.`,
    },
    {
      type: "markdown",
      source: `## 🔄 \`let\` — 값 바꾸기

\`let\` 으로 만든 변수는 나중에 다른 값을 다시 넣을 수 있어요.`,
    },
    {
      type: "code",
      source: `let score = 70;
console.log(score);

score = 85;  // 새 값 대입
console.log(score);

score = score + 10;  // 자기 자신을 이용한 변경도 가능
console.log(score);`,
    },
    {
      type: "markdown",
      source: `### ⚠️ \`const\` — 바꾸려고 하면 에러

\`const\` 로 만든 변수는 다시 대입하려고 하면 에러가 납니다.`,
    },
    {
      type: "code",
      source: `const PI = 3.14;
PI = 3.14159;  // 에러!`,
    },
    {
      type: "markdown",
      source: `\`TypeError: Assignment to constant variable.\` 라고 나오죠?
"상수 변수에 다시 대입할 수 없다" 라는 뜻이에요.

> 💡 **언제 \`let\`, 언제 \`const\`?**
> - 일단 \`const\` 로 시작하세요. 안 바뀌면 그대로 두면 됩니다.
> - 바꿀 일이 생기면 \`let\` 으로 바꾸세요.
> - 이렇게 하면 "이 변수는 절대 안 바뀐다"는 정보가 코드에서 명확해져요.`,
    },
    {
      type: "markdown",
      source: `## 🎨 데이터 타입 — 값의 종류

JavaScript의 기본 데이터 타입:

| 타입 | 예 | 설명 |
|---|---|---|
| **Number** | \`42\`, \`3.14\`, \`-7\` | 숫자 (정수, 소수 모두) |
| **String** | \`"안녕"\`, \`'JS'\` | 문자열 (글자) |
| **Boolean** | \`true\`, \`false\` | 참/거짓 |
| **undefined** | \`undefined\` | "값이 정해지지 않음" |
| **null** | \`null\` | "값이 비어있음" (의도적으로) |

각 타입을 변수에 담아볼게요:`,
    },
    {
      type: "code",
      source: `const num = 42;
const str = "안녕하세요";
const bool = true;
let nothing;            // 값을 안 넣으면 undefined
const empty = null;     // 의도적인 빈 값

console.log(num);
console.log(str);
console.log(bool);
console.log(nothing);
console.log(empty);`,
    },
    {
      type: "markdown",
      source: `## 🔍 \`typeof\` — 값의 타입 확인하기

어떤 값의 타입이 궁금하면 \`typeof\` 를 쓰면 됩니다.`,
    },
    {
      type: "code",
      source: `console.log(typeof 42);          // "number"
console.log(typeof "hello");     // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"  ← 역사적인 버그, 그냥 외워두세요`,
    },
    {
      type: "markdown",
      source: `> 🐛 마지막 줄의 \`typeof null\` 이 \`"object"\` 라고 나오는 건 JavaScript의 유명한 **레거시 버그**예요.
> 사실 null은 객체가 아니지만, 1995년에 만들어진 이래로 호환성 때문에 못 고치고 있습니다.
> 그냥 "원래 그렇다"고 외워두세요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

당신의 정보를 변수에 담고 출력해보세요:

1. \`myName\` — 본인 이름 (문자열)
2. \`myAge\` — 본인 나이 (숫자)
3. \`isStudent\` — 학생인지 여부 (\`true\` 또는 \`false\`)

각 변수를 만들고 \`console.log()\` 로 출력하세요.`,
    },
    {
      type: "code",
      source: `// 여기에 변수를 만들고 출력하세요
`,
      hints: [
        "안 바뀌는 정보면 `const`, 바뀔 수 있으면 `let` 으로 만드세요.",
        "예: `const myName = \"홍길동\";`",
        "불리언은 따옴표 없이 `true` 또는 `false` 를 적어요.",
      ],
      solution: `const myName = "홍길동";
const myAge = 25;
const isStudent = true;

console.log(myName);
console.log(myAge);
console.log(isStudent);`,
    },
    {
      type: "markdown",
      source: `## 🧮 변수로 계산하기

변수에 담긴 숫자도 계산에 쓸 수 있어요.`,
    },
    {
      type: "code",
      source: `const price = 1500;
const quantity = 3;
const total = price * quantity;

console.log("가격:", price);
console.log("수량:", quantity);
console.log("합계:", total);`,
    },
    {
      type: "markdown",
      source: `> 💡 \`console.log()\` 안에 **쉼표(\`,\`)로 여러 값을 넘기면** 한 줄에 공백으로 구분돼서 출력됩니다.
> 글자 + 숫자를 같이 보여줄 때 편해요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

원의 면적을 계산해보세요. 공식: **반지름 × 반지름 × 원주율**

1. \`radius\` 변수에 5 (반지름)를 담으세요
2. \`pi\` 변수에 3.14 를 담으세요
3. 면적을 계산해서 \`area\` 변수에 담으세요
4. \`console.log("면적:", area);\` 로 출력하세요`,
    },
    {
      type: "code",
      source: `// 여기에 코드를 작성하세요
`,
      hints: [
        "거듭제곱(`**`)이나 곱셈(`*`)을 쓰면 됩니다. 예: `radius * radius * pi`",
        "또는 거듭제곱: `radius ** 2 * pi`",
        "변수에 담을 때는 `const area = ...;` 처럼 쓰세요.",
      ],
      solution: `const radius = 5;
const pi = 3.14;
const area = radius * radius * pi;

console.log("면적:", area);`,
    },
    {
      type: "markdown",
      source: `## 📛 변수 이름 짓는 규칙

JavaScript 변수 이름:
- ✅ 영문자, 숫자, \`_\`, \`$\` 사용 가능
- ✅ 첫 글자는 **숫자가 아니어야** 함 (\`123abc\` ❌, \`abc123\` ✅)
- ✅ 한글도 가능하지만 권장 안 함
- ❌ JavaScript 예약어(\`let\`, \`const\`, \`if\` 등)는 못 씀
- ❌ 공백, 하이픈(\`-\`) 못 씀

**관례 (꼭 지켜야 하는 건 아니지만 권장)**:
- 일반 변수는 **camelCase**: \`firstName\`, \`totalPrice\`
- 상수는 **UPPER_SNAKE_CASE**: \`MAX_USERS\`, \`API_URL\`
- 의미 있는 이름을 쓰세요: \`x\` 보다 \`age\`, \`tmp\` 보다 \`tempCelsius\``,
    },
    {
      type: "code",
      source: `// 좋은 예
const userName = "alice";
const MAX_RETRIES = 3;
let currentScore = 0;

// 나쁜 예 (실행하지 마세요. 주석 처리됨)
// let 1user = "bob";        // 숫자로 시작 ❌
// let user-name = "carol";  // 하이픈 ❌
// let let = 5;              // 예약어 ❌

console.log(userName);
console.log(MAX_RETRIES);
console.log(currentScore);`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 2 완료!

오늘 배운 것:
- ✅ \`let\` 과 \`const\` 로 변수 만들기
- ✅ 5가지 기본 데이터 타입: Number, String, Boolean, undefined, null
- ✅ \`typeof\` 로 타입 확인
- ✅ 변수로 계산하기
- ✅ \`console.log(a, b, c)\` 로 여러 값 한 번에 출력
- ✅ 변수 이름 짓는 관례 (camelCase, UPPER_SNAKE)

**다음 챕터에서는**: 다양한 **연산자** — 비교, 논리 연산을 배웁니다.

자유롭게 실험해보세요 🧪`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 2 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "다음 중 변수 이름으로 사용할 수 없는 것은?",
        options: ["userName", "_count", "$price", "1user"],
        correctIndex: 3,
        explanation:
          "변수 이름은 숫자로 시작할 수 없어요. `1user` 는 SyntaxError가 납니다.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `let x = 10;
x = x + 5;
console.log(x);`,
        options: ["10", "15", "5", "에러가 난다"],
        correctIndex: 1,
        explanation:
          "`x = x + 5` 는 'x의 현재 값에 5를 더해 다시 x에 담아라' 라는 뜻이에요. 10 + 5 = 15.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 에러가 나는 코드는?",
        options: [
          'let a = 1; a = 2;',
          'const b = 1; b = 2;',
          'let c; c = 5;',
          'const d = 10;',
        ],
        correctIndex: 1,
        explanation:
          "`const` 로 만든 변수에 다시 대입하면 TypeError가 납니다. 두 번째 줄 `b = 2` 가 문제예요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log(typeof "42");`,
        options: ['"number"', '"string"', '"object"', '"undefined"'],
        correctIndex: 1,
        explanation:
          "따옴표가 있으면 문자열이에요. 숫자처럼 보여도 `typeof` 는 `\"string\"` 을 반환합니다.",
      },
    ],
  } satisfies Quiz,
};
