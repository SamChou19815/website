const API = 'https://ten.developersam.com/';

const setupPlugin = () => ({
  name: 'docusaurus-ten-plugin',
  configureWebpack() {
    return {
      devServer: {
        publicPath: '/',
        proxy: [
          {
            path: '/api/**',
            target: API,
            changeOrigin: true,
            onProxyReq: (proxyReq) => {
              if (proxyReq.getHeader('origin')) {
                proxyReq.setHeader('origin', API);
              }
            },
          },
        ],
      },
    };
  },
  getClientModules() {
    return [require.resolve('infima/dist/css/default/default.css')];
  },
});

module.exports = setupPlugin;
