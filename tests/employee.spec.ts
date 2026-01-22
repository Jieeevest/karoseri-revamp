import { test, expect } from "@playwright/test";
import { login } from "./utils";

test.describe.skip("Employee Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/karyawan");
  });

  test("should display employee list", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Data Karyawan" }),
    ).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should open add employee dialog", async ({ page }) => {
    await page.getByRole("button", { name: /Tambah|Add/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
