// Touch typing: a stepped path from posture and the home row to sentences, with an on-screen QWERTY board
// that lights the next key and a shaded two-hand diagram in matching finger colours. Older children can
// switch to Tamil99 (Tamil Nadu government standard) and play a calm "word rain".
// Missed keys go to review: skill 'ty.key' rebuilds "which finger presses key X?" from the seed (= key char code).
(function () {
  const esc = Engine.esc;
  I18N.add({ typing: {
    title: ['Touch typing', 'தட்டச்சுப் பயிற்சி'],
    blurb: ['Learn where every key lives and which finger presses it, from the home row to full sentences.', 'ஒவ்வொரு விசையும் எங்கே இருக்கிறது, அதை எந்த விரல் அழுத்த வேண்டும் என்று கற்றுக்கொள். முகப்பு வரிசையிலிருந்து முழு வாக்கியங்கள் வரை.'],
    skill: ['Which finger for each key', 'எந்த விசைக்கு எந்த விரல்'],
    lessons: ['Lessons', 'பாடங்கள்'], layout: ['Keyboard', 'விசைப்பலகை'], en: ['English keys', 'ஆங்கில விசைகள்'], ta: ['Tamil99 keys', 'தமிழ்99 விசைகள்'],
    taNote: ['These keys follow Tamil99, the Tamil Nadu government standard. No Tamil keyboard is needed: each letter comes from the position of the key.', 'இந்த விசைகள் தமிழ்நாடு அரசின் தரநிலையான தமிழ்99 அமைப்பைப் பின்பற்றுகின்றன. தமிழ் விசைப்பலகை தேவையில்லை: விசையின் இடத்தைக் கொண்டே எழுத்து வரும்.'],
    touch: ['Typing works best with a real keyboard. You can also tap the keys on the board below.', 'உண்மையான விசைப்பலகையுடன் தட்டச்சு சிறப்பாக இருக்கும். கீழே உள்ள பலகையில் விசைகளைத் தட்டியும் பழகலாம்.'],
    capture: ['Type here', 'இங்கே தட்டச்சு செய்'], start: ['Start', 'தொடங்கு'], back: ['All lessons', 'எல்லாப் பாடங்களும்'],
    pressGlow: ['Press the glowing key', 'ஒளிரும் விசையை அழுத்து'], typeLine: ['Type the line. Keep your eyes on the screen.', 'இந்த வரியைத் தட்டச்சு செய். கண்களைத் திரையிலேயே வை.'],
    next: ['Next key: {k}, {f}.', 'அடுத்த விசை: {k}, {f}.'], withShift: ['{k} with Shift. Hold Shift with your {s}.', 'Shift உடன் {k}. Shift-ஐ உன் {s} கொண்டு பிடி.'],
    wrong: ['That was {g}. Find {k}.', 'அது {g}. {k}-ஐத் தேடு.'], space: ['space', 'இடைவெளி (space)'], key: ['key {k}', '{k} விசை'],
    hands: ['Your two hands on the home row, with the finger for the next key lit', 'முகப்பு வரிசையில் உன் இரண்டு கைகள்; அடுத்த விசைக்கான விரல் ஒளிர்கிறது'],
    leftHand: ['Left hand', 'இடக்கை'], rightHand: ['Right hand', 'வலக்கை'], board: ['Keyboard', 'விசைப்பலகை'],
    f: { lp: ['left little finger', 'இடக்கைச் சுண்டுவிரல்'], lr: ['left ring finger', 'இடக்கை மோதிரவிரல்'], lm: ['left middle finger', 'இடக்கை நடுவிரல்'], li: ['left index finger', 'இடக்கை ஆள்காட்டிவிரல்'],
      th: ['thumb', 'கட்டைவிரல்'], ri: ['right index finger', 'வலக்கை ஆள்காட்டிவிரல்'], rm: ['right middle finger', 'வலக்கை நடுவிரல்'], rr: ['right ring finger', 'வலக்கை மோதிரவிரல்'], rp: ['right little finger', 'வலக்கைச் சுண்டுவிரல்'] },
    l: { en1: ['Sitting and hands', 'அமரும் முறையும் கைகளும்'], en2: ['Home row', 'முகப்பு வரிசை (home row)'], en3: ['Top row', 'மேல் வரிசை'], en4: ['Bottom row', 'கீழ் வரிசை'], en5: ['Capitals with Shift', 'Shift கொண்டு பெரிய எழுத்துகள்'],
      en6: ['Numbers', 'எண்கள்'], en7: ['Full stop, comma, question and exclamation marks', 'முற்றுப்புள்ளி, காற்புள்ளி, வினாக்குறி, வியப்புக்குறி'], en8: ['Short words', 'சிறு சொற்கள்'], en9: ['Sentences', 'வாக்கியங்கள்'],
      ta1: ['Vowels on the home row', 'முகப்பு வரிசையில் உயிரெழுத்துகள்'], ta2: ['Consonants on the home row', 'முகப்பு வரிசையில் மெய்யெழுத்துகள்'], ta3: ['Consonant and vowel together', 'உயிர்மெய் எழுத்துகள்'], ta4: ['Pulli and double letters', 'புள்ளியும் இரட்டை எழுத்துகளும்'], ta5: ['Top row letters', 'மேல் வரிசை எழுத்துகள்'], ta6: ['Bottom row and ஃ', 'கீழ் வரிசையும் ஃ-உம்'] },
    tip: { en1: ['Find F and J with your index fingers, then tap the space bar with a thumb.', 'ஆள்காட்டி விரல்களால் F, J-ஐக் கண்டுபிடி; பிறகு கட்டைவிரலால் இடைவெளிப் பட்டையைத் தட்டு.'],
      en2: ['Each finger has one home key. Press, then come straight back.', 'ஒவ்வொரு விரலுக்கும் ஒரு முகப்பு விசை உண்டு. அழுத்திவிட்டு உடனே திரும்பு.'],
      en3: ['Reach up from the home row with the same finger, then come back down.', 'அதே விரலால் முகப்பு வரிசையிலிருந்து மேலே நீட்டி, பிறகு கீழே திரும்பு.'],
      en4: ['Curl the finger down to the bottom row. Keep your wrist still.', 'விரலைக் கீழ் வரிசைக்கு மடக்கு. மணிக்கட்டை அசைக்காதே.'],
      en5: ['Hold Shift with the little finger of the other hand, then press the letter.', 'மற்றொரு கையின் சுண்டுவிரலால் Shift-ஐப் பிடித்துக்கொண்டு எழுத்தை அழுத்து.'],
      en6: ['Numbers sit above the top row. Each one belongs to the finger below it.', 'எண்கள் மேல் வரிசைக்கும் மேலே உள்ளன. ஒவ்வொன்றும் அதன் கீழே உள்ள விரலுக்குரியது.'],
      en7: ['The full stop and comma use your right ring and middle fingers. ? and ! need Shift.', 'முற்றுப்புள்ளிக்கு வலக்கை மோதிரவிரல், காற்புள்ளிக்கு நடுவிரல். ? மற்றும் ! க்கு Shift தேவை.'],
      en8: ['Say the word in your head, then let your fingers spell it.', 'சொல்லை மனதில் சொல்லிக்கொண்டு, விரல்களால் எழுத்துக்கூட்டு.'],
      en9: ['A capital at the start, a space between words, a mark at the end.', 'தொடக்கத்தில் பெரிய எழுத்து, சொற்களுக்கு இடையில் இடைவெளி, முடிவில் ஒரு குறி.'],
      ta1: ['In Tamil99 most vowels (uyir) are on the left and most consonants (mei) are on the right.', 'தமிழ்99-இல் பெரும்பாலான உயிரெழுத்துகள் இடப்பக்கமும், மெய்யெழுத்துகள் வலப்பக்கமும் உள்ளன.'],
      ta2: ['A consonant key gives the letter with its a sound: the H key gives க.', 'மெய் விசை அகரம் சேர்ந்த எழுத்தைத் தரும்: H விசை க-வைத் தரும்.'],
      ta3: ['Press a consonant, then a vowel: க then ஆ makes கா.', 'முதலில் மெய், பிறகு உயிர்: க பிறகு ஆ அழுத்தினால் கா.'],
      ta4: ['F adds the pulli: க then F makes க். Type the same consonant twice and the pulli comes by itself, so க க makes க்க. It also comes by itself in ங்க, ஞ்ச, ண்ட, ந்த, ம்ப and ன்ற.', 'F புள்ளி சேர்க்கும்: க பிறகு F அழுத்தினால் க். ஒரே மெய்யை இரண்டு முறை அழுத்தினால் புள்ளி தானாக வரும்: க க என்றால் க்க. ங்க, ஞ்ச, ண்ட, ந்த, ம்ப, ன்ற ஆகியவற்றிலும் புள்ளி தானாக வரும்.'],
      ta5: ['The long vowels ஆ ஈ ஊ ஐ ஏ are on the left of the top row; ள ற ன ட ண ச ஞ are on the right.', 'நெடில் உயிர்கள் ஆ ஈ ஊ ஐ ஏ மேல் வரிசையின் இடப்பக்கம்; ள ற ன ட ண ச ஞ வலப்பக்கம்.'],
      ta6: ['ஔ ஓ ஒ வ ங are on the left of the bottom row and ல ர ழ on the right. Shift with F makes ஃ (aaytham).', 'ஔ ஓ ஒ வ ங கீழ் வரிசையின் இடப்பக்கம்; ல ர ழ வலப்பக்கம். Shift-உடன் F அழுத்தினால் ஃ (ஆய்தம்) வரும்.'] },
    sit: { head: ['Before you start', 'தொடங்கும் முன்'], s1: ['Sit tall with your back against the chair and both feet flat on the floor.', 'நாற்காலியில் முதுகைச் சாய்த்து நிமிர்ந்து உட்கார். இரண்டு பாதங்களையும் தரையில் வை.'],
      s2: ['Keep the screen about an arm’s length away, with its top at eye level.', 'திரையைச் சுமார் ஒரு கை நீளத் தொலைவில் வை; அதன் மேல்பகுதி கண் மட்டத்தில் இருக்கட்டும்.'],
      s3: ['Let your wrists float just above the desk and curve your fingers softly.', 'மணிக்கட்டுகள் மேசைக்குச் சற்று மேலே இருக்கட்டும்; விரல்களை மெதுவாக வளைத்து வை.'],
      s4: ['Rest your left fingers on A S D F and your right fingers on J K L ;. This is the home row.', 'இடக்கை விரல்களை A S D F மீதும், வலக்கை விரல்களை J K L ; மீதும் வை. இதுவே முகப்பு வரிசை (home row).'],
      s5: ['Feel the small bumps on F and J. Your index fingers find them without looking.', 'F, J விசைகளில் உள்ள சிறு மேடுகளைத் தொட்டுப் பார். பார்க்காமலேயே ஆள்காட்டி விரல்கள் அவற்றைக் கண்டுபிடிக்கும்.'],
      s6: ['Rest your thumbs on the space bar. After every key, go back home.', 'கட்டைவிரல்களை இடைவெளிப் பட்டையின் (space bar) மீது வை. ஒவ்வொரு விசைக்குப் பிறகும் முகப்புக்குத் திரும்பு.'] },
    accuracy: ['Accuracy', 'துல்லியம்'], wpm: ['Words a minute', 'நிமிடத்திற்குச் சொற்கள்'], best: ['Personal best', 'உன் சிறந்தது'], newBest: ['A new personal best.', 'புதிய சிறந்த மதிப்பெண்.'],
    done: ['Drill complete', 'பயிற்சி முடிந்தது'], summary: ['{r} of {n} keys right the first time.', '{n} விசைகளில் {r} முதல் முறையிலேயே சரி.'],
    missedHead: ['Keys to practise', 'பயிற்சி தேவைப்படும் விசைகள்'], missedLine: ['{k}: use your {f}. Its home key is {h}.', '{k}: உன் {f} கொண்டு அழுத்து. அதன் முகப்பு விசை {h}.'], missedThumb: ['{k}: use your thumb.', '{k}: கட்டைவிரலால் அழுத்து.'],
    missedN: ['missed {n} times', '{n} முறை தவறியது'], missed1: ['missed once', 'ஒரு முறை தவறியது'],
    clean: ['No missed keys. Keep your eyes on the screen and let your fingers find the keys.', 'தவறிய விசைகள் இல்லை. கண்களைத் திரையில் வைத்து, விரல்களே விசைகளைக் கண்டுபிடிக்கட்டும்.'],
    review: ['Missed keys come back in review.', 'தவறிய விசைகள் மீள்பார்வையில் மீண்டும் வரும்.'],
    again: ['Do it again', 'மீண்டும் செய்'], nextLesson: ['Next lesson', 'அடுத்த பாடம்'], doneAt: ['Done · {a}%', 'முடிந்தது · {a}%'],
    rain: ['Word rain', 'சொல் மழை'], rainBlurb: ['Words drift down slowly. Type each one. A mistake pauses the rain until you find the key.', 'சொற்கள் மெதுவாகக் கீழே இறங்கும். ஒவ்வொன்றையும் தட்டச்சு செய். தவறு செய்தால், சரியான விசையைக் கண்டுபிடிக்கும் வரை மழை நின்று காத்திருக்கும்.'],
    rainLeft: ['{n} words to go', 'இன்னும் {n} சொற்கள்'], rainType: ['Type “{w}”.', '“{w}” என்று தட்டச்சு செய்.'], paused: ['Paused. Find {k}.', 'நின்றுள்ளது. {k}-ஐத் தேடு.'], rainDone: ['{n} words typed.', '{n} சொற்கள் தட்டச்சு செய்தாய்.'],
    keyQ: ['Which finger presses {k}?', '{k} விசையை எந்த விரல் அழுத்தும்?'], keyWhy: ['{k} is pressed by the {f}.', '{k} விசையை {f} அழுத்தும்.'],
    keyHome: ['That finger rests on {h} and comes back to it after each press.', 'அந்த விரல் {h} மீது இருக்கும்; ஒவ்வொரு அழுத்தத்திற்குப் பிறகும் அங்கே திரும்பும்.'], keyShift: ['For a capital or a top symbol, hold Shift with the other hand.', 'பெரிய எழுத்துக்கோ மேல் குறிக்கோ, மற்றொரு கையால் Shift-ஐப் பிடி.'],
    keyRule: ['Every finger has its own keys. Go back to the home row after each one.', 'ஒவ்வொரு விரலுக்கும் தனி விசைகள் உண்டு. ஒவ்வொன்றுக்குப் பிறகும் முகப்பு வரிசைக்குத் திரும்பு.'],
  } });

  // ---------- keys, fingers, layouts ----------
  const ROWS = [
    ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'],
    ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
    ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
    ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
    ['Space']];
  const EN = { Digit1: ['1', '!'], Digit2: ['2', '@'], Digit3: ['3', '#'], Digit4: ['4', '$'], Digit5: ['5', '%'], Digit6: ['6', '^'], Digit7: ['7', '&'], Digit8: ['8', '*'], Digit9: ['9', '('], Digit0: ['0', ')'],
    BracketLeft: ['[', '{'], BracketRight: [']', '}'], Semicolon: [';', ':'], Quote: ["'", '"'], Comma: [',', '<'], Period: ['.', '>'], Slash: ['/', '?'], Space: [' ', ' '] };
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => EN['Key' + c.toUpperCase()] = [c, c.toUpperCase()]);
  const CH = {}; for (const [code, [a, b]] of Object.entries(EN)) { CH[a] ??= { code, shift: false }; CH[b] ??= { code, shift: true }; }
  const FINGER = {}; const F_KEYS = { lp: 'Digit1 KeyQ KeyA KeyZ ShiftLeft', lr: 'Digit2 KeyW KeyS KeyX', lm: 'Digit3 KeyE KeyD KeyC', li: 'Digit4 Digit5 KeyR KeyT KeyF KeyG KeyV KeyB',
    ri: 'Digit6 Digit7 KeyY KeyU KeyH KeyJ KeyN KeyM', rm: 'Digit8 KeyI KeyK Comma', rr: 'Digit9 KeyO KeyL Period', rp: 'Digit0 KeyP BracketLeft BracketRight Semicolon Quote Slash ShiftRight', th: 'Space' };
  for (const [f, ks] of Object.entries(F_KEYS)) ks.split(' ').forEach(k => FINGER[k] = f);
  const HOME = { lp: 'KeyA', lr: 'KeyS', lm: 'KeyD', li: 'KeyF', ri: 'KeyJ', rm: 'KeyK', rr: 'KeyL', rp: 'Semicolon', th: 'Space' };
  const FINGERS = ['lp', 'lr', 'lm', 'li', 'ri', 'rm', 'rr', 'rp'];
  const shiftFor = code => FINGER[code]?.[0] === 'l' ? 'ShiftRight' : 'ShiftLeft';   // the other hand holds Shift

  // Tamil99 (Tamil Nadu government standard). Physical positions; the app does the composing itself.
  const TA = { KeyQ: 'ஆ', KeyW: 'ஈ', KeyE: 'ஊ', KeyR: 'ஐ', KeyT: 'ஏ', KeyY: 'ள', KeyU: 'ற', KeyI: 'ன', KeyO: 'ட', KeyP: 'ண', BracketLeft: 'ச', BracketRight: 'ஞ',
    KeyA: 'அ', KeyS: 'இ', KeyD: 'உ', KeyF: '்', KeyG: 'எ', KeyH: 'க', KeyJ: 'ப', KeyK: 'ம', KeyL: 'த', Semicolon: 'ந', Quote: 'ய',
    KeyZ: 'ஔ', KeyX: 'ஓ', KeyC: 'ஒ', KeyV: 'வ', KeyB: 'ங', KeyN: 'ல', KeyM: 'ர', Slash: 'ழ', Space: ' ' };
  const TA_SHIFT = { KeyQ: 'ஸ', KeyW: 'ஷ', KeyE: 'ஜ', KeyR: 'ஹ', KeyT: 'க்ஷ', KeyY: 'ஸ்ரீ', KeyF: 'ஃ' };
  const TA_CODE = {}; for (const [c, v] of Object.entries(TA)) TA_CODE[v] = c;
  const SIGN = { 'ா': 'ஆ', 'ி': 'இ', 'ீ': 'ஈ', 'ு': 'உ', 'ூ': 'ஊ', 'ெ': 'எ', 'ே': 'ஏ', 'ை': 'ஐ', 'ொ': 'ஒ', 'ோ': 'ஓ', 'ௌ': 'ஔ' };
  const PULLI = '்', AYTHAM = 'ஃ', AUTO = new Set(['ஙக', 'ஞச', 'ணட', 'நத', 'மப', 'னற']);   // nasal + stop: pulli comes by itself
  const MARK = /[\u0BBE-\u0BCD\u0BD7]/;   // vowel signs and pulli join the letter before them
  const isCons = c => c >= 'க' && c <= 'ஹ' && TA_CODE[c];
  const taLabel = c => c === PULLI ? '◌்' : c;

  // a target string → key steps { code, shift, from, to, id (char code recorded for review) }
  function enSteps(s) { return [...s].map((c, i) => { const k = CH[c] || CH[' ']; return { code: k.code, shift: k.shift, ch: c, from: i, to: i + 1, id: (/[A-Z]/.test(c) ? c.toLowerCase() : c).charCodeAt(0) }; }); }
  function taSteps(s) {
    const a = [...s], out = [];
    for (let i = 0; i < a.length; i++) {
      const c = a[i];
      if (c === AYTHAM) { out.push({ code: 'KeyF', shift: true, from: i, to: i + 1, id: c.charCodeAt(0) }); continue; }
      if (SIGN[c]) { out.push({ code: TA_CODE[SIGN[c]], from: i, to: i + 1, id: SIGN[c].charCodeAt(0) }); continue; }
      const from = out.length && out[out.length - 1].to < i ? out[out.length - 1].to : i;   // includes an automatic pulli
      out.push({ code: TA_CODE[c] || 'Space', from, to: i + 1, id: c.charCodeAt(0) });
      if (isCons(c) && a[i + 1] === PULLI) {
        const n2 = a[i + 2];
        if (n2 && isCons(n2) && (n2 === c || AUTO.has(c + n2))) { i++; continue; }      // pulli is added by the next key
        out.push({ code: 'KeyF', from: i + 1, to: i + 2, id: PULLI.charCodeAt(0) }); i++;
      }
    }
    return out;
  }
  // label of a key for messages
  function keyText(code, shift, lay) {
    if (code === 'Space') return t('typing.space');
    if (/^Shift/.test(code)) return 'Shift';
    if (lay === 'ta' && (shift ? TA_SHIFT[code] : TA[code])) { const v = shift ? TA_SHIFT[code] : TA[code]; return `${taLabel(v)} (${shift ? 'Shift + ' : ''}${EN[code][0].toUpperCase()})`; }
    const [a, b] = EN[code]; return shift ? b : a.toUpperCase() === a ? a : a.toUpperCase();
  }
  const fName = f => t('typing.f.' + f);

  // ---------- visuals: keyboard + hands ----------
  function boardHtml(o = {}) {
    const lay = o.lay || 'en', next = o.next, miss = o.miss || {};
    const lit = new Set(next ? [next.code, ...(next.shift ? [shiftFor(next.code)] : [])] : []);
    const cap = code => {
      if (code === 'Space') return '<span class="k-main"></span>';
      if (/^Shift/.test(code)) return '<span class="k-main k-word">Shift</span>';
      if (lay === 'ta') { const v = TA[code], s = TA_SHIFT[code]; return `${s ? `<span class="k-alt" lang="ta">${s}</span>` : ''}${v ? `<span class="k-main" lang="ta">${taLabel(v)}</span><span class="k-qw">${esc(EN[code][0].toUpperCase())}</span>` : `<span class="k-main">${esc(EN[code][0])}</span>`}`; }
      const [a, b] = EN[code]; return `${/[a-z]/.test(a) ? '' : `<span class="k-alt">${esc(b)}</span>`}<span class="k-main">${esc(a.toUpperCase())}</span>`;
    };
    return `<div class="ty-kbwrap"><div class="ty-kb ${o.plain ? 'plain' : ''}" role="group" aria-label="${t('typing.board')}">${ROWS.map((row, ri) => `<div class="ty-row r${ri}">${row.map(code =>
      `<button type="button" tabindex="-1" class="ty-key f-${FINGER[code] || 'rp'} ${code === 'Space' ? 'space' : ''} ${/^Shift/.test(code) ? 'shift' : ''} ${code === 'KeyF' || code === 'KeyJ' ? 'bump' : ''} ${lit.has(code) ? 'next' : ''} ${miss[code] ? 'miss' : ''}" data-code="${code}" aria-label="${esc(keyText(code, false, lay))}">${cap(code)}${miss[code] ? `<span class="k-n">${miss[code]}</span>` : ''}</button>`).join('')}</div>`).join('')}</div></div>`;
  }
  // shaded two-hand diagram (palms down, seen from above); fingertips carry the key colours
  const HANDF = { p: { cx: -62, w: 24, top: 74 }, r: { cx: -32, w: 27, top: 44 }, m: { cx: 0, w: 28, top: 30 }, i: { cx: 32, w: 27, top: 46 } };
  function handsSvg(active = [], lay = 'en') {
    const on = new Set(active), homeLbl = f => { const c = HOME[f]; return lay === 'ta' ? taLabel(TA[c]) : EN[c][0].toUpperCase(); };
    const hand = (side, ox) => {
      const fs = ['p', 'r', 'm', 'i'].map(k => {
        const g = HANDF[k], id = side + k, lit = on.has(id), x = g.cx - g.w / 2, h = 150 - g.top;
        return `<g class="fg f-${id} ${lit ? 'on' : ''}"><rect x="${x}" y="${g.top}" width="${g.w}" height="${h}" rx="${g.w / 2}" fill="url(#tySkinX)"/>
          <path d="M${x + 4} ${g.top + h * .52}q${g.w / 2 - 4} 5 ${g.w - 8} 0" class="knk"/><circle cx="${g.cx}" cy="${g.top + g.w / 2}" r="${g.w / 2 - 4}" class="tip"/>${lit ? `<rect x="${x - 4}" y="${g.top - 4}" width="${g.w + 8}" height="${h * .62}" rx="${g.w / 2 + 4}" class="ring"/>` : ''}</g>`;
      }).join('');
      const lit = on.has('th');
      return `<g transform="translate(${ox} 0)${side === 'r' ? ' scale(-1 1)' : ''}"><ellipse cx="-8" cy="222" rx="92" ry="9" class="shadow"/>
        <g class="fg f-th ${lit ? 'on' : ''}" transform="translate(58 178) rotate(52)"><rect x="-14" y="-66" width="28" height="82" rx="14" fill="url(#tySkinX)"/><circle cx="0" cy="-52" r="10" class="tip"/>${lit ? '<rect x="-18" y="-70" width="36" height="58" rx="18" class="ring"/>' : ''}</g>
        <rect x="-82" y="112" width="142" height="96" rx="36" fill="url(#tySkinY)"/><rect x="-58" y="196" width="96" height="26" rx="10" fill="url(#tySkinY)"/>${fs}</g>`;
    };
    const lbl = (f, x) => `<text x="${x}" y="${HANDF[f[1]].top - 10}" class="hl ${on.has(f) ? 'on' : ''}" text-anchor="middle" ${lay === 'ta' ? 'lang="ta"' : ''}>${esc(homeLbl(f))}</text>`;
    return `<svg class="ty-hands" viewBox="0 0 560 252" role="img" aria-label="${t('typing.hands')}"><defs>
      <linearGradient id="tySkinX" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#8a5f42"/><stop offset=".42" stop-color="#d2a27e"/><stop offset=".75" stop-color="#bb8a64"/><stop offset="1" stop-color="#8f6345"/></linearGradient>
      <linearGradient id="tySkinY" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c99773"/><stop offset="1" stop-color="#9c6e4f"/></linearGradient></defs>
      ${hand('l', 150)}${hand('r', 410)}
      ${['lp', 'lr', 'lm', 'li'].map(f => lbl(f, 150 + HANDF[f[1]].cx)).join('')}${['ri', 'rm', 'rr', 'rp'].map(f => lbl(f, 410 - HANDF[f[1]].cx)).join('')}
      <text x="150" y="248" class="hn" text-anchor="middle">${t('typing.leftHand')}</text><text x="410" y="248" class="hn" text-anchor="middle">${t('typing.rightHand')}</text></svg>`;
  }
  const fingersFor = st => st ? [FINGER[st.code], ...(st.shift ? [FINGER[shiftFor(st.code)]] : [])] : [];

  // ---------- review skill: which finger presses key X? ----------
  function keyFromSeed(seed) {
    const c = String.fromCharCode(seed || 0);
    if (TA_CODE[c] && c !== ' ') return { code: TA_CODE[c], shift: false, lay: 'ta' };
    if (c === AYTHAM) return { code: 'KeyF', shift: true, lay: 'ta' };
    if (CH[c]) return { ...CH[c], lay: 'en' };
    return null;
  }
  Engine.skill({ id: 'ty.key', subject: 'english', topic: 'typing', name: 'typing.skill', bands: { young: [1, 1], older: [1, 1] }, warm: false,
    gen(l, r, ctx = {}) {
      const k = keyFromSeed(ctx.seed) || { ...CH[r.pick('asdfjkl;ghru'.split(''))], lay: 'en' };
      const f = FINGER[k.code], label = keyText(k.code, k.shift, k.lay);
      const others = r.shuffle(FINGERS.filter(x => x !== f)).slice(0, 3), choices = r.shuffle([f, ...others]).map(v => ({ v, html: esc(fName(v)) }));
      const home = f === 'th' ? null : keyText(HOME[f], false, k.lay);
      return { kind: 'choice', prompt: t('typing.keyQ', { k: `<b>${esc(label)}</b>` }), promptText: t('typing.keyQ', { k: label }), visual: boardHtml({ lay: k.lay, next: k, plain: true }),
        choices, answer: f, answerText: esc(fName(f)),
        hints: [{ text: t('typing.keyRule') }, { text: home ? t('typing.keyHome', { h: home }) : t('typing.keyWhy', { k: label, f: fName(f) }) }, { text: t('typing.keyWhy', { k: label, f: fName(f) }) }], hintRevealsAnswer: true,
        why: { steps: [{ text: t('typing.keyWhy', { k: esc(label), f: fName(f) }), vis: handsSvg(fingersFor(k), k.lay) }, ...(home ? [{ text: t('typing.keyHome', { h: esc(home) }) }] : []), ...(k.shift ? [{ text: t('typing.keyShift') }] : [])], rule: t('typing.keyRule') } };
    } });

  // ---------- lessons ----------
  const pickN = (r, arr, n) => Array.from({ length: n }, () => r.pick(arr));
  const letters = (r, s, n) => pickN(r, s.split(''), n), some = (r, arr, n) => r.shuffle([...arr]).slice(0, n);
  const HOMEW = 'sad dad lad ask fall all add flask salad glass hall gas has had shall dash flag half lass'.split(' ');
  const TOPW = 'we quit tree pot top type word pour your water paper tiger route quiet party pretty hair goat road four'.split(' ');
  const BOTW = 'van man can box zebra cave vine bin mix calm zoom bench comb climb number banana'.split(' ');
  const NAMES = 'Amma Appa Ravi Meena Chennai Madurai India Kavya Arun Salem Tara The We I'.split(' ');
  const PUNC = ['Yes.', 'No!', 'Why?', 'red, blue.', 'Come here!', 'Is it hot?', 'I can, I will.', 'Stop!', 'Who is it?', 'one, two, three.'];
  const shortWords = () => [...Object.keys(EN_DATA.WORDS).filter(w => w.length <= 6 && /^[a-z]+$/.test(w)), ...EN_DATA.DOLCH_PRIMER];
  function sentences() {
    const out = [];
    (window.STORIES_DATA?.stories || []).forEach(s => s.pages.forEach(pg => (pg.en.match(/[^.?!]+[.?!]/g) || []).forEach(x => { x = x.trim().replace(/[“”]/g, '"').replace(/[‘’]/g, "'"); if (x.length >= 14 && x.length <= 48 && /^[\x20-\x7e]+$/.test(x)) out.push(x); })));
    return out.length ? out : Object.values(EN_DATA.SENT);
  }
  const TAW = { ta3: ['கா', 'கி', 'கு', 'பா', 'பி', 'மா', 'மு', 'தா', 'து', 'நா', 'மாமா', 'காது', 'பாதி', 'கை'], ta4: ['அம்மா', 'அப்பா', 'அக்கா', 'தம்பி', 'பந்து', 'தாத்தா', 'பக்கம்'],
    ta5: ['பட்டம்', 'சட்டை', 'கண்', 'மீன்', 'ஆறு', 'நன்றி', 'பஞ்சு', 'ஏணி', 'ஊசி', 'ஐந்து'], ta6: ['வழி', 'மலர்', 'தங்கை', 'ஓடு', 'இலை', 'எஃகு', 'வண்டு', 'ஒன்று', 'ஔவை', 'பழம்'] };
  const LESSONS = [
    { id: 'en1', lay: 'en', make: (r, y) => y ? letters(r, 'fj', 8).join('') + ' ' : 'fff jjj fj jf ffj jjf fjf jfj' },
    { id: 'en2', lay: 'en', make: (r, y) => y ? letters(r, 'asdfjkl', 10).join('') : 'asdf jkl; ' + some(r, HOMEW, 5).join(' ') },
    { id: 'en3', lay: 'en', make: (r, y) => y ? letters(r, 'qwertyuiop', 10).join('') : some(r, TOPW, 6).join(' ') },
    { id: 'en4', lay: 'en', make: (r, y) => y ? letters(r, 'zxcvbnm', 10).join('') : some(r, BOTW, 6).join(' ') },
    { id: 'en5', lay: 'en', older: true, make: r => some(r, NAMES, 6).join(' ') },
    { id: 'en6', lay: 'en', make: (r, y) => y ? letters(r, '1234567890', 10).join('') : Array.from({ length: 6 }, () => String(r.int(1, 999))).join(' ') },
    { id: 'en7', lay: 'en', older: true, make: r => some(r, PUNC, 4).join(' ') },
    { id: 'en8', lay: 'en', wpm: true, make: (r, y) => y ? r.pick(EN_DATA.DOLCH_PRE.filter(w => w.length >= 2 && w.length <= 4 && /^[a-z]+$/.test(w))) : some(r, shortWords(), 7).join(' ') },
    { id: 'en9', lay: 'en', older: true, wpm: true, make: r => r.shuffle(sentences()).slice(0, 2).join(' ') },
    { id: 'ta1', lay: 'ta', make: r => pickN(r, ['அ', 'இ', 'உ', 'எ'], 10).join(' ') },
    { id: 'ta2', lay: 'ta', make: r => pickN(r, ['க', 'ப', 'ம', 'த', 'ந', 'ய'], 10).join(' ') },
    ...['ta3', 'ta4', 'ta5', 'ta6'].map(id => ({ id, lay: 'ta', make: r => some(r, TAW[id], 5).join(' ') })),
  ];
  const lessonsFor = (p, lay) => LESSONS.filter(L => L.lay === lay && (AGE.band(p) === 'older' || !L.older));

  // ---------- state ----------
  let G = null;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = () => matchMedia('(pointer: coarse)').matches;
  const X = p => { p.extras = p.extras || {}; return p.extras.typing ??= { done: {}, best: {}, lay: 'en' }; };
  function go() { if (location.hash.startsWith('#/typing')) App.route(); else location.hash = '#/typing'; }
  function open(p) { G = { view: 'path', lay: AGE.band(p) === 'older' ? X(p).lay || 'en' : 'en' }; go(); }
  function startLesson(id) {
    const p = Store.current(), L = LESSONS.find(x => x.id === id), seed = Engine.newSeed(), r = Engine.rng(seed), young = AGE.band(p) === 'young';
    const target = L.make(r, young), steps = L.lay === 'ta' ? taSteps(target) : enSteps(target);
    G = { ...G, view: 'drill', lesson: id, lay: L.lay, target, steps, i: 0, missAt: new Set(), miss: {}, t0: 0, young };
    draw();
  }

  // ---------- screen ----------
  let main = null;
  function render(m) {
    main = m; const p = Store.current();
    if (!G) G = { view: 'path', lay: AGE.band(p) === 'older' ? X(p).lay || 'en' : 'en' };
    m.innerHTML = `<section class="page typing" data-subject="english">
      <a class="backlink" href="#/s/english"><svg class="k-icon"><use href="#i-back"/></svg>${t('subj.english.title')}</a>
      <p class="eyebrow">${t('games.title')}</p><div class="lesson-head"><h1 id="tyH">${t('typing.title')}</h1>${Engine.listenBtn('tylisten')}</div>
      <div id="tyBody"></div><p class="ty-sr" id="tyLive" aria-live="polite"></p></section>`;
    Engine.bindListen(m.querySelector('.tylisten'), listenSegs);
    draw();
  }
  const body = () => main?.querySelector('#tyBody');
  function draw() {
    const el = body(); if (!el) return;
    const fn = { path: drawPath, drill: drawDrill, result: drawResult, rain: drawRain }[G.view];
    if (!fn) { G.view = 'path'; return drawPath(el); }
    fn(el);
  }
  function listenSegs() {
    const L = G.lesson && LESSONS.find(x => x.id === G.lesson), segs = [];
    if (G.view === 'path') segs.push({ text: t('typing.blurb') + (AGE.band(Store.current()) === 'older' ? ' ' + t('typing.rainBlurb') : ''), lang: I18N.lang });
    else if (G.view === 'rain') segs.push({ text: t('typing.rainBlurb'), lang: I18N.lang });
    else if (L) {
      segs.push({ text: t('typing.l.' + L.id) + '. ' + t('typing.tip.' + L.id), lang: I18N.lang });
      if (L.id === 'en1' && G.view === 'drill') ['s1', 's2', 's3', 's4', 's5', 's6'].forEach(k => segs.push({ text: t('typing.sit.' + k), lang: I18N.lang }));
    }
    const live = main?.querySelector('#tyLive')?.textContent; if (live && G.view !== 'path') segs.push({ text: live, lang: I18N.lang });
    return segs;
  }
  function setH(txt) { const h = main?.querySelector('#tyH'); if (h) h.textContent = txt; }

  function drawPath(el) {
    const p = Store.current(), x = X(p), older = AGE.band(p) === 'older', list = lessonsFor(p, G.lay);
    setH(t('typing.title'));
    el.innerHTML = `<p class="ty-lead">${t('typing.blurb')}</p>
      ${older ? `<div class="ty-lay"><span class="eyebrow">${t('typing.layout')}</span><div class="seg" role="group" aria-label="${t('typing.layout')}">${['en', 'ta'].map(l => `<button type="button" data-lay="${l}" aria-pressed="${G.lay === l}">${t('typing.' + l)}</button>`).join('')}</div></div>` : ''}
      ${G.lay === 'ta' ? `<p class="small muted">${t('typing.taNote')}</p>` : ''}
      ${coarse() ? `<p class="ty-note small">${t('typing.touch')}</p>` : ''}
      <p class="eyebrow">${t('typing.lessons')}</p>
      <ol class="ty-path">${list.map((L, i) => { const d = x.done[L.id], b = x.best[L.id];
        return `<li><button type="button" class="ty-lesson ${d != null ? 'done' : ''}" data-id="${L.id}"><span class="step-n">${i + 1}</span><span class="ty-lname"><b>${t('typing.l.' + L.id)}</b><small>${t('typing.tip.' + L.id)}</small></span>
          <span class="ty-lstat small">${d != null ? t('typing.doneAt', { a: d }) : ''}${b ? `<br>${t('typing.best')}: <span class="mono">${b}</span>` : ''}</span></button></li>`; }).join('')}</ol>
      ${older && G.lay === 'en' ? `<div class="ty-raincard k-card"><div><p class="eyebrow">${t('games.title')}</p><h2>${t('typing.rain')}</h2><p class="small">${t('typing.rainBlurb')}</p>${x.best.rain ? `<p class="small">${t('typing.best')}: <span class="mono">${x.best.rain}</span> ${t('typing.wpm').toLowerCase()}</p>` : ''}</div><button type="button" class="k-btn k-btn-outline pill" id="tyRain">${t('typing.start')}</button></div>` : ''}`;
    el.querySelectorAll('[data-lay]').forEach(b => b.onclick = () => { G.lay = b.dataset.lay; x.lay = G.lay; Store.save(); draw(); });
    el.querySelectorAll('.ty-lesson').forEach(b => b.onclick = () => startLesson(b.dataset.id));
    el.querySelector('#tyRain')?.addEventListener('click', startRain);
    say('');
  }

  // the capture field: keeps IME composition and phone keyboards working; physical keys are read from keydown
  const capHtml = () => `<textarea class="ty-cap" aria-label="${t('typing.capture')}" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" rows="1"></textarea>`;
  function bindCap(el) {
    const cap = el.querySelector('.ty-cap'); if (!cap) return;
    let composing = false;
    cap.addEventListener('compositionstart', () => { composing = true; });
    cap.addEventListener('compositionend', e => { composing = false; textIn(e.data || ''); cap.value = ''; });
    cap.addEventListener('input', e => { if (composing || e.isComposing) return; if (e.inputType === 'insertText' && e.data) textIn(e.data); cap.value = ''; });
    el.querySelector('.ty-text, .ty-rainbox')?.addEventListener('click', () => cap.focus({ preventScroll: true }));
    if (!coarse()) cap.focus({ preventScroll: true });
  }
  function bindBoard(el) {
    el.querySelectorAll('.ty-kb .ty-key').forEach(b => {
      b.onpointerdown = e => e.preventDefault();
      b.onclick = () => { const code = b.dataset.code; if (/^Shift/.test(code)) return; const st = cur(); press({ code, shift: !!st?.shift && st.code === code, key: G.lay === 'ta' ? null : (st && st.code === code ? st.ch : EN[code][0]), tap: true }); };
    });
  }

  function drawDrill(el) {
    const L = LESSONS.find(x => x.id === G.lesson);
    setH(t('typing.l.' + L.id));
    el.innerHTML = `<button type="button" class="k-btn k-btn-ghost k-btn-sm ty-backbtn"><svg class="k-icon"><use href="#i-back"/></svg>${t('typing.back')}</button>
      <p class="ty-lead">${t('typing.tip.' + L.id)}</p>
      ${L.id === 'en1' ? `<section class="k-card ty-sit"><p class="eyebrow">${t('typing.sit.head')}</p><ol class="steps">${['s1', 's2', 's3', 's4', 's5', 's6'].map((k, i) => `<li class="step"><span class="step-n">${i + 1}</span><div class="step-body"><p>${t('typing.sit.' + k)}</p></div></li>`).join('')}</ol></section>` : ''}
      ${coarse() ? `<p class="ty-note small">${t('typing.touch')}</p>` : ''}
      <div class="ty-text ${G.young ? 'young' : ''} ${G.lay === 'ta' ? 'ta' : ''}" ${G.lay === 'ta' ? 'lang="ta"' : 'lang="en"'}><p class="eyebrow">${G.young ? t('typing.pressGlow') : t('typing.typeLine')}</p><div class="ty-line" aria-hidden="true"></div><p class="ty-say" aria-hidden="true"></p>${capHtml()}</div>
      <div class="board ty-kbboard"></div>
      <div class="board ty-handsboard"></div>`;
    el.querySelector('.ty-backbtn').onclick = () => { G.view = 'path'; draw(); };
    bindCap(el); upd();
  }
  const cur = () => G.view === 'rain' ? rainStep() : G.steps?.[G.i];
  function stepName(st) {
    const k = keyText(st.code, st.shift, G.lay), f = fName(FINGER[st.code]);
    return st.shift && G.lay === 'en' ? t('typing.withShift', { k, s: fName(FINGER[shiftFor(st.code)]) }) + ' ' + f : t('typing.next', { k, f });
  }
  function upd(miss) {
    const el = body(); if (!el) return; const st = cur();
    const line = el.querySelector('.ty-line');
    if (line && G.view === 'drill') {
      const s = G.target;
      if (G.young && G.lesson !== 'en8') line.innerHTML = `<span class="ty-big">${st ? esc(st.ch === ' ' ? '␣' : st.ch) : ''}</span><span class="ty-dots">${G.steps.map((x, i) => `<i class="${i < G.i ? 'd' : i === G.i ? 'c' : ''}"></i>`).join('')}</span>`;
      else { let a = st ? st.from : s.length, b = st ? st.to : s.length;
        if (G.lay === 'ta') { while (a > 0 && MARK.test(s[a])) a--; while (b < s.length && MARK.test(s[b])) b++; }   // highlight the whole syllable
        const show = x => esc(x).replace(/ /g, '<span class="sp"> </span>');
        line.innerHTML = `<span class="done">${show(s.slice(0, a))}</span><span class="cur ${miss ? 'shake' : ''}">${s.slice(a, b) === ' ' ? '<span class="sp">␣</span>' : esc(s.slice(a, b))}</span><span class="rest">${show(s.slice(b))}</span>`; }
    }
    const kb = el.querySelector('.ty-kbboard'); if (kb) { kb.innerHTML = boardHtml({ lay: G.lay, next: st }); bindBoard(kb); scrollKey(kb); }
    const hb = el.querySelector('.ty-handsboard'); if (hb) hb.innerHTML = handsSvg(fingersFor(st), G.lay);
    if (st && !miss) say(stepName(st));
  }
  function scrollKey(kb) {
    const w = kb.querySelector('.ty-kbwrap'), k = kb.querySelector('.ty-key.next:not(.shift)'); if (!w || !k || w.scrollWidth <= w.clientWidth) return;
    w.scrollLeft = k.offsetLeft - w.clientWidth / 2 + k.offsetWidth / 2;
  }
  function say(txt) { const l = main?.querySelector('#tyLive'); if (l) l.textContent = txt; const v = main?.querySelector('.ty-say'); if (v) v.textContent = txt; }
  function flash(code) { const b = body()?.querySelector(`.ty-kbboard .ty-key[data-code="${code}"]`); if (b) { b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 450); } }

  // ---------- input ----------
  function press(inp) {
    if (G.view === 'rain') return rainPress(inp);
    if (G.view !== 'drill') return;
    const st = cur(); if (!st) return;
    if (!G.t0) G.t0 = Date.now();
    const ok = G.lay === 'ta' ? (inp.code === st.code && (inp.tap || !!inp.shift === !!st.shift)) : (inp.key != null ? inp.key === st.ch : inp.code === st.code);
    if (ok) { G.i++; if (G.i >= G.steps.length) return finish(); upd(); return; }
    miss(st, inp);
  }
  function miss(st, inp) {
    if (!G.missAt.has(G.i)) { G.missAt.add(G.i); G.miss[st.id] = (G.miss[st.id] || 0) + 1; }
    if (inp.code && CH[EN[inp.code]?.[0]]) flash(inp.code);
    const g = inp.code && EN[inp.code] ? keyText(inp.code, !!inp.shift, G.lay) : esc(inp.key || '');
    upd(true); say(t('typing.wrong', { g, k: keyText(st.code, st.shift, G.lay) }));
  }
  // text from an IME or a phone keyboard
  function textIn(str) {
    if (!str) return;
    if (G.lay === 'ta' && G.view === 'drill') {
      const st = cur(); if (!st) return; const pos = st.from;
      if (G.target.startsWith(str, pos)) { if (!G.t0) G.t0 = Date.now(); while (G.i < G.steps.length && G.steps[G.i].to <= pos + str.length) G.i++; if (G.i >= G.steps.length) return finish(); upd(); }
      else if (/^[\x20-\x7e]+$/.test(str)) [...str].forEach(ch => CH[ch] && press({ code: CH[ch].code, shift: CH[ch].shift }));   // phone keyboard: Tamil99 by key position
      else miss(st, { key: str });
      return;
    }
    [...str].forEach(ch => press({ key: ch, code: CH[ch]?.code, shift: CH[ch]?.shift }));
  }
  function keys(e) {
    if (!G || !['drill', 'rain'].includes(G.view)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.isComposing || e.keyCode === 229) return;
    if (!e.key || e.key.length !== 1) return;
    const tg = e.target; if (tg?.matches?.('input, select, textarea:not(.ty-cap)')) return;
    e.preventDefault(); if (e.repeat) return;
    press({ code: e.code, shift: e.shiftKey, key: G.lay === 'ta' ? null : e.key });
  }

  // ---------- results ----------
  function record(missMap, cleanIds, n, right, ms) {
    const p = Store.current(), sk = Engine.SK['ty.key'], rq = p.subjects.english.review;
    const weak = Object.entries(missMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
    weak.forEach(([id]) => Store.record(p, 'english', sk, { key: 'ty.key|1|' + id, lvl: 1, seed: +id }, false));
    [...cleanIds].filter(id => !missMap[id] && rq['ty.key|1|' + id]).forEach(id => Store.record(p, 'english', sk, { key: 'ty.key|1|' + id, lvl: 1, seed: +id }, true));
    Store.logSession(p, { subject: 'english', topic: 'typing', mode: 'typing', n, right, ms });
  }
  function finish() {
    const p = Store.current(), x = X(p), L = LESSONS.find(l => l.id === G.lesson), n = G.steps.length, right = n - G.missAt.size, ms = Date.now() - (G.t0 || Date.now());
    const acc = Math.round(100 * right / n), wpm = L.wpm && !G.young && ms > 0 ? Math.min(200, Math.max(1, Math.round((G.target.length / 5) / (ms / 60000)))) : null;
    record(G.miss, new Set(G.steps.map(s => String(s.id))), n, right, ms);
    x.done[L.id] = Math.max(acc, x.done[L.id] || 0);
    const newBest = !!wpm && acc >= 80 && (!x.best[L.id] || wpm > x.best[L.id]); if (newBest) x.best[L.id] = wpm;
    Store.save();
    G.res = { acc, wpm, right, n, newBest, best: x.best[L.id] }; G.view = 'result'; draw();
  }
  function missList(missMap, lay) {
    return Object.entries(missMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, c]) => {
      const k = keyFromSeed(+id) || { code: 'Space', lay }; const f = FINGER[k.code], label = keyText(k.code, k.shift, k.lay);
      return { code: k.code, c, text: f === 'th' ? t('typing.missedThumb', { k: esc(label) }) : t('typing.missedLine', { k: `<b>${esc(label)}</b>`, f: fName(f), h: esc(keyText(HOME[f], false, k.lay)) }), f };
    });
  }
  function cardHtml(o) {
    const ms = missList(o.miss, G.lay), clean = !ms.length;
    return `<article class="lessoncard ${clean ? 'ok' : 'miss'}" tabindex="-1">
      <header class="lc-head"><span class="lc-mark" aria-hidden="true"><svg class="k-icon"><use href="#${clean ? 'i-check' : 'i-dot'}"/></svg></span>
        <div><p class="lc-status">${o.title}</p><p class="lc-answer">${o.line}</p></div>${Engine.listenBtn('lclisten')}</header>
      <dl class="ty-stats">${o.stats.map(([k, v]) => `<div><dt>${k}</dt><dd class="mono">${v}</dd></div>`).join('')}</dl>
      ${o.newBest ? `<p class="lc-rule">${t('typing.newBest')}</p>` : ''}
      <p class="eyebrow">${clean ? t('typing.done') : t('typing.missedHead')}</p>
      <ol class="steps whysteps">${clean ? `<li class="step"><span class="step-n">1</span><div class="step-body"><p>${t('typing.clean')}</p></div></li>`
        : ms.map((m, i) => `<li class="step"><span class="step-n f-${m.f}">${i + 1}</span><div class="step-body"><p ${G.lay === 'ta' ? 'lang="ta"' : ''}>${m.text}</p><p class="small muted">${m.c === 1 ? t('typing.missed1') : t('typing.missedN', { n: m.c })}</p></div></li>`).join('')}</ol>
      ${clean ? '' : `<p class="small muted">${t('typing.review')}</p>`}
      <div class="row-actions">${o.actions}</div></article>
      <div class="board ty-kbboard">${boardHtml({ lay: G.lay, miss: Object.fromEntries(ms.map(m => [m.code, m.c])) })}</div>
      ${ms.length ? `<div class="board ty-handsboard">${handsSvg([...new Set(ms.map(m => m.f))], G.lay)}</div>` : ''}`;
  }
  function bindCard(el, segsExtra, again, next) {
    const card = el.querySelector('.lessoncard');
    Engine.bindListen(card.querySelector('.lclisten'), () => [{ text: [...card.querySelectorAll('.lc-status, .lc-answer, .lc-rule, .whysteps p')].map(n => n.textContent).join('. '), lang: I18N.lang }]);
    el.querySelector('#tyAgain').onclick = again; el.querySelector('#tyNext')?.addEventListener('click', next);
    el.querySelector('#tyLessons').onclick = () => { G.view = 'path'; draw(); };
    card.focus({ preventScroll: false });
  }
  function drawResult(el) {
    const L = LESSONS.find(x => x.id === G.lesson), R = G.res, list = lessonsFor(Store.current(), G.lay), nx = list[list.findIndex(l => l.id === L.id) + 1];
    setH(t('typing.l.' + L.id));
    const stats = [[t('typing.accuracy'), R.acc + '%']]; if (R.wpm) stats.push([t('typing.wpm'), R.wpm], [t('typing.best'), R.best || R.wpm]);
    el.innerHTML = cardHtml({ title: t('typing.done'), line: t('typing.summary', { r: R.right, n: R.n }), stats, newBest: R.newBest, miss: G.miss,
      actions: `<button type="button" class="k-btn k-btn-ghost" id="tyLessons">${t('typing.back')}</button><button type="button" class="k-btn k-btn-outline pill" id="tyAgain">${t('typing.again')}</button>${nx ? `<button type="button" class="k-btn k-btn-primary" id="tyNext">${t('typing.nextLesson')}</button>` : ''}` });
    bindCard(el, null, () => startLesson(L.id), () => startLesson(nx.id));
    say(t('typing.done') + '. ' + t('typing.summary', { r: R.right, n: R.n }));
  }

  // ---------- word rain (older, English) ----------
  const RAIN_N = 12, RAIN_H = 300;
  function startRain() {
    const r = Engine.rng(Engine.newSeed()), words = r.shuffle(shortWords().filter(w => w.length >= 3 && w.length <= 6)).slice(0, RAIN_N);
    G = { ...G, view: 'rain', lesson: null, lay: 'en', rain: { queue: words, items: [], cleared: 0, paused: false, t0: 0, chars: 0, miss: {}, missAt: new Set(), ids: new Set(), n: 0, right: 0, last: 0 } };
    draw();
  }
  function rainActive() { const R = G.rain; return R.items.reduce((a, it) => (!a || it.y > a.y ? it : a), null); }
  function rainStep() { const it = rainActive(); if (!it) return null; const c = it.w[it.typed]; const k = CH[c]; return { code: k.code, shift: k.shift, ch: c, id: c.charCodeAt(0) }; }
  function rainSpawn() {
    const R = G.rain, rd = reduced();
    while (R.items.length < 3 && R.queue.length) {
      const w = R.queue.shift(), slot = R.items.length, lowest = R.items.reduce((m, it) => Math.min(m, it.y), RAIN_H);
      R.items.push({ w, typed: 0, x: [12, 46, 74][(R.cleared + slot) % 3], y: rd ? 0 : Math.min(-20, lowest - 95) });
    }
    if (rd) R.items.sort((a, b) => b.y - a.y).forEach((it, i) => it.y = 200 - i * 80);   // no drift: a calm stack
  }
  function drawRain(el) {
    setH(t('typing.rain'));
    el.innerHTML = `<button type="button" class="k-btn k-btn-ghost k-btn-sm ty-backbtn"><svg class="k-icon"><use href="#i-back"/></svg>${t('typing.back')}</button>
      <p class="ty-lead">${t('typing.rainBlurb')}</p>${coarse() ? `<p class="ty-note small">${t('typing.touch')}</p>` : ''}
      <div class="ty-rainbar small"><span id="tyLeft"></span><span class="ty-say" aria-hidden="true"></span></div>
      <div class="board ty-rainbox" lang="en" aria-hidden="true" style="height:${RAIN_H}px"></div>${capHtml()}
      <div class="board ty-kbboard"></div>`;
    el.querySelector('.ty-backbtn').onclick = () => { G.view = 'path'; draw(); };
    bindCap(el); rainSpawn(); rainDraw(); rainUpd();
    const box = el.querySelector('.ty-rainbox'); G.rain.last = 0;
    const tick = ts => {
      if (!box.isConnected || G.view !== 'rain') return;
      const R = G.rain, dt = R.last ? Math.min(0.1, (ts - R.last) / 1000) : 0; R.last = ts;
      if (!R.paused && !reduced()) {
        const act = rainActive(), v = act && act.y < 24 ? 70 : 16;   // bring the next word into view quickly, then drift
        R.items.forEach(it => { it.y += v * dt; if (it.y > RAIN_H - 34) it.y = Math.min(-30, Math.min(...R.items.map(o => o.y)) - 95); });   // a word that lands floats back to the top: no penalty
        rainPos();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function rainDraw() {
    const box = body()?.querySelector('.ty-rainbox'); if (!box) return; const act = rainActive();
    box.innerHTML = G.rain.items.map((it, i) => `<span class="ty-drop ${it === act ? 'act' : ''} ${G.rain.paused && it === act ? 'paused' : ''}" data-i="${i}" style="left:${it.x}%"><b>${esc(it.w.slice(0, it.typed))}</b>${esc(it.w.slice(it.typed))}</span>`).join('');
    rainPos();
  }
  function rainPos() { body()?.querySelectorAll('.ty-drop').forEach(s => { const it = G.rain.items[+s.dataset.i]; if (it) s.style.transform = `translate(-50%, ${Math.round(it.y)}px)`; }); }
  function rainUpd() {
    const el = body(); if (!el) return; const st = rainStep(), R = G.rain;
    el.querySelector('#tyLeft').textContent = t('typing.rainLeft', { n: RAIN_N - R.cleared });
    const kb = el.querySelector('.ty-kbboard'); kb.innerHTML = boardHtml({ lay: 'en', next: st }); bindBoard(kb); scrollKey(kb);
    const act = rainActive(); if (act && !R.paused) say(t('typing.rainType', { w: act.w }) + ' ' + (st ? stepName(st) : ''));
  }
  function rainPress(inp) {
    const R = G.rain, it = rainActive(), st = rainStep(); if (!it || !st) return;
    if (inp.key === ' ' && st.ch !== ' ') return;
    if (!R.t0) R.t0 = Date.now();
    R.ids.add(String(st.id));
    if (inp.key != null ? inp.key === st.ch : inp.code === st.code) {
      if (!R.missAt.has(R.n)) R.right++; R.n++; R.chars++; it.typed++; R.paused = false;
      if (it.typed >= it.w.length) { R.items.splice(R.items.indexOf(it), 1); R.cleared++; R.chars++; rainSpawn(); if (!R.items.length) return rainFinish(); }
      rainDraw(); rainUpd(); return;
    }
    if (!R.missAt.has(R.n)) { R.missAt.add(R.n); R.miss[st.id] = (R.miss[st.id] || 0) + 1; }
    R.paused = true; rainDraw(); if (inp.code) flash(inp.code);
    say(t('typing.paused', { k: keyText(st.code, st.shift, 'en') }));
  }
  function rainFinish() {
    const R = G.rain, p = Store.current(), x = X(p), ms = Date.now() - R.t0, acc = Math.round(100 * R.right / Math.max(1, R.n)), wpm = Math.min(200, Math.max(1, Math.round((R.chars / 5) / (ms / 60000))));
    record(R.miss, R.ids, R.n, R.right, ms);
    const newBest = acc >= 80 && (!x.best.rain || wpm > x.best.rain); if (newBest) x.best.rain = wpm; Store.save();
    G.view = 'result-rain'; G.miss = R.miss;
    const el = body(); setH(t('typing.rain'));
    el.innerHTML = cardHtml({ title: t('typing.done'), line: t('typing.rainDone', { n: R.cleared }), stats: [[t('typing.accuracy'), acc + '%'], [t('typing.wpm'), wpm], [t('typing.best'), x.best.rain || wpm]], newBest, miss: R.miss,
      actions: `<button type="button" class="k-btn k-btn-ghost" id="tyLessons">${t('typing.back')}</button><button type="button" class="k-btn k-btn-outline pill" id="tyAgain">${t('typing.again')}</button>` });
    bindCard(el, null, startRain);
    say(t('typing.done') + '. ' + t('typing.rainDone', { n: R.cleared }));
  }

  ROUTES.typing = { render, keys };
  window.TYPING = { game: { title: 'typing.title', blurb: 'typing.blurb', icon: 'i-letter', start: p => open(p) },
    _test: { taSteps, enSteps, keyFromSeed, press: (code, shift, key) => press({ code, shift, key }), get state() { return G; } } };
})();
