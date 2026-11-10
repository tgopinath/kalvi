// Device-only storage: child profiles, per-subject progress, Leitner review queue, sessions.
// Everything lives under one localStorage key so the optional Google backup can sync it whole.
(function () {
  const KEY = 'kalvi.v1';
  const BOX_DAYS = [0, 1, 2, 4, 8, 16];      // Leitner boxes; a miss goes back to box 0
  const SUBJECTS = ['maths', 'english', 'science', 'world'];
  const today = (d = new Date()) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };
  const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return today(d); };
  const AV_COLORS = ['#0c7777', '#a15c00', '#4338ca', '#b8236f', '#2f6f4f', '#3a4152'];   // AA with white initials
  const blank = () => ({ profiles: [], current: null, updated: Date.now() });
  let db;
  try { db = JSON.parse(localStorage.getItem(KEY)) || blank(); } catch { db = blank(); }
  // age drives the band: 3–6 → young, 7+ → older. Profiles from before ages get 5 (young) or 8 (older).
  function normAge(p) { if (!(p.age >= 3)) p.age = p.band === 'older' ? 8 : 5; p.age = Math.max(3, Math.min(12, Math.round(p.age))); p.band = p.age >= 7 ? 'older' : 'young'; return p; }
  // migrate: every profile has every subject
  (db.profiles || []).forEach(p => { p.subjects = p.subjects || {}; SUBJECTS.forEach(s => { p.subjects[s] ??= { skills: {}, review: {}, lessons: {} }; }); p.days ??= {}; p.sessions ??= []; p.settings ??= { rate: 0.9 }; normAge(p); delete p.lang; delete p.avatar; if (!AV_COLORS.includes(p.color)) p.color = AV_COLORS[Math.abs([...p.id].reduce((a, c) => a + c.charCodeAt(0), 0)) % AV_COLORS.length]; });
  const listeners = new Set();
  function save() { db.updated = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} listeners.forEach(f => f()); }

  const AVATARS = ['cube', 'sphere', 'cone', 'cylinder', 'pyramid', 'prism', 'ring', 'star'];
  function newProfile({ name, age = 5, color = AV_COLORS[0] }) {
    const p = { id: 'c' + Math.random().toString(36).slice(2, 9), name: name.trim(), age, band: age >= 7 ? 'older' : 'young', color, created: Date.now(), updated: Date.now(),
      subjects: Object.fromEntries(SUBJECTS.map(s => [s, { skills: {}, review: {}, lessons: {} }])), days: {}, sessions: [], warmup: null, settings: { rate: 0.9 } };
    normAge(p); db.profiles.push(p); db.current = p.id; save(); return p;
  }
  const current = () => db.profiles.find(p => p.id === db.current) || null;
  function select(id) { db.current = id; save(); }
  function update(id, patch) { const p = db.profiles.find(x => x.id === id); if (p) { Object.assign(p, patch); if ('age' in patch) { p.band = null; } normAge(p); p.updated = Date.now(); save(); } return p; }
  function remove(id) { db.profiles = db.profiles.filter(p => p.id !== id); if (db.current === id) db.current = db.profiles[0]?.id ?? null; save(); }

  // ----- skills: level (adaptive) + mastery (exponentially weighted accuracy) -----
  function skill(p, subject, id) {
    const s = p.subjects[subject].skills;
    return s[id] ??= { lvl: null, m: 0, n: 0, ok: 0, run: 0, miss: 0, last: null };
  }
  // exact age fine-tunes the start inside the band: 9+ starts one level up where the band allows
  function startLvl(p, sk) { const b = p.band, lo = sk.start(b), hi = sk.max(b); return p.age >= 9 ? Math.min(hi, lo + 1) : lo; }
  function record(p, subject, sk, item, correct, meta = {}) {
    const st = skill(p, subject, sk.id);
    if (st.lvl == null) st.lvl = startLvl(p, sk);
    st.n++; if (correct) st.ok++;
    const w = 0.25 + 0.1 * (st.lvl - 1);           // harder levels move mastery further
    st.m = Math.min(1, Math.max(0, st.m + w * ((correct ? 1 : 0) - st.m)));
    if (correct) { st.run++; st.miss = 0; if (st.run >= 3 && st.lvl < sk.max(p.band)) { st.lvl++; st.run = 0; } }
    else { st.miss++; st.run = 0; if (st.miss >= 2 && st.lvl > sk.min(p.band)) { st.lvl--; st.miss = 0; } }
    st.last = today();
    // Leitner
    const rq = p.subjects[subject].review, k = item.key;
    const r = rq[k] ?? (correct ? null : { box: 0, due: today(), skill: sk.id, lvl: item.lvl, seed: item.seed, miss: 0 });
    if (r) {
      if (correct) { r.box = Math.min(BOX_DAYS.length - 1, r.box + 1); r.due = addDays(today(), BOX_DAYS[r.box]); }
      else { r.box = 0; r.due = today(); r.miss = (r.miss || 0) + 1; }
      if (correct && r.box >= BOX_DAYS.length - 1) delete rq[k]; else rq[k] = r;
    }
    p.days[today()] = (p.days[today()] || 0) + 1;
    p.updated = Date.now(); save();
    return st;
  }
  function flagReview(p, subject, item) { // "not clear yet" on a correct answer
    const rq = p.subjects[subject].review;
    rq[item.key] = { box: 0, due: today(), skill: item.skill, lvl: item.lvl, seed: item.seed, miss: (rq[item.key]?.miss || 0) };
    save();
  }
  function due(p, subject) {
    const t = today();
    return Object.entries(p.subjects[subject].review).filter(([, r]) => r.due <= t).map(([key, r]) => ({ key, ...r }));
  }
  function trouble(p, subject) { return Object.entries(p.subjects[subject].review).map(([key, r]) => ({ key, ...r })).sort((a, b) => (b.miss || 0) - (a.miss || 0)); }
  function lessonDone(p, subject, topic) { p.subjects[subject].lessons[topic] = today(); save(); }
  function logSession(p, s) { p.sessions.unshift({ ...s, date: today(), at: Date.now() }); p.sessions = p.sessions.slice(0, 60); save(); }
  function streak(p) {
    let n = 0, d = today();
    if (!p.days[d]) d = addDays(d, -1);   // today not done yet still keeps yesterday's run
    while (p.days[d]) { n++; d = addDays(d, -1); }
    return n;
  }
  const status = st => !st || !st.n ? 'new' : st.m >= 0.85 && st.n >= 8 ? 'mastered' : st.m >= 0.55 ? 'practising' : 'learning';

  function exportAll() { return JSON.parse(JSON.stringify(db)); }
  // merge another copy (from the cloud): profiles are matched by id and the newer one wins
  function mergeIn(other) {
    if (!other?.profiles) return false;
    let changed = false;
    for (const op of other.profiles) {
      const i = db.profiles.findIndex(p => p.id === op.id);
      if (i < 0) { db.profiles.push(op); changed = true; }
      else if ((op.updated || 0) > (db.profiles[i].updated || 0)) { db.profiles[i] = op; changed = true; }
    }
    db.profiles.forEach(p => { SUBJECTS.forEach(s => { p.subjects ??= {}; p.subjects[s] ??= { skills: {}, review: {}, lessons: {} }; }); normAge(p); });
    if (!db.current && db.profiles.length) db.current = db.profiles[0].id;
    if (changed) save();
    return changed;
  }

  window.Store = { KEY, BOX_DAYS, SUBJECTS, AVATARS, AV_COLORS, today, addDays, get db() { return db; }, newProfile, current, select, update, remove, skill, record, flagReview, due, trouble, lessonDone, logSession, streak, status, exportAll, mergeIn, save, startLvl, normAge, on: f => listeners.add(f) };
})();
