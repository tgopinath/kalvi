// Practice engine shared by all three subjects: one question at a time, a hint ladder,
// and a lesson card after EVERY answer (patterns from prompt-kit Steps / Feedback Bar and
// AI Elements Chain of Thought, rebuilt in Kolam). Rounds are built from items {skill, lvl, seed}.
(function () {
  window.ROUTES = window.ROUTES || {};   // screen registry for game modules: ROUTES[name] = { render(main, parts), keys?(e) }
  const SK = {};                      // skill registry: id -> {id, subject, topic, gen, min, max, start}
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function rng(seed) { let s = seed >>> 0 || 1; const r = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
    r.int = (a, b) => a + Math.floor(r() * (b - a + 1)); r.pick = a => a[Math.floor(r() * a.length)]; r.shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }; return r; }
  const newSeed = () => (Math.random() * 2 ** 31) | 0;
  // levels per age band: {young:[min,max], older:[min,max]}
  function skill(def) {
    const b = def.bands || { young: [1, 2], older: [2, 4] };
    SK[def.id] = { ...def, min: band => (b[band] || b.older)[0], max: band => (b[band] || b.older)[1], start: band => (b[band] || b.older)[0] };
    return SK[def.id];
  }
  function build(item, p) {
    const sk = SK[item.skill]; const r = rng(item.seed);
    const lvl = Math.max(Math.min(sk.min('young'), sk.min('older')), Math.min(item.lvl || 1, Math.max(sk.max('older'), sk.max('young'))));
    const q = sk.gen(lvl, r, { band: p.band, lang: I18N.lang, seed: item.seed });
    return Object.assign(q, { key: item.skill + '|' + item.lvl + '|' + item.seed, skill: item.skill, lvl: item.lvl, seed: item.seed, subject: sk.subject });
  }
  function itemFor(p, skillId) {
    const sk = SK[skillId], st = Store.skill(p, sk.subject, skillId);
    const lvl = Math.min(sk.max(p.band), Math.max(sk.min(p.band), st.lvl ?? Store.startLvl(p, sk)));
    return { skill: skillId, lvl, seed: newSeed() };
  }
  // pick skills weighted toward low mastery
  function weighted(p, ids, n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const w = ids.map(id => { const st = Store.skill(p, SK[id].subject, id); return 0.35 + (1 - st.m) + (out.length && out[out.length - 1].skill === id ? -0.3 : 0); });
      let x = Math.random() * w.reduce((a, b) => a + b, 0), k = 0; while ((x -= w[k]) > 0 && k < w.length - 1) k++;
      out.push(itemFor(p, ids[k]));
    }
    return out;
  }

  // ---------- UI helpers ----------
  const listenBtn = (cls = '') => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill listen ${cls}" aria-pressed="false"><svg class="k-icon" aria-hidden="true"><use href="#i-sound"/></svg><span>${t('common.listen')}</span></button>`;
  function speakSegs(text, eng) {
    // text in the UI language; eng: optional English words that must be read in English
    const segs = [{ text, lang: I18N.lang }]; if (eng) segs.push({ text: eng, lang: 'en' }); return segs;
  }
  function bindListen(btn, segs) {
    if (!btn) return;
    btn.onclick = () => Voice.play(typeof segs === 'function' ? segs() : segs, btn, { rate: Store.current()?.settings?.rate ?? .9, onMissing: k => k === 'ta' && App.toast(t('lang.noTamilVoice')) });
  }

  // ---------- a round ----------
  let R = null;
  function start({ items, title, mode = 'topic', subject, topic, back = '#/', again }) {
    const p = Store.current(); if (!p || !items.length) return;
    R = { items, i: 0, title, mode, subject, topic, back, results: [], t0: Date.now(), ups: [], again };
    if (location.hash === '#/round') App.route(); else location.hash = '#/round';
  }
  function render(main) {
    if (!R) { location.hash = '#/'; return; }
    const p = Store.current(); const item = R.items[R.i];
    R.q = build(item, p); R.hint = 0; R.answered = false; R.input = ''; R.picked = null; R.tiles = [];
    const q = R.q, sk = SK[q.skill];
    main.innerHTML = `<section class="round" data-subject="${q.subject}">
      <header class="round-top">
        <button class="k-iconbtn quit" type="button" aria-label="${t('pr.quit')}"><svg class="k-icon"><use href="#i-close"/></svg></button>
        <div class="round-meter" role="progressbar" aria-valuemin="0" aria-valuemax="${R.items.length}" aria-valuenow="${R.i}" aria-label="${t('pr.qOf', { a: R.i + 1, b: R.items.length })}">
          ${R.items.map((_, k) => `<i class="${k < R.i ? (R.results[k]?.ok ? 'ok' : 'miss') : k === R.i ? 'now' : ''}"></i>`).join('')}</div>
        <span class="round-count">${t('pr.qOf', { a: R.i + 1, b: R.items.length })}</span>
      </header>
      <div class="qcard">
        <p class="eyebrow">${esc(R.title)} · ${esc(t(sk.name))}</p>
        <div class="qhead"><h2 class="qprompt" ${q.promptLang ? `lang="${q.promptLang}"` : ''}>${q.prompt}</h2>${listenBtn('qlisten')}</div>
        ${q.visual ? `<div class="board ${q.boardClass || ''}">${q.visual}</div>` : ''}
        <div class="answer" id="answer"></div>
        <div class="hints" id="hints" aria-live="polite"></div>
        <div class="qactions">
          ${q.hints?.length ? `<button class="k-btn k-btn-ghost hintbtn" type="button"><svg class="k-icon"><use href="#i-bulb"/></svg><span>${t('common.hint')}</span></button>` : '<span></span>'}
          <button class="k-btn k-btn-primary k-btn-lg checkbtn" type="button" disabled>${t('common.check')}</button>
        </div>
      </div>
      <div id="lesson" class="lessoncard-wrap" aria-live="polite"></div>
    </section>`;
    main.querySelector('.quit').onclick = () => { Voice.stop(); finish(true); };
    bindListen(main.querySelector('.qlisten'), () => q.say || speakSegs(q.promptText || q.prompt.replace(/<[^>]+>/g, ' ')));
    const ans = main.querySelector('#answer'), check = main.querySelector('.checkbtn');
    const ready = ok => { check.disabled = !ok; };
    if (q.kind === 'num') numpad(ans, q, ready);
    else if (q.kind === 'choice' || q.kind === 'tf') choices(ans, q, ready);
    else if (q.kind === 'tiles') tiles(ans, q, ready);
    else if (q.kind === 'custom') q.mount(ans, { ready, submit: () => submit(main) });
    check.onclick = () => submit(main);
    const hb = main.querySelector('.hintbtn');
    if (hb) hb.onclick = () => showHint(main);
    main.querySelector('h2').focus?.();
    if (q.autoSay && q.say) setTimeout(() => { if (R?.q === q && !R.answered) main.querySelector('.qlisten')?.click(); }, 350);
    R.keys = e => {
      if (R.answered) { if (e.key === 'Enter') { e.preventDefault(); main.querySelector('.nextbtn')?.click(); } return; }
      if (q.kind === 'num') {
        if (/^[0-9]$/.test(e.key)) { R.pad?.press(e.key); e.preventDefault(); }
        else if (e.key === 'Backspace') { R.pad?.press('del'); e.preventDefault(); }
      }
      if (e.key === 'Enter' && !check.disabled && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); submit(main); }
    };
  }
  function numpad(el, q, ready) {
    const unitPre = q.unit === '₹' ? '₹' : '', unitPost = q.unit && q.unit !== '₹' ? q.unit : '';
    el.innerHTML = `<div class="numentry"><span class="unit">${unitPre}</span><output class="numdisp" aria-label="${t('common.yourAnswer')}" aria-live="polite">&nbsp;</output><span class="unit">${unitPost}</span></div>
      <div class="numpad" role="group" aria-label="${t('pr.typeOrTap')}">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button type="button" data-k="${n}">${n}</button>`).join('')}
      <button type="button" data-k="del" aria-label="${t('common.erase')}"><svg class="k-icon"><use href="#i-del"/></svg></button><button type="button" data-k="0">0</button><button type="button" data-k="clr" aria-label="${t('common.clear')}" class="clr">${t('common.clear')}</button></div>
      <p class="kbd-note">${t('pr.keyboard')}</p>`;
    const disp = el.querySelector('.numdisp');
    R.pad = { press(k) { if (R.answered) return; if (k === 'del') R.input = R.input.slice(0, -1); else if (k === 'clr') R.input = ''; else if (R.input.length < 5) R.input = (R.input === '0' ? '' : R.input) + k; disp.innerHTML = R.input || '&nbsp;'; ready(R.input.length > 0); } };
    el.querySelectorAll('.numpad button').forEach(b => b.onclick = () => R.pad.press(b.dataset.k));
  }
  function choices(el, q, ready) {
    const pics = q.choices.some(c => c.img || c.vis);
    el.innerHTML = `<div class="choices ${pics ? 'pics' : ''} ${q.choices.length === 2 ? 'two' : ''}" role="radiogroup" aria-label="${t('pr.pick')}">${q.choices.map((c, i) => `<button type="button" role="radio" aria-checked="false" class="choice" data-i="${i}" ${c.lang ? `lang="${c.lang}"` : ''}>${c.vis ? `<span class="cvis">${c.vis}</span>` : ''}${c.img ? `<img src="${c.img}" alt="" loading="lazy">` : ''}${c.html ? `<span class="clabel">${c.html}</span>` : ''}</button>`).join('')}</div>`;
    const bs = [...el.querySelectorAll('.choice')];
    bs.forEach((b, i) => {
      b.onclick = () => { if (R.answered) return; bs.forEach(x => x.setAttribute('aria-checked', 'false')); b.setAttribute('aria-checked', 'true'); R.picked = i; ready(true); if (q.choices[i].say) Voice.play(q.choices[i].say, null, {}); };
      b.onkeydown = e => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (d) { e.preventDefault(); bs[(i + d + bs.length) % bs.length].focus(); } };
    });
  }
  function tiles(el, q, ready) {
    el.innerHTML = `<div class="tilebuild"><div class="tileslot" aria-live="polite"></div><button type="button" class="k-iconbtn undo" aria-label="${t('pr.undo')}"><svg class="k-icon"><use href="#i-undo"/></svg></button></div><div class="tilebank" role="group" aria-label="${q.words ? t('pr.buildWords') : t('pr.build')}">${q.tiles.map((x, i) => `<button type="button" class="tile ${q.words ? 'word' : ''}" data-i="${i}" lang="en">${esc(x)}</button>`).join('')}</div>`;
    const slot = el.querySelector('.tileslot'), bank = [...el.querySelectorAll('.tile')];
    const draw = () => { slot.innerHTML = R.tiles.map(i => `<span class="tile placed ${q.words ? 'word' : ''}" lang="en">${esc(q.tiles[i])}</span>`).join(q.words ? ' ' : '') || `<span class="slot-ph">${q.words ? t('pr.buildWords') : t('pr.build')}</span>`; bank.forEach((b, i) => b.disabled = R.tiles.includes(i) || R.answered); ready(R.tiles.length > 0); };
    bank.forEach((b, i) => b.onclick = () => { if (R.answered) return; R.tiles.push(i); draw(); if (!q.words) Voice.play([{ text: q.tiles[i], lang: 'en' }], null, {}); });
    el.querySelector('.undo').onclick = () => { R.tiles.pop(); draw(); };
    draw();
  }
  function showHint(main) {
    const q = R.q; if (R.hint >= q.hints.length || R.answered) return;
    R.hint++;
    const box = main.querySelector('#hints');
    box.innerHTML = `<ol class="steps hintsteps">${q.hints.slice(0, R.hint).map((h, i) => `<li class="step ${i === R.hint - 1 ? 'fresh' : ''}"><span class="step-n">${i + 1}</span><div class="step-body"><p class="step-label">${i === q.hints.length - 1 && q.hintRevealsAnswer ? t('pz.ladder.answer') : i === 0 ? t('pz.ladder.nudge') : t('pz.ladder.step')}</p><p>${typeof h === 'string' ? h : h.text}</p>${h.vis ? `<div class="board small">${h.vis}</div>` : ''}</div></li>`).join('')}</ol>`;
    const hb = main.querySelector('.hintbtn');
    if (R.hint >= q.hints.length) hb.disabled = true; else hb.querySelector('span').textContent = t('common.moreHint');
    if (q.hintRevealsAnswer && R.hint === q.hints.length) R.revealed = true;
  }
  function given(q) {
    if (q.kind === 'num') return Number(R.input);
    if (q.kind === 'choice' || q.kind === 'tf') return q.choices[R.picked]?.v;
    if (q.kind === 'tiles') return R.tiles.map(i => q.tiles[i]).join(q.words ? ' ' : '');
    return null;
  }
  function submit(main) {
    if (R.answered) return; const q = R.q, p = Store.current(), sk = SK[q.skill];
    let ok, giv;
    if (q.kind === 'custom') { const res = q.check(); ok = res.correct; giv = res.given; }
    else { giv = given(q); ok = q.kind === 'tiles' ? String(giv).toLowerCase() === String(q.answer).toLowerCase() : giv === q.answer; }
    if (R.revealed) ok = false;
    if (q.whyFor) q.why = q.whyFor(typeof giv === 'string' ? giv : '');
    R.answered = true; R.revealed = false;
    const before = Store.skill(p, sk.subject, sk.id).lvl;
    const st = Store.record(p, sk.subject, sk, q, ok);
    if (st.lvl > (before ?? 0) && before != null) R.ups.push({ skill: t(sk.name), lvl: st.lvl });
    R.results[R.i] = { ok, key: q.key };
    main.querySelectorAll('.choice').forEach((b, i) => { b.disabled = true; if (q.choices[i].v === q.answer) b.classList.add('is-right'); else if (i === R.picked) b.classList.add('is-wrong'); });
    main.querySelectorAll('.numpad button,.tile,.undo').forEach(b => b.disabled = true);
    main.querySelectorAll('.numpad,.kbd-note,.tilebank').forEach(x => x.hidden = true);
    main.querySelector('.qactions').hidden = true;
    main.querySelector('.qcard').classList.add(ok ? 'was-right' : 'was-wrong');
    lessonCard(main.querySelector('#lesson'), q, ok, giv);
  }
  // ---------- the lesson card after every answer ----------
  function lessonCard(el, q, ok, giv) {
    const ansTxt = q.answerText ?? (q.kind === 'choice' || q.kind === 'tf' ? (q.choices.find(c => c.v === q.answer)?.html ?? q.answer) : (q.unit === '₹' ? '₹' + q.answer : q.answer + (q.unit ? ' ' + q.unit : '')));
    const steps = q.why?.steps || [];
    el.innerHTML = `<article class="lessoncard ${ok ? 'ok' : 'miss'}" tabindex="-1">
      <header class="lc-head"><span class="lc-mark" aria-hidden="true"><svg class="k-icon"><use href="#${ok ? 'i-check' : 'i-dot'}"/></svg></span>
        <div><p class="lc-status">${ok ? t('pr.right') : t('pr.wrong')}</p><p class="lc-answer">${t('pr.answerIs', { a: `<strong>${ansTxt}</strong>` }).replace(/\.(<\/strong>)\.$/, '.$1').replace(/([.?])(<\/span><\/strong>)\.$/, '$1$2')}${!ok && giv != null && giv !== '' && q.kind === 'num' ? ` <span class="muted">${t('pr.youSaid', { a: q.unit === '₹' ? '₹' + giv : giv })}</span>` : ''}</p></div>
        ${listenBtn('lclisten')}</header>
      ${q.why?.photo ? `<figure class="lc-photo"><img src="${q.why.photo.src}" alt="${esc(q.why.photo.alt || '')}" loading="lazy" onerror="this.closest('figure').classList.add('noimg')"><figcaption>${t('common.credit')}: <a href="${q.why.photo.href}" target="_blank" rel="noopener">${esc(q.why.photo.credit)}</a></figcaption></figure>` : ''}
      <p class="eyebrow">${t('pr.whyTitle')}</p>
      <ol class="steps whysteps">${steps.map((s, i) => `<li class="step" ${i > 0 ? 'hidden' : ''}><span class="step-n">${i + 1}</span><div class="step-body"><p ${s.lang ? `lang="${s.lang}"` : ''}>${s.text}</p>${s.vis ? `<div class="board small">${s.vis}</div>` : ''}</div></li>`).join('')}</ol>
      ${steps.length > 1 ? `<button type="button" class="k-btn k-btn-ghost k-btn-sm morestep">${t('common.showNext')}</button>` : ''}
      ${q.why?.rule ? `<p class="lc-rule">${q.why.rule}</p>` : ''}
      <div class="lc-foot">
        <div class="feedback" role="group" aria-label="${t('pr.clear')}"><span>${t('pr.clear')}</span><button type="button" class="k-btn k-btn-outline k-btn-sm pill fb-yes">${t('pr.clearYes')}</button><button type="button" class="k-btn k-btn-outline k-btn-sm pill fb-no">${t('pr.clearNo')}</button></div>
        <button type="button" class="k-btn k-btn-primary k-btn-lg nextbtn">${R.i + 1 < R.items.length ? t('common.next') : t('common.done')}</button>
      </div></article>`;
    const card = el.querySelector('.lessoncard');
    const hidden = () => [...card.querySelectorAll('.whysteps .step[hidden]')];
    const more = card.querySelector('.morestep');
    if (more) more.onclick = () => { const h = hidden(); if (h[0]) { h[0].hidden = false; h[0].classList.add('fresh'); } if (hidden().length === 0) more.remove(); };
    // reveal the remaining steps one by one, calmly
    let k = 0; const timer = setInterval(() => { const h = hidden(); if (!h.length || !document.body.contains(card)) { clearInterval(timer); more?.remove(); return; } h[0].hidden = false; h[0].classList.add('fresh'); if (!hidden().length) more?.remove(); if (++k > 6) clearInterval(timer); }, 1400);
    bindListen(card.querySelector('.lclisten'), () => { const segs = [{ text: (ok ? t('pr.right') : t('pr.wrong')) + '. ' + t('pr.answerIs', { a: String(ansTxt).replace(/<[^>]+>/g, ' ') }), lang: I18N.lang }]; steps.forEach(s => segs.push({ text: s.text.replace(/<[^>]+>/g, ' '), lang: s.lang || I18N.lang })); return segs; });
    card.querySelector('.fb-yes').onclick = e => { e.target.closest('.feedback').innerHTML = `<span>${t('pr.clearYes')}</span>`; };
    card.querySelector('.fb-no').onclick = e => { Store.flagReview(Store.current(), q.subject, q); e.target.closest('.feedback').innerHTML = `<span>${t('pr.clearNoted')}</span>`; };
    card.querySelector('.nextbtn').onclick = () => { clearInterval(timer); Voice.stop(); R.i++; if (R.i >= R.items.length) finish(); else App.renderRound(); };
    card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    card.focus({ preventScroll: true });
  }
  function finish(quit) {
    const p = Store.current(); if (!R) return;
    const n = R.results.filter(Boolean).length, right = R.results.filter(r => r?.ok).length;
    if (n) Store.logSession(p, { subject: R.subject || 'mixed', topic: R.topic || R.mode, mode: R.mode, n, right, ms: Date.now() - R.t0 });
    if (R.mode === 'warmup' && !quit) { p.warmup = Store.today(); Store.save(); }
    R.summary = { n, right, ups: R.ups, miss: R.results.filter(r => r && !r.ok).length, quit };
    if (quit && !n) { const back = R.back; R = null; location.hash = back; return; }
    location.hash = '#/summary';
  }
  function summary(main) {
    if (!R?.summary) { location.hash = '#/'; return; }
    const s = R.summary;
    main.innerHTML = `<section class="summary k-card"><p class="eyebrow">${esc(R.title)}</p><h1>${t('pr.summary')}</h1>
      <div class="sum-meter">${R.results.map(r => `<i class="${r?.ok ? 'ok' : r ? 'miss' : ''}"></i>`).join('')}</div>
      <p class="sum-score">${t('pr.score', { a: s.right, b: s.n })}</p>
      ${s.miss ? `<p class="muted">${t('pr.toReview', { n: s.miss })}</p>` : ''}
      ${s.ups.map(u => `<p class="sum-up"><svg class="k-icon"><use href="#i-up"/></svg>${t('pr.levelUp', { n: u.lvl, skill: esc(u.skill) })}</p>`).join('')}
      <div class="row-actions"><button class="k-btn k-btn-outline pill again">${t('pr.again')}</button><a class="k-btn k-btn-primary" href="${R.back}">${t('common.continue')}</a></div></section>`;
    const again = R.again;
    main.querySelector('.again').onclick = () => again ? again() : (location.hash = R.back);
  }
  window.Engine = { SK, skill, rng, newSeed, itemFor, weighted, build, start, render, summary, listenBtn, bindListen, speakSegs, esc, get round() { return R; }, set again(f) { if (R) R.again = f; }, keys: e => R?.keys?.(e) };
})();
