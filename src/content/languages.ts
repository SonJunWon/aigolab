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
    // 코딩 실습 언어 선택 UI 에서 숨김 — /ai-dev 코너에서 별도 진입
    // getLanguage() 조회·커리큘럼·레슨은 정상 동작해야 하므로 배열에 유지
  },
];

export const TRACKS: TrackInfo[] = [
  {
    id: "intro",
    name: "AI 입문 준비",
    description: "AI가 처음인 분을 위한 준비 과정. 플랫폼 사용법부터 AI 기초, 마크다운, 코딩 첫걸음까지 14강 완주.",
    estimatedHours: 8,
  },
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
    id: "intermediate1",
    name: "중급1 — 지식과 컨텍스트",
    description: "모델을 다시 훈련시키지 말고, 옆에 항상 최신인 '지식 트윈'을 붙여라. RAG·Context 심화로 영속·인용·멀티턴 트윈을 짓는 과정.",
    estimatedHours: 8,
  },
  {
    id: "mcp-special",
    name: "MCP 특별강의",
    description: "AI용 USB-C(Model Context Protocol). 지식 트윈을 표준으로 외부 도구·데이터와 연결한다. 중급1↔중급2 가교 특강 3강.",
    estimatedHours: 1,
  },
  {
    id: "intermediate2",
    name: "중급2 — 에이전틱",
    description: "지식 트윈에 손발을 단다. 오케스트레이션·메모리·실연동·HITL·평가·배포까지 프로덕션 에이전트.",
    estimatedHours: 9,
  },
  {
    id: "advanced1",
    name: "고급1 — 하네스 엔지니어링",
    description: "AI 에이전트 엔지니어링 ①. 에이전트 = 모델(뇌) + 하네스(몸). 5대 기관(루프·도구·컨텍스트·기억·가드레일)을 이야기→다루기→만들기 3중 시리즈로.",
    estimatedHours: 13,
  },
  {
    id: "advanced2",
    name: "고급2 — 멀티에이전트 시스템",
    description: "AI 에이전트 엔지니어링 ②. 말 한 마리는 짐을 끌고, 마차단은 도시를 옮긴다 — 분업·역할·지휘·전달·신뢰 5대 축으로 에이전트 팀을 설계한다.",
    estimatedHours: 12,
  },
  {
    id: "advanced3",
    name: "고급3 — 평가·운영",
    description: "AI 에이전트 엔지니어링 ③ 완결편. 달리게 만드는 것과 계속 달리게 하는 것은 다른 기술이다 — 운영 루프 5국면(관측·평가·진단·개선·통제)으로 시스템을 기른다.",
    estimatedHours: 12,
  },
  {
    id: "friendly-preview",
    name: "친화 버전 미리보기",
    description: "일반 사용자 친화 스타일(카드·비유·입력창·샘플 사례) 강의 미리보기. 검토용.",
    estimatedHours: 1,
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
