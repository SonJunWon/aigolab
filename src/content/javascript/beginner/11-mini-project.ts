import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson11: Lesson = {
  id: "javascript-beginner-11",
  language: "javascript",
  track: "beginner",
  order: 11,
  title: "미니 프로젝트 — 할 일 목록 (To-Do)",
  subtitle: "지금까지 배운 모든 것을 합쳐 작은 앱을 만듭니다",
  estimatedMinutes: 18,
  cells: [
    {
      type: "markdown",
      source: `# 🎯 미니 프로젝트 — 할 일 목록

축하해요! 여기까지 오셨다면 변수, 함수, 객체, 배열, 메서드 모두 다뤘어요.
이제 작은 **할 일 관리 앱**을 만들어보면서 모든 걸 합쳐봅시다.

## 만들 기능
- 할 일 추가 (\`addTodo\`)
- 전체 목록 보기 (\`listTodos\`)
- 완료 표시 (\`completeTodo\`)
- 할 일 삭제 (\`removeTodo\`)
- 미완료 개수 세기 (\`countActive\`)

## ⚠️ 한 가지 주의사항

**JS 노트북에서는 셀마다 변수가 격리됩니다** (Python과 다름).
즉, 셀 1에서 \`todos\` 배열을 만들어도 셀 2에서 그 \`todos\` 를 못 봐요.

그래서 이 챕터에서는:
- **각 함수를 짧은 셀에서 따로 보여주고**
- **마지막에 모든 코드를 한 셀에서 합쳐서 실행** 합니다.`,
    },
    {
      type: "markdown",
      source: `## 📋 데이터 모델 — 할 일 하나 = 객체

각 할 일은 다음 속성을 가진 객체:
\`\`\`js
{
  id: 1,
  text: "장보기",
  done: false,
  createdAt: "2026-04-13T10:00:00",
}
\`\`\`

전체 할 일 목록은 이런 객체들의 **배열**:
\`\`\`js
[
  { id: 1, text: "장보기", done: false, ... },
  { id: 2, text: "운동하기", done: true, ... },
]
\`\`\``,
    },
    {
      type: "markdown",
      source: `## ➕ 1. 할 일 추가

새 할 일을 만들어 배열에 추가하는 함수.`,
    },
    {
      type: "code",
      source: `// 데모: 빈 배열 → addTodo 호출 후 결과 확인
let nextId = 1;

function addTodo(todos, text) {
  const newTodo = {
    id: nextId++,
    text: text,
    done: false,
    createdAt: new Date().toISOString(),
  };
  return [...todos, newTodo];   // 새 배열 반환 (불변 패턴)
}

let myTodos = [];
myTodos = addTodo(myTodos, "장보기");
myTodos = addTodo(myTodos, "운동하기");
console.log(myTodos);`,
    },
    {
      type: "markdown",
      source: `**핵심 패턴**:
- \`...todos\` 전개로 새 배열 생성 (원본 변경 안 함)
- \`nextId++\` — 후위 증가 연산자 (현재 값 사용 후 +1)
- \`new Date().toISOString()\` — 현재 시각 ISO 형식`,
    },
    {
      type: "markdown",
      source: `## 📜 2. 목록 보기

할 일 목록을 보기 좋은 형식으로 출력.`,
    },
    {
      type: "code",
      source: `// 데모용 샘플 데이터
const sample = [
  { id: 1, text: "장보기", done: false },
  { id: 2, text: "운동하기", done: true },
  { id: 3, text: "책 읽기", done: false },
];

function listTodos(todos) {
  if (todos.length === 0) {
    console.log("(할 일 없음)");
    return;
  }
  for (const todo of todos) {
    const checkbox = todo.done ? "[x]" : "[ ]";
    console.log(\`\${checkbox} #\${todo.id} \${todo.text}\`);
  }
}

listTodos(sample);
listTodos([]);`,
    },
    {
      type: "markdown",
      source: `## ✅ 3. 완료 표시

ID로 찾아 해당 할 일의 \`done\` 을 \`true\` 로.`,
    },
    {
      type: "code",
      source: `const sample = [
  { id: 1, text: "장보기", done: false },
  { id: 2, text: "운동하기", done: false },
];

function completeTodo(todos, id) {
  return todos.map(todo =>
    todo.id === id ? { ...todo, done: true } : todo
  );
}

const updated = completeTodo(sample, 1);
console.log(updated);
// id=1만 done: true 가 됨`,
    },
    {
      type: "markdown",
      source: `**핵심 패턴 — 불변 업데이트**:
- \`map\` 으로 모든 요소를 순회
- 매칭되는 것만 \`{ ...todo, done: true }\` 로 새 객체
- 나머지는 그대로 통과 → 결과는 새 배열`,
    },
    {
      type: "markdown",
      source: `## 🗑️ 4. 삭제`,
    },
    {
      type: "code",
      source: `const sample = [
  { id: 1, text: "장보기", done: false },
  { id: 2, text: "운동하기", done: false },
  { id: 3, text: "책 읽기", done: false },
];

function removeTodo(todos, id) {
  return todos.filter(todo => todo.id !== id);
}

const remaining = removeTodo(sample, 2);
console.log(remaining);
// id=2가 빠진 새 배열`,
    },
    {
      type: "markdown",
      source: `\`filter\` 는 조건 만족하는 것만 남기죠. \`!== id\` 로 제외할 ID 빼고 모두 통과.`,
    },
    {
      type: "markdown",
      source: `## 🔢 5. 미완료 개수`,
    },
    {
      type: "code",
      source: `const sample = [
  { id: 1, text: "A", done: false },
  { id: 2, text: "B", done: true },
  { id: 3, text: "C", done: false },
  { id: 4, text: "D", done: true },
];

function countActive(todos) {
  return todos.filter(t => !t.done).length;
}

console.log("미완료:", countActive(sample));   // 2`,
    },
    {
      type: "markdown",
      source: `## 🎬 모두 합쳐서 — 풀 데모

지금까지의 함수를 한 셀에 모아서 시나리오대로 실행해봅시다.`,
    },
    {
      type: "code",
      source: `// ─── 모든 함수 정의 ──────────────────────
let nextId = 1;

function addTodo(todos, text) {
  const newTodo = {
    id: nextId++,
    text,
    done: false,
    createdAt: new Date().toISOString(),
  };
  return [...todos, newTodo];
}

function completeTodo(todos, id) {
  return todos.map(t => t.id === id ? { ...t, done: true } : t);
}

function removeTodo(todos, id) {
  return todos.filter(t => t.id !== id);
}

function countActive(todos) {
  return todos.filter(t => !t.done).length;
}

function listTodos(todos) {
  if (todos.length === 0) {
    console.log("(할 일 없음)");
    return;
  }
  for (const t of todos) {
    console.log(\`\${t.done ? "[x]" : "[ ]"} #\${t.id} \${t.text}\`);
  }
}

// ─── 시나리오 ──────────────────────────
let todos = [];

console.log("=== 1. 할 일 추가 ===");
todos = addTodo(todos, "장보기");
todos = addTodo(todos, "운동하기");
todos = addTodo(todos, "책 읽기");
todos = addTodo(todos, "친구 만나기");
listTodos(todos);
console.log("미완료:", countActive(todos));

console.log("\\n=== 2. 1번, 3번 완료 ===");
todos = completeTodo(todos, 1);
todos = completeTodo(todos, 3);
listTodos(todos);
console.log("미완료:", countActive(todos));

console.log("\\n=== 3. 4번 삭제 ===");
todos = removeTodo(todos, 4);
listTodos(todos);
console.log("미완료:", countActive(todos));`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 도전 1

위 미니 프로젝트에 다음 기능을 추가해보세요:

**\`updateTodoText(todos, id, newText)\`** — 특정 할 일의 텍스트 변경
- ID 매칭되는 항목의 \`text\` 만 \`newText\` 로 바꾼 새 배열 반환
- 나머지는 그대로

힌트: \`completeTodo\` 와 거의 같은 패턴 (map + 전개).`,
    },
    {
      type: "code",
      source: `// 위 풀 데모의 함수들 + 도전 함수
let nextId = 1;
function addTodo(todos, text) {
  return [...todos, { id: nextId++, text, done: false }];
}

// 여기에 updateTodoText 작성
function updateTodoText(todos, id, newText) {
  // ...
}

// 테스트
let todos = [];
todos = addTodo(todos, "장보기");
todos = addTodo(todos, "운동하기");
console.log("변경 전:", todos);

todos = updateTodoText(todos, 1, "마트에서 우유 사기");
console.log("변경 후:", todos);
`,
      hints: [
        "completeTodo와 똑같은 구조: map + 조건부 전개",
        "예: `todos.map(t => t.id === id ? { ...t, text: newText } : t)`",
      ],
      solution: `let nextId = 1;
function addTodo(todos, text) {
  return [...todos, { id: nextId++, text, done: false }];
}

function updateTodoText(todos, id, newText) {
  return todos.map(t => t.id === id ? { ...t, text: newText } : t);
}

let todos = [];
todos = addTodo(todos, "장보기");
todos = addTodo(todos, "운동하기");
console.log("변경 전:", todos);

todos = updateTodoText(todos, 1, "마트에서 우유 사기");
console.log("변경 후:", todos);`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 도전 2 (조금 더 어려움)

**\`filterTodos(todos, status)\`** — 상태별 필터
- \`status\` 가 \`"active"\` 면 미완료만
- \`"done"\` 이면 완료된 것만
- \`"all"\` 이면 전체
- 그 외 값이면 \`Error\` 던지기

힌트: switch 또는 if/else if/else로 분기. throw로 에러 던지기 (챕터 10).`,
    },
    {
      type: "code",
      source: `const todos = [
  { id: 1, text: "A", done: false },
  { id: 2, text: "B", done: true },
  { id: 3, text: "C", done: false },
  { id: 4, text: "D", done: true },
];

// 여기에 filterTodos 작성
function filterTodos(todos, status) {
  // ...
}

// 테스트
console.log("active:", filterTodos(todos, "active"));
console.log("done:", filterTodos(todos, "done"));
console.log("all:", filterTodos(todos, "all"));

// 잘못된 status는 try/catch로
try {
  filterTodos(todos, "invalid");
} catch (e) {
  console.log("예외:", e.message);
}
`,
      hints: [
        "switch (status) { case \"active\": return todos.filter(...); ... }",
        "active → !t.done, done → t.done, all → 그냥 todos 반환 또는 [...todos]",
        "default 케이스에서 throw new Error(\"알 수 없는 status: ...\")",
      ],
      solution: `const todos = [
  { id: 1, text: "A", done: false },
  { id: 2, text: "B", done: true },
  { id: 3, text: "C", done: false },
  { id: 4, text: "D", done: true },
];

function filterTodos(todos, status) {
  switch (status) {
    case "active":
      return todos.filter(t => !t.done);
    case "done":
      return todos.filter(t => t.done);
    case "all":
      return [...todos];
    default:
      throw new Error(\`알 수 없는 status: \${status}\`);
  }
}

console.log("active:", filterTodos(todos, "active"));
console.log("done:", filterTodos(todos, "done"));
console.log("all:", filterTodos(todos, "all"));

try {
  filterTodos(todos, "invalid");
} catch (e) {
  console.log("예외:", e.message);
}`,
    },
    {
      type: "markdown",
      source: `## 🎉 입문 트랙 완주!

축하합니다! JavaScript 입문 11챕터를 모두 마쳤어요.

### 지금까지 배운 것 정리
| 챕터 | 핵심 |
|---|---|
| 1 | console.log, 산술 |
| 2 | let/const, 데이터 타입 |
| 3 | 연산자, ===의 중요성 |
| 4 | if/else/switch |
| 5 | for/while, break/continue |
| 6 | 배열 + map/filter/reduce |
| 7 | 객체 + 구조 분해 + 전개 |
| 8 | 함수, 화살표 함수, 클로저 |
| 9 | 문자열 메서드 |
| 10 | try/catch/throw |
| **11** | **이 모든 걸 합쳐 미니 프로젝트** |

### 이제 무엇을 할 수 있나요?
- 일상 자동화 스크립트 (브라우저 콘솔에서 직접)
- 간단한 웹 페이지 인터랙션 (다음 단계: DOM)
- React, Vue 같은 프레임워크 학습 시작 가능
- Node.js로 백엔드 첫걸음

### 다음 학습 추천
- **Python 입문**도 풀어보면 비교가 재미있음
- **AI 강의** 트랙으로 이론 다지기
- **AI 프로젝트** 트랙으로 실전 ML 경험

✨ 정말 수고하셨습니다!`,
    },
    {
      type: "code",
      source: `// 자유 실험 영역 — 미니 프로젝트를 더 발전시켜보세요!
// 예: 우선순위(priority) 필드 추가, 마감일(dueDate) 추가, 등
`,
    },
  ],
  quiz: {
    title: "챕터 11 퀴즈 — 종합",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `function add(todos, item) {
  return [...todos, item];
}
const a = [1, 2];
const b = add(a, 3);
console.log(a.length, b.length);`,
        options: ["3 3", "2 3", "3 2", "2 2"],
        correctIndex: 1,
        explanation:
          "전개 연산자로 새 배열을 만드니 a는 그대로 [1,2] (length 2), b는 [1,2,3] (length 3).",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `const items = [
  { id: 1, done: false },
  { id: 2, done: true },
  { id: 3, done: false },
];
const result = items.filter(x => !x.done).length;
console.log(result);`,
        options: ["1", "2", "3", "0"],
        correctIndex: 1,
        explanation:
          "done이 false인 것만 남기면 id 1과 3, 두 개. 길이는 2.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `function update(items, id, newName) {
  return items.map(item =>
    item.id === id ? { ...item, name: newName } : item
  );
}
const data = [{ id: 1, name: "A" }, { id: 2, name: "B" }];
const updated = update(data, 1, "Z");
console.log(updated[0].name, data[0].name);`,
        options: ['"Z" "A"', '"Z" "Z"', '"A" "A"', '"A" "Z"'],
        correctIndex: 0,
        explanation:
          "불변 업데이트: updated의 첫 번째는 \"Z\"로 바뀌고, 원본 data는 그대로 \"A\".",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `function safe(fn) {
  try {
    return fn();
  } catch (e) {
    return null;
  }
}
console.log(safe(() => 42));
console.log(safe(() => { throw new Error("x"); }));`,
        options: ["42 null", "null null", "42 42", "에러"],
        correctIndex: 0,
        explanation:
          "첫 호출은 정상 실행 → 42 반환. 두 번째는 throw → catch가 잡아서 null 반환.",
      },
    ],
  } satisfies Quiz,
};
