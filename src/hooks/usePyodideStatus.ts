import { useEffect, useState } from "react";
import { pythonRunner, type RunStatus } from "../runtime/pythonRunner";

/**
 * Pyodide 로딩 상태를 React 컴포넌트에서 구독하는 훅.
 * 마운트 시 자동으로 init() 호출 (이미 호출됐으면 중복 무시).
 */
export function usePyodideStatus() {
  const [status, setStatus] = useState<RunStatus>(pythonRunner.getStatus());
  const [version, setVersion] = useState<string | null>(pythonRunner.getVersion());

  useEffect(() => {
    // 컴포넌트 마운트 시 초기화 시작
    pythonRunner.init().catch(() => {
      // 에러는 statusListener에서 처리
    });

    const unsubscribe = pythonRunner.onStatusChange((newStatus) => {
      setStatus(newStatus);
      if (newStatus === "ready") {
        setVersion(pythonRunner.getVersion());
      }
    });

    return unsubscribe;
  }, []);

  return { status, version };
}
