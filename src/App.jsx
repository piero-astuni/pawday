import { useState, useCallback, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ── DATA ─────────────────────────────────────────────────────────────────────
const ACTIVITIES = [
  { id:"working",   icon:"💼", label:"You're Working",   pro:false },
  { id:"hiking",    icon:"🥾", label:"Hiking Together",  pro:false },
  { id:"traveling", icon:"✈️", label:"Traveling",        pro:false },
  { id:"sick",      icon:"🤒", label:"You're Sick",      pro:false },
  { id:"relaxing",  icon:"🛋️", label:"Lazy Day",         pro:false },
  { id:"training",  icon:"🎯", label:"Training Session", pro:true  },
  { id:"playdate",  icon:"🐕", label:"Dog Park Day",     pro:true  },
  { id:"dog_sick",  icon:"🏥", label:"Dog is Sick",      pro:true  },
  { id:"camping",   icon:"⛺", label:"Camping Trip",     pro:true  },
  { id:"rainy_in",  icon:"🌧️", label:"Rainy Day In",     pro:true  },
];
const WEATHERS = [
  { id:"hot",   icon:"🔆", label:"Hot",    temp:90, cond:"Very Hot & Sunny" },
  { id:"warm",  icon:"☀️", label:"Warm",   temp:72, cond:"Warm & Sunny" },
  { id:"mild",  icon:"🌤️", label:"Mild",   temp:63, cond:"Mild & Partly Cloudy" },
  { id:"cloudy",icon:"☁️", label:"Cloudy", temp:57, cond:"Overcast" },
  { id:"rainy", icon:"🌧️", label:"Rainy",  temp:52, cond:"Rainy" },
  { id:"cold",  icon:"🧊", label:"Cold",   temp:35, cond:"Cold" },
  { id:"snowy", icon:"❄️", label:"Snowy",  temp:28, cond:"Snowing" },
];

const DOG_SIZES = [
  { id:"tiny",  icon:"🐭", label:"Tiny",   sub:"< 5 kg",   example:"Chihuahua, Pomeranian" },
  { id:"small", icon:"🐩", label:"Small",  sub:"5–10 kg",  example:"Beagle, Shih Tzu" },
  { id:"medium",icon:"🐕", label:"Medium", sub:"11–25 kg", example:"Border Collie, Labrador" },
  { id:"large", icon:"🦮", label:"Large",  sub:"26–45 kg", example:"Rottweiler, Husky" },
  { id:"giant", icon:"🐻", label:"Giant",  sub:"45 kg+",   example:"Great Dane, Mastiff" },
];
const HEALTH_GOALS = [
  { id:"weight",   icon:"⚖️", label:"Weight Management", desc:"Low-cal, high-fiber treats & portion tips" },
  { id:"joints",   icon:"🦴", label:"Joint Health",      desc:"Omega-3 & anti-inflammatory recipes" },
  { id:"coat",     icon:"✨", label:"Coat & Skin",       desc:"Salmon, flaxseed & healthy fats" },
  { id:"digestion",icon:"🌿", label:"Digestive Health",  desc:"Pumpkin, ginger & gut-friendly ingredients" },
  { id:"energy",   icon:"⚡", label:"Energy & Stamina",  desc:"Protein-rich, natural energy boosters" },
  { id:"dental",   icon:"🦷", label:"Dental Health",     desc:"Crunchy treats that help clean teeth" },
  { id:"immune",   icon:"🛡️", label:"Immune Support",    desc:"Antioxidants, berries & superfoods" },
  { id:"senior",   icon:"👴", label:"Senior Care",       desc:"Gentle, easy-to-digest recipes for older dogs" },
  { id:"calm",     icon:"🧘", label:"Calm & Anxiety",    desc:"Enrichment snacks to reduce stress" },
];
const GC = { weight:"#0369a1",joints:"#7c3aed",coat:"#d97706",digestion:"#059669",energy:"#dc2626",dental:"#0891b2",immune:"#9333ea",senior:"#b45309",calm:"#2563eb" };
const GB = { weight:"#e0f2fe",joints:"#ede9fe",coat:"#fef3c7",digestion:"#d1fae5",energy:"#fee2e2",dental:"#cffafe",immune:"#f3e8ff",senior:"#ffedd5",calm:"#dbeafe" };

const TRICKS = [
  { id:1,  name:"Sit",       icon:"🐾", level:"Beginner",     dur:"1–2 days",
    desc:"Foundation of all training. Lure the nose up and the bottom follows naturally.",
    steps:["Hold a treat close to your dog's nose.","Slowly move your hand upward — their bottom will naturally lower.","Once seated, say 'Sit', give the treat and praise immediately.","Repeat 5–10 times in short 5-minute sessions.","Gradually introduce the verbal cue before the hand motion."] },
  { id:2,  name:"Stay",      icon:"⏸️", level:"Beginner",     dur:"3–5 days",
    desc:"Builds impulse control. Start with 1 second, extend gradually.",
    steps:["Ask your dog to Sit first.","Open your palm toward them and say 'Stay'.","Take one step back, pause, then return and reward.","Gradually increase distance — then duration — over several sessions.","Always return to them to reward. Never call them to you during Stay training."] },
  { id:3,  name:"Shake",     icon:"🤝", level:"Beginner",     dur:"2–3 days",
    desc:"A crowd-pleasing classic. Pick up paw gently, reward.",
    steps:["Ask your dog to Sit.","Hold a treat in your closed fist at their paw level.","Wait — they will likely sniff, then paw at your hand.","The moment their paw touches your hand, open it and reward.","Add the cue 'Shake' and gradually offer an open hand instead of a fist."] },
  { id:4,  name:"High Five", icon:"✋", level:"Beginner",     dur:"1–2 days",
    desc:"Extension of Shake. Hold treat higher than usual.",
    steps:["Start from Shake: reward them reliably for lifting their paw.","Raise your flat open palm slightly higher than usual.","When they reach up and touch your palm, say 'High five!' and reward.","Gradually raise your hand toward full height session by session.","Fade the treat — use just the raised palm as the final cue."] },
  { id:5,  name:"Down",      icon:"⬇️", level:"Beginner",     dur:"2–4 days",
    desc:"Lure from Sit toward the floor in an L-shaped motion.",
    steps:["Ask your dog to Sit.","Hold a treat at their nose, then move it straight down to the floor.","Slide it forward along the floor — they should follow into a Down position.","Once down, say 'Down', reward, and release with 'Okay!'.","Practice in short daily sessions, gradually removing the lure."] },
  { id:6,  name:"Leave It",  icon:"🚫", level:"Intermediate", dur:"4–7 days",
    desc:"Critical safety command. Start with low-value items before food.",
    steps:["Place a low-value treat in your closed fist.","Let them sniff and paw — say nothing, just wait patiently.","The moment they pull back or look away, open your hand and reward with a BETTER treat.","Repeat, adding 'Leave it' before presenting your fist.","Progress to treats on the floor, then more tempting or dangerous items."] },
  { id:7,  name:"Spin",      icon:"🌀", level:"Intermediate", dur:"2–3 days",
    desc:"Lure in a full circle. Add verbal cue once consistent.",
    steps:["Hold a treat at your dog's nose level.","Slowly move it in a full circle — their body follows the treat.","Once they complete the circle, say 'Spin!' and reward generously.","Repeat, making the lure motion smaller each session.","Add the hand signal: a single finger drawn in a circle in the air."] },
  { id:8,  name:"Speak",     icon:"🔊", level:"Intermediate", dur:"3–5 days",
    desc:"Wait for a natural bark, reward and name it. Patience needed!",
    steps:["Wait for a moment when your dog naturally barks or whines.","Immediately say 'Speak!' and reward generously.","Repeat consistently — they'll start to connect the word to vocalising.","Add a hand signal: open and close your fingers like a talking mouth.","Then teach 'Quiet' as the essential paired command."] },
  { id:9,  name:"Roll Over", icon:"🔄", level:"Intermediate", dur:"5–7 days",
    desc:"Build from Down. Lure over the shoulder slowly at their pace.",
    steps:["Ask your dog to lie Down.","Hold a treat at their nose and slowly lure it toward their shoulder.","They'll roll onto their side — reward this first and build duration.","Continue the arc over their back until they complete the full roll.","Add 'Roll over!' as they begin to move, then gradually reduce the lure."] },
  { id:10, name:"Heel",      icon:"🚶", level:"Intermediate", dur:"1–2 wks",
    desc:"Walk calmly at your side with a treat held at hip height.",
    steps:["Hold a treat at your left hip — your dog should look up at it.","Start walking forward, rewarding every few steps at first.","Say 'Heel' as you begin each walking session.","If they forge ahead, stop and reset — pulling is never rewarded.","Gradually reduce treat frequency but always reward randomly to maintain focus."] },
  { id:11, name:"Play Dead", icon:"💀", level:"Advanced",     dur:"1–2 wks",
    desc:"From Down, lure to side. The finger-gun signal is a crowd favourite.",
    steps:["Ask your dog to lie Down.","Hold a treat at their nose and slowly lure it toward their shoulder.","As they roll onto their side, say 'Bang!' with a finger-gun gesture.","Reward while they're lying still — build duration before releasing.","Fade the treat lure, relying only on the finger-gun hand signal and verbal cue."] },
  { id:12, name:"Fetch",     icon:"🎾", level:"Advanced",     dur:"1–3 wks",
    desc:"Combine chase + retrieve + drop it. Keep sessions short and fun.",
    steps:["Start by rewarding any interest in the toy — sniff, mouth, or pick up.","Toss the toy a short distance; reward generously when they pick it up.","Teach 'Drop it': offer a higher-value treat in exchange for the toy.","Gradually increase throwing distance as reliability improves.","Combine the full chain: throw → fetch → drop it → reward. Keep it playful!"] },
];
const TLC = { Beginner:{c:"#059669",bg:"#d1fae5"}, Intermediate:{c:"#d97706",bg:"#fef3c7"}, Advanced:{c:"#dc2626",bg:"#fee2e2"} };

const SOS = [
  { symptom:"Vomiting",   icon:"🤢", cases:[
    { label:"1–2 times, no blood",              verdict:"Monitor",    vc:"#059669",bg:"#d1fae5", advice:"Withhold food 2–4 hrs, offer small sips of water. Likely minor upset." },
    { label:"3+ times, blood, or lethargic",    verdict:"Vet urgently",vc:"#dc2626",bg:"#fee2e2",advice:"Could indicate poisoning or serious illness. Don't wait." },
  ]},
  { symptom:"Diarrhea",   icon:"💩", cases:[
    { label:"1–2 soft stools, no blood",        verdict:"Monitor",    vc:"#059669",bg:"#d1fae5", advice:"Bland diet: boiled chicken + plain rice. Keep hydration up." },
    { label:"Blood, mucus or very frequent",    verdict:"Vet soon",   vc:"#d97706",bg:"#fef3c7", advice:"Could be infection, parasites or colitis." },
  ]},
  { symptom:"Lethargy",   icon:"😴", cases:[
    { label:"Mild, still eating normally",      verdict:"Monitor 24h",vc:"#059669",bg:"#d1fae5", advice:"Rest and watch for other symptoms. May just be tired." },
    { label:"Sudden, severe or not eating",     verdict:"Vet urgently",vc:"#dc2626",bg:"#fee2e2",advice:"Sudden severe lethargy can signal serious internal issues." },
  ]},
  { symptom:"Limping",    icon:"🦵", cases:[
    { label:"Mild, still bearing weight",       verdict:"Monitor",    vc:"#059669",bg:"#d1fae5", advice:"Rest and limit activity. Check paw for cuts or thorns." },
    { label:"Not bearing weight or sudden",     verdict:"Vet soon",   vc:"#d97706",bg:"#fef3c7", advice:"Could be fracture, sprain or joint issue." },
  ]},
  { symptom:"Not Eating", icon:"🍽️", cases:[
    { label:"Skipped 1 meal",                   verdict:"Monitor",    vc:"#059669",bg:"#d1fae5", advice:"Common in heat or mild stress. Try warming the food slightly." },
    { label:"2+ days or with weight loss",      verdict:"Vet soon",   vc:"#d97706",bg:"#fef3c7", advice:"Prolonged anorexia always warrants a vet check." },
  ]},
  { symptom:"Coughing",   icon:"😮‍💨", cases:[
    { label:"Occasional, no discharge",         verdict:"Monitor",    vc:"#059669",bg:"#d1fae5", advice:"Could be dust or mild irritant. Watch for 48 hours." },
    { label:"Persistent or with discharge",     verdict:"Vet soon",   vc:"#d97706",bg:"#fef3c7", advice:"May indicate kennel cough, infection or heart issues." },
  ]},
  { symptom:"Breathing Difficulty", icon:"😤", cases:[
    { label:"Any difficulty breathing",         verdict:"EMERGENCY",  vc:"#dc2626",bg:"#fee2e2", advice:"Go to an emergency vet immediately. Never wait on this." },
  ]},
  { symptom:"Excess Scratching", icon:"🐾", cases:[
    { label:"Mild and occasional",              verdict:"Monitor",    vc:"#059669",bg:"#d1fae5", advice:"Check for fleas. May be seasonal allergies." },
    { label:"Constant, hot spots or hair loss", verdict:"Vet soon",   vc:"#d97706",bg:"#fef3c7", advice:"Allergies, mange or skin infection. Needs treatment." },
  ]},
];

const RECIPES = [
  { id:1,  name:"PB Banana Bites",            emoji:"🥜", time:"20 min",         diff:"Easy",   seasons:["Spring","Summer","Fall","Winter"], goals:["energy","weight"],      tags:["Energy Boost","All Seasons"],      ingredients:["2 ripe bananas","1 cup rolled oats","2 tbsp natural PB (xylitol-free!)","1 egg"], note:"⚠️ Always check PB is xylitol-free.", instructions:"1. Preheat oven to 350°F (175°C).\n2. Mash bananas until smooth.\n3. Mix in peanut butter and egg.\n4. Fold in oats.\n5. Drop spoonfuls onto lined sheet.\n6. Bake 12–15 min until golden.\n7. Cool fully. Fridge up to 1 week.", benefit:"Great pre-hike or play-session energy snack" },
  { id:2,  name:"Chicken Sweet Potato Treats", emoji:"🍗", time:"35 min",         diff:"Medium", seasons:["Fall","Winter"],                    goals:["energy","joints","weight"],    tags:["Protein-Rich","Joint Health"],     ingredients:["1 cup shredded cooked chicken","1 cup mashed sweet potato","2 cups whole wheat flour","1 egg","½ cup low-sodium chicken broth"], instructions:"1. Preheat oven to 375°F.\n2. Combine sweet potato, chicken, egg.\n3. Mix in flour and broth to form dough.\n4. Roll to ¼ inch, cut shapes.\n5. Bake 25–30 min until firm.\n6. Store up to 2 weeks.", benefit:"Beta-carotene & lean protein for strong muscles" },
  { id:3,  name:"Blueberry Oat Minis",         emoji:"🫐", time:"15 min",         diff:"Easy",   seasons:["Spring","Summer"],                  goals:["immune","energy","calm"],       tags:["Antioxidants","Training Treats"],  ingredients:["½ cup fresh blueberries","1 cup oat flour","¼ cup plain Greek yogurt","1 tbsp honey"], instructions:"1. Preheat oven to 325°F.\n2. Mash blueberries.\n3. Mix all into smooth dough.\n4. Roll into pea-sized balls.\n5. Flatten on lined sheet.\n6. Bake 12–14 min. Fridge up to 5 days.", benefit:"Bite-sized antioxidant treats — perfect for training" },
  { id:4,  name:"Pumpkin Frozen Pops",          emoji:"🎃", time:"5 min + freeze", diff:"Easy",   seasons:["Summer"],                            goals:["digestion","weight","calm"],     tags:["Cooling","Summer"],               ingredients:["1 cup pure pumpkin purée","½ cup plain yogurt","2 tbsp peanut butter","Banana slices"], instructions:"1. Mix pumpkin, yogurt, PB.\n2. Spoon into ice cube trays.\n3. Press banana slice on top.\n4. Freeze 4+ hours.\n5. Store in freezer bag up to 1 month.", benefit:"Cooling treat that also soothes digestion" },
  { id:5,  name:"Salmon Dill Biscuits",         emoji:"🐟", time:"30 min",         diff:"Medium", seasons:["Fall","Winter","Spring"],             goals:["coat","joints","senior"],       tags:["Omega-3","Coat Health"],          ingredients:["1 can (5oz) salmon in water, drained","1½ cups rice flour","1 egg","2 tbsp fresh dill","2 tbsp olive oil"], instructions:"1. Preheat oven to 350°F.\n2. Flake salmon, remove bones.\n3. Mix all into firm dough.\n4. Roll thin, cut shapes.\n5. Bake 20–25 min until crispy.\n6. Fridge up to 2 weeks.", benefit:"Excellent for skin, coat & joint health" },
  { id:6,  name:"Apple Carrot Crunchies",       emoji:"🍎", time:"25 min",         diff:"Easy",   seasons:["Fall","Winter","Spring"],             goals:["dental","weight","digestion"],  tags:["Dental Health","Low Fat"],        ingredients:["1 cup grated carrot","½ cup unsweetened applesauce","2 cups whole wheat flour","1 egg","1 tsp cinnamon"], instructions:"1. Preheat oven to 350°F.\n2. Mix carrot, applesauce, egg.\n3. Add flour and cinnamon; form dough.\n4. Roll ¼ inch, cut shapes.\n5. Bake 18–22 min until crunchy.\n6. Store airtight up to 3 weeks.", benefit:"Crunch naturally helps with dental hygiene" },
  { id:7,  name:"Watermelon Ice Cubes",         emoji:"🍉", time:"5 min + freeze", diff:"Easy",   seasons:["Summer"],                            goals:["weight","digestion","calm"],     tags:["Cooling","Hydration"],            ingredients:["2 cups seedless watermelon","½ cup coconut water","Fresh mint (optional)"], instructions:"1. Blend watermelon until smooth.\n2. Stir in coconut water.\n3. Pour into ice cube trays.\n4. Add mint leaf to each.\n5. Freeze 3–4 hours.\n6. Serve immediately from freezer.", benefit:"Hydrating & refreshing on hot summer days" },
  { id:8,  name:"Pumpkin Spice Biscuits",       emoji:"🎃", time:"30 min",         diff:"Easy",   seasons:["Fall"],                              goals:["digestion","immune","senior"],   tags:["Fall Special","Digestive Health"],ingredients:["1 cup pure pumpkin purée","2½ cups whole wheat flour","2 eggs","1 tsp cinnamon","¼ tsp ginger","2 tbsp honey"], instructions:"1. Preheat oven to 350°F.\n2. Mix pumpkin, eggs, honey.\n3. Add flour and spices; knead dough.\n4. Roll ¼ inch, cut shapes.\n5. Bake 25 min until firm.\n6. Store up to 3 weeks.", benefit:"Pumpkin aids digestion and immune health" },
  { id:9,  name:"Cranberry Oat Balls",          emoji:"🔴", time:"15 min",         diff:"Easy",   seasons:["Winter","Fall"],                     goals:["immune","energy","coat"],       tags:["Antioxidants","Winter Warmth"],   ingredients:["1 cup rolled oats","¼ cup dried cranberries (unsweetened)","½ cup peanut butter","2 tbsp honey","½ tsp cinnamon"], instructions:"1. Mix all ingredients in a bowl.\n2. Roll tablespoon-sized portions into balls.\n3. Refrigerate 30 min to firm up.\n4. Store airtight in fridge up to 2 weeks.\n5. No baking needed!", benefit:"Antioxidant-rich immune boost for cold months" },
  { id:10, name:"Carrot Ginger Bites",          emoji:"🥕", time:"20 min",         diff:"Easy",   seasons:["Spring"],                            goals:["digestion","energy","weight"],  tags:["Spring Fresh","Digestive Health"],ingredients:["1 cup grated carrot","1 cup oat flour","1 egg","1 tsp grated fresh ginger","2 tbsp coconut oil"], instructions:"1. Preheat oven to 350°F.\n2. Mix all into moist dough.\n3. Roll into small balls.\n4. Bake 15–18 min until set.\n5. Cool on wire rack.\n6. Fridge up to 10 days.", benefit:"Light spring treat that supports digestion & energy" },
  { id:11, name:"Sweet Potato Rosemary Chews",  emoji:"🍠", time:"3 hrs",           diff:"Easy",   seasons:["Fall","Winter"],                     goals:["joints","senior","dental","calm"],tags:["Joint Health","Grain-Free"],     ingredients:["2 large sweet potatoes","1 tsp dried rosemary","1 tbsp olive oil"], instructions:"1. Preheat oven to 250°F.\n2. Slice sweet potatoes ¼ inch thick.\n3. Toss with oil and rosemary.\n4. Spread on lined sheet.\n5. Bake 2.5–3 hrs flipping halfway.\n6. Store airtight up to 2 weeks.", benefit:"Natural chew that supports joints and digestion" },
  { id:12, name:"Mint Yogurt Drops",            emoji:"🌿", time:"10 min + freeze", diff:"Easy",   seasons:["Spring","Summer"],                   goals:["dental","weight","calm"],       tags:["Dental Health","Cooling"],        ingredients:["1 cup plain Greek yogurt","2 tbsp chopped fresh mint","1 tbsp honey"], instructions:"1. Mix yogurt, mint, honey.\n2. Pipe small drops onto lined sheet.\n3. Freeze 1–2 hours until firm.\n4. Peel off and store in freezer bag.\n5. Serve directly from freezer.", benefit:"Freshens breath and cools dogs in warm weather" },
];
const DEFAULT_REMINDERS = [
  { id:1, label:"Heartworm Medicine",    icon:"💊", freq:"Monthly", date:"May 1",  on:true  },
  { id:2, label:"Flea & Tick Prevention",icon:"🦟", freq:"Monthly", date:"Apr 20", on:true  },
  { id:3, label:"Annual Vet Checkup",    icon:"🏥", freq:"Yearly",  date:"Aug 15", on:false },
  { id:4, label:"Fish Oil Supplement",   icon:"🐟", freq:"Daily",   date:"Today",  on:true  },
  { id:5, label:"Dental Cleaning",       icon:"🦷", freq:"Yearly",  date:"Jun 10", on:false },
];
const TIPS = ["Dogs can get sunburned — apply pet-safe sunscreen on their nose and ear tips on hot days.","Mental enrichment can tire a dog as much as physical exercise. Try a puzzle feeder today!","After hiking, always check paws for cuts, thorns, or signs of heat stress.","A Kong stuffed with PB and frozen keeps dogs calm when you're busy working.","Senior dogs benefit from shorter, more frequent walks rather than one long outing.","A dog's nose has 300M scent receptors — sniff walks are deeply enriching!","Rotate toys weekly to keep your dog interested — novelty boosts engagement."];
const SEASON_META = { Spring:{ icon:"🌸", color:"#d97706", bg:"#fef3c7" }, Summer:{ icon:"☀️", color:"#0891b2", bg:"#cffafe" }, Fall:{ icon:"🍂", color:"#c2410c", bg:"#ffedd5" }, Winter:{ icon:"❄️", color:"#2563eb", bg:"#dbeafe" } };
const SEASONS_LIST = ["All","Spring","Summer","Fall","Winter"];
const TAG_COLORS = { "Energy Boost":"#92400e","All Seasons":"#065f46","Protein-Rich":"#1e40af","Joint Health":"#6b21a8","Antioxidants":"#831843","Training Treats":"#065f46","Cooling":"#0c4a6e","Summer":"#b45309","Digestive Health":"#14532d","Omega-3":"#0e4a6e","Coat Health":"#6b21a8","Dental Health":"#0c4a6e","Low Fat":"#14532d","Fall Special":"#92400e","Winter Warmth":"#1e3a8a","Spring Fresh":"#065f46","Hydration":"#0c4a6e","Grain-Free":"#713f12" };
const TAG_BG = { "Energy Boost":"#fef3c7","All Seasons":"#d1fae5","Protein-Rich":"#dbeafe","Joint Health":"#f3e8ff","Antioxidants":"#fce7f3","Training Treats":"#d1fae5","Cooling":"#e0f2fe","Summer":"#fef3c7","Digestive Health":"#d1fae5","Omega-3":"#e0f2fe","Coat Health":"#f3e8ff","Dental Health":"#e0f2fe","Low Fat":"#d1fae5","Fall Special":"#ffedd5","Winter Warmth":"#dbeafe","Spring Fresh":"#d1fae5","Hydration":"#e0f2fe","Grain-Free":"#fef3c7" };
const getSeason = () => { const m = new Date().getMonth(); return m>=2&&m<=4?"Spring":m>=5&&m<=7?"Summer":m>=8&&m<=10?"Fall":"Winter"; };

// ── HELPERS ───────────────────────────────────────────────────────────────────
function Tag({ label }) {
  return <span style={{ background:TAG_BG[label]||"#f3f4f6", color:TAG_COLORS[label]||"#374151", fontSize:11, fontWeight:500, padding:"2px 8px", borderRadius:20, display:"inline-block" }}>{label}</span>;
}
function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} style={{ width:44, height:24, borderRadius:12, border:"none", cursor:"pointer", background:on?"#f59e0b":"#d1d5db", position:"relative", padding:0, flexShrink:0 }}>
      <div style={{ width:18, height:18, borderRadius:"50%", background:"white", position:"absolute", top:3, left:on?23:3, transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", photo:null, breed:"", size:"", age:"", goals:[] });
  const [bSearch, setBSearch] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [bLoading, setBLoading] = useState(true);
  const fRef = useRef();

  useState(() => {
    fetch("https://dog.ceo/api/breeds/list/all")
      .then(r => r.json())
      .then(data => {
        const list = [];
        Object.entries(data.message).forEach(([breed, subs]) => {
          const b = breed.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          if (subs.length === 0) {
            list.push(b);
          } else {
            subs.forEach(sub => {
              const s = sub.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
              list.push(s + " " + b);
            });
          }
        });
        list.sort();
        list.push("Mixed Breed", "Other");
        setBreeds(list);
      })
      .catch(() => setBreeds(["Mixed Breed","Other"]))
      .finally(() => setBLoading(false));
  }, []);

  const filteredBreeds = breeds.filter(b => b.toLowerCase().includes(bSearch.toLowerCase()));
  const STEPS = [
    { key:"name",  emoji:"🐾", title:"Welcome to PawDay!", sub:"Let's get to know your pup first.", isText:true,  skip:false },
    { key:"photo", emoji:"📸", title:"Add a photo!",        sub:"Totally optional — but adorable.",  isPhoto:true, skip:true  },
    { key:"breed", emoji:"🐕", title:`Nice to meet ${form.name||"your dog"}!`, sub:"Breed helps personalise your tips.", isBreed:true, skip:true },
    { key:"size",  emoji:"📏", title:`How big is ${form.name||"your dog"}?`, sub:"Size shapes portions & treat recipes.", isSize:true, skip:true },
    { key:"age",   emoji:"🎂", title:`How old is ${form.name||"your dog"}?`, sub:"Age tailors food & activity advice.", isAge:true, skip:true },
    { key:"goals", emoji:"🎯", title:"Health goals?", sub:"Pick as many as you like — we pair recipes to match.", isGoals:true, skip:true },
  ];
  const toggleGoal = id => setForm(f => ({ ...f, goals: f.goals.includes(id) ? f.goals.filter(x=>x!==id) : [...f.goals, id] }));
  if (step === STEPS.length) return (
    <div style={{ minHeight:"100vh", background:"#fffbf0", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:24, textAlign:"center", fontFamily:"system-ui,sans-serif", maxWidth:430, margin:"0 auto" }}>
      {form.photo ? <img src={form.photo} alt="dog" style={{ width:100,height:100,borderRadius:"50%",objectFit:"cover",border:"4px solid #f59e0b",marginBottom:16 }} /> : <div style={{ fontSize:72, marginBottom:16 }}>🐾</div>}
      <div style={{ fontSize:26, fontWeight:700, color:"#92400e", marginBottom:8 }}>All set, {form.name||"pup"}!</div>
      <div style={{ fontSize:14, color:"#9ca3af", marginBottom:20, lineHeight:1.6 }}>Your daily dog companion is ready.<br/>Let's make every day the best day.</div>
      {form.goals.length>0 && <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center", marginBottom:20 }}>{form.goals.map(g=>{const gl=HEALTH_GOALS.find(x=>x.id===g);return gl?<span key={g} style={{background:GB[g],color:GC[g],fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:20}}>{gl.icon} {gl.label}</span>:null;})}</div>}
      <button onClick={()=>onComplete(form)} style={{ background:"#f59e0b", color:"white", border:"none", borderRadius:14, padding:16, fontWeight:700, fontSize:16, cursor:"pointer", width:"100%", maxWidth:280 }}>Open PawDay 🐶</button>
    </div>
  );
  const cur = STEPS[step];
  const canContinue = cur.skip || !!form[cur.key];
  return (
    <div style={{ minHeight:"100vh", background:"#fffbf0", display:"flex", flexDirection:"column", fontFamily:"system-ui,sans-serif", maxWidth:430, margin:"0 auto" }}>
      <div style={{ background:"#f59e0b", padding:"40px 24px 32px" }}>
        <div style={{ display:"flex", gap:6, marginBottom:20 }}>{STEPS.map((_,i)=><div key={i} style={{ height:4, borderRadius:4, flex:1, background:i<=step?"white":"rgba(255,255,255,0.35)" }} />)}</div>
        <div style={{ fontSize:40, marginBottom:10 }}>{cur.emoji}</div>
        <div style={{ color:"white", fontSize:26, fontWeight:700, lineHeight:1.2 }}>{cur.title}</div>
        <div style={{ color:"rgba(255,255,255,0.8)", fontSize:14, marginTop:6 }}>{cur.sub}</div>
      </div>
      <div style={{ flex:1, padding:"24px 20px", overflowY:"auto" }}>
        <span style={{ fontSize:12, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10, display:"block" }}>
          {cur.isText?"What's your dog's name?":cur.isPhoto?"Upload a photo":cur.isBreed?"What breed are they?":cur.isSize?"Pick their size":cur.isAge?"Pick their age range":"Select all that apply"}
        </span>
        {cur.isText && <input autoFocus value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&form.name.trim()&&setStep(s=>s+1)} placeholder="e.g. Buddy, Luna, Max..." style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:14, padding:"14px 16px", fontSize:16, outline:"none", background:"white", color:"#1f2937", boxSizing:"border-box", marginBottom:8 }} />}
        {cur.isPhoto && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, paddingTop:8 }}>
            {form.photo ? <img src={form.photo} alt="dog" onClick={()=>fRef.current.click()} style={{ width:140,height:140,borderRadius:"50%",objectFit:"cover",border:"4px solid #f59e0b",cursor:"pointer" }} />
              : <div onClick={()=>fRef.current.click()} style={{ width:140,height:140,borderRadius:"50%",background:"#fef3c7",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"3px dashed #f59e0b",cursor:"pointer",gap:8 }}><span style={{fontSize:40}}>📷</span><span style={{fontSize:12,color:"#d97706",fontWeight:600}}>Tap to upload</span></div>}
            <input ref={fRef} type="file" accept="image/*" onChange={e=>{const f2=e.target.files?.[0];if(!f2)return;const r=new FileReader();r.onload=ev=>setForm(f=>({...f,photo:ev.target.result}));r.readAsDataURL(f2);}} style={{display:"none"}} />
            {form.photo && <button onClick={()=>setForm(f=>({...f,photo:null}))} style={{color:"#9ca3af",background:"none",border:"none",fontSize:13,cursor:"pointer",textDecoration:"underline"}}>Remove</button>}
            <div style={{ fontSize:13, color:"#9ca3af", textAlign:"center" }}>Photo stays on your device — never uploaded.</div>
          </div>
        )}
        {cur.isBreed && (
          <div>
            <input value={bSearch} onChange={e=>setBSearch(e.target.value)} placeholder="Search breed..." style={{ width:"100%",border:"1.5px solid #e5e7eb",borderRadius:14,padding:"14px 16px",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:6 }} />
            <div style={{ background:"white",borderRadius:14,border:"1.5px solid #e5e7eb",maxHeight:200,overflowY:"auto" }}>
              {bLoading ? (
                <div style={{ padding:"20px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
                  🐕 Loading breeds…
                </div>
              ) : filteredBreeds.length === 0 ? (
                <div style={{ padding:"16px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>No breeds found</div>
              ) : filteredBreeds.map(b => (
                <div key={b} onClick={()=>{setForm(f=>({...f,breed:b}));setBSearch(b);}} style={{ padding:"11px 14px",cursor:"pointer",fontSize:14,borderBottom:"1px solid #f3f4f6",background:form.breed===b?"#fef3c7":"white",color:form.breed===b?"#92400e":"#374151",fontWeight:form.breed===b?700:400 }}>
                  {form.breed===b&&"✓ "}{b}
                </div>
              ))}
            </div>
            {!bLoading && <div style={{ fontSize:11, color:"#9ca3af", marginTop:6 }}>
              {breeds.length - 2} breeds available · Source: Dog CEO API
            </div>}
          </div>
        )}
        {cur.isSize && (
          <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
            {DOG_SIZES.map(sz=>(
              <button key={sz.id} onClick={()=>setForm(f=>({...f,size:sz.id}))} style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 16px",borderRadius:16,border:`2px solid ${form.size===sz.id?"#f59e0b":"#e5e7eb"}`,background:form.size===sz.id?"#fef3c7":"white",cursor:"pointer",textAlign:"left" }}>
                <span style={{fontSize:30}}>{sz.icon}</span>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:form.size===sz.id?"#92400e":"#1f2937"}}>{sz.label} <span style={{fontWeight:400,fontSize:12,color:"#9ca3af"}}>· {sz.sub}</span></div><div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>{sz.example}</div></div>
                {form.size===sz.id && <span style={{color:"#f59e0b",fontSize:18}}>✓</span>}
              </button>
            ))}
          </div>
        )}
        {cur.isAge && (
          <div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:12 }}>
              {[["Puppy","🐣","< 1 yr"],["Young","🐕","1–3 yrs"],["Adult","🐩","4–7 yrs"],["Senior","🦮","8+ yrs"]].map(([lbl,ic,sub])=>(
                <button key={lbl} onClick={()=>setForm(f=>({...f,age:lbl}))} style={{ padding:"14px 10px",borderRadius:16,border:`2px solid ${form.age===lbl?"#f59e0b":"#e5e7eb"}`,background:form.age===lbl?"#fef3c7":"white",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
                  <span style={{fontSize:28}}>{ic}</span><span style={{fontSize:14,fontWeight:700,color:form.age===lbl?"#92400e":"#1f2937"}}>{lbl}</span><span style={{fontSize:11,color:"#9ca3af"}}>{sub}</span>
                </button>
              ))}
            </div>
            <div style={{fontSize:12,color:"#9ca3af"}}>You can always update this in Profile settings.</div>
          </div>
        )}
        {cur.isGoals && (
          <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
            {HEALTH_GOALS.map(g=>{
              const active=form.goals.includes(g.id);
              return (
                <button key={g.id} onClick={()=>toggleGoal(g.id)} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:16,border:`2px solid ${active?GC[g.id]:"#e5e7eb"}`,background:active?GB[g.id]:"white",cursor:"pointer",textAlign:"left" }}>
                  <span style={{fontSize:22}}>{g.icon}</span>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:active?GC[g.id]:"#1f2937"}}>{g.label}</div><div style={{fontSize:11,color:"#9ca3af"}}>{g.desc}</div></div>
                  <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${active?GC[g.id]:"#d1d5db"}`,background:active?GC[g.id]:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{active&&<span style={{color:"white",fontSize:11,fontWeight:700}}>✓</span>}</div>
                </button>
              );
            })}
            {form.goals.length>0&&<div style={{fontSize:13,color:"#d97706",fontWeight:600,textAlign:"center",paddingTop:4}}>{form.goals.length} goal{form.goals.length>1?"s":""} selected ✓</div>}
          </div>
        )}
        <button onClick={()=>canContinue&&setStep(s=>s+1)} style={{ background:"#f59e0b",color:"white",border:"none",borderRadius:14,padding:16,fontWeight:700,fontSize:16,cursor:"pointer",width:"100%",marginTop:16,opacity:canContinue?1:0.4 }}>
          {step===STEPS.length-1?"Let's Go! 🐾":"Continue →"}
        </button>
        {cur.skip && <button onClick={()=>setStep(s=>s+1)} style={{ background:"transparent",color:"#9ca3af",border:"none",padding:12,fontSize:14,cursor:"pointer",width:"100%",marginTop:4 }}>Skip for now</button>}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function PawDay() {
  const [onboarded, setOnboarded] = useState(false);
  const [plan, setPlan] = useState("free");
  const [dogs, setDogs] = useState([]);
  const [dogIdx, setDogIdx] = useState(0);
  const [tab, setTab] = useState("home");
  const [hTab, setHTab] = useState("journal");
  const [sTab, setSTab] = useState("ai");
  const [trickLevel, setTrickLevel] = useState("All");
  const [activity, setActivity] = useState(null);
  const [wx, setWx] = useState(WEATHERS[1]);
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS);
  const [newRem, setNewRem] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [sugLoading, setSugLoading] = useState(false);
  const [aiRecipe, setAiRecipe] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedTrick, setSelectedTrick] = useState(null);
  const [recipeSeason, setRecipeSeason] = useState("All");
  const [goalFilters, setGoalFilters] = useState([]);
  const [tipIdx] = useState(()=>Math.floor(Math.random()*TIPS.length));
  const [editDog, setEditDog] = useState(null);
  const [showAddDog, setShowAddDog] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newJournal, setNewJournal] = useState({ mood:3, energy:3, appetite:"good", poop:"normal", notes:"" });
  const [portW, setPortW] = useState("");
  const [portAct, setPortAct] = useState("moderate");
  const [portFood, setPortFood] = useState("dry");
  const [sosOpen, setSosOpen] = useState(null);
  const [pdfToast, setPdfToast] = useState(false);
  const editPhotoRef = useRef();

  const season = getSeason();
  const sm = SEASON_META[season];
  const isPro = plan !== "free";
  const isProPlus = plan === "pro_plus";
  const dog = dogs[dogIdx] || {};
  const journal = dog.journal || [];
  const weights = dog.weights || [];

  const updateDog = useCallback((fn)=>setDogs(ds=>ds.map((d,i)=>i===dogIdx?{...d,...fn(d)}:d)),[dogIdx]);

  const handleOnboardingComplete = (form) => {
    const newDog = { ...form, weight:"", allergies:"",
      journal:[
        { mood:4, energy:5, appetite:"good", poop:"normal", notes:"Great day at the park! 🌳", date:"May 25" },
        { mood:3, energy:3, appetite:"good", poop:"normal", notes:"", date:"May 24" },
        { mood:5, energy:5, appetite:"good", poop:"normal", notes:"Training session — very focused!", date:"May 23" },
      ],
      weights:[{date:"Apr 1",w:30.2},{date:"Apr 15",w:30.0},{date:"May 1",w:29.8},{date:"May 15",w:29.5},{date:"May 26",w:29.3}]
    };
    setDogs([newDog]); setDogIdx(0);
    if (form.goals?.length) setGoalFilters(form.goals);
    setOnboarded(true);
  };

  const callClaude = useCallback(async (prompt, max=1000) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:max, messages:[{role:"user",content:prompt}] })
    });
    const data = await res.json();
    return data.content[0].text.replace(/```json\n?|```/g,"").trim();
  }, []);

  const generateSuggestions = useCallback(async (act=activity) => {
    if (!act) return;
    setSugLoading(true); setSuggestions(null);
    const n = isPro?4:2;
    const goalLabels = dog.goals?.map(g=>HEALTH_GOALS.find(x=>x.id===g)?.label).filter(Boolean).join(", ")||"none";
    const szMeta = DOG_SIZES.find(sz=>sz.id===dog.size);
    const prompt = `You are a dog care expert. Dog: ${dog.name||"dog"}, ${dog.breed||"unknown"}, ${dog.age||"unknown"}, ${szMeta?szMeta.label+" "+szMeta.sub:"unknown size"}. Health goals: ${goalLabels}. Situation: ${act.label}. Weather: ${wx.cond}, ${wx.temp}°F. Season: ${season}. Allergies: ${dog.allergies||"none"}.
Return ONLY valid JSON: {"food":[],"treats":[],"tricks":[],"enrichment":[],"tips":[]}. Each array has exactly ${n} short items under 20 words. Be specific and actionable.`;
    try { setSuggestions(JSON.parse(await callClaude(prompt))); } catch { setSuggestions({_err:true}); }
    setSugLoading(false);
  }, [activity, isPro, dog, wx, season, callClaude]);

  const generateAiRecipe = useCallback(async () => {
    setRecLoading(true); setAiRecipe(null);
    const goalLabels = dog.goals?.map(g=>HEALTH_GOALS.find(x=>x.id===g)?.label).filter(Boolean).join(", ")||"general health";
    const szMeta = DOG_SIZES.find(sz=>sz.id===dog.size);
    const prompt = `Create a unique healthy homemade dog treat recipe for: ${dog.name||"dog"}, ${dog.breed||"unknown"}, ${dog.age||"unknown"}, size: ${szMeta?.label||"unknown"}. Health goals: ${goalLabels}. Season: ${season}. Weather: ${wx.cond}. Activity: ${activity?.label||"relaxing"}. Allergies: ${dog.allergies||"none"}.
Return ONLY valid JSON: {"name":"","emoji":"🦴","time":"X min","diff":"Easy or Medium","tags":[],"ingredients":[],"instructions":"steps with \\n","benefit":""}`;
    try { setAiRecipe({...JSON.parse(await callClaude(prompt,800)),isAi:true}); } catch { setAiRecipe({_err:true}); }
    setRecLoading(false);
  }, [dog, season, wx, activity, callClaude]);

  const portionResult = useCallback(() => {
    const w = parseFloat(portW); if (!w||w<=0) return null;
    const mult = {low:0.8,moderate:1.0,high:1.2}[portAct];
    const kcalDay = 70*Math.pow(w,0.75)*(dog.age==="Puppy"?3:dog.age==="Senior"?1.4:1.8)*mult;
    const kcalPer100 = portFood==="dry"?360:portFood==="wet"?100:150;
    const grams = Math.round((kcalDay/kcalPer100)*100);
    return { cups:(grams/85).toFixed(2), grams, kcalDay:Math.round(kcalDay) };
  }, [portW, portAct, portFood, dog.age]);

  const S = {
    app:{ minHeight:"100vh",background:"#fffbf0",fontFamily:"system-ui,sans-serif",maxWidth:430,margin:"0 auto",position:"relative",paddingBottom:72 },
    header:{ background:"#f59e0b",padding:"36px 16px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start" },
    body:{ padding:"16px 16px 0" },
    card:{ background:"white",borderRadius:16,padding:"12px 16px",marginBottom:12,border:"1px solid #fde68a" },
    stitle:{ fontSize:13,fontWeight:700,color:"#78350f",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em" },
    btn:{ background:"#f59e0b",color:"white",border:"none",borderRadius:14,padding:"14px 20px",fontWeight:700,fontSize:16,cursor:"pointer",width:"100%",marginTop:4 },
    btnO:{ background:"transparent",color:"#d97706",border:"2px solid #f59e0b",borderRadius:14,padding:"10px 20px",fontWeight:600,fontSize:14,cursor:"pointer",width:"100%",marginTop:8 },
    btnPro:{ background:"#7c3aed",color:"white",border:"none",borderRadius:12,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer" },
    btnDis:{ background:"#d1d5db",color:"#9ca3af",border:"none",borderRadius:14,padding:"14px 20px",fontWeight:700,fontSize:16,cursor:"not-allowed",width:"100%",marginTop:4 },
    overlay:{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:50,display:"flex",alignItems:"flex-end",justifyContent:"center" },
    modal:{ background:"white",width:"100%",maxWidth:430,borderRadius:"20px 20px 0 0",padding:"24px 20px 32px",maxHeight:"92vh",overflowY:"auto" },
    input:{ border:"1px solid #e5e7eb",borderRadius:12,padding:"10px 14px",fontSize:14,outline:"none",background:"white",color:"#1f2937",flex:1 },
    nav:{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"white",borderTop:"1px solid #f3f4f6",display:"flex",zIndex:40 },
    navBtn:{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 0 12px",border:"none",background:"transparent",cursor:"pointer",fontSize:10,fontWeight:500,gap:2 },
  };
  const NAV = [{id:"home",icon:"🏠",label:"Home"},{id:"suggest",icon:"✨",label:"Suggest"},{id:"recipes",icon:"🍖",label:"Recipes"},{id:"health",icon:"🏥",label:"Health"},{id:"profile",icon:"🐶",label:"Profile"}];

  // ── HOME ──
  function renderHome() {
    return (
      <div>
        <div style={{background:"#fffbeb",borderRadius:16,padding:"12px 14px",marginBottom:14,border:"1px solid #fde68a",display:"flex",gap:10}}>
          <span style={{fontSize:18,flexShrink:0}}>💡</span>
          <div><div style={{fontSize:11,fontWeight:700,color:"#d97706",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Tip of the Day</div><div style={{fontSize:13,color:"#78350f",lineHeight:1.5}}>{TIPS[tipIdx]}</div></div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={S.stitle}>Today's Weather</div>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
            {WEATHERS.map(w=><button key={w.id} onClick={()=>setWx(w)} style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 10px",borderRadius:14,border:`2px solid ${wx.id===w.id?"#f59e0b":"transparent"}`,background:wx.id===w.id?"#fef3c7":"white",cursor:"pointer",minWidth:58}}><span style={{fontSize:22}}>{w.icon}</span><span style={{fontSize:11,color:"#374151",marginTop:2}}>{w.label}</span><span style={{fontSize:11,fontWeight:700,color:"#d97706"}}>{w.temp}°F</span></button>)}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={S.stitle}>What's happening today?</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {ACTIVITIES.map(a=>{
              const locked=a.pro&&!isPro; const active=activity?.id===a.id;
              return <button key={a.id} onClick={()=>locked?setShowUpgrade(true):setActivity(a)} style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 4px",borderRadius:14,border:`2px solid ${active?"#f59e0b":locked?"#e5e7eb":"#f3f4f6"}`,background:active?"#fef3c7":locked?"#f9fafb":"white",cursor:"pointer",opacity:locked?0.6:1}}>
                {locked&&<span style={{position:"absolute",top:4,right:6,fontSize:10}}>🔒</span>}
                <span style={{fontSize:22}}>{a.icon}</span><span style={{fontSize:11,textAlign:"center",color:active?"#92400e":"#374151",fontWeight:active?600:400,lineHeight:1.3,marginTop:4}}>{a.label}</span>
              </button>;
            })}
          </div>
        </div>
        <button onClick={()=>{if(!activity)return;setTab("suggest");setSTab("ai");generateSuggestions(activity);}} style={activity?S.btn:S.btnDis}>{activity?`Get Suggestions  ${activity.icon}`:"Select an Activity First"}</button>
        {reminders.filter(r=>r.on&&r.date==="Today").length>0&&(
          <div style={{...S.card,marginTop:14}}>
            <div style={{fontWeight:700,color:"#1f2937",fontSize:14,marginBottom:8}}>⏰ Due Today</div>
            {reminders.filter(r=>r.on&&r.date==="Today").map(r=><div key={r.id} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:6}}><span style={{fontSize:18}}>{r.icon}</span><span style={{fontSize:13,color:"#374151",flex:1}}>{r.label}</span><span style={{fontSize:12,color:"#d97706",fontWeight:600}}>{r.freq}</span></div>)}
          </div>
        )}
      </div>
    );
  }

  // ── SUGGEST ──
  function renderSuggest() {
    const trickAccess = isProPlus ? TRICKS.length : isPro ? 6 : 0;
    const filteredTricks = trickLevel==="All" ? TRICKS : TRICKS.filter(t=>t.level===trickLevel);
    function SuggCard({ icon, title, items, bc }) {
      return (
        <div style={{...S.card,borderLeft:`4px solid ${bc}`,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:20}}>{icon}</span><span style={{fontWeight:700,color:"#1f2937",fontSize:14}}>{title}</span></div>
          {items.map((it,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6}}><span style={{color:"#f59e0b",fontWeight:700,flexShrink:0}}>•</span><span style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{it}</span></div>)}
        </div>
      );
    }
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:18,fontWeight:700,color:"#1f2937"}}>✨ Suggest</div>
          {!isPro&&<button onClick={()=>setShowUpgrade(true)} style={{...S.btnPro,padding:"4px 12px"}}>Unlock Pro</button>}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[["ai","✨ AI Tips"],["training","🎓 Training"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setSTab(id)} style={{flex:1,padding:"9px 0",borderRadius:14,border:`2px solid ${sTab===id?"#f59e0b":"#e5e7eb"}`,background:sTab===id?"#fef3c7":"white",cursor:"pointer",fontWeight:sTab===id?700:500,fontSize:13,color:sTab===id?"#92400e":"#6b7280"}}>{lbl}</button>
          ))}
        </div>

        {sTab==="ai" && (
          <div>
            <div style={{...S.card,display:"flex",alignItems:"center",gap:10,padding:"10px 14px"}}>
              <span style={{fontSize:24}}>{activity?.icon||"🐾"}</span>
              <div style={{flex:1}}><div style={{fontWeight:600,color:"#1f2937",fontSize:14}}>{activity?.label||"No activity selected"}</div><div style={{fontSize:12,color:"#9ca3af"}}>{wx.cond} · {wx.temp}°F · {season}</div></div>
              <button onClick={()=>setTab("home")} style={{fontSize:12,color:"#d97706",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Change</button>
            </div>
            {dog.goals?.length>0&&<div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:4}}>{dog.goals.map(g=>{const gl=HEALTH_GOALS.find(x=>x.id===g);return gl?<span key={g} style={{flexShrink:0,background:GB[g],color:GC[g],fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20}}>{gl.icon} {gl.label}</span>:null;})}</div>}
            {!activity&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:40,marginBottom:10}}>🐾</div><div style={{color:"#9ca3af",fontSize:14}}>Select an activity on Home first</div><button onClick={()=>setTab("home")} style={{color:"#d97706",background:"none",border:"none",cursor:"pointer",fontWeight:600,fontSize:14,marginTop:10}}>→ Go to Home</button></div>}
            {activity&&!suggestions&&!sugLoading&&<button onClick={()=>generateSuggestions()} style={S.btn}>✨ Generate Suggestions</button>}
            {sugLoading&&<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:36,marginBottom:10}}>🐾</div><div style={{color:"#9ca3af"}}>Fetching personalised tips…</div></div>}
            {suggestions&&!suggestions._err&&(
              <div>
                {!isPro&&<div style={{background:"#f5f3ff",borderRadius:14,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>✨</span><div style={{flex:1}}><div style={{fontWeight:700,color:"#4c1d95",fontSize:13}}>More depth with Pro</div><div style={{fontSize:12,color:"#6d28d9"}}>4x suggestions + goal-aware advice</div></div><button onClick={()=>setShowUpgrade(true)} style={{...S.btnPro,padding:"4px 10px",fontSize:12,flexShrink:0}}>Upgrade</button></div>}
                <SuggCard icon="🍽️" title="Food & Nutrition"      items={suggestions.food||[]}       bc="#34d399" />
                <SuggCard icon="🦴" title="Treat Ideas"            items={suggestions.treats||[]}     bc="#f59e0b" />
                <SuggCard icon="🎓" title="Tricks to Practice"    items={suggestions.tricks||[]}     bc="#60a5fa" />
                <SuggCard icon="🧠" title="Enrichment Activities" items={suggestions.enrichment||[]} bc="#a78bfa" />
                <SuggCard icon="💡" title="General Tips"           items={suggestions.tips||[]}       bc="#f472b6" />
                <button onClick={()=>generateSuggestions()} style={S.btnO}>🔄 Regenerate</button>
              </div>
            )}
            {suggestions?._err&&<div style={{textAlign:"center",padding:"30px 0"}}><div style={{color:"#ef4444",marginBottom:8}}>Couldn't load. Please retry.</div><button onClick={()=>generateSuggestions()} style={{color:"#d97706",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Retry</button></div>}
          </div>
        )}

        {sTab==="training" && (
          <div>
            {!isProPlus&&(
              <div style={{background:"#f5f3ff",borderRadius:14,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>🎓</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:"#4c1d95",fontSize:13}}>{isPro?"Upgrade to Pro+ for the full library":"Training Library — Pro & above"}</div>
                  <div style={{fontSize:12,color:"#6d28d9"}}>{isPro?"You have 6/12 tricks · Pro+ unlocks all 12":"Unlock beginner → advanced tricks starting with Pro"}</div>
                </div>
                <button onClick={()=>setShowUpgrade(true)} style={{...S.btnPro,padding:"4px 10px",fontSize:12,flexShrink:0}}>{isPro?"Pro+":"Unlock"}</button>
              </div>
            )}
            <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:2}}>
              {["All","Beginner","Intermediate","Advanced"].map(l=>(
                <button key={l} onClick={()=>setTrickLevel(l)} style={{flexShrink:0,padding:"6px 14px",borderRadius:20,border:`2px solid ${trickLevel===l?(TLC[l]?.c||"#f59e0b"):"#e5e7eb"}`,background:trickLevel===l?(TLC[l]?.bg||"#fef3c7"):"white",color:trickLevel===l?(TLC[l]?.c||"#92400e"):"#6b7280",fontWeight:trickLevel===l?700:500,fontSize:12,cursor:"pointer"}}>{l}</button>
              ))}
            </div>
            {!isPro ? (
              <div onClick={()=>setShowUpgrade(true)} style={{...S.card,display:"flex",flexDirection:"column",alignItems:"center",gap:12,cursor:"pointer",padding:24,background:"#f5f3ff",borderColor:"#ddd6fe",textAlign:"center"}}>
                <span style={{fontSize:44}}>🎓</span>
                <div style={{fontWeight:700,color:"#4c1d95",fontSize:16}}>Training Library</div>
                <div style={{fontSize:13,color:"#6d28d9",lineHeight:1.5}}>Step-by-step instructions for 12 tricks — from Sit to Fetch. Available from Pro.</div>
                <span style={{background:"#7c3aed",color:"white",fontSize:12,fontWeight:700,padding:"4px 14px",borderRadius:20}}>Unlock with Pro</span>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {filteredTricks.map((t)=>{
                  const locked = TRICKS.indexOf(t) >= trickAccess;
                  return (
                    <div key={t.id} onClick={()=>locked?setShowUpgrade(true):setSelectedTrick(t)} style={{background:"white",borderRadius:16,padding:"12px 14px",border:`1px solid ${locked?"#e5e7eb":"#fde68a"}`,opacity:locked?0.5:1,position:"relative",cursor:locked?"pointer":"pointer"}}>
                      {locked&&<div style={{position:"absolute",top:8,right:10,fontSize:14}}>🔒</div>}
                      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                        <span style={{fontSize:26,flexShrink:0}}>{t.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                            <span style={{fontWeight:700,fontSize:15,color:"#1f2937"}}>{t.name}</span>
                            <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,background:TLC[t.level].bg,color:TLC[t.level].c}}>{t.level}</span>
                            <span style={{fontSize:11,color:"#9ca3af",marginLeft:"auto"}}>~{t.dur}</span>
                          </div>
                          <div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{t.desc}</div>
                          {!locked && <div style={{fontSize:12,color:"#d97706",fontWeight:600,marginTop:6}}>Tap for step-by-step instructions →</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── RECIPES ──
  function renderRecipes() {
    const filtered = RECIPES.filter(r=>{
      const sOk=recipeSeason==="All"||r.seasons.includes(recipeSeason);
      const gOk=goalFilters.length===0||r.goals.some(g=>goalFilters.includes(g));
      return sOk&&gOk;
    });
    function RecipeCard({ r }) {
      const matched = r.goals?.filter(g=>dog.goals?.includes(g))||[];
      return (
        <div onClick={()=>setSelectedRecipe(r)} style={{background:"white",borderRadius:16,padding:12,border:`1.5px solid ${matched.length?"#a78bfa":"#fde68a"}`,cursor:"pointer",flex:"1 1 45%",minWidth:140,position:"relative"}}>
          {matched.length>0&&<div style={{position:"absolute",top:8,right:8,background:"#7c3aed",color:"white",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:10}}>✓ Your Goal</div>}
          <div style={{fontSize:32,marginBottom:6}}>{r.emoji}</div>
          {r.isAi&&<div style={{fontSize:10,fontWeight:700,color:"#7c3aed",background:"#f5f3ff",borderRadius:6,padding:"2px 6px",display:"inline-block",marginBottom:4}}>AI RECIPE</div>}
          <div style={{fontWeight:700,fontSize:13,color:"#92400e",lineHeight:1.3,marginBottom:4}}>{r.name}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>{r.tags.slice(0,1).map(t=><Tag key={t} label={t} />)}</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>{r.time} · {r.diff}</div>
          <div style={{fontSize:12,color:"#9ca3af",marginTop:2,display:"flex",gap:4}}>{!isPro&&<span>🔒</span>}<span>{r.ingredients.length} ingredients</span></div>
        </div>
      );
    }
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:18,fontWeight:700,color:"#1f2937"}}>🍖 Recipes</div>
          {!isPro&&<button onClick={()=>setShowUpgrade(true)} style={{...S.btnPro,padding:"4px 12px",fontSize:12}}>✨ Pro</button>}
        </div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Season</div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
            {SEASONS_LIST.map(s2=>{const meta=s2==="All"?{icon:"🐾",color:"#78350f",bg:"#fef3c7"}:SEASON_META[s2];const active=recipeSeason===s2;return <button key={s2} onClick={()=>setRecipeSeason(s2)} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:20,border:`2px solid ${active?meta.color:"#e5e7eb"}`,background:active?meta.bg:"white",color:active?meta.color:"#6b7280",fontWeight:active?700:500,fontSize:12,cursor:"pointer"}}><span style={{fontSize:13}}>{meta.icon}</span>{s2}</button>;})}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.06em"}}>Health Goals</div>
            {goalFilters.length>0&&<button onClick={()=>setGoalFilters([])} style={{fontSize:11,color:"#9ca3af",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Clear</button>}
          </div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
            {HEALTH_GOALS.map(g=><button key={g.id} onClick={()=>setGoalFilters(f=>f.includes(g.id)?f.filter(x=>x!==g.id):[...f,g.id])} style={{flexShrink:0,display:"flex",alignItems:"center",gap:4,padding:"5px 11px",borderRadius:20,border:`2px solid ${goalFilters.includes(g.id)?GC[g.id]:"#e5e7eb"}`,background:goalFilters.includes(g.id)?GB[g.id]:"white",color:goalFilters.includes(g.id)?GC[g.id]:"#6b7280",fontWeight:goalFilters.includes(g.id)?700:500,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}><span style={{fontSize:13}}>{g.icon}</span>{g.label}</button>)}
          </div>
        </div>
        {dog.goals?.length>0&&goalFilters.length===0&&<div onClick={()=>setGoalFilters(dog.goals)} style={{background:"#f5f3ff",borderRadius:14,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10,cursor:"pointer",border:"1px solid #ddd6fe"}}><span style={{fontSize:22}}>🎯</span><div style={{flex:1}}><div style={{fontWeight:700,color:"#4c1d95",fontSize:13}}>Filter by your goals</div><div style={{fontSize:12,color:"#6d28d9"}}>Show recipes matching {dog.name||"your dog"}'s health goals</div></div><span style={{fontSize:13,color:"#7c3aed",fontWeight:700}}>Apply →</span></div>}
        {isPro?(
          <div style={{background:"linear-gradient(135deg,#7c3aed,#5b21b6)",borderRadius:18,padding:16,marginBottom:16,color:"white"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{fontSize:26}}>🤖</span><div><div style={{fontWeight:700,fontSize:15}}>AI Custom Recipe</div><div style={{fontSize:12,opacity:0.8}}>Personalised for {dog.name||"your dog"}{dog.goals?.length?` · ${dog.goals.length} goal${dog.goals.length>1?"s":""}`:""}</div></div></div>
            <button onClick={generateAiRecipe} disabled={recLoading} style={{width:"100%",background:"white",color:"#7c3aed",border:"none",borderRadius:12,padding:"10px",fontWeight:700,fontSize:14,cursor:"pointer"}}>{recLoading?"Creating recipe… 🍳":"✨ Generate a Recipe for Today"}</button>
            {aiRecipe&&!aiRecipe._err&&<div onClick={()=>setSelectedRecipe(aiRecipe)} style={{marginTop:12,background:"rgba(255,255,255,0.15)",borderRadius:14,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:28}}>{aiRecipe.emoji}</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{aiRecipe.name}</div><div style={{fontSize:12,opacity:0.8}}>{aiRecipe.time} · {aiRecipe.diff}</div></div><span style={{fontSize:18}}>→</span></div>}
          </div>
        ):(
          <div onClick={()=>setShowUpgrade(true)} style={{background:"#f5f3ff",borderRadius:18,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:"1px solid #ddd6fe"}}><span style={{fontSize:28}}>🤖</span><div style={{flex:1}}><div style={{fontWeight:700,color:"#4c1d95",fontSize:14}}>AI Custom Recipes</div><div style={{fontSize:12,color:"#6d28d9"}}>Targeting your specific health goals</div></div><span style={{background:"#7c3aed",color:"white",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20}}>PRO</span></div>
        )}
        <div style={{fontSize:12,color:"#9ca3af",marginBottom:10}}>{filtered.length} recipe{filtered.length!==1?"s":""} · {isPro?"Tap for full instructions":"🔒 Upgrade for instructions"}</div>
        {filtered.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:40,marginBottom:8}}>🍽️</div><div style={{color:"#9ca3af"}}>No recipes match these filters.</div><button onClick={()=>{setRecipeSeason("All");setGoalFilters([]);}} style={{color:"#d97706",background:"none",border:"none",cursor:"pointer",fontWeight:600,fontSize:13,marginTop:8}}>Clear filters</button></div>
          :<div style={{display:"flex",flexWrap:"wrap",gap:10}}>{filtered.map(r=><RecipeCard key={r.id} r={r} />)}</div>}
      </div>
    );
  }

  // ── HEALTH ──
  function renderHealth() {
    const HTABS = [{id:"journal",icon:"📓",label:"Journal"},{id:"weight",icon:"⚖️",label:"Weight"},{id:"portions",icon:"🧮",label:"Portions"},{id:"sos",icon:"🚨",label:"SOS Vet"},{id:"reminders",icon:"🔔",label:"Reminders"}];
    const moodEmoji = ["","😔","😐","🙂","😄","🤩"];
    const energyEmoji = ["","🔋","🐌","😌","⚡","🚀"];
    const pr = portionResult();
    return (
      <div>
        <div style={{fontSize:18,fontWeight:700,color:"#1f2937",marginBottom:12}}>🏥 Health</div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:16}}>
          {HTABS.map(t=><button key={t.id} onClick={()=>setHTab(t.id)} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:20,border:`2px solid ${hTab===t.id?"#f59e0b":"#e5e7eb"}`,background:hTab===t.id?"#fef3c7":"white",color:hTab===t.id?"#92400e":"#6b7280",fontWeight:hTab===t.id?700:500,fontSize:12,cursor:"pointer"}}><span>{t.icon}</span>{t.label}</button>)}
        </div>
        {hTab==="journal" && (
          <div>
            <div style={{...S.card,marginBottom:14}}>
              <div style={{fontWeight:700,color:"#1f2937",fontSize:14,marginBottom:12}}>📓 Today's Entry</div>
              <div style={{marginBottom:10}}><div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>Mood</div><div style={{display:"flex",gap:8}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setNewJournal(j=>({...j,mood:n}))} style={{fontSize:24,cursor:"pointer",background:"none",border:"none",opacity:newJournal.mood===n?1:0.35}}>{moodEmoji[n]}</button>)}</div></div>
              <div style={{marginBottom:10}}><div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>Energy</div><div style={{display:"flex",gap:8}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setNewJournal(j=>({...j,energy:n}))} style={{fontSize:24,cursor:"pointer",background:"none",border:"none",opacity:newJournal.energy===n?1:0.35}}>{energyEmoji[n]}</button>)}</div></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <div><div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>Appetite</div><div style={{display:"flex",gap:6}}>{[["good","😋"],["moderate","🍽️"],["poor","😑"]].map(([v,ic])=><button key={v} onClick={()=>setNewJournal(j=>({...j,appetite:v}))} style={{padding:"6px 8px",borderRadius:12,border:`2px solid ${newJournal.appetite===v?"#f59e0b":"#e5e7eb"}`,background:newJournal.appetite===v?"#fef3c7":"white",cursor:"pointer",fontSize:16}}>{ic}</button>)}</div></div>
                <div><div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>Poop</div><div style={{display:"flex",gap:6}}>{[["normal","✅"],["soft","⚠️"],["none","❌"]].map(([v,ic])=><button key={v} onClick={()=>setNewJournal(j=>({...j,poop:v}))} style={{padding:"6px 8px",borderRadius:12,border:`2px solid ${newJournal.poop===v?"#f59e0b":"#e5e7eb"}`,background:newJournal.poop===v?"#fef3c7":"white",cursor:"pointer",fontSize:16}}>{ic}</button>)}</div></div>
              </div>
              <input value={newJournal.notes} onChange={e=>setNewJournal(j=>({...j,notes:e.target.value}))} placeholder="Notes (optional)…" style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:10}} />
              <button onClick={()=>{updateDog(d=>({journal:[{...newJournal,date:new Date().toLocaleDateString("en",{month:"short",day:"numeric"})},...(d.journal||[])]}));setNewJournal({mood:3,energy:3,appetite:"good",poop:"normal",notes:""});}} style={{...S.btn,padding:"12px",fontSize:14,marginTop:0}}>Save Entry ✓</button>
            </div>
            <div style={{fontWeight:700,color:"#1f2937",fontSize:14,marginBottom:8}}>Recent Entries {!isPro&&<span style={{fontSize:11,color:"#9ca3af",fontWeight:400}}>(Pro: full history)</span>}</div>
            {(isPro?journal:journal.slice(0,3)).map((e,i)=>(
              <div key={i} style={{...S.card,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontWeight:600,color:"#374151",fontSize:13}}>{e.date}</span><div style={{display:"flex",gap:6}}><span>{moodEmoji[e.mood]}</span><span>{energyEmoji[e.energy]}</span></div></div>
                <div style={{display:"flex",gap:10,fontSize:12,color:"#9ca3af"}}><span>Appetite: {e.appetite}</span><span>Poop: {e.poop}</span></div>
                {e.notes&&<div style={{fontSize:13,color:"#374151",marginTop:4,fontStyle:"italic"}}>"{e.notes}"</div>}
              </div>
            ))}
            {!isPro&&journal.length>3&&<div onClick={()=>setShowUpgrade(true)} style={{...S.card,display:"flex",alignItems:"center",gap:10,cursor:"pointer",background:"#f5f3ff",borderColor:"#ddd6fe"}}><span style={{fontSize:22}}>📊</span><div style={{flex:1}}><div style={{fontWeight:700,color:"#4c1d95",fontSize:13}}>Full History & Trends</div><div style={{fontSize:12,color:"#6d28d9"}}>{journal.length-3} more entries with Pro</div></div><span style={{background:"#7c3aed",color:"white",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20,flexShrink:0}}>PRO</span></div>}
            {isPro&&<button onClick={()=>{setPdfToast(true);setTimeout(()=>setPdfToast(false),3000);}} style={{...S.btnO,marginTop:4,fontSize:13}}>📄 Export PDF for Vet Visit</button>}
          </div>
        )}
        {hTab==="weight" && (
          <div>
            {!isPro?(
              <div onClick={()=>setShowUpgrade(true)} style={{...S.card,display:"flex",flexDirection:"column",alignItems:"center",gap:12,cursor:"pointer",padding:24,background:"#f5f3ff",borderColor:"#ddd6fe",textAlign:"center"}}><span style={{fontSize:42}}>⚖️</span><div style={{fontWeight:700,color:"#4c1d95",fontSize:16}}>Weight Tracker</div><div style={{fontSize:13,color:"#6d28d9"}}>Track your dog's weight over time and spot trends before they become problems.</div><span style={{background:"#7c3aed",color:"white",fontSize:12,fontWeight:700,padding:"4px 14px",borderRadius:20}}>Unlock with Pro</span></div>
            ):(
              <div style={{...S.card,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div><div style={{fontSize:11,color:"#9ca3af",marginBottom:2}}>Current Weight</div><div style={{fontSize:26,fontWeight:700,color:"#92400e"}}>{weights.length?weights[weights.length-1].w+" kg":"—"}</div></div>
                  {weights.length>=2&&(()=>{const diff=weights[weights.length-1].w-weights[weights.length-2].w;return <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#9ca3af",marginBottom:2}}>Last change</div><div style={{fontSize:16,fontWeight:700,color:diff<0?"#059669":diff>0?"#dc2626":"#9ca3af"}}>{diff>0?"+":""}{diff.toFixed(1)} kg</div></div>;})()}
                </div>
                {weights.length>1&&<div style={{height:160,marginBottom:8}}><ResponsiveContainer width="100%" height="100%"><LineChart data={weights}><XAxis dataKey="date" tick={{fontSize:10}} /><YAxis domain={["auto","auto"]} tick={{fontSize:10}} width={35} /><Tooltip /><Line type="monotone" dataKey="w" stroke="#f59e0b" strokeWidth={2} dot={{r:3,fill:"#f59e0b"}} /></LineChart></ResponsiveContainer></div>}
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <input value={newWeight} onChange={e=>setNewWeight(e.target.value)} placeholder="Add weight (kg)" type="number" step="0.1" style={{...S.input}} />
                  <button onClick={()=>{if(!newWeight)return;updateDog(d=>({weights:[...(d.weights||[]),{date:new Date().toLocaleDateString("en",{month:"short",day:"numeric"}),w:parseFloat(newWeight)}]}));setNewWeight("");}} style={{background:"#f59e0b",color:"white",border:"none",borderRadius:12,padding:"10px 16px",fontWeight:700,fontSize:16,cursor:"pointer"}}>+</button>
                </div>
              </div>
            )}
          </div>
        )}
        {hTab==="portions" && (
          <div>
            <div style={{...S.card}}>
              <div style={{fontWeight:700,color:"#1f2937",fontSize:14,marginBottom:12}}>🧮 Portion Calculator</div>
              <div style={{marginBottom:10}}><div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>Dog's Weight (kg)</div><input value={portW} onChange={e=>setPortW(e.target.value)} placeholder="e.g. 28" type="number" step="0.5" style={{...S.input,width:"100%",boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:10}}><div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>Activity Level</div><div style={{display:"flex",gap:8}}>{[["low","🐌 Low"],["moderate","🐕 Moderate"],["high","🚀 High"]].map(([v,l])=><button key={v} onClick={()=>setPortAct(v)} style={{flex:1,padding:"8px 4px",borderRadius:12,border:`2px solid ${portAct===v?"#f59e0b":"#e5e7eb"}`,background:portAct===v?"#fef3c7":"white",cursor:"pointer",fontSize:12,fontWeight:portAct===v?700:400,color:portAct===v?"#92400e":"#374151"}}>{l}</button>)}</div></div>
              <div style={{marginBottom:14}}><div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>Food Type</div><div style={{display:"flex",gap:8}}>{[["dry","🥣 Dry"],["wet","🥘 Wet"],["raw","🥩 Raw"]].map(([v,l])=><button key={v} onClick={()=>setPortFood(v)} style={{flex:1,padding:"8px 4px",borderRadius:12,border:`2px solid ${portFood===v?"#f59e0b":"#e5e7eb"}`,background:portFood===v?"#fef3c7":"white",cursor:"pointer",fontSize:12,fontWeight:portFood===v?700:400,color:portFood===v?"#92400e":"#374151"}}>{l}</button>)}</div></div>
              {pr&&(
                <div style={{background:"#fffbeb",borderRadius:14,padding:"14px 16px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#d97706",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Daily Recommendation</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div style={{background:"white",borderRadius:12,padding:"10px 12px"}}><div style={{fontSize:11,color:"#9ca3af"}}>Cups / day</div><div style={{fontSize:22,fontWeight:700,color:"#92400e"}}>{pr.cups}</div></div>
                    <div style={{background:"white",borderRadius:12,padding:"10px 12px"}}><div style={{fontSize:11,color:"#9ca3af"}}>kcal / day</div><div style={{fontSize:22,fontWeight:700,color:"#92400e"}}>{pr.kcalDay}</div></div>
                    {isProPlus&&pr.grams&&<div style={{background:"white",borderRadius:12,padding:"10px 12px",gridColumn:"1/-1"}}><div style={{fontSize:11,color:"#9ca3af"}}>Grams / day ({portFood} food)</div><div style={{fontSize:22,fontWeight:700,color:"#7c3aed"}}>{pr.grams} g</div></div>}
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af",marginTop:8}}>⚠️ Estimates only. Consult your vet for precise guidance.</div>
                </div>
              )}
            </div>
            {!isProPlus&&<div onClick={()=>setShowUpgrade(true)} style={{...S.card,display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginTop:0,background:"#f5f3ff",borderColor:"#ddd6fe"}}><span style={{fontSize:26}}>🎯</span><div style={{flex:1}}><div style={{fontWeight:700,color:"#4c1d95",fontSize:13}}>Advanced Calculator</div><div style={{fontSize:12,color:"#6d28d9"}}>Precise grams + kcal by food type — Pro+</div></div><span style={{background:"#7c3aed",color:"white",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20,flexShrink:0}}>PRO+</span></div>}
          </div>
        )}
        {hTab==="sos" && (
          <div>
            <div style={{background:"#fee2e2",borderRadius:14,padding:"10px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:22,flexShrink:0}}>🚨</span><div style={{fontSize:13,color:"#7f1d1d",lineHeight:1.5}}><strong>Guide only, not a diagnosis.</strong> When in doubt, always call your vet. Always free to use.</div></div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {SOS.map((item,i)=>(
                <div key={i} style={{background:"white",borderRadius:16,border:"1px solid #fde68a",overflow:"hidden"}}>
                  <button onClick={()=>setSosOpen(sosOpen===i?null:i)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                    <span style={{fontSize:26}}>{item.icon}</span><div style={{fontWeight:700,color:"#1f2937",fontSize:14,flex:1}}>{item.symptom}</div><span style={{color:"#9ca3af",fontSize:16,transform:sosOpen===i?"rotate(180deg)":"none",display:"inline-block"}}>▾</span>
                  </button>
                  {sosOpen===i&&<div style={{padding:"0 16px 14px",borderTop:"1px solid #fef3c7"}}>{item.cases.map((c,j)=>(
                    <div key={j} style={{marginTop:10,background:c.bg,borderRadius:14,padding:"10px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:12,fontWeight:700,color:"white",background:c.vc,padding:"2px 10px",borderRadius:20,flexShrink:0}}>{c.verdict}</span><span style={{fontSize:12,color:"#374151"}}>{c.label}</span></div>
                      <div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{c.advice}</div>
                    </div>
                  ))}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        {hTab==="reminders" && (
          <div>
            <div style={{...S.card,marginBottom:14}}>
              <div style={{fontWeight:600,color:"#374151",fontSize:14,marginBottom:8}}>Add a Reminder</div>
              <div style={{display:"flex",gap:8}}>
                <input value={newRem} onChange={e=>setNewRem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&newRem.trim()&&(setReminders(r=>[...r,{id:Date.now(),label:newRem.trim(),icon:"🔔",freq:"Custom",date:"Upcoming",on:true}]),setNewRem(""))} placeholder="e.g. Probiotic supplement" style={S.input} />
                <button style={{background:"#f59e0b",color:"white",border:"none",borderRadius:12,padding:"10px 16px",fontWeight:700,fontSize:18,cursor:"pointer"}} onClick={()=>{if(!newRem.trim())return;setReminders(r=>[...r,{id:Date.now(),label:newRem.trim(),icon:"🔔",freq:"Custom",date:"Upcoming",on:true}]);setNewRem("");}}>+</button>
              </div>
            </div>
            <div style={{background:"white",borderRadius:16,overflow:"hidden",border:"1px solid #fde68a"}}>
              {reminders.map((r,i)=>(
                <div key={r.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<reminders.length-1?"1px solid #fef3c7":"none"}}>
                  <span style={{fontSize:20}}>{r.icon}</span>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:r.on?"#1f2937":"#9ca3af"}}>{r.label}</div><div style={{fontSize:12,color:"#9ca3af"}}>{r.freq} · {r.date}</div></div>
                  <Toggle on={r.on} onChange={()=>setReminders(rs=>rs.map(x=>x.id===r.id?{...x,on:!x.on}:x))} />
                </div>
              ))}
            </div>
            {!isPro&&<div onClick={()=>setShowUpgrade(true)} style={{...S.card,display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginTop:12,background:"#f5f3ff",borderColor:"#ddd6fe"}}><span style={{fontSize:26}}>📅</span><div style={{flex:1}}><div style={{fontWeight:700,color:"#4c1d95",fontSize:14}}>Custom Scheduling</div><div style={{fontSize:12,color:"#6d28d9"}}>Recurring alerts, vet dates & more</div></div><span style={{background:"#7c3aed",color:"white",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20,flexShrink:0}}>PRO</span></div>}
          </div>
        )}
      </div>
    );
  }

  // ── PROFILE ──
  function renderProfile() {
    const szMeta = DOG_SIZES.find(sz=>sz.id===dog.size);
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:18,fontWeight:700,color:"#1f2937"}}>🐶 Profile</div>
          {isProPlus&&dogs.length>1&&<button onClick={()=>setShowAddDog(true)} style={{...S.btnPro,padding:"5px 12px",fontSize:12}}>+ Add Dog</button>}
        </div>
        {isProPlus&&dogs.length>1&&(
          <div style={{display:"flex",gap:10,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
            {dogs.map((d,i)=>(
              <button key={i} onClick={()=>setDogIdx(i)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"10px 12px",borderRadius:16,border:`2px solid ${dogIdx===i?"#f59e0b":"#e5e7eb"}`,background:dogIdx===i?"#fef3c7":"white",cursor:"pointer",flexShrink:0}}>
                {d.photo?<img src={d.photo} alt={d.name} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover"}} />:<div style={{width:44,height:44,borderRadius:"50%",background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🐕</div>}
                <span style={{fontSize:12,fontWeight:dogIdx===i?700:400,color:dogIdx===i?"#92400e":"#374151"}}>{d.name||"Dog"}</span>
              </button>
            ))}
            <button onClick={()=>setShowAddDog(true)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"10px 12px",borderRadius:16,border:"2px dashed #d1d5db",background:"white",cursor:"pointer",flexShrink:0,minWidth:70}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>+</div>
              <span style={{fontSize:12,color:"#9ca3af"}}>Add</span>
            </button>
          </div>
        )}
        <div style={{...S.card,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <div style={{position:"relative"}}>
              {dog.photo?<img src={dog.photo} alt={dog.name} style={{width:70,height:70,borderRadius:18,objectFit:"cover",border:"3px solid #fde68a"}} />:<div style={{width:70,height:70,borderRadius:18,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38}}>🐕</div>}
              <button onClick={()=>editPhotoRef.current.click()} style={{position:"absolute",bottom:-4,right:-4,width:24,height:24,borderRadius:"50%",background:"#f59e0b",border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,cursor:"pointer",lineHeight:1}}>📷</button>
              <input ref={editPhotoRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>updateDog(()=>({photo:ev.target.result}));r.readAsDataURL(f);}} style={{display:"none"}} />
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:20,fontWeight:700,color:"#92400e"}}>{dog.name||"Your Dog"}</div>
              <div style={{fontSize:13,color:"#9ca3af"}}>{dog.breed||"Breed not set"}</div>
              {szMeta&&<div style={{fontSize:12,color:"#d97706",marginTop:2}}>{szMeta.icon} {szMeta.label} · {szMeta.sub}</div>}
            </div>
            <button onClick={()=>setEditDog({...dog})} style={{color:"#d97706",background:"none",border:"none",cursor:"pointer",fontWeight:600,fontSize:14}}>Edit</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[["Age",dog.age||"Not set"],["Weight",dog.weight||"Not set"],["Allergies",dog.allergies||"None"],["Season",`${sm.icon} ${season}`]].map(([l,v])=>(
              <div key={l} style={{background:"#fffbeb",borderRadius:12,padding:"10px 12px"}}><div style={{fontSize:11,color:"#9ca3af",marginBottom:2}}>{l}</div><div style={{fontSize:13,fontWeight:700,color:"#92400e"}}>{v}</div></div>
            ))}
          </div>
          {dog.goals?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{dog.goals.map(g=>{const gl=HEALTH_GOALS.find(x=>x.id===g);return gl?<span key={g} style={{background:GB[g],color:GC[g],fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20}}>{gl.icon} {gl.label}</span>:null;})}</div>}
        </div>
        <div style={{borderRadius:18,padding:16,marginBottom:12,background:plan==="pro_plus"?"linear-gradient(135deg,#6d28d9,#4c1d95)":isPro?"linear-gradient(135deg,#f59e0b,#d97706)":"white",border:isPro?"none":"1px solid #fde68a"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:700,color:isPro?"white":"#1f2937",fontSize:16}}>{plan==="free"?"Free Plan":plan==="pro"?"⭐ Pro Plan":"💎 Pro+ Plan"}</div><div style={{fontSize:13,color:isPro?"rgba(255,255,255,0.75)":"#9ca3af"}}>{plan==="free"?"5 activities · basic tips":plan==="pro"?"$9.99/mo · All Pro features":"$14.99/mo · Everything unlocked"}</div></div>
            {isPro?<span style={{background:"rgba(255,255,255,0.2)",color:"white",fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:20}}>Active</span>:<button onClick={()=>setShowUpgrade(true)} style={{...S.btn,width:"auto",padding:"8px 14px",fontSize:13,marginTop:0}}>Upgrade</button>}
          </div>
          {isPro&&<div style={{display:"flex",gap:8,marginTop:10}}><button onClick={()=>setShowUpgrade(true)} style={{background:"rgba(255,255,255,0.2)",color:"white",border:"none",borderRadius:12,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{plan==="pro"?"→ Upgrade to Pro+":"Manage Plan"}</button><button onClick={()=>setPlan("free")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Switch to Free</button></div>}
        </div>
        {!isProPlus&&<div onClick={()=>setShowUpgrade(true)} style={{...S.card,display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginTop:0,background:"#f5f3ff",borderColor:"#ddd6fe"}}><span style={{fontSize:26}}>🐕</span><div style={{flex:1}}><div style={{fontWeight:700,color:"#4c1d95",fontSize:14}}>Multi-Dog Profiles</div><div style={{fontSize:12,color:"#6d28d9"}}>Manage unlimited dogs, each with their own data — Pro+</div></div><span style={{background:"#7c3aed",color:"white",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20,flexShrink:0}}>PRO+</span></div>}
        <button onClick={()=>{setOnboarded(false);setDogs([]);setDogIdx(0);setPlan("free");setGoalFilters([]);}} style={{...S.btnO,marginTop:8,color:"#9ca3af",borderColor:"#e5e7eb",fontSize:13}}>Re-run Onboarding (demo)</button>
      </div>
    );
  }

  // ── MODALS ──
  function UpgradeModal() {
    const [annual, setAnnual] = useState(false);
    const FREE_FEATURES = ["5 activity profiles","2 AI suggestions/category","Recipe cards (ingredients visible)","Daily journal entry","Basic portion calculator","SOS Vet guide","Simple reminders"];
    const TIERS = [
      { id:"pro", label:"Pro", badge:"⭐", color:"#f59e0b", bg:"#fef3c7", headline:"For dedicated dog parents",
        price:annual?"59.99":"9.99", period:annual?"/year":"/month", save:annual?"Save $20/yr":null,
        features:["All 10+ activity profiles","4x AI suggestions per category","Full recipe cooking instructions","AI Recipe Generator (goal-aware)","Weight tracker with graphs","Full journal history + PDF export","Custom reminder scheduling","6 training tricks (beginner + intermediate)","Advanced portion calculator"] },
      { id:"pro_plus", label:"Pro+", badge:"💎", color:"#7c3aed", bg:"#f5f3ff", recommended:true, headline:"For multi-dog households & power users",
        price:annual?"89.99":"14.99", period:annual?"/year":"/month", save:annual?"Save $30/yr":null,
        features:["Everything in Pro","Multi-dog profiles (unlimited)","Full training library (all 12 tricks)","Precision portions (grams + kcal by food)","Community recipes","Breed-specific health insights","Priority AI responses"] },
    ];
    return (
      <div style={S.overlay} onClick={()=>setShowUpgrade(false)}>
        <div style={S.modal} onClick={e=>e.stopPropagation()}>
          <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:34,marginBottom:6}}>🐾</div><div style={{fontSize:21,fontWeight:700,color:"#1f2937"}}>Upgrade PawDay</div><div style={{fontSize:13,color:"#9ca3af",marginTop:4}}>7-day free trial · Cancel anytime</div></div>
          {plan==="free"&&(
            <div style={{background:"#f9fafb",borderRadius:14,padding:"10px 14px",marginBottom:14,border:"1px solid #e5e7eb"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>You currently have (Free)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{FREE_FEATURES.map(f=><span key={f} style={{fontSize:11,color:"#6b7280",background:"white",padding:"3px 8px",borderRadius:10,border:"1px solid #e5e7eb"}}>✓ {f}</span>)}</div>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:14}}>
            <span style={{fontSize:13,color:annual?"#9ca3af":"#1f2937",fontWeight:annual?400:600}}>Monthly</span>
            <Toggle on={annual} onChange={()=>setAnnual(a=>!a)} />
            <span style={{fontSize:13,color:annual?"#1f2937":"#9ca3af",fontWeight:annual?600:400}}>Annual <span style={{color:"#059669",fontWeight:700}}>–17%</span></span>
          </div>
          {TIERS.map(t=>(
            <div key={t.id} style={{position:"relative",border:`2px solid ${t.recommended?t.color:"#e5e7eb"}`,borderRadius:18,padding:16,marginBottom:12,background:t.recommended?t.bg:"white"}}>
              {t.recommended&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:t.color,color:"white",fontSize:11,fontWeight:700,padding:"2px 14px",borderRadius:20,whiteSpace:"nowrap"}}>MOST POPULAR</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div><div style={{fontSize:17,fontWeight:700,color:t.color}}>{t.badge} {t.label}</div><div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>{t.headline}</div>{t.save&&<div style={{fontSize:11,color:"#059669",fontWeight:600,marginTop:2}}>{t.save}</div>}</div>
                <div style={{textAlign:"right"}}><div><span style={{fontSize:24,fontWeight:700,color:"#1f2937"}}>${t.price}</span><span style={{fontSize:12,color:"#9ca3af"}}>{t.period}</span></div>{!annual&&<div style={{fontSize:11,color:"#9ca3af"}}>or ${t.id==="pro"?"59.99":"89.99"}/yr</div>}</div>
              </div>
              <div style={{height:1,background:`${t.color}30`,margin:"10px 0"}} />
              {t.features.map((f,i)=><div key={i} style={{display:"flex",gap:8,paddingBottom:5,alignItems:"flex-start"}}><span style={{color:t.color,fontWeight:700,fontSize:13,flexShrink:0}}>✓</span><span style={{fontSize:13,color:"#374151"}}>{f}</span></div>)}
              <button onClick={()=>{setPlan(t.id);setShowUpgrade(false);}} style={{width:"100%",background:plan===t.id?"#e5e7eb":t.color,color:plan===t.id?"#9ca3af":"white",border:"none",borderRadius:12,padding:"12px",fontWeight:700,fontSize:15,cursor:plan===t.id?"not-allowed":"pointer",marginTop:12}}>{plan===t.id?"Current Plan ✓":"Start Free Trial →"}</button>
            </div>
          ))}
          <button onClick={()=>setShowUpgrade(false)} style={{background:"none",border:"none",color:"#9ca3af",width:"100%",padding:10,cursor:"pointer",fontSize:13}}>Maybe later</button>
        </div>
      </div>
    );
  }

  function TrickModal() {
    const t = selectedTrick;
    const lc = TLC[t.level];
    return (
      <div style={S.overlay} onClick={()=>setSelectedTrick(null)}>
        <div style={S.modal} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
            <span style={{fontSize:48}}>{t.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:22,fontWeight:700,color:"#1f2937"}}>{t.name}</div>
              <div style={{display:"flex",gap:8,marginTop:6,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,background:lc.bg,color:lc.c}}>{t.level}</span>
                <span style={{fontSize:12,color:"#9ca3af"}}>~{t.dur}</span>
              </div>
            </div>
            <button onClick={()=>setSelectedTrick(null)} style={{background:"none",border:"none",fontSize:22,color:"#9ca3af",cursor:"pointer",padding:0,flexShrink:0}}>✕</button>
          </div>
          <div style={{background:"#fffbeb",borderRadius:14,padding:"12px 14px",marginBottom:16,fontSize:14,color:"#78350f",lineHeight:1.6,fontStyle:"italic"}}>"{t.desc}"</div>
          <div style={{fontWeight:700,color:"#1f2937",fontSize:15,marginBottom:12}}>📋 How to teach it</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {t.steps.map((step,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:lc.bg,color:lc.c,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                <div style={{fontSize:14,color:"#374151",lineHeight:1.65,paddingTop:4}}>{step}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#f0fdf4",borderRadius:14,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:18,flexShrink:0}}>💡</span>
            <div style={{fontSize:13,color:"#166534",lineHeight:1.5}}>Keep sessions to <strong>5 minutes max</strong>. Always end on a success. Patience and consistency beat speed every time.</div>
          </div>
        </div>
      </div>
    );
  }

  function RecipeModal() {
    const r = selectedRecipe;
    const matched = r.goals?.filter(g=>dog.goals?.includes(g))||[];
    return (
      <div style={S.overlay} onClick={()=>setSelectedRecipe(null)}>
        <div style={S.modal} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:14}}>
            <span style={{fontSize:42}}>{r.emoji}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:19,fontWeight:700,color:"#92400e"}}>{r.name}</div>
              <div style={{fontSize:13,color:"#9ca3af"}}>{r.time} · {r.diff}</div>
              {r.seasons&&<div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>{r.seasons.map(s2=><span key={s2} style={{fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:20,background:SEASON_META[s2]?.bg||"#f3f4f6",color:SEASON_META[s2]?.color||"#374151"}}>{SEASON_META[s2]?.icon} {s2}</span>)}</div>}
            </div>
            <button onClick={()=>setSelectedRecipe(null)} style={{background:"none",border:"none",fontSize:22,color:"#9ca3af",cursor:"pointer",padding:0}}>✕</button>
          </div>
          {r.isAi&&<div style={{background:"#f5f3ff",borderRadius:12,padding:"8px 12px",marginBottom:12,display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:16}}>🤖</span><span style={{fontSize:13,color:"#6d28d9",fontWeight:500}}>AI-generated for {dog.name||"your dog"} today</span></div>}
          {matched.length>0&&<div style={{background:"#f5f3ff",borderRadius:12,padding:"8px 12px",marginBottom:12}}><div style={{fontSize:11,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Matches Your Goals</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{matched.map(g=>{const gl=HEALTH_GOALS.find(x=>x.id===g);return gl?<span key={g} style={{background:GB[g],color:GC[g],fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:20}}>{gl.icon} {gl.label}</span>:null;})}</div></div>}
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>{(r.tags||[]).map(t=><Tag key={t} label={t} />)}</div>
          <div style={{background:"#f0fdf4",borderRadius:14,padding:"10px 14px",marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Health Benefit</div><div style={{fontSize:13,color:"#166534"}}>{r.benefit}</div></div>
          <div style={{marginBottom:14}}>
            <div style={{fontWeight:700,color:"#1f2937",fontSize:14,marginBottom:8}}>🛒 Ingredients</div>
            {r.ingredients.map((ing,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,paddingBottom:6}}><div style={{width:7,height:7,borderRadius:"50%",background:"#f59e0b",flexShrink:0}} /><span style={{fontSize:13,color:"#374151"}}>{ing}</span></div>)}
            {r.note&&<div style={{fontSize:12,color:"#dc2626",marginTop:6}}>{r.note}</div>}
          </div>
          {isPro?(
            <div><div style={{fontWeight:700,color:"#1f2937",fontSize:14,marginBottom:8}}>👩‍🍳 Instructions</div><div style={{background:"#fffbeb",borderRadius:14,padding:"12px 14px"}}>{r.instructions.split("\n").map((s2,i)=><div key={i} style={{fontSize:13,color:"#374151",lineHeight:1.6,paddingBottom:6}}>{s2}</div>)}</div></div>
          ):(
            <div style={{position:"relative"}}>
              <div style={{filter:"blur(3px)",pointerEvents:"none",userSelect:"none"}}><div style={{fontWeight:700,color:"#1f2937",fontSize:14,marginBottom:8}}>👩‍🍳 Instructions</div><div style={{background:"#fffbeb",borderRadius:14,padding:"12px 14px"}}><div style={{fontSize:13,color:"#374151",paddingBottom:6}}>1. Preheat oven to 350°F and prepare a lined baking sheet.</div><div style={{fontSize:13,color:"#374151",paddingBottom:6}}>2. Combine all ingredients in a large mixing bowl.</div><div style={{fontSize:13,color:"#374151"}}>3. Form shapes and arrange on sheet...</div></div></div>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:"white",borderRadius:18,padding:"16px 20px",textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.12)",width:"80%"}}><div style={{fontSize:28,marginBottom:6}}>🔒</div><div style={{fontWeight:700,color:"#1f2937",fontSize:14,marginBottom:4}}>Instructions are Pro-only</div><div style={{fontSize:12,color:"#9ca3af",marginBottom:10}}>Upgrade to unlock full cooking steps</div><button onClick={()=>{setSelectedRecipe(null);setShowUpgrade(true);}} style={{...S.btn,padding:"10px 20px",fontSize:13,marginTop:0}}>Upgrade to Pro</button></div></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function ProfileEditModal() {
    const [ld, setLd] = useState({...editDog});
    const toggleG = id => setLd(d=>({...d,goals:d.goals?.includes(id)?d.goals.filter(x=>x!==id):[...(d.goals||[]),id]}));
    return (
      <div style={S.overlay} onClick={()=>setEditDog(null)}>
        <div style={S.modal} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontSize:18,fontWeight:700,color:"#1f2937"}}>Edit Profile</div><button onClick={()=>setEditDog(null)} style={{background:"none",border:"none",fontSize:22,color:"#9ca3af",cursor:"pointer",padding:0}}>✕</button></div>
          {[["name","Dog's Name","Buddy"],["breed","Breed","Labrador Retriever"],["age","Age","Puppy / Young / Adult / Senior"],["weight","Weight","30 kg"],["allergies","Allergies / Notes","e.g. chicken, dairy"]].map(([k,lbl,ph])=>(
            <div key={k} style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{lbl}</div><input value={ld[k]||""} onChange={e=>setLd(d=>({...d,[k]:e.target.value}))} placeholder={ph} style={{...S.input,width:"100%",boxSizing:"border-box"}} /></div>
          ))}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Size</div>
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>{DOG_SIZES.map(sz=><button key={sz.id} onClick={()=>setLd(d=>({...d,size:sz.id}))} style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 12px",borderRadius:14,border:`2px solid ${ld.size===sz.id?"#f59e0b":"#e5e7eb"}`,background:ld.size===sz.id?"#fef3c7":"white",cursor:"pointer"}}><span style={{fontSize:22}}>{sz.icon}</span><span style={{fontSize:11,fontWeight:600,color:ld.size===sz.id?"#92400e":"#374151"}}>{sz.label}</span></button>)}</div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Health Goals</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {HEALTH_GOALS.map(g=>{const active=ld.goals?.includes(g.id);return(
                <button key={g.id} onClick={()=>toggleG(g.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:14,border:`2px solid ${active?GC[g.id]:"#e5e7eb"}`,background:active?GB[g.id]:"white",cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:20}}>{g.icon}</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:active?GC[g.id]:"#1f2937"}}>{g.label}</div><div style={{fontSize:11,color:"#9ca3af"}}>{g.desc}</div></div>
                  <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${active?GC[g.id]:"#d1d5db"}`,background:active?GC[g.id]:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{active&&<span style={{color:"white",fontSize:11,fontWeight:700}}>✓</span>}</div>
                </button>
              );})}
            </div>
          </div>
          <button onClick={()=>{updateDog(()=>({...ld}));setGoalFilters(ld.goals||[]);setEditDog(null);}} style={{...S.btn,marginTop:4}}>Save Profile</button>
        </div>
      </div>
    );
  }

  function AddDogModal() {
    const [form, setForm] = useState({name:"",photo:null,breed:"",size:"",age:""});
    const pRef = useRef();
    return (
      <div style={S.overlay} onClick={()=>setShowAddDog(false)}>
        <div style={S.modal} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontSize:18,fontWeight:700,color:"#1f2937"}}>Add Another Dog 🐕</div><button onClick={()=>setShowAddDog(false)} style={{background:"none",border:"none",fontSize:22,color:"#9ca3af",cursor:"pointer",padding:0}}>✕</button></div>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div onClick={()=>pRef.current.click()} style={{width:70,height:70,borderRadius:18,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0}}>
              {form.photo?<img src={form.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />:<span style={{fontSize:36}}>📷</span>}
            </div>
            <input ref={pRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setForm(f2=>({...f2,photo:ev.target.result}));r.readAsDataURL(f);}} style={{display:"none"}} />
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Dog's name" style={{...S.input}} />
          </div>
          <div style={{marginBottom:10}}><div style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",marginBottom:4}}>Breed</div><input value={form.breed||""} onChange={e=>setForm(f=>({...f,breed:e.target.value}))} placeholder="e.g. Golden Retriever" style={{...S.input,width:"100%",boxSizing:"border-box"}} /></div>
          <div style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",marginBottom:8}}>Size</div><div style={{display:"flex",gap:8,overflowX:"auto"}}>{DOG_SIZES.map(sz=><button key={sz.id} onClick={()=>setForm(f=>({...f,size:sz.id}))} style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 10px",borderRadius:14,border:`2px solid ${form.size===sz.id?"#f59e0b":"#e5e7eb"}`,background:form.size===sz.id?"#fef3c7":"white",cursor:"pointer"}}><span style={{fontSize:22}}>{sz.icon}</span><span style={{fontSize:11,color:form.size===sz.id?"#92400e":"#374151",fontWeight:form.size===sz.id?700:400}}>{sz.label}</span></button>)}</div></div>
          <div style={{marginBottom:16}}><div style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",marginBottom:8}}>Age</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{[["Puppy","🐣"],["Young","🐕"],["Adult","🐩"],["Senior","🦮"]].map(([lbl,ic])=><button key={lbl} onClick={()=>setForm(f=>({...f,age:lbl}))} style={{padding:"10px 4px",borderRadius:14,border:`2px solid ${form.age===lbl?"#f59e0b":"#e5e7eb"}`,background:form.age===lbl?"#fef3c7":"white",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><span style={{fontSize:22}}>{ic}</span><span style={{fontSize:11,fontWeight:700,color:form.age===lbl?"#92400e":"#374151"}}>{lbl}</span></button>)}</div></div>
          <button onClick={()=>{if(!form.name.trim())return;setDogs(ds=>[...ds,{...form,goals:[],weight:"",allergies:"",journal:[],weights:[]}]);setDogIdx(dogs.length);setShowAddDog(false);}} disabled={!form.name.trim()} style={{...S.btn,marginTop:0,opacity:form.name.trim()?1:0.4}}>Add {form.name||"Dog"} 🐾</button>
        </div>
      </div>
    );
  }

  if (!onboarded) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div style={S.app}>
      {pdfToast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#1f2937",color:"white",padding:"10px 20px",borderRadius:20,fontSize:13,fontWeight:600,zIndex:60,whiteSpace:"nowrap"}}>📄 PDF ready! (demo)</div>}
      <div style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {dog.photo?<img src={dog.photo} alt={dog.name} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2.5px solid white",flexShrink:0}} />:<div style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🐕</div>}
          <div>
            <div style={{color:"white",fontSize:21,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>🐾 PawDay {plan!=="free"&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,background:plan==="pro_plus"?"#4c1d95":"rgba(0,0,0,0.2)",color:"white"}}>{plan==="pro_plus"?"PRO+":"PRO"}</span>}</div>
            <div style={{color:"rgba(255,255,255,0.85)",fontSize:12,marginTop:2}}>Hi, {dog.name||"friend"} & family! 👋</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:30}}>{wx.icon}</div>
          <div style={{color:"white",fontSize:20,fontWeight:700}}>{wx.temp}°F</div>
          <div style={{color:"rgba(255,255,255,0.75)",fontSize:12}}>{sm.icon} {season}</div>
        </div>
      </div>
      <div style={S.body}>
        {tab==="home"    && renderHome()}
        {tab==="suggest" && renderSuggest()}
        {tab==="recipes" && renderRecipes()}
        {tab==="health"  && renderHealth()}
        {tab==="profile" && renderProfile()}
      </div>
      <div style={S.nav}>
        {NAV.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{...S.navBtn,color:tab===t.id?"#f59e0b":"#9ca3af",fontWeight:tab===t.id?700:500}}><span style={{fontSize:20}}>{t.icon}</span>{t.label}</button>)}
      </div>
      {showUpgrade    && <UpgradeModal />}
      {selectedTrick  && <TrickModal />}
      {selectedRecipe && <RecipeModal />}
      {editDog        && <ProfileEditModal />}
      {showAddDog     && <AddDogModal />}
    </div>
  );
}