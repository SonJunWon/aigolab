import type { Lesson } from "../../../types/lesson";

export const lesson09: Lesson = {
  id: "ai-intro-09-coding-basics",
  language: "ai-engineering",
  track: "intro",
  order: 9,
  title: "코딩 기초",
  subtitle: "변수, 출력, 조건문 — 프로그래밍의 기본기를 배우자",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 코딩 기초

지금까지 우리는 AI에게 질문하는 방법을 배웠어요.
이번에는 **프로그래밍(코딩)의 기본 개념**을 배워봅시다!

이 플랫폼에서는 **TypeScript(타입스크립트)** 라는 언어로 코드를 실행해요.
TypeScript는 JavaScript(자바스크립트)를 기반으로 한 언어인데, 웹사이트를 만들 때 가장 많이 쓰이는 언어예요.

## 이번 강의에서 배울 것
| # | 내용 |
|---|------|
| 1 | 변수 — 데이터를 담는 상자 |
| 2 | console.log — 화면에 출력하기 |
| 3 | 문자열 — 글자 다루기 |
| 4 | 계산하기 — 사칙연산 |
| 5 | 조건문 — if/else로 분기하기 |
| 6 | 배열 — 여러 데이터 한 번에 담기 |`,
    },
    {
      type: "markdown",
      source: `## 1. 변수 — 데이터를 담는 상자

**변수(Variable)** 는 데이터를 담아두는 **상자**예요.
상자에 이름표를 붙이고, 안에 값을 넣어요.

TypeScript에서 변수를 만드는 두 가지 방법:
- \`const\` — 한번 넣으면 바꿀 수 없는 상자 (상수)
- \`let\` — 나중에 바꿀 수 있는 상자`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// const: 한번 넣으면 바꿀 수 없는 상자
const myName = "김코딩";
const myAge = 12;

console.log("이름:", myName);
console.log("나이:", myAge);

// let: 나중에 바꿀 수 있는 상자
let score = 80;
console.log("처음 점수:", score);

score = 95; // 값을 바꿀 수 있어요!
console.log("바뀐 점수:", score);`,
      hints: [
        "const는 constant(상수)의 줄임말이에요. 한번 정하면 못 바꿔요.",
        "let은 나중에 값을 바꿀 수 있는 변수예요.",
        "= 기호는 '같다'가 아니라 '넣는다'는 뜻이에요!",
      ],
    },
    {
      type: "markdown",
      source: `## 2. console.log — 화면에 출력하기

\`console.log()\`는 **화면에 글자를 보여주는 명령**이에요.
프로그래머가 결과를 확인할 때 가장 많이 사용해요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// console.log()로 다양한 것을 출력해봅시다

console.log("안녕하세요!"); // 글자 출력
console.log(42); // 숫자 출력
console.log(true); // 참/거짓 출력
console.log("1 + 2 =", 1 + 2); // 여러 개를 한 번에 출력
console.log("---구분선---");

// 변수의 값도 출력할 수 있어요
const animal = "고양이";
console.log("내가 좋아하는 동물:", animal);`,
      hints: [
        "console.log() 안에 쉼표(,)로 구분하면 여러 값을 한 줄에 출력할 수 있어요.",
        "글자는 따옴표로 감싸야 해요. 숫자는 그냥 써도 돼요.",
      ],
    },
    {
      type: "markdown",
      source: `## 3. 문자열 — 글자 다루기

프로그래밍에서 글자를 **문자열(String)** 이라고 해요.
따옴표(\`""\` 또는 \`''\`) 안에 넣으면 문자열이 돼요.

특별한 따옴표인 **백틱(\\\`\\\`)** 을 사용하면 문자열 안에 변수를 넣을 수도 있어요!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 문자열 만들기
const greeting = "안녕하세요";
const name = "김코딩";

// 문자열 합치기 (+)
console.log(greeting + ", " + name + "!");

// 템플릿 리터럴 (백틱 사용) — 더 편리해요!
console.log(\`\${greeting}, \${name}!\`);

// 문자열의 길이
console.log(\`이름의 글자 수: \${name.length}\`);

// 대문자/소문자 변환 (영어)
const english = "Hello World";
console.log(\`대문자: \${english.toUpperCase()}\`);
console.log(\`소문자: \${english.toLowerCase()}\`);`,
      hints: [
        "백틱(`) 안에서 ${변수이름}을 쓰면 변수의 값이 자동으로 들어가요.",
        ".length는 문자열의 길이(글자 수)를 알려줘요.",
      ],
    },
    {
      type: "markdown",
      source: `## 4. 계산하기 — 사칙연산

컴퓨터는 **계산기**이기도 해요! 기본적인 수학 연산을 할 수 있어요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 기본 사칙연산
console.log("더하기:", 10 + 3);   // 13
console.log("빼기:", 10 - 3);     // 7
console.log("곱하기:", 10 * 3);   // 30
console.log("나누기:", 10 / 3);   // 3.333...
console.log("나머지:", 10 % 3);   // 1 (10을 3으로 나눈 나머지)

// 변수로 계산하기
const price = 1500;   // 아이스크림 가격
const count = 3;      // 3개 사기
const total = price * count;

console.log(\`아이스크림 \${count}개 = \${total}원\`);

// 용돈 계산
const allowance = 10000; // 용돈
const remaining = allowance - total;
console.log(\`남은 용돈: \${remaining}원\`);`,
      hints: [
        "* 는 곱하기, / 는 나누기예요. 수학의 x, / 대신 사용해요.",
        "% 는 나머지 연산이에요. 10 % 3 = 1 (10 나누기 3의 나머지)",
      ],
    },
    {
      type: "markdown",
      source: `## 5. 조건문 — if/else로 분기하기

**조건문**은 "만약 ~이면 이렇게, 아니면 저렇게" 하는 거예요.

게임에서 "점수가 100점 이상이면 합격!" 같은 것이 조건문이에요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 시험 점수에 따른 등급 매기기
const score = 85;

if (score >= 90) {
  console.log("등급: A (훌륭해요!)");
} else if (score >= 80) {
  console.log("등급: B (잘했어요!)");
} else if (score >= 70) {
  console.log("등급: C (괜찮아요!)");
} else {
  console.log("등급: D (더 노력해봐요!)");
}

// score 값을 바꿔서 다시 실행해보세요!
console.log(\`내 점수: \${score}점\`);`,
      hints: [
        ">= 는 '이상'이라는 뜻이에요. score >= 90은 '점수가 90 이상이면'",
        "if → else if → else 순서로 조건을 확인해요.",
        "위쪽 const score = 85; 의 숫자를 바꿔서 다시 실행해보세요!",
      ],
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 조건문 응용: 놀이공원 입장 확인
const age = 10;
const height = 135; // cm

console.log(\`나이: \${age}살, 키: \${height}cm\`);
console.log("---");

if (age < 3) {
  console.log("무료 입장! (3세 미만)");
} else if (age <= 12) {
  console.log("어린이 요금: 15,000원");
} else {
  console.log("일반 요금: 30,000원");
}

// 놀이기구 탑승 가능 여부
if (height >= 140) {
  console.log("롤러코스터 탑승 가능!");
} else {
  console.log(\`롤러코스터는 키 140cm 이상만 가능해요. (현재 \${height}cm)\`);
}`,
      hints: [
        "age와 height 값을 바꿔보면서 다른 결과를 확인해보세요!",
        "&& 는 '그리고', || 는 '또는'을 뜻해요.",
      ],
    },
    {
      type: "markdown",
      source: `## 6. 배열 — 여러 데이터 한 번에 담기

**배열(Array)** 은 여러 개의 데이터를 하나의 변수에 담을 수 있는 **목록**이에요.
대괄호 \`[]\` 안에 데이터를 넣어요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 배열 만들기
const fruits = ["사과", "바나나", "딸기", "포도", "수박"];
console.log("과일 목록:", fruits);

// 배열에서 하나씩 꺼내기 (인덱스는 0부터 시작!)
console.log("첫 번째 과일:", fruits[0]); // 사과
console.log("세 번째 과일:", fruits[2]); // 딸기

// 배열의 길이
console.log(\`총 \${fruits.length}개의 과일\`);

// 배열에 추가하기
fruits.push("키위");
console.log("키위 추가 후:", fruits);

// 배열의 모든 요소 출력하기
console.log("--- 과일 전체 목록 ---");
for (const fruit of fruits) {
  console.log(\`- \${fruit}\`);
}`,
      hints: [
        "배열의 인덱스(순서)는 0부터 시작해요! fruits[0]이 첫 번째예요.",
        ".push()로 배열 끝에 새 항목을 추가할 수 있어요.",
        "for...of 반복문으로 배열의 모든 항목을 하나씩 꺼낼 수 있어요.",
      ],
    },
    {
      type: "markdown",
      source: `## 종합 실습: AI에게 코딩 문제 만들어달라고 하기

배운 개념을 활용해서 AI에게 연습 문제를 만들어달라고 해봅시다!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 코딩 연습 문제를 만들어달라고 해봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "TypeScript로 초등학생이 풀 수 있는 간단한 코딩 문제 3개를 만들어줘. 변수, 조건문, 배열을 각각 사용하는 문제로 해줘. 문제와 정답 코드를 함께 보여줘.",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "AI가 만들어준 코드를 새로운 셀에 직접 입력하고 실행해보세요!",
      ],
    },
    {
      type: "markdown",
      source: `# Ch09 정리

| 개념 | 설명 | 예시 |
|------|------|------|
| 변수 (const/let) | 데이터를 담는 상자 | \`const name = "코딩"\` |
| console.log | 화면에 출력 | \`console.log("안녕")\` |
| 문자열 (String) | 글자 데이터 | \`"안녕하세요"\` |
| 사칙연산 | 계산하기 | \`+  -  *  /  %\` |
| 조건문 (if/else) | 조건에 따라 분기 | \`if (score >= 90) {...}\` |
| 배열 (Array) | 여러 데이터 목록 | \`["사과", "바나나"]\` |

> 이 기본 개념들은 **모든 프로그래밍 언어**에 존재해요!
> TypeScript, Python, Java... 언어마다 문법은 다르지만 개념은 같습니다.

**다음 강의**: 개발 도구 — 프로그래머가 사용하는 도구들을 알아봅시다!`,
    },
  ],

  quiz: {
    title: "Ch09 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "const와 let의 차이점은 무엇인가요?",
        options: [
          "const는 숫자, let은 글자를 담는다",
          "const는 값을 바꿀 수 없고, let은 바꿀 수 있다",
          "const는 크고, let은 작다",
          "차이가 없다",
        ],
        correctIndex: 1,
        explanation:
          "const(상수)는 한번 값을 넣으면 바꿀 수 없고, let(변수)은 나중에 값을 바꿀 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "배열 ['가', '나', '다'] 에서 '나'를 꺼내려면?",
        options: [
          "[0]",
          "[1]",
          "[2]",
          "[3]",
        ],
        correctIndex: 1,
        explanation:
          "배열의 인덱스는 0부터 시작해요. [0]은 '가', [1]은 '나', [2]는 '다'예요.",
      },
      {
        type: "multiple-choice",
        question: "console.log(10 % 3)의 결과는?",
        options: ["3", "3.33", "1", "0"],
        correctIndex: 2,
        explanation:
          "% 는 나머지 연산이에요. 10을 3으로 나누면 몫이 3이고 나머지가 1이므로, 결과는 1입니다.",
      },
      {
        type: "multiple-choice",
        question: "if (score >= 80) 은 어떤 뜻인가요?",
        options: [
          "score가 80보다 작으면",
          "score가 정확히 80이면",
          "score가 80 이상이면",
          "score가 80보다 크면",
        ],
        correctIndex: 2,
        explanation:
          ">= 는 '이상'이라는 뜻이에요. score >= 80은 'score가 80과 같거나 크면'이라는 조건입니다.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 문자열(String)이 아닌 것은?",
        options: [
          '"안녕하세요"',
          "'Hello'",
          "42",
          '`반갑습니다`',
        ],
        correctIndex: 2,
        explanation:
          "42는 따옴표 없이 쓰여진 숫자(Number)예요. 문자열은 반드시 따옴표(\", ', `)로 감싸야 합니다.",
      },
    ],
  },
};
