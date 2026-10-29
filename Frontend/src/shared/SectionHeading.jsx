import { Reveal, Wipe } from "./motion";

const SIZES = {
  section: "text-4xl md:text-5xl",
  hero: "text-5xl md:text-7xl",
};

const TONES = {
  light: {
    title: "text-neutral-950",
    muted: "text-neutral-800",
    body: "text-neutral-600",
  },
  dark: {
    title: "text-white",
    muted: "text-white/60",
    body: "text-white/70",
  },
};

export const Eyebrow = ({ children, className = "text-[#f05a1a]" }) => (
  <p className={`text-[11px] font-bold uppercase tracking-wide ${className}`}>
    <span aria-hidden="true">// </span>
    {children}
  </p>
);

/**
 * The one heading style used by every section:
 *   // EYEBROW
 *   Lead lines in the main colour
 *   muted lines in the softer colour
 *   optional body copy
 */
const SectionHeading = ({
  id,
  level: Level = "h2",
  size = "section",
  tone = "light",
  align = "left",
  eyebrow,
  eyebrowClassName,
  lead = [],
  muted = [],
  body,
  bodyClassName,
  delay = 0,
  className = "",
}) => {
  const t = TONES[tone];
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <Reveal delay={delay}>
          <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>
        </Reveal>
      )}

      <Level
        id={id}
        className={`${eyebrow ? "mt-4" : ""} font-bold leading-[1.05] tracking-tighter ${SIZES[size]} ${t.title}`}
      >
        {lead.map((line, i) => (
          <Wipe key={line} delay={delay + 0.1 + i * 0.12} className="block">
            {line}
          </Wipe>
        ))}
        {muted.map((line, i) => (
          <Wipe
            key={line}
            delay={delay + 0.1 + (lead.length + i) * 0.12}
            className={`block ${t.muted}`}
          >
            {line}
          </Wipe>
        ))}
      </Level>

      {body && (
        <Reveal
          as="p"
          delay={delay + 0.5}
          className={`mt-5 max-w-sm text-sm leading-relaxed ${bodyClassName ?? t.body} ${
            centered ? "mx-auto" : ""
          }`}
        >
          {body}
        </Reveal>
      )}
    </div>
  );
};

export default SectionHeading;
