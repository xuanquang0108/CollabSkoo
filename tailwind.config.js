/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ Cần có dòng này để tailwind nhận class "dark"
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        'gray-custom': '#8a8b90',
        black: {
          DEFAULT: '#09090a',
          95: 'rgba(9, 9, 10, 0.95)',
          80: 'rgba(9, 9, 10, 0.80)',
          60: 'rgba(9, 9, 10, 0.60)',
        },
      },
    },
  },
  plugins: [],
}
