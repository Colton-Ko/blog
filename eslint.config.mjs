import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import eslintPluginAstro from 'eslint-plugin-astro';
import * as mdx from 'eslint-plugin-mdx';
import html from '@html-eslint/eslint-plugin';
import htmlParser from '@html-eslint/parser';

export default [
    // Global ignores
    {
        ignores: ["dist/**", ".astro/**", "node_modules/**", "public/**", "package-lock.json"]
    },

    // JavaScript
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        ...js.configs.recommended,
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        }
    },

    // TypeScript
    ...tseslint.configs.recommended,

    // Astro (Restricted to relevant files)
    ...eslintPluginAstro.configs.recommended.map(config => ({
        ...config,
        files: config.files || ["**/*.astro", "**/*.js", "**/*.mjs", "**/*.cjs", "**/*.ts", "**/*.mts", "**/*.cts", "**/*.jsx", "**/*.tsx"]
    })),

    // JSON
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        rules: {
            "json/no-duplicate-keys": "error",
            "json/no-empty-keys": "error"
        }
    },

    // Markdown (CommonMark)
    ...markdown.configs.recommended,

    // MDX
    {
        ...mdx.configs.flat,
        files: ["**/*.mdx"],
    },
    {
        ...mdx.configs.flatCodeBlocks,
        files: ["**/*.mdx"],
    },

    // CSS
    {
        files: ["**/*.css"],
        plugins: { css },
        language: "css/css",
        rules: {
            "css/no-duplicate-imports": "error",
            "css/no-invalid-at-rules": "error"
        }
    },

    // HTML
    {
        files: ["**/*.html"],
        plugins: { "@html-eslint": html },
        languageOptions: {
            parser: htmlParser,
        },
        rules: {
            ...html.configs["flat/recommended"].rules,
        },
    },

    // Disable Astro rules for non-code files to prevent conflicts
    {
        files: ["**/*.md", "**/*.mdx", "**/*.json", "**/*.css", "**/*.html"],
        rules: {
            "astro/missing-client-only-directive-value": "off",
            "astro/no-set-html-directive": "off",
            "markdown/no-missing-label-refs": "off"
        }
    }
];
