/**
 * @deprecated v3.0.0부터 useLanguageRuntime("python")의 별칭입니다.
 * 새 코드는 useLanguageRuntime을 직접 사용하세요.
 */

import { useLanguageRuntime } from "./useLanguageRuntime";

export function usePyodideStatus() {
  return useLanguageRuntime("python");
}
