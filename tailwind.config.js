/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#18FF19',
        dark: '#000000',
        surface: '#0A0A0A',
        border: 'rgba(255, 255, 255, 0.08)',
        muted: '#666666',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        gothic: ['"central-gothic"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
