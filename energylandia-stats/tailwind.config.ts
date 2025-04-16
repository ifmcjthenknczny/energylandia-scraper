import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        energylandia: ['OPTIEdgarBold-Extended', 'sans-serif']
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "background-light": "#2a2a2a",
        "gray-dark": "#303030",
        "gray-light": "#505050",
        energylandia: "#00a2e4"
      },
    },
  },
  plugins: [],
};
export default config;
