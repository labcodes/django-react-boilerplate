module.exports = {
  extends: ['airbnb', 'prettier', "plugin:react/recommended"],
  plugins: ['prettier'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'class-methods-use-this': [1, { 'exceptMethods': ['render'] }],
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off',

    'no-case-declarations': 'off',
    'no-console': ['error', { allow: ['error'] }],
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-unneeded-ternary': 'off',

    'prettier/prettier': 'error',

    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/prefer-stateless-function': 'off',
    'react/state-in-constructor': 'off',
    'react/static-property-placement': 'off',
  },
  env: {
    es6: true,
    jest: true,
    browser: true,
  },
  parser: "babel-eslint",
};
