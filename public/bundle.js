/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(8);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * A node in the DOM tree.
 *
 * @external Node
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node Node}
 */


/**
 * Creates and return a new DOM element
 * @param {string|requestCallback} element - DOM tag name, or another createElement function
 * @param {Object} props - Properties
 * @param {*} children - all arguments will be appended as node children.
 * @returns {external:Node} = DOM element
 */
const createElement = (element, props = {}, ...children) => {
  
  /*** 
   * Return executed element with properties if the element is a function
   * Otherwise, lets create a new DOM element
  */
  const container = (typeof element === 'function') ? element(props || {}) : document.createElement(element);

  /*** Apply properties accordingly */
  Object.keys(props).forEach(p => {
    
    /*** Init method */
    if (p === 'init') {
      return props[p](container);
    }

    /*** To bind JS events. Pass it as a camel-case property name with the prefix "on" */
    if (/^on(.*)$/.test(p)) {
      return container.addEventListener(p.substring(2).toLowerCase(), props[p]);
    } 

    /*** Apply inline styles */
    if (p === 'style') {
      return Object.keys(props[p]).forEach(s => container.style.setProperty(s, props[p][s]));   
    }

    /*** Set all other attributes */
    container.setAttribute(p, props[p])
  });
  
  /*** An element could have either a text node, or another element as children */
  children.forEach(c => {
    if (c) {
      container.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)
    }
  });

  return container;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = createElement;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_store__ = __webpack_require__(4);


/**
 * Store to manage the state of the game.
 */
const store = Object(__WEBPACK_IMPORTED_MODULE_0__lib_store__["a" /* createStore */])({
  score: 0,
  speed: 10,
  isActive: true
});
/* harmony export (immutable) */ __webpack_exports__["a"] = store;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @typedef {Object} Store 
 * @property {string|number} key property name
 */


/**
 * Create a state container for the application with a give. 
 * Note: the model is static and new properties cannot be added later.
 * You must define the schema of the model with its default values.
 * @param {Object} model - Schema object with default values.
 * @returns {Store} - state container
 */
const createStore = (model = {}) => {
  console.log('[Store] Creating New Store', model);
  
  return new Proxy(model, {
    
    get: (target, key) => target[key],

    set: (target, key, value) => {
      
      /*** The store has a static model that is set on creation. */
      if (key in target) {
        /***
         * Data binding: trigger event to notify elemements of updates
         * - only when the value has changed.
         */
        if (target[key] !== value){ 
          target[key] = value;
          const event = new CustomEvent(`storeupdate--${key}`, { detail: value });
          document.dispatchEvent(event);
        }

        return true;
      } else {
        throw `The property "${key}" does not exist in store. \n\nAvailable Properties ${JSON.stringify(target, null, 2)}`;
        return false;
      }

    }
  })   
};
/* harmony export (immutable) */ __webpack_exports__["a"] = createStore;


/**
 * Executes callback with the value of the updated store property.
 * @param {string} key - Store property keyp
 * @param {requestCallback} next - Callback
 */
const onStoreUpdate = (key, next) => {
  document.addEventListener(`storeupdate--${key}`, e => next(e.detail));
}
/* harmony export (immutable) */ __webpack_exports__["b"] = onStoreUpdate;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__public_main_css__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__public_main_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__public_main_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_element__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Game_Game_component__ = __webpack_require__(9);






/** Add application to the DOM */
document.getElementById('app').appendChild(Object(__WEBPACK_IMPORTED_MODULE_2__components_Game_Game_component__["a" /* GameComponent */])());


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./main.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "html, body, .app {\n  height: 100%;\n  margin: 0;\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game_styles_css__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game_styles_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Game_styles_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_element__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__store__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Header_Header_component__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Viewport_Viewport_component__ = __webpack_require__(21);









const GameComponent = function() {

  return (

    Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])(`div`, { 
        class: 'game',
        init: () => {
          /*** Pause the viewport if the game is not visible. i.e. another tab is selected */
          document.addEventListener('visibilitychange', () => {
            console.log(document.hidden ? '[Game] Paused' : '[Game] Playing');
            __WEBPACK_IMPORTED_MODULE_2__store__["a" /* store */].isActive = !document.hidden;
          });
        }
      },
      
      Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])(__WEBPACK_IMPORTED_MODULE_3__Header_Header_component__["a" /* HeaderComponent */]),
      Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])(__WEBPACK_IMPORTED_MODULE_4__Viewport_Viewport_component__["a" /* ViewportComponent */])
    )

  );
  
};
/* harmony export (immutable) */ __webpack_exports__["a"] = GameComponent;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./Game.styles.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./Game.styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".game {\n   /*** Icons **/\n   --icon-coin: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Layer_1' x='0px' y='0px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'><path style='fill:#FFDA44;' d='M256,512C114.842,512,0,397.158,0,256S114.842,0,256,0s256,114.842,256,256S397.158,512,256,512z'/><path style='fill:#FFA733;' d='M256,0L256,0v5.565V512l0,0c141.158,0,256-114.842,256-256S397.158,0,256,0z'/><path style='fill:#EE8700;' d='M256,439.652c-101.266,0-183.652-82.391-183.652-183.652S154.733,72.348,256,72.348  S439.652,154.739,439.652,256S357.266,439.652,256,439.652z'/><path style='fill:#CC7400;' d='M439.652,256c0-101.261-82.386-183.652-183.652-183.652v367.304  C357.266,439.652,439.652,357.261,439.652,256z'/><path style='fill:#FFDA44;' d='M263.805,241.239c-17.517-9.261-35.631-18.826-35.631-29.761c0-15.348,12.484-27.826,27.826-27.826  s27.826,12.478,27.826,27.826c0,9.217,7.473,16.696,16.696,16.696s16.696-7.479,16.696-16.696c0-27.956-18.867-51.548-44.522-58.842  v-7.94c0-9.217-7.473-16.696-16.696-16.696s-16.696,7.479-16.696,16.696v7.94c-25.655,7.294-44.522,30.886-44.522,58.842  c0,31.044,29.619,46.707,53.413,59.283c17.517,9.261,35.631,18.826,35.631,29.761c0,15.348-12.484,27.826-27.826,27.826  s-27.826-12.478-27.826-27.826c0-9.217-7.473-16.696-16.696-16.696s-16.696,7.479-16.696,16.696  c0,27.956,18.867,51.548,44.522,58.842v7.94c0,9.217,7.473,16.696,16.696,16.696s16.696-7.479,16.696-16.696v-7.94  c25.655-7.294,44.522-30.886,44.522-58.842C317.217,269.478,287.598,253.815,263.805,241.239z'/><g><path style='fill:#FFA733;' d='M272.696,367.304v-7.94c25.655-7.294,44.522-30.886,44.522-58.842   c0-31.044-29.619-46.707-53.413-59.283c-2.616-1.384-5.226-2.777-7.805-4.176v37.875c14.699,7.976,27.826,16.283,27.826,25.584   c0,15.348-12.484,27.826-27.826,27.826V384C265.223,384,272.696,376.521,272.696,367.304z'/><path style='fill:#FFA733;' d='M283.826,211.478c0,9.217,7.473,16.696,16.696,16.696s16.696-7.479,16.696-16.696   c0-27.956-18.867-51.548-44.522-58.842v-7.94c0-9.217-7.473-16.696-16.696-16.696v55.652   C271.342,183.652,283.826,196.13,283.826,211.478z'/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>\");\n   --icon-speed: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Layer_1' x='0px' y='0px' viewBox='0 0 200 200' style='enable-background:new 0 0 200 200;' xml:space='preserve'><g id='XMLID_4_'><polygon id='XMLID_2_' style='fill:inherit;' points='37.68,81.056 65.14,35.719 25.061,45.014 0.411,102.998 24.04,97.518    5.663,140.749 10.235,139.688 70.392,73.47  '/><polygon id='XMLID_1_' style='fill:inherit;' points='139.197,85.956 189.893,2.257 115.898,19.417 70.392,126.465    114.016,116.347 80.087,196.159 88.527,194.201 199.589,71.952  '/></g></svg>\");\n   \n  background: linear-gradient(to bottom, #70e1f5, #ffd194);\n  display: flex;\n  flex-direction: column;\n  font-family: 'Titan One', cursive;\n  font-size: 16px;\n  height: 100%;\n  line-height: 1;\n  margin: 0;\n  overflow: hidden;\n}", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Header_styles_css__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Header_styles_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Header_styles_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_element__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SpeedControl_SpeedControl_component__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Score_Score_component__ = __webpack_require__(18);








const HeaderComponent = function() {
  return (
    Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])('div', { class: 'game__header' },
      Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])(__WEBPACK_IMPORTED_MODULE_3__Score_Score_component__["a" /* ScoreComponent */]),
      Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])(__WEBPACK_IMPORTED_MODULE_2__SpeedControl_SpeedControl_component__["a" /* SpeedControlComponent */])
    )
  );
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HeaderComponent;




/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./Header.styles.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./Header.styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".game__header {\n  background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);\n  box-shadow: #000 1px 1px 30px;\n  display: flex;\n  z-index: 1;\n}", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SpeedControl_styles_css__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SpeedControl_styles_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__SpeedControl_styles_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_element__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__store__ = __webpack_require__(3);






const SpeedControlComponent = () => {

  /*** 
   * A player should be able to use a slider to control the rate at which dots fall,
   * with a range of 10-100 pixels per second.
   */
  const max = 100;
  const min = 10;
  const step = 1;
  
  /*** Set starting speed to be the minimum in the range */
  const value = __WEBPACK_IMPORTED_MODULE_2__store__["a" /* store */].speed = min;

  return (
    Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])('div', { class: 'game__speed-control' },
      
    Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])('span', { class: 'game__speed-control__icon' }),
    
      Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])('input', { 
        class: 'game__speed-control__range',
        type: 'range',
        'aria-label': 'Speed',
        max,
        min,
        step,
        value,
        onChange: ({target}) => {
          __WEBPACK_IMPORTED_MODULE_2__store__["a" /* store */].speed = target.value;
        }
      })

    )
  )
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SpeedControlComponent;



/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./SpeedControl.styles.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./SpeedControl.styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".game__speed-control {\n  --color: #222;\n  align-items: center;\n  display: flex;\n  flex: 1;\n  padding: 0.5em 1em;\n}\n\n.game__speed-control__icon {\n  background-image: var(--icon-speed);\n  background-size: 100%;\n  background-repeat: no-repeat;\n  background-position: center;\n  display: block;\n  height: 2em;\n  margin-right: 0.3em;\n  width: 2em;\n}\n\n.game__speed-control__range {\n  -webkit-appearance:none;\n  background-color: var(--color);\n  height: 2px;\n  position: relative;\n  width: 100%;\n  padding: 0 0.5em;\n}\n\n.game__speed-control__range::-webkit-slider-thumb {\n  -webkit-appearance:none;\n  /* background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%); */\n  /* border: 2px solid var(--color); */\n  background-color: var(--color);\n  border-radius: 100%;\n  cursor: pointer;\n  height: 2em;\n  position: relative;\n  width: 2em;\n  will-change: transform;\n  transition: 300ms transform ease;\n}\n\n.game__speed-control__range::-webkit-slider-thumb:active {\n  transform: scale(2);\n}\n\n.game__speed-control__range:focus {\n  outline: none;\n}", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Score_styles_css__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Score_styles_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Score_styles_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_element__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_store__ = __webpack_require__(4);





const ScoreComponent = () => {
  
  return Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])('div', { class: 'game__score' },
  
    Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])('span', { 
      class: 'game__score__value',
      init: component => {
        Object(__WEBPACK_IMPORTED_MODULE_2__lib_store__["b" /* onStoreUpdate */])('score', v => {
          /*** Lets toggle the game__score--update class to trigger css animations */
          component.classList.remove('game__score__value--updated');
          component.offsetWidth; // triggers re-flow
          component.classList.add('game__score__value--updated');

          /*** Update the Score */
          component.textContent = v;
        });
      }
    }, '0')
    
  );

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ScoreComponent;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./Score.styles.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./Score.styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".game__score {\n  flex: 1;\n  padding: 0.5em 1em;\n}\n\n.game__score__value {\n  display: inline-block;\n  font-size: 2em;\n  will-change: transform;\n}\n\n.game__score__value:before {\n  background-image: var(--icon-coin);\n  background-size: 100%;\n  content: \"\";\n  display: inline-block;\n  height: 1em;\n  margin-right: 0.3em;\n  margin-top: -0.2em;\n  vertical-align: middle;\n  width: 1em;\n  will-change: transform;\n}\n\n.game__score__value--updated {\n  animation-duration: 500ms;\n  animation-fill-mode: forwards;\n  animation-name: animation-scored;\n}\n\n.game__score__value--updated:before {\n  animation-duration: 200ms;\n  animation-name: animation-flip;\n  animation-iteration-count: 2;\n  animation-timing-function: ease-in-out;\n}\n\n@keyframes animation-flip {\n  0% {\n    transform: rotateY(0deg) translateY(0%);\n  }\n  100% {\n    transform: rotateY(360deg) translateY(0%); \n  }\n}\n\n@keyframes animation-scored {\n  0% {\n    transform: scale3d(1, 1, 1);\n  }\n\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05);\n  }\n\n  100% {\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n/* <svg viewBox='0 0 513 513' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xml:space='preserve'><path d='M400.07,502.64C396.519,502.64 392.954,501.815 389.672,500.14L256.001,431.95L122.33,500.14C119.047,501.815 115.482,502.64 111.931,502.64C107.203,502.64 102.5,501.176 98.523,498.304C91.562,493.273 88.003,484.767 89.308,476.278L112.303,326.63L6.579,219.236C0.577,213.14 -1.524,204.205 1.133,196.073C3.789,187.942 10.759,181.97 19.202,180.592L167.114,156.454L235.604,21.869C239.508,14.194 247.39,9.362 256.001,9.362C264.612,9.362 272.494,14.195 276.397,21.869L344.887,156.454L492.8,180.592C501.244,181.97 508.213,187.942 510.87,196.073C513.526,204.205 511.425,213.14 505.423,219.236L399.7,326.628L422.693,476.276C423.998,484.766 420.439,493.271 413.478,498.302C409.502,501.175 404.798,502.64 400.07,502.64Z'/><path class='star-border' d='M146.585,486.578C139.625,481.548 136.065,473.041 137.37,464.552L160.365,314.905L54.643,207.512C48.64,201.416 46.54,192.481 49.196,184.349C50.428,180.58 52.593,177.284 55.395,174.686L19.202,180.592C10.758,181.97 3.789,187.942 1.133,196.073C-1.524,204.205 0.577,213.14 6.579,219.236L112.303,326.627L89.307,476.276C88.002,484.766 91.561,493.271 98.522,498.302C102.499,501.174 107.202,502.638 111.93,502.638C115.481,502.638 119.047,501.812 122.329,500.138L147.596,487.248C147.257,487.03 146.914,486.817 146.585,486.578Z'/></svg> */\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Viewport_styles_css__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Viewport_styles_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Viewport_styles_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_element__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_store__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_helpers__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__store__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Dot_Dot_component__ = __webpack_require__(25);










const ViewportComponent = () => {

  const appendNewDot = (viewport) => {

    /*** Dots fall at a constant rate. Speed is in pixels per second */
    const speed = (viewport.offsetHeight / __WEBPACK_IMPORTED_MODULE_4__store__["a" /* store */].speed);

    /*** Dots have random colors */
    const colorIndex = Object(__WEBPACK_IMPORTED_MODULE_3__lib_helpers__["a" /* getRandomNumber */])(1,5);

    /*** Dots should vary randomly in size from 10px in diameter to 100px in diameter. */
    const size = Object(__WEBPACK_IMPORTED_MODULE_3__lib_helpers__["a" /* getRandomNumber */])(10, 100);

    /***
     * New dots appear at a random horizontal position at the top of the box.
     * A dot should not "hang" off the left or right edge of the screen. 
     */
    const position = [
      Object(__WEBPACK_IMPORTED_MODULE_3__lib_helpers__["a" /* getRandomNumber */])(0, (viewport.offsetWidth - size)), // x
      viewport.offsetHeight // y
    ];
    
    /*** Create a Dot element */
    const dotComponent = Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])(__WEBPACK_IMPORTED_MODULE_5__Dot_Dot_component__["a" /* DotComponent */], {
      size,
      speed,
      colorIndex,
      position,
      onAnimationStart: ({animationName}) => {
        /*** Happy birthday Dot */
        if (animationName === 'animation-fall') {
          console.log('[Dot] Hey look at me! I\'m Dot');
        }
      },
      onAnimationEnd: ({animationName, target}) => {
        /*** Nothing is forever.  */
        if (animationName === 'animation-fall' || animationName === 'animation-pop') {
          console.log('[Dot] R.I.P.');
          target.remove();
        }
      },
      onClick: ({target}) => {
        
        if (target.classList.contains('game__dot--popped')) return;

        /*** 
         * The score should be incremented by a value inversely proportional to the size of the dot, 
         * with 10px dots worth 10 points, and 100px dots worth 1 point.
         */
        const newScore = Math.round(100 / size);
        __WEBPACK_IMPORTED_MODULE_4__store__["a" /* store */].score = __WEBPACK_IMPORTED_MODULE_4__store__["a" /* store */].score + newScore;
        console.log(`[Dot] Pop! +${newScore}`);

        /*** Pop bubble */
        target.classList.add('game__dot--popped');

         /*** A new dot should appear at the top of the page 1000ms later */
         setTimeout(() => appendNewDot(viewport), 1000);
      }
    });

    /** Append Dot to Viewport */
    viewport.appendChild(dotComponent);
  };
  
  return Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])('div', { 
    class: 'game__viewport',

    onAnimationStart:  ({animationName, target}) => {
      if (animationName === 'animation-fadein') {
        
        /*** When the game starts, a new dot should appear on the playing area. */
        appendNewDot(target);

        /*** A new dot should also appear every 1000ms. */
        appendNewDot(target);
        const timer = window.setInterval(() => __WEBPACK_IMPORTED_MODULE_4__store__["a" /* store */].isActive && appendNewDot(target), 1000);
      }
    },
  });
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ViewportComponent;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./Viewport.styles.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./Viewport.styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".game__viewport {\n  animation-duration: 0.001s;\n  animation-name: animation-fadein;\n  flex: 1;\n  overflow: hidden;\n  position: relative;\n  will-change: opacity;\n}\n\n@keyframes animation-fadein {  \n\tfrom { opacity: 0; }\n\tto { opacity: 1; }  \n}", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Returns a random number from within a range
 * @param {number} min - Minimum number
 * @param {number} max - Maximum number
 * @returns {number} - Randome number between 'min' and 'max'
 */
const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min ;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = getRandomNumber;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Dot_styles_css__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Dot_styles_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Dot_styles_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_element__ = __webpack_require__(2);




const DotComponent = function ({ colorIndex, size, position, speed }) {

  return Object(__WEBPACK_IMPORTED_MODULE_1__lib_element__["a" /* createElement */])('div', { 
    class: `game__dot game__dot--color--${colorIndex}`,
    style: {
      '--size': `${size}px`,
      '--x-position': `${position[0]}px`,
      '--y-position': `${position[1]}px`,
      '--speed': `${speed}s`
    }
  });

}
/* harmony export (immutable) */ __webpack_exports__["a"] = DotComponent;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./Dot.styles.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./Dot.styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.game__dot {\n  --color_1: #FF4338;\n  --color_2: #FF9238;\n  --color_3: #FFF538;\n  --color_4: #38B9FF;\n  --color_5: #2D1E2F;\n  animation-duration: var(--speed, 5000);\n  animation-fill-mode: forwards;\n  animation-name: animation-fall;\n  animation-timing-function: linear;\n  display: block;\n  height: var(--size, 100px);\n  position: absolute;\n  width: var(--size, 100px);\n  will-change: transform;\n}\n\n.game__dot::before {\n  border-radius: var(--size, 100px);\n  content: \"\";\n  display: block;\n  height: var(--size, 100px);\n  opacity: 0.7;\n  transform-origin: 0% 0%;\n  width: var(--size, 100px);\n  will-change: opacity, scale, filter;\n}\n\n.game__dot--color--1::before {\n  background-color: var(--color_1);\n}\n\n.game__dot--color--2::before {\n  background-color: var(--color_2);\n}\n\n.game__dot--color--3::before {\n  background-color: var(--color_3);\n}\n\n.game__dot--color--4::before {\n  background-color: var(--color_4);\n}\n\n.game__dot--color--5::before {\n  background-color: var(--color_5);\n}\n\n.game__dot--popped::before {\n  animation-duration: 500ms;\n  animation-fill-mode: forwards;\n  animation-name: animation-pop;\n}\n\n@keyframes animation-fall {\n  0% {\n    transform: translate(var(--x-position), calc( var(--size) * -1 ));\n  }\n\n  100% {\n    transform: translate(var(--x-position), var(--y-position));\n  }\n}\n\n@keyframes animation-pop {\n  0% {\n    filter: blur(0px);\n    opacity: 1;\n    transform: scale(1, 1);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale(2, 2);\n    filter: blur(20px);\n  }\n}", ""]);

// exports


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map