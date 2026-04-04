/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#22262B',
        parchment: '#F4F1EA',
        brass: '#AE8A37',
        olive: '#5B6241',
        ash: '#D8D3C8',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        halo: 'radial-gradient(circle at 20% 20%, rgba(174,138,55,0.22), transparent 40%), radial-gradient(circle at 80% 10%, rgba(91,98,65,0.18), transparent 35%)',
      },
      boxShadow: {
        soft: '0 18px 45px -20px rgba(34, 38, 43, 0.45)',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        reveal: 'reveal 600ms ease forwards',
      },
    },
  },
  plugins: [],
}
