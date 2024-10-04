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
        'max-650': { 'max': '650px' }, // Anpassad max-width breakpoint för 650px
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        'xxl': '1536px',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addComponents }) {
      addComponents({
        '.button': {
          marginLeft: '1rem',   // Utrymme mellan knapparna
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: '#218838',
          transition: 'color 0.3s ease, transform 0.3s ease',
          fontSize: '1.125rem', // Large font-size (18px)
        },
        '.button:hover': {
          color: '#01d613', // Ljusare grön färg
          transform: 'scale(1.1)', // Gör texten lite större
          backgroundColor: 'transparent', // Ingen bakgrundsfärg
        },
      });
    }
  ],
};
