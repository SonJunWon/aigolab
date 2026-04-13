import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import { useUIStore } from "../store/uiStore";
import { DefaultAvatar } from "./DefaultAvatar";

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
  const nickname = useProfileStore((s) => s.nickname);
  const avatarEmoji = useProfileStore((s) => s.avatarEmoji);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  // 표시할 이름: 닉네임 > 이메일 @ 앞부분 > 이메일 전체
  const displayName =
    (nickname && nickname.trim()) ||
    (user?.email ? user.email.split("@")[0] : "") ||
    user?.email ||
    "";

  const [mobileOpen, setMobileOpen] = useState(false);

  // 경로 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-subtle">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-14">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="text-base font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
            AIGoLab
          </span>
          <span className="hidden sm:inline text-[10px] text-brand-textDim/50">
            v{APP_VERSION}
          </span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <div className="hidden md:flex items-center gap-1">
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
              <Link
                to="/my"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-brand-panel hover:bg-brand-hover transition-colors"
                title="마이페이지"
              >
                <DefaultAvatar
                  avatarEmoji={avatarEmoji}
                  nickname={nickname}
                  email={user.email}
                  size={24}
                />
                <span className="text-xs text-brand-text max-w-[120px] truncate hidden lg:inline">
                  {displayName}
                </span>
              </Link>
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

        {/* 모바일: 테마 토글 + 햄버거 */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 text-sm rounded-lg text-brand-textDim hover:text-brand-text hover:bg-brand-hover/50 transition-colors"
            aria-label={theme === "dark" ? "라이트 모드" : "다크 모드"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-lg text-brand-textDim hover:text-brand-text hover:bg-brand-hover/50 transition-colors"
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-subtle bg-brand-bg/95 backdrop-blur-md">
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-left px-3 py-2.5 text-sm rounded-lg transition-colors
                  ${
                    isActive(item.path)
                      ? "text-brand-primary bg-brand-primary/10"
                      : "text-brand-text hover:bg-brand-hover/50"
                  }`}
              >
                {item.label}
              </button>
            ))}

            <div className="h-px bg-brand-subtle my-2" />

            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/my"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-panel hover:bg-brand-hover transition-colors"
                >
                  <DefaultAvatar
                    avatarEmoji={avatarEmoji}
                    nickname={nickname}
                    email={user.email}
                    size={28}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-brand-text truncate">
                      {displayName}
                    </div>
                    <div className="text-[10px] text-brand-textDim truncate">
                      {user.email}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={signOut}
                  className="text-left px-3 py-2 text-sm text-brand-textDim hover:text-brand-text
                             rounded-lg hover:bg-brand-hover/50 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2.5 text-sm rounded-lg bg-brand-primary text-white font-medium
                           hover:bg-brand-primaryDim transition-colors"
              >
                로그인
              </button>
            )}

            <div className="pt-2 text-[10px] text-brand-textDim/50 text-center">
              v{APP_VERSION}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
