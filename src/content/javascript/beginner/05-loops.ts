import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson05: Lesson = {
  id: "javascript-beginner-05",
  language: "javascript",
  track: "beginner",
  order: 5,
  title: "반복문 — for · while",
  subtitle: "같은 일을 여러 번 반복합니다",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 🔁 반복문

같은 일을 100번, 1000번 반복해야 할 때 직접 100줄을 쓰진 않겠죠.
**반복문**은 컴퓨터에게 "이 일을 N번 해줘" 하고 시킬 수 있는 도구입니다.

이번 챕터에서 배울 것:
- \`for\` — 횟수가 정해진 반복
- \`while\` — 조건이 참인 동안 반복
- \`for...of\` — 배열·문자열의 각 요소 순회
- \`break\` / \`continue\` — 반복 제어`,
    },
    {
      type: "markdown",
      source: `## 🔢 \`for\` — 횟수가 정해진 반복

문법:
\`\`\`
for (초기화; 조건; 증감) {
  반복할 코드
}
\`\`\`

가장 흔한 형태: **0부터 N-1까지 i를 증가**시키며 반복`,
    },
    {
      type: "code",
      source: `for (let i = 0; i < 5; i++) {
  console.log("i는 " + i);
}`,
    },
    {
      type: "markdown",
      source: `풀어보면:
1. **초기화**: \`let i = 0\` — i를 0으로 시작
2. **조건 검사**: \`i < 5\` — 참이면 본문 실행, 거짓이면 종료
3. **본문 실행**: \`console.log(...)\`
4. **증감**: \`i++\` — i를 1 증가 (\`i = i + 1\` 의 줄임)
5. 다시 2번으로

> 💡 \`i++\` 는 \`i += 1\` 와 같고, \`i--\` 는 \`i -= 1\`. 자주 쓰는 단축이에요.`,
    },
    {
      type: "markdown",
      source: `### 💪 응용: 1부터 10까지의 합

\`for\` 로 합계를 구해봅시다.`,
    },
    {
      type: "code",
      source: `let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum = sum + i;  // sum += i 와 같음
}
console.log("합계:", sum);`,
    },
    {
      type: "markdown",
      source: `> 💡 \`sum += i\` 는 \`sum = sum + i\` 의 단축 표기입니다.
> 비슷하게 \`-=\`, \`*=\`, \`/=\`, \`%=\` 도 있어요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

1부터 20까지 출력하되, **짝수만** 출력하는 코드를 작성하세요.

힌트: \`%\` (나머지) 연산자 — \`i % 2 === 0\` 이면 짝수.`,
    },
    {
      type: "code",
      source: `// 여기에 코드를 작성하세요
`,
      hints: [
        "for 문 안에 if 문을 넣어요. 짝수 조건일 때만 console.log.",
        "예: `if (i % 2 === 0) { console.log(i); }`",
        "또는 i를 2씩 증가시키는 방법도 있어요: `for (let i = 2; i <= 20; i += 2)`",
      ],
      solution: `for (let i = 1; i <= 20; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}`,
    },
    {
      type: "markdown",
      source: `## 🚦 \`while\` — 조건이 참인 동안 반복

횟수를 정확히 모르고 **"이 조건이 만족되는 동안"** 반복하고 싶을 때.

문법:
\`\`\`
while (조건) {
  반복할 코드
}
\`\`\``,
    },
    {
      type: "code",
      source: `let n = 1;
while (n < 100) {
  n = n * 2;  // n을 두 배로
}
console.log("처음으로 100을 넘은 값:", n);`,
    },
    {
      type: "markdown",
      source: `n이 1, 2, 4, 8, 16, 32, 64, 128 이 되면 \`n < 100\` 이 false → 반복 종료.
결과는 128.

> 🚨 **무한루프 주의!**
> \`while (true) { console.log("끝없음"); }\` 같은 코드는 영원히 실행됩니다.
> 조건 안에 **언젠가 false가 되도록** 안에서 값을 바꿔야 해요.`,
    },
    {
      type: "markdown",
      source: `## 🛑 \`break\` — 반복 즉시 종료

원하는 결과를 찾으면 더 돌 필요 없죠. \`break\` 로 빠져나옵니다.`,
    },
    {
      type: "code",
      source: `// 1부터 시작해서 처음으로 7로 나누어 떨어지는 100 이상의 수 찾기
for (let i = 100; i < 1000; i++) {
  if (i % 7 === 0) {
    console.log("찾았다:", i);
    break;
  }
}`,
    },
    {
      type: "markdown",
      source: `## ⏭️ \`continue\` — 이번 회차만 건너뛰기

본문을 끝까지 안 돌고 다음 회차로 즉시 넘어가고 싶을 때.`,
    },
    {
      type: "code",
      source: `// 1~10 중 홀수만 출력
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    continue;  // 짝수면 건너뛰기 → 아래 줄 실행 안 됨
  }
  console.log(i);
}`,
    },
    {
      type: "markdown",
      source: `## 🎯 \`for...of\` — 배열·문자열의 각 요소 순회

배열을 다룰 일이 많은데, 이때 인덱스를 일일이 안 쓰고 **각 요소를 직접** 받아올 수 있어요.

(배열 자체는 다음 챕터에서 자세히 배웁니다)`,
    },
    {
      type: "code",
      source: `const fruits = ["사과", "바나나", "딸기"];

for (const fruit of fruits) {
  console.log("좋아하는 과일:", fruit);
}

// 문자열도 한 글자씩 순회 가능
for (const char of "Hi!") {
  console.log(char);
}`,
    },
    {
      type: "markdown",
      source: `> 💡 \`for...of\` vs \`for\` 비교
> - \`for (let i = 0; i < arr.length; i++)\` — 인덱스 i가 필요할 때
> - \`for (const item of arr)\` — 값만 필요할 때 (더 간결, 더 안전)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

다음 숫자 배열의 **합계와 평균**을 구하세요.

\`\`\`js
const scores = [85, 92, 78, 90, 88];
\`\`\`

\`for...of\` 를 활용해서 각 점수를 더한 뒤, 길이로 나눠 평균을 구합니다.`,
    },
    {
      type: "code",
      source: `const scores = [85, 92, 78, 90, 88];

// 여기에 코드를 작성하세요
`,
      hints: [
        "합계용 변수: `let sum = 0;` 으로 시작하세요.",
        "for...of로 각 점수를 sum에 더해요. `sum += score`.",
        "평균은 `sum / scores.length`. 배열의 길이는 `.length` 로 알 수 있어요.",
      ],
      solution: `const scores = [85, 92, 78, 90, 88];

let sum = 0;
for (const score of scores) {
  sum += score;
}
const avg = sum / scores.length;

console.log("합계:", sum);
console.log("평균:", avg);`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 5 완료!

오늘 배운 것:
- ✅ \`for (init; cond; inc)\` — 횟수 정해진 반복
- ✅ \`while (cond)\` — 조건 동안 반복
- ✅ \`break\` / \`continue\` — 반복 제어
- ✅ \`for...of\` — 배열·문자열의 각 요소 순회
- ✅ \`+= -= *= /=\` — 증감 단축
- ✅ \`i++\` / \`i--\` — 1씩 증감 단축

**다음 챕터에서는**: 여러 값을 담는 가장 기본 자료구조 **배열(Array)** 을 본격적으로 다룹니다.

자유롭게 실험해보세요 🧪`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 5 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 i는 총 몇 번 출력될까요?",
        code: `for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
        options: ["4번", "5번", "6번", "0번"],
        correctIndex: 1,
        explanation:
          "i가 0,1,2,3,4 일 때 총 5번 실행돼요. i=5가 되면 조건 i<5가 false라 종료.",
      },
      {
        type: "predict-output",
        question: "이 코드의 마지막 출력은 무엇일까요?",
        code: `let n = 1;
while (n < 50) {
  n = n * 3;
}
console.log(n);`,
        options: ["27", "81", "50", "무한 루프"],
        correctIndex: 1,
        explanation:
          "n이 1 → 3 → 9 → 27 → 81. 81에서 조건 n<50이 false라 종료. 마지막 n은 81.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 몇 줄이 출력될까요?",
        code: `for (let i = 1; i <= 5; i++) {
  if (i === 3) continue;
  console.log(i);
}`,
        options: ["3줄", "4줄", "5줄", "0줄"],
        correctIndex: 1,
        explanation:
          "i가 3일 때 continue로 건너뛰니까 1,2,4,5 가 출력돼요. 총 4줄.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `let sum = 0;
for (const n of [10, 20, 30]) {
  sum += n;
}
console.log(sum);`,
        options: ["10", "30", "60", "[10, 20, 30]"],
        correctIndex: 2,
        explanation:
          "for...of로 10, 20, 30을 sum에 더해요. 0+10+20+30 = 60.",
      },
    ],
  } satisfies Quiz,
};
