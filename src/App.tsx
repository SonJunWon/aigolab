import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MainHomePage } from "./pages/MainHomePage";
import { HomePage as CodingHomePage } from "./pages/HomePage";
import { CurriculumPage } from "./pages/CurriculumPage";
import { LessonPage } from "./pages/LessonPage";
import { useParams } from "react-router-dom";

/** lessonId 변경 시 LessonPage 전체를 리마운트하는 래퍼 */
function LessonPageWrapper() {
  const { lessonId } = useParams();
  return <LessonPage key={lessonId} />;
}
import { AiDevPage } from "./pages/AiDevPage";
import { WorkshopListPage } from "./pages/WorkshopListPage";
import { WorkshopDetailPage } from "./pages/WorkshopDetailPage";
import { ProgressDashboardPage } from "./pages/ProgressDashboardPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { IdePage } from "./pages/IdePage";
import { AuthPage } from "./pages/AuthPage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { ShortcutsHelp } from "./components/ShortcutsHelp";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";
import { useAuthStore } from "./store/authStore";
import { useUIStore } from "./store/uiStore";
import { MyPage } from "./pages/MyPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProjectWorkPage } from "./pages/ProjectWorkPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { AdminPage } from "./pages/AdminPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useProgressStore } from "./store/progressStore";
import { useKeyModalStore } from "./store/keyModalStore";
import { KeySetupModal } from "./components/llm/KeySetupModal";

/** 라우트 변경 시 스크롤 최상단으로 복원 */
function ScrollToTop() {
  const { pathname } = useLocation();

  // 브라우저 자동 스크롤 복원 비활성화 — SPA에서는 직접 제어
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const scroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    // 즉시 + rAF + 지연 — 비동기 렌더링·레이아웃 시프트 모두 대비
    scroll();
    requestAnimationFrame(scroll);
    const t = setTimeout(scroll, 50);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}

/**
 * NavBar/Footer를 표시할지 결정하는 레이아웃.
 * IDE와 레슨 페이지는 자체 헤더가 있어서 NavBar 숨김.
 * 전체화면 페이지(IDE, Playground, Lesson 상세, Auth)는 Footer도 숨김.
 */
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // 이 경로들은 자체 헤더가 있으므로 NavBar + Footer 숨김
  const hideChrome =
    location.pathname.startsWith("/coding/ide") ||
    location.pathname.startsWith("/coding/playground") ||
    location.pathname.startsWith("/auth") ||
    !!location.pathname.match(/\/projects\/[^/]+\/work/) || // 프로젝트 모드 IDE
    !!location.pathname.match(/\/coding\/learn\/[^/]+\/[^/]+\/[^/]+/); // 레슨 상세

  return (
    <>
      <ScrollToTop />
      {!hideChrome && <NavBar />}
      {/* NavBar가 fixed라서 그 높이(56px=h-14)만큼 패딩 */}
      <div className={hideChrome ? "" : "pt-14"}>
        {children}
      </div>
      {!hideChrome && <Footer />}
    </>
  );
}

function AppInner() {
  useGlobalShortcuts();
  const initialize = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);
  const migrateToServer = useProgressStore((s) => s.migrateToServer);

  const theme = useUIStore((s) => s.theme);

  // 테마 적용
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // 앱 시작 시 Supabase 세션 복원
  useEffect(() => {
    void initialize();
  }, [initialize]);

  // 로그인 시 IDB → Supabase 진도 마이그레이션
  useEffect(() => {
    if (user) {
      void migrateToServer();
    }
  }, [user, migrateToServer]);

  return (
    <Layout>
      <Routes>
        {/* ─── 자유 접근 (로그인 불필요) ─── */}
        <Route path="/" element={<MainHomePage />} />
        <Route path="/coding" element={<CodingHomePage />} />
        <Route path="/ai-dev" element={<AiDevPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* 하위 호환: 기존 URL 리다이렉트 */}
        <Route path="/learn/*" element={<Navigate to="/coding/learn" replace />} />
        <Route path="/playground" element={<Navigate to="/coding/playground" replace />} />
        <Route path="/ide" element={<Navigate to="/coding/ide" replace />} />

        {/* ─── 로그인 필수 (비로그인 시 유도 화면) ─── */}

        {/* 코딩 실습 */}
        <Route path="/coding/learn/:language/:track" element={<ProtectedRoute><CurriculumPage /></ProtectedRoute>} />
        <Route path="/coding/learn/:language/:track/:lessonId" element={<ProtectedRoute><LessonPageWrapper /></ProtectedRoute>} />
        <Route path="/coding/playground" element={<ProtectedRoute><PlaygroundPage /></ProtectedRoute>} />
        <Route path="/coding/ide" element={<ProtectedRoute><IdePage /></ProtectedRoute>} />

        {/* AI 앱 개발 */}
        <Route path="/ai-dev/track" element={<ProtectedRoute><Navigate to="/coding/learn/ai-engineering/beginner" replace /></ProtectedRoute>} />
        <Route path="/ai-dev/workshop" element={<ProtectedRoute><WorkshopListPage /></ProtectedRoute>} />
        <Route path="/ai-dev/workshop/:workshopId" element={<ProtectedRoute><WorkshopDetailPage /></ProtectedRoute>} />
        <Route path="/ai-dev/progress" element={<ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>} />

        {/* AI 강의 상세 · 프로젝트 */}
        <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/projects/:projectId/work" element={<ProtectedRoute><ProjectWorkPage /></ProtectedRoute>} />
        <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />

        {/* 마이페이지 · 관리자 */}
        <Route path="/my" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ShortcutsHelp />
      <GlobalKeyModal />
    </Layout>
  );
}

/**
 * 전역 KeySetupModal — `useKeyModalStore` 구독.
 * `chat()` 실패나 레슨 🔑 버튼에서 트리거.
 */
function GlobalKeyModal() {
  const isOpen = useKeyModalStore((s) => s.isOpen);
  const initialProvider = useKeyModalStore((s) => s.initialProvider);
  const close = useKeyModalStore((s) => s.close);
  if (!isOpen) return null;
  return <KeySetupModal initialProvider={initialProvider} onClose={close} />;
}


function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
