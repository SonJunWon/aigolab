/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ─── AIGoLab 브랜드 팔레트 (메인 홈, 네비, 강의) ───
        brand: {
          bg:        "#0c0a13", // 메인 배경 (깊은 다크)
          panel:     "#16132a", // 카드/패널 배경
          subtle:    "#2a2545", // 보더, 분리선
          hover:     "#2a2545", // 호버
          text:      "#e8eaed", // 본문
          textDim:   "#9ca3af", // 서브텍스트
          primary:   "#7C3AED", // 바이올렛 (메인 브랜드)
          primaryDim:"#6D28D9",
          accent:    "#06B6D4", // 시안 (서브 액센트)
          accentDim: "#0891B2",
          green:     "#10B981", // 성공
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
        mono: ['"Roboto Mono"', '"SF Mono"', 'Monaco', 'Menlo', "monospace"],
        sans: ['"Google Sans"', '"Roboto"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
