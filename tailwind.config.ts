import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#15121b",
        "primary-container": "#7c3aed",
        "on-secondary-fixed-variant": "#4f319c",
        "surface-container-lowest": "#100d16",
        "on-secondary": "#381385",
        "on-tertiary": "#4f2500",
        "on-secondary-container": "#bea8ff",
        "surface-variant": "#37333e",
        "on-primary-fixed": "#25005a",
        "on-primary-container": "#ede0ff",
        "on-primary-fixed-variant": "#5a00c6",
        "surface-tint": "#d2bbff",
        "on-tertiary-fixed": "#301400",
        "background": "#15121b",
        "surface-container-high": "#2c2833",
        "error-container": "#93000a",
        "inverse-on-surface": "#332f39",
        "tertiary-container": "#a15100",
        "secondary-fixed": "#e8ddff",
        "on-primary": "#3f008e",
        "surface-container": "#221e28",
        "secondary-container": "#4f319c",
        "tertiary-fixed": "#ffdcc6",
        "primary": "#d2bbff",
        "tertiary-fixed-dim": "#ffb784",
        "surface-bright": "#3c3742",
        "surface-container-low": "#1d1a24",
        "on-tertiary-fixed-variant": "#713700",
        "inverse-surface": "#e8dfee",
        "secondary-fixed-dim": "#cebdff",
        "on-surface-variant": "#ccc3d8",
        "inverse-primary": "#732ee4",
        "tertiary": "#ffb784",
        "on-error": "#690005",
        "primary-fixed-dim": "#d2bbff",
        "outline-variant": "#4a4455",
        "surface-container-highest": "#37333e",
        "primary-fixed": "#eaddff",
        "outline": "#958da1",
        "error": "#ffb4ab",
        "on-error-container": "#ffdad6",
        "surface-dim": "#15121b",
        "secondary": "#cebdff",
        "on-surface": "#e8dfee",
        "on-secondary-fixed": "#21005e",
        "on-tertiary-container": "#ffe0cd",
        "on-background": "#e8dfee"
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "container-padding-desktop": "40px",
        "unit": "8px",
        "gutter": "16px",
        "section-gap": "48px",
        "container-padding-mobile": "20px"
      },
      fontFamily: {
        "headline-md": ["var(--font-manrope)", "sans-serif"],
        "label-sm": ["var(--font-geist)", "sans-serif"],
        "body-md": ["var(--font-manrope)", "sans-serif"],
        "headline-lg-mobile": ["var(--font-manrope)", "sans-serif"],
        "body-lg": ["var(--font-manrope)", "sans-serif"],
        "display-lg": ["var(--font-manrope)", "sans-serif"],
        "data-lg": ["var(--font-geist)", "sans-serif"],
        "headline-lg": ["var(--font-manrope)", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "data-lg": ["20px", { lineHeight: "24px", letterSpacing: "0.02em", fontWeight: "500" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }]
      }
    },
  },
  plugins: [],
};
export default config;
