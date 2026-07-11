import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급3 시리즈C(운영 만들기) 01강 — 운영 계층의 해부.
 * 대상 시스템을 감싸는 관측·평가·개선 계층 + 계면 원칙(run 레코드 표준화).
 */
export const lessonC01: Lesson = {
  id: "ai-eng-a3-c01-ops-layer",
  language: "ai-engineering",
  track: "advanced3",
  order: 21,
  title: "C1. 운영 계층의 해부 — 시스템 위의 시스템",
  subtitle: "운영 코드는 대상 코드를 모른다 — 계면(run 레코드) 하나로 감싼다",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🎛 고급3·C1강. 운영 계층의 해부
### — 시리즈 C "운영 만들기" 시작

⏱️ 45분 · 🧰 API 키 · 🗺️ 운영 루프 전체의 아키텍처 · 선수: **고급2 C(코드리뷰 회사)** 권장

> 💡 시리즈 B에서 손으로 하던 운영(계기판·채점·대장)을 이제 **코드로** 짓습니다.
> 첫 결정이 전체를 좌우해요: 운영 코드를 대상 시스템(코드리뷰 회사) 안에 심을 것인가,
> **밖에서 감쌀 것인가.**
> 답은 감싸기 — **운영 코드는 대상 코드를 모른다**(계면 원칙). 대상이 남기는
> **run 레코드** 하나만 표준화하면, 어떤 시스템이든 같은 운영 계층으로 기를 수 있습니다.

### 시리즈 C 지도
- C1 계면(run 레코드) ← 오늘 · C2 텔레메트리 · C3 평가 러너 · C4 현장 신호 · C5 실패 분류기 · C6 회귀 게이트
- **C7~C10 = 실전 아크 '코드리뷰 회사 운영 30일'** (카나리→거버너→사고의 날→운영 센터)`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 오늘의 핵심: run 레코드 — 운영 계층의 유일한 계면 ──
// 대상 시스템이 무엇이든(코드리뷰 회사·브리핑 팀·번역 파이프라인) 실행 1회마다 이 레코드 하나를 남긴다.

type RunRecord = {
  id: string;              // 실행 식별자
  ts: number;              // 시각 (주입받는다 — 재현 가능성!)
  version: string;         // 매뉴얼/설정 버전 (B5 대장의 그 버전 — 없으면 개선 효과 추적 불가)
  input_digest: string;    // 입력 요약 (원문 아님 — '요약+위치' 원칙)
  ok: boolean;             // 성공 여부
  cost: number;            // 비용 (토큰 등)
  durationMs: number;
  quality?: number;        // 채점 점수 (평가 러너 C3가 나중에 채움)
  failure_kind?: string;   // 실패 유형 (분류기 C5가 채움)
  output_ref: string;      // 산출물 위치 (아티팩트 저장소 키)
};

// ── 대상 시스템 (mock): 고급2의 코드리뷰 회사를 한 함수로 추상화 ──
// 운영 계층은 이 함수의 '내부'를 전혀 모른다 — 아는 것은 반환된 레코드뿐.
const artifacts = new Map<string, string>();
let seq = 0;
async function reviewCompany(pr: string, version: string, now: number): Promise<RunRecord> {
  const t0 = now;
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: "코드리뷰 시스템(축약판). 발견을 '파일:줄 — 문제' 형식 목록으로. 없으면 '발견 없음'." },
      { role: "user", content: pr },
    ],
  });
  const out = res.text ?? "";
  const id = \`run-\${++seq}\`;
  artifacts.set(id, out); // 원문은 저장소에, 레코드에는 참조만
  return {
    id, ts: now, version,
    input_digest: pr.slice(0, 40).replace(/\\n/g, " ") + "…",
    ok: out.length > 0,
    cost: Math.round(out.length / 4),      // 토큰 대용치
    durationMs: 1200,                       // (데모 고정값 — 실전은 실측)
    output_ref: id,
  };
}

// ── 운영 저장소: 레코드가 쌓이는 곳 (JSONL 한 줄 = 한 실행) ──
const OPS_LOG: RunRecord[] = [];
async function operatedRun(pr: string, version: string, now: number) {
  const rec = await reviewCompany(pr, version, now);
  OPS_LOG.push(rec);                        // 운영 계층의 전부는 여기서 시작된다
  return rec;
}

// 시운전 — 사흘치 실행을 시뮬레이션 (ts를 주입하므로 시간 여행 가능)
const DAY = 86400000;
const base = 1700000000000;
await operatedRun("function avg(ns){ return ns.reduce((a,b)=>a+b,0)/ns.length }", "v12", base);
await operatedRun("const q = 'SELECT * WHERE tag=' + userInput", "v12", base + DAY);
await operatedRun("function clamp(n,lo,hi){ return Math.min(hi, Math.max(lo,n)) }", "v12", base + 2 * DAY);

console.log("📔 운영 로그 (계기판·평가·진단의 유일한 원료):");
for (const r of OPS_LOG) console.log(JSON.stringify(r));
console.log("\\n👉 운영 계층은 reviewCompany 내부를 모른다 — 이 레코드만 안다. 이것이 계면 원칙.");`,
      hints: [
        "ts(시각)를 내부에서 Date.now()로 찍지 않고 주입받는 설계 — 시간을 통제할 수 있어야 '30일 시뮬레이션'(C7~C10)과 실패 재현이 가능해요. 운영 코드의 오랜 지혜입니다.",
        "version 필드가 B5 개선 대장의 코드 연결점 — 레코드에 버전이 없으면 '개선 전후 비교'가 영영 불가능합니다. 지금 심어두는 한 필드가 C6 회귀 게이트를 가능하게 해요.",
        "quality와 failure_kind가 옵셔널인 이유: 실행 시점에는 모르고, 평가 러너(C3)와 분류기(C5)가 나중에 채웁니다 — 운영 계층도 파이프라인이에요.",
      ],
    },
    {
      type: "markdown",
      source: `## 🧭 계면 원칙 — 왜 '모르는 게' 힘인가

| 운영 코드가 대상을 알면 | 계면(레코드)만 알면 |
|------------------------|--------------------|
| 대상 수정 때마다 운영 코드도 수정 | 대상이 바뀌어도 운영 계층 그대로 |
| 시스템마다 운영 코드 새로 작성 | **한 운영 계층이 모든 시스템을** (고급2 C10 '골격 이식'의 운영판) |
| 운영이 대상 내부에 얽혀 테스트 곤란 | 레코드만 넣으면 운영 계층 단독 테스트 가능 |

고급2에서 배운 '산출물 계약'(C5)이 여기서 재등장합니다 — **run 레코드는 대상 시스템과
운영 계층 사이의 산출물 계약**이에요. 계약만 지키면 서로의 내부는 자유.

## 🔬 연구 노트 — C1

1. **계면 검증**: reviewCompany를 전혀 다른 시스템(번역 파이프라인 mock)으로 바꿔도 OPS_LOG 쪽 코드가 한 줄도 안 바뀌는지 확인하라.
2. **레코드 다이어트**: input 원문 전체를 레코드에 넣으면 무슨 문제가 생기나? (힌트: 운영 로그 자체가 비대해져 '운영의 운영'이 필요해진다 — 요약+위치 원칙은 로그에도.)
3. **버전 없는 세상**: version 필드를 빼고 4주치 로그를 상상하라 — '지난주 개선이 효과 있었나'에 답할 수 있는가?

> 🎯 **(전부 잊어도 이것만)**
> ## 운영 계층의 제1원칙 — **운영 코드는 대상 코드를 모른다.** 계면은 run 레코드 하나(버전·비용·성공·산출물 참조), 시각은 주입받는다.
> 레코드는 대상과 운영 사이의 산출물 계약 — 계약만 지키면 한 운영 계층이 모든 시스템을 기른다.

📎 **다음 강 — C2. 텔레메트리 파이프라인**: 쌓인 레코드에서 계기판 3숫자를 자동으로 뽑고 '어제 대비'를 계산합니다 — B2에서 손으로 하던 일의 배관 공사.`,
    },
  ],

  quiz: {
    title: "고급3·C1강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "'운영 코드는 대상 코드를 모른다'(계면 원칙)의 이득은?",
        options: [
          "운영 코드가 짧아 보인다",
          "대상이 바뀌어도 운영 계층이 그대로라, 한 운영 계층으로 모든 시스템을 기를 수 있다",
          "대상 시스템을 비밀로 유지할 수 있다",
        ],
        correctIndex: 1,
        explanation:
          "run 레코드라는 계약만 지키면 서로의 내부는 자유예요. 고급2 '골격 이식'의 운영판입니다.",
      },
      {
        type: "multiple-choice",
        question: "run 레코드에 version 필드가 필수인 이유는?",
        options: [
          "버전 번호가 클수록 멋있어서",
          "레코드에 버전이 없으면 개선(B5 대장) 전후의 성능 비교가 영영 불가능하기 때문",
          "JSON 규격상 필수라서",
        ],
        correctIndex: 1,
        explanation:
          "'v12에서 v13으로 바꾼 뒤 품질이 올랐나'는 레코드의 version 필드로만 답할 수 있어요. C6 회귀 게이트의 전제입니다.",
      },
      {
        type: "multiple-choice",
        question: "시각(ts)을 내부 Date.now()가 아니라 주입받는 이유는?",
        options: [
          "Date.now()는 유료 함수라서",
          "시간을 통제해야 30일 시뮬레이션과 실패 재현이 가능하기 때문",
          "시계가 없는 서버도 있어서",
        ],
        correctIndex: 1,
        explanation:
          "주입된 시간은 되감고 빨리감을 수 있어요. C7~C10의 '운영 30일' 아크가 이 설계 위에서 돌아갑니다.",
      },
    ],
  } satisfies Quiz,
};
