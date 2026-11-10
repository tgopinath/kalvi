// Optional "Back up with Google" for the parent area (web only). Uses the shared Firebase project of
// Kolam Auth (gopinath-apps) with pop-up sign-in, but never gates the app: children never see a sign-in wall.
// Data: users/{uid}/apps/kalvi = { data: <JSON of every profile>, updatedAt }. First sign-in merges cloud and device.
import { FIREBASE_CONFIG } from 'https://tgopinath.github.io/kolam-design-system/auth/firebase-config.js';
const SDK = 'https://www.gstatic.com/firebasejs/11.0.2/';
const FLAG = 'kalvi.backup';
let fb = null, auth = null, db = null, user = null, lastSaved = null, timer = null, busy = false, err = '';
const native = () => !!window.Capacitor?.isNativePlatform?.();
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const flag = v => { try { v == null ? localStorage.removeItem(FLAG) : localStorage.setItem(FLAG, v); } catch {} };
const flagged = () => { try { return localStorage.getItem(FLAG) === '1'; } catch { return false; } };

async function load() {
  if (fb) return;
  const [app, a, fs] = await Promise.all(['firebase-app.js', 'firebase-auth.js', 'firebase-firestore.js'].map(f => import(SDK + f)));
  fb = { app, a, fs };
  const inst = app.getApps().find(x => x.name === 'kalvi') || app.initializeApp(FIREBASE_CONFIG, 'kalvi');
  auth = a.getAuth(inst); db = fs.getFirestore(inst);
  a.onAuthStateChanged(auth, async u => { user = u; if (u) { await pullMerge().catch(e => (err = e.message)); } paint(); });
}
const ref = () => fb.fs.doc(db, 'users', user.uid, 'apps', 'kalvi');
async function pullMerge() {
  const snap = await fb.fs.getDoc(ref());
  if (snap.exists() && snap.data().data) {
    const cloud = JSON.parse(snap.data().data); lastSaved = snap.data().updatedAt?.toDate?.() || null;
    if (Store.mergeIn(cloud)) { App.toast(t('parent.merged')); App.applyLang(); App.route(); }
  }
  await push();
}
async function push() {
  if (!user) return;
  await fb.fs.setDoc(ref(), { data: JSON.stringify(Store.exportAll()), updatedAt: fb.fs.serverTimestamp() }, { merge: true });
  lastSaved = new Date(); paint();
}
Store.on(() => { if (!user) return; clearTimeout(timer); timer = setTimeout(() => push().catch(e => { err = e.message; paint(); }), 2500); });
addEventListener('pagehide', () => { if (user && timer) { clearTimeout(timer); push(); } });

async function signIn() {
  busy = true; err = ''; paint();
  try { await load(); const p = new fb.a.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' }); await fb.a.signInWithPopup(auth, p); flag('1'); }
  catch (e) { if (!/popup-closed|cancelled-popup/.test(e.code || '')) err = e.code === 'auth/unauthorized-domain' ? t('parent.domainErr', { host: location.hostname }) : (e.code || e.message); }
  busy = false; paint();
}
async function signOut() { try { await push(); } catch {} await fb.a.signOut(auth); flag(null); user = null; paint(); }   // local data stays

let card = null;
function paint() {
  if (!card || !document.body.contains(card)) return;
  if (native()) { card.innerHTML = `<p class="eyebrow"><svg class="k-icon sm"><use href="#i-cloudup"/></svg>${t('parent.backup')}</p><p class="muted">${t('parent.webOnly')}</p>`; return; }
  const when = lastSaved ? lastSaved.toLocaleString(I18N.lang === 'ta' ? 'ta-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '';
  card.innerHTML = `<p class="eyebrow"><svg class="k-icon sm"><use href="#i-cloudup"/></svg>${t('parent.backup')}</p>` + (user
    ? `<p>${t('parent.signedIn', { who: `<b>${esc(user.email || user.displayName)}</b>` })}</p>${when ? `<p class="small muted">${t('parent.lastSync', { when })}</p>` : ''}<p class="small muted">${t('parent.signOutNote')}</p>
       <div class="row-actions" style="justify-content:flex-start"><button class="k-btn k-btn-outline pill" data-a="sync">${t('parent.syncNow')}</button><button class="k-btn k-btn-ghost" data-a="out">${t('parent.signOut')}</button></div>`
    : `<p class="muted">${t('parent.backupBody')}</p><button class="k-btn k-btn-outline pill" data-a="in" ${busy ? 'disabled' : ''}><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>${t('parent.signIn')}</button>`)
    + (err ? `<p class="k-error" role="alert">${t('parent.backupErr', { e: esc(err) })}</p>` : '');
  card.querySelector('[data-a=in]') && (card.querySelector('[data-a=in]').onclick = signIn);
  card.querySelector('[data-a=out]') && (card.querySelector('[data-a=out]').onclick = signOut);
  card.querySelector('[data-a=sync]') && (card.querySelector('[data-a=sync]').onclick = () => push().catch(e => { err = e.message; paint(); }));
}
window.Backup = { render(el) { card = el; paint(); if (!native() && flagged()) load().catch(() => {}); } };
if (!native() && flagged()) load().catch(() => {});
// the module can load after the Grown-ups page drew its fallback card: take it over
{ const el = document.getElementById('backupCard'); if (el) window.Backup.render(el); }
