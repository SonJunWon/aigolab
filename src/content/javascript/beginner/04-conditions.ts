import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson04: Lesson = {
  id: "javascript-beginner-04",
  language: "javascript",
  track: "beginner",
  order: 4,
  title: "조건문 — if · else · switch",
  subtitle: "상황에 따라 다른 코드를 실행합니다",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 🔀 조건문

지금까지는 코드가 항상 위에서 아래로 한 줄씩 실행됐어요.
이제 **상황에 따라 다른 일을 시키고 싶을 때** 쓰는 도구를 배웁니다.

이번 챕터에서 배울 것:
- \`if\` — 조건이 참일 때만 실행
- \`else\` / \`else if\` — 그렇지 않을 때
- \`switch\` — 여러 값 중 하나 골라 분기
- 삼항 연산자 \`?:\` — 짧은 조건식
- "truthy / falsy" — 불리언이 아닌 값의 진리값`,
    },
    {
      type: "markdown",
      source: `## 📝 \`if\` — 조건이 참일 때만

문법:
\`\`\`
if (조건) {
  실행할 코드
}
\`\`\`

괄호 \`(...)\` 안의 조건이 \`true\` 면 중괄호 \`{...}\` 안의 코드가 실행됩니다.`,
    },
    {
      type: "code",
      source: `const age = 25;

if (age >= 18) {
  console.log("성인입니다");
}

console.log("끝!");`,
    },
    {
      type: "markdown",
      source: `\`age\` 가 25라 \`age >= 18\` 이 \`true\` → \"성인입니다\" 출력 → 그 다음 \"끝!\" 출력.

\`age\` 를 \`15\` 로 바꾸면 첫 줄은 안 나오고 \"끝!\" 만 출력됩니다.`,
    },
    {
      type: "markdown",
      source: `## 🔁 \`else\` — 그렇지 않을 때

조건이 거짓이면 다른 코드를 실행하고 싶을 때:

\`\`\`
if (조건) {
  // 참일 때
} else {
  // 거짓일 때
}
\`\`\``,
    },
    {
      type: "code",
      source: `const score = 75;

if (score >= 60) {
  console.log("합격!");
} else {
  console.log("불합격...");
}`,
    },
    {
      type: "markdown",
      source: `## 🔢 \`else if\` — 여러 조건

조건이 셋 이상일 때:`,
    },
    {
      type: "code",
      source: `const score = 85;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else if (score >= 70) {
  console.log("C");
} else {
  console.log("F");
}`,
    },
    {
      type: "markdown",
      source: `**중요**: \`else if\` 는 위에서 아래로 차례로 검사하다가 **처음으로 참이 되는 곳에서 멈춥니다**.
\`score = 95\` 라면 \`>= 90\` 에서 멈추고 그 뒤 조건들은 검사하지 않아요.

> 💡 그래서 **조건 순서가 중요합니다**.
> 만약 \`>= 70\` 을 가장 위에 두면 95점도 "C" 가 나와버려요!
> 좁은 범위(높은 점수)를 먼저 검사하세요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

나이에 따라 다른 메시지를 출력하는 코드를 작성해보세요:

- 0~12세: \`"어린이"\`
- 13~19세: \`"청소년"\`
- 20~64세: \`"성인"\`
- 65세 이상: \`"노인"\`

\`age\` 변수 값을 바꿔가며 결과를 확인해보세요.`,
    },
    {
      type: "code",
      source: `const age = 30;

// 여기에 if/else if/else 작성
`,
      hints: [
        "범위는 위에서부터 좁게 시작하세요. 예: `age <= 12` 먼저, 그 다음 `age <= 19`...",
        "또는 큰 수부터 시작해도 OK: `age >= 65` 먼저, 그 다음 `age >= 20`...",
        "마지막은 `else` 로 처리하면 모든 경우가 커버됩니다.",
      ],
      solution: `const age = 30;

if (age <= 12) {
  console.log("어린이");
} else if (age <= 19) {
  console.log("청소년");
} else if (age <= 64) {
  console.log("성인");
} else {
  console.log("노인");
}`,
    },
    {
      type: "markdown",
      source: `## 🧠 truthy / falsy

\`if\` 의 조건은 꼭 \`true\` / \`false\` 가 아니어도 됩니다.
JavaScript는 다른 값들도 **자동으로 참/거짓 판단**해요.

**falsy** (거짓 취급) 값들 — 외워두면 좋아요:
- \`false\`
- \`0\`, \`-0\`
- \`""\` (빈 문자열)
- \`null\`
- \`undefined\`
- \`NaN\`

이외의 모든 값은 **truthy** (참 취급).`,
    },
    {
      type: "code",
      source: `if ("hello") {
  console.log("문자열은 truthy");
}

if (0) {
  console.log("이건 출력 안 됨");
} else {
  console.log("0은 falsy");
}

const userName = "";
if (userName) {
  console.log("이름:", userName);
} else {
  console.log("이름이 없어요");
}`,
    },
    {
      type: "markdown",
      source: `이 패턴은 **"값이 비어있는지 확인"** 할 때 자주 씁니다:
\`\`\`js
if (!userName) {
  // userName이 falsy (빈 문자열, undefined, null 등)
}
\`\`\``,
    },
    {
      type: "markdown",
      source: `## ⚡ 삼항 연산자 \`?:\` — 짧은 조건식

조건이 단순할 때 \`if/else\` 대신 한 줄로 쓸 수 있어요.

문법:
\`\`\`
조건 ? 참일때값 : 거짓일때값
\`\`\``,
    },
    {
      type: "code",
      source: `const age = 20;
const status = age >= 18 ? "성인" : "미성년";
console.log(status);

// console.log 안에 직접 쓸 수도 있음
console.log(age >= 18 ? "통과" : "실패");`,
    },
    {
      type: "markdown",
      source: `> 💡 삼항 연산자는 **간단한 분기**에만 쓰세요. 너무 많이 중첩하면 오히려 읽기 어려워집니다.
> 복잡하면 그냥 \`if/else\` 가 낫습니다.`,
    },
    {
      type: "markdown",
      source: `## 🎚️ \`switch\` — 여러 값 중 하나 분기

여러 \`else if\` 가 같은 값과의 비교라면 \`switch\` 가 더 깔끔해요.`,
    },
    {
      type: "code",
      source: `const day = "월";

switch (day) {
  case "월":
  case "화":
  case "수":
  case "목":
  case "금":
    console.log("평일");
    break;
  case "토":
  case "일":
    console.log("주말");
    break;
  default:
    console.log("올바른 요일이 아니에요");
}`,
    },
    {
      type: "markdown",
      source: `**중요한 주의점**:
- 각 \`case\` 끝에 \`break\` 를 안 쓰면 **다음 case로 떨어집니다** (fall-through)
- 위 예제에서 월·화·수·목·금이 다 \`break\` 없이 연속된 건 의도된 fall-through (모두 "평일" 출력하려고)
- 보통은 매 case마다 \`break\` 를 잊지 마세요

> 💡 사실 모던 JavaScript에서는 \`switch\` 보다 객체 매핑 패턴이 더 자주 쓰입니다 (나중에 챕터 7에서):
> \`\`\`js
> const day = "월";
> const labels = { 월: "평일", 화: "평일", 토: "주말", 일: "주말" };
> console.log(labels[day] ?? "올바른 요일이 아니에요");
> \`\`\``,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

다음 조건의 대출 가능 여부를 판단하는 코드:

- 만 18세 이상이고
- 신용 점수가 600 이상이고
- 직장이 있는 경우 (\`hasJob === true\`)

→ 모두 만족하면 \`"대출 가능"\`, 아니면 \`"대출 불가"\` 를 출력하세요.

세 변수 (\`age\`, \`creditScore\`, \`hasJob\`) 를 만들고 조건문을 짜보세요.`,
    },
    {
      type: "code",
      source: `// 여기에 코드를 작성하세요
`,
      hints: [
        "모든 조건이 참이어야 하니까 `&&` 로 묶으세요. 예: `age >= 18 && creditScore >= 600 && hasJob`",
        "`hasJob` 자체가 이미 불리언이라 `hasJob === true` 라고 안 써도 됩니다.",
        "삼항 연산자도 가능: `condition ? \"대출 가능\" : \"대출 불가\"`",
      ],
      solution: `const age = 25;
const creditScore = 700;
const hasJob = true;

if (age >= 18 && creditScore >= 600 && hasJob) {
  console.log("대출 가능");
} else {
  console.log("대출 불가");
}`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 4 완료!

오늘 배운 것:
- ✅ \`if / else / else if\` 로 분기
- ✅ 조건은 위에서부터 좁은 범위를 먼저 (순서 중요!)
- ✅ truthy / falsy — \`0 "" null undefined NaN false\` 가 falsy
- ✅ 삼항 연산자 \`조건 ? 참값 : 거짓값\`
- ✅ \`switch / case / break / default\` 로 값 분기
- ✅ \`break\` 잊으면 fall-through

**다음 챕터에서는**: 같은 일을 여러 번 반복하는 **반복문(for, while)** 을 배웁니다.

자유롭게 실험해보세요 🧪`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 4 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const x = 7;
if (x > 10) {
  console.log("A");
} else if (x > 5) {
  console.log("B");
} else {
  console.log("C");
}`,
        options: ["A", "B", "C", "B와 C 둘 다"],
        correctIndex: 1,
        explanation:
          "x=7은 10보다 크지 않지만 5보다는 크니까 두 번째 분기에서 \"B\" 출력. else if는 첫 참인 곳에서 멈춰요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const name = "";
if (name) {
  console.log("있음");
} else {
  console.log("없음");
}`,
        options: ['"있음"', '"없음"', '""', "에러가 난다"],
        correctIndex: 1,
        explanation:
          "빈 문자열은 falsy 값이에요. 그래서 else 분기로 가서 \"없음\" 출력.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const score = 90;
const grade = score >= 80 ? "Pass" : "Fail";
console.log(grade);`,
        options: ['"Pass"', '"Fail"', "90", "true"],
        correctIndex: 0,
        explanation:
          "삼항 연산자: 조건이 참(90>=80)이면 첫 번째 값(\"Pass\"), 거짓이면 두 번째 값을 반환해요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const day = "토";
switch (day) {
  case "토":
  case "일":
    console.log("주말");
    break;
  default:
    console.log("평일");
}`,
        options: ['"주말"', '"평일"', '"주말"과 "평일" 둘 다', "에러"],
        correctIndex: 0,
        explanation:
          "case \"토\": 다음에 break가 없어서 case \"일\":의 코드(\"주말\" 출력)로 떨어져요. 그 후 break로 빠져나옵니다. (의도된 fall-through)",
      },
    ],
  } satisfies Quiz,
};
