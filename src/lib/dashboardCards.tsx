import type { ComponentType, SVGProps } from "react";
import {
  SmtIcon,
  NavigatorIcon,
  LcvIcon,
  MacroToLocationIcon,
  PricerIcon,
  CheckingComIcon,
  ModelListIcon,
  DatToolIcon,
  CarWebsIcon,
} from "@/components/Icons";

/** Pages that live inside this app and can be reached without leaving the site. */
export type InternalRoute = "/macro-to-location" | "/checking-com" | "/dat-tool";

interface DashboardCardBase {
  id: string;
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  newTab: boolean;
}

/**
 * A card either links to another website (external_link), opens one of our own
 * pages in the same tab (internal_route), or does nothing yet (none).
 *
 * The union keeps `internal_route` cards restricted to real in-app paths, so a
 * third-party URL can never end up behind an internal navigation again.
 */
export type DashboardCard = DashboardCardBase &
  (
    | { actionType: "external_link"; href: string }
    | { actionType: "internal_route"; href: InternalRoute }
    | { actionType: "none"; href: string }
  );

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
    newTab: true,
  },
  {
    id: "checking-com",
    title: "CHECKING COM 2.0",
    description: "Enhance it with pivots, checks, separators and std. Dev.",
    Icon: CheckingComIcon,
    actionType: "internal_route",
    href: "/checking-com",
    newTab: true,
  },
  {
    id: "model-list",
    title: "MODEL LIST",
    description: "List of promoCAR models for Model Code and Segments.",
    Icon: ModelListIcon,
    actionType: "external_link",
    href: "https://ktglbuc.sharepoint.com/:x:/r/sites/cdp-promocar/spain/promocar/_layouts/15/Doc.aspx?sourcedoc=%7B2AAF4C4D-2F0A-4C0C-92DB-22119B698CBF%7D&file=Models%20List%20(Codes).xlsx&action=default&mobileredirect=true",
    newTab: true,
  },
  {
    id: "dat-tool",
    title: "DAT TOOL",
    description: "To search Residual Values and Guaranteed Future Values.",
    Icon: DatToolIcon,
    // Opens our own DAT page in the same tab, exactly like MATRIX TO LOCATION.
    actionType: "internal_route",
    href: "/dat-tool",
    newTab: true,
  },
  {
    id: "car-webs",
    title: "CAR WEBS",
    description: "Links to consult information of vehicles in internet.",
    Icon: CarWebsIcon,
    actionType: "none",
    href: "",
    newTab: false,
  },
];
