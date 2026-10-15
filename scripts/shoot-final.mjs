// Full-page screenshots of the final site routes. Usage: node scripts/shoot-final.mjs <outDir> [routes]
import { chromium } from "playwright";
import fs from "node:fs";
const out = process.argv[2] ?? "screens/final";
const routes = (process.argv[3] ?? "/,/style-guide,/variations").split(",");
const base = process.env.BASE ?? "http://localhost:3217";
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
const errors = [];
for (const [w, h, dpr] of [[1440, 900, 1], [390, 844, 2]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: w < 600, hasTouch: w < 600 });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(`${w} ${e.message}`));
  p.on("console", (m) => m.type() === "error" && errors.push(`${w} ${m.text()}`));
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: "networkidle" });
    // Scroll through so in-view effects run, then wait for the drawing to finish.
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 350) {
        window.scrollTo(0, y);
        await new Promise((res) => setTimeout(res, 160));
      }
    });
    await p.waitForTimeout(3800);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(500);
    const name = r === "/" ? "home" : r.replace(/^\//, "").replaceAll("/", "_");
    await p.screenshot({ path: `${out}/${name}-${w}.png`, fullPage: true });
  }
  await ctx.close();
}
await b.close();
console.log(errors.length ? errors.slice(0, 6).join("\n") : "no console errors");
