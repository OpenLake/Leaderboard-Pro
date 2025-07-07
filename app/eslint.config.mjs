import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import * as globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const globals = require("globals");
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  ...fixupConfigRules(compat.extends("react-app")),
  {
    // files
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      parserOptions: {
        sourceType: "module",
      },
    },
    extends: compat.extends("eslint:recommended", "prettier"),
  },
]);
