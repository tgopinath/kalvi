// English: 7 topics. Content words are English (read in English even in Tamil mode); instructions and
// explanations follow the UI language, and Tamil meanings are shown prominently in Tamil mode.
(function () {
  const { skill } = Engine, D = EN_DATA, S = 'english', esc = Engine.esc;
  const en = text => ({ text, lang: 'en' }), ui = text => ({ text, lang: I18N.lang });
  const pic = w => window.PICS?.[w] || null;
  const picImg = (w, cls = '') => { const p = pic(w); return p ? `<img class="${cls}" src="${p.src}" alt="${esc(D.WORDS[w]?.label || w)}" loading="lazy" referrerpolicy="no-referrer">` : `<span class="nopic" lang="en">${esc(D.WORDS[w]?.label || w)}</span>`; };
  const credit = w => { const p = pic(w); return p ? { src: p.src, credit: p.credit || 'Wikimedia Commons', href: p.page, alt: w } : null; };
  const withPics = list => list.filter(w => pic(w));
  const taMean = w => D.WORDS[w]?.ta || D.SPELL_TA[w] || '';
  const meanTag = w => taMean(w) ? `<span class="tamil-meaning" lang="ta">${taMean(w)}</span>` : '';
  const word = w => `<span lang="en">${esc(w)}</span>`;
  const pickN = (r, arr, n, not = []) => r.shuffle(arr.filter(x => !not.includes(x))).slice(0, n);
  const diffLetters = (a, b) => { const out = []; for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) out.push(`${b[i] || '–'} → ${a[i] || '–'}`); return out.join(', '); };

  // ---------- letter sounds ----------
  const letters = Object.keys(D.AZ);
  const soundSay = L => `${D.SAY[L]}. ${L} is for ${D.AZ[L][0]}.`;
  skill({ id: 'e.sound', subject: S, topic: 'sounds', name: 'e.skill.sound', bands: { young: [1, 2], older: [1, 2] }, gen(l, r) {
    const L = r.pick(letters), opts = r.shuffle([L, ...pickN(r, letters, l === 1 ? 2 : 3, [L])]), k = D.AZ[L][0];
    return { kind: 'choice', prompt: t('e.q.sound'), say: [ui(t('e.q.sound')), en(D.SAY[L]), en(D.SAY[L])], visual: `<div class="lettertile" aria-hidden="true"><svg class="k-icon lg"><use href="#i-sound"/></svg></div>`,
      choices: opts.map(x => ({ v: x, html: `<span class="bignum" lang="en">${x.toUpperCase()} ${x}</span>`, say: [en(D.SAY[x])] })), answer: L, answerText: `${L.toUpperCase()} ${L}`, hints: [t('e.h.sound', { k: `<span lang="en">${k}</span>` })], autoSay: true,
      why: { photo: credit(k), steps: [{ text: t('e.y.sound', { L: L.toUpperCase(), s: D.AZ[L][1], k: word(k) }) }, ...(taMean(k) ? [{ text: t('e.y.soundTa', { k: word(k), ta: `<span lang="ta">${taMean(k)}</span>` }) }] : [])] } };
  } });
  skill({ id: 'e.first', subject: S, topic: 'sounds', name: 'e.skill.first', bands: { young: [1, 2], older: [1, 2] }, gen(l, r) {
    const pool = withPics(Object.keys(D.WORDS).filter(w => /^[a-z]/.test(w) && !['auto', 'okra', 'onion', 'orange', 'umbrella', 'igloo', 'aeroplane', 'elephant', 'apple'].includes(w) || ['apple', 'elephant'].includes(w)));
    const w = r.pick(pool.length ? pool : ['cat']), L = w[0], opts = r.shuffle([L, ...pickN(r, letters, l === 1 ? 2 : 3, [L])]);
    return { kind: 'choice', prompt: t('e.q.first'), say: [ui(t('e.q.first')), en(w)], visual: `<div class="wordpic">${picImg(w)}</div>`, choices: opts.map(x => ({ v: x, html: `<span class="bignum" lang="en">${x}</span>` })), answer: L, hints: [t('e.h.first')],
      why: { steps: [{ text: t('e.y.first', { w: word(w), s: D.AZ[L][1], L }) }, { text: t('e.y.pic', { w: word(w), ta: `<span lang="ta">${taMean(w)}</span>` }) }] } };
  } });

  // ---------- blending ----------
  const cvcWords = Object.keys(D.CVC);
  skill({ id: 'e.blend', subject: S, topic: 'blend', name: 'e.skill.blend', bands: { young: [1, 2], older: [1, 2] }, gen(l, r) {
    const w = r.pick(withPics(cvcWords).length ? withPics(cvcWords) : cvcWords);
    if (l === 1 && pic(w)) {
      const others = pickN(r, withPics(cvcWords), 2, [w]);
      return { kind: 'choice', prompt: t('e.q.blend'), say: [ui(t('e.q.blend')), ...w.split('').map(c => en(c)), en(w)], visual: `<div class="blend">${w.split('').map(c => `<span class="tile" lang="en">${c}</span>`).join('')}</div>`,
        choices: r.shuffle([w, ...others]).map(x => ({ v: x, img: pic(x).src })), answer: w, answerText: word(w), hints: [t('e.h.blend')],
        why: { photo: credit(w), steps: [{ text: t('e.y.blendSteps', { parts: w.split('').map(c => `/${c}/`).join(' ') }) }, { text: t('e.y.blendJoin', { w: word(w) }) }, { text: t('e.y.blendMeans', { w: word(w), ta: `<span lang="ta">${taMean(w)}</span>` }) }] } };
    }
    const near = D.CVC[w], opts = r.shuffle([w, ...near.slice(0, 3)]), x = near[0];
    return { kind: 'choice', prompt: t('e.q.hearword'), say: [ui(t('e.q.hearword')), en(w)], visual: `<div class="lettertile" aria-hidden="true"><svg class="k-icon lg"><use href="#i-sound"/></svg></div>`, autoSay: true,
      choices: opts.map(o => ({ v: o, html: `<span class="bignum" lang="en">${o}</span>` })), answer: w, answerText: word(w), hints: [t('e.h.blend')],
      why: { photo: credit(w), steps: [{ text: t('e.y.blendSteps', { parts: w.split('').map(c => `/${c}/`).join(' ') }) }, { text: t('e.y.near', { w: word(w), x: word(x), diff: diffLetters(w, x) }) }] } };
  } });

  // ---------- sight words ----------
  skill({ id: 'e.sight', subject: S, topic: 'sight', name: 'e.skill.sight', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const list = l === 1 ? D.DOLCH_PRE : D.DOLCH_PRIMER, w = r.pick(list);
    const similar = list.filter(x => x !== w).sort((a, b) => (a[0] === w[0] ? -1 : 0) - (b[0] === w[0] ? -1 : 0) || Math.abs(a.length - w.length) - Math.abs(b.length - w.length));
    const opts = r.shuffle([w, ...r.shuffle(similar.slice(0, 6)).slice(0, 3)]);
    const s = D.SENT[w];
    return { kind: 'choice', prompt: t('e.q.sight'), say: [ui(t('e.q.sight')), en(w)], autoSay: true, visual: `<div class="lettertile" aria-hidden="true"><svg class="k-icon lg"><use href="#i-sound"/></svg></div>`,
      choices: opts.map(o => ({ v: o, html: `<span class="bignum" lang="en">${esc(o)}</span>` })), answer: w, answerText: word(w), hints: [t('e.h.sight')],
      why: { steps: [{ text: t('e.y.sight', { w: word(w) }) }, ...(s ? [{ text: t('e.y.inSentence', { s: `<span lang="en">${esc(s)}</span>` }), lang: undefined }] : [])] } };
  } });

  // ---------- vocabulary (the three matching levels) ----------
  const vocabWords = () => withPics(Object.keys(D.WORDS).filter(w => D.WORDS[w].theme));
  skill({ id: 'e.pic', subject: S, topic: 'vocab', name: 'e.skill.pic', bands: { young: [1, 2], older: [1, 2] }, gen(l, r) {
    const pool = vocabWords(); if (!pool.length) return D_fallback();
    const w = r.pick(pool), th = D.WORDS[w].theme, same = pool.filter(x => D.WORDS[x].theme === th && x !== w), others = pickN(r, same.length >= 3 ? same : pool, l === 1 ? 2 : 3, [w]);
    const steps = [{ text: t('e.y.pic', { w: word(D.WORDS[w].label || w), ta: `<span lang="ta">${taMean(w)}</span>` }) }, { text: t('e.y.group', { g: I18N.loc(D.THEMES[th].title) }) }];
    if (l === 2 || r() < 0.4) return { kind: 'choice', prompt: t('e.q.picRev', { w: word(D.WORDS[w].label || w) }), say: [ui(t('e.q.picRev', { w: '' })), en(w)], choices: r.shuffle([w, ...others]).map(x => ({ v: x, img: pic(x).src })), answer: w, answerText: word(w), why: { photo: credit(w), steps } };
    return { kind: 'choice', prompt: t('e.q.pic'), visual: `<div class="wordpic">${picImg(w)}</div>`, choices: r.shuffle([w, ...others]).map(x => ({ v: x, html: `<span lang="en">${esc(D.WORDS[x].label || x)}</span>`, say: [en(D.WORDS[x].label || x)] })), answer: w, answerText: word(w), why: { photo: credit(w), steps } };
  } });
  skill({ id: 'e.sound2', subject: S, topic: 'vocab', name: 'e.skill.sound2', bands: { young: [1, 2], older: [1, 2] }, gen(l, r) {
    const pool = vocabWords().length ? vocabWords() : Object.keys(D.WORDS), w = r.pick(pool), others = pickN(r, pool.filter(x => x[0] === w[0] || x.length === w.length), 3, [w]);
    const opts = r.shuffle([w, ...(others.length >= 2 ? others : pickN(r, pool, 3, [w])).slice(0, l === 1 ? 2 : 3)]);
    return { kind: 'choice', prompt: t('e.q.sound2'), say: [ui(t('e.q.sound2')), en(D.WORDS[w].label || w)], autoSay: true, visual: `<div class="lettertile" aria-hidden="true"><svg class="k-icon lg"><use href="#i-sound"/></svg></div>`,
      choices: opts.map(x => ({ v: x, html: `<span lang="en">${esc(D.WORDS[x].label || x)}</span>` })), answer: w, answerText: word(w), why: { photo: credit(w), steps: [{ text: t('e.y.pic', { w: word(w), ta: `<span lang="ta">${taMean(w)}</span>` }) }] } };
  } });
  skill({ id: 'e.tamil', subject: S, topic: 'vocab', name: 'e.skill.tamil', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const pool = Object.keys(D.WORDS).filter(w => D.WORDS[w].theme), w = r.pick(pool), others = pickN(r, pool, 3, [w]), rev = l === 2 && r() < 0.6;
    if (rev) return { kind: 'choice', prompt: t('e.q.tamilRev', { ta: `<span lang="ta">${taMean(w)}</span>` }), say: [ui(t('e.q.tamilRev', { ta: taMean(w) }))], choices: r.shuffle([w, ...others]).map(x => ({ v: x, html: `<span lang="en">${esc(D.WORDS[x].label || x)}</span>` })), answer: w, answerText: word(w), why: { photo: credit(w), steps: [{ text: t('e.y.tamil', { w: word(w), ta: `<span lang="ta">${taMean(w)}</span>` }) }] } };
    return { kind: 'choice', prompt: t('e.q.tamil', { w: word(D.WORDS[w].label || w) }), say: [ui(t('e.q.tamil', { w: '' })), en(w)], visual: pic(w) ? `<div class="wordpic">${picImg(w)}</div>` : null,
      choices: r.shuffle([w, ...others]).map(x => ({ v: x, html: `<span lang="ta">${taMean(x)}</span>`, lang: 'ta' })), answer: w, answerText: `<span lang="ta">${taMean(w)}</span>`, why: { photo: credit(w), steps: [{ text: t('e.y.tamil', { w: word(w), ta: `<span lang="ta">${taMean(w)}</span>` }) }] } };
  } });
  function D_fallback() { return { kind: 'choice', prompt: t('e.q.tamil', { w: 'cat' }), choices: [{ v: 'cat', html: 'பூனை' }, { v: 'dog', html: 'நாய்' }], answer: 'cat', why: { steps: [{ text: t('e.y.tamil', { w: 'cat', ta: 'பூனை' }) }] } }; }

  // ---------- spelling ----------
  const patternOf = w => Object.keys(D.PATTERNS).find(p => D.PATTERNS[p].words.includes(w)) || 'cvc';
  const spellHtml = (w, missed = [], pat) => { const m = pat && D.PATTERNS[pat].mark ? w.match(new RegExp(D.PATTERNS[pat].mark)) : null; const ps = m ? [m.index, m.index + m[0].length] : [-1, -1];
    return `<div class="spell" lang="en" aria-label="${w.split('').join(' ')}">${w.split('').map((c, i) => `<span class="${missed.includes(i) ? 'miss' : i >= ps[0] && i < ps[1] ? 'pat' : ''}">${c}</span>`).join('')}</div>`; };
  function spellWhy(w, given) {
    const pat = patternOf(w), missed = []; for (let i = 0; i < w.length; i++) if ((given || '')[i] !== w[i]) missed.push(i);
    return { steps: [{ text: t('e.y.spell', { w: word(w), letters: w.split('').join('-') }), vis: spellHtml(w, given != null ? missed : [], pat) }, { text: t('e.y.pattern', { p: t('e.pattern.' + pat) }) }, ...(D.SENT[w] ? [{ text: t('e.y.inSentence', { s: `<span lang="en">${esc(D.SENT[w])}</span>` }) }] : [])], photo: credit(w) };
  }
  skill({ id: 'e.spell', subject: S, topic: 'spell', name: 'e.skill.spell', bands: { young: [1, 1], older: [1, 3] }, gen(l, r) {
    const pools = [D.PATTERNS.cvc.words, [...D.PATTERNS.silentE.words, ...D.PATTERNS.ck.words, ...D.PATTERNS.double.words], [...D.PATTERNS.aiay.words, ...D.PATTERNS.eeea.words, ...D.PATTERNS.sh.words, ...D.PATTERNS.oaow.words, ...D.PATTERNS.igh.words]];
    const w = r.pick(pools[l - 1]), extra = r.shuffle('abcdefghijklmnoprstuw'.split('').filter(c => !w.includes(c))).slice(0, l === 1 ? 2 : 3);
    const q = { kind: 'tiles', prompt: t('e.q.spell'), say: [ui(t('e.q.spell')), en(w), ...(D.SENT[w] ? [en(D.SENT[w])] : []), en(w)], autoSay: true, visual: pic(w) ? `<div class="wordpic">${picImg(w)}</div>` : `<div class="lettertile" aria-hidden="true"><svg class="k-icon lg"><use href="#i-sound"/></svg></div>`,
      tiles: r.shuffle([...w.split(''), ...extra]), answer: w, answerText: word(w), hints: [t('e.h.spell', { f: w[0] }), t('e.h.spell2', { n: w.length })] };
    q.why = spellWhy(w); q.whyFor = g => spellWhy(w, g);
    return q;
  } });

  // ---------- reading ----------
  skill({ id: 'e.read', subject: S, topic: 'read', name: 'e.skill.read', bands: { young: [1, 1], older: [1, 2] }, warm: false, gen(l, r) {
    const ps = tx('e.read').filter(p => p.lvl <= l), p = r.pick(ps.filter(x => x.lvl === l).length ? ps.filter(x => x.lvl === l) : ps), q = r.pick(p.qs);
    return { kind: 'choice', prompt: `<span lang="en">${esc(q.q)}</span>`, promptLang: 'en', say: [en(p.title + '. ' + p.text), en(q.q)], visual: `<article class="passage-card"><p class="eyebrow">${t('e.ui.story')}</p><h3 lang="en">${esc(p.title)}</h3><p class="passage" lang="en">${esc(p.text)}</p></article>`, boardClass: 'light passage-board',
      choices: r.shuffle(q.o).map(o => ({ v: o, html: `<span lang="en">${esc(o)}</span>` })), answer: q.a, answerText: word(q.a), hints: [t('e.h.read')], why: { steps: [{ text: t('e.y.readFind', { line: `<span lang="en">${esc(q.line)}</span>` }) }] } };
  } });

  // ---------- grammar ----------
  const G = () => tx('e.gram');
  skill({ id: 'e.noun', subject: S, topic: 'grammar', name: 'e.skill.noun', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const g = G(), kind = r.pick(Object.keys(g.nouns)), w = r.pick(g.nouns[kind]), others = pickN(r, g.verbs, 2);
    return { kind: 'choice', prompt: t('e.q.noun'), choices: r.shuffle([w, ...others]).map(x => ({ v: x, html: `<span lang="en">${x}</span>`, say: [en(x)] })), answer: w, answerText: word(w), hints: [t('e.h.noun')],
      why: { steps: [{ text: t('e.y.noun', { w: word(w), kind: t('e.kind.' + kind) }) }, { text: t('e.y.notNoun', { others: others.map(word).join(', ') }) }] } };
  } });
  skill({ id: 'e.verb', subject: S, topic: 'grammar', name: 'e.skill.verb', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const g = G(), w = r.pick(g.verbs), all = Object.values(g.nouns).flat(), others = pickN(r, all, 2);
    return { kind: 'choice', prompt: t('e.q.verb'), choices: r.shuffle([w, ...others]).map(x => ({ v: x, html: `<span lang="en">${x}</span>`, say: [en(x)] })), answer: w, answerText: word(w), hints: [t('e.h.verb')],
      why: { steps: [{ text: t('e.y.verb', { w: word(w) }) }, { text: t('e.y.notVerb', { others: others.map(word).join(', ') }) }] } };
  } });
  skill({ id: 'e.order', subject: S, topic: 'grammar', name: 'e.skill.order', bands: { young: [1, 1], older: [1, 2] }, warm: false, gen(l, r) {
    const s = r.pick(G().sentences.filter(x => l === 1 ? x.length <= 4 : true)), str = s.join(' ');
    let tiles = r.shuffle(s); if (tiles.join(' ') === str) tiles = [...s].reverse();
    return { kind: 'tiles', words: true, prompt: t('e.q.order'), say: [ui(t('e.q.order'))], tiles, answer: str, answerText: `<span lang="en">${esc(str)}</span>`, hints: [t('e.h.order')],
      why: { steps: [{ text: t('e.y.order', { s: `<span lang="en">${esc(str)}</span>` }) }, { text: t('e.y.orderWho', { who: `<span lang="en">${esc(s[0] === 'The' || s[0] === 'My' ? s.slice(0, 2).join(' ') : s[0])}</span>` }) }, { text: t('e.y.capsOk') }] } };
  } });
  skill({ id: 'e.caps', subject: S, topic: 'grammar', name: 'e.skill.caps', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const s = r.pick(G().sentences).join(' '), low = s[0].toLowerCase() + s.slice(1), noStop = s.slice(0, -1), both = low.slice(0, -1);
    const opts = r.shuffle([s, low, noStop, ...(l === 2 ? [both] : [])]);
    return { kind: 'choice', prompt: t('e.q.caps'), choices: opts.map(o => ({ v: o, html: `<span lang="en">${esc(o)}</span>`, say: [en(o)] })), answer: s, answerText: `<span lang="en">${esc(s)}</span>`, hints: [t('e.h.caps')],
      why: { steps: [{ text: t('e.y.capsOk') }, { text: t('e.y.capsWhy', { s: `<span lang="en">${esc(s)}</span>` }) }, ...(s.includes(' I ') || s.startsWith('I ') ? [{ text: t('e.y.capsI') }] : [])] } };
  } });
  skill({ id: 'e.plural', subject: S, topic: 'grammar', name: 'e.skill.plural', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const list = G().plurals.filter(p => l === 1 ? p[2] === 's' || p[2] === 'es' : true), [w, p, end] = r.pick(list);
    const wrong = [w + 's', w + 'es', w.replace(/y$/, 'ys')].filter(x => x !== p);
    const opts = r.shuffle([p, ...[...new Set(wrong)].slice(0, 2)]);
    return { kind: 'choice', prompt: t('e.q.plural', { w: word(w) }), say: [ui(t('e.q.plural', { w: '' })), en(w)], choices: opts.map(o => ({ v: o, html: `<span lang="en">${o}</span>`, say: [en(o)] })), answer: p, answerText: word(p), hints: [t('e.h.plural')],
      why: { steps: [{ text: end === '*' ? t('e.y.pluralOdd', { w: word(w), p: word(p) }) : t('e.y.plural', { w: word(w), end, p: word(p) }) }] } };
  } });

  // ---------- lessons ----------
  const W = {
    sounds: [
      el => { let cur = 'a'; el.innerHTML = `<div class="board" data-v></div><div class="abc" role="group">${letters.map(L => `<button type="button" data-l="${L}" lang="en" aria-label="${L}">${L}</button>`).join('')}</div>`;
        const draw = () => { const k = D.AZ[cur][0]; el.querySelector('[data-v]').innerHTML = `<div class="wordpic"><div class="lettertile" lang="en">${cur.toUpperCase()}<small>${cur}</small></div><p class="bignum" lang="en" style="font-size:24px">/${D.AZ[cur][1]}/ · ${k}</p>${meanTag(k)}${pic(k) ? picImg(k) : ''}</div>`; el.querySelectorAll('[data-l]').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === cur)); };
        el.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { cur = b.dataset.l; draw(); Voice.play([en(soundSay(cur))], null, {}); }); draw(); },
      el => { el.innerHTML = `<div class="board"><div class="blend">${['a', 'e', 'i', 'o', 'u'].map(v => `<button type="button" class="tile" lang="en" data-v="${v}">${v}</button>`).join('')}</div></div><p class="caption">${t('e.ui.vowels')}: a e i o u</p>`;
        el.querySelectorAll('[data-v]').forEach(b => b.onclick = () => Voice.play([en(soundSay(b.dataset.v))], null, {})); },
    ],
    blend: [
      el => { let w = 'cat'; el.innerHTML = `<div class="chips">${Object.keys(D.CVC).map(x => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-w="${x}" lang="en">${x}</button>`).join('')}</div><div class="board" data-v></div><div class="controls"><button type="button" class="k-btn k-btn-primary" data-blend>${t('e.ui.blend')}</button></div>`;
        const draw = () => { el.querySelector('[data-v]').innerHTML = `<div class="wordpic"><div class="blend">${w.split('').map(c => `<button type="button" class="tile" data-c="${c}" lang="en">${c}</button>`).join('<span class="blend-arrow">·</span>')}</div>${pic(w) ? picImg(w) : ''}${meanTag(w)}</div>`; el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => Voice.play([en(D.SAY[b.dataset.c].split(',')[0])], null, {})); el.querySelectorAll('[data-w]').forEach(b => b.setAttribute('aria-pressed', b.dataset.w === w)); };
        el.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { w = b.dataset.w; draw(); });
        el.querySelector('[data-blend]').onclick = () => Voice.play([...w.split('').map(c => ({ text: D.SAY[c].split(',')[0], lang: 'en', slow: true })), { text: w, lang: 'en', slow: true }, en(w)], null, {}); draw(); },
      el => { el.innerHTML = `<div class="board"><div class="blend">${['cat', 'cut', 'cot'].map(x => `<button type="button" class="tile word" data-w="${x}" lang="en">${x}</button>`).join('')}</div></div>`; el.querySelectorAll('[data-w]').forEach(b => b.onclick = () => Voice.play([en(b.dataset.w)], null, {})); },
    ],
    sight: [0, 1].map(k => el => { const list = k ? D.DOLCH_PRIMER : D.DOLCH_PRE; el.innerHTML = `<div class="sightgrid">${list.map(w => `<button type="button" lang="en" data-w="${w}">${w}</button>`).join('')}</div><p class="caption" aria-live="polite"></p>`;
      el.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { const w = b.dataset.w; el.querySelector('.caption').innerHTML = D.SENT[w] ? `<span lang="en">${esc(D.SENT[w])}</span>` : `<span lang="en">${w}</span>`; Voice.play([en(w), ...(D.SENT[w] ? [en(D.SENT[w])] : [])], null, {}); }); }),
    vocab: [
      el => { let th = 'animals'; el.innerHTML = `<div class="chips">${Object.keys(D.THEMES).map(x => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-t="${x}">${I18N.loc(D.THEMES[x].title)}</button>`).join('')}</div><div class="vocab-grid" data-v></div><p class="small muted">${t('e.ui.picCredit')}</p>`;
        const draw = () => { el.querySelector('[data-v]').innerHTML = Object.keys(D.THEMES[th].words).map(w => `<button type="button" data-w="${w}">${picImg(w)}<span lang="en">${esc(D.WORDS[w].label || w)}</span><small lang="ta">${taMean(w)}</small></button>`).join(''); el.querySelectorAll('[data-t]').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === th)); el.querySelectorAll('[data-w]').forEach(b => b.onclick = () => Voice.play([en(D.WORDS[b.dataset.w].label || b.dataset.w), ...(I18N.lang === 'ta' ? [{ text: taMean(b.dataset.w), lang: 'ta' }] : [])], null, { onMissing: () => {} })); };
        el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { th = b.dataset.t; draw(); }); draw(); },
    ],
    spell: [
      el => { el.innerHTML = `<ul class="patlist">${Object.keys(D.PATTERNS).map(p => `<li><b>${t('e.pattern.' + p)}</b><div>${D.PATTERNS[p].words.slice(0, 4).map(w => spellHtml(w, [], p)).join('')}</div></li>`).join('')}</ul>`; },
      el => { el.innerHTML = `<div class="board light"><ol class="lscw"><li>Look</li><li>Say</li><li>Cover</li><li>Write</li><li>Check</li></ol></div>`; },
    ],
    read: [
      el => { const ps = tx('e.read'); let i = 0; el.innerHTML = `<div class="chips">${ps.map((p, k) => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-i="${k}" lang="en">${esc(p.title)}</button>`).join('')}</div><article class="k-card passage-card" data-v></article>`;
        const draw = () => { const p = ps[i]; el.querySelector('[data-v]').innerHTML = `<div class="lesson-head"><h3 lang="en">${esc(p.title)}</h3>${Engine.listenBtn('plisten')}</div><p class="passage" lang="en">${esc(p.text)}</p>`; Engine.bindListen(el.querySelector('.plisten'), [en(p.title + '. ' + p.text)]); el.querySelectorAll('[data-i]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === i)); };
        el.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { i = +b.dataset.i; draw(); }); draw(); },
    ],
    grammar: [
      el => { const g = G(), words = [...Object.values(g.nouns).map(a => a[0]), ...g.verbs.slice(0, 5)].sort(); el.innerHTML = `<div class="sightgrid">${words.map(w => `<button type="button" lang="en" data-w="${w}">${w}</button>`).join('')}</div><p class="caption bigcap" aria-live="polite"></p>`;
        el.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { const w = b.dataset.w, isVerb = g.verbs.includes(w); el.querySelector('.caption').innerHTML = `<span lang="en">${w}</span> · ${t(isVerb ? 'e.ui.verb' : 'e.ui.noun')}`; Voice.play([en(w)], null, {}); }); },
      el => { el.innerHTML = `<div class="board light"><p class="passage" lang="en"><mark>T</mark>he cat drinks milk<mark>.</mark></p></div>`; },
    ],
  };
  const TOPICS = [
    { id: 'sounds', skills: ['e.sound', 'e.first'], icon: 'i-letter' },
    { id: 'blend', skills: ['e.blend'], icon: 'i-blend' },
    { id: 'sight', skills: ['e.sight'], icon: 'i-eye' },
    { id: 'vocab', skills: ['e.pic', 'e.sound2', 'e.tamil'], icon: 'i-image' },
    { id: 'spell', skills: ['e.spell', 'e.bee'], icon: 'i-pencil' },
    { id: 'read', skills: ['e.read'], icon: 'i-book' },
    { id: 'grammar', skills: ['e.noun', 'e.verb', 'e.order', 'e.caps', 'e.plural'], icon: 'i-english', bands: ['older'] },
  ].map(tp => ({ ...tp, subject: S, title: `e.topic.${tp.id}.title`, blurb: `e.topic.${tp.id}.blurb`, lesson: () => tx(`e.lesson.${tp.id}`).map((s, i) => ({ title: s.t, body: s.b, widget: W[tp.id][i] })) }));
  window.ENGLISH = { TOPICS, spellHtml, spellWhy, patternOf, picImg, credit, taMean, pic };
})();
