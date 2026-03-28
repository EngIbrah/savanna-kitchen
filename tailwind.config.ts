import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C8793A",
          dark: "#A85E25",
          light: "#E09060",
        },
        secondary: {
          DEFAULT: "#2C4A3E",
          light: "#3D6B5C",
        },
        accent: "#E8B84B",
        savanna: {
          bg: "#FAF7F2",
          surface: "#FFFFFF",
          text: "#1A1A1A",
          muted: "#6B5B4E",
          light: "#F5F0E8",
          border: "#E8DDD4",
        },
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
        accent: ["Cormorant Garamond", "serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        warm: "0 4px 24px rgba(200, 121, 58, 0.12)",
        "warm-lg": "0 8px 40px rgba(200, 121, 58, 0.18)",
        "warm-xl": "0 16px 60px rgba(200, 121, 58, 0.22)",
      },
      animation: {
        "fade-up": "fade-up 0.7s ease forwards",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
