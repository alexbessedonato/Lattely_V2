import { expect, test } from "@playwright/test";

test("changes the coffee shop results with the selected search radius", async ({
  page,
}) => {
  await page.goto("/?neighborhood=vila-de-gracia");

  const radius = page.getByRole("combobox", { name: "Search radius" });
  await expect(radius).toContainText("2 km");
  await radius.click();
  await expect(page.getByRole("option")).toHaveText([
    "500 m",
    "1 km",
    "2 km",
    "5 km",
    "10 km",
    "Anywhere",
  ]);

  await page.getByRole("option", { name: "500 m" }).click();
  await page.getByRole("button", { name: "Show coffee shops" }).click();
  await expect(page).toHaveURL(/radius=500/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Gràcia Test Sample Café" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Lattely Test Coffee" }),
  ).toHaveCount(0);

  await radius.click();
  await page.getByRole("option", { name: "1 km" }).click();
  await page.getByRole("button", { name: "Show coffee shops" }).click();
  await expect(page).toHaveURL(/radius=1000/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Lattely Test Coffee" }),
  ).toHaveCount(0);

  await radius.click();
  await page.getByRole("option", { name: "2 km" }).click();
  await page.getByRole("button", { name: "Show coffee shops" }).click();
  await expect(page).toHaveURL(/radius=2000/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Lattely Test Coffee" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Outside Radius Test Café",
    }),
  ).toHaveCount(0);

  await radius.click();
  await page.getByRole("option", { name: "5 km" }).click();
  await page.getByRole("button", { name: "Show coffee shops" }).click();
  await expect(page).toHaveURL(/radius=5000/);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Outside Radius Test Café",
    }),
  ).toBeVisible();

  await radius.click();
  await page.getByRole("option", { name: "10 km" }).click();
  await page.getByRole("button", { name: "Show coffee shops" }).click();
  await expect(page).toHaveURL(/radius=10000/);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Outside Radius Test Café",
    }),
  ).toBeVisible();
});

test("uses the default radius when the server receives an unsupported choice", async ({
  page,
}) => {
  await page.goto("/?neighborhood=vila-de-gracia&radius=1001");

  await expect(
    page.getByRole("combobox", { name: "Search radius" }),
  ).toContainText("2 km");
  await expect(
    page.getByRole("heading", { level: 2, name: "Lattely Test Coffee" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Outside Radius Test Café",
    }),
  ).toHaveCount(0);
});

test("Anywhere shows the whole catalog with or without a neighborhood", async ({
  page,
}) => {
  const shopNames = [
    "Gràcia Test Sample Café",
    "Lattely Test Coffee",
    "Outside Radius Test Café",
  ];

  await page.goto("/?radius=anywhere");
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "All listed specialty coffee shops in Barcelona",
    }),
  ).toBeVisible();
  for (const name of shopNames) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }

  await page.goto("/?neighborhood=sants&radius=anywhere");
  for (const name of shopNames) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
});
