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
        ],
        mono: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'sans-serif'
        ]
      },
      fontSize: {
        'large-title': ['34px', { lineHeight: '41px', letterSpacing: '0.37px', fontWeight: '700' }],
        'title-1': ['28px', { lineHeight: '34px', letterSpacing: '0.36px', fontWeight: '700' }],
        'title-2': ['22px', { lineHeight: '28px', letterSpacing: '0.35px', fontWeight: '700' }],
        'title-3': ['20px', { lineHeight: '25px', letterSpacing: '0.38px', fontWeight: '600' }],
        'headline': ['17px', { lineHeight: '22px', letterSpacing: '-0.41px', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '22px', letterSpacing: '-0.41px', fontWeight: '400' }],
        'callout': ['16px', { lineHeight: '21px', letterSpacing: '-0.32px', fontWeight: '400' }],
        'subheadline': ['15px', { lineHeight: '20px', letterSpacing: '-0.24px', fontWeight: '400' }],
        'footnote': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px', fontWeight: '400' }],
        'caption-1': ['12px', { lineHeight: '16px', letterSpacing: '0.0px', fontWeight: '400' }],
        'caption-2': ['11px', { lineHeight: '13px', letterSpacing: '0.06px', fontWeight: '400' }],
        'metric': ['34px', { lineHeight: '41px', letterSpacing: '-0.5px', fontWeight: '700' }],
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
