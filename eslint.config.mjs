import globals from 'globals'

const ERROR = 'error'
const WARN = 'warn'

export default [
  {
    ignores: [
      '**/.cache/**',
      '**/node_modules/**',
      '**/build/**',
      '**/public/build/**',
      '**/playwright-report/**',
      '**/server-build/**',
      '**/dist/**',
      '**/functions/**',
    ],
  },

  // all files
  {
    plugins: {
      import: (await import('eslint-plugin-import-x')).default,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unexpected-multiline': ERROR,
      'no-warning-comments': [
        ERROR,
        { terms: ['FIXME'], location: 'anywhere' },
      ],
      'import/no-duplicates': [WARN, { 'prefer-inline': true }],
      'import/order': [
        WARN,
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [{ pattern: '#*/**', group: 'internal' }],
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
        },
      ],
    },
  },

  // JSX/TSX files
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      react: (await import('eslint-plugin-react')).default,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parser: (await import('typescript-eslint')).parser,
      parserOptions: {
        jsx: true,
      },
    },
    rules: {
      'react/jsx-key': [
        ERROR,
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
      'react/no-typos': WARN,
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
    },
  },

  {
    files: ['**/*.ts?(x)', '**/*.js?(x)'],
    plugins: {
      'react-hooks': (await import('eslint-plugin-react-hooks')).default,
    },
    rules: {
      'react-hooks/rules-of-hooks': ERROR,
      'react-hooks/exhaustive-deps': WARN,
    },
  },

  {
    files: ['**/*.ts?(x)'],
    languageOptions: {
      parser: (await import('typescript-eslint')).parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      '@typescript-eslint': (await import('typescript-eslint')).plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        WARN,
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^ignored',
        },
      ],
      'import/consistent-type-specifier-style': [WARN, 'prefer-inline'],
      '@typescript-eslint/consistent-type-imports': [
        WARN,
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
]
