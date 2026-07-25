import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// `immediate` animates on mount (for above-the-fold content on page load).
// Otherwise it animates once when scrolled into view.
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 16,
  immediate = false,
  className = "",
}) {
  const Component = motion[as] || motion.div;
  const visibility = immediate
    ? { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
      };

  return (
    <Component
      {...visibility}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}
