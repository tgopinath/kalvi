// Play layer: sound palette, tactile feedback, subject scenes, journey stops, stars, stickers, rewards and the narrator.
// Everything here is optional sugar on top of the learning engine: sound can be switched off in the header and all
// motion becomes a fade under prefers-reduced-motion.
(function () {
  const esc = Engine.esc, RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  I18N.add({ play: {
    sound: ['Sound', 'ஒலி'], soundOn: ['Sound on', 'ஒலி இயக்கத்தில்'], soundOff: ['Sound off', 'ஒலி அணைப்பில்'],
    startToday: ['Start today’s play', 'இன்றைய விளையாட்டைத் தொடங்கு'], startTodayBody: ['A short mix from all four subjects.', 'நான்கு பாடங்களிலிருந்தும் ஒரு சிறிய கலவை.'],
    continue: ['Carry on', 'தொடர்ந்து செய்'], goal: ['{a} of {b} today', 'இன்று {b}-இல் {a}'], stars: ['{n} stars', '{n} நட்சத்திரங்கள்'], starsOf: ['{a} of {b} stars', '{b} நட்சத்திரங்களில் {a}'],
    play: ['Play', 'விளையாடு'], stickers: ['Sticker book', 'ஸ்டிக்கர் புத்தகம்'], stickersBody: ['Finish topics and keep your streak to collect real-photo stickers.', 'தலைப்புகளை முடித்து, தொடர் நாட்களைக் காத்து, உண்மைப் படஸ்டிக்கர்களைச் சேகரி.'],
    newSticker: ['New sticker', 'புதிய ஸ்டிக்கர்'], locked: ['Not yet', 'இன்னும் இல்லை'], streakKolam: ['Your kolam grows a little every day you play.', 'நீ விளையாடும் ஒவ்வொரு நாளும் உன் கோலம் சற்று வளரும்.'],
    shelf: ['Games', 'விளையாட்டுகள்'], subjects: ['Pick a world', 'ஓர் உலகத்தைத் தேர்ந்தெடு'], hi: { morning: ['Good morning, {name}', 'காலை வணக்கம், {name}'], afternoon: ['Good afternoon, {name}', 'மதிய வணக்கம், {name}'], evening: ['Good evening, {name}', 'மாலை வணக்கம், {name}'] },
    cheer: { right: [['Yes! You got it.', 'ஆமாம்! சரியாகச் சொன்னாய்.'], ['Lovely work.', 'அருமை.'], ['That’s it!', 'அதுதான்!']], wrong: [['Nearly! Let’s see why.', 'கிட்டத்தட்ட! ஏன் என்று பார்ப்போம்.'], ['Good try. Here’s the trick.', 'நல்ல முயற்சி. இதோ வழி.'], ['Almost there. Look at this.', 'இன்னும் கொஞ்சம். இதைப் பார்.']] },
    guide: {
      home: ['Tap the big card to start today’s play.', 'இன்றைய விளையாட்டைத் தொடங்கப் பெரிய அட்டையைத் தட்டு.'],
      maths: ['Tap the glowing stop to play the next maths game.', 'அடுத்த கணக்கு விளையாட்டுக்கு ஒளிரும் நிறுத்தத்தைத் தட்டு.'], english: ['Tap the glowing stop to play with letters and words.', 'எழுத்துகளுடனும் சொற்களுடனும் விளையாட ஒளிரும் நிறுத்தத்தைத் தட்டு.'],
      science: ['Tap the glowing stop to try the next experiment.', 'அடுத்த சோதனையைச் செய்ய ஒளிரும் நிறுத்தத்தைத் தட்டு.'], world: ['Tap the glowing stop to explore the world.', 'உலகத்தை ஆராய ஒளிரும் நிறுத்தத்தைத் தட்டு.'],
      round: ['Look, listen, then choose your answer.', 'பார், கேள், பிறகு உன் பதிலைத் தேர்ந்தெடு.'], topic: ['Move the pieces to see how it works, then press Play.', 'இது எப்படி வேலை செய்கிறது என்று பார்க்கத் துண்டுகளை நகர்த்து, பிறகு விளையாடு.'],
    },
    mascot: { title: ['Mascot options (preview only)', 'சின்னத் தேர்வுகள் (முன்னோட்டம் மட்டும்)'], elephant: ['Clay elephant', 'களிமண் யானை'], pen: ['Brass kolam pen', 'பித்தளைக் கோலப் பேனா'], owl: ['Sculpted owl', 'செதுக்கிய ஆந்தை'], sprout: ['Little sprout', 'சிறு முளை'] },
  } });

  // ---------- sound palette (Web Audio synth) ----------
  let ac = null, on = (() => { try { return localStorage.getItem('kalvi.sound') !== 'off'; } catch { return true; } })();
  const ctx = () => { try { ac ||= new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac; } catch { return null; } };
  function tone(f, t0, dur, type = 'sine', vol = .12, slide = 0) { const c = ctx(); if (!c) return; const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, c.currentTime + t0); if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, c.currentTime + t0 + dur); g.gain.setValueAtTime(0, c.currentTime + t0); g.gain.linearRampToValueAtTime(vol, c.currentTime + t0 + .012); g.gain.exponentialRampToValueAtTime(.0008, c.currentTime + t0 + dur); o.connect(g).connect(c.destination); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur + .02); }
  const SFX = {
    tap: () => tone(880, 0, .05, 'triangle', .05),
    correct: () => { tone(660, 0, .14, 'sine', .12); tone(990, .09, .22, 'sine', .1); },
    wrong: () => { tone(330, 0, .16, 'triangle', .07, .9); },
    star: () => { [1320, 1760, 2093].forEach((f, i) => tone(f, i * .06, .18, 'sine', .07)); },
    unlock: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .08, .3, 'triangle', .08)); },
    page: () => { const c = ctx(); if (!c) return; const b = c.createBuffer(1, c.sampleRate * .08, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) * .25; const s = c.createBufferSource(), f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2200; s.buffer = b; s.connect(f).connect(c.destination); s.start(); },
    levelup: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * .09, .35, 'sine', .09)); },
  };
  const sfx = k => { if (on) try { SFX[k]?.(); } catch {} };
  const buzz = ms => { try { if (on) navigator.vibrate?.(ms); } catch {} };
  function setSound(v) { on = v; try { localStorage.setItem('kalvi.sound', v ? 'on' : 'off'); } catch {} paintToggle(); }
  function paintToggle() { const b = document.getElementById('soundBtn'); if (!b) return; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? t('play.soundOn') : t('play.soundOff')); b.innerHTML = `<svg class="k-icon"><use href="#${on ? 'i-sound' : 'i-mute'}"/></svg>`; }

  // global tactile feedback: press-down + click + tiny haptic on every button-like element
  document.addEventListener('pointerdown', e => { const b = e.target.closest('button, a.k-btn, .stop, .gamecard, .subjtile, .choice, .tile, .mem-card'); if (!b || b.disabled) return; b.classList.add('pressing'); sfx('tap'); buzz(6); }, true);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => document.addEventListener(ev, e => e.target.closest?.('.pressing')?.classList.remove('pressing'), true));
  // ages 3–6: tapping a picture or a line of text reads it aloud
  document.addEventListener('click', e => {
    const p = Store.current(); if (!p || p.band !== 'young' || !on) return;
    const el = e.target.closest('.qprompt, .lesson-body, .caption, .step-body p, .lc-answer, .stop-name, .subjtile b, .wordpic img, .board img, .speechcard p');
    if (!el || e.target.closest('button, a, input')) return;
    const txt = (el.alt || el.textContent || '').trim(); if (txt) Voice.play([{ text: txt, lang: el.closest('[lang="en"]') ? 'en' : I18N.lang }], null, {});
  });

  // ---------- art for journey stops (rendered 3D objects) ----------
  const tileArt = (txt, col) => { const S = R3.Scene({ yaw: -28, pitch: 26, scale: 22 }); S.group(0).shadow(0, 0, 0, 1.4, 1.4); S.group(1).box(-1, -1, 0, 2, 2, 2, col, { topDecal: P => { const c = P([0, 0, 2.01]); return `<text x="${c[0]}" y="${c[1] + 2}" font-family="Lato" font-weight="900" font-size="22" fill="#fff" text-anchor="middle" dominant-baseline="middle" transform="translate(${c[0]} ${c[1]}) scale(1 .55) translate(${-c[0]} ${-c[1]})">${esc(txt)}</text>`; }, frontDecal: P => { const c = P([0, -1.01, 1]); return `<text x="${c[0]}" y="${c[1]}" font-family="Lato" font-weight="900" font-size="30" fill="#fff" text-anchor="middle" dominant-baseline="middle">${esc(txt)}</text>`; } }); return S.svg(txt); };
  const sphereArt = (cols) => { const S = R3.Scene({ yaw: 0, pitch: 30, scale: 20 }); cols.forEach((c, i) => S.group(1).shadow(i * 1.3 - (cols.length - 1) * .65, 0, 0, .6, .6).sphere(i * 1.3 - (cols.length - 1) * .65, 0, .6, .6, c)); return S.svg(''); };
  const photoArt = key => { const ph = window.PHOTOS?.[key] || window.PICS?.[key] || window.GK?.photo?.(key); return ph ? `<img src="${ph.src}" alt="" loading="lazy">` : ''; };
  function stopArt(subject, id) {
    const V = VIS;
    if (subject === 'maths') return ({ count: () => sphereArt(['#e2a336', '#e2a336', '#16a39c']), place: () => V.blocks({ t: 2, o: 3 }), add: () => tileArt('+', '#16a39c'), sub: () => tileArt('−', '#d04b86'), mul: () => V.array({ r: 3, c: 3 }), div: () => V.plates({ k: 2, each: 3 }), frac: () => V.fractionDisc({ n: 4, k: 1 }), shapes: () => V.solid('pyramid', -30), measure: () => V.clock({ h: 3, m: 0 }) }[id] || (() => tileArt('?', '#16a39c')))();
    if (subject === 'english') return ({ sounds: () => tileArt('a', '#a15c00'), blend: () => tileArt('cat', '#b8701a'), sight: () => tileArt('the', '#8f4d00'), vocab: () => photoArt('mango') || tileArt('ab', '#a15c00'), spell: () => tileArt('ABC', '#a15c00'), read: () => photoArt('book') || tileArt('Aa', '#a15c00'), grammar: () => tileArt('.', '#8f4d00') }[id] || (() => tileArt('A', '#a15c00')))();
    if (subject === 'science') { const k = { forces: 'ramp', light: 'prism', sound: 'sound', magnets: 'magnet', electricity: 'circuit', matter: 'matter', water: 'water', weather: 'breeze', space: 'moon', machines: 'lever', living: 'plant' }[id]; const ph = { light: 'rainbow', water: 'clouds', weather: 'lightning', living: 'leaf', space: 'moon', magnets: 'iron' }[id]; return (ph && photoArt(ph)) || (k ? SIMS.snap(k, SIMS.SIMS[k].tries[0]) : tileArt('?', '#4338ca')); }
    const wp = { india: 'tajmahal', tamilnadu: 'thanjavur', scientists: 'kalam', space: 'moon', wonders: 'tajmahal', safety: 'traffic', nature: 'elephant', geo: 'earth' }[id];
    return (wp && photoArt(wp)) || photoArt(id) || tileArt('◎', '#b8236f');
  }

  // ---------- stars, goal, streak kolam ----------
  const starsFor = (p, tp) => { const ids = tp.skills.filter(id => Engine.SK[id]); if (!ids.length) return 0; const m = ids.reduce((a, id) => a + (Store.skill(p, tp.subject, id).m || 0), 0) / ids.length; return m >= .85 ? 3 : m >= .55 ? 2 : (m > .15 || p.subjects[tp.subject].lessons[tp.id]) ? 1 : 0; };
  const starRow = (n, max = 3) => `<span class="starrow" aria-label="${t('play.starsOf', { a: n, b: max })}">${Array.from({ length: max }, (_, i) => `<svg class="star ${i < n ? 'on' : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>`).join('')}</span>`;
  const todayCount = p => p.sessions.filter(s => s.date === Store.today()).length;
  function ring(a, b) { const r = 26, c = 2 * Math.PI * r, f = Math.min(1, a / b); return `<svg class="goalring" viewBox="0 0 64 64" role="img" aria-label="${t('play.goal', { a, b })}"><circle cx="32" cy="32" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="7"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c * f} ${c}" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" font-family="Lato" font-weight="900" font-size="16" fill="currentColor">${a}/${b}</text></svg>`; }
  function kolam(days) { // a pulli kolam that gains loops with every streak day (up to 25 dots)
    const n = Math.min(5, 1 + Math.ceil(Math.sqrt(Math.max(1, days)))), g = 22, o = 16, W = o * 2 + g * (n - 1); let s = `<svg class="kolam" viewBox="0 0 ${W} ${W}" role="img" aria-label="${t('play.streakKolam')}">`;
    let k = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = o + i * g, y = o + j * g; s += `<circle cx="${x}" cy="${y}" r="2.4" fill="currentColor"/>`; if (k++ < days) s += `<path d="M${x} ${y - 9} Q${x + 9} ${y - 9} ${x + 9} ${y} Q${x + 9} ${y + 9} ${x} ${y + 9} Q${x - 9} ${y + 9} ${x - 9} ${y} Q${x - 9} ${y - 9} ${x} ${y - 9}Z" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".85"/>`; }
    return s + '</svg>';
  }

  // ---------- stickers ----------
  const STICKERS = [['elephant', 'PICS'], ['tiger', 'PICS'], ['peacock', 'PICS'], ['parrot', 'PICS'], ['butterfly', 'PICS'], ['frog', 'PICS'], ['mango', 'PICS'], ['flower', 'PICS'], ['moon', 'PICS'], ['rainbow', 'PHOTOS'], ['lightning', 'PHOTOS'], ['leaf', 'PHOTOS'], ['zebra', 'PICS'], ['monkey', 'PICS'], ['ship', 'PICS'], ['kite', 'PICS'], ['tree', 'PICS'], ['star', 'PICS']];
  const stickerSrc = ([k, src]) => (window[src] || {})[k]?.src;
  function earnedCount(p) { const topics = Object.values(App.SUBJ).flatMap(s => s.topics); const done = topics.filter(tp => starsFor(p, tp) >= 2).length; const st = Store.streak(p); return Math.min(STICKERS.length, done + (st >= 3) + (st >= 7) + (st >= 14) + (p.sessions.length >= 1)); }
  function checkStickers(p) { p.extras = p.extras || {}; const had = p.extras.stickers || 0, now = earnedCount(p); if (now > had) { p.extras.stickers = now; Store.save(); return STICKERS[now - 1]; } return null; }
  function stickerBook(main) {
    const p = Store.current(), n = earnedCount(p);
    main.innerHTML = `<section class="page stickers world-today"><a class="backlink" href="#/"><svg class="k-icon"><use href="#i-back"/></svg>${t('nav.today')}</a><h1 class="big">${t('play.stickers')}</h1><p class="lede">${t('play.stickersBody')}</p>
      <div class="stickergrid">${STICKERS.map((s, i) => `<div class="sticker ${i < n ? 'got' : ''}">${i < n && stickerSrc(s) ? `<img src="${stickerSrc(s)}" alt="${esc(s[0])}">` : `<span>${t('play.locked')}</span>`}</div>`).join('')}</div></section>`;
  }
  function revealSticker(s) { if (!s || !stickerSrc(s)) return; const d = document.createElement('div'); d.className = 'sticker-reveal'; d.setAttribute('role', 'status'); d.innerHTML = `<div class="sticker flip"><img src="${stickerSrc(s)}" alt=""></div><p>${t('play.newSticker')}</p>`; d.onclick = () => d.remove(); document.body.appendChild(d); sfx('unlock'); setTimeout(() => d.remove(), 1500); }

  // ---------- rewards ----------
  function burst(x, y, n = 10) { if (RM()) return; const host = document.createElement('div'); host.className = 'burst'; host.style.left = x + 'px'; host.style.top = y + 'px'; for (let i = 0; i < n; i++) { const s = document.createElement('i'); const a = i / n * Math.PI * 2; s.style.setProperty('--dx', Math.cos(a) * (40 + Math.random() * 30) + 'px'); s.style.setProperty('--dy', Math.sin(a) * (40 + Math.random() * 30) + 'px'); host.appendChild(s); } document.body.appendChild(host); setTimeout(() => host.remove(), 900); }
  function starsToJar(el, n) { if (!el) return; el.innerHTML = `<svg class="jar" viewBox="0 0 80 96" aria-hidden="true"><path d="M18 14h44v8c8 6 10 14 10 24v34a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8V46c0-10 2-18 10-24z" fill="rgba(255,255,255,.14)" stroke="currentColor" stroke-width="2"/><rect x="16" y="6" width="48" height="10" rx="3" fill="currentColor" opacity=".5"/></svg><div class="jarstars">${Array.from({ length: n }, (_, i) => `<span style="--i:${i}">${starRow(1, 1)}</span>`).join('')}</div>`; let k = 0; const tick = () => { if (k++ < n) { sfx('star'); setTimeout(tick, RM() ? 0 : 220); } }; tick(); }

  // ---------- narrator / guide ----------
  let lastGuide = '';
  function guide(key) {
    const p = Store.current(); let card = document.getElementById('guide'); if (!p) { card?.remove(); return; }
    const txt = t('play.guide.' + key); if (txt.startsWith('play.')) { card?.remove(); return; }
    if (!card) { card = document.createElement('aside'); card.id = 'guide'; card.className = 'speechcard'; card.setAttribute('aria-live', 'polite'); document.body.appendChild(card); }
    card.innerHTML = `<p>${esc(txt)}</p><button type="button" class="k-iconbtn" aria-label="${t('common.listen')}"><svg class="k-icon"><use href="#i-sound"/></svg></button><button type="button" class="k-iconbtn" data-x aria-label="${t('common.close')}"><svg class="k-icon"><use href="#i-close"/></svg></button>`;
    card.querySelector('button').onclick = () => Voice.play([{ text: txt, lang: I18N.lang }], null, {});
    card.querySelector('[data-x]').onclick = () => card.remove();
    clearTimeout(guide.t); guide.t = setTimeout(() => card?.remove(), 9000);
    if (on && p.band === 'young' && lastGuide !== key + I18N.lang) { lastGuide = key + I18N.lang; setTimeout(() => Voice.play([{ text: txt, lang: I18N.lang }], null, { onMissing: () => {} }), 500); }
  }

  // ---------- scenes (ambient, rendered, no faces) ----------
  function scene(subject) {
    const rnd = (a, b) => a + Math.random() * (b - a);
    if (subject === 'maths') { const S = R3.Scene({ yaw: -30, pitch: 26, scale: 14 }); S.group(0).box(-14, -6, -0.6, 30, 12, 0.6, '#0f6262', { contrast: .4 }); [[-11, 0, 3, '#e2a336'], [-6, 2, 5, '#16a39c'], [-1, -1, 2, '#3b82c4'], [4, 1, 6, '#e2a336'], [9, -2, 4, '#d04b86'], [12, 2, 3, '#16a39c']].forEach(([x, y, h, c]) => { S.group(1).shadow(x + .5, y + .5, 0, 1, 1); for (let k = 0; k < h; k++) S.box(x, y, k, 1.4, 1.4, 1, c); }); return `<div class="scene sc-maths">${S.svg('')}<i class="float f1"></i><i class="float f2"></i><i class="float f3"></i></div>`; }
    if (subject === 'english') { const S = R3.Scene({ yaw: -22, pitch: 20, scale: 16 }); S.group(0).box(-14, -5, -0.6, 28, 10, 0.6, '#7a4200', { contrast: .4 }); 'KALVI'.split('').forEach((L, i) => { S.group(1).shadow(-9 + i * 4.4, 0, 0, 1.3, 1.3); S.box(-10 + i * 4.4, -1, 0, 2.2, 2.2, 2.2, ['#e2a336', '#f0c36a', '#c97f12', '#e2a336', '#f0c36a'][i], { frontDecal: P => { const c = P([-10 + i * 4.4 + 1.1, -1.01, 1.1]); return `<text x="${c[0]}" y="${c[1]}" font-family="Lato" font-weight="900" font-size="26" fill="#3a2200" text-anchor="middle" dominant-baseline="middle">${L}</text>`; } }); }); return `<div class="scene sc-english">${S.svg('')}<i class="float f1">a</i><i class="float f2">b</i><i class="float f3">c</i></div>`; }
    if (subject === 'science') return `<div class="scene sc-science"><svg viewBox="0 0 600 180" aria-hidden="true">${Array.from({ length: 40 }, (_, i) => `<circle class="tw" style="--d:${(i % 7) * .4}s" cx="${(i * 97) % 600}" cy="${(i * 53) % 120}" r="${1 + (i % 3) * .6}" fill="#e6e9ff"/>`).join('')}<ellipse cx="300" cy="170" rx="260" ry="34" fill="#2a2670"/><circle cx="470" cy="50" r="24" fill="#f6e7b3"/><circle cx="480" cy="44" r="22" fill="#1b1846"/></svg>${SIMS.snap('prism', { angle: 30, beam: 'white' }).replace('class="r3"', 'class="r3 sc-prism"')}</div>`;
    if (subject === 'world') return `<div class="scene sc-world"><svg viewBox="0 0 600 180" aria-hidden="true"><circle cx="300" cy="200" r="150" fill="#2f6fb0"/><path d="M200 120 q40 -30 80 -10 q30 20 70 -5 q30 -15 60 15 v60 h-210z" fill="#3fa66b"/><g class="cloud c1"><ellipse cx="120" cy="50" rx="44" ry="14" fill="#fff" opacity=".85"/></g><g class="cloud c2"><ellipse cx="470" cy="70" rx="56" ry="16" fill="#fff" opacity=".8"/></g></svg></div>`;
    return `<div class="scene sc-today"><svg viewBox="0 0 600 160" aria-hidden="true"><circle class="sun" cx="480" cy="110" r="46" fill="#ffd27a"/><path d="M0 120 q150 -40 300 0 t300 0 v40 H0z" fill="#e9895c"/><path d="M0 140 q150 -30 300 0 t300 0 v20 H0z" fill="#c8603f"/><g class="cloud c1"><ellipse cx="140" cy="46" rx="50" ry="14" fill="#fff" opacity=".7"/></g></svg></div>`;
  }

  // ---------- mascot options (preview only, not shipped until chosen) ----------
  function mascots() {
    const el = R3.Scene({ yaw: -35, pitch: 18, scale: 20 }); const T = '#c4673e', T2 = '#a8532f';
    el.group(0).shadow(0, 0, 0, 2.6, 1.6); el.group(1).box(-2, -1.1, 1.4, 4, 2.2, 2.2, T); [[-1.6, -0.8], [1.2, -0.8], [-1.6, .6], [1.2, .6]].forEach(([x, y]) => el.group(1).cylinder(x + .2, y + .2, 0, .4, 1.5, T2, { n: 20 })); el.group(2).sphere(2.6, 0, 3.2, 1.25, T, { matte: true }); el.group(2).cylinder(3.4, 0, .5, .32, 2.4, T2, { n: 16 }); el.group(2).sphere(2.0, -1.2, 3.6, .9, T2, { matte: true }); el.group(3).sphere(3.25, -.85, 3.6, .12, '#1f2433');
    const pen = R3.Scene({ yaw: -30, pitch: 22, scale: 22 }); pen.group(0).shadow(0, 0, 0, 1.6, 1); pen.group(1).cone(0, 0, 0, .55, 1.1, '#d3a94a', { n: 32 }); pen.group(1).cylinder(0, 0, 1.1, .55, 3.2, '#c99a3a', { n: 32 }); pen.group(1).cylinder(0, 0, 4.3, .62, .5, '#a07a2a', { n: 32 }); pen.group(2).sphere(0, 0, 5.3, .5, '#fff1b8'); pen.group(0).raw(P => { const c = P([0, 0, 5.3]); return `<circle cx="${c[0]}" cy="${c[1]}" r="28" fill="#ffe28a" opacity=".25"/>`; }, [[0, 0, 5.3]]);
    const owl = R3.Scene({ yaw: -10, pitch: 16, scale: 22 }); const O = '#7b8a6e'; owl.group(0).shadow(0, 0, 0, 1.6, 1.2); owl.group(1).sphere(0, 0, 1.6, 1.6, O, { matte: true }); owl.group(2).sphere(0, -.2, 3.4, 1.15, O, { matte: true }); owl.group(3).sphere(-.45, -1.2, 3.6, .38, '#e9e6dc'); owl.group(3).sphere(.45, -1.2, 3.6, .38, '#e9e6dc'); owl.group(4).sphere(-.45, -1.5, 3.6, .14, '#2b3140'); owl.group(4).sphere(.45, -1.5, 3.6, .14, '#2b3140'); owl.group(4).cone(0, -1.35, 3.1, .14, .1, '#d3a94a', { n: 12 }); owl.group(2).cone(-.75, -.1, 4.3, .25, .6, O, { n: 12 }); owl.group(2).cone(.75, -.1, 4.3, .25, .6, O, { n: 12 });
    return [['elephant', el.svg('clay elephant')], ['pen', pen.svg('brass kolam pen')], ['owl', owl.svg('sculpted owl')]];
  }
  ROUTES.mascots = { render(main) { const m = mascots(), opts = [['elephant', '<img src="img/icons/elephant.webp" alt="">'], ['pen', m[1][1]], ['sprout', '<img src="img/icons/seedling.webp" alt="">']]; main.innerHTML = `<section class="page"><div class="hero"><h1 class="big">${t('play.mascot.title')} <span class="stk yellow">${t('play.play')}</span></h1></div><div class="mascots">${opts.map(([k, a], i) => `<figure class="stop" style="min-height:260px"><span class="num">0${i + 1}</span><div class="blobart" style="height:180px">${a}</div><figcaption class="stop-title">${t('play.mascot.' + k)}</figcaption></figure>`).join('')}</div></section>`; } };
  ROUTES.stickers = { render: stickerBook };

  window.PLAY = { sfx, buzz, setSound, paintToggle, get soundOn() { return on; }, stopArt, starsFor, starRow, ring, kolam, todayCount, checkStickers, revealSticker, burst, starsToJar, guide, scene, cheer: ok => { const a = tx('play.cheer.' + (ok ? 'right' : 'wrong')); return a[Math.floor(Math.random() * a.length)]; } };
})();
