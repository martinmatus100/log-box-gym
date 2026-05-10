/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#0A0A0A',
          surface: '#181818',
          elevated: '#242424',
        },
        border: {
          subtle: '#2E2E2E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8A8A8A',
        },
        accent: {
          DEFAULT: '#FF6B35',
          dim: '#CC5529',
          glow: 'rgba(255,107,53,0.15)',
        },
        danger: '#FF4757',
        box: '#FF6B35',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'pill': '9999px',
        'card': '1.5rem',
      },
    },
  },
  plugins: [],
}