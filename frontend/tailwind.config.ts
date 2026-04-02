import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070b',
        panel: 'rgba(12, 17, 24, 0.72)',
        border: 'rgba(255, 255, 255, 0.08)',
        accent: {
          DEFAULT: '#4fd1c5',
          soft: '#7dd3fc'
        }
      },
      boxShadow: {
        glass: '0 18px 60px rgba(0, 0, 0, 0.35)',
        insetSoft: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(79, 209, 197, 0.14), transparent 36%), radial-gradient(circle at 80% 20%, rgba(125, 211, 252, 0.10), transparent 28%)'
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' }
        }
      },
      animation: {
        floatSlow: 'floatSlow 8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
