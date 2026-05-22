/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C5C', // Deep Emerald
        },
        secondary: {
          DEFAULT: '#D4B483', // Champagne Gold
        },
        background: {
          DEFAULT: '#FAF8F4',
        },
        accent: {
          DEFAULT: '#E8DCCB',
        },
        text: {
          DEFAULT: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
