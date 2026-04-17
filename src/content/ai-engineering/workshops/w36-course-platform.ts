import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W36 — AI 온라인 강의 플랫폼.
 *
 * Part A: 강의 콘텐츠 구조화·AI 퀴즈 생성·수료증 텍스트 생성을 LLM 으로 체험 (LLM 셀)
 * Part B: MD 레시피로 마크다운 강의 + 진도 추적 + AI 퀴즈 + 수료증 PDF 완성 (Claude Code / Cursor)
 */
export const workshopW36: Lesson = {
  id: "ai-eng-w36-course-platform",
  language: "ai-engineering",
  track: "beginner",
  order: 136,
  title: "W36: AI 온라인 강의 플랫폼",
  subtitle: "마크다운으로 강의 만들고 AI 퀴즈 + 수료증까지",
  estimatedMinutes: 240,
  cells: [
    {
      type: "markdown",
      source: `# 🎓 AI 온라인 강의 플랫폼 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**마크다운으로 강의를 작성하면 자동으로 강의 페이지가 만들어지고, AI 가 ==퀴즈==를 생성하고, 수료증 PDF 까지 발급하는 온라인 학습 플랫폼** — 강사는 마크다운만 쓰면 되고, 학생은 진도율과 퀴즈 점수를 확인하며 학습합니다.

### 완성 모습
\`\`\`
┌─ AI Course Platform ──────────────────────────────────────────┐
│  🎓 내 강의실        [📚 강의 목록]  [📊 대시보드]  🌙 다크   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  📚 전체 강의                              🔍 검색             │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │ 🐍 Python 기초   │  │ 🤖 AI 입문       │                     │
│  │ 12 레슨 · 6시간  │  │ 8 레슨 · 4시간   │                     │
│  │ ████████░░ 75%  │  │ ██░░░░░░░░ 25%  │                     │
│  │ ⭐ 4.8 (142명)  │  │ ⭐ 4.9 (89명)   │                     │
│  │ [이어서 학습]    │  │ [이어서 학습]    │                     │
│  │ 💰 ₩15,000      │  │ 🆓 무료          │                     │
│  └─────────────────┘  └─────────────────┘                     │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│  📖 레슨 3: 조건문과 반복문                                     │
│  ┌───────────────────────────────────────────────────────┐    │
│  │ ## 조건문 (if / elif / else)                          │    │
│  │                                                       │    │
│  │ 조건문은 프로그램의 흐름을 제어하는 기본 도구입니다.    │    │
│  │                                                       │    │
│  │ \`\`\`python                                            │    │
│  │ score = 85                                            │    │
│  │ if score >= 90:                                       │    │
│  │     print("A")                                        │    │
│  │ elif score >= 80:                                     │    │
│  │     print("B")                                        │    │
│  │ \`\`\`                                                   │    │
│  │                                                       │    │
│  │ [✅ 레슨 완료] ──────────────── 진도 3/12 (25%)       │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                               │
│  🧠 AI 퀴즈 (자동 생성)                                       │
│  ┌───────────────────────────────────────────────────────┐    │
│  │ Q1. if 문에서 조건이 거짓일 때 실행되는 키워드는?       │    │
│  │   ○ elif   ○ else   ○ then   ○ otherwise             │    │
│  │                                                       │    │
│  │ Q2. 다음 코드의 출력 결과는?                           │    │
│  │   \`\`\`python                                          │    │
│  │   for i in range(3): print(i)                         │    │
│  │   \`\`\`                                                 │    │
│  │   ○ 0 1 2   ○ 1 2 3   ○ 0 1 2 3   ○ 1 2             │    │
│  │                                                       │    │
│  │  [제출하기]                      점수: 80/100          │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                               │
│  📜 수료증                                                     │
│  ┌───────────────────────────────────────────────────────┐    │
│  │          ✦ Certificate of Completion ✦                │    │
│  │                                                       │    │
│  │  이 수료증은  홍길동  님이                              │    │
│  │  "Python 기초" 강의를 수료하였음을 증명합니다.          │    │
│  │                                                       │    │
│  │  완료일: 2026-04-17  |  점수: 92/100                   │    │
│  │                                                       │    │
│  │               [📥 PDF 다운로드]                        │    │
│  └───────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 강의 콘텐츠 구조화 + AI 퀴즈 생성 + 수료증 텍스트 | 80분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 풀스택 강의 플랫폼 완성 | 160분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - ==마크다운== 기본 문법 이해 (\`# 제목\`, \`**굵게**\`, \`\\\`코드\\\`\`)`,
    },

    // ─── Part A: AI 강의 엔진 ───
    {
      type: "markdown",
      source: `## Part A: AI 강의 엔진 만들기 (80분)

온라인 강의 플랫폼의 핵심은 **콘텐츠를 구조화**하고, **학습 효과를 높이는 ==퀴즈==를 자동 생성**하고, **수료를 인증하는 것**이에요.

핵심 개념 3가지:
1. **강의 콘텐츠 구조화** — 마크다운 원문을 ==레슨== 단위로 분할하고 메타데이터 추출
2. **AI 퀴즈 자동 생성** — 레슨 내용을 분석해서 이해도를 점검하는 문제 자동 생성
3. **수료증 텍스트 생성** — 학생 정보 + 성적 기반으로 개인화된 수료 문구 작성

> 📌 **==LMS== 란?** — Learning Management System. 강의 등록, 진도 추적, 시험, 성적 관리를 하나로 묶은 시스템이에요. Udemy, Coursera, 인프런 같은 플랫폼이 모두 LMS 입니다.`,
    },

    {
      type: "markdown",
      source: `### A-1. 강의 콘텐츠 구조화 — 마크다운 → 레슨 메타데이터

강사가 하나의 긴 마크다운 문서로 강의를 작성하면, AI 가 이것을 ==레슨== 단위로 분할하고, 각 레슨의 제목·난이도·예상 학습 시간·핵심 개념을 추출합니다. 이 메타데이터가 있어야 진도 추적과 커리큘럼 페이지를 만들 수 있어요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 강의 콘텐츠 구조화 — 마크다운 원문 → 레슨 메타데이터 JSON
const courseMarkdown = \`
# Python 기초 완전 정복

## 1. 변수와 자료형
파이썬에서 변수는 값을 저장하는 이름표입니다.
정수(int), 실수(float), 문자열(str), 불리언(bool) 네 가지 기본 자료형이 있습니다.

\\\`\\\`\\\`python
name = "홍길동"
age = 25
height = 175.5
is_student = True
\\\`\\\`\\\`

### 핵심 포인트
- 변수명은 영문 소문자와 밑줄 사용
- type() 함수로 자료형 확인

## 2. 조건문과 반복문
프로그램의 흐름을 제어하는 두 가지 핵심 도구입니다.
if/elif/else 로 분기하고, for/while 로 반복합니다.

\\\`\\\`\\\`python
for i in range(5):
    if i % 2 == 0:
        print(f"{i}는 짝수")
\\\`\\\`\\\`

### 핵심 포인트
- 들여쓰기(indentation)가 블록을 결정
- range(n)은 0부터 n-1까지

## 3. 함수와 모듈
반복되는 코드를 함수로 묶고, 관련 함수를 모듈로 정리합니다.
def 키워드로 함수를 정의하고, import 로 모듈을 불러옵니다.

\\\`\\\`\\\`python
def greet(name: str) -> str:
    return f"안녕하세요, {name}님!"

import math
print(math.sqrt(16))
\\\`\\\`\\\`

### 핵심 포인트
- 타입 힌트로 가독성 향상
- 내장 모듈 vs 외부 패키지
\`;

const systemPrompt = \`너는 온라인 교육 콘텐츠 전문 편집자야.
마크다운으로 작성된 강의 원문을 분석해서 레슨 단위의 구조화된 메타데이터를 추출해.

[응답 형식 — JSON]
{
  "courseTitle": "강의 제목",
  "totalLessons": 숫자,
  "estimatedTotalMinutes": 숫자,
  "difficulty": "beginner | intermediate | advanced",
  "lessons": [
    {
      "order": 1,
      "title": "레슨 제목",
      "slug": "url-friendly-slug",
      "estimatedMinutes": 숫자,
      "difficulty": "beginner | intermediate | advanced",
      "keyConcepts": ["개념1", "개념2"],
      "prerequisites": ["선수 레슨 slug 또는 빈 배열"],
      "hasCodeExample": true/false,
      "summary": "2줄 이내 요약"
    }
  ],
  "learningPath": "추천 학습 순서 설명"
}

[규칙]
- ## 헤딩을 레슨 구분 기준으로 사용
- estimatedMinutes 는 텍스트 분량 + 코드 예제 수로 추정 (짧은 텍스트 10분, 코드 포함 15~20분)
- keyConcepts 는 실제 코드에서 사용된 키워드 중심으로
- 한국어 제목, 영어 slug\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 강의를 구조화해줘:\\n\${courseMarkdown}\` },
  ],
});

try {
  const course = JSON.parse(res.text);
  console.log("📚 강의 구조화 결과");
  console.log("═".repeat(50));
  console.log("📖 제목:", course.courseTitle);
  console.log("📊 총 레슨:", course.totalLessons, "개");
  console.log("⏱️ 예상 시간:", course.estimatedTotalMinutes, "분");
  console.log("📈 난이도:", course.difficulty);

  console.log("\\n📑 레슨 목록:");
  course.lessons?.forEach((l: any) => {
    const icons = { beginner: "🟢", intermediate: "🟡", advanced: "🔴" };
    console.log(\`  \${icons[l.difficulty as keyof typeof icons] || "⬜"} [\${l.order}] \${l.title}\`);
    console.log(\`     ⏱️ \${l.estimatedMinutes}분 | 🔑 \${l.keyConcepts?.join(", ")}\`);
    console.log(\`     📝 \${l.summary}\`);
  });

  console.log("\\n🗺️ 학습 경로:", course.learningPath);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 마크다운 헤딩(##)을 기준으로 레슨을 분리하고, 코드 블록 수로 학습 시간을 추정해요.",
        "slug 는 URL 에 쓸 수 있는 영문 식별자 — 'variables-and-types' 같은 형태예요.",
        "keyConcepts 는 나중에 퀴즈 생성의 재료로 쓰입니다.",
        "실무에서는 이 메타데이터를 DB(Supabase) 에 저장하고 커리큘럼 페이지에 렌더링해요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. AI 퀴즈 자동 생성 — 레슨 내용 → 이해도 점검 문제

==LMS== 의 꽃은 **퀴즈**예요. 하지만 강사가 매 레슨마다 직접 문제를 만들기는 정말 힘들죠. AI 가 레슨 내용을 분석해서 핵심 개념을 점검하는 객관식 + 코드 출력 예측 문제를 자동으로 생성합니다.

포인트:
- **개념 이해 문제** — 핵심 용어와 원리를 묻는 객관식
- **코드 출력 예측** — 코드를 보고 실행 결과를 맞추는 문제
- **난이도 믹스** — 쉬운 문제 → 어려운 문제 순서로 배치`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// AI 퀴즈 자동 생성 — 레슨 콘텐츠 → 퀴즈 문제 배열
const lessonContent = \`
## 2. 조건문과 반복문
프로그램의 흐름을 제어하는 두 가지 핵심 도구입니다.
if/elif/else 로 분기하고, for/while 로 반복합니다.

파이썬의 조건문은 콜론(:)과 들여쓰기로 블록을 구분합니다.
C/Java 와 달리 중괄호를 쓰지 않아요.

\\\`\\\`\\\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
print(grade)  # B
\\\`\\\`\\\`

for 반복문은 iterable 객체를 순회합니다.
range() 함수로 숫자 범위를 만들 수 있어요.

\\\`\\\`\\\`python
fruits = ["사과", "바나나", "체리"]
for fruit in fruits:
    print(fruit)

for i in range(1, 4):
    print(i * 10)  # 10, 20, 30
\\\`\\\`\\\`

while 반복문은 조건이 참인 동안 반복합니다.
break 로 즉시 탈출, continue 로 다음 반복으로 건너뛸 수 있어요.
\`;

const systemPrompt = \`너는 교육용 퀴즈 전문 출제자야.
레슨 내용을 분석해서 학습 이해도를 점검하는 퀴즈 문제를 생성해.

[문제 유형]
1. multiple-choice: 개념 이해 객관식 (4지선다)
2. predict-output: 코드 실행 결과 예측 (4지선다)

[응답 형식 — JSON]
{
  "lessonTitle": "레슨 제목",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "문제 텍스트",
      "options": ["선택지A", "선택지B", "선택지C", "선택지D"],
      "correctIndex": 0,
      "explanation": "정답 해설",
      "difficulty": "easy | medium | hard"
    },
    {
      "type": "predict-output",
      "question": "다음 코드의 출력 결과는?",
      "code": "실행할 코드",
      "options": ["출력A", "출력B", "출력C", "출력D"],
      "correctIndex": 0,
      "explanation": "코드 실행 흐름 해설",
      "difficulty": "easy | medium | hard"
    }
  ]
}

[규칙]
- 총 5문제: multiple-choice 3개 + predict-output 2개
- 난이도: easy 2개, medium 2개, hard 1개
- 오답 선택지도 그럴듯하게 (흔한 실수 반영)
- 해설은 "왜 정답인지" + "왜 오답인지" 모두 포함
- 한국어로 작성\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 레슨 내용으로 퀴즈를 만들어줘:\\n\${lessonContent}\` },
  ],
});

try {
  const quiz = JSON.parse(res.text);
  console.log("🧠 AI 퀴즈 생성 결과");
  console.log("═".repeat(50));
  console.log("📖 레슨:", quiz.lessonTitle);
  console.log("📝 문제 수:", quiz.questions?.length);

  quiz.questions?.forEach((q: any, i: number) => {
    const diffIcon = { easy: "🟢", medium: "🟡", hard: "🔴" };
    const typeIcon = q.type === "predict-output" ? "💻" : "📝";
    console.log(\`\\n\${typeIcon} Q\${i + 1}. [\${diffIcon[q.difficulty as keyof typeof diffIcon] || "⬜"} \${q.difficulty}]\`);
    console.log(\`   \${q.question}\`);

    if (q.code) {
      console.log(\`   \\\`\\\`\\\`\\n   \${q.code}\\n   \\\`\\\`\\\`\`);
    }

    q.options?.forEach((opt: string, j: number) => {
      const marker = j === q.correctIndex ? "✅" : "  ";
      console.log(\`   \${marker} \${String.fromCharCode(65 + j)}. \${opt}\`);
    });

    console.log(\`   💡 \${q.explanation}\`);
  });
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: AI 가 레슨 텍스트 + 코드 예제를 분석해서 자동으로 퀴즈를 만들어요.",
        "predict-output 문제는 실제 코드 실행 결과를 맞추는 거라 학습 효과가 높아요.",
        "오답 선택지에 '흔한 실수'를 넣으면 학생이 자주 하는 실수를 교정할 수 있어요.",
        "실무에서는 퀴즈 결과를 DB 에 저장하고, 정답률이 낮은 문제를 분석해서 레슨을 개선해요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 수료증 텍스트 생성 — 학생 정보 + 성적 → 개인화 수료 문구

모든 레슨과 퀴즈를 완료한 학생에게 **수료증 PDF** 를 발급합니다. AI 가 학생 이름·강의명·성적·학습 기간을 바탕으로 격식 있는 수료 문구를 생성하고, 이걸 ==html2pdf== 로 PDF 변환합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 수료증 텍스트 생성 — 학생 정보 + 성적 → 수료 문구 + HTML 템플릿
const studentInfo = {
  name: "김서연",
  courseName: "Python 기초 완전 정복",
  instructor: "이준혁",
  completedDate: "2026-04-17",
  totalLessons: 12,
  completedLessons: 12,
  quizAverage: 92,
  totalHours: 6.5,
  enrolledDate: "2026-03-15",
};

const systemPrompt = \`너는 온라인 교육 플랫폼의 수료증 디자이너야.
학생 정보와 성적을 바탕으로 수료증에 들어갈 텍스트와 HTML 템플릿을 생성해.

[응답 형식 — JSON]
{
  "certificate": {
    "title": "수료증 상단 제목 (영문 + 한글)",
    "subtitle": "부제목",
    "bodyKo": "한국어 수료 문구 (2~3문장, 격식체)",
    "bodyEn": "English certificate text (2-3 sentences, formal)",
    "achievement": "성취 등급 (Excellent / Great / Good / Completed)",
    "achievementDescription": "등급 설명",
    "details": {
      "studentName": "학생 이름",
      "courseName": "강의명",
      "instructor": "강사명",
      "completedDate": "완료일",
      "score": "점수",
      "duration": "학습 기간"
    }
  },
  "htmlTemplate": "인라인 CSS 포함 A4 세로 HTML (600x840px 기준, 우아한 디자인)"
}

[규칙]
- 퀴즈 평균 90+ → Excellent, 80+ → Great, 70+ → Good, 그 외 → Completed
- HTML 은 html2pdf.js 로 바로 변환 가능하게 인라인 CSS 사용
- 금색/네이비 색상 조합으로 격식 있는 디자인
- 학생 이름은 크고 눈에 띄게
- 하단에 강사 서명란과 발급일\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 학생의 수료증을 만들어줘:\\n\${JSON.stringify(studentInfo, null, 2)}\` },
  ],
});

try {
  const result = JSON.parse(res.text);
  const cert = result.certificate;
  console.log("📜 수료증 생성 결과");
  console.log("═".repeat(50));
  console.log("🏆 제목:", cert.title);
  console.log("📌 부제:", cert.subtitle);
  console.log("\\n🇰🇷 한국어:\\n  ", cert.bodyKo);
  console.log("\\n🇺🇸 English:\\n  ", cert.bodyEn);
  console.log("\\n⭐ 성취 등급:", cert.achievement);
  console.log("   ", cert.achievementDescription);

  console.log("\\n📋 상세 정보:");
  const d = cert.details;
  console.log(\`  👤 \${d.studentName}\`);
  console.log(\`  📖 \${d.courseName}\`);
  console.log(\`  👨‍🏫 강사: \${d.instructor}\`);
  console.log(\`  📅 완료일: \${d.completedDate}\`);
  console.log(\`  📊 점수: \${d.score}\`);
  console.log(\`  ⏱️ 학습 기간: \${d.duration}\`);

  if (result.htmlTemplate) {
    console.log("\\n🖼️ HTML 템플릿 미리보기 (앞부분):");
    console.log(result.htmlTemplate.slice(0, 300) + "...");
    console.log("\\n💡 이 HTML 을 html2pdf.js 로 변환하면 수료증 PDF 가 됩니다!");
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: AI 가 학생 성적에 따라 등급을 매기고, 격식 있는 수료 문구를 자동 생성해요.",
        "html2pdf.js 는 HTML 요소를 그대로 PDF 로 변환하는 라이브러리예요.",
        "인라인 CSS 를 쓰는 이유: html2pdf 가 외부 스타일시트를 로드하지 못할 수 있어서요.",
        "실무에서는 수료증에 고유 번호(UUID)를 넣어서 위조 방지 검증을 합니다.",
      ],
    },

    // ─── Part B: 풀스택 구현 레시피 ───
    {
      type: "markdown",
      source: `## Part B: AI 온라인 강의 플랫폼 만들기 (160분)

> 🛠️ Part B 는 Claude Code 또는 Cursor 에서 아래 ==프롬프트==를 사용해 만들어요.
> 코드를 직접 입력하는 게 아니라, AI 에게 지시해서 프로젝트를 생성합니다.

---

### 🔧 기술 스택

| 영역 | 기술 | 역할 |
|---|---|---|
| 프론트엔드 | React + TypeScript + Vite | ==SPA== 기반 강의 플랫폼 UI |
| 스타일 | Tailwind CSS | 유틸리티 기반 반응형 디자인 |
| 백엔드/DB | Supabase | 인증 + PostgreSQL + ==RLS== |
| AI | @google/genai (Gemini) | 퀴즈 자동 생성 + 수료증 텍스트 |
| 마크다운 | react-markdown + remark-gfm | 강의 콘텐츠 렌더링 |
| PDF | html2pdf.js | 수료증 PDF 생성 |
| 결제 (선택) | Stripe | 유료 강의 결제 |

### 📐 데이터 모델

\`\`\`
courses
├── id (uuid, PK)
├── title (text)
├── description (text)
├── instructor_id (uuid → auth.users)
├── thumbnail_url (text)
├── price (integer, 0 = 무료)
├── is_published (boolean)
├── created_at (timestamptz)
└── updated_at (timestamptz)

lessons
├── id (uuid, PK)
├── course_id (uuid → courses)
├── order (integer)
├── title (text)
├── content_md (text)          ← 마크다운 강의 내용
├── estimated_minutes (integer)
└── created_at (timestamptz)

quizzes
├── id (uuid, PK)
├── lesson_id (uuid → lessons)
├── questions (jsonb)          ← AI 가 생성한 문제 배열
├── generated_at (timestamptz)
└── model_used (text)

enrollments
├── id (uuid, PK)
├── user_id (uuid → auth.users)
├── course_id (uuid → courses)
├── enrolled_at (timestamptz)
└── payment_id (text, nullable) ← Stripe payment intent

progress
├── id (uuid, PK)
├── user_id (uuid → auth.users)
├── lesson_id (uuid → lessons)
├── completed (boolean)
├── completed_at (timestamptz)
└── quiz_score (integer, nullable)

certificates
├── id (uuid, PK)
├── user_id (uuid → auth.users)
├── course_id (uuid → courses)
├── issued_at (timestamptz)
├── quiz_average (integer)
├── certificate_html (text)
└── certificate_number (text)  ← UUID 기반 고유 번호
\`\`\`

---

### 🚀 Claude Code / Cursor 프롬프트

아래 프롬프트를 복사해서 터미널(Claude Code) 또는 Composer(Cursor) 에 붙여 넣으세요:

\`\`\`
AI 온라인 강의 플랫폼을 만들어줘.

[기술 스택]
- React + TypeScript + Vite + Tailwind CSS
- Supabase (Auth + PostgreSQL + RLS)
- @google/genai (Gemini 2.0 Flash)
- react-markdown + remark-gfm (마크다운 렌더링)
- html2pdf.js (수료증 PDF)
- Stripe (선택: 유료 강의)

[필수 기능]

1. 인증
   - Supabase Auth (이메일/비밀번호 + Google OAuth)
   - 역할 구분: student / instructor
   - 역할에 따른 대시보드 분기

2. 강의 관리 (강사)
   - 강의 CRUD (제목, 설명, 썸네일, 가격)
   - 레슨 CRUD (마크다운 에디터로 콘텐츠 작성)
   - 마크다운 에디터에 실시간 미리보기 (split view)
   - 강의 공개/비공개 토글
   - 수강생 통계 (등록 수, 완료율, 평균 퀴즈 점수)

3. 강의 수강 (학생)
   - 강의 목록 (카드 그리드, 검색, 필터: 무료/유료/난이도)
   - 강의 상세 (커리큘럼, 강사 정보, 리뷰)
   - 레슨 페이지 (react-markdown 으로 마크다운 렌더링)
   - 레슨 완료 버튼 → progress 테이블 업데이트
   - 코스 진도율 표시 (완료 레슨 / 전체 레슨 %)
   - 사이드바에 레슨 목록 + 완료 체크 표시

4. AI 퀴즈 자동 생성
   - 레슨 페이지 하단 "AI 퀴즈 생성" 버튼
   - Gemini 에게 레슨 마크다운 전달 → 5문제 자동 생성
   - 문제 유형: 객관식 (4지선다) + 코드 출력 예측
   - 퀴즈 풀기 UI (한 문제씩 표시, 제출 후 채점)
   - 점수 저장 (progress.quiz_score)
   - 이미 생성된 퀴즈가 있으면 재사용

5. 수료증 PDF
   - 모든 레슨 완료 + 퀴즈 평균 70점 이상 → 수료증 발급 가능
   - AI 로 수료 문구 생성 (학생명, 강의명, 점수, 날짜)
   - html2pdf.js 로 HTML → PDF 변환 후 다운로드
   - 수료증 고유번호 (UUID) + 검증 페이지

6. 대시보드
   - 학생: 수강 중인 강의, 진도율, 퀴즈 점수, 수료증
   - 강사: 내 강의 관리, 수강생 수, 완료율, 수익

7. UI/UX
   - 다크/라이트 모드 토글
   - 반응형 (모바일/태블릿/데스크톱)
   - 로딩 스켈레톤
   - Toast 알림

[선택 기능 — Stripe 결제]
- 유료 강의: price > 0 인 강의는 결제 후 수강
- Stripe Checkout Session 으로 결제
- 결제 완료 → enrollments 테이블에 기록
- webhook 으로 결제 확인 (선택)

[Supabase RLS 정책]
- courses: 누구나 읽기, instructor 만 자기 강의 CRUD
- lessons: 등록 학생만 읽기 (무료 강의는 누구나)
- progress: 본인 것만 읽기/쓰기
- certificates: 본인 것만 읽기, 서버만 생성
- enrollments: 본인 것만 읽기

[환경 변수]
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key (선택)
\`\`\`

---

### 📁 예상 폴더 구조

\`\`\`
src/
├── components/
│   ├── auth/           # LoginForm, SignupForm, AuthGuard
│   ├── course/         # CourseCard, CourseGrid, CourseDetail
│   ├── lesson/         # LessonView, LessonSidebar, MarkdownRenderer
│   ├── quiz/           # QuizGenerator, QuizPlayer, QuizResult
│   ├── certificate/    # CertificateView, CertificateDownload
│   ├── dashboard/      # StudentDashboard, InstructorDashboard
│   ├── editor/         # MarkdownEditor, CourseForm, LessonForm
│   └── ui/             # Button, Card, Modal, Toast, Skeleton
├── hooks/
│   ├── useAuth.ts
│   ├── useCourses.ts
│   ├── useProgress.ts
│   └── useQuiz.ts
├── lib/
│   ├── supabase.ts     # Supabase 클라이언트
│   ├── gemini.ts       # Gemini AI 클라이언트
│   ├── stripe.ts       # Stripe 클라이언트 (선택)
│   └── certificate.ts  # html2pdf 수료증 생성
├── pages/
│   ├── Home.tsx
│   ├── Courses.tsx
│   ├── CourseDetail.tsx
│   ├── LessonPage.tsx
│   ├── Dashboard.tsx
│   └── CertificateVerify.tsx
├── types/
│   └── database.ts     # Supabase 타입
├── App.tsx
└── main.tsx
\`\`\``,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

기본 플랫폼이 완성되면 아래 기능을 추가해 보세요!

### 도전 1: 학습 분석 대시보드 📊
\`\`\`
강사 대시보드에 학습 분석 기능을 추가해줘.

- 레슨별 완료율 차트 (bar chart)
- 퀴즈 문제별 정답률 (어떤 문제가 어려운지)
- 학생 이탈 지점 분석 (어느 레슨에서 학습을 중단하는지)
- 주간/월간 수강생 추이 그래프
- recharts 또는 chart.js 사용
\`\`\`

### 도전 2: AI 학습 도우미 챗봇 🤖
\`\`\`
레슨 페이지에 AI 학습 도우미를 추가해줘.

- 레슨 내용 기반 Q&A 챗봇
- "이 부분 더 쉽게 설명해줘" 기능
- 틀린 퀴즈 해설 요청
- 관련 추가 학습 자료 추천
- 플로팅 버튼으로 열고 닫기
\`\`\`

### 도전 3: 강의 리뷰 + 평점 시스템 ⭐
\`\`\`
강의에 리뷰와 평점 기능을 추가해줘.

- 수료 후 리뷰 작성 (별점 1~5 + 텍스트)
- 강의 상세 페이지에 리뷰 목록
- 평균 평점 표시
- AI 로 리뷰 요약 (긍정/부정 포인트 정리)
- 부적절한 리뷰 자동 필터링
\`\`\`

### 도전 4: 강의 검색 + 추천 🔍
\`\`\`
AI 기반 강의 추천 시스템을 추가해줘.

- 전문 검색 (제목 + 설명 + 레슨 내용)
- 학습 이력 기반 "다음에 들을 강의" 추천
- "이 강의를 들은 사람은 이것도 들었어요"
- 카테고리/태그 기반 필터링
- Supabase full-text search 또는 pg_trgm 활용
\`\`\`

### 도전 5: 실시간 코드 실행기 💻
\`\`\`
레슨 페이지에 인터랙티브 코드 실행기를 추가해줘.

- 마크다운 코드 블록을 실행 가능한 에디터로 변환
- Pyodide (Python) / eval (JavaScript) 로 브라우저 실행
- 실행 결과 인라인 표시
- "정답 확인" 기능 (AI 가 코드를 평가)
- Monaco Editor 사용
\`\`\``,
    },

    // ─── 핵심 개념 정리 ───
    {
      type: "markdown",
      source: `## 📚 핵심 개념 정리

### 이 워크샵에서 배운 것

| 개념 | 설명 | 활용 |
|---|---|---|
| ==LMS== | 학습 관리 시스템 | 강의·진도·시험·성적 통합 관리 |
| ==마크다운== 렌더링 | MD → HTML 변환 | react-markdown 으로 강의 페이지 |
| AI 퀴즈 생성 | 콘텐츠 → 문제 자동 생성 | 강사 부담 줄이고 학습 효과 높이기 |
| ==html2pdf== | HTML → PDF 변환 | 수료증·리포트 다운로드 |
| ==RLS== | 행 수준 보안 | DB 레벨 접근 제어 (누가 뭘 볼 수 있는지) |
| 진도 추적 | 레슨 완료율 계산 | 학생 동기부여 + 강사 분석 |
| ==SPA== | 단일 페이지 앱 | 페이지 이동 없이 부드러운 UI |

### 실무에서 이 기술이 쓰이는 곳

- **Udemy / Coursera** — 마크다운 + 비디오 기반 강의 관리
- **Notion** — 마크다운 에디터 + 실시간 렌더링
- **Duolingo** — AI 기반 퀴즈 자동 생성 + 적응형 학습
- **인프런** — 한국형 LMS + 수료증 발급
- **Google Classroom** — 과제·퀴즈·성적 관리
- **Khan Academy** — 진도 추적 + 개인화 학습 경로`,
    },
  ],

  quiz: {
    title: "W36: AI 온라인 강의 플랫폼 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "마크다운 강의 원문을 레슨 단위로 분할할 때, AI 에게 추출을 요청하는 메타데이터로 **적절하지 않은** 것은?",
        options: [
          "레슨 제목과 URL slug",
          "예상 학습 시간과 난이도",
          "학생의 개인 학습 속도",
          "핵심 개념과 선수 레슨",
        ],
        correctIndex: 2,
        explanation:
          "강의 콘텐츠 구조화 단계에서는 콘텐츠 자체의 메타데이터(제목, 난이도, 시간, 개념)를 추출합니다. 학생의 개인 학습 속도는 콘텐츠가 아닌 사용자 데이터이므로 이 단계에서 추출하지 않아요.",
      },
      {
        type: "multiple-choice",
        question:
          "AI 퀴즈 자동 생성에서 'predict-output' 유형의 문제가 학습에 효과적인 이유는?",
        options: [
          "문제를 만들기 가장 쉬워서",
          "코드 실행 흐름을 머릿속으로 따라가야 해서",
          "정답이 항상 하나로 정해져서",
          "AI 가 가장 정확하게 만들 수 있어서",
        ],
        correctIndex: 1,
        explanation:
          "코드 출력 예측 문제는 학생이 코드를 한 줄씩 머릿속으로 실행(mental execution)해야 하기 때문에 깊은 이해를 요구합니다. 단순 암기가 아닌 '코드 읽기 능력'을 키우는 효과적인 학습 방법이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "수료증 PDF 생성 시 html2pdf.js 에 인라인 CSS 를 사용하는 주된 이유는?",
        options: [
          "인라인 CSS 가 더 빨라서",
          "외부 스타일시트를 로드하지 못할 수 있어서",
          "브라우저 호환성 때문에",
          "파일 크기를 줄이기 위해서",
        ],
        correctIndex: 1,
        explanation:
          "html2pdf.js 는 HTML 요소를 캡처해서 PDF 로 변환하는데, 이 과정에서 외부 CSS 파일이나 CDN 스타일시트를 로드하지 못할 수 있습니다. 인라인 CSS 를 쓰면 스타일이 HTML 에 직접 포함되어 항상 올바르게 렌더링돼요.",
      },
      {
        type: "multiple-choice",
        question:
          "Supabase RLS(Row Level Security) 에서 progress 테이블에 '본인 것만 읽기/쓰기' 정책을 설정하는 이유는?",
        options: [
          "데이터베이스 성능을 높이기 위해",
          "다른 학생의 진도와 퀴즈 점수를 볼 수 없게 하려고",
          "강사가 학생 데이터를 수정하지 못하게 하려고",
          "데이터 백업을 쉽게 하려고",
        ],
        correctIndex: 1,
        explanation:
          "RLS 는 데이터베이스 레벨에서 접근을 제어합니다. progress 테이블에 본인만 접근 가능하게 설정하면, API 를 직접 호출하더라도 다른 학생의 학습 진도나 퀴즈 점수를 조회할 수 없어요. 프라이버시와 보안의 핵심이에요.",
      },
      {
        type: "predict-output",
        question:
          "다음 코드에서 수료증 발급 가능 여부를 판단합니다. 출력 결과는?",
        code: `const progress = {
  totalLessons: 10,
  completedLessons: 10,
  quizScores: [80, 90, 75, 85, 70],
};

const allComplete = progress.completedLessons === progress.totalLessons;
const avgScore = progress.quizScores.reduce((a, b) => a + b, 0) / progress.quizScores.length;
const canCertify = allComplete && avgScore >= 70;

console.log(\`완료: \${allComplete}, 평균: \${avgScore}, 발급: \${canCertify}\`);`,
        options: [
          "완료: true, 평균: 80, 발급: true",
          "완료: true, 평균: 75, 발급: true",
          "완료: false, 평균: 80, 발급: false",
          "완료: true, 평균: 80, 발급: false",
        ],
        correctIndex: 0,
        explanation:
          "completedLessons(10) === totalLessons(10) 이므로 allComplete = true. quizScores 합계 = 80+90+75+85+70 = 400, 400/5 = 80이므로 avgScore = 80. 80 >= 70 이므로 canCertify = true && true = true. 모든 조건을 충족해서 수료증 발급이 가능합니다!",
      },
    ],
  } satisfies Quiz,
};
