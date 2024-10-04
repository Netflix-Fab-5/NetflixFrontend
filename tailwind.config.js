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
      screens: {
        'max-650': { 'max': '650px' }, // Custom max-width breakpoint for 650px
        'sm': '640px',  
        'md': '768px',  
        'lg': '1024px', 
        'xl': '1280px',
        'xxl': '1536px',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
