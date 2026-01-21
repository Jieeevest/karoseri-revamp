import { test, expect } from "@playwright/test";
import { login } from "./utils";

test.describe("Vehicle Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("should display vehicle list", async ({ page }) => {
    await page.goto("/kendaraan/data-kendaraan");
    await expect(
      page.getByRole("heading", { name: "Data Kendaraan" }),
    ).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should display customer list", async ({ page }) => {
    await page.goto("/kendaraan/customer");
    await expect(
      page.getByRole("heading", { name: "Data Customer" }),
    ).toBeVisible();
    await expect(page.locator("body")).toContainText(/Customer|Pelanggan/i);
  });
});
