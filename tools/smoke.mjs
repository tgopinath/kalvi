// Smoke test: start every game in EN and Tamil, both bands, at 375px; report page errors; save screenshots to .work/shots/smoke-*.png
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire('/Users/gopi-4423/Documents/kanal/package.json'); const { chromium } = require('playwright');
const B = 'http://localhost:5330/', out = '.work/shots'; fs.mkdirSync(out, { recursive: true });
const prof = (lang, band) => JSON.stringify({ profiles: [{ id: 'cs', name: 'Anu', band, avatar: 'cube', color: '#16a39c', lang, created: 1, updated: 1, subjects: { maths: { skills: {}, review: {}, lessons: {} }, english: { skills: {}, review: {}, lessons: {} }, science: { skills: {}, review: {}, lessons: {} }, world: { skills: {}, review: {}, lessons: {} } }, days: {}, sessions: [], settings: { rate: .9 } }], current: 'cs', updated: 1 });
const games = (process.argv[2] || 'DRAW.game("maths"),DRAW.game("english"),DRAW.game("science"),MUSIC.game("maths"),MUSIC.game("science"),MUSIC.game("english"),STORIES.game,WORDPZ.game,BEE.game,PUZZLES.game,SCIENCE.quizGame,MEMORY.game("science")').split(',');
const br = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); const errs = [];
for (const lang of ['en', 'ta']) for (const band of ['young', 'older']) for (const g of games) {
  const ctx = await br.newContext({ viewport: { width: 375, height: 812 } }); const pg = await ctx.newPage();
  const tag = `${g.replace(/\W+/g, '_')}-${lang}-${band}`;
  pg.on('pageerror', e => errs.push(`${tag}: ${e.message}`)); pg.on('console', m => m.type() === 'error' && !/404|favicon|Failed to load resource/.test(m.text()) && errs.push(`${tag}: ${m.text()}`));
  await pg.addInitScript(p => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.setItem('kalvi.v1', p); } }, prof(lang, band));
  await pg.goto(B + '#/'); await pg.waitForTimeout(700);
  try { await pg.evaluate(`(${g}).start(Store.current())`); } catch (e) { errs.push(`${tag}: start ${e.message}`); }
  await pg.waitForTimeout(1200);
  // try: press hint, pick first choice/tile, check
  await pg.evaluate(() => { document.querySelector('.hintbtn')?.click(); document.querySelector('.choice, .tile:not([disabled]), .numpad [data-k="3"]')?.click(); const c = document.querySelector('.checkbtn'); if (c && !c.disabled) c.click(); }).catch(e => errs.push(`${tag}: ${e.message}`));
  await pg.waitForTimeout(900);
  if (band === 'young') await pg.screenshot({ path: `${out}/smoke-${tag}.png` });
  await ctx.close();
}
await br.close(); console.log(errs.length ? errs.join('\n') : 'no errors');
