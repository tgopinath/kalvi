# Kalvi module contract

Kalvi is a static web app (plain JS, no build). Scripts load in order from `index.html`; every module is an IIFE that sets one global.
Local preview: `python3 tools/serve.py 5330` → http://localhost:5330 (no-cache). A child profile must exist (first run shows the profile form).

## Globals you can use
- `I18N.add({ ns: { key: ['English', 'தமிழ்'] } })` — register strings. A leaf is ALWAYS an `[en, ta]` pair; nest objects freely.
  `t('ns.key', {var})` returns the current-language string (`{var}` placeholders). `tx('ns.branch')` returns a whole branch localised (pairs → strings, other values untouched). `I18N.lang` is `'en'` or `'ta'`. `I18N.numWord(n, lang)`.
  Every visible string must come from I18N. Numerals stay Western digits. Tamil: natural Tamil Nadu school-book Tamil, English term in brackets where useful, e.g. பின்னம் (fraction).
  Put your strings in YOUR module file with `I18N.add` (namespace = your module name).
- `Engine.skill({ id, subject: 'maths'|'english'|'science', topic, name: 'i18n.key', bands: { young: [minLvl, maxLvl], older: [minLvl, maxLvl] }, warm?: false, gen(lvl, r, ctx) })`
  `r` is a seeded RNG: `r()`, `r.int(a,b)`, `r.pick(arr)`, `r.shuffle(arr)`. `gen` must be deterministic for (lvl, seed) — the review queue re-creates a missed question from its seed.
  `gen` returns a question object:
  - `kind`: `'num'` (number pad; `answer` number; optional `unit` '₹' or a string), `'choice'`/`'tf'` (`choices: [{ v, html?, img?, vis?, say?, lang? }]`, `answer` = the right `v`), `'tiles'` (`tiles: [...]`, `words?: true`, `answer` string), or `'custom'`.
  - `custom`: `mount(el, api)` renders your own interaction into `el`; call `api.ready(true)` when Check can be pressed (or `api.submit()` to check now); `check()` returns `{ correct, given }`.
  - `prompt` (HTML), optional `promptText` (plain, for Listen), `say: [{ text, lang: 'en'|'ta', slow? }]` (overrides what Listen reads), `autoSay` (read the prompt on show), `visual` (HTML/SVG shown on the dark art board), `boardClass` ('light' for a paper board),
  - `hints: [{ text, vis? }, …]` — the hint ladder; for games use exactly 3: nudge, worked step, answer, and set `hintRevealsAnswer: true` (revealing the answer counts as a miss).
  - `answerText` (HTML shown as "The answer is …"), `why: { steps: [{ text, vis? }], rule?, photo?: { src, credit, href, alt } }` — the lesson card after EVERY answer. `whyFor(given)` optional: rebuild `why` from the child's answer.
- `Engine.start({ items: [{ skill, lvl, seed }], title, subject, topic, mode, back: '#/…', again: fn })` runs a round with the shared UI (progress meter, hint ladder, lesson card, summary). Results go to mastery, the Leitner review queue (misses) and the parent view automatically.
  `Engine.itemFor(profile, skillId)` → item at the child's adaptive level; `Engine.weighted(profile, ids, n)` → n items weighted to low mastery; `Engine.newSeed()`.
- `Store`: `current()` profile (`band` 'young' | 'older', `lang`, `subjects[s].skills/review`, `sessions`, `days`), `record(p, subject, skillDef, { key, lvl, seed }, correct)`, `flagReview(p, subject, item)`, `due(p, subject)`, `logSession(p, { subject, topic, mode, n, right, ms })`, `save()`. Extra per-profile data: put it under `p.extras[yourModule]` then `Store.save()` (keep it small: localStorage).
- `Voice.play(segs, btn?, { rate })` — `segs = [{ text, lang }]`; English words inside English content are read with `lang: 'en'` even in Tamil mode. `Engine.listenBtn(cls)` returns the outline "Listen" pill HTML; `Engine.bindListen(btnEl, () => segs)`.
- Visuals: `R3.Scene({ yaw, pitch, scale })` tiny 3D renderer → SVG (`box`, `prism`, `cylinder`, `cone`, `pyramid`, `sphere`, `shadow`, `text`, `group(layer)`, `svg(label)`); `VIS.*` (tenFrame, blocks, array, plates, numberLine, fractionBars, shape2d, solid, clock, money, ruler); `SIMS.mount(el, key, state)` / `SIMS.snap(key, state)` for science demos (ramp, prism, sound, magnet, circuit, matter, water, breeze, moon, lever, plant).
- Pictures: `window.PICS[word] = { src, credit, page }` (vetted Wikimedia photos for the English vocabulary in `EN_DATA.WORDS`), `ENGLISH.picImg(word)`, `ENGLISH.credit(word)`, `ENGLISH.taMean(word)`. Never add an unvetted image.
- English data: `EN_DATA.WORDS` (word → { ta, theme }), `THEMES`, `AZ`, `SAY`, `CVC`, `DOLCH_PRE`, `DOLCH_PRIMER`, `PATTERNS`, `SENT`, `SPELL_TA`.
- Screens: `ROUTES[name] = { render(main, parts), keys?(e) }` adds route `#/name/...` (parts = hash split by '/'). `App.toast(html)`, `App.dialog(html, bind)`, `App.closeDialog()`, `App.forBand(topic, p)`.
- Games list: export `window.<MODULE>.game` (or `.game(subject)`) = `{ title: 'i18n.key', blurb: 'i18n.key', icon: 'i-xxx', start(profile) }`. The app shows it on the subject page and Today.

## Look and feel (hard rules)
Calm editorial, Kolam tokens (`var(--ink)`, `--surface`, `--line`, `--acc` = subject accent, `--board` dark art board). Eyebrow caps labels (`.eyebrow`), hairline borders, outline pill buttons (`k-btn k-btn-outline pill`), no exclamation marks, no gradients/blobs/confetti/cartoon faces, no emoji. Visuals: crisp 3D-feeling pieces on dark boards (`.board`). Targets ≥ 48px. Keyboard + screen reader (labels, `aria-live` for feedback). Respect `prefers-reduced-motion`. Phone first (375px) then desktop. Lato only (Noto Sans Tamil for Tamil).
Existing classes: `.board`, `.board.light`, `.k-card`, `.eyebrow`, `.chips`, `.seg`, `.steps/.step/.step-n/.step-body` (Steps pattern), `.tile`, `.choice`, `.bignum`, `.caption`, `.controls`, `.stepper`, `.lessoncard` (engine), `.k-btn*`, `.k-iconbtn`.
Put module CSS in `css/<module>.css` (it is linked from index.html).
