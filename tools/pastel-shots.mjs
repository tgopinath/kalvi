// node tools/pastel-shots.mjs before|after → .work/shots/pastel/<state>-<screen>-<375|1440>.png
import { createRequire } from 'node:module'; const require = createRequire('/Users/gopi-4423/Documents/All pets/kanal/package.json'); const { chromium } = require('playwright');
const st = process.argv[2] || 'after', B = process.env.KALVI_URL || 'http://localhost:5330/', O = '.work/shots/pastel/';
const sk = (lvl, m, n) => ({ lvl, m, n, ok: Math.round(n * m), run: 0, miss: 0 });
const db = lang => JSON.stringify({ profiles: [{ id: 'ps', name: lang === 'ta' ? 'அனு' : 'Anu', age: 6, color: '#0c7777', created: 1, updated: 1,
  subjects: { maths: { skills: { 'm.count': sk(2, .9, 12), 'm.compare': sk(2, .7, 8), 'm.add10': sk(1, .5, 6) }, review: {}, lessons: {} }, english: { skills: { 'e.sound': sk(1, .6, 6) }, review: {}, lessons: {} }, science: { skills: {}, review: {}, lessons: {} }, world: { skills: {}, review: {}, lessons: {} } },
  days: { '2026-11-22': 6, '2026-11-23': 9, '2026-11-24': 4 }, sessions: [{ subject: 'maths', topic: 'count', mode: 'topic', n: 8, right: 7, ms: 240000, date: '2026-11-23', at: 1 }], settings: { rate: .9 }, extras: { stickers: 99 } }], current: 'ps', updated: 1 });
const gate = `location.hash='#/parent'; await s(600); const h=document.querySelector('.gatecard h1'); if(h){const [a,b]=h.textContent.match(/\\d+/g).map(Number); document.querySelector('#gateIn').value=a+b; document.querySelector('#gateForm').requestSubmit(); await s(900);}`;
const SHOTS = {
  today: `location.hash='#/'; await s(900)`,
  maths: `location.hash='#/s/maths'; await s(900)`,
  english: `location.hash='#/s/english'; await s(900)`,
  question: `Engine.start({items:[{skill:'m.compare',lvl:1,seed:4}],title:'q',subject:'maths',back:'#/s/maths'}); await s(800); const q=Engine.round.q; document.querySelectorAll('.choice')[q.choices.findIndex(c=>c.v===q.answer)]?.click(); await s(200); document.querySelector('.checkbtn')?.click(); await s(1400)`,
  game: `MEMORY.game('maths').start(Store.current()); await s(900); const c=[...document.querySelectorAll('.mem-card')]; c[0]?.click(); await s(300); c[1]?.click(); await s(900)`,
  grownups: gate + `await s(300)`,
  profile: gate + `location.hash='#/profile/new'; await s(800); document.querySelector('#pname').value='Kavin'; document.querySelector('[data-age="6"]')?.click(); await s(400)`,
};
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const only = process.argv[3]?.split(',');
for (const [n, js] of Object.entries(SHOTS)) { if (only && !only.includes(n)) continue; for (const [w, h, lang, tag] of [[375, 812, 'en', '375'], [1440, 900, 'en', '1440'], [375, 812, 'ta', 'ta-375']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }), p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(([x, l]) => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.clear(); localStorage.setItem('kalvi.v1', x); localStorage.setItem('kalvi.lang', l); localStorage.setItem('kalvi.guide.seen', '1'); } }, [db(lang), lang]);
  await p.goto(B + '#/'); await p.waitForTimeout(1200);
  await p.evaluate(`(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms)); ${js}})()`); await p.waitForTimeout(500);
  await p.evaluate(() => { document.getElementById('guide')?.remove(); document.querySelector('.sticker-modal')?.remove(); });
  await p.screenshot({ path: `${O}${st}-${n}-${tag}.png` }); if (errs.length) console.log(n, tag, errs); await ctx.close(); } }
await b.close(); console.log('done', st);
