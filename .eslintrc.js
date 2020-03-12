module.exports = {
  extends: ['airbnb-base', 'prettier', "plugin:react/recommended"],
  plugins: ['prettier'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'class-methods-use-this': [1, { 'exceptMethods': ['render'] }],
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'no-case-declarations': 'off',
    'no-console': ['error', { allow: ['error'] }],
    'no-underscore-dangle': 'off',
    'prettier/prettier': 'error',
  },
  env: {
    es6: true,
    jest: true,
    browser: true,
  },
  parser: "babel-eslint",
};
