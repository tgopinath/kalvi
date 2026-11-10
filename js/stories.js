// Story shelf (English): 14 short original stories. A bookshelf that unlocks by level, a reader with
// "Read to me" (Web Speech with karaoke word highlighting; a timed fallback when the device sends no
// word-boundary events) and "I'll read" (tap any word: hear it, see its picture and Tamil meaning).
// After a story: a "Words learned" recap, then 3–5 comprehension questions on the shared Engine.
// Skills: 'e.story' (seed → one question of one story) and 'e.storyword' (seed → one word's meaning).
(function () {
  const { t } = I18N, esc = Engine.esc, D = window.STORIES_DATA, EN = window.EN_DATA, SUBJ = 'english';
  const STORIES = D.stories, byId = Object.fromEntries(STORIES.map(s => [s.id, s]));

  I18N.add({ stories: {
    title: ['Story shelf', 'கதை அலமாரி'],
    blurb: ['Short stories from everyday life. Listen or read on your own, tap any word to learn it, then answer a few questions.', 'அன்றாட வாழ்க்கையிலிருந்து சிறு கதைகள். கேட்கலாம் அல்லது நீயே படிக்கலாம், எந்தச் சொல்லையும் தொட்டுக் கற்றுக்கொள், பிறகு சில கேள்விகளுக்குப் பதில் சொல்.'],
    eyebrow: ['Reading', 'வாசிப்பு'],
    lede: ['Stories set in markets, ponds, trains and festivals. Each one ends with a few questions.', 'சந்தை, குளம், ரயில், திருவிழா என அன்றாட இடங்களில் நடக்கும் கதைகள். ஒவ்வொன்றின் முடிவிலும் சில கேள்விகள் உண்டு.'],
    statRead: ['Stories read', 'படித்த கதைகள்'], statWords: ['Words learned', 'கற்ற சொற்கள்'], statOf: ['{a} of {b}', '{b}-இல் {a}'],
    lvl: { 1: ['Level 1 · First stories', 'நிலை 1 · முதல் கதைகள்'], 2: ['Level 2 · Longer stories', 'நிலை 2 · சற்று நீளமான கதைகள்'], 3: ['Level 3 · Stories with new words', 'நிலை 3 · புதிய சொற்களுடன் கதைகள்'] },
    easy: ['Easy reads', 'எளிய கதைகள்'],
    lockOne: ['Finish 1 more level {l} story to open these.', 'இவற்றைத் திறக்க நிலை {l}-இல் இன்னும் 1 கதையை முடி.'],
    lockMany: ['Finish {n} more level {l} stories to open these.', 'இவற்றைத் திறக்க நிலை {l}-இல் இன்னும் {n} கதைகளை முடி.'],
    badge: { new: ['New', 'புதியது'], prog: ['Page {a} of {b}', '{b}-இல் பக்கம் {a}'], read: ['Read', 'படித்தது'], locked: ['Locked', 'பூட்டியுள்ளது'] },
    score: ['{a} of {b} right', '{b}-இல் {a} சரி'],
    pages: ['{n} pages', '{n} பக்கங்கள்'],
    open: ['Open {t}', '{t} கதையைத் திற'],
    lockedCard: ['{t}, locked', '{t}, பூட்டியுள்ளது'],
    mode: { label: ['Reading mode', 'வாசிப்பு முறை'], read: ['Read to me', 'எனக்குப் படித்துக் காட்டு'], self: ['I’ll read', 'நானே படிப்பேன்'] },
    size: { label: ['Text size', 'எழுத்தின் அளவு'], smaller: ['Smaller text', 'சிறிய எழுத்து'], bigger: ['Bigger text', 'பெரிய எழுத்து'] },
    play: ['Read this page', 'இந்தப் பக்கத்தைப் படி'], pause: ['Pause', 'இடைநிறுத்து'],
    prev: ['Previous page', 'முந்தைய பக்கம்'], next: ['Next page', 'அடுத்த பக்கம்'], finish: ['Finish', 'முடி'],
    pageOf: ['Page {a} of {b}', '{b}-இல் பக்கம் {a}'], pagesNav: ['Pages', 'பக்கங்கள்'],
    showTa: ['Show Tamil', 'தமிழில் காட்டு'], hideTa: ['Hide Tamil', 'தமிழை மறை'],
    tapHelp: ['Tap any word to hear it and see what it means. Swipe or use the arrow keys to turn the page.', 'எந்தச் சொல்லையும் தொட்டால் அதைக் கேட்கலாம், பொருளையும் பார்க்கலாம். பக்கத்தைத் திருப்ப இழு அல்லது அம்புக்குறி விசைகளைப் பயன்படுத்து.'],
    storyText: ['Story text. Each word is a button.', 'கதை வரிகள். ஒவ்வொரு சொல்லும் ஒரு பொத்தான்.'],
    pop: { label: ['Word: {w}', 'சொல்: {w}'], close: ['Close', 'மூடு'], meaningTa: ['In Tamil', 'தமிழில்'], meaningEn: ['Meaning', 'பொருள்'], none: ['Say it slowly, then read the sentence again to work it out.', 'மெதுவாகச் சொல்லிப் பார், பிறகு வாக்கியத்தை மீண்டும் படித்துப் புரிந்துகொள்.'], added: ['Saved to your review words.', 'உன் மீள்பார்வைச் சொற்களில் சேர்க்கப்பட்டது.'] },
    end: {
      eyebrow: ['Story finished', 'கதை முடிந்தது'], h1: ['You read {t}', '{t} கதையைப் படித்து முடித்தாய்'],
      lede: ['Next, {n} questions about the story. After each answer you will see the page that holds it.', 'அடுத்து, கதையைப் பற்றி {n} கேள்விகள். ஒவ்வொரு பதிலுக்குப் பிறகும் அது இருக்கும் பக்கத்தைப் பார்ப்பாய்.'],
      words: ['Words learned', 'கற்ற சொற்கள்'], tapped: ['You tapped this', 'நீ தொட்ட சொல்'], fromStory: ['New in this story', 'இந்தக் கதையின் புதிய சொல்'],
      again: ['Read again', 'மீண்டும் படி'], quiz: ['Answer questions', 'கேள்விகளுக்குப் பதில் சொல்'], shelf: ['Story shelf', 'கதை அலமாரி'],
    },
    skill: { q: ['Story questions', 'கதைக் கேள்விகள்'], word: ['Story words', 'கதைச் சொற்கள்'] },
    q: { fromStory: ['From {t}', '{t} கதையிலிருந்து'], wordPic: ['Which picture shows {w}?', '{w} எந்தப் படம்?'], wordTa: ['What does {w} mean?', '{w} என்றால் என்ன?'], wordDef: ['What does {w} mean?', '{w} என்றால் என்ன?'] },
    h: { page: ['Think back to page {n} of the story.', 'கதையின் {n}-ஆம் பக்கத்தை நினைத்துப் பார்.'], quote: ['Page {n} says: {s}', '{n}-ஆம் பக்கம் சொல்வது: {s}'], answer: ['The answer is {a}.', 'பதில் {a}.'], word: ['Say the word aloud and think where you met it.', 'சொல்லைச் சத்தமாகச் சொல்லி, அதை எங்கே பார்த்தாய் என்று யோசி.'], sent: ['Here it is in a sentence: {s}', 'ஒரு வாக்கியத்தில்: {s}'], word2: ['Try each choice in a sentence with the word. Which one makes sense?', 'ஒவ்வொரு தேர்வையும் அந்தச் சொல்லுடன் ஒரு வாக்கியத்தில் வைத்துப் பார். எது பொருந்துகிறது?'] },
    y: {
      page: ['Page {n} of {t} says: {s}', '{t} கதையின் {n}-ஆம் பக்கம் சொல்வது: {s}'], tamil: ['In Tamil: {s}', 'தமிழில்: {s}'], so: ['So the answer is {a}.', 'எனவே பதில் {a}.'],
      word: ['{w} means {ta}.', '{w} என்றால் {ta}.'], def: ['In English: {d}.', 'ஆங்கிலத்தில்: {d}.'],
    },
    scene: {
      plates: ['{n} plates with {each} laddus on each', '{n} தட்டுகள், ஒவ்வொன்றிலும் {each} லட்டுகள்'], pile: ['{n} plates and a pile of {p} laddus', '{n} தட்டுகளும் {p} லட்டுக் குவியலும்'],
      sprout: ['A pot of soil, growth stage {n} of 4', 'மண் தொட்டி, வளர்ச்சி நிலை 4-இல் {n}'], cup: ['A steel cup in the rain', 'மழையில் ஒரு எஃகுக் கோப்பை'], pot: ['A clay pot of pongal on a stove', 'அடுப்பில் பொங்கல் பானை'],
      train: ['A blue train on the rails', 'தண்டவாளத்தில் ஒரு நீல ரயில்'], kite: ['A red paper kite', 'சிவப்புக் காகிதப் பட்டம்'], palm: ['A coconut tree', 'ஒரு தென்னை மரம்'], mat: ['A woven palm-leaf mat and a broom', 'பின்னிய ஓலைப் பாயும் துடைப்பமும்'],
      gauge: ['A bottle rain gauge showing {mm} millimetres', '{mm} மில்லிமீட்டர் காட்டும் பாட்டில் மழைமானி'], bars: ['Bar chart of rain for five days', 'ஐந்து நாள் மழையின் பட்டை வரைபடம்'], money: ['Money: {m} rupees', 'பணம்: {m} ரூபாய்'],
    },
  } });

  // ---------- word list for review seeds (append-only order: story glossaries, then everyday words) ----------
  const NOFLAG = new Set(['a', 'an', 'the', 'i', 'is', 'it', 'to', 'in', 'and', 'at', 'on', 'so', 'of']);
  const WL = [], WIX = {};
  const addW = (key, e) => { if (key in WIX) return; WIX[key] = WL.length; WL.push(e); };
  STORIES.forEach(s => s.gloss.forEach(g => addW(s.id + '|' + g.w, { w: g.w, ta: g.ta, def: g.def, sid: s.id, forms: g.forms || [] })));
  Object.entries(D.COMMON).forEach(([w, ta]) => { if (!NOFLAG.has(w)) addW('*|' + w, { w, ta }); });
  Object.keys(EN.WORDS).forEach(w => addW('*|' + w, { w, ta: EN.WORDS[w].ta }));
  Object.entries(EN.SPELL_TA || {}).forEach(([w, ta]) => addW('*|' + w, { w, ta }));
  const QL = []; STORIES.forEach((s, si) => s.qs.forEach((q, qi) => QL.push({ si, qi })));
  // a seed whose first random number picks index idx of a list of length n (gen() only sees r, not the seed)
  function seedFor(idx, n) { for (let s = 1 + ((idx * 7919) % 50000), k = 0; k < 200000; s++, k++) if (Math.floor(Engine.rng(s)() * n) === idx) return s; return 1; }

  // ---------- helpers ----------
  const pic = w => (w && window.PICS?.[w]) || null;
  const credit = w => { const p = pic(w); return p ? { src: p.src, credit: p.credit || 'Wikimedia Commons', href: p.page, alt: w } : null; };
  const L = o => (o ? (I18N.lang === 'ta' ? o.ta : o.en) : '');
  const enSpan = s => `<span lang="en">${esc(s)}</span>`;
  const taSpan = s => `<span lang="ta">${esc(s)}</span>`;
  const quote = s => `<q class="st-quote" lang="en">${esc(s)}</q>`;
  const sentences = s => s.match(/[^.?!]+[.?!]+[”’"]?\s*/g)?.map(x => x.trim()) || [s];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rate = () => Store.current()?.settings?.rate ?? 0.9;
  const formsOf = e => [e.w, ...(e.forms || [])];
  const findSentence = (s, e) => {
    const re = new RegExp(`\\b(${formsOf(e).map(f => f.replace(/[^a-z]/gi, '')).join('|')})\\b`, 'i');
    for (let i = 0; i < s.pages.length; i++) { const hit = sentences(s.pages[i].en).find(x => re.test(x)); if (hit) return { pg: i, line: hit }; }
    return null;
  };

  // ---------- rendered scenes (dark board, R3) ----------
  const COL = { laddu: '#e8a33a', paper: '#e9e4d8', clay: '#b5633a', clay2: '#c4744a', soil: '#5a3a24', leaf: '#3f9e4d', leaf2: '#2f8a43', water: '#4f97d8', steel: '#aab2c0', wood: '#8b6b4a', blue: '#2f6db0', red: '#d04b3a', tan: '#c9a36b', tan2: '#a8844f', stone: '#6b7280' };
  const poly = (P, pts, fill, extra = '') => `<polygon points="${pts.map(p => P(p).slice(0, 2).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${fill}" ${extra}/>`;
  const line = (P, a, b, stroke, w = 1.2, extra = '') => { const A = P(a), B = P(b); return `<line x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`; };
  function leaf(S, B, T, v, color) { const M = B.map((x, i) => (x + T[i]) / 2); S.face([B, M.map((x, i) => x + v[i]), T, M.map((x, i) => x - v[i])], color, { both: true }); }
  const SC = {
    plates({ n, each = 0, pile = 0 }) {
      const S = R3.Scene({ yaw: 0, pitch: 52, scale: 15 }), big = n === 1, per = Math.min(n, 4);
      for (let i = 0; i < n; i++) {
        const cx = (i % per) * 4.6, cy = -Math.floor(i / per) * 4.6, r = big ? 3.2 : 1.95;
        S.group(0).shadow(cx, cy, 0, r + .3, r + .3).cylinder(cx, cy, 0, r, 0.25, COL.paper, { n: 48 });
        if (big) for (let j = 0; j < each; j++) S.group(1).sphere(cx - 1.65 + (j % 4) * 1.1, cy - 1.1 + Math.floor(j / 4) * 1.1, 0.75, 0.5, COL.laddu, { matte: true });
        else for (let j = 0; j < each; j++) { const a = j / Math.max(1, each) * Math.PI * 2 + .6, rr = each === 1 ? 0 : 0.85; S.group(1).sphere(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.72, 0.47, COL.laddu, { matte: true }); }
      }
      for (let j = 0; j < pile; j++) { const x = per * 4.6 + (j % 3) * 1.0 - .4, y = -((Math.ceil(n / per) - 1) * 4.6) / 2 - 1.2 + Math.floor(j / 3) * 1.0; S.group(1).sphere(x, y, 0.47, 0.47, COL.laddu, { matte: true }); }
      return S.svg(pile ? t('stories.scene.pile', { n, p: pile }) : t('stories.scene.plates', { n, each }));
    },
    sprout({ stage = 0, seed, water }) {
      const S = R3.Scene({ yaw: -25, pitch: 20, scale: 17 });
      S.group(0).shadow(0, 0, 0, 2.7, 2.7).cylinder(0, 0, 0, 2.1, 2.9, COL.clay).cylinder(0, 0, 2.9, 2.45, 0.5, COL.clay2);
      S.group(2).cylinder(0, 0, 3.02, 2.15, 0.36, COL.soil, { n: 40 });
      if (seed) S.group(3).sphere(0.4, -0.5, 3.55, 0.26, '#9a6a35', { matte: true });
      if (water) for (const [x, z] of [[-0.6, 5.4], [0.3, 6.3], [0.9, 5.0], [-0.1, 7.1]]) S.group(3).sphere(x, -0.4, z, 0.2, COL.water);
      const top = 3.38, h = [0, 1.0, 1.9, 3.6][stage];
      if (stage > 0) {
        S.group(3).box(-0.09, -0.09, top, 0.18, 0.18, h, COL.leaf2);
        const pairs = stage === 1 ? [[top + h, 0.6]] : stage === 2 ? [[top + h, 1.3]] : [[top + 1.2, 1.4], [top + 2.4, 1.6], [top + h, 1.3]];
        pairs.forEach(([z, len]) => { S.group(4); leaf(S, [0, 0, z - .05], [len, 0, z + len * .45], [0, .32, .05], COL.leaf); leaf(S, [0, 0, z - .05], [-len, 0, z + len * .45], [0, .32, .05], COL.leaf); });
      }
      return S.svg(t('stories.scene.sprout', { n: stage + 1 }));
    },
    cup({ fill = 0 }) {
      const S = R3.Scene({ yaw: -20, pitch: 24, scale: 18 });
      S.group(0).shadow(0, 0, 0, 2, 2).cylinder(0, 0, 0, 1.55, 3, COL.steel, { n: 48 });
      S.group(2).cylinder(0, 0, 3.0, 1.38, 0.03, fill > .5 ? COL.water : '#59606e', { n: 48, flat: true });
      if (fill <= .5) S.group(3).cylinder(0, 0, 3.04, 0.6, 0.02, COL.water, { n: 32, flat: true });
      for (const [x, y, z] of [[-1.2, 0, 6.2], [0.4, 0.2, 7.4], [1.3, -.2, 5.6], [-0.2, 0, 4.6], [2.4, 0, 7.0], [-2.3, .2, 5.0]]) S.group(3).sphere(x, y, z, 0.17, COL.water);
      return S.svg(t('stories.scene.cup'));
    },
    pot({ boil }) {
      const S = R3.Scene({ yaw: -25, pitch: 22, scale: 16 });
      for (const a of [0, 2.1, 4.2]) S.group(0).box(Math.cos(a) * 1.9 - .45, Math.sin(a) * 1.9 - .45, 0, .9, .9, 1.1, COL.stone);
      S.group(1).cone(0, 0, 0.1, 0.9, 1.2, '#e8a33a', { smooth: true }).cone(0.5, 0.3, 0.1, 0.5, 0.8, '#d04b3a', { smooth: true });
      S.group(2).shadow(0, 0, 1.1, 2.5, 2.5).cylinder(0, 0, 1.1, 2.2, 2.4, COL.clay).cylinder(0, 0, 3.5, 1.55, 0.6, COL.clay2);
      S.group(3).cylinder(0, 0, 4.1, 1.35, 0.04, COL.paper, { flat: true });
      if (boil) { for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; S.group(4).sphere(Math.cos(a) * 1.35, Math.sin(a) * 1.35, 4.3 + (i % 2) * .15, 0.42, '#f4f1ea', { matte: true }); }
        for (const [a, z] of [[-1.7, 3.4], [-1.4, 2.7], [-2.0, 3.0]]) S.group(5).sphere(Math.cos(a) * 2.2, Math.sin(a) * 2.2, z, 0.3, '#f4f1ea', { matte: true }); }
      return S.svg(t('stories.scene.pot'));
    },
    train() {
      const S = R3.Scene({ yaw: -22, pitch: 18, scale: 11 });
      S.group(0).box(-1, 0.1, 0, 24, 0.2, 0.15, COL.stone).box(-1, 1.7, 0, 24, 0.2, 0.15, COL.stone);
      for (let i = 0; i < 20; i++) S.group(0).box(-0.8 + i * 1.2, -0.3, -0.05, 0.4, 2.6, 0.1, '#5b4636');
      [0, 7.4, 14.8].forEach((x, k) => {
        S.group(1).box(x + .4, 0.3, 0.2, 6.0, 1.4, 0.5, '#2a2f3b');
        S.group(2).box(x, 0, 0.7, 6.8, 2, 2.6, k === 0 ? '#1f4f86' : COL.blue, { frontDecal: P => [0, 1, 2, 3].map(w => poly(P, [[x + .6 + w * 1.55, -.01, 2.0], [x + 1.6 + w * 1.55, -.01, 2.0], [x + 1.6 + w * 1.55, -.01, 2.9], [x + .6 + w * 1.55, -.01, 2.9]], '#f3d27a')).join('') + line(P, [x, -.01, 1.4], [x + 6.8, -.01, 1.4], '#e9e4d8', 1.4) });
      });
      return S.svg(t('stories.scene.train'));
    },
    kite({ tail }) {
      const S = R3.Scene({ yaw: 0, pitch: 6, scale: 20 });
      const T = [0, 0, 4.2], R = [2.2, 0, 1.8], B = [0, 0, -1.6], Lf = [-2.2, 0, 1.8];
      S.group(1).face([B, R, T, Lf], COL.red, { both: true, contrast: .4 });
      S.group(2).raw(P => line(P, T, B, '#e9d8a6', 2) + line(P, Lf, R, '#e9d8a6', 2) + `<path d="M${P(B)[0]} ${P(B)[1]} Q ${P([4, 0, -4])[0]} ${P([4, 0, -4])[1]} ${P([7, 0, -6.5])[0]} ${P([7, 0, -6.5])[1]}" stroke="#cfd4de" stroke-width="1" fill="none"/>`, [T, B, Lf, R, [7, 0, -6.5]]);
      if (tail) { const pts = [B, [-.6, 0, -2.6], [.4, 0, -3.6], [-.5, 0, -4.6], [.3, 0, -5.6], [-.3, 0, -6.6]];
        S.group(2).raw(P => `<polyline points="${pts.map(p => P(p).slice(0, 2).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#e8a33a" stroke-width="2.4" stroke-linejoin="round"/>` + pts.slice(1).map(p => poly(P, [[p[0] - .35, 0, p[2] + .2], [p[0] + .35, 0, p[2] - .2], [p[0] + .35, 0, p[2] + .2], [p[0] - .35, 0, p[2] - .2]], '#f3d27a')).join(''), pts); }
      return S.svg(t('stories.scene.kite'));
    },
    palm({ drop }) {
      const S = R3.Scene({ yaw: -20, pitch: 14, scale: 13 });
      S.group(0).shadow(0, 0, 0, 1.2, 1.2);
      let x = 0; for (let i = 0; i < 9; i++) { S.group(1).cylinder(x, 0, i * 1.0, 0.5 - i * 0.025, 1.02, i % 2 ? COL.wood : '#7a5c3e', { n: 20 }); x += 0.12 + i * 0.02; }
      const top = [x, 0, 9.0];
      for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2 + .2, dx = Math.cos(a), dy = Math.sin(a); S.group(3); leaf(S, top, [top[0] + dx * 4.2, dy * 4.2, top[2] - 1.6 + (k % 2) * .6], [-dy * .55, dx * .55, .1], k % 2 ? COL.leaf : COL.leaf2); }
      for (const [dx, dy] of [[.45, -.4], [-.4, -.35], [.05, -.6]]) S.group(2).sphere(top[0] + dx, dy, top[2] - .55, 0.42, '#7d8b2e');
      if (drop) S.group(1).shadow(2.6, -1, 0, .6, .6).sphere(2.6, -1, .42, 0.42, '#7d8b2e');
      return S.svg(t('stories.scene.palm'));
    },
    mat() {
      const S = R3.Scene({ yaw: -25, pitch: 40, scale: 13 });
      for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) S.group(0).box(i, j, 0, 1, 1, 0.12, (i + j) % 2 ? COL.tan : COL.tan2, { contrast: .4 });
      for (let k = 0; k < 9; k++) S.group(1).box(9.6 + (k % 3) * .18, 1 + Math.floor(k / 3) * .18, 0, 0.1, 0.1, 4.6, '#d8c08a', { contrast: .3 });
      S.group(2).box(9.5, 0.9, 0.8, 0.75, 0.75, 0.4, COL.red);
      return S.svg(t('stories.scene.mat'));
    },
    gauge({ mm = 0, funnel }) {
      const S = R3.Scene({ yaw: -18, pitch: 16, scale: 17 }), u = 5.4 / 50, hw = Math.max(0, mm) * u;
      S.group(0).shadow(0, 0, 0, 1.6, 1.6).cylinder(0, 0, 0, 1.2, 6, '#dfe6ee', { n: 40, contrast: .4 });
      if (hw > 0) S.group(1).cylinder(0, 0, 0, 1.24, hw, COL.water, { n: 40 });
      if (funnel) S.group(2).cone(0, 0, 6.0, 1.5, -1.2, '#cfd6e0', { both: true, smooth: true });
      S.group(3).box(1.5, -0.25, 0, 0.7, 0.25, 6.0, '#e2c26b', { frontDecal: P => { let o = ''; for (let m = 0; m <= 50; m += 5) o += line(P, [1.5, -.26, m * u], [1.5 + (m % 10 ? .25 : .45), -.26, m * u], '#3a3020', 1); return o; } });
      for (let m = 0; m <= 50; m += 10) S.group(4).text(2.75, -.25, m * u, String(m), { size: .55, fill: '#e6e9f0', anchor: 'start' });
      return S.svg(t('stories.scene.gauge', { mm }));
    },
    bars({ vals }) {
      const S = R3.Scene({ yaw: -24, pitch: 18, scale: 14 }), days = ['M', 'T', 'W', 'T', 'F'], max = Math.max(...vals);
      vals.forEach((v, i) => { const x = i * 2.2, h = v / max * 6; S.group().shadow(x + .6, .6, 0, .9, .9).box(x, 0, 0, 1.2, 1.2, h, v === max ? '#e2a336' : '#16a39c'); S.text(x + .6, -.4, h + .7, String(v), { size: .7 }); S.text(x + .6, -.6, -.9, days[i], { size: .7, fill: '#9aa1b2' }); });
      return S.svg(t('stories.scene.bars'));
    },
    money({ items }) { return VIS.money(items, t('stories.scene.money', { m: items.reduce((a, v) => a + +String(v).replace('c', ''), 0) })); },
  };
  const scene = sc => { try { return SC[sc.k] ? SC[sc.k](sc) : ''; } catch (e) { console.warn('scene', sc.k, e); return ''; } };
  function art(page, small) {
    if (page.pic && pic(page.pic)) {
      const p = pic(page.pic), alt = I18N.lang === 'ta' ? (EN.WORDS[page.pic]?.ta || page.pic) : (EN.WORDS[page.pic]?.label || page.pic);
      return `<figure class="st-art photo ${small ? 'small' : ''}"><img src="${p.src}" alt="${esc(alt)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('figure').classList.add('noimg')">${small ? '' : `<figcaption>${t('common.credit')}: <a href="${p.page}" target="_blank" rel="noopener">${esc(p.credit || 'Wikimedia Commons')}</a></figcaption>`}</figure>`;
    }
    return `<figure class="st-art board ${small ? 'small' : ''}">${page.scene ? scene(page.scene) : ''}</figure>`;
  }
  const coverPage = s => s.pages.find(p => p.pic && pic(p.pic)) || s.pages[0];

  // ---------- progress: p.extras.stories = { r: { id: { pg, done, q:[right,n] } }, w: [tapped words], size } ----------
  function ex(p) { p.extras ??= {}; const e = (p.extras.stories ??= { r: {}, w: [] }); e.r ??= {}; e.w ??= []; return e; }
  const doneIn = (p, lvl) => STORIES.filter(s => s.lvl === lvl && ex(p).r[s.id]?.done).length;
  const older = p => p.band !== 'young';
  function need(p, lvl) { // stories still to finish before level lvl opens
    if (lvl === 1 || (lvl === 2 && older(p))) return 0;
    const want = lvl === 3 && older(p) ? 1 : 2;
    return Math.max(0, want - doneIn(p, lvl - 1));
  }
  const unlocked = (p, s) => need(p, s.lvl) === 0;
  function learnedWords(p) {
    const set = new Set(ex(p).w);
    STORIES.forEach(s => { if (ex(p).r[s.id]?.done) s.gloss.forEach(g => set.add(g.w)); });
    return set;
  }

  // ---------- word lookup for the popover ----------
  function lookup(raw, s) {
    const clean = raw.toLowerCase().replace(/[“”"‘(),.?!:;]/g, '').replace(/[’']s$/, '').replace(/[’']/g, '');
    if (!clean) return null;
    const cands = [clean]; const add = x => x && !cands.includes(x) && cands.push(x);
    if (/ies$/.test(clean)) add(clean.replace(/ies$/, 'y'));
    if (/es$/.test(clean)) add(clean.replace(/es$/, ''));
    if (/s$/.test(clean)) add(clean.replace(/s$/, ''));
    if (/ed$/.test(clean)) { add(clean.replace(/ed$/, '')); add(clean.replace(/d$/, '')); }
    if (/ing$/.test(clean)) { add(clean.replace(/ing$/, '')); add(clean.replace(/ing$/, 'e')); }
    for (const c of cands) {
      const g = s?.gloss.find(x => x.w === c || x.forms?.includes(c));
      if (g) return { w: g.w, shown: clean, ta: g.ta, def: g.def, pic: pic(g.w) ? g.w : pic(c) ? c : null, idx: WIX[s.id + '|' + g.w] };
    }
    for (const c of cands) {
      const ta = EN.WORDS[c]?.ta || D.COMMON[c] || EN.SPELL_TA?.[c];
      if (ta) return { w: c, shown: clean, ta, pic: pic(c) ? c : null, idx: WIX['*|' + c] };
    }
    for (const c of cands) if (pic(c)) return { w: c, shown: clean, pic: c, idx: WIX['*|' + c] };
    return { w: clean, shown: clean };
  }

  // ---------- skills ----------
  const en = text => ({ text, lang: 'en' });
  Engine.skill({ id: 'e.story', subject: SUBJ, topic: 'read', name: 'stories.skill.q', bands: { young: [1, 3], older: [1, 3] }, warm: false, gen(lvl, r, ctx) {
    const { si, qi } = QL[Math.floor(r() * QL.length)], s = STORIES[si], q = s.qs[qi], page = s.pages[q.pg], ta = ctx?.lang === 'ta';
    const n = q.pg + 1, opts = r.shuffle([q.a, ...q.o]), aTxt = enSpan(q.a.replace(/\.$/, '')), inRound = Engine.round?.mode === 'story' && Engine.round?.title === s.title.en;
    const cover = coverPage(s);
    return { kind: 'choice',
      prompt: `${inRound ? '' : `<span class="st-qsrc">${t('stories.q.fromStory', { t: enSpan(s.title.en) })}</span>`}<span lang="en">${esc(q.q.en)}</span>${ta ? `<span class="st-qta" lang="ta">${esc(q.q.ta)}</span>` : ''}`,
      say: [en(q.q.en), ...(ta ? [{ text: q.q.ta, lang: 'ta' }] : [])],
      visual: art(cover, true), boardClass: 'photo st-qboard',
      choices: opts.map(o => ({ v: o, html: enSpan(o), say: [en(o)], lang: 'en' })), answer: q.a, answerText: aTxt,
      hints: [{ text: t('stories.h.page', { n }) }, { text: t('stories.h.quote', { n, s: quote(q.line) }) }, { text: t('stories.h.answer', { a: aTxt }) }], hintRevealsAnswer: true,
      why: { steps: [
        { text: t('stories.y.page', { n, t: enSpan(s.title.en), s: quote(q.line) }) },
        ...(ta ? [{ text: t('stories.y.tamil', { s: taSpan(page.ta) }) }] : []),
        { text: t('stories.y.so', { a: aTxt }) },
      ] } };
  } });
  Engine.skill({ id: 'e.storyword', subject: SUBJ, topic: 'read', name: 'stories.skill.word', bands: { young: [1, 3], older: [1, 3] }, warm: false, gen(lvl, r, ctx) {
    const e = WL[Math.floor(r() * WL.length)], ta = ctx?.lang === 'ta', s = e.sid ? byId[e.sid] : null;
    const pw = pic(e.w) ? e.w : null, w = enSpan(e.w);
    const where = s ? findSentence(s, e) : null;
    const steps = [{ text: t('stories.y.word', { w, ta: taSpan(e.ta || '') }) }];
    if (e.def) steps.push({ text: t('stories.y.def', { d: enSpan(e.def) }) });
    if (where) steps.push({ text: t('stories.y.page', { n: where.pg + 1, t: enSpan(s.title.en), s: quote(where.line) }) });
    const base = { answer: e.w, why: { steps, photo: credit(pw) }, hintRevealsAnswer: true };
    const hint3 = (a) => [{ text: t('stories.h.word') }, where ? { text: t('stories.h.quote', { n: where.pg + 1, s: quote(where.line) }) } : EN.SENT?.[e.w] ? { text: t('stories.h.sent', { s: quote(EN.SENT[e.w]) }) } : { text: t('stories.h.word2') }, { text: t('stories.h.answer', { a }) }];
    const picPool = WL.filter(x => pic(x.w) && x.w !== e.w);
    if (pw && picPool.length >= 3) {
      const others = r.shuffle(picPool).filter((x, i, a) => a.findIndex(y => y.w === x.w) === i).slice(0, 3);
      return { ...base, kind: 'choice', prompt: t('stories.q.wordPic', { w }), say: [{ text: t('stories.q.wordPic', { w: '' }), lang: I18N.lang }, en(e.w)],
        choices: r.shuffle([e, ...others]).map(x => ({ v: x.w, img: pic(x.w).src, say: [en(x.w)] })), answerText: w, hints: hint3(w) };
    }
    if (!ta && e.def) {
      const others = r.shuffle(WL.filter(x => x.def && x.def !== e.def && x.w !== e.w)).slice(0, 3);
      return { ...base, kind: 'choice', prompt: t('stories.q.wordDef', { w }), say: [en(`What does ${e.w} mean?`)],
        choices: r.shuffle([e, ...others]).map(x => ({ v: x.w, html: enSpan(x.def), say: [en(x.def)], lang: 'en' })), answerText: enSpan(e.def), hints: hint3(enSpan(e.def)) };
    }
    const others = r.shuffle(WL.filter(x => x.ta && x.ta !== e.ta && x.w !== e.w)).filter((x, i, a) => a.findIndex(y => y.ta === x.ta) === i).slice(0, 3);
    return { ...base, kind: 'choice', prompt: t('stories.q.wordTa', { w }), say: [{ text: t('stories.q.wordTa', { w: '' }), lang: I18N.lang }, en(e.w)],
      choices: r.shuffle([e, ...others]).map(x => ({ v: x.w, html: taSpan(x.ta), lang: 'ta' })), answerText: taSpan(e.ta), hints: hint3(taSpan(e.ta)) };
  } });
  const storyItem = (sid, qi) => { const k = QL.findIndex(x => STORIES[x.si].id === sid && x.qi === qi); return { skill: 'e.story', lvl: byId[sid].lvl, seed: seedFor(k, QL.length) }; };
  const wordItem = key => ({ skill: 'e.storyword', lvl: 1, seed: seedFor(WIX[key], WL.length) });

  // ---------- reader state + read-aloud with karaoke highlighting ----------
  let RD = null;   // { s, pg, tapped:Set, showTa, playing, paused, tok, timers:[] }
  const SIZES = [20, 22, 26, 30, 34];
  const sizeIdx = p => ex(p).size ?? (older(p) ? 1 : 2);
  const voicePick = () => { try { const vs = speechSynthesis.getVoices(); return vs.find(v => /en[-_]IN/i.test(v.lang)) || vs.find(v => /en[-_](GB|US)/i.test(v.lang)) || null; } catch { return null; } };
  function clearTimers() { if (!RD) return; RD.timers.forEach(clearTimeout); RD.timers = []; }
  function stopRead() {
    if (!RD) return; RD.tok++; clearTimers(); RD.playing = false;
    try { speechSynthesis.cancel(); } catch {}
    document.querySelectorAll('.st-text .w.on').forEach(x => x.classList.remove('on'));
    updatePlay();
  }
  function updatePlay() {
    const b = document.querySelector('.st-play'); if (!b || !RD) return;
    b.setAttribute('aria-pressed', RD.playing ? 'true' : 'false'); b.classList.toggle('talking', RD.playing);
    b.querySelector('span').textContent = RD.playing ? t('stories.pause') : t('stories.play');
  }
  function readPage() {
    if (!RD) return; stopRead();
    const tok = RD.tok, ws = [...document.querySelectorAll('.st-text .w')]; if (!ws.length) return;
    const text = RD.s.pages[RD.pg].en, starts = ws.map(w => +w.dataset.s);
    RD.playing = true; RD.paused = false; updatePlay();
    const hl = i => { ws.forEach((w, k) => w.classList.toggle('on', k === i)); };
    let gotBoundary = false, fallback = false, spoken = false, speechDone = false, fbDone = false;
    const finish = () => { if (tok !== RD.tok) return; hl(-1); RD.playing = false; updatePlay(); if (RD.mode === 'read' && RD.pg < RD.s.pages.length - 1) RD.timers.push(setTimeout(() => { if (tok === RD.tok) go(RD.pg + 1); }, 1500)); };
    const runFallback = () => {
      if (fallback || gotBoundary || tok !== RD.tok) return; fallback = true;
      const r = rate(); let at = 0;
      ws.forEach((w, i) => { RD.timers.push(setTimeout(() => { if (tok === RD.tok && !gotBoundary) hl(i); }, at)); const word = w.textContent; at += (230 + 58 * word.replace(/[^a-z]/gi, '').length + (/[.?!]/.test(word) ? 380 : /[,:;]/.test(word) ? 180 : 0)) / r; });
      RD.timers.push(setTimeout(() => { fbDone = true; if (tok !== RD.tok) return; if (speechDone || !spoken) finish(); else RD.timers.push(setTimeout(finish, 4000)); }, at + 200));
    };
    if (!('speechSynthesis' in window)) { runFallback(); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN'; const v = voicePick(); if (v) u.voice = v; u.rate = rate() * 0.95; u.pitch = 1.03;
    u.onstart = () => { spoken = true; RD.timers.push(setTimeout(() => { if (!gotBoundary) runFallback(); }, 650)); };
    u.onboundary = e => { if (tok !== RD.tok || (e.name && e.name !== 'word')) return; gotBoundary = true; let i = 0; while (i + 1 < starts.length && starts[i + 1] <= e.charIndex) i++; hl(i); };
    u.onend = () => { speechDone = true; if (tok !== RD.tok) return; if (!fallback || fbDone) finish(); };
    u.onerror = () => { speechDone = true; if (tok === RD.tok && !fallback) runFallback(); };
    RD.timers.push(setTimeout(() => { if (!spoken && !gotBoundary) runFallback(); }, 900));   // no voice / never started
    try { speechSynthesis.cancel(); speechSynthesis.speak(u); } catch { runFallback(); }
  }

  // ---------- screens ----------
  const main = () => document.getElementById('main');
  function shelf(el) {
    const p = Store.current(), e = ex(p), lv = older(p) ? [2, 3, 1] : [1, 2, 3];
    const nDone = STORIES.filter(s => e.r[s.id]?.done).length, nWords = learnedWords(p).size;
    const card = s => {
      const st = e.r[s.id] || {}, open = unlocked(p, s), title = esc(s.title.en);
      const badge = !open ? `<span class="k-badge"><svg class="k-icon" aria-hidden="true"><use href="#i-lock"/></svg>${t('stories.badge.locked')}</span>`
        : st.done ? `<span class="k-badge k-badge-success"><svg class="k-icon" aria-hidden="true"><use href="#i-check"/></svg>${t('stories.badge.read')}</span>${st.q ? `<span class="small muted">${t('stories.score', { a: st.q[0], b: st.q[1] })}</span>` : ''}`
        : st.pg > 0 ? `<span class="k-badge k-badge-warning">${t('stories.badge.prog', { a: st.pg + 1, b: s.pages.length })}</span>` : `<span class="k-badge k-badge-info">${t('stories.badge.new')}</span>`;
      const inner = `<span class="st-cover">${art(coverPage(s), true)}</span><span class="st-meta"><span class="st-badges">${badge}</span><b lang="en">${title}</b>${I18N.lang === 'ta' ? `<span class="small" lang="ta">${esc(s.title.ta)}</span>` : ''}<span class="small muted">${esc(L(s.setting))} · ${t('stories.pages', { n: s.pages.length })}</span></span>`;
      return `<li>${open ? `<a class="st-book" href="#/stories/${s.id}" aria-label="${esc(t('stories.open', { t: s.title.en }))}">${inner}</a>` : `<div class="st-book locked" aria-label="${esc(t('stories.lockedCard', { t: s.title.en }))}" role="group">${inner}</div>`}</li>`;
    };
    el.innerHTML = `<section class="page st-shelf-page" data-subject="english">
      <a class="backlink" href="#/s/english"><svg class="k-icon"><use href="#i-back"/></svg>${t('subj.english.title')}</a>
      <p class="eyebrow">${t('stories.eyebrow')}</p><h1>${t('stories.title')}</h1><p class="lede">${t('stories.lede')}</p>
      <div class="stats st-stats"><div class="k-stat"><span class="k-stat-label">${t('stories.statRead')}</span><span class="k-stat-value">${t('stories.statOf', { a: nDone, b: STORIES.length })}</span></div><div class="k-stat"><span class="k-stat-label">${t('stories.statWords')}</span><span class="k-stat-value">${nWords}</span></div></div>
      ${lv.map(l => { const n = need(p, l), list = STORIES.filter(s => s.lvl === l);
        return `<h2 class="section">${older(p) && l === 1 ? t('stories.easy') : t('stories.lvl.' + l)}</h2>${n ? `<p class="small muted st-lockmsg"><svg class="k-icon" aria-hidden="true"><use href="#i-lock"/></svg>${n === 1 ? t('stories.lockOne', { l: l - 1 }) : t('stories.lockMany', { n, l: l - 1 })}</p>` : ''}<ul class="st-shelf">${list.map(card).join('')}</ul>`; }).join('')}
    </section>`;
  }

  function reader(el, s) {
    const p = Store.current(), e = ex(p);
    if (!unlocked(p, s)) { location.replace('#/stories'); return; }
    const st = e.r[s.id] || {};
    if (!RD || RD.s !== s) RD = { s, pg: st.done ? 0 : Math.min(st.pg || 0, s.pages.length - 1), tapped: new Set(), showTa: false, playing: false, paused: false, tok: 0, timers: [], mode: e.mode || 'read' };
    RD.mode = e.mode || 'read';
    const ta = I18N.lang === 'ta';
    el.innerHTML = `<section class="page st-reader" data-subject="english" style="--st-size:${SIZES[sizeIdx(p)]}px">
      <div class="st-top"><a class="backlink" href="#/stories"><svg class="k-icon"><use href="#i-back"/></svg>${t('stories.title')}</a>
        <div class="st-tools">
          <div class="seg st-mode" role="group" aria-label="${t('stories.mode.label')}"><button type="button" data-mode="read" aria-pressed="${RD.mode === 'read'}">${t('stories.mode.read')}</button><button type="button" data-mode="self" aria-pressed="${RD.mode === 'self'}">${t('stories.mode.self')}</button></div>
          <div class="st-size" role="group" aria-label="${t('stories.size.label')}"><button type="button" class="st-sz" data-d="-1" aria-label="${t('stories.size.smaller')}">A<span aria-hidden="true">−</span></button><button type="button" class="st-sz big" data-d="1" aria-label="${t('stories.size.bigger')}">A<span aria-hidden="true">+</span></button></div>
        </div></div>
      <p class="eyebrow">${t('stories.lvl.' + s.lvl).split('·')[0].trim()} · ${esc(L(s.setting))}</p><h1 lang="en">${esc(s.title.en)}</h1>
      <div class="st-stage" id="stStage">
        <div class="st-artwrap"></div>
        <div class="st-textwrap">
          <div class="st-playrow"></div>
          <p class="st-text" lang="en" role="group" aria-label="${t('stories.storyText')}"></p>
          ${ta ? `<button type="button" class="k-btn k-btn-outline k-btn-sm pill st-tatoggle" aria-expanded="false" aria-controls="stTa"></button><p class="st-ta" id="stTa" lang="ta" hidden></p>` : ''}
          <div class="st-pop" role="dialog" hidden></div>
        </div>
      </div>
      <nav class="st-nav" aria-label="${t('stories.pagesNav')}">
        <button type="button" class="k-btn k-btn-outline st-prev"><svg class="k-icon" aria-hidden="true"><use href="#i-back"/></svg><span>${t('stories.prev')}</span></button>
        <div class="st-pgwrap"><span class="st-pgno" aria-live="polite"></span><div class="st-meter" aria-hidden="true">${s.pages.map(() => '<i></i>').join('')}</div></div>
        <button type="button" class="k-btn k-btn-primary st-next"><span>${t('stories.next')}</span><svg class="k-icon" aria-hidden="true"><use href="#i-next"/></svg></button>
      </nav>
      <p class="small muted st-help">${t('stories.tapHelp')}</p>
    </section>`;
    const sec = el.querySelector('.st-reader');
    sec.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { e.mode = RD.mode = b.dataset.mode; Store.save(); sec.querySelectorAll('[data-mode]').forEach(x => x.setAttribute('aria-pressed', x === b)); stopRead(); drawPlay(); if (RD.mode === 'read') readPage(); });
    sec.querySelectorAll('.st-sz').forEach(b => b.onclick = () => { const i = Math.max(0, Math.min(SIZES.length - 1, sizeIdx(p) + +b.dataset.d)); e.size = i; Store.save(); sec.style.setProperty('--st-size', SIZES[i] + 'px'); syncSize(); });
    const syncSize = () => { const i = sizeIdx(p); sec.querySelector('.st-sz[data-d="-1"]').disabled = i === 0; sec.querySelector('.st-sz[data-d="1"]').disabled = i === SIZES.length - 1; };
    syncSize();
    sec.querySelector('.st-prev').onclick = () => go(RD.pg - 1);
    sec.querySelector('.st-next').onclick = () => go(RD.pg + 1);
    const tg = sec.querySelector('.st-tatoggle');
    if (tg) tg.onclick = () => { RD.showTa = !RD.showTa; drawTa(); };
    // swipe to turn
    const stage = sec.querySelector('#stStage'); let sx = null, sy = 0;
    stage.addEventListener('pointerdown', ev => { if (ev.pointerType === 'mouse') return; sx = ev.clientX; sy = ev.clientY; });
    stage.addEventListener('pointerup', ev => { if (sx == null) return; const dx = ev.clientX - sx, dy = ev.clientY - sy; sx = null; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(RD.pg + (dx < 0 ? 1 : -1)); });
    stage.addEventListener('pointercancel', () => { sx = null; });
    // word taps
    sec.querySelector('.st-text').addEventListener('click', ev => { const w = ev.target.closest('.w'); if (w) openPop(w); });
    document.addEventListener('pointerdown', outside, true);
    drawPage(false);
    if (RD.mode === 'read') RD.timers.push(setTimeout(readPage, 450));
  }
  function outside(ev) { const pop = document.querySelector('.st-pop'); if (!pop) { document.removeEventListener('pointerdown', outside, true); return; } if (!pop.hidden && !pop.contains(ev.target) && !ev.target.closest?.('.st-text .w')) closePop(); }
  function drawPlay() {
    const row = document.querySelector('.st-playrow'); if (!row) return;
    row.innerHTML = RD.mode === 'read' ? `<button type="button" class="k-btn k-btn-outline pill st-play" aria-pressed="false"><svg class="k-icon" aria-hidden="true"><use href="#i-sound"/></svg><span>${t('stories.play')}</span></button>` : '';
    const b = row.querySelector('.st-play'); if (b) b.onclick = () => { if (RD.playing) { RD.paused = true; stopRead(); } else readPage(); };
    updatePlay();
  }
  function drawTa() {
    const tg = document.querySelector('.st-tatoggle'), box = document.getElementById('stTa'); if (!tg || !box) return;
    tg.textContent = RD.showTa ? t('stories.hideTa') : t('stories.showTa'); tg.setAttribute('aria-expanded', RD.showTa);
    box.textContent = RD.s.pages[RD.pg].ta; box.hidden = !RD.showTa;
  }
  function drawPage(animate) {
    const s = RD.s, page = s.pages[RD.pg], n = s.pages.length, sec = document.querySelector('.st-reader'); if (!sec) return;
    closePop();
    const artEl = sec.querySelector('.st-artwrap'), txt = sec.querySelector('.st-text');
    artEl.innerHTML = art(page);
    let pos = 0;
    txt.innerHTML = page.en.split(/(\s+)/).map(tok => { const st = page.en.indexOf(tok, pos); pos = st + tok.length; return /^\s+$/.test(tok) ? ' ' : tok ? `<button type="button" class="w" data-s="${st}">${esc(tok)}</button>` : ''; }).join('');
    drawPlay(); drawTa();
    sec.querySelector('.st-pgno').textContent = t('stories.pageOf', { a: RD.pg + 1, b: n });
    sec.querySelectorAll('.st-meter i').forEach((x, i) => x.className = i < RD.pg ? 'done' : i === RD.pg ? 'now' : '');
    sec.querySelector('.st-prev').disabled = RD.pg === 0;
    const nx = sec.querySelector('.st-next'); nx.querySelector('span').textContent = RD.pg === n - 1 ? t('stories.finish') : t('stories.next');
    if (animate && !reduced()) { const stg = sec.querySelector('.st-stage'); stg.classList.remove('turn-l', 'turn-r'); void stg.offsetWidth; stg.classList.add(animate < 0 ? 'turn-l' : 'turn-r'); }
    // save the place
    const p = Store.current(), e = ex(p), r = (e.r[s.id] ??= {}); if (!r.done || RD.pg > 0) { r.pg = RD.pg; Store.save(); }
  }
  function go(i) {
    if (!RD) return; const n = RD.s.pages.length;
    if (i < 0) return;
    stopRead();
    if (i >= n) { finishStory(); return; }
    const d = i - RD.pg; RD.pg = i; drawPage(d); if (RD.mode === 'read' && !RD.paused) RD.timers.push(setTimeout(readPage, 350));
  }
  function finishStory() {
    const p = Store.current(), e = ex(p), r = (e.r[RD.s.id] ??= {});
    r.done = true; r.pg = 0; r.at = Store.today(); Store.save(); RD.pg = 0;
    location.hash = `#/stories/${RD.s.id}/end`;
  }

  // ---------- word popover ----------
  let popFrom = null;
  function openPop(btn) {
    const pop = document.querySelector('.st-pop'); if (!pop || !RD) return;
    if (RD.playing) { RD.paused = true; stopRead(); }
    const info = lookup(btn.textContent, RD.s); if (!info) return;
    popFrom = btn;
    document.querySelectorAll('.st-text .w.picked').forEach(x => x.classList.remove('picked')); btn.classList.add('picked');
    Voice.play([en(info.shown)], null, { rate: rate() });
    const p = Store.current(), e = ex(p);
    let flagged = false;
    if (info.idx != null && (info.ta || info.pic)) {
      const it = { skill: 'e.storyword', lvl: 1, seed: seedFor(info.idx, WL.length) };
      Store.flagReview(p, SUBJ, { key: `${it.skill}|${it.lvl}|${it.seed}`, skill: it.skill, lvl: it.lvl, seed: it.seed });
      flagged = true;
    }
    RD.tapped.add(info.w); e.w = [info.w, ...e.w.filter(x => x !== info.w)].slice(0, 80); Store.save();
    const ph = info.pic ? pic(info.pic) : null;
    pop.setAttribute('aria-label', t('stories.pop.label', { w: info.shown }));
    pop.innerHTML = `<div class="st-pop-head"><p class="st-pop-w" lang="en">${esc(info.shown)}</p><button type="button" class="k-iconbtn st-pop-x" aria-label="${t('stories.pop.close')}"><svg class="k-icon"><use href="#i-close"/></svg></button></div>
      ${ph ? `<figure class="st-pop-pic"><img src="${ph.src}" alt="${esc(info.pic)}" referrerpolicy="no-referrer" onerror="this.closest('figure').classList.add('noimg')"><figcaption>${t('common.credit')}: <a href="${ph.page}" target="_blank" rel="noopener">${esc(ph.credit || 'Wikimedia Commons')}</a></figcaption></figure>` : ''}
      ${info.ta ? `<p class="st-pop-row"><span class="eyebrow">${t('stories.pop.meaningTa')}</span><span class="tamil-meaning" lang="ta">${esc(info.ta)}</span></p>` : ''}
      ${info.def ? `<p class="st-pop-row"><span class="eyebrow">${t('stories.pop.meaningEn')}</span><span lang="en">${esc(info.def)}</span></p>` : ''}
      ${!info.ta && !info.def ? `<p class="small muted">${t('stories.pop.none')}</p>` : ''}
      <div class="st-pop-foot">${Engine.listenBtn('st-pop-say')}${flagged ? `<span class="small muted">${t('stories.pop.added')}</span>` : ''}</div>`;
    pop.hidden = false;
    // place it under the word on wide screens; CSS turns it into a bottom sheet on phones
    const wrap = pop.parentElement.getBoundingClientRect(), b = btn.getBoundingClientRect();
    if (innerWidth >= 640) { const w = Math.min(320, wrap.width); pop.style.left = Math.max(0, Math.min(wrap.width - w, b.left - wrap.left - 20)) + 'px'; pop.style.top = (b.bottom - wrap.top + 8) + 'px'; }
    else { pop.style.left = ''; pop.style.top = ''; }
    pop.querySelector('.st-pop-x').onclick = () => closePop(true);
    Engine.bindListen(pop.querySelector('.st-pop-say'), () => [en(info.shown), ...(info.def ? [en(info.def)] : []), ...(I18N.lang === 'ta' && info.ta ? [{ text: info.ta, lang: 'ta' }] : [])]);
    pop.querySelector('.st-pop-x').focus({ preventScroll: true });
  }
  function closePop(refocus) {
    const pop = document.querySelector('.st-pop'); if (!pop || pop.hidden) return;
    pop.hidden = true; pop.innerHTML = '';
    document.querySelectorAll('.st-text .w.picked').forEach(x => x.classList.remove('picked'));
    if (refocus && popFrom && document.body.contains(popFrom)) popFrom.focus();
    popFrom = null;
  }

  // ---------- end of story: words learned, then the questions ----------
  function recapWords(s, tapped) {
    const list = [], seen = new Set();
    [...tapped].forEach(w => { const info = lookup(w, s); if (info && !seen.has(info.w) && (info.ta || info.def)) { seen.add(info.w); list.push({ ...info, tapped: true }); } });
    s.gloss.forEach(g => { if (!seen.has(g.w)) { seen.add(g.w); list.push({ w: g.w, shown: g.w, ta: g.ta, def: g.def, pic: pic(g.w) ? g.w : null }); } });
    return list;
  }
  const wordCard = x => `<li><button type="button" class="st-wcard" data-w="${esc(x.shown || x.w)}">${x.pic ? `<img src="${pic(x.pic).src}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}<span><b lang="en">${esc(x.shown || x.w)}</b>${x.ta ? `<span class="tamil-meaning" lang="ta">${esc(x.ta)}</span>` : ''}${x.def ? `<span class="small" lang="en">${esc(x.def)}</span>` : ''}<span class="small muted">${x.tapped ? t('stories.end.tapped') : t('stories.end.fromStory')}</span></span></button></li>`;
  function endPage(el, s) {
    const p = Store.current(), tapped = RD?.s === s ? RD.tapped : new Set(), nq = quizItems(p, s, tapped).length;
    el.innerHTML = `<section class="page st-end" data-subject="english">
      <a class="backlink" href="#/stories"><svg class="k-icon"><use href="#i-back"/></svg>${t('stories.title')}</a>
      <p class="eyebrow">${t('stories.end.eyebrow')}</p><div class="st-endhead"><h1>${t('stories.end.h1', { t: `<span lang="en">${esc(s.title.en)}</span>` })}</h1>${Engine.listenBtn('st-endsay')}</div>
      <p class="lede">${t('stories.end.lede', { n: nq })}</p>
      <h2 class="section">${t('stories.end.words')}</h2>
      <ul class="st-words">${recapWords(s, tapped).map(wordCard).join('')}</ul>
      <div class="row-actions"><a class="k-btn k-btn-outline pill" href="#/stories/${s.id}">${t('stories.end.again')}</a><a class="k-btn k-btn-primary k-btn-lg" href="#/stories/${s.id}/quiz">${t('stories.end.quiz')}</a></div>
    </section>`;
    Engine.bindListen(el.querySelector('.st-endsay'), () => [{ text: t('stories.end.h1', { t: '' }), lang: I18N.lang }, en(s.title.en), { text: t('stories.end.lede', { n: nq }), lang: I18N.lang }]);
    el.querySelectorAll('.st-wcard').forEach(b => b.onclick = () => Voice.play([en(b.dataset.w)], null, { rate: rate() }));
  }
  function quizItems(p, s, tapped) {
    const n = older(p) ? 4 : 3, idx = s.qs.map((_, i) => i);
    const pick = idx.sort(() => Math.random() - 0.5).slice(0, Math.min(n, idx.length)).sort((a, b) => s.qs[a].pg - s.qs[b].pg);
    const items = pick.map(i => storyItem(s.id, i));
    const gl = s.gloss.filter(g => tapped?.has(g.w)), g = (gl.length ? gl : s.gloss)[Math.floor(Math.random() * (gl.length || s.gloss.length))];
    items.push(wordItem(s.id + '|' + g.w));
    return items;
  }
  let lastQuiz = null;
  function startQuiz(s) {
    const p = Store.current(), tapped = RD?.s === s ? RD.tapped : new Set();
    lastQuiz = { id: s.id, tapped: [...tapped] };
    Engine.start({ items: quizItems(p, s, tapped), title: s.title.en, subject: SUBJ, topic: 'read', mode: 'story', back: '#/stories', again: () => startQuiz(s) });
  }
  // on the shared summary after a story round: save the score and add the words recap
  addEventListener('hashchange', () => {
    if (RD && !/^#\/stories\/[^/]+$/.test(location.hash)) { stopRead(); closePop(); }
    if (location.hash === '#/summary' && Engine.round?.mode === 'story' && lastQuiz) {
      const q = lastQuiz, s = byId[q.id];
      setTimeout(() => {
        const R = Engine.round, sum = document.querySelector('.summary'); if (!R?.summary || !sum || !s) return;
        const p = Store.current(), r = (ex(p).r[s.id] ??= {});
        if (!R.summary.quit) { r.q = [R.summary.right, R.summary.n]; r.done = true; Store.save(); }
        if (sum.querySelector('.st-recap')) return;
        const box = document.createElement('div'); box.className = 'st-recap';
        box.innerHTML = `<p class="eyebrow">${t('stories.end.words')}</p><ul class="st-words compact">${recapWords(s, new Set(q.tapped)).map(wordCard).join('')}</ul>`;
        sum.querySelector('.row-actions')?.before(box);
        box.querySelectorAll('.st-wcard').forEach(b => b.onclick = () => Voice.play([en(b.dataset.w)], null, { rate: rate() }));
      }, 0);
    }
  });

  // ---------- routes ----------
  window.ROUTES.stories = {
    render(el, parts) {
      const s = parts[1] && byId[parts[1]];
      if (!parts[1]) { if (RD) { stopRead(); RD = null; } return shelf(el); }
      if (!s) { location.replace('#/stories'); return; }
      if (parts[2] === 'quiz') { el.innerHTML = ''; startQuiz(s); return; }
      if (parts[2] === 'end') return endPage(el, s);
      reader(el, s);
    },
    keys(e) {
      const pop = document.querySelector('.st-pop');
      if (e.key === 'Escape' && pop && !pop.hidden) { e.preventDefault(); closePop(true); return; }
      if (!RD || !document.querySelector('.st-reader')) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(RD.pg + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(RD.pg - 1); }
    },
  };

  window.STORIES = { game: { title: 'stories.title', blurb: 'stories.blurb', icon: 'i-book', start() { location.hash = '#/stories'; } }, data: D, WL, QL, seedFor, lookup, storyItem, wordItem };
})();
