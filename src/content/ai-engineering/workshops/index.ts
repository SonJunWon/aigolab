import type { Lesson, LessonSummary } from "../../../types/lesson";
import { workshopW00Windows } from "./w00-windows";
import { workshopW00Mac } from "./w00-mac";
import { workshopW01 } from "./w01-chatbot";

/**
 * 바이브코딩 워크샵.
 *
 * W00 Mac:  맥 환경 구축
 * W00 Win:  윈도우 환경 구축
 * W01:      나만의 AI 챗봇 만들기
 */
export const WORKSHOP_LESSONS: Lesson[] = [
  workshopW00Windows,
  workshopW00Mac,
  workshopW01,
];

export const WORKSHOP_SUMMARIES: LessonSummary[] = WORKSHOP_LESSONS.map(
  (l) => ({
    id: l.id,
    order: l.order,
    title: l.title,
    subtitle: l.subtitle,
    estimatedMinutes: l.estimatedMinutes,
  }),
);
