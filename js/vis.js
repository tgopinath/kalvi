// Rendered 3D visuals for lessons and questions. All return SVG strings.
(function () {
  const { Scene, shade } = R3;
  const C = {
    one: '#e2a336',    // saffron: ones, first group
    ten: '#16a39c',    // teal: tens, second group
    hund: '#3b82c4',   // azure: hundreds
    rose: '#d04b86',   // fractions
    indigo: '#6d6ad8',
    tray: '#2b3140', slab: '#394054', wood: '#c9a36b', paper: '#e9e4d8', steel: '#aab2c0', brass: '#d3a94a',
  };

  // ---------- counters in ten-frames ----------
  // n: first colour count, n2: second colour, cross: how many (from the end) are crossed out
  function tenFrame({ n = 0, n2 = 0, cross = 0, frames, ghost = 0, label } = {}) {
    const total = n + n2 + ghost; frames = frames ?? Math.max(1, Math.ceil(total / 10));
    const S = Scene({ yaw: 0, pitch: 58, scale: 22 });
    let k = 0;
    for (let f = 0; f < frames; f++) {
      const oy = -f * 3.1;
      S.group(0).shadow(2.75, oy + 1.25, 0, 3.2, 1.6).box(-0.15, oy - 0.15, 0, 5.8, 2.8, 0.42, C.slab, { contrast: 0.6 });
      for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
        const x = c * 1.1 + 0.05, y = oy + (1 - r) * 1.25 + 0.05;
        S.group(0.5).face([[x, y, 0.43], [x + 1, y, 0.43], [x + 1, y + 1.15, 0.43], [x, y + 1.15, 0.43]], '#1d2230', { flat: true, edge: '#151925' });
      }
      for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
        if (k >= total) break;
        const x = c * 1.1 + 0.55, y = oy + (1 - r) * 1.25 + 0.62;
        const crossed = k >= total - ghost - cross && k < total - ghost;
        const col = k < n ? C.one : C.ten;
        S.group(1).sphere(x, y, 0.85, 0.4, col, { cross: crossed, ghost: k >= total - ghost });
        k++;
      }
    }
    return S.svg(label ?? `${n + n2} counters in ten-frames`);
  }

  // ---------- base-ten blocks ----------
  function blocks({ h = 0, t = 0, o = 0, label } = {}) {
    const S = Scene({ yaw: -32, pitch: 26, scale: 11 });
    let x = 0;
    for (let i = 0; i < h; i++) { S.group().shadow(x + 5, 5, 0, 6, 6).box(x, 0, 0, 10, 10, 1, C.hund, { unit: true }); x += 2.2; }
    if (h) x += 9.4;
    for (let i = 0; i < t; i++) { S.group().shadow(x + .5, .5, 0, 1, 1).box(x, 0, 0, 1, 1, 10, C.ten, { unit: true }); x += 1.5; }
    if (t) x += 0.6;
    for (let i = 0; i < o; i++) { const col = i % 5, row = Math.floor(i / 5); S.group().shadow(x + col * 1.3 + .5, row * 1.4 + .5, 0, .8, .8).box(x + col * 1.3, row * 1.4, 0, 1, 1, 1, C.one); }
    if (!h && !t && !o) S.raw('', [[0, 0, 0], [1, 1, 1]]);
    return S.svg(label ?? `${h} hundreds, ${t} tens and ${o} ones`, { pad: 8 });
  }

  // ---------- towers of cubes (compare) ----------
  function towers(vals, label) {
    const S = Scene({ yaw: -28, pitch: 20, scale: 16 });
    const cols = [C.one, C.ten, C.hund];
    vals.forEach((v, i) => {
      const x = i * 3.2; S.group().shadow(x + .5, .5, 0, 1, 1);
      for (let k = 0; k < v; k++) S.box(x, 0, k * 1.0, 1, 1, 1, cols[i % 3]);
      S.text(x + .5, -0.6, -1.1, String(v), { size: 1.1, fill: '#eef0f5' });
    });
    return S.svg(label ?? `towers of ${vals.join(' and ')} cubes`);
  }

  // ---------- arrays and equal groups ----------
  function array({ r, c, color = C.ten, groupRows = true, label } = {}) {
    const S = Scene({ yaw: 0, pitch: 55, scale: 20 });
    S.group(0).shadow(c * .55, r * .55, 0, c * .65 + .6, r * .65 + .6).box(-0.4, -0.4, 0, c * 1.1 + 0.6, r * 1.1 + 0.6, 0.35, C.slab, { contrast: 0.6 });
    for (let i = 0; i < r; i++) {
      if (groupRows && r > 1) { const y = (r - 1 - i) * 1.1 + 0.15; S.group(0.5).face([[-.2, y - .1, .36], [c * 1.1, y - .1, .36], [c * 1.1, y + .95, .36], [-.2, y + .95, .36]], '#232836', { flat: true, edge: '#4a5266' }); }
      for (let j = 0; j < c; j++) S.group(1).sphere(j * 1.1 + 0.45, (r - 1 - i) * 1.1 + 0.6, 0.75, 0.4, i % 2 ? shade(color, -0.12) : color);
    }
    return S.svg(label ?? `${r} rows of ${c}`);
  }
  // k plates with `each` counters; pending counters wait in a pile
  function plates({ k, each = 0, extra = 0, pile = 0, label } = {}) {
    const S = Scene({ yaw: 0, pitch: 50, scale: 16 });
    const per = Math.min(k, 4), rowsN = Math.ceil(k / per);
    for (let i = 0; i < k; i++) {
      const cx = (i % per) * 4.4, cy = -Math.floor(i / per) * 4.4;
      S.group(0).shadow(cx, cy, 0, 2.2, 2.2).cylinder(cx, cy, 0, 1.9, 0.25, C.paper, { n: 48 });
      const cnt = each + (i < extra ? 1 : 0);
      for (let j = 0; j < cnt; j++) { const a = j / Math.max(1, cnt) * Math.PI * 2, rr = cnt === 1 ? 0 : (cnt < 7 ? 0.9 : 1.15); S.group(1).sphere(cx + Math.cos(a) * rr * (j >= 6 ? .45 : 1), cy + Math.sin(a) * rr * (j >= 6 ? .45 : 1), 0.65, 0.38, C.one); }
    }
    for (let j = 0; j < pile; j++) { const x = per * 4.4 + (j % 4) * 0.85, y = -(rowsN - 1) * 2.2 + Math.floor(j / 4) * 0.85 - 1; S.group(1).sphere(x, y, 0.38, 0.38, C.ten); }
    return S.svg(label ?? `${k} plates`);
  }

  // ---------- number line (a plank with ticks, hops as arcs, a bead) ----------
  function numberLine({ from = 0, to = 10, mark, hops = [], marks = [], step = 1, label, highlight } = {}) {
    const n = (to - from) / step, W = Math.max(320, n * 34), u = (W - 40) / n, X = v => 20 + (v - from) / step * u;
    const H = hops.length ? 124 : 92, base = H - 46;
    let s = `<svg class="r3" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label ?? `number line from ${from} to ${to}`}"><defs><radialGradient id="nlb" cx="36%" cy="30%" r="72%"><stop offset="0" stop-color="${shade(C.one, .55)}"/><stop offset=".38" stop-color="${C.one}"/><stop offset="1" stop-color="${shade(C.one, -.5)}"/></radialGradient></defs>`;
    s += `<rect x="6" y="${base}" width="${W - 12}" height="12" rx="3" fill="${shade(C.slab, .12)}"/><rect x="6" y="${base + 12}" width="${W - 12}" height="7" rx="2" fill="${shade(C.slab, -.35)}"/>`;
    for (let i = 0; i <= n; i++) {
      const v = from + i * step, x = X(v), major = v % (step * 5) === 0 || n <= 12;
      const hl = (highlight ?? []).includes(v);
      s += `<line x1="${x}" y1="${base}" x2="${x}" y2="${base + (major ? 12 : 7)}" stroke="#cfd4de" stroke-width="${major ? 1.6 : 1}"/>`;
      if (major || hl) s += `<text x="${x}" y="${base + 36}" text-anchor="middle" font-family="Lato,sans-serif" font-size="${hl ? 15 : 13}" font-weight="${hl ? 900 : 700}" fill="${hl ? '#f6c56b' : '#b4bacb'}">${v}</text>`;
    }
    hops.forEach(([a, b], i) => {
      const x1 = X(a), x2 = X(b), mid = (x1 + x2) / 2, top = base - 18 - Math.min(40, Math.abs(x2 - x1) * .35);
      const col = b >= a ? '#5fd3c9' : '#f08aa7';
      s += `<path d="M${x1} ${base - 2} Q${mid} ${top} ${x2} ${base - 2}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" class="hop" style="--i:${i}"/>`;
      s += `<path d="M${x2} ${base - 2} l${b >= a ? -6 : 6} -5" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>`;
      if (hops.length <= 6 && Math.abs(b - a) !== 1) s += `<text x="${mid}" y="${top + 2}" text-anchor="middle" font-family="Lato,sans-serif" font-size="12" font-weight="700" fill="${col}">${b >= a ? '+' : '−'}${Math.abs(b - a)}</text>`;
    });
    marks.forEach(v => { s += `<circle cx="${X(v)}" cy="${base - 9}" r="5" fill="#cfd4de"/>`; });
    if (mark != null) s += `<ellipse cx="${X(mark)}" cy="${base + 1}" rx="10" ry="3" fill="#000" opacity=".35"/><circle cx="${X(mark)}" cy="${base - 10}" r="10" fill="url(#nlb)" stroke="${shade(C.one, -.45)}" stroke-width=".8"/>`;
    return s + '</svg>';
  }

  // ---------- fraction bars ----------
  function fractionBars(rows, label) {
    // rows: [{n, k, color}]
    const S = Scene({ yaw: -12, pitch: 30, scale: 15 });
    const L = 12;
    rows.forEach((r, i) => {
      const y = -i * 2.4; S.group(0).shadow(L / 2, y + .5, 0, L / 2 + .4, .8);
      for (let j = 0; j < r.n; j++) {
        const w = L / r.n, on = j < r.k;
        S.group(1).box(j * w + 0.04, y, 0, w - 0.08, 1, 0.9, on ? (r.color ?? C.rose) : '#d9dce3', { contrast: .8 });
      }
    });
    return S.svg(label ?? 'fraction bars');
  }
  function fractionSet({ n, k, label } = {}) {
    const S = Scene({ yaw: 0, pitch: 50, scale: 20 }); const per = Math.min(n, 6);
    for (let i = 0; i < n; i++) S.group(1).shadow((i % per) * 1.2, -Math.floor(i / per) * 1.2, 0, .45, .45).sphere((i % per) * 1.2, -Math.floor(i / per) * 1.2, .42, .42, i < k ? C.rose : '#c9ced8');
    return S.svg(label ?? `${k} of ${n}`);
  }
  // a round pizza-like disc cut into n slices with k shaded
  function fractionDisc({ n, k, label } = {}) {
    const S = Scene({ yaw: 0, pitch: 52, scale: 26 });
    S.group(0).shadow(0, 0, 0, 2.4, 2.4);
    for (let i = 0; i < n; i++) {
      const a0 = i / n * Math.PI * 2 - Math.PI / 2, a1 = (i + 1) / n * Math.PI * 2 - Math.PI / 2, poly = [[0, 0]];
      const steps = Math.max(2, Math.ceil(24 / n));
      for (let j = 0; j <= steps; j++) { const a = a0 + (a1 - a0) * j / steps; poly.push([Math.cos(a) * 2.2, -Math.sin(a) * 2.2]); }
      const gap = 0.06, mid = (a0 + a1) / 2, dx = Math.cos(mid) * gap, dy = -Math.sin(mid) * gap;
      S.group(1).prism(poly.map(p => [p[0] + dx, p[1] + dy]), 0, 0.35, i < k ? C.rose : '#d9dce3', { contrast: .7 });
    }
    return S.svg(label ?? `${k} of ${n} equal parts`);
  }

  // ---------- shapes ----------
  const POLY = {
    triangle: [[0, 0], [2.4, 0], [1.2, 2.1]],
    square: [[0, 0], [2, 0], [2, 2], [0, 2]],
    rectangle: [[0, 0], [3, 0], [3, 1.7], [0, 1.7]],
    pentagon: [...Array(5)].map((_, i) => [Math.cos(Math.PI / 2 + i * 2 * Math.PI / 5) * 1.3, Math.sin(Math.PI / 2 + i * 2 * Math.PI / 5) * 1.3]),
    hexagon: [...Array(6)].map((_, i) => [Math.cos(i * Math.PI / 3) * 1.3, Math.sin(i * Math.PI / 3) * 1.3]),
    circle: [...Array(48)].map((_, i) => [Math.cos(i / 48 * Math.PI * 2) * 1.3, Math.sin(i / 48 * Math.PI * 2) * 1.3]),
    oval: [...Array(48)].map((_, i) => [Math.cos(i / 48 * Math.PI * 2) * 1.7, Math.sin(i / 48 * Math.PI * 2) * 1.05]),
    rhombus: [[0, 0], [1.3, -1.6], [2.6, 0], [1.3, 1.6]],
  };
  const SHAPE_COL = { triangle: C.one, square: C.ten, rectangle: C.hund, pentagon: C.indigo, hexagon: C.rose, circle: C.one, oval: C.ten, rhombus: C.hund };
  function shape2d(name, { corners = false, label } = {}) {
    const S = Scene({ yaw: 0, pitch: 62, scale: 30 }); const p = POLY[name];
    const cx = p.reduce((a, q) => a + q[0], 0) / p.length, cy = p.reduce((a, q) => a + q[1], 0) / p.length;
    S.group(0).shadow(cx, cy, 0, 1.7, 1.7);
    S.group(1).prism(p, 0, 0.32, SHAPE_COL[name], { smoothSides: name === 'circle' || name === 'oval' });
    if (corners && p.length < 10) p.forEach((q, i) => S.group(2).sphere(q[0], q[1], 0.34, 0.13, '#f4f5f8').text(q[0] + (q[0] - cx) * .32, q[1] + (q[1] - cy) * .32, 0.34, String(i + 1), { size: .42, fill: '#f6c56b' }));
    return S.svg(label ?? name);
  }
  const SOLIDS = ['cube', 'cuboid', 'sphere', 'cylinder', 'cone', 'pyramid', 'prism'];
  const SOLID_FACTS = {
    cube: { faces: 6, edges: 12, vertices: 8, note: 'six square faces, all the same size', looks: 'a dice' },
    cuboid: { faces: 6, edges: 12, vertices: 8, note: 'six rectangle faces', looks: 'a brick or a box' },
    sphere: { faces: 1, edges: 0, vertices: 0, note: 'one curved surface and no corners', looks: 'a ball' },
    cylinder: { faces: 3, edges: 2, vertices: 0, note: 'two flat circles and one curved surface', looks: 'a tin can' },
    cone: { faces: 2, edges: 1, vertices: 1, note: 'one flat circle, one curved surface and a point', looks: 'an ice-cream cone' },
    pyramid: { faces: 5, edges: 8, vertices: 5, note: 'a square base and four triangles that meet at a point', looks: 'the pyramids in Egypt' },
    prism: { faces: 5, edges: 9, vertices: 6, note: 'two triangle ends joined by three rectangles', looks: 'a tent' },
  };
  function solid(name, yaw = -30, pitch = 22) {
    const S = Scene({ yaw, pitch, scale: 30 });
    S.group(0).shadow(0, 0, 0, 1.6, 1.6); S.group(1);
    const col = { cube: C.ten, cuboid: C.hund, sphere: C.one, cylinder: C.indigo, cone: C.one, pyramid: C.rose, prism: C.ten }[name];
    if (name === 'cube') S.box(-1, -1, 0, 2, 2, 2, col);
    if (name === 'cuboid') S.box(-1.5, -0.8, 0, 3, 1.6, 1.4, col);
    if (name === 'sphere') S.sphere(0, 0, 1.2, 1.2, col, { matte: true });
    if (name === 'cylinder') S.cylinder(0, 0, 0, 1.05, 2.2, col, { n: 56 });
    if (name === 'cone') S.cone(0, 0, 0, 1.15, 2.5, col, { n: 56 });
    if (name === 'pyramid') S.pyramid([[-1.1, -1.1], [1.1, -1.1], [1.1, 1.1], [-1.1, 1.1]], 0, 2.1, col);
    if (name === 'prism') { // triangular prism lying along x
      const tri = (x) => [[x, -1.1, 0], [x, 1.1, 0], [x, 0, 1.8]];
      const a = tri(-1.4), b = tri(1.4);
      S.face([a[0], a[2], a[1]], col).face([b[0], b[1], b[2]], col)
        .face([a[0], b[0], b[2], a[2]], col).face([a[1], a[2], b[2], b[1]], col).face([a[0], a[1], b[1], b[0]], col);
    }
    return S.svg(`a ${name}`, { minW: 120 });
  }

  // ---------- clock ----------
  function clock({ h = 3, m = 0, label } = {}) {
    const hr = ((h % 12) + m / 60) * 30, mn = m * 6, R = 80;
    let s = `<svg class="r3" viewBox="-100 -96 200 206" role="img" aria-label="${label ?? `a clock showing ${h}:${String(m).padStart(2, '0')}`}">`;
    s += `<ellipse cx="0" cy="96" rx="78" ry="9" fill="#000" opacity=".35" filter="blur(4px)"/>`;
    s += `<circle cx="0" cy="6" r="${R + 8}" fill="${shade(C.slab, -.4)}"/><circle cx="0" cy="0" r="${R + 8}" fill="${shade(C.slab, .15)}"/><circle cx="0" cy="0" r="${R + 2}" fill="${shade(C.slab, -.25)}"/><circle cx="0" cy="1.5" r="${R}" fill="#f3f1ea"/>`;
    for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, big = i % 5 === 0, r1 = R - (big ? 9 : 5); s += `<line x1="${Math.sin(a) * r1}" y1="${-Math.cos(a) * r1}" x2="${Math.sin(a) * (R - 2)}" y2="${-Math.cos(a) * (R - 2)}" stroke="#2b3140" stroke-width="${big ? 2.2 : 1}"/>`; }
    for (let i = 1; i <= 12; i++) { const a = i * 30 * Math.PI / 180; s += `<text x="${Math.sin(a) * (R - 22)}" y="${-Math.cos(a) * (R - 22) + 1}" text-anchor="middle" dominant-baseline="middle" font-family="Lato,sans-serif" font-weight="900" font-size="15" fill="#1f2433">${i}</text>`; }
    const hand = (deg, len, w, col) => `<g transform="rotate(${deg})"><line x1="2" y1="12" x2="2" y2="${-len + 2}" stroke="#000" stroke-opacity=".22" stroke-width="${w}" stroke-linecap="round"/><line x1="0" y1="10" x2="0" y2="${-len}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/></g>`;
    s += hand(hr, 44, 7, '#1f2433') + hand(mn, 64, 4, C.hund) + `<circle r="5" fill="${C.brass}"/>`;
    return s + '</svg>';
  }

  // ---------- money (₹ coins and notes) ----------
  const NOTE_COL = { 10: '#9a6b4a', 20: '#b7b54a', 50: '#4aa3b8', 100: '#8e83c7', 200: '#e0a93a', 500: '#8d9198' };
  function money(items, label) {
    const S = Scene({ yaw: 0, pitch: 48, scale: 18 });
    let x = 0;
    const notes = items.filter(v => NOTE_COL[v] && v >= 10 && !String(v).startsWith('c')), coins = items.filter(v => !(v >= 10 && NOTE_COL[v]) || String(v).startsWith('c')).map(v => +String(v).replace('c', ''));
    notes.forEach((v, i) => {
      const nx = x, ny = 0;
      S.group(0).shadow(nx + 3, ny + 1.5, 0, 3.4, 1.8).box(nx, ny, 0, 6, 3, 0.12, NOTE_COL[v], { contrast: .5, topDecal: P => { const a = P([nx + .3, ny + .3, .13]), b = P([nx + 5.7, ny + 2.7, .13]); const c = P([nx + 3, ny + 1.5, .13]); return `<rect x="${Math.min(a[0], b[0])}" y="${Math.min(a[1], b[1])}" width="${Math.abs(b[0] - a[0])}" height="${Math.abs(b[1] - a[1])}" fill="none" stroke="#ffffff" stroke-opacity=".45" rx="2"/><text x="${c[0]}" y="${c[1]}" font-family="Lato,sans-serif" font-weight="900" font-size="${S.scale * 1.15}" fill="#fff" text-anchor="middle" dominant-baseline="middle">₹${v}</text><text x="${c[0]}" y="${c[1] + S.scale * 0.95}" font-family="Lato,sans-serif" font-weight="700" font-size="${S.scale * .42}" fill="#fff" opacity=".85" text-anchor="middle" letter-spacing="1">PLAY NOTE</text>`; } });
      x += 6.8;
    });
    coins.forEach((v, i) => {
      const r = { 1: .95, 2: 1.05, 5: 1.15, 10: 1.25, 20: 1.3 }[v] ?? 1, cx = x + r, cy = 1.5;
      const col = v === 10 || v === 20 ? C.brass : C.steel;
      S.group(1).shadow(cx, cy, 0, r + .1, r + .1).cylinder(cx, cy, 0, r, 0.28, col, { n: 48, topDecal: P => { const c = P([cx, cy, .29]); return (v === 10 || v === 20 ? `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${r * .68 * S.scale}" ry="${r * .68 * S.scale * Math.sin(S.pitch)}" fill="${shade(C.steel, .1)}"/>` : '') + `<text x="${c[0]}" y="${c[1]}" font-family="Lato,sans-serif" font-weight="900" font-size="${S.scale * .95}" fill="#2b3140" text-anchor="middle" dominant-baseline="middle">₹${v}</text><text x="${c[0]}" y="${c[1] + S.scale * 0.95}" font-family="Lato,sans-serif" font-weight="700" font-size="${S.scale * .42}" fill="#fff" opacity=".85" text-anchor="middle" letter-spacing="1">PLAY NOTE</text>`; } });
      x += r * 2 + 0.45;
    });
    return S.svg(label ?? `money: ${items.join(', ')} rupees`);
  }

  // ---------- ruler ----------
  function ruler({ len = 7, start = 0, size = 12, label } = {}) {
    const u = 26, W = size * u + 40, s0 = 20;
    let s = `<svg class="r3" viewBox="0 0 ${W} 120" role="img" aria-label="${label ?? `a ruler measuring ${len} centimetres`}">`;
    const X = v => s0 + v * u;
    s += `<rect x="${X(start)}" y="22" width="${len * u}" height="16" rx="8" fill="${C.ten}"/><rect x="${X(start)}" y="34" width="${len * u}" height="8" rx="4" fill="${shade(C.ten, -.35)}"/><rect x="${X(start) + 6}" y="25" width="${len * u - 12}" height="4" rx="2" fill="${shade(C.ten, .4)}" opacity=".8"/>`;
    s += `<line x1="${X(start)}" y1="18" x2="${X(start)}" y2="58" stroke="#f6c56b" stroke-dasharray="3 3"/><line x1="${X(start + len)}" y1="18" x2="${X(start + len)}" y2="58" stroke="#f6c56b" stroke-dasharray="3 3"/>`;
    s += `<rect x="4" y="56" width="${W - 8}" height="40" rx="4" fill="${C.wood}"/><rect x="4" y="94" width="${W - 8}" height="8" rx="3" fill="${shade(C.wood, -.4)}"/>`;
    for (let i = 0; i <= size * 10; i++) { const x = s0 + i * u / 10, big = i % 10 === 0, mid = i % 5 === 0; s += `<line x1="${x}" y1="56" x2="${x}" y2="${56 + (big ? 16 : mid ? 11 : 6)}" stroke="#3a2c18" stroke-width="${big ? 1.4 : .7}"/>`; if (big) s += `<text x="${x}" y="84" text-anchor="middle" font-family="Lato,sans-serif" font-weight="700" font-size="12" fill="#3a2c18">${i / 10}</text>`; }
    return s + `<text x="${W - 14}" y="90" text-anchor="end" font-family="Lato,sans-serif" font-size="10" fill="#3a2c18">cm</text></svg>`;
  }

  window.VIS = { C, tenFrame, blocks, towers, array, plates, numberLine, fractionBars, fractionSet, fractionDisc, shape2d, solid, clock, money, ruler, POLY, SOLIDS, SOLID_FACTS };
})();
