import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson09: Lesson = {
  id: "javascript-beginner-09",
  language: "javascript",
  track: "beginner",
  order: 9,
  title: "문자열 다루기",
  subtitle: "문자열을 자르고 합치고 검색하고 변환하는 방법",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 📝 문자열 (String)

지금까지 문자열을 그냥 출력하기만 했죠. JavaScript 문자열엔 **수많은 유용한 메서드**가 내장되어 있어요.
이 챕터에서 자주 쓰는 것 위주로 정리합니다.

이번 챕터에서 배울 것:
- 길이 \`.length\` 와 인덱스 접근
- 대소문자 변환, 공백 제거
- 검색: \`includes\`, \`startsWith\`, \`endsWith\`, \`indexOf\`
- 자르기: \`slice\`, \`substring\`
- 분리/결합: \`split\`, \`join\`
- 치환: \`replace\`, \`replaceAll\`
- 템플릿 리터럴 활용 (재방문)`,
    },
    {
      type: "markdown",
      source: `## 📏 길이와 인덱스

문자열은 배열과 비슷하게 **인덱스 접근**이 가능해요.`,
    },
    {
      type: "code",
      source: `const text = "Hello, JS!";

console.log(text.length);    // 10
console.log(text[0]);         // "H"
console.log(text[7]);         // "J"
console.log(text[100]);       // undefined (없는 자리)

// 마지막 글자
console.log(text[text.length - 1]);  // "!"
console.log(text.at(-1));              // "!" (모던, 음수 인덱스)`,
    },
    {
      type: "markdown",
      source: `> ⚠️ **문자열은 불변(immutable)**: \`text[0] = "h"\` 같은 수정 불가. 새 문자열을 만들어야 해요.

> 💡 **한글/이모지 주의**: 일부 글자(예: 이모지 \`👨‍👩‍👦\`)는 하나처럼 보여도 \`length\` 가 1이 아닐 수 있어요. 입문 단계에선 영문/한글 1글자는 1이라고 생각하면 OK.`,
    },
    {
      type: "markdown",
      source: `## 🔠 대소문자 + 공백 제거`,
    },
    {
      type: "code",
      source: `const text = "  Hello World  ";

console.log(text.toLowerCase());   // "  hello world  "
console.log(text.toUpperCase());   // "  HELLO WORLD  "
console.log(text.trim());          // "Hello World"  (양쪽 공백 제거)
console.log(text.trimStart());     // "Hello World  "
console.log(text.trimEnd());       // "  Hello World"

// 메서드는 새 문자열을 반환 — 원본은 그대로
console.log(text);   // "  Hello World  "`,
    },
    {
      type: "markdown",
      source: `## 🔎 검색`,
    },
    {
      type: "code",
      source: `const text = "JavaScript is fun";

// 포함 여부 (true/false)
console.log(text.includes("Script"));    // true
console.log(text.includes("Python"));    // false

// 시작/끝 검사
console.log(text.startsWith("Java"));    // true
console.log(text.endsWith("fun"));       // true

// 위치 (없으면 -1)
console.log(text.indexOf("Script"));     // 4
console.log(text.indexOf("foo"));        // -1
console.log(text.lastIndexOf("S"));      // 4 (뒤에서 처음 나오는 위치)`,
    },
    {
      type: "markdown",
      source: `## ✂️ 자르기 — \`slice\` / \`substring\`

부분 문자열 추출. 둘 다 \`(시작, 끝)\` 인덱스를 받지만 \`slice\` 가 더 직관적이라 권장.`,
    },
    {
      type: "code",
      source: `const text = "JavaScript";

console.log(text.slice(0, 4));     // "Java"
console.log(text.slice(4));        // "Script"  (끝 생략 = 끝까지)
console.log(text.slice(-6));       // "Script"  (음수 = 뒤에서)
console.log(text.slice(-6, -3));   // "Scr"

// substring — slice와 비슷하지만 음수 미지원 (오래된 메서드)
console.log(text.substring(4, 10));  // "Script"`,
    },
    {
      type: "markdown",
      source: `## 🔪 분리 — \`split\`

문자열을 구분자로 잘라 **배열**로 만들기.`,
    },
    {
      type: "code",
      source: `const csv = "사과,바나나,딸기,포도";
const fruits = csv.split(",");
console.log(fruits);   // ["사과", "바나나", "딸기", "포도"]

const sentence = "The quick brown fox";
const words = sentence.split(" ");
console.log(words);   // ["The", "quick", "brown", "fox"]

// 한 글자씩
const chars = "Hi".split("");
console.log(chars);   // ["H", "i"]`,
    },
    {
      type: "markdown",
      source: `## 🔗 결합 — \`join\`

배열을 문자열로 합치기 (\`split\` 의 반대).`,
    },
    {
      type: "code",
      source: `const fruits = ["사과", "바나나", "딸기"];

console.log(fruits.join(", "));   // "사과, 바나나, 딸기"
console.log(fruits.join(""));      // "사과바나나딸기"
console.log(fruits.join(" + "));   // "사과 + 바나나 + 딸기"

// CSV 만들기 패턴
const data = [
  ["이름", "나이"],
  ["철수", 25],
  ["영희", 30],
];
const csvText = data.map(row => row.join(",")).join("\\n");
console.log(csvText);
// 이름,나이
// 철수,25
// 영희,30`,
    },
    {
      type: "markdown",
      source: `## 🔄 치환 — \`replace\` / \`replaceAll\``,
    },
    {
      type: "code",
      source: `const text = "Hello, World! Hello, JS!";

// replace — 첫 번째 매칭만
console.log(text.replace("Hello", "Hi"));
// "Hi, World! Hello, JS!"

// replaceAll — 모두
console.log(text.replaceAll("Hello", "Hi"));
// "Hi, World! Hi, JS!"

// 빈 문자열로 치환 = 제거
const phone = "010-1234-5678";
console.log(phone.replaceAll("-", ""));   // "01012345678"`,
    },
    {
      type: "markdown",
      source: `## 🎨 템플릿 리터럴 (재방문)

챕터 3에서 살짝 봤죠. 이제 메서드 결과와 함께 쓰면 강력해요.`,
    },
    {
      type: "code",
      source: `const user = { name: "철수", email: "CHULSU@example.com" };

const message = \`
환영합니다, \${user.name}님!
이메일: \${user.email.toLowerCase()}
이름 길이: \${user.name.length}자
\`;

console.log(message);

// 표현식이라면 뭐든 들어갈 수 있음
console.log(\`총합: \${[1,2,3,4,5].reduce((a,b) => a+b, 0)}\`);  // 총합: 15`,
    },
    {
      type: "markdown",
      source: `> 💡 **여러 줄 문자열**: 옛날엔 \`"줄1\\n줄2"\` 처럼 \`\\n\` 을 써야 했는데, 백틱은 그냥 줄바꿈을 그대로 인식해요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

이메일 주소가 유효한지 검사하는 함수 \`isValidEmail(email)\` 를 작성하세요.

조건:
- 공백 제거 후 빈 문자열 아니어야 함
- \`@\` 가 정확히 1개 포함되어야 함
- \`@\` 뒤에 \`.\` 이 있어야 함

힌트: \`split("@")\` 로 \`["앞", "뒤"]\` 가 나오면 길이 2 + 뒤 부분에 \`.\` 포함.

테스트:
- \`"test@example.com"\` → true
- \`"invalid"\` → false
- \`"a@b\"\` → false (.이 없음)
- \`"  "\` → false`,
    },
    {
      type: "code",
      source: `// 여기에 함수 작성
function isValidEmail(email) {
  // ...
}

console.log(isValidEmail("test@example.com"));
console.log(isValidEmail("invalid"));
console.log(isValidEmail("a@b"));
console.log(isValidEmail("   "));`,
      hints: [
        "trim 후 빈 문자열 체크: `if (email.trim() === \"\") return false;`",
        "split: `const parts = email.split(\"@\"); if (parts.length !== 2) return false;`",
        "도메인에 점: `if (!parts[1].includes(\".\")) return false; return true;`",
      ],
      solution: `function isValidEmail(email) {
  const trimmed = email.trim();
  if (trimmed === "") return false;
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  if (!parts[1].includes(".")) return false;
  return true;
}

console.log(isValidEmail("test@example.com"));  // true
console.log(isValidEmail("invalid"));            // false
console.log(isValidEmail("a@b"));                 // false
console.log(isValidEmail("   "));                 // false`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

문장에서 **단어 개수**와 **가장 긴 단어**를 출력하는 함수 \`analyze(sentence)\` 를 작성하세요.

\`\`\`js
analyze("The quick brown fox jumps over the lazy dog");
// 단어 수: 9
// 가장 긴 단어: "quick" (5자)  — 또는 "brown", "jumps" 셋 다 5자, 첫 번째만 출력하면 OK
\`\`\`

힌트: \`split(" ")\` → 단어 배열 → \`reduce\` 로 가장 긴 것 찾기 (또는 \`for...of\`).`,
    },
    {
      type: "code",
      source: `// 여기에 함수 작성
function analyze(sentence) {
  // ...
}

analyze("The quick brown fox jumps over the lazy dog");
analyze("Hello World");
`,
      hints: [
        "단어 배열: `const words = sentence.split(\" \");`",
        "가장 긴 단어 (reduce): `words.reduce((longest, w) => w.length > longest.length ? w : longest, \"\")`",
        "또는 for...of로: `let longest = \"\"; for (const w of words) if (w.length > longest.length) longest = w;`",
      ],
      solution: `function analyze(sentence) {
  const words = sentence.split(" ").filter(w => w.length > 0);
  const longest = words.reduce(
    (acc, w) => (w.length > acc.length ? w : acc),
    ""
  );
  console.log(\`단어 수: \${words.length}\`);
  console.log(\`가장 긴 단어: "\${longest}" (\${longest.length}자)\`);
}

analyze("The quick brown fox jumps over the lazy dog");
analyze("Hello World");`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 9 완료!

오늘 배운 것:
- ✅ \`length\`, 인덱스 접근 \`[i]\`, \`at(-1)\`
- ✅ \`toLowerCase / toUpperCase / trim / trimStart / trimEnd\`
- ✅ 검색 \`includes / startsWith / endsWith / indexOf / lastIndexOf\`
- ✅ 자르기 \`slice(start, end)\` (음수 인덱스 OK)
- ✅ \`split(구분자)\` ↔ \`join(구분자)\`
- ✅ \`replace / replaceAll\`
- ✅ 템플릿 리터럴 — 표현식 + 여러 줄

**다음 챕터에서는**: 에러를 다루는 \`try/catch\` 와 미니 프로젝트로 마무리합니다.

자유롭게 실험해보세요 🧪`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 9 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log("Hello".slice(1, 4));`,
        options: ['"Hell"', '"ello"', '"ell"', '"Hello"'],
        correctIndex: 2,
        explanation:
          "slice(1, 4)는 인덱스 1부터 4 직전까지. \"H[ell]o\" → \"ell\".",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log("a,b,c,d".split(",").length);`,
        options: ["1", "3", "4", "5"],
        correctIndex: 2,
        explanation:
          "쉼표로 자르면 4개 요소 배열이 돼요. 길이 4.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const s = "Hello, World!";
console.log(s.replace("o", "0"));`,
        options: ['"Hell0, World!"', '"Hell0, W0rld!"', '"Hello, World!"', "에러"],
        correctIndex: 0,
        explanation:
          "replace는 첫 번째 매칭만 바꿔요. 모두 바꾸려면 replaceAll을 써야 해요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `console.log("  hi  ".trim().length);`,
        options: ["6", "5", "4", "2"],
        correctIndex: 3,
        explanation:
          "trim으로 양쪽 공백 제거 → \"hi\" → length 2.",
      },
    ],
  } satisfies Quiz,
};
