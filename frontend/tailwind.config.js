// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#003366', // Slightly lighter navy blue color
        },
      },
      fontFamily: {
        'audiowide': ['Audiowide', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
