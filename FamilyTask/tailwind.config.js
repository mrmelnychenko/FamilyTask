/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                nunito: ['Nunito-Regular'],
                'nunito-bold': ['Nunito-Bold'],
                'nunito-extra': ['Nunito-ExtraBold'],
            },
            colors: {
                black: '#000000',
                primary: '#A855F7',
                'primary-dark': '#7C3AED',
                'primary-light': '#EDE9FE',

                success: '#22C55E',
                'success-bg': '#F0FDF4',

                warning: '#F97316',
                'warning-bg': '#FFF7ED',

                danger: '#EF4444',
                'danger-bg': '#FEF2F2',

                pink: '#EC4899',
                gold: '#F59E0B',
                'gold-bg': '#FFFBEB',

                streak: '#F97316',
                'streak-bg': '#FFF7ED',

                background: '#F9FAFB',
                card: '#FFFFFF',
                border: '#E5E7EB',

                text: '#111827',
                muted: '#6B7280',
                light: '#9CA3AF',
            },
            fontSize: {
                h1: ['24px'],
                h2: ['18px'],
                body: ['14px'],
                label: ['11px'],
                points: ['12px'],
            },
        },
    },
    plugins: [],
}