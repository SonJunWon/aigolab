/**
 * 언어별 LanguageRuntime 레지스트리.
 *
 * 새 언어 추가 절차:
 *   1. src/runtime/<lang>Runner.ts 작성 (LanguageRuntime 구현)
 *   2. 아래 RUNTIMES에 등록
 *   3. types.ts SupportedLanguage 유니온에 추가
 *
 * 소비자(runCell, fileRunner, useLanguageRuntime)는 이 모듈만 import 한다.
 */

import { pythonRunner } from "./pythonRunner";
import type { LanguageRuntime, SupportedLanguage } from "./types";

const RUNTIMES: Partial<Record<SupportedLanguage, LanguageRuntime>> = {
  python: pythonRunner,
  // javascript: javascriptRunner,  // 3.0.0-2 단계에서 추가
  // sql: sqlRunner,                 // 3.0.0-4 단계에서 추가
};

/**
 * 해당 언어의 런타임 반환.
 * 미등록 언어면 throw — 호출 측에서 isLanguageSupported로 미리 체크 권장.
 */
export function getRuntime(language: SupportedLanguage): LanguageRuntime {
  const runtime = RUNTIMES[language];
  if (!runtime) {
    throw new Error(
      `[runtime] 언어가 아직 지원되지 않습니다: ${language}. ` +
        `등록된 런타임: ${Object.keys(RUNTIMES).join(", ")}`
    );
  }
  return runtime;
}

/** 사용자 입력 등 신뢰할 수 없는 문자열을 SupportedLanguage로 좁힘 */
export function isLanguageSupported(
  language: string
): language is SupportedLanguage {
  return language in RUNTIMES;
}

/** 현재 등록된(실제 동작 가능한) 언어 목록 */
export function getRegisteredLanguages(): SupportedLanguage[] {
  return Object.keys(RUNTIMES) as SupportedLanguage[];
}
