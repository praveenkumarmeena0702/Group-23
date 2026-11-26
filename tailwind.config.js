/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Inter Tight"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        canvas: '#FFFFFF',
        ink: '#171717',
        muted: '#737373',
        hairline: '#E9EDF2',
        accent: {
          DEFAULT: '#3B82F6',
          tint: '#EFF6FF',
        },
      },
      borderRadius: {
        card: '24px',
        panel: '30px',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
      boxShadow: {
        glass: '0 18px 48px -28px rgba(16, 24, 40, 0.28)',
        'card-hover': '0 30px 60px -34px rgba(16, 24, 40, 0.24)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
