import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  // Next 16 removed `next lint`, so this flat config is invoked by the ESLint
  // CLI directly. Keep the old `next lint` scope: the site only. `backend/`
  // and `mcp/` are separate packages, and build output is not source.
  // eslint-config-next 16 ships eslint-plugin-react-hooks v6, whose
  // React-Compiler diagnostics flag patterns this codebase already uses (state
  // set from an effect, refs read during render, components declared inside
  // components). They need a dedicated refactor with UI verification, so they
  // stay off here rather than block the framework upgrade.
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/static-components": "off",
    },
  },
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
