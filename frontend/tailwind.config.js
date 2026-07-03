/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': 'var(--bg-main)',
        surface: 'var(--bg-surface)',
        main: 'var(--text-main)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        income: 'var(--color-income)',
        expense: 'var(--color-expense)',
        balance: 'var(--color-balance)',
        'in-hand': 'var(--color-in-hand)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'primary-light': 'var(--primary-light)',
        'primary-text': 'var(--primary-text)',
        inverse: 'var(--text-inverse)'
      },
      borderColor: {
        DEFAULT: 'var(--border-color)',
        main: 'var(--border-color)'
      }
    },
  },
  plugins: [],
}
