/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0052ff', // Base Blue
          600: '#0045d8',
          900: '#001a52',
        },
        dark: {
          900: '#0f1115',
          800: '#1a1d24',
          700: '#252932',
          50: '#f8fafc',
          100: '#f1f5f9'
        },
        holiday: {
          red: '#D42426',
          green: '#146B3A',
          gold: '#F8B229',
          snow: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'snow': 'snow 10s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'blob': 'blob 7s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        snow: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0.3' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      }
    },
  },
  plugins: [],
}
