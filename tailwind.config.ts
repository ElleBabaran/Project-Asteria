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
        cream: "#F7F4ED",
        paper: "#FCFBF7",
        sage: {
          DEFAULT: "#5B8A7A",
          light: "#9FC2B5",
          dark: "#3D5C52",
        },
        blush: {
          DEFAULT: "#E0A6BE",
          light: "#F2D6E2",
        },
        leaf: {
          DEFAULT: "#92C58A",
          light: "#CFE6CA",
        },
        butter: {
          DEFAULT: "#F0D27D",
          light: "#FAEFC9",
        },
        ink: "#2E3B36",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "0.875rem",
      },
      boxShadow: {
        card: "0 2px 0 0 rgba(61, 92, 82, 0.08), 0 8px 24px -8px rgba(61, 92, 82, 0.18)",
        tab: "0 -1px 0 0 rgba(61, 92, 82, 0.08) inset",
      },
    },
  },
  plugins: [],
};
export default config;
