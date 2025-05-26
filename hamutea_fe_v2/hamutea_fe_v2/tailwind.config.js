/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "galega": ['AGalega', 'sans-serif'],
        "sf-pro-rounded": ['SF Pro Rounded', 'sans-serif'],
      },
      colors: {
        "hamutea-black": "#3d3d3d",
        "hamutea-indigo": "#6a42e3",
        "hamutea-teal": "#16b5d9",
        "hamutea-brown": "#4D3434",
        "hamutea-gray": "#8F8888",
        "hamutea-border": "#dbdbdb",
        "hamutea-red": "#d91619",
        "hamutea-blue": "#4e84f2",
        "hamutea-yellow": "#fabc02",
        "hamutea-green": "#11bd8c",
      }
    },
  },
  plugins: [],
}