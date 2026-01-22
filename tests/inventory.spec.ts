import { test, expect } from "@playwright/test";
import { login } from "./utils";

test.describe.skip("Inventory - Data Barang", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/barang/data-barang");
  });

  test("should display inventory list", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Data Barang" }),
    ).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should search for an item", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Cari barang...");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Non Existent Item");
    await expect(
      page.getByRole("cell", { name: /Data tidak ditemukan/i }),
    ).toBeVisible();
  });
});
