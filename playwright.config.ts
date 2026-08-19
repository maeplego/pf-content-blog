import { defineConfig, devices } from "@playwright/test";

const web = "http://localhost:13007";

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: web,
    trace: "off",
  },
  webServer: {
    command: "npx next dev -p 13007 --hostname localhost",
    url: web,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      CONTENT_DATABASE_URL: "",
    },
  },
});
