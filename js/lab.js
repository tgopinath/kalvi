// Science lab: experiments that teach the scientific method. Each one runs as a 6-step stepper:
// question → predict → plan a fair test → run on the bench → record (table / chart) → conclude (+ lesson card).
// Predictions and results are saved in p.extras.lab (the lab notebook, shown in the parent view).
(function () {
  const esc = Engine.esc, L = v => I18N.loc(v);
  I18N.add({ lab: {
    title: ['Science lab', 'அறிவியல் ஆய்வகம்'], blurb: ['Guess, test fairly, record and explain, like a real scientist.', 'ஊகி, நியாயமாகச் சோதி, பதிவு செய், விளக்கு: உண்மையான அறிவியலாளர் போல.'],
    list: ['Experiments', 'சோதனைகள்'], done: ['Done', 'முடிந்தது'], open: ['Start', 'தொடங்கு'], skill: ['Lab conclusions', 'ஆய்வக முடிவுகள்'],
    step: { q: ['Question', 'கேள்வி'], predict: ['Predict', 'கணிப்பு'], plan: ['Fair test', 'நியாயமான சோதனை'], run: ['Run it', 'சோதனை'], record: ['Record', 'பதிவு'], conclude: ['Conclude', 'முடிவு'] },
    hyp: ['Your hypothesis (கருதுகோள்) is your best guess before testing.', 'சோதிக்கும் முன் உன் சிறந்த ஊகமே கருதுகோள் (hypothesis).'],
    pickEach: ['Choose a guess for every item.', 'ஒவ்வொரு பொருளுக்கும் ஓர் ஊகத்தைத் தேர்ந்தெடு.'], pickOne: ['Choose one.', 'ஒன்றைத் தேர்ந்தெடு.'], saved: ['Prediction saved.', 'கணிப்பு சேமிக்கப்பட்டது.'],
    runBtn: ['Run the experiment', 'சோதனையை நடத்து'], observe: ['Watch closely and see what happens.', 'கூர்ந்து கவனி; என்ன நடக்கிறது என்று பார்.'],
    item: ['Item', 'பொருள்'], guess: ['Your guess', 'உன் ஊகம்'], result: ['Result', 'முடிவு'], chart: ['Chart', 'வரைபடம்'],
    score: ['Your predictions matched {a} of {b}.', 'உன் கணிப்புகளில் {b}-இல் {a} பொருந்தின.'], right: ['Your prediction was right.', 'உன் கணிப்பு சரி.'], wrongP: ['The test showed something different. That is how scientists learn.', 'சோதனை வேறு ஒன்றைக் காட்டியது. அறிவியலாளர்கள் இப்படித்தான் கற்கிறார்கள்.'],
    concludeQ: ['What can we conclude?', 'நாம் என்ன முடிவுக்கு வரலாம்?'], next: ['Next step', 'அடுத்த படி'], back: ['Back', 'பின்'], finish: ['Save to notebook', 'குறிப்பேட்டில் சேமி'], notebookSaved: ['Saved in the lab notebook.', 'ஆய்வுக் குறிப்பேட்டில் சேமிக்கப்பட்டது.'],
    young: ['What will we change?', 'எதை மாற்றப் போகிறோம்?'],
  } });
  // shared category labels
  const C = {
    float: ['floats', 'மிதக்கும்'], sink: ['sinks', 'மூழ்கும்'], dis: ['dissolves', 'கரையும்'], nodis: ['does not dissolve', 'கரையாது'], yes: ['pulled', 'இழுக்கப்படும்'], no: ['not pulled', 'இழுக்கப்படாது'],
    on: ['bulb lights', 'விளக்கு எரியும்'], off: ['bulb stays dark', 'விளக்கு எரியாது'], orange: ['orange', 'ஆரஞ்சு'], green: ['green', 'பச்சை'], purple: ['purple', 'ஊதா'],
  };
  const fair = (q, opts, why) => ({ q, opts, a: 0, why });
  const X = [
    { id: 'float', lvl: 1, icon: 'i-drop', title: ['Sink or float', 'மூழ்குமா மிதக்குமா'], q: ['Which things float in water?', 'எந்தப் பொருள்கள் நீரில் மிதக்கும்?'], kind: 'cat', cats: ['float', 'sink'],
      items: [['wood', ['wooden block', 'மரக்கட்டை'], 'float'], ['coin', ['₹5 coin', '₹5 நாணயம்'], 'sink'], ['leaf', ['leaf', 'இலை'], 'float'], ['stone', ['stone', 'கல்'], 'sink'], ['bottle', ['empty plastic bottle', 'காலி நெகிழிப் பாட்டில்'], 'float'], ['apple', ['apple', 'ஆப்பிள்'], 'float']],
      plan: fair(['To compare fairly, what should stay the same?', 'நியாயமாக ஒப்பிட எது மாறாமல் இருக்க வேண்டும்?'], [['The same bucket of water for every item', 'எல்லாப் பொருளுக்கும் அதே வாளி நீர்'], ['A different bucket for each item', 'ஒவ்வொரு பொருளுக்கும் வேறு வாளி'], ['Throw some items harder', 'சிலவற்றை வேகமாக எறிவது']], ['Only the item changes. If the water changed too, we would not know which made the difference.', 'பொருள் மட்டுமே மாறுகிறது. நீரும் மாறினால் எது வேறுபாட்டை உண்டாக்கியது என்று தெரியாது.']),
      conclude: { o: [['Things lighter than the same amount of water float, whatever their size', 'அதே அளவு நீரை விட லேசான பொருள்கள், அளவு எதுவாயினும், மிதக்கும்'], ['Only small things float', 'சிறிய பொருள்கள் மட்டுமே மிதக்கும்'], ['Only round things sink', 'உருண்டையானவை மட்டுமே மூழ்கும்']], why: [['A big apple floats and a tiny coin sinks, so size is not the reason. Floating depends on how heavy something is for its size (density).', 'பெரிய ஆப்பிள் மிதக்கிறது, சிறிய நாணயம் மூழ்குகிறது. அதனால் அளவு காரணம் அல்ல. அளவுக்கு ஏற்ற கனமே (அடர்த்தி) மிதத்தலைத் தீர்மானிக்கிறது.']] },
      home: { need: [['a bucket of water', 'ஒரு வாளி நீர்'], ['six small things from the kitchen', 'சமையலறையிலிருந்து ஆறு சிறு பொருள்கள்']], steps: [['Guess first and write it down.', 'முதலில் ஊகித்து எழுது.'], ['Lower each thing gently into the water.', 'ஒவ்வொன்றையும் மெதுவாக நீரில் வை.'], ['Tick float or sink.', 'மிதந்ததா மூழ்கியதா என்று குறி.']], note: ['Stay with children near water.', 'நீருக்கு அருகில் குழந்தைகளுடன் இருங்கள்.'] } },
    { id: 'dissolve', lvl: 1, icon: 'i-matter', title: ['What dissolves', 'எது கரையும்'], q: ['Which of these dissolve in water?', 'இவற்றில் எவை நீரில் கரையும்?'], kind: 'cat', cats: ['dis', 'nodis'],
      items: [['salt', ['salt', 'உப்பு'], 'dis'], ['sugar', ['sugar', 'சர்க்கரை'], 'dis'], ['sand', ['sand', 'மணல்'], 'nodis'], ['oil', ['coconut oil', 'தேங்காய் எண்ணெய்'], 'nodis']],
      plan: fair(['We want to test if stirring helps. What should we change?', 'கலக்குவது உதவுமா என்று சோதிக்க வேண்டும். எதை மாற்ற வேண்டும்?'], [['Only the stirring: same water, same spoonful', 'கலக்குவதை மட்டும்: அதே நீர், அதே ஒரு கரண்டி'], ['The stirring and the water temperature', 'கலக்குவதும் நீரின் வெப்பமும்'], ['Use more sugar in the stirred glass', 'கலக்கும் கிளாஸில் அதிக சர்க்கரை']], ['Change one thing at a time, so you know that thing caused the difference.', 'ஒரே நேரத்தில் ஒன்றை மட்டும் மாற்று; அப்போதுதான் அதுதான் காரணம் என்று தெரியும்.']),
      conclude: { o: [['Salt and sugar dissolve; sand and oil do not. Stirring and warm water make dissolving faster.', 'உப்பும் சர்க்கரையும் கரையும்; மணலும் எண்ணெயும் கரையாது. கலக்குவதும் வெதுவெதுப்பான நீரும் கரைவதை வேகப்படுத்தும்.'], ['Everything dissolves if you wait', 'காத்திருந்தால் எல்லாம் கரையும்'], ['Nothing dissolves in cold water', 'குளிர்ந்த நீரில் எதுவும் கரையாது']], why: [['Salt and sugar break into pieces too small to see and spread through the water. Sand grains stay whole, and oil floats in a layer.', 'உப்பும் சர்க்கரையும் கண்ணுக்குத் தெரியாத அளவு சிறு துகள்களாகப் பிரிந்து நீரில் பரவுகின்றன. மணல் அப்படியே இருக்கும்; எண்ணெய் மேலே அடுக்காக மிதக்கும்.']] },
      home: { need: [['four clear glasses of water', 'நான்கு கண்ணாடி கிளாஸ் நீர்'], ['a spoon', 'ஒரு கரண்டி']], steps: [['Add one spoonful of each to its own glass.', 'ஒவ்வொன்றிலும் ஒரு கரண்டி தனித்தனியாகச் சேர்.'], ['Stir ten times and wait a minute.', 'பத்து முறை கலக்கி ஒரு நிமிடம் காத்திரு.'], ['Can you still see it?', 'இன்னும் தெரிகிறதா?']], note: ['Use only kitchen items; do not taste the sand glass.', 'சமையலறைப் பொருள்கள் மட்டும்; மணல் கிளாஸைச் சுவைக்க வேண்டாம்.'] } },
    { id: 'magnet', lvl: 1, icon: 'i-magnet', title: ['What magnets pick up', 'காந்தம் எதை எடுக்கும்'], q: ['Which things does a magnet pull?', 'காந்தம் எந்தப் பொருள்களை இழுக்கும்?'], kind: 'cat', cats: ['yes', 'no'], sim: 'magnet',
      items: [['nail', ['iron nail', 'இரும்பு ஆணி'], 'yes'], ['clip', ['paper clip', 'காகிதக் கவ்வி'], 'yes'], ['spoon', ['steel spoon', 'எஃகுக் கரண்டி'], 'yes'], ['foil', ['aluminium foil', 'அலுமினியத் தாள்'], 'no'], ['eraser', ['rubber', 'அழிப்பான்'], 'no'], ['stick', ['wooden stick', 'மரக்குச்சி'], 'no']],
      plan: fair(['What keeps this test fair?', 'இந்தச் சோதனையை எது நியாயமாக்கும்?'], [['Use the same magnet at the same distance', 'அதே காந்தம், அதே தூரம்'], ['Use a big magnet for some items', 'சிலவற்றுக்குப் பெரிய காந்தம்'], ['Touch some items, not others', 'சிலவற்றைத் தொடு, சிலவற்றைத் தொடாதே']], ['If the magnet or distance changed, a weak pull might be the magnet, not the material.', 'காந்தமோ தூரமோ மாறினால், இழுப்பு குறைந்தது பொருளால் அல்ல, காந்தத்தால் இருக்கலாம்.']),
      conclude: { o: [['Magnets pull iron and steel, not all metals', 'காந்தம் இரும்பையும் எஃகையும் இழுக்கும், எல்லா உலோகங்களையும் அல்ல'], ['Magnets pull every metal', 'காந்தம் எல்லா உலோகத்தையும் இழுக்கும்'], ['Magnets pull shiny things', 'காந்தம் பளபளப்பானவற்றை இழுக்கும்']], why: [['Aluminium foil is a shiny metal but is not pulled. Only iron, steel, nickel and cobalt are magnetic.', 'அலுமினியத் தாள் பளபளக்கும் உலோகம், ஆனால் இழுக்கப்படவில்லை. இரும்பு, எஃகு, நிக்கல், கோபால்ட் மட்டுமே காந்தத்தால் ஈர்க்கப்படும்.']] },
      home: { need: [['a fridge magnet', 'குளிர்சாதனப் பெட்டிக் காந்தம்'], ['ten small things', 'பத்துச் சிறு பொருள்கள்']], steps: [['Sort your guesses into two piles.', 'ஊகங்களை இரண்டு குவியலாகப் பிரி.'], ['Test each one.', 'ஒவ்வொன்றையும் சோதி.']], note: ['Keep magnets away from phones and small children.', 'காந்தங்களைத் தொலைபேசிகள், சிறு குழந்தைகளிடமிருந்து தள்ளி வையுங்கள்.'] } },
    { id: 'circuit', lvl: 2, icon: 'i-bolt', title: ['Conductors and insulators', 'கடத்திகளும் காப்பான்களும்'], q: ['Which materials let electricity through?', 'எந்தப் பொருள்கள் மின்சாரத்தைச் செல்ல விடும்?'], kind: 'cat', cats: ['on', 'off'], sim: 'circuit',
      items: [['copper', ['copper wire', 'செம்புக் கம்பி'], 'on'], ['spoon', ['steel spoon', 'எஃகுக் கரண்டி'], 'on'], ['rubber', ['rubber band', 'ரப்பர் வளையம்'], 'off'], ['wood', ['wooden stick', 'மரக்குச்சி'], 'off'], ['lead', ['pencil lead', 'பென்சில் கரி'], 'on']],
      plan: fair(['What must stay the same for each material?', 'ஒவ்வொரு பொருளுக்கும் எது மாறாமல் இருக்க வேண்டும்?'], [['The same battery, bulb and wires', 'அதே மின்கலம், விளக்கு, கம்பிகள்'], ['A new battery each time', 'ஒவ்வொரு முறையும் புதிய மின்கலம்'], ['A brighter bulb for metals', 'உலோகங்களுக்குப் பிரகாசமான விளக்கு']], ['Then the only difference is the material in the gap.', 'அப்போது இடைவெளியில் உள்ள பொருள் மட்டுமே வேறுபாடு.']),
      conclude: { o: [['Metals and pencil lead conduct; rubber and wood insulate', 'உலோகங்களும் பென்சில் கரியும் கடத்தும்; ரப்பரும் மரமும் தடுக்கும்'], ['Only copper conducts', 'செம்பு மட்டுமே கடத்தும்'], ['Everything conducts a little', 'எல்லாம் சிறிது கடத்தும்']], why: [['Pencil lead is graphite, a form of carbon that conducts, so the bulb glows dimly. Rubber and wood stop the flow.', 'பென்சில் கரி கிராஃபைட் எனும் கார்பன்; அது கடத்தும், அதனால் விளக்கு மங்கலாக எரியும். ரப்பரும் மரமும் பாய்ச்சலைத் தடுக்கும்.']] },
      home: { need: [['a torch', 'ஒரு டார்ச்']], steps: [['With a grown-up, look at how the parts touch inside.', 'பெரியவருடன் உள்ளே பாகங்கள் எப்படித் தொடுகின்றன என்று பார்.']], note: ['Small batteries only. Never touch plugs or sockets.', 'சிறிய மின்கலங்கள் மட்டும். பிளக், சாக்கெட்டைத் தொடவே கூடாது.'] } },
    { id: 'seed', lvl: 1, icon: 'i-tree', title: ['What seeds need', 'விதைகளுக்கு என்ன தேவை'], q: ['Which pot grows the tallest seedling in 10 days?', '10 நாட்களில் எந்தத் தொட்டியில் நாற்று உயரமாக வளரும்?'], kind: 'num', unit: 'cm', sim: 'plant',
      items: [['all', ['water, light and soil', 'நீர், ஒளி, மண்'], 9], ['dark', ['water and soil, in the dark', 'நீர், மண், இருட்டில்'], 3], ['dry', ['light and soil, no water', 'ஒளி, மண், நீர் இல்லை'], 0], ['cotton', ['water and light on wet cotton', 'ஈரப் பஞ்சில் நீர், ஒளி'], 5]],
      plan: fair(['To test light fairly, what else must be the same?', 'ஒளியை நியாயமாகச் சோதிக்க, வேறு எது மாறக்கூடாது?'], [['Same seeds, same water, same pots', 'அதே விதைகள், அதே நீர், அதே தொட்டிகள்'], ['More water for the dark pot', 'இருட்டுத் தொட்டிக்கு அதிக நீர்'], ['Bigger seeds in the sunny pot', 'வெயில் தொட்டியில் பெரிய விதைகள்']], ['If the dark pot got more water, we could not tell whether light or water made the difference.', 'இருட்டுத் தொட்டிக்கு அதிக நீர் கிடைத்தால், ஒளியா நீரா காரணம் என்று சொல்ல முடியாது.']),
      conclude: { o: [['Seedlings need water to grow and light to stay green and strong', 'நாற்றுகள் வளர நீரும், பச்சையாக வலுவாக இருக்க ஒளியும் தேவை'], ['Seedlings grow best in the dark', 'நாற்றுகள் இருட்டில் நன்றாக வளரும்'], ['Seeds need nothing', 'விதைகளுக்கு எதுவும் தேவையில்லை']], why: [['Seeds sprout using food stored inside them, so the dark one starts but grows thin and pale. Without water nothing happens.', 'விதைகள் தமக்குள் சேமித்த உணவால் முளைக்கின்றன; இருட்டில் உள்ளது தொடங்கும், ஆனால் மெலிந்து வெளிறும். நீர் இல்லாமல் எதுவும் நடக்காது.']] },
      home: { need: [['green gram seeds', 'பச்சைப் பயறு'], ['four cups with soil or cotton', 'மண் அல்லது பஞ்சுள்ள நான்கு கோப்பைகள்']], steps: [['Set up the four pots as in the lab.', 'ஆய்வகத்தில் உள்ளதுபோல் நான்கு தொட்டிகளை அமை.'], ['Measure the tallest shoot each day.', 'தினமும் உயரமான முளையை அள.']], note: ['Green gram sprouts in a day or two.', 'பச்சைப் பயறு ஓரிரு நாளில் முளைக்கும்.'] } },
    { id: 'ice', lvl: 2, icon: 'i-sun', title: ['Which ice melts fastest', 'எந்தப் பனிக்கட்டி வேகமாக உருகும்'], q: ['Where does an ice cube melt fastest?', 'பனிக்கட்டி எங்கே மிக வேகமாக உருகும்?'], kind: 'num', unit: 'min', low: true, sim: 'matter',
      items: [['sun', ['in the sun', 'வெயிலில்'], 12], ['shade', ['in the shade', 'நிழலில்'], 25], ['salt', ['sprinkled with salt', 'உப்புத் தூவியது'], 9], ['cloth', ['wrapped in a cloth', 'துணியால் சுற்றியது'], 48]],
      plan: fair(['What must be the same for every ice cube?', 'ஒவ்வொரு பனிக்கட்டிக்கும் எது ஒன்றாக இருக்க வேண்டும்?'], [['Same size cubes from the same tray', 'அதே தட்டிலிருந்து அதே அளவு கட்டிகள்'], ['A bigger cube in the sun', 'வெயிலில் பெரிய கட்டி'], ['Start them at different times', 'வெவ்வேறு நேரங்களில் தொடங்குவது']], ['A bigger cube takes longer anyway, so size must be the same.', 'பெரிய கட்டி இயல்பாகவே தாமதமாகும்; அதனால் அளவு ஒன்றாக இருக்க வேண்டும்.']),
      conclude: { o: [['Heat and salt speed melting; a cloth slows it by keeping warm air away', 'வெப்பமும் உப்பும் உருகுவதை வேகப்படுத்தும்; துணி சூடான காற்றைத் தடுத்து மெதுவாக்கும்'], ['A cloth warms the ice', 'துணி பனியைச் சூடாக்கும்'], ['Salt freezes ice harder', 'உப்பு பனியை இன்னும் உறைய வைக்கும்']], why: [['A cloth is an insulator: it slows heat getting in. That is also why a thick blanket keeps you warm.', 'துணி ஒரு காப்பான்: வெப்பம் உள்ளே வருவதை மெதுவாக்கும். அதனால்தான் போர்வை நம்மைச் சூடாக வைக்கிறது.']] },
      home: { need: [['four ice cubes', 'நான்கு பனிக்கட்டிகள்'], ['four plates, salt, a cloth', 'நான்கு தட்டுகள், உப்பு, துணி']], steps: [['Set them up at the same time.', 'ஒரே நேரத்தில் அமை.'], ['Check every five minutes.', 'ஐந்து நிமிடத்திற்கு ஒருமுறை பார்.']], note: ['Wipe up melted water so no one slips.', 'யாரும் வழுக்காமல் உருகிய நீரைத் துடையுங்கள்.'] } },
    { id: 'shadow', lvl: 2, icon: 'i-sun', title: ['Shadow sizes', 'நிழலின் அளவு'], q: ['How does the torch distance change a shadow?', 'டார்ச்சின் தூரம் நிழலை எப்படி மாற்றும்?'], kind: 'num', unit: 'cm',
      items: [['d20', ['torch 20 cm away', '20 செ.மீ. தூரத்தில் டார்ச்'], 30], ['d40', ['torch 40 cm away', '40 செ.மீ. தூரத்தில்'], 18], ['d60', ['torch 60 cm away', '60 செ.மீ. தூரத்தில்'], 14], ['d80', ['torch 80 cm away', '80 செ.மீ. தூரத்தில்'], 12]],
      plan: fair(['Which one thing do we change?', 'எந்த ஒன்றை மாற்றுகிறோம்?'], [['Only the torch distance', 'டார்ச்சின் தூரம் மட்டும்'], ['The toy and the distance', 'பொம்மையும் தூரமும்'], ['The wall and the torch', 'சுவரும் டார்ச்சும்']], ['Keep the toy and the wall in place, and move only the torch.', 'பொம்மையையும் சுவரையும் அப்படியே வை; டார்ச்சை மட்டும் நகர்த்து.']),
      conclude: { o: [['The closer the light, the bigger the shadow', 'ஒளி அருகில் இருந்தால் நிழல் பெரிதாகும்'], ['The closer the light, the smaller the shadow', 'ஒளி அருகில் இருந்தால் நிழல் சிறியதாகும்'], ['Distance makes no difference', 'தூரம் எந்த மாற்றமும் தராது']], why: [['Light travels in straight lines. Near the torch, the toy blocks a wider cone of light, so the shadow spreads out.', 'ஒளி நேர்கோட்டில் செல்லும். டார்ச் அருகில் இருக்கும்போது பொம்மை அகலமான ஒளிக்கூம்பைத் தடுக்கிறது; நிழல் விரிகிறது.']] },
      home: { need: [['a torch', 'டார்ச்'], ['a small toy', 'சிறு பொம்மை'], ['a wall', 'சுவர்']], steps: [['Darken the room.', 'அறையை இருட்டாக்கு.'], ['Move the torch closer and further; measure the shadow.', 'டார்ச்சை அருகிலும் தூரத்திலும் நகர்த்தி நிழலை அள.']], note: ['Do not shine the torch in anyone’s eyes.', 'யார் கண்ணிலும் டார்ச் அடிக்க வேண்டாம்.'] } },
    { id: 'ramp', lvl: 2, icon: 'i-ramp', title: ['Ramp and toy car', 'சரிவும் பொம்மைக் காரும்'], q: ['How does the ramp’s surface change how far a car rolls?', 'சரிவின் பரப்பு கார் உருளும் தூரத்தை எப்படி மாற்றும்?'], kind: 'num', unit: 'cm', sim: 'ramp',
      items: [['tile', ['smooth floor tiles', 'வழுவழுப்பான தரை ஓடுகள்'], 160], ['wood', ['wooden board', 'மரப் பலகை'], 110], ['mat', ['straw mat (paai)', 'பாய்'], 60], ['towel', ['towel', 'துண்டு'], 35]],
      plan: fair(['What keeps the race fair?', 'பந்தயத்தை எது நியாயமாக்கும்?'], [['Same car, same height, let go without pushing', 'அதே கார், அதே உயரம், தள்ளாமல் விடுவது'], ['A higher ramp for the towel', 'துண்டுக்கு உயரமான சரிவு'], ['Push the car on the mat', 'பாயில் காரைத் தள்ளுவது']], ['Only the surface changes, so any difference in distance comes from friction.', 'பரப்பு மட்டுமே மாறுகிறது; தூர வேறுபாடு உராய்வால் மட்டுமே.']),
      conclude: { o: [['Rougher surfaces have more friction, so the car stops sooner', 'சொரசொரப்பான பரப்பில் உராய்வு அதிகம்; கார் சீக்கிரம் நிற்கும்'], ['Rough surfaces make cars faster', 'சொரசொரப்பு காரை வேகப்படுத்தும்'], ['Surface does not matter', 'பரப்பு முக்கியமில்லை']], why: [['Friction rubs against the wheels and turns the movement into a little heat.', 'உராய்வு சக்கரங்களுடன் தேய்த்து இயக்கத்தைச் சிறிது வெப்பமாக மாற்றுகிறது.']] },
      home: { need: [['a toy car', 'பொம்மைக் கார்'], ['a board and books', 'பலகை, புத்தகங்கள்']], steps: [['Let the car go from the same spot each time.', 'ஒவ்வொரு முறையும் அதே இடத்திலிருந்து விடு.'], ['Measure with a tape.', 'நாடாவால் அள.']], note: ['Keep the slope low.', 'சரிவைத் தாழ்வாக வையுங்கள்.'] } },
    { id: 'colours', lvl: 1, icon: 'i-prism', title: ['Mixing colours', 'நிறங்களைக் கலத்தல்'], q: ['What colour do two paint colours make?', 'இரண்டு வண்ணங்கள் சேர்ந்தால் என்ன நிறம்?'], kind: 'cat', cats: ['orange', 'green', 'purple'],
      items: [['ry', ['red + yellow', 'சிவப்பு + மஞ்சள்'], 'orange'], ['by', ['blue + yellow', 'நீலம் + மஞ்சள்'], 'green'], ['rb', ['red + blue', 'சிவப்பு + நீலம்'], 'purple']],
      plan: fair(['How do we mix fairly?', 'நியாயமாக எப்படிக் கலப்பது?'], [['Equal drops of each colour', 'ஒவ்வொரு நிறத்திலும் சம அளவு துளிகள்'], ['Lots of one colour and a little of the other', 'ஒன்றில் அதிகம், மற்றதில் சிறிது'], ['Different brushes for each mix', 'ஒவ்வொரு கலவைக்கும் வேறு தூரிகை, கழுவாமல்']], ['Equal amounts give the true middle colour.', 'சம அளவு கலந்தால் உண்மையான இடைநிறம் கிடைக்கும்.']),
      conclude: { o: [['Two primary colours make a secondary colour', 'இரண்டு முதன்மை நிறங்கள் ஓர் இரண்டாம் நிலை நிறத்தைத் தரும்'], ['Mixing always makes brown', 'கலந்தால் எப்போதும் பழுப்பு'], ['Yellow always wins', 'எப்போதும் மஞ்சள் வெல்லும்']], why: [['Red, yellow and blue are the primary paint colours. Orange, green and purple are secondary colours made from two of them.', 'சிவப்பு, மஞ்சள், நீலம் முதன்மை வண்ணங்கள். ஆரஞ்சு, பச்சை, ஊதா அவற்றில் இரண்டைக் கலந்து வரும் இரண்டாம் நிலை நிறங்கள்.']] },
      home: { need: [['three paints', 'மூன்று வண்ணங்கள்'], ['a plate', 'ஒரு தட்டு']], steps: [['Put two drops side by side and mix.', 'இரண்டு துளிகளை அருகருகே வைத்துக் கலக்கு.']], note: ['Use washable paints.', 'கழுவக்கூடிய வண்ணங்களைப் பயன்படுத்துங்கள்.'] } },
    { id: 'evap', lvl: 2, icon: 'i-cloud', title: ['Drying clothes', 'துணி உலர்தல்'], q: ['Where does a wet cloth dry fastest?', 'ஈரத் துணி எங்கே வேகமாக உலரும்?'], kind: 'num', unit: 'min', low: true, sim: 'water',
      items: [['sunwind', ['sun and wind', 'வெயிலும் காற்றும்'], 40], ['sun', ['sun, no wind', 'வெயில், காற்று இல்லை'], 70], ['shade', ['shade', 'நிழல்'], 150], ['folded', ['shade, folded up', 'நிழல், மடித்தது'], 300]],
      plan: fair(['What must be the same?', 'எது ஒன்றாக இருக்க வேண்டும்?'], [['Same size cloths, equally wet', 'அதே அளவு துணிகள், சம அளவு ஈரம்'], ['A wetter cloth in the sun', 'வெயிலில் அதிக ஈரத் துணி'], ['A thicker cloth in the shade', 'நிழலில் தடித்த துணி']], ['Otherwise a cloth might dry first just because it was less wet.', 'இல்லையெனில் குறைந்த ஈரம் என்பதாலேயே ஒரு துணி முதலில் உலரலாம்.']),
      conclude: { o: [['Heat, wind and spreading out all speed up evaporation', 'வெப்பம், காற்று, விரித்தல் மூன்றும் ஆவியாதலை வேகப்படுத்தும்'], ['Clothes dry faster folded', 'மடித்தால் வேகமாக உலரும்'], ['Wind slows drying', 'காற்று உலர்தலைத் தாமதப்படுத்தும்']], why: [['Warm water evaporates faster, wind carries the vapour away, and spreading out gives more surface.', 'சூடான நீர் வேகமாக ஆவியாகும்; காற்று நீராவியைக் கொண்டு செல்லும்; விரித்தால் அதிகப் பரப்பு கிடைக்கும்.']] },
      home: { need: [['four handkerchiefs', 'நான்கு கைக்குட்டைகள்']], steps: [['Wet them equally and hang them in different places.', 'சம அளவு நனைத்து வெவ்வேறு இடங்களில் தொங்கவிடு.']], note: ['No grown-up help needed.', 'பெரியவர் உதவி தேவையில்லை.'] } },
    { id: 'phone', lvl: 2, older: true, icon: 'i-wave', title: ['String-cup phone', 'நூல் கோப்பைத் தொலைபேசி'], q: ['When is the voice loudest through a string phone?', 'நூல் தொலைபேசியில் குரல் எப்போது அதிகம் கேட்கும்?'], kind: 'num', unit: '/10',
      items: [['taut', ['string pulled tight', 'இறுக்கமான நூல்'], 8], ['slack', ['string loose', 'தளர்ந்த நூல்'], 2], ['pinched', ['tight, but pinched by a finger', 'இறுக்கம், ஆனால் விரலால் பிடித்தது'], 1], ['long', ['tight and twice as long', 'இறுக்கம், இரு மடங்கு நீளம்'], 6]],
      plan: fair(['What stays the same?', 'எது மாறாமல் இருக்கிறது?'], [['The same cups and the same quiet voice', 'அதே கோப்பைகள், அதே மென்குரல்'], ['Shout for the slack string', 'தளர்ந்த நூலுக்குக் கத்துவது'], ['Different cups each time', 'ஒவ்வொரு முறையும் வேறு கோப்பைகள்']], ['If you shouted, the loudness would come from you, not the string.', 'நீ கத்தினால், ஒலியளவு நூலால் அல்ல, உன்னால் வரும்.']),
      conclude: { o: [['Sound travels along a tight string; slack or pinched strings stop the vibrations', 'இறுக்கமான நூலில் ஒலி பயணிக்கும்; தளர்ந்த அல்லது பிடித்த நூல் அதிர்வுகளைத் தடுக்கும்'], ['Sound travels through the air only', 'ஒலி காற்றில் மட்டுமே பயணிக்கும்'], ['A longer string is always louder', 'நீளமான நூல் எப்போதும் உரக்கக் கேட்கும்']], why: [['Your voice makes the cup vibrate, and a tight string passes the vibration to the other cup.', 'உன் குரல் கோப்பையை அதிர வைக்கிறது; இறுக்கமான நூல் அந்த அதிர்வை மறு கோப்பைக்குக் கடத்துகிறது.']] },
      home: { need: [['two paper cups', 'இரண்டு காகிதக் கோப்பைகள்'], ['3 m of string', '3 மீ. நூல்']], steps: [['A grown-up makes a small hole in each cup and ties the string.', 'பெரியவர் ஒவ்வொரு கோப்பையிலும் சிறு துளை இட்டு நூலைக் கட்டுவார்.'], ['Pull tight and whisper.', 'இறுக்கி இழுத்து மெதுவாகப் பேசு.']], note: ['A grown-up makes the holes with a pencil tip, not a knife.', 'துளையைக் கத்தியால் அல்ல, பென்சில் முனையால் பெரியவர் இடுவார்.'] } },
  ];
  const byId = Object.fromEntries(X.map(x => [x.id, x]));
  const forBand = (x, p) => p.band === 'older' ? true : x.lvl === 1;

  // conclusion check as an engine skill (so misses go to the review queue)
  Engine.skill({ id: 'lab.conclude', subject: 'science', topic: 'lab', name: 'lab.skill', bands: { young: [1, 1], older: [1, 2] }, warm: false, gen(l, r, ctx) {
    const pool = X.filter(x => x.lvl <= l), x = ctx.seed >= 9000 && byId[X[ctx.seed - 9000]?.id] ? X[ctx.seed - 9000] : r.pick(pool);
    const idx = r.shuffle(x.conclude.o.map((_, i) => i));
    return { kind: 'choice', prompt: `${esc(L(x.title))}: ${t('lab.concludeQ')}`, choices: idx.map(i => ({ v: i, html: esc(L(x.conclude.o[i])) })), answer: 0, why: { steps: L(x.conclude.why).map(w => ({ text: esc(w) })) },
      hints: [{ text: L(x.plan.why) }, { text: L(x.conclude.why)[0] }, { text: L(x.conclude.o[0]) }], hintRevealsAnswer: true };
  } });

  // ---------- screens ----------
  let S = null;
  const steps = ['q', 'predict', 'plan', 'run', 'record', 'conclude'];
  function list(main) {
    const p = Store.current(), nb = p.extras?.lab || [];
    main.innerHTML = `<section class="page lab" data-subject="science"><a class="backlink" href="#/s/science"><svg class="k-icon"><use href="#i-back"/></svg>${t('subj.science.title')}</a>
      <p class="eyebrow">${t('games.title')}</p><h1>${t('lab.title')}</h1><p class="lede">${t('lab.blurb')}</p>
      <ul class="lab-list">${X.filter(x => forBand(x, p)).map(x => `<li><a class="gamecard" data-subject="science" href="#/lab/${x.id}"><span class="subj-ic"><svg class="k-icon"><use href="#${x.icon}"/></svg></span><span><b>${esc(L(x.title))}</b><span class="small muted">${esc(L(x.q))}</span>${nb.some(n => n.id === x.id) ? `<span class="k-badge k-badge-success k-badge-pill">${t('lab.done')}</span>` : ''}</span></a></li>`).join('')}</ul></section>`;
  }
  function exp(main, id) {
    const x = byId[id]; if (!x) return list(main);
    if (!S || S.id !== id) S = { id, i: 0, pred: {}, plan: null, ran: false, done: false, t0: Date.now() };
    const p = Store.current(), items = x.items.map(([k, lab, v]) => ({ k, label: L(lab), v }));
    const st = steps[S.i];
    main.innerHTML = `<section class="page lab" data-subject="science"><a class="backlink" href="#/lab"><svg class="k-icon"><use href="#i-back"/></svg>${t('lab.list')}</a>
      <p class="eyebrow">${t('lab.title')}</p><div class="lesson-head"><h1>${esc(L(x.title))}</h1>${Engine.listenBtn('lablisten')}</div>
      <ol class="lesson-rail" role="tablist">${steps.map((s, k) => `<li><button role="tab" type="button" aria-selected="${k === S.i}" class="${k < S.i ? 'seen' : ''}" ${k > S.max ? 'disabled' : ''} data-k="${k}"><span>${k + 1}</span><em>${t('lab.step.' + s)}</em></button></li>`).join('')}</ol>
      <div class="lesson-panel" id="labPanel"></div></section>`;
    S.max = Math.max(S.max || 0, S.i);
    const el = main.querySelector('#labPanel'); let say = '';
    const nav = (ok = true) => `<div class="lesson-nav"><button class="k-btn k-btn-ghost" data-go="-1" ${S.i ? '' : 'disabled'}>${t('lab.back')}</button><button class="k-btn k-btn-primary" data-go="1" ${ok ? '' : 'disabled'}>${t('lab.next')}</button></div>`;
    if (st === 'q') { say = L(x.q) + ' ' + t('lab.hyp'); el.innerHTML = `<p class="eyebrow">${t('lab.step.q')}</p><h2>${esc(L(x.q))}</h2><p class="muted">${t('lab.hyp')}</p>${bench(x, items, false)}${nav()}`; }
    if (st === 'predict') {
      say = t(x.kind === 'cat' ? 'lab.pickEach' : 'lab.pickOne');
      el.innerHTML = `<p class="eyebrow">${t('lab.step.predict')}</p><h2>${esc(L(x.q))}</h2><p class="muted">${say}</p>` + (x.kind === 'cat'
        ? `<ul class="lab-pred">${items.map(it => `<li><span>${esc(it.label)}</span><div class="seg">${x.cats.map(c => `<button type="button" data-it="${it.k}" data-c="${c}" aria-pressed="${S.pred[it.k] === c}">${esc(L(C[c]))}</button>`).join('')}</div></li>`).join('')}</ul>`
        : `<div class="choices">${items.map(it => `<button type="button" class="choice" role="radio" aria-checked="${S.pred.one === it.k}" data-one="${it.k}">${esc(it.label)}</button>`).join('')}</div>`) + nav(x.kind === 'cat' ? items.every(it => S.pred[it.k]) : !!S.pred.one);
      el.querySelectorAll('[data-it]').forEach(b => b.onclick = () => { S.pred[b.dataset.it] = b.dataset.c; exp(main, id); });
      el.querySelectorAll('[data-one]').forEach(b => b.onclick = () => { S.pred.one = b.dataset.one; exp(main, id); });
    }
    if (st === 'plan') {
      const pl = L(x.plan.q), opts = x.plan.opts.map(L);
      say = (p.band === 'young' ? t('lab.young') : pl);
      el.innerHTML = `<p class="eyebrow">${t('lab.step.plan')}</p><h2>${esc(p.band === 'young' ? t('lab.young') : pl)}</h2><div class="choices" role="radiogroup">${[0, 2, 1].map(i => `<button type="button" class="choice ${S.plan != null ? (i === 0 ? 'is-right' : i === S.plan ? 'is-wrong' : '') : ''}" data-pl="${i}" ${S.plan != null ? 'disabled' : ''}>${esc(opts[i])}</button>`).join('')}</div>
        ${S.plan != null ? `<article class="lessoncard ${S.plan === 0 ? 'ok' : 'miss'}"><p class="lc-status">${S.plan === 0 ? t('pr.right') : t('pr.wrong')}</p><p>${esc(L(x.plan.why))}</p></article>` : ''}${nav(S.plan != null)}`;
      el.querySelectorAll('[data-pl]').forEach(b => b.onclick = () => { S.plan = +b.dataset.pl; exp(main, id); });
    }
    if (st === 'run') {
      say = t('lab.observe');
      el.innerHTML = `<p class="eyebrow">${t('lab.step.run')}</p><p class="muted">${t('lab.observe')}</p><div id="benchHere">${bench(x, items, S.ran)}</div><div class="controls"><button class="k-btn k-btn-outline pill" id="runBtn">${t('lab.runBtn')}</button></div>${nav(S.ran)}`;
      el.querySelector('#runBtn').onclick = () => { S.ran = true; const here = el.querySelector('#benchHere'); here.innerHTML = bench(x, items, true, true); setTimeout(() => exp(main, id), matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 1600); };
    }
    if (st === 'record') {
      const right = x.kind === 'cat' ? items.filter(it => S.pred[it.k] === it.v).length : null, max = Math.max(...items.map(i => i.v), 1);
      const best = x.kind === 'num' ? items.slice().sort((a, b) => x.low ? a.v - b.v : b.v - a.v)[0].k : null;
      S.score = x.kind === 'cat' ? [right, items.length] : [S.pred.one === best ? 1 : 0, 1];
      say = x.kind === 'cat' ? t('lab.score', { a: right, b: items.length }) : (S.pred.one === best ? t('lab.right') : t('lab.wrongP'));
      el.innerHTML = `<p class="eyebrow">${t('lab.step.record')}</p><table class="ptable"><thead><tr><th>${t('lab.item')}</th><th>${t('lab.guess')}</th><th>${t('lab.result')}</th></tr></thead><tbody>${items.map(it => `<tr><td>${esc(it.label)}</td><td>${x.kind === 'cat' ? esc(L(C[S.pred[it.k]] || ['–', '–'])) : (S.pred.one === it.k ? '✓' : '')}</td><td><b>${x.kind === 'cat' ? esc(L(C[it.v])) : it.v + ' ' + esc(x.unit)}</b></td></tr>`).join('')}</tbody></table>
        ${x.kind === 'num' && p.band === 'older' ? `<p class="eyebrow">${t('lab.chart')}</p><svg class="lab-chart" viewBox="0 0 320 ${items.length * 34 + 10}" role="img" aria-label="${t('lab.chart')}">${items.map((it, k) => `<text x="0" y="${k * 34 + 22}" font-size="11" fill="currentColor">${esc(it.label.slice(0, 22))}</text><rect x="130" y="${k * 34 + 8}" width="${Math.max(2, it.v / max * 160)}" height="20" rx="3" fill="var(--acc)"/><text x="${136 + it.v / max * 160}" y="${k * 34 + 23}" font-size="11" fill="currentColor">${it.v}</text>`).join('')}</svg>` : ''}
        <p class="lc-rule">${say}</p>${nav()}`;
    }
    if (st === 'conclude') {
      const sk = Engine.SK['lab.conclude'], seed = 9000 + X.indexOf(x), q = Engine.build({ skill: 'lab.conclude', lvl: x.lvl, seed }, p);
      say = t('lab.concludeQ');
      el.innerHTML = `<p class="eyebrow">${t('lab.step.conclude')}</p><h2>${t('lab.concludeQ')}</h2><div class="choices" role="radiogroup">${q.choices.map(c => `<button type="button" class="choice" data-v="${c.v}" ${S.done ? 'disabled' : ''}>${c.html}</button>`).join('')}</div><div id="labCard"></div>`;
      el.querySelectorAll('[data-v]').forEach(b => b.onclick = () => {
        if (S.done) return; S.done = true; const ok = +b.dataset.v === 0;
        el.querySelectorAll('[data-v]').forEach(x2 => { x2.disabled = true; if (+x2.dataset.v === 0) x2.classList.add('is-right'); else if (x2 === b) x2.classList.add('is-wrong'); });
        Store.record(p, 'science', sk, { key: `lab.conclude|${x.lvl}|${seed}`, lvl: x.lvl, seed }, ok);
        const h = x.home;
        el.querySelector('#labCard').innerHTML = `<article class="lessoncard ${ok ? 'ok' : 'miss'}" tabindex="-1"><header class="lc-head"><span class="lc-mark"><svg class="k-icon"><use href="#${ok ? 'i-check' : 'i-dot'}"/></svg></span><div><p class="lc-status">${ok ? t('pr.right') : t('pr.wrong')}</p><p class="lc-answer">${t('pr.answerIs', { a: `<strong>${esc(L(x.conclude.o[0]))}</strong>` })}</p></div></header>
          <p class="eyebrow">${t('pr.whyTitle')}</p>${L(x.conclude.why).map(w => `<p>${esc(w)}</p>`).join('')}
          <div class="athome"><p class="eyebrow">${t('topic.atHome')}</p><div class="kid-cols"><div><h3>${t('topic.need')}</h3><ul>${h.need.map(n => `<li>${esc(L(n))}</li>`).join('')}</ul></div><div><h3>${t('topic.steps')}</h3><ol>${h.steps.map(n => `<li>${esc(L(n))}</li>`).join('')}</ol></div></div><p class="grownup"><b>${t('topic.grownup')}:</b> ${esc(L(h.note))}</p></div>
          <div class="row-actions"><a class="k-btn k-btn-primary" href="#/lab">${t('common.done')}</a></div></article>`;
        p.extras = p.extras || {}; p.extras.lab = [{ id: x.id, title: L(x.title), date: Store.today(), prediction: S.pred, summary: S.score ? `${S.score[0]}/${S.score[1]}` : '', right: ok }, ...(p.extras.lab || [])].slice(0, 30);
        Store.logSession(p, { subject: 'science', topic: 'lab', mode: 'lab', n: 1, right: ok ? 1 : 0, ms: Date.now() - S.t0 });
        App.toast(t('lab.notebookSaved')); el.querySelector('.lessoncard').focus();
      });
    }
    Engine.bindListen(main.querySelector('.lablisten'), () => [{ text: say.replace(/<[^>]+>/g, ''), lang: I18N.lang }]);
    main.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { S.i = Math.max(0, Math.min(5, S.i + +b.dataset.go)); exp(main, id); scrollTo(0, 0); });
    main.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { S.i = +b.dataset.k; exp(main, id); });
  }
  // the bench: a dark board; cat experiments sort tokens into columns, num experiments grow bars, some reuse a sim snapshot
  function bench(x, items, shown, animate) {
    if (x.sim && x.id === 'circuit' && shown) return `<div class="board">${SIMS.snap('circuit', { mat: 'lead', bat: 1, on: true })}</div>`;
    if (x.sim && !shown) { const tries = SIMS.SIMS[x.sim]?.tries; return `<div class="board">${SIMS.snap(x.sim, tries ? tries[0] : {})}</div>`; }
    if (x.kind === 'cat') {
      if (x.id === 'float') return `<div class="board"><svg class="r3 lab-tank ${animate ? 'go' : ''}" viewBox="0 0 600 260" role="img" aria-label="${esc(L(x.title))}"><rect x="20" y="40" width="560" height="200" rx="8" fill="#1d3d57" stroke="#5fb3e6"/><rect x="20" y="40" width="560" height="14" fill="#5fb3e6" opacity=".35"/>${items.map((it, k) => { const cx = 70 + k * 92, y = shown ? (it.v === 'float' ? 46 : 214) : 20; return `<g class="tok" style="--y:${y}px"><rect x="${cx - 36}" y="${y - 12}" width="72" height="24" rx="12" fill="#e9e6dc"/><text x="${cx}" y="${y + 4}" font-size="11" text-anchor="middle" font-family="Lato" font-weight="700" fill="#1f2433">${esc(it.label.slice(0, 12))}</text></g>`; }).join('')}</svg></div>`;
      return `<div class="board"><div class="lab-cols">${x.cats.map(c => `<div><p class="eyebrow" style="color:#cfd4de">${esc(L(C[c]))}</p>${shown ? items.filter(it => it.v === c).map(it => `<span class="lab-tok">${esc(it.label)}</span>`).join('') : ''}</div>`).join('')}</div>${shown ? '' : `<div class="lab-cols">${items.map(it => `<span class="lab-tok">${esc(it.label)}</span>`).join('')}</div>`}</div>`;
    }
    const max = Math.max(...items.map(i => i.v), 1);
    return `<div class="board"><div class="lab-bars">${items.map(it => `<div><span class="lab-bar" style="height:${shown ? Math.max(4, it.v / max * 140) : 4}px"></span><b>${shown ? it.v + ' ' + esc(x.unit) : '?'}</b><small>${esc(it.label)}</small></div>`).join('')}</div></div>`;
  }
  ROUTES.lab = { render(main, parts) { if (parts[1]) exp(main, parts[1]); else { S = null; list(main); } } };
  window.LAB = { game: { title: 'lab.title', blurb: 'lab.blurb', icon: 'i-science', start: () => { S = null; location.hash = '#/lab'; } }, notebook: p => p.extras?.lab || [], EXPERIMENTS: X };
})();
