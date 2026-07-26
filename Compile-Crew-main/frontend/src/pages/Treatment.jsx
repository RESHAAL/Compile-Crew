import { CalendarClock, TrendingDown, TrendingUp, MapPin, Camera, ClipboardList } from "lucide-react";
import { useDiagnosis } from "../context/DiagnosisContext";
import VoiceButton from "../components/VoiceButton";
import Button from "../components/Button";
import Reveal from "../components/Reveal";

const T = {
  noPlanTitle: { en: "No treatment plan yet", hi: "अभी तक कोई उपचार योजना नहीं" },
  noPlanBody: {
    en: "Get a diagnosis first, and we'll put together a day-wise treatment plan for you.",
    hi: "पहले निदान करवाएं, फिर हम आपके लिए दिन-वार उपचार योजना तैयार करेंगे।",
  },
  goToDiagnose: { en: "Go to Diagnose", hi: "निदान पर जाएं" },
  eyebrow: { en: "Treatment plan", hi: "उपचार योजना" },
  recoveryPlan: { en: "Your recovery plan", hi: "आपकी रिकवरी योजना" },
  listenToPlan: { en: "Listen to plan", hi: "योजना सुनें" },
  dayByDay: { en: "Day-by-day", hi: "दिन-प्रतिदिन" },
  ifUntreated: { en: "If left untreated", hi: "अगर इलाज नहीं किया गया" },
  estimatedLoss: { en: "Estimated crop loss", hi: "अनुमानित फसल नुकसान" },
  treatmentCost: { en: "Treatment cost", hi: "उपचार की लागत" },
  youSave: { en: "You save", hi: "आपकी बचत" },
  needSupplies: { en: "Need supplies?", hi: "सामान चाहिए?" },
  findStoreNear: { en: "Find an agri store near you", hi: "अपने पास कृषि दुकान खोजें" },
  findNearbyStores: { en: "Find nearby stores", hi: "नज़दीकी दुकानें खोजें" },
  notImproving: { en: "Not improving?", hi: "सुधार नहीं हो रहा?" },
  reuploadHint: {
    en: "Upload a new photo to re-check progress",
    hi: "प्रगति दोबारा जांचने के लिए नई फोटो अपलोड करें",
  },
  diagnoseAgain: { en: "Diagnose again", hi: "फिर से निदान करें" },
  speech: {
    diagnosisPrefix: { en: "Diagnosis:", hi: "निदान:" },
    hereIsPlan: { en: "Here is your treatment plan.", hi: "यह रही आपकी उपचार योजना।" },
    lossLine: {
      en: (currency, min, max, cost) =>
        `If left untreated, potential loss is between ${currency}${min} and ${currency}${max}. Treatment costs about ${currency}${cost}.`,
      hi: (currency, min, max, cost) =>
        `अगर इलाज नहीं किया गया, तो संभावित नुकसान ${currency}${min} से ${currency}${max} के बीच है। उपचार की लागत लगभग ${currency}${cost} है।`,
    },
  },
};

export default function Treatment() {
  const { treatmentPlan, prediction, language } = useDiagnosis();

  if (!treatmentPlan) {
    return (
      <section className="mx-auto max-w-xl px-6 py-16 text-center">
        <Reveal immediate>
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-leaf-soft text-leaf-dark">
            <ClipboardList className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h1 className="font-serif text-2xl text-ink">{T.noPlanTitle[language]}</h1>
          <p className="mt-3 text-ink-soft">{T.noPlanBody[language]}</p>
          <div className="mt-7">
            <Button to="/upload" variant="leaf">{T.goToDiagnose[language]}</Button>
          </div>
        </Reveal>
      </section>
    );
  }

  const { steps, costIfUntreated, treatmentCost, currency } = treatmentPlan;
  const savingsMin = costIfUntreated.min - treatmentCost;
  const savingsMax = costIfUntreated.max - treatmentCost;

  const speechText = [
    prediction ? `${T.speech.diagnosisPrefix[language]} ${prediction.name}.` : "",
    T.speech.hereIsPlan[language],
    ...steps.map((s) => `${s.day}: ${s.action}. ${s.detail}`),
    T.speech.lossLine[language](currency, costIfUntreated.min, costIfUntreated.max, treatmentCost),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="mx-auto max-w-2xl px-6 py-10 md:py-14">
      <Reveal immediate className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-leaf-dark">{T.eyebrow[language]}</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl">
          {prediction ? prediction.name : T.recoveryPlan[language]}
        </h1>
        <div className="mt-5 flex justify-center">
          <VoiceButton
            mode="speak"
            language={language}
            text={speechText}
            label={T.listenToPlan[language]}
          />
        </div>
      </Reveal>

      <Reveal immediate delay={0.08} className="rounded-2xl border border-line-soft p-6 md:p-8">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          <CalendarClock className="h-4 w-4" /> {T.dayByDay[language]}
        </h2>
        <ol className="relative space-y-6 border-l border-line-soft pl-6">
          {steps.map((step) => (
            <li key={step.day} className="relative">
              <span className="absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-paper bg-leaf" />
              <p className="text-xs font-semibold uppercase tracking-wider text-leaf-dark">{step.day}</p>
              <p className="mt-1 text-base font-medium text-ink">{step.action}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Reveal immediate delay={0.16} className="rounded-2xl border border-line-soft p-6">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-rust-soft text-rust">
            <TrendingDown className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{T.ifUntreated[language]}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {currency}
            {costIfUntreated.min.toLocaleString("en-IN")}–{costIfUntreated.max.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-sm text-ink-soft">{T.estimatedLoss[language]}</p>
        </Reveal>

        <Reveal immediate delay={0.22} className="rounded-2xl border border-leaf/30 bg-leaf-soft/40 p-6">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-leaf-soft text-leaf-dark">
            <TrendingUp className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{T.treatmentCost[language]}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {currency}
            {treatmentCost.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-sm font-medium text-leaf-dark">
            {T.youSave[language]} {currency}
            {savingsMin.toLocaleString("en-IN")}–{savingsMax.toLocaleString("en-IN")}
          </p>
        </Reveal>
      </div>

      <Reveal
        immediate
        delay={0.28}
        className="mt-5 flex flex-col gap-3 rounded-2xl border border-line-soft p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-muted">
            <MapPin className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{T.needSupplies[language]}</p>
            <p className="text-sm text-ink-soft">{T.findStoreNear[language]}</p>
          </div>
        </div>
        <Button
          href="https://www.google.com/maps/search/agriculture+store+near+me"
          variant="secondary"
        >
          {T.findNearbyStores[language]}
        </Button>
      </Reveal>

      <Reveal
        immediate
        delay={0.34}
        className="mt-5 flex flex-col gap-3 rounded-2xl border border-dashed border-line p-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-muted">
            <Camera className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{T.notImproving[language]}</p>
            <p className="text-sm text-ink-soft">{T.reuploadHint[language]}</p>
          </div>
        </div>
        <Button to="/upload" variant="secondary">
          {T.diagnoseAgain[language]}
        </Button>
      </Reveal>
    </section>
  );
}
