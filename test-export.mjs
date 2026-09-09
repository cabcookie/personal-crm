import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, ".playwright-session");

(async () => {
  // Launch browser with persistent context to save auth session
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1280, height: 720 },
  });
  const page = browser.pages()[0] || (await browser.newPage());

  // Capture browser console + page errors from the very start so we don't
  // miss failures that happen during S3 download.
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      consoleErrors.push(text);
      console.log("Browser console error:", text);
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
    console.log("Page error:", err.message);
  });

  // Accept any triggered downloads so the Download button click doesn't hang.
  page.on("download", (dl) => {
    console.log("Download started:", dl.suggestedFilename());
    dl.saveAs(path.join(__dirname, "downloaded-" + dl.suggestedFilename()));
  });

  try {
    console.log("Navigating to project page...");
    await page.goto(
      "http://localhost:3000/projects/de9709d8-ce75-45eb-90c4-76885e812f0e",
      {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      }
    );

    // Wait for page to settle and determine if we're on login or project page
    await page.waitForTimeout(3000);

    // Check if we need to sign in - look for the actual login form
    const emailInput = page.locator('input[type="email"]');
    const isLoginPage = await emailInput.isVisible().catch(() => false);

    if (isLoginPage) {
      console.log("\n========================================");
      console.log("⚠️  PLEASE SIGN IN NOW");
      console.log("========================================");
      console.log("Look for the browser window and sign in.");
      console.log("The test will wait up to 5 minutes for you.");
      console.log("========================================\n");

      // Wait for user to sign in (check if login form disappears)
      try {
        await page.waitForSelector('button:has-text("Sign in")', {
          state: "hidden",
          timeout: 300000, // 5 minutes to sign in
        });

        console.log("\n✓ Signed in! Session saved for future tests.");
        console.log("Continuing to project page...\n");

        // Wait a bit for auth to settle
        await page.waitForTimeout(2000);

        // Navigate again after sign-in
        await page.goto(
          "http://localhost:3000/projects/de9709d8-ce75-45eb-90c4-76885e812f0e",
          {
            waitUntil: "networkidle",
            timeout: 30000,
          }
        );
      } catch (error) {
        console.log(
          "\n❌ Timeout waiting for sign-in. Please try running the test again.\n"
        );
        throw error;
      }
    } else {
      console.log("✓ Already signed in (using saved session)");
    }

    console.log("Page loaded. Waiting for content...");
    await page.waitForTimeout(2000);

    // Look for the Export button
    console.log("Looking for Export button...");
    const exportButton = page
      .locator('button:has-text("Export for AI")')
      .first();

    const isButtonVisible = await exportButton.isVisible().catch(() => false);

    if (isButtonVisible) {
      console.log("✓ Export button found! Clicking...");
      await exportButton.click();

      // Wait for dialog to open
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      console.log("✓ Export dialog opened!");

      await page.screenshot({ path: "export-dialog-opened.png" });
      console.log("Screenshot saved to export-dialog-opened.png");

      // Try to create a one-time export
      console.log("Creating a one-time export...");

      // Click on "One-time" tab if not already selected
      const oneTimeTab = page.locator('button:has-text("One-time")').first();
      if (await oneTimeTab.isVisible().catch(() => false)) {
        await oneTimeTab.click();
        await page.waitForTimeout(500);
      }

      // Set start date to 2024-01-01 via the calendar popover.
      // End date stays at today (the form default).
      console.log("Setting start date to 2024-01-01...");
      const startDateButton = page
        .getByRole("button", { name: /^Start Date|Pick a date/ })
        .first();
      // Fallback: the first popover trigger below the "Start Date" label
      const startTrigger = page
        .locator('label:has-text("Start Date")')
        .locator("..")
        .locator("button")
        .first();
      await startTrigger.click();
      await page.waitForTimeout(300);

      // Calendar opens on today's month; navigate back to January 2024.
      const today = new Date();
      const target = new Date(2024, 0, 1);
      const monthsBack =
        (today.getFullYear() - target.getFullYear()) * 12 +
        (today.getMonth() - target.getMonth());
      console.log(`Clicking "previous month" ${monthsBack} times...`);

      const prevBtn = page
        .locator(
          'button[name="previous-month"], button[aria-label*="previous" i]'
        )
        .first();
      for (let i = 0; i < monthsBack; i++) {
        await prevBtn.click();
      }
      await page.waitForTimeout(300);

      await page.locator('td[data-day="2024-01-01"] button').click();
      await page.waitForTimeout(300);
      console.log("✓ Start date set to 2024-01-01");

      // Look for the Create Export or similar button
      const createButton = page
        .locator(
          'button:has-text("Start Export"), button:has-text("Create Export"), button:has-text("Export")'
        )
        .last();

      if (await createButton.isVisible().catch(() => false)) {
        console.log("✓ Found export button, clicking...");
        await createButton.click();

        // Look at the toast region for the "Export started" confirmation
        // (a real error toast uses role=status with the destructive variant).
        await page.waitForTimeout(1500);
        const startedToast = page
          .locator('[role="status"]:has-text("Export started")')
          .first();
        if (await startedToast.isVisible().catch(() => false)) {
          console.log('✓ "Export started" toast visible');
          await page.screenshot({ path: "export-success.png" });
        } else {
          console.log(
            '⚠️  No "Export started" toast seen (may have auto-dismissed)'
          );
        }

        // Navigate to exports page to see the result
        console.log("Navigating to exports page...");
        await page.goto("http://localhost:3000/profile/exports", {
          waitUntil: "networkidle",
          timeout: 30000,
        });

        // Wait for at least one GENERATED export card with a Download button
        // to show up (Lambda takes ~2-3s; real-time subscription updates the UI).
        console.log("Waiting for an export with a Download button...");
        const downloadBtn = page
          .getByRole("button", { name: /^Download$/ })
          .first();
        try {
          await downloadBtn.waitFor({ state: "visible", timeout: 30000 });
        } catch {
          await page.screenshot({ path: "exports-page-no-download.png" });
          throw new Error(
            "No Download button appeared on /profile/exports within 30s"
          );
        }
        await page.screenshot({ path: "exports-page.png" });
        console.log("✓ Download button is present");

        // Click Download and verify no S3 AccessDenied slips through.
        const errorsBefore = consoleErrors.length;
        await downloadBtn.click();
        await page.waitForTimeout(3000);
        const newErrors = consoleErrors.slice(errorsBefore);
        const s3Errors = newErrors.filter((e) =>
          /AccessDenied|Failed to download export from S3/i.test(e)
        );
        if (s3Errors.length > 0) {
          console.log("❌ S3 download failed:");
          for (const e of s3Errors) console.log("  -", e);
          await page.screenshot({ path: "download-failed.png" });
        } else {
          const okToast = page
            .locator('[role="status"]:has-text("Download started")')
            .first();
          const toastSeen = await okToast.isVisible().catch(() => false);
          console.log(
            toastSeen
              ? "✓ Download succeeded (toast visible, no S3 errors)"
              : "✓ Download triggered with no S3 errors (toast may have dismissed)"
          );
          await page.screenshot({ path: "download-success.png" });
        }
      } else {
        console.log("❌ Could not find create/export button in dialog");
        await page.screenshot({ path: "dialog-no-button.png" });
      }
    } else {
      console.log("❌ Export button not found on project page!");
      await page.screenshot({ path: "no-export-button.png" });

      // Print page content for debugging
      const bodyText = await page.locator("body").textContent();
      console.log("Page contains:", bodyText.substring(0, 500));
    }

    // Let any delayed errors surface into our pre-registered listeners.
    await page.waitForTimeout(2000);
  } catch (error) {
    console.error("Test failed:", error.message);
    await page.screenshot({ path: "error-screenshot.png" });
  } finally {
    await browser.close();
  }
})();
