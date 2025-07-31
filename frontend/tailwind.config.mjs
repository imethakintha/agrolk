// tailwind.config.mjs

import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ඔයාගෙ project එකේ file structure එකට අනුව මේ path එක වෙනස් වෙන්න පුළුවන්
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981', // මෙතන ඔයාගෙ custom color එක එකතු කරනවා
      },
    },
  },
  plugins: [
    typography, // මෙතන typography plugin එක එකතු කරනවා
    forms,      // මෙතන forms plugin එක එකතු කරනවා
  ],
}