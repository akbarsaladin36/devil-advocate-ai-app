/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono:    ['"DM Mono"', 'monospace'],
        sans:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        red:   { DEFAULT: '#cc2936', bright: '#e63946', dim: '#7a1a21', glow: 'rgba(204,41,54,0.12)' },
        amber: { DEFAULT: '#e8934a', dim: '#6b3a18' },
        green: { DEFAULT: '#4aad79', dim: '#163d2a' },
        ice:   { DEFAULT: '#8ecae6', dim: '#1a3a4a' },
      },
      animation: {
        'fade-up':  'fadeUp 0.55s ease forwards',
        'fade-in':  'fadeIn 0.4s ease forwards',
        'spin-btn': 'spin 0.75s linear infinite',
        'blink':    'blink 1.1s step-end infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity:'0', transform:'translateY(20px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:  { from: { opacity:'0' }, to: { opacity:'1' } },
        blink:   { '0%,100%': { opacity:'1' }, '50%': { opacity:'0' } },
      },
    },
  },
  plugins: [],
}
