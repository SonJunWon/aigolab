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
    status: "coming-soon",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "ruby",
    name: "Ruby",
    icon: "💎",
    description: "읽기 편한 문법과 웹 개발 친화적인 언어.",
    status: "coming-soon",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "go",
    name: "Go",
    icon: "🐹",
    description: "간결하고 빠른 시스템 언어. 서버와 인프라에 많이 쓰입니다.",
    status: "coming-soon",
    color: "from-cyan-400 to-blue-500",
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
];

export function getLanguage(id: string): LanguageInfo | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

export function getTrack(id: string): TrackInfo | undefined {
  return TRACKS.find((t) => t.id === id);
}
