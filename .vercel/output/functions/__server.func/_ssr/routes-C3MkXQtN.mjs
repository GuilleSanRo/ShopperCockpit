import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as trackEvent, t as Header } from "./analytics-BWEQo677.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C3MkXQtN.js
var import_jsx_runtime = require_jsx_runtime();
function DashboardCardTile({ card }) {
	const navigate = useNavigate();
	const { Icon } = card;
	const activate = () => {
		trackEvent("dashboard_card_clicked", { id: card.id });
		if (card.actionType === "external_link") {
			trackEvent("external_link_opened", {
				id: card.id,
				href: card.href
			});
			window.open(card.href, "_blank", "noopener,noreferrer");
		} else navigate({ to: card.href });
	};
	const onKey = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			activate();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "button",
		tabIndex: 0,
		onClick: activate,
		onKeyDown: onKey,
		"aria-label": `${card.title}. ${card.description}`,
		className: "group cursor-pointer border transition-all duration-[250ms] ease-out outline-none focus-visible:ring-2",
		style: {
			backgroundColor: "var(--surface)",
			borderColor: "#E1E4EE",
			borderRadius: 4,
			padding: 32,
			minHeight: 300,
			"--tw-ring-color": "var(--accent-blue)"
		},
		onMouseEnter: (e) => {
			e.currentTarget.style.backgroundColor = "var(--surface-hover)";
			e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
			e.currentTarget.style.boxShadow = "0 12px 28px -12px rgba(49, 92, 255, 0.35)";
		},
		onMouseLeave: (e) => {
			e.currentTarget.style.backgroundColor = "var(--surface)";
			e.currentTarget.style.transform = "";
			e.currentTarget.style.boxShadow = "";
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col h-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-6 text-lg font-semibold tracking-wider uppercase text-foreground",
					children: card.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed",
					style: { color: "var(--text-secondary)" },
					children: card.description
				})
			]
		})
	});
}
var base = {
	width: 72,
	height: 72,
	viewBox: "0 0 72 72",
	fill: "none",
	stroke: "#10172A",
	strokeWidth: 1.25,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": true
};
var BLUE = "#315CFF";
function SmtIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...base,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14",
				y: "16",
				width: "44",
				height: "40",
				rx: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "14",
				y1: "26",
				x2: "58",
				y2: "26"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "21",
				y: "44",
				width: "6",
				height: "6",
				fill: BLUE,
				stroke: BLUE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "33",
				y: "38",
				width: "6",
				height: "12",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "45",
				y: "32",
				width: "6",
				height: "18",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M24 36 L36 30 L48 22" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "48",
				cy: "22",
				r: "2.5",
				fill: BLUE,
				stroke: BLUE
			})
		]
	});
}
function NavigatorIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...base,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "36",
				cy: "36",
				r: "20"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22 30 Q28 22 36 22 Q44 22 50 30" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22 42 Q28 50 36 50 Q44 50 50 42" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M36 16 L36 56" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "33",
				y: "33",
				width: "6",
				height: "6",
				fill: BLUE,
				stroke: BLUE
			})
		]
	});
}
function LcvIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...base,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "14,52 14,20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "14,52 58,52" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "20,44 30,34 40,40 54,24" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "30",
				cy: "34",
				r: "2.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "40",
				cy: "40",
				r: "2.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "51",
				y: "21",
				width: "6",
				height: "6",
				fill: BLUE,
				stroke: BLUE
			})
		]
	});
}
function MacroToLocationIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...base,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "12",
				y: "25",
				width: "19",
				height: "20",
				rx: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "12",
				y1: "31",
				x2: "31",
				y2: "31"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "19",
				y1: "25",
				x2: "19",
				y2: "45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "25",
				y1: "31",
				x2: "25",
				y2: "45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "19",
				y1: "38",
				x2: "31",
				y2: "38"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M14 30 L17 40 M17 30 L14 40",
				stroke: BLUE,
				strokeWidth: "1.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M34 35 L42 35 M39 31 L42 35 L39 39",
				stroke: BLUE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M59 33 a7 7 0 1 0 -14 0 c0 6 7 14 7 14 s7 -8 7 -14 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "52",
				cy: "33",
				r: "2.2",
				fill: BLUE,
				stroke: BLUE
			})
		]
	});
}
function PricerIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...base,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "36",
				cy: "36",
				r: "18"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "36",
				cy: "36",
				r: "4",
				fill: BLUE,
				stroke: BLUE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "36",
				y1: "18",
				x2: "36",
				y2: "54"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "18",
				y1: "36",
				x2: "54",
				y2: "36"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "24",
				y1: "24",
				x2: "48",
				y2: "48"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "48",
				y1: "24",
				x2: "24",
				y2: "48"
			})
		]
	});
}
function CheckingComIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...base,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "16",
				y: "12",
				width: "40",
				height: "48",
				rx: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "24",
				y1: "24",
				x2: "48",
				y2: "24"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "24",
				y1: "34",
				x2: "48",
				y2: "34"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "24",
				y1: "44",
				x2: "38",
				y2: "44"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "46",
				cy: "48",
				r: "11",
				fill: "#FFFFFF"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M41 48 L45 52 L52 44",
				stroke: BLUE,
				strokeWidth: "2"
			})
		]
	});
}
var dashboardCards = [
	{
		id: "smt",
		title: "SMT",
		description: "Daily data-checking web for tracking fieldwork, written offers, and data consistency.",
		Icon: SmtIcon,
		actionType: "external_link",
		href: "https://smt.promocar.es:8080/login.aspx",
		newTab: true
	},
	{
		id: "360-navigator",
		title: "360 Navigator",
		description: "Client platform for viewing normalised data, scanned offers and Excel exports.",
		Icon: NavigatorIcon,
		actionType: "external_link",
		href: "https://www.promocar360navigator.com/login",
		newTab: true
	},
	{
		id: "lcv-graphs",
		title: "LCV Graphs",
		description: "LCV ProOne PowerBI graphs in a simpler, better, user-friendly view.",
		Icon: LcvIcon,
		actionType: "external_link",
		href: "https://lcv-graphs-pricing-hub.vercel.app/",
		newTab: true
	},
	{
		id: "macro-to-location",
		title: "MATRIX TO LOCATION",
		description: "Generate the Location in Excel by uploading a Matrix file and selecting month/year.",
		Icon: MacroToLocationIcon,
		actionType: "internal_route",
		href: "/macro-to-location",
		newTab: false
	},
	{
		id: "from-pricer-to-matrix",
		title: "FROM PRICER TO MATRIX",
		description: "Match Matrix versions against the PRICER and fill List Prices and UIDs automatically.",
		Icon: PricerIcon,
		actionType: "external_link",
		href: "https://matchwheels.lovable.app/",
		newTab: true
	},
	{
		id: "checking-com",
		title: "CHECKING COM",
		description: "Enhance Checking COM files with pivots, checks, model-line separators and deviations.",
		Icon: CheckingComIcon,
		actionType: "internal_route",
		href: "/checking-com",
		newTab: false
	}
];
function Dashboard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen overflow-x-hidden pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "grid gap-px border-t border-b",
			style: {
				borderColor: "#E1E4EE",
				backgroundColor: "#E1E4EE",
				gridTemplateColumns: "repeat(1, minmax(0, 1fr))"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "contents md:hidden",
					children: dashboardCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardCardTile, { card: c }, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:grid lg:hidden col-span-full grid-cols-2 gap-px",
					style: { backgroundColor: "#E1E4EE" },
					children: dashboardCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardCardTile, { card: c }, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden lg:grid col-span-full grid-cols-3 gap-px",
					style: { backgroundColor: "#E1E4EE" },
					children: dashboardCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardCardTile, { card: c }, c.id))
				})
			]
		})]
	});
}
//#endregion
export { Dashboard as component };
