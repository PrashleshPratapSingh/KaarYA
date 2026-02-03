/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'karya-yellow': '#FFE500',
        'karya-black': '#000000',
      },
      borderWidth: {
        'brutal': '4px',
      },
      borderRadius: {
        'brutal': '0px',
      },
      fontFamily: {
        'lexend': ['Lexend', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
