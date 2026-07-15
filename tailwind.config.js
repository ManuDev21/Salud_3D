/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        bio: {
          50: '#eefdf6',
          100: '#d5fbe9',
          200: '#aef5d5',
          300: '#76eab9',
          400: '#38d795',
          500: '#12bd77',
          600: '#079a60',
          700: '#087a4f',
          800: '#0a6141',
          900: '#0a4f37',
          950: '#022c1f',
        },
        aurora: {
          cyan: '#22d3ee',
          violet: '#a855f7',
          pink: '#ec4899',
          amber: '#f59e0b',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.25)',
        glow: '0 0 40px rgba(56, 215, 149, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
    },
  },
  plugins: [],
}
