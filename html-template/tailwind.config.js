/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,js}"],
  theme: {
    extend: {
      maxWidth: {
        "8xl": "82.5rem",
      },
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
