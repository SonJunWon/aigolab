import type { LanguageInfo, TrackInfo } from "../types/lesson";

export const LANGUAGES: LanguageInfo[] = [
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    description: "배우기 쉽고 강력한 범용 언어. 데이터 분석, 웹, AI 어디서나 사용됩니다.",
    status: "available",
    color: "from-blue-500 to-yellow-400",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "📜",
    description: "웹 브라우저에서 돌아가는 언어. 프론트엔드 개발의 필수.",
    status: "available",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "sql",
    name: "SQL",
    icon: "🗄️",
    description: "데이터를 다루는 표준 언어. 데이터 분석과 백엔드의 기초.",
    status: "available",
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: "ai-engineering",
    name: "AI 엔지니어링",
    icon: "🤖",
    description: "브라우저 내 LLM 부터 Agent·RAG·CoT 까지. 무료 API 키만으로 12강 완주.",
    status: "available",
    color: "from-violet-500 to-fuchsia-500",
  },
];

export const TRACKS: TrackInfo[] = [
  {
    id: "beginner",
    name: "입문자",
    description: "프로그래밍이 처음이에요. 기초부터 차근차근 배울게요.",
    estimatedHours: 10,
  },
  {
    id: "intermediate",
    name: "중급 이상",
    description: "이미 다른 언어를 알고 있어요. 이 언어만의 특징을 빠르게 배울게요.",
  },
  {
    id: "data-science",
    name: "데이터 과학",
    description: "NumPy, Pandas, Matplotlib 부터 정제·결합·그룹분석·미니프로젝트까지 10강 완주 코스.",
    estimatedHours: 10,
  },
  {
    id: "ml-practice",
    name: "머신러닝 실습",
    description: "scikit-learn 으로 회귀·분류·클러스터링부터 앙상블·부스팅·해석·이탈 예측·PCA 까지 11강 실전 코스.",
    estimatedHours: 11,
  },
];

export function getLanguage(id: string): LanguageInfo | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

export function getTrack(id: string): TrackInfo | undefined {
  return TRACKS.find((t) => t.id === id);
}
