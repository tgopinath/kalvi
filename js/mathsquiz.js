// Maths quiz: a fast, mixed round of 10 drawn from the maths topics the child has unlocked.
// It does not repeat Maths practice or Puzzles: every question is a quick-fire format (pick a picture,
// true/false, pick the sign, which coins, which clock, word problems). Runs through the shared engine,
// so the hint ladder, lesson card, mastery and the review queue come for free.
// Modes: Quick 10 (no clock), Beat your best (older band: a quiet countdown ring per question).
(function () {
  const { skill } = Engine, V = VIS, S = 'maths', BEST = 'mq-best', QUICK = 'mathsquiz';
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const frac = (k, n) => (window.MATHS?.frac ? MATHS.frac(k, n) : `${k}/${n}`);
  const big = v => `<span class="bignum">${v}</span>`;
  const eqn = s => `<p class="bignum center mq-eqn">${s}</p>`;
  const box = '<span class="mbox">?</span>';
  const pair = (a, b) => `<div class="mq-pair">${a}${b}</div>`;
  const ladder = (a, b, c) => [{ text: a }, typeof b === 'string' ? { text: b } : b, typeof c === 'string' ? { text: c } : c];
  const sayNum = v => [{ text: I18N.numWord(v, I18N.lang), lang: I18N.lang }];

  // distinct distractors near the answer, inside [lo, hi]
  function near(r, ans, k, lo, hi, spread = 3) {
    const out = new Set([ans]); let s = spread, guard = 0;
    while (out.size < k && guard++ < 200) { const v = ans + r.int(-s, s); if (v >= lo && v <= hi) out.add(v); if (guard % 20 === 0) s++; }
    for (let v = lo; out.size < k && v <= hi + k; v++) out.add(v);
    return r.shuffle([...out]);
  }
  const numChoices = (vals, young) => vals.map(v => ({ v, html: big(v), ...(young ? { say: sayNum(v) } : {}) }));

  // ---------- real photos (vetted, from PICS) ----------
  const FRUITS = ['mango', 'apple', 'banana', 'orange', 'lemon', 'tomato', 'carrot'];   // img/counters: one whole object per picture
  const fruits = () => FRUITS;
  const things = f => t('mq.things.' + f);
  function picGrid(f, n, small) {
    const src = `img/counters/${f}.webp`; if (!f) return V.tenFrame({ n, frames: Math.max(1, Math.ceil(n / 10)) });
    let rows = ''; for (let i = 0; i < n; i += 5) rows += `<span class="mq-row">${`<img src="${src}" alt="" draggable="false">`.repeat(Math.min(5, n - i))}</span>`;
    return `<div class="mq-pics ${small ? 'sm' : ''}" role="img" aria-label="${t('mq.ui.picsOf', { things: things(f) })}">${rows}</div>`;
  }
  const photo = f => { const p = window.PICS?.[f]; return p ? { src: p.src, credit: p.credit, href: p.page, alt: things(f) } : undefined; };
  const frame = n => V.tenFrame({ n, frames: Math.max(1, Math.ceil(n / 10)) });
  const fivesStep = n => { const k = Math.floor(n / 5), rr = n % 5; return { text: k === 0 ? t('mq.y.ones', { n }) : rr ? t('mq.y.fives', { k, f: k * 5, r: rr, n }) : t('mq.y.fivesExact', { k, n }), vis: frame(n) }; };
  const wordStep = n => ({ text: t('mq.y.word', { n, en: I18N.numWord(n, 'en'), ta: I18N.numWord(n, 'ta') }) });

  // ---------- registration: every quiz skill gets the answer-revealing ladder and, in Beat your best, a ring ----------
  const SEC = { 'mq.word': 45, 'mq.money': 30, 'mq.estimate': 30, 'mq.frac': 25 };
  function ring(sec) {
    return `<svg class="mq-ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="bg" cx="22" cy="22" r="18"/><circle class="fg" cx="22" cy="22" r="18" pathLength="100" style="animation-duration:${sec}s"/></svg><span class="k-sr-only">${t('mq.ui.timeLimit', { s: sec })}</span>`;
  }
  const IDS = [];
  function reg(def) {
    IDS.push(def.id);
    return skill({ subject: S, topic: 'mathsquiz', ...def, gen(l, r, c) {
      const q = def.gen(l, r, c || {});
      q.hintRevealsAnswer = true;
      if (!q.say) q.say = [{ text: q.promptText || String(q.prompt).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), lang: I18N.lang }];
      if ((c || {}).band === 'young') q.autoSay = true;
      if (Engine.round?.mode === BEST) { if (!q.visual) q.boardClass = ((q.boardClass || '') + ' mq-ringonly').trim(); q.visual = `<div class="mq-timed ${q.visual ? '' : 'solo'}">${ring(SEC[def.id] || 20)}${q.visual || ''}</div>`; }
      return q;
    } });
  }

  // ======================= picture counting =======================
  reg({ id: 'mq.pics', name: 'mq.skill.pics', bands: { young: [1, 2], older: [2, 4] }, gen(l, r, c) {
    const lim = [[1, 5], [3, 10], [6, 15], [11, 20]][l - 1], n = r.int(...lim), f = r.pick(fruits().length ? fruits() : FRUITS);
    const young = c.band === 'young', asChoice = young || n <= 10;
    const q = { prompt: t('mq.q.howMany', { things: things(f) }), visual: picGrid(f, n), answer: n,
      hints: ladder(t('mq.h.pics1'), { text: n > 5 ? t('mq.h.pics2') : t('mq.h.pics2s'), vis: frame(Math.min(n, 5)) }, { text: t('mq.h.ans', { a: n }), vis: frame(n) }),
      why: { steps: [fivesStep(n), wordStep(n)] } };
    if (asChoice) Object.assign(q, { kind: 'choice', choices: numChoices(near(r, n, l === 1 ? 2 : 3, 1, 10, 2), young), answerText: String(n) });
    else q.kind = 'num';
    return q;
  } });

  // ======================= compare: more / fewer, > < = =======================
  reg({ id: 'mq.compare', name: 'mq.skill.compare', bands: { young: [1, 2], older: [2, 4] }, gen(l, r, c) {
    if (c.band === 'young' || l === 1) {
      const max = l === 1 ? 5 : 9; let a = r.int(1, max), b = r.int(1, max); while (b === a) b = r.int(1, max);
      const f = r.pick(fruits().length ? fruits() : FRUITS), more = l === 1 || r() < 0.6, hi = Math.max(a, b), lo = Math.min(a, b);
      const ans = more ? (a > b ? 'a' : 'b') : (a < b ? 'a' : 'b');
      return { kind: 'choice', prompt: t(more ? 'mq.q.more' : 'mq.q.fewer', { things: things(f) }),
        choices: [['a', a, 1], ['b', b, 2]].map(([v, n, i]) => ({ v, vis: picGrid(f, n, true), html: t('mq.ui.plate', { n: i }), say: [{ text: t('mq.ui.groupOf', { n, things: things(f) }), lang: I18N.lang }] })),
        answer: ans, answerText: t('mq.ui.groupOf', { n: more ? hi : lo, things: things(f) }),
        hints: ladder(t('mq.h.cmp1'), { text: t('mq.h.cmp2', { a, b }), vis: V.towers([a, b]) }, t('mq.h.pickPlate', { n: ans === 'a' ? 1 : 2 })),
        why: { steps: [{ text: t('mq.y.tower', { big: hi, small: lo }), vis: V.towers([a, b]) }, { text: more ? t('mq.y.moreIs', { big: hi, small: lo }) : t('mq.y.fewerIs', { big: hi, small: lo }) }] } };
    }
    const max = [0, 20, 99, 999][l - 1], min = l === 2 ? 1 : l === 3 ? 10 : 100;
    let a = r.int(min, max), b = r() < 0.15 ? a : r.int(min, max);
    if (b !== a && l >= 3 && r() < 0.5) { const s = String(a); b = +(s.slice(0, -1) + r.int(0, 9)); if (b < min) b = a; }  // close numbers: same leading digits
    const sign = a > b ? '>' : a < b ? '<' : '=';
    const A = String(Math.max(a, b)).padStart(3, '0'), B = String(Math.min(a, b)).padStart(3, '0'); let i = 0; while (i < 2 && A[i] === B[i]) i++;
    const bl = n => V.blocks({ h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 });
    const vis = l <= 3 ? pair(bl(a), bl(b)) : null;
    return { kind: 'choice', prompt: t('mq.q.sign'), promptText: t('mq.q.sign') + ` ${a}, ${b}`, visual: eqn(`${a} ${box} ${b}`), boardClass: 'light',
      choices: ['>', '<', '='].map(v => ({ v, html: big(v) })), answer: sign, answerText: `${a} ${sign} ${b}`,
      hints: ladder(t('mq.h.sign1'), { text: a === b ? t('mq.y.cmpSame') : t('mq.y.cmpLeft', { x: A[i], y: B[i] }), vis }, t('mq.h.ans', { a: `${a} ${sign} ${b}` })),
      why: { steps: [a === b ? { text: t('mq.y.cmpSame') } : { text: t('mq.y.cmpLeft', { x: A[i], y: B[i] }), vis }, { text: t('mq.y.signIs', { e: `${a} ${sign} ${b}` }) }], rule: t('mq.y.signRule') } };
  } });

  // ======================= quick sums =======================
  reg({ id: 'mq.sum', name: 'mq.skill.sum', bands: { young: [1, 2], older: [2, 4] }, gen(l, r, c) {
    if (c.band === 'young' || l === 1) {
      const s = l === 1 ? r.int(2, 5) : r.int(4, 10), a = r.int(1, s - 1), b = s - a, f = r.pick(fruits().length ? fruits() : FRUITS);
      return { kind: 'choice', prompt: t('mq.q.inAll', { a, b, things: things(f) }), visual: `<div class="mq-plus">${picGrid(f, a)}<b aria-hidden="true">+</b>${picGrid(f, b)}</div>`,
        choices: numChoices(near(r, s, 3, 1, 10, 2), c.band === 'young'), answer: s, answerText: String(s),
        hints: ladder(t('mq.h.add1'), { text: t('mq.y.countOn', { a: Math.max(a, b), b: Math.min(a, b), s: '…' }), vis: V.numberLine({ from: 0, to: 10, mark: Math.max(a, b), highlight: [Math.max(a, b)] }) }, { text: t('mq.h.ans', { a: s }), vis: V.tenFrame({ n: a, n2: b }) }),
        why: { steps: [{ text: t('mq.y.sumFrame', { a, b, s }), vis: V.tenFrame({ n: a, n2: b }) }, { text: t('mq.y.countOn', { a: Math.max(a, b), b: Math.min(a, b), s }), vis: V.numberLine({ from: 0, to: 10, hops: [[Math.max(a, b), s]], mark: s, highlight: [Math.max(a, b), s] }) }] } };
    }
    const add = l === 2 || r() < 0.55;
    if (l <= 3) {
      if (add) {
        const a = r.int(5, 9), b = r.int(l === 2 ? 2 : 3, 9), s = a + b, k = 10 - a, rr = b - k;
        const step = s > 10 ? { text: t('mq.h.make10', { a, k, r: rr }), vis: V.tenFrame({ n: a, n2: b, frames: 2 }) } : { text: t('mq.y.countOn', { a, b, s: '…' }) };
        return { kind: 'num', prompt: t('mq.q.sum'), promptText: `${a} + ${b}`, visual: eqn(`${a} + ${b} = ${box}`), boardClass: 'light', answer: s,
          hints: ladder(t('mq.h.add1'), step, t('mq.h.ans', { a: s })),
          why: { steps: [{ text: t('mq.y.sumFrame', { a, b, s }), vis: V.tenFrame({ n: a, n2: b, frames: 2 }) }, ...(s > 10 ? [{ text: t('mq.h.make10', { a, k, r: rr }) }] : []), { text: t('mq.y.so', { e: `${a} + ${b}`, r: s }) }] } };
      }
      const a = r.int(11, 18), b = r.int(a - 9, 9), res = a - b, k = a - 10;
      return { kind: 'num', prompt: t('mq.q.sum'), promptText: `${a} − ${b}`, visual: eqn(`${a} − ${b} = ${box}`), boardClass: 'light', answer: res,
        hints: ladder(t('mq.h.sub1', { a, b }), { text: t('mq.h.back10'), vis: V.numberLine({ from: Math.max(0, res - 1), to: a + 1, mark: a, highlight: [a, 10] }) }, t('mq.h.ans', { a: res })),
        why: { steps: [{ text: t('mq.y.takeAway', { a, b, r: res }), vis: V.tenFrame({ n: a, cross: b, frames: 2 }) }, { text: t('mq.y.backTen', { a, k, b, rest: b - k, r: res }), vis: V.numberLine({ from: Math.max(0, res - 1), to: a + 1, hops: k > 0 && k < b ? [[a, 10], [10, res]] : [[a, res]], mark: res, highlight: [a, 10, res] }) }, { text: t('mq.y.so', { e: `${a} − ${b}`, r: res }) }] } };
    }
    // level 4: two-digit number and whole tens, done in the head
    const a = r.int(21, 79), k = r.int(1, add ? Math.min(5, 9 - Math.floor(a / 10)) : Math.min(5, Math.floor(a / 10) - 1)), b = k * 10, res = add ? a + b : a - b;
    const tt = Math.floor(a / 10), o = a % 10, t2 = add ? tt + k : tt - k, op = add ? '+' : '−';
    return { kind: 'num', prompt: t('mq.q.sum'), promptText: `${a} ${op} ${b}`, visual: eqn(`${a} ${op} ${b} = ${box}`), boardClass: 'light', answer: res,
      hints: ladder(t('mq.h.tens1'), { text: t(add ? 'mq.y.tAdd' : 'mq.y.tSub', { k, t: tt, t2, o }), vis: V.blocks({ t: tt, o }) }, t('mq.h.ans', { a: res })),
      why: { steps: [{ text: t('mq.y.tO', { a, t: tt, o }), vis: V.blocks({ t: tt, o }) }, { text: t(add ? 'mq.y.tAdd' : 'mq.y.tSub', { k, t: tt, t2, o }), vis: V.blocks({ t: t2, o }) }, { text: t('mq.y.so', { e: `${a} ${op} ${b}`, r: res }) }] } };
  } });

  // ======================= missing number =======================
  reg({ id: 'mq.missing', name: 'mq.skill.missing', bands: { young: [1, 2], older: [2, 4] }, gen(l, r, c) {
    if (c.band === 'young' || l === 1) {
      const n = l === 1 ? r.int(3, 5) : r.int(6, 10), a = r.int(1, n - 1), b = n - a;
      return { kind: 'choice', prompt: t('mq.q.moreTo', { a, n }), visual: V.tenFrame({ n: a }), choices: numChoices(near(r, b, 3, 1, 9, 2), c.band === 'young'), answer: b, answerText: String(b),
        hints: ladder(t('mq.h.miss1', { a, n }), { text: t('mq.y.hopTo', { a, n, b: '…' }), vis: V.numberLine({ from: 0, to: 10, mark: a, highlight: [a, n] }) }, { text: t('mq.h.ans', { a: b }), vis: V.tenFrame({ n: a, n2: b }) }),
        why: { steps: [{ text: t('mq.y.hopTo', { a, n, b }), vis: V.numberLine({ from: 0, to: 10, hops: [[a, n]], mark: n, highlight: [a, n] }) }, { text: t('mq.y.moreTo', { a, b, n }), vis: V.tenFrame({ n: a, n2: b }) }] } };
    }
    let eq, ans, inv, full, vis;
    if (l === 2) { const a = r.int(4, 12), b = r.int(2, 8), s = a + b; ans = b; eq = `${a} + ${box} = ${s}`; inv = `${s} − ${a} = ${b}`; full = `${a} + ${b} = ${s}`;
      vis = V.numberLine({ from: Math.max(0, a - 1), to: Math.max(s + 1, a + 9), hops: [[a, s]], mark: s, highlight: [a, s] }); }
    else if (l === 3) { const a = r.int(3, 8) * 10 + r.int(0, 9), b = r.int(1, Math.floor(a / 10) - 1) * 10, d = a - b;
      if (r() < 0.5) { ans = b; eq = `${a} − ${box} = ${d}`; inv = `${a} − ${d} = ${b}`; full = `${a} − ${b} = ${d}`; } else { ans = d; eq = `${box} + ${b} = ${a}`; inv = `${a} − ${b} = ${d}`; full = `${d} + ${b} = ${a}`; }
      vis = V.blocks({ t: Math.floor(ans / 10), o: ans % 10 }); }
    else { const a = r.int(3, 9), b = r.int(3, 9), p = a * b; ans = b; eq = `${a} × ${box} = ${p}`; inv = `${p} ÷ ${a} = ${b}`; full = `${a} × ${b} = ${p}`; vis = p <= 48 ? V.array({ r: a, c: b }) : null; }
    const lo = Math.max(0, ans - 10), cs = near(r, ans, 3, Math.max(1, lo), ans + 10, l === 3 ? 10 : 2);
    return { kind: 'choice', prompt: t('mq.q.missing'), promptText: t('mq.q.missing') + ' ' + eq.replace(box, '?'), visual: eqn(eq), boardClass: 'light', choices: numChoices(cs), answer: ans, answerText: String(ans),
      hints: ladder(t('mq.h.inv1'), t('mq.h.inv2', { inv: inv.replace(/=.*$/, '').trim() }), { text: t('mq.h.ans', { a: ans }), vis }),
      why: { steps: [{ text: t('mq.y.inverse', { inv }), vis }, { text: t('mq.y.check', { full }) }] } };
  } });

  // ======================= true or false =======================
  reg({ id: 'mq.tf', name: 'mq.skill.tf', bands: { young: [1, 2], older: [2, 4] }, gen(l, r, c) {
    const yes = r() < 0.5, young = c.band === 'young';
    const icon = (i, k) => `<span class="mq-tficon"><svg class="k-icon" aria-hidden="true"><use href="#${i}"/></svg></span><span>${t(k)}</span>`;
    if (young || l === 1) {
      const n = l === 1 ? r.int(2, 5) : r.int(4, 10), cl = yes ? n : Math.max(1, n + (r() < 0.5 ? -1 : 1) * r.int(1, 2)), f = r.pick(fruits().length ? fruits() : FRUITS);
      const right = cl === n;
      return { kind: 'tf', prompt: t('mq.q.tfPic', { n: cl, things: things(f) }), visual: picGrid(f, n),
        choices: [{ v: true, html: icon('i-check', 'mq.ui.yes'), say: [{ text: t('mq.ui.yes'), lang: I18N.lang }] }, { v: false, html: icon('i-close', 'mq.ui.no'), say: [{ text: t('mq.ui.no'), lang: I18N.lang }] }],
        answer: right, answerText: t(right ? 'mq.ui.yes' : 'mq.ui.no'),
        hints: ladder(t('mq.h.tfPic1'), fivesStep(n), t('mq.h.ans', { a: t(right ? 'mq.ui.yes' : 'mq.ui.no') })),
        why: { steps: [fivesStep(n), { text: right ? t('mq.y.picTrue', { n, things: things(f) }) : t('mq.y.picFalse', { n, c: cl, things: things(f) }) }] } };
    }
    let e, res, vis;
    if (l === 2) { const a = r.int(3, 9), b = r.int(2, 9); e = `${a} + ${b}`; res = a + b; vis = V.tenFrame({ n: a, n2: b, frames: 2 }); }
    else if (l === 3) { const a = r.int(11, 19), b = r.int(2, 9); e = `${a} − ${b}`; res = a - b; vis = V.tenFrame({ n: a, cross: b, frames: 2 }); }
    else { const a = r.int(3, 9), b = r.int(3, 9); e = `${a} × ${b}`; res = a * b; vis = res <= 48 ? V.array({ r: a, c: b }) : null; }
    const claim = yes ? res : l === 4 ? res + (r() < 0.5 ? -1 : 1) * +e.split(' × ')[r() < 0.5 ? 0 : 1] : res + r.pick([-2, -1, 1, 2]);
    const right = claim === res;
    return { kind: 'tf', prompt: t('mq.q.tf'), promptText: t('mq.q.tf') + ` ${e} = ${claim}`, visual: eqn(`${e} = ${claim}`), boardClass: 'light',
      choices: [{ v: true, html: icon('i-check', 'common.true') }, { v: false, html: icon('i-close', 'common.false') }], answer: right,
      answerText: `${t(right ? 'common.true' : 'common.false')}: ${e} = ${res}`,
      hints: ladder(t('mq.h.tf1'), { text: t('mq.h.inv2', { inv: e }), vis }, t('mq.h.ans', { a: `${e} = ${res}` })),
      why: { steps: [{ text: l === 4 ? t('mq.y.arr', { a: e.split(' × ')[0], b: e.split(' × ')[1], p: res }) : t('mq.y.so', { e, r: res }), vis }, { text: right ? t('mq.y.tfTrue', { e, r: res }) : t('mq.y.tfFalse', { e, r: res, c: claim }) }] } };
  } });

  // ======================= pick the shape =======================
  const SIDES = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, rhombus: 4 };
  reg({ id: 'mq.shape', name: 'mq.skill.shape', bands: { young: [1, 2], older: [2, 4] }, gen(l, r, c) {
    const young = c.band === 'young';
    const tile = (x, i, solid) => ({ v: x, vis: solid ? V.solid(x, -35) : V.shape2d(x, { label: t('mq.ui.pic', { n: i + 1 }) }) });
    if (l >= 3 && !young && (l === 3 || r() < 0.5)) {
      const s = r.pick(V.SOLIDS), opts = r.shuffle([s, ...r.shuffle(V.SOLIDS.filter(x => x !== s)).slice(0, 2)]), idx = opts.indexOf(s);
      return { kind: 'choice', prompt: t('mq.q.shape', { s: t('m.shape.' + s) }), choices: opts.map((x, i) => tile(x, i, true)), answer: s, answerText: t('m.shape.' + s),
        hints: ladder(t('mq.y.solid', { s: t('m.shape.' + s), note: t('m.solidNote.' + s) }), { text: t('m.y.looks', { looks: t('m.solidLooks.' + s) }) }, { text: t('mq.h.pick', { n: idx + 1 }), vis: V.solid(s, -60) }),
        why: { steps: [{ text: t('mq.y.shapeIs', { s: t('m.shape.' + s) }), vis: V.solid(s, -60) }, { text: t('mq.y.solid', { s: t('m.shape.' + s), note: t('m.solidNote.' + s) }) }] } };
    }
    if (l === 4) {
      const polys = r.shuffle(['triangle', 'square', 'pentagon', 'hexagon']).slice(0, 3), s = r.pick(polys), n = SIDES[s], idx = polys.indexOf(s);
      return { kind: 'choice', prompt: t('mq.q.shapeSides', { n }), choices: polys.map((x, i) => tile(x, i)), answer: s, answerText: t('m.shape.' + s),
        hints: ladder(t('mq.h.sides1'), { text: t('mq.y.sidesIs', { n: SIDES[polys[(idx + 1) % 3]] }), vis: V.shape2d(polys[(idx + 1) % 3], { corners: true }) }, { text: t('mq.h.pick', { n: idx + 1 }), vis: V.shape2d(s, { corners: true }) }),
        why: { steps: [{ text: t('mq.y.sidesIs', { n }), vis: V.shape2d(s, { corners: true }) }, { text: t('mq.facts.' + s) }] } };
    }
    const pool = l === 1 ? ['triangle', 'square', 'circle', 'rectangle'] : ['triangle', 'square', 'circle', 'rectangle', 'hexagon', 'oval', 'pentagon', 'rhombus'];
    const s = r.pick(pool), others = r.shuffle(pool.filter(x => x !== s && !(['square', 'rhombus'].includes(x) && ['square', 'rhombus'].includes(s)) && !(['circle', 'oval'].includes(x) && ['circle', 'oval'].includes(s))));
    const opts = r.shuffle([s, ...others.slice(0, l === 1 ? 1 : 2)]), idx = opts.indexOf(s);
    return { kind: 'choice', prompt: t('mq.q.shape', { s: t('m.shape.' + s) }), choices: opts.map((x, i) => tile(x, i)), answer: s, answerText: t('m.shape.' + s),
      hints: ladder(t('mq.h.shape1'), { text: t('mq.facts.' + s), vis: V.shape2d(s, { corners: s !== 'circle' && s !== 'oval' }) }, t('mq.h.pick', { n: idx + 1 })),
      why: { steps: [{ text: t('mq.y.shapeIs', { s: t('m.shape.' + s) }), vis: V.shape2d(s, { corners: s !== 'circle' && s !== 'oval' }) }, { text: t('mq.facts.' + s) }] } };
  } });

  // ======================= read the clock =======================
  reg({ id: 'mq.clock', name: 'mq.skill.clock', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const h = r.int(1, 12), m = l === 1 ? 0 : l === 2 ? r.pick([0, 30]) : l === 3 ? r.pick([15, 30, 45]) : r.int(1, 11) * 5;
    const fmt = (H, M) => `${H}:${String(M).padStart(2, '0')}`, words = MATHS.timeWords(h, m);
    const cands = [[h % 12 + 1, m], [m / 5 || 12, h * 5 % 60], [h, (m + 30) % 60], [(h + 10) % 12 + 1, m], [h, (m + 15) % 60]].filter(([a, b]) => a >= 1 && a <= 12 && fmt(a, b) !== fmt(h, m));
    const uniq = [...new Map(cands.map(o => [fmt(...o), o])).values()];
    const opts = r.shuffle([[h, m], ...r.shuffle(uniq).slice(0, l === 1 ? 1 : 2)]), idx = opts.findIndex(([a, b]) => a === h && b === m);
    const where = m === 0 ? t('m.y.at') : m === 30 ? t('m.y.half') : t('m.y.past');
    return { kind: 'choice', prompt: `${t('mq.q.clock', { time: `<span class="mono">${fmt(h, m)}</span>` })}<span class="mq-sub">${words}</span>`, promptText: t('mq.q.clock', { time: words }),
      choices: opts.map(([a, b], i) => ({ v: fmt(a, b), vis: V.clock({ h: a, m: b, label: t('mq.ui.pic', { n: i + 1 }) }) })), answer: fmt(h, m), answerText: `${fmt(h, m)} · ${words}`,
      hints: ladder(t('mq.h.clock1'), { text: m === 0 ? t('m.y.minTop') : t('m.y.minHand', { k: m / 5, m }) }, { text: t('mq.h.pick', { n: idx + 1 }), vis: V.clock({ h, m }) }),
      why: { steps: [{ text: t('m.y.hourHand', { h, where }) }, { text: m === 0 ? t('m.y.minTop') : t('m.y.minHand', { k: m / 5, m }), vis: V.clock({ h, m }) }, { text: t('m.y.timeIs', { time: fmt(h, m), words }) }] } };
  } });

  // ======================= coins (coins only, never notes) =======================
  const cv = v => +String(v).replace('c', '');
  reg({ id: 'mq.money', name: 'mq.skill.money', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const pool = [[1, 2], [1, 2, 5], [1, 2, 5, 'c10'], [1, 2, 5, 'c10']][l - 1], T = r.int(...[[3, 6], [5, 10], [11, 25], [20, 40]][l - 1]);
    const make = target => { let rem = target, set = []; while (rem > 0) { const ok = pool.filter(v => cv(v) <= rem).sort((a, b) => cv(b) - cv(a)); const v = set.length > 3 ? ok[0] : r.pick(ok.slice(0, 2)); set.push(v); rem -= cv(v); } return set; };
    const sortSet = s => [...s].sort((a, b) => cv(b) - cv(a)), sum = s => s.reduce((a, v) => a + cv(v), 0);
    const good = sortSet(make(T)), sets = [good], k = l === 1 ? 2 : 3; let guard = 0;
    while (sets.length < k && guard++ < 80) {
      const s = [...good], i = r.int(0, s.length - 1), mode = r.int(0, 2);
      if (mode === 0) { const alt = pool.filter(v => v !== s[i]); s[i] = r.pick(alt); } else if (mode === 1 && s.length > 1) s.splice(i, 1); else s.push(r.pick(pool));
      const tot = sum(s); if (tot !== T && tot > 0 && s.length <= 7 && !sets.some(x => sum(x) === tot)) sets.push(sortSet(s));
    }
    for (let d = 1; sets.length < k; d++) if (!sets.some(x => sum(x) === T + d)) sets.push(sortSet([...good, ...Array(d).fill(1)]));
    const order = r.shuffle(sets.map((s, i) => i)), idx = order.indexOf(0), wrongI = order.findIndex(i => i !== 0);
    const line = s => s.map(v => '₹' + cv(v)).join(' + ');
    const steps = []; let run = 0; good.forEach((v, i) => { run += cv(v); steps.push({ text: i === 0 ? t('mq.y.coinStart', { v: cv(v) }) : t('mq.y.coinAdd', { v: cv(v), s: run }) }); });
    steps[steps.length - 1].vis = V.money(good, t('mq.ui.pic', { n: idx + 1 }));
    steps.push({ text: t('mq.y.coinTotal', { s: T }), vis: V.tenFrame({ n: Math.min(T, 40), frames: Math.ceil(Math.min(T, 40) / 10) }) });
    if (T > 20) steps[steps.length - 1].vis = V.blocks({ t: Math.floor(T / 10), o: T % 10 });
    const wrong = sets[order[wrongI]];
    return { kind: 'choice', prompt: t('mq.q.money', { n: T }), choices: order.map((si, i) => ({ v: 'k' + si, vis: V.money(sets[si], t('mq.ui.pic', { n: i + 1 })), html: t('mq.ui.pic', { n: i + 1 }) })),
      answer: 'k0', answerText: `${line(good)} = ₹${T}`,
      hints: ladder(t('mq.h.money1'), { text: t('mq.h.money2', { k: wrongI + 1, e: line(wrong), s: sum(wrong), n: T }), vis: V.money(wrong) }, { text: t('mq.h.pick', { n: idx + 1 }), vis: V.money(good) }),
      why: { steps } };
  } });

  // ======================= fraction of a picture (older) =======================
  reg({ id: 'mq.frac', name: 'mq.skill.frac', bands: { young: [1, 1], older: [2, 4] }, gen(l, r) {
    const n = l <= 2 ? r.pick([2, 3, 4]) : r.int(3, l === 3 ? 6 : 8), k = l <= 2 ? 1 : r.int(1, n - 1);
    const cands = [[k, n + 1], [k, n - 1], [n - k, n], [k + 1, n], [Math.max(1, k - 1), n], [k, n + 2], [1, n]].filter(([a, b]) => b >= 2 && a >= 1 && a < b && Math.abs(a / b - k / n) > 1e-9);
    const seen = new Set([k / n]), ds = []; for (const c of r.shuffle(cands)) { if (!seen.has(c[0] / c[1])) { seen.add(c[0] / c[1]); ds.push(c); } if (ds.length === 2) break; }
    const opts = r.shuffle([[k, n], ...ds]), idx = opts.findIndex(([a, b]) => a === k && b === n);
    const pic = ([a, b], i) => (r() < 0.5 || l === 2 ? V.fractionDisc({ n: b, k: a, label: t('mq.ui.pic', { n: i + 1 }) }) : V.fractionBars([{ n: b, k: a }], t('mq.ui.pic', { n: i + 1 })));
    return { kind: 'choice', prompt: t('mq.q.frac', { f: frac(k, n) }), promptText: t('mq.q.frac', { f: `${k} / ${n}` }),
      choices: opts.map((o, i) => ({ v: o.join('/'), vis: pic(o, i) })), answer: `${k}/${n}`, answerText: frac(k, n),
      hints: ladder(t('mq.h.frac1', { n }), { text: t('mq.h.frac2', { k, n }), vis: V.fractionBars([{ n, k }]) }, t('mq.h.pick', { n: idx + 1 })),
      why: { steps: [{ text: t('mq.y.fracDen', { n }), vis: V.fractionBars([{ n, k: 0 }]) }, { text: t('mq.y.fracNum', { k }), vis: V.fractionBars([{ n, k }]) }, { text: t('mq.y.fracSame', { f: frac(k, n) }), vis: V.fractionDisc({ n, k }) }] } };
  } });

  // ======================= word problems with Indian contexts (older) =======================
  const NAMES = ['meena', 'arun', 'kavin', 'nila'];
  reg({ id: 'mq.word', name: 'mq.skill.word', bands: { young: [1, 1], older: [2, 4] }, gen(l, r) {
    const name = t('mq.name.' + r.pick(NAMES));
    const KINDS = { 2: ['laddAdd', 'runs2', 'autoChange'], 3: ['laddShare', 'laddBox', 'runsNeed', 'autoChange'], 4: ['autoKm', 'runs3', 'laddShare', 'runsNeed'] };
    const kind = r.pick(KINDS[Math.min(4, Math.max(2, l))]);
    const bl = n => V.blocks({ h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 });
    let prompt, ans, op, e, eShow, steps, unit;
    if (kind === 'laddAdd') { const a = r.int(5, 15), b = r.int(3, 9); ans = a + b; op = 'wAdd'; e = `${a} + ${b}`; prompt = t('mq.w.laddAdd', { a, b });
      steps = [{ text: t('mq.y.sumFrame', { a, b, s: ans }), vis: V.tenFrame({ n: a, n2: b, frames: Math.ceil(ans / 10) }) }]; }
    else if (kind === 'runs2') { const a = r.int(2, 12), b = r.int(2, 12); ans = a + b; op = 'wAdd'; e = `${a} + ${b}`; prompt = t('mq.w.runs2', { name, a, b });
      steps = [{ text: t('mq.y.countOn', { a: Math.max(a, b), b: Math.min(a, b), s: ans }), vis: V.numberLine({ from: Math.max(a, b) - 1, to: Math.max(ans + 1, Math.max(a, b) + 9), hops: [[Math.max(a, b), ans]], mark: ans, highlight: [Math.max(a, b), ans] }) }]; }
    else if (kind === 'runs3') { const a = r.int(4, 14), b = r.int(4, 14), c = r.int(4, 14); ans = a + b + c; op = 'wAdd'; e = `${a} + ${b} + ${c}`; prompt = t('mq.w.runs3', { a, b, c });
      steps = [{ text: t('mq.y.so', { e: `${a} + ${b}`, r: a + b }), vis: bl(a + b) }, { text: t('mq.y.so', { e: `${a + b} + ${c}`, r: ans }), vis: bl(ans) }]; }
    else if (kind === 'autoChange') { const p = l === 2 ? 20 : r.pick([50, 100]); let f = l === 2 ? r.int(11, 19) : r.int(p - 37, p - 3); if (f % 10 === 0) f -= r.int(1, 4);
      ans = p - f; op = 'wSub'; e = `${p} − ${f}`; eShow = `₹${p} − ₹${f}`; unit = '₹'; prompt = t('mq.w.autoChange', { name, f, p });
      const nt = Math.ceil(f / 10) * 10, hop = V.numberLine({ from: nt - 10, to: nt, mark: nt, hops: [[f, nt]], highlight: [f, nt] });
      steps = [{ text: t('mq.y.change', { f, p, c: ans }), vis: hop }];
      if (nt < p) steps.push({ text: t('mq.y.changeTens', { nt, p, d1: nt - f, d2: p - nt, c: ans }), vis: bl(ans) }); }
    else if (kind === 'autoKm') { const rt = r.int(11, 16), k = r.int(2, 6), x = rt - 10; ans = rt * k; op = 'wMul'; e = `${rt} × ${k}`; eShow = `₹${rt} × ${k}`; unit = '₹'; prompt = t('mq.w.autoKm', { r: rt, k });
      steps = [{ text: t('mq.y.kmSplit', { r: rt, x, k, a: 10 * k, b: x * k }), vis: V.array({ r: k, c: 10 }) }, { text: t('mq.y.so', { e: `${10 * k} + ${x * k}`, r: ans }), vis: V.array({ r: k, c: x }) }]; }
    else if (kind === 'laddShare') { const k = r.int(2, 5), each = r.int(2, 6), n = k * each; ans = each; op = 'wDiv'; e = `${n} ÷ ${k}`; prompt = t('mq.w.laddShare', { n, k });
      steps = [{ text: t('mq.y.share', { e: each }), vis: V.plates({ k, each }) }, { text: t('mq.y.check', { full: `${k} × ${each} = ${n}` }) }]; }
    else if (kind === 'laddBox') { const b = r.int(2, 5), each = r.int(3, 6); ans = b * each; op = 'wMul'; e = `${b} × ${each}`; prompt = t('mq.w.laddBox', { b, e: each });
      steps = [{ text: t('mq.y.arr', { a: b, b: each, p: ans }), vis: V.array({ r: b, c: each }) }]; }
    else { const s = r.int(20, 80), need = r.int(3, 15), T = s + need; ans = need; op = 'wSub'; e = `${T} − ${s}`; prompt = t('mq.w.runsNeed', { T, s });
      steps = [{ text: t('mq.y.hopTo', { a: s, n: T, b: need }), vis: V.numberLine({ from: s - 1, to: Math.max(T + 1, s + 9), hops: [[s, T]], mark: T, highlight: [s, T] }) }]; }
    steps.unshift({ text: t('mq.h.' + op) });
    steps.push({ text: t('mq.y.so', { e: eShow || e, r: (unit || '') + ans }) });
    return { kind: 'num', unit, prompt, answer: ans,
      hints: ladder(t('mq.h.' + op), { text: t('mq.h.inv2', { inv: e }), vis: steps[1].vis }, t('mq.h.ans', { a: (unit || '') + ans })), why: { steps } };
  } });

  // ======================= estimate (older) =======================
  reg({ id: 'mq.estimate', name: 'mq.skill.estimate', bands: { young: [1, 1], older: [2, 4] }, gen(l, r) {
    const nz = (a, b) => { let v; do v = r.int(a, b); while (v % 10 === 5 || v % 10 === 0); return v; };
    const r10 = v => Math.round(v / 10) * 10, line10 = v => V.numberLine({ from: Math.floor(v / 10) * 10, to: Math.floor(v / 10) * 10 + 10, mark: v, highlight: [v, r10(v)] });
    if (l === 2) {
      const n = nz(11, 98), lo = Math.floor(n / 10) * 10, hi = lo + 10, nr = r10(n), far = nr === lo ? hi : lo;
      return { kind: 'choice', prompt: t('mq.q.round10', { n }), visual: V.numberLine({ from: lo, to: hi, mark: n, highlight: [n] }), choices: numChoices([lo, hi]), answer: nr, answerText: String(nr),
        hints: ladder(t('mq.h.r10a', { n }), { text: t('mq.h.r10b', { n, near: nr, far, d: Math.abs(n - nr), d2: Math.abs(n - far) }) }, t('mq.h.ans', { a: nr })),
        why: { steps: [{ text: t('mq.y.rnd', { n, r: nr }), vis: line10(n) }, { text: t('mq.h.r10b', { n, near: nr, far, d: Math.abs(n - nr), d2: Math.abs(n - far) }) }], rule: t('mq.y.r5rule') } };
    }
    let a, b, ra, rb, s, x, e, hundreds = false;
    if (l === 3) { a = nz(12, 68); b = nz(12, 68); ra = r10(a); rb = r10(b); s = ra + rb; x = a + b; e = `${a} + ${b}`; }
    else if (r() < 0.5) { hundreds = true; a = r.int(110, 480); b = r.int(110, 480); while (a % 100 >= 40 && a % 100 <= 60) a = r.int(110, 480); while (b % 100 >= 40 && b % 100 <= 60) b = r.int(110, 480); ra = Math.round(a / 100) * 100; rb = Math.round(b / 100) * 100; s = ra + rb; x = a + b; e = `${a} + ${b}`; }
    else { a = r.pick([19, 21, 29, 31, 39, 41, 49, 51, 18, 22]); b = r.int(3, 6); ra = r10(a); rb = b; s = ra * b; x = a * b; e = `${a} × ${b}`; }
    const gap = hundreds ? 200 : e.includes('×') ? Math.max(20, b * 10) : 20;
    const cs = r.shuffle([s, s + gap, Math.max(gap / 2, s - gap)].filter((v, i, arr) => arr.indexOf(v) === i));
    const vis = hundreds ? null : line10(a), rounded = e.includes('×') ? `${ra} × ${rb}` : `${ra} + ${rb}`;
    const est2 = t(e.includes('×') ? 'mq.h.est2p' : 'mq.h.est2', { a, b, ra, rb });
    return { kind: 'choice', prompt: t('mq.q.about', { e }), promptText: t('mq.q.about', { e }), visual: eqn(`${e} ≈ ${box}`), boardClass: 'light', choices: numChoices(cs), answer: s, answerText: String(s),
      hints: ladder(t(hundreds ? 'mq.h.est1h' : 'mq.h.est1'), { text: est2, vis }, t('mq.h.ans', { a: s })),
      why: { steps: [{ text: est2, vis }, { text: t('mq.y.estSum', { e: rounded, s }) }, { text: t('mq.y.exact', { x, s }) }], rule: t('mq.y.estRule') } };
  } });

  // ======================= which quiz skills fit which maths topic =======================
  const MAP = { count: ['mq.pics', 'mq.compare', 'mq.tf'], place: ['mq.compare', 'mq.estimate'], add: ['mq.sum', 'mq.missing', 'mq.tf', 'mq.word'], sub: ['mq.sum', 'mq.missing', 'mq.word'],
    mul: ['mq.tf', 'mq.missing', 'mq.word', 'mq.estimate'], div: ['mq.word'], frac: ['mq.frac'], shapes: ['mq.shape'], measure: ['mq.clock', 'mq.money', 'mq.word'] };
  const YOUNG = ['mq.pics', 'mq.compare', 'mq.sum', 'mq.missing', 'mq.tf', 'mq.shape', 'mq.clock', 'mq.money'];
  function pool(p, topicId) {
    const tps = (window.App?.SUBJ?.maths?.topics || MATHS.TOPICS).filter(tp => (window.App?.forBand ? App.forBand(tp, p) : true) && (!topicId || tp.id === topicId));
    let ids = [...new Set(tps.flatMap(tp => MAP[tp.id] || []))];
    if (AGE.band(p) === 'young') ids = ids.filter(id => YOUNG.includes(id));
    if (!ids.length) ids = topicId ? pool(p) : (AGE.band(p) === 'young' ? YOUNG : IDS);
    return ids.filter(id => Engine.SK[id]);
  }
  function items(p, ids, n = 10) {
    const due = Store.due(p, S).filter(r => ids.includes(r.skill)).slice(0, 4).map(r => ({ skill: r.skill, lvl: r.lvl, seed: r.seed }));
    return [...due, ...Engine.weighted(p, ids, n - due.length)];
  }

  // ---------- Beat your best: time-out and the personal best ----------
  const ex = p => { p.extras ??= {}; return p.extras.mathsquiz ??= { best: null, runs: 0 }; };
  document.addEventListener('animationend', e => {
    if (!e.target.closest?.('.mq-ring')) return;
    const R = Engine.round; if (!R || R.answered || R.mode !== BEST) return;
    const btn = document.querySelector('.round .checkbtn'); if (!btn) return;
    R.revealed = true; btn.disabled = false; btn.click();
    const card = document.querySelector('.lessoncard'); if (!card) return;
    card.querySelector('.lc-answer .muted')?.remove();
    card.querySelector('.lc-head')?.insertAdjacentHTML('afterend', `<p class="mq-timeup">${t('mq.ui.timeUp')}</p>`);
  });
  addEventListener('hashchange', () => {
    if (location.hash !== '#/summary') return;
    const R = Engine.round; if (!R || R.mode !== BEST || !R.summary || R.summary.mq) return;
    R.summary.mq = 1; const p = Store.current(), x = ex(p), s = R.summary, ms = Date.now() - R.t0;
    let isNew = false;
    if (!s.quit && s.n === R.items.length) {
      x.runs = (x.runs || 0) + 1;
      if (!x.best || s.right > x.best.right || (s.right === x.best.right && ms < x.best.ms)) { x.best = { right: s.right, n: s.n, ms, date: Store.today() }; isNew = true; }
      Store.save();
    }
    setTimeout(() => {
      const el = document.querySelector('.summary .sum-score'); if (!el || !x.best) return;
      el.insertAdjacentHTML('afterend', `<p class="mq-best">${t(isNew ? 'mq.ui.newBest' : 'mq.ui.bestIs', { a: x.best.right, b: x.best.n })}</p>`);
    }, 80);
  });

  // ---------- starting rounds ----------
  function run(p, mode, topicId) {
    const ids = pool(p, topicId), tp = topicId && MATHS.TOPICS.find(x => x.id === topicId);
    Engine.start({ items: items(p, ids, 10), title: tp ? `${t('mq.title')} · ${t(tp.title)}` : t('mq.title'), subject: S, topic: 'mathsquiz', mode,
      back: topicId ? `#/t/maths/${topicId}` : '#/s/maths', again: () => run(Store.current() || p, mode, topicId) });
  }
  function choose(p) {
    if (AGE.band(p) === 'young' || !window.App?.dialog) return run(p, QUICK);
    const b = ex(p).best;
    App.dialog(`<h2 class="k-dialog-title">${t('mq.title')}</h2><p class="muted">${t('mq.ui.choose')}</p>
      <div class="mq-modes">
        <button type="button" class="k-card mq-mode" data-m="quick"><span class="eyebrow">${t('mq.ui.quick')}</span><span>${t('mq.ui.quickD')}</span></button>
        <button type="button" class="k-card mq-mode" data-m="best"><span class="eyebrow">${t('mq.ui.best')}</span><span>${t('mq.ui.bestD')}</span><span class="small muted">${b ? t('mq.ui.bestIs', { a: b.right, b: b.n }) : t('mq.ui.noBest')}</span></button>
      </div><div class="row-actions"><button type="button" class="k-btn k-btn-ghost" data-close>${t('common.cancel')}</button></div>`,
    d => d.querySelectorAll('.mq-mode').forEach(x => x.onclick = () => { App.closeDialog(); run(p, x.dataset.m === 'best' ? BEST : QUICK); }));
  }
  const game = { title: 'mq.title', blurb: 'mq.blurb', icon: 'i-quiz', start: p => choose(p) };
  function topic(p, topicId) { run(p, QUICK, topicId); }
  // n items that stay the same all day for this child (warm-up)
  function daily(p, n = 2) {
    const ids = pool(p); const key = `${Store.today()}|${p.id || ''}`; let h = 2166136261;
    for (const ch of key) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
    const out = [];
    for (let i = 0; i < n; i++) {
      const id = ids[(h + i * 7919) % ids.length], seed = (Math.imul(h ^ (i + 1), 2654435761) >>> 0) & 0x7fffffff;
      out.push({ ...Engine.itemFor(p, id), seed: seed || 1 });
    }
    return out;
  }

  I18N.add({ mq: {
    title: ['Maths quiz', 'கணக்கு வினாடி வினா'],
    blurb: ['Ten quick, mixed questions from everything you have learnt', 'நீ கற்ற எல்லாவற்றிலிருந்தும் பத்து விரைவான கலவைக் கேள்விகள்'],
    skill: { pics: ['Count the pictures', 'படங்களை எண்ணு'], compare: ['More or less', 'அதிகமா, குறைவா'], sum: ['Quick sums', 'விரைவுக் கணக்கு'], missing: ['Missing number', 'விடுபட்ட எண்'],
      tf: ['True or false', 'சரியா, தவறா'], shape: ['Pick the shape', 'வடிவத்தைத் தேர்ந்தெடு'], clock: ['Read the clock', 'கடிகாரம் பார்'], money: ['Coins', 'நாணயங்கள்'],
      frac: ['Fraction of a picture', 'படத்தில் பின்னம் (fraction)'], word: ['Word problems', 'கதைக் கணக்குகள்'], estimate: ['Estimate', 'தோராயம் (estimate)'] },
    things: { mango: ['mangoes', 'மாம்பழங்கள்'], apple: ['apples', 'ஆப்பிள்கள்'], banana: ['bananas', 'வாழைப்பழங்கள்'], orange: ['oranges', 'ஆரஞ்சுப் பழங்கள்'],
      lemon: ['lemons', 'எலுமிச்சம்பழங்கள்'], tomato: ['tomatoes', 'தக்காளிகள்'], coconut: ['coconuts', 'தேங்காய்கள்'], carrot: ['carrots', 'கேரட்டுகள்'] },
    name: { meena: ['Meena', 'மீனா'], arun: ['Arun', 'அருண்'], kavin: ['Kavin', 'கவின்'], nila: ['Nila', 'நிலா'] },
    ui: {
      picsOf: ['a picture of {things}', '{things} உள்ள படம்'], groupOf: ['{n} {things}', '{n} {things}'], plate: ['Plate {n}', 'தட்டு {n}'], pic: ['Picture {n}', 'படம் {n}'],
      yes: ['Yes', 'ஆம்'], no: ['No', 'இல்லை'],
      choose: ['Pick how you want to play.', 'எப்படி விளையாட வேண்டும் என்று தேர்ந்தெடு.'],
      quick: ['Quick 10', 'விரைவு 10'], quickD: ['Ten questions and no clock. Take your time.', 'பத்து கேள்விகள், நேரக் கட்டுப்பாடு இல்லை. நிதானமாகச் செய்.'],
      best: ['Beat your best', 'உன் சாதனையை முறியடி'], bestD: ['A quiet ring shows the time left for each question.', 'ஒவ்வொரு கேள்விக்கும் மீதமுள்ள நேரத்தை ஒரு வளையம் அமைதியாகக் காட்டும்.'],
      bestIs: ['Your best: {a} of {b}', 'உன் சிறந்த மதிப்பெண்: {b}-இல் {a}'], noBest: ['No best score yet', 'இன்னும் சிறந்த மதிப்பெண் இல்லை'],
      newBest: ['New personal best: {a} of {b}', 'புதிய சாதனை: {b}-இல் {a}'],
      timeUp: ['Time ran out on this one. Here is how it works.', 'இந்தக் கேள்விக்கான நேரம் முடிந்தது. இது எப்படி என்று பார்.'],
      timeLimit: ['You have {s} seconds for this question', 'இந்தக் கேள்விக்கு உனக்கு {s} விநாடிகள் உள்ளன'],
    },
    q: {
      howMany: ['How many {things}?', 'எத்தனை {things}?'],
      more: ['Which plate has more {things}?', 'எந்தத் தட்டில் அதிக {things} உள்ளன?'], fewer: ['Which plate has fewer {things}?', 'எந்தத் தட்டில் குறைவான {things} உள்ளன?'],
      sign: ['Which sign goes in the box?', 'கட்டத்தில் எந்தக் குறி வரும்?'],
      inAll: ['{a} {things} and {b} more. How many in all?', '{a} {things}, இன்னும் {b}. மொத்தம் எத்தனை?'],
      sum: ['Work it out in your head.', 'மனக்கணக்காகச் செய்.'],
      moreTo: ['Here are {a}. How many more make {n}?', 'இங்கே {a} உள்ளன. {n} ஆக இன்னும் எத்தனை வேண்டும்?'],
      missing: ['Which number goes in the box?', 'கட்டத்தில் எந்த எண் வரும்?'],
      tfPic: ['Are there {n} {things}?', 'இங்கே {n} {things} உள்ளனவா?'], tf: ['True or false?', 'சரியா, தவறா?'],
      shape: ['Which one is a {s}?', 'இவற்றில் {s} எது?'], shapeSides: ['Which shape has {n} sides?', 'எந்த வடிவத்துக்கு {n} பக்கங்கள் உள்ளன?'],
      clock: ['Which clock shows {time}?', '{time} காட்டும் கடிகாரம் எது?'],
      money: ['Which coins make ₹{n}?', 'எந்த நாணயங்கள் சேர்ந்தால் ₹{n} ஆகும்?'],
      frac: ['Which picture has {f} shaded?', 'எந்தப் படத்தில் {f} பகுதி நிழலிடப்பட்டுள்ளது?'],
      round10: ['Which ten is {n} closest to?', '{n} எந்தப் பத்துக்கு மிக அருகில் உள்ளது?'],
      about: ['About how much is {e}? Round first, then work it out.', '{e} தோராயமாக எவ்வளவு? முதலில் முழுமையாக்கு (round), பிறகு கணக்கிடு.'],
    },
    w: {
      laddAdd: ['Paati made {a} laddus. Then she made {b} more. How many laddus are there now?', 'பாட்டி {a} லட்டுகள் செய்தார். பிறகு இன்னும் {b} லட்டுகள் செய்தார். இப்போது மொத்தம் எத்தனை லட்டுகள்?'],
      laddShare: ['{n} laddus are shared equally among {k} children. How many laddus does each child get?', '{n} லட்டுகளை {k} குழந்தைகளுக்குச் சமமாகப் பகிர்ந்தால், ஒவ்வொருவருக்கும் எத்தனை லட்டுகள் கிடைக்கும்?'],
      laddBox: ['There are {b} boxes with {e} laddus in each box. How many laddus in all?', '{b} பெட்டிகள் உள்ளன. ஒவ்வொரு பெட்டியிலும் {e} லட்டுகள். மொத்தம் எத்தனை லட்டுகள்?'],
      autoChange: ['The auto fare is ₹{f}. {name} pays with ₹{p}. How much change comes back?', 'ஆட்டோ கட்டணம் ₹{f}. {name} ₹{p} கொடுத்தார். திரும்பக் கிடைக்கும் மீதிச் சில்லறை எவ்வளவு?'],
      autoKm: ['An auto charges ₹{r} for each kilometre. The ride is {k} km. What is the auto fare?', 'ஆட்டோவுக்கு ஒரு கிலோமீட்டருக்கு ₹{r} கட்டணம். பயணம் {k} கி.மீ. மொத்த ஆட்டோ கட்டணம் எவ்வளவு?'],
      runs2: ['{name} scored {a} runs in the first over and {b} runs in the second over. How many runs in all?', '{name} முதல் ஓவரில் {a} ஓட்டங்களும் இரண்டாவது ஓவரில் {b} ஓட்டங்களும் எடுத்தார். மொத்தம் எத்தனை ஓட்டங்கள்?'],
      runs3: ['In three overs the team scored {a}, {b} and {c} runs. How many runs in all?', 'மூன்று ஓவர்களில் அணி {a}, {b}, {c} ஓட்டங்கள் எடுத்தது. மொத்தம் எத்தனை ஓட்டங்கள்?'],
      runsNeed: ['The team needs {T} runs to win. They have {s} runs. How many more runs do they need?', 'வெற்றி பெற அணிக்கு {T} ஓட்டங்கள் வேண்டும். இப்போது {s} ஓட்டங்கள் உள்ளன. இன்னும் எத்தனை ஓட்டங்கள் வேண்டும்?'],
    },
    h: {
      ans: ['The answer is {a}.', 'விடை {a}.'], pick: ['It is picture {n}.', 'விடை படம் {n}.'], pickPlate: ['It is plate {n}.', 'விடை தட்டு {n}.'],
      pics1: ['Touch each one as you count, and say the number out loud.', 'ஒவ்வொன்றையும் தொட்டு எண்ணு. எண்ணைச் சத்தமாகச் சொல்.'],
      pics2: ['Each full row has 5. Count the rows in fives, then count on.', 'ஒவ்வொரு முழு வரிசையிலும் 5 உள்ளன. வரிசைகளை ஐந்து ஐந்தாக எண்ணி, பிறகு தொடர்ந்து எண்ணு.'],
      pics2s: ['Count along the row: 1, 2, 3 and so on.', 'வரிசையில் எண்ணு: 1, 2, 3 என்று.'],
      cmp1: ['Count each plate. The bigger number means more.', 'ஒவ்வொரு தட்டையும் எண்ணு. பெரிய எண் என்றால் அதிகம்.'],
      cmp2: ['One plate has {a}, the other has {b}.', 'ஒரு தட்டில் {a}, மற்றதில் {b}.'],
      sign1: ['The open mouth of the sign always faces the bigger number.', 'குறியின் திறந்த வாய் எப்போதும் பெரிய எண்ணை நோக்கி இருக்கும்.'],
      add1: ['Start from the bigger number and count on.', 'பெரிய எண்ணிலிருந்து தொடங்கி முன்னோக்கி எண்ணு.'],
      sub1: ['Start at {a} and count back {b}.', '{a}-இலிருந்து {b} பின்னோக்கி எண்ணு.'],
      make10: ['Make a ten first: {a} + {k} = 10, then add the {r} left over.', 'முதலில் பத்து ஆக்கு: {a} + {k} = 10, பிறகு மீதமுள்ள {r}-ஐக் கூட்டு.'],
      back10: ['Go back to 10 first, then take away the rest.', 'முதலில் 10-க்குப் பின்னோக்கிச் செல், பிறகு மீதியைக் கழி.'],
      tens1: ['Only the tens change. Work with the tens first.', 'பத்துகள் மட்டுமே மாறும். முதலில் பத்துகளைக் கணக்கிடு.'],
      miss1: ['Count on from {a} until you reach {n}.', '{a}-இலிருந்து {n} வரை முன்னோக்கி எண்ணு.'],
      inv1: ['Use the opposite operation to find the hidden number.', 'எதிர்ச் செயலைப் பயன்படுத்தி மறைந்த எண்ணைக் கண்டுபிடி.'],
      inv2: ['Work out {inv}.', '{inv} கணக்கிடு.'],
      tf1: ['Work out the left side yourself, then compare.', 'இடப்பக்கத்தை நீயே கணக்கிட்டு, பிறகு ஒப்பிடு.'],
      tfPic1: ['Count the pictures carefully, one by one.', 'படங்களை ஒவ்வொன்றாகக் கவனமாக எண்ணு.'],
      sides1: ['Count the sides of each shape, going round the edge.', 'ஒவ்வொரு வடிவத்தின் விளிம்பைச் சுற்றிப் பக்கங்களை எண்ணு.'],
      clock1: ['The short hand shows the hour. The long hand shows the minutes.', 'சிறிய முள் மணியைக் காட்டும். பெரிய முள் நிமிடத்தைக் காட்டும்.'],
      money1: ['Start with the biggest coin, then add the others one by one.', 'பெரிய நாணயத்திலிருந்து தொடங்கி, மற்றவற்றை ஒவ்வொன்றாகக் கூட்டு.'],
      money2: ['Picture {k}: {e} = ₹{s}. That is not ₹{n}.', 'படம் {k}: {e} = ₹{s}. அது ₹{n} அல்ல.'],
      frac1: ['Look for a shape cut into {n} equal parts.', '{n} சம பாகங்களாகப் பிரிக்கப்பட்ட வடிவத்தைத் தேடு.'],
      frac2: ['Then check that {k} of the {n} parts are shaded.', 'பிறகு {n} பாகங்களில் {k} பாகம் நிழலிடப்பட்டுள்ளதா என்று பார்.'],
      wAdd: ['Putting two amounts together means add.', 'இரண்டு அளவுகளைச் சேர்ப்பது கூட்டல்.'],
      wSub: ['Finding what is left, or how many more, means take away.', 'மீதி எவ்வளவு அல்லது இன்னும் எத்தனை என்று கண்டுபிடிப்பது கழித்தல்.'],
      wMul: ['The same amount again and again means multiply.', 'அதே அளவு திரும்பத் திரும்ப வந்தால் பெருக்கல்.'],
      wDiv: ['Sharing equally means divide.', 'சமமாகப் பகிர்வது வகுத்தல்.'],
      est1: ['Round each number to the nearest ten first.', 'முதலில் ஒவ்வொரு எண்ணையும் அருகிலுள்ள பத்துக்கு முழுமையாக்கு.'],
      est1h: ['Round each number to the nearest hundred first.', 'முதலில் ஒவ்வொரு எண்ணையும் அருகிலுள்ள நூறுக்கு முழுமையாக்கு.'],
      est2: ['{a} is about {ra}, and {b} is about {rb}.', '{a} சுமார் {ra}, {b} சுமார் {rb}.'], est2p: ['{a} is about {ra}.', '{a} சுமார் {ra}.'],
      shape1: ['Look at the sides and corners of each shape.', 'ஒவ்வொரு வடிவத்தின் பக்கங்களையும் மூலைகளையும் கவனி.'],
      r10a: ['Find {n} on the number line. Which ten is nearer?', 'எண்கோட்டில் {n}-ஐக் கண்டுபிடி. எந்தப் பத்து அருகில் உள்ளது?'],
      r10b: ['{n} is {d} away from {near} and {d2} away from {far}.', '{n}, {near}-இலிருந்து {d} தொலைவிலும் {far}-இலிருந்து {d2} தொலைவிலும் உள்ளது.'],
    },
    facts: {
      triangle: ['A triangle has 3 straight sides and 3 corners.', 'முக்கோணத்துக்கு 3 நேர் பக்கங்களும் 3 மூலைகளும் உண்டு.'],
      square: ['A square has 4 equal sides and 4 corners.', 'சதுரத்துக்கு 4 சம பக்கங்களும் 4 மூலைகளும் உண்டு.'],
      rectangle: ['A rectangle has 4 sides: two long and two short.', 'செவ்வகத்துக்கு 4 பக்கங்கள்: இரண்டு நீளம், இரண்டு குட்டை.'],
      pentagon: ['A pentagon has 5 sides and 5 corners.', 'ஐங்கோணத்துக்கு 5 பக்கங்களும் 5 மூலைகளும் உண்டு.'],
      hexagon: ['A hexagon has 6 sides and 6 corners.', 'அறுகோணத்துக்கு 6 பக்கங்களும் 6 மூலைகளும் உண்டு.'],
      circle: ['A circle is perfectly round. It has no corners.', 'வட்டம் முழுவதும் உருண்டையானது. அதற்கு மூலைகள் இல்லை.'],
      oval: ['An oval is like a stretched circle, the shape of an egg.', 'நீள்வட்டம் நீட்டிய வட்டம் போன்றது, முட்டையின் வடிவம்.'],
      rhombus: ['A rhombus has 4 equal sides, like a square pushed over.', 'சாய்சதுரத்துக்கு 4 சம பக்கங்கள், சாய்த்த சதுரம் போல.'],
    },
    y: {
      fives: ['{k} full rows of 5 make {f}. {r} more make {n}.', '5 கொண்ட {k} முழு வரிசைகள் = {f}. இன்னும் {r} சேர்த்தால் {n}.'],
      fivesExact: ['{k} full rows of 5 make {n}.', '5 கொண்ட {k} முழு வரிசைகள் = {n}.'],
      ones: ['Count them one by one. The last number you say tells how many: {n}.', 'ஒவ்வொன்றாக எண்ணு. கடைசியாகச் சொல்லும் எண்தான் மொத்தம்: {n}.'],
      word: ['{n} is “{en}” in English and “{ta}” in Tamil.', '{n} என்பது ஆங்கிலத்தில் “{en}”, தமிழில் “{ta}”.'],
      tower: ['Stack them into towers. The taller tower has {big}, the shorter one has {small}.', 'அவற்றைக் கோபுரங்களாக அடுக்கு. உயரமான கோபுரத்தில் {big}, குட்டையானதில் {small}.'],
      moreIs: ['So {big} is more than {small}.', 'ஆகவே {big}, {small}-ஐ விட அதிகம்.'],
      fewerIs: ['So {small} is fewer than {big}.', 'ஆகவே {small}, {big}-ஐ விடக் குறைவு.'],
      cmpLeft: ['Compare the digits from the left. The first digits that differ are {x} and {y}.', 'இடப்பக்கத்திலிருந்து இலக்கங்களை ஒப்பிடு. முதலில் மாறுபடும் இலக்கங்கள் {x}, {y}.'],
      cmpSame: ['Both numbers are the same, so we write =.', 'இரண்டு எண்களும் ஒன்றே, ஆகவே = எழுதுவோம்.'],
      signRule: ['> means “is greater than” and < means “is less than”. The open side faces the bigger number.', '> என்றால் “விடப் பெரியது”, < என்றால் “விடச் சிறியது”. திறந்த பக்கம் பெரிய எண்ணை நோக்கி இருக்கும்.'],
      sumFrame: ['Put {a} in one colour and {b} in another: {s} counters in all.', '{a}-ஐ ஒரு நிறத்திலும் {b}-ஐ வேறு நிறத்திலும் வை: மொத்தம் {s}.'],
      countOn: ['Start at {a} and hop on {b}: you land on {s}.', '{a}-இலிருந்து {b} தாவல்கள் முன்னே செல்: {s}-இல் நிற்பாய்.'],
      takeAway: ['Start with {a} and cross out {b}. {r} are left.', '{a}-இலிருந்து {b}-ஐ அடித்துவிடு. {r} மீதம்.'],
      backTen: ['From {a}, go back {k} to reach 10, then {rest} more to reach {r}.', '{a}-இலிருந்து {k} பின்னே சென்றால் 10, இன்னும் {rest} பின்னே சென்றால் {r}.'],
      tO: ['{a} is {t} tens and {o} ones.', '{a} என்பது {t} பத்துகளும் {o} ஒன்றுகளும்.'],
      tAdd: ['Add {k} tens: {t} + {k} = {t2} tens. The ones stay {o}.', '{k} பத்துகளைக் கூட்டு: {t} + {k} = {t2} பத்துகள். ஒன்றுகள் {o} ஆகவே இருக்கும்.'],
      tSub: ['Take away {k} tens: {t} − {k} = {t2} tens. The ones stay {o}.', '{k} பத்துகளைக் கழி: {t} − {k} = {t2} பத்துகள். ஒன்றுகள் {o} ஆகவே இருக்கும்.'],
      so: ['So {e} = {r}.', 'ஆகவே {e} = {r}.'], signIs: ['So we write {e}.', 'ஆகவே {e} என்று எழுதுவோம்.'],
      moreTo: ['{a} and {b} make {n}.', '{a}-உம் {b}-உம் சேர்ந்தால் {n}.'],
      hopTo: ['Count on from {a} to {n}: that is {b} hops.', '{a}-இலிருந்து {n} வரை எண்ணு: அது {b} தாவல்கள்.'],
      inverse: ['Undo it with the opposite operation: {inv}.', 'எதிர்ச் செயலால் கண்டுபிடி: {inv}.'],
      check: ['Check: {full}.', 'சரிபார்: {full}.'],
      tfTrue: ['{e} is {r}, so the sentence is true.', '{e} = {r}, ஆகவே இது சரி.'],
      tfFalse: ['{e} is {r}, not {c}, so the sentence is false.', '{e} = {r}, {c} அல்ல. ஆகவே இது தவறு.'],
      picTrue: ['There are {n} {things}, so the answer is yes.', '{n} {things} உள்ளன. ஆகவே விடை ஆம்.'],
      picFalse: ['There are {n} {things}, not {c}, so the answer is no.', '{c} அல்ல, {n} {things} உள்ளன. ஆகவே விடை இல்லை.'],
      arr: ['{a} rows of {b} make {p}.', '{b} கொண்ட {a} வரிசைகள் = {p}.'],
      shapeIs: ['This is a {s}.', 'இது ஒரு {s}.'],
      solid: ['A {s} has {note}.', '{s}: {note}.'],
      sidesIs: ['Count round the edge: {n} sides.', 'விளிம்பைச் சுற்றி எண்ணு: {n} பக்கங்கள்.'],
      coinStart: ['Start with the biggest coin: ₹{v}.', 'பெரிய நாணயத்திலிருந்து தொடங்கு: ₹{v}.'],
      coinAdd: ['Add ₹{v}: now you have ₹{s}.', '₹{v} கூட்டு: இப்போது ₹{s}.'],
      coinTotal: ['These coins make ₹{s}.', 'இந்த நாணயங்கள் சேர்ந்து ₹{s}.'],
      fracDen: ['The bottom number, {n}, says the whole is cut into {n} equal parts.', 'கீழ் எண் {n}: முழுமை {n} சம பாகங்களாகப் பிரிக்கப்பட்டுள்ளது.'],
      fracNum: ['The top number, {k}, says how many of those parts are shaded.', 'மேல் எண் {k}: அவற்றில் எத்தனை பாகம் நிழலிடப்பட்டுள்ளது என்று சொல்கிறது.'],
      fracSame: ['The same {f} can be a bar or a round disc. Only the parts matter.', 'அதே {f}-ஐப் பட்டையாகவும் வட்டமாகவும் வரையலாம். பாகங்கள்தான் முக்கியம்.'],
      change: ['Count up from the fare to the money paid: from ₹{f} to ₹{p} is ₹{c}.', 'கட்டணத்திலிருந்து கொடுத்த பணம் வரை எண்ணு: ₹{f}-இலிருந்து ₹{p} வரை ₹{c}.'],
      changeTens: ['₹{d1} takes you to ₹{nt}, then ₹{d2} more to ₹{p}. ₹{d1} + ₹{d2} = ₹{c}.', '₹{d1} சேர்த்தால் ₹{nt}, இன்னும் ₹{d2} சேர்த்தால் ₹{p}. ₹{d1} + ₹{d2} = ₹{c}.'],
      kmSplit: ['Split ₹{r} into ₹10 and ₹{x}: 10 × {k} = {a} and {x} × {k} = {b}.', '₹{r}-ஐ ₹10, ₹{x} எனப் பிரி: 10 × {k} = {a}, {x} × {k} = {b}.'],
      share: ['Deal them out one at a time: each plate gets {e}.', 'ஒவ்வொன்றாகப் பகிர்: ஒவ்வொரு தட்டுக்கும் {e}.'],
      rnd: ['On the number line, {n} is nearer to {r}.', 'எண்கோட்டில் {n}, {r}-க்கு அருகில் உள்ளது.'],
      r5rule: ['Ones of 5 or more round up. Less than 5 round down.', 'ஒன்றுகள் 5 அல்லது அதற்கு மேல் இருந்தால் மேலே; 5-க்குக் குறைவாக இருந்தால் கீழே முழுமையாக்கு.'],
      estSum: ['Work with the rounded numbers: {e} = {s}.', 'முழுமையாக்கிய எண்களைக் கொண்டு கணக்கிடு: {e} = {s}.'],
      exact: ['The exact answer is {x}, which is close to {s}.', 'சரியான விடை {x}, இது {s}-க்கு அருகில் உள்ளது.'],
      estRule: ['An estimate is a quick answer that is nearly right.', 'தோராயம் என்பது கிட்டத்தட்டச் சரியான விரைவு விடை.'],
    },
  } });

  window.MATHSQUIZ = { game, topic, daily, IDS, pool };
})();
