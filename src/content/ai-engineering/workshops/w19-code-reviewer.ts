import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W19 — AI 코드 리뷰어.
 *
 * Part A: 코드 리뷰 기초 + AI 분석 체험 (LLM 셀 3개)
 * Part B: React+TS+Vite+Tailwind 코드 리뷰 앱 (MD 레시피)
 */
export const workshopW19: Lesson = {
  id: "ai-eng-w19-code-reviewer",
  language: "ai-engineering",
  track: "beginner",
  order: 119,
  title: "W19: AI 코드 리뷰어",
  subtitle: "코드를 붙여넣으면 AI가 보안·성능·스타일 리뷰",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 🔍 AI 코드 리뷰어 — 코드를 넣으면 보안·성능·스타일 리뷰

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 할 것

**코드를 붙여넣으면 AI 가 보안 취약점, 성능 이슈, 스타일 위반을 자동으로 찾아주는 코드 리뷰어** 를 만듭니다.
사람이 코드 리뷰하면 1시간, AI 는 10초. 핵심 이슈를 놓치지 않아요.

### 완성 미리보기
\`\`\`
┌─────────────────────────────────────────────────────┐
│  🔍 AI 코드 리뷰어                    [다크/라이트]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📝 코드 입력                    📊 리뷰 결과        │
│  ┌──────────────────────┐      ┌──────────────────┐ │
│  │ function login(u,p){ │      │ 🔴 CRITICAL (2)  │ │
│  │   const q = "SELECT  │      │ SQL Injection     │ │
│  │   * FROM users WHERE │      │   → Line 2: 문자열│ │
│  │   user='" + u + "'"; │      │   결합 대신 파라미 │ │
│  │   if(p == "admin")   │      │   터 바인딩 사용   │ │
│  │     return true;     │      │ 하드코딩 비밀번호  │ │
│  │   eval(u);           │      │   → Line 4       │ │
│  │ }                    │      │                  │ │
│  └──────────────────────┘      │ 🟡 WARNING (1)   │ │
│                                │ eval() 사용 금지  │ │
│  [언어: JavaScript ▼]          │   → Line 6       │ │
│  [🔍 리뷰 시작]                │                  │ │
│                                │ 🔵 INFO (1)      │ │
│  ──────────────────────        │ == 대신 === 사용  │ │
│  📈 점수: 25/100               │   → Line 4       │ │
│  ██░░░░░░░░ 위험               │                  │ │
│                                │ ✅ 개선된 코드 보기│ │
│                                └──────────────────┘ │
└─────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 코드 리뷰 기초 + AI 분석 체험 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | 풀스택 코드 리뷰어 앱 제작 | 100분 | 내 컴퓨터 (터미널 + 브라우저) |

> ⚠️ **전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 + Gemini API 키 발급`,
    },

    // ─── Part A: 코드 리뷰 기초 + AI 분석 ───
    {
      type: "markdown",
      source: `## Part A: 코드 리뷰 기초 + AI 분석 (50분)

AI 에게 코드를 전달하고 구조화된 리뷰 결과를 받는 3가지 패턴을 배웁니다.

---

### A-1: 코드 리뷰 기초 — 버그와 개선점 찾기 🐛

코드를 붙여넣으면 AI 가 버그, 개선점을 찾아서 **구조화된 JSON** 으로 돌려줍니다.
==정적 분석== 도구(ESLint, SonarQube)가 못 잡는 논리적 오류까지 AI 는 찾아낼 수 있어요.

> 💡 핵심: AI 에게 "JSON 으로만 답해" 라고 지시하면, 결과를 코드로 파싱해서 UI 에 보여줄 수 있습니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// === A-1: 코드 리뷰 기초 — 버그와 개선점 찾기 ===
// targetCode 를 여러분의 코드로 바꿔보세요!

const targetCode = \`
function processOrder(order) {
  let total = 0;
  for (var i = 0; i <= order.items.length; i++) {
    total += order.items[i].price * order.items[i].qty;
  }
  if (order.coupon == "VIP") {
    total = total * 0.1;  // VIP 할인
  }
  return total.toFixed(2);
}
\`;

const res = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 시니어 코드 리뷰어야. 코드를 분석해서 반드시 아래 JSON 형식으로만 답해.

[응답 형식]
{
  "summary": "한 줄 요약",
  "issues": [
    {
      "severity": "critical | warning | info",
      "category": "bug | performance | security | style",
      "line": 숫자,
      "title": "이슈 제목",
      "description": "상세 설명",
      "suggestion": "개선 방법"
    }
  ],
  "score": 0~100
}

severity 기준:
- critical: 런타임 에러, 데이터 손실, 보안 취약점
- warning: 잠재적 버그, 성능 저하
- info: 스타일, 가독성, 베스트 프랙티스\`,
    },
    {
      role: "user",
      content: \`아래 코드를 리뷰해줘:\\n\\n\\\`\\\`\\\`javascript\\n\${targetCode}\\n\\\`\\\`\\\`\`,
    },
  ],
});

const review = JSON.parse(res.text);

console.log("📊 리뷰 결과");
console.log("─".repeat(50));
console.log(\`📝 요약: \${review.summary}\`);
console.log(\`🎯 점수: \${review.score}/100\`);
console.log(\`🔍 이슈 \${review.issues.length}개 발견\\n\`);

for (const issue of review.issues) {
  const badge = issue.severity === "critical" ? "🔴"
    : issue.severity === "warning" ? "🟡" : "🔵";
  console.log(\`\${badge} [\${issue.severity.toUpperCase()}] \${issue.title} (Line \${issue.line})\`);
  console.log(\`   📂 \${issue.category} | \${issue.description}\`);
  console.log(\`   💡 \${issue.suggestion}\\n\`);
}`,
      hints: [
        "JSON 형식을 system prompt 에 명시하면 AI 가 구조화된 데이터를 반환해요.",
        "severity 를 3단계로 나누면 '심각한 것부터 고치기' 전략이 가능합니다.",
        "<= 를 < 로, var 를 let/const 로, == 를 === 로 바꿔야 해요. AI 가 찾았나요?",
      ],
    },

    {
      type: "markdown",
      source: `### A-2: 카테고리별 분석 — 보안·성능·스타일 분리 🛡️

리뷰를 한꺼번에 받으면 중요한 게 묻힐 수 있어요.
카테고리별로 나눠서 요청하면 더 정밀한 분석이 가능합니다.

- 🛡️ **보안**: ==SQL Injection==, ==XSS==, 하드코딩된 비밀, eval() 사용
- ⚡ **성능**: 불필요한 루프, 메모리 누수, N+1 쿼리
- 🎨 **스타일**: 네이밍 컨벤션, 코드 중복, 가독성`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// === A-2: 카테고리별 분석 — 보안·성능·스타일 분리 ===

const targetCode = \`
const express = require("express");
const app = express();
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost", user: "root", password: "1234", database: "shop"
});

app.get("/search", (req, res) => {
  const keyword = req.query.q;
  db.query("SELECT * FROM products WHERE name LIKE '%" + keyword + "%'", (err, rows) => {
    if (err) { res.send("에러남"); return; }
    let html = "<h1>검색 결과</h1>";
    for (let i = 0; i < rows.length; i++) {
      html += "<div>" + rows[i].name + " - " + rows[i].price + "원</div>";
    }
    res.send(html);
  });
});

app.listen(3000);
\`;

const categories = ["security", "performance", "style"] as const;
const labels: Record<string, string> = {
  security: "🛡️ 보안 분석",
  performance: "⚡ 성능 분석",
  style: "🎨 스타일 분석",
};

for (const category of categories) {
  const res = await chat({
    provider: "gemini",
    messages: [
      {
        role: "system",
        content: \`너는 \${category} 전문 코드 리뷰어야.
오직 \${category} 관점에서만 코드를 분석해.
JSON 배열로만 답해:
[
  {
    "severity": "critical | warning | info",
    "line": 숫자,
    "title": "이슈 제목",
    "description": "설명",
    "fix": "수정 방법 (코드 포함)"
  }
]
이슈가 없으면 빈 배열 [] 을 반환해.\`,
      },
      {
        role: "user",
        content: \`아래 코드의 \${category} 이슈를 찾아줘:\\n\\n\\\`\\\`\\\`javascript\\n\${targetCode}\\n\\\`\\\`\\\`\`,
      },
    ],
  });

  const issues = JSON.parse(res.text);
  console.log(\`\\n\${labels[category]}\`);
  console.log("═".repeat(40));

  if (issues.length === 0) {
    console.log("  ✅ 이슈 없음!");
  } else {
    for (const issue of issues) {
      const badge = issue.severity === "critical" ? "🔴"
        : issue.severity === "warning" ? "🟡" : "🔵";
      console.log(\`  \${badge} \${issue.title} (Line \${issue.line})\`);
      console.log(\`     \${issue.description}\`);
      console.log(\`     💡 \${issue.fix}\\n\`);
    }
  }
}`,
      hints: [
        "카테고리별로 분리하면 각 분야에 더 집중된 분석을 받을 수 있어요.",
        "보안: SQL Injection, 비밀번호 하드코딩, XSS. 성능: 문자열 결합 HTML. 스타일: require → import, 에러 처리 부실.",
        "실무에서는 이렇게 카테고리별 리뷰를 병렬 실행(Promise.all)해서 속도를 높입니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3: 개선 코드 제안 — AI 가 고쳐준 코드 + ==diff== 설명 📝

이슈를 찾는 것만으로는 부족해요. AI 에게 **수정된 코드** 와 **변경 이유** 를 함께 받으면
주니어 개발자도 시니어 수준의 코드를 작성할 수 있습니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// === A-3: 개선 코드 제안 — 수정 코드 + diff 설명 ===

const originalCode = \`
async function fetchUsers() {
  try {
    const res = await fetch("/api/users");
    const data = await res.json();
    const filtered = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].age > 18 && data[i].active == true) {
        filtered.push({
          name: data[i].name,
          email: data[i].email,
          age: data[i].age,
        });
      }
    }
    return filtered;
  } catch (e) {
    console.log(e);
  }
}
\`;

const res = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 코드 리팩토링 전문가야. 코드를 개선하고 변경 사항을 설명해.
반드시 아래 JSON 형식으로만 답해:

{
  "improvedCode": "개선된 전체 코드 (문자열)",
  "changes": [
    {
      "before": "변경 전 코드 조각",
      "after": "변경 후 코드 조각",
      "reason": "변경 이유",
      "category": "bug | performance | security | style | readability"
    }
  ],
  "scoreBefore": 0~100,
  "scoreAfter": 0~100
}\`,
    },
    {
      role: "user",
      content: \`아래 코드를 개선해줘. 동작은 동일하게 유지하면서 품질을 높여줘:\\n\\n\\\`\\\`\\\`typescript\\n\${originalCode}\\n\\\`\\\`\\\`\`,
    },
  ],
});

const result = JSON.parse(res.text);

console.log("📊 코드 개선 결과");
console.log("═".repeat(50));
console.log(\`점수: \${result.scoreBefore} → \${result.scoreAfter} (+\${result.scoreAfter - result.scoreBefore})\\n\`);

console.log("📝 변경 사항:");
for (const change of result.changes) {
  const icon = change.category === "bug" ? "🐛"
    : change.category === "security" ? "🛡️"
    : change.category === "performance" ? "⚡"
    : change.category === "style" ? "🎨" : "📖";
  console.log(\`\\n\${icon} [\${change.category}] \${change.reason}\`);
  console.log(\`  - 변경 전: \${change.before}\`);
  console.log(\`  + 변경 후: \${change.after}\`);
}

console.log(\`\\n✅ 개선된 코드:\\n\`);
console.log(result.improvedCode);`,
      hints: [
        "res.json() 전에 res.ok 체크, == 를 === 로, for 루프를 filter+map 으로 바꾸는 게 핵심.",
        "catch(e) { console.log(e) } 는 에러를 삼키는 안티패턴. throw 하거나 적절히 처리해야 해요.",
        "실무 팁: 'before/after' 형식은 GitHub PR 의 diff 뷰와 비슷해요. 이걸 UI 로 보여주면 강력합니다.",
      ],
    },

    // ─── Part A 완료 ───
    {
      type: "markdown",
      source: `## ✅ Part A 완료!

3가지 AI 코드 리뷰 패턴을 배웠어요:

| 패턴 | 핵심 | 활용 |
|---|---|---|
| **A-1** 종합 리뷰 | JSON 구조화 출력 | 전체 코드 품질 점수 |
| **A-2** 카테고리 분리 | 전문가별 분석 | 보안·성능·스타일 각각 정밀 리뷰 |
| **A-3** 코드 개선 | before/after ==diff== | 수정 코드 + 변경 이유 제공 |

이제 Part B 에서 이 패턴들을 조합해 **풀스택 코드 리뷰어 앱** 을 만들어봐요!

---

## Part B: AI 코드 리뷰어 앱 제작 (100분)

Part A 에서 배운 AI 리뷰 패턴을 React 앱으로 만듭니다.
코드를 입력하면 보안·성능·스타일 리뷰가 실시간으로 나오고, 개선된 코드까지 보여주는 도구입니다.

### 기술 스택
\`\`\`
React + TypeScript + Vite
Tailwind CSS (다크/라이트 모드)
@google/genai (Gemini SDK)
Monaco Editor (코드 입력 — VS Code 와 동일한 에디터)
localStorage (리뷰 히스토리 저장)
\`\`\`

### 핵심 기능 미리보기
\`\`\`
  코드 입력 (Monaco)          AI 분석 엔진           리뷰 결과 UI
  ┌────────────────┐        ┌──────────────┐       ┌──────────────┐
  │ function foo() │  ───▶  │ Gemini API   │  ───▶ │ 🔴 Critical  │
  │ { ... }        │        │ 3가지 분석:   │       │ 🟡 Warning   │
  │                │        │ · 보안       │       │ 🔵 Info      │
  │ [JS ▼] [리뷰]  │        │ · 성능       │       │              │
  └────────────────┘        │ · 스타일     │       │ 📊 점수: 72  │
                            └──────────────┘       │ ✅ 개선 코드  │
                                                   └──────────────┘
\`\`\``,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 코드 리뷰어 앱 제작 요청서

## 프로젝트 개요
코드를 입력하면 AI 가 보안·성능·스타일을 분석하고, 심각도별 이슈 목록 + 개선 코드를 보여주는 웹 앱을 만들어주세요.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini 2.0 Flash)
- @monaco-editor/react (코드 입력 에디터)
- Lucide React (아이콘)
- localStorage (리뷰 히스토리)

## 환경 변수
\\\`\\\`\\\`
VITE_GEMINI_API_KEY=여기에_API_키
\\\`\\\`\\\`

## 페이지 구성 (SPA, 라우팅 없음)

### 1. 메인 레이아웃
- 상단: 앱 제목 "🔍 AI 코드 리뷰어" + 다크/라이트 토글
- 좌측 (50%): 코드 입력 영역
- 우측 (50%): 리뷰 결과 영역
- 하단: 리뷰 히스토리 패널 (접기/펼치기)

### 2. 코드 입력 영역 (좌측)

#### 2-1. Monaco Editor
- @monaco-editor/react 사용
- 높이: 화면의 60vh
- 기본 코드: 간단한 JavaScript 함수 예시 (버그 포함)
- 다크/라이트 테마 연동

#### 2-2. 언어 선택
- 드롭다운: JavaScript, TypeScript, Python, Java, Go, Rust, C++, SQL
- 선택하면 Monaco 의 language 모드 변경
- AI 에게도 선택된 언어 정보 전달

#### 2-3. 자동 언어 감지
- 코드가 변경되면 첫 5줄을 분석해서 언어를 추측
- import/require → JS/TS, def/class → Python, func/package → Go 등
- 감지 결과를 드롭다운에 반영 (사용자가 수동 변경 가능)

#### 2-4. 리뷰 시작 버튼
- "🔍 리뷰 시작" 버튼 (코드가 비어있으면 비활성화)
- 클릭 시 로딩 스피너 + "AI 가 코드를 분석 중..." 텍스트
- 단축키: Ctrl+Enter (Cmd+Enter)

### 3. 리뷰 결과 영역 (우측)

#### 3-1. 요약 대시보드
- 총점: 큰 원형 게이지 (0~100점, 색상: 0-49 빨강, 50-79 주황, 80-100 초록)
- 이슈 수: 🔴 Critical N개 / 🟡 Warning N개 / 🔵 Info N개
- 한 줄 요약 텍스트

#### 3-2. 이슈 목록
- 탭 필터: [전체] [🛡️ 보안] [⚡ 성능] [🎨 스타일] [🐛 버그]
- 각 이슈 카드:
  - 좌측: severity 배지 (CRITICAL 빨강 / WARNING 주황 / INFO 파랑)
  - 제목 + 카테고리 태그
  - 라인 번호 (클릭하면 Monaco 에서 해당 라인 하이라이트)
  - 펼치기: 상세 설명 + 수정 제안
- 이슈 카드 클릭 시 Monaco 에디터에서 해당 라인으로 스크롤 + 하이라이트

#### 3-3. 개선 코드 탭
- "✅ 개선된 코드" 탭 클릭 시:
  - 좌: 원본 코드, 우: 개선 코드 (side-by-side diff 뷰)
  - 변경된 라인 배경색 표시 (삭제=빨강, 추가=초록)
  - 각 변경 블록 옆에 변경 이유 툴팁
  - "📋 개선 코드 복사" 버튼

### 4. 리뷰 히스토리 (하단 패널)

#### 4-1. 히스토리 목록
- localStorage 에 최근 20개 리뷰 저장
- 각 항목: 날짜/시간, 언어, 점수, 이슈 수, 코드 첫 줄 미리보기
- 클릭하면 해당 리뷰 결과 복원 (코드 + 리뷰 결과 모두)
- 삭제 버튼 (개별 / 전체 삭제)

#### 4-2. 점수 트렌드
- 최근 리뷰 점수를 선 그래프로 표시 (간단한 SVG 또는 CSS)
- "내 코드 품질이 향상되고 있어요! 📈" 같은 격려 메시지

### 5. AI 분석 로직

#### 5-1. Gemini API 호출
- @google/genai SDK 사용
- 모델: gemini-2.0-flash
- system prompt 에 리뷰 규칙 + JSON 출력 형식 명시

#### 5-2. 분석 요청 형식
AI 에게 보내는 프롬프트:
\\\`\\\`\\\`
너는 시니어 코드 리뷰어야. 아래 {language} 코드를 분석해서 JSON 으로만 답해.

[분석 항목]
1. 보안 (security): SQL Injection, XSS, 하드코딩 비밀, eval, 인증/인가 누락
2. 성능 (performance): 불필요한 루프, 메모리 누수, N+1 쿼리, 비효율적 자료구조
3. 버그 (bug): 논리 오류, off-by-one, null 처리 누락, 타입 에러
4. 스타일 (style): 네이밍, 코드 중복, 가독성, 베스트 프랙티스

[응답 JSON 형식]
{
  "summary": "한 줄 요약",
  "score": 0~100,
  "issues": [
    {
      "severity": "critical | warning | info",
      "category": "security | performance | bug | style",
      "line": 라인번호,
      "endLine": 끝라인번호 (선택),
      "title": "이슈 제목",
      "description": "상세 설명",
      "suggestion": "수정 제안 (코드 포함)"
    }
  ],
  "improvedCode": "전체 개선 코드",
  "changes": [
    {
      "before": "변경 전",
      "after": "변경 후",
      "reason": "변경 이유"
    }
  ]
}
\\\`\\\`\\\`

#### 5-3. 에러 처리
- API 키 없음 → "⚠️ .env 파일에 VITE_GEMINI_API_KEY 를 설정해주세요" 안내
- 네트워크 에러 → 재시도 버튼 + "인터넷 연결을 확인해주세요"
- JSON 파싱 실패 → 1회 자동 재시도 + 실패 시 "AI 응답 형식 오류" 표시
- 빈 코드 제출 → 버튼 비활성화 + 툴팁 "코드를 입력해주세요"

### 6. GitHub 연동 가이드 (선택 기능)

#### 6-1. PR Diff 가져오기 (가이드 안내)
- 앱 하단에 "📘 GitHub PR 연동 가이드" 섹션 추가
- GitHub Personal Access Token 으로 PR diff 를 가져오는 방법 안내:
  - API 엔드포인트: GET /repos/{owner}/{repo}/pulls/{pull_number}/files
  - 헤더: Authorization: Bearer {token}
  - 응답에서 patch 필드 추출 → AI 에게 전달
- 코드 예시 포함 (복사 가능)

#### 6-2. 직접 구현 (선택)
- "GitHub PR URL 입력" 필드 (선택적 표시)
- Token 입력 → localStorage 에 암호화 저장
- PR URL 입력 시 diff 자동 가져와서 리뷰

### 7. UI/UX 요구사항

#### 7-1. 다크/라이트 모드
- Tailwind dark: 클래스 기반
- 토글 버튼: 🌙/☀️
- localStorage 에 설정 저장
- Monaco 에디터 테마도 연동 (vs-dark / light)

#### 7-2. 반응형
- 데스크톱: 좌우 분할 (50:50)
- 태블릿: 좌우 분할 (40:60)
- 모바일: 상하 스택 (코드 입력 → 리뷰 결과)

#### 7-3. 애니메이션
- 리뷰 결과 로딩: 스켈레톤 UI
- 점수 게이지: 0 에서 목표 점수까지 애니메이션
- 이슈 카드: 순차적 fade-in
- severity 배지: 미세한 pulse 효과 (critical 만)

#### 7-4. 접근성
- 모든 interactive 요소에 aria-label
- 키보드 네비게이션 (Tab, Enter, Escape)
- 색상만으로 구분하지 않기 (아이콘 + 텍스트 병용)
- 스크린 리더 지원: 이슈 목록 aria-live

### 8. 컴포넌트 구조 (참고)
\\\`\\\`\\\`
src/
├── App.tsx                  // 메인 레이아웃
├── components/
│   ├── CodeEditor.tsx       // Monaco 에디터 래퍼
│   ├── LanguageSelector.tsx // 언어 선택 드롭다운
│   ├── ReviewButton.tsx     // 리뷰 시작 버튼
│   ├── ReviewDashboard.tsx  // 점수 게이지 + 이슈 요약
│   ├── IssueList.tsx        // 이슈 목록 + 필터 탭
│   ├── IssueCard.tsx        // 개별 이슈 카드
│   ├── DiffView.tsx         // side-by-side 코드 비교
│   ├── ReviewHistory.tsx    // 히스토리 패널
│   ├── ScoreTrend.tsx       // 점수 트렌드 그래프
│   ├── ThemeToggle.tsx      // 다크/라이트 토글
│   └── GitHubGuide.tsx      // GitHub 연동 가이드
├── hooks/
│   ├── useReview.ts         // AI 리뷰 API 호출 로직
│   ├── useHistory.ts        // localStorage 히스토리 관리
│   └── useTheme.ts          // 테마 상태 관리
├── lib/
│   └── gemini.ts            // Gemini SDK 초기화 + 프롬프트
└── types/
    └── review.ts            // ReviewResult, Issue 등 타입 정의
\\\`\\\`\\\`
\`\`\``,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `### 🏆 도전 과제 — 더 강력한 코드 리뷰어로!

기본 앱이 완성됐다면 아래 도전 과제를 추가해보세요:

| 난이도 | 도전 | 힌트 |
|---|---|---|
| ⭐ | **리뷰 규칙 커스터마이즈** — 사용자가 "보안만 리뷰" 같은 규칙을 설정 | system prompt 를 동적으로 구성 |
| ⭐⭐ | **자동 수정 적용** — "이슈 수정" 버튼 클릭하면 Monaco 에 개선 코드 반영 | Monaco setValue() 호출 |
| ⭐⭐ | **파일 업로드 지원** — .js/.ts/.py 파일을 드래그 앤 드롭으로 리뷰 | FileReader API + drag & drop |
| ⭐⭐⭐ | **GitHub PR 자동 리뷰** — PR URL 입력하면 diff 가져와서 리뷰 + 코멘트 작성 | GitHub REST API + Octokit |
| ⭐⭐⭐ | **리뷰 보고서 PDF 내보내기** — 리뷰 결과를 PDF 로 다운로드 | html2canvas + jsPDF |

> 💡 **GitHub PR 연동** 은 실무에서 가장 활용도가 높아요. ==GitHub OAuth== 로 인증하면 Private 레포도 접근 가능합니다.`,
    },

    // ─── 완료 + 다음 워크샵 예고 ───
    {
      type: "markdown",
      source: `## 🎉 W19 완료 — AI 코드 리뷰어 제작 완료!

### 배운 것 정리

| 개념 | 설명 |
|---|---|
| **구조화 JSON 출력** | AI 에게 JSON 형식을 강제하면 프로그래밍으로 파싱 가능 |
| **카테고리별 분석** | 보안·성능·스타일을 분리하면 더 정밀한 리뷰 가능 |
| **==diff== 뷰** | before/after 비교로 변경 사항을 직관적으로 표시 |
| **==정적 분석== + AI** | ESLint 같은 도구가 못 잡는 논리적 버그를 AI 가 탐지 |
| **Monaco Editor** | VS Code 와 동일한 웹 코드 에디터 통합 |

### 실무 활용 시나리오

1. **PR 리뷰 자동화** — GitHub Action 으로 PR 올라오면 자동 리뷰 코멘트
2. **코드 학습 도구** — 초보 개발자가 코드를 넣으면 개선 가이드 제공
3. **보안 감사** — 배포 전 보안 취약점 자동 스캔
4. **코딩 테스트 채점** — 지원자 코드를 AI 가 품질 분석

### 다음 워크샵 예고
**W20: AI 이력서 최적화** — 이력서 PDF 를 업로드하면 AI 가 직무별 맞춤 피드백을 제공하고, ATS(==지원자 추적 시스템==) 통과율을 높이는 최적화 제안을 해주는 도구를 만듭니다.`,
    },
  ],

  quiz: {
    title: "W19 — AI 코드 리뷰어 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "AI 코드 리뷰에서 severity 를 'critical / warning / info' 3단계로 나누는 이유는?",
        options: [
          "AI 모델이 3단계만 지원해서",
          "심각한 이슈부터 우선 수정할 수 있도록 우선순위를 제공하기 위해",
          "JSON 파싱이 3단계일 때만 가능해서",
          "GitHub 이 3단계 severity 만 지원해서",
        ],
        correctIndex: 1,
        explanation:
          "severity 3단계는 '심각한 것부터 고치기' 전략을 가능하게 합니다. critical(즉시 수정)은 런타임 에러나 보안 취약점, warning(곧 수정)은 잠재적 버그, info(나중에)는 스타일 개선 사항이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "코드 리뷰를 보안·성능·스타일 카테고리로 분리해서 AI 에게 요청하면 좋은 이유는?",
        options: [
          "API 호출 비용이 줄어들어서",
          "각 카테고리에 집중된 더 정밀한 분석을 받을 수 있어서",
          "한 번에 보내면 AI 가 거부해서",
          "카테고리가 없으면 JSON 파싱이 불가능해서",
        ],
        correctIndex: 1,
        explanation:
          "하나의 프롬프트에 '모든 것을 찾아줘' 라고 하면 AI 가 일부를 놓칠 수 있어요. 보안 전문가, 성능 전문가, 스타일 전문가 역할을 각각 부여하면 더 깊이 있는 분석을 받을 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question:
          "AI 가 제안한 개선 코드를 diff(변경 전/후 비교) 형태로 보여주면 좋은 이유는?",
        options: [
          "diff 형식이 AI 토큰을 절약해서",
          "GitHub 이 diff 만 지원해서",
          "무엇이 왜 바뀌었는지 한눈에 파악할 수 있어서",
          "diff 없이는 코드를 복사할 수 없어서",
        ],
        correctIndex: 2,
        explanation:
          "diff 뷰는 변경 전/후를 나란히 보여줘서 '무엇이 바뀌었는지' + '왜 바꿨는지' 를 직관적으로 이해할 수 있게 해줍니다. GitHub PR 리뷰에서도 이 형식을 사용하는 이유가 바로 이것이에요.",
      },
    ],
  } satisfies Quiz,
};
