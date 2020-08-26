import { parseGitDiffWithStatus_EXPOSED_FOR_TESTING } from '.';

const EXAMPLE_DIFF_WITH_STATUS = `M	firebase.json
A	packages/ten/docusaurus-infima-css-plugin.js
D	packages/ten/next-env.d.ts
R067	packages/ten/components/App.tsx	packages/ten/src/components/App.tsx
R100	packages/ten/public/favicon.ico	packages/ten/static/favicon.ico`;

it('parseGitDiffWithStatus_EXPOSED_FOR_TESTING works', () => {
  expect(parseGitDiffWithStatus_EXPOSED_FOR_TESTING(EXAMPLE_DIFF_WITH_STATUS)).toEqual({
    changedFiles: [
      'firebase.json',
      'packages/ten/docusaurus-infima-css-plugin.js',
      'packages/ten/src/components/App.tsx',
      'packages/ten/static/favicon.ico',
    ],
    deletedFiles: [
      'packages/ten/next-env.d.ts',
      'packages/ten/components/App.tsx',
      'packages/ten/public/favicon.ico',
    ],
  });
});
