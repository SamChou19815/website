import { Plugin } from '@docusaurus/types';

const setupPlugin = (): Plugin<void> => ({
  name: 'lib-docusaurus-plugin',
  getClientModules() {
    return [require.resolve('./prism-include-languages')];
  },
});

export default setupPlugin;
