import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";

// @ts-expect-error -- Vite injects this from package.json
const APP_VERSION: string = __APP_VERSION__;

const NAV_ITEMS = [
  { path: "/courses", label: "📚 AI 강의" },
  { path: "/coding", label: "🐍 코딩 실습" },
  { path: "/projects", label: "🧪 프로젝트" },
  { path: "/my", label: "👤 마이" },
];

export function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-subtle">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-14">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="text-base font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
            AIGoLab
          </span>
          <span className="text-[10px] text-brand-textDim/50">v{APP_VERSION}</span>
        </Link>

        {/* 네비게이션 */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer
                ${
                  isActive(item.path)
                    ? "text-brand-primary bg-brand-primary/10"
                    : "text-brand-textDim hover:text-brand-text hover:bg-brand-hover/50"
                }`}
            >
              {item.label}
            </button>
          ))}

          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className="px-2 py-2 text-sm rounded-lg text-brand-textDim hover:text-brand-text hover:bg-brand-hover/50 transition-colors"
            title={theme === "dark" ? "라이트 모드" : "다크 모드"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* 구분선 */}
          <div className="w-px h-5 bg-brand-subtle mx-1" />

          {/* 로그인 상태 */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-panel">
                <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <span className="text-brand-primary text-xs font-medium">
                    {user.email?.[0].toUpperCase() ?? "?"}
                  </span>
                </div>
                <span className="text-xs text-brand-text max-w-[120px] truncate hidden sm:inline">
                  {user.email}
                </span>
              </div>
              <button
                onClick={signOut}
                className="px-3 py-1.5 text-xs text-brand-textDim hover:text-brand-text
                           rounded-lg hover:bg-brand-hover/50 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-1.5 text-xs rounded-lg bg-brand-primary text-white font-medium
                         hover:bg-brand-primaryDim transition-colors"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
