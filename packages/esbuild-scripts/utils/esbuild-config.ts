import type { BuildOptions, Plugin } from 'esbuild';
import type { Processor as PostCSSProcessor } from 'postcss';
import * as fs from 'fs/promises';
import * as path from 'path';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import getTailwindBaseConfig from './tailwind-config';

const mdxPromise = import('@mdx-js/mdx');

const webAppResolvePlugin: Plugin = {
  name: 'WebAppResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /^data:/ }, () => ({ external: true }));
  },
};

/** A mapping from a virtual path to its content. */
export type VirtualPathMappings = { readonly [virtualPath: string]: string };

const VIRTURL_PATH_FILTER = /^esbuild-scripts-internal\/virtual\//;
const currentProjectDirectory = path.resolve('.');
const virtualPathResolvePlugin = (virtualPathMappings: VirtualPathMappings): Plugin => ({
  name: 'VirtualPathResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: VIRTURL_PATH_FILTER }, (args) => ({
      path: args.path,
      namespace: 'virtual-path',
    }));

    buildConfig.onLoad({ filter: VIRTURL_PATH_FILTER, namespace: 'virtual-path' }, (args) => ({
      contents: virtualPathMappings[args.path],
      resolveDir: currentProjectDirectory,
      loader: 'jsx',
    }));
  },
});

async function compileMarkdownToReact(text: string): Promise<string> {
  const mainComponentCode = await (
    await mdxPromise
  ).compile(text.trim().split('\n').slice(1).join('\n').trim(), {
    providerImportSource: 'esbuild-scripts/__internal-components__/mdx',
    jsxRuntime: 'classic',
  });
  return `// @${'generated'}
${mainComponentCode.value}
MDXContent.additionalProperties = typeof additionalProperties === 'undefined' ? undefined : additionalProperties;
`;
}

const mdxPlugin: Plugin = {
  name: 'mdx',
  setup(buildConfig) {
    buildConfig.onLoad({ filter: /\.md$/ }, async (args) => {
      return {
        contents: await compileMarkdownToReact((await fs.readFile(args.path)).toString()),
        loader: 'jsx',
      };
    });
  },
};

function postcssPlugin(): Plugin {
  const processor = postcss([tailwind(getTailwindBaseConfig()) as PostCSSProcessor]);
  return {
    name: 'postcss',
    setup(buildConfig) {
      buildConfig.onLoad({ filter: /\.css$/ }, async (args) => {
        const css = await fs.readFile(args.path, 'utf8');
        const result = await processor.process(css, { from: args.path });
        return { contents: result.css, loader: 'css', watchDirs: [path.resolve('src')] };
      });
    },
  };
}

export default function baseESBuildConfig({
  virtualPathMappings,
  isServer = false,
  isProd = false,
}: {
  readonly virtualPathMappings: VirtualPathMappings;
  readonly isServer?: boolean;
  readonly isProd?: boolean;
  readonly noThemeSwitch?: boolean;
}): BuildOptions {
  return {
    define: {
      __dirname: '""',
      __SERVER__: String(isServer),
      'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
    },
    bundle: true,
    minify: false,
    legalComments: 'linked',
    platform: 'browser',
    target: 'es2019',
    logLevel: 'error',
    external: ['path', 'fs'],
    plugins: [
      webAppResolvePlugin,
      virtualPathResolvePlugin(virtualPathMappings),
      mdxPlugin,
      postcssPlugin(),
    ],
  };
}
