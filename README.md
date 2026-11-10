# Kalvi (கல்வி)

Calm daily lessons in **Maths, English and Science** for children aged 4 to 10, with the whole app in **English or Tamil**. Built on the Kolam design system as a static PWA (plain HTML, CSS and JavaScript, no build step).

- **Learning paths:** Maths (counting to fractions, shapes, time and ₹ money), English (letter sounds, blending, sight words, vocabulary with real photos and Tamil meanings, spelling, reading, grammar), Science (11 concept pages, each with a demo, try-this chips, a why chain, a try-at-home experiment and the questions children ask).
- **Practice that teaches:** adaptive levels per skill, a three-step hint ladder, and a lesson card after every answer. Misses go into a Leitner review queue (0, 1, 2, 4, 8, 16 days). A daily warm-up mixes all three subjects.
- **Games:** Maths puzzles (number paths, missing numbers, patterns, balance scales, shape fitting, magic squares, KenKen), Science quiz, Spelling Bee, Memory match, Stories, Music, Word puzzles, Drawing, Science lab, Earth & places.
- **Profiles:** several children per device, each with an age band, a rendered avatar, a language and separate progress. The Grown-ups area (behind a sum) shows progress per child and per subject, trouble items and recent sessions, and offers an optional Google backup on the web.

## Run it
```
python3 tools/serve.py 5330     # no-cache local server → http://localhost:5330
node tools/check-i18n.mjs       # every string has English and Tamil
node tools/shots.mjs verify     # screenshots in .work/shots (needs the server)
```
Module contract for contributors: `docs/MODULES.md`.

## Sources and credits
Vocabulary photos: Wikipedia and Wikimedia Commons (credited per picture in the app). Body pictures: CC-licensed Sketchfab models via Udambu. Weather: Open-Meteo. Fonts: Lato and Noto Sans Tamil (SIL OFL), bundled.
