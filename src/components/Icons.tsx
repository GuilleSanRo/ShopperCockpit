import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 72,
  height: 72,
  viewBox: "0 0 72 72",
  fill: "none",
  stroke: "#10172A",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const BLUE = "#315CFF";

export function SmtIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="12" y="14" width="48" height="44" rx="1" />
      <line x1="12" y1="26" x2="60" y2="26" />
      <line x1="12" y1="38" x2="60" y2="38" />
      <line x1="12" y1="50" x2="60" y2="50" />
      <line x1="28" y1="14" x2="28" y2="58" />
      <line x1="44" y1="14" x2="44" y2="58" />
      <rect x="46" y="40" width="6" height="6" fill={BLUE} stroke={BLUE} />
    </svg>
  );
}

export function NavigatorIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="36" cy="36" r="20" />
      <path d="M22 30 Q28 22 36 22 Q44 22 50 30" />
      <path d="M22 42 Q28 50 36 50 Q44 50 50 42" />
      <path d="M36 16 L36 56" />
      <rect x="33" y="33" width="6" height="6" fill={BLUE} stroke={BLUE} />
    </svg>
  );
}

export function LcvIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 46 L8 30 L30 30 L38 22 L54 22 L54 46 Z" />
      <circle cx="20" cy="50" r="4" />
      <circle cx="46" cy="50" r="4" />
      <line x1="42" y1="58" x2="42" y2="46" />
      <line x1="50" y1="58" x2="50" y2="42" />
      <line x1="58" y1="58" x2="58" y2="38" />
      <rect x="55" y="35" width="6" height="6" fill={BLUE} stroke={BLUE} />
    </svg>
  );
}

export function MacroToLocationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="16" width="18" height="24" rx="1" />
      <line x1="12" y1="22" x2="22" y2="22" />
      <line x1="12" y1="28" x2="22" y2="28" />
      <line x1="12" y1="34" x2="18" y2="34" />
      <path d="M28 28 L40 28 M36 24 L40 28 L36 32" />
      <rect x="42" y="12" width="22" height="48" rx="1" />
      <line x1="46" y1="20" x2="60" y2="20" />
      <line x1="46" y1="28" x2="60" y2="28" />
      <line x1="46" y1="36" x2="60" y2="36" />
      <line x1="46" y1="44" x2="60" y2="44" />
      <rect x="46" y="50" width="6" height="6" fill={BLUE} stroke={BLUE} />
    </svg>
  );
}

export function PricerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="38" cy="38" r="18" />
      <circle cx="38" cy="38" r="4" fill={BLUE} stroke={BLUE} />
      <line x1="38" y1="20" x2="38" y2="56" />
      <line x1="20" y1="38" x2="56" y2="38" />
      <line x1="26" y1="26" x2="50" y2="50" />
      <line x1="50" y1="26" x2="26" y2="50" />
      <path d="M56 30 Q62 26 60 20 Q66 22 64 28 Q70 26 66 34" />
    </svg>
  );
}

export function CheckingComIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="12" y="12" width="48" height="48" rx="1" />
      <path d="M20 24 L24 28 L32 20" />
      <line x1="38" y1="24" x2="56" y2="24" />
      <path d="M20 40 L24 44 L32 36" />
      <line x1="38" y1="40" x2="56" y2="40" />
      <path d="M20 52 L28 60 M28 52 L20 60" stroke={BLUE} />
      <line x1="38" y1="56" x2="56" y2="56" />
    </svg>
  );
}
