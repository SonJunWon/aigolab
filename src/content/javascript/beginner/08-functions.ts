import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson08: Lesson = {
  id: "javascript-beginner-08",
  language: "javascript",
  track: "beginner",
  order: 8,
  title: "함수 — 코드의 재사용 단위",
  subtitle: "같은 일을 여러 번 안 쓰고 한 번만 정의해서 호출합니다",
  estimatedMinutes: 14,
  cells: [
    {
      type: "markdown",
      source: `# ⚙️ 함수 (Function)

같은 코드 묶음을 여러 번 쓰고 싶을 때 — **함수**로 한 번 정의해두고 이름으로 불러쓰면 됩니다.
"이름이 붙은 작은 프로그램" 이라고 생각하세요.

이번 챕터에서 배울 것:
- \`function\` 키워드로 함수 선언
- 매개변수와 인자, \`return\` 으로 값 반환
- 함수 표현식 (function expression)
- 화살표 함수 (arrow function) — 모던 JS 표준
- 기본값 매개변수, 나머지 매개변수, 구조 분해
- 함수는 일급 시민 (값처럼 다룸)`,
    },
    {
      type: "markdown",
      source: `## 📜 함수 선언 (Function Declaration)

문법:
\`\`\`
function 이름(매개변수1, 매개변수2) {
  실행할 코드
  return 반환할값;
}
\`\`\``,
    },
    {
      type: "code",
      source: `function greet(name) {
  return \`안녕하세요, \${name}님!\`;
}

const message = greet("철수");
console.log(message);   // 안녕하세요, 철수님!

console.log(greet("영희"));   // 직접 호출도 OK`,
    },
    {
      type: "markdown",
      source: `용어 정리:
- **매개변수(parameter)**: 함수 정의할 때의 \`name\` (받을 자리)
- **인자(argument)**: 호출할 때 넘기는 \`"철수"\` (실제 값)
- **반환값(return value)**: \`return\` 뒤의 값. 호출한 곳으로 돌려줌

> 💡 \`return\` 이 없으면 함수는 \`undefined\` 를 반환합니다.`,
    },
    {
      type: "markdown",
      source: `## 🧮 매개변수 여러 개

쉼표로 나열:`,
    },
    {
      type: "code",
      source: `function add(a, b) {
  return a + b;
}

console.log(add(3, 5));   // 8
console.log(add(10, 20)); // 30

function area(width, height) {
  return width * height;
}
console.log(area(4, 6));  // 24`,
    },
    {
      type: "markdown",
      source: `## 🎁 기본값 매개변수

매개변수에 \`= 기본값\` 을 적으면, 호출할 때 안 넘기면 그 값을 씁니다.`,
    },
    {
      type: "code",
      source: `function greet(name, greeting = "안녕하세요") {
  return \`\${greeting}, \${name}님!\`;
}

console.log(greet("철수"));            // 안녕하세요, 철수님!
console.log(greet("영희", "반갑습니다")); // 반갑습니다, 영희님!`,
    },
    {
      type: "markdown",
      source: `## 📝 함수 표현식 (Function Expression)

함수도 **값**이라서 변수에 담을 수 있어요.`,
    },
    {
      type: "code",
      source: `// 함수 선언 — 이름 있음
function add(a, b) {
  return a + b;
}

// 함수 표현식 — 변수에 담음 (이름 익명)
const multiply = function (a, b) {
  return a * b;
};

console.log(add(2, 3));        // 5
console.log(multiply(2, 3));   // 6`,
    },
    {
      type: "markdown",
      source: `> 💡 **차이점 — 호이스팅(hoisting)**:
> - \`function add(...)\` 선언은 코드 앞부분에서도 호출 가능 (선언이 끌어올려짐)
> - \`const multiply = function(...)\` 표현식은 그 줄 이전엔 호출 불가
>
> 헷갈리면 그냥 **선언이든 표현식이든 정의 뒤에 호출**하는 습관을 들이세요. 안전합니다.`,
    },
    {
      type: "markdown",
      source: `## 🏹 화살표 함수 (Arrow Function) — 모던 표준

함수 표현식의 짧은 형태. 모던 JS 코드에서 가장 자주 보입니다.`,
    },
    {
      type: "code",
      source: `// 함수 표현식
const add1 = function (a, b) {
  return a + b;
};

// 화살표 함수
const add2 = (a, b) => {
  return a + b;
};

// 한 줄짜리 — 중괄호와 return 생략 가능
const add3 = (a, b) => a + b;

// 매개변수 1개면 괄호도 생략 가능
const square = n => n * n;

console.log(add1(2, 3), add2(2, 3), add3(2, 3));  // 5 5 5
console.log(square(5));   // 25`,
    },
    {
      type: "markdown",
      source: `**우리가 챕터 6에서 본 \`map\`, \`filter\`, \`reduce\` 의 콜백이 화살표 함수였어요.**
\`\`\`js
const doubled = [1, 2, 3].map(n => n * 2);
\`\`\`

> ⚠️ 화살표 함수는 **\`this\` 동작이 다릅니다**. 메서드로 쓸 때는 일반 함수가 더 적합할 때가 많아요. 입문 단계에선:
> - 콜백 / 짧은 함수 → 화살표
> - 객체 메서드 → \`function() { }\` 또는 \`{ method() { } }\` 단축형`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**팁 계산기** 함수를 만드세요:

- 함수 이름: \`calculateTip\`
- 매개변수: \`bill\` (총 금액), \`tipPercent\` (팁 비율, 기본값 10)
- 반환: 팁 금액 (\`bill * tipPercent / 100\`)

호출 예:
\`\`\`js
calculateTip(50000)         // 5000 (10% 기본)
calculateTip(50000, 15)     // 7500 (15%)
\`\`\`

함수 선언, 화살표 함수 둘 중 편한 걸로.`,
    },
    {
      type: "code",
      source: `// 여기에 함수 정의 + 호출 예시
`,
      hints: [
        "기본값: `function calculateTip(bill, tipPercent = 10) { ... }`",
        "또는 화살표: `const calculateTip = (bill, tipPercent = 10) => bill * tipPercent / 100;`",
        "return으로 값을 돌려줘야 해요. console.log는 return 뒤에서.",
      ],
      solution: `function calculateTip(bill, tipPercent = 10) {
  return bill * tipPercent / 100;
}

console.log(calculateTip(50000));      // 5000
console.log(calculateTip(50000, 15));  // 7500
console.log(calculateTip(120000, 20)); // 24000`,
    },
    {
      type: "markdown",
      source: `## 🎯 구조 분해 매개변수

객체를 인자로 받을 때 구조 분해 문법으로 깔끔하게 받기:`,
    },
    {
      type: "code",
      source: `function describe({ name, age, city = "서울" }) {
  return \`\${name}님(\${age}세)은 \${city}에 살아요\`;
}

console.log(describe({ name: "철수", age: 25 }));
// 철수님(25세)은 서울에 살아요

console.log(describe({ name: "영희", age: 30, city: "부산" }));
// 영희님(30세)은 부산에 살아요`,
    },
    {
      type: "markdown",
      source: `> 💡 매개변수가 많을 때 객체로 받으면:
> - 호출 시 어떤 값이 무엇인지 명확
> - 순서 신경 안 써도 됨
> - 기본값 + 선택적 인자 처리 쉬움`,
    },
    {
      type: "markdown",
      source: `## 📦 나머지 매개변수 \`...args\`

가변 인자(개수가 정해지지 않은 인자)를 배열로 받기:`,
    },
    {
      type: "code",
      source: `function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2));            // 3
console.log(sum(1, 2, 3, 4, 5));   // 15
console.log(sum());                 // 0

// 일반 매개변수와 함께
function greetAll(greeting, ...names) {
  return names.map(name => \`\${greeting}, \${name}\`);
}

console.log(greetAll("Hi", "Alice", "Bob", "Carol"));
// ["Hi, Alice", "Hi, Bob", "Hi, Carol"]`,
    },
    {
      type: "markdown",
      source: `## 👑 함수는 일급 시민 (First-Class Citizen)

JavaScript의 강점 — **함수도 일반 값처럼** 다룰 수 있어요:
- 변수에 담기 ✓
- 다른 함수의 인자로 넘기기 ✓
- 함수에서 반환하기 ✓
- 배열·객체에 넣기 ✓`,
    },
    {
      type: "code",
      source: `// 함수를 인자로 — 콜백 패턴 (forEach, map, filter 등이 이걸 활용)
function forEach(arr, callback) {
  for (const item of arr) {
    callback(item);
  }
}
forEach([1, 2, 3], (n) => console.log(n * 10));
// 10, 20, 30

// 함수에서 함수를 반환 — 클로저(closure) 기초
function multiplier(factor) {
  return (n) => n * factor;
}
const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5));   // 10
console.log(triple(5));   // 15`,
    },
    {
      type: "markdown",
      source: `\`multiplier(2)\` 가 반환하는 화살표 함수는 \`factor=2\` 를 **기억**합니다.
이걸 **클로저(closure)** 라고 해요. 모던 JS의 핵심 패턴 — 더 깊은 학습은 중급에서.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**가격 할인 계산기** 만들기:

1. 함수 \`makeDiscounter(rate)\` — 할인율 \`rate\` (예: 0.1 = 10%) 받아서, **할인 적용 함수**를 반환
2. \`apply10\` (10% 할인), \`apply20\` (20% 할인) 두 개를 \`makeDiscounter\` 로 만드세요
3. 가격 50000원에 적용해서 출력`,
    },
    {
      type: "code",
      source: `// 여기에 코드를 작성하세요
`,
      hints: [
        "함수에서 함수 반환: `function makeDiscounter(rate) { return price => price * (1 - rate); }`",
        "사용: `const apply10 = makeDiscounter(0.1);`",
        "출력: `console.log(apply10(50000))` → 45000",
      ],
      solution: `function makeDiscounter(rate) {
  return (price) => price * (1 - rate);
}

const apply10 = makeDiscounter(0.1);
const apply20 = makeDiscounter(0.2);

console.log("10% 할인:", apply10(50000));  // 45000
console.log("20% 할인:", apply20(50000));  // 40000
console.log("10% 할인:", apply10(120000)); // 108000`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 8 완료!

오늘 배운 것:
- ✅ \`function 이름() { ... return ... }\` 선언
- ✅ \`const fn = function() {}\` 표현식
- ✅ \`(a, b) => a + b\` 화살표 함수 (모던 표준)
- ✅ 기본값 매개변수, 구조 분해 매개변수, 나머지 매개변수
- ✅ 함수는 일급 시민 (값처럼 다룸)
- ✅ 클로저 — 함수가 만들어진 환경의 변수를 기억

**다음 챕터에서는**: 문자열을 자르고 합치고 검색하는 다양한 메서드 — **문자열 다루기** 를 배웁니다.

자유롭게 실험해보세요 🧪`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 8 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `function add(a, b = 10) {
  return a + b;
}
console.log(add(5));`,
        options: ["5", "10", "15", "에러"],
        correctIndex: 2,
        explanation:
          "b를 안 넘겼으니 기본값 10. 5 + 10 = 15.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const square = n => n * n;
console.log(square(4));`,
        options: ["4", "8", "16", "[Function]"],
        correctIndex: 2,
        explanation:
          "화살표 함수의 한 줄 형태. 4 * 4 = 16.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `function sum(...nums) {
  return nums.length;
}
console.log(sum(1, 2, 3, 4));`,
        options: ["10", "4", "1", "에러"],
        correctIndex: 1,
        explanation:
          "...nums는 모든 인자를 배열로 모아요. [1,2,3,4].length = 4.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `function makeAdder(x) {
  return (y) => x + y;
}
const add5 = makeAdder(5);
console.log(add5(3));`,
        options: ["3", "5", "8", "[Function]"],
        correctIndex: 2,
        explanation:
          "클로저 — 반환된 함수가 x=5를 기억해요. add5(3) = 5 + 3 = 8.",
      },
    ],
  } satisfies Quiz,
};
