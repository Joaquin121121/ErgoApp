// tailwind.config.js

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "white",
        secondary: "#E81D23",
        tertiary: "#333333",
        gray: "#d9d9d9",
        darkGray: "#9E9E9E",
        offWhite: "#F5F5F5",
        lightRed: "#FFC1C1",
        fire: "#FF9501",
        yellow: "#FFD700",
        green: "#00A859",
        blue: "#0989FF",
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
      fontSize: {
        streak: 48,
        h2: 28,
        h3: 24,
        16: 16,
        p: 14,
      },
    },
  },
  plugins: [],
};
