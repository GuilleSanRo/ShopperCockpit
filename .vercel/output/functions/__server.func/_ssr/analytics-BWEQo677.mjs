import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ShoppingCart } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-BWEQo677.js
var import_jsx_runtime = require_jsx_runtime();
function Header() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 bg-white border-b flex items-center px-6 md:px-10",
		style: {
			height: 64,
			borderColor: "#E4E7F0"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "text-2xl md:text-3xl font-extrabold tracking-tight text-foreground",
			style: { letterSpacing: "-0.02em" },
			children: "KANTAR"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "ml-auto flex items-center gap-6 md:gap-10 text-xs md:text-sm font-medium tracking-widest uppercase text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/read-me",
					className: "hover:text-[color:var(--accent-blue)] transition-colors",
					activeProps: { style: { color: "var(--accent-blue)" } },
					children: "Read Me"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/old-links",
					className: "hover:text-[color:var(--accent-blue)] transition-colors",
					activeProps: { style: { color: "var(--accent-blue)" } },
					children: "Old Links"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-[10px] tracking-wider text-muted-foreground",
					"aria-label": "Shopper",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, {
						className: "w-5 h-5",
						style: { color: "var(--accent-blue)" },
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SHOPPER" })]
				})
			]
		})]
	});
}
function trackEvent(name, properties = {}) {}
//#endregion
export { trackEvent as n, Header as t };
