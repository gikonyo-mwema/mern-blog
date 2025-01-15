import tailwindScrollbar from "tailwind-scrollbar";
import { Flowbite } from "flowbite-react";
import "flowbite-react/dist/index.css";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ...Flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [tailwindScrollbar, Flowbite.plugin()],
};
