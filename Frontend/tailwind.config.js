/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#0A1828',
        'light-blue': '#0F2337',
        'code-green': '#00F5C4',
        'accent-hover': '#33F7D0',
        'accent-dark': '#00C49D',
        primary: {
          DEFAULT: '#0A1828',
          light: '#1A2734',
        },
        secondary: '#1E293B',
        accent: {
          DEFAULT: '#00F5C4',
          hover: '#00D4A7',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, rgba(0, 245, 196, 0.1), rgba(0, 245, 196, 0))',
        'gradient-accent': 'linear-gradient(135deg, #00F5C4, #00D4A7)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 245, 196, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}
