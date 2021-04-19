import type { BuildOptions } from 'esbuild';

import esbuildPlugins from './esbuild-plugins';

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
  },
  bundle: true,
  minify: false,
  target: 'es2019',
  logLevel: 'info',
  plugins: esbuildPlugins,
});

export default baseESBuildConfig;