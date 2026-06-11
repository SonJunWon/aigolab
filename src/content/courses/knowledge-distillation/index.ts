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
import { kd14 } from "./kd-14-why-sft";
import { kd15 } from "./kd-15-fft";
import { kd16 } from "./kd-16-peft-lora";
import { kd17 } from "./kd-17-qlora";
import { kd18 } from "./kd-18-trl-unsloth";
import { kd19 } from "./kd-19-lora-hyperparams";
import { kd20 } from "./kd-20-lora-plus";
import { kd21 } from "./kd-21-dora";
import { kd22 } from "./kd-22-adalora";
import { kd23 } from "./kd-23-data-synthesis";
import { kd24 } from "./kd-24-adapter-merge";
import { kd25 } from "./kd-25-data-quality-lima";
import { kd26 } from "./kd-26-data-collection";
import { kd27 } from "./kd-27-llm-generation-gate";
import { kd28 } from "./kd-28-cleaning-basic";
import { kd29 } from "./kd-29-cleaning-safety";
import { kd30 } from "./kd-30-pipeline";
import { kd31 } from "./kd-31-trl-sft-capstone";
import { kd32 } from "./kd-32-instruction-tuning";
import { kd33 } from "./kd-33-continuous-learning";
import { kd34 } from "./kd-34-llm-as-judge";

/**
 * 코스 2 「지식 증류」 강의 묶음 (기획: AI앱개발/AI 강의 코스/02-지식증류-커리큘럼.md, 총 34강).
 * ✅ 모듈 0~6 전체 34강 완성(kd-01~34). 그룹 status "available", groups.ts courseIds 34개.
 */
export const KD_COURSES: Course[] = [
  kd01, kd02, kd03, kd04, kd05, kd06, kd07, kd08,
  kd09, kd10, kd11, kd12, kd13,
  kd14, kd15, kd16, kd17, kd18,
  kd19, kd20, kd21, kd22, kd23, kd24,
  kd25, kd26, kd27, kd28, kd29, kd30,
  kd31, kd32, kd33, kd34,
];

/** groups.ts 가 courseIds 를 자동으로 받도록 id 순서 배열 제공 */
export const KD_COURSE_IDS: string[] = KD_COURSES.map((c) => c.id);
