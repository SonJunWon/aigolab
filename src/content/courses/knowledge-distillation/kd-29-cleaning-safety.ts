import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 29강 — 데이터 정제·필터링 ② 독성·편향·다양성·도메인 (모듈 5)
 * 안전·균형 필터. 코드 검증: 로컬 통과(도메인 쏠림 71% 경고 + 어휘 다양성).
 */
export const kd29: Course = {
  id: "kd-29-cleaning-safety",
  title: "데이터 정제 ② — 독성·편향·다양성",
  subtitle: "안전하고 균형 잡힌 '영양 균형' 데이터",
  icon: "⚖️",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 229,
  sections: [
    {
      type: "text",
      content: `# ⚖️ 정제 라인 ② — 내용·균형 차원

형식 필터(28강)를 넘으면, 이제 **내용과 균형**을 봐야 해요. 모델은 데이터를 **그대로 닮기** 때문이에요.

> 🃏 **내용·균형 필터 4종**
> - **① 독성(toxicity)**: 혐오·폭력·비하 표현 제거 → 모델이 따라 배우지 않게(**안전**).
> - **② 편향(bias)**: 특정 성별·지역·집단에 치우친 표현·관점 점검.
> - **③ 다양성(diversity)**: 표현·주제가 너무 비슷하면 모델이 **편협**해짐 → 어휘·패턴 다양성 확보.
> - **④ 도메인 균형(domain balance)**: 한 도메인이 **과대표집**되면 다른 영역에서 약해짐 → 분포 점검·보강.

> 🪄 **비유**: 식단의 **영양 균형**. 상한 음식(독성) 빼고, 한 음식만 잔뜩(도메인 쏠림) 말고, 골고루(다양성) 먹어야 건강하죠.

> 🔑 **"Garbage in, garbage out"의 강화판**: 독성·편향 데이터는 단순 노이즈가 아니라 모델의 **태도와 안전성**까지 망가뜨려요. 정렬(alignment)의 출발점이 깨끗한 데이터입니다.`,
    },
    {
      type: "code",
      title: "🧪 독성 필터 + 도메인 쏠림·다양성 점검",
      content: `데이터의 **도메인 분포(쏠림)**, **독성 필터**, **어휘 다양성**을 한 번에 점검해요. \`▶ 실행\``,
      code: `from collections import Counter

data = [
    ("코드", "리스트를 정렬하라"), ("코드", "이진탐색 구현"), ("코드", "재귀로 팩토리얼"),
    ("코드", "버블정렬 작성"),     ("코드", "큐 구현"),
    ("수학", "미분을 설명하라"),   ("상식", "한국의 수도는?"),
]

# ① 도메인 분포(쏠림 점검)
dist = Counter(d for d, _ in data)
n = len(data)
print("도메인 분포:", dict(dist))
top_domain, top_cnt = dist.most_common(1)[0]
ratio = top_cnt / n
flag = "⚠️ 쏠림(보강 필요)" if ratio > 0.5 else "OK(균형)"
print(f"  최다 도메인 '{top_domain}' {ratio*100:.0f}% → {flag}")

# ② 독성 필터
TOXIC = ["혐오", "폭력", "비하", "차별"]
clean = [(d, t) for d, t in data if not any(w in t for w in TOXIC)]
print(f"\\n독성 필터: {len(data)} → {len(clean)} (이 토이엔 독성 없음)")

# ③ 어휘 다양성(고유 토큰 / 전체 토큰, 1에 가까울수록 다양)
words = [w for _, t in data for w in t.split()]
diversity = len(set(words)) / len(words)
print(f"어휘 다양성: {diversity:.2f}  (1에 가까울수록 다양)")
print("\\n👉 안전(독성)·균형(도메인)·다양성을 함께 봐야 '영양 균형' 데이터")`,
      codeLanguage: "python",
      codeHint: "data에 '코드' 예시를 더 넣어 쏠림을 키우거나, 다른 도메인을 추가해 균형을 맞춰보세요. 쏠림 임계값(0.5)도 바꿔 경고가 어떻게 달라지는지 확인!",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - 내용·균형 필터: **독성(안전) · 편향 · 다양성 · 도메인 균형**.
> - 모델은 데이터를 **그대로 닮음** → 독성·편향은 노이즈를 넘어 **태도·안전성**을 망침.
> - 한 도메인 **과대표집**·낮은 다양성은 **편협한 모델**을 만든다 → 분포·다양성 점검·보강.

형식(28강)과 내용·균형(29강) 필터를 모두 익혔어요. 다음 강은 모듈 5의 마무리 — **수집→정제→ChatML/JSONL→분할까지 end-to-end 파이프라인**을 한 번에 돌립니다. 🏭`,
    },
  ],
  quiz: {
    title: "29강 — 데이터 정제 ② 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "독성(toxicity) 필터가 중요한 이유는?",
        options: [
          "용량을 줄이려고",
          "모델이 혐오·폭력 표현을 그대로 따라 배우지 않게(안전) 하려고",
          "독성 데이터가 성능을 높여서",
        ],
        correctIndex: 1,
        explanation:
          "모델은 데이터를 그대로 닮아요. 독성·편향 데이터는 단순 노이즈를 넘어 모델의 태도와 안전성을 망가뜨리므로 반드시 걸러야 합니다.",
      },
      {
        type: "multiple-choice",
        question: "한 도메인이 과대표집(쏠림)되면 생기는 문제는?",
        options: [
          "모든 영역에서 똑같이 좋아진다",
          "다른 도메인에서 약해지는 편협한 모델이 된다",
          "아무 영향이 없다",
        ],
        correctIndex: 1,
        explanation:
          "한 도메인 데이터만 많으면 그쪽에 치우쳐 다른 영역 성능이 떨어져요. 도메인 분포를 점검하고 부족한 쪽을 보강해야 합니다.",
      },
      {
        type: "multiple-choice",
        question: "데이터 다양성이 낮으면?",
        options: [
          "모델이 더 일반화를 잘한다",
          "표현·패턴이 비슷해 모델이 편협해진다",
          "다양성은 품질과 무관하다",
        ],
        correctIndex: 1,
        explanation:
          "표현과 주제가 너무 비슷하면 모델이 좁은 패턴만 배워 편협해져요. 어휘·패턴 다양성을 확보해야 폭넓게 일반화합니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-30-pipeline",
};
