// Verify img-hover-zoom utility works (defaults + group-hover + parameter override)
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const img = page.locator("img.img-hover-zoom").first();
const card = page.locator("a.group").first();
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);

// === Test 1: defaults (no hover) ===
const before = await img.evaluate((el) => {
  const cs = getComputedStyle(el);
  return { scale: cs.scale, transitionDuration: cs.transitionDuration };
});
console.log(`[Test 1] Before hover (defaults):`);
console.log(`  scale = ${before.scale} (expected 'none' or '1')`);
console.log(`  transitionDuration = ${before.transitionDuration} (expected '0.5s')`);

// === Test 2: hover the card (group trigger) ===
await card.hover();
await page.waitForTimeout(700);
const after = await img.evaluate((el) => getComputedStyle(el).scale);
console.log(`\n[Test 2] After hovering card (group-hover):`);
console.log(`  scale = ${after} (expected 1.1)`);
const test2Pass = Math.abs(parseFloat(after) - 1.1) < 0.01;

// === Test 3: parameter override (apply custom scale via inline style) ===
await page.evaluate(() => {
  const img = document.querySelector("img.img-hover-zoom");
  if (img) {
    img.style.setProperty("--hover-zoom-scale", "1.5");
    img.style.setProperty("--hover-zoom-duration", "200ms");
  }
});
// Move mouse away to reset hover
await page.mouse.move(0, 0);
await page.waitForTimeout(300);
const custom = await img.evaluate((el) => {
  const cs = getComputedStyle(el);
  return { scale: cs.scale, transitionDuration: cs.transitionDuration };
});
console.log(`\n[Test 3] Custom parameters (--hover-zoom-scale=1.5, --hover-zoom-duration=200ms):`);
console.log(`  scale (no hover) = ${custom.scale} (expected 1)`);
console.log(`  transitionDuration = ${custom.transitionDuration} (expected 0.2s)`);

// Re-hover to see custom scale
await card.hover();
await page.waitForTimeout(400);
const customHover = await img.evaluate((el) => getComputedStyle(el).scale);
console.log(`  scale (hover) = ${customHover} (expected 1.5)`);
const test3Pass = Math.abs(parseFloat(customHover) - 1.5) < 0.01;

await browser.close();

console.log(`\n=== Summary ===`);
console.log(`  Test 1 (defaults): ${before.transitionDuration === "0.5s" ? "✅" : "❌"}`);
console.log(`  Test 2 (group-hover): ${test2Pass ? "✅" : "❌"}`);
console.log(`  Test 3 (param override): ${test3Pass ? "✅" : "❌"}`);
process.exit(test2Pass && test3Pass ? 0 : 1);
