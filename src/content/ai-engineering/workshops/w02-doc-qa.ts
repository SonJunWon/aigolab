import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W02 — 문서 Q&A 봇 만들기.
 *
 * Part A: 플랫폼에서 RAG 파이프라인 만들기 (LLM 셀)
 * Part B: MD 레시피로 실제 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW02: Lesson = {
  id: "ai-eng-w02-doc-qa",
  language: "ai-engineering",
  track: "beginner",
  order: 102,
  title: "W02: 문서 Q&A 봇 만들기",
  subtitle: "내 문서를 올리면 질문에 답하는 RAG 챗봇 완성",
  estimatedMinutes: 120,
  cells: [
    {
      type: "markdown",
      source: `# 📄 문서 Q&A 봇 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**내 문서를 업로드하면 내용을 분석해서 질문에 답하는 ==RAG== Q&A 봇** — 파일을 올리고 질문하면 AI 가 문서에서 답을 찾아 출처와 함께 알려줍니다.

### 완성 모습
\`\`\`
┌───────────────────────────────────┐
│  📄 문서 Q&A 봇                    │
├───────────────────────────────────┤
│                                   │
│  ┌─ 📁 파일 업로드 ─────────────┐ │
│  │                               │ │
│  │   파일을 여기에 끌어놓거나     │ │
│  │   클릭해서 선택하세요          │ │
│  │   (.txt, .md 지원)            │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                   │
│  ✅ recipe.txt (2,340자, 5청크)    │
│                                   │
│  👤 이 레시피에서 소금은 얼마나    │
│     넣어야 해?                    │
│                                   │
│  🤖 레시피에 따르면 소금은 1큰술   │
│     넣으면 됩니다.                │
│     📌 출처: 청크 3 (line 45-60)  │
│                                   │
├───────────────────────────────────┤
│ [질문을 입력하세요...]    [전송]   │
└───────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | RAG 파이프라인 만들기 | 40분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 웹앱 완성 | 80분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)`,
    },

    // ─── Part A: RAG 파이프라인 ───
    {
      type: "markdown",
      source: `## Part A: RAG 파이프라인 만들기 (40분)

==RAG== (Retrieval-Augmented Generation) 의 핵심은 3단계:
1. **==청킹== (Chunking)** — 긴 문서를 작은 조각으로 나누기
2. **검색 (Retrieval)** — 질문과 관련된 조각 찾기
3. **생성 (Generation)** — 찾은 조각을 AI 에게 주고 답변 만들기

이 3단계를 LLM 셀에서 하나씩 만들고 검증합니다.`,
    },

    {
      type: "markdown",
      source: `### A-1. 텍스트 ==청킹== 기초

긴 문서를 통째로 AI 에게 주면 ==토큰== 낭비 + 정확도 하락.
작은 조각(청크)으로 나누고, 필요한 것만 전달하는 게 핵심이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 텍스트를 청크로 나누기 (순수 TypeScript — LLM 호출 없음)
function chunkText(text: string, chunkSize: number = 200, overlap: number = 50): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap; // 겹치는 부분으로 문맥 유지
  }

  return chunks;
}

// 샘플 문서 — 한국 요리 레시피
const document = \`
김치찌개 레시피

재료: 김치 300g, 돼지고기 200g, 두부 1모, 대파 1대, 고춧가루 1큰술, 참기름 1큰술, 물 600ml

만드는 법:
1단계: 냄비에 참기름을 두르고 돼지고기를 중불에서 3분간 볶는다.
2단계: 김치를 넣고 함께 5분간 볶아 김치가 투명해질 때까지 익힌다.
3단계: 물 600ml를 붓고 강불로 끓인다. 끓어오르면 중불로 줄인다.
4단계: 고춧가루 1큰술을 넣고 15분간 더 끓인다.
5단계: 두부를 큼직하게 썰어 넣고 5분간 더 끓인다.
6단계: 대파를 송송 썰어 올리면 완성.

팁: 김치가 잘 익은 묵은지를 쓰면 더 깊은 맛이 납니다.
간이 부족하면 국간장 1큰술을 추가하세요.
참기름 대신 들기름을 쓰면 고소한 풍미가 더해집니다.
\`.trim();

const chunks = chunkText(document, 200, 50);

console.log(\`📄 원본: \${document.length}자\`);
console.log(\`📦 청크 수: \${chunks.length}개\\n\`);

chunks.forEach((chunk, i) => {
  console.log(\`── 청크 \${i + 1} (\${chunk.length}자) ──\`);
  console.log(chunk.trim());
  console.log();
});`,
      hints: [
        "chunkSize=200 은 한 조각의 최대 글자수, overlap=50 은 조각끼리 겹치는 부분.",
        "겹침(overlap) 이 있어야 '3단계에서 물을 넣고' 같은 문맥이 끊기지 않아요.",
        "실무에서는 문장 단위로 자르거나, 문단(\\n\\n) 기준으로 나누기도 해요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 청크에서 관련 내용 찾기

이제 질문이 들어왔을 때, 어떤 청크가 가장 관련 있는지 AI 에게 물어봅니다.
이게 ==RAG== 의 **R (Retrieval)** 단계예요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 청크 준비 (A-1 에서 만든 것과 동일)
function chunkText(text: string, size = 200, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, Math.min(start + size, text.length)));
    start += size - overlap;
  }
  return chunks;
}

const document = \`김치찌개 레시피
재료: 김치 300g, 돼지고기 200g, 두부 1모, 대파 1대, 고춧가루 1큰술, 참기름 1큰술, 물 600ml
만드는 법:
1단계: 냄비에 참기름을 두르고 돼지고기를 중불에서 3분간 볶는다.
2단계: 김치를 넣고 함께 5분간 볶아 김치가 투명해질 때까지 익힌다.
3단계: 물 600ml를 붓고 강불로 끓인다. 끓어오르면 중불로 줄인다.
4단계: 고춧가루 1큰술을 넣고 15분간 더 끓인다.
5단계: 두부를 큼직하게 썰어 넣고 5분간 더 끓인다.
6단계: 대파를 송송 썰어 올리면 완성.
팁: 김치가 잘 익은 묵은지를 쓰면 더 깊은 맛이 납니다. 간이 부족하면 국간장 1큰술을 추가하세요.\`.trim();

const chunks = chunkText(document);
const question = "두부는 언제 넣어야 해?";

// AI 에게 관련 청크 찾기 요청
const searchPrompt = chunks.map((c, i) => \`[청크 \${i + 1}] \${c.trim()}\`).join("\\n\\n");

const res = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: "너는 문서 검색 도우미야. 사용자의 질문과 가장 관련 있는 청크 번호를 골라줘. 형식: 관련 청크: [번호], 이유: [한 줄 설명]",
    },
    {
      role: "user",
      content: \`질문: \${question}\\n\\n문서 청크:\\n\${searchPrompt}\`,
    },
  ],
});

console.log("❓ 질문:", question);
console.log("🔍 AI 검색 결과:", res.text);`,
      hints: [
        "진짜 ==벡터 검색== 대신 AI 에게 직접 '어떤 청크가 관련 있어?' 라고 묻는 간단한 방법.",
        "실무에서는 ==임베딩== 벡터로 유사도를 계산하지만, 소규모 문서에는 이 방법도 잘 동작해요.",
        "청크가 많아지면 토큰 비용이 늘어나요 — 그래서 벡터 DB 를 쓰는 거예요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. ==RAG== 파이프라인 — 청크 → 검색 → 답변

이제 전체 파이프라인을 조립합니다:
문서 → 청킹 → 질문과 관련 청크 찾기 → AI 에게 컨텍스트와 함께 질문 → 답변!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 완성된 RAG 파이프라인
function chunkText(text: string, size = 200, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, Math.min(start + size, text.length)));
    start += size - overlap;
  }
  return chunks;
}

const document = \`김치찌개 레시피
재료: 김치 300g, 돼지고기 200g, 두부 1모, 대파 1대, 고춧가루 1큰술, 참기름 1큰술, 물 600ml
만드는 법:
1단계: 냄비에 참기름을 두르고 돼지고기를 중불에서 3분간 볶는다.
2단계: 김치를 넣고 함께 5분간 볶아 김치가 투명해질 때까지 익힌다.
3단계: 물 600ml를 붓고 강불로 끓인다. 끓어오르면 중불로 줄인다.
4단계: 고춧가루 1큰술을 넣고 15분간 더 끓인다.
5단계: 두부를 큼직하게 썰어 넣고 5분간 더 끓인다.
6단계: 대파를 송송 썰어 올리면 완성.
팁: 김치가 잘 익은 묵은지를 쓰면 더 깊은 맛이 납니다. 간이 부족하면 국간장 1큰술을 추가하세요. 참기름 대신 들기름을 쓰면 고소한 풍미가 더해집니다.\`.trim();

// 1단계: 청킹
const chunks = chunkText(document);
console.log(\`📦 \${chunks.length}개 청크로 분할 완료\\n\`);

// 2단계: 질문
const question = "참기름 대신 뭘 쓸 수 있어?";

// 3단계: 관련 청크와 함께 답변 요청 (간단 RAG)
const context = chunks.map((c, i) => \`[청크 \${i + 1}] \${c.trim()}\`).join("\\n\\n");

const res = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 문서 기반 Q&A 봇이야. 반드시 아래 규칙을 따라:
1. 제공된 문서 청크에서만 답변해. 문서에 없는 내용은 "문서에 해당 정보가 없습니다" 라고 해.
2. 답변 끝에 반드시 출처를 표시해: "📌 출처: 청크 N"
3. 한국어로 친절하게 답해.\`,
    },
    {
      role: "user",
      content: \`문서 청크:\\n\${context}\\n\\n질문: \${question}\`,
    },
  ],
});

console.log("❓ 질문:", question);
console.log("🤖 답변:", res.text);`,
      hints: [
        "이게 RAG 의 전체 흐름! 청킹 → 컨텍스트 조립 → AI 에게 질문 + 컨텍스트 전달.",
        "system prompt 에 '문서에 없으면 모른다고 해' 를 넣어야 ==할루시네이션== 을 줄일 수 있어요.",
        "출처 표시(📌 청크 N) 를 강제하면 사용자가 답변을 검증할 수 있어요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-4. 출처 표시 강화 — 신뢰할 수 있는 답변

==할루시네이션== (AI 가 지어내는 것) 을 막으려면, **출처 인용** 을 시스템적으로 강제해야 해요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 출처 표시를 강화한 RAG
function chunkText(text: string, size = 200, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, Math.min(start + size, text.length)));
    start += size - overlap;
  }
  return chunks;
}

const document = \`김치찌개 레시피
재료: 김치 300g, 돼지고기 200g, 두부 1모, 대파 1대, 고춧가루 1큰술, 참기름 1큰술, 물 600ml
만드는 법:
1단계: 냄비에 참기름을 두르고 돼지고기를 중불에서 3분간 볶는다.
2단계: 김치를 넣고 함께 5분간 볶아 김치가 투명해질 때까지 익힌다.
3단계: 물 600ml를 붓고 강불로 끓인다. 끓어오르면 중불로 줄인다.
4단계: 고춧가루 1큰술을 넣고 15분간 더 끓인다.
5단계: 두부를 큼직하게 썰어 넣고 5분간 더 끓인다.
6단계: 대파를 송송 썰어 올리면 완성.
팁: 김치가 잘 익은 묵은지를 쓰면 더 깊은 맛이 납니다. 간이 부족하면 국간장 1큰술을 추가하세요.\`.trim();

const chunks = chunkText(document);

// 여러 질문으로 테스트
const questions = [
  "돼지고기는 몇 그램 필요해?",
  "전자레인지 사용법은?",       // 문서에 없는 질문!
  "끓이는 총 시간은 얼마야?",
];

for (const q of questions) {
  const context = chunks.map((c, i) => \`[청크 \${i + 1}] \${c.trim()}\`).join("\\n\\n");

  const res = await chat({
    provider: "gemini",
    messages: [
      {
        role: "system",
        content: \`너는 문서 기반 Q&A 봇이야. 답변 형식을 반드시 지켜:

답변: (1-2문장으로 간결하게)
📌 출처: 청크 N — "원문 인용 (10자 이내)"

규칙:
- 문서 청크에 없는 내용이면: "❌ 이 문서에 해당 정보가 없습니다."
- 여러 청크에서 정보를 모으면 청크 번호를 모두 표시
- 한국어로 답해\`,
      },
      {
        role: "user",
        content: \`문서 청크:\\n\${context}\\n\\n질문: \${q}\`,
      },
    ],
  });

  console.log(\`❓ \${q}\`);
  console.log(\`🤖 \${res.text}\`);
  console.log();
}`,
      hints: [
        "두 번째 질문(전자레인지)은 문서에 없어요 — AI 가 '없다' 고 답하는지 확인!",
        "출처 형식을 system prompt 에서 강제하면 AI 가 일관되게 인용해요.",
        "이 패턴이 Part B 웹앱의 핵심 로직이 됩니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

RAG 파이프라인의 핵심을 검증했어요:
- ✅ **==청킹==** — 긴 텍스트를 작은 조각으로 분할
- ✅ **검색** — 질문과 관련된 청크 찾기
- ✅ **생성** — 컨텍스트 + 질문으로 답변 생성
- ✅ **출처 표시** — ==할루시네이션== 방지를 위한 인용

이제 이걸 **실제 웹앱** 으로 만듭니다.

---

## Part B: MD 레시피로 웹앱 완성 (80분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [완성된 문서 Q&A 봇]
\`\`\`

아래의 **MD 레시피** 를 복사해서 AI 코딩 도구에 전달하면 됩니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# 문서 Q&A 봇 웹앱 제작 요청서

## 프로젝트 개요
브라우저에서 동작하는 문서 Q&A 봇을 만들어주세요.
사용자가 텍스트 파일을 업로드하면 내용을 분석해서 질문에 답하는 RAG 챗봇입니다.
Google Gemini API 를 사용합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크 모드)
- @google/genai (Gemini SDK)

## 기능 요구사항

### 1. 파일 업로드 UI
- 드래그 앤 드롭 영역 (점선 테두리, 호버 시 색상 변화)
- 클릭으로도 파일 선택 가능
- 지원 형식: .txt, .md (텍스트 파일)
- 업로드 후 파일 정보 표시: 파일명, 글자 수, 청크 수
- 파일 제거 버튼 (X)
- 파일 미업로드 시 질문 입력 비활성화

### 2. 텍스트 청킹
- 업로드된 텍스트를 ~500자 청크로 분할
- 청크 간 100자 겹침 (overlap) 으로 문맥 유지
- 청크 수를 파일 정보에 표시
- 사이드 패널에서 청크 목록 확인 가능 (토글)

### 3. 질문 입력 & 답변 표시
- 채팅형 Q&A 인터페이스 (W01 챗봇과 유사)
- 사용자 질문 = 오른쪽 파란 말풍선
- AI 답변 = 왼쪽 회색 말풍선 + 하단에 📌 출처 표시
- 출처 클릭 시 해당 청크 내용을 하이라이트로 표시
- AI 응답 대기 중 타이핑 애니메이션

### 4. RAG 파이프라인
- 질문이 들어오면:
  1. 모든 청크를 번호와 함께 컨텍스트로 조립
  2. 시스템 프롬프트 + 컨텍스트 + 질문을 Gemini 에 전달
  3. 답변과 출처(청크 번호) 를 파싱해서 표시
- 시스템 프롬프트: "너는 문서 기반 Q&A 봇이야. 제공된 문서 청크에서만 답변해. 문서에 없는 내용은 '이 문서에 해당 정보가 없습니다' 라고 해. 답변 끝에 반드시 '📌 출처: 청크 N' 형식으로 출처를 표시해. 한국어로 친절하게 답해."
- Gemini 2.5 Flash 모델 사용
- API 호출 실패 시 에러 메시지: "⚠️ 응답을 받지 못했어요. 다시 시도해주세요."

### 5. API 키 관리
- 첫 실행 시 세련된 API 키 입력 모달:
  - "🔑 Gemini API 키를 입력하세요" 제목
  - 입력란 (type=password, 토글로 보이기/숨기기)
  - "https://aistudio.google.com/apikey 에서 무료 발급" 안내 링크
  - [저장] 버튼
- localStorage 에 키 저장
- 상단 ⚙️ 버튼 클릭 → 키 변경 또는 삭제 가능

### 6. 디자인
- 다크 모드 기본 (배경: #0f172a, 카드: #1e293b, 텍스트: #e2e8f0)
- 라이트 모드 지원 (배경: #f8fafc, 카드: white, 텍스트: #1e293b)
- 반응형 레이아웃:
  - 모바일: 세로 스택 (업로드 → Q&A)
  - 데스크탑: 좌측 파일 업로드 + 청크 목록 (300px), 우측 Q&A 채팅
- 출처 표시 영역은 연한 노란색(#fef3c7) 배경으로 구분
- 부드러운 애니메이션 (fade-in, slide-up)
- 다크/라이트 모드 토글 (상단 🌙/☀️)

## 환경 변수
GEMINI_API_KEY 는 런타임에 사용자가 입력 (하드코딩 금지)

## 실행 방법
npm install → npm run dev → localhost:5173 에서 확인

## 주의사항
- API 키를 소스 코드에 절대 하드코딩하지 마세요
- 모든 텍스트는 한국어로
- console.error 로 에러 로깅
- TypeScript strict 모드
\`\`\`

---

### 사용 방법

**🅰️ Claude Code 사용자:**
\`\`\`bash
mkdir my-doc-qa && cd my-doc-qa
claude
# 위 마크다운 전체를 붙여넣기
# Claude 가 파일 생성 제안 → Accept
# claude 에서 나온 후:
npm install
npm run dev
\`\`\`

**🅱️ Cursor 사용자:**
1. 새 폴더 열기 → 터미널에서 \`npm init -y\`
2. **Cmd+I** → 위 마크다운 붙여넣기
3. Cursor 가 생성한 파일들 승인
4. 터미널: \`npm install && npm run dev\`

### 💡 커스텀 팁
- 청크 크기를 바꾸면 검색 정밀도가 달라져요 (작을수록 정밀, 클수록 넓은 맥락)
- "PDF 지원 추가해줘" 요청하면 pdf.js 로 PDF 텍스트 추출 가능
- "대화 히스토리 유지해줘" 추가하면 이전 Q&A 맥락도 기억
- "청크 시각화 해줘" 요청하면 어떤 부분에서 답을 찾았는지 보여줌

> 🚨 **안 되면**: AI 에게 에러 메시지를 그대로 붙여넣으세요.
> "이 에러가 나와요: [에러 내용]" → AI 가 수정해줍니다. 이게 바이브 코딩!`,
    },

    {
      type: "markdown",
      source: `## 🎯 도전 과제

기본 Q&A 봇이 완성되면 MD 레시피에 아래를 추가해서 AI 에게 요청해보세요:

| 난이도 | 추가 기능 |
|---|---|
| ⭐ | 여러 파일 동시 업로드 |
| ⭐ | Q&A 히스토리 초기화 버튼 |
| ⭐⭐ | PDF 파일 지원 (pdf.js) |
| ⭐⭐ | 청크별 관련도 점수 시각화 (프로그레스 바) |
| ⭐⭐⭐ | 답변 내 출처 클릭 → 원문 하이라이트 스크롤 |
| ⭐⭐⭐ | 임베딩 벡터 기반 유사도 검색 (코사인 유사도) |

추가할 때마다 AI 에게:
> "기존 코드에 [기능] 을 추가해줘"

라고 하면 됩니다. **이게 바이브 코딩의 핵심 — 대화하듯 앱을 키워가기.**

## ✅ W02 완료!

- ✅ Part A: RAG 파이프라인 (청킹 + 검색 + 생성 + 출처)
- ✅ Part B: MD 레시피 → 실제 문서 Q&A 봇 완성
- ✅ 커스텀: AI 에게 기능 추가 요청

### 다음 워크샵 예고
**W03: AI 실시간 번역기** — 텍스트를 입력하면 여러 언어로 동시에 번역하는 앱.
LLM 의 다국어 능력을 활용한 실시간 번역 파이프라인을 만듭니다.`,
    },
  ],

  quiz: {
    title: "W02 — 문서 Q&A 봇 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "RAG 에서 긴 문서를 작은 조각으로 나누는 과정을 뭐라고 하나요?",
        options: [
          "프롬프팅 (Prompting)",
          "청킹 (Chunking)",
          "파인튜닝 (Fine-tuning)",
          "임베딩 (Embedding)",
        ],
        correctIndex: 1,
        explanation:
          "청킹(Chunking) 은 긴 텍스트를 작은 조각으로 나누는 과정이에요. RAG 의 첫 번째 단계입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "문서 Q&A 봇에서 AI 가 지어낸 답변(할루시네이션)을 줄이려면?",
        options: [
          "모델을 더 큰 것으로 바꾼다",
          "temperature 를 높인다",
          "시스템 프롬프트에 '문서에 없으면 모른다고 해' + 출처 표시를 강제한다",
          "질문을 영어로 번역해서 보낸다",
        ],
        correctIndex: 2,
        explanation:
          "시스템 프롬프트로 '문서에 없는 건 답하지 마' 규칙 + 출처 인용을 강제하면 할루시네이션을 크게 줄일 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "청크 간 겹침(overlap) 을 두는 이유는?",
        options: [
          "파일 크기를 늘리기 위해",
          "API 비용을 줄이기 위해",
          "청크 경계에서 문맥이 끊기지 않도록 하기 위해",
          "AI 가 더 빨리 답하게 하기 위해",
        ],
        correctIndex: 2,
        explanation:
          "겹침이 없으면 '3단계에서 물을 넣고' 같은 문장이 두 청크로 잘려 의미를 잃어요. 겹침으로 문맥을 보존합니다.",
      },
    ],
  } satisfies Quiz,
};
