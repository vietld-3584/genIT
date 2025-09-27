import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    projects: [
      {
        test: {
          name: "unit",
          globals: true,
          environment: "jsdom",
          setupFiles: ["./tests/unit/setup.ts"],
          include: ["tests/unit/**/*.(spec|test).(ts|js|tsx|jsx)"],
        },
      },
      {
        test: {
          name: "integration",
          globals: true,
          environment: "node",
          include: ["tests/integration/**/*.(spec|test).(ts|js)"],
          setupFiles: ["./tests/integration/setup/globalSetup.ts"],
          testTimeout: 30000,
          hookTimeout: 30000,
        },
      },
    ],
  },
});
