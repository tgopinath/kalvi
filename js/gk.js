// General Knowledge for the "World" subject: seven topic pages, one engine skill per topic built from the
// bilingual bank in gk-data.js (picture choices, true/false, odd one out, "which came first?" timelines),
// the 10-question World quiz and the date-seeded Daily Five.
(function () {
  const D = window.GK_DATA, W = 'world', esc = Engine.esc, L = v => I18N.loc(v);
  I18N.add({ gk: {
    title: ['World quiz', 'உலக அறிவு வினாடி வினா'],
    blurb: ['Ten questions about India, Tamil Nadu, scientists, space, sport, stories and staying safe.', 'இந்தியா, தமிழ்நாடு, அறிவியலாளர்கள், விண்வெளி, விளையாட்டு, கதைகள், பாதுகாப்பு பற்றிய பத்துக் கேள்விகள்.'],
    dailyTitle: ['Daily Five', 'இன்றைய ஐந்து'],
    dailyBlurb: ['Five new questions every day, the same for everyone in the family.', 'ஒவ்வொரு நாளும் ஐந்து புதிய கேள்விகள்; குடும்பத்தில் எல்லோருக்கும் ஒரே கேள்விகள்.'],
    didYouKnow: ['Did you know?', 'உனக்குத் தெரியுமா?'],
    about: ['About this topic', 'இந்தத் தலைப்பைப் பற்றி'],
    tf: ['True or false: {s}', 'சரியா தவறா: {s}'],
    timeline: ['In order', 'கால வரிசையில்'],
    kuralTitle: ['A kural to remember', 'நினைவில் வைக்க ஒரு குறள்'],
    kuralN: ['Kural {n}', 'குறள் {n}'],
    meaning: ['What it means', 'இதன் பொருள்'],
    pictures: ['Pictures', 'படங்கள்'],
    source: ['Source', 'மூலம்'],
    seeAlso: ['Learn more', 'மேலும் அறிய'],
    notIt: ['It is not “{x}”.', '“{x}” அல்ல.'],
    notThese: ['It is not “{x}” or “{y}”.', '“{x}”, “{y}” இரண்டும் அல்ல.'],
    tfStep: ['Read it again slowly. If any part of it is wrong, the whole sentence is false.', 'மெதுவாக மீண்டும் படி. அதில் ஏதேனும் ஒரு பகுதி தவறு என்றால் முழு வாக்கியமும் தவறு.'],
    firstStep: ['“{x}” was {w}, so it was not first.', '“{x}”: {w}. எனவே அது முதலில் வரவில்லை.'],
    answerIs: ['The answer is “{x}”.', 'விடை: “{x}”.'],
    oddNote: ['Which one does not belong?', 'இவற்றில் பொருந்தாதது எது?'],
    topic: {
      india: { title: ['India', 'இந்தியா'], blurb: ['National symbols, festivals, states and languages, and famous monuments.', 'தேசியச் சின்னங்கள், பண்டிகைகள், மாநிலங்கள், மொழிகள், புகழ்பெற்ற நினைவுச் சின்னங்கள்.'] },
      tamilnadu: { title: ['Tamil Nadu', 'தமிழ்நாடு'], blurb: ['Thiruvalluvar, the Big Temple, Mamallapuram, dance, kolam and food.', 'திருவள்ளுவர், பெரிய கோயில், மாமல்லபுரம், நடனம், கோலம், உணவு.'] },
      scientists: { title: ['Scientists and inventors', 'அறிவியலாளர்களும் கண்டுபிடிப்பாளர்களும்'], blurb: ['Raman, Ramanujan, Kalam, Kalpana Chawla, Curie, Newton and the Wright brothers.', 'இராமன், இராமானுஜன், கலாம், கல்பனா சாவ்லா, கியூரி, நியூட்டன், ரைட் சகோதரர்கள்.'] },
      space: { title: ['Space and ISRO', 'விண்வெளியும் இஸ்ரோவும்'], blurb: ['The planets, Chandrayaan, Mangalyaan and India’s rockets.', 'கோள்கள், சந்திரயான், மங்கள்யான், இந்திய ராக்கெட்டுகள்.'] },
      wonders: { title: ['Wonders, sport and stories', 'அதிசயங்கள், விளையாட்டு, கதைகள்'], blurb: ['World wonders, kabaddi, cricket, chess, the Olympics and famous stories.', 'உலக அதிசயங்கள், கபடி, கிரிக்கெட், சதுரங்கம், ஒலிம்பிக், புகழ்பெற்ற கதைகள்.'] },
      safety: { title: ['Safety and caring', 'பாதுகாப்பும் அக்கறையும்'], blurb: ['Traffic lights, emergency numbers, saving water, sorting waste and kindness.', 'போக்குவரத்து விளக்குகள், அவசர எண்கள், நீர் சேமிப்பு, குப்பை பிரித்தல், அன்பு.'] },
      nature: { title: ['Animals and the body', 'விலங்குகளும் உடலும்'], blurb: ['A few light questions, with more to explore in Vanam and Udambu.', 'சில எளிய கேள்விகள்; மேலும் அறிய வனம், உடம்பு செயலிகள்.'] },
    },
  } });

  const IDS = ['india', 'tamilnadu', 'scientists', 'space', 'wonders', 'safety', 'nature'];
  const ICON = { india: 'i-map', tamilnadu: 'i-book', scientists: 'i-bulb', space: 'i-moon', wonders: 'i-globe', safety: 'i-heart', nature: 'i-tree' };

  // the World subject may not exist yet on older profiles
  function ensure(p) { if (p && p.subjects && !p.subjects[W]) { p.subjects[W] = { skills: {}, review: {}, lessons: {} }; Store.save(); } return p; }

  // ---------- pictures ----------
  function photo(key) {
    if (!key) return null;
    if (key.startsWith('body:')) return window.SCIENCE?.photo(key) || null;
    if (key.startsWith('pics:')) { const w = key.slice(5), p = window.PICS?.[w]; return p ? { src: p.src, credit: p.credit, href: p.page, alt: w } : null; }
    const p = D.PHOTOS[key]; return p ? { src: p.src, credit: p.credit, href: p.href, alt: key } : null;
  }
  const credLink = ph => `<a href="${ph.href}" target="_blank" rel="noopener">${esc(ph.credit)}</a>`;
  const figure = (ph, cls = 'qphoto gk-qphoto') => `<figure class="${cls}"><img src="${ph.src}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('figure').classList.add('noimg')"><figcaption>${t('common.credit')}: ${credLink(ph)}</figcaption></figure>`;

  // a calm traffic light on the dark board (red lit)
  function trafficVis() {
    const lamp = (cy, on, c) => `<circle cx="60" cy="${cy}" r="21" fill="${on ? c : '#1d2230'}" stroke="#0b0d13" stroke-width="3"/>${on ? `<circle cx="53" cy="${cy - 7}" r="5" fill="#fff" opacity=".35"/>` : ''}`;
    return `<svg viewBox="0 0 120 230" width="120" height="230" role="img" aria-label="${esc(L(['A traffic light', 'ஒரு போக்குவரத்து விளக்கு']))}"><rect x="56" y="196" width="8" height="34" fill="#3a4152"/><rect x="24" y="8" width="72" height="190" rx="14" fill="#2b3142" stroke="#4a5266" stroke-width="2"/>${lamp(46, true, '#e5484d')}${lamp(102, false)}${lamp(158, false)}</svg>`;
  }
  const VIS = { traffic: trafficVis };

  // ---------- bank item -> engine question ----------
  function pickIdx(bank, l, r) {
    const at = bank.filter(x => x.lvl === l), le = bank.filter(x => x.lvl <= l);
    const pool = at.length && r() < 0.7 ? at : le.length ? le : bank;
    return bank.indexOf(pool[Math.floor(r() * pool.length)]);
  }
  function fromItem(raw, r) {
    const it = L(raw), tf = it.type === 'tf', first = it.type === 'first';
    const opts = tf ? [] : it.o;
    const right = first ? raw.y.indexOf(Math.min(...raw.y)) : it.a;
    let choices, answer, answerName;
    if (tf) { choices = [{ v: true, html: t('common.true') }, { v: false, html: t('common.false') }]; answer = it.a; answerName = it.a ? t('common.true') : t('common.false'); }
    else {
      const order = r.shuffle(opts.map((_, i) => i));
      choices = order.map(i => {
        const ph = raw.img ? photo(raw.img[i]) : null;
        return { v: i, img: ph?.src, html: ph && raw.hide ? `<span class="gk-sr">${esc(opts[i])}</span>` : esc(opts[i]), say: ph && !raw.hide ? [{ text: opts[i], lang: I18N.lang }] : null };
      });
      answer = right; answerName = opts[right];
    }
    // prompt: optional Tamil quote (a kural), the question, and for odd-one-out a quiet reminder
    const quote = raw.quote ? `<span class="gk-quote" lang="ta">${esc(raw.quote).replace(/\n/g, '<br>')}</span>` : '';
    const prompt = quote + (tf ? t('gk.tf', { s: esc(it.q) }) : esc(it.q));
    const ph = photo(raw.photo);
    const visual = raw.vis ? VIS[raw.vis]() : ph ? figure(ph) : null;
    const say = [];
    if (raw.quote) say.push({ text: raw.quote.replace(/\n/g, ' '), lang: 'ta' });
    say.push({ text: (tf ? t('gk.tf', { s: it.q }) : it.q) + ' ' + (tf ? `${t('common.true')}, ${t('common.false')}` : opts.join(', ')) + '.', lang: I18N.lang });
    if (raw.img && raw.hide) say[say.length - 1].text = it.q;            // picture-only choices: don't read the names out
    // hint ladder: nudge, worked step, answer
    const wrong = tf ? [] : r.shuffle(opts.map((_, i) => i).filter(i => i !== right));
    let step;
    if (tf) step = t('gk.tfStep');
    else if (first) { const late = opts.map((_, i) => i).filter(i => i !== right).sort((a, b) => raw.y[b] - raw.y[a])[0]; step = t('gk.firstStep', { x: esc(opts[late]), w: esc(it.w[late]) }); }
    else step = wrong.length >= 3 ? t('gk.notThese', { x: esc(opts[wrong[0]]), y: esc(opts[wrong[1]]) }) : t('gk.notIt', { x: esc(opts[wrong[0]]) });
    const hints = [{ text: esc(it.hint) }, { text: step }, { text: t('gk.answerIs', { x: esc(answerName) }) }];
    // the "Did you know?" lesson card
    const whyPh = photo(raw.whyPhoto) || ph || (raw.img ? photo(raw.img[right]) : null);
    const steps = [{ text: `<b class="gk-dyk">${t('gk.didYouKnow')}</b> ${esc(it.why)}` }];
    if (first) {
      const seq = opts.map((o, i) => ({ o, w: it.w[i], y: raw.y[i] })).sort((a, b) => a.y - b.y);
      steps[0].vis = `<ol class="gk-tl" aria-label="${t('gk.timeline')}">${seq.map(s => `<li><span class="gk-tl-when">${esc(s.w)}</span><span class="gk-tl-what">${esc(s.o)}</span></li>`).join('')}</ol>`;
    }
    const others = raw.img ? raw.img.map(photo).filter(p => p && p !== whyPh && p.src !== whyPh?.src) : [];
    const rule = `<span class="gk-cred">${others.length ? `${t('gk.pictures')}: ${others.map(credLink).join(' · ')}<br>` : ''}${t('gk.source')}: ${esc(raw.source)}</span>`;
    return { kind: tf ? 'tf' : 'choice', prompt, visual, boardClass: !raw.vis && ph ? 'photo' : '', choices, answer, say,
      answerText: esc(answerName), hints, hintRevealsAnswer: true,
      why: { photo: whyPh, steps, rule } };
  }

  IDS.forEach(id => Engine.skill({ id: 'gk.' + id, subject: W, topic: id, name: `gk.topic.${id}.title`, bands: { young: [1, 1], older: [1, 2] },
    gen(l, r) { const bank = D.BANK[id]; return fromItem(bank[pickIdx(bank, l, r)], r); } }));
  // which bank item a (skill, lvl, seed) shows, without building it (used to avoid repeats in a round)
  const itemKey = (it) => it.skill + '#' + pickIdx(D.BANK[it.skill.slice(3)], Math.max(1, Math.min(it.lvl || 1, 2)), Engine.rng(it.seed));

  // ---------- topic page ----------
  function page(el, tp) {
    const c = D.PAGES[tp.id], intro = L(c.intro);
    const facts = c.facts.map(f => ({ ph: photo(f.photo), text: L(f.text) }));
    const k = c.kural;
    el.innerHTML = `<div class="concept gk-page">
      <article class="k-card"><div class="lesson-head"><p class="eyebrow">${t('gk.about')}</p>${Engine.listenBtn('ilisten')}</div><p class="lesson-body">${esc(intro)}</p></article>
      ${k ? `<article class="k-card gk-kural"><div class="lesson-head"><p class="eyebrow">${t('gk.kuralTitle')} · ${t('gk.kuralN', { n: k.n })}</p>${Engine.listenBtn('klisten')}</div>
        <blockquote lang="ta">${esc(k.text).replace(/\n/g, '<br>')}</blockquote><p class="eyebrow">${t('gk.meaning')}</p><p class="lesson-body">${esc(L(k.mean))}</p><p class="small muted">${esc(L(k.chapter))}</p></article>` : ''}
      <section aria-labelledby="gkdyk"><p class="eyebrow" id="gkdyk">${t('gk.didYouKnow')}</p><div class="gk-facts">${facts.map(f => `<article class="k-card gk-fact">${f.ph ? `<figure class="gk-fphoto"><img src="${f.ph.src}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('figure').classList.add('noimg')"><figcaption>${t('common.credit')}: ${credLink(f.ph)}</figcaption></figure>` : ''}<p>${esc(f.text)}</p></article>`).join('')}</div></section>
      ${c.links.length ? `<article class="k-card"><p class="eyebrow">${t('gk.seeAlso')}</p><div class="seealso">${c.links.map(id => D.LINKS[id]).map(x => `<a class="k-btn k-btn-outline pill" href="${x.href}" target="_blank" rel="noopener">${esc(L(x.label))}<svg class="k-icon sm" aria-hidden="true"><use href="#i-external"/></svg></a>`).join('')}</div></article>` : ''}
    </div>`;
    Engine.bindListen(el.querySelector('.ilisten'), () => [{ text: intro, lang: I18N.lang }, { text: t('gk.didYouKnow'), lang: I18N.lang }, ...facts.map(f => ({ text: f.text, lang: I18N.lang }))]);
    if (k) Engine.bindListen(el.querySelector('.klisten'), () => [{ text: k.text.replace(/\n/g, ' '), lang: 'ta' }, { text: L(k.mean), lang: I18N.lang }]);
  }
  const TOPICS = IDS.map(id => ({ id, subject: W, title: `gk.topic.${id}.title`, blurb: `gk.topic.${id}.blurb`, icon: ICON[id], skills: ['gk.' + id], page }));

  // ---------- rounds ----------
  const forBand = (tp, p) => window.App?.forBand ? App.forBand(tp, p) : (!tp.bands || tp.bands.includes(p.band));
  function dedupe(items) {
    const seen = new Set();
    return items.map(it => { let x = it; for (let k = 0; k < 24 && seen.has(itemKey(x)); k++) x = { ...x, seed: Engine.newSeed() }; seen.add(itemKey(x)); return x; });
  }
  const game = { title: 'gk.title', blurb: 'gk.blurb', icon: 'i-quiz', start(p) {
    ensure(p);
    const ids = TOPICS.filter(tp => forBand(tp, p)).flatMap(tp => tp.skills), n = 10;
    const go = () => {
      const due = Store.due(p, W).filter(r => Engine.SK[r.skill]).slice(0, 3).map(r => ({ skill: r.skill, lvl: r.lvl, seed: r.seed }));
      Engine.start({ items: dedupe([...due, ...Engine.weighted(p, ids, n - due.length)]), title: t('gk.title'), subject: W, topic: 'gk', mode: 'gk', back: '#/s/world', again: go });
    };
    go();
  } };

  // Daily Five: the same five questions for everyone on a given date (seeded from the date string)
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function daily(p, n = 5, date = Store.today()) {
    ensure(p);
    const r = Engine.rng(hash('kalvi-gk|' + date));
    const ids = r.shuffle(TOPICS.filter(tp => forBand(tp, p)).flatMap(tp => tp.skills));
    const out = [];
    for (let i = 0; i < n; i++) {
      const skill = ids[i % ids.length], lvl = Engine.SK[skill].max(p.band);
      let seed = hash(date + '|' + i) % 2147483647, x = { skill, lvl, seed };
      for (let k = 1; k < 24 && out.some(o => itemKey(o) === itemKey(x)); k++) x = { skill, lvl, seed: hash(date + '|' + i + '|' + k) % 2147483647 };
      out.push(x);
    }
    return out;
  }
  const dailyGame = { title: 'gk.dailyTitle', blurb: 'gk.dailyBlurb', icon: 'i-sun', start(p) {
    const go = () => Engine.start({ items: daily(p), title: t('gk.dailyTitle'), subject: W, topic: 'daily', mode: 'gk-daily', back: '#/s/world', again: go }); go();
  } };

  window.GK = { TOPICS, game, daily, dailyGame, photo, ensure };
})();
