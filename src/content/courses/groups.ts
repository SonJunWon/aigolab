import type { CourseGroup } from "../../types/course";

/** 코스 0(AI 살펴보기)에 속한 기존 이론 강의 10강(고정 목록).
 *  ⚠️ COURSES 전체를 넣으면 이후 다른 그룹(예: 지식 증류) 강의까지 섞여 들어가므로 명시. */
const AI_OVERVIEW_COURSE_IDS = [
  "what-is-ai",
  "ml-basics",
  "data-and-ai",
  "deep-learning",
  "nlp-basics",
  "generative-ai",
  "prompt-engineering",
  "computer-vision",
  "ai-ethics",
  "ai-agents",
];

/**
 * AI 강의 코스 그룹 정의 (메뉴 확장).
 *  0. AI 살펴보기 — 현재 이론 강의 10강 묶음(이용 가능)
 *  1~5. 딥러닝 기초 · 지식 증류 · 강화학습 · 양자화 · 지식 증강 — 준비 중(메뉴 노출)
 * 새 그룹을 채울 땐 status를 "available"로 바꾸고 courseIds(또는 별도 트랙)를 연결한다.
 */
export const COURSE_GROUPS: CourseGroup[] = [
  {
    id: "ai-overview",
    order: 0,
    title: "AI 살펴보기",
    subtitle: "AI·머신러닝·딥러닝의 큰 그림을 한 바퀴 — 입문 이론 코스",
    icon: "🧭",
    color: "from-violet-500 to-fuchsia-500",
    status: "available",
    courseIds: AI_OVERVIEW_COURSE_IDS,
    tags: ["AI 기초", "머신러닝", "딥러닝", "생성형 AI", "프롬프트", "에이전트"],
  },
  {
    id: "deep-learning",
    order: 1,
    title: "딥러닝의 기초",
    subtitle: "퍼셉트론·역전파·CNN·RNN — 신경망이 학습하는 원리",
    icon: "🧠",
    color: "from-blue-500 to-cyan-500",
    status: "coming-soon",
    courseIds: [],
    tags: ["신경망", "역전파", "CNN", "RNN", "활성화 함수"],
  },
  {
    id: "knowledge-distillation",
    order: 2,
    title: "지식 증류",
    subtitle: "큰 모델(교사)의 지식을 작은 모델(학생)로 압축하기",
    icon: "💧",
    color: "from-emerald-500 to-teal-500",
    status: "available",
    // 모듈 1(증류 & Scaling Law) 8강 공개. 모듈 2~6은 집필되는 대로 추가(전체 34강 계획).
    courseIds: [
      "kd-01-roadmap",
      "kd-02-what-is-distillation",
      "kd-03-soft-labels",
      "kd-04-temperature-kl",
      "kd-05-distillation-types",
      "kd-06-scaling-law",
      "kd-07-chinchilla",
      "kd-08-2026-scaling",
      "kd-09-moe-basics",
      "kd-10-routing-balance",
      "kd-11-deepseek-moe",
      "kd-12-sft-concept",
      "kd-13-finetuning-general",
      "kd-14-why-sft",
      "kd-15-fft",
      "kd-16-peft-lora",
      "kd-17-qlora",
      "kd-18-trl-unsloth",
    ],
    tags: ["Teacher-Student", "소프트 라벨", "온도", "Scaling Law", "MoE", "SFT"],
  },
  {
    id: "reinforcement-learning",
    order: 3,
    title: "강화학습",
    subtitle: "보상으로 배우는 AI — 에이전트·정책·Q러닝·RLHF",
    icon: "🎮",
    color: "from-orange-500 to-amber-500",
    status: "coming-soon",
    courseIds: [],
    tags: ["에이전트", "보상", "정책", "Q-러닝", "RLHF"],
  },
  {
    id: "quantization",
    order: 4,
    title: "양자화",
    subtitle: "모델을 가볍게 — 정밀도를 낮춰 빠르고 작게 만드는 기술",
    icon: "🗜️",
    color: "from-rose-500 to-pink-500",
    status: "coming-soon",
    courseIds: [],
    tags: ["INT8", "정밀도", "경량 추론", "PTQ/QAT"],
  },
  {
    id: "knowledge-augmentation",
    order: 5,
    title: "지식 증강",
    subtitle: "RAG·검색 결합 — 모델 밖 지식으로 더 정확하게",
    icon: "📚",
    color: "from-indigo-500 to-purple-500",
    status: "coming-soon",
    courseIds: [],
    tags: ["RAG", "검색", "임베딩", "출처", "컨텍스트"],
  },
];

export function getCourseGroup(id: string): CourseGroup | undefined {
  return COURSE_GROUPS.find((g) => g.id === id);
}
