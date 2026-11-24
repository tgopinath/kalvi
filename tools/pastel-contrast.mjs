// AA check on real screens: every visible element with its own text vs its nearest opaque background (skips text over images/boards it can't resolve).
import { createRequire } from 'node:module'; const require = createRequire('/Users/gopi-4423/Documents/All pets/kanal/package.json'); const { chromium } = require('playwright');
const sub = () => ({ skills: {}, review: {}, lessons: {} });
const db = l => JSON.stringify({ profiles: [{ id: 'c', name: l === 'ta' ? 'அனு' : 'Anu', age: 8, color: '#0c7777', created: 1, updated: 1, subjects: { maths: sub(), english: sub(), science: sub(), world: sub() }, days: {}, sessions: [], settings: { rate: .9 }, extras: { stickers: 99 } }], current: 'c', updated: 1 });
const gate = `location.hash='#/parent'; await s(600); const h=document.querySelector('.gatecard h1'); if(h){const [a,b]=h.textContent.match(/\\d+/g).map(Number); document.querySelector('#gateIn').value=a+b; document.querySelector('#gateForm').requestSubmit(); await s(900);}`;
const S = { today: `location.hash='#/'`, maths: `location.hash='#/s/maths'`, english: `location.hash='#/s/english'`, science: `location.hash='#/s/science'`, world: `location.hash='#/s/world'`, progress: `location.hash='#/progress'`, credits: `location.hash='#/credits'`,
  lesson: `Engine.start({items:[{skill:'m.compare',lvl:1,seed:4}],title:'q',subject:'maths',back:'#/'}); await s(700); const q=Engine.round.q; document.querySelectorAll('.choice')[q.choices.findIndex(c=>c.v!==q.answer)]?.click(); document.querySelector('.checkbtn')?.click()`,
  grownups: gate, profile: gate + `location.hash='#/profile/new'` };
for (const g of ['MATHSQUIZ.game', 'PUZZLES.game', 'CODING.game', 'WORDPZ.game', 'TYPING.game', 'MUSIC.game("maths")', 'DRAW.game("english")', 'STORIES.game', 'BEE.game', 'ENGQUIZ.game', 'SCIPZ.game', 'LAB.game', 'VIDEOS.game', 'GEO.game', 'GK.game', 'SCIENCE.quizGame', 'MEMORY.game("science")']) S[g] = `(${g}).start(Store.current())`;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); let low = [99], fails = [], n = 0;
for (const [k, js] of Object.entries(S)) for (const l of ['en', 'ta']) for (const w of [375, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.addInitScript(([x, l]) => { if (!sessionStorage.s) { sessionStorage.s = 1; localStorage.clear(); localStorage.setItem('kalvi.v1', x); localStorage.setItem('kalvi.lang', l); localStorage.setItem('kalvi.guide.seen', '1'); } }, [db(l), l]);
  await p.goto('http://localhost:5330/#/'); await p.waitForTimeout(900); await p.evaluate(`(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms)); ${js}; await s(1300)})()`).catch(() => {});
  const r = await p.evaluate(() => {
    const rgb = c => (c.match(/[\d.]+/g) || []).map(Number), lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
    const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
    const bgOf = el => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); const c = rgb(cs.backgroundColor); if (cs.backgroundImage.includes('url(') || (cs.backgroundImage.includes('gradient') && !((c[3] ?? 1) > .9))) return null; if (c.length && (c[3] ?? 1) > .9) return c.slice(0, 3); } return rgb(getComputedStyle(document.body).backgroundColor).slice(0, 3); };
    const out = [];
    for (const el of document.querySelectorAll('body *')) { if (el.closest('svg, .deco, [aria-hidden="true"], .k-sr-only, .sr-only')) continue; if (![...el.childNodes].some(x => x.nodeType === 3 && x.textContent.trim())) continue;
      const cs = getComputedStyle(el), rc = el.getBoundingClientRect(); if (cs.visibility === 'hidden' || cs.display === 'none' || !rc.width || +cs.opacity < .5 || rc.bottom < 0 || rc.top > innerHeight * 3) continue;
      if (el.closest('button[disabled], [aria-disabled="true"]')) continue;
      const bg = bgOf(el); if (!bg) continue; const fg = rgb(cs.color); if ((fg[3] ?? 1) < .5) continue;
      const size = parseFloat(cs.fontSize), large = size >= 24 || (+cs.fontWeight >= 700 && size >= 18.66);
      out.push([el.textContent.trim().slice(0, 28), +ratio(fg.slice(0, 3), bg).toFixed(2), large ? 3 : 4.5]); }
    return out;
  });
  for (const [t, ra, need] of r) { n++; if (ra < low[0]) low = [ra, k, l, w, t]; if (ra < need) fails.push(`${k}/${l}/${w}: ${ra} < ${need} "${t}"`); }
  await p.close();
}
await b.close(); console.log(`${n} text checks; lowest ${JSON.stringify(low)}`); console.log([...new Set(fails)].slice(0, 40).join('\n') || 'all pass AA');
