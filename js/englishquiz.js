// English quiz: a fast, mixed round drawn from the English topics the child has unlocked.
// It does not repeat the spelling bee, word puzzles, stories or typing: every question is a quick-fire
// pick (first sounds, rhymes, picture words, opposites, Tamil meanings, sight words, grammar, sentences,
// short original reading passages, punctuation, question words, synonyms, prefixes and suffixes, homophones).
// Runs through the shared engine, so the hint ladder, lesson card, mastery and the review queue come for free.
// Every item carries an age range [min, max]; gen() only uses items that fit ctx.age (AGE lookups, never band).
// Modes: Quick quiz (AGE round size), one topic, Beat your best (age 9–10: a quiet ring per question), daily(p, n).
(function () {
  const { skill } = Engine, D = EN_DATA, S = 'english', TOPIC = 'englishquiz', QUICK = 'englishquiz', BEST = 'eq-best', esc = Engine.esc;
  const en = text => ({ text, lang: 'en' }), ui = text => ({ text, lang: I18N.lang });
  const E = s => `<span lang="en">${esc(s)}</span>`;
  const TA = s => `<span lang="ta">${esc(s)}</span>`;
  const strip = h => String(h ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const pic = w => window.PICS?.[w] || null;
  const photo = w => { const p = w && pic(w); return p ? { src: p.src, credit: p.credit || 'Wikimedia Commons', href: p.page, alt: w } : null; };
  const taOf = w => D.WORDS[w]?.ta || D.SPELL_TA?.[w] || '';
  const ladder = (a, b, c) => [a, b, c].map(x => typeof x === 'string' ? { text: x } : x);
  const sound = `<span class="eq-sound" aria-hidden="true"><svg class="k-icon"><use href="#i-sound"/></svg></span>`;
  const board = (inner, cls = '') => `<div class="eq-board ${cls}">${inner}</div>`;
  const bigWord = w => `<p class="eq-word" lang="en">${esc(w)}</p>`;
  const picTag = (w, cls = 'eq-pic') => pic(w) ? `<img class="${cls}" src="${pic(w).src}" alt="${esc(w)}" loading="lazy" referrerpolicy="no-referrer">` : '';
  const sent = s => `<p class="eq-sent" lang="en">${esc(s).replace(/___/g, '<span class="eq-blank" aria-label="blank">&nbsp;</span>')}</p>`;
  const wordChoices = list => list.map(w => ({ v: w, html: E(w), lang: 'en' }));
  const picChoices = (list, sayIt) => list.map(w => ({ v: w, img: pic(w).src, html: `<span class="k-sr-only" lang="en">${esc(w)}</span>`, lang: 'en', ...(sayIt ? { say: [en(w)] } : {}) }));
  const uniq = a => [...new Set(a)];
  // items that fit this age; if none (a review replayed after a birthday), the nearest age band
  function fit(list, age) {
    const ok = list.filter(x => age >= (x.min ?? 3) && age <= (x.max ?? 10)); if (ok.length) return ok;
    const d = x => age < (x.min ?? 3) ? (x.min ?? 3) - age : age - (x.max ?? 10), m = Math.min(...list.map(d));
    return list.filter(x => d(x) === m);
  }
  const pickFit = (r, list, age) => r.pick(fit(list, age));
  const others = (r, pool, n, not) => r.shuffle(uniq(pool).filter(x => !not.includes(x))).slice(0, n);

  // ---------- registration: answer-revealing ladder, English choice voices for young readers, Beat-your-best ring ----------
  const SEC = { 'eq.comp': 50, 'eq.order': 35, 'eq.sentence': 30, 'eq.caps': 30, 'eq.punct': 30, 'eq.homophone': 30, 'eq.qword': 25, 'eq.affix': 25 };
  const ring = sec => `<svg class="eq-ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="bg" cx="22" cy="22" r="18"/><circle class="fg" cx="22" cy="22" r="18" pathLength="100" style="animation-duration:${sec}s"/></svg><span class="k-sr-only">${t('eq.ui.timeLimit', { s: sec })}</span>`;
  const IDS = [], META = {};
  function reg(def) {
    IDS.push(def.id); META[def.id] = { min: def.min, max: def.max };
    return skill({ subject: S, topic: TOPIC, bands: def.bands || { young: [1, 2], older: [1, 3] }, ...def, gen(l, r, c) {
      c = c || {}; const age = c.age ?? 6;
      const q = def.gen(l, r, { ...c, age });
      q.hintRevealsAnswer = true;
      if (!q.say) q.say = [ui(strip(q.prompt))];
      if (age <= 4) q.autoSay = true;
      if (age <= 5 && q.kind === 'choice' && !q.noChoiceSay) q.choices.forEach(ch => { if (!ch.say && ch.lang) ch.say = [{ text: strip(ch.html) || ch.v, lang: ch.lang }]; });
      if (q.kind === 'choice' && !q.choices.some(ch => ch.v === q.answer)) q.choices.push({ v: q.answer, html: E(q.answer), lang: 'en' });
      if (!q.visual) q.visual = board('');
      if (Engine.round?.mode === BEST && Engine.round?.topic === TOPIC) q.visual = `<div class="eq-timed">${ring(SEC[def.id] || 20)}${q.visual}</div>`;
      return q;
    } });
  }

  // ======================= sounds: first sound (3–6) =======================
  const letters = Object.keys(D.AZ);
  const cls = L => (L === 'c' || L === 'k') ? 'k' : L;
  const FIRST = Object.keys(D.WORDS).filter(w => pic(w) && /^[a-z]/.test(w) && !/^(sh|ch|th|wh|ph|kn)/.test(w) && !['auto', 'aeroplane', 'okra', 'onion', 'orange', 'umbrella', 'igloo', 'school'].includes(w));
  const soundOf = L => D.SAY[L];
  reg({ id: 'eq.first', name: 'eq.skill.first', min: 3, max: 6, gen(l, r, c) {
    const w = r.pick(FIRST), L = w[0], ex = D.AZ[L][0];
    const why = { photo: photo(w), steps: [{ text: t('eq.y.first', { w: E(w), s: E('/' + D.AZ[L][1] + '/'), L: E(L) }) }, ...(taOf(w) ? [{ text: t('eq.y.meansTa', { w: E(w), ta: TA(taOf(w)) }) }] : [])], rule: t('eq.r.first') };
    if (c.age <= 4) {   // picture and sound only: hear a sound, tap the picture that starts with it
      const opts = r.shuffle([w, ...others(r, FIRST.filter(x => cls(x[0]) !== cls(L)), 3, [w])]);
      return { kind: 'choice', prompt: t('eq.q.firstPic'), say: [ui(t('eq.q.firstPic')), en(soundOf(L)), en(soundOf(L))], autoSay: true, visual: board(sound), eqAge: [3, 4],
        choices: picChoices(opts, true), answer: w, answerText: E(w),
        hints: ladder(t('eq.h.first1'), { text: t('eq.h.firstPic2', { s: E(soundOf(L)), k: E(ex) }) }, { text: t('eq.h.ans', { a: E(w) }), vis: picTag(w, 'eq-hpic') }), why };
    }
    const opts = r.shuffle([L, ...others(r, letters.filter(x => cls(x) !== cls(L)), 3, [L])]);
    return { kind: 'choice', prompt: t('eq.q.firstLetter'), say: [ui(t('eq.q.firstLetter')), en(w)], visual: board(picTag(w)), eqAge: [5, 6],
      choices: opts.map(x => ({ v: x, html: `<span class="bignum" lang="en">${x}</span>`, lang: 'en', say: [en(soundOf(x))] })), answer: L, answerText: E(L), noChoiceSay: true,
      hints: ladder(t('eq.h.first1'), t('eq.h.first2', { w: E(w) }), t('eq.h.ans', { a: E(L) })), why };
  } });

  // ======================= sounds: rhymes (5–8) =======================
  const RHYME = [['cat', 'hat', 'bat', 'mat', 'rat'], ['dog', 'log', 'frog', 'fog'], ['sun', 'bun', 'run', 'fun'], ['hen', 'pen', 'ten', 'men'], ['cake', 'lake', 'make', 'snake'],
    ['bee', 'tree', 'see', 'three'], ['star', 'car', 'jar'], ['king', 'ring', 'sing', 'wing'], ['boat', 'coat', 'goat'], ['ball', 'tall', 'wall', 'call'], ['bed', 'red', 'fed'], ['top', 'mop', 'hop'], ['kite', 'bite', 'white'], ['cup', 'pup', 'up']];
  reg({ id: 'eq.rhyme', name: 'eq.skill.rhyme', min: 5, max: 8, gen(l, r, c) {
    const fam = r.pick(RHYME), [w, a] = r.shuffle(fam), wrong = others(r, RHYME.filter(f => f !== fam).flat(), 3, []);
    const end = w.slice(w.search(/[aeiou][^aeiou]*e?$/));
    return { kind: 'choice', prompt: t('eq.q.rhyme'), say: [ui(t('eq.q.rhyme')), en(w)], visual: board(`${picTag(w, 'eq-pic sm')}${bigWord(w)}`), eqAge: [5, 8],
      choices: wordChoices(r.shuffle([a, ...wrong])), answer: a, answerText: E(a),
      hints: ladder(t('eq.h.rhyme1'), t('eq.h.rhyme2', { e: E('-' + end), w: E(w) }), t('eq.h.ans', { a: E(a) })),
      why: { photo: photo(pic(a) ? a : w), steps: [{ text: t('eq.y.rhyme', { w: E(w), a: E(a), e: E('-' + end) }) }, { text: t('eq.y.rhymeMore', { list: E(fam.join(', ')) }) }], rule: t('eq.r.rhyme') } };
  } });

  // ======================= vocabulary: picture and word (3–7) =======================
  const VOC = Object.keys(D.WORDS).filter(w => pic(w) && D.WORDS[w].theme);
  reg({ id: 'eq.picword', name: 'eq.skill.picword', min: 3, max: 7, gen(l, r, c) {
    const w = r.pick(VOC), th = D.WORDS[w].theme, same = VOC.filter(x => D.WORDS[x].theme === th), diff = VOC.filter(x => D.WORDS[x].theme !== th);
    const opts = r.shuffle([w, ...others(r, l >= 2 && c.age >= 5 ? same : diff, 3, [w])]);
    const why = { photo: photo(w), steps: [{ text: t('eq.y.picword', { w: E(w), th: t('eq.theme.' + th) }) }, ...(taOf(w) ? [{ text: t('eq.y.meansTa', { w: E(w), ta: TA(taOf(w)) }) }] : []), ...(D.SENT[w] ? [{ text: t('eq.y.inSentence', { s: E(D.SENT[w]) }) }] : [])], rule: t('eq.r.picword') };
    if (c.age <= 4) return { kind: 'choice', prompt: t('eq.q.hearPic'), say: [ui(t('eq.q.hearPic')), en(w), en(w)], autoSay: true, visual: board(sound), eqAge: [3, 4], noChoiceSay: true,
      choices: picChoices(opts, false), answer: w, answerText: E(w), hints: ladder(t('eq.h.hearPic1'), { text: t('eq.h.hearPic2', { th: t('eq.theme.' + th) }) }, { text: t('eq.h.ans', { a: E(w) }), vis: picTag(w, 'eq-hpic') }), why };
    return { kind: 'choice', prompt: t('eq.q.picWord'), say: [ui(t('eq.q.picWord'))], visual: board(picTag(w)), eqAge: [5, 7],
      choices: wordChoices(opts), answer: w, answerText: E(w), hints: ladder(t('eq.h.picWord1'), t('eq.h.picWord2', { L: E(w[0]), n: w.length }), t('eq.h.ans', { a: E(w) })), why };
  } });

  // ======================= vocabulary: categories (4–8) =======================
  const BIRDS = ['parrot', 'peacock', 'crow', 'hen', 'duck'];
  const NOTFRUIT = ['tomato', 'cucumber', 'pumpkin', 'brinjal', 'okra', 'peas'];
  const themeWords = th => VOC.filter(w => D.WORDS[w].theme === th);
  const CATS = [
    { id: 'fruit', min: 4, words: () => themeWords('fruits'), not: () => [...themeWords('fruits'), ...NOTFRUIT] },
    { id: 'veg', min: 4, words: () => themeWords('vegetables').filter(w => !['tomato'].includes(w)), not: () => [...themeWords('vegetables'), ...themeWords('fruits')] },
    { id: 'animal', min: 4, words: () => themeWords('animals'), not: () => [...themeWords('animals'), ...themeWords('creatures'), 'fox', 'yak'] },
    { id: 'bird', min: 5, words: () => BIRDS.filter(pic), not: () => [...BIRDS, 'butterfly', 'bee', 'aeroplane'] },
    { id: 'travel', min: 5, words: () => themeWords('travel'), not: () => themeWords('travel') },
    { id: 'home', min: 6, words: () => themeWords('home'), not: () => [...themeWords('home'), 'book', 'bag', 'pencil', 'doll', 'ball', 'drum', 'top', 'key', 'quilt', 'umbrella', 'kite', 'swing', 'school'] },
  ];
  reg({ id: 'eq.category', name: 'eq.skill.category', min: 4, max: 8, gen(l, r, c) {
    const C = pickFit(r, CATS.map(x => ({ ...x, max: 8 })), c.age), w = r.pick(C.words()), bad = VOC.filter(x => !C.not().includes(x));
    const opts = r.shuffle([w, ...others(r, bad, 3, [w])]), pics = c.age <= 5, more = C.words().filter(x => x !== w).slice(0, 3);
    return { kind: 'choice', prompt: t('eq.q.cat', { c: t('eq.cat.' + C.id) }), say: [ui(t('eq.q.cat', { c: strip(t('eq.cat.' + C.id)) }))], autoSay: c.age <= 5, eqAge: [C.min, 8],
      visual: board(`<p class="eq-cat">${t('eq.cat.' + C.id)}</p>`), noChoiceSay: !pics,
      choices: pics ? picChoices(opts, true) : wordChoices(opts), answer: w, answerText: E(w),
      hints: ladder(t('eq.h.cat1', { c: t('eq.cat.' + C.id) }), t('eq.h.cat2.' + C.id), { text: t('eq.h.ans', { a: E(w) }), vis: picTag(w, 'eq-hpic') }),
      why: { photo: photo(w), steps: [{ text: t('eq.y.cat', { w: E(w), c: t('eq.cat.' + C.id) }) }, { text: t('eq.y.catMore', { c: t('eq.cat.' + C.id), list: E(more.join(', ')) }) }], rule: t('eq.r.cat') } };
  } });

  // ======================= vocabulary: opposites (5–10; harder antonyms 9–10) =======================
  const OPP = [['hot', 'cold', 'sun'], ['big', 'small', 'elephant'], ['up', 'down', 'kite'], ['day', 'night', 'moon'], ['fast', 'slow', 'snail'], ['open', 'shut', 'door'], ['happy', 'sad'], ['wet', 'dry', 'umbrella'],
    ['full', 'empty', 'cup'], ['tall', 'short', 'tree'], ['old', 'new'], ['in', 'out'], ['push', 'pull'], ['clean', 'dirty'], ['hard', 'soft'], ['early', 'late', 'clock']].map(([w, a, p]) => ({ w, a, p, min: 5, max: 8 }))
    .concat([['ancient', 'modern'], ['generous', 'selfish'], ['arrive', 'depart', 'train'], ['accept', 'refuse'], ['increase', 'decrease'], ['victory', 'defeat'], ['polite', 'rude'], ['deep', 'shallow', 'river'],
      ['rough', 'smooth', 'stone'], ['cheap', 'expensive'], ['brave', 'afraid'], ['strong', 'weak'], ['noisy', 'quiet', 'drum'], ['float', 'sink', 'boat']].map(([w, a, p]) => ({ w, a, p, min: 9, max: 10 })));
  reg({ id: 'eq.opposite', name: 'eq.skill.opposite', min: 5, max: 10, gen(l, r, c) {
    const it = pickFit(r, OPP, c.age), flip = r() < 0.4, w = flip ? it.a : it.w, a = flip ? it.w : it.a;
    const pool = fit(OPP, c.age).filter(x => x !== it).flatMap(x => [x.w, x.a]);
    return { kind: 'choice', prompt: t('eq.q.opp'), say: [ui(t('eq.q.opp')), en(w)], visual: board(`${it.p ? picTag(it.p, 'eq-pic sm') : ''}${bigWord(w)}`), eqAge: [it.min, it.max],
      choices: wordChoices(r.shuffle([a, ...others(r, pool, 3, [w, a])])), answer: a, answerText: E(a),
      hints: ladder(t('eq.h.opp1'), t('eq.h.opp2', { w: E(w) }), t('eq.h.ans', { a: E(a) })),
      why: { photo: photo(it.p), steps: [{ text: t('eq.y.opp', { w: E(w), a: E(a) }) }, { text: t('eq.y.example', { s: E(oppSentence(it)) }) }], rule: t('eq.r.opp') } };
  } });
  function oppSentence(it) {
    const S2 = { hot: 'The tea is hot but the water is cold.', big: 'An elephant is big but an ant is small.', up: 'The kite goes up and then comes down.', day: 'We play in the day and sleep at night.', fast: 'A train is fast but a snail is slow.',
      open: 'Open the door, then shut it.', happy: 'I was sad, now I am happy.', wet: 'My shirt was wet, now it is dry.', full: 'The cup was full, now it is empty.', tall: 'The tree is tall but the plant is short.', old: 'My old bag is torn, my new bag is blue.',
      in: 'Come in, then go out to play.', push: 'Push the door, then pull it.', clean: 'My hands were dirty, now they are clean.', hard: 'A stone is hard but a pillow is soft.', early: 'I woke up early but the bus was late.',
      ancient: 'The temple is ancient but the bridge is modern.', generous: 'A generous child shares; a selfish child does not.', arrive: 'Trains arrive and depart all day.', accept: 'She will accept the gift, not refuse it.', increase: 'Prices increase and decrease.',
      victory: 'After the defeat, our team worked hard for victory.', polite: 'Say please. Be polite, not rude.', deep: 'The river is deep here and shallow there.', rough: 'The rock is rough but the pebble is smooth.', cheap: 'The pencil is cheap but the watch is expensive.',
      brave: 'Ravi was afraid at first, then he was brave.', strong: 'An ox is strong; a kitten is weak.', noisy: 'The class was noisy, then quiet.', float: 'A leaf will float but a stone will sink.' };
    return S2[it.w] || `${it.w} / ${it.a}`;
  }

  // ======================= vocabulary: English and Tamil meanings (5–10) =======================
  const TAW = VOC.filter(w => D.WORDS[w].ta);
  reg({ id: 'eq.tamil', name: 'eq.skill.tamil', min: 5, max: 10, gen(l, r, c) {
    const mode = pickFit(r, [{ id: 'toTa', min: 5, max: 10 }, { id: 'toEn', min: 7, max: 10 }], c.age), w = r.pick(TAW), th = D.WORDS[w].theme;
    const opts = r.shuffle([w, ...others(r, TAW.filter(x => D.WORDS[x].theme === th && D.WORDS[x].ta !== D.WORDS[w].ta), 3, [w])]);
    const why = { photo: photo(w), steps: [{ text: t('eq.y.tamil', { w: E(w), ta: TA(taOf(w)) }) }, ...(D.SENT[w] ? [{ text: t('eq.y.inSentence', { s: E(D.SENT[w]) }) }] : [])], rule: t('eq.r.tamil') };
    if (mode.id === 'toTa') return { kind: 'choice', prompt: t('eq.q.toTa'), say: [ui(t('eq.q.toTa')), en(w)], visual: board(`${c.age <= 6 ? picTag(w, 'eq-pic sm') : ''}${bigWord(w)}`), eqAge: [5, 10],
      choices: opts.map(x => ({ v: x, html: TA(taOf(x)), lang: 'ta' })), answer: w, answerText: TA(taOf(w)),
      hints: ladder(t('eq.h.tamil1'), { text: t('eq.h.tamil2', { th: t('eq.theme.' + th) }), vis: picTag(w, 'eq-hpic') }, t('eq.h.ans', { a: TA(taOf(w)) })), why };
    return { kind: 'choice', prompt: t('eq.q.toEn'), say: [ui(t('eq.q.toEn')), { text: taOf(w), lang: 'ta' }], visual: board(`<p class="eq-word ta" lang="ta">${esc(taOf(w))}</p>`), eqAge: [7, 10],
      choices: wordChoices(opts), answer: w, answerText: E(w), hints: ladder(t('eq.h.tamil1'), { text: t('eq.h.tamil2', { th: t('eq.theme.' + th) }), vis: picTag(w, 'eq-hpic') }, t('eq.h.ans', { a: E(w) })), why };
  } });

  // ======================= sight words: hear it, tap it (5–8) =======================
  const SIGHT = [...D.DOLCH_PRE.map(w => ({ w, min: 5, max: 7 })), ...D.DOLCH_PRIMER.map(w => ({ w, min: 6, max: 8 }))];
  reg({ id: 'eq.sight', name: 'eq.skill.sight', min: 5, max: 8, gen(l, r, c) {
    const it = pickFit(r, SIGHT, c.age), w = it.w, list = fit(SIGHT, c.age).map(x => x.w).filter(x => x !== w && x.toLowerCase() !== w.toLowerCase());
    const near = list.sort((a, b) => (b[0] === w[0]) - (a[0] === w[0]) || Math.abs(a.length - w.length) - Math.abs(b.length - w.length)).slice(0, 6);
    const opts = r.shuffle([w, ...others(r, near, 3, [w])]);
    return { kind: 'choice', prompt: t('eq.q.sight'), say: [ui(t('eq.q.sight')), en(w), en(w)], autoSay: true, visual: board(sound), eqAge: [it.min, it.max], noChoiceSay: true,
      choices: wordChoices(opts), answer: w, answerText: E(w),
      hints: ladder(t('eq.h.sight1'), t('eq.h.sight2', { L: E(w[0]), n: w.length }), t('eq.h.ans', { a: E(w) })),
      why: { steps: [{ text: t('eq.y.sight', { w: E(w) }) }, ...(D.SENT[w] ? [{ text: t('eq.y.inSentence', { s: E(D.SENT[w]) }) }] : [])], rule: t('eq.r.sight') } };
  } });

  // ======================= grammar: naming, doing and describing words (6–10) =======================
  const NOUNS = ['cat', 'mango', 'school', 'bus', 'book', 'chair', 'tree', 'river', 'pencil', 'kite', 'train', 'teacher'];
  const VERBS = ['run', 'eat', 'sing', 'swim', 'write', 'sleep', 'climb', 'drink', 'sit', 'laugh', 'clap', 'dance'];
  const ADJS = ['big', 'small', 'red', 'happy', 'tall', 'soft', 'sweet', 'tiny', 'green', 'hungry', 'bright', 'kind'];
  const WC = ['The|x tall|a boy|n kicks|v the|x red|a ball|n', 'A|x small|a bird|n sings|v in|x the|x tree|n', 'Meena|n eats|v a|x sweet|a mango|n', 'The|x old|a man|n walks|v to|x the|x temple|n',
    'My|x little|a sister|n draws|v a|x big|a kolam|n', 'The|x hungry|a cat|n drinks|v warm|a milk|n', 'Ravi|n reads|v a|x funny|a book|n', 'The|x green|a parrot|n eats|v ripe|a guavas|n']
    .map(s => s.split(' ').map(x => { const [w, k] = x.split('|'); return { w, k }; }));
  const WCLS = [{ id: 'n', min: 6, max: 10 }, { id: 'v', min: 6, max: 10 }, { id: 'a', min: 7, max: 10 }];
  reg({ id: 'eq.wordclass', name: 'eq.skill.wordclass', min: 6, max: 10, gen(l, r, c) {
    const k = pickFit(r, WCLS, c.age).id, inSent = c.age >= 8 && (l >= 2 || r() < 0.5), name = t('eq.wc.' + k);
    let a, opts, vis, ex;
    if (inSent) {
      const s = r.pick(WC), mine = s.filter(x => x.k === k); a = r.pick(mine).w;
      opts = r.shuffle([a, ...others(r, s.filter(x => x.k !== k).map(x => x.w), 3, [a])]);
      vis = board(sent(s.map(x => x.w).join(' ') + '.'), 'light'); ex = s.map(x => x.w).join(' ') + '.';
    } else {
      const own = { n: NOUNS, v: VERBS, a: ADJS }[k], rest = { n: [...VERBS, ...ADJS], v: [...NOUNS, ...ADJS], a: [...NOUNS, ...VERBS] }[k];
      a = r.pick(own); opts = r.shuffle([a, ...others(r, c.age < 7 ? rest.filter(x => !ADJS.includes(x) || k === 'a') : rest, 3, [a])]); vis = board(`<p class="eq-cat">${name}</p>`);
      ex = { n: `The ${a} is here.`, v: `I can ${a}.`, a: `It is very ${a}.` }[k];
    }
    return { kind: 'choice', prompt: t(inSent ? 'eq.q.wcIn' : 'eq.q.wc', { k: name }), visual: vis, boardClass: inSent ? 'light' : '', eqAge: [k === 'a' ? 7 : 6, 10],
      choices: wordChoices(opts), answer: a, answerText: E(a),
      hints: ladder(t('eq.h.wc1.' + k), t('eq.h.wc2.' + k), t('eq.h.ans', { a: E(a) })),
      why: { photo: photo(pic(a) ? a : null), steps: [{ text: t('eq.y.wc.' + k, { w: E(a) }) }, { text: t('eq.y.example', { s: E(ex) }) }], rule: t('eq.r.wc') } };
  } });

  // ======================= grammar: one and many, a and an (6–10) =======================
  const PL = [...[['cat', 'cats'], ['book', 'books'], ['pen', 'pens'], ['tree', 'trees'], ['kite', 'kites'], ['cow', 'cows'], ['duck', 'ducks']].map(x => [...x, 6, 10, 's']),
    ...[['box', 'boxes'], ['bus', 'buses'], ['dish', 'dishes'], ['watch', 'watches'], ['brush', 'brushes']].map(x => [...x, 7, 10, 'es']),
    ...[['baby', 'babies'], ['story', 'stories'], ['lady', 'ladies'], ['city', 'cities']].map(x => [...x, 8, 10, 'ies']),
    ...[['child', 'children'], ['man', 'men'], ['mouse', 'mice'], ['foot', 'feet'], ['tooth', 'teeth'], ['woman', 'women']].map(x => [...x, 8, 10, 'irr']),
    ...[['leaf', 'leaves'], ['knife', 'knives']].map(x => [...x, 9, 10, 'ves'])].map(([w, a, min, max, rule]) => ({ w, a, min, max, rule, kind: 'pl' }));
  const AN = ['apple', 'egg', 'orange', 'umbrella', 'elephant', 'ant', 'owl', 'igloo', 'ink'], A1 = ['ball', 'cat', 'dog', 'banana', 'kite', 'mango', 'pen', 'tree', 'bus', 'cup'];
  reg({ id: 'eq.plural', name: 'eq.skill.plural', min: 6, max: 10, gen(l, r, c) {
    const it = pickFit(r, [...PL, { kind: 'an', min: 6, max: 9 }, { kind: 'an2', min: 6, max: 9 }], c.age);
    if (it.kind === 'pl') {
      const w = it.w, wrong = uniq([w, w + 's', w + 'es', w.replace(/y$/, 'ies'), w + 'en', it.a + 's', w.replace(/f(e)?$/, 'ves')]).filter(x => x !== it.a);
      return { kind: 'choice', prompt: t('eq.q.plural'), visual: board(`${picTag(w, 'eq-pic sm')}<p class="eq-sent" lang="en">one ${esc(w)} → two <span class="eq-blank">&nbsp;</span></p>`), say: [ui(t('eq.q.plural')), en(`one ${w}, two ...`)], eqAge: [it.min, it.max],
        choices: wordChoices(r.shuffle([it.a, ...others(r, wrong, 3, [])])), answer: it.a, answerText: E(it.a),
        hints: ladder(t('eq.h.pl1'), t('eq.h.pl2.' + it.rule, { w: E(w) }), t('eq.h.ans', { a: E(it.a) })),
        why: { photo: photo(w), steps: [{ text: t('eq.y.pl.' + it.rule, { w: E(w), a: E(it.a) }) }, { text: t('eq.y.example', { s: E(`one ${w}, two ${it.a}`) }) }], rule: t('eq.r.pl') } };
    }
    const a = r.pick(AN);
    if (it.kind === 'an') return { kind: 'choice', prompt: t('eq.q.an'), visual: board(`<p class="eq-cat" lang="en">an ...</p>`), eqAge: [6, 9],
      choices: wordChoices(r.shuffle([a, ...others(r, A1, 3, [])])), answer: a, answerText: E('an ' + a),
      hints: ladder(t('eq.h.an1'), t('eq.h.an2'), t('eq.h.ans', { a: E('an ' + a) })),
      why: { photo: photo(a), steps: [{ text: t('eq.y.an', { w: E(a), L: E(a[0]) }) }, { text: t('eq.y.example', { s: E(`a ball, an ${a}`) }) }], rule: t('eq.r.an') } };
    const useAn = r() < 0.5, w = useAn ? a : r.pick(A1), ans = useAn ? 'an' : 'a';
    return { kind: 'choice', prompt: t('eq.q.an2'), visual: board(`${picTag(w, 'eq-pic sm')}<p class="eq-sent" lang="en">I see <span class="eq-blank">&nbsp;</span> ${esc(w)}.</p>`), say: [ui(t('eq.q.an2')), en(`I see ... ${w}.`)], eqAge: [6, 9],
      choices: wordChoices(['a', 'an']), keepChoices: true, answer: ans, answerText: E(`${ans} ${w}`),
      hints: ladder(t('eq.h.an1'), t('eq.h.an2'), t('eq.h.ans', { a: E(`${ans} ${w}`) })),
      why: { photo: photo(w), steps: [{ text: t(useAn ? 'eq.y.an' : 'eq.y.a', { w: E(w), L: E(w[0]) }) }, { text: t('eq.y.example', { s: E(`a ball, an ${a}`) }) }], rule: t('eq.r.an') } };
  } });

  // ======================= grammar: capital letters and full stops (6–10) =======================
  const CAPS = [...['The sun is hot.', 'We play in the park.', 'My bag is blue.', 'Birds fly in the sky.', 'I like idli.', 'The bus is late.', 'Amma makes dosa.'].map(s => ({ s, min: 6, max: 10 })),
    ...[['Ravi lives in Salem.', ['Ravi', 'Salem']], ['Meena goes to Madurai.', ['Meena', 'Madurai']], ['We visit Kanyakumari in May.', ['Kanyakumari', 'May']], ['Nila and Arun play cricket.', ['Nila', 'Arun']]].map(([s, names]) => ({ s, names, min: 7, max: 10 }))];
  reg({ id: 'eq.caps', name: 'eq.skill.caps', min: 6, max: 10, gen(l, r, c) {
    const it = pickFit(r, CAPS, c.age), s = it.s, low = x => x[0].toLowerCase() + x.slice(1), noStop = x => x.replace(/\.$/, '');
    const nm = it.names ? it.names.reduce((x, n) => x.replace(new RegExp('(^|\\s)' + n + '\\b'), (m, sp) => sp + n.toLowerCase()), s) : null;
    const wrong = uniq([low(s), noStop(s), nm || low(noStop(s)), low(noStop(s))]).filter(x => x !== s).slice(0, 3);
    return { kind: 'choice', prompt: t('eq.q.caps'), visual: board(`<p class="eq-cat">${t('eq.ui.capsBoard')}</p>`), eqAge: [it.min, it.max],
      choices: wordChoices(r.shuffle([s, ...wrong])), answer: s, answerText: E(s),
      hints: ladder(t('eq.h.caps1'), t(it.names ? 'eq.h.caps2n' : 'eq.h.caps2'), t('eq.h.ans', { a: E(s) })),
      why: { steps: [{ text: t('eq.y.caps', { s: `<span lang="en"><mark>${esc(s[0])}</mark>${esc(s.slice(1, -1))}<mark>.</mark></span>` }) }, ...(it.names ? [{ text: t('eq.y.capsNames', { n: E(it.names.join(', ')) }) }] : [])], rule: t('eq.r.caps') } };
  } });

  // ======================= grammar: is / are / am and he / she / they / it (6–10) =======================
  const BE = [['The birds ___ singing.', 'are'], ['The cat ___ sleeping.', 'is'], ['I ___ happy today.', 'am'], ['My shoes ___ new.', 'are'], ['Amma ___ in the kitchen.', 'is'], ['We ___ good friends.', 'are'], ['The mangoes ___ sweet.', 'are'], ['The tea ___ hot.', 'is'], ['I ___ ready for school.', 'am']]
    .map(([s, a]) => ({ s, a, k: 'be', opts: ['is', 'are', 'am', 'be'], pic: { birds: 'parrot', cat: 'cat', mangoes: 'mango' }[(s.match(/The (\w+)/) || [])[1]] }));
  const PRO = [['Meena is my friend. ___ sings well.', 'She'], ['Arun has a kite. ___ flies it high.', 'He', 'kite'], ['Nila and Kavin are in the garden. ___ are playing.', 'They', 'flower'], ['The fan is old. ___ makes a noise.', 'It'],
    ['Appa is a driver. ___ drives a bus.', 'He', 'bus'], ['Paati makes murukku. ___ gives us some.', 'She'], ['The goats are hungry. ___ eat grass.', 'They', 'goat'], ['My bicycle is new. ___ is red.', 'It', 'bicycle']]
    .map(([s, a, pic]) => ({ s, a, pic, k: 'pro', opts: ['He', 'She', 'They', 'It'] }));
  reg({ id: 'eq.agree', name: 'eq.skill.agree', min: 6, max: 10, gen(l, r, c) {
    const it = r.pick(r() < 0.5 ? BE : PRO), full = it.s.replace('___', it.a);
    return { kind: 'choice', prompt: t('eq.q.fill'), visual: board(`${it.pic ? picTag(it.pic, 'eq-pic sm') : ''}${sent(it.s)}`, 'light'), boardClass: 'light', say: [ui(t('eq.q.fill')), en(it.s.replace('___', '...'))], eqAge: [6, 10],
      choices: wordChoices(r.shuffle(it.opts)), answer: it.a, answerText: E(it.a),
      hints: ladder(t('eq.h.' + it.k + '1'), t('eq.h.' + it.k + '2.' + it.a.toLowerCase()), t('eq.h.ans', { a: E(it.a) })),
      why: { photo: photo(it.pic), steps: [{ text: t('eq.y.' + it.k + '.' + it.a.toLowerCase()) }, { text: t('eq.y.example', { s: E(full) }) }], rule: t('eq.r.' + it.k) } };
  } });

  // ======================= grammar: past tense (8–10) =======================
  const PAST = [['Yesterday I ___ to school.', 'go', 'went', 'school'], ['Last week we ___ cricket.', 'play', 'played', 'ball'], ['Yesterday Meena ___ a song.', 'sing', 'sang'], ['Last night I ___ two dosas.', 'eat', 'ate'],
    ['Yesterday we ___ a peacock.', 'see', 'saw', 'peacock'], ['Last Sunday Ravi ___ a letter.', 'write', 'wrote', 'pencil'], ['Yesterday the dog ___ fast.', 'run', 'ran', 'dog'], ['Last evening we ___ to the beach.', 'walk', 'walked', 'sea'],
    ['Yesterday the frog ___ into the pond.', 'jump', 'jumped', 'frog'], ['Last year Paati ___ to our house.', 'come', 'came'], ['This morning I ___ a glass of milk.', 'drink', 'drank', 'cup'], ['Last night Amma ___ sambar.', 'cook', 'cooked']]
    .map(([s, base, a, pic]) => ({ s, base, a, pic, reg: a === base + 'ed' }));
  const ing = b => b.endsWith('e') && b !== 'see' ? b.slice(0, -1) + 'ing' : /^(run|swim)$/.test(b) ? b + b.slice(-1) + 'ing' : b + 'ing';
  const third = b => /(sh|ch|o)$/.test(b) ? b + 'es' : b + 's';
  reg({ id: 'eq.past', name: 'eq.skill.past', min: 8, max: 10, gen(l, r, c) {
    const it = r.pick(PAST), wrong = uniq([it.base, third(it.base), ing(it.base), it.base + 'ed']).filter(x => x !== it.a);
    return { kind: 'choice', prompt: t('eq.q.past'), visual: board(`${it.pic ? picTag(it.pic, 'eq-pic sm') : ''}${sent(it.s)}<p class="eq-base" lang="en">(${esc(it.base)})</p>`, 'light'), boardClass: 'light', say: [ui(t('eq.q.past')), en(it.s.replace('___', '...'))], eqAge: [8, 10],
      choices: wordChoices(r.shuffle([it.a, ...wrong.slice(0, 3)])), answer: it.a, answerText: E(it.a),
      hints: ladder(t('eq.h.past1'), t(it.reg ? 'eq.h.past2r' : 'eq.h.past2i'), t('eq.h.ans', { a: E(it.a) })),
      why: { photo: photo(it.pic), steps: [{ text: t(it.reg ? 'eq.y.pastR' : 'eq.y.pastI', { b: E(it.base), a: E(it.a) }) }, { text: t('eq.y.example', { s: E(it.s.replace('___', it.a)) }) }], rule: t('eq.r.past') } };
  } });

  // ======================= sentences: the correct sentence, the missing word (6–10) =======================
  const GOOD = Object.entries(D.SENT).filter(([, s]) => /^[A-Z][a-z]+ [^,?]+\.$/.test(s) && s.split(' ').length >= 4 && s.split(' ').length <= 7);
  const MISS = [['I drink ___ every morning.', 'milk', ['chair', 'run', 'blue'], 'cup', 6], ['The ___ barks at night.', 'dog', ['cup', 'sing', 'green'], 'dog', 6], ['Amma cuts the vegetables with a ___.', 'knife', ['pillow', 'cloud', 'song'], 'carrot', 6],
    ['The farmer grows rice in the ___.', 'field', ['sky', 'cupboard', 'bus'], null, 6], ['Fish live in ___.', 'water', ['trees', 'beds', 'shoes'], 'river', 6], ['I brush my ___ every morning.', 'teeth', ['shoes', 'kite', 'roof'], null, 6],
    ['The ___ shines at night.', 'moon', ['chair', 'bread', 'goat'], 'moon', 6], ['We read ___ in the library.', 'books', ['mangoes', 'buses', 'rivers'], 'book', 6],
    ['Ravi was tired, so he went to ___ early.', 'bed', ['market', 'river', 'kite'], 'bed', 8], ['It was very hot, so we sat under the ___.', 'tree', ['blanket', 'stove', 'rain'], 'tree', 8],
    ['The shop was closed, so we ___ home.', 'went', ['ate', 'sang', 'wrote'], null, 8], ['She ___ the window because it was cold.', 'closed', ['opened', 'painted', 'ate'], 'window', 9],
    ['The road was wet because it had ___.', 'rained', ['shone', 'slept', 'sung'], 'umbrella', 9]].map(([s, a, w, p, min]) => ({ s, a, w, p, min, max: 10, k: 'miss' }));
  function scramble(s) {   // three clearly wrong orders of the same words
    const ws = s.replace(/\.$/, '').split(' '), keepCap = w => /^[A-Z]/.test(w) && w !== ws[0] || w === 'I';
    const norm = a => { a = a.map(w => keepCap(w) ? w : w.toLowerCase()); a[0] = a[0][0].toUpperCase() + a[0].slice(1); return a.join(' ') + '.'; };
    return uniq([norm([...ws].reverse()), norm([ws[1], ws[0], ...ws.slice(2)]), norm([ws[ws.length - 1], ...ws.slice(0, -1)])]).filter(x => x !== s);
  }
  reg({ id: 'eq.sentence', name: 'eq.skill.sentence', min: 6, max: 10, gen(l, r, c) {
    const it = pickFit(r, [{ k: 'good', min: 6, max: 10 }, ...MISS], c.age);
    if (it.k === 'good') {
      const [w, s] = r.pick(GOOD), wrong = scramble(s);
      return { kind: 'choice', prompt: t('eq.q.goodSent'), visual: board(`${picTag(w, 'eq-pic sm')}`), eqAge: [6, 10],
        choices: wordChoices(r.shuffle([s, ...wrong.slice(0, 3)])), answer: s, answerText: E(s),
        hints: ladder(t('eq.h.good1'), t('eq.h.good2', { w: E(s.split(' ')[0]) }), t('eq.h.ans', { a: E(s) })),
        why: { photo: photo(w), steps: [{ text: t('eq.y.good', { s: E(s) }) }, { text: t('eq.y.goodWho', { w: E(s.split(' ').slice(0, 2).join(' ')) }) }], rule: t('eq.r.good') } };
    }
    const full = it.s.replace('___', it.a);
    return { kind: 'choice', prompt: t('eq.q.miss'), visual: board(`${it.p ? picTag(it.p, 'eq-pic sm') : ''}${sent(it.s)}`, 'light'), boardClass: 'light', say: [ui(t('eq.q.miss')), en(it.s.replace('___', '...'))], eqAge: [it.min, it.max],
      choices: wordChoices(r.shuffle([it.a, ...it.w])), answer: it.a, answerText: E(it.a),
      hints: ladder(t('eq.h.miss1'), t('eq.h.miss2'), t('eq.h.ans', { a: E(it.a) })),
      why: { photo: photo(it.p), steps: [{ text: t('eq.y.miss', { s: E(full) }) }, { text: t('eq.y.missWhy', { a: E(it.a) }) }], rule: t('eq.r.miss') } };
  } });

  // ======================= sentences: word order (6–9, tiles) =======================
  const ORDER = GOOD.filter(([, s]) => s.split(' ').length <= 6);
  reg({ id: 'eq.order', name: 'eq.skill.order', min: 6, max: 9, gen(l, r, c) {
    const [w, s] = r.pick(ORDER), ws = s.replace(/\.$/, '').split(' ');
    let tiles = r.shuffle(ws); for (let g = 0; g < 6 && tiles.join(' ') === ws.join(' '); g++) tiles = r.shuffle(ws);
    if (tiles.join(' ') === ws.join(' ')) tiles = [...ws].reverse();
    return { kind: 'tiles', words: true, tiles, answer: ws.join(' '), answerText: E(s), prompt: t('eq.q.order'), visual: board(picTag(w, 'eq-pic sm')), eqAge: [6, 9], say: [ui(t('eq.q.order'))],
      hints: ladder(t('eq.h.order1'), t('eq.h.order2', { w: E(ws.slice(0, 2).join(' ')) }), t('eq.h.ans', { a: E(s) })),
      why: { photo: photo(w), steps: [{ text: t('eq.y.order', { s: E(s) }) }, { text: t('eq.y.goodWho', { w: E(ws.slice(0, 2).join(' ')) }) }], rule: t('eq.r.order') } };
  } });

  // ======================= reading: short original passages (7–10) =======================
  const P = (min, max, pic, title, lines, qs) => ({ min, max, pic, title, lines, qs: qs.map(([q, a, w, line]) => ({ q, a, w, line })) });
  const PASS = [
    P(7, 8, 'pumpkin', 'At the market', ['Kavin goes to the market with his amma.', 'They buy tomatoes, onions and a big pumpkin.', 'Kavin carries the bag home.'],
      [['What big vegetable do they buy?', 'a pumpkin', ['a cabbage', 'a coconut', 'a carrot'], 1], ['Who carries the bag home?', 'Kavin', ['Amma', 'the shopkeeper', 'his sister'], 2]]),
    P(7, 8, 'umbrella', 'A rainy day', ['It is raining in Madurai.', 'Nila takes her red umbrella to school.', 'Her shoes get wet in a puddle.'],
      [['What colour is the umbrella?', 'red', ['blue', 'green', 'yellow'], 1], ['What gets wet?', 'her shoes', ['her bag', 'her book', 'her hair'], 2]]),
    P(7, 8, 'cow', 'Lakshmi the cow', ['Thatha has a cow named Lakshmi.', 'Every morning he gives her fresh grass and water.', 'Lakshmi gives milk for the whole family.'],
      [['What is the cow called?', 'Lakshmi', ['Meena', 'Nila', 'Thatha'], 0], ['What does Lakshmi give the family?', 'milk', ['grass', 'water', 'eggs'], 2]]),
    P(7, 9, 'peacock', 'The dancing peacock', ['A peacock lives near our village temple.', 'When dark clouds come, it opens its long feathers and dances.', 'Everyone stops to watch.'],
      [['When does the peacock dance?', 'when dark clouds come', ['at midnight', 'when the sun is hot', 'when the bell rings'], 1], ['Where does the peacock live?', 'near the temple', ['in a school', 'on a boat', 'in the market'], 0]]),
    P(7, 9, 'bus', 'The late bus', ['The school bus comes at eight o\'clock.', 'Arun waits at the gate with his friend Ravi.', 'Today the bus is late, so they read a book together.'],
      [['Why do the boys read a book?', 'the bus is late', ['it is Sunday', 'the gate is shut', 'they are at school'], 2], ['When does the bus come?', 'at eight o\'clock', ['at nine o\'clock', 'at noon', 'at night'], 0]]),
    P(8, 10, 'mango', 'A little seed', ['Priya plants a mango seed in a pot.', 'She waters it every evening.', 'After two weeks, a small green shoot comes out of the soil.', 'Priya smiles and shows it to her brother.'],
      [['How often does Priya water the pot?', 'every evening', ['once a week', 'every hour', 'only on Sunday'], 1], ['How does Priya feel at the end?', 'happy', ['angry', 'scared', 'sleepy'], 3]]),
    P(8, 10, 'train', 'The train to Chennai', ['The train to Chennai is full.', 'Selvi and her paati find two seats near the window.', 'They eat idli from a steel box and watch the paddy fields go by.'],
      [['What do they eat on the train?', 'idli', ['dosa', 'rice', 'mangoes'], 2], ['Where do they sit?', 'near the window', ['near the door', 'on the floor', 'next to the driver'], 1]]),
    P(8, 10, 'bicycle', 'A flat tyre', ['Ravi\'s cycle has a flat tyre.', 'His sister helps him find the hole and fix it with a patch.', 'Now Ravi can ride to the library again.'],
      [['What was wrong with the cycle?', 'it had a flat tyre', ['the bell was broken', 'it was too small', 'it had no seat'], 0], ['Where does Ravi want to ride?', 'to the library', ['to the beach', 'to the temple', 'to the market'], 2]]),
    P(9, 10, 'boat', 'Evening at Rameswaram', ['Every evening, the fishermen of Rameswaram pull their boats onto the sand.', 'They spread the nets to dry and sort the fish into baskets.', 'The children help to carry the smaller baskets to the market.'],
      [['What do the fishermen do with the nets?', 'spread them to dry', ['sell them', 'throw them away', 'take them to school'], 1], ['Why do the children carry only the smaller baskets?', 'the big ones are too heavy for them', ['they do not like fish', 'the big ones are empty', 'the market is closed'], 2]]),
    P(9, 10, 'lamp', 'The storm', ['The power went off during the storm.', 'Appa lit a lamp and placed it on the table.', 'The family sat close together while Paati told stories, until the fan started spinning again.'],
      [['Why did Appa light a lamp?', 'the power went off', ['it was a festival', 'Paati asked for it', 'the fan was too fast'], 0], ['How did the family know the power was back?', 'the fan started spinning', ['the storm got louder', 'Paati stopped talking', 'the lamp went out'], 2]]),
    P(9, 10, 'kite', 'Farida\'s clay pot', ['Farida put one coin in a clay pot every day.', 'By the end of the month, the pot was heavy.', 'She used the money to buy a kite for her little brother\'s birthday.'],
      [['Why was the pot heavy?', 'it was full of coins', ['it was full of water', 'it was made of stone', 'it had a kite inside'], 1], ['Who was the kite for?', 'her little brother', ['her friend', 'her teacher', 'Farida herself'], 2]]),
  ];
  reg({ id: 'eq.comp', name: 'eq.skill.comp', min: 7, max: 10, gen(l, r, c) {
    const ps = fit(PASS, c.age), p = r.pick(ps), qq = r.pick(p.qs), evid = p.lines[qq.line];
    const text = p.lines.join(' ');
    return { kind: 'choice', prompt: `<span class="eq-inst">${t('eq.q.comp')}</span><span lang="en">${esc(qq.q)}</span>`, promptText: t('eq.q.comp'), say: [ui(t('eq.q.comp')), en(p.title + '. ' + text), en(qq.q)],
      visual: board(`<div class="eq-passage"><p class="eq-ptitle" lang="en">${esc(p.title)}</p><p class="passage" lang="en">${esc(text)}</p></div>`, 'light'), boardClass: 'light', eqAge: [p.min, p.max],
      choices: wordChoices(r.shuffle([qq.a, ...qq.w])), answer: qq.a, answerText: E(qq.a),
      hints: ladder(t('eq.h.comp1'), t('eq.h.comp2', { s: E(evid) }), t('eq.h.ans', { a: E(qq.a) })),
      why: { photo: photo(p.pic), steps: [{ text: t('eq.y.comp', { s: E(evid) }) }, { text: t('eq.y.compSo', { q: E(qq.q), a: E(qq.a) }) }], rule: t('eq.r.comp') } };
  } });

  // ======================= punctuation (7–10) =======================
  const END = [['Where is my pencil', '?'], ['Can you help me', '?'], ['What time is it', '?'], ['Do you like mangoes', '?'], ['I live near the sea', '.'], ['The shop opens at nine', '.'], ['My brother is six', '.'], ['We eat rice for lunch', '.']]
    .map(([s, a]) => ({ s, a, k: 'end', min: 7, max: 10 }));
  const COMMA = [['I bought apples, bananas and grapes.', 'apples', 'bananas', 'grapes', 'I bought'], ['We saw a cow, a goat and a hen.', 'a cow', 'a goat', 'a hen', 'We saw'], ['Pack your book, pencil and water bottle.', 'book', 'pencil', 'water bottle', 'Pack your']]
    .map(([s, x, y, z, h]) => ({ s, x, y, z, h, k: 'comma', min: 8, max: 10 }));
  const APOS = [['Meena', 'bag'], ['Ravi', 'cycle'], ['the dog', 'bone'], ['Paati', 'glasses']].map(([o, th]) => ({ o, th, k: 'apos', min: 9, max: 10 }));
  const MARKS = ['.', '?', ',', '\''];
  reg({ id: 'eq.punct', name: 'eq.skill.punct', min: 7, max: 10, gen(l, r, c) {
    const it = pickFit(r, [...END, ...COMMA, ...APOS], c.age);
    const mk = m => ({ v: m, html: `<span class="eq-mark" lang="en">${esc(m)}</span><span class="eq-markname">${t('eq.mark.' + MARKS.indexOf(m))}</span>` });
    if (it.k === 'end') return { kind: 'choice', prompt: t('eq.q.end'), visual: board(`<p class="eq-sent" lang="en">${esc(it.s)}<span class="eq-blank">&nbsp;</span></p>`, 'light'), boardClass: 'light', say: [ui(t('eq.q.end')), en(it.s)], eqAge: [7, 10],
      choices: r.shuffle(MARKS).map(mk), answer: it.a, answerText: `<span lang="en">${esc(it.s + it.a)}</span>`,
      hints: ladder(t('eq.h.end1'), t(it.a === '?' ? 'eq.h.end2q' : 'eq.h.end2s'), t('eq.h.ans', { a: E(it.s + it.a) })),
      why: { steps: [{ text: t(it.a === '?' ? 'eq.y.endQ' : 'eq.y.endS', { s: E(it.s + it.a) }) }], rule: t('eq.r.end') } };
    if (it.k === 'comma') {
      const w = [`${it.h}, ${it.x} ${it.y} and ${it.z}.`, `${it.h} ${it.x} ${it.y}, and, ${it.z}.`, `${it.h} ${it.x} ${it.y} and ${it.z}.`];
      return { kind: 'choice', prompt: t('eq.q.comma'), visual: board(`<p class="eq-mark big" lang="en">,</p>`), eqAge: [8, 10], choices: wordChoices(r.shuffle([it.s, ...w])), answer: it.s, answerText: E(it.s),
        hints: ladder(t('eq.h.comma1'), t('eq.h.comma2'), t('eq.h.ans', { a: E(it.s) })), why: { steps: [{ text: t('eq.y.comma', { s: E(it.s) }) }], rule: t('eq.r.comma') } };
    }
    const right = `${it.o}'s ${it.th}`, w = [`${it.o}s ${it.th}`, `${it.o} ${it.th}'s`, `${it.o}s' ${it.th}`];
    return { kind: 'choice', prompt: t('eq.q.apos', { o: E(it.o), th: E(it.th) }), visual: board(`<p class="eq-mark big" lang="en">'s</p>`), eqAge: [9, 10], choices: wordChoices(r.shuffle([right, ...w])), answer: right, answerText: E(right),
      hints: ladder(t('eq.h.apos1'), t('eq.h.apos2', { o: E(it.o) }), t('eq.h.ans', { a: E(right) })), why: { photo: photo({ bag: 'bag', cycle: 'bicycle' }[it.th]), steps: [{ text: t('eq.y.apos', { a: E(right), o: E(it.o), th: E(it.th) }) }], rule: t('eq.r.apos') } };
  } });

  // ======================= question words (7–10) =======================
  const QW = [['___ is your name?', 'What', 'My name is Nila.'], ['___ do you live?', 'Where', 'I live in Salem.'], ['___ is your birthday?', 'When', 'It is in June.', ['What']], ['___ is at the door?', 'Who', 'It is the postman.', ['What']],
    ['___ are you crying?', 'Why', 'Because I fell down.'], ['___ is the bus stop?', 'Where', 'It is near the temple.'], ['___ did you eat for lunch?', 'What', 'I ate curd rice.'], ['___ does school start?', 'When', 'It starts at nine.'],
    ['___ made this kolam?', 'Who', 'Paati made it.'], ['___ is the shop closed?', 'Why', 'Because it is Sunday.'], ['___ old are you?', 'How', 'I am eight.', [], 8], ['___ do you go to school?', 'How', 'I go by bus.', [], 8]]
    .map(([q, a, rep, not = [], min = 7]) => ({ q, a, rep, not, min, max: 10 }));
  const QWS = ['What', 'Where', 'When', 'Who', 'Why', 'How'];
  reg({ id: 'eq.qword', name: 'eq.skill.qword', min: 7, max: 10, gen(l, r, c) {
    const it = pickFit(r, QW, c.age), full = it.q.replace('___', it.a);
    return { kind: 'choice', prompt: t('eq.q.qword'), visual: board(`${sent(it.q)}<p class="eq-reply" lang="en">${esc(it.rep)}</p>`, 'light'), boardClass: 'light', say: [ui(t('eq.q.qword')), en(it.q.replace('___', '...') + ' ' + it.rep)], eqAge: [it.min, it.max],
      choices: wordChoices(r.shuffle([it.a, ...others(r, QWS, 3, [it.a, ...it.not])])), answer: it.a, answerText: E(full),
      hints: ladder(t('eq.h.qw1'), t('eq.h.qw2.' + it.a.toLowerCase()), t('eq.h.ans', { a: E(it.a) })),
      why: { steps: [{ text: t('eq.y.qw.' + it.a.toLowerCase(), { s: E(full), rep: E(it.rep) }) }], rule: t('eq.r.qw') } };
  } });

  // ======================= synonyms (9–10) =======================
  const SYN = [['big', 'large', 'g1'], ['huge', 'enormous', 'g1'], ['happy', 'glad'], ['fast', 'quick'], ['begin', 'start'], ['shut', 'close'], ['little', 'small'], ['brave', 'bold'], ['quiet', 'silent'], ['rich', 'wealthy'],
    ['difficult', 'hard'], ['easy', 'simple'], ['shout', 'yell'], ['gift', 'present'], ['rock', 'stone', 'g2'], ['look', 'see', 'g3'], ['tired', 'sleepy']].map(([w, a, g], i) => ({ w, a, g: g || 'x' + i, min: 9, max: 10 }));
  reg({ id: 'eq.synonym', name: 'eq.skill.synonym', min: 9, max: 10, gen(l, r, c) {
    const it = r.pick(SYN), flip = r() < 0.4, w = flip ? it.a : it.w, a = flip ? it.w : it.a, ant = OPP.find(o => o.w === w || o.a === w), x = ant ? (ant.w === w ? ant.a : ant.w) : null;
    const pool = SYN.filter(s => s.g !== it.g).flatMap(s => [s.w, s.a]);
    const opts = r.shuffle([a, ...(x ? [x] : []), ...others(r, pool, x ? 2 : 3, [a, w, x])]);
    return { kind: 'choice', prompt: t('eq.q.syn'), say: [ui(t('eq.q.syn')), en(w)], visual: board(bigWord(w)), eqAge: [9, 10],
      choices: wordChoices(opts), answer: a, answerText: E(a),
      hints: ladder(t('eq.h.syn1'), t('eq.h.syn2', { w: E(w) }), t('eq.h.ans', { a: E(a) })),
      why: { steps: [{ text: t('eq.y.syn', { w: E(w), a: E(a) }) }, ...(x ? [{ text: t('eq.y.synNot', { x: E(x), w: E(w) }) }] : [])], rule: t('eq.r.syn') } };
  } });

  // ======================= prefixes and suffixes (9–10) =======================
  const AFF = [['not kind', 'unkind', ['kindness', 'kindly', 'kinder'], 'un'], ['not tidy', 'untidy', ['tidied', 'tidily', 'tidying'], 'un'], ['open a lock', 'unlock', ['relock', 'locked', 'locker'], 'un'], ['not happy', 'unhappy', ['happily', 'happiness', 'happier'], 'un'],
    ['read again', 'reread', ['unread', 'reader', 'reading'], 're'], ['fill again', 'refill', ['filled', 'filling', 'unfilled'], 're'], ['build again', 'rebuild', ['builder', 'building', 'built'], 're'], ['tie again', 'retie', ['untie', 'tied', 'tying'], 're'],
    ['full of colour', 'colourful', ['colourless', 'colours', 'coloured'], 'ful'], ['full of hope', 'hopeful', ['hopeless', 'hoped', 'hoping'], 'ful'], ['full of help', 'helpful', ['helpless', 'helper', 'helping'], 'ful'],
    ['without care', 'careless', ['careful', 'caring', 'cared'], 'less'], ['without fear', 'fearless', ['fearful', 'feared', 'fearing'], 'less']].map(([m, a, w, k]) => ({ m, a, w, k }));
  reg({ id: 'eq.affix', name: 'eq.skill.affix', min: 9, max: 10, gen(l, r, c) {
    const it = r.pick(AFF), root = it.a.replace(/^(un|re)/, '').replace(/(ful|less)$/, '');
    return { kind: 'choice', prompt: t('eq.q.affix'), say: [ui(t('eq.q.affix')), en(it.m)], visual: board(`<p class="eq-word" lang="en">${esc(it.m)}</p>`), eqAge: [9, 10],
      choices: wordChoices(r.shuffle([it.a, ...it.w])), answer: it.a, answerText: E(it.a),
      hints: ladder(t('eq.h.affix1'), t('eq.h.affix2.' + it.k), t('eq.h.ans', { a: E(it.a) })),
      why: { photo: photo(it.a === 'colourful' ? 'kite' : null), steps: [{ text: t('eq.y.affix.' + it.k, { a: E(it.a), r: E(root) }) }, { text: t('eq.y.affixEx.' + it.k) }], rule: t('eq.r.affix') } };
  } });

  // ======================= homophones (9–10) =======================
  const HOM = [['The waves of the ___ are very big.', 'sea', 'see', 'sea'], ['I can ___ the moon from my window.', 'see', 'sea', 'moon'], ['There are ___ mangoes on the plate.', 'two', 'too', 'mango', ['to']], ['I am going ___ school.', 'to', 'two', 'school', ['too']],
    ['Please ___ your name here.', 'write', 'right', 'pencil'], ['Raise your ___ hand.', 'right', 'write'], ['The ___ is shining.', 'sun', 'son', 'sun'], ['Appa\'s ___ is Arun.', 'son', 'sun'],
    ['Amma uses ___ to make chapati.', 'flour', 'flower'], ['A rose is a lovely ___.', 'flower', 'flour', 'flower'], ['Come ___ and sit with me.', 'here', 'hear'], ['I can ___ the school bell.', 'hear', 'here'],
    ['I have a ___ bag.', 'new', 'knew', 'bag'], ['She ___ all the answers.', 'knew', 'new'], ['I bought a ___ of shoes.', 'pair', 'pear']].map(([s, a, b, p, extra = []]) => ({ s, a, b, p, extra }));
  reg({ id: 'eq.homophone', name: 'eq.skill.homophone', min: 9, max: 10, gen(l, r, c) {
    const it = r.pick(HOM), fill = others(r, ['jump', 'sleep', 'milk', 'green'], 2 - it.extra.length, []);
    const opts = r.shuffle(uniq([it.a, it.b, ...it.extra, ...fill]).slice(0, 4)), full = it.s.replace('___', it.a);
    return { kind: 'choice', prompt: t('eq.q.hom'), visual: board(`${it.p ? picTag(it.p, 'eq-pic sm') : ''}${sent(it.s)}`, 'light'), boardClass: 'light', say: [ui(t('eq.q.hom')), en(it.s.replace('___', it.a))], eqAge: [9, 10],
      choices: wordChoices(opts), answer: it.a, answerText: E(it.a),
      hints: ladder(t('eq.h.hom1', { a: E(it.a), b: E(it.b) }), t('eq.h.hom2'), t('eq.h.ans', { a: E(it.a) })),
      why: { photo: photo(it.p), steps: [{ text: t('eq.y.hom', { a: E(it.a), b: E(it.b) }) }, { text: t('eq.y.example', { s: E(full) }) }], rule: t('eq.r.hom') } };
  } });

  // ======================= which quiz skills fit which English topic =======================
  const MAP = { sounds: ['eq.first', 'eq.rhyme'], blend: ['eq.rhyme', 'eq.first', 'eq.picword'], sight: ['eq.sight'], vocab: ['eq.picword', 'eq.category', 'eq.opposite', 'eq.tamil', 'eq.synonym', 'eq.homophone'],
    spell: ['eq.plural', 'eq.caps', 'eq.affix', 'eq.homophone'], read: ['eq.sentence', 'eq.order', 'eq.comp', 'eq.qword', 'eq.wordclass', 'eq.agree'],
    grammar: ['eq.wordclass', 'eq.plural', 'eq.caps', 'eq.agree', 'eq.past', 'eq.punct', 'eq.sentence', 'eq.qword'] };
  const ageOk = (id, age) => age >= META[id].min && age <= META[id].max;
  function pool(p, topicId) {
    const age = AGE.of(p).age, topics = window.App?.SUBJ?.english?.topics || ENGLISH.TOPICS;
    const tps = topics.filter(tp => (window.App?.forBand ? App.forBand(tp, p) : AGE.allowTopic(p, S, tp.id)) && (!topicId || tp.id === topicId));
    let ids = uniq(tps.flatMap(tp => MAP[tp.id] || [])).filter(id => ageOk(id, age));
    if (!ids.length) ids = topicId ? pool(p) : IDS.filter(id => ageOk(id, age));
    return ids.filter(id => Engine.SK[id]);
  }
  function items(p, ids, n) {
    const due = Store.due(p, S).filter(r => r.skill?.startsWith('eq.') && ids.includes(r.skill)).slice(0, Math.min(4, Math.ceil(n / 2))).map(r => ({ skill: r.skill, lvl: r.lvl, seed: r.seed }));
    return [...due, ...Engine.weighted(p, ids, n - due.length)];
  }

  // ---------- Beat your best (age 9–10): time-out and the personal best in p.extras.englishquiz ----------
  const ex = p => { p.extras ??= {}; return p.extras.englishquiz ??= { best: null, runs: 0 }; };
  const canBest = p => AGE.of(p).age >= 9;
  document.addEventListener('animationend', e => {
    if (!e.target.closest?.('.eq-ring')) return;
    const R = Engine.round; if (!R || R.answered || R.mode !== BEST) return;
    const btn = document.querySelector('.round .checkbtn'); if (!btn) return;
    R.revealed = true; btn.disabled = false; btn.click();
    const card = document.querySelector('.lessoncard'); if (!card) return;
    card.querySelector('.lc-head')?.insertAdjacentHTML('afterend', `<p class="eq-timeup">${t('eq.ui.timeUp')}</p>`);
  });
  addEventListener('hashchange', () => {
    if (location.hash !== '#/summary') return;
    const R = Engine.round; if (!R || R.mode !== BEST || R.topic !== TOPIC || !R.summary || R.summary.eq) return;
    R.summary.eq = 1; const p = Store.current(), x = ex(p), s = R.summary, ms = Date.now() - R.t0; let isNew = false;
    if (!s.quit && s.n === R.items.length) {
      x.runs = (x.runs || 0) + 1;
      if (!x.best || s.right > x.best.right || (s.right === x.best.right && ms < x.best.ms)) { x.best = { right: s.right, n: s.n, ms, date: Store.today() }; isNew = true; }
      Store.save();
    }
    setTimeout(() => { const el = document.querySelector('.summary .sum-score'); if (el && x.best) el.insertAdjacentHTML('afterend', `<p class="eq-best">${t(isNew ? 'eq.ui.newBest' : 'eq.ui.bestIs', { a: x.best.right, b: x.best.n })}</p>`); }, 80);
  });
  // number keys pick a tile in an English quiz round (Enter then checks, via the engine)
  document.addEventListener('keydown', e => {
    const R = Engine.round; if (!R || R.answered || R.topic !== TOPIC || document.body.dataset.view !== 'round' || e.ctrlKey || e.metaKey || e.altKey || !/^[1-9]$/.test(e.key) || e.defaultPrevented) return;
    const b = document.querySelectorAll('.round .choice')[+e.key - 1]; if (b && !b.disabled) { e.preventDefault(); b.click(); }
  });

  // ---------- starting rounds ----------
  function run(p, mode, topicId) {
    const ids = pool(p, topicId), n = AGE.of(p).round, tp = topicId && (window.App?.SUBJ?.english?.topics || ENGLISH.TOPICS).find(x => x.id === topicId);
    Engine.start({ items: items(p, ids, n), title: tp ? `${t('eq.title')} · ${t(tp.title)}` : t('eq.title'), subject: S, topic: TOPIC, mode,
      back: topicId ? `#/t/english/${topicId}` : '#/s/english', again: () => run(Store.current() || p, mode, topicId) });
  }
  function choose(p) {
    if (!canBest(p) || !window.App?.dialog) return run(p, QUICK);
    const b = ex(p).best;
    App.dialog(`<h2 class="k-dialog-title">${t('eq.title')}</h2><p class="muted">${t('eq.ui.choose')}</p>
      <div class="eq-modes">
        <button type="button" class="k-card eq-mode" data-m="quick"><span class="eyebrow">${t('eq.ui.quick')}</span><span>${t('eq.ui.quickD', { n: AGE.of(p).round })}</span></button>
        <button type="button" class="k-card eq-mode" data-m="best"><span class="eyebrow">${t('eq.ui.best')}</span><span>${t('eq.ui.bestD')}</span><span class="small muted">${b ? t('eq.ui.bestIs', { a: b.right, b: b.n }) : t('eq.ui.noBest')}</span></button>
      </div><div class="row-actions"><button type="button" class="k-btn k-btn-ghost" data-close>${t('common.cancel')}</button></div>`,
    d => d.querySelectorAll('.eq-mode').forEach(x => x.onclick = () => { App.closeDialog(); run(p, x.dataset.m === 'best' ? BEST : QUICK); }));
  }
  const game = { title: 'eq.title', blurb: 'eq.blurb', icon: 'i-quiz', start: p => choose(p) };
  function topic(p, topicId) { run(p, QUICK, topicId); }
  // n items that stay the same all day for this child
  function daily(p, n = 2) {
    const ids = pool(p); if (!ids.length) return [];
    const key = `${Store.today()}|${p.id || ''}|eq`; let h = 2166136261;
    for (const ch of key) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
    const out = [];
    for (let i = 0; i < n; i++) {
      const id = ids[(h + i * 7919) % ids.length], seed = (Math.imul(h ^ (i + 1), 2654435761) >>> 0) & 0x7fffffff;
      out.push({ ...Engine.itemFor(p, id), seed: seed || 1 });
    }
    return out;
  }

  I18N.add({ eq: {
    title: ['English quiz', 'ஆங்கில வினாடி வினா'],
    blurb: ['Quick, mixed questions from everything you have learnt in English', 'ஆங்கிலத்தில் நீ கற்ற எல்லாவற்றிலிருந்தும் விரைவான கலவைக் கேள்விகள்'],
    skill: { first: ['First sounds', 'முதல் ஒலி'], rhyme: ['Rhyming words', 'ஓசை ஒத்த சொற்கள் (rhymes)'], picword: ['Picture and word', 'படமும் சொல்லும்'], category: ['Which group?', 'எந்த வகை?'],
      opposite: ['Opposites', 'எதிர்ச்சொற்கள் (opposites)'], tamil: ['English and Tamil', 'ஆங்கிலமும் தமிழும்'], sight: ['Sight words', 'பார்வைச் சொற்கள் (sight words)'], wordclass: ['Naming, doing, describing', 'பெயர், செயல், பண்புச் சொற்கள்'],
      plural: ['One and many, a and an', 'ஒருமை பன்மை, a / an'], caps: ['Capitals and full stops', 'பெரிய எழுத்தும் முற்றுப்புள்ளியும்'], agree: ['is, are, he, she', 'is, are, he, she'], past: ['Past tense', 'இறந்த காலம் (past tense)'],
      sentence: ['Sentences', 'வாக்கியங்கள்'], order: ['Word order', 'சொல் வரிசை'], comp: ['Read and answer', 'படித்து விடை சொல்'], punct: ['Punctuation', 'நிறுத்தக் குறிகள் (punctuation)'], qword: ['Question words', 'வினாச் சொற்கள்'],
      synonym: ['Same meaning', 'ஒரே பொருள் (synonyms)'], affix: ['Prefixes and suffixes', 'முன்னொட்டு, பின்னொட்டு (prefix, suffix)'], homophone: ['Sound-alike words', 'ஒலி ஒத்த சொற்கள் (homophones)'] },
    theme: { animals: ['animals', 'விலங்குகள்'], creatures: ['birds and small creatures', 'பறவைகளும் சிறு உயிரினங்களும்'], fruits: ['fruits', 'பழங்கள்'], vegetables: ['vegetables', 'காய்கறிகள்'], home: ['things at home', 'வீட்டுப் பொருட்கள்'], travel: ['ways to travel', 'வாகனங்கள்'], outside: ['things outside', 'வெளியே காணும் பொருட்கள்'], play: ['play and school', 'விளையாட்டும் பள்ளியும்'] },
    cat: { fruit: ['a fruit', 'பழம் (fruit)'], veg: ['a vegetable', 'காய்கறி (vegetable)'], animal: ['an animal', 'விலங்கு (animal)'], bird: ['a bird', 'பறவை (bird)'], travel: ['something we travel in', 'பயணம் செய்யும் வாகனம்'], home: ['something we use at home', 'வீட்டில் பயன்படும் பொருள்'] },
    wc: { n: ['naming word (noun)', 'பெயர்ச்சொல் (noun)'], v: ['doing word (verb)', 'வினைச்சொல் (verb)'], a: ['describing word (adjective)', 'பண்புச்சொல் (adjective)'] },
    mark: { 0: ['full stop', 'முற்றுப்புள்ளி'], 1: ['question mark', 'கேள்விக்குறி'], 2: ['comma', 'காற்புள்ளி'], 3: ['apostrophe', 'உடைமைக் குறி'] },
    q: {
      firstPic: ['Listen to the sound. Which picture starts with it?', 'ஒலியைக் கேள். எந்தப் படம் இந்த ஒலியில் தொடங்குகிறது?'],
      firstLetter: ['Which letter does this word start with?', 'இந்தச் சொல் எந்த எழுத்தில் தொடங்குகிறது?'],
      rhyme: ['Which word rhymes with this word?', 'இந்தச் சொல்லுடன் ஓசை ஒத்த (rhyme) சொல் எது?'],
      hearPic: ['Listen. Tap the picture you hear.', 'கேள். நீ கேட்ட படத்தைத் தட்டு.'],
      picWord: ['Which word goes with the picture?', 'இந்தப் படத்துக்குப் பொருந்தும் சொல் எது?'],
      cat: ['Which one is {c}?', 'இவற்றில் எது {c}?'],
      opp: ['What is the opposite of this word?', 'இந்தச் சொல்லின் எதிர்ச்சொல் (opposite) எது?'],
      toTa: ['What does this word mean in Tamil?', 'இந்தச் சொல்லின் தமிழ்ப் பொருள் என்ன?'],
      toEn: ['Which English word means this?', 'இதன் ஆங்கிலச் சொல் எது?'],
      sight: ['Listen. Tap the word you hear.', 'கேள். நீ கேட்ட சொல்லைத் தட்டு.'],
      wc: ['Which one is a {k}?', 'இவற்றில் எது {k}?'], wcIn: ['Find the {k} in the sentence.', 'வாக்கியத்தில் உள்ள {k}-ஐக் கண்டுபிடி.'],
      plural: ['Pick the word for more than one.', 'ஒன்றுக்கு மேல் என்பதற்கான சொல்லைத் தேர்ந்தெடு.'],
      an: ['Which word needs "an" in front of it?', 'எந்தச் சொல்லுக்கு முன் "an" வர வேண்டும்?'], an2: ['Pick "a" or "an".', '"a" அல்லது "an" தேர்ந்தெடு.'],
      caps: ['Which sentence is written correctly?', 'எந்த வாக்கியம் சரியாக எழுதப்பட்டுள்ளது?'],
      fill: ['Pick the word that fits the gap.', 'இடைவெளிக்குப் பொருந்தும் சொல்லைத் தேர்ந்தெடு.'],
      past: ['It already happened. Pick the right word.', 'இது ஏற்கெனவே நடந்தது. சரியான சொல்லைத் தேர்ந்தெடு.'],
      goodSent: ['Which one is a proper sentence?', 'இவற்றில் சரியான வாக்கியம் எது?'],
      miss: ['Which word is missing?', 'விடுபட்ட சொல் எது?'],
      order: ['Put the words in order to make a sentence.', 'சொற்களை வரிசைப்படுத்தி வாக்கியம் அமை.'],
      comp: ['Read the story, then answer.', 'கதையைப் படி, பிறகு விடை சொல்.'],
      end: ['Which mark ends this sentence?', 'இந்த வாக்கியத்தின் முடிவில் எந்தக் குறி வரும்?'],
      comma: ['Which one uses commas correctly?', 'எதில் காற்புள்ளிகள் (commas) சரியாக உள்ளன?'],
      apos: ['Which one shows that the {th} belongs to {o}?', '{th} {o}-உடையது என்று எது காட்டுகிறது?'],
      qword: ['Pick the question word that fits the answer.', 'பதிலுக்குப் பொருந்தும் வினாச் சொல்லைத் தேர்ந்தெடு.'],
      syn: ['Which word means the same?', 'இதே பொருள் தரும் சொல் எது?'],
      affix: ['Which word means this?', 'இந்தப் பொருள் தரும் சொல் எது?'],
      hom: ['These words sound the same. Which one fits?', 'இந்தச் சொற்கள் ஒரே மாதிரி ஒலிக்கின்றன. எது பொருந்தும்?'],
    },
    h: {
      ans: ['The answer is {a}.', 'விடை {a}.'],
      first1: ['Say the word slowly. Listen to the very first sound.', 'சொல்லை மெதுவாகச் சொல். முதல் ஒலியைக் கவனி.'],
      firstPic2: ['The sound is {s}, like the start of {k}.', 'ஒலி {s}, {k} தொடங்குவது போல.'],
      first2: ['Say {w} slowly and stop after the first sound.', '{w} என்று மெதுவாகச் சொல்லி முதல் ஒலியில் நிறுத்து.'],
      rhyme1: ['Rhyming words sound the same at the end.', 'ஓசை ஒத்த சொற்கள் முடிவில் ஒரே மாதிரி ஒலிக்கும்.'],
      rhyme2: ['Look for a word that ends in {e}, like {w}.', '{w} போல {e} என்று முடியும் சொல்லைத் தேடு.'],
      hearPic1: ['Listen again and say the word yourself.', 'மீண்டும் கேட்டு, நீயே அந்தச் சொல்லைச் சொல்.'],
      hearPic2: ['It is one of the {th}.', 'அது {th}-இல் ஒன்று.'],
      picWord1: ['Look at the picture. What is it called?', 'படத்தைப் பார். அதன் பெயர் என்ன?'],
      picWord2: ['The word starts with {L} and has {n} letters.', 'சொல் {L}-இல் தொடங்குகிறது, அதில் {n} எழுத்துகள் உள்ளன.'],
      cat1: ['Think: which one is {c}?', 'யோசி: எது {c}?'],
      cat2: { fruit: ['A fruit grows on a plant and tastes sweet or sour.', 'பழம் செடியிலோ மரத்திலோ காய்க்கும்; இனிப்பாகவோ புளிப்பாகவோ இருக்கும்.'], veg: ['We cook vegetables in sambar and curry.', 'காய்கறிகளை சாம்பார், பொரியலில் சமைப்போம்.'],
        animal: ['An animal is alive, moves and eats food.', 'விலங்கு உயிருள்ளது; நகரும், உணவு உண்ணும்.'], bird: ['A bird has feathers, wings and a beak.', 'பறவைக்கு இறகுகள், சிறகுகள், அலகு உண்டு.'],
        travel: ['It has wheels, wings or floats on water.', 'அதற்குச் சக்கரங்கள், இறக்கைகள் இருக்கும், அல்லது நீரில் மிதக்கும்.'], home: ['You can find it in a kitchen or a bedroom.', 'அதைச் சமையலறையிலோ படுக்கையறையிலோ காணலாம்.'] },
      opp1: ['An opposite means the other end: hot and cold.', 'எதிர்ச்சொல் என்பது மறுமுனை: hot, cold.'],
      opp2: ['Picture {w}. Now picture the very opposite.', '{w} என்பதை நினை. இப்போது அதற்கு நேர் எதிரானதை நினை.'],
      tamil1: ['Say the word aloud and think of the picture.', 'சொல்லை உரக்கச் சொல்லி, அதன் படத்தை நினை.'],
      tamil2: ['It is one of the {th}.', 'அது {th}-இல் ஒன்று.'],
      sight1: ['Listen again. Look at the first letter of each word.', 'மீண்டும் கேள். ஒவ்வொரு சொல்லின் முதல் எழுத்தையும் பார்.'],
      sight2: ['It starts with {L} and has {n} letters.', 'அது {L}-இல் தொடங்குகிறது, அதில் {n} எழுத்துகள் உள்ளன.'],
      wc1: { n: ['A noun names a person, animal, place or thing.', 'பெயர்ச்சொல் ஒருவர், விலங்கு, இடம் அல்லது பொருளின் பெயர்.'], v: ['A verb is something you can do.', 'வினைச்சொல் நீ செய்யக்கூடிய ஒரு செயல்.'], a: ['An adjective tells what something is like.', 'பண்புச்சொல் ஒன்று எப்படி இருக்கிறது என்று சொல்லும்.'] },
      wc2: { n: ['Can you put "the" in front of it? "the cat"', 'அதற்கு முன் "the" சேர்க்க முடியுமா? "the cat"'], v: ['Can you say "I can ..." with it? "I can run"', '"I can ..." என்று சொல்ல முடியுமா? "I can run"'], a: ['Can you say "It is very ..."? "It is very big"', '"It is very ..." என்று சொல்ல முடியுமா? "It is very big"'] },
      pl1: ['Most words add s for more than one.', 'பெரும்பாலான சொற்களுக்கு, ஒன்றுக்கு மேல் என்றால் s சேர்க்கிறோம்.'],
      pl2: { s: ['Just add s to {w}.', '{w}-உடன் s மட்டும் சேர்.'], es: ['{w} ends in s, x, sh or ch, so add es.', '{w} s, x, sh, ch-இல் முடிகிறது; அதனால் es சேர்.'], ies: ['{w} ends in y: change y to i and add es.', '{w} y-இல் முடிகிறது: y-ஐ i ஆக்கி es சேர்.'],
        irr: ['{w} is a special word: it changes inside, not at the end.', '{w} ஒரு தனிச் சொல்: முடிவில் அல்ல, உள்ளே மாறும்.'], ves: ['{w} ends in f or fe: change it to ves.', '{w} f அல்லது fe-இல் முடிகிறது: அதை ves ஆக்கு.'] },
      an1: ['Say the word. Does it start with a vowel sound: a, e, i, o, u?', 'சொல்லைச் சொல். அது a, e, i, o, u உயிர் ஒலியில் தொடங்குகிறதா?'],
      an2: ['Use "an" before a vowel sound, "a" before other sounds.', 'உயிர் ஒலிக்கு முன் "an", மற்றவற்றுக்கு முன் "a".'],
      caps1: ['Look at the first letter and the very end of each sentence.', 'ஒவ்வொரு வாக்கியத்தின் முதல் எழுத்தையும் கடைசியையும் பார்.'],
      caps2: ['It starts with a capital letter and ends with a full stop.', 'அது பெரிய எழுத்தில் தொடங்கி முற்றுப்புள்ளியில் முடியும்.'],
      caps2n: ['Names of people and places also start with a capital letter.', 'ஆட்கள், இடங்களின் பெயர்களும் பெரிய எழுத்தில் தொடங்கும்.'],
      be1: ['Who is it about: one, many, or "I"?', 'இது யாரைப் பற்றியது: ஒருவர், பலர், அல்லது "I"?'],
      be2: { is: ['It is about one thing, so use is.', 'இது ஒன்றைப் பற்றியது; அதனால் is.'], are: ['It is about more than one, so use are.', 'இது ஒன்றுக்கு மேற்பட்டதைப் பற்றியது; அதனால் are.'], am: ['With "I" we always use am.', '"I" உடன் எப்போதும் am.'] },
      pro1: ['Who is the sentence talking about?', 'வாக்கியம் யாரைப் பற்றிப் பேசுகிறது?'],
      pro2: { he: ['It is one boy or man.', 'இது ஒரு சிறுவன் அல்லது ஆண்.'], she: ['It is one girl or woman.', 'இது ஒரு சிறுமி அல்லது பெண்.'], they: ['It is more than one.', 'இது ஒன்றுக்கு மேற்பட்டது.'], it: ['It is a thing, not a person.', 'இது ஒரு பொருள், ஆள் அல்ல.'] },
      past1: ['Words like "yesterday" and "last" tell us it is the past.', '"yesterday", "last" போன்ற சொற்கள் இறந்த காலத்தைக் காட்டும்.'],
      past2r: ['This word just adds ed.', 'இந்தச் சொல்லுக்கு ed மட்டும் சேர்க்கிறோம்.'], past2i: ['This word changes in the past, it does not add ed.', 'இந்தச் சொல் இறந்த காலத்தில் மாறும்; ed சேர்க்காது.'],
      good1: ['Read each one aloud. Which one makes sense?', 'ஒவ்வொன்றையும் உரக்கப் படி. எது பொருள் தருகிறது?'],
      good2: ['The proper sentence starts with {w}.', 'சரியான வாக்கியம் {w} என்று தொடங்குகிறது.'],
      miss1: ['Read the sentence and say "something" for the gap.', 'வாக்கியத்தைப் படி; இடைவெளியில் "ஏதோ ஒன்று" என்று சொல்.'],
      miss2: ['Try each word in the gap. Which one makes sense?', 'ஒவ்வொரு சொல்லையும் இடைவெளியில் வைத்துப் பார். எது பொருள் தருகிறது?'],
      order1: ['The word with a capital letter usually comes first.', 'பெரிய எழுத்தில் உள்ள சொல் பொதுவாக முதலில் வரும்.'],
      order2: ['It starts with {w}.', 'அது {w} என்று தொடங்குகிறது.'],
      comp1: ['Read the story again. Look for words from the question.', 'கதையை மீண்டும் படி. கேள்வியில் உள்ள சொற்களைத் தேடு.'],
      comp2: ['This line has the answer: {s}', 'இந்த வரியில் விடை உள்ளது: {s}'],
      end1: ['Is it asking something or telling something?', 'இது ஏதாவது கேட்கிறதா, சொல்கிறதா?'],
      end2q: ['It asks something, so it needs a question mark.', 'இது கேட்கிறது; அதனால் கேள்விக்குறி வேண்டும்.'], end2s: ['It tells something, so it needs a full stop.', 'இது சொல்கிறது; அதனால் முற்றுப்புள்ளி வேண்டும்.'],
      comma1: ['Commas go between things in a list.', 'பட்டியலில் உள்ள பொருட்களுக்கு இடையில் காற்புள்ளி வரும்.'],
      comma2: ['The last two things are joined by "and", with no comma.', 'கடைசி இரண்டையும் "and" இணைக்கும்; அங்கே காற்புள்ளி இல்லை.'],
      apos1: ['To show something belongs to someone, we use an apostrophe and s.', 'ஒன்று ஒருவருக்குச் சொந்தம் என்று காட்ட apostrophe-உம் s-உம் சேர்க்கிறோம்.'],
      apos2: ['Write {o}, then the mark, then s.', '{o} எழுதி, பிறகு குறி, பிறகு s.'],
      qw1: ['Read the answer. What does it tell you: a thing, a place, a time, a person, a reason or a way?', 'பதிலைப் படி. அது எதைச் சொல்கிறது: பொருள், இடம், நேரம், ஆள், காரணம், வழி?'],
      qw2: { what: ['The answer is a thing.', 'பதில் ஒரு பொருள்.'], where: ['The answer is a place.', 'பதில் ஒரு இடம்.'], when: ['The answer is a time.', 'பதில் ஒரு நேரம்.'], who: ['The answer is a person.', 'பதில் ஒரு ஆள்.'], why: ['The answer is a reason: "Because ..."', 'பதில் ஒரு காரணம்: "Because ..."'], how: ['The answer tells the way or how much.', 'பதில் வழியையோ அளவையோ சொல்கிறது.'] },
      syn1: ['A synonym is a different word with the same meaning.', 'ஒரே பொருள் தரும் வேறு சொல் synonym.'],
      syn2: ['Make a sentence with {w}, then swap in each word.', '{w} வைத்து ஒரு வாக்கியம் சொல்லி, ஒவ்வொரு சொல்லையும் மாற்றிப் பார்.'],
      affix1: ['Find the root word, then look at the beginning or ending.', 'மூலச் சொல்லைக் கண்டுபிடி; பிறகு தொடக்கத்தையோ முடிவையோ பார்.'],
      affix2: { un: ['un- at the start means "not".', 'தொடக்கத்தில் un- என்றால் "இல்லை".'], re: ['re- at the start means "again".', 'தொடக்கத்தில் re- என்றால் "மீண்டும்".'], ful: ['-ful at the end means "full of".', 'முடிவில் -ful என்றால் "நிறைந்த".'], less: ['-less at the end means "without".', 'முடிவில் -less என்றால் "இல்லாத".'] },
      hom1: ['{a} and {b} sound the same but mean different things.', '{a}, {b} ஒரே மாதிரி ஒலிக்கும், ஆனால் பொருள் வேறு.'],
      hom2: ['Think about the meaning of the sentence.', 'வாக்கியத்தின் பொருளை யோசி.'],
    },
    y: {
      first: ['{w} starts with the sound {s}. That is the letter {L}.', '{w} {s} என்ற ஒலியில் தொடங்குகிறது. அது {L} என்ற எழுத்து.'],
      meansTa: ['{w} in Tamil is {ta}.', '{w} என்பது தமிழில் {ta}.'],
      inSentence: ['In a sentence: {s}', 'ஒரு வாக்கியத்தில்: {s}'],
      example: ['Example: {s}', 'எடுத்துக்காட்டு: {s}'],
      rhyme: ['{w} and {a} both end in {e}, so they rhyme.', '{w}, {a} இரண்டும் {e} என்று முடிகின்றன; அதனால் ஓசை ஒத்தவை.'],
      rhymeMore: ['More words in this family: {list}', 'இந்தக் குடும்பத்தில் மேலும் சொற்கள்: {list}'],
      picword: ['This is {w}. It is one of the {th}.', 'இது {w}. இது {th}-இல் ஒன்று.'],
      cat: ['{w} is {c}.', '{w} ஒரு {c}.'], catMore: ['Other examples of {c}: {list}', '{c}-க்கு மற்ற எடுத்துக்காட்டுகள்: {list}'],
      opp: ['The opposite of {w} is {a}.', '{w}-இன் எதிர்ச்சொல் {a}.'],
      tamil: ['{w} means {ta}.', '{w} என்றால் {ta}.'],
      sight: ['{w} is a sight word. We see it so often that we read it at a glance.', '{w} ஒரு பார்வைச் சொல். அடிக்கடி பார்ப்பதால் ஒரே பார்வையில் படித்துவிடுவோம்.'],
      wc: { n: ['{w} is a naming word (noun): it names a person, animal, place or thing.', '{w} ஒரு பெயர்ச்சொல் (noun): ஆள், விலங்கு, இடம் அல்லது பொருளின் பெயர்.'], v: ['{w} is a doing word (verb): it tells an action.', '{w} ஒரு வினைச்சொல் (verb): அது ஒரு செயலைச் சொல்கிறது.'], a: ['{w} is a describing word (adjective): it tells us more about a noun.', '{w} ஒரு பண்புச்சொல் (adjective): பெயர்ச்சொல்லைப் பற்றி மேலும் சொல்கிறது.'] },
      pl: { s: ['For most words, add s: {w} becomes {a}.', 'பெரும்பாலான சொற்களுக்கு s சேர்: {w} → {a}.'], es: ['Words ending in s, x, sh or ch add es: {w} becomes {a}.', 's, x, sh, ch-இல் முடியும் சொற்களுக்கு es: {w} → {a}.'], ies: ['Consonant + y: change y to ies. {w} becomes {a}.', 'மெய் + y: y-ஐ ies ஆக்கு. {w} → {a}.'],
        irr: ['Some words change in a special way: {w} becomes {a}.', 'சில சொற்கள் தனி விதமாக மாறும்: {w} → {a}.'], ves: ['Many words ending in f or fe change to ves: {w} becomes {a}.', 'f, fe-இல் முடியும் பல சொற்கள் ves ஆகும்: {w} → {a}.'] },
      an: ['{w} starts with the vowel sound {L}, so we say "an".', '{w} {L} என்ற உயிர் ஒலியில் தொடங்குகிறது; அதனால் "an".'], a: ['{w} starts with {L}, not a vowel sound, so we say "a".', '{w} {L}-இல் தொடங்குகிறது, அது உயிர் ஒலி அல்ல; அதனால் "a".'],
      caps: ['{s} starts with a capital letter and ends with a full stop.', '{s} பெரிய எழுத்தில் தொடங்கி முற்றுப்புள்ளியில் முடிகிறது.'],
      capsNames: ['Names always start with a capital letter: {n}.', 'பெயர்கள் எப்போதும் பெரிய எழுத்தில் தொடங்கும்: {n}.'],
      be: { is: ['Use is for one person or thing.', 'ஒருவர் அல்லது ஒன்றுக்கு is.'], are: ['Use are for more than one, and with "we", "you" and "they".', 'ஒன்றுக்கு மேல், "we", "you", "they" உடன் are.'], am: ['Use am only with "I".', '"I" உடன் மட்டும் am.'] },
      pro: { he: ['He stands for one boy or man.', 'He என்பது ஒரு சிறுவன் அல்லது ஆணுக்குப் பதில்.'], she: ['She stands for one girl or woman.', 'She என்பது ஒரு சிறுமி அல்லது பெண்ணுக்குப் பதில்.'], they: ['They stands for more than one.', 'They என்பது ஒன்றுக்கு மேற்பட்டவர்களுக்குப் பதில்.'], it: ['It stands for a thing or an animal.', 'It என்பது ஒரு பொருள் அல்லது விலங்குக்குப் பதில்.'] },
      pastR: ['To talk about the past, most words add ed: {b} becomes {a}.', 'இறந்த காலத்துக்குப் பெரும்பாலான சொற்கள் ed சேர்க்கும்: {b} → {a}.'], pastI: ['{b} is a special word. In the past it becomes {a}.', '{b} ஒரு தனிச் சொல். இறந்த காலத்தில் {a} ஆகிறது.'],
      good: ['{s} has the words in the right order, so it makes sense.', '{s}-இல் சொற்கள் சரியான வரிசையில் உள்ளன; அதனால் பொருள் தருகிறது.'],
      goodWho: ['It begins by saying who or what: {w} ...', 'யார் அல்லது எது என்று சொல்லித் தொடங்குகிறது: {w} ...'],
      miss: ['The full sentence: {s}', 'முழு வாக்கியம்: {s}'], missWhy: ['Only {a} makes sense here.', 'இங்கே {a} மட்டுமே பொருள் தருகிறது.'],
      order: ['The sentence is: {s}', 'வாக்கியம்: {s}'],
      comp: ['The story says: {s}', 'கதை சொல்கிறது: {s}'], compSo: ['So for "{q}" the answer is {a}.', 'எனவே "{q}" என்பதற்கு விடை {a}.'],
      endQ: ['{s} asks something, so it ends with a question mark.', '{s} ஏதோ கேட்கிறது; அதனால் கேள்விக்குறியில் முடிகிறது.'], endS: ['{s} tells something, so it ends with a full stop.', '{s} ஏதோ சொல்கிறது; அதனால் முற்றுப்புள்ளியில் முடிகிறது.'],
      comma: ['{s} has a comma between the things in the list, and "and" before the last one.', '{s}-இல் பட்டியல் பொருட்களுக்கு இடையில் காற்புள்ளி, கடைசிக்கு முன் "and".'],
      apos: ['{a} means the {th} belongs to {o}.', '{a} என்றால் {th} {o}-உடையது.'],
      qw: { what: ['{s} {rep} We ask What for a thing.', '{s} {rep} பொருளைக் கேட்க What.'], where: ['{s} {rep} We ask Where for a place.', '{s} {rep} இடத்தைக் கேட்க Where.'], when: ['{s} {rep} We ask When for a time.', '{s} {rep} நேரத்தைக் கேட்க When.'],
        who: ['{s} {rep} We ask Who for a person.', '{s} {rep} ஆளைக் கேட்க Who.'], why: ['{s} {rep} We ask Why for a reason.', '{s} {rep} காரணத்தைக் கேட்க Why.'], how: ['{s} {rep} We ask How for the way or how much.', '{s} {rep} வழி அல்லது அளவைக் கேட்க How.'] },
      syn: ['{w} and {a} mean the same, so they are synonyms.', '{w}, {a} ஒரே பொருள் தருகின்றன; அவை synonyms.'], synNot: ['{x} is the opposite of {w}, not the same.', '{x} என்பது {w}-இன் எதிர்ச்சொல்; ஒரே பொருள் அல்ல.'],
      affix: { un: ['{a} is un + {r}: un- means "not".', '{a} = un + {r}: un- என்றால் "இல்லை".'], re: ['{a} is re + {r}: re- means "again".', '{a} = re + {r}: re- என்றால் "மீண்டும்".'], ful: ['{a} is {r} + ful: -ful means "full of".', '{a} = {r} + ful: -ful என்றால் "நிறைந்த".'], less: ['{a} is {r} + less: -less means "without".', '{a} = {r} + less: -less என்றால் "இல்லாத".'] },
      affixEx: { un: ['More: unfair, unwell, unpack.', 'மேலும்: unfair, unwell, unpack.'], re: ['More: redo, replay, rewrite.', 'மேலும்: redo, replay, rewrite.'], ful: ['More: joyful, painful, playful.', 'மேலும்: joyful, painful, playful.'], less: ['More: endless, homeless, useless.', 'மேலும்: endless, homeless, useless.'] },
      hom: ['{a} and {b} sound the same but are spelt differently and mean different things.', '{a}, {b} ஒரே ஒலி; எழுத்தும் பொருளும் வேறு.'],
    },
    r: {
      first: ['Every word starts with a sound. Letters stand for sounds.', 'ஒவ்வொரு சொல்லும் ஒரு ஒலியில் தொடங்குகிறது. எழுத்துகள் ஒலிகளைக் குறிக்கின்றன.'],
      rhyme: ['Words that end with the same sound rhyme.', 'ஒரே ஒலியில் முடியும் சொற்கள் ஓசை ஒத்தவை (rhyme).'],
      picword: ['Match the picture to its name.', 'படத்தை அதன் பெயருடன் பொருத்து.'],
      cat: ['Things can be sorted into groups.', 'பொருட்களை வகைகளாகப் பிரிக்கலாம்.'],
      opp: ['Opposites are words that mean the other end.', 'எதிர்ச்சொற்கள் மறுமுனையைக் குறிக்கும் சொற்கள்.'],
      tamil: ['Knowing a word in two languages helps you remember it.', 'ஒரு சொல்லை இரண்டு மொழிகளில் தெரிந்தால் நினைவில் நிற்கும்.'],
      sight: ['Sight words are read by look, not sounded out.', 'பார்வைச் சொற்களைப் பார்த்தே படிக்கிறோம்; ஒலித்துப் பார்ப்பதில்லை.'],
      wc: ['Nouns name, verbs do, adjectives describe.', 'பெயர்ச்சொல் பெயரிடும், வினைச்சொல் செயல் சொல்லும், பண்புச்சொல் விவரிக்கும்.'],
      pl: ['Plural means more than one.', 'பன்மை (plural) என்றால் ஒன்றுக்கு மேல்.'],
      an: ['"an" before a vowel sound, "a" before other sounds.', 'உயிர் ஒலிக்கு முன் "an", மற்றவற்றுக்கு முன் "a".'],
      caps: ['A sentence starts with a capital letter and ends with a full stop.', 'வாக்கியம் பெரிய எழுத்தில் தொடங்கி முற்றுப்புள்ளியில் முடியும்.'],
      be: ['I am, he is, they are.', 'I am, he is, they are.'],
      pro: ['He, she, it and they stand in for names.', 'He, she, it, they பெயர்களுக்குப் பதிலாக வரும்.'],
      past: ['The past tense tells what already happened.', 'இறந்த காலம் ஏற்கெனவே நடந்ததைச் சொல்லும்.'],
      good: ['A sentence has words in an order that makes sense.', 'வாக்கியத்தில் சொற்கள் பொருள் தரும் வரிசையில் இருக்கும்.'],
      miss: ['Read the whole sentence to find the word that fits.', 'பொருந்தும் சொல்லைக் கண்டுபிடிக்க முழு வாக்கியத்தையும் படி.'],
      order: ['English sentences usually go: who, does what, the rest.', 'ஆங்கில வாக்கியம் பொதுவாக: யார், என்ன செய்கிறார், மற்றவை.'],
      comp: ['The answer is in the story. Find the line that matches the question.', 'விடை கதையிலேயே உள்ளது. கேள்விக்குப் பொருந்தும் வரியைக் கண்டுபிடி.'],
      end: ['Telling sentences end with a full stop, asking sentences with a question mark.', 'சொல்லும் வாக்கியம் முற்றுப்புள்ளியிலும், கேட்கும் வாக்கியம் கேள்விக்குறியிலும் முடியும்.'],
      comma: ['Use commas to separate things in a list.', 'பட்டியல் பொருட்களைப் பிரிக்கக் காற்புள்ளி.'],
      apos: ['Apostrophe + s shows that something belongs to someone.', 'Apostrophe + s உடைமையைக் காட்டும்.'],
      qw: ['What, where, when, who, why and how each ask for a different kind of answer.', 'What, where, when, who, why, how ஒவ்வொன்றும் வேறு வகை விடையைக் கேட்கும்.'],
      syn: ['Synonyms are words with the same meaning.', 'ஒரே பொருள் உள்ள சொற்கள் synonyms.'],
      affix: ['A prefix goes at the start, a suffix at the end. Both change the meaning.', 'முன்னொட்டு தொடக்கத்தில், பின்னொட்டு முடிவில். இரண்டும் பொருளை மாற்றும்.'],
      hom: ['Homophones sound the same but have different spellings and meanings.', 'Homophones ஒரே ஒலி, ஆனால் எழுத்தும் பொருளும் வேறு.'],
    },
    ui: {
      capsBoard: ['Aa . Capital letter, full stop', 'Aa . பெரிய எழுத்து, முற்றுப்புள்ளி'],
      choose: ['Pick how you want to play.', 'எப்படி விளையாட வேண்டும் என்று தேர்ந்தெடு.'],
      quick: ['Quick quiz', 'விரைவு வினாடி வினா'], quickD: ['{n} mixed questions, no clock.', '{n} கலவைக் கேள்விகள், நேரக் கணக்கு இல்லை.'],
      best: ['Beat your best', 'உன் சாதனையை முறியடி'], bestD: ['A quiet ring shows the time left for each question.', 'ஒவ்வொரு கேள்விக்கும் மீதமுள்ள நேரத்தை ஒரு வளையம் அமைதியாகக் காட்டும்.'],
      bestIs: ['Your best: {a} of {b}', 'உன் சிறந்த மதிப்பெண்: {b}-இல் {a}'], noBest: ['No best score yet', 'இன்னும் சிறந்த மதிப்பெண் இல்லை'], newBest: ['New personal best: {a} of {b}', 'புதிய சாதனை: {b}-இல் {a}'],
      timeLimit: ['{s} seconds for this question', 'இந்தக் கேள்விக்கு {s} வினாடிகள்'], timeUp: ['Time is up. Here is the answer.', 'நேரம் முடிந்தது. இதோ விடை.'],
    },
  } });

  window.ENGQUIZ = { game, topic, daily, IDS, pool, META };
})();
