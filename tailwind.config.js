/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oyster-medium-blue': '#161B23',
        'oyster-light-blue': '#1E293B',
        'oyster-dark-blue': '#0D1016',
        'oyster-medium-gray': '#75777A',
        'oyster-dark-gray': '#20262D',
        'oyster-light-gray': 'rgba(154, 154, 154, 0.22)',
        'oyster-purple-transparent': 'rgba(105, 90, 205, 0.65)',
        'oyster-purple-light': '#B0A4FF',
      },
      boxShadow: {
        'oyster-shadow-1': 'rgba(0, 0, 0, 0.5) 1.95px 1.95px 2.6px',
        'oyster-shadow-2': 'rgba(0, 0, 0, 0.5) 3.9px 3.9px 5.2px',
        'oyster-shadow-3': 'rgba(0, 0, 0, 0.5) 7.8px 7.8px 10.4px',
      },
    },
  },
  purge: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  plugins: [
    require('tailwind-scrollbar') ({ nocompatible: true }),
  ],
}

