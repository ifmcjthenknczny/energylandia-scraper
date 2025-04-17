import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        energylandia: ['OPTIEdgarBold-Extended', 'sans-serif']
      },
      colors: {
        "background-light": "#c9c9c9",
        "background-dark": "#0a0a0a",
        "gray-dark": "#303030",
        "gray-light": "#808080",
        "font-dark": "#e2e8f0",
        "font-light": "#000000",
        energylandia: "#00a2e4"
      },
    },
  },
  plugins: [],
};
export default config;
