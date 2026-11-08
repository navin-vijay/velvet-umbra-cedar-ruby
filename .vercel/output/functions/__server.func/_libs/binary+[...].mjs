import { i as __require, t as __commonJSMin } from "../_runtime.mjs";
import { n as require_possible_typed_array_names, t as require_available_typed_arrays } from "./available-typed-arrays+[...].mjs";
import { C as require_es_object_atoms, S as require_range, _ as require_max, a as require_has_property_descriptors, b as require_type, c as require_hasown, d as require_shams$1, f as require_es_define_property, g as require_min, h as require_pow, i as require_call_bind, l as require_get_proto, m as require_isNaN$1, n as require_is_array_buffer, o as require_define_data_property, p as require_gopd, r as require_call_bound, s as require_get_intrinsic, t as require_array_buffer_byte_length, u as require_has_symbols, v as require_floor$1, x as require_syntax, y as require_abs } from "./array-buffer-byte-length+[...].mjs";
import { t as require_async_function } from "./async-function.mjs";
//#region node_modules/is-callable/index.js
var require_is_callable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fnToStr = Function.prototype.toString;
	var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
	var badArrayLike;
	var isCallableMarker;
	if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") try {
		badArrayLike = Object.defineProperty({}, "length", { get: function() {
			throw isCallableMarker;
		} });
		isCallableMarker = {};
		reflectApply(function() {
			throw 42;
		}, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) reflectApply = null;
	}
	else reflectApply = null;
	var constructorRegex = /^\s*class\b/;
	var isES6ClassFn = function isES6ClassFunction(value) {
		try {
			var fnStr = fnToStr.call(value);
			return constructorRegex.test(fnStr);
		} catch (e) {
			return false;
		}
	};
	var tryFunctionObject = function tryFunctionToStr(value) {
		try {
			if (isES6ClassFn(value)) return false;
			fnToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var objectClass = "[object Object]";
	var fnClass = "[object Function]";
	var genClass = "[object GeneratorFunction]";
	var ddaClass = "[object HTMLAllCollection]";
	var ddaClass2 = "[object HTML document.all class]";
	var ddaClass3 = "[object HTMLCollection]";
	var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
	var isIE68 = !(0 in [,]);
	var isDDA = function isDocumentDotAll() {
		return false;
	};
	if (typeof document === "object") {
		var all = document.all;
		if (toStr.call(all) === toStr.call(document.all)) isDDA = function isDocumentDotAll(value) {
			if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) try {
				var str = toStr.call(value);
				return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
			} catch (e) {}
			return false;
		};
	}
	module.exports = reflectApply ? function isCallable(value) {
		if (isDDA(value)) return true;
		if (!value) return false;
		if (typeof value !== "function" && typeof value !== "object") return false;
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) return false;
		}
		return !isES6ClassFn(value) && tryFunctionObject(value);
	} : function isCallable(value) {
		if (isDDA(value)) return true;
		if (!value) return false;
		if (typeof value !== "function" && typeof value !== "object") return false;
		if (hasToStringTag) return tryFunctionObject(value);
		if (isES6ClassFn(value)) return false;
		var strClass = toStr.call(value);
		if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) return false;
		return tryFunctionObject(value);
	};
}));
//#endregion
//#region node_modules/for-each/index.js
var require_for_each = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isCallable = require_is_callable();
	var toStr = Object.prototype.toString;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/** @type {<This, A extends readonly unknown[]>(arr: A, iterator: (this: This | void, value: A[number], index: number, arr: A) => void, receiver: This | undefined) => void} */
	var forEachArray = function forEachArray(array, iterator, receiver) {
		for (var i = 0, len = array.length; i < len; i++) if (hasOwnProperty.call(array, i)) {
			if (receiver == null) iterator(array[i], i, array);
			else iterator.call(receiver, array[i], i, array);
		}
	};
	/** @type {<This, S extends string>(string: S, iterator: (this: This | void, value: S[number], index: number, string: S) => void, receiver: This | undefined) => void} */
	var forEachString = function forEachString(string, iterator, receiver) {
		for (var i = 0, len = string.length; i < len; i++) if (receiver == null) iterator(string.charAt(i), i, string);
		else iterator.call(receiver, string.charAt(i), i, string);
	};
	/** @type {<This, O>(obj: O, iterator: (this: This | void, value: O[keyof O], index: keyof O, obj: O) => void, receiver: This | undefined) => void} */
	var forEachObject = function forEachObject(object, iterator, receiver) {
		for (var k in object) if (hasOwnProperty.call(object, k)) {
			if (receiver == null) iterator(object[k], k, object);
			else iterator.call(receiver, object[k], k, object);
		}
	};
	/** @type {(x: unknown) => x is readonly unknown[]} */
	function isArray(x) {
		return toStr.call(x) === "[object Array]";
	}
	/** @type {import('.')._internal} */
	module.exports = function forEach(list, iterator, thisArg) {
		if (!isCallable(iterator)) throw new TypeError("iterator must be a function");
		var receiver;
		if (arguments.length >= 3) receiver = thisArg;
		if (isArray(list)) forEachArray(list, iterator, receiver);
		else if (typeof list === "string") forEachString(list, iterator, receiver);
		else forEachObject(list, iterator, receiver);
	};
}));
//#endregion
//#region node_modules/has-tostringtag/shams.js
var require_shams = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasSymbols = require_shams$1();
	/** @type {import('.')} */
	module.exports = function hasToStringTagShams() {
		return hasSymbols() && !!Symbol.toStringTag;
	};
}));
//#endregion
//#region node_modules/which-typed-array/index.js
var require_which_typed_array = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var forEach = require_for_each();
	var availableTypedArrays = require_available_typed_arrays();
	var callBind = require_call_bind();
	var callBound = require_call_bound();
	var gOPD = require_gopd();
	var getProto = require_get_proto();
	var $toString = callBound("Object.prototype.toString");
	var hasToStringTag = require_shams()();
	var g = typeof globalThis === "undefined" ? global : globalThis;
	var typedArrays = availableTypedArrays();
	var $slice = callBound("String.prototype.slice");
	/** @import { BoundSet, BoundSlice, Cache, Getter } from './types' */
	/** @import { TypedArrayName } from '.' */
	/** @type {<T = unknown>(array: readonly T[], value: unknown) => number} */
	var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
		for (var i = 0; i < array.length; i += 1) if (array[i] === value) return i;
		return -1;
	};
	/** @type {Cache} */
	var cache = { __proto__: null };
	if (hasToStringTag && gOPD && getProto) forEach(typedArrays, function(typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr && getProto) {
			var proto = getProto(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor && proto) descriptor = gOPD(getProto(proto), Symbol.toStringTag);
			if (descriptor && descriptor.get) {
				var bound = callBind(descriptor.get);
				cache["$" + typedArray] = bound;
			}
		}
	});
	else forEach(typedArrays, function(typedArray) {
		var arr = new g[typedArray]();
		var fn = arr.slice || arr.set;
		if (fn) {
			var bound = callBind(fn);
			cache["$" + typedArray] = bound;
		}
	});
	/** @type {(value: object) => false | TypedArrayName} */
	function tryTypedArrays(value) {
		/** @type {ReturnType<typeof tryTypedArrays>} */ var found = false;
		forEach(
			cache,
			/** @param {Getter} getter @param {`$${TypedArrayName}`} typedArray */
			function(getter, typedArray) {
				if (!found) try {
					if ("$" + getter(value) === typedArray) found = $slice(typedArray, 1);
				} catch (e) {}
			}
		);
		return found;
	}
	/** @type {(value: object) => false | TypedArrayName} */
	function trySlices(value) {
		/** @type {ReturnType<typeof trySlices>} */ var found = false;
		forEach(
			cache,
			/** @param {Getter} getter @param {`$${TypedArrayName}`} name */
			function(getter, name) {
				if (!found) try {
					getter(value);
					found = $slice(name, 1);
				} catch (e) {}
			}
		);
		return found;
	}
	/** @type {(tag: unknown) => tag is typeof typedArrays[number]} */
	function isTATag(tag) {
		return $indexOf(typedArrays, tag) > -1;
	}
	/** @type {(value: unknown) => ReturnType<typeof import('.')>} */
	function whichTypedArray(value) {
		if (!value || typeof value !== "object") return false;
		if (!hasToStringTag) {
			var tag = $slice($toString(value), 8, -1);
			if (isTATag(tag)) return tag;
			if (tag !== "Object") return false;
			return trySlices(value);
		}
		if (!gOPD) return null;
		return tryTypedArrays(value);
	}
	module.exports = whichTypedArray;
}));
//#endregion
//#region node_modules/object-keys/isArguments.js
var require_isArguments = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var toStr = Object.prototype.toString;
	module.exports = function isArguments(value) {
		var str = toStr.call(value);
		var isArgs = str === "[object Arguments]";
		if (!isArgs) isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
		return isArgs;
	};
}));
//#endregion
//#region node_modules/object-keys/implementation.js
var require_implementation$4 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var keysShim;
	if (!Object.keys) {
		var has = Object.prototype.hasOwnProperty;
		var toStr = Object.prototype.toString;
		var isArgs = require_isArguments();
		var isEnumerable = Object.prototype.propertyIsEnumerable;
		var hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
		var hasProtoEnumBug = isEnumerable.call(function() {}, "prototype");
		var dontEnums = [
			"toString",
			"toLocaleString",
			"valueOf",
			"hasOwnProperty",
			"isPrototypeOf",
			"propertyIsEnumerable",
			"constructor"
		];
		var equalsConstructorPrototype = function(o) {
			var ctor = o.constructor;
			return ctor && ctor.prototype === o;
		};
		var excludedKeys = {
			$applicationCache: true,
			$console: true,
			$external: true,
			$frame: true,
			$frameElement: true,
			$frames: true,
			$innerHeight: true,
			$innerWidth: true,
			$onmozfullscreenchange: true,
			$onmozfullscreenerror: true,
			$outerHeight: true,
			$outerWidth: true,
			$pageXOffset: true,
			$pageYOffset: true,
			$parent: true,
			$scrollLeft: true,
			$scrollTop: true,
			$scrollX: true,
			$scrollY: true,
			$self: true,
			$webkitIndexedDB: true,
			$webkitStorageInfo: true,
			$window: true
		};
		var hasAutomationEqualityBug = function() {
			if (typeof window === "undefined") return false;
			for (var k in window) try {
				if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			} catch (e) {
				return true;
			}
			return false;
		}();
		var equalsConstructorPrototypeIfNotBuggy = function(o) {
			if (typeof window === "undefined" || !hasAutomationEqualityBug) return equalsConstructorPrototype(o);
			try {
				return equalsConstructorPrototype(o);
			} catch (e) {
				return false;
			}
		};
		keysShim = function keys(object) {
			var isObject = object !== null && typeof object === "object";
			var isFunction = toStr.call(object) === "[object Function]";
			var isArguments = isArgs(object);
			var isString = isObject && toStr.call(object) === "[object String]";
			var theKeys = [];
			if (!isObject && !isFunction && !isArguments) throw new TypeError("Object.keys called on a non-object");
			var skipProto = hasProtoEnumBug && isFunction;
			if (isString && object.length > 0 && !has.call(object, 0)) for (var i = 0; i < object.length; ++i) theKeys.push(String(i));
			if (isArguments && object.length > 0) for (var j = 0; j < object.length; ++j) theKeys.push(String(j));
			else for (var name in object) if (!(skipProto && name === "prototype") && has.call(object, name)) theKeys.push(String(name));
			if (hasDontEnumBug) {
				var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
				for (var k = 0; k < dontEnums.length; ++k) if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) theKeys.push(dontEnums[k]);
			}
			return theKeys;
		};
	}
	module.exports = keysShim;
}));
//#endregion
//#region node_modules/object-keys/index.js
var require_object_keys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var slice = Array.prototype.slice;
	var isArgs = require_isArguments();
	var origKeys = Object.keys;
	var keysShim = origKeys ? function keys(o) {
		return origKeys(o);
	} : require_implementation$4();
	var originalKeys = Object.keys;
	keysShim.shim = function shimObjectKeys() {
		if (Object.keys) {
			if (!function() {
				var args = Object.keys(arguments);
				return args && args.length === arguments.length;
			}(1, 2)) Object.keys = function keys(object) {
				if (isArgs(object)) return originalKeys(slice.call(object));
				return originalKeys(object);
			};
		} else Object.keys = keysShim;
		return Object.keys || keysShim;
	};
	module.exports = keysShim;
}));
//#endregion
//#region node_modules/define-properties/index.js
var require_define_properties = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var keys = require_object_keys();
	var hasSymbols = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
	var toStr = Object.prototype.toString;
	var concat = Array.prototype.concat;
	var defineDataProperty = require_define_data_property();
	var isFunction = function(fn) {
		return typeof fn === "function" && toStr.call(fn) === "[object Function]";
	};
	var supportsDescriptors = require_has_property_descriptors()();
	var defineProperty = function(object, name, value, predicate) {
		if (name in object) {
			if (predicate === true) {
				if (object[name] === value) return;
			} else if (!isFunction(predicate) || !predicate()) return;
		}
		if (supportsDescriptors) defineDataProperty(object, name, value, true);
		else defineDataProperty(object, name, value);
	};
	var defineProperties = function(object, map) {
		var predicates = arguments.length > 2 ? arguments[2] : {};
		var props = keys(map);
		if (hasSymbols) props = concat.call(props, Object.getOwnPropertySymbols(map));
		for (var i = 0; i < props.length; i += 1) defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	};
	defineProperties.supportsDescriptors = !!supportsDescriptors;
	module.exports = defineProperties;
}));
//#endregion
//#region node_modules/object-inspect/util.inspect.js
var require_util_inspect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = __require("util").inspect;
}));
//#endregion
//#region node_modules/object-inspect/index.js
var require_object_inspect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasMap = typeof Map === "function" && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === "function" && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var weakMapHas = typeof WeakMap === "function" && WeakMap.prototype ? WeakMap.prototype.has : null;
	var weakSetHas = typeof WeakSet === "function" && WeakSet.prototype ? WeakSet.prototype.has : null;
	var weakRefDeref = typeof WeakRef === "function" && WeakRef.prototype ? WeakRef.prototype.deref : null;
	var booleanValueOf = Boolean.prototype.valueOf;
	var objectToString = Object.prototype.toString;
	var functionToString = Function.prototype.toString;
	var $match = String.prototype.match;
	var $slice = String.prototype.slice;
	var $replace = String.prototype.replace;
	var $toUpperCase = String.prototype.toUpperCase;
	var $toLowerCase = String.prototype.toLowerCase;
	var $test = RegExp.prototype.test;
	var $concat = Array.prototype.concat;
	var $join = Array.prototype.join;
	var $arrSlice = Array.prototype.slice;
	var $floor = Math.floor;
	var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
	var gOPS = Object.getOwnPropertySymbols;
	var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
	var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
	var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
		return O.__proto__;
	} : null);
	function addNumericSeparator(num, str) {
		if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) return str;
		var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
		if (typeof num === "number") {
			var int = num < 0 ? -$floor(-num) : $floor(num);
			if (int !== num) {
				var intStr = String(int);
				var dec = $slice.call(str, intStr.length + 1);
				return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
			}
		}
		return $replace.call(str, sepRegex, "$&_");
	}
	var utilInspect = require_util_inspect();
	var inspectCustom = utilInspect.custom;
	var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
	var quotes = {
		__proto__: null,
		"double": "\"",
		single: "'"
	};
	var quoteREs = {
		__proto__: null,
		"double": /(["\\])/g,
		single: /(['\\])/g
	};
	module.exports = function inspect_(obj, options, depth, seen) {
		var opts = options || {};
		if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) throw new TypeError("option \"quoteStyle\" must be \"single\" or \"double\"");
		if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) throw new TypeError("option \"maxStringLength\", if provided, must be a positive integer, Infinity, or `null`");
		var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
		if (typeof customInspect !== "boolean" && customInspect !== "symbol") throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
		if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) throw new TypeError("option \"indent\" must be \"\\t\", an integer > 0, or `null`");
		if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") throw new TypeError("option \"numericSeparator\", if provided, must be `true` or `false`");
		var numericSeparator = opts.numericSeparator;
		if (typeof obj === "undefined") return "undefined";
		if (obj === null) return "null";
		if (typeof obj === "boolean") return obj ? "true" : "false";
		if (typeof obj === "string") return inspectString(obj, opts);
		if (typeof obj === "number") {
			if (obj === 0) return Infinity / obj > 0 ? "0" : "-0";
			var str = String(obj);
			return numericSeparator ? addNumericSeparator(obj, str) : str;
		}
		if (typeof obj === "bigint") {
			var bigIntStr = String(obj) + "n";
			return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
		}
		var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
		if (typeof depth === "undefined") depth = 0;
		if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") return isArray(obj) ? "[Array]" : "[Object]";
		var indent = getIndent(opts, depth);
		if (typeof seen === "undefined") seen = [];
		else if (indexOf(seen, obj) >= 0) return "[Circular]";
		function inspect(value, from, noIndent) {
			if (from) {
				seen = $arrSlice.call(seen);
				seen.push(from);
			}
			if (noIndent) {
				var newOpts = { depth: opts.depth };
				if (has(opts, "quoteStyle")) newOpts.quoteStyle = opts.quoteStyle;
				return inspect_(value, newOpts, depth + 1, seen);
			}
			return inspect_(value, opts, depth + 1, seen);
		}
		if (typeof obj === "function" && !isRegExp(obj)) {
			var name = nameOf(obj);
			var keys = arrObjKeys(obj, inspect);
			return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
		}
		if (isSymbol(obj)) {
			var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
			return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
		}
		if (isElement(obj)) {
			var s = "<" + $toLowerCase.call(String(obj.nodeName));
			var attrs = obj.attributes || [];
			for (var i = 0; i < attrs.length; i++) s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
			s += ">";
			if (obj.childNodes && obj.childNodes.length) s += "...";
			s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
			return s;
		}
		if (isArray(obj)) {
			if (obj.length === 0) return "[]";
			var xs = arrObjKeys(obj, inspect);
			if (indent && !singleLineValues(xs)) return "[" + indentedJoin(xs, indent) + "]";
			return "[ " + $join.call(xs, ", ") + " ]";
		}
		if (isError(obj)) {
			var parts = arrObjKeys(obj, inspect);
			if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
			if (parts.length === 0) return "[" + String(obj) + "]";
			return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
		}
		if (typeof obj === "object" && customInspect) {
			if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) return utilInspect(obj, { depth: maxDepth - depth });
			else if (customInspect !== "symbol" && typeof obj.inspect === "function") return obj.inspect();
		}
		if (isMap(obj)) {
			var mapParts = [];
			if (mapForEach) mapForEach.call(obj, function(value, key) {
				mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
			});
			return collectionOf("Map", mapSize.call(obj), mapParts, indent);
		}
		if (isSet(obj)) {
			var setParts = [];
			if (setForEach) setForEach.call(obj, function(value) {
				setParts.push(inspect(value, obj));
			});
			return collectionOf("Set", setSize.call(obj), setParts, indent);
		}
		if (isWeakMap(obj)) return weakCollectionOf("WeakMap");
		if (isWeakSet(obj)) return weakCollectionOf("WeakSet");
		if (isWeakRef(obj)) return weakCollectionOf("WeakRef");
		if (isNumber(obj)) return markBoxed(inspect(Number(obj)));
		if (isBigInt(obj)) return markBoxed(inspect(bigIntValueOf.call(obj)));
		if (isBoolean(obj)) return markBoxed(booleanValueOf.call(obj));
		if (isString(obj)) return markBoxed(inspect(String(obj)));
		if (typeof window !== "undefined" && obj === window) return "{ [object Window] }";
		if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) return "{ [object globalThis] }";
		if (!isDate(obj) && !isRegExp(obj)) {
			var ys = arrObjKeys(obj, inspect);
			var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
			var protoTag = obj instanceof Object ? "" : "null prototype";
			var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
			var tag = (isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "") + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
			if (ys.length === 0) return tag + "{}";
			if (indent) return tag + "{" + indentedJoin(ys, indent) + "}";
			return tag + "{ " + $join.call(ys, ", ") + " }";
		}
		return String(obj);
	};
	function wrapQuotes(s, defaultStyle, opts) {
		var quoteChar = quotes[opts.quoteStyle || defaultStyle];
		return quoteChar + s + quoteChar;
	}
	function quote(s) {
		return $replace.call(String(s), /"/g, "&quot;");
	}
	function canTrustToString(obj) {
		return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
	}
	function isArray(obj) {
		return toStr(obj) === "[object Array]" && canTrustToString(obj);
	}
	function isDate(obj) {
		return toStr(obj) === "[object Date]" && canTrustToString(obj);
	}
	function isRegExp(obj) {
		return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
	}
	function isError(obj) {
		return toStr(obj) === "[object Error]" && canTrustToString(obj);
	}
	function isString(obj) {
		return toStr(obj) === "[object String]" && canTrustToString(obj);
	}
	function isNumber(obj) {
		return toStr(obj) === "[object Number]" && canTrustToString(obj);
	}
	function isBoolean(obj) {
		return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
	}
	function isSymbol(obj) {
		if (hasShammedSymbols) return obj && typeof obj === "object" && obj instanceof Symbol;
		if (typeof obj === "symbol") return true;
		if (!obj || typeof obj !== "object" || !symToString) return false;
		try {
			symToString.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	function isBigInt(obj) {
		if (!obj || typeof obj !== "object" || !bigIntValueOf) return false;
		try {
			bigIntValueOf.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	var hasOwn = Object.prototype.hasOwnProperty || function(key) {
		return key in this;
	};
	function has(obj, key) {
		return hasOwn.call(obj, key);
	}
	function toStr(obj) {
		return objectToString.call(obj);
	}
	function nameOf(f) {
		if (f.name) return f.name;
		var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
		if (m) return m[1];
		return null;
	}
	function indexOf(xs, x) {
		if (xs.indexOf) return xs.indexOf(x);
		for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;
		return -1;
	}
	function isMap(x) {
		if (!mapSize || !x || typeof x !== "object") return false;
		try {
			mapSize.call(x);
			try {
				setSize.call(x);
			} catch (s) {
				return true;
			}
			return x instanceof Map;
		} catch (e) {}
		return false;
	}
	function isWeakMap(x) {
		if (!weakMapHas || !x || typeof x !== "object") return false;
		try {
			weakMapHas.call(x, weakMapHas);
			try {
				weakSetHas.call(x, weakSetHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakMap;
		} catch (e) {}
		return false;
	}
	function isWeakRef(x) {
		if (!weakRefDeref || !x || typeof x !== "object") return false;
		try {
			weakRefDeref.call(x);
			return true;
		} catch (e) {}
		return false;
	}
	function isSet(x) {
		if (!setSize || !x || typeof x !== "object") return false;
		try {
			setSize.call(x);
			try {
				mapSize.call(x);
			} catch (m) {
				return true;
			}
			return x instanceof Set;
		} catch (e) {}
		return false;
	}
	function isWeakSet(x) {
		if (!weakSetHas || !x || typeof x !== "object") return false;
		try {
			weakSetHas.call(x, weakSetHas);
			try {
				weakMapHas.call(x, weakMapHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakSet;
		} catch (e) {}
		return false;
	}
	function isElement(x) {
		if (!x || typeof x !== "object") return false;
		if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) return true;
		return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
	}
	function inspectString(str, opts) {
		if (str.length > opts.maxStringLength) {
			var remaining = str.length - opts.maxStringLength;
			var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
			return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
		}
		var quoteRE = quoteREs[opts.quoteStyle || "single"];
		quoteRE.lastIndex = 0;
		return wrapQuotes($replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte), "single", opts);
	}
	function lowbyte(c) {
		var n = c.charCodeAt(0);
		var x = {
			8: "b",
			9: "t",
			10: "n",
			12: "f",
			13: "r"
		}[n];
		if (x) return "\\" + x;
		return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
	}
	function markBoxed(str) {
		return "Object(" + str + ")";
	}
	function weakCollectionOf(type) {
		return type + " { ? }";
	}
	function collectionOf(type, size, entries, indent) {
		var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
		return type + " (" + size + ") {" + joinedEntries + "}";
	}
	function singleLineValues(xs) {
		for (var i = 0; i < xs.length; i++) if (indexOf(xs[i], "\n") >= 0) return false;
		return true;
	}
	function getIndent(opts, depth) {
		var baseIndent;
		if (opts.indent === "	") baseIndent = "	";
		else if (typeof opts.indent === "number" && opts.indent > 0) baseIndent = $join.call(Array(opts.indent + 1), " ");
		else return null;
		return {
			base: baseIndent,
			prev: $join.call(Array(depth + 1), baseIndent)
		};
	}
	function indentedJoin(xs, indent) {
		if (xs.length === 0) return "";
		var lineJoiner = "\n" + indent.prev + indent.base;
		return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
	}
	function arrObjKeys(obj, inspect) {
		var isArr = isArray(obj);
		var xs = [];
		if (isArr) {
			xs.length = obj.length;
			for (var i = 0; i < obj.length; i++) xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
		}
		var syms = typeof gOPS === "function" ? gOPS(obj) : [];
		var symMap;
		if (hasShammedSymbols) {
			symMap = {};
			for (var k = 0; k < syms.length; k++) symMap["$" + syms[k]] = syms[k];
		}
		for (var key in obj) {
			if (!has(obj, key)) continue;
			if (isArr && String(Number(key)) === key && key < obj.length) continue;
			if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) continue;
			else if ($test.call(/[^\w$]/, key)) xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
			else xs.push(key + ": " + inspect(obj[key], obj));
		}
		if (typeof gOPS === "function") {
			for (var j = 0; j < syms.length; j++) if (isEnumerable.call(obj, syms[j])) xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
		}
		return xs;
	}
}));
//#endregion
//#region node_modules/es-abstract/helpers/isPropertyKey.js
var require_isPropertyKey$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function isPropertyKey(argument) {
		return typeof argument === "string" || typeof argument === "symbol";
	};
}));
//#endregion
//#region node_modules/es-object-atoms/isObject.js
var require_isObject$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./isObject')} */
	module.exports = function isObject(x) {
		return !!x && (typeof x === "function" || typeof x === "object");
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/Get.js
var require_Get = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var inspect = require_object_inspect();
	var isPropertyKey = require_isPropertyKey$1();
	var isObject = require_isObject$1();
	module.exports = function Get(O, P) {
		if (!isObject(O)) throw new $TypeError("Assertion failed: Type(O) is not Object");
		if (!isPropertyKey(P)) throw new $TypeError("Assertion failed: P is not a Property Key, got " + inspect(P));
		return O[P];
	};
}));
//#endregion
//#region node_modules/math-intrinsics/isFinite.js
var require_isFinite = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $isNaN = require_isNaN$1();
	/** @type {import('./isFinite')} */
	module.exports = function isFinite(x) {
		return (typeof x === "number" || typeof x === "bigint") && !$isNaN(x) && x !== Infinity && x !== -Infinity;
	};
}));
//#endregion
//#region node_modules/math-intrinsics/isInteger.js
var require_isInteger$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $abs = require_abs();
	var $floor = require_floor$1();
	var $isNaN = require_isNaN$1();
	var $isFinite = require_isFinite();
	/** @type {import('./isInteger')} */
	module.exports = function isInteger(argument) {
		if (typeof argument !== "number" || $isNaN(argument) || !$isFinite(argument)) return false;
		var absValue = $abs(argument);
		return $floor(absValue) === absValue;
	};
}));
//#endregion
//#region node_modules/is-shared-array-buffer/index.js
var require_is_shared_array_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {undefined | ((thisArg: SharedArrayBuffer) => number)} */
	var $byteLength = require_call_bound()("SharedArrayBuffer.prototype.byteLength", true);
	/** @type {import('.')} */
	module.exports = $byteLength ? function isSharedArrayBuffer(obj) {
		if (!obj || typeof obj !== "object") return false;
		try {
			$byteLength(obj);
			return true;
		} catch (e) {
			return false;
		}
	} : function isSharedArrayBuffer(_obj) {
		return false;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/IsDetachedBuffer.js
var require_IsDetachedBuffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var $byteLength = require_array_buffer_byte_length();
	var availableTypedArrays = require_available_typed_arrays()();
	var callBound = require_call_bound();
	var isArrayBuffer = require_is_array_buffer();
	var isSharedArrayBuffer = require_is_shared_array_buffer();
	var $sabByteLength = callBound("SharedArrayBuffer.prototype.byteLength", true);
	module.exports = function IsDetachedBuffer(arrayBuffer) {
		var isSAB = isSharedArrayBuffer(arrayBuffer);
		if (!isArrayBuffer(arrayBuffer) && !isSAB) throw new $TypeError("Assertion failed: `arrayBuffer` must be an Object with an [[ArrayBufferData]] internal slot");
		if ((isSAB ? $sabByteLength : $byteLength)(arrayBuffer) === 0) try {
			new global[availableTypedArrays[0]](arrayBuffer);
		} catch (error) {
			return !!error && error.name === "TypeError";
		}
		return false;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/HasOwnProperty.js
var require_HasOwnProperty = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var hasOwn = require_hasown();
	var isObject = require_isObject$1();
	var isPropertyKey = require_isPropertyKey$1();
	module.exports = function HasOwnProperty(O, P) {
		if (!isObject(O)) throw new $TypeError("Assertion failed: `O` must be an Object");
		if (!isPropertyKey(P)) throw new $TypeError("Assertion failed: `P` must be a Property Key");
		return hasOwn(O, P);
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/IsArray.js
var require_IsArray$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $Array = require_get_intrinsic()("%Array%");
	var toStr = !$Array.isArray && require_call_bound()("Object.prototype.toString");
	module.exports = $Array.isArray || function IsArray(argument) {
		return toStr(argument) === "[object Array]";
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/IsArray.js
var require_IsArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_IsArray$1();
}));
//#endregion
//#region node_modules/es-abstract/2025/IsBigIntElementType.js
var require_IsBigIntElementType = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function IsBigIntElementType(type) {
		return type === "BIGUINT64" || type === "BIGINT64";
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/IsUnsignedElementType.js
var require_IsUnsignedElementType = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function IsUnsignedElementType(type) {
		return type === "UINT8" || type === "UINT8C" || type === "UINT16" || type === "UINT32" || type === "BIGUINT64";
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/bytesAsFloat16.js
var require_bytesAsFloat16 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $pow = require_pow();
	module.exports = function bytesAsFloat32(rawBytes) {
		var bits = rawBytes[1] << 8 | rawBytes[0];
		var sign = bits & 32768 ? -1 : 1;
		var exponent = (bits & 31744) >> 10;
		var mantissa = bits & 1023;
		if (exponent === 0 && mantissa === 0) return sign === 1 ? 0 : -0;
		if (exponent === 31 && mantissa === 0) return sign === 1 ? Infinity : -Infinity;
		if (exponent === 31 && mantissa !== 0) return NaN;
		exponent -= 15;
		if (exponent === -15) return sign * mantissa * $pow(2, -24);
		return sign * (1 + mantissa * $pow(2, -10)) * $pow(2, exponent);
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/bytesAsFloat32.js
var require_bytesAsFloat32 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $pow = require_pow();
	module.exports = function bytesAsFloat32(rawBytes) {
		var sign = rawBytes[3] & 128 ? -1 : 1;
		var exponent = (rawBytes[3] & 127) << 1 | rawBytes[2] >> 7;
		var mantissa = (rawBytes[2] & 127) << 16 | rawBytes[1] << 8 | rawBytes[0];
		if (exponent === 0 && mantissa === 0) return sign === 1 ? 0 : -0;
		if (exponent === 255 && mantissa === 0) return sign === 1 ? Infinity : -Infinity;
		if (exponent === 255 && mantissa !== 0) return NaN;
		exponent -= 127;
		if (exponent === -127) return sign * mantissa * $pow(2, -149);
		return sign * (1 + mantissa * $pow(2, -23)) * $pow(2, exponent);
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/bytesAsFloat64.js
var require_bytesAsFloat64 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $pow = require_pow();
	module.exports = function bytesAsFloat64(rawBytes) {
		var sign = rawBytes[7] & 128 ? -1 : 1;
		var exponent = (rawBytes[7] & 127) << 4 | (rawBytes[6] & 240) >> 4;
		var mantissa = (rawBytes[6] & 15) * 281474976710656 + rawBytes[5] * 1099511627776 + rawBytes[4] * 4294967296 + rawBytes[3] * 16777216 + rawBytes[2] * 65536 + rawBytes[1] * 256 + rawBytes[0];
		if (exponent === 0 && mantissa === 0) return sign * 0;
		if (exponent === 2047 && mantissa !== 0) return NaN;
		if (exponent === 2047 && mantissa === 0) return sign * Infinity;
		exponent -= 1023;
		if (exponent === -1023) return sign * mantissa * 5e-324;
		return sign * (1 + mantissa / 4503599627370496) * $pow(2, exponent);
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/bytesAsInteger.js
var require_bytesAsInteger = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var $pow = require_pow();
	var $Number = GetIntrinsic("%Number%");
	var $BigInt = GetIntrinsic("%BigInt%", true);
	module.exports = function bytesAsInteger(rawBytes, elementSize, isUnsigned, isBigInt) {
		var Z = isBigInt ? $BigInt : $Number;
		var intValue = Z(0);
		for (var i = 0; i < rawBytes.length; i++) intValue += Z(rawBytes[i] * $pow(2, 8 * i));
		if (!isUnsigned) {
			var bitLength = elementSize * 8;
			if (rawBytes[elementSize - 1] & 128) intValue -= Z($pow(2, bitLength));
		}
		return intValue;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/every.js
var require_every = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function every(array, predicate) {
		for (var i = 0; i < array.length; i += 1) if (!predicate(array[i], i, array)) return false;
		return true;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/isByteValue.js
var require_isByteValue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function isByteValue(value) {
		return typeof value === "number" && value >= 0 && value <= 255 && (value | 0) === value;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/tables/typed-array-objects.js
var require_typed_array_objects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		__proto__: null,
		name: {
			__proto__: null,
			$Int8Array: "INT8",
			$Uint8Array: "UINT8",
			$Uint8ClampedArray: "UINT8C",
			$Int16Array: "INT16",
			$Uint16Array: "UINT16",
			$Int32Array: "INT32",
			$Uint32Array: "UINT32",
			$BigInt64Array: "BIGINT64",
			$BigUint64Array: "BIGUINT64",
			$Float16Array: "FLOAT16",
			$Float32Array: "FLOAT32",
			$Float64Array: "FLOAT64"
		},
		size: {
			__proto__: null,
			$INT8: 1,
			$UINT8: 1,
			$UINT8C: 1,
			$INT16: 2,
			$UINT16: 2,
			$INT32: 4,
			$UINT32: 4,
			$BIGINT64: 8,
			$BIGUINT64: 8,
			$FLOAT16: 2,
			$FLOAT32: 4,
			$FLOAT64: 8
		},
		choices: "\"INT8\", \"UINT8\", \"UINT8C\", \"INT16\", \"UINT16\", \"INT32\", \"UINT32\", \"BIGINT64\", \"BIGUINT64\", \"FLOAT16\", \"FLOAT32\", or \"FLOAT64\""
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/RawBytesToNumeric.js
var require_RawBytesToNumeric = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBound = require_call_bound();
	var $RangeError = require_range();
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var $BigInt = GetIntrinsic("%BigInt%", true);
	var hasOwnProperty = require_HasOwnProperty();
	var IsArray = require_IsArray();
	var IsBigIntElementType = require_IsBigIntElementType();
	var IsUnsignedElementType = require_IsUnsignedElementType();
	var bytesAsFloat16 = require_bytesAsFloat16();
	var bytesAsFloat32 = require_bytesAsFloat32();
	var bytesAsFloat64 = require_bytesAsFloat64();
	var bytesAsInteger = require_bytesAsInteger();
	var every = require_every();
	var isByteValue = require_isByteValue();
	var $reverse = callBound("Array.prototype.reverse");
	var $slice = callBound("Array.prototype.slice");
	var tableTAO = require_typed_array_objects();
	module.exports = function RawBytesToNumeric(type, rawBytes, isLittleEndian) {
		if (!hasOwnProperty(tableTAO.size, "$" + type)) throw new $TypeError("Assertion failed: `type` must be a TypedArray element type");
		if (!IsArray(rawBytes) || !every(rawBytes, isByteValue)) throw new $TypeError("Assertion failed: `rawBytes` must be an Array of bytes");
		if (typeof isLittleEndian !== "boolean") throw new $TypeError("Assertion failed: `isLittleEndian` must be a Boolean");
		var elementSize = tableTAO.size["$" + type];
		if (rawBytes.length !== elementSize) throw new $RangeError("Assertion failed: `rawBytes` must have a length of " + elementSize + " for type " + type);
		var isBigInt = IsBigIntElementType(type);
		if (isBigInt && !$BigInt) throw new $SyntaxError("this environment does not support BigInts");
		rawBytes = $slice(rawBytes, 0, elementSize);
		if (!isLittleEndian) $reverse(rawBytes);
		if (type === "FLOAT16") return bytesAsFloat16(rawBytes);
		if (type === "FLOAT32") return bytesAsFloat32(rawBytes);
		if (type === "FLOAT64") return bytesAsFloat64(rawBytes);
		return bytesAsInteger(rawBytes, elementSize, IsUnsignedElementType(type), isBigInt);
	};
}));
//#endregion
//#region node_modules/isarray/index.js
var require_isarray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var toString = {}.toString;
	module.exports = Array.isArray || function(arr) {
		return toString.call(arr) == "[object Array]";
	};
}));
//#endregion
//#region node_modules/safe-array-concat/index.js
var require_safe_array_concat = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $concat = require_get_intrinsic()("%Array.prototype.concat%");
	var callBind = require_call_bind();
	var $slice = require_call_bound()("Array.prototype.slice");
	var isConcatSpreadable = require_shams$1()() && Symbol.isConcatSpreadable;
	/** @type {never[]} */ var empty = [];
	var $concatApply = isConcatSpreadable ? callBind.apply($concat, empty) : null;
	var isArray = isConcatSpreadable ? require_isarray() : null;
	/** @type {import('.')} */
	module.exports = isConcatSpreadable ? function safeArrayConcat(item) {
		for (var i = 0; i < arguments.length; i += 1) {
			/** @type {typeof item} */ var arg = arguments[i];
			if (arg && typeof arg === "object" && typeof arg[isConcatSpreadable] === "boolean") {
				if (!empty[isConcatSpreadable]) empty[isConcatSpreadable] = true;
				var arr = isArray(arg) ? $slice(arg) : [arg];
				arr[isConcatSpreadable] = true;
				arguments[i] = arr;
			}
		}
		return $concatApply(arguments);
	} : callBind($concat, empty);
}));
//#endregion
//#region node_modules/is-typed-array/index.js
var require_is_typed_array = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var whichTypedArray = require_which_typed_array();
	/** @type {import('.')} */
	module.exports = function isTypedArray(value) {
		return !!whichTypedArray(value);
	};
}));
//#endregion
//#region node_modules/typed-array-buffer/index.js
var require_typed_array_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	/** @type {undefined | ((thisArg: import('.').TypedArray) => Buffer<ArrayBufferLike>)} */
	var $typedArrayBuffer = require_call_bound()("TypedArray.prototype.buffer", true);
	var isTypedArray = require_is_typed_array();
	/** @type {import('.')} */
	module.exports = $typedArrayBuffer || function typedArrayBuffer(x) {
		if (!isTypedArray(x)) throw new $TypeError("Not a Typed Array");
		return x.buffer;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/defaultEndianness.js
var require_defaultEndianness = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var $Uint8Array = GetIntrinsic("%Uint8Array%", true);
	var $Uint32Array = GetIntrinsic("%Uint32Array%", true);
	var typedArrayBuffer = require_typed_array_buffer();
	var uInt32 = $Uint32Array && new $Uint32Array([305419896]);
	var uInt8 = uInt32 && new $Uint8Array(typedArrayBuffer(uInt32));
	module.exports = uInt8 ? uInt8[0] === 120 ? "little" : uInt8[0] === 18 ? "big" : uInt8[0] === 52 ? "mixed" : "unknown" : "indeterminate";
}));
//#endregion
//#region node_modules/es-abstract/2025/GetValueFromBuffer.js
var require_GetValueFromBuffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var callBound = require_call_bound();
	var isInteger = require_isInteger$1();
	var $Uint8Array = GetIntrinsic("%Uint8Array%", true);
	var $slice = callBound("Array.prototype.slice");
	var IsDetachedBuffer = require_IsDetachedBuffer();
	var RawBytesToNumeric = require_RawBytesToNumeric();
	var isArrayBuffer = require_is_array_buffer();
	var isSharedArrayBuffer = require_is_shared_array_buffer();
	var safeConcat = require_safe_array_concat();
	var tableTAO = require_typed_array_objects();
	var defaultEndianness = require_defaultEndianness();
	module.exports = function GetValueFromBuffer(arrayBuffer, byteIndex, type, isTypedArray, order) {
		var isSAB = isSharedArrayBuffer(arrayBuffer);
		if (!isArrayBuffer(arrayBuffer) && !isSAB) throw new $TypeError("Assertion failed: `arrayBuffer` must be an ArrayBuffer or a SharedArrayBuffer");
		if (!isInteger(byteIndex)) throw new $TypeError("Assertion failed: `byteIndex` must be an integer");
		if (typeof type !== "string" || typeof tableTAO.size["$" + type] !== "number") throw new $TypeError("Assertion failed: `type` must be one of " + tableTAO.choices);
		if (typeof isTypedArray !== "boolean") throw new $TypeError("Assertion failed: `isTypedArray` must be a boolean");
		if (order !== "SEQ-CST" && order !== "UNORDERED") throw new $TypeError("Assertion failed: `order` must be either `SEQ-CST` or `UNORDERED`");
		if (arguments.length > 5 && typeof arguments[5] !== "boolean") throw new $TypeError("Assertion failed: `isLittleEndian` must be a boolean, if present");
		if (IsDetachedBuffer(arrayBuffer)) throw new $TypeError("Assertion failed: `arrayBuffer` is detached");
		if (byteIndex < 0) throw new $TypeError("Assertion failed: `byteIndex` must be non-negative");
		var elementSize = tableTAO.size["$" + type];
		if (!elementSize) throw new $TypeError("Assertion failed: `type` must be one of " + tableTAO.choices);
		var rawValue;
		if (isSAB) throw new $SyntaxError("SharedArrayBuffer is not supported by this implementation");
		else rawValue = $slice(new $Uint8Array(arrayBuffer, byteIndex), 0, elementSize);
		var isLittleEndian = arguments.length > 5 ? arguments[5] : defaultEndianness === "little";
		return RawBytesToNumeric(type, isLittleEndian ? $slice(safeConcat([
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		], rawValue), -elementSize) : $slice(safeConcat(rawValue, [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		]), 0, elementSize), isLittleEndian);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/SameValue.js
var require_SameValue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $isNaN = require_isNaN$1();
	module.exports = function SameValue(x, y) {
		if (x === y) {
			if (x === 0) return 1 / x === 1 / y;
			return true;
		}
		return $isNaN(x) && $isNaN(y);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/Set.js
var require_Set = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var isObject = require_isObject$1();
	var isPropertyKey = require_isPropertyKey$1();
	var SameValue = require_SameValue();
	var noThrowOnStrictViolation = function() {
		try {
			delete 0;
			return true;
		} catch (e) {
			return false;
		}
	}();
	module.exports = function Set(O, P, V, Throw) {
		if (!isObject(O)) throw new $TypeError("Assertion failed: `O` must be an Object");
		if (!isPropertyKey(P)) throw new $TypeError("Assertion failed: `P` must be a Property Key");
		if (typeof Throw !== "boolean") throw new $TypeError("Assertion failed: `Throw` must be a Boolean");
		if (Throw) {
			O[P] = V;
			if (noThrowOnStrictViolation && !SameValue(O[P], V)) throw new $TypeError("Attempted to assign to readonly property.");
			return true;
		}
		try {
			O[P] = V;
			return noThrowOnStrictViolation ? SameValue(O[P], V) : true;
		} catch (e) {
			return false;
		}
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/StringToBigInt.js
var require_StringToBigInt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $BigInt = require_get_intrinsic()("%BigInt%", true);
	var $TypeError = require_type();
	var $SyntaxError = require_syntax();
	module.exports = function StringToBigInt(argument) {
		if (typeof argument !== "string") throw new $TypeError("`argument` must be a string");
		if (!$BigInt) throw new $SyntaxError("BigInts are not supported in this environment");
		try {
			return $BigInt(argument);
		} catch (e) {
			return;
		}
	};
}));
//#endregion
//#region node_modules/is-date-object/index.js
var require_is_date_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var getDay = callBound("Date.prototype.getDay");
	/** @type {import('.')} */
	var tryDateObject = function tryDateGetDayCall(value) {
		try {
			getDay(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	/** @type {(value: unknown) => string} */
	var toStr = callBound("Object.prototype.toString");
	var dateClass = "[object Date]";
	var hasToStringTag = require_shams()();
	/** @type {import('.')} */
	module.exports = function isDateObject(value) {
		if (typeof value !== "object" || value === null) return false;
		return hasToStringTag ? tryDateObject(value) : toStr(value) === dateClass;
	};
}));
//#endregion
//#region node_modules/is-regex/index.js
var require_is_regex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var hasToStringTag = require_shams()();
	var hasOwn = require_hasown();
	var gOPD = require_gopd();
	/** @type {import('.')} */
	var fn;
	if (hasToStringTag) {
		/** @type {(receiver: ThisParameterType<typeof RegExp.prototype.exec>, ...args: Parameters<typeof RegExp.prototype.exec>) => ReturnType<typeof RegExp.prototype.exec>} */
		var $exec = callBound("RegExp.prototype.exec");
		/** @type {object} */
		var isRegexMarker = {};
		var throwRegexMarker = function() {
			throw isRegexMarker;
		};
		/** @type {{ toString(): never, valueOf(): never, [Symbol.toPrimitive]?(): never }} */
		var badStringifier = {
			toString: throwRegexMarker,
			valueOf: throwRegexMarker
		};
		if (typeof Symbol.toPrimitive === "symbol") badStringifier[Symbol.toPrimitive] = throwRegexMarker;
		/** @type {import('.')} */
		fn = function isRegex(value) {
			if (!value || typeof value !== "object") return false;
			var descriptor = gOPD(value, "lastIndex");
			if (!(descriptor && hasOwn(descriptor, "value"))) return false;
			try {
				$exec(value, badStringifier);
			} catch (e) {
				return e === isRegexMarker;
			}
		};
	} else {
		/** @type {(receiver: ThisParameterType<typeof Object.prototype.toString>, ...args: Parameters<typeof Object.prototype.toString>) => ReturnType<typeof Object.prototype.toString>} */
		var $toString = callBound("Object.prototype.toString");
		/** @const @type {'[object RegExp]'} */
		var regexClass = "[object RegExp]";
		/** @type {import('.')} */
		fn = function isRegex(value) {
			if (!value || typeof value !== "object" && typeof value !== "function") return false;
			return $toString(value) === regexClass;
		};
	}
	module.exports = fn;
}));
//#endregion
//#region node_modules/safe-regex-test/index.js
var require_safe_regex_test = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var isRegex = require_is_regex();
	var $exec = callBound("RegExp.prototype.exec");
	var $TypeError = require_type();
	/** @type {import('.')} */
	module.exports = function regexTester(regex) {
		if (!isRegex(regex)) throw new $TypeError("`regex` must be a RegExp");
		return function test(s) {
			return $exec(regex, s) !== null;
		};
	};
}));
//#endregion
//#region node_modules/is-symbol/index.js
var require_is_symbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var $toString = callBound("Object.prototype.toString");
	var hasSymbols = require_has_symbols()();
	var safeRegexTest = require_safe_regex_test();
	if (hasSymbols) {
		var $symToStr = callBound("Symbol.prototype.toString");
		var isSymString = safeRegexTest(/^Symbol\(.*\)$/);
		/** @type {(value: object) => value is Symbol} */
		var isSymbolObject = function isRealSymbolObject(value) {
			if (typeof value.valueOf() !== "symbol") return false;
			return isSymString($symToStr(value));
		};
		/** @type {import('.')} */
		module.exports = function isSymbol(value) {
			if (typeof value === "symbol") return true;
			if (!value || typeof value !== "object" || $toString(value) !== "[object Symbol]") return false;
			try {
				return isSymbolObject(value);
			} catch (e) {
				return false;
			}
		};
	} else
 /** @type {import('.')} */
	module.exports = function isSymbol(value) {
		return false;
	};
}));
//#endregion
//#region node_modules/es-to-primitive/helpers/isPrimitive.js
var require_isPrimitive$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @import { primitive } from '../' */
	/** @import { primitiveES5 } from '../es5' */
	/** @type {<T extends primitive | primitiveES5>(value: unknown) => value is T} */
	module.exports = function isPrimitive(value) {
		return value === null || typeof value !== "function" && typeof value !== "object";
	};
}));
//#endregion
//#region node_modules/es-abstract-get/isPropertyKey.js
var require_isPropertyKey = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./isPropertyKey')} */
	module.exports = function isPropertyKey(argument) {
		return typeof argument === "string" || typeof argument === "symbol";
	};
}));
//#endregion
//#region node_modules/es-abstract-get/GetV.js
var require_GetV = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var inspect = require_object_inspect();
	var isPropertyKey = require_isPropertyKey();
	/** @type {import('./GetV')} */
	module.exports = function GetV(V, P) {
		if (!isPropertyKey(P)) throw new $TypeError("Assertion failed: P is not a Property Key, got " + inspect(P));
		return V[P];
	};
}));
//#endregion
//#region node_modules/es-abstract-get/GetMethod.js
var require_GetMethod = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var isCallable = require_is_callable();
	var inspect = require_object_inspect();
	var GetV = require_GetV();
	var isPropertyKey = require_isPropertyKey();
	/** @type {import('./GetMethod')} */
	module.exports = function GetMethod(O, P) {
		if (!isPropertyKey(P)) throw new $TypeError("Assertion failed: P is not a Property Key");
		var func = GetV(O, P);
		if (func == null) return;
		if (!isCallable(func)) throw new $TypeError(inspect(P) + " is not a function: " + inspect(func));
		return func;
	};
}));
//#endregion
//#region node_modules/es-to-primitive/es2015.js
var require_es2015 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "symbol";
	var isCallable = require_is_callable();
	var isDate = require_is_date_object();
	var isSymbol = require_is_symbol();
	var $TypeError = require_type();
	var isPrimitive = require_isPrimitive$1();
	/** @import { primitiveES6 } from './es2015' */
	/** @type {(O: { valueOf?: () => unknown, toString?: () => unknown }, hint: 'number' | 'string') => primitiveES6} */
	function OrdinaryToPrimitive(O, hint) {
		if (typeof O === "undefined" || O === null) throw new $TypeError("Cannot call method on " + O);
		if (typeof hint !== "string" || hint !== "number" && hint !== "string") throw new $TypeError("hint must be \"string\" or \"number\"");
		/** @type {('toString' | 'valueOf')[]} */
		var methodNames = hint === "string" ? ["toString", "valueOf"] : ["valueOf", "toString"];
		var method, result, i = 0;
		for (; i < methodNames.length; ++i) {
			method = O[methodNames[i]];
			if (isCallable(method)) {
				result = method.call(O);
				if (isPrimitive(result)) return result;
			}
		}
		throw new $TypeError("No default value");
	}
	var GetMethod = require_GetMethod();
	/** @type {import('./es2015')} */
	module.exports = function ToPrimitive(input) {
		if (isPrimitive(input)) return input;
		/** @type {'default' | 'string' | 'number'} */
		var hint = "default";
		if (arguments.length > 1) {
			if (arguments[1] === String) hint = "string";
			else if (arguments[1] === Number) hint = "number";
		}
		var exoticToPrim;
		if (hasSymbols) {
			if (Symbol.toPrimitive) exoticToPrim = GetMethod(input, Symbol.toPrimitive);
			else if (isSymbol(input)) exoticToPrim = Symbol.prototype.valueOf;
		}
		if (typeof exoticToPrim !== "undefined") {
			var result = exoticToPrim.call(input, hint);
			if (isPrimitive(result)) return result;
			throw new $TypeError("unable to convert exotic object to primitive");
		}
		if (hint === "default" && (isDate(input) || isSymbol(input))) hint = "string";
		return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToPrimitive.js
var require_ToPrimitive = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var toPrimitive = require_es2015();
	module.exports = function ToPrimitive(input) {
		if (arguments.length > 1) return toPrimitive(input, arguments[1]);
		return toPrimitive(input);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToBigInt.js
var require_ToBigInt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var $BigInt = GetIntrinsic("%BigInt%", true);
	var $Number = GetIntrinsic("%Number%");
	var $TypeError = require_type();
	var $SyntaxError = require_syntax();
	var StringToBigInt = require_StringToBigInt();
	var ToPrimitive = require_ToPrimitive();
	module.exports = function ToBigInt(argument) {
		if (!$BigInt) throw new $SyntaxError("BigInts are not supported in this environment");
		var prim = ToPrimitive(argument, $Number);
		if (prim == null) throw new $TypeError("Cannot convert null or undefined to a BigInt");
		if (typeof prim === "boolean") return prim ? $BigInt(1) : $BigInt(0);
		if (typeof prim === "number") throw new $TypeError("Cannot convert a Number value to a BigInt");
		if (typeof prim === "string") {
			var n = StringToBigInt(prim);
			if (typeof n === "undefined") throw new $TypeError("Failed to parse String to BigInt");
			return n;
		}
		if (typeof prim === "symbol") throw new $TypeError("Cannot convert a Symbol value to a BigInt");
		if (typeof prim !== "bigint") throw new $SyntaxError("Assertion failed: unknown primitive type");
		return prim;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/BigInt/remainder.js
var require_remainder = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $BigInt = require_get_intrinsic()("%BigInt%", true);
	var $RangeError = require_range();
	var $TypeError = require_type();
	var zero = $BigInt && $BigInt(0);
	module.exports = function BigIntRemainder(n, d) {
		if (typeof n !== "bigint" || typeof d !== "bigint") throw new $TypeError("Assertion failed: `n` and `d` arguments must be BigInts");
		if (d === zero) throw new $RangeError("Division by zero");
		if (n === zero) return zero;
		return n % d;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/modBigInt.js
var require_modBigInt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function bigIntMod(BigIntRemainder, bigint, modulo) {
		var remain = BigIntRemainder(bigint, modulo);
		return remain >= 0 ? remain : remain + modulo;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToBigInt64.js
var require_ToBigInt64 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $BigInt = require_get_intrinsic()("%BigInt%", true);
	var $pow = require_pow();
	var ToBigInt = require_ToBigInt();
	var BigIntRemainder = require_remainder();
	var modBigInt = require_modBigInt();
	var twoSixtyThree = $BigInt && BigInt($pow(2, 32)) * BigInt($pow(2, 31));
	var twoSixtyFour = $BigInt && BigInt($pow(2, 32)) * BigInt($pow(2, 32));
	module.exports = function ToBigInt64(argument) {
		var int64bit = modBigInt(BigIntRemainder, ToBigInt(argument), twoSixtyFour);
		return int64bit >= twoSixtyThree ? int64bit - twoSixtyFour : int64bit;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToBigUint64.js
var require_ToBigUint64 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $BigInt = require_get_intrinsic()("%BigInt%", true);
	var $pow = require_pow();
	var ToBigInt = require_ToBigInt();
	var BigIntRemainder = require_remainder();
	var modBigInt = require_modBigInt();
	var twoSixtyFour = $BigInt && BigInt($pow(2, 32)) * BigInt($pow(2, 32));
	module.exports = function ToBigUint64(argument) {
		return modBigInt(BigIntRemainder, ToBigInt(argument), twoSixtyFour);
	};
}));
//#endregion
//#region node_modules/math-intrinsics/mod.js
var require_math_intrinsics = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $floor = require_floor$1();
	/** @type {import('./mod')} */
	module.exports = function mod(number, modulo) {
		var remain = number % modulo;
		return $floor(remain >= 0 ? remain : remain + modulo);
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/mod.js
var require_helpers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_math_intrinsics();
}));
//#endregion
//#region node_modules/es-abstract/2025/modulo.js
var require_modulo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var mod = require_helpers();
	module.exports = function modulo(x, y) {
		return mod(x, y);
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/isPrimitive.js
var require_isPrimitive = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function isPrimitive(value) {
		return value === null || typeof value !== "function" && typeof value !== "object";
	};
}));
//#endregion
//#region node_modules/es-object-atoms/RequireObjectCoercible.js
var require_RequireObjectCoercible = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	/** @type {import('./RequireObjectCoercible')} */
	module.exports = function RequireObjectCoercible(value) {
		if (value == null) throw new $TypeError(arguments.length > 0 && arguments[1] || "Cannot call method on " + value);
		return value;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToString.js
var require_ToString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $String = require_get_intrinsic()("%String%");
	var $TypeError = require_type();
	module.exports = function ToString(argument) {
		if (typeof argument === "symbol") throw new $TypeError("Cannot convert a Symbol value to a string");
		return $String(argument);
	};
}));
//#endregion
//#region node_modules/string.prototype.trim/implementation.js
var require_implementation$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var RequireObjectCoercible = require_RequireObjectCoercible();
	var ToString = require_ToString();
	var callBound = require_call_bound();
	var safeRegexTester = require_safe_regex_test();
	var $replace = callBound("String.prototype.replace");
	var $charAt = callBound("String.prototype.charAt");
	var $slice = callBound("String.prototype.slice");
	var mvsIsWS = /^\s$/.test("᠎");
	var leftWhitespace = mvsIsWS ? /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/ : /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/;
	var isWhitespace = safeRegexTester(mvsIsWS ? /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]$/ : /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]$/);
	module.exports = function trim() {
		var S = $replace(ToString(RequireObjectCoercible(this)), leftWhitespace, "");
		var end = S.length;
		while (end > 0 && isWhitespace($charAt(S, end - 1))) end -= 1;
		return $slice(S, 0, end);
	};
}));
//#endregion
//#region node_modules/string.prototype.trim/polyfill.js
var require_polyfill$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation$3();
	var zeroWidthSpace = "​";
	var mongolianVowelSeparator = "᠎";
	module.exports = function getPolyfill() {
		if (String.prototype.trim && zeroWidthSpace.trim() === zeroWidthSpace && mongolianVowelSeparator.trim() === mongolianVowelSeparator && ("_" + mongolianVowelSeparator).trim() === "_" + mongolianVowelSeparator && (mongolianVowelSeparator + "_").trim() === mongolianVowelSeparator + "_") return String.prototype.trim;
		return implementation;
	};
}));
//#endregion
//#region node_modules/string.prototype.trim/shim.js
var require_shim$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var supportsDescriptors = require_has_property_descriptors()();
	var defineDataProperty = require_define_data_property();
	var getPolyfill = require_polyfill$3();
	module.exports = function shimStringTrim() {
		var polyfill = getPolyfill();
		if (String.prototype.trim !== polyfill) {
			if (supportsDescriptors) defineDataProperty(String.prototype, "trim", polyfill, true);
			else defineDataProperty(String.prototype, "trim", polyfill);
		}
		return polyfill;
	};
}));
//#endregion
//#region node_modules/string.prototype.trim/index.js
var require_string_prototype_trim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBind = require_call_bind();
	var define = require_define_properties();
	var RequireObjectCoercible = require_RequireObjectCoercible();
	var implementation = require_implementation$3();
	var getPolyfill = require_polyfill$3();
	var shim = require_shim$2();
	var bound = callBind(getPolyfill());
	var boundMethod = function trim(receiver) {
		RequireObjectCoercible(receiver);
		return bound(receiver);
	};
	define(boundMethod, {
		getPolyfill,
		implementation,
		shim
	});
	module.exports = boundMethod;
}));
//#endregion
//#region node_modules/es-abstract/2025/StringToNumber.js
var require_StringToNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var $RegExp = GetIntrinsic("%RegExp%");
	var $TypeError = require_type();
	var $parseInteger = GetIntrinsic("%parseInt%");
	var callBound = require_call_bound();
	var regexTester = require_safe_regex_test();
	var $strSlice = callBound("String.prototype.slice");
	var isBinary = regexTester(/^0b[01]+$/i);
	var isOctal = regexTester(/^0o[0-7]+$/i);
	var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
	var hasNonWS = regexTester(new $RegExp("[" + [
		"",
		"​",
		"￾"
	].join("") + "]", "g"));
	var $trim = require_string_prototype_trim();
	module.exports = function StringToNumber(argument) {
		if (typeof argument !== "string") throw new $TypeError("Assertion failed: `argument` is not a String");
		if (isBinary(argument)) return +$parseInteger($strSlice(argument, 2), 2);
		if (isOctal(argument)) return +$parseInteger($strSlice(argument, 2), 8);
		if (hasNonWS(argument) || isInvalidHexLiteral(argument)) return NaN;
		var trimmed = $trim(argument);
		if (trimmed !== argument) return StringToNumber(trimmed);
		return +argument;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToNumber.js
var require_ToNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var $TypeError = require_type();
	var $Number = GetIntrinsic("%Number%");
	var isPrimitive = require_isPrimitive();
	var ToPrimitive = require_ToPrimitive();
	var StringToNumber = require_StringToNumber();
	module.exports = function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
		if (typeof value === "symbol") throw new $TypeError("Cannot convert a Symbol value to a number");
		if (typeof value === "bigint") throw new $TypeError("Conversion from 'BigInt' to 'number' is not allowed.");
		if (typeof value === "string") return StringToNumber(value);
		return +value;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/floor.js
var require_floor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $floor = require_floor$1();
	module.exports = function floor(x) {
		if (typeof x === "bigint") return x;
		return $floor(x);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/truncate.js
var require_truncate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var floor = require_floor();
	var $TypeError = require_type();
	module.exports = function truncate(x) {
		if (typeof x !== "number" && typeof x !== "bigint") throw new $TypeError("argument must be a Number or a BigInt");
		var result = x < 0 ? -floor(-x) : floor(x);
		return result === 0 ? 0 : result;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToInt16.js
var require_ToInt16 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var modulo = require_modulo();
	var ToNumber = require_ToNumber();
	var truncate = require_truncate();
	var isFinite = require_isFinite();
	var two16 = 65536;
	module.exports = function ToInt16(argument) {
		var number = ToNumber(argument);
		if (!isFinite(number) || number === 0) return 0;
		var int16bit = modulo(truncate(number), two16);
		return int16bit >= 32768 ? int16bit - two16 : int16bit;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToInt32.js
var require_ToInt32 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var modulo = require_modulo();
	var ToNumber = require_ToNumber();
	var truncate = require_truncate();
	var isFinite = require_isFinite();
	var two31 = 2147483648;
	var two32 = 4294967296;
	module.exports = function ToInt32(argument) {
		var number = ToNumber(argument);
		if (!isFinite(number) || number === 0) return 0;
		var int32bit = modulo(truncate(number), two32);
		var result = int32bit >= two31 ? int32bit - two32 : int32bit;
		return result === 0 ? 0 : result;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToInt8.js
var require_ToInt8 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var modulo = require_modulo();
	var ToNumber = require_ToNumber();
	var truncate = require_truncate();
	var isFinite = require_isFinite();
	module.exports = function ToInt8(argument) {
		var number = ToNumber(argument);
		if (!isFinite(number) || number === 0) return 0;
		var int8bit = modulo(truncate(number), 256);
		return int8bit >= 128 ? int8bit - 256 : int8bit;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToUint16.js
var require_ToUint16 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var modulo = require_modulo();
	var ToNumber = require_ToNumber();
	var truncate = require_truncate();
	var isFinite = require_isFinite();
	var two16 = 65536;
	module.exports = function ToUint16(argument) {
		var number = ToNumber(argument);
		if (!isFinite(number) || number === 0) return 0;
		var int16bit = modulo(truncate(number), two16);
		return int16bit === 0 ? 0 : int16bit;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToUint32.js
var require_ToUint32 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var modulo = require_modulo();
	var ToNumber = require_ToNumber();
	var truncate = require_truncate();
	var isFinite = require_isFinite();
	var two32 = 4294967296;
	module.exports = function ToUint32(argument) {
		var number = ToNumber(argument);
		if (!isFinite(number) || number === 0) return 0;
		var int32bit = modulo(truncate(number), two32);
		return int32bit === 0 ? 0 : int32bit;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToUint8.js
var require_ToUint8 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isFinite = require_isFinite();
	var modulo = require_modulo();
	var ToNumber = require_ToNumber();
	var truncate = require_truncate();
	module.exports = function ToUint8(argument) {
		var number = ToNumber(argument);
		if (!isFinite(number) || number === 0) return 0;
		return modulo(truncate(number), 256);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/clamp.js
var require_clamp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var max = require_max();
	var min = require_min();
	module.exports = function clamp(x, lower, upper) {
		if (typeof x !== "number" || typeof lower !== "number" || typeof upper !== "number" || !(lower <= upper)) throw new $TypeError("Assertion failed: all three arguments must be MVs, and `lower` must be `<= upper`");
		return min(max(lower, x), upper);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToUint8Clamp.js
var require_ToUint8Clamp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var clamp = require_clamp();
	var ToNumber = require_ToNumber();
	var floor = require_floor();
	var $isNaN = require_isNaN$1();
	module.exports = function ToUint8Clamp(argument) {
		var number = ToNumber(argument);
		if ($isNaN(number)) return 0;
		var clamped = clamp(number, 0, 255);
		var f = floor(clamped);
		if (clamped < f + .5) return f;
		if (clamped > f + .5) return f + 1;
		return f % 2 === 0 ? f : f + 1;
	};
}));
//#endregion
//#region node_modules/math-intrinsics/isNegativeZero.js
var require_isNegativeZero = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./isNegativeZero')} */
	module.exports = function isNegativeZero(x) {
		return x === 0 && 1 / x === -Infinity;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/valueToFloat16Bytes.js
var require_valueToFloat16Bytes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $abs = require_abs();
	var $floor = require_floor$1();
	var $pow = require_pow();
	var isFinite = require_isFinite();
	var isNaN = require_isNaN$1();
	var isNegativeZero = require_isNegativeZero();
	var maxFiniteFloat16 = 65504;
	module.exports = function valueToFloat16Bytes(value, isLittleEndian) {
		if (isNaN(value)) return isLittleEndian ? [0, 126] : [126, 0];
		var leastSig;
		if (value === 0) {
			leastSig = isNegativeZero(value) ? 128 : 0;
			return isLittleEndian ? [0, leastSig] : [leastSig, 0];
		}
		if ($abs(value) > maxFiniteFloat16 || !isFinite(value)) {
			leastSig = value < 0 ? 252 : 124;
			return isLittleEndian ? [0, leastSig] : [leastSig, 0];
		}
		var sign = value < 0 ? 1 : 0;
		value = $abs(value);
		var exponent = 0;
		while (value >= 2) {
			exponent += 1;
			value /= 2;
		}
		while (value < 1) {
			exponent -= 1;
			value *= 2;
		}
		var mantissa = value - 1;
		mantissa *= $pow(2, 10) + .5;
		mantissa = $floor(mantissa);
		exponent += 15;
		exponent <<= 10;
		var result = sign << 15 | exponent | mantissa;
		var byte0 = result & 255;
		result >>= 8;
		var byte1 = result & 255;
		return isLittleEndian ? [byte0, byte1] : [byte1, byte0];
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/valueToFloat32Bytes.js
var require_valueToFloat32Bytes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $abs = require_abs();
	var $floor = require_floor$1();
	var $pow = require_pow();
	var isFinite = require_isFinite();
	var isNaN = require_isNaN$1();
	var isNegativeZero = require_isNegativeZero();
	var maxFiniteFloat32 = 34028234663852886e22;
	module.exports = function valueToFloat32Bytes(value, isLittleEndian) {
		if (isNaN(value)) return isLittleEndian ? [
			0,
			0,
			192,
			127
		] : [
			127,
			192,
			0,
			0
		];
		var leastSig;
		if (value === 0) {
			leastSig = isNegativeZero(value) ? 128 : 0;
			return isLittleEndian ? [
				0,
				0,
				0,
				leastSig
			] : [
				leastSig,
				0,
				0,
				0
			];
		}
		if ($abs(value) > maxFiniteFloat32 || !isFinite(value)) {
			leastSig = value < 0 ? 255 : 127;
			return isLittleEndian ? [
				0,
				0,
				128,
				leastSig
			] : [
				leastSig,
				128,
				0,
				0
			];
		}
		var sign = value < 0 ? 1 : 0;
		value = $abs(value);
		var exponent = 0;
		while (value >= 2) {
			exponent += 1;
			value /= 2;
		}
		while (value < 1) {
			exponent -= 1;
			value *= 2;
		}
		var mantissa = value - 1;
		mantissa *= $pow(2, 23) + .5;
		mantissa = $floor(mantissa);
		exponent += 127;
		exponent <<= 23;
		var result = sign << 31 | exponent | mantissa;
		var byte0 = result & 255;
		result >>= 8;
		var byte1 = result & 255;
		result >>= 8;
		var byte2 = result & 255;
		result >>= 8;
		var byte3 = result & 255;
		if (isLittleEndian) return [
			byte0,
			byte1,
			byte2,
			byte3
		];
		return [
			byte3,
			byte2,
			byte1,
			byte0
		];
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/fractionToBinaryString.js
var require_fractionToBinaryString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var MAX_ITER = 1075;
	var maxBits = 54;
	module.exports = function fractionToBitString(x) {
		var str = "";
		if (x === 0) return str;
		var j = MAX_ITER;
		var y;
		for (var i = 0; i < MAX_ITER; i += 1) {
			y = x * 2;
			if (y >= 1) {
				x = y - 1;
				str += "1";
				if (j === MAX_ITER) j = i;
			} else {
				x = y;
				str += "0";
			}
			if (y === 1 || i - j > maxBits) return str;
		}
		return str;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/intToBinaryString.js
var require_intToBinaryString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $floor = require_floor$1();
	module.exports = function intToBinaryString(x) {
		var str = "";
		var y;
		while (x > 0) {
			y = x / 2;
			x = $floor(y);
			if (y === x) str = "0" + str;
			else str = "1" + str;
		}
		return str;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/isNaN.js
var require_isNaN = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Number.isNaN || function isNaN(a) {
		return a !== a;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/valueToFloat64Bytes.js
var require_valueToFloat64Bytes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $parseInt = require_get_intrinsic()("%parseInt%");
	var $abs = require_abs();
	var $floor = require_floor$1();
	var isFinite = require_isFinite();
	var isNegativeZero = require_isNegativeZero();
	var callBound = require_call_bound();
	var $strIndexOf = callBound("String.prototype.indexOf");
	var $strSlice = callBound("String.prototype.slice");
	var fractionToBitString = require_fractionToBinaryString();
	var intToBinString = require_intToBinaryString();
	var isNaN = require_isNaN();
	var float64bias = 1023;
	var elevenOnes = "11111111111";
	var elevenZeroes = "00000000000";
	var fiftyOneZeroes = elevenZeroes + elevenZeroes + elevenZeroes + elevenZeroes + "0000000";
	module.exports = function valueToFloat64Bytes(value, isLittleEndian) {
		var signBit = value < 0 || isNegativeZero(value) ? "1" : "0";
		var exponentBits;
		var significandBits;
		if (isNaN(value)) {
			exponentBits = elevenOnes;
			significandBits = "1" + fiftyOneZeroes;
		} else if (!isFinite(value)) {
			exponentBits = elevenOnes;
			significandBits = "0" + fiftyOneZeroes;
		} else if (value === 0) {
			exponentBits = elevenZeroes;
			significandBits = "0" + fiftyOneZeroes;
		} else {
			value = $abs(value);
			var integerPart = $floor(value);
			var intBinString = intToBinString(integerPart);
			var fracBinString = fractionToBitString(value - integerPart);
			var numberOfBits;
			if (intBinString) exponentBits = intBinString.length - 1;
			else {
				var first1 = $strIndexOf(fracBinString, "1");
				if (first1 > -1) numberOfBits = first1 + 1;
				exponentBits = -numberOfBits;
			}
			significandBits = intBinString + fracBinString;
			if (exponentBits < 0) {
				if (exponentBits <= -float64bias) numberOfBits = float64bias - 1;
				significandBits = $strSlice(significandBits, numberOfBits);
			} else significandBits = $strSlice(significandBits, 1);
			exponentBits = $strSlice(elevenZeroes + intToBinString(exponentBits + float64bias), -11);
			significandBits = $strSlice(significandBits + fiftyOneZeroes + "0", 0, 52);
		}
		var bits = signBit + exponentBits + significandBits;
		var rawBytes = [];
		for (var i = 0; i < 8; i++) {
			var targetIndex = isLittleEndian ? 8 - i - 1 : i;
			rawBytes[targetIndex] = $parseInt($strSlice(bits, i * 8, (i + 1) * 8), 2);
		}
		return rawBytes;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/integerToNBytes.js
var require_integerToNBytes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var $Number = GetIntrinsic("%Number%");
	var $BigInt = GetIntrinsic("%BigInt%", true);
	module.exports = function integerToNBytes(intValue, n, isLittleEndian) {
		var Z = typeof intValue === "bigint" ? $BigInt : $Number;
		if (intValue < 0) intValue >>>= 0;
		var rawBytes = [];
		for (var i = 0; i < n; i++) {
			rawBytes[isLittleEndian ? i : n - 1 - i] = $Number(intValue & Z(255));
			intValue >>= Z(8);
		}
		return rawBytes;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/NumericToRawBytes.js
var require_NumericToRawBytes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var hasOwnProperty = require_HasOwnProperty();
	var ToBigInt64 = require_ToBigInt64();
	var ToBigUint64 = require_ToBigUint64();
	var ToInt16 = require_ToInt16();
	var ToInt32 = require_ToInt32();
	var ToInt8 = require_ToInt8();
	var ToUint16 = require_ToUint16();
	var ToUint32 = require_ToUint32();
	var ToUint8 = require_ToUint8();
	var ToUint8Clamp = require_ToUint8Clamp();
	var valueToFloat16Bytes = require_valueToFloat16Bytes();
	var valueToFloat32Bytes = require_valueToFloat32Bytes();
	var valueToFloat64Bytes = require_valueToFloat64Bytes();
	var integerToNBytes = require_integerToNBytes();
	var tableTAO = require_typed_array_objects();
	var TypeToAO = {
		__proto__: null,
		$INT8: ToInt8,
		$UINT8: ToUint8,
		$UINT8C: ToUint8Clamp,
		$INT16: ToInt16,
		$UINT16: ToUint16,
		$INT32: ToInt32,
		$UINT32: ToUint32,
		$BIGINT64: ToBigInt64,
		$BIGUINT64: ToBigUint64
	};
	module.exports = function NumericToRawBytes(type, value, isLittleEndian) {
		if (typeof type !== "string" || !hasOwnProperty(tableTAO.size, "$" + type)) throw new $TypeError("Assertion failed: `type` must be a TypedArray element type");
		if (typeof value !== "number" && typeof value !== "bigint") throw new $TypeError("Assertion failed: `value` must be a Number or a BigInt");
		if (typeof isLittleEndian !== "boolean") throw new $TypeError("Assertion failed: `isLittleEndian` must be a Boolean");
		if (type === "FLOAT16") return valueToFloat16Bytes(value, isLittleEndian);
		else if (type === "FLOAT32") return valueToFloat32Bytes(value, isLittleEndian);
		else if (type === "FLOAT64") return valueToFloat64Bytes(value, isLittleEndian);
		var n = tableTAO.size["$" + type];
		var convOp = TypeToAO["$" + type];
		return integerToNBytes(convOp(value), n, isLittleEndian);
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/forEach.js
var require_forEach = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function forEach(array, callback) {
		for (var i = 0; i < array.length; i += 1) callback(array[i], i, array);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/SetValueInBuffer.js
var require_SetValueInBuffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var isInteger = require_isInteger$1();
	var $Uint8Array = GetIntrinsic("%Uint8Array%", true);
	var IsBigIntElementType = require_IsBigIntElementType();
	var IsDetachedBuffer = require_IsDetachedBuffer();
	var NumericToRawBytes = require_NumericToRawBytes();
	var isArrayBuffer = require_is_array_buffer();
	var isSharedArrayBuffer = require_is_shared_array_buffer();
	var hasOwn = require_hasown();
	var tableTAO = require_typed_array_objects();
	var defaultEndianness = require_defaultEndianness();
	var forEach = require_forEach();
	module.exports = function SetValueInBuffer(arrayBuffer, byteIndex, type, value, isTypedArray, order) {
		var isSAB = isSharedArrayBuffer(arrayBuffer);
		if (!isArrayBuffer(arrayBuffer) && !isSAB) throw new $TypeError("Assertion failed: `arrayBuffer` must be an ArrayBuffer or a SharedArrayBuffer");
		if (!isInteger(byteIndex) || byteIndex < 0) throw new $TypeError("Assertion failed: `byteIndex` must be a non-negative integer");
		if (typeof type !== "string" || !hasOwn(tableTAO.size, "$" + type)) throw new $TypeError("Assertion failed: `type` must be one of " + tableTAO.choices);
		if (typeof value !== "number" && typeof value !== "bigint") throw new $TypeError("Assertion failed: `value` must be a Number or a BigInt");
		if (typeof isTypedArray !== "boolean") throw new $TypeError("Assertion failed: `isTypedArray` must be a boolean");
		if (order !== "SEQ-CST" && order !== "UNORDERED" && order !== "INIT") throw new $TypeError("Assertion failed: `order` must be `\"SEQ-CST\"`, `\"UNORDERED\"`, or `\"INIT\"`");
		if (arguments.length > 6 && typeof arguments[6] !== "boolean") throw new $TypeError("Assertion failed: `isLittleEndian` must be a boolean, if present");
		if (IsDetachedBuffer(arrayBuffer)) throw new $TypeError("Assertion failed: ArrayBuffer is detached");
		if (IsBigIntElementType(type) ? typeof value !== "bigint" : typeof value !== "number") throw new $TypeError("Assertion failed: `value` must be a BigInt if type is ~BIGINT64~ or ~BIGUINT64~, otherwise a Number");
		var elementSize = tableTAO.size["$" + type];
		var rawBytes = NumericToRawBytes(type, value, arguments.length > 6 ? arguments[6] : defaultEndianness === "little");
		if (isSAB) throw new $SyntaxError("SharedArrayBuffer is not supported by this implementation");
		else {
			var arr = new $Uint8Array(arrayBuffer, byteIndex, elementSize);
			forEach(rawBytes, function(rawByte, i) {
				arr[i] = rawByte;
			});
		}
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToIntegerOrInfinity.js
var require_ToIntegerOrInfinity = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ToNumber = require_ToNumber();
	var truncate = require_truncate();
	var $isNaN = require_isNaN$1();
	var $isFinite = require_isFinite();
	module.exports = function ToIntegerOrInfinity(value) {
		var number = ToNumber(value);
		if ($isNaN(number) || number === 0) return 0;
		if (!$isFinite(number)) return number;
		return truncate(number);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/TypedArrayElementSize.js
var require_TypedArrayElementSize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var isInteger = require_isInteger$1();
	var whichTypedArray = require_which_typed_array();
	var tableTAO = require_typed_array_objects();
	module.exports = function TypedArrayElementSize(O) {
		var type = whichTypedArray(O);
		if (!type) throw new $TypeError("Assertion failed: `O` must be a TypedArray");
		var size = tableTAO.size["$" + tableTAO.name["$" + type]];
		if (!isInteger(size) || size < 0) throw new $SyntaxError("Assertion failed: Unknown TypedArray type `" + type + "`");
		return size;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/TypedArrayElementType.js
var require_TypedArrayElementType = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var whichTypedArray = require_which_typed_array();
	var tableTAO = require_typed_array_objects();
	module.exports = function TypedArrayElementType(O) {
		var type = whichTypedArray(O);
		if (!type) throw new $TypeError("Assertion failed: `O` must be a TypedArray");
		var result = tableTAO.name["$" + type];
		if (typeof result !== "string") throw new $SyntaxError("Assertion failed: Unknown TypedArray type `" + type + "`");
		return result;
	};
}));
//#endregion
//#region node_modules/es-abstract/GetIntrinsic.js
var require_GetIntrinsic = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_get_intrinsic();
}));
//#endregion
//#region node_modules/es-abstract/helpers/records/property-descriptor.js
var require_property_descriptor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var hasOwn = require_hasown();
	var allowed = {
		__proto__: null,
		"[[Configurable]]": true,
		"[[Enumerable]]": true,
		"[[Get]]": true,
		"[[Set]]": true,
		"[[Value]]": true,
		"[[Writable]]": true
	};
	module.exports = function isPropertyDescriptor(Desc) {
		if (!Desc || typeof Desc !== "object") return false;
		for (var key in Desc) if (hasOwn(Desc, key) && !allowed[key]) return false;
		var isData = hasOwn(Desc, "[[Value]]") || hasOwn(Desc, "[[Writable]]");
		var IsAccessor = hasOwn(Desc, "[[Get]]") || hasOwn(Desc, "[[Set]]");
		if (isData && IsAccessor) throw new $TypeError("Property Descriptors may not be both accessor and data descriptors");
		return true;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/DefineOwnProperty.js
var require_DefineOwnProperty = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasPropertyDescriptors = require_has_property_descriptors();
	var $defineProperty = require_es_define_property();
	var hasArrayLengthDefineBug = hasPropertyDescriptors.hasArrayLengthDefineBug();
	var isArray = hasArrayLengthDefineBug && require_IsArray$1();
	var $isEnumerable = require_call_bound()("Object.prototype.propertyIsEnumerable");
	module.exports = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
		if (!$defineProperty) {
			if (!IsDataDescriptor(desc)) return false;
			if (!desc["[[Configurable]]"] || !desc["[[Writable]]"]) return false;
			if (P in O && $isEnumerable(O, P) !== !!desc["[[Enumerable]]"]) return false;
			var V = desc["[[Value]]"];
			O[P] = V;
			return SameValue(O[P], V);
		}
		if (hasArrayLengthDefineBug && P === "length" && "[[Value]]" in desc && isArray(O) && O.length !== desc["[[Value]]"]) {
			O.length = desc["[[Value]]"];
			return O.length === desc["[[Value]]"];
		}
		$defineProperty(O, P, FromPropertyDescriptor(desc));
		return true;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/fromPropertyDescriptor.js
var require_fromPropertyDescriptor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function fromPropertyDescriptor(Desc) {
		if (typeof Desc === "undefined") return Desc;
		var obj = {};
		if ("[[Value]]" in Desc) obj.value = Desc["[[Value]]"];
		if ("[[Writable]]" in Desc) obj.writable = !!Desc["[[Writable]]"];
		if ("[[Get]]" in Desc) obj.get = Desc["[[Get]]"];
		if ("[[Set]]" in Desc) obj.set = Desc["[[Set]]"];
		if ("[[Enumerable]]" in Desc) obj.enumerable = !!Desc["[[Enumerable]]"];
		if ("[[Configurable]]" in Desc) obj.configurable = !!Desc["[[Configurable]]"];
		return obj;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/FromPropertyDescriptor.js
var require_FromPropertyDescriptor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var isPropertyDescriptor = require_property_descriptor();
	var fromPropertyDescriptor = require_fromPropertyDescriptor();
	module.exports = function FromPropertyDescriptor(Desc) {
		if (typeof Desc !== "undefined" && !isPropertyDescriptor(Desc)) throw new $TypeError("Assertion failed: `Desc` must be a Property Descriptor");
		return fromPropertyDescriptor(Desc);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/IsDataDescriptor.js
var require_IsDataDescriptor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var hasOwn = require_hasown();
	var isPropertyDescriptor = require_property_descriptor();
	module.exports = function IsDataDescriptor(Desc) {
		if (typeof Desc === "undefined") return false;
		if (!isPropertyDescriptor(Desc)) throw new $TypeError("Assertion failed: `Desc` must be a Property Descriptor");
		if (!hasOwn(Desc, "[[Value]]") && !hasOwn(Desc, "[[Writable]]")) return false;
		return true;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/IsCallable.js
var require_IsCallable$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_is_callable();
}));
//#endregion
//#region node_modules/es-abstract/2025/ToBoolean.js
var require_ToBoolean = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function ToBoolean(value) {
		return !!value;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ToPropertyDescriptor.js
var require_ToPropertyDescriptor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasOwn = require_hasown();
	var $TypeError = require_type();
	var isObject = require_isObject$1();
	var IsCallable = require_IsCallable$1();
	var ToBoolean = require_ToBoolean();
	module.exports = function ToPropertyDescriptor(Obj) {
		if (!isObject(Obj)) throw new $TypeError("ToPropertyDescriptor requires an object");
		var desc = {};
		if (hasOwn(Obj, "enumerable")) desc["[[Enumerable]]"] = ToBoolean(Obj.enumerable);
		if (hasOwn(Obj, "configurable")) desc["[[Configurable]]"] = ToBoolean(Obj.configurable);
		if (hasOwn(Obj, "value")) desc["[[Value]]"] = Obj.value;
		if (hasOwn(Obj, "writable")) desc["[[Writable]]"] = ToBoolean(Obj.writable);
		if (hasOwn(Obj, "get")) {
			var getter = Obj.get;
			if (typeof getter !== "undefined" && !IsCallable(getter)) throw new $TypeError("getter must be a function");
			desc["[[Get]]"] = getter;
		}
		if (hasOwn(Obj, "set")) {
			var setter = Obj.set;
			if (typeof setter !== "undefined" && !IsCallable(setter)) throw new $TypeError("setter must be a function");
			desc["[[Set]]"] = setter;
		}
		if ((hasOwn(desc, "[[Get]]") || hasOwn(desc, "[[Set]]")) && (hasOwn(desc, "[[Value]]") || hasOwn(desc, "[[Writable]]"))) throw new $TypeError("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute");
		return desc;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/DefinePropertyOrThrow.js
var require_DefinePropertyOrThrow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var isObject = require_isObject$1();
	var isPropertyDescriptor = require_property_descriptor();
	var DefineOwnProperty = require_DefineOwnProperty();
	var FromPropertyDescriptor = require_FromPropertyDescriptor();
	var IsDataDescriptor = require_IsDataDescriptor();
	var isPropertyKey = require_isPropertyKey$1();
	var SameValue = require_SameValue();
	var ToPropertyDescriptor = require_ToPropertyDescriptor();
	module.exports = function DefinePropertyOrThrow(O, P, desc) {
		if (!isObject(O)) throw new $TypeError("Assertion failed: Type(O) is not Object");
		if (!isPropertyKey(P)) throw new $TypeError("Assertion failed: P is not a Property Key");
		var Desc = isPropertyDescriptor(desc) ? desc : ToPropertyDescriptor(desc);
		if (!isPropertyDescriptor(Desc)) throw new $TypeError("Assertion failed: Desc is not a valid Property Descriptor");
		return DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, Desc);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/IsConstructor.js
var require_IsConstructor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $construct = require_GetIntrinsic()("%Reflect.construct%", true);
	var DefinePropertyOrThrow = require_DefinePropertyOrThrow();
	try {
		DefinePropertyOrThrow({}, "", { "[[Get]]": function() {} });
	} catch (e) {
		DefinePropertyOrThrow = null;
	}
	if (DefinePropertyOrThrow && $construct) {
		var isConstructorMarker = {};
		var badArrayLike = {};
		DefinePropertyOrThrow(badArrayLike, "length", {
			"[[Get]]": function() {
				throw isConstructorMarker;
			},
			"[[Enumerable]]": true
		});
		module.exports = function IsConstructor(argument) {
			try {
				$construct(argument, badArrayLike);
			} catch (err) {
				return err === isConstructorMarker;
			}
		};
	} else module.exports = function IsConstructor(argument) {
		return typeof argument === "function" && !!argument.prototype;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/SpeciesConstructor.js
var require_SpeciesConstructor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $species = require_get_intrinsic()("%Symbol.species%", true);
	var $TypeError = require_type();
	var isObject = require_isObject$1();
	var IsConstructor = require_IsConstructor();
	module.exports = function SpeciesConstructor(O, defaultConstructor) {
		if (!isObject(O)) throw new $TypeError("Assertion failed: Type(O) is not Object");
		var C = O.constructor;
		if (typeof C === "undefined") return defaultConstructor;
		if (!isObject(C)) throw new $TypeError("O.constructor is not an Object");
		var S = $species ? C[$species] : void 0;
		if (S == null) return defaultConstructor;
		if (IsConstructor(S)) return S;
		throw new $TypeError("no constructor found");
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/IsFixedLengthArrayBuffer.js
var require_IsFixedLengthArrayBuffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var callBound = require_call_bound();
	var $arrayBufferResizable = callBound("%ArrayBuffer.prototype.resizable%", true);
	var $sharedArrayGrowable = callBound("%SharedArrayBuffer.prototype.growable%", true);
	var isArrayBuffer = require_is_array_buffer();
	var isSharedArrayBuffer = require_is_shared_array_buffer();
	module.exports = function IsFixedLengthArrayBuffer(arrayBuffer) {
		var isAB = isArrayBuffer(arrayBuffer);
		var isSAB = isSharedArrayBuffer(arrayBuffer);
		if (!isAB && !isSAB) throw new $TypeError("Assertion failed: `arrayBuffer` must be an ArrayBuffer or SharedArrayBuffer");
		if (isAB && $arrayBufferResizable) return !$arrayBufferResizable(arrayBuffer);
		if (isSAB && $sharedArrayGrowable) return !$sharedArrayGrowable(arrayBuffer);
		return true;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/isInteger.js
var require_isInteger = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_isInteger$1();
}));
//#endregion
//#region node_modules/es-abstract/helpers/records/typed-array-with-buffer-witness-record.js
var require_typed_array_with_buffer_witness_record = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasOwn = require_hasown();
	var isTypedArray = require_is_typed_array();
	var isInteger = require_isInteger();
	module.exports = function isTypedArrayWithBufferWitnessRecord(value) {
		return !!value && typeof value === "object" && hasOwn(value, "[[Object]]") && hasOwn(value, "[[CachedBufferByteLength]]") && (isInteger(value["[[CachedBufferByteLength]]"]) && value["[[CachedBufferByteLength]]"] >= 0 || value["[[CachedBufferByteLength]]"] === "DETACHED") && isTypedArray(value["[[Object]]"]);
	};
}));
//#endregion
//#region node_modules/es-abstract/2024/IsCallable.js
var require_IsCallable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_is_callable();
}));
//#endregion
//#region node_modules/es-abstract/helpers/isObject.js
var require_isObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_isObject$1();
}));
//#endregion
//#region node_modules/is-string/index.js
var require_is_string = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	/** @type {(receiver: ThisParameterType<typeof String.prototype.valueOf>, ...args: Parameters<typeof String.prototype.valueOf>) => ReturnType<typeof String.prototype.valueOf>} */
	var $strValueOf = callBound("String.prototype.valueOf");
	/** @type {import('.')} */
	var tryStringObject = function tryStringObject(value) {
		try {
			$strValueOf(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	/** @type {(receiver: ThisParameterType<typeof Object.prototype.toString>, ...args: Parameters<typeof Object.prototype.toString>) => ReturnType<typeof Object.prototype.toString>} */
	var $toString = callBound("Object.prototype.toString");
	var strClass = "[object String]";
	var hasToStringTag = require_shams()();
	/** @type {import('.')} */
	module.exports = function isString(value) {
		if (typeof value === "string") return true;
		if (!value || typeof value !== "object") return false;
		return hasToStringTag ? tryStringObject(value) : $toString(value) === strClass;
	};
}));
//#endregion
//#region node_modules/is-number-object/index.js
var require_is_number_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var $numToStr = callBound("Number.prototype.toString");
	/** @type {import('.')} */
	var tryNumberObject = function tryNumberObject(value) {
		try {
			$numToStr(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var $toString = callBound("Object.prototype.toString");
	var numClass = "[object Number]";
	var hasToStringTag = require_shams()();
	/** @type {import('.')} */
	module.exports = function isNumberObject(value) {
		if (typeof value === "number") return true;
		if (!value || typeof value !== "object") return false;
		return hasToStringTag ? tryNumberObject(value) : $toString(value) === numClass;
	};
}));
//#endregion
//#region node_modules/is-boolean-object/index.js
var require_is_boolean_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var $boolToStr = callBound("Boolean.prototype.toString");
	var $toString = callBound("Object.prototype.toString");
	/** @type {import('.')} */
	var tryBooleanObject = function booleanBrandCheck(value) {
		try {
			$boolToStr(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var boolClass = "[object Boolean]";
	var hasToStringTag = require_shams()();
	/** @type {import('.')} */
	module.exports = function isBoolean(value) {
		if (typeof value === "boolean") return true;
		if (value === null || typeof value !== "object") return false;
		return hasToStringTag ? tryBooleanObject(value) : $toString(value) === boolClass;
	};
}));
//#endregion
//#region node_modules/has-bigints/index.js
var require_has_bigints = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $BigInt = typeof BigInt !== "undefined" && BigInt;
	/** @type {import('.')} */
	module.exports = function hasNativeBigInts() {
		return typeof $BigInt === "function" && typeof BigInt === "function" && typeof $BigInt(42) === "bigint" && typeof BigInt(42) === "bigint";
	};
}));
//#endregion
//#region node_modules/is-bigint/index.js
var require_is_bigint = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	if (require_has_bigints()()) {
		var bigIntValueOf = BigInt.prototype.valueOf;
		/** @type {(value: object) => value is BigInt} */
		var tryBigInt = function tryBigIntObject(value) {
			try {
				bigIntValueOf.call(value);
				return true;
			} catch (e) {}
			return false;
		};
		/** @type {import('.')} */
		module.exports = function isBigInt(value) {
			if (value === null || typeof value === "undefined" || typeof value === "boolean" || typeof value === "string" || typeof value === "number" || typeof value === "symbol" || typeof value === "function") return false;
			if (typeof value === "bigint") return true;
			return tryBigInt(value);
		};
	} else
 /** @type {import('.')} */
	module.exports = function isBigInt(value) {
		return false;
	};
}));
//#endregion
//#region node_modules/which-boxed-primitive/index.js
var require_which_boxed_primitive = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isString = require_is_string();
	var isNumber = require_is_number_object();
	var isBoolean = require_is_boolean_object();
	var isSymbol = require_is_symbol();
	var isBigInt = require_is_bigint();
	/** @type {import('.')} */
	module.exports = function whichBoxedPrimitive(value) {
		if (value == null || typeof value !== "object" && typeof value !== "function") return null;
		if (isString(value)) return "String";
		if (isNumber(value)) return "Number";
		if (isBoolean(value)) return "Boolean";
		if (isSymbol(value)) return "Symbol";
		if (isBigInt(value)) return "BigInt";
	};
}));
//#endregion
//#region node_modules/is-map/index.js
var require_is_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @const */
	var $Map = typeof Map === "function" && Map.prototype ? Map : null;
	var $Set = typeof Set === "function" && Set.prototype ? Set : null;
	var exported;
	if (!$Map)
 /** @type {import('.')} */
	exported = function isMap(x) {
		return false;
	};
	var $mapHas = $Map ? Map.prototype.has : null;
	var $setHas = $Set ? Set.prototype.has : null;
	if (!exported && !$mapHas)
 /** @type {import('.')} */
	exported = function isMap(x) {
		return false;
	};
	/** @type {import('.')} */
	module.exports = exported || function isMap(x) {
		if (!x || typeof x !== "object") return false;
		try {
			$mapHas.call(x);
			if ($setHas) try {
				$setHas.call(x);
			} catch (e) {
				return true;
			}
			return x instanceof $Map;
		} catch (e) {}
		return false;
	};
}));
//#endregion
//#region node_modules/is-set/index.js
var require_is_set = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $Map = typeof Map === "function" && Map.prototype ? Map : null;
	var $Set = typeof Set === "function" && Set.prototype ? Set : null;
	var exported;
	if (!$Set)
 /** @type {import('.')} */
	exported = function isSet(x) {
		return false;
	};
	var $mapHas = $Map ? Map.prototype.has : null;
	var $setHas = $Set ? Set.prototype.has : null;
	if (!exported && !$setHas)
 /** @type {import('.')} */
	exported = function isSet(x) {
		return false;
	};
	/** @type {import('.')} */
	module.exports = exported || function isSet(x) {
		if (!x || typeof x !== "object") return false;
		try {
			$setHas.call(x);
			if ($mapHas) try {
				$mapHas.call(x);
			} catch (e) {
				return true;
			}
			return x instanceof $Set;
		} catch (e) {}
		return false;
	};
}));
//#endregion
//#region node_modules/is-weakmap/index.js
var require_is_weakmap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $WeakMap = typeof WeakMap === "function" && WeakMap.prototype ? WeakMap : null;
	var $WeakSet = typeof WeakSet === "function" && WeakSet.prototype ? WeakSet : null;
	var exported;
	if (!$WeakMap)
 /** @type {import('.')} */
	exported = function isWeakMap(x) {
		return false;
	};
	var $mapHas = $WeakMap ? $WeakMap.prototype.has : null;
	var $setHas = $WeakSet ? $WeakSet.prototype.has : null;
	if (!exported && !$mapHas)
 /** @type {import('.')} */
	exported = function isWeakMap(x) {
		return false;
	};
	/** @type {import('.')} */
	module.exports = exported || function isWeakMap(x) {
		if (!x || typeof x !== "object") return false;
		try {
			$mapHas.call(x, $mapHas);
			if ($setHas) try {
				$setHas.call(x, $setHas);
			} catch (e) {
				return true;
			}
			return x instanceof $WeakMap;
		} catch (e) {}
		return false;
	};
}));
//#endregion
//#region node_modules/is-weakset/index.js
var require_is_weakset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBound = require_call_bound();
	var $WeakSet = GetIntrinsic("%WeakSet%", true);
	/** @type {undefined | (<V>(thisArg: Set<V>, value: V) => boolean)} */
	var $setHas = callBound("WeakSet.prototype.has", true);
	if ($setHas) {
		/** @type {undefined | (<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean)} */
		var $mapHas = callBound("WeakMap.prototype.has", true);
		/** @type {import('.')} */
		module.exports = function isWeakSet(x) {
			if (!x || typeof x !== "object") return false;
			try {
				$setHas(x, $setHas);
				if ($mapHas) try {
					$mapHas(x, $mapHas);
				} catch (e) {
					return true;
				}
				return x instanceof $WeakSet;
			} catch (e) {}
			return false;
		};
	} else
 /** @type {import('.')} */
	module.exports = function isWeakSet(x) {
		return false;
	};
}));
//#endregion
//#region node_modules/which-collection/index.js
var require_which_collection = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isMap = require_is_map();
	var isSet = require_is_set();
	var isWeakMap = require_is_weakmap();
	var isWeakSet = require_is_weakset();
	/** @type {import('.')} */
	module.exports = function whichCollection(value) {
		if (value && typeof value === "object") {
			if (isMap(value)) return "Map";
			if (isSet(value)) return "Set";
			if (isWeakMap(value)) return "WeakMap";
			if (isWeakSet(value)) return "WeakSet";
		}
		return false;
	};
}));
//#endregion
//#region node_modules/is-weakref/index.js
var require_is_weakref = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $deref = require_call_bound()("WeakRef.prototype.deref", true);
	/** @type {import('.')} */
	module.exports = typeof WeakRef === "undefined" ? function isWeakRef(_value) {
		return false;
	} : function isWeakRef(value) {
		if (!value || typeof value !== "object") return false;
		try {
			$deref(value);
			return true;
		} catch (e) {
			return false;
		}
	};
}));
//#endregion
//#region node_modules/is-finalizationregistry/index.js
var require_is_finalizationregistry = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {undefined | ((value: ThisParameterType<typeof FinalizationRegistry.prototype.register>, ...args: Parameters<typeof FinalizationRegistry.prototype.register>) => ReturnType<typeof FinalizationRegistry.prototype.register>)} */
	var $register = require_call_bound()("FinalizationRegistry.prototype.register", true);
	/** @type {import('.')} */
	module.exports = $register ? function isFinalizationRegistry(value) {
		if (!value || typeof value !== "object") return false;
		try {
			$register(value, {}, null);
			return true;
		} catch (e) {
			return false;
		}
	} : function isFinalizationRegistry(value) {
		return false;
	};
}));
//#endregion
//#region node_modules/functions-have-names/index.js
var require_functions_have_names = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var functionsHaveNames = function functionsHaveNames() {
		return typeof function f() {}.name === "string";
	};
	var gOPD = Object.getOwnPropertyDescriptor;
	if (gOPD) try {
		gOPD([], "length");
	} catch (e) {
		gOPD = null;
	}
	functionsHaveNames.functionsHaveConfigurableNames = function functionsHaveConfigurableNames() {
		if (!functionsHaveNames() || !gOPD) return false;
		var desc = gOPD(function() {}, "name");
		return !!desc && !!desc.configurable;
	};
	var $bind = Function.prototype.bind;
	functionsHaveNames.boundFunctionsHaveNames = function boundFunctionsHaveNames() {
		return functionsHaveNames() && typeof $bind === "function" && function f() {}.bind().name !== "";
	};
	module.exports = functionsHaveNames;
}));
//#endregion
//#region node_modules/is-document.all/index.js
var require_is_document_all = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var toStr = require_call_bound()("Object.prototype.toString");
	var isIE68 = !(0 in [,]);
	var objectClass = "[object Object]";
	var ddaClass = "[object HTMLAllCollection]";
	/** @type {(() => false) | ((value: unknown) => value is HTMLAllCollection)} */
	var isDDA = function isDocumentDotAll() {
		return false;
	};
	if (typeof document === "object") {
		var all = document.all;
		if (toStr(all) === toStr(document.all)) isDDA = (function isDocumentDotAll(value) {
			if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) try {
				var str = toStr(value);
				return (str === ddaClass || str === objectClass) && value("") == null;
			} catch (e) {}
			return false;
		});
	}
	module.exports = isDDA;
}));
//#endregion
//#region node_modules/function.prototype.name/implementation.js
var require_implementation$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var IsCallable = require_is_callable();
	var hasOwn = require_hasown();
	var functionsHaveNames = require_functions_have_names()();
	var $TypeError = require_type();
	var callBound = require_call_bound();
	var isDDA = require_is_document_all();
	var $functionToString = callBound("Function.prototype.toString");
	var $stringMatch = callBound("String.prototype.match");
	var classRegex = /^class /;
	/** @param {unknown} fn */
	var isClass = function isClassConstructor(fn) {
		if (IsCallable(fn)) return false;
		if (typeof fn !== "function") return false;
		try {
			return !!$stringMatch($functionToString(fn), classRegex);
		} catch (e) {}
		return false;
	};
	var regex = /\s*function\s+([^(\s]*)\s*/;
	var functionProto = Function.prototype;
	/** @type {import('./implementation')} */
	module.exports = function getName() {
		if (isDDA(this) || !isClass(this) && !IsCallable(this)) throw new $TypeError("Function.prototype.name sham getter called on non-function");
		if (functionsHaveNames && hasOwn(this, "name")) return this.name;
		if (this === functionProto) return "";
		var match = $stringMatch($functionToString(this), regex);
		return match && match[1];
	};
}));
//#endregion
//#region node_modules/function.prototype.name/polyfill.js
var require_polyfill$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation$2();
	/** @type {import('./polyfill')} */
	module.exports = function getPolyfill() {
		return implementation;
	};
}));
//#endregion
//#region node_modules/function.prototype.name/shim.js
var require_shim$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var supportsDescriptors = require_has_property_descriptors()();
	var functionsHaveNames = require_functions_have_names()();
	var $TypeError = require_type();
	var getPolyfill = require_polyfill$2();
	var defineProperty = require_es_define_property();
	/** @type {import('./shim')} */
	module.exports = function shimName() {
		var polyfill = getPolyfill();
		if (functionsHaveNames) return polyfill;
		if (!supportsDescriptors || !defineProperty) throw new $TypeError("Shimming Function.prototype.name support requires ES5 property descriptor support.");
		var functionProto = Function.prototype;
		defineProperty(functionProto, "name", {
			configurable: true,
			enumerable: false,
			get: function() {
				var name = polyfill.call(this);
				if (this !== functionProto)
 /** @type {Exclude<typeof defineProperty, false>} */ defineProperty(this, "name", {
					configurable: true,
					enumerable: false,
					value: name,
					writable: false
				});
				return name;
			}
		});
		return polyfill;
	};
}));
//#endregion
//#region node_modules/function.prototype.name/index.js
var require_function_prototype_name = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBind = require_call_bind();
	var implementation = require_implementation$2();
	var getPolyfill = require_polyfill$2();
	var shim = require_shim$1();
	/** @type {import('.')} */
	module.exports = callBind(implementation);
	module.exports.getPolyfill = getPolyfill;
	module.exports.implementation = implementation;
	module.exports.shim = shim;
}));
//#endregion
//#region node_modules/generator-function/index.js
var require_generator_function = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var cached = function* () {}.constructor;
	/** @type {import('.')} */
	module.exports = () => cached;
}));
//#endregion
//#region node_modules/is-generator-function/index.js
var require_is_generator_function = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var isFnRegex = require_safe_regex_test()(/^\s*(?:function)?\*/);
	var hasToStringTag = require_shams()();
	var getProto = require_get_proto();
	var toStr = callBound("Object.prototype.toString");
	var fnToStr = callBound("Function.prototype.toString");
	var getGeneratorFunction = require_generator_function();
	/** @type {import('.')} */
	module.exports = function isGeneratorFunction(fn) {
		if (typeof fn !== "function") return false;
		if (isFnRegex(fnToStr(fn))) return true;
		if (!hasToStringTag) return toStr(fn) === "[object GeneratorFunction]";
		if (!getProto) return false;
		var GeneratorFunction = getGeneratorFunction();
		return GeneratorFunction && getProto(fn) === GeneratorFunction.prototype;
	};
}));
//#endregion
//#region node_modules/is-async-function/index.js
var require_is_async_function = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var safeRegexTest = require_safe_regex_test();
	var toStr = callBound("Object.prototype.toString");
	var fnToStr = callBound("Function.prototype.toString");
	var isFnRegex = safeRegexTest(/^\s*async(?:\s+function(?:\s+|\()|\s*\()/);
	var hasToStringTag = require_shams()();
	var getProto = require_get_proto();
	var getAsyncFunc = require_async_function();
	/** @type {import('.')} */
	module.exports = function isAsyncFunction(fn) {
		if (typeof fn !== "function") return false;
		if (isFnRegex(fnToStr(fn))) return true;
		if (!hasToStringTag) return toStr(fn) === "[object AsyncFunction]";
		if (!getProto) return false;
		var asyncFunc = getAsyncFunc();
		return asyncFunc && asyncFunc.prototype === getProto(fn);
	};
}));
//#endregion
//#region node_modules/which-builtin-type/index.js
var require_which_builtin_type = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var whichBoxedPrimitive = require_which_boxed_primitive();
	var whichCollection = require_which_collection();
	var whichTypedArray = require_which_typed_array();
	var isArray = require_isarray();
	var isDate = require_is_date_object();
	var isRegex = require_is_regex();
	var isWeakRef = require_is_weakref();
	var isFinalizationRegistry = require_is_finalizationregistry();
	var name = require_function_prototype_name();
	var isGeneratorFunction = require_is_generator_function();
	var isAsyncFunction = require_is_async_function();
	var callBound = require_call_bound();
	var toStringTag = require_shams()() && Symbol.toStringTag;
	var $Object = Object;
	/** @type {undefined | ((value: ThisParameterType<typeof Promise.prototype.then>, ...args: Parameters<typeof Promise.prototype.then>) => ReturnType<typeof Promise.prototype.then>)} */
	var promiseThen = callBound("Promise.prototype.then", true);
	/** @type {<T = unknown>(value: unknown) => value is Promise<T>} */
	var isPromise = function isPromise(value) {
		if (!value || typeof value !== "object" || !promiseThen) return false;
		try {
			promiseThen(value, null, function() {});
			return true;
		} catch (e) {}
		return false;
	};
	/** @type {(builtinName: unknown) => boolean} */
	var isKnownBuiltin = function isKnownBuiltin(builtinName) {
		return !!builtinName && builtinName !== "BigInt" && builtinName !== "Boolean" && builtinName !== "Null" && builtinName !== "Number" && builtinName !== "String" && builtinName !== "Symbol" && builtinName !== "Undefined" && builtinName !== "Math" && builtinName !== "JSON" && builtinName !== "Reflect" && builtinName !== "Atomics" && builtinName !== "Map" && builtinName !== "Set" && builtinName !== "WeakMap" && builtinName !== "WeakSet" && builtinName !== "BigInt64Array" && builtinName !== "BigUint64Array" && builtinName !== "Float32Array" && builtinName !== "Float64Array" && builtinName !== "Int16Array" && builtinName !== "Int32Array" && builtinName !== "Int8Array" && builtinName !== "Uint16Array" && builtinName !== "Uint32Array" && builtinName !== "Uint8Array" && builtinName !== "Uint8ClampedArray" && builtinName !== "Array" && builtinName !== "Date" && builtinName !== "FinalizationRegistry" && builtinName !== "Promise" && builtinName !== "RegExp" && builtinName !== "WeakRef" && builtinName !== "Function" && builtinName !== "GeneratorFunction" && builtinName !== "AsyncFunction";
	};
	/** @type {import('.')} */
	module.exports = function whichBuiltinType(value) {
		if (value == null) return value;
		var which = whichBoxedPrimitive($Object(value)) || whichCollection(value) || whichTypedArray(value);
		if (which) return which;
		if (isArray(value)) return "Array";
		if (isDate(value)) return "Date";
		if (isRegex(value)) return "RegExp";
		if (isWeakRef(value)) return "WeakRef";
		if (isFinalizationRegistry(value)) return "FinalizationRegistry";
		if (typeof value === "function") {
			if (isGeneratorFunction(value)) return "GeneratorFunction";
			if (isAsyncFunction(value)) return "AsyncFunction";
			return "Function";
		}
		if (isPromise(value)) return "Promise";
		if (toStringTag && toStringTag in value) {
			var tag = value[toStringTag];
			if (isKnownBuiltin(tag)) return tag;
		}
		if (typeof value.constructor === "function") {
			var constructorName = name(value.constructor);
			if (isKnownBuiltin(constructorName)) return constructorName;
		}
		return "Object";
	};
}));
//#endregion
//#region node_modules/reflect.getprototypeof/implementation.js
var require_implementation$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var IsCallable = require_IsCallable();
	var isObject = require_isObject();
	var whichBuiltinType = require_which_builtin_type();
	var $TypeError = require_type();
	var gPO = require_get_proto();
	var $Object = require_es_object_atoms();
	module.exports = function getPrototypeOf(O) {
		if (!isObject(O)) throw new $TypeError("Reflect.getPrototypeOf called on non-object");
		if (gPO) return gPO(O);
		var type = whichBuiltinType(O);
		if (type) {
			var intrinsic = GetIntrinsic("%" + type + ".prototype%", true);
			if (intrinsic) return intrinsic;
		}
		if (IsCallable(O.constructor)) return O.constructor.prototype;
		if (O instanceof Object) return $Object.prototype;
		return null;
	};
}));
//#endregion
//#region node_modules/reflect.getprototypeof/polyfill.js
var require_polyfill$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation$1();
	var getProto = require_get_proto();
	module.exports = function getPolyfill() {
		if (typeof Reflect === "object" && Reflect && Reflect.getPrototypeOf) return Reflect.getPrototypeOf;
		return getProto ? function getPrototypeOf(O) {
			return getProto(O);
		} : implementation;
	};
}));
//#endregion
//#region node_modules/typed-array-byte-offset/index.js
var require_typed_array_byte_offset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var forEach = require_for_each();
	var callBind = require_call_bind();
	var gPO = require_polyfill$1()();
	var typedArrays = require_available_typed_arrays()();
	/** @import { TypedArrayName, ByteOffsetGetter, Implementation } from '.' */
	/** @type {Record<TypedArrayName, ByteOffsetGetter>} */
	var getters = { __proto__: null };
	var gOPD = require_gopd();
	var oDP = Object.defineProperty;
	if (gOPD) {
		/** @type {ByteOffsetGetter} */
		var getByteOffset = function(x) {
			return x.byteOffset;
		};
		forEach(typedArrays, function(typedArray) {
			if (typeof global[typedArray] === "function" || typeof global[typedArray] === "object") {
				var Proto = global[typedArray].prototype;
				var descriptor = gOPD(Proto, "byteOffset");
				if (!descriptor) descriptor = gOPD(gPO(Proto), "byteOffset");
				if (descriptor && descriptor.get) getters[typedArray] = callBind(descriptor.get);
				else if (oDP) {
					var arr = new global[typedArray](2);
					descriptor = gOPD(arr, "byteOffset");
					if (descriptor && descriptor.configurable) oDP(arr, "length", { value: 3 });
					if (arr.length === 2) getters[typedArray] = getByteOffset;
				}
			}
		});
	}
	/** @type {ByteOffsetGetter} */
	var tryTypedArrays = function tryAllTypedArrays(value) {
		/** @type {number} */ var foundOffset;
		forEach(getters, function(getter) {
			if (typeof foundOffset !== "number") try {
				var offset = getter(value);
				if (typeof offset === "number") foundOffset = offset;
			} catch (e) {}
		});
		return foundOffset;
	};
	var isTypedArray = require_is_typed_array();
	/** @type {Implementation} */
	module.exports = function typedArrayByteOffset(value) {
		if (!isTypedArray(value)) return false;
		return tryTypedArrays(value);
	};
}));
//#endregion
//#region node_modules/typed-array-length/index.js
var require_typed_array_length = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBind = require_call_bind();
	var forEach = require_for_each();
	var gOPD = require_gopd();
	var isTypedArray = require_is_typed_array();
	var typedArrays = require_possible_typed_array_names();
	var gPO = require_polyfill$1()();
	/** @typedef {(value: import('.').TypedArray) => number} TypedArrayLengthGetter */
	/** @typedef {{ [k in `$${import('.').TypedArrayName}` | '__proto__']: k extends '__proto__' ? null : TypedArrayLengthGetter }} Cache */
	/** @type {Cache} */
	var getters = { __proto__: null };
	var oDP = Object.defineProperty;
	if (gOPD) {
		var getLength = function(x) {
			return x.length;
		};
		forEach(
			typedArrays,
			/** @type {(typedArray: import('.').TypedArrayName) => void} */
			function(typedArray) {
				var TA = global[typedArray];
				if (typeof TA === "function" || typeof TA === "object") {
					var Proto = TA.prototype;
					var descriptor = gOPD(Proto, "length");
					if (!descriptor) descriptor = gOPD(gPO(Proto), "length");
					if (descriptor && descriptor.get) getters["$" + typedArray] = callBind(descriptor.get);
					else if (oDP) {
						var arr = new global[typedArray](2);
						descriptor = gOPD(arr, "length");
						if (descriptor && descriptor.configurable) oDP(arr, "length", { value: 3 });
						if (arr.length === 2) getters["$" + typedArray] = getLength;
					}
				}
			}
		);
	}
	/** @type {TypedArrayLengthGetter} */
	var tryTypedArrays = function tryAllTypedArrays(value) {
		/** @type {number} */ var foundLength;
		forEach(
			getters,
			/** @type {(getter: TypedArrayLengthGetter) => void} */
			function(getter) {
				if (typeof foundLength !== "number") try {
					var length = getter(value);
					if (typeof length === "number") foundLength = length;
				} catch (e) {}
			}
		);
		return foundLength;
	};
	/** @type {import('.')} */
	module.exports = function typedArrayLength(value) {
		if (!isTypedArray(value)) return false;
		return tryTypedArrays(value);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/IsTypedArrayOutOfBounds.js
var require_IsTypedArrayOutOfBounds = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var IsDetachedBuffer = require_IsDetachedBuffer();
	var IsFixedLengthArrayBuffer = require_IsFixedLengthArrayBuffer();
	var TypedArrayElementSize = require_TypedArrayElementSize();
	var isTypedArrayWithBufferWitnessRecord = require_typed_array_with_buffer_witness_record();
	var typedArrayBuffer = require_typed_array_buffer();
	var typedArrayByteOffset = require_typed_array_byte_offset();
	var typedArrayLength = require_typed_array_length();
	module.exports = function IsTypedArrayOutOfBounds(taRecord) {
		if (!isTypedArrayWithBufferWitnessRecord(taRecord)) throw new $TypeError("Assertion failed: `taRecord` must be a TypedArray With Buffer Witness Record");
		var O = taRecord["[[Object]]"];
		var bufferByteLength = taRecord["[[CachedBufferByteLength]]"];
		if (IsDetachedBuffer(typedArrayBuffer(O)) && bufferByteLength !== "DETACHED") throw new $TypeError("Assertion failed: typed array is detached only if the byte length is ~DETACHED~");
		if (bufferByteLength === "DETACHED") return true;
		var byteOffsetStart = typedArrayByteOffset(O);
		var isFixed = IsFixedLengthArrayBuffer(typedArrayBuffer(O));
		var byteOffsetEnd;
		var length = isFixed ? typedArrayLength(O) : "AUTO";
		if (length === "AUTO") byteOffsetEnd = bufferByteLength;
		else byteOffsetEnd = byteOffsetStart + length * TypedArrayElementSize(O);
		if (byteOffsetStart > bufferByteLength || byteOffsetEnd > bufferByteLength) return true;
		return false;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/TypedArrayLength.js
var require_TypedArrayLength = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var floor = require_floor();
	var IsFixedLengthArrayBuffer = require_IsFixedLengthArrayBuffer();
	var IsTypedArrayOutOfBounds = require_IsTypedArrayOutOfBounds();
	var TypedArrayElementSize = require_TypedArrayElementSize();
	var isTypedArrayWithBufferWitnessRecord = require_typed_array_with_buffer_witness_record();
	var typedArrayBuffer = require_typed_array_buffer();
	var typedArrayByteOffset = require_typed_array_byte_offset();
	var typedArrayLength = require_typed_array_length();
	module.exports = function TypedArrayLength(taRecord) {
		if (!isTypedArrayWithBufferWitnessRecord(taRecord)) throw new $TypeError("Assertion failed: `taRecord` must be a TypedArray With Buffer Witness Record");
		if (IsTypedArrayOutOfBounds(taRecord)) throw new $TypeError("Assertion failed: `taRecord` is out of bounds");
		var O = taRecord["[[Object]]"];
		var isFixed = IsFixedLengthArrayBuffer(typedArrayBuffer(O));
		var length = isFixed ? typedArrayLength(O) : "AUTO";
		if (length !== "AUTO") return length;
		if (isFixed) throw new $TypeError("Assertion failed: array buffer is not fixed length");
		var byteOffset = typedArrayByteOffset(O);
		var elementSize = TypedArrayElementSize(O);
		var byteLength = taRecord["[[CachedBufferByteLength]]"];
		if (byteLength === "DETACHED") throw new $TypeError("Assertion failed: typed array is detached");
		return floor((byteLength - byteOffset) / elementSize);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ArrayBufferByteLength.js
var require_ArrayBufferByteLength = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var IsDetachedBuffer = require_IsDetachedBuffer();
	var isArrayBuffer = require_is_array_buffer();
	var isSharedArrayBuffer = require_is_shared_array_buffer();
	var arrayBufferByteLength = require_array_buffer_byte_length();
	var $sabByteLength = require_call_bound()("SharedArrayBuffer.prototype.byteLength", true);
	var isGrowable = false;
	module.exports = function ArrayBufferByteLength(arrayBuffer, order) {
		var isSAB = isSharedArrayBuffer(arrayBuffer);
		if (!isArrayBuffer(arrayBuffer) && !isSAB) throw new $TypeError("Assertion failed: `arrayBuffer` must be an ArrayBuffer or a SharedArrayBuffer");
		if (order !== "SEQ-CST" && order !== "UNORDERED") throw new $TypeError("Assertion failed: `order` must be ~SEQ-CST~ or ~UNORDERED~");
		if (isSAB && isGrowable) {}
		if (IsDetachedBuffer(arrayBuffer)) throw new $TypeError("Assertion failed: `arrayBuffer` must not be detached");
		return isSAB ? $sabByteLength(arrayBuffer) : arrayBufferByteLength(arrayBuffer);
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/MakeTypedArrayWithBufferWitnessRecord.js
var require_MakeTypedArrayWithBufferWitnessRecord = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var ArrayBufferByteLength = require_ArrayBufferByteLength();
	var IsDetachedBuffer = require_IsDetachedBuffer();
	var isTypedArray = require_is_typed_array();
	var typedArrayBuffer = require_typed_array_buffer();
	module.exports = function MakeTypedArrayWithBufferWitnessRecord(obj, order) {
		if (!isTypedArray(obj)) throw new $TypeError("Assertion failed: `obj` must be a Typed Array");
		if (order !== "SEQ-CST" && order !== "UNORDERED") throw new $TypeError("Assertion failed: `order` must be ~SEQ-CST~ or ~UNORDERED~");
		var buffer = typedArrayBuffer(obj);
		return {
			"[[Object]]": obj,
			"[[CachedBufferByteLength]]": IsDetachedBuffer(buffer) ? "DETACHED" : ArrayBufferByteLength(buffer, order)
		};
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/ValidateTypedArray.js
var require_ValidateTypedArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var isObject = require_isObject$1();
	var IsTypedArrayOutOfBounds = require_IsTypedArrayOutOfBounds();
	var MakeTypedArrayWithBufferWitnessRecord = require_MakeTypedArrayWithBufferWitnessRecord();
	var isTypedArray = require_is_typed_array();
	module.exports = function ValidateTypedArray(O, order) {
		if (order !== "SEQ-CST" && order !== "UNORDERED") throw new $TypeError("Assertion failed: `order` must be ~SEQ-CST~ or ~UNORDERED~");
		if (!isObject(O)) throw new $TypeError("Assertion failed: `O` must be an Object");
		if (!isTypedArray(O)) throw new $TypeError("Assertion failed: `O` must be a Typed Array");
		var taRecord = MakeTypedArrayWithBufferWitnessRecord(O, order);
		if (IsTypedArrayOutOfBounds(taRecord)) throw new $TypeError("`O` must be in-bounds and backed by a non-detached buffer");
		return taRecord;
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/TypedArrayCreateFromConstructor.js
var require_TypedArrayCreateFromConstructor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var IsArray = require_IsArray();
	var IsConstructor = require_IsConstructor();
	var IsTypedArrayOutOfBounds = require_IsTypedArrayOutOfBounds();
	var TypedArrayLength = require_TypedArrayLength();
	var ValidateTypedArray = require_ValidateTypedArray();
	var availableTypedArrays = require_available_typed_arrays()();
	module.exports = function TypedArrayCreateFromConstructor(constructor, argumentList) {
		if (!IsConstructor(constructor)) throw new $TypeError("Assertion failed: `constructor` must be a constructor");
		if (!IsArray(argumentList)) throw new $TypeError("Assertion failed: `argumentList` must be a List");
		if (availableTypedArrays.length === 0) throw new $SyntaxError("Assertion failed: Typed Arrays are not supported in this environment");
		var newTypedArray;
		if (argumentList.length === 0) newTypedArray = new constructor();
		else if (argumentList.length === 1) newTypedArray = new constructor(argumentList[0]);
		else if (argumentList.length === 2) newTypedArray = new constructor(argumentList[0], argumentList[1]);
		else newTypedArray = new constructor(argumentList[0], argumentList[1], argumentList[2]);
		var taRecord = ValidateTypedArray(newTypedArray, "SEQ-CST");
		if (argumentList.length === 1 && typeof argumentList[0] === "number") {
			if (IsTypedArrayOutOfBounds(taRecord)) throw new $TypeError("new Typed Array is out of bounds");
			if (TypedArrayLength(taRecord) < argumentList[0]) throw new $TypeError("`argumentList[0]` must be <= `newTypedArray.length`");
		}
		return newTypedArray;
	};
}));
//#endregion
//#region node_modules/es-abstract/helpers/typedArrayConstructors.js
var require_typedArrayConstructors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var constructors = {
		__proto__: null,
		$Int8Array: GetIntrinsic("%Int8Array%", true),
		$Uint8Array: GetIntrinsic("%Uint8Array%", true),
		$Uint8ClampedArray: GetIntrinsic("%Uint8ClampedArray%", true),
		$Int16Array: GetIntrinsic("%Int16Array%", true),
		$Uint16Array: GetIntrinsic("%Uint16Array%", true),
		$Int32Array: GetIntrinsic("%Int32Array%", true),
		$Uint32Array: GetIntrinsic("%Uint32Array%", true),
		$BigInt64Array: GetIntrinsic("%BigInt64Array%", true),
		$BigUint64Array: GetIntrinsic("%BigUint64Array%", true),
		$Float16Array: GetIntrinsic("%Float16Array%", true),
		$Float32Array: GetIntrinsic("%Float32Array%", true),
		$Float64Array: GetIntrinsic("%Float64Array%", true)
	};
	module.exports = function getConstructor(kind) {
		return constructors["$" + kind];
	};
}));
//#endregion
//#region node_modules/es-abstract/2025/TypedArraySpeciesCreate.js
var require_TypedArraySpeciesCreate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var whichTypedArray = require_which_typed_array();
	var availableTypedArrays = require_available_typed_arrays()();
	var IsArray = require_IsArray();
	var SpeciesConstructor = require_SpeciesConstructor();
	var TypedArrayCreateFromConstructor = require_TypedArrayCreateFromConstructor();
	var getConstructor = require_typedArrayConstructors();
	module.exports = function TypedArraySpeciesCreate(exemplar, argumentList) {
		if (availableTypedArrays.length === 0) throw new $SyntaxError("Assertion failed: Typed Arrays are not supported in this environment");
		var kind = whichTypedArray(exemplar);
		if (!kind) throw new $TypeError("Assertion failed: exemplar must be a TypedArray");
		if (!IsArray(argumentList)) throw new $TypeError("Assertion failed: `argumentList` must be a List");
		var defaultConstructor = getConstructor(kind);
		if (typeof defaultConstructor !== "function") throw new $SyntaxError("Assertion failed: `constructor` of `exemplar` (" + kind + ") must exist. Please report this!");
		return TypedArrayCreateFromConstructor(SpeciesConstructor(exemplar, defaultConstructor), argumentList);
	};
}));
//#endregion
//#region node_modules/typedarray.prototype.slice/implementation.js
var require_implementation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var Get = require_Get();
	var GetValueFromBuffer = require_GetValueFromBuffer();
	var IsDetachedBuffer = require_IsDetachedBuffer();
	var max = require_max();
	var min = require_min();
	var Set = require_Set();
	var SetValueInBuffer = require_SetValueInBuffer();
	var ToIntegerOrInfinity = require_ToIntegerOrInfinity();
	var ToString = require_ToString();
	var TypedArrayElementSize = require_TypedArrayElementSize();
	var TypedArrayElementType = require_TypedArrayElementType();
	var TypedArraySpeciesCreate = require_TypedArraySpeciesCreate();
	var ValidateTypedArray = require_ValidateTypedArray();
	var typedArrayBuffer = require_typed_array_buffer();
	var typedArrayByteOffset = require_typed_array_byte_offset();
	module.exports = function slice(start, end) {
		var O = this;
		ValidateTypedArray(O, "SEQ-CST");
		var len = O.length;
		var relativeStart = ToIntegerOrInfinity(start);
		var k;
		if (relativeStart === -Infinity) k = 0;
		else if (relativeStart < 0) k = max(len + relativeStart, 0);
		else k = min(relativeStart, len);
		var relativeEnd = typeof end === "undefined" ? len : ToIntegerOrInfinity(end);
		var final;
		if (relativeEnd === -Infinity) final = 0;
		else if (relativeEnd < 0) final = max(len + relativeEnd, 0);
		else final = min(relativeEnd, len);
		var count = max(final - k, 0);
		var A = TypedArraySpeciesCreate(O, [count]);
		if (count > 0) {
			if (IsDetachedBuffer(typedArrayBuffer(O))) throw new $TypeError("Cannot use a Typed Array with an underlying ArrayBuffer that is detached");
			if (TypedArrayElementType(O) === TypedArrayElementType(A)) {
				var srcBuffer = typedArrayBuffer(O);
				var targetBuffer = typedArrayBuffer(A);
				var elementSize = TypedArrayElementSize(O);
				var srcByteOffset = typedArrayByteOffset(O);
				var srcByteIndex = k * elementSize + srcByteOffset;
				var targetByteIndex = typedArrayByteOffset(A);
				var limit = targetByteIndex + count * elementSize;
				while (targetByteIndex < limit) {
					var value = GetValueFromBuffer(srcBuffer, srcByteIndex, "UINT8", true, "UNORDERED");
					SetValueInBuffer(targetBuffer, targetByteIndex, "UINT8", value, true, "UNORDERED");
					srcByteIndex += 1;
					targetByteIndex += 1;
				}
			} else {
				var n = 0;
				while (k < final) {
					var kValue = Get(O, ToString(k));
					Set(A, ToString(n), kValue, true);
					k += 1;
					n += 1;
				}
			}
		}
		return A;
	};
}));
//#endregion
//#region node_modules/typedarray.prototype.slice/polyfill.js
var require_polyfill = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation();
	module.exports = function getPolyfill() {
		if (typeof Uint8Array === "function" && Uint8Array.prototype.slice) {
			var ta = /* @__PURE__ */ new Uint8Array(1);
			ta.constructor = function(length) {
				return new Uint8Array(length);
			};
			try {
				ta.slice();
			} catch (e) {
				return implementation;
			}
			return Uint8Array.prototype.slice;
		}
		return implementation;
	};
}));
//#endregion
//#region node_modules/typedarray.prototype.slice/shim.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var define = require_define_properties();
	var getProto = require_get_proto();
	var getPolyfill = require_polyfill();
	module.exports = function shimTypedArraySlice() {
		if (typeof Uint8Array === "function") {
			var polyfill = getPolyfill();
			var proto = getProto(Uint8Array.prototype);
			define(proto, { slice: polyfill }, { slice: function() {
				return proto.slice !== polyfill;
			} });
		}
		return polyfill;
	};
}));
//#endregion
//#region node_modules/typedarray.prototype.slice/index.js
var require_typedarray_prototype_slice = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var define = require_define_properties();
	var callBind = require_call_bind();
	var implementation = require_implementation();
	var getPolyfill = require_polyfill();
	var shim = require_shim();
	var bound = callBind(getPolyfill());
	define(bound, {
		getPolyfill,
		implementation,
		shim
	});
	module.exports = bound;
}));
//#endregion
//#region node_modules/traverse/index.js
var require_traverse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var whichTypedArray = require_which_typed_array();
	var taSlice = require_typedarray_prototype_slice();
	var gopd = require_gopd();
	var defineDataProperty = require_define_data_property();
	var ToPrimitive = require_es2015();
	function toS(obj) {
		return Object.prototype.toString.call(obj);
	}
	function isDate(obj) {
		return toS(obj) === "[object Date]";
	}
	function isRegExp(obj) {
		return toS(obj) === "[object RegExp]";
	}
	function isError(obj) {
		return toS(obj) === "[object Error]";
	}
	function isBoolean(obj) {
		return toS(obj) === "[object Boolean]";
	}
	function isNumber(obj) {
		return toS(obj) === "[object Number]";
	}
	function isString(obj) {
		return toS(obj) === "[object String]";
	}
	var isArray = Array.isArray || function isArray(xs) {
		return Object.prototype.toString.call(xs) === "[object Array]";
	};
	function forEach(xs, fn) {
		if (xs.forEach) return xs.forEach(fn);
		for (var i = 0; i < xs.length; i++) fn(xs[i], i, xs);
	}
	var objectKeys = Object.keys || function keys(obj) {
		var res = [];
		for (var key in obj) res[res.length] = key;
		return res;
	};
	var propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	function ownEnumerableKeys(obj) {
		var res = objectKeys(obj);
		if (getOwnPropertySymbols) {
			var symbols = getOwnPropertySymbols(obj);
			for (var i = 0; i < symbols.length; i++) if (propertyIsEnumerable.call(obj, symbols[i])) res[res.length] = symbols[i];
		}
		return res;
	}
	var hasOwnProperty = Object.prototype.hasOwnProperty || function(obj, key) {
		return key in obj;
	};
	function isWritable(object, key) {
		if (typeof gopd !== "function") return true;
		var desc = gopd(object, key);
		return !desc || !desc.writable;
	}
	var maxArrayLength = 4294967295;
	function isIndex(key) {
		if (typeof key === "symbol") return false;
		var index = Number(key);
		return index >= 0 && index < maxArrayLength && index % 1 === 0 && String(index) === String(key);
	}
	function countBelow(ascending, index) {
		var low = 0;
		var high = ascending.length;
		while (low < high) {
			var middle = Math.floor((low + high) / 2);
			if (ascending[middle] < index) low = middle + 1;
			else high = middle;
		}
		return low;
	}
	function wasSpliced(key, spliced) {
		return spliced.length > 0 && isIndex(key) && spliced[countBelow(spliced, Number(key))] === Number(key);
	}
	function shiftedKey(key, spliced) {
		if (spliced.length === 0 || !isIndex(key)) return key;
		var shifted = Number(key) - countBelow(spliced, Number(key));
		return typeof key === "number" ? shifted : String(shifted);
	}
	var hasProtoAccessor = typeof gopd === "function" && !!gopd(Object.prototype, "__proto__");
	function setProperty(object, key, value) {
		if (hasProtoAccessor && key === "__proto__" && !hasOwnProperty.call(object, key)) defineDataProperty(object, key, value);
		else object[key] = value;
	}
	var hasMagicProto = !hasProtoAccessor && {}.__proto__ === Object.prototype;
	function toSettableKey(segment) {
		var primitive = ToPrimitive(segment, String);
		var key = typeof primitive === "symbol" ? primitive : String(primitive);
		if (hasMagicProto && key === "__proto__") throw new TypeError("`__proto__` can not be set as a property in this engine");
		return key;
	}
	function setOwnProperty(object, key, value) {
		"use strict";
		if (hasProtoAccessor && key === "__proto__" && !hasOwnProperty.call(object, key)) defineDataProperty(object, key, value);
		else object[key] = value;
		if (Object(object) !== object) throw new TypeError("Cannot create property `" + String(key) + "` on a " + typeof object);
	}
	var gPO = Object.getPrototypeOf;
	function getProto(obj) {
		return gPO ? gPO(obj) : obj.__proto__;
	}
	var sPO = Object.setPrototypeOf;
	function setProto(obj, proto) {
		if (sPO) sPO(obj, proto);
		else obj.__proto__ = proto;
	}
	function copyBoxed(src, valueOf) {
		var primitive;
		try {
			primitive = valueOf.call(src);
		} catch (e) {
			return Object(src);
		}
		var dst = Object(primitive);
		var proto = getProto(src);
		if (proto && proto !== getProto(dst)) setProto(dst, proto);
		return dst;
	}
	function isStringCharacter(obj, key) {
		return isString(obj) && isIndex(key) && Number(key) < obj.length;
	}
	function copy(src, options) {
		if (typeof src === "object" && src !== null) {
			var dst;
			if (isArray(src)) dst = [];
			else if (isDate(src)) dst = new Date(src.getTime ? src.getTime() : src);
			else if (isRegExp(src)) dst = new RegExp(src);
			else if (isBoolean(src)) dst = copyBoxed(src, Boolean.prototype.valueOf);
			else if (isNumber(src)) dst = copyBoxed(src, Number.prototype.valueOf);
			else if (isString(src)) dst = copyBoxed(src, String.prototype.valueOf);
			else if (whichTypedArray(src)) return taSlice(src);
			else if (Object.create && Object.getPrototypeOf) dst = Object.create(Object.getPrototypeOf(src));
			else if (src.constructor === Object) dst = {};
			else {
				var proto = src.constructor && src.constructor.prototype || src.__proto__ || {};
				var T = function T() {};
				T.prototype = proto;
				dst = new T();
			}
			if (isError(src)) defineDataProperty(dst, "message", src.message);
			forEach((options.includeSymbols ? ownEnumerableKeys : objectKeys)(src), function(key) {
				if (!isStringCharacter(dst, key)) setProperty(dst, key, src[key]);
			});
			return dst;
		}
		return src;
	}
	/** @type {TraverseOptions} */
	var emptyNull = { __proto__: null };
	/** @type {(options: TraverseOptions | null | undefined) => TraverseOptions} */
	function getOptions(options) {
		return options == null ? emptyNull : options;
	}
	function walk(root, cb) {
		var path = [];
		var parents = [];
		var alive = true;
		var options = arguments.length > 2 ? arguments[2] : emptyNull;
		var iteratorFunction = options.includeSymbols ? ownEnumerableKeys : objectKeys;
		var immutable = !!options.immutable;
		return function walker(node_, splicedSiblings, originalKey) {
			var node = immutable ? copy(node_, options) : node_;
			var modifiers = { __proto__: null };
			var keepGoing = true;
			var state = {
				node,
				node_,
				path: [].concat(path),
				parent: parents[parents.length - 1],
				parents,
				key: path[path.length - 1],
				removedKeys: { __proto__: null },
				isRoot: path.length === 0,
				level: path.length,
				circular: null,
				update: function(x, stopHere) {
					if (!state.isRoot && !wasSpliced(originalKey, splicedSiblings)) setProperty(state.parent.node, state.key, x);
					state.node = x;
					if (stopHere) keepGoing = false;
				},
				delete: function(stopHere) {
					if (!wasSpliced(originalKey, splicedSiblings)) {
						delete state.parent.node[state.key];
						state.parent.removedKeys[state.key] = true;
					}
					if (stopHere) keepGoing = false;
				},
				remove: function(stopHere) {
					if (isArray(state.parent.node) && isIndex(originalKey)) {
						var index = Number(originalKey);
						var at = countBelow(splicedSiblings, index);
						while (splicedSiblings[at] === index) {
							index += 1;
							at += 1;
						}
						if (index - at < state.parent.node.length) {
							state.parent.node.splice(index - at, 1);
							splicedSiblings.splice(at, 0, index);
							state.parent.removedKeys[state.key] = true;
						}
						if (stopHere) keepGoing = false;
					} else state.delete(stopHere);
				},
				keys: null,
				before: function(f) {
					modifiers.before = f;
				},
				after: function(f) {
					modifiers.after = f;
				},
				pre: function(f) {
					modifiers.pre = f;
				},
				post: function(f) {
					modifiers.post = f;
				},
				stop: function() {
					alive = false;
				},
				block: function() {
					keepGoing = false;
				}
			};
			if (!alive) return state;
			function updateState() {
				if (typeof state.node === "object" && state.node !== null) {
					var nodeKeys = iteratorFunction(state.node);
					if (!state.keys || state.node !== node && state.node !== node_) state.keys = nodeKeys;
					state.isLeaf = nodeKeys.length === 0;
					for (var i = 0; i < parents.length; i++) if (parents[i].node_ === node_) {
						state.circular = parents[i];
						break;
					}
				} else {
					state.isLeaf = true;
					state.keys = null;
				}
				state.notLeaf = !state.isLeaf;
				state.notRoot = !state.isRoot;
			}
			updateState();
			var ret = cb.call(state, state.node);
			if (ret !== void 0 && state.update) state.update(ret);
			if (modifiers.before) modifiers.before.call(state, state.node);
			if (!keepGoing) return state;
			if (typeof state.node === "object" && state.node !== null && !state.circular) {
				updateState();
				parents[parents.length] = state;
				var splicedChildren = [];
				forEach(state.keys, function(listedKey, i) {
					if (wasSpliced(listedKey, splicedChildren)) return;
					var key = shiftedKey(listedKey, splicedChildren);
					path[path.length] = key;
					if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
					var child = walker(state.node[key], splicedChildren, listedKey);
					if (immutable && !wasSpliced(listedKey, splicedChildren)) {
						var writeKey = shiftedKey(listedKey, splicedChildren);
						if (hasOwnProperty.call(state.node, writeKey) && !isWritable(state.node, writeKey)) state.node[writeKey] = child.node;
					}
					child.isLast = i === state.keys.length - 1;
					child.isFirst = i === 0;
					if (modifiers.post) modifiers.post.call(state, child);
					path.pop();
				});
				parents.pop();
			}
			if (modifiers.after) modifiers.after.call(state, state.node);
			return state;
		}(root, []).node;
	}
	/** @typedef {{ immutable?: boolean, includeSymbols?: boolean }} TraverseOptions */
	/**
	* A traverse constructor
	* @param {object} obj - the object to traverse
	* @param {TraverseOptions | null | undefined} [options] - options for the traverse
	* @constructor
	*/
	function Traverse(obj) {
		if (!(this instanceof Traverse)) return new Traverse(obj, getOptions(arguments.length > 1 ? arguments[1] : null));
		/** @type {TraverseOptions} */
		this.options = getOptions(arguments.length > 1 ? arguments[1] : null);
		this.value = obj;
	}
	/** @type {(ps: PropertyKey[]) => Traverse['value']} */
	Traverse.prototype.get = function(ps) {
		var node = this.value;
		for (var i = 0; i < ps.length; i++) {
			var key = ps[i];
			if (node == null || !hasOwnProperty.call(node, key)) return;
			node = node[key];
		}
		return node;
	};
	/** @type {(ps: PropertyKey[]) => boolean} */
	Traverse.prototype.has = function(ps) {
		var node = this.value;
		if (!node && ps.length > 0) return false;
		for (var i = 0; i < ps.length; i++) {
			var key = ps[i];
			if (node == null || !hasOwnProperty.call(node, key)) return false;
			node = node[key];
		}
		return true;
	};
	Traverse.prototype.set = function(ps, value) {
		var node = this.value;
		for (var i = 0; i < ps.length - 1; i++) {
			var key = toSettableKey(ps[i]);
			if (!hasOwnProperty.call(node, key)) {
				setOwnProperty(node, key, {});
				if (!hasOwnProperty.call(node, key)) throw new TypeError("Cannot create property `" + String(key) + "` as an own property");
			}
			node = node[key];
		}
		setOwnProperty(node, toSettableKey(ps[i]), value);
		return value;
	};
	Traverse.prototype.map = function(cb) {
		return walk(this.value, cb, {
			__proto__: null,
			immutable: true,
			includeSymbols: !!this.options.includeSymbols
		});
	};
	Traverse.prototype.forEach = function(cb) {
		this.value = walk(this.value, cb, this.options);
		return this.value;
	};
	Traverse.prototype.reduce = function(cb, init) {
		var skip = arguments.length === 1;
		var acc = skip ? this.value : init;
		this.forEach(function(x) {
			if (!this.isRoot || !skip) acc = cb.call(this, acc, x);
		});
		return acc;
	};
	Traverse.prototype.deepEqual = function(obj) {
		if (arguments.length !== 1) throw new Error("deepEqual requires exactly one object to compare against");
		var equal = true;
		function notEqual() {
			equal = false;
		}
		var node = obj;
		this.forEach(function(y) {
			if (!this.isRoot) {
				if (typeof node !== "object") return notEqual();
				node = node[this.key];
			}
			var x = node;
			this.post(function() {
				node = x;
			});
			if (this.circular) {
				if (new Traverse(obj).get(this.circular.path) !== x) notEqual();
			} else if (typeof x !== typeof y) notEqual();
			else if (x === null || y === null || x === void 0 || y === void 0) {
				if (x !== y) notEqual();
			} else if (x.__proto__ !== y.__proto__) notEqual();
			else if (x === y) {} else if (typeof x === "function") {
				if (x instanceof RegExp) {
					if (String(x) !== String(y)) notEqual();
				} else if (x !== y) notEqual();
			} else if (typeof x === "object") {
				if (toS(y) === "[object Arguments]" || toS(x) === "[object Arguments]") {
					if (toS(x) !== toS(y)) notEqual();
				} else if (toS(y) === "[object RegExp]" || toS(x) === "[object RegExp]") {
					if (!x || !y || x.toString() !== y.toString()) notEqual();
				} else if (x instanceof Date || y instanceof Date) {
					if (!(x instanceof Date) || !(y instanceof Date) || x.getTime() !== y.getTime()) notEqual();
				} else {
					var kx = Object.keys(x);
					var ky = Object.keys(y);
					if (kx.length !== ky.length) return notEqual();
					for (var i = 0; i < kx.length; i++) {
						var k = kx[i];
						if (!Object.hasOwnProperty.call(y, k)) notEqual();
					}
				}
			}
		});
		return equal;
	};
	Traverse.prototype.paths = function() {
		var acc = [];
		this.forEach(function() {
			acc[acc.length] = this.path;
		});
		return acc;
	};
	Traverse.prototype.nodes = function() {
		var acc = [];
		this.forEach(function() {
			acc[acc.length] = this.node;
		});
		return acc;
	};
	Traverse.prototype.clone = function() {
		var parents = [];
		var nodes = [];
		var options = this.options;
		if (whichTypedArray(this.value)) return taSlice(this.value);
		return function clone(src) {
			for (var i = 0; i < parents.length; i++) if (parents[i] === src) return nodes[i];
			if (typeof src === "object" && src !== null) {
				var dst = copy(src, options);
				parents[parents.length] = src;
				nodes[nodes.length] = dst;
				forEach((options.includeSymbols ? ownEnumerableKeys : objectKeys)(src), function(key) {
					if (!isStringCharacter(dst, key)) setProperty(dst, key, clone(src[key]));
				});
				parents.pop();
				nodes.pop();
				return dst;
			}
			return src;
		}(this.value);
	};
	forEach(ownEnumerableKeys(Traverse.prototype), function(key) {
		Traverse[key] = function(obj) {
			var args = [].slice.call(arguments, 1);
			var t = new Traverse(obj);
			return t[key].apply(t, args);
		};
	});
	module.exports = Traverse;
}));
//#endregion
//#region node_modules/chainsaw/index.js
var require_chainsaw = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Traverse = require_traverse();
	var EventEmitter$1 = __require("events").EventEmitter;
	module.exports = Chainsaw;
	function Chainsaw(builder) {
		var saw = Chainsaw.saw(builder, {});
		var r = builder.call(saw.handlers, saw);
		if (r !== void 0) saw.handlers = r;
		saw.record();
		return saw.chain();
	}
	Chainsaw.light = function ChainsawLight(builder) {
		var saw = Chainsaw.saw(builder, {});
		var r = builder.call(saw.handlers, saw);
		if (r !== void 0) saw.handlers = r;
		return saw.chain();
	};
	Chainsaw.saw = function(builder, handlers) {
		var saw = new EventEmitter$1();
		saw.handlers = handlers;
		saw.actions = [];
		saw.chain = function() {
			var ch = Traverse(saw.handlers).map(function(node) {
				if (this.isRoot) return node;
				var ps = this.path;
				if (typeof node === "function") this.update(function() {
					saw.actions.push({
						path: ps,
						args: [].slice.call(arguments)
					});
					return ch;
				});
			});
			process.nextTick(function() {
				saw.emit("begin");
				saw.next();
			});
			return ch;
		};
		saw.pop = function() {
			return saw.actions.shift();
		};
		saw.next = function() {
			var action = saw.pop();
			if (!action) saw.emit("end");
			else if (!action.trap) {
				var node = saw.handlers;
				action.path.forEach(function(key) {
					node = node[key];
				});
				node.apply(saw.handlers, action.args);
			}
		};
		saw.nest = function(cb) {
			var args = [].slice.call(arguments, 1);
			var autonext = true;
			if (typeof cb === "boolean") {
				var autonext = cb;
				cb = args.shift();
			}
			var s = Chainsaw.saw(builder, {});
			var r = builder.call(s.handlers, s);
			if (r !== void 0) s.handlers = r;
			if ("undefined" !== typeof saw.step) s.record();
			cb.apply(s.chain(), args);
			if (autonext !== false) s.on("end", saw.next);
		};
		saw.record = function() {
			upgradeChainsaw(saw);
		};
		[
			"trap",
			"down",
			"jump"
		].forEach(function(method) {
			saw[method] = function() {
				throw new Error("To use the trap, down and jump features, please call record() first to start recording actions.");
			};
		});
		return saw;
	};
	function upgradeChainsaw(saw) {
		saw.step = 0;
		saw.pop = function() {
			return saw.actions[saw.step++];
		};
		saw.trap = function(name, cb) {
			var ps = Array.isArray(name) ? name : [name];
			saw.actions.push({
				path: ps,
				step: saw.step,
				cb,
				trap: true
			});
		};
		saw.down = function(name) {
			var ps = (Array.isArray(name) ? name : [name]).join("/");
			var i = saw.actions.slice(saw.step).map(function(x) {
				if (x.trap && x.step <= saw.step) return false;
				return x.path.join("/") == ps;
			}).indexOf(true);
			if (i >= 0) saw.step += i;
			else saw.step = saw.actions.length;
			var act = saw.actions[saw.step - 1];
			if (act && act.trap) {
				saw.step = act.step;
				act.cb();
			} else saw.next();
		};
		saw.jump = function(step) {
			saw.step = step;
			saw.next();
		};
	}
}));
//#endregion
//#region node_modules/buffers/index.js
var require_buffers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Buffers;
	function Buffers(bufs) {
		if (!(this instanceof Buffers)) return new Buffers(bufs);
		this.buffers = bufs || [];
		this.length = this.buffers.reduce(function(size, buf) {
			return size + buf.length;
		}, 0);
	}
	Buffers.prototype.push = function() {
		for (var i = 0; i < arguments.length; i++) if (!Buffer.isBuffer(arguments[i])) throw new TypeError("Tried to push a non-buffer");
		for (var i = 0; i < arguments.length; i++) {
			var buf = arguments[i];
			this.buffers.push(buf);
			this.length += buf.length;
		}
		return this.length;
	};
	Buffers.prototype.unshift = function() {
		for (var i = 0; i < arguments.length; i++) if (!Buffer.isBuffer(arguments[i])) throw new TypeError("Tried to unshift a non-buffer");
		for (var i = 0; i < arguments.length; i++) {
			var buf = arguments[i];
			this.buffers.unshift(buf);
			this.length += buf.length;
		}
		return this.length;
	};
	Buffers.prototype.copy = function(dst, dStart, start, end) {
		return this.slice(start, end).copy(dst, dStart, 0, end - start);
	};
	Buffers.prototype.splice = function(i, howMany) {
		var buffers = this.buffers;
		var index = i >= 0 ? i : this.length - i;
		var reps = [].slice.call(arguments, 2);
		if (howMany === void 0) howMany = this.length - index;
		else if (howMany > this.length - index) howMany = this.length - index;
		for (var i = 0; i < reps.length; i++) this.length += reps[i].length;
		var removed = new Buffers();
		var startBytes = 0;
		for (var ii = 0; ii < buffers.length && startBytes + buffers[ii].length < index; ii++) startBytes += buffers[ii].length;
		if (index - startBytes > 0) {
			var start = index - startBytes;
			if (start + howMany < buffers[ii].length) {
				removed.push(buffers[ii].slice(start, start + howMany));
				var orig = buffers[ii];
				var buf0 = new Buffer(start);
				for (var i = 0; i < start; i++) buf0[i] = orig[i];
				var buf1 = new Buffer(orig.length - start - howMany);
				for (var i = start + howMany; i < orig.length; i++) buf1[i - howMany - start] = orig[i];
				if (reps.length > 0) {
					var reps_ = reps.slice();
					reps_.unshift(buf0);
					reps_.push(buf1);
					buffers.splice.apply(buffers, [ii, 1].concat(reps_));
					ii += reps_.length;
					reps = [];
				} else {
					buffers.splice(ii, 1, buf0, buf1);
					ii += 2;
				}
			} else {
				removed.push(buffers[ii].slice(start));
				buffers[ii] = buffers[ii].slice(0, start);
				ii++;
			}
		}
		if (reps.length > 0) {
			buffers.splice.apply(buffers, [ii, 0].concat(reps));
			ii += reps.length;
		}
		while (removed.length < howMany) {
			var buf = buffers[ii];
			var len = buf.length;
			var take = Math.min(len, howMany - removed.length);
			if (take === len) {
				removed.push(buf);
				buffers.splice(ii, 1);
			} else {
				removed.push(buf.slice(0, take));
				buffers[ii] = buffers[ii].slice(take);
			}
		}
		this.length -= removed.length;
		return removed;
	};
	Buffers.prototype.slice = function(i, j) {
		var buffers = this.buffers;
		if (j === void 0) j = this.length;
		if (i === void 0) i = 0;
		if (j > this.length) j = this.length;
		var startBytes = 0;
		for (var si = 0; si < buffers.length && startBytes + buffers[si].length <= i; si++) startBytes += buffers[si].length;
		var target = new Buffer(j - i);
		var ti = 0;
		for (var ii = si; ti < j - i && ii < buffers.length; ii++) {
			var len = buffers[ii].length;
			var start = ti === 0 ? i - startBytes : 0;
			var end = ti + len >= j - i ? Math.min(start + (j - i) - ti, len) : len;
			buffers[ii].copy(target, ti, start, end);
			ti += end - start;
		}
		return target;
	};
	Buffers.prototype.pos = function(i) {
		if (i < 0 || i >= this.length) throw new Error("oob");
		var l = i, bi = 0, bu = null;
		for (;;) {
			bu = this.buffers[bi];
			if (l < bu.length) return {
				buf: bi,
				offset: l
			};
			else l -= bu.length;
			bi++;
		}
	};
	Buffers.prototype.get = function get(i) {
		var pos = this.pos(i);
		return this.buffers[pos.buf].get(pos.offset);
	};
	Buffers.prototype.set = function set(i, b) {
		var pos = this.pos(i);
		return this.buffers[pos.buf].set(pos.offset, b);
	};
	Buffers.prototype.indexOf = function(needle, offset) {
		if ("string" === typeof needle) needle = new Buffer(needle);
		else if (needle instanceof Buffer) {} else throw new Error("Invalid type for a search string");
		if (!needle.length) return 0;
		if (!this.length) return -1;
		var i = 0, j = 0, match = 0, mstart, pos = 0;
		if (offset) {
			var p = this.pos(offset);
			i = p.buf;
			j = p.offset;
			pos = offset;
		}
		for (;;) {
			while (j >= this.buffers[i].length) {
				j = 0;
				i++;
				if (i >= this.buffers.length) return -1;
			}
			if (this.buffers[i][j] == needle[match]) {
				if (match == 0) mstart = {
					i,
					j,
					pos
				};
				match++;
				if (match == needle.length) return mstart.pos;
			} else if (match != 0) {
				i = mstart.i;
				j = mstart.j;
				pos = mstart.pos;
				match = 0;
			}
			j++;
			pos++;
		}
	};
	Buffers.prototype.toBuffer = function() {
		return this.slice();
	};
	Buffers.prototype.toString = function(encoding, start, end) {
		return this.slice(start, end).toString(encoding);
	};
}));
//#endregion
//#region node_modules/binary/lib/vars.js
var require_vars = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(store) {
		function getset(name, value) {
			var node = vars.store;
			var keys = name.split(".");
			keys.slice(0, -1).forEach(function(k) {
				if (node[k] === void 0) node[k] = {};
				node = node[k];
			});
			var key = keys[keys.length - 1];
			if (arguments.length == 1) return node[key];
			else return node[key] = value;
		}
		var vars = {
			get: function(name) {
				return getset(name);
			},
			set: function(name, value) {
				return getset(name, value);
			},
			store: store || {}
		};
		return vars;
	};
}));
//#endregion
//#region node_modules/binary/index.js
var require_binary = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Chainsaw = require_chainsaw();
	var EventEmitter = __require("events").EventEmitter;
	var Buffers = require_buffers();
	var Vars = require_vars();
	var Stream = __require("stream").Stream;
	exports = module.exports = function(bufOrEm, eventName) {
		if (Buffer.isBuffer(bufOrEm)) return exports.parse(bufOrEm);
		var s = exports.stream();
		if (bufOrEm && bufOrEm.pipe) bufOrEm.pipe(s);
		else if (bufOrEm) {
			bufOrEm.on(eventName || "data", function(buf) {
				s.write(buf);
			});
			bufOrEm.on("end", function() {
				s.end();
			});
		}
		return s;
	};
	exports.stream = function(input) {
		if (input) return exports.apply(null, arguments);
		var pending = null;
		function getBytes(bytes, cb, skip) {
			pending = {
				bytes,
				skip,
				cb: function(buf) {
					pending = null;
					cb(buf);
				}
			};
			dispatch();
		}
		var offset = null;
		function dispatch() {
			if (!pending) {
				if (caughtEnd) done = true;
				return;
			}
			if (typeof pending === "function") pending();
			else {
				var bytes = offset + pending.bytes;
				if (buffers.length >= bytes) {
					var buf;
					if (offset == null) {
						buf = buffers.splice(0, bytes);
						if (!pending.skip) buf = buf.slice();
					} else {
						if (!pending.skip) buf = buffers.slice(offset, bytes);
						offset = bytes;
					}
					if (pending.skip) pending.cb();
					else pending.cb(buf);
				}
			}
		}
		function builder(saw) {
			function next() {
				if (!done) saw.next();
			}
			var self = words(function(bytes, cb) {
				return function(name) {
					getBytes(bytes, function(buf) {
						vars.set(name, cb(buf));
						next();
					});
				};
			});
			self.tap = function(cb) {
				saw.nest(cb, vars.store);
			};
			self.into = function(key, cb) {
				if (!vars.get(key)) vars.set(key, {});
				var parent = vars;
				vars = Vars(parent.get(key));
				saw.nest(function() {
					cb.apply(this, arguments);
					this.tap(function() {
						vars = parent;
					});
				}, vars.store);
			};
			self.flush = function() {
				vars.store = {};
				next();
			};
			self.loop = function(cb) {
				var end = false;
				saw.nest(false, function loop() {
					this.vars = vars.store;
					cb.call(this, function() {
						end = true;
						next();
					}, vars.store);
					this.tap(function() {
						if (end) saw.next();
						else loop.call(this);
					}.bind(this));
				}, vars.store);
			};
			self.buffer = function(name, bytes) {
				if (typeof bytes === "string") bytes = vars.get(bytes);
				getBytes(bytes, function(buf) {
					vars.set(name, buf);
					next();
				});
			};
			self.skip = function(bytes) {
				if (typeof bytes === "string") bytes = vars.get(bytes);
				getBytes(bytes, function() {
					next();
				});
			};
			self.scan = function find(name, search) {
				if (typeof search === "string") search = new Buffer(search);
				else if (!Buffer.isBuffer(search)) throw new Error("search must be a Buffer or a string");
				var taken = 0;
				pending = function() {
					var pos = buffers.indexOf(search, offset + taken);
					var i = pos - offset - taken;
					if (pos !== -1) {
						pending = null;
						if (offset != null) {
							vars.set(name, buffers.slice(offset, offset + taken + i));
							offset += taken + i + search.length;
						} else {
							vars.set(name, buffers.slice(0, taken + i));
							buffers.splice(0, taken + i + search.length);
						}
						next();
						dispatch();
					} else i = Math.max(buffers.length - search.length - offset - taken, 0);
					taken += i;
				};
				dispatch();
			};
			self.peek = function(cb) {
				offset = 0;
				saw.nest(function() {
					cb.call(this, vars.store);
					this.tap(function() {
						offset = null;
					});
				});
			};
			return self;
		}
		var stream = Chainsaw.light(builder);
		stream.writable = true;
		var buffers = Buffers();
		stream.write = function(buf) {
			buffers.push(buf);
			dispatch();
		};
		var vars = Vars();
		var done = false, caughtEnd = false;
		stream.end = function() {
			caughtEnd = true;
		};
		stream.pipe = Stream.prototype.pipe;
		Object.getOwnPropertyNames(EventEmitter.prototype).forEach(function(name) {
			stream[name] = EventEmitter.prototype[name];
		});
		return stream;
	};
	exports.parse = function parse(buffer) {
		var self = words(function(bytes, cb) {
			return function(name) {
				if (offset + bytes <= buffer.length) {
					var buf = buffer.slice(offset, offset + bytes);
					offset += bytes;
					vars.set(name, cb(buf));
				} else vars.set(name, null);
				return self;
			};
		});
		var offset = 0;
		var vars = Vars();
		self.vars = vars.store;
		self.tap = function(cb) {
			cb.call(self, vars.store);
			return self;
		};
		self.into = function(key, cb) {
			if (!vars.get(key)) vars.set(key, {});
			var parent = vars;
			vars = Vars(parent.get(key));
			cb.call(self, vars.store);
			vars = parent;
			return self;
		};
		self.loop = function(cb) {
			var end = false;
			var ender = function() {
				end = true;
			};
			while (end === false) cb.call(self, ender, vars.store);
			return self;
		};
		self.buffer = function(name, size) {
			if (typeof size === "string") size = vars.get(size);
			var buf = buffer.slice(offset, Math.min(buffer.length, offset + size));
			offset += size;
			vars.set(name, buf);
			return self;
		};
		self.skip = function(bytes) {
			if (typeof bytes === "string") bytes = vars.get(bytes);
			offset += bytes;
			return self;
		};
		self.scan = function(name, search) {
			if (typeof search === "string") search = new Buffer(search);
			else if (!Buffer.isBuffer(search)) throw new Error("search must be a Buffer or a string");
			vars.set(name, null);
			for (var i = 0; i + offset <= buffer.length - search.length + 1; i++) {
				for (var j = 0; j < search.length && buffer[offset + i + j] === search[j]; j++);
				if (j === search.length) break;
			}
			vars.set(name, buffer.slice(offset, offset + i));
			offset += i + search.length;
			return self;
		};
		self.peek = function(cb) {
			var was = offset;
			cb.call(self, vars.store);
			offset = was;
			return self;
		};
		self.flush = function() {
			vars.store = {};
			return self;
		};
		self.eof = function() {
			return offset >= buffer.length;
		};
		return self;
	};
	function decodeLEu(bytes) {
		var acc = 0;
		for (var i = 0; i < bytes.length; i++) acc += Math.pow(256, i) * bytes[i];
		return acc;
	}
	function decodeBEu(bytes) {
		var acc = 0;
		for (var i = 0; i < bytes.length; i++) acc += Math.pow(256, bytes.length - i - 1) * bytes[i];
		return acc;
	}
	function decodeBEs(bytes) {
		var val = decodeBEu(bytes);
		if ((bytes[0] & 128) == 128) val -= Math.pow(256, bytes.length);
		return val;
	}
	function decodeLEs(bytes) {
		var val = decodeLEu(bytes);
		if ((bytes[bytes.length - 1] & 128) == 128) val -= Math.pow(256, bytes.length);
		return val;
	}
	function words(decode) {
		var self = {};
		[
			1,
			2,
			4,
			8
		].forEach(function(bytes) {
			var bits = bytes * 8;
			self["word" + bits + "le"] = self["word" + bits + "lu"] = decode(bytes, decodeLEu);
			self["word" + bits + "ls"] = decode(bytes, decodeLEs);
			self["word" + bits + "be"] = self["word" + bits + "bu"] = decode(bytes, decodeBEu);
			self["word" + bits + "bs"] = decode(bytes, decodeBEs);
		});
		self.word8 = self.word8u = self.word8be;
		self.word8s = self.word8bs;
		return self;
	}
}));
//#endregion
export { require_binary as t };
