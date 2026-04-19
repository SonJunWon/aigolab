/**
 * 이미지 생성 라우터 — Gemini Imagen → Cloudflare Workers AI 폴백
 *
 * 흐름:
 *   1. Gemini API 키 있으면 → Imagen 3 모델로 생성 시도
 *   2. 실패(한도 초과 등) + CF 키 있으면 → CF Workers AI (flux-1-schnell)
 *   3. 둘 다 실패 → 에러
 *
 * 반환: base64 data URL (image/png)
 */

import { getKey } from "./llm/keys";

export interface ImageGenRequest {
  prompt: string;
  /** 부정 프롬프트 (Gemini Imagen 지원) */
  negativePrompt?: string;
}

export interface ImageGenResponse {
  /** data:image/png;base64,... 형태 */
  dataUrl: string;
  /** 사용된 프로바이더 */
  provider: "gemini-imagen" | "cloudflare";
  latencyMs: number;
}

export class ImageGenError extends Error {
  readonly provider?: string;
  override readonly cause?: unknown;

  constructor(message: string, provider?: string, cause?: unknown) {
    super(message);
    this.name = "ImageGenError";
    this.provider = provider;
    this.cause = cause;
  }
}

/** Gemini Imagen으로 이미지 생성 */
async function generateWithGemini(
  req: ImageGenRequest,
): Promise<ImageGenResponse> {
  const apiKey = await getKey("gemini");
  if (!apiKey) throw new ImageGenError("Gemini API 키가 없습니다.", "gemini-imagen");

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });

  const start = performance.now();

  const response = await ai.models.generateImages({
    model: "imagen-3.0-generate-002",
    prompt: req.prompt,
    config: {
      numberOfImages: 1,
      ...(req.negativePrompt ? { negativePrompt: req.negativePrompt } : {}),
    },
  });

  const latencyMs = Math.round(performance.now() - start);

  const image = response.generatedImages?.[0];
  if (!image?.image?.imageBytes) {
    throw new ImageGenError(
      "Gemini Imagen이 이미지를 반환하지 않았습니다.",
      "gemini-imagen",
    );
  }

  const dataUrl = `data:image/png;base64,${image.image.imageBytes}`;
  return { dataUrl, provider: "gemini-imagen", latencyMs };
}

/** Cloudflare Workers AI로 이미지 생성 */
async function generateWithCloudflare(
  req: ImageGenRequest,
): Promise<ImageGenResponse> {
  const accountId = await getKey("cf-account-id");
  const apiToken = await getKey("cf-api-token");

  if (!accountId || !apiToken) {
    throw new ImageGenError(
      "Cloudflare Account ID와 API Token이 모두 필요합니다.",
      "cloudflare",
    );
  }

  const start = performance.now();

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: req.prompt, num_steps: 4 }),
    },
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new ImageGenError(
      `Cloudflare API 오류: HTTP ${res.status} — ${errText.slice(0, 200)}`,
      "cloudflare",
    );
  }

  const blob = await res.blob();
  const latencyMs = Math.round(performance.now() - start);

  // blob → base64 data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new ImageGenError("이미지 변환 실패", "cloudflare"));
    reader.readAsDataURL(blob);
  });

  return { dataUrl, provider: "cloudflare", latencyMs };
}

/**
 * 이미지 생성 — Gemini Imagen 우선, 실패 시 CF 폴백
 */
export async function generateImage(
  req: ImageGenRequest,
): Promise<ImageGenResponse> {
  const errors: Error[] = [];

  // 1순위: Gemini Imagen
  const geminiKey = await getKey("gemini");
  if (geminiKey) {
    try {
      return await generateWithGemini(req);
    } catch (err) {
      errors.push(err instanceof Error ? err : new Error(String(err)));
    }
  }

  // 2순위: Cloudflare Workers AI
  const cfAccount = await getKey("cf-account-id");
  const cfToken = await getKey("cf-api-token");
  if (cfAccount && cfToken) {
    try {
      return await generateWithCloudflare(req);
    } catch (err) {
      errors.push(err instanceof Error ? err : new Error(String(err)));
    }
  }

  // 둘 다 실패
  if (errors.length === 0) {
    throw new ImageGenError(
      "이미지 생성을 위한 API 키가 등록되어 있지 않습니다. 마이페이지 > API 키 관리에서 Gemini 키를 등록해주세요.",
    );
  }

  const msgs = errors.map((e) => e.message).join(" / ");
  throw new ImageGenError(`이미지 생성 실패: ${msgs}`);
}
