import { FC } from "react";

/**
 * A small pulsing dot that scales/opacities with the live audio level, giving
 * visual confidence that audio is actually being captured. Level is 0..1.
 */
const AudioPulse: FC<{ level: number }> = ({ level }) => {
  // Map level to a lively but bounded radius + opacity.
  const scale = 0.6 + Math.min(1, level) * 0.9;
  const opacity = 0.4 + Math.min(1, level) * 0.6;
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className="inline-block"
      aria-hidden="true"
    >
      {/* outer ring pulses with level */}
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="currentColor"
        style={{
          transformOrigin: "center",
          transform: `scale(${scale})`,
          opacity: opacity * 0.35,
          transition: "transform 80ms linear, opacity 80ms linear",
        }}
      />
      {/* solid core */}
      <circle cx="7" cy="7" r="3" fill="currentColor" style={{ opacity }} />
    </svg>
  );
};

export default AudioPulse;
