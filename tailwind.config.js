/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'manuflix-red': '#E50914',
        'manuflix-black': '#141414',
        'manuflix-dark': '#1F1F1F',
        'manuflix-gray': '#757575',
      },
    },
  },
  plugins: [],
}
