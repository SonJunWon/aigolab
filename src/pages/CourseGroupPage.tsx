import { Link, useParams, Navigate } from "react-router-dom";
import { COURSE_SUMMARIES } from "../content/courses";
import { getCourseGroup } from "../content/courses/groups";
import { CourseCardList } from "../components/course/CourseCardList";

/**
 * 코스 그룹 상세 — /courses/group/:groupId.
 * 그룹에 속한 AI 강의 목록을 보여준다. 준비 중·없는 그룹은 /courses 로 돌려보냄.
 */
export function CourseGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const group = groupId ? getCourseGroup(groupId) : undefined;

  // 없는 그룹이거나 아직 준비 중(강의 없음)이면 메뉴로
  if (!group || group.status !== "available") {
    return <Navigate to="/courses" replace />;
  }

  // group.courseIds 순서대로 강의 요약을 정렬
  const courses = group.courseIds
    .map((id) => COURSE_SUMMARIES.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider
                     text-brand-textDim hover:text-brand-primary transition-colors mb-8"
        >
          ← COURSES
        </Link>

        <header className="mb-10 sm:mb-14">
          <div className="flex items-baseline justify-between pb-4 border-b border-brand-line mb-6">
            <span className="mono-label">
              COURSE {String(group.order).padStart(2, "0")} / {courses.length} LESSONS
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
            {group.title}
            <span className="text-brand-primary">.</span>
          </h1>
          <p className="text-base sm:text-lg text-brand-textDim max-w-2xl">{group.subtitle}</p>
        </header>

        <CourseCardList courses={courses} />

        <div className="mt-10 sm:mt-14 flex items-baseline gap-4">
          <span className="mono-label shrink-0">NOTE</span>
          <p className="text-base text-brand-textDim">
            일부 강의엔{" "}
            <span className="text-brand-primary font-medium">
              브라우저에서 바로 실행되는 Python 실습
            </span>
            이 포함돼 있어요. 잠금 표시 강의는 PRO 출시 후 이용 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
