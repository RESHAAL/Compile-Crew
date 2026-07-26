import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "bg-ink text-paper hover:bg-ink-soft border border-ink",
  secondary: "bg-paper text-ink border border-line hover:border-leaf/50 hover:text-leaf-dark",
  leaf: "bg-gradient-to-r from-leaf to-leaf-bright text-paper border border-transparent hover:opacity-90 shadow-sm shadow-leaf/20",
  ghost: "text-ink-soft hover:text-ink border border-transparent",
};

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const sizeClasses = size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm";
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${sizeClasses} ${VARIANTS[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  }
  const Component = as || "button";
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
