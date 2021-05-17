import type { Plugin } from 'esbuild';

const VIRTURL_PATH_FILTER = /^esbuild-scripts-internal\/virtual\//;

/** A mapping from a virtual path to its content. */
export type VirtualPathMappings = { readonly [virtualPath: string]: string };

const virtualPathResolvePlugin = (virtualPathMappings: VirtualPathMappings): Plugin => ({
  name: 'VirtualPathResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: VIRTURL_PATH_FILTER }, (args) => ({
      path: args.path,
      namespace: 'virtual-path',
    }));

    buildConfig.onLoad({ filter: VIRTURL_PATH_FILTER, namespace: 'virtual-path' }, (args) => ({
      contents: virtualPathMappings[args.path],
      loader: 'jsx',
    }));
  },
});

export default virtualPathResolvePlugin;
