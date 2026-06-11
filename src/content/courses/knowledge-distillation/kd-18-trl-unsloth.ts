import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 18강 — 실습: TRL & Unsloth (모듈 3 마무리, 외부 Colab #1)
 * 실제 GPU 훈련은 브라우저 불가 → Unsloth 공식 노트북으로 안내. 코드는 '읽기용' 마크다운 블록.
 */
export const kd18: Course = {
  id: "kd-18-trl-unsloth",
  title: "실습: TRL & Unsloth로 첫 파인튜닝",
  subtitle: "무료 Colab에서 진짜 모델을 길들여보기",
  icon: "🛠️",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 22,
  order: 218,
  sections: [
    {
      type: "text",
      content: `# 🛠️ 진짜 도구 — TRL & Unsloth

이제 실제로 파인튜닝을 돌려볼 차례예요. 두 도구를 알면 됩니다.

> 🃏 **HuggingFace TRL**
> 파인튜닝(SFT·DPO 등)을 쉽게 해주는 표준 라이브러리. **\`SFTTrainer\`** 한 줄이면 SFT 파이프라인이 돌아가요.

> 🃏 **Unsloth**
> TRL 위에서 **속도·메모리를 최적화**한 도구. **VRAM 약 70% 절감 · 2배 빠름**. 초보가 **무료 Colab**에서 QLoRA로 7B를 파인튜닝하기에 최적.

> 🃏 **전체 파이프라인 (이 코스의 줄기!)**
> 1. **데이터 준비** — (지시, 답) 쌍을 ChatML/JSONL로 (모듈 5에서 깊게)
> 2. **베이스 모델 로드** — 작은 instruct 모델 + 4비트(QLoRA)
> 3. **LoRA 어댑터 설정** — r=16, α=16
> 4. **\`SFTTrainer\`로 학습** — 2~3 epoch, lr≈2e-4
> 5. **저장·테스트** — 전/후 응답 비교

> ⚠️ **여기서 정직하게**: 실제 GPU 훈련은 **브라우저(이 화면)에서 못 돌려요.** 그래서 아래에 **무료 Colab 노트북**으로 안내합니다. 코드는 먼저 '읽기용'으로 익히고, 실제 실행은 Colab에서!`,
    },
    {
      type: "text",
      title: "📖 코드 미리 읽기 — Unsloth + TRL (Colab에서 실행)",
      content: `아래는 Unsloth로 QLoRA 파인튜닝하는 **핵심 골격**이에요. (이 화면에선 실행되지 않아요 — Colab용)

\`\`\`python
from unsloth import FastLanguageModel
from trl import SFTTrainer, SFTConfig

# 1) 작은 모델을 4비트(QLoRA)로 로드
model, tokenizer = FastLanguageModel.from_pretrained(
    "unsloth/llama-3.1-8b-instruct-bnb-4bit",   # 작은 instruct 모델
    max_seq_length=2048, load_in_4bit=True,      # ← QLoRA(17강)
)

# 2) LoRA 어댑터 붙이기 (16강)
model = FastLanguageModel.get_peft_model(
    model, r=16, lora_alpha=16,                  # 포스트잇 랭크/세기
    target_modules=["q_proj","k_proj","v_proj","o_proj"],
)

# 3) 내 데이터로 SFT (모듈 5에서 만든 (지시,답) 데이터)
trainer = SFTTrainer(
    model=model, tokenizer=tokenizer, train_dataset=my_dataset,
    args=SFTConfig(num_train_epochs=2, learning_rate=2e-4, per_device_train_batch_size=2),
)
trainer.train()      # ← 무료 Colab GPU에서 몇 시간
model.save_pretrained("my-finetuned-adapter")   # 어댑터만 저장 (작음!)
\`\`\`

> 🔍 보이나요? 우리가 배운 게 다 들어있어요 — **4비트(QLoRA·17강) + LoRA 어댑터(16강) + SFTTrainer(SFT·12강)**. 개념을 알면 코드가 읽혀요!`,
    },
    {
      type: "link",
      title: "🚀 직접 실행 — Unsloth 공식 무료 Colab 노트북",
      content: "아래 Unsloth 공식 노트북 모음에서 'Llama 3.1 (8B)' 같은 걸 골라 'Open in Colab' → 위 골격 그대로 무료 GPU에서 돌려볼 수 있어요. (구글 계정만 있으면 무료)",
      linkUrl: "https://docs.unsloth.ai/get-started/unsloth-notebooks",
      linkLabel: "Unsloth 공식 노트북 모음 (Colab)",
    },
    {
      type: "text",
      content: `> 🎯 **(모듈 3 마무리)**
> - **TRL \`SFTTrainer\`** = 표준 파인튜닝, **Unsloth** = 빠르고 가벼운(무료 Colab) 버전.
> - 파이프라인: 데이터 → 4비트 로드 → LoRA → 학습 → 저장. **우리가 배운 개념이 그대로 코드로**.
> - 실제 훈련은 **무료 Colab**에서(브라우저는 개념·데이터까지).

🎉 **모듈 3 완료!** SFT의 정통(FFT)부터 효율 기법(LoRA·QLoRA), 실제 도구(TRL·Unsloth)까지 봤어요.
다음 **모듈 4**에서는 더 강력한 PEFT 기법들(**LoRA+ · DoRA · AdaLoRA**)과 **데이터 합성 자동화**로 들어갑니다.`,
    },
  ],
  quiz: {
    title: "18강 — TRL & Unsloth 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "HuggingFace TRL의 SFTTrainer는?",
        options: [
          "SFT 파이프라인을 쉽게 돌려주는 표준 도구",
          "모델을 삭제하는 도구",
          "데이터를 만드는 도구",
        ],
        correctIndex: 0,
        explanation:
          "TRL의 SFTTrainer는 데이터·모델·설정만 주면 SFT 학습을 돌려주는 표준 라이브러리예요. Unsloth는 그 위에서 속도·메모리를 최적화합니다.",
      },
      {
        type: "multiple-choice",
        question: "Unsloth의 강점은?",
        options: [
          "VRAM ~70% 절감·2배 빠름 → 무료 Colab에서 QLoRA 파인튜닝 가능",
          "인터넷이 필요 없음",
          "데이터가 필요 없음",
        ],
        correctIndex: 0,
        explanation:
          "Unsloth는 메모리·속도를 최적화해 초보도 무료 Colab GPU에서 7B를 QLoRA로 파인튜닝할 수 있게 해줘요.",
      },
      {
        type: "multiple-choice",
        question: "실제 GPU 파인튜닝을 이 강의 화면(브라우저)에서 못 하는 이유는?",
        options: [
          "브라우저엔 GPU·딥러닝 프레임워크 훈련 환경이 없어서 → 무료 Colab으로 실행",
          "파인튜닝이 불법이라서",
          "데이터가 없어서",
        ],
        correctIndex: 0,
        explanation:
          "브라우저(Pyodide)에선 개념·데이터 실습까지 가능하지만 실제 대형 모델 GPU 훈련은 불가해요. 그래서 무료 Colab 노트북으로 안내합니다(정직 원칙).",
      },
    ],
  } satisfies Quiz,
};
