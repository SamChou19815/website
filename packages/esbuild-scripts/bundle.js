// @ts-check

const { build } = require("esbuild");

build({
  entryPoints: ["api.ts"],
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  platform: "node",
  target: "es2019",
  format: "cjs",
  outfile: "api.js",
  sourcemap: false,
  external: ["esbuild", "postcss", "tailwindcss"],
})
  .catch(() => process.exit(1))
  .then(({ warnings }) => warnings.forEach((warning) => console.error(`[!] ${warning.text}`)));
