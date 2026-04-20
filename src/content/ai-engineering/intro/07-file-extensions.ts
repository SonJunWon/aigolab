import type { Lesson } from "../../../types/lesson";

export const lesson08: Lesson = {
  id: "ai-intro-07-file-extensions",
  language: "ai-engineering",
  track: "intro",
  order: 8,
  title: "파일 확장자",
  subtitle: "컴퓨터 파일의 이름표 — .py .md .json .html .css .js",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# 파일 확장자

컴퓨터에는 수많은 파일이 있어요. 사진, 음악, 문서, 프로그램 코드...
그런데 컴퓨터는 어떻게 각 파일의 종류를 구별할까요?

바로 **파일 확장자** 덕분이에요!

## 이번 강의에서 배울 것
| # | 내용 |
|---|------|
| 1 | 파일 확장자가 무엇인지 이해하기 |
| 2 | 프로그래밍에서 자주 쓰는 확장자 알아보기 |
| 3 | 각 파일 형식이 어떻게 생겼는지 직접 보기 |
| 4 | AI에게 다양한 형식의 텍스트를 만들어달라고 하기 |`,
    },
    {
      type: "markdown",
      source: `## 파일 확장자란?

파일 이름 뒤에 붙는 **점(.) + 글자**를 **확장자**라고 해요.

예를 들어:
- \`사진.jpg\` → 확장자는 \`.jpg\` (사진 파일)
- \`음악.mp3\` → 확장자는 \`.mp3\` (음악 파일)
- \`숙제.docx\` → 확장자는 \`.docx\` (워드 문서)

확장자는 **이름표** 같은 거예요. 컴퓨터는 이 이름표를 보고 "아, 이건 사진이구나!" 하고 알맞은 프로그램으로 열어줍니다.

> 비유: 우유팩에 '우유'라고 써있으면 냉장고에 넣고, '세제'라고 써있으면 세탁실에 둬야 하죠? 확장자도 같은 역할이에요!`,
    },
    {
      type: "markdown",
      source: `## 프로그래밍에서 자주 쓰는 확장자들

코딩을 하면 아래 확장자들을 매우 자주 만나게 돼요:

| 확장자 | 이름 | 무엇에 쓰나요? | 열어보는 프로그램 |
|--------|------|---------------|-----------------|
| \`.py\` | 파이썬 | 파이썬 프로그래밍 코드 | VS Code, Python |
| \`.js\` | 자바스크립트 | 웹사이트 동작 코드 | 브라우저, VS Code |
| \`.html\` | HTML | 웹페이지 구조 | 브라우저 |
| \`.css\` | CSS | 웹페이지 디자인 (색상, 크기) | 브라우저 |
| \`.md\` | 마크다운 | 설명 문서 (README 등) | VS Code, GitHub |
| \`.json\` | JSON | 데이터 저장 형식 | VS Code, 브라우저 |

이제 각 형식이 실제로 어떻게 생겼는지 AI에게 물어봅시다!`,
    },
    {
      type: "markdown",
      source: `### 실습 1: 마크다운(.md) 파일

마크다운은 **간단한 기호로 글을 꾸미는 형식**이에요.
\`#\`은 제목, \`**\`은 굵게, \`-\`은 목록... 이 강의의 설명도 마크다운으로 쓰여 있어요!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 마크다운 형식의 글을 만들어달라고 해봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "마크다운(.md) 형식으로 '나의 자기소개' 문서를 만들어줘. 제목, 소제목, 목록, 굵은 글씨를 사용해줘. 마크다운 원본 코드를 그대로 보여줘.",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "마크다운은 # 제목, ## 소제목, **굵게**, - 목록 등의 기호를 사용해요.",
        "GitHub, 블로그, 이 학습 플랫폼 모두 마크다운을 사용합니다!",
      ],
    },
    {
      type: "markdown",
      source: `### 실습 2: JSON(.json) 파일

JSON은 **데이터를 저장하는 형식**이에요.
중괄호 \`{}\`와 대괄호 \`[]\`로 이루어져 있고, \`"키": "값"\` 형태로 데이터를 정리해요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 JSON 형식의 데이터를 만들어달라고 해봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "우리 반 학생 3명의 정보를 JSON 형식으로 만들어줘. 이름, 나이, 좋아하는 과목을 포함해줘. JSON 코드만 보여줘.",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "JSON은 컴퓨터끼리 데이터를 주고받을 때 가장 많이 쓰는 형식이에요.",
        '형태: { "이름": "김철수", "나이": 12 } 같은 모양이에요.',
      ],
    },
    {
      type: "markdown",
      source: `### 실습 3: HTML(.html) + CSS(.css)

HTML은 웹페이지의 **뼈대**, CSS는 웹페이지의 **옷(디자인)** 이에요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 간단한 HTML 코드를 만들어달라고 해봅시다
const response = await chat({
  messages: [
    {
      role: "user",
      content: "아주 간단한 자기소개 웹페이지 HTML 코드를 만들어줘. CSS 스타일도 포함해서, 제목은 파란색, 배경은 연한 노란색으로 해줘. 코드만 보여줘.",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "HTML 태그: <h1>제목</h1>, <p>문단</p> 같은 꺾쇠 괄호를 사용해요.",
        "CSS: color: blue; 같은 형태로 디자인을 지정해요.",
      ],
    },
    {
      type: "markdown",
      source: `### 실습 4: Python(.py) vs JavaScript(.js)

두 프로그래밍 언어의 코드가 어떻게 다른지 AI에게 비교해달라고 해봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 같은 프로그램을 Python과 JavaScript로 비교!
const response = await chat({
  messages: [
    {
      role: "user",
      content: "'1부터 5까지 합 구하기' 프로그램을 Python(.py)과 JavaScript(.js) 두 가지로 보여줘. 각 코드가 어떤 파일에 저장되는지도 알려줘.",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "Python은 .py 파일에, JavaScript는 .js 파일에 저장해요.",
        "같은 일을 하는 코드라도 언어마다 문법이 조금씩 달라요.",
      ],
    },
    {
      type: "markdown",
      source: `## 확장자별 요약

| 확장자 | 한마디 설명 | 비유 |
|--------|------------|------|
| \`.py\` | 파이썬 코드 | 요리 레시피 (한국어) |
| \`.js\` | 자바스크립트 코드 | 요리 레시피 (영어) |
| \`.html\` | 웹페이지 뼈대 | 건물의 설계도 |
| \`.css\` | 웹페이지 디자인 | 건물의 인테리어 |
| \`.md\` | 마크다운 문서 | 깔끔하게 정리된 노트 |
| \`.json\` | 데이터 저장 형식 | 정리된 서류함 |

> 핵심: 확장자는 파일의 **종류를 알려주는 이름표**예요. 프로그래밍을 하면 다양한 확장자의 파일을 만들고 편집하게 됩니다!`,
    },
    {
      type: "markdown",
      source: `# Ch07 정리

| 배운 것 | 내용 |
|---------|------|
| 파일 확장자 | 파일 이름 뒤의 점 + 글자, 파일 종류를 알려주는 이름표 |
| .md (마크다운) | 간단한 기호로 글을 꾸미는 문서 형식 |
| .json | 데이터를 깔끔하게 저장하는 형식 |
| .html / .css | 웹페이지의 구조와 디자인 |
| .py / .js | 프로그래밍 언어별 코드 파일 |

**다음 강의**: 인터넷과 API — 컴퓨터들이 서로 대화하는 방법을 알아봅시다!`,
    },
  ],

  quiz: {
    title: "Ch07 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "파일 확장자의 역할은 무엇인가요?",
        options: [
          "파일의 크기를 알려준다",
          "파일의 종류를 알려준다",
          "파일을 암호화한다",
          "파일을 삭제하는 기능이다",
        ],
        correctIndex: 1,
        explanation:
          "파일 확장자는 파일의 종류를 알려주는 이름표 역할을 합니다. 컴퓨터는 확장자를 보고 어떤 프로그램으로 열지 결정해요.",
      },
      {
        type: "multiple-choice",
        question: "JSON 파일의 확장자는 무엇인가요?",
        options: [".js", ".json", ".html", ".md"],
        correctIndex: 1,
        explanation:
          "JSON 파일의 확장자는 .json 이에요. .js는 자바스크립트, .html은 웹페이지, .md는 마크다운 파일이에요.",
      },
      {
        type: "multiple-choice",
        question: "웹페이지의 디자인(색상, 크기, 배치)을 담당하는 파일의 확장자는?",
        options: [".html", ".py", ".css", ".json"],
        correctIndex: 2,
        explanation:
          "CSS(.css)는 웹페이지의 디자인을 담당해요. HTML은 구조(뼈대), CSS는 스타일(옷)이라고 생각하면 됩니다.",
      },
      {
        type: "multiple-choice",
        question: "마크다운(.md) 파일에서 제목을 만들 때 사용하는 기호는?",
        options: ["* (별표)", "# (샵)", "@ (골뱅이)", "& (앰퍼샌드)"],
        correctIndex: 1,
        explanation:
          "마크다운에서 # 기호를 사용하면 제목이 됩니다. #이 하나면 큰 제목, ##이면 소제목이에요.",
      },
    ],
  },
};
