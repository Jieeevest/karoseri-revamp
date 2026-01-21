import { test, expect } from "@playwright/test";
import { login } from "./utils";

test.describe("Project Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/project");
  });

  test("should display project list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Project" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });
});
