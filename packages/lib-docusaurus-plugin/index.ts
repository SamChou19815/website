import { Plugin } from '@docusaurus/types';
import PnpWebpackPlugin from 'pnp-webpack-plugin';

const setupPlugin = (): Plugin<void> => ({
  name: 'lib-docusaurus-plugin',
  getClientModules() {
    return [require.resolve('./prism-include-languages')];
  },
  configureWebpack() {
    return {
      resolve: {
        plugins: [PnpWebpackPlugin],
      },
      resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)],
      },
    };
  },
});

export default setupPlugin;
