// Frontend <-> backend contract for AI Farming Doctor.
// Every function below is mocked with a network-like delay so the UI can be
// built and demoed end-to-end. Swap the mocked body for a real `fetch` once
// the Flask backend (app.py) exposes the matching route — the input/output
// shape is intentionally kept close to what the CNN + Gemini pipeline needs.

import { pickMockDisease } from "../lib/mockData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const MOCK_DELAY_MS = 900;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends the farmer's input (image and/or voice transcript and/or typed text)
 * to the backend for diagnosis.
 *
 * TODO(backend): replace with
 *   const form = new FormData();
 *   if (payload.image) form.append("image", payload.image);
 *   form.append("text", payload.text ?? "");
 *   form.append("cropType", payload.cropType ?? "");
 *   form.append("language", payload.language);
 *   const res = await fetch(`${BASE_URL}/api/predict`, { method: "POST", body: form });
 *   return res.json();
 */
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

/**
 * Fetches the day-wise treatment plan and cost-impact analysis for a
 * diagnosed disease.
 *
 * TODO(backend): replace with
 *   const res = await fetch(`${BASE_URL}/api/treatment/${diseaseId}?language=${language}`);
 *   return res.json();
 */
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

/**
 * TODO(backend): once the Hindi voice pipeline is ready, replace the
 * client-side SpeechSynthesis fallback (see components/VoiceButton.jsx)
 * with a call here that returns an audio URL:
 *   const res = await fetch(`${BASE_URL}/api/voice/tts`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ text, language }),
 *   });
 *   const { audioUrl } = await res.json();
 *   return audioUrl;
 */
export async function textToSpeech({ text, language }) {
  void text;
  void language;
  throw new Error("textToSpeech: backend not connected yet, use browser SpeechSynthesis fallback");
}
