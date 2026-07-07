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
import {
  LESSONS as JS_BEGINNER,
  LESSON_SUMMARIES as JS_BEGINNER_SUMMARIES,
} from "./javascript/beginner";
import {
  LESSONS as SQL_BEGINNER,
  LESSON_SUMMARIES as SQL_BEGINNER_SUMMARIES,
} from "./sql/beginner";
import {
  LESSONS as AIENG_BEGINNER,
  LESSON_SUMMARIES as AIENG_BEGINNER_SUMMARIES,
} from "./ai-engineering/beginner";
import {
  LESSONS as AIENG_INTRO,
  LESSON_SUMMARIES as AIENG_INTRO_SUMMARIES,
} from "./ai-engineering/intro";
import {
  LESSONS as AIENG_INTERMEDIATE1,
  LESSON_SUMMARIES as AIENG_INTERMEDIATE1_SUMMARIES,
} from "./ai-engineering/intermediate1";
import {
  LESSONS as AIENG_INTERMEDIATE2,
  LESSON_SUMMARIES as AIENG_INTERMEDIATE2_SUMMARIES,
} from "./ai-engineering/intermediate2";
import {
  LESSONS as AIENG_FRIENDLY,
  LESSON_SUMMARIES as AIENG_FRIENDLY_SUMMARIES,
} from "./ai-engineering/friendly-preview";
import {
  LESSONS as AIENG_MCP,
  LESSON_SUMMARIES as AIENG_MCP_SUMMARIES,
} from "./ai-engineering/mcp-special";
import {
  LESSONS as AIENG_ADVANCED1,
  LESSON_SUMMARIES as AIENG_ADVANCED1_SUMMARIES,
} from "./ai-engineering/advanced1";
import { WORKSHOP_LESSONS } from "./ai-engineering/workshops";

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
  javascript: {
    beginner: {
      lessons: JS_BEGINNER,
      summaries: JS_BEGINNER_SUMMARIES,
    },
    // 다른 트랙은 추후
  },
  sql: {
    beginner: {
      lessons: SQL_BEGINNER,
      summaries: SQL_BEGINNER_SUMMARIES,
    },
    // SQL은 입문만 (현재)
  },
  "ai-engineering": {
    intro: {
      lessons: AIENG_INTRO,
      summaries: AIENG_INTRO_SUMMARIES,
    },
    beginner: {
      // 12강 + 워크샵을 합쳐서 getLessonById 가 워크샵 레슨도 찾을 수 있게
      // 커리큘럼 페이지에는 12강만 표시 (summaries 는 12강만)
      lessons: [...AIENG_BEGINNER, ...WORKSHOP_LESSONS],
      summaries: AIENG_BEGINNER_SUMMARIES,
    },
    intermediate1: {
      lessons: AIENG_INTERMEDIATE1,
      summaries: AIENG_INTERMEDIATE1_SUMMARIES,
    },
    "mcp-special": {
      lessons: AIENG_MCP,
      summaries: AIENG_MCP_SUMMARIES,
    },
    intermediate2: {
      lessons: AIENG_INTERMEDIATE2,
      summaries: AIENG_INTERMEDIATE2_SUMMARIES,
    },
    advanced1: {
      lessons: AIENG_ADVANCED1,
      summaries: AIENG_ADVANCED1_SUMMARIES,
    },
    "friendly-preview": {
      lessons: AIENG_FRIENDLY,
      summaries: AIENG_FRIENDLY_SUMMARIES,
    },
  },
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
