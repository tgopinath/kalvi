// Listen: device speech, per language. A line can mix languages: [{text, lang}] segments are read in order.
// In Tamil mode a ta-IN voice is used when the device has one; otherwise the Tamil line is skipped with a
// quiet notice and any English segments are still read.
(function () {
  let busy = null, queue = [], voices = [];
  const load = () => { try { voices = speechSynthesis.getVoices(); } catch {} };
  load(); try { speechSynthesis.onvoiceschanged = load; } catch {}
  const pick = lang => lang === 'ta'
    ? voices.find(v => /^ta[-_]/i.test(v.lang)) || null
    : voices.find(v => /en[-_]IN/i.test(v.lang)) || voices.find(v => /en[-_](GB|US)/i.test(v.lang)) || null;
  const hasTamil = () => { load(); return !!pick('ta'); };
  const mark = (btn, on) => { busy?.classList.remove('talking'); busy?.setAttribute('aria-pressed', 'false'); busy = on ? btn : null; if (btn && on) { btn.classList.add('talking'); btn.setAttribute('aria-pressed', 'true'); } };
  function stop() { queue = []; try { speechSynthesis.cancel(); } catch {} mark(null, false); }
  function play(segs, btn, opt = {}) {
    const same = busy && busy === btn; stop(); if (same) return;
    if (!('speechSynthesis' in window)) { opt.onMissing?.('none'); return; }
    load();
    segs = (Array.isArray(segs) ? segs : [{ text: segs, lang: opt.lang || 'en' }]).filter(s => s && s.text);
    const usable = segs.filter(s => s.lang !== 'ta' || hasTamil());
    if (usable.length < segs.length) opt.onMissing?.('ta');
    if (!usable.length) return;
    queue = usable; mark(btn, true);
    const next = () => {
      const s = queue.shift(); if (!s) { mark(btn, false); return; }
      const u = new SpeechSynthesisUtterance(s.text.replace(/<[^>]+>/g, '').replace(/×/g, s.lang === 'ta' ? ' பெருக்கல் ' : ' times ').replace(/÷/g, s.lang === 'ta' ? ' வகுத்தல் ' : ' divided by ').replace(/−/g, s.lang === 'ta' ? ' கழித்தல் ' : ' minus '));
      u.lang = s.lang === 'ta' ? 'ta-IN' : 'en-IN'; const v = pick(s.lang); if (v) u.voice = v;
      u.rate = (opt.rate ?? 0.9) * (s.slow ? 0.75 : 1); u.pitch = 1.05;
      u.onend = next; u.onerror = () => mark(btn, false);
      speechSynthesis.speak(u);
    };
    next();
  }
  window.Voice = { play, stop, hasTamil };
})();
