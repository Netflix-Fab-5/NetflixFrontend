/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        default: "#000000", // Svart bakgrund globalt
      },
      colors: {
        buttonGreen: "#22c55e", // Grön färg för knappar
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
