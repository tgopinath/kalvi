// R3 — a tiny orthographic 3D renderer that outputs crisp SVG.
// World axes: x right, y away from the viewer, z up. Objects are convex groups;
// faces are back-face culled and groups are painted far to near.
(function () {
  const D2R = Math.PI / 180;
  const hex = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const toHex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  // k > 0 mixes toward white, k < 0 toward a deep ink (not pure black, keeps colour rich)
  function shade(h, k) {
    const c = hex(h), t = k > 0 ? [255, 255, 255] : [12, 14, 22], a = Math.abs(k);
    return toHex(c.map((v, i) => v + (t[i] - v) * a));
  }
  const norm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const LIGHT = norm([0.35, -0.55, 0.78]);
  let uid = 0;

  function Scene(o = {}) {
    const yaw = (o.yaw ?? -30) * D2R, pitch = (o.pitch ?? 28) * D2R, s = o.scale ?? 20;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const rot = ([x, y, z]) => { const x1 = x * cy - y * sy, y1 = x * sy + y * cy; return [x1, y1 * cp - z * sp, y1 * sp + z * cp]; };
    const P = p => { const r = rot(p); return [r[0] * s, -r[2] * s, r[1]]; };
    const groups = [], defs = new Map(), id = 'r' + (++uid);
    let cur = null;
    const bounds = [Infinity, Infinity, -Infinity, -Infinity];
    const grow = (x, y) => { bounds[0] = Math.min(bounds[0], x); bounds[1] = Math.min(bounds[1], y); bounds[2] = Math.max(bounds[2], x); bounds[3] = Math.max(bounds[3], y); };

    function group(layer = 1) { cur = { layer, items: [], depth: 0, n: 0 }; groups.push(cur); return api; }
    function ensure() { if (!cur) group(); return cur; }
    function track(d) { cur.depth += d; cur.n++; }

    // face: world points (counter-clockwise seen from outside), base colour
    function face(pts, color, opt = {}) {
      const g = ensure();
      const n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
      const vn = rot(n);
      if (!opt.both && vn[1] >= -1e-6) { pts.forEach(p => { const q = P(p); track(q[2]); }); return api; }
      const lam = Math.max(0, dot(n, LIGHT));
      const k = opt.flat ? 0 : (lam - 0.62) * (opt.contrast ?? 0.9);
      const fill = shade(color, k);
      const q = pts.map(P); q.forEach(p => { grow(p[0], p[1]); track(p[2]); });
      const d = q.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ');
      const stroke = opt.smooth ? fill : (opt.edge ?? shade(color, -0.42));
      g.items.push(`<polygon points="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${opt.smooth ? 0.6 : (opt.ew ?? 1)}" stroke-linejoin="round"/>`);
      if (opt.seams) for (const [a, b] of opt.seams) { const A = P(a), B = P(b); g.items.push(`<line x1="${A[0].toFixed(2)}" y1="${A[1].toFixed(2)}" x2="${B[0].toFixed(2)}" y2="${B[1].toFixed(2)}" stroke="${shade(color, -0.3)}" stroke-width="0.8" stroke-opacity=".75"/>`); }
      if (opt.decal) g.items.push(opt.decal(P));
      return api;
    }

    // axis-aligned box; unit:true draws unit-cube seams (base-ten blocks)
    function box(x, y, z, w, d, h, color, opt = {}) {
      const X = x + w, Y = y + d, Z = z + h;
      const seam = (o2, U, V, nu, nv) => {
        if (!opt.unit) return null; const L = [];
        for (let i = 1; i < nu; i++) L.push([[o2[0] + U[0] * i / nu, o2[1] + U[1] * i / nu, o2[2] + U[2] * i / nu], [o2[0] + U[0] * i / nu + V[0], o2[1] + U[1] * i / nu + V[1], o2[2] + U[2] * i / nu + V[2]]]);
        for (let j = 1; j < nv; j++) L.push([[o2[0] + V[0] * j / nv, o2[1] + V[1] * j / nv, o2[2] + V[2] * j / nv], [o2[0] + V[0] * j / nv + U[0], o2[1] + V[1] * j / nv + U[1], o2[2] + V[2] * j / nv + U[2]]]);
        return L;
      };
      const o2 = { ...opt };
      face([[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]], color, { ...o2, seams: seam([x, y, Z], [w, 0, 0], [0, d, 0], Math.round(w), Math.round(d)), decal: opt.topDecal });
      face([[x, y, z], [X, y, z], [X, y, Z], [x, y, Z]], color, { ...o2, seams: seam([x, y, z], [w, 0, 0], [0, 0, h], Math.round(w), Math.round(h)), decal: opt.frontDecal });
      face([[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]], color, { ...o2, seams: seam([X, y, z], [0, d, 0], [0, 0, h], Math.round(d), Math.round(h)) });
      face([[x, Y, z], [x, y, z], [x, y, Z], [x, Y, Z]], color, { ...o2, seams: seam([x, y, z], [0, d, 0], [0, 0, h], Math.round(d), Math.round(h)) });
      face([[X, Y, z], [x, Y, z], [x, Y, Z], [X, Y, Z]], color, o2);
      face([[x, Y, z], [X, Y, z], [X, y, z], [x, y, z]], color, o2);
      return api;
    }

    // extrude a 2D polygon (x,y on the floor plane) upward by h
    function prism(poly, z, h, color, opt = {}) {
      const ccw = poly.reduce((a, p, i) => { const q = poly[(i + 1) % poly.length]; return a + (p[0] * q[1] - q[0] * p[1]); }, 0) > 0;
      const pts = ccw ? poly : [...poly].reverse();
      face(pts.map(p => [p[0], p[1], z + h]), color, { ...opt, decal: opt.topDecal });
      face([...pts].reverse().map(p => [p[0], p[1], z]), color, opt);
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        face([[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z + h], [a[0], a[1], z + h]], color, { ...opt, smooth: opt.smoothSides });
      }
      return api;
    }
    function cylinder(cx, cy2, z, r, h, color, opt = {}) {
      const n = opt.n ?? 40, poly = [];
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; poly.push([cx + Math.cos(a) * r, cy2 + Math.sin(a) * r]); }
      return prism(poly, z, h, color, { ...opt, smoothSides: true });
    }
    function cone(cx, cy2, z, r, h, color, opt = {}) {
      const n = opt.n ?? 40, top = [cx, cy2, z + h], base = [];
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; base.push([cx + Math.cos(a) * r, cy2 + Math.sin(a) * r, z]); }
      face([...base].reverse(), color, opt);
      for (let i = 0; i < n; i++) face([base[i], base[(i + 1) % n], top], color, { ...opt, smooth: true });
      return api;
    }
    function pyramid(poly, z, h, color, opt = {}) {
      const c = poly.reduce((a, p) => [a[0] + p[0] / poly.length, a[1] + p[1] / poly.length], [0, 0]);
      const top = [c[0], c[1], z + h], base = poly.map(p => [p[0], p[1], z]);
      face([...base].reverse(), color, opt);
      for (let i = 0; i < base.length; i++) face([base[i], base[(i + 1) % base.length], top], color, opt);
      return api;
    }
    // shaded sphere (radial gradient) — reads as a polished bead or counter
    function sphere(x, y, z, r, color, opt = {}) {
      const g = ensure(); const q = P([x, y, z]); track(q[2]);
      const key = color + (opt.matte ? 'm' : '');
      if (!defs.has(key)) defs.set(key, `<radialGradient id="${id}g${defs.size}" cx="36%" cy="30%" r="72%"><stop offset="0" stop-color="${shade(color, opt.matte ? 0.25 : 0.55)}"/><stop offset=".38" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, -0.5)}"/></radialGradient>`);
      const gi = [...defs.keys()].indexOf(key), R = r * s;
      grow(q[0] - R, q[1] - R); grow(q[0] + R, q[1] + R);
      g.items.push(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${R.toFixed(2)}" fill="url(#${id}g${gi})" stroke="${shade(color, -0.45)}" stroke-width=".6"/>`);
      if (opt.ghost) g.items[g.items.length - 1] = g.items[g.items.length - 1].replace('<circle', '<circle opacity=".28"');
      if (opt.cross) g.items.push(`<path d="M${q[0] - R * .7} ${q[1] - R * .7}L${q[0] + R * .7} ${q[1] + R * .7}M${q[0] + R * .7} ${q[1] - R * .7}L${q[0] - R * .7} ${q[1] + R * .7}" stroke="#f4f5f8" stroke-width="${Math.max(1.6, R * .22)}" stroke-linecap="round"/>`);
      return api;
    }
    // soft contact shadow on the floor
    function shadow(x, y, z, rx, ry) {
      const g = ensure(); const q = P([x, y, z]); track(q[2]);
      g.items.unshift(`<ellipse cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" rx="${(rx * s).toFixed(2)}" ry="${(ry * s * Math.max(.25, sp)).toFixed(2)}" fill="#000" opacity=".38" filter="url(#${id}blur)"/>`);
      return api;
    }
    function text(x, y, z, str, opt = {}) {
      const g = ensure(); const q = P([x, y, z]); track(q[2]);
      const size = (opt.size ?? 0.8) * s; grow(q[0] - size, q[1] - size); grow(q[0] + size, q[1] + size * .4);
      g.items.push(`<text x="${q[0].toFixed(2)}" y="${q[1].toFixed(2)}" font-size="${size.toFixed(1)}" font-weight="${opt.weight ?? 900}" fill="${opt.fill ?? '#eef0f5'}" text-anchor="${opt.anchor ?? 'middle'}" dominant-baseline="middle" font-family="Lato, sans-serif"${opt.flat ? ` transform="translate(${q[0].toFixed(2)} ${q[1].toFixed(2)}) scale(1 ${sp.toFixed(3)}) translate(${(-q[0]).toFixed(2)} ${(-q[1]).toFixed(2)})"` : ''}>${str}</text>`);
      return api;
    }
    function raw(svg, pts) { const g = ensure(); pts.forEach(p => { const q = P(p); grow(q[0], q[1]); track(q[2]); }); g.items.push(typeof svg === 'function' ? svg(P) : svg); return api; }
    function project(p) { return P(p); }

    function svg(label = '', o2 = {}) {
      const pad = o2.pad ?? 10;
      const order = groups.filter(g => g.items.length).map((g, i) => ({ g, i, d: g.n ? g.depth / g.n : 0 }))
        .sort((a, b) => a.g.layer - b.g.layer || b.d - a.d || a.i - b.i);
      if (o2.minW) { const cx = (bounds[0] + bounds[2]) / 2, w = Math.max(o2.minW, bounds[2] - bounds[0]); bounds[0] = cx - w / 2; bounds[2] = cx + w / 2; }
      const vb = [bounds[0] - pad, bounds[1] - pad, bounds[2] - bounds[0] + pad * 2, bounds[3] - bounds[1] + pad * 2].map(v => v.toFixed(1)).join(' ');
      return `<svg class="r3" viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="${id}blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${(s * .18).toFixed(1)}"/></filter>${[...defs.values()].join('')}</defs>${order.map(o3 => o3.g.items.join('')).join('')}</svg>`;
    }
    const api = { group, face, box, prism, cylinder, cone, pyramid, sphere, shadow, text, raw, project, svg, scale: s, pitch };
    return api;
  }
  window.R3 = { Scene, shade };
})();
