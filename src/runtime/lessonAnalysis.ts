/**
 * 챕터 셀 정적 분석 — 셰도잉(이름 충돌) 감지.
 *
 * 정규식 기반 (Python AST가 이상적이지만 매 실행마다 호출하기엔 무거움).
 * 80% 정확도 목표 — 명백한 충돌 케이스를 잡고 들여쓰기 안의 정의 등은 무시.
 *
 * 주의: JavaScript는 셀 단위 격리라 셰도잉 영향 없음 → Python에만 적용.
 */

import { PYTHON_BUILTINS, suggestAlternativeNames } from "./pythonBuiltins";

/** 한 셀에서 정의되는 최상위 이름들 (def, class, 전역 변수) */
export interface CellDefinitions {
  /** def 함수 이름들 */
  functions: string[];
  /** class 클래스 이름들 */
  classes: string[];
  /** 최상위 변수 이름들 (들여쓰기 없는 좌변 대입) */
  variables: string[];
}

/**
 * Python 코드에서 최상위에 정의되는 이름 추출.
 *
 * 매칭 규칙 (대략):
 * - `def 이름(...)` / `async def 이름(...)`
 * - `class 이름...`
 * - `이름 = ...` (들여쓰기 없는 줄, 단일 좌변)
 *
 * 한계 (의도적 단순화):
 * - 튜플 언팩 `a, b = 1, 2` 는 미지원
 * - 들여쓰기 안의 정의는 미지원 (지역 변수)
 * - 주석/문자열 안의 코드는 가짜 매칭 가능 (드물어 무시)
 */
export function extractDefinedNames(code: string): CellDefinitions {
  const functions: string[] = [];
  const classes: string[] = [];
  const variables: string[] = [];

  const lines = code.split("\n");
  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, ""); // 라인 끝 주석 제거

    // 함수 정의 (들여쓰기 없는 줄만)
    const fnMatch = /^(?:async\s+)?def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/.exec(line);
    if (fnMatch) {
      functions.push(fnMatch[1]);
      continue;
    }

    // 클래스 정의
    const classMatch = /^class\s+([A-Za-z_][A-Za-z0-9_]*)\s*[:(]/.exec(line);
    if (classMatch) {
      classes.push(classMatch[1]);
      continue;
    }

    // 최상위 변수 대입 (들여쓰기 없음, 단일 식별자, 비교 연산자 아님)
    const varMatch = /^([A-Za-z_][A-Za-z0-9_]*)\s*=(?!=)/.exec(line);
    if (varMatch) {
      // += -= 등 연산 대입은 변수 정의가 아니라 갱신 — 1차 매치 후 추가 검사
      const op = line.slice(varMatch[0].length - 1, varMatch[0].length + 1);
      if (op !== "==") {
        // += -= *= /= 같은 복합 대입은 첫 글자가 영문이라 매칭 안 됨 (안전)
        variables.push(varMatch[1]);
      }
    }
  }

  return { functions, classes, variables };
}

/** 충돌 발견 결과 */
export interface ShadowConflict {
  name: string;
  /** 충돌 종류 */
  kind: "builtin" | "function" | "class" | "variable";
  /** 셀 충돌 시 어느 셀(0-based 인덱스)에서 정의되는지 */
  conflictCellIndex?: number;
  /** 사용자에게 제안할 대체 이름 */
  suggestions: string[];
}

/**
 * 현재 셀에서 새로 만드는 변수가 (1) 빌트인 또는 (2) 다른 셀의 함수/클래스/변수 와
 * 충돌하는지 검사.
 *
 * @param currentCellSource 사용자가 실행하려는 셀 소스
 * @param currentCellIndex  현재 셀의 인덱스 (자기 자신은 검사 제외)
 * @param allCellSources    챕터의 모든 코드 셀 소스 (인덱스 순서대로)
 */
export function analyzeCellShadowing(
  currentCellSource: string,
  currentCellIndex: number,
  allCellSources: string[]
): ShadowConflict[] {
  const currentDefs = extractDefinedNames(currentCellSource);
  const conflicts: ShadowConflict[] = [];

  // 사용자가 변수로 새로 만드는 이름들만 검사 (함수/클래스 정의는 의도적 케이스 많음)
  const newVariableNames = currentDefs.variables;

  for (const name of newVariableNames) {
    // 1. 빌트인 충돌
    if (PYTHON_BUILTINS.has(name)) {
      conflicts.push({
        name,
        kind: "builtin",
        suggestions: suggestAlternativeNames(name),
      });
      continue;
    }

    // 2. 다른 셀에서 정의된 이름과 충돌
    for (let i = 0; i < allCellSources.length; i++) {
      if (i === currentCellIndex) continue;
      const otherDefs = extractDefinedNames(allCellSources[i]);
      if (otherDefs.functions.includes(name)) {
        conflicts.push({
          name,
          kind: "function",
          conflictCellIndex: i,
          suggestions: [`my_${name}`, `${name}_value`, `result`],
        });
        break;
      }
      if (otherDefs.classes.includes(name)) {
        conflicts.push({
          name,
          kind: "class",
          conflictCellIndex: i,
          suggestions: [`my_${name}`, `${name}_instance`, `obj`],
        });
        break;
      }
    }
  }

  return conflicts;
}

/**
 * 충돌 메시지를 사람 읽기 좋은 한 줄로 포맷.
 */
export function formatConflictMessage(conflict: ShadowConflict): string {
  const suggestionList = conflict.suggestions.slice(0, 3).join(", ");

  switch (conflict.kind) {
    case "builtin":
      return (
        `⚠️ '${conflict.name}' 은(는) Python의 빌트인이라, 변수로 쓰면 ` +
        `이후에 ${conflict.name}() 호출이 막힐 수 있어요.\n` +
        `   추천 이름: ${suggestionList}`
      );
    case "function":
      return (
        `⚠️ '${conflict.name}' 은(는) 이 챕터 ${
          (conflict.conflictCellIndex ?? 0) + 1
        }번째 셀에서 함수로 정의돼요. 변수로 미리 쓰면 충돌해요.\n` +
        `   추천 이름: ${suggestionList}`
      );
    case "class":
      return (
        `⚠️ '${conflict.name}' 은(는) 이 챕터 ${
          (conflict.conflictCellIndex ?? 0) + 1
        }번째 셀에서 클래스로 정의돼요. 변수로 미리 쓰면 충돌해요.\n` +
        `   추천 이름: ${suggestionList}`
      );
    default:
      return `⚠️ '${conflict.name}' 이름 충돌 가능성. 추천: ${suggestionList}`;
  }
}
