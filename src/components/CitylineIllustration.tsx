import { useId } from "react";

type CitylineIllustrationProps = {
  className?: string;
  variant?: "sleek" | "dense";
  orientation?: "left" | "right";
};

const toPath = (commands: Array<[string, number, number]>) =>
  commands.map(([cmd, x, y]) => `${cmd}${x} ${y}`).join(" ");

const outlines: Record<Required<CitylineIllustrationProps>["variant"], string> =
  {
    sleek: toPath([
      ["M", 0, 54],
      ["L", 0, 44],
      ["L", 4, 40],
      ["L", 8, 44],
      ["L", 8, 54],
      ["L", 14, 54],
      ["L", 14, 30],
      ["L", 24, 30],
      ["L", 24, 54],
      ["L", 30, 54],
      ["L", 30, 36],
      ["L", 36, 30],
      ["L", 42, 36],
      ["L", 42, 54],
      ["L", 50, 54],
      ["L", 50, 28],
      ["L", 60, 28],
      ["L", 60, 54],
      ["L", 66, 54],
      ["L", 66, 32],
      ["L", 72, 26],
      ["L", 78, 32],
      ["L", 78, 54],
      ["L", 86, 54],
      ["L", 86, 34],
      ["L", 92, 30],
      ["L", 98, 34],
      ["L", 98, 54],
      ["L", 106, 54],
      ["L", 106, 44],
      ["L", 110, 40],
      ["L", 114, 44],
      ["L", 114, 54],
      ["L", 128, 54],
    ]),
    dense: toPath([
      ["M", 0, 54],
      ["L", 0, 42],
      ["L", 3, 38],
      ["L", 6, 42],
      ["L", 6, 54],
      ["L", 10, 54],
      ["L", 10, 32],
      ["L", 16, 32],
      ["L", 16, 28],
      ["L", 20, 28],
      ["L", 20, 54],
      ["L", 26, 54],
      ["L", 26, 38],
      ["L", 31, 33],
      ["L", 36, 38],
      ["L", 36, 54],
      ["L", 42, 54],
      ["L", 42, 30],
      ["L", 50, 30],
      ["L", 50, 24],
      ["L", 56, 24],
      ["L", 56, 54],
      ["L", 62, 54],
      ["L", 62, 34],
      ["L", 68, 28],
      ["L", 74, 34],
      ["L", 74, 54],
      ["L", 80, 54],
      ["L", 80, 40],
      ["L", 85, 34],
      ["L", 90, 40],
      ["L", 90, 54],
      ["L", 98, 54],
      ["L", 98, 32],
      ["L", 106, 32],
      ["L", 106, 54],
      ["L", 112, 54],
      ["L", 112, 44],
      ["L", 116, 40],
      ["L", 120, 44],
      ["L", 120, 54],
      ["L", 128, 54],
    ]),
  };

const verticalDetails: Record<
  Required<CitylineIllustrationProps>["variant"],
  Array<{ x: number; y1: number; y2: number; dash?: string }>
> = {
  sleek: [
    { x: 18, y1: 30, y2: 54, dash: "1.4 2" },
    { x: 34, y1: 31, y2: 54, dash: "1.2 2" },
    { x: 38, y1: 36, y2: 54, dash: "1.6 2" },
    { x: 55, y1: 28, y2: 54, dash: "1.4 2.2" },
    { x: 70, y1: 27, y2: 54, dash: "1.6 2.4" },
    { x: 82, y1: 34, y2: 54, dash: "1.4 2" },
    { x: 94, y1: 30, y2: 54, dash: "1.3 2.2" },
    { x: 108, y1: 40, y2: 54 },
  ],
  dense: [
    { x: 13, y1: 32, y2: 54, dash: "1.2 2" },
    { x: 23, y1: 28, y2: 54, dash: "1.4 2.1" },
    { x: 28, y1: 38, y2: 54, dash: "1.1 2" },
    { x: 46, y1: 30, y2: 54, dash: "1.5 2.2" },
    { x: 59, y1: 24, y2: 54, dash: "1.4 2.4" },
    { x: 66, y1: 28, y2: 54, dash: "1.2 2" },
    { x: 78, y1: 40, y2: 54, dash: "1.3 2.1" },
    { x: 88, y1: 34, y2: 54, dash: "1.5 2" },
    { x: 102, y1: 32, y2: 54, dash: "1.2 2.1" },
    { x: 114, y1: 40, y2: 54 },
  ],
};

const horizontalDetails: Record<
  Required<CitylineIllustrationProps>["variant"],
  Array<{ x1: number; x2: number; y: number }>
> = {
  sleek: [
    { x1: 16, x2: 22, y: 40 },
    { x1: 31, x2: 41, y: 44 },
    { x1: 32, x2: 38, y: 48 },
    { x1: 52, x2: 58, y: 42 },
    { x1: 68, x2: 76, y: 38 },
    { x1: 70, x2: 78, y: 46 },
    { x1: 88, x2: 96, y: 42 },
    { x1: 105, x2: 112, y: 46 },
  ],
  dense: [
    { x1: 8, x2: 18, y: 44 },
    { x1: 24, x2: 32, y: 36 },
    { x1: 44, x2: 54, y: 38 },
    { x1: 45, x2: 55, y: 46 },
    { x1: 66, x2: 74, y: 42 },
    { x1: 82, x2: 90, y: 40 },
    { x1: 100, x2: 108, y: 44 },
  ],
};

export default function CitylineIllustration({
  className,
  variant = "sleek",
  orientation = "left",
}: CitylineIllustrationProps) {
  const uid = useId().replace(/[^a-z0-9-]/gi, "");
  const outlineId = `${uid}-outline`;
  const accentId = `${uid}-accent`;
  const detailColor = "rgba(237,201,103,0.32)";
  const detailSoft = "rgba(237,201,103,0.24)";

  const transform =
    orientation === "right" ? "scale(-1,1) translate(-128,0)" : undefined;

  return (
    <svg
      viewBox="0 0 128 60"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient
          id={outlineId}
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="rgba(237,201,103,0.9)" />
          <stop offset="1" stopColor="rgba(237,201,103,0.5)" />
        </linearGradient>
        <linearGradient
          id={accentId}
          x1="0"
          y1="0"
          x2="128"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="rgba(237,201,103,0.38)" />
          <stop offset="1" stopColor="rgba(237,201,103,0.18)" />
        </linearGradient>
      </defs>

      <g
        opacity={0.88}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={transform}
      >
        <path
          d={outlines[variant]}
          stroke={`url(#${outlineId})`}
          strokeWidth={0.9}
        />
        <path d="M0 54 H128" stroke={`url(#${accentId})`} strokeWidth={0.7} />

        {verticalDetails[variant].map(({ x, y1, y2, dash }) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1={y1}
            x2={x}
            y2={y2}
            stroke={detailColor}
            strokeWidth={0.55}
            strokeDasharray={dash}
          />
        ))}

        {horizontalDetails[variant].map(({ x1, x2, y }, idx) => (
          <line
            key={`h-${x1}-${idx}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y - 0.4}
            stroke={idx % 2 === 0 ? detailColor : detailSoft}
            strokeWidth={0.5}
          />
        ))}
      </g>
    </svg>
  );
}
