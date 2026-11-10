// node tools/before-after.mjs before|after → .work/shots/ba-<state>-{memory,lab,count}.png (390x844, young, EN)
import { createRequire } from 'node:module'; const require = createRequire('/Users/gopi-4423/Documents/kanal/package.json'); const { chromium } = require('playwright');
const st = process.argv[2] || 'before', B = process.env.KALVI_URL || 'http://localhost:5330/';
const prof = JSON.stringify({ profiles: [{ id: 'cs', name: 'Anu', band: 'young', avatar: 'cube', color: '#16a39c', lang: 'en', created: 1, updated: 1, subjects: { maths: { skills: {}, review: {}, lessons: {} }, english: { skills: {}, review: {}, lessons: {} }, science: { skills: {}, review: {}, lessons: {} }, world: { skills: {}, review: {}, lessons: {} } }, days: {}, sessions: [], settings: { rate: .9 } }], current: 'cs', updated: 1 });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const shots = {
  memory: `MEMORY.game('science').start(Store.current()); await s(800); const c=[...document.querySelectorAll('.mem-card')]; for (const k of [0,1,2,3]) { c[k].classList.add('up'); }`,
  lab: `location.hash='#/lab/float'; await s(500); const g=()=>document.querySelector('[data-go="1"]').click(); g(); await s(200); document.querySelectorAll('.lab-pred li').forEach(li=>li.querySelector('button').click()); await s(100); document.querySelectorAll('.lab-pred li').forEach(li=>li.querySelector('button').click()); g(); await s(200); document.querySelector('[data-pl]').click(); g(); await s(200); document.querySelector('#runBtn').click(); await s(2000); g(); await s(200); g(); await s(200); document.querySelector('.choice[data-v="0"]').click(); await s(500); document.querySelector('#labCard').scrollIntoView()`,
  count: `Engine.start({items:[{skill:'m.count',lvl:1,seed:31}],title:'Counting',subject:'maths',back:'#/'}); await s(600)`,
};
for (const [n, js] of Object.entries(shots)) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }), p = await ctx.newPage();
  await p.addInitScript(x => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.setItem('kalvi.v1', x); } }, prof);
  await p.goto(B + '#/'); await p.waitForTimeout(800); await p.evaluate(`(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms)); ${js}})()`); await p.waitForTimeout(1500);
  await p.screenshot({ path: `.work/shots/ba-${st}-${n}.png` }); await ctx.close(); console.log(n);
}
await b.close();
