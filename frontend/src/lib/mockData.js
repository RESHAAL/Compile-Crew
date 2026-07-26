// Placeholder disease data used only until the CNN + Gemini backend is live.
// Shape mirrors what /api/predict and /api/treatment are expected to return.
// symptoms/explanation/treatment text carry both `en` and `hi` copies so the
// UI can render either language without waiting on the backend to localize.
export const DISEASE_LIBRARY = [
  {
    id: "early-blight",
    name: "Early Blight",
    localName: { hi: "अगेती झुलसा रोग" },
    crop: "Tomato",
    confidence: 0.92,
    severity: "Moderate",
    symptoms: {
      en: [
        "Brown concentric spots with a yellow halo on lower leaves",
        "Spots enlarging into target-like rings over time",
        "Yellowing and premature drying of older leaves",
      ],
      hi: [
        "निचली पत्तियों पर पीले घेरे वाले भूरे गोलाकार धब्बे",
        "समय के साथ धब्बे बड़े होकर छल्लेदार निशान बनाते हैं",
        "पुरानी पत्तियां पीली पड़कर समय से पहले सूखने लगती हैं",
      ],
    },
    explanation: {
      en: "The brown spots surrounded by a yellow halo, concentrated on older leaves, are a classic signature of Early Blight (Alternaria solani). Warm, humid weather and prolonged leaf wetness accelerate its spread.",
      hi: "पुरानी पत्तियों पर पीले घेरे से घिरे भूरे धब्बे अगेती झुलसा रोग (अल्टरनेरिया सोलानी) की पहचान हैं। गर्म, नम मौसम और पत्तियों पर लंबे समय तक नमी रहने से यह तेजी से फैलता है।",
    },
    treatment: {
      steps: [
        {
          day: { en: "Day 1", hi: "दिन 1" },
          action: { en: "Spray Neem oil (organic)", hi: "नीम तेल का छिड़काव करें (जैविक)" },
          detail: {
            en: "5ml neem oil per litre of water, spray in the evening on all leaf surfaces.",
            hi: "5 मिली नीम तेल प्रति लीटर पानी में मिलाकर शाम के समय सभी पत्तियों पर छिड़कें।",
          },
        },
        {
          day: { en: "Day 4", hi: "दिन 4" },
          action: { en: "Apply Mancozeb fungicide", hi: "मैंकोज़ेब फफूंदनाशक डालें" },
          detail: {
            en: "If new spots appear, spray Mancozeb 75% WP at 2.5g/litre.",
            hi: "यदि नए धब्बे दिखें, तो मैंकोज़ेब 75% WP को 2.5 ग्राम प्रति लीटर की दर से छिड़कें।",
          },
        },
        {
          day: { en: "Day 8", hi: "दिन 8" },
          action: { en: "Observe & remove affected leaves", hi: "निरीक्षण करें और प्रभावित पत्तियां हटाएं" },
          detail: {
            en: "Prune and destroy heavily infected leaves. Recheck plant health.",
            hi: "अत्यधिक संक्रमित पत्तियों को काटकर नष्ट करें। पौधे की सेहत दोबारा जांचें।",
          },
        },
      ],
      costIfUntreated: { min: 8000, max: 12000 },
      treatmentCost: 450,
      currency: "₹",
    },
  },
  {
    id: "leaf-curl",
    name: "Leaf Curl Virus",
    localName: { hi: "पत्ती मरोड़ रोग" },
    crop: "Chilli",
    confidence: 0.87,
    severity: "High",
    symptoms: {
      en: [
        "Upward or downward curling of young leaves",
        "Thickened, leathery leaf texture",
        "Stunted plant growth and reduced fruiting",
      ],
      hi: [
        "नई पत्तियों का ऊपर या नीचे की ओर मुड़ना",
        "पत्तियों का मोटा और चमड़े जैसा बनावट होना",
        "पौधे की बढ़वार रुकना और फलन कम होना",
      ],
    },
    explanation: {
      en: "Curling combined with leathery texture on new growth points to a whitefly-transmitted Leaf Curl Virus. It spreads fast in warm weather when whitefly populations are high.",
      hi: "नई बढ़वार पर मुड़ाव और चमड़े जैसी बनावट सफेद मक्खी से फैलने वाले पत्ती मरोड़ रोग का संकेत है। गर्म मौसम में सफेद मक्खी की संख्या बढ़ने पर यह तेजी से फैलता है।",
    },
    treatment: {
      steps: [
        {
          day: { en: "Day 1", hi: "दिन 1" },
          action: { en: "Remove & destroy infected plants", hi: "संक्रमित पौधों को हटाकर नष्ट करें" },
          detail: {
            en: "Uproot severely curled plants to stop the virus from spreading further.",
            hi: "गंभीर रूप से मुड़े हुए पौधों को उखाड़ दें ताकि वायरस आगे न फैले।",
          },
        },
        {
          day: { en: "Day 2", hi: "दिन 2" },
          action: { en: "Control whitefly vector", hi: "सफेद मक्खी को नियंत्रित करें" },
          detail: {
            en: "Spray Imidacloprid 17.8% SL at 0.3ml/litre to control whiteflies.",
            hi: "सफेद मक्खी को नियंत्रित करने के लिए इमिडाक्लोप्रिड 17.8% SL को 0.3 मिली प्रति लीटर की दर से छिड़कें।",
          },
        },
        {
          day: { en: "Day 10", hi: "दिन 10" },
          action: { en: "Monitor new growth", hi: "नई बढ़वार पर नज़र रखें" },
          detail: {
            en: "Check new leaves weekly for curling; repeat spray if whitefly returns.",
            hi: "हर हफ्ते नई पत्तियों में मुड़ाव जांचें; सफेद मक्खी लौटने पर दोबारा छिड़काव करें।",
          },
        },
      ],
      costIfUntreated: { min: 10000, max: 18000 },
      treatmentCost: 600,
      currency: "₹",
    },
  },
];

export function pickMockDisease(seedText = "") {
  const lower = seedText.toLowerCase();
  if (lower.includes("curl") || lower.includes("मरोड़")) {
    return DISEASE_LIBRARY[1];
  }
  return DISEASE_LIBRARY[0];
}
