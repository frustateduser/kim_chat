import { fileURLToPath } from "url";
import path from "path";
import js from "@eslint/js";
import globalsPkg from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { node, jest } = globalsPkg;
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["node_modules", "dist", "build", "coverage"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    extends: [js.configs.recommended, prettierConfig],
    rules: {
      "no-unused-vars": ["warn"],
      "no-console": "off",
      "prettier/prettier": "warn",
    },
  },
  ...compat.config({
    extends: ["plugin:jest/recommended", "prettier"],
    rules: {
      "no-unused-vars": ["warn"],
      "no-console": "off",
      "prettier/prettier": "warn",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  }),
  {
    files: ["**/*.test.{js,mjs,cjs}", "**/tests/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: { ...node, ...jest },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
]);
