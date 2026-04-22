import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "amplify/functions/**/*.{test,spec}.{js,ts}",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/amplify/graphql-code/**",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      $amplify: path.resolve(__dirname, "./.amplify/generated"),
    },
  },
});
