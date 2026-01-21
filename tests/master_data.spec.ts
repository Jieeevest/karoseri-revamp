import { test, expect } from "@playwright/test";
import { login } from "./utils";

test.describe("Master Data - Kategori Barang", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/master/kategori-barang");
  });

  test("should create, edit, and delete category", async ({ page }) => {
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
    await expect(page.getByText("Kategori ditambahkan")).toBeVisible();

    // Edit
    const row = page.getByRole("row", { name: "PW Test Category" });
    await row.getByRole("button").nth(0).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await page.fill("input#nama", "PW Test Category Edited");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();

    // Verify edit
    await expect(page.getByText("PW Test Category Edited")).toBeVisible();
    await expect(page.getByText("Kategori diperbarui")).toBeVisible();

    // Delete
    const rowEdited = page.getByRole("row", {
      name: "PW Test Category Edited",
    });

    page.on("dialog", (dialog) => dialog.accept());

    await rowEdited.getByRole("button").nth(1).click();

    // Verify delete
    await expect(page.getByText("Kategori dihapus")).toBeVisible();
    await expect(page.getByText("PW Test Category Edited")).not.toBeVisible();
  });
});
