// One age profile per year, 3 to 10. Everything that used to depend on "young/older" asks this table instead.
// Class levels follow Tamil Nadu Samacheer / NCERT: 3 pre-KG, 4 LKG, 5 UKG, 6 Class 1 … 10 Class 5.
(function () {
  I18N.add({ age: {
    cls: { 3: ['Pre-KG', 'முன் மழலையர்'], 4: ['LKG', 'எல்.கே.ஜி.'], 5: ['UKG', 'யு.கே.ஜி.'], 6: ['Class 1', '1-ஆம் வகுப்பு'], 7: ['Class 2', '2-ஆம் வகுப்பு'], 8: ['Class 3', '3-ஆம் வகுப்பு'], 9: ['Class 4', '4-ஆம் வகுப்பு'], 10: ['Class 5', '5-ஆம் வகுப்பு'], 11: ['Class 6', '6-ஆம் வகுப்பு'] },
    working: ['Working at {c} level in {s}', '{s}-இல் {c} நிலையில் கற்கிறார்'], ready: ['{name} is ready for {c} {s}', '{name} {c} {s}-க்குத் தயார்'],
    older: ['For age {n}+', '{n} வயது முதல்'], olderTitle: ['This is for older children', 'இது பெரிய குழந்தைகளுக்கானது'], olderBody: ['{name} can try it now if a grown-up unlocks it.', 'பெரியவர் திறந்தால் {name} இப்போதே முயலலாம்.'], unlock: ['Unlock for {name}', '{name}-க்குத் திற'], later: ['Maybe later', 'பிறகு பார்க்கலாம்'],
    howOld: ['How old are you?', 'உனக்கு எத்தனை வயது?'], howOldHelp: ['Tap your age. A grown-up can change it later.', 'உன் வயதைத் தட்டு. பெரியவர் பிறகு மாற்றலாம்.'],
    bmonth: ['Birthday month (optional)', 'பிறந்த மாதம் (விருப்பம்)'], bmonthHelp: ['Kalvi will suggest the new age after each birthday.', 'ஒவ்வொரு பிறந்தநாளுக்குப் பிறகும் புதிய வயதை கல்வி பரிந்துரைக்கும்.'], none: ['Not set', 'இல்லை'],
    birthday: ['{name} is {n} now. Update?', '{name}-க்கு இப்போது {n} வயது. மாற்றவா?'], yes: ['Yes, update', 'ஆம், மாற்று'], no: ['Not yet', 'இப்போது வேண்டாம்'],
    breakTime: ['Time for a little break. Stretch, drink some water, and come back soon.', 'சிறிது ஓய்வு எடுக்கும் நேரம். உடலை நீட்டு, தண்ணீர் குடி, பிறகு வா.'],
  } });
  // read: none | words | sentences | paragraphs | full
  const T = {
    3: { read: 'none', target: 72, scale: 1.25, choices: 2, timer: 'none', autoHint: 6, round: 5, breakMin: 10, autoListen: true },
    4: { read: 'none', target: 72, scale: 1.2, choices: 2, timer: 'none', autoHint: 8, round: 5, breakMin: 10, autoListen: true },
    5: { read: 'words', target: 64, scale: 1.12, choices: 3, timer: 'none', autoHint: 12, round: 8, breakMin: 10, autoListen: true },
    6: { read: 'sentences', target: 60, scale: 1.08, choices: 3, timer: 'none', autoHint: 0, round: 8, breakMin: 20, autoListen: false },
    7: { read: 'paragraphs', target: 56, scale: 1.04, choices: 4, timer: 'gentle', autoHint: 0, round: 10, breakMin: 20, autoListen: false },
    8: { read: 'paragraphs', target: 52, scale: 1.0, choices: 4, timer: 'gentle', autoHint: 0, round: 10, breakMin: 20, autoListen: false },
    9: { read: 'full', target: 48, scale: 1.0, choices: 4, timer: 'best', autoHint: 0, round: 10, breakMin: 20, autoListen: false },
    10: { read: 'full', target: 48, scale: 1.0, choices: 4, timer: 'best', autoHint: 0, round: 10, breakMin: 20, autoListen: false },
  };
  // minimum age for every topic and game (anything not listed is open from 3)
  const TOPIC = {
    maths: { count: 3, shapes: 3, place: 5, add: 5, sub: 5, measure: 7, mul: 7, div: 7, frac: 7 },
    english: { sounds: 3, vocab: 3, blend: 5, sight: 5, spell: 5, read: 5, grammar: 7 },
    science: { living: 3, light: 3, forces: 5, sound: 5, magnets: 5, matter: 5, water: 6, weather: 6, space: 6, electricity: 7, machines: 7 },
    world: { nature: 3, safety: 4, india: 5, tamilnadu: 5, space: 6, scientists: 7, wonders: 7, geo: 7 },
  };
  const GAME = { 'mem.title': 3, 'draw': 3, 'music': 3, 'stories': 3, 'mq.title': 3, 'eq.title': 3, 'spz.title': 3, 'pz.title': 4, 'videos.title': 4, 'bee.title': 5, 'coding.title': 5, 'home.quizTitle': 5, 'gk.title': 5, 'gk.dailyTitle': 5, 'typing.title': 6, 'wp.title': 7, 'lab.title': 7, 'geo.title': 7 };
  // skills that open later than their topic
  const SKILL = { 'pz.kenken': 9, 'pz.magic': 9, 'wp.ladder': 9, 'cd.if': 7, 'cd.func': 9, 'cd.vars': 9, 'm.add2d': 6, 'm.sub2d': 7, 'm.sub20': 6, 'm.digit': 6, 'm.expanded': 7, 'e.order': 6, 'e.caps': 6, 'e.read': 6 };
  const clamp = a => Math.max(3, Math.min(10, Math.round(a || 5)));
  const of = p => ({ age: clamp(p?.age), ...T[clamp(p?.age)] });
  const unlocked = (p, k) => !!p?.unlocked?.[k];
  const topicMin = (subject, id) => TOPIC[subject]?.[id] ?? 3;
  const allowTopic = (p, subject, id) => clamp(p.age) >= topicMin(subject, id) || unlocked(p, subject + ':' + id);
  const gameKey = g => GAME[g.title] != null ? g.title : String(g.title).split('.')[0];
  const gameMin = g => GAME[g.title] ?? GAME[String(g.title).split('.')[0]] ?? 3;
  const allowGame = (p, g) => clamp(p.age) >= gameMin(g) || unlocked(p, 'g:' + gameKey(g));
  const allowSkill = (p, id) => clamp(p.age) >= (SKILL[id] ?? 3);
  // start level inside a skill's range: 3–4 lowest, 5–6 one up where allowed, 7–8 older start, 9–10 one up
  function startLevel(p, sk) {
    const a = clamp(p.age), y = [sk.min('young'), sk.max('young')], o = [sk.min('older'), sk.max('older')];
    if (a <= 4) return y[0]; if (a <= 6) return Math.min(y[1], y[0] + (a - 5)); if (a <= 8) return o[0]; return Math.min(o[1], o[0] + 1);
  }
  const range = (p, sk) => clamp(p.age) <= 6 ? [sk.min('young'), sk.max('young')] : [sk.min('older'), clamp(p.age) >= 9 ? sk.max('older') : Math.max(sk.min('older'), sk.max('older') - (clamp(p.age) === 7 ? 1 : 0))];
  const cls = n => t('age.cls.' + Math.max(3, Math.min(11, n)));
  // class level the child works at in a subject: age's class, one up when mastery is strong
  function classIn(p, subject, mastery) { const a = clamp(p.age); return cls(mastery >= .8 ? a + 1 : a); }
  // body classes so CSS can size targets and type per age
  function apply(p) { const b = document.body; for (let a = 3; a <= 10; a++) b.classList.remove('age-' + a); if (!p) return; const r = of(p); b.classList.add('age-' + r.age); b.style.setProperty('--tgt', r.target + 'px'); b.style.setProperty('--age-scale', r.scale); }
  // birthday: suggest the new age once a year
  function birthdayCheck(p) {
    if (!p?.bmonth || p.age >= 12) return; const now = new Date(), y = now.getFullYear(), m = now.getMonth() + 1;
    if (!p.ageYear) { Store.update(p.id, { ageYear: y }); return; } if (p.ageYear < y && m >= p.bmonth) {
      App.dialog(`<h2 class="k-dialog-title">${t('age.birthday', { name: Engine.esc(p.name), n: p.age + 1 })}</h2><div class="k-dialog-actions"><button class="k-btn k-btn-outline" id="bdNo">${t('age.no')}</button><button class="k-btn k-btn-primary" id="bdYes">${t('age.yes')}</button></div>`, d => {
        d.querySelector('#bdYes').onclick = () => { Store.update(p.id, { age: p.age + 1, ageYear: y }); App.closeDialog(); App.route(); };
        d.querySelector('#bdNo').onclick = () => { Store.update(p.id, { ageYear: y }); App.closeDialog(); };
      });
    }
  }
  // break nudge after breakMin minutes of play in one sitting
  let t0 = Date.now(), nudged = false;
  setInterval(() => { const p = Store.current(); if (!p || nudged) return; if ((Date.now() - t0) / 60000 >= of(p).breakMin) { nudged = true; App.toast(t('age.breakTime')); } }, 30000);
  const band = p => clamp(p?.age) >= 7 ? 'older' : 'young';   // compatibility only; prefer of(p)
  window.AGE = { band, T, TOPIC, GAME, SKILL, of, allowTopic, allowGame, allowSkill, topicMin, gameMin, gameKey, startLevel, range, cls, classIn, apply, birthdayCheck, clamp };
})();
