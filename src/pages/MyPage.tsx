import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loadAllProgressFromSupabase } from "../storage/supabaseProgressRepo";
import { getCurriculum } from "../content";
import { COURSES } from "../content/courses";
import { getLanguage, getTrack } from "../content/languages";
import type { Language, Track } from "../types/lesson";

interface TrackProgress {
  language: string;
  track: string;
  langName: string;
  trackName: string;
  icon: string;
  completedCount: number;
  totalCount: number;
  percent: number;
  currentLesson?: string;
  isComplete: boolean;
}

export function MyPage() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [tracks, setTracks] = useState<TrackProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const all = await loadAllProgressFromSupabase(user.id);
      const result: TrackProgress[] = [];

      for (const p of all) {
        const lang = getLanguage(p.language);
        const trk = getTrack(p.track);
        const curriculum = getCurriculum(
          p.language as Language,
          p.track as Track
        );
        if (!lang || !trk) continue;

        const total = curriculum?.summaries.length ?? 0;
        const completed = p.completed_lessons.length;
        result.push({
          language: p.language,
          track: p.track,
          langName: lang.name,
          trackName: trk.name,
          icon: lang.icon,
          completedCount: completed,
          totalCount: total,
          percent: total > 0 ? Math.round((completed / total) * 100) : 0,
          currentLesson: p.current_lesson ?? undefined,
          isComplete: total > 0 && completed >= total,
        });
      }

      setTracks(result);
      setLoading(false);
    })();
  }, [user]);

  if (!user) return <Navigate to="/auth" replace />;

  const totalCompleted = tracks.reduce((s, t) => s + t.completedCount, 0);
  const totalLessons = tracks.reduce((s, t) => s + t.totalCount, 0);
  const completedCourses = 0; // AI 강의 진도는 아직 미구현
  const completeTracks = tracks.filter((t) => t.isComplete);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* 프로필 */}
        <header className="mb-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center">
            <span className="text-brand-primary text-2xl font-bold">
              {user.email?.[0].toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.email}</h1>
            <p className="text-sm text-brand-textDim">
              가입일:{" "}
              {new Date(user.created_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 text-xs rounded-lg border border-brand-subtle text-brand-textDim
                       hover:text-brand-text hover:border-brand-red transition-colors"
          >
            로그아웃
          </button>
        </header>

        {/* 통계 카드 */}
        <section className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="완료 챕터" value={`${totalCompleted}`} sub={`/ ${totalLessons}`} />
          <StatCard label="완료 트랙" value={`${completeTracks.length}`} sub={`/ ${tracks.length}`} />
          <StatCard label="AI 강의" value={`${completedCourses}`} sub={`/ ${COURSES.length}`} />
          <StatCard label="수료증" value={`${completeTracks.length}`} sub="장" />
        </section>

        {/* 트랙별 진도 */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-4">
            코딩 실습 진도
          </h2>
          {loading ? (
            <p className="text-brand-textDim text-sm">로딩 중...</p>
          ) : tracks.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-brand-subtle text-center">
              <p className="text-brand-textDim">아직 학습 기록이 없어요.</p>
              <Link
                to="/coding"
                className="inline-block mt-3 px-4 py-2 text-sm rounded-lg bg-brand-primary text-white
                           hover:bg-brand-primaryDim transition-colors"
              >
                학습 시작하기
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tracks.map((t) => (
                <div
                  key={`${t.language}:${t.track}`}
                  className="p-5 rounded-xl border border-brand-subtle bg-brand-panel"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <h3 className="font-medium">
                          {t.langName} — {t.trackName}
                        </h3>
                        <p className="text-xs text-brand-textDim">
                          {t.completedCount} / {t.totalCount} 챕터 완료
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-bold ${
                          t.isComplete ? "text-brand-green" : "text-brand-primary"
                        }`}
                      >
                        {t.percent}%
                      </span>
                      {t.isComplete && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-green/15 text-brand-green">
                          완료
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-brand-bg overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        t.isComplete ? "bg-brand-green" : "bg-brand-primary"
                      }`}
                      style={{ width: `${t.percent}%` }}
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Link
                      to={`/coding/learn/${t.language}/${t.track}`}
                      className="text-xs text-brand-primary hover:underline"
                    >
                      {t.isComplete ? "다시 보기" : "이어서 학습"} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 수료증 */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-4">
            수료증
          </h2>
          {completeTracks.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-brand-subtle text-center">
              <p className="text-brand-textDim">
                트랙을 완료하면 수료증이 발급됩니다.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {completeTracks.map((t) => (
                <div
                  key={`cert-${t.language}:${t.track}`}
                  className="p-6 rounded-xl border border-brand-green/30 bg-brand-panel"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🏆</span>
                    <div>
                      <h3 className="font-semibold text-brand-green">
                        {t.langName} {t.trackName} 과정 수료
                      </h3>
                      <p className="text-xs text-brand-textDim">
                        {t.totalCount}챕터 전체 완료
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadCertificate(user.email ?? "학습자", t)}
                    className="w-full py-2 text-sm rounded-lg border border-brand-green/50 text-brand-green
                               hover:bg-brand-green/10 transition-colors"
                  >
                    📥 수료증 다운로드
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ─── 통계 카드 ───
function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-brand-subtle bg-brand-panel text-center">
      <div className="text-2xl font-bold text-brand-text">
        {value}
        <span className="text-sm font-normal text-brand-textDim ml-1">
          {sub}
        </span>
      </div>
      <div className="text-xs text-brand-textDim mt-1">{label}</div>
    </div>
  );
}

// ─── 수료증 SVG 생성 + 다운로드 ───
function downloadCertificate(email: string, track: TrackProgress) {
  const date = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0a13"/>
      <stop offset="100%" stop-color="#16132a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)" rx="16"/>
  <rect x="20" y="20" width="760" height="560" fill="none" stroke="url(#accent)" stroke-width="2" rx="12" opacity="0.4"/>
  <text x="400" y="100" text-anchor="middle" font-family="system-ui" font-size="18" fill="#9ca3af">CERTIFICATE OF COMPLETION</text>
  <text x="400" y="160" text-anchor="middle" font-family="system-ui" font-size="42" font-weight="bold" fill="url(#accent)">AIGoLab</text>
  <text x="400" y="200" text-anchor="middle" font-family="system-ui" font-size="14" fill="#9ca3af">AI를 시작하는 가장 쉬운 실험실</text>
  <line x1="200" y1="240" x2="600" y2="240" stroke="#2a2545" stroke-width="1"/>
  <text x="400" y="290" text-anchor="middle" font-family="system-ui" font-size="16" fill="#e8eaed">이 수료증은</text>
  <text x="400" y="330" text-anchor="middle" font-family="system-ui" font-size="28" font-weight="bold" fill="#e8eaed">${escapeXml(email)}</text>
  <text x="400" y="375" text-anchor="middle" font-family="system-ui" font-size="16" fill="#e8eaed">님이 아래 과정을 성공적으로 완료하였음을 증명합니다.</text>
  <text x="400" y="430" text-anchor="middle" font-family="system-ui" font-size="24" font-weight="bold" fill="#7C3AED">${escapeXml(track.icon)} ${escapeXml(track.langName)} ${escapeXml(track.trackName)} 과정</text>
  <text x="400" y="465" text-anchor="middle" font-family="system-ui" font-size="14" fill="#9ca3af">${track.totalCount}챕터 전체 완료</text>
  <line x1="200" y1="500" x2="600" y2="500" stroke="#2a2545" stroke-width="1"/>
  <text x="400" y="540" text-anchor="middle" font-family="system-ui" font-size="14" fill="#9ca3af">${escapeXml(date)}</text>
  <text x="400" y="565" text-anchor="middle" font-family="system-ui" font-size="12" fill="#4a4560">aigolab.vercel.app</text>
</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AIGoLab_Certificate_${track.langName}_${track.trackName}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
