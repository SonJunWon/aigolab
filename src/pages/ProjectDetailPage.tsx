import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../content/projects";
import { Markdown } from "../components/Markdown";
import { useFileStore } from "../store/fileStore";
import { useStudyTimeTracking } from "../hooks/useStudyTimeTracking";

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;
  const navigate = useNavigate();
  const loadProject = useFileStore((s) => s.loadProject);

  // 학습 시간 추적
  useStudyTimeTracking(!!project);

  if (!project) return <Navigate to="/projects" replace />;

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
          <Link to="/projects" className="text-sm text-brand-textDim hover:text-brand-primary transition-colors">← 프로젝트 목록</Link>
        </nav>
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
          </div>
        </header>

        <Markdown content={project.description} />

        <section className="mt-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">📋 단계별 가이드</h2>
          <div className="space-y-3">
            {project.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-brand-subtle bg-brand-panel">
                <span className="shrink-0 w-7 h-7 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-sm text-brand-text">{step}</span>
              </div>
            ))}
          </div>
        </section>

        <button onClick={handleOpenIDE}
          className="w-full py-3 rounded-xl bg-brand-primary text-white font-medium text-sm hover:bg-brand-primaryDim transition-colors">
          💻 IDE에서 프로젝트 시작하기
        </button>
      </div>
    </div>
  );
}
