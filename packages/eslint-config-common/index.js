module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  globals: {
    Deno: 'readonly',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    require.resolve('eslint-config-airbnb'),
    require.resolve('eslint-config-prettier'),
  ],
  parser: require.resolve('@typescript-eslint/parser'),
  plugins: ['@typescript-eslint', 'react-hooks'],
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
    'import/named': 'off', // Covered by TypeScript
    'import/no-cycle': 'off', // Too slow
    'import/no-named-as-default': 'off', // Too slow
    'import/no-named-as-default-member': 'off', // Covered by TypeScript
    'import/extensions': 'off', // Too noisy
    'import/no-unresolved': [
      'error',
      {
        ignore: ['^@theme', '^@docusaurus', '^@generated'],
      },
    ],
    'import/no-anonymous-default-export': 'error',
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
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
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
