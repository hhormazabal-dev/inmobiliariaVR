"use client";

import { CSSProperties, useEffect, useState } from "react";

type TypewriterHeadlineProps = {
  text: string;
  className?: string;
  duration?: number;
  startDelay?: number;
};

export default function TypewriterHeadline({
  text,
  className = "",
  duration = 4200,
  startDelay = 220,
}: TypewriterHeadlineProps) {
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => setHasFinished(true),
      startDelay + duration,
    );
    return () => clearTimeout(timeout);
  }, [duration, startDelay]);

  return (
    <h3
      className={`relative font-display leading-tight text-white drop-shadow-[0_18px_48px_rgba(4,8,18,0.65)] ${className}`}
      aria-label={text}
    >
      <span
        className="typewriter-shell"
        style={
          {
            ["--typewriter-duration" as string]: `${duration}ms`,
            ["--typewriter-delay" as string]: `${startDelay}ms`,
          } as CSSProperties
        }
      >
        <span className="typewriter-text" aria-hidden="true">
          {text}
        </span>
        <span className="sr-only">{text}</span>
        <span
          aria-hidden="true"
          className="typewriter-caret"
          style={{
            animation: hasFinished
              ? "caretPulse 1.4s ease-in-out infinite"
              : "caretPulse 0.9s steps(2,end) infinite",
            opacity: hasFinished ? 0.55 : 0.85,
          }}
        />
      </span>
    </h3>
  );
}
