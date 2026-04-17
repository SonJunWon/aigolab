import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W34 — AI 계약서/문서 분석기.
 *
 * Part A: PDF 텍스트 추출·핵심 조항 분석·위험 평가를 LLM 으로 체험 (LLM 셀)
 * Part B: MD 레시피로 React+pdfjs-dist 기반 계약서 분석 대시보드 완성 (Claude Code / Cursor)
 */
export const workshopW34: Lesson = {
  id: "ai-eng-w34-contract-analyzer",
  language: "ai-engineering",
  track: "beginner",
  order: 134,
  title: "W34: AI 계약서/문서 분석기",
  subtitle: "계약서 올리면 핵심 조항 추출 + 위험 요소 자동 분석",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 📄 AI 계약서/문서 분석기 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**PDF 계약서를 업로드하면 AI 가 ==핵심 조항==을 추출하고, ==위험 요소==를 자동으로 분석하는 문서 분석기** — 당사자·날짜·의무·위약금을 한눈에 보고, 위험 수준별 색상 ==배지==로 즉시 파악합니다. 두 계약서를 나란히 비교하고, 수정 제안까지 받을 수 있어요.

### 완성 모습
\`\`\`
┌─ AI Contract Analyzer ──────────────────────────────────────┐
│  📄 계약서 분석기    [📂 열기]  [📥 내보내기]  🌙 다크       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────── 📤 PDF 업로드 ────────────┐                   │
│  │                                       │                   │
│  │   📎 계약서를 드래그하거나 클릭해서    │                   │
│  │      업로드하세요 (PDF)               │                   │
│  │                                       │                   │
│  │   [📄 계약서 A]     [📄 계약서 B]     │                   │
│  │    ✅ 업로드됨        선택 안 함       │                   │
│  └───────────────────────────────────────┘                   │
│                                                              │
│  📊 분석 결과 ─────────────────────────────                   │
│                                                              │
│  ┌─ 📋 기본 정보 ──────────────────────────────┐             │
│  │  📌 계약 유형: 소프트웨어 개발 용역 계약     │             │
│  │  👤 당사자: (주)테크코 ↔ 김개발              │             │
│  │  📅 계약일: 2026-03-01 ~ 2026-08-31         │             │
│  │  💰 계약금: 50,000,000원                     │             │
│  └──────────────────────────────────────────────┘             │
│                                                              │
│  ┌─ ⚠️ 위험 분석 ──────────────────────────────┐             │
│  │  🔴 HIGH   제5조 위약금 조항 — 일방적 부담   │             │
│  │  🟡 MED    제8조 지재권 — 귀속 범위 모호     │             │
│  │  🟢 LOW    제3조 납기 — 불가항력 조항 없음   │             │
│  └──────────────────────────────────────────────┘             │
│                                                              │
│  ┌─ 🔍 조항별 요약 ────────────────────────────┐             │
│  │  제1조 목적 ························ ✅ 정상  │             │
│  │  제2조 범위 ························ ✅ 정상  │             │
│  │  제3조 납기 ························ 🟢 주의  │             │
│  │  제5조 위약금 ······················ 🔴 위험  │             │
│  │  제8조 지재권 ······················ 🟡 경고  │             │
│  └──────────────────────────────────────────────┘             │
│                                                              │
│  [🔀 비교 모드]  [✏️ 수정 제안]  [📥 리포트 PDF]             │
├──────────────────────────────────────────────────────────────┤
│  📁 분석 히스토리: [용역계약 03/01] [임대차 02/15] [+새 분석] │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 핵심 조항 추출 + 위험 평가 + 수정 제안 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 React PDF 분석 대시보드 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - PDF 파일 다루기 — ==pdfjs-dist== 라이브러리를 이번 워크샵에서 자세히 배워요!`,
    },

    // ─── Part A: 계약서 AI 분석 엔진 ───
    {
      type: "markdown",
      source: `## Part A: 계약서 AI 분석 엔진 만들기 (50분)

계약서 분석의 핵심은 **비정형 PDF 텍스트에서 구조화된 정보를 추출**하고, 법률적 위험 요소를 AI 가 자동으로 평가하는 것이에요.

핵심 개념 3가지:
1. **==핵심 조항== 추출** — 계약서 텍스트에서 당사자·날짜·금액·의무·위약금 등 주요 항목을 JSON 으로 추출
2. **==위험 평가==** — 각 조항의 법률적 위험도를 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW 로 분류
3. **수정 제안** — 위험 조항에 대해 구체적인 문구 수정안을 생성

> 📌 **왜 AI 가 계약서를 분석할 수 있을까?** — LLM 은 방대한 법률 문서로 학습했기 때문에 계약서의 패턴 (조항 구조, 위험 문구, 일반적 관행) 을 잘 이해합니다. 물론 최종 판단은 전문가가 해야 하지만, 1차 검토 도구로는 매우 강력해요!`,
    },

    {
      type: "markdown",
      source: `### A-1. 핵심 조항 추출기 — 계약서 텍스트 → 구조화된 JSON

계약서 텍스트를 입력하면 AI 가 당사자, 계약 기간, 금액, 의무 사항, 위약금 조항 등을 구조화된 JSON 으로 추출합니다. ==비정형 데이터==를 ==정형 데이터==로 바꾸는 ==정보 추출== 작업이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 핵심 조항 추출기 — 계약서 텍스트 → 구조화 JSON
const contractText = \`
소프트웨어 개발 용역 계약서

제1조 (목적)
본 계약은 "갑" (주)테크코와 "을" 김개발 간의 소프트웨어 개발 용역에 관한 사항을 정한다.

제2조 (용역 범위)
을은 갑의 요청에 따라 웹 애플리케이션 개발 일체를 수행한다.
구체적 범위: 프론트엔드, 백엔드, DB 설계, 배포 환경 구축.

제3조 (계약 기간)
2026년 3월 1일부터 2026년 8월 31일까지 6개월간으로 한다.

제4조 (계약 금액)
총 계약 금액은 금 오천만원(\\50,000,000)으로 하며, 착수금 30%, 중도금 40%, 잔금 30%로 지급한다.

제5조 (위약금)
을이 납기를 지키지 못할 경우, 지연일수 1일당 계약금액의 0.5%를 위약금으로 갑에게 지급한다.
단, 갑의 사유로 인한 지연은 별도 협의한다.

제6조 (하자 보수)
을은 최종 납품일로부터 12개월간 무상 하자보수 의무를 진다.

제7조 (비밀유지)
양 당사자는 계약 이행 과정에서 알게 된 상대방의 영업비밀을 계약 종료 후 3년간 제3자에게 누설하지 아니한다.

제8조 (지적재산권)
본 용역 결과물의 지적재산권은 갑에게 귀속된다.
\`;

const systemPrompt = \`너는 계약서 분석 전문 AI 야.
주어진 계약서 텍스트에서 핵심 조항을 구조화된 JSON 으로 추출해.

[추출 항목]
- contractType: 계약 유형 (용역, 임대차, 매매, 라이선스 등)
- parties: { party1: { name, role }, party2: { name, role } }
- period: { start, end, duration }
- amount: { total, currency, paymentSchedule: [{ stage, percentage, amount }] }
- obligations: [{ article, party, description }]
- penalties: [{ article, condition, amount, formula }]
- confidentiality: { duration, scope }
- intellectualProperty: { owner, scope }
- warranty: { duration, scope }

[규칙]
- 한국어로 작성
- 금액은 숫자로 변환
- 날짜는 YYYY-MM-DD 형식
- 불명확한 항목은 "명시되지 않음" 표기
- JSON 만 반환 (마크다운 코드 블록 없이)\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 계약서의 핵심 조항을 추출해줘:\\n\\n\${contractText}\` },
  ],
});

try {
  const clauses = JSON.parse(res.text);
  console.log("📄 핵심 조항 추출 결과");
  console.log("═".repeat(50));
  console.log("📌 계약 유형:", clauses.contractType);

  console.log("\\n👤 당사자:");
  console.log("  갑:", clauses.parties.party1.name, "(" + clauses.parties.party1.role + ")");
  console.log("  을:", clauses.parties.party2.name, "(" + clauses.parties.party2.role + ")");

  console.log("\\n📅 계약 기간:", clauses.period.start, "~", clauses.period.end);
  console.log("💰 계약 금액:", clauses.amount.total?.toLocaleString(), clauses.amount.currency);

  if (clauses.amount.paymentSchedule) {
    console.log("\\n💳 지급 일정:");
    for (const pay of clauses.amount.paymentSchedule) {
      console.log("  •", pay.stage + ":", pay.percentage + "%");
    }
  }

  console.log("\\n📋 주요 의무 사항:");
  for (const ob of clauses.obligations || []) {
    console.log("  •", ob.article, "—", ob.description);
  }

  console.log("\\n⚖️ 위약금:", clauses.penalties?.[0]?.formula || "없음");
  console.log("🔒 비밀유지:", clauses.confidentiality?.duration || "없음");
  console.log("💡 지재권:", clauses.intellectualProperty?.owner || "없음");
} catch (e) {
  console.log("📄 추출 결과 (텍스트):\\n", res.text);
}`,
      hints: [
        "핵심: 비정형 계약서 텍스트를 정형 JSON 으로 바꾸는 게 정보 추출(Information Extraction)이에요.",
        "systemPrompt 에 추출할 필드를 명확히 정의하면 LLM 이 빠짐없이 추출합니다.",
        "parties 의 role 은 '갑/을' 외에 '위탁자/수탁자', '임대인/임차인' 등 계약 유형에 따라 달라져요.",
        "금액은 문자열 '오천만원' 도 숫자 50000000 으로 변환 — LLM 이 자동으로 해줍니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 위험 평가 분석기 — 조항별 위험도 판정

추출된 조항을 분석해서 법률적 위험 수준을 판정합니다. 🔴 HIGH (즉시 수정 필요), 🟡 MEDIUM (검토 권장), 🟢 LOW (경미한 주의) — 각 조항에 ==위험 배지==를 달아 한눈에 파악할 수 있게 합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 위험 평가 분석기 — 조항별 위험도 + 사유 분석
const contractClauses = \`
제5조 (위약금)
을이 납기를 지키지 못할 경우, 지연일수 1일당 계약금액의 0.5%를 위약금으로 갑에게 지급한다.
단, 갑의 사유로 인한 지연은 별도 협의한다.

제6조 (하자 보수)
을은 최종 납품일로부터 12개월간 무상 하자보수 의무를 진다.

제7조 (비밀유지)
양 당사자는 계약 이행 과정에서 알게 된 상대방의 영업비밀을 계약 종료 후 3년간 제3자에게 누설하지 아니한다.

제8조 (지적재산권)
본 용역 결과물의 지적재산권은 갑에게 귀속된다.

제3조 (계약 기간)
2026년 3월 1일부터 2026년 8월 31일까지 6개월간으로 한다.
\`;

const systemPrompt = \`너는 계약서 위험 분석 전문 AI 야.
각 조항의 법률적 위험도를 분석하고 JSON 배열로 반환해.

[위험 수준]
- HIGH: 일방적으로 불리한 조건, 과도한 위약금, 부당한 책임 전가, 면책 조항 부재
- MEDIUM: 범위가 모호한 조항, 해석 여지가 큰 문구, 일반적이지 않은 기간
- LOW: 경미한 개선 여지, 불가항력 미명시, 분쟁해결 절차 미비

[응답 형식]
[
  {
    "article": "제N조",
    "title": "조항 제목",
    "severity": "HIGH | MEDIUM | LOW",
    "summary": "조항 내용 한 줄 요약",
    "risk": "위험 사유 상세 설명",
    "affected": "갑 | 을 | 양측",
    "recommendation": "개선 방향 한 줄"
  }
]

[규칙]
- 한국어 작성
- 모든 조항을 빠짐없이 분석
- 위험이 없는 조항은 severity: "NONE", risk: "특이사항 없음"
- JSON 만 반환\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 계약 조항들의 위험도를 분석해줘:\\n\\n\${contractClauses}\` },
  ],
});

try {
  const risks = JSON.parse(res.text);
  const badge = (s: string) =>
    s === "HIGH" ? "🔴 HIGH  " :
    s === "MEDIUM" ? "🟡 MEDIUM" :
    s === "LOW" ? "🟢 LOW   " : "✅ 정상  ";

  console.log("⚠️ 위험 평가 결과");
  console.log("═".repeat(55));

  const sorted = risks.sort((a: any, b: any) => {
    const order: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 };
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
  });

  for (const r of sorted) {
    console.log(\`\\n\${badge(r.severity)}  \${r.article} \${r.title}\`);
    console.log("  📝 요약:", r.summary);
    if (r.severity !== "NONE") {
      console.log("  ⚠️ 위험:", r.risk);
      console.log("  👤 영향:", r.affected);
      console.log("  💡 권장:", r.recommendation);
    }
  }

  const highCount = risks.filter((r: any) => r.severity === "HIGH").length;
  const medCount = risks.filter((r: any) => r.severity === "MEDIUM").length;
  const lowCount = risks.filter((r: any) => r.severity === "LOW").length;

  console.log("\\n" + "─".repeat(55));
  console.log(\`📊 요약: 🔴 \${highCount}건  🟡 \${medCount}건  🟢 \${lowCount}건\`);
  if (highCount > 0) console.log("⚠️ HIGH 위험 조항이 있습니다 — 서명 전 반드시 검토하세요!");
} catch (e) {
  console.log("⚠️ 분석 결과 (텍스트):\\n", res.text);
}`,
      hints: [
        "핵심: 위험도 분류는 severity 필드 하나로 색상 배지를 결정 — UI 에서 조건부 렌더링과 직결돼요.",
        "위약금 0.5%/일은 연 182.5% — 일반적으로 0.1~0.3%/일 수준이라 HIGH 로 분류될 가능성이 높아요.",
        "affected 필드로 '누구에게 불리한지' 를 명시하면, 입장별 필터링 UI 를 만들 수 있어요.",
        "실무에서는 업종별·계약유형별 위험 기준 템플릿을 만들어 더 정밀한 분석을 합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 수정 제안 생성기 — 위험 조항 개선안

위험으로 분류된 조항에 대해 AI 가 **구체적인 문구 수정안**을 생성합니다. 원본 문구와 수정안을 나란히 보여주고, 수정 이유와 법적 근거까지 설명해 줘요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 수정 제안 생성기 — 위험 조항 → 구체적 수정안
const riskyClause = \`
제5조 (위약금)
을이 납기를 지키지 못할 경우, 지연일수 1일당 계약금액의 0.5%를 위약금으로 갑에게 지급한다.
단, 갑의 사유로 인한 지연은 별도 협의한다.
\`;

const systemPrompt = \`너는 계약서 수정 전문 법률 AI 야.
위험으로 판정된 계약 조항에 대해 공정한 수정안을 제시해.

[응답 형식 — JSON]
{
  "article": "제N조",
  "title": "조항 제목",
  "original": "원문 전체",
  "severity": "HIGH",
  "issues": ["문제점 1", "문제점 2"],
  "amended": "수정된 전체 문구",
  "changes": [
    {
      "before": "원본 일부 문구",
      "after": "수정된 문구",
      "reason": "수정 이유"
    }
  ],
  "legalBasis": "수정 근거 (관련 법률·판례·일반 관행)"
}

[수정 원칙]
- 양측에 공정한 조건으로 균형 맞추기
- 과도한 위약금은 합리적 수준으로 조정
- 모호한 문구는 구체적으로 명확화
- 누락된 보호 조항 (불가항력, 면책, 분쟁해결) 추가 제안
- JSON 만 반환\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 위험 조항의 수정안을 제시해줘:\\n\\n\${riskyClause}\` },
  ],
});

try {
  const amendment = JSON.parse(res.text);
  console.log("✏️ 수정 제안");
  console.log("═".repeat(55));
  console.log("📌", amendment.article, amendment.title);
  console.log("🔴 위험도:", amendment.severity);

  console.log("\\n❌ 문제점:");
  for (const issue of amendment.issues) {
    console.log("  •", issue);
  }

  console.log("\\n📝 원문:");
  console.log("  " + amendment.original.trim().split("\\n").join("\\n  "));

  console.log("\\n✅ 수정안:");
  console.log("  " + amendment.amended.trim().split("\\n").join("\\n  "));

  console.log("\\n🔄 변경 사항:");
  for (const ch of amendment.changes) {
    console.log("  ─────────────────────────────────");
    console.log("  전:", ch.before);
    console.log("  후:", ch.after);
    console.log("  📎 사유:", ch.reason);
  }

  console.log("\\n⚖️ 법적 근거:", amendment.legalBasis);
} catch (e) {
  console.log("✏️ 수정 제안 (텍스트):\\n", res.text);
}`,
      hints: [
        "핵심: before/after 쌍으로 변경 사항을 구체화하면 diff 뷰어 UI 를 바로 만들 수 있어요.",
        "위약금 0.5%/일 → 0.1~0.15%/일 + 총액 상한 10~15% 가 일반적 수정 방향이에요.",
        "'별도 협의' 같은 모호한 문구는 구체적 절차 (서면 통지, 기한 연장 일수 등) 로 바꿉니다.",
        "legalBasis 는 신뢰도를 높여주지만, 실제 법률 조언은 반드시 전문 변호사에게 받아야 해요!",
      ],
    },

    // ─── Part B: 풀스택 계약서 분석 대시보드 (MD 레시피) ───
    {
      type: "markdown",
      source: `## Part B: 계약서 분석 대시보드 만들기 (100분)

이제 Part A 에서 체험한 AI 분석 엔진을 **React 기반 PDF 분석 대시보드**로 옮깁니다.
PDF 업로드 → ==pdfjs-dist== 로 텍스트 추출 → AI 분석 → 위험 배지 + 조항 카드 + 비교 모드까지 완전한 계약서 분석 도구예요.

> 📋 아래 MD 레시피를 **Claude Code** 나 **Cursor** 에 통째로 붙여넣으면, AI 가 프로젝트를 생성해줍니다.

---

### 프로젝트 셋업

\`\`\`bash
npm create vite@latest ai-contract-analyzer -- --template react-ts
cd ai-contract-analyzer
npm install
npm install @google/genai pdfjs-dist
npm install -D tailwindcss @tailwindcss/vite
\`\`\`

\`\`\`
ai-contract-analyzer/
├── src/
│   ├── components/
│   │   ├── Upload/
│   │   │   ├── PDFDropZone.tsx        # 드래그 앤 드롭 PDF 업로드
│   │   │   └── FilePreview.tsx        # 업로드된 파일 미리보기
│   │   ├── Analysis/
│   │   │   ├── BasicInfo.tsx          # 📋 기본 정보 카드 (유형·당사자·기간·금액)
│   │   │   ├── RiskPanel.tsx          # ⚠️ 위험 분석 패널 (배지 + 상세)
│   │   │   ├── ClauseSummary.tsx      # 🔍 조항별 요약 리스트
│   │   │   └── AmendmentView.tsx      # ✏️ 수정 제안 diff 뷰
│   │   ├── Compare/
│   │   │   ├── CompareMode.tsx        # 🔀 2-문서 비교 레이아웃
│   │   │   └── DiffHighlight.tsx      # 차이점 하이라이트
│   │   ├── History/
│   │   │   └── AnalysisHistory.tsx    # 📁 분석 히스토리
│   │   ├── Export/
│   │   │   └── ReportExport.tsx       # 📥 PDF 리포트 내보내기
│   │   ├── Header.tsx                 # 상단 헤더 + 다크모드
│   │   └── LoadingSpinner.tsx         # 분석 중 로딩 상태
│   ├── hooks/
│   │   ├── useContractAnalysis.ts     # 계약서 분석 상태 관리
│   │   └── usePDFExtractor.ts         # PDF → 텍스트 추출 훅
│   ├── lib/
│   │   ├── ai.ts                      # Gemini API 래퍼
│   │   ├── pdf.ts                     # pdfjs-dist 텍스트 추출
│   │   └── storage.ts                 # localStorage 히스토리 저장
│   ├── types/
│   │   └── contract.ts               # 계약서 분석 타입 정의
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── pdf.worker.min.mjs            # pdfjs-dist 워커 (복사 필요)
├── index.html
└── package.json
\`\`\`

---

### 핵심 타입 정의

\`\`\`typescript
// src/types/contract.ts
export type Severity = "HIGH" | "MEDIUM" | "LOW" | "NONE";

export interface Party {
  name: string;
  role: string;              // 갑/을, 임대인/임차인 등
}

export interface PaymentSchedule {
  stage: string;
  percentage: number;
  amount: number;
}

export interface ContractBasicInfo {
  contractType: string;
  parties: { party1: Party; party2: Party };
  period: { start: string; end: string; duration: string };
  amount: { total: number; currency: string; paymentSchedule: PaymentSchedule[] };
}

export interface ClauseRisk {
  article: string;
  title: string;
  severity: Severity;
  summary: string;
  risk: string;
  affected: string;
  recommendation: string;
}

export interface ClauseChange {
  before: string;
  after: string;
  reason: string;
}

export interface Amendment {
  article: string;
  title: string;
  original: string;
  severity: string;
  issues: string[];
  amended: string;
  changes: ClauseChange[];
  legalBasis: string;
}

export interface ContractAnalysis {
  id: string;
  fileName: string;
  analyzedAt: string;
  basicInfo: ContractBasicInfo;
  risks: ClauseRisk[];
  amendments: Amendment[];
  rawText: string;
}

export interface ComparisonResult {
  onlyInA: string[];           // A 에만 있는 조항
  onlyInB: string[];           // B 에만 있는 조항
  differences: {
    article: string;
    inA: string;
    inB: string;
    significance: Severity;
  }[];
}
\`\`\`

---

### PDF 텍스트 추출

\`\`\`typescript
// src/lib/pdf.ts
import * as pdfjsLib from "pdfjs-dist";

// Vite 에서 워커 경로 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join(" ");
    pages.push(text);
  }
  return pages.join("\\n\\n--- 페이지 구분 ---\\n\\n");
}
\`\`\`

---

### AI 분석 API 래퍼

\`\`\`typescript
// src/lib/ai.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

export async function analyzeContract(
  text: string,
  task: "extract" | "risk" | "amend" | "compare",
  extra?: string
): Promise<string> {
  const prompts: Record<string, string> = {
    extract: \`계약서에서 핵심 조항을 추출해. contractType, parties, period, amount, obligations, penalties, confidentiality, intellectualProperty, warranty 항목을 JSON 으로 반환해.\`,
    risk: \`각 조항의 법률적 위험도를 HIGH/MEDIUM/LOW/NONE 으로 분석해. article, title, severity, summary, risk, affected, recommendation 을 JSON 배열로 반환해.\`,
    amend: \`위험 조항들의 구체적 수정안을 제시해. original, amended, changes(before/after/reason), legalBasis 포함. JSON 배열로 반환해.\`,
    compare: \`두 계약서의 조항별 차이점을 분석해. onlyInA, onlyInB, differences 를 JSON 으로 반환해.\`,
  };

  const input = task === "compare"
    ? \`[계약서 A]\\n\${text}\\n\\n[계약서 B]\\n\${extra}\`
    : text;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \`\${prompts[task]}\\n\\n\${input}\`,
    config: { maxOutputTokens: 2000, temperature: 0.2 },
  });
  return response.text ?? "";
}
\`\`\`

---

### 분석 상태 관리 훅

\`\`\`typescript
// src/hooks/useContractAnalysis.ts
import { useState, useCallback } from "react";
import { extractTextFromPDF } from "../lib/pdf";
import { analyzeContract } from "../lib/ai";
import type { ContractAnalysis, ClauseRisk, Amendment } from "../types/contract";

type Phase = "idle" | "extracting" | "analyzing-clauses" | "analyzing-risks" | "generating-amendments" | "done" | "error";

export function useContractAnalysis() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (file: File) => {
    try {
      setPhase("extracting");
      setError(null);
      const rawText = await extractTextFromPDF(file);

      setPhase("analyzing-clauses");
      const basicInfoJson = await analyzeContract(rawText, "extract");
      const basicInfo = JSON.parse(basicInfoJson);

      setPhase("analyzing-risks");
      const risksJson = await analyzeContract(rawText, "risk");
      const risks: ClauseRisk[] = JSON.parse(risksJson);

      setPhase("generating-amendments");
      const highRiskText = risks
        .filter(r => r.severity === "HIGH" || r.severity === "MEDIUM")
        .map(r => \`\${r.article} \${r.title}: \${r.summary}\`)
        .join("\\n");
      const amendsJson = await analyzeContract(highRiskText, "amend");
      const amendments: Amendment[] = JSON.parse(amendsJson);

      const result: ContractAnalysis = {
        id: crypto.randomUUID(),
        fileName: file.name,
        analyzedAt: new Date().toISOString(),
        basicInfo,
        risks,
        amendments,
        rawText,
      };
      setAnalysis(result);
      setPhase("done");
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석 실패");
      setPhase("error");
    }
  }, []);

  return { phase, analysis, error, analyze };
}
\`\`\`

---

### 위험 배지 컴포넌트

\`\`\`typescript
// RiskPanel.tsx 내부 — 위험 수준별 색상 배지
const severityConfig = {
  HIGH:   { bg: "bg-red-100 dark:bg-red-900/30",   text: "text-red-700 dark:text-red-300",   icon: "🔴", label: "위험" },
  MEDIUM: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", icon: "🟡", label: "경고" },
  LOW:    { bg: "bg-green-100 dark:bg-green-900/30",  text: "text-green-700 dark:text-green-300",  icon: "🟢", label: "주의" },
  NONE:   { bg: "bg-gray-100 dark:bg-gray-800",     text: "text-gray-600 dark:text-gray-400",  icon: "✅", label: "정상" },
};

// 사용:
// <span className={\`px-2 py-1 rounded-full text-sm \${config.bg} \${config.text}\`}>
//   {config.icon} {config.label}
// </span>
\`\`\`

---

### 2-문서 비교 모드

\`\`\`typescript
// src/components/Compare/CompareMode.tsx
// 두 계약서를 나란히 업로드하고 AI 가 차이점 분석
//
// 레이아웃:
// ┌───────────────┬───────────────┐
// │  📄 계약서 A   │  📄 계약서 B   │
// │  [파일명.pdf]  │  [파일명.pdf]  │
// ├───────────────┴───────────────┤
// │  🔀 차이점 분석 결과           │
// │  ┌─────────────────────────┐  │
// │  │ 제5조 위약금              │  │
// │  │ A: 0.5%/일               │  │
// │  │ B: 0.1%/일 (상한 10%)    │  │
// │  │ 🟡 MEDIUM — B가 더 유리  │  │
// │  └─────────────────────────┘  │
// └───────────────────────────────┘
//
// 구현 핵심:
// 1. 두 PDF 각각 텍스트 추출
// 2. analyzeContract(textA, "compare", textB) 호출
// 3. ComparisonResult 의 differences 배열을 카드로 렌더링
// 4. significance 에 따라 위험 배지 색상 적용
\`\`\`

---

### 리포트 PDF 내보내기

\`\`\`typescript
// src/components/Export/ReportExport.tsx
// window.print() 기반 간단 PDF 내보내기
//
// 1. 분석 결과를 프린트 친화적 레이아웃으로 렌더링
// 2. @media print CSS 로 불필요한 UI 숨김
// 3. "📥 리포트 PDF" 버튼 → window.print() 호출
//
// 고급: jsPDF 또는 @react-pdf/renderer 사용 시
// 커스텀 헤더/푸터, 페이지 번호, 로고 삽입 가능

function exportReport() {
  window.print();
}

// @media print 스타일:
// @media print {
//   .no-print { display: none; }
//   .print-only { display: block; }
//   body { font-size: 12pt; color: black; }
// }
\`\`\`

---

### localStorage 히스토리 관리

\`\`\`typescript
// src/lib/storage.ts
const STORAGE_KEY = "contract-analyses";

export function saveAnalysis(analysis: ContractAnalysis) {
  const all = loadHistory();
  all.unshift(analysis);                          // 최신이 위로
  if (all.length > 20) all.length = 20;           // 최대 20건
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadHistory(): ContractAnalysis[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function deleteAnalysis(id: string) {
  const all = loadHistory().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
\`\`\`

---

### 주요 기능 체크리스트

#### PDF 처리
- [ ] 드래그 앤 드롭 PDF 업로드
- [ ] ==pdfjs-dist== 로 텍스트 추출
- [ ] 추출 진행 상태 표시
- [ ] 다중 페이지 지원

#### AI 분석
- [ ] 핵심 조항 추출 (당사자·날짜·금액·의무·위약금)
- [ ] 위험도 분석 (🔴 HIGH / 🟡 MEDIUM / 🟢 LOW 배지)
- [ ] 조항별 요약 리스트
- [ ] 수정 제안 (before/after diff)
- [ ] 단계별 분석 진행 표시 (추출 → 분석 → 수정안)

#### 비교 모드
- [ ] 2-문서 업로드 UI (나란히)
- [ ] AI 차이점 분석
- [ ] 조항별 ==diff== 하이라이트
- [ ] 차이 심각도 배지

#### 히스토리 & 내보내기
- [ ] 분석 히스토리 (localStorage, 최대 20건)
- [ ] 히스토리에서 결과 다시 보기
- [ ] PDF 리포트 내보내기 (window.print)
- [ ] 다크/라이트 모드 토글`,
    },

    {
      type: "markdown",
      source: `### 🏆 도전 과제 — 더 강력한 계약서 분석기로

기본 기능이 완성됐다면, 다음 기능을 추가해 보세요!

### 레벨 1 — 기본 확장
- **다국어 계약서**: 영문 계약서 분석 + 한국어 요약 자동 생성
- **조항 검색**: 특정 키워드가 포함된 조항만 필터링
- **분석 결과 공유**: URL 복사로 분석 결과 공유 (base64 인코딩)

### 레벨 2 — 중급 도전
- **템플릿 비교**: 표준 계약서 템플릿과 자동 비교 (정부 표준 양식 vs 내 계약서)
- **조항 히트맵**: 위험 수준을 원본 PDF 위에 ==오버레이== 표시
- **대화형 Q&A**: 계약서 내용에 대해 AI 와 자연어 질의응답
- **OCR 지원**: 스캔된 이미지 PDF 는 ==Tesseract.js== 로 OCR 후 분석

### 레벨 3 — 프로 도전
- **계약서 자동 생성**: 조건 입력 → AI 가 완성된 계약서 초안 작성
- **버전 관리**: 같은 계약서의 수정 이력을 ==diff== 타임라인으로 관리
- **팀 협업**: 여러 리뷰어가 조항별 코멘트를 남기는 협업 기능
- **법률 DB 연동**: 관련 법률·판례를 자동으로 인용하는 고급 분석

---

## 🎉 W34 완료!

이번 워크샵에서 배운 것:
- ✅ **PDF 텍스트 추출** — ==pdfjs-dist== 로 비정형 PDF 를 텍스트로 변환
- ✅ **==핵심 조항== 추출** — AI 가 당사자·날짜·금액·의무를 JSON 으로 구조화
- ✅ **==위험 평가==** — 조항별 위험도를 색상 ==배지==로 시각화 (🔴🟡🟢)
- ✅ **수정 제안** — 위험 조항의 before/after 문구 수정안 자동 생성
- ✅ **2-문서 비교** — 두 계약서의 차이점을 AI 로 분석
- ✅ **분석 대시보드** — 업로드부터 리포트 내보내기까지 원스톱 UI

> ⚠️ **면책 고지**: AI 분석은 참고용이며, 법률적 효력이 없습니다. 중요한 계약은 반드시 전문 변호사의 검토를 받으세요!

> 🔮 **다음 워크샵** 에서는 또 다른 실전 AI 프로젝트를 만들어 봅니다. 기대해 주세요!`,
    },
  ],
  quiz: {
    title: "W34 — AI 계약서 분석기 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "pdfjs-dist 로 PDF 에서 텍스트를 추출할 때, 각 페이지의 텍스트를 가져오는 올바른 순서는?",
        options: [
          "getDocument → getPage → getTextContent → items.map(i => i.str)",
          "readFile → parseHTML → innerText",
          "fetch → response.text() → split('\\n')",
          "FileReader → readAsText → result",
        ],
        correctIndex: 0,
        explanation:
          "pdfjs-dist 는 getDocument 로 PDF 를 로드하고, getPage 로 페이지별로 접근한 뒤, getTextContent 로 텍스트 아이템 배열을 가져옵니다. 각 아이템의 str 속성을 합치면 페이지 텍스트가 됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "계약서 위험 분석에서 '제5조 위약금: 지연일수 1일당 계약금의 0.5%' 가 HIGH 로 분류되는 이유는?",
        options: [
          "5조라서 번호가 크니까",
          "위약금이라는 단어가 부정적이니까",
          "일 0.5% 는 연 182.5% 에 해당하는 과도한 비율이라 일방적으로 불리하니까",
          "갑과 을 모두에게 적용되니까",
        ],
        correctIndex: 2,
        explanation:
          "0.5%/일은 연간으로 환산하면 182.5%로, 일반적인 계약 관행(0.1~0.3%/일) 대비 과도합니다. 이처럼 수치를 연간으로 환산해 비교하면 위험 수준을 객관적으로 판단할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question:
          "2-문서 비교 모드에서 AI 에게 두 계약서를 보낼 때 가장 효과적인 프롬프트 구조는?",
        options: [
          "두 계약서를 하나로 합쳐서 보낸다",
          "[계약서 A]와 [계약서 B]를 명확히 구분 태그로 나누어 보낸다",
          "계약서 A 만 보내고 B 는 나중에 보낸다",
          "두 계약서를 번갈아 한 줄씩 섞어서 보낸다",
        ],
        correctIndex: 1,
        explanation:
          "두 문서를 [계약서 A], [계약서 B] 같은 구분 태그로 명확히 나누면, AI 가 각 문서의 범위를 정확히 인식하고 조항별로 올바르게 비교할 수 있습니다. 섞거나 합치면 어떤 내용이 어느 계약서의 것인지 혼동됩니다.",
      },
    ],
  } satisfies Quiz,
};
