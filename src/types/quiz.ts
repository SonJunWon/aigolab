/**
 * 퀴즈 도메인 타입.
 *
 * 각 챕터 끝에 인라인으로 표시되는 이해도 확인 퀴즈.
 */

export type QuizType = "multiple-choice" | "predict-output";

export interface QuizQuestion {
  /** 문제 유형 */
  type: QuizType;
  /** 질문 텍스트 (마크다운 가능) */
  question: string;
  /** 코드 블록 — "predict-output" 유형에서 코드를 보여줄 때 */
  code?: string;
  /** 선택지 (4개 권장) */
  options: string[];
  /** 정답 인덱스 (0-based) */
  correctIndex: number;
  /** 정답/오답 후 보여줄 해설 */
  explanation: string;
}

export interface Quiz {
  /** 퀴즈 제목 (예: "챕터 1 퀴즈") */
  title: string;
  /** 문제 목록 */
  questions: QuizQuestion[];
}
