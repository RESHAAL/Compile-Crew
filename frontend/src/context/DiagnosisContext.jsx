import { createContext, useContext, useMemo, useState } from "react";
import { diagnoseCrop, getTreatmentPlan } from "../services/api";

const DiagnosisContext = createContext(null);

const CROP_OPTIONS = ["Tomato", "Chilli", "Potato", "Cotton", "Wheat", "Other"];
const LANGUAGE_STORAGE_KEY = "afd_language";

export function DiagnosisProvider({ children }) {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en"
  );
  const [languageChosen, setLanguageChosen] = useState(
    () => Boolean(localStorage.getItem(LANGUAGE_STORAGE_KEY))
  );

  function setLanguage(lang) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setLanguageState(lang);
    setLanguageChosen(true);
  }

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textDescription, setTextDescription] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [cropType, setCropType] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState(null);

  const [status, setStatus] = useState("idle"); // idle | diagnosing | planning | error
  const [error, setError] = useState(null);

  function resetInputs() {
    setImage(null);
    setImagePreview(null);
    setTextDescription("");
    setVoiceTranscript("");
    setCropType("");
    setPrediction(null);
    setTreatmentPlan(null);
    setStatus("idle");
    setError(null);
  }

  async function runDiagnosis() {
    setStatus("diagnosing");
    setError(null);
    try {
      const result = await diagnoseCrop({
        image,
        imagePreview,
        text: textDescription,
        voiceTranscript,
        cropType,
        language,
      });
      setPrediction(result);
      setStatus("idle");
      return result;
    } catch (err) {
      setError(err.message || "Diagnosis failed. Please try again.");
      setStatus("error");
      throw err;
    }
  }

  async function runTreatmentPlan(diseaseId) {
    setStatus("planning");
    setError(null);
    try {
      const plan = await getTreatmentPlan({ diseaseId, language });
      setTreatmentPlan(plan);
      setStatus("idle");
      return plan;
    } catch (err) {
      setError(err.message || "Could not load treatment plan.");
      setStatus("error");
      throw err;
    }
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languageChosen,
      cropOptions: CROP_OPTIONS,
      image,
      setImage,
      imagePreview,
      setImagePreview,
      textDescription,
      setTextDescription,
      voiceTranscript,
      setVoiceTranscript,
      cropType,
      setCropType,
      prediction,
      treatmentPlan,
      status,
      error,
      runDiagnosis,
      runTreatmentPlan,
      resetInputs,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, languageChosen, image, imagePreview, textDescription, voiceTranscript, cropType, prediction, treatmentPlan, status, error]
  );

  return <DiagnosisContext.Provider value={value}>{children}</DiagnosisContext.Provider>;
}

export function useDiagnosis() {
  const ctx = useContext(DiagnosisContext);
  if (!ctx) throw new Error("useDiagnosis must be used within DiagnosisProvider");
  return ctx;
}
