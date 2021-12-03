// @ts-check

/**
 * @param {boolean} purge
 * @returns {Parameters<typeof import('tailwindcss')>[0]} */
module.exports = function getTailwindBaseConfig(purge = false) {
  return {
    theme: {},
    purge: {
      enabled: purge,
      content: ['./src/**/*.html', './src/**/*.css', './src/**/*.tsx', './src/**/*.ts'],
    },
    variants: {
      extend: {
        margin: ['last'],
        padding: ['last'],
      },
    },
    darkMode: 'media',
  };
};
