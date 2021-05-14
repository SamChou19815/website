import parseMarkdownHeaderTree, { extractMarkdownHeaders } from './markdown-header-parser';

const exampleDocument = `
# h1
sadfsdfd
## h2-1
asdf
fas
df
\`\`\`
foo bar
# rf
## 4
\`\`\`
adf
### h3
#### h4-1
##### h5-1
###### h6-1
###### h6-2
#### h4-2
##### h5-2
###### h6-3
###### h6-4
## h2-2
`;

it('extractMarkdownHeaders test', () => {
  expect(extractMarkdownHeaders(exampleDocument)).toEqual([
    { label: 'h1', level: 1 },
    { label: 'h2-1', level: 2 },
    { label: 'h3', level: 3 },
    { label: 'h4-1', level: 4 },
    { label: 'h5-1', level: 5 },
    { label: 'h6-1', level: 6 },
    { label: 'h6-2', level: 6 },
    { label: 'h4-2', level: 4 },
    { label: 'h5-2', level: 5 },
    { label: 'h6-3', level: 6 },
    { label: 'h6-4', level: 6 },
    { label: 'h2-2', level: 2 },
  ]);

  expect(() => extractMarkdownHeaders('######## sdfd')).toThrow();
});

it('parseMarkdownHeaderTree good test', () => {
  expect(parseMarkdownHeaderTree(exampleDocument)).toEqual({
    label: 'h1',
    children: [
      {
        label: 'h2-1',
        children: [
          {
            label: 'h3',
            children: [
              {
                label: 'h4-1',
                children: [
                  {
                    label: 'h5-1',
                    children: [
                      { label: 'h6-1', children: [] },
                      { label: 'h6-2', children: [] },
                    ],
                  },
                ],
              },
              {
                label: 'h4-2',
                children: [
                  {
                    label: 'h5-2',
                    children: [
                      { label: 'h6-3', children: [] },
                      { label: 'h6-4', children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { label: 'h2-2', children: [] },
    ],
  });
});

it('parseMarkdownHeaderTree bad tests', () => {
  expect(() => parseMarkdownHeaderTree('')).toThrow();
  expect(() => parseMarkdownHeaderTree('## h2\n# h1')).toThrow();
  expect(() => parseMarkdownHeaderTree('# h1\n# h2')).toThrow();
  expect(() => parseMarkdownHeaderTree('# h1\n### h3')).toThrow();
});
