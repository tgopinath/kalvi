// Unit-style tests for Store.mergeIn (used by Google backup) and sign-out keeping local data. node tools/test-store.mjs
import fs from 'node:fs'; import vm from 'node:vm';
const mem = {}; const ls = { getItem: k => mem[k] ?? null, setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
function boot(initial) { for (const k in mem) delete mem[k]; if (initial) mem['kalvi.v1'] = JSON.stringify(initial); const ctx = { window: {}, localStorage: ls, Date, JSON, Math, console }; ctx.window = ctx; vm.createContext(ctx); vm.runInContext(fs.readFileSync('js/store.js', 'utf8'), ctx); return ctx.Store; }
const prof = (id, name, updated, extra = {}) => ({ id, name, band: 'young', updated, subjects: { maths: { skills: {}, review: {}, lessons: {} } }, days: {}, sessions: [], ...extra });
// A: device has Anu (older edit) + Bala; cloud has Anu (newer) + Chitra
let S = boot({ profiles: [prof('a', 'Anu', 100, { sessions: [{ n: 1 }] }), prof('b', 'Bala', 50)], current: 'a', updated: 1 });
let changed = S.mergeIn({ profiles: [prof('a', 'Anu (cloud)', 200), prof('c', 'Chitra', 10)] });
const names = S.db.profiles.map(p => p.name).sort();
ok(changed, 'merge reports a change');
ok(JSON.stringify(names) === JSON.stringify(['Anu (cloud)', 'Bala', 'Chitra']), 'union of profiles, newer copy wins: ' + names);
ok(S.db.profiles.every(p => ['maths', 'english', 'science', 'world'].every(s => p.subjects[s])), 'every merged profile gets all four subjects');
ok(JSON.parse(mem['kalvi.v1']).profiles.length === 3, 'merged result saved to localStorage');
// B: device newer than cloud keeps device copy
S = boot({ profiles: [prof('a', 'Anu device', 300)], current: 'a', updated: 1 });
S.mergeIn({ profiles: [prof('a', 'Anu old cloud', 100)] });
ok(S.db.profiles[0].name === 'Anu device', 'device copy kept when newer');
// C: empty cloud changes nothing; bad payloads are ignored
ok(S.mergeIn({ profiles: [] }) === false && S.mergeIn(null) === false, 'empty or missing cloud data changes nothing');
// D: sign-out keeps local data (backup.js only clears its flag)
const src = fs.readFileSync('js/backup.js', 'utf8'), so = src.slice(src.indexOf('async function signOut'), src.indexOf('let card'));
ok(/flag\(null\)/.test(so) && !/removeItem\(['"]kalvi\.v1|Store\.remove|localStorage\.clear/.test(so), 'signOut clears only the backup flag, not kalvi.v1');
ok(/auth\/unauthorized-domain/.test(src) && /parent\.domainErr/.test(src), 'unauthorised domain shows the domainErr message');
ok(/native\(\)\)[^;]*webOnly|parent\.webOnly/.test(src), 'APK shows "Web only"');
console.log(`${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
