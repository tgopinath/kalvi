// Kalvi app shell: routing, header (language + child switcher), and screens.
(function () {
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = Engine.esc, main = $('#main');
  const SUBJ = {
    maths: { icon: 'i-maths', topics: MATHS.TOPICS, games: () => [window.PUZZLES?.game, window.MEMORY?.game('maths'), window.DRAW?.game('maths'), window.MUSIC?.game('maths')].filter(Boolean) },
    english: { icon: 'i-english', topics: ENGLISH.TOPICS, games: () => [window.STORIES?.game, window.BEE?.game, window.WORDPZ?.game, window.MEMORY?.game('english'), window.DRAW?.game('english'), window.MUSIC?.game('english')].filter(Boolean) },
    science: { icon: 'i-science', topics: SCIENCE.TOPICS, games: () => [SCIENCE.quizGame, window.LAB?.game, window.GEO?.game, window.MEMORY?.game('science'), window.DRAW?.game('science'), window.MUSIC?.game('science')].filter(Boolean) },
    world: { icon: 'i-globe', topics: [...(window.GK?.TOPICS || []), { id: 'geo', subject: 'world', title: 'w.geo.title', blurb: 'w.geo.blurb', icon: 'i-map', skills: window.GEO?.skills || [], page: el => { el.innerHTML = `<article class="k-card practice-card"><div><p class="eyebrow">${t('games.title')}</p><h2>${t('w.geo.title')}</h2><p class="muted">${t('w.geo.body')}</p></div><a class="k-btn k-btn-primary k-btn-lg" href="#/geo">${t('common.open')}</a></article>`; } }],
      games: () => [window.GK?.game, window.GK?.dailyGame, window.GEO?.game].filter(Boolean) },
  };
  const allSkills = s => SUBJ[s].topics.flatMap(tp => tp.skills).filter(id => Engine.SK[id]);
  const forBand = (tp, p) => !tp.bands || tp.bands.includes(p.band);

  // ---------- language ----------
  function langNow() { const p = Store.current(); return p?.lang || (() => { try { return localStorage.getItem('kalvi.lang'); } catch { return null; } })() || 'en'; }
  function applyLang() {
    I18N.lang = langNow(); document.documentElement.lang = I18N.lang; document.body.classList.toggle('lang-ta', I18N.lang === 'ta');
    $$('#langToggle button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === I18N.lang));
    $('#langToggle').setAttribute('aria-label', t('lang.switch'));
    $('.skip').textContent = I18N.lang === 'ta' ? 'உள்ளடக்கத்திற்குச் செல்' : 'Skip to content';
    document.title = `${t('app.name')} · ${t('nav.maths')}, ${t('nav.english')}, ${t('nav.science')}`;
  }
  $$('#langToggle button').forEach(b => b.onclick = () => {
    const l = b.dataset.l; const p = Store.current();
    if (p) Store.update(p.id, { lang: l }); try { localStorage.setItem('kalvi.lang', l); } catch {}
    Voice.stop(); applyLang(); route();
  });

  // ---------- avatars: rendered solids ----------
  function avatar(kind, color, size = 40) {
    const S = R3.Scene({ yaw: -32, pitch: 24, scale: 20 }); S.group(0).shadow(0, 0, 0, 1.3, 1.3); S.group(1);
    if (kind === 'cube') S.box(-0.9, -0.9, 0, 1.8, 1.8, 1.8, color);
    if (kind === 'sphere') S.sphere(0, 0, 1.05, 1.05, color, { matte: true });
    if (kind === 'cone') S.cone(0, 0, 0, 1.05, 2.2, color, { n: 40 });
    if (kind === 'cylinder') S.cylinder(0, 0, 0, 0.95, 1.9, color, { n: 40 });
    if (kind === 'pyramid') S.pyramid([[-1, -1], [1, -1], [1, 1], [-1, 1]], 0, 1.9, color);
    if (kind === 'prism') { const a = [[-1.2, -0.9, 0], [-1.2, 0.9, 0], [-1.2, 0, 1.5]], b = [[1.2, -0.9, 0], [1.2, 0.9, 0], [1.2, 0, 1.5]]; S.face([a[0], a[2], a[1]], color).face([b[0], b[1], b[2]], color).face([a[0], b[0], b[2], a[2]], color).face([a[1], a[2], b[2], b[1]], color).face([a[0], a[1], b[1], b[0]], color); }
    if (kind === 'ring') { const out = [], inn = []; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; out.push([Math.cos(a) * 1.15, Math.sin(a) * 1.15]); } S.cylinder(0, 0, 0, 1.15, 0.5, color, { n: 48 }); S.cylinder(0, 0, 0.5, 0.55, 0.01, R3.shade(color, -0.55), { n: 40, flat: true }); }
    if (kind === 'star') { const pts = []; for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.5 : 1.25; pts.push([Math.cos(a) * r, Math.sin(a) * r]); } S.prism(pts, 0, 0.5, color); }
    return `<span class="avatar" style="--s:${size}px">${S.svg('')}</span>`;
  }

  // ---------- header + nav ----------
  function header() {
    const p = Store.current(), who = $('#whoBtn');
    who.hidden = !p;
    if (p) { who.innerHTML = `${avatar(p.avatar, p.color, 32)}<span class="who-name">${esc(p.name)}</span>`; who.setAttribute('aria-label', `${t('prof.switchTo')}: ${p.name}`); }
    const items = [['#/', 'i-home', 'nav.today'], ['#/s/maths', 'i-maths', 'nav.maths'], ['#/s/english', 'i-english', 'nav.english'], ['#/s/science', 'i-science', 'nav.science'], ['#/s/world', 'i-globe', 'nav.world'], ['#/progress', 'i-chart', 'nav.progress'], ['#/parent', 'i-lock', 'nav.grownups']];
    const h = location.hash || '#/';
    $('#nav').setAttribute('aria-label', t('nav.main'));
    $('#nav').innerHTML = p ? items.map(([href, ic, k]) => { const on = href === '#/' ? (h === '#/' || h === '#') : h.startsWith(href) || (href.startsWith('#/s/') && h.startsWith('#/t/' + href.slice(4) + '/')); return `<a href="${href}" class="${href === '#/parent' ? 'nav-parent' : ''}" ${on ? 'aria-current="page"' : ''}><svg class="k-icon"><use href="#${ic}"/></svg><span>${t(k)}</span></a>`; }).join('') : '';
    document.body.classList.toggle('no-profile', !p);
  }
  $('#whoBtn').onclick = () => {
    const db = Store.db;
    dialog(`<h2 class="k-dialog-title">${t('prof.whoIs')}</h2><ul class="who-list">${db.profiles.map(p => `<li><button type="button" class="who-item" data-id="${p.id}" ${p.id === db.current ? 'aria-current="true"' : ''}>${avatar(p.avatar, p.color, 40)}<span><b>${esc(p.name)}</b><small>${t('band.' + p.band)}</small></span>${p.id === db.current ? `<span class="k-badge k-badge-pill">${t('prof.current')}</span>` : ''}</button></li>`).join('')}</ul><p class="muted small">${t('prof.manage')}</p><div class="k-dialog-actions"><a class="k-btn k-btn-ghost" href="#/parent" data-close>${t('nav.grownups')}</a><button class="k-btn k-btn-outline" data-close>${t('common.close')}</button></div>`,
      d => $$('.who-item', d).forEach(b => b.onclick = () => { Store.select(b.dataset.id); closeDialog(); Voice.stop(); applyLang(); location.hash = '#/'; route(); }));
  };
  function dialog(html, bind) {
    const wrap = $('#dialogs'); const prev = document.activeElement;
    wrap.innerHTML = `<div class="scrim" data-close></div><div class="k-dialog" role="dialog" aria-modal="true">${html}</div>`;
    const d = $('.k-dialog', wrap);
    $$('[data-close]', wrap).forEach(x => x.addEventListener('click', () => closeDialog()));
    wrap.onkeydown = e => { if (e.key === 'Escape') closeDialog(); };
    bind?.(d); (d.querySelector('button,a,input') || d).focus();
    closeDialog.prev = prev;
  }
  function closeDialog() { $('#dialogs').innerHTML = ''; closeDialog.prev?.focus?.(); }
  function toast(msg) { const el = $('#toast'); el.innerHTML = `<span class="k-toast-text">${msg}</span>`; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 4200); }

  // ---------- helpers ----------
  const pct = v => Math.round(v * 100);
  function subjectMastery(p, s) {
    const ids = SUBJ[s].topics.filter(tp => forBand(tp, p)).flatMap(tp => tp.skills).filter(id => Engine.SK[id]);
    const m = ids.reduce((a, id) => a + (Store.skill(p, s, id).m || 0), 0) / Math.max(1, ids.length);
    const mastered = ids.filter(id => Store.status(Store.skill(p, s, id)) === 'mastered').length;
    return { m, mastered, total: ids.length };
  }
  function topicMastery(p, tp) { const ids = tp.skills.filter(id => Engine.SK[id]); return ids.reduce((a, id) => a + (Store.skill(p, tp.subject, id).m || 0), 0) / Math.max(1, ids.length); }
  function nextTopic(p, s) { const tps = SUBJ[s].topics.filter(tp => forBand(tp, p)); return tps.find(tp => topicMastery(p, tp) < 0.85) || tps[0] || SUBJ[s].topics[0]; }
  const bar = (v, label) => `<div class="mbar" role="img" aria-label="${label ?? t('subj.mastery')}: ${pct(v)}%"><i style="width:${Math.max(2, pct(v))}%"></i></div>`;
  const dueAll = p => Store.SUBJECTS.flatMap(s => Store.due(p, s).filter(r => Engine.SK[r.skill]));

  // ---------- rounds ----------
  function practiceTopic(tp) {
    const p = Store.current(); const go = () => Engine.start({ items: mix(p, tp.skills.filter(id => Engine.SK[id] && id !== 'e.bee'), tp.subject, 8), title: t(tp.title), subject: tp.subject, topic: tp.id, back: `#/t/${tp.subject}/${tp.id}`, again: go }); go();
  }
  // 8 questions: due reviews from this topic first, then adaptive picks, with mixed review from other practised topics
  function mix(p, skills, subject, n) {
    const due = Store.due(p, subject).filter(r => skills.includes(r.skill)).slice(0, 2).map(r => ({ skill: r.skill, lvl: r.lvl, seed: r.seed }));
    const practised = allSkills(subject).filter(id => !skills.includes(id) && Store.skill(p, subject, id).n > 0);
    const out = [...due, ...Engine.weighted(p, skills, n - due.length - (practised.length ? 1 : 0))];
    if (practised.length) out.splice(Math.min(out.length, 5), 0, Engine.itemFor(p, practised[Math.floor(Math.random() * practised.length)]));
    return out.slice(0, n);
  }
  function warmup() {
    const p = Store.current(); const items = [];
    for (const s of Store.SUBJECTS) {
      const due = Store.due(p, s).filter(r => Engine.SK[r.skill]).slice(0, 1).map(r => ({ skill: r.skill, lvl: r.lvl, seed: r.seed }));
      if (s === 'world' && window.GK?.daily) { items.push(...due, ...GK.daily(p, 2 - due.length)); continue; }
      const pool = SUBJ[s].topics.filter(tp => forBand(tp, p)).flatMap(tp => tp.skills).filter(id => Engine.SK[id] && id !== 'e.bee' && Engine.SK[id].warm !== false);
      const tried = pool.filter(id => Store.skill(p, s, id).n > 0), base = tried.length >= 2 ? tried : pool.slice(0, 4);
      items.push(...due, ...Engine.weighted(p, base, 2 - due.length));
    }
    const go = () => Engine.start({ items: items.sort(() => Math.random() - .5), title: t('pr.warmup'), mode: 'warmup', back: '#/' }); go();
  }
  function review() {
    const p = Store.current(); let items = dueAll(p).slice(0, 8).map(r => ({ skill: r.skill, lvl: r.lvl, seed: r.seed }));
    if (!items.length) { toast(t('pr.noneDue')); return warmup(); }
    Engine.start({ items, title: t('pr.review'), mode: 'review', back: '#/' });
  }

  // ---------- screens ----------
  function greet(p) { const h = new Date().getHours(); return t(h < 12 ? 'greet.morning' : h < 17 ? 'greet.afternoon' : 'greet.evening', { name: esc(p.name) }); }
  function home() {
    const p = Store.current(); const streak = Store.streak(p), dueN = dueAll(p).length, todayN = p.days[Store.today()] || 0, warmDone = p.warmup === Store.today();
    main.innerHTML = `<section class="page home">
      <p class="eyebrow">${t('home.eyebrow')} · ${new Date().toLocaleDateString(I18N.lang === 'ta' ? 'ta-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      <h1>${greet(p)}</h1>
      <div class="stats"><div class="k-stat"><span class="k-stat-label">${t('home.streak')}</span><span class="k-stat-value">${streak}</span></div><div class="k-stat"><span class="k-stat-label">${t('home.answered')}</span><span class="k-stat-value">${todayN}</span></div><div class="k-stat"><span class="k-stat-label">${t('home.dueLabel')}</span><span class="k-stat-value">${dueN}</span></div></div>
      <div class="cards2">
        <article class="k-card feature"><div class="feat-art">${warmArt()}</div><div><p class="eyebrow">${t('home.warmTitle')}</p><h2>${warmDone ? t('home.warmDone') : t('home.warmBody')}</h2><button class="k-btn ${warmDone ? 'k-btn-outline pill' : 'k-btn-primary'} k-btn-lg" id="warmBtn">${warmDone ? t('home.warmAgain') : t('common.start')}</button></div></article>
        <article class="k-card"><p class="eyebrow"><svg class="k-icon sm"><use href="#i-review"/></svg>${t('home.reviewTitle')}</p><p>${dueN ? t('home.reviewBody', { n: dueN }) : t('home.reviewNone')}</p>${dueN ? `<button class="k-btn k-btn-outline pill" id="revBtn">${t('common.start')}</button>` : ''}</article>
      </div>
      <h2 class="section">${t('home.upNext')}</h2>
      <div class="subjects">${Store.SUBJECTS.filter(s => SUBJ[s].topics.length).map(s => { const tp = nextTopic(p, s), sm = subjectMastery(p, s); return `<a class="subjcard" data-subject="${s}" href="#/t/${s}/${tp.id}"><span class="subj-ic"><svg class="k-icon"><use href="#${SUBJ[s].icon}"/></svg></span><span class="eyebrow">${t('subj.' + s + '.title')}</span><b>${t(tp.title)}</b>${bar(sm.m)}<span class="small muted">${t('prog.skillsMastered', { a: sm.mastered, b: sm.total })}</span></a>`; }).join('')}</div>
      <h2 class="section">${t('games.title')}</h2>
      <div class="games">${gameCards(p, ['maths', 'english', 'science', 'world'], 1)}</div>
    </section>`;
    $('#warmBtn').onclick = warmup; $('#revBtn') && ($('#revBtn').onclick = review);
    bindGames();
  }
  function warmArt() { return VIS.towers([2, 4, 3], ''); }
  function gameCards(p, subjects, perSubject = 99) {
    const gs = subjects.flatMap(s => SUBJ[s].games().slice(0, perSubject).map(g => ({ ...g, s })));
    return gs.map((g, i) => `<button type="button" class="gamecard" data-subject="${g.s}" data-g="${i}"><span class="subj-ic"><svg class="k-icon"><use href="#${g.icon}"/></svg></span><span><span class="eyebrow">${t('subj.' + g.s + '.title')}</span><b>${t(g.title)}</b><span class="small muted">${t(g.blurb)}</span></span></button>`).join('');
    // bound in bindGames
  }
  function bindGames() {
    const p = Store.current();
    $$('.gamecard').forEach(b => { const s = b.dataset.subject; const gs = SUBJ[s].games(); const sub = $$(`.gamecard[data-subject="${s}"]`).indexOf(b); b.onclick = () => gs[sub]?.start(p); });
  }
  function subject(s) {
    const p = Store.current(), S = SUBJ[s]; if (!S) return notFound();
    const tps = S.topics, sm = subjectMastery(p, s), next = nextTopic(p, s);
    main.innerHTML = `<section class="page subject" data-subject="${s}">
      <p class="eyebrow">${t('subj.path')}</p><h1>${t('subj.' + s + '.title')}</h1><p class="lede">${t('subj.' + s + '.blurb')}</p>
      <div class="subj-sum">${bar(sm.m)}<span class="small muted">${t('prog.skillsMastered', { a: sm.mastered, b: sm.total })}</span></div>
      <ol class="path">${tps.map((tp, i) => { const m = topicMastery(p, tp), st = m >= 0.85 ? 'mastered' : m > 0.01 ? 'practising' : p.subjects[s].lessons[tp.id] ? 'learning' : 'new'; const isNext = tp === next; return `<li class="path-item ${st} ${isNext ? 'next' : ''} ${forBand(tp, p) ? '' : 'later'}"><span class="path-n" aria-hidden="true">${st === 'mastered' ? '<svg class="k-icon"><use href="#i-check"/></svg>' : i + 1}</span><a href="#/t/${s}/${tp.id}"><span class="path-ic"><svg class="k-icon"><use href="#${tp.icon}"/></svg></span><span class="path-txt"><b>${t(tp.title)}</b><span class="small muted">${t(tp.blurb)}</span>${bar(m)}</span><span class="path-st">${isNext ? `<span class="k-badge k-badge-primary k-badge-pill">${t('status.upNext')}</span>` : `<span class="small muted">${t('status.' + st)}</span>`}</span></a></li>`; }).join('')}</ol>
      <h2 class="section">${t('games.title')}</h2><div class="games">${gameCards(p, [s])}</div>
    </section>`;
    bindGames();
  }
  function topic(s, id) {
    const p = Store.current(), tp = SUBJ[s]?.topics.find(x => x.id === id); if (!tp) return notFound();
    main.innerHTML = `<section class="page topic" data-subject="${s}">
      <a class="backlink" href="#/s/${s}"><svg class="k-icon"><use href="#i-back"/></svg>${t('subj.' + s + '.title')}</a>
      <p class="eyebrow">${t('topic.lesson')}</p><h1>${t(tp.title)}</h1><p class="lede">${t(tp.blurb)}</p>
      <div id="lessonArea"></div>
      <article class="k-card practice-card"><div><p class="eyebrow">${t('pr.title')}</p><h2>${t('topic.startPractice')}</h2><p class="muted">${t('topic.practiceBody')}</p></div><button class="k-btn k-btn-primary k-btn-lg" id="prBtn">${t('common.practice')}</button></article>
      <h2 class="section">${t('topic.skills')}</h2>
      <ul class="skills">${tp.skills.filter(id => Engine.SK[id]).map(id => { const sk = Engine.SK[id], st = Store.skill(p, s, id), lv = st.lvl ?? sk.start(p.band); return `<li><span class="sk-name">${t(sk.name)}</span><span class="small muted">${t('topic.level', { n: lv })} · ${t('status.' + Store.status(st))}</span>${bar(st.m)}</li>`; }).join('')}</ul>
    </section>`;
    if (tp.page) tp.page($('#lessonArea'), tp); else lessonSteps($('#lessonArea'), tp);
    $('#prBtn').onclick = () => practiceTopic(tp);
  }
  // Steps pattern: numbered step rail, one step open at a time, Listen on each
  function lessonSteps(el, tp) {
    const steps = tp.lesson(); let i = 0;
    const draw = () => {
      const s = steps[i];
      el.innerHTML = `<div class="lesson">
        <ol class="lesson-rail" role="tablist">${steps.map((x, k) => `<li><button role="tab" type="button" aria-selected="${k === i}" data-k="${k}" class="${k < i ? 'seen' : ''}"><span>${k + 1}</span><em>${esc(x.title)}</em></button></li>`).join('')}</ol>
        <div class="lesson-panel" role="tabpanel"><div class="lesson-head"><div><p class="eyebrow">${t('common.stepN', { n: i + 1 })} · ${t('common.of', { a: i + 1, b: steps.length })}</p><h2>${esc(s.title)}</h2></div>${Engine.listenBtn('llisten')}</div>
          <p class="lesson-body">${s.body}</p><div class="widget"></div>
          <div class="lesson-nav"><button class="k-btn k-btn-ghost" data-go="-1" ${i === 0 ? 'disabled' : ''}><svg class="k-icon"><use href="#i-back"/></svg>${t('common.back')}</button>${i < steps.length - 1 ? `<button class="k-btn k-btn-outline pill" data-go="1">${t('common.next')}<svg class="k-icon"><use href="#i-next"/></svg></button>` : `<button class="k-btn k-btn-primary" data-done>${t('topic.lessonDone')}</button>`}</div></div></div>`;
      s.widget?.($('.widget', el));
      Engine.bindListen($('.llisten', el), () => [{ text: s.title + '. ' + s.body.replace(/<[^>]+>/g, ' '), lang: I18N.lang }]);
      $$('[data-k]', el).forEach(b => b.onclick = () => { i = +b.dataset.k; Voice.stop(); draw(); });
      $$('[data-go]', el).forEach(b => b.onclick = () => { i += +b.dataset.go; Voice.stop(); draw(); $('.lesson', el).scrollIntoView({ block: 'nearest' }); });
      $('[data-done]', el) && ($('[data-done]', el).onclick = () => { Store.lessonDone(Store.current(), tp.subject, tp.id); practiceTopic(tp); });
    };
    draw();
  }
  function progress() {
    const p = Store.current(); const days = [...Array(14)].map((_, i) => Store.addDays(Store.today(), i - 13));
    main.innerHTML = `<section class="page progress"><p class="eyebrow">${esc(p.name)} · ${t('band.' + p.band)}</p><h1>${t('prog.title')}</h1>
      <div class="stats"><div class="k-stat"><span class="k-stat-label">${t('home.streak')}</span><span class="k-stat-value">${Store.streak(p)}</span></div><div class="k-stat"><span class="k-stat-label">${t('home.dueLabel')}</span><span class="k-stat-value">${dueAll(p).length}</span></div></div>
      <h2 class="section">${t('prog.last14')}</h2><div class="cal" role="list">${days.map(d => `<span role="listitem" class="${p.days[d] ? 'on' : ''}" title="${d}: ${p.days[d] || 0}" aria-label="${d}: ${p.days[d] || 0}"><i style="--v:${Math.min(1, (p.days[d] || 0) / 20)}"></i><small>${+d.slice(8)}</small></span>`).join('')}</div>
      <h2 class="section">${t('prog.bySubject')}</h2>
      ${Store.SUBJECTS.map(s => { const sm = subjectMastery(p, s); return `<article class="k-card subjprog" data-subject="${s}"><header><span class="subj-ic"><svg class="k-icon"><use href="#${SUBJ[s].icon}"/></svg></span><div><h3>${t('subj.' + s + '.title')}</h3><span class="small muted">${t('prog.skillsMastered', { a: sm.mastered, b: sm.total })}</span></div><b class="pctbig">${pct(sm.m)}%</b></header>
        <ul class="topicbars">${SUBJ[s].topics.filter(tp => forBand(tp, p)).map(tp => `<li><a href="#/t/${s}/${tp.id}">${t(tp.title)}</a>${bar(topicMastery(p, tp))}</li>`).join('')}</ul></article>`; }).join('')}
      ${!p.sessions.length ? `<p class="muted">${t('prog.noActivity')}</p>` : ''}<p class="small"><a href="#/credits">${t('credits.title')}</a> · <a href="#/parent">${t('nav.grownups')}</a></p>
    </section>`;
  }

  // ---------- grown-ups ----------
  let parentOpen = 0;
  function parent() {
    if (Date.now() - parentOpen > 10 * 60 * 1000) return gate();
    const db = Store.db;
    main.innerHTML = `<section class="page parent"><p class="eyebrow">${t('parent.gate')}</p><h1>${t('parent.title')}</h1><p class="lede">${t('parent.privacy')}</p>
      <h2 class="section">${t('parent.children')}</h2>
      <div class="kids">${db.profiles.map(p => kidCard(p)).join('')}</div>
      <a class="k-btn k-btn-outline pill" href="#/profile/new"><svg class="k-icon"><use href="#i-plus"/></svg>${t('parent.add')}</a>
      <article class="k-card backup" id="backupCard"></article>
      <article class="k-card"><p class="eyebrow">${t('parent.voice')}</p><div class="seg" role="group" aria-label="${t('parent.voice')}"><button type="button" data-rate=".72">${t('parent.slow')}</button><button type="button" data-rate=".9">${t('parent.normal')}</button></div></article>
    </section>`;
    $$('.kid-del').forEach(b => b.onclick = () => { const p = db.profiles.find(x => x.id === b.dataset.id);
      dialog(`<h2 class="k-dialog-title">${t('parent.delTitle', { name: esc(p.name) })}</h2><p class="k-dialog-body">${t('parent.delBody', { name: esc(p.name) })}</p><div class="k-dialog-actions"><button class="k-btn k-btn-outline" data-close>${t('common.cancel')}</button><button class="k-btn k-btn-danger" id="delYes">${t('parent.delYes')}</button></div>`,
        d => $('#delYes', d).onclick = () => { Store.remove(p.id); closeDialog(); applyLang(); if (!Store.db.profiles.length) location.hash = '#/welcome'; else route(); }); });
    const cur = Store.current();
    $$('[data-rate]').forEach(b => { b.setAttribute('aria-pressed', String(Math.abs((cur?.settings?.rate ?? .9) - +b.dataset.rate) < .01)); b.onclick = () => { Store.db.profiles.forEach(p => p.settings = { ...p.settings, rate: +b.dataset.rate }); Store.save(); parent(); }; });
    window.Backup?.render($('#backupCard'));
  }
  function kidCard(p) {
    const rows = Store.SUBJECTS.map(s => {
      const sk = Object.values(p.subjects[s].skills), n = sk.reduce((a, x) => a + x.n, 0), ok = sk.reduce((a, x) => a + x.ok, 0);
      const ms = p.sessions.filter(x => x.subject === s || (x.subject === 'mixed' && false)).reduce((a, x) => a + (x.ms || 0), 0), sm = subjectMastery(p, s);
      return `<tr><th scope="row">${t('subj.' + s + '.title')}</th><td>${bar(sm.m)}<span class="small">${pct(sm.m)}%</span></td><td>${n ? pct(ok / n) + '%' : '–'}</td><td>${Math.round(ms / 60000)}</td></tr>`;
    }).join('');
    const trouble = Store.SUBJECTS.flatMap(s => Store.trouble(p, s).filter(r => Engine.SK[r.skill] && r.miss).map(r => ({ ...r, s }))).sort((a, b) => b.miss - a.miss).slice(0, 5);
    const troubleTxt = trouble.map(r => { let q; try { q = Engine.build({ skill: r.skill, lvl: r.lvl, seed: r.seed }, p); } catch { return ''; } return `<li><span class="eyebrow">${t('subj.' + r.s + '.title')} · ${t(Engine.SK[r.skill].name)}</span><span>${(q.promptText || q.prompt).replace(/<(?!\/?span|\/?b)[^>]+>/g, '')}</span><span class="small muted">${t('parent.missed', { n: r.miss })}</span></li>`; }).join('');
    const sessions = p.sessions.slice(0, 5).map(x => `<li><span class="mono small">${x.date}</span> <span>${x.subject === 'mixed' ? t('pr.warmup') : t('subj.' + x.subject + '.title')}</span> <span class="muted small">${t('pr.score', { a: x.right, b: x.n })} · ${t('common.minutes', { n: Math.max(1, Math.round((x.ms || 0) / 60000)) })}</span></li>`).join('');
    return `<article class="k-card kid"><header>${avatar(p.avatar, p.color, 48)}<div><h3>${esc(p.name)}</h3><span class="small muted">${t('band.' + p.band)} · ${p.lang === 'ta' ? 'தமிழ்' : 'English'} · ${t('parent.streak')}: ${Store.streak(p)}</span></div>
      <div class="kid-actions"><a class="k-btn k-btn-ghost k-btn-sm" href="#/profile/${p.id}">${t('common.edit')}</a><button class="k-btn k-btn-ghost k-btn-sm kid-del" data-id="${p.id}">${t('common.delete')}</button></div></header>
      <table class="ptable"><thead><tr><th scope="col">${t('parent.perSubject')}</th><th scope="col">${t('subj.mastery')}</th><th scope="col">${t('parent.accuracy')}</th><th scope="col">${t('parent.minutes')}</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="kid-cols"><div><p class="eyebrow">${t('parent.trouble')}</p>${trouble.length ? `<ul class="trouble">${troubleTxt}</ul>` : `<p class="muted small">${t('parent.troubleNone')}</p>`}</div>
      <div><p class="eyebrow">${t('parent.recent')}</p>${sessions ? `<ul class="sessions">${sessions}</ul>` : `<p class="muted small">${t('parent.recentNone')}</p>`}</div></div>${extrasHtml(p)}</article>`;
  }
  function extrasHtml(p) {
    let h = '';
    try { const g = window.DRAW?.gallery?.(p) || []; if (g.length) h += `<p class="eyebrow">${t('parent.gallery')}</p><div class="gallery">${g.slice(0, 12).map(src => `<img src="${src}" alt="" loading="lazy">`).join('')}</div>`; } catch {}
    try { const nb = window.LAB?.notebook?.(p) || []; if (nb.length) h += `<p class="eyebrow">${t('parent.notebook')}</p><ul class="sessions">${nb.slice(0, 5).map(x => `<li><span class="mono small">${esc(x.date || '')}</span> <span>${esc(x.title || x.id)}</span> <span class="muted small">${esc(x.summary || '')}</span></li>`).join('')}</ul>`; } catch {}
    return h;
  }
  function credits() {
    const all = [...Object.entries(window.PICS || {}), ...Object.entries(window.PHOTOS || {})];
    main.innerHTML = `<section class="page credits"><p class="eyebrow">${t('app.name')}</p><h1>${t('credits.title')}</h1><p class="lede">${t('credits.body')}</p>
      <h2 class="section">${t('credits.photos')}</h2><ul class="credit-list">${all.map(([k, v]) => `<li><img src="${v.src}" alt="" loading="lazy"><span><b>${esc(k)}</b><a href="${v.page}" target="_blank" rel="noopener">${esc(v.credit || 'Wikimedia Commons')}</a></span></li>`).join('')}
      <li><img src="img/body/lungs.jpg" alt="" loading="lazy"><span><b>body</b><a href="https://udambu.vercel.app" target="_blank" rel="noopener">Sketchfab models (CC BY / CC BY-NC) via Udambu</a></span></li></ul>
      <h2 class="section">${t('credits.data')}</h2><ul class="sessions"><li>${t('geo.sources')}</li><li>Open-Meteo (CC BY 4.0) · <a href="https://open-meteo.com" target="_blank" rel="noopener">open-meteo.com</a></li><li>Dolch sight word lists (public domain)</li></ul>
      <h2 class="section">${t('credits.fonts')}</h2><ul class="sessions"><li>Lato, Noto Sans Tamil, JetBrains Mono · SIL Open Font License</li></ul></section>`;
  }
  function gate() {
    const a = 12 + Math.floor(Math.random() * 30), b = 11 + Math.floor(Math.random() * 30);
    main.innerHTML = `<section class="page gate"><div class="k-card gatecard"><svg class="k-icon lg"><use href="#i-lock"/></svg><p class="eyebrow">${t('parent.gate')}</p><h1>${a} + ${b} = ?</h1><p>${t('parent.gateBody')}</p>
      <form id="gateForm"><label class="k-sr-only" for="gateIn">${a} + ${b}</label><input class="k-input" id="gateIn" inputmode="numeric" pattern="[0-9]*" autocomplete="off"><button class="k-btn k-btn-primary">${t('common.open')}</button></form><p class="k-error" id="gateErr" hidden>${t('parent.gateWrong')}</p></div></section>`;
    $('#gateIn').focus();
    $('#gateForm').onsubmit = e => { e.preventDefault(); if (+$('#gateIn').value === a + b) { parentOpen = Date.now(); parent(); } else { $('#gateErr').hidden = false; setTimeout(gate, 900); } };
  }
  function profileForm(id) {
    const isNew = id === 'new', first = !Store.db.profiles.length;
    if (!first && Date.now() - parentOpen > 10 * 60 * 1000) return gate();
    const p = isNew ? { name: '', band: 'young', avatar: Store.AVATARS[Math.floor(Math.random() * 8)], color: Store.AV_COLORS[0], lang: I18N.lang } : Store.db.profiles.find(x => x.id === id);
    if (!p) return notFound();
    const st = { ...p };
    main.innerHTML = `<section class="page profile">${first ? `<p class="eyebrow"><span lang="en">Kalvi</span> · <span lang="ta">கல்வி</span></p><h1>${t('prof.welcome')}</h1><p class="lede">${t('prof.welcomeBody')}</p>` : `<a class="backlink" href="#/parent"><svg class="k-icon"><use href="#i-back"/></svg>${t('nav.grownups')}</a><h1>${isNew ? t('prof.newTitle') : t('prof.editTitle')}</h1>`}
      <form class="k-card pform" id="pform" novalidate>
        <div class="pform-preview" aria-hidden="true"></div>
        <div class="k-field"><label class="k-label" for="pname">${t('prof.name')}</label><input class="k-input" id="pname" maxlength="24" autocomplete="off" placeholder="${t('prof.namePh')}" value="${esc(st.name)}"><p class="k-error" id="perr" hidden>${t('prof.nameErr')}</p></div>
        <fieldset class="k-fieldset"><legend class="k-label">${t('band.label')}</legend><div class="seg">${['young', 'older'].map(b => `<button type="button" data-band="${b}">${t('band.' + b)}</button>`).join('')}</div><p class="k-help">${t('band.help')}</p></fieldset>
        <fieldset class="k-fieldset"><legend class="k-label">${t('prof.avatar')}</legend><div class="avpick">${Store.AVATARS.map(a => `<button type="button" data-av="${a}" aria-label="${t('prof.av.' + a)}"></button>`).join('')}</div></fieldset>
        <fieldset class="k-fieldset"><legend class="k-label">${t('prof.color')}</legend><div class="swatches">${Store.AV_COLORS.map(c => `<button type="button" data-col="${c}" style="--c:${c}" aria-label="${c}"></button>`).join('')}</div></fieldset>
        <fieldset class="k-fieldset"><legend class="k-label">${t('prof.langPref')}</legend><div class="seg"><button type="button" data-lang="en" lang="en">English</button><button type="button" data-lang="ta" lang="ta">தமிழ்</button></div></fieldset>
        <div class="row-actions">${first ? '' : `<a class="k-btn k-btn-ghost" href="#/parent">${t('common.cancel')}</a>`}<button class="k-btn k-btn-primary k-btn-lg">${isNew ? t('prof.create') : t('common.save')}</button></div>
      </form></section>`;
    const draw = () => {
      $$('[data-band]').forEach(b => b.setAttribute('aria-pressed', b.dataset.band === st.band));
      $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === st.lang));
      $$('[data-av]').forEach(b => { b.innerHTML = avatar(b.dataset.av, st.color, 44); b.setAttribute('aria-pressed', b.dataset.av === st.avatar); });
      $$('[data-col]').forEach(b => b.setAttribute('aria-pressed', b.dataset.col === st.color));
      $('.pform-preview').innerHTML = avatar(st.avatar, st.color, 88);
    };
    $$('[data-band]').forEach(b => b.onclick = () => { st.band = b.dataset.band; draw(); });
    $$('[data-av]').forEach(b => b.onclick = () => { st.avatar = b.dataset.av; draw(); });
    $$('[data-col]').forEach(b => b.onclick = () => { st.color = b.dataset.col; draw(); });
    $$('[data-lang]').forEach(b => b.onclick = () => { st.lang = b.dataset.lang; if (first) { try { localStorage.setItem('kalvi.lang', st.lang); } catch {} st.name = $('#pname').value; applyLang(); profileForm(id); return; } draw(); });
    $('#pform').onsubmit = e => {
      e.preventDefault(); st.name = $('#pname').value.trim();
      if (!st.name) { $('#perr').hidden = false; $('#pname').focus(); return; }
      if (isNew) Store.newProfile(st); else Store.update(p.id, { name: st.name, band: st.band, avatar: st.avatar, color: st.color, lang: st.lang });
      applyLang(); location.hash = first ? '#/' : '#/parent';
    };
    draw();
  }
  function notFound() { main.innerHTML = `<section class="page"><h1>404</h1><a href="#/">${t('nav.today')}</a></section>`; }

  // ---------- router ----------
  function route() {
    applyLang(); Voice.stop();
    const h = location.hash.replace(/^#/, '') || '/', parts = h.split('/').filter(Boolean);
    if (!Store.db.profiles.length && parts[0] !== 'profile') { if (h !== '/profile/new') { location.replace('#/profile/new'); } return profileForm('new'); }
    header();
    document.body.dataset.view = parts[0] || 'home';
    const r = parts[0];
    if (!r) home();
    else if (r === 's') subject(parts[1]);
    else if (r === 't') topic(parts[1], parts[2]);
    else if (r === 'round') Engine.render(main);
    else if (r === 'summary') Engine.summary(main);
    else if (window.ROUTES[r]) window.ROUTES[r].render(main, parts);
    else if (r === 'progress') progress();
    else if (r === 'credits') credits();
    else if (r === 'parent') parent();
    else if (r === 'profile') profileForm(parts[1]);
    else notFound();
    if (r !== 'round') { main.focus({ preventScroll: true }); scrollTo(0, 0); }
  }
  addEventListener('hashchange', route);
  addEventListener('keydown', e => { const v = document.body.dataset.view; if (v === 'round') Engine.keys(e); else window.ROUTES[v]?.keys?.(e); });
  window.App = { route, toast, dialog, closeDialog, avatar, applyLang, renderRound: () => { Engine.render(main); main.focus({ preventScroll: true }); scrollTo(0, 0); }, SUBJ, forBand, get parentOpen() { return parentOpen; } };
  route();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
