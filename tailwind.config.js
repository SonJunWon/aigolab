/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ─── AIGoLab 브랜드 팔레트 (메인 홈, 네비, 강의) ───
        // 에디토리얼 다크 무드: 거의 순수 블랙 + 네온 그린 시그니처
        brand: {
          bg:        "#050505", // 메인 배경 (거의 검정)
          panel:     "#121314", // 카드/패널 배경
          subtle:    "#232527", // 보더, 헤어라인 분리선 (소프트 UI용)
          line:      "#f4f6f6", // 구조 구획선 — 흰색 1px (DecideAI 그리드)
          hover:     "#1a1c1e", // 호버
          text:      "#ededed", // 본문
          textDim:   "#9ca3af", // 서브텍스트
          primary:   "#73ffb9", // 네온 그린 (메인 브랜드)
          primaryDim:"#4fdd9a",
          accent:    "#ff6338", // 오렌지레드 (서브 액센트)
          accentDim: "#e5522a",
          green:     "#73ffb9", // 성공
          red:       "#EF4444", // 에러
          yellow:    "#F59E0B", // 경고
        },
        // ─── 코딩 실습용 팔레트 (기존 Colab 스타일 유지) ───
        colab: {
          bg:        "#202124",
          panel:     "#292a2d",
          subtle:    "#3c4043",
          hover:     "#3c4043",
          text:      "#e8eaed",
          textDim:   "#9aa0a6",
          accent:    "#8ab4f8",
          accentDim: "#669df6",
          green:     "#81c995",
          red:       "#f28b82",
          yellow:    "#fdd663",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Roboto Mono"', '"SF Mono"', 'Monaco', 'Menlo', "monospace"],
        sans: ['"Pretendard Variable"', 'Pretendard', "system-ui", '"Segoe UI"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
