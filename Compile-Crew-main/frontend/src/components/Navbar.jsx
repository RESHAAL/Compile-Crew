import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";
import { useDiagnosis } from "../context/DiagnosisContext";

const LINKS = [
  { to: "/", label: { en: "Home", hi: "होम" } },
  { to: "/upload", label: { en: "Diagnose", hi: "निदान करें" } },
];

const DIAGNOSE_NOW = { en: "Diagnose Now", hi: "अभी निदान करें" };

export default function Navbar() {
  const { language, setLanguage } = useDiagnosis();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-soft text-leaf-dark">
            <Leaf className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="font-serif text-lg tracking-tight text-ink">AI Farming Doctor</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-leaf-dark" : "text-ink-muted hover:text-ink"
                }`
              }
            >
              {link.label[language]}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguagePill language={language} setLanguage={setLanguage} />
          <Link
            to="/upload"
            className="rounded-full bg-gradient-to-r from-leaf to-leaf-bright px-5 py-2 text-sm font-medium text-paper shadow-sm shadow-leaf/20 transition-opacity hover:opacity-90"
          >
            {DIAGNOSE_NOW[language]}
          </Link>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line-soft px-6 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-ink" : "text-ink-muted"}`
                }
              >
                {link.label[language]}
              </NavLink>
            ))}
            <LanguagePill language={language} setLanguage={setLanguage} />
            <Link
              to="/upload"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gradient-to-r from-leaf to-leaf-bright px-5 py-2.5 text-center text-sm font-medium text-paper"
            >
              {DIAGNOSE_NOW[language]}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function LanguagePill({ language, setLanguage }) {
  return (
    <div className="flex items-center rounded-full border border-line p-0.5 text-xs font-medium">
      {[
        { code: "en", label: "EN" },
        { code: "hi", label: "हिं" },
      ].map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => setLanguage(opt.code)}
          className={`rounded-full px-3 py-1.5 transition-colors ${
            language === opt.code ? "bg-leaf text-paper" : "text-ink-muted hover:text-ink"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
