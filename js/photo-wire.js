// Adds real-object and instrument photos to lesson cards of skills that are built from SVG visuals,
// without changing their generators: the SVG still shows the working, the photo shows the thing in the world.
(function () {
  const ph = k => { const q = window.PHOTOS?.[k] || window.PICS?.[k]; return q ? { src: q.src, credit: q.credit, href: q.page, alt: k } : null; };
  const SOLID = { cube: 'dice', cuboid: 'brick', sphere: 'ball', cylinder: 'tincan', cone: 'icecream', pyramid: 'pyramid', prism: 'tent' };
  const COIN = { 1: 'coin1', 2: 'coin2', 5: 'coin5b', 10: 'coin10', 20: 'coin20' };
  const RULES = {
    'm.solids': q => ph(SOLID[q.answer] || SOLID[Object.keys(SOLID).find(k => String(q.prompt).includes(t('m.shape.' + k)))]),
    'm.clock': () => ph('wallclock'), 'mq.clock': () => ph('wallclock'),
    'm.money': q => ph(COIN[[20, 10, 5, 2, 1].find(v => String(q.visual).includes('₹' + v + '<'))] || 'coin10'), 'mq.money': () => ph('coin10'),
    'm.sides': () => ph('wheel'), 'mq.shape': () => ph('dice'),
    'mu.string': () => ph('veena'), 'mu.tala': () => ph('mridangam'), 'mu.count': () => ph('mridangam'), 'mu.tap': () => ph('tabla'), 'mu.listen': () => ph('flute'), 'mu.glass': () => ph('nadaswaram') && null,
    'm.fracname': () => ph('roti'), 'm.fracset': () => ph('laddu'),
  };
  for (const [id, f] of Object.entries(RULES)) { const sk = Engine.SK[id]; if (!sk || sk._wired) continue; const g = sk.gen; sk._wired = true;
    sk.gen = function (...a) { const q = g.apply(this, a); try { if (q.why && !q.why.photo) { const p = f(q); if (p) q.why.photo = p; } } catch {} return q; }; }
})();
