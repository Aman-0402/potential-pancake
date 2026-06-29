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
