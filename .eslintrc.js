/**
 * Unified ES+TS+Prettier configuration for ESLint. Inspired by:
 * https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb
 *
 * This file uses JS (not JSON) so we can have comments and object literals.
 * PLEASE DO NOT ADD CONDITIONALS OR DYNAMIC CODE. Keep this file as pure data.
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['cypress'],
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'plugin:react/recommended',
    // NB: please leave these at the end so they can override all other rules!
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018, // aka ECMAScript 9
    sourceType: 'module' // allow `import` statement
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // maybe someday!
    '@typescript-eslint/no-namespace': 'off', // Cypress makes us use namespaces
    'no-empty': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-undef': 'off', // gives false alarms about Cypress globals e.g. JQuery
    'no-unused-vars': 'off', // gives false alarms about mandatory TS param names in fn declarations!
    'prettier/prettier': ['error', {singleQuote: true, trailingComma: 'es5'}],
    'react/prop-types': 'off'
  },
  overrides: [
    {
      files: ['cypress/**/*.js', 'cypress/**/*.jsx'],
      env: {
        "cypress/globals": true
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
};
