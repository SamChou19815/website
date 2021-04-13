import { join, resolve } from 'path';

import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp';
import type { BuildOptions } from 'esbuild';

const baseESBuildConfig = ({
  isServer = false,
  isProd = false,
}: {
  readonly isServer?: boolean;
  readonly isProd?: boolean;
  readonly noThemeSwitch?: boolean;
}): BuildOptions => ({
  define: {
    __SERVER__: String(isServer),
    'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
    __THEME_SWITCH__: String(!process.env.NO_THEME_SWITCH),
  },
  bundle: true,
  minify: false,
  target: 'es2017',
  logLevel: 'error',
  plugins: [
    {
      name: 'WebAppResolvePlugin',
      setup(buildConfig) {
        buildConfig.onResolve({ filter: /data:/ }, () => ({ external: true }));
        buildConfig.onResolve({ filter: /USER_DEFINED_APP_ENTRY_POINT/ }, () => ({
          path: resolve(join('src', 'App.tsx')),
        }));
      },
    },
    pnpPlugin(),
  ],
});

export default baseESBuildConfig;
