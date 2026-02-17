/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f0f0f',
        'bg-secondary': '#1a1a1a',
        'bg-tertiary': '#252525',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'accent': '#e0e0e0',
        'accent-hover': '#ffffff',
      },
      fontFamily: {
        'mono-title': ['"Courier New"', 'Courier', 'monospace'],
      }
    },
  },
  plugins: [],
}
