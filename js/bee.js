// Spelling bee: hear a word (again, slowly, in a sentence, its Tamil meaning), then spell it.
// Ages 4–6 build it from letter tiles; ages 7–10 type it on a letter keyboard (or a real one).
// Runs on the shared Engine as a 'custom' question, so the hint ladder, the lesson card after every
// answer, the Leitner queue (Store.record) and the parent view all work as for any other skill.
// A bee round is 10 words; the older band has three lives, the younger band has no lives and no timer.
(function () {
  const { t } = I18N, esc = Engine.esc, D = EN_DATA, S = 'english';

  I18N.add({ bee: {
    title: ['Spelling bee', 'எழுத்துக்கூட்டல் போட்டி (spelling bee)'],
    blurb: ['Hear a word, ask for it in a sentence, then spell it. Learn the pattern after every word.', 'ஒரு சொல்லைக் கேள், வாக்கியத்தில் கேள், பிறகு எழுத்துக்கூட்டு. ஒவ்வொரு சொல்லுக்குப் பின்னும் அதன் அமைப்பைக் கற்றுக்கொள்.'],
    skill: ['Spelling bee', 'எழுத்துக்கூட்டல் போட்டி'],
    q: ['Listen, then spell the word.', 'கேட்டுவிட்டு, சொல்லை எழுத்துக்கூட்டு.'],
    hear: ['Hear it', 'கேட்க'],
    again: ['Say it again', 'மீண்டும் சொல்'],
    slow: ['Slowly', 'மெதுவாக'],
    sentence: ['In a sentence', 'வாக்கியத்தில்'],
    meaning: ['Meaning', 'பொருள்'],
    meaningIs: ['In Tamil: {m}', 'தமிழில்: {m}'],
    picAlt: ['Picture clue', 'படக் குறிப்பு'],
    typeHere: ['Type the letters', 'எழுத்துகளைத் தட்டச்சு செய்'],
    keyboard: ['Letter keyboard', 'எழுத்து விசைப்பலகை'],
    kbdNote: ['You can also type on your keyboard. Enter checks.', 'உன் விசைப்பலகையிலும் தட்டச்சு செய்யலாம். Enter அழுத்தினால் சரிபார்க்கும்.'],
    lives: ['{n} of 3 lives left', '3-இல் {n} உயிர்கள் மீதம்'],
    streak: ['Streak: {n}', 'தொடர்: {n}'],
    best: ['Best streak: {n}', 'சிறந்த தொடர்: {n}'],
    out: ['No lives left. This is the last word of the round.', 'உயிர்கள் இல்லை. இதுவே இந்தச் சுற்றின் கடைசிச் சொல்.'],
    sight: ['“{w}” is a sight word: it does not follow a pattern, so learn its shape by heart. Look, say, cover, write, check.', '“{w}” ஒரு பார்வைச் சொல் (sight word): அது எந்த அமைப்பையும் பின்பற்றாது, எனவே அதன் வடிவத்தை மனப்பாடம் செய். பார், சொல், மூடு, எழுது, சரிபார்.'],
    youWrote: ['You wrote {g}. The orange letters are the ones to fix.', 'நீ எழுதியது {g}. ஆரஞ்சு எழுத்துகளைத் திருத்த வேண்டும்.'],
    hint3: ['It looks like this: {shape}', 'இது இப்படி இருக்கும்: {shape}'],
  } });

  // ---------- word lists by age band and level ----------
  const P = D.PATTERNS;
  const TRICKY = ['the', 'said', 'was', 'they', 'where', 'come', 'what', 'there', 'want', 'please'];
  const shortPre = D.DOLCH_PRE.filter(w => w.length >= 3 && w.length <= 4 && w !== 'I');
  const POOLS = {
    young: [null, [...P.cvc.words, ...shortPre], [...P.silentE.words.slice(0, 6), ...P.ck.words.slice(0, 4), ...P.double.words.slice(0, 5), ...D.DOLCH_PRIMER.filter(w => w.length <= 4)]],
    older: [null, [...P.silentE.words, ...P.ck.words, ...P.double.words, ...TRICKY.slice(0, 5)], [...P.aiay.words, ...P.eeea.words, ...P.sh.words, ...P.oaow.words], [...P.igh.words, ...TRICKY, 'window', 'yellow', 'kitten', 'puppy', 'apple', 'flute']],
  };
  const bandOf = b => (b === 'young' ? 'young' : 'older');
  const poolFor = (l, band) => { const ps = POOLS[bandOf(band)]; return ps[Math.min(Math.max(l, 1), ps.length - 1)]; };
  const wordFor = (l, band, r) => r.pick(poolFor(l, band));
  const patOf = w => Object.keys(P).find(k => P[k].words.includes(w)) || null;
  const taOf = w => (window.ENGLISH?.taMean ? ENGLISH.taMean(w) : D.WORDS[w]?.ta || D.SPELL_TA[w] || '');
  const pic = w => window.PICS?.[w] || null;
  const say = (w, slow) => [{ text: w, lang: 'en', slow }];

  // ---------- one bee round's lives and streak ----------
  let round = null;   // { lives|null, streak, best, active }
  const inBee = () => round?.active && Engine.round?.mode === 'bee';

  function whyFor(w, given) {
    const pat = patOf(w), g = (given || '').toLowerCase(), missed = [];
    if (given) for (let i = 0; i < w.length; i++) if (g[i] !== w[i]) missed.push(i);
    const steps = [{ text: t('e.y.spell', { w: `<span lang="en">${esc(w)}</span>`, letters: w.split('').join('-') }), vis: ENGLISH.spellHtml(w, missed, pat) }];
    if (given && g !== w) steps.push({ text: t('bee.youWrote', { g: `<span lang="en">${esc(g)}</span>` }) });
    steps.push(pat ? { text: t('e.y.pattern', { p: t('e.pattern.' + pat) }) } : { text: t('bee.sight', { w: `<span lang="en">${esc(w)}</span>` }) });
    if (D.SENT[w]) steps.push({ text: t('e.y.inSentence', { s: `<span lang="en">${esc(D.SENT[w])}</span>` }) });
    if (taOf(w)) steps.push({ text: t('bee.meaningIs', { m: `<span lang="ta">${esc(taOf(w))}</span>` }) });
    return { steps, photo: ENGLISH.credit?.(w) || null };
  }

  const hearBar = w => `<div class="chips bee-hear" role="group" aria-label="${t('bee.hear')}">
      <button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-hear="again" aria-pressed="false"><svg class="k-icon" aria-hidden="true"><use href="#i-sound"/></svg><span>${t('bee.again')}</span></button>
      <button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-hear="slow" aria-pressed="false"><span>${t('bee.slow')}</span></button>
      ${D.SENT[w] ? `<button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-hear="sentence" aria-pressed="false"><span>${t('bee.sentence')}</span></button>` : ''}
      ${taOf(w) ? `<button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-hear="meaning" aria-pressed="false"><span>${t('bee.meaning')}</span></button>` : ''}
    </div><p class="small muted bee-meaning" lang="ta" aria-live="polite" hidden></p>`;

  const statusLine = () => {
    if (!inBee()) return '';
    const hearts = round.lives == null ? '' : `<span class="bee-lives" aria-hidden="true">${[0, 1, 2].map(i => `<svg class="k-icon bee-heart ${i < round.lives ? 'on' : ''}"><use href="#i-heart"/></svg>`).join('')}</span>`;
    const words = [round.lives == null ? '' : t('bee.lives', { n: round.lives }), t('bee.streak', { n: round.streak })].filter(Boolean).join(' · ');
    return `<p class="small muted bee-status">${hearts}<span>${words}</span></p>`;
  };

  // ---------- the skill ----------
  Engine.skill({ id: 'e.bee', subject: S, topic: 'spell', name: 'bee.skill', warm: false, bands: { young: [1, 2], older: [1, 3] }, gen(l, r, ctx) {
    const band = bandOf(ctx?.band), w = wordFor(l, band, r);
    const typed = band === 'older';
    const extra = r.shuffle('abcdefghijklmnoprstuwy'.split('').filter(c => !w.includes(c))).slice(0, l === 1 ? 2 : 3);
    const tiles = r.shuffle([...w.split(''), ...extra]);
    const p = pic(w);
    const shape = w.split('').map((c, i) => (i === 0 || i === w.length - 1 ? c : '_')).join(' ');
    const q = {
      kind: 'custom', prompt: t('bee.q'), say: say(w), autoSay: true, answer: w, answerText: `<span lang="en">${esc(w)}</span>`,
      visual: `${p ? `<div class="wordpic"><img src="${p.src}" alt="${t('bee.picAlt')}" loading="lazy" referrerpolicy="no-referrer"></div>` : ''}${hearBar(w)}`,
      hints: [t('e.h.spell', { f: w[0] }), t('e.h.spell2', { n: w.length }), t('bee.hint3', { shape: `<span lang="en" class="bee-shape">${esc(shape)}</span>` })],
      whyFor: g => whyFor(w, g),
    };
    q.why = whyFor(w);
    let built = [];                 // tile indexes (young) or letters (older)
    let ready = () => {};
    const text = () => (typed ? built.join('') : built.map(i => tiles[i]).join(''));
    q.mount = (el, api) => {
      ready = api.ready;
      const card = el.closest('.qcard');
      // hear buttons
      const rate = () => Store.current()?.settings?.rate ?? 0.9;
      card.querySelectorAll('[data-hear]').forEach(b => b.onclick = () => {
        const k = b.dataset.hear, mean = card.querySelector('.bee-meaning');
        if (k === 'again') Voice.play(say(w), b, { rate: rate() });
        else if (k === 'slow') Voice.play(say(w, true), b, { rate: rate() * 0.8 });
        else if (k === 'sentence') Voice.play([{ text: w, lang: 'en' }, { text: D.SENT[w], lang: 'en' }, { text: w, lang: 'en' }], b, { rate: rate() });
        else if (k === 'meaning') { mean.hidden = false; mean.textContent = t('bee.meaningIs', { m: taOf(w) }); Voice.play([{ text: taOf(w), lang: 'ta' }], b, { rate: rate(), onMissing: () => {} }); }
      });
      el.innerHTML = `${statusLine()}
        <div class="tilebuild"><div class="tileslot" aria-live="polite" aria-label="${t('bee.typeHere')}"></div>
          <button type="button" class="k-iconbtn undo" aria-label="${t('pr.undo')}"><svg class="k-icon"><use href="#i-undo"/></svg></button></div>
        ${typed
          ? `<div class="numpad bee-keys" role="group" aria-label="${t('bee.keyboard')}">${'abcdefghijklmnopqrstuvwxyz'.split('').map(c => `<button type="button" data-k="${c}" lang="en">${c}</button>`).join('')}
             <button type="button" data-k="del" aria-label="${t('common.erase')}"><svg class="k-icon"><use href="#i-del"/></svg></button><button type="button" data-k="clr" class="clr">${t('common.clear')}</button></div>
             <p class="kbd-note">${t('bee.kbdNote')}</p>`
          : `<div class="tilebank" role="group" aria-label="${t('pr.build')}">${tiles.map((x, i) => `<button type="button" class="tile" data-i="${i}" lang="en">${esc(x)}</button>`).join('')}</div>`}
        <p class="k-sr-only bee-live" aria-live="assertive"></p>`;
      const slot = el.querySelector('.tileslot'), bank = [...el.querySelectorAll('.tile')];
      const draw = () => {
        const s = text();
        slot.innerHTML = s ? s.split('').map(c => `<span class="tile placed" lang="en">${esc(c)}</span>`).join('') : `<span class="slot-ph">${typed ? t('bee.typeHere') : t('pr.build')}</span>`;
        bank.forEach((b, i) => b.disabled = built.includes(i));
        ready(s.length > 0);
      };
      const add = c => { // c: letter (typed) or tile index (tiles)
        if (Engine.round?.answered) return;
        if (typed) { if (built.length < 14) built.push(c); } else { if (built.includes(c)) return; built.push(c); c = tiles[c]; }
        draw(); Voice.play([{ text: typed ? c : c, lang: 'en' }], null, {});
      };
      const undo = () => { built.pop(); draw(); };
      el.querySelector('.undo').onclick = undo;
      bank.forEach((b, i) => b.onclick = () => add(i));
      el.querySelectorAll('.bee-keys button').forEach(b => b.onclick = () => { const k = b.dataset.k; if (k === 'del') undo(); else if (k === 'clr') { built = []; draw(); } else add(k); });
      // real keyboard: letters, Backspace, Enter (Enter is handled here so a focused letter key is not pressed again)
      const onKey = e => {
        if (!el.isConnected) { document.removeEventListener('keydown', onKey); return; }
        if (Engine.round?.answered || e.metaKey || e.ctrlKey || e.altKey) return;
        const k = e.key.toLowerCase();
        if (/^[a-z]$/.test(k)) { e.preventDefault(); if (typed) add(k); else { const i = tiles.findIndex((x, j) => x === k && !built.includes(j)); if (i >= 0) add(i); } }
        else if (e.key === 'Backspace') { e.preventDefault(); undo(); }
        else if (e.key === 'Enter' && el.contains(document.activeElement) && text()) { e.preventDefault(); e.stopPropagation(); api.submit(); }
      };
      document.addEventListener('keydown', onKey);
      draw();
    };
    q.check = () => {
      const g = text().toLowerCase(), correct = g === w;
      if (inBee()) {
        if (correct) { round.streak++; round.best = Math.max(round.best, round.streak); }
        else { round.streak = 0; if (round.lives != null) round.lives = Math.max(0, round.lives - 1); }
        const R = Engine.round, live = document.querySelector('.bee-live');
        if (round.lives === 0 && R && R.i + 1 < R.items.length) { R.items.length = R.i + 1; if (live) live.textContent = t('bee.out'); }
        const st = document.querySelector('.bee-status'); if (st) st.outerHTML = statusLine();
      }
      return { correct, given: g };
    };
    return q;
  } });

  // ---------- a bee round: due review words first, then fresh words, no repeats ----------
  function start(p) {
    p = p || Store.current(); if (!p) return;
    const N = 10, items = [], seen = new Set();
    const wordOf = it => wordFor(it.lvl, AGE.band(p), Engine.rng(it.seed));
    for (const r of Store.due(p, S).filter(r => r.skill === 'e.bee').slice(0, 4)) {
      const it = { skill: 'e.bee', lvl: r.lvl, seed: r.seed }, w = wordOf(it);
      if (!seen.has(w)) { seen.add(w); items.push(it); }
    }
    let guard = 0;
    while (items.length < N && guard++ < 200) { const it = Engine.itemFor(p, 'e.bee'), w = wordOf(it); if (!seen.has(w)) { seen.add(w); items.push(it); } }
    round = { lives: bandOf(AGE.band(p)) === 'older' ? 3 : null, streak: 0, best: 0, active: true };
    const again = () => start(p);
    Engine.start({ items, title: t('bee.title'), mode: 'bee', subject: S, topic: 'spell', back: '#/s/english', again });
  }

  window.BEE = { game: { title: 'bee.title', blurb: 'bee.blurb', icon: 'i-bee', start }, words: POOLS };
})();
