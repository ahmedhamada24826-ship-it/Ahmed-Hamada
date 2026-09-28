import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B2D5B",
          royal: "#2563EB",
          light: "#60A5FA",
          gray: "#E5E7EB",
          dark: "#0F172A",
          white: "#FFFFFF",
          accent: "#38BDF8",
          darkBg: "#0B132B",
          darkCard: "#111D3D",
          darkBorder: "#1E2E56",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
