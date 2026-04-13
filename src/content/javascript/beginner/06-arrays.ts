import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson06: Lesson = {
  id: "javascript-beginner-06",
  language: "javascript",
  track: "beginner",
  order: 6,
  title: "배열 — 여러 값을 한 줄에",
  subtitle: "값을 순서대로 담고 다루는 가장 기본적인 자료구조",
  estimatedMinutes: 14,
  cells: [
    {
      type: "markdown",
      source: `# 📋 배열 (Array)

지금까지 변수 하나에는 값 하나만 담았어요. 하지만 "장바구니에 든 상품 5개" 같은 걸 다루려면?
**배열**은 여러 값을 **순서대로** 담는 자료구조입니다.

이번 챕터에서 배울 것:
- 배열 만들기, 접근하기
- \`length\` — 길이 알기
- 추가/삭제: \`push\`, \`pop\`, \`shift\`, \`unshift\`
- 변환: \`map\`, \`filter\`, \`reduce\` (함수형 메서드)
- 검색: \`includes\`, \`indexOf\`, \`find\``,
    },
    {
      type: "markdown",
      source: `## 🛠️ 배열 만들기

대괄호 \`[ ]\` 안에 값을 쉼표로 구분해서 적습니다.`,
    },
    {
      type: "code",
      source: `const fruits = ["사과", "바나나", "딸기"];
const numbers = [10, 20, 30, 40, 50];
const mixed = ["문자열", 42, true, null];  // 다양한 타입 가능
const empty = [];                            // 빈 배열

console.log(fruits);
console.log(numbers);
console.log(mixed);
console.log(empty);`,
    },
    {
      type: "markdown",
      source: `## 📍 인덱스로 접근

배열의 각 자리를 **인덱스(index)** 라고 부르고 **0부터 시작**합니다.

\`\`\`
fruits = [ "사과", "바나나", "딸기" ]
인덱스:    0       1         2
\`\`\``,
    },
    {
      type: "code",
      source: `const fruits = ["사과", "바나나", "딸기"];

console.log(fruits[0]);   // 사과
console.log(fruits[1]);   // 바나나
console.log(fruits[2]);   // 딸기
console.log(fruits[10]);  // undefined (없는 자리)`,
    },
    {
      type: "markdown",
      source: `> 🪤 **함정**: 없는 인덱스에 접근하면 **에러가 아니라 \`undefined\`** 가 나옵니다.
> Python의 IndexError와 다른 점이에요.`,
    },
    {
      type: "markdown",
      source: `## 📏 \`.length\` — 배열의 길이

배열에 몇 개의 요소가 있는지:`,
    },
    {
      type: "code",
      source: `const fruits = ["사과", "바나나", "딸기"];
console.log(fruits.length);  // 3

// 마지막 요소에 접근하는 관용구
console.log(fruits[fruits.length - 1]);  // 딸기

// 모던 문법 — at() 메서드
console.log(fruits.at(-1));  // 딸기 (음수 인덱스로 뒤에서)`,
    },
    {
      type: "markdown",
      source: `## ➕ 추가/삭제

배열은 만든 뒤에도 요소를 넣고 뺄 수 있습니다 (\`const\` 로 선언했어도 **내부 변경은 가능**).

| 메서드 | 동작 |
|---|---|
| \`push(x)\` | **끝에** 추가 |
| \`pop()\` | **끝에서** 제거 (제거된 값 반환) |
| \`unshift(x)\` | **앞에** 추가 |
| \`shift()\` | **앞에서** 제거 (제거된 값 반환) |`,
    },
    {
      type: "code",
      source: `const cart = ["사과"];

cart.push("바나나");        // 끝에 추가
cart.push("딸기");
console.log(cart);          // [사과, 바나나, 딸기]

const last = cart.pop();    // 끝에서 제거
console.log("뺀 것:", last);
console.log(cart);          // [사과, 바나나]

cart.unshift("포도");       // 앞에 추가
console.log(cart);          // [포도, 사과, 바나나]`,
    },
    {
      type: "markdown",
      source: `> 💡 **\`const\` 로 만든 배열인데 어떻게 바뀌어요?**
> \`const\` 는 **변수 자체를 다시 대입**할 수 없게 합니다. 즉, \`cart = [...]\` 를 못해요.
> 하지만 **배열 내부의 요소를 추가/삭제**하는 건 다른 얘기 — 변수가 가리키는 건 여전히 같은 배열이니까 OK.`,
    },
    {
      type: "markdown",
      source: `## 🔄 반복 — for · for...of · forEach

배열을 순회하는 세 가지 방법:`,
    },
    {
      type: "code",
      source: `const scores = [85, 92, 78];

// 1. 전통 for — 인덱스가 필요할 때
for (let i = 0; i < scores.length; i++) {
  console.log(\`\${i}번째: \${scores[i]}\`);
}

// 2. for...of — 값만 필요할 때 (가장 간결)
for (const score of scores) {
  console.log(score);
}

// 3. forEach — 각 요소에 대해 함수 실행
scores.forEach((score, index) => {
  console.log(\`\${index}번째 점수는 \${score}\`);
});`,
    },
    {
      type: "markdown",
      source: `## 🎨 \`map\` — 각 요소를 변환해서 새 배열 만들기

배열의 각 요소에 같은 변환을 적용한 새 배열을 얻고 싶을 때.

문법: \`array.map(요소 => 변환식)\``,
    },
    {
      type: "code",
      source: `const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
console.log(doubled);   // [2, 4, 6, 8, 10]

const squared = numbers.map(n => n * n);
console.log(squared);   // [1, 4, 9, 16, 25]

// 원본은 그대로
console.log(numbers);   // [1, 2, 3, 4, 5]`,
    },
    {
      type: "markdown",
      source: `> 💡 \`n => n * 2\` 는 **화살표 함수** (arrow function) 입니다. 챕터 8에서 자세히 다룹니다.
> 지금은 "n을 받아서 n * 2를 반환" 이라고 이해하면 됩니다.

> 💡 \`map\` 은 **원본 배열을 바꾸지 않고** 새 배열을 만듭니다.
> 이걸 "**불변(immutable) 패턴**" 이라고 해요. 버그가 적은 코드를 만드는 핵심.`,
    },
    {
      type: "markdown",
      source: `## 🧹 \`filter\` — 조건에 맞는 요소만 골라내기

문법: \`array.filter(요소 => 조건)\``,
    },
    {
      type: "code",
      source: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens = numbers.filter(n => n % 2 === 0);
console.log(evens);   // [2, 4, 6, 8, 10]

const greaterThan5 = numbers.filter(n => n > 5);
console.log(greaterThan5);   // [6, 7, 8, 9, 10]`,
    },
    {
      type: "markdown",
      source: `## ➕ \`reduce\` — 모든 요소를 하나로 합치기

배열을 하나의 값으로 줄일 때 (합계, 곱, 최댓값 등).

문법: \`array.reduce((누적, 현재) => 새누적, 초기값)\``,
    },
    {
      type: "code",
      source: `const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("합계:", sum);   // 15

const product = numbers.reduce((acc, n) => acc * n, 1);
console.log("곱:", product); // 120

const max = numbers.reduce((acc, n) => n > acc ? n : acc, numbers[0]);
console.log("최댓값:", max); // 5`,
    },
    {
      type: "markdown",
      source: `\`reduce\` 는 처음에 좀 어려울 수 있어요. 풀어보면:
1. \`acc\` (누적값) 는 처음에 \`0\` (초기값)
2. 첫 번째 요소 \`n=1\` → \`acc = 0 + 1 = 1\`
3. 두 번째 요소 \`n=2\` → \`acc = 1 + 2 = 3\`
4. ... 끝까지 → \`15\`

> 💡 단순 합계라면 \`for...of\` 도 충분해요. \`reduce\` 는 더 복잡한 변환에 빛을 발합니다.`,
    },
    {
      type: "markdown",
      source: `## 🔍 검색 — \`includes\` / \`indexOf\` / \`find\``,
    },
    {
      type: "code",
      source: `const fruits = ["사과", "바나나", "딸기", "포도"];

console.log(fruits.includes("바나나"));    // true (있는지만 확인)
console.log(fruits.includes("키위"));      // false

console.log(fruits.indexOf("딸기"));       // 2 (몇 번째 자리인지)
console.log(fruits.indexOf("키위"));       // -1 (없으면 -1)

// 조건으로 찾기
const numbers = [1, 5, 10, 15, 20];
const found = numbers.find(n => n > 7);
console.log(found);   // 10 (조건 만족하는 첫 번째 값)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

다음 학생 점수 배열에서:

\`\`\`js
const scores = [72, 85, 90, 65, 88, 95, 70];
\`\`\`

1. **80점 이상**인 점수만 골라 \`passed\` 배열에 담으세요
2. \`passed\` 의 평균을 구해 출력하세요`,
    },
    {
      type: "code",
      source: `const scores = [72, 85, 90, 65, 88, 95, 70];

// 여기에 코드를 작성하세요
`,
      hints: [
        "filter 사용: `scores.filter(s => s >= 80)`",
        "평균 = 합계 / 길이. 합계는 reduce 또는 for...of 로.",
        "예: `passed.reduce((a, b) => a + b, 0) / passed.length`",
      ],
      solution: `const scores = [72, 85, 90, 65, 88, 95, 70];

const passed = scores.filter(s => s >= 80);
const avg = passed.reduce((a, b) => a + b, 0) / passed.length;

console.log("합격자 점수:", passed);
console.log("합격자 평균:", avg);`,
    },
    {
      type: "markdown",
      source: `## 🔗 메서드 체이닝 (이어쓰기)

\`map\`, \`filter\`, \`reduce\` 는 모두 **새 배열을 반환**하므로 \`.\` 으로 이어 쓸 수 있어요.`,
    },
    {
      type: "code",
      source: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 짝수만 골라서 → 제곱한 뒤 → 합계
const result = numbers
  .filter(n => n % 2 === 0)   // [2, 4, 6, 8, 10]
  .map(n => n * n)             // [4, 16, 36, 64, 100]
  .reduce((a, b) => a + b, 0); // 220

console.log(result);  // 220`,
    },
    {
      type: "markdown",
      source: `이렇게 함수형 스타일로 쓰면 **"무엇을 할지"가 명확**하고 중간 변수가 없어 깔끔합니다.

> 💡 \`for\` 루프와 \`map/filter/reduce\` 는 둘 다 OK. 팀/취향에 따라 다르게 씁니다. 둘 다 알아두세요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

쇼핑 카트 시뮬레이션:

\`\`\`js
const cart = [
  { name: "사과", price: 1500 },
  { name: "우유", price: 3000 },
  { name: "빵", price: 2500 },
  { name: "과자", price: 1000 },
];
\`\`\`

1. **2000원 이상** 상품의 이름만 \`expensive\` 배열로 (\`["우유", "빵"]\` 같은 형태)
2. 모든 상품의 **총 가격** 출력

(객체는 다음 챕터에서 자세히 배웁니다. 지금은 \`item.price\`, \`item.name\` 으로 접근한다는 것만 알면 OK)`,
    },
    {
      type: "code",
      source: `const cart = [
  { name: "사과", price: 1500 },
  { name: "우유", price: 3000 },
  { name: "빵", price: 2500 },
  { name: "과자", price: 1000 },
];

// 여기에 코드를 작성하세요
`,
      hints: [
        "filter로 가격 조건 거른 뒤 map으로 이름만 추출. 체이닝하면 한 줄.",
        "예: `cart.filter(item => item.price >= 2000).map(item => item.name)`",
        "총 가격은 reduce: `cart.reduce((sum, item) => sum + item.price, 0)`",
      ],
      solution: `const cart = [
  { name: "사과", price: 1500 },
  { name: "우유", price: 3000 },
  { name: "빵", price: 2500 },
  { name: "과자", price: 1000 },
];

const expensive = cart
  .filter(item => item.price >= 2000)
  .map(item => item.name);

const total = cart.reduce((sum, item) => sum + item.price, 0);

console.log("2천원 이상 상품:", expensive);
console.log("총 가격:", total);`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 6 완료!

오늘 배운 것:
- ✅ 배열 만들기 \`[1, 2, 3]\`, 인덱스 \`arr[0]\`, 길이 \`arr.length\`
- ✅ \`push / pop / shift / unshift\` 로 추가/삭제
- ✅ \`for / for...of / forEach\` 로 순회
- ✅ \`map\` — 변환, \`filter\` — 거르기, \`reduce\` — 모으기
- ✅ \`includes / indexOf / find\` 로 검색
- ✅ 메서드 체이닝으로 함수형 스타일
- ✅ \`const\` 배열의 내부 변경은 OK (재할당만 금지)

**다음 챕터에서는**: 이름표 붙은 데이터 묶음 — **객체(Object)** 를 배웁니다.

자유롭게 실험해보세요 🧪`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 6 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const arr = [10, 20, 30];
console.log(arr[3]);`,
        options: ["30", "0", "undefined", "에러가 난다"],
        correctIndex: 2,
        explanation:
          "JavaScript 배열은 없는 인덱스에 접근하면 undefined를 반환해요. 에러가 나지 않습니다.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 arr는 어떻게 될까요?",
        code: `const arr = [1, 2, 3];
arr.push(4);
arr.shift();
console.log(arr);`,
        options: ["[1, 2, 3, 4]", "[2, 3, 4]", "[1, 2, 3]", "[4, 3, 2]"],
        correctIndex: 1,
        explanation:
          "push(4) → [1,2,3,4], shift() → 앞을 빼서 [2,3,4].",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 result는 무엇일까요?",
        code: `const result = [1, 2, 3, 4, 5]
  .filter(n => n > 2)
  .map(n => n * 10);
console.log(result);`,
        options: ["[10, 20, 30, 40, 50]", "[30, 40, 50]", "[3, 4, 5]", "[2, 3, 4, 5]"],
        correctIndex: 1,
        explanation:
          "filter로 [3,4,5] → map으로 각각 *10 → [30, 40, 50].",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const sum = [10, 20, 30].reduce((a, b) => a + b, 100);
console.log(sum);`,
        options: ["60", "150", "160", "100"],
        correctIndex: 2,
        explanation:
          "reduce 초기값이 100이라 100+10+20+30 = 160. 초기값을 깜빡하기 쉬워요!",
      },
    ],
  } satisfies Quiz,
};
