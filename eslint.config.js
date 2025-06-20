// eslint.config.js
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {},
  },
  js.configs.recommended,
  prettier,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];

