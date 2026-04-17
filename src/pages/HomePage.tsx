import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LANGUAGES, TRACKS, getLanguage, getTrack } from "../content/languages";
import { isTrackPro } from "../content/tier";
import { canAccessTrack } from "../content/access";
import { useEntitlements } from "../hooks/useEntitlements";
import { ProBadge } from "../components/paywall/ProBadge";
import { usePaywall } from "../components/paywall/usePaywall";
import { listAllProgress } from "../storage/progressRepo";
import { loadAllProgressFromSupabase } from "../storage/supabaseProgressRepo";
import { useAuthStore } from "../store/authStore";
import type { Language, Track } from "../types/lesson";

interface ResumeData {
  language: string;
  track: string;
  currentLesson: string;
  lastStudiedAt: number;
}

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [_latestProgress, setLatestProgress] = useState<ResumeData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let items: ResumeData[] = [];
      if (user) {
        const remote = await loadAllProgressFromSupabase(user.id);
        items = remote.filter(r => r.current_lesson).map(r => ({
          language: r.language, track: r.track,
          currentLesson: r.current_lesson!, lastStudiedAt: new Date(r.last_studied_at).getTime(),
        }));
      } else {
        const local = await listAllProgress();
        items = local.filter(l => l.currentLesson).map(l => ({
          language: l.language, track: l.track,
          currentLesson: l.currentLesson!, lastStudiedAt: l.lastStudiedAt,
        }));
      }
      if (cancelled) return;
      const sorted = items.sort((a, b) => b.lastStudiedAt - a.lastStudiedAt);
      setLatestProgress(sorted[0] ?? null);
    })().catch(() => {});
    return () => { cancelled = true; };
  }, [user]);

  const { showPaywall, modal } = usePaywall();
  const { entitlements } = useEntitlements();

  const handleTrackSelect = (track: Track) => {
    if (!selectedLang) return;
    // PRO 트랙인데 권한 없으면 paywall — 권한 있으면 통과
    if (
      isTrackPro(selectedLang, track) &&
      !canAccessTrack(selectedLang, track, entitlements)
    ) {
      const trk = getTrack(track);
      const lang = getLanguage(selectedLang);
      if (trk && lang) {
        showPaywall({
          title: `${lang.name} · ${trk.name}`,
          kind: "코딩 실습 트랙",
          icon: lang.icon,
        });
      }
      return;
    }
    navigate(`/coding/learn/${selectedLang}/${track}`);
  };


  return (
    <div className="min-h-screen bg-colab-bg text-colab-text">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <header className="text-center mb-12">
          <div className="text-6xl mb-4">🐍</div>
          <h1 className="text-4xl font-semibold mb-3 text-colab-text">
            Python Notebook
          </h1>
          <p className="text-lg text-colab-textDim">
            브라우저에서 바로 시작하는 프로그래밍 언어 학습 플랫폼
          </p>
        </header>

        {/* Step 1: 언어 선택 — selectedLang 없을 때만 노출 */}
        {!selectedLang && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-colab-text mb-2 text-center">
              학습할 언어를 선택하세요
            </h2>
            <p className="text-sm text-colab-textDim text-center mb-6">
              모든 언어가 브라우저에서 바로 실행됩니다. 설치 필요 없어요.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "python",
                  icon: "🐍",
                  name: "Python",
                  tagline: "가장 인기 있는 입문 언어",
                  desc: "배우기 쉽고 강력한 범용 언어. 데이터 분석, 웹 개발, AI/머신러닝까지 어디서나 사용됩니다. 프로그래밍을 처음 시작한다면 Python을 추천해요.",
                  tags: ["데이터 분석", "AI/ML", "웹 개발", "자동화"],
                  status: "active" as const,
                },
                {
                  id: "javascript",
                  icon: "📜",
                  name: "JavaScript",
                  tagline: "웹의 언어, 프론트엔드의 필수",
                  desc: "모든 웹 브라우저에서 돌아가는 유일한 언어. 웹사이트, 앱, 서버까지 JavaScript 하나로 풀스택 개발이 가능합니다.",
                  tags: ["웹 개발", "프론트엔드", "Node.js", "React"],
                  status: "active" as const,
                },
                {
                  id: "sql",
                  icon: "🗄️",
                  name: "SQL",
                  tagline: "데이터를 다루는 표준 언어",
                  desc: "데이터베이스에서 데이터를 조회, 분석, 관리하는 필수 기술. 데이터 분석가, 백엔드 개발자 모두에게 꼭 필요한 스킬이에요.",
                  tags: ["데이터 분석", "백엔드", "데이터베이스"],
                  status: "active" as const,
                },
              ].map((lang) => {
                const realLang = LANGUAGES.find((l) => l.id === lang.id);
                const isDisabled = realLang?.status === "coming-soon";
                return (
                  <button
                    key={lang.id}
                    disabled={isDisabled}
                    onClick={() => setSelectedLang(lang.id as Language)}
                    className={`relative p-6 rounded-xl border text-left transition-all
                      ${
                        isDisabled
                          ? "border-colab-subtle bg-colab-panel/50 opacity-50 cursor-not-allowed"
                          : "border-colab-subtle bg-colab-panel hover:border-colab-accent/60 hover:shadow-lg hover:shadow-colab-accent/5"
                      }`}
                  >
                    <div className="text-4xl mb-3">{lang.icon}</div>
                    <h3 className="text-xl font-semibold mb-1 text-colab-text">
                      {lang.name}
                    </h3>
                    <p className="text-xs text-colab-accent font-medium mb-2">
                      {lang.tagline}
                    </p>
                    <p className="text-sm text-colab-textDim leading-relaxed mb-3">
                      {lang.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {lang.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] bg-colab-accent/10 text-colab-accent/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {isDisabled && (
                      <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-colab-subtle text-colab-textDim">
                        준비 중
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Playground + IDE 바로가기 (언어 선택 전에만) */}
        {!selectedLang && <section className="mb-12">
          <h2 className="text-lg font-semibold text-colab-text mb-2 text-center">
            코딩 도구
          </h2>
          <p className="text-sm text-colab-textDim text-center mb-6">
            커리큘럼 없이 자유롭게 코딩하고 싶을 때 사용하세요
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/coding/playground"
              className="block p-6 rounded-xl border border-colab-subtle bg-colab-panel
                         hover:border-colab-accent/60 hover:shadow-lg hover:shadow-colab-accent/5
                         transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-colab-accent/10 flex items-center justify-center text-2xl">
                  🧪
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-colab-text mb-1 group-hover:text-colab-accent transition-colors">
                    Playground
                  </h3>
                  <p className="text-sm text-colab-textDim leading-relaxed mb-2">
                    Jupyter 스타일 노트북에서 코드를 셀 단위로 실행하고 결과를 바로 확인하세요.
                    작성한 코드는 자동 저장되어 다음에 다시 이어서 할 수 있어요.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-colab-accent/10 text-colab-accent/80">셀 단위 실행</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-colab-accent/10 text-colab-accent/80">자동 저장</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-colab-accent/10 text-colab-accent/80">마크다운 지원</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/coding/ide"
              className="block p-6 rounded-xl border border-colab-subtle bg-colab-panel
                         hover:border-colab-accent/60 hover:shadow-lg hover:shadow-colab-accent/5
                         transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-colab-green/10 flex items-center justify-center text-2xl">
                  💻
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-colab-text mb-1 group-hover:text-colab-accent transition-colors">
                    Python IDE
                  </h3>
                  <p className="text-sm text-colab-textDim leading-relaxed mb-2">
                    VS Code와 같은 본격 개발 환경. 여러 파일을 만들고 import로 연결할 수 있어요.
                    실제 프로젝트처럼 폴더 구조를 갖춘 코딩이 가능합니다.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-colab-green/10 text-colab-green/80">멀티 파일</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-colab-green/10 text-colab-green/80">import 지원</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-colab-green/10 text-colab-green/80">VS Code 스타일</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>}

        {/* ─── 플랫폼 장점 안내 (언어 선택 전에만) ─── */}
        {!selectedLang && <section className="mb-12 max-w-3xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl border border-colab-subtle bg-colab-panel/60">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-colab-accent/10 flex items-center justify-center text-2xl">
              🌐
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">설치 없이 바로 시작</h3>
              <p className="text-sm text-colab-textDim leading-relaxed">
                Python, JavaScript, SQL이 브라우저에서 바로 실행됩니다.
                복잡한 환경설정이나 다운로드 없이 링크만 열면 코딩을 시작할 수 있어요.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl border border-colab-subtle bg-colab-panel/60">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-colab-green/10 flex items-center justify-center text-2xl">
              📖
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">단계별 학습 커리큘럼</h3>
              <p className="text-sm text-colab-textDim leading-relaxed">
                입문부터 중급까지, 챕터별로 구성된 커리큘럼을 따라가면 자연스럽게 실력이 쌓여요.
                힌트, 정답 확인, 퀴즈까지 — 혼자서도 막힘 없이 진행할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl border border-colab-subtle bg-colab-panel/60">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-2xl">
              💻
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">노트북 + IDE, 두 가지 환경</h3>
              <p className="text-sm text-colab-textDim leading-relaxed">
                Jupyter 스타일 노트북으로 배우고, VS Code 스타일 IDE로 실전 프로젝트를 만들어보세요.
                자동 저장, 멀티 파일, import 지원까지 실제 개발 환경과 동일합니다.
              </p>
            </div>
          </div>
        </section>}

        {/* Step 2: 트랙 선택 — selectedLang 있을 때만 노출 */}
        {selectedLang && (() => {
          const lang = getLanguage(selectedLang);
          if (!lang) return null;
          return (
            <section className="mb-12">
              {/* 뒤로가기 + 현재 언어 표시 */}
              <div className="mb-6 flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedLang(null)}
                  className="flex items-center gap-2 text-sm text-colab-textDim hover:text-colab-accent transition-colors"
                >
                  <span>←</span>
                  <span>다른 언어 선택</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lang.icon}</span>
                  <span className="text-sm font-medium text-colab-text">
                    {lang.name}
                  </span>
                </div>
              </div>

              <h2 className="text-sm font-medium text-colab-textDim uppercase tracking-wider mb-4">
                트랙을 선택하세요
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {TRACKS.map((track) => {
                  // 권한이 있으면 pro 마크 숨김
                  const pro =
                    isTrackPro(selectedLang, track.id) &&
                    !canAccessTrack(selectedLang, track.id, entitlements);
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleTrackSelect(track.id)}
                      className={`group p-6 rounded-lg border text-left transition-all ${
                        pro
                          ? "border-colab-subtle/80 bg-colab-panel hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5"
                          : "border-colab-subtle bg-colab-panel hover:border-colab-accent hover:bg-colab-panel/80 hover:shadow-lg hover:shadow-colab-accent/5"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-medium text-colab-text">
                            {track.name}
                          </h3>
                          {pro && <ProBadge size="sm" />}
                        </div>
                        <span className={`shrink-0 transition-all ${
                          pro
                            ? "text-colab-textDim group-hover:text-amber-400"
                            : "text-colab-textDim group-hover:text-colab-accent group-hover:translate-x-1"
                        }`}>
                          {pro ? "🔒" : "→"}
                        </span>
                      </div>
                      <p className="text-sm text-colab-textDim leading-relaxed">
                        {track.description}
                      </p>
                      {track.estimatedHours && (
                        <p className="mt-3 text-xs text-colab-textDim">
                          예상 학습 시간: 약 {track.estimatedHours}시간
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* 하단 안내 */}
        <footer className="mt-20 text-center text-xs text-colab-textDim">
          <p>
            모든 코드는 브라우저에서 바로 실행됩니다 — 설치 없이, 서버 없이,
            오프라인에서도.
          </p>
          <p className="mt-1">
            Python 3.12 via{" "}
            <a
              href="https://pyodide.org"
              target="_blank"
              rel="noreferrer"
              className="text-colab-accent hover:underline"
            >
              Pyodide
            </a>
          </p>
        </footer>
      </div>
      {modal}
    </div>
  );
}
