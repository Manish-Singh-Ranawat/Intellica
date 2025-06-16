/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#217bfe",
        purple: "#140e2d",
        gray: " #2c2937",
      },
      keyframes: {
        rotateOrbital: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(60deg)" },
        },
        botImage: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "100%": { transform: "rotate(-5deg) scale(1.1)" },
        },
        slideBg: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        rotateOrbital: "rotateOrbital 100s linear infinite",
        botImage: "botImage 3s ease-in-out infinite alternate",
        slideBg: "slideBg 8s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
