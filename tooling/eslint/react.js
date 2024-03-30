/** @type {import('eslint').Linter.Config} */
const config = {
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  rules: {
    "react/prop-types": "off",

    // Allow escaping the compiler
    "@typescript-eslint/ban-ts-comment": "error",

    // Allow explicit `any`s
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-implicit-any": "off",

    // START: Allow implicit `any`s
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    // END: Allow implicit `any`s

    "@typescript-eslint/no-non-null-assertion": "off",

    "@typescript-eslint/no-return-await": "off",
  },
  globals: {
    React: "writable",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
  },
};

module.exports = config;
