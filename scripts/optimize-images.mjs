import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("local_docs/images-archive-2026-09-25");
const OUT = path.resolve("local_docs/_optimized-tmp");

function maxEdge(rel) {
  const n = rel.replaceAll("\\", "/").toLowerCase();
  if (n.includes("logo")) return 480;
  if (n.includes("hero-bg") || n.includes("services-bg")) return 1920;
  if (n.startsWith("heroes/")) return 1800;
  if (n.startsWith("sections/")) return 1600;
  return 1400;
}
function quality(rel) {
  const n = rel.replaceAll("\\", "/").toLowerCase();
  if (n.includes("logo")) return 90;
  if (n.includes("hero-bg") || n.includes("services-bg")) return 78;
  return 76;
}
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(webp|png|jpe?g)$/i.test(ent.name)) out.push(p);
  }
  return out;
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const report = [];
for (const abs of walk(SRC)) {
  const rel = path.relative(SRC, abs);
  const before = fs.statSync(abs).size;
  const edge = maxEdge(rel);
  const q = quality(rel);
  const meta = await sharp(abs, { failOn: "none" }).metadata();
  const w = meta.width || edge;
  const h = meta.height || edge;
  const longest = Math.max(w, h);
  const scale = longest > edge ? edge / longest : 1;
  const tw = Math.max(1, Math.round(w * scale));
  const th = Math.max(1, Math.round(h * scale));
  const isLogo = /logo\.png$/i.test(rel);
  const outRel = isLogo ? rel : rel.replace(/\.(png|jpe?g)$/i, ".webp");
  const outAbs = path.join(OUT, outRel);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });

  let pipeline = sharp(abs, { failOn: "none" }).rotate().resize({
    width: tw, height: th, fit: "inside", withoutEnlargement: true,
  });
  pipeline = isLogo
    ? pipeline.png({ compressionLevel: 9, palette: true })
    : pipeline.webp({ quality: q, effort: 6 });
  await pipeline.toFile(outAbs);

  // Also copy SOURCES.md etc later
  const after = fs.statSync(outAbs).size;
  report.push({
    file: outRel.replaceAll("\\", "/"),
    from: `${w}x${h}`,
    to: `${tw}x${th}`,
    beforeKb: Math.round(before / 1024),
    afterKb: Math.round(after / 1024),
    savedPct: Math.round((1 - after / before) * 100),
  });
}

// Copy non-image files (SOURCES.md)
function walkAll(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkAll(p, out);
    else out.push(p);
  }
  return out;
}
for (const abs of walkAll(SRC)) {
  if (/\.(webp|png|jpe?g)$/i.test(abs)) continue;
  const rel = path.relative(SRC, abs);
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(abs, dest);
}

const beforeTotal = report.reduce((s, r) => s + r.beforeKb, 0);
const afterTotal = report.reduce((s, r) => s + r.afterKb, 0);
console.table(report);
console.log(`\nTotal: ${beforeTotal} KB → ${afterTotal} KB (−${Math.round((1 - afterTotal / beforeTotal) * 100)}%)`);
