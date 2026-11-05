import { Link } from "@tanstack/react-router";
import type { DashboardCard } from "@/lib/dashboardCards";
import { trackEvent } from "@/lib/analytics";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

interface Props {
  card: DashboardCard;
}

const tileClass =
  "group cursor-pointer border transition-all duration-[250ms] ease-out outline-none focus-visible:ring-2";

const tileStyle = {
  backgroundColor: "var(--surface)",
  borderColor: "#E1E4EE",
  borderRadius: 4,
  padding: 32,
  minHeight: 260,
  display: "block",
  width: "100%",
  textAlign: "left" as const,
  textDecoration: "none",
  "--tw-ring-color": "var(--accent-blue)",
} as const;

const hoverHandlers = {
  onMouseEnter: (e: ReactMouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = "var(--surface-hover)";
    e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
    e.currentTarget.style.boxShadow = "0 12px 28px -12px rgba(49, 92, 255, 0.35)";
  },
  onMouseLeave: (e: ReactMouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = "var(--surface)";
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = "";
  },
};

export function DashboardCardTile({ card }: Props) {
  const { Icon } = card;

  const track = () => {
    trackEvent("dashboard_card_clicked", { id: card.id });
    if (card.actionType === "external_link") {
      trackEvent("external_link_opened", { id: card.id, href: card.href });
    }
  };

  const content: ReactNode = (
    <div className="flex flex-col h-full">
      <Icon />
      <h3 className="mt-6 text-lg font-semibold tracking-wider uppercase text-foreground">
        {card.title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {card.description}
      </p>
    </div>
  );

  // External links are real anchors so the browser performs a normal top-level
  // navigation in a new tab (same as pasting the URL). Opening them through
  // window.open() made them popup-style navigations, which some sites (e.g. DAT)
  // answer with a challenge page instead of the real app.
  if (card.actionType === "external_link") {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={track}
        {...hoverHandlers}
        aria-label={`${card.title}. ${card.description}`}
        className={tileClass}
        style={tileStyle}
      >
        {content}
      </a>
    );
  }

  // In-app pages are rendered as a router <Link>, i.e. a real anchor pointing at
  // our own path (e.g. "/dat-tool"). Clicking it stays in this tab and can never
  // navigate away to a third-party site.
  if (card.actionType === "internal_route") {
    return (
      <Link
        to={card.href}
        onClick={track}
        {...hoverHandlers}
        aria-label={`${card.title}. ${card.description}`}
        className={tileClass}
        style={tileStyle}
      >
        {content}
      </Link>
    );
  }

  // actionType === "none" → no-op (coming soon)
  return (
    <div
      aria-label={`${card.title}. ${card.description}`}
      {...hoverHandlers}
      className={tileClass}
      style={tileStyle}
    >
      {content}
    </div>
  );
}
