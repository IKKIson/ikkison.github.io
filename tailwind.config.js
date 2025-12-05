/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,md}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // 기존 플러그인 유지
  ],
  variants: {
    scrollbar: ['rounded', 'hover'], // 스크롤바 둥글기 및 hover 적용
  },
};
