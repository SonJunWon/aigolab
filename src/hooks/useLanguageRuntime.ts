import { useEffect, useState } from "react";
import { getRuntime } from "../runtime/registry";
import type { RunStatus, SupportedLanguage } from "../runtime/types";

/**
 * 특정 언어 런타임의 로딩 상태를 React 컴포넌트에서 구독하는 훅.
 *
 * 마운트 시 자동으로 init() 호출 (이미 호출됐으면 중복 무시).
 * language가 바뀌면 새 런타임을 init하고 상태를 다시 구독.
 */
export function useLanguageRuntime(language: SupportedLanguage = "python") {
  const runtime = getRuntime(language);

  const [status, setStatus] = useState<RunStatus>(runtime.getStatus());
  const [version, setVersion] = useState<string | null>(runtime.getVersion());

  useEffect(() => {
    // 컴포넌트 마운트 시 (또는 language 변경 시) 초기화 시작
    runtime.init().catch(() => {
      // 에러는 statusListener에서 처리
    });

    // 상태 동기화 (구독 직전 변경됐을 가능성 대비)
    setStatus(runtime.getStatus());
    setVersion(runtime.getVersion());

    const unsubscribe = runtime.onStatusChange((newStatus) => {
      setStatus(newStatus);
      if (newStatus === "ready") {
        setVersion(runtime.getVersion());
      }
    });

    return unsubscribe;
  }, [runtime]);

  return { status, version };
}
