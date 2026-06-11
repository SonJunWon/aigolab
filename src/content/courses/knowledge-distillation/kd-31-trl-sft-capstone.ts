import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 31강 — 실습: TRL로 SFT 종합 (모듈 6 시작, 외부 Colab #2)
 * 모듈 5 데이터로 SFTTrainer 한 바퀴. 실제 GPU 훈련은 브라우저 불가 → 읽기용 코드 + Colab 링크.
 */
export const kd31: Course = {
  id: "kd-31-trl-sft-capstone",
  title: "실습: TRL로 SFT 종합 — 재료 끝, 이제 요리",
  subtitle: "모듈 5에서 만든 내 데이터로 진짜 훈련 한 바퀴",
  icon: "🍳",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 24,
  order: 231,
  sections: [
    {
      type: "text",
      content: `# 🍳 모듈 6 — 재료(데이터)가 끝났으니 요리(훈련)

모듈 5에서 **고품질 데이터(train.jsonl)** 를 만들었어요. 이제 그 데이터로 **실제 SFT** 를 돌려 모듈 1~5의 모든 개념을 하나로 합칩니다.

> 🃏 **이번 실습이 합치는 것 (코스 전체!)**
> - **데이터**(모듈 5의 ChatML/JSONL) → **베이스 4비트 로드**(QLoRA·17강) → **LoRA 어댑터**(16·19강) → **\`SFTTrainer\`** (SFT·12강) → **전/후 비교**(13강).
> - 18강에서 '읽기'로 익힌 코드를, 이번엔 **내가 만든 데이터**로 돌리는 게 차이예요.

> ⚠️ **다시, 정직하게**: 실제 GPU 훈련은 **이 브라우저에서 못 돌려요.** 아래 코드는 '읽기용'으로 흐름을 익히고, 실행은 **무료 Colab**에서 합니다(18강과 동일한 정직 원칙).`,
    },
    {
      type: "text",
      title: "📖 코드 읽기 — 내 데이터로 SFTTrainer (Colab에서 실행)",
      content: `모듈 5에서 만든 \`train.jsonl\` 을 그대로 먹이는 **종합 레시피**예요. (이 화면에선 실행되지 않아요 — Colab용)

\`\`\`python
from unsloth import FastLanguageModel
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

# 0) 모듈 5에서 만든 내 데이터 (ChatML JSONL)
dataset = load_dataset("json", data_files="train.jsonl", split="train")

# 1) 베이스를 4비트로 로드 (QLoRA · 17강)
model, tokenizer = FastLanguageModel.from_pretrained(
    "unsloth/llama-3.1-8b-instruct-bnb-4bit",
    max_seq_length=2048, load_in_4bit=True,
)

# 2) LoRA 어댑터 (16·19강의 하이퍼파라미터!)
model = FastLanguageModel.get_peft_model(
    model, r=16, lora_alpha=16,                      # rank·alpha (19강)
    target_modules=["q_proj","k_proj","v_proj","o_proj"],
)

# 3) 내 데이터로 SFT (12강 SFTTrainer)
trainer = SFTTrainer(
    model=model, tokenizer=tokenizer, train_dataset=dataset,
    args=SFTConfig(num_train_epochs=2, learning_rate=2e-4,   # epoch·lr (19강)
                   per_device_train_batch_size=2),
)
trainer.train()                                      # ← 무료 Colab GPU

# 4) 전/후 비교 후 어댑터 저장 (작음!)
model.save_pretrained("my-course2-adapter")
\`\`\`

> 🔍 보이나요? **데이터(모듈5) + QLoRA(17) + LoRA 하이퍼파라미터(19) + SFTTrainer(12)** — 코스 2 전체가 이 한 화면에 압축돼 있어요. 개념을 알면 코드가 술술 읽힙니다.`,
    },
    {
      type: "link",
      title: "🚀 직접 실행 — Unsloth 공식 무료 Colab 노트북",
      content: "아래 노트북에서 모델을 고르고 'Open in Colab' → 데이터 부분만 내 train.jsonl 로 바꾸면 위 레시피가 그대로 돌아가요. (구글 계정만 있으면 무료 GPU)",
      linkUrl: "https://docs.unsloth.ai/get-started/unsloth-notebooks",
      linkLabel: "Unsloth 공식 노트북 모음 (Colab)",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - 모듈 5 데이터 → 4비트 로드 → LoRA → \`SFTTrainer\` → 저장. **코스 2 전체의 결합**.
> - 18강은 '예시 데이터', 31강은 '내가 만든 데이터' — 데이터가 결과를 좌우.
> - 실제 훈련은 **무료 Colab**(브라우저는 개념·데이터까지).

훈련을 돌렸으니, 이제 **무엇이 어떻게 좋아졌는지** 봐야겠죠. 다음 강 **Instruction Tuning** 으로 '지시를 따르게' 만드는 정렬을 들여다봅니다. 🗣️`,
    },
  ],
  quiz: {
    title: "31강 — TRL SFT 종합 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "이 종합 실습이 입력으로 쓰는 데이터는?",
        options: [
          "아무 데이터나 랜덤으로",
          "모듈 5에서 수집·정제·포맷한 ChatML/JSONL 데이터",
          "데이터 없이 훈련",
        ],
        correctIndex: 1,
        explanation:
          "31강은 모듈 5에서 만든 고품질 train.jsonl(ChatML)을 SFTTrainer에 먹여요. 좋은 데이터가 좋은 결과의 재료입니다.",
      },
      {
        type: "multiple-choice",
        question: "실제 GPU 훈련을 브라우저에서 못 하는 이유와 대안은?",
        options: [
          "훈련이 불법이라 — 대안 없음",
          "브라우저엔 GPU 훈련 환경이 없어서 — 무료 Colab으로 실행",
          "데이터가 없어서 — 그냥 포기",
        ],
        correctIndex: 1,
        explanation:
          "브라우저(Pyodide)는 개념·데이터 실습까지예요. 대형 모델 GPU 훈련은 무료 Colab 노트북에서 합니다(정직 원칙).",
      },
      {
        type: "multiple-choice",
        question: "레시피에서 load_in_4bit=True 와 LoRA 어댑터가 함께 쓰인 이유는?",
        options: [
          "베이스를 4비트로 압축(QLoRA)하고 작은 어댑터만 학습해 무료 Colab에서도 가능하게",
          "정확도를 일부러 낮추려고",
          "데이터를 늘리려고",
        ],
        correctIndex: 0,
        explanation:
          "4비트 로드(QLoRA·17강)로 메모리를 줄이고 작은 LoRA 어댑터(16·19강)만 학습하면, 무료 Colab GPU로도 큰 모델을 파인튜닝할 수 있어요.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-32-instruction-tuning",
};
