module.exports = {
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['airbnb', 'prettier', 'plugin:@typescript-eslint/recommended', 'react-app'],
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
    'object-curly-newline': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'react/jsx-indent': 'off', // Already covered by Prettier
    'react/jsx-one-expression-per-line': 'off',
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
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
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
