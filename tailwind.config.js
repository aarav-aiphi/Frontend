/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // Just-In-Time compiler for faster builds and smaller bundle sizes
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#002147', 
        primaryBlue2:'#4285F4',
        textblue:'#000080',
        bgblue:'#000080',
        actblue:'#1E90FF',
        primaryBlue3: 'rgb(73 125 168)',
        
        buttonbg: 'rgb(66 87 117)',
        dashside: 'rgb(37 58 85 / 70%)',
           'dark-blue': '#0A2540',
           primary: '#4A90E2',
           accent: '#FF5722',
        // Add more custom colors here if needed
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      zIndex: {
        '-10': '-10', // Support for negative z-index
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // Base table styles
            table: {
              width: '100%',
              marginBottom: '1rem',
              borderCollapse: 'collapse',
              border: `1px solid ${theme('colors.gray.300', '#D1D5DB')}`,
            },
            th: {
              backgroundColor: theme('colors.primaryBlue2', '#497DA8'),
              color: theme('colors.white', '#FFFFFF'),
              padding: '0.5rem',
              border: `1px solid ${theme('colors.gray.300', '#D1D5DB')}`,
              textAlign: 'left',
              verticalAlign: 'middle',
            },
            td: {
              padding: '0.5rem',
              border: `1px solid ${theme('colors.gray.300', '#D1D5DB')}`,
              verticalAlign: 'top',
            },
            tr: {
              '&:nth-child(even)': {
                backgroundColor: theme('colors.gray.100', '#F3F4F6'),
              },
            },
            // Responsive tables
            '@screen sm': {
              table: {
                display: 'block',
                overflowX: 'auto',
              },
            },
            // Optional: Styling for blockquotes, code blocks, etc.
            blockquote: {
              borderLeftColor: theme('colors.primaryBlue'),
              color: theme('colors.gray.700'),
            },
            code: {
              backgroundColor: theme('colors.gray.200'),
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
        // Optional: Dark mode or other variants
        // dark: {
        //   css: {
        //     // Dark mode table styles
        //   },
        // },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // ... other plugins
  ],
};
