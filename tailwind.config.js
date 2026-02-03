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
        // Onboarding specific colors
        primary: "#FFD600",
        "primary-dark": "#E6C200",
        "background-light": "#FFD600", // For first screen
        "background-dark": "#18181b",
        "surface-dark": "#1E1E1E",
        "brand-blue": "#4F46E5",
        "brand-pink": "#FF8090",
        "brand-red": "#FF4444",
        "mascot-pink": "#FF8F8F",
        "mascot-blue": "#4F46E5",
        "accent-blue": "#4F46E5",
        "accent-pink": "#FF9EAA",
        "accent-red": "#FF4D4D",
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
        'brutal': '0px',
        'xl': "1rem",
        '2xl': "1.5rem",
        '3xl': "2rem",
        '4xl': "3rem",
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        'brutal': '4px',
      },
      fontFamily: {
        'lexend': ['Lexend', 'system-ui', '-apple-system', 'sans-serif'],
        'bold': ['System', 'sans-serif'],
        'display': ['ArchivoBlack_400Regular'],
        'body': ['Inter_400Regular'],
        'serif': ['Merriweather_400Regular'],
        'grotesk': ['SpaceGrotesk_400Regular'],
        'dm': ['DMSans_400Regular'],
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '56px', fontWeight: '900' }],
        'title': ['32px', { lineHeight: '38px', fontWeight: '800' }],
        'subtitle': ['24px', { lineHeight: '30px', fontWeight: '700' }],
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px rgba(0,0,0,1)',
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'hard-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'hard-white': '4px 4px 0px 0px rgba(255,255,255,1)',
        'glow': '0 0 20px rgba(255, 214, 0, 0.5)',
      }
    },
  },
  plugins: [],
};
