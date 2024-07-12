import { type Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-family)',
      },
      colors: {
        canvas: 'hsl(var(--canvas))',
        fg: {
          DEFAULT: 'hsl(var(--fg-default))',
          muted: 'hsl(var(--fg-muted))',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
