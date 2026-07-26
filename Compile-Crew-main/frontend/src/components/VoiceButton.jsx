import { useEffect, useRef, useState } from "react";
import { Mic, Volume2, Square } from "lucide-react";

const LANG_CODES = { en: "en-IN", hi: "hi-IN" };

// Speech-to-text and text-to-speech via the browser's native Web Speech API.
// This works standalone today. Once the backend's Hindi voice pipeline
// (utils/voice.py) is live, `speak()` can be swapped for the /api/voice/tts
// endpoint without changing this component's public interface.
export default function VoiceButton({
  mode = "listen",
  language = "en",
  text = "",
  onTranscript,
  label,
  className = "",
}) {
  const [isActive, setIsActive] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (mode !== "listen") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = LANG_CODES[language] || "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      onTranscript?.(transcript);
    };
    recognition.onend = () => setIsActive(false);
    recognition.onerror = () => setIsActive(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, language]);

  useEffect(() => {
    if (mode !== "speak") return;
    if (!window.speechSynthesis) setSupported(false);
  }, [mode]);

  function handleListenClick() {
    if (!recognitionRef.current) return;
    if (isActive) {
      recognitionRef.current.stop();
      setIsActive(false);
    } else {
      recognitionRef.current.start();
      setIsActive(true);
    }
  }

  function handleSpeakClick() {
    if (!window.speechSynthesis) return;
    if (isActive) {
      window.speechSynthesis.cancel();
      setIsActive(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CODES[language] || "en-IN";
    utterance.onend = () => setIsActive(false);
    utterance.onerror = () => setIsActive(false);
    window.speechSynthesis.speak(utterance);
    setIsActive(true);
  }

  const handleClick = mode === "listen" ? handleListenClick : handleSpeakClick;
  const Icon = mode === "listen" ? Mic : isActive ? Square : Volume2;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!supported}
      title={!supported ? "Voice is not supported in this browser" : label}
      className={`group relative inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        isActive
          ? "border-leaf bg-leaf-soft text-leaf-dark"
          : "border-line bg-paper text-ink hover:border-ink-muted"
      } ${className}`}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        {isActive && mode === "listen" && (
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-leaf/40" />
        )}
        <Icon className="relative h-4 w-4" strokeWidth={2} />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}
