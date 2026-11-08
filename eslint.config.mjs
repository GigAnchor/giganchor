import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  // Next 16 removed `next lint`, so this flat config is invoked by the ESLint
  // CLI directly. Keep the old `next lint` scope: the site only. `backend/`
  // and `mcp/` are separate packages, and build output is not source.
  // scripts/ are CommonJS (the package has no "type": "module").
  {
    files: ["scripts/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  globalIgnores([
    ".next/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "backend/**",
    "mcp/**",
    "public/**",
  ]),
]);
