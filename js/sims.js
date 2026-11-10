// Science demos. Each sim: init state, draw(state) -> SVG, ctrls(state) -> HTML controls, read(state) -> caption,
// optional tick(state, dt) for animation. mount(el, key, state) wires them up; snap(key, state) gives a still picture.
(function () {
  const shade = R3.shade, esc = Engine.esc;
  const range = (id, label, min, max, step, val, fmt = v => v) => `<label class="range"><span>${label}</span><input type="range" data-r="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output>${fmt(val)}</output></label>`;
  const seg = (id, opts, val) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-s="${id}" data-v="${v}" aria-pressed="${String(v) === String(val)}">${l}</button>`).join('')}</div>`;
  const svg = (w, h, inner, label = '') => `<svg class="r3" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  const ball = (x, y, r, col, id) => `<defs><radialGradient id="${id}" cx="36%" cy="30%" r="72%"><stop offset="0" stop-color="${shade(col, .55)}"/><stop offset=".4" stop-color="${col}"/><stop offset="1" stop-color="${shade(col, -.5)}"/></radialGradient></defs><ellipse cx="${x}" cy="${y + r}" rx="${r}" ry="${r * .25}" fill="#000" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})"/>`;

  const SIMS = {
    // ---------- forces: ball on a ramp ----------
    ramp: {
      init: { angle: 25, surface: 'wood', p: 0, done: false },
      mu: { ice: 0.04, wood: 0.18, carpet: 0.5 },
      dist(s) { const h = Math.sin(s.angle * Math.PI / 180) * 160; return Math.round(h / this.mu[s.surface] * 0.6); },
      draw(s) {
        const a = s.angle * Math.PI / 180, L = 160, x0 = 40, y0 = 190 - Math.sin(a) * L, x1 = x0 + Math.cos(a) * L, y1 = 190;
        const d = Math.min(this.dist(s), 520), total = L + d, pos = s.done ? total : s.p * total;
        let bx, by; if (pos <= L) { bx = x0 + Math.cos(a) * pos + Math.sin(a) * 9; by = y0 + Math.sin(a) * pos - Math.cos(a) * 9; } else { bx = x1 + Math.min(pos - L, 560 - x1); by = 181; }
        const floor = { ice: '#9fd3e6', wood: '#b88a58', carpet: '#9b4d5c' }[s.surface];
        return svg(600, 230, `<rect x="0" y="190" width="600" height="14" fill="${floor}"/><rect x="0" y="204" width="600" height="8" fill="${shade(floor, -.4)}"/>
          ${[...Array(12)].map((_, i) => `<line x1="${x1 + i * 40}" y1="208" x2="${x1 + i * 40}" y2="214" stroke="#cfd4de" stroke-width="1"/>`).join('')}
          <polygon points="${x0 - 10},190 ${x1},190 ${x0 - 10},${y0}" fill="#394054"/><polygon points="${x0 - 10},${y0} ${x1},190 ${x1 + 6},190 ${x0 - 10},${y0 - 6}" fill="${shade('#394054', .25)}"/>
          ${ball(bx, by, 9, '#e2a336', 'rb')}${s.done ? `<line x1="${x1}" y1="222" x2="${x1 + Math.min(d, 560 - x1)}" y2="222" stroke="#f6c56b" stroke-width="2" marker-end="url(#ar)"/>` : ''}`, 'ball on a ramp');
      },
      ctrls(s) { return range('angle', t('s.ui.angle'), 10, 40, 1, s.angle, v => v + '°') + seg('surface', [['ice', t('s.ui.ice')], ['wood', t('s.ui.wood')], ['carpet', t('s.ui.carpet')]], s.surface) + `<button type="button" class="k-btn k-btn-primary" data-act="go">${t('s.ui.roll')}</button>`; },
      read(s) { return s.done ? t('s.ui.rolled', { d: this.dist(s) }) : ''; },
      act(s) { s.p = 0; s.done = false; s.run = true; },
      tick(s, dt) { if (!s.run) return false; s.p += dt / 2200; if (s.p >= 1) { s.p = 1; s.done = true; s.run = false; } return true; },
      tries: [{ angle: 38, surface: 'ice' }, { angle: 14, surface: 'carpet' }, { angle: 25, surface: 'wood' }],
    },
    // ---------- light: prism ----------
    prism: {
      init: { angle: 30, beam: 'white' },
      draw(s) {
        const cx = 300, cy = 120, R = 70, rot = (s.angle - 30) * Math.PI / 180;
        const pts = [0, 1, 2].map(i => { const a = -Math.PI / 2 + i * 2 * Math.PI / 3 + rot; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; });
        const hit = [cx - 38, cy + 8], slant = Math.abs(s.angle - 30) < 26;
        const cols = s.beam === 'white' ? ['#ff4d4d', '#ff9f43', '#ffe14d', '#4cd964', '#3ea6ff', '#5b5bd6', '#a55eea'] : ['#ff4d4d'];
        let rays = `<line x1="20" y1="${cy - 10}" x2="${hit[0]}" y2="${hit[1]}" stroke="${s.beam === 'white' ? '#ffffff' : '#ff4d4d'}" stroke-width="5" stroke-linecap="round"/>`;
        const ex = [cx + 30, cy + 10];
        cols.forEach((c, i) => { const spread = slant ? (s.beam === 'white' ? (i - 3) * 7 : 0) : 0, bend = slant ? 40 + (s.angle - 30) * 0.8 : 10;
          rays += `<line x1="${hit[0]}" y1="${hit[1]}" x2="${ex[0]}" y2="${ex[1] + spread * .3}" stroke="${c}" stroke-width="2" opacity=".9"/><line x1="${ex[0]}" y1="${ex[1] + spread * .3}" x2="580" y2="${ex[1] + bend + spread * 3.2}" stroke="${c}" stroke-width="${s.beam === 'white' && slant ? 5 : 5}" stroke-linecap="round"/>`; });
        return svg(600, 240, `${rays}<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="#bfe3ff" fill-opacity=".22" stroke="#d8efff" stroke-width="2"/><polygon points="${pts.map((p, i) => i === 0 ? p.join(',') : [p[0] + 6, p[1] + 6].join(',')).join(' ')}" fill="#ffffff" fill-opacity=".05"/>`, 'light through a prism');
      },
      ctrls(s) { return range('angle', t('s.ui.turn'), 0, 60, 1, s.angle, v => v + '°') + seg('beam', [['white', t('s.ui.white')], ['red', t('s.ui.red')]], s.beam); },
      read(s) { return Math.abs(s.angle - 30) >= 26 ? t('s.ui.straight') : s.beam === 'white' ? t('s.ui.split') : t('s.ui.bends'); },
      tries: [{ angle: 30, beam: 'white' }, { angle: 30, beam: 'red' }, { angle: 58, beam: 'white' }],
    },
    // ---------- sound: wave + press-to-play tone ----------
    sound: {
      init: { f: 300, amp: 0.6 },
      draw(s) { const k = s.f / 100, A = 18 + s.amp * 60; let d = ''; for (let x = 0; x <= 560; x += 2) d += `${x ? 'L' : 'M'}${x + 20} ${120 + Math.sin(x / 560 * Math.PI * 2 * k) * A}`;
        return svg(600, 240, `<line x1="20" y1="120" x2="580" y2="120" stroke="#3a4152"/><path d="${d}" fill="none" stroke="#5fd3c9" stroke-width="3" stroke-linejoin="round"/><rect x="0" y="20" width="12" height="200" rx="4" fill="#d3a94a"/>`, 'sound wave'); },
      ctrls(s) { return range('f', t('s.ui.pitch'), 100, 800, 10, s.f, v => v + ' Hz') + range('amp', t('s.ui.loud'), 0.1, 1, 0.05, s.amp, v => Math.round(v * 100) + '%') + `<button type="button" class="k-btn k-btn-outline pill" data-hold><svg class="k-icon"><use href="#i-sound"/></svg>${t('s.ui.hold')}</button>`; },
      read(s) { return t('s.ui.waveRead', { f: s.f, pl: s.f > 450 ? t('s.ui.high') : t('s.ui.low') }); },
      tries: [{ f: 700, amp: 0.25 }, { f: 140, amp: 0.95 }, { f: 330, amp: 0.6 }],
    },
    // ---------- magnets: drag the magnet over objects + compass needles ----------
    magnet: {
      init: { mx: 300, my: 170 },
      objs: [['nail', 1, 90, 70], ['clip', 1, 470, 80], ['spoon', 1, 520, 200], ['coin', 0, 200, 200], ['eraser', 0, 110, 190], ['stick', 0, 380, 60], ['foil', 0, 420, 205], ['button', 0, 250, 70]],
      pos(s) { return this.objs.map(([k, mag, x, y]) => { if (!mag) return [k, mag, x, y]; const dx = s.mx - x, dy = s.my - y, d = Math.hypot(dx, dy); if (d < 120) { const pull = d < 50 ? 1 : (120 - d) / 70; return [k, mag, x + dx * Math.min(.85, pull * .9), y + dy * Math.min(.85, pull * .9)]; } return [k, mag, x, y]; }); },
      draw(s) {
        let needles = ''; for (let gx = 30; gx < 600; gx += 46) for (let gy = 24; gy < 250; gy += 46) { const ax = s.mx - 26, bx = s.mx + 26; const f1 = [gx - ax, gy - s.my], f2 = [bx - gx, s.my - gy], r1 = Math.hypot(...f1) ** 3 + 1, r2 = Math.hypot(gx - bx, gy - s.my) ** 3 + 1; const fx = f1[0] / r1 + (gx - bx) / -r2, fy = f1[1] / r1 + (gy - s.my) / -r2, a = Math.atan2(fy, fx); needles += `<g transform="translate(${gx} ${gy}) rotate(${a * 180 / Math.PI})" opacity=".55"><path d="M-9 0 L0 -2.5 L9 0 L0 2.5Z" fill="#cfd4de"/><path d="M0 -2.5 L9 0 L0 2.5Z" fill="#e2566e"/></g>`; }
        const icon = { nail: '<rect x="-16" y="-2" width="32" height="4" rx="1" fill="#9aa3b2"/><rect x="-18" y="-5" width="4" height="10" fill="#9aa3b2"/>', clip: '<path d="M-12 -5h20a5 5 0 0 1 0 10h-18a3 3 0 0 1 0-6h14" fill="none" stroke="#b8c0cc" stroke-width="2.5"/>', spoon: '<ellipse cx="-10" cy="0" rx="8" ry="5" fill="#c9ced6"/><rect x="-2" y="-1.5" width="24" height="3" rx="1.5" fill="#c9ced6"/>', coin: '<circle r="10" fill="#c7cbd3"/><circle r="7" fill="none" stroke="#9aa1ad"/>', eraser: '<rect x="-12" y="-7" width="24" height="14" rx="3" fill="#e9a5b4"/>', stick: '<rect x="-20" y="-3" width="40" height="6" rx="2" fill="#a8763e"/>', foil: '<path d="M-12 -8l10 3 12-4 2 12-12 4-11-3z" fill="#d9dde3"/>', button: '<circle r="9" fill="#5b8def"/><circle cx="-3" cy="-2" r="1.5" fill="#24304a"/><circle cx="3" cy="2" r="1.5" fill="#24304a"/>' };
        const objs = this.pos(s).map(([k, , x, y]) => `<g transform="translate(${x} ${y})"><ellipse cy="10" rx="16" ry="3" fill="#000" opacity=".3"/>${icon[k]}</g>`).join('');
        const mag = `<g transform="translate(${s.mx} ${s.my})" class="magnet" style="cursor:grab"><ellipse cy="16" rx="40" ry="5" fill="#000" opacity=".4"/><rect x="-44" y="-14" width="44" height="28" rx="3" fill="#d83a4a"/><rect x="0" y="-14" width="44" height="28" rx="3" fill="#3a6fd8"/><text x="-22" y="5" fill="#fff" font-family="Lato" font-weight="900" font-size="14" text-anchor="middle">N</text><text x="22" y="5" fill="#fff" font-family="Lato" font-weight="900" font-size="14" text-anchor="middle">S</text><rect x="-44" y="-14" width="88" height="6" fill="#fff" opacity=".18"/></g>`;
        return svg(600, 250, needles + objs + mag, 'a magnet and objects');
      },
      ctrls() { return `<p class="small muted">${t('s.ui.magnetRead')}</p>`; },
      read(s) { const p = this.pos(s).filter(([k, mag, x, y], i) => mag && (x !== this.objs[i][2] || y !== this.objs[i][3])).map(([k]) => t('s.ui.' + k)); return p.length ? t('s.ui.pulled', { list: p.join(', ') }) : ''; },
      drag: true, tries: [{ mx: 120, my: 90 }, { mx: 250, my: 215 }, { mx: 300, my: 140 }],
    },
    // ---------- electricity: circuit ----------
    circuit: {
      init: { mat: 'copper', bat: 1, on: true },
      cond: { copper: 1, spoon: 0.9, lead: 0.35, rubber: 0, wood: 0 },
      draw(s) {
        const k = s.on ? this.cond[s.mat] * s.bat / 2 : 0, glow = Math.min(1, k);
        const wire = '#d38a4a', gapCol = { copper: '#d38a4a', spoon: '#c9ced6', lead: '#2b2f38', rubber: '#e0a33e', wood: '#a8763e' }[s.mat];
        const bats = [...Array(s.bat)].map((_, i) => `<g transform="translate(${110 + i * 70} 196)"><rect x="-30" y="-14" width="60" height="28" rx="5" fill="#2a2f3b"/><rect x="-30" y="-14" width="18" height="28" rx="5" fill="#e2a336"/><rect x="30" y="-6" width="5" height="12" fill="#aab2c0"/><text x="6" y="5" fill="#cfd4de" font-family="Lato" font-weight="900" font-size="12" text-anchor="middle">1.5V</text></g>`).join('');
        return svg(600, 250, `<path d="M80 196 H40 V60 H260 M340 60 H560 V196 H${110 + s.bat * 70 - 40}" fill="none" stroke="${wire}" stroke-width="5" stroke-linejoin="round"/>
          <path d="M${110 + (s.bat - 1) * 70 + 35} 196 H${110 + s.bat * 70 - 40}" stroke="${wire}" stroke-width="5"/>${s.bat === 2 ? '<path d="M145 196 H150" stroke="#d38a4a" stroke-width="5"/>' : ''}
          ${bats}<g transform="translate(300 60)"><rect x="-40" y="-8" width="80" height="16" rx="4" fill="${gapCol}" stroke="${shade(gapCol, -.4)}"/></g>
          <g transform="translate(450 60)"><circle r="12" fill="#394054"/><line x1="-12" y1="0" x2="${s.on ? 14 : 8}" y2="${s.on ? 0 : -14}" stroke="#cfd4de" stroke-width="4" stroke-linecap="round"/></g>
          <g transform="translate(150 60)">${glow ? `<circle r="${36 + glow * 26}" fill="#ffd66b" opacity="${glow * .35}"/>` : ''}<circle cy="-14" r="20" fill="${glow ? shade('#ffe9a8', -0.1 + glow * .1) : '#59606f'}" opacity=".95"/><rect x="-10" y="4" width="20" height="14" rx="2" fill="#8a919e"/><path d="M-6 -12 q6 -10 12 0" fill="none" stroke="${glow ? '#ff9f1a' : '#3a4152'}" stroke-width="2"/></g>`, 'a battery, a bulb and a gap');
      },
      ctrls(s) { return seg('mat', [['copper', t('s.ui.copper')], ['spoon', t('s.ui.spoon')], ['lead', t('s.ui.lead')], ['rubber', t('s.ui.rubberBand')], ['wood', t('s.ui.stick')]], s.mat) + seg('bat', [[1, '1'], [2, '2']], s.bat) + seg('on', [[true, t('s.ui.on')], [false, t('s.ui.off')]], s.on); },
      read(s) { const m = t('s.ui.' + { copper: 'copper', spoon: 'spoon', lead: 'lead', rubber: 'rubberBand', wood: 'stick' }[s.mat]); if (!s.on) return t('s.ui.open'); const c = this.cond[s.mat]; return c >= .8 ? t('s.ui.lit', { m }) : c > 0 ? t('s.ui.dim', { m }) : t('s.ui.dark', { m }); },
      tries: [{ mat: 'copper', bat: 1, on: true }, { mat: 'rubber', bat: 1, on: true }, { mat: 'lead', bat: 2, on: true }],
    },
    // ---------- matter: heating ice ----------
    matter: {
      init: { heat: 0.1 },
      temp(h) { // heating curve: -20 → 0 (plateau) → 100 (plateau) → 120
        const pts = [[0, -20], [.15, 0], [.35, 0], [.65, 100], [.9, 100], [1, 120]]; for (let i = 1; i < pts.length; i++) if (h <= pts[i][0]) { const [a, ta] = pts[i - 1], [b, tb] = pts[i]; return Math.round(ta + (tb - ta) * (h - a) / (b - a)); } return 120; },
      state(h) { return h < .15 ? 'solid' : h < .35 ? 'melting' : h < .65 ? 'liquid' : h < .9 ? 'boiling' : 'gas'; },
      draw(s) {
        const T = this.temp(s.heat), st = this.state(s.heat), t0 = s.tt || 0;
        const curve = [[0, -20], [.15, 0], [.35, 0], [.65, 100], [.9, 100], [1, 120]].map(([h, c]) => `${330 + h * 250},${210 - (c + 20) * 1.3}`).join(' ');
        let parts = '';
        for (let i = 0; i < 36; i++) { const gx = i % 6, gy = Math.floor(i / 6); let x = 60 + gx * 32, y = 60 + gy * 26; const j = st === 'solid' ? 1.5 : st === 'melting' ? 3 : st === 'liquid' || st === 'boiling' ? 9 : 0;
          if (st === 'liquid' || st === 'boiling') { x += Math.sin(t0 / 300 + i * 1.7) * j; y = 110 + gy * 18 + Math.cos(t0 / 260 + i) * 5; }
          else if (st === 'gas') { x = 40 + ((i * 53 + t0 / 12 * (1 + i % 3)) % 230); y = 30 + ((i * 37 + t0 / 15 * (1 + i % 2)) % 180); }
          else { x += Math.sin(t0 / 90 + i) * j; y += Math.cos(t0 / 110 + i) * j; }
          if (st === 'boiling' && i % 5 === 0) { y = 30 + ((i * 29 + t0 / 10) % 120); }
          parts += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="url(#pm)"/>`; }
        return svg(600, 240, `<defs><radialGradient id="pm" cx="36%" cy="30%" r="72%"><stop offset="0" stop-color="#d6f1ff"/><stop offset=".4" stop-color="#5fb3e6"/><stop offset="1" stop-color="#1f4f74"/></radialGradient></defs>
          <rect x="30" y="20" width="250" height="200" rx="10" fill="#1d2230" stroke="#2f3647"/>${parts}
          <line x1="330" y1="210" x2="585" y2="210" stroke="#3a4152"/><line x1="330" y1="40" x2="330" y2="210" stroke="#3a4152"/>
          <line x1="330" y1="${210 - 20 * 1.3}" x2="585" y2="${210 - 20 * 1.3}" stroke="#3a4152" stroke-dasharray="3 3"/><text x="324" y="${214 - 20 * 1.3}" fill="#9aa1b2" font-size="11" text-anchor="end" font-family="Lato">0°</text>
          <line x1="330" y1="${210 - 120 * 1.3}" x2="585" y2="${210 - 120 * 1.3}" stroke="#3a4152" stroke-dasharray="3 3"/><text x="324" y="${214 - 120 * 1.3}" fill="#9aa1b2" font-size="11" text-anchor="end" font-family="Lato">100°</text>
          <polyline points="${curve}" fill="none" stroke="#5fd3c9" stroke-width="3"/><circle cx="${330 + s.heat * 250}" cy="${210 - (T + 20) * 1.3}" r="7" fill="#f6c56b"/>`, 'heating ice');
      },
      ctrls(s) { return range('heat', t('s.ui.heat'), 0, 1, 0.01, s.heat, v => Math.round(v * 100) + '%'); },
      read(s) { return t('s.ui.tempRead', { c: this.temp(s.heat), state: t('s.ui.' + this.state(s.heat)) }); },
      tick(s, dt) { s.tt = (s.tt || 0) + dt; return true; },
      tries: [{ heat: 0.05 }, { heat: 0.25 }, { heat: 0.78 }],
    },
    // ---------- water cycle ----------
    water: {
      init: { sun: 0.5, t: 0 },
      draw(s) {
        const c = Math.min(1, s.t), raining = c > 0.8, tt = s.tt || 0;
        let drops = ''; for (let i = 0; i < Math.round(4 + s.sun * 10); i++) { const y = 190 - ((tt / (14 - s.sun * 8) + i * 23) % 110); drops += `<circle cx="${380 + (i * 37) % 170}" cy="${y}" r="2" fill="#bfe3ff" opacity="${(y - 80) / 110}"/>`; }
        let rain = ''; if (raining) for (let i = 0; i < 18; i++) { const y = 95 + ((tt / 4 + i * 31) % 100); rain += `<line x1="${120 + (i * 29) % 140}" y1="${y}" x2="${116 + (i * 29) % 140}" y2="${y + 10}" stroke="#7cc7f0" stroke-width="2"/>`; }
        const cl = 28 + c * 26, col = shade('#e6e9f0', -c * .45);
        return svg(600, 250, `<circle cx="540" cy="40" r="${18 + s.sun * 10}" fill="#ffd66b"/><circle cx="540" cy="40" r="${30 + s.sun * 18}" fill="#ffd66b" opacity=".18"/>
          <path d="M0 200 L60 120 L130 150 L190 90 L290 200 Z" fill="#4c7a5a"/><path d="M190 90 L215 110 L200 112 Z" fill="#e6e9f0" opacity=".7"/>
          <rect x="290" y="196" width="310" height="54" fill="#1e5b85"/><path d="M290 196 q12 -6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" fill="none" stroke="#5fb3e6" stroke-width="2"/>
          <path d="M290 200 C250 210 220 220 180 250" fill="none" stroke="#3c8fc4" stroke-width="6" opacity=".8"/>
          ${drops}<g fill="${col}"><circle cx="${190 - cl * .2}" cy="80" r="${cl * .8}"/><circle cx="${210}" cy="70" r="${cl}"/><circle cx="${240 + cl * .2}" cy="82" r="${cl * .75}"/><rect x="${175 - cl * .4}" y="80" width="${90 + cl * .8}" height="${cl * .6}" rx="${cl * .3}"/></g>${rain}`, 'the water cycle');
      },
      ctrls(s) { return range('sun', t('s.ui.sun'), 0.1, 1, 0.05, s.sun, v => Math.round(v * 100) + '%'); },
      read(s) { return s.t > 0.8 ? t('s.ui.rainNow') : s.t > 0.3 ? t('s.ui.cond') : t('s.ui.evap'); },
      tick(s, dt) { s.tt = (s.tt || 0) + dt; s.t = s.t > 1.25 ? 0.1 : s.t + dt * s.sun / 9000; return true; },
      tries: [{ sun: 0.15, t: 0 }, { sun: 1, t: 0.5 }],
    },
    // ---------- weather: sea and land breeze ----------
    breeze: {
      init: { hour: 14 },
      mode(h) { return h >= 10 && h <= 18 ? 'day' : h >= 21 || h <= 5 ? 'night' : 'calm'; },
      draw(s) {
        const m = this.mode(s.hour), tt = s.tt || 0, day = s.hour >= 6 && s.hour <= 18;
        const sky = day ? '#22426a' : '#0c1424', landT = m === 'day' ? '#c0714a' : m === 'night' ? '#4d5a70' : '#6b6f5a';
        let arrows = '';
        if (m !== 'calm') for (let i = 0; i < 4; i++) { const off = ((tt / 18 + i * 75) % 300); const x = m === 'day' ? 560 - off : 260 + off; arrows += `<path d="M${x} 170 l${m === 'day' ? -16 : 16} 0 m${m === 'day' ? 8 : -8} -6 l${m === 'day' ? -8 : 8} 6 l${m === 'day' ? 8 : -8} 6" fill="none" stroke="#e6e9f0" stroke-width="2.5" opacity=".8"/>`; }
        const up = m === 'day' ? 120 : 450, down = m === 'day' ? 450 : 120;
        const loop = m === 'calm' ? '' : `<path d="M${up} 160 C${up} 60, ${down} 60, ${down} 160" fill="none" stroke="#f6c56b" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/>`;
        return svg(600, 240, `<rect width="600" height="200" fill="${sky}"/>${day ? '<circle cx="80" cy="45" r="20" fill="#ffd66b"/>' : '<circle cx="80" cy="45" r="14" fill="#e6e9f0"/><circle cx="86" cy="41" r="12" fill="#0c1424"/>'}
          <rect x="0" y="190" width="300" height="50" fill="${landT}"/><rect x="300" y="194" width="300" height="46" fill="#1e5b85"/>
          <rect x="40" y="150" width="34" height="40" fill="#3a4152"/><rect x="84" y="134" width="40" height="56" fill="#465066"/><rect x="134" y="160" width="28" height="30" fill="#3a4152"/>${loop}${arrows}
          <text x="150" y="228" fill="#fff" font-family="Lato" font-weight="700" font-size="13" text-anchor="middle">${t('s.ui.landW')}</text><text x="450" y="228" fill="#fff" font-family="Lato" font-weight="700" font-size="13" text-anchor="middle">${t('s.ui.seaW')}</text>`, 'sea breeze');
      },
      ctrls(s) { return range('hour', t('s.ui.time'), 0, 23, 1, s.hour, v => `${String(v).padStart(2, '0')}:00`); },
      read(s) { const m = this.mode(s.hour); return m === 'day' ? t('s.ui.dayBreeze') : m === 'night' ? t('s.ui.nightBreeze') : t('s.ui.calm'); },
      tick(s, dt) { s.tt = (s.tt || 0) + dt; return true; },
      tries: [{ hour: 14 }, { hour: 0 }, { hour: 7 }],
    },
    // ---------- space: Moon phases ----------
    moon: {
      init: { a: 90 },
      phaseIdx(a) { return Math.round(((a % 360) + 360) % 360 / 45) % 8; },
      phaseSvg(a, cx, cy, r) { // a: 0 new, 180 full
        const ph = ((a % 360) + 360) % 360, k = Math.cos(ph * Math.PI / 180); // 1 at new, -1 at full
        const lit = '#e9e6dc', dark = '#232838', waxing = ph < 180;
        const rx = Math.abs(k) * r;
        const half = waxing ? `M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r}` : `M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r}`;
        const term = `A${rx} ${r} 0 0 ${waxing ? (k > 0 ? 0 : 1) : (k > 0 ? 1 : 0)} ${cx} ${cy - r}`;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${dark}"/><path d="${half} ${term} Z" fill="${lit}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3a4152"/>`;
      },
      draw(s) {
        const a = s.a * Math.PI / 180, ex = 200, ey = 125, R = 80, mx = ex - Math.cos(a) * R, my = ey - Math.sin(a) * R * .55;
        return svg(600, 250, `<defs><linearGradient id="sunl" x1="1" x2="0"><stop offset="0" stop-color="#ffd66b" stop-opacity=".25"/><stop offset="1" stop-color="#ffd66b" stop-opacity="0"/></linearGradient></defs>
          <rect x="300" y="0" width="300" height="250" fill="url(#sunl)" transform="scale(-1 1) translate(-900 0)"/><text x="20" y="30" fill="#ffd66b" font-family="Lato" font-weight="700" font-size="13">☀ →</text>
          <ellipse cx="${ex}" cy="${ey}" rx="${R}" ry="${R * .55}" fill="none" stroke="#3a4152" stroke-dasharray="4 5"/>
          <circle cx="${ex}" cy="${ey}" r="22" fill="#2f6fb0"/><path d="M${ex} ${ey - 22} A22 22 0 0 0 ${ex} ${ey + 22} Z" fill="#000" opacity=".45" transform="scale(-1 1) translate(${-2 * ex} 0)"/>
          <circle cx="${mx}" cy="${my}" r="12" fill="#e9e6dc"/><path d="M${mx} ${my - 12} A12 12 0 0 1 ${mx} ${my + 12} Z" fill="#000" opacity=".6"/>
          <g>${this.phaseSvg(s.a + 180, 470, 125, 70)}</g><text x="470" y="220" fill="#cfd4de" font-family="Lato" font-weight="700" font-size="13" text-anchor="middle">${t('s.ui.fromEarth')}</text>`, 'moon phases');
      },
      ctrls(s) { return range('a', t('s.ui.orbit'), 0, 359, 1, s.a, v => v + '°'); },
      read(s) { return `${t('s.ui.phase.' + this.phaseIdx(s.a + 180))} · ${t('s.ui.lit2')}`; },
      tries: [{ a: 0 }, { a: 180 }, { a: 270 }],
    },
    // ---------- machines: lever ----------
    lever: {
      init: { f: 0.5 }, // pivot position along the bar, 0 = at the load end
      draw(s) {
        const L = 440, x0 = 80, px = x0 + s.f * L, load = 30, e = this.effort(s), tilt = Math.max(-12, Math.min(12, (e - 15) * -0.6));
        return svg(600, 240, `<polygon points="${px - 26},200 ${px + 26},200 ${px},150" fill="#394054"/><polygon points="${px},150 ${px + 26},200 ${px + 32},200" fill="${shade('#394054', -.3)}"/>
          <g transform="rotate(${tilt} ${px} 146)"><rect x="${x0}" y="140" width="${L}" height="12" rx="3" fill="#c9a36b"/><rect x="${x0}" y="150" width="${L}" height="4" fill="${shade('#c9a36b', -.4)}"/>
          <g transform="translate(${x0 + 10} 92)"><rect width="46" height="48" rx="4" fill="#3b82c4"/><rect width="46" height="8" fill="${shade('#3b82c4', .3)}"/><text x="23" y="32" fill="#fff" font-family="Lato" font-weight="900" font-size="14" text-anchor="middle">${load} kg</text></g>
          <g transform="translate(${x0 + L - 20} 112)"><path d="M0 -40 v34 m-8 -10 l8 10 l8 -10" fill="none" stroke="#f6c56b" stroke-width="3"/><text x="0" y="-48" fill="#f6c56b" font-family="Lato" font-weight="900" font-size="14" text-anchor="middle">${e} kg</text></g></g>
          <rect x="0" y="200" width="600" height="10" fill="#2b3140"/>`, 'a lever');
      },
      effort(s) { const dl = Math.max(0.05, s.f) * 440 - 33, de = (1 - s.f) * 440 - 20; return Math.max(1, Math.round(30 * Math.max(10, dl) / Math.max(10, de))); },
      ctrls(s) { return range('f', t('s.ui.fulcrum'), 0.1, 0.9, 0.01, s.f, v => Math.round(v * 100) + '%'); },
      read(s) { return t('s.ui.effortRead', { l: 30, e: this.effort(s) }) + ' ' + t('s.ui.easier'); },
      tries: [{ f: 0.15 }, { f: 0.5 }, { f: 0.85 }],
    },
    // ---------- living things: what a plant needs ----------
    plant: {
      init: { water: true, light: true, air: true, days: 7 },
      draw(s) {
        const ok = s.water && s.light && s.air, h = ok ? 20 + s.days * 9 : 20 + Math.min(s.days, 3) * 5, droop = ok ? 0 : Math.min(1, s.days / 6);
        const col = ok ? '#3fa66b' : shade('#9b9a4e', -droop * .2), lean = droop * 40;
        const top = [300 + lean, 190 - h + droop * 20];
        const leaves = ok ? Math.min(8, 2 + Math.floor(s.days / 2)) : 2;
        let lv = ''; for (let i = 0; i < leaves; i++) { const y = 190 - (h * (i + 1) / (leaves + 1)), side = i % 2 ? 1 : -1, x = 300 + lean * (i + 1) / (leaves + 1); lv += `<ellipse cx="${x + side * 18}" cy="${y + droop * 14}" rx="18" ry="8" fill="${col}" transform="rotate(${side * (ok ? -25 : 35) } ${x} ${y})"/>`; }
        return svg(600, 250, `${s.light ? '<circle cx="80" cy="50" r="22" fill="#ffd66b"/><circle cx="80" cy="50" r="40" fill="#ffd66b" opacity=".15"/>' : '<rect width="600" height="250" fill="#000" opacity=".35"/>'}
          ${s.water ? '<g fill="#7cc7f0">' + [0, 1, 2].map(i => `<path d="M${440 + i * 24} ${60 + i * 10} q6 10 0 14 q-6 -4 0 -14z"/>`).join('') + '</g>' : ''}
          <path d="M300 190 Q${300 + lean * .3} ${190 - h / 2} ${top[0]} ${top[1]}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>${lv}
          <path d="M230 190 h140 l-14 50 h-112z" fill="#a0583a"/><rect x="226" y="184" width="148" height="10" rx="3" fill="#b8694a"/><ellipse cx="300" cy="190" rx="68" ry="5" fill="#4a3324"/>`, 'a seedling in a pot');
      },
      ctrls(s) { return seg('water', [[true, t('s.ui.water') + ' ✓'], [false, t('s.ui.water') + ' ✕']], s.water) + seg('light', [[true, t('s.ui.light') + ' ✓'], [false, t('s.ui.light') + ' ✕']], s.light) + range('days', t('s.ui.days'), 1, 14, 1, s.days); },
      read(s) { const miss = [!s.water && t('s.ui.water'), !s.light && t('s.ui.light'), !s.air && t('s.ui.air')].filter(Boolean); return miss.length ? t('s.ui.wilts', { m: miss.join(', ') }) : t('s.ui.grows', { h: Math.round(2 + s.days * 0.9), d: s.days }); },
      tries: [{ water: true, light: true, air: true, days: 10 }, { water: false, light: true, air: true, days: 10 }, { water: true, light: false, air: true, days: 10 }],
    },
  };

  function mount(el, key, state) {
    const sim = SIMS[key]; const s = Object.assign({}, sim.init, state || {});
    el.innerHTML = `<div class="demo-board"><div class="board" data-v></div></div><p class="demo-read" aria-live="polite"></p><div class="demo-ctrls"></div>`;
    const v = el.querySelector('[data-v]'), rd = el.querySelector('.demo-read'), c = el.querySelector('.demo-ctrls');
    const draw = () => { v.innerHTML = sim.draw(s); rd.textContent = sim.read(s); };
    const ctrls = () => {
      c.innerHTML = sim.ctrls(s);
      c.querySelectorAll('[data-r]').forEach(inp => inp.oninput = () => { s[inp.dataset.r] = +inp.value; inp.nextElementSibling.textContent = (sim.fmt?.[inp.dataset.r] || (x => x))(inp.value); s.done = false; draw(); ctrls.sync?.(); syncOut(inp); });
      c.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { const raw = b.dataset.v; s[b.dataset.s] = raw === 'true' ? true : raw === 'false' ? false : isNaN(raw) ? raw : +raw; s.done = false; ctrls(); draw(); });
      c.querySelector('[data-act]') && (c.querySelector('[data-act]').onclick = () => { sim.act(s); loop(); });
      const hold = c.querySelector('[data-hold]'); if (hold) bindTone(hold, s);
    };
    const syncOut = inp => { const o = inp.nextElementSibling; const id = inp.dataset.r, val = +inp.value; o.textContent = id === 'angle' ? val + '°' : id === 'f' && key === 'sound' ? val + ' Hz' : id === 'hour' ? String(val).padStart(2, '0') + ':00' : id === 'a' ? val + '°' : (id === 'heat' || id === 'sun' || id === 'amp' || (id === 'f' && key === 'lever')) ? Math.round(val * 100) + '%' : val; };
    let raf = null, last = 0;
    const loop = () => { if (!sim.tick) return; cancelAnimationFrame(raf); last = performance.now();
      const step = now => { if (!document.body.contains(el)) return; const dt = Math.min(64, now - last); last = now; const more = sim.tick(s, matchMedia('(prefers-reduced-motion: reduce)').matches ? dt * 0.4 : dt); draw(); if (more) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step); };
    if (sim.drag) {
      v.addEventListener('pointerdown', e => { const svgEl = v.querySelector('svg'); const move = ev => { const pt = svgEl.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; const p = pt.matrixTransform(svgEl.getScreenCTM().inverse()); s.mx = Math.max(50, Math.min(550, p.x)); s.my = Math.max(20, Math.min(230, p.y)); draw(); }; move(e); v.setPointerCapture(e.pointerId); v.onpointermove = move; v.onpointerup = () => { v.onpointermove = null; }; });
      v.tabIndex = 0; v.setAttribute('aria-label', t('s.ui.magnetRead'));
      v.onkeydown = e => { const d = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[e.key]; if (d) { e.preventDefault(); s.mx = Math.max(50, Math.min(550, s.mx + d[0])); s.my = Math.max(20, Math.min(230, s.my + d[1])); draw(); } };
      v.style.touchAction = 'none';
    }
    ctrls(); draw(); if (key !== 'ramp') loop();
    return { set(st) { Object.assign(s, st); s.done = false; ctrls(); draw(); if (key === 'ramp') { sim.act(s); loop(); } } };
  }
  let ctx = null;
  function bindTone(btn, s) {
    let osc = null, gain = null;
    const on = e => { e.preventDefault(); try { ctx ||= new (window.AudioContext || window.webkitAudioContext)(); osc = ctx.createOscillator(); gain = ctx.createGain(); osc.type = 'triangle'; osc.frequency.value = s.f; gain.gain.value = 0; gain.gain.linearRampToValueAtTime(0.25 * s.amp, ctx.currentTime + 0.05); osc.connect(gain).connect(ctx.destination); osc.start(); btn.classList.add('talking'); } catch {} };
    const off = () => { if (!osc) return; try { gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08); osc.stop(ctx.currentTime + 0.1); } catch {} osc = null; btn.classList.remove('talking'); };
    btn.onpointerdown = on; btn.onpointerup = off; btn.onpointerleave = off; btn.onpointercancel = off;
    btn.onkeydown = e => { if ((e.key === ' ' || e.key === 'Enter') && !osc) on(e); }; btn.onkeyup = off;
  }
  const snap = (key, state) => SIMS[key].draw(Object.assign({}, SIMS[key].init, state, { tt: 900 }));
  window.SIMS = { SIMS, mount, snap };
})();
