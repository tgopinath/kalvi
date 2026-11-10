// Story shelf data: 14 original short stories set in everyday Tamil Nadu life.
// Every page: { en, ta, pic?: PICS word | scene?: { k, ... } }. The story is read in English; `ta` is the
// "Show Tamil" translation. gloss: new words with a Tamil meaning and a plain English meaning.
// qs: comprehension questions; `pg` (0-based) and `line` (an exact sentence from that page) are what the
// lesson card quotes back. Keep the order of stories and of gloss entries stable (review seeds map to it).
(function () {
  const S = [
    // ---------------- level 1: first stories (CVC + sight words, 1–2 short sentences a page) ----------------
    { id: 'red-bus', lvl: 1, title: { en: 'The Red Bus', ta: 'சிவப்புப் பேருந்து' }, setting: { en: 'A trip to the market', ta: 'சந்தைக்கு ஒரு பயணம்' },
      pages: [
        { en: 'Look. A red bus is here. Amma and I get on.', ta: 'பார். ஒரு சிவப்புப் பேருந்து வந்துவிட்டது. அம்மாவும் நானும் ஏறுகிறோம்.', pic: 'bus' },
        { en: 'We go to the market. I have a big bag.', ta: 'நாங்கள் சந்தைக்குப் போகிறோம். என்னிடம் ஒரு பெரிய பை இருக்கிறது.', pic: 'bag' },
        { en: 'Amma gets a red tomato. It is in my bag.', ta: 'அம்மா ஒரு சிவப்புத் தக்காளி வாங்குகிறார். அது என் பையில் இருக்கிறது.', pic: 'tomato' },
        { en: 'I see a yellow mango. Can I have it? Amma said yes.', ta: 'நான் ஒரு மஞ்சள் மாம்பழத்தைப் பார்க்கிறேன். அதை நான் வாங்கலாமா? அம்மா சரி என்றார்.', pic: 'mango' },
        { en: 'My bag is so big now. We ride the bus home.', ta: 'இப்போது என் பை மிகப் பெரியதாகிவிட்டது. நாங்கள் பேருந்தில் வீட்டுக்குப் போகிறோம்.', pic: 'bus' },
      ],
      gloss: [
        { w: 'market', ta: 'சந்தை', def: 'a place where people buy and sell things' },
        { w: 'bag', ta: 'பை', def: 'you carry things in it' },
        { w: 'tomato', ta: 'தக்காளி', def: 'a soft red vegetable' },
        { w: 'ride', ta: 'பயணம் செய்', def: 'to sit on something that moves and go' },
      ],
      qs: [
        { q: { en: 'Who gets on the bus?', ta: 'பேருந்தில் யார் ஏறுகிறார்கள்?' }, a: 'Amma and I', o: ['Appa and the dog', 'A hen and a cat'], pg: 0, line: 'Amma and I get on.' },
        { q: { en: 'What does Amma get?', ta: 'அம்மா என்ன வாங்குகிறார்?' }, a: 'a red tomato', o: ['a blue cup', 'a big fish'], pg: 2, line: 'Amma gets a red tomato.' },
        { q: { en: 'What colour is the mango?', ta: 'மாம்பழம் என்ன நிறம்?' }, a: 'yellow', o: ['red', 'blue'], pg: 3, line: 'I see a yellow mango.' },
        { q: { en: 'What happens first?', ta: 'முதலில் என்ன நடக்கிறது?' }, a: 'They get on the red bus.', o: ['Amma gets a tomato.', 'They ride the bus home.'], pg: 0, line: 'Amma and I get on.' },
      ] },

    { id: 'hen-ants', lvl: 1, title: { en: 'The Hen and the Ants', ta: 'கோழியும் எறும்புகளும்' }, setting: { en: 'A village yard', ta: 'கிராமத்து முற்றம்' },
      pages: [
        { en: 'A hen sat in the sun.', ta: 'ஒரு கோழி வெயிலில் உட்கார்ந்திருந்தது.', pic: 'hen' },
        { en: 'The hen saw an ant. Then she saw ten ants.', ta: 'கோழி ஒரு எறும்பைப் பார்த்தது. பிறகு பத்து எறும்புகளைப் பார்த்தது.', pic: 'ant' },
        { en: 'Run, ants, run. The ants ran to a big log.', ta: 'ஓடுங்கள் எறும்புகளே, ஓடுங்கள். எறும்புகள் ஒரு பெரிய மரக்கட்டைக்கு ஓடின.', pic: 'tree' },
        { en: 'The hen is too big. She can not get in.', ta: 'கோழி மிகப் பெரியது. அதனால் உள்ளே போக முடியவில்லை.', pic: 'hen' },
        { en: 'The ants are safe in the log. The hen went to eat rice.', ta: 'எறும்புகள் மரக்கட்டைக்குள் பாதுகாப்பாக இருக்கின்றன. கோழி அரிசி சாப்பிடப் போனது.', pic: 'ant' },
      ],
      gloss: [
        { w: 'hen', ta: 'கோழி', def: 'a mother bird that lays eggs' },
        { w: 'ant', forms: ['ants'], ta: 'எறும்பு', def: 'a very small insect' },
        { w: 'log', ta: 'மரக்கட்டை', def: 'a thick piece cut from a tree' },
        { w: 'safe', ta: 'பாதுகாப்பான', def: 'not in danger' },
      ],
      qs: [
        { q: { en: 'Who sat in the sun?', ta: 'வெயிலில் உட்கார்ந்திருந்தது யார்?' }, a: 'a hen', o: ['a cat', 'a dog'], pg: 0, line: 'A hen sat in the sun.' },
        { q: { en: 'How many ants did the hen see?', ta: 'கோழி எத்தனை எறும்புகளைப் பார்த்தது?' }, a: 'ten', o: ['two', 'three'], pg: 1, line: 'Then she saw ten ants.' },
        { q: { en: 'Where did the ants run?', ta: 'எறும்புகள் எங்கே ஓடின?' }, a: 'to a big log', o: ['into a cup', 'up a bus'], pg: 2, line: 'The ants ran to a big log.' },
        { q: { en: 'Why can the hen not get in?', ta: 'கோழி ஏன் உள்ளே போக முடியவில்லை?' }, a: 'She is too big.', o: ['She is asleep.', 'She is in the sun.'], pg: 3, line: 'The hen is too big.' },
      ] },

    { id: 'rain-cup', lvl: 1, title: { en: 'Rain in a Cup', ta: 'கோப்பையில் மழை' }, setting: { en: 'A monsoon day', ta: 'ஒரு மழைக்கால நாள்' },
      pages: [
        { en: 'Look up. I see a big cloud.', ta: 'மேலே பார். நான் ஒரு பெரிய மேகத்தைப் பார்க்கிறேன்.', pic: 'cloud' },
        { en: 'Here comes the rain. I get my umbrella.', ta: 'இதோ மழை வருகிறது. நான் என் குடையை எடுக்கிறேன்.', pic: 'umbrella' },
        { en: 'I put a little cup out in the rain.', ta: 'நான் ஒரு சிறிய கோப்பையை மழையில் வைக்கிறேன்.', scene: { k: 'cup', fill: 0.1 } },
        { en: 'Drip, drop. Drip, drop. The cup fills up with rain.', ta: 'சொட்டு, சொட்டு. கோப்பை மழைநீரால் நிரம்புகிறது.', scene: { k: 'cup', fill: 0.9 } },
        { en: 'Then the sun came out. Where did the cloud go?', ta: 'பிறகு சூரியன் வெளியே வந்தது. மேகம் எங்கே போனது?', pic: 'sun' },
      ],
      gloss: [
        { w: 'cloud', ta: 'மேகம்', def: 'a white or grey shape in the sky that brings rain' },
        { w: 'umbrella', ta: 'குடை', def: 'you hold it over your head in the rain' },
        { w: 'rain', ta: 'மழை', def: 'water that falls from clouds' },
        { w: 'fills', forms: ['fill'], ta: 'நிரம்புகிறது', def: 'becomes full' },
      ],
      qs: [
        { q: { en: 'What do I see when I look up?', ta: 'மேலே பார்க்கும்போது நான் என்ன பார்க்கிறேன்?' }, a: 'a big cloud', o: ['a red bus', 'a little ant'], pg: 0, line: 'I see a big cloud.' },
        { q: { en: 'What do I get when the rain comes?', ta: 'மழை வரும்போது நான் என்ன எடுக்கிறேன்?' }, a: 'my umbrella', o: ['my ball', 'my kite'], pg: 1, line: 'I get my umbrella.' },
        { q: { en: 'What fills the cup?', ta: 'கோப்பையை எது நிரப்புகிறது?' }, a: 'rain', o: ['milk', 'sand'], pg: 3, line: 'The cup fills up with rain.' },
        { q: { en: 'What came out at the end?', ta: 'கடைசியில் எது வெளியே வந்தது?' }, a: 'the sun', o: ['the moon', 'a fox'], pg: 4, line: 'Then the sun came out.' },
      ] },

    { id: 'pup-ball', lvl: 1, title: { en: 'The Pup and the Ball', ta: 'நாய்க்குட்டியும் பந்தும்' }, setting: { en: 'Our street', ta: 'எங்கள் தெரு' },
      pages: [
        { en: 'Here is a pup. The pup is little and brown.', ta: 'இதோ ஒரு நாய்க்குட்டி. அது சிறியதாகவும் பழுப்பு நிறத்திலும் இருக்கிறது.', pic: 'dog' },
        { en: 'I have a red ball. I can play with it.', ta: 'என்னிடம் ஒரு சிவப்புப் பந்து இருக்கிறது. நான் அதனுடன் விளையாடலாம்.', pic: 'ball' },
        { en: 'The ball went down the road. It is under a van.', ta: 'பந்து சாலையில் உருண்டு போனது. அது ஒரு வேனுக்குக் கீழே இருக்கிறது.', pic: 'van' },
        { en: 'The pup ran to the van. He went under it.', ta: 'நாய்க்குட்டி வேனிடம் ஓடியது. அது வேனுக்குக் கீழே போனது.', pic: 'dog' },
        { en: 'The pup came out with the ball. Good pup.', ta: 'நாய்க்குட்டி பந்துடன் வெளியே வந்தது. நல்ல நாய்க்குட்டி.', pic: 'ball' },
      ],
      gloss: [
        { w: 'pup', ta: 'நாய்க்குட்டி', def: 'a baby dog' },
        { w: 'under', ta: 'கீழே', def: 'below something' },
        { w: 'road', ta: 'சாலை', def: 'a way for buses, cars and people' },
        { w: 'brown', ta: 'பழுப்பு', def: 'the colour of soil and wood' },
      ],
      qs: [
        { q: { en: 'What is the pup like?', ta: 'நாய்க்குட்டி எப்படி இருக்கிறது?' }, a: 'little and brown', o: ['big and black', 'little and white'], pg: 0, line: 'The pup is little and brown.' },
        { q: { en: 'What colour is the ball?', ta: 'பந்து என்ன நிறம்?' }, a: 'red', o: ['yellow', 'blue'], pg: 1, line: 'I have a red ball.' },
        { q: { en: 'Where did the ball go?', ta: 'பந்து எங்கே போனது?' }, a: 'under a van', o: ['into a cup', 'up a tree'], pg: 2, line: 'It is under a van.' },
        { q: { en: 'Who got the ball back?', ta: 'பந்தை யார் திரும்பக் கொண்டு வந்தது?' }, a: 'the pup', o: ['Amma', 'a hen'], pg: 4, line: 'The pup came out with the ball.' },
      ] },

    // ---------------- level 2: a little longer (young: unlocks; older: open from the start) ----------------
    { id: 'laddus', lvl: 2, title: { en: 'Twelve Laddus', ta: 'பன்னிரண்டு லட்டுகள்' }, setting: { en: 'Sharing at home', ta: 'வீட்டில் பகிர்தல்' },
      pages: [
        { en: 'Paati made twelve laddus. She put them on a big plate.', ta: 'பாட்டி பன்னிரண்டு லட்டுகள் செய்தார். அவற்றை ஒரு பெரிய தட்டில் வைத்தார்.', scene: { k: 'plates', n: 1, each: 12 } },
        { en: 'There are three of us: Kavin, Meena and me. We want to share them equally.', ta: 'நாங்கள் மூவர்: கவின், மீனா, நான். அவற்றைச் சமமாகப் பகிர்ந்துகொள்ள விரும்புகிறோம்.', scene: { k: 'plates', n: 3, each: 0, pile: 12 } },
        { en: 'We put one laddu on each plate, then one more, and one more.', ta: 'ஒவ்வொரு தட்டிலும் ஒரு லட்டு வைத்தோம், பிறகு இன்னொன்று, மேலும் இன்னொன்று.', scene: { k: 'plates', n: 3, each: 2, pile: 6 } },
        { en: 'Now each plate has four laddus. Three plates of four make twelve.', ta: 'இப்போது ஒவ்வொரு தட்டிலும் நான்கு லட்டுகள். நான்கு நான்காக மூன்று தட்டுகள் சேர்ந்தால் பன்னிரண்டு.', scene: { k: 'plates', n: 3, each: 4 } },
        { en: 'Then Appa came home. Now there are four of us.', ta: 'அப்போது அப்பா வீட்டுக்கு வந்தார். இப்போது நாங்கள் நால்வர்.', scene: { k: 'plates', n: 4, each: 0, pile: 12 } },
        { en: 'We shared again. This time each plate got three laddus. Twelve shared by four is three.', ta: 'மீண்டும் பகிர்ந்தோம். இந்த முறை ஒவ்வொரு தட்டிலும் மூன்று லட்டுகள். பன்னிரண்டை நான்கு பேருக்குப் பகிர்ந்தால் ஆளுக்கு மூன்று.', scene: { k: 'plates', n: 4, each: 3 } },
      ],
      gloss: [
        { w: 'laddu', forms: ['laddus'], ta: 'லட்டு', def: 'a round Indian sweet' },
        { w: 'share', forms: ['shared'], ta: 'பகிர்', def: 'to give each person a part' },
        { w: 'equally', ta: 'சமமாக', def: 'the same amount for everyone' },
        { w: 'plate', ta: 'தட்டு', def: 'a flat dish you eat from' },
      ],
      qs: [
        { q: { en: 'Who made the laddus?', ta: 'லட்டுகளைச் செய்தது யார்?' }, a: 'Paati', o: ['Appa', 'Meena'], pg: 0, line: 'Paati made twelve laddus.' },
        { q: { en: 'With three children, how many laddus are on each plate?', ta: 'மூன்று குழந்தைகள் இருக்கும்போது ஒவ்வொரு தட்டிலும் எத்தனை லட்டுகள்?' }, a: 'four', o: ['three', 'six'], pg: 3, line: 'Now each plate has four laddus.' },
        { q: { en: 'Who came home?', ta: 'வீட்டுக்கு வந்தது யார்?' }, a: 'Appa', o: ['Paati', 'Lata Miss'], pg: 4, line: 'Then Appa came home.' },
        { q: { en: 'With four people, how many laddus does each get?', ta: 'நான்கு பேர் இருக்கும்போது ஒவ்வொருவருக்கும் எத்தனை லட்டுகள்?' }, a: 'three', o: ['four', 'two'], pg: 5, line: 'This time each plate got three laddus.' },
      ] },

    { id: 'seed', lvl: 2, title: { en: 'The Seed in the School Garden', ta: 'பள்ளித் தோட்டத்தில் ஒரு விதை' }, setting: { en: 'Our school garden', ta: 'எங்கள் பள்ளித் தோட்டம்' },
      pages: [
        { en: 'Lata Miss gave each child a seed. It was small and brown.', ta: 'லதா டீச்சர் ஒவ்வொரு குழந்தைக்கும் ஒரு விதை கொடுத்தார். அது சிறியதாகவும் பழுப்பாகவும் இருந்தது.', scene: { k: 'sprout', stage: 0, seed: true } },
        { en: 'I put my seed in a pot of soil. Then I gave it water.', ta: 'நான் என் விதையை மண் நிறைந்த தொட்டியில் வைத்தேன். பிறகு தண்ணீர் ஊற்றினேன்.', scene: { k: 'sprout', stage: 0, water: true } },
        { en: 'Every day I looked at the pot. For four days, nothing came up.', ta: 'ஒவ்வொரு நாளும் தொட்டியைப் பார்த்தேன். நான்கு நாட்கள் எதுவும் முளைக்கவில்லை.', scene: { k: 'sprout', stage: 0 } },
        { en: 'On day five, a little green shoot came up out of the soil.', ta: 'ஐந்தாம் நாள், மண்ணிலிருந்து ஒரு சிறிய பச்சை முளை வெளியே வந்தது.', scene: { k: 'sprout', stage: 1 } },
        { en: 'We put the pot by the window. The leaves need the sun to make food.', ta: 'தொட்டியைச் சன்னலுக்கு அருகில் வைத்தோம். இலைகள் உணவு தயாரிக்கச் சூரிய ஒளி வேண்டும்.', scene: { k: 'sprout', stage: 2 } },
        { en: 'Soon my plant was tall, with six green leaves. A seed needs soil, water and sun to grow.', ta: 'விரைவில் என் செடி ஆறு பச்சை இலைகளுடன் உயரமாக வளர்ந்தது. ஒரு விதை வளர மண், தண்ணீர், சூரிய ஒளி தேவை.', scene: { k: 'sprout', stage: 3 } },
      ],
      gloss: [
        { w: 'seed', ta: 'விதை', def: 'a tiny part of a plant that grows into a new plant' },
        { w: 'soil', ta: 'மண்', def: 'the earth that plants grow in' },
        { w: 'shoot', ta: 'முளை', def: 'the first small stem of a new plant' },
        { w: 'leaves', forms: ['leaf'], ta: 'இலைகள்', def: 'the flat green parts of a plant' },
        { w: 'grow', ta: 'வளர்', def: 'to get bigger' },
      ],
      qs: [
        { q: { en: 'Who gave each child a seed?', ta: 'ஒவ்வொரு குழந்தைக்கும் விதை கொடுத்தது யார்?' }, a: 'Lata Miss', o: ['Amma', 'Paati'], pg: 0, line: 'Lata Miss gave each child a seed.' },
        { q: { en: 'On which day did the shoot come up?', ta: 'எந்த நாளில் முளை வெளியே வந்தது?' }, a: 'day five', o: ['day one', 'day ten'], pg: 3, line: 'On day five, a little green shoot came up out of the soil.' },
        { q: { en: 'Why did they put the pot by the window?', ta: 'தொட்டியை ஏன் சன்னலுக்கு அருகில் வைத்தார்கள்?' }, a: 'The leaves need the sun to make food.', o: ['The pot was too hot.', 'The window was broken.'], pg: 4, line: 'The leaves need the sun to make food.' },
        { q: { en: 'What does a seed need to grow?', ta: 'ஒரு விதை வளர என்ன தேவை?' }, a: 'soil, water and sun', o: ['milk, sugar and salt', 'sand and stones'], pg: 5, line: 'A seed needs soil, water and sun to grow.' },
      ] },

    { id: 'pongal', lvl: 2, title: { en: 'Pongal Morning', ta: 'பொங்கல் காலை' }, setting: { en: 'A harvest festival', ta: 'அறுவடைத் திருநாள்' },
      pages: [
        { en: 'It is Pongal. We get up early, when the sky is still pink.', ta: 'இன்று பொங்கல். வானம் இன்னும் இளஞ்சிவப்பாக இருக்கும்போதே நாங்கள் சீக்கிரம் எழுகிறோம்.', pic: 'sun' },
        { en: 'Amma draws a big kolam at the door with white rice flour.', ta: 'அம்மா வாசலில் வெள்ளை அரிசி மாவால் ஒரு பெரிய கோலம் போடுகிறார்.', pic: 'door' },
        { en: 'We cook rice, milk and jaggery in a new clay pot.', ta: 'புதிய மண்பானையில் அரிசி, பால், வெல்லம் சேர்த்துச் சமைக்கிறோம்.', scene: { k: 'pot', boil: false } },
        { en: 'The milk bubbles up and spills over. We all shout, “Pongalo Pongal.”', ta: 'பால் பொங்கி வழிகிறது. நாங்கள் எல்லாரும் பொங்கலோ பொங்கல் என்று கூவுகிறோம்.', scene: { k: 'pot', boil: true } },
        { en: 'We thank the sun for the rice. Then we eat sweet pongal on a banana leaf.', ta: 'நெல் விளைய உதவிய சூரியனுக்கு நன்றி சொல்கிறோம். பிறகு வாழை இலையில் இனிப்புப் பொங்கல் சாப்பிடுகிறோம்.', pic: 'banana' },
        { en: 'The next day is for the cows. We wash our cow and paint her horns blue.', ta: 'அடுத்த நாள் மாடுகளுக்கானது. எங்கள் பசுவைக் குளிப்பாட்டி, அதன் கொம்புகளுக்கு நீல வண்ணம் பூசுகிறோம்.', pic: 'cow' },
      ],
      gloss: [
        { w: 'kolam', ta: 'கோலம்', def: 'a pattern drawn at the door with rice flour' },
        { w: 'jaggery', ta: 'வெல்லம்', def: 'a brown sugar made from sugarcane' },
        { w: 'clay', ta: 'களிமண்', def: 'soft earth used to make pots' },
        { w: 'spills', forms: ['spill'], ta: 'வழிகிறது', def: 'flows over the top' },
        { w: 'horns', forms: ['horn'], ta: 'கொம்புகள்', def: 'the hard pointed parts on a cow’s head' },
      ],
      qs: [
        { q: { en: 'What does Amma draw at the door?', ta: 'அம்மா வாசலில் என்ன போடுகிறார்?' }, a: 'a kolam', o: ['a kite', 'a cow'], pg: 1, line: 'Amma draws a big kolam at the door with white rice flour.' },
        { q: { en: 'What goes into the clay pot?', ta: 'மண்பானையில் என்ன சேர்க்கிறார்கள்?' }, a: 'rice, milk and jaggery', o: ['water and salt', 'tea and sugar'], pg: 2, line: 'We cook rice, milk and jaggery in a new clay pot.' },
        { q: { en: 'What happens first?', ta: 'முதலில் என்ன நடக்கிறது?' }, a: 'Amma draws a kolam.', o: ['The milk spills over.', 'They paint the cow’s horns.'], pg: 1, line: 'Amma draws a big kolam at the door with white rice flour.' },
        { q: { en: 'Who is the next day for?', ta: 'அடுத்த நாள் யாருக்கானது?' }, a: 'the cows', o: ['the cats', 'the birds'], pg: 5, line: 'The next day is for the cows.' },
      ] },

    { id: 'pond', lvl: 2, title: { en: 'The Village Pond', ta: 'கிராமத்துக் குளம்' }, setting: { en: 'Near our village', ta: 'எங்கள் கிராமத்துக்கு அருகில்' },
      pages: [
        { en: 'Near our village there is a pond under a big tree. Many animals come to it.', ta: 'எங்கள் கிராமத்துக்கு அருகில் ஒரு பெரிய மரத்தின் கீழ் ஒரு குளம் இருக்கிறது. பல உயிரினங்கள் அங்கே வருகின்றன.', pic: 'tree' },
        { en: 'Two white ducks swim across the water.', ta: 'இரண்டு வெள்ளை வாத்துகள் தண்ணீரில் நீந்திச் செல்கின்றன.', pic: 'duck' },
        { en: 'A green frog sits on a lily leaf. Plop. It jumps in.', ta: 'ஒரு பச்சைத் தவளை அல்லி இலையில் உட்கார்ந்திருக்கிறது. டப். அது தண்ணீரில் குதிக்கிறது.', pic: 'frog' },
        { en: 'A snail moves slowly up a wet stone.', ta: 'ஒரு நத்தை ஈரமான கல்லின் மேல் மெதுவாக ஏறுகிறது.', pic: 'snail' },
        { en: 'A thirsty crow comes down to drink.', ta: 'தாகமான ஒரு காகம் தண்ணீர் குடிக்க இறங்கி வருகிறது.', pic: 'crow' },
        { en: 'In summer the pond gets small. In the monsoon the rain fills it up again.', ta: 'கோடையில் குளம் சிறியதாகிவிடும். மழைக்காலத்தில் மழை அதை மீண்டும் நிரப்பும்.', pic: 'cloud' },
      ],
      gloss: [
        { w: 'pond', ta: 'குளம்', def: 'a small lake' },
        { w: 'swim', ta: 'நீந்து', def: 'to move through water' },
        { w: 'slowly', ta: 'மெதுவாக', def: 'not fast' },
        { w: 'thirsty', ta: 'தாகமான', def: 'wanting to drink' },
        { w: 'monsoon', ta: 'மழைக்காலம்', def: 'the season of heavy rain' },
      ],
      qs: [
        { q: { en: 'Where is the pond?', ta: 'குளம் எங்கே இருக்கிறது?' }, a: 'near the village, under a big tree', o: ['inside the school', 'next to the railway station'], pg: 0, line: 'Near our village there is a pond under a big tree.' },
        { q: { en: 'What does the frog sit on?', ta: 'தவளை எதன் மேல் உட்கார்ந்திருக்கிறது?' }, a: 'a lily leaf', o: ['a red bus', 'a duck'], pg: 2, line: 'A green frog sits on a lily leaf.' },
        { q: { en: 'How does the snail move?', ta: 'நத்தை எப்படி நகர்கிறது?' }, a: 'slowly', o: ['fast', 'by jumping'], pg: 3, line: 'A snail moves slowly up a wet stone.' },
        { q: { en: 'Why does the crow come down?', ta: 'காகம் ஏன் இறங்கி வருகிறது?' }, a: 'to drink', o: ['to sleep', 'to swim'], pg: 4, line: 'A thirsty crow comes down to drink.' },
        { q: { en: 'What fills the pond in the monsoon?', ta: 'மழைக்காலத்தில் குளத்தை எது நிரப்புகிறது?' }, a: 'the rain', o: ['the ducks', 'the sun'], pg: 5, line: 'In the monsoon the rain fills it up again.' },
      ] },

    // ---------------- level 3: longer stories with richer words (ages 7–10) ----------------
    { id: 'night-train', lvl: 3, title: { en: 'The Night Train to Madurai', ta: 'மதுரைக்கு இரவு ரயில்' }, setting: { en: 'A train ride', ta: 'ஒரு ரயில் பயணம்' },
      pages: [
        { en: 'Kavya had never slept on a train before. Tonight she was going to Madurai to visit her grandmother.', ta: 'காவ்யா இதுவரை ரயிலில் தூங்கியதே இல்லை. இன்றிரவு அவள் பாட்டியைப் பார்க்க மதுரைக்குப் போகிறாள்.', pic: 'train' },
        { en: 'At Chennai Central, the platform was crowded and noisy. Porters in red shirts carried heavy suitcases on their heads.', ta: 'சென்னை சென்ட்ரலில் நடைமேடை கூட்டமாகவும் சத்தமாகவும் இருந்தது. சிவப்புச் சட்டை அணிந்த சுமை தூக்குபவர்கள் கனமான பெட்டிகளைத் தலையில் சுமந்தனர்.', pic: 'bag' },
        { en: 'Their berths were in coach S4. Kavya chose the upper berth so she could look out of the small window.', ta: 'அவர்களின் படுக்கைகள் S4 பெட்டியில் இருந்தன. சிறிய சன்னல் வழியே வெளியே பார்க்க காவ்யா மேல் படுக்கையைத் தேர்ந்தெடுத்தாள்.', pic: 'window' },
        { en: 'With a long whistle, the train began to move. The city lights slid past, slowly at first and then faster.', ta: 'நீண்ட விசில் சத்தத்துடன் ரயில் நகரத் தொடங்கியது. நகரத்தின் விளக்குகள் முதலில் மெதுவாகவும் பிறகு வேகமாகவும் கடந்து சென்றன.', scene: { k: 'train' } },
        { en: 'A man came down the aisle calling, “Tea, coffee, tea.” Appa bought two cups of hot tea.', ta: 'ஒருவர் டீ, காபி, டீ என்று கூவியபடி நடைபாதையில் வந்தார். அப்பா இரண்டு கோப்பை சூடான டீ வாங்கினார்.', pic: 'cup' },
        { en: 'Kavya counted the stations: Chengalpattu, Villupuram, Tiruchirappalli. Then her eyes grew heavy.', ta: 'காவ்யா நிலையங்களை எண்ணினாள்: செங்கல்பட்டு, விழுப்புரம், திருச்சிராப்பள்ளி. பிறகு அவள் கண்கள் கனத்தன.', pic: 'moon' },
        { en: 'The rocking of the train was like a cradle. She fell asleep under a sky full of stars.', ta: 'ரயிலின் ஆட்டம் ஒரு தொட்டில் போல இருந்தது. நட்சத்திரங்கள் நிறைந்த வானத்தின் கீழ் அவள் தூங்கிவிட்டாள்.', pic: 'star' },
        { en: 'When she woke up, the sun was rising over green paddy fields. Paati was waiting on the platform at Madurai.', ta: 'அவள் கண்விழித்தபோது, பச்சை நெல்வயல்களின் மேல் சூரியன் உதித்துக்கொண்டிருந்தது. மதுரை நடைமேடையில் பாட்டி காத்திருந்தார்.', pic: 'sun' },
      ],
      gloss: [
        { w: 'platform', ta: 'நடைமேடை', def: 'the place where you wait for a train' },
        { w: 'berth', forms: ['berths'], ta: 'ரயில் படுக்கை', def: 'a bed on a train' },
        { w: 'aisle', ta: 'நடைபாதை', def: 'the narrow path between seats' },
        { w: 'cradle', ta: 'தொட்டில்', def: 'a small bed that rocks a baby to sleep' },
        { w: 'paddy', ta: 'நெல்', def: 'rice growing in a wet field' },
      ],
      qs: [
        { q: { en: 'Why was Kavya going to Madurai?', ta: 'காவ்யா ஏன் மதுரைக்குப் போனாள்?' }, a: 'to visit her grandmother', o: ['to start a new school', 'to buy a kite'], pg: 0, line: 'Tonight she was going to Madurai to visit her grandmother.' },
        { q: { en: 'Why did Kavya choose the upper berth?', ta: 'காவ்யா ஏன் மேல் படுக்கையைத் தேர்ந்தெடுத்தாள்?' }, a: 'so she could look out of the window', o: ['because it was bigger', 'because Appa was sleepy'], pg: 2, line: 'Kavya chose the upper berth so she could look out of the small window.' },
        { q: { en: 'What did Appa buy?', ta: 'அப்பா என்ன வாங்கினார்?' }, a: 'two cups of hot tea', o: ['a bag of mangoes', 'a new suitcase'], pg: 4, line: 'Appa bought two cups of hot tea.' },
        { q: { en: 'Which of these happened first?', ta: 'இவற்றில் முதலில் நடந்தது எது?' }, a: 'The train began to move.', o: ['Kavya fell asleep.', 'Paati waited on the platform.'], pg: 3, line: 'With a long whistle, the train began to move.' },
        { q: { en: 'What was the rocking of the train like?', ta: 'ரயிலின் ஆட்டம் எதைப் போல இருந்தது?' }, a: 'a cradle', o: ['a drum', 'a storm'], pg: 6, line: 'The rocking of the train was like a cradle.' },
      ] },

    { id: 'market-money', lvl: 3, title: { en: 'Meena Does the Shopping', ta: 'மீனாவின் சந்தைக் கணக்கு' }, setting: { en: 'The Sunday vegetable market', ta: 'ஞாயிற்றுக்கிழமை காய்கறிச் சந்தை' },
      pages: [
        { en: 'Every Sunday, Meena goes to the vegetable market with her uncle. Today he gave her a hundred rupees and said, “You do the shopping.”', ta: 'ஒவ்வொரு ஞாயிற்றுக்கிழமையும் மீனா தன் மாமாவுடன் காய்கறிச் சந்தைக்குப் போவாள். இன்று அவர் அவளிடம் நூறு ரூபாய் கொடுத்து, நீயே வாங்கு என்றார்.', scene: { k: 'money', items: [100] } },
        { en: 'The market smelled of coriander and wet earth. Sellers sat behind heaps of shiny vegetables.', ta: 'சந்தையில் கொத்தமல்லி மற்றும் ஈர மண்ணின் மணம் வீசியது. வியாபாரிகள் பளபளக்கும் காய்கறிக் குவியல்களுக்குப் பின்னால் அமர்ந்திருந்தனர்.', pic: 'potato' },
        { en: 'First she bought half a kilo of tomatoes for twenty rupees.', ta: 'முதலில் அவள் அரை கிலோ தக்காளியை இருபது ரூபாய்க்கு வாங்கினாள்.', pic: 'tomato' },
        { en: 'Next, a kilo of onions cost thirty rupees. “Twenty and thirty make fifty,” she whispered.', ta: 'அடுத்து, ஒரு கிலோ வெங்காயம் முப்பது ரூபாய். இருபதும் முப்பதும் ஐம்பது என்று அவள் கிசுகிசுத்தாள்.', pic: 'onion' },
        { en: 'The brinjals were purple and glossy. The seller asked for twenty-five rupees, and Meena agreed.', ta: 'கத்தரிக்காய்கள் ஊதா நிறத்தில் பளபளப்பாக இருந்தன. வியாபாரி இருபத்தைந்து ரூபாய் கேட்டார், மீனா ஒப்புக்கொண்டாள்.', pic: 'brinjal' },
        { en: '“Fifty and twenty-five is seventy-five,” she said. “So I should have twenty-five rupees left.”', ta: 'ஐம்பதும் இருபத்தைந்தும் எழுபத்தைந்து என்றாள். அப்படியென்றால் என்னிடம் இருபத்தைந்து ரூபாய் மீதம் இருக்க வேண்டும்.', scene: { k: 'money', items: [20, 'c5'] } },
        { en: 'She bought a coconut for twenty rupees and counted her change: one five-rupee coin.', ta: 'அவள் இருபது ரூபாய்க்கு ஒரு தேங்காய் வாங்கி, மீதிச் சில்லறையை எண்ணினாள்: ஒரு ஐந்து ரூபாய் நாணயம்.', pic: 'coconut' },
        { en: 'Her uncle checked the bag and smiled. “Every rupee is right,” he said. “Next week you can teach me.”', ta: 'மாமா பையைச் சரிபார்த்துப் புன்னகைத்தார். ஒவ்வொரு ரூபாயும் சரியாக இருக்கிறது என்றார். அடுத்த வாரம் நீ எனக்குக் கற்றுக்கொடு.', pic: 'bag' },
      ],
      gloss: [
        { w: 'heaps', forms: ['heap'], ta: 'குவியல்கள்', def: 'big untidy piles' },
        { w: 'kilo', ta: 'கிலோ', def: 'one thousand grams' },
        { w: 'glossy', ta: 'பளபளப்பான', def: 'smooth and shiny' },
        { w: 'change', ta: 'மீதிச் சில்லறை', def: 'the money you get back after paying' },
        { w: 'whispered', forms: ['whisper'], ta: 'கிசுகிசுத்தாள்', def: 'spoke very softly' },
      ],
      qs: [
        { q: { en: 'Who does Meena go to the market with?', ta: 'மீனா யாருடன் சந்தைக்குப் போகிறாள்?' }, a: 'her uncle', o: ['her teacher', 'her cousin'], pg: 0, line: 'Every Sunday, Meena goes to the vegetable market with her uncle.' },
        { q: { en: 'How much did the tomatoes cost?', ta: 'தக்காளியின் விலை என்ன?' }, a: 'twenty rupees', o: ['thirty rupees', 'fifty rupees'], pg: 2, line: 'First she bought half a kilo of tomatoes for twenty rupees.' },
        { q: { en: 'After the brinjals, how much money should Meena have left?', ta: 'கத்தரிக்காய் வாங்கிய பிறகு மீனாவிடம் எவ்வளவு பணம் மீதம் இருக்க வேண்டும்?' }, a: 'twenty-five rupees', o: ['fifty rupees', 'five rupees'], pg: 5, line: 'So I should have twenty-five rupees left.' },
        { q: { en: 'What did Meena buy last?', ta: 'மீனா கடைசியாக என்ன வாங்கினாள்?' }, a: 'a coconut', o: ['a kilo of onions', 'a bag of rice'], pg: 6, line: 'She bought a coconut for twenty rupees and counted her change: one five-rupee coin.' },
        { q: { en: 'Why did her uncle smile?', ta: 'மாமா ஏன் புன்னகைத்தார்?' }, a: 'Every rupee was right.', o: ['Meena lost the bag.', 'The market was closed.'], pg: 7, line: '“Every rupee is right,” he said.' },
      ] },

    { id: 'kite', lvl: 3, title: { en: 'The Kite on the Terrace', ta: 'மொட்டைமாடியில் பட்டம்' }, setting: { en: 'Kite season in August', ta: 'ஆகஸ்ட் மாதப் பட்டக் காலம்' },
      pages: [
        { en: 'In August the wind in our town blows strong and steady. That is kite season.', ta: 'ஆகஸ்ட் மாதத்தில் எங்கள் ஊரில் காற்று பலமாகவும் சீராகவும் வீசும். அதுதான் பட்டம் விடும் காலம்.', pic: 'kite' },
        { en: 'Arjun and his sister Divya made a kite from thin bamboo sticks and red paper.', ta: 'அர்ஜுனும் அவன் தங்கை திவ்யாவும் மெல்லிய மூங்கில் குச்சிகளாலும் சிவப்புக் காகிதத்தாலும் ஒரு பட்டம் செய்தனர்.', scene: { k: 'kite', tail: false } },
        { en: 'They climbed up to the flat terrace under the hot sun. Divya held the kite high while Arjun ran with the string.', ta: 'அவர்கள் சுட்டெரிக்கும் வெயிலில் தட்டையான மொட்டைமாடிக்கு ஏறினர். அர்ஜுன் நூலுடன் ஓடும்போது திவ்யா பட்டத்தை உயரத் தூக்கிப் பிடித்தாள்.', pic: 'sun' },
        { en: 'The kite rose, wobbled, and crashed into a coconut tree.', ta: 'பட்டம் மேலே எழுந்து, தள்ளாடி, ஒரு தென்னை மரத்தில் மோதியது.', scene: { k: 'palm' } },
        { en: '“It needs a tail,” said Divya. “A tail keeps it steady.” They tied on a long strip of cloth.', ta: 'அதற்கு ஒரு வால் வேண்டும் என்றாள் திவ்யா. வால் அதை நிலையாக வைத்திருக்கும். அவர்கள் ஒரு நீண்ட துணிப் பட்டையைக் கட்டினர்.', scene: { k: 'kite', tail: true } },
        { en: 'This time the wind lifted the kite higher and higher, far above the crows.', ta: 'இந்த முறை காற்று பட்டத்தை உயர உயரத் தூக்கியது, காகங்களுக்கும் வெகு மேலே.', pic: 'crow' },
        { en: 'Arjun felt the string pull in his hands, as if the kite were alive. “The wind is pushing it up,” he laughed.', ta: 'நூல் கைகளில் இழுப்பதை அர்ஜுன் உணர்ந்தான், பட்டத்துக்கு உயிர் இருப்பது போல. காற்று அதை மேலே தள்ளுகிறது என்று சிரித்தான்.', pic: 'kite' },
      ],
      gloss: [
        { w: 'steady', ta: 'சீரான', def: 'even and not shaking' },
        { w: 'bamboo', ta: 'மூங்கில்', def: 'a tall, hollow grass used to make sticks' },
        { w: 'terrace', ta: 'மொட்டைமாடி', def: 'a flat roof you can walk on' },
        { w: 'wobbled', forms: ['wobble'], ta: 'தள்ளாடியது', def: 'shook from side to side' },
        { w: 'tail', ta: 'வால்', def: 'a long part that hangs at the back' },
      ],
      qs: [
        { q: { en: 'When is kite season?', ta: 'பட்டம் விடும் காலம் எப்போது?' }, a: 'in August', o: ['in December', 'in April'], pg: 0, line: 'In August the wind in our town blows strong and steady.' },
        { q: { en: 'What did they make the kite from?', ta: 'பட்டத்தை எதனால் செய்தார்கள்?' }, a: 'bamboo sticks and red paper', o: ['plastic and wire', 'banana leaves'], pg: 1, line: 'Arjun and his sister Divya made a kite from thin bamboo sticks and red paper.' },
        { q: { en: 'What happened the first time they flew it?', ta: 'முதல் முறை பறக்கவிட்டபோது என்ன நடந்தது?' }, a: 'It crashed into a coconut tree.', o: ['It flew above the crows.', 'It fell into a pond.'], pg: 3, line: 'The kite rose, wobbled, and crashed into a coconut tree.' },
        { q: { en: 'Why did they add a tail?', ta: 'ஏன் வால் சேர்த்தார்கள்?' }, a: 'A tail keeps it steady.', o: ['A tail makes it pretty.', 'A tail makes it heavy.'], pg: 4, line: 'A tail keeps it steady.' },
        { q: { en: 'What pushes the kite up?', ta: 'பட்டத்தை மேலே தள்ளுவது எது?' }, a: 'the wind', o: ['the string', 'the crows'], pg: 6, line: '“The wind is pushing it up,” he laughed.' },
      ] },

    { id: 'rain-gauge', lvl: 3, title: { en: 'Measuring the Monsoon', ta: 'மழையை அளப்போம்' }, setting: { en: 'A class science project', ta: 'வகுப்பு அறிவியல் செயல்திட்டம்' },
      pages: [
        { en: 'The monsoon arrived in June, and our class wanted to know how much rain fell each day.', ta: 'ஜூன் மாதத்தில் பருவமழை தொடங்கியது. ஒவ்வொரு நாளும் எவ்வளவு மழை பெய்கிறது என்று அறிய எங்கள் வகுப்பு விரும்பியது.', pic: 'cloud' },
        { en: 'Ravi Sir showed us how to make a rain gauge from an old plastic bottle and a ruler.', ta: 'பழைய பிளாஸ்டிக் பாட்டிலும் அளவுகோலும் கொண்டு மழைமானி செய்வது எப்படி என்று ரவி சார் காட்டினார்.', scene: { k: 'gauge', mm: 0 } },
        { en: 'We cut off the top of the bottle and turned it upside down to make a funnel.', ta: 'பாட்டிலின் மேல் பகுதியை வெட்டி, தலைகீழாகத் திருப்பி ஒரு புனல் செய்தோம்.', scene: { k: 'gauge', mm: 0, funnel: true } },
        { en: 'We placed the gauge in the open playground, far from trees and roofs.', ta: 'மரங்களிலிருந்தும் கூரைகளிலிருந்தும் தொலைவில், திறந்த விளையாட்டு மைதானத்தில் மழைமானியை வைத்தோம்.', pic: 'school' },
        { en: 'Every morning at nine, one of us read the water level and wrote it in a notebook.', ta: 'ஒவ்வொரு காலையும் ஒன்பது மணிக்கு எங்களில் ஒருவர் நீர் மட்டத்தைப் படித்து நோட்டுப் புத்தகத்தில் எழுதினோம்.', pic: 'book' },
        { en: 'On Monday there were 12 millimetres. On Tuesday, after a huge storm, there were 40.', ta: 'திங்கள்கிழமை 12 மில்லிமீட்டர். செவ்வாய்க்கிழமை, ஒரு பெரிய புயலுக்குப் பிறகு, 40 மில்லிமீட்டர்.', scene: { k: 'gauge', mm: 40, funnel: true } },
        { en: 'After each reading we emptied the bottle, so the next day started from zero.', ta: 'ஒவ்வொரு அளவீட்டுக்குப் பிறகும் பாட்டிலைக் காலி செய்தோம், அதனால் அடுத்த நாள் பூஜ்ஜியத்திலிருந்து தொடங்கியது.', scene: { k: 'gauge', mm: 0, funnel: true } },
        { en: 'At the end of the week we made a bar chart. Tuesday’s bar was the tallest of all.', ta: 'வார இறுதியில் ஒரு பட்டை வரைபடம் (bar chart) வரைந்தோம். செவ்வாய்க்கிழமையின் பட்டைதான் எல்லாவற்றையும் விட உயரமாக இருந்தது.', scene: { k: 'bars', vals: [12, 40, 8, 20, 4] } },
      ],
      gloss: [
        { w: 'gauge', ta: 'மானி', def: 'a tool that measures something' },
        { w: 'funnel', ta: 'புனல்', def: 'a cone that guides water into a bottle' },
        { w: 'level', ta: 'மட்டம்', def: 'how high something reaches' },
        { w: 'millimetres', forms: ['millimetre'], ta: 'மில்லிமீட்டர்', def: 'very small units of length' },
        { w: 'storm', ta: 'புயல்', def: 'very strong wind and rain' },
      ],
      qs: [
        { q: { en: 'Who showed the class how to make a rain gauge?', ta: 'மழைமானி செய்வது எப்படி என்று வகுப்புக்குக் காட்டியது யார்?' }, a: 'Ravi Sir', o: ['Lata Miss', 'Paati'], pg: 1, line: 'Ravi Sir showed us how to make a rain gauge from an old plastic bottle and a ruler.' },
        { q: { en: 'Where did they place the gauge?', ta: 'மழைமானியை எங்கே வைத்தார்கள்?' }, a: 'in the open playground', o: ['under a tree', 'inside the classroom'], pg: 3, line: 'We placed the gauge in the open playground, far from trees and roofs.' },
        { q: { en: 'How much rain fell on Tuesday?', ta: 'செவ்வாய்க்கிழமை எவ்வளவு மழை பெய்தது?' }, a: '40 millimetres', o: ['12 millimetres', '9 millimetres'], pg: 5, line: 'On Tuesday, after a huge storm, there were 40.' },
        { q: { en: 'Why did they empty the bottle after each reading?', ta: 'ஒவ்வொரு அளவீட்டுக்குப் பிறகும் ஏன் பாட்டிலைக் காலி செய்தார்கள்?' }, a: 'so the next day started from zero', o: ['so the bottle stayed clean', 'so the crows could drink'], pg: 6, line: 'After each reading we emptied the bottle, so the next day started from zero.' },
        { q: { en: 'Which bar was the tallest?', ta: 'எந்தப் பட்டை மிக உயரமாக இருந்தது?' }, a: 'Tuesday’s', o: ['Monday’s', 'Sunday’s'], pg: 7, line: 'Tuesday’s bar was the tallest of all.' },
      ] },

    { id: 'coconut-tree', lvl: 3, title: { en: 'Thatha’s Coconut Tree', ta: 'தாத்தாவின் தென்னை மரம்' }, setting: { en: 'Grandfather’s backyard', ta: 'தாத்தா வீட்டுக் கொல்லை' },
      pages: [
        { en: 'Behind Thatha’s house stands a coconut tree that is older than my father.', ta: 'தாத்தா வீட்டின் பின்னால் என் அப்பாவை விட வயதான ஒரு தென்னை மரம் நிற்கிறது.', scene: { k: 'palm' } },
        { en: 'Thatha says the tree gives us everything we need, from its roots to its leaves.', ta: 'வேர் முதல் ஓலை வரை, நமக்குத் தேவையான எல்லாவற்றையும் இந்த மரம் தருகிறது என்று தாத்தா சொல்வார்.', pic: 'tree' },
        { en: 'Murugan climbs the tall trunk with a rope loop around his feet, and the coconuts drop with a thud.', ta: 'முருகன் கால்களைச் சுற்றி ஒரு கயிற்று வளையத்துடன் உயரமான அடிமரத்தில் ஏறுகிறார். தேங்காய்கள் தொப் என்று விழுகின்றன.', scene: { k: 'palm', drop: true } },
        { en: 'Inside a young coconut there is sweet water. On a hot day, it is the best drink.', ta: 'இளநீர்க் காய்க்குள் இனிப்பான நீர் இருக்கிறது. வெயில் நாளில் அதுதான் சிறந்த பானம்.', pic: 'coconut' },
        { en: 'Amma grates the white flesh for chutney, and the oil is used for cooking and for our hair.', ta: 'அம்மா வெள்ளைத் தேங்காயைத் துருவிச் சட்னி செய்கிறார். எண்ணெய் சமையலுக்கும் தலைமுடிக்கும் பயன்படுகிறது.', pic: 'plate' },
        { en: 'The dry leaves are woven into mats, and the stiff spines become a broom.', ta: 'காய்ந்த ஓலைகள் பாய்களாகப் பின்னப்படுகின்றன. கெட்டியான ஈர்க்குகள் துடைப்பமாகின்றன.', scene: { k: 'mat' } },
        { en: '“Look after a tree,” Thatha says, “and it will look after you.” So I planted a coconut seedling of my own.', ta: 'ஒரு மரத்தைப் பார்த்துக்கொள், அது உன்னைப் பார்த்துக்கொள்ளும் என்கிறார் தாத்தா. அதனால் நானும் எனக்கென்று ஒரு தென்னங்கன்றை நட்டேன்.', scene: { k: 'sprout', stage: 2 } },
      ],
      gloss: [
        { w: 'trunk', ta: 'அடிமரம்', def: 'the main thick stem of a tree' },
        { w: 'grates', forms: ['grate'], ta: 'துருவுகிறார்', def: 'rubs food into tiny pieces' },
        { w: 'woven', forms: ['weave'], ta: 'பின்னப்பட்ட', def: 'made by crossing strips over and under' },
        { w: 'broom', ta: 'துடைப்பம்', def: 'a brush for sweeping the floor' },
        { w: 'seedling', ta: 'கன்று', def: 'a very young plant' },
      ],
      qs: [
        { q: { en: 'How old is the coconut tree?', ta: 'தென்னை மரத்துக்கு எவ்வளவு வயது?' }, a: 'older than my father', o: ['one year old', 'younger than me'], pg: 0, line: 'Behind Thatha’s house stands a coconut tree that is older than my father.' },
        { q: { en: 'Who climbs the tree?', ta: 'மரத்தில் ஏறுவது யார்?' }, a: 'Murugan', o: ['Thatha', 'Amma'], pg: 2, line: 'Murugan climbs the tall trunk with a rope loop around his feet, and the coconuts drop with a thud.' },
        { q: { en: 'What is inside a young coconut?', ta: 'இளநீர்க் காய்க்குள் என்ன இருக்கிறது?' }, a: 'sweet water', o: ['milk tea', 'rice'], pg: 3, line: 'Inside a young coconut there is sweet water.' },
        { q: { en: 'What are the dry leaves made into?', ta: 'காய்ந்த ஓலைகளால் என்ன செய்கிறார்கள்?' }, a: 'mats', o: ['kites', 'chutney'], pg: 5, line: 'The dry leaves are woven into mats, and the stiff spines become a broom.' },
        { q: { en: 'What did I plant at the end?', ta: 'கடைசியில் நான் என்ன நட்டேன்?' }, a: 'a coconut seedling', o: ['a mango seed', 'a rose'], pg: 6, line: 'So I planted a coconut seedling of my own.' },
      ] },

    { id: 'temple-elephant', lvl: 3, title: { en: 'Lakshmi the Temple Elephant', ta: 'கோயில் யானை லட்சுமி' }, setting: { en: 'A temple town', ta: 'ஒரு கோயில் நகரம்' },
      pages: [
        { en: 'Every morning, Lakshmi the temple elephant walks to the river for her bath.', ta: 'ஒவ்வொரு காலையும் கோயில் யானை லட்சுமி குளிக்க ஆற்றுக்கு நடந்து போகிறாள்.', pic: 'river' },
        { en: 'Her mahout, Selvam, scrubs her rough grey skin with a coconut husk.', ta: 'அவளுடைய பாகன் செல்வம், தேங்காய் நாரால் அவளுடைய சொரசொரப்பான சாம்பல் நிறத் தோலைத் தேய்க்கிறார்.', pic: 'coconut' },
        { en: 'Lakshmi sprays water over her back with her trunk. The children on the steps laugh and get wet too.', ta: 'லட்சுமி தும்பிக்கையால் முதுகின் மேல் தண்ணீர் தெளிக்கிறாள். படிகளில் இருக்கும் குழந்தைகள் சிரித்து, அவர்களும் நனைகிறார்கள்.', pic: 'elephant' },
        { en: 'An elephant eats for almost eighteen hours a day: grass, palm leaves, bananas and balls of jaggery.', ta: 'ஒரு யானை நாளொன்றுக்கு ஏறக்குறைய பதினெட்டு மணி நேரம் சாப்பிடும்: புல், பனை ஓலை, வாழைப்பழம், வெல்ல உருண்டைகள்.', pic: 'banana' },
        { en: 'In the evening the temple lamps are lit, and the drums begin to beat.', ta: 'மாலையில் கோயில் விளக்குகள் ஏற்றப்படுகின்றன, மேளங்கள் ஒலிக்கத் தொடங்குகின்றன.', pic: 'drum' },
        { en: 'Lakshmi stands calmly at the gate. When a child gives her a coin, she gently touches the child’s head with her trunk.', ta: 'லட்சுமி வாசலில் அமைதியாக நிற்கிறாள். ஒரு குழந்தை நாணயம் கொடுத்தால், தும்பிக்கையால் அந்தக் குழந்தையின் தலையை மெதுவாகத் தொடுகிறாள்.', pic: 'flower' },
        { en: 'Selvam says an elephant never forgets a kind face. I hope Lakshmi remembers mine.', ta: 'ஒரு யானை அன்பான முகத்தை ஒருபோதும் மறக்காது என்கிறார் செல்வம். லட்சுமி என் முகத்தை நினைவில் வைத்திருப்பாள் என்று நம்புகிறேன்.', pic: 'elephant' },
      ],
      gloss: [
        { w: 'mahout', ta: 'பாகன்', def: 'a person who looks after an elephant' },
        { w: 'scrubs', forms: ['scrub'], ta: 'தேய்க்கிறார்', def: 'rubs hard to clean' },
        { w: 'trunk', ta: 'தும்பிக்கை', def: 'an elephant’s long nose' },
        { w: 'calmly', ta: 'அமைதியாக', def: 'in a quiet, relaxed way' },
        { w: 'gently', ta: 'மென்மையாக', def: 'softly and with care' },
      ],
      qs: [
        { q: { en: 'Where does Lakshmi walk every morning?', ta: 'லட்சுமி ஒவ்வொரு காலையும் எங்கே நடந்து போகிறாள்?' }, a: 'to the river', o: ['to the market', 'to the school'], pg: 0, line: 'Every morning, Lakshmi the temple elephant walks to the river for her bath.' },
        { q: { en: 'Who is Selvam?', ta: 'செல்வம் யார்?' }, a: 'her mahout', o: ['a priest', 'a seller'], pg: 1, line: 'Her mahout, Selvam, scrubs her rough grey skin with a coconut husk.' },
        { q: { en: 'How long does an elephant eat each day?', ta: 'ஒரு யானை தினமும் எவ்வளவு நேரம் சாப்பிடும்?' }, a: 'almost eighteen hours', o: ['one hour', 'two hours'], pg: 3, line: 'An elephant eats for almost eighteen hours a day: grass, palm leaves, bananas and balls of jaggery.' },
        { q: { en: 'What happens in the evening?', ta: 'மாலையில் என்ன நடக்கிறது?' }, a: 'The lamps are lit and the drums beat.', o: ['Lakshmi sleeps in the river.', 'The children go to school.'], pg: 4, line: 'In the evening the temple lamps are lit, and the drums begin to beat.' },
        { q: { en: 'What does an elephant never forget?', ta: 'ஒரு யானை எதை ஒருபோதும் மறக்காது?' }, a: 'a kind face', o: ['a banana', 'a drum'], pg: 6, line: 'Selvam says an elephant never forgets a kind face.' },
      ] },
  ];

  // Tamil meanings for everyday words a child may tap (sight words and story words not in EN_DATA.WORDS).
  const COMMON = {
    a: 'ஒரு', and: 'மற்றும்', away: 'தொலைவில்', big: 'பெரிய', blue: 'நீலம்', can: 'முடியும்', come: 'வா', comes: 'வருகிறது', down: 'கீழே', find: 'கண்டுபிடி', for: 'க்காக', funny: 'வேடிக்கையான', go: 'போ', help: 'உதவி', here: 'இங்கே', i: 'நான்', in: 'உள்ளே', is: 'இருக்கிறது', it: 'அது', jump: 'குதி', jumps: 'குதிக்கிறது', little: 'சிறிய', look: 'பார்', make: 'செய்', me: 'என்னை', my: 'என்', not: 'இல்லை', one: 'ஒன்று', play: 'விளையாடு', red: 'சிவப்பு', run: 'ஓடு', said: 'சொன்னார்', see: 'பார்', the: 'அந்த', three: 'மூன்று', to: 'க்கு', two: 'இரண்டு', up: 'மேலே', we: 'நாங்கள்', where: 'எங்கே', yellow: 'மஞ்சள்', you: 'நீ',
    all: 'எல்லாம்', am: 'இருக்கிறேன்', are: 'இருக்கிறார்கள்', at: 'இல்', ate: 'சாப்பிட்டது', black: 'கருப்பு', but: 'ஆனால்', came: 'வந்தது', did: 'செய்தது', do: 'செய்', eat: 'சாப்பிடு', four: 'நான்கு', get: 'பெறு', good: 'நல்ல', have: 'வைத்திரு', he: 'அவன்', into: 'உள்ளே', like: 'போல', new: 'புதிய', no: 'இல்லை', now: 'இப்போது', on: 'மேல்', our: 'எங்கள்', out: 'வெளியே', please: 'தயவுசெய்து', pretty: 'அழகான', ran: 'ஓடியது', saw: 'பார்த்தது', she: 'அவள்', so: 'அதனால்', soon: 'விரைவில்', that: 'அது', there: 'அங்கே', they: 'அவர்கள்', this: 'இது', too: 'மிகவும்', want: 'வேண்டும்', was: 'இருந்தது', went: 'போனது', what: 'என்ன', white: 'வெள்ளை', who: 'யார்', with: 'உடன்', yes: 'ஆம்',
    amma: 'அம்மா', appa: 'அப்பா', paati: 'பாட்டி', thatha: 'தாத்தா', sat: 'உட்கார்ந்தது', ten: 'பத்து', then: 'பிறகு', rice: 'அரிசி', water: 'தண்ணீர்', milk: 'பால்', day: 'நாள்', every: 'ஒவ்வொரு', each: 'ஒவ்வொரு', hot: 'சூடான', sweet: 'இனிப்பான', green: 'பச்சை', pink: 'இளஞ்சிவப்பு', purple: 'ஊதா', grey: 'சாம்பல் நிறம்', wet: 'ஈரமான', dry: 'காய்ந்த', small: 'சிறிய', tall: 'உயரமான', home: 'வீடு', house: 'வீடு', village: 'கிராமம்', sky: 'வானம்', wind: 'காற்று', string: 'நூல்', paper: 'காகிதம்', stone: 'கல்', fish: 'மீன்', food: 'உணவு', plant: 'செடி', pot: 'தொட்டி', child: 'குழந்தை', children: 'குழந்தைகள்', morning: 'காலை', evening: 'மாலை', night: 'இரவு', week: 'வாரம்', tea: 'டீ', rope: 'கயிறு', coin: 'நாணயம்', rupees: 'ரூபாய்', twelve: 'பன்னிரண்டு', five: 'ஐந்து', six: 'ஆறு', twenty: 'இருபது', thirty: 'முப்பது', fifty: 'ஐம்பது', hundred: 'நூறு', drink: 'குடி', swim: 'நீந்து', laugh: 'சிரி', laughed: 'சிரித்தான்', smiled: 'புன்னகைத்தார்', early: 'சீக்கிரம்', heavy: 'கனமான', noisy: 'சத்தமான', crowded: 'கூட்டமான', asleep: 'தூக்கத்தில்', field: 'வயல்', fields: 'வயல்கள்', station: 'நிலையம்', stations: 'நிலையங்கள்', whistle: 'விசில்', grandmother: 'பாட்டி', uncle: 'மாமா', sister: 'தங்கை', seller: 'வியாபாரி', sellers: 'வியாபாரிகள்', lamps: 'விளக்குகள்', drums: 'மேளங்கள்', gate: 'வாசல்', kind: 'அன்பான', face: 'முகம்', river: 'ஆறு', bath: 'குளியல்', skin: 'தோல்',
  };
  window.STORIES_DATA = { stories: S, COMMON };
})();
