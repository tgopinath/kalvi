# Kalvi (கல்வி) — brief

**Problem.** Parents of 4–10-year-olds in Tamil Nadu juggle separate apps for maths drills, phonics and science videos. Most are loud, ad-driven or cartoonish, mark answers right or wrong without saying why, and are English only, so a parent who reads Tamil more easily can't follow along.

**User.** A child aged 4–10 (two age bands: 4–6 and 7–10) using a shared family phone or a browser, with a parent who sets it up, checks progress and prefers Tamil or English.

**Jobs to be done.**
- Child: learn one idea at a time with something to touch and move, then practise it, and understand every mistake.
- Parent: see what each child is good at and stuck on, in their own language, without accounts or ads.

**v1 screens.** Profile setup and switcher · Today (daily warm-up mixing all three subjects, review queue, up next per subject, games) · Subject learning path (Maths 9 topics, English 7, Science 11) · Topic lesson (Steps pattern with interactive 3D-rendered manipulatives or a science demo on a dark art board) · Practice round (hint ladder, a lesson card after every answer) · Games (Maths puzzles, Science quiz, Spelling Bee, Memory, Stories, Music, Word puzzles, Drawing, Lab, Earth & places) · Progress · Grown-ups area behind a sum (per-child, per-subject mastery, accuracy, minutes, trouble items, sessions; add/edit/delete children; optional Google backup on the web).

**Data.** No account needed; everything on the device (localStorage). Vocabulary photos: Wikipedia lead images and hand-picked Wikimedia Commons photos, vetted on contact sheets, loaded from upload.wikimedia.org with credits. Body pictures: CC-licensed Sketchfab model renders from Udambu, credited. Live Chennai weather: Open-Meteo (no key). Map data: see the Earth & places module.

**Success criteria.** A 5-year-old can finish a lesson and a practice round without reading (Listen on every line, pictures first, 48px targets). Every answer, right or wrong, shows why. The whole UI, every lesson and every lesson card switches between English and Tamil. Works offline after the first visit, at 375px and on desktop, keyboard and screen-reader accessible, WCAG AA.

**Out of scope for v1.** Recorded human voice clips (device speech for now), teacher/classroom accounts, native sign-in inside the Android APK (backup is web only), payments, chat or AI tutoring.
