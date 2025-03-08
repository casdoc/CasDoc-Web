import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */

export default {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/extensions/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: ["ProseMirror"], //ensure that the ProseMirror class is not purged
    plugins: [typography],
} satisfies Config;
