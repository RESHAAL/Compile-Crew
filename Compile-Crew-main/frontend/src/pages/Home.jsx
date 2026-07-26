import {
  Camera,
  Mic,
  Sparkles,
  CalendarDays,
  IndianRupee,
  Languages,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useDiagnosis } from "../context/DiagnosisContext";
import Button from "../components/Button";
import Reveal from "../components/Reveal";

const STEPS = [
  {
    icon: Camera,
    title: { en: "Speak or snap a photo", hi: "बोलें या फोटो खींचें" },
    body: {
      en: "Upload a photo of the affected leaf, or just describe the problem by voice in your own language.",
      hi: "प्रभावित पत्ती की फोटो अपलोड करें, या अपनी भाषा में बोलकर समस्या बताएं।",
    },
  },
  {
    icon: Sparkles,
    title: { en: "AI diagnoses the problem", hi: "AI समस्या का निदान करता है" },
    body: {
      en: "Our model reads the visual symptoms and explains its reasoning — not just a disease name.",
      hi: "हमारा मॉडल दिखने वाले लक्षणों को पढ़कर अपना तर्क समझाता है — सिर्फ बीमारी का नाम नहीं।",
    },
  },
  {
    icon: CalendarDays,
    title: { en: "Get a day-wise plan", hi: "दिन-वार योजना पाएं" },
    body: {
      en: "A simple treatment schedule: what to apply, when, and why — no guesswork.",
      hi: "एक आसान उपचार योजना: क्या डालना है, कब डालना है, और क्यों — कोई अंदाज़ा नहीं।",
    },
  },
  {
    icon: IndianRupee,
    title: { en: "See what you save", hi: "अपनी बचत देखें" },
    body: {
      en: "A clear comparison of treatment cost versus potential crop loss if left untreated.",
      hi: "उपचार की लागत और इलाज न करने पर होने वाले फसल नुकसान की स्पष्ट तुलना।",
    },
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    tint: "bg-leaf-soft text-leaf-dark",
    title: { en: "Explainable AI", hi: "समझाने वाला AI" },
    body: {
      en: "Every diagnosis comes with the visual evidence behind it, in plain language — building trust, not just giving a label.",
      hi: "हर निदान के साथ उसके पीछे का सबूत सरल भाषा में मिलता है — सिर्फ नाम नहीं, भरोसा भी।",
    },
  },
  {
    icon: CalendarDays,
    tint: "bg-amber-soft text-amber",
    title: { en: "Day-wise treatment plans", hi: "दिन-वार उपचार योजना" },
    body: {
      en: "Structured, sequential guidance — Day 1, Day 4, Day 8 — so farmers know exactly what to do and when.",
      hi: "क्रमबद्ध मार्गदर्शन — दिन 1, दिन 4, दिन 8 — ताकि किसान को पता हो क्या करना है और कब।",
    },
  },
  {
    icon: IndianRupee,
    tint: "bg-rust-soft text-rust",
    title: { en: "Cost impact analysis", hi: "लागत प्रभाव विश्लेषण" },
    body: {
      en: "See the real cost of inaction alongside the cost of treatment, so the decision is obvious.",
      hi: "इलाज न करने की असली कीमत और उपचार की लागत को साथ देखें, ताकि फैसला आसान हो।",
    },
  },
  {
    icon: Languages,
    tint: "bg-leaf-soft text-leaf-dark",
    title: { en: "Voice, in your language", hi: "आपकी भाषा में आवाज़" },
    body: {
      en: "Speak your problem and hear the diagnosis and treatment plan read back in your mother tongue.",
      hi: "अपनी समस्या बोलें और निदान व उपचार योजना अपनी मातृभाषा में सुनें।",
    },
  },
];

const GALLERY = [
  {
    label: { en: "Farmer photographing a leaf", hi: "किसान पत्ती की फोटो लेते हुए" },
    src: "/images/farmer-photographing.jpg",
    className: "sm:col-span-2 aspect-[16/10]",
  },
  {
    label: { en: "Close-up of diagnosed symptoms", hi: "निदान किए गए लक्षणों का क्लोज़-अप" },
    src: "/images/diagnosed-symptoms.jpg",
    className: "aspect-[4/5]",
  },
  {
    label: { en: "Treatment applied in the field", hi: "खेत में लगाया गया उपचार" },
    src: "/images/treatment-applied.jpg",
    className: "aspect-[4/5]",
  },
  {
    label: { en: "A healthy crop, weeks later", hi: "हफ्तों बाद एक स्वस्थ फसल" },
    src: "/images/healthy-crop.jpg",
    className: "sm:col-span-2 aspect-[16/10]",
  },
];

const T = {
  eyebrow: { en: "An AI-powered farming assistant", hi: "एक AI-संचालित कृषि सहायक" },
  heroSubtitle: {
    en: "Upload a photo or just speak your problem — \"Mere tamatar ke patte pe safed daag aa rahe hain\" — and get an expert diagnosis, explained simply, in your language.",
    hi: "एक फोटो अपलोड करें या बस अपनी समस्या बोलें — \"मेरे टमाटर के पत्ते पे सफेद दाग आ रहे हैं\" — और अपनी भाषा में, आसान शब्दों में विशेषज्ञ निदान पाएं।",
  },
  diagnoseCta: { en: "Diagnose Your Crop", hi: "अपनी फसल का निदान करें" },
  seeHowItWorks: { en: "See how it works", hi: "यह कैसे काम करता है" },
  photoDiagnosis: { en: "Photo diagnosis", hi: "फोटो से निदान" },
  voiceInput: { en: "Voice input", hi: "आवाज़ से इनपुट" },
  localLanguage: { en: "Local language output", hi: "स्थानीय भाषा में परिणाम" },
  heroImageAlt: {
    en: "A farmer diagnosing a crop with the app",
    hi: "ऐप से फसल का निदान करता एक किसान",
  },
  howItWorksTitle: { en: "How it works", hi: "यह कैसे काम करता है" },
  howItWorksSubtitle: {
    en: "From a symptom to a solution, in four simple steps.",
    hi: "लक्षण से समाधान तक, चार आसान चरणों में।",
  },
  step: { en: "Step", hi: "चरण" },
  galleryTitle: { en: "Built with farmers in mind", hi: "किसानों को ध्यान में रखकर बनाया गया" },
  gallerySubtitle: {
    en: "From the field to a treatment plan — every step designed to be simple.",
    hi: "खेत से लेकर उपचार योजना तक — हर कदम आसान बनाया गया है।",
  },
  featuresTitle: { en: "More than a classifier", hi: "सिर्फ एक क्लासिफायर से कहीं ज़्यादा" },
  featuresSubtitle: {
    en: "A digital agricultural expert — not just a tech demo.",
    hi: "एक डिजिटल कृषि विशेषज्ञ — सिर्फ एक तकनीकी प्रदर्शन नहीं।",
  },
  ctaTitle: { en: "Ready when your crop needs help", hi: "जब भी फसल को मदद चाहिए, हम तैयार हैं" },
  ctaSubtitle: {
    en: "No login, no waiting. Upload a photo or speak your problem and get a diagnosis in moments.",
    hi: "कोई लॉगिन नहीं, कोई इंतज़ार नहीं। फोटो अपलोड करें या अपनी समस्या बोलें और कुछ ही पलों में निदान पाएं।",
  },
};

export default function Home() {
  const { language } = useDiagnosis();

  return (
    <>
      <section className="bg-hero-glow">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:pb-16 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal immediate>
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-leaf-dark">
                {T.eyebrow[language]}
              </p>
            </Reveal>
            <Reveal immediate delay={0.08}>
              <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-ink md:text-6xl">
                {language === "hi" ? (
                  <>
                    फसल की समस्या का निदान <span className="text-gradient-leaf">सेकंडों</span> में,
                    दिनों में नहीं।
                  </>
                ) : (
                  <>
                    Diagnose crop problems in <span className="text-gradient-leaf">seconds</span>, not
                    days.
                  </>
                )}
              </h1>
            </Reveal>
            <Reveal immediate delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                {T.heroSubtitle[language]}
              </p>
            </Reveal>
            <Reveal immediate delay={0.24}>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button to="/upload" variant="leaf" size="lg">
                  {T.diagnoseCta[language]}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="#how-it-works" variant="secondary" size="lg">
                  {T.seeHowItWorks[language]}
                </Button>
              </div>
            </Reveal>
            <Reveal immediate delay={0.32}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-2">
                  <Camera className="h-4 w-4" /> {T.photoDiagnosis[language]}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mic className="h-4 w-4" /> {T.voiceInput[language]}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Languages className="h-4 w-4" /> {T.localLanguage[language]}
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal immediate delay={0.4}>
            <img
              src="/images/hero.jpg"
              alt={T.heroImageAlt[language]}
              className="mx-auto mt-12 w-full max-w-5xl rounded-2xl"
            />
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-line-soft bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-serif text-3xl tracking-tight text-ink md:text-4xl">
              {T.howItWorksTitle[language]}
            </h2>
            <p className="mt-3 text-ink-soft">{T.howItWorksSubtitle[language]}</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.title.en} delay={i * 0.08}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-leaf-dark">
                  <step.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="mb-1 text-xs font-medium text-ink-muted">
                  {T.step[language]} {i + 1}
                </p>
                <h3 className="mb-2 text-lg font-semibold text-ink">{step.title[language]}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{step.body[language]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line-soft py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-serif text-3xl tracking-tight text-ink md:text-4xl">
              {T.galleryTitle[language]}
            </h2>
            <p className="mt-3 text-ink-soft">{T.gallerySubtitle[language]}</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {GALLERY.map((photo, i) => (
              <Reveal key={photo.label.en} delay={i * 0.08} className={photo.className}>
                <img
                  src={photo.src}
                  alt={photo.label[language]}
                  className="h-full w-full rounded-2xl object-cover"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-section-glow border-t border-line-soft py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-serif text-3xl tracking-tight text-ink md:text-4xl">
              {T.featuresTitle[language]}
            </h2>
            <p className="mt-3 text-ink-soft">{T.featuresSubtitle[language]}</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map((feature, i) => (
              <Reveal
                key={feature.title.en}
                delay={i * 0.08}
                className="rounded-2xl border border-line-soft bg-paper p-7 transition-colors hover:border-leaf/30"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${feature.tint}`}>
                  <feature.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ink">{feature.title[language]}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{feature.body[language]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line-soft py-16 md:py-20">
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-leaf-soft text-leaf-dark">
            <MapPin className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-serif text-3xl tracking-tight text-ink md:text-4xl">
            {T.ctaTitle[language]}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-soft">{T.ctaSubtitle[language]}</p>
          <div className="mt-7">
            <Button to="/upload" variant="leaf" size="lg">
              {T.diagnoseCta[language]}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
