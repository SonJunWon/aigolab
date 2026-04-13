/**
 * AI 강의 코너 타입 정의.
 */

import type { Quiz } from "./quiz";
import type { Language } from "./lesson";

export type SectionType = "text" | "video" | "slide" | "link" | "code";

export interface CourseSection {
  /** 섹션 타입 */
  type: SectionType;
  /** 섹션 제목 (선택) */
  title?: string;
  /** 본문 — 마크다운(text) 또는 설명문(video/link/code 보조 설명) */
  content: string;
  /** 영상 URL (type="video" 시 YouTube URL) */
  videoUrl?: string;
  /** 이미지 URL 배열 (type="slide" 시) */
  images?: string[];
  /** 외부 링크 URL (type="link" 시) */
  linkUrl?: string;
  /** 외부 링크 설명 */
  linkLabel?: string;
  /** 실행할 초기 코드 (type="code" 시 필수) */
  code?: string;
  /** 코드 언어 (type="code" 시, 기본 python) */
  codeLanguage?: Language;
  /** 코드 블록 하단에 표시할 힌트 (선택) */
  codeHint?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  /** 강의 카테고리 */
  category: "ai-basics" | "ml" | "dl" | "data";
  /** 난이도 */
  level: "beginner" | "intermediate" | "advanced";
  /** 예상 시간 (분) */
  estimatedMinutes: number;
  /** 강의 순서 (로드맵 내) */
  order: number;
  /** 강의 섹션들 */
  sections: CourseSection[];
  /** 강의 끝 퀴즈 */
  quiz?: Quiz;
  /** 다음 추천 강의 ID */
  nextCourseId?: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  category: Course["category"];
  level: Course["level"];
  estimatedMinutes: number;
  order: number;
}
