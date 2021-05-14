import compileMarkdownToReact from './mdx';

it('compileMarkdownToReact without truncate works', async (done) => {
  expect(await compileMarkdownToReact('# h1\n<!--truncate-->\n## h2', false))
    .toBe(`import React from 'react';
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
    {
      /*truncate*/
    }
    <h2 {...{
      "id": "h2"
    }}>{\`h2\`}</h2>
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;
MDXContent.truncated = false;
MDXContent.toc = {
  "label": "h1",
  "children": [
    {
      "label": "h2",
      "children": []
    }
  ]
};`);
  done();
});

it('compileMarkdownToReact with truncate works', async (done) => {
  expect(await compileMarkdownToReact('# h1\n<!--truncate-->\n## h2', true))
    .toBe(`import React from 'react';
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

    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;
MDXContent.truncated = true;
MDXContent.toc = {
  "label": "h1",
  "children": [
    {
      "label": "h2",
      "children": []
    }
  ]
};`);
  done();
});
