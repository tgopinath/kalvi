// Download vetted pictures once and bundle them as small WebP files so the app works offline and in the APK.
//   node tools/bundle-photos.mjs pics     → img/pics/<word>.webp from js/pics.js (remote URLs), rewrites js/pics.js to local paths
//   node tools/bundle-photos.mjs photos   → img/photos/<key>.webp from .work/photo-picks.json, writes js/photos.js
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { createRequire } from 'node:module';
const require = createRequire('/Users/gopi-4423/Documents/kanal/package.json'); const sharp = require('sharp');
const ROOT = path.resolve(import.meta.dirname, '..'), sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh) KalviBuild/0.1 (gopinath.t portfolio; github.com/tgopinath)' };
async function grab(url, out) {
  for (let a = 0; a < 6; a++) { const r = await fetch(url, { headers: UA }); if (r.status === 429) { await sleep(15000 * (a + 1)); continue; } if (!r.ok) throw new Error(r.status + ' ' + url);
    const buf = Buffer.from(await r.arrayBuffer()); await sharp(buf).rotate().resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true }).webp({ quality: 68 }).toFile(out); return fs.statSync(out).size; }
  throw new Error('rate limited ' + url);
}
const mode = process.argv[2];
if (mode === 'pics') {
  const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/pics.js'), 'utf8'), ctx); const P = ctx.window.PICS;
  fs.mkdirSync(path.join(ROOT, 'img/pics'), { recursive: true }); let total = 0;
  for (const [w, v] of Object.entries(P)) { const out = path.join(ROOT, 'img/pics', w + '.webp'); if (!v.src.startsWith('http')) continue; if (!fs.existsSync(out)) { total += await grab(v.src, out); await sleep(400); } v.remote = v.src; v.src = `img/pics/${w}.webp`; }
  fs.writeFileSync(path.join(ROOT, 'js/pics.js'), '// Vetted pictures for English words: Wikipedia lead images and hand-picked Commons photos (tools/find-pics.py, tools/commons-search.py),\n// each checked on a contact sheet, bundled as 480px WebP by tools/bundle-photos.mjs (credit + source page kept for every one).\nwindow.PICS = ' + JSON.stringify(P, null, 0) + ';\n');
  console.log('pics bundled, new bytes', total);
} else if (mode === 'photos') {
  const picks = JSON.parse(fs.readFileSync(path.join(ROOT, '.work/photo-picks.json'), 'utf8')); fs.mkdirSync(path.join(ROOT, 'img/photos'), { recursive: true });
  const out = {}; let total = 0;
  for (const [k, c] of Object.entries(picks)) { const f = path.join(ROOT, 'img/photos', k + '.webp'); if (!fs.existsSync(f)) { total += await grab(c.thumb, f); await sleep(400); } out[k] = { src: `img/photos/${k}.webp`, credit: [c.artist, c.lic].filter(Boolean).join(' · ') || 'Wikimedia Commons', page: c.page }; }
  fs.writeFileSync(path.join(ROOT, 'js/photos.js'), '// Shared photo set for Science, World, Maths and games: Wikipedia lead images and Commons photos, each vetted on a contact sheet\n// (tools/photo-cands.py → .work/photo-sheet-*.jpg), bundled as 480px WebP. Every entry keeps its credit and source page.\nwindow.PHOTOS = ' + JSON.stringify(out, null, 0) + ';\n');
  console.log('photos bundled', Object.keys(out).length, 'new bytes', total);
}
if (mode === 'rewrite') { // node tools/bundle-photos.mjs rewrite js/gk-data.js img/gk → bundle every upload.wikimedia.org image the file uses
  const [file, dir] = process.argv.slice(3); fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
  let src = fs.readFileSync(path.join(ROOT, file), 'utf8'); const urls = [...new Set(src.match(/https:\/\/upload\.wikimedia\.org\/[^'"\s)]+/g) || [])]; let total = 0;
  for (const u of urls) { const name = decodeURIComponent(u.split('/').pop()).replace(/^\d+px-/, '').replace(/[^\w.-]+/g, '_').replace(/\.\w+$/, '').slice(0, 60) + '.webp', out = path.join(ROOT, dir, name);
    try { if (!fs.existsSync(out)) { total += await grab(u, out); await sleep(500); } src = src.split(u).join(`${dir}/${name}`); } catch (e) { console.log('skip', u, e.message); } }
  fs.writeFileSync(path.join(ROOT, file), src); console.log('rewrote', urls.length, 'images, new bytes', total);
}
