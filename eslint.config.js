import nextPlugin from '@next/eslint-plugin-next';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
  {
    ignores: [
      // Dependencies
      'node_modules/',
      '.pnp',
      '.pnp.js',
      // Production builds
      '.next/',
      'deploy/.next/',
      'out/',
      'dist/',
      'build/',
      // Environment files
      '.env*',
      // Generated files
      '*.tsbuildinfo',
      'next-env.d.ts',
      // Logs
      '*.log',
      // Runtime data
      'pids',
      '*.pid',
      '*.seed',
      '*.pid.lock',
      // Coverage directory
      'coverage/',
      '*.lcov',
      '.nyc_output',
      // Cache directories
      '.cache/',
      '.parcel-cache/',
      '.eslintcache',
      // Database
      '*.db',
      '*.sqlite',
      '*.sqlite3',
      // Prisma generated
      'prisma/client/',
      'prisma/migrations/',
      // Public assets that shouldn't be linted
      'public/sw.js',
      'public/workbox-*.js',
      'public/worker-*.js',
      'public/fallback-*.js',
      'public/robots.txt',
      'public/sitemap.xml',
      // IDE files
      '.vscode/',
      '.idea/',
      '*.swp',
      '*.swo',
      // Python virtual environment
      '.venv/',
      'venv/',
      // OS files
      '.DS_Store',
      'Thumbs.db',
      'Desktop.ini',
      // Package managers
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      // Storybook
      '.storybook-out/',
      'storybook-static/',
      // Temporary directories
      'tmp/',
      'temp/',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': typescriptEslint,
      react: reactPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // Next.js core web vitals rules
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      // General rules
      'no-undef': 'off', // TypeScript handles this
      'no-unused-vars': 'off', // Use @typescript-eslint/no-unused-vars
      'no-useless-escape': 'off', // Allow escapes in regex
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],
      // Import rules
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // TypeScript handles this
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  // Type definition files
  {
    files: ['src/types/**/*.ts', 'deploy/src/types/**/*.ts'],
    rules: {
      'no-unused-vars': 'off', // Type definitions may export unused constants
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  // Configuration files
  {
    files: ['*.config.{js,ts}', '*.d.ts'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'import/no-default-export': 'off',
    },
  },
  // API routes
  {
    files: ['src/app/api/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // API routes often deal with any
    },
  },
  // Test files
  {
    files: ['**/*.test.{js,ts,tsx}', '**/*.spec.{js,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  // Node scripts and seed files — console is intentional
  {
    files: ['scripts/**/*.{js,ts}', 'prisma/**/*.{js,ts}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // Prettier — must be last to disable any ESLint rules that conflict with Prettier formatting
  prettierConfig,
];
