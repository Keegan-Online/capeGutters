// Full-page screenshots of both homepages for review.
// Usage: node scripts/shoot.mjs [outDir] [baseUrl]
// Writes <page>-<width>.png for 1440 and 390, plus 765 (the mockups' own width).
import { chromium } from "playwright";
import fs from "node:fs";

const out = process.argv[2] ?? "screens";
const base = process.argv[3] ?? "http://localhost:3217";
const widths = (process.env.WIDTHS ?? "1440,390,765").split(",").map(Number);
const pages = (process.env.PAGES ?? "variations/home-page-1,variations/home-page-2").split(",");
fs.mkdirSync(out, { recursive: true });

// Uses the installed Google Chrome (no Playwright browser download needed).
const browser = await chromium.launch({ channel: "chrome" });
for (const w of widths) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: w < 600 ? 844 : 900 },
    deviceScaleFactor: w < 600 ? 2 : 1,
    isMobile: w < 600,
    hasTouch: w < 600,
  });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(`${base}/${p}`, { waitUntil: "networkidle" });
    // Let lazy images load and labels measure.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/${p.replaceAll("/", "_") || "home"}-${w}.png`, fullPage: true });
    console.log("shot", p, w);
  }
  await ctx.close();
}
await browser.close();
