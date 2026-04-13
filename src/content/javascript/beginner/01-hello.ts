import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson01: Lesson = {
  id: "javascript-beginner-01",
  language: "javascript",
  track: "beginner",
  order: 1,
  title: "첫 번째 JavaScript 코드",
  subtitle: "console.log()로 화면에 글자를 출력해봅시다",
  estimatedMinutes: 10,
  cells: [
    {
      type: "markdown",
      source: `# 👋 첫 번째 JavaScript 코드

JavaScript의 세계에 오신 것을 환영합니다.
JavaScript는 **웹의 언어** — 거의 모든 웹사이트가 이 언어로 동작합니다.

이번 챕터에서 배울 것:
- **컴퓨터에게 명령하는 법** — 코드의 기본 개념
- \`console.log()\` **함수** — 화면(콘솔)에 글자를 보여주는 방법
- 코드를 **실행하는 법** — 결과 확인하기

전혀 몰라도 괜찮아요. 천천히 따라오세요 🙂`,
    },
    {
      type: "markdown",
      source: `## 📢 console.log() — 화면에 글자 출력하기

**\`console.log()\`** 는 JavaScript의 가장 기본적인 명령 중 하나입니다.
괄호 안에 넣은 내용을 화면에 그대로 보여줍니다.

아래 셀의 왼쪽에 있는 ▶ 버튼을 누르거나, 셀 안을 클릭한 뒤 \`Cmd/Ctrl + Enter\` 를 눌러 실행해보세요.`,
    },
    {
      type: "code",
      source: `console.log("안녕하세요!");`,
    },
    {
      type: "markdown",
      source: `### 💡 방금 무슨 일이 일어났나요?

1. JavaScript는 \`console\` 이라는 객체 안의 \`log\` **함수**를 찾았어요
2. 괄호 \`( )\` 안에 들어있는 \`"안녕하세요!"\` 를 받았고
3. 그것을 콘솔(화면)에 출력했어요

**따옴표**(\`" "\`)로 감싼 부분을 JavaScript에서는 **문자열**(string) 이라고 불러요.
"글자들의 모음"이라고 생각하면 돼요.

> 💬 따옴표 종류: 큰따옴표(\`"\`), 작은따옴표(\`'\`), 백틱(\`\\\`\`) 셋 다 됩니다.
> 백틱은 나중에 더 강력한 기능이 있는데, 지금은 그냥 \`"\` 를 쓰면 됩니다.

> 🔧 끝의 세미콜론 \`;\` 은 **선택사항**이에요. 안 써도 동작합니다.
> 다른 사람 코드를 읽기 쉽게 하기 위해 보통 붙입니다.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

당신의 이름을 출력하는 코드를 만들어보세요.

아래 코드 셀의 \`___\` 부분을 지우고, 당신의 이름을 따옴표 안에 적어 넣어보세요.`,
    },
    {
      type: "code",
      source: `console.log("___");`,
      hints: [
        "`___` 세 글자를 지우고 그 자리에 본인 이름을 적어보세요.",
        "따옴표(`\"`) 는 그대로 두고 **안쪽**만 바꿔야 해요. 예: `console.log(\"김철수\")`",
        "따옴표는 **여는 것과 닫는 것**이 짝이 맞아야 해요. 양쪽에 모두 있는지 확인하세요.",
      ],
      solution: `console.log("홍길동");`,
    },
    {
      type: "markdown",
      source: `### 🧩 여러 줄 출력하기

\`console.log()\` 를 여러 번 쓰면 여러 줄을 출력할 수 있어요.
아래 셀을 실행해보세요:`,
    },
    {
      type: "code",
      source: `console.log("첫 번째 줄");
console.log("두 번째 줄");
console.log("세 번째 줄");`,
    },
    {
      type: "markdown",
      source: `## 🔢 숫자도 출력할 수 있어요

글자뿐 아니라 숫자도 출력할 수 있습니다. 숫자는 **따옴표 없이** 적습니다.`,
    },
    {
      type: "code",
      source: `console.log(42);
console.log(3.14);
console.log(2 + 3);`,
    },
    {
      type: "markdown",
      source: `마지막 줄에 주목해보세요. \`2 + 3\` 을 그대로 출력하지 않고, **계산한 결과인 \`5\`** 를 출력했습니다.
JavaScript도 간단한 계산기처럼 쓸 수 있어요.

사용 가능한 기호:
- \`+\` 덧셈
- \`-\` 뺄셈
- \`*\` 곱셈
- \`/\` 나눗셈
- \`%\` 나머지 (예: \`10 % 3\` = 1)
- \`**\` 거듭제곱 (예: \`2 ** 3\` = 8)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

다음 계산 결과를 출력해보세요:

1. \`15 + 27\`
2. \`100 - 42\`
3. \`8 * 7\`

아래 셀에 \`console.log()\` 를 세 번 써서 결과를 보여주세요.`,
    },
    {
      type: "code",
      source: `// 여기에 코드를 작성하세요
`,
      hints: [
        "계산 결과를 보여주려면 `console.log()` 를 써야 해요. 세 번의 `console.log()` 가 필요해요.",
        "괄호 안에 계산식을 바로 넣을 수 있어요. 예: `console.log(15 + 27)` — 그럼 `42` 가 출력돼요.",
        "수학 기호는 **`+`** (덧셈), **`-`** (뺄셈), **`*`** (곱셈) 을 써요. 곱셈은 `×` 가 아니에요!",
      ],
      solution: `console.log(15 + 27);
console.log(100 - 42);
console.log(8 * 7);`,
    },
    {
      type: "markdown",
      source: `## ✨ 보너스 — 마지막 표현식의 값

JavaScript 노트북에는 **편리한 기능**이 하나 있어요.
\`console.log()\` 를 안 써도, **셀의 마지막 줄이 표현식이면 결과가 자동으로 표시**됩니다.

아래 셀을 실행해보세요:`,
    },
    {
      type: "code",
      source: `2 + 3`,
    },
    {
      type: "markdown",
      source: `결과 \`5\` 가 표시되죠? 빠르게 계산만 해보고 싶을 때 편합니다.

단, **여러 줄을 출력**하고 싶다면 여전히 \`console.log()\` 를 써야 해요.`,
    },
    {
      type: "markdown",
      source: `## 🚨 에러를 만나면?

프로그래밍에서 **에러는 자연스러운 일**이에요. 두려워하지 마세요.
아래 셀을 일부러 실행해볼까요?`,
    },
    {
      type: "code",
      source: `console.log(안녕하세요);`,
    },
    {
      type: "markdown",
      source: `위 코드를 실행하면 **빨간색 에러 메시지**가 나타납니다.
\`ReferenceError: 안녕하세요 is not defined\` 같은 메시지예요.

이 메시지가 말하는 것은:
> "'안녕하세요' 라는 이름을 못 찾겠어요"

**원인**: 따옴표를 빼먹어서 JavaScript가 \`안녕하세요\` 를 **문자열**이 아니라 **변수 이름**으로 해석했기 때문이에요.

**고치는 법**: 아래 셀처럼 따옴표를 다시 붙이면 됩니다.`,
    },
    {
      type: "code",
      source: `console.log("안녕하세요");`,
    },
    {
      type: "markdown",
      source: `## 🎉 첫 챕터 완료!

오늘 배운 것:
- ✅ \`console.log()\` 로 화면에 글자와 숫자를 출력
- ✅ 문자열은 \`" "\` 로 감싼다
- ✅ JavaScript는 계산도 할 수 있다 (\`+ - * / % **\`)
- ✅ 마지막 표현식은 자동으로 결과가 보인다
- ✅ 에러는 무섭지 않다 — 메시지를 읽어보면 힌트가 있다

**다음 챕터에서는**: 값을 저장하는 **변수(variable)** 에 대해 배웁니다.

궁금한 점이나 시도해보고 싶은 것이 있으면 아래에 자유롭게 셀을 추가해서 실험해보세요! 🧪`,
    },
    {
      type: "code",
      source: `// 여기서 자유롭게 실험해보세요
`,
    },
  ],
  quiz: {
    title: "챕터 1 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log("2 + 3");`,
        options: ["5", "2 + 3", '"2 + 3"', "에러가 난다"],
        correctIndex: 1,
        explanation:
          "따옴표 안에 있으면 그대로 글자로 출력돼요. 계산이 아니라 문자열이에요.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 에러가 나는 코드는?",
        options: [
          'console.log("Hello")',
          "console.log(42)",
          "console.log(Hello)",
          "console.log(3 + 5)",
        ],
        correctIndex: 2,
        explanation:
          "Hello에 따옴표가 없으면 JavaScript는 Hello라는 변수를 찾으려 하고, 없으니 ReferenceError가 나요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log(10 - 3 * 2);`,
        options: ["14", "4", "8", "에러가 난다"],
        correctIndex: 1,
        explanation:
          "곱셈(*)이 뺄셈(-)보다 먼저 계산돼요. 3*2=6, 그 다음 10-6=4",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log(7 % 3);`,
        options: ["2", "1", "0", "2.33"],
        correctIndex: 1,
        explanation:
          "`%` 는 나머지 연산자예요. 7을 3으로 나누면 몫이 2이고 나머지는 1.",
      },
    ],
  } satisfies Quiz,
};
