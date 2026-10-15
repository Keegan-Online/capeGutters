// Behaviour checks for the final site. Run with the dev server up:
//   node scripts/check-final.mjs [baseUrl]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3217";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok: Boolean(ok) });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};
const top = (page, sel) => page.locator(sel).evaluate((el) => Math.round(el.getBoundingClientRect().top));

const browser = await chromium.launch({ channel: "chrome" });

// ---------- Desktop ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(base + "/", { waitUntil: "networkidle" });

  const nav = page.locator(".sh__nav");
  for (const [label, id] of [
    ["Services", "services"],
    ["Areas", "areas"],
    ["Enquire", "enquire"],
  ]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await page.waitForTimeout(900);
    const t = await top(page, `#${id}`);
    check(`Nav "${label}" reaches its section`, t > -4 && t < 140, `top=${t}`);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator(".hero-s__action").click();
  await page.waitForTimeout(900);
  const et = await top(page, "#enquire");
  check("Hero action reaches the enquiry", et > -4 && et < 140, `top=${et}`);

  // Service row carries the service into the form.
  await page.locator(".svc__button").nth(1).click();
  await page.waitForTimeout(700);
  const chip = await page
    .locator(".ef__context")
    .innerText()
    .catch(() => "");
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
  check(
    "Service row adds its chip and focuses the form",
    /Repairs/.test(chip) && focused === "name",
    `${chip} / ${focused}`,
  );

  // Spec photos fade up once on entering view.
  await page.locator(".spec").evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1900);
  const sp = await page
    .locator(".spec__photo--b")
    .evaluate((el) => [getComputedStyle(el).opacity, getComputedStyle(el).transform]);
  check(
    "Spec photos fade up and settle",
    sp[0] === "1" && (sp[1] === "none" || sp[1] === "matrix(1, 0, 0, 1, 0, 0)"),
    sp.join(" / "),
  );

  // Drawing reveals once, then holds.
  await page.locator(".svc-sec__panel").evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(3400);
  const reveal = await page.locator(".gd").getAttribute("data-reveal");
  const off = await page
    .locator(".gd-hl path")
    .last()
    .evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset));
  check("Gutter drawing reveal completes and holds", reveal === "play" && off === 0, `${reveal} / ${off}`);

  // Map: Cape Town by default; region click, callout, carry into enquiry.
  await page.locator("#areas").evaluate((el) => el.scrollIntoView({ block: "center" }));
  check("Map shows Cape Town by default", (await page.locator(".mp__card-name").innerText()) === "Cape Town");
  await page.locator(".mp__label", { hasText: "Northern Suburbs" }).click();
  const card = await page.locator(".mp__card-name").innerText();
  const sel = await page.locator(".mp__active").count();
  check("Map region click highlights and names it", card === "Northern Suburbs" && sel === 1, card);
  await page.locator(".mp__card-action").click();
  await page.waitForTimeout(700);
  const chip2 = await page.locator(".ef__context").innerText();
  check("Callout carries the area into the enquiry", /Area: Northern Suburbs/.test(chip2), chip2.replace(/\n/g, " "));

  // Suburb search: found and not found.
  await page.locator("#areas").evaluate((el) => el.scrollIntoView({ block: "center" }));
  const q = page.locator(".mp__search input");
  await q.fill("rondebosch");
  await q.press("Enter");
  const res = await page.locator(".mp__result").innerText();
  const card2 = await page.locator(".mp__card-name").innerText();
  check(
    "Suburb search finds Rondebosch in Southern Suburbs",
    /Southern Suburbs/.test(res) && card2 === "Rondebosch",
    res,
  );
  await page.locator(".mp__result .link-s").click();
  await page.waitForTimeout(700);
  const suburbVal = await page.locator('form.ef [name="suburb"]').inputValue();
  check("Search result fills the Suburb field", suburbVal === "Rondebosch", suburbVal);
  await page.locator("#areas").evaluate((el) => el.scrollIntoView({ block: "center" }));
  await q.fill("Zzyzx");
  await q.press("Enter");
  const res2 = await page.locator(".mp__result").innerText();
  check("Unknown suburb is handled honestly", /couldn.t place/.test(res2), res2.slice(0, 50));

  // FAQ toggles.
  const t1 = page.locator(".fq__q button").first();
  await t1.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await t1.click();
  const closed = await t1.getAttribute("aria-expanded");
  await t1.click();
  const open = await t1.getAttribute("aria-expanded");
  check("FAQ closes and reopens", closed === "false" && open === "true");

  // Form: empty, partial, valid demo.
  const form = page.locator("form.ef");
  await form.locator('[name="name"]').fill("");
  await form.locator('[name="suburb"]').fill("");
  await form.locator('button[type="submit"]').click();
  const errs = await form.locator(".ef__error").count();
  check("Empty submit shows errors", errs >= 3, `${errs}`);
  await form.locator('[name="name"]').fill("Thandi Mokoena");
  await form.locator('[name="contact"]').fill("082 555 0134");
  await form.locator('[name="suburb"]').fill("Rondebosch");
  await form.locator('[name="message"]').fill("Water spills over the back gutter when it rains.");
  await form.locator('button[type="submit"]').click();
  await page.waitForSelector(".ef__notice", { timeout: 8000 });
  const notice = await form.locator(".ef__notice").innerText();
  const kept = await form.locator('[name="name"]').inputValue();
  check(
    "Valid submit says Demo only and keeps values",
    /Demo only/.test(notice) && kept === "Thandi Mokoena",
    notice.slice(0, 40),
  );

  // Variations tab.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator(".sh__nav").getByRole("link", { name: "Variations" }).click();
  await page.waitForURL("**/variations");
  const cards = await page.locator(".vr__item").count();
  check("Variations tab lists both earlier homepages", cards === 2, `${cards}`);
  await page.locator(".vr__link").first().click();
  await page.waitForURL("**/variations/home-page-1");
  check("Variation opens", page.url().endsWith("/variations/home-page-1"));
  await page.locator(".site-header__brand").click();
  await page.waitForURL(base + "/");
  check("Variation logo returns to the final site", page.url() === base + "/");

  check("No console or page errors (desktop)", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}

// ---------- Mobile ----------
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check("Mobile: no horizontal scroll", over <= 0, `${over}`);
  await page.getByRole("button", { name: /Menu/ }).tap();
  check("Mobile: menu opens", await page.locator(".sh__panel").isVisible());
  await page.locator(".sh__panel").getByRole("link", { name: "Areas" }).tap();
  await page.waitForTimeout(900);
  const at = await top(page, "#areas");
  check(
    "Mobile: menu link reaches Areas and closes",
    at > -4 && at < 100 && (await page.locator(".sh__panel").isHidden()),
    `top=${at}`,
  );
  check("Mobile: Cape Town selected by default", (await page.locator(".mp__card-name").innerText()) === "Cape Town");
  await page.locator(".mp__label", { hasText: "South Peninsula" }).tap();
  check(
    "Mobile: tapping a region selects it",
    (await page.locator(".mp__card-name").innerText()) === "South Peninsula",
  );
  const fs = await page.locator('form.ef [name="name"]').evaluate((el) => getComputedStyle(el).fontSize);
  check("Mobile: inputs are 16px", fs === "16px", fs);
  const clipped = await page.locator(".mp__label, .gd-label").evaluateAll((els) =>
    els
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width && (r.left < 0 || r.right > innerWidth);
      })
      .map((el) => el.textContent),
  );
  check("Mobile: no label clipped", clipped.length === 0, clipped.join(", "));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
