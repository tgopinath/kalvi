// Age matrix: for ages 3–10 in EN and Tamil, start every unlocked game and assert round size, choice counts and unlocks
// match the AGE table. node tools/age-matrix.mjs
import { createRequire } from 'node:module'; const require = createRequire('/Users/gopi-4423/Documents/kanal/package.json'); const { chromium } = require('playwright');
const B = process.env.KALVI_URL || 'http://localhost:5330/';
const prof = age => JSON.stringify({ profiles: [{ id: 'ca', name: 'Anu', age, color: '#0c7777', created: 1, updated: 1, subjects: { maths: { skills: {}, review: {}, lessons: {} }, english: { skills: {}, review: {}, lessons: {} }, science: { skills: {}, review: {}, lessons: {} }, world: { skills: {}, review: {}, lessons: {} } }, days: {}, sessions: [], settings: { rate: .9 } }], current: 'ca', updated: 1 });
const br = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); const fails = []; let runs = 0;
for (const age of [3, 4, 5, 6, 7, 8, 9, 10]) for (const lang of ['en', 'ta']) {
  const ctx = await br.newContext({ viewport: { width: 375, height: 812 } }), pg = await ctx.newPage();
  pg.on('pageerror', e => fails.push(`age ${age} ${lang}: ${e.message}`));
  await pg.addInitScript(([p, l]) => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.setItem('kalvi.v1', p); localStorage.setItem('kalvi.lang', l); localStorage.setItem('kalvi.sound', 'off'); localStorage.setItem('kalvi.mani', 'off'); } }, [prof(age), lang]);
  await pg.goto(B + '#/'); await pg.waitForTimeout(700);
  const games = await pg.evaluate(() => { const p = Store.current(); return Object.entries(App.SUBJ).flatMap(([s, S]) => S.games().map((g, i) => ({ s, i, title: g.title, ok: AGE.allowGame(p, g) }))); });
  for (const g of games.filter(x => x.ok)) {
    runs++;
    const res = await pg.evaluate(async ({ s, i }) => { const sleep = ms => new Promise(r => setTimeout(r, ms)); location.hash = '#/'; await sleep(150); const p = Store.current(); const A = AGE.of(p); try { App.SUBJ[s].games()[i].start(p); } catch (e) { return { err: e.message }; } await sleep(600);
      const R = Engine.round, out = { hash: location.hash }; if (R && location.hash === '#/round') { out.n = R.items.length; out.round = A.round; out.choices = document.querySelectorAll('.choice').length; out.maxC = A.choices; out.skills = R.items.map(x => x.skill); out.badSkill = out.skills.filter(id => !AGE.allowSkill(p, id)); } return out; }, g);
    if (res.err) fails.push(`age ${age} ${lang} ${g.title}: ${res.err}`);
    if (res.n != null) { if (res.n > Math.max(res.round, 5)) fails.push(`age ${age} ${g.title}: round ${res.n} > ${res.round}`); if (res.choices > res.maxC) fails.push(`age ${age} ${g.title}: ${res.choices} choices > ${res.maxC}`); if (res.badSkill.length) fails.push(`age ${age} ${g.title}: locked skills ${res.badSkill}`); }
  }
  const locks = await pg.evaluate(() => { const p = Store.current(); return Object.entries(AGE.TOPIC).flatMap(([s, o]) => Object.entries(o).filter(([id, min]) => AGE.allowTopic(p, s, id) !== (p.age >= min)).map(([id]) => s + ':' + id)); });
  if (locks.length) fails.push(`age ${age}: unlock mismatch ${locks}`);
  await ctx.close();
}
await br.close(); console.log(`${runs} game starts;`, fails.length ? 'FAILS:\n' + [...new Set(fails)].join('\n') : 'all checks pass');
