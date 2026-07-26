import { pickMockDisease } from "../lib/mockData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const MOCK_DELAY_MS = 900;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function diagnoseCrop(payload) {
  await delay(MOCK_DELAY_MS);
  const lang = payload.language === "hi" ? "hi" : "en";
  const disease = pickMockDisease(payload.text || payload.voiceTranscript || "");

  return {
    diseaseId: disease.id,
    name: disease.name,
    localName: disease.localName,
    crop: disease.crop,
    confidence: disease.confidence,
    severity: disease.severity,
    symptoms: disease.symptoms[lang],
    explanation: disease.explanation[lang],
    imagePreview: payload.imagePreview ?? null,
  };
}

export async function getTreatmentPlan({ diseaseId, language = "en" }) {
  await delay(MOCK_DELAY_MS);
  const lang = language === "hi" ? "hi" : "en";
  const disease = pickMockDisease(diseaseId === "leaf-curl" ? "curl" : "");

  return {
    steps: disease.treatment.steps.map((step) => ({
      day: step.day[lang],
      action: step.action[lang],
      detail: step.detail[lang],
    })),
    costIfUntreated: disease.treatment.costIfUntreated,
    treatmentCost: disease.treatment.treatmentCost,
    currency: disease.treatment.currency,
  };
}

export async function textToSpeech({ text, language }) {
  void text;
  void language;

  throw new Error(
    "textToSpeech: backend not connected yet, use browser SpeechSynthesis fallback"
  );
}