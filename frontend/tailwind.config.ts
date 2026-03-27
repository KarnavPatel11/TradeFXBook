import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--accent-blue)",
        background: {
          DEFAULT: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--accent-blue)",
          foreground: "var(--text-primary)",
          hover: "var(--accent-blue2)",
        },
        secondary: {
          DEFAULT: "var(--bg-secondary)",
          foreground: "var(--text-secondary)",
        },
        destructive: {
          DEFAULT: "var(--red)",
          foreground: "var(--text-primary)",
        },
        success: {
          DEFAULT: "var(--green)",
          foreground: "var(--text-primary)",
        },
        warning: {
          DEFAULT: "var(--gold)",
          foreground: "var(--bg-primary)",
        },
        muted: {
          DEFAULT: "var(--bg-secondary)",
          foreground: "var(--text-secondary)",
        },
        accent: {
          DEFAULT: "var(--accent-blue)",
          foreground: "var(--text-primary)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        sans: ["var(--font-sans)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        gradient: "gradient 8s ease infinite",
      },
      backgroundImage: {
        "dot-pattern": "radial-gradient(circle, var(--border) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-pattern": "24px 24px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
