/**
 * AI 엔지니어링 트랙 — 파트 선택 페이지 (/ai-dev/track)
 *
 * "AI 엔지니어링 트랙" 진입 시 입문자 / 중급1 / 중급2 파트를 고른다.
 * - 입문자(beginner, 12강): 기본기
 * - 중급1(intermediate1, 8강): 지식과 컨텍스트 — 런타임 지식 트윈
 * - ✦ MCP 특별강의 / 중급2(에이전틱): 준비 중
 */

import { Link } from "react-router-dom";
import { useProgressStore } from "../store/progressStore";
import { LESSONS as BEGINNER_LESSONS } from "../content/ai-engineering/beginner";
import { LESSONS as INTERMEDIATE1_LESSONS } from "../content/ai-engineering/intermediate1";
import { LESSONS as INTERMEDIATE2_LESSONS } from "../content/ai-engineering/intermediate2";
import { LESSONS as MCP_LESSONS } from "../content/ai-engineering/mcp-special";
import { LESSONS as ADVANCED1_LESSONS } from "../content/ai-engineering/advanced1";

export function AiEngTrackPage() {
  const isCompleted = useProgressStore((s) => s.isCompleted);
  // data 구독 → 진도 변경 시 rerender
  useProgressStore((s) => s.data);

  const beginnerDone = BEGINNER_LESSONS.filter((l) =>
    isCompleted("ai-engineering", "beginner", l.id)
  ).length;
  const inter1Done = INTERMEDIATE1_LESSONS.filter((l) =>
    isCompleted("ai-engineering", "intermediate1", l.id)
  ).length;
  const inter2Done = INTERMEDIATE2_LESSONS.filter((l) =>
    isCompleted("ai-engineering", "intermediate2", l.id)
  ).length;
  const mcpDone = MCP_LESSONS.filter((l) =>
    isCompleted("ai-engineering", "mcp-special", l.id)
  ).length;
  const adv1Done = ADVANCED1_LESSONS.filter((l) =>
    isCompleted("ai-engineering", "advanced1", l.id)
  ).length;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {/* 네비 */}
        <nav className="mb-8">
          <Link
            to="/ai-dev"
            className="text-sm text-brand-textDim hover:text-brand-accent transition-colors"
          >
            ← AI 앱 개발
          </Link>
        </nav>

        {/* 히어로 */}
        <section className="text-center mb-10">
          <div className="text-4xl sm:text-5xl mb-3">🤖</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">AI 엔지니어링 트랙</h1>
          <p className="text-sm sm:text-base text-brand-textDim max-w-xl mx-auto">
            지식 트윈을 <strong>짓고</strong>, 외부와 <strong>연결</strong>하고, 트윈에 <strong>손발</strong>을 단다.
            <br className="hidden sm:block" />
            기본기 → 지식과 컨텍스트 → (연결) → 에이전틱 순으로 깊어집니다.
          </p>
        </section>

        {/* 파트 카드 */}
        <section className="space-y-5">
          {/* 입문자 */}
          <Link
            to="/coding/learn/ai-engineering/beginner"
            className="group block p-6 sm:p-7 border border-brand-line bg-brand-panel/40
                       hover:border-brand-primary/60 hover:shadow-lg hover:shadow-brand-primary/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">📘</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold group-hover:text-brand-primary transition-colors">
                    입문자 파트
                  </h2>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-green text-black font-semibold">
                    {BEGINNER_LESSONS.length}강
                  </span>
                </div>
                <p className="text-xs text-brand-textDim">AI 앱의 기본기</p>
              </div>
              <span className="text-brand-textDim group-hover:text-brand-primary group-hover:translate-x-1 transition-all">→</span>
            </div>
            <p className="text-sm text-brand-textDim mb-3 leading-relaxed">
              프롬프트 · 구조화 출력 · CoT · Tool Calling · 에이전트 · RAG. 무료 API 키만으로 완주.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["WebLLM", "Gemini", "Groq", "RAG", "Agent"].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md text-[10px] bg-brand-primary/10 text-brand-primary">{t}</span>
              ))}
            </div>
            <div className="text-xs text-brand-textDim">
              📖 {BEGINNER_LESSONS.length}강 · ⏱️ ~8시간 · ✅ {beginnerDone}강 완료
            </div>
          </Link>

          {/* 중급1 — 지식과 컨텍스트 */}
          <Link
            to="/coding/learn/ai-engineering/intermediate1"
            className="group block p-6 sm:p-7 border border-emerald-500/50 bg-brand-panel/40
                       hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">📗</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold group-hover:text-emerald-400 transition-colors">
                    중급1 — 지식과 컨텍스트
                  </h2>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-semibold">
                    {INTERMEDIATE1_LESSONS.length}강
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-semibold">NEW</span>
                </div>
                <p className="text-xs text-brand-textDim">런타임 지식 트윈 — RAG·Context 심화</p>
              </div>
              <span className="text-brand-textDim group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">→</span>
            </div>
            <p className="text-sm text-brand-textDim mb-3 leading-relaxed">
              학습 vs 트윈 · 컨텍스트 엔지니어링 · 영속 KB · 청킹 · 하이브리드 검색·재랭킹 · 정확한 인용 · 멀티턴.
              "모델을 재훈련하지 말고, 옆에 최신 지식 트윈을 붙여라."
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["지식 트윈", "Context", "영속 RAG", "재랭킹", "인용", "멀티턴"].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-500/10 text-emerald-300">{t}</span>
              ))}
            </div>
            <div className="text-xs text-brand-textDim">
              📖 {INTERMEDIATE1_LESSONS.length}강 · ⏱️ ~8시간 · ✅ {inter1Done}강 완료 · 선수: 입문자 파트 권장
            </div>
          </Link>

          {/* ✦ MCP 특별강의 — 가교 특강 */}
          <Link
            to="/coding/learn/ai-engineering/mcp-special"
            className="group block p-6 sm:p-7 border border-sky-500/50 bg-brand-panel/40
                       hover:border-sky-400/60 hover:shadow-lg hover:shadow-sky-500/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">✦</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold group-hover:text-sky-400 transition-colors">
                    MCP 특별강의
                  </h2>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500 text-white font-semibold">
                    {MCP_LESSONS.length}강
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-semibold">NEW</span>
                </div>
                <p className="text-xs text-brand-textDim">트윈을 노션·드라이브 등 외부와 표준 연결 (중급1↔2 가교)</p>
              </div>
              <span className="text-brand-textDim group-hover:text-sky-400 group-hover:translate-x-1 transition-all">→</span>
            </div>
            <p className="text-sm text-brand-textDim mb-3 leading-relaxed">
              Model Context Protocol = AI용 USB-C. Resources·Tools·Prompts 로 도구·데이터를 표준 연결.
              내 트윈을 노출하고, 외부 도구를 안전하게 소비한다.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["USB-C", "Resources", "Tools", "트윈 노출", "도구 소비", "가드"].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md text-[10px] bg-sky-500/10 text-sky-300">{t}</span>
              ))}
            </div>
            <div className="text-xs text-brand-textDim">
              📖 {MCP_LESSONS.length}강 · ⏱️ ~375분 · ✅ {mcpDone}강 완료 · 선수: 중급1 권장
            </div>
          </Link>

          {/* 중급2 — 에이전틱 */}
          <Link
            to="/coding/learn/ai-engineering/intermediate2"
            className="group block p-6 sm:p-7 border border-orange-500/50 bg-brand-panel/40
                       hover:border-orange-400/60 hover:shadow-lg hover:shadow-orange-500/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">📙</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold group-hover:text-orange-400 transition-colors">
                    중급2 — 에이전틱
                  </h2>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500 text-white font-semibold">
                    {INTERMEDIATE2_LESSONS.length}강
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-semibold">NEW</span>
                </div>
                <p className="text-xs text-brand-textDim">트윈에 손발 달기 — 도구·오케스트레이션·HITL</p>
              </div>
              <span className="text-brand-textDim group-hover:text-orange-400 group-hover:translate-x-1 transition-all">→</span>
            </div>
            <p className="text-sm text-brand-textDim mb-3 leading-relaxed">
              견고한 에이전트 · 오케스트레이션 · 메모리 · 실연동+HITL · 평가·관측 · 비용·보안 · 배포형 Capstone.
              "안다"를 넘어 "한다"로.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Agent", "오케스트레이션", "HITL", "MCP 소비", "평가", "가드레일"].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md text-[10px] bg-orange-500/10 text-orange-300">{t}</span>
              ))}
            </div>
            <div className="text-xs text-brand-textDim">
              📖 {INTERMEDIATE2_LESSONS.length}강 · ⏱️ ~9시간 · ✅ {inter2Done}강 완료 · 선수: 중급1 권장
            </div>
          </Link>
          {/* 고급1 — 하네스 엔지니어링 */}
          <Link
            to="/coding/learn/ai-engineering/advanced1"
            className="group block p-6 sm:p-7 border border-rose-500/50 bg-brand-panel/40
                       hover:border-rose-400/60 hover:shadow-lg hover:shadow-rose-500/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🐎</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold group-hover:text-rose-400 transition-colors">
                    고급1 — 하네스 엔지니어링
                  </h2>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-semibold">
                    {ADVANCED1_LESSONS.length}강
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-semibold">NEW</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-green text-black font-semibold">A 무료</span>
                </div>
                <p className="text-xs text-brand-textDim">AI 에이전트 엔지니어링 ① — 같은 뇌, 다른 몸</p>
              </div>
              <span className="text-brand-textDim group-hover:text-rose-400 group-hover:translate-x-1 transition-all">→</span>
            </div>
            <p className="text-sm text-brand-textDim mb-3 leading-relaxed">
              에이전트 = 모델(뇌) + 하네스(몸). 루프·도구·컨텍스트·기억·가드레일 5대 기관으로 에이전트를 해부한다.
              시리즈 A '이야기'(6강, 코드 0줄, 무료) + B '다루기'(8강, 설정으로 조련, PRO) — C '만들기'(개발자)로 이어지는 3중 시리즈.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["하네스", "5대 기관", "지침 파일", "도구 큐레이션", "권한 설계", "골든 케이스"].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md text-[10px] bg-rose-500/10 text-rose-300">{t}</span>
              ))}
            </div>
            <div className="text-xs text-brand-textDim">
              📖 {ADVANCED1_LESSONS.length}강 · ⏱️ ~5.5시간 · ✅ {adv1Done}강 완료 · A는 선수 지식 없음(누구나) · B는 A 수강 권장
            </div>
          </Link>
        </section>

        {/* 학습 흐름 */}
        <section className="mt-10 text-center">
          <p className="text-xs text-brand-textDim">
            입문자(기본기) → 중급1(지식 트윈) → MCP(연결) → 중급2(행동) → 고급1(하네스) → 바이브코딩 워크샵(앱 실전)
          </p>
        </section>
      </div>
    </div>
  );
}
