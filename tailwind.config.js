/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poe: {
          dark: '#0f0f0f',
          surface: '#1a1a1a',
          card: '#252525',
          gold: '#c9a227',
          'gold-light': '#d4af37',
          blood: '#8b0000',
          'blood-light': '#b22222',
          muted: '#6b7280',
          'text': '#f3f4f6',
          'text-muted': '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}
