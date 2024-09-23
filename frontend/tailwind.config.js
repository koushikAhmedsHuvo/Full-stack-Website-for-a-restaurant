/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        '100px': '100px',
      },

      colors: {
        'primary-color': '#f01543',
        'secondary-color': '#fe724c',
        'heading-color': '#000929',
        'color-grey': '#f5f5f7',
        'shades-purple-red-92': '#fccbd5',
        'shades-purple-94': '#e8e6f9',
        'shades-purple-96': '#f0effb',
        'shades-purple-98': '#f7f7fd',
        'shades-purple-90': '#d8d6f5',
        'grey-scale-50': '#f9fafb',
        'grey-scale-100': '#f4f4f6',
        'grey-scale-200': '#e5e6eb',
        'grey-scale-300': '#e5e6eb',
        'grey-scale-400': '#9ea3ae',
        'grey-scale-500': '#6c727f',
        'grey-scale-600': '#4d5461',
        'grey-scale-700': '#394150',
        'grey-scale-800': '#212936',
        'grey-scale-900': '#0b0a0f',
        'third-color': '#122833',
        'light-black-color': '#0d1634',
        'dark-black': '#000929',
        'light-white': '#fbfbfb',
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite', // Adjust the duration (5s) as needed
      },
    },
  },
  plugins: [],
};
