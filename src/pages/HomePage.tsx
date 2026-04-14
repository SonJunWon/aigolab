import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LANGUAGES, TRACKS, getLanguage, getTrack } from "../content/languages";
import { getLessonById } from "../content";
import { isTrackPro } from "../content/tier";
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
  const [latestProgress, setLatestProgress] = useState<ResumeData | null>(null);

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

  const handleTrackSelect = (track: Track) => {
    if (!selectedLang) return;
    // PRO 트랙이면 paywall — 실제 이동 차단
    if (isTrackPro(selectedLang, track)) {
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

  // ─── 이어서 학습 배너용 정보 ─────────────────────
  const resumeInfo = latestProgress
    ? (() => {
        const lang = getLanguage(latestProgress.language);
        const track = getTrack(latestProgress.track);
        const lesson =
          lang && track && latestProgress.currentLesson
            ? getLessonById(
                lang.id,
                track.id,
                latestProgress.currentLesson
              )
            : undefined;
        if (!lang || !track || !lesson) return null;
        return { lang, track, lesson };
      })()
    : null;

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

        {/* ─── 이어서 학습 배너 (진도 있을 때만) ─── */}
        {resumeInfo && (() => {
          const resumePro = isTrackPro(
            resumeInfo.lang.id,
            resumeInfo.track.id as Track
          );
          const innerContent = (
            <div className="flex items-center gap-5">
              <div className="shrink-0 text-5xl">{resumeInfo.lang.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-colab-accent/15 text-colab-accent font-medium uppercase tracking-wider">
                    📖 이어서 학습
                  </span>
                  {resumePro && <ProBadge size="sm" />}
                  <span className="text-xs text-colab-textDim">
                    {resumeInfo.lang.name} · {resumeInfo.track.name} · 챕터{" "}
                    {resumeInfo.lesson.order}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-colab-text truncate">
                  {resumeInfo.lesson.title}
                </h3>
                {resumeInfo.lesson.subtitle && (
                  <p className="mt-0.5 text-sm text-colab-textDim truncate">
                    {resumeInfo.lesson.subtitle}
                  </p>
                )}
              </div>
              <div className={`shrink-0 flex items-center gap-2 transition-transform ${
                resumePro ? "text-amber-400" : "text-colab-accent group-hover:translate-x-1"
              }`}>
                <span className="text-sm font-medium">
                  {resumePro ? "PRO 오픈 예정" : "계속하기"}
                </span>
                <span className="text-xl">{resumePro ? "🔒" : "→"}</span>
              </div>
            </div>
          );

          return (
            <section className="mb-10">
              {resumePro ? (
                <button
                  type="button"
                  onClick={() =>
                    showPaywall({
                      title: `${resumeInfo.lang.name} · ${resumeInfo.track.name}`,
                      kind: "코딩 실습 트랙",
                      icon: resumeInfo.lang.icon,
                    })
                  }
                  className="block w-full text-left p-6 rounded-xl border border-amber-400/30 bg-gradient-to-r from-colab-panel to-amber-400/5
                             hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-400/10 transition-all group"
                >
                  {innerContent}
                </button>
              ) : (
                <Link
                  to={`/coding/learn/${resumeInfo.lang.id}/${resumeInfo.track.id}/${resumeInfo.lesson.id}`}
                  className="block p-6 rounded-xl border border-colab-accent/40 bg-gradient-to-r from-colab-panel to-colab-panel/60
                             hover:border-colab-accent hover:from-colab-panel hover:shadow-lg hover:shadow-colab-accent/10
                             transition-all group"
                >
                  {innerContent}
                </Link>
              )}
            </section>
          );
        })()}

        {/* Playground + IDE 바로가기 */}
        <section className="mb-10 grid md:grid-cols-2 gap-4">
          <Link
            to="/coding/playground"
            className="block p-5 rounded-xl border border-colab-subtle bg-colab-panel
                       hover:border-colab-accent/60 hover:shadow-lg hover:shadow-colab-accent/5
                       transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-colab-accent/10 flex items-center justify-center text-2xl">
                🧪
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-colab-text">
                  Playground
                </h3>
                <p className="text-xs text-colab-textDim">
                  노트북에서 자유 코딩. 자동 저장.
                </p>
              </div>
              <span className="shrink-0 text-colab-textDim group-hover:text-colab-accent group-hover:translate-x-1 transition-all text-xl">
                →
              </span>
            </div>
          </Link>

          <Link
            to="/coding/ide"
            className="block p-5 rounded-xl border border-colab-subtle bg-colab-panel
                       hover:border-colab-accent/60 hover:shadow-lg hover:shadow-colab-accent/5
                       transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-colab-green/10 flex items-center justify-center text-2xl">
                💻
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-colab-text">
                  Python IDE
                </h3>
                <p className="text-xs text-colab-textDim">
                  멀티 파일 · import 지원 · VS Code 스타일
                </p>
              </div>
              <span className="shrink-0 text-colab-textDim group-hover:text-colab-accent group-hover:translate-x-1 transition-all text-xl">
                →
              </span>
            </div>
          </Link>
        </section>

        {/* Step 1: 언어 선택 — selectedLang 없을 때만 노출 */}
        {!selectedLang && (
          <section className="mb-12">
            <h2 className="text-sm font-medium text-colab-textDim uppercase tracking-wider mb-4">
              {resumeInfo ? "또는 새로 시작하기" : "배우고 싶은 언어를 선택하세요"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {LANGUAGES.map((lang) => {
                const isDisabled = lang.status === "coming-soon";
                return (
                  <button
                    key={lang.id}
                    disabled={isDisabled}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`relative p-6 rounded-lg border text-left transition-all
                      ${
                        isDisabled
                          ? "border-colab-subtle bg-colab-panel/50 opacity-50 cursor-not-allowed"
                          : "border-colab-subtle bg-colab-panel hover:border-colab-accent/60 hover:shadow-lg hover:shadow-colab-accent/5"
                      }`}
                  >
                    <div className="text-4xl mb-3">{lang.icon}</div>
                    <h3 className="text-lg font-medium mb-1 text-colab-text">
                      {lang.name}
                    </h3>
                    <p className="text-xs text-colab-textDim leading-relaxed">
                      {lang.description}
                    </p>
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
                  const pro = isTrackPro(selectedLang, track.id);
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
