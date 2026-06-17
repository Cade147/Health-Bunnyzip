import { Router } from "express";
import { AnalyzeSymptomsBody } from "@workspace/api-zod";

const router = Router();

interface HealthGuidance {
  isEmergency: boolean;
  emergencyMessage?: string;
  recommendedFoods: string[];
  thingsToDo: string[];
  possibleCauses: string[];
  thingsToAvoid: string[];
  whenToSeeDoctor: string[];
  disclaimer: string;
}

const DISCLAIMER =
  "Health Bunny AI provides general health information and home-care guidance only. It is not a medical diagnosis tool and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for serious or persistent symptoms.";

type SymptomKey =
  | "headache"
  | "stomach"
  | "flu"
  | "acne"
  | "cough"
  | "fever"
  | "sore throat"
  | "allerg"
  | "fatigue"
  | "nausea"
  | "vomit"
  | "diarrhea"
  | "rash"
  | "back pain"
  | "anxiety"
  | "insomnia";

type SymptomGuidance = {
  foods: string[];
  dos: string[];
  causes: string[];
  avoids: string[];
  doctorSigns: string[];
};

const symptomLibrary: Record<SymptomKey, SymptomGuidance> = {
  headache: {
    foods: ["Water", "Herbal tea", "Magnesium-rich foods (spinach, almonds)", "Ginger tea", "Watermelon"],
    dos: ["Rest in a quiet, dark room", "Stay hydrated", "Apply a cold or warm compress", "Practice deep breathing", "Avoid screen time"],
    causes: ["Dehydration", "Tension or stress", "Eye strain", "Poor sleep", "Sinus congestion", "Hormonal changes"],
    avoids: ["Bright screens", "Loud noise", "Alcohol", "Caffeine excess", "Skipping meals"],
    doctorSigns: ["Sudden severe 'thunderclap' headache", "Headache with fever and stiff neck", "Headache after head injury", "Worsening headache over several days", "Vision changes or confusion"],
  },
  stomach: {
    foods: ["Plain rice", "Bananas", "Toast", "Applesauce", "Boiled potatoes", "Ginger tea", "Peppermint tea"],
    dos: ["Eat small, frequent meals", "Stay hydrated with clear fluids", "Rest after eating", "Try warm compresses on abdomen"],
    causes: ["Indigestion or acid reflux", "Gastroenteritis", "Food intolerance", "Stress", "Irritable bowel syndrome"],
    avoids: ["Spicy foods", "Fatty or fried foods", "Alcohol", "Carbonated drinks", "Dairy (temporarily)"],
    doctorSigns: ["Pain lasting more than a few days", "Blood in stool", "Severe abdominal pain", "Unexplained weight loss", "Persistent vomiting"],
  },
  flu: {
    foods: ["Chicken soup", "Hot herbal tea", "Honey and lemon water", "Oranges and vitamin C-rich fruits", "Broth", "Garlic"],
    dos: ["Rest as much as possible", "Stay well hydrated", "Monitor temperature", "Use a humidifier", "Isolate to avoid spreading"],
    causes: ["Influenza A or B virus", "Weakened immune system", "Seasonal exposure", "Contact with infected person"],
    avoids: ["Alcohol", "Smoking", "Dairy (can increase mucus)", "Sugar-heavy foods", "Strenuous exercise"],
    doctorSigns: ["Difficulty breathing", "Persistent chest pain", "Confusion or altered consciousness", "Severe dehydration", "Symptoms improving then suddenly worsening"],
  },
  acne: {
    foods: ["Water (stay hydrated)", "Green vegetables", "Zinc-rich foods (pumpkin seeds)", "Omega-3 foods (salmon, walnuts)", "Probiotic foods (yogurt, kefir)"],
    dos: ["Cleanse face gently twice daily", "Use non-comedogenic moisturizer", "Avoid touching your face", "Change pillowcase regularly", "Manage stress"],
    causes: ["Excess sebum production", "Hormonal changes", "Bacteria (C. acnes)", "Clogged pores", "Diet and stress"],
    avoids: ["Dairy in excess", "High-glycemic foods", "Popping or picking pimples", "Harsh scrubbing", "Skipping moisturizer"],
    doctorSigns: ["Severe cystic acne", "Acne leaving scars", "Sudden severe breakout in adults", "No improvement after 8 weeks of home care"],
  },
  cough: {
    foods: ["Honey (soothes throat)", "Warm lemon water", "Ginger tea", "Warm broth", "Pineapple juice (bromelain)"],
    dos: ["Stay hydrated", "Use a humidifier", "Gargle with warm salt water", "Elevate head when sleeping", "Rest your voice"],
    causes: ["Viral upper respiratory infection", "Allergies", "Postnasal drip", "Asthma", "Acid reflux (GERD)"],
    avoids: ["Smoke and smoky environments", "Cold air", "Dusty environments", "Dairy (may thicken mucus)", "Irritants like perfumes"],
    doctorSigns: ["Coughing blood", "Shortness of breath", "Cough lasting more than 3 weeks", "High fever with cough", "Wheezing or chest tightness"],
  },
  fever: {
    foods: ["Water and clear fluids", "Electrolyte drinks", "Broths and soups", "Light fruits (watermelon, oranges)", "Herbal teas"],
    dos: ["Rest and sleep", "Stay well hydrated", "Use cool compress on forehead", "Monitor temperature regularly", "Wear light clothing"],
    causes: ["Viral or bacterial infection", "Inflammation", "Immune response", "Heat exhaustion (if exposed to heat)", "Medication side effects"],
    avoids: ["Alcohol", "Caffeine", "Heavy or greasy foods", "Overdressing", "Strenuous activity"],
    doctorSigns: ["Fever above 39.4°C (103°F) in adults", "Fever lasting more than 3 days", "Stiff neck with fever", "Rash accompanying fever", "Confusion or disorientation"],
  },
  "sore throat": {
    foods: ["Warm honey and lemon tea", "Ice cream or cold drinks (soothe inflammation)", "Warm broth", "Soft foods", "Popsicles"],
    dos: ["Gargle with warm salt water", "Rest your voice", "Stay hydrated", "Use a humidifier", "Suck on throat lozenges"],
    causes: ["Viral infection (common cold, flu)", "Strep throat (bacterial)", "Allergies", "Dry air", "Acid reflux"],
    avoids: ["Smoking", "Alcohol", "Hard or scratchy foods", "Shouting or straining voice", "Cold dry air without scarf"],
    doctorSigns: ["Severe difficulty swallowing", "Throat swelling visible", "High fever (over 38.5°C)", "Rash alongside sore throat", "Symptoms lasting more than a week"],
  },
  allerg: {
    foods: ["Local honey (may help with pollen)", "Quercetin-rich foods (onions, apples)", "Vitamin C foods", "Omega-3 fatty acids", "Green tea"],
    dos: ["Identify and avoid triggers", "Keep windows closed during high pollen", "Shower after outdoor exposure", "Wash bedding regularly", "Use air purifiers"],
    causes: ["Pollen, dust mites, pet dander", "Food allergens", "Mold spores", "Insect stings", "Medications"],
    avoids: ["Known allergens", "Outdoor activity on high pollen days", "Pet exposure if allergic", "Damp moldy environments"],
    doctorSigns: ["Severe difficulty breathing", "Throat swelling or closing", "Anaphylaxis symptoms", "Allergies significantly impacting quality of life", "Symptoms not controlled with antihistamines"],
  },
  fatigue: {
    foods: ["Iron-rich foods (spinach, lentils)", "B12 foods (eggs, meat, fortified cereals)", "Complex carbs (oats, brown rice)", "Nuts and seeds", "Green smoothies"],
    dos: ["Prioritize 7-9 hours of sleep", "Exercise regularly (even light walks)", "Manage stress", "Stay hydrated", "Take regular breaks"],
    causes: ["Poor sleep", "Anemia or iron deficiency", "Thyroid issues", "Depression or anxiety", "Vitamin D deficiency", "Overwork or burnout"],
    avoids: ["Excessive caffeine", "Alcohol", "Skipping meals", "Late-night screen use", "Oversleeping (can worsen fatigue)"],
    doctorSigns: ["Extreme exhaustion despite rest", "Fatigue with unexplained weight loss", "Night sweats with fatigue", "Lasting more than 2 weeks", "Fatigue with chest pain or palpitations"],
  },
  nausea: {
    foods: ["Ginger tea or ginger chews", "Plain crackers", "Toast", "Bananas", "Small sips of cold water", "Peppermint tea"],
    dos: ["Eat small frequent meals", "Rest after eating, sitting upright", "Get fresh air", "Avoid lying flat after eating", "Apply cool cloth to forehead"],
    causes: ["Gastroenteritis", "Motion sickness", "Pregnancy", "Migraine", "Food poisoning", "Medication side effects"],
    avoids: ["Strong smells", "Fatty or spicy foods", "Large meals", "Lying down immediately after eating", "Alcohol"],
    doctorSigns: ["Nausea with severe abdominal pain", "Nausea lasting more than 2 days", "Signs of dehydration", "Blood in vomit", "Nausea after head injury"],
  },
  vomit: {
    foods: ["Clear fluids (water, broth)", "Electrolyte solutions (oral rehydration salts)", "Ice chips", "Once improving: BRAT diet (Bananas, Rice, Applesauce, Toast)"],
    dos: ["Wait 30-60 min after vomiting before drinking", "Sip small amounts of fluid frequently", "Rest", "Reintroduce food slowly once vomiting stops"],
    causes: ["Gastroenteritis", "Food poisoning", "Medication side effects", "Migraine", "Motion sickness", "Inner ear disorders"],
    avoids: ["Solid food until vomiting stops", "Dairy", "Fatty foods", "Alcohol", "Acidic drinks"],
    doctorSigns: ["Vomiting blood or coffee-ground material", "Severe abdominal pain", "Signs of dehydration (dry mouth, no urination)", "Vomiting after head injury", "Unable to keep fluids down for 24 hours"],
  },
  diarrhea: {
    foods: ["Oral rehydration salts (ORS)", "Boiled potatoes", "Plain rice", "Bananas", "Toast", "Clear broth"],
    dos: ["Drink plenty of fluids", "Use ORS solution", "Rest", "Wash hands frequently", "Eat small amounts once tolerated"],
    causes: ["Viral or bacterial gastroenteritis", "Food poisoning", "Antibiotic use", "IBS", "Food intolerance (lactose, gluten)"],
    avoids: ["Dairy products", "Fatty foods", "Spicy foods", "Alcohol", "Caffeine", "High-fiber foods initially"],
    doctorSigns: ["Blood in stool", "Diarrhea lasting more than 2 days in adults", "Signs of dehydration", "High fever with diarrhea", "Severe abdominal pain"],
  },
  rash: {
    foods: ["Anti-inflammatory foods (turmeric, ginger, berries)", "Water", "Vitamin E foods (nuts, seeds)", "Omega-3 foods"],
    dos: ["Keep area clean and dry", "Avoid scratching", "Use gentle fragrance-free soap", "Cool compress for relief", "Wear loose cotton clothing"],
    causes: ["Allergic reaction", "Contact dermatitis", "Eczema", "Viral infection (chickenpox, measles)", "Heat rash", "Insect bites"],
    avoids: ["Known irritants", "Tight clothing", "Scented products on affected area", "Hot showers", "Scratching"],
    doctorSigns: ["Rash spreading rapidly", "Rash with high fever", "Blistering rash", "Rash on face near eyes", "Signs of infection (pus, warmth, swelling)"],
  },
  "back pain": {
    foods: ["Calcium-rich foods (dairy, leafy greens)", "Vitamin D foods", "Anti-inflammatory foods (turmeric, ginger)", "Omega-3 fatty acids", "Water"],
    dos: ["Gentle stretching and movement", "Apply heat or ice (whichever helps more)", "Maintain good posture", "Sleep on a supportive mattress", "Avoid prolonged sitting"],
    causes: ["Muscle strain or spasm", "Poor posture", "Herniated disc", "Arthritis", "Kidney issues", "Osteoporosis"],
    avoids: ["Heavy lifting", "Prolonged bed rest", "High heels", "Slouching", "Sudden twisting movements"],
    doctorSigns: ["Pain with numbness or tingling down legs", "Bladder or bowel changes", "Severe pain after injury", "Pain that wakes you from sleep", "Unexplained weight loss with back pain"],
  },
  anxiety: {
    foods: ["Magnesium-rich foods (dark chocolate, spinach)", "Chamomile tea", "Omega-3 fatty acids", "Probiotics (yogurt)", "Complex carbs (oats)"],
    dos: ["Practice deep breathing exercises", "Regular physical exercise", "Meditation or mindfulness", "Maintain consistent sleep schedule", "Connect with supportive people"],
    causes: ["Stress and life pressures", "Genetic predisposition", "Hormone imbalances", "Caffeine or stimulant overuse", "Underlying medical conditions"],
    avoids: ["Excessive caffeine", "Alcohol", "Recreational drugs", "Avoiding feared situations entirely", "Doom-scrolling social media"],
    doctorSigns: ["Panic attacks", "Anxiety severely impacting daily life", "Physical symptoms (chest pain, shortness of breath)", "Anxiety with depression", "Thoughts of self-harm"],
  },
  insomnia: {
    foods: ["Tart cherry juice (natural melatonin)", "Kiwi fruit", "Warm milk", "Chamomile tea", "Almonds and walnuts"],
    dos: ["Keep consistent sleep and wake times", "Create a relaxing bedtime routine", "Keep bedroom dark and cool", "Limit screens 1 hour before bed", "Light exercise during the day"],
    causes: ["Stress or anxiety", "Poor sleep hygiene", "Caffeine or alcohol use", "Medical conditions (pain, GERD)", "Jet lag or shift work", "Certain medications"],
    avoids: ["Caffeine after noon", "Alcohol near bedtime", "Heavy meals before bed", "Bright screens at night", "Napping late in the day"],
    doctorSigns: ["Insomnia lasting more than 3 months", "Insomnia with depression or anxiety", "Gasping or snoring during sleep", "Restless legs at night", "Extreme daytime fatigue affecting function"],
  },
};

function matchSymptom(name: string): SymptomGuidance | null {
  const lower = name.toLowerCase();
  for (const key of Object.keys(symptomLibrary) as SymptomKey[]) {
    if (lower.includes(key)) {
      return symptomLibrary[key];
    }
  }
  return null;
}

function getGenericGuidance(symptomName: string): SymptomGuidance {
  return {
    foods: ["Water and clear fluids", "Fresh fruits and vegetables", "Light, easy-to-digest meals", "Herbal teas", "Broth or soups"],
    dos: [`Rest adequately`, "Stay well hydrated", "Monitor your symptoms closely", "Maintain gentle daily activity if able", "Practice stress management"],
    causes: [`${symptomName} can have various causes`, "Viral or bacterial infections", "Stress or lifestyle factors", "Underlying health conditions", "Environmental triggers"],
    avoids: ["Alcohol and tobacco", "Processed or junk foods", "Excessive caffeine", "Strenuous physical activity", "Ignoring worsening symptoms"],
    doctorSigns: ["Symptoms lasting more than 7 days", "Worsening despite home care", "High fever (above 39°C)", "Difficulty breathing or swallowing", "Severe pain or discomfort"],
  };
}

function buildSeverityNote(severity: string, duration: string): string[] {
  const extra: string[] = [];
  if (severity === "Severe") {
    extra.push("Consider seeing a doctor soon — severe symptoms warrant professional evaluation");
  }
  if (duration === "More than a Week") {
    extra.push("Symptoms lasting over a week should be assessed by a healthcare professional");
  }
  return extra;
}

router.post("/symptoms/analyze", async (req, res) => {
  const parse = AnalyzeSymptomsBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { symptomName, severity, duration, emergencySymptoms } = parse.data;

  const isEmergency = emergencySymptoms === true || severity === "Severe";
  const guidance = matchSymptom(symptomName) ?? getGenericGuidance(symptomName);
  const severityNotes = buildSeverityNote(severity, duration);

  const result: HealthGuidance = {
    isEmergency,
    emergencyMessage: isEmergency
      ? "Please seek medical attention immediately or contact a healthcare professional. Do not delay if you are experiencing severe or emergency symptoms."
      : undefined,
    recommendedFoods: guidance.foods,
    thingsToDo: [...guidance.dos, ...severityNotes],
    possibleCauses: guidance.causes,
    thingsToAvoid: guidance.avoids,
    whenToSeeDoctor: guidance.doctorSigns,
    disclaimer: DISCLAIMER,
  };

  res.json(result);
});

export default router;
