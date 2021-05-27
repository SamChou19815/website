import compileMarkdownToReact from './mdx';

it('compileMarkdownToReact without truncate works', async () => {
  expect(
    await compileMarkdownToReact(
      "# h1\n<!--truncate-->\n## h2\n\nexport const additionalProperties = { foo: 'bar' }",
      false
    )
  ).toBe(`import React from 'react';
import mdx from 'esbuild-scripts/__internal-components__/mdx';
/* @jsxRuntime classic */
/* @jsx mdx */

export const additionalProperties = {
  foo: 'bar'
};

const layoutProps = {
  additionalProperties
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
};
MDXContent.additionalProperties = typeof additionalProperties === 'undefined' ? undefined : additionalProperties;
`);
});

it('compileMarkdownToReact with truncate works', async () => {
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
};
MDXContent.additionalProperties = typeof additionalProperties === 'undefined' ? undefined : additionalProperties;
`);
});
