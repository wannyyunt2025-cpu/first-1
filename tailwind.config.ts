import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "#0F172A", // 深蓝色背景 (Lofi Midnight)
          saliant: "#1E293B", // 稍浅的深蓝色，用于卡片
          elevated: "#334155", // 悬浮态
          overlay: "rgba(15, 23, 42, 0.8)", // 遮罩层
        },
        foreground: "#F8FAFC", // 浅灰白色文字
        primary: {
          DEFAULT: "#F59E0B", // 温暖的橙黄色 (窗户灯光)
          foreground: "#0F172A",
          hover: "#D97706",
        },
        secondary: {
          DEFAULT: "#334155", // 次级深蓝
          foreground: "#F1F5F9",
        },
        muted: {
          DEFAULT: "#1E293B",
          foreground: "#94A3B8", // 柔和的灰色文本
        },
        accent: {
          DEFAULT: "#F59E0B", // 强调色同主色
          foreground: "#0F172A",
        },
        card: {
          DEFAULT: "#1E293B",
          foreground: "#F8FAFC",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Merriweather", "serif"], // 艺术字体
      },
      fontSize: {
        "display-lg": ["88px", { lineHeight: "1.1", fontWeight: "700", fontFamily: "Cinzel Decorative, serif", letterSpacing: "-0.02em" }],
        "display-sm": ["56px", { lineHeight: "1.2", fontWeight: "700", fontFamily: "Cinzel Decorative, serif", letterSpacing: "-0.01em" }],
        "headline-lg": ["40px", { lineHeight: "1.3", fontWeight: "600", fontFamily: "Playfair Display, serif" }],
        "headline-sm": ["28px", { lineHeight: "1.4", fontWeight: "600", fontFamily: "Playfair Display, serif" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["15px", { lineHeight: "1.6", fontWeight: "400" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px hsla(243, 68%, 60%, 0.3)" },
          "50%": { boxShadow: "0 0 40px hsla(243, 68%, 60%, 0.5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", // 温暖的橙色渐变
        "gradient-accent": "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)", // 深蓝色辅助渐变
        "gradient-hero": "radial-gradient(circle at 50% 0%, #1E293B 0%, #0F172A 100%)", // 夜空背景
        "gradient-card-hover": "linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0) 100%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        glow: "0 0 20px rgba(245, 158, 11, 0.3)", // 暖光晕
        "card-hover": "0 10px 30px -10px rgba(0, 0, 0, 0.5)", // 深邃的阴影
        "glow-sm": "0 0 10px rgba(245, 158, 11, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
