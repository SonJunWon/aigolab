import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 05강 — 산출물 계약.
 * JSON 스키마 강제 + 검증 실패 재시도 + 메시지 전달 vs 아티팩트 공유.
 */
export const lessonC05: Lesson = {
  id: "ai-eng-a2-c05-output-contract",
  language: "ai-engineering",
  track: "advanced2",
  order: 25,
  title: "C5. 산출물 계약 — 스키마와 핸드오프",
  subtitle: "요약을 넘기지 말고 위치를 넘겨라 — 전달의 공학",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🏇 고급2·C5강. 산출물 계약
### — 스키마와 핸드오프

⏱️ 50분 · 🧰 API 키 · 🗺️ 구현 대상: ④ 전달 · 선수: C1~C3

> 💡 지금까지 에이전트들은 자유 텍스트로 주고받았어요. 두 명일 땐 괜찮지만
> 팀이 커지면 자유 텍스트는 **전화 게임의 코드 버전**이 됩니다 — 취합자가 파싱에 실패하고,
> 필드가 누락되고, 확신도가 증발해요.
> 해법은 A4에서 배운 산출물 계약을 **기계가 검증 가능한 형태**로 굳히는 것: **JSON 스키마.**
> 그리고 전달량의 딜레마에는 실전 답이 있습니다 — **"요약을 넘기지 말고 위치를 넘겨라."**

### 이 강에서
- 스키마 강제 + 검증 실패 시 재시도 루프 (계약 위반은 반려한다)
- 메시지 전달 vs 아티팩트(파일) 공유 — 두 핸드오프의 사용처
- '요약 + 원본 위치' 패턴의 코드화`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 오늘의 핵심: 계약을 강제하는 구조화 산출 함수 ──
// '스키마로 부탁'이 아니라 '검증 통과까지 반려' — 계약은 강제될 때만 계약이다

type FieldSpec = { type: "string" | "number"; enum?: string[] };
type Contract = { fields: Record<string, FieldSpec>; maxItems?: number };

// 초경량 검증기 (실전에서는 zod/ajv — 원리는 동일)
function validate(items: any[], c: Contract): string | null {
  if (!Array.isArray(items)) return "배열이 아님";
  if (c.maxItems && items.length > c.maxItems) return \`항목 \${items.length}개 — 최대 \${c.maxItems}개\`;
  for (const [i, it] of items.entries()) {
    for (const [k, spec] of Object.entries(c.fields)) {
      if (!(k in it)) return \`\${i}번 항목에 '\${k}' 필드 누락\`;
      if (typeof it[k] !== spec.type) return \`\${i}번 '\${k}'가 \${spec.type} 아님\`;
      if (spec.enum && !spec.enum.includes(it[k])) return \`\${i}번 '\${k}' 값 '\${it[k]}'는 허용값(\${spec.enum.join("/")}) 아님\`;
    }
  }
  return null; // 통과
}

async function runWithContract(system: string, mission: string, contract: Contract, maxRetries = 2): Promise<any[]> {
  const schemaDesc = Object.entries(contract.fields)
    .map(([k, s]) => \`"\${k}": \${s.enum ? s.enum.join("|") : s.type}\`).join(", ");
  const messages: any[] = [
    { role: "system", content: \`\${system}\\n반드시 JSON 배열만 출력하라. 각 항목: { \${schemaDesc} }. 설명·인사 금지.\` },
    { role: "user", content: mission },
  ];
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await chat({ provider: "gemini", messages });
    try {
      const parsed = JSON.parse((res.text ?? "").replace(/\`\`\`json|\`\`\`/g, "").trim());
      const err = validate(parsed, contract);
      if (!err) return parsed; // ✅ 계약 통과
      // ❌ 계약 위반 — 반려 사유를 돌려주고 재시도 (에러도 모델이 읽는 UI)
      messages.push({ role: "assistant", content: res.text ?? "" });
      messages.push({ role: "user", content: \`계약 위반으로 반려한다: \${err}. 스키마에 맞춰 전체를 다시 출력하라.\` });
      console.log(\`♻️ 반려 (\${attempt + 1}차): \${err}\`);
    } catch {
      messages.push({ role: "assistant", content: res.text ?? "" });
      messages.push({ role: "user", content: "JSON 파싱 실패. 순수 JSON 배열만 다시 출력하라." });
      console.log(\`♻️ 반려 (\${attempt + 1}차): 파싱 실패\`);
    }
  }
  throw new Error("계약 협상 결렬 — 재시도 소진");
}

// ── 시운전: 조사원에게 '발견 계약'을 강제 ──
const FINDING_CONTRACT: Contract = {
  fields: {
    claim: { type: "string" },                                  // 발견
    evidence: { type: "string" },                               // 근거
    confidence: { type: "string", enum: ["상", "중", "하"] },   // 확신도 — enum이라 '아마도?' 같은 값은 반려됨
    source_id: { type: "string" },                              // 원본 위치! (아래 '위치를 넘겨라' 참고)
  },
  maxItems: 3,
};

const findings = await runWithContract(
  "너는 시장 조사원이다. 원격근무 도구 시장의 핵심 동향을 조사하라. source_id는 'doc-1' 형식의 가상 문서 id로.",
  "핵심 발견 3건",
  FINDING_CONTRACT,
);
console.log("✅ 계약 통과 산출물:");
console.table(findings);
console.log("👉 이제 취합자는 파싱 걱정 없이 findings.map/filter로 기계 처리한다 — 전화 게임 차단.");`,
      hints: [
        "반려 메시지가 '왜 반려됐는지'를 구체적으로 알려주는 것에 주목 — '다시 해'가 아니라 '0번 항목에 confidence 누락'. 검증기의 에러 문자열이 곧 재시도 품질을 결정합니다.",
        "confidence를 enum으로 묶은 이유: 자유 문자열이면 '아마도', '높음', 'high'가 섞여 취합 단계의 필터가 무너져요. 계약은 값의 어휘까지 통제합니다.",
        "maxRetries가 소진되면 throw — C3의 safeRun과 조합하면 '계약 결렬 갈래는 null 처리 + 취합에 명시'가 됩니다. 부품이 맞물리는 것을 느껴보세요.",
      ],
    },
    {
      type: "markdown",
      source: `## 📦 핸드오프의 두 경로 — 메시지 vs 아티팩트

계약된 산출물을 **어떻게 옮길까**에는 두 경로가 있습니다.

| | 메시지 전달 | 아티팩트(파일) 공유 |
|------|------------|--------------------|
| 방식 | 산출물을 다음 에이전트의 프롬프트에 직접 포함 | 산출물을 저장소(파일·DB)에 쓰고 **id만** 전달 |
| 어울림 | 작은 산출물 (표 몇 줄) | 큰 산출물 (원문·코드·데이터) |
| 장점 | 간단, 즉시 | 받는 쪽 책상이 안 넘침 + **원본 보존** |
| 위험 | 크면 책상 폭발 (A1) | 저장소 관리 필요 |

> **"요약을 넘기지 말고 위치를 넘겨라"**
> 위 계약의 \`source_id\`가 바로 이 패턴이에요. 조사원은 요약(claim·evidence)과 함께
> **원본의 위치**를 남깁니다. 검증자(C8)는 평소엔 요약으로 일하다가, 수상하면
> source_id로 원본을 직접 조회 — A4의 진료의뢰서(소견서+필름), A5의 검증 가능성이
> 코드에서 이렇게 구현됩니다.
>
> \`\`\`
> // 아티팩트 저장소의 최소 구현 — Map 하나면 시작할 수 있다
> const artifacts = new Map<string, string>();
> artifacts.set("doc-1", 원문전체);          // 쓰는 쪽
> const 원문 = artifacts.get(f.source_id);  // 검증자가 필요할 때만
> \`\`\``,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C5

1. **반려 루프 관찰**: 계약에 일부러 까다로운 enum(예: confidence를 '상'만 허용)을 걸고 반려가 몇 차까지 가는지 보라. 반려 사유 문구를 모호하게('틀렸음') 바꾸면 재시도 품질이 어떻게 변하는가?
2. **어휘 통제 실험**: confidence의 enum을 풀고 10회 실행해 어떤 값들이 나오는지 수집하라. 자유 어휘가 취합 필터(예: '상'만 채택)를 어떻게 무력화하는지 확인.
3. **아티팩트 왕복**: Map 저장소를 실제로 붙여 조사원이 원문을 저장하고, 검증자가 source_id로 조회해 claim과 대조하는 2단 구조를 지어라 — C8 실전 아크의 예습이다.

> 🎯 **(전부 잊어도 이것만)**
> ## 계약은 강제될 때만 계약이다 — **스키마 + 검증 + 구체적 사유의 반려 재시도.** 값의 어휘(enum)까지 통제해야 취합이 기계가 된다.
> 그리고 큰 것은 옮기지 말고 저장하라 — **요약 + source_id(위치)**, 필요할 때만 원본 조회.

📎 **다음 강 — C6. 시스템 신경계**: 에이전트 다섯이 뛰기 시작하면 '누가 뭘 했는지'가 순식간에 미궁이 됩니다. 트레이스 트리·비용 회계·실패 재현 — "로그가 없으면 조직도 없다"를 구현합니다.`,
    },
  ],

  quiz: {
    title: "고급2·C5강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "'계약은 강제될 때만 계약이다'가 코드에서 뜻하는 것은?",
        options: [
          "스키마를 프롬프트에 정중히 적어두면 충분하다",
          "산출물을 검증기로 검사하고, 위반 시 구체적 사유와 함께 반려·재시도한다",
          "계약서를 PDF로 저장한다",
        ],
        correctIndex: 1,
        explanation:
          "프롬프트의 부탁은 어겨질 수 있어요. 검증 통과까지 반려하는 루프가 있어야 하류(취합)가 파싱 걱정 없이 기계 처리할 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question: "confidence 필드를 자유 문자열이 아닌 enum('상/중/하')으로 묶는 이유는?",
        options: [
          "enum이 더 예뻐서",
          "자유 어휘('아마도', 'high' 등)가 섞이면 취합 단계의 필터가 무너지기 때문",
          "enum은 토큰이 무료라서",
        ],
        correctIndex: 1,
        explanation:
          "계약은 구조뿐 아니라 값의 어휘까지 통제해야 해요. '상'만 채택하는 필터는 어휘가 통일될 때만 작동합니다.",
      },
      {
        type: "multiple-choice",
        question: "'요약을 넘기지 말고 위치를 넘겨라'의 구현은?",
        options: [
          "산출물에 source_id를 포함시키고, 원본은 아티팩트 저장소에 — 검증자가 필요할 때만 조회",
          "모든 에이전트에게 원문 전체를 복사해서 전달",
          "요약도 위치도 넘기지 않고 각자 다시 조사",
        ],
        correctIndex: 0,
        explanation:
          "받는 쪽 책상은 얇게, 그러나 검증 가능성은 보존 — A4 진료의뢰서 패턴의 코드 버전이에요. C8의 적대적 검증이 이 위에서 작동합니다.",
      },
    ],
  } satisfies Quiz,
};
