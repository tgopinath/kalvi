// Records voice clips with macOS voices for every fixed (no {placeholder}) line in js/i18n.js and module I18N.add calls.
// Tamil: Vani (ta_IN). English: Tara (en_IN). AAC mono 16 kbps → audio/<lang>-<hash>.m4a, index in js/clips.js.
//   node tools/voice.mjs [limit]     (re-records only new or changed lines)
import fs from 'node:fs'; import vm from 'node:vm'; import { execFileSync } from 'node:child_process';
const VOICE = { en: 'Tara', ta: 'Vani' }, RATE = { en: 165, ta: 150 };
const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); };   // same as js/voice.js
const clean = s => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const ctx = { window: {}, console, document: { addEventListener() {}, body: { classList: { add() {}, remove() {}, toggle() {} } } }, navigator: {}, localStorage: { getItem() { return null; }, setItem() {} }, matchMedia: () => ({ matches: false }), setInterval() {}, setTimeout() {} }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/i18n.js', 'utf8'), ctx);
for (const f of fs.readdirSync('js')) { if (f === 'i18n.js') continue; const src = fs.readFileSync('js/' + f, 'utf8'); for (const m of src.matchAll(/I18N\.add\((\{[\s\S]*?\})\s*\);?\s*\n/g)) { try { vm.runInContext('I18N.add(' + m[1] + ')', ctx); } catch {} } }
const lines = []; const isPair = v => Array.isArray(v) && v.length === 2 && v.every(x => typeof x === 'string');
(function walk(o, path) { for (const [k, v] of Object.entries(o)) { const q = path ? path + '.' + k : k; if (isPair(v)) { for (const [i, l] of [[0, 'en'], [1, 'ta']]) { const s = clean(v[i]); if (s && !/\{/.test(s) && s.split(' ').length >= 3) lines.push([l, s, q]); } } else if (v && typeof v === 'object') walk(v, q); } })(ctx.I18N.L, '');
// most-used first: guide lines, instructions and buttons, prompts, lessons, science pages, then the rest
const PRI = [/^play\./, /^(pr|common|home|age|prof|topic|subj|nav)\./, /\.q\./, /\.h\./, /^(m|e)\.lesson/, /^sci\.[a-z]+\.(intro|why|wonder)/, /\.y\./, /^sci\./, /^sq\./, /^(gk|mq|eq|spz|lab|geo|music|typing|coding|videos|draw|wp|bee|stories|mem)\./];
const rank = q => { const i = PRI.findIndex(r => r.test(q)); return i < 0 ? 99 : i; }; lines.sort((a, b) => rank(a[2]) - rank(b[2]));
const CAP = 12 * 1048576;
const uniq = [...new Map(lines.map(([l, s]) => [l + '|' + s, [l, s]])).values()]; const limit = +process.argv[2] || uniq.length;
fs.mkdirSync('audio', { recursive: true }); let made = 0, bytes = 0; const have = [];
const core = [];
// phonetic respellings for words the macOS voices say badly
const OVR = JSON.parse(fs.existsSync('tools/voice-overrides.json') ? fs.readFileSync('tools/voice-overrides.json', 'utf8') : '{}');
const spoken = (l, s) => Object.entries(OVR[l] || {}).reduce((a, [w, r]) => a.split(w).join(r), s);
for (const [l, s] of uniq.slice(0, limit)) { const id = `${l}-${hash(l + '|' + s)}`, out = `audio/${id}.m4a`;
  if (!fs.existsSync(out)) { fs.writeFileSync('/tmp/kv.txt', spoken(l, s)); execFileSync('say', ['-v', VOICE[l], '-r', String(RATE[l]), '-o', '/tmp/kv.aiff', '-f', '/tmp/kv.txt']); execFileSync('afconvert', ['/tmp/kv.aiff', out, '-f', 'm4af', '-d', 'aac', '-b', '16000', '-c', '1']); made++; }
  bytes += fs.statSync(out).size; have.push(id); if (bytes <= CAP) core.push(id); }
fs.writeFileSync('js/clips.js', '// Recorded voice clips (tools/voice.mjs): ids are <lang>-<hash of lang|text>.\nwindow.VOICE_CLIPS = ' + JSON.stringify(have) + ';\n// most-used clips bundled in the Android app (the rest stream from the live site)\nwindow.VOICE_CORE = ' + JSON.stringify(core) + ';\n'); fs.writeFileSync('tools/audio-core.txt', core.map(i => i + '.m4a').join('\n') + '\n');
console.log(`${uniq.length} lines; recorded ${made} new; ${have.length} clips, ${(bytes / 1048576).toFixed(1)} MB`);
