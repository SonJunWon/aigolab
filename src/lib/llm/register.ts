/**
 * 실제 Provider 어댑터 등록 — index.ts 가 한 번 import 하면 자동 실행.
 *
 * 이 파일을 별도로 둔 이유: index.ts 는 순수 re-export 유지,
 * 사이드 이펙트(어댑터 주입)는 이 모듈에 격리.
 */

import { registerAdapter } from "./router";
import { GeminiAdapter } from "./providers/gemini";
import { GroqAdapter } from "./providers/groq";
import { WebLlmAdapter } from "./providers/webllm";

registerAdapter("gemini", new GeminiAdapter());
registerAdapter("groq", new GroqAdapter());
registerAdapter("webllm", new WebLlmAdapter());
