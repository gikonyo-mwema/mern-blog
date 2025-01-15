import tailwindScrollbar from "tailwind-scrollbar";
import flowbite from "flowbite/plugin";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js", // Include core Flowbite content
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbar, flowbite], // Use the core Flowbite plugin
};
