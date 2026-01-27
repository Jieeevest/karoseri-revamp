import { test, expect } from "@playwright/test";
import { login } from "../utils";

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

    const randomId = Math.floor(Math.random() * 10000);
    const categoryName = `PW Test Category ${randomId}`;

    // Create
    await page.getByRole("button", { name: "Tambah Kategori" }).click();
    await page.fill("#nama", categoryName);
    await page.fill("#deskripsi", "Description from PW");
    await page.getByRole("button", { name: "Buat Kategori" }).click(); // UI shows "Buat Kategori" or "Simpan Perubahan"? Code says {editingKategori ? "Simpan Perubahan" : "Buat Kategori"}

    // Verify creation
    await expect(page.getByText(categoryName)).toBeVisible();

    // Optional: Check toast success
    // const toast = page.getByRole("status");
    // await expect(toast).toContainText(/berhasil/i);
  });
});
