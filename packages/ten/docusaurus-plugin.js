const API = 'https://ten.developersam.com/api/respond';

const setupPlugin = () => ({
  name: 'docusaurus-ten-plugin',
  configureWebpack() {
    return {
      devServer: {
        proxy: {
          '/api': {
            target: API,
            secure: false,
            changeOrigin: true,
          },
        },
      },
    };
  },
  getClientModules() {
    return [require.resolve('infima/dist/css/default/default.css')];
  },
});

module.exports = setupPlugin;
