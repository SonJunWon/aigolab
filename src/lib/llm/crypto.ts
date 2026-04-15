/**
 * LLM API 키용 대칭 암호화 — Web Crypto AES-GCM 256bit.
 *
 * 설계 목표: **방어심도 추가**.
 * - 디바이스별 AES-GCM 키를 IndexedDB 에 **non-extractable** 로 저장.
 *   → XSS 공격자가 key 자체를 외부 서버로 빼낼 수 없음
 *   → 단, XSS 실행 중 subtle.decrypt 호출은 여전히 가능 (완벽 방어 아님)
 * - localStorage 평문 저장 대비 "정적 dump 당해도 즉시 유출되지 않음" 이 핵심 이득.
 *
 * 별도 DB 사용: 레슨 저장소(notebooks 등)와 섞지 않도록 `aigolab-llm-crypto` 분리.
 */

import { openDB, type IDBPDatabase, type DBSchema } from "idb";

const DB_NAME = "aigolab-llm-crypto";
const DB_VERSION = 1;
const STORE_NAME = "keys";
const DEVICE_KEY_ID = "device-key";

interface LlmCryptoDB extends DBSchema {
  keys: {
    key: string;
    value: CryptoKey;
  };
}

let dbPromise: Promise<IDBPDatabase<LlmCryptoDB>> | null = null;

function getDb(): Promise<IDBPDatabase<LlmCryptoDB>> {
  if (!dbPromise) {
    dbPromise = openDB<LlmCryptoDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

/**
 * 디바이스 고유 AES-GCM 키 조회 또는 생성.
 * extractable=false 로 만들어지므로 `subtle.exportKey` 호출도 실패 —
 * 공격자가 이 키 자체를 복사해 다른 환경으로 옮길 수 없다.
 */
async function getOrCreateDeviceKey(): Promise<CryptoKey> {
  const db = await getDb();
  const existing = (await db.get(STORE_NAME, DEVICE_KEY_ID)) as CryptoKey | undefined;
  if (existing) return existing;

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    /* extractable */ false,
    ["encrypt", "decrypt"],
  );
  await db.put(STORE_NAME, key, DEVICE_KEY_ID);
  return key;
}

/** 암호문 + IV 쌍. IV 는 호출 때마다 새로 (AES-GCM 재사용 금지) */
export interface Ciphertext {
  iv: string; // base64
  ct: string; // base64
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  // ArrayBuffer 로 명시해 SubtleCrypto 의 BufferSource 제약 만족
  const buf = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** 평문 문자열 → {iv, ct} */
export async function encryptString(plaintext: string): Promise<Ciphertext> {
  const key = await getOrCreateDeviceKey();
  // 96-bit IV 는 AES-GCM 권장값
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext),
  );
  return { iv: toBase64(iv), ct: toBase64(ct) };
}

/** {iv, ct} → 평문 */
export async function decryptString(payload: Ciphertext): Promise<string> {
  const key = await getOrCreateDeviceKey();
  const iv = fromBase64(payload.iv);
  const ct = fromBase64(payload.ct);
  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ct,
  );
  return decoder.decode(plainBuf);
}

/**
 * Ciphertext 형태 검증 — 구 평문 포맷과 구분할 때 사용.
 */
export function isCiphertext(value: unknown): value is Ciphertext {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Ciphertext).iv === "string" &&
    typeof (value as Ciphertext).ct === "string"
  );
}

/**
 * 테스트·초기화용 — 디바이스 키 자체를 삭제해 모든 저장 키를 복호화 불가 상태로.
 * 로그아웃·보안 리셋 플로우에서만 호출.
 */
export async function resetDeviceKey(): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, DEVICE_KEY_ID);
}
