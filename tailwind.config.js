/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontSize: {
        'base': '0.8rem',     // Adjust base font size
        'sm': '0.65rem',      // Smaller text
        'lg': '0.85rem',      // Larger text
        'xl': '1.0rem',       // Extra large text
        '2xl': '1.0rem',     // 2X large text
      },
    },
  },
  plugins: [],
} 