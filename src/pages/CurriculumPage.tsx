import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getCurriculum } from "../content";
import { getLanguage, getTrack } from "../content/languages";
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

  if (!lang || !trk) {
    return <Navigate to="/coding" replace />;
  }

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
            <h1 className="text-3xl font-semibold text-colab-text mb-1">
              {lang.name} — {trk.name}
            </h1>
            <p className="text-colab-textDim">{trk.description}</p>
          </div>
        </header>

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
              return (
                <Link
                  key={lesson.id}
                  to={`/coding/learn/${lang.id}/${trk.id}/${lesson.id}`}
                  className={`block p-5 rounded-lg border bg-colab-panel transition-colors group
                    ${
                      done
                        ? "border-colab-green/50 hover:border-colab-green"
                        : isCurrent
                        ? "border-colab-accent/60 hover:border-colab-accent"
                        : "border-colab-subtle hover:border-colab-accent"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono transition-colors
                        ${
                          done
                            ? "bg-colab-green/15 text-colab-green border border-colab-green/40"
                            : "bg-colab-bg border border-colab-subtle text-colab-textDim group-hover:text-colab-accent group-hover:border-colab-accent"
                        }`}
                    >
                      {done ? "✓" : lesson.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-colab-text">
                          {lesson.title}
                        </h3>
                        {isCurrent && !done && (
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
                    <div className="shrink-0 text-colab-textDim group-hover:text-colab-accent transition-colors">
                      →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
