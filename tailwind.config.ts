import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0A0E14",
          sidebar: "#0A0E14",
          surface: "#161B22",
          elevated: "#1E2430",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          hover: "rgba(255, 255, 255, 0.10)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#8B95A5",
          muted: "#5A6472",
        },
        accent: {
          primary: "#7C3AED",
          "primary-muted": "rgba(124, 58, 237, 0.12)",
        },
        status: {
          success: "#10B981",
          info: "#22D3EE",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 6px 16px rgba(0, 0, 0, 0.5)",
      },
      borderRadius: {
        card: "14px",
        btn: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
