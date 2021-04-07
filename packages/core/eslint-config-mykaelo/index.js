'use strict';

module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: [
    'lib/**',
    'dist/**',
  ],
  rules: {
    indent: [
      'error', 2,
      {'MemberExpression': 1},
    ],
  },
};
