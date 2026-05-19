import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        campana: {
          azul: "#1e3070",
          "azul-med": "#2a4094",
          "azul-claro": "#3d5ab8",
          rojo: "#d42b2b",
          fondo: "#f4f6fb",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 8px 28px rgba(30, 48, 112, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
