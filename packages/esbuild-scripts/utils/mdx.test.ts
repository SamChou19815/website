import compileMarkdownToReact from './mdx';

it('compileMarkdownToReact works', async (done) => {
  expect(await compileMarkdownToReact('# h1\n## h2')).toBe(`import React from 'react';
import mdx from 'esbuild-scripts/__internal-components__/mdx';
/* @jsxRuntime classic */
/* @jsx mdx */



const layoutProps = {
${'  '}
};
const MDXLayout = "wrapper"
export default function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">
    <h1 {...{
      "id": "h1"
    }}>{\`h1\`}</h1>
    <h2 {...{
      "id": "h2"
    }}>{\`h2\`}</h2>
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;`);
  done();
});
