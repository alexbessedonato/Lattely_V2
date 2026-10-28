import { expect, test } from "@playwright/test";

test("shows coffee shops saved in the development database", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 2, name: "Gràcia Test Sample Café" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Lattely Test Coffee" }),
  ).toBeVisible();
});
