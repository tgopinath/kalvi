// node tools/redesign-shots.mjs before|after → .work/shots/rd-<state>-<view>-<lang>-<w>.png
import { createRequire } from 'node:module'; const require = createRequire('/Users/gopi-4423/Documents/kanal/package.json'); const { chromium } = require('playwright');
const st = process.argv[2] || 'before', B = process.env.KALVI_URL || 'http://localhost:5330/';
const prof = (lang, age) => JSON.stringify({ profiles: [{ id: 'cs', name: lang === 'ta' ? 'அனு' : 'Anu', age, band: age >= 7 ? 'older' : 'young', color: '#0c7777', created: 1, updated: 1, subjects: { maths: { skills: { 'm.count': { lvl: 1, m: .9, n: 10, ok: 9, run: 0, miss: 0 }, 'm.after': { lvl: 1, m: .9, n: 10, ok: 9, run: 0, miss: 0 }, 'm.compare': { lvl: 1, m: .88, n: 9, ok: 8, run: 0, miss: 0 }, 'm.blocks': { lvl: 1, m: .4, n: 3, ok: 2, run: 0, miss: 0 } }, review: {}, lessons: { count: '2026-11-09' } }, english: { skills: {}, review: {}, lessons: {} }, science: { skills: {}, review: {}, lessons: {} }, world: { skills: {}, review: {}, lessons: {} } }, days: { '2026-11-09': 4, [new Date().toISOString().slice(0, 10)]: 3 }, sessions: [], settings: { rate: .9 } }], current: 'cs', updated: 1 });
const views = { today: ['#/', ''], maths: ['#/s/maths', ''], practice: ['#/', `Engine.start({items:[{skill:'m.add10',lvl:1,seed:4}],title:'Addition',subject:'maths',back:'#/'})`] };
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const lang of ['en', 'ta']) for (const w of [1440, 375]) for (const [v, [h, js]] of Object.entries(views)) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 1000 ? 900 : 812 } }), p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(([x, l]) => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.setItem('kalvi.v1', x); localStorage.setItem('kalvi.lang', l); } }, [prof(lang, 5), lang]);
  await p.goto(B + h); await p.waitForTimeout(900); if (js) { await p.evaluate(js); await p.waitForTimeout(900); }
  await p.screenshot({ path: `.work/shots/rd-${st}-${v}-${lang}-${w}.png` }); if (errs.length) console.log(v, lang, w, errs); await ctx.close();
}
{ const ctx = await b.newContext({ viewport: { width: 375, height: 812 } }), p = await ctx.newPage(); await p.addInitScript(x => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.setItem('kalvi.v1', x); } }, prof('en', 3)); await p.goto(B + '#/s/maths'); await p.waitForTimeout(900); await p.screenshot({ path: `.work/shots/rd-${st}-age3-maths.png` }); await ctx.close(); }
await b.close(); console.log('done');
