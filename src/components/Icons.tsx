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
      {/* Back document sheet */}
      <path d="M19 23 L25 23 C26.1 23 27 23.9 27 25 L27 47 C27 48.1 26.1 49 25 49 L19 49" stroke="#10172A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      {/* Lines / dashes on back sheet */}
      <line x1="21.5" y1="30" x2="24.5" y2="30" stroke="#10172A" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="21.5" y1="36" x2="24.5" y2="36" stroke="#10172A" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="21.5" y1="42" x2="24.5" y2="42" stroke="#10172A" strokeWidth="1.25" strokeLinecap="round" />

      {/* Front Excel booklet tile with perspective */}
      <polygon points="7,24 19,21 19,51 7,48" fill="#FFFFFF" stroke="#10172A" strokeWidth="1.25" strokeLinejoin="round" />

      {/* Blue X mark on front tile */}
      <path d="M10.5 32 L15.5 40 M15.5 32 L10.5 40" stroke={BLUE} strokeWidth="1.75" strokeLinecap="round" />

      {/* Blue right-pointing arrow with balanced breathing room on left (x=33) and right (x=41) */}
      <path d="M33 36 L41 36 M38 33 L41 36 L38 39" stroke={BLUE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Google Maps style location pin (x=47 to 63) - separated from arrow */}
      <path d="M63 32 a8 8 0 1 0 -16 0 c0 7 8 16 8 16 s8 -9 8 -16 Z" stroke="#10172A" strokeWidth="1.25" fill="none" strokeLinejoin="round" />
      <circle cx="55" cy="32" r="2.8" fill={BLUE} stroke={BLUE} />
    </svg>
  );
}

/**
 * FROM PRICER TO MATRIX — a flashlight (spotlight on prices) on the left, arrow,
 * then the same Excel booklet with a blue X used by MATRIX TO LOCATION (matrix = X).
 */
export function PricerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Flashlight, tilted so it "points" up-right toward the matrix */}
      <g transform="rotate(-38 16 34)">
        {/* Head / lens barrel */}
        <path d="M10.5 21.5 L21.5 21.5 L20 30 L12 30 Z" fill="#FFFFFF" />
        <line x1="11.8" y1="24.2" x2="20.2" y2="24.2" />
        {/* Body */}
        <rect x="12" y="30" width="8" height="15" rx="1.5" fill="#FFFFFF" />
        {/* Tail cap seam */}
        <line x1="12" y1="41.5" x2="20" y2="41.5" />
        {/* Switch */}
        <circle cx="16" cy="34" r="1.6" />
      </g>

      {/* Blue right-pointing arrow, centred like the MATRIX TO LOCATION one */}
      <path
        d="M31 36 L39 36 M36 33 L39 36 L36 39"
        stroke={BLUE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Back document sheet of the matrix booklet */}
      <path d="M57 23 L63 23 C64.1 23 65 23.9 65 25 L65 47 C65 48.1 64.1 49 63 49 L57 49" />
      <line x1="59.5" y1="30" x2="62.5" y2="30" />
      <line x1="59.5" y1="36" x2="62.5" y2="36" />
      <line x1="59.5" y1="42" x2="62.5" y2="42" />

      {/* Front Excel booklet tile with perspective */}
      <polygon points="45,24 57,21 57,51 45,48" fill="#FFFFFF" />

      {/* Blue X mark on the matrix tile */}
      <path
        d="M48.5 32 L53.5 40 M53.5 32 L48.5 40"
        stroke={BLUE}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
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

/** MODEL LIST — paper with 2-column item list */
export function ModelListIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Paper / document */}
      <rect x="12" y="10" width="48" height="54" rx="2" />
      {/* Column divider */}
      <line x1="36" y1="20" x2="36" y2="56" />
      {/* Row 1 - left blue, right normal */}
      <line x1="16" y1="30" x2="32" y2="30" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="40" y1="30" x2="56" y2="30" strokeLinecap="round" />
      {/* Row 2 */}
      <line x1="16" y1="38" x2="32" y2="38" strokeLinecap="round" />
      <line x1="40" y1="38" x2="56" y2="38" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" />
      {/* Row 3 */}
      <line x1="16" y1="46" x2="32" y2="46" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="40" y1="46" x2="56" y2="46" strokeLinecap="round" />
    </svg>
  );
}

/** DAT TOOL — car side silhouette + "RV / GFV" text above */
export function DatToolIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* "RV / GFV" label */}
      <text
        x="36"
        y="16"
        textAnchor="middle"
        fontSize="8"
        fontFamily="sans-serif"
        fontWeight="700"
        fill={BLUE}
        stroke="none"
        strokeWidth="0"
      >RV / GFV</text>
      {/* Car body side silhouette */}
      <path d="M8 50 L8 42 Q8 36 14 36 L20 36 L28 24 L48 24 L56 36 L62 36 Q66 36 66 42 L66 50 Z" />
      {/* Windshield */}
      <path d="M28 24 L23 36 L44 36 L42 24 Z" fill="#FFFFFF" />
      {/* Rear window */}
      <path d="M42 24 L48 24 L56 36 L44 36 Z" fill="#FFFFFF" />
      {/* Wheels */}
      <circle cx="22" cy="50" r="7" fill="#FFFFFF" />
      <circle cx="22" cy="50" r="2.8" fill={BLUE} stroke={BLUE} />
      <circle cx="54" cy="50" r="7" fill="#FFFFFF" />
      <circle cx="54" cy="50" r="2.8" fill={BLUE} stroke={BLUE} />
    </svg>
  );
}

/** CAR WEBS — globe with meridians, parallels and a blue centre dot */
export function CarWebsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Outer circle */}
      <circle cx="36" cy="36" r="22" />
      {/* Vertical meridian ellipse */}
      <ellipse cx="36" cy="36" rx="10" ry="22" />
      {/* Horizontal parallels */}
      <line x1="14" y1="24" x2="58" y2="24" />
      <line x1="14" y1="36" x2="58" y2="36" />
      <line x1="14" y1="48" x2="58" y2="48" />
      {/* Blue accent dot at centre */}
      <circle cx="36" cy="36" r="3" fill={BLUE} stroke={BLUE} strokeWidth="0" />
    </svg>
  );
}
