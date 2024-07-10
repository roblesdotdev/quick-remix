import { type Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'hsl(var(--canvas))',
        fg: {
          DEFAULT: 'hsl(var(--fg-default))',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
