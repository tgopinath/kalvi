// Render icon.svg to the PNG app icons (uses sharp from the kanal project's node_modules).
import { createRequire } from 'node:module'; const require = createRequire('/Users/gopi-4423/Documents/kanal/package.json');
const sharp = require('sharp'); const fs = await import('node:fs');
const svg = fs.readFileSync(new URL('../icon.svg', import.meta.url));
for (const s of [192, 512]) await sharp(svg).resize(s, s).png().toFile(new URL(`../icon-${s}.png`, import.meta.url).pathname);
await sharp(svg).resize(1024, 1024).png().toFile(new URL('../icon-1024.png', import.meta.url).pathname);
console.log('icons ok');
