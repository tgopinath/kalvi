// Drawing games that teach: trace and write letters and numbers in stroke order, draw shapes
// (checked with geometry), finish science diagrams, plus a free sketchbook with a per-child gallery.
// Every task runs through the shared engine (hint ladder, lesson card, misses go to review).
(function () {
  const esc = Engine.esc, skill = Engine.skill;
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const L = 300;               // logical canvas units for tasks (square)
  const U = 18, OY = 28;       // letter grid: 1 unit = 18 px; top line y=28, middle 118, base 208, tail 280
  const ACC = { english: '#a85d06', maths: '#0c7a75', science: '#4f46e5' };   // stroke colours on paper (AA on #fbf7ee)
  const WARN = '#c0532f';
  const CHALK = '#f4efe2', GOLD = '#f6c56b';

  // ======================= strings =======================
  I18N.add({ draw: {
    title: { english: ['Trace and write', 'எழுதிப் பழகு'], maths: ['Draw it', 'வரைந்து பார்'], science: ['Draw and label', 'வரைந்து அறி'] },
    blurb: {
      english: ['Learn the strokes of each letter in order, then write it yourself.', 'ஒவ்வொரு எழுத்தின் கோடுகளையும் வரிசையாகக் கற்று, நீயே எழுது.'],
      maths: ['Write numbers, draw shapes, lines of symmetry and equal groups.', 'எண்களை எழுது; வடிவங்கள், சமச்சீர்க் கோடு, சம குழுக்களை வரை.'],
      science: ['Finish a diagram: roots, petals, the water cycle and a circuit.', 'படத்தை முடி: வேர்கள், இதழ்கள், நீர்ச் சுழற்சி, மின்சுற்று.'],
    },
    skill: {
      upper: ['Capital letters', 'பெரிய எழுத்துகள் (capital)'], lower: ['Small letters', 'சிறிய எழுத்துகள் (small)'], uyir: ['Tamil vowels அ to ஔ', 'உயிர் எழுத்துகள் அ முதல் ஔ வரை'],
      digit: ['Writing numbers', 'எண்களை எழுதுதல்'], shape: ['Drawing shapes', 'வடிவங்களை வரைதல்'], sym: ['Line of symmetry', 'சமச்சீர்க் கோடு (line of symmetry)'], groups: ['Equal groups', 'சம குழுக்கள்'],
      roots: ['Roots of a plant', 'செடியின் வேர்கள்'], petals: ['Petals of a flower', 'பூவின் இதழ்கள்'], water: ['The water cycle', 'நீர்ச் சுழற்சி'], circuit: ['Closing a circuit', 'மின்சுற்றை மூடுதல்'],
    },
    q: {
      traceUpper: ['Trace capital {c} on the dotted line', 'புள்ளிக் கோட்டின் மேல் பெரிய எழுத்து {c}-ஐ எழுது'],
      traceLower: ['Trace small {c} on the dotted line', 'புள்ளிக் கோட்டின் மேல் சிறிய எழுத்து {c}-ஐ எழுது'],
      traceDigit: ['Trace the number {c} on the dotted line', 'புள்ளிக் கோட்டின் மேல் {c} என்ற எண்ணை எழுது'],
      traceTa: ['Trace the letter {c} on the grey shape', 'சாம்பல் நிற வடிவத்தின் மேல் {c} என்ற எழுத்தை எழுது'],
      writeUpper: ['Write capital {c} between the lines', 'கோடுகளுக்கு இடையில் பெரிய எழுத்து {c}-ஐ எழுது'],
      writeLower: ['Write small {c} between the lines', 'கோடுகளுக்கு இடையில் சிறிய எழுத்து {c}-ஐ எழுது'],
      writeDigit: ['Write the number {c} between the lines', 'கோடுகளுக்கு இடையில் {c} என்ற எண்ணை எழுது'],
      writeTa: ['Write the letter {c} between the lines', 'கோடுகளுக்கு இடையில் {c} என்ற எழுத்தை எழுது'],
      shape: ['Draw a {s}', 'ஒரு {s} வரை'],
      symLine: ['Draw the line of symmetry', 'சமச்சீர்க் கோட்டை வரை'],
      symHalf: ['Draw the other half, like a mirror', 'கண்ணாடியில் தெரிவது போல் மற்றப் பாதியை வரை'],
      groups: ['Draw {a} groups of {b}', '{b} கொண்ட {a} குழுக்களை வரை'],
      groupsHow: ['Draw {a} rings, then put {b} dots inside each ring.', '{a} வளையங்கள் வரை; ஒவ்வொன்றின் உள்ளும் {b} புள்ளிகள் வை.'],
      roots: ['Draw the roots of this plant', 'இந்தச் செடியின் வேர்களை வரை'],
      petals: ['Draw petals around the middle of the flower', 'பூவின் நடுவைச் சுற்றி இதழ்களை வரை'],
      water: ['Draw the two arrows of the water cycle', 'நீர்ச் சுழற்சியின் இரண்டு அம்புக்குறிகளை வரை'],
      waterHow: ['One arrow from the sea up to the cloud, one from the cloud down to the land.', 'கடலில் இருந்து மேகத்துக்கு மேலே ஒரு அம்பு; மேகத்தில் இருந்து நிலத்துக்குக் கீழே ஒரு அம்பு.'],
      circuit: ['Draw the wire that closes the circuit', 'மின்சுற்றை மூடும் கம்பியை வரை'],
      circuitHow: ['Join the two metal clips with one line.', 'இரண்டு உலோக இணைப்புகளையும் ஒரே கோட்டால் இணை.'],
    },
    say: { capital: ['capital', 'பெரிய எழுத்து'], small: ['small', 'சிறிய எழுத்து'], number: ['number', 'எண்'], trace: ['Trace it on the dotted line.', 'புள்ளிக் கோட்டின் மேல் எழுது.'], write: ['Write it between the lines.', 'கோடுகளுக்கு இடையில் எழுது.'] },
    pos: { top: ['top', 'மேலே இருந்து'], middle: ['middle', 'நடுவில் இருந்து'], bottom: ['bottom', 'கீழே இருந்து'] },
    path: {
      down: ['go straight down', 'நேராகக் கீழே இறங்கு'], up: ['go straight up', 'நேராக மேலே ஏறு'], right: ['go across to the right', 'வலப்பக்கம் குறுக்கே செல்'], left: ['go across to the left', 'இடப்பக்கம் குறுக்கே செல்'],
      downL: ['slant down to the left', 'இடப்பக்கமாகச் சாய்ந்து கீழே இறங்கு'], downR: ['slant down to the right', 'வலப்பக்கமாகச் சாய்ந்து கீழே இறங்கு'],
      upR: ['slant up to the right', 'வலப்பக்கமாகச் சாய்ந்து மேலே ஏறு'], upL: ['slant up to the left', 'இடப்பக்கமாகச் சாய்ந்து மேலே ஏறு'],
      roundR: ['curve round to the right', 'வலப்பக்கமாக வளைந்து சுற்று'], roundL: ['curve round to the left', 'இடப்பக்கமாக வளைந்து சுற்று'],
      dot: ['put a dot', 'ஒரு புள்ளி வை'], then: [', then ', ', பிறகு '],
    },
    d: { stroke: ['Stroke {n}: start at the {pos} and {path}.', 'கோடு {n}: {pos} தொடங்கி, {path}.'], dot: ['Stroke {n}: {path} on top.', 'கோடு {n}: மேலே {path}.'] },
    fb: {
      good: ['That is it.', 'சரியாக வந்தது.'], allDone: ['All {n} strokes done. Press Check.', '{n} கோடுகளும் முடிந்தன. சரிபார் என்பதை அழுத்து.'],
      startTop: ['Start at the top, at dot {n}, and follow the arrow.', 'மேலே, புள்ளி {n}-இல் தொடங்கி, அம்புக்குறி வழியே செல்.'],
      startBottom: ['Start at the bottom, at dot {n}, and follow the arrow.', 'கீழே, புள்ளி {n}-இல் தொடங்கி, அம்புக்குறி வழியே செல்.'],
      startAt: ['Start at dot {n} and follow the arrow.', 'புள்ளி {n}-இல் தொடங்கி, அம்புக்குறி வழியே செல்.'],
      round: ['Nearly. Go round the other way, like the arrow.', 'கிட்டத்தட்ட. அம்புக்குறி காட்டும் திசையில் சுற்று.'],
      order: ['First {path}. Start at dot {n}.', 'முதலில் {path}. புள்ளி {n}-இல் தொடங்கு.'],
      far: ['Stay on the dotted line. Try stroke {n} again, slowly.', 'புள்ளிக் கோட்டின் மேலேயே இரு. கோடு {n}-ஐ மெதுவாக மீண்டும் வரை.'],
      dot: ['Put the dot on the small mark above.', 'மேலே உள்ள சிறிய குறியின் மேல் புள்ளி வை.'],
      extra: ['This one is finished. Press Check, or Clear to write it again.', 'இது முடிந்தது. சரிபார் என்பதை அழுத்து; மீண்டும் எழுத அழி என்பதை அழுத்து.'],
      keys: ['Using a keyboard? Press Check to see how it is drawn, or use Hint.', 'விசைப்பலகையா? எப்படி வரைவது என்று பார்க்க சரிபார் அல்லது குறிப்பு என்பதை அழுத்து.'],
      traced: ['You have covered {p}% of the letter.', 'எழுத்தின் {p}% பகுதியை வரைந்துவிட்டாய்.'],
      written: ['Press Check when your letter is finished.', 'எழுதி முடித்ததும் சரிபார் என்பதை அழுத்து.'],
      drawn: ['Press Check when you have finished.', 'வரைந்து முடித்ததும் சரிபார் என்பதை அழுத்து.'],
      groups: ['Rings: {a}. Dots in each: {list}.', 'வளையங்கள்: {a}. ஒவ்வொன்றிலும் புள்ளிகள்: {list}.'],
      rootsAbove: ['Roots grow under the soil. Draw below the brown line.', 'வேர்கள் மண்ணுக்குள் வளரும். பழுப்புக் கோட்டுக்குக் கீழே வரை.'],
      rootsJoin: ['Join the roots to the bottom of the stem.', 'வேர்களைத் தண்டின் அடியோடு இணை.'],
      rootsMore: ['Good. Plants have many roots: draw a few more.', 'நன்று. செடிக்குப் பல வேர்கள் உண்டு: இன்னும் சில வரை.'],
      rootsOk: ['Those roots can hold the plant and drink water.', 'இந்த வேர்கள் செடியைப் பிடித்துக்கொண்டு நீரை உறிஞ்சும்.'],
      petals: ['Petals so far: {n}. Go all the way round the middle.', 'இதுவரை இதழ்கள்: {n}. நடுவை முழுவதும் சுற்றி வரை.'],
      petalsOk: ['A full ring of petals.', 'முழுச் சுற்று இதழ்கள்.'],
      petalsFar: ['Petals grow from the middle of the flower. Draw them touching the yellow centre.', 'இதழ்கள் பூவின் நடுவில் இருந்து வளரும். மஞ்சள் நடுவைத் தொடும்படி வரை.'],
      evap: ['That is evaporation: water rises from the sea as vapour.', 'அது ஆவியாதல் (evaporation): கடல் நீர் ஆவியாக மேலே எழும்.'],
      rain: ['That is rain falling on the land.', 'அது நிலத்தின் மேல் பெய்யும் மழை (rain).'],
      evapWrong: ['Water vapour goes up from the sea, so start at the sea.', 'நீராவி கடலில் இருந்து மேலே போகும்; அதனால் கடலில் இருந்து தொடங்கு.'],
      rainWrong: ['Rain falls down from the cloud, so start at the cloud.', 'மழை மேகத்தில் இருந்து கீழே விழும்; அதனால் மேகத்தில் இருந்து தொடங்கு.'],
      waterMiss: ['Draw from the sea to the cloud, or from the cloud to the land.', 'கடலில் இருந்து மேகத்துக்கு, அல்லது மேகத்தில் இருந்து நிலத்துக்கு வரை.'],
      wired: ['The circuit is closed. The bulb lights up.', 'மின்சுற்று மூடியது. விளக்கு எரிகிறது.'],
      wireHalf: ['Nearly. Your line must touch both metal clips.', 'கிட்டத்தட்ட. உன் கோடு இரண்டு உலோக இணைப்புகளையும் தொட வேண்டும்.'],
      symNotStraight: ['Use one straight line.', 'ஒரே நேர்க் கோட்டைப் பயன்படுத்து.'],
    },
    given: { strokes: ['{a} of {b} strokes', '{b}-இல் {a} கோடுகள்'], nothing: ['nothing drawn', 'எதுவும் வரையவில்லை'], open: ['an open shape', 'மூடாத வடிவம்'], blob: ['a shape with {n} corners', '{n} மூலைகள் உள்ள வடிவம்'], quad: ['a four-sided shape', 'நான்கு பக்க வடிவம்'], wobbly: ['a wobbly line', 'வளைந்த கோடு'], line: ['a line', 'ஒரு கோடு'], covered: ['{p}% covered', '{p}% வரைந்தது'], match: ['a {p}% match', '{p}% பொருத்தம்'] },
    h: {
      t1: ['Find the dot with the number 1. That is where your pencil starts.', 'எண் 1 உள்ள புள்ளியைக் கண்டுபிடி. அங்கிருந்துதான் பென்சில் தொடங்கும்.'],
      w1: ['Look at the model. Tall parts touch the top line, and the letter sits on the bottom line.', 'மாதிரியைப் பார். உயரமான பகுதிகள் மேல் கோட்டைத் தொடும்; எழுத்து கீழ்க் கோட்டின் மேல் அமரும்.'],
      w1Lower: ['Look at the model. The round body sits between the middle line and the bottom line.', 'மாதிரியைப் பார். உருண்டையான பகுதி நடுக் கோட்டுக்கும் கீழ்க் கோட்டுக்கும் இடையில் அமரும்.'],
      all: ['{n} strokes, in this order:', '{n} கோடுகள், இந்த வரிசையில்:'],
      ta1: ['Go slowly and keep your line on the letter shape.', 'மெதுவாக வரை; உன் கோடு எழுத்தின் வடிவத்தின் மேலேயே இருக்கட்டும்.'],
      ta2: ['Make it big: from the top line down to the bottom line.', 'பெரிதாக எழுது: மேல் கோட்டில் இருந்து கீழ்க் கோடு வரை.'],
      ta3: ['This is {c}. Copy every curve and loop.', 'இதுதான் {c}. ஒவ்வொரு வளைவையும் சுழியையும் அப்படியே வரை.'],
      shape1: { triangle: ['A triangle has 3 corners. Start at one corner.', 'முக்கோணத்திற்கு 3 மூலைகள். ஒரு மூலையில் தொடங்கு.'], square: ['A square has 4 corners and 4 sides of the same length.', 'சதுரத்திற்கு 4 மூலைகளும் ஒரே நீளமுள்ள 4 பக்கங்களும் உண்டு.'], rectangle: ['A rectangle has 4 square corners. Two sides are long and two are short.', 'செவ்வகத்திற்கு 4 செங்கோண மூலைகள். இரண்டு பக்கங்கள் நீளம், இரண்டு குட்டை.'], circle: ['A circle has no corners. Keep turning the same amount all the way round.', 'வட்டத்திற்கு மூலைகள் இல்லை. முழுவதும் ஒரே அளவு திரும்பிக்கொண்டே வரை.'], pentagon: ['A pentagon has 5 corners.', 'ஐங்கோணத்திற்கு 5 மூலைகள்.'], hexagon: ['A hexagon has 6 corners.', 'அறுகோணத்திற்கு 6 மூலைகள்.'] },
      shape2: ['Imagine a dot for each corner, then join them with straight lines and come back to the start.', 'ஒவ்வொரு மூலைக்கும் ஒரு புள்ளியை நினைத்துக்கொள்; அவற்றை நேர்க் கோடுகளால் இணைத்து, தொடங்கிய இடத்துக்கே திரும்பி வா.'],
      circle2: ['Start at the top and go round without lifting your pencil, back to where you started.', 'மேலே தொடங்கி, பென்சிலைத் தூக்காமல் சுற்றி, தொடங்கிய இடத்துக்கே வா.'],
      sym1: ['A line of symmetry cuts a shape into two halves that match.', 'சமச்சீர்க் கோடு ஒரு வடிவத்தை ஒன்றுபோல் இருக்கும் இரண்டு பாதிகளாகப் பிரிக்கும்.'],
      sym2: ['Imagine folding the shape so the halves sit on top of each other. Where is the fold?', 'இரண்டு பாதிகளும் ஒன்றின் மேல் ஒன்று அமரும்படி வடிவத்தை மடிப்பதாக நினை. மடிப்பு எங்கே?'],
      sym3: ['The fold goes straight through the middle, from one edge to the other.', 'மடிப்பு நடுவின் வழியே, ஒரு ஓரத்தில் இருந்து மறு ஓரம் வரை நேராகச் செல்லும்.'],
      half1: ['Each corner on the new half is the same distance from the dashed line as its partner.', 'புதிய பாதியின் ஒவ்வொரு மூலையும் கோட்டில் இருந்து, அதன் இணை மூலை இருக்கும் அதே தூரத்தில் இருக்கும்.'],
      half2: ['Start at the top of the dashed line and copy each corner across, like a mirror.', 'புள்ளிக் கோட்டின் மேல் முனையில் தொடங்கி, ஒவ்வொரு மூலையையும் கண்ணாடி போல் மறுபக்கம் வரை.'],
      half3: ['Here is the whole shape. Your half matches the left half.', 'இதுதான் முழு வடிவம். உன் பாதி இடப் பாதியைப் போலவே இருக்கும்.'],
      grp1: ['First draw {a} rings, big enough for {b} dots each.', 'முதலில் {a} வளையங்கள் வரை; ஒவ்வொன்றிலும் {b} புள்ளிகள் வைக்க இடம் இருக்கட்டும்.'],
      grp2: ['Then put dots in the first ring, counting up to {b}.', 'பிறகு முதல் வளையத்தில் {b} வரை எண்ணிக்கொண்டே புள்ளிகள் வை.'],
      grp3: ['{a} rings with {b} dots in each: {sum} = {n}.', 'ஒவ்வொன்றிலும் {b} புள்ளிகளுடன் {a} வளையங்கள்: {sum} = {n}.'],
      roots1: ['Roots grow down, under the soil.', 'வேர்கள் கீழ்நோக்கி, மண்ணுக்குள் வளரும்.'],
      roots2: ['Start at the bottom of the stem and draw lines spreading down and out.', 'தண்டின் அடியில் தொடங்கி, கீழும் பக்கங்களிலும் பரவும் கோடுகளை வரை.'],
      roots3: ['Like this: several roots spreading from the stem into the soil.', 'இப்படி: தண்டில் இருந்து மண்ணுக்குள் பரவும் பல வேர்கள்.'],
      petals1: ['Petals grow in a ring around the middle of a flower.', 'இதழ்கள் பூவின் நடுவைச் சுற்றி வளையமாக வளரும்.'],
      petals2: ['Draw one petal at the top, then keep going round like a clock.', 'மேலே ஒரு இதழ் வரை; பிறகு கடிகாரம் போல் சுற்றிக்கொண்டே வரை.'],
      petals3: ['Like this: five or more petals, all the way round.', 'இப்படி: ஐந்து அல்லது அதற்கு மேற்பட்ட இதழ்கள், முழுவதும் சுற்றி.'],
      water1: ['The sun warms the sea. Which way does the warm water vapour go?', 'சூரியன் கடலைச் சூடாக்கும். சூடான நீராவி எந்தப் பக்கம் போகும்?'],
      water2: ['Vapour goes up from the sea to make the cloud. Draw that arrow first.', 'நீராவி கடலில் இருந்து மேலே சென்று மேகமாகும். முதலில் அந்த அம்பை வரை.'],
      water3: ['Up from the sea to the cloud, then down from the cloud to the land as rain.', 'கடலில் இருந்து மேகத்துக்கு மேலே; பிறகு மேகத்தில் இருந்து நிலத்துக்கு மழையாகக் கீழே.'],
      circuit1: ['Electricity needs a full loop, with no gap.', 'மின்சாரம் ஓட, இடைவெளி இல்லாத முழுச் சுற்று வேண்டும்.'],
      circuit2: ['Find the gap between the two metal clips.', 'இரண்டு உலோக இணைப்புகளுக்கு இடையிலான இடைவெளியைக் கண்டுபிடி.'],
      circuit3: ['One line from clip to clip closes the loop.', 'ஒரு இணைப்பில் இருந்து மற்றதற்கு ஒரு கோடு சுற்றை மூடும்.'],
    },
    y: {
      strokes: ['{c} is made of {n} strokes.', '{c} {n} கோடுகளால் ஆனது.'], strokes1: ['{c} is made of one stroke.', '{c} ஒரே கோட்டால் ஆனது.'],
      ruleTrace: ['Most strokes start at the top and go down. Lift your pencil between strokes.', 'பெரும்பாலான கோடுகள் மேலே தொடங்கிக் கீழே வரும். ஒவ்வொரு கோட்டுக்கும் இடையில் பென்சிலைத் தூக்கு.'],
      ruleWrite: ['Same strokes, same order, every time: your hand remembers it and your writing gets quicker.', 'ஒவ்வொரு முறையும் அதே கோடுகள், அதே வரிசை: கை நினைவில் வைத்துக்கொள்ளும்; எழுத்து வேகமாகும்.'],
      tipLine: ['Tip: sit the letter on the bottom line.', 'குறிப்பு: எழுத்தைக் கீழ்க் கோட்டின் மேல் அமர வை.'],
      tipSmall: ['Tip: make it taller, up to the top line.', 'குறிப்பு: மேல் கோடு வரை உயரமாக எழுது.'],
      ta: ['{c} as in {w}.', '{c}: {w}.'],
      taCheck: ['Tamil letters are checked by how much of the letter shape your lines cover. Stroke order for Tamil letters is not checked yet.', 'தமிழ் எழுத்துகளில், உன் கோடுகள் எழுத்தின் வடிவத்தை எவ்வளவு மூடுகின்றன என்று பார்க்கப்படுகிறது. கோடுகளின் வரிசை இன்னும் பார்க்கப்படவில்லை.'],
      taRule: ['அ to ஔ are the 12 uyir ezhuthu (vowels). Each one is a sound on its own.', 'அ முதல் ஔ வரை 12 உயிர் எழுத்துகள். ஒவ்வொன்றும் தனி ஒலி.'],
      saw: ['Your shape has {n} corners and straight sides.', 'உன் வடிவத்திற்கு {n} மூலைகளும் நேர்ப் பக்கங்களும் உள்ளன.'],
      sawRound: ['Your shape is round, with no corners.', 'உன் வடிவம் உருண்டையாக, மூலைகள் இல்லாமல் உள்ளது.'],
      sawOval: ['Your shape is round but stretched, like an egg: that is an oval.', 'உன் வடிவம் உருண்டை, ஆனால் முட்டை போல் நீண்டது: அது நீள்வட்டம்.'],
      sawOpen: ['Your shape is not closed: the end does not meet the start.', 'உன் வடிவம் மூடவில்லை: முடிவு தொடக்கத்தைச் சேரவில்லை.'],
      sawBlob: ['Your shape has curvy sides, so its corners are hard to count.', 'உன் வடிவத்தின் பக்கங்கள் வளைந்துள்ளன; அதனால் மூலைகளை எண்ணுவது கடினம்.'],
      sawNone: ['Nothing was drawn this time.', 'இந்த முறை எதுவும் வரையவில்லை.'],
      sawSq: ['All four sides are about the same length, so it is a square.', 'நான்கு பக்கங்களும் ஏறக்குறைய ஒரே நீளம்; அதனால் அது சதுரம்.'],
      sawRect: ['Two sides are longer than the other two, so it is a rectangle.', 'இரண்டு பக்கங்கள் மற்ற இரண்டை விட நீளம்; அதனால் அது செவ்வகம்.'],
      sawQuad: ['It has 4 sides, but its corners are not square corners.', 'அதற்கு 4 பக்கங்கள் உண்டு, ஆனால் மூலைகள் செங்கோணங்கள் அல்ல.'],
      sqIsRect: ['A square is a special rectangle, with all four sides equal.', 'சதுரம் ஒரு சிறப்பான செவ்வகம்: அதன் நான்கு பக்கங்களும் சமம்.'],
      props: {
        triangle: ['A triangle has 3 straight sides and 3 corners.', 'முக்கோணத்திற்கு 3 நேர்ப் பக்கங்களும் 3 மூலைகளும் உண்டு.'],
        square: ['A square has 4 equal sides and 4 square corners.', 'சதுரத்திற்கு 4 சம பக்கங்களும் 4 செங்கோண மூலைகளும் உண்டு.'],
        rectangle: ['A rectangle has 4 sides and 4 square corners. Opposite sides are equal.', 'செவ்வகத்திற்கு 4 பக்கங்களும் 4 செங்கோண மூலைகளும் உண்டு. எதிர்ப் பக்கங்கள் சமம்.'],
        circle: ['A circle is round with no corners. Every point on it is the same distance from the centre.', 'வட்டம் மூலைகள் இல்லாத உருண்டை வடிவம். அதன் ஒவ்வொரு புள்ளியும் மையத்திலிருந்து ஒரே தூரத்தில் இருக்கும்.'],
        pentagon: ['A pentagon has 5 straight sides and 5 corners.', 'ஐங்கோணத்திற்கு 5 நேர்ப் பக்கங்களும் 5 மூலைகளும் உண்டு.'],
        hexagon: ['A hexagon has 6 straight sides and 6 corners, like a honeycomb cell.', 'அறுகோணத்திற்கு 6 நேர்ப் பக்கங்களும் 6 மூலைகளும் உண்டு, தேன்கூட்டின் அறை போல.'],
      },
      shapeRule: ['Count the corners to name a flat shape: 3 is a triangle, 4 a quadrilateral, 5 a pentagon, 6 a hexagon.', 'சமதள வடிவத்தின் பெயர் சொல்ல மூலைகளை எண்ணு: 3 முக்கோணம், 4 நாற்கரம், 5 ஐங்கோணம், 6 அறுகோணம்.'],
      sym: ['A line of symmetry splits a shape into two halves that match like a mirror. Fold along it and the halves sit exactly on top of each other.', 'சமச்சீர்க் கோடு ஒரு வடிவத்தைக் கண்ணாடி போல் ஒன்றுபோல் இருக்கும் இரண்டு பாதிகளாகப் பிரிக்கும். அதன் வழியே மடித்தால் இரண்டு பாதிகளும் சரியாக ஒன்றின் மேல் ஒன்று அமரும்.'],
      symSaw: ['Your line: {g}.', 'உன் கோடு: {g}.'],
      symRule: ['Look for symmetry in leaves, butterflies, kolam patterns and temple gopurams.', 'இலைகள், வண்ணத்துப்பூச்சிகள், கோலங்கள், கோயில் கோபுரங்களில் சமச்சீரைத் தேடிப் பார்.'],
      grp: ['{a} groups of {b} is {sum} = {n}.', '{b} கொண்ட {a} குழுக்கள் = {sum} = {n}.'],
      grpMul: ['That is the same as {a} × {b} = {n}.', 'அது {a} × {b} = {n} என்பதற்குச் சமம்.'],
      grpRule: ['Equal groups are what multiplication counts: groups × how many in each.', 'பெருக்கல் எண்ணுவது சம குழுக்களைத்தான்: குழுக்கள் × ஒவ்வொன்றிலும் எத்தனை.'],
      roots1: ['Roots grow down into the soil. They hold the plant firmly so wind and rain cannot pull it out.', 'வேர்கள் மண்ணுக்குள் கீழே வளரும். காற்றும் மழையும் செடியைப் பிடுங்காதபடி அவை செடியை உறுதியாகப் பிடித்துக்கொள்ளும்.'],
      roots2: ['Roots also drink water and minerals from the soil and send them up the stem to the leaves.', 'வேர்கள் மண்ணில் இருந்து நீரையும் கனிமங்களையும் உறிஞ்சி, தண்டு வழியாக இலைகளுக்கு அனுப்பும்.'],
      rootsRule: ['Water a plant at its roots, in the soil, not on its leaves.', 'செடிக்கு இலைகளில் அல்ல, மண்ணில் வேரருகே நீர் ஊற்று.'],
      petals1: ['Petals grow in a ring around the centre of the flower.', 'இதழ்கள் பூவின் நடுவைச் சுற்றி வளையமாக வளரும்.'],
      petals2: ['Their bright colours invite bees and butterflies. The insects carry pollen from flower to flower, so seeds and fruits can form.', 'அவற்றின் பளிச்சிடும் நிறங்கள் தேனீக்களையும் வண்ணத்துப்பூச்சிகளையும் அழைக்கும். பூச்சிகள் மகரந்தத்தை ஒரு பூவில் இருந்து இன்னொன்றுக்குக் கொண்டு செல்வதால் விதைகளும் பழங்களும் உருவாகும்.'],
      petalsRule: ['Count the petals of a hibiscus (செம்பருத்தி): it has 5.', 'செம்பருத்திப் பூவின் இதழ்களை எண்ணிப் பார்: 5 இருக்கும்.'],
      water1: ['Evaporation: the sun warms the sea and water rises as invisible vapour.', 'ஆவியாதல் (evaporation): சூரியன் கடலைச் சூடாக்க, நீர் கண்ணுக்குத் தெரியாத ஆவியாக மேலே எழும்.'],
      water2: ['Condensation: high up it is cold, so the vapour turns into tiny drops that make a cloud.', 'ஒடுக்கம் (condensation): மேலே குளிராக இருப்பதால், ஆவி சிறு துளிகளாக மாறி மேகமாகும்.'],
      water3: ['Rain: the drops join, get heavy and fall on the land. Rivers carry the water back to the sea.', 'மழை (rain): துளிகள் சேர்ந்து கனமாகி நிலத்தில் விழும். ஆறுகள் நீரை மீண்டும் கடலுக்குக் கொண்டு செல்லும்.'],
      waterRule: ['The same water goes round and round: sea, cloud, rain, river, sea.', 'அதே நீர் சுற்றிச் சுற்றி வரும்: கடல், மேகம், மழை, ஆறு, கடல்.'],
      circuit1: ['A closed circuit is a full loop: battery, wire, bulb and back. Electricity flows and the bulb glows.', 'மூடிய மின்சுற்று ஒரு முழுச் சுற்று: மின்கலம், கம்பி, விளக்கு, மீண்டும் மின்கலம். மின்சாரம் ஓட, விளக்கு எரியும்.'],
      circuit2: ['With a gap the circuit is open. Electricity stops and the bulb goes dark.', 'இடைவெளி இருந்தால் சுற்று திறந்திருக்கும். மின்சாரம் நின்று விளக்கு அணையும்.'],
      circuitRule: ['A switch simply opens and closes the gap.', 'சுவிட்ச் அந்த இடைவெளியைத் திறந்து மூடுகிறது, அவ்வளவுதான்.'],
    },
    lb: { soil: ['soil', 'மண்'], stem: ['stem', 'தண்டு'], sea: ['sea', 'கடல்'], cloud: ['cloud', 'மேகம்'], land: ['land', 'நிலம்'], sun: ['sun', 'சூரியன்'], battery: ['battery', 'மின்கலம்'], bulb: ['bulb', 'விளக்கு'], clip: ['clip', 'இணைப்பு'], centre: ['centre', 'நடு'] },
    ta: { w0: ['அம்மா (amma, mother)', 'அம்மா'], w1: ['ஆடு (aadu, goat)', 'ஆடு'], w2: ['இலை (ilai, leaf)', 'இலை'], w3: ['ஈ (ee, a fly)', 'ஈ'], w4: ['உரல் (ural, a stone mortar)', 'உரல்'], w5: ['ஊஞ்சல் (oonjal, a swing)', 'ஊஞ்சல்'], w6: ['எலி (eli, a mouse)', 'எலி'], w7: ['ஏணி (eni, a ladder)', 'ஏணி'], w8: ['ஐந்து (ainthu, five)', 'ஐந்து'], w9: ['ஒட்டகம் (ottagam, a camel)', 'ஒட்டகம்'], w10: ['ஓடம் (odam, a boat)', 'ஓடம்'], w11: ['ஔவையார் (Avvaiyar, the poet)', 'ஔவையார்'] },
    ui: { show: ['Show me', 'காட்டு'], undo: ['Undo', 'செயல்தவிர்'], clear: ['Clear', 'அழி'], mixed: ['Capitals and small', 'பெரியதும் சிறியதும்'], pickSet: ['Letters to practise', 'பயிற்சிக்கான எழுத்துகள்'], openBook: ['Open the sketchbook', 'வரைபுத்தகத்தைத் திற'], padLabel: ['Drawing area. {task}', 'வரையும் இடம். {task}'] },
    intro: {
      english: ['Each letter is a set of strokes in a fixed order. Watch the numbered guide, then follow it with your finger, a stylus or the mouse.', 'ஒவ்வொரு எழுத்தும் ஒரு குறிப்பிட்ட வரிசையில் வரும் கோடுகளால் ஆனது. எண்ணிட்ட வழிகாட்டியைப் பார்த்து, விரல், எழுதுகோல் அல்லது சுட்டியால் பின்பற்று.'],
      maths: ['Write numbers stroke by stroke, draw shapes that are checked by their corners and sides, find lines of symmetry and draw equal groups.', 'எண்களைக் கோடு கோடாக எழுது; மூலைகளும் பக்கங்களும் பார்க்கப்படும் வடிவங்களை வரை; சமச்சீர்க் கோடுகளைக் கண்டுபிடி; சம குழுக்களை வரை.'],
      science: ['Finish each diagram on the board: then a short lesson explains what you drew and why it matters.', 'பலகையில் உள்ள ஒவ்வொரு படத்தையும் முடி: பிறகு நீ வரைந்தது என்ன, ஏன் முக்கியம் என்று ஒரு சிறு பாடம் விளக்கும்.'],
      young: ['Ages 3 to 6 trace on a dotted path, one stroke at a time.', '3 முதல் 6 வயதினர் புள்ளிக் கோட்டின் மேல், ஒவ்வொரு கோடாக எழுதுவார்கள்.'],
      older: ['Ages 7 to 10 write freehand between the guide lines.', '7 முதல் 10 வயதினர் வழிகாட்டிக் கோடுகளுக்கு இடையில் தாமாக எழுதுவார்கள்.'],
      tasks: ['5 tasks', '5 பணிகள்'],
    },
    book: {
      eyebrow: ['Free drawing', 'விருப்பம் போல் வரை'], title: ['Sketchbook', 'வரைபுத்தகம்'], lead: ['Draw anything you like. Save it to keep it in your gallery.', 'உனக்குப் பிடித்ததை வரை. சேமித்தால் உன் படத்தொகுப்பில் இருக்கும்.'],
      colour: ['Colour', 'நிறம்'], size: ['Brush size', 'தூரிகை அளவு'], eraser: ['Eraser', 'அழிப்பான்'], thin: ['Thin', 'மெல்லிய'], medium: ['Medium', 'நடுத்தர'], thick: ['Thick', 'தடித்த'],
      save: ['Save to gallery', 'படத்தொகுப்பில் சேமி'], saved: ['Saved to your gallery.', 'உன் படத்தொகுப்பில் சேமிக்கப்பட்டது.'], empty: ['Draw something first.', 'முதலில் ஏதாவது வரை.'], full: ['Your gallery keeps the newest {n} drawings.', 'உன் படத்தொகுப்பில் புதிய {n} படங்கள் இருக்கும்.'],
      gallery: ['Gallery', 'படத்தொகுப்பு'], none: ['No drawings saved yet.', 'இன்னும் படங்கள் சேமிக்கப்படவில்லை.'], view: ['Drawing {n}', 'படம் {n}'], removed: ['Drawing removed.', 'படம் நீக்கப்பட்டது.'], back: ['Back', 'பின்செல்'], cleared: ['Cleared. Undo brings it back.', 'அழிக்கப்பட்டது. செயல்தவிர் அழுத்தினால் திரும்ப வரும்.'],
    },
    col: { ink: ['Ink blue', 'மை நீலம்'], teal: ['Peacock green', 'மயில் பச்சை'], turmeric: ['Turmeric yellow', 'மஞ்சள்'], kumkum: ['Kumkum red', 'குங்குமச் சிவப்பு'], leaf: ['Leaf green', 'இலைப் பச்சை'], indigo: ['Indigo', 'அவுரி நீலம்'] },
  } });

  // ======================= geometry =======================
  const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const plen = P => { let s = 0; for (let i = 1; i < P.length; i++) s += d2(P[i - 1], P[i]); return s; };
  const avg = a => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
  function resample(P, n) {
    const first = [P[0][0], P[0][1]], total = plen(P);
    if (P.length < 2 || !total) return Array.from({ length: n }, () => first.slice());
    const step = total / (n - 1), out = [first]; let acc = 0, prev = first;
    for (let i = 1; i < P.length; i++) {
      const cur = [P[i][0], P[i][1]]; let d = d2(prev, cur);
      while (acc + d >= step && out.length < n) { const k = (step - acc) / d, q = [prev[0] + k * (cur[0] - prev[0]), prev[1] + k * (cur[1] - prev[1])]; out.push(q); prev = q; d = d2(prev, cur); acc = 0; }
      acc += d; prev = cur;
    }
    while (out.length < n) out.push([P.at(-1)[0], P.at(-1)[1]]);
    return out;
  }
  function segDist(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy; let k = l2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2 : 0; k = Math.max(0, Math.min(1, k)); return Math.hypot(p[0] - a[0] - k * dx, p[1] - a[1] - k * dy); }
  function polyDist(p, P) { if (P.length === 1) return d2(p, P[0]); let m = Infinity; for (let i = 1; i < P.length; i++) m = Math.min(m, segDist(p, P[i - 1], P[i])); return m; }
  function setDist(A, B) { return avg(A.map(p => { let m = Infinity; for (const q of B) { const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (d < m) m = d; } return Math.sqrt(m); })); }
  function rdp(P, eps) { if (P.length < 3) return P.slice(); let md = 0, k = 0; for (let i = 1; i < P.length - 1; i++) { const d = segDist(P[i], P[0], P.at(-1)); if (d > md) { md = d; k = i; } } if (md <= eps) return [P[0], P.at(-1)]; return rdp(P.slice(0, k + 1), eps).slice(0, -1).concat(rdp(P.slice(k), eps)); }
  const centroid = P => [avg(P.map(p => p[0])), avg(P.map(p => p[1]))];
  const sarea = P => { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; };
  function bbox(P) { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; P.forEach(p => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }; }
  function inPoly(p, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if (((P[i][1] > p[1]) !== (P[j][1] > p[1])) && (p[0] < (P[j][0] - P[i][0]) * (p[1] - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0])) c = !c; return c; }
  function angleAt(a, b, c) { const v1 = [a[0] - b[0], a[1] - b[1]], v2 = [c[0] - b[0], c[1] - b[1]]; const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / ((Math.hypot(...v1) * Math.hypot(...v2)) || 1); return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI; }
  function chain(strokes) { // join strokes end to end (flipping as needed) into one path
    const left = strokes.map(s => s.slice()); if (!left.length) return []; let path = left.shift();
    while (left.length) {
      const end = path.at(-1); let best = 0, rev = false, bd = Infinity;
      left.forEach((s, i) => { const a = d2(end, s[0]), b = d2(end, s.at(-1)); if (a < bd) { bd = a; best = i; rev = false; } if (b < bd) { bd = b; best = i; rev = true; } });
      const s = left.splice(best, 1)[0]; path = path.concat(rev ? s.reverse() : s);
    }
    return path;
  }
  // even sampling of a whole drawing (for shape matching)
  const sampleAll = strokes => strokes.flatMap(s => s.length > 1 && plen(s) > 2 ? resample(s, Math.max(4, Math.round(plen(s) / 4))) : [s[0]]);
  const normSet = P => { const b = bbox(P), k = Math.max(b.w, b.h) || 1; return P.map(p => [(p[0] - b.cx) / k, (p[1] - b.cy) / k]); };

  // ======================= letter and number strokes =======================
  // Grid: x from 0, y 0 = top line, 5 = middle line, 10 = base line, 14 = tail line. Each string is one stroke:
  // "x,y" points joined by straight lines, "Ccx,cy,rx,ry,a0,a1" an arc (degrees, 0 = right, 90 = down).
  const GL = {
    A: ['4,0 0,10', '4,0 8,10', '1.6,6 6.4,6'], B: ['0,0 0,10', '0,0 3.5,0 C3.5,2.5,2.5,2.5,-90,90 0,5', '0,5 4,5 C4,7.5,2.8,2.5,-90,90 0,10'],
    C: ['C4.5,5,4.5,5,-40,-320'], D: ['0,0 0,10', '0,0 2.5,0 C2.5,5,4.5,5,-90,90 0,10'], E: ['0,0 0,10', '0,0 6,0', '0,5 5,5', '0,10 6,10'],
    F: ['0,0 0,10', '0,0 6,0', '0,5 5,5'], G: ['C4.5,5,4.5,5,-40,-360 5.5,5'], H: ['0,0 0,10', '7,0 7,10', '0,5 7,5'], I: ['3,0 3,10', '0,0 6,0', '0,10 6,10'],
    J: ['6,0 6,7 C3,7,3,3,0,180'], K: ['0,0 0,10', '7,0 0,5.5', '2.2,4.3 7,10'], L: ['0,0 0,10', '0,10 6,10'], M: ['0,0 0,10', '0,0 4,7 8,0', '8,0 8,10'],
    N: ['0,0 0,10', '0,0 7,10', '7,10 7,0'], O: ['C4.5,5,4.5,5,-90,-450'], P: ['0,0 0,10', '0,0 3.5,0 C3.5,2.75,2.8,2.75,-90,90 0,5.5'],
    Q: ['C4.5,5,4.5,5,-90,-450', '5,7 9,10.5'], R: ['0,0 0,10', '0,0 3.5,0 C3.5,2.75,2.8,2.75,-90,90 0,5.5', '2.8,5.5 6.5,10'],
    S: ['C4,2.6,3.6,2.6,-20,-270 C4,7.5,3.8,2.5,-90,150'], T: ['4,0 4,10', '0,0 8,0'], U: ['0,0 0,6.5 C4,6.5,4,3.5,180,0 8,0'], V: ['0,0 4,10 8,0'],
    W: ['0,0 2.5,10 5,2 7.5,10 10,0'], X: ['0,0 8,10', '8,0 0,10'], Y: ['0,0 4,5', '8,0 4,5', '4,5 4,10'], Z: ['0,0 8,0 0,10 8,10'],
    0: ['C3,5,3,5,-90,-450'], 1: ['1,2 3,0 3,10'], 2: ['C3,3,3,3,-165,35 0,10 6.5,10'], 3: ['C3,2.6,3,2.6,-150,90 C3,7.5,3.2,2.5,-90,150'],
    4: ['4.5,0 0,7 7,7', '5,0 5,10'], 5: ['1,0 0.8,4.6 C3.2,7,3,3,-140,140', '1,0 6,0'], 6: ['C5.5,6,5,6,-100,-180 C3.2,7.2,2.8,2.8,180,-180'],
    7: ['0,0 6.5,0 2,10'], 8: ['C3,2.5,2.5,2.5,-90,-270 C3,7.4,2.7,2.6,-90,270 C3,2.5,2.5,2.5,90,-90'], 9: ['C3,3,3,3,0,-360 6,10'],
    a: ['C2.5,7.5,2.5,2.5,0,-360', '5,5 5,10'], b: ['0,0 0,10', 'C2.5,7.5,2.5,2.5,180,540'], c: ['C2.7,7.5,2.7,2.5,-40,-320'], d: ['C2.5,7.5,2.5,2.5,0,-360', '5,0 5,10'],
    e: ['0.2,7.5 5.1,7.5 C2.6,7.5,2.5,2.5,0,-320'], f: ['C4.2,2,2,2,-20,-180 2.2,10', '0.5,5 4.5,5'], g: ['C2.5,7.5,2.5,2.5,0,-360', '5,5 5,12 C2.6,12,2.4,2,0,160'],
    h: ['0,0 0,10', '0,7.5 C2.5,7.5,2.5,2.5,180,360 5,10'], i: ['1,5 1,10', '1,2.6'], j: ['3,5 3,12 C1.5,12,1.5,2,0,160', '3,2.6'], k: ['0,0 0,10', '4.5,5 0,7.5 4.5,10'],
    l: ['1,0 1,10'], m: ['0,5 0,10', '0,7.5 C2,7.5,2,2.5,180,360 4,10', '4,7.5 C6,7.5,2,2.5,180,360 8,10'], n: ['0,5 0,10', '0,7.5 C2.5,7.5,2.5,2.5,180,360 5,10'],
    o: ['C2.6,7.5,2.6,2.5,-90,-450'], p: ['0,5 0,14', 'C2.5,7.5,2.5,2.5,180,540'], q: ['C2.5,7.5,2.5,2.5,0,-360', '5,5 5,14'], r: ['0,5 0,10', '0,7.5 C2.5,7.5,2.5,2.5,180,310'],
    s: ['C2.5,6.2,2.2,1.2,-20,-270 C2.5,8.75,2.4,1.25,-90,150'], t: ['2,1.5 2,10', '0,5 4,5'], u: ['0,5 0,7.5 C2.5,7.5,2.5,2.5,180,0', '5,5 5,10'], v: ['0,5 2.5,10 5,5'],
    w: ['0,5 1.75,10 3.5,6 5.25,10 7,5'], x: ['0,5 5,10', '5,5 0,10'], y: ['0,5 2.6,10', '5.2,5 1.2,14'], z: ['0,5 5,5 0,10 5,10'],
  };
  const SETS = {
    upper: ['EFHILT', 'AKMNVWXYZ', 'BCDGJOPQRSU'], lower: ['iltvwxzk', 'acdegoqs', 'bfhjmnpruy'], digit: ['0147', '2357', '689'],
  };
  const UYIR = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'];
  function parseStroke(str) {
    const pts = [], segs = []; let last = null;
    str.trim().split(/\s+/).forEach(tok => {
      if (tok[0] === 'C') {
        const [cx, cy, rx, ry, a0, a1] = tok.slice(1).split(',').map(Number), n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 10));
        for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
        segs.push({ k: 'arc', cw: a1 > a0 }); last = pts.at(-1);
      } else { const p = tok.split(',').map(Number); if (last) segs.push({ k: 'line', a: last, b: p }); pts.push(p); last = p; }
    });
    return { pts, segs };
  }
  const GCACHE = {};
  function glyph(ch) {
    if (GCACHE[ch]) return GCACHE[ch];
    const parsed = GL[ch].map(parseStroke), strokes = parsed.map(s => s.pts), bb = bbox(strokes.flat());
    const ox = L / 2 - bb.cx * U;
    const g = { ch, strokes, segs: parsed.map(s => s.segs), dot: strokes.map(P => P.length === 1), bb, desc: bb.y1 > 10.6, lower: /[a-z]/.test(ch) };
    g.log = strokes.map(P => P.map(p => [ox + p[0] * U, OY + p[1] * U]));
    g.ref = g.log.map((P, i) => g.dot[i] ? P.slice(0, 1) : resample(P, 40));
    return GCACHE[ch] = g;
  }
  function dirKey(a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], ax = Math.abs(dx), ay = Math.abs(dy); if (ay > 3.2 * ax) return dy > 0 ? 'down' : 'up'; if (ax > 3.2 * ay) return dx > 0 ? 'right' : 'left'; return dy > 0 ? (dx < 0 ? 'downL' : 'downR') : (dx > 0 ? 'upR' : 'upL'); }
  function pathWords(g, i) { if (g.dot[i]) return t('draw.path.dot'); const w = []; g.segs[i].forEach(s => { const k = s.k === 'arc' ? (s.cw ? 'roundR' : 'roundL') : dirKey(s.a, s.b); if (w.at(-1) !== k) w.push(k); }); return w.slice(0, 3).map(k => t('draw.path.' + k)).join(t('draw.path.then')); }
  function posKey(g, i) { const y = g.strokes[i][0][1], top = g.lower ? Math.min(5, g.bb.y0) : 0; return y <= top + 1.1 ? 'top' : y >= 9 ? 'bottom' : 'middle'; }
  function strokeDesc(g, i) { return g.dot[i] ? t('draw.d.dot', { n: i + 1, path: pathWords(g, i) }) : t('draw.d.stroke', { n: i + 1, pos: t('draw.pos.' + posKey(g, i)), path: pathWords(g, i) }); }
  function atFrac(P, f) { const tot = plen(P) * f; let acc = 0; for (let i = 1; i < P.length; i++) { const d = d2(P[i - 1], P[i]); if (acc + d >= tot && d > 0) { const k = (tot - acc) / d; return { p: [P[i - 1][0] + k * (P[i][0] - P[i - 1][0]), P[i - 1][1] + k * (P[i][1] - P[i - 1][1])], a: Math.atan2(P[i][1] - P[i - 1][1], P[i][0] - P[i - 1][0]) }; } acc += d; } return { p: P.at(-1), a: 0 }; }
  // a start badge sits just behind the stroke's first point, so strokes that share a start do not hide each other
  function behind(P, r) { if (P.length < 2) return [P[0][0] + r * .7, P[0][1] - r * .7]; const q = resample(P, 12)[1], dx = q[0] - P[0][0], dy = q[1] - P[0][1], l = Math.hypot(dx, dy) || 1; return [P[0][0] - dx / l * r, P[0][1] - dy / l * r]; }
  const f1 = v => (Math.round(v * 100) / 100).toString();
  // a numbered stroke-order picture of a glyph for hints and lesson cards (dark board)
  function glyphSVG(g, { hi = -1, upto = 99, plain = false, label } = {}) {
    const x0 = g.bb.x0 - 1.8, x1 = g.bb.x1 + 1.8, y0 = -1.6, y1 = g.desc ? 15.2 : 11.6;
    const lines = [0, 5, 10].concat(g.desc ? [14] : []).map(y => `<line x1="${f1(x0)}" x2="${f1(x1)}" y1="${y}" y2="${y}" stroke="${y === 10 ? '#5b6378' : '#3a4152'}" stroke-width=".1" ${y === 5 || y === 14 ? 'stroke-dasharray=".5 .4"' : ''}/>`).join('');
    const body = g.strokes.map((P, i) => {
      if (i >= upto) return '';
      const col = plain ? CHALK : hi === -1 || i === hi ? GOLD : '#8b93a7';
      if (g.dot[i]) return `<circle cx="${P[0][0]}" cy="${P[0][1]}" r=".5" fill="${col}"/>` + (plain ? '' : badge(...behind(P, 1.1), i + 1, col));
      const d = 'M' + P.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L');
      if (plain) return `<path d="${d}" fill="none" stroke="${col}" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"/>`;
      const m = atFrac(P, .55), ah = arrow(m.p, m.a, .75);
      return `<path d="${d}" fill="none" stroke="${col}" stroke-width=".55" stroke-linecap="round" stroke-linejoin="round"/><path d="${ah}" fill="${col}"/><circle cx="${f1(P[0][0])}" cy="${f1(P[0][1])}" r=".35" fill="${col}"/>${badge(...behind(P, 1.05), i + 1, col)}`;
    }).join('');
    return `<svg class="dr-glyph" viewBox="${f1(x0)} ${y0} ${f1(x1 - x0)} ${f1(y1 - y0)}" role="img" aria-label="${esc(label || g.ch)}">${lines}${body}</svg>`;
  }
  const badge = (x, y, n, col) => `<circle cx="${f1(x)}" cy="${f1(y)}" r=".78" fill="${col}"/><text x="${f1(x)}" y="${f1(y + .36)}" font-family="Lato" font-weight="900" font-size="1.05" text-anchor="middle" fill="#141822">${n}</text>`;
  function arrow(p, a, s) { const pt = (r, th) => [p[0] + Math.cos(a + th) * r, p[1] + Math.sin(a + th) * r]; const A = pt(s, 0), B = pt(s * .8, 2.5), C = pt(s * .8, -2.5); return `M${f1(A[0])} ${f1(A[1])}L${f1(B[0])} ${f1(B[1])}L${f1(C[0])} ${f1(C[1])}Z`; }
  const taSVG = (ch, col = GOLD) => `<svg class="dr-glyph ta" viewBox="0 0 100 100" role="img" aria-label="${esc(ch)}"><line x1="4" x2="96" y1="16" y2="16" stroke="#3a4152" stroke-width=".6"/><line x1="4" x2="96" y1="80" y2="80" stroke="#5b6378" stroke-width=".6"/><text x="50" y="74" text-anchor="middle" font-family="Noto Sans Tamil, sans-serif" font-size="64" fill="${col}" lang="ta">${ch}</text></svg>`;

  // ======================= the drawing pad =======================
  // Two stacked canvases (guide + ink) in logical units, high-DPI, pointer events, quadratic smoothing.
  function Pad(host, o = {}) {
    const W = o.W || L, H = o.H || L;
    host.style.aspectRatio = `${W} / ${H}`;
    host.insertAdjacentHTML('beforeend', `<canvas class="dr-guide" aria-hidden="true"></canvas><canvas class="dr-ink" tabindex="0" role="img" aria-label="${esc(o.label || '')}"></canvas>`);
    const gc = host.querySelector('.dr-guide'), cv = host.querySelector('.dr-ink'), g = gc.getContext('2d'), c = cv.getContext('2d');
    const base = document.createElement('canvas'), b = base.getContext('2d');
    const pad = { strokes: [], color: o.color || '#1f2a44', size: o.size || 9, erase: false, W, H, cv, gc, g, host, scale: 1, cleared: null };
    let cur = null, pid = null, raf = 0;
    function fit() {
      const r = host.getBoundingClientRect(); if (!r.width) return;
      const dpr = Math.min(3, devicePixelRatio || 1), pw = Math.round(r.width * dpr), ph = Math.round(r.width * H / W * dpr);
      if (pw === cv.width && ph === cv.height) return;
      [gc, cv, base].forEach(k => { k.width = pw; k.height = ph; }); pad.scale = pw / W; rebuild(); pad.drawGuide();
    }
    pad.drawGuide = () => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, gc.width, gc.height); g.setTransform(pad.scale, 0, 0, pad.scale, 0, 0); o.guide?.(g, pad); };
    function paint(k, s) {
      k.save(); k.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over'; k.strokeStyle = k.fillStyle = s.erase ? '#000' : s.color;
      const w = s.size * (s.pen ? .55 + s.pr : 1), P = s.pts; k.lineWidth = w; k.lineCap = k.lineJoin = 'round';
      if (P.length === 1 || plen(P) < 1) { k.beginPath(); k.arc(P[0][0], P[0][1], w / 2, 0, 7); k.fill(); }
      else { k.beginPath(); k.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length - 1; i++) k.quadraticCurveTo(P[i][0], P[i][1], (P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2); k.lineTo(P.at(-1)[0], P.at(-1)[1]); k.stroke(); }
      k.restore();
    }
    function rebuild() { b.setTransform(1, 0, 0, 1, 0, 0); b.clearRect(0, 0, base.width, base.height); b.setTransform(pad.scale, 0, 0, pad.scale, 0, 0); pad.strokes.forEach(s => paint(b, s)); show(); }
    function show() { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.drawImage(base, 0, 0); if (cur) { c.setTransform(pad.scale, 0, 0, pad.scale, 0, 0); paint(c, cur); } }
    const sched = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; show(); }); };
    const loc = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
    cv.addEventListener('pointerdown', e => {
      if (o.locked?.() || pid !== null || (e.button && e.button !== 0)) return;
      e.preventDefault(); pid = e.pointerId; try { cv.setPointerCapture(pid); } catch (err) { /* synthetic pointer */ }
      cur = { pts: [loc(e)], color: pad.color, size: pad.size, erase: pad.erase, pen: e.pointerType === 'pen', pr: e.pointerType === 'pen' ? (e.pressure || .5) : .5 };
      o.onStart?.(); sched();
    });
    cv.addEventListener('pointermove', e => {
      if (!cur || e.pointerId !== pid) return; e.preventDefault();
      (e.getCoalescedEvents?.() || [e]).forEach(ev => { const p = loc(ev); if (d2(p, cur.pts.at(-1)) > .8) { cur.pts.push(p); if (cur.pen) cur.pr = cur.pr * .85 + (ev.pressure || .5) * .15; } });
      sched();
    });
    const end = e => { if (!cur || e.pointerId !== pid) return; pid = null; const s = cur; cur = null; pad.strokes.push(s); pad.cleared = null; paint(b, s); show(); o.onStroke?.(s, pad); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    cv.addEventListener('contextmenu', e => e.preventDefault());
    pad.undo = () => { if (!pad.strokes.length && pad.cleared) { pad.strokes = pad.cleared; pad.cleared = null; } else pad.strokes.pop(); rebuild(); };
    pad.clear = () => { if (pad.strokes.length) pad.cleared = pad.strokes; pad.strokes = []; rebuild(); };
    pad.remove = s => { pad.strokes = pad.strokes.filter(x => x !== s); rebuild(); };
    pad.rebuild = rebuild; pad.image = () => base; pad.fit = fit;
    pad.ink = () => pad.strokes.filter(s => !s.erase).map(s => s.pts);
    const ro = new ResizeObserver(() => { if (!host.isConnected) { ro.disconnect(); return; } fit(); }); ro.observe(host);
    fit();
    return pad;
  }

  // ---------- shared task UI ----------
  const ICON = { show: 'i-eye', undo: 'i-undo', clear: 'i-close' };
  const tbtn = k => `<button type="button" class="k-btn k-btn-outline k-btn-sm pill dr-${k}"><svg class="k-icon" aria-hidden="true"><use href="#${ICON[k]}"/></svg><span>${t('draw.ui.' + k)}</span></button>`;
  function stage(el, { cls = 'paper', tools = ['undo', 'clear'], under = '', model = '', note = '' }) {
    el.innerHTML = `<div class="dr-stage">${note ? `<p class="dr-note">${note}</p>` : ''}<div class="dr-row">${model}<div class="dr-pad ${cls}">${under ? `<div class="dr-under" aria-hidden="true">${under}</div>` : ''}</div></div>
      <p class="dr-say" role="status" aria-live="polite"></p>
      <div class="dr-tools">${tools.map(tbtn).join('')}</div></div>`;
    const sayEl = el.querySelector('.dr-say');
    return { host: el.querySelector('.dr-pad'), say: (txt, tone = '') => { sayEl.textContent = txt; sayEl.dataset.tone = tone; }, btn: k => el.querySelector('.dr-' + k), el };
  }
  // keyboard users: focusing the drawing area lets them press Check (or use the hint ladder)
  function keyPath(pad, api, ui) { pad.cv.addEventListener('focus', () => { let v = true; try { v = pad.cv.matches(':focus-visible'); } catch (e) { /* old browsers */ } if (v) { api.ready(true); ui.say(t('draw.fb.keys')); } }); }
  const locked = () => !!Engine.round?.answered;
  function lines(k, desc) {
    k.save(); k.lineWidth = 1.4;
    [[OY, '#8d9ab9', []], [OY + 5 * U, '#b9c2d8', [6, 6]], [OY + 10 * U, '#5d6c92', []]].concat(desc ? [[OY + 14 * U, '#c9cfdf', [3, 6]]] : []).forEach(([y, col, dash]) => { k.strokeStyle = col; k.setLineDash(dash); k.beginPath(); k.moveTo(12, y); k.lineTo(L - 12, y); k.stroke(); });
    k.restore();
  }
  function dotted(k, P, col, r = 2.1, gap = 8) { k.fillStyle = col; const n = Math.max(1, Math.round(plen(P) / gap)); resample(P, n + 1).forEach(p => { k.beginPath(); k.arc(p[0], p[1], r, 0, 7); k.fill(); }); }
  function cBadge(k, p, n, fill, ink = '#fff') { k.save(); k.fillStyle = fill; k.beginPath(); k.arc(p[0], p[1], 10, 0, 7); k.fill(); k.fillStyle = ink; k.font = '900 12px Lato, sans-serif'; k.textAlign = 'center'; k.textBaseline = 'middle'; k.fillText(String(n), p[0], p[1] + .5); k.restore(); }
  function cArrow(k, P, col) { const m = atFrac(P, .55), s = 12, a = m.a; k.save(); k.fillStyle = col; k.beginPath(); k.moveTo(m.p[0] + Math.cos(a) * s, m.p[1] + Math.sin(a) * s); k.lineTo(m.p[0] + Math.cos(a + 2.5) * s * .8, m.p[1] + Math.sin(a + 2.5) * s * .8); k.lineTo(m.p[0] + Math.cos(a - 2.5) * s * .8, m.p[1] + Math.sin(a - 2.5) * s * .8); k.closePath(); k.fill(); k.restore(); }
  // animated stroke-order demo on the guide canvas; calls done() at the end. Reduced motion: no animation.
  function animate(pad, g, acc, base, done) {
    const per = 750, gapT = 250, n = g.log.length, total = n * (per + gapT); let t0 = null;
    if (RM()) { done(); return () => {}; }
    let stop = false;
    const frame = ts => {
      if (stop || !pad.host.isConnected) return; t0 ??= ts; const el = ts - t0;
      pad.drawGuide(); const k = pad.g; base(k);
      for (let i = 0; i < n; i++) {
        const f = Math.max(0, Math.min(1, (el - i * (per + gapT)) / per)); if (f <= 0) break;
        const P = g.log[i]; k.save(); k.strokeStyle = acc; k.lineWidth = 9; k.lineCap = k.lineJoin = 'round';
        if (g.dot[i]) { k.fillStyle = acc; k.beginPath(); k.arc(P[0][0], P[0][1], 5, 0, 7); k.fill(); }
        else { const part = resample(P, 60).slice(0, Math.max(2, Math.ceil(60 * f))); k.beginPath(); part.forEach((p, j) => j ? k.lineTo(p[0], p[1]) : k.moveTo(p[0], p[1])); k.stroke(); if (f < 1) { k.fillStyle = '#141822'; k.beginPath(); k.arc(part.at(-1)[0], part.at(-1)[1], 6, 0, 7); k.fill(); } }
        k.restore(); cBadge(k, behind(P, 17), i + 1, acc);
      }
      if (el < total + 300) requestAnimationFrame(frame); else done();
    };
    requestAnimationFrame(frame);
    return () => { stop = true; };
  }
  const plainOf = html => String(html).replace(/<[^>]+>/g, '');
  const ladder = (a, b, c) => [{ text: a.text ?? a, vis: a.vis }, { text: b.text ?? b, vis: b.vis }, { text: c.text ?? c, vis: c.vis }];

  // ======================= trace & write: letters and numbers =======================
  function letterQ(ch, kind, ctx, subject) {
    const g = glyph(ch), young = ctx.band === 'young', n = g.strokes.length, acc = ACC[subject];
    const cap = { upper: 'Upper', lower: 'Lower', digit: 'Digit' }[kind], key = 'draw.q.' + (young ? 'trace' : 'write') + cap;
    const descs = g.strokes.map((_, i) => strokeDesc(g, i)), full = glyphSVG(g, { label: ch });
    const say = I18N.lang === 'en' ? [{ text: t(key, { c: ch }), lang: 'en' }] : [{ text: t('draw.say.' + { upper: 'capital', lower: 'small', digit: 'number' }[kind]), lang: 'ta' }, { text: ch, lang: 'en' }, { text: t('draw.say.' + (young ? 'trace' : 'write')), lang: 'ta' }];
    const st = { pad: null, wrong: 0, res: null };
    const okCount = () => st.pad ? st.pad.strokes.filter(s => s.ok).length : 0;
    // one stroke against reference stroke i: closeness to the path, then direction
    const judge = (pts, i) => {
      const G = g.ref[i];
      if (g.dot[i]) return { ok: plen(pts) < 2.6 * U && d2(centroid(pts), G[0]) < 1.7 * U, why: 'dot' };
      if (plen(pts) < .3 * plen(G)) return { ok: false, why: 'far' };
      const P = resample(pts, 40), mean = avg(P.map(p => polyDist(p, G))), cover = G.filter(q => polyDist(q, P) < 1.5 * U).length / G.length;
      if (mean > 1.15 * U || cover < .7) return { ok: false, why: 'far' };
      if (d2(G[0], G.at(-1)) < U) { const bb = bbox(G); if (Math.abs(sarea(G)) > .3 * bb.w * bb.h && Math.sign(sarea(P)) !== Math.sign(sarea(G))) return { ok: false, why: 'round' }; return d2(P[0], G[0]) < 3 * U ? { ok: true } : { ok: false, why: 'start' }; }
      return d2(P[0], G[0]) <= d2(P[0], G.at(-1)) ? { ok: true } : { ok: false, why: 'reverse' };
    };
    const msg = (r, i) => {
      if (r.why === 'order') return t('draw.fb.order', { path: pathWords(g, i), n: i + 1 });
      if (r.why === 'dot') return t('draw.fb.dot');
      if (r.why === 'round') return t('draw.fb.round');
      if (r.why === 'far') return t('draw.fb.far', { n: i + 1 });
      const G = g.ref[i], dy = G.at(-1)[1] - G[0][1];
      return t(r.why === 'reverse' && dy > U ? 'draw.fb.startTop' : r.why === 'reverse' && dy < -U ? 'draw.fb.startBottom' : 'draw.fb.startAt', { n: i + 1 });
    };
    // freehand: compare the whole drawing with the model, size and position free
    const freehand = ink => {
      if (!ink.length) return { ok: false, given: t('draw.given.nothing') };
      const P = sampleAll(ink), T = sampleAll(g.log), a = setDist(normSet(P), normSet(T)), b = setDist(normSet(T), normSet(P)), sc = Math.max(a, b);
      const ib = bbox(P), tb = bbox(T), tips = [];
      if (Math.abs(ib.y1 - tb.y1) > 1.3 * U) tips.push(t('draw.y.tipLine'));
      if (ib.h < .7 * tb.h) tips.push(t('draw.y.tipSmall'));
      return { ok: sc < .085, sc, tips, given: t('draw.given.match', { p: Math.max(0, Math.round(100 - sc * 500)) }) };
    };
    const why = { steps: [{ text: t(n > 1 ? 'draw.y.strokes' : 'draw.y.strokes1', { c: `<b lang="en">${ch}</b>`, n }), vis: full }, ...descs.map(d => ({ text: d }))], rule: t(young ? 'draw.y.ruleTrace' : 'draw.y.ruleWrite') };
    return { kind: 'custom', prompt: t(key, { c: `<b class="dr-ch" lang="en">${ch}</b>` }), promptText: t(key, { c: ch }), say, autoSay: young,
      hints: ladder(young ? t('draw.h.t1') : t(g.lower ? 'draw.h.w1Lower' : 'draw.h.w1'), { text: descs[0], vis: glyphSVG(g, { upto: 1, hi: 0 }) }, { text: t('draw.h.all', { n }) + ' ' + descs.join(' '), vis: full }), hintRevealsAnswer: true,
      answerText: `<span class="dr-ans" lang="en">${ch}</span>`, why,
      whyFor() { const w = { ...why, steps: why.steps.slice() }; if (st.res?.tips?.length) w.steps.splice(1, 0, { text: st.res.tips.join(' ') }); return w; },
      mount(el, api) {
        const ui = stage(el, { cls: 'paper', tools: ['show', 'undo', 'clear'], model: young ? '' : `<div class="dr-model board small" aria-hidden="true">${glyphSVG(g, { plain: true })}</div>` });
        let anim = null, demo = false;
        const base = k => lines(k, g.desc);
        const guide = k => {
          base(k); if (demo) return;
          if (!young) return;
          const next = okCount();
          g.log.forEach((P, i) => { if (i < next) return; if (g.dot[i]) { k.save(); k.strokeStyle = i === next ? '#6b7899' : '#c3c9d9'; k.lineWidth = 2; k.beginPath(); k.arc(P[0][0], P[0][1], 7, 0, 7); k.stroke(); k.restore(); } else dotted(k, P, i === next ? '#6b7899' : '#c9cfdf'); });
          g.log.forEach((P, i) => { if (i > next) cBadge(k, behind(P, 17), i + 1, '#dfe3ec', '#5d6c92'); });
          const P = g.log[next]; if (P) { if (!g.dot[next]) cArrow(k, P, acc); k.fillStyle = acc; k.beginPath(); k.arc(P[0][0], P[0][1], 4.5, 0, 7); k.fill(); cBadge(k, behind(P, 17), next + 1, acc); }
        };
        const pad = st.pad = Pad(ui.host, { guide, locked, color: '#1f2a44', size: 11, label: t('draw.ui.padLabel', { task: t(key, { c: ch }) }),
          onStart: () => { if (anim) { anim(); anim = null; demo = false; pad.drawGuide(); } },
          onStroke(s) {
            if (!young) { api.ready(true); ui.say(t('draw.fb.written')); return; }
            const next = okCount();
            if (next >= n) { pad.remove(s); ui.say(t('draw.fb.extra')); return; }
            let r = judge(s.pts, next);
            if (!r.ok) for (let j = next + 1; j < n; j++) if (judge(s.pts, j).ok) { r = { ok: false, why: 'order' }; break; }
            if (r.ok) { s.ok = true; s.color = acc; pad.rebuild(); pad.drawGuide(); const k2 = okCount(); ui.say(k2 === n ? t('draw.fb.allDone', { n }) : t('draw.fb.good') + ' ' + descs[k2], 'ok'); if (k2 === n) api.ready(true); }
            else { st.wrong++; s.color = WARN; pad.rebuild(); ui.say(msg(r, next), 'warn'); setTimeout(() => { if (pad.strokes.includes(s)) pad.remove(s); }, 650); if (st.wrong >= 3) api.ready(true); }
          } });
        const play = () => { demo = true; anim?.(); anim = animate(pad, g, acc, base, () => { anim = null; demo = false; pad.drawGuide(); }); };
        ui.btn('show').onclick = play;
        ui.btn('undo').onclick = () => { pad.undo(); pad.drawGuide(); if (young) ui.say(okCount() < n ? descs[okCount()] : ''); };
        ui.btn('clear').onclick = () => { pad.clear(); pad.drawGuide(); if (young) ui.say(descs[0]); };
        keyPath(pad, api, ui);
        ui.say(young ? descs[0] : '');
        if (young) setTimeout(play, 250);
      },
      check() {
        const pad = st.pad; if (!pad) return { correct: false, given: t('draw.given.nothing') };
        if (young) { const k = okCount(); return { correct: k === n && st.wrong <= Math.max(2, n), given: t('draw.given.strokes', { a: k, b: n }) }; }
        st.res = freehand(pad.ink()); return { correct: st.res.ok, given: st.res.given };
      } };
  }

  // ---------- Tamil uyir letters: coverage check against the glyph drawn offscreen ----------
  const GRID = 75, CELL = L / GRID;
  function rasterize(draw) { const c = document.createElement('canvas'); c.width = c.height = GRID; const k = c.getContext('2d'); k.setTransform(1 / CELL, 0, 0, 1 / CELL, 0, 0); draw(k); const d = k.getImageData(0, 0, GRID, GRID).data, m = new Uint8Array(GRID * GRID); for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 100 ? 1 : 0; return m; }
  function dilate(m, r) { const o = new Uint8Array(m.length); for (let y = 0; y < GRID; y++) for (let x = 0; x < GRID; x++) if (m[y * GRID + x]) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < GRID && Y < GRID) o[Y * GRID + X] = 1; } return o; }
  const count = m => m.reduce((a, v) => a + v, 0);
  function taLayout(ch) {
    const k = document.createElement('canvas').getContext('2d'); k.font = '400 100px "Noto Sans Tamil", sans-serif';
    const m = k.measureText(ch), asc = m.actualBoundingBoxAscent || 70, des = m.actualBoundingBoxDescent || 0, lft = m.actualBoundingBoxLeft || 0, rgt = m.actualBoundingBoxRight || 70;
    const s = Math.min(170 / (asc + des), 230 / (lft + rgt)), fs = 100 * s;
    return { fs, x: L / 2 - (rgt - lft) / 2 * s, y: (OY + OY + 10 * U) / 2 - (des - asc) / 2 * s, box: { x0: L / 2 - (lft + rgt) / 2 * s, x1: L / 2 + (lft + rgt) / 2 * s, y0: (OY + OY + 10 * U) / 2 - (asc + des) / 2 * s, y1: (OY + OY + 10 * U) / 2 + (asc + des) / 2 * s } };
  }
  const taFont = fs => `400 ${fs.toFixed(1)}px "Noto Sans Tamil", sans-serif`;
  function tamilQ(ch, ctx) {
    const young = ctx.band === 'young', idx = UYIR.indexOf(ch), word = t('draw.ta.w' + idx), key = young ? 'draw.q.traceTa' : 'draw.q.writeTa';
    const st = { pad: null, lay: null, mask: null, res: null };
    const ensure = () => { if (!st.mask) { st.lay = taLayout(ch); st.mask = rasterize(k => { k.font = taFont(st.lay.fs); k.fillStyle = '#000'; k.fillText(ch, st.lay.x, st.lay.y); }); } };
    const score = ink => {
      ensure(); if (!ink.length) return { cov: 0, prec: 0 };
      let pts = ink;
      if (!young) { // freehand: move and scale the writing onto the letter's box first
        const ib = bbox(ink.flat()), gb = st.lay.box, s = Math.sqrt(((gb.x1 - gb.x0) * (gb.y1 - gb.y0)) / Math.max(1, Math.max(ib.w, 8) * Math.max(ib.h, 8)));
        pts = ink.map(P => P.map(p => [(gb.x0 + gb.x1) / 2 + (p[0] - ib.cx) * s, (gb.y0 + gb.y1) / 2 + (p[1] - ib.cy) * s]));
      }
      const im = rasterize(k => { k.strokeStyle = '#000'; k.fillStyle = '#000'; k.lineWidth = 12; k.lineCap = k.lineJoin = 'round'; pts.forEach(P => { k.beginPath(); P.forEach((p, i) => i ? k.lineTo(p[0], p[1]) : k.moveTo(p[0], p[1])); if (P.length === 1) k.lineTo(P[0][0] + .1, P[0][1]); k.stroke(); }); });
      const di = dilate(im, 1), dg = dilate(st.mask, 2); let hit = 0, inside = 0;
      for (let i = 0; i < im.length; i++) { if (st.mask[i] && di[i]) hit++; if (im[i] && dg[i]) inside++; }
      return { cov: hit / Math.max(1, count(st.mask)), prec: inside / Math.max(1, count(im)) };
    };
    const big = taSVG(ch);
    const why = { steps: [{ text: t('draw.y.ta', { c: `<b lang="ta">${ch}</b>`, w: word }), vis: big }, { text: t('draw.y.taCheck') }], rule: t('draw.y.taRule') };
    return { kind: 'custom', prompt: t(key, { c: `<b class="dr-ch" lang="ta">${ch}</b>` }), promptText: t(key, { c: ch }), say: [{ text: t(key, { c: ch }), lang: I18N.lang === 'ta' ? 'ta' : 'en' }].concat(I18N.lang === 'ta' ? [] : [{ text: ch, lang: 'ta' }]), autoSay: young,
      hints: ladder(t('draw.h.ta1'), { text: t('draw.h.ta2'), vis: big }, { text: t('draw.h.ta3', { c: ch }) + ' ' + t('draw.y.ta', { c: ch, w: word }), vis: big }), hintRevealsAnswer: true,
      answerText: `<span class="dr-ans" lang="ta">${ch}</span>`, why,
      mount(el, api) {
        const ui = stage(el, { cls: 'paper', tools: ['undo', 'clear'], model: young ? '' : `<div class="dr-model board small" aria-hidden="true">${taSVG(ch, CHALK)}</div>` });
        const guide = k => {
          lines(k, false); if (!young || !st.lay) return;
          k.save(); k.font = taFont(st.lay.fs); k.fillStyle = '#e6dfcc'; k.fillText(ch, st.lay.x, st.lay.y); k.setLineDash([3, 4]); k.lineWidth = 1.4; k.strokeStyle = '#8f8467'; k.strokeText(ch, st.lay.x, st.lay.y); k.restore();
        };
        const pad = st.pad = Pad(ui.host, { guide, locked, color: '#1f2a44', size: young ? 12 : 10, label: t('draw.ui.padLabel', { task: t(key, { c: ch }) }),
          onStroke() { api.ready(true); if (young) { const s = score(pad.ink()); ui.say(t('draw.fb.traced', { p: Math.min(100, Math.round(s.cov * 100)) }), s.cov > .6 ? 'ok' : ''); } else ui.say(t('draw.fb.written')); } });
        const ready = () => { st.mask = null; ensure(); pad.drawGuide(); };
        (document.fonts?.load ? document.fonts.load(taFont(100), ch) : Promise.resolve()).then(ready, ready);
        ui.btn('undo').onclick = () => pad.undo(); ui.btn('clear').onclick = () => pad.clear();
        keyPath(pad, api, ui);
      },
      check() {
        const ink = st.pad ? st.pad.ink() : []; if (!ink.length) return { correct: false, given: t('draw.given.nothing') };
        const s = score(ink); st.res = s;
        const ok = young ? s.cov >= .6 && s.prec >= .7 : s.cov >= .45 && s.prec >= .6;
        return { correct: ok, given: t('draw.given.covered', { p: Math.round(Math.min(1, s.cov) * 100) }) };
      } };
  }

  // ======================= maths: shapes =======================
  function analyse(strokes) {
    const ss = strokes.filter(s => plen(s) > 10); if (!ss.length) return { kind: 'none' };
    const P = resample(chain(ss), 120), bb = bbox(P), diag = Math.hypot(bb.w, bb.h) || 1;
    if (diag < 30) return { kind: 'none' };
    if (d2(P[0], P.at(-1)) > Math.max(.22 * diag, 18)) return { kind: 'open', P, bb };
    const Q = P.slice(0, -1), c = centroid(Q), rs = Q.map(p => d2(p, c)), mr = avg(rs), cv = Math.sqrt(avg(rs.map(r => (r - mr) ** 2))) / mr;
    const k0 = rs.indexOf(Math.max(...rs)), ring = Q.slice(k0).concat(Q.slice(0, k0)); ring.push(ring[0]);
    let V = rdp(ring, .06 * diag).slice(0, -1);
    for (let changed = true; changed && V.length > 2;) { changed = false; for (let i = 0; i < V.length; i++) { const a = V[(i - 1 + V.length) % V.length], b = V[i], cc = V[(i + 1) % V.length]; if (angleAt(a, b, cc) > 148 || d2(a, b) < .12 * diag) { V.splice(i, 1); changed = true; break; } } }
    const closedV = V.concat([V[0]]), dev = avg(Q.map(p => polyDist(p, closedV))) / diag, straight = dev < .035;
    const out = { P, bb, V, cv, dev, n: V.length };
    if (V.length >= 3 && V.length <= 6 && straight) {
      if (V.length === 3) return { ...out, kind: 'triangle' };
      if (V.length === 4) {
        const ang = V.map((b, i) => angleAt(V[(i + 3) % 4], b, V[(i + 1) % 4])), sides = V.map((b, i) => d2(b, V[(i + 1) % 4]));
        const a = (sides[0] + sides[2]) / 2, b = (sides[1] + sides[3]) / 2, ratio = Math.max(a, b) / Math.min(a, b);
        if (ang.every(x => Math.abs(x - 90) < 24)) return { ...out, kind: ratio < 1.3 ? 'square' : 'rectangle', ratio };
        return { ...out, kind: 'quad' };
      }
      return { ...out, kind: V.length === 5 ? 'pentagon' : 'hexagon' };
    }
    if (cv < .2) { const asp = bb.w / bb.h; return { ...out, kind: asp > .72 && asp < 1.39 ? 'circle' : 'oval' }; }
    return { ...out, kind: 'blob' };
  }
  function shapeSVG(an) {
    if (!an.P) return '';
    const b = an.bb, pad = 18, vb = `${f1(b.x0 - pad)} ${f1(b.y0 - pad)} ${f1(b.w + pad * 2)} ${f1(b.h + pad * 2)}`, sw = Math.max(b.w, b.h) / 60;
    const path = 'M' + an.P.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L') + (an.kind === 'open' ? '' : 'Z');
    const corners = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'quad'].includes(an.kind) ? an.V.map((v, i) => `<circle cx="${f1(v[0])}" cy="${f1(v[1])}" r="${f1(sw * 3.2)}" fill="${GOLD}"/><text x="${f1(v[0])}" y="${f1(v[1] + sw * 1.4)}" font-family="Lato" font-weight="900" font-size="${f1(sw * 4)}" text-anchor="middle" fill="#141822">${i + 1}</text>`).join('') : '';
    const ends = an.kind === 'open' ? [an.P[0], an.P.at(-1)].map(p => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(sw * 3)}" fill="none" stroke="${GOLD}" stroke-width="${f1(sw)}"/>`).join('') : '';
    return `<svg class="dr-shape" viewBox="${vb}" role="img" aria-label="your drawing"><path d="${path}" fill="${an.kind === 'open' ? 'none' : 'rgba(95,211,201,.12)'}" stroke="${CHALK}" stroke-width="${f1(sw * 1.4)}" stroke-linejoin="round" stroke-linecap="round"/>${corners}${ends}</svg>`;
  }
  function dotGrid(k) { k.save(); k.fillStyle = 'rgba(230,233,240,.16)'; for (let x = 30; x < L; x += 30) for (let y = 30; y < L; y += 30) { k.beginPath(); k.arc(x, y, 1.6, 0, 7); k.fill(); } k.restore(); }
  const SHAPES = [['triangle', 'square', 'circle'], ['triangle', 'square', 'circle', 'rectangle'], ['rectangle', 'square', 'triangle', 'pentagon', 'hexagon', 'circle']];
  skill({ id: 'dr.shape', subject: 'maths', topic: 'draw', name: 'draw.skill.shape', bands: { young: [1, 2], older: [2, 3] }, gen(l, r) {
    const name = r.pick(SHAPES[l - 1]), label = t('m.shape.' + name), st = { pad: null, an: null };
    const vis = VIS.shape2d(name, { corners: true });
    const why = { steps: [{ text: t('draw.y.props.' + name), vis }], rule: t('draw.y.shapeRule') };
    return { kind: 'custom', prompt: t('draw.q.shape', { s: `<b>${label}</b>` }), promptText: t('draw.q.shape', { s: label }), say: [{ text: t('draw.q.shape', { s: label }), lang: I18N.lang }],
      hints: ladder(t('draw.h.shape1.' + name), { text: t(name === 'circle' ? 'draw.h.circle2' : 'draw.h.shape2'), vis: VIS.shape2d(name, { corners: true }) }, { text: t('draw.y.props.' + name), vis }), hintRevealsAnswer: true,
      answerText: label, why,
      whyFor() {
        const an = st.an || { kind: 'none' }, k = an.kind;
        const saw = k === 'none' ? t('draw.y.sawNone') : k === 'open' ? t('draw.y.sawOpen') : k === 'circle' ? t('draw.y.sawRound') : k === 'oval' ? t('draw.y.sawOval') : k === 'blob' ? t('draw.y.sawBlob') : t('draw.y.saw', { n: an.n }) + (k === 'square' ? ' ' + t('draw.y.sawSq') : k === 'rectangle' ? ' ' + t('draw.y.sawRect') : k === 'quad' ? ' ' + t('draw.y.sawQuad') : '');
        const steps = [{ text: saw, vis: shapeSVG(an) || undefined }, ...why.steps];
        if (name === 'rectangle' && k === 'square') steps.push({ text: t('draw.y.sqIsRect') });
        return { steps, rule: why.rule };
      },
      mount(el, api) {
        const ui = stage(el, { cls: 'artboard' });
        const pad = st.pad = Pad(ui.host, { guide: dotGrid, locked, color: CHALK, size: 6, label: t('draw.ui.padLabel', { task: t('draw.q.shape', { s: label }) }), onStroke() { api.ready(true); ui.say(t('draw.fb.drawn')); } });
        ui.btn('undo').onclick = () => pad.undo(); ui.btn('clear').onclick = () => pad.clear();
        keyPath(pad, api, ui);
      },
      check() {
        const an = st.an = analyse(st.pad ? st.pad.ink() : []), k = an.kind;
        const ok = k === name || (name === 'rectangle' && k === 'square');
        const given = k === 'none' ? t('draw.given.nothing') : k === 'open' ? t('draw.given.open') : k === 'blob' ? t('draw.given.blob', { n: an.n }) : k === 'quad' ? t('draw.given.quad') : t('m.shape.' + k);
        return { correct: ok, given };
      } };
  } });

  // ---------- line of symmetry ----------
  const SYM = [ // right half, from the top of the axis (x = 150) to the bottom
    [[150, 50], [235, 120], [235, 250], [150, 250]], [[150, 40], [245, 140], [190, 140], [190, 255], [150, 255]], [[150, 40], [215, 110], [150, 260]],
    [[150, 45], [200, 45], [180, 100], [228, 170], [195, 255], [150, 255]], [[150, 92], [176, 50], [200, 112], [240, 42], [228, 250], [150, 250]],
  ];
  const mirror = P => P.map(p => [300 - p[0], p[1]]);
  const fullOf = half => half.concat(mirror(half).slice(1, -1).reverse());
  const rot = P => P.map(p => [p[1], p[0]]);
  const polyStr = P => P.map(p => p.map(f1).join(',')).join(' ');
  function symSVG(P, { axis, axisCol = GOLD, fill = 'rgba(22,163,156,.55)', stroke = '#5fd3c9', extra = '', dashedAxis = true } = {}) {
    const ax = axis ? `<line x1="${axis[0][0]}" y1="${axis[0][1]}" x2="${axis[1][0]}" y2="${axis[1][1]}" stroke="${axisCol}" stroke-width="3" ${dashedAxis ? 'stroke-dasharray="9 7"' : ''} stroke-linecap="round"/>` : '';
    return `<svg class="dr-sym" viewBox="0 0 300 300" role="img" aria-label="a shape"><polygon points="${polyStr(P)}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>${extra}${ax}</svg>`;
  }
  skill({ id: 'dr.sym', subject: 'maths', topic: 'draw', name: 'draw.skill.sym', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const half = r.pick(SYM), st = { pad: null, res: null }, line = l === 1;
    const turned = line && r() < .4, F = turned ? rot(fullOf(half)) : fullOf(half);
    const ys = half.map(p => p[1]), top = Math.min(...ys), bot = Math.max(...ys);
    const axis = turned ? [[top, 150], [bot, 150]] : [[150, top], [150, bot]];
    const answerVis = symSVG(F, { axis }), halfL = mirror(half);
    const q = line ? t('draw.q.symLine') : t('draw.q.symHalf');
    const halfSVG = (extra = '') => `<svg class="dr-sym" viewBox="0 0 300 300" role="img" aria-label="half a shape"><line x1="150" y1="20" x2="150" y2="280" stroke="#9aa1b2" stroke-width="2" stroke-dasharray="7 7"/><polyline points="${polyStr(halfL)}" fill="none" stroke="#5fd3c9" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>${extra}</svg>`;
    const partners = halfL.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#5fd3c9"/><circle cx="${half[i][0]}" cy="${half[i][1]}" r="5" fill="none" stroke="${GOLD}" stroke-width="2.5"/>`).join('');
    const why = { steps: [{ text: t('draw.y.sym'), vis: answerVis }], rule: t('draw.y.symRule') };
    return { kind: 'custom', prompt: q, promptText: q, say: [{ text: q, lang: I18N.lang }],
      hints: line ? ladder(t('draw.h.sym1'), { text: t('draw.h.sym2'), vis: symSVG(F) }, { text: t('draw.h.sym3'), vis: answerVis })
        : ladder(t('draw.h.half1'), { text: t('draw.h.half2'), vis: halfSVG(partners) }, { text: t('draw.h.half3'), vis: answerVis }), hintRevealsAnswer: true,
      answerText: line ? t('draw.skill.sym') : q, why,
      whyFor(given) { return given ? { steps: [{ text: t('draw.y.symSaw', { g: given }) }, ...why.steps], rule: why.rule } : why; },
      mount(el, api) {
        const ui = stage(el, { cls: 'artboard', under: line ? symSVG(F) : halfSVG() });
        const pad = st.pad = Pad(ui.host, { locked, color: GOLD, size: 6, label: t('draw.ui.padLabel', { task: q }), onStroke() { api.ready(true); ui.say(t('draw.fb.drawn')); } });
        ui.btn('undo').onclick = () => pad.undo(); ui.btn('clear').onclick = () => pad.clear();
        keyPath(pad, api, ui);
      },
      check() {
        const ink = st.pad ? st.pad.ink().filter(P => plen(P) > 8) : []; if (!ink.length) return { correct: false, given: t('draw.given.nothing') };
        if (line) {
          const P = ink.reduce((a, b) => plen(b) > plen(a) ? b : a), s = P[0], e = P.at(-1), chord = d2(s, e), dev = avg(P.map(p => segDist(p, s, e)));
          if (dev > .06 * chord + 4) return { correct: false, given: t('draw.given.wobbly') };
          const off = p => turned ? Math.abs(p[1] - 150) : Math.abs(p[0] - 150), span = turned ? Math.abs(e[0] - s[0]) : Math.abs(e[1] - s[1]);
          return { correct: off(s) < 18 && off(e) < 18 && span > .7 * (bot - top), given: t('draw.given.line') };
        }
        const T = resample(half, 60), A = sampleAll(ink), a = setDist(A, T), cover = T.filter(p => A.some(q => d2(p, q) < 18)).length / T.length;
        return { correct: a < 14 && cover > .78, given: t('draw.given.match', { p: Math.round(cover * 100) }) };
      } };
  } });

  // ---------- equal groups ----------
  function groupsOf(ink) {
    const loops = [], marks = [];
    ink.forEach(P => { const b = bbox(P), dg = Math.hypot(b.w, b.h); if (dg >= 45 && d2(P[0], P.at(-1)) < Math.max(.3 * dg, 22)) loops.push(P); else if (dg < 40) marks.push(centroid(P)); });
    const M = []; marks.forEach(m => { if (!M.some(x => d2(x, m) < 9)) M.push(m); });
    const counts = loops.map(Lp => M.filter(m => inPoly(m, Lp)).length), outside = M.filter(m => !loops.some(Lp => inPoly(m, Lp))).length;
    return { loops: loops.length, counts, outside };
  }
  skill({ id: 'dr.groups', subject: 'maths', topic: 'draw', name: 'draw.skill.groups', bands: { young: [1, 1], older: [1, 2] }, gen(l, r) {
    const a = l === 1 ? r.int(2, 3) : r.int(2, 4), b = l === 1 ? r.int(2, 3) : r.int(2, 5), n = a * b, sum = Array(a).fill(b).join(' + '), st = { pad: null };
    const vis = VIS.plates({ k: a, each: b }), q = t('draw.q.groups', { a, b });
    const why = { steps: [{ text: t('draw.y.grp', { a, b, sum, n }), vis }, { text: t('draw.y.grpMul', { a, b, n }) }], rule: t('draw.y.grpRule') };
    return { kind: 'custom', prompt: q, promptText: q + '. ' + t('draw.q.groupsHow', { a, b }), say: [{ text: q + '. ' + t('draw.q.groupsHow', { a, b }), lang: I18N.lang }],
      hints: ladder(t('draw.h.grp1', { a, b }), { text: t('draw.h.grp2', { b }), vis: VIS.plates({ k: a, each: 0, extra: 0 }) }, { text: t('draw.h.grp3', { a, b, sum, n }), vis }), hintRevealsAnswer: true,
      answerText: `${a} × ${b} = ${n}`, why,
      mount(el, api) {
        const ui = stage(el, { cls: 'artboard', note: t('draw.q.groupsHow', { a, b }) });
        const pad = st.pad = Pad(ui.host, { guide: dotGrid, locked, color: CHALK, size: 6, label: t('draw.ui.padLabel', { task: q }), onStroke() { api.ready(true); const gq = groupsOf(pad.ink()); ui.say(t('draw.fb.groups', { a: gq.loops, list: gq.counts.join(', ') || '0' })); } });
        ui.btn('undo').onclick = () => pad.undo(); ui.btn('clear').onclick = () => pad.clear();
        keyPath(pad, api, ui);
      },
      check() {
        const gq = groupsOf(st.pad ? st.pad.ink() : []);
        return { correct: gq.loops === a && gq.counts.every(c => c === b) && gq.outside === 0, given: t('draw.fb.groups', { a: gq.loops, list: gq.counts.join(', ') || '0' }) };
      } };
  } });

  // ---------- numbers (trace & write) ----------
  skill({ id: 'dr.digit', subject: 'maths', topic: 'draw', name: 'draw.skill.digit', bands: { young: [1, 3], older: [1, 3] }, gen(l, r, ctx) { return letterQ(r.pick([...SETS.digit[l - 1]]), 'digit', ctx, 'maths'); } });
  // ---------- English letters ----------
  skill({ id: 'dr.upper', subject: 'english', topic: 'draw', name: 'draw.skill.upper', bands: { young: [1, 3], older: [1, 3] }, gen(l, r, ctx) { return letterQ(r.pick([...SETS.upper[l - 1]]), 'upper', ctx, 'english'); } });
  skill({ id: 'dr.lower', subject: 'english', topic: 'draw', name: 'draw.skill.lower', bands: { young: [1, 3], older: [1, 3] }, gen(l, r, ctx) { return letterQ(r.pick([...SETS.lower[l - 1]]), 'lower', ctx, 'english'); } });
  skill({ id: 'dr.uyir', subject: 'english', topic: 'draw', name: 'draw.skill.uyir', bands: { young: [1, 3], older: [1, 3] }, gen(l, r, ctx) { return tamilQ(r.pick(UYIR.slice((l - 1) * 4, l * 4)), ctx); } });

  // ======================= science: draw & label =======================
  const txt = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" font-family="Lato, Noto Sans Tamil, sans-serif" font-size="12" font-weight="700" fill="#9aa1b2" text-anchor="${anchor}">${esc(s)}</text>`;
  const ans = d => `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8 6"/>`;
  const wrap = (inner, label) => `<svg class="dr-diagram" viewBox="0 0 300 300" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  const SOIL = 192, BASE = [150, SOIL];
  function plantSVG(answer) {
    return wrap(`<rect x="0" y="${SOIL}" width="300" height="${300 - SOIL}" fill="#3b2a1e"/><path d="M0 ${SOIL} H300" stroke="#8a6440" stroke-width="3"/>
      ${[[40, 230], [90, 270], [240, 222], [270, 268], [200, 284]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#5a4330"/>`).join('')}
      <path d="M150 ${SOIL} C150 160 148 130 150 92" stroke="#4c9a5a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M150 140 C120 120 100 128 92 138 C112 152 134 150 150 140Z" fill="#3f8f50"/><path d="M150 118 C180 96 202 104 210 114 C190 130 166 128 150 118Z" fill="#4fa862"/>
      <path d="M150 96 C138 76 146 62 150 56 C154 62 162 76 150 96Z" fill="#5fbf73"/>
      ${txt(282, SOIL + 18, t('draw.lb.soil'), 'end')}${txt(172, 170, t('draw.lb.stem'), 'start')}
      ${answer ? ans('M150 194 C146 220 130 240 112 262 M150 194 C156 222 172 242 192 258 M150 194 C150 226 152 250 150 280 M132 236 L112 238 M170 236 L190 232') : ''}`, 'a plant with no roots');
  }
  const CEN = [150, 112];
  function flowerSVG(answer) {
    const petals = answer ? [0, 1, 2, 3, 4, 5].map(i => { const a = -Math.PI / 2 + i * Math.PI / 3, x = CEN[0] + Math.cos(a) * 42, y = CEN[1] + Math.sin(a) * 42; return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="16" ry="27" transform="rotate(${f1(a * 180 / Math.PI + 90)} ${f1(x)} ${f1(y)})" fill="rgba(208,75,134,.35)" stroke="${GOLD}" stroke-width="3.5" stroke-dasharray="8 6"/>`; }).join('') : '';
    return wrap(`<path d="M150 130 C152 180 146 230 150 290" stroke="#4c9a5a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M150 220 C120 200 100 206 90 216 C110 232 134 230 150 220Z" fill="#3f8f50"/><path d="M151 250 C180 230 200 236 210 246 C190 262 166 260 151 250Z" fill="#4fa862"/>
      ${petals}<circle cx="${CEN[0]}" cy="${CEN[1]}" r="20" fill="#e2a336"/>${[[-7, -6], [6, -8], [8, 5], [-5, 8], [0, 0]].map(([x, y]) => `<circle cx="${CEN[0] + x}" cy="${CEN[1] + y}" r="2.2" fill="#8a5a12"/>`).join('')}
      ${txt(150, 286, '', 'middle')}`, 'a flower centre with no petals');
  }
  function waterSVG(answer) {
    return wrap(`<circle cx="258" cy="44" r="20" fill="#ffd66b"/><circle cx="258" cy="44" r="32" fill="#ffd66b" opacity=".16"/>
      <g fill="#cfd6e4"><circle cx="86" cy="70" r="22"/><circle cx="112" cy="58" r="28"/><circle cx="140" cy="72" r="20"/><rect x="70" y="70" width="86" height="22" rx="11"/></g>
      <path d="M0 300 L0 196 L42 150 L78 182 L118 140 L168 226 L168 300 Z" fill="#4c7a5a"/><path d="M118 140 L132 164 L112 160Z" fill="#e6e9f0" opacity=".7"/>
      <rect x="160" y="226" width="140" height="74" fill="#1e5b85"/><path d="M160 228 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#5fb3e6" stroke-width="2"/>
      ${txt(232, 272, t('draw.lb.sea'))}${txt(112, 112, t('draw.lb.cloud'))}${txt(46, 258, t('draw.lb.land'))}${txt(258, 88, t('draw.lb.sun'))}
      ${answer ? ans('M222 218 C226 180 196 140 160 100 M160 100 l3 14 M160 100 l14 3') + ans('M86 98 C80 120 70 140 62 168 M62 168 l-4 -13 M62 168 l11 -8') : ''}`, 'sea, cloud and land');
  }
  const CA = [226, 104], CB = [226, 200];
  function circuitSVG(lit, answer) {
    return wrap(`<path d="M122 76 H60 V236 H96" fill="none" stroke="#d38a4a" stroke-width="5" stroke-linejoin="round"/>
      <path d="M178 76 H226 V${CA[1]}" fill="none" stroke="#d38a4a" stroke-width="5" stroke-linejoin="round"/><path d="M164 236 H226 V${CB[1]}" fill="none" stroke="#d38a4a" stroke-width="5" stroke-linejoin="round"/>
      <g transform="translate(130 236)"><rect x="-34" y="-15" width="68" height="30" rx="5" fill="#2a2f3b"/><rect x="-34" y="-15" width="20" height="30" rx="5" fill="#e2a336"/><rect x="34" y="-6" width="5" height="12" fill="#aab2c0"/><text x="6" y="5" fill="#cfd4de" font-family="Lato" font-weight="900" font-size="12" text-anchor="middle">1.5V</text></g>
      <g transform="translate(150 70)">${lit ? '<circle r="52" fill="#ffd66b" opacity=".28"/>' : ''}<circle cy="-12" r="22" fill="${lit ? '#ffe9a8' : '#59606f'}"/><rect x="-11" y="8" width="22" height="16" rx="2" fill="#8a919e"/><path d="M-7 -10 q7 -11 14 0" fill="none" stroke="${lit ? '#ff9f1a' : '#3a4152'}" stroke-width="2"/></g>
      ${[CA, CB].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="#c9ced6" stroke="#8a919e" stroke-width="2"/>`).join('')}
      ${txt(130, 270, t('draw.lb.battery'))}${txt(196, 40, t('draw.lb.bulb'), 'start')}${txt(240, CA[1] + 4, t('draw.lb.clip'), 'start')}${txt(240, CB[1] + 4, t('draw.lb.clip'), 'start')}
      ${answer ? ans(`M${CA[0]} ${CA[1]} V${CB[1]}`) : ''}`, lit ? 'a closed circuit with a lit bulb' : 'a circuit with a gap');
  }
  function sciSkill(id, def) {
    skill({ id: 'dr.' + id, subject: 'science', topic: 'draw', name: 'draw.skill.' + id, bands: { young: [1, 1], older: [1, 1] }, gen() {
      const st = { pad: null, ui: null }, q = t('draw.q.' + id), how = def.how ? t(def.how) : '';
      return { kind: 'custom', prompt: q, promptText: q + (how ? '. ' + how : ''), say: [{ text: q + (how ? '. ' + how : ''), lang: I18N.lang }],
        hints: def.hints(), hintRevealsAnswer: true, answerText: def.answer(), why: def.why(),
        mount(el, api) {
          const ui = st.ui = stage(el, { cls: 'artboard', under: def.svg(false), note: how });
          const pad = st.pad = Pad(ui.host, { locked, color: GOLD, size: 6, label: t('draw.ui.padLabel', { task: q }), onStroke(s) { api.ready(true); const m = def.live(pad.ink(), s.pts, ui); if (m) ui.say(m[0], m[1] || ''); } });
          ui.btn('undo').onclick = () => { pad.undo(); def.reset?.(ui); }; ui.btn('clear').onclick = () => { pad.clear(); def.reset?.(ui); };
          keyPath(pad, api, ui);
        },
        check() { const r = def.check(st.pad ? st.pad.ink() : []); return { correct: r.ok, given: r.given }; } };
    } });
  }
  // roots: strokes under the soil line, joined to the stem
  function rootsOf(ink) { const R = ink.filter(P => P.filter(p => p[1] > SOIL - 2).length >= .7 * P.length && plen(P) > 15); const len = R.reduce((a, P) => a + plen(P), 0), joined = R.some(P => P.some(p => d2(p, BASE) < 26)), above = ink.filter(P => P.filter(p => p[1] < SOIL - 4).length > .6 * P.length).length; return { R, len, joined, above, ok: joined && len >= 90 && (R.length >= 2 || len >= 150) }; }
  sciSkill('roots', { svg: plantSVG,
    hints: () => ladder(t('draw.h.roots1'), t('draw.h.roots2'), { text: t('draw.h.roots3'), vis: plantSVG(true) }), answer: () => t('draw.skill.roots'),
    why: () => ({ steps: [{ text: t('draw.y.roots1'), vis: plantSVG(true) }, { text: t('draw.y.roots2'), vis: SIMS.snap('plant', { water: true, light: true, air: true, days: 10 }) }], rule: t('draw.y.rootsRule') }),
    live(ink, last) { const r = rootsOf(ink); if (last.filter(p => p[1] < SOIL - 4).length > .6 * last.length) return [t('draw.fb.rootsAbove'), 'warn']; if (!r.joined) return [t('draw.fb.rootsJoin'), 'warn']; return r.ok ? [t('draw.fb.rootsOk'), 'ok'] : [t('draw.fb.rootsMore')]; },
    check(ink) { const r = rootsOf(ink); return { ok: r.ok, given: !ink.length ? t('draw.given.nothing') : r.ok ? t('draw.fb.rootsOk') : r.R.length ? t('draw.fb.rootsJoin') : t('draw.fb.rootsAbove') }; } });
  // petals: strokes in a ring around the centre, spread all the way round
  function petalsOf(ink) { const P = ink.filter(s => plen(s) > 20).filter(s => { const c = centroid(s), d = d2(c, CEN); return d > 16 && d < 105 && s.some(p => d2(p, CEN) < 40); }); const sec = new Set(P.map(s => { const c = centroid(s); return Math.floor(((Math.atan2(c[1] - CEN[1], c[0] - CEN[0]) + Math.PI) / (Math.PI / 4))) % 8; })); const quads = new Set([...sec].map(k => k >> 1)); const far = ink.filter(s => plen(s) > 20 && !s.some(p => d2(p, CEN) < 40)).length; return { n: P.length, ok: P.length >= 4 && sec.size >= 4 && quads.size >= 3, far }; }
  sciSkill('petals', { svg: flowerSVG,
    hints: () => ladder(t('draw.h.petals1'), t('draw.h.petals2'), { text: t('draw.h.petals3'), vis: flowerSVG(true) }), answer: () => t('draw.skill.petals'),
    why: () => ({ steps: [{ text: t('draw.y.petals1'), vis: flowerSVG(true) }, { text: t('draw.y.petals2') }], rule: t('draw.y.petalsRule') }),
    live(ink, last) { const r = petalsOf(ink); if (plen(last) > 20 && !last.some(p => d2(p, CEN) < 40)) return [t('draw.fb.petalsFar'), 'warn']; return r.ok ? [t('draw.fb.petalsOk'), 'ok'] : [t('draw.fb.petals', { n: r.n })]; },
    check(ink) { const r = petalsOf(ink); return { ok: r.ok, given: ink.length ? t('draw.fb.petals', { n: r.n }) : t('draw.given.nothing') }; } });
  // water cycle: one stroke up from the sea to the cloud, one down from the cloud to the land
  const atSea = p => p[0] > 150 && p[1] > 196, atCloud = p => p[1] < 132 && p[0] > 36 && p[0] < 214, atLand = p => p[0] < 172 && p[1] > 140;
  function arrowKind(P) { if (plen(P) < 45) return ''; const s = P[0], e = P.at(-1); if (atSea(s) && atCloud(e)) return 'evap'; if (atCloud(s) && atLand(e) && !atSea(e)) return 'rain'; if (atCloud(s) && atSea(e)) return 'evapWrong'; if (atLand(s) && atCloud(e)) return 'rainWrong'; return ''; }
  const waterOf = ink => { const k = ink.map(arrowKind); return { evap: k.includes('evap'), rain: k.includes('rain'), kinds: k }; };
  sciSkill('water', { svg: waterSVG, how: 'draw.q.waterHow',
    hints: () => ladder(t('draw.h.water1'), t('draw.h.water2'), { text: t('draw.h.water3'), vis: waterSVG(true) }), answer: () => t('draw.h.water3'),
    why: () => ({ steps: [{ text: t('draw.y.water1'), vis: SIMS.snap('water', { sun: .9, t: .3 }) }, { text: t('draw.y.water2') }, { text: t('draw.y.water3'), vis: SIMS.snap('water', { sun: .6, t: 1 }) }], rule: t('draw.y.waterRule') }),
    live(ink, last) { const k = arrowKind(last); if (!k) return plen(last) < 45 ? null : [t('draw.fb.waterMiss')]; return [t('draw.fb.' + k), k.endsWith('Wrong') ? 'warn' : 'ok']; },
    check(ink) { const w = waterOf(ink); return { ok: w.evap && w.rain, given: !ink.length ? t('draw.given.nothing') : [w.evap && t('draw.fb.evap'), w.rain && t('draw.fb.rain')].filter(Boolean).join(' ') || t('draw.fb.waterMiss') }; } });
  // circuit: one stroke from clip to clip
  const joins = P => (d2(P[0], CA) < 26 && d2(P.at(-1), CB) < 26) || (d2(P[0], CB) < 26 && d2(P.at(-1), CA) < 26);
  const touches = P => d2(P[0], CA) < 26 || d2(P[0], CB) < 26 || d2(P.at(-1), CA) < 26 || d2(P.at(-1), CB) < 26;
  sciSkill('circuit', { svg: lit => circuitSVG(lit), how: 'draw.q.circuitHow',
    hints: () => ladder(t('draw.h.circuit1'), { text: t('draw.h.circuit2'), vis: circuitSVG(false) }, { text: t('draw.h.circuit3'), vis: circuitSVG(true, true) }), answer: () => t('draw.h.circuit3'),
    why: () => ({ steps: [{ text: t('draw.y.circuit1'), vis: SIMS.snap('circuit', { mat: 'copper', bat: 1, on: true }) }, { text: t('draw.y.circuit2'), vis: SIMS.snap('circuit', { mat: 'copper', bat: 1, on: false }) }], rule: t('draw.y.circuitRule') }),
    live(ink, last, ui) { const on = ink.some(joins); ui.el.querySelector('.dr-under').innerHTML = circuitSVG(on); if (on) return [t('draw.fb.wired'), 'ok']; return touches(last) ? [t('draw.fb.wireHalf'), 'warn'] : [t('draw.q.circuitHow')]; },
    reset(ui) { ui.el.querySelector('.dr-under').innerHTML = circuitSVG(false); ui.say(''); },
    check(ink) { const on = ink.some(joins); return { ok: on, given: !ink.length ? t('draw.given.nothing') : on ? t('draw.fb.wired') : t('draw.fb.wireHalf') }; } });

  // ======================= rounds, intro, sketchbook =======================
  const IDS = { maths: ['dr.digit', 'dr.shape', 'dr.sym', 'dr.groups'], science: ['dr.roots', 'dr.petals', 'dr.water', 'dr.circuit'], english: { upper: ['dr.upper'], lower: ['dr.lower'], mix: ['dr.upper', 'dr.lower'], uyir: ['dr.uyir'] } };
  const extras = p => { p.extras ??= {}; return p.extras.draw ??= { gallery: [], set: 'upper' }; };
  function run(p, subject, set) {
    const ids = subject === 'english' ? IDS.english[set] || IDS.english.upper : IDS[subject];
    const due = Store.due(p, subject).filter(r => ids.includes(r.skill)).slice(0, 1).map(r => ({ skill: r.skill, lvl: r.lvl, seed: r.seed }));
    let pick;
    if (subject === 'science') { const r = Engine.rng(Engine.newSeed()); pick = r.shuffle(ids).map(id => Engine.itemFor(p, id)).concat(Engine.weighted(p, ids, 1)).slice(0, 5 - due.length); }
    else if (subject === 'maths') { pick = ['dr.shape', 'dr.digit'].map(id => Engine.itemFor(p, id)).concat(Engine.weighted(p, ids, 3)).slice(0, 5 - due.length); pick = Engine.rng(Engine.newSeed()).shuffle(pick); }
    else pick = Engine.weighted(p, ids, 5 - due.length);
    Engine.start({ items: [...due, ...pick], title: t('draw.title.' + subject), subject, topic: 'draw', mode: 'draw', back: '#/s/' + subject, again: () => run(p, subject, set) });
  }
  function intro(main, subject) {
    const p = Store.current(); if (!p || !IDS[subject]) { location.hash = '#/'; return; }
    const ex = extras(p), ta = I18N.lang === 'ta', young = p.band === 'young';
    const sets = subject === 'english' ? ['upper', 'lower', 'mix'].concat(ta ? ['uyir'] : []) : null;
    let set = sets?.includes(ex.set) ? ex.set : 'upper';
    const art = subject === 'english' ? glyphSVG(glyph('A'), { label: 'A' }) : subject === 'maths' ? VIS.shape2d('triangle', { corners: true }) : circuitSVG(true);
    const setName = k => k === 'mix' ? t('draw.ui.mixed') : t('draw.skill.' + k);
    main.innerHTML = `<section class="page dr-intro" data-subject="${subject}">
      <a class="k-btn k-btn-ghost dr-backlink" href="#/s/${subject}"><svg class="k-icon" aria-hidden="true"><use href="#i-back"/></svg><span>${t('subj.' + subject + '.title')}</span></a>
      <p class="eyebrow">${t('games.title')} · ${t('draw.intro.tasks')}</p><h1>${t('draw.title.' + subject)}</h1>
      <p class="dr-lead">${t('draw.intro.' + subject)}</p>
      <div class="board dr-introart">${art}</div>
      ${subject !== 'science' ? `<p class="small muted">${t(young ? 'draw.intro.young' : 'draw.intro.older')}</p>` : ''}
      ${sets ? `<p class="eyebrow">${t('draw.ui.pickSet')}</p><div class="seg dr-sets" role="radiogroup" aria-label="${t('draw.ui.pickSet')}">${sets.map(k => `<button type="button" role="radio" data-k="${k}" aria-checked="${k === set}" ${k === 'uyir' ? 'lang="ta"' : ''}>${setName(k)}</button>`).join('')}</div>` : ''}
      <div class="row-actions"><a class="k-btn k-btn-outline pill" href="#/draw"><svg class="k-icon" aria-hidden="true"><use href="#i-pencil"/></svg><span>${t('draw.ui.openBook')}</span></a><button type="button" class="k-btn k-btn-primary k-btn-lg dr-go">${t('common.start')}</button></div>
    </section>`;
    main.querySelectorAll('.dr-sets button').forEach(b => b.onclick = () => { set = b.dataset.k; main.querySelectorAll('.dr-sets button').forEach(x => x.setAttribute('aria-checked', String(x === b))); });
    main.querySelector('.dr-go').onclick = () => { if (sets) { ex.set = set; Store.save(); } run(p, subject, set); };
  }

  // ---------- sketchbook + gallery ----------
  const PAL = [['ink', '#1f2a44'], ['teal', '#16a39c'], ['turmeric', '#e2a336'], ['kumkum', '#c8463d'], ['leaf', '#2f9e6b'], ['indigo', '#5b57c9']];
  const SIZES = [['thin', 4], ['medium', 9], ['thick', 18]];
  const PAPER = '#fbf7ee', MAXG = 12;
  const eraserIcon = '<svg class="k-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20h12M4.5 15.5 14 6l5 5-8.5 8.5H8z"/><path d="m9 11 5 5"/></svg>';
  function book(main) {
    const p = Store.current(); if (!p) { location.hash = '#/'; return; }
    main.innerHTML = `<section class="page dr-book" data-subject="english">
      <p class="eyebrow">${t('draw.book.eyebrow')}</p><h1>${t('draw.book.title')}</h1><p class="dr-lead">${t('draw.book.lead')}</p>
      <div class="dr-booktools">
        <div class="dr-palette" role="radiogroup" aria-label="${t('draw.book.colour')}">${PAL.map(([k, c], i) => `<button type="button" role="radio" class="dr-sw" style="--c:${c}" data-c="${c}" aria-checked="${i === 0}" aria-label="${t('draw.col.' + k)}" title="${t('draw.col.' + k)}"></button>`).join('')}<button type="button" role="radio" class="dr-sw dr-eraser" data-erase="1" aria-checked="false" aria-label="${t('draw.book.eraser')}" title="${t('draw.book.eraser')}">${eraserIcon}</button></div>
        <div class="seg dr-sizes" role="radiogroup" aria-label="${t('draw.book.size')}">${SIZES.map(([k, s], i) => `<button type="button" role="radio" data-s="${s}" aria-checked="${i === 1}"><i class="dr-dotsz" style="--s:${Math.max(4, s * .8)}px" aria-hidden="true"></i>${t('draw.book.' + k)}</button>`).join('')}</div>
      </div>
      <div class="dr-pad paper dr-bookpad"></div>
      <div class="dr-tools">${tbtn('undo')}${tbtn('clear')}<button type="button" class="k-btn k-btn-primary dr-save"><svg class="k-icon" aria-hidden="true"><use href="#i-image"/></svg><span>${t('draw.book.save')}</span></button></div>
      <p class="dr-say" role="status" aria-live="polite"></p>
      <h2 class="section">${t('draw.book.gallery')}</h2><div class="dr-gallery"></div>
    </section>`;
    const host = main.querySelector('.dr-bookpad'), sayEl = main.querySelector('.dr-say'), say = s => { sayEl.textContent = s; };
    const pad = Pad(host, { W: 400, H: 300, color: PAL[0][1], size: 9, label: t('draw.book.title') });
    const radio = (sel, fn) => { const bs = [...main.querySelectorAll(sel)]; bs.forEach((b, i) => { b.onclick = () => { bs.forEach(x => x.setAttribute('aria-checked', String(x === b))); fn(b); }; b.onkeydown = e => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (d) { e.preventDefault(); const nb = bs[(i + d + bs.length) % bs.length]; nb.focus(); nb.click(); } }; }); };
    radio('.dr-sw', b => { pad.erase = !!b.dataset.erase; if (!pad.erase) pad.color = b.dataset.c; });
    radio('.dr-sizes button', b => { pad.size = +b.dataset.s; });
    main.querySelector('.dr-undo').onclick = () => pad.undo();
    main.querySelector('.dr-clear').onclick = () => { if (pad.strokes.length) { pad.clear(); say(t('draw.book.cleared')); } };
    main.querySelector('.dr-save').onclick = () => {
      if (!pad.ink().length) { say(t('draw.book.empty')); return; }
      const c = document.createElement('canvas'); c.width = 320; c.height = 240; const k = c.getContext('2d');
      k.fillStyle = PAPER; k.fillRect(0, 0, 320, 240); k.drawImage(pad.image(), 0, 0, 320, 240);
      const ex = extras(p); ex.gallery.unshift({ src: c.toDataURL('image/jpeg', .78), at: Date.now() }); ex.gallery = ex.gallery.slice(0, MAXG); Store.save();
      say(t('draw.book.saved') + (ex.gallery.length >= MAXG ? ' ' + t('draw.book.full', { n: MAXG }) : '')); gallery();
    };
    function gallery() {
      const g = extras(p).gallery, box = main.querySelector('.dr-gallery');
      box.innerHTML = g.length ? g.map((d, i) => `<button type="button" class="dr-thumb" data-i="${i}" aria-label="${t('draw.book.view', { n: i + 1 })}"><img src="${d.src}" alt="" width="160" height="120"></button>`).join('') : `<p class="muted">${t('draw.book.none')}</p>`;
      box.querySelectorAll('.dr-thumb').forEach(b => b.onclick = () => {
        const i = +b.dataset.i, d = g[i];
        App.dialog(`<figure class="dr-view"><img src="${d.src}" alt="${t('draw.book.view', { n: i + 1 })}"><figcaption class="small muted">${new Date(d.at).toLocaleDateString(I18N.lang === 'ta' ? 'ta-IN' : 'en-IN')}</figcaption></figure>
          <div class="row-actions"><button type="button" class="k-btn k-btn-outline pill dr-del">${t('common.delete')}</button><button type="button" class="k-btn k-btn-primary" data-close>${t('common.close')}</button></div>`,
        dlg => { dlg.querySelector('.dr-del').onclick = () => { extras(p).gallery.splice(i, 1); Store.save(); App.closeDialog(); gallery(); say(t('draw.book.removed')); }; });
      });
    }
    gallery();
  }
  window.ROUTES = window.ROUTES || {};
  window.ROUTES.draw = {
    render(main, parts) { if (parts[1] === 'go' && parts[2]) intro(main, parts[2]); else book(main); },
    keys(e) { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && document.querySelector('.dr-book')) { e.preventDefault(); document.querySelector('.dr-book .dr-undo')?.click(); } },
  };
  const GAMES = {};
  function game(subject) {
    return GAMES[subject] ??= { title: 'draw.title.' + subject, blurb: 'draw.blurb.' + subject, icon: 'i-pencil', start() { location.hash = '#/draw/go/' + subject; } };
  }
  // gallery for the parent view: newest first, JPEG data URLs (320×240)
  const gallery = p => ((p || Store.current())?.extras?.draw?.gallery || []).map(d => d.src);
  const galleryItems = p => ((p || Store.current())?.extras?.draw?.gallery || []).slice();
  window.DRAW = { game, gallery, galleryItems, run, IDS, _test: { analyse, glyph, groupsOf, GL } };
})();
