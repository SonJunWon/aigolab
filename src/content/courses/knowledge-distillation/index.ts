import type { Course } from "../../../types/course";
import { kd01 } from "./kd-01-roadmap";
import { kd02 } from "./kd-02-what-is-distillation";
import { kd03 } from "./kd-03-soft-labels";
import { kd04 } from "./kd-04-temperature-kl";
import { kd05 } from "./kd-05-distillation-types";
import { kd06 } from "./kd-06-scaling-law";
import { kd07 } from "./kd-07-chinchilla";
import { kd08 } from "./kd-08-2026-scaling";
import { kd09 } from "./kd-09-moe-basics";
import { kd10 } from "./kd-10-routing-balance";
import { kd11 } from "./kd-11-deepseek-moe";
import { kd12 } from "./kd-12-sft-concept";
import { kd13 } from "./kd-13-finetuning-general";

/**
 * 코스 2 「지식 증류」 강의 묶음 (기획: AI앱개발/AI 강의 코스/02-지식증류-커리큘럼.md, 총 34강).
 * 집필되는 대로 여기에 추가하고, content/courses/groups.ts 의 knowledge-distillation.courseIds 에 id를 넣는다.
 * 8강(모듈 1·2) 이상 모이면 그룹 status를 "available"로 전환해 메뉴에 노출.
 */
export const KD_COURSES: Course[] = [
  kd01, kd02, kd03, kd04, kd05, kd06, kd07, kd08,
  kd09, kd10, kd11, kd12, kd13,
];

/** groups.ts 가 courseIds 를 자동으로 받도록 id 순서 배열 제공 */
export const KD_COURSE_IDS: string[] = KD_COURSES.map((c) => c.id);
