import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W16 — 앱 배포 마스터.
 *
 * Part A: 배포·SEO·성능 개념 + AI 로 메타 태그 생성 체험 (LLM 셀)
 * Part B: 단계별 배포 가이드 (Vercel + 도메인 + SEO + 모니터링)
 */
export const workshopW16: Lesson = {
  id: "ai-eng-w16-deploy-master",
  language: "ai-engineering",
  track: "beginner",
  order: 116,
  title: "W16: 앱 배포 마스터",
  subtitle: "내 AI 앱을 세상에 공개하기 — 도메인·SEO·성능",
  estimatedMinutes: 180,
  cells: [
    {
      type: "markdown",
      source: `# 🚀 앱 배포 마스터 — 내 AI 앱을 세상에 공개하기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 할 것

**지금까지 만든 AI 앱을 실제 URL 로 배포하고, 검색에 노출되고, 빠르게 로딩되도록** 만듭니다.
localhost 에서만 돌아가던 앱이 \`내이름.vercel.app\` 또는 \`내도메인.com\` 으로 전 세계에 공개됩니다.

### 배포 여정
\`\`\`
  🖥️ localhost:5173              ☁️ vercel.app                 🌐 내도메인.com
  ┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
  │  내 컴퓨터에서만  │  ──────▶  │  무료 배포 완료   │  ──────▶  │  커스텀 도메인    │
  │  나만 볼 수 있음  │  git push │  누구나 접속 가능  │  DNS 설정 │  + SSL 인증서 🔒  │
  │  서버 끄면 끝    │           │  24시간 운영      │           │  전문가처럼 보임   │
  └─────────────────┘           └─────────────────┘           └─────────────────┘
         ↓                              ↓                              ↓
    개발 환경                     프로덕션 (기본)                프로덕션 (프로)
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 배포·==SEO==·성능 개념 + AI 메타 태그 생성 | 60분 | 이 페이지 (이론 + LLM 셀) |
| **Part B** | 단계별 배포 가이드 (8 Steps) | 120분 | 내 컴퓨터 (터미널 + Vercel) |

> ⚠️ **전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 + 배포할 앱 프로젝트 1개 (W01~W15 중 아무거나)`,
    },

    // ─── Part A: 배포·SEO·성능 개념 ───
    {
      type: "markdown",
      source: `## Part A: 배포·SEO·성능 개념 (60분)

배포(deploy) 전에 알아야 할 핵심 개념 4가지를 순서대로 다룹니다.

---

### A-1: 배포란 무엇인가 🏗️

**localhost vs production — 무엇이 다른가?**

\`\`\`
localhost (개발)                    production (배포)
──────────────────                 ──────────────────
✅ 내 컴퓨터에서 실행               ✅ 클라우드 서버에서 실행
❌ 컴퓨터 끄면 접속 불가            ✅ 24시간 365일 운영
❌ 나만 접속 가능                   ✅ 전 세계 누구나 접속
❌ IP 주소 알아야 접속              ✅ 예쁜 도메인 (myapp.com)
❌ HTTPS 없음                      ✅ SSL 인증서 자동 적용
❌ 느림 (내 컴퓨터 사양)            ✅ ==CDN== 으로 전 세계 빠르게
\`\`\`

#### Vercel 이 해주는 것

==Vercel== 은 프론트엔드 앱을 배포하는 플랫폼이에요. GitHub 에 코드를 올리면 **자동으로**:

1. **빌드** — \`npm run build\` 실행해서 최적화된 파일 생성
2. **배포** — 전 세계 ==CDN== 에 파일 분산 배치
3. **도메인** — \`프로젝트명.vercel.app\` 자동 부여
4. **SSL** — HTTPS 인증서 자동 발급
5. **==CI/CD==** — git push 할 때마다 자동 재배포

> 💡 GitHub 에 push 하면 → Vercel 이 감지 → 빌드 → 배포 → URL 생성. 이게 전부!

#### 다른 배포 플랫폼 비교

| 플랫폼 | 무료 | 장점 | 단점 |
|---|---|---|---|
| **Vercel** | ✅ | React/Next.js 최적화, 빠른 CDN | 서버리스 함수 제한 |
| Netlify | ✅ | 비슷한 기능, 폼 내장 | Vercel 보다 빌드 느림 |
| GitHub Pages | ✅ | GitHub 통합, 완전 무료 | 정적 사이트만 (SPA 라우팅 까다로움) |
| Cloudflare Pages | ✅ | 무제한 대역폭, Workers | 빌드 시간 제한 |

**이 워크샵에서는 Vercel 을 사용합니다** — React/Vite 앱과 궁합이 가장 좋아요.`,
    },

    {
      type: "markdown",
      source: `### A-2: ==SEO== 기초 — 검색에 노출되기 🔍

==SEO== (Search Engine Optimization) 는 **Google/Naver 검색에 내 사이트가 잘 나오게 하는 기술**이에요.

#### 검색 엔진이 보는 것

검색 엔진 봇(크롤러)이 내 사이트에 방문하면 이런 걸 확인해요:

\`\`\`html
<head>
  <!-- 1. 제목 — 검색 결과에 큰 글씨로 표시 -->
  <title>AI 번역기 — 자연스러운 한영 번역</title>

  <!-- 2. 설명 — 검색 결과에 제목 아래 표시 -->
  <meta name="description" content="AI 가 맥락을 이해해서 자연스럽게 번역합니다" />

  <!-- 3. OG 태그 — 카카오톡/트위터에 링크 공유할 때 미리보기 -->
  <meta property="og:title" content="AI 번역기" />
  <meta property="og:description" content="자연스러운 한영 번역" />
  <meta property="og:image" content="https://myapp.com/og-image.png" />

  <!-- 4. 파비콘 — 브라우저 탭 아이콘 -->
  <link rel="icon" href="/favicon.ico" />
</head>
\`\`\`

#### ==OG 태그== 의 위력

카카오톡이나 Slack 에 링크를 붙여넣으면 미리보기 카드가 뜨죠? 그게 ==OG 태그== 에요:

\`\`\`
┌─────────────────────────────────┐
│  🖼️  [OG 이미지]                │
│                                 │
│  AI 번역기                      │  ← og:title
│  자연스러운 한영 번역 도구       │  ← og:description
│  myapp.vercel.app               │  ← og:url
└─────────────────────────────────┘
\`\`\`

OG 태그 없으면 → 밋밋한 URL 텍스트만 나옴. 있으면 → 깔끔한 카드 미리보기!

#### robots.txt 와 sitemap.xml

| 파일 | 역할 | 비유 |
|---|---|---|
| \`robots.txt\` | "이 페이지는 크롤링해도 돼, 이건 안 돼" 규칙 | 건물 출입 허가서 |
| \`sitemap.xml\` | "내 사이트의 모든 페이지 목록" | 건물 층별 안내도 |

\`\`\`
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://myapp.com/sitemap.xml
\`\`\``,
    },

    {
      type: "markdown",
      source: `### A-3: 성능 최적화 — 빠르게 로딩하기 ⚡

#### ==Lighthouse== 점수

Chrome DevTools 에 내장된 ==Lighthouse== 는 웹사이트의 성적표예요:

\`\`\`
┌─────────────────────────────────────┐
│         Lighthouse 점수              │
├─────────────────────────────────────┤
│                                     │
│   🟢 Performance    95              │
│   🟢 Accessibility  92              │
│   🟢 Best Practices 100             │
│   🟢 SEO            100             │
│                                     │
│   점수: 🔴 0-49  🟠 50-89  🟢 90-100│
└─────────────────────────────────────┘
\`\`\`

**측정 방법:** Chrome → F12 → Lighthouse 탭 → "Analyze page load" 클릭

#### 성능 최적화 핵심 3가지

**1. 코드 분할 (Code Splitting)**

\`\`\`
❌ 나쁜 예: 모든 코드를 한 번에 다운로드
   bundle.js (2MB) → 로딩 5초 😱

✅ 좋은 예: 필요한 코드만 다운로드
   main.js (200KB) → 로딩 0.5초 🚀
   + 채팅페이지.js (300KB) → 나중에
   + 설정페이지.js (100KB) → 나중에
\`\`\`

React 에서는 \`React.lazy()\` + \`Suspense\` 로 구현:
\`\`\`typescript
// 코드 분할 전
import ChatPage from './pages/ChatPage';

// 코드 분할 후 — 필요할 때만 로드
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
\`\`\`

**2. 이미지 최적화**

| 형식 | 용도 | 크기 |
|---|---|---|
| PNG | 투명 배경 필요할 때 | 크다 |
| JPEG | 사진 | 보통 |
| **WebP** | 모든 용도 (추천) | **30~50% 작다** |
| **AVIF** | 최신 브라우저 | **50~70% 작다** |

**3. 레이지 로딩 (Lazy Loading)**

화면에 보이는 이미지만 먼저 로드, 스크롤하면 나머지 로드:
\`\`\`html
<img src="photo.webp" loading="lazy" alt="설명" />
\`\`\`

> 💡 이 세 가지만 적용해도 ==Lighthouse== Performance 점수가 50점대에서 90점대로 올라갈 수 있어요!`,
    },

    {
      type: "markdown",
      source: `### A-4: AI 로 SEO 메타 태그 생성하기 🤖

배포할 앱의 설명을 입력하면 AI 가 완벽한 ==SEO== 메타 태그를 생성해줍니다.
아래 LLM 셀에서 직접 체험해보세요!`,
    },

    {
      type: "llm-code",
      source: `// === AI SEO 메타 태그 생성기 ===
// 아래 appInfo 를 여러분의 앱 정보로 바꿔보세요!

const appInfo = {
  name: "AI 번역기",
  description: "영어 문장을 넣으면 AI 가 맥락을 파악해서 자연스러운 한국어로 번역해주는 웹앱",
  features: ["실시간 번역", "맥락 이해", "격식체/비격식체 선택", "번역 히스토리"],
  targetAudience: "영어 문서를 자주 읽는 한국인",
  url: "https://my-translator.vercel.app",
};

const prompt = \`
당신은 SEO 전문가입니다. 아래 앱 정보를 바탕으로 완벽한 HTML meta 태그 세트를 생성해주세요.

## 앱 정보
- 이름: \${appInfo.name}
- 설명: \${appInfo.description}
- 기능: \${appInfo.features.join(", ")}
- 대상: \${appInfo.targetAudience}
- URL: \${appInfo.url}

## 생성해야 할 것

1. **기본 meta 태그**
   - title (60자 이내, 핵심 키워드 포함)
   - description (155자 이내)
   - keywords (쉼표 구분)

2. **Open Graph 태그** (카카오톡/Slack 공유용)
   - og:title
   - og:description
   - og:image (추천 이미지 설명 + 권장 크기)
   - og:url
   - og:type

3. **Twitter Card 태그**
   - twitter:card
   - twitter:title
   - twitter:description

4. **추가 태그**
   - canonical URL
   - viewport
   - theme-color
   - robots

완전한 HTML <head> 코드 블록으로 출력하세요.
각 태그 위에 주석으로 역할을 설명하세요.
\`;

const result = await ai(prompt);
display(result);`,
      language: "typescript",
    },

    {
      type: "llm-code",
      source: `// === AI 로 robots.txt + sitemap.xml 생성 ===
// 앱의 페이지 구조를 알려주면 AI 가 파일을 생성해줍니다

const siteInfo = {
  domain: "https://my-translator.vercel.app",
  pages: [
    { path: "/", name: "홈 — 번역기 메인", priority: 1.0 },
    { path: "/history", name: "번역 히스토리", priority: 0.7 },
    { path: "/settings", name: "설정", priority: 0.3 },
  ],
  disallow: ["/api/", "/admin/"],
};

const prompt = \`
아래 사이트 정보로 robots.txt 와 sitemap.xml 파일을 생성해주세요.

도메인: \${siteInfo.domain}

페이지 목록:
\${siteInfo.pages.map(p => \`- \${p.path} : \${p.name} (우선순위: \${p.priority})\`).join("\\n")}

크롤링 차단 경로:
\${siteInfo.disallow.map(p => \`- \${p}\`).join("\\n")}

## 출력 형식

### 1. robots.txt
- 모든 크롤러 허용
- 차단 경로 설정
- sitemap 경로 포함

### 2. sitemap.xml
- XML 형식
- 각 페이지의 loc, lastmod (오늘 날짜), changefreq, priority 포함

각 파일의 역할과 왜 이렇게 작성했는지 간단히 설명도 달아주세요.
\`;

const result = await ai(prompt);
display(result);`,
      language: "typescript",
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

배포에 필요한 핵심 개념을 모두 다뤘어요:
- ✅ localhost vs production 차이 이해
- ✅ ==Vercel== 의 자동 배포 흐름 (push → build → deploy)
- ✅ ==SEO== 메타 태그 + ==OG 태그== 구조 이해
- ✅ ==Lighthouse== 성능 점수와 최적화 기법
- ✅ AI 로 SEO 메타 태그 자동 생성 체험

이제 Part B 에서 **실제로 앱을 배포**합니다!

---

## Part B: 단계별 배포 가이드 (120분)

> 🎯 이번 Part B 는 기존 워크샵과 달리 **앱을 새로 만드는 것이 아니라, 기존 앱을 배포하는 가이드**입니다.
> W01~W15 에서 만든 앱 중 하나를 골라서 따라오세요!

\`\`\`
[기존 앱 프로젝트] → [Step 1~8 따라하기] → [전 세계 공개 + 검색 노출]
\`\`\``,
    },

    // ─── Part B: 단계별 배포 가이드 ───
    {
      type: "markdown",
      source: `### 📋 배포 가이드 — 8 Steps

아래 단계를 순서대로 따라하세요.
각 단계마다 정확한 명령어와 화면 설명이 있습니다.

---

## Step 1: GitHub 리포지토리 셋업 📦

앱 코드를 GitHub 에 올려야 Vercel 이 가져갈 수 있어요.

### 1-1. GitHub 계정 만들기 (이미 있으면 건너뛰기)

1. [github.com](https://github.com) 접속
2. "Sign up" → 이메일·비밀번호·유저네임 입력
3. 이메일 인증 완료

### 1-2. 새 리포지토리 생성

GitHub 웹에서:
1. 오른쪽 상단 **"+"** → **"New repository"**
2. Repository name: \`my-ai-translator\` (앱 이름으로 변경)
3. **Public** 선택 (무료 배포용)
4. "Create repository" 클릭
5. 나오는 화면에서 **HTTPS URL 복사** (예: \`https://github.com/내유저명/my-ai-translator.git\`)

### 1-3. 로컬 프로젝트와 연결

터미널에서 앱 프로젝트 폴더로 이동한 뒤:

\`\`\`bash
# 1. git 초기화 (이미 했으면 건너뛰기)
git init

# 2. 모든 파일 추가
git add .

# 3. 첫 커밋
git commit -m "Initial commit: AI translator app"

# 4. GitHub 리포지토리 연결
git remote add origin https://github.com/내유저명/my-ai-translator.git

# 5. 푸시!
git branch -M main
git push -u origin main
\`\`\`

### 1-4. .gitignore 확인

\`\`\`bash
# 반드시 .gitignore 에 이것들이 있는지 확인!
cat .gitignore
\`\`\`

필수 항목:
\`\`\`
node_modules/
dist/
.env
.env.local
*.log
\`\`\`

> 🚨 **.env 파일은 절대 GitHub 에 올리면 안 됩니다!** API 키가 노출됩니다.`,
    },

    {
      type: "markdown",
      source: `## Step 2: Vercel 계정 + 프로젝트 연결 ☁️

### 2-1. Vercel 가입

1. [vercel.com](https://vercel.com) 접속
2. **"Sign Up"** → **"Continue with GitHub"** (GitHub 계정으로 로그인)
3. 권한 허용

### 2-2. 프로젝트 Import

1. Vercel 대시보드 → **"Add New..."** → **"Project"**
2. "Import Git Repository" 에서 방금 만든 리포지토리 선택
3. 설정 화면:

\`\`\`
┌────────────────────────────────────┐
│  Import Project                    │
├────────────────────────────────────┤
│                                    │
│  Project Name: my-ai-translator    │
│  Framework Preset: Vite  ✅        │  ← 자동 감지됨
│  Root Directory: ./                │
│                                    │
│  Build & Output Settings:          │
│  Build Command: npm run build      │  ← 기본값 OK
│  Output Dir: dist                  │  ← Vite 기본값
│                                    │
│  [Deploy]                          │
└────────────────────────────────────┘
\`\`\`

4. **"Deploy"** 클릭!
5. 1~2분 후 **배포 완료** 🎉

\`\`\`
✅ Congratulations!
Your project has been deployed to:
https://my-ai-translator.vercel.app
\`\`\`

> 💡 이제 이 URL 로 전 세계 누구나 접속할 수 있어요!`,
    },

    {
      type: "markdown",
      source: `## Step 3: 환경 변수 설정 🔑

앱이 API 키를 사용한다면 (Gemini, OpenAI 등), Vercel 에도 환경 변수를 등록해야 해요.

### 3-1. 환경 변수 추가

1. Vercel 대시보드 → 프로젝트 선택
2. **"Settings"** → **"Environment Variables"**
3. 변수 추가:

\`\`\`
┌──────────────────────────────────────┐
│  Environment Variables               │
├──────────────────────────────────────┤
│                                      │
│  Key:   VITE_GEMINI_API_KEY          │
│  Value: ●●●●●●●●●●●●●●●●●●          │
│                                      │
│  Environments:                       │
│  ☑ Production                        │
│  ☑ Preview                           │
│  ☐ Development                       │
│                                      │
│  [Save]                              │
└──────────────────────────────────────┘
\`\`\`

> ⚠️ **Vite 프로젝트**에서 프론트엔드에서 사용하는 환경 변수는 반드시 \`VITE_\` 접두사가 필요해요!
>
> 예: \`VITE_GEMINI_API_KEY\`, \`VITE_OPENAI_KEY\`

### 3-2. 재배포

환경 변수를 추가한 후:
1. **"Deployments"** 탭 → 가장 최근 배포 → **"..."** → **"Redeploy"**
2. 또는 로컬에서 아무 변경 + \`git push\` → 자동 재배포

### 3-3. 보안 주의사항

\`\`\`
✅ 안전: 서버 사이드에서만 사용하는 키
   → Vercel 환경 변수에 저장 (VITE_ 접두사 없이)

⚠️ 주의: 프론트엔드에서 사용하는 키 (VITE_ 접두사)
   → 브라우저 소스에 노출됨
   → 무료 API 키이거나 사용량 제한 설정 필수

❌ 위험: .env 파일을 GitHub 에 push
   → API 키 유출! 즉시 키 재발급 필요
\`\`\``,
    },

    {
      type: "markdown",
      source: `## Step 4: 커스텀 도메인 설정 🌐

### 옵션 A: 무료 도메인 (.vercel.app)

기본으로 제공되는 \`프로젝트명.vercel.app\` 을 그대로 사용해도 충분해요!
- 무료, SSL 자동, 빠른 CDN
- 예: \`my-ai-translator.vercel.app\`

### 옵션 B: 저렴한 커스텀 도메인

나만의 도메인을 원한다면:

| 등록 업체 | 가격 (.com) | 특징 |
|---|---|---|
| [Namecheap](https://namecheap.com) | ~$9/년 | 저렴, 깔끔 |
| [Cloudflare](https://cloudflare.com) | ~$9/년 | 마진 없이 원가 판매 |
| [가비아](https://gabia.com) | ~12,000원/년 | 한국 업체, .kr 도메인 |

### 도메인 연결 방법

1. Vercel 대시보드 → 프로젝트 → **"Settings"** → **"Domains"**
2. 도메인 입력: \`myapp.com\`
3. Vercel 이 보여주는 DNS 레코드를 도메인 업체에서 설정:

\`\`\`
┌──────────────────────────────────────────┐
│  DNS 설정 (도메인 업체 패널에서)          │
├──────────────────────────────────────────┤
│                                          │
│  Type: A                                 │
│  Name: @                                 │
│  Value: 76.76.21.21                      │
│                                          │
│  Type: CNAME                             │
│  Name: www                               │
│  Value: cname.vercel-dns.com             │
│                                          │
└──────────────────────────────────────────┘
\`\`\`

4. DNS 전파 대기 (보통 5분~24시간)
5. Vercel 이 SSL 인증서 자동 발급 🔒

> 💡 DNS 전파가 끝나면 \`https://myapp.com\` 으로 접속 가능! HTTPS 도 자동이에요.`,
    },

    {
      type: "markdown",
      source: `## Step 5: ==SEO== 체크리스트 ✅

배포된 앱에 검색 엔진 최적화를 적용하세요.

### 5-1. index.html 메타 태그 추가

\`public/index.html\` 또는 Vite 프로젝트의 루트 \`index.html\`:

\`\`\`html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SEO 기본 -->
  <title>AI 번역기 — 자연스러운 한영 번역 | MyApp</title>
  <meta name="description" content="AI 가 맥락을 파악해서 자연스럽게 번역합니다. 격식체·비격식체 선택, 번역 히스토리 지원." />
  <meta name="keywords" content="AI 번역, 한영 번역, AI translator, 자연어 처리" />

  <!-- Open Graph (카카오톡/Slack 공유) -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="AI 번역기 — 자연스러운 한영 번역" />
  <meta property="og:description" content="AI 가 맥락을 파악해서 자연스럽게 번역합니다" />
  <meta property="og:image" content="https://myapp.com/og-image.png" />
  <meta property="og:url" content="https://myapp.com" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AI 번역기" />
  <meta name="twitter:description" content="자연스러운 한영 번역 도구" />

  <!-- 기타 -->
  <meta name="theme-color" content="#0f172a" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="canonical" href="https://myapp.com" />
</head>
\`\`\`

### 5-2. OG 이미지 만들기

1280x640px 크기의 OG 이미지를 만들어야 해요:

- **무료 도구:** [Canva](https://canva.com) 에서 "Social Media" 템플릿
- **AI 생성:** Part A 에서 AI 에게 이미지 설명 생성 요청
- 파일을 \`public/og-image.png\` 에 저장

### 5-3. robots.txt 추가

\`public/robots.txt\`:
\`\`\`
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://myapp.com/sitemap.xml
\`\`\`

### 5-4. sitemap.xml 추가

\`public/sitemap.xml\`:
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://myapp.com/</loc>
    <lastmod>2026-04-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
\`\`\``,
    },

    {
      type: "markdown",
      source: `## Step 6: 성능 최적화 적용 ⚡

### 6-1. Vite 빌드 최적화 확인

\`vite.config.ts\` 에 추가:

\`\`\`typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // 벤더 라이브러리 분리 (코드 분할)
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
\`\`\`

### 6-2. React 코드 분할 (lazy loading)

\`\`\`typescript
import { Suspense, lazy } from 'react';

// 페이지 컴포넌트를 lazy 로 불러오기
const ChatPage = lazy(() => import('./pages/ChatPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

### 6-3. 이미지 최적화

\`\`\`bash
# WebP 변환 (squoosh CLI 사용)
npx @aspect-build/rules_js squoosh-cli --webp auto hero.png

# 또는 온라인 도구: squoosh.app
\`\`\`

HTML 에서:
\`\`\`html
<picture>
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.png" alt="히어로 이미지" loading="lazy" />
</picture>
\`\`\`

### 6-4. ==Lighthouse== 점검

\`\`\`
Chrome → F12 → Lighthouse 탭
→ Categories: ☑ Performance ☑ Accessibility ☑ Best Practices ☑ SEO
→ "Analyze page load" 클릭
→ 목표: 모든 항목 🟢 90점 이상
\`\`\``,
    },

    {
      type: "markdown",
      source: `## Step 7: 모니터링 설정 📊

배포 후에도 앱이 잘 돌아가는지 모니터링해야 해요.

### 7-1. Vercel Analytics (무료)

1. Vercel 대시보드 → 프로젝트 → **"Analytics"** 탭
2. **"Enable"** 클릭
3. 프로젝트에 패키지 설치:

\`\`\`bash
npm install @vercel/analytics
\`\`\`

\`src/main.tsx\` 에 추가:
\`\`\`typescript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      {/* 기존 앱 컴포넌트 */}
      <MyApp />
      <Analytics />
    </>
  );
}
\`\`\`

**확인 가능한 지표:**
- 페이지뷰 수
- 방문자 수 (고유)
- 국가별 접속 통계
- 인기 페이지
- Web Vitals (LCP, FID, CLS)

### 7-2. Vercel Speed Insights (무료)

\`\`\`bash
npm install @vercel/speed-insights
\`\`\`

\`\`\`typescript
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <MyApp />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
\`\`\`

### 7-3. 에러 트래킹 (선택)

앱에서 에러가 나면 알림을 받고 싶다면:

| 도구 | 무료 | 특징 |
|---|---|---|
| [Sentry](https://sentry.io) | 5,000 이벤트/월 | 가장 많이 씀, 에러 상세 정보 |
| Console.log + Vercel Logs | 무한 | Vercel 대시보드 → Functions → Logs |

기본적으로 **Vercel Logs** 만으로도 충분해요:
- Vercel 대시보드 → **"Deployments"** → 배포 선택 → **"Functions"** 탭
- 실시간 로그 확인 가능

### 7-4. ==CI/CD== 자동 배포 확인

GitHub 에 push 할 때마다 자동 배포되는지 확인:

\`\`\`bash
# 로컬에서 작은 변경 후
echo "<!-- deployed -->" >> index.html
git add .
git commit -m "test auto deploy"
git push

# Vercel 대시보드에서 자동 빌드 시작되는지 확인!
\`\`\`

\`\`\`
GitHub Push  →  Vercel 감지  →  빌드 시작  →  배포 완료
  (30초)         (즉시)        (1~2분)       (자동)
\`\`\``,
    },

    {
      type: "markdown",
      source: `## Step 8: (보너스) 결제 연동 기초 💳

> 🎯 이 단계는 선택입니다. AI 앱으로 수익을 만들고 싶다면 참고하세요.

### Stripe — 가장 쉬운 결제 연동

[Stripe](https://stripe.com) 은 개발자 친화적인 결제 플랫폼이에요.

\`\`\`
사용자 → [결제 버튼 클릭] → Stripe Checkout 페이지
                                   ↓
                           카드 정보 입력 (Stripe 가 처리)
                                   ↓
                           결제 완료 → 내 앱으로 돌아옴
                                   ↓
                           Webhook 으로 결과 수신
\`\`\`

### 기본 흐름

\`\`\`typescript
// 프론트엔드: 결제 버튼
const handlePayment = async () => {
  // 서버에 결제 세션 생성 요청
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    body: JSON.stringify({ plan: 'pro', price: 9900 }),
  });
  const { url } = await response.json();
  // Stripe 결제 페이지로 이동
  window.location.href = url;
};
\`\`\`

### 필요한 것

| 항목 | 설명 |
|---|---|
| Stripe 계정 | [stripe.com](https://stripe.com) 에서 가입 |
| 서버 | Vercel Serverless Functions 또는 별도 백엔드 |
| 사업자 등록 | 실제 결제 수금 시 필요 (테스트는 불필요) |

> 💡 **팁:** 처음에는 Stripe 테스트 모드로 연습하세요. 실제 결제 없이 전체 흐름을 테스트할 수 있어요.
> 테스트 카드: \`4242 4242 4242 4242\` (유효기간: 아무 미래 날짜)

결제 연동은 그 자체로 하나의 큰 주제이므로, 여기서는 개념만 소개합니다.
본격적으로 구현하고 싶다면 AI 에게:

> "Stripe Checkout 을 Vercel Serverless Function 으로 구현해줘. React + TypeScript 프로젝트야."

라고 요청하면 됩니다!`,
    },

    // ─── 도전 과제 + 완료 ───
    {
      type: "markdown",
      source: `## 🎯 도전 과제

배포가 완료되면 아래 추가 작업에 도전해보세요:

| 난이도 | 도전 내용 |
|---|---|
| ⭐ | ==Lighthouse== 4개 항목 모두 90점 이상 달성 |
| ⭐ | 카카오톡에 내 앱 URL 보내서 OG 미리보기 확인 |
| ⭐⭐ | Google Search Console 에 사이트 등록 |
| ⭐⭐ | 커스텀 404 페이지 만들기 |
| ⭐⭐ | PWA 설정 (홈 화면에 앱 추가 가능하게) |
| ⭐⭐⭐ | GitHub Actions 로 테스트 → 배포 파이프라인 구축 |
| ⭐⭐⭐ | Stripe 결제 테스트 모드 연동 |

각 도전을 AI 에게 요청할 때:
> "내 React+Vite 앱에 [기능] 을 추가해줘. Vercel 에 배포되어 있어."

## ✅ W16 완료!

축하합니다! 🎉 여러분의 AI 앱이 이제 전 세계에 공개되었습니다.

- ✅ Part A: 배포·==SEO==·성능 개념 이해 + AI 메타 태그 생성
- ✅ Part B: GitHub → ==Vercel== 배포 → 도메인 → ==SEO== → 성능 → 모니터링
- ✅ 도전: ==Lighthouse== 점수 최적화, ==CI/CD== 자동 배포

### 배운 핵심 기술

\`\`\`
localhost → GitHub → Vercel → 커스텀 도메인
                ↓
         자동 배포 (CI/CD)
                ↓
     SEO + 성능 최적화 + 모니터링
                ↓
        전 세계에 공개된 내 AI 앱! 🌍
\`\`\`

### 다음 워크샵 예고
**W17: AI 에이전트** — 단순 챗봇을 넘어서, 스스로 검색하고·판단하고·실행하는 AI 에이전트를 만듭니다.
Tool use, function calling, 멀티스텝 추론까지 — AI 의 다음 단계!`,
    },
  ],

  quiz: {
    title: "W16 — 앱 배포 마스터 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "Vercel 에 앱을 배포하는 기본 흐름으로 올바른 것은?",
        options: [
          "FTP 로 서버에 파일 업로드 → 도메인 연결",
          "GitHub 에 push → Vercel 이 자동 빌드 → CDN 배포 → URL 생성",
          "Docker 이미지 생성 → AWS EC2 에 올리기 → 로드밸런서 설정",
          "zip 파일로 압축 → Vercel 에 직접 업로드",
        ],
        correctIndex: 1,
        explanation:
          "Vercel 은 GitHub 리포지토리와 연결하면 push 할 때마다 자동으로 빌드·배포합니다. 이런 자동화를 CI/CD 라고 해요.",
      },
      {
        type: "multiple-choice",
        question:
          "카카오톡에 내 웹사이트 링크를 보냈을 때 미리보기 카드 (제목, 설명, 이미지) 가 나타나게 하려면 무엇이 필요한가요?",
        options: [
          "robots.txt 파일에 사이트 정보 작성",
          "HTML <head> 에 Open Graph (og:) 메타 태그 추가",
          "sitemap.xml 에 페이지 목록 등록",
          "Lighthouse 점수 90점 이상 달성",
        ],
        correctIndex: 1,
        explanation:
          "Open Graph (OG) 태그는 og:title, og:description, og:image 등으로 링크 공유 시 미리보기 카드를 정의합니다. 카카오톡, Slack, Twitter 등에서 모두 이 태그를 읽어요.",
      },
      {
        type: "multiple-choice",
        question:
          "웹 성능 최적화에서 '코드 분할 (Code Splitting)' 의 효과는?",
        options: [
          "코드를 여러 파일로 나누어 가독성을 높인다",
          "처음 로딩할 때 필요한 코드만 다운로드하여 로딩 속도를 빠르게 한다",
          "서버 비용을 줄인다",
          "보안을 강화한다",
        ],
        correctIndex: 1,
        explanation:
          "코드 분할은 전체 번들을 작은 청크로 나누어서, 현재 페이지에 필요한 코드만 먼저 다운로드합니다. React.lazy() 와 Suspense 로 구현할 수 있어요.",
      },
    ],
  } satisfies Quiz,
};
