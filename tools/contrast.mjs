// WCAG contrast for every Kalvi Pastel token pair that carries text. Reads the values from css/pastel.css. node tools/contrast.mjs
import fs from 'node:fs';
const css = fs.readFileSync(new URL('../css/pastel.css', import.meta.url), 'utf8'), T = {};
for (const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})\b/gi)) T[m[1]] ??= m[2].toLowerCase();
T.white = '#ffffff';
const L = h => { const c = h.slice(1).match(/\w\w/g).map(x => parseInt(x, 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const cr = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
const grounds = ['lav', 'lav-2', 'cream', 'butter', 'white', 'surface-sunken', 'pink', 'yellow', 'mint', 'sky', 'lilac', 'peach', 'primary-soft',
  ...['maths', 'english', 'science', 'world'].flatMap(s => [s + '-soft', s])];
const pairs = [];
for (const f of ['ink', 'ink-2', 'ink-muted']) for (const g of grounds) pairs.push([f, g, 4.5]);                       // body and label text on every pastel
for (const s of ['maths', 'english', 'science', 'world']) pairs.push([s + '-deep', s + '-soft', 4.5], [s + '-deep', 'white', 4.5], ['white', s + '-deep', 4.5]); // deep shade as text and as a button
pairs.push(['white', 'purple', 4.5], ['white', 'primary-hover', 4.5], ['primary-text', 'white', 4.5], ['primary-text', 'lav', 4.5], ['white', 'plum', 4.5], ['board-ink', 'board', 4.5], ['ink-muted', 'surface-sunken', 4.5]);
let bad = 0, low = [99];
for (const [f, b, need] of pairs) { const r = cr(T[f], T[b]); if (r < low[0]) low = [r, f, b]; if (r < need) { bad++; console.log(`LOW ${r.toFixed(2)} ${f} on ${b}`); } }
console.log(`${pairs.length} pairs, ${bad} below AA; lowest ${low[0].toFixed(2)} (${low[1]} on ${low[2]})`); process.exit(bad ? 1 : 0);
