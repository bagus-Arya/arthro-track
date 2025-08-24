/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        mulish_black: ["Mulish-Black", "sans-serif"],
        mulish_black_italic: ["Mulish-BlackItalic", "sans-serif"],
        mulish_bold: ["Mulish-Bold", "sans-serif"],
        mulish_bold_italic: ["Mulish-BoldItalic", "sans-serif"],
        mulish_extra_bold: ["Mulish-ExtraBold", "sans-serif"],
        mulish_extra_bold_italic: ["Mulish-ExtraBoldItalic", "sans-serif"],
        mulish_extra_light: ["Mulish-ExtraLight", "sans-serif"],
        mulish_extra_light_italic: ["Mulish-ExtraLightItalic", "sans-serif"],
        mulish_italic: ["Mulish-Italic", "sans-serif"],
        mulish_light: ["Mulish-Light", "sans-serif"],
        mulish_light_italic: ["Mulish-LightItalic", "sans-serif"],
        mulish_medium: ["Mulish-Medium", "sans-serif"],
        mulish_medium_italic: ["Mulish-MediumItalic", "sans-serif"],
        mulish_regular: ["Mulish-Regular", "sans-serif"],
        mulish_semibold: ["Mulish-SemiBold", "sans-serif"],
        mulish_semibold_italic: ["Mulish-SemiBoldItalic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
