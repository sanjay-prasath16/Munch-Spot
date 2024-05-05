/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#F7F7F7', // for all text
        customBlue: '#000932', // for dark blue
        customBorderPurple: '#DDCEEA', // for social media icon border and whole border
        customInputBorderPurple: '#9C8AAE', // for input box
        customIconColor: '#9C8AAE' // for input box icon and label
      },
      spacing: {
        Eighteen: '70px',
        icon: '18px'
      },
      fontSize: {
        label: '15px'
      },
      inset: {
        customWidth: '75px'
      },
      width: {
        customButtonWidth: '310px',
      },
      height: {
        customSignupHeight: '550px'
      }
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      customsm: { min: '0px', max: '640px'},
      xl: '1280px',
      customrange: { min: '0px', max: '667px' }
    }
  },
  plugins: [],
}