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
    'prettier/@typescript-eslint',
    // NB: please leave this at the end so it can override all other rules!
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
    '@typescript-eslint/array-type': 'warn',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/class-name-casing': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off', // warns about mandatory param names in function types!
    '@typescript-eslint/no-use-before-define': 'off', // pointless rule
    'no-empty': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-undef': 'off', // gives false alarms about Cypress globals e.g. JQuery
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
