import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Loader2, ImageOff } from "lucide-react";
import { useDiagnosis } from "../context/DiagnosisContext";
import Button from "../components/Button";
import Reveal from "../components/Reveal";

const SEVERITY_STYLES = {
  Low: "bg-leaf-soft text-leaf-dark",
  Moderate: "bg-amber-soft text-amber",
  High: "bg-rust-soft text-rust",
};

const SEVERITY_LABELS = {
  Low: { en: "Low", hi: "कम" },
  Moderate: { en: "Moderate", hi: "मध्यम" },
  High: { en: "High", hi: "अधिक" },
};

const T = {
  eyebrow: { en: "Diagnosis", hi: "निदान" },
  noDiagnosisTitle: { en: "No diagnosis yet", hi: "अभी तक कोई निदान नहीं" },
  noDiagnosisBody: {
    en: "Upload a photo or describe your crop's problem first to see a diagnosis here.",
    hi: "यहां निदान देखने के लिए पहले फोटो अपलोड करें या अपनी फसल की समस्या बताएं।",
  },
  goToDiagnose: { en: "Go to Diagnose", hi: "निदान पर जाएं" },
  crop: { en: "Crop", hi: "फसल" },
  confidence: { en: "Confidence", hi: "विश्वसनीयता" },
  severitySuffix: { en: "severity", hi: "गंभीरता" },
  whyWeThink: { en: "Why we think this", hi: "हमें ऐसा क्यों लगता है" },
  preparingPlan: { en: "Preparing your treatment plan...", hi: "आपकी उपचार योजना तैयार हो रही है..." },
  viewTreatment: { en: "View Treatment Plan", hi: "उपचार योजना देखें" },
};

export default function Predictions() {
  const navigate = useNavigate();
  const { prediction, language, runTreatmentPlan, status, error } = useDiagnosis();

  const isPlanning = status === "planning";

  if (!prediction) {
    return (
      <section className="mx-auto max-w-xl px-6 py-16 text-center">
        <Reveal immediate>
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-leaf-soft text-leaf-dark">
            <ImageOff className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h1 className="font-serif text-2xl text-ink">{T.noDiagnosisTitle[language]}</h1>
          <p className="mt-3 text-ink-soft">{T.noDiagnosisBody[language]}</p>
          <div className="mt-7">
            <Button to="/upload" variant="leaf">{T.goToDiagnose[language]}</Button>
          </div>
        </Reveal>
      </section>
    );
  }

  async function handleViewTreatment() {
    try {
      await runTreatmentPlan(prediction.diseaseId);
      navigate("/treatment");
    } catch {
      // error is captured in context and rendered below
    }
  }

  const localName = language === "hi" ? prediction.localName?.hi : null;
  const severityLabel = SEVERITY_LABELS[prediction.severity]?.[language] || prediction.severity;

  return (
    <section className="mx-auto max-w-2xl px-6 py-10 md:py-14">
      <Reveal immediate className="mb-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-leaf-dark">{T.eyebrow[language]}</p>
      </Reveal>

      <Reveal immediate delay={0.08} className="overflow-hidden rounded-2xl border border-line-soft">
        {prediction.imagePreview && (
          <img
            src={prediction.imagePreview}
            alt="Diagnosed crop"
            className="max-h-72 w-full object-cover"
          />
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-ink">{prediction.name}</h1>
              {localName && <p className="mt-1 text-ink-muted">{localName}</p>}
            </div>
            <span
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                SEVERITY_STYLES[prediction.severity] || SEVERITY_STYLES.Moderate
              }`}
            >
              {severityLabel} {T.severitySuffix[language]}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            <span>{T.crop[language]}: <span className="font-medium text-ink">{prediction.crop}</span></span>
            <span>
              {T.confidence[language]}:{" "}
              <span className="font-medium text-ink">{Math.round(prediction.confidence * 100)}%</span>
            </span>
          </div>

          <hr className="my-6 border-line-soft" />

          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-muted">
            {T.whyWeThink[language]}
          </h2>
          <ul className="mb-5 space-y-2.5">
            {prediction.symptoms.map((symptom) => (
              <li key={symptom} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark" strokeWidth={1.75} />
                {symptom}
              </li>
            ))}
          </ul>
          <p className="rounded-xl bg-canvas p-4 text-sm leading-relaxed text-ink-soft">
            {prediction.explanation}
          </p>
        </div>
      </Reveal>

      {error && (
        <p className="mt-4 rounded-xl bg-rust-soft px-4 py-3 text-sm text-rust">{error}</p>
      )}

      <Reveal immediate delay={0.16} className="mt-6">
        <Button onClick={handleViewTreatment} disabled={isPlanning} variant="leaf" size="lg" className="w-full">
          {isPlanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {T.preparingPlan[language]}
            </>
          ) : (
            <>
              {T.viewTreatment[language]}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </Reveal>
    </section>
  );
}
