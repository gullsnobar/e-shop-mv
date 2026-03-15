module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"],
      },
      screens: {
        sm: "640px",   // small devices
        md: "768px",   // tablets
        lg: "1024px",  // laptops
        xl: "1280px",  // desktops
        "2xl": "1536px" // large screens
      }
    },
  },
  plugins: [],
};