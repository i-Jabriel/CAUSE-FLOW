/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        cause: {
          black: '#0A0A0A',
          white: '#FAFAFA',
          gray: {
            50: '#F9F9F9',
            100: '#F3F3F3',
            200: '#E8E8E8',
            300: '#D1D1D1',
            400: '#A8A8A8',
            500: '#737373',
            600: '#525252',
            700: '#3D3D3D',
            800: '#262626',
            900: '#141414',
          }
        }
      }
    },
  },
  plugins: [],
}
