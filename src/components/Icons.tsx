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
      <rect x="14" y="16" width="44" height="40" rx="2" />
      <line x1="14" y1="26" x2="58" y2="26" />
      <rect x="21" y="44" width="6" height="6" fill={BLUE} stroke={BLUE} />
      <rect x="33" y="38" width="6" height="12" fill="none" />
      <rect x="45" y="32" width="6" height="18" fill="none" />
      <path d="M24 36 L36 30 L48 22" />
      <circle cx="48" cy="22" r="2.5" fill={BLUE} stroke={BLUE} />
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
      <polyline points="14,52 14,20" />
      <polyline points="14,52 58,52" />
      <polyline points="20,44 30,34 40,40 54,24" />
      <circle cx="30" cy="34" r="2.5" />
      <circle cx="40" cy="40" r="2.5" />
      <rect x="51" y="21" width="6" height="6" fill={BLUE} stroke={BLUE} />
    </svg>
  );
}

export function MacroToLocationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="12" y="18" width="20" height="26" rx="2" />
      <line x1="12" y1="26" x2="32" y2="26" />
      <line x1="22" y1="26" x2="22" y2="44" />
      <path d="M36 31 L48 31 M44 27 L48 31 L44 35" stroke={BLUE} />
      <path d="M54 34 a8 8 0 1 0 -16 0 c0 7 8 16 8 16 s8 -9 8 -16 Z" transform="translate(6,0)" />
      <circle cx="52" cy="34" r="3" fill={BLUE} stroke={BLUE} />
    </svg>
  );
}

export function PricerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="36" cy="36" r="18" />
      <circle cx="36" cy="36" r="4" fill={BLUE} stroke={BLUE} />
      <line x1="36" y1="18" x2="36" y2="54" />
      <line x1="18" y1="36" x2="54" y2="36" />
      <line x1="24" y1="24" x2="48" y2="48" />
      <line x1="48" y1="24" x2="24" y2="48" />
    </svg>
  );
}

export function CheckingComIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="16" y="12" width="40" height="48" rx="2" />
      <line x1="24" y1="24" x2="48" y2="24" />
      <line x1="24" y1="34" x2="48" y2="34" />
      <line x1="24" y1="44" x2="38" y2="44" />
      <circle cx="46" cy="48" r="11" fill="#FFFFFF" />
      <path d="M41 48 L45 52 L52 44" stroke={BLUE} strokeWidth="2" />
    </svg>
  );
}

