/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        bg1: "rgba(100, 21, 74, 0.1);",
        bg2: "#FECEEB",
        secondary: '#7A3F63'
      }
      
    },
  },
  plugins: [],
}
