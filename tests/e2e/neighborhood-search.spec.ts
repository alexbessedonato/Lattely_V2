import { expect, test } from "@playwright/test";

test("changing neighborhoods refreshes the nearby coffee shops", async ({
  page,
}) => {
  await page.goto("/?neighborhood=vila-de-gracia");
  await expect(
    page.getByRole("heading", { level: 2, name: "Lattely Test Coffee" }),
  ).toBeVisible();

  await page
    .getByRole("combobox", { name: "Barcelona neighborhood" })
    .selectOption("dreta-de-leixample");
  await page.getByRole("button", { name: "Show nearby shops" }).click();

  await expect(page).toHaveURL(/neighborhood=dreta-de-leixample/);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Outside Radius Test Café",
    }),
  ).toBeVisible();
});

test("includes shops inside 2 km and excludes shops outside it", async ({
  page,
}) => {
  await page.goto("/?neighborhood=vila-de-gracia");

  await expect(
    page.getByRole("heading", { level: 2, name: "Gràcia Test Sample Café" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Lattely Test Coffee" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Outside Radius Test Café" }),
  ).toHaveCount(0);
});

test("shows an empty state when the selected neighborhood has no matches", async ({
  page,
}) => {
  await page.goto("/?neighborhood=sants");

  await expect(page.getByRole("status")).toContainText(
    "No coffee shops within 2 km of Sants",
  );
});

test("falls back to a curated neighborhood for an unknown query value", async ({
  page,
}) => {
  await page.goto("/?neighborhood=not-a-neighborhood");

  await expect(
    page.getByRole("combobox", { name: "Barcelona neighborhood" }),
  ).toHaveValue("vila-de-gracia");
  await expect(
    page.getByRole("heading", { level: 2, name: "Lattely Test Coffee" }),
  ).toBeVisible();
});
