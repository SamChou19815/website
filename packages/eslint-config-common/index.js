module.exports = {
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['react-app', 'plugin:@typescript-eslint/recommended', 'airbnb', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        ignoreRestSiblings: true,
        vars: 'all',
        varsIgnorePattern: '_',
      },
    ],
    'import/extensions': 'off',
    'import/no-unresolved': [
      'error',
      {
        ignore: ['^@theme', '^@docusaurus', '^@generated'],
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['parent', 'sibling', 'index']],
        // Make React always appear first.
        pathGroups: [
          {
            pattern: 'react?(-dom)',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: false },
      },
    ],
    indent: 'off', // Already covered by Prettier
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off', // Already covered by TypeScript
    'no-unused-expressions': 'off', // Already covered by typescript-eslint
    'object-curly-newline': 'off', // Already covered by Prettier
    'react/jsx-filename-extension': 'off', // Already covered by TypeScript
    'react/prop-types': 'off', // Already covered by TypeScript
    'react/jsx-indent': 'off', // Already covered by Prettier
    'react/jsx-one-expression-per-line': 'off', // Already covered by Prettier
    'spaced-comment': ['error', 'always', { markers: ['/'] }], // Need for .d.ts type references
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.json', '.mjs', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
    },
  ],
};
