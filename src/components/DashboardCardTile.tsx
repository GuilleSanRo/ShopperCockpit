import { useNavigate } from "@tanstack/react-router";
import type { DashboardCard } from "@/lib/dashboardCards";
import { trackEvent } from "@/lib/analytics";
import type { KeyboardEvent } from "react";

interface Props {
  card: DashboardCard;
}

export function DashboardCardTile({ card }: Props) {
  const navigate = useNavigate();
  const { Icon } = card;

  const activate = () => {
    trackEvent("dashboard_card_clicked", { id: card.id });
    if (card.actionType === "external_link") {
      trackEvent("external_link_opened", { id: card.id, href: card.href });
      window.open(card.href, "_blank", "noopener,noreferrer");
    } else {
      navigate({ to: card.href });
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={onKey}
      aria-label={`${card.title}. ${card.description}`}
      className="group cursor-pointer border transition-all duration-[250ms] ease-out outline-none focus-visible:ring-2"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "#E1E4EE",
        borderRadius: 4,
        padding: 32,
        minHeight: 300,
        // @ts-expect-error css var
        "--tw-ring-color": "var(--accent-blue)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--surface-hover)";
        e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
        e.currentTarget.style.boxShadow = "0 12px 28px -12px rgba(49, 92, 255, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--surface)";
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div className="flex flex-col h-full">
        <Icon />
        <h3 className="mt-6 text-lg font-semibold tracking-wider uppercase text-foreground">
          {card.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {card.description}
        </p>
      </div>
    </div>
  );
}
