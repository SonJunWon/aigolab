import type { Lesson, LessonSummary } from "../../../types/lesson";
import { workshopW00 } from "./w00-dev-environment";
import { workshopW01 } from "./w01-chatbot";

/**
 * 바이브코딩 워크샵.
 *
 * W00: 내 컴퓨터를 AI 작업실로 (맥/윈도우 환경 구축)
 * W01: 나만의 AI 챗봇 만들기
 * W02: (예정) 문서 Q&A 봇
 * W03: (예정) AI 이메일 비서
 */
export const WORKSHOP_LESSONS: Lesson[] = [workshopW00, workshopW01];

export const WORKSHOP_SUMMARIES: LessonSummary[] = WORKSHOP_LESSONS.map(
  (l) => ({
    id: l.id,
    order: l.order,
    title: l.title,
    subtitle: l.subtitle,
    estimatedMinutes: l.estimatedMinutes,
  }),
);
