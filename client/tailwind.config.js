/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sky: { DEFAULT: '#38BDF8', light: '#7DD3FC', dark: '#0EA5E9' },
        cyan: { DEFAULT: '#22D3EE', light: '#67E8F9' },
        indigo: { DEFAULT: '#6366F1', light: '#818CF8' },
        purple: { DEFAULT: '#A78BFA', light: '#C4B5FD' },
        saas: {
          bg: '#F0F9FF',
          card: '#FFFFFF',
          text: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(56, 189, 248, 0.12), 0 8px 16px -8px rgba(99, 102, 241, 0.08)',
        'card-hover': '0 8px 32px -4px rgba(56, 189, 248, 0.2), 0 12px 24px -8px rgba(99, 102, 241, 0.12)',
      },
      width: {
        sidebar: '280px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 12s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
