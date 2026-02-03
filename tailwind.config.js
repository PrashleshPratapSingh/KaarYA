/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        karya: {
          yellow: '#FFE500',
          black: '#000000',
          white: '#FFFFFF',
        },
        badge: {
          nift: '#E91E63',
          iit: '#4CAF50',
          du: '#2196F3',
          bits: '#FF9800',
          nlu: '#9C27B0',
        },
      },
      borderRadius: {
        'karya': '30px',
        'karya-sm': '16px',
        'karya-lg': '40px',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      fontFamily: {
        'bold': ['System', 'sans-serif'],
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '56px', fontWeight: '900' }],
        'title': ['32px', { lineHeight: '38px', fontWeight: '800' }],
        'subtitle': ['24px', { lineHeight: '30px', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};
