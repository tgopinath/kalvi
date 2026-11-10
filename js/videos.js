// Watch, predict, explain. Kalvi-made explainers are JS timelines (SIMS + simple SVG scenes) with device
// narration and EN/Tamil captions; they stop at pause points for a prediction or a why question, then show
// the result, a lesson card and a 3-question recap. Real clips (Wikimedia Commons, PD/CC) stream online only.
// Routes: #/videos (library), #/videos/<id> (player). Progress: skills 'vid.<id>', p.extras.videos.
(function () {
  const esc = Engine.esc, L = v => I18N.loc(v), D = window.VID_DATA || { EXPLAINERS: [], CLIPS: [] };
  const X = D.EXPLAINERS, C = D.CLIPS, byId = Object.fromEntries([...X, ...C].map(x => [x.id, x]));
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const native = () => !!window.Capacitor?.isNativePlatform?.();
  I18N.add({ videos: {
    title: ['Watch, predict, explain', 'பார், கணி, விளக்கு'], blurb: ['Short science films that stop and ask what you think will happen.', 'என்ன நடக்கும் என்று நின்று கேட்கும் சிறு அறிவியல் படங்கள்.'],
    made: ['Kalvi explainers', 'கல்வி விளக்கப் படங்கள்'], madeSub: ['Work without internet. Narrated by your device.', 'இணையம் இல்லாமலும் இயங்கும். உன் கருவி வாசிக்கும்.'],
    real: ['Real clips', 'உண்மைக் காட்சிகள்'], realSub: ['Real footage from NASA and Wikimedia Commons, streamed when online.', 'நாசா, விக்கிமீடியா காமன்ஸிலிருந்து உண்மைக் காட்சிகள்; இணையத்தில் மட்டும்.'],
    play: ['Play', 'இயக்கு'], pause: ['Pause', 'நிறுத்து'], back10: ['Back 10 s', '10 வி. பின்'], cc: ['Captions', 'வசனம்'], ccLang: ['Caption language', 'வசன மொழி'], speed: ['Speed', 'வேகம்'], full: ['Full screen', 'முழுத் திரை'],
    pressPlay: ['Press Play to start.', 'தொடங்க இயக்கு பொத்தானை அழுத்து.'], predict: ['What will happen next?', 'அடுத்து என்ன நடக்கும்?'], why: ['Why did that happen?', 'அது ஏன் நடந்தது?'],
    go: ['Keep watching', 'தொடர்ந்து பார்'], lesson: ['What we learned', 'நாம் கற்றது'], recap: ['Recap', 'மீள்பார்வை'], startRecap: ['Start the recap', 'மீள்பார்வையைத் தொடங்கு'],
    qn: ['Question {a} of {b}', 'கேள்வி {a} / {b}'], explain: ['Which explanation would you give a friend, in your own words?', 'உன் சொந்த வார்த்தைகளில் நண்பனிடம் எந்த விளக்கத்தைச் சொல்வாய்?'],
    next: ['Next', 'அடுத்து'], score: ['You got {a} of {b} right.', '{b}-இல் {a} சரி.'], again: ['Watch again', 'மீண்டும் பார்'], library: ['All films', 'எல்லாப் படங்களும்'],
    watched: ['Watched', 'பார்த்தது'], secs: ['{n} s', '{n} வி.'], needsNet: ['This clip streams from Wikimedia Commons and needs the internet. The Kalvi explainers work offline.', 'இந்தக் காட்சி விக்கிமீடியா காமன்ஸிலிருந்து ஓடுகிறது; இணையம் தேவை. கல்வி விளக்கப் படங்கள் இணையமின்றியும் இயங்கும்.'],
    inApp: ['Real clips play in the web version of Kalvi when you are online.', 'உண்மைக் காட்சிகள் இணையத்தில் கல்வியின் வலைப் பதிப்பில் இயங்கும்.'],
    clipBy: ['Clip: {a}, {l}', 'காட்சி: {a}, {l}'], source: ['File page', 'கோப்புப் பக்கம்'], ended: ['The clip has ended.', 'காட்சி முடிந்தது.'], notFound: ['Film not found.', 'படம் கிடைக்கவில்லை.'],
    day: ['Day', 'பகல்'], night: ['Night', 'இரவு'], home: ['Your home', 'உன் வீடு'], east: ['East', 'கிழக்கு'], west: ['West', 'மேற்கு'], sea: ['Sea', 'கடல்'], ghats: ['Western Ghats', 'மேற்குத் தொடர்ச்சி மலை'],
    org: { mouth: ['Mouth', 'வாய்'], pipe: ['Food pipe', 'உணவுக்குழாய்'], stomach: ['Stomach', 'இரைப்பை'], small: ['Small intestine', 'சிறுகுடல்'], large: ['Large intestine', 'பெருங்குடல்'] },
    lungs: ['Lungs', 'நுரையீரல்'], dia: ['Diaphragm', 'உதரவிதானம்'], wind: ['Windpipe', 'மூச்சுக்குழாய்'], bin: ['Breathe in', 'உள்ளிழு'], bout: ['Breathe out', 'வெளிவிடு'],
    th: { nail: ['Iron nail', 'இரும்பு ஆணி'], coin: ['Coin', 'நாணயம்'], eraser: ['Eraser', 'அழிப்பான்'] },
    n: Object.fromEntries([...X, ...C].map(x => [x.id, x.title])),
  } });

  // ---------- scenes (600 × 250 on the dark board) ----------
  const sv = (inner, label = '') => `<svg class="r3" viewBox="0 0 600 250" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || '#cfd4de'}" font-family="Lato, 'Noto Sans Tamil', sans-serif" font-weight="${o.w || 700}" font-size="${o.size || 13}" text-anchor="${o.a || 'middle'}">${esc(s)}</text>`;
  const ease = k => k < 0 ? 0 : k > 1 ? 1 : k * k * (3 - 2 * k);
  const lerpPath = (pts, k) => { const seg = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
    let want = Math.max(0, Math.min(1, k)) * tot; for (let i = 0; i < seg.length; i++) { if (want <= seg[i]) { const f = want / (seg[i] || 1); return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; } want -= seg[i]; } return pts[pts.length - 1]; };
  const SC = {
    phase: s => sv(SIMS.SIMS.moon.phaseSvg(s.a, 300, 125, 95), 'moon phase'),
    dayNight(s) {
      const cx = 330, cy = 125, r = 95, a = s.a * Math.PI / 180, hx = cx - Math.cos(a) * r * 0.82, hy = cy - Math.sin(a) * r * 0.82;
      const hr = ((12 + s.a / 15) % 24 + 24) % 24, land = [0, 70, 150, 230, 300].map((o, i) => { const b = (s.a + o) * Math.PI / 180; return `<ellipse cx="${cx - Math.cos(b) * r * 0.5}" cy="${cy - Math.sin(b) * r * 0.5}" rx="${18 + i * 3}" ry="${11 + i * 2}" fill="#3f9a62" transform="rotate(${s.a + o} ${cx - Math.cos(b) * r * 0.5} ${cy - Math.sin(b) * r * 0.5})"/>`; }).join('');
      return sv(`<circle cx="40" cy="125" r="34" fill="#ffd66b"/><circle cx="40" cy="125" r="54" fill="#ffd66b" opacity=".16"/>${[-60, -30, 0, 30, 60].map(y => `<line x1="90" y1="${125 + y}" x2="220" y2="${125 + y * 0.8}" stroke="#ffd66b" stroke-width="2" opacity=".45"/>`).join('')}
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#2f6fb0"/>${land}<path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} Z" fill="#05070d" opacity=".62"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#5f6b85"/>
        <path d="M${cx + 60} ${cy - r - 14} A${r + 16} ${r + 16} 0 0 1 ${cx + r + 14} ${cy - 50}" fill="none" stroke="#cfd4de" stroke-width="2" marker-end="url(#vdar)"/><defs><marker id="vdar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="#cfd4de"/></marker></defs>
        <circle cx="${hx}" cy="${hy}" r="8" fill="#f6c56b" stroke="#1d2230" stroke-width="2"/>${T(hx, hy - 14, t('videos.home'), { fill: '#f6c56b', size: 12 })}
        ${T(cx - 50, 240, t('videos.day'))}${T(cx + 50, 240, t('videos.night'))}${T(540, 40, String(Math.floor(hr)).padStart(2, '0') + ':00', { fill: '#f6c56b', size: 22, w: 900 })}`, 'day and night');
    },
    shadow(s) {
      const g = 205, tx = 300, H = 112, ang = Math.PI * s.sun, sx = tx - Math.cos(ang) * 255, sy = g - 18 - Math.sin(ang) * 168;
      const elev = Math.atan2(g - sy, Math.abs(sx - tx) + 1), len = Math.min(270, H / Math.tan(Math.max(0.12, elev))), dir = sx < tx ? 1 : -1;
      const sky = s.sun < 0.12 || s.sun > 0.88 ? '#3a3350' : '#22426a';
      return sv(`<rect width="600" height="${g}" fill="${sky}"/><circle cx="${sx}" cy="${sy}" r="20" fill="#ffd66b"/><circle cx="${sx}" cy="${sy}" r="34" fill="#ffd66b" opacity=".18"/>
        <rect x="0" y="${g}" width="600" height="45" fill="#6b5a3a"/><ellipse cx="${tx + dir * len / 2}" cy="${g + 8}" rx="${len / 2 + 12}" ry="7" fill="#1a160f" opacity=".75"/>
        <rect x="${tx - 7}" y="${g - H + 40}" width="14" height="${H - 40}" fill="#7a5233"/><circle cx="${tx}" cy="${g - H + 30}" r="36" fill="#3f9a62"/><circle cx="${tx - 14}" cy="${g - H + 22}" r="12" fill="#5fbf80" opacity=".6"/>
        <line x1="${sx}" y1="${sy}" x2="${tx + dir * len}" y2="${g + 6}" stroke="#ffd66b" stroke-width="1" stroke-dasharray="4 5" opacity=".6"/>${T(40, 238, t('videos.east'), { a: 'start' })}${T(560, 238, t('videos.west'), { a: 'end' })}`, 'shadow of a tree');
    },
    thing(s) {
      const ic = { nail: '<rect x="-60" y="-7" width="120" height="14" rx="3" fill="#9aa3b2"/><rect x="-68" y="-20" width="14" height="40" rx="2" fill="#b8c0cc"/><path d="M60 -7 L80 0 L60 7z" fill="#9aa3b2"/>',
        coin: '<circle r="56" fill="#d9b44a"/><circle r="44" fill="none" stroke="#a8862e" stroke-width="4"/><text y="14" fill="#7a5f1a" font-family="Lato" font-weight="900" font-size="40" text-anchor="middle">₹5</text>',
        eraser: '<rect x="-60" y="-26" width="120" height="52" rx="8" fill="#e77a8a"/><rect x="10" y="-26" width="50" height="52" rx="8" fill="#4f7fd0"/>' }[s.k];
      return sv(`<ellipse cx="300" cy="190" rx="90" ry="12" fill="#000" opacity=".35"/><g transform="translate(300 120)">${ic}</g>`, s.k);
    },
    tank(s) {
      const O = { wood: [1, '<rect x="-26" y="-14" width="52" height="28" rx="3" fill="#b88a58"/><rect x="-26" y="-14" width="52" height="6" fill="#d4a774"/>'], leaf: [1, '<ellipse rx="24" ry="9" fill="#4caf6a"/><line x1="-22" x2="22" stroke="#2c7a45" stroke-width="2"/>'],
        bottle: [1, '<rect x="-12" y="-22" width="24" height="44" rx="8" fill="#bfe3ff" fill-opacity=".5" stroke="#e8f6ff"/><rect x="-5" y="-30" width="10" height="9" fill="#3a6fd8"/>'], stone: [0, '<ellipse rx="16" ry="12" fill="#8d8f96"/><ellipse cx="-5" cy="-4" rx="6" ry="3" fill="#b2b4ba"/>'],
        coin: [0, '<ellipse rx="13" ry="13" fill="#d9b44a" stroke="#a8862e" stroke-width="2"/>'], key: [0, '<circle cx="-12" r="9" fill="none" stroke="#c9a23c" stroke-width="5"/><rect x="-3" y="-3" width="28" height="6" fill="#c9a23c"/><rect x="16" y="2" width="5" height="8" fill="#c9a23c"/>'] };
      const all = [...(s.only || []), ...(s.extra || [])], n = all.length, surf = 78;
      const items = all.map((id, i) => { const kk = (s.extra || []).includes(id) ? (s.k2 ?? 1) : s.k, fl = s.top ? 1 : O[id][0], end = s.hold ? 150 : fl ? surf : 212, y = 28 + (end - 28) * ease(kk), x = 300 + (i - (n - 1) / 2) * Math.min(90, 480 / Math.max(1, n));
        return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${O[id][1]}</g>`; }).join('');
      return sv(`<rect x="40" y="70" width="520" height="160" rx="6" fill="#1d4a6b" opacity=".9"/><rect x="40" y="70" width="520" height="8" fill="#5fb3e6" opacity=".55"/><rect x="36" y="60" width="6" height="174" fill="#9fb4c8"/><rect x="558" y="60" width="6" height="174" fill="#9fb4c8"/><rect x="36" y="228" width="528" height="6" fill="#9fb4c8"/>${items}`, 'floating and sinking');
    },
    monsoon(s) {
      const k = s.k, cxv = s.lee ? 430 : 70 + Math.min(1, k / 0.8) * 190, cyv = s.lee ? 70 : 96 - ease(k) * 34, big = 26 + k * 20, rain = !s.dry && k > 0.6;
      let arrows = ''; for (let i = 0; i < 4; i++) { const x = 20 + ((k * 900 + i * 70) % 260); arrows += `<path d="M${x} ${150 + (i % 2) * 18} l18 0 m-7 -6 l7 6 l-7 6" fill="none" stroke="#e6e9f0" stroke-width="2.5" opacity=".8"/>`; }
      let drops = ''; if (rain) { const rx = s.lee ? 400 : 230; for (let i = 0; i < 16; i++) { const y = cyv + 24 + ((k * 2400 + i * 37) % 70); drops += `<line x1="${rx + (i * 17) % 90}" y1="${y}" x2="${rx - 4 + (i * 17) % 90}" y2="${y + 10}" stroke="#7cc7f0" stroke-width="2"/>`; } }
      return sv(`<rect width="600" height="250" fill="#22426a"/><circle cx="520" cy="40" r="20" fill="#ffd66b" opacity="${0.9 - k * 0.5}"/>
        <rect x="0" y="190" width="230" height="60" fill="#1e5b85"/><path d="M230 200 L300 92 L350 140 L380 120 L430 200 L600 205 L600 250 L230 250 Z" fill="#4c7a5a"/><path d="M300 92 L320 120 L284 118z" fill="#6aa37a"/>
        ${arrows}<g fill="${k > 0.5 ? '#9aa1b2' : '#e6e9f0'}"><circle cx="${cxv}" cy="${cyv}" r="${big * 0.8}"/><circle cx="${cxv + 26}" cy="${cyv - 10}" r="${big}"/><circle cx="${cxv + 54}" cy="${cyv}" r="${big * 0.75}"/></g>${drops}
        ${T(115, 236, t('videos.sea'), { fill: '#e6e9f0' })}${T(330, 236, t('videos.ghats'), { fill: '#e6e9f0' })}`, 'the monsoon');
    },
    digest(s) {
      const ORG = ['mouth', 'pipe', 'stomach', 'small', 'large'], hi = s.hi, col = o => o === hi ? '#f6c56b' : '#59606f';
      const coil = []; for (let r = 0; r < 4; r++) { coil.push([268, 168 + r * 13], [332, 168 + r * 13]); if (r < 3) coil.push([332, 174 + r * 13], [268, 174 + r * 13]); }
      const path = [[300, 46], [300, 62], [300, 112], [316, 126], [336, 138], [318, 150], [300, 160], ...coil.slice(0, 8), [248, 214], [248, 152], [352, 152], [352, 222], [300, 236]];
      const [fx, fy] = lerpPath(path, s.k);
      return sv(`<circle cx="300" cy="38" r="26" fill="#2a3040" stroke="#3a4152"/><rect x="226" y="72" width="148" height="172" rx="40" fill="#2a3040" stroke="#3a4152"/>
        <path d="M290 50 q10 6 20 0" fill="none" stroke="${col('mouth')}" stroke-width="5" stroke-linecap="round"/><path d="M300 60 V112" stroke="${col('pipe')}" stroke-width="7" stroke-linecap="round"/>
        <path d="M300 112 C340 106 352 140 330 152 C312 160 296 150 306 134" fill="none" stroke="${col('stomach')}" stroke-width="14" stroke-linecap="round"/>
        <path d="M248 214 V152 H352 V222" fill="none" stroke="${col('large')}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
        <polyline points="${coil.map(p => p.join(',')).join(' ')}" fill="none" stroke="${col('small')}" stroke-width="5" stroke-linejoin="round"/>
        <circle cx="${fx}" cy="${fy}" r="7" fill="#e9e6dc" stroke="#1d2230" stroke-width="2"/>
        ${ORG.map((o, i) => T(420, 70 + i * 34, t('videos.org.' + o), { a: 'start', fill: o === hi ? '#f6c56b' : '#9aa1b2', w: o === hi ? 900 : 700, size: o === hi ? 16 : 13 })).join('')}`, 'digestion');
    },
    breathe(s) {
      const k = s.k, rx = 34 + k * 12, ry = 54 + k * 10, dy = 190 + k * 18, cy = 168 + k * 30;
      const fl = s.flow ? [0, 1, 2].map(i => `<path d="M${120 + i * 26} ${s.flow === 'in' ? 40 : 70} l0 ${s.flow === 'in' ? 24 : -24} m-6 ${s.flow === 'in' ? -8 : 8} l6 ${s.flow === 'in' ? 8 : -8} l6 ${s.flow === 'in' ? -8 : 8}" fill="none" stroke="#7cc7f0" stroke-width="2.5"/>`).join('') + T(146, 100, t(s.flow === 'in' ? 'videos.bin' : 'videos.bout'), { fill: '#7cc7f0' }) : '';
      return sv(`<path d="M${200 - k * 10} 70 Q300 ${40 - k * 6} ${400 + k * 10} 70 L${410 + k * 12} 220 L${190 - k * 12} 220 Z" fill="#2a3040" stroke="#3a4152"/>
        <path d="M300 14 V86 M300 86 L262 104 M300 86 L338 104" stroke="#c9ced6" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="${300 - 18 - rx}" cy="140" rx="${rx}" ry="${ry}" fill="#d97a86" opacity=".9"/><ellipse cx="${300 + 18 + rx}" cy="140" rx="${rx}" ry="${ry}" fill="#d97a86" opacity=".9"/>
        ${s.dia !== false ? `<path d="M${196 - k * 12} ${dy} Q300 ${cy - 4} ${404 + k * 12} ${dy}" fill="none" stroke="#f6c56b" stroke-width="5" stroke-linecap="round"/>` : ''}${fl}
        ${T(470, 60, t('videos.wind'), { a: 'start' })}${T(470, 140, t('videos.lungs'), { a: 'start', fill: '#f0a5ae' })}${T(470, 214, t('videos.dia'), { a: 'start', fill: '#f6c56b' })}`, 'breathing');
    },
  };
  function scene(name, st) {
    const sim = SIMS.SIMS[name];
    if (sim) return sim.draw(Object.assign({}, sim.init, { tt: 900 }, st));
    return SC[name] ? SC[name](st || {}) : '';
  }

  // ---------- questions (shared by the player and the review queue) ----------
  const isOlder = p => p?.band === 'older';
  function rows(x, band) { return x.tl.filter(r => Array.isArray(r) ? !(band === 'young' && r[4]) : !(band === 'young' && r.p === 'why')); }
  function qlist(x) { // every question an explainer or clip can ask, in a fixed order (seed = 1000 + index)
    if (x.clip) return [x.q];
    const ps = x.tl.filter(r => !Array.isArray(r)).map(r => ({ q: r.q, o: r.o.map(o => Array.isArray(o[0]) ? o : [o]), why: r.why, kind: r.p }));
    return [...ps, ...x.recap.map(r => ({ q: r.q, o: r.o.map(o => [o]), why: r.why, kind: 'recap' })), { q: ['', ''], explain: true, o: x.explain.map(o => [o]), why: x.rule, kind: 'explain' }];
  }
  function makeQ(x, idx, r, band) {
    const all = qlist(x), qq = all[idx], order = r.shuffle(qq.o.map((_, i) => i)), young = band === 'young';
    const prompt = qq.explain ? t('videos.explain') : esc(L(qq.q));
    const choices = order.map(i => { const [txt, sc, st] = qq.o[i]; const pic = sc ? scene(sc, st) : null; return { v: i, html: esc(L(txt)), vis: pic, say: L(txt) }; });
    const lesson = x.lesson ? L(x.lesson) : [];
    return { kind: 'choice', prompt, promptText: qq.explain ? t('videos.explain') : L(qq.q), choices, answer: 0, pics: young && choices.every(c => c.vis), qkind: qq.kind,
      eyebrow: qq.kind === 'predict' ? t('videos.predict') : qq.kind === 'why' ? t('videos.why') : t('videos.recap'),
      say: [{ text: (qq.explain ? t('videos.explain') : L(qq.q)) + '. ' + choices.map(c => c.say).join(', '), lang: I18N.lang }],
      hints: [{ text: lesson[0] || L(qq.why) }, { text: L(qq.why) }, { text: L(qq.o[0][0]) }], hintRevealsAnswer: true,
      answerText: esc(L(qq.o[0][0])), why: { steps: [{ text: esc(L(qq.why)) }], rule: x.rule ? esc(L(x.rule)) : undefined } };
  }
  [...X, ...C].forEach(x => Engine.skill({ id: 'vid.' + x.id, subject: 'science', topic: 'videos', name: 'videos.n.' + x.id, bands: { young: [1, 1], older: [1, 2] }, warm: false,
    gen(lvl, r, ctx) { const n = qlist(x).length, i = ctx.seed >= 1000 && ctx.seed - 1000 < n ? ctx.seed - 1000 : r.int(0, n - 1); return makeQ(x, i, r, ctx.band); } }));

  // ---------- progress ----------
  const ext = p => { p.extras = p.extras || {}; return (p.extras.videos ||= { watched: [], last: {} }); };
  const watched = p => p?.extras?.videos?.watched || [];
  function answer(p, x, idx, ok) {
    const sk = Engine.SK['vid.' + x.id], seed = 1000 + idx;
    Store.record(p, 'science', sk, { key: `vid.${x.id}|1|${seed}`, lvl: 1, seed }, ok);
  }

  // ---------- library ----------
  const online = () => navigator.onLine !== false && !native();
  function library(main) {
    const p = Store.current(), w = watched(p);
    const list = X.filter(x => !x.older || isOlder(p));
    main.innerHTML = `<section class="page vid" data-subject="science"><a class="backlink" href="#/s/science"><svg class="k-icon"><use href="#i-back"/></svg>${t('subj.science.title')}</a>
      <p class="eyebrow">${t('games.title')}</p><h1>${t('videos.title')}</h1><p class="lede">${t('videos.blurb')}</p>
      <h2 class="section">${t('videos.made')}</h2><p class="muted small">${t('videos.madeSub')}</p>
      <ul class="vid-grid">${list.map(x => { const r0 = rows(x, AGE.band(p)).find(Array.isArray); const secs = Math.round(rows(x, AGE.band(p)).filter(Array.isArray).reduce((a, r) => a + r[2], 0));
        return `<li><a class="vid-card" href="#/videos/${x.id}"><span class="board vid-thumb" aria-hidden="true">${scene(r0[0], r0[1](0.6))}</span><span class="vid-meta"><b>${esc(L(x.title))}</b><span class="small muted">${esc(L(x.blurb))}</span><span class="vid-tags"><span class="small muted">${t('videos.secs', { n: secs })}</span>${w.includes(x.id) ? `<span class="k-badge k-badge-success k-badge-pill">${t('videos.watched')}</span>` : ''}</span></span></a></li>`; }).join('')}</ul>
      ${C.length ? `<h2 class="section">${t('videos.real')}</h2><p class="muted small">${t('videos.realSub')}</p>${online() ? '' : `<p class="vid-note" role="status">${t(native() ? 'videos.inApp' : 'videos.needsNet')}</p>`}
      <ul class="vid-grid">${C.map(c => `<li><a class="vid-card" href="#/videos/${c.id}"><span class="vid-thumb photo" aria-hidden="true"><img src="${c.poster}" alt="" loading="lazy"></span><span class="vid-meta"><b>${esc(L(c.title))}</b><span class="small muted">${esc(L(c.blurb))}</span><span class="vid-tags"><span class="small muted">${t('videos.secs', { n: Math.round(c.dur) })}</span>${w.includes(c.id) ? `<span class="k-badge k-badge-success k-badge-pill">${t('videos.watched')}</span>` : ''}</span><span class="vid-credit">${esc(c.author)} · ${esc(c.lic)}</span></span></a></li>`).join('')}</ul>` : ''}
    </section>`;
  }

  // ---------- player ----------
  let S = null;
  const ccPref = () => { try { return JSON.parse(localStorage.getItem('kalvi.vid.cc') || 'null'); } catch { return null; } };
  const ccSave = v => { try { localStorage.setItem('kalvi.vid.cc', JSON.stringify(v)); } catch {} };
  function controls() {
    return `<div class="vp-ctrls" role="group" aria-label="${t('videos.title')}">
      <button type="button" class="k-btn k-btn-primary k-btn-lg vp-play" data-a="play" aria-label="${t('videos.play')}"><svg class="k-icon" aria-hidden="true"><use href="#i-next"/></svg><span>${t('videos.play')}</span></button>
      <button type="button" class="k-btn k-btn-outline pill" data-a="back"><svg class="k-icon" aria-hidden="true"><use href="#i-undo"/></svg>${t('videos.back10')}</button>
      <button type="button" class="k-btn k-btn-outline pill" data-a="cc" aria-pressed="true">${t('videos.cc')}</button>
      <div class="seg" role="group" aria-label="${t('videos.ccLang')}"><button type="button" data-cl="en" lang="en">EN</button><button type="button" data-cl="ta" lang="ta">தமிழ்</button></div>
      <div class="seg" role="group" aria-label="${t('videos.speed')}"><button type="button" data-sp="0.75">0.75×</button><button type="button" data-sp="1">1×</button></div>
      <button type="button" class="k-btn k-btn-outline pill" data-a="full">${t('videos.full')}</button></div>`;
  }
  function shell(main, x, stage) {
    main.innerHTML = `<section class="page vid" data-subject="science"><a class="backlink" href="#/videos"><svg class="k-icon"><use href="#i-back"/></svg>${t('videos.library')}</a>
      <p class="eyebrow">${t('videos.title')}</p><h1>${esc(L(x.title))}</h1>
      <div class="vp" id="vp"><div class="vp-stage ${x.clip ? 'clip' : 'board'}" id="stage">${stage}</div>
        <div class="vp-bar"><div class="vp-prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="${t('videos.title')}"><span></span></div><span class="mono small vp-time">0:00</span></div>
        <p class="vp-cap" id="cap" aria-live="polite"></p>${controls()}</div>
      <div id="panel" class="vp-panel"></div>${x.clip ? `<p class="vid-credit">${t('videos.clipBy', { a: esc(x.author), l: esc(x.lic) })} · <a href="${x.page}" target="_blank" rel="noopener">${t('videos.source')}</a></p>` : ''}</section>`;
  }
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function syncCtrls(main) {
    const pb = main.querySelector('.vp-ctrls [data-a="play"]'); if (!pb) return;
    pb.querySelector('span').textContent = S.playing ? t('videos.pause') : t('videos.play'); pb.setAttribute('aria-label', S.playing ? t('videos.pause') : t('videos.play'));
    pb.querySelector('use').setAttribute('href', S.playing ? '#i-minus' : '#i-next');
    main.querySelector('[data-a="cc"]').setAttribute('aria-pressed', S.cc);
    main.querySelectorAll('[data-cl]').forEach(b => b.setAttribute('aria-pressed', b.dataset.cl === S.cl));
    main.querySelectorAll('[data-sp]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.sp === S.speed));
    const cap = main.querySelector('#cap'); cap.hidden = !S.cc;
  }
  function bindCtrls(main, api) {
    main.querySelectorAll('[data-a]').forEach(b => b.onclick = () => api[b.dataset.a]());
    main.querySelectorAll('[data-cl]').forEach(b => b.onclick = () => { S.cl = b.dataset.cl; ccSave({ cc: S.cc, cl: S.cl }); api.cap(); syncCtrls(main); });
    main.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { S.speed = +b.dataset.sp; api.speed?.(); syncCtrls(main); });
    syncCtrls(main);
  }
  function fullscreen(el) {
    const d = document; if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
  }
  function newState(x, p) { const pref = ccPref() || {}; return { id: x.id, x, p, band: AGE.band(p), playing: false, speed: 1, cc: pref.cc ?? true, cl: pref.cl || I18N.lang, pos: 0, done: {}, stage: 'play', t0: Date.now(), right: 0, n: 0, ri: 0, raf: 0 }; }

  // explainer timeline
  function explainer(main, x) {
    const p = Store.current(); if (!S || S.id !== x.id) S = newState(x, p);
    const R = rows(x, S.band), qs = qlist(x), dur = r => Array.isArray(r) ? r[2] : 0, total = R.reduce((a, r) => a + dur(r), 0);
    const at = pos => { let a = 0, lastA = 0;
      for (let i = 0; i < R.length; i++) { const d = dur(R[i]);
        if (!d) { if (!S.done[i] && pos >= a) return { i, k: 0 }; continue; }
        if (pos < a + d) return { i, k: (pos - a) / d }; lastA = i; a += d; }
      return { i: lastA, k: 1 }; };
    const r0 = R.find(Array.isArray);
    shell(main, x, scene(r0[0], r0[1](0)) + `<button type="button" class="vp-big" data-a="play" aria-label="${t('videos.play')}"><svg class="k-icon" aria-hidden="true"><use href="#i-next"/></svg></button>`);
    const stage = main.querySelector('#stage'), cap = main.querySelector('#cap'), bar = main.querySelector('.vp-prog'), time = main.querySelector('.vp-time'), panel = main.querySelector('#panel');
    let lastRow = -1, lastK = -1; if (!S.pos) cap.textContent = t('videos.pressPlay');
    const capRow = () => { const r = R[lastRow]; if (!Array.isArray(r)) return; cap.textContent = r[3][S.cl === 'ta' ? 1 : 0]; cap.lang = S.cl; };
    const draw = () => {
      const { i, k } = at(S.pos), r = R[i];
      if (Array.isArray(r)) { const kk = RM() ? Math.round(k * 3) / 3 : k; if (i !== lastRow || kk !== lastK) { stage.innerHTML = scene(r[0], r[1](kk)); lastK = kk; } if (i !== lastRow) { lastRow = i; capRow(); if (S.playing) Voice.play([{ text: L(r[3]), lang: I18N.lang }], null, { rate: 0.9 * S.speed }); } }
      const pc = Math.round(Math.min(1, S.pos / total) * 100); bar.firstElementChild.style.width = pc + '%'; bar.setAttribute('aria-valuenow', pc); time.textContent = `${fmt(S.pos)} / ${fmt(total)}`;
      return { i, r };
    };
    const stop = () => { S.playing = false; cancelAnimationFrame(S.raf); syncCtrls(main); };
    const tick = () => {
      let last = performance.now();
      const step = now => { if (!document.body.contains(stage) || !S.playing) return; S.pos += Math.min(0.1, (now - last) / 1000) * S.speed; last = now;
        const { i, r } = draw();
        if (!Array.isArray(r) && !S.done[i]) { stop(); Voice.stop(); ask(i); return; }
        if (S.pos >= total) { S.pos = total; draw(); stop(); finish(); return; }
        S.raf = requestAnimationFrame(step); };
      S.raf = requestAnimationFrame(step);
    };
    const api = {
      play() { if (S.stage !== 'play') return; if (S.playing) { stop(); Voice.stop(); return; } main.querySelector('.vp-big')?.remove(); S.playing = true; syncCtrls(main); lastRow = -1; tick(); },
      back() { if (S.stage !== 'play') return; S.pos = Math.max(0, S.pos - 10); lastRow = -1; draw(); },
      cc() { S.cc = !S.cc; ccSave({ cc: S.cc, cl: S.cl }); syncCtrls(main); }, cap: capRow, full: () => fullscreen(main.querySelector('#vp')), speed() { },
    };
    // a pause point: question → feedback → continue
    function ask(ri) {
      S.stage = 'pause'; const pr = R[ri], idx = x.tl.filter(r => !Array.isArray(r)).indexOf(pr);
      cap.textContent = t(pr.p === 'predict' ? 'videos.predict' : 'videos.why');
      question(panel, p, x, idx, null, () => { S.done[ri] = true; S.stage = 'play'; panel.innerHTML = ''; if (S.pos >= total) finish(); else api.play(); }, t('videos.go'));
    }
    function finish() {
      S.stage = 'lesson'; cap.textContent = t('videos.lesson');
      panel.innerHTML = `<article class="lessoncard vid-lesson" tabindex="-1"><p class="eyebrow">${t('videos.lesson')}</p><ol class="steps">${x.lesson.map((s, i) => `<li class="step"><span class="step-n">${i + 1}</span><div class="step-body"><p>${esc(L(s))}</p></div></li>`).join('')}</ol><p class="lc-rule">${esc(L(x.rule))}</p>
        <div class="row-actions">${Engine.listenBtn('vlisten')}<button type="button" class="k-btn k-btn-primary" id="toRecap">${t('videos.startRecap')}</button></div></article>`;
      Engine.bindListen(panel.querySelector('.vlisten'), () => [{ text: L(x.lesson).join(' ') + ' ' + L(x.rule), lang: I18N.lang }]);
      panel.querySelector('#toRecap').onclick = () => recap(0);
      panel.querySelector('.lessoncard').focus();
    }
    function recap(n) {
      S.stage = 'recap'; const np = x.tl.filter(r => !Array.isArray(r)).length, older = S.band === 'older';
      const idxs = [np, np + 1, older ? np + 3 : np + 2]; // older: the third is the "explain in your own words" pick
      if (n >= 3) return done();
      question(panel, p, x, idxs[n], t('videos.qn', { a: n + 1, b: 3 }), () => recap(n + 1), n < 2 ? t('videos.next') : t('common.done'));
    }
    function done() {
      S.stage = 'done'; const e = ext(p); if (!e.watched.includes(x.id)) e.watched.push(x.id); e.last[x.id] = { date: Store.today(), right: S.right, n: S.n };
      Store.logSession(p, { subject: 'science', topic: 'videos', mode: 'video', n: S.n, right: S.right, ms: Date.now() - S.t0 });
      panel.innerHTML = `<article class="k-card vid-done" tabindex="-1"><p class="eyebrow">${t('videos.recap')}</p><p class="bignum">${S.right}/${S.n}</p><p>${t('videos.score', { a: S.right, b: S.n })}</p>
        <div class="row-actions"><button type="button" class="k-btn k-btn-outline pill" id="again">${t('videos.again')}</button><a class="k-btn k-btn-primary" href="#/videos">${t('videos.library')}</a></div></article>`;
      panel.querySelector('#again').onclick = () => { S = null; explainer(main, x); };
      panel.querySelector('.vid-done').focus();
    }
    bindCtrls(main, api);
    if (S.pos > 0) draw();
  }

  // one question in the panel; picture choices for young, Listen reads it
  function question(panel, p, x, idx, eyebrow, onNext, nextLabel) {
    const q = Engine.build({ skill: 'vid.' + x.id, lvl: 1, seed: 1000 + idx }, p), pics = q.pics && S.band === 'young';
    panel.innerHTML = `<article class="k-card vid-q" aria-labelledby="vq"><div class="lesson-head"><p class="eyebrow">${eyebrow || q.eyebrow}</p>${Engine.listenBtn('vqlisten')}</div><h2 id="vq">${q.prompt}</h2>
      <div class="choices ${pics ? 'vid-pics' : ''}" role="radiogroup" aria-labelledby="vq">${q.choices.map(c => `<button type="button" class="choice" role="radio" aria-checked="false" data-v="${c.v}">${pics ? `<span class="board vid-pic" aria-hidden="true">${c.vis}</span>` : ''}<span>${c.html}</span></button>`).join('')}</div><div id="vfb" aria-live="polite"></div></article>`;
    Engine.bindListen(panel.querySelector('.vqlisten'), () => q.say);
    if (S.band === 'young') Voice.play(q.say, null, {});
    panel.querySelector('.choice').focus({ preventScroll: true }); panel.querySelector('.vid-q').scrollIntoView({ block: 'nearest', behavior: RM() ? 'auto' : 'smooth' });
    panel.querySelectorAll('[data-v]').forEach(b => b.onclick = () => {
      const ok = +b.dataset.v === q.answer; S.n++; if (ok) S.right++;
      panel.querySelectorAll('[data-v]').forEach(c => { c.disabled = true; c.setAttribute('aria-checked', c === b); if (+c.dataset.v === q.answer) c.classList.add('is-right'); else if (c === b) c.classList.add('is-wrong'); });
      answer(p, x, idx, ok);
      panel.querySelector('#vfb').innerHTML = `<article class="lessoncard ${ok ? 'ok' : 'miss'}" tabindex="-1"><header class="lc-head"><span class="lc-mark"><svg class="k-icon"><use href="#${ok ? 'i-check' : 'i-dot'}"/></svg></span><div><p class="lc-status">${ok ? t('pr.right') : t('pr.wrong')}</p><p class="lc-answer">${t('pr.answerIs', { a: `<strong>${q.answerText}</strong>` })}</p></div></header>
        <p>${q.why.steps[0].text}</p><div class="row-actions"><button type="button" class="k-btn k-btn-primary" id="vnext">${nextLabel}</button></div></article>`;
      Voice.play([{ text: q.why.steps[0].text.replace(/<[^>]+>/g, ''), lang: I18N.lang }], null, {});
      const nb = panel.querySelector('#vnext'); nb.onclick = () => { Voice.stop(); onNext(ok); }; nb.focus();
    });
  }

  // real clip
  function clip(main, x) {
    const p = Store.current(); if (!S || S.id !== x.id) S = newState(x, p);
    if (!online()) {
      shell(main, x, `<img src="${x.poster}" alt="">`);
      main.querySelector('.vp-ctrls').remove(); main.querySelector('.vp-bar').remove(); main.querySelector('#cap').remove();
      main.querySelector('#panel').innerHTML = `<p class="vid-note" role="status">${t(native() ? 'videos.inApp' : 'videos.needsNet')}</p><a class="k-btn k-btn-outline pill" href="#/videos">${t('videos.library')}</a>`;
      return;
    }
    shell(main, x, `<video preload="none" playsinline poster="${x.poster}" src="${x.src}" aria-label="${esc(L(x.title))}"></video><button type="button" class="vp-big" data-a="play" aria-label="${t('videos.play')}"><svg class="k-icon" aria-hidden="true"><use href="#i-next"/></svg></button>`);
    const v = main.querySelector('video'), cap = main.querySelector('#cap'), bar = main.querySelector('.vp-prog'), time = main.querySelector('.vp-time'), panel = main.querySelector('#panel');
    const cue = () => { const c = [...x.cues].reverse().find(c => v.currentTime >= c[0]); cap.textContent = c ? c[1][S.cl === 'ta' ? 1 : 0] : ''; cap.lang = S.cl; };
    v.ontimeupdate = () => { const d = v.duration || x.dur, pc = Math.round(v.currentTime / d * 100); bar.firstElementChild.style.width = pc + '%'; bar.setAttribute('aria-valuenow', pc); time.textContent = `${fmt(v.currentTime)} / ${fmt(d)}`; cue(); };
    v.onplay = () => { S.playing = true; syncCtrls(main); }; v.onpause = () => { S.playing = false; syncCtrls(main); };
    v.onended = () => { if (S.stage !== 'play') return; S.stage = 'q'; cap.textContent = t('videos.ended');
      question(panel, p, x, 0, t('videos.why'), () => { const e = ext(p); if (!e.watched.includes(x.id)) e.watched.push(x.id); e.last[x.id] = { date: Store.today(), right: S.right, n: S.n };
        Store.logSession(p, { subject: 'science', topic: 'videos', mode: 'clip', n: S.n, right: S.right, ms: Date.now() - S.t0 }); location.hash = '#/videos'; }, t('common.done')); };
    const api = { play() { main.querySelector('.vp-big')?.remove(); if (v.paused) { v.playbackRate = S.speed; v.play().catch(() => {}); } else v.pause(); }, back() { v.currentTime = Math.max(0, v.currentTime - 10); },
      cc() { S.cc = !S.cc; ccSave({ cc: S.cc, cl: S.cl }); syncCtrls(main); }, cap: cue, full: () => fullscreen(main.querySelector('#vp')), speed() { v.playbackRate = S.speed; } };
    bindCtrls(main, api); cue(); if (!cap.textContent) cap.textContent = t('videos.pressPlay');
  }

  function player(main, id) {
    const x = byId[id]; if (!x) { main.innerHTML = `<section class="page"><p>${t('videos.notFound')}</p><a href="#/videos">${t('videos.library')}</a></section>`; return; }
    Voice.stop(); (x.clip ? clip : explainer)(main, x);
  }
  window.ROUTES = window.ROUTES || {};
  ROUTES.videos = {
    render(main, parts) { if (S?.raf) cancelAnimationFrame(S.raf); if (parts[1]) player(main, parts[1]); else { S = null; Voice.stop(); library(main); } },
    keys(e) {
      if (!S || e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(e.target.tagName)) return;
      const k = e.key.toLowerCase(), b = s => document.querySelector(`.vp [data-a="${s}"]`);
      if (k === ' ' || k === 'k') { e.preventDefault(); b('play')?.click(); } else if (k === 'arrowleft' || k === 'j') b('back')?.click(); else if (k === 'c') b('cc')?.click(); else if (k === 'f') b('full')?.click();
    },
  };
  window.VIDEOS = {
    game: { title: 'videos.title', blurb: 'videos.blurb', icon: 'i-science', start() { S = null; location.hash = '#/videos'; } },
    watched, scene, qlist,
    credits: () => C.map(c => ({ title: c.file.replace(/^File:/, ''), credit: `${c.author} · ${c.lic} · Wikimedia Commons`, href: c.page })),
  };
})();
