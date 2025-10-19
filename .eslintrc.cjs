module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off'
  },
  ignorePatterns: ['dist/', 'node_modules/']
}