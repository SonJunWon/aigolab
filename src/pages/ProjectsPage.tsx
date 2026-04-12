import { Link } from "react-router-dom";
import { PROJECTS } from "../content/projects";

export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">🧪 AI 프로젝트</h1>
          <p className="text-brand-textDim">실제 데이터로 머신러닝 모델을 만들어보세요. 브라우저에서 바로 실행!</p>
        </header>
        <div className="space-y-4">
          {PROJECTS.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`}
              className="block p-6 rounded-xl border border-brand-subtle bg-brand-panel hover:border-brand-primary/50 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-5">
                <div className="text-4xl shrink-0">{p.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary">{p.difficulty === "beginner" ? "입문" : "중급"}</span>
                    {p.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-subtle text-brand-textDim">{t}</span>)}
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-brand-primary transition-colors">{p.title}</h3>
                  <p className="text-sm text-brand-textDim">{p.subtitle}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-brand-textDim">약 {p.estimatedMinutes}분</div>
                  <span className="text-xl text-brand-textDim group-hover:text-brand-primary transition-all">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
