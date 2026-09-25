/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#7C3AED",
          600: "#6D28D9",
          700: "#5B21B6",
          900: "#3B0F80"
        },
        secondary: {
          DEFAULT: "#A855F7"
        },
        surface: {
          DEFAULT: "#F8FAFC",
          dark: "#0B0B14"
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#15151F"
        },
        ink: {
          DEFAULT: "#111827",
          dark: "#F1F1F6"
        },
        border: {
          DEFAULT: "#E5E7EB",
          dark: "#26263A"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl2: "16px"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17, 24, 39, 0.04), 0 8px 24px -8px rgba(17, 24, 39, 0.08)",
        glass: "0 8px 32px rgba(124, 58, 237, 0.12)",
        glow: "0 0 0 4px rgba(124, 58, 237, 0.12)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
        "brand-mesh":
          "radial-gradient(circle at 20% 20%, rgba(124,58,237,0.55) 0%, transparent 45%), radial-gradient(circle at 80% 30%, rgba(168,85,247,0.5) 0%, transparent 45%), radial-gradient(circle at 50% 80%, rgba(124,58,237,0.4) 0%, transparent 50%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(20px, -30px) scale(1.05)" }
        },
        floatSlow: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-25px, 25px) scale(1.08)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 }
        }
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        floatSlow: "floatSlow 12s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
