/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        henry: {
          sky: '#74AED4',
          ocean: '#2680BE',
          primary: '#00558E',
          navy: '#002248',
        }
      }
    },
  },
  plugins: [],
};
