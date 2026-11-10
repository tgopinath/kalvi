// Checks i18n: every leaf is an [en, ta] pair with Tamil text, and every literal t('key') used in js/ exists.
import fs from 'node:fs'; import vm from 'node:vm';
const ctx = { window: {}, console }; ctx.window = ctx; vm.createContext(ctx);
const files = fs.readdirSync('js').filter(f => f.endsWith('.js'));
vm.runInContext(fs.readFileSync('js/i18n.js', 'utf8'), ctx);
// modules that register their own strings with I18N.add(...) — evaluate just those calls
for (const f of files) { const src = fs.readFileSync('js/' + f, 'utf8'); for (const m of src.matchAll(/I18N\.add\((\{[\s\S]*?\})\s*\);?\s*\n/g)) { if (f === 'i18n.js') continue; try { vm.runInContext('I18N.add(' + m[1] + ')', ctx); } catch {} } }
const L = ctx.I18N.L, bad = [], noTa = [];
const isPair = v => Array.isArray(v) && v.length === 2 && v.every(x => typeof x === 'string');
(function walk(o, p) { for (const [k, v] of Object.entries(o)) { const q = p ? p + '.' + k : k; if (isPair(v)) { if (!v[1]) bad.push(q); else if (!/[஀-௿]/.test(v[1]) && /[a-z]{3}/i.test(v[0]) && v[0] !== v[1] && !/^[A-Z]+$/.test(v[0])) noTa.push(q + ' = ' + v[1]); } else if (Array.isArray(v)) v.forEach((x, i) => x && typeof x === 'object' && walk(isPair(x) ? { [i]: x } : x, q + '.' + i)); else if (v && typeof v === 'object') walk(v, q); } })(L, '');
const get = k => k.split('.').reduce((o, x) => o?.[x], L), missing = new Set();
for (const f of files) { const src = fs.readFileSync('js/' + f, 'utf8'); for (const m of src.matchAll(/\bt\('([a-zA-Z0-9_.]+)'/g)) if (get(m[1]) == null) missing.add(f + ': ' + m[1]); }
console.log('empty Tamil:', bad.length, bad.slice(0, 20)); console.log('Tamil looks untranslated:', noTa.length, noTa.slice(0, 30)); console.log('missing keys:', missing.size, [...missing].slice(0, 40));
