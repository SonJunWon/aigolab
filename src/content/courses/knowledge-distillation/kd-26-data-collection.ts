import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 26강 — 데이터 수집·구축 전략 (모듈 5)
 * 출처·사람vs합성·라이선스·데이터 누수. 코드 검증: 로컬 통과(정규화 누수 탐지 + 체크리스트).
 */
export const kd26: Course = {
  id: "kd-26-data-collection",
  title: "데이터 수집·구축 전략",
  subtitle: "재료를 어디서, 어떻게 구하나",
  icon: "🧺",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 226,
  sections: [
    {
      type: "text",
      content: `# 🧺 좋은 재료 구하기 — 출처·합성·함정

데이터를 모으는 길은 크게 셋. 각자 장단이 있어요.

> 🃏 **데이터 출처 3가지**
> - **① 사람 제작(human)**: 품질·신뢰 높음, **비싸고 느림**. (전문가 작성·검수)
> - **② 합성(synthetic, 교사 LLM)**: 빠르고 대량(모듈 4의 Self/Evol-Instruct), 단 **교사 오류·편향 복제** 위험.
> - **③ 공개 데이터셋(HF Hub 등)**: 즉시 사용, 단 **라이선스·품질·중복**을 꼭 확인.
> → 실무는 보통 **합성으로 양 확보 + 사람 검수로 품질 보증** 의 하이브리드.

> ⚠️ **세 가지 치명적 함정**
> - **라이선스**: 상업적 사용 가능한지, 출처 모델의 약관 위반은 아닌지.
> - **데이터 누수(leakage)**: **평가셋이 학습셋에 섞이면** 점수가 부풀려져요(= 시험 문제 유출). 가장 흔하고 치명적인 실수.
> - **개인정보·저작권**: 민감정보·저작물이 그대로 들어가지 않게.

> 🪄 **비유**: 요리 재료를 **직접 기르기(사람)** / **공장에서 받기(합성)** / **마트에서 사기(공개셋)**. 어느 쪽이든 **유통기한·원산지(라이선스)** 와 **상한 것(누수)** 은 반드시 확인.`,
    },
    {
      type: "code",
      title: "🧪 데이터 누수 탐지 + 설계 체크리스트",
      content: `train과 test에 같은 예시가 섞였는지(정규화 후 비교) 잡아내고, 데이터셋 설계 체크리스트를 점검해요. \`▶ 실행\``,
      code: `def norm(s):                       # 간이 정규화(공백·대소문자 무시)
    return " ".join(s.lower().split())

train = ["파이썬에서 리스트를 정렬하라", "이진 탐색을 구현하라", "문자열을 뒤집어라"]
test  = ["문자열을 뒤집어라", "  파이썬에서   리스트를 정렬하라 ", "큐를 구현하라"]

train_keys = {norm(x) for x in train}
leaked = [x for x in test if norm(x) in train_keys]   # 정규화 후 겹치면 누수
print(f"train {len(train)}개 / test {len(test)}개")
print(f"🚨 누수된 test 예시: {leaked}")
print(f"→ {len(leaked)}건 유출! 공백·대소문자만 달라도 '같은 문제'예요. 평가 전 반드시 제거.")

print("\\n[체크리스트] 좋은 SFT 데이터셋 설계")
checks = {
    "출처 명확·라이선스 OK": True,
    "사람/합성 비율 기록": True,
    "train↔test 누수 제거": len(leaked) == 0,
    "개인정보·저작권 점검": True,
}
for k, ok in checks.items():
    print(f"  [{'O' if ok else 'X'}] {k}")
print("→ '누수 제거'가 X. 겹친 예시를 빼야 통과 = 정직한 평가의 첫걸음")`,
      codeLanguage: "python",
      codeHint: "norm() 정규화를 더 강하게(문장부호 제거 등) 만들면 더 미묘한 누수도 잡아요. 실무에선 임베딩 유사도로 '거의 같은' 예시까지 탐지합니다.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - 출처: **사람(고품질·고비용)·합성(빠름·오류복제)·공개셋(즉시·라이선스주의)** → 보통 하이브리드.
> - 3대 함정: **라이선스 · 데이터 누수 · 개인정보/저작권**.
> - **누수**가 가장 흔하고 치명적 — 정규화 후 train↔test 겹침을 꼭 제거.

이제 실제로 데이터를 **만들어** 봅시다. 다음 강은 **교사 LLM으로 생성하고 즉시 품질 게이트로 거르는** 실습입니다. 🚪`,
    },
  ],
  quiz: {
    title: "26강 — 데이터 수집 전략 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "합성 데이터(교사 LLM 생성)의 주의점은?",
        options: [
          "항상 사람 데이터보다 품질이 높다",
          "빠르고 대량이지만 교사의 오류·편향이 복제될 수 있다",
          "라이선스 걱정이 전혀 없다",
        ],
        correctIndex: 1,
        explanation:
          "합성은 빠르고 양이 많지만 교사 모델의 오류·편향을 그대로 복제할 위험이 있어요. 그래서 사람 검수나 품질 게이트와 함께 씁니다.",
      },
      {
        type: "multiple-choice",
        question: "데이터 누수(leakage)란?",
        options: [
          "데이터가 디스크에서 사라지는 것",
          "평가셋이 학습셋에 섞여 점수가 부풀려지는 것",
          "데이터가 너무 적은 것",
        ],
        correctIndex: 1,
        explanation:
          "평가 예시가 학습에 섞이면 '시험 문제를 미리 본' 셈이라 점수가 과대평가돼요. 공백·대소문자만 다른 경우도 같은 문제로 봐야 합니다.",
      },
      {
        type: "multiple-choice",
        question: "공개 데이터셋을 쓸 때 반드시 확인할 것은?",
        options: [
          "색깔",
          "라이선스(상업적 사용 가능 여부)·품질·중복",
          "파일 이름",
        ],
        correctIndex: 1,
        explanation:
          "공개셋은 즉시 쓸 수 있어 편하지만 라이선스·품질·중복을 확인하지 않으면 법적·품질 문제가 생겨요.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-27-llm-generation-gate",
};
