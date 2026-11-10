// Screenshots with headless Chromium (playwright from ../kanal). Needs the preview server on :5330.
//   node tools/shots.mjs verify   → .work/shots/core-*.png (phone, EN + Tamil)
//   node tools/shots.mjs card     → prototype/shots/*.jpg (600-wide phone JPEGs) + prototype/shots/web-desktop.jpg (1440×900)
import { createRequire } from 'node:module'; import fs from 'node:fs'; import path from 'node:path';
const require = createRequire('/Users/gopi-4423/Documents/kanal/package.json'); const { chromium } = require('playwright');
const ROOT = path.resolve(import.meta.dirname, '..'), BASE = process.env.KALVI_URL || 'http://localhost:5330/';
const mode = process.argv[2] || 'verify';
const profile = (lang, band = 'young', extra = {}) => JSON.stringify({ profiles: [{ id: 'cshot', name: lang === 'ta' ? 'அனு' : 'Anu', band, avatar: 'cone', color: '#16a39c', lang, created: 1, updated: 1,
  subjects: { maths: { skills: { 'm.count': { lvl: 2, m: .9, n: 12, ok: 11, run: 0, miss: 0 }, 'm.add10': { lvl: 2, m: .62, n: 9, ok: 6, run: 0, miss: 0 }, 'm.after': { lvl: 1, m: .4, n: 4, ok: 2, run: 0, miss: 0 } }, review: { 'm.make10|1|11': { box: 0, due: '2020-01-01', skill: 'm.make10', lvl: 1, seed: 11, miss: 2 } }, lessons: { count: '2026-11-09' } },
    english: { skills: { 'e.sound': { lvl: 1, m: .7, n: 8, ok: 6, run: 0, miss: 0 } }, review: {}, lessons: {} }, science: { skills: { 's.magnets': { lvl: 1, m: .5, n: 4, ok: 2, run: 0, miss: 0 } }, review: {}, lessons: {} } },
  days: { '2026-11-08': 6, '2026-11-09': 9, '2026-11-10': 5 }, sessions: [{ subject: 'maths', topic: 'add', mode: 'topic', n: 8, right: 6, ms: 300000, date: '2026-11-09', at: 1 }], warmup: null, settings: { rate: .9 }, extras: { stickers: 99 }, ...extra }], current: 'cshot', updated: 1 });
const SHOTS = {
  verify: [
    ['home', '#/', null], ['profile-new', '#/profile/new', null, { fresh: true }], ['lesson-add', '#/t/maths/add', null],
    ['practice', '#/', `Engine.start({items:[{skill:'m.make10',lvl:1,seed:11}],title:t('m.topic.add.title'),subject:'maths',back:'#/'})`],
    ['practice-card', '#/', `Engine.start({items:[{skill:'m.make10',lvl:1,seed:11}],title:t('m.topic.add.title'),subject:'maths',back:'#/'}); await sleep(400); document.querySelectorAll('.numpad [data-k="1"]').forEach(b=>b.click()); document.querySelector('.numpad [data-k="4"]').click(); document.querySelector('.checkbtn').click(); await sleep(4500); document.querySelector('.lessoncard').scrollIntoView()`],
    ['puzzle-ladder', '#/', `Engine.start({items:[{skill:'pz.path',lvl:2,seed:7}],title:t('pz.title'),subject:'maths',back:'#/'}); await sleep(400); for (let i=0;i<3;i++) document.querySelector('.hintbtn').click(); document.querySelector('#hints').scrollIntoView({block:'end'})`],
    ['puzzle-card', '#/', `Engine.start({items:[{skill:'pz.balance',lvl:1,seed:3}],title:t('pz.title'),subject:'maths',back:'#/'}); await sleep(400); document.querySelector('.numpad [data-k="9"]').click(); document.querySelector('.checkbtn').click(); await sleep(3000); document.querySelector('.lessoncard').scrollIntoView()`],
    ['science-topic', '#/t/science/magnets', null], ['science-quiz-card', '#/', `SCIENCE.quizGame.start(Store.current()); await sleep(500); document.querySelector('.choice').click(); document.querySelector('.checkbtn').click(); await sleep(3500); document.querySelector('.lessoncard').scrollIntoView()`],
    ['english-vocab', '#/t/english/vocab', null], ['english-practice', '#/', `Engine.start({items:[{skill:'e.pic',lvl:1,seed:5}],title:'English',subject:'english',back:'#/'})`],
    ['memory-mid', '#/', `MEMORY.game('english').start(Store.current()); await sleep(600); const c=[...document.querySelectorAll('.mem-card')]; const a=G=>0; c[0].click(); await sleep(150); c[1].click(); await sleep(1400); c[2].click()`],
    ['memory-recap', '#/', `MEMORY.game('maths').start(Store.current()); await sleep(600); for (let k=0;k<12;k++){ const cs=[...document.querySelectorAll('.mem-card:not(.done)')]; if(!cs.length)break; const first=cs[0]; first.click(); await sleep(60); /* find its pair by trying */ for (const o of [...document.querySelectorAll('.mem-card:not(.done):not(.up)')]) { o.click(); await sleep(60); if (o.classList.contains('done')||document.querySelector('.mem-card.up.done')) break; await sleep(1200); first.click(); await sleep(60);} } await sleep(300); document.querySelector('#recap')?.scrollIntoView()`],
    ['parent', '#/parent', `const f=document.querySelector('#gateForm'); const [a,b]=document.querySelector('.gatecard h1').textContent.match(/\\d+/g).map(Number); document.querySelector('#gateIn').value=a+b; f.requestSubmit(); await sleep(500)`],
    ['progress', '#/progress', null], ['switcher', '#/', `document.querySelector('#whoBtn').click()`],
  ],
  card: [['home', '#/', null], ['lesson', '#/t/maths/add', null], ['practice-card', '#/', `Engine.start({items:[{skill:'m.make10',lvl:1,seed:11}],title:t('m.topic.add.title'),subject:'maths',back:'#/'}); await sleep(400); document.querySelector('.numpad [data-k="1"]').click(); document.querySelector('.numpad [data-k="4"]').click(); document.querySelector('.checkbtn').click(); await sleep(4500); document.querySelector('.lessoncard').scrollIntoView()`], ['science', '#/t/science/electricity', null]],
};
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const out = mode === 'card' ? path.join(ROOT, 'prototype/shots') : path.join(ROOT, '.work/shots'); fs.mkdirSync(out, { recursive: true });
const langs = mode === 'card' ? ['en'] : ['en', 'ta'];
const errors = [];
async function shot(name, hash, js, opt = {}, lang, size) {
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: mode === 'card' ? 2 : 1, colorScheme: 'light' });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(`${name}/${lang}: ${e.message}`)); page.on('console', m => m.type() === 'error' && !/favicon|404/.test(m.text()) && errors.push(`${name}/${lang}: ${m.text()}`));
  await page.addInitScript(([p, fresh, l]) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', 1); if (fresh) { localStorage.removeItem('kalvi.v1'); localStorage.setItem('kalvi.lang', l); } else localStorage.setItem('kalvi.v1', p); } }, [profile(lang, opt.band), !!opt.fresh, lang]);
  await page.goto(BASE + hash); await page.waitForTimeout(900);
  if (js) { await page.evaluate(`(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms)); ${js} })()`); await page.waitForTimeout(900); }
  const file = path.join(out, `${mode === 'card' ? '' : 'core-'}${name}${langs.length > 1 ? '-' + lang : ''}${size.width > 1000 ? '-desktop' : ''}.${mode === 'card' ? 'jpg' : 'png'}`);
  await page.evaluate(() => { document.getElementById('guide')?.remove(); document.querySelector('.sticker-modal')?.remove(); });
  await page.screenshot({ path: file, type: mode === 'card' ? 'jpeg' : 'png', quality: mode === 'card' ? 82 : undefined });
  await ctx.close(); return file;
}
for (const lang of langs) for (const [name, hash, js, opt = {}] of SHOTS[mode]) console.log(await shot(name, hash, js, opt, lang, { width: 390, height: 844 }));
if (mode === 'card') console.log(await shot('web', '#/', null, {}, 'en', { width: 1440, height: 900 }));
else for (const n of ['home', 'lesson-add', 'science-topic']) { const [name, hash, js] = SHOTS.verify.find(s => s[0] === n); console.log(await shot(name, hash, js, {}, 'en', { width: 1280, height: 900 })); }
await browser.close();
if (mode === 'card') { // shrink phone shots to 600 wide
  const sharp = require('sharp'); for (const f of fs.readdirSync(out).filter(f => f.endsWith('.jpg') && !f.startsWith('web'))) { const p = path.join(out, f), b = await sharp(p).resize(600).jpeg({ quality: 80 }).toBuffer(); fs.writeFileSync(p, b); }
}
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no page errors');
