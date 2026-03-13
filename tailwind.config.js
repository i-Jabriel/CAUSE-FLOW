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
        // CAUSE Brand Identity
        black: '#012340',          // CAUSE navy replaces pure black everywhere
        cause: {
          navy:        '#012340',  // primary dark
          'navy-light':'#0A2F52',  // slightly lighter
          mint:        '#6EEDC7',  // primary accent (logo green)
          'mint-dark': '#3DD9AC',  // hover/active mint
          'mint-light':'#D0EFF2',  // pale mint tint
        }
      }
    },
  },
  plugins: [],
}
