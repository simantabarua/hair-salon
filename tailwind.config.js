/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#CEA561",
        secondary: "#151515",
      },
      fontFamily: {
        cormorant: ["Cormorant Garamond", "serif"],
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
