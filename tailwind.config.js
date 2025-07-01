module.exports = {
    theme: {
      extend: {
        keyframes: {
          'bounce-slow': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-24px)' },
          },
        },
        animation: {
          'bounce-slow': 'bounce-slow 4s ease-in-out infinite',
          'spin-slow': 'spin 12s linear infinite',
        },
      },
    },
  };