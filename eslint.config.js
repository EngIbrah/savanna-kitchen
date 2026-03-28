// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  // 1. Global ignores first (they apply to everything)
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    // Add any other project-specific ignores here
  ]),

  // 2. Core Web Vitals rules (includes @next/next recommended + react + react-hooks)
  ...nextCoreWebVitals,

  // 3. TypeScript support (parser + typescript-eslint rules)
  ...nextTypescript,

  // 4. Your custom rules / overrides (last so they take precedence)
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // Add any other custom rules here, e.g.:
      // '@next/next/no-html-link-for-pages': 'off',
      // 'no-console': 'warn',
    },
  },
]);