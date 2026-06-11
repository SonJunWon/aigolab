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
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-12">
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-sm text-brand-textDim hover:text-brand-primary transition-colors mb-5"
        >
          ← AI 강의 코스
        </Link>

        <header className="mb-6 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className={`shrink-0 grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${group.color} text-2xl sm:text-3xl`}>
              {group.icon}
            </div>
            <div>
              <div className="text-[10px] px-2 py-0.5 rounded-full bg-brand-subtle text-brand-textDim font-medium inline-block mb-1">
                코스 {group.order} · {courses.length}강
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{group.title}</h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-brand-textDim">{group.subtitle}</p>
        </header>

        <CourseCardList courses={courses} />

        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-xl border border-dashed border-brand-subtle text-center">
          <p className="text-brand-textDim text-sm">
            💡 일부 강의엔 <span className="text-brand-primary font-medium">브라우저에서 바로 실행되는 Python 실습</span>이 포함돼 있어요. 🔒 표시 강의는 PRO 출시 후 이용 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
