module.exports = {
  "env": {
    "jest/globals": true,
    node: true,
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  "plugins": ["jest"],
  "extends": "eslint:recommended",
  "overrides": [],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "semi": [2, "always"]
  }
};
