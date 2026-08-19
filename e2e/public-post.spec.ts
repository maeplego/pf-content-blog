import { expect, test } from "@playwright/test";

test("public index links to a published seed article", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "公開記事" })).toBeVisible();
  await page.getByRole("link", { name: /Why this portfolio is 15 products/ }).click();
  await expect(page).toHaveURL(/\/posts\/why-fifteen-products/);
  await expect(page.getByText("javascript:")).toHaveCount(0);
});

test("draft slug is not a public post", async ({ page }) => {
  const res = await page.goto("/posts/notes-on-scheduled-posts");
  expect(res?.status()).toBe(404);
});
