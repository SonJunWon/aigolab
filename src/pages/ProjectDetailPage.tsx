import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../content/projects";
import { Markdown } from "../components/Markdown";
import { ProjectStepCard } from "../components/project/ProjectStepCard";
import { useFileStore } from "../store/fileStore";
import { useStudyTimeTracking } from "../hooks/useStudyTimeTracking";

/** localStorage 키 — 프로젝트별 완료 단계 인덱스 배열 */
const progressKey = (id: string) => `project_progress_${id}`;

function loadProgress(id: string): Set<number> {
  try {
    const raw = localStorage.getItem(progressKey(id));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveProgress(id: string, done: Set<number>) {
  try {
    localStorage.setItem(progressKey(id), JSON.stringify([...done]));
  } catch {
    // storage full, private mode 등 — 무시
  }
}

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;
  const navigate = useNavigate();
  const loadProject = useFileStore((s) => s.loadProject);

  // 학습 시간 추적
  useStudyTimeTracking(!!project);

  // 단계별 완료 상태
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (project) setCompleted(loadProgress(project.id));
  }, [project]);

  if (!project) return <Navigate to="/projects" replace />;

  const total = project.steps.length;
  const done = completed.size;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const toggleStep = (i: number) => {
    const next = new Set(completed);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setCompleted(next);
    saveProgress(project.id, next);
  };

  const resetProgress = () => {
    setCompleted(new Set());
    saveProgress(project.id, new Set());
  };

  const handleOpenIDE = () => {
    const files: Record<string, { name: string; content: string; language: string }> = {};
    for (const [key, file] of Object.entries(project.starterFiles)) {
      files[key] = file;
    }
    loadProject(files);
    navigate("/coding/ide");
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-8">
          <Link
            to="/projects"
            className="text-sm text-brand-textDim hover:text-brand-primary transition-colors"
          >
            ← 프로젝트 목록
          </Link>
        </nav>

        {/* 헤더 */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{project.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <p className="text-brand-textDim">{project.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-brand-textDim">
            <span>⏱ 약 {project.estimatedMinutes}분</span>
            <span>{project.difficulty === "beginner" ? "입문" : "중급"}</span>
            <span>📋 {total}단계</span>
          </div>
        </header>

        {/* 설명 */}
        <Markdown content={project.description} />

        {/* 진행률 바 */}
        <section className="mt-10 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">📋 단계별 가이드</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-textDim">
                {done} / {total} 완료 ({percent}%)
              </span>
              {done > 0 && (
                <button
                  onClick={resetProgress}
                  className="text-[11px] text-brand-textDim hover:text-brand-primary transition-colors"
                  title="진행도 초기화"
                >
                  ↺ 초기화
                </button>
              )}
            </div>
          </div>
          <div className="h-2 rounded-full bg-brand-subtle overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </section>

        {/* 단계 카드 */}
        <section className="space-y-2 mb-8">
          {project.steps.map((step, i) => (
            <ProjectStepCard
              key={i}
              index={i}
              step={step}
              completed={completed.has(i)}
              onToggleCompleted={() => toggleStep(i)}
            />
          ))}
        </section>

        {/* IDE 이동 버튼 */}
        <button
          onClick={handleOpenIDE}
          className="w-full py-3 rounded-xl bg-brand-primary text-white font-medium text-sm hover:bg-brand-primaryDim transition-colors"
        >
          💻 IDE에서 프로젝트 시작하기
        </button>

        {/* 완주 축하 배너 */}
        {percent === 100 && (
          <div className="mt-6 p-5 rounded-xl border border-brand-green/40 bg-brand-green/5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-semibold text-brand-green">프로젝트 완주 축하합니다!</div>
            <div className="text-xs text-brand-textDim mt-1">
              모든 단계를 완료했어요. 다른 프로젝트에도 도전해 보세요.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
