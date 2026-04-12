import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MainHomePage } from "./pages/MainHomePage";
import { HomePage as CodingHomePage } from "./pages/HomePage";
import { CurriculumPage } from "./pages/CurriculumPage";
import { LessonPage } from "./pages/LessonPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { IdePage } from "./pages/IdePage";
import { AuthPage } from "./pages/AuthPage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { NavBar } from "./components/NavBar";
import { ShortcutsHelp } from "./components/ShortcutsHelp";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";
import { useAuthStore } from "./store/authStore";
import { useProgressStore } from "./store/progressStore";

/**
 * NavBar를 표시할지 결정하는 레이아웃.
 * IDE와 레슨 페이지는 자체 헤더가 있어서 NavBar 숨김.
 */
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // 이 경로들은 자체 헤더가 있으므로 NavBar 숨김
  const hideNavBar =
    location.pathname.startsWith("/coding/ide") ||
    location.pathname.startsWith("/coding/playground") ||
    location.pathname.startsWith("/auth") ||
    location.pathname.match(/\/coding\/learn\/[^/]+\/[^/]+\/[^/]+/); // 레슨 상세

  return (
    <>
      {!hideNavBar && <NavBar />}
      {/* NavBar가 fixed라서 그 높이(56px=h-14)만큼 패딩 */}
      <div className={hideNavBar ? "" : "pt-14"}>
        {children}
      </div>
    </>
  );
}

function AppInner() {
  useGlobalShortcuts();
  const initialize = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);
  const migrateToServer = useProgressStore((s) => s.migrateToServer);

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
        {/* 메인 홈 */}
        <Route path="/" element={<MainHomePage />} />

        {/* 코딩 실습 코너 */}
        <Route path="/coding" element={<CodingHomePage />} />
        <Route path="/coding/learn/:language/:track" element={<CurriculumPage />} />
        <Route
          path="/coding/learn/:language/:track/:lessonId"
          element={<LessonPage />}
        />
        <Route path="/coding/playground" element={<PlaygroundPage />} />
        <Route path="/coding/ide" element={<IdePage />} />

        {/* 하위 호환: 기존 URL 리다이렉트 */}
        <Route path="/learn/*" element={<Navigate to="/coding/learn" replace />} />
        <Route path="/playground" element={<Navigate to="/coding/playground" replace />} />
        <Route path="/ide" element={<Navigate to="/coding/ide" replace />} />

        {/* 인증 */}
        <Route path="/auth" element={<AuthPage />} />

        {/* AI 강의 */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/projects" element={<ComingSoon title="🧪 AI 프로젝트" />} />
        <Route path="/my" element={<ComingSoon title="👤 마이페이지" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ShortcutsHelp />
    </Layout>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-brand-bg">
      <div className="text-6xl mb-4">🚧</div>
      <h1 className="text-2xl font-semibold text-brand-text mb-2">{title}</h1>
      <p className="text-brand-textDim mb-6">
        이 코너는 열심히 준비 중입니다. 곧 만나요!
      </p>
      <a
        href="/"
        className="px-5 py-2 text-sm rounded-lg bg-brand-primary text-white hover:bg-brand-primaryDim transition-colors"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
