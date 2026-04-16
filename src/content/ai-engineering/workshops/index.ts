import type { Lesson, LessonSummary } from "../../../types/lesson";
import { workshopW00 } from "./w00-dev-environment";

/**
 * 바이브코딩 워크샵.
 *
 * 12강 커리큘럼(beginner/)과 별도로, 실전 프로젝트 빌드 가이드.
 * 재사용 가능한 MD 레시피 파일 + AI 코딩 도구로 완성도 있는 프로그램 제작.
 *
 * W00: 내 컴퓨터를 AI 작업실로 (맥/윈도우 환경 구축)
 * W01: (예정) 나만의 AI 챗봇
 * W02: (예정) 문서 Q&A 봇
 * W03: (예정) AI 이메일 비서
 */
export const WORKSHOP_LESSONS: Lesson[] = [workshopW00];

export const WORKSHOP_SUMMARIES: LessonSummary[] = WORKSHOP_LESSONS.map(
  (l) => ({
    id: l.id,
    order: l.order,
    title: l.title,
    subtitle: l.subtitle,
    estimatedMinutes: l.estimatedMinutes,
  }),
);
