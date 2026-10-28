import { execFileSync } from "node:child_process";
import { defineConfig } from "@playwright/test";

const databaseUrl = execFileSync(
  "neon",
  [
    "connection-string",
    "development",
    "--project-id",
    "winter-moon-94225509",
    "--database-name",
    "neondb",
    "--pooled",
  ],
  { encoding: "utf8" },
).trim();

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://127.0.0.1:3100" },
  webServer: {
    command: "pnpm exec next start --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    env: { DATABASE_URL: databaseUrl },
  },
});
