import type { Config } from "tailwindcss"

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config

export default config