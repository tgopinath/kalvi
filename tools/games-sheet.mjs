// node tools/games-sheet.mjs <tag> → .work/shots/pastel/games-<tag>.png (every game's first screen at 375, EN)
import { createRequire } from 'node:module'; const require = createRequire('/Users/gopi-4423/Documents/All pets/kanal/package.json'); const { chromium } = require('playwright');
const tag = process.argv[2] || 'after';
const G = ['MATHSQUIZ.game', 'PUZZLES.game', 'CODING.game', 'WORDPZ.game', 'TYPING.game', 'MUSIC.game("maths")', 'DRAW.game("english")', 'STORIES.game', 'BEE.game', 'ENGQUIZ.game', 'SCIPZ.game', 'LAB.game', 'VIDEOS.game', 'GEO.game', 'GK.game', 'SCIENCE.quizGame'];
const sub = () => ({ skills: {}, review: {}, lessons: {} }), db = JSON.stringify({ profiles: [{ id: 'g', name: 'Anu', age: 9, color: '#0c7777', created: 1, updated: 1, subjects: { maths: sub(), english: sub(), science: sub(), world: sub() }, days: {}, sessions: [], settings: { rate: .9 }, extras: { stickers: 99 } }], current: 'g', updated: 1 });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); const files = [];
for (const g of G) { const p = await b.newPage({ viewport: { width: 375, height: 812 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(x => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.setItem('kalvi.v1', x); localStorage.setItem('kalvi.guide.seen', '1'); } }, db);
  await p.goto('http://localhost:5330/#/'); await p.waitForTimeout(1000); await p.evaluate(`(${g}).start(Store.current())`).catch(e => errs.push(String(e).slice(0, 80))); await p.waitForTimeout(1300);
  await p.evaluate(() => { document.getElementById('guide')?.remove(); }); const f = `/tmp/gm-${files.length}.png`; await p.screenshot({ path: f }); files.push([f, g]); if (errs.length) console.log(g, errs); await p.close(); }
await b.close(); console.log(JSON.stringify(files));
