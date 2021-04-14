import { join, resolve } from 'path';

import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp';
import type { Plugin } from 'esbuild';
import sassPlugin from 'esbuild-plugin-sass';

const webAppResolvePlugin: Plugin = {
  name: 'WebAppResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /data:/ }, () => ({ external: true }));
    buildConfig.onResolve({ filter: /USER_DEFINED_APP_ENTRY_POINT/ }, () => ({
      path: resolve(join('src', 'App.tsx')),
    }));
  },
};

const esbuildPlugins: Plugin[] = [webAppResolvePlugin, sassPlugin(), pnpPlugin()];

export default esbuildPlugins;
