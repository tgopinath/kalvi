// Science puzzles: life cycles, food chains and webs, sorting bins, face and body jigsaws, circuits on a grid,
// water-cycle pipes, shadow match, a plant-needs maze, space order and odd-one-out riddles.
// Every puzzle runs through the shared engine with a 3-step hint ladder (nudge, place one piece, show answer)
// and a lesson card with a real photo. Age comes only from AGE lookups (ctx.age / AGE.of(p)).
(function () {
  const { skill } = Engine, esc = Engine.esc, S = 'science';
  const shade = (c, k) => R3.shade(c, k);

  I18N.add({ spz: {
    title: ['Science puzzles', 'அறிவியல் புதிர்கள்'],
    blurb: ['Sort, build and match: life cycles, food chains, circuits and more.', 'வரிசைப்படுத்து, உருவாக்கு, பொருத்து: வாழ்க்கைச் சுழற்சி, உணவுச் சங்கிலி, மின்சுற்று மற்றும் பல.'],
    skill: { cycle: ['Life cycles', 'வாழ்க்கைச் சுழற்சி'], sort: ['Sorting bins', 'வகைப்படுத்துதல்'], face: ['Face jigsaw', 'முகப் புதிர்'], body: ['Body jigsaw', 'உடல் புதிர்'], chain: ['Food chains', 'உணவுச் சங்கிலி'], shadow: ['Shadow match', 'நிழல் பொருத்தம்'], maze: ['Plant-needs maze', 'செடித் தேவை வழிப்புதிர்'], pipes: ['Water-cycle pipes', 'நீர்ச் சுழற்சிக் குழாய்கள்'], circuit: ['Circuit puzzle', 'மின்சுற்றுப் புதிர்'], space: ['Space order', 'விண்வெளி வரிசை'], odd: ['Odd one out', 'பொருந்தாதது எது'] },
    it: {
      seed: ['seed', 'விதை'], sprout: ['sprout', 'முளை'], plant: ['young plant', 'இளம் செடி'], flower: ['flower', 'பூ'], fruit: ['fruit', 'பழம்'],
      eggs: ['eggs on a leaf', 'இலையில் முட்டைகள்'], caterpillar: ['caterpillar', 'கம்பளிப்பூச்சி'], pupa: ['pupa', 'கூட்டுப்புழு'], butterfly: ['butterfly', 'வண்ணத்துப்பூச்சி'],
      spawn: ['frog eggs', 'தவளை முட்டைகள்'], tadpole: ['tadpole', 'தலைப்பிரட்டை'], froglet: ['froglet', 'இளம் தவளை'], frog: ['frog', 'தவளை'],
      egg: ['egg', 'முட்டை'], chick: ['chick', 'கோழிக்குஞ்சு'], hen: ['hen', 'கோழி'],
      sun: ['Sun', 'சூரியன்'], grass: ['grass', 'புல்'], goat: ['goat', 'ஆடு'], tiger: ['tiger', 'புலி'], lotus: ['lotus plants', 'தாமரைச் செடிகள்'], snail: ['snail', 'நத்தை'], duck: ['duck', 'வாத்து'], leaves: ['leaves', 'இலைகள்'], rabbit: ['rabbit', 'முயல்'], fox: ['fox', 'நரி'],
      cow: ['cow', 'பசு'], tree: ['tree', 'மரம்'], dog: ['dog', 'நாய்'], ant: ['ant', 'எறும்பு'], bee: ['bee', 'தேனீ'], parrot: ['parrot', 'கிளி'], chair: ['chair', 'நாற்காலி'], ball: ['ball', 'பந்து'], cup: ['cup', 'கோப்பை'], book: ['book', 'புத்தகம்'], stone: ['stone', 'கல்'], bottle: ['empty bottle', 'காலி பாட்டில்'], clock: ['clock', 'கடிகாரம்'], car: ['car', 'கார்'], kite: ['kite', 'பட்டம்'], key: ['key', 'சாவி'], umbrella: ['umbrella', 'குடை'],
      wood: ['wooden plank', 'மரப் பலகை'], leaf: ['leaf', 'இலை'], coconut: ['coconut', 'தேங்காய்'], apple: ['apple', 'ஆப்பிள்'], boat: ['boat', 'படகு'], coin: ['coin', 'நாணயம்'], iron: ['iron nails', 'இரும்பு ஆணிகள்'], clip: ['paper clips', 'காகிதக் கிளிப்புகள்'], sand: ['sand', 'மணல்'],
      magnet: ['magnet', 'காந்தம்'], plastic: ['plastic bottles', 'பிளாஸ்டிக் பாட்டில்கள்'], glass: ['glass bottle', 'கண்ணாடி பாட்டில்'], rubber: ['rubber bands', 'ரப்பர் வளையங்கள்'], foil: ['aluminium foil', 'அலுமினியத் தாள்'], copperwire: ['copper wire', 'செப்புக் கம்பி'], cotton: ['cotton', 'பருத்தி'],
      ice: ['ice', 'பனிக்கட்டி'], sugar: ['sugar', 'சர்க்கரை'], water: ['water', 'தண்ணீர்'], milk: ['milk', 'பால்'], juice: ['juice', 'பழச்சாறு'], oil: ['oil', 'எண்ணெய்'], balloon: ['air in a balloon', 'பலூனில் உள்ள காற்று'], steam: ['steam', 'நீராவி'],
      claypot: ['clay pot', 'மண்பானை'], towel: ['towel', 'துண்டு'], lead: ['pencil lead', 'பென்சில் கரி'],
      elephant: ['elephant', 'யானை'], horse: ['horse', 'குதிரை'], zebra: ['zebra', 'வரிக்குதிரை'], yak: ['yak', 'கவரிமா'], cat: ['cat', 'பூனை'], crow: ['crow', 'காகம்'], monkey: ['monkey', 'குரங்கு'],
      brain: ['brain', 'மூளை'], lungs: ['lungs', 'நுரையீரல்கள்'], stomach: ['stomach', 'இரைப்பை'], eye: ['eye', 'கண்'], teeth: ['teeth', 'பற்கள்'], skin: ['skin', 'தோல்'],
      eyes: ['eyes', 'கண்கள்'], ears: ['ears', 'காதுகள்'], nose: ['nose', 'மூக்கு'], mouth: ['mouth', 'வாய்'],
      mercury: ['Mercury', 'புதன்'], venus: ['Venus', 'வெள்ளி'], earth: ['Earth', 'பூமி'], mars: ['Mars', 'செவ்வாய்'], jupiter: ['Jupiter', 'வியாழன்'], saturn: ['Saturn', 'சனி'], uranus: ['Uranus', 'யுரேனஸ்'], neptune: ['Neptune', 'நெப்டியூன்'],
      ph0: ['new moon', 'அமாவாசை'], ph1: ['crescent moon', 'பிறை நிலா'], ph2: ['half moon', 'அரை நிலா'], ph3: ['gibbous moon', 'முக்கால் நிலா'], ph4: ['full moon', 'முழு நிலா (பௌர்ணமி)'],
      moon: ['Moon', 'நிலா'], torch: ['torch', 'டார்ச் விளக்கு'], bulb: ['bulb', 'மின் விளக்கு'], battery: ['battery', 'மின்கலம்'], carrot: ['carrot', 'கேரட்'], potato: ['potato', 'உருளைக்கிழங்கு'], onion: ['onion', 'வெங்காயம்'], tomato: ['tomato', 'தக்காளி'], mango: ['mango', 'மாம்பழம்'], banana: ['banana', 'வாழைப்பழம்'], nest: ['nest', 'கூடு'], air: ['air', 'காற்று'], cloud: ['cloud', 'மேகம்'],
      house: ['house', 'வீடு'], star: ['star', 'நட்சத்திரம்'], sunlight: ['sunlight', 'சூரிய ஒளி'], soil: ['soil', 'மண்'], sea: ['sea', 'கடல்'], rain: ['rain', 'மழை'], river: ['river', 'ஆறு'],
    },
    bin: { living: ['Living', 'உயிருள்ளவை'], nonliving: ['Non-living', 'உயிரற்றவை'], floats: ['Floats', 'மிதப்பவை'], sinks: ['Sinks', 'மூழ்குபவை'], magnetic: ['Pulled by a magnet', 'காந்தம் இழுப்பவை'], notmag: ['Not pulled', 'காந்தம் இழுக்காதவை'], solid: ['Solid', 'திண்மம்'], liquid: ['Liquid', 'திரவம்'], gas: ['Gas', 'வாயு'], conductor: ['Conductors', 'மின்கடத்திகள்'], insulator: ['Insulators', 'மின்காப்புப் பொருள்கள்'], herb: ['Plant eaters', 'தாவர உண்ணிகள்'], carn: ['Meat eaters', 'ஊன் உண்ணிகள்'], omni: ['Eat both', 'அனைத்துண்ணிகள்'] },
    ui: {
      tray: ['Pieces', 'துண்டுகள்'], trayEmpty: ['All pieces are placed.', 'எல்லாத் துண்டுகளும் வைக்கப்பட்டன.'],
      trayHelp: ['Drag a piece to its place, or tap a piece and then tap the place.', 'ஒரு துண்டை அதன் இடத்துக்கு இழு, அல்லது துண்டைத் தட்டிப் பிறகு இடத்தைத் தட்டு.'],
      picked: ['{x} picked. Now tap where it goes.', '{x} எடுக்கப்பட்டது. இப்போது அது போகும் இடத்தைத் தட்டு.'], pickFirst: ['Tap a piece first.', 'முதலில் ஒரு துண்டைத் தட்டு.'],
      placed: ['{x} is now in {s}.', '{x} இப்போது {s} இடத்தில் உள்ளது.'], back: ['{x} is back with the pieces.', '{x} மீண்டும் துண்டுகளுடன் உள்ளது.'],
      returnTray: ['Put back', 'திரும்ப வை'], step: ['step {n}', 'படி {n}'], place: ['place {n}', 'இடம் {n}'], shadowN: ['shadow {n}', 'நிழல் {n}'], gap: ['gap {n}', 'இடைவெளி {n}'], empty: ['empty', 'காலி'],
      cycleBack: ['back to the start', 'மீண்டும் தொடக்கம்'], seeBelow: ['the finished picture below', 'கீழே உள்ள முழுப் படம்'],
      turned: ['Pipe turned.', 'குழாய் திருப்பப்பட்டது.'], tile: ['Pipe, row {r} column {c}. Tap to turn.', 'குழாய், வரிசை {r} நெடுவரிசை {c}. திருப்பத் தட்டு.'], fixed: ['{s}, cannot turn', '{s}, திருப்ப முடியாது'], flowAll: ['The water goes all the way round.', 'தண்ணீர் முழுச் சுற்றும் செல்கிறது.'], pipeTip: ['Tap a pipe to turn it. Arrow keys move between pipes.', 'குழாயைத் திருப்ப அதைத் தட்டு. அம்புக்குறி விசைகள் குழாய்களுக்கு இடையே நகர்த்தும்.'],
      up: ['Up', 'மேலே'], down: ['Down', 'கீழே'], left: ['Left', 'இடது'], right: ['Right', 'வலது'], restart: ['Start again', 'மீண்டும் தொடங்கு'],
      maze: ['Maze. Use the arrow keys or the buttons to move the sprout.', 'வழிப்புதிர். முளையை நகர்த்த அம்புக்குறி விசைகள் அல்லது பொத்தான்களைப் பயன்படுத்து.'],
      wall: ['A wall is in the way.', 'வழியில் சுவர் உள்ளது.'], moved: ['Row {r}, column {c}.', 'வரிசை {r}, நெடுவரிசை {c}.'], got: ['The sprout got {x}.', 'முளைக்கு {x} கிடைத்தது.'], atGoal: ['The sprout reached the soil.', 'முளை மண்ணை அடைந்தது.'],
      has: ['Collected: {list}', 'சேர்த்தவை: {list}'], none: ['nothing yet', 'இன்னும் எதுவும் இல்லை'], cell: ['Row {r}, column {c}', 'வரிசை {r}, நெடுவரிசை {c}'], here: ['the sprout is here', 'முளை இங்கே உள்ளது'],
      swOn: ['Switch is closed (on)', 'சுவிட்ச் மூடியுள்ளது (on)'], swOff: ['Switch is open (off)', 'சுவிட்ச் திறந்துள்ளது (off)'],
      bright: ['The bulb glows brightly.', 'பல்பு நன்றாக ஒளிர்கிறது.'], dim: ['The bulb glows only a little.', 'பல்பு கொஞ்சம் மட்டுமே ஒளிர்கிறது.'], dark: ['The bulb is dark.', 'பல்பு எரியவில்லை.'],
      webAlt: ['A food web: arrows go from the food to the animal that eats it.', 'உணவு வலை: அம்புக்குறிகள் உணவிலிருந்து அதை உண்ணும் விலங்கை நோக்கிச் செல்கின்றன.'],
    },
    q: {
      cycle: ['Put the life cycle of the {x} in order.', '{x}-இன் வாழ்க்கைச் சுழற்சியை வரிசைப்படுத்து.'], cycleYoung: ['What comes first? Put them in order.', 'எது முதலில் வரும்? வரிசையில் வை.'],
      sort2: ['Sort them: {a} or {b}?', 'பிரித்து வை: {a} அல்லது {b}?'], sort3: ['Sort them into {a}, {b} and {c}.', '{a}, {b}, {c} எனப் பிரித்து வை.'],
      face: ['Put the face back together.', 'முகத்தை உருவாக்கு.'], body: ['Put each body part in its place.', 'ஒவ்வொரு உடல் உறுப்பையும் அதன் இடத்தில் வை.'],
      chain: ['Build the food chain: who is food for whom?', 'உணவுச் சங்கிலியை உருவாக்கு: யார் யாருக்கு உணவு?'],
      shadow: ['Which object made each shadow? Match them.', 'ஒவ்வொரு நிழலும் எந்தப் பொருளுடையது? பொருத்து.'],
      maze: ['Guide the sprout to the soil. Pick up what a plant needs on the way.', 'முளையை மண்ணுக்கு அழைத்துச் செல். வழியில் செடிக்குத் தேவையானவற்றைச் சேர்.'],
      pipes: ['Turn the pipes so the water goes round the water cycle.', 'நீர்ச் சுழற்சியில் தண்ணீர் சுற்றி வரக் குழாய்களைத் திருப்பு.'],
      circuit: ['Fill the gaps so the bulb glows brightly.', 'பல்பு நன்றாக ஒளிர இடைவெளிகளை நிரப்பு.'], circuitSw: ['Fill the gaps and close the switch so the bulb glows brightly.', 'இடைவெளிகளை நிரப்பிச் சுவிட்சையும் மூடு; பல்பு நன்றாக ஒளிரட்டும்.'],
      planets: ['Put the planets in order, nearest the Sun first.', 'சூரியனுக்கு அருகில் உள்ளதை முதலில் வைத்துக் கோள்களை வரிசைப்படுத்து.'],
      moon: ['Put the Moon’s shapes in order, from new moon to full moon.', 'அமாவாசையிலிருந்து முழு நிலா வரை நிலவின் வடிவங்களை வரிசைப்படுத்து.'],
      odd: ['Which one does not belong?', 'எது பொருந்தவில்லை?'], riddle: ['Riddle: {r}', 'விடுகதை: {r}'], web: ['Look at the food web. {q}', 'உணவு வலையைப் பார். {q}'],
    },
    h: {
      one: ['One piece is placed for you: {x} in {s}.', 'உனக்காக ஒரு துண்டு வைக்கப்பட்டது: {x}, {s} இடத்தில்.'], ans: ['Here is the whole answer.', 'இதோ முழு விடை.'],
      cycle: ['Which one is the smallest and youngest? It comes first.', 'எது மிகச் சிறியது, இளையது? அது முதலில் வரும்.'],
      living: ['Ask: does it grow, eat and breathe?', 'கேள்: இது வளருமா, உண்ணுமா, மூச்சு விடுமா?'], float: ['Think: is it light for its size, or full of air?', 'யோசி: அதன் அளவுக்கு எடை குறைவா, அல்லது உள்ளே காற்று உள்ளதா?'], magnet: ['A magnet pulls only some metals, like iron.', 'காந்தம் இரும்பு போன்ற சில உலோகங்களை மட்டுமே இழுக்கும்.'],
      matter: ['Does it keep its shape, flow, or spread out to fill the space?', 'அது தன் வடிவத்தை மாற்றாதா, ஓடுமா, அல்லது இடம் முழுதும் பரவுமா?'], conduct: ['Metals let electricity flow. Most other things do not.', 'உலோகங்கள் மின்சாரத்தைக் கடத்தும். மற்ற பெரும்பாலானவை கடத்தாது.'], diet: ['Think about what each animal eats: plants, meat or both?', 'ஒவ்வொரு விலங்கும் என்ன உண்கிறது என்று யோசி: தாவரம், இறைச்சி, அல்லது இரண்டும்?'],
      face: ['The eyes go above the nose. The mouth goes below it.', 'கண்கள் மூக்குக்கு மேலே. வாய் மூக்குக்குக் கீழே.'], body: ['The brain is in the head. The lungs are in the chest.', 'மூளை தலையில் உள்ளது. நுரையீரல்கள் மார்பில் உள்ளன.'],
      chain: ['Start with the Sun or a plant. Then the animal that eats it.', 'சூரியன் அல்லது செடியிலிருந்து தொடங்கு. பிறகு அதை உண்ணும் விலங்கு.'],
      shadow: ['A shadow has the same outline as the object that blocks the light.', 'ஒளியைத் தடுக்கும் பொருளின் அதே வெளிவடிவம் நிழலுக்கும் இருக்கும்.'],
      maze: ['A plant needs {list}. Visit them all before the soil.', 'செடிக்கு {list} தேவை. மண்ணுக்குச் செல்லும் முன் அனைத்தையும் சேர்.'], mazeOne: ['The sprout has walked to the first thing it needs: {x}.', 'முளை தனக்குத் தேவையான முதல் பொருளான {x} வரை நடந்துள்ளது.'], mazeAns: ['The whole path is shown on the maze. Press Check.', 'முழு வழியும் வழிப்புதிரில் காட்டப்பட்டுள்ளது. சரிபார் அழுத்து.'],
      pipes: ['Start at the sea. The Sun heats it, so the water rises to the cloud.', 'கடலில் தொடங்கு. சூரியன் சூடாக்குவதால் நீர் மேகத்துக்கு மேலே செல்கிறது.'], pipesOne: ['One pipe is turned for you.', 'உனக்காக ஒரு குழாய் திருப்பப்பட்டது.'], pipesAns: ['All the pipes are turned: sea, cloud, rain, river, and back to the sea.', 'எல்லாக் குழாய்களும் திருப்பப்பட்டன: கடல், மேகம், மழை, ஆறு, மீண்டும் கடல்.'],
      circuit: ['Electricity needs a full loop made of things it can flow through, like metal.', 'மின்சாரம் ஓட, உலோகம் போல அதைக் கடத்தும் பொருள்களால் ஆன முழுச் சுற்று வேண்டும்.'], circuitSw: ['Also close the switch.', 'சுவிட்சையும் மூடு.'],
      planets: ['Mercury is closest to the Sun. Earth is the third planet.', 'புதன் சூரியனுக்கு மிக அருகில் உள்ளது. பூமி மூன்றாவது கோள்.'], moon: ['After the new moon, the bright part grows a little every night.', 'அமாவாசைக்குப் பிறகு ஒளிரும் பகுதி ஒவ்வொரு இரவும் சிறிது வளரும்.'],
      odd: ['Three of them are alike in one way. Find the one that is different.', 'மூன்று ஏதோ ஒரு வகையில் ஒன்றுபோல் உள்ளன. வேறுபட்டதைக் கண்டுபிடி.'], riddle: ['Read each clue and rule out what does not fit.', 'ஒவ்வொரு குறிப்பையும் படித்துப் பொருந்தாதவற்றை நீக்கு.'], web: ['Follow the arrows from {x}: who eats it, and what does it eat?', '{x}-இலிருந்து அம்புக்குறிகளைப் பின்தொடர்: அதை யார் உண்கிறார்கள், அது எதை உண்கிறது?'],
      notIt: ['It is not “{x}”.', 'அது “{x}” அல்ல.'], isIt: ['The answer is “{x}”.', 'விடை “{x}”.'],
    },
    y: {
      list: ['{s}: {list}.', '{s}: {list}.'], chainList: ['{list}: each one is food for the next.', '{list}: ஒவ்வொன்றும் அடுத்ததற்கு உணவு.'],
      cycleRule: ['A life cycle goes round: the last stage makes the first one again.', 'வாழ்க்கைச் சுழற்சி சுற்றி வரும்: கடைசி நிலை மீண்டும் முதல் நிலையை உருவாக்கும்.'],
      plant: [['A seed needs water, air and warmth to sprout.', 'விதை முளைக்க நீர், காற்று, வெப்பம் தேவை.'], ['The sprout grows roots and leaves and becomes a plant.', 'முளை வேர்களையும் இலைகளையும் வளர்த்துச் செடியாகிறது.'], ['The plant flowers. A flower becomes a fruit with new seeds inside.', 'செடி பூக்கிறது. பூ, உள்ளே புதிய விதைகளுடன் பழமாகிறது.']],
      butterfly: [['A butterfly lays tiny eggs on a leaf.', 'வண்ணத்துப்பூச்சி இலையில் சிறிய முட்டைகளை இடுகிறது.'], ['A caterpillar hatches, eats leaves and grows.', 'முட்டையிலிருந்து கம்பளிப்பூச்சி வெளிவந்து இலைகளைத் தின்று வளர்கிறது.'], ['Inside the pupa it changes completely, then a butterfly comes out. This change is called metamorphosis.', 'கூட்டுப்புழுவுக்குள் அது முழுவதும் மாறுகிறது; பிறகு வண்ணத்துப்பூச்சி வெளிவருகிறது. இந்த மாற்றம் உருமாற்றம் (metamorphosis) எனப்படும்.']],
      frog: [['A frog lays its eggs in water, wrapped in jelly.', 'தவளை நீரில், கூழ் போன்ற பொருளில் சுற்றிய முட்டைகளை இடுகிறது.'], ['A tadpole hatches. It lives in water and breathes with gills.', 'தலைப்பிரட்டை வெளிவருகிறது. அது நீரில் வாழ்ந்து செவுள்களால் மூச்சு விடுகிறது.'], ['It grows legs and loses its tail: first a froglet, then a frog that can live on land too.', 'அதற்குக் கால்கள் முளைத்து வால் மறைகிறது: முதலில் இளம் தவளை, பிறகு நிலத்திலும் வாழும் தவளை.']],
      hen: [['A hen lays an egg and sits on it to keep it warm.', 'கோழி முட்டையிட்டு, அதன் மேல் அமர்ந்து சூடாக அடைகாக்கிறது.'], ['After about 21 days a chick hatches.', 'சுமார் 21 நாட்களில் குஞ்சு பொரிக்கிறது.'], ['The chick grows into a hen that lays eggs of its own.', 'குஞ்சு வளர்ந்து தானும் முட்டையிடும் கோழியாகிறது.']],
      living: ['Living things grow, need food and water, breathe and have young. Non-living things do not.', 'உயிருள்ளவை வளரும்; உணவும் நீரும் தேவை; மூச்சு விடும்; சந்ததியை உருவாக்கும். உயிரற்றவை இவற்றைச் செய்வதில்லை.'],
      float: ['Things that are light for their size, or have air inside, float. Heavy, solid things like stones and metal sink.', 'அளவுக்கு எடை குறைந்தவை, அல்லது உள்ளே காற்று உள்ளவை மிதக்கும். கல், உலோகம் போன்ற கனமானவை மூழ்கும்.'],
      magnet: ['A magnet pulls things made of iron or steel. Copper, aluminium, wood and plastic are not pulled.', 'காந்தம் இரும்பு அல்லது எஃகால் ஆனவற்றை இழுக்கும். செம்பு, அலுமினியம், மரம், பிளாஸ்டிக் ஆகியவற்றை இழுக்காது.'],
      matter: ['A solid keeps its own shape. A liquid flows and takes the shape of its container. A gas spreads out to fill all the space.', 'திண்மம் தன் வடிவத்தை மாற்றாது. திரவம் ஓடிப் பாத்திரத்தின் வடிவத்தை எடுக்கும். வாயு எல்லா இடத்தையும் நிரப்பப் பரவும்.'],
      conduct: ['Metals such as copper, iron and aluminium let electricity flow: they are conductors. Wood, plastic, rubber, glass and cotton stop it: they are insulators.', 'செம்பு, இரும்பு, அலுமினியம் போன்ற உலோகங்கள் மின்சாரத்தைக் கடத்தும்: இவை மின்கடத்திகள். மரம், பிளாஸ்டிக், ரப்பர், கண்ணாடி, பருத்தி அதைத் தடுக்கும்: இவை மின்காப்புப் பொருள்கள்.'],
      diet: ['Plant eaters eat only plants. Meat eaters eat other animals. Some animals eat both.', 'தாவர உண்ணிகள் தாவரங்களை மட்டும் உண்ணும். ஊன் உண்ணிகள் மற்ற விலங்குகளை உண்ணும். சில விலங்குகள் இரண்டையும் உண்ணும்.'],
      livingRule: ['Ask three questions: does it grow, eat and breathe?', 'மூன்று கேள்விகள் கேள்: வளருமா, உண்ணுமா, மூச்சு விடுமா?'], floatRule: ['Try it at home with a bucket of water.', 'வீட்டில் ஒரு வாளித் தண்ணீரில் முயன்று பார்.'], magnetRule: ['Not every metal is magnetic: iron, steel, nickel and cobalt are.', 'எல்லா உலோகமும் காந்தத்தால் இழுக்கப்படுவதில்லை: இரும்பு, எஃகு, நிக்கல், கோபால்ட் மட்டுமே.'],
      matterRule: ['Sugar and sand pour, but each grain is a tiny solid.', 'சர்க்கரையும் மணலும் கொட்டும்; ஆனால் ஒவ்வொரு துகளும் சிறிய திண்மமே.'], conductRule: ['That is why wires are copper inside and plastic outside.', 'அதனால்தான் கம்பிகளின் உள்ளே செம்பும் வெளியே பிளாஸ்டிக்கும் உள்ளன.'], dietRule: ['Flat teeth grind plants; sharp teeth tear meat.', 'தட்டையான பற்கள் தாவரங்களை அரைக்கும்; கூர்மையான பற்கள் இறைச்சியைக் கிழிக்கும்.'],
      face: [['We see with our eyes and hear with our ears.', 'நாம் கண்களால் பார்க்கிறோம், காதுகளால் கேட்கிறோம்.'], ['We smell with the nose and taste with the mouth.', 'மூக்கால் மணத்தை உணர்கிறோம், வாயால் சுவையை உணர்கிறோம்.']], faceRule: ['These are sense organs: they tell us about the world.', 'இவை புலன் உறுப்புகள்: உலகைப் பற்றி நமக்குச் சொல்கின்றன.'],
      organ: { brain: ['The brain, inside the skull, controls the body and helps you think.', 'மண்டை ஓட்டுக்குள் உள்ள மூளை உடலைக் கட்டுப்படுத்திச் சிந்திக்க உதவுகிறது.'], eye: ['The eyes let light in so you can see.', 'கண்கள் ஒளியை உள்ளே விட்டுப் பார்க்க உதவுகின்றன.'], teeth: ['Teeth in the mouth bite and chew food.', 'வாயில் உள்ள பற்கள் உணவைக் கடித்து மெல்லுகின்றன.'], lungs: ['Two lungs in the chest take in air when you breathe.', 'மார்பில் உள்ள இரண்டு நுரையீரல்கள் மூச்சு விடும்போது காற்றை உள்ளிழுக்கின்றன.'], stomach: ['The stomach, just below the ribs, churns food to digest it.', 'விலா எலும்புகளுக்குச் சற்றுக் கீழே உள்ள இரைப்பை உணவைக் கலக்கிச் செரிக்க வைக்கிறது.'], skin: ['Skin covers the whole body and protects it.', 'தோல் உடல் முழுவதையும் மூடிப் பாதுகாக்கிறது.'] },
      bodyRule: ['The organs work together to keep you alive and well.', 'உறுப்புகள் ஒன்றாக வேலை செய்து உன்னை நலமாக வைக்கின்றன.'],
      chainSun: ['Plants use sunlight to make their own food.', 'தாவரங்கள் சூரிய ஒளியைக் கொண்டு தங்கள் உணவைத் தாமே தயாரிக்கின்றன.'], chainTop: ['The {x} is at the top: nothing in this chain eats it.', '{x} உச்சியில் உள்ளது: இந்தச் சங்கிலியில் அதை எதுவும் உண்பதில்லை.'], chainRule: ['The arrow points from the food to the eater: it shows where the energy goes.', 'அம்புக்குறி உணவிலிருந்து உண்பதை நோக்கிச் செல்லும்: ஆற்றல் செல்லும் வழியைக் காட்டுகிறது.'],
      webRule: ['In a food web every living thing is linked: change one and the others change too.', 'உணவு வலையில் எல்லா உயிர்களும் இணைந்துள்ளன: ஒன்று மாறினால் மற்றவையும் மாறும்.'],
      shadow: [['Light travels in straight lines.', 'ஒளி நேர்கோட்டில் செல்கிறது.'], ['An object that light cannot pass through blocks it, and a dark shape with the same outline forms behind it.', 'ஒளி ஊடுருவ முடியாத பொருள் அதைத் தடுக்கிறது; அதன் பின்னால் அதே வெளிவடிவில் இருண்ட நிழல் உருவாகிறது.']], shadowRule: ['A shadow shows the outline, not the colour.', 'நிழல் வெளிவடிவத்தைக் காட்டும், நிறத்தைக் காட்டாது.'],
      maze: [['Plants need water, sunlight and air to make their food.', 'தாவரங்கள் உணவு தயாரிக்க நீர், சூரிய ஒளி, காற்று தேவை.'], ['Roots take water from the soil. Leaves take in air and sunlight.', 'வேர்கள் மண்ணிலிருந்து நீரை எடுக்கின்றன. இலைகள் காற்றையும் சூரிய ஒளியையும் பெறுகின்றன.']], mazeRule: ['This food-making is called photosynthesis.', 'இந்த உணவு தயாரிப்பு ஒளிச்சேர்க்கை (photosynthesis) எனப்படும்.'],
      pipes: [['The Sun heats the sea and water rises as vapour (evaporation).', 'சூரியன் கடலைச் சூடாக்க, நீர் ஆவியாக மேலே செல்கிறது (ஆவியாதல்).'], ['High up it cools into tiny drops that make clouds (condensation).', 'மேலே குளிர்ந்து சிறு துளிகளாகி மேகம் ஆகிறது (ஆவி சுருங்குதல்).'], ['The drops join and fall as rain. Rivers carry the water back to the sea.', 'துளிகள் சேர்ந்து மழையாகப் பெய்கின்றன. ஆறுகள் நீரை மீண்டும் கடலுக்குக் கொண்டு செல்கின்றன.']], pipesRule: ['The same water goes round and round: this is the water cycle.', 'அதே நீர் சுற்றிச் சுற்றி வருகிறது: இதுவே நீர்ச் சுழற்சி.'],
      circuit: [['Electricity flows from the battery, through the wires and the bulb, and back to the battery.', 'மின்சாரம் மின்கலத்திலிருந்து கம்பிகள், பல்பு வழியாக மீண்டும் மின்கலத்துக்குப் பாய்கிறது.'], ['{list} let electricity through, so the loop is complete.', '{list} மின்சாரத்தைக் கடத்துவதால் சுற்று முழுமையாகிறது.'], ['Rubber, wood and plastic break the loop. Pencil lead lets only a little through, so the bulb is dim.', 'ரப்பர், மரம், பிளாஸ்டிக் சுற்றை உடைக்கின்றன. பென்சில் கரி கொஞ்சம் மட்டுமே கடத்துவதால் பல்பு மங்கலாக எரியும்.']], circuitRule: ['A switch opens and closes the loop.', 'சுவிட்ச் சுற்றைத் திறந்து மூடுகிறது.'],
      planets: [['Mercury, Venus, Earth and Mars are small rocky planets close to the Sun.', 'புதன், வெள்ளி, பூமி, செவ்வாய் ஆகியவை சூரியனுக்கு அருகில் உள்ள சிறிய பாறைக் கோள்கள்.'], ['Jupiter and Saturn are giants made mostly of gas. Uranus and Neptune are icy giants far away.', 'வியாழனும் சனியும் பெரும்பாலும் வாயுவால் ஆன பெருங்கோள்கள். யுரேனஸ், நெப்டியூன் தொலைவில் உள்ள பனிப் பெருங்கோள்கள்.']], planetsRule: ['The farther a planet is, the longer it takes to go round the Sun.', 'கோள் எவ்வளவு தொலைவில் உள்ளதோ, சூரியனைச் சுற்ற அவ்வளவு நாள் ஆகும்.'],
      moon: [['The Moon does not make its own light. The Sun lights half of it.', 'நிலவு தானாக ஒளி தருவதில்லை. சூரியன் அதன் பாதியை ஒளிரச் செய்கிறது.'], ['As the Moon goes round the Earth, we see more of its lit half each night, until full moon.', 'நிலவு பூமியைச் சுற்றும்போது, முழு நிலா வரை ஒவ்வொரு இரவும் அதன் ஒளிரும் பாதியை அதிகமாகப் பார்க்கிறோம்.']], moonRule: ['From new moon to full moon takes about 15 days.', 'அமாவாசையிலிருந்து முழு நிலா வரை சுமார் 15 நாட்கள் ஆகும்.'],
    },
    odd: {
      diet: ['The cow, goat and horse eat plants. The tiger eats meat.', 'பசு, ஆடு, குதிரை தாவரங்களை உண்கின்றன. புலி இறைச்சி உண்கிறது.'],
      fruit: ['Apples, mangoes and bananas are fruits that grow on plants. A chair is made by people.', 'ஆப்பிள், மாம்பழம், வாழைப்பழம் தாவரங்களில் விளையும் பழங்கள். நாற்காலி மனிதர்கள் செய்தது.'],
      bird: ['The hen, parrot and crow are birds with feathers and wings. A dog has fur.', 'கோழி, கிளி, காகம் இறகுகளும் இறக்கைகளும் உள்ள பறவைகள். நாய்க்கு முடி உள்ளது.'],
      insect: ['Butterflies, bees and ants are insects with six legs. A cow has four legs.', 'வண்ணத்துப்பூச்சி, தேனீ, எறும்பு ஆறு கால்கள் உள்ள பூச்சிகள். பசுவுக்கு நான்கு கால்கள்.'],
      light: ['The Sun, a torch and a bulb make their own light. The Moon only reflects sunlight.', 'சூரியன், டார்ச், மின் விளக்கு தாமாக ஒளி தருகின்றன. நிலா சூரிய ஒளியைப் பிரதிபலிக்கிறது மட்டுமே.'],
      under: ['Carrots, potatoes and onions grow under the soil. Tomatoes grow above it.', 'கேரட், உருளைக்கிழங்கு, வெங்காயம் மண்ணுக்கு அடியில் வளர்கின்றன. தக்காளி மண்ணுக்கு மேலே வளர்கிறது.'],
      sink: ['A stone, a coin and a key sink in water. A ball floats.', 'கல், நாணயம், சாவி நீரில் மூழ்கும். பந்து மிதக்கும்.'],
    },
    rid: {
      tree: [['I have roots, a stem and leaves. I cannot walk, but I make my own food from sunlight. What am I?', 'எனக்கு வேர், தண்டு, இலைகள் உண்டு. நடக்க முடியாது; ஆனால் சூரிய ஒளியால் என் உணவை நானே தயாரிப்பேன். நான் யார்?'], ['Only green plants make their own food from sunlight, air and water.', 'பச்சைத் தாவரங்கள் மட்டுமே சூரிய ஒளி, காற்று, நீரைக் கொண்டு தங்கள் உணவைத் தயாரிக்கின்றன.']],
      water: [['I am a liquid in a glass, a solid in the freezer and a gas when you boil me. What am I?', 'குவளையில் திரவம், உறைவிப்பானில் திண்மம், கொதிக்க வைத்தால் வாயு. நான் யார்?'], ['Water is the one thing we often see as a solid (ice), a liquid and a gas (steam).', 'திண்மம் (பனிக்கட்டி), திரவம், வாயு (நீராவி) என மூன்று நிலைகளிலும் நாம் அடிக்கடி பார்ப்பது தண்ணீரைத்தான்.']],
      magnet: [['I pull iron nails towards me, but not copper wire. What am I?', 'இரும்பு ஆணிகளை என் பக்கம் இழுப்பேன்; செப்புக் கம்பியை இழுக்க மாட்டேன். நான் யார்?'], ['A magnet pulls iron and steel, but not copper.', 'காந்தம் இரும்பையும் எஃகையும் இழுக்கும்; செம்பை இழுக்காது.']],
      sun: [['I give out my own light, and the Earth goes round me once a year. What am I?', 'நான் தானாக ஒளி தருகிறேன்; பூமி ஆண்டுக்கு ஒருமுறை என்னைச் சுற்றுகிறது. நான் யார்?'], ['The Sun is a star: it makes its own light and heat.', 'சூரியன் ஒரு நட்சத்திரம்: அது தானாக ஒளியும் வெப்பமும் தருகிறது.']],
      copper: [['Electricity flows through me easily, so I am used inside wires. What am I?', 'மின்சாரம் என் வழியே எளிதாகப் பாயும்; அதனால் கம்பிகளின் உள்ளே நான் இருக்கிறேன். நான் யார்?'], ['Copper is a very good conductor of electricity.', 'செம்பு மிகச் சிறந்த மின்கடத்தி.']],
      pupa: [['A caterpillar goes inside me and comes out as a butterfly. What am I?', 'கம்பளிப்பூச்சி எனக்குள் சென்று வண்ணத்துப்பூச்சியாக வெளிவருகிறது. நான் யார்?'], ['Inside the pupa the caterpillar changes into a butterfly.', 'கூட்டுப்புழுவுக்குள் கம்பளிப்பூச்சி வண்ணத்துப்பூச்சியாக மாறுகிறது.']],
      saturn: [['I am a planet with bright rings of ice and rock around me. What am I?', 'என்னைச் சுற்றிப் பனி, பாறையால் ஆன ஒளிரும் வளையங்கள் உள்ள கோள் நான். நான் யார்?'], ['Saturn’s rings are made of billions of pieces of ice and rock.', 'சனியின் வளையங்கள் கோடிக்கணக்கான பனி, பாறைத் துண்டுகளால் ஆனவை.']],
      lungs: [['I am in your chest. I fill with air every time you breathe in. What am I?', 'நான் உன் மார்பில் இருக்கிறேன். நீ மூச்சை உள்ளிழுக்கும் ஒவ்வொரு முறையும் காற்றால் நிரம்புவேன். நான் யார்?'], ['The lungs take in air so the body gets oxygen.', 'உடலுக்கு ஆக்சிஜன் கிடைக்க நுரையீரல்கள் காற்றை உள்ளிழுக்கின்றன.']],
    },
    web: {
      rabbit: { q: ['If all the rabbits disappeared, what would happen to the foxes?', 'எல்லா முயல்களும் மறைந்துவிட்டால், நரிகளுக்கு என்ன ஆகும்?'], o: [['They would have less food and hunt more hens.', 'அவற்றுக்கு உணவு குறையும்; அதிகக் கோழிகளை வேட்டையாடும்.'], ['They would start eating grass.', 'அவை புல்லைத் தின்னத் தொடங்கும்.'], ['Nothing would change for them.', 'அவற்றுக்கு எதுவும் மாறாது.'], ['There would be many more foxes.', 'நரிகள் மிக அதிகமாகும்.']], why: ['Foxes eat rabbits and hens. With no rabbits, they eat more hens, so there are fewer hens too.', 'நரிகள் முயல்களையும் கோழிகளையும் உண்கின்றன. முயல் இல்லாவிட்டால் அதிகக் கோழிகளை உண்ணும்; அதனால் கோழிகளும் குறையும்.'] },
      tiger: { q: ['If the tigers disappeared, what would happen to the goats first?', 'புலிகள் மறைந்துவிட்டால், முதலில் ஆடுகளுக்கு என்ன ஆகும்?'], o: [['There would be more goats, eating more grass and leaves.', 'ஆடுகள் அதிகமாகி, அதிகப் புல்லையும் இலைகளையும் தின்னும்.'], ['The goats would disappear too.', 'ஆடுகளும் மறைந்துவிடும்.'], ['The goats would start eating rabbits.', 'ஆடுகள் முயல்களைத் தின்னத் தொடங்கும்.'], ['Nothing would change.', 'எதுவும் மாறாது.']], why: ['Tigers keep the number of goats in check. Without them, goats grow in number and eat more plants.', 'புலிகள் ஆடுகளின் எண்ணிக்கையைக் கட்டுக்குள் வைக்கின்றன. புலி இல்லாவிட்டால் ஆடுகள் பெருகி அதிகத் தாவரங்களைத் தின்னும்.'] },
      caterpillar: { q: ['If the caterpillars disappeared, who would go hungry first?', 'கம்பளிப்பூச்சிகள் மறைந்துவிட்டால், முதலில் பசியால் வாடுவது யார்?'], o: [['The hens', 'கோழிகள்'], ['The tigers', 'புலிகள்'], ['The goats', 'ஆடுகள்'], ['The grass', 'புல்']], why: ['In this web, hens eat caterpillars. Tigers and goats do not.', 'இந்த வலையில் கோழிகள் கம்பளிப்பூச்சிகளை உண்கின்றன. புலிகளும் ஆடுகளும் உண்பதில்லை.'] },
      plants: { q: ['If all the grass and leaves disappeared, which animals would be in trouble?', 'எல்லாப் புல்லும் இலைகளும் மறைந்துவிட்டால், எந்த விலங்குகள் சிக்கலில் மாட்டும்?'], o: [['All of them, because every chain starts with plants.', 'அனைத்தும், ஏனெனில் ஒவ்வொரு சங்கிலியும் தாவரங்களில்தான் தொடங்குகிறது.'], ['Only the rabbits', 'முயல்கள் மட்டும்'], ['Only the tigers', 'புலிகள் மட்டும்'], ['None of them', 'எதுவும் இல்லை']], why: ['Plant eaters would starve first, and then the animals that eat them.', 'முதலில் தாவர உண்ணிகள் பட்டினியாகும்; பிறகு அவற்றை உண்ணும் விலங்குகளும்.'] },
    },
  } });

  const nm = k => t('spz.it.' + k);
  const pair = p => p[I18N.lang === 'ta' ? 1 : 0];
  const IMG = { sun: 'sunpic', leaves: 'leaf', lotus: 'pond', sprout: 'greengram', flower: 'flower2' };
  function photoOf(k) { const p = SCIENCE.photo(IMG[k] || k); return p ? { ...p, alt: nm(k) } : null; }
  const anyPhoto = (...ks) => { for (const k of ks) { const p = photoOf(k); if (p) return p; } return photoOf('leaf'); };

  // ---------- crisp drawings for pieces without a vetted photo ----------
  const sv = (inner, vb = '0 0 100 100') => `<svg class="spz-svg" viewBox="${vb}" aria-hidden="true" focusable="false">${inner}</svg>`;
  const rg = (id, c) => `<defs><radialGradient id="${id}" cx="36%" cy="30%" r="75%"><stop offset="0" stop-color="${shade(c, .5)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -.45)}"/></radialGradient></defs>`;
  const bg = c => `<rect width="100" height="100" fill="${c}"/>`, flr = `<ellipse cx="50" cy="90" rx="30" ry="5" fill="#000" opacity=".18"/>`;
  const glass = (id, c) => sv(bg('#eef1f5') + flr + `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(c, -.2)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -.3)}"/></linearGradient></defs><path d="M30 40 L70 40 L66 88 Q50 92 34 88Z" fill="url(#${id})"/><path d="M26 14 L74 14 L66 88 Q50 92 34 88Z" fill="none" stroke="#8a93a3" stroke-width="2.5"/><path d="M33 20 L36 80" stroke="#fff" stroke-width="3" opacity=".55"/>`);
  const ball3 = (id, c) => sv(bg('#0e1422') + rg(id, c) + `<circle cx="50" cy="50" r="34" fill="url(#${id})"/>`);
  const phase = a => sv(`<rect width="100" height="100" fill="#141826"/>` + SIMS.SIMS.moon.phaseSvg(a, 50, 50, 36));
  const DRAW = {
    egg: () => sv(bg('#e9edf2') + rg('spzEgg', '#efe2cc') + flr + `<ellipse cx="50" cy="54" rx="25" ry="33" fill="url(#spzEgg)"/>`),
    eggs: () => sv(bg('#e9f0e4') + rg('spzLf', '#4f9a4a') + `<path d="M8 74 Q36 18 92 24 Q74 84 8 74Z" fill="url(#spzLf)"/><path d="M8 74 Q52 50 92 24" stroke="#2f6b2c" stroke-width="2" fill="none"/>` + [[42, 52], [53, 46], [48, 60], [60, 54], [64, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#f6efd4" stroke="#a99d70" stroke-width="1"/>`).join('')),
    caterpillar: () => sv(bg('#eef3e6') + rg('spzCat', '#7cbf3a') + rg('spzCatH', '#4f7f22') + flr + [0, 1, 2, 3, 4].map(i => `<circle cx="${16 + i * 13}" cy="${62 - (i === 2 ? 8 : i === 1 || i === 3 ? 4 : 0)}" r="11" fill="url(#spzCat)"/>`).join('') + `<circle cx="82" cy="56" r="12" fill="url(#spzCatH)"/><path d="M80 45 L76 34 M86 45 L90 34" stroke="#2b2f38" stroke-width="2" stroke-linecap="round"/>`),
    pupa: () => sv(bg('#eef0e6') + `<defs><linearGradient id="spzPu" x1="0" x2="1"><stop offset="0" stop-color="#6f8f34"/><stop offset=".45" stop-color="#a9c86a"/><stop offset="1" stop-color="#5a7628"/></linearGradient></defs><path d="M20 8 H80" stroke="#7a5a32" stroke-width="5" stroke-linecap="round"/><path d="M50 8 V20" stroke="#6b5a3a" stroke-width="2"/><path d="M50 20 C70 28 72 66 50 92 C28 66 30 28 50 20Z" fill="url(#spzPu)"/><path d="M38 44 Q50 48 62 44 M37 58 Q50 62 63 58 M40 72 Q50 75 60 72" stroke="#55702a" stroke-width="1.5" fill="none"/>`),
    spawn: () => sv(bg('#dfeaf0') + [[34, 38], [50, 34], [66, 40], [28, 54], [44, 52], [60, 56], [74, 56], [38, 68], [54, 70], [68, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#cfe6f2" stroke="#8fb3c6" stroke-width="1" opacity=".9"/><circle cx="${x}" cy="${y}" r="3" fill="#1f232b"/>`).join('')),
    tadpole: () => sv(bg('#dde9ef') + rg('spzTd', '#3d4350') + `<path d="M50 52 Q64 40 74 52 T96 50" stroke="#3d4350" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="36" cy="52" rx="18" ry="15" fill="url(#spzTd)"/>`),
    froglet: () => sv(bg('#e3eee2') + rg('spzFl', '#5aa046') + flr + `<path d="M64 66 Q86 70 92 82" stroke="#4d8a3a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M26 74 L16 86 M74 74 L84 86" stroke="#4d8a3a" stroke-width="6" stroke-linecap="round"/><ellipse cx="50" cy="62" rx="26" ry="18" fill="url(#spzFl)"/><circle cx="40" cy="45" r="7" fill="url(#spzFl)"/><circle cx="60" cy="45" r="7" fill="url(#spzFl)"/><circle cx="40" cy="44" r="2.5" fill="#1f232b"/><circle cx="60" cy="44" r="2.5" fill="#1f232b"/>`),
    chick: () => sv(bg('#f2efe6') + rg('spzCh', '#f2c94c') + flr + `<path d="M42 82 V90 M56 82 V90" stroke="#e08a2a" stroke-width="3"/><ellipse cx="50" cy="64" rx="24" ry="20" fill="url(#spzCh)"/><circle cx="62" cy="38" r="14" fill="url(#spzCh)"/><path d="M75 38 L86 42 L75 45Z" fill="#e08a2a"/><circle cx="65" cy="35" r="2.2" fill="#1f232b"/>`),
    plant: () => sv(bg('#eef1e8') + rg('spzLv', '#4f9a4a') + `<ellipse cx="50" cy="86" rx="34" ry="8" fill="#7a5a3a"/><path d="M50 86 V30" stroke="#3f7a35" stroke-width="4"/><ellipse cx="36" cy="56" rx="15" ry="7" transform="rotate(-25 36 56)" fill="url(#spzLv)"/><ellipse cx="64" cy="46" rx="15" ry="7" transform="rotate(25 64 46)" fill="url(#spzLv)"/><ellipse cx="42" cy="32" rx="11" ry="5.5" transform="rotate(-35 42 32)" fill="url(#spzLv)"/><ellipse cx="58" cy="26" rx="10" ry="5" transform="rotate(30 58 26)" fill="url(#spzLv)"/>`),
    grass: () => sv(bg('#e8f0e0') + `<defs><linearGradient id="spzGr" y1="0" y2="1" x1="0" x2="0"><stop offset="0" stop-color="#8fd06a"/><stop offset="1" stop-color="#2f6b2c"/></linearGradient></defs><rect x="0" y="82" width="100" height="18" fill="#7a5a3a"/>` + [10, 20, 30, 40, 50, 60, 70, 80, 90].map((x, i) => `<path d="M${x - 4} 84 Q${x + (i % 2 ? 6 : -6)} 50 ${x + (i % 2 ? 2 : -3)} ${18 + (i * 7) % 22} Q${x + 2} 50 ${x + 4} 84Z" fill="url(#spzGr)"/>`).join('')),
    water: () => glass('spzWa', '#7cc4ef'), milk: () => glass('spzMi', '#f4f1e8'), juice: () => glass('spzJu', '#f39a2b'),
    balloon: () => sv(bg('#eef1f5') + rg('spzBa', '#e2574c') + `<path d="M50 78 Q44 88 52 96" stroke="#5b6275" stroke-width="1.5" fill="none"/><ellipse cx="50" cy="42" rx="26" ry="32" fill="url(#spzBa)"/><path d="M46 74 L54 74 L50 79Z" fill="#b8402f"/>`),
    steam: () => sv(bg('#eef1f5') + rg('spzKt', '#9aa3b2') + flr + `<path d="M28 56 H72 V80 Q72 88 64 88 H36 Q28 88 28 80Z" fill="url(#spzKt)"/><path d="M72 62 Q86 62 84 74" stroke="#7a8291" stroke-width="5" fill="none"/>` + [38, 50, 62].map(x => `<path d="M${x} 50 q-6 -8 0 -16 t0 -16" stroke="#b9c3d1" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')),
    lead: () => sv(bg('#eef1f5') + `<g transform="rotate(-30 50 50)"><rect x="14" y="42" width="56" height="16" fill="#f2c94c"/><rect x="14" y="42" width="56" height="5" fill="#f7dc7e"/><rect x="6" y="42" width="10" height="16" fill="#e7a0a0"/><path d="M70 42 L88 50 L70 58Z" fill="#e8c9a0"/><path d="M82 47.5 L90 50 L82 52.5Z" fill="#2b2f38"/></g>`),
    uranus: () => ball3('spzUr', '#8fd3dc'), neptune: () => ball3('spzNe', '#3f62c9'),
    ph0: () => phase(0), ph1: () => phase(45), ph2: () => phase(90), ph3: () => phase(135), ph4: () => phase(180),
    eyes: () => sv(bg('#f3e6dc') + [32, 68].map(x => `<path d="M${x - 16} 50 Q${x} 34 ${x + 16} 50 Q${x} 66 ${x - 16} 50Z" fill="#fff" stroke="#8a5a3a" stroke-width="2"/><circle cx="${x}" cy="50" r="7" fill="#5a3a22"/><circle cx="${x}" cy="50" r="3" fill="#111"/>`).join('')),
    ears: () => sv(bg('#f3e6dc') + [26, 74].map((x, i) => `<path d="M${x} 28 Q${x + (i ? 16 : -16)} 30 ${x + (i ? 14 : -14)} 50 Q${x + (i ? 12 : -12)} 70 ${x} 72" fill="#d49a70" stroke="#8a5a3a" stroke-width="2"/><path d="M${x + (i ? 3 : -3)} 38 Q${x + (i ? 9 : -9)} 44 ${x + (i ? 4 : -4)} 58" stroke="#8a5a3a" stroke-width="2" fill="none"/>`).join('')),
    nose: () => sv(bg('#f3e6dc') + `<path d="M50 18 Q46 52 34 66 Q42 76 50 72 Q58 76 66 66 Q54 52 50 18Z" fill="#d49a70" stroke="#8a5a3a" stroke-width="2"/><circle cx="43" cy="68" r="3" fill="#6a4026"/><circle cx="57" cy="68" r="3" fill="#6a4026"/>`),
    mouth: () => sv(bg('#f3e6dc') + `<path d="M16 50 Q32 34 50 42 Q68 34 84 50 Q50 82 16 50Z" fill="#c0504d" stroke="#8a2f2d" stroke-width="2"/><path d="M16 50 Q50 58 84 50" stroke="#8a2f2d" stroke-width="2" fill="none"/>`),
    sunlight: () => sv(rg('spzSu', '#f6c56b') + [...Array(8)].map((_, i) => { const a = i * Math.PI / 4; return `<path d="M${50 + Math.cos(a) * 30} ${50 + Math.sin(a) * 30} L${50 + Math.cos(a) * 42} ${50 + Math.sin(a) * 42}" stroke="#f6c56b" stroke-width="6" stroke-linecap="round"/>`; }).join('') + `<circle cx="50" cy="50" r="22" fill="url(#spzSu)"/>`),
    drop: () => sv(rg('spzDr', '#5fb3e6') + `<path d="M50 12 C66 36 76 50 76 64 A26 26 0 0 1 24 64 C24 50 34 36 50 12Z" fill="url(#spzDr)"/>`),
    air: () => sv(`<g fill="none" stroke="#d9e6f2" stroke-width="6" stroke-linecap="round"><path d="M14 38 H62 a10 10 0 1 0 -10 -10"/><path d="M14 56 H76 a10 10 0 1 1 -10 10"/><path d="M22 74 H48"/></g>`),
    soil: () => sv(`<ellipse cx="50" cy="66" rx="40" ry="20" fill="#7a5a3a"/><ellipse cx="50" cy="60" rx="34" ry="14" fill="#946c45"/>` + [[36, 58], [52, 54], [62, 62], [44, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#5e4229"/>`).join('')),
    sproutIcon: () => sv(rg('spzSp', '#7cbf3a') + `<path d="M50 88 V46" stroke="#4f8a2a" stroke-width="6" stroke-linecap="round"/><ellipse cx="34" cy="44" rx="17" ry="9" transform="rotate(-25 34 44)" fill="url(#spzSp)"/><ellipse cx="66" cy="38" rx="17" ry="9" transform="rotate(25 66 38)" fill="url(#spzSp)"/>`),
  };
  function pic(k) { const p = photoOf(k); if (p) return `<img src="${p.src}" alt="" draggable="false" loading="lazy">`; return DRAW[k] ? DRAW[k]() : `<span class="spz-word">${esc(nm(k))}</span>`; }
  const cardOf = k => ({ id: k, name: nm(k), html: pic(k) });

  // bin header icons
  const ic = inner => `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">${inner}</svg>`;
  const BIN_IC = {
    living: ic('<path d="M20 36V18" stroke="#8fd06a" stroke-width="3"/><ellipse cx="13" cy="17" rx="8" ry="4.5" transform="rotate(-25 13 17)" fill="#8fd06a"/><ellipse cx="27" cy="13" rx="8" ry="4.5" transform="rotate(25 27 13)" fill="#8fd06a"/>'),
    nonliving: ic('<path d="M20 6 L34 13 V28 L20 35 L6 28 V13Z" fill="#aab2c0"/><path d="M6 13 L20 20 L34 13 M20 20 V35" stroke="#5b6275" stroke-width="1.5" fill="none"/>'),
    floats: ic('<path d="M8 20 H32 L28 27 H12Z" fill="#e2a336"/><path d="M2 28 q5 -3 9 0 t9 0 t9 0 t9 0" stroke="#7cc4ef" stroke-width="3" fill="none"/>'),
    sinks: ic('<path d="M2 12 q5 -3 9 0 t9 0 t9 0 t9 0" stroke="#7cc4ef" stroke-width="3" fill="none"/><ellipse cx="20" cy="31" rx="9" ry="6" fill="#aab2c0"/><path d="M20 16 V22 M17 19 L20 22 L23 19" stroke="#cfd4de" stroke-width="2" fill="none"/>'),
    magnetic: ic('<path d="M10 8 V22 a10 10 0 0 0 20 0 V8" stroke="#e2574c" stroke-width="7" fill="none"/><path d="M10 8 V13 M30 8 V13" stroke="#cfd4de" stroke-width="7"/>'),
    notmag: ic('<path d="M10 8 V22 a10 10 0 0 0 20 0 V8" stroke="#7a8291" stroke-width="7" fill="none"/><path d="M5 35 L35 5" stroke="#f2efff" stroke-width="3"/>'),
    solid: ic('<rect x="9" y="9" width="22" height="22" rx="2" fill="#aab2c0"/>'), liquid: ic('<path d="M20 6 C28 18 32 23 32 28 a12 12 0 0 1 -24 0 C8 23 12 18 20 6Z" fill="#7cc4ef"/>'),
    gas: ic('<circle cx="12" cy="26" r="5" fill="none" stroke="#d9e6f2" stroke-width="2"/><circle cx="26" cy="20" r="7" fill="none" stroke="#d9e6f2" stroke-width="2"/><circle cx="16" cy="10" r="4" fill="none" stroke="#d9e6f2" stroke-width="2"/><circle cx="31" cy="33" r="3" fill="none" stroke="#d9e6f2" stroke-width="2"/>'),
    conductor: ic('<circle cx="20" cy="16" r="11" fill="#ffd66b" opacity=".35"/><circle cx="20" cy="16" r="8" fill="#ffe9a8"/><rect x="15" y="24" width="10" height="8" rx="1" fill="#8a919e"/>'),
    insulator: ic('<circle cx="20" cy="16" r="8" fill="#59606f"/><rect x="15" y="24" width="10" height="8" rx="1" fill="#8a919e"/>'),
    herb: ic('<ellipse cx="20" cy="20" rx="14" ry="7" transform="rotate(-35 20 20)" fill="#8fd06a"/><path d="M9 31 L31 9" stroke="#4f8a2a" stroke-width="1.6"/>'),
    carn: ic('<path d="M10 12 a4 4 0 1 1 5 -3 L27 21 a4 4 0 1 1 3 5 a4 4 0 1 1 -5 3 L13 17 a4 4 0 1 1 -3 -5Z" fill="#efe2cc"/>'),
    omni: ic('<ellipse cx="14" cy="16" rx="10" ry="5" transform="rotate(-35 14 16)" fill="#8fd06a"/><path d="M20 22 a3 3 0 1 1 4 -2 L32 28 a3 3 0 1 1 2 4 a3 3 0 1 1 -4 2 L22 26 a3 3 0 1 1 -2 -4Z" fill="#efe2cc"/>'),
  };

  // ---------- shared placing board: drag with snap, tap-tap, keyboard ----------
  // o: { layout: 'row'|'bins'|'spots', cards, slots, answer: {cardId: slotId|''}, oneId, picOnly, speak, cycle,
  //      stage: { h, bg(at, st), extra?(st), bind?(el, st, redraw) }, state, solvedState, okFn?, readyFn?, goodFn? }
  function placer(o) {
    const cap1 = o.layout !== 'bins';
    const at = {}; o.cards.forEach(c => { at[c.id] = ''; });
    const st = o.state || {};
    let sel = null, root = null, body = null, live = null, api = null, locked = false, focusId = null, suppress = false;
    const card = id => o.cards.find(c => c.id === id), slot = id => o.slots.find(s => s.id === id);
    const inS = (m, sid) => o.cards.filter(c => m[c.id] === sid);
    const say = s => { if (!live) return; live.textContent = ''; setTimeout(() => { live.textContent = s; }, 30); };
    const speak = s => { if (o.speak && window.Voice) try { Voice.play([{ text: s, lang: I18N.lang }], null, {}); } catch (e) {} };
    const good = (id, m) => o.goodFn ? o.goodFn(id, m, st) : m[id] === o.answer[id];
    const cardBtn = (c, m, lv) => `<button type="button" class="spz-card${lv && sel === c.id ? ' sel' : ''}${o.picOnly ? ' pic-only' : ''}${lv && locked ? (good(c.id, m) ? ' good' : ' bad') : ''}" data-card="${c.id}"${lv ? '' : ' tabindex="-1"'} aria-pressed="${lv && sel === c.id}" aria-label="${esc(c.name + (m[c.id] ? ', ' + slot(m[c.id]).name : ''))}"><span class="spz-pic">${c.html}</span><span class="spz-cap">${esc(c.name)}</span></button>`;
    const pos = s => s.x != null ? `left:${s.x}%;top:${(s.y / o.stage.h * 100).toFixed(2)}%;width:${s.w || 20}%;${s.ar ? `aspect-ratio:${s.ar};` : ''}` : '';
    function slotHtml(s, m, lv) {
      const ti = lv ? '' : ' tabindex="-1"';
      if (!cap1) return `<div class="spz-bin" data-slot="${s.id}"><button type="button" class="spz-target spz-binhead" data-target="${s.id}"${ti}><span class="spz-binicon">${s.html || ''}</span><span class="spz-binname">${esc(s.name)}</span></button><div class="spz-binbody">${inS(m, s.id).map(c => cardBtn(c, m, lv)).join('')}</div></div>`;
      const c = inS(m, s.id)[0];
      return `<div class="spz-slot${c ? ' full' : ''}${s.cls ? ' ' + s.cls : ''}" data-slot="${s.id}" style="${pos(s)}">${s.num != null ? `<span class="spz-num" aria-hidden="true">${s.num}</span>` : ''}${s.html ? `<span class="spz-slotbg" aria-hidden="true">${s.html}</span>` : ''}${c ? cardBtn(c, m, lv) : `<button type="button" class="spz-target" data-target="${s.id}" aria-label="${esc(s.name)}: ${t('spz.ui.empty')}"${ti}></button>`}</div>`;
    }
    const arrow = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    function layout(m, lv, s2) {
      if (o.layout === 'row') return `<div class="spz-row">${o.slots.map((s, i) => `${slotHtml(s, m, lv)}${i < o.slots.length - 1 ? `<span class="spz-arrow" aria-hidden="true">${arrow}</span>` : ''}`).join('')}${o.cycle ? `<span class="spz-loop" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M19 12a7 7 0 1 1-2.1-5M19 4v4h-4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('spz.ui.cycleBack')}</span>` : ''}</div>`;
      if (o.layout === 'bins') return `<div class="spz-bins" style="--n:${o.slots.length}">${o.slots.map(s => slotHtml(s, m, lv)).join('')}</div>`;
      return `<div class="spz-stage ${o.stage.cls || ''}" style="aspect-ratio:100/${o.stage.h}">${o.stage.bg(m, s2)}${o.slots.map(s => slotHtml(s, m, lv)).join('')}${lv && o.stage.extra ? o.stage.extra(s2, locked) : ''}</div>`;
    }
    function draw() {
      if (!body) return;
      const had = root.contains(document.activeElement);
      const tray = o.cards.filter(c => !at[c.id]);
      body.innerHTML = `<div class="board spz-board">${layout(at, true, st)}</div>
        <div class="spz-tray" data-slot="" role="group" aria-label="${t('spz.ui.tray')}">${tray.map(c => cardBtn(c, at, true)).join('')}${tray.length ? '' : `<span class="spz-trayph">${t('spz.ui.trayEmpty')}</span>`}${sel && at[sel] && !locked ? `<button type="button" class="spz-target spz-back k-btn k-btn-outline k-btn-sm pill" data-target="">${t('spz.ui.returnTray')}</button>` : ''}</div>`;
      o.stage?.bind?.(body, st, () => { draw(); }, () => locked, say);
      if (had && focusId) body.querySelector(`[data-card="${focusId}"]`)?.focus({ preventScroll: true });
      api?.ready(!locked && (o.readyFn ? o.readyFn(at, st) : o.cards.every(c => at[c.id])));
    }
    function move(cid, sid, quiet) {
      const from = at[cid];
      if (sid && cap1) inS(at, sid).forEach(c => { if (c.id !== cid) at[c.id] = from && from !== sid ? from : ''; });
      at[cid] = sid; sel = null; focusId = cid;
      if (!quiet) say(sid ? t('spz.ui.placed', { x: card(cid).name, s: slot(sid).name }) : t('spz.ui.back', { x: card(cid).name }));
      draw();
    }
    function onClick(e) {
      if (suppress) { suppress = false; return; }
      if (locked) return;
      const cb = e.target.closest('[data-card]'), tg = e.target.closest('[data-target]');
      if (cb) {
        const id = cb.dataset.card;
        if (sel && sel !== id && at[id]) { move(sel, at[id]); return; }
        sel = sel === id ? null : id; focusId = id;
        if (sel) { say(t('spz.ui.picked', { x: card(id).name })); speak(card(id).name); }
        draw(); return;
      }
      if (tg) { const sid = tg.dataset.target; if (sel) move(sel, sid); else { say(t('spz.ui.pickFirst')); if (!cap1 && sid) speak(slot(sid).name); } }
    }
    function hit(x, y) {
      const el = document.elementFromPoint(x, y)?.closest?.('[data-slot]');
      if (el && body.contains(el)) return { el, id: el.dataset.slot };
      let best = null, bd = 1e9;
      body.querySelectorAll('[data-slot]').forEach(s => { if (!s.dataset.slot) return; const rc = s.getBoundingClientRect(), d = Math.hypot(rc.left + rc.width / 2 - x, rc.top + rc.height / 2 - y); if (d < bd) { bd = d; best = s; } });
      return best && bd < Math.max(64, best.getBoundingClientRect().width * .9) ? { el: best, id: best.dataset.slot } : null;
    }
    function onDown(e) {
      const cb = e.target.closest('[data-card]'); if (!cb || locked || (e.button || 0) > 0) return;
      const id = cb.dataset.card, sx = e.clientX, sy = e.clientY; let moving = false;
      const clear = () => body.querySelectorAll('.over').forEach(x => x.classList.remove('over'));
      const mv = ev => { const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moving && Math.hypot(dx, dy) > 8) { moving = true; cb.classList.add('dragging'); body.classList.add('is-dragging'); }
        if (moving) { ev.preventDefault(); cb.style.transform = `translate(${dx}px, ${dy}px)`; clear(); hit(ev.clientX, ev.clientY)?.el.classList.add('over'); } };
      const up = ev => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
        body.classList.remove('is-dragging'); clear();
        if (!moving) return; suppress = true; setTimeout(() => { suppress = false; }, 0);
        const h = ev.type === 'pointercancel' ? null : hit(ev.clientX, ev.clientY);
        if (h && h.id !== at[id]) move(id, h.id); else { cb.style.transform = ''; cb.classList.remove('dragging'); } };
      addEventListener('pointermove', mv, { passive: false }); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    }
    const q = {
      kind: 'custom',
      mount(el, a) {
        api = a; root = el;
        el.innerHTML = `<div class="spz"><div class="spz-body"></div><p class="spz-tip small muted">${t('spz.ui.trayHelp')}</p><p class="k-sr-only" aria-live="polite"></p></div>`;
        body = el.querySelector('.spz-body'); live = el.querySelector('[aria-live]');
        body.addEventListener('click', onClick); body.addEventListener('pointerdown', onDown);
        body.addEventListener('keydown', e => { if (e.key === 'Escape' && sel) { sel = null; draw(); } });
        wireHints(el, q); draw();
      },
      check() {
        locked = true; sel = null;
        const ok = o.okFn ? o.okFn(at, st) : o.cards.every(c => at[c.id] === o.answer[c.id]);
        const given = cap1 && o.layout === 'row' ? o.slots.map(s => inS(at, s.id)[0]?.name || '—').join(' → ') : o.slots.map(s => `${s.name}: ${inS(at, s.id).map(c => c.name).join(', ') || '—'}`).join('; ');
        draw(); return { correct: ok, given };
      },
      placeOne() { const id = o.oneId; if (id && at[id] !== o.answer[id]) move(id, o.answer[id], true); else draw(); },
      solveAll() { o.cards.forEach(c => { at[c.id] = o.answer[c.id]; }); Object.assign(st, o.solvedState || {}); sel = null; draw(); },
      staticVis: () => `<div class="spz spz-static" inert>${layout(o.answer, false, { ...st, ...(o.solvedState || {}) })}</div>`,
      _at: at,
    };
    return q;
  }
  // hint 2 places one piece, hint 3 shows (and fills in) the whole answer
  function wireHints(el, q) {
    const hb = el.closest('.qcard')?.querySelector('.hintbtn'); if (!hb) return;
    hb.addEventListener('click', () => setTimeout(() => { const n = Engine.round?.hint || 0; if (n >= 3) q.solveAll(); else if (n >= 2) q.placeOne(); }, 0));
  }
  function ladder(q, nudge, oneText, ansText, ansVis) {
    q.hints = [{ text: nudge }, { text: oneText }, { text: ansText || t('spz.h.ans'), vis: ansVis }]; q.hintRevealsAnswer = true; return q;
  }
  const say1 = q => { q.promptText = q.prompt.replace(/<[^>]+>/g, ' '); return q; };

  // ---------- 1. life cycles ----------
  const CYCLES = {
    plant: { min: 3, stages: ['seed', 'sprout', 'plant', 'flower', 'fruit'], photo: ['flower', 'seed'] },
    butterfly: { min: 3, stages: ['eggs', 'caterpillar', 'pupa', 'butterfly'], photo: ['butterfly'] },
    hen: { min: 3, stages: ['egg', 'chick', 'hen'], photo: ['hen'] },
    frog: { min: 5, stages: ['spawn', 'tadpole', 'froglet', 'frog'], photo: ['frog'] },
  };
  const NAME_OF = { plant: 'plant', butterfly: 'butterfly', hen: 'hen', frog: 'frog' };
  function subset(r, arr, n) { if (n >= arr.length) return arr.slice(); if (n <= 2) return [arr[0], arr[arr.length - 1]]; const mid = r.shuffle(arr.slice(1, -1).map((_, i) => i + 1)).slice(0, n - 2).sort((a, b) => a - b); return [arr[0], ...mid.map(i => arr[i]), arr[arr.length - 1]]; }
  function cycleQ(r, age, kind) {
    const C = CYCLES[kind], n = age <= 3 ? r.pick([2, 3]) : age <= 5 ? 3 : age <= 6 ? 4 : 5;
    const keys = subset(r, C.stages, n), young = age <= 4;
    const slots = keys.map((k, i) => ({ id: 's' + i, name: t('spz.ui.step', { n: i + 1 }), num: i + 1 }));
    const p = placer({ layout: 'row', cycle: !young, cards: r.shuffle(keys).map(cardOf), slots, answer: Object.fromEntries(keys.map((k, i) => [k, 's' + i])), oneId: keys[0], picOnly: young, speak: age <= 5 });
    p.prompt = young ? t('spz.q.cycleYoung') : t('spz.q.cycle', { x: nm(NAME_OF[kind]) }); say1(p);
    ladder(p, t('spz.h.cycle'), t('spz.h.one', { x: nm(keys[0]), s: t('spz.ui.step', { n: 1 }) }), null, p.staticVis());
    p.answerText = keys.map(nm).join(' → ');
    const steps = tx('spz.y.' + kind).map(text => ({ text }));
    steps[steps.length - 1].vis = p.staticVis();
    p.why = { photo: anyPhoto(...C.photo), steps, rule: t('spz.y.cycleRule') };
    return p;
  }

  // ---------- 2. sorting bins ----------
  const SORTS = {
    living: { min: 3, max: 8, bins: { living: ['tree', 'cow', 'dog', 'hen', 'butterfly', 'frog', 'ant', 'bee', 'parrot', 'flower'], nonliving: ['chair', 'ball', 'cup', 'book', 'stone', 'bottle', 'clock', 'car', 'kite', 'key', 'umbrella'] }, photo: 'tree' },
    float: { min: 4, max: 10, bins: { floats: ['wood', 'bottle', 'ball', 'leaf', 'coconut', 'apple', 'boat'], sinks: ['stone', 'coin', 'iron', 'key', 'clip', 'sand'] }, photo: 'boat' },
    magnet: { min: 5, max: 10, bins: { magnetic: ['iron', 'clip', 'magnet'], notmag: ['wood', 'plastic', 'glass', 'rubber', 'foil', 'copperwire', 'cotton', 'stone'] }, photo: 'magnet' },
    matter: { min: 5, max: 10, bins: { solid: ['stone', 'ice', 'wood', 'coin', 'sugar', 'sand'], liquid: ['water', 'milk', 'juice', 'oil'], gas: ['balloon', 'steam'] }, three: 7, photo: 'ice' },
    conduct: { min: 7, max: 10, bins: { conductor: ['copperwire', 'foil', 'coin', 'iron', 'clip', 'key'], insulator: ['wood', 'plastic', 'rubber', 'glass', 'cotton', 'claypot', 'towel'] }, photo: 'copperwire' },
    diet: { min: 6, max: 10, bins: { herb: ['cow', 'goat', 'elephant', 'horse', 'rabbit', 'zebra', 'yak'], carn: ['tiger', 'cat', 'frog'], omni: ['crow', 'hen', 'monkey', 'duck', 'fox'] }, three: 7, photo: 'tiger' },
  };
  function sortQ(r, age, kind) {
    const D = SORTS[kind]; let binIds = Object.keys(D.bins); if (D.three && age < D.three) binIds = binIds.slice(0, 2);
    const n = age <= 3 ? 3 : age <= 4 ? 4 : age <= 6 ? 5 : age <= 8 ? 6 : 7;
    const pick = binIds.map(b => [b, r.shuffle(D.bins[b])]);
    const chosen = pick.map(([b, a]) => [b, [a[0]]]); // at least one per bin
    let k = 0; while (chosen.reduce((s, [, a]) => s + a.length, 0) < n && k < 40) { const i = k % pick.length, src = pick[i][1], dst = chosen[i][1]; if (dst.length < src.length && r() < .75) dst.push(src[dst.length]); k++; }
    const answer = {}; chosen.forEach(([b, a]) => a.forEach(x => { answer[x] = b; }));
    const keys = Object.keys(answer), young = age <= 4;
    const slots = binIds.map(b => ({ id: b, name: t('spz.bin.' + b), html: BIN_IC[b] }));
    const p = placer({ layout: 'bins', cards: r.shuffle(keys).map(cardOf), slots, answer, oneId: chosen[0][1][0], picOnly: young, speak: age <= 5 });
    const names = slots.map(s => s.name);
    p.prompt = names.length === 3 ? t('spz.q.sort3', { a: names[0], b: names[1], c: names[2] }) : t('spz.q.sort2', { a: names[0], b: names[1] }); say1(p);
    ladder(p, t('spz.h.' + kind), t('spz.h.one', { x: nm(p.oneId || chosen[0][1][0]), s: slots[0].name }), null, p.staticVis());
    p.oneId = chosen[0][1][0];
    p.answerText = chosen.map(([b, a]) => `${t('spz.bin.' + b)}: ${a.map(nm).join(', ')}`).join('; ');
    const steps = [{ text: t('spz.y.' + kind) }, ...chosen.map(([b, a]) => ({ text: t('spz.y.list', { s: t('spz.bin.' + b), list: a.map(nm).join(', ') }) }))];
    steps[steps.length - 1].vis = p.staticVis();
    p.why = { photo: anyPhoto(...keys.filter(x => photoOf(x)).slice(0, 1), D.photo), steps, rule: t('spz.y.' + kind + 'Rule') };
    return p;
  }

  // ---------- 3. face jigsaw (3–5) and body jigsaw (6+) ----------
  const FACE = { eyes: { x: 50, y: 38, w: 40, ar: '2 / 1' }, nose: { x: 50, y: 66, w: 24 }, mouth: { x: 50, y: 94, w: 32, ar: '2 / 1' }, ears: { x: 9, y: 66, w: 18, ar: '1 / 1.3' } };
  function faceQ(r, age) {
    const parts = age <= 3 ? r.pick([['eyes', 'nose', 'mouth'], ['eyes', 'mouth']]) : age <= 4 ? ['eyes', 'nose', 'mouth'] : ['eyes', 'nose', 'mouth', 'ears'];
    const slots = parts.map((k, i) => ({ id: 'f' + k, name: t('spz.ui.place', { n: i + 1 }), ...FACE[k] }));
    const bgSvg = () => `<svg class="spz-bg" viewBox="0 0 100 124" aria-hidden="true">${rg('spzFace', '#d9a37a')}<ellipse cx="12" cy="66" rx="7" ry="12" fill="#c98e64"/><ellipse cx="88" cy="66" rx="7" ry="12" fill="#c98e64"/><ellipse cx="50" cy="66" rx="38" ry="52" fill="url(#spzFace)"/><path d="M12 54 Q12 10 50 12 Q88 10 88 54 Q82 28 50 28 Q18 28 12 54Z" fill="#2b2f38"/></svg>`;
    const p = placer({ layout: 'spots', stage: { h: 124, bg: bgSvg, cls: 'spz-face' }, cards: r.shuffle(parts).map(cardOf), slots, answer: Object.fromEntries(parts.map(k => [k, 'f' + k])), oneId: 'eyes', picOnly: true, speak: true });
    p.prompt = t('spz.q.face'); say1(p);
    ladder(p, t('spz.h.face'), t('spz.h.one', { x: nm('eyes'), s: t('spz.ui.place', { n: 1 }) }), null, p.staticVis());
    p.answerText = t('spz.ui.seeBelow');
    const steps = tx('spz.y.face').map(text => ({ text })); steps[steps.length - 1].vis = p.staticVis();
    p.why = { photo: { ...(photoOf('teeth') || photoOf('eye')), alt: nm('mouth') }, steps, rule: t('spz.y.faceRule') };
    return p;
  }
  const ORG = { brain: { x: 12, y: 16, ax: 50, ay: 9 }, eye: { x: 12, y: 54, ax: 45, ay: 16 }, skin: { x: 12, y: 92, ax: 26, ay: 72 }, teeth: { x: 88, y: 16, ax: 50, ay: 25 }, lungs: { x: 88, y: 54, ax: 55, ay: 46 }, stomach: { x: 88, y: 92, ax: 54, ay: 62 } };
  function bodyQ(r, age) {
    const all = ['brain', 'eye', 'teeth', 'lungs', 'stomach', 'skin'];
    const parts = age <= 6 ? ['brain', 'lungs', 'stomach'] : age <= 8 ? ['brain', r.pick(['eye', 'teeth']), 'lungs', 'stomach'] : all;
    const slots = parts.map((k, i) => ({ id: 'o' + k, name: t('spz.ui.place', { n: i + 1 }), x: ORG[k].x, y: ORG[k].y, w: 22, ar: '1 / 1.2' }));
    const fig = `<g fill="#cfd5df" stroke="#8a93a3" stroke-width=".6"><ellipse cx="50" cy="16" rx="10" ry="12.5"/><rect x="46" y="28" width="8" height="6"/><path d="M33 35 Q50 31 67 35 L69 76 Q50 83 31 76Z"/><path d="M33 36 L22 72 L27 75 L37 46Z"/><path d="M67 36 L78 72 L73 75 L63 46Z"/><path d="M34 76 L37 124 L46 124 L49 80Z"/><path d="M66 76 L63 124 L54 124 L51 80Z"/></g>`;
    const bgSvg = () => `<svg class="spz-bg" viewBox="0 0 100 130" aria-hidden="true">${fig}${parts.map(k => { const o = ORG[k], sx = o.x < 50 ? o.x + 11 : o.x - 11; return `<path d="M${sx} ${o.y} L${o.ax} ${o.ay}" stroke="#f6c56b" stroke-width=".7" stroke-dasharray="2 1.5" fill="none"/><circle cx="${o.ax}" cy="${o.ay}" r="1.6" fill="#f6c56b"/>`; }).join('')}</svg>`;
    const p = placer({ layout: 'spots', stage: { h: 130, bg: bgSvg, cls: 'spz-bodyst' }, cards: r.shuffle(parts).map(cardOf), slots, answer: Object.fromEntries(parts.map(k => [k, 'o' + k])), oneId: 'brain' });
    p.prompt = t('spz.q.body'); say1(p);
    ladder(p, t('spz.h.body'), t('spz.h.one', { x: nm('brain'), s: t('spz.ui.place', { n: 1 }) }), null, p.staticVis());
    p.answerText = t('spz.ui.seeBelow');
    const steps = parts.map(k => ({ text: t('spz.y.organ.' + k) })); steps[steps.length - 1].vis = p.staticVis();
    p.why = { photo: anyPhoto(r.pick(parts), 'lungs'), steps, rule: t('spz.y.bodyRule') };
    return p;
  }

  // ---------- 4. food chains and a food web ----------
  const CHAINS = [['sun', 'grass', 'goat', 'tiger'], ['sun', 'lotus', 'snail', 'duck'], ['sun', 'leaves', 'rabbit', 'fox'], ['sun', 'leaves', 'caterpillar', 'hen', 'fox']];
  function chainQ(r, age) {
    let ch = age >= 9 ? r.pick(CHAINS) : r.pick(CHAINS.slice(0, 3));
    if (age <= 6) ch = ch.slice(1);
    const slots = ch.map((k, i) => ({ id: 'c' + i, name: t('spz.ui.step', { n: i + 1 }), num: i + 1 }));
    const p = placer({ layout: 'row', cards: r.shuffle(ch).map(cardOf), slots, answer: Object.fromEntries(ch.map((k, i) => [k, 'c' + i])), oneId: ch[0], speak: age <= 5 });
    p.prompt = t('spz.q.chain'); say1(p);
    ladder(p, t('spz.h.chain'), t('spz.h.one', { x: nm(ch[0]), s: t('spz.ui.step', { n: 1 }) }), null, p.staticVis());
    p.answerText = ch.map(nm).join(' → ');
    p.why = { photo: anyPhoto(ch[ch.length - 1]), steps: [{ text: t('spz.y.chainSun') }, { text: t('spz.y.chainList', { list: ch.map(nm).join(' → ') }) }, { text: t('spz.y.chainTop', { x: nm(ch[ch.length - 1]) }), vis: p.staticVis() }], rule: t('spz.y.chainRule') };
    return p;
  }
  const WEB = { nodes: { grass: [70, 222], leaves: [250, 222], rabbit: [46, 132], goat: [160, 132], caterpillar: [290, 132], fox: [80, 40], tiger: [190, 40], hen: [300, 40] },
    edges: [['grass', 'rabbit'], ['grass', 'goat'], ['leaves', 'goat'], ['leaves', 'rabbit'], ['leaves', 'caterpillar'], ['rabbit', 'fox'], ['goat', 'tiger'], ['caterpillar', 'hen'], ['hen', 'fox']] };
  function webSvg() {
    const N = WEB.nodes, R = 24;
    const arrows = WEB.edges.map(([a, b]) => { const [x1, y1] = N[a], [x2, y2] = N[b], d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d; return `<path d="M${(x1 + ux * (R + 2)).toFixed(1)} ${(y1 + uy * (R + 2)).toFixed(1)} L${(x2 - ux * (R + 6)).toFixed(1)} ${(y2 - uy * (R + 6)).toFixed(1)}" stroke="#f6c56b" stroke-width="2.4" marker-end="url(#spzAr)" fill="none"/>`; }).join('');
    const nodes = Object.entries(N).map(([k, [x, y]], i) => { const p = photoOf(k); return `<clipPath id="spzWc${i}"><circle cx="${x}" cy="${y}" r="${R}"/></clipPath><circle cx="${x}" cy="${y}" r="${R + 2}" fill="#f2efff"/>${p ? `<image href="${p.src}" x="${x - R}" y="${y - R}" width="${R * 2}" height="${R * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#spzWc${i})"/>` : `<g transform="translate(${x - R} ${y - R}) scale(${R / 50})" clip-path="url(#spzWc${i})">${(DRAW[k] ? DRAW[k]() : '').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`}<text x="${x}" y="${y + R + 14}" fill="#f2efff" font-family="Lato, 'Noto Sans Tamil', sans-serif" font-weight="700" font-size="12" text-anchor="middle">${esc(nm(k))}</text>`; }).join('');
    return `<svg class="r3 spz-web" viewBox="0 0 340 262" role="img" aria-label="${esc(t('spz.ui.webAlt'))}"><defs><marker id="spzAr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#f6c56b"/></marker></defs>${arrows}${nodes}</svg>`;
  }
  function webQ(r) {
    const key = r.pick(Object.keys(tx('spz.web'))), W = tx('spz.web.' + key);
    const choices = r.shuffle(W.o.map((text, i) => ({ v: i, html: esc(text) })));
    const wrong = choices.find(c => c.v !== 0);
    return { kind: 'choice', keepChoices: true, prompt: t('spz.q.web', { q: esc(W.q) }), promptText: t('spz.q.web', { q: W.q }), visual: webSvg(), choices, answer: 0, answerText: esc(W.o[0]),
      say: [{ text: t('spz.q.web', { q: W.q }) + ' ' + choices.map(c => W.o[c.v]).join('. '), lang: I18N.lang }],
      hints: [{ text: t('spz.h.web', { x: nm(key === 'plants' ? 'grass' : key) }) }, { text: t('spz.h.notIt', { x: esc(W.o[wrong.v]) }) }, { text: t('spz.h.isIt', { x: esc(W.o[0]) }) }], hintRevealsAnswer: true,
      why: { photo: anyPhoto(key === 'plants' ? 'leaves' : key, 'fox'), steps: [{ text: esc(W.why), vis: webSvg() }], rule: t('spz.y.webRule') } };
  }

  // ---------- 5. shadow match ----------
  const SHAPES = {
    ball: c => `<circle cx="50" cy="52" r="34" fill="${c[0]}"/>`,
    cup: c => `<path d="M22 26 H70 V64 Q70 84 50 84 H42 Q22 84 22 64Z" fill="${c[0]}"/><path d="M70 36 Q90 36 90 52 Q90 68 70 66" fill="none" stroke="${c[0]}" stroke-width="8"/>`,
    bottle: c => `<path d="M42 8 H58 V24 Q72 32 72 46 V86 Q72 92 66 92 H34 Q28 92 28 86 V46 Q28 32 42 24Z" fill="${c[0]}"/>`,
    tree: c => `<rect x="44" y="56" width="12" height="36" fill="${c[1]}"/><circle cx="50" cy="38" r="28" fill="${c[0]}"/>`,
    house: c => `<rect x="24" y="48" width="52" height="42" fill="${c[0]}"/><path d="M14 50 L50 14 L86 50Z" fill="${c[1]}"/>`,
    umbrella: c => `<path d="M8 52 Q50 -4 92 52Z" fill="${c[0]}"/><path d="M50 50 V82 Q50 92 40 92" fill="none" stroke="${c[1]}" stroke-width="6" stroke-linecap="round"/>`,
    star: c => `<path d="M50 8 L61 38 L93 38 L67 57 L77 89 L50 70 L23 89 L33 57 L7 38 L39 38Z" fill="${c[0]}"/>`,
    key: c => `<circle cx="28" cy="50" r="17" fill="none" stroke="${c[0]}" stroke-width="9"/><path d="M44 46 H92 V54 H86 V66 H78 V54 H68 V64 H60 V54 H44Z" fill="${c[0]}"/>`,
  };
  const SHCOL = { ball: ['#e2574c'], cup: ['#16a39c'], bottle: ['#4f8fd6'], tree: ['#3f9b4f', '#8a5a2e'], house: ['#e2a336', '#b5502e'], umbrella: ['#6d6ad8', '#3a3f4a'], star: ['#f6c56b'], key: ['#c9a36b'] };
  const objSvg = k => sv(bg('#eef1f5') + SHAPES[k](SHCOL[k]) + `<ellipse cx="36" cy="32" rx="12" ry="7" fill="#fff" opacity=".22"/>`);
  const shSvg = k => sv(SHAPES[k](['#14171f', '#14171f']));
  function shadowQ(r, age) {
    const n = age <= 5 ? 2 : age <= 6 ? 3 : 4, keys = r.shuffle(Object.keys(SHAPES)).slice(0, n), order = r.shuffle(keys);
    const slots = order.map((k, i) => ({ id: 'h' + k, name: t('spz.ui.shadowN', { n: i + 1 }), html: shSvg(k), cls: 'spz-shadowslot' }));
    const p = placer({ layout: 'row', cards: r.shuffle(keys).map(k => ({ id: k, name: nm(k), html: objSvg(k) })), slots, answer: Object.fromEntries(keys.map(k => [k, 'h' + k])), oneId: order[0], speak: age <= 5 });
    p.prompt = t('spz.q.shadow'); say1(p);
    ladder(p, t('spz.h.shadow'), t('spz.h.one', { x: nm(order[0]), s: t('spz.ui.shadowN', { n: 1 }) }), null, p.staticVis());
    p.answerText = order.map((k, i) => `${t('spz.ui.shadowN', { n: i + 1 })}: ${nm(k)}`).join('; ');
    const steps = tx('spz.y.shadow').map(text => ({ text })); steps[steps.length - 1].vis = p.staticVis();
    p.why = { photo: anyPhoto('torch', 'sun'), steps, rule: t('spz.y.shadowRule') };
    return p;
  }

  // ---------- 6. circuit on a grid (7+) ----------
  const COND = () => { const c = SIMS.SIMS.circuit.cond; return { copperwire: c.copper, clip: c.spoon, key: c.spoon, lead: c.lead, rubber: c.rubber, wood: c.wood, foil: c.copper, coin: c.copper, plastic: 0, cotton: 0 }; };
  const GAPS = [{ x: 50, y: 12 }, { x: 90, y: 34 }, { x: 70, y: 56 }];
  function circuitQ(r, age) {
    const ng = age <= 7 ? 1 : age <= 8 ? 2 : 3, sw = age >= 9, cond = COND();
    const goodPool = r.shuffle(['copperwire', 'foil', 'clip', 'coin', 'key']), badPool = r.shuffle(['rubber', 'wood', 'plastic', 'cotton']);
    const goods = goodPool.slice(0, ng), bads = [...(age >= 8 ? ['lead'] : []), ...badPool].slice(0, age <= 7 ? 2 : 2 + (age >= 9 ? 1 : 0));
    const keys = [...goods, ...bads], gaps = GAPS.slice(0, ng).map((g, i) => ({ id: 'g' + i, name: t('spz.ui.gap', { n: i + 1 }), x: g.x, y: g.y, w: 19, ar: '1 / 1.15', cls: 'spz-gap' }));
    const answer = Object.fromEntries(keys.map(k => [k, ''])); goods.forEach((k, i) => { answer[k] = 'g' + i; });
    const glowOf = (at, st) => { if (sw && !st.on) return 0; const ks = gaps.map(g => Object.keys(at).find(k => at[k] === g.id)); if (ks.some(k => !k)) return 0; return Math.min(...ks.map(k => cond[k] ?? 0)); };
    const bgSvg = (at, st) => {
      const glow = glowOf(at, st), wire = '#d38a4a';
      const dots = [...Array(11)].map((_, i) => [...Array(7)].map((_, j) => `<circle cx="${i * 10}" cy="${j * 10 + 2}" r=".5" fill="#ffffff" opacity=".14"/>`).join('')).join('');
      const holes = gaps.map(g => `<rect x="${g.x - 7}" y="${g.y - 4}" width="14" height="8" fill="#1f1b2e"/>`).join('');
      return `<svg class="spz-bg" viewBox="0 0 100 64" aria-hidden="true">${dots}<path d="M10 12 H90 V56 H10 Z" fill="none" stroke="${wire}" stroke-width="1.6" stroke-linejoin="round"/>${holes}
        <g transform="translate(30 56)"><rect x="-9" y="-4.5" width="18" height="9" rx="1.6" fill="#2a2f3b"/><rect x="-9" y="-4.5" width="5.5" height="9" rx="1.6" fill="#e2a336"/><rect x="9" y="-2" width="1.6" height="4" fill="#aab2c0"/><text x="2" y="1.6" fill="#cfd4de" font-family="Lato" font-weight="900" font-size="3.6" text-anchor="middle">1.5V</text></g>
        <g transform="translate(22 12)">${glow ? `<circle cy="-3" r="${9 + glow * 6}" fill="#ffd66b" opacity="${glow * .35}"/>` : ''}<circle cy="-4" r="5.6" fill="${glow ? shade('#ffe9a8', -0.1 + glow * .1) : '#59606f'}"/><rect x="-2.8" y="1" width="5.6" height="4" rx=".6" fill="#8a919e"/></g>
        ${sw ? `<g transform="translate(74 12)"><circle r="3" fill="#394054"/><line x1="-3" y1="0" x2="${st.on ? 4 : 2}" y2="${st.on ? 0 : -4}" stroke="#cfd4de" stroke-width="1.3" stroke-linecap="round"/></g>` : ''}</svg>`;
    };
    const state = { on: false };
    const p = placer({ layout: 'spots', cards: r.shuffle(keys).map(cardOf), slots: gaps, answer, oneId: goods[0], state, solvedState: { on: true },
      stage: { h: 64, bg: bgSvg, cls: 'spz-circuit',
        extra: (st, locked) => `${sw ? `<button type="button" class="spz-switch" aria-pressed="${!!st.on}" ${locked ? 'disabled' : ''}>${t(st.on ? 'spz.ui.swOn' : 'spz.ui.swOff')}</button>` : ''}`,
        bind(el, st, redraw, isLocked, say) { const b = el.querySelector('.spz-switch'); if (b) b.onclick = () => { if (isLocked()) return; st.on = !st.on; redraw(); el.querySelector('.spz-switch')?.focus(); say(t(st.on ? 'spz.ui.swOn' : 'spz.ui.swOff')); }; } },
      readyFn: at => gaps.every(g => Object.values(at).includes(g.id)),
      okFn: (at, st) => glowOf(at, st) >= .8,
      goodFn: (id, at) => !at[id] || (cond[id] ?? 0) >= .8 });
    // tell the child how the bulb is doing after each change
    const mount0 = p.mount; p.mount = (el, a) => { let last = null; mount0(el, { ...a, ready: ok => { a.ready(ok); const g = glowOf(p._at, state); const s = g >= .8 ? 'bright' : g > 0 ? 'dim' : 'dark'; if (s !== last) { last = s; const lv = el.querySelector('.spz-bulbsr'); if (lv) lv.textContent = t('spz.ui.' + s); } } }); el.querySelector('.spz').insertAdjacentHTML('beforeend', `<p class="spz-bulbsr small" aria-live="polite">${t('spz.ui.dark')}</p>`); };
    p.prompt = t(sw ? 'spz.q.circuitSw' : 'spz.q.circuit'); say1(p);
    ladder(p, t('spz.h.circuit') + (sw ? ' ' + t('spz.h.circuitSw') : ''), t('spz.h.one', { x: nm(goods[0]), s: t('spz.ui.gap', { n: 1 }) }), null, p.staticVis());
    p.answerText = goods.map((k, i) => `${t('spz.ui.gap', { n: i + 1 })}: ${nm(k)}`).join('; ') + (sw ? '; ' + t('spz.ui.swOn') : '');
    const W = tx('spz.y.circuit');
    p.why = { photo: anyPhoto('bulb', 'copperwire'), steps: [{ text: W[0] }, { text: W[1].replace('{list}', goods.map(nm).join(', ')) }, { text: W[2], vis: p.staticVis() }], rule: t('spz.y.circuitRule') };
    return p;
  }

  // ---------- 7. water-cycle pipes (6+) ----------
  const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // N E S W as [dr, dc]
  function pipesQ(r, age) {
    const W = age <= 7 ? 3 : 4, H = 3, ring = [];
    for (let c = 0; c < W; c++) ring.push([0, c]); for (let rr = 1; rr < H; rr++) ring.push([rr, W - 1]); for (let c = W - 2; c >= 0; c--) ring.push([H - 1, c]); for (let rr = H - 2; rr >= 1; rr--) ring.push([rr, 0]);
    const stageAt = { sea: [1, 0], cloud: [0, 1], rain: [1, W - 1], river: [H - 1, W - 2] };
    const idx = (rr, c) => rr * W + c, need = {}, cells = [];
    ring.forEach(([rr, c], i) => { const a = ring[(i - 1 + ring.length) % ring.length], b = ring[(i + 1) % ring.length]; need[idx(rr, c)] = [a, b].map(([r2, c2]) => DIRS.findIndex(([dr, dc]) => dr === r2 - rr && dc === c2 - c)).sort(); });
    const shapeOf = set => (set[1] - set[0]) % 2 === 0 ? 'I' : 'L';
    const conn = (shape, rot) => (shape === 'I' ? [0, 2] : [0, 1]).map(d => (d + rot) % 4).sort();
    const same = (a, b) => a[0] === b[0] && a[1] === b[1];
    const stageOf = {}; Object.entries(stageAt).forEach(([k, [rr, c]]) => { stageOf[idx(rr, c)] = k; });
    const rot = {}, okRot = {};
    Object.keys(need).forEach(i => { const sh = shapeOf(need[i]); okRot[i] = [0, 1, 2, 3].filter(k => same(conn(sh, k), need[i])); });
    const free = Object.keys(need).filter(i => !stageOf[i]);
    Object.keys(need).forEach(i => { if (stageOf[i]) rot[i] = okRot[i][0]; else { const bad = [0, 1, 2, 3].filter(k => !okRot[i].includes(k)); rot[i] = r.pick(bad); } });
    const solved = () => Object.keys(need).every(i => okRot[i].includes(rot[i]));
    // water reach: follow connected pipes from the sea
    const reach = () => { const seen = new Set(), start = idx(...stageAt.sea), stack = [start]; while (stack.length) { const i = stack.pop(); if (seen.has(i)) continue; seen.add(i); const rr = Math.floor(i / W), c = i % W, my = conn(shapeOf(need[i]), rot[i]); my.forEach(d => { const r2 = rr + DIRS[d][0], c2 = c + DIRS[d][1], j = idx(r2, c2); if (need[j] && conn(shapeOf(need[j]), rot[j]).includes((d + 2) % 4)) stack.push(j); }); } return seen; };
    const ICON = { sea: `<path d="M8 64 q10 -8 21 0 t21 0 t21 0 t21 0 V92 H8Z" fill="#2f6fb0"/><path d="M8 64 q10 -8 21 0 t21 0 t21 0 t21 0" stroke="#7cc4ef" stroke-width="3" fill="none"/>`, cloud: `<path d="M24 52 a14 14 0 0 1 10 -24 a18 18 0 0 1 34 4 a12 12 0 0 1 8 20Z" fill="#e9eef5"/>`, rain: `<path d="M24 40 a12 12 0 0 1 8 -20 a15 15 0 0 1 30 4 a10 10 0 0 1 6 16Z" fill="#b9c3d1"/>${[30, 46, 62].map(x => `<path d="M${x} 52 l-4 10 M${x + 6} 66 l-4 10" stroke="#7cc4ef" stroke-width="3" stroke-linecap="round"/>`).join('')}`, river: `<path d="M10 70 Q30 56 50 70 T90 66" stroke="#4f8fd6" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M14 84 l8 -12 l8 12Z M70 86 l7 -10 l7 10Z" fill="#3f9b4f"/>` };
    const tileSvg = (i, wet) => { const ds = conn(shapeOf(need[i]), rot[i]), ends = { 0: [50, 0], 1: [100, 50], 2: [50, 100], 3: [0, 50] }, path = ds.map(d => `M50 50 L${ends[d][0]} ${ends[d][1]}`).join(' ');
      return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${stageOf[i] ? ICON[stageOf[i]] : ''}<path d="${path}" stroke="#2a3550" stroke-width="26" stroke-linecap="round"/><path d="${path}" stroke="${wet ? '#5fb3e6' : '#3d4a66'}" stroke-width="14" stroke-linecap="round"/><circle cx="50" cy="50" r="${shapeOf(need[i]) === 'L' ? 7 : 0}" fill="${wet ? '#5fb3e6' : '#3d4a66'}"/></svg>`; };
    let el0 = null, api0 = null, focus = idx(0, 0), locked = false;
    const live = s => { const l = el0?.querySelector('[aria-live]'); if (l) { l.textContent = ''; setTimeout(() => { l.textContent = s; }, 30); } };
    function draw() {
      if (!el0) return; const wet = reach(), had = el0.contains(document.activeElement);
      const cell = i => { const rr = Math.floor(i / W), c = i % W;
        if (!need[i]) return `<div class="spz-pcell spz-pmid" aria-hidden="true">${rr === 1 && c === 1 ? DRAW.sunlight() : ''}</div>`;
        const stg = stageOf[i];
        return `<button type="button" class="spz-pcell${stg ? ' fixed' : ''}${wet.has(i) ? ' wet' : ''}" data-i="${i}" tabindex="${i === focus ? 0 : -1}" ${stg || locked ? 'aria-disabled="true"' : ''} aria-label="${stg ? t('spz.ui.fixed', { s: nm(stg) }) : t('spz.ui.tile', { r: rr + 1, c: c + 1 })}">${tileSvg(i, wet.has(i))}${stg ? `<span class="spz-plabel">${esc(nm(stg))}</span>` : ''}</button>`; };
      el0.querySelector('.spz-body').innerHTML = `<div class="board spz-board"><div class="spz-pipes" role="grid" style="--w:${W}">${[...Array(W * H).keys()].map(cell).join('')}</div></div>`;
      el0.querySelectorAll('.spz-pcell[data-i]').forEach(b => { const i = +b.dataset.i;
        b.onclick = () => { focus = i; if (locked || stageOf[i]) return; rot[i] = (rot[i] + 1) % 4; draw(); live(t('spz.ui.turned') + (solved() ? ' ' + t('spz.ui.flowAll') : '')); };
        b.onkeydown = e => { const d = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[e.key]; if (d == null) return; e.preventDefault(); let rr = Math.floor(i / W) + DIRS[d][0], c = i % W + DIRS[d][1]; for (let k = 0; k < 4 && rr >= 0 && rr < H && c >= 0 && c < W && !need[idx(rr, c)]; k++) { rr += DIRS[d][0]; c += DIRS[d][1]; } if (rr >= 0 && rr < H && c >= 0 && c < W && need[idx(rr, c)]) { focus = idx(rr, c); draw(); el0.querySelector(`[data-i="${focus}"]`)?.focus(); } }; });
      if (had) el0.querySelector(`[data-i="${focus}"]`)?.focus({ preventScroll: true });
      api0?.ready(!locked);
    }
    const staticVis = () => { const keep = { ...rot }; Object.keys(need).forEach(i => { rot[i] = okRot[i][0]; }); const html = `<div class="spz spz-static" inert><div class="spz-pipes" style="--w:${W}">${[...Array(W * H).keys()].map(i => need[i] ? `<div class="spz-pcell wet">${tileSvg(i, true)}${stageOf[i] ? `<span class="spz-plabel">${esc(nm(stageOf[i]))}</span>` : ''}</div>` : `<div class="spz-pcell spz-pmid">${Math.floor(i / W) === 1 && i % W === 1 ? DRAW.sunlight() : ''}</div>`).join('')}</div></div>`; Object.assign(rot, keep); return html; };
    const q = { kind: 'custom', prompt: t('spz.q.pipes'),
      mount(el, a) { el0 = el; api0 = a; el.innerHTML = `<div class="spz"><div class="spz-body"></div><p class="spz-tip small muted">${t('spz.ui.pipeTip')}</p><p class="k-sr-only" aria-live="polite"></p></div>`; wireHints(el, q); draw(); },
      check() { locked = true; draw(); return { correct: solved(), given: t(solved() ? 'spz.ui.flowAll' : 'spz.ui.turned') }; },
      placeOne() { const i = free.find(k => !okRot[k].includes(rot[k])); if (i != null) rot[i] = okRot[i][0]; draw(); },
      solveAll() { Object.keys(need).forEach(i => { rot[i] = okRot[i][0]; }); draw(); } };
    say1(q);
    const vis = staticVis();
    ladder(q, t('spz.h.pipes'), t('spz.h.pipesOne'), t('spz.h.pipesAns'), vis);
    q.answerText = [nm('sea'), nm('cloud'), nm('rain'), nm('river'), nm('sea')].join(' → ');
    const steps = tx('spz.y.pipes').map(text => ({ text })); steps[steps.length - 1].vis = vis;
    q.why = { photo: anyPhoto('clouds', 'rain'), steps, rule: t('spz.y.pipesRule') };
    return q;
  }

  // ---------- 8. plant-needs maze (5+) ----------
  function mazeQ(r, age) {
    const N = age <= 5 ? 4 : age <= 8 ? 5 : 6, cells = N * N, walls = [...Array(cells)].map(() => [1, 1, 1, 1]);
    const seen = new Set([0]), stack = [0];
    while (stack.length) { const i = stack[stack.length - 1], rr = Math.floor(i / N), c = i % N; const opts = [0, 1, 2, 3].filter(d => { const r2 = rr + DIRS[d][0], c2 = c + DIRS[d][1]; return r2 >= 0 && r2 < N && c2 >= 0 && c2 < N && !seen.has(r2 * N + c2); });
      if (!opts.length) { stack.pop(); continue; } const d = r.pick(opts), j = (rr + DIRS[d][0]) * N + c + DIRS[d][1]; walls[i][d] = 0; walls[j][(d + 2) % 4] = 0; seen.add(j); stack.push(j); }
    const goal = cells - 1, needs = ['drop', 'sunlight', 'air'], spots = r.shuffle([...Array(cells).keys()].filter(i => i !== 0 && i !== goal)).slice(0, needs.length);
    const item = {}; needs.forEach((k, i) => { item[spots[i]] = k; });
    const NEED_NAME = { drop: 'water', sunlight: 'sunlight', air: 'air' };
    const step = (i, d) => { const rr = Math.floor(i / N), c = i % N; return walls[i][d] ? -1 : (rr + DIRS[d][0]) * N + c + DIRS[d][1]; };
    const path = (a, b) => { const prev = { [a]: -1 }, qq = [a]; while (qq.length) { const i = qq.shift(); if (i === b) break; for (let d = 0; d < 4; d++) { const j = step(i, d); if (j >= 0 && !(j in prev)) { prev[j] = i; qq.push(j); } } } const out = []; for (let i = b; i !== -1; i = prev[i]) out.unshift(i); return out; };
    const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
    let best = null; perms(spots).forEach(o => { const stops = [0, ...o, goal]; let full = [0]; for (let k = 1; k < stops.length; k++) full = full.concat(path(stops[k - 1], stops[k]).slice(1)); if (!best || full.length < best.full.length) best = { full, order: o }; });
    let pos = 0, got = new Set(), trail = [0], el0 = null, api0 = null, locked = false;
    const live = s => { const l = el0?.querySelector('[aria-live]'); if (l) { l.textContent = ''; setTimeout(() => { l.textContent = s; }, 30); } };
    const visit = i => { pos = i; trail.push(i); if (item[i] && !got.has(item[i])) { got.add(item[i]); return t('spz.ui.got', { x: nm(NEED_NAME[item[i]]) }); } return ''; };
    function go(d) { if (locked) return; const j = step(pos, d); if (j < 0) { live(t('spz.ui.wall')); return; } const msg = visit(j); draw(); live([t('spz.ui.moved', { r: Math.floor(j / N) + 1, c: j % N + 1 }), msg, j === goal ? t('spz.ui.atGoal') : ''].filter(Boolean).join(' ')); }
    const gridHtml = (p0, gotS, tr, lv) => `<div class="spz-maze" style="--n:${N}" ${lv ? `tabindex="0" role="application" aria-label="${t('spz.ui.maze')}"` : ''}>${[...Array(cells).keys()].map(i => { const w = walls[i], k = item[i] && !gotS.has(item[i]) ? item[i] : null, here = i === p0;
      return `<${lv ? 'button type="button" tabindex="-1"' : 'div'} class="spz-mc${w[0] ? ' wN' : ''}${w[1] ? ' wE' : ''}${w[2] ? ' wS' : ''}${w[3] ? ' wW' : ''}${tr.includes(i) ? ' trail' : ''}" data-c="${i}" aria-label="${t('spz.ui.cell', { r: Math.floor(i / N) + 1, c: i % N + 1 })}${k ? ', ' + esc(nm(NEED_NAME[k])) : ''}${i === goal ? ', ' + esc(nm('soil')) : ''}${here ? ', ' + t('spz.ui.here') : ''}">${here ? `<span class="spz-sprout" style="--g:${.7 + gotS.size * .12}">${DRAW.sproutIcon()}</span>` : k ? DRAW[k]() : i === goal ? DRAW.soil() : ''}</${lv ? 'button' : 'div'}>`; }).join('')}</div>`;
    function draw() {
      if (!el0) return; const had = el0.querySelector('.spz-maze') === document.activeElement;
      const list = [...got].map(k => nm(NEED_NAME[k])).join(', ') || t('spz.ui.none');
      el0.querySelector('.spz-body').innerHTML = `<div class="board spz-board">${gridHtml(pos, got, trail, true)}</div><p class="spz-has small">${t('spz.ui.has', { list: esc(list) })}</p>
        <div class="spz-pad" role="group" aria-label="${t('spz.ui.maze')}"><button type="button" class="k-btn k-btn-outline" data-d="0" aria-label="${t('spz.ui.up')}">↑</button><button type="button" class="k-btn k-btn-outline" data-d="3" aria-label="${t('spz.ui.left')}">←</button><button type="button" class="k-btn k-btn-outline" data-d="2" aria-label="${t('spz.ui.down')}">↓</button><button type="button" class="k-btn k-btn-outline" data-d="1" aria-label="${t('spz.ui.right')}">→</button><button type="button" class="k-btn k-btn-ghost k-btn-sm spz-restart">${t('spz.ui.restart')}</button></div>`;
      const mz = el0.querySelector('.spz-maze');
      mz.onkeydown = e => { const d = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[e.key]; if (d != null) { e.preventDefault(); go(d); el0.querySelector('.spz-maze')?.focus(); } };
      mz.onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; const j = +b.dataset.c; const d = [0, 1, 2, 3].find(k => step(pos, k) === j); if (d != null) go(d); else if (j !== pos) live(t('spz.ui.wall')); };
      el0.querySelectorAll('[data-d]').forEach(b => { b.onclick = () => { go(+b.dataset.d); el0.querySelector(`[data-d="${b.dataset.d}"]`)?.focus(); }; });
      el0.querySelector('.spz-restart').onclick = () => { if (locked) return; pos = 0; got = new Set(); trail = [0]; draw(); };
      if (had) el0.querySelector('.spz-maze')?.focus({ preventScroll: true });
      api0?.ready(!locked && pos === goal);
    }
    const q = { kind: 'custom', prompt: t('spz.q.maze'),
      mount(el, a) { el0 = el; api0 = a; el.innerHTML = `<div class="spz"><div class="spz-body"></div><p class="k-sr-only" aria-live="polite"></p></div>`; wireHints(el, q); draw(); },
      check() { locked = true; const ok = pos === goal && got.size === needs.length; draw(); return { correct: ok, given: t('spz.ui.has', { list: [...got].map(k => nm(NEED_NAME[k])).join(', ') || t('spz.ui.none') }) }; },
      placeOne() { pos = 0; got = new Set(); trail = [0]; const first = best.order[0]; path(0, first).slice(1).forEach(visit); draw(); },
      solveAll() { pos = 0; got = new Set(); trail = [0]; best.full.slice(1).forEach(visit); draw(); } };
    say1(q);
    const ansVis = `<div class="spz spz-static" inert>${gridHtml(goal, new Set(needs), best.full, false)}</div>`;
    ladder(q, t('spz.h.maze', { list: needs.map(k => nm(NEED_NAME[k])).join(', ') }), t('spz.h.mazeOne', { x: nm(NEED_NAME[item[best.order[0]]]) }), t('spz.h.mazeAns'), ansVis);
    q.answerText = best.order.map(i => nm(NEED_NAME[item[i]])).concat(nm('soil')).join(' → ');
    const steps = tx('spz.y.maze').map(text => ({ text })); steps[steps.length - 1].vis = ansVis;
    q.why = { photo: anyPhoto('leaf', 'sprout'), steps, rule: t('spz.y.mazeRule') };
    return q;
  }

  // ---------- 9. space order (7+) ----------
  const PLANETS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  function planetsQ(r, age) {
    const keys = PLANETS.slice(0, age <= 8 ? 4 : age <= 9 ? 6 : 8);
    const slots = keys.map((k, i) => ({ id: 'p' + i, name: t('spz.ui.step', { n: i + 1 }), num: i + 1 }));
    const p = placer({ layout: 'row', cards: r.shuffle(keys).map(cardOf), slots, answer: Object.fromEntries(keys.map((k, i) => [k, 'p' + i])), oneId: keys[0] });
    p.prompt = t('spz.q.planets'); say1(p);
    ladder(p, t('spz.h.planets'), t('spz.h.one', { x: nm(keys[0]), s: t('spz.ui.step', { n: 1 }) }), null, p.staticVis());
    p.answerText = keys.map(nm).join(' → ');
    const steps = tx('spz.y.planets').map(text => ({ text })); steps[steps.length - 1].vis = p.staticVis();
    p.why = { photo: anyPhoto(keys.includes('saturn') ? 'saturn' : 'earth'), steps, rule: t('spz.y.planetsRule') };
    return p;
  }
  function moonQ(r, age) {
    const all = ['ph0', 'ph1', 'ph2', 'ph3', 'ph4'], keys = age <= 8 ? subset(r, all, 4) : all;
    const slots = keys.map((k, i) => ({ id: 'm' + i, name: t('spz.ui.step', { n: i + 1 }), num: i + 1 }));
    const p = placer({ layout: 'row', cards: r.shuffle(keys).map(cardOf), slots, answer: Object.fromEntries(keys.map((k, i) => [k, 'm' + i])), oneId: keys[0] });
    p.prompt = t('spz.q.moon'); say1(p);
    ladder(p, t('spz.h.moon'), t('spz.h.one', { x: nm(keys[0]), s: t('spz.ui.step', { n: 1 }) }), null, p.staticVis());
    p.answerText = keys.map(nm).join(' → ');
    const steps = tx('spz.y.moon').map(text => ({ text })); steps[steps.length - 1].vis = p.staticVis();
    p.why = { photo: anyPhoto('moon'), steps, rule: t('spz.y.moonRule') };
    return p;
  }

  // ---------- 10. odd one out: pictures (5–8), text riddles (9–10) ----------
  const ODD = [['diet', ['cow', 'goat', 'horse', 'tiger'], 'tiger'], ['fruit', ['apple', 'mango', 'banana', 'chair'], 'chair'], ['bird', ['hen', 'parrot', 'crow', 'dog'], 'dog'], ['insect', ['butterfly', 'bee', 'ant', 'cow'], 'cow'], ['light', ['sun', 'torch', 'bulb', 'moon'], 'moon'], ['under', ['carrot', 'potato', 'onion', 'tomato'], 'tomato'], ['sink', ['stone', 'coin', 'key', 'ball'], 'ball']];
  function oddQ(r, a) {
    const [id, items, odd] = r.pick(ODD), n = AGE.T[AGE.clamp(a)].choices, opts = r.shuffle([odd, ...r.shuffle(items.filter(k => k !== odd)).slice(0, n - 1)]), wrong = opts.find(k => k !== odd);
    return { kind: 'choice', keepChoices: true, prompt: t('spz.q.odd'), promptText: t('spz.q.odd'), choices: opts.map(k => { const p = photoOf(k); return { v: k, img: p?.src, vis: p ? undefined : pic(k), html: esc(nm(k)), say: [{ text: nm(k), lang: I18N.lang }] }; }),
      say: [{ text: t('spz.q.odd') + ' ' + opts.map(nm).join(', '), lang: I18N.lang }], answer: odd, answerText: esc(nm(odd)),
      hints: [{ text: t('spz.h.odd') }, { text: t('spz.h.notIt', { x: esc(nm(wrong)) }) }, { text: t('spz.h.isIt', { x: esc(nm(odd)) }) }], hintRevealsAnswer: true,
      why: { photo: anyPhoto(odd), steps: [{ text: t('spz.odd.' + id) }] } };
  }
  const RIDDLES = [['tree', ['tree', 'cow', 'stone', 'cloud'], 'leaf'], ['water', ['water', 'oil', 'sand', 'air'], 'ice'], ['magnet', ['magnet', 'battery', 'torch', 'bulb'], 'magnet'], ['sun', ['sun', 'moon', 'mars', 'torch'], 'sun'], ['copper', ['copperwire', 'rubber', 'wood', 'plastic'], 'copperwire'], ['pupa', ['pupa', 'egg', 'nest', 'leaf'], 'butterfly'], ['saturn', ['saturn', 'earth', 'mars', 'mercury'], 'saturn'], ['lungs', ['lungs', 'stomach', 'brain', 'teeth'], 'lungs']];
  function riddleQ(r) {
    const [id, opts0, ph] = r.pick(RIDDLES), R = tx('spz.rid.' + id), ans = opts0[0], opts = r.shuffle(opts0), wrong = opts.find(k => k !== ans);
    return { kind: 'choice', keepChoices: true, prompt: t('spz.q.riddle', { r: esc(R[0]) }), promptText: t('spz.q.riddle', { r: R[0] }), choices: opts.map(k => ({ v: k, html: esc(nm(k)) })), answer: ans, answerText: esc(nm(ans)),
      say: [{ text: t('spz.q.riddle', { r: R[0] }) + ' ' + opts.map(nm).join(', '), lang: I18N.lang }],
      hints: [{ text: t('spz.h.riddle') }, { text: t('spz.h.notIt', { x: esc(nm(wrong)) }) }, { text: t('spz.h.isIt', { x: esc(nm(ans)) }) }], hintRevealsAnswer: true,
      why: { photo: anyPhoto(ph), steps: [{ text: esc(R[1]) }] } };
  }

  // ---------- skills: each variant carries its own age range ----------
  const SKILLS = [];
  function defSkill(id, variants) {
    const min = Math.min(...variants.map(v => v.min)), max = Math.max(...variants.map(v => v.max));
    SKILLS.push({ id, min, max, variants });
    skill({ id, subject: S, topic: 'scipuzzles', name: 'spz.skill.' + id.slice(4), bands: { young: [1, 2], older: [1, 3] }, warm: false, gen(l, r, ctx) {
      const age = AGE.clamp(ctx?.age ?? 6);
      let vs = variants.filter(v => age >= v.min && age <= v.max), a = age;
      if (!vs.length) { const v = variants.reduce((b, x) => Math.abs(Math.min(x.max, Math.max(x.min, age)) - age) < Math.abs(Math.min(b.max, Math.max(b.min, age)) - age) ? x : b); vs = [v]; a = Math.min(v.max, Math.max(v.min, age)); }
      const v = r.pick(vs), q = v.make(r, a, l);
      q.spz = { id, variant: v.id, min: v.min, max: v.max, age: a };
      return q;
    } });
  }
  defSkill('spz.cycle', Object.entries(CYCLES).map(([k, C]) => ({ id: k, min: C.min, max: 10, make: (r, a) => cycleQ(r, a, k) })));
  defSkill('spz.sort', Object.entries(SORTS).map(([k, D]) => ({ id: k, min: D.min, max: D.max, make: (r, a) => sortQ(r, a, k) })));
  defSkill('spz.face', [{ id: 'face', min: 3, max: 5, make: faceQ }]);
  defSkill('spz.body', [{ id: 'body', min: 6, max: 10, make: bodyQ }]);
  defSkill('spz.chain', [{ id: 'chain', min: 5, max: 10, make: chainQ }, { id: 'web', min: 9, max: 10, make: webQ }]);
  defSkill('spz.shadow', [{ id: 'shadow', min: 5, max: 10, make: shadowQ }]);
  defSkill('spz.maze', [{ id: 'maze', min: 5, max: 10, make: mazeQ }]);
  defSkill('spz.pipes', [{ id: 'pipes', min: 6, max: 10, make: pipesQ }]);
  defSkill('spz.circuit', [{ id: 'circuit', min: 7, max: 10, make: circuitQ }]);
  defSkill('spz.space', [{ id: 'planets', min: 7, max: 10, make: planetsQ }, { id: 'moon', min: 7, max: 10, make: moonQ }]);
  defSkill('spz.odd', [{ id: 'pictures', min: 5, max: 8, make: oddQ }, { id: 'riddles', min: 9, max: 10, make: riddleQ }]);

  const idsFor = p => { const a = AGE.of(p).age; return SKILLS.filter(s => a >= s.min && a <= s.max && AGE.allowSkill(p, s.id)).map(s => s.id); };
  const game = { title: 'spz.title', blurb: 'spz.blurb', icon: 'i-science', start(p) {
    const ids = idsFor(p), n = AGE.of(p).round;
    const due = Store.due(p, S).filter(x => ids.includes(x.skill)).slice(0, 2).map(x => ({ skill: x.skill, lvl: x.lvl, seed: x.seed }));
    Engine.start({ items: [...due, ...Engine.weighted(p, ids, Math.max(0, n - due.length))], title: t('spz.title'), subject: S, topic: 'scipuzzles', mode: 'scipuzzles', back: '#/s/science', again: () => game.start(p) });
  } };
  window.SCIPZ = { game, SKILLS, idsFor };
})();
