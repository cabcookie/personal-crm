import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

// Next 16 removed `next lint` and the next.config eslint key, and
// eslint-config-next 16 requires ESLint 9, so this replaces .eslintrc.json.
// eslint-config-next ships flat config directly, hence the plain spread.
const config = [
  {
    ignores: [
      ".next/**",
      ".amplify/**",
      "amplify/graphql-code/**",
      "node_modules/**",
      "next-env.d.ts",
      // Outside next lint's default scope before the Next 16 migration;
      // kept out here so this upgrade does not widen what gets linted.
      "scripts/**",
      "test-export.mjs",
      // Carried over from the .eslintignore that ESLint 9 no longer reads.
      "components/import-data/**",
    ],
  },
  js.configs.recommended,
  ...nextCoreWebVitals,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Carried over verbatim from .eslintrc.json:
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // TypeScript itself covers these; the base rules misfire on TS syntax.
      "no-undef": "off",
      "no-unused-vars": "off",
      // Misfires on TypeScript declaration merging (type + const of the
      // same name); the compiler already catches real redeclarations.
      "no-redeclare": "off",
    },
  },
  prettierRecommended,
  {
    rules: {
      "prettier/prettier": ["error", { singleQuote: false }],
    },
  },
];

export default config;
