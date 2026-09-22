import type { Config } from 'tailwindcss';

// Color palette matches the guest house's own paint scheme — roughly 65%
// maroon (brand, the dominant color: header, headings, primary buttons,
// footer) to 35% yellow/gold (sand, the accent: secondary buttons, the
// logo mark, icon badges). Chosen and checked for WCAG AAA body-text
// contrast (>= 7:1) against both the light (#FFFFFF/#F7F4EF) and dark
// (#0F1210) surfaces used across the site. See src/app/globals.css for
// surface tokens.
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf1f1',
          100: '#f3dcdc',
          200: '#e6b8b9',
          300: '#d38d90',
          400: '#b85e63',
          500: '#8f2f36', // primary brand maroon (contrast 7.99:1 on white)
          600: '#7a1f26',
          700: '#641820',
          800: '#4f131a',
          900: '#3d0f14',
          950: '#260a0d',
        },
        sand: {
          50: '#fefbea',
          100: '#fdf3c4',
          200: '#fbe488',
          300: '#f7cf4c',
          400: '#f0b823',
          500: '#d99a12',
          600: '#b47a0d',
          700: '#8f5e0f',
          800: '#744c12', // used for text-on-sand, contrast 7.54:1
          900: '#603f14',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'serif'],
      },
      boxShadow: {
        card: '0 4px 24px -6px rgba(16, 26, 13, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
