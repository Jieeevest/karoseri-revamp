import { test, expect } from "@playwright/test";
import { login } from "../utils";

test.describe("Master Data - Merek Kendaraan", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/master/merek-kendaraan");
  });

  test("should create and update merek kendaraan", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Merek Kendaraan" }),
    ).toBeVisible();

    const randomId = Math.floor(Math.random() * 10000);
    const merekName = `PW Test Merek ${randomId}`;
    const updatedMerekName = `PW Test Merek Updated ${randomId}`;

    // Create
    await page.getByRole("button", { name: "Tambah Merek" }).click();
    await page.fill("#nama", merekName);
    await page.getByRole("button", { name: "Buat Merek" }).click();

    // Verify creation
    await expect(page.getByText(merekName)).toBeVisible();

    // Update
    // Find the row containing the new merek and click the edit button
    // We can assume it's the first one if sorted by createdAt desc, but let's be more robust
    const row = page.getByRole("row", { name: merekName }).first();
    await row.getByRole("button").nth(0).click(); // Assumes first button is Edit

    await expect(page.getByRole("dialog")).toBeVisible();
    await page.fill("#nama", updatedMerekName);
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();

    // Verify update
    await expect(page.getByText(updatedMerekName)).toBeVisible();
    await expect(page.getByText(merekName)).not.toBeVisible();
  });
});
