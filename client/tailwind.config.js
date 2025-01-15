import tailwindScrollbar from "tailwind-scrollbar";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ...flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [tailwindScrollbar, flowbite.plugin()],
};
