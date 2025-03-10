/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        info: '#76809B',
      },
    },
  },
  plugins: [
    // Solve the bug where the style of el-button is overwritten by the style of tailwind.css
    function ({ addBase }) {
      addBase({
        '.el-button': {
          'background-color': 'var(--el-button-bg-color,val(--el-color-white))',
        },
      })
    },
  ],
  // // tree shaking
  // purge: [
  //   './src/**/*.html',
  //   './src/**/*.vue',
  //   './src/**/*.jsx',
  //   './src/**/*.tsx'
  // ]
}
