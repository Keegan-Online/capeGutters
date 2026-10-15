import { chromium } from "playwright";
const out = process.argv[2];
const b = await chromium.launch({ channel: "chrome" });
const errors = [];
for (const [w, h, dpr] of [[1440, 900, 1], [390, 844, 2]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: w < 600, hasTouch: w < 600 });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await p.goto("http://localhost:3217/", { waitUntil: "networkidle" });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
  await p.waitForTimeout(4200);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/final-${w}.png`, fullPage: true });
  await ctx.close();
}
console.log(errors.slice(0, 5).join("\n") || "no errors");
await b.close();
