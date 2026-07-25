import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Mic, Type, UploadCloud, X, Loader2, ArrowRight } from "lucide-react";
import { useDiagnosis } from "../context/DiagnosisContext";
import VoiceButton from "../components/VoiceButton";
import Button from "../components/Button";
import Reveal from "../components/Reveal";

const TABS = [
  { id: "photo", label: { en: "Photo", hi: "फोटो" }, icon: Camera },
  { id: "voice", label: { en: "Voice", hi: "आवाज़" }, icon: Mic },
  { id: "text", label: { en: "Text", hi: "टेक्स्ट" }, icon: Type },
];

const TEXT_PLACEHOLDER = {
  en: "e.g. My tomato leaves have white spots and are turning yellow at the edges.",
  hi: "जैसे: मेरे टमाटर के पत्तों पर सफेद दाग हैं और किनारों से पीले पड़ रहे हैं।",
};

const T = {
  title: { en: "Tell us what's wrong", hi: "बताएं क्या समस्या है" },
  subtitle: {
    en: "Upload a photo, speak, or type — however is easiest for you.",
    hi: "फोटो अपलोड करें, बोलें, या लिखें — जो भी आपके लिए आसान हो।",
  },
  dropTitle: { en: "Drag & drop a leaf photo", hi: "पत्ती की फोटो यहां खींचकर लाएं" },
  dropSubtitle: { en: "or click to browse — JPG, PNG", hi: "या ब्राउज़ करने के लिए क्लिक करें — JPG, PNG" },
  removeImage: { en: "Remove image", hi: "फोटो हटाएं" },
  tapToSpeak: { en: "Tap to speak", hi: "बोलने के लिए टैप करें" },
  voiceHint: {
    en: 'Describe the problem, e.g. "Mere tamatar ke patte pe safed daag aa rahe hain"',
    hi: 'समस्या बताएं, जैसे: "मेरे टमाटर के पत्ते पे सफेद दाग आ रहे हैं"',
  },
  transcriptPlaceholder: {
    en: "Your transcribed speech will appear here — you can edit it too.",
    hi: "आपकी बोली गई बात यहां दिखेगी — आप इसे बदल भी सकते हैं।",
  },
  cropLabel: { en: "Crop type (optional)", hi: "फसल का प्रकार (वैकल्पिक)" },
  selectCrop: { en: "Select a crop", hi: "फसल चुनें" },
  analyzing: { en: "Analyzing your crop...", hi: "आपकी फसल का विश्लेषण हो रहा है..." },
  analyze: { en: "Analyze My Crop", hi: "मेरी फसल का विश्लेषण करें" },
};

export default function Upload() {
  const navigate = useNavigate();
  const {
    language,
    cropOptions,
    cropType,
    setCropType,
    imagePreview,
    setImage,
    setImagePreview,
    textDescription,
    setTextDescription,
    voiceTranscript,
    setVoiceTranscript,
    runDiagnosis,
    status,
    error,
  } = useDiagnosis();

  const [activeTab, setActiveTab] = useState("photo");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const isDiagnosing = status === "diagnosing";
  const hasInput = Boolean(imagePreview || textDescription.trim() || voiceTranscript.trim());

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function clearImage() {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!hasInput || isDiagnosing) return;
    try {
      await runDiagnosis();
      navigate("/predictions");
    } catch {
      // error is already captured in context state and rendered below
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-10 md:py-14">
      <Reveal immediate className="mb-8 text-center">
        <h1 className="font-serif text-3xl tracking-tight text-ink md:text-4xl">
          {T.title[language]}
        </h1>
        <p className="mt-3 text-ink-soft">{T.subtitle[language]}</p>
      </Reveal>

      <Reveal immediate delay={0.08} className="mb-5 flex justify-center gap-2 rounded-full border border-line-soft bg-canvas p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-paper text-leaf-dark shadow-sm" : "text-ink-muted hover:text-ink"
            }`}
          >
            <tab.icon className="h-4 w-4" strokeWidth={1.75} />
            {tab.label[language]}
          </button>
        ))}
      </Reveal>

      <Reveal immediate delay={0.16} className="rounded-2xl border border-line-soft p-6 md:p-8">
        {activeTab === "photo" && (
          <div>
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-line-soft">
                <img src={imagePreview} alt="Uploaded crop" className="max-h-80 w-full object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/80 text-paper hover:bg-ink"
                  aria-label={T.removeImage[language]}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
                  dragActive ? "border-leaf bg-leaf-soft" : "border-line hover:border-leaf/50 hover:bg-leaf-soft/30"
                }`}
              >
                <UploadCloud className="mb-4 h-8 w-8 text-ink-muted" strokeWidth={1.5} />
                <p className="text-sm font-medium text-ink">{T.dropTitle[language]}</p>
                <p className="mt-1 text-xs text-ink-muted">{T.dropSubtitle[language]}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
            )}
          </div>
        )}

        {activeTab === "voice" && (
          <div className="flex flex-col items-center py-4 text-center">
            <VoiceButton
              mode="listen"
              language={language}
              onTranscript={setVoiceTranscript}
              label={T.tapToSpeak[language]}
              className="px-6 py-3.5 text-base"
            />
            <p className="mt-4 text-xs text-ink-muted">{T.voiceHint[language]}</p>
            <textarea
              value={voiceTranscript}
              onChange={(e) => setVoiceTranscript(e.target.value)}
              placeholder={T.transcriptPlaceholder[language]}
              rows={4}
              className="mt-6 w-full resize-none rounded-xl border border-line-soft bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-ink-muted focus:outline-none"
            />
          </div>
        )}

        {activeTab === "text" && (
          <textarea
            value={textDescription}
            onChange={(e) => setTextDescription(e.target.value)}
            placeholder={TEXT_PLACEHOLDER[language] || TEXT_PLACEHOLDER.en}
            rows={7}
            className="w-full resize-none rounded-xl border border-line-soft px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-ink-muted focus:outline-none"
          />
        )}
      </Reveal>

      <Reveal immediate delay={0.24} className="mt-6">
        <label className="mb-2 block text-sm font-medium text-ink">{T.cropLabel[language]}</label>
        <select
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="w-full rounded-xl border border-line-soft bg-paper px-4 py-3 text-sm text-ink focus:border-ink-muted focus:outline-none"
        >
          <option value="">{T.selectCrop[language]}</option>
          {cropOptions.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>
      </Reveal>

      {error && (
        <p className="mt-4 rounded-xl bg-rust-soft px-4 py-3 text-sm text-rust">{error}</p>
      )}

      <Reveal immediate delay={0.3} className="mt-6">
        <Button
          onClick={handleSubmit}
          disabled={!hasInput || isDiagnosing}
          variant="leaf"
          size="lg"
          className="w-full"
        >
          {isDiagnosing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {T.analyzing[language]}
            </>
          ) : (
            <>
              {T.analyze[language]}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </Reveal>
    </section>
  );
}
