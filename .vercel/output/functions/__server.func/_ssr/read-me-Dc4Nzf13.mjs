import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as trackEvent } from "./analytics-BWEQo677.mjs";
import { t as PageShell } from "./PageShell-DjMbovPC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/read-me-Dc4Nzf13.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		title: "SMT",
		body: "Opens the data-checking website in a new tab."
	},
	{
		title: "360 Navigator",
		body: "Opens the client platform in a new tab."
	},
	{
		title: "LCV Graphs",
		body: "Opens one client dashboard in a new tab."
	},
	{
		title: "Matrix to Location",
		body: "Upload Matrix, choose month/year, download Location file."
	},
	{
		title: "From Pricer to Matrix",
		body: "Opens the existing MatchWheels app."
	},
	{
		title: "Checking COM",
		body: "Upload Checking COM and download enhanced workbook."
	}
];
function ReadMe() {
	(0, import_react.useEffect)(() => trackEvent("read_me_opened", {}), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		title: "Read Me",
		subtitle: "This hub centralises the daily project webs and Excel automation Shopper tools in one place.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-4",
				children: sections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border p-5 bg-white",
					style: {
						borderColor: "#E1E4EE",
						borderRadius: 4
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm uppercase tracking-widest font-semibold",
						children: [
							i + 1,
							". ",
							s.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						style: { color: "var(--text-secondary)" },
						children: s.body
					})]
				}, s.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs italic border-l-4 pl-4 py-2",
				style: {
					borderColor: "var(--accent-blue)",
					color: "var(--text-secondary)"
				},
				children: "Excel tools process a copy of the uploaded file; the original file is never overwritten."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-block px-5 py-2 text-sm font-medium text-white",
					style: {
						backgroundColor: "var(--accent-blue)",
						borderRadius: 4
					},
					children: "Back to Dashboard"
				})
			})
		]
	});
}
//#endregion
export { ReadMe as component };
