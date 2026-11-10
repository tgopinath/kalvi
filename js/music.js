// Music: games that teach through sound. Three modes run through the shared engine
// (hint ladder: nudge → worked step → answer; a lesson card after every task; misses go to review):
//   Maths   — rhythm and counting: tap back a rhythm, beats in a bar, Adi talam, note lengths as fractions, complete the bar
//   Science — sound lab: Jalatarangam bowls, a veena string, high/low and loud/soft
//   English — clap the syllables of a word, find the rhyme in a short original chant
// plus Free play at #/music: a sa-re-ga-ma pad with flute, veena and mridangam voices, record and replay tunes.
// All sound is synthesised with Web Audio (no sample files). Every beat also has a visual cue (pulsing ring,
// highlighted note) and a vibration where supported, so everything can be played with the sound off.
(function () {
  const esc = Engine.esc;
  const ladder = (a, b, c) => [{ text: a }, { text: b.text ?? b, vis: b.vis }, { text: c.text ?? c, vis: c.vis }];
  const fmt = n => { const w = Math.floor(n), f = n - w; const fr = f === .5 ? '½' : f === .25 ? '¼' : f === .75 ? '¾' : ''; return w ? w + fr : fr || '0'; };
  const L = () => I18N.lang;

  I18N.add({ music: {
    eyebrow: ['Music', 'இசை'],
    mode: {
      maths: { title: ['Rhythm and counting', 'தாளமும் எண்ணுதலும்'], blurb: ['Tap beats, count bars and keep Adi talam with claps and waves.', 'துடிப்புகளைத் தட்டு, அளவுகளை எண்ணு, கைதட்டலும் வீச்சுமாக ஆதி தாளம் போடு.'] },
      science: { title: ['Sound lab', 'ஒலி ஆய்வகம்'], blurb: ['Jalatarangam bowls, a veena string, and listening for high, low, loud and soft.', 'ஜலதரங்கக் கிண்ணங்கள், வீணைத் தந்தி, உயர்ந்த–தாழ்ந்த, உரத்த–மெல்லிய ஒலிகள்.'] },
      english: { title: ['Rhyme and syllables', 'இயைபும் அசைகளும்'], blurb: ['Clap the syllables of a word and find the word that rhymes in a chant.', 'ஒரு சொல்லின் அசைகளுக்குக் கைதட்டு; பாட்டில் ஒரே ஓசையில் முடியும் சொல்லைக் கண்டுபிடி.'] },
    },
    skill: {
      tap: ['Tap the rhythm', 'தாளத்தைத் தட்டு'], count: ['Beats in a bar', 'அளவில் (bar) உள்ள துடிப்புகள்'], tala: ['Adi talam', 'ஆதி தாளம்'],
      frac: ['Note lengths as fractions', 'ஸ்வர நீளங்களும் பின்னங்களும்'], complete: ['Complete the rhythm', 'தாளத்தை முழுமையாக்கு'],
      glass: ['Jalatarangam', 'ஜலதரங்கம்'], string: ['Veena string', 'வீணைத் தந்தி'], listen: ['High, low, loud, soft', 'உயர்ந்த, தாழ்ந்த, உரத்த, மெல்லிய ஒலி'],
      syll: ['Clap the syllables', 'அசைகளுக்குக் கைதட்டு'], rhyme: ['Rhyming words', 'இயைபுச் சொற்கள் (rhyme)'],
    },
    ui: {
      sound: ['Sound', 'ஒலி'], mute: ['Turn sound off', 'ஒலியை அணை'], unmute: ['Turn sound on', 'ஒலியை இயக்கு'], soundOn: ['Sound on', 'ஒலி இயங்குகிறது'], soundOff: ['Sound off', 'ஒலி அணைந்துள்ளது'],
      vol: ['Volume', 'ஒலி அளவு'], buzz: ['Vibrate', 'அதிர்வு'], free: ['Free play', 'விருப்பம்போல் வாசி'], play: ['Play', 'வாசி'], hear: ['Hear it', 'கேட்டுப் பார்'],
      again: ['Start again', 'மீண்டும் தொடங்கு'], undo: ['Undo', 'செயல்தவிர்'], watch: ['Sound off? Watch the ring: it glows on every beat.', 'ஒலி இல்லையா? வளையத்தைப் பார்: ஒவ்வொரு துடிப்பிலும் அது ஒளிரும்.'],
      demo: ['See the sound demo', 'ஒலிச் சோதனையைப் பார்'], beatRing: ['Beat light', 'துடிப்பு விளக்கு'],
    },
    note: {
      whole: ['whole note', 'முழுக் குறி'], half: ['half note', 'அரைக் குறி'], quarter: ['quarter note', 'கால் குறி'], eighth: ['eighth note', 'அரைக்கால் குறி'],
      dhalf: ['dotted half note', 'புள்ளி அரைக் குறி'], dquarter: ['dotted quarter note', 'புள்ளி கால் குறி'], rest: ['rest', 'ஓய்வு'],
      beats: ['{n} beats', '{n} துடிப்புகள்'], beat1: ['1 beat', '1 துடிப்பு'],
    },
    syl: { e: ['ti', 'தி'], q: ['ta', 'தா'], dq: ['ta-i', 'தா-இ'], h: ['ta-a', 'தா-ஆ'], dh: ['ta-a-a', 'தா-ஆ-ஆ'], w: ['ta-a-a-a', 'தா-ஆ-ஆ-ஆ'], rest: ['(rest)', '(ஓய்வு)'] },
    score: { label: ['Rhythm: {list}', 'தாளம்: {list}'], gap: ['a gap', 'ஒரு இடைவெளி'] },
    tap: {
      q: ['Listen, then tap this rhythm on the pad.', 'கேட்டுவிட்டு, இந்தத் தாளத்தைப் பலகையில் தட்டு.'],
      pad: ['Tap', 'தட்டு'], padLabel: ['Tap pad. Tap it or press Space once for each note.', 'தட்டும் பலகை. ஒவ்வொரு குறிக்கும் ஒரு முறை தட்டு அல்லது Space அழுத்து.'],
      status: ['Taps: {a} of {b}', 'தட்டியவை: {b}-இல் {a}'], ready: ['All taps in. Press Check, or Start again.', 'எல்லாத் தட்டுகளும் முடிந்தன. சரிபார் அழுத்து, அல்லது மீண்டும் தொடங்கு.'],
      first: ['Your first tap starts the beat. The ring keeps time for you.', 'உன் முதல் தட்டில் துடிப்பு தொடங்கும். வளையம் உனக்கு நேரம் காட்டும்.'],
      given: ['{a} of {b} taps on time', '{b}-இல் {a} தட்டுகள் சரியான நேரத்தில்'], mine: ['Your taps', 'உன் தட்டுகள்'], grid: ['The beat', 'துடிப்பு'],
      h1: ['Press Hear it and watch each note light up. After a long note, wait longer before the next tap.', 'கேட்டுப் பார் அழுத்தி, ஒவ்வொரு குறியும் ஒளிர்வதைப் பார். நீண்ட குறிக்குப் பிறகு அடுத்த தட்டுக்கு அதிகம் காத்திரு.'],
      h2: ['Count the beats out loud: {count}. Tap on: {on}.', 'துடிப்புகளைச் சத்தமாக எண்ணு: {count}. இந்த இடங்களில் தட்டு: {on}.'],
      h3: ['Say it as you tap: {syl}. One tap for each sound.', 'தட்டும்போது சொல்: {syl}. ஒவ்வொரு ஒலிக்கும் ஒரு தட்டு.'],
      y1: ['A quarter note gets 1 beat. Two eighth notes share 1 beat: ½ + ½ = 1. A half note holds for 2 beats.', 'கால் குறிக்கு 1 துடிப்பு. இரண்டு அரைக்கால் குறிகள் 1 துடிப்பைப் பகிர்கின்றன: ½ + ½ = 1. அரைக் குறி 2 துடிப்புகள் நீளும்.'],
      y2: ['This bar: {expr} = {sum} beats.', 'இந்த அளவு: {expr} = {sum} துடிப்புகள்.'],
      rule: ['Keep the beat steady first, then fit the notes onto it.', 'முதலில் துடிப்பைச் சீராக வை, பிறகு குறிகளை அதன் மேல் பொருத்து.'],
    },
    count: {
      q: ['How many beats does this bar last?', 'இந்த அளவு (bar) எத்தனை துடிப்புகள் நீளும்?'], qNotes: ['Count the beats. How many beats are there?', 'துடிப்புகளை எண்ணு. எத்தனை துடிப்புகள்?'],
      q2: ['How many beats do these two bars last?', 'இந்த இரண்டு அளவுகள் எத்தனை துடிப்புகள் நீளும்?'],
      h1: ['A quarter note is 1 beat, a half note is 2, a whole note is 4. Two eighth notes together make 1 beat.', 'கால் குறி = 1 துடிப்பு, அரைக் குறி = 2, முழுக் குறி = 4. இரண்டு அரைக்கால் குறிகள் சேர்ந்து = 1 துடிப்பு.'],
      h2: ['Write each note as beats: {expr}', 'ஒவ்வொரு குறியையும் துடிப்புகளாக எழுது: {expr}'], h3: ['{expr} = {sum}', '{expr} = {sum}'],
      y: ['{expr} = {sum} beats. The blocks show how long each note lasts.', '{expr} = {sum} துடிப்புகள். ஒவ்வொரு குறியும் எவ்வளவு நேரம் நீளும் என்பதைக் கட்டைகள் காட்டுகின்றன.'],
      rule: ['2 half notes make 1 whole. 2 quarter notes make 1 half.', '2 அரைக் குறிகள் = 1 முழுக் குறி. 2 கால் குறிகள் = 1 அரைக் குறி.'],
    },
    tala: {
      laghu: ['Laghu', 'லகு'], drutam: ['Drutam', 'த்ருதம்'], play: ['Play the talam', 'தாளத்தை வாசி'],
      clap: ['clap', 'தட்டு'], f1: ['little finger', 'சுண்டு விரல்'], f2: ['ring finger', 'மோதிர விரல்'], f3: ['middle finger', 'நடு விரல்'], wave: ['wave', 'வீச்சு'],
      act: { clap: ['Clap', 'கைதட்டு'], finger: ['Count a finger', 'விரலை எண்ணு'], wave: ['Wave (turn the hand over)', 'வீச்சு (கையைத் திருப்பு)'] },
      label: ['Adi talam, 8 beats in groups of 4, 2 and 2', 'ஆதி தாளம்: 4, 2, 2 என்ற குழுக்களில் 8 துடிப்புகள்'],
      q: {
        claps: ['Adi talam has 8 beats. How many claps are there in one round?', 'ஆதி தாளத்தில் 8 துடிப்புகள். ஒரு சுற்றில் எத்தனை கைதட்டல்கள்?'],
        waves: ['How many waves are there in one round of Adi talam?', 'ஆதி தாளத்தின் ஒரு சுற்றில் எத்தனை வீச்சுகள்?'],
        beat: ['What do you do on beat {n} of Adi talam?', 'ஆதி தாளத்தின் {n}-ஆவது துடிப்பில் என்ன செய்வாய்?'],
        total: ['Laghu has 4 beats and each drutam has 2. How many beats are in one round of laghu + drutam + drutam?', 'லகுவில் 4 துடிப்புகள், ஒவ்வொரு த்ருதத்திலும் 2. லகு + த்ருதம் + த்ருதம் என்ற ஒரு சுற்றில் எத்தனை துடிப்புகள்?'],
        rounds: ['A song goes round Adi talam {k} times. How many beats is that?', 'ஒரு பாடல் ஆதி தாளத்தை {k} முறை சுற்றுகிறது. மொத்தம் எத்தனை துடிப்புகள்?'],
        long: ['You keep Adi talam going without stopping. What do you do on beat {n}?', 'நிறுத்தாமல் ஆதி தாளம் போடுகிறாய். {n}-ஆவது துடிப்பில் என்ன செய்வாய்?'],
        start: ['On which beat does round {k} of Adi talam begin?', 'ஆதி தாளத்தின் {k}-ஆவது சுற்று எந்தத் துடிப்பில் தொடங்கும்?'],
      },
      h: {
        claps1: ['Play the talam and count only the claps.', 'தாளத்தை வாசித்து, கைதட்டல்களை மட்டும் எண்ணு.'], claps2: ['Each part starts with a clap: laghu, drutam, drutam.', 'ஒவ்வொரு பகுதியும் ஒரு கைதட்டலுடன் தொடங்குகிறது: லகு, த்ருதம், த்ருதம்.'], claps3: ['Claps on beats 1, 5 and 7: 3 claps.', '1, 5, 7 ஆகிய துடிப்புகளில் கைதட்டல்: 3 கைதட்டல்கள்.'],
        waves1: ['Look at the two drutams at the end.', 'கடைசியில் உள்ள இரண்டு த்ருதங்களைப் பார்.'], waves2: ['Each drutam is a clap, then a wave.', 'ஒவ்வொரு த்ருதமும்: கைதட்டு, பிறகு வீச்சு.'], waves3: ['Waves on beats 6 and 8: 2 waves.', '6, 8 ஆகிய துடிப்புகளில் வீச்சு: 2 வீச்சுகள்.'],
        beat1: ['Count along the groups: 4, then 2, then 2.', 'குழுக்களாக எண்ணு: 4, பிறகு 2, பிறகு 2.'], beat2: ['Beat {n} is in the {part}.', '{n}-ஆவது துடிப்பு {part} பகுதியில் உள்ளது.'], beat3: ['On beat {n}: {act}.', '{n}-ஆவது துடிப்பில்: {act}.'],
        total1: ['Add the three parts.', 'மூன்று பகுதிகளையும் கூட்டு.'], total2: ['4 + 2 + 2', '4 + 2 + 2'], total3: ['4 + 2 + 2 = 8', '4 + 2 + 2 = 8'],
        rounds1: ['One round is 8 beats.', 'ஒரு சுற்று = 8 துடிப்புகள்.'], rounds2: ['{k} rounds is {k} × 8.', '{k} சுற்றுகள் = {k} × 8.'], rounds3: ['{k} × 8 = {a}', '{k} × 8 = {a}'],
        long1: ['The talam repeats every 8 beats. Take away 8 until you reach a beat from 1 to 8.', 'தாளம் ஒவ்வொரு 8 துடிப்புக்கும் திரும்ப வரும். 1 முதல் 8 வரை உள்ள எண் கிடைக்கும் வரை 8-ஐக் கழி.'],
        long2: ['{chain}. So beat {n} is like beat {m}.', '{chain}. ஆகவே {n}-ஆவது துடிப்பு {m}-ஆவது துடிப்பைப் போன்றது.'],
        start1: ['Round 1 starts on beat 1 and round 2 on beat 9.', 'முதல் சுற்று 1-ஆவது துடிப்பில், இரண்டாம் சுற்று 9-ஆவது துடிப்பில் தொடங்கும்.'],
        start2: ['Before round {k} come {j} full rounds: {j} × 8 = {b} beats.', '{k}-ஆவது சுற்றுக்கு முன் {j} முழுச் சுற்றுகள்: {j} × 8 = {b} துடிப்புகள்.'], start3: ['{b} + 1 = {a}', '{b} + 1 = {a}'],
      },
      y: {
        parts: ['Adi talam = laghu (clap and 3 finger counts) + drutam (clap, wave) + drutam (clap, wave) = 4 + 2 + 2 = 8 beats.', 'ஆதி தாளம் = லகு (கைதட்டு, 3 விரல் எண்ணிக்கை) + த்ருதம் (கைதட்டு, வீச்சு) + த்ருதம் (கைதட்டு, வீச்சு) = 4 + 2 + 2 = 8 துடிப்புகள்.'],
        beat: ['Beat {n} is in the {part}: {act}.', '{n}-ஆவது துடிப்பு {part} பகுதியில்: {act}.'],
        rounds: ['Every round has the same 8 beats, so {k} rounds = {k} × 8 = {a} beats.', 'ஒவ்வொரு சுற்றிலும் அதே 8 துடிப்புகள்; ஆகவே {k} சுற்றுகள் = {k} × 8 = {a} துடிப்புகள்.'],
        start: ['{j} rounds of 8 come first ({b} beats), so round {k} starts on beat {a}.', 'முதலில் 8 துடிப்புகள் கொண்ட {j} சுற்றுகள் ({b} துடிப்புகள்); ஆகவே {k}-ஆவது சுற்று {a}-ஆவது துடிப்பில் தொடங்கும்.'],
        rule: ['Claps on beats 1, 5 and 7. Fingers on 2, 3 and 4. Waves on 6 and 8.', '1, 5, 7-இல் கைதட்டல். 2, 3, 4-இல் விரல் எண்ணிக்கை. 6, 8-இல் வீச்சு.'],
      },
    },
    frac: {
      q: {
        quarterOf: ['A whole note fills a bar of 4 beats. What fraction of the bar is one quarter note?', 'முழுக் குறி 4 துடிப்பு அளவை நிரப்புகிறது. ஒரு கால் குறி அந்த அளவின் எந்தப் பின்னம் (fraction)?'],
        halfOf: ['What fraction of a whole note is one half note?', 'ஒரு அரைக் குறி, முழுக் குறியின் எந்தப் பின்னம்?'],
        quarters: ['How many quarter notes fill a bar of 4 beats?', '4 துடிப்பு அளவை நிரப்ப எத்தனை கால் குறிகள் வேண்டும்?'],
        halves: ['How many half notes make one whole note?', 'எத்தனை அரைக் குறிகள் சேர்ந்தால் ஒரு முழுக் குறி?'],
        eighths: ['How many eighth notes fill a bar of 4 beats?', '4 துடிப்பு அளவை நிரப்ப எத்தனை அரைக்கால் குறிகள் வேண்டும்?'],
        eInHalf: ['How many eighth notes make one half note?', 'எத்தனை அரைக்கால் குறிகள் சேர்ந்தால் ஒரு அரைக் குறி?'],
        sum: ['A half note and two quarter notes: what fraction of a whole note is that?', 'ஒரு அரைக் குறியும் இரண்டு கால் குறிகளும்: இது முழுக் குறியின் எந்தப் பின்னம்?'],
        sum2: ['A half note and one quarter note: what fraction of a whole note is that?', 'ஒரு அரைக் குறியும் ஒரு கால் குறியும்: இது முழுக் குறியின் எந்தப் பின்னம்?'],
      },
      h1: ['Look at the bars: the whole note is cut into equal pieces.', 'பட்டைகளைப் பார்: முழுக் குறி சம பாகங்களாக வெட்டப்பட்டுள்ளது.'],
      y: ['1 whole = 2 halves = 4 quarters = 8 eighths.', '1 முழு = 2 அரை = 4 கால் = 8 அரைக்கால்.'],
      rule: ['2 half notes make 1 whole. 2 quarter notes make 1 half.', '2 அரைக் குறிகள் = 1 முழுக் குறி. 2 கால் குறிகள் = 1 அரைக் குறி.'],
      whole: ['whole', 'முழு'], halves: ['halves', 'அரை'], quarters: ['quarters', 'கால்'], eighthsRow: ['eighths', 'அரைக்கால்'],
      s: {
        quarterOf: ['4 quarter notes fill the bar, so one is ¼ of it.', '4 கால் குறிகள் அளவை நிரப்பும்; ஆகவே ஒன்று = ¼.'], halfOf: ['2 half notes make a whole, so one is ½.', '2 அரைக் குறிகள் = ஒரு முழு; ஆகவே ஒன்று = ½.'],
        quarters: ['Each quarter note is 1 beat: 1 + 1 + 1 + 1 = 4.', 'ஒவ்வொரு கால் குறியும் 1 துடிப்பு: 1 + 1 + 1 + 1 = 4.'], halves: ['½ + ½ = 1 whole.', '½ + ½ = 1 முழு.'],
        eighths: ['Each beat holds 2 eighth notes: 4 × 2 = 8.', 'ஒவ்வொரு துடிப்பிலும் 2 அரைக்கால் குறிகள்: 4 × 2 = 8.'], eInHalf: ['A half note is 2 beats and each beat holds 2 eighths: 2 × 2 = 4.', 'அரைக் குறி = 2 துடிப்புகள்; ஒவ்வொரு துடிப்பிலும் 2 அரைக்கால்: 2 × 2 = 4.'],
        sum: ['½ + ¼ + ¼ = ½ + ½ = 1 whole.', '½ + ¼ + ¼ = ½ + ½ = 1 முழு.'], sum2: ['½ + ¼ = 2/4 + 1/4 = ¾.', '½ + ¼ = 2/4 + 1/4 = ¾.'],
      },
      h2: { quarterOf: ['Count how many quarter notes fit in the bar.', 'அளவில் எத்தனை கால் குறிகள் பொருந்தும் என்று எண்ணு.'], halfOf: ['Count how many half notes fit in a whole.', 'முழுவில் எத்தனை அரைக் குறிகள் பொருந்தும் என்று எண்ணு.'], quarters: ['A quarter note lasts 1 beat.', 'கால் குறி 1 துடிப்பு நீளும்.'], halves: ['A half note is half of a whole.', 'அரைக் குறி என்பது முழுவில் பாதி.'], eighths: ['An eighth note lasts half a beat.', 'அரைக்கால் குறி அரைத் துடிப்பு நீளும்.'], eInHalf: ['A half note lasts 2 beats; an eighth lasts half a beat.', 'அரைக் குறி 2 துடிப்புகள்; அரைக்கால் அரைத் துடிப்பு.'], sum: ['Two quarters make a half.', 'இரண்டு கால் = ஒரு அரை.'], sum2: ['Write ½ as quarters: ½ = 2/4.', '½-ஐக் கால்களாக எழுது: ½ = 2/4.'] },
    },
    comp: {
      q: ['This bar should last {bar} beats. Which note fills the gap?', 'இந்த அளவு {bar} துடிப்புகள் நீள வேண்டும். இடைவெளியை எந்தக் குறி நிரப்பும்?'],
      h1: ['A bar of {bar} holds exactly {bar} beats.', '{bar} துடிப்பு அளவில் சரியாக {bar} துடிப்புகள் இருக்கும்.'],
      h2: ['The notes you see make {expr} = {s}. {bar} − {s} = {gap}.', 'தெரியும் குறிகள்: {expr} = {s}. {bar} − {s} = {gap}.'],
      h3: ['{gap} beats: a {name}.', '{gap} துடிப்புகள்: {name}.'],
      y: ['{expr} + {gap} = {bar} beats. The {name} lasts {gap}.', '{expr} + {gap} = {bar} துடிப்புகள். {name} = {gap} துடிப்புகள்.'],
      rule: ['Every bar adds up to the same number of beats.', 'ஒவ்வொரு அளவும் ஒரே எண்ணிக்கை துடிப்புகளாகக் கூடும்.'],
    },
    glass: {
      bowl: ['Bowl {n}', 'கிண்ணம் {n}'], full: ['water {p} full', 'நீர் {p} நிரம்பியுள்ளது'],
      q: { high: ['Tap each bowl to hear it. Which bowl gives the highest note?', 'ஒவ்வொரு கிண்ணத்தையும் தட்டிக் கேள். எந்தக் கிண்ணம் மிக உயர்ந்த ஸ்வரம் தரும்?'], low: ['Tap each bowl to hear it. Which bowl gives the lowest note?', 'ஒவ்வொரு கிண்ணத்தையும் தட்டிக் கேள். எந்தக் கிண்ணம் மிகத் தாழ்ந்த ஸ்வரம் தரும்?'], higher: ['Tap both bowls. Which one gives the higher note?', 'இரண்டு கிண்ணங்களையும் தட்டு. எது உயர்ந்த ஸ்வரம் தரும்?'], order: ['Tap the bowls in order, from the lowest note to the highest.', 'கிண்ணங்களைத் தாழ்ந்த ஸ்வரத்திலிருந்து உயர்ந்த ஸ்வரம் வரை வரிசையாகத் தட்டு.'] },
      h1: ['Look at the water. More water makes a lower note.', 'நீரைப் பார். அதிக நீர் என்றால் தாழ்ந்த ஸ்வரம்.'],
      h2: ['From most water to least: {list}.', 'அதிக நீரிலிருந்து குறைந்த நீர் வரை: {list}.'],
      h3: ['The answer: {a}.', 'விடை: {a}.'], orderGiven: ['Your order: {a}', 'உன் வரிசை: {a}'],
      y1: ['When you tap a bowl, the glass and the air inside vibrate: they shake back and forth very fast.', 'கிண்ணத்தைத் தட்டும்போது கண்ணாடியும் உள்ளே உள்ள காற்றும் அதிர்கின்றன (vibrate): மிக வேகமாக முன்னும் பின்னும் அசைகின்றன.'],
      y2: ['Water makes the bowl heavier to shake, so it vibrates more slowly and the note is lower. Less water: faster vibration, higher note.', 'நீர் கிண்ணத்தை அசைப்பதைக் கடினமாக்குகிறது; அதனால் அது மெதுவாக அதிர்ந்து ஸ்வரம் தாழ்கிறது. குறைந்த நீர்: வேகமான அதிர்வு, உயர்ந்த ஸ்வரம்.'],
      y3: ['Jalatarangam is a Carnatic instrument: a row of bowls, each tuned to a swaram by the water in it.', 'ஜலதரங்கம் ஒரு கர்நாடக இசைக் கருவி: ஒரு வரிசைக் கிண்ணங்கள்; ஒவ்வொன்றும் அதிலுள்ள நீரால் ஒரு ஸ்வரத்திற்கு அமைக்கப்படுகிறது.'],
      rule: ['Less water → faster vibration → higher pitch.', 'குறைந்த நீர் → வேகமான அதிர்வு → உயர்ந்த சுருதி (pitch).'],
    },
    string: {
      label: ['Veena string', 'வீணைத் தந்தி'], len: ['Vibrating length: {n} of 100', 'அதிரும் நீளம்: 100-இல் {n}'], slider: ['Move your finger along the string', 'தந்தியின் மேல் விரலை நகர்த்து'], pluck: ['Pluck', 'மீட்டு'],
      a: ['String A', 'தந்தி A'], b: ['String B', 'தந்தி B'], open: ['open string', 'திறந்த தந்தி'],
      q: { pickHigh: ['Pluck both strings. Which one gives the higher note?', 'இரண்டு தந்திகளையும் மீட்டு. எது உயர்ந்த ஸ்வரம் தரும்?'], pickLow: ['Pluck both strings. Which one gives the lower note?', 'இரண்டு தந்திகளையும் மீட்டு. எது தாழ்ந்த ஸ்வரம் தரும்?'], higher: ['Move your finger to make the note clearly higher than it is now.', 'இப்போது உள்ளதை விடத் தெளிவாக உயர்ந்த ஸ்வரம் வர விரலை நகர்த்து.'], lower: ['Move your finger to make the note clearly lower than it is now.', 'இப்போது உள்ளதை விடத் தெளிவாகத் தாழ்ந்த ஸ்வரம் வர விரலை நகர்த்து.'], half: ['Make the vibrating string half as long as the open string. That plays Sa one octave higher.', 'அதிரும் தந்தியைத் திறந்த தந்தியின் பாதி நீளமாக்கு. அது ஒரு ஸ்தாயி மேலே உள்ள ஸ (upper Sa).'], pa: ['Pa comes from a string ⅔ as long as the open string. Set the string to ⅔.', 'திறந்த தந்தியின் ⅔ நீளத்தில் ப வரும். தந்தியை ⅔ ஆக அமை.'], ma: ['Ma comes from a string ¾ as long as the open string. Set the string to ¾.', 'திறந்த தந்தியின் ¾ நீளத்தில் ம வரும். தந்தியை ¾ ஆக அமை.'] },
      h1: ['A shorter vibrating string gives a higher note.', 'குறுகிய அதிரும் தந்தி உயர்ந்த ஸ்வரம் தரும்.'],
      h2: { pick: ['Compare the bright, vibrating parts of the strings.', 'தந்திகளின் ஒளிரும், அதிரும் பகுதிகளை ஒப்பிடு.'], higher: ['Slide toward the bridge to shorten the string; now it is {n}.', 'தந்தியைக் குறைக்க, குதிரை (bridge) பக்கம் நகர்த்து; இப்போது {n}.'], lower: ['Slide away from the bridge to make the string longer; now it is {n}.', 'தந்தியை நீளமாக்க, குதிரையிலிருந்து விலகி நகர்த்து; இப்போது {n}.'], half: ['Half of 100 is 50.', '100-இல் பாதி 50.'], pa: ['⅔ of 100 is about 67.', '100-இல் ⅔ ஏறக்குறைய 67.'], ma: ['¾ of 100 is 75.', '100-இல் ¾ = 75.'] },
      h3: ['Set the length to {a}.', 'நீளத்தை {a} ஆக அமை.'],
      ans: { pick: ['{s}: the shorter string', '{s}: குறுகிய தந்தி'], pickLow: ['{s}: the longer string', '{s}: நீளமான தந்தி'], higher: ['{n} of 100 or shorter', '100-இல் {n} அல்லது அதற்குக் குறைவு'], lower: ['{n} of 100 or longer', '100-இல் {n} அல்லது அதற்கு அதிகம்'], target: ['about {n} of 100', '100-இல் ஏறக்குறைய {n}'] },
      given: ['{n} of 100', '100-இல் {n}'],
      y1: ['A plucked string swings back and forth. A shorter piece of string swings faster, so the note is higher.', 'மீட்டிய தந்தி முன்னும் பின்னும் ஆடுகிறது. குறுகிய தந்தி வேகமாக ஆடுவதால் ஸ்வரம் உயர்கிறது.'],
      y2: ['Half the length swings twice as fast: the same note, one octave higher (Sa to upper Sa). ⅔ gives Pa and ¾ gives Ma.', 'பாதி நீளம் இரு மடங்கு வேகமாக ஆடும்: அதே ஸ்வரம், ஒரு ஸ்தாயி மேலே (ஸ → மேல் ஸ). ⅔ நீளம் ப, ¾ நீளம் ம.'],
      y3: ['On a veena you press the string onto a fret (மெட்டு); the part between your finger and the bridge vibrates.', 'வீணையில் தந்தியை மெட்டின் (fret) மேல் அழுத்துகிறோம்; விரலுக்கும் குதிரைக்கும் இடையிலுள்ள பகுதி அதிர்கிறது.'],
      rule: ['Shorter string → faster vibration → higher pitch.', 'குறுகிய தந்தி → வேகமான அதிர்வு → உயர்ந்த சுருதி.'],
    },
    listen: {
      snd: ['Sound {n}', 'ஒலி {n}'],
      q: { loud: ['Tap each sound to hear it. Which sound is louder?', 'ஒவ்வொரு ஒலியையும் தட்டிக் கேள். எது உரத்த ஒலி?'], soft: ['Tap each sound to hear it. Which sound is softer?', 'ஒவ்வொரு ஒலியையும் தட்டிக் கேள். எது மெல்லிய ஒலி?'], high: ['Tap each sound. Which sound is higher?', 'ஒவ்வொரு ஒலியையும் தட்டு. எது உயர்ந்த ஒலி?'], low: ['Tap each sound. Which sound is lower?', 'ஒவ்வொரு ஒலியையும் தட்டு. எது தாழ்ந்த ஒலி?'], highest: ['Tap each sound. Which one is the highest?', 'ஒவ்வொரு ஒலியையும் தட்டு. எது மிக உயர்ந்தது?'], lowest: ['Tap each sound. Which one is the lowest?', 'ஒவ்வொரு ஒலியையும் தட்டு. எது மிகத் தாழ்ந்தது?'], combo: ['Find the sound that is {a} and {b}.', '{a}, {b} ஆன ஒலியைக் கண்டுபிடி.'] },
      w: { high: ['high', 'உயர்ந்த'], low: ['low', 'தாழ்ந்த'], loud: ['loud', 'உரத்த'], soft: ['soft', 'மெல்லிய'] },
      h1: ['Read the waves. Tall waves are loud. Waves packed close together are high.', 'அலைகளைப் படி. உயரமான அலை = உரத்த ஒலி. நெருக்கமான அலைகள் = உயர்ந்த ஒலி.'],
      h2: { loud: ['Compare how tall the waves are.', 'அலைகள் எவ்வளவு உயரம் என்று ஒப்பிடு.'], pitch: ['Count the waves in each box: more waves means faster vibration.', 'ஒவ்வொரு பெட்டியிலும் அலைகளை எண்ணு: அதிக அலைகள் = வேகமான அதிர்வு.'], combo: ['First find the {a} sounds, then pick the {b} one.', 'முதலில் {a} ஒலிகளைக் கண்டுபிடி, பிறகு அவற்றில் {b} ஒன்றைத் தேர்ந்தெடு.'] },
      h3: ['The answer: {a}.', 'விடை: {a}.'],
      y1: ['Loudness is how big the vibration is: a big swing makes a tall wave and a loud sound.', 'உரப்பு என்பது அதிர்வு எவ்வளவு பெரியது என்பது: பெரிய ஆட்டம் உயரமான அலையையும் உரத்த ஒலியையும் தரும்.'],
      y2: ['Pitch is how fast it vibrates: fast vibration packs the waves close and sounds high.', 'சுருதி (pitch) என்பது அதிர்வின் வேகம்: வேகமான அதிர்வு அலைகளை நெருக்கமாக்கி உயர்ந்த ஒலியாகக் கேட்கிறது.'],
      rule: ['Tall wave = loud. Close waves = high.', 'உயரமான அலை = உரத்த ஒலி. நெருக்கமான அலைகள் = உயர்ந்த ஒலி.'],
    },
    syll: {
      q: ['Say the word, then clap once for each syllable.', 'சொல்லைச் சொல்லிவிட்டு, ஒவ்வொரு அசைக்கும் (syllable) ஒரு முறை கைதட்டு.'],
      q4: ['Which word has {n} syllables?', 'எந்தச் சொல்லில் {n} அசைகள் உள்ளன?'],
      pad: ['Clap', 'கைதட்டு'], padLabel: ['Clap pad. Tap it or press Space once for each syllable.', 'கைதட்டும் பலகை. ஒவ்வொரு அசைக்கும் ஒரு முறை தட்டு அல்லது Space அழுத்து.'],
      count: ['Claps: {n}', 'கைதட்டல்: {n}'], given: ['{n} claps', '{n} கைதட்டல்கள்'], sayWord: ['Say the word', 'சொல்லைக் கேள்'],
      h1: ['Say the word slowly with your hand under your chin. Each time your chin drops is one syllable.', 'கையைத் தாடைக்குக் கீழ் வைத்து, சொல்லை மெதுவாகச் சொல். ஒவ்வொரு முறை தாடை இறங்கும்போதும் ஒரு அசை.'],
      h2: ['It starts with {first}. Keep going until the word ends.', 'அது {first} என்று தொடங்குகிறது. சொல் முடியும் வரை தொடர்.'],
      h3: ['{split} = {n}', '{split} = {n}'],
      y1: ['{split}: {n} syllables, {n} claps.', '{split}: {n} அசைகள், {n} கைதட்டல்கள்.'], y1one: ['{split}: 1 syllable, 1 clap.', '{split}: 1 அசை, 1 கைதட்டல்.'],
      y2: ['Each syllable has one vowel sound in it.', 'ஒவ்வொரு அசையிலும் ஒரு உயிர் ஒலி (vowel sound) இருக்கும்.'],
      rule: ['One clap for each syllable.', 'ஒவ்வொரு அசைக்கும் ஒரு கைதட்டல்.'],
    },
    rhyme: {
      q: ['Read the chant. Which word fits the gap and rhymes?', 'பாட்டைப் படி. இடைவெளியில் பொருந்தி, ஒரே ஓசையில் முடியும் சொல் எது?'],
      q4: ['Which word rhymes with “{w}”?', '“{w}” என்ற சொல்லுடன் ஒரே ஓசையில் முடியும் சொல் எது?'],
      h1: ['Say the last word of the first line out loud: {end}.', 'முதல் வரியின் கடைசிச் சொல்லைச் சத்தமாகச் சொல்: {end}.'],
      h2: ['The missing word should end with the same sound as {end}.', 'விடுபட்ட சொல் {end} போலவே அதே ஓசையில் முடிய வேண்டும்.'],
      h4a: ['Say the words out loud. Listen to the ending, not the spelling.', 'சொற்களைச் சத்தமாகச் சொல். எழுத்தைப் பார்க்காதே, முடிவு ஓசையைக் கேள்.'],
      h4b: ['{w} ends with the sound “{s}”.', '{w} “{s}” என்ற ஓசையில் முடிகிறது.'],
      h3: ['{a} rhymes with {end}.', '{a}, {end} உடன் ஒரே ஓசையில் முடிகிறது.'],
      y1: ['{end} and {a} rhyme: they end with the same sound.', '{end}, {a} இரண்டும் இயைபு: ஒரே ஓசையில் முடிகின்றன.'],
      y2: ['Chants and songs use rhymes so they are easy to remember and fun to clap along to.', 'பாடல்களில் இயைபு இருப்பதால் நினைவில் வைப்பது எளிது, சேர்ந்து கைதட்டவும் இனிமை.'],
      y4: ['{w} and {a} end with the same sound, “{s}”, even though they are spelt differently. {d} looks similar but sounds different.', '{w}, {a} இரண்டும் “{s}” என்ற ஒரே ஓசையில் முடிகின்றன, எழுத்துகள் வேறாக இருந்தாலும். {d} பார்க்க ஒத்திருந்தாலும் ஓசை வேறு.'],
      rule: ['Rhymes are about sound, not spelling.', 'இயைபு என்பது ஓசையைப் பொறுத்தது, எழுத்தைப் பொறுத்தது அல்ல.'],
      chant: ['Chant', 'பாட்டு'],
    },
    free: {
      title: ['Free play', 'விருப்பம்போல் வாசி'], lead: ['Play sa re ga ma pa dha ni on the pad. Record a short tune and play it back.', 'பலகையில் ஸ ரி க ம ப த நி வாசி. ஒரு சிறு இசைத் துணுக்கைப் பதிவு செய்து மீண்டும் கேள்.'],
      voice: ['Instrument', 'கருவி'], flute: ['Flute', 'புல்லாங்குழல்'], veena: ['Veena', 'வீணை'], drum: ['Mridangam', 'மிருதங்கம்'],
      keys: ['Keys 1 to 8, or A S D F G H J K, play the notes.', '1 முதல் 8 வரை, அல்லது A S D F G H J K விசைகள் ஸ்வரங்களை வாசிக்கும்.'], pad: ['Swaram pad', 'ஸ்வரப் பலகை'],
      key: ['{s}, key {k}', '{s}, விசை {k}'],
      rec: ['Record', 'பதிவு செய்'], stop: ['Stop', 'நிறுத்து'], playback: ['Play back', 'மீண்டும் கேள்'], save: ['Save tune', 'துணுக்கைச் சேமி'],
      recOn: ['Recording. Play some notes, then press Stop.', 'பதிவாகிறது. சில ஸ்வரங்களை வாசித்து, நிறுத்து அழுத்து.'], recDone: ['{n} notes recorded.', '{n} ஸ்வரங்கள் பதிவாயின.'], recNone: ['Nothing recorded yet.', 'இன்னும் எதுவும் பதிவாகவில்லை.'],
      saved: ['Saved tunes', 'சேமித்த துணுக்குகள்'], none: ['No saved tunes yet. Record one and press Save tune.', 'இன்னும் சேமித்த துணுக்கு இல்லை. ஒன்றைப் பதிவு செய்து சேமி அழுத்து.'],
      tune: ['Tune {n}', 'துணுக்கு {n}'], meta: ['{n} notes · {s} s · {v}', '{n} ஸ்வரங்கள் · {s} வி · {v}'], full: ['10 tunes saved. Delete one to save another.', '10 துணுக்குகள் சேமிக்கப்பட்டுள்ளன. புதியதைச் சேமிக்க ஒன்றை நீக்கு.'], savedOk: ['Tune saved.', 'துணுக்கு சேமிக்கப்பட்டது.'],
      del: ['Delete {t}', '{t}-ஐ நீக்கு'], playT: ['Play {t}', '{t}-ஐ வாசி'], lessons: ['Music lessons', 'இசைப் பாடங்கள்'], now: ['Playing {s}', '{s} வாசிக்கிறது'],
    },
    sw: { 0: ['Sa', 'ஸ'], 1: ['Ri', 'ரி'], 2: ['Ga', 'க'], 3: ['Ma', 'ம'], 4: ['Pa', 'ப'], 5: ['Dha', 'த'], 6: ['Ni', 'நி'], 7: ['upper Sa', 'மேல் ஸ'] },
    link: ['Try free play', 'விருப்பம்போல் வாசித்துப் பார்'],
  } });

  // ---------------------------------------------------------------- settings
  const DEF = () => ({ vol: 0.8, mute: false, buzz: true, tunes: [] });
  function cfg() {
    const p = Store.current(); if (!p) return (cfg.tmp ||= DEF());
    p.extras ||= {}; const m = (p.extras.music ||= DEF());
    if (!Array.isArray(m.tunes)) m.tunes = []; if (m.vol == null) m.vol = 0.8; if (m.buzz == null) m.buzz = true;
    return m;
  }
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- audio (Web Audio only; created on a user gesture)
  const A = { ctx: null, out: null, noise: null, ks: new Map() };
  function ac() {
    if (!A.ctx) {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      try { A.ctx = new C(); } catch { return null; }
      A.out = A.ctx.createGain(); const comp = A.ctx.createDynamicsCompressor(); A.out.connect(comp); comp.connect(A.ctx.destination); setVol();
    }
    if (A.ctx.state === 'suspended') A.ctx.resume().catch(() => {});
    return A.ctx;
  }
  function setVol() { if (A.out) { const s = cfg(); A.out.gain.setTargetAtTime(s.mute ? 0 : s.vol * s.vol, A.ctx.currentTime, 0.02); } }
  function noise(c) { if (!A.noise) { const b = c.createBuffer(1, c.sampleRate, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; A.noise = b; } const s = c.createBufferSource(); s.buffer = A.noise; s.loop = true; return s; }
  const gain = (c, v = 1) => { const g = c.createGain(); g.gain.value = v; return g; };
  function decay(g, w, peak, att, len) { g.gain.setValueAtTime(0.0001, w); g.gain.linearRampToValueAtTime(peak, w + att); g.gain.exponentialRampToValueAtTime(0.0001, w + att + len); }
  // Karplus–Strong plucked string, rendered once per pitch
  function ksBuf(c, f) {
    const key = Math.round(f * 4); if (A.ks.has(key)) return A.ks.get(key);
    const sr = c.sampleRate, len = Math.floor(sr * 2.2), b = c.createBuffer(1, len, sr), d = b.getChannelData(0), N = Math.max(2, Math.round(sr / f));
    let prev = 0; for (let i = 0; i < N; i++) { const x = Math.random() * 2 - 1; d[i] = (x + prev) * 0.5; prev = x; }
    const fb = 0.4985 + Math.min(0.0012, f / 400000);
    for (let i = N; i < len; i++) d[i] = fb * (d[i - N] + (i - N - 1 >= 0 ? d[i - N - 1] : 0));
    for (let i = len - 2000; i < len; i++) d[i] *= (len - i) / 2000;
    A.ks.set(key, b); return b;
  }
  const VO = {
    tone(c, f, w, dur = .6, v = .6) { const o = c.createOscillator(), g = gain(c, 0); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, w); g.gain.linearRampToValueAtTime(v * .5, w + .03); g.gain.setValueAtTime(v * .5, w + dur); g.gain.exponentialRampToValueAtTime(0.0001, w + dur + .15); o.connect(g).connect(A.out); o.start(w); o.stop(w + dur + .2); },
    flute(c, f, w, dur = .5, v = .6) {
      const o = c.createOscillator(), o2 = c.createOscillator(), g = gain(c, 0), g2 = gain(c, .12), lfo = c.createOscillator(), lg = gain(c, f * .006);
      o.type = o2.type = 'sine'; o.frequency.value = f; o2.frequency.value = f * 2; lfo.frequency.value = 5.2;
      lfo.connect(lg); lg.connect(o.frequency); o2.connect(g2).connect(g); o.connect(g);
      g.gain.setValueAtTime(0.0001, w); g.gain.linearRampToValueAtTime(v * .42, w + .08); g.gain.setValueAtTime(v * .42, w + dur); g.gain.exponentialRampToValueAtTime(0.0001, w + dur + .28); g.connect(A.out);
      const n = noise(c), bp = c.createBiquadFilter(), ng = gain(c, 0); bp.type = 'bandpass'; bp.frequency.value = Math.min(6000, f * 2.5); bp.Q.value = .9;
      ng.gain.setValueAtTime(0.0001, w); ng.gain.linearRampToValueAtTime(v * .16, w + .03); ng.gain.exponentialRampToValueAtTime(v * .03, w + .22); ng.gain.exponentialRampToValueAtTime(0.0001, w + dur + .25);
      n.connect(bp).connect(ng).connect(A.out);
      [o, o2, lfo, n].forEach(x => { x.start(w); x.stop(w + dur + .35); });
    },
    veena(c, f, w, dur, v = .7) { const s = c.createBufferSource(), lp = c.createBiquadFilter(), g = gain(c, v * .9); s.buffer = ksBuf(c, f); lp.type = 'lowpass'; lp.frequency.value = 3800; s.connect(lp).connect(g).connect(A.out); s.start(w); },
    drum(c, f, w, dur, v = .8) { // membrane: pitched sine that settles, plus a short slap of noise
      const o = c.createOscillator(), g = gain(c, 0), o2 = c.createOscillator(), g2 = gain(c, 0); o.type = 'sine'; o2.type = 'triangle';
      o.frequency.setValueAtTime(f * 1.45, w); o.frequency.exponentialRampToValueAtTime(f, w + .05); o2.frequency.setValueAtTime(f * 2.9, w); o2.frequency.exponentialRampToValueAtTime(f * 2, w + .05);
      decay(g, w, v * .8, .004, .55); decay(g2, w, v * .18, .004, .25); o.connect(g).connect(A.out); o2.connect(g2).connect(A.out);
      const n = noise(c), hp = c.createBiquadFilter(), ng = gain(c, 0); hp.type = 'highpass'; hp.frequency.value = 1200; decay(ng, w, v * .35, .002, .05); n.connect(hp).connect(ng).connect(A.out);
      [o, o2, n].forEach(x => { x.start(w); x.stop(w + .7); });
    },
    glass(c, f, w, dur, v = .7) { [[1, .5, 2.6], [2.32, .12, 1.3], [4.25, .05, .6]].forEach(([m, a, d]) => { const o = c.createOscillator(), g = gain(c, 0); o.type = 'sine'; o.frequency.value = f * m; decay(g, w, v * a, .003, d); o.connect(g).connect(A.out); o.start(w); o.stop(w + d + .1); }); },
    clap(c, f, w, dur, v = .8) { const n = noise(c), bp = c.createBiquadFilter(), g = gain(c, 0); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = .7; g.gain.setValueAtTime(0.0001, w); [0, .011, .022].forEach(d => { g.gain.setValueAtTime(v, w + d); g.gain.exponentialRampToValueAtTime(v * .2, w + d + .009); }); g.gain.setValueAtTime(v * .7, w + .03); g.gain.exponentialRampToValueAtTime(0.0001, w + .2); n.connect(bp).connect(g).connect(A.out); n.start(w); n.stop(w + .25); },
    tick(c, f, w, dur, v = .4) { const o = c.createOscillator(), g = gain(c, 0); o.frequency.value = f || 1500; decay(g, w, v * .35, .002, .05); o.connect(g).connect(A.out); o.start(w); o.stop(w + .08); },
    whoosh(c, f, w, dur, v = .6) { const n = noise(c), bp = c.createBiquadFilter(), g = gain(c, 0); bp.type = 'bandpass'; bp.Q.value = 1.2; bp.frequency.setValueAtTime(400, w); bp.frequency.exponentialRampToValueAtTime(1600, w + .28); g.gain.setValueAtTime(0.0001, w); g.gain.linearRampToValueAtTime(v * .3, w + .12); g.gain.exponentialRampToValueAtTime(0.0001, w + .34); n.connect(bp).connect(g).connect(A.out); n.start(w); n.stop(w + .4); },
  };
  function sound(kind, f, delay = 0, dur, v) { const c = ac(); if (!c || cfg().mute) return; try { VO[kind](c, f, c.currentTime + .02 + delay, dur, v); } catch (e) { console.warn('music', e); } }
  // timed sequences: audio scheduled on the context clock, visual cues on timers (they run with sound off too)
  const TM = []; function stopSeq() { TM.splice(0).forEach(clearTimeout); }
  function seq(events, lead = .12) {
    stopSeq(); const c = ac(), on = c && !cfg().mute, base = c ? c.currentTime + lead : 0;
    events.forEach(e => { if (on && e.kind) { try { VO[e.kind](c, e.f, base + e.at, e.dur, e.v); } catch {} } if (e.cue) TM.push(setTimeout(e.cue, (lead + e.at) * 1000)); });
  }
  addEventListener('hashchange', stopSeq);
  function pulse(el) { if (!el) return; if (reduced()) { el.classList.add('lit'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('lit'), 200); return; } el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); }
  function buzz(ms = 25) { if (cfg().buzz && navigator.vibrate) { try { navigator.vibrate(ms); } catch {} } }
  function flash(el, ms = 260) { if (!el) return; el.classList.add('on'); setTimeout(() => el.classList.remove('on'), ms); }

  // ---------------------------------------------------------------- sound settings bar (mute, volume, vibrate, free play)
  function toolbar(free = true) {
    const s = cfg();
    return `<div class="mu-bar" role="group" aria-label="${t('music.ui.sound')}">
      <button type="button" class="k-iconbtn mu-mute" data-mu-mute aria-pressed="${s.mute}" aria-label="${s.mute ? t('music.ui.unmute') : t('music.ui.mute')}" title="${s.mute ? t('music.ui.soundOff') : t('music.ui.soundOn')}"><svg class="k-icon" aria-hidden="true"><use href="#i-sound"/></svg></button>
      <input type="range" class="mu-volr" min="0" max="1" step="0.05" value="${s.vol}" data-mu-vol aria-label="${t('music.ui.vol')}">
      ${navigator.vibrate ? `<button type="button" class="k-btn k-btn-outline k-btn-sm pill mu-buzz" data-mu-buzz aria-pressed="${s.buzz}">${t('music.ui.buzz')}</button>` : ''}
      ${free ? `<a class="mu-freelink" href="#/music">${t('music.ui.free')}</a>` : ''}
    </div>`;
  }
  function syncBars() { const s = cfg(); document.querySelectorAll('[data-mu-mute]').forEach(b => { b.setAttribute('aria-pressed', s.mute); b.title = s.mute ? t('music.ui.soundOff') : t('music.ui.soundOn'); b.setAttribute('aria-label', s.mute ? t('music.ui.unmute') : t('music.ui.mute')); }); document.querySelectorAll('[data-mu-buzz]').forEach(b => b.setAttribute('aria-pressed', s.buzz)); }
  document.addEventListener('click', e => {
    const m = e.target.closest('[data-mu-mute]'); if (m) { const s = cfg(); s.mute = !s.mute; ac(); setVol(); Store.save(); syncBars(); return; }
    const z = e.target.closest('[data-mu-buzz]'); if (z) { const s = cfg(); s.buzz = !s.buzz; Store.save(); syncBars(); buzz(40); return; }
    const p = e.target.closest('[data-mu-play]'); if (p) { let spec; try { spec = JSON.parse(p.dataset.muPlay); } catch { return; } const box = p.closest('.mu-box') || p.parentElement; if (spec.k === 'rhythm') playRhythm(box, spec.d, spec.bpm); else if (spec.k === 'tala') playTala(box, spec.bpm); }
  });
  document.addEventListener('input', e => { if (e.target.matches?.('[data-mu-vol]')) { const s = cfg(); s.vol = +e.target.value; if (s.mute && s.vol > 0) s.mute = false; ac(); setVol(); syncBars(); clearTimeout(cfg.st); cfg.st = setTimeout(() => Store.save(), 400); } });
  // one Space-key handler for whichever tap pad is on screen
  let padKey = null;
  document.addEventListener('keydown', e => { if (!padKey || !document.body.contains(padKey.el)) { padKey = null; return; } if (e.key !== ' ' || e.repeat) return; const a = document.activeElement; if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.closest?.('.lessoncard, .k-dialog'))) return; e.preventDefault(); padKey.fn(); }, true);

  // ---------------------------------------------------------------- notation (crisp SVG, notes take room in proportion to how long they last)
  const NOTE_NAME = { 4: 'whole', 3: 'dhalf', 2: 'half', 1.5: 'dquarter', 1: 'quarter', 0.5: 'eighth' };
  const nname = d => t('music.note.' + (d < 0 ? 'rest' : NOTE_NAME[d]));
  const beatsTxt = d => d === 1 ? t('music.note.beat1') : t('music.note.beats', { n: fmt(d) });
  const SYLK = { 0.5: 'e', 1: 'q', 1.5: 'dq', 2: 'h', 3: 'dh', 4: 'w' };
  const sylOf = d => d < 0 ? t('music.syl.rest') : t('music.syl.' + SYLK[d]);
  function glyph(d, x, y, cls = '') { // one note or rest centred on head x, staff line y
    const head = (fill) => `<ellipse cx="${x}" cy="${y}" rx="7.4" ry="5.4" transform="rotate(-22 ${x} ${y})" fill="${fill ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${fill ? 0 : 2.4}"/>`;
    const stem = `<line x1="${x + 6.6}" y1="${y - 2}" x2="${x + 6.6}" y2="${y - 36}" stroke="currentColor" stroke-width="2.2"/>`;
    const dot = `<circle cx="${x + 14}" cy="${y - 3}" r="2.6" fill="currentColor"/>`;
    let s = '';
    if (d === 4) s = `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="none" stroke="currentColor" stroke-width="3.2"/>`;
    else if (d === 3) s = head(false) + stem + dot;
    else if (d === 2) s = head(false) + stem;
    else if (d === 1.5) s = head(true) + stem + dot;
    else if (d === 1) s = head(true) + stem;
    else if (d === 0.5) s = head(true) + stem + `<path d="M${x + 6.6} ${y - 36} q 9 7 7 19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" class="flag"/>`;
    else if (d === -1) s = `<path d="M${x - 3} ${y - 20} l6 7 -6 6 6 7 c-5 -2 -8 1 -4 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
    else if (d === -2) s = `<rect x="${x - 7}" y="${y - 6}" width="14" height="6" fill="currentColor"/>`;
    return `<g class="mu-n ${cls}">${s}</g>`;
  }
  function score(durs, o = {}) {
    const W = o.w || 56, y = 62, gapLen = o.gap || 1; let x = 26, beat = 0; const it = [];
    durs.forEach((d, i) => { const len = d == null ? gapLen : Math.abs(d); it.push({ d, i, x, beat, len }); x += len * W; beat += len; });
    const width = x + 14;
    // beam eighth pairs that start on a beat
    const beamed = new Set(); it.forEach((a, k) => { const b = it[k + 1]; if (a.d === .5 && b?.d === .5 && a.beat % 1 === 0 && !beamed.has(k)) { beamed.add(k); beamed.add(k + 1); } });
    let body = '';
    it.forEach((a, k) => {
      const hx = a.x + 12;
      if (a.d == null) { body += `<g class="mu-n mu-gap" data-i="${a.i}"><rect x="${a.x + 2}" y="${y - 30}" width="${a.len * W - 8}" height="44" rx="8" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/><text x="${a.x + 2 + (a.len * W - 8) / 2}" y="${y - 2}" text-anchor="middle" font-size="22" font-weight="900" fill="currentColor">?</text></g>`; return; }
      let g = glyph(a.d, hx, y); if (beamed.has(k)) g = g.replace(/<path[^>]*class="flag"\/>/, '');
      body += `<g data-i="${a.i}" class="mu-ng">${g}</g>`;
      if (beamed.has(k) && it[k + 1]?.d === .5 && beamed.has(k + 1) && a.beat % 1 === 0) body += `<rect x="${hx + 5.5}" y="${y - 38}" width="${it[k + 1].x - a.x + 2.2}" height="5" fill="currentColor" class="mu-beam"/>`;
    });
    let counts = '';
    if (o.counts !== false) { const tot = it.reduce((s, a) => s + a.len, 0); for (let b = 0; b < tot; b++) counts += `<text x="${26 + b * W + 12}" y="${y + 34}" text-anchor="middle" font-size="14" font-weight="700" class="mu-cnt">${b + 1 + (o.offset || 0)}</text>`; }
    const bars = (o.bars || []).map(b => `<line x1="${26 + b * W - 4}" y1="${y - 22}" x2="${26 + b * W - 4}" y2="${y + 22}" stroke="currentColor" stroke-width="1.5"/>`).join('');
    const label = t('music.score.label', { list: durs.map(d => d == null ? t('music.score.gap') : nname(d)).join(', ') });
    return `<svg class="mu-score" viewBox="0 0 ${width} 108" role="img" aria-label="${esc(label)}"><line x1="10" y1="${y}" x2="${width - 6}" y2="${y}" class="mu-staff" stroke-width="1.5"/><line x1="12" y1="${y - 22}" x2="12" y2="${y + 22}" stroke="currentColor" stroke-width="1.5"/><line x1="${width - 8}" y1="${y - 22}" x2="${width - 8}" y2="${y + 22}" stroke="currentColor" stroke-width="3"/>${bars}${body}${counts}</svg>`;
  }
  const noteVis = d => `<svg class="mu-glyph" viewBox="0 0 40 60" role="img" aria-label="${esc(nname(d))}">${glyph(d, 17, 44)}</svg>`;
  // 3D blocks: each note as a block as long as it lasts
  const BLK = { 4: '#6d6ad8', 3: '#3b82c4', 2: '#3b82c4', 1.5: '#16a39c', 1: '#16a39c', 0.5: '#e2a336' };
  function blocks(durs, gapAt = -1, gapLen = 0) {
    const Sc = R3.Scene({ yaw: 0, pitch: 24, scale: 15 }); let x = 0;
    durs.forEach((d, i) => { const len = d == null ? gapLen : Math.abs(d); const w = len * 3 - .25;
      if (d != null && d > 0) Sc.group(1).box(x, 0, 0, w, 1.4, 1.4, BLK[d] || '#16a39c').text(x + w / 2, -.02, .7, fmt(d), { size: .8, flat: false });
      else if (d == null || i === gapAt) Sc.group(1).box(x, 0, 0, w, 1.4, 1.4, '#e2a336').text(x + w / 2, -.02, .7, fmt(len), { size: .8, flat: false });
      else Sc.group(0).box(x, 0, 0, w, 1.4, .25, '#5b6275');
      x += len * 3; });
    return Sc.svg(t('music.tap.grid'));
  }
  const sum = d => d.reduce((a, b) => a + (b == null ? 0 : Math.abs(b)), 0);
  const expr = d => d.map(x => fmt(Math.abs(x))).join(' + ');
  const playBtn = (spec, label) => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill mu-play" data-mu-play="${esc(JSON.stringify(spec))}"><svg class="k-icon" aria-hidden="true"><use href="#i-sound"/></svg><span>${label}</span></button>`;
  const ring = () => `<span class="mu-ring" aria-hidden="true"></span>`;

  function playRhythm(box, durs, bpm = 76) {
    const sp = 60 / bpm, ev = []; let at = 0;
    const tot = sum(durs); for (let b = 0; b < tot; b++) ev.push({ at: b * sp, kind: 'tick', f: b === 0 ? 1900 : 1400, v: .35, cue: () => { pulse(box.querySelector('.mu-ring')); } });
    durs.forEach((d, i) => { const len = Math.abs(d); if (d > 0) ev.push({ at, kind: 'drum', f: 150, v: .8, cue: () => { buzz(30); const g = box.querySelector(`.mu-score [data-i="${i}"]`); flash(g, Math.max(180, len * sp * 1000 - 60)); } }); at += len * sp; });
    seq(ev);
  }

  // ---------------------------------------------------------------- Maths: tap the rhythm
  const TAPS = {
    1: [[1, 1, 1, 1], [1, 1, 2], [2, 1, 1], [1, 1, 1, -1], [1, -1, 1, 1]],
    2: [[1, 1, .5, .5, 1], [.5, .5, 1, 1, 1], [1, .5, .5, 1, 1], [2, .5, .5, 1], [1, 1, .5, .5, -1]],
    3: [[.5, .5, .5, .5, 1, 1], [1, .5, .5, 2], [.5, .5, 1, .5, .5, 1], [2, 1, .5, .5], [1, -1, .5, .5, 1]],
    4: [[1.5, .5, 1, 1], [.5, .5, -1, .5, .5, 1], [1, 1.5, .5, 1], [1.5, .5, .5, .5, 1], [.5, .5, .5, .5, 2]],
  };
  const onsets = durs => { let at = 0; const o = []; durs.forEach(d => { if (d > 0) o.push(at); at += Math.abs(d); }); return o; };
  const posTxt = b => fmt(b + 1);
  Engine.skill({ id: 'mu.tap', subject: 'maths', topic: 'music', name: 'music.skill.tap', bands: { young: [1, 2], older: [2, 4] }, gen(l, r, ctx) {
    const durs = r.pick(TAPS[l]), bpm = l <= 1 ? 72 : l === 2 ? 76 : 84, on = onsets(durs), tot = sum(durs), sp = 60000 / bpm;
    const syl = durs.map(sylOf).join(' '), cnt = Array.from({ length: tot }, (_, i) => i + 1).join(', ');
    let taps = [], t0 = 0, metro = [];
    const q = { kind: 'custom', prompt: t('music.tap.q'), promptText: t('music.tap.q'), beats: { on, ms: sp },
      hints: ladder(t('music.tap.h1'), t('music.tap.h2', { count: cnt, on: on.map(posTxt).join(', ') }), { text: t('music.tap.h3', { syl }), vis: blocks(durs) }), hintRevealsAnswer: true,
      answerText: `${syl} <span class="muted">(${on.map(posTxt).join(', ')})</span>`,
      mount(el, api) {
        el.innerHTML = `${toolbar()}<div class="board mu-box mu-tapboard">${ring()}${score(durs)}<div class="mu-boardrow">${playBtn({ k: 'rhythm', d: durs, bpm }, t('music.ui.hear'))}</div></div><p class="caption">${t('music.ui.watch')}</p>
          <button type="button" class="mu-pad" aria-label="${t('music.tap.padLabel')}" aria-describedby="mu-tapst"><span class="mu-pad-face">${ring()}<b>${t('music.tap.pad')}</b><small>Space</small></span></button>
          <p class="mu-status" id="mu-tapst" aria-live="polite">${t('music.tap.first')}</p><div class="mu-taps" aria-hidden="true"></div>
          <div class="controls"><button type="button" class="k-btn k-btn-ghost k-btn-sm mu-reset" disabled><svg class="k-icon" aria-hidden="true"><use href="#i-review"/></svg><span>${t('music.ui.again')}</span></button></div>`;
        const pad = el.querySelector('.mu-pad'), st = el.querySelector('.mu-status'), reset = el.querySelector('.mu-reset'), padRing = pad.querySelector('.mu-ring');
        const draw = () => { el.querySelector('.mu-taps').innerHTML = timeline(on, taps.map(x => (x - t0) / sp), tot); };
        const tap = () => {
          if (Engine.round?.answered || taps.length >= on.length) return;
          const now = performance.now(); sound('drum', 170, 0, 0, .8); buzz(20); pulse(padRing); pad.classList.add('hit'); setTimeout(() => pad.classList.remove('hit'), 120);
          if (!taps.length) { t0 = now; stopSeq(); metro.forEach(clearTimeout); metro = []; for (let b = 1; b < tot; b++) metro.push(setTimeout(() => pulse(el.querySelector('.mu-tapboard .mu-ring')), b * sp)); pulse(el.querySelector('.mu-tapboard .mu-ring')); }
          taps.push(now); reset.disabled = false; draw();
          st.textContent = taps.length >= on.length ? t('music.tap.ready') : t('music.tap.status', { a: taps.length, b: on.length });
          api.ready(taps.length >= on.length);
        };
        pad.addEventListener('pointerdown', e => { e.preventDefault(); tap(); });
        pad.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.repeat) { e.preventDefault(); e.stopPropagation(); tap(); } });
        padKey = { el: pad, fn: tap };
        reset.onclick = () => { taps = []; metro.forEach(clearTimeout); metro = []; draw(); st.textContent = t('music.tap.first'); reset.disabled = true; api.ready(false); };
        draw();
      },
      check() {
        const tau = taps.map(x => x - t0), e = on.map(b => b * sp);
        let s = 1; if (taps.length > 1) { const num = e.reduce((a, v, i) => a + v * (tau[i] || 0), 0), den = e.reduce((a, v) => a + v * v, 0) || 1; s = Math.max(.85, Math.min(1.15, num / den)); }
        const ok = e.map((v, i) => tau[i] != null && Math.abs(tau[i] - s * v) <= 180);
        const good = ok.filter(Boolean).length;
        q.why.steps[2] = { text: t('music.tap.given', { a: good, b: on.length }), vis: `<div class="mu-taps">${timeline(on, tau.map(x => x / s / sp), tot, ok)}</div>` };
        return { correct: taps.length === on.length && good === on.length, given: t('music.tap.given', { a: good, b: on.length }) };
      },
      why: { steps: [{ text: t('music.tap.y1') }, { text: t('music.tap.y2', { expr: expr(durs), sum: fmt(tot) }), vis: blocks(durs) }], rule: t('music.tap.rule') } };
    return q;
  } });
  function timeline(on, taps, tot, ok) { // the beat grid (ticks) with the expected notes and the child's taps
    const W = 300, x = b => 14 + b / Math.max(tot, 1) * (W - 28);
    const grid = Array.from({ length: tot + 1 }, (_, b) => `<line x1="${x(b)}" y1="10" x2="${x(b)}" y2="46" stroke="currentColor" stroke-opacity=".25"/>`).join('');
    const exp = on.map(b => `<rect x="${x(b) - 4}" y="14" width="8" height="8" rx="2" class="mu-exp"/>`).join('');
    const tp = taps.filter(v => v <= tot + 1).map((v, i) => `<circle cx="${Math.min(W - 6, x(v))}" cy="36" r="5" class="mu-tp ${ok ? (ok[i] ? 'ok' : 'off') : ''}"/>`).join('');
    return `<svg viewBox="0 0 ${W} 56" class="mu-tl">${grid}${exp}${tp}</svg>`;
  }

  // ---------------------------------------------------------------- Maths: beats in a bar
  const BARS = {
    1: r => Array(r.int(2, 5)).fill(1),
    2: r => r.pick([[2, 1, 1], [1, 1, 2], [2, 2], [1, 2, 1], [2, 1], [1, 1, 1, 1, 1]]),
    3: r => r.pick([[1, .5, .5, 2], [.5, .5, .5, .5, 1], [2, .5, .5, 1], [.5, .5, 1, 1, 1], [1, 1, .5, .5], [4]]),
    4: r => r.pick([[3, 1], [1.5, .5, 2], [4, 2, 2], [2, .5, .5, 1, 4], [1.5, .5, 1.5, .5], [.5, .5, .5, .5, 3]]),
  };
  Engine.skill({ id: 'mu.count', subject: 'maths', topic: 'music', name: 'music.skill.count', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const d = BARS[l](r), tot = sum(d), two = l === 4 && tot > 4, bpm = 76;
    const vis = `<div class="mu-box">${ring()}${score(d, { bars: two ? [4] : [] })}<div class="mu-boardrow">${playBtn({ k: 'rhythm', d, bpm }, t('music.ui.hear'))}</div></div>`;
    const qt = l === 1 ? t('music.count.qNotes') : two ? t('music.count.q2') : t('music.count.q');
    return { kind: 'num', prompt: qt, promptText: qt, visual: vis, answer: tot,
      hints: ladder(t('music.count.h1'), t('music.count.h2', { expr: expr(d) }), { text: t('music.count.h3', { expr: expr(d), sum: fmt(tot) }), vis: blocks(d) }), hintRevealsAnswer: true,
      why: { steps: [{ text: t('music.count.y', { expr: expr(d), sum: fmt(tot) }), vis: blocks(d) }, ...(l >= 3 ? [{ text: t('music.tap.y1') }] : [])], rule: t('music.count.rule') } };
  } });

  // ---------------------------------------------------------------- Maths: Adi talam (laghu 4 + drutam 2 + drutam 2)
  const ADI = ['clap', 'f1', 'f2', 'f3', 'clap', 'wave', 'clap', 'wave'];
  const actOf = a => a === 'clap' ? 'clap' : a === 'wave' ? 'wave' : 'finger';
  const partOf = n => n <= 4 ? t('music.tala.laghu') : t('music.tala.drutam') + (n <= 6 ? ' 1' : ' 2');
  function handSVG(a) {
    const ink = 'currentColor';
    if (a === 'clap') return `<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="${ink}"><rect x="11" y="10" width="11" height="26" rx="5.5" transform="rotate(-14 16 23)"/><rect x="26" y="10" width="11" height="26" rx="5.5" transform="rotate(14 32 23)" opacity=".8"/></g><path d="M24 4v4M15 6l2 3M33 6l-2 3" stroke="${ink}" stroke-width="2" stroke-linecap="round"/></svg>`;
    if (a === 'wave') return `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="15" y="12" width="18" height="24" rx="7" fill="none" stroke="${ink}" stroke-width="2.4"/><path d="M8 30c0-10 6-18 14-20" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><path d="m19 6 3.5 4-4.5 2.2" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const n = +a[1]; // little finger first, then ring, then middle
    return `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="22" width="28" height="18" rx="7" fill="${ink}" opacity=".35"/>${[0, 1, 2, 3].map(i => { const lit = i >= 4 - n; const x = 34 - i * 7.4; return `<rect x="${x - 3}" y="${i === 0 ? 13 : 7 + (i === 1 ? 1 : 0)}" width="6" height="${i === 0 ? 13 : 19}" rx="3" fill="${ink}" opacity="${lit ? 1 : .3}"/>`; }).join('')}</svg>`;
  }
  function talaVis(o = {}) {
    const lab = a => a === 'clap' ? t('music.tala.clap') : a === 'wave' ? t('music.tala.wave') : t('music.tala.' + a);
    const card = (a, i) => `<div class="mu-beat ${o.mark === i + 1 ? 'mark' : ''}" data-i="${i}"><span class="mu-bn">${i + 1}</span>${handSVG(a)}<span class="mu-bl">${lab(a)}</span></div>`;
    const grp = (name, from, to, sym) => `<div class="mu-grp"><p class="mu-gl"><b>${name}</b> <span>${sym}</span></p><div class="mu-gb">${ADI.slice(from, to).map((a, k) => card(a, from + k)).join('')}</div></div>`;
    return `<div class="mu-box mu-tala">${ring()}<div class="mu-grps" role="img" aria-label="${t('music.tala.label')}">${grp(t('music.tala.laghu'), 0, 4, 'I₄')}${grp(t('music.tala.drutam'), 4, 6, 'O')}${grp(t('music.tala.drutam'), 6, 8, 'O')}</div>${o.play === false ? '' : `<div class="mu-boardrow">${playBtn({ k: 'tala', bpm: o.bpm || 66 }, t('music.tala.play'))}</div>`}</div>`;
  }
  function playTala(box, bpm = 66) {
    const sp = 60 / bpm, ev = [];
    for (let k = 0; k < 16; k++) { const a = ADI[k % 8], i = k % 8; ev.push({ at: k * sp, kind: a === 'clap' ? 'clap' : a === 'wave' ? 'whoosh' : 'tick', f: 1300 - +(a[1] || 0) * 120, v: .8, cue: () => { pulse(box.querySelector('.mu-ring')); buzz(a === 'clap' ? 40 : 15); flash(box.querySelector(`.mu-beat[data-i="${i}"]`), sp * 900); } }); }
    seq(ev);
  }
  const actChoices = () => ['clap', 'finger', 'wave'].map(v => ({ v, html: t('music.tala.act.' + v), vis: handSVG(v === 'finger' ? 'f2' : v).replace('<svg ', '<svg class="mu-hand" ') }));
  Engine.skill({ id: 'mu.tala', subject: 'maths', topic: 'music', name: 'music.skill.tala', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const rule = t('music.tala.y.rule'), parts = { text: t('music.tala.y.parts'), vis: talaVis({ play: false }) };
    if (l === 1) {
      const waves = r() < .4, a = waves ? 2 : 3, k = waves ? 'waves' : 'claps';
      return { kind: 'num', prompt: t('music.tala.q.' + k), visual: talaVis({ bpm: 60 }), answer: a, hints: ladder(t(`music.tala.h.${k}1`), t(`music.tala.h.${k}2`), t(`music.tala.h.${k}3`)), hintRevealsAnswer: true, why: { steps: [{ text: t(`music.tala.h.${k}3`) }, parts], rule } };
    }
    if (l === 2 || (l === 4 && r() < .5)) {
      const long = l === 4, n = long ? r.int(9, 30) : r.int(1, 8), m = (n - 1) % 8 + 1, act = actOf(ADI[m - 1]);
      const chain = []; for (let x = n; x > 8; x -= 8) chain.push(`${x} − 8 = ${x - 8}`);
      const actT = t('music.tala.act.' + act);
      return { kind: 'choice', prompt: t(long ? 'music.tala.q.long' : 'music.tala.q.beat', { n }), visual: talaVis({ bpm: 66 }), choices: actChoices(), answer: act, answerText: actT,
        hints: long ? ladder(t('music.tala.h.long1'), t('music.tala.h.long2', { chain: chain.join(', '), n, m }), t('music.tala.h.beat3', { n: m, act: actT })) : ladder(t('music.tala.h.beat1'), t('music.tala.h.beat2', { n, part: partOf(n) }), t('music.tala.h.beat3', { n, act: actT })), hintRevealsAnswer: true,
        why: { steps: [...(long ? [{ text: t('music.tala.h.long2', { chain: chain.join(', '), n, m }) }] : []), { text: t('music.tala.y.beat', { n: m, part: partOf(m), act: actT }), vis: talaVis({ play: false, mark: m }) }, parts], rule } };
    }
    if (l === 3) {
      if (r() < .4) return { kind: 'num', prompt: t('music.tala.q.total'), visual: talaVis({ bpm: 72 }), answer: 8, hints: ladder(t('music.tala.h.total1'), t('music.tala.h.total2'), t('music.tala.h.total3')), hintRevealsAnswer: true, why: { steps: [parts], rule } };
      const k = r.int(2, 4), a = 8 * k;
      return { kind: 'num', prompt: t('music.tala.q.rounds', { k }), visual: talaVis({ bpm: 72 }), answer: a, hints: ladder(t('music.tala.h.rounds1'), t('music.tala.h.rounds2', { k }), t('music.tala.h.rounds3', { k, a })), hintRevealsAnswer: true, why: { steps: [{ text: t('music.tala.y.rounds', { k, a }) }, parts], rule } };
    }
    const k = r.int(2, 5), j = k - 1, b = j * 8, a = b + 1;
    return { kind: 'num', prompt: t('music.tala.q.start', { k }), visual: talaVis({ bpm: 72 }), answer: a, hints: ladder(t('music.tala.h.start1'), t('music.tala.h.start2', { k, j, b }), t('music.tala.h.start3', { b, a })), hintRevealsAnswer: true, why: { steps: [{ text: t('music.tala.y.start', { j, b, k, a }) }, parts], rule } };
  } });

  // ---------------------------------------------------------------- Maths (7–10): note lengths as fractions
  function fracBars(hl) { // whole, halves, quarters, eighths as rows of 3D bars; hl = row to light up
    const Sc = R3.Scene({ yaw: 0, pitch: 22, scale: 13 }), rows = [[1, '#6d6ad8'], [2, '#3b82c4'], [4, '#16a39c'], [8, '#e2a336']], Wd = 16;
    rows.forEach(([n, c], k) => { const z = (3 - k) * 1.9, w = Wd / n; for (let i = 0; i < n; i++) Sc.group(1).box(i * w + .08, 0, z, w - .16, 1, 1.25, hl == null || hl === k ? c : '#3a4152').text(i * w + w / 2, -.02, z + .62, n === 1 ? '1' : '1/' + n, { size: n === 8 ? .55 : .7, flat: false }); });
    return Sc.svg(t('music.frac.y'));
  }
  const FR = { 3: ['quarterOf', 'halfOf', 'quarters', 'halves'], 4: ['eighths', 'eInHalf', 'sum', 'sum2'] };
  Engine.skill({ id: 'mu.frac', subject: 'maths', topic: 'music', name: 'music.skill.frac', bands: { young: [3, 4], older: [3, 4] }, gen(l, r) {
    const k = r.pick(FR[l]), num = { quarters: 4, halves: 2, eighths: 8, eInHalf: 4 }[k];
    const hl = { quarterOf: 2, halfOf: 1, quarters: 2, halves: 1, eighths: 3, eInHalf: 3, sum: 2, sum2: 2 }[k];
    const glyphs = { quarterOf: [1], halfOf: [2], quarters: [1], halves: [2], eighths: [.5], eInHalf: [.5, 2], sum: [2, 1, 1], sum2: [2, 1] }[k];
    const visual = `<div class="mu-fr"><div class="mu-glyphs">${glyphs.map(noteVis).join('')}</div>${fracBars(hl)}</div>`;
    const base = { prompt: t('music.frac.q.' + k), visual, hints: ladder(t('music.frac.h1'), { text: t('music.frac.h2.' + k), vis: fracBars(hl) }, t('music.frac.s.' + k)), hintRevealsAnswer: true, why: { steps: [{ text: t('music.frac.s.' + k) }, { text: t('music.frac.y'), vis: fracBars() }], rule: t('music.frac.rule') } };
    if (num) return { kind: 'num', answer: num, ...base };
    const ans = { quarterOf: '¼', halfOf: '½', sum: '1', sum2: '¾' }[k], opts = { quarterOf: ['¼', '½', '1'], halfOf: ['½', '¼', '2'], sum: ['1', '¾', '½'], sum2: ['¾', '½', '1'] }[k];
    return { kind: 'choice', choices: r.shuffle(opts).map(v => ({ v, html: `<span class="bignum">${v}</span>` })), answer: ans, ...base };
  } });

  // ---------------------------------------------------------------- Maths (7–10): complete the rhythm
  const COMP = {
    3: [[[1, 1, null, 1], 1], [[2, null, 1], 1], [[1, 1, null], 2], [[null, 2], 2], [[.5, .5, 1, null], 2], [[1, null, .5, .5], 2]],
    4: [[[1, 1, 1, .5, null], .5], [[null, 1], 3, 4], [[1.5, null, 2], .5], [[2, null], 1, 3], [[null, .5, 2], 1.5], [[.5, .5, null], 2, 3]],
  };
  Engine.skill({ id: 'mu.complete', subject: 'maths', topic: 'music', name: 'music.skill.complete', bands: { young: [3, 4], older: [3, 4] }, gen(l, r) {
    const [d, gap, bar = 4] = r.pick(COMP[l]), seen = d.filter(x => x != null), s = sum(seen), gi = d.indexOf(null);
    const pool = [4, 3, 2, 1.5, 1, .5].filter(v => v !== gap && v <= bar), wrong = r.shuffle(pool).slice(0, 2);
    const full = d.map(x => x == null ? gap : x);
    const visual = `<div class="mu-box">${ring()}${score(d, { gap })}<div class="mu-boardrow">${playBtn({ k: 'rhythm', d: full, bpm: 76 }, t('music.ui.hear'))}</div></div>`;
    const nm = nname(gap);
    return { kind: 'choice', prompt: t('music.comp.q', { bar }), visual, answer: gap, answerText: `${nm} (${beatsTxt(gap)})`,
      choices: r.shuffle([gap, ...wrong]).map(v => ({ v, vis: noteVis(v), html: `${nname(v)}<br><span class="muted small">${beatsTxt(v)}</span>` })),
      hints: ladder(t('music.comp.h1', { bar }), t('music.comp.h2', { expr: expr(seen), s: fmt(s), bar, gap: fmt(gap) }), { text: t('music.comp.h3', { gap: fmt(gap), name: nm }), vis: noteVis(gap) }), hintRevealsAnswer: true,
      why: { steps: [{ text: t('music.comp.y', { expr: expr(seen), gap: fmt(gap), bar, name: nm }), vis: blocks(d, gi, gap) }], rule: t('music.comp.rule') } };
  } });

  // ---------------------------------------------------------------- Science: Jalatarangam bowls
  const LEVELS = [.15, .3, .45, .6, .75, .9];
  const bowlHz = lv => 880 * Math.pow(2, -Math.round(lv * 14) / 12);
  const pctTxt = lv => Math.round(lv * 100) + '%';
  function bowlSVG(lv, n, o = {}) { // a glass bowl drawn with flat-shaded bands (no gradients)
    const W = 84, top = 18, bot = 104, rx = 30, rb = 22, ry = 7, wy = bot - (bot - top - 8) * lv, wr = rb + (rx - rb) * ((bot - wy) / (bot - top));
    const cycles = Math.round(bowlHz(lv) / 110), wave = Array.from({ length: 49 }, (_, i) => `${i ? 'L' : 'M'}${12 + i * 1.25} ${10 + Math.sin(i / 48 * cycles * Math.PI * 2) * 4}`).join(' ');
    return `<svg viewBox="0 0 ${W} 132" aria-hidden="true">
      <ellipse cx="42" cy="118" rx="30" ry="5" fill="#000" opacity=".35"/>
      <path d="M${42 - rx} ${top} L${42 - rb} ${bot} A${rb} ${ry} 0 0 0 ${42 + rb} ${bot} L${42 + rx} ${top}" fill="#9fb6cc" fill-opacity=".10" stroke="#a9bdd1" stroke-width="1.6"/>
      <path d="M${42 - wr} ${wy} L${42 - rb} ${bot} A${rb} ${ry} 0 0 0 ${42 + rb} ${bot} L${42 + wr} ${wy} A${wr} ${ry} 0 0 1 ${42 - wr} ${wy}Z" fill="#1f7f9e"/>
      <path d="M${42 - wr * .2} ${wy + ry * .98} L${42 - rb * .2} ${bot + ry * .98} A${rb} ${ry} 0 0 0 ${42 + rb} ${bot} L${42 + wr} ${wy} A${wr} ${ry} 0 0 1 ${42 - wr * .2} ${wy + ry * .98}Z" fill="#17647d"/>
      <ellipse cx="42" cy="${wy}" rx="${wr}" ry="${ry}" fill="#56b9d6"/><ellipse cx="${42 - wr * .25}" cy="${wy - 1}" rx="${wr * .45}" ry="${ry * .4}" fill="#8ad3e8" opacity=".7"/>
      <path d="M${42 - rx + 5} ${top + 8} L${42 - rb + 4} ${bot - 6}" stroke="#ffffff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="42" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="#c9d7e4" stroke-width="1.8"/>
      <ellipse cx="42" cy="${bot + 4}" rx="${rb + 2}" ry="${ry * .8}" fill="none" stroke="#7f95ab" stroke-width="2"/>
      <g class="mu-vib"><path d="${wave}" fill="none" style="stroke:var(--acc)" stroke-width="2" stroke-linecap="round"/></g>
      <text x="42" y="130" text-anchor="middle" font-size="12" font-weight="900" fill="#e6e9f0">${n}</text></svg>`;
  }
  Engine.skill({ id: 'mu.glass', subject: 'science', topic: 'sound', name: 'music.skill.glass', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const n = [2, 3, 4, 4][l - 1], lv = r.shuffle(LEVELS).slice(0, n), mode = l === 1 ? 'higher' : l === 4 ? 'order' : r() < .5 ? 'high' : 'low';
    const byWater = lv.map((v, i) => i).sort((a, b) => lv[b] - lv[a]); // most water first = lowest note first
    const target = mode === 'low' ? byWater[0] : byWater[n - 1];
    const name = i => t('music.glass.bowl', { n: i + 1 }), list = byWater.map(name).join(', ');
    const ansTxt = mode === 'order' ? list : name(target);
    let pick = null, order = [];
    const strip = (mark) => `<div class="mu-bowls static">${lv.map((v, i) => `<div class="mu-bowl ${mark?.includes(i) ? 'is-on' : ''}">${bowlSVG(v, i + 1)}</div>`).join('')}</div>`;
    const q = { kind: 'custom', prompt: t('music.glass.q.' + mode), promptText: t('music.glass.q.' + mode),
      hints: ladder(t('music.glass.h1'), t('music.glass.h2', { list }), { text: t('music.glass.h3', { a: ansTxt }), vis: strip(mode === 'order' ? [] : [target]) }), hintRevealsAnswer: true, answerText: ansTxt,
      mount(el, api) {
        el.innerHTML = `${toolbar()}<div class="board mu-jal"><div class="mu-bowls" role="${mode === 'order' ? 'group' : 'radiogroup'}" aria-label="${t('music.skill.glass')}">${lv.map((v, i) => `<button type="button" class="mu-bowl" data-i="${i}" ${mode === 'order' ? '' : 'role="radio" aria-checked="false"'} aria-label="${name(i)}, ${t('music.glass.full', { p: pctTxt(v) })}">${bowlSVG(v, i + 1)}<span class="mu-ord" aria-hidden="true"></span></button>`).join('')}</div></div>
          <p class="mu-status" aria-live="polite">${mode === 'order' ? t('music.glass.orderGiven', { a: '—' }) : ''}</p>
          ${mode === 'order' ? `<div class="controls"><button type="button" class="k-btn k-btn-ghost k-btn-sm mu-undo"><svg class="k-icon" aria-hidden="true"><use href="#i-undo"/></svg><span>${t('music.ui.undo')}</span></button></div>` : ''}`;
        const bs = [...el.querySelectorAll('.mu-bowl')], st = el.querySelector('.mu-status');
        const draw = () => { bs.forEach((b, i) => { if (mode === 'order') { const k = order.indexOf(i); b.querySelector('.mu-ord').textContent = k >= 0 ? k + 1 : ''; b.classList.toggle('is-on', k >= 0); } else b.setAttribute('aria-checked', pick === i); });
          if (mode === 'order') st.textContent = t('music.glass.orderGiven', { a: order.length ? order.map(name).join(', ') : '—' }); api.ready(mode === 'order' ? order.length === n : pick != null); };
        bs.forEach((b, i) => {
          b.onclick = () => { if (Engine.round?.answered) return; sound('glass', bowlHz(lv[i]), 0, 0, .8); buzz(20); b.classList.remove('ring'); void b.offsetWidth; b.classList.add('ring');
            if (mode === 'order') { if (!order.includes(i)) order.push(i); } else pick = i; draw(); };
          b.onkeydown = e => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (d) { e.preventDefault(); bs[(i + d + n) % n].focus(); } };
        });
        el.querySelector('.mu-undo')?.addEventListener('click', () => { order.pop(); draw(); });
        draw();
      },
      check() { if (mode === 'order') return { correct: order.join() === byWater.join(), given: order.map(name).join(', ') }; return { correct: pick === target, given: pick == null ? '' : name(pick) }; },
      why: { steps: [{ text: t('music.glass.y1') }, { text: t('music.glass.y2'), vis: strip([]) }, { text: t('music.glass.y3') + ` <a href="#/t/science/sound">${t('music.ui.demo')}</a>` }], rule: t('music.glass.rule') } };
    return q;
  } });

  // ---------------------------------------------------------------- Science: veena string length
  const OPEN = 196; // open string at G3; frequency is inversely proportional to the vibrating length
  function veenaSVG(len, o = {}) { // neck with brass frets (mettu), the bridge at the right; the bright part is the vibrating length
    const x0 = 44, x1 = 556, fx = x1 - (x1 - x0) * len / 100, y = 50, frets = [89, 84, 75, 67, 60, 56, 50, 45, 42, 38, 34];
    const cyc = Math.max(2, Math.round(1000 / len / 3)), seg = Array.from({ length: 61 }, (_, i) => `${i ? 'L' : 'M'}${(fx + (x1 - fx) * i / 60).toFixed(1)} ${(y + Math.sin(i / 60 * Math.PI) * Math.sin(i / 60 * cyc * Math.PI) * 9).toFixed(1)}`).join(' ');
    const marks = (o.marks || []).map(m => { const x = x1 - (x1 - x0) * m.v / 100; return `<line x1="${x}" y1="${y + 34}" x2="${x}" y2="${y + 46}" stroke="#c5cbd8" stroke-width="2"/><text x="${x}" y="${y + 70}" text-anchor="middle" font-size="22" font-weight="900" fill="#e6e9f0">${m.l}</text>`; }).join('');
    return `<svg viewBox="0 0 600 ${o.marks ? 132 : 92}" class="mu-veena" role="img" aria-label="${esc(t('music.string.len', { n: Math.round(len) }))}">
      <rect x="14" y="${y - 4}" width="572" height="30" rx="6" fill="#8a5a2a"/><rect x="14" y="${y - 4}" width="572" height="10" rx="5" fill="#b27a3c"/><rect x="14" y="${y + 22}" width="572" height="4" rx="2" fill="#5e3b1a"/>
      ${frets.map(f => { const x = x1 - (x1 - x0) * f / 100; return `<rect x="${x - 3}" y="${y - 7}" width="6" height="22" rx="1" fill="#d7b46a"/><rect x="${x - 3}" y="${y + 11}" width="6" height="4" fill="#9c7f3c"/>`; }).join('')}
      <rect x="${x0 - 12}" y="${y - 12}" width="12" height="38" rx="3" fill="#efe6d2"/><rect x="${x1}" y="${y - 14}" width="14" height="40" rx="3" fill="#efe6d2"/><rect x="${x1}" y="${y + 18}" width="14" height="8" fill="#c9bea6"/>
      <line x1="${x0}" y1="${y - 2}" x2="${fx}" y2="${y - 2}" stroke="#8a91a3" stroke-width="3"/>
      <line x1="${fx}" y1="${y - 2}" x2="${x1}" y2="${y - 2}" style="stroke:var(--acc)" stroke-width="4" class="mu-str"/>
      <path d="${seg}" transform="translate(0 -2)" fill="none" style="stroke:var(--acc)" stroke-width="2" stroke-opacity=".8" class="mu-strwave"/>
      <circle cx="${fx}" cy="${y - 2}" r="12" fill="#e6e9f0" stroke="#141822" stroke-width="2.5"/><circle cx="${fx}" cy="${y - 2}" r="4" fill="#141822"/>
      ${marks}</svg>`;
  }
  Engine.skill({ id: 'mu.string', subject: 'science', topic: 'sound', name: 'music.skill.string', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const why = { steps: [{ text: t('music.string.y1') }, { text: t('music.string.y2'), vis: `<div class="mu-vstack">${veenaSVG(100)}${veenaSVG(50)}</div>` }, { text: t('music.string.y3') + ` <a href="#/t/science/sound">${t('music.ui.demo')}</a>` }], rule: t('music.string.rule') };
    if (l === 1) {
      const lens = r.shuffle([[100, 55], [90, 50], [80, 45]][r.int(0, 2)]), low = r() < .4, ans = low ? (lens[0] > lens[1] ? 0 : 1) : (lens[0] < lens[1] ? 0 : 1), nm = i => t(i ? 'music.string.b' : 'music.string.a');
      let pick = null;
      return { kind: 'custom', prompt: t(low ? 'music.string.q.pickLow' : 'music.string.q.pickHigh'), hints: ladder(t('music.string.h1'), t('music.string.h2.pick'), t('music.string.h3', { a: nm(ans) })), hintRevealsAnswer: true,
        answerText: t(low ? 'music.string.ans.pickLow' : 'music.string.ans.pick', { s: nm(ans) }), why,
        mount(el, api) {
          el.innerHTML = `${toolbar()}<div class="mu-strs" role="radiogroup" aria-label="${t('music.string.label')}">${lens.map((v, i) => `<button type="button" class="mu-strcard" role="radio" aria-checked="false" data-i="${i}" aria-label="${nm(i)}, ${t('music.string.len', { n: v })}"><span class="eyebrow">${nm(i)}</span><span class="board">${veenaSVG(v)}</span></button>`).join('')}</div>`;
          const bs = [...el.querySelectorAll('.mu-strcard')];
          bs.forEach((b, i) => { b.onclick = () => { if (Engine.round?.answered) return; pick = i; sound('veena', OPEN * 100 / lens[i]); buzz(20); b.classList.remove('ring'); void b.offsetWidth; b.classList.add('ring'); bs.forEach((x, k) => x.setAttribute('aria-checked', k === i)); api.ready(true); };
            b.onkeydown = e => { if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); bs[1 - i].focus(); } }; });
        },
        check() { return { correct: pick === ans, given: pick == null ? '' : nm(pick) }; } };
    }
    let start = 100, test, ansTxt, key, h2v = {}, marks = [];
    if (l === 2) { start = r.int(62, 72); const up = r() < .5; key = up ? 'higher' : 'lower'; const lim = up ? start - 12 : start + 12; test = v => up ? v <= lim : v >= lim; ansTxt = t('music.string.ans.' + key, { n: lim }); h2v = { n: start }; }
    else { key = l === 3 ? 'half' : r.pick(['pa', 'ma']); const tg = { half: 50, pa: 67, ma: 75 }[key]; test = v => Math.abs(v - tg) <= 3; ansTxt = t('music.string.ans.target', { n: tg }); marks = [{ v: 100, l: '1' }, { v: 75, l: '¾' }, { v: 67, l: '⅔' }, { v: 50, l: '½' }]; }
    let val = start, moved = false;
    return { kind: 'custom', prompt: t('music.string.q.' + key), promptText: t('music.string.q.' + key), hints: ladder(t('music.string.h1'), t('music.string.h2.' + key, h2v), t('music.string.h3', { a: ansTxt })), hintRevealsAnswer: true, answerText: ansTxt, why,
      mount(el, api) {
        el.innerHTML = `${toolbar()}<div class="board mu-veenaboard">${ring()}<div class="mu-vsvg">${veenaSVG(val, { marks })}</div></div>
          <div class="mu-range"><label for="mu-len">${t('music.string.slider')}</label><input id="mu-len" type="range" min="30" max="100" step="1" value="${val}" aria-valuetext="${t('music.string.len', { n: val })}"><output aria-live="polite">${t('music.string.len', { n: val })}</output></div>
          <div class="controls"><button type="button" class="k-btn k-btn-outline pill mu-pluck"><svg class="k-icon" aria-hidden="true"><use href="#i-wave"/></svg><span>${t('music.string.pluck')}</span></button></div>`;
        const inp = el.querySelector('#mu-len'), out = el.querySelector('output'), box = el.querySelector('.mu-veenaboard');
        const pluck = () => { sound('veena', OPEN * 100 / val); buzz(20); pulse(box.querySelector('.mu-ring')); box.classList.remove('pl'); void box.offsetWidth; box.classList.add('pl'); box.style.setProperty('--vib', (0.5 * val / 100).toFixed(2) + 's'); };
        let deb; inp.oninput = () => { if (Engine.round?.answered) { inp.value = val; return; } val = +inp.value; moved = true; el.querySelector('.mu-vsvg').innerHTML = veenaSVG(val, { marks }); out.textContent = t('music.string.len', { n: val }); inp.setAttribute('aria-valuetext', out.textContent); api.ready(true); clearTimeout(deb); deb = setTimeout(pluck, 160); };
        el.querySelector('.mu-pluck').onclick = pluck;
      },
      check() { return { correct: moved && test(val), given: t('music.string.given', { n: val }) }; } };
  } });

  // ---------------------------------------------------------------- Science: loud/soft, high/low (waves make it playable without sound)
  function waveSVG(amp, cyc) { const pts = Array.from({ length: 121 }, (_, i) => `${i ? 'L' : 'M'}${(6 + i * 1.4).toFixed(1)} ${(40 - Math.sin(i / 120 * cyc * Math.PI * 2) * amp).toFixed(1)}`).join(' '); return `<svg viewBox="0 0 180 80" aria-hidden="true"><line x1="4" y1="40" x2="176" y2="40" stroke="#3a4152"/><path d="${pts}" fill="none" style="stroke:var(--acc)" stroke-width="2.4" stroke-linejoin="round"/></svg>`; }
  Engine.skill({ id: 'mu.listen', subject: 'science', topic: 'sound', name: 'music.skill.listen', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    let snds, key, ans, comboTxt = {};
    const S = (f, v) => ({ f, v, amp: 6 + v * 28, cyc: Math.round(f / 110) });
    if (l === 1) { snds = r.shuffle([S(330, .95), S(330, .25)]); key = r() < .6 ? 'loud' : 'soft'; ans = snds.findIndex(s => key === 'loud' ? s.v > .5 : s.v < .5); }
    else if (l === 2) { snds = r.shuffle([S(660, .6), S(220, .6)]); key = r() < .6 ? 'high' : 'low'; ans = snds.findIndex(s => key === 'high' ? s.f > 400 : s.f < 400); }
    else if (l === 3) { snds = r.shuffle([S(220, .6), S(440, .6), S(880, .6)]); key = r() < .5 ? 'highest' : 'lowest'; const fs = snds.map(s => s.f); ans = fs.indexOf(key === 'highest' ? Math.max(...fs) : Math.min(...fs)); }
    else { snds = r.shuffle([S(770, .95), S(770, .25), S(220, .95), S(220, .25)]); const hi = r() < .5, ld = r() < .5; key = 'combo'; comboTxt = { a: t('music.listen.w.' + (hi ? 'high' : 'low')), b: t('music.listen.w.' + (ld ? 'loud' : 'soft')) }; ans = snds.findIndex(s => (s.f > 400) === hi && (s.v > .5) === ld); }
    const nm = i => t('music.listen.snd', { n: i + 1 }), h2 = key === 'combo' ? t('music.listen.h2.combo', comboTxt) : t('music.listen.h2.' + (['loud', 'soft'].includes(key) ? 'loud' : 'pitch'));
    let pick = null; const prompt = key === 'combo' ? t('music.listen.q.combo', comboTxt) : t('music.listen.q.' + key);
    return { kind: 'custom', prompt, promptText: prompt, hints: ladder(t('music.listen.h1'), h2, t('music.listen.h3', { a: nm(ans) })), hintRevealsAnswer: true, answerText: nm(ans),
      mount(el, api) {
        el.innerHTML = `${toolbar()}<div class="mu-snds n${snds.length}" role="radiogroup" aria-label="${esc(prompt)}">${snds.map((s, i) => `<button type="button" class="mu-snd" role="radio" aria-checked="false" data-i="${i}"><span class="eyebrow">${nm(i)}</span><span class="board">${ring()}${waveSVG(s.amp, s.cyc)}</span></button>`).join('')}</div>`;
        const bs = [...el.querySelectorAll('.mu-snd')];
        bs.forEach((b, i) => { b.onclick = () => { if (Engine.round?.answered) return; pick = i; sound('tone', snds[i].f, 0, .7, snds[i].v); buzz(Math.round(20 + snds[i].v * 40)); pulse(b.querySelector('.mu-ring')); bs.forEach((x, k) => x.setAttribute('aria-checked', k === i)); api.ready(true); };
          b.onkeydown = e => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (d) { e.preventDefault(); bs[(i + d + bs.length) % bs.length].focus(); } }; });
      },
      check() { return { correct: pick === ans, given: pick == null ? '' : nm(pick) }; },
      why: { steps: [{ text: t('music.listen.y1'), vis: `<div class="mu-wv2">${waveSVG(30, 3)}${waveSVG(8, 3)}</div>` }, { text: t('music.listen.y2'), vis: `<div class="mu-wv2">${waveSVG(18, 8)}${waveSVG(18, 2)}</div>` }, { text: `<a href="#/t/science/sound">${t('music.ui.demo')}</a>` }], rule: t('music.listen.rule') } };
  } });

  // ---------------------------------------------------------------- English: clap the syllables
  const SYL = {
    cat: ['cat'], dog: ['dog'], cow: ['cow'], goat: ['goat'], horse: ['horse'], crow: ['crow'], hen: ['hen'], duck: ['duck'], ant: ['ant'], bee: ['bee'], frog: ['frog'], chair: ['chair'], bed: ['bed'], cup: ['cup'], spoon: ['spoon'], clock: ['clock'], door: ['door'],
    bus: ['bus'], car: ['car'], train: ['train'], boat: ['boat'], ship: ['ship'], sun: ['sun'], moon: ['moon'], star: ['star'], tree: ['tree'], ball: ['ball'], kite: ['kite'], book: ['book'], drum: ['drum'], school: ['school'],
    tiger: ['ti', 'ger'], monkey: ['mon', 'key'], rabbit: ['rab', 'bit'], zebra: ['ze', 'bra'], parrot: ['par', 'rot'], peacock: ['pea', 'cock'], apple: ['ap', 'ple'], mango: ['man', 'go'], lemon: ['lem', 'on'], carrot: ['car', 'rot'],
    pumpkin: ['pump', 'kin'], table: ['ta', 'ble'], window: ['win', 'dow'], flower: ['flow', 'er'], river: ['riv', 'er'], pencil: ['pen', 'cil'], igloo: ['ig', 'loo'], jackfruit: ['jack', 'fruit'], cabbage: ['cab', 'bage'],
    elephant: ['el', 'e', 'phant'], butterfly: ['but', 'ter', 'fly'], banana: ['ba', 'na', 'na'], papaya: ['pa', 'pa', 'ya'], coconut: ['co', 'co', 'nut'], tomato: ['to', 'ma', 'to'], potato: ['po', 'ta', 'to'], bicycle: ['bi', 'cy', 'cle'], umbrella: ['um', 'brel', 'la'],
    watermelon: ['wa', 'ter', 'mel', 'on'],
  };
  const sylWords = (a, b) => Object.keys(SYL).filter(w => (window.EN_DATA?.WORDS?.[w]) && SYL[w].length >= a && SYL[w].length <= b);
  const split = w => `<span lang="en">${SYL[w].join('·')}</span>`;
  const pic = w => window.ENGLISH?.picImg ? ENGLISH.picImg(w, 'mu-pic') : `<span class="nopic" lang="en">${esc(w)}</span>`;
  Engine.skill({ id: 'mu.syll', subject: 'english', topic: 'music', name: 'music.skill.syll', bands: { young: [1, 2], older: [2, 4] }, gen(l, r) {
    const range = { 1: [1, 2], 2: [1, 3], 3: [2, 4], 4: [3, 4] }[l];
    const pool = sylWords(...range), w = r.pick(pool.length ? pool : ['banana']), n = SYL[w].length;
    const steps = [{ text: t(n === 1 ? 'music.syll.y1one' : 'music.syll.y1', { split: split(w), n }) }, { text: t('music.syll.y2') }];
    const why = { photo: window.ENGLISH?.credit?.(w) || undefined, steps, rule: t('music.syll.rule') };
    const hints = ladder(t('music.syll.h1'), t('music.syll.h2', { first: `<b lang="en">${SYL[w][0]}</b>` }), t('music.syll.h3', { split: split(w), n }));
    if (l === 4 && r() < .5) { // pick the word with n syllables
      const others = r.shuffle(sylWords(1, 4).filter(x => SYL[x].length !== n)).slice(0, 2);
      return { kind: 'choice', prompt: t('music.syll.q4', { n }), choices: r.shuffle([w, ...others]).map(x => ({ v: x, html: `<span lang="en">${esc(x)}</span>`, img: window.PICS?.[x]?.src, say: [{ text: x, lang: 'en' }] })), answer: w, answerText: `${split(w)} = ${n}`, hints, hintRevealsAnswer: true, why };
    }
    let claps = 0;
    return { kind: 'custom', prompt: t('music.syll.q'), say: [{ text: t('music.syll.q'), lang: L() }, { text: w, lang: 'en' }], hints, hintRevealsAnswer: true, answerText: `${split(w)} = ${n}`, why,
      mount(el, api) {
        el.innerHTML = `${toolbar()}<div class="board mu-box mu-wordboard">${ring()}<div class="mu-wordpic">${pic(w)}</div><p class="mu-word" lang="en">${esc(w)}</p>
            <button type="button" class="k-btn k-btn-outline k-btn-sm pill mu-sayw"><svg class="k-icon" aria-hidden="true"><use href="#i-sound"/></svg><span>${t('music.syll.sayWord')}</span></button></div>
          <button type="button" class="mu-pad" aria-label="${t('music.syll.padLabel')}"><span class="mu-pad-face">${ring()}<b>${t('music.syll.pad')}</b><small>Space</small></span></button>
          <div class="mu-dots" aria-hidden="true"></div><p class="mu-status" aria-live="polite">${t('music.syll.count', { n: 0 })}</p>
          <div class="controls"><button type="button" class="k-btn k-btn-ghost k-btn-sm mu-reset"><svg class="k-icon" aria-hidden="true"><use href="#i-review"/></svg><span>${t('music.ui.again')}</span></button></div>`;
        const pad = el.querySelector('.mu-pad'), st = el.querySelector('.mu-status'), dots = el.querySelector('.mu-dots');
        const draw = () => { dots.innerHTML = Array.from({ length: claps }, () => '<i></i>').join(''); st.textContent = t('music.syll.count', { n: claps }); api.ready(claps > 0); };
        const clap = () => { if (Engine.round?.answered || claps >= 8) return; claps++; sound('clap', 0, 0, 0, .8); buzz(25); pulse(pad.querySelector('.mu-ring')); pulse(el.querySelector('.mu-wordboard .mu-ring')); pad.classList.add('hit'); setTimeout(() => pad.classList.remove('hit'), 120); draw(); };
        pad.addEventListener('pointerdown', e => { e.preventDefault(); clap(); });
        pad.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.repeat) { e.preventDefault(); e.stopPropagation(); clap(); } });
        padKey = { el: pad, fn: clap };
        el.querySelector('.mu-reset').onclick = () => { claps = 0; draw(); };
        el.querySelector('.mu-sayw').onclick = e => Voice.play([{ text: SYL[w].join(' - '), lang: 'en' }, { text: w, lang: 'en' }], e.currentTarget, { rate: .7 });
        draw();
      },
      check() { return { correct: claps === n, given: t('music.syll.given', { n: claps }) }; } };
  } });

  // ---------------------------------------------------------------- English: rhymes in short original chants
  const CHANTS = [
    { lines: ['The sun is up, the sky is blue,', 'the crow says caw, the cow says ___.'], a: 'moo', d: ['baa', 'quack'], end: 'blue' },
    { lines: ['Rain on the roof and rain on the tree,', 'rain on the flower and rain on the ___.'], a: 'bee', d: ['ant', 'frog'], end: 'tree' },
    { lines: ['Mango, mango, sweet and round,', 'one fell softly on the ___.'], a: 'ground', d: ['floor', 'grass'], end: 'round' },
    { lines: ['My little cat sat on the mat,', 'she wore a tiny yellow ___.'], a: 'hat', d: ['cap', 'scarf'], end: 'mat' },
    { lines: ['Ring the bell at the school gate,', 'hurry along, do not be ___.'], a: 'late', d: ['slow', 'sad'], end: 'gate' },
    { lines: ['The train goes chug along the track,', 'it goes to Madurai and then comes ___.'], a: 'back', d: ['home', 'round'], end: 'track' },
    { lines: ['Beat the drum, boom, boom, boom,', 'the sound goes all around the ___.'], a: 'room', d: ['house', 'hall'], end: 'boom' },
    { lines: ['Little boat upon the sea,', 'sail across and come to ___.'], a: 'me', d: ['us', 'them'], end: 'sea' },
    { lines: ['Up goes the kite, so high, so high,', 'it waves to the birds as they fly ___.'], a: 'by', d: ['off', 'past'], end: 'high' },
    { lines: ['Clap your hands and stamp your feet,', 'march along the busy ___.'], a: 'street', d: ['road', 'lane'], end: 'feet' },
  ];
  const SOUNDALIKE = [
    { w: 'blue', a: 'shoe', d: ['blow', 'bun'], s: 'oo' }, { w: 'bear', a: 'chair', d: ['bead', 'beer'], s: 'air' }, { w: 'night', a: 'kite', d: ['knit', 'nine'], s: 'ite' },
    { w: 'phone', a: 'bone', d: ['one', 'fun'], s: 'one' }, { w: 'eight', a: 'plate', d: ['height', 'eat'], s: 'ate' }, { w: 'head', a: 'bed', d: ['bead', 'heat'], s: 'ed' },
    { w: 'four', a: 'door', d: ['hour', 'fur'], s: 'or' }, { w: 'tree', a: 'sea', d: ['try', 'tray'], s: 'ee' },
  ];
  const en = w => `<b lang="en">${esc(w)}</b>`;
  Engine.skill({ id: 'mu.rhyme', subject: 'english', topic: 'music', name: 'music.skill.rhyme', bands: { young: [1, 2], older: [3, 4] }, gen(l, r) {
    if (l === 4) {
      const p = r.pick(SOUNDALIKE);
      return { kind: 'choice', prompt: t('music.rhyme.q4', { w: `<span lang="en">${p.w}</span>` }), promptText: t('music.rhyme.q4', { w: p.w }), say: [{ text: t('music.rhyme.q4', { w: '' }), lang: L() }, { text: p.w, lang: 'en' }],
        choices: r.shuffle([p.a, ...p.d]).map(v => ({ v, html: `<span class="bignum" lang="en">${v}</span>`, say: [{ text: v, lang: 'en' }] })), answer: p.a, answerText: `<span lang="en">${p.a}</span>`,
        hints: ladder(t('music.rhyme.h4a'), t('music.rhyme.h4b', { w: en(p.w), s: p.s }), t('music.rhyme.h3', { a: en(p.a), end: en(p.w) })), hintRevealsAnswer: true,
        why: { steps: [{ text: t('music.rhyme.y4', { w: en(p.w), a: en(p.a), s: p.s, d: en(p.d[0]) }) }], rule: t('music.rhyme.rule') } };
    }
    const c = r.pick(CHANTS), opts = l === 1 ? [c.a, c.d[0]] : [c.a, ...c.d];
    const lineHtml = (fill) => c.lines.map((ln, i) => `<span class="mu-cl">${i === 0 ? esc(ln).replace(new RegExp(c.end + '(?!.*' + c.end + ')'), `<mark>${c.end}</mark>`) : esc(ln).replace('___', fill)}</span>`).join('');
    const visual = `<div class="mu-chant" lang="en"><p class="eyebrow">${t('music.rhyme.chant')}</p><p>${lineHtml('<span class="mbox">?</span>')}</p></div>`;
    const spoken = c.lines.join(' ').replace('___', '...');
    return { kind: 'choice', prompt: t('music.rhyme.q'), visual, say: [{ text: t('music.rhyme.q'), lang: L() }, { text: spoken, lang: 'en' }],
      choices: r.shuffle(opts).map(v => ({ v, html: `<span class="bignum" lang="en">${v}</span>`, say: [{ text: v, lang: 'en' }] })), answer: c.a, answerText: `<span lang="en">${c.a}</span>`,
      hints: ladder(t('music.rhyme.h1', { end: en(c.end) }), t('music.rhyme.h2', { end: en(c.end) }), t('music.rhyme.h3', { a: en(c.a), end: en(c.end) })), hintRevealsAnswer: true,
      why: { steps: [{ text: t('music.rhyme.y1', { end: en(c.end), a: en(c.a) }), vis: `<div class="mu-chant" lang="en"><p>${lineHtml(`<mark>${c.a}</mark>`)}</p></div>` }, { text: t('music.rhyme.y2') }], rule: t('music.rhyme.rule') } };
  } });

  // ---------------------------------------------------------------- modes (games list)
  const MODES = {
    maths: { icon: 'i-dots', ids: { young: ['mu.tap', 'mu.count', 'mu.tala'], older: ['mu.tap', 'mu.count', 'mu.tala', 'mu.frac', 'mu.complete'] } },
    science: { icon: 'i-wave', ids: { young: ['mu.glass', 'mu.string', 'mu.listen'], older: ['mu.glass', 'mu.string', 'mu.listen'] } },
    english: { icon: 'i-sound', ids: { young: ['mu.syll', 'mu.rhyme'], older: ['mu.syll', 'mu.rhyme'] } },
  };
  function run(subject, p) {
    p = p || Store.current(); if (!p) return; const m = MODES[subject], ids = m.ids[p.band] || m.ids.older;
    const due = Store.due(p, subject).filter(x => x.skill.startsWith('mu.')).slice(0, 1).map(x => ({ skill: x.skill, lvl: x.lvl, seed: x.seed }));
    const need = 5 - due.length, base = ids.slice(0, need).map(id => Engine.itemFor(p, id)); // every task type once, then weighted to low mastery
    const mix = [...base, ...Engine.weighted(p, ids, need - base.length)];
    for (let i = mix.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [mix[i], mix[j]] = [mix[j], mix[i]]; }
    const items = [...due, ...mix];
    Engine.start({ items, title: t(`music.mode.${subject}.title`), subject, topic: 'music', mode: 'music', back: '#/s/' + subject, again: () => run(subject, p) });
  }
  const games = {};
  function game(subject) { if (!MODES[subject]) return null; return games[subject] ||= { title: `music.mode.${subject}.title`, blurb: `music.mode.${subject}.blurb`, icon: MODES[subject].icon, start: p => run(subject, p) }; }

  // ---------------------------------------------------------------- Free play: swaram pad, three voices, record and replay
  const SEMI = [0, 2, 4, 5, 7, 9, 11, 12], SA = 261.63, LETTERS = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
  const hz = (n, v) => SA * Math.pow(2, SEMI[n] / 12) / (v === 'drum' ? 2 : 1);
  const VOICES = ['flute', 'veena', 'drum'];
  const F = { voice: 'veena', rec: false, t0: 0, notes: [], el: null };
  function playNote(n, v = F.voice, delay = 0) { sound(v, hz(n, v), delay, .45, .75); }
  function lightKey(n) { const k = F.el?.querySelector(`.mu-key[data-n="${n}"]`); if (k) { k.classList.add('on'); setTimeout(() => k.classList.remove('on'), 220); } pulse(F.el?.querySelector('.mu-padboard .mu-ring')); const now = F.el?.querySelector('.mu-now'); if (now) now.textContent = t('music.free.now', { s: t('music.sw.' + n) }); }
  function press(n) {
    ac(); playNote(n); lightKey(n); buzz(15);
    if (F.rec) { if (!F.notes.length) F.t0 = performance.now(); F.notes.push({ n, t: Math.round(performance.now() - F.t0), v: F.voice }); if (F.notes.length >= 64 || F.notes[F.notes.length - 1].t > 30000) toggleRec(); else recStat(); }
  }
  function recStat(msg) { const s = F.el?.querySelector('.mu-recstat'); if (s) s.textContent = msg ?? (F.rec ? t('music.free.recOn') + (F.notes.length ? ' · ' + t('music.free.recDone', { n: F.notes.length }) : '') : F.notes.length ? t('music.free.recDone', { n: F.notes.length }) : t('music.free.recNone')); }
  function toggleRec() {
    F.rec = !F.rec; if (F.rec) { F.notes = []; stopSeq(); }
    const b = F.el?.querySelector('.mu-rec'); if (b) { b.setAttribute('aria-pressed', F.rec); b.querySelector('span').textContent = F.rec ? t('music.free.stop') : t('music.free.rec'); }
    F.el?.querySelector('.mu-padboard')?.classList.toggle('rec', F.rec); syncFree(); recStat();
  }
  function playTune(notes) { ac(); seq(notes.map(x => ({ at: x.t / 1000, kind: x.v, f: hz(x.n, x.v), dur: .45, v: .75, cue: () => { lightKey(x.n); buzz(15); } }))); }
  function syncFree() { if (!F.el) return; const s = cfg(), has = F.notes.length > 0 && !F.rec; F.el.querySelector('.mu-pb').disabled = !has; F.el.querySelector('.mu-save').disabled = !has || s.tunes.length >= 10; }
  function tuneList() {
    const s = cfg();
    if (!s.tunes.length) return `<p class="muted">${t('music.free.none')}</p>`;
    return `<ol class="mu-tunes">${s.tunes.map((tu, i) => { const nm = esc(tu.name); const dur = ((tu.notes[tu.notes.length - 1]?.t || 0) / 1000 + .5).toFixed(1); const vs = [...new Set(tu.notes.map(x => x.v))].map(v => t('music.free.' + v)).join(', ');
      return `<li class="mu-tune"><div><b>${nm}</b><span class="small muted">${t('music.free.meta', { n: tu.notes.length, s: dur, v: vs })}</span></div>
        <button type="button" class="k-btn k-btn-outline k-btn-sm pill" data-tplay="${i}" aria-label="${t('music.free.playT', { t: nm })}"><svg class="k-icon" aria-hidden="true"><use href="#i-sound"/></svg><span>${t('music.ui.play')}</span></button>
        <button type="button" class="k-iconbtn" data-tdel="${i}" aria-label="${t('music.free.del', { t: nm })}"><svg class="k-icon"><use href="#i-del"/></svg></button></li>`; }).join('')}</ol>${s.tunes.length >= 10 ? `<p class="small muted">${t('music.free.full')}</p>` : ''}`;
  }
  function bindTunes() {
    const box = F.el.querySelector('.mu-tunebox'); box.innerHTML = tuneList();
    box.querySelectorAll('[data-tplay]').forEach(b => b.onclick = () => playTune(cfg().tunes[+b.dataset.tplay].notes));
    box.querySelectorAll('[data-tdel]').forEach(b => b.onclick = () => { cfg().tunes.splice(+b.dataset.tdel, 1); Store.save(); bindTunes(); syncFree(); F.el.querySelector('.mu-recstat').focus?.(); });
  }
  function freeRender(main) {
    const p = Store.current(), s = cfg();
    main.innerHTML = `<section class="page mu-free" data-subject="maths">
      <p class="eyebrow">${t('music.eyebrow')}</p><h1>${t('music.free.title')}</h1><p class="muted">${t('music.free.lead')}</p>
      ${toolbar(false)}
      <div class="mu-voices"><span class="small muted" id="mu-vl">${t('music.free.voice')}</span><div class="seg" role="group" aria-labelledby="mu-vl">${VOICES.map(v => `<button type="button" data-voice="${v}" aria-pressed="${F.voice === v}">${t('music.free.' + v)}</button>`).join('')}</div></div>
      <div class="board mu-padboard">${ring()}<div class="mu-keys" role="group" aria-label="${t('music.free.pad')}">${SEMI.map((_, n) => `<button type="button" class="mu-key" data-n="${n}" aria-label="${t('music.free.key', { s: t('music.sw.' + n), k: (n + 1) + ' / ' + LETTERS[n].toUpperCase() })}"><b>${t('music.sw.' + n)}</b><small aria-hidden="true">${n + 1} · ${LETTERS[n].toUpperCase()}</small></button>`).join('')}</div><p class="mu-now small" aria-live="polite"></p></div>
      <p class="kbd-note">${t('music.free.keys')}</p>
      <div class="controls mu-reccontrols">
        <button type="button" class="k-btn k-btn-outline pill mu-rec" aria-pressed="${F.rec}"><span>${F.rec ? t('music.free.stop') : t('music.free.rec')}</span></button>
        <button type="button" class="k-btn k-btn-outline pill mu-pb"><svg class="k-icon" aria-hidden="true"><use href="#i-sound"/></svg><span>${t('music.free.playback')}</span></button>
        <button type="button" class="k-btn k-btn-primary mu-save">${t('music.free.save')}</button>
      </div>
      <p class="mu-recstat small" aria-live="polite" tabindex="-1"></p>
      <h2 class="section">${t('music.free.saved')}</h2><div class="mu-tunebox"></div>
      ${p ? `<h2 class="section">${t('music.free.lessons')}</h2><div class="games">${['maths', 'science', 'english'].map(sj => `<button type="button" class="gamecard" data-subject="${sj}" data-mode="${sj}"><span class="subj-ic"><svg class="k-icon"><use href="#${MODES[sj].icon}"/></svg></span><span><span class="eyebrow">${t('subj.' + sj + '.title')}</span><b>${t(`music.mode.${sj}.title`)}</b><span class="small muted">${t(`music.mode.${sj}.blurb`)}</span></span></button>`).join('')}</div>` : ''}
    </section>`;
    F.el = main.querySelector('.mu-free');
    F.el.querySelectorAll('.mu-key').forEach(k => {
      k.addEventListener('pointerdown', e => { e.preventDefault(); press(+k.dataset.n); });
      k.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); press(+k.dataset.n); } });
    });
    F.el.querySelectorAll('[data-voice]').forEach(b => b.onclick = () => { F.voice = b.dataset.voice; F.el.querySelectorAll('[data-voice]').forEach(x => x.setAttribute('aria-pressed', x === b)); ac(); playNote(0); lightKey(0); });
    F.el.querySelector('.mu-rec').onclick = () => { ac(); toggleRec(); };
    F.el.querySelector('.mu-pb').onclick = () => playTune(F.notes);
    F.el.querySelector('.mu-save').onclick = () => { const s2 = cfg(); if (!F.notes.length || s2.tunes.length >= 10) return; const used = new Set(s2.tunes.map(x => x.name)); let k = s2.tunes.length + 1; while (used.has(t('music.free.tune', { n: k }))) k++; s2.tunes.push({ name: t('music.free.tune', { n: k }), at: Date.now(), notes: F.notes.slice(0, 64) }); Store.save(); bindTunes(); syncFree(); recStat(t('music.free.savedOk')); };
    F.el.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => run(b.dataset.mode, p));
    bindTunes(); syncFree(); recStat();
  }
  window.ROUTES.music = {
    render(main, parts) { if (parts[1] && MODES[parts[1]]) { run(parts[1]); return; } freeRender(main); },
    keys(e) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return; const a = document.activeElement; if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) return;
      const k = e.key.toLowerCase(); let n = /^[1-8]$/.test(k) ? +k - 1 : LETTERS.indexOf(k);
      if (n >= 0) { e.preventDefault(); press(n); }
    },
  };

  window.MUSIC = { game, run, MODES, SYL, CHANTS, _audio: A, _cfg: cfg };
})();
