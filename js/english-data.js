// English word data. English words are the content being learned; `ta` is the Tamil meaning shown beside them.
// Pictures: Wikipedia lead images (Wikimedia Commons), vetted on a contact sheet — see tools/find-pics.py and pics.js.
(function () {
  const THEMES = {
    animals: { title: ['Animals', 'விலங்குகள்'], words: { cat: 'பூனை', dog: 'நாய்', cow: 'பசு', goat: 'ஆடு', elephant: 'யானை', tiger: 'புலி', monkey: 'குரங்கு', horse: 'குதிரை', rabbit: 'முயல்', zebra: 'வரிக்குதிரை' } },
    creatures: { title: ['Birds and small creatures', 'பறவைகளும் சிறு உயிரினங்களும்'], words: { parrot: 'கிளி', peacock: 'மயில்', crow: 'காகம்', hen: 'கோழி', duck: 'வாத்து', butterfly: 'பட்டாம்பூச்சி', ant: 'எறும்பு', bee: 'தேனீ', snail: 'நத்தை', frog: 'தவளை' } },
    fruits: { title: ['Fruits', 'பழங்கள்'], words: { apple: 'ஆப்பிள்', banana: 'வாழைப்பழம்', mango: 'மாம்பழம்', orange: 'ஆரஞ்சு', grapes: 'திராட்சை', jackfruit: 'பலாப்பழம்', watermelon: 'தர்பூசணி', lemon: 'எலுமிச்சை', papaya: 'பப்பாளி', coconut: 'தேங்காய்' } },
    vegetables: { title: ['Vegetables', 'காய்கறிகள்'], words: { carrot: 'கேரட்', tomato: 'தக்காளி', potato: 'உருளைக்கிழங்கு', onion: 'வெங்காயம்', brinjal: 'கத்தரிக்காய்', cabbage: 'முட்டைக்கோஸ்', pumpkin: 'பூசணிக்காய்', okra: 'வெண்டைக்காய்', peas: 'பட்டாணி', cucumber: 'வெள்ளரிக்காய்' } },
    home: { title: ['At home', 'வீட்டில்'], words: { chair: 'நாற்காலி', table: 'மேசை', bed: 'கட்டில்', cup: 'கோப்பை', plate: 'தட்டு', spoon: 'கரண்டி', clock: 'கடிகாரம்', lamp: 'விளக்கு', door: 'கதவு', window: 'சன்னல்' } },
    travel: { title: ['Getting around', 'பயணம்'], words: { bus: 'பேருந்து', car: 'மகிழுந்து', bicycle: 'மிதிவண்டி', train: 'தொடர்வண்டி', boat: 'படகு', auto: 'ஆட்டோ', aeroplane: 'விமானம்', van: 'வேன்', truck: 'சரக்குந்து', ship: 'கப்பல்' } },
    outside: { title: ['Outside', 'வெளியே'], words: { sun: 'சூரியன்', moon: 'நிலா', star: 'நட்சத்திரம்', tree: 'மரம்', flower: 'பூ', rain: 'மழை', river: 'ஆறு', hill: 'மலை', sea: 'கடல்', cloud: 'மேகம்' } },
    play: { title: ['Play and school', 'விளையாட்டும் பள்ளியும்'], words: { ball: 'பந்து', kite: 'பட்டம்', book: 'புத்தகம்', pencil: 'பென்சில்', bag: 'பை', doll: 'பொம்மை', drum: 'மேளம்', top: 'பம்பரம்', school: 'பள்ளி', swing: 'ஊஞ்சல்' } },
  };
  const EXTRA = { igloo: 'பனி வீடு', key: 'சாவி', nest: 'கூடு', quilt: 'மெத்தை விரிப்பு', umbrella: 'குடை', yak: 'கவரிமா', fox: 'நரி' };
  const WORDS = {}; for (const [th, d] of Object.entries(THEMES)) for (const [w, ta] of Object.entries(d.words)) WORDS[w] = { w, ta, theme: th };
  for (const [w, ta] of Object.entries(EXTRA)) WORDS[w] = { w, ta, theme: null };
  WORDS.auto.label = 'auto rickshaw';

  // A–Z: keyword + the sound written the way a teacher would say it (Web Speech can't say bare phonemes)
  const AZ = { a: ['apple', 'a'], b: ['ball', 'b'], c: ['cat', 'k'], d: ['dog', 'd'], e: ['elephant', 'e'], f: ['fox', 'f'], g: ['goat', 'g'], h: ['hen', 'h'], i: ['igloo', 'i'], j: ['jackfruit', 'j'], k: ['key', 'k'], l: ['lemon', 'l'], m: ['mango', 'm'],
    n: ['nest', 'n'], o: ['orange', 'o'], p: ['parrot', 'p'], q: ['quilt', 'kw'], r: ['rabbit', 'r'], s: ['sun', 's'], t: ['tiger', 't'], u: ['umbrella', 'u'], v: ['van', 'v'], w: ['watermelon', 'w'], x: ['fox', 'ks'], y: ['yak', 'y'], z: ['zebra', 'z'] };
  // how the sound is read aloud as a syllable-ish hint
  const SAY = { a: 'a, as in apple', b: 'buh', c: 'kuh', d: 'duh', e: 'e, as in egg', f: 'fff', g: 'guh', h: 'huh', i: 'i, as in igloo', j: 'juh', k: 'kuh', l: 'lll', m: 'mmm', n: 'nnn', o: 'o, as in orange', p: 'puh', q: 'kwuh', r: 'rrr', s: 'sss', t: 'tuh', u: 'u, as in umbrella', v: 'vvv', w: 'wuh', x: 'ks, as in fox', y: 'yuh', z: 'zzz' };

  const CVC = { cat: ['cut', 'cot', 'can'], dog: ['dig', 'dot', 'log'], hen: ['hat', 'ten', 'pen'], sun: ['sit', 'bun', 'son'], bus: ['bun', 'bag', 'bed'], bed: ['bad', 'red', 'bid'], cup: ['cap', 'pup', 'cop'], van: ['vet', 'fan', 'man'], bag: ['big', 'bug', 'rag'], top: ['tip', 'tap', 'hop'], fox: ['box', 'fix', 'fog'], ant: ['and', 'act', 'art'] };
  const DOLCH_PRE = 'a and away big blue can come down find for funny go help here I in is it jump little look make me my not one play red run said see the three to two up we where yellow you'.split(' ');
  const DOLCH_PRIMER = 'all am are at ate be black brown but came did do eat four get good have he into like must new no now on our out please pretty ran ride saw say she so soon that there they this too under want was well went what white who will with yes'.split(' ');

  // spelling patterns for the Bee and the spelling lesson; each word names its pattern
  const PATTERNS = {
    cvc: { words: ['cat', 'dog', 'sun', 'bus', 'hen', 'cup', 'bag', 'top', 'van', 'bed', 'fox', 'pen'] },
    silentE: { mark: 'e$', words: ['cake', 'kite', 'bone', 'cube', 'plate', 'smile', 'stone', 'snake', 'grape', 'flute'] },
    ck: { mark: 'ck', words: ['duck', 'clock', 'sock', 'rock', 'truck', 'black', 'chick', 'brick'] },
    double: { mark: '(ll|ss|ff|zz|pp|tt|ee|oo)', words: ['ball', 'bell', 'doll', 'grass', 'kiss', 'cliff', 'buzz', 'apple', 'kitten', 'puppy'] },
    aiay: { mark: '(ai|ay)', words: ['rain', 'train', 'snail', 'paint', 'play', 'day', 'tray', 'clay'] },
    eeea: { mark: '(ee|ea)', words: ['tree', 'bee', 'sheep', 'green', 'sea', 'leaf', 'meat', 'read'] },
    sh: { mark: '(sh|ch|th)', words: ['ship', 'fish', 'shell', 'chair', 'lunch', 'chin', 'three', 'bath', 'tooth'] },
    oaow: { mark: '(oa|ow)', words: ['boat', 'goat', 'road', 'coat', 'snow', 'bowl', 'yellow', 'window'] },
    igh: { mark: 'igh', words: ['night', 'light', 'right', 'high', 'bright', 'flight'] },
  };
  // sentences for the "use it in a sentence" button (a short, everyday line per word)
  const SENT = { cat: 'The cat sleeps in the sun.', dog: 'The dog runs to the gate.', sun: 'The sun is hot at noon.', bus: 'We go to school by bus.', hen: 'The hen lays an egg.', cup: 'I drink milk from a cup.', bag: 'My books are in my bag.', top: 'The top spins on the floor.', van: 'The van is full of boxes.', bed: 'I go to bed at nine.', fox: 'The fox has a long tail.', pen: 'Write your name with a pen.',
    cake: 'We cut the cake at the party.', kite: 'The kite flies high in the wind.', bone: 'The dog hides a bone.', cube: 'An ice cube melts in the sun.', plate: 'Put the rice on the plate.', smile: 'Grandma has a kind smile.', stone: 'He threw a stone into the pond.', snake: 'A snake has no legs.', grape: 'This grape is sweet.', flute: 'She plays the flute.',
    duck: 'The duck swims in the pond.', clock: 'The clock says three.', sock: 'I lost one sock.', rock: 'A crab hides under the rock.', truck: 'The truck carries sand.', black: 'The crow is black.', chick: 'The chick follows the hen.', brick: 'The wall is made of brick.',
    ball: 'Kick the ball to me.', bell: 'The school bell rings.', doll: 'My doll has a red dress.', grass: 'The goat eats grass.', kiss: 'Amma gives me a kiss.', cliff: 'Do not stand near the cliff.', buzz: 'Bees buzz near the flowers.', apple: 'I eat an apple.', kitten: 'The kitten plays with wool.', puppy: 'The puppy wags its tail.',
    rain: 'The rain falls on the roof.', train: 'The train goes to Chennai.', snail: 'The snail moves slowly.', paint: 'We paint the wall blue.', play: 'Let us play outside.', day: 'It is a sunny day.', tray: 'Put the cups on the tray.', clay: 'We make pots from clay.',
    tree: 'A bird sits in the tree.', bee: 'The bee makes honey.', sheep: 'The sheep has soft wool.', green: 'The leaf is green.', sea: 'The sea has big waves.', leaf: 'A leaf falls from the tree.', meat: 'The tiger eats meat.', read: 'I read a book at night.',
    ship: 'The ship sails on the sea.', fish: 'A fish lives in water.', shell: 'I found a shell on the beach.', chair: 'Sit on the chair.', lunch: 'We eat lunch at one.', chin: 'He rubs his chin.', three: 'I have three pencils.', bath: 'The baby has a bath.', tooth: 'Brush every tooth.',
    boat: 'The boat is on the river.', goat: 'The goat eats leaves.', road: 'Look both ways on the road.', coat: 'Wear a coat in the cold.', snow: 'Snow is white and cold.', bowl: 'Fill the bowl with soup.', yellow: 'A banana is yellow.', window: 'Open the window.',
    night: 'Stars shine at night.', light: 'Switch on the light.', right: 'Raise your right hand.', high: 'The bird flies high.', bright: 'The sun is bright.', flight: 'The flight leaves at six.',
    the: 'The cat is on the mat.', said: 'Amma said, come home.', was: 'It was a hot day.', they: 'They play football.', where: 'Where is my bag?', come: 'Come and sit here.', what: 'What is your name?', there: 'There is a bird.', want: 'I want water.', please: 'Please pass the salt.' };
  // Tamil meanings for spelling words that are not in WORDS
  const SPELL_TA = { pen: 'பேனா', cake: 'கேக்', bone: 'எலும்பு', cube: 'கனசதுரம்', smile: 'புன்னகை', stone: 'கல்', snake: 'பாம்பு', grape: 'திராட்சை', flute: 'புல்லாங்குழல்', sock: 'காலுறை', rock: 'பாறை', black: 'கருப்பு', chick: 'கோழிக்குஞ்சு', brick: 'செங்கல்', bell: 'மணி', grass: 'புல்', kiss: 'முத்தம்', cliff: 'செங்குத்துப் பாறை', buzz: 'ரீங்காரம்', kitten: 'பூனைக்குட்டி', puppy: 'நாய்க்குட்டி', train: 'தொடர்வண்டி', snail: 'நத்தை', paint: 'வண்ணம் பூசு', play: 'விளையாடு', day: 'நாள்', tray: 'தட்டம்', clay: 'களிமண்', sheep: 'செம்மறியாடு', green: 'பச்சை', leaf: 'இலை', meat: 'இறைச்சி', read: 'படி', fish: 'மீன்', shell: 'சிப்பி', lunch: 'மதிய உணவு', chin: 'தாடை', three: 'மூன்று', bath: 'குளியல்', tooth: 'பல்', goat: 'ஆடு', road: 'சாலை', coat: 'மேலங்கி', snow: 'பனி', bowl: 'கிண்ணம்', yellow: 'மஞ்சள்', night: 'இரவு', light: 'வெளிச்சம்', right: 'வலது', high: 'உயரம்', bright: 'பிரகாசம்', flight: 'விமானப் பயணம்', duck: 'வாத்து', ship: 'கப்பல்' };
  window.EN_DATA = { THEMES, WORDS, AZ, SAY, CVC, DOLCH_PRE, DOLCH_PRIMER, PATTERNS, SENT, SPELL_TA };
})();
