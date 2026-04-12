import type { Course, CourseSummary } from "../../types/course";
import { course01 } from "./01-what-is-ai";
import { course02 } from "./02-ml-basics";
import { course03 } from "./03-data-and-ai";

export const COURSES: Course[] = [course01, course02, course03];

export const COURSE_SUMMARIES: CourseSummary[] = COURSES.map((c) => ({
  id: c.id,
  title: c.title,
  subtitle: c.subtitle,
  icon: c.icon,
  category: c.category,
  level: c.level,
  estimatedMinutes: c.estimatedMinutes,
  order: c.order,
}));

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
