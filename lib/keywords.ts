// ================================================================
// KaamSathi — Bilingual Keyword Map
// Maps Nepali phrases + English terms → service categories
// Add more keywords here to improve search accuracy
// ================================================================

export const KEYWORD_MAP: Record<string, string[]> = {
  // ── Plumbing ──────────────────────────────────────────────────
  "धारा": ["Plumbing"], "धारा ठीक": ["Plumbing"],
  "धारा बिग्रेको": ["Plumbing"], "पानी": ["Plumbing"],
  "पाइप": ["Plumbing"], "नल": ["Plumbing"],
  "चुहावट": ["Plumbing"], "बाथरुम": ["Plumbing"],
  "शौचालय": ["Plumbing"], "पम्प": ["Plumbing"],
  "ट्याङ्की": ["Plumbing"], "tap": ["Plumbing"],
  "fix tap": ["Plumbing"], "pipe": ["Plumbing"],
  "leak": ["Plumbing"], "toilet": ["Plumbing"],
  "bathroom": ["Plumbing"], "plumb": ["Plumbing"],
  "pump": ["Plumbing"], "tank": ["Plumbing"],
  "water": ["Plumbing"], "drain": ["Plumbing"],

  // ── Cleaning ──────────────────────────────────────────────────
  "सफाई": ["Cleaning"], "घर सफा": ["Cleaning"],
  "कोठा सफा": ["Cleaning"], "मैला": ["Cleaning"],
  "फोहोर": ["Cleaning"], "धुलाई": ["Cleaning"],
  "भाँडा": ["Cleaning"], "झाडु": ["Cleaning"],
  "पोछा": ["Cleaning"], "clean": ["Cleaning"],
  "cleaning": ["Cleaning"], "sweep": ["Cleaning"],
  "mop": ["Cleaning"], "dust": ["Cleaning"],
  "wash": ["Cleaning"], "dish": ["Cleaning"],
  "house clean": ["Cleaning"], "deep clean": ["Cleaning"],

  // ── Electrical ────────────────────────────────────────────────
  "बिजुली": ["Electrical"], "बत्ती": ["Electrical"],
  "पंखा": ["Electrical"], "फ्यूज": ["Electrical"],
  "तार": ["Electrical"], "स्विच": ["Electrical"],
  "बल्ब": ["Electrical"], "इन्भर्टर": ["Electrical"],
  "सकेट": ["Electrical"], "electric": ["Electrical"],
  "electrical": ["Electrical"], "wiring": ["Electrical"],
  "light": ["Electrical"], "fan": ["Electrical"],
  "switch": ["Electrical"], "fuse": ["Electrical"],
  "bulb": ["Electrical"], "inverter": ["Electrical"],
  "socket": ["Electrical"], "power": ["Electrical"],
  "mcb": ["Electrical"], "panel": ["Electrical"],

  // ── Cooking ───────────────────────────────────────────────────
  "खाना": ["Cooking"], "भान्सा": ["Cooking"],
  "रोटी": ["Cooking"], "दाल": ["Cooking"],
  "भात": ["Cooking"], "तरकारी": ["Cooking"],
  "पकाउने": ["Cooking"], "खाना पकाउने": ["Cooking"],
  "cook": ["Cooking"], "cooking": ["Cooking"],
  "chef": ["Cooking"], "meal": ["Cooking"],
  "food": ["Cooking"], "kitchen": ["Cooking"],
  "breakfast": ["Cooking"], "lunch": ["Cooking"],
  "dinner": ["Cooking"], "catering": ["Cooking"],

  // ── Moving ────────────────────────────────────────────────────
  "सार्ने": ["Moving"], "सरसामान": ["Moving"],
  "ढुवानी": ["Moving"], "भार": ["Moving"],
  "बोक्ने": ["Moving"], "move": ["Moving"],
  "moving": ["Moving"], "shifting": ["Moving"],
  "transport": ["Moving"], "load": ["Moving"],
  "unload": ["Moving"], "carry": ["Moving"],
  "pack": ["Moving"], "luggage": ["Moving"],
  "house shifting": ["Moving"], "furniture": ["Moving"],

  // ── Tutoring ──────────────────────────────────────────────────
  "ट्युसन": ["Tutoring"], "पढाउने": ["Tutoring"],
  "गृहकार्य": ["Tutoring"], "गणित": ["Tutoring"],
  "विज्ञान": ["Tutoring"], "अंग्रेजी": ["Tutoring"],
  "पढाइ": ["Tutoring"], "teacher": ["Tutoring"],
  "tutor": ["Tutoring"], "tutoring": ["Tutoring"],
  "math": ["Tutoring"], "english": ["Tutoring"],
  "science": ["Tutoring"], "homework": ["Tutoring"],
  "exam": ["Tutoring"], "slc": ["Tutoring"],
  "+2": ["Tutoring"], "school": ["Tutoring"],
  "college": ["Tutoring"], "study": ["Tutoring"],

  // ── Tech Help ─────────────────────────────────────────────────
  "कम्प्युटर": ["Tech Help"], "ल्यापटप": ["Tech Help"],
  "मोबाइल": ["Tech Help"], "इन्टरनेट": ["Tech Help"],
  "wifi": ["Tech Help"], "भाइरस": ["Tech Help"],
  "computer": ["Tech Help"], "laptop": ["Tech Help"],
  "mobile": ["Tech Help"], "internet": ["Tech Help"],
  "virus": ["Tech Help"], "software": ["Tech Help"],
  "install": ["Tech Help"], "printer": ["Tech Help"],
  "repair": ["Tech Help", "Plumbing", "Electrical"],
  "fix": ["Tech Help", "Plumbing", "Electrical"],
  "network": ["Tech Help"], "router": ["Tech Help"],

  // ── Painting ─────────────────────────────────────────────────
  "रङ": ["Painting"], "भित्ता": ["Painting"],
  "रंग": ["Painting"], "पेन्ट": ["Painting"],
  "paint": ["Painting"], "painting": ["Painting"],
  "wall": ["Painting"], "colour": ["Painting"],
  "color": ["Painting"], "brush": ["Painting"],
  "whitewash": ["Painting"], "primer": ["Painting"],

  // ── Gardening ─────────────────────────────────────────────────
  "बगैंचा": ["Gardening"], "बिरुवा": ["Gardening"],
  "रुख": ["Gardening"], "फूल": ["Gardening"],
  "घाँस": ["Gardening"], "garden": ["Gardening"],
  "gardening": ["Gardening"], "plant": ["Gardening"],
  "tree": ["Gardening"], "lawn": ["Gardening"],
  "grass": ["Gardening"], "flower": ["Gardening"],
  "trim": ["Gardening"], "prune": ["Gardening"],

  // ── Caretaking ────────────────────────────────────────────────
  "स्याहार": ["Caretaking"], "बुढा": ["Caretaking"],
  "बिरामी": ["Caretaking"], "बच्चा": ["Caretaking"],
  "नर्स": ["Caretaking"], "care": ["Caretaking"],
  "caretaking": ["Caretaking"], "elderly": ["Caretaking"],
  "sick": ["Caretaking"], "baby": ["Caretaking"],
  "nurse": ["Caretaking"], "child": ["Caretaking"],
  "patient": ["Caretaking"], "helper": ["Caretaking"],

  // ── Driver ────────────────────────────────────────────────────
  "गाडी": ["Driver"], "चालक": ["Driver"],
  "सवारी": ["Driver"], "ट्याक्सी": ["Driver"],
  "driver": ["Driver"], "driving": ["Driver"],
  "car": ["Driver"], "taxi": ["Driver"],
  "ride": ["Driver"], "vehicle": ["Driver"],
  "bike": ["Driver"], "cab": ["Driver"],

  // ── Pet Care ─────────────────────────────────────────────────
  "कुकुर": ["Pet Care"], "बिरालो": ["Pet Care"],
  "पशु": ["Pet Care"], "पाल्तु": ["Pet Care"],
  "dog": ["Pet Care"], "cat": ["Pet Care"],
  "pet": ["Pet Care"], "animal": ["Pet Care"],
  "vet": ["Pet Care"], "grooming": ["Pet Care"],
  "walk dog": ["Pet Care"], "pet sit": ["Pet Care"],
}

// ── Helper: get matched skills from query ─────────────────────
export function getMatchedSkills(query: string): string[] {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()
  const matched = new Set<string>()

  for (const [kw, skills] of Object.entries(KEYWORD_MAP)) {
    if (q.includes(kw.toLowerCase()) || kw.toLowerCase().includes(q)) {
      skills.forEach(s => matched.add(s))
    }
  }
  return [...matched]
}

// ── Helper: score a tasker against query ──────────────────────
export function scoreTasker(tasker: {
  name: string
  city: string
  skills: string[]
}, query: string): { score: number; matchedSkills: string[] } {
  const q = query.toLowerCase().trim()
  const matchedSkills = getMatchedSkills(q).filter(s =>
    tasker.skills.includes(s)
  )
  let score = 0
  if (tasker.name.toLowerCase().includes(q)) score += 10
  if (tasker.city.toLowerCase().includes(q)) score += 5
  score += matchedSkills.length * 8
  tasker.skills.forEach(s => {
    if (s.toLowerCase().includes(q)) score += 6
  })
  return { score, matchedSkills }
}