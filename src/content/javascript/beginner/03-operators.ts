import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson03: Lesson = {
  id: "javascript-beginner-03",
  language: "javascript",
  track: "beginner",
  order: 3,
  title: "연산자 — 산술 · 비교 · 논리",
  subtitle: "값을 계산하고 비교하고 논리적으로 결합합니다",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 🧮 연산자

연산자(operator)는 **값을 계산·비교·결합하는 기호**예요.
이번 챕터에서는 세 종류를 배웁니다:

1. **산술 연산자** — \`+ - * / % **\`
2. **비교 연산자** — \`=== !== > < >= <=\`
3. **논리 연산자** — \`&& || !\`

특히 비교에서 JavaScript의 **유명한 함정**(== vs ===)을 함께 다룹니다.`,
    },
    {
      type: "markdown",
      source: `## ➕ 산술 연산자

이미 챕터 1에서 일부 봤지만 정리:

| 기호 | 의미 | 예 | 결과 |
|---|---|---|---|
| \`+\` | 덧셈 | \`5 + 3\` | 8 |
| \`-\` | 뺄셈 | \`10 - 4\` | 6 |
| \`*\` | 곱셈 | \`6 * 7\` | 42 |
| \`/\` | 나눗셈 | \`15 / 4\` | 3.75 |
| \`%\` | 나머지 | \`15 % 4\` | 3 |
| \`**\` | 거듭제곱 | \`2 ** 10\` | 1024 |`,
    },
    {
      type: "code",
      source: `console.log(5 + 3);
console.log(15 / 4);
console.log(15 % 4);
console.log(2 ** 10);`,
    },
    {
      type: "markdown",
      source: `### ⚠️ 문자열 + 문자열 = 연결

\`+\` 가 숫자에는 덧셈이지만, **문자열에는 연결(concatenation)** 입니다.`,
    },
    {
      type: "code",
      source: `console.log("Hello" + " " + "World");
console.log("나이: " + 25);
console.log("1" + "2");      // 주의! "12" (문자열 연결)
console.log(1 + 2);          // 3 (숫자 덧셈)`,
    },
    {
      type: "markdown",
      source: `> 🪤 **함정**: \`"1" + "2"\` 는 \`"12"\` 입니다. 따옴표가 있으면 숫자처럼 보여도 문자열이에요.

> 💡 **더 좋은 방법** — 백틱 문자와 \`\${...}\` 형식으로 **템플릿 리터럴**을 쓸 수 있어요:`,
    },
    {
      type: "code",
      source: `const name = "철수";
const age = 25;

// 옛날 방식 (덧셈 연결)
console.log("이름: " + name + ", 나이: " + age);

// 모던 방식 (템플릿 리터럴)
console.log(\`이름: \${name}, 나이: \${age}\`);`,
    },
    {
      type: "markdown",
      source: `백틱 문자 안에서 \`\${변수}\` 형식을 쓰면 변수 값이 자동으로 들어갑니다.
훨씬 읽기 편하죠? 앞으로는 가능하면 템플릿 리터럴을 권장합니다.`,
    },
    {
      type: "markdown",
      source: `## ⚖️ 비교 연산자 — 결과는 \`true\` 또는 \`false\`

값을 비교하는 연산자입니다. 결과는 항상 **불리언**(\`true\` / \`false\`)이에요.

| 기호 | 의미 |
|---|---|
| \`===\` | 같다 (엄격한 같음) |
| \`!==\` | 다르다 (엄격한 다름) |
| \`>\` | 크다 |
| \`<\` | 작다 |
| \`>=\` | 크거나 같다 |
| \`<=\` | 작거나 같다 |`,
    },
    {
      type: "code",
      source: `console.log(5 > 3);     // true
console.log(5 < 3);     // false
console.log(5 === 5);   // true
console.log(5 !== 3);   // true
console.log(5 >= 5);    // true
console.log("a" === "a"); // true (문자열도 비교 가능)`,
    },
    {
      type: "markdown",
      source: `## 🪤 함정 — \`==\` vs \`===\`

JavaScript에는 두 종류의 "같음" 비교가 있어요:

- **\`==\`** (느슨한 비교, loose equality) — **타입을 자동 변환**해서 비교
- **\`===\`** (엄격한 비교, strict equality) — 타입까지 같아야 true

예를 들면:`,
    },
    {
      type: "code",
      source: `console.log(1 == "1");   // true  (느슨한 비교 — "1" 을 1로 변환)
console.log(1 === "1");  // false (엄격한 비교 — number ≠ string)

console.log(0 == false); // true  (false → 0)
console.log(0 === false); // false

console.log(null == undefined);  // true
console.log(null === undefined); // false`,
    },
    {
      type: "markdown",
      source: `> 🚨 **권장**: 항상 \`===\` 와 \`!==\` 를 쓰세요!
>
> \`==\` 의 자동 변환은 예측이 어렵고 버그의 원인이 됩니다.
> 모던 JavaScript 코드는 거의 모두 \`===\` 를 씁니다.

이 책에서도 앞으로 항상 \`===\` 를 사용합니다.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

다음 비교의 결과를 **예측**한 뒤 실행해서 확인해보세요:

\`\`\`js
console.log(10 > 5);
console.log(10 === "10");
console.log("apple" === "Apple");
console.log(3 + 4 === 7);
\`\`\`

먼저 종이나 머릿속으로 결과를 적어보고, 실행 결과와 비교해보세요.`,
    },
    {
      type: "code",
      source: `console.log(10 > 5);
console.log(10 === "10");
console.log("apple" === "Apple");
console.log(3 + 4 === 7);`,
    },
    {
      type: "markdown",
      source: `정답:
1. \`true\` — 10은 5보다 크다
2. \`false\` — 숫자 10과 문자열 "10"은 엄격 비교에서 다름
3. \`false\` — 대소문자가 다름 ("a" vs "A")
4. \`true\` — \`3+4\` 가 먼저 계산되어 \`7 === 7\``,
    },
    {
      type: "markdown",
      source: `## 🔗 논리 연산자

여러 조건을 결합할 때 씁니다.

| 기호 | 의미 | 예 |
|---|---|---|
| \`&&\` | AND (둘 다 참) | \`a && b\` |
| \`\\|\\|\` | OR (하나라도 참) | \`a \\|\\| b\` |
| \`!\` | NOT (반대로 뒤집기) | \`!a\` |`,
    },
    {
      type: "code",
      source: `const age = 20;
const hasTicket = true;

console.log(age >= 18 && hasTicket);   // true (둘 다 만족)
console.log(age >= 18 || hasTicket);   // true (하나라도 만족)
console.log(!hasTicket);                // false (true의 반대)

// 복합 조건
const score = 85;
console.log(score >= 60 && score <= 100);  // true (60~100 범위)`,
    },
    {
      type: "markdown",
      source: `### 💡 짧은 회로 평가 (Short-circuit)

\`&&\` 와 \`||\` 는 **꼭 필요할 때만** 다음 값을 확인합니다.

- \`a && b\` — \`a\` 가 false면 \`b\` 는 안 봐도 false 확정 → \`b\` 평가 안 함
- \`a || b\` — \`a\` 가 true면 \`b\` 는 안 봐도 true 확정 → \`b\` 평가 안 함

이 성질은 나중에 챕터 4 (조건문)에서 유용하게 쓰입니다.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

성인 여부를 판별해보세요:

1. \`age\` 변수에 본인 나이를 담으세요
2. \`isAdult\` 변수에 \`age >= 18\` 결과를 담으세요
3. \`isAdult\` 를 출력하세요

응용: \`age\` 가 \`13 이상이고 19 이하\` 면 \`true\` 를 출력하는 \`isTeen\` 도 추가해보세요.`,
    },
    {
      type: "code",
      source: `// 여기에 코드를 작성하세요
`,
      hints: [
        "비교 연산자 결과를 그대로 변수에 담으면 됩니다. 예: `const isAdult = age >= 18;`",
        "범위 체크에는 `&&` 를 쓰세요. 예: `age >= 13 && age <= 19`",
        "수학에서 쓰는 `13 <= age <= 19` 식은 JavaScript에서 작동하지 않아요. 두 비교를 따로 해서 `&&` 로 묶어야 해요.",
      ],
      solution: `const age = 25;
const isAdult = age >= 18;
const isTeen = age >= 13 && age <= 19;

console.log("성인:", isAdult);
console.log("청소년:", isTeen);`,
    },
    {
      type: "markdown",
      source: `## 📊 연산자 우선순위

여러 연산자가 섞이면 어떤 순서로 계산될까요?

대략적인 순서 (위가 먼저):
1. 괄호 \`()\`
2. \`!\` (NOT)
3. \`* / %\`
4. \`+ -\`
5. \`< <= > >=\`
6. \`=== !==\`
7. \`&&\`
8. \`||\`

**복잡한 식에는 괄호를 적극적으로 쓰세요.** 가독성이 훨씬 좋아져요.`,
    },
    {
      type: "code",
      source: `// 괄호 없이
console.log(2 + 3 * 4);            // 14 (3*4 먼저)
console.log(true || false && false); // true (&&가 ||보다 먼저)

// 괄호로 명시
console.log((2 + 3) * 4);          // 20
console.log((true || false) && false); // false`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 3 완료!

오늘 배운 것:
- ✅ 산술 연산자 \`+ - * / % **\`
- ✅ 문자열은 \`+\` 로 연결, 템플릿 리터럴 \`\\\`\\\${...}\\\`\` 가 더 깔끔
- ✅ 비교 연산자 \`=== !== > < >= <=\` — 결과는 \`true\` 또는 \`false\`
- ✅ **\`===\` 를 항상 쓰자** (\`==\` 는 함정 많음)
- ✅ 논리 연산자 \`&& || !\` — 조건 결합
- ✅ 우선순위 헷갈리면 괄호 적극 활용

**다음 챕터에서는**: 이 비교/논리 연산을 활용한 **조건문 (\`if\`/\`else\`)** 을 배웁니다.

자유롭게 실험해보세요 🧪`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 3 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log("3" + 4);`,
        options: ['"34"', "7", '"7"', "에러가 난다"],
        correctIndex: 0,
        explanation:
          "왼쪽이 문자열이면 `+` 는 연결로 동작해요. 4도 문자열로 변환되어 \"34\" 가 됩니다.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log(5 == "5");`,
        options: ["true", "false", "5", "에러가 난다"],
        correctIndex: 0,
        explanation:
          "`==` 는 느슨한 비교라서 \"5\" 를 5로 변환한 뒤 비교해요. 그래서 true. (실무에선 `===` 를 권장합니다.)",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log(true && false);`,
        options: ["true", "false", "1", "0"],
        correctIndex: 1,
        explanation:
          "AND는 둘 다 참이어야 true예요. 하나라도 false면 false.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const x = 7;
console.log(x >= 5 && x <= 10);`,
        options: ["true", "false", "7", "에러가 난다"],
        correctIndex: 0,
        explanation:
          "x=7은 5 이상이면서 10 이하니까 두 조건 모두 참, AND 결과는 true.",
      },
    ],
  } satisfies Quiz,
};
