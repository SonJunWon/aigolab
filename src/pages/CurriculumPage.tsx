import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getCurriculum } from "../content";
import { getLanguage, getTrack } from "../content/languages";
import { isTrackPro } from "../content/tier";
import { canAccessTrack } from "../content/access";
import { useEntitlements } from "../hooks/useEntitlements";
import { ProBadge } from "../components/paywall/ProBadge";
import { usePaywall } from "../components/paywall/usePaywall";
import { useProgressStore } from "../store/progressStore";
import type { Language, Track } from "../types/lesson";

export function CurriculumPage() {
  const { language, track } = useParams<{ language: string; track: string }>();

  const lang = language ? getLanguage(language) : undefined;
  const trk = track ? getTrack(track) : undefined;
  const curriculum = lang && trk
    ? getCurriculum(lang.id as Language, trk.id as Track)
    : undefined;

  const ensureLoaded = useProgressStore((s) => s.ensureLoaded);
  const isCompleted = useProgressStore((s) => s.isCompleted);
  const getProgress = useProgressStore((s) => s.getProgress);
  // 스토어 data를 구독해서 rerender되게 함
  useProgressStore((s) => s.data);

  useEffect(() => {
    if (lang && trk) {
      void ensureLoaded(lang.id as Language, trk.id as Track);
    }
  }, [lang, trk, ensureLoaded]);

  const { showPaywall, modal } = usePaywall();
  const { entitlements } = useEntitlements();

  if (!lang || !trk) {
    return <Navigate to="/coding" replace />;
  }

  // pro 트랙인데 접근 권한 없는 경우에만 잠금
  const trackPro =
    isTrackPro(lang.id as Language, trk.id as Track) &&
    !canAccessTrack(lang.id as Language, trk.id as Track, entitlements);
  const progress =
    lang && trk ? getProgress(lang.id as Language, trk.id as Track) : undefined;
  const totalLessons = curriculum?.summaries.length ?? 0;
  const completedCount = progress?.completedLessons.length ?? 0;
  const percent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-colab-bg text-colab-text">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* 상단 네비게이션 */}
        <nav className="mb-8">
          <Link
            to="/coding"
            className="text-sm text-colab-textDim hover:text-colab-accent transition-colors"
          >
            ← 홈으로
          </Link>
        </nav>

        {/* 헤더 */}
        <header className="mb-8 flex items-start gap-4">
          <div className="text-5xl">{lang.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-3xl font-semibold text-colab-text">
                {lang.name} — {trk.name}
              </h1>
              {trackPro && <ProBadge size="md" variant="solid" />}
            </div>
            <p className="text-colab-textDim">{trk.description}</p>
          </div>
        </header>

        {/* PRO 트랙 안내 배너 */}
        {trackPro && (
          <div className="mb-8 p-5 rounded-xl border border-amber-400/40 bg-gradient-to-br from-amber-400/10 to-transparent">
            <div className="flex items-start gap-3">
              <div className="text-2xl shrink-0">🔒</div>
              <div className="flex-1 min-w-0">
                <div className="text-amber-400 font-semibold text-sm mb-1">
                  PRO 전용 트랙 — 곧 오픈 예정
                </div>
                <p className="text-sm text-colab-textDim leading-relaxed">
                  이 트랙은 <strong className="text-colab-text">AIGoLab PRO</strong> 출시와
                  함께 이용할 수 있습니다. 챕터 목록은 미리 확인 가능하며, 각 챕터를 누르면
                  오픈 안내를 보여드립니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 진행률 */}
        {totalLessons > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-colab-textDim uppercase tracking-wider">
                진행률
              </span>
              <span className="text-xs text-colab-textDim">
                {completedCount} / {totalLessons} 완료 ({percent}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-colab-panel overflow-hidden">
              <div
                className="h-full bg-colab-green transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        {/* 챕터 목록 */}
        {!curriculum || curriculum.summaries.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-colab-subtle rounded-lg">
            <p className="text-colab-textDim">
              이 트랙의 콘텐츠는 아직 준비 중입니다 🚧
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {curriculum.summaries.map((lesson) => {
              const done = isCompleted(
                lang.id as Language,
                trk.id as Track,
                lesson.id
              );
              const isCurrent = progress?.currentLesson === lesson.id;

              const inner = (
                <div className="flex items-center gap-4">
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono transition-colors
                      ${
                        done
                          ? "bg-colab-green/15 text-colab-green border border-colab-green/40"
                          : trackPro
                          ? "bg-colab-bg border border-amber-400/40 text-amber-400 opacity-80"
                          : "bg-colab-bg border border-colab-subtle text-colab-textDim group-hover:text-colab-accent group-hover:border-colab-accent"
                      }`}
                  >
                    {done ? "✓" : lesson.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-medium text-colab-text">
                        {lesson.title}
                      </h3>
                      {isCurrent && !done && !trackPro && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-colab-accent/15 text-colab-accent">
                          진행 중
                        </span>
                      )}
                    </div>
                    {lesson.subtitle && (
                      <p className="mt-0.5 text-sm text-colab-textDim">
                        {lesson.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-xs text-colab-textDim">
                    약 {lesson.estimatedMinutes}분
                  </div>
                  <div className={`shrink-0 transition-colors ${
                    trackPro
                      ? "text-amber-400"
                      : "text-colab-textDim group-hover:text-colab-accent"
                  }`}>
                    {trackPro ? "🔒" : "→"}
                  </div>
                </div>
              );

              const baseCls = `block p-5 rounded-lg border bg-colab-panel transition-colors group w-full text-left ${
                trackPro
                  ? "border-amber-400/30 hover:border-amber-400/60"
                  : done
                  ? "border-colab-green/50 hover:border-colab-green"
                  : isCurrent
                  ? "border-colab-accent/60 hover:border-colab-accent"
                  : "border-colab-subtle hover:border-colab-accent"
              }`;

              return trackPro ? (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() =>
                    showPaywall({
                      title: `${lang.name} · ${trk.name}`,
                      kind: `코딩 실습 트랙 · 챕터 ${lesson.order}`,
                      icon: lang.icon,
                    })
                  }
                  className={baseCls}
                >
                  {inner}
                </button>
              ) : (
                <Link
                  key={lesson.id}
                  to={`/coding/learn/${lang.id}/${trk.id}/${lesson.id}`}
                  className={baseCls}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      {modal}
    </div>
  );
}
