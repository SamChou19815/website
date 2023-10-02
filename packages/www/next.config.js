// @ts-check

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { mdxRs: true },
  output: "export",
  typescript: { ignoreBuildErrors: true },
};

module.exports = withMDX(nextConfig);
