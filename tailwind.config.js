/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "",
  content: [
    "./src/**/*.{js,jsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    // "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      fillAvailable: {
        width: "webkit-fill-available",
        height: "webkit-fill-available",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
};
