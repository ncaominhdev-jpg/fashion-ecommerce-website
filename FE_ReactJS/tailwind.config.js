/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#181514",
        linen: "#faf6ef",
        clay: "#b66d52",
        cocoa: "#3b2d28",
        champagne: "#ead2aa",
      },
      fontFamily: {
        display: ["Be Vietnam Pro", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Be Vietnam Pro", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 21, 20, 0.10)",
        lift: "0 20px 70px rgba(24, 21, 20, 0.16)",
      },
    },
  },
  plugins: [],
};
