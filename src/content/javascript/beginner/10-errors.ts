import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson10: Lesson = {
  id: "javascript-beginner-10",
  language: "javascript",
  track: "beginner",
  order: 10,
  title: "에러 처리 — try · catch · throw",
  subtitle: "에러를 무서워하지 말고 다루는 법을 배웁니다",
  estimatedMinutes: 10,
  cells: [
    {
      type: "markdown",
      source: `# 🚨 에러 처리

지금까지 에러가 나면 코드 실행이 멈췄어요. 어떤 상황에서는 **에러가 나도 프로그램을 계속 돌리고 싶을 때**가 있습니다.
그럴 때 \`try / catch\` 를 씁니다.

이번 챕터에서 배울 것:
- \`try / catch\` 로 에러 잡기
- \`throw\` 로 직접 에러 던지기
- \`Error\` 객체와 그 속성 (\`message\`, \`name\`)
- \`finally\` — 성공·실패 상관없이 항상 실행
- "어떤 에러는 잡고, 어떤 에러는 그냥 두기"`,
    },
    {
      type: "markdown",
      source: `## 🪝 \`try / catch\` — 에러 잡기

문법:
\`\`\`
try {
  // 에러가 날 수 있는 코드
} catch (err) {
  // 에러가 났을 때 실행할 코드
}
\`\`\``,
    },
    {
      type: "code",
      source: `try {
  const data = JSON.parse("이건 JSON 아님");
  console.log("성공:", data);
} catch (err) {
  console.log("에러 잡힘!");
  console.log("메시지:", err.message);
}

console.log("프로그램은 계속 실행됨");`,
    },
    {
      type: "markdown",
      source: `\`JSON.parse\` 가 잘못된 입력을 받으면 \`SyntaxError\` 를 던지지만,
\`catch\` 가 그걸 잡아서 **프로그램이 멈추지 않고** "프로그램은 계속 실행됨" 까지 도달합니다.

> 💡 \`err\` 는 흔히 사용하는 이름. \`error\` / \`e\` 도 자주 씁니다.`,
    },
    {
      type: "markdown",
      source: `## 📦 Error 객체 들여다보기`,
    },
    {
      type: "code",
      source: `try {
  null.toString();  // null에는 toString 없음 → TypeError
} catch (err) {
  console.log("name:", err.name);        // "TypeError"
  console.log("message:", err.message);  // "Cannot read properties of null..."
  console.log("err 자체:", err);
}`,
    },
    {
      type: "markdown",
      source: `에러 객체는 보통 다음 속성을 가집니다:
- \`name\` — 에러 종류 (\`TypeError\`, \`RangeError\`, \`SyntaxError\` 등)
- \`message\` — 사람 읽기용 설명
- \`stack\` — 어디서 발생했는지 추적 정보`,
    },
    {
      type: "markdown",
      source: `## 🎯 \`throw\` — 에러 직접 던지기

내가 만든 함수가 잘못된 상황을 만나면 직접 에러를 발생시킬 수 있어요.`,
    },
    {
      type: "code",
      source: `function divide(a, b) {
  if (b === 0) {
    throw new Error("0으로 나눌 수 없어요");
  }
  return a / b;
}

try {
  console.log(divide(10, 2));   // 5
  console.log(divide(10, 0));   // 여기서 throw → catch 로 넘어감
  console.log("이 줄은 안 실행됨");
} catch (err) {
  console.log("에러:", err.message);
}`,
    },
    {
      type: "markdown",
      source: `> 💡 \`throw\` 직후의 코드는 실행되지 않아요. 함수 안이라면 함수가 즉시 종료됩니다.

> 💡 \`throw\` 의 표현식은 보통 \`new Error("...")\` 를 쓰지만, 사실 어떤 값이든 던질 수 있어요. 권장은 항상 \`Error\` 객체.`,
    },
    {
      type: "markdown",
      source: `## 🧹 \`finally\` — 무조건 실행되는 블록

성공·실패 상관없이 마지막에 실행하고 싶은 정리 작업을 \`finally\` 에 둡니다.`,
    },
    {
      type: "code",
      source: `function process(value) {
  console.log("--- 시작 ---");
  try {
    if (value === 0) {
      throw new Error("0은 처리 불가");
    }
    console.log("결과:", 100 / value);
  } catch (err) {
    console.log("에러:", err.message);
  } finally {
    console.log("--- 끝 ---");
  }
}

process(5);
process(0);`,
    },
    {
      type: "markdown",
      source: `\`--- 끝 ---\` 가 두 경우 모두 출력됩니다.
파일·연결 닫기, 임시 자원 정리 등에 자주 씁니다.`,
    },
    {
      type: "markdown",
      source: `## ⚖️ "어떤 에러를 잡고, 어떤 건 그냥 둘까?"

**잡아야 하는 경우**:
- 사용자 입력 검증 실패 (\`JSON.parse\` 실패, 잘못된 폼 데이터)
- 외부 자원 실패 (네트워크, 파일)
- "이런 에러가 날 가능성이 있다" 를 알고 대응 계획이 있을 때

**잡으면 안 되는 경우**:
- 단순 코딩 실수 (오타, undefined 접근) — 잡으면 버그가 숨겨져요
- "그냥 모든 try-catch로 감싸기" — 안티패턴

> 💡 **에러를 잡고 아무것도 안 하기** (\`catch (e) { }\`) — **절대 금지**.
> 에러가 조용히 사라져서 디버깅이 지옥이 됩니다.
> 최소한 \`console.error(e)\` 라도 해주세요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**안전한 나누기 함수** \`safeDivide(a, b)\` 를 작성하세요:

- \`b\` 가 0이면 \`Error\` 를 던짐 (메시지: "0으로 나눌 수 없습니다")
- 그 외엔 \`a / b\` 반환

그리고 다음 호출을 \`try/catch\` 로 감싸서 결과를 출력하세요:
- \`safeDivide(10, 2)\` → 정상
- \`safeDivide(10, 0)\` → 에러 메시지 출력
- \`safeDivide(15, 5)\` → 정상`,
    },
    {
      type: "code",
      source: `// 여기에 코드를 작성하세요
`,
      hints: [
        "함수 정의: `function safeDivide(a, b) { if (b === 0) throw new Error(\"...\"); return a / b; }`",
        "각 호출을 try/catch로: `try { console.log(safeDivide(...)); } catch (e) { console.log(\"에러:\", e.message); }`",
        "여러 번 호출하려면 반복문이나 함수로 묶으면 깔끔.",
      ],
      solution: `function safeDivide(a, b) {
  if (b === 0) {
    throw new Error("0으로 나눌 수 없습니다");
  }
  return a / b;
}

const inputs = [
  [10, 2],
  [10, 0],
  [15, 5],
];

for (const [a, b] of inputs) {
  try {
    console.log(\`\${a} / \${b} = \${safeDivide(a, b)}\`);
  } catch (err) {
    console.log(\`에러: \${err.message}\`);
  }
}`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 10 완료!

오늘 배운 것:
- ✅ \`try / catch / finally\` 로 에러 처리
- ✅ \`throw new Error("...")\` 로 에러 직접 던지기
- ✅ Error 객체의 \`name\`, \`message\` 속성
- ✅ "잡아야 하는 에러"와 "그냥 둬야 할 에러" 구분
- ✅ 빈 \`catch\` 는 안티패턴

**다음 챕터에서는**: 지금까지 배운 모든 걸 합쳐 작은 **할 일 목록 (To-Do)** 을 만듭니다 — 입문 트랙의 마지막!

자유롭게 실험해보세요 🧪`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 10 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `try {
  throw new Error("oops");
} catch (e) {
  console.log("caught:", e.message);
}
console.log("done");`,
        options: [
          'caught: oops 와 done 둘 다',
          'caught: oops 만',
          'done 만',
          '에러로 멈춤',
        ],
        correctIndex: 0,
        explanation:
          "throw로 던진 에러를 catch가 잡아요. 이후 \"done\"도 정상 실행. 두 줄 모두 출력.",
      },
      {
        type: "predict-output",
        question: "이 코드의 마지막 출력은 무엇일까요?",
        code: `function f(x) {
  try {
    if (x < 0) throw new Error("음수");
    return "OK";
  } finally {
    console.log("finally 실행");
  }
}
console.log(f(-1));`,
        options: ['"OK"', '"음수"', "에러로 멈춤", "undefined"],
        correctIndex: 2,
        explanation:
          "throw 후 catch가 없어서 에러가 함수 밖으로 전파돼요. finally는 실행되지만, 마지막 console.log(f(-1)) 자체가 에러로 막힘.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 try/catch를 쓰면 좋은 상황은?",
        options: [
          "단순 오타로 인한 ReferenceError",
          "JSON.parse로 외부에서 받은 데이터 파싱",
          "for 루프 안의 i++",
          "변수 선언",
        ],
        correctIndex: 1,
        explanation:
          "JSON.parse는 입력에 따라 SyntaxError가 날 수 있어 try/catch가 적절. 단순 코딩 실수는 잡으면 안 돼요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `try {
  console.log("A");
} catch (e) {
  console.log("B");
} finally {
  console.log("C");
}`,
        options: ["A C", "A B C", "A", "B C"],
        correctIndex: 0,
        explanation:
          "try 블록에 에러가 없으니 catch는 실행 안 돼요. try의 \"A\" + finally의 \"C\".",
      },
    ],
  } satisfies Quiz,
};
