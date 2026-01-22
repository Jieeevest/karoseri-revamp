import { test, expect } from "@playwright/test";
import { login } from "./utils";

test.describe("Master Data - Kategori Barang", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/master/kategori-barang");
  });

  test("should create and read category", async ({ page }) => {
    // Navigate and check title
    await expect(
      page.getByRole("heading", { name: "Kategori Barang" }),
    ).toBeVisible();

    // Create
    await page.getByRole("button", { name: "Tambah Kategori" }).click();
    await page.fill("input#nama", "PW Test Category");
    await page.fill("textarea#deskripsi", "Description from PW");
    await page.getByRole("button", { name: "Buat Kategori" }).click();

    // Verify creation
    await expect(page.getByText("PW Test Category")).toBeVisible();
    const toast = page.getByRole("status");
    await expect(toast).toContainText(/success/i);
  });
});
