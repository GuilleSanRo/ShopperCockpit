import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Header } from "./analytics-BWEQo677.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PageShell-DjMbovPC.js
var import_jsx_runtime = require_jsx_runtime();
function PageShell({ title, subtitle, children, showBack = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-5xl mx-auto px-6 md:px-10 py-10",
			children: [
				showBack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2 text-xs uppercase tracking-widest mb-6 hover:text-[color:var(--accent-blue)]",
					style: { color: "var(--text-secondary)" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "w-4 h-4",
						"aria-hidden": true
					}), " Back to Dashboard"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl md:text-4xl font-bold tracking-tight text-foreground",
					children: title
				}),
				subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base",
					style: { color: "var(--text-secondary)" },
					children: subtitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children
				})
			]
		})]
	});
}
//#endregion
export { PageShell as t };
