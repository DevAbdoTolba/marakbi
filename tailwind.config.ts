// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          dark: '#0d2440',
          medium: '#0f3b7f',
          light: '#3b5998',
        },
        'brand-gold': {
          DEFAULT: '#c9a96e',
          light: '#e0c99f',
        },
        'brand-gray': {
          DEFAULT: '#f8f9fa',
          text: '#5f5f5f',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'], // Primary font
        serif: ['"Playfair Display"', 'serif'], // Example serif
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.png')",
        'why-us-pattern': "url('/images/why-us-yacht.jpg')",
        'cta-pattern': "url('/images/cta-yacht.jpg')",
      },
    },
  },
  plugins: [],
}
export default config