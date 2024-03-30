/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ["plugin:@next/next/core-web-vitals"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/require-await": "off",

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
  },
};

module.exports = config;
