/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "",
  content: [
    "./src/**/*.{js,jsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    // "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
};
