/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a', // Keep Deep Slate base
        },
        primary: {
          DEFAULT: '#D96914', // User Primary (Orange)
          500: '#D96914',
          600: '#c25e12', // Slightly darker for hovers
          400: '#e57a2b',
        },
        secondary: {
          DEFAULT: '#0A2B10', // User Secondary (Dark Green)
          500: '#0A2B10', 
          400: '#14521f', // Lighter for visibility if needed
          900: '#051608',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
