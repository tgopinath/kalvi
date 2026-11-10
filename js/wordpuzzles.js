// Word puzzles (English): seven puzzle types about word structure and sentences, run on the shared
// Engine as skills 'wp.*' (hint ladder: nudge → worked step → answer; a lesson card naming the rule after
// every puzzle; misses go to the Leitner queue; results count to English progress and the parent view).
// Types: picture crossword, word search, unscramble, word ladder (older), sentence jigsaw, missing
// letters (spelling patterns) and compound words. Puzzle words stay English (lang="en") in Tamil mode.
(function () {
  const t = (k, v) => I18N.t(k, v), esc = Engine.esc, D = EN_DATA, S = 'english';
  const en = text => ({ text, lang: 'en' }), ui = text => ({ text, lang: I18N.lang });
  const W = w => `<span lang="en">${esc(w)}</span>`;
  const pic = w => window.PICS?.[w] || null;
  const img = (w, cls = '') => pic(w) ? `<img class="${cls}" src="${pic(w).src}" alt="${esc(w)}" loading="lazy" referrerpolicy="no-referrer">` : '';
  const credit = w => window.ENGLISH?.credit(w) || null;
  const taMean = w => window.ENGLISH?.taMean(w) || '';
  const meanOf = w => taMean(w) ? ` <span class="wp-ta" lang="ta">${taMean(w)}</span>` : '';
  const ladder = (a, b, c) => [{ text: a }, { text: b.text ?? b, vis: b.vis }, { text: c.text ?? c, vis: c.vis }];
  const done = () => !!Engine.round?.answered;
  const say = w => Voice.play([en(w)], null, { rate: Store.current()?.settings?.rate ?? .9 });
  const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

  I18N.add({ wp: {
    title: ['Word puzzles', 'சொல் புதிர்கள்'],
    blurb: ['Crosswords, word searches, word ladders and sentence jigsaws. Learn how words and sentences are built.', 'குறுக்கெழுத்து, சொல் தேடல், சொல் ஏணி, வாக்கியப் புதிர். சொற்களும் வாக்கியங்களும் எப்படி அமைகின்றன என்று கற்போம்.'],
    skill: { crossword: ['Crossword', 'குறுக்கெழுத்து'], search: ['Word search', 'சொல் தேடல்'], unscramble: ['Unscramble', 'எழுத்துகளை வரிசைப்படுத்து'], ladder: ['Word ladder', 'சொல் ஏணி'], jigsaw: ['Sentence jigsaw', 'வாக்கியப் புதிர்'], missing: ['Missing letters', 'விடுபட்ட எழுத்துகள்'], compound: ['Compound words', 'கூட்டுச் சொற்கள் (compound words)'] },
    kbd: ['Letter keyboard', 'எழுத்து விசைப்பலகை'], del: ['Delete letter', 'எழுத்தை அழி'],
    kbdNote: ['You can also type on your keyboard. Arrow keys move.', 'உன் விசைப்பலகையிலும் தட்டச்சு செய்யலாம். அம்புக்குறி விசைகள் நகர்த்தும்.'],
    across: ['Across', 'குறுக்கே'], down: ['Down', 'நெடுக்கே'], clues: ['Clues', 'குறிப்புகள்'],
    cell: ['Row {r}, column {c}', 'வரிசை {r}, நிரல் {c}'], empty: ['empty', 'காலி'], clueN: ['{n} {dir}, {len} letters', '{n} {dir}, {len} எழுத்துகள்'],
    grid: ['Crossword grid', 'குறுக்கெழுத்துக் கட்டம்'], sgrid: ['Word search grid', 'சொல் தேடல் கட்டம்'],
    q: {
      crossPic: ['Look at each picture and write its word in the crossword.', 'ஒவ்வொரு படத்தையும் பார்த்து, அதன் சொல்லைக் குறுக்கெழுத்தில் எழுது.'],
      crossText: ['Read the clues and fill in the crossword.', 'குறிப்புகளைப் படித்து, குறுக்கெழுத்தை நிரப்பு.'],
      search: ['Find the {n} hidden words. Tap the first letter, then the last letter, or drag across them.', 'மறைந்திருக்கும் {n} சொற்களைக் கண்டுபிடி. முதல் எழுத்தைத் தட்டி, பிறகு கடைசி எழுத்தைத் தட்டு, அல்லது அவற்றின் மேல் இழு.'],
      unscramble: ['Put the letters in order to make the word.', 'எழுத்துகளை வரிசைப்படுத்திச் சொல்லை உருவாக்கு.'],
      ladder: ['Change one letter at a time to turn {a} into {b}.', 'ஒரு நேரத்தில் ஓர் எழுத்தை மட்டும் மாற்றி, {a}-ஐ {b} ஆக மாற்று.'],
      jigsaw: ['Put the words in order to make a sentence.', 'சொற்களை வரிசைப்படுத்தி ஒரு வாக்கியம் அமை.'],
      missing1: ['Which letter is missing?', 'எந்த எழுத்து விடுபட்டுள்ளது?'],
      missing2: ['Which letters are missing?', 'எந்த எழுத்துகள் விடுபட்டுள்ளன?'],
      compoundB: ['Which word joins {a} to make a new word?', '{a} உடன் எந்தச் சொல் சேர்ந்தால் புதிய சொல் கிடைக்கும்?'],
      compoundA: ['Which word comes before {b} to make a new word?', '{b}-க்கு முன் எந்தச் சொல் வந்தால் புதிய சொல் கிடைக்கும்?'],
    },
    ui: {
      found: ['Found {a} of {b}', '{b}-இல் {a} கண்டுபிடித்தாய்'], foundWord: ['You found {w}.', '{w} கண்டுபிடித்தாய்.'], notWord: ['That line is not one of the words. Try again.', 'அந்த வரிசை தேட வேண்டிய சொல் அல்ல. மீண்டும் முயல்.'],
      start: ['Start', 'தொடக்கம்'], goal: ['Goal', 'இலக்கு'], step: ['Step {n}', 'படி {n}'], undo: ['Undo', 'திரும்பப் பெறு'],
      pickLetter: ['Tap the letter you want to change, then pick a new letter.', 'மாற்ற வேண்டிய எழுத்தைத் தட்டி, புதிய எழுத்தைத் தேர்ந்தெடு.'],
      oneOnly: ['Change just one letter. Put the other letter back.', 'ஓர் எழுத்தை மட்டும் மாற்று. மற்ற எழுத்தைப் பழையபடி வை.'],
      real: ['{w} is a real word. Next step.', '{w} ஓர் உண்மையான சொல். அடுத்த படி.'],
      notReal: ['{w} is not a real word. Every step must be a real word, so try another letter.', '{w} உண்மையான சொல் அல்ல. ஒவ்வொரு படியும் உண்மையான சொல்லாக இருக்க வேண்டும்; வேறு எழுத்தை முயல்.'],
      lastOk: ['{w} is one letter away from {b}. Press Check.', '{w}, {b}-இலிருந்து ஓர் எழுத்து தூரம்தான். சரிபார் அழுத்து.'],
      lastFar: ['{w} is a real word, but it is not one letter away from {b}. Undo and try another path.', '{w} உண்மையான சொல், ஆனால் {b}-இலிருந்து ஓர் எழுத்து தூரத்தில் இல்லை. திரும்பப் பெற்று வேறு வழியை முயல்.'],
      reached: ['You reached {b}. Press Check.', '{b}-ஐ அடைந்துவிட்டாய். சரிபார் அழுத்து.'],
      line: ['Your sentence', 'உன் வாக்கியம்'], bank: ['Word tiles', 'சொல் ஓடுகள்'], dropHere: ['Drag or tap the words here', 'சொற்களை இங்கே இழு அல்லது தட்டு'],
      moveTip: ['Tap a word to move it. Drag to put it in a place. Arrow keys move a chosen word.', 'நகர்த்த ஒரு சொல்லைத் தட்டு. இடத்தில் வைக்க இழு. தேர்ந்த சொல்லை அம்புக்குறி விசைகள் நகர்த்தும்.'],
      who: ['who', 'யார்'], does: ['does', 'செய்வது'], what: ['what', 'எதை / எங்கே'],
      picOf: ['Picture clue', 'படக் குறிப்பு'], stop: ['full stop', 'முற்றுப்புள்ளி'],
    },
    h: {
      cross1: ['Start with the word you are surest of. Where words cross, they share a letter.', 'உனக்கு நன்கு தெரிந்த சொல்லில் தொடங்கு. சொற்கள் சந்திக்கும் இடத்தில் ஒரே எழுத்தைப் பகிர்கின்றன.'],
      cross2: ['{n} {dir} is {w}: {letters}.', '{n} {dir}: {w} ({letters}).'],
      cross3: ['Here is the full crossword.', 'முழுக் குறுக்கெழுத்து இதோ.'],
      search1: ['Words hide across (left to right) and down.', 'சொற்கள் குறுக்கே (இடமிருந்து வலம்) மற்றும் நெடுக்கே மறைந்துள்ளன.'],
      search1d: ['Words hide across, down and on the slant (diagonally).', 'சொற்கள் குறுக்கே, நெடுக்கே, சாய்வாக (diagonal) மறைந்துள்ளன.'],
      search2: ['{w} starts in row {r}, column {c}. Look for {f} there.', '{w} வரிசை {r}, நிரல் {c}-இல் தொடங்குகிறது. அங்கே {f}-ஐத் தேடு.'],
      search3: ['Here are all the words.', 'எல்லாச் சொற்களும் இதோ.'],
      un1: ['Say the word for the picture slowly. What is its first sound?', 'படத்தின் சொல்லை மெதுவாகச் சொல். அதன் முதல் ஒலி என்ன?'],
      un1t: ['Read the clue. What could it be? Then find its first letter.', 'குறிப்பைப் படி. அது என்னவாக இருக்கும்? பிறகு அதன் முதல் எழுத்தைக் கண்டுபிடி.'],
      un2: ['It starts with {f}.', 'இது {f} என்று தொடங்குகிறது.'],
      un3: ['The word is {w}: {letters}.', 'சொல் {w}: {letters}.'],
      lad1: ['Change only one letter in each step, and each step must be a real word.', 'ஒவ்வொரு படியிலும் ஓர் எழுத்தை மட்டும் மாற்று; ஒவ்வொரு படியும் உண்மையான சொல்லாக இருக்க வேண்டும்.'],
      lad2: ['First step: {a} → {b}. The {x} changes to {y}.', 'முதல் படி: {a} → {b}. {x} என்பது {y} ஆக மாறுகிறது.'],
      lad3: ['One way up the ladder: {chain}.', 'ஏணியில் ஏற ஒரு வழி: {chain}.'],
      jig1: ['Find the word with a capital letter. It goes first. The full stop goes last.', 'பெரிய எழுத்தில் தொடங்கும் சொல்லைக் கண்டுபிடி. அது முதலில் வரும். முற்றுப்புள்ளி கடைசியில் வரும்.'],
      jig2: ['Who is it about? {who}. What do they do? {does}.', 'யாரைப் பற்றியது? {who}. என்ன செய்கிறார்கள்? {does}.'],
      jig3: ['The sentence is: {s}', 'வாக்கியம்: {s}'],
      mis1: ['Say the word slowly and listen for each sound.', 'சொல்லை மெதுவாகச் சொல்லி, ஒவ்வொரு ஒலியையும் கவனி.'],
      mis1p: ['Look at the picture. Say its word slowly and listen for each sound.', 'படத்தைப் பார். அதன் சொல்லை மெதுவாகச் சொல்லி, ஒவ்வொரு ஒலியையும் கவனி.'],
      mis3: ['The missing part is {m}: {w}.', 'விடுபட்ட பகுதி {m}: {w}.'],
      com1: ['Think of a word you already know that starts with {a}.', '{a} என்று தொடங்கும், உனக்குத் தெரிந்த ஒரு சொல்லை நினைத்துப் பார்.'],
      com1b: ['Think of a word you already know that ends with {b}.', '{b} என்று முடியும், உனக்குத் தெரிந்த ஒரு சொல்லை நினைத்துப் பார்.'],
      com2: ['In Tamil, the new word means {ta}.', 'புதிய சொல்லின் தமிழ்ப் பொருள்: {ta}.'],
      com3: ['{a} + {b} = {c}.', '{a} + {b} = {c}.'],
    },
    y: {
      cross: ['Across words read from left to right. Down words read from top to bottom.', 'குறுக்குச் சொற்கள் இடமிருந்து வலமாகப் படிக்கப்படும். நெடுக்குச் சொற்கள் மேலிருந்து கீழாகப் படிக்கப்படும்.'],
      crossShare: ['Where two words cross, they share one letter, so one word helps you spell the other.', 'இரண்டு சொற்கள் சந்திக்கும் இடத்தில் ஓர் எழுத்தைப் பகிர்கின்றன; எனவே ஒரு சொல் மற்றதை எழுத உதவும்.'],
      crossWords: ['The words: {list}', 'சொற்கள்: {list}'],
      crossFix: ['Check these again: {list}', 'இவற்றை மீண்டும் பார்: {list}'],
      crossRule: ['Rule: across goes left to right, down goes top to bottom, and crossing words share a letter.', 'விதி: குறுக்கே இடமிருந்து வலம், நெடுக்கே மேலிருந்து கீழ்; சந்திக்கும் சொற்கள் ஓர் எழுத்தைப் பகிரும்.'],
      search: ['Find the first letter of a word, then look at the letters all around it for the second letter. Follow that line.', 'சொல்லின் முதல் எழுத்தைக் கண்டுபிடி; அதைச் சுற்றியுள்ள எழுத்துகளில் இரண்டாவது எழுத்தைத் தேடு. அந்த வரிசையைப் பின்பற்று.'],
      searchRule: ['Pattern: a word is a fixed order of letters. It reads the same along any straight line it hides in.', 'அமைப்பு: ஒரு சொல் என்பது எழுத்துகளின் நிலையான வரிசை. அது மறைந்திருக்கும் நேர்கோட்டில் அதே வரிசையில் படிக்கப்படும்.'],
      un: ['{scr} → {w}. Every letter is used once.', '{scr} → {w}. ஒவ்வோர் எழுத்தும் ஒரு முறை பயன்படுகிறது.'],
      unSound: ['Say the sounds in order: {sounds}.', 'ஒலிகளை வரிசையாகச் சொல்: {sounds}.'],
      unRule: ['Rule: the order of letters makes the word. The same letters in a new order can make nonsense, or a different word.', 'விதி: எழுத்துகளின் வரிசைதான் சொல்லை உருவாக்குகிறது. அதே எழுத்துகள் வேறு வரிசையில் பொருளற்றதாகவோ வேறு சொல்லாகவோ ஆகலாம்.'],
      lad: ['Each step changes just one letter: {chain}.', 'ஒவ்வொரு படியும் ஓர் எழுத்தை மட்டும் மாற்றுகிறது: {chain}.'],
      ladYou: ['Your ladder: {chain}.', 'உன் ஏணி: {chain}.'],
      ladRule: ['Rule: one letter changes at each step, and every step is a real word.', 'விதி: ஒவ்வொரு படியிலும் ஓர் எழுத்து மட்டும் மாறும்; ஒவ்வொரு படியும் உண்மையான சொல்.'],
      jigParts: ['{who} (who) + {does} (does) + {what} (what)', '{who} (யார்) + {does} (செய்வது) + {what} (எதை / எங்கே)'],
      jigParts2: ['{who} (who) + {does} (does)', '{who} (யார்) + {does} (செய்வது)'],
      jigCap: ['A sentence starts with a capital letter: {w}.', 'ஆங்கில வாக்கியம் பெரிய எழுத்தில் (capital letter) தொடங்கும்: {w}.'],
      jigStop: ['It ends with a full stop (.).', 'அது முற்றுப்புள்ளியில் (.) முடியும்.'],
      jigYou: ['You made: {s}', 'நீ அமைத்தது: {s}'],
      jigRule: ['Rule: a sentence starts with a capital letter, ends with a full stop, and goes who + does + what.', 'விதி: வாக்கியம் பெரிய எழுத்தில் தொடங்கி, முற்றுப்புள்ளியில் முடியும்; யார் + செய்வது + எதை என்ற வரிசையில் வரும்.'],
      mis: ['{parts} = {w}', '{parts} = {w}'],
      means: ['{w} means {ta}.', '{w} என்றால் {ta}.'],
      com: ['{a} + {b} = {c}. Two small words join to make one new word.', '{a} + {b} = {c}. இரண்டு சிறிய சொற்கள் சேர்ந்து ஒரு புதிய சொல் ஆகின்றன.'],
      comRule: ['Rule: a compound word is two words joined together, with no space between them.', 'விதி: கூட்டுச் சொல் (compound word) என்பது இடைவெளி இல்லாமல் சேர்ந்த இரண்டு சொற்கள்.'],
    },
    rule: {
      cvc: ['Rule: short words often go consonant, vowel, consonant. The vowel in the middle (a, e, i, o, u) gives the word its sound.', 'விதி: சிறிய சொற்கள் பெரும்பாலும் மெய், உயிர், மெய் என்று அமையும். நடுவில் உள்ள உயிரெழுத்து (a, e, i, o, u) சொல்லின் ஒலியைத் தரும்.'],
      silentE: ['Rule: an e at the end is silent, but it makes the vowel say its name: kit becomes kite.', 'விதி: கடைசியில் வரும் e ஒலிக்காது, ஆனால் உயிரெழுத்தைத் தன் பெயரைச் சொல்ல வைக்கும்: kit என்பது kite ஆகிறது.'],
      ck: ['Rule: after a short vowel, the /k/ sound at the end is spelt ck: duck, clock.', 'விதி: குறில் உயிருக்குப் பின் கடைசியில் வரும் /k/ ஒலி ck என எழுதப்படும்: duck, clock.'],
      double: ['Rule: some words double a letter, but two of the same letter still make one sound: ball, bell.', 'விதி: சில சொற்களில் ஓர் எழுத்து இரட்டிக்கும், ஆனால் இரண்டும் சேர்ந்து ஒரே ஒலி: ball, bell.'],
      aiay: ['Rule: ai and ay both say the long a. ai sits in the middle, ay comes at the end: rain, play.', 'விதி: ai, ay இரண்டும் நீண்ட a ஒலி. ai நடுவில் வரும், ay கடைசியில் வரும்: rain, play.'],
      eeea: ['Rule: ee and ea both often say the long e: tree, leaf.', 'விதி: ee, ea இரண்டும் பெரும்பாலும் நீண்ட e ஒலி: tree, leaf.'],
      sh: ['Rule: sh, ch and th are two letters that make one new sound: ship, chair, three.', 'விதி: sh, ch, th இரண்டு எழுத்துகள் சேர்ந்து ஒரு புதிய ஒலி: ship, chair, three.'],
      oaow: ['Rule: oa and ow can both say the long o: boat, snow.', 'விதி: oa, ow இரண்டும் நீண்ட o ஒலியைத் தரலாம்: boat, snow.'],
      igh: ['Rule: igh says the long i, and the g and h are silent: night, light.', 'விதி: igh நீண்ட i ஒலி; g, h ஒலிக்காது: night, light.'],
    },
    clue: {
      cat: ['A pet that says meow', 'மியாவ் என்று கத்தும் செல்லப் பிராணி'], dog: ['A pet that barks', 'குரைக்கும் செல்லப் பிராணி'], cow: ['It gives us milk', 'நமக்குப் பால் தரும் விலங்கு'],
      goat: ['It has a beard and eats leaves', 'தாடி உள்ள, இலை தின்னும் விலங்கு'], tiger: ['A big wild cat with stripes', 'வரிகள் உள்ள பெரிய காட்டுப் பூனை'], horse: ['You can ride it and it gallops', 'சவாரி செய்யலாம்; பாய்ந்து ஓடும்'],
      zebra: ['It looks like a horse with black and white stripes', 'கருப்பு வெள்ளை வரிகள் உள்ள, குதிரை போன்ற விலங்கு'], monkey: ['It swings in trees and loves bananas', 'மரங்களில் தாவும்; வாழைப்பழம் விரும்பும்'], rabbit: ['It has long ears and hops', 'நீண்ட காதுகள்; துள்ளித் துள்ளி ஓடும்'],
      crow: ['A black bird that caws', 'கா கா என்று கத்தும் கருப்புப் பறவை'], hen: ['A farm bird that lays eggs', 'முட்டையிடும் பண்ணைப் பறவை'], duck: ['A bird that swims and quacks', 'நீந்தும், குவாக் என்று கத்தும் பறவை'],
      ant: ['A tiny insect that carries food', 'உணவைச் சுமந்து செல்லும் சிறு பூச்சி'], bee: ['It makes honey', 'தேன் சேர்க்கும் பூச்சி'], snail: ['It carries its shell and moves slowly', 'ஓட்டைச் சுமந்து மெதுவாக நகரும்'],
      frog: ['It jumps and croaks near ponds', 'குளத்தருகே தாவிக் கத்தும்'], parrot: ['A green bird that can copy words', 'சொற்களைத் திருப்பிச் சொல்லும் பச்சைப் பறவை'], peacock: ['A bird with a long blue and green tail', 'நீண்ட நீல-பச்சைத் தோகை உள்ள பறவை'],
      apple: ['A round, crunchy red fruit', 'உருண்டையான, மொறுமொறுப்பான சிவப்புப் பழம்'], mango: ['The king of fruits, sweet and yellow', 'பழங்களின் அரசன்; இனிப்பான மஞ்சள் பழம்'], lemon: ['A sour yellow fruit', 'புளிப்பான மஞ்சள் பழம்'],
      banana: ['A long yellow fruit that you peel', 'தோலுரித்துச் சாப்பிடும் நீண்ட மஞ்சள் பழம்'], orange: ['A round fruit, and a colour too', 'உருண்டையான பழம்; ஒரு நிறத்தின் பெயரும் கூட'], onion: ['Cutting it makes your eyes water', 'நறுக்கும்போது கண்ணில் நீர் வரவைக்கும்'],
      peas: ['Small green balls that grow in a pod', 'நெற்றுக்குள் வளரும் சிறிய பச்சை உருண்டைகள்'], carrot: ['An orange vegetable that rabbits like', 'முயல் விரும்பும் ஆரஞ்சு நிறக் காய்'], tomato: ['A red vegetable we put in rasam', 'ரசத்தில் சேர்க்கும் சிவப்புக் காய்'],
      potato: ['It grows under the ground; we make chips from it', 'மண்ணுக்கடியில் வளரும்; இதிலிருந்து சிப்ஸ் செய்வோம்'], chair: ['You sit on it', 'இதில் உட்காருவோம்'], table: ['You eat or write at it', 'இதன் முன் அமர்ந்து சாப்பிடுவோம், எழுதுவோம்'],
      bed: ['You sleep on it', 'இதில் தூங்குவோம்'], cup: ['You drink tea from it', 'இதில் தேநீர் குடிப்போம்'], plate: ['You put rice on it', 'இதில் சோறு வைப்போம்'],
      spoon: ['You eat curd with it', 'இதனால் தயிர் சாப்பிடுவோம்'], clock: ['It tells the time', 'நேரம் காட்டும்'], lamp: ['It gives light', 'வெளிச்சம் தரும்'],
      door: ['You open it to go into a room', 'அறைக்குள் போகத் திறப்போம்'], window: ['You look outside through it', 'இதன் வழியே வெளியே பார்ப்போம்'], bus: ['A big vehicle that carries many people', 'பலரை ஏற்றிச் செல்லும் பெரிய வண்டி'],
      car: ['Four wheels; it carries a family', 'நான்கு சக்கரங்கள்; ஒரு குடும்பத்தை ஏற்றிச் செல்லும்'], train: ['It runs on rails', 'தண்டவாளத்தில் ஓடும்'], boat: ['It floats on water', 'தண்ணீரில் மிதந்து செல்லும்'],
      van: ['A small vehicle for carrying boxes', 'பெட்டிகளை ஏற்றிச் செல்லும் சிறு வண்டி'], truck: ['A big vehicle that carries goods', 'சரக்குகளை ஏற்றிச் செல்லும் பெரிய வண்டி'], ship: ['A very big boat on the sea', 'கடலில் செல்லும் மிகப் பெரிய கலம்'],
      bicycle: ['Two wheels and two pedals', 'இரண்டு சக்கரங்கள், இரண்டு மிதிகள்'], sun: ['It shines in the day', 'பகலில் ஒளிரும்'], moon: ['It shines at night', 'இரவில் ஒளிரும்'],
      star: ['It twinkles in the night sky', 'இரவு வானில் மின்னும்'], tree: ['It is tall, with leaves and branches', 'இலைகளும் கிளைகளும் உள்ள உயரமான தாவரம்'], river: ['Water that flows to the sea', 'கடலை நோக்கி ஓடும் நீர்'],
      hill: ['Land that is higher than the land around it', 'சுற்றியுள்ள நிலத்தைவிட உயரமான நிலம்'], sea: ['Big salty water with waves', 'அலைகள் உள்ள பெரிய உப்பு நீர்'], cloud: ['It floats in the sky and brings rain', 'வானில் மிதந்து மழை தரும்'],
      ball: ['You kick it or throw it', 'இதை உதைப்போம், எறிவோம்'], kite: ['It flies on a string in the wind', 'நூலில் கட்டிக் காற்றில் பறக்கவிடுவோம்'], book: ['You read it', 'இதைப் படிப்போம்'],
      bag: ['You carry your books in it', 'புத்தகங்களை இதில் சுமப்போம்'], doll: ['A toy that looks like a little person', 'சிறு மனிதர் போலத் தோன்றும் விளையாட்டுப் பொருள்'], drum: ['You beat it to make music', 'தட்டி இசை எழுப்புவோம்'],
      top: ['A toy that spins on the floor', 'தரையில் சுழலும் விளையாட்டுப் பொருள்'], swing: ['You sit on it and go to and fro', 'உட்கார்ந்து முன்னும் பின்னும் ஆடுவோம்'], pencil: ['You write and draw with it', 'எழுதவும் வரையவும் பயன்படும்'],
      school: ['You go there to learn', 'கற்கச் செல்லும் இடம்'], key: ['It opens a lock', 'பூட்டைத் திறக்கும்'], nest: ['A home that a bird builds', 'பறவை கட்டும் வீடு'],
      fox: ['A clever wild animal with a bushy tail', 'அடர்ந்த வால் உள்ள, புத்திசாலிக் காட்டு விலங்கு'], yak: ['A hairy animal of the cold mountains', 'குளிர் மலைகளில் வாழும், அடர்ந்த முடி உள்ள விலங்கு'],
    },
  } });
  const CLUED = Object.keys(I18N.L.wp.clue);
  const clue = w => t('wp.clue.' + w);

  // ---------- a small dictionary: every ladder step and every distractor is checked against it ----------
  const DICT = new Set((
    'act add age ago aid aim air all and ant any ape arm art ask ate bad bag ban bat bed bee beg bet big bin bit bog bow box boy bud bug bun bus but buy cab can cap car cat cog cop cot cow cry cub cup cut dad day den did dig dim dip dog dot dry dug ear eat egg elf end eye fan far fat fed few fig fin fit fix fly fog for fox fun fur gap gas get got gum guy had ham has hat hay hen her hid him hip his hit hog hop hot how hug hum hut ice ink jam jar jaw jet job jog joy jug key kid kit lab lap law lay led leg let lid lie lip lit log lot low mad man map mat may men met mix mob mom mop mud mug nap net new nod not now nut oak odd off oil old one our out owl own pad pal pan pat paw pay pea peg pen pet pie pig pin pit pod pop pot pun pup put rag ram ran rat raw red rib rid rim rip rob rod rot row rub rug run sad sag sat saw say sea see set sew she shy sip sit six sky sob son sow spy sum sun tab tag tan tap tar tea ten the tie tin tip toe ton too top toy try tub tug two use van vet wag was wax way web wed wet who why wig win wit wok won wow yak yam yes yet you zip zoo ' +
    'able back bake ball band bank bark barn base bath bead beak bean bear beat bell belt best bike bird bite blue boat bold bolt bone book boot bore bowl cake call calm came camp card care cart case cash cast cave chat chin chip chop clap clay coat code cold comb cone cook cool cord core corn cost crab crow cube cute dark dash date deep deer desk dice dish dive dock doll door dove down drum duck dust each east easy fall farm fast feet fell find fine fire fish five flag flat flip food foot fork form four frog full game gate gave gift girl give glad goat gold good grab grew grow hair half hall hand hard have head heal hear heat help herd here hide high hill hold hole home hood hook hope horn hose hunt iron jump keep kind king kite knee lake lamp land last late lazy leaf left lick life lift like line lion list live load lock long look loud love made mail main make many mark mask meat milk mind mine mint mist mole moon more most moth move much nest nice nine nose note once open pack page pail pain pair pale palm park part past path peel pick pile pine pink pipe plan play plum pole pond pool poor pull push rain read real rest rice rich ride ring road rock roof room root rope rose sail sale salt same sand save seal seat seed sell send ship shoe shop show sick side sing sink size skip slow snow soap sock soft song soon soup star stay step stop tail take tale talk tall tank tape tell tent than that them then they thin this tide time tiny toad told tool town tree trip tune turn wait wake walk wall want ward warm wash wave week well went west what when whip wide wild will wind wing wise wish with wolf wood word wore work worm yard yarn year yell'
  ).split(' '));
  Object.keys(D.WORDS).forEach(w => DICT.add(w)); Object.values(D.PATTERNS).forEach(p => p.words.forEach(w => DICT.add(w)));
  Object.entries(D.CVC).forEach(([w, a]) => { DICT.add(w); a.forEach(x => DICT.add(x)); }); D.DOLCH_PRE.concat(D.DOLCH_PRIMER).forEach(w => DICT.add(w.toLowerCase()));
  const oneAway = (a, b) => a.length === b.length && [...a].filter((c, i) => c !== b[i]).length === 1;

  // ---------- shared bits ----------
  const kbdHtml = () => `<div class="wp-kbd" role="group" aria-label="${t('wp.kbd')}">${LETTERS.map(c => `<button type="button" data-k="${c}" lang="en" aria-label="${c}">${c}</button>`).join('')}<button type="button" data-k="del" class="del" aria-label="${t('wp.del')}"><svg class="k-icon" aria-hidden="true"><use href="#i-del"/></svg></button></div><p class="kbd-note">${t('wp.kbdNote')}</p>`;
  // physical keys while this puzzle is on screen; removed when the element leaves the page
  function onKeys(el, fn) {
    const h = e => { if (!el.isConnected) { document.removeEventListener('keydown', h); return; } if (done() || e.ctrlKey || e.metaKey || e.altKey || document.querySelector('.k-dialog, dialog[open]')) return; fn(e); };
    document.addEventListener('keydown', h);
  }
  const finish = el => { el.querySelectorAll('button').forEach(b => b.disabled = true); el.querySelectorAll('.wp-kbd,.kbd-note,.wp-tip').forEach(x => x.hidden = true); };
  const miniGrid = (n, cells, cls = '') => `<div class="wp-mini ${cls}" style="--n:${n}" aria-hidden="true">${cells.map(c => c == null ? '<i class="void"></i>' : `<i class="${c.on ? 'on' : ''}">${esc(c.ch || '')}</i>`).join('')}</div>`;
  const chain = ws => ws.map(W).join(' → ');
  const meansStep = w => taMean(w) ? [{ text: t('wp.y.means', { w: W(w), ta: `<span lang="ta">${taMean(w)}</span>` }) }] : [];

  // ======================================================================
  // 1. Picture crossword (5×5, generated from one theme's vocabulary)
  // ======================================================================
  const THEME_IDS = ['animals', 'creatures', 'home', 'travel', 'outside', 'play'];
  function crossBuild(r, pool, n, want) {
    let best = null;
    for (let a = 0; a < 40 && !(best && best.placed.length >= want); a++) {
      const words = r.shuffle(pool), g = Array(n * n).fill(''), use = Array(n * n).fill(0), placed = [];
      const fits = (w, row, col, d) => {
        const dr = d, dc = 1 - d, er = row + dr * (w.length - 1), ec = col + dc * (w.length - 1);
        if (row < 0 || col < 0 || er >= n || ec >= n) return -1;
        const br = row - dr, bc = col - dc; if (br >= 0 && bc >= 0 && g[br * n + bc]) return -1;
        const ar = er + dr, ac = ec + dc; if (ar < n && ac < n && g[ar * n + ac]) return -1;
        let cross = 0;
        for (let i = 0; i < w.length; i++) {
          const rr = row + dr * i, cc = col + dc * i, k = rr * n + cc;
          if (g[k]) { if (g[k] !== w[i] || use[k] & (d ? 2 : 1)) return -1; cross++; }
          else { const p = [[rr + dc, cc + dr], [rr - dc, cc - dr]]; for (const [pr, pc] of p) if (pr >= 0 && pc >= 0 && pr < n && pc < n && g[pr * n + pc]) return -1; }
        }
        return cross < w.length ? cross : -1;
      };
      const put = (w, row, col, d) => { for (let i = 0; i < w.length; i++) { const k = (row + d * i) * n + col + (1 - d) * i; g[k] = w[i]; use[k] |= d ? 2 : 1; } placed.push({ w, row, col, d }); };
      const first = words[0]; const d0 = r.int(0, 1);
      put(first, d0 ? r.int(0, n - first.length) : r.int(0, n - 1), d0 ? r.int(0, n - 1) : r.int(0, n - first.length), d0);
      for (const w of words.slice(1)) {
        if (placed.length >= want) break;
        const opts = [];
        for (let d = 0; d < 2; d++) for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) if (fits(w, row, col, d) > 0) opts.push([row, col, d]);
        if (opts.length) put(w, ...r.pick(opts));
      }
      if (!best || placed.length > best.placed.length) best = { g: [...g], placed: [...placed] };
    }
    // crop to the used rows and columns, then number the words in reading order
    const used = best.g.map((c, i) => c ? i : -1).filter(i => i >= 0), rs = used.map(i => Math.floor(i / n)), cs = used.map(i => i % n);
    const r0 = Math.min(...rs), c0 = Math.min(...cs), w = Math.max(...cs) - c0 + 1, h = Math.max(...rs) - r0 + 1, g2 = Array(w * h).fill('');
    used.forEach(i => { g2[(Math.floor(i / n) - r0) * w + (i % n) - c0] = best.g[i]; });
    best.g = g2; best.w = w; best.h = h; best.placed.forEach(p => { p.row -= r0; p.col -= c0; });
    const starts = [...new Set(best.placed.map(p => p.row * w + p.col))].sort((a, b) => a - b);
    best.placed.forEach(p => { p.num = starts.indexOf(p.row * w + p.col) + 1; p.cells = [...p.w].map((_, i) => (p.row + p.d * i) * w + p.col + (1 - p.d) * i); });
    best.placed.sort((a, b) => a.d - b.d || a.num - b.num);
    best.nums = {}; best.placed.forEach(p => { best.nums[p.cells[0]] = p.num; });
    return best;
  }
  Engine.skill({ id: 'wp.crossword', subject: S, topic: 'wordpuzzles', name: 'wp.skill.crossword', bands: { young: [1, 2], older: [1, 4] }, gen(l, r, ctx) {
    const young = ctx.band === 'young', usePics = young || l === 1, n = 5;
    const maxLen = young ? (l === 1 ? 3 : 4) : [4, 5, 5, 5][l - 1], want = young ? l + 1 : [3, 3, 4, 5][l - 1];
    const ok = w => /^[a-z]+$/.test(w) && w.length >= 3 && w.length <= maxLen && (usePics ? pic(w) : CLUED.includes(w)) && (!usePics || young || CLUED.includes(w));
    const themes = THEME_IDS.filter(th => Object.keys(D.THEMES[th].words).filter(ok).length >= want + 1);
    const th = r.pick(themes.length ? themes : THEME_IDS);
    let pool = Object.keys(D.THEMES[th].words).filter(ok);
    if (pool.length < want + 1) pool = [...new Set([...pool, ...Object.keys(D.WORDS).filter(ok)])];
    const X = crossBuild(r, pool, n, want), P = X.placed, sol = X.g, nc = X.w, nr = X.h;
    const dirName = d => t(d ? 'wp.down' : 'wp.across');
    const val = Array(nc * nr).fill('');
    let cur = { p: 0, k: P[0].cells[0] }, locked = false;
    const solvedVis = miniGrid(nc, sol.map((c, i) => c ? { ch: c, num: X.nums[i] } : null));
    const list = P.map(p => `${p.num} ${dirName(p.d)}: ${W(p.w)}`).join(', ');
    const q = { kind: 'custom', prompt: t(usePics ? 'wp.q.crossPic' : 'wp.q.crossText'), boardClass: 'wp',
      hints: ladder(t('wp.h.cross1'), t('wp.h.cross2', { n: P[0].num, dir: dirName(P[0].d), w: W(P[0].w), letters: [...P[0].w].join('-') }), { text: t('wp.h.cross3'), vis: solvedVis }), hintRevealsAnswer: true,
      answerText: list,
      mount(el, api) {
        el.innerHTML = `<div class="board wp-board"><div class="wp-cross" style="--n:${nc}" role="grid" aria-label="${t('wp.grid')}">${sol.map((c, i) => c
          ? `<button type="button" class="pz-cell wp-cell" data-i="${i}" tabindex="-1">${X.nums[i] ? `<span class="wp-num" aria-hidden="true">${X.nums[i]}</span>` : ''}<span class="wp-ch" lang="en"></span></button>`
          : '<span class="wp-void" aria-hidden="true"></span>').join('')}</div></div>
          <p class="eyebrow">${t('wp.clues')}</p>
          <div class="wp-clues ${usePics ? 'pics' : ''}" role="group" aria-label="${t('wp.clues')}">${P.map((p, j) => `<button type="button" class="wp-clue" data-p="${j}" aria-label="${t('wp.clueN', { n: p.num, dir: dirName(p.d), len: p.w.length })}${usePics ? '' : ': ' + esc(clue(p.w))}">
            <span class="wp-cnum">${p.num}<small>${dirName(p.d)}</small></span>${usePics ? img(p.w, 'wp-cpic') : ''}<span class="wp-ctext">${usePics ? `<span class="wp-len">${'_ '.repeat(p.w.length).trim()}</span>` : esc(clue(p.w))}</span></button>`).join('')}</div>
          ${kbdHtml()}`;
        const cells = [...el.querySelectorAll('.wp-cell')], byI = i => el.querySelector(`.wp-cell[data-i="${i}"]`);
        const wordsAt = k => P.map((p, j) => p.cells.includes(k) ? j : -1).filter(j => j >= 0);
        const update = (focus = true) => {
          const hl = P[cur.p].cells;
          cells.forEach(b => { const i = +b.dataset.i, rr = Math.floor(i / nc) + 1, cc = i % nc + 1; b.querySelector('.wp-ch').textContent = val[i];
            b.classList.toggle('wp-hl', hl.includes(i)); b.classList.toggle('sel', i === cur.k); b.tabIndex = i === cur.k ? 0 : -1;
            b.setAttribute('aria-label', `${X.nums[i] ? X.nums[i] + ', ' : ''}${t('wp.cell', { r: rr, c: cc })}: ${val[i] || t('wp.empty')}`); });
          el.querySelectorAll('.wp-clue').forEach(b => { const p = P[+b.dataset.p]; b.setAttribute('aria-pressed', +b.dataset.p === cur.p); b.classList.toggle('full', p.cells.every(i => val[i])); });
          if (focus) byI(cur.k)?.focus({ preventScroll: true });
          api.ready(sol.every((c, i) => !c || val[i]));
        };
        const step = dir => { const cs = P[cur.p].cells, j = cs.indexOf(cur.k) + dir; if (j >= 0 && j < cs.length) cur.k = cs[j]; };
        const type = ch => { if (done() || locked) return; val[cur.k] = ch; step(1); update(); };
        const del = () => { if (done() || locked) return; if (!val[cur.k]) step(-1); val[cur.k] = ''; update(); };
        const move = (dr, dc) => { let rr = Math.floor(cur.k / nc), cc = cur.k % nc; for (let s = 0; s < n; s++) { rr += dr; cc += dc; if (rr < 0 || cc < 0 || rr >= nr || cc >= nc) return; const k = rr * nc + cc; if (sol[k]) { cur.k = k; const ws = wordsAt(k), want = dr ? 1 : 0; cur.p = ws.find(j => P[j].d === want) ?? ws[0]; update(); return; } } };
        cells.forEach(b => b.onclick = () => { if (done()) return; const k = +b.dataset.i, ws = wordsAt(k);
          if (k === cur.k && ws.length > 1) cur.p = ws.find(j => j !== cur.p); else if (!ws.includes(cur.p)) cur.p = ws[0]; cur.k = k; update(); });
        el.querySelectorAll('.wp-clue').forEach(b => b.onclick = () => { if (done()) return; cur.p = +b.dataset.p; const cs = P[cur.p].cells; cur.k = cs.find(i => !val[i]) ?? cs[0]; update(); });
        el.querySelector('.wp-kbd').onclick = e => { const b = e.target.closest('button'); if (!b) return; b.dataset.k === 'del' ? del() : type(b.dataset.k); };
        onKeys(el, e => {
          if (/^[a-zA-Z]$/.test(e.key)) { e.preventDefault(); type(e.key.toLowerCase()); }
          else if (e.key === 'Backspace') { e.preventDefault(); del(); }
          else if (e.key.startsWith('Arrow') && el.contains(document.activeElement) && document.activeElement.classList.contains('wp-cell')) { e.preventDefault(); ({ ArrowUp: () => move(-1, 0), ArrowDown: () => move(1, 0), ArrowLeft: () => move(0, -1), ArrowRight: () => move(0, 1) })[e.key](); }
        });
        q._lock = () => { locked = true; finish(el); cells.forEach(b => { const i = +b.dataset.i; b.classList.remove('sel'); b.classList.toggle('bad', val[i] !== sol[i]); }); };
        update(false);
      },
      check() { q._lock?.(); const wrong = P.filter(p => p.cells.some(i => val[i] !== sol[i])); q._wrong = wrong; return { correct: !wrong.length, given: P.map(p => p.cells.map(i => val[i] || '_').join('')).join(', ') }; },
    };
    const whyBase = () => [{ text: t('wp.y.cross'), vis: solvedVis }, { text: t('wp.y.crossShare') }, { text: t('wp.y.crossWords', { list: P.map(p => `${W(p.w)}${meanOf(p.w)}`).join(', ') }) }];
    q.why = { steps: whyBase(), rule: t('wp.y.crossRule'), photo: credit(P[0].w) };
    q.whyFor = () => ({ steps: [...(q._wrong?.length ? [{ text: t('wp.y.crossFix', { list: q._wrong.map(p => `${p.num} ${dirName(p.d)}: ${W(p.w)}`).join(', ') }) }] : []), ...whyBase()], rule: t('wp.y.crossRule'), photo: credit(P[0].w) });
    q.say = [ui(q.prompt), ...(usePics ? [] : P.map(p => ui(`${p.num} ${dirName(p.d)}. ${clue(p.w)}.`)))];
    return q;
  } });

  // ======================================================================
  // 2. Word search (themed words; across + down for young, plus diagonals for older)
  // ======================================================================
  function searchBuild(r, words, n, dirs) {
    for (let a = 0; a < 60; a++) {
      const g = Array(n * n).fill(''), placed = []; let ok = true;
      for (const w of words) {
        let put = false;
        for (let k = 0; k < 120 && !put; k++) {
          const [dr, dc] = r.pick(dirs), row = r.int(0, n - 1), col = r.int(0, n - 1), er = row + dr * (w.length - 1), ec = col + dc * (w.length - 1);
          if (er < 0 || ec < 0 || er >= n || ec >= n) continue;
          const cells = [...w].map((_, i) => (row + dr * i) * n + col + dc * i);
          if (cells.some((c, i) => g[c] && g[c] !== w[i])) continue;
          cells.forEach((c, i) => g[c] = w[i]); placed.push({ w, cells, dir: [dr, dc] }); put = true;
        }
        if (!put) { ok = false; break; }
      }
      if (ok) { const fill = 'abcdefghiklmnoprstuwy'; for (let i = 0; i < g.length; i++) if (!g[i]) g[i] = r.pick(fill.split('')); return { g, placed }; }
    }
    return searchBuild(r, words.slice(0, -1), n, dirs);
  }
  Engine.skill({ id: 'wp.search', subject: S, topic: 'wordpuzzles', name: 'wp.skill.search', bands: { young: [1, 2], older: [1, 4] }, gen(l, r, ctx) {
    const young = ctx.band === 'young', n = young ? 5 : 6;
    const count = young ? [3, 4][l - 1] : [4, 4, 5, 6][l - 1], maxLen = young ? (l === 1 ? 3 : 4) : n;
    const dirs = young || l === 1 ? [[0, 1], [1, 0]] : l === 2 ? [[0, 1], [1, 0], [1, 1]] : [[0, 1], [1, 0], [1, 1], [-1, 1]];
    const ok = w => /^[a-z]+$/.test(w) && w.length >= 3 && w.length <= maxLen && pic(w);
    const themes = THEME_IDS.filter(th => Object.keys(D.THEMES[th].words).filter(ok).length >= count);
    const th = r.pick(themes.length ? themes : ['animals']);
    let pool = Object.keys(D.THEMES[th].words).filter(ok); if (pool.length < count) pool = [...new Set([...pool, ...Object.keys(D.WORDS).filter(ok)])];
    const words = r.shuffle(pool).slice(0, count).sort((a, b) => b.length - a.length);
    const X = searchBuild(r, words, n, dirs), P = X.placed, g = X.g;
    const found = new Set(); let start = null, locked = false;
    const allVis = miniGrid(n, g.map((ch, i) => ({ ch, on: P.some(p => p.cells.includes(i)) })), 'search');
    const p0 = P[0], r0 = Math.floor(p0.cells[0] / n) + 1, c0 = p0.cells[0] % n + 1;
    const q = { kind: 'custom', prompt: t('wp.q.search', { n: P.length }), boardClass: 'wp',
      hints: ladder(t(dirs.length > 2 ? 'wp.h.search1d' : 'wp.h.search1'), t('wp.h.search2', { w: W(p0.w), r: r0, c: c0, f: W(p0.w[0]) }), { text: t('wp.h.search3'), vis: allVis }), hintRevealsAnswer: true,
      answerText: P.map(p => W(p.w)).join(', '),
      mount(el, api) {
        el.innerHTML = `<div class="board wp-board"><div class="wp-search" style="--n:${n}" role="grid" aria-label="${t('wp.sgrid')}">${g.map((ch, i) => `<button type="button" class="pz-cell wp-scell" data-i="${i}" tabindex="${i ? -1 : 0}" lang="en" aria-label="${ch}, ${t('wp.cell', { r: Math.floor(i / n) + 1, c: i % n + 1 })}">${ch}</button>`).join('')}</div></div>
          <p class="wp-msg" aria-live="polite"></p>
          <ul class="wp-words" aria-label="${t('wp.clues')}">${P.map((p, j) => `<li data-j="${j}">${img(p.w, 'wp-wpic')}<span lang="en">${esc(p.w)}</span></li>`).join('')}</ul>`;
        const grid = el.querySelector('.wp-search'), cells = [...el.querySelectorAll('.wp-scell')], msg = el.querySelector('.wp-msg');
        const line = (a, b) => { const ar = Math.floor(a / n), ac = a % n, br = Math.floor(b / n), bc = b % n, dr = Math.sign(br - ar), dc = Math.sign(bc - ac), len = Math.max(Math.abs(br - ar), Math.abs(bc - ac));
          if (!(ar === br || ac === bc || Math.abs(br - ar) === Math.abs(bc - ac))) return null; return Array.from({ length: len + 1 }, (_, i) => (ar + dr * i) * n + ac + dc * i); };
        const paint = (preview = []) => { cells.forEach((b, i) => { b.classList.toggle('wp-found', P.some((p, j) => found.has(j) && p.cells.includes(i))); b.classList.toggle('sel', i === start || preview.includes(i)); b.setAttribute('aria-pressed', i === start); });
          el.querySelectorAll('.wp-words li').forEach(li => li.classList.toggle('done', found.has(+li.dataset.j)));
          api.ready(found.size > 0); };
        const tryLine = cs => {
          if (!cs || cs.length < 2) return false;
          const s = cs.map(i => g[i]).join(''), j = P.findIndex((p, k) => !found.has(k) && (p.w === s || p.w === [...s].reverse().join('')) && p.cells.length === cs.length && p.cells.every(c => cs.includes(c)));
          if (j < 0) { msg.textContent = t('wp.ui.notWord'); return false; }
          found.add(j); msg.innerHTML = `${t('wp.ui.foundWord', { w: W(P[j].w) })} ${t('wp.ui.found', { a: found.size, b: P.length })}${meanOf(P[j].w)}`; say(P[j].w); return true;
        };
        const tap = i => { if (done() || locked) return; if (start == null) { start = i; msg.textContent = ''; } else if (start === i) start = null; else { tryLine(line(start, i)); start = null; } paint(); };
        // drag: pointer down on a cell, move across, release on the last letter
        let drag = null;
        grid.addEventListener('pointerdown', e => { const b = e.target.closest('.wp-scell'); if (!b || done() || locked) return; drag = { a: +b.dataset.i, moved: false, id: e.pointerId }; grid.setPointerCapture?.(e.pointerId); e.preventDefault(); });
        grid.addEventListener('pointermove', e => { if (!drag) return; const b = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.wp-scell'); if (!b) return; const i = +b.dataset.i; if (i !== drag.a) drag.moved = true; drag.b = i; if (drag.moved) { start = null; paint(line(drag.a, i) || [drag.a]); } });
        const up = () => { if (!drag) return; const d = drag; drag = null; if (d.moved && d.b != null && d.b !== d.a) { tryLine(line(d.a, d.b)); start = null; paint(); } else tap(d.a); };
        grid.addEventListener('pointerup', up); grid.addEventListener('pointercancel', () => { drag = null; paint(); });
        cells.forEach((b, i) => {
          b.onclick = e => { if (e.detail === 0) tap(i); };     // keyboard Enter / Space (pointer taps are handled above)
          b.onkeydown = e => { const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: n, ArrowUp: -n }[e.key]; if (!d) return; e.preventDefault(); const j = i + d; if (j < 0 || j >= n * n || (Math.abs(d) === 1 && Math.floor(j / n) !== Math.floor(i / n))) return; cells.forEach(c => c.tabIndex = -1); cells[j].tabIndex = 0; cells[j].focus(); };
        });
        q._lock = () => { locked = true; finish(el); };
        paint();
      },
      check() { q._lock?.(); return { correct: found.size === P.length, given: [...found].map(j => P[j].w).join(', ') }; },
      why: { steps: [{ text: t('wp.y.search'), vis: allVis }, ...P.slice(0, 4).map(p => ({ text: `${W(p.w)}${meanOf(p.w)}` }))], rule: t('wp.y.searchRule'), photo: credit(P[0].w) },
    };
    q.say = [ui(q.prompt), ...P.map(p => en(p.w))];
    return q;
  } });

  // ======================================================================
  // 3. Unscramble (tap letter tiles into order; picture hint for young)
  // ======================================================================
  const UNS = [
    ['cat', 'dog', 'cow', 'hen', 'ant', 'bee', 'bus', 'car', 'van', 'sun', 'bed', 'cup', 'bag', 'top', 'key', 'fox', 'yak', 'sea'],
    ['goat', 'frog', 'duck', 'crow', 'lamp', 'door', 'boat', 'ship', 'moon', 'star', 'tree', 'hill', 'ball', 'kite', 'book', 'doll', 'drum', 'nest', 'peas'],
    ['tiger', 'horse', 'zebra', 'snail', 'apple', 'mango', 'lemon', 'onion', 'chair', 'table', 'plate', 'spoon', 'clock', 'train', 'truck', 'river', 'cloud', 'swing'],
    ['monkey', 'rabbit', 'parrot', 'banana', 'orange', 'carrot', 'tomato', 'potato', 'pencil', 'school', 'window', 'bicycle', 'peacock'],
  ];
  Engine.skill({ id: 'wp.unscramble', subject: S, topic: 'wordpuzzles', name: 'wp.skill.unscramble', bands: { young: [1, 2], older: [1, 4] }, gen(l, r, ctx) {
    const young = ctx.band === 'young', withPic = young || l <= 2;
    const pool = UNS[l - 1].filter(w => withPic ? pic(w) : CLUED.includes(w)), w = r.pick(pool.length ? pool : UNS[0]);
    let tiles = r.shuffle([...w]); for (let k = 0; k < 6 && tiles.join('') === w; k++) tiles = r.shuffle([...w]);
    if (tiles.join('') === w) tiles = [...w].reverse();
    const scr = tiles.join(' ');
    return { kind: 'tiles', prompt: t('wp.q.unscramble'), tiles, answer: w, answerText: W(w),
      visual: withPic && pic(w) ? `<div class="wordpic">${img(w)}</div>` : `<div class="wp-cluecard"><p class="eyebrow">${t('wp.clues')}</p><p>${esc(clue(w))}</p></div>`, boardClass: withPic ? '' : 'light',
      say: [ui(t('wp.q.unscramble')), ...(withPic ? [] : [ui(clue(w))])],
      hints: ladder(t(withPic ? 'wp.h.un1' : 'wp.h.un1t'), t('wp.h.un2', { f: W(w[0]) }), t('wp.h.un3', { w: W(w), letters: [...w].join('-') })), hintRevealsAnswer: true,
      why: { steps: [{ text: t('wp.y.un', { scr: `<span lang="en">${esc(scr)}</span>`, w: W(w) }) }, { text: t('wp.y.unSound', { sounds: `<span lang="en">${[...w].join(' · ')}</span>` }) }, ...meansStep(w)], rule: t('wp.y.unRule'), photo: credit(w) } };
  } });

  // ======================================================================
  // 4. Word ladder (older): change one letter at a time; every step is a real word
  // ======================================================================
  const LADDERS = [
    ['hot hat cat', 'pig pin pen', 'sun bun bus', 'cup pup pop', 'bed bad bag', 'dog dot hot', 'map mat cat', 'hen ten tan'],
    ['cat cot dot dog', 'pig big bag bat', 'sun sin pin pen', 'hen pen pin pig', 'cup pup pop top', 'bus bun ban van', 'fox box bow cow', 'man mat hat hot'],
    ['cat hat hot hog dog', 'sun sin tin tip top', 'hen pen pan man map', 'bug big bag rag rat', 'cup cap cat bat bit', 'bed bad bat cat cot'],
    ['fish dish dash cash', 'ship shop stop step', 'book look lock sock', 'ball bell tell tall', 'cold cord card ward warm', 'pole hole hold gold', 'wish wash cash case'],
  ].map(a => a.map(s => s.split(' ')).filter(c => c.every(w => DICT.has(w)) && c.every((w, i) => !i || oneAway(c[i - 1], w))));
  Engine.skill({ id: 'wp.ladder', subject: S, topic: 'wordpuzzles', name: 'wp.skill.ladder', bands: { young: [1, 1], older: [1, 4] }, gen(l, r) {
    const C = r.pick(LADDERS[l - 1]), A = C[0], B = C[C.length - 1], k = C.length - 2, L = A.length;
    const rungs = [A]; let cur = [...A], sel = null, locked = false;
    const at = () => rungs.length;                    // index of the rung being edited (1..k)
    const diffPos = (a, b) => [...a].findIndex((c, i) => c !== b[i]);
    const markChain = ws => ws.map((w, i) => { const p = i ? diffPos(ws[i - 1], w) : -1; return `<span lang="en">${[...w].map((c, j) => j === p ? `<b class="wp-chg">${c}</b>` : c).join('')}</span>`; }).join(' → ');
    const q = { kind: 'custom', prompt: t('wp.q.ladder', { a: W(A), b: W(B) }), boardClass: 'wp',
      say: [ui(t('wp.q.ladder', { a: '', b: '' })), en(A), en(B)],
      hints: ladder(t('wp.h.lad1'), t('wp.h.lad2', { a: W(A), b: W(C[1]), x: W(A[diffPos(A, C[1])]), y: W(C[1][diffPos(A, C[1])]) }), t('wp.h.lad3', { chain: markChain(C) })), hintRevealsAnswer: true,
      answerText: chain(C),
      mount(el, api) {
        const row = (w, cls, label, edit) => `<li class="wp-rung ${cls}"><span class="wp-rlabel">${label}</span><span class="wp-rcells">${[...Array(L)].map((_, j) => edit
          ? `<button type="button" class="pz-cell wp-lcell ${sel === j ? 'sel' : ''} ${cur[j] !== rungs[rungs.length - 1][j] ? 'chg' : ''}" data-j="${j}" lang="en" aria-pressed="${sel === j}" aria-label="${t('wp.ui.step', { n: at() })}: ${cur[j]}">${cur[j]}</button>`
          : `<span class="pz-cell wp-lcell ${w ? '' : 'blank'}" lang="en">${w ? w[j] : ''}</span>`).join('')}</span></li>`;
        const draw = (m) => {
          const finished = rungs.length > k || rungs[rungs.length - 1] === B;
          el.innerHTML = `<div class="board wp-board"><ol class="wp-ladder" aria-label="${t('wp.skill.ladder')}">
            ${row(A, 'given', t('wp.ui.start'))}
            ${[...Array(k)].map((_, i) => { const n = i + 1; return n < rungs.length ? row(rungs[n], 'on', t('wp.ui.step', { n })) : n === rungs.length && !finished ? row(null, 'edit', t('wp.ui.step', { n }), true) : row(null, 'todo', t('wp.ui.step', { n })); }).join('')}
            ${row(B, 'given goal', t('wp.ui.goal'))}</ol></div>
            <p class="wp-msg" aria-live="polite">${m ?? ''}</p>
            <div class="wp-tools"><button type="button" class="k-btn k-btn-outline k-btn-sm pill wp-undo" ${rungs.length > 1 || cur.join('') !== rungs[rungs.length - 1] ? '' : 'disabled'}><svg class="k-icon" aria-hidden="true"><use href="#i-undo"/></svg><span>${t('wp.ui.undo')}</span></button></div>
            ${finished ? '' : kbdHtml()}`;
          el.querySelectorAll('button.wp-lcell').forEach(b => b.onclick = () => { if (done() || locked) return; sel = +b.dataset.j; draw(t('wp.ui.pickLetter')); el.querySelector(`button.wp-lcell[data-j="${sel}"]`)?.focus(); });
          const kb = el.querySelector('.wp-kbd'); if (kb) kb.onclick = e => { const b = e.target.closest('button'); if (b) b.dataset.k === 'del' ? back() : type(b.dataset.k); };
          el.querySelector('.wp-undo').onclick = undo;
          api.ready(finished);
        };
        const evaluate = () => {
          const prev = rungs[rungs.length - 1], w = cur.join(''), diff = [...w].filter((c, i) => c !== prev[i]).length;
          if (diff === 0) return draw('');
          if (diff > 1) return draw(t('wp.ui.oneOnly'));
          if (!DICT.has(w)) return draw(t('wp.ui.notReal', { w: W(w) }));
          rungs.push(w); sel = null; say(w);
          if (w === B) return draw(t('wp.ui.reached', { b: W(B) }));
          if (rungs.length > k) return draw(oneAway(w, B) ? t('wp.ui.lastOk', { w: W(w), b: W(B) }) : t('wp.ui.lastFar', { w: W(w), b: W(B) }));
          draw(t('wp.ui.real', { w: W(w) }));
        };
        const type = ch => { if (done() || locked) return; if (sel == null) return draw(t('wp.ui.pickLetter')); cur[sel] = ch; evaluate(); };
        const back = () => { if (done() || locked) return; const prev = rungs[rungs.length - 1]; if (sel != null && cur[sel] !== prev[sel]) { cur[sel] = prev[sel]; draw(''); } };
        const undo = () => { if (done() || locked) return; const prev = rungs[rungs.length - 1]; if (cur.join('') !== prev) cur = [...prev]; else if (rungs.length > 1) { rungs.pop(); cur = [...rungs[rungs.length - 1]]; } sel = null; draw(''); };
        onKeys(el, e => {
          if (/^[a-zA-Z]$/.test(e.key)) { e.preventDefault(); type(e.key.toLowerCase()); }
          else if (e.key === 'Backspace') { e.preventDefault(); back(); }
          else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && el.querySelector('button.wp-lcell')) { e.preventDefault(); sel = Math.max(0, Math.min(L - 1, (sel ?? -1) + (e.key === 'ArrowLeft' ? -1 : 1))); draw(t('wp.ui.pickLetter')); el.querySelector(`button.wp-lcell[data-j="${sel}"]`)?.focus(); }
        });
        q._lock = () => { locked = true; finish(el); };
        draw(t('wp.ui.pickLetter'));
      },
      check() { q._lock?.(); const path = [...rungs]; if (path[path.length - 1] !== B) path.push(B);
        const ok = path.every((w, i) => !i || (oneAway(path[i - 1], w) && DICT.has(w))) && rungs.length > 1; q._path = path; return { correct: ok, given: path.join(' → ') }; },
    };
    const whyBase = () => ({ steps: [{ text: t('wp.y.lad', { chain: markChain(C) }) }, ...(q._path && q._path.join() !== C.join() ? [{ text: t('wp.y.ladYou', { chain: markChain(q._path) }) }] : []), ...meansStep(B)], rule: t('wp.y.ladRule') });
    q.why = whyBase(); q.whyFor = whyBase;
    return q;
  } });

  // ======================================================================
  // 5. Sentence jigsaw: capitals, full stops and who + does + what (original sentences)
  // ======================================================================
  const SENTS = [
    [['The cat', 'sleeps'], ['Birds', 'sing'], ['The baby', 'smiles'], ['Dogs', 'bark'], ['The bus', 'stops'], ['Amma', 'cooks'], ['The frog', 'jumps'], ['We', 'clap']],
    [['The cow', 'eats', 'grass'], ['Meena', 'reads', 'a book'], ['The boy', 'kicks', 'the ball'], ['We', 'drink', 'water'], ['Ravi', 'flies', 'a kite'], ['The hen', 'lays', 'eggs'], ['I', 'like', 'mangoes'], ['The monkey', 'eats', 'a banana']],
    [['The crow', 'sits', 'on the tree'], ['My sister', 'draws', 'a red flower'], ['The fish', 'swims', 'in the pond'], ['Appa', 'drives', 'the car to work'], ['The children', 'play', 'in the park'], ['Our goat', 'drinks', 'from the river']],
    [['The little goat', 'jumps', 'over the big stone'], ['I', 'wash', 'my hands before lunch'], ['Our teacher', 'reads', 'us a long story'], ['The tall boy', 'carries', 'a heavy bag'], ['My grandmother', 'plants', 'seeds in the garden'], ['The busy ants', 'carry', 'food to their nest']],
  ];
  Engine.skill({ id: 'wp.jigsaw', subject: S, topic: 'wordpuzzles', name: 'wp.skill.jigsaw', bands: { young: [1, 2], older: [1, 4] }, gen(l, r) {
    const parts = r.pick(SENTS[l - 1]), words = parts.join(' ').split(' '), toks = [...words, '.'], target = words.join(' ') + '.';
    const join = ts => ts.join(' ').replace(/ \./g, '.');
    let order = r.shuffle(toks.map((_, i) => i)); for (let k = 0; k < 6 && join(order.map(i => toks[i])) === target; k++) order = r.shuffle(order);
    let line = [], focusTok = null, locked = false, suppress = false;
    const partHtml = () => `<p class="wp-parts" lang="en">${parts.map((p, i) => `<span class="wp-part p${i}">${esc(p)}${i === parts.length - 1 ? '.' : ''}<small>${t(['wp.ui.who', 'wp.ui.does', 'wp.ui.what'][i])}</small></span>`).join(' ')}</p>`;
    const q = { kind: 'custom', prompt: t('wp.q.jigsaw'), boardClass: 'wp',
      hints: ladder(t('wp.h.jig1'), t('wp.h.jig2', { who: W(parts[0]), does: W(parts[1]) }), { text: t('wp.h.jig3', { s: W(target) }), vis: partHtml() }), hintRevealsAnswer: true,
      answerText: W(target),
      mount(el, api) {
        el.innerHTML = `<div class="board wp-board wp-jig"><p class="wp-cap">${t('wp.ui.line')}</p><div class="wp-line" role="group" aria-label="${t('wp.ui.line')}" aria-live="polite"></div></div>
          <div class="tilebank wp-bank" role="group" aria-label="${t('wp.ui.bank')}"></div>
          <p class="wp-tip small muted">${t('wp.ui.moveTip')}</p>`;
        const lineEl = el.querySelector('.wp-line'), bankEl = el.querySelector('.wp-bank');
        const tileHtml = i => `<button type="button" class="tile word wp-tok ${toks[i] === '.' ? 'stop' : ''}" data-t="${i}" lang="en" aria-label="${toks[i] === '.' ? t('wp.ui.stop') : esc(toks[i])}">${esc(toks[i])}</button>`;
        const draw = () => {
          lineEl.innerHTML = line.length ? line.map(tileHtml).join('') : `<span class="slot-ph">${t('wp.ui.dropHere')}</span>`;
          bankEl.innerHTML = order.filter(i => !line.includes(i)).map(tileHtml).join('');
          el.querySelectorAll('.wp-tok').forEach(b => bind(b));
          if (focusTok != null) el.querySelector(`.wp-tok[data-t="${focusTok}"]`)?.focus({ preventScroll: true });
          api.ready(line.length === toks.length);
        };
        const toggle = i => { if (done() || locked) return; const p = line.indexOf(i); if (p >= 0) line.splice(p, 1); else line.push(i); focusTok = i; draw(); if (toks[i] !== '.') say(toks[i]); };
        const insertAt = (i, x, y) => { // where in the line does the point (x, y) fall?
          const others = [...lineEl.querySelectorAll('.wp-tok')].filter(b => +b.dataset.t !== i);
          let idx = others.length; for (let k = 0; k < others.length; k++) { const rc = others[k].getBoundingClientRect(); if (y < rc.top - 4 || (y <= rc.bottom + 4 && x < rc.left + rc.width / 2)) { idx = k; break; } }
          const ids = others.map(b => +b.dataset.t); ids.splice(idx, 0, i); line = ids; };
        const bind = b => {
          const i = +b.dataset.t;
          b.onclick = () => { if (suppress) { suppress = false; return; } toggle(i); };
          b.onkeydown = e => { const p = line.indexOf(i); if (p < 0 || !(e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return; e.preventDefault(); const np = p + (e.key === 'ArrowLeft' ? -1 : 1); if (np < 0 || np >= line.length) return; line.splice(p, 1); line.splice(np, 0, i); focusTok = i; draw(); };
          b.onpointerdown = e => {
            if (done() || locked || e.button > 0) return;
            const sx = e.clientX, sy = e.clientY; let moving = false;
            const mv = ev => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (!moving && Math.hypot(dx, dy) > 8) { moving = true; b.classList.add('dragging'); } if (moving) { ev.preventDefault(); b.style.transform = `translate(${dx}px, ${dy}px)`; const over = document.elementFromPoint(ev.clientX, ev.clientY); lineEl.classList.toggle('over', !!over?.closest?.('.wp-line')); } };
            const upF = ev => { removeEventListener('pointermove', mv); removeEventListener('pointerup', upF); removeEventListener('pointercancel', upF); lineEl.classList.remove('over');
              if (!moving) return; suppress = true; setTimeout(() => { suppress = false; }, 0);
              const over = document.elementFromPoint(ev.clientX, ev.clientY);
              if (over?.closest?.('.wp-line')) insertAt(i, ev.clientX, ev.clientY); else if (over?.closest?.('.wp-bank')) line = line.filter(x => x !== i);
              focusTok = null; draw(); };
            addEventListener('pointermove', mv, { passive: false }); addEventListener('pointerup', upF); addEventListener('pointercancel', upF);
          };
        };
        q._lock = () => { locked = true; finish(el); };
        draw();
      },
      check() { q._lock?.(); const s = join(line.map(i => toks[i])); q._given = s; return { correct: s === target, given: s }; },
    };
    const whyFor = () => ({ steps: [...(q._given && q._given !== target ? [{ text: t('wp.y.jigYou', { s: W(q._given) }) }] : []),
      { text: t(parts.length > 2 ? 'wp.y.jigParts' : 'wp.y.jigParts2', { who: W(parts[0]), does: W(parts[1]), what: W(parts[2] || '') }), vis: partHtml() },
      { text: t('wp.y.jigCap', { w: `<span lang="en"><b class="wp-chg">${esc(words[0][0])}</b>${esc(words[0].slice(1))}</span>` }) }, { text: t('wp.y.jigStop') }], rule: t('wp.y.jigRule') });
    q.why = whyFor(); q.whyFor = whyFor;
    q.say = [ui(q.prompt)];
    return q;
  } });

  // ======================================================================
  // 6. Missing letter / blend, tied to EN_DATA.PATTERNS
  // ======================================================================
  const ALT = { ck: ['ck', 'k', 'c', 'kk'], sh: ['sh', 'ch', 'th', 's'], aiay: ['ai', 'ay', 'a', 'oi'], eeea: ['ee', 'ea', 'e', 'oo'], oaow: ['oa', 'ow', 'o', 'ou'], igh: ['igh', 'ie', 'i', 'y'] };
  const MIS = { young: [['cvc'], ['ck', 'sh', 'double']], older: [['cvc', 'silentE'], ['ck', 'sh', 'double'], ['aiay', 'eeea', 'oaow'], ['igh', 'aiay', 'oaow', 'eeea']] };
  Engine.skill({ id: 'wp.missing', subject: S, topic: 'wordpuzzles', name: 'wp.skill.missing', bands: { young: [1, 2], older: [1, 4] }, gen(l, r, ctx) {
    const pats = MIS[ctx.band === 'young' ? 'young' : 'older'][l - 1] || MIS.older[0], pat = r.pick(pats);
    const words = pat === 'cvc' ? [...new Set([...D.PATTERNS.cvc.words, ...Object.keys(D.CVC)])] : D.PATTERNS[pat].words;
    const w = r.pick(words.filter(x => /^[a-z]+$/.test(x)));
    let s, len, opts;
    const real = (x, a, n) => DICT.has(x.slice(0, a) + n + x.slice(a + len)) ;
    if (pat === 'cvc' || pat === 'silentE' || pat === 'double') {
      if (pat === 'cvc') { len = 1; const ps = r.shuffle([...Array(w.length).keys()]); s = ps.find(i => (/[aeiou]/.test(w[i]) ? 'aeiou' : 'bcdfghjklmnprstvwz').split('').filter(x => x !== w[i] && !DICT.has(w.slice(0, i) + x + w.slice(i + 1))).length >= 2) ?? ps[0]; }
      else if (pat === 'silentE') { s = w.length - 3; len = 1; }                       // the vowel the e changes: c_ke
      else { const m = w.match(/(ll|ss|ff|zz|pp|tt|ee|oo)/); s = m.index; len = 2; }
      const ans = w.substr(s, len), vowel = /[aeiou]/.test(w[s]) && len === 1;
      const pool = pat === 'double' ? ['ll', 'ss', 'ff', 'tt', 'pp', 'zz', w[s]].filter(x => x !== ans) : (vowel ? 'aeiou' : 'bcdfghjklmnprstvwz').split('').filter(x => x !== ans);
      opts = r.shuffle(pool).filter(x => !real(w, s, x)).slice(0, l === 1 ? 2 : 3);
      opts = r.shuffle([ans, ...opts]);
    } else {
      const m = w.match(new RegExp(D.PATTERNS[pat].mark)); s = m.index; len = m[0].length;
      const ans = m[0], alts = (ALT[pat] || []).filter(x => x !== ans && !real(w, s, x));
      opts = r.shuffle([ans, ...r.shuffle(alts).slice(0, 3)]);
    }
    const ans = w.substr(s, len), shown = `<span lang="en">${esc(w.slice(0, s))}<span class="wp-gap">${'_'.repeat(len)}</span>${esc(w.slice(s + len))}</span>`;
    const parts = [esc(w.slice(0, s)), `<b class="wp-chg">${esc(ans)}</b>`, esc(w.slice(s + len))].filter(x => x);
    const ruleKey = pat === 'cvc' ? 'cvc' : pat;
    const spell = window.ENGLISH?.spellHtml ? window.ENGLISH.spellHtml(w, [], pat) : '';
    return { kind: 'choice', prompt: t(len > 1 ? 'wp.q.missing2' : 'wp.q.missing1'),
      visual: `<div class="wp-missing">${pic(w) ? img(w, 'wp-mpic') : ''}<p class="wp-mword">${shown}</p></div>`,
      say: [ui(t(len > 1 ? 'wp.q.missing2' : 'wp.q.missing1'))],
      choices: opts.map(o => ({ v: o, html: `<span class="bignum" lang="en">${esc(o)}</span>`, say: [en(o.split('').join(' '))] })), answer: ans, answerText: `${W(ans)} · ${W(w)}`,
      hints: ladder(t(pic(w) ? 'wp.h.mis1p' : 'wp.h.mis1'), t('wp.rule.' + ruleKey), t('wp.h.mis3', { m: W(ans), w: W(w) })), hintRevealsAnswer: true,
      why: { steps: [{ text: t('wp.y.mis', { parts: `<span lang="en">${parts.join(' + ')}</span>`, w: W(w) }), vis: spell }, ...meansStep(w)], rule: t('wp.rule.' + ruleKey), photo: credit(w) } };
  } });

  // ======================================================================
  // 7. Compound words: two small words make one new word
  // ======================================================================
  const COMP = [['sun', 'flower', 'சூரியகாந்தி'], ['foot', 'ball', 'கால்பந்து'], ['school', 'bag', 'பள்ளிப் பை'], ['star', 'fish', 'நட்சத்திர மீன்'], ['tree', 'house', 'மர வீடு'], ['moon', 'light', 'நிலவொளி'],
    ['sea', 'shell', 'கடல் சிப்பி'], ['bed', 'room', 'படுக்கையறை'], ['key', 'hole', 'சாவித் துவாரம்'], ['sail', 'boat', 'பாய்மரப் படகு'], ['book', 'shelf', 'புத்தக அலமாரி'], ['door', 'bell', 'அழைப்பு மணி'],
    ['cup', 'cake', 'சிறு கேக் (cupcake)'], ['rain', 'bow', 'வானவில்'], ['butter', 'fly', 'பட்டாம்பூச்சி'], ['water', 'melon', 'தர்பூசணி'], ['rain', 'coat', 'மழைக்கோட்டு'], ['tooth', 'brush', 'பல் துலக்கி'],
    ['snow', 'man', 'பனிமனிதன்'], ['pop', 'corn', 'சோளப்பொரி'], ['gold', 'fish', 'தங்க மீன்'], ['bath', 'room', 'குளியலறை'], ['pan', 'cake', 'அப்பம் (pancake)'], ['sun', 'rise', 'சூரிய உதயம்'], ['house', 'boat', 'படகு வீடு']];
  const REAL = new Set([...COMP.map(c => c[0] + c[1]), ...'sunlight starlight sunfish sunroom sunbed seaman footman footbath snowball doorman bookbag schoolhouse schoolroom cupboard bedbug bathhouse waterfall waterhole housefly butterfish sailfish moonrise moonfish raincoat bookcase'.split(' ')]);
  const piece = w => pic(w) ? `<span class="wp-piece">${img(w)}<b lang="en">${esc(w)}</b></span>` : `<span class="wp-piece tile word" lang="en">${esc(w)}</span>`;
  Engine.skill({ id: 'wp.compound', subject: S, topic: 'wordpuzzles', name: 'wp.skill.compound', bands: { young: [1, 2], older: [1, 4] }, gen(l, r, ctx) {
    const young = ctx.band === 'young', easy = COMP.filter(c => pic(c[0]) || pic(c[1]) || pic(c[0] + c[1]));
    const [a, b, ta] = r.pick(young || l <= 2 ? easy : COMP), c = a + b, askA = !young && l >= 3, n = young && l === 1 ? 3 : 4;
    const others = r.shuffle([...new Set(COMP.map(x => askA ? x[0] : x[1]))]).filter(x => x !== (askA ? a : b) && !REAL.has(askA ? x + b : a + x)).slice(0, n - 1);
    const ans = askA ? a : b, opts = r.shuffle([ans, ...others]), allPics = !askA && opts.every(o => pic(o));
    const gap = '<span class="wp-piece gap" aria-hidden="true">?</span>';
    const result = pic(c) ? `<span class="wp-piece res">${img(c)}</span>` : '';
    const vis = `<div class="wp-compound" lang="en">${askA ? gap : piece(a)}<span class="wp-op">+</span>${askA ? piece(b) : gap}${result ? `<span class="wp-op">=</span>${result}` : ''}</div>`;
    const prompt = askA ? t('wp.q.compoundA', { b: W(b) }) : t('wp.q.compoundB', { a: W(a) });
    return { kind: 'choice', prompt, visual: vis, say: [ui(askA ? t('wp.q.compoundA', { b: '' }) : t('wp.q.compoundB', { a: '' })), en(askA ? b : a)],
      choices: opts.map(o => ({ v: o, ...(allPics ? { img: pic(o).src } : {}), html: `<span lang="en">${esc(o)}</span>`, say: [en(o)] })), answer: ans, answerText: W(c),
      hints: ladder(askA ? t('wp.h.com1b', { b: W(b) }) : t('wp.h.com1', { a: W(a) }), t('wp.h.com2', { ta: `<span lang="ta">${ta}</span>` }), t('wp.h.com3', { a: W(a), b: W(b), c: W(c) })), hintRevealsAnswer: true,
      why: { steps: [{ text: t('wp.y.com', { a: W(a), b: W(b), c: W(c) }), vis: `<div class="wp-compound" lang="en">${piece(a)}<span class="wp-op">+</span>${piece(b)}<span class="wp-op">=</span><span class="wp-piece tile word res">${esc(c)}</span></div>` }, { text: t('wp.y.means', { w: W(c), ta: `<span lang="ta">${ta}</span>` }) }], rule: t('wp.y.comRule'), photo: credit(c) || credit(a) || credit(b) } };
  } });

  // ---------- the game ----------
  const IDS = { young: ['wp.crossword', 'wp.search', 'wp.unscramble', 'wp.jigsaw', 'wp.missing', 'wp.compound'], older: ['wp.crossword', 'wp.search', 'wp.unscramble', 'wp.ladder', 'wp.jigsaw', 'wp.missing', 'wp.compound'] };
  const game = { title: 'wp.title', blurb: 'wp.blurb', icon: 'i-puzzle', start(p) {
    const ids = IDS[p.band] || IDS.older;
    const due = Store.due(p, S).filter(x => x.skill?.startsWith('wp.') && ids.includes(x.skill)).slice(0, 1).map(x => ({ skill: x.skill, lvl: x.lvl, seed: x.seed }));
    const pick = []; while (due.length + pick.length < 5) { const last = (pick.at(-1) || due.at(-1))?.skill; pick.push(...Engine.weighted(p, ids.filter(id => id !== last), 1)); }
    Engine.start({ items: [...due, ...pick], title: t('wp.title'), subject: S, topic: 'wordpuzzles', mode: 'wordpuzzles', back: '#/s/english', again: () => game.start(p) });
  } };
  window.WORDPZ = { game, IDS, DICT };
})();
