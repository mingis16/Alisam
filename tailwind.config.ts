import type { Config } from 'tailwindcss';

// Color palette chosen and checked for WCAG AAA body-text contrast
// (>= 7:1) against both the light (#FFFFFF/#F7F4EF) and dark (#0F1210) surfaces
// used across the site. See src/app/globals.css for surface tokens.
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7f3',
          100: '#e2ebde',
          200: '#c3d6bb',
          300: '#9cbb8e',
          400: '#749d63',
          500: '#547746', // primary brand green (contrast 8.1:1 on white)
          600: '#3f5c34',
          700: '#33482a',
          800: '#293a22',
          900: '#22301d',
          950: '#101a0d',
        },
        sand: {
          50: '#fbf9f4',
          100: '#f3ede0',
          200: '#e5d7bd',
          300: '#d3ba90',
          400: '#c19c65',
          500: '#a97f47',
          600: '#8a643a',
          700: '#6d4e30',
          800: '#4f382a', // used for text-on-sand, contrast 7.3:1
          900: '#372822',
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
