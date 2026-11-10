// Maths: 9 topics, 25 skills, interactive lessons. All text comes from i18n (m.*).
(function () {
  const { skill } = Engine, V = VIS;
  const S = 'maths';
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const shuffleChoices = (r, vals, fmt = v => String(v)) => r.shuffle([...new Set(vals)]).map(v => ({ v, html: fmt(v) }));
  const frac = (k, n) => `<span class="frac"><span>${k}</span><span>${n}</span></span>`;
  const fracTxt = (k, n) => `${k}/${n}`;
  const colSum = (a, b, op, res) => { // HTML column layout (H T O)
    const w = Math.max(String(a).length, String(b).length, String(res ?? '').length);
    const pad = n => String(n ?? '').padStart(w, ' ').split('');
    const head = ['m.w.H', 'm.w.T', 'm.w.O'].slice(3 - w).map(k => `<span class="ch">${t(k)}</span>`).join('');
    return `<div class="colsum" style="--w:${w}"><div class="row head"><span></span>${head}</div><div class="row"><span></span>${pad(a).map(d => `<span>${d.trim()}</span>`).join('')}</div><div class="row"><span>${op}</span>${pad(b).map(d => `<span>${d.trim()}</span>`).join('')}</div><div class="row res"><span></span>${res == null ? pad('').map(() => '<span>?</span>').join('') : pad(res).map(d => `<span>${d.trim()}</span>`).join('')}</div></div>`;
  };

  // ======================= COUNTING =======================
  skill({ id: 'm.count', subject: S, topic: 'count', name: 'm.skill.count', bands: { young: [1, 3], older: [2, 4] }, gen(l, r) {
    const n = l === 1 ? r.int(1, 5) : l === 2 ? r.int(4, 10) : r.int(11, 20);
    const steps = [];
    if (n <= 10) { const a = Math.min(5, n), b = n - a; steps.push({ text: t('m.y.rows', { a, b }) }, { text: t('m.y.rowsSum', { a, b, n }) }); }
    else { steps.push({ text: t('m.y.frames', { r: n - 10 }) }, { text: t('m.y.framesSum', { r: n - 10, n }) }); }
    steps.push({ text: t('m.y.word', { n, en: I18N.numWord(n, 'en'), ta: I18N.numWord(n, 'ta') }) });
    return { kind: 'num', prompt: t('m.q.count'), visual: V.tenFrame({ n, frames: n > 10 ? 2 : 1, label: t('m.ui.counters', { n: '?' }) }), answer: n, hints: [t('m.h.count'), t('m.h.count2')], why: { steps } };
  } });
  skill({ id: 'm.after', subject: S, topic: 'count', name: 'm.skill.after', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const max = [10, 20, 100, 1000][l - 1], after = r() < 0.55, n = after ? r.int(l > 2 ? 10 : 0, max - 1) : r.int(1, max);
    const a = after ? n + 1 : n - 1, from = Math.max(0, n - 5), to = from + 10;
    return { kind: 'num', prompt: t(after ? 'm.q.after' : 'm.q.before', { n }), visual: V.numberLine({ from, to, mark: n, highlight: [n] }), answer: a,
      hints: [t(after ? 'm.h.after' : 'm.h.before'), t('m.h.line', { n })], why: { steps: [{ text: t(after ? 'm.y.after' : 'm.y.before', { n, a }), vis: V.numberLine({ from, to, mark: a, hops: [[n, a]], highlight: [n, a] }) }] } };
  } });
  skill({ id: 'm.compare', subject: S, topic: 'count', name: 'm.skill.compare', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const max = [9, 20, 99, 999][l - 1]; let a = r.int(1, max), b = r.int(1, max); while (b === a) b = r.int(1, max);
    const askBig = l < 2 || r() < 0.7, ans = askBig ? Math.max(a, b) : Math.min(a, b);
    const steps = [];
    if (l === 1) steps.push({ text: t('m.y.tower', { a: Math.max(a, b), b: Math.min(a, b) }), vis: V.towers([a, b]) });
    else {
      const big = Math.max(a, b), small = Math.min(a, b), names = ['m.w.hundredsPlace', 'm.w.tensPlace', 'm.w.onesPlace'];
      const A = String(big).padStart(3, '0'), B = String(small).padStart(3, '0'); let i = 0; while (A[i] === B[i]) i++;
      steps.push({ text: t('m.y.cmpPlace', { place: t(names[i]), x: A[i], y: B[i] }) }, { text: t('m.y.cmpWin', { x: A[i], y: B[i], big, small }) });
    }
    return { kind: 'choice', prompt: t(askBig ? 'm.q.bigger' : 'm.q.smaller'), visual: l === 1 ? V.towers([a, b]) : null, choices: [{ v: a, html: `<span class="bignum">${a}</span>` }, { v: b, html: `<span class="bignum">${b}</span>` }], answer: ans, answerText: String(ans), hints: [t(l === 1 ? 'm.h.cmpTower' : 'm.h.cmp')], why: { steps } };
  } });

  // ======================= PLACE VALUE =======================
  skill({ id: 'm.blocks', subject: S, topic: 'place', name: 'm.skill.blocks', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const h = l >= 3 ? r.int(1, l === 3 ? 3 : 6) : 0, tt = l === 1 ? r.int(1, 4) : r.int(1, 9), o = r.int(0, 9), n = h * 100 + tt * 10 + o;
    const steps = []; const parts = [];
    if (h) { steps.push({ text: t('m.y.hund', { h, H: h * 100 }) }); parts.push(h * 100); }
    steps.push({ text: t('m.y.tens', { t: tt, T: tt * 10 }) }); parts.push(tt * 10);
    steps.push({ text: t('m.y.ones', { o }) }); parts.push(o);
    steps.push({ text: t('m.y.total', { parts: parts.join(' + '), n }) });
    return { kind: 'num', prompt: t('m.q.blocks'), visual: V.blocks({ h, t: tt, o }), answer: n, hints: [t('m.h.blocks'), t('m.h.blocks2')], why: { steps } };
  } });
  skill({ id: 'm.digit', subject: S, topic: 'place', name: 'm.skill.digit', bands: { young: [1, 2], older: [2, 3] }, gen(l, r) {
    const n = l === 1 ? r.int(11, 99) : l === 2 ? r.int(101, 999) : r.int(101, 999);
    const s = String(n), idx = r.int(0, s.length - 1); if (s[idx] === '0') return this.gen(l, r);
    const d = +s[idx], place = s.length - 1 - idx, v = d * 10 ** place, names = ['m.w.onesPlace', 'm.w.tensPlace', 'm.w.hundredsPlace'];
    const chart = `<div class="pvchart">${s.split('').map((c, i) => `<div class="${i === idx ? 'on' : ''}"><span>${t(['m.w.O', 'm.w.T', 'm.w.H'][s.length - 1 - i])}</span><b>${c}</b></div>`).join('')}</div>`;
    return { kind: 'num', prompt: t('m.q.digit', { n, d }), visual: `<p class="bignum center">${n}</p>`, boardClass: 'light', answer: v, hints: [t('m.h.digit', { d })],
      why: { steps: [{ text: t('m.y.digit', { d, place: t(names[place]), v }), vis: chart }], rule: t('m.y.digitRule') } };
  } });
  skill({ id: 'm.expanded', subject: S, topic: 'place', name: 'm.skill.expanded', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const h = l === 2 ? r.int(1, 9) : 0, tt = r.int(1, 9), o = r.int(0, 9), n = h * 100 + tt * 10 + o, parts = [h * 100, tt * 10, o].filter(Boolean);
    const e = r.shuffle(parts).join(' + ');
    return { kind: 'num', prompt: t('m.q.expanded', { e }), visual: V.blocks({ h, t: tt, o }), answer: n, hints: [t('m.h.blocks')], why: { steps: [{ text: t('m.y.expanded', { h, t: tt, o }) }, { text: t('m.y.so', { e, r: n }) }] } };
  } });

  // ======================= ADDITION =======================
  skill({ id: 'm.add10', subject: S, topic: 'add', name: 'm.skill.add10', bands: { young: [1, 2], older: [2, 2] }, gen(l, r) {
    const s = l === 1 ? r.int(2, 5) : r.int(5, 10), a = r.int(1, s - 1), b = s - a, big = Math.max(a, b), small = Math.min(a, b);
    const seq = range(big + 1, s).join(', ');
    return { kind: 'num', prompt: t('m.q.add', { a, b }), promptText: t('m.q.addSay', { a, b }), visual: V.tenFrame({ n: a, n2: b }), answer: s, hints: [t('m.h.add')],
      why: { steps: [{ text: t('m.y.addFrame', { a, b, s }) }, { text: t('m.y.countOn', { a: big, b: small, seq }), vis: V.numberLine({ from: 0, to: 10, hops: [[big, s]], mark: s, highlight: [big, s] }) }] } };
  } });
  skill({ id: 'm.make10', subject: S, topic: 'add', name: 'm.skill.make10', bands: { young: [1, 2], older: [1, 2] }, gen(l, r) {
    const a = r.int(l === 1 ? 7 : 6, 9), b = r.int(11 - a, 9), s = a + b, k = 10 - a, rr = b - k;
    return { kind: 'num', prompt: t('m.q.add', { a, b }), promptText: t('m.q.addSay', { a, b }), visual: V.tenFrame({ n: a, n2: b, frames: 2 }), answer: s, hints: [t('m.h.make10', { a })],
      why: { steps: [{ text: t('m.y.need10', { a, k }) }, { text: t('m.y.split', { b, k, r: rr }) }, { text: t('m.y.ten', { a, k, r: rr, s }), vis: V.tenFrame({ n: a, n2: b, frames: 2 }) }] } };
  } });
  skill({ id: 'm.add2d', subject: S, topic: 'add', name: 'm.skill.add2d', bands: { young: [1, 1], older: [1, 4] }, gen(l, r) {
    let a, b;
    if (l === 1) { a = r.int(2, 8) * 10 + r.int(0, 5); b = r.int(1, 9 - (a % 10)); }
    else if (l === 2) { a = r.int(1, 5) * 10 + r.int(0, 4); b = r.int(1, 4) * 10 + r.int(0, 9 - (a % 10)); }
    else if (l === 3) { a = r.int(1, 6) * 10 + r.int(5, 9); b = r.int(1, 2) * 10 + r.int(10 - (a % 10), 9); }
    else { a = r.int(120, 480); b = r.int(110, 450); }
    const s = a + b, steps = []; let carry = 0;
    const da = String(a).split('').reverse().map(Number), db = String(b).split('').reverse().map(Number), names = ['m.y.colOnes', 'm.y.colTens', 'm.y.colHund'];
    for (let i = 0; i < Math.max(da.length, db.length); i++) {
      const x = da[i] || 0, y = db[i] || 0, sum = x + y + carry;
      steps.push({ text: t(names[i], { x, y, s: sum, c: carry ? t('m.y.plusCarry') : '' }).replace(' + 0 =', ' + 0 =') });
      if (sum >= 10 && i < Math.max(da.length, db.length) - 1) { steps.push({ text: t('m.y.carry', { s: sum, r: sum % 10 }) }); carry = 1; } else carry = 0;
    }
    steps[0].text = t('m.y.colOnes', { x: da[0], y: db[0], s: da[0] + db[0] });
    steps.push({ text: t('m.y.so', { e: `${a} + ${b}`, r: s }), vis: colSum(a, b, '+', s) });
    return { kind: 'num', prompt: t('m.q.add', { a, b }), promptText: t('m.q.addSay', { a, b }), visual: colSum(a, b, '+'), boardClass: 'light', answer: s, hints: [t('m.h.col')], why: { steps } };
  } });

  // ======================= SUBTRACTION =======================
  skill({ id: 'm.sub10', subject: S, topic: 'sub', name: 'm.skill.sub10', bands: { young: [1, 2], older: [2, 2] }, gen(l, r) {
    const a = l === 1 ? r.int(3, 6) : r.int(6, 10), b = r.int(1, a - 1), res = a - b;
    return { kind: 'num', prompt: t('m.q.sub', { a, b }), promptText: t('m.q.subSay', { a, b }), visual: V.tenFrame({ n: a }), answer: res, hints: [t('m.h.sub', { b })],
      why: { steps: [{ text: t('m.y.takeAway', { a, b }), vis: V.tenFrame({ n: a, cross: b }) }, { text: t('m.y.left', { a, b, r: res }) }] } };
  } });
  skill({ id: 'm.sub20', subject: S, topic: 'sub', name: 'm.skill.sub20', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const a = r.int(11, l === 1 ? 14 : 18), k = a - 10, b = r.int(k + 1, Math.min(9, a - 1)), rr = b - k, res = a - b;
    return { kind: 'num', prompt: t('m.q.sub', { a, b }), promptText: t('m.q.subSay', { a, b }), visual: V.tenFrame({ n: a, frames: 2 }), answer: res, hints: [t('m.h.sub20')],
      why: { steps: [{ text: t('m.y.back10', { a, k }) }, { text: t('m.y.backRest', { r: rr, res }) }, { text: t('m.y.so', { e: `${a} − ${b}`, r: res }), vis: V.numberLine({ from: res - 1 < 0 ? 0 : res - 1, to: Math.max(a + 1, (res - 1) + 10), hops: [[a, 10], [10, res]], mark: res, highlight: [a, 10, res] }) }] } };
  } });
  skill({ id: 'm.sub2d', subject: S, topic: 'sub', name: 'm.skill.sub2d', bands: { young: [1, 1], older: [1, 3] }, gen(l, r) {
    let a, b;
    if (l === 1) { a = r.int(3, 9) * 10 + r.int(4, 9); b = r.int(1, Math.floor(a / 10) - 1) * 10 + r.int(0, a % 10); }
    else if (l === 2) { a = r.int(3, 9) * 10 + r.int(0, 4); b = r.int(1, Math.floor(a / 10) - 1) * 10 + r.int(a % 10 + 1, 9); }
    else { a = r.int(300, 900); b = r.int(100, a - 50); }
    const res = a - b, ao = a % 10, bo = b % 10, steps = [];
    if (ao >= bo) steps.push({ text: t('m.y.subOnes', { x: ao, y: bo, s: ao - bo }) });
    else { steps.push({ text: t('m.y.trade', { x: ao, y: bo, x10: ao + 10 }) }, { text: t('m.y.subOnes', { x: ao + 10, y: bo, s: ao + 10 - bo }) }); }
    const at = Math.floor(a / 10) - (ao < bo ? 1 : 0), bt = Math.floor(b / 10);
    steps.push({ text: t('m.y.subTens', { x: at, y: bt, s: at - bt }) });
    steps.push({ text: t('m.y.so', { e: `${a} − ${b}`, r: res }), vis: colSum(a, b, '−', res) });
    return { kind: 'num', prompt: t('m.q.sub', { a, b }), promptText: t('m.q.subSay', { a, b }), visual: colSum(a, b, '−'), boardClass: 'light', answer: res, hints: [t('m.h.colSub')], why: { steps } };
  } });

  // ======================= MULTIPLICATION =======================
  skill({ id: 'm.groups', subject: S, topic: 'mul', name: 'm.skill.groups', bands: { young: [1, 1], older: [1, 3] }, gen(l, r) {
    const asPlates = l === 1, rr = asPlates ? r.int(2, 4) : r.int(2, l === 2 ? 5 : 6), c = asPlates ? r.pick([2, 5, 2, 3]) : r.int(2, l === 2 ? 5 : 8), p = rr * c;
    const seq = range(1, rr).map(i => i * c).join(', ');
    return { kind: 'num', prompt: t(asPlates ? 'm.q.groups' : 'm.q.array', { r: rr, c }), visual: asPlates ? V.plates({ k: rr, each: c }) : V.array({ r: rr, c }), answer: p, hints: [t('m.h.skip', { c })],
      why: { steps: [{ text: t('m.y.skip', { c, seq }) }, { text: t('m.y.mulIs', { r: rr, c, p }) }, ...(asPlates ? [] : [{ text: t('m.y.turn', { a: rr, b: c, p }), vis: V.array({ r: c, c: rr }) }])] } };
  } });
  skill({ id: 'm.tables', subject: S, topic: 'mul', name: 'm.skill.tables', bands: { young: [1, 1], older: [1, 4] }, gen(l, r) {
    const a = r.pick([[2, 5, 10], [3, 4], [6, 7, 8, 9], [2, 3, 4, 5, 6, 7, 8, 9, 10]][l - 1]), b = r.int(2, 10), p = a * b;
    const tip = { 2: t('m.y.tip2', { b, p }), 5: t('m.y.tip5'), 10: t('m.y.tip10'), 9: t('m.y.tip9', { b, b10: b * 10, p }), 4: t('m.y.tip4') }[a];
    const steps = [{ text: t('m.y.mulIs', { r: a, c: b, p }), vis: a * b <= 40 ? V.array({ r: a, c: b }) : null }, { text: t('m.y.skip', { c: b, seq: range(1, a).map(i => i * b).join(', ') }) }];
    if (tip) steps.push({ text: tip });
    return { kind: 'num', prompt: t('m.q.mul', { a, b }), promptText: t('m.q.mulSay', { a, b }), visual: a * b <= 40 ? V.array({ r: a, c: b }) : `<p class="bignum center">${a} × ${b}</p>`, boardClass: a * b <= 40 ? '' : 'light', answer: p, hints: [t('m.h.skip', { c: b })], why: { steps } };
  } });

  // ======================= DIVISION =======================
  skill({ id: 'm.share', subject: S, topic: 'div', name: 'm.skill.share', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const k = r.int(2, l === 1 ? 3 : 4), e = r.int(2, l === 1 ? 4 : 5), n = k * e;
    return { kind: 'num', prompt: t('m.q.share', { n, k }), visual: V.plates({ k, pile: n }), answer: e, hints: [t('m.h.share')],
      why: { steps: [{ text: t('m.y.deal') }, { text: t('m.y.each', { e }), vis: V.plates({ k, each: e }) }, { text: t('m.y.check', { n, k, e }) }] } };
  } });
  skill({ id: 'm.divfact', subject: S, topic: 'div', name: 'm.skill.divfact', bands: { young: [1, 1], older: [1, 3] }, gen(l, r) {
    const k = r.pick([[2, 5, 10], [3, 4, 5], [6, 7, 8, 9]][l - 1]), e = r.int(2, 10), n = k * e;
    return { kind: 'num', prompt: t('m.q.div', { n, k }), promptText: t('m.q.divSay', { n, k }), visual: n <= 40 ? V.array({ r: k, c: e }) : `<p class="bignum center">${n} ÷ ${k}</p>`, boardClass: n <= 40 ? '' : 'light', answer: e, hints: [t('m.h.divfact', { k, n })],
      why: { steps: [{ text: t('m.y.think', { k, e, n }) }, { text: t('m.y.check', { n, k, e }), vis: n <= 40 ? V.array({ r: k, c: e }) : null }] } };
  } });

  // ======================= FRACTIONS =======================
  skill({ id: 'm.fracname', subject: S, topic: 'frac', name: 'm.skill.fracname', bands: { young: [1, 1], older: [1, 3] }, gen(l, r) {
    const n = l === 1 ? r.pick([2, 3, 4]) : r.int(3, 8), k = l === 1 ? 1 : r.int(1, n - 1);
    const opts = [[k, n], [n - k || 1, n], [k, n + 1], [n, k]].filter(([a, b]) => a < b || (a === k && b === n));
    const uniq = [...new Map(opts.map(o => [o.join('/'), o])).values()].slice(0, 3);
    const vis = r() < 0.5 ? V.fractionBars([{ n, k }]) : V.fractionDisc({ n, k });
    return { kind: 'choice', prompt: t('m.q.fracname'), visual: vis, choices: r.shuffle(uniq).map(([a, b]) => ({ v: fracTxt(a, b), html: frac(a, b) })), answer: fracTxt(k, n), answerText: frac(k, n), hints: [t('m.h.frac')],
      why: { steps: [{ text: t('m.y.whole', { n }) }, { text: t('m.y.shaded', { k }) }, { text: t('m.y.fracIs', { f: frac(k, n) }) }] } };
  } });
  skill({ id: 'm.fraccmp', subject: S, topic: 'frac', name: 'm.skill.fraccmp', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    if (l === 1) {
      let a = r.int(2, 6), b = r.int(2, 8); while (b === a) b = r.int(2, 8);
      const big = Math.min(a, b);
      return { kind: 'choice', prompt: t('m.q.fracbig'), visual: V.fractionBars([{ n: a, k: 1 }, { n: b, k: 1, color: VIS.C.indigo }]), choices: [{ v: '1/' + a, html: frac(1, a) }, { v: '1/' + b, html: frac(1, b) }], answer: '1/' + big, answerText: frac(1, big), hints: [t('m.h.fraccmp')],
        why: { steps: [{ text: t('m.y.unitCmp', { a, b }) }, { text: t('m.y.unitWin', { big: frac(1, big) }) }] } };
    }
    const n = r.int(4, 8); let x = r.int(1, n - 1), y = r.int(1, n - 1); while (y === x) y = r.int(1, n - 1);
    const big = Math.max(x, y);
    return { kind: 'choice', prompt: t('m.q.fracbig'), visual: V.fractionBars([{ n, k: x }, { n, k: y, color: VIS.C.indigo }]), choices: [{ v: x + '/' + n, html: frac(x, n) }, { v: y + '/' + n, html: frac(y, n) }], answer: big + '/' + n, answerText: frac(big, n), hints: [t('m.h.frac')],
      why: { steps: [{ text: t('m.y.sameDen', { n }) }, { text: t('m.y.sameWin', { x: big, y: Math.min(x, y), big: frac(big, n) }) }] } };
  } });
  skill({ id: 'm.fracset', subject: S, topic: 'frac', name: 'm.skill.fracset', bands: { young: [1, 1], older: [1, 3] }, gen(l, r) {
    const n = l === 1 ? 2 : r.pick([2, 3, 4]), g = r.int(2, l === 1 ? 5 : 4), m = n * g, k = l === 3 ? r.int(1, n - 1) || 1 : 1;
    const f = frac(k, n);
    return { kind: 'num', prompt: t('m.q.fracset', { f, m }), promptText: t('m.q.fracset', { f: `${k} / ${n}`, m }), visual: V.fractionSet({ n: m, k: 0 }), answer: k * g, hints: [t('m.h.fracset', { m, n })],
      why: { steps: [{ text: t('m.y.groupsOf', { m, n, g }), vis: V.plates({ k: n, each: g }) }, { text: t('m.y.oneGroup', { f, m, k, r: k * g }), vis: V.fractionSet({ n: m, k: k * g }) }] } };
  } });

  // ======================= SHAPES =======================
  const FLAT = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, rhombus: 4 };
  skill({ id: 'm.sides', subject: S, topic: 'shapes', name: 'm.skill.sides', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const pool = l === 1 ? ['triangle', 'square', 'rectangle'] : Object.keys(FLAT), s = r.pick(pool), n = FLAT[s], corners = r() < 0.4;
    return { kind: 'num', prompt: t(corners ? 'm.q.corners' : 'm.q.sides'), visual: V.shape2d(s, { label: t('m.shape.' + s) }), answer: n, hints: [t('m.h.sides')],
      why: { steps: [{ text: t('m.y.sidesCount', { n }), vis: V.shape2d(s, { corners: true }) }, { text: t('m.y.sidesRule', { s: t('m.shape.' + s), n }) }] } };
  } });
  skill({ id: 'm.solids', subject: S, topic: 'shapes', name: 'm.skill.solids', bands: { young: [1, 1], older: [1, 3] }, gen(l, r) {
    if (l === 1) {
      const s = r.pick(V.SOLIDS), others = r.shuffle(V.SOLIDS.filter(x => x !== s)).slice(0, 2);
      return { kind: 'choice', prompt: t('m.q.solidName'), visual: V.solid(s, r.int(-45, -15)), choices: r.shuffle([s, ...others]).map(x => ({ v: x, html: t('m.shape.' + x) })), answer: s, hints: [t('m.h.solids')],
        why: { steps: [{ text: t('m.y.solidIs', { s: t('m.shape.' + s), note: t('m.solidNote.' + s) }) }, { text: t('m.y.looks', { looks: t('m.solidLooks.' + s) }) }] } };
    }
    const s = r.pick(['cube', 'cuboid', 'pyramid', 'prism']), f = V.SOLID_FACTS[s], what = l === 2 ? 'faces' : r.pick(['edges', 'vertices']);
    return { kind: 'num', prompt: t('m.q.' + what, { s: t('m.shape.' + s) }), visual: V.solid(s, r.int(-45, -15)), answer: f[what], hints: [t('m.h.solids')],
      why: { steps: [{ text: t('m.y.solidIs', { s: t('m.shape.' + s), note: t('m.solidNote.' + s) }), vis: V.solid(s, -60) }, { text: t('m.y.solidFacts', { s: t('m.shape.' + s), f: f.faces, e: f.edges, v: f.vertices }) }] } };
  } });

  // ======================= MEASUREMENT =======================
  function timeWords(h, m) {
    const h1 = h % 12 + 1;
    if (m === 0) return t('m.y.oclock', { h }); if (m === 30) return t('m.y.halfpast', { h }); if (m === 15) return t('m.y.quarterpast', { h }); if (m === 45) return t('m.y.quarterto', { h1 });
    return t('m.y.minutes', { h, m });
  }
  skill({ id: 'm.clock', subject: S, topic: 'measure', name: 'm.skill.clock', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const h = r.int(1, 12), m = l === 1 ? 0 : l === 2 ? r.pick([0, 30]) : l === 3 ? r.pick([15, 30, 45]) : r.int(1, 11) * 5;
    const fmt = (H, M) => `${H}:${String(M).padStart(2, '0')}`;
    const wrongH = h % 12 + 1, opts = [[h, m], [wrongH, m], [h, (m + 30) % 60], [m / 5 || 12, h * 5 % 60]].filter(([a, b]) => a >= 1 && a <= 12);
    const uniq = [...new Map(opts.map(o => [fmt(...o), o])).values()].slice(0, 3);
    const where = m === 0 ? t('m.y.at') : m === 30 ? t('m.y.half') : t('m.y.past');
    return { kind: 'choice', prompt: t('m.q.clock'), visual: V.clock({ h, m }), choices: r.shuffle(uniq).map(([a, b]) => ({ v: fmt(a, b), html: `<span class="bignum mono">${fmt(a, b)}</span>` })), answer: fmt(h, m), hints: [t('m.h.clock'), t('m.h.clock2')],
      why: { steps: [{ text: t('m.y.hourHand', { h, where }) }, { text: m === 0 ? t('m.y.minTop') : t('m.y.minHand', { k: m / 5, m }) }, { text: t('m.y.timeIs', { time: fmt(h, m), words: timeWords(h, m) }) }] } };
  } });
  skill({ id: 'm.money', subject: S, topic: 'measure', name: 'm.skill.money', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const pools = [[1, 2, 5], [1, 2, 5, 10], ['c10', 10, 20, 50, 2, 5], [10, 20, 50, 100, 200, 500, 'c10', 5]];
    const k = l === 1 ? r.int(2, 3) : r.int(3, 4), items = range(1, k).map(() => r.pick(pools[l - 1]));
    const val = v => +String(v).replace('c', ''), sorted = [...items].sort((a, b) => val(b) - val(a));
    const total = items.reduce((a, v) => a + val(v), 0); let run = 0; const steps = [];
    sorted.forEach((v, i) => { run += val(v); steps.push({ text: i === 0 ? t('m.y.moneyStart', { v: val(v) }) : t('m.y.moneyAdd', { v: val(v), s: run }) }); });
    steps.push({ text: t('m.y.moneyTotal', { s: total }) });
    return { kind: 'num', unit: '₹', prompt: t('m.q.money'), visual: V.money(items), answer: total, hints: [t('m.h.money')], why: { steps } };
  } });
  skill({ id: 'm.length', subject: S, topic: 'measure', name: 'm.skill.length', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const len = r.int(2, 9), a = l === 1 ? 0 : r.int(1, 3), b = a + len;
    return { kind: 'num', unit: t('u.cm'), prompt: t('m.q.length'), visual: V.ruler({ len, start: a }), answer: len, hints: [t('m.h.length')],
      why: { steps: a === 0 ? [{ text: t('m.y.len0', { b }) }] : [{ text: t('m.y.lenAB', { a, b }) }, { text: t('m.y.lenSub', { a, b, l: len }) }] } };
  } });

  // ======================= TOPICS + LESSONS =======================
  const stepper = (id, label, val) => `<div class="stepper" data-id="${id}"><span class="st-label">${label}</span><button type="button" class="k-iconbtn" data-d="-1" aria-label="${label} −">−</button><output>${val}</output><button type="button" class="k-iconbtn" data-d="1" aria-label="${label} +">+</button></div>`;
  function steppers(el, state, lim, draw) {
    el.querySelectorAll('.stepper').forEach(s => s.querySelectorAll('button').forEach(b => b.onclick = () => {
      const id = s.dataset.id; state[id] = Math.max(lim[id][0], Math.min(lim[id][1], state[id] + +b.dataset.d)); s.querySelector('output').textContent = state[id]; draw();
    }));
    draw();
  }
  // each lesson widget: (el) => void — renders a board + controls + live caption
  const W = {
    count: [
      el => { const st = { n: 3 }; el.innerHTML = `<div class="board" data-v></div><div class="controls">${stepper('n', t('m.ui.counters', { n: '' }).trim(), st.n)}</div><p class="caption" aria-live="polite"></p>`;
        steppers(el, st, { n: [0, 20] }, () => { el.querySelector('[data-v]').innerHTML = V.tenFrame({ n: st.n, frames: st.n > 10 ? 2 : 1 }); el.querySelector('.caption').innerHTML = `<b class="bignum">${st.n}</b> <span lang="en">${I18N.numWord(st.n, 'en')}</span> · <span lang="ta">${I18N.numWord(st.n, 'ta')}</span>`; }); },
      el => { const st = { n: 6 }; el.innerHTML = `<div class="board" data-v></div><div class="controls"><button class="k-btn k-btn-outline pill" data-d="-1">${t('m.ui.left')}</button><button class="k-btn k-btn-outline pill" data-d="1">${t('m.ui.right')}</button></div><p class="caption" aria-live="polite"></p>`;
        const draw = (prev) => { el.querySelector('[data-v]').innerHTML = V.numberLine({ from: 0, to: 20, mark: st.n, hops: prev != null ? [[prev, st.n]] : [], highlight: [st.n] }); el.querySelector('.caption').textContent = t('m.ui.bead', { n: st.n }); };
        el.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { const p = st.n; st.n = Math.max(0, Math.min(20, st.n + +b.dataset.d)); draw(p); }); draw(); },
      el => { const st = { a: 4, b: 7 }; el.innerHTML = `<div class="board" data-v></div><div class="controls">${stepper('a', t('m.ui.towerA'), st.a)}${stepper('b', t('m.ui.towerB'), st.b)}</div><p class="caption" aria-live="polite"></p>`;
        steppers(el, st, { a: [1, 10], b: [1, 10] }, () => { el.querySelector('[data-v]').innerHTML = V.towers([st.a, st.b]); el.querySelector('.caption').textContent = st.a === st.b ? t('m.ui.same') : st.a > st.b ? t('m.ui.isMore', st) : t('m.ui.isLess', st); }); },
    ],
    place: [
      el => { const st = { t: 1, o: 7, msg: '' }; el.innerHTML = `<div class="board" data-v></div><div class="controls"><button class="k-btn k-btn-outline pill" data-a="add">${t('m.ui.addOne')}</button><button class="k-btn k-btn-outline pill" data-a="bundle">${t('m.ui.bundle')}</button><button class="k-btn k-btn-ghost" data-a="reset">${t('m.ui.reset')}</button></div><p class="caption" aria-live="polite"></p>`;
        const draw = () => { el.querySelector('[data-v]').innerHTML = V.blocks({ t: st.t, o: st.o }); el.querySelector('.caption').innerHTML = `${st.msg ? st.msg + ' ' : ''}<b>${st.t * 10 + st.o}</b> = ${st.t} ${t('m.w.tens')} + ${st.o} ${t('m.w.ones')}`; el.querySelector('[data-a=bundle]').disabled = st.o < 10; el.querySelector('[data-a=add]').disabled = st.o >= 10; };
        el.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { const a = b.dataset.a; st.msg = ''; if (a === 'add') st.o++; if (a === 'bundle' && st.o >= 10) { st.o -= 10; st.t++; st.msg = t('m.ui.bundled'); } if (a === 'reset') { st.t = 1; st.o = 7; } draw(); }); draw(); },
      el => { const st = { h: 1, t: 4, o: 3 }; el.innerHTML = `<div class="board" data-v></div><div class="controls">${stepper('h', t('m.ui.hundreds'), st.h)}${stepper('t', t('m.ui.tens'), st.t)}${stepper('o', t('m.ui.ones'), st.o)}</div><div class="caption" aria-live="polite"></div>`;
        steppers(el, st, { h: [0, 5], t: [0, 9], o: [0, 9] }, () => { el.querySelector('[data-v]').innerHTML = V.blocks(st); const n = String(st.h * 100 + st.t * 10 + st.o).padStart(3, '0'); el.querySelector('.caption').innerHTML = `<div class="pvchart">${[['m.w.H', n[0]], ['m.w.T', n[1]], ['m.w.O', n[2]]].map(([k, d], i) => `<div class="pv${i}"><span>${t(k)}</span><b>${d}</b></div>`).join('')}</div>`; }); },
      el => { el.innerHTML = `<div class="board light"><div class="pvrow">${[[3, 'm.w.onesPlace', 3], [30, 'm.w.tensPlace', 30], [300, 'm.w.hundredsPlace', 300]].map(([n, k]) => `<div class="pvcard"><p class="bignum">${String(n).replace('3', '<mark>3</mark>')}</p><p>${t(k)}: <b>${n}</b></p></div>`).join('')}</div></div>`; },
    ],
    add: [
      el => { const st = { a: 3, b: 4 }; el.innerHTML = `<div class="board" data-v></div><div class="controls">${stepper('a', t('m.ui.first'), st.a)}${stepper('b', t('m.ui.second'), st.b)}</div><p class="caption bigcap" aria-live="polite"></p>`;
        steppers(el, st, { a: [0, 10], b: [0, 10] }, () => { el.querySelector('[data-v]').innerHTML = V.tenFrame({ n: st.a, n2: st.b, frames: st.a + st.b > 10 ? 2 : 1 }); el.querySelector('.caption').textContent = t('m.ui.sum', { ...st, s: st.a + st.b }); }); },
      el => { el.innerHTML = `<div class="board">${V.tenFrame({ n: 8, n2: 5, frames: 2 })}</div><p class="caption bigcap">8 + 2 = 10 · 10 + 3 = 13</p>`; },
      el => { const st = { a: 4, b: 5 }; el.innerHTML = `<div class="board" data-v></div><div class="controls">${stepper('a', t('m.ui.first'), st.a)}${stepper('b', t('m.ui.second'), st.b)}</div><p class="caption bigcap" aria-live="polite"></p>`;
        steppers(el, st, { a: [0, 10], b: [1, 10] }, () => { el.querySelector('[data-v]').innerHTML = V.numberLine({ from: 0, to: 20, hops: [[st.a, st.a + st.b]], mark: st.a + st.b, highlight: [st.a, st.a + st.b] }); el.querySelector('.caption').textContent = t('m.ui.sum', { ...st, s: st.a + st.b }); }); },
    ],
    sub: [
      el => { const st = { a: 9, b: 3 }; el.innerHTML = `<div class="board" data-v></div><div class="controls">${stepper('a', t('m.ui.first'), st.a)}${stepper('b', t('m.ui.take1'), st.b)}</div><p class="caption bigcap" aria-live="polite"></p>`;
        steppers(el, st, { a: [1, 10], b: [0, 10] }, () => { if (st.b > st.a) { st.b = st.a; el.querySelector('[data-id=b] output').textContent = st.b; } el.querySelector('[data-v]').innerHTML = V.tenFrame({ n: st.a, cross: st.b }); el.querySelector('.caption').textContent = t('m.ui.diff', { a: st.a, b: st.b, s: st.a - st.b }); }); },
      el => { el.innerHTML = `<div class="board">${V.numberLine({ from: 5, to: 15, hops: [[13, 10], [10, 8]], mark: 8, highlight: [13, 10, 8] })}</div><p class="caption bigcap">13 − 3 = 10 · 10 − 2 = 8</p>`; },
      el => { el.innerHTML = `<div class="board light"><div class="family"><p class="bignum">8 + 5 = 13</p><p class="bignum">5 + 8 = 13</p><p class="bignum">13 − 5 = 8</p><p class="bignum">13 − 8 = 5</p></div></div>`; },
    ],
    mul: [
      el => { el.innerHTML = `<div class="board">${V.plates({ k: 3, each: 4 })}</div><p class="caption bigcap">4 + 4 + 4 = 3 × 4 = 12</p>`; },
      el => { const st = { r: 3, c: 4 }; el.innerHTML = `<div class="board" data-v></div><div class="controls">${stepper('r', t('m.ui.rows'), st.r)}${stepper('c', t('m.ui.cols'), st.c)}</div><p class="caption bigcap" aria-live="polite"></p>`;
        steppers(el, st, { r: [1, 6], c: [1, 10] }, () => { el.querySelector('[data-v]').innerHTML = V.array(st); el.querySelector('.caption').textContent = t('m.ui.prod', { ...st, p: st.r * st.c }); }); },
      el => { const st = { r: 3, c: 5, turned: false }; el.innerHTML = `<div class="board" data-v></div><div class="controls"><button class="k-btn k-btn-outline pill">${t('m.ui.turn')}</button></div><p class="caption bigcap" aria-live="polite"></p>`;
        const draw = () => { const r = st.turned ? st.c : st.r, c = st.turned ? st.r : st.c; el.querySelector('[data-v]').innerHTML = V.array({ r, c }); el.querySelector('.caption').textContent = t('m.ui.prod', { r, c, p: r * c }); };
        el.querySelector('button').onclick = () => { st.turned = !st.turned; draw(); }; draw(); },
    ],
    div: [
      el => { const st = { n: 12, k: 3, dealt: 0 }; el.innerHTML = `<div class="board" data-v></div><div class="controls"><button class="k-btn k-btn-outline pill" data-a="deal">${t('m.ui.dealOne')}</button><button class="k-btn k-btn-ghost" data-a="reset">${t('m.ui.reset')}</button></div><p class="caption bigcap" aria-live="polite"></p>`;
        const draw = () => { const each = st.dealt; el.querySelector('[data-v]').innerHTML = V.plates({ k: st.k, each, pile: st.n - each * st.k }); el.querySelector('.caption').textContent = st.n - each * st.k > 0 ? t('m.ui.left2', { n: st.n - each * st.k }) : t('m.ui.quot', { n: st.n, k: st.k, e: each }); el.querySelector('[data-a=deal]').disabled = st.n - each * st.k <= 0; };
        el.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { if (b.dataset.a === 'deal') st.dealt++; else st.dealt = 0; draw(); }); draw(); },
      el => { el.innerHTML = `<div class="board">${V.array({ r: 3, c: 4 })}</div><p class="caption bigcap">3 × 4 = 12 · 12 ÷ 3 = 4</p>`; },
    ],
    frac: [
      el => { const st = { n: 4, on: new Set([0]) }; el.innerHTML = `<div class="board" data-v></div><div class="fracparts" role="group" aria-label="${t('m.ui.tapPart')}"></div><div class="controls">${stepper('n', t('m.ui.parts'), st.n)}</div><p class="caption bigcap" aria-live="polite"></p>`;
        const draw = () => { [...st.on].forEach(i => i >= st.n && st.on.delete(i)); const k = st.on.size;
          el.querySelector('[data-v]').innerHTML = V.fractionBars([{ n: st.n, k }]);
          el.querySelector('.fracparts').innerHTML = Array.from({ length: st.n }, (_, i) => `<button type="button" class="part ${i < k ? 'on' : ''}" aria-pressed="${i < k}" data-i="${i}">${i + 1}</button>`).join('');
          el.querySelectorAll('.part').forEach(b => b.onclick = () => { const i = +b.dataset.i; if (i < k) { st.on.delete(k - 1); } else st.on.add(k); draw(); });
          el.querySelector('.caption').innerHTML = frac(k, st.n); };
        steppers(el, st, { n: [2, 8] }, draw); },
      el => { el.innerHTML = `<div class="board">${V.fractionBars([{ n: 1, k: 1, color: VIS.C.hund }, { n: 2, k: 1 }, { n: 3, k: 1, color: VIS.C.indigo }, { n: 4, k: 1, color: VIS.C.ten }])}</div><p class="caption bigcap">1 > ${frac(1, 2)} > ${frac(1, 3)} > ${frac(1, 4)}</p>`; },
      el => { el.innerHTML = `<div class="board">${V.plates({ k: 2, each: 4 })}</div><p class="caption bigcap">${frac(1, 2)} × 8 = 4</p>`; },
    ],
    shapes: [
      el => { const names = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'circle']; let cur = 'triangle';
        el.innerHTML = `<div class="board" data-v></div><div class="chips" role="group">${names.map(n => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-s="${n}">${t('m.shape.' + n)}</button>`).join('')}</div><p class="caption" aria-live="polite"></p>`;
        const draw = () => { el.querySelector('[data-v]').innerHTML = V.shape2d(cur, { corners: cur !== 'circle' }); el.querySelectorAll('[data-s]').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === cur)); el.querySelector('.caption').textContent = cur === 'circle' ? t('m.ui.round') : t('m.ui.sides', { n: FLAT[cur] }); };
        el.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { cur = b.dataset.s; draw(); }); draw(); },
      el => { let cur = 'cube', yaw = -30;
        el.innerHTML = `<div class="board turnable" data-v tabindex="0" aria-label="${t('m.ui.turnR')}"></div><div class="controls"><button class="k-iconbtn" data-d="-20" aria-label="${t('m.ui.turnL')}"><svg class="k-icon"><use href="#i-back"/></svg></button><button class="k-iconbtn" data-d="20" aria-label="${t('m.ui.turnR')}"><svg class="k-icon"><use href="#i-next"/></svg></button></div><div class="chips">${V.SOLIDS.map(n => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-s="${n}">${t('m.shape.' + n)}</button>`).join('')}</div><p class="caption" aria-live="polite"></p>`;
        const b = el.querySelector('[data-v]');
        const draw = () => { b.innerHTML = V.solid(cur, yaw); el.querySelectorAll('[data-s]').forEach(x => x.setAttribute('aria-pressed', x.dataset.s === cur)); const f = V.SOLID_FACTS[cur]; el.querySelector('.caption').textContent = `${t('m.shape.' + cur)}: ${t('m.ui.facesLine', { f: f.faces, e: f.edges, v: f.vertices })}`; };
        el.querySelectorAll('[data-s]').forEach(x => x.onclick = () => { cur = x.dataset.s; draw(); });
        el.querySelectorAll('[data-d]').forEach(x => x.onclick = () => { yaw += +x.dataset.d; draw(); });
        let drag = null; b.onpointerdown = e => { drag = e.clientX; b.setPointerCapture(e.pointerId); }; b.onpointermove = e => { if (drag == null) return; yaw += (e.clientX - drag) * .6; drag = e.clientX; draw(); }; b.onpointerup = () => drag = null;
        b.onkeydown = e => { if (e.key === 'ArrowLeft') { yaw -= 15; draw(); } if (e.key === 'ArrowRight') { yaw += 15; draw(); } };
        draw(); },
    ],
    measure: [
      el => { const st = { h: 3, m: 0 }; el.innerHTML = `<div class="board" data-v></div><div class="controls"><button class="k-btn k-btn-outline k-btn-sm pill" data-d="-5">${t('m.ui.minus5')}</button><button class="k-btn k-btn-outline k-btn-sm pill" data-d="5">${t('m.ui.plus5')}</button><button class="k-btn k-btn-outline k-btn-sm pill" data-d="60">${t('m.ui.plus1h')}</button></div><p class="caption bigcap" aria-live="polite"></p>`;
        const draw = () => { el.querySelector('[data-v]').innerHTML = V.clock(st); el.querySelector('.caption').innerHTML = `<span class="mono">${st.h}:${String(st.m).padStart(2, '0')}</span> · ${timeWords(st.h, st.m)}`; };
        el.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { let tot = ((st.h % 12) * 60 + st.m + +b.dataset.d + 720) % 720; st.h = Math.floor(tot / 60) || 12; st.m = tot % 60; draw(); }); draw(); },
      el => { const tray = []; const kinds = [1, 2, 5, 'c10', 20, 50, 100];
        el.innerHTML = `<div class="board" data-v></div><div class="chips">${kinds.map(k => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-k="${k}">₹${String(k).replace('c', '')}</button>`).join('')}<button type="button" class="k-btn k-btn-ghost k-btn-sm" data-k="clr">${t('m.ui.emptyTray')}</button></div><p class="caption bigcap" aria-live="polite"></p>`;
        const draw = () => { el.querySelector('[data-v]').innerHTML = tray.length ? V.money(tray) : `<p class="muted center">${t('m.ui.tray')}</p>`; el.querySelector('.caption').textContent = `${t('m.ui.tray')}: ₹${tray.reduce((a, v) => a + +String(v).replace('c', ''), 0)}`; };
        el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { if (b.dataset.k === 'clr') tray.length = 0; else if (tray.length < 7) tray.push(isNaN(b.dataset.k) ? b.dataset.k : +b.dataset.k); draw(); }); draw(); },
      el => { const st = { len: 6 }; el.innerHTML = `<div class="board" data-v></div><div class="controls">${stepper('len', t('m.ui.lengthLbl'), st.len)}</div><p class="caption bigcap" aria-live="polite"></p>`;
        steppers(el, st, { len: [1, 11] }, () => { el.querySelector('[data-v]').innerHTML = V.ruler({ len: st.len }); el.querySelector('.caption').textContent = `${st.len} ${t('u.cm')}`; }); },
    ],
  };

  const TOPICS = [
    { id: 'count', skills: ['m.count', 'm.after', 'm.compare'], bands: ['young', 'older'], icon: 'i-dots' },
    { id: 'place', skills: ['m.blocks', 'm.digit', 'm.expanded'], bands: ['young', 'older'], icon: 'i-blocks' },
    { id: 'add', skills: ['m.add10', 'm.make10', 'm.add2d'], bands: ['young', 'older'], icon: 'i-plus' },
    { id: 'sub', skills: ['m.sub10', 'm.sub20', 'm.sub2d'], bands: ['young', 'older'], icon: 'i-minus' },
    { id: 'mul', skills: ['m.groups', 'm.tables'], bands: ['older'], icon: 'i-times' },
    { id: 'div', skills: ['m.share', 'm.divfact'], bands: ['older'], icon: 'i-divide' },
    { id: 'frac', skills: ['m.fracname', 'm.fraccmp', 'm.fracset'], bands: ['older'], icon: 'i-frac' },
    { id: 'shapes', skills: ['m.sides', 'm.solids'], bands: ['young', 'older'], icon: 'i-shape' },
    { id: 'measure', skills: ['m.clock', 'm.money', 'm.length'], bands: ['young', 'older'], icon: 'i-clock' },
  ].map(tp => ({ ...tp, subject: S, title: `m.topic.${tp.id}.title`, blurb: `m.topic.${tp.id}.blurb`, lesson: () => tx(`m.lesson.${tp.id}`).map((s, i) => ({ title: s.t, body: s.b, widget: W[tp.id][i] })) }));

  window.MATHS = { TOPICS, W, timeWords, frac };
})();
