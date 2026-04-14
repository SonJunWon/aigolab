/**
 * usePaywall — 페이지 레벨에서 Paywall 모달을 쓰기 위한 헬퍼 훅.
 *
 * 사용 예:
 *   const { showPaywall, modal } = usePaywall();
 *
 *   <button onClick={() => showPaywall({ title: "...", kind: "AI 강의" })}>
 *     ...
 *   </button>
 *
 *   {modal}  // 페이지 JSX 어딘가에 렌더
 */

import { useCallback, useState } from "react";
import { PaywallModal, type PaywallContext } from "./PaywallModal";

export function usePaywall() {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<PaywallContext | null>(null);

  const showPaywall = useCallback((ctx: PaywallContext) => {
    setContext(ctx);
    setOpen(true);
  }, []);

  const closePaywall = useCallback(() => {
    setOpen(false);
  }, []);

  const modal = (
    <PaywallModal open={open} onClose={closePaywall} context={context} />
  );

  return { showPaywall, closePaywall, modal };
}
