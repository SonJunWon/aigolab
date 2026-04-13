import type { Course, CourseSummary } from "../../types/course";
import { course01 } from "./01-what-is-ai";
import { course02 } from "./02-ml-basics";
import { course03 } from "./03-data-and-ai";
import { course04 } from "./04-deep-learning";
import { course05 } from "./05-nlp-basics";
import { course06 } from "./06-generative-ai";
import { course07 } from "./07-prompt-engineering";
import { course08 } from "./08-computer-vision";
import { course09 } from "./09-ai-ethics";
import { course10 } from "./10-ai-agents";

export const COURSES: Course[] = [
  course01,
  course02,
  course03,
  course04,
  course05,
  course06,
  course07,
  course08,
  course09,
  course10,
];

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
