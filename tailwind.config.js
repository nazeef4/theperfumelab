/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FBF8F0",
          100: "#F6EEDB",
          200: "#EEDFB7",
          300: "#E3CC92",
          400: "#D6B56B",
          500: "#C9A24B",
          600: "#B48A38",
          700: "#93702A",
          800: "#6F5520",
          900: "#4E3B16",
        },
        ink: {
          DEFAULT: "#17130E",
          soft: "#3E362A",
          muted: "#8A7E69",
        },
        ivory: "#FAF6EF",
        sand: "#F2EBDD",
        line: "#E9E0CD",
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", '"Times New Roman"', "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        gold: "0 10px 40px -12px rgba(201, 162, 75, 0.45)",
        "gold-sm": "0 4px 18px -6px rgba(201, 162, 75, 0.5)",
        lux: "0 24px 60px -24px rgba(23, 19, 14, 0.28)",
      },
      letterSpacing: {
        luxe: "0.28em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fadeUp .8s cubic-bezier(.22,.68,.43,1) both",
        "fade-up-slow": "fadeUp 1.2s cubic-bezier(.22,.68,.43,1) both",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
