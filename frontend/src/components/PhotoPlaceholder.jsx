import { ImageIcon } from "lucide-react";

// A styled slot for real photography (farmers, fields, the app in use).
// Swap for an <img> once the team has photos — the caption is just a
// production note and won't render in the final design.
export default function PhotoPlaceholder({ label, className = "", iconClassName = "h-6 w-6" }) {
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-2xl bg-gradient-to-br from-leaf-soft via-canvas to-leaf-soft/60 ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-leaf-dark) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-leaf-dark/30">
        <ImageIcon className={iconClassName} strokeWidth={1.25} />
      </div>
      {label && (
        <span className="relative m-3 rounded-full bg-paper/80 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}
