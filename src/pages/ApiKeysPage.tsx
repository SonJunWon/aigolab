/**
 * API 키 관리 페이지 — /my/api-keys
 *
 * 각 API 키의 등록 상태 확인, 발급 가이드, 등록/변경/삭제/테스트
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getKey, setKey, removeKey } from "../lib/llm";

/* ─── API 키 정의 ─── */
interface ApiKeyConfig {
  id: string;
  name: string;
  icon: string;
  required: boolean;
  description: string;
  useCases: string[];
  freeLimit: string;
  prefix: string; // 키 앞부분 (확인용)
  guide: {
    url: string;
    urlLabel: string;
    steps: { title: string; detail: string }[];
    warnings: string[];
  };
}

const API_KEYS: ApiKeyConfig[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    icon: "✨",
    required: true,
    description: "AI 텍스트 생성, 이미지 분석, 코드 설명 등 핵심 AI 기능을 제공합니다. 대부분의 실습에 필요한 필수 키입니다.",
    useCases: ["AI 텍스트 생성", "이미지 분석 (멀티모달)", "코드 설명 및 생성", "번역, 요약, 분류"],
    freeLimit: "하루 1,500회 요청 / 분당 15회",
    prefix: "AIza",
    guide: {
      url: "https://aistudio.google.com/apikey",
      urlLabel: "Google AI Studio",
      steps: [
        {
          title: "Google AI Studio 접속",
          detail: "위 링크를 클릭하여 Google AI Studio에 접속합니다. Google 계정(Gmail)으로 로그인하세요. 계정이 없다면 먼저 Gmail 계정을 만들어주세요.",
        },
        {
          title: "API Key 만들기",
          detail: "'API 키 만들기' 또는 'Create API Key' 버튼을 클릭합니다. 프로젝트를 선택하라고 나오면 기본값(Generative Language Client)을 선택하세요.",
        },
        {
          title: "키 복사하기",
          detail: "생성된 API 키가 화면에 표시됩니다. 'AIzaSy...'로 시작하는 긴 문자열을 복사 버튼을 눌러 복사하세요.",
        },
        {
          title: "아래 입력란에 붙여넣기",
          detail: "복사한 키를 아래 입력란에 붙여넣고 [등록] 버튼을 클릭하면 완료! 이 키는 브라우저에 안전하게 저장되며 서버로 전송되지 않습니다.",
        },
      ],
      warnings: [
        "API 키를 다른 사람과 공유하지 마세요",
        "키를 소스 코드에 직접 넣지 마세요",
        "무료 한도를 초과하면 잠시 후 다시 시도하세요",
      ],
    },
  },
  {
    id: "groq",
    name: "Groq",
    icon: "⚡",
    required: false,
    description: "Gemini보다 응답이 훨씬 빠른 초고속 AI 엔진입니다. Gemini 무료 한도가 초과되면 자동으로 Groq로 전환됩니다.",
    useCases: ["초고속 AI 텍스트 생성", "Gemini 한도 초과 시 자동 폴백", "Llama 3.3 70B 모델 사용"],
    freeLimit: "하루 14,400회 요청 / 분당 30회",
    prefix: "gsk_",
    guide: {
      url: "https://console.groq.com",
      urlLabel: "Groq Console",
      steps: [
        {
          title: "Groq Console 접속 + 회원가입",
          detail: "위 링크를 클릭하여 Groq Console에 접속합니다. 이메일, Google 계정, 또는 GitHub 계정으로 무료 회원가입하세요.",
        },
        {
          title: "API Keys 메뉴 이동",
          detail: "로그인 후 좌측 메뉴에서 'API Keys'를 클릭합니다.",
        },
        {
          title: "새 API Key 생성",
          detail: "'Create API Key' 버튼을 클릭합니다. 이름을 입력하라고 나오면 'AIGoLab' 등 원하는 이름을 입력하고 'Submit'을 클릭하세요.",
        },
        {
          title: "키 복사하기 (중요!)",
          detail: "생성된 키('gsk_...'로 시작)가 화면에 표시됩니다. ⚠️ 이 화면을 닫으면 키를 다시 볼 수 없습니다! 반드시 바로 복사하세요.",
        },
        {
          title: "아래 입력란에 붙여넣기",
          detail: "복사한 키를 아래 입력란에 붙여넣고 [등록] 버튼을 클릭하면 완료!",
        },
      ],
      warnings: [
        "키 생성 직후에만 전체 키를 볼 수 있습니다 — 바로 복사하세요",
        "분실 시 기존 키를 삭제하고 새로 생성하면 됩니다",
      ],
    },
  },
];

/* ─── 컴포넌트 ─── */
export function ApiKeysPage() {
  const [keys, setKeys] = useState<Record<string, string | null>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);

  // 키 로드
  const loadKeys = useCallback(async () => {
    const loaded: Record<string, string | null> = {};
    for (const api of API_KEYS) {
      loaded[api.id] = (await getKey(api.id as "gemini" | "groq")) ?? null;
    }
    setKeys(loaded);
  }, []);

  useEffect(() => { loadKeys(); }, [loadKeys]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // 키 등록
  const handleRegister = (apiId: string) => {
    const value = inputs[apiId]?.trim();
    if (!value) { showToast("❌ API 키를 입력해주세요"); return; }
    setKey(apiId as "gemini" | "groq", value);
    setInputs((prev) => ({ ...prev, [apiId]: "" }));
    loadKeys();
    showToast("✅ 키가 등록되었습니다");
  };

  // 키 삭제
  const handleDelete = (apiId: string) => {
    if (!confirm("이 API 키를 삭제하시겠습니까?")) return;
    removeKey(apiId as "gemini" | "groq");
    loadKeys();
    showToast("🗑 키가 삭제되었습니다");
  };

  // 키 테스트
  const handleTest = async (apiId: string) => {
    setTesting(apiId);
    try {
      const { chat } = await import("../lib/llm");
      const res = await chat({
        provider: apiId as "gemini" | "groq",
        messages: [{ role: "user", content: "안녕? 한 문장으로 답해줘." }],
      });
      showToast(`✅ 테스트 성공! 응답: "${res.text.slice(0, 50)}..."`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(`❌ 테스트 실패: ${msg}`);
    } finally {
      setTesting(null);
    }
  };

  // 마스킹
  const maskKey = (key: string) => {
    if (key.length <= 8) return "****";
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  const registeredCount = Object.values(keys).filter(Boolean).length;
  const totalCount = API_KEYS.length;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">

        {/* 네비게이션 */}
        <div className="mb-6">
          <Link to="/my" className="text-sm text-brand-textDim hover:text-brand-accent transition-colors">
            ← 마이페이지
          </Link>
        </div>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">🔑 API 키 관리</h1>
          <p className="text-sm text-brand-textDim mb-4">
            AI 기능을 사용하려면 API 키를 등록하세요. 키는 브라우저에만 저장되며 서버로 전송되지 않습니다.
          </p>

          {/* 상태 요약 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-panel/60 border border-brand-subtle">
            <div className="text-3xl">🔑</div>
            <div>
              <div className="text-sm font-medium">
                {registeredCount === totalCount
                  ? "✅ 모든 키가 등록되었습니다"
                  : `${registeredCount}/${totalCount}개 등록됨`}
              </div>
              <div className="text-xs text-brand-textDim">
                {registeredCount === 0
                  ? "Gemini 키를 먼저 등록해주세요 (필수)"
                  : registeredCount < totalCount
                  ? "선택 키를 등록하면 더 빠르고 안정적으로 사용할 수 있어요"
                  : "모든 AI 기능을 사용할 수 있습니다"}
              </div>
            </div>
          </div>
        </div>

        {/* API 키 카드 목록 */}
        <div className="space-y-6">
          {API_KEYS.map((api) => {
            const currentKey = keys[api.id];
            const isRegistered = !!currentKey;
            const isGuideOpen = expandedGuide === api.id;

            return (
              <div
                key={api.id}
                className={`rounded-2xl border overflow-hidden
                  ${isRegistered ? "border-emerald-500/30 bg-emerald-500/5" : "border-brand-subtle bg-brand-panel/40"}`}
              >
                {/* 카드 헤더 */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{api.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold">{api.name}</h2>
                          {api.required ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-red-500/15 text-red-400">필수</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-brand-textDim/15 text-brand-textDim">선택</span>
                          )}
                        </div>
                        <div className="text-xs text-brand-textDim">{api.freeLimit}</div>
                      </div>
                    </div>
                    <span className={`text-sm ${isRegistered ? "text-emerald-400" : "text-brand-textDim"}`}>
                      {isRegistered ? "✅ 등록됨" : "❌ 미등록"}
                    </span>
                  </div>

                  <p className="text-sm text-brand-textDim leading-relaxed mb-3">{api.description}</p>

                  {/* 용도 태그 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {api.useCases.map((use) => (
                      <span key={use} className="px-2 py-0.5 rounded-md text-[10px] bg-brand-accent/10 text-brand-accent/80">
                        {use}
                      </span>
                    ))}
                  </div>

                  {/* 등록된 키 표시 / 입력 필드 */}
                  {isRegistered ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-brand-bg border border-brand-subtle text-sm font-mono text-brand-textDim">
                        {showKeys[api.id] ? currentKey : maskKey(currentKey!)}
                      </div>
                      <button
                        onClick={() => setShowKeys((prev) => ({ ...prev, [api.id]: !prev[api.id] }))}
                        className="px-3 py-2 rounded-lg text-xs border border-brand-subtle text-brand-textDim hover:text-brand-text transition-colors"
                      >
                        {showKeys[api.id] ? "숨기기" : "보기"}
                      </button>
                      <button
                        onClick={() => handleTest(api.id)}
                        disabled={testing === api.id}
                        className="px-3 py-2 rounded-lg text-xs border border-brand-subtle text-brand-accent hover:bg-brand-accent/10 transition-colors disabled:opacity-50"
                      >
                        {testing === api.id ? "테스트 중..." : "🧪 테스트"}
                      </button>
                      <button
                        onClick={() => handleDelete(api.id)}
                        className="px-3 py-2 rounded-lg text-xs border border-brand-subtle text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        value={inputs[api.id] ?? ""}
                        onChange={(e) => setInputs((prev) => ({ ...prev, [api.id]: e.target.value }))}
                        placeholder={`${api.prefix}... 키를 붙여넣으세요`}
                        className="flex-1 px-3 py-2 rounded-lg bg-brand-bg border border-brand-subtle text-sm text-brand-text
                                   placeholder:text-brand-textDim/50 focus:outline-none focus:border-brand-accent transition-colors"
                      />
                      <button
                        onClick={() => handleRegister(api.id)}
                        className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-brand-accent text-white
                                   hover:brightness-110 transition-all"
                      >
                        등록
                      </button>
                    </div>
                  )}
                </div>

                {/* 발급 가이드 (아코디언) */}
                <div className="border-t border-brand-subtle/50">
                  <button
                    onClick={() => setExpandedGuide(isGuideOpen ? null : api.id)}
                    className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-brand-panel/40 transition-colors"
                  >
                    <span className="text-sm font-medium text-brand-textDim">
                      📖 {api.name} API 키 발급 가이드
                    </span>
                    <span className={`text-brand-textDim transition-transform ${isGuideOpen ? "rotate-180" : ""}`}>▾</span>
                  </button>

                  {isGuideOpen && (
                    <div className="px-5 pb-5">
                      {/* 발급 링크 */}
                      <a
                        href={api.guide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-accent/10 border border-brand-accent/20
                                   text-sm text-brand-accent hover:bg-brand-accent/20 transition-colors mb-4"
                      >
                        🔗 {api.guide.urlLabel} 바로가기 ↗
                      </a>

                      {/* 단계별 가이드 */}
                      <div className="space-y-3 mb-4">
                        {api.guide.steps.map((step, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="shrink-0 w-7 h-7 rounded-full bg-brand-accent/15 flex items-center justify-center text-xs font-bold text-brand-accent">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium mb-0.5">{step.title}</div>
                              <div className="text-xs text-brand-textDim leading-relaxed">{step.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 주의사항 */}
                      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <div className="text-xs font-medium text-amber-400 mb-1">⚠️ 주의사항</div>
                        <ul className="space-y-1">
                          {api.guide.warnings.map((w, i) => (
                            <li key={i} className="text-xs text-brand-textDim">• {w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-10 space-y-3">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-3">자주 묻는 질문</h2>

          {[
            {
              q: "API 키가 뭔가요?",
              a: "API 키는 AI 서비스를 사용하기 위한 '비밀번호' 같은 것입니다. 키를 등록하면 AI에게 질문을 보내고 답변을 받을 수 있어요.",
            },
            {
              q: "요금이 발생하나요?",
              a: "아닙니다. Gemini는 하루 1,500회, Groq는 하루 14,400회까지 무료입니다. 일반적인 학습에는 충분한 양이에요. 한도를 초과해도 다음 날 초기화됩니다.",
            },
            {
              q: "키가 안전한가요?",
              a: "API 키는 여러분의 브라우저(localStorage)에만 저장됩니다. AIGoLab 서버로 전송되지 않으며, 다른 사람이 볼 수 없습니다.",
            },
            {
              q: "키를 분실했어요.",
              a: "각 서비스의 대시보드(Google AI Studio, Groq Console)에서 기존 키를 삭제하고 새 키를 발급받으면 됩니다.",
            },
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-xl border border-brand-subtle bg-brand-panel/40">
              <div className="text-sm font-medium mb-1">{faq.q}</div>
              <div className="text-xs text-brand-textDim">{faq.a}</div>
            </div>
          ))}
        </div>

        {/* 하단 */}
        <div className="mt-10 text-center">
          <Link to="/my" className="text-sm text-brand-textDim hover:text-brand-accent transition-colors">
            ← 마이페이지로 돌아가기
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-lg bg-brand-panel border border-brand-subtle shadow-lg text-sm text-brand-text z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
