/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#163828',
          'dark-hover': '#0E271C',
          forest: '#204735',
          terracotta: '#D6785D',
          'terracotta-badge': '#B85E3E',
          cream: '#FAF7F2',
          'input-bg': '#ECEFEA',
          'input-border': '#CCD5CA',
          'pill-bg': '#E5ECE3',
          muted: '#6E8275',
          'muted-dark': '#485C50'
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      letterSpacing: {
        'extra-wide': '0.22em'
      }
    }
  },
  plugins: [],
}
