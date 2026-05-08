const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
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
        // ============================================
        // NORDIC INDUSTRIAL-MODERN COLOR PALETTE
        // ============================================
        
        // Deep Forest Tones (Primary)
        forest: {
          900: "rgb(var(--forest-900))",
          800: "rgb(var(--forest-800))",
          700: "rgb(var(--forest-700))",
          600: "rgb(var(--forest-600))",
          500: "rgb(var(--forest-500))",
          400: "rgb(var(--forest-400))",
        },
        // Slate Tones (Secondary)
        slate: {
          900: "rgb(var(--slate-900))",
          800: "rgb(var(--slate-800))",
          700: "rgb(var(--slate-700))",
          600: "rgb(var(--slate-600))",
          500: "rgb(var(--slate-500))",
          400: "rgb(var(--slate-400))",
        },
        // Warm Amber (Accent)
        amber: {
          700: "rgb(var(--amber-700))",
          600: "rgb(var(--amber-600))",
          500: "rgb(var(--amber-500))",
          400: "rgb(var(--amber-400))",
          300: "rgb(var(--amber-300))",
        },
        // Copper Metallic Highlights
        copper: {
          700: "rgb(var(--copper-700))",
          600: "rgb(var(--copper-600))",
          500: "rgb(var(--copper-500))",
          400: "rgb(var(--copper-400))",
          300: "rgb(var(--copper-300))",
        },
        // Steel Blues (for gradients)
        steel: {
          700: "rgb(var(--steel-700))",
          600: "rgb(var(--steel-600))",
          500: "rgb(var(--steel-500))",
          400: "rgb(var(--steel-400))",
        },
        // Warm Workshop Oranges (for gradients)
        workshop: {
          700: "rgb(var(--workshop-700))",
          600: "rgb(var(--workshop-600))",
          500: "rgb(var(--workshop-500))",
          400: "rgb(var(--workshop-400))",
        },
        // Creamy Off-Whites
        cream: {
          100: "rgb(var(--cream-100))",
          200: "rgb(var(--cream-200))",
          300: "rgb(var(--cream-300))",
        },
        
        // Semantic theme colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // Nordic gradient utilities
      backgroundImage: {
        'gradient-nordic': 'linear-gradient(135deg, rgb(var(--steel-500)), rgb(var(--workshop-500)))',
        'gradient-steel-warm': 'linear-gradient(to right, rgb(var(--steel-600)), rgb(var(--workshop-600)))',
        'gradient-forest-amber': 'linear-gradient(to bottom right, rgb(var(--forest-700)), rgb(var(--amber-600)))',
        'gradient-slate-copper': 'linear-gradient(135deg, rgb(var(--slate-700)), rgb(var(--copper-500)))',
        'gradient-workshop-glow': 'radial-gradient(circle at center, rgb(var(--workshop-500)), rgb(var(--workshop-700)))',
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        headline: ["Manrope", "Inter", "system-ui", "sans-serif"],
        display: ["Bebas Neue", "Manrope", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
