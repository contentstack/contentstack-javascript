module.exports = {
  env: {
    "es2020": true,
    "node": true,
    "browser": true,
    "jest": true
  },
  extends: 'standard',
  // "globals": {
  //     "Atomics": "readonly",
  //     "SharedArrayBuffer": "readonly"
  // },
  // "parserOptions": {
  //     "ecmaFeatures": {
  //         "jsx": true
  //     },
  //     "ecmaVersion": 2015,
  //     "sourceType": "module"
  // },
  parser: "@babel/eslint-parser", // Use Babel parser to handle modern JS syntax
  plugins: [
    'standard',
    'promise'
  ],
  rules: {
    'semi': ['error', 'always'],
    'semi-spacing': ['error', { before: false, after: true }]
  }
}; 