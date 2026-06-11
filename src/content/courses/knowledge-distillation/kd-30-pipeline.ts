import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 30강 — 데이터 구축 파이프라인 종합 (모듈 5 마무리)
 * 수집→정제→ChatML/JSONL→train/val 검증. 코드 검증: 로컬 통과(5→정제3→split→JSONL 파싱 OK).
 */
export const kd30: Course = {
  id: "kd-30-pipeline",
  title: "실습: 데이터 구축 파이프라인 종합",
  subtitle: "수집→정제→ChatML/JSONL→분할, 한 바퀴",
  icon: "🏭",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 24,
  order: 230,
  sections: [
    {
      type: "text",
      content: `# 🏭 데이터 공장 — end-to-end 한 바퀴

모듈 5에서 배운 조각들(품질·수집·생성·정제)을 **하나의 파이프라인**으로 잇습니다. 이게 모듈 6의 실제 훈련에 넣을 **완제품 데이터**를 만들어요.

> 🃏 **파이프라인 4단계**
> 1. **수집(collect)**: 원천 (지시, 응답) 모으기(사람·합성·공개셋).
> 2. **정제(clean)**: dedup·length·rule·독성·균형 필터(28·29강).
> 3. **포맷(format)**: 훈련 도구가 먹는 형태로 — **ChatML**(role: user/assistant) → **JSONL**(한 줄 = 한 샘플).
> 4. **분할·검증(split & validate)**: **train/val** 로 나누고, 모든 줄이 **JSON으로 파싱되고 역할 순서가 맞는지** 확인.

> 🃏 **ChatML & JSONL이 뭐였죠?**
> - **ChatML**: 대화를 \`{"role": "user", ...}\`, \`{"role": "assistant", ...}\` 메시지 배열로 표현하는 표준 형식.
> - **JSONL**: 한 줄에 JSON 하나씩(JSON **L**ines). TRL·Unsloth 같은 도구가 바로 읽어요.

> 🪄 **비유**: 식재료 **손질→포장 라인**. 재료를 받아 다듬고(정제), 규격 용기에 담아(ChatML/JSONL), 검수 도장(검증)을 찍어 출하.`,
    },
    {
      type: "code",
      title: "🧪 수집 → 정제 → ChatML/JSONL → 분할 → 검증",
      content: `원천 데이터 5개를 받아 정제하고, ChatML→JSONL로 만들고, train/val로 나눈 뒤 **파싱·형식 검증**까지 한 번에 돌려요. \`▶ 실행\``,
      code: `import json

# 1) 수집된 원천 (지시, 응답)
raw = [
    ("리스트 합", "def s(x): return sum(x)"),
    ("리스트 합", "def s(x): return sum(x)"),      # 중복
    ("평균", "ok"),                                 # 너무 짧음
    ("정렬", "def so(x): return sorted(x)"),
    ("최댓값", "def mx(x): return max(x)"),
]

# 2) 정제: dedup + length
seen, clean = set(), []
for ins, out in raw:
    if (ins, out) in seen or len(out) < 10:
        continue
    seen.add((ins, out)); clean.append((ins, out))
print(f"① 수집 {len(raw)} → ② 정제 {len(clean)}")

# 3) 포맷: ChatML (JSONL 한 줄 = 한 샘플)
def to_chatml(ins, out):
    return {"messages": [
        {"role": "user", "content": ins},
        {"role": "assistant", "content": out},
    ]}
records = [to_chatml(i, o) for i, o in clean]

# 4) 분할: train/val 80/20
k = max(1, int(len(records) * 0.8))
train, val = records[:k], records[k:]
print(f"③ ChatML 변환 → ④ 분할: train {len(train)} / val {len(val)}")

# 5) JSONL 직렬화 + 검증(모든 줄 파싱 가능?·역할 순서 맞나?)
jsonl = "\\n".join(json.dumps(r, ensure_ascii=False) for r in train)
print("\\n[train.jsonl 미리보기]")
print(jsonl)
ok = all(json.loads(line)["messages"][0]["role"] == "user"
         for line in jsonl.split("\\n"))
print(f"\\n⑤ 검증: 모든 줄 JSON 파싱 + 역할순서(user→assistant) OK = {ok}")
print("→ 수집→정제→ChatML/JSONL→분할→검증, '데이터 공장' 완성 🏭 (모듈 6 훈련 투입 준비 끝)")`,
      codeLanguage: "python",
      codeHint: "raw에 불량 데이터(빈 응답·중복)를 더 넣어 정제가 잘 걸러내는지 보세요. 분할 비율(0.8)을 바꿔 train/val 수가 어떻게 변하는지도 확인!",
    },
    {
      type: "text",
      content: `> 🎯 **(모듈 5 마무리)**
> - 파이프라인: **수집 → 정제 → ChatML/JSONL → train/val 분할 → 검증**.
> - **ChatML**(role 메시지) + **JSONL**(한 줄=한 샘플) = 훈련 도구 표준 입력.
> - 마지막 **검증**(파싱·역할 순서)으로 깨진 데이터를 출하 전 차단.

🎉 **모듈 5 완료!** LIMA(품질>양)부터 수집·생성·정제·파이프라인까지, **고품질 SFT 데이터 만드는 법**을 모두 익혔어요.
이제 재료가 준비됐으니, 다음 **모듈 6**에서 이 데이터로 **실제 훈련(TRL)·Instruction Tuning·LLM-as-Judge 평가**까지 — 코스 2의 대미를 장식합니다. 🍳`,
    },
  ],
  quiz: {
    title: "30강 — 데이터 파이프라인 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "데이터 구축 파이프라인의 일반적 단계 순서는?",
        options: [
          "분할 → 수집 → 검증 → 정제",
          "수집 → 정제 → 포맷(ChatML/JSONL) → 분할 → 검증",
          "검증 → 포맷 → 수집 → 정제",
        ],
        correctIndex: 1,
        explanation:
          "원천을 모으고(수집), 필터로 다듬고(정제), 훈련 도구가 먹는 형태로 바꾸고(ChatML/JSONL), train/val로 나눈 뒤(분할), 마지막에 검증합니다.",
      },
      {
        type: "multiple-choice",
        question: "JSONL 형식의 특징은?",
        options: [
          "한 파일에 JSON 하나만 담는다",
          "한 줄에 JSON 하나씩(한 줄 = 한 샘플) 담는다",
          "JSON을 쓸 수 없는 형식이다",
        ],
        correctIndex: 1,
        explanation:
          "JSONL(JSON Lines)은 한 줄에 JSON 하나씩 담는 형식이에요. 한 줄이 한 학습 샘플이라 TRL·Unsloth 같은 도구가 바로 읽습니다.",
      },
      {
        type: "multiple-choice",
        question: "파이프라인 마지막 '검증' 단계가 하는 일은?",
        options: [
          "데이터를 더 많이 생성한다",
          "모든 줄이 JSON으로 파싱되고 역할 순서 등 형식이 맞는지 확인한다",
          "모델을 훈련한다",
        ],
        correctIndex: 1,
        explanation:
          "출하 전 검증으로 깨진 JSON·잘못된 역할 순서 같은 형식 오류를 차단해요. 그래야 훈련 단계에서 데이터 문제로 실패하지 않습니다.",
      },
    ],
  } satisfies Quiz,
};
