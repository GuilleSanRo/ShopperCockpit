import type { ComponentType, SVGProps } from "react";
import {
  SmtIcon,
  NavigatorIcon,
  LcvIcon,
  MacroToLocationIcon,
  PricerIcon,
  CheckingComIcon,
} from "@/components/Icons";

export interface DashboardCard {
  id: string;
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  actionType: "external_link" | "internal_route";
  href: string;
  newTab: boolean;
}

export const dashboardCards: DashboardCard[] = [
  {
    id: "smt",
    title: "SMT",
    description:
      "Daily data-checking web for tracking fieldwork, written offers, and data consistency.",
    Icon: SmtIcon,
    actionType: "external_link",
    href: "https://smt.promocar.es:8080/login.aspx",
    newTab: true,
  },
  {
    id: "360-navigator",
    title: "360 Navigator",
    description:
      "Client platform for viewing normalised data, scanned offers and Excel exports.",
    Icon: NavigatorIcon,
    actionType: "external_link",
    href: "https://www.promocar360navigator.com/login",
    newTab: true,
  },
  {
    id: "lcv-graphs",
    title: "LCV Graphs",
    description: "LCV ProOne PowerBI graphs in a simpler, better, user-friendly view.",
    Icon: LcvIcon,
    actionType: "external_link",
    href: "https://lcv-graphs-pricing-hub.vercel.app/",
    newTab: true,
  },
  {
    id: "macro-to-location",
    title: "MACRO TO LOCATION",
    description:
      "Generate the Location in Excel by uploading a Matrix file and selecting month/year.",
    Icon: MacroToLocationIcon,
    actionType: "internal_route",
    href: "/macro-to-location",
    newTab: false,
  },
  {
    id: "from-pricer-to-matrix",
    title: "FROM PRICER TO MATRIX",
    description:
      "Match Matrix versions against the PRICER and fill List Prices and UIDs automatically.",
    Icon: PricerIcon,
    actionType: "external_link",
    href: "https://matchwheels.lovable.app/",
    newTab: true,
  },
  {
    id: "checking-com",
    title: "CHECKING COM",
    description:
      "Enhance Checking COM files with pivots, checks, model-line separators and deviations.",
    Icon: CheckingComIcon,
    actionType: "internal_route",
    href: "/checking-com",
    newTab: false,
  },
];
