import { createRequire } from 'node:module'; const require = createRequire('/Users/gopi-4423/Documents/kanal/package.json'); const { chromium } = require('playwright');
const prof = JSON.stringify({ profiles: [{ id: 'cs', name: 'Anu', age: 8, color: '#0c7777', created: 1, updated: 1, subjects: { maths: { skills: {}, review: {}, lessons: {} }, english: { skills: {}, review: {}, lessons: {} }, science: { skills: {}, review: {}, lessons: {} }, world: { skills: {}, review: {}, lessons: {} } }, days: {}, sessions: [], settings: { rate: .9 } }], current: 'cs', updated: 1 });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const w of [375, 1440]) { const p = await (await b.newContext({ viewport: { width: w, height: w > 1000 ? 900 : 812 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(x => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.setItem('kalvi.v1', x); localStorage.setItem('kalvi.mani', 'off'); } }, prof);
await p.goto('http://localhost:5330/#/'); await p.waitForTimeout(800);
let seed = 1, tgt; for (; seed < 200; seed++) { tgt = await p.evaluate(s => { const q = Engine.build({ skill: 'geo.india', lvl: 1, seed: s }, Store.current()); return q.prompt.includes('<b>') ? q.answerText : null; }, seed); if (tgt) break; }
await p.evaluate(s => Engine.start({ items: [{ skill: 'geo.india', lvl: 1, seed: s }], title: 'India', subject: 'world', back: '#/' }), seed); await p.waitForTimeout(1500);
const box = await p.evaluate(n => { const pth = [...document.querySelectorAll('.geo-r')].find(x => x.querySelector('title').textContent === n); const r = pth.getBoundingClientRect(), c = document.querySelector('.dragchip').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, cx: c.left + c.width / 2, cy: c.top + c.height / 2 }; }, tgt);
await p.mouse.move(box.cx, box.cy); await p.mouse.down(); await p.mouse.move((box.cx + box.x) / 2, (box.cy + box.y) / 2, { steps: 5 }); await p.screenshot({ path: `.work/shots/geo-drag-mid-${w}.png` }); await p.mouse.move(box.x + 10, box.y + 8, { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(300);
await p.click('.checkbtn'); await p.waitForTimeout(800); const ok = await p.evaluate(() => Engine.round.results[0]?.ok);
await p.screenshot({ path: `.work/shots/geo-drag-done-${w}.png` }); console.log(w, tgt, 'correct:', ok, errs); }
await b.close();
