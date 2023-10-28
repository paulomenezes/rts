/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './*.html'],
  darkMode: 'media',
  theme: {
    extend: {
      keyframes: {
        play: {
          '100%': {
            'background-position': 'var(--pos-x) var(--pos-y)',
          },
        },
        'tl-bounce': {
          '0%, 100%': {
            transform: 'translateX(-2px) translateY(-2px)',
          },
          '50%': {
            transform: 'translateX(0) translateY(0)',
          },
        },
        'tr-bounce': {
          '0%, 100%': {
            transform: 'translateX(2px) translateY(-2px)',
          },
          '50%': {
            transform: 'translateX(0) translateY(0)',
          },
        },
        'bl-bounce': {
          '0%, 100%': {
            transform: 'translateX(-2px) translateY(2px)',
          },
          '50%': {
            transform: 'translateX(0) translateY(0)',
          },
        },
        'br-bounce': {
          '0%, 100%': {
            transform: 'translateX(2px) translateY(2px)',
          },
          '50%': {
            transform: 'translateX(0) translateY(0)',
          },
        },
      },
      animation: {
        play: 'play 1s steps(10) infinite',
        'tl-bounce': 'tl-bounce 1s ease-in-out infinite',
        'tr-bounce': 'tr-bounce 1s ease-in-out infinite',
        'bl-bounce': 'bl-bounce 1s ease-in-out infinite',
        'br-bounce': 'br-bounce 1s ease-in-out infinite',
      },
    },
  },
};
