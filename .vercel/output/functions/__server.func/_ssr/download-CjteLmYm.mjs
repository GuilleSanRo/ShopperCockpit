import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as CloudUpload, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/download-CjteLmYm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FileDropzone({ file, onFile, disabled, accept = ".xlsx,.xlsm,.xls" }) {
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	const onDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		if (disabled) return;
		const f = e.dataTransfer.files?.[0];
		if (f) onFile(f);
	};
	const sanitize = (name) => name.replace(/[<>]/g, "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: () => !disabled && inputRef.current?.click(),
		onDragOver: (e) => {
			e.preventDefault();
			if (!disabled) setDragOver(true);
		},
		onDragLeave: () => setDragOver(false),
		onDrop,
		className: "border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
		style: {
			borderColor: dragOver ? "var(--accent-blue)" : "#E1E4EE",
			backgroundColor: dragOver ? "var(--surface-hover)" : "var(--surface)",
			borderRadius: 4,
			opacity: disabled ? .6 : 1
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, {
				className: "mx-auto mb-3",
				style: { color: "var(--accent-blue)" },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-foreground",
				children: ["Drag & drop an Excel file here, or ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "underline",
					children: "browse"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs mt-1",
				style: { color: "var(--text-secondary)" },
				children: "Accepts .xlsx, .xlsm, .xls · Max 25\xA0MB"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept,
				className: "hidden",
				onChange: (e) => onFile(e.target.files?.[0] ?? null)
			})
		]
	}), file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 flex items-center justify-between border px-4 py-2 text-sm",
		style: {
			borderColor: "#E1E4EE",
			borderRadius: 4,
			backgroundColor: "#fff"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "truncate",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: sanitize(file.name)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ml-2",
				style: { color: "var(--text-secondary)" },
				children: [(file.size / 1024).toFixed(1), " KB"]
			})]
		}), !disabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onFile(null),
			"aria-label": "Remove file",
			className: "p-1 hover:text-[color:var(--accent-blue)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				className: "w-4 h-4",
				"aria-hidden": true
			})
		})]
	})] });
}
function downloadBlob(bytes, filename) {
	const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function stripExt(name) {
	const i = name.lastIndexOf(".");
	return i > 0 ? name.substring(0, i) : name;
}
function validateExcelFile(file) {
	const ext = file.name.toLowerCase().split(".").pop();
	if (!ext || ![
		"xlsx",
		"xlsm",
		"xls"
	].includes(ext)) return "File must be .xlsx, .xlsm, or .xls.";
	if (file.size > 26214400) return "File exceeds 25 MB.";
	return null;
}
//#endregion
export { validateExcelFile as i, downloadBlob as n, stripExt as r, FileDropzone as t };
