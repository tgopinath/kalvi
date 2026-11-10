// Listen: device speech, per language. A line can mix languages: [{text, lang}] segments are read in order.
// In Tamil mode a ta-IN voice is used when the device has one; otherwise the Tamil line is skipped with a
// quiet notice and any English segments are still read.
(function () {
  let busy = null, queue = [], voices = [], audio = null;
  // recorded clips (tools/voice.mjs): web fetches each on demand (the service worker caches it); the APK bundles the
  // most-used set and streams the rest from the live site when online; anything else uses device speech.
  const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); };
  const clean = s => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const CLIPS = new Set(window.VOICE_CLIPS || []), CORE = new Set(window.VOICE_CORE || []);
  const native = () => !!window.Capacitor?.isNativePlatform?.();
  function clipUrl(seg) { const id = `${seg.lang === 'ta' ? 'ta' : 'en'}-${hash((seg.lang === 'ta' ? 'ta' : 'en') + '|' + clean(seg.text))}`; if (!CLIPS.has(id)) return null; if (native() && !CORE.has(id)) return navigator.onLine ? `https://kalvi-learn.vercel.app/audio/${id}.m4a` : null; return `audio/${id}.m4a`; }
  const load = () => { try { voices = speechSynthesis.getVoices(); } catch {} };
  load(); try { speechSynthesis.onvoiceschanged = load; } catch {}
  const pick = lang => lang === 'ta'
    ? voices.find(v => /^ta[-_]/i.test(v.lang)) || null
    : voices.find(v => /en[-_]IN/i.test(v.lang)) || voices.find(v => /en[-_](GB|US)/i.test(v.lang)) || null;
  const hasTamil = () => { load(); return !!pick('ta'); };
  const mark = (btn, on) => { busy?.classList.remove('talking'); busy?.setAttribute('aria-pressed', 'false'); busy = on ? btn : null; if (btn && on) { btn.classList.add('talking'); btn.setAttribute('aria-pressed', 'true'); } };
  function stop() { queue = []; try { audio?.pause(); } catch {} audio = null; try { speechSynthesis.cancel(); } catch {} mark(null, false); }
  function play(segs, btn, opt = {}) {
    const same = busy && busy === btn; stop(); if (same) return;
    load();
    segs = (Array.isArray(segs) ? segs : [{ text: segs, lang: opt.lang || 'en' }]).filter(s => s && s.text);
    const usable = segs.filter(s => clipUrl(s) || ('speechSynthesis' in window && (s.lang !== 'ta' || hasTamil())));
    if (usable.length < segs.length) opt.onMissing?.('ta');
    if (!usable.length) return;
    queue = usable; mark(btn, true);
    const next = () => {
      const s = queue.shift(); if (!s) { mark(btn, false); return; }
      let url = clipUrl(s);
      if (!url && /[.?!]\s/.test(s.text)) { const parts = clean(s.text).split(/(?<=[.?!])\s+/).map(x => ({ ...s, text: x })); if (parts.length > 1 && parts.some(clipUrl)) { queue.unshift(...parts); return next(); } }
      if (url) { audio = new Audio(url); audio.playbackRate = Math.max(.7, (opt.rate ?? .9) / .9); audio.onended = next; audio.onerror = () => { audio = null; speak(s); }; audio.play().catch(() => speak(s)); return; }
      speak(s);
    };
    const speak = s => { if (!('speechSynthesis' in window) || (s.lang === 'ta' && !hasTamil())) return next();
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
