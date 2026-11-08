import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/possible-typed-array-names/index.js
var require_possible_typed_array_names = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = [
		"Float16Array",
		"Float32Array",
		"Float64Array",
		"Int8Array",
		"Int16Array",
		"Int32Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Uint16Array",
		"Uint32Array",
		"BigInt64Array",
		"BigUint64Array"
	];
}));
//#endregion
//#region node_modules/available-typed-arrays/index.js
var require_available_typed_arrays = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var possibleNames = require_possible_typed_array_names();
	var g = typeof globalThis === "undefined" ? global : globalThis;
	/** @type {import('.')} */
	module.exports = function availableTypedArrays() {
		var out = [];
		for (var i = 0; i < possibleNames.length; i++) if (typeof g[possibleNames[i]] === "function") out[out.length] = possibleNames[i];
		return out;
	};
}));
//#endregion
export { require_possible_typed_array_names as n, require_available_typed_arrays as t };
