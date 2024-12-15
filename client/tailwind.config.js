const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Ensures dark mode is toggled via class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      // Custom colors or styles can go here
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
  ],
}



