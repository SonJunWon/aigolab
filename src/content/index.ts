/**
 * 콘텐츠 레지스트리 — 언어/트랙 조합에 대한 레슨을 찾는 진입점.
 */

import type { Language, Lesson, LessonSummary, Track } from "../types/lesson";
import {
  LESSONS as PY_BEGINNER,
  LESSON_SUMMARIES as PY_BEGINNER_SUMMARIES,
} from "./python/beginner";
import {
  LESSONS as PY_INTERMEDIATE,
  LESSON_SUMMARIES as PY_INTERMEDIATE_SUMMARIES,
} from "./python/intermediate";
import {
  LESSONS as PY_DS,
  LESSON_SUMMARIES as PY_DS_SUMMARIES,
} from "./python/data-science";
import {
  LESSONS as PY_ML,
  LESSON_SUMMARIES as PY_ML_SUMMARIES,
} from "./python/ml-practice";

type Curriculum = {
  lessons: Lesson[];
  summaries: LessonSummary[];
};

const CURRICULA: Partial<Record<Language, Partial<Record<Track, Curriculum>>>> = {
  python: {
    beginner: {
      lessons: PY_BEGINNER,
      summaries: PY_BEGINNER_SUMMARIES,
    },
    intermediate: {
      lessons: PY_INTERMEDIATE,
      summaries: PY_INTERMEDIATE_SUMMARIES,
    },
    "data-science": {
      lessons: PY_DS,
      summaries: PY_DS_SUMMARIES,
    },
    "ml-practice": {
      lessons: PY_ML,
      summaries: PY_ML_SUMMARIES,
    },
  },
  // javascript: { ... }  // 추후
};

export function getCurriculum(
  language: Language,
  track: Track
): Curriculum | undefined {
  return CURRICULA[language]?.[track];
}

export function getLessonById(
  language: Language,
  track: Track,
  lessonId: string
): Lesson | undefined {
  return getCurriculum(language, track)?.lessons.find((l) => l.id === lessonId);
}
