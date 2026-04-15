/**
 * API 키 저장/조회 — localStorage + Web Crypto AES-GCM (T3).
 *
 * 저장 포맷 (localStorage['aigolab.llm.keys.v1']):
 * ```json
 * {
 *   "gemini": { "iv": "<b64>", "ct": "<b64>" },
 *   "groq":   { "iv": "<b64>", "ct": "<b64>" }
 * }
 * ```
 *
 * 평문이 아닌 이유 & 한계는 crypto.ts 상단 주석 참조.
 * 공개 API (get/set/remove/list/requireKey) 는 T2 시점과 동일 — 어댑터 수정 없음.
 */

import type { Provider } from "./types";
import { LlmError } from "./types";
import {
  decryptString,
  encryptString,
  isCiphertext,
  type Ciphertext,
} from "./crypto";

const STORAGE_KEY = "aigolab.llm.keys.v1";
type KeyMap = Partial<Record<Provider, Ciphertext>>;

function readAll(): KeyMap {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};

    // 구 평문 포맷(값이 string) 을 만나면 무시 + 자동 제거.
    // 아직 배포된 UI 없어 실제 사용자 데이터는 없음 — 안전.
    const clean: KeyMap = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (isCiphertext(v)) clean[k as Provider] = v;
    }
    // 찌꺼기가 있었으면 정리된 버전으로 다시 저장
    if (Object.keys(clean).length !== Object.keys(parsed).length) {
      writeAll(clean);
    }
    return clean;
  } catch {
    return {};
  }
}

function writeAll(map: KeyMap): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/**
 * 키 조회 — 없거나 복호화 실패 시 undefined.
 * 던지지 않는 이유: router 가 페일오버 판단하도록 "키 없음" 도 정상 흐름에 포함.
 */
export async function getKey(provider: Provider): Promise<string | undefined> {
  const enc = readAll()[provider];
  if (!enc) return undefined;
  try {
    return await decryptString(enc);
  } catch {
    // 디바이스 키가 사라졌거나 포맷 손상 — 해당 엔트리 자동 제거해서 재입력 유도
    await removeKey(provider);
    return undefined;
  }
}

/** 키 저장 — 디바이스 키로 AES-GCM 암호화 후 localStorage 에 기록 */
export async function setKey(provider: Provider, key: string): Promise<void> {
  if (!key || !key.trim()) {
    throw new LlmError(
      "invalid-key",
      `${provider} 키 값이 비어있습니다.`,
      provider,
    );
  }
  const enc = await encryptString(key.trim());
  const map = readAll();
  map[provider] = enc;
  writeAll(map);
}

/** 키 삭제 */
export async function removeKey(provider: Provider): Promise<void> {
  const map = readAll();
  delete map[provider];
  writeAll(map);
}

/** 저장된 provider 목록 (복호화 없이 메타만) */
export function listKeys(): Provider[] {
  return Object.keys(readAll()) as Provider[];
}

/**
 * 키 필수 조회 — 없으면 LlmError("missing-key") 던짐.
 * 어댑터 내부에서 키 없음을 명확히 표현하고 싶을 때 사용.
 */
export async function requireKey(provider: Provider): Promise<string> {
  const key = await getKey(provider);
  if (!key) {
    throw new LlmError(
      "missing-key",
      `${provider} API 키가 저장되어 있지 않습니다. 키 입력 모달에서 등록해주세요.`,
      provider,
    );
  }
  return key;
}
