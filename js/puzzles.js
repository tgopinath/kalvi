// Maths puzzles: each type drills a real skill and runs through the shared engine (hint ladder:
// nudge → worked step → answer; a strategy card after every puzzle; misses go to review).
(function () {
  const { skill } = Engine, S = 'maths', esc = Engine.esc;
  const ladder = (a, b, c) => [{ text: a }, { text: b.text ?? b, vis: b.vis }, { text: c.text ?? c, vis: c.vis }];
  const cellBtn = (txt, cls, attrs) => `<button type="button" class="pz-cell ${cls}" ${attrs}>${txt}</button>`;

  // ---------- number paths (adding several numbers) ----------
  skill({ id: 'pz.path', subject: S, topic: 'puzzles', name: 'pz.skill.path', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const n = l <= 2 ? 3 : 4, len = [2, 3, 3, 4][l - 1], max = l === 1 ? 5 : 9;
    const g = Array.from({ length: n * n }, () => r.int(1, max));
    let cur = r.int(0, n * n - 1); const path = [cur];
    while (path.length < len) { const nb = nbrs(cur, n).filter(x => !path.includes(x)); if (!nb.length) break; cur = r.pick(nb); path.push(cur); }
    const T = path.reduce((a, i) => a + g[i], 0), seq = path.map(i => g[i]).join(' + ');
    let sel = [], focus = 0;
    const q = { kind: 'custom', prompt: t('pz.q.path', { T }), promptText: t('pz.q.path', { T }), boardClass: 'pz',
      hints: ladder(t('pz.h.path1', { T }), t('pz.h.path2', { a: g[path[0]], need: T - g[path[0]] }), t('pz.h.path3', { seq })), hintRevealsAnswer: true,
      answerText: `${seq} = ${T}`,
      mount(el, api) {
        const draw = () => {
          const s = sel.reduce((a, i) => a + g[i], 0);
          el.innerHTML = `<div class="board"><p class="pz-target">${t('pz.q.path', { T: `<b>${T}</b>` })}</p><div class="pz-grid" style="--n:${n}" role="grid">${g.map((v, i) => cellBtn(v, sel.includes(i) ? 'on' : '', `data-i="${i}" aria-pressed="${sel.includes(i)}" tabindex="${i === focus ? 0 : -1}" aria-label="${v}"`)).join('')}</div></div>
            <p class="pz-sum" aria-live="polite">${sel.length ? t('pz.q.pathSum', { seq: sel.map(i => g[i]).join(' + '), s }) : t('pz.q.pathEmpty')}</p>`;
          el.querySelectorAll('.pz-cell').forEach(b => { b.onclick = () => tap(+b.dataset.i); b.onkeydown = e => key(e, +b.dataset.i); });
          api.ready(sel.length >= 2);
        };
        const tap = i => { focus = i; if (sel[sel.length - 1] === i) sel.pop(); else if (!sel.includes(i) && (!sel.length || nbrs(sel[sel.length - 1], n).includes(i))) sel.push(i); draw(); el.querySelector(`[data-i="${i}"]`).focus(); };
        const key = (e, i) => { const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: n, ArrowUp: -n }[e.key]; if (d) { e.preventDefault(); const j = i + d; if (j >= 0 && j < n * n && !(Math.abs(d) === 1 && Math.floor(j / n) !== Math.floor(i / n))) { focus = j; draw(); el.querySelector(`[data-i="${j}"]`).focus(); } } else if (e.key === ' ') { e.preventDefault(); tap(i); } else if (e.key === 'Backspace') { sel.pop(); draw(); } };
        draw();
      },
      check() { const s = sel.reduce((a, i) => a + g[i], 0); return { correct: s === T && sel.length >= 2, given: sel.map(i => g[i]).join(' + ') + ' = ' + s }; },
      why: { steps: [{ text: t('pz.y.path', { seq, T }) }], rule: t('pz.y.pathTip') } };
    return q;
  } });
  function nbrs(i, n) { const r = Math.floor(i / n), c = i % n, o = []; if (r > 0) o.push(i - n); if (r < n - 1) o.push(i + n); if (c > 0) o.push(i - 1); if (c < n - 1) o.push(i + 1); return o; }

  // ---------- missing numbers (inverse operations) ----------
  skill({ id: 'pz.missing', subject: S, topic: 'puzzles', name: 'pz.skill.missing', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const box = '<span class="mbox">?</span>'; let eq, ans, inv, full;
    if (l === 1) { const a = r.int(1, 5), b = r.int(1, 5); ans = b; eq = `${a} + ${box} = ${a + b}`; inv = `${a + b} − ${a} = ${b}`; full = `${a} + ${b} = ${a + b}`; }
    else if (l === 2) { const a = r.int(5, 15), b = r.int(2, 9); if (r() < .5) { ans = b; eq = `${a + b} − ${box} = ${a}`; inv = `${a + b} − ${a} = ${b}`; full = `${a + b} − ${b} = ${a}`; } else { ans = a; eq = `${box} + ${b} = ${a + b}`; inv = `${a + b} − ${b} = ${a}`; full = `${a} + ${b} = ${a + b}`; } }
    else { const a = r.int(2, 9), b = r.int(2, l === 3 ? 6 : 10); if (r() < .5) { ans = b; eq = `${a} × ${box} = ${a * b}`; inv = `${a * b} ÷ ${a} = ${b}`; full = `${a} × ${b} = ${a * b}`; } else { ans = a; eq = `${a * b} ÷ ${box} = ${b}`; inv = `${a * b} ÷ ${b} = ${a}`; full = `${a * b} ÷ ${a} = ${b}`; } }
    return { kind: 'num', prompt: t('pz.q.missing'), visual: `<p class="bignum center eqn">${eq}</p>`, boardClass: 'light', answer: ans, hints: ladder(t('pz.h.miss1'), t('pz.h.miss2', { inv }), t('pz.h.miss3', { a: ans })), hintRevealsAnswer: true,
      promptText: t('pz.q.missing') + ' ' + eq.replace(box, '?'), why: { steps: [{ text: t('pz.y.missing', { eq: full }) }] } };
  } });

  // ---------- patterns ----------
  const SHAPES = ['triangle', 'square', 'circle', 'hexagon'];
  skill({ id: 'pz.pattern', subject: S, topic: 'puzzles', name: 'pz.skill.pattern', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    if (l === 1) { // shape pattern AB / ABB / ABC
      const unitLen = r.pick([2, 3]), unit = r.shuffle(SHAPES).slice(0, unitLen); if (unitLen === 3 && r() < .5) unit[2] = unit[1];
      const seq = Array.from({ length: unitLen * 2 + 1 }, (_, i) => unit[i % unitLen]), next = unit[seq.length % unitLen];
      const vis = `<div class="shape-row">${seq.map(s => `<span>${VIS.shape2d(s)}</span>`).join('')}<span class="mbox">?</span></div>`;
      const opts = r.shuffle([next, ...r.shuffle(SHAPES.filter(x => x !== next)).slice(0, 2)]);
      return { kind: 'choice', prompt: t('pz.q.pattern'), visual: vis, choices: opts.map(x => ({ v: x, vis: VIS.shape2d(x), html: t('m.shape.' + x) })), answer: next, answerText: t('m.shape.' + next),
        hints: ladder(t('pz.h.patShape1'), t('pz.h.patShape2', { unit: unit.map(s => t('m.shape.' + s)).join(', ') }), t('pz.h.pat3', { a: t('m.shape.' + next) })), hintRevealsAnswer: true,
        why: { steps: [{ text: t('pz.h.patShape2', { unit: unit.map(s => t('m.shape.' + s)).join(', ') }) }], rule: t('pz.y.patternTip') } };
    }
    let seq, rule, next;
    if (l === 2) { const k = r.pick([1, 2, 5, 10]), s0 = r.int(0, 10); seq = [0, 1, 2, 3, 4].map(i => s0 + i * k); next = s0 + 5 * k; rule = t('pz.rule.add', { k }); }
    else if (l === 3) { if (r() < .5) { const k = r.pick([3, 4, 6]), s0 = r.int(40, 60); seq = [0, 1, 2, 3, 4].map(i => s0 - i * k); next = s0 - 5 * k; rule = t('pz.rule.sub', { k }); } else { const s0 = r.int(1, 3); seq = [0, 1, 2, 3].map(i => s0 * 2 ** i); next = s0 * 16; rule = t('pz.rule.dbl'); } }
    else { if (r() < .5) { seq = [1, 4, 9, 16, 25]; next = 36; rule = t('pz.rule.sq'); } else { const k = r.pick([7, 9, 11, 25]), s0 = r.int(3, 20); seq = [0, 1, 2, 3, 4].map(i => s0 + i * k); next = s0 + 5 * k; rule = t('pz.rule.add', { k }); } }
    return { kind: 'num', prompt: t('pz.q.pattern'), visual: `<p class="bignum center seqn">${seq.join(', ')}, <span class="mbox">?</span></p>`, boardClass: 'light', answer: next, promptText: t('pz.q.pattern') + ' ' + seq.join(', '),
      hints: ladder(t('pz.h.pat1'), t('pz.h.pat2', { rule }), t('pz.h.pat3', { a: next })), hintRevealsAnswer: true, why: { steps: [{ text: t('pz.y.pattern', { rule, seq: [...seq, next].join(', ') }) }], rule: t('pz.y.patternTip') } };
  } });

  // ---------- balance scales (equations) ----------
  function scale(left, right) {
    const Sc = R3.Scene({ yaw: 0, pitch: 28, scale: 13 });
    Sc.group(0).shadow(0, 0, 0, 3, 1.2).box(-0.4, -0.4, 0, 0.8, 0.8, 6, '#5b6275').box(-9, -0.25, 6, 18, 0.5, 0.35, '#c9a36b');
    [[-6.5, left], [6.5, right]].forEach(([x, items]) => { Sc.group(0).cylinder(x, 0, 2.6, 2.6, 0.25, '#aab2c0', { n: 40 }); Sc.group(0).box(x - 0.08, -0.08, 2.85, 0.16, 0.16, 3.15, '#7a8291');
      items.forEach((v, i) => { const bx = x - (items.length - 1) * 1.05 + i * 2.1; Sc.group(1).box(bx - 0.95, -0.95, 2.85, 1.9, 1.9, 1.9, v === '?' ? '#6d6ad8' : '#16a39c').text(bx, -0.97, 3.8, String(v), { size: 1.2, flat: false }); }); });
    return Sc.svg('a balance scale');
  }
  skill({ id: 'pz.balance', subject: S, topic: 'puzzles', name: 'pz.skill.balance', bands: { young: [1, 2], older: [2, 3] }, gen(l, r) {
    const max = [5, 9, 20][l - 1]; const left = [r.int(1, max), r.int(1, max)], L = left[0] + left[1]; const R0 = r.int(1, L - 1), a = L - R0;
    return { kind: 'num', prompt: t('pz.q.balance'), visual: scale(left, [R0, '?']), answer: a, promptText: t('pz.q.balance'),
      hints: ladder(t('pz.h.bal1'), t('pz.h.bal2', { L, R: R0 }), t('pz.h.bal3', { L, R: R0, a })), hintRevealsAnswer: true,
      why: { steps: [{ text: t('pz.y.balance', { L: `${left[0]} + ${left[1]} = ${L}`, R: R0, a }).replace(`${R0} + ${a} = ${left[0]} + ${left[1]} = ${L}`, `${R0} + ${a} = ${L}`), vis: scale(left, [R0, a]) }], rule: t('pz.y.balanceTip') } };
  } });

  // ---------- shape fitting (tangram style) ----------
  // each puzzle: placed pieces + one gap (polygon, unit grid) and the shape name of the gap
  const TANS = [
    { pieces: [[[0, 0], [2, 0], [2, 2], [0, 2]]], gap: [[0, 2], [2, 2], [1, 3.4]], name: 'triangle' },             // house roof
    { pieces: [[[0, 0], [2, 0], [0, 2]]], gap: [[2, 0], [2, 2], [0, 2]], name: 'triangle' },                          // square split
    { pieces: [[[0, 0], [2, 0], [2, 2], [0, 2]]], gap: [[2, 0], [4, 0], [4, 2], [2, 2]], name: 'square' },            // rectangle of two squares
    { pieces: [[[0, 0], [1, 1.7], [2, 0]], [[2, 0], [3, 1.7], [4, 0]], [[1, 1.7], [2, 3.4], [3, 1.7]]], gap: [[1, 1.7], [3, 1.7], [2, 0]], name: 'triangle' },
    { pieces: [[[0, 0], [1, 0], [1, 2], [0, 2]], [[3, 0], [4, 0], [4, 2], [3, 2]]], gap: [[1, 0], [3, 0], [3, 2], [1, 2]], name: 'square' },
    { pieces: [[[0, 0], [3, 0], [3, 1.4], [0, 1.4]]], gap: [[0, 1.4], [3, 1.4], [3, 2.8], [0, 2.8]], name: 'rectangle' },
  ];
  const PIECE = { triangle: [[0, 0], [2, 0], [1, 1.7]], square: [[0, 0], [2, 0], [2, 2], [0, 2]], rectangle: [[0, 0], [3, 0], [3, 1.4], [0, 1.4]], circle: [...Array(36)].map((_, i) => [1 + Math.cos(i / 36 * 6.283), 1 + Math.sin(i / 36 * 6.283)]), hexagon: [...Array(6)].map((_, i) => [1 + Math.cos(i * 1.047), 1 + Math.sin(i * 1.047)]) };
  function tanScene(tp, fill) {
    const Sc = R3.Scene({ yaw: 0, pitch: 62, scale: 26 });
    tp.pieces.forEach(p => Sc.group(1).prism(p.map(([x, y]) => [x * 1.02, y * 1.02]), 0, 0.3, '#16a39c'));
    const gp = tp.gap.map(([x, y]) => [x, y]);
    if (fill) Sc.group(1).prism(gp, 0, 0.3, '#e2a336');
    else Sc.group(0).raw(P => `<polygon points="${gp.map(q => P([q[0], q[1], 0.02]).slice(0, 2).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#f6c56b" stroke-width="2" stroke-dasharray="5 4"/>`, gp.map(q => [q[0], q[1], 0]));
    return Sc.svg('a shape with a gap');
  }
  const pieceVis = name => { const Sc = R3.Scene({ yaw: 0, pitch: 62, scale: 22 }); Sc.group(1).prism(PIECE[name], 0, 0.3, '#e2a336'); return Sc.svg(name); };
  skill({ id: 'pz.tangram', subject: S, topic: 'puzzles', name: 'pz.skill.tangram', bands: { young: [1, 1], older: [1, 1] }, gen(l, r) {
    const tp = r.pick(TANS), wrong = r.shuffle(Object.keys(PIECE).filter(k => k !== tp.name)).slice(0, 2), n = tp.gap.length;
    return { kind: 'choice', prompt: t('pz.q.tangram'), visual: tanScene(tp, false), choices: r.shuffle([tp.name, ...wrong]).map(k => ({ v: k, vis: pieceVis(k), html: t('m.shape.' + k) })), answer: tp.name, answerText: t('m.shape.' + tp.name),
      hints: ladder(t('pz.h.tan1'), t('pz.h.tan2', { n }), t('pz.h.tan3', { s: t('m.shape.' + tp.name) })), hintRevealsAnswer: true,
      why: { steps: [{ text: t('pz.y.tangram', { s: t('m.shape.' + tp.name) }), vis: tanScene(tp, true) }], rule: t('pz.y.tangramTip') } };
  } });

  // ---------- shared grid entry for magic squares and KenKen ----------
  function gridPuzzle({ n, given, max, cages, solution, checkFn }) {
    const val = given.map(v => v || 0); let sel = given.findIndex(v => !v);
    return {
      mount(el, api) {
        const draw = () => {
          const cageOf = i => cages?.findIndex(c => c.cells.includes(i)), label = i => { if (!cages) return ''; const c = cages[cageOf(i)]; return c && c.cells[0] === i ? `<span class="cage">${c.target}${c.op}</span>` : ''; };
          const edge = i => { if (!cages) return ''; const c = cageOf(i), rgt = (i % n) < n - 1 && cageOf(i + 1) !== c ? 'cR' : '', btm = i + n < n * n && cageOf(i + n) !== c ? 'cB' : ''; return rgt + ' ' + btm; };
          el.innerHTML = `<div class="board"><div class="pz-grid ${cages ? 'kk-grid' : ''}" style="--n:${n}" role="grid">${val.map((v, i) => `<button type="button" class="pz-cell ${given[i] ? 'given' : ''} ${i === sel ? 'sel' : ''} ${edge(i)}" data-i="${i}" ${given[i] ? 'aria-disabled="true"' : ''} aria-label="${t('pz.q.cell', { r: Math.floor(i / n) + 1, c: i % n + 1 })}: ${v || t('pz.q.empty')}">${label(i)}${v || ''}</button>`).join('')}</div></div>
            <div class="pz-pad" role="group" aria-label="${t('pz.q.pickCell')}">${Array.from({ length: max }, (_, k) => `<button type="button" data-v="${k + 1}">${k + 1}</button>`).join('')}<button type="button" data-v="0" aria-label="${t('common.clear')}"><svg class="k-icon"><use href="#i-del"/></svg></button></div>`;
          el.querySelectorAll('.pz-cell').forEach(b => { b.onclick = () => { const i = +b.dataset.i; if (!given[i]) { sel = i; draw(); el.querySelector(`[data-i="${i}"]`).focus(); } }; b.onkeydown = e => { const i = +b.dataset.i; if (/^[0-9]$/.test(e.key) && !given[i] && +e.key <= max) { val[i] = +e.key; draw(); el.querySelector(`[data-i="${i}"]`).focus(); } const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: n, ArrowUp: -n }[e.key]; if (d) { e.preventDefault(); const j = Math.max(0, Math.min(n * n - 1, i + d)); if (!given[j]) sel = j; draw(); el.querySelector(`[data-i="${j}"]`).focus(); } }; });
          el.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { if (sel >= 0 && !given[sel]) { val[sel] = +b.dataset.v; const nx = val.findIndex((v, i) => !v && !given[i]); draw(); if (nx >= 0 && +b.dataset.v) { sel = nx; draw(); } } });
          api.ready(val.every(v => v));
        };
        draw();
      },
      check() { return checkFn(val); }, val,
    };
  }
  // ---------- magic square 3×3 ----------
  skill({ id: 'pz.magic', subject: S, topic: 'puzzles', name: 'pz.skill.magic', bands: { young: [1, 1], older: [1, 3] }, gen(l, r) {
    let m = [2, 7, 6, 9, 5, 1, 4, 3, 8]; const rot = a => [a[6], a[3], a[0], a[7], a[4], a[1], a[8], a[5], a[2]], flip = a => [a[2], a[1], a[0], a[5], a[4], a[3], a[8], a[7], a[6]];
    for (let i = r.int(0, 3); i > 0; i--) m = rot(m); if (r() < .5) m = flip(m);
    const blanks = r.shuffle([0, 1, 2, 3, 5, 6, 7, 8]).slice(0, [2, 3, 4][l - 1]); const given = m.map((v, i) => blanks.includes(i) ? 0 : v);
    const lines = [[0, 1, 2, 'row', 1], [3, 4, 5, 'row', 2], [6, 7, 8, 'row', 3], [0, 3, 6, 'col', 1], [1, 4, 7, 'col', 2], [2, 5, 8, 'col', 3], [0, 4, 8, 'diag'], [2, 4, 6, 'diag']];
    const lname = L => L[3] === 'diag' ? t('pz.y.diag') : t('pz.y.' + L[3], { n: L[4] });
    const one = lines.find(L => L.slice(0, 3).filter(i => !given[i]).length === 1) || lines[0];
    const gi = one.slice(0, 3).find(i => !given[i]), known = one.slice(0, 3).filter(i => i !== gi).map(i => m[i]);
    const gp = gridPuzzle({ n: 3, given, max: 9, checkFn: v => { for (const L of lines) { const s = v[L[0]] + v[L[1]] + v[L[2]]; if (s !== 15) return { correct: false, given: t('pz.y.issueLine', { line: lname(L), s }) }; } return { correct: new Set(v).size === 9, given: v.join(' ') }; } });
    const full = `<div class="pvchart magic">${m.map(v => `<div><b>${v}</b></div>`).join('')}</div>`;
    return { kind: 'custom', prompt: t('pz.q.magic'), ...gp, hints: ladder(t('pz.h.mag1'), t('pz.h.mag2', { line: lname(one), a: known[0], b: known[1], s: known[0] + known[1], c: m[gi] }), { text: t('pz.h.mag3'), vis: full }), hintRevealsAnswer: true,
      answerText: m.slice(0, 3).join(' ') + ' / ' + m.slice(3, 6).join(' ') + ' / ' + m.slice(6).join(' '), why: { steps: [{ text: t('pz.y.magic'), vis: full }], rule: t('pz.y.magicTip') } };
  } });
  // ---------- KenKen 4×4 ----------
  skill({ id: 'pz.kenken', subject: S, topic: 'puzzles', name: 'pz.skill.kenken', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const base = [[1, 2, 3, 4], [2, 3, 4, 1], [3, 4, 1, 2], [4, 1, 2, 3]], rows = r.shuffle([0, 1, 2, 3]), cols = r.shuffle([0, 1, 2, 3]), sym = r.shuffle([1, 2, 3, 4]);
    const sol = []; rows.forEach(ri => cols.forEach(ci => sol.push(sym[base[ri][ci] - 1])));
    // cages: greedy random dominoes, a few singles
    const used = new Set(), cages = [], order = r.shuffle([...Array(16).keys()]);
    for (const i of order) { if (used.has(i)) continue; const opts = [i + 1, i + 4].filter(j => j < 16 && !used.has(j) && !(j === i + 1 && i % 4 === 3)); const single = cages.filter(c => c.cells.length === 1).length < (l === 1 ? 4 : 2) && r() < .3;
      if (!opts.length || single) { cages.push({ cells: [i] }); used.add(i); } else { const j = r.pick(opts); cages.push({ cells: [i, j].sort((a, b) => a - b) }); used.add(i); used.add(j); } }
    cages.forEach(c => { const v = c.cells.map(i => sol[i]); if (v.length === 1) { c.op = ''; c.target = v[0]; } else { const [a, b] = [Math.max(...v), Math.min(...v)]; const ops = ['+', '−', '×']; if (a % b === 0 && a !== b) ops.push('÷'); c.op = l === 1 ? r.pick(['+', '+', '−']) : r.pick(ops); c.target = { '+': a + b, '−': a - b, '×': a * b, '÷': a / b }[c.op]; } });
    const given = sol.map((v, i) => cages.find(c => c.cells.length === 1 && c.cells[0] === i) ? v : 0);
    const lname = (k, n) => t('pz.y.' + k, { n });
    const gp = gridPuzzle({ n: 4, given, max: 4, cages, checkFn: v => {
      for (let k = 0; k < 4; k++) { const row = v.slice(k * 4, k * 4 + 4), col = [0, 1, 2, 3].map(j => v[j * 4 + k]); if (new Set(row).size < 4) return { correct: false, given: t('pz.y.issueRepeat', { line: lname('row', k + 1) }) }; if (new Set(col).size < 4) return { correct: false, given: t('pz.y.issueRepeat', { line: lname('col', k + 1) }) }; }
      for (const c of cages) { const x = c.cells.map(i => v[i]), a = Math.max(...x), b = Math.min(...x), got = c.cells.length === 1 ? x[0] : { '+': a + b, '−': a - b, '×': a * b, '÷': a / b }[c.op]; if (got !== c.target) return { correct: false, given: t('pz.y.issueCage', { target: c.target + c.op }) }; }
      return { correct: true, given: v.join('') }; } });
    const free = sol.findIndex((v, i) => !given[i]);
    const full = `<div class="pvchart kk">${sol.map(v => `<div><b>${v}</b></div>`).join('')}</div>`;
    return { kind: 'custom', prompt: t('pz.q.kenken'), ...gp, hints: ladder(t('pz.h.ken1'), t('pz.h.ken2', { cell: t('pz.q.cell', { r: Math.floor(free / 4) + 1, c: free % 4 + 1 }), v: sol[free], why: t('pz.h.ken2why') }), { text: t('pz.h.ken3'), vis: full }), hintRevealsAnswer: true,
      answerText: t('pz.h.ken3'), why: { steps: [{ text: t('pz.y.kenken'), vis: full }], rule: t('pz.y.kenkenTip') } };
  } });

  const IDS = { young: ['pz.path', 'pz.missing', 'pz.pattern', 'pz.balance', 'pz.tangram'], older: ['pz.path', 'pz.missing', 'pz.pattern', 'pz.balance', 'pz.tangram', 'pz.magic', 'pz.kenken'] };
  const game = { title: 'pz.title', blurb: 'm.topic.puzzles.blurb', icon: 'i-puzzle', start(p) {
    const ids = IDS[p.band] || IDS.older;
    const due = Store.due(p, S).filter(r => r.skill.startsWith('pz.')).slice(0, 1).map(r => ({ skill: r.skill, lvl: r.lvl, seed: r.seed }));
    const pick = Engine.weighted(p, ids, 5 - due.length);
    const go = () => Engine.start({ items: [...due, ...pick], title: t('pz.title'), subject: S, topic: 'puzzles', mode: 'puzzles', back: '#/s/maths', again: () => game.start(p) }); go();
  } };
  window.PUZZLES = { game, IDS };
})();
