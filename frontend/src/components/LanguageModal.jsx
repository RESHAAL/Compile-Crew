import { Leaf } from "lucide-react";
import { useDiagnosis } from "../context/DiagnosisContext";

// Shown once, before a farmer has picked a language. Big, simple buttons in
// each language's own script — no reliance on understanding "EN / हिं" first.
export default function LanguageModal() {
  const { setLanguage } = useDiagnosis();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-paper p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-leaf-soft text-leaf-dark">
          <Leaf className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <h2 className="font-serif text-2xl text-ink">अपनी भाषा चुनें</h2>
        <p className="mt-1 text-sm text-ink-soft">Choose your language</p>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            className="rounded-2xl bg-gradient-to-r from-leaf to-leaf-bright px-6 py-4 text-lg font-semibold text-paper shadow-sm shadow-leaf/20 transition-opacity hover:opacity-90"
          >
            हिन्दी में जारी रखें
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className="rounded-2xl border border-line px-6 py-4 text-lg font-semibold text-ink transition-colors hover:border-ink-muted"
          >
            Continue in English
          </button>
        </div>
      </div>
    </div>
  );
}
