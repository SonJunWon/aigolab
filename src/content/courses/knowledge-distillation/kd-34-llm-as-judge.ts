import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 34강 — LLM-as-a-Judge & 마무리 (모듈 6·코스 2 대미)
 * 평가 루브릭·편향, 파인튜닝 vs RAG vs 프롬프트, 전체 정리·다음 코스 예고. AI-try 마크다운.
 */
export const kd34: Course = {
  id: "kd-34-llm-as-judge",
  title: "LLM-as-a-Judge & 코스 마무리",
  subtitle: "심사위원 AI로 평가하기 — 단, 편향을 조심",
  icon: "⚖️",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 22,
  order: 234,
  sections: [
    {
      type: "text",
      content: `# ⚖️ 잘 됐을까? — LLM이 채점관이 되다

파인튜닝을 했으면 **평가**가 남아요. 그런데 "응답이 좋다"는 정답 라벨이 없죠. 그래서 **LLM-as-a-Judge** — 강한 LLM에게 **루브릭(채점 기준)** 을 주고 출력을 채점시켜요.

> 🃏 **LLM-as-a-Judge**
> "정확성·완결성·형식을 0~2점으로 매겨라" 같은 **루브릭**을 주고, 판정 LLM이 출력에 점수/순위를 매기게 하는 평가법. 사람 평가보다 **싸고 빠르게** 대량 평가 가능.

> ⚠️ **심사위원 AI의 3대 편향(꼭 조심!)**
> - **길이 편향**: 내용과 무관하게 **긴 답을 더 높게**.
> - **위치 편향**: A/B 비교 시 **먼저 나온 답을 선호** → 순서만 바꿔도 결과가 달라짐.
> - **자기 선호**: 판정 모델이 **자기(같은 모델)가 쓴 답에 후하게**.

> 🃏 **편향 줄이는 법**: 순서를 **바꿔 두 번** 평가(위치 편향), 루브릭을 **구체적으로**, 길이 제한 명시, **다른 모델**을 심사위원으로.

> 🪄 **비유**: 빠르고 유능한 심사위원이지만 **버릇(편향)** 이 있어요. 그 버릇을 알고 견제해야 공정한 채점이 됩니다.`,
    },
    {
      type: "code",
      title: "🧪 루브릭 채점 + 의사결정 체크리스트",
      content: `루브릭으로 후보를 채점하고, 심사위원 편향과 **"파인튜닝 vs RAG vs 프롬프트"** 의사결정 기준을 정리해요. \`▶ 실행\``,
      code: `# 루브릭 채점(0~2): 코드 포함 +1, 완결성 +1
def judge(has_code, complete):
    return (1 if has_code else 0) + (1 if complete else 0)

cands = [
    ("A", "def f(x): return sorted(x)", True, True),
    ("B", "정렬은 sorted를 쓰면 됩니다", False, True),
    ("C", "def f(x): return sorted(x)  # 단계별 설명 포함", True, True),
]
print("[루브릭 채점]")
for name, ans, code, comp in cands:
    print(f"  {name}: {judge(code, comp)}점  | {ans[:28]}")

print("\\n[⚠️ 심사위원 AI 3대 편향]")
for k, v in {
    "길이 편향": "긴 답을 무조건 더 높게(내용 무관)",
    "위치 편향": "먼저 제시된 답을 선호(순서 바꾸면 결과 달라짐)",
    "자기 선호": "자기가 쓴 답을 후하게",
}.items():
    print(f"  - {k}: {v}")

print("\\n[의사결정] 파인튜닝 vs RAG vs 프롬프트")
for need, ans in {
    "말투·형식·도메인 정렬": "파인튜닝(SFT)",
    "최신·방대한 사실 필요": "RAG(코스 5)",
    "1회성·간단 지시": "프롬프트",
}.items():
    print(f"  '{need}' → {ans}")`,
      codeLanguage: "python",
      codeHint: "judge에 '길이 점수'를 추가해보면 길이 편향이 어떻게 생기는지 체감돼요. 실무에선 A/B 순서를 바꿔 두 번 평가해 위치 편향을 상쇄합니다.",
    },
    {
      type: "text",
      title: "🙋 직접 해보기 + 🎓 코스 2 전체 정리",
      content: `> 📋 **AI로 위치 편향 직접 확인** (ChatGPT·Claude 등에)
> \`\`\`
> 두 답변 중 더 나은 것을 골라줘.
> [답1] (짧고 정확) ... / [답2] (길지만 군더더기) ...
> 그다음, 답의 순서만 바꿔서 다시 물어봐: 결과가 바뀌나요?
> \`\`\`
> 순서만 바꿔도 판정이 달라지면 = **위치 편향**을 직접 본 거예요.

---

> 🎓 **코스 2 「지식 증류」 전체 그림**
> 1. **증류 & Scaling**(모듈 1): 교사→학생 압축, 소프트라벨·온도·KL, Scaling Law.
> 2. **MoE & SFT 개념**(모듈 2): 총/활성 분리, 후처리에서 SFT의 자리.
> 3. **SFT 일반**(모듈 3): FFT vs PEFT, LoRA·QLoRA, TRL·Unsloth.
> 4. **SFT 심화**(모듈 4): 하이퍼파라미터·LoRA+·DoRA·AdaLoRA·어댑터 운용.
> 5. **데이터 구축**(모듈 5): LIMA(품질>양), 수집·생성·정제·파이프라인.
> 6. **최종 실습·평가**(모듈 6): TRL 종합·Instruction Tuning·망각 방지·LLM-as-Judge.
>
> 🧵 **관통 한 줄**: *작은 모델로 큰 모델의 능력을 — 증류로 옮기고, SFT로 새기고, 좋은 데이터가 재료.*

> 🎯 **(코스 마무리)**
> - **LLM-as-Judge**: 루브릭으로 싸고 빠른 평가. 단, **길이·위치·자기선호 편향** 견제.
> - **언제 무엇**: 정렬→파인튜닝, 최신·방대 사실→RAG, 1회성→프롬프트.

🎉 **코스 2 「지식 증류」 34강 완주!** 작은 모델을 똑똑하게 만드는 전 과정을 손에 넣었어요.
다음 여정 — **코스 4 「양자화」**(모델을 더 가볍게)와 **코스 5 「지식 증강(RAG)」**(모델 밖 지식으로 더 정확하게)에서 이어집니다. 수고했어요! 👏`,
    },
  ],
  quiz: {
    title: "34강 — LLM-as-Judge & 마무리 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "LLM-as-a-Judge의 장점은?",
        options: [
          "항상 사람보다 완벽하게 공정하다",
          "루브릭을 주면 사람 평가보다 싸고 빠르게 대량 평가할 수 있다",
          "편향이 전혀 없다",
        ],
        correctIndex: 1,
        explanation:
          "강한 LLM에 채점 기준(루브릭)을 주면 대량 평가를 싸고 빠르게 할 수 있어요. 다만 편향이 있어 견제가 필요합니다.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 LLM 심사위원의 대표적 편향이 아닌 것은?",
        options: [
          "긴 답을 더 높게 보는 길이 편향",
          "먼저 나온 답을 선호하는 위치 편향",
          "정답 라벨을 그대로 베끼는 편향",
        ],
        correctIndex: 2,
        explanation:
          "LLM-as-Judge의 대표 편향은 길이·위치·자기선호예요. '정답 라벨 베끼기'는 애초에 정답 라벨이 없어 Judge를 쓰는 상황과 맞지 않습니다.",
      },
      {
        type: "multiple-choice",
        question: "'최신·방대한 사실'이 필요할 때 가장 적합한 방법은?",
        options: [
          "파인튜닝(SFT)으로 모두 욱여넣기",
          "RAG(검색 결합, 코스 5)",
          "프롬프트 한 줄",
        ],
        correctIndex: 1,
        explanation:
          "방대·최신 사실은 파인튜닝으로 주입하기보다 RAG로 외부 지식을 검색해 쓰는 게 효율적이에요. 파인튜닝은 말투·형식·도메인 정렬에 적합합니다.",
      },
    ],
  } satisfies Quiz,
};
