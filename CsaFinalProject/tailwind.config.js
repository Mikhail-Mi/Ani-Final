/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-yellow-400',
    'shadow-yellow-400/50',
    'bg-pink-500',
    'shadow-pink-500/50',
    'bg-cyan-400',
    'shadow-cyan-400/50',
    'bg-green-400',
    'shadow-green-400/50',
    'bg-purple-500',
    'shadow-purple-500/50',
  ],
};
