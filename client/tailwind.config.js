import flowbite from 'flowbite/plugin';
import tailwindcss from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#008037',
          yellow: '#F8BF0F',
          blue: '#051836',
        },
      },
    },
  },
  plugins: [
    flowbite
  ],
  corePlugins: {
    version: false
  }
}

