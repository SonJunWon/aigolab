/**
 * API 키 관리 페이지 — /my/api-keys
 *
 * 각 API 키의 등록 상태 확인, 발급 가이드, 등록/변경/삭제/테스트
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getKey, setKey, removeKey } from "../lib/llm";
import type { ApiKeyId } from "../lib/llm";

/* ─── API 키 정의 ─── */
interface GuideStep {
  title: string;
  detail: string;
  tips?: string[];
}

interface ApiKeyConfig {
  id: string;
  name: string;
  icon: string;
  required: boolean;
  description: string;
  useCases: string[];
  freeLimit: string;
  prefix: string;
  guide: {
    url: string;
    urlLabel: string;
    intro: string;
    steps: GuideStep[];
    warnings: string[];
    troubleshooting?: { problem: string; solution: string }[];
  };
}

const API_KEYS: ApiKeyConfig[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    icon: "✨",
    required: true,
    description:
      "AI 텍스트 생성, 이미지 생성/분석, 코드 설명 등 핵심 AI 기능을 제공합니다. 대부분의 실습에 필요한 필수 키입니다.",
    useCases: [
      "AI 텍스트 생성",
      "AI 이미지 생성 (Imagen)",
      "이미지 분석 (멀티모달)",
      "코드 설명 및 생성",
      "번역, 요약, 분류",
    ],
    freeLimit: "텍스트: 하루 1,500회 / 이미지 생성: 하루 약 50회",
    prefix: "AIza",
    guide: {
      url: "https://aistudio.google.com/apikey",
      urlLabel: "Google AI Studio",
      intro:
        "Google AI Studio에서 무료 API 키를 발급받을 수 있습니다. Gmail 계정만 있으면 되며, 약 2분이면 완료됩니다.",
      steps: [
        {
          title: "Google AI Studio 접속하기",
          detail:
            "아래 '바로가기' 버튼을 클릭하면 Google AI Studio 사이트가 새 탭에서 열립니다.",
          tips: [
            "Google 계정(Gmail)이 필요합니다. 아직 없다면 accounts.google.com 에서 먼저 만들어주세요.",
            "로그인 화면이 나오면 Gmail 주소와 비밀번호로 로그인하세요.",
            "이미 Gmail에 로그인되어 있다면 바로 API 키 페이지가 보입니다.",
          ],
        },
        {
          title: "'API 키 만들기' 버튼 클릭",
          detail:
            "페이지에 파란색 또는 회색 'API 키 만들기' (영문: 'Create API Key') 버튼이 보입니다. 이 버튼을 클릭하세요.",
          tips: [
            "'새 프로젝트에서 API 키 만들기' 또는 '기존 프로젝트에서 API 키 만들기' 선택 창이 나오면 → '새 프로젝트에서 API 키 만들기'를 선택하세요.",
            "프로젝트 이름을 묻는다면 기본값('Generative Language Client') 그대로 두고 진행하면 됩니다.",
            "버튼이 안 보인다면 페이지를 아래로 스크롤하거나, 왼쪽 메뉴에서 'API keys' 또는 'Get API key'를 찾아 클릭해보세요.",
          ],
        },
        {
          title: "생성된 API 키 복사하기",
          detail:
            "잠시 기다리면 'AIzaSy...'로 시작하는 긴 문자열이 화면에 나타납니다. 이것이 여러분의 API 키입니다!",
          tips: [
            "키 옆에 있는 복사 아이콘(네모 두 개 겹친 모양)을 클릭하면 자동으로 복사됩니다.",
            "복사 아이콘이 안 보이면, 키 문자열을 마우스로 전체 선택(드래그)한 뒤 Ctrl+C (Mac: Cmd+C)로 복사하세요.",
            "키는 보통 'AIzaSy'로 시작하고 약 39자 정도입니다. 전체가 복사되었는지 확인하세요.",
          ],
        },
        {
          title: "이 페이지로 돌아와서 키 붙여넣기",
          detail:
            "이 페이지(AIGoLab)로 돌아와서, 위의 입력란을 클릭한 뒤 Ctrl+V (Mac: Cmd+V)로 붙여넣고 [등록] 버튼을 클릭하세요.",
          tips: [
            "입력란에 키가 붙여넣어지면 '****' 형태로 숨겨져 보입니다. 이것이 정상입니다!",
            "[등록] 버튼을 누르면 '키가 등록되었습니다' 메시지가 나타납니다.",
            "등록된 키는 브라우저에 암호화되어 저장됩니다. AIGoLab 서버로 전송되지 않으니 안심하세요.",
            "등록 후 [테스트] 버튼을 눌러 키가 정상 작동하는지 확인할 수 있어요.",
          ],
        },
      ],
      warnings: [
        "API 키를 다른 사람(친구, SNS 등)과 절대 공유하지 마세요. 다른 사람이 여러분의 키로 API를 사용하면 여러분의 무료 한도가 소모됩니다.",
        "키를 메모장이나 소스 코드에 직접 적어두지 마세요. 분실 시 Google AI Studio에서 새로 발급받으면 됩니다.",
        "하루 무료 한도(1,500회)를 초과하면 일시적으로 오류가 발생합니다. 다음 날(한국시간 오전 9시 경) 자동 초기화되니 기다리면 됩니다.",
      ],
      troubleshooting: [
        {
          problem: "'API 키 만들기' 버튼이 비활성화되어 있어요",
          solution:
            "Google 계정에 로그인되어 있는지 확인하세요. 회사/학교 계정(Google Workspace)은 관리자가 AI Studio 접근을 차단한 경우가 있습니다. 개인 Gmail 계정으로 다시 시도해보세요.",
        },
        {
          problem: "키를 등록했는데 테스트가 실패해요",
          solution:
            "키가 올바르게 복사되었는지 확인하세요. 앞뒤 공백이 포함되었거나 키의 일부만 복사된 경우가 많습니다. 키를 삭제하고 Google AI Studio에서 다시 복사해보세요.",
        },
        {
          problem: "'지원되지 않는 지역' 오류가 나와요",
          solution:
            "일부 국가에서는 Gemini API가 제한될 수 있습니다. VPN을 사용하거나, Google Cloud Console에서 프로젝트 지역 설정을 확인해보세요.",
        },
      ],
    },
  },
  {
    id: "groq",
    name: "Groq",
    icon: "⚡",
    required: false,
    description:
      "Gemini보다 응답이 훨씬 빠른 초고속 AI 엔진입니다. Gemini 무료 한도가 초과되면 자동으로 Groq로 전환됩니다.",
    useCases: [
      "초고속 AI 텍스트 생성",
      "Gemini 한도 초과 시 자동 폴백",
      "Llama 3.3 70B 모델 사용",
    ],
    freeLimit: "하루 14,400회 요청 / 분당 30회",
    prefix: "gsk_",
    guide: {
      url: "https://console.groq.com",
      urlLabel: "Groq Console",
      intro:
        "Groq는 초고속 AI 엔진입니다. 회원가입 후 바로 무료 API 키를 받을 수 있으며, 약 3분이면 완료됩니다.",
      steps: [
        {
          title: "Groq Console 접속하기",
          detail:
            "아래 '바로가기' 버튼을 클릭하면 Groq Console 사이트가 새 탭에서 열립니다.",
          tips: [
            "처음 방문하면 로그인/회원가입 화면이 나타납니다.",
          ],
        },
        {
          title: "무료 회원가입 (처음 방문 시)",
          detail:
            "회원가입 방법을 선택합니다. Google, GitHub 또는 이메일 중 편한 것을 선택하세요.",
          tips: [
            "가장 쉬운 방법: 'Continue with Google' 클릭 → Gmail 계정 선택 → 완료!",
            "이메일로 가입할 경우: 이메일 입력 → 메일함에서 인증 링크 클릭 → 비밀번호 설정 순서입니다.",
            "이미 계정이 있다면 로그인만 하면 됩니다.",
          ],
        },
        {
          title: "API Keys 메뉴로 이동하기",
          detail:
            "로그인하면 대시보드가 보입니다. 왼쪽 사이드바 메뉴에서 'API Keys'를 찾아 클릭하세요.",
          tips: [
            "왼쪽 메뉴가 안 보이면 화면 왼쪽 상단의 메뉴 아이콘(가로줄 3개, 일명 '햄버거 메뉴')을 클릭하세요.",
            "또는 주소창에 직접 console.groq.com/keys 를 입력해도 됩니다.",
          ],
        },
        {
          title: "새 API Key 생성하기",
          detail: "'Create API Key' 버튼을 클릭합니다.",
          tips: [
            "이름(Display Name)을 입력하라는 창이 뜹니다. 'AIGoLab' 또는 아무 이름이나 입력하세요. 이름은 구분용이라 뭘 적어도 상관없습니다.",
            "이름을 입력한 후 'Submit' 버튼을 클릭하세요.",
          ],
        },
        {
          title: "키 복사하기 (이 단계가 가장 중요!)",
          detail:
            "화면에 'gsk_...'로 시작하는 긴 문자열이 나타납니다. 이것이 API 키입니다. 반드시 지금 바로 복사하세요!",
          tips: [
            "키 옆 복사 아이콘을 클릭하거나, 키 전체를 드래그 선택 후 Ctrl+C (Mac: Cmd+C)로 복사하세요.",
            "이 화면을 닫거나 다른 페이지로 이동하면 키를 다시 볼 수 없습니다!",
            "혹시 복사하지 못하고 닫았다면, 해당 키를 삭제(Revoke)하고 새로 만들면 됩니다.",
          ],
        },
        {
          title: "이 페이지로 돌아와서 키 붙여넣기",
          detail:
            "이 페이지(AIGoLab)로 돌아와서, 위의 입력란에 Ctrl+V (Mac: Cmd+V)로 붙여넣고 [등록] 버튼을 클릭하세요.",
          tips: [
            "등록 후 [테스트] 버튼으로 정상 작동을 확인해보세요.",
            "Groq는 선택사항입니다. Gemini 키만 있어도 모든 기능을 사용할 수 있어요.",
          ],
        },
      ],
      warnings: [
        "키 생성 직후 화면에서만 전체 키를 볼 수 있습니다. 반드시 바로 복사하세요!",
        "키를 분실했다면 Groq Console에서 기존 키를 삭제(Revoke)하고 새로 만들면 됩니다.",
        "분당 30회 한도가 있으므로, 빠르게 연속 요청하면 잠깐 오류가 날 수 있습니다. 몇 초 후 다시 시도하세요.",
      ],
      troubleshooting: [
        {
          problem: "회원가입 인증 메일이 안 와요",
          solution:
            "스팸/프로모션 폴더를 확인하세요. 그래도 없다면 Google 또는 GitHub 계정으로 가입하는 것이 가장 간편합니다.",
        },
        {
          problem: "'Create API Key' 버튼이 안 보여요",
          solution:
            "왼쪽 메뉴에서 'API Keys'를 먼저 클릭했는지 확인하세요. 대시보드 메인 화면에서는 버튼이 보이지 않을 수 있습니다.",
        },
      ],
    },
  },
  {
    id: "cf-account-id",
    name: "Cloudflare Account ID",
    icon: "☁️",
    required: false,
    description:
      "Cloudflare Workers AI를 통한 이미지 생성 폴백에 사용됩니다. Gemini 이미지 한도 초과 시 자동 전환됩니다.",
    useCases: ["AI 이미지 생성 (폴백)", "Gemini 한도 초과 시 자동 전환"],
    freeLimit: "하루 약 200회 (무료 플랜)",
    prefix: "",
    guide: {
      url: "https://dash.cloudflare.com",
      urlLabel: "Cloudflare Dashboard",
      intro:
        "Cloudflare는 이미지 생성 보조 서비스입니다. Gemini 이미지 생성 한도가 초과되면 자동으로 Cloudflare를 사용합니다. Account ID와 API Token 두 가지 모두 등록해야 작동합니다.",
      steps: [
        {
          title: "Cloudflare 회원가입하기",
          detail:
            "아래 '바로가기' 버튼을 클릭하면 Cloudflare 대시보드가 열립니다. 계정이 없다면 'Sign up' 링크를 클릭하여 이메일과 비밀번호로 가입하세요.",
          tips: [
            "무료(Free) 플랜으로 가입하면 됩니다. 결제 정보를 입력할 필요가 없습니다.",
            "가입 후 이메일 인증 링크를 클릭해야 계정이 활성화됩니다. 메일함(스팸 폴더 포함)을 확인하세요.",
          ],
        },
        {
          title: "대시보드에서 Account ID 찾기",
          detail:
            "로그인하면 대시보드가 보입니다. Account ID를 찾는 방법은 두 가지입니다.",
          tips: [
            "방법 1: 대시보드 메인 페이지의 오른쪽 사이드바 하단에 'Account ID'가 작은 글씨로 표시되어 있습니다.",
            "방법 2: 왼쪽 메뉴에서 'Workers & Pages' 클릭 → 오른쪽 사이드바의 'Account details' 영역에 Account ID가 있습니다.",
            "Account ID는 32자리 영문+숫자 조합입니다 (예: a1b2c3d4e5f6...). 옆의 'Click to copy'를 클릭하면 복사됩니다.",
          ],
        },
        {
          title: "이 페이지로 돌아와서 Account ID 붙여넣기",
          detail:
            "복사한 Account ID를 위의 입력란에 Ctrl+V (Mac: Cmd+V)로 붙여넣고 [등록] 버튼을 클릭하세요.",
          tips: [
            "Account ID만으로는 이미지 생성이 작동하지 않습니다. 아래의 'API Token'도 함께 등록해주세요!",
          ],
        },
      ],
      warnings: [
        "Account ID는 비밀은 아니지만, 불필요하게 SNS 등에 공유하지 마세요.",
        "반드시 아래 'Cloudflare API Token'도 함께 등록해야 이미지 생성 폴백이 작동합니다.",
      ],
      troubleshooting: [
        {
          problem: "Account ID가 어디 있는지 모르겠어요",
          solution:
            "대시보드에서 아무 도메인이 없어도 괜찮습니다. 왼쪽 메뉴에서 'Workers & Pages'를 클릭하면 오른쪽에 Account ID가 나옵니다.",
        },
      ],
    },
  },
  {
    id: "cf-api-token",
    name: "Cloudflare API Token",
    icon: "🔐",
    required: false,
    description:
      "Cloudflare Workers AI API 호출에 필요한 인증 토큰입니다. Account ID와 함께 등록해야 합니다.",
    useCases: ["Workers AI 인증", "이미지 생성 API 호출"],
    freeLimit: "Account ID와 동일",
    prefix: "",
    guide: {
      url: "https://dash.cloudflare.com/profile/api-tokens",
      urlLabel: "Cloudflare API Tokens",
      intro:
        "Cloudflare API Token은 Workers AI에 접근하기 위한 인증 토큰입니다. 위의 Account ID와 함께 등록해야 이미지 생성 폴백이 작동합니다.",
      steps: [
        {
          title: "API Tokens 페이지 접속하기",
          detail:
            "아래 '바로가기' 버튼을 클릭하면 Cloudflare 프로필의 API Tokens 페이지가 열립니다.",
          tips: [
            "직접 이동하려면: Cloudflare 대시보드 → 오른쪽 상단 사람 아이콘 → 'My Profile' → 왼쪽 메뉴 'API Tokens' 순서로 클릭하세요.",
            "로그인이 필요하다면 Cloudflare 계정(위에서 만든 것)으로 로그인하세요.",
          ],
        },
        {
          title: "'Create Token' 버튼 클릭하기",
          detail:
            "API Tokens 목록 아래에 파란색 'Create Token' 버튼이 있습니다. 클릭하세요.",
          tips: [
            "이미 만든 토큰이 있다면 목록에 표시됩니다. 새로 만들려면 아래로 스크롤하여 'Create Token' 버튼을 찾으세요.",
          ],
        },
        {
          title: "토큰 템플릿 선택하기",
          detail:
            "여러 템플릿이 나열됩니다. 'Workers AI' 템플릿 오른쪽의 'Use template' 버튼을 클릭하세요.",
          tips: [
            "'Workers AI' 템플릿이 보이지 않으면, 페이지 맨 아래 'Create Custom Token'을 클릭하세요.",
            "Custom Token을 만들 경우: Token name에 'AIGoLab' 입력 → Permissions에서 'Account' > 'Workers AI' > 'Read' 선택 → 'Continue to summary' 클릭.",
          ],
        },
        {
          title: "토큰 설정 확인 후 생성하기",
          detail:
            "설정 요약 화면이 나옵니다. 기본 설정 그대로 두고 'Continue to summary'를 클릭한 뒤, 'Create Token' 버튼을 클릭하세요.",
          tips: [
            "토큰의 유효 기간(TTL)을 물으면, 기본값(무제한) 그대로 두면 됩니다.",
            "Account Resources에 여러 계정이 있으면, 사용할 계정을 선택하세요. 보통 하나만 있으므로 그대로 진행하면 됩니다.",
          ],
        },
        {
          title: "토큰 복사하기 (이 단계가 가장 중요!)",
          detail:
            "생성된 토큰이 화면에 표시됩니다. 이 토큰은 지금 이 순간에만 볼 수 있습니다! 반드시 바로 복사하세요!",
          tips: [
            "'Copy' 버튼을 클릭하면 자동으로 복사됩니다.",
            "이 페이지를 닫으면 토큰을 다시 볼 수 없습니다. 복사하지 못했다면 토큰을 삭제(Roll)하고 새로 만들어야 합니다.",
            "토큰은 긴 영문+숫자 문자열입니다. 전체가 복사되었는지 확인하세요.",
          ],
        },
        {
          title: "이 페이지로 돌아와서 토큰 붙여넣기",
          detail:
            "이 페이지(AIGoLab)로 돌아와서, 위의 입력란에 Ctrl+V (Mac: Cmd+V)로 붙여넣고 [등록] 버튼을 클릭하세요.",
          tips: [
            "Account ID도 함께 등록되어 있어야 합니다. 위의 'Cloudflare Account ID'도 확인해주세요.",
            "두 키 모두 등록한 후 [테스트] 버튼으로 연결을 확인할 수 있습니다.",
          ],
        },
      ],
      warnings: [
        "토큰은 생성 직후 한 번만 표시됩니다. 반드시 바로 복사하세요!",
        "API Token은 비밀번호와 같습니다. 절대 다른 사람과 공유하지 마세요.",
        "위의 Account ID도 함께 등록해야 이미지 생성 폴백이 작동합니다.",
      ],
      troubleshooting: [
        {
          problem: "'Workers AI' 템플릿이 안 보여요",
          solution:
            "'Create Custom Token'으로 직접 만드세요. Permissions에서 Account > Workers AI > Read를 추가하면 됩니다.",
        },
        {
          problem: "토큰을 복사하지 못하고 페이지를 닫았어요",
          solution:
            "걱정 마세요! API Tokens 페이지에서 해당 토큰을 'Roll'(재발급) 또는 'Delete'(삭제) 후 새로 만들면 됩니다.",
        },
        {
          problem: "테스트가 실패해요",
          solution:
            "Account ID와 API Token 두 가지 모두 등록되어 있는지 확인하세요. 하나라도 빠지면 테스트가 실패합니다.",
        },
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
      loaded[api.id] = (await getKey(api.id as ApiKeyId)) ?? null;
    }
    setKeys(loaded);
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // 키 등록
  const handleRegister = (apiId: string) => {
    const value = inputs[apiId]?.trim();
    if (!value) {
      showToast("API 키를 입력해주세요");
      return;
    }
    setKey(apiId as ApiKeyId, value);
    setInputs((prev) => ({ ...prev, [apiId]: "" }));
    loadKeys();
    showToast("키가 등록되었습니다");
  };

  // 키 삭제
  const handleDelete = (apiId: string) => {
    if (!confirm("이 API 키를 삭제하시겠습니까?")) return;
    removeKey(apiId as ApiKeyId);
    loadKeys();
    showToast("키가 삭제되었습니다");
  };

  // 키 테스트
  const handleTest = async (apiId: string) => {
    setTesting(apiId);
    try {
      if (apiId === "cf-account-id" || apiId === "cf-api-token") {
        const accountId = await getKey("cf-account-id");
        const apiToken = await getKey("cf-api-token");
        if (!accountId || !apiToken) {
          showToast(
            "Account ID와 API Token 모두 등록해야 테스트할 수 있습니다",
          );
          return;
        }
        const res = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: "a blue sky", num_steps: 4 }),
          },
        );
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errText.slice(0, 100)}`);
        }
        showToast("Cloudflare Workers AI 연결 테스트 성공!");
      } else {
        const { chat } = await import("../lib/llm");
        const res = await chat({
          provider: apiId as "gemini" | "groq",
          messages: [{ role: "user", content: "안녕? 한 문장으로 답해줘." }],
        });
        showToast(`테스트 성공! 응답: "${res.text.slice(0, 50)}..."`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(`테스트 실패: ${msg}`);
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
          <Link
            to="/my"
            className="text-sm text-brand-textDim hover:text-brand-accent transition-colors"
          >
            ← 마이페이지
          </Link>
        </div>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            API 키 관리
          </h1>
          <p className="text-sm text-brand-textDim mb-4">
            AI 기능을 사용하려면 API 키를 등록하세요. 키는 브라우저에만
            저장되며 서버로 전송되지 않습니다.
          </p>

          {/* 상태 요약 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-panel/60 border border-brand-subtle">
            <div className="text-3xl">🔑</div>
            <div>
              <div className="text-sm font-medium">
                {registeredCount === totalCount
                  ? "모든 키가 등록되었습니다"
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
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-red-500/15 text-red-400">
                              필수
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-brand-textDim/15 text-brand-textDim">
                              선택
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-brand-textDim">
                          {api.freeLimit}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-sm ${isRegistered ? "text-emerald-400" : "text-brand-textDim"}`}
                    >
                      {isRegistered ? "등록됨" : "미등록"}
                    </span>
                  </div>

                  <p className="text-sm text-brand-textDim leading-relaxed mb-3">
                    {api.description}
                  </p>

                  {/* 용도 태그 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {api.useCases.map((use) => (
                      <span
                        key={use}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-brand-accent/10 text-brand-accent/80"
                      >
                        {use}
                      </span>
                    ))}
                  </div>

                  {/* 등록된 키 표시 / 입력 필드 */}
                  {isRegistered ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-brand-bg border border-brand-subtle text-sm font-mono text-brand-textDim">
                        {showKeys[api.id]
                          ? currentKey
                          : maskKey(currentKey!)}
                      </div>
                      <button
                        onClick={() =>
                          setShowKeys((prev) => ({
                            ...prev,
                            [api.id]: !prev[api.id],
                          }))
                        }
                        className="px-3 py-2 rounded-lg text-xs border border-brand-subtle text-brand-textDim hover:text-brand-text transition-colors"
                      >
                        {showKeys[api.id] ? "숨기기" : "보기"}
                      </button>
                      <button
                        onClick={() => handleTest(api.id)}
                        disabled={testing === api.id}
                        className="px-3 py-2 rounded-lg text-xs border border-brand-subtle text-brand-accent hover:bg-brand-accent/10 transition-colors disabled:opacity-50"
                      >
                        {testing === api.id ? "테스트 중..." : "테스트"}
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
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            [api.id]: e.target.value,
                          }))
                        }
                        placeholder={
                          api.prefix
                            ? `${api.prefix}... 키를 붙여넣으세요`
                            : "키를 붙여넣으세요"
                        }
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
                    onClick={() =>
                      setExpandedGuide(isGuideOpen ? null : api.id)
                    }
                    className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-brand-panel/40 transition-colors"
                  >
                    <span className="text-sm font-medium text-brand-textDim">
                      {api.name} API 키 발급 가이드
                    </span>
                    <span
                      className={`text-brand-textDim transition-transform ${isGuideOpen ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </button>

                  {isGuideOpen && (
                    <div className="px-5 pb-5">
                      {/* 안내 문구 */}
                      <div className="p-3 rounded-lg bg-brand-accent/5 border border-brand-accent/15 mb-4">
                        <p className="text-xs text-brand-textDim leading-relaxed">
                          {api.guide.intro}
                        </p>
                      </div>

                      {/* 발급 링크 */}
                      <a
                        href={api.guide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-accent/10 border border-brand-accent/20
                                   text-sm text-brand-accent hover:bg-brand-accent/20 transition-colors mb-5"
                      >
                        {api.guide.urlLabel} 바로가기 ↗
                      </a>

                      {/* 단계별 가이드 */}
                      <div className="space-y-4 mb-5">
                        {api.guide.steps.map((step, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-brand-subtle/50 bg-brand-panel/30 p-4"
                          >
                            <div className="flex gap-3 mb-2">
                              <div className="shrink-0 w-7 h-7 rounded-full bg-brand-accent/15 flex items-center justify-center text-xs font-bold text-brand-accent">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold mb-1">
                                  {step.title}
                                </div>
                                <div className="text-xs text-brand-textDim leading-relaxed">
                                  {step.detail}
                                </div>
                              </div>
                            </div>

                            {/* 팁 목록 */}
                            {step.tips && step.tips.length > 0 && (
                              <div className="ml-10 mt-2 space-y-1.5">
                                {step.tips.map((tip, j) => (
                                  <div
                                    key={j}
                                    className="flex gap-2 text-[11px] text-brand-textDim/80 leading-relaxed"
                                  >
                                    <span className="shrink-0 text-brand-accent/60 mt-px">
                                      →
                                    </span>
                                    <span>{tip}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 주의사항 */}
                      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 mb-4">
                        <div className="text-xs font-medium text-amber-400 mb-2">
                          주의사항
                        </div>
                        <ul className="space-y-1.5">
                          {api.guide.warnings.map((w, i) => (
                            <li
                              key={i}
                              className="text-xs text-brand-textDim leading-relaxed"
                            >
                              • {w}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 문제 해결 */}
                      {api.guide.troubleshooting &&
                        api.guide.troubleshooting.length > 0 && (
                          <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/20">
                            <div className="text-xs font-medium text-sky-400 mb-2">
                              문제가 생겼나요?
                            </div>
                            <div className="space-y-3">
                              {api.guide.troubleshooting.map((ts, i) => (
                                <div key={i}>
                                  <div className="text-xs font-medium text-brand-text mb-0.5">
                                    Q. {ts.problem}
                                  </div>
                                  <div className="text-xs text-brand-textDim leading-relaxed">
                                    A. {ts.solution}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-10 space-y-3">
          <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-3">
            자주 묻는 질문
          </h2>

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
            <div
              key={i}
              className="p-4 rounded-xl border border-brand-subtle bg-brand-panel/40"
            >
              <div className="text-sm font-medium mb-1">{faq.q}</div>
              <div className="text-xs text-brand-textDim">{faq.a}</div>
            </div>
          ))}
        </div>

        {/* 하단 */}
        <div className="mt-10 text-center">
          <Link
            to="/my"
            className="text-sm text-brand-textDim hover:text-brand-accent transition-colors"
          >
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
