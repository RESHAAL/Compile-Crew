import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useDiagnosis } from "../context/DiagnosisContext";

const T = {
  home: { en: "Home", hi: "होम" },
  diagnose: { en: "Diagnose", hi: "निदान करें" },
  howItWorks: { en: "How it works", hi: "यह कैसे काम करता है" },
  tagline: { en: "Built for farmers, in their own language.", hi: "किसानों के लिए, उनकी अपनी भाषा में बनाया गया।" },
};

export default function Footer() {
  const { language } = useDiagnosis();

  return (
    <footer className="border-t border-line-soft">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-leaf-soft text-leaf-dark">
              <Leaf className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <span className="font-serif text-base text-ink">AI Farming Doctor</span>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted">
            <Link to="/" className="hover:text-leaf-dark">{T.home[language]}</Link>
            <Link to="/upload" className="hover:text-leaf-dark">{T.diagnose[language]}</Link>
            <a href="#how-it-works" className="hover:text-leaf-dark">{T.howItWorks[language]}</a>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-line-soft pt-5 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>{T.tagline[language]}</p>
          <p>&copy; {new Date().getFullYear()} AI Farming Doctor. A student project.</p>
        </div>
      </div>
    </footer>
  );
}
