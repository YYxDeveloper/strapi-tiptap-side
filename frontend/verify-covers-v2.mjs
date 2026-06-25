// E2E: verify all 3 article covers render correctly (new hash, new images)
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT_DIR = "/tmp/cover-e2e-v2";

const PAGES = [
  { name: "home", url: "/" },
  { name: "blog-tech", url: "/blog/why-apple-silicon-changed-everything" },
  { name: "blog-design", url: "/blog/less-is-more-apple-design-philosophy" },
  { name: "blog-life", url: "/blog/my-mac-productivity-toolkit" },
  { name: "category-tech", url: "/category/tech" },
  { name: "category-design", url: "/category/design" },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  const results = [];
  for (const p of PAGES) {
    const url = BASE + p.url;
    console.log(`\n=== ${p.name}: ${url} ===`);
    try {
      const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      const status = resp?.status();
      await page.waitForTimeout(800);

      // Get all cover images
      const allImgs = await page.$$eval("img", (els) =>
        els.map((i) => ({
          src: i.src || i.getAttribute("src") || "",
          natural: `${i.naturalWidth}x${i.naturalHeight}`,
          naturalRatio: i.naturalWidth > 0 ? (i.naturalWidth / i.naturalHeight).toFixed(3) : "n/a",
          rendered: (() => { const r = i.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; })(),
          renderedRatio: (() => { const r = i.getBoundingClientRect(); return r.height > 0 ? (r.width / r.height).toFixed(3) : "n/a"; })(),
          alt: i.alt,
        })),
      );
      const coverImgs = allImgs.filter((i) => /uploads\/cover/.test(i.src));
      const broken = allImgs.filter((i) => i.natural === "0x0" && i.src);
      const wrongRatio = coverImgs.filter((i) => i.renderedRatio !== "n/a" && Math.abs(parseFloat(i.renderedRatio) - parseFloat(i.naturalRatio)) > 0.01);

      console.log(`  status: ${status}`);
      console.log(`  cover imgs: ${coverImgs.length}`);
      coverImgs.forEach((i) => {
        const m = Math.abs(parseFloat(i.renderedRatio) - parseFloat(i.naturalRatio)) < 0.01 ? "✅" : "❌";
        console.log(`    ${m} ${i.src.split("/").pop()} natural=${i.naturalRatio} rendered=${i.renderedRatio} alt=${i.alt?.slice(0,20)}`);
      });
      if (broken.length) console.log(`  ❌ broken:`, broken);
      if (wrongRatio.length) console.log(`  ❌ wrong ratio:`, wrongRatio);

      const shot = path.join(OUT_DIR, `${p.name}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      console.log(`  📸 ${shot}`);
      results.push({ name: p.name, url, status, coverImgs: coverImgs.length, broken: broken.length, wrongRatio: wrongRatio.length });
    } catch (e) {
      console.log(`  ❌ error: ${e.message}`);
      results.push({ name: p.name, url, error: e.message });
    }
  }

  await context.close();
  await browser.close();

  // Rename webm
  const videos = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".webm"));
  if (videos[0]) {
    const old = path.join(OUT_DIR, videos[0]);
    const nu = path.join(OUT_DIR, "cover-e2e-v2.webm");
    fs.renameSync(old, nu);
    console.log(`\n🎥 webm: ${nu}`);
  }
  console.log("\n=== Summary ===");
  console.table(results);

  const total = results.length;
  const pass = results.filter((r) => r.status === 200 && r.broken === 0 && r.wrongRatio === 0).length;
  console.log(`\n${pass}/${total} pages pass (status 200, 0 broken, 0 wrong ratio)`);
  process.exit(pass === total ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
