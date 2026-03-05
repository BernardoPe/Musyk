import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
{
    ignores: ["**/generated/**"],
},
{
    extends: compat.extends("eslint:recommended", "prettier", "plugin:@typescript-eslint/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        quotes: ["error", "double"],
        semi: ["error", "never"],
        "no-explicit-any": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unused-vars": "warn",
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    rules: {
        "no-undef": "off",
        "no-prototype-builtins": "off",
        "no-unused-vars": "off",
    },
}]);