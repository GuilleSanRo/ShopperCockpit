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
    description: "Data-checking web for tracking fieldwork, offers & coding.",
    Icon: SmtIcon,
    actionType: "external_link",
    href: "https://smt.promocar.es:8080/login.aspx",
    newTab: true,
  },
  {
    id: "360-navigator",
    title: "360 Navigator",
    description:
      "Client platform for viewing our data, scanned offers and Excel export.",
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
    id: "from-pricer-to-matrix",
    title: "FROM PRICER TO MATRIX",
    description: "Match PRICER with Matrix versions and get new MSRPs.",
    Icon: PricerIcon,
    actionType: "external_link",
    href: "https://matchwheels.lovable.app/",
    newTab: true,
  },
  {
    id: "macro-to-location",
    title: "MATRIX TO LOCATION",
    description: "Upload a Matrix file & get the Location in Excel.",
    Icon: MacroToLocationIcon,
    actionType: "internal_route",
    href: "/macro-to-location",
    newTab: false,
  },
  {
    id: "checking-com",
    title: "CHECKING COM 2.0",
    description: "Enhance it with pivots, checks, separators and std. Dev.",
    Icon: CheckingComIcon,
    actionType: "internal_route",
    href: "/checking-com",
    newTab: false,
  },
];
