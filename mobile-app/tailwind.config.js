/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C9A84C", // muted luxury gold
          light: "#E2C878",
          dark: "#8B6914",
          muted: "#A68A3E",
        },
        background: {
          DEFAULT: "#0A0A0A", // near-black
          light: "#111111",
          lighter: "#1A1A1A",
          card: "#141414",
        },
        surface: {
          DEFAULT: "#1E1E1E",
          light: "#2A2A2A",
          border: "#333333",
        },
        text: {
          primary: "#F5F0E8", // warm white
          secondary: "#A89F91", // muted warm grey
          tertiary: "#5C564D",
          gold: "#C9A84C",
        },
        accent: {
          DEFAULT: "#C9A84C",
          red: "#C0392B",
          green: "#2E7D32",
          amber: "#D4A017",
        },
      },
    },
  },
  plugins: [],
};
