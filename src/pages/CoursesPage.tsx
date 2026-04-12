import { Link } from "react-router-dom";
import { COURSE_SUMMARIES } from "../content/courses";

const levelLabel = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
};

const categoryLabel = {
  "ai-basics": "AI 기초",
  ml: "머신러닝",
  dl: "딥러닝",
  data: "데이터",
};

export function CoursesPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">📚 AI 강의</h1>
          <p className="text-brand-textDim">
            AI/머신러닝/딥러닝 이론을 단계별로 배워보세요.
          </p>
        </header>

        <div className="space-y-4">
          {COURSE_SUMMARIES.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="block p-6 rounded-xl border border-brand-subtle bg-brand-panel
                         hover:border-brand-primary/50 hover:shadow-lg hover:shadow-brand-primary/5
                         transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="shrink-0 text-4xl">{course.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary font-medium">
                      {categoryLabel[course.category]}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-subtle text-brand-textDim">
                      {levelLabel[course.level]}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
                    {course.title}
                  </h3>
                  {course.subtitle && (
                    <p className="text-sm text-brand-textDim mt-0.5">
                      {course.subtitle}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-brand-textDim">
                    약 {course.estimatedMinutes}분
                  </div>
                  <span className="text-brand-textDim group-hover:text-brand-primary group-hover:translate-x-1 transition-all inline-block text-xl mt-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 추가 예정 안내 */}
        <div className="mt-10 p-6 rounded-xl border border-dashed border-brand-subtle text-center">
          <p className="text-brand-textDim text-sm">
            🚧 머신러닝 실습, 딥러닝 기초 등 더 많은 강의가 준비 중입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
