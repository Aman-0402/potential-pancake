/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          300: 'rgb(var(--c-primary-300) / <alpha-value>)',
          400: 'rgb(var(--c-primary-400) / <alpha-value>)',
          500: 'rgb(var(--c-primary-500) / <alpha-value>)',
          600: 'rgb(var(--c-primary-600) / <alpha-value>)',
          700: 'rgb(var(--c-primary-700) / <alpha-value>)',
        },
        gold: {
          100: '#F5E9C4',
          200: '#EDD68A',
          300: '#E4C36E',
          400: '#C9A84C',
          500: '#AF8E38',
          600: '#9E7E28',
          700: '#826618',
          800: '#5C4710',
          900: '#3A2D09',
        },
        cream: {
          50:  '#FDFCFA',
          100: '#F8F6F1',
          200: '#F0EDE6',
          300: '#E6E2D9',
          400: '#D8D3C8',
          500: '#C4BEB0',
        },
        charcoal: {
          50:  '#6B6860',
          100: '#504E48',
          200: '#3D3B36',
          300: '#2E2C28',
          400: '#232220',
          500: '#1C1C1E',
          600: '#141412',
          700: '#0D0C0B',
        },
        dark: {
          50:  'rgb(var(--c-dark-50)  / <alpha-value>)',
          100: 'rgb(var(--c-dark-100) / <alpha-value>)',
          200: 'rgb(var(--c-dark-200) / <alpha-value>)',
          300: 'rgb(var(--c-dark-300) / <alpha-value>)',
          400: 'rgb(var(--c-dark-400) / <alpha-value>)',
          500: 'rgb(var(--c-dark-500) / <alpha-value>)',
          600: 'rgb(var(--c-dark-600) / <alpha-value>)',
          700: 'rgb(var(--c-dark-700) / <alpha-value>)',
          800: 'rgb(var(--c-dark-800) / <alpha-value>)',
          900: 'rgb(var(--c-dark-900) / <alpha-value>)',
          950: 'rgb(var(--c-dark-950) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
