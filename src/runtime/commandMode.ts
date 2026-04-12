/**
 * Notebook command mode 상태.
 *
 * Esc 또는 Ctrl+M을 누르면 1.5초 동안 command mode가 활성화되고,
 * 그 동안 단일 키(B, A, M, Y, D D)를 누르면 셀 액션이 실행된다.
 *
 * 모듈 레벨 변수로 두는 이유:
 *   - Monaco editor의 addAction 콜백 (CodeCell)과
 *     글로벌 keydown 핸들러 (useNotebookShortcuts) 양쪽에서
 *     같은 상태를 공유해야 하기 때문.
 */

interface CommandModeState {
  active: boolean;
  /** "D"가 한 번 눌렸으면 "D"가 들어있음 — 두 번째 D 대기용 */
  pendingDelete: boolean;
  timer: number | null;
}

const state: CommandModeState = {
  active: false,
  pendingDelete: false,
  timer: null,
};

const TIMEOUT_MS = 1500;

function clearTimer() {
  if (state.timer !== null) {
    clearTimeout(state.timer);
    state.timer = null;
  }
}

function startTimer() {
  clearTimer();
  state.timer = window.setTimeout(() => {
    state.active = false;
    state.pendingDelete = false;
    state.timer = null;
  }, TIMEOUT_MS);
}

export function activateCommandMode() {
  state.active = true;
  state.pendingDelete = false;
  startTimer();
}

export function deactivateCommandMode() {
  state.active = false;
  state.pendingDelete = false;
  clearTimer();
}

export function isCommandModeActive(): boolean {
  return state.active;
}

export function markPendingDelete() {
  state.pendingDelete = true;
  startTimer();
}

export function isPendingDelete(): boolean {
  return state.pendingDelete;
}
