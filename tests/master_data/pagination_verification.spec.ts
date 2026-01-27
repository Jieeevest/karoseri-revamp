import { test, expect } from "@playwright/test";
import { login } from "../utils";

test.describe("Master Data - Pagination Verification", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("should display pagination controls on Kategori Barang", async ({
    page,
  }) => {
    await page.goto("/master/kategori-barang");
    await expect(
      page.getByRole("heading", { name: "Kategori Barang" }),
    ).toBeVisible();
    // Check for pagination controls container or buttons
    await expect(page.getByRole("button", { name: /Next/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Previous/i })).toBeVisible();
    // Check for "Show" limit selector
    await expect(page.getByText("Show")).toBeVisible();
  });

  test("should display pagination controls on Satuan Barang", async ({
    page,
  }) => {
    await page.goto("/master/satuan-barang");
    await expect(
      page.getByRole("heading", { name: "Satuan Barang" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Next/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Previous/i })).toBeVisible();
  });

  test("should display pagination controls on Merek Kendaraan", async ({
    page,
  }) => {
    await page.goto("/master/merek-kendaraan");
    await expect(
      page.getByRole("heading", { name: "Merek Kendaraan" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Next/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Previous/i })).toBeVisible();
  });

  test("should display pagination controls on Tipe Kendaraan", async ({
    page,
  }) => {
    await page.goto("/master/tipe-kendaraan");
    await expect(
      page.getByRole("heading", { name: "Tipe Kendaraan" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Next/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Previous/i })).toBeVisible();
  });
});
