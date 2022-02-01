// @ts-check

/**
 * @returns {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = function getTailwindBaseConfig() {
  return {
    theme: {},
    content: ['./src/**/*.html', './src/**/*.css', './src/**/*.tsx', './src/**/*.ts'],
    darkMode: 'media',
  };
};
