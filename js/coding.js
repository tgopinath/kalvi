// Coding (maths · logic): build programs from blocks to drive a 3D rover or a brass kolam pen.
// Concept sets: sequence, debugging, loops (kolam), conditionals, functions, variables.
// Programs are flat token lists; openers ('rep:n', 'def', 'ifb', 'iff', 'ifc') close with 'E'.
// Each solved level is recorded against an Engine skill 'cd.<concept>' whose gen() rebuilds a
// small concept check from the seed, so misses come back in review.
(function () {
  const esc = Engine.esc, RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  I18N.add({ coding: {
    title: ['Coding', 'நிரலாக்கம்'], blurb: ['Build programs from blocks: drive a rover, fix bugs, and draw kolams with loops.', 'கட்டளைத் தொகுதிகளால் நிரல் (program) அமை: ஊர்தியை ஓட்டு, பிழை திருத்து, மடக்கு (loop) கொண்டு கோலம் வரை.'],
    eyebrow: ['Maths · Logic', 'கணிதம் · தர்க்கம்'], lead: ['A program is a list of steps a machine follows exactly. Pick a level.', 'நிரல் என்பது இயந்திரம் அப்படியே பின்பற்றும் படிகளின் வரிசை. ஒரு நிலையைத் தேர்ந்தெடு.'],
    level: ['Level {n}', 'நிலை {n}'], map: ['All levels', 'எல்லா நிலைகளும்'], free: ['Free kolam', 'விருப்பக் கோலம்'], freeLead: ['Make your own kolam with blocks and save it to your gallery.', 'தொகுதிகளால் உன் சொந்தக் கோலம் வரைந்து படத்தொகுப்பில் சேமி.'],
    solvedN: ['{n} solved', '{n} முடிந்தது'], starsN: ['{n} of {m} stars', '{m}-இல் {n} நட்சத்திரங்கள்'], notYet: ['Not tried yet', 'இன்னும் முயலவில்லை'],
    set: { 1: ['Sequence', 'வரிசை (sequence)'], 2: ['Debugging', 'பிழை திருத்தம் (debugging)'], 3: ['Loops', 'மடக்கு (loop)'], 4: ['Conditions', 'நிபந்தனை (condition)'], 5: ['Functions', 'செயல்கூறு (function)'], 6: ['Variables', 'மாறி (variable)'] },
    task: {
      seq: ['Make the rover reach the {goal}.', 'ஊர்தி {goal} அருகே சென்று சேரும்படி நிரல் அமை.'],
      debug: ['This program should reach the {goal}, but one block is wrong. Find it and fix it.', 'இந்த நிரல் {goal} சென்று சேர வேண்டும்; ஆனால் ஒரு தொகுதி தவறு. அதைக் கண்டுபிடித்துத் திருத்து.'],
      loop: ['Draw the kolam shown in grey. Use Repeat so you write the pattern only once.', 'சாம்பல் நிறத்தில் காட்டிய கோலத்தை வரை. வடிவத்தை ஒருமுறை மட்டும் எழுத மீண்டும் செய் தொகுதியைப் பயன்படுத்து.'],
      ifb: ['Reach the {goal}. Inside Repeat, use “If blocked ahead” to turn at the wall.', '{goal} சென்று சேர். மீண்டும் செய் உள்ளே “முன்னே தடை இருந்தால்” வைத்துச் சுவரில் திரும்பு.'],
      iff: ['Pick every flower. Use “If on a flower” so the rover picks only where a flower is.', 'எல்லாப் பூக்களையும் பறி. பூ இருக்கும் இடத்தில் மட்டும் பறிக்க “பூ மேல் இருந்தால்” பயன்படுத்து.'],
      func: ['Make “petal” once, then use it 4 times to draw the flower kolam.', '“இதழ்” செயல்கூற்றை ஒருமுறை உருவாக்கி, அதை 4 முறை பயன்படுத்திப் பூக்கோலம் வரை.'],
      vars: ['Pick every coin. Add 1 to coins for each coin you pick.', 'எல்லா நாணயங்களையும் எடு. எடுக்கும் ஒவ்வொரு நாணயத்துக்கும் coins மாறியில் 1 கூட்டு.'],
      free: ['Add blocks, press Run, and watch the pen draw.', 'தொகுதிகளைச் சேர்த்து ஓட்டு அழுத்து; எழுதுகோல் வரைவதைப் பார்.'],
    },
    goal: { M: ['mango tree', 'மாமரம்'], S: ['school', 'பள்ளி'], W: ['well', 'கிணறு'] },
    blk: {
      F: ['Forward', 'முன்னே செல்'], L: ['Turn left', 'இடப்பக்கம் திரும்பு'], R: ['Turn right', 'வலப்பக்கம் திரும்பு'], P: ['Pick', 'எடு'], C: ['coins + 1', 'coins + 1'],
      rep: ['Repeat {n} times', '{n} முறை மீண்டும் செய்'], E: ['End', 'முடிவு'], def: ['Make “petal”', '“இதழ்” உருவாக்கு'], petal: ['Petal', 'இதழ்'],
      ifb: ['If blocked ahead', 'முன்னே தடை இருந்தால்'], iff: ['If on a flower', 'பூ மேல் இருந்தால்'], ifc: ['If on a coin', 'நாணயம் மேல் இருந்தால்'],
    },
    ui: {
      program: ['Program', 'நிரல்'], blocks: ['Blocks', 'தொகுதிகள்'], run: ['Run', 'ஓட்டு'], step: ['Step', 'ஒரு படி'], reset: ['Reset', 'மீட்டமை'], hint: ['Hint', 'குறிப்பு'], clear: ['Clear', 'அழி'],
      remove: ['Remove {b}', '{b} நீக்கு'], more: ['One more', 'ஒன்று கூட்டு'], less: ['One less', 'ஒன்று குறை'], code: ['See it as code', 'குறியீடாகப் பார்'],
      empty: ['Tap a block below to add it to your program.', 'கீழே உள்ள தொகுதியைத் தட்டி நிரலில் சேர்.'], count: ['Blocks used: {n} of {max}', 'பயன்படுத்திய தொகுதிகள்: {max}-இல் {n}'], fewest: ['Fewest possible: {n}', 'மிகக் குறைவு: {n}'],
      full: ['That is the most blocks for this level. Remove one, or use Repeat.', 'இந்த நிலைக்கு இதுவே அதிகபட்சத் தொகுதிகள். ஒன்றை நீக்கு, அல்லது மீண்டும் செய் பயன்படுத்து.'],
      keys: ['Arrow keys move between blocks, Shift with an arrow moves a block, Delete removes it, Enter runs.', 'அம்புக் குறி விசைகள் தொகுதிகளிடையே நகரும்; Shift உடன் அம்பு தொகுதியை நகர்த்தும்; Delete நீக்கும்; Enter ஓட்டும்.'],
      progLabel: ['Program, {n} blocks', 'நிரல், {n} தொகுதிகள்'], blockN: ['Block {n}: {b}', 'தொகுதி {n}: {b}'], inside: ['inside', 'உள்ளே'], added: ['Added {b}.', '{b} சேர்க்கப்பட்டது.'], removed: ['Removed {b}.', '{b} நீக்கப்பட்டது.'], moved: ['Moved {b} to place {n}.', '{b} இடம் {n}-க்கு நகர்த்தப்பட்டது.'],
      save: ['Save to gallery', 'படத்தொகுப்பில் சேமி'], saved: ['Saved to your gallery.', 'உன் படத்தொகுப்பில் சேமிக்கப்பட்டது.'], nothing: ['Draw something first: add blocks and press Run.', 'முதலில் ஏதாவது வரை: தொகுதிகளைச் சேர்த்து ஓட்டு அழுத்து.'],
      next: ['Next level', 'அடுத்த நிலை'], again: ['Try again', 'மீண்டும் முயல்'], coins: ['coins', 'coins'],
    },
    msg: {
      bump: ['The rover bumped into something at block {n}. Change the blocks before it.', 'தொகுதி {n}-இல் ஊர்தி மோதியது. அதற்கு முந்தைய தொகுதிகளை மாற்று.'],
      edge: ['The pen went off the board at block {n}.', 'தொகுதி {n}-இல் எழுதுகோல் பலகைக்கு வெளியே போனது.'],
      nothing: ['Nothing to pick here (block {n}). Pick only where there is something.', 'இங்கே எடுக்க ஒன்றும் இல்லை (தொகுதி {n}). ஏதாவது இருக்கும் இடத்தில் மட்டும் எடு.'],
      notThere: ['The program ended, but the rover is not at the {goal} yet.', 'நிரல் முடிந்தது; ஆனால் ஊர்தி இன்னும் {goal} சேரவில்லை.'],
      left: ['The program ended with {n} still on the board.', 'நிரல் முடிந்தது; பலகையில் இன்னும் {n} உள்ளன.'],
      count: ['You picked {a} coins but coins says {b}.', 'நீ {a} நாணயங்கள் எடுத்தாய்; ஆனால் coins = {b}.'],
      shape: ['Not the same kolam yet. Compare your line with the grey one.', 'இன்னும் அதே கோலம் இல்லை. உன் கோட்டைச் சாம்பல் கோட்டுடன் ஒப்பிடு.'],
      open: ['Every Repeat, If or Make needs its End block.', 'ஒவ்வொரு மீண்டும் செய், நிபந்தனை, உருவாக்கு தொகுதிக்கும் முடிவு தொகுதி வேண்டும்.'],
      extraEnd: ['There is an End block without a Repeat, If or Make above it.', 'மேலே மீண்டும் செய், நிபந்தனை, உருவாக்கு எதுவும் இல்லாத முடிவு தொகுதி உள்ளது.'],
      nested: ['“Make petal” must be on its own, not inside another block.', '“இதழ் உருவாக்கு” தனியாக இருக்க வேண்டும்; வேறு தொகுதிக்குள் அல்ல.'],
      noDef: ['Petal is used but never made. Add “Make petal” first.', 'இதழ் பயன்படுத்தப்பட்டது; ஆனால் உருவாக்கப்படவில்லை. முதலில் “இதழ் உருவாக்கு” சேர்.'],
      long: ['The program is very long. Use fewer repeats.', 'நிரல் மிக நீளம். மீண்டும் செய் எண்ணிக்கையைக் குறை.'],
      empty: ['Add some blocks first.', 'முதலில் சில தொகுதிகளைச் சேர்.'], done: ['Solved.', 'முடிந்தது.'], stepAt: ['Block {n}: {b}', 'தொகுதி {n}: {b}'],
    },
    hint: {
      seq: ['Count the squares to the goal. If it is not straight ahead, turn first.', 'இலக்கு வரை கட்டங்களை எண்ணு. நேராக இல்லையென்றால் முதலில் திரும்பு.'],
      debug: ['Press Step and watch where the rover first goes the wrong way.', 'ஒரு படி அழுத்தி, ஊர்தி முதலில் எங்கே தவறான வழியில் போகிறது என்று பார்.'],
      loop: ['Find the part of the kolam that repeats. Put just that part inside Repeat.', 'கோலத்தில் திரும்பத் திரும்ப வரும் பகுதியைக் கண்டுபிடி. அதை மட்டும் மீண்டும் செய் உள்ளே வை.'],
      ifb: ['The rover goes straight until the wall. Only then it must turn.', 'ஊர்தி சுவர் வரை நேராகப் போகும். அப்போது மட்டுமே திரும்ப வேண்டும்.'],
      iff: ['Move one square, then check: is there a flower here? Do that again and again.', 'ஒரு கட்டம் நகர்; பிறகு பார்: இங்கே பூ உள்ளதா? இதைத் திரும்பத் திரும்பச் செய்.'],
      func: ['One petal is a loop around one dot that ends back at the middle.', 'ஒரு இதழ் என்பது ஒரு புள்ளியைச் சுற்றி வந்து நடுவில் முடியும் வளையம்.'],
      vars: ['Each time you pick a coin, add 1 to coins right after.', 'ஒவ்வொரு முறை நாணயம் எடுத்ததும், உடனே coins-இல் 1 கூட்டு.'],
      wrongAt: ['Look at block {n}: {b}. This is where it first goes wrong.', 'தொகுதி {n} பார்: {b}. இங்குதான் முதலில் தவறு நடக்கிறது.'],
      short: ['Your blocks are right so far, but more are needed after block {n}.', 'இதுவரை உன் தொகுதிகள் சரி; ஆனால் தொகுதி {n}-க்குப் பிறகு இன்னும் வேண்டும்.'],
      fixParse: ['First make every Repeat, If and Make end with an End block.', 'முதலில் ஒவ்வொரு மீண்டும் செய், நிபந்தனை, உருவாக்கு தொகுதியையும் முடிவு தொகுதியுடன் மூடு.'],
      shown: ['Here is one program that works. Press Run to watch it.', 'வேலை செய்யும் ஒரு நிரல் இதோ. ஓட்டு அழுத்திப் பார்.'],
    },
    lc: {
      solved: ['Level solved', 'நிலை முடிந்தது'], stars: ['{n} of {m} stars', '{m}-இல் {n} நட்சத்திரங்கள்'], yours: ['Your program used {n} blocks. The fewest is {m}.', 'உன் நிரல் {n} தொகுதிகள் பயன்படுத்தியது. மிகக் குறைவு {m}.'],
      noHint: ['Solved without seeing the answer.', 'விடையைப் பார்க்காமல் முடித்தாய்.'], withHint: ['You saw the answer this time, so it will come back in review.', 'இம்முறை விடையைப் பார்த்தாய்; ஆகவே மீள்பார்வையில் மீண்டும் வரும்.'],
      seq: { what: ['A sequence is steps in order. The rover does them one by one, exactly as written.', 'வரிசை என்பது ஒழுங்கான படிகள். ஊர்தி எழுதியபடியே ஒவ்வொன்றாகச் செய்யும்.'], real: ['Like a recipe: first wash the rice, then add water, then cook. Change the order and the dish changes.', 'சமையல் குறிப்பு போல: முதலில் அரிசி கழுவு, பிறகு நீர் சேர், பிறகு வேக வை. வரிசை மாறினால் உணவும் மாறும்.'] },
      debug: { what: ['Debugging means finding the one step that goes wrong and fixing only that.', 'பிழை திருத்தம் என்பது தவறாகும் அந்த ஒரு படியைக் கண்டுபிடித்து அதை மட்டும் சரிசெய்வது.'], real: ['Like checking a recipe when the dosa tastes odd: go step by step until you find the extra salt.', 'தோசை சுவை மாறினால் சமையல் குறிப்பைப் படிப்படியாகப் பார்த்து அதிக உப்பைக் கண்டுபிடிப்பது போல.'] },
      loop: { what: ['A loop repeats the same steps. You write the motif once and say how many times.', 'மடக்கு ஒரே படிகளைத் திரும்பச் செய்யும். வடிவத்தை ஒருமுறை எழுதி, எத்தனை முறை என்று சொல்.'], real: ['A kolam is a loop: the same curve goes round each dot. Days of the week loop too.', 'கோலமே ஒரு மடக்கு: அதே வளைவு ஒவ்வொரு புள்ளியையும் சுற்றும். வாரத்தின் நாட்களும் மடக்குதான்.'] },
      if: { what: ['A condition checks something first, and does the steps only when it is true.', 'நிபந்தனை முதலில் ஒன்றைச் சோதிக்கும்; அது உண்மையானால் மட்டுமே படிகளைச் செய்யும்.'], real: ['Like a traffic light: if it is red, stop; otherwise go.', 'போக்குவரத்து விளக்கு போல: சிவப்பு என்றால் நில்; இல்லையென்றால் செல்.'] },
      func: { what: ['A function gives a name to a group of steps, so you can use it again with one block.', 'செயல்கூறு ஒரு படிகளின் குழுவுக்குப் பெயர் தரும்; ஒரே தொகுதியால் அதை மீண்டும் பயன்படுத்தலாம்.'], real: ['Like “make the dough” in a recipe: you learn it once and use it for idli, dosa and appam.', 'சமையலில் “மாவு அரை” போல: ஒருமுறை கற்றால் இட்லி, தோசை, ஆப்பம் எல்லாவற்றுக்கும் பயன்படும்.'] },
      vars: { what: ['A variable is a named box that holds a number. The program can change it.', 'மாறி என்பது எண்ணை வைத்திருக்கும் பெயருள்ள பெட்டி. நிரல் அதை மாற்றலாம்.'], real: ['Like the score on a cricket board: each run adds 1 to the number.', 'கிரிக்கெட் மதிப்பெண் பலகை போல: ஒவ்வொரு ஓட்டமும் எண்ணில் 1 கூட்டும்.'] },
    },
    dir: { 0: ['right', 'வலம்'], 1: ['down', 'கீழே'], 2: ['left', 'இடம்'], 3: ['up', 'மேலே'] },
    sr: {
      rover: ['Rover at column {x}, row {y}, facing {d}.', 'ஊர்தி நெடுவரிசை {x}, கிடைவரிசை {y}-இல், {d} நோக்கி.'], goal: ['The {goal} is at column {x}, row {y}.', '{goal} நெடுவரிசை {x}, கிடைவரிசை {y}-இல் உள்ளது.'],
      rocks: ['Rocks at {list}.', 'பாறைகள்: {list}.'], items: ['{n} left to pick at {list}.', 'எடுக்க {n} மீதம்: {list}.'], cell: ['column {x} row {y}', 'நெடுவரிசை {x} கிடைவரிசை {y}'],
      pen: ['Kolam pen at dot corner {x}, {y}, facing {d}. {a} of {b} lines drawn.', 'கோல எழுதுகோல் {x}, {y}-இல், {d} நோக்கி. {b}-இல் {a} கோடுகள் வரையப்பட்டன.'], penFree: ['Kolam pen at {x}, {y}, facing {d}. {a} lines drawn.', 'கோல எழுதுகோல் {x}, {y}-இல், {d} நோக்கி. {a} கோடுகள் வரையப்பட்டன.'],
      board: ['Board', 'பலகை'],
    },
    item: { flower: ['flowers', 'பூக்கள்'], coin: ['coins', 'நாணயங்கள்'] },
    skill: { seq: ['Coding: sequence', 'நிரலாக்கம்: வரிசை'], debug: ['Coding: debugging', 'நிரலாக்கம்: பிழை திருத்தம்'], loop: ['Coding: loops', 'நிரலாக்கம்: மடக்கு'], if: ['Coding: conditions', 'நிரலாக்கம்: நிபந்தனை'], func: ['Coding: functions', 'நிரலாக்கம்: செயல்கூறு'], vars: ['Coding: variables', 'நிரலாக்கம்: மாறி'] },
    cq: {
      seq: ['The rover faces {d}. It runs: {prog}. Which way does it face at the end?', 'ஊர்தி {d} நோக்கி உள்ளது. அது இயக்குவது: {prog}. முடிவில் எந்தப் பக்கம் நோக்கும்?'],
      seqH1: ['Go one block at a time. Forward does not change the way it faces.', 'ஒவ்வொரு தொகுதியாகப் பார். முன்னே செல் திசையை மாற்றாது.'], seqH2: ['After block 1 it faces {d}.', 'தொகுதி 1-க்குப் பின் {d} நோக்கும்.'], seqStep: ['Block {n}, {b}: now it faces {d}.', 'தொகுதி {n}, {b}: இப்போது {d} நோக்கும்.'],
      debug: ['The plan: {plan}. The program: {prog}. Which block is wrong?', 'திட்டம்: {plan}. நிரல்: {prog}. எந்தத் தொகுதி தவறு?'], debugH1: ['Compare the plan and the program one block at a time.', 'திட்டத்தையும் நிரலையும் ஒவ்வொரு தொகுதியாக ஒப்பிடு.'], debugH2: ['Blocks before block {n} match the plan.', 'தொகுதி {n}-க்கு முந்தையவை திட்டத்துடன் பொருந்துகின்றன.'], debugWhy: ['Block {n} says {b}, but the plan says {c}.', 'தொகுதி {n} {b} என்கிறது; திட்டமோ {c} என்கிறது.'],
      loop: ['Repeat {n} times: {body}. How many Forward steps does the pen take?', '{n} முறை மீண்டும் செய்: {body}. எழுதுகோல் எத்தனை முறை முன்னே செல்லும்?'], loopH1: ['Count the Forward blocks inside the loop first.', 'முதலில் மடக்கின் உள்ளே உள்ள முன்னே செல் தொகுதிகளை எண்ணு.'], loopH2: ['{f} Forward each time, {n} times.', 'ஒவ்வொரு முறையும் {f} முன்னே செல், {n} முறை.'], loopWhy: ['{f} × {n} = {a}', '{f} × {n} = {a}'],
      if: ['Rule: if blocked ahead, {turn}; otherwise Forward. {seen} What does the rover do?', 'விதி: முன்னே தடை இருந்தால் {turn}; இல்லையென்றால் முன்னே செல். {seen} ஊர்தி என்ன செய்யும்?'], rock: ['There is a rock ahead.', 'முன்னே ஒரு பாறை உள்ளது.'], clear: ['The way ahead is clear.', 'முன்னே வழி தெளிவாக உள்ளது.'],
      ifH1: ['First check: is it blocked ahead?', 'முதலில் பார்: முன்னே தடை உள்ளதா?'], ifH2: ['{seen} So the condition is {tf}.', '{seen} ஆகவே நிபந்தனை {tf}.'], yes: ['true', 'உண்மை'], no: ['false', 'பொய்'],
      func: ['petal = {body}. The program runs petal {n} times. How many Forward steps in all?', 'இதழ் = {body}. நிரல் இதழை {n} முறை இயக்கும். மொத்தம் எத்தனை முன்னே செல்?'], funcH1: ['Count the Forward blocks inside petal.', 'இதழின் உள்ளே உள்ள முன்னே செல் தொகுதிகளை எண்ணு.'], funcH2: ['petal has {f} Forward. It is used {n} times.', 'இதழில் {f} முன்னே செல் உள்ளது. அது {n} முறை பயன்படுகிறது.'],
      vars: ['coins starts at 0. Repeat {n} times: coins = coins + {a}. What is coins at the end?', 'coins முதலில் 0. {n} முறை மீண்டும் செய்: coins = coins + {a}. முடிவில் coins என்ன?'], varsH1: ['Each time round the loop, coins grows by {a}.', 'மடக்கு ஒவ்வொரு முறை சுற்றும்போதும் coins {a} கூடும்.'], varsH2: ['After 1 time: {a}. After 2 times: {b}.', '1 முறைக்குப் பின்: {a}. 2 முறைக்குப் பின்: {b}.'],
      answer: ['The answer is {a}.', 'விடை {a}.'],
    },
  } });

  // ---------- blocks ----------
  const ic = p => `<svg class="k-icon cd-ic" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const DIAMOND = '<path d="M12 3l9 9-9 9-9-9z"/>';
  const ICON = {
    F: ic('<path d="M12 20V5M6 11l6-6 6 6"/>'), L: ic('<path d="M9 14 4 9l5-5"/><path d="M4 9h9a7 7 0 0 1 7 7v4"/>'), R: ic('<path d="m15 14 5-5-5-5"/><path d="M20 9h-9a7 7 0 0 0-7 7v4"/>'),
    P: ic('<path d="M5 10h14l-1.5 9h-11z"/><path d="M9 10l3-5 3 5"/>'), C: ic('<path d="M4 12h7M7.5 8.5v7"/><path d="M15 9l2.5-2v11"/>'),
    rep: ic('<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'), E: ic('<path d="M6 4v12h12"/>'),
    def: ic('<path d="M8 4H7a2 2 0 0 0-2 2v4l-2 2 2 2v4a2 2 0 0 0 2 2h1"/><path d="M16 4h1a2 2 0 0 1 2 2v4l2 2-2 2v4a2 2 0 0 1-2 2h-1"/>'), petal: ic('<path d="M12 21c-5-4-6-11 0-17 6 6 5 13 0 17z"/>'),
    ifb: ic(DIAMOND + '<path d="M12 8v5M12 15.5v.5"/>'), iff: ic(DIAMOND + '<circle cx="12" cy="12" r="2.5"/>'), ifc: ic(DIAMOND + '<path d="M9.5 12h5"/>'),
  };
  const OPEN = new Set(['rep', 'def', 'ifb', 'iff', 'ifc']);
  const CAT = { F: 'move', L: 'move', R: 'move', P: 'act', C: 'var', rep: 'ctl', ifb: 'ctl', iff: 'ctl', ifc: 'ctl', E: 'ctl', def: 'fn', petal: 'fn' };
  const tk = s => { const [t, n] = String(s).split(':'); return { t, n: n ? +n : 0 }; };
  const label = s => { const { t: k, n } = tk(s); return t('coding.blk.' + k, { n }); };
  const CODE = { F: 'forward();', L: 'turnLeft();', R: 'turnRight();', P: 'pick();', C: 'coins = coins + 1;', petal: 'petal();' };
  const countBlocks = prog => prog.filter(s => tk(s).t !== 'E').length;
  const DX = [1, 0, -1, 0], DY = [0, 1, 0, -1];

  // ---------- levels ----------
  // rover maps: '>' 'v' '<' '^' start, M S W goal, # rock, * flower, o coin
  const LV = [
    { id: 'seq1', set: 1, kind: 'rover', map: ['.....', '.....', '>..M.', '.....', '.....'], sol: ['F', 'F', 'F'] },
    { id: 'seq2', set: 1, kind: 'rover', map: ['...S.', '.....', '>....', '.....', '.....'], sol: ['F', 'F', 'F', 'L', 'F', 'F'] },
    { id: 'seq3', set: 1, kind: 'rover', map: ['.....', '.....', '.....', '...W.', '>.#..'], sol: ['F', 'L', 'F', 'R', 'F', 'F'] },
    { id: 'seq4', set: 1, kind: 'rover', band: 'older', map: ['M.#..', '..#..', '.....', '.##..', '...<.'], sol: ['F', 'F', 'F', 'R', 'F', 'F', 'F', 'F'] },
    { id: 'dbg1', set: 2, kind: 'rover', map: ['.....', '.M...', '.....', '>....', '.....'], sol: ['F', 'L', 'F', 'F'], given: ['F', 'R', 'F', 'F'], wrongAt: 1 },
    { id: 'dbg2', set: 2, kind: 'rover', map: ['.....', '..S..', '.....', '.....', '..^..'], sol: ['F', 'F', 'F'], given: ['F', 'F', 'F', 'F'], wrongAt: 3 },
    { id: 'dbg3', set: 2, kind: 'rover', map: ['.....', '.....', '..#W.', '.....', '>....'], sol: ['F', 'F', 'F', 'L', 'F', 'F'], given: ['F', 'F', 'L', 'F', 'F', 'F'], wrongAt: 2 },
    { id: 'loop1', set: 3, kind: 'kolam', n: 3, start: [1, 1, 0], sol: ['rep:4', 'F', 'R', 'E'] },
    { id: 'loop2', set: 3, kind: 'kolam', n: 4, start: [1, 1, 0], sol: ['rep:4', 'F', 'F', 'R', 'E'] },
    { id: 'loop3', set: 3, kind: 'kolam', n: 3, start: [2, 1, 0], sol: ['rep:4', 'F', 'R', 'F', 'R', 'F', 'L', 'E'], max: 8 },
    { id: 'if1', set: 4, kind: 'rover', map: ['>....', '.....', '.....', '....W', '.....'], sol: ['rep:7', 'ifb', 'R', 'E', 'F', 'E'], task: 'ifb' },
    { id: 'if2', set: 4, kind: 'rover', map: ['.....', '.....', '>*.**', '.....', '.....'], sol: ['rep:4', 'F', 'iff', 'P', 'E', 'E'], task: 'iff' },
    { id: 'fn1', set: 5, kind: 'kolam', n: 2, start: [1, 1, 0], sol: ['def', 'rep:3', 'F', 'R', 'E', 'F', 'E', 'petal', 'petal', 'petal', 'petal'], par: 9 },
    { id: 'fn2', set: 5, kind: 'kolam', n: 4, start: [2, 2, 0], sol: ['def', 'rep:3', 'F', 'F', 'R', 'E', 'F', 'F', 'E', 'petal', 'petal', 'petal', 'petal'], par: 10 },
    { id: 'var1', set: 6, kind: 'rover', map: ['.....', '.....', '>ooo.', '.....', '.....'], sol: ['rep:3', 'F', 'P', 'C', 'E'] },
    { id: 'var2', set: 6, kind: 'rover', map: ['.....', '.....', '>o.oo', '.....', '.....'], sol: ['rep:4', 'F', 'ifc', 'P', 'C', 'E', 'E'] },
  ];
  const CONCEPT = { 1: 'seq', 2: 'debug', 3: 'loop', 4: 'if', 5: 'func', 6: 'vars' };
  const PALETTE = { 1: ['F', 'L', 'R'], 2: ['F', 'L', 'R'], 3: ['F', 'L', 'R', 'rep'], 4: ['F', 'L', 'R', 'P', 'rep', 'ifb', 'iff'], 5: ['F', 'L', 'R', 'rep', 'def', 'petal'], 6: ['F', 'L', 'R', 'P', 'C', 'rep', 'ifc'] };
  const BYID = {};
  const levelsFor = band => LV.filter(l => band === 'older' ? true : l.set <= 3 && l.band !== 'older');
  const maxFor = (l, band) => l.free ? 40 : band === 'young' ? Math.max(6, l.max || 0, countBlocks(l.given || [])) : Math.max(12, l.par + 6);

  function parseMap(l) {
    l.h = l.map.length; l.w = l.map[0].length; l.rocks = new Set(); l.items = {};
    l.map.forEach((row, y) => [...row].forEach((c, x) => {
      const d = '>v<^'.indexOf(c); if (d >= 0) l.start = [x, y, d];
      if ('MSW'.includes(c)) { l.goal = [x, y]; l.goalK = c; }
      if (c === '#') l.rocks.add(x + ',' + y);
      if (c === '*') l.items[x + ',' + y] = 'flower';
      if (c === 'o') l.items[x + ',' + y] = 'coin';
    }));
  }

  // ---------- parse + run ----------
  function parse(prog) {
    const root = { body: [] }, stack = [root], defs = {};
    for (let i = 0; i < prog.length; i++) {
      const { t: k, n } = tk(prog[i]);
      if (k === 'E') { if (stack.length < 2) return { err: 'extraEnd', at: i }; stack.pop(); continue; }
      const node = { i, k, n, body: OPEN.has(k) ? [] : null };
      if (k === 'def') { if (stack.length > 1) return { err: 'nested', at: i }; defs.petal = node; stack.push(node); continue; }
      stack.at(-1).body.push(node);
      if (node.body) stack.push(node);
    }
    if (stack.length > 1) return { err: 'open', at: stack.at(-1).i };
    return { tree: root.body, defs };
  }
  const key2 = (a, b) => [a, b].map(p => p.join(',')).sort().join('|');
  function initState(l) {
    const [x, y, d] = l.start;
    return l.kind === 'kolam' ? { x, y, d, segs: [] } : { x, y, d, items: { ...l.items }, coins: 0, picked: 0, trail: [x + ',' + y] };
  }
  const clone = s => ({ ...s, segs: s.segs?.slice(), items: s.items && { ...s.items }, trail: s.trail?.slice() });
  function blocked(l, s) { const nx = s.x + DX[s.d], ny = s.y + DY[s.d]; return nx < 0 || ny < 0 || nx >= l.w || ny >= l.h || l.rocks.has(nx + ',' + ny); }
  // returns { ev: [{ i, st, err? }], acts: [{ a, i }], st, err, at }
  function run(l, prog) {
    const P = parse(prog); if (P.err) return { perr: P.err, at: P.at, ev: [], acts: [] };
    const s = initState(l), ev = [], acts = [];
    let err = null, at = -1;
    const push = i => ev.push({ i, st: clone(s) });
    const fail = (e, i) => { err = e; at = i; ev.push({ i, st: clone(s), err: e }); };
    function exec(list, depth) {
      for (const nd of list) {
        if (err) return; if (ev.length > 400) { fail('long', nd.i); return; }
        const k = nd.k;
        if (k === 'F') {
          const nx = s.x + DX[s.d], ny = s.y + DY[s.d];
          if (l.kind === 'kolam') { if (nx < 0 || ny < 0 || nx > l.n || ny > l.n) { fail('edge', nd.i); return; } s.segs.push([s.x, s.y, nx, ny]); }
          else if (blocked(l, s)) { fail('bump', nd.i); return; }
          s.x = nx; s.y = ny; if (s.trail) s.trail.push(nx + ',' + ny); acts.push({ a: 'F', i: nd.i }); push(nd.i);
        } else if (k === 'L' || k === 'R') { s.d = (s.d + (k === 'R' ? 1 : 3)) % 4; acts.push({ a: k, i: nd.i }); push(nd.i); }
        else if (k === 'P') { const c = s.x + ',' + s.y; if (!s.items?.[c]) { fail('nothing', nd.i); return; } delete s.items[c]; s.picked++; acts.push({ a: 'P', i: nd.i }); push(nd.i); }
        else if (k === 'C') { s.coins++; acts.push({ a: 'C', i: nd.i }); push(nd.i); }
        else if (k === 'rep') { for (let j = 0; j < nd.n && !err; j++) { push(nd.i); exec(nd.body, depth + 1); } }
        else if (k === 'ifb' || k === 'iff' || k === 'ifc') {
          push(nd.i);
          const c = s.x + ',' + s.y, ok = k === 'ifb' ? blocked(l, s) : s.items?.[c] === (k === 'iff' ? 'flower' : 'coin');
          if (ok) exec(nd.body, depth + 1);
        } else if (k === 'petal') {
          if (!P.defs.petal) { fail('noDef', nd.i); return; }
          if (depth > 6) { fail('long', nd.i); return; }
          push(nd.i); exec(P.defs.petal.body, depth + 1);
        }
      }
    }
    exec(P.tree, 0);
    return { ev, acts, st: s, err, at };
  }
  function judge(l, R) {
    if (R.perr) return { ok: false, msg: t('coding.msg.' + R.perr) };
    if (R.err) return { ok: false, msg: t('coding.msg.' + R.err, { n: R.at + 1 }) };
    if (l.free) return { ok: true };
    const s = R.st;
    if (l.kind === 'kolam') {
      const A = new Set(s.segs.map(g => key2([g[0], g[1]], [g[2], g[3]]))), B = new Set(l.target.map(g => key2([g[0], g[1]], [g[2], g[3]])));
      return { ok: A.size === B.size && [...B].every(k => A.has(k)), msg: t('coding.msg.shape') };
    }
    const left = Object.keys(s.items).length;
    if (left) return { ok: false, msg: t('coding.msg.left', { n: `${left} ${t('coding.item.' + Object.values(s.items)[0])}` }) };
    if (l.set === 6 && s.coins !== s.picked) return { ok: false, msg: t('coding.msg.count', { a: s.picked, b: s.coins }) };
    if (l.goal && (s.x !== l.goal[0] || s.y !== l.goal[1])) return { ok: false, msg: t('coding.msg.notThere', { goal: t('coding.goal.' + l.goalK) }) };
    return { ok: true };
  }

  LV.forEach(l => { BYID[l.id] = l; l.par ??= countBlocks(l.sol); l.concept = CONCEPT[l.set]; if (l.kind === 'rover') parseMap(l); else { l.target = run(l, l.sol).st.segs; } });

  // ---------- drawing: rover (R3) ----------
  const cellName = (x, y) => t('coding.sr.cell', { x: x + 1, y: y + 1 });
  function roverSVG(l, s, opt = {}) {
    const S = R3.Scene({ yaw: -24, pitch: 40, scale: 30 }), H = l.h, wy = y => H - 1 - y;
    const trail = new Set(s.trail || []);
    S.group(0);
    for (let y = 0; y < H; y++) for (let x = 0; x < l.w; x++) {
      const k = x + ',' + y, c = opt.crash === k ? '#7a3b2e' : trail.has(k) ? '#33405a' : (x + y) % 2 ? '#232a3a' : '#283043';
      S.box(x + .04, wy(y) + .04, 0, .92, .92, .12, c, { ew: .6 });
    }
    const at = (x, y) => [x + .5, wy(y) + .5];
    l.rocks.forEach(k => { const [x, y] = k.split(',').map(Number), [cx, cy] = at(x, y); S.group(1); S.shadow(cx, cy, .12, .36, .3); S.prism([[cx - .32, cy - .22], [cx + .1, cy - .34], [cx + .34, cy - .02], [cx + .18, cy + .3], [cx - .26, cy + .26]], .12, .38, '#7d8597'); });
    if (l.goal) {
      const [cx, cy] = at(...l.goal); S.group(1); S.shadow(cx, cy, .12, .36, .32);
      if (l.goalK === 'M') { S.cylinder(cx, cy, .12, .07, .34, '#6b4a2b', { n: 10 }); S.sphere(cx, cy, .62, .3, '#2f7d4f', { matte: true }); S.sphere(cx + .14, cy - .14, .5, .1, '#f2b233'); }
      else if (l.goalK === 'S') { S.box(cx - .3, cy - .22, .12, .6, .44, .34, '#c8a58a'); S.pyramid([[cx - .34, cy - .26], [cx + .34, cy - .26], [cx + .34, cy + .26], [cx - .34, cy + .26]], .46, .22, '#b4493c'); S.box(cx - .07, cy - .23, .12, .14, .02, .18, '#3b2a20'); }
      else { S.cylinder(cx, cy, .12, .32, .28, '#9aa1ad', { n: 24 }); S.cylinder(cx, cy, .12, .22, .285, '#0d1a2b', { n: 24 }); S.box(cx - .3, cy - .02, .4, .6, .04, .04, '#6b4a2b'); }
    }
    Object.entries(s.items || {}).forEach(([k, kind]) => {
      const [x, y] = k.split(',').map(Number), [cx, cy] = at(x, y); S.group(1);
      if (kind === 'flower') { S.cylinder(cx, cy, .12, .03, .26, '#2f7d4f', { n: 8 }); S.sphere(cx, cy, .44, .13, '#e0628a'); S.sphere(cx, cy, .44, .05, '#f6d36b'); }
      else { S.shadow(cx, cy, .12, .2, .2); S.cylinder(cx, cy, .12, .2, .06, '#e2b23a', { n: 24 }); }
    });
    // rover: body, wheels, mast with a camera at the front
    const [rx, ry] = at(s.x, s.y), fx = DX[s.d], fy = -DY[s.d];
    S.group(2); S.shadow(rx, ry, .12, .4, .36);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => S.box(rx + a * .27 - .07, ry + b * .22 - .07, .12, .14, .14, .14, '#1b1f2a'));
    S.box(rx - .27, ry - .24, .2, .54, .48, .18, '#d6dbe4', { ew: .7 });
    S.box(rx + fx * .2 - .09, ry + fy * .2 - .09, .38, .18, .18, .1, '#16a39c');
    S.cylinder(rx - fx * .12, ry - fy * .12, .38, .035, .26, '#8b93a3', { n: 10 });
    S.sphere(rx - fx * .12 + fx * .06, ry - fy * .12 + fy * .06, .7, .08, '#f2f4f8');
    return S.svg(opt.label || '');
  }
  function roverSR(l, s) {
    const out = [t('coding.sr.rover', { x: s.x + 1, y: s.y + 1, d: t('coding.dir.' + s.d) })];
    if (l.goal) out.push(t('coding.sr.goal', { goal: t('coding.goal.' + l.goalK), x: l.goal[0] + 1, y: l.goal[1] + 1 }));
    if (l.rocks.size) out.push(t('coding.sr.rocks', { list: [...l.rocks].map(k => cellName(...k.split(',').map(Number))).join(', ') }));
    const it = Object.keys(s.items || {}); if (it.length) out.push(t('coding.sr.items', { n: it.length, list: it.map(k => cellName(...k.split(',').map(Number))).join(', ') }));
    return out.join(' ');
  }

  // ---------- drawing: kolam pen (2D, smooth line) ----------
  const f3 = v => +v.toFixed(3);
  function smoothPath(segs, r = .5) {
    if (!segs.length) return '';
    let P = [[segs[0][0], segs[0][1]], ...segs.map(g => [g[2], g[3]])];
    const tidy = A => A.filter((p, i) => { if (i === 0 || i === A.length - 1) return true; const a = A[i - 1], c = A[i + 1]; return !((p[0] - a[0]) * (c[1] - p[1]) === (p[1] - a[1]) * (c[0] - p[0]) && (p[0] - a[0]) * (c[0] - p[0]) + (p[1] - a[1]) * (c[1] - p[1]) > 0); });
    P = tidy(P);
    const closed = P.length > 3 && P[0][0] === P.at(-1)[0] && P[0][1] === P.at(-1)[1];
    if (closed) { const m = [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2]; P = tidy([m, ...P.slice(1, -1), P[0], m]); }
    let d = `M${f3(P[0][0])} ${f3(P[0][1])}`;
    for (let i = 1; i < P.length - 1; i++) {
      const a = P[i - 1], b = P[i], c = P[i + 1], la = Math.hypot(b[0] - a[0], b[1] - a[1]), lb = Math.hypot(c[0] - b[0], c[1] - b[1]);
      const u = [(b[0] - a[0]) / la, (b[1] - a[1]) / la], v = [(c[0] - b[0]) / lb, (c[1] - b[1]) / lb];
      const rr = Math.min(r, i === 1 ? la : la / 2, i === P.length - 2 ? lb : lb / 2);
      d += ` L${f3(b[0] - u[0] * rr)} ${f3(b[1] - u[1] * rr)} Q${f3(b[0])} ${f3(b[1])} ${f3(b[0] + v[0] * rr)} ${f3(b[1] + v[1] * rr)}`;
    }
    return d + ` L${f3(P.at(-1)[0])} ${f3(P.at(-1)[1])}${closed ? 'Z' : ''}`;
  }
  function kolamSVG(l, s, opt = {}) {
    const n = l.n, pad = .7;
    let dots = ''; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) dots += `<circle cx="${x + .5}" cy="${y + .5}" r=".075" fill="#e6e9f0" opacity=".85"/>`;
    const ghost = l.target ? `<path d="${smoothPath(l.target)}" fill="none" stroke="#e6e9f0" stroke-opacity=".2" stroke-width=".16" stroke-linecap="round" stroke-linejoin="round"/>` : '';
    const line = s.segs.length ? `<path class="cd-ink" d="${smoothPath(s.segs)}" fill="none" stroke="#f4efe2" stroke-width=".1" stroke-linecap="round" stroke-linejoin="round"/>` : '';
    const a = s.d * 90;
    const pen = `<g transform="translate(${s.x} ${s.y}) rotate(${a})"><path d="M.34 0 L.08 -.13 L.08 .13Z" fill="#e8c45a" stroke="#6e5214" stroke-width=".02"/><circle r=".15" fill="#c9a227" stroke="#6e5214" stroke-width=".025"/><circle cx="-.04" cy="-.04" r=".05" fill="#f3dc8c" opacity=".8"/></g>`;
    return `<svg class="cd-kolam" viewBox="${-pad} ${-pad} ${n + 2 * pad} ${n + 2 * pad}" role="img" aria-label="${esc(opt.label || '')}" xmlns="http://www.w3.org/2000/svg">${dots}${ghost}${line}${opt.nopen ? '' : pen}</svg>`;
  }
  function kolamSR(l, s) { return t(l.target ? 'coding.sr.pen' : 'coding.sr.penFree', { x: s.x, y: s.y, d: t('coding.dir.' + s.d), a: s.segs.length, b: l.target?.length || 0 }); }
  function kolamPNG(l, s) {
    const c = document.createElement('canvas'); c.width = 320; c.height = 240; const k = c.getContext('2d');
    k.fillStyle = '#141822'; k.fillRect(0, 0, 320, 240);
    const sc = 224 / (l.n + .8); k.setTransform(sc, 0, 0, sc, (320 - l.n * sc) / 2, (240 - l.n * sc) / 2);
    k.fillStyle = '#e6e9f0'; for (let y = 0; y < l.n; y++) for (let x = 0; x < l.n; x++) { k.beginPath(); k.arc(x + .5, y + .5, .075, 0, 7); k.fill(); }
    k.strokeStyle = '#f4efe2'; k.lineWidth = .1; k.lineCap = k.lineJoin = 'round'; k.stroke(new Path2D(smoothPath(s.segs)));
    return c.toDataURL('image/jpeg', .82);
  }

  // ---------- code text view ----------
  function codeText(prog) {
    const P = parse(prog); if (P.err) return null;
    const out = [], ind = d => '  '.repeat(d);
    const head = { rep: n => `repeat(${n}) {`, ifb: () => 'if (blockedAhead()) {', iff: () => 'if (onFlower()) {', ifc: () => 'if (onCoin()) {' };
    const walk = (list, d) => list.forEach(nd => { if (nd.body) { out.push(ind(d) + head[nd.k](nd.n)); walk(nd.body, d + 1); out.push(ind(d) + '}'); } else out.push(ind(d) + CODE[nd.k]); });
    if (P.defs.petal) { out.push('function petal() {'); walk(P.defs.petal.body, 1); out.push('}'); }
    walk(P.tree, 0); return out.join('\n');
  }

  // ---------- progress ----------
  const extras = p => { p.extras ??= {}; return p.extras.coding ??= { solved: {}, stars: {}, best: {} }; };
  const maxStars = p => AGE.band(p) === 'older' ? 3 : 2;
  const starSVG = on => `<svg class="cd-star ${on ? 'on' : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/></svg>`;

  // ---------- level map ----------
  function mapScreen(main) {
    const p = Store.current(), ex = extras(p), ls = levelsFor(AGE.band(p)), m = maxStars(p);
    const sets = [...new Set(ls.map(l => l.set))];
    const next = ls.find(l => !ex.solved[l.id]);
    main.innerHTML = `<section class="page coding" data-subject="maths">
      <a class="backlink" href="#/s/maths"><svg class="k-icon"><use href="#i-back"/></svg>${t('subj.maths.title')}</a>
      <p class="eyebrow">${t('coding.eyebrow')}</p><div class="lesson-head"><h1>${t('coding.title')}</h1>${Engine.listenBtn('cdlisten')}</div>
      <p class="cd-lead">${t('coding.lead')}</p>
      ${sets.map(sn => { const L = ls.filter(l => l.set === sn); return `<section class="cd-set k-card"><div class="cd-sethead"><h2>${t('coding.set.' + sn)}</h2><span class="small muted">${t('coding.solvedN', { n: L.filter(l => ex.solved[l.id]).length })} / ${L.length}</span></div>
        <div class="cd-levels">${L.map((l, i) => { const st = ex.stars[l.id] || 0; return `<a class="cd-lvl ${ex.solved[l.id] ? 'done' : ''} ${next === l ? 'next' : ''}" href="#/coding/${l.id}" aria-label="${esc(t('coding.set.' + sn) + ', ' + t('coding.level', { n: i + 1 }) + ', ' + (ex.solved[l.id] ? t('coding.starsN', { n: st, m }) : t('coding.notYet')))}">
          <span class="cd-lvl-n">${i + 1}</span><span class="cd-lvl-art" aria-hidden="true">${ICON[l.kind === 'kolam' ? (l.set === 5 ? 'petal' : 'rep') : l.set === 2 ? 'ifb' : l.set === 6 ? 'C' : 'F']}</span><span class="cd-stars" aria-hidden="true">${Array.from({ length: m }, (_, k) => starSVG(k < st)).join('')}</span></a>`; }).join('')}</div></section>`; }).join('')}
      <section class="cd-set k-card cd-freecard"><div><h2>${t('coding.free')}</h2><p class="small muted">${t('coding.freeLead')}</p></div><a class="k-btn k-btn-outline pill" href="#/coding/free">${ICON.rep}<span>${t('coding.free')}</span></a></section>
    </section>`;
    Engine.bindListen(main.querySelector('.cdlisten'), () => [{ text: t('coding.blurb') + ' ' + t('coding.lead'), lang: I18N.lang }]);
  }

  // ---------- level screen ----------
  let G = null;
  const FREE = { id: 'free', free: true, set: 3, kind: 'kolam', n: 6, start: [3, 3, 0], sol: [] };
  function setup(l, p) {
    G = { l, p, prog: (l.given || []).slice(), sel: -1, hint: 0, usedAnswer: false, tries: 0, t0: Date.now(), run: null, ti: -1, timer: null, code: false, seed: Engine.newSeed(), done: false, say: '' };
  }
  function levelScreen(main, id) {
    const p = Store.current(), l = id === 'free' ? FREE : BYID[id];
    if (!l) { location.hash = '#/coding'; return; }
    if (!G || G.l !== l) setup(l, p);
    const ls = levelsFor(AGE.band(p)), inSet = ls.filter(x => x.set === l.set), num = inSet.indexOf(l) + 1;
    const young = AGE.band(p) === 'young';
    main.innerHTML = `<section class="page coding cd-play ${young ? 'young' : ''}" data-subject="maths">
      <a class="backlink" href="#/coding"><svg class="k-icon"><use href="#i-back"/></svg>${t('coding.map')}</a>
      <p class="eyebrow">${l.free ? t('coding.eyebrow') : `${t('coding.set.' + l.set)} · ${t('coding.level', { n: num })}`}</p>
      <div class="lesson-head"><h1>${l.free ? t('coding.free') : t('coding.title')}</h1>${Engine.listenBtn('cdlisten')}</div>
      <p class="cd-task">${taskText(l)}</p>
      <div class="board cd-board"><div class="cd-var" hidden></div><div class="cd-art"></div><p class="cd-sr" aria-live="polite"></p></div>
      <p class="cd-say" role="status" aria-live="polite"></p>
      <div class="cd-runbar">
        <button type="button" class="k-btn k-btn-primary cd-runbtn"><svg class="k-icon" aria-hidden="true"><use href="#i-next"/></svg><span>${t('coding.ui.run')}</span></button>
        <button type="button" class="k-btn k-btn-outline pill cd-stepbtn"><svg class="k-icon" aria-hidden="true"><use href="#i-arrow"/></svg><span>${t('coding.ui.step')}</span></button>
        <button type="button" class="k-btn k-btn-outline pill cd-resetbtn"><svg class="k-icon" aria-hidden="true"><use href="#i-undo"/></svg><span>${t('coding.ui.reset')}</span></button>
        ${l.free ? `<button type="button" class="k-btn k-btn-outline pill cd-savebtn"><svg class="k-icon" aria-hidden="true"><use href="#i-image"/></svg><span>${t('coding.ui.save')}</span></button>`
          : `<button type="button" class="k-btn k-btn-outline pill cd-hintbtn"><svg class="k-icon" aria-hidden="true"><use href="#i-bulb"/></svg><span>${t('coding.ui.hint')}</span></button>`}
      </div>
      <h2 class="eyebrow cd-h">${t('coding.ui.blocks')}</h2>
      <div class="cd-pal" role="toolbar" aria-label="${t('coding.ui.blocks')}">${(l.free ? ['F', 'L', 'R', 'rep'] : PALETTE[l.set]).map(k => `<button type="button" class="cd-blk cd-pb cat-${CAT[k]}" data-k="${k}">${ICON[k]}<span>${k === 'rep' ? t('coding.blk.rep', { n: l.sol.map(tk).find(x => x.t === 'rep')?.n || 4 }) : t('coding.blk.' + k)}</span></button>`).join('')}</div>
      <div class="cd-proghead"><h2 class="eyebrow cd-h">${t('coding.ui.program')}</h2><span class="small muted cd-count"></span>
        <button type="button" class="k-btn k-btn-ghost k-btn-sm cd-clearbtn">${t('coding.ui.clear')}</button></div>
      <ol class="cd-prog" aria-describedby="cdKeys"></ol>
      <p class="small muted" id="cdKeys">${t('coding.ui.keys')}</p>
      ${young ? '' : `<button type="button" class="k-btn k-btn-outline k-btn-sm pill cd-codebtn" aria-pressed="${G.code}">${t('coding.ui.code')}</button><pre class="cd-code" lang="en" ${G.code ? '' : 'hidden'}></pre>`}
      <div class="cd-lesson"></div>
    </section>`;
    const $ = s => main.querySelector(s);
    Engine.bindListen($('.cdlisten'), () => [{ text: strip(taskText(l)), lang: I18N.lang }]);
    main.querySelectorAll('.cd-pb').forEach(b => b.onclick = () => add(b.dataset.k));
    const pbs = [...main.querySelectorAll('.cd-pb')];
    pbs.forEach((b, i) => { b.tabIndex = i ? -1 : 0; b.onkeydown = e => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (d) { e.preventDefault(); const nb = pbs[(i + d + pbs.length) % pbs.length]; pbs.forEach(x => x.tabIndex = -1); nb.tabIndex = 0; nb.focus(); speak(nb.textContent.trim()); } }; });
    $('.cd-runbtn').onclick = () => play(false);
    $('.cd-stepbtn').onclick = () => play(true);
    $('.cd-resetbtn').onclick = () => { stop(); G.run = null; G.ti = -1; drawBoard(); drawProg(); };
    $('.cd-clearbtn').onclick = () => { stop(); G.prog = []; G.sel = -1; G.run = null; G.ti = -1; drawAll(); };
    $('.cd-hintbtn') && ($('.cd-hintbtn').onclick = hint);
    $('.cd-savebtn') && ($('.cd-savebtn').onclick = saveFree);
    $('.cd-codebtn') && ($('.cd-codebtn').onclick = e => { G.code = !G.code; e.currentTarget.setAttribute('aria-pressed', G.code); $('.cd-code').hidden = !G.code; drawCode(); });
    G.main = main; drawAll(); say(G.say || '');
    if (G.done && !l.free) lessonCard();
    if (young && !G.spoke) { G.spoke = true; try { Voice.play([{ text: strip(taskText(l)), lang: I18N.lang }], null, {}); } catch (e) { /* no speech */ } }
  }
  const strip = h => String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  function taskText(l) {
    if (l.free) return t('coding.task.free');
    const key = l.task || { 1: 'seq', 2: 'debug', 3: 'loop', 5: 'func', 6: 'vars' }[l.set];
    return t('coding.task.' + key, { goal: l.goalK ? `<b>${t('coding.goal.' + l.goalK)}</b>` : '' });
  }
  function say(s, cls = '') { const el = G.main?.querySelector('.cd-say'); if (el) { el.innerHTML = s; el.className = 'cd-say ' + cls; } G.say = s; }
  function drawAll() { drawBoard(); drawProg(); }
  function curState() { return G.run && G.ti >= 0 ? G.run.ev[Math.min(G.ti, G.run.ev.length - 1)].st : initState(G.l); }
  function drawBoard() {
    const l = G.l, s = curState(), m = G.main; if (!m) return;
    const e = G.run && G.ti >= 0 ? G.run.ev[G.ti] : null, crash = e?.err === 'bump' ? (s.x + DX[s.d]) + ',' + (s.y + DY[s.d]) : null;
    const sr = l.kind === 'kolam' ? kolamSR(l, s) : roverSR(l, s);
    m.querySelector('.cd-art').innerHTML = l.kind === 'kolam' ? kolamSVG(l, s, { label: sr }) : roverSVG(l, s, { label: sr, crash });
    m.querySelector('.cd-sr').textContent = sr;
    const v = m.querySelector('.cd-var'); v.hidden = l.set !== 6 || l.free; if (!v.hidden) v.innerHTML = `<span class="mono" lang="en">coins = ${s.coins}</span>`;
  }
  function depthOf(prog) { let d = 0; return prog.map(s => { const k = tk(s).t; if (k === 'E') { d = Math.max(0, d - 1); return d; } const r = d; if (OPEN.has(k)) d++; return r; }); }
  function drawProg() {
    const m = G.main; if (!m) return; const ol = m.querySelector('.cd-prog'), dep = depthOf(G.prog);
    const cur = G.run && G.ti >= 0 ? G.run.ev[G.ti]?.i : -1, wrong = G.wrongAt ?? -1;
    ol.setAttribute('aria-label', t('coding.ui.progLabel', { n: countBlocks(G.prog) }));
    ol.innerHTML = G.prog.length ? G.prog.map((s, i) => { const { t: k, n } = tk(s), lab = label(s);
      return `<li class="cd-row" style="--d:${dep[i]}" data-i="${i}"><div class="cd-blk cd-pblk cat-${CAT[k]} ${i === cur ? 'running' : ''} ${i === wrong ? 'wrong' : ''} ${i === G.sel ? 'sel' : ''}" role="button" tabindex="${i === (G.sel < 0 ? 0 : G.sel) ? 0 : -1}" aria-label="${esc(t('coding.ui.blockN', { n: i + 1, b: lab }) + (dep[i] ? ', ' + t('coding.ui.inside') : ''))}" ${i === cur ? 'aria-current="step"' : ''}>${ICON[k]}<span>${esc(lab)}</span></div>
        ${k === 'rep' && i === G.sel ? `<button type="button" class="k-iconbtn cd-mini cd-less" aria-label="${t('coding.ui.less')}"><svg class="k-icon"><use href="#i-minus"/></svg></button><button type="button" class="k-iconbtn cd-mini cd-more" aria-label="${t('coding.ui.more')}"><svg class="k-icon"><use href="#i-plus"/></svg></button>` : ''}
        <button type="button" class="k-iconbtn cd-mini cd-del" aria-label="${esc(t('coding.ui.remove', { b: lab }))}"><svg class="k-icon"><use href="#i-close"/></svg></button></li>`; }).join('')
      : `<li class="cd-empty muted">${t('coding.ui.empty')}</li>`;
    m.querySelector('.cd-count').innerHTML = t('coding.ui.count', { n: countBlocks(G.prog), max: maxFor(G.l, AGE.band(G.p)) }) + (AGE.band(G.p) === 'older' && !G.l.free ? ' · ' + t('coding.ui.fewest', { n: G.l.par }) : '');
    ol.querySelectorAll('.cd-row').forEach(li => bindRow(li, +li.dataset.i));
    drawCode();
  }
  function drawCode() { const pre = G.main?.querySelector('.cd-code'); if (pre && G.code) pre.textContent = codeText(G.prog) ?? t('coding.msg.open'); }
  function focusRow(i) { const el = G.main.querySelector(`.cd-row[data-i="${i}"] .cd-pblk`); el?.focus(); }
  function changed() { stop(); G.run = null; G.ti = -1; G.wrongAt = null; drawAll(); }
  function add(k) {
    if (G.done && !G.l.free) return;
    const max = maxFor(G.l, AGE.band(G.p)); if (countBlocks(G.prog) >= max) { say(t('coding.ui.full'), 'warn'); return; }
    const at = G.sel >= 0 ? G.sel + 1 : G.prog.length, tok = k === 'rep' ? 'rep:' + (G.l.sol.map(tk).find(x => x.t === 'rep')?.n || 4) : k;
    G.prog.splice(at, 0, ...(OPEN.has(k) ? [tok, 'E'] : [tok])); G.sel = at;
    changed(); say(t('coding.ui.added', { b: label(tok) })); speak(label(tok)); focusRow(at);
  }
  function remove(i) {
    const k = tk(G.prog[i]).t, lab = label(G.prog[i]);
    if (OPEN.has(k)) { let d = 0, j = i + 1; for (; j < G.prog.length; j++) { const kk = tk(G.prog[j]).t; if (kk === 'E' && d === 0) break; if (OPEN.has(kk)) d++; if (kk === 'E') d--; } G.prog.splice(j, 1); }
    G.prog.splice(i, 1); G.sel = Math.min(i, G.prog.length - 1); changed(); say(t('coding.ui.removed', { b: lab })); focusRow(Math.max(0, G.sel));
  }
  function move(i, j) { if (j < 0 || j >= G.prog.length || i === j) return; const [x] = G.prog.splice(i, 1); G.prog.splice(j, 0, x); G.sel = j; changed(); say(t('coding.ui.moved', { b: label(x), n: j + 1 })); focusRow(j); }
  const speak = text => { try { Voice.play([{ text, lang: I18N.lang }], null, {}); } catch (e) { /* no speech */ } };
  function bindRow(li, i) {
    const blk = li.querySelector('.cd-pblk');
    li.querySelector('.cd-del').onclick = () => remove(i);
    li.querySelector('.cd-less') && (li.querySelector('.cd-less').onclick = () => setN(i, -1));
    li.querySelector('.cd-more') && (li.querySelector('.cd-more').onclick = () => setN(i, 1));
    blk.onkeydown = e => {
      const up = e.key === 'ArrowUp' || e.key === 'ArrowLeft', dn = e.key === 'ArrowDown' || e.key === 'ArrowRight';
      if ((up || dn) && e.shiftKey) { e.preventDefault(); move(i, i + (up ? -1 : 1)); }
      else if (up || dn) { e.preventDefault(); const j = Math.max(0, Math.min(G.prog.length - 1, i + (up ? -1 : 1))); G.sel = j; drawProg(); focusRow(j); speak(label(G.prog[j])); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(i); }
      else if (e.key === 'Enter') { e.preventDefault(); play(false); }
      else if (e.key === ' ') { e.preventDefault(); select(i); }
      else if ((e.key === '+' || e.key === '-') && tk(G.prog[i]).t === 'rep') { e.preventDefault(); setN(i, e.key === '+' ? 1 : -1); }
    };
    // tap selects + reads aloud; drag (pointer) reorders
    let y0 = null, drag = false, pid = null;
    blk.onpointerdown = e => { if (e.button) return; y0 = e.clientY; drag = false; pid = e.pointerId; };
    blk.onpointermove = e => {
      if (y0 == null || e.pointerId !== pid) return; const dy = e.clientY - y0;
      if (!drag && Math.abs(dy) > 10) { drag = true; try { blk.setPointerCapture(pid); } catch (x) { /* ok */ } li.classList.add('dragging'); }
      if (drag) { e.preventDefault(); li.style.transform = `translateY(${dy}px)`; }
    };
    const end = e => {
      if (y0 == null) return; const was = drag; y0 = null; drag = false; li.classList.remove('dragging'); li.style.transform = '';
      if (!was) { select(i); return; }
      const rows = [...G.main.querySelectorAll('.cd-row')]; let j = rows.length - 1;
      for (let k = 0; k < rows.length; k++) { const r = rows[k].getBoundingClientRect(); if (e.clientY < r.top + r.height / 2) { j = k > i ? k - 1 : k; break; } }
      move(i, j);
    };
    blk.onpointerup = end; blk.onpointercancel = () => { y0 = null; drag = false; li.classList.remove('dragging'); li.style.transform = ''; };
  }
  function select(i) { G.sel = i; drawProg(); focusRow(i); speak(label(G.prog[i])); }
  function setN(i, d) { const { n } = tk(G.prog[i]); G.prog[i] = 'rep:' + Math.max(2, Math.min(9, n + d)); changed(); focusRow(i); say(label(G.prog[i])); }

  // ---------- running ----------
  function stop() { clearTimeout(G?.timer); if (G) G.timer = null; }
  function play(stepOnly) {
    if (G.done && !G.l.free) return;
    if (!G.prog.length) { say(t('coding.msg.empty'), 'warn'); return; }
    if (!G.run || (G.ti >= G.run.ev.length - 1 && !stepOnly) || (stepOnly && G.ti >= G.run.ev.length - 1)) {
      G.run = run(G.l, G.prog); G.ti = -1;
      if (G.run.perr) { say(t('coding.msg.' + G.run.perr), 'warn'); G.wrongAt = G.run.at; drawProg(); G.run = null; return; }
    }
    G.wrongAt = null;
    stop();
    const tick = () => {
      G.ti++; drawBoard(); drawProg();
      const e = G.run.ev[G.ti];
      if (e && stepOnly) say(t('coding.msg.stepAt', { n: e.i + 1, b: esc(label(G.prog[e.i])) }));
      if (G.ti >= G.run.ev.length - 1) { finishRun(); return; }
      if (!stepOnly) G.timer = setTimeout(tick, RM() ? 650 : 420);
    };
    if (!G.run.ev.length) { finishRun(); return; }
    tick();
  }
  function finishRun() {
    const J = judge(G.l, G.run);
    if (G.l.free) { if (J.ok === false) say(J.msg, 'warn'); else say(''); return; }
    if (J.ok) { solved(); return; }
    G.tries++; say(J.msg, 'warn');
    const m = G.main; if (G.run.err === 'bump' && !RM()) { const b = m.querySelector('.cd-board'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }
  // first divergence from the stored solution's action stream → the child's block to look at
  function firstWrong() {
    const l = G.l;
    if (l.given && G.prog.join() === l.given.join()) return { at: l.wrongAt };
    const mine = run(l, G.prog); if (mine.perr) return { perr: true, at: mine.at };
    const ref = run(l, l.sol).acts, A = mine.acts;
    for (let k = 0; k < A.length; k++) if (!ref[k] || ref[k].a !== A[k].a) return { at: A[k].i };
    if (mine.err) return { at: mine.at };
    return { short: true, at: A.length ? A.at(-1).i : -1 };
  }
  function hint() {
    if (G.done) return;
    G.hint = Math.min(3, G.hint + 1);
    if (G.hint === 1) { say(t('coding.hint.' + G.l.concept), 'hint'); speak(strip(t('coding.hint.' + G.l.concept))); return; }
    if (G.hint === 2) {
      const w = firstWrong();
      if (w.perr) { G.wrongAt = w.at; drawProg(); say(t('coding.hint.fixParse'), 'hint'); return; }
      if (w.short) { G.wrongAt = null; drawProg(); say(t('coding.hint.short', { n: w.at + 1 }), 'hint'); return; }
      stop(); G.run = null; G.ti = -1; drawBoard(); G.wrongAt = w.at; drawProg(); say(t('coding.hint.wrongAt', { n: w.at + 1, b: esc(label(G.prog[w.at])) }), 'hint'); focusRow(w.at); return;
    }
    G.usedAnswer = true; G.prog = G.l.sol.slice(); G.sel = -1; changed(); say(t('coding.hint.shown'), 'hint');
    G.main.querySelector('.cd-hintbtn').disabled = true;
  }
  function solved() {
    const p = G.p, l = G.l, ex = extras(p), ok = !G.usedAnswer, n = countBlocks(G.prog);
    let stars = 1 + (ok ? 1 : 0) + (AGE.band(p) === 'older' && n <= l.par && ok ? 1 : 0);
    ex.solved[l.id] = 1; ex.stars[l.id] = Math.max(ex.stars[l.id] || 0, stars); ex.best[l.id] = Math.min(ex.best[l.id] || 99, n);
    const id = 'cd.' + l.concept;
    Store.record(p, 'maths', Engine.SK[id], { key: id + '|1|' + G.seed, lvl: 1, seed: G.seed }, ok);
    Store.logSession(p, { subject: 'maths', topic: 'coding', mode: 'coding', n: 1, right: ok ? 1 : 0, ms: Date.now() - G.t0 });
    Store.save();
    G.done = true; G.stars = stars; say(t('coding.msg.done'), 'ok'); drawProg(); lessonCard();
  }
  function lessonCard() {
    const p = G.p, l = G.l, m = maxStars(p), c = l.concept, n = countBlocks(G.prog), ls = levelsFor(AGE.band(p)), nx = ls[ls.indexOf(l) + 1];
    const steps = [t('coding.lc.' + c + '.what'), t('coding.lc.yours', { n, m: l.par }), G.usedAnswer ? t('coding.lc.withHint') : t('coding.lc.noHint')];
    const el = G.main.querySelector('.cd-lesson');
    el.innerHTML = `<article class="lessoncard ${G.usedAnswer ? 'miss' : 'ok'}" tabindex="-1">
      <header class="lc-head"><span class="lc-mark" aria-hidden="true"><svg class="k-icon"><use href="#i-check"/></svg></span>
        <div><p class="lc-status">${t('coding.lc.solved')}</p><p class="lc-answer"><span class="cd-stars big" aria-hidden="true">${Array.from({ length: m }, (_, k) => starSVG(k < G.stars)).join('')}</span> <span>${t('coding.lc.stars', { n: G.stars, m })}</span></p></div>
        ${Engine.listenBtn('lclisten')}</header>
      <p class="eyebrow">${t('coding.set.' + l.set)}</p>
      <ol class="steps">${steps.map((s, i) => `<li class="step"><span class="step-n">${i + 1}</span><div class="step-body"><p>${s}</p></div></li>`).join('')}</ol>
      <p class="lc-rule">${t('coding.lc.' + c + '.real')}</p>
      <div class="row-actions"><button type="button" class="k-btn k-btn-outline pill cd-again">${t('coding.ui.again')}</button><a class="k-btn k-btn-outline pill" href="#/coding">${t('coding.map')}</a>${nx ? `<a class="k-btn k-btn-primary cd-next" href="#/coding/${nx.id}">${t('coding.ui.next')}</a>` : ''}</div></article>`;
    const card = el.querySelector('.lessoncard');
    Engine.bindListen(card.querySelector('.lclisten'), () => [{ text: strip([t('coding.lc.solved'), ...steps, t('coding.lc.' + c + '.real')].join('. ')), lang: I18N.lang }]);
    card.querySelector('.cd-again').onclick = () => { setup(l, p); App.route(); };
    card.scrollIntoView({ behavior: RM() ? 'auto' : 'smooth', block: 'start' }); card.focus({ preventScroll: true });
  }
  function saveFree() {
    const s = G.run && G.ti >= 0 ? curState() : null;
    if (!s || !s.segs.length) { say(t('coding.ui.nothing'), 'warn'); return; }
    const p = G.p; p.extras ??= {}; const dr = p.extras.draw ??= { gallery: [], set: 'upper' }; dr.gallery ??= [];
    dr.gallery.unshift({ src: kolamPNG(G.l, s), at: Date.now() }); dr.gallery = dr.gallery.slice(0, 12);
    const ex = extras(p); ex.free = (ex.free || 0) + 1; Store.save(); say(t('coding.ui.saved'), 'ok');
  }

  // ---------- concept-check skills for review ----------
  const seqText = a => a.map(label).join(', ');
  const ladder = (a, b, c) => [{ text: a }, { text: b }, { text: c }];
  const turn = (d, k) => k === 'F' ? d : (d + (k === 'R' ? 1 : 3)) % 4;
  const distinct = (ans, cands) => { const out = [ans]; cands.forEach(c => { if (c > 0 && !out.includes(c) && out.length < 3) out.push(c); }); let k = 1; while (out.length < 3) { if (!out.includes(ans + k)) out.push(ans + k); k++; } return out; };
  const numQ = (r, prompt, ans, cands, hints, why, rule) => ({ kind: 'choice', prompt, promptText: strip(prompt), choices: r.shuffle(distinct(ans, cands)).map(v => ({ v, html: String(v) })), answer: ans, hints, hintRevealsAnswer: true, answerText: String(ans), why: { steps: why.map(text => ({ text })), rule } });
  const G1 = {
    seq(r) {
      const d0 = r.int(0, 3); let prog; do { prog = Array.from({ length: r.int(3, 4) }, () => r.pick(['F', 'L', 'R'])); } while (prog.filter(k => k !== 'F').length < 2);
      const ds = []; prog.reduce((d, k) => { const n = turn(d, k); ds.push(n); return n; }, d0); const ans = ds.at(-1), D = k => t('coding.dir.' + k);
      const prompt = t('coding.cq.seq', { d: `<b>${D(d0)}</b>`, prog: seqText(prog) });
      return { kind: 'choice', prompt, promptText: strip(prompt), choices: [0, 1, 2, 3].map(v => ({ v, html: D(v) })), answer: ans, hintRevealsAnswer: true,
        hints: ladder(t('coding.cq.seqH1'), t('coding.cq.seqH2', { d: D(ds[0]) }), t('coding.cq.answer', { a: D(ans) })), answerText: D(ans),
        why: { steps: prog.map((k, i) => ({ text: t('coding.cq.seqStep', { n: i + 1, b: label(k), d: D(ds[i]) }) })), rule: t('coding.lc.seq.real') } };
    },
    debug(r) {
      const plan = Array.from({ length: 4 }, () => r.pick(['F', 'F', 'L', 'R'])), w = r.int(0, 3), prog = plan.slice(); prog[w] = r.pick(['F', 'L', 'R'].filter(k => k !== plan[w]));
      const prompt = t('coding.cq.debug', { plan: seqText(plan), prog: seqText(prog) }), ch = i => `${i + 1}. ${label(prog[i])}`;
      return { kind: 'choice', prompt, promptText: strip(prompt), choices: prog.map((_, i) => ({ v: i, html: ch(i) })), answer: w, hintRevealsAnswer: true,
        hints: ladder(t('coding.cq.debugH1'), t('coding.cq.debugH2', { n: w + 1 }), t('coding.cq.answer', { a: ch(w) })), answerText: ch(w),
        why: { steps: [{ text: t('coding.cq.debugWhy', { n: w + 1, b: label(prog[w]), c: label(plan[w]) }) }, { text: t('coding.lc.debug.what') }], rule: t('coding.lc.debug.real') } };
    },
    loop(r) {
      const n = r.int(2, 5), body = r.pick([['F', 'R'], ['F', 'F', 'R'], ['F', 'L', 'F'], ['F', 'F', 'F', 'L']]), f = body.filter(k => k === 'F').length, a = n * f;
      return numQ(r, t('coding.cq.loop', { n, body: seqText(body) }), a, [a + n, n + f, a - f], ladder(t('coding.cq.loopH1'), t('coding.cq.loopH2', { f, n }), t('coding.cq.answer', { a })), [t('coding.cq.loopWhy', { f, n, a }), t('coding.lc.loop.what')], t('coding.lc.loop.real'));
    },
    if(r) {
      const rock = r() < .5, tt = r.pick(['L', 'R']), seen = t(rock ? 'coding.cq.rock' : 'coding.cq.clear'), ans = rock ? tt : 'F';
      const prompt = t('coding.cq.if', { turn: label(tt), seen });
      return { kind: 'choice', prompt, promptText: strip(prompt), choices: ['F', 'L', 'R'].map(v => ({ v, html: `${ICON[v]} ${label(v)}` })), answer: ans, hintRevealsAnswer: true,
        hints: ladder(t('coding.cq.ifH1'), t('coding.cq.ifH2', { seen, tf: t(rock ? 'coding.cq.yes' : 'coding.cq.no') }), t('coding.cq.answer', { a: label(ans) })), answerText: label(ans),
        why: { steps: [{ text: t('coding.cq.ifH2', { seen, tf: t(rock ? 'coding.cq.yes' : 'coding.cq.no') }) }, { text: t('coding.lc.if.what') }], rule: t('coding.lc.if.real') } };
    },
    func(r) {
      const body = r.pick([['F', 'R', 'F'], ['F', 'F', 'R'], ['F', 'R', 'F', 'R'], ['F', 'F', 'R', 'F']]), n = r.int(2, 4), f = body.filter(k => k === 'F').length, a = f * n;
      return numQ(r, t('coding.cq.func', { body: seqText(body), n }), a, [a + f, f + n, body.length * n], ladder(t('coding.cq.funcH1'), t('coding.cq.funcH2', { f, n }), t('coding.cq.answer', { a })), [t('coding.cq.funcH2', { f, n }) + ' ' + t('coding.cq.loopWhy', { f, n, a }), t('coding.lc.func.what')], t('coding.lc.func.real'));
    },
    vars(r) {
      const n = r.int(2, 5), a = r.int(1, 3), ans = n * a;
      return numQ(r, t('coding.cq.vars', { n, a }), ans, [n + a, ans + a, ans - a], ladder(t('coding.cq.varsH1', { a }), t('coding.cq.varsH2', { a, b: 2 * a }), t('coding.cq.answer', { a: ans })), [t('coding.cq.varsH2', { a, b: 2 * a }) + ` … ${n} × ${a} = ${ans}`, t('coding.lc.vars.what')], t('coding.lc.vars.real'));
    },
  };
  Object.keys(G1).forEach(c => Engine.skill({ id: 'cd.' + c, subject: 'maths', topic: 'coding', name: 'coding.skill.' + c, bands: { young: [1, 1], older: [1, 1] }, warm: false, gen: (lvl, r) => G1[c](r) }));

  // ---------- routes + game ----------
  window.ROUTES = window.ROUTES || {};
  ROUTES.coding = {
    render(main, parts) { if (parts[1]) levelScreen(main, parts[1]); else { stop(); G = null; mapScreen(main); } },
    keys() { /* keyboard handled on the blocks themselves */ },
  };
  window.CODING = {
    game: { title: 'coding.title', blurb: 'coding.blurb', icon: 'i-puzzle', start(p) { void p; G = null; if (location.hash === '#/coding') App.route(); else location.hash = '#/coding'; } },
    levels: LV, _test: { run, judge, parse, codeText, smoothPath, BYID, get G() { return G; } },
  };
})();
