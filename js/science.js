// Science: 11 concept pages (explanation, demo on a dark board, try-this chips, why chain, try at home,
// questions children ask) and a quiz bank per topic, plus the mixed Science quiz game.
(function () {
  const { skill } = Engine, esc = Engine.esc, S = 'science';
  const SIM = { forces: 'ramp', light: 'prism', sound: 'sound', magnets: 'magnet', electricity: 'circuit', matter: 'matter', water: 'water', weather: 'breeze', space: 'moon', machines: 'lever', living: 'plant' };
  const ICON = { forces: 'i-ramp', light: 'i-prism', sound: 'i-wave', magnets: 'i-magnet', electricity: 'i-bolt', matter: 'i-matter', water: 'i-drop', weather: 'i-cloud', space: 'i-moon', machines: 'i-lever', living: 'i-tree' };
  const BODY = { lungs: { by: 'neshallads', lic: 'CC BY', href: 'https://sketchfab.com/3d-models/ce09f4099a68467880f46e61eb9a3531' }, brain: { by: 'FrankJohansson', lic: 'CC BY', href: 'https://sketchfab.com/3d-models/0aa0e33c5c854d1bab7bac9e1c7acaec' }, stomach: { by: 'neshallads', lic: 'CC BY-NC', href: 'https://sketchfab.com/3d-models/e0f1952de7204654ba469c3e887a029b' } };
  const LINKS = { vanam: 'https://vanam-app.vercel.app', kaadu: 'https://kaadu-plants.vercel.app', udambu: 'https://udambu.vercel.app' };
  function photo(key) {
    if (!key) return null;
    if (key.startsWith('body:') && window.PHOTOS?.[key.slice(5)]) { const q = PHOTOS[key.slice(5)]; return { src: q.src, credit: q.credit, href: q.page, alt: key.slice(5) }; }
    if (key.startsWith('body:')) { const k = key.slice(5), b = BODY[k]; return b ? { src: `img/body/${k}.jpg`, credit: `3D model by ${b.by} on Sketchfab (${b.lic}), from Udambu`, href: b.href, alt: k } : null; }
    const p = window.PHOTOS?.[key] || window.PICS?.[key]; return p ? { src: p.src, credit: p.credit, href: p.page, alt: key } : null;
  }
  // build an engine question from a bank item (already localised by tx)
  function fromItem(it, r, topicKey) {
    const tf = it.type === 'tf';
    let choices, answer;
    if (tf) { choices = [{ v: true, html: t('common.true') }, { v: false, html: t('common.false') }]; answer = it.a; }
    else { const idx = r.shuffle(it.o.map((_, i) => i)); choices = idx.map(i => ({ v: i, html: esc(it.o[i]) })); answer = it.a; }
    const TOPIC_PHOTO = { light: 'prism', water: 'clouds', weather: 'lightning', matter: 'ice', magnets: 'magnet', forces: 'toycar', electricity: 'bulb', space: 'earth', sound: 'stringphone', living: 'greengram', plants: 'leaf', animals: 'nest2', body: 'lungs', seasons: 'winter' };
    const ph = photo(it.photo || (!it.snap && TOPIC_PHOTO[topicKey]));
    const snap = it.snap ? SIMS.snap(it.snap.sim, it.snap.s) : null;
    const prompt = tf ? t('s.ui.tfPrompt', { s: esc(it.q) }) : esc(it.q);
    const visual = snap || (ph ? `<figure class="qphoto"><img src="${ph.src}" alt="" loading="lazy" referrerpolicy="no-referrer"></figure>` : null);
    const whySnap = !ph && topicKey && SIM[topicKey] && !snap ? SIMS.snap(SIM[topicKey], SIMS.SIMS[SIM[topicKey]].tries[0]) : null;
    return { kind: tf ? 'tf' : 'choice', prompt, visual, boardClass: ph && !snap ? 'photo' : '', choices, answer,
      say: [{ text: (tf ? t('s.ui.tfPrompt', { s: it.q }) : it.q) + '. ' + (tf ? `${t('common.true')}, ${t('common.false')}` : it.o.join(', ')), lang: I18N.lang }],
      eyebrow: t('s.qtype.' + (it.type === 'pic' ? 'pic' : it.type)),
      why: { photo: ph, steps: it.why.map((w, i) => ({ text: esc(w), vis: i === it.why.length - 1 ? (snap || whySnap) : null })) } };
  }
  const pickItem = (bank, l, r) => { const at = bank.filter(x => x.lvl === l), le = bank.filter(x => x.lvl <= l); return r.pick(at.length && r() < 0.7 ? at : le.length ? le : bank); };
  const TOPIC_IDS = Object.keys(SIM);
  TOPIC_IDS.filter(id => id !== 'living').forEach(id => skill({ id: 's.' + id, subject: S, topic: id, name: `sci.${id}.title`, bands: { young: [1, 1], older: [1, 2] },
    gen(l, r) { return fromItem(pickItem(tx(`sci.${id}.quiz`), l, r), r, id); } }));
  ['plants', 'animals', 'body', 'seasons'].forEach(id => skill({ id: 's.' + id, subject: S, topic: 'living', name: `s.skill.${id}`, bands: { young: [1, 1], older: [1, 2] },
    gen(l, r) { return fromItem(pickItem(tx(`sq.${id}`), l, r), r, id === 'plants' ? 'living' : null); } }));

  // concept page: explanation → demo → try chips → why chain → try at home → questions children ask
  function page(el, tp) {
    const c = tx(`sci.${tp.id}`), simKey = SIM[tp.id], sim = SIMS.SIMS[simKey];
    el.innerHTML = `<div class="concept">
      <article class="k-card"><div class="lesson-head"><p class="eyebrow">${t('topic.lesson')}</p>${Engine.listenBtn('ilisten')}</div><p class="lesson-body">${esc(c.intro)}</p></article>
      <article class="k-card"><p class="eyebrow">${t('topic.demo')}</p><div id="sim"></div><p class="eyebrow" style="margin-top:12px">${t('topic.tryThis')}</p><div class="chips">${c.tries.map((x, i) => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-try="${i}">${esc(x)}</button>`).join('')}</div></article>
      <details class="why"><summary>${t('topic.why')}</summary><ol class="steps">${c.why.map((w, i) => `<li class="step"><span class="step-n">${i + 1}</span><div class="step-body"><p>${esc(w)}</p></div></li>`).join('')}</ol></details>
      <article class="k-card athome"><p class="eyebrow">${t('topic.atHome')}</p><div class="kid-cols"><div><h3>${t('topic.need')}</h3><ul>${c.home.need.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div><h3>${t('topic.steps')}</h3><ol>${c.home.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div></div><p class="grownup"><b>${t('topic.grownup')}:</b> ${esc(c.home.note)}</p></article>
      <article class="k-card"><p class="eyebrow">${t('topic.wonder')}</p><div class="wonder">${c.wonder.map((w, i) => `<button type="button" aria-expanded="false" data-w="${i}"><b>${esc(w.q)}</b><span hidden>${esc(w.a)}</span><small class="muted">${t('topic.tapReveal')}</small></button>`).join('')}</div></article>
      ${tp.id === 'weather' ? `<article class="k-card" id="live"><p class="eyebrow">${t('s.ui.live')}</p><p class="muted">${t('common.loading')}…</p></article>` : ''}
      ${tp.id === 'space' ? `<article class="k-card" id="tonight"></article>` : ''}
      ${tp.id === 'living' ? `<article class="k-card"><p class="eyebrow">${t('topic.seeAlso')}</p><div class="seealso">${Object.keys(LINKS).map(k => `<a class="k-btn k-btn-outline pill" href="${LINKS[k]}" target="_blank" rel="noopener">${t('s.seeAlso.' + k)}<svg class="k-icon sm"><use href="#i-external"/></svg></a>`).join('')}</div></article>` : ''}
    </div>`;
    const ctl = SIMS.mount(el.querySelector('#sim'), simKey, sim.tries[0]);
    el.querySelectorAll('[data-try]').forEach(b => b.onclick = () => { ctl.set(sim.tries[+b.dataset.try]); el.querySelectorAll('[data-try]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    el.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { const sp = b.querySelector('span'), open = sp.hidden; sp.hidden = !open; b.setAttribute('aria-expanded', open); b.querySelector('small').hidden = open; if (open) Voice.play([{ text: c.wonder[+b.dataset.w].a, lang: I18N.lang }], null, {}); });
    Engine.bindListen(el.querySelector('.ilisten'), () => [{ text: c.intro, lang: I18N.lang }]);
    if (tp.id === 'weather') liveWeather(el.querySelector('#live'));
    if (tp.id === 'space') tonight(el.querySelector('#tonight'));
  }
  async function liveWeather(card) {
    try {
      const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.08&longitude=80.27&current=temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=Asia%2FKolkata').then(x => x.json());
      const c = r.current, dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], d = dirs[Math.round(c.wind_direction_10m / 45) % 8];
      const sea = c.wind_direction_10m > 22 && c.wind_direction_10m < 180;
      card.innerHTML = `<p class="eyebrow">${t('s.ui.live')} · <span class="mono">${c.time.slice(11)}</span></p><div class="stats"><div class="k-stat"><span class="k-stat-label">${t('s.ui.temp')}</span><span class="k-stat-value">${Math.round(c.temperature_2m)}°</span></div><div class="k-stat"><span class="k-stat-label">${t('s.ui.wind')}</span><span class="k-stat-value">${Math.round(c.wind_speed_10m)}<small class="small"> km/h</small></span></div><div class="k-stat"><span class="k-stat-label">${t('s.ui.cloud')}</span><span class="k-stat-value">${c.cloud_cover}%</span></div></div>
        <p>${t('s.ui.wind')}: ${t('s.ui.fromDir', { d: t('s.ui.dirs.' + d) })}. ${sea ? t('s.ui.seaWind') : t('s.ui.landWind')}</p><p class="small muted">${t('s.ui.liveSrc')} · <a href="https://open-meteo.com" target="_blank" rel="noopener">open-meteo.com</a></p>`;
    } catch { card.innerHTML = `<p class="eyebrow">${t('s.ui.live')}</p><p class="muted">${t('s.ui.liveErr')}</p>`; }
  }
  function tonight(card) {
    const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14), age = (((Date.now() - ref) / 86400000) % syn + syn) % syn, a = age / syn * 360;
    const idx = Math.round(a / 45) % 8;
    card.innerHTML = `<p class="eyebrow">${t('s.ui.tonight')}</p><div class="board small" style="max-width:220px">${`<svg class="r3" viewBox="0 0 160 160">${SIMS.SIMS.moon.phaseSvg(a, 80, 80, 60)}</svg>`}</div><p><b>${t('s.ui.phase.' + idx)}</b> · ${new Date().toLocaleDateString(I18N.lang === 'ta' ? 'ta-IN' : 'en-IN', { day: 'numeric', month: 'long' })}</p>`;
  }
  const TOPICS = TOPIC_IDS.map(id => ({ id, subject: S, title: `sci.${id}.title`, blurb: `sci.${id}.blurb`, icon: ICON[id], page,
    skills: id === 'living' ? ['s.plants', 's.animals', 's.body', 's.seasons'] : ['s.' + id],
    bands: ['electricity', 'machines'].includes(id) ? ['older'] : undefined }));
  const quizGame = { title: 'home.quizTitle', blurb: 'home.quizBody', icon: 'i-quiz', start(p) {
    const ids = TOPICS.filter(tp => App.forBand(tp, p)).flatMap(tp => tp.skills), n = AGE.band(p) === 'young' ? 6 : 8;
    const due = Store.due(p, S).filter(r => Engine.SK[r.skill]).slice(0, 2).map(r => ({ skill: r.skill, lvl: r.lvl, seed: r.seed }));
    const go = () => Engine.start({ items: [...due, ...Engine.weighted(p, ids, n - due.length)], title: t('home.quizTitle'), subject: S, topic: 'quiz', mode: 'quiz', back: '#/s/science', again: go }); go();
  } };
  window.SCIENCE = { TOPICS, quizGame, photo };
})();
