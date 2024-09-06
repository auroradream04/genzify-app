import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    hljs: {
      theme: 'night-owl',
    },
  },
  plugins: [require('tailwind-highlightjs')],
  safelist: [{
    pattern: /hljs+/,
  }],
};
export default config;
