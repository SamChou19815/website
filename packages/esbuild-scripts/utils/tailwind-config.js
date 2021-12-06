// @ts-check

/**
 * @param {boolean} purge
 * @returns {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = function getTailwindBaseConfig(purge = false) {
  return {
    theme: {},
    purge: {
      enabled: purge,
      content: ['./src/**/*.html', './src/**/*.css', './src/**/*.tsx', './src/**/*.ts'],
    },
    darkMode: 'media',
  };
};
