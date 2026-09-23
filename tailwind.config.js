/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,md,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Sofia Sans"', "system-ui", "sans-serif"],
        display: ['"Sofia Sans Condensed"', '"Sofia Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#3FB449",
          dark: "#2E8F37",
          deeper: "#121516",
          soft: "#E8F7EB",
          mist: "#F3F8F4",
        },
        ink: {
          DEFAULT: "#121516",
          muted: "#5a6360",
          faint: "#8a9290",
        },
      },
      maxWidth: {
        site: "80rem",
      },
      boxShadow: {
        card: "0 3px 15px rgba(36, 51, 43, 0.06)",
        lift: "0 18px 42px rgba(36, 51, 43, 0.12)",
      },
    },
  },
  plugins: [],
};
