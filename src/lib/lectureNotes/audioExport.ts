/**
 * 녹음 원본 다운로드 — 청크(5분 완결형 webm)를 무손실 그대로 내보낸다.
 *
 * 청크 1개면 .webm 단일 파일, 여러 개면 무압축 ZIP 하나로 묶는다.
 * webm 은 브라우저에서 무손실 병합이 불가하고(각 청크가 독립 컨테이너),
 * WAV 변환은 용량이 10배 이상 커지므로 원본 그대로가 최선.
 * ZIP 은 store(무압축) 방식으로 직접 생성 — opus 는 이미 압축돼 있어 손해 없음.
 */

import { getSessionChunks } from "./db";
import type { LectureNote } from "./types";

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosDateTime(d: Date): { time: number; date: number } {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
    date: (((d.getFullYear() - 1980) & 0x7f) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

/** 무압축(store) ZIP 생성. 파일명은 UTF-8 플래그(bit 11)로 기록 — macOS/Windows 한글 안전 */
export async function buildZip(files: { name: string; blob: Blob }[], stamp: Date): Promise<Blob> {
  const enc = new TextEncoder();
  const { time, date } = dosDateTime(stamp);
  const parts: BlobPart[] = [];
  const central: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const data = new Uint8Array(await f.blob.arrayBuffer());
    const crc = crc32(data);

    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); // local file header
    lh.setUint16(4, 20, true); // version needed
    lh.setUint16(6, 0x0800, true); // UTF-8 filename
    lh.setUint16(8, 0, true); // method: store
    lh.setUint16(10, time, true);
    lh.setUint16(12, date, true);
    lh.setUint32(14, crc, true);
    lh.setUint32(18, data.length, true);
    lh.setUint32(22, data.length, true);
    lh.setUint16(26, nameBytes.length, true);
    lh.setUint16(28, 0, true);
    parts.push(lh.buffer, nameBytes, data);

    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); // central directory entry
    ch.setUint16(4, 20, true); // version made by
    ch.setUint16(6, 20, true); // version needed
    ch.setUint16(8, 0x0800, true);
    ch.setUint16(10, 0, true);
    ch.setUint16(12, time, true);
    ch.setUint16(14, date, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, data.length, true);
    ch.setUint32(24, data.length, true);
    ch.setUint16(28, nameBytes.length, true);
    ch.setUint32(42, offset, true);
    const entry = new Uint8Array(46 + nameBytes.length);
    entry.set(new Uint8Array(ch.buffer), 0);
    entry.set(nameBytes, 46);
    central.push(entry);

    offset += 30 + nameBytes.length + data.length;
  }

  for (const e of central) parts.push(e);
  const centralSize = central.reduce((s, e) => s + e.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); // end of central directory
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);
  parts.push(end.buffer);

  return new Blob(parts, { type: "application/zip" });
}

function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim().slice(0, 80) || "강의녹음";
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * 노트의 보관 오디오를 다운로드한다.
 * 반환값 = 실제 저장된 파일명. 보관 오디오가 없으면 throw.
 */
export async function downloadSessionAudio(note: LectureNote): Promise<string> {
  const chunks = await getSessionChunks(note.id);
  if (chunks.length === 0) throw new Error("보관된 오디오가 없습니다.");
  const base = sanitizeFilename(note.title);

  if (chunks.length === 1) {
    const filename = `${base}.webm`;
    triggerDownload(chunks[0].blob, filename);
    return filename;
  }

  const files = chunks.map((c) => ({
    // 예: "제목-03-010m.webm" = 3번째 파트, 시작 오프셋 10분
    name: `${base}-${String(c.seq + 1).padStart(2, "0")}-${String(Math.floor(c.startSec / 60)).padStart(3, "0")}m.webm`,
    blob: c.blob,
  }));
  const zip = await buildZip(files, new Date(note.recordedAt));
  const filename = `${base}.zip`;
  triggerDownload(zip, filename);
  return filename;
}
