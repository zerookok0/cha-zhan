/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#080706',
        base: '#0B0908',
        surface: '#12100E',
        raised: '#1A1714',
        line: '#26221D',
        gold: '#C9A96A',
        brass: '#A8843F',
        ember: '#C4562A',
        celadon: '#7E9C8F',
        ash: '#8C857A',
        ivory: '#F2EBE0',
        muted: '#9A9184',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        serif: [
          '"Noto Serif SC"',
          '"Songti SC"',
          'SimSun',
          'ui-serif',
          'Georgia',
          'serif',
        ],
        latin: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(201,169,106,0.22), 0 30px 90px -34px rgba(201,169,106,0.42)',
        lift: '0 40px 100px -50px rgba(0,0,0,0.95)',
        bowl: '0 50px 90px -50px rgba(0,0,0,1), 0 0 60px -20px rgba(196,86,42,0.16)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%, -5%, 0) scale(1.07)' },
          '66%': { transform: 'translate3d(-4%, 3%, 0) scale(0.96)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-9px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.72', transform: 'scale(1.04)' },
        },
        smolder: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.7' },
        },
        sheen: {
          '0%': { transform: 'translateX(-140%)' },
          '100%': { transform: 'translateX(240%)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slidein: {
          '0%': { opacity: '0', transform: 'translateX(28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        drift: 'drift 26s ease-in-out infinite',
        marquee: 'marquee 42s linear infinite',
        float: 'float 8s ease-in-out infinite',
        breathe: 'breathe 9s ease-in-out infinite',
        smolder: 'smolder 12s ease-in-out infinite',
        sheen: 'sheen 2.6s ease-in-out',
        pop: 'pop 0.3s cubic-bezier(0.22,1,0.36,1) both',
        slidein: 'slidein 0.42s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 8s linear infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
}
