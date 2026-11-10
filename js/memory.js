// Memory (flip and match) for all three subjects. Pairs are learning pairs, never two identical pictures.
// Pairs that took many flips go to the review queue (skill 'mem.<subject>' rebuilds a match question from the seed).
(function () {
  const esc = Engine.esc;
  I18N.add({ mem: {
    title: ['Memory match', 'நினைவுப் பொருத்தம்'], blurb: { maths: ['Flip cards to match each sum with its answer and each number with its picture.', 'ஒவ்வொரு கணக்கையும் அதன் விடையுடனும், ஒவ்வொரு எண்ணையும் அதன் படத்துடனும் பொருத்த அட்டைகளைத் திருப்பு.'], english: ['Match each word with its picture or its Tamil meaning.', 'ஒவ்வொரு சொல்லையும் அதன் படத்துடன் அல்லது தமிழ்ப் பொருளுடன் பொருத்து.'], science: ['Match animals with their homes, plant parts and body parts with their jobs.', 'விலங்குகளை அவற்றின் வாழிடத்துடனும், தாவர, உடல் உறுப்புகளை அவற்றின் வேலையுடனும் பொருத்து.'] },
    flips: ['Flips', 'திருப்பல்கள்'], best: ['Personal best', 'உன் சிறந்தது'], pairsLeft: ['{n} pairs to find', 'கண்டுபிடிக்க {n} இணைகள்'], match: ['They match.', 'பொருந்துகின்றன.'], noMatch: ['Not a pair. Try to remember where they were.', 'இணை இல்லை. அவை எங்கே இருந்தன என்று நினைவில் வை.'],
    recap: ['All pairs found', 'எல்லா இணைகளும் கிடைத்தன'], recapBody: ['{f} flips for {n} pairs.', '{n} இணைகளுக்கு {f} திருப்பல்கள்.'], newBest: ['A new personal best.', 'புதிய சிறந்த மதிப்பெண்.'], review: ['Took a few tries, so it will come back in review', 'சில முயற்சிகள் தேவைப்பட்டன; மீள்பார்வையில் மீண்டும் வரும்'],
    again: ['Play again', 'மீண்டும் விளையாடு'], card: ['Card {n}', 'அட்டை {n}'], hidden: ['face down', 'கவிழ்ந்துள்ளது'], found: ['matched', 'பொருந்தியது'], help: ['Tap two cards, or use the arrow keys and Enter.', 'இரண்டு அட்டைகளைத் தட்டு, அல்லது அம்புக் குறி விசைகளையும் Enter-ஐயும் பயன்படுத்து.'],
    qMatch: ['Which one goes with “{a}”?', '“{a}” உடன் பொருந்துவது எது?'], skill: ['Memory pairs', 'நினைவு இணைகள்'],
    why: {
      sum: ['{a} makes {b}.', '{a} = {b}.'], frame: ['The frame shows {n} counters.', 'சட்டத்தில் {n} மணிகள் உள்ளன.'], word: ['This is a {w}.', 'இது {w}.'], tamil: ['“{w}” means “{ta}”.', '“{w}” என்றால் “{ta}”.'],
      home: ['A {a} lives {b}.', '{a} {b} வாழும்.'], job: ['The {a}: {b}.', '{a}: {b}.'],
    },
    sci: {
      animal: { fish: ['fish', 'மீன்'], frog: ['frog', 'தவளை'], tiger: ['tiger', 'புலி'], cow: ['cow', 'பசு'], parrot: ['parrot', 'கிளி'], bee: ['bee', 'தேனீ'], ant: ['ant', 'எறும்பு'], duck: ['duck', 'வாத்து'], elephant: ['elephant', 'யானை'], monkey: ['monkey', 'குரங்கு'] },
      home: { fish: ['in water', 'நீரில்'], frog: ['in and near a pond', 'குளத்திலும் அதன் அருகிலும்'], tiger: ['in the forest', 'காட்டில்'], cow: ['on a farm', 'பண்ணையில்'], parrot: ['in a hole in a tree', 'மரப் பொந்தில்'], bee: ['in a hive', 'தேன்கூட்டில்'], ant: ['in an anthill underground', 'நிலத்தடிப் புற்றில்'], duck: ['on a pond', 'குளத்தில்'], elephant: ['in the forest', 'காட்டில்'], monkey: ['in the trees', 'மரங்களில்'] },
      part: { root: ['root', 'வேர்'], leaf: ['leaf', 'இலை'], flower: ['flower', 'பூ'], stem: ['stem', 'தண்டு'], seed: ['seed', 'விதை'], fruit: ['fruit', 'பழம்'] },
      partJob: { root: ['drinks water from the soil', 'மண்ணிலிருந்து நீரை உறிஞ்சும்'], leaf: ['makes food from sunlight', 'சூரிய ஒளியிலிருந்து உணவு தயாரிக்கும்'], flower: ['makes seeds', 'விதைகளை உருவாக்கும்'], stem: ['carries water up the plant', 'நீரை மேலே கொண்டு செல்லும்'], seed: ['grows into a new plant', 'புதிய தாவரமாக வளரும்'], fruit: ['holds and protects the seeds', 'விதைகளைக் காக்கும்'] },
      organ: { heart: ['heart', 'இதயம்'], lungs: ['lungs', 'நுரையீரல்'], brain: ['brain', 'மூளை'], stomach: ['stomach', 'இரைப்பை'], eyes: ['eyes', 'கண்கள்'], ears: ['ears', 'காதுகள்'], nose: ['nose', 'மூக்கு'], teeth: ['teeth', 'பற்கள்'] },
      organJob: { heart: ['pumps blood', 'இரத்தத்தை உந்தும்'], lungs: ['let you breathe', 'சுவாசிக்க உதவும்'], brain: ['thinks and remembers', 'சிந்திக்கும், நினைவில் வைக்கும்'], stomach: ['breaks down food', 'உணவைச் சிதைக்கும்'], eyes: ['let you see', 'பார்க்க உதவும்'], ears: ['let you hear', 'கேட்க உதவும்'], nose: ['lets you smell', 'நுகர உதவும்'], teeth: ['bite and chew food', 'உணவைக் கடித்து மெல்லும்'] },
    },
  } });

  // ---------- pair pools (each pair: { id, a: face, b: face, why } ; face: { html, say } ) ----------
  const txt = (s, lang) => ({ html: `<span ${lang ? `lang="${lang}"` : ''}>${esc(s)}</span>`, say: [{ text: s, lang: lang || I18N.lang }] });
  const img = (src, label, lang = 'en') => ({ html: `<img src="${src}" alt="${esc(label)}" referrerpolicy="no-referrer"><span ${lang ? `lang="${lang}"` : ''}>${esc(label)}</span>`, say: [{ text: label, lang }] });
  // every pair has a numeric code so the review queue can rebuild exactly that pair
  const SCI_KEYS = () => { const S = tx('mem.sci'); return [...Object.keys(S.animal).map(k => 'home:' + k), ...Object.keys(S.part).map(k => 'part:' + k), ...Object.keys(S.organ).map(k => 'organ:' + k)]; };
  const WORD_KEYS = () => Object.keys(EN_DATA.WORDS);
  const thumb = html => (html.match(/<img[^>]*>/) || [''])[0].replace('<img ', '<img class="memthumb" ');
  function mathsPair(kind, a, b) {
    if (kind === 'f') return { id: 'f' + a, code: 300000 + a, label: String(a), a: { html: `<span class="bignum">${a}</span>`, say: [{ text: String(a), lang: I18N.lang }] }, b: { html: VIS.tenFrame({ n: a, frames: a > 10 ? 2 : 1 }), say: [{ text: t('mem.why.frame', { n: a }), lang: I18N.lang }] }, why: t('mem.why.frame', { n: a }) };
    const mul = kind === 'm', e = mul ? `${a} × ${b}` : `${a} + ${b}`, v = mul ? a * b : a + b;
    return { id: 'n' + v, code: (mul ? 200000 : 100000) + a * 100 + b, label: `${e} = ${v}`, a: { html: `<span class="bignum">${e}</span>`, say: [{ text: e, lang: I18N.lang }] }, b: { html: `<span class="bignum">${v}</span>`, say: [{ text: String(v), lang: I18N.lang }] }, why: t('mem.why.sum', { a: e, b: v }) };
  }
  function englishPair(w, tamil) {
    const label = EN_DATA.WORDS[w].label || w, ta = EN_DATA.WORDS[w].ta, code = 400000 + WORD_KEYS().indexOf(w) * 2 + (tamil ? 1 : 0);
    return tamil ? { id: 'ta:' + w, code, label, a: txt(label, 'en'), b: txt(ta, 'ta'), why: t('mem.why.tamil', { w: label, ta }) }
      : { id: 'pic:' + w, code, label, a: { html: `<span class="bignum" lang="en">${esc(label)}</span>`, say: [{ text: label, lang: 'en' }] }, b: { html: `<img src="${PICS[w].src}" alt="${esc(label)}" referrerpolicy="no-referrer">`, say: [{ text: label, lang: 'en' }] }, why: t('mem.why.word', { w: label }) };
  }
  function sciencePair(id) {
    const S = tx('mem.sci'), [kind, k] = id.split(':'), code = 500000 + SCI_KEYS().indexOf(id);
    if (kind === 'home') { const p = window.PICS?.[k]; return { id, code, label: S.animal[k], a: p ? img(p.src, S.animal[k], I18N.lang) : txt(S.animal[k]), b: txt(S.home[k]), why: t('mem.why.home', { a: S.animal[k], b: S.home[k] }) }; }
    const PK = { root: 'root', leaf: 'leaf', flower: 'flower2', stem: 'stem2', seed: 'greengram', fruit: 'mango' }[k]; const pp = window.PHOTOS?.[PK] || window.PICS?.[PK];
    if (kind === 'part') return { id, code, label: S.part[k], a: pp ? img(pp.src, S.part[k], I18N.lang) : txt(S.part[k]), b: txt(S.partJob[k]), why: t('mem.why.job', { a: S.part[k], b: S.partJob[k] }) };
    const ok2 = { eyes: 'eye', ears: 'ear' }[k] || k; const ph = window.PHOTOS?.[ok2] ? PHOTOS[ok2].src : ['lungs', 'brain', 'stomach'].includes(k) ? `img/body/${k}.jpg` : null;
    return { id, code, label: S.organ[k], a: ph ? img(ph, S.organ[k], I18N.lang) : txt(S.organ[k]), b: txt(S.organJob[k]), why: t('mem.why.job', { a: S.organ[k], b: S.organJob[k] }) };
  }
  function decode(code) {
    if (code >= 500000) return sciencePair(SCI_KEYS()[code - 500000]);
    if (code >= 400000) { const i = code - 400000; return englishPair(WORD_KEYS()[i >> 1], i & 1); }
    if (code >= 300000) return mathsPair('f', code - 300000);
    const mul = code >= 200000, x = code % 100000; return mathsPair(mul ? 'm' : 's', Math.floor(x / 100), x % 100);
  }
  function pool(subject, band, r) {
    if (subject === 'maths') {
      const out = [], used = new Set();
      while (out.length < 14) {
        let pr;
        if (r() < 0.4) pr = mathsPair('f', r.int(1, band === 'young' ? 10 : 15));
        else if (band === 'older' && r() < 0.4) pr = mathsPair('m', r.int(2, 5), r.int(2, 5));
        else { const s2 = r.int(3, band === 'young' ? 10 : 20), a2 = r.int(1, s2 - 1); pr = mathsPair('s', a2, s2 - a2); }
        if (used.has(pr.id)) continue; used.add(pr.id); out.push(pr);
      }
      return out;
    }
    if (subject === 'english') {
      const words = Object.keys(EN_DATA.WORDS).filter(w => EN_DATA.WORDS[w].theme && window.PICS?.[w]);
      return r.shuffle(words).slice(0, 14).map((w, i) => englishPair(w, band === 'older' ? i % 2 === 1 : i % 3 === 2));
    }
    // one kind of pair per board so similar answers don't collide (e.g. two 'in the forest')
    const kinds = band === 'older' ? ['home', 'part', 'organ'] : ['home', 'part'], kind = kinds[r.int(0, kinds.length - 1)];
    const seen = new Set();
    return r.shuffle(SCI_KEYS().filter(id => id.startsWith(kind))).map(sciencePair).filter(x => { if (seen.has(x.b.html)) return false; seen.add(x.b.html); return true; });
  }

  // review: rebuild one pair as a match question
  ['maths', 'english', 'science'].forEach(subject => Engine.skill({ id: 'mem.' + subject, subject, topic: 'memory', name: 'mem.skill', bands: { young: [1, 1], older: [1, 2] }, warm: false,
    gen(l, r, ctx = {}) { const band = l === 2 ? 'older' : 'young', ps = pool(subject, band, r), p = (ctx.seed >= 100000 ? decode(ctx.seed) : null) || ps[0], others = ps.filter(x => x.id !== p.id && x.b.html !== p.b.html).slice(0, 2);
      const choices = r.shuffle([p, ...others]).map(x => ({ v: x.id, html: x.b.html.replace(/<img /, '<img class="memimg" ') }));
      const side = h => h.replace(/<img[^>]*>/, '').trim();
      return { kind: 'choice', prompt: t('mem.qMatch', { a: side(p.a.html) || esc(p.label) }), choices, answer: p.id, answerText: `${thumb(p.b.html)} ${side(p.b.html) || esc(p.label)}`, why: { steps: [{ text: p.why }] } }; } }));

  // ---------- the game screen ----------
  let G = null;
  function start(subject, p) {
    const seed = Engine.newSeed(), r = Engine.rng(seed), lvlSt = Store.skill(p, subject, 'mem.' + subject);
    const pairs = AGE.band(p) === 'young' ? 6 : (lvlSt.m > 0.7 ? 10 : 8), cols = AGE.band(p) === 'young' ? 3 : 4;
    const ps = pool(subject, AGE.band(p), r).slice(0, pairs);
    const cards = r.shuffle(ps.flatMap((x, i) => [{ pair: i, side: 'a', face: x.a }, { pair: i, side: 'b', face: x.b }]));
    G = { subject, seed, ps, cards, cols, up: [], done: new Set(), flips: 0, tries: ps.map(() => 0), focus: 0, t0: Date.now(), msg: t('mem.help'), lock: false };
    const h = '#/memory/' + subject; if (location.hash === h) setTimeout(() => App.route()); else location.hash = h;
  }
  function render(main, parts) {
    const subject = parts[1] || 'maths', p = Store.current();
    if (!G || G.subject !== subject) { start(subject, p); return; }
    const best = p.extras?.memory?.[subject + G.ps.length];
    main.innerHTML = `<section class="page memory" data-subject="${subject}">
      <a class="backlink" href="#/s/${subject}"><svg class="k-icon"><use href="#i-back"/></svg>${t('subj.' + subject + '.title')}</a>
      <p class="eyebrow">${t('games.title')}</p><div class="lesson-head"><h1>${t('mem.title')}</h1>${Engine.listenBtn('mlisten')}</div>
      <div class="mem-bar"><span class="small"><b>${t('mem.flips')}:</b> <span class="mono" id="flips">${G.flips}</span>${best ? ` · ${t('mem.best')}: <span class="mono">${best}</span>` : ''}</span><span class="small muted" id="left">${t('mem.pairsLeft', { n: G.ps.length - G.done.size })}</span></div>
      <div class="mem-why" id="why" aria-live="polite">${G.msg}</div>
      <div class="mem-grid" style="--cols:${G.cols}" role="grid" aria-label="${t('mem.title')}">${G.cards.map((c, i) => cardHtml(c, i)).join('')}</div>
      <div id="recap"></div></section>`;
    Engine.bindListen(main.querySelector('.mlisten'), () => [{ text: t('mem.blurb.' + subject) + ' ' + t('mem.help'), lang: I18N.lang }]);
    main.querySelectorAll('.mem-card').forEach(b => b.onclick = () => flip(+b.dataset.i, main));
    if (G.done.size === G.ps.length) recap(main);
  }
  function cardHtml(c, i) {
    const up = G.up.includes(i) || G.done.has(c.pair);
    return `<button type="button" class="mem-card ${up ? 'up' : ''} ${G.done.has(c.pair) ? 'done' : ''}" data-i="${i}" tabindex="${i === G.focus ? 0 : -1}" aria-label="${t('mem.card', { n: i + 1 })}: ${up ? c.face.html.replace(/<[^>]+>/g, ' ').trim() || t('mem.found') : t('mem.hidden')}"><span class="face back" aria-hidden="true"></span><span class="face front" aria-hidden="true">${c.face.html}</span></button>`;
  }
  function redraw(main) { const grid = main.querySelector('.mem-grid'); grid.innerHTML = G.cards.map((c, i) => cardHtml(c, i)).join(''); grid.querySelectorAll('.mem-card').forEach(b => b.onclick = () => flip(+b.dataset.i, main)); main.querySelector('#flips').textContent = G.flips; main.querySelector('#left').textContent = t('mem.pairsLeft', { n: G.ps.length - G.done.size }); }
  function flip(i, main) {
    if (G.lock || G.up.includes(i) || G.done.has(G.cards[i].pair)) return;
    G.focus = i; G.up.push(i); G.flips++; redraw(main); main.querySelector(`[data-i="${i}"]`).focus();
    const second = G.up.length === 2, isMatch = second && G.cards[G.up[0]].pair === G.cards[G.up[1]].pair;
    if (!isMatch) Voice.play(G.cards[i].face.say, null, {});
    if (G.up.length < 2) return;
    const [x, y] = G.up.map(k => G.cards[k]);
    G.tries[x.pair]++; if (x.pair !== y.pair) G.tries[y.pair]++;
    const why = main.querySelector('#why');
    if (x.pair === y.pair) {
      G.done.add(x.pair); G.up = []; why.innerHTML = `<b>${t('mem.match')}</b> ${G.ps[x.pair].why}`; Voice.play([{ text: G.ps[x.pair].why.replace(/<[^>]+>/g, ''), lang: I18N.lang }], null, {}); redraw(main);
      if (G.done.size === G.ps.length) finish(main);
    } else { G.lock = true; why.textContent = t('mem.noMatch'); setTimeout(() => { G.up = []; G.lock = false; redraw(main); main.querySelector(`[data-i="${G.focus}"]`)?.focus(); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 700 : 1100); }
  }
  function finish(main) {
    const p = Store.current(), sk = Engine.SK['mem.' + G.subject];
    let right = 0;
    G.ps.forEach((x, i) => { const ok = G.tries[i] <= 2; if (ok) right++; Store.record(p, G.subject, sk, { key: `mem.${G.subject}|${AGE.band(p) === 'young' ? 1 : 2}|${x.code}`, lvl: AGE.band(p) === 'young' ? 1 : 2, seed: x.code }, ok); });
    p.extras = p.extras || {}; p.extras.memory = p.extras.memory || {}; const k = G.subject + G.ps.length, prev = p.extras.memory[k]; G.newBest = !prev || G.flips < prev; if (G.newBest) p.extras.memory[k] = G.flips;
    Store.logSession(p, { subject: G.subject, topic: 'memory', mode: 'memory', n: G.ps.length, right, ms: Date.now() - G.t0 });
    recap(main);
  }
  function recap(main) {
    const el = main.querySelector('#recap');
    el.innerHTML = `<article class="lessoncard ok" tabindex="-1"><p class="eyebrow">${t('mem.title')}</p><h2>${t('mem.recap')}</h2><p>${t('mem.recapBody', { f: G.flips, n: G.ps.length })}${G.newBest ? ' ' + t('mem.newBest') : ''}</p>
      <ul class="recap">${G.ps.map((x, i) => `<li><span class="recap-pair">${x.a.html.replace(/<img /g, '<img class="memthumb" ')} · ${x.b.html.replace(/<img /g, '<img class="memthumb" ')}</span>${G.tries[i] > 2 ? `<span class="k-badge k-badge-warning k-badge-pill">${t('mem.review')}</span>` : '<span></span>'}<small>${x.why}</small></li>`).join('')}</ul>
      <div class="row-actions"><button class="k-btn k-btn-outline pill" id="memAgain">${t('mem.again')}</button><a class="k-btn k-btn-primary" href="#/s/${G.subject}">${t('common.continue')}</a></div></article>`;
    el.querySelector('#memAgain').onclick = () => { const s = G.subject; G = null; start(s, Store.current()); App.route(); };
    el.querySelector('.lessoncard').focus();
  }
  function keys(e) {
    if (!G) return; const n = G.cards.length, c = G.cols, d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: c, ArrowUp: -c }[e.key];
    if (d) { e.preventDefault(); G.focus = (G.focus + d + n) % n; document.querySelectorAll('.mem-card').forEach((b, i) => b.tabIndex = i === G.focus ? 0 : -1); document.querySelector(`.mem-card[data-i="${G.focus}"]`)?.focus(); }
  }
  ROUTES.memory = { render, keys };
  window.MEMORY = { game: subject => ({ title: 'mem.title', blurb: 'mem.blurb.' + subject, icon: 'i-cards', start: p => { G = null; start(subject, p); } }) };
})();
