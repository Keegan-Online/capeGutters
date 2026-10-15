// Behaviour checks for both homepages. Run with the dev server up:
//   node scripts/check.mjs [baseUrl]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3217";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

const browser = await chromium.launch({ channel: "chrome" });

// ---------- Desktop ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(base + "/", { waitUntil: "networkidle" });
  check("/ opens Home page 1", page.url().endsWith("/home-page-1"), page.url());

  for (const variant of ["1", "2"]) {
    await page.goto(`${base}/home-page-${variant}`, { waitUntil: "networkidle" });
    const header = page.locator(".site-header");
    const current = await header.locator('.site-header__nav [aria-current="page"]').innerText();
    check(`P${variant}: active version marked in header`, current.trim() === `Home page ${variant}`, current);

    // Nav anchors
    for (const [label, id] of [
      ["Services", "services"],
      ["Areas", "areas"],
      ["FAQs", "faqs"],
    ]) {
      await header.getByRole("link", { name: label, exact: true }).click();
      await page.waitForTimeout(900);
      const top = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
      check(`P${variant}: nav "${label}" scrolls to its section`, top > -4 && top < 130, `top=${Math.round(top)}`);
    }
    await header.getByRole("link", { name: /Request a quote/ }).click();
    await page.waitForTimeout(900);
    const qTop = await page.locator("#quote").evaluate((el) => el.getBoundingClientRect().top);
    check(`P${variant}: header quote action reaches the form`, qTop > -4 && qTop < 130, `top=${Math.round(qTop)}`);

    // Hero quote action
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator(".btn--hero").click();
    await page.waitForTimeout(900);
    const hTop = await page.locator("#quote").evaluate((el) => el.getBoundingClientRect().top);
    check(`P${variant}: hero quote action reaches the form`, hTop > -4 && hTop < 130, `top=${Math.round(hTop)}`);

    // Service row prefill
    await page.locator(".service__button").first().click();
    await page.waitForTimeout(700);
    const chip = await page
      .locator(".enquiry__context")
      .innerText()
      .catch(() => "");
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
    check(
      `P${variant}: service row adds a chip and focuses the form`,
      /Install or replace/.test(chip) && focused === "name",
      `${chip} / ${focused}`,
    );

    // Map: mouse select, readout, action
    await page.locator("#areas").scrollIntoViewIfNeeded();
    const label = page.locator(".map-label", { hasText: "Southern Suburbs" });
    await label.click();
    const readout = await page.locator(".areas__picked-name").innerText();
    const selectedPath = await page.locator('.map-region[data-state="selected"]').count();
    check(
      `P${variant}: map click highlights and names the region`,
      readout === "Southern Suburbs" && selectedPath === 1,
      readout,
    );
    await page.getByRole("button", { name: /Use this area in my enquiry/ }).click();
    await page.waitForTimeout(700);
    const chip2 = await page.locator(".enquiry__context").innerText();
    const focused2 = await page.evaluate(() => document.activeElement?.getAttribute("name"));
    check(
      `P${variant}: area action adds Area chip and focuses Suburb`,
      /Area: Southern Suburbs/.test(chip2) && focused2 === "suburb",
      `${chip2.replace(/\n/g, " ")} / ${focused2}`,
    );

    // Map: click on an SVG region path directly
    await page.locator("#areas").evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(400);
    const box = await page.locator(".areas__stage").boundingBox();
    const capeFlats = page.locator(".map-label", { hasText: "Cape Flats" });
    const cfBox = await capeFlats.boundingBox();
    await page.mouse.click(cfBox.x - 14, cfBox.y + cfBox.height + 14);
    const readout2 = await page.locator(".areas__picked-name").innerText();
    check(
      `P${variant}: clicking the land itself selects a region`,
      readout2.length > 0 && readout2 !== "Southern Suburbs",
      readout2,
    );
    void box;

    // Map: keyboard
    await page.locator(".map-label", { hasText: "Northern Suburbs" }).focus();
    await page.keyboard.press("Enter");
    const readout3 = await page.locator(".areas__picked-name").innerText();
    check(`P${variant}: keyboard Enter selects a region`, readout3 === "Northern Suburbs", readout3);
    await page.keyboard.press("Tab");
    const nextFocus = await page.evaluate(() => document.activeElement?.className);
    check(`P${variant}: Tab moves between region buttons`, /map-label/.test(nextFocus ?? ""), nextFocus);

    // FAQ (page 1 accordion)
    if (variant === "1") {
      const toggle = page.locator(".faq__toggle").first();
      await toggle.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await toggle.locator(".faq__icon").click();
      const exp = await toggle.getAttribute("aria-expanded");
      const hidden = await page.locator(".faq__a").first().isHidden();
      await toggle.locator("span").first().click();
      const exp2 = await toggle.getAttribute("aria-expanded");
      const visible = await page.locator(".faq__a").first().isVisible();
      check("P1: FAQ toggles closed and open", exp === "false" && hidden && exp2 === "true" && visible);
    } else {
      const qs = await page.locator(".faq-col__q").count();
      check("P2: both FAQs visible", qs === 2);
    }

    // Form validation
    const form = page.locator("form.enquiry");
    await form.locator('button[type="submit"]').click();
    const errs = await form.locator(".field__error").count();
    const focusedAfter = await page.evaluate(() => document.activeElement?.getAttribute("name"));
    check(
      `P${variant}: empty submit shows 4 errors and focuses Name`,
      errs === 4 && focusedAfter === "name",
      `${errs} / ${focusedAfter}`,
    );

    await form.locator('[name="name"]').fill("Thandi Mokoena");
    await form.locator('[name="contact"]').fill("not a number");
    await form.locator('button[type="submit"]').click();
    const errs2 = await form.locator(".field__error").allInnerTexts();
    const kept = await form.locator('[name="name"]').inputValue();
    check(
      `P${variant}: partial submit keeps values and flags the rest`,
      kept === "Thandi Mokoena" && errs2.length === 3,
      errs2.join(" | "),
    );

    await form.locator('[name="contact"]').fill("082 555 0134");
    await form.locator('[name="suburb"]').fill("Rondebosch");
    await form.locator('[name="message"]').fill("Water spills over the back gutter when it rains.");
    await form.locator('button[type="submit"]').click();
    await page.waitForSelector(".notice", { timeout: 8000 });
    const notice = await form.locator(".notice").innerText();
    const keptAll = await Promise.all(
      ["name", "contact", "suburb", "message"].map((n) => form.locator(`[name="${n}"]`).inputValue()),
    );
    check(
      `P${variant}: valid submit says DEMO, nothing sent, no success`,
      /Demo only/.test(notice) && !/Sent\./.test(notice),
      notice.slice(0, 60),
    );
    check(`P${variant}: values kept after demo submit`, keptAll.every(Boolean), keptAll.join(" / "));
    const demoTag = await form.locator(".enquiry__mode").innerText();
    check(`P${variant}: form labelled DEMO before submitting`, /Demo/i.test(demoTag), demoTag);

    // Labels stay visible while typing
    const labelVisible = await form.locator(".field__label").first().isVisible();
    check(`P${variant}: field labels stay visible with content`, labelVisible);

    // Version switch
    const other = variant === "1" ? "2" : "1";
    await page.evaluate(() => window.scrollTo(0, 0));
    await page
      .locator(".site-header__nav")
      .getByRole("link", { name: `Home page ${other}` })
      .click();
    await page.waitForURL(`**/home-page-${other}`);
    check(`P${variant}: header switches to Home page ${other}`, page.url().endsWith(`/home-page-${other}`));
  }

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
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/home-page-1`, { waitUntil: "networkidle" });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check("Mobile P1: no horizontal scroll", overflow <= 0, `overflow=${overflow}`);

  await page.getByRole("button", { name: /Menu/ }).tap();
  const menuVisible = await page.locator(".mobile-menu").isVisible();
  check("Mobile: menu opens", menuVisible);
  await page.locator(".mobile-menu").getByRole("link", { name: "Home page 2" }).tap();
  await page.waitForURL("**/home-page-2");
  check("Mobile: menu switches to Home page 2", page.url().endsWith("/home-page-2"));

  const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check("Mobile P2: no horizontal scroll", overflow2 <= 0, `overflow=${overflow2}`);

  await page.getByRole("button", { name: /Menu/ }).tap();
  await page.locator(".mobile-menu").getByRole("link", { name: "Areas" }).tap();
  await page.waitForTimeout(900);
  const aTop = await page.locator("#areas").evaluate((el) => el.getBoundingClientRect().top);
  const menuClosed = await page.locator(".mobile-menu").isHidden();
  check(
    "Mobile: menu link reaches Areas and closes menu",
    aTop > -4 && aTop < 90 && menuClosed,
    `top=${Math.round(aTop)}`,
  );

  await page.locator(".map-label", { hasText: "South Peninsula" }).tap();
  const readout = await page.locator(".areas__picked-name").innerText();
  check("Mobile: tapping a region selects it", readout === "South Peninsula", readout);
  const hoverStuck = await page.locator('.map-region[data-state="hover"]').count();
  check("Mobile: no sticky hover after tap", hoverStuck === 0, `hover=${hoverStuck}`);

  const inputSize = await page.locator('form.enquiry [name="name"]').evaluate((el) => getComputedStyle(el).fontSize);
  check("Mobile: inputs are 16px (no iOS zoom)", inputSize === "16px", inputSize);

  // All labels inside the viewport
  const clipped = await page.locator(".map-label").evaluateAll((els) =>
    els
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.left < 0 || r.right > window.innerWidth;
      })
      .map((el) => el.textContent),
  );
  check("Mobile: no map label clipped", clipped.length === 0, clipped.join(", "));

  check("No page errors (mobile)", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}

// ---------- Reduced motion ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/home-page-2`, { waitUntil: "networkidle" });
  await page.locator(".map-label", { hasText: "Cape Town" }).click();
  const dur = await page.locator(".map-active").evaluate((el) => getComputedStyle(el).animationDuration);
  check("Reduced motion: map highlight has no animation", parseFloat(dur) < 0.01, dur);
  const sb = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  check("Reduced motion: no smooth scrolling", sb === "auto", sb);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
