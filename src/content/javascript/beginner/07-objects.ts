import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson07: Lesson = {
  id: "javascript-beginner-07",
  language: "javascript",
  track: "beginner",
  order: 7,
  title: "객체 — 이름표 붙은 데이터 묶음",
  subtitle: "관련된 값들을 한 덩어리로 다루는 자료구조",
  estimatedMinutes: 14,
  cells: [
    {
      type: "markdown",
      source: `# 🗂️ 객체 (Object)

배열은 **순서가 있는** 값의 모음이었어요. 객체는 **이름표(키)로 값에 접근**하는 모음입니다.

예: 사람 한 명의 정보를 다룰 때
- 배열로: \`["철수", 25, "서울"]\` — "두 번째가 뭔지 매번 기억해야 함"
- 객체로: \`{ name: "철수", age: 25, city: "서울" }\` — "이름표로 명확"

이번 챕터에서 배울 것:
- 객체 만들기, 접근하기 (점·대괄호)
- 속성 추가/수정/삭제
- 객체 순회: \`Object.keys / values / entries\`
- 구조 분해 (destructuring)
- 전개 연산자 \`...\`
- 객체와 메서드 (간단)`,
    },
    {
      type: "markdown",
      source: `## 🛠️ 객체 만들기

중괄호 \`{ }\` 안에 \`키: 값\` 쌍을 쉼표로 나열합니다.`,
    },
    {
      type: "code",
      source: `const person = {
  name: "철수",
  age: 25,
  city: "서울",
  isStudent: false,
};

console.log(person);`,
    },
    {
      type: "markdown",
      source: `각 항목을 **속성(property)** 또는 **키-값 쌍**이라고 불러요.
- 키(key): \`name\`, \`age\`, \`city\`, \`isStudent\`
- 값(value): \`"철수"\`, \`25\`, \`"서울"\`, \`false\`

값에는 어떤 타입이든 올 수 있어요 (숫자, 문자열, 배열, 다른 객체, 함수까지).`,
    },
    {
      type: "markdown",
      source: `## 📍 속성 접근 — 점 \`.\` vs 대괄호 \`[ ]\`

두 가지 방법:`,
    },
    {
      type: "code",
      source: `const person = { name: "철수", age: 25 };

// 점 표기 — 가장 흔함
console.log(person.name);   // 철수
console.log(person.age);    // 25

// 대괄호 표기 — 키가 변수에 들어있을 때
const key = "name";
console.log(person[key]);   // 철수

// 없는 속성 → undefined (에러 아님)
console.log(person.address); // undefined`,
    },
    {
      type: "markdown",
      source: `> 💡 **언제 대괄호 \`[ ]\`?**
> - 키 이름이 변수에 담겨 있을 때
> - 키에 공백이나 특수문자가 있을 때 (예: \`obj["full name"]\`)
> - 그 외엔 점 \`.\` 표기가 더 깔끔해요.`,
    },
    {
      type: "markdown",
      source: `## ➕ 속성 추가/수정/삭제

객체는 만든 뒤에도 자유롭게 바꿀 수 있어요 (\`const\` 여도 OK — 배열과 같음).`,
    },
    {
      type: "code",
      source: `const car = { brand: "Toyota", year: 2020 };

// 추가
car.color = "white";
car["mileage"] = 15000;
console.log(car);   // brand, year, color, mileage

// 수정
car.year = 2024;
console.log(car.year);   // 2024

// 삭제
delete car.mileage;
console.log(car);   // brand, year, color`,
    },
    {
      type: "markdown",
      source: `## 🔍 속성 존재 확인

| 방법 | 의미 |
|---|---|
| \`"key" in obj\` | 키가 있는지 (값은 무엇이든) |
| \`obj.key !== undefined\` | 값이 정의돼 있는지 (대부분 동일) |
| \`obj.hasOwnProperty("key")\` | 자기 자신의 키인지 (상속 제외) |`,
    },
    {
      type: "code",
      source: `const car = { brand: "Toyota", year: 2020 };

console.log("brand" in car);   // true
console.log("color" in car);   // false
console.log(car.brand !== undefined); // true`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

자기 자신을 표현하는 객체 \`me\` 를 만들고 다음을 출력하세요:

- \`name\`, \`age\`, \`favoriteFood\` (문자열 배열) 속성
- \`me.name\`, \`me.age\` 출력
- \`me.favoriteFood\` 의 첫 번째 항목 출력
- \`me\` 객체에 \`hobby\` 속성을 새로 추가하고 다시 출력`,
    },
    {
      type: "code",
      source: `// 여기에 코드를 작성하세요
`,
      hints: [
        "객체 생성: `const me = { name: \"...\", age: ..., favoriteFood: [\"...\", \"...\"] };`",
        "배열 첫 요소: `me.favoriteFood[0]`",
        "속성 추가: `me.hobby = \"...\";`",
      ],
      solution: `const me = {
  name: "홍길동",
  age: 25,
  favoriteFood: ["김치찌개", "라면", "치킨"],
};

console.log(me.name);
console.log(me.age);
console.log(me.favoriteFood[0]);

me.hobby = "코딩";
console.log(me);`,
    },
    {
      type: "markdown",
      source: `## 🔁 객체 순회

배열의 \`for...of\` 처럼 객체에도 순회 방법이 있습니다.`,
    },
    {
      type: "code",
      source: `const person = { name: "철수", age: 25, city: "서울" };

// 1. 키만 — Object.keys()
for (const key of Object.keys(person)) {
  console.log(key);
}
// name, age, city

// 2. 값만 — Object.values()
for (const value of Object.values(person)) {
  console.log(value);
}
// 철수, 25, 서울

// 3. 키와 값 둘 다 — Object.entries()
for (const [key, value] of Object.entries(person)) {
  console.log(\`\${key}: \${value}\`);
}
// name: 철수, age: 25, city: 서울`,
    },
    {
      type: "markdown",
      source: `> 💡 \`for...in\` 도 객체 순회를 지원하지만 잘 안 씁니다 (상속된 속성까지 잡혀서). \`Object.keys()\` 가 안전.`,
    },
    {
      type: "markdown",
      source: `## 🎯 구조 분해 (Destructuring) — 가장 쓸모있는 ES6 기능 중 하나

객체에서 여러 속성을 한 번에 꺼낼 때.`,
    },
    {
      type: "code",
      source: `const person = { name: "철수", age: 25, city: "서울" };

// 옛날 방식
const name1 = person.name;
const age1 = person.age;

// 구조 분해 — 한 줄에
const { name, age, city } = person;
console.log(name, age, city);

// 다른 이름으로 꺼내기
const { name: userName, age: userAge } = person;
console.log(userName, userAge);

// 기본값 — 없으면 사용
const { name: x, country = "한국" } = person;
console.log(x, country);   // 철수 한국`,
    },
    {
      type: "markdown",
      source: `함수 매개변수에서 특히 자주 씁니다 (다음 챕터에서 자세히):
\`\`\`js
function greet({ name, age }) {
  console.log(\`\${name}님, \${age}세\`);
}
greet({ name: "철수", age: 25 });
\`\`\``,
    },
    {
      type: "markdown",
      source: `## 📤 전개 연산자 \`...\` — 객체 복사·합치기

배열에도 있는 그 \`...\` 가 객체에도 동작합니다.`,
    },
    {
      type: "code",
      source: `const person = { name: "철수", age: 25 };

// 복사
const copy = { ...person };
console.log(copy);   // { name: "철수", age: 25 }

// 합치기 (뒤가 우선)
const updated = { ...person, age: 26, city: "서울" };
console.log(updated);
// { name: "철수", age: 26, city: "서울" }

// 원본은 그대로
console.log(person);   // { name: "철수", age: 25 }`,
    },
    {
      type: "markdown",
      source: `> 💡 **불변 패턴**: \`person.age = 26\` 처럼 직접 수정하는 대신 \`{...person, age: 26}\` 로 새 객체를 만드는 게 React/Redux 같은 모던 코드의 표준입니다.

> ⚠️ **얕은 복사 주의**: \`{ ...person }\` 은 1단계만 복사해요. 객체 안의 객체는 같은 참조를 공유합니다.`,
    },
    {
      type: "markdown",
      source: `## 🧩 메서드 — 객체 안의 함수

값 자리에 함수를 넣으면 **메서드**가 됩니다.`,
    },
    {
      type: "code",
      source: `const calculator = {
  result: 0,
  add(n) {
    this.result += n;
    return this.result;
  },
  reset() {
    this.result = 0;
  },
};

calculator.add(5);
calculator.add(10);
console.log(calculator.result);   // 15

calculator.reset();
console.log(calculator.result);   // 0`,
    },
    {
      type: "markdown",
      source: `\`this\` 는 **그 메서드를 호출한 객체**를 가리켜요. 위 예에서는 \`calculator\`.

> ⚠️ \`this\` 는 JavaScript의 까다로운 주제 중 하나. 화살표 함수에서는 동작이 다릅니다 (다음 챕터).
> 입문 단계에서는 "**메서드 안에서 \`this\` 는 그 객체**" 정도로 기억해두세요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

쇼핑몰 상품 객체를 다뤄봅시다:

\`\`\`js
const products = [
  { id: 1, name: "사과", price: 1500, stock: 30 },
  { id: 2, name: "우유", price: 3000, stock: 5 },
  { id: 3, name: "빵", price: 2500, stock: 0 },
  { id: 4, name: "과자", price: 1000, stock: 20 },
];
\`\`\`

1. **재고가 있는** 상품(\`stock > 0\`)만 골라 \`available\` 배열로
2. \`available\` 중 **2000원 이상**인 상품의 이름과 가격을 출력
3. 모든 상품의 **총 재고 가치** (price × stock의 합) 출력

힌트: filter, map, reduce를 연쇄로 쓰세요.`,
    },
    {
      type: "code",
      source: `const products = [
  { id: 1, name: "사과", price: 1500, stock: 30 },
  { id: 2, name: "우유", price: 3000, stock: 5 },
  { id: 3, name: "빵", price: 2500, stock: 0 },
  { id: 4, name: "과자", price: 1000, stock: 20 },
];

// 여기에 코드를 작성하세요
`,
      hints: [
        "available: `products.filter(p => p.stock > 0)`",
        "출력은 forEach: `available.filter(p => p.price >= 2000).forEach(p => console.log(...))`",
        "총 재고 가치: `products.reduce((sum, p) => sum + p.price * p.stock, 0)`",
      ],
      solution: `const products = [
  { id: 1, name: "사과", price: 1500, stock: 30 },
  { id: 2, name: "우유", price: 3000, stock: 5 },
  { id: 3, name: "빵", price: 2500, stock: 0 },
  { id: 4, name: "과자", price: 1000, stock: 20 },
];

const available = products.filter(p => p.stock > 0);
console.log("판매 중:", available);

available
  .filter(p => p.price >= 2000)
  .forEach(p => console.log(\`\${p.name}: \${p.price}원\`));

const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
console.log("총 재고 가치:", totalValue);`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 7 완료!

오늘 배운 것:
- ✅ 객체 \`{ key: value }\` — 이름표로 값에 접근
- ✅ 점 \`.\` 표기, 대괄호 \`[ ]\` 표기
- ✅ 추가/수정 (\`obj.key = value\`), 삭제 (\`delete obj.key\`)
- ✅ \`Object.keys / values / entries\` 로 순회
- ✅ 구조 분해 \`const { a, b } = obj\`
- ✅ 전개 연산자 \`{ ...obj, key: 새값 }\` 로 불변 패턴
- ✅ 메서드 — 객체 속 함수, \`this\` 는 그 객체

**다음 챕터에서는**: 코드의 재사용 단위 — **함수(Function)** 를 깊이 다룹니다.

자유롭게 실험해보세요 🧪`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 7 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const obj = { a: 1, b: 2 };
console.log(obj["a"]);`,
        options: ["undefined", "1", '"a"', "에러가 난다"],
        correctIndex: 1,
        explanation:
          "대괄호 표기에 문자열 키를 넣으면 점 표기와 같은 결과. obj.a = 1.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const person = { name: "철수", age: 25 };
const { age, city = "서울" } = person;
console.log(age, city);`,
        options: ["25 undefined", '25 "서울"', '"철수" 25', "에러"],
        correctIndex: 1,
        explanation:
          "구조 분해에서 city는 person에 없으니 기본값 \"서울\"이 사용돼요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 obj는 어떻게 될까요?",
        code: `const obj = { a: 1, b: 2 };
const updated = { ...obj, b: 99 };
console.log(obj.b, updated.b);`,
        options: ["2 2", "99 99", "2 99", "99 2"],
        correctIndex: 2,
        explanation:
          "전개 연산자는 새 객체를 만들어요. obj는 그대로 b=2, updated는 b=99로 덮어써짐.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const obj = { x: 10 };
console.log("y" in obj);`,
        options: ["true", "false", "undefined", "에러"],
        correctIndex: 1,
        explanation:
          "obj에는 키 \"y\"가 없으니 false. (`in` 연산자는 키 존재 여부를 검사)",
      },
    ],
  } satisfies Quiz,
};
