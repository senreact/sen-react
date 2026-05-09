import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vitest config for apps/web.
 *
 * `jsx: preserve` in tsconfig leaves JSX for Next.js to compile in
 * production. Vitest sees the same source files but has no Next pipeline,
 * so we plug in @vitejs/plugin-react to transform JSX → JS at test time.
 *
 * `@/*` path alias mirrors tsconfig so component imports resolve.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  test: {
    environment: "node",
  },
});
