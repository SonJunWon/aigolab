/**
 * FAQ 페이지 — /faq
 *
 * 정적 데이터 기반. 카테고리별 아코디언.
 * 비로그인도 열람 가능.
 */

import { useState } from "react";
import { Link } from "react-router-dom";

/* ─── FAQ 데이터 ─── */
interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: "general",
    title: "일반",
    icon: "💡",
    items: [
      {
        q: "AIGoLab은 무엇인가요?",
        a: "AIGoLab(AI 고랩)은 누구나 AI를 배우고 직접 앱을 만들어볼 수 있는 실습형 학습 플랫폼입니다. 브라우저만 열면 바로 Python, JavaScript, SQL 코딩을 시작할 수 있고, AI 이론 강의부터 실전 앱 개발 워크샵까지 체계적인 커리큘럼이 준비되어 있습니다. 복잡한 환경설정 없이, 프로그래밍 경험이 없어도, 단계별로 따라가면 자신만의 AI 앱을 완성할 수 있도록 설계되었습니다.",
      },
      {
        q: "AIGoLab에는 어떤 학습 콘텐츠가 있나요?",
        a: "크게 4가지 학습 영역이 있습니다.\n\n• 코딩 실습: Python, JavaScript, SQL을 브라우저에서 직접 실행하며 배우는 인터랙티브 커리큘럼 (입문~중급)\n• AI 강의: AI, 머신러닝, 딥러닝, 자연어 처리 등의 이론을 챕터별로 배우고 퀴즈로 점검\n• AI 엔지니어링 12강: 프롬프트 엔지니어링, RAG, Tool Calling, AI 에이전트 등 실무 AI 기법을 LLM 셀에서 직접 실습\n• 바이브코딩 워크샵: MD 레시피 파일을 AI 코딩 도구에 전달해서 실제 동작하는 웹앱을 만드는 42개 프로젝트 (챗봇, 번역기, 대시보드, SaaS까지)",
      },
      {
        q: "어떤 기기에서 이용할 수 있나요?",
        a: "데스크탑, 노트북, 태블릿 등 최신 웹 브라우저(Chrome, Edge, Safari)가 설치된 기기에서 이용 가능합니다. 코딩 실습은 키보드가 있는 데스크탑/노트북 환경을 권장합니다. 모바일에서는 강의 열람, FAQ 확인 등은 가능하지만 코드 편집은 화면이 좁아 불편할 수 있습니다.",
      },
      {
        q: "프로그래밍을 처음 배우는데 가능한가요?",
        a: "네, 충분히 가능합니다. AIGoLab의 모든 커리큘럼은 프로그래밍 경험이 전혀 없는 분을 기준으로 설계되었습니다.\n\n• 단계별 힌트: 막히면 힌트 버튼을 눌러 방향을 잡을 수 있어요\n• 한국어 에러 번역: 영어 에러 메시지를 이해하기 쉬운 한국어로 안내\n• 용어 팝업: 전문 용어 위에 마우스를 올리면 쉬운 설명이 나타남\n• 챕터별 퀴즈: 배운 내용을 바로 점검하며 진행\n• 정답 확인: 풀이가 어려우면 정답 코드를 확인하고 따라해볼 수 있어요",
      },
      {
        q: "설치해야 하는 프로그램이 있나요?",
        a: "코딩 실습, AI 강의, AI 엔지니어링 12강은 브라우저만 있으면 됩니다. Python도 브라우저 안에서 Pyodide(Python 3.12)로 실행되므로 별도 설치가 필요 없습니다.\n\n다만 바이브코딩 워크샵의 Part B(실제 앱 제작)에서는 내 컴퓨터에서 개발하므로 다음 설치가 필요합니다:\n• Node.js (JavaScript 런타임)\n• VS Code 또는 Cursor (코드 편집기)\n• Claude Code 또는 Cursor AI (AI 코딩 도구)\n\nW00 '내 컴퓨터를 AI 작업실로' 워크샵에서 설치 방법을 단계별로 안내합니다.",
      },
      {
        q: "학습 데이터는 어디에 저장되나요?",
        a: "로그인 상태에서는 서버(클라우드)에 자동 저장되어 어떤 기기에서든 이어서 학습할 수 있습니다. 집에서 데스크탑으로 공부하다가 카페에서 노트북으로 이어서 하는 것도 가능해요.\n\n비로그인 상태에서는 해당 브라우저의 로컬 저장소(IndexedDB)에만 저장됩니다. 브라우저 데이터를 삭제하거나 다른 기기에서 접속하면 진도가 유지되지 않으므로, 꼭 로그인 후 학습하는 것을 권장합니다.",
      },
      {
        q: "AIGoLab은 오프라인에서도 사용 가능한가요?",
        a: "기본적으로 인터넷 연결이 필요합니다. Python 런타임(Pyodide)은 처음 접속 시 다운로드되며, 이후에는 브라우저 캐시에서 로드됩니다. AI 엔지니어링 실습과 워크샵에서는 Gemini, Groq 등 외부 AI API를 호출하므로 인터넷 연결이 필수입니다.",
      },
    ],
  },
  {
    id: "account",
    title: "회원",
    icon: "👤",
    items: [
      {
        q: "회원가입은 어떻게 하나요?",
        a: "두 가지 방법으로 가입할 수 있습니다:\n\n1. 이메일 가입: 이메일 주소와 비밀번호(6자 이상)를 입력하면 확인 이메일이 발송됩니다. 이메일에 포함된 확인 링크를 클릭하면 가입이 완료됩니다.\n2. Google 간편 로그인: 'Google로 로그인' 버튼을 클릭하면 Google 계정으로 바로 가입+로그인이 됩니다. 별도의 이메일 확인 절차가 없어 가장 빠릅니다.\n\n가입 후 마이페이지에서 닉네임과 프로필을 설정할 수 있습니다.",
      },
      {
        q: "이메일 확인 메일이 오지 않아요.",
        a: "다음 사항을 확인해주세요:\n\n• 스팸/정크 메일함을 확인해주세요\n• 이메일 주소를 올바르게 입력했는지 확인해주세요\n• 회사/학교 이메일의 경우 보안 정책으로 차단될 수 있으므로 개인 이메일(Gmail 등)을 사용해보세요\n• 5분이 지나도 오지 않으면 다시 회원가입을 시도하거나, Google 로그인을 이용해주세요\n\n지속적으로 문제가 있다면 gyumsonsam@gmail.com으로 문의해주세요.",
      },
      {
        q: "비밀번호를 잊었어요.",
        a: "로그인 페이지에서 '비밀번호 찾기' 기능을 이용하세요. 가입 시 사용한 이메일 주소를 입력하면 비밀번호 재설정 링크가 발송됩니다. 링크를 클릭하여 새 비밀번호를 설정하면 됩니다.\n\nGoogle 계정으로 가입한 경우에는 AIGoLab에 별도 비밀번호가 없으며, Google 계정 설정(myaccount.google.com)에서 비밀번호를 관리합니다.",
      },
      {
        q: "회원 탈퇴는 어떻게 하나요?",
        a: "마이페이지에서 회원 탈퇴를 요청할 수 있습니다.\n\n탈퇴 시 삭제되는 항목:\n• 학습 진도 및 완료 기록\n• 프로필 정보 (닉네임, 아바타)\n• Playground/IDE에 저장된 코드\n• PRO 구독 정보\n\n탈퇴 후에는 동일한 이메일로 재가입이 가능하지만, 이전 데이터는 복구할 수 없습니다.",
      },
      {
        q: "로그인하지 않으면 무엇을 이용할 수 있나요?",
        a: "비로그인 상태에서 이용 가능한 페이지:\n• 메인 홈페이지 (서비스 소개)\n• AI 앱 개발 소개 페이지\n• 코딩 실습 소개 페이지\n• AI 강의 목록\n• 공지사항\n• FAQ (이 페이지)\n\n로그인이 필요한 콘텐츠:\n• 코딩 실습 커리큘럼 및 레슨\n• Playground / IDE\n• 바이브코딩 워크샵 목록 및 실습\n• AI 강의 상세 내용\n• AI 프로젝트\n• 학습 진도 대시보드\n• 마이페이지",
      },
      {
        q: "여러 기기에서 동시에 로그인할 수 있나요?",
        a: "네, 가능합니다. 데스크탑, 노트북, 태블릿 등 여러 기기에서 동시에 로그인할 수 있으며, 학습 진도는 실시간으로 동기화됩니다. 한 기기에서 챕터를 완료하면 다른 기기에서도 바로 반영됩니다.",
      },
    ],
  },
  {
    id: "pro",
    title: "PRO · 구독",
    icon: "⭐",
    items: [
      {
        q: "PRO와 일반(FREE)의 차이는 무엇인가요?",
        a: "FREE와 PRO는 이용 가능한 콘텐츠 범위가 다릅니다.\n\n[FREE — 로그인만 하면 이용 가능]\n• Python / JavaScript / SQL 입문 트랙 전체\n• AI 강의 01~06 (AI 기초 ~ 생성형 AI)\n• AI 엔지니어링 Ch01~02 (WebLLM, Gemini 프롬프팅)\n• 바이브코딩 워크샵 Phase 1 (W01~W06: 챗봇, 문서Q&A, 번역기, 유튜브기획, 자막, 이미지분석)\n• AI 프로젝트 입문 2개 (Iris 분류, 타이타닉)\n• Playground, IDE\n\n[PRO — 구독/구매 필요]\n• Python 중급 · 데이터 과학 · ML 실습 트랙\n• AI 강의 07~10 (프롬프트 고급, 비전 AI, 윤리, 에이전트)\n• AI 엔지니어링 Ch03~12 (구조화 출력, CoT, Tool Calling, RAG, 캡스톤)\n• 바이브코딩 워크샵 Phase 2~8 (W07~W40: 실전 도구 ~ SaaS 런칭)\n• AI 프로젝트 중급 11개",
      },
      {
        q: "PRO는 어떻게 이용할 수 있나요?",
        a: "PRO 콘텐츠는 도서 구매자에게 제공될 예정입니다.\n\n이용 방법 (예정):\n1. AIGoLab 관련 도서를 구매합니다\n2. 도서에 포함된 인증 코드를 확인합니다\n3. AIGoLab에 로그인 → 마이페이지 → 인증 코드 등록\n4. PRO가 활성화되어 모든 콘텐츠를 이용할 수 있습니다\n\n자세한 출시 일정과 구매 방법은 공지사항을 통해 안내드리겠습니다.",
      },
      {
        q: "PRO 이용 기간에 제한이 있나요?",
        a: "도서 구매를 통한 PRO 활성화는 별도의 기간 제한 없이 이용할 수 있습니다. 한 번 활성화하면 해당 계정에서 계속 PRO 콘텐츠를 이용할 수 있습니다.\n\n다만 향후 서비스 정책이 변경될 수 있으며, 변경 시에는 최소 30일 전에 공지사항을 통해 사전 안내드립니다.",
      },
      {
        q: "어떤 콘텐츠가 PRO인지 어떻게 구분하나요?",
        a: "PRO 콘텐츠는 다음과 같이 표시됩니다:\n\n• 워크샵 목록: Phase 헤더와 각 워크샵 제목 옆에 노란색 'PRO' 뱃지\n• 커리큘럼 페이지: 트랙 카드에 'PRO' 뱃지\n• AI 강의/프로젝트: 목록에서 자물쇠 아이콘 또는 'PRO' 뱃지\n\nPRO가 아닌 콘텐츠(FREE)는 로그인만 하면 바로 이용할 수 있습니다.",
      },
      {
        q: "PRO 인증 코드를 분실했어요.",
        a: "도서에 포함된 인증 코드는 1회 등록 후에는 계정에 영구 적용됩니다. 아직 등록하지 않은 상태에서 코드를 분실한 경우, 도서 구매 영수증과 함께 gyumsonsam@gmail.com으로 문의해주세요. 확인 후 재발급을 도와드리겠습니다.",
      },
      {
        q: "FREE 콘텐츠만으로도 충분히 배울 수 있나요?",
        a: "네, 충분합니다. FREE 콘텐츠만으로도 다음을 배울 수 있습니다:\n\n• Python 프로그래밍 기초 (변수, 함수, 클래스, 파일 처리 등)\n• AI의 기본 개념과 원리 (6개 강의)\n• AI API 호출 방법 (Gemini, Groq)\n• 실제 동작하는 AI 앱 6개 제작 (챗봇, 문서Q&A, 번역기, 유튜브기획기, 자막생성기, 이미지분석기)\n\nPRO는 더 깊은 학습과 고급 프로젝트를 원하는 분을 위한 확장 콘텐츠입니다.",
      },
    ],
  },
  {
    id: "learning",
    title: "학습",
    icon: "📚",
    items: [
      {
        q: "어디서부터 시작하면 좋을까요?",
        a: "목표에 따라 추천 경로가 다릅니다:\n\n[프로그래밍 처음]: 코딩 실습 → Python 입문부터 시작하세요. 변수, 조건문, 반복문 등 기초부터 차근차근 배울 수 있습니다.\n\n[AI 이론 학습]: AI 강의 → '생성형 AI란?' 부터 시작하세요. AI/ML/딥러닝의 개념을 체계적으로 학습합니다.\n\n[AI 앱을 직접 만들고 싶다면]: AI 앱 개발 → AI 엔지니어링 12강으로 기법을 배운 후, 바이브코딩 워크샵에서 실제 앱을 만드세요.\n\n[코딩 경험이 있다면]: 바로 바이브코딩 워크샵 W01부터 시작할 수 있습니다. 코딩 실습은 건너뛰어도 됩니다.",
      },
      {
        q: "워크샵은 순서대로 해야 하나요?",
        a: "Phase 1(W01~W06)은 순서대로 하는 것을 권장합니다. 기본적인 AI API 호출, LLM 사용법을 단계적으로 배우기 때문입니다.\n\nPhase 2 이후부터는 관심 있는 워크샵을 자유롭게 선택할 수 있습니다. 다만 일부 워크샵은 선수 지식이 필요할 수 있으며, 각 워크샵 상세 페이지의 '사전 준비' 섹션에서 권장 선행 워크샵을 확인할 수 있습니다.\n\n예시:\n• W13(블로그 플랫폼)은 W12(SaaS 기초) 완료를 권장\n• Phase 5(크리에이터 도구)부터는 W16(배포 마스터) 완료를 권장",
      },
      {
        q: "하나의 워크샵은 얼마나 걸리나요?",
        a: "워크샵마다 다르지만, 대체로 다음과 같습니다:\n\n• Phase 1 (기초): 60~120분\n• Phase 2 (실전): 90~150분\n• Phase 3~4 (풀스택/통합): 120~180분\n• Phase 5~8 (고급): 150~300분\n\n각 워크샵은 Part A(이론 실습, 약 30~60분)와 Part B(실제 앱 제작, 약 60~120분)로 나뉩니다. 하루에 Part A만, 다음 날 Part B를 하는 것도 좋은 방법입니다.",
      },
      {
        q: "학습 진도는 어떻게 확인하나요?",
        a: "두 곳에서 확인할 수 있습니다:\n\n1. 학습 진도 대시보드 (AI 앱 개발 → 학습 진도 대시보드)\n   • Phase별 완료 현황 시각화\n   • 전체 진도율 (%) 표시\n   • 다음 추천 워크샵 안내\n   • 각 워크샵 완료 여부 노드 표시\n\n2. 마이페이지\n   • 전체 학습 통계 (완료 챕터 수, 학습 시간 등)\n   • 최근 학습 기록",
      },
      {
        q: "바이브코딩 워크샵이란 무엇인가요?",
        a: "바이브코딩(Vibe Coding)은 '대화하듯 앱을 만드는' 새로운 개발 방식입니다.\n\n워크샵의 진행 방식:\n1. Part A — 이 플랫폼의 LLM 셀에서 핵심 개념을 직접 실행하며 배웁니다 (예: AI에게 번역 요청하기, 감정 분류하기)\n2. Part B — MD 레시피(마크다운 파일)를 복사해서 AI 코딩 도구(Claude Code 또는 Cursor)에 붙여넣으면, AI가 코드를 자동 생성하여 실제 동작하는 웹앱이 완성됩니다\n\n예를 들어 W01(AI 챗봇)에서는:\n• Part A: chat() 함수로 AI 호출, 대화 히스토리 관리, 성격 커스텀 실습\n• Part B: MD 레시피 → 다크모드, 자동 스크롤, 히스토리 관리가 포함된 완성도 있는 챗봇 웹앱 완성",
      },
      {
        q: "AI 엔지니어링 12강과 워크샵의 차이는?",
        a: "두 콘텐츠는 목적이 다릅니다:\n\n[AI 엔지니어링 12강]\n• 목적: AI 기법을 체계적으로 학습\n• 내용: 프롬프트 엔지니어링, 구조화 출력, Chain-of-Thought, Tool Calling, AI 에이전트, RAG 등\n• 형태: 이론 설명 + LLM 셀 실습 + 퀴즈\n• 결과물: 기법에 대한 이해\n\n[바이브코딩 워크샵]\n• 목적: 12강에서 배운 기법으로 실제 앱 제작\n• 내용: 챗봇, 번역기, 블로그, 대시보드, SaaS 등 42개 프로젝트\n• 형태: Part A(개념 검증) + Part B(MD 레시피 → 웹앱 완성)\n• 결과물: 실제 동작하는 웹앱\n\n추천: 12강으로 기법을 먼저 배운 후, 워크샵에서 실제 앱으로 조립. 또는 바로 워크샵부터 시작해도 됩니다 (워크샵 내에서 필요한 개념을 설명합니다).",
      },
      {
        q: "Playground와 IDE는 무엇인가요?",
        a: "[Playground]\nJupyter 노트북 스타일의 자유 코딩 환경입니다. 셀 단위로 코드를 실행하고 결과를 바로 확인할 수 있어요. 커리큘럼 없이 자유롭게 실험하고 싶을 때 사용하세요. 작성한 코드는 자동 저장됩니다.\n\n[Python IDE]\nVS Code와 유사한 본격 개발 환경입니다. 여러 파일을 만들고 import로 연결할 수 있어요. 실제 프로젝트처럼 폴더 구조를 갖춘 코딩이 가능합니다. 멀티 파일 프로젝트, 모듈화 학습에 적합합니다.",
      },
    ],
  },
  {
    id: "tech",
    title: "기술 · 오류",
    icon: "🔧",
    items: [
      {
        q: "코드가 실행되지 않아요.",
        a: "다음 단계를 순서대로 시도해보세요:\n\n1. 브라우저 새로고침: Cmd+Shift+R (Mac) 또는 Ctrl+Shift+R (Windows)\n2. 런타임 재시작: 실습 페이지 상단의 '🔄 리셋' 버튼 클릭 → Python/JavaScript 런타임이 초기화됩니다\n3. 브라우저 캐시 삭제: 설정 → 캐시 삭제 후 다시 접속\n4. 다른 브라우저에서 시도: Chrome을 권장합니다\n\n위 방법으로도 해결되지 않으면 에러 메시지를 캡처하여 gyumsonsam@gmail.com으로 문의해주세요.",
      },
      {
        q: "에러 메시지가 나와요. 어떻게 해야 하나요?",
        a: "에러는 코딩 학습의 자연스러운 과정입니다! 당황하지 마세요.\n\n해결 순서:\n1. 에러 메시지 읽기: 빨간색 출력 영역에 나타난 메시지를 확인하세요. 대부분 한국어 설명이 포함되어 있습니다.\n2. 힌트 활용: 셀 하단의 '💡 힌트 보기' 버튼을 눌러보세요. 단계별로 해결 방향을 안내합니다.\n3. 정답 확인: 힌트로도 해결이 안 되면 정답 코드를 확인하고 비교해보세요.\n4. 바이브코딩 방식: 에러 메시지를 그대로 복사해서 AI(Claude, ChatGPT 등)에게 '이 에러가 나와요'라고 물어보세요. 대부분 바로 해결됩니다.\n\n자주 발생하는 에러:\n• SyntaxError: 오타, 괄호 누락, 들여쓰기 오류\n• NameError: 변수명 오타 또는 변수 미선언\n• TypeError: 잘못된 타입의 값 사용",
      },
      {
        q: "작성한 코드가 사라졌어요.",
        a: "코드 저장 방식에 따라 다릅니다:\n\n[로그인 상태]\n• 코드가 서버에 자동 저장됩니다\n• 상단의 '저장됨 ✓' 표시를 확인하세요\n• 다른 기기에서도 동일한 코드가 보입니다\n• '처음부터 다시' 버튼을 누르면 원본으로 돌아가니 주의하세요\n\n[비로그인 상태]\n• 브라우저 로컬 저장소에만 저장됩니다\n• 브라우저 데이터를 삭제하면 사라집니다\n• 시크릿/프라이빗 모드에서는 저장되지 않습니다\n\n중요한 코드는 반드시 로그인 후 작업하거나, 별도로 메모장에 복사해두는 것을 권장합니다.",
      },
      {
        q: "지원하는 브라우저는 무엇인가요?",
        a: "권장 브라우저 (최신 버전):\n• Google Chrome ⭐ (가장 안정적)\n• Microsoft Edge\n• Apple Safari\n\n부분 지원:\n• Firefox — 대부분 동작하지만 일부 기능(Web Speech API, 일부 Monaco 에디터 기능)이 제한될 수 있습니다\n\n지원하지 않음:\n• Internet Explorer (IE)\n• 오래된 버전의 브라우저\n\n최상의 경험을 위해 Chrome 최신 버전을 사용해주세요.",
      },
      {
        q: "API 키는 어떻게 발급받나요?",
        a: "AI 엔지니어링 실습과 바이브코딩 워크샵에서는 AI API 키가 필요합니다.\n\n[Gemini API 키 발급 (필수)]\n1. Google AI Studio (aistudio.google.com) 접속\n2. Google 계정으로 로그인\n3. 'API keys' 메뉴 → 'Create API key' 클릭\n4. 발급된 키를 복사\n5. AIGoLab 실습 페이지 상단 '🔑 키 등록' 버튼 → 키 붙여넣기\n\n• Gemini 무료 티어: 하루 1,500회 요청 가능\n• 키는 브라우저에 안전하게 저장되며, 서버로 전송되지 않습니다\n\n[Groq API 키 (선택)]\n• console.groq.com에서 발급\n• 무료 티어: 하루 14,400회\n• Gemini보다 빠른 응답이 필요할 때 사용",
      },
      {
        q: "API 키가 작동하지 않아요.",
        a: "다음을 확인해주세요:\n\n1. 키를 정확히 복사했는지: 앞뒤 공백이 포함되지 않았는지 확인\n2. 키가 활성화되었는지: Google AI Studio에서 키 상태가 'Active'인지 확인\n3. 무료 한도 초과: Gemini는 하루 1,500회, 분당 15회 제한이 있습니다. 시간을 두고 다시 시도하세요\n4. 키 재등록: '🔑 키 등록' → 기존 키 삭제 → 새로 등록\n\n그래도 안 되면 Google AI Studio에서 새 키를 발급받아 다시 등록해보세요.",
      },
      {
        q: "화면이 깨지거나 레이아웃이 이상해요.",
        a: "다음을 시도해보세요:\n\n1. 브라우저 확대/축소 초기화: Cmd+0 (Mac) 또는 Ctrl+0 (Windows)\n2. 강력 새로고침: Cmd+Shift+R (Mac) 또는 Ctrl+Shift+R (Windows)\n3. 다크/라이트 모드 전환: 상단 ☀️/🌙 버튼을 눌러 테마를 바꿔보세요\n4. 브라우저 창 크기 조절: 너무 좁은 화면에서는 일부 UI가 접힐 수 있습니다\n\n특정 페이지에서 반복적으로 발생하면 스크린샷과 함께 gyumsonsam@gmail.com으로 알려주세요.",
      },
    ],
  },
];

/* ─── 컴포넌트 ─── */
export function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // 검색 필터
  const filteredData = FAQ_DATA
    .filter((cat) => !selectedCategory || cat.id === selectedCategory)
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          !search ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const totalCount = FAQ_DATA.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">자주 묻는 질문</h1>
          <p className="text-sm text-brand-textDim">
            {totalCount}개의 질문과 답변이 준비되어 있습니다
          </p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="질문을 검색하세요..."
            className="w-full px-4 py-3 rounded-xl bg-brand-panel border border-brand-subtle
                       text-brand-text text-sm placeholder:text-brand-textDim/50
                       focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${!selectedCategory
                ? "bg-brand-accent/15 text-brand-accent border border-brand-accent/30"
                : "bg-brand-panel text-brand-textDim border border-brand-subtle hover:border-brand-accent/30"
              }`}
          >
            전체
          </button>
          {FAQ_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${selectedCategory === cat.id
                  ? "bg-brand-accent/15 text-brand-accent border border-brand-accent/30"
                  : "bg-brand-panel text-brand-textDim border border-brand-subtle hover:border-brand-accent/30"
                }`}
            >
              {cat.icon} {cat.title}
            </button>
          ))}
        </div>

        {/* FAQ 목록 */}
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-brand-textDim text-sm">
            검색 결과가 없습니다
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((cat) => (
              <div key={cat.id}>
                <h2 className="text-sm font-medium text-brand-textDim uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>{cat.icon}</span>
                  {cat.title}
                </h2>
                <div className="space-y-2">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.id}-${idx}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-brand-subtle overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-start gap-3 p-4 text-left hover:bg-brand-panel/60 transition-colors"
                        >
                          <span className="shrink-0 text-brand-accent text-sm mt-0.5">Q</span>
                          <span className="flex-1 text-sm font-medium text-brand-text">{item.q}</span>
                          <span className={`shrink-0 text-brand-textDim transition-transform ${isOpen ? "rotate-180" : ""}`}>
                            ▾
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pl-10">
                            <p className="text-sm text-brand-textDim leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 하단 */}
        <div className="mt-12 text-center">
          <p className="text-xs text-brand-textDim mb-2">
            찾는 답변이 없으신가요?
          </p>
          <Link
            to="/"
            className="text-sm text-brand-accent hover:underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
