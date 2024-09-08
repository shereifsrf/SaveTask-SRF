import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/icon/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: ({ theme }) => ({
        title: `2px 0px 0px 2px ${theme(
          "colors.secondary",
        )}, -10px 0px 1px 5px ${theme("colors.secondary")}`, // Shadows on the left and right
      }),
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        error: colors.red[500],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      xs: "375px",
      ...defaultTheme.screens,
    },
  },
  plugins: [
    // plugin(function ({
    //   addUtilities,
    //   theme,
    // }: {
    //   addUtilities: any;
    //   theme: any;
    // }) {
    //   addUtilities({
    //     ".text-error": {
    //       color: theme("colors.red.500"),
    //     },
    //   });
    // }),
  ],
};
export default config;
