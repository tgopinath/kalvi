// node tools/age-shots.mjs → .work/shots/age-*.png, pf-*.png, today-*.png
import { createRequire } from 'node:module'; const require = createRequire('/Users/gopi-4423/Documents/kanal/package.json'); const { chromium } = require('playwright');
const B = process.env.KALVI_URL || 'http://localhost:5330/', O = '.work/shots/';
const sub = () => ({ skills: {}, review: {}, lessons: {} });
const db = age => JSON.stringify({ profiles: [{ id: 'a' + age, name: 'Anu', age, color: '#0c7777', created: 1, updated: 1, subjects: { maths: sub(), english: sub(), science: sub(), world: sub() }, days: {}, sessions: [], settings: { rate: .9 } }], current: 'a' + age, updated: 1 });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
async function page(w, h, data, lang = 'en') {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }), p = await ctx.newPage();
  await p.addInitScript(([x, l]) => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.clear(); if (x) localStorage.setItem('kalvi.v1', x); localStorage.setItem('kalvi.lang', l); localStorage.setItem('kalvi.guide.seen', '1'); } }, [data, lang]);
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.errs = errs; return [ctx, p];
}
const run = (p, js) => p.evaluate(`(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms)); ${js}})()`);
// first-run age screen
{ const [c, p] = await page(375, 812, null); await p.goto(B); await p.waitForTimeout(1500); await p.screenshot({ path: O + 'age-firstrun.png' }); await c.close(); }
// same maths question for 3, 6, 9: compare skill, same seed, the level each age starts at
for (const age of [3, 6, 9]) { const [c, p] = await page(375, 812, db(age)); await p.goto(B + '#/'); await p.waitForTimeout(1200);
  await run(p, `const pr=Store.current(), sk=Engine.SK['m.count']; Engine.start({items:[{skill:'m.count',lvl:AGE.startLevel(pr,sk),seed:7}],title:'Counting',subject:'maths',back:'#/'}); await s(1200)`);
  await p.screenshot({ path: O + `age-q-${age}.png` }); console.log(age, p.errs); await c.close(); }
// class line in grown-ups
{ const [c, p] = await page(375, 812, db(8)); await p.goto(B + '#/'); await p.waitForTimeout(1000); await run(p, `location.hash='#/parent'; await s(500); const h=document.querySelector('.gatecard h1'); const [a,b2]=h.textContent.match(/\\d+/g).map(Number); document.querySelector('#gateIn').value=a+b2; document.querySelector('#gateForm').requestSubmit(); await s(900); [...document.querySelectorAll('main *')].find(e=>/Class \\d level/.test(e.textContent)&&e.children.length<3)?.scrollIntoView({block:'center'})`);
  await p.waitForTimeout(600); await p.screenshot({ path: O + 'age-classline.png' }); await c.close(); }
// profile form EN/TA at 375 and 1440, chip 6 selected
for (const lang of ['en', 'ta']) for (const [w, h, n] of [[375, 1100, '375'], [1440, 1000, 'desktop']]) { const [c, p] = await page(w, h, db(6), lang); await p.goto(B + '#/'); await p.waitForTimeout(1000);
  await run(p, `location.hash='#/parent'; await s(500); const h=document.querySelector('.gatecard h1'); const [a,b2]=h.textContent.match(/\\d+/g).map(Number); document.querySelector('#gateIn').value=a+b2; document.querySelector('#gateForm').requestSubmit(); await s(700); location.hash='#/profile/new'; await s(800); document.querySelector('#pname').value='Kavin'; document.querySelector('[data-age="6"]').click(); await s(400)`);
  await p.screenshot({ path: O + `pf-${lang}-${n}.png` }); console.log('pf', lang, n, p.errs); await c.close(); }
// Today
for (const [w, h, n] of [[375, 812, '375'], [1440, 900, 'desktop']]) { const [c, p] = await page(w, h, db(6)); await p.goto(B + '#/'); await p.waitForTimeout(1800); await p.screenshot({ path: O + `today-${n}.png` }); await c.close(); }
await b.close();
