// Profile pictures: a photo the grown-up adds (kept in IndexedDB on this device), or the child's initials.
// Photos never leave the device unless "Also back up profile photos" is switched on in the Grown-ups area.
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  I18N.add({ photo: {
    add: ['Add photo', 'படம் சேர்'], change: ['Change photo', 'படத்தை மாற்று'], remove: ['Remove photo', 'படத்தை நீக்கு'], take: ['Take photo', 'படம் எடு'], choose: ['Choose from gallery', 'கேலரியிலிருந்து தேர்ந்தெடு'],
    stays: ['Stays on this device.', 'இந்தச் சாதனத்திலேயே இருக்கும்.'], crop: ['Position the photo', 'படத்தைச் சரிசெய்'], cropHelp: ['Drag to move. Use the slider or + and − to zoom. Arrow keys move it too.', 'நகர்த்த இழு. பெரிதாக்க ஸ்லைடர் அல்லது + − பயன்படுத்து. அம்புக் குறி விசைகளும் நகர்த்தும்.'],
    zoom: ['Zoom', 'பெரிதாக்கு'], save: ['Save photo', 'படத்தைச் சேமி'], alt: ['Photo of {name}', '{name}-இன் படம்'], badFile: ['That file could not be opened as a picture.', 'அந்தக் கோப்பைப் படமாகத் திறக்க முடியவில்லை.'],
    backupPhotos: ['Also back up profile photos', 'சுயவிவரப் படங்களையும் காப்புப் பிரதி எடு'], backupPhotosHelp: ['Off by default. When on, children’s photos are saved to your Google account with their progress.', 'இயல்பாக அணைந்திருக்கும். இயக்கினால், குழந்தைகளின் படங்கள் முன்னேற்றத்துடன் உங்கள் Google கணக்கில் சேமிக்கப்படும்.'],
  } });
  // ---------- storage: IndexedDB, localStorage fallback ----------
  const cache = {}; let dbp = null;
  const idb = () => dbp ||= new Promise((res, rej) => { try { const r = indexedDB.open('kalvi-photos', 1); r.onupgradeneeded = () => r.result.createObjectStore('p'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } });
  async function put(id, data) { cache[id] = data; try { const d = await idb(); await new Promise((r, j) => { const tx = d.transaction('p', 'readwrite'); data ? tx.objectStore('p').put(data, id) : tx.objectStore('p').delete(id); tx.oncomplete = r; tx.onerror = j; }); } catch { try { data ? localStorage.setItem('kalvi.photo.' + id, data) : localStorage.removeItem('kalvi.photo.' + id); } catch {} } }
  async function loadAll() { try { const d = await idb(); await new Promise(r => { const tx = d.transaction('p'), st = tx.objectStore('p'), q = st.openCursor(); q.onsuccess = () => { const c = q.result; if (c) { cache[c.key] = c.value; c.continue(); } else r(); }; q.onerror = r; }); } catch {} try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('kalvi.photo.')) cache[k.slice(12)] ||= localStorage.getItem(k); } } catch {} }
  const ready = loadAll();

  // ---------- initials ----------
  const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter() : null;
  const first = w => seg ? ([...seg.segment(w)][0]?.segment || '') : w[0] || '';
  function initials(name) { const ws = String(name || '?').trim().split(/\s+/).filter(Boolean); const s = ws.slice(0, 2).map(first).join(''); return /[a-z]/i.test(s) ? s.toUpperCase() : s; }
  function html(p, size = 40) {
    if (!p) return '';
    const ph = cache[p.id];
    if (ph) return `<span class="avatar photo" style="--s:${size}px"><img src="${ph}" alt="${esc(t('photo.alt', { name: p.name }))}"></span>`;
    const ini = initials(p.name), ta = /[஀-௿]/.test(ini);
    return `<span class="avatar initials" style="--s:${size}px;--c:${p.color || '#0c7777'};--fs:${Math.round(size * (ini.length > 1 ? .38 : .46))}px" role="img" aria-label="${esc(p.name)}"><span ${ta ? 'lang="ta"' : ''}>${esc(ini)}</span></span>`;
  }

  // ---------- crop ----------
  function crop(file) {
    return new Promise(resolve => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onerror = () => { App.toast(t('photo.badFile')); resolve(null); };
      img.onload = () => {
        const V = 260, base = Math.max(V / img.width, V / img.height); let z = 1, x = 0, y = 0;
        App.dialog(`<h2 class="k-dialog-title">${t('photo.crop')}</h2><div class="crop" tabindex="0" aria-label="${t('photo.cropHelp')}"><img src="${url}" alt="" draggable="false"></div>
          <label class="range"><span>${t('photo.zoom')}</span><input type="range" min="1" max="4" step="0.01" value="1" id="cropZ"><output></output></label><p class="small muted">${t('photo.cropHelp')}</p>
          <div class="k-dialog-actions"><button class="k-btn k-btn-outline" data-close>${t('common.cancel')}</button><button class="k-btn k-btn-primary" id="cropSave">${t('photo.save')}</button></div>`, d => {
          const box = d.querySelector('.crop'), im = box.querySelector('img'), zr = d.querySelector('#cropZ');
          const clamp = () => { const s = base * z, w = img.width * s, h = img.height * s, mx = (w - V) / 2, my = (h - V) / 2; x = Math.max(-mx, Math.min(mx, x)); y = Math.max(-my, Math.min(my, y)); };
          const draw = () => { clamp(); const s = base * z; im.style.width = img.width * s + 'px'; im.style.height = img.height * s + 'px'; im.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`; zr.value = z; };
          let drag = null, pinch = null; const pts = new Map();
          box.onpointerdown = e => { box.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); drag = [e.clientX - x, e.clientY - y]; if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = [Math.hypot(a[0] - b[0], a[1] - b[1]), z]; } };
          box.onpointermove = e => { if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, [e.clientX, e.clientY]); if (pts.size === 2 && pinch) { const [a, b] = [...pts.values()]; z = Math.max(1, Math.min(4, pinch[1] * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch[0])); } else if (drag) { x = e.clientX - drag[0]; y = e.clientY - drag[1]; } draw(); };
          box.onpointerup = box.onpointercancel = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; if (!pts.size) drag = null; };
          box.onkeydown = e => { const m = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[e.key]; if (m) { e.preventDefault(); x += m[0]; y += m[1]; draw(); } if (e.key === '+' || e.key === '=') { z = Math.min(4, z + .1); draw(); } if (e.key === '-') { z = Math.max(1, z - .1); draw(); } };
          zr.oninput = () => { z = +zr.value; draw(); };
          d.querySelector('#cropSave').onclick = () => {
            const c = document.createElement('canvas'), O = 256; c.width = c.height = O; const g = c.getContext('2d'), s = base * z * O / V;
            g.drawImage(img, O / 2 - img.width * s / 2 + x * O / V, O / 2 - img.height * s / 2 + y * O / V, img.width * s, img.height * s);
            let q = 0.82, out = c.toDataURL('image/jpeg', q); while (out.length > 54000 && q > 0.4) { q -= 0.08; out = c.toDataURL('image/jpeg', q); }
            URL.revokeObjectURL(url); App.closeDialog(); resolve(out);
          };
          draw();
        });
      };
      img.src = url;
    });
  }
  // form slot: returns HTML; bind(el, state) wires buttons; state.photo = dataURL | null | undefined (unchanged)
  function slot(p, st) {
    const has = st.photo !== undefined ? !!st.photo : !!cache[p.id];
    return `<div class="photoslot"><div class="photo-prev">${has ? `<span class="avatar photo" style="--s:96px"><img src="${st.photo || cache[p.id]}" alt="${esc(t('photo.alt', { name: st.name || '' }))}"></span>` : html({ ...p, name: st.name || '?', color: st.color, id: '_' }, 96)}</div>
      <div class="photo-actions"><label class="k-btn k-btn-outline pill"><input type="file" accept="image/*" capture="user" hidden data-ph="take">${t('photo.take')}</label><label class="k-btn k-btn-outline pill"><input type="file" accept="image/*" hidden data-ph="pick">${has ? t('photo.change') : t('photo.choose')}</label>${has ? `<button type="button" class="k-btn k-btn-ghost" data-ph="rm">${t('photo.remove')}</button>` : ''}<p class="small muted">${t('photo.stays')}</p></div></div>`;
  }
  function bind(el, st, redraw) {
    el.querySelectorAll('input[data-ph]').forEach(i => i.onchange = async () => { const f = i.files?.[0]; if (!f) return; const out = await crop(f); if (out) { st.photo = out; redraw(); } });
    el.querySelector('[data-ph=rm]') && (el.querySelector('[data-ph=rm]').onclick = () => { st.photo = null; redraw(); });
  }
  const backupPhotos = () => { try { return localStorage.getItem('kalvi.backupPhotos') === '1'; } catch { return false; } };
  window.Photo = { ready, html, initials, slot, bind, put, get: id => cache[id] || null, all: () => ({ ...cache }), backupPhotos, setBackupPhotos: v => { try { v ? localStorage.setItem('kalvi.backupPhotos', '1') : localStorage.removeItem('kalvi.backupPhotos'); } catch {} } };
})();
