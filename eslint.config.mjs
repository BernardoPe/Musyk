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
    ignores: ["**/generated/**", "dist/**", "scripts/**"],
},
{
    files: ["**/*.ts", "**/*.tsx"],

    extends: compat.extends("eslint:recommended", "prettier", "plugin:@typescript-eslint/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: "module",
        parserOptions: {
            projectService: {
                allowDefaultProject: ["tsup.config.ts"],
            },
            tsconfigRootDir: __dirname,
        },
    },

    rules: {
        quotes: ["error", "double"],
        semi: ["error", "never"],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-floating-promises": "error",
        "no-restricted-imports": [
            "error",
            {
                patterns: [
                    {
                        group: ["../*", "./*"],
                        message: "Use the @/ alias for intra-src imports instead of relative paths.",
                    },
                ],
            },
        ],
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    rules: {
        "no-undef": "off",
        "no-prototype-builtins": "off",
        "no-unused-vars": "off",
    },
}]);