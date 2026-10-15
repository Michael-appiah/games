/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sporty: {
          red: '#E51B24',
          'red-dark': '#CC121B',
          green: '#00A826',
          'green-bright': '#00C853',
          'green-light': '#00E676',
          'green-odd': '#00E676',
          'bg-dark': '#131920',
          'bg-main': '#181E26',
          'bg-card': '#212833',
          'bg-card-hover': '#2A3340',
          'bg-sub': '#28313E',
          'border-dark': '#2B3542',
          'text-dim': '#7C8899',
          'text-sub': '#9BA6B5',
          'text-white': '#FFFFFF',
          'gold-star': '#FFB800'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
