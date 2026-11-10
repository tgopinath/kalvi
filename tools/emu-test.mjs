// Drives the Kalvi APK's WebView over raw CDP and screenshots with adb (so native pickers show).
// Setup: adb forward tcp:9333 localabstract:webview_devtools_remote_<pid>
import { execSync } from 'child_process';
const ADB = process.env.HOME + '/Library/Android/sdk/platform-tools/adb', OUT = '/Users/gopi-4423/Documents/kalvi/.work/shots/emu/';
const shot = n => { execSync(`${ADB} exec-out screencap -p > ${OUT}${n}.png`); console.log('shot', n); };
const wait = ms => new Promise(r => setTimeout(r, ms));
const [pg] = await (await fetch('http://localhost:9333/json')).json();
const ws = new WebSocket(pg.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, errs = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; }
  if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description?.split('\n')[0]);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errs.push(m.params.args.map(a => a.value ?? a.description).join(' ')); };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Runtime.enable');
const go = async (h, ms = 2000) => { await ev(`location.hash=${JSON.stringify(h)}`); await wait(ms); };
const click = async (sel, ms = 800) => { const ok = await ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)}); if(!e) return false; e.click(); return true})()`); await wait(ms); return ok; };
const lang = l => click(`#langToggle [data-l=${l}]`, 700);
const step = process.argv[2] || 'all';
if (step === 'eval') console.log(await ev(process.argv[3]));
if (step === 'profile') {
  await click('.agetile[data-a="6"]', 1000); shot('02-form');
  await ev(`(()=>{const i=document.querySelector('#pname'); i.value='Meera'; i.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  await click('#pform .k-btn-primary', 2500); shot('03-home');
}
if (step === 'games') {
  for (const l of ['en', 'ta']) { await lang(l);
    for (const [h, n] of [['#/', 'home'], ['#/subject/maths', 'maths'], ['#/coding', 'coding'], ['#/stories', 'stories'], ['#/memory', 'memory'], ['#/videos', 'videos'], ['#/geo', 'geo']]) { await go(h, 4000); shot(`g-${l}-${n}`); } }
  await lang('en');
}
const tapEl = async sel => { const r = await ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)}); if(!e) return null; e.scrollIntoView({block:'center'}); const b=e.getBoundingClientRect(); return [b.x+b.width/2,b.y+b.height/2,devicePixelRatio, screen.height-innerHeight]})()`); if (!r) return false; await wait(400);
  const r2 = await ev(`(()=>{const b=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return [b.x+b.width/2,b.y+b.height/2]})()`);
  const top = +execSync(`${ADB} shell dumpsys window | grep -o 'statusBars.*frame=\\[0,0\\]\\[[0-9]*,[0-9]*\\]' | head -1 | grep -o '[0-9]*\\]$' | tr -d ']'`).toString().trim() || 63;
  execSync(`${ADB} shell input tap ${Math.round(r2[0] * r[2])} ${Math.round(r2[1] * r[2] + top)}`); return true; };
if (step === 'subject') { for (const l of ['en', 'ta']) { await lang(l); for (const s of ['maths', 'english', 'science', 'world']) { await go('#/s/' + s, 3500); shot(`s-${l}-${s}`); } } await lang('en'); }
if (step === 'rounds') { for (const l of ['en', 'ta']) { await lang(l); for (const s of ['maths', 'english', 'science', 'world']) { await go('#/s/' + s, 3000);
  const h = await ev(`(()=>{const a=[...document.querySelectorAll('a[href^="#/t/"]')][0]; return a&&a.getAttribute('href')})()`); if (!h) { console.log('no topic', s); continue; }
  await go(h, 3000); const st = await ev(`(()=>{const b=document.querySelector('main .k-btn-primary, main [data-start]'); if(!b) return null; b.click(); return b.textContent})()`); await wait(3500); shot(`r-${l}-${s}`); console.log(s, h, st, await ev('location.hash')); } } await lang('en'); }
const ungate = async () => { await go('#/parent', 2500); await ev(`(()=>{const h=document.querySelector('.gatecard h1'); if(!h) return; const [a,b]=h.textContent.match(/\\d+/g).map(Number); document.querySelector('#gateIn').value=a+b; document.querySelector('#gateForm').requestSubmit()})()`); await wait(2500); };
if (step === 'chooser') { await ungate(); await go('#/profile/' + await ev('Store.db.profiles[0].id'), 3000); await tapEl('label:has(input[data-ph=pick])'); console.log('tapped'); await wait(2500); shot('c-chooser'); }
if (step === 'videos') { await go('#/videos', 3500); await click('main a[href^="#/videos/"], main [data-v], main .vcard', 3500); shot('v-offline'); console.log(await ev('location.hash')); }
if (step === 'fixes') { await go('#/s/english', 3500); console.log('broken imgs', await ev(`JSON.stringify([...document.querySelectorAll('main img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src))`)); shot('f-english');
  await lang('ta'); await go('#/memory', 3500); console.log('mem', await ev(`document.querySelector('#why')?.textContent`)); shot('f-mem-ta'); await lang('en');
  await go('#/videos', 3500); await ev(`document.querySelector('.vid-note')?.scrollIntoView({block:'center'})`); await wait(800); shot('v-offline'); console.log('vnote', await ev(`document.querySelector('.vid-note')?.textContent`));
  await go('#/', 3000); await click('.playcard .k-btn, .playcard button, [data-warm]', 3500); console.log('warm', await ev('location.hash')); shot('f-warmup'); }
if (step === 'parent') { await ungate(); shot('p-parent'); }
console.log('hash', await ev('location.hash'), 'errors', JSON.stringify(errs)); ws.close(); process.exit(0);
