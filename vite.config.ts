import { defineConfig } from "vitest/config";

// base "./" so the built game works from any folder, including GitHub Pages' /levain/ path.
export default defineConfig({
  base: "./",
  test: { include: ["test/**/*.test.ts"] },
});
