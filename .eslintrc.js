const tsconfigs = ['./tsconfig.json'];

const ruleOverrides = {
  '@typescript-eslint/no-misused-promises': 0,
  '@typescript-eslint/no-redeclare': 0,
  'arrow-body-style': 0,
  'canonical/destructuring-property-newline': 0,
  'canonical/export-specifier-newline': 0,
  'canonical/filename-match-regex': 0,
  'canonical/import-specifier-newline': 0,
  'default-case': 0,
  'default-case-last': 0,
  'import/extensions': 0,
  'jest/prefer-strict-equal': 0,
  'no-warning-comments': 0,
  'prefer-destructuring': 0,
  'prefer-object-spread': 0,
  'react/no-unstable-nested-components': 0,
  'react/prop-types': 0,
  'require-unicode-regexp': 0,
  'unicorn/no-array-callback-reference': 0,
  'unicorn/no-array-for-each': 0,
  'unicorn/no-array-reduce': 0,
  'unicorn/no-unsafe-regex': 0,
};

module.exports = {
  overrides: [
    {
      excludedFiles: '*.test.ts',
      extends: ['canonical', 'canonical/typescript', 'prettier'],
      files: '*.ts',
      parserOptions: {
        project: tsconfigs,
      },
      rules: ruleOverrides,
    },
    {
      extends: [
        'canonical',
        'canonical/typescript',
        'canonical/jest',
        'prettier',
      ],
      files: '*.test.ts',
      parserOptions: {
        project: tsconfigs,
      },
      rules: ruleOverrides,
    },
    {
      extends: ['canonical/json'],
      files: '*.json',
      rules: {
        'jsonc/no-comments': 0,
      },
    },
    {
      extends: ['canonical/yaml'],
      files: '*.yaml',
      rules: {
        'yml/no-empty-mapping-value': 0,
        'yml/require-string-key': 0,
      },
    },
  ],
  root: true,
};
