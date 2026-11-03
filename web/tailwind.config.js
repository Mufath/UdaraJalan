/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sys: {
          bg: '#F2F2F7',
          card: '#FFFFFF',
          blue: '#007AFF',
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
          purple: '#AF52DE',
          gray: '#8E8E93',
          gray2: '#AEAEB2',
          gray3: '#C7C7CC',
          gray4: '#D1D1D6',
          gray5: '#E5E5EA',
          gray6: '#F2F2F7',
          label: '#000000',
          secondary: '#3C3C43',
          tertiary: '#3C3C434D',
          hairline: 'rgba(60, 60, 67, 0.12)',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        brand: [
          '"Plus Jakarta Sans"',
          'sans-serif'
        ]
      },
      borderRadius: {
        'squircle-sm': '10px',
        'squircle': '14px',
        'squircle-lg': '18px',
        'squircle-xl': '24px',
      },
      boxShadow: {
        'native-card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.025)',
        'native-sheet': '0 -4px 20px rgba(0,0,0,0.08)',
        'native-float': '0 8px 24px rgba(0,0,0,0.09)'
      }
    },
  },
  plugins: [],
}
