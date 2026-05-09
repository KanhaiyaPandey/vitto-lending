/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        ink: '#0f0f0f',
        paper: '#fafaf8',
        muted: '#6b6b6b',
        border: '#e2e2dc',
        accent: '#1a56db',
        green: { 600: '#16a34a', 50: '#f0fdf4' },
        red: { 600: '#dc2626', 50: '#fef2f2' },
      },
    },
  },
  plugins: [],
};
