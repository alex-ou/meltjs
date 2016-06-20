/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _index = __webpack_require__(1);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var increaseAsync = function increaseAsync(step, model, actions) {
	  setTimeout(function () {
	    actions.increase(step);
	  }, 2000);
	  return model;
	};

	var increase = function increase(step, model) {
	  return model + step;
	};

	var decrease = function decrease(step, model) {
	  return model - step;
	};

	_index2.default.app({
	  el: '#app',
	  render: function render(h) {
	    var _actions = this.actions;
	    var increaseAsync = _actions.increaseAsync;
	    var decrease = _actions.decrease;


	    return h('div', {}, [this.model, h('button', { 'onClick': function onClick() {
	        return increaseAsync(2);
	      } }, '+'), h('button', { 'onClick': function onClick() {
	        return decrease(2);
	      } }, '-')]);
	  },
	  model: 0,
	  update: {
	    increase: increase,
	    increaseAsync: increaseAsync,
	    decrease: decrease
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Opal;

	var _create = __webpack_require__(13);

	var _create2 = _interopRequireDefault(_create);

	var _app = __webpack_require__(18);

	var _app2 = _interopRequireDefault(_app);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Opal() {}
	Opal.createElement = _create2.default;
	Opal.app = function (options) {
	  return new _app2.default(options);
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = patchNode;
	exports.patchChildren = patchChildren;

	var _set_attribute = __webpack_require__(3);

	var _create_element = __webpack_require__(10);

	var _create_element2 = _interopRequireDefault(_create_element);

	var _vnode = __webpack_require__(11);

	var _diff = __webpack_require__(12);

	var diffActions = _interopRequireWildcard(_diff);

	var _index = __webpack_require__(4);

	var _dom = __webpack_require__(9);

	var dom = _interopRequireWildcard(_dom);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Compare two virtual nodes and update the dom element
	 */

	function patchNode(domElem, oldVnode, newVnode) {
	  // Skip updating this whole sub-tree
	  if (oldVnode === newVnode) {
	    return domElem;
	  }

	  // Remove the DOM
	  if (!(0, _index.isUndefined)(oldVnode) && (0, _index.isUndefined)(newVnode)) {
	    // Unmount the components
	    dom.removeChild(domElem.parentNode, domElem);
	    return domElem;
	  }

	  // Replace the DOM
	  if (!(0, _index.isNull)(oldVnode) && (0, _index.isNull)(newVnode) || (0, _index.isNull)(oldVnode) && !(0, _index.isNull)(newVnode) || oldVnode.type !== newVnode.type) {
	    return replaceNode(domElem, newVnode);
	  }

	  // Two nodes with the same type reaching this point

	  // Element
	  var newDomElem = domElem;
	  if (newVnode.isElement()) {
	    if (oldVnode.tagName !== newVnode.tagName) {
	      // Replace the whole DOM element
	      newDomElem = replaceNode(domElem, newVnode);
	    } else {
	      // Same tagName, update the attributes
	      updateAttributes(domElem, oldVnode, newVnode);
	      patchChildren(domElem, oldVnode, newVnode);
	    }
	  } else if (newVnode.isText()) {
	    // Text
	    if (oldVnode.nodeValue !== newVnode.nodeValue) {
	      (0, _set_attribute.setAttribute)(domElem, 'nodeValue', newVnode.nodeValue, oldVnode.nodeValue);
	    }
	  }
	  return newDomElem;
	}

	function patchChildren(parentElem, oldNode, newNode) {
	  var CREATE = diffActions.CREATE;
	  var UPDATE = diffActions.UPDATE;
	  var MOVE = diffActions.MOVE;
	  var REMOVE = diffActions.REMOVE;

	  var oldChildren = (0, _vnode.groupByKey)(oldNode.children);
	  var newChildren = (0, _vnode.groupByKey)(newNode.children);
	  var key = function key(a) {
	    return a.key;
	  };

	  // Make a copy of the references to children to be deleted
	  var domChildNodes = Array.prototype.slice.call(dom.childNodes(parentElem));

	  function effect(type, prev, next, pos) {
	    switch (type) {
	      case CREATE:
	        {
	          var newDomElem = (0, _create_element2.default)(next.item);
	          dom.insertBefore(parentElem, newDomElem, dom.childNode(parentElem, pos));
	          break;
	        }
	      case UPDATE:
	        {
	          var domElem = dom.childNode(parentElem, prev.index);
	          patchNode(domElem, prev.item, next.item);
	          break;
	        }
	      case MOVE:
	        {
	          var childDomElem = dom.childNode(parentElem, prev.index);
	          patchNode(childDomElem, prev.item, next.item);
	          dom.insertBefore(parentElem, childDomElem, dom.childNode(parentElem, pos));
	          break;
	        }
	      case REMOVE:
	        {
	          dom.removeChild(parentElem, domChildNodes[prev.index]);
	          break;
	        }
	    }
	  }

	  (0, diffActions.default)(oldChildren, newChildren, effect, key);
	}

	/**
	 * compare the attributes of the two virtual nodes and update the dom attributes and event handlers
	 * @param domElem
	 * @param oldNode
	 * @param newNode
	 */
	function updateAttributes(domElem, oldNode, newNode) {
	  var oldAttrs = oldNode.attrs;
	  var newAttrs = newNode.attrs;

	  for (var name in newAttrs) {
	    if (newAttrs[name] !== oldAttrs[name]) {
	      (0, _set_attribute.setAttribute)(domElem, name, newAttrs[name], oldAttrs[name]);
	    }
	  }

	  for (var _name in oldAttrs) {
	    if (!(0, _index.has)(newAttrs, _name)) {
	      (0, _set_attribute.removeAttribute)(domElem, _name, oldAttrs[_name]);
	    }
	  }
	}

	function replaceNode(domElem, newNode) {
	  var newDomElem = (0, _create_element2.default)(newNode);
	  dom.replaceNode(newDomElem, domElem);
	  return newDomElem;
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeAttribute = removeAttribute;
	exports.setAttribute = setAttribute;

	var _index = __webpack_require__(4);

	var _events = __webpack_require__(14);

	var _events2 = _interopRequireDefault(_events);

	var _dom = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function removeAttribute(node, name, oldValue) {
	  var eventType = _events2.default[name];
	  if (eventType && (0, _index.isFunction)(oldValue)) {
	    (0, _dom.removeEventListener)(node, eventType, oldValue);
	    return;
	  }
	  switch (name) {
	    case 'checked':
	    case 'disabled':
	    case 'selected':
	      node[name] = false;
	      break;
	    case 'innerHTML':
	    case 'nodeValue':
	    case 'value':
	      node[name] = '';
	      break;
	    default:
	      node.removeAttribute(name);
	      break;
	  }
	}

	function setAttribute(node, name, value, oldValue) {
	  var eventType = _events2.default[name];
	  if (value === oldValue) {
	    return;
	  }
	  if (eventType) {
	    if ((0, _index.isFunction)(oldValue)) {
	      (0, _dom.removeEventListener)(node, eventType, oldValue);
	    }
	    (0, _dom.addEventListener)(node, eventType, value);
	    return;
	  }
	  if (!isValidAttribute(value)) {
	    removeAttribute(node, name, oldValue);
	    return;
	  }
	  switch (name) {
	    case 'checked':
	    case 'disabled':
	    case 'innerHTML':
	    case 'nodeValue':
	      node[name] = value;
	      break;
	    case 'selected':
	      node.selected = value;
	      // Fix for IE/Safari where select is not correctly selected on change
	      if (node.tagName === 'OPTION' && node.parentNode) {
	        var select = node.parentNode;
	        var options = Array.prototype.slice(select.options) || [];
	        select.selectedIndex = options.indexOf(node);
	      }
	      break;
	    case 'value':
	      node.value = value;
	      break;
	    default:
	      (0, _dom.setAttribute)(node, name, value);
	      break;
	  }
	}

	function isValidAttribute(value) {
	  if ((0, _index.isNumber)(value) || (0, _index.isString)(value)) {
	    return true;
	  }

	  if ((0, _index.isBoolean)(value)) {
	    return value;
	  }

	  return false;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _debug = __webpack_require__(5);

	Object.keys(_debug).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _debug[key];
	    }
	  });
	});

	var _type = __webpack_require__(6);

	Object.keys(_type).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _type[key];
	    }
	  });
	});

	var _bitset = __webpack_require__(7);

	Object.keys(_bitset).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _bitset[key];
	    }
	  });
	});

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.warn = warn;
	exports.error = error;
	var hasConsole = typeof console !== 'undefined';

	function warn() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  hasConsole && console.warn.apply(console, args);
	}
	function error() {
	  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    args[_key2] = arguments[_key2];
	  }

	  hasConsole && console.error.apply(console, args);
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.isString = isString;
	exports.isNumber = isNumber;
	exports.isNull = isNull;
	exports.isUndefined = isUndefined;
	exports.isObject = isObject;
	exports.isFunction = isFunction;
	exports.isBoolean = isBoolean;
	exports.has = has;
	exports.getKeys = getKeys;
	exports.getValues = getValues;
	exports.each = each;
	/**
	 * Check if string
	 * @param  {Mixed}  value
	 * @return {Boolean}
	 */
	var ObjProto = Object.prototype;
	var toString = ObjProto.toString;
	var nativeKeys = Object.keys;

	function isString(value) {
	  return typeof value === 'string';
	}

	function isNumber(value) {
	  return typeof value === 'number';
	}

	function isNull(value) {
	  return value === null;
	}

	function isUndefined(value) {
	  return typeof value === 'undefined';
	}

	function isObject(value) {
	  return isFunction(value) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !!value;
	}

	function isFunction(value) {
	  return typeof value === 'function';
	}

	function isBoolean(value) {
	  return typeof value === 'boolean';
	}

	var isArray = exports.isArray = Array.isArray || function isArray(obj) {
	  return toString.call(obj) === '[object Array]';
	};

	var hasOwn = ObjProto.hasOwnProperty;
	function has(obj, prop) {
	  return hasOwn.call(obj, prop);
	}

	function getKeys(obj) {
	  if (!isObject(obj)) return [];

	  if (nativeKeys) return nativeKeys(obj);

	  var result = [];
	  for (var key in obj) {
	    if (has(obj, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	function getValues(obj) {
	  var result = [];
	  var keys = getKeys(obj);
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (has(obj, key)) {
	      result.push(obj[key]);
	    }
	  }
	  return result;
	}

	function each(obj, func) {
	  if (isArray(obj)) {
	    for (var i = 0; i < obj.length; i++) {
	      func(obj[i], i);
	    }
	  } else if (isObject(obj)) {
	    var keys = getKeys(obj);
	    for (var _i = 0; _i < keys.length; _i++) {
	      var key = keys[_i];
	      func(obj[key], key, obj);
	    }
	  }
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _type = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Use typed arrays if we can
	 */
	var FastArray = (0, _type.isUndefined)(Uint32Array) ? Array : Uint32Array;

	/**
	 * Bitset
	 */

	var Bitset = function () {
	  function Bitset(sizeInBits) {
	    _classCallCheck(this, Bitset);

	    this.bits = new FastArray(Math.ceil(sizeInBits / 32));
	  }

	  _createClass(Bitset, [{
	    key: 'setBit',
	    value: function setBit(idx) {
	      var id = Bitset.id(idx);
	      this.bits[id.p] |= 1 << id.r;
	    }
	  }, {
	    key: 'clearBit',
	    value: function clearBit(idx) {
	      var id = Bitset.id(idx);
	      this.bits[id.p] &= ~(1 << id.r);
	    }
	  }, {
	    key: 'getBit',
	    value: function getBit(idx) {
	      var id = Bitset.id(idx);
	      return !!(this.bits[id.p] & 1 << id.r);
	    }
	  }], [{
	    key: 'id',
	    value: function id(idx) {
	      var r = idx % 32;
	      var p = (idx - r) / 32;

	      return { r: r, p: p };
	    }
	  }]);

	  return Bitset;
	}();

	exports.default = Bitset;

/***/ },
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.namespaceMap = undefined;
	exports.setAttribute = setAttribute;
	exports.isSvgElement = isSvgElement;
	exports.createElement = createElement;
	exports.createTextNode = createTextNode;
	exports.insertBefore = insertBefore;
	exports.removeChild = removeChild;
	exports.appendChild = appendChild;
	exports.replaceNode = replaceNode;
	exports.emptyElement = emptyElement;
	exports.query = query;
	exports.tagName = tagName;
	exports.childNode = childNode;
	exports.childNodes = childNodes;
	exports.removeEventListener = removeEventListener;
	exports.addEventListener = addEventListener;

	var _index = __webpack_require__(4);

	var namespaceMap = exports.namespaceMap = {
	  svg: 'http://www.w3.org/2000/svg',
	  math: 'http://www.w3.org/1998/Math/MathML'
	};

	var svgElements = 'animate,circle,defs,ellipse,g,line,linearGradient,mask,path,pattern,polygon,polyline,radialGradient,rect,stop,svg,text,tspan'.split(',');
	var svgMap = svgElements.reduce(function (acc, name) {
	  acc[name] = true;
	  return acc;
	}, {});

	var svgAttributeNamespaces = {
	  ev: 'http://www.w3.org/2001/xml-events',
	  xlink: 'http://www.w3.org/1999/xlink',
	  xml: 'http://www.w3.org/XML/1998/namespace',
	  xmlns: 'http://www.w3.org/2000/xmlns/'
	};

	/**
	 * Get namespace of svg attribute
	 *
	 * @param {String} attributeName
	 * @return {String} namespace
	 */

	function getSvgAttributeNamespace(attributeName) {
	  // if no prefix separator in attributeName, then no namespace
	  if (attributeName.indexOf(':') === -1) return null;

	  // get prefix from attributeName
	  var prefix = attributeName.split(':', 1)[0];

	  // if prefix in supported prefixes
	  if ((0, _index.has)(svgAttributeNamespaces, prefix)) {
	    // then namespace of prefix
	    return svgAttributeNamespaces[prefix];
	  } else {
	    // else unsupported prefix
	    throw new Error('svg-attribute-namespace: prefix "' + prefix + '" is not supported by SVG.');
	  }
	}

	function setAttribute(node, key, val) {
	  var ns = getSvgAttributeNamespace(key);
	  return ns ? node.setAttributeNS(ns, key, val) : node.setAttribute(key, val);
	}

	function isSvgElement(name) {
	  return (0, _index.has)(svgMap, name);
	}

	function createElement(tagName) {
	  if (isSvgElement(tagName)) {
	    return document.createElementNS(namespaceMap.svg, tagName);
	  }

	  return document.createElement(tagName);
	}

	function createTextNode(str) {
	  return document.createTextNode(str);
	}

	function insertBefore(parentNode, newNode, referenceNode) {
	  var refNode = referenceNode;
	  if ((0, _index.isUndefined)(refNode)) {
	    refNode = null;
	  }
	  // If referenceNode is null, the newNode is inserted at the end of the list of child nodes.
	  parentNode.insertBefore(newNode, refNode);
	}

	function removeChild(node, child) {
	  node.removeChild(child);
	}

	function appendChild(node, child) {
	  node.appendChild(child);
	}

	function replaceNode(newNode, node) {
	  if (node.parentNode) {
	    node.parentNode.replaceChild(newNode, node);
	  }
	}

	function emptyElement(el) {
	  var node = void 0;
	  while (node = el.firstChild) {
	    el.removeChild(node);
	  }
	  return el;
	}

	function query(el) {
	  if ((0, _index.isString)(el)) {
	    return document.querySelector(el);
	  }

	  return el;
	}

	function tagName(node) {
	  return node.tagName;
	}

	function childNode(node, i) {
	  return node.childNodes[i];
	}

	function childNodes(node) {
	  return node.childNodes;
	}

	function removeEventListener(node, eventType, handler) {
	  node.removeEventListener(eventType, handler);
	}

	function addEventListener(node, eventType, handler) {
	  node.addEventListener(eventType, handler);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createElement;

	var _vnode = __webpack_require__(11);

	var _vnode2 = _interopRequireDefault(_vnode);

	var _index = __webpack_require__(4);

	var _dom = __webpack_require__(9);

	var dom = _interopRequireWildcard(_dom);

	var _set_attribute = __webpack_require__(3);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createElement(vnode) {
	  switch (vnode.type) {
	    case _vnode2.default.Element:
	      return createHtmlElement(vnode);
	    case _vnode2.default.Empty:
	      return createEmptyNode();
	    case _vnode2.default.Text:
	      return createTextNode(vnode);
	  }
	}

	function createHtmlElement(vnode) {
	  var tagName = vnode.tagName;
	  var children = vnode.children;
	  var attrs = vnode.attrs;


	  var elem = dom.createElement(tagName);

	  for (var name in attrs) {
	    (0, _set_attribute.setAttribute)(elem, name, attrs[name]);
	  }

	  children.forEach(function (child) {
	    if ((0, _index.isNull)(child) || (0, _index.isUndefined)(child)) {
	      return;
	    }

	    dom.appendChild(elem, createElement(child));
	  });
	  return elem;
	}

	function createTextNode(vnode) {
	  var text = (0, _index.isNumber)(vnode.nodeValue) || (0, _index.isString)(vnode.nodeValue) ? vnode.nodeValue : '';
	  return dom.createTextNode(text);
	}

	function createEmptyNode() {
	  return dom.createElement('noscript');
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.groupByKey = groupByKey;

	var _index = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * This function lets us create virtual nodes using a simple syntax.
	 *
	 * let node = h('div', { id: 'foo' }, [
	 *   h('a', { href: 'http://google.com' },
	 *     h('span', {}, 'Google'),
	 *     h('b', {}, 'Link')
	 *   )
	 * ])
	 */

	var VNode = function () {
	  function VNode(type, tagName, attrs, children) {
	    _classCallCheck(this, VNode);

	    this.type = type;
	    if (type === VNode.Text) {
	      this.nodeValue = tagName;
	    } else {
	      this.tagName = tagName;
	    }

	    attrs = attrs || {};
	    if ((0, _index.isString)(attrs.key) || (0, _index.isNumber)(attrs.key)) {
	      this.key = attrs.key;
	    }
	    delete attrs.key;

	    this.attrs = attrs;
	    this.children = children || [];
	  }

	  _createClass(VNode, [{
	    key: 'isText',
	    value: function isText() {
	      return this.type === VNode.Text;
	    }
	  }, {
	    key: 'isEmpty',
	    value: function isEmpty() {
	      return this.type === VNode.Empty;
	    }
	  }, {
	    key: 'isElement',
	    value: function isElement() {
	      return this.type === VNode.Element;
	    }
	  }]);

	  return VNode;
	}();

	exports.default = VNode;


	VNode.Text = 'text';
	VNode.Element = 'element';
	VNode.Empty = 'empty';

	/**
	 * Group an array of virtual elements by their key, using index as a fallback.
	 */
	function groupByKey(children) {
	  return children.map(function (child, i) {
	    var key = (0, _index.isNull)(child) ? i : child.key || i;
	    return {
	      key: String(key),
	      item: child,
	      index: i
	    };
	  });
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.REMOVE = exports.MOVE = exports.UPDATE = exports.CREATE = undefined;

	var _index = __webpack_require__(4);

	var _bitset = __webpack_require__(7);

	var _bitset2 = _interopRequireDefault(_bitset);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CREATE = 0;
	var UPDATE = 1;
	var MOVE = 2;
	var REMOVE = 3;

	/**
	 * Compare two arrays of virtual nodes and emit the actions to transform the left into the right.
	 * CREATE - Receives (type = CREATE, prev = null, next = newItem, pos = positionToCreate)
	 * UPDATE - Receives (type = UPDATE, prev = oldItem, next = newItem)
	 * MOVE - Receives (type = MOVE, prev = oldItem, next = newItem, pos = newPosition)
	 * REMOVE - Receives (type = REMOVE, prev = oldItem)
	 */
	function diff(oldChildren, newChildren, effect, keyGetter) {
	  var oldStartIdx = 0;
	  var newStartIdx = 0;
	  var oldEndIdx = oldChildren.length - 1;
	  var newEndIdx = newChildren.length - 1;
	  var oldStartNode = oldChildren[oldStartIdx];
	  var newStartNode = newChildren[newStartIdx];

	  // List head is the same
	  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx && equal(oldStartNode, newStartNode)) {
	    effect(UPDATE, oldStartNode, newStartNode, newStartIdx);
	    oldStartNode = oldChildren[++oldStartIdx];
	    newStartNode = newChildren[++newStartIdx];
	  }

	  if (newStartIdx > newEndIdx && oldStartIdx > oldEndIdx) {
	    return;
	  }

	  var oldEndNode = oldChildren[oldEndIdx];
	  var newEndNode = newChildren[newEndIdx];
	  var movedFromFront = 0;

	  // Reversed
	  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx && equal(oldStartNode, newEndNode)) {
	    effect(MOVE, oldStartNode, newEndNode, oldEndIdx - movedFromFront + 1);
	    oldStartNode = oldChildren[++oldStartIdx];
	    newEndNode = newChildren[--newEndIdx];
	    ++movedFromFront;
	  }

	  // Reversed the other way (in case of e.g. reverse and append)
	  while (oldEndIdx >= oldStartIdx && newStartIdx <= newEndIdx && equal(newStartNode, oldEndNode)) {
	    effect(MOVE, oldEndNode, newStartNode, newStartIdx);
	    oldEndNode = oldChildren[--oldEndIdx];
	    newStartNode = newChildren[++newStartIdx];
	    --movedFromFront;
	  }

	  // List tail is the same
	  while (oldEndIdx >= oldStartIdx && newEndIdx >= newStartIdx && equal(oldEndNode, newEndNode)) {
	    effect(UPDATE, oldEndNode, newEndNode, newEndIdx);
	    oldEndNode = oldChildren[--oldEndIdx];
	    newEndNode = newChildren[--newEndIdx];
	  }

	  if (oldStartIdx > oldEndIdx) {
	    while (newStartIdx <= newEndIdx) {
	      effect(CREATE, null, newStartNode, newStartIdx);
	      newStartNode = newChildren[++newStartIdx];
	    }

	    return;
	  }

	  if (newStartIdx > newEndIdx) {
	    while (oldStartIdx <= oldEndIdx) {
	      effect(REMOVE, oldStartNode);
	      oldStartNode = oldChildren[++oldStartIdx];
	    }

	    return;
	  }

	  var created = 0;
	  var pivotDest = null;
	  var pivotIdx = oldStartIdx - movedFromFront;
	  var keepBase = oldStartIdx;
	  var keep = new _bitset2.default(oldEndIdx - oldStartIdx);

	  var prevMap = keyMap(oldChildren, oldStartIdx, oldEndIdx + 1, keyGetter);

	  for (; newStartIdx <= newEndIdx; newStartNode = newChildren[++newStartIdx]) {
	    var oldIdx = prevMap[keyGetter(newStartNode)];

	    if ((0, _index.isUndefined)(oldIdx)) {
	      effect(CREATE, null, newStartNode, pivotIdx++);
	      ++created;
	    } else if (oldStartIdx !== oldIdx) {
	      keep.setBit(oldIdx - keepBase);
	      effect(MOVE, oldChildren[oldIdx], newStartNode, pivotIdx++);
	    } else {
	      pivotDest = newStartIdx;
	    }
	  }

	  if (pivotDest !== null) {
	    keep.setBit(0);
	    effect(MOVE, oldChildren[oldStartIdx], newChildren[pivotDest], pivotDest);
	  }

	  // If there are no creations, then you have to
	  // remove exactly max(prevLen - nextLen, 0) elements in this
	  // diff. You have to remove one more for each element
	  // that was created. This means once we have
	  // removed that many, we can stop.
	  var necessaryRemovals = oldChildren.length - newChildren.length + created;
	  for (var removals = 0; removals < necessaryRemovals; oldStartNode = oldChildren[++oldStartIdx]) {
	    if (!keep.getBit(oldStartIdx - keepBase)) {
	      effect(REMOVE, oldStartNode);
	      ++removals;
	    }
	  }

	  function equal(a, b) {
	    return keyGetter(a) === keyGetter(b);
	  }
	}

	function keyMap(items, start, end, key) {
	  var map = {};

	  for (var i = start; i < end; ++i) {
	    map[key(items[i])] = i;
	  }

	  return map;
	}

	exports.default = diff;
	exports.CREATE = CREATE;
	exports.UPDATE = UPDATE;
	exports.MOVE = MOVE;
	exports.REMOVE = REMOVE;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = create;

	var _index = __webpack_require__(4);

	var _vnode = __webpack_require__(11);

	var _vnode2 = _interopRequireDefault(_vnode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function create(tag, attrs) {
	  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }

	  children = children.reduce(reduceChildren, []);
	  return new _vnode2.default(_vnode2.default.Element, tag, attrs, children);
	}

	function reduceChildren(acc, vnode) {
	  if ((0, _index.isUndefined)(vnode)) {
	    throw new Error('vnode cannot be undefined');
	  }

	  var result = vnode;
	  if ((0, _index.isString)(vnode) || (0, _index.isNumber)(vnode)) {
	    result = new _vnode2.default(_vnode2.default.Text, vnode);
	  } else if ((0, _index.isNull)(vnode)) {
	    result = new _vnode2.default(_vnode2.default.Empty);
	  } else if (Array.isArray(vnode)) {
	    result = vnode.reduce(reduceChildren, []);
	  }
	  return acc.concat(result);
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Special attributes that map to DOM events.
	 */

	exports.default = {
	  onAbort: 'abort',
	  onAnimationStart: 'animationstart',
	  onAnimationIteration: 'animationiteration',
	  onAnimationEnd: 'animationend',
	  onBlur: 'blur',
	  onCanPlay: 'canplay',
	  onCanPlayThrough: 'canplaythrough',
	  onChange: 'change',
	  onClick: 'click',
	  onContextMenu: 'contextmenu',
	  onCopy: 'copy',
	  onCut: 'cut',
	  onDoubleClick: 'dblclick',
	  onDrag: 'drag',
	  onDragEnd: 'dragend',
	  onDragEnter: 'dragenter',
	  onDragExit: 'dragexit',
	  onDragLeave: 'dragleave',
	  onDragOver: 'dragover',
	  onDragStart: 'dragstart',
	  onDrop: 'drop',
	  onDurationChange: 'durationchange',
	  onEmptied: 'emptied',
	  onEncrypted: 'encrypted',
	  onEnded: 'ended',
	  onError: 'error',
	  onFocus: 'focus',
	  onInput: 'input',
	  onInvalid: 'invalid',
	  onKeyDown: 'keydown',
	  onKeyPress: 'keypress',
	  onKeyUp: 'keyup',
	  onLoad: 'load',
	  onLoadedData: 'loadeddata',
	  onLoadedMetadata: 'loadedmetadata',
	  onLoadStart: 'loadstart',
	  onPause: 'pause',
	  onPlay: 'play',
	  onPlaying: 'playing',
	  onProgress: 'progress',
	  onMouseDown: 'mousedown',
	  onMouseEnter: 'mouseenter',
	  onMouseLeave: 'mouseleave',
	  onMouseMove: 'mousemove',
	  onMouseOut: 'mouseout',
	  onMouseOver: 'mouseover',
	  onMouseUp: 'mouseup',
	  onPaste: 'paste',
	  onRateChange: 'ratechange',
	  onReset: 'reset',
	  onScroll: 'scroll',
	  onSeeked: 'seeked',
	  onSeeking: 'seeking',
	  onSubmit: 'submit',
	  onStalled: 'stalled',
	  onSuspend: 'suspend',
	  onTimeUpdate: 'timeupdate',
	  onTransitionEnd: 'transitionend',
	  onTouchCancel: 'touchcancel',
	  onTouchEnd: 'touchend',
	  onTouchMove: 'touchmove',
	  onTouchStart: 'touchstart',
	  onVolumeChange: 'volumechange',
	  onWaiting: 'waiting',
	  onWheel: 'wheel'
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _store = __webpack_require__(16);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _store2.default;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OpalStore = function () {
	  function OpalStore(initialModel, updater) {
	    _classCallCheck(this, OpalStore);

	    this.model = initialModel;
	    this.modelUpdater = updater;

	    this.listeners = [];
	  }

	  _createClass(OpalStore, [{
	    key: 'getModel',
	    value: function getModel() {
	      return this.model;
	    }
	  }, {
	    key: 'dispatch',
	    value: function dispatch(action) {
	      var update = this.modelUpdater;
	      var oldModel = this.model;

	      this.model = update(oldModel, action);

	      this.listeners.forEach(function (listener) {
	        listener();
	      });
	    }
	  }, {
	    key: 'subscribe',
	    value: function subscribe(listener) {
	      if (!(0, _index.isFunction)(listener)) {
	        throw new Error('Invalid argument: listener needs to be a function');
	      }

	      var allListeners = this.listeners;
	      allListeners.push(listener);

	      return function unsubscribe() {
	        var index = allListeners.indexOf(listener);

	        if (index >= 0) {
	          allListeners.splice(index, 1);
	        }
	      };
	    }
	  }]);

	  return OpalStore;
	}();

	exports.default = OpalStore;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.bindActionCreator = bindActionCreator;
	exports.bindActionCreators = bindActionCreators;
	exports.createActionCreator = createActionCreator;
	exports.createActionCreators = createActionCreators;
	exports.createModelUpdater = createModelUpdater;

	var _index = __webpack_require__(4);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function bindActionCreator(action, dispatch) {
	  return function () {
	    return dispatch(action.apply(undefined, arguments));
	  };
	}

	function bindActionCreators(actions, dispatch) {
	  if (!(0, _index.isObject)(actions) || (0, _index.isNull)(actions)) {
	    throw Error('actions must be an object');
	  }

	  var result = {};
	  var keys = (0, _index.getKeys)(actions);
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    result[key] = bindActionCreator(actions[key], dispatch);
	  }
	  return result;
	}

	/**
	 * Create an action creator given the action type. the returned action creator can take any parameters
	 * @param actionType
	 * @returns {function()}
	 */
	function createActionCreator(actionType) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return {
	      type: actionType,
	      params: args
	    };
	  };
	}
	/**
	 * Create an object whose keys are actions types and values the action creators. And all the actions creators will be
	 * wrapped with the dispatch call, so they can be called directly to dispatch an action
	 * @param actionTypes, array of action types
	 */
	function createActionCreators(actionTypes) {
	  var actionCreators = {};
	  (0, _index.each)(actionTypes, function (actionType) {
	    if ((0, _index.has)(actionCreators, actionType)) {
	      throw new Error('Duplicated action type found in' + actionType);
	    }
	    actionCreators[actionType] = createActionCreator(actionType);
	  });
	  return actionCreators;
	}

	/**
	 * Create an update function which will handle the actions created by calling createActionCreator
	 * @param actionHandlerMap, an object which has all the action handlers in format of {actionType: handler}, e.g.
	 * {
	   *  'Increase': (model) => model + 1,
	   *  'Decrease': (model) => model - 1
	   *  }
	 * @returns {update}, the update function used by the OpalStore
	 */
	function createModelUpdater(actionHandlerMap) {
	  return function update(model, action) {
	    var newModel = model;
	    // Only update the model if the action type exists
	    if ((0, _index.has)(actionHandlerMap, action.type)) {
	      var handler = actionHandlerMap[action.type];
	      newModel = handler.apply(undefined, _toConsumableArray(action.params).concat([model]));
	    }
	    return newModel;
	  };
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(4);

	var _patch = __webpack_require__(2);

	var _patch2 = _interopRequireDefault(_patch);

	var _create_element = __webpack_require__(10);

	var _create_element2 = _interopRequireDefault(_create_element);

	var _dom = __webpack_require__(9);

	var _index2 = __webpack_require__(15);

	var _index3 = _interopRequireDefault(_index2);

	var _action = __webpack_require__(17);

	var _create = __webpack_require__(13);

	var _create2 = _interopRequireDefault(_create);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OpalApp = function () {
	  function OpalApp(options) {
	    _classCallCheck(this, OpalApp);

	    this.model = options.model;
	    this.render = options.render;

	    this.createStore(options);

	    this.root = options.el && (0, _dom.query)(options.el);
	    (0, _dom.emptyElement)(this.root);
	    this.updateView();
	  }

	  _createClass(OpalApp, [{
	    key: 'createStore',
	    value: function createStore(options) {
	      var _this = this;

	      var modelUpdator = options.update || {};
	      if (!(0, _index.isFunction)(modelUpdator)) {
	        modelUpdator = (0, _action.createModelUpdater)(this.enhanceHandler(options.update));
	        var actions = (0, _action.createActionCreators)((0, _index.getKeys)(options.update));
	        this.actions = (0, _action.bindActionCreators)(actions, this.dispatch.bind(this));
	      }

	      this.store = new _index3.default(options.model, modelUpdator);
	      this.store.subscribe(function () {
	        _this.model = _this.store.getModel();
	        _this.updateView();
	      });
	    }

	    // Enhances the action handler to allow this.actions to be injected to the handler function as the last argument

	  }, {
	    key: 'enhanceHandler',
	    value: function enhanceHandler(actionHandlerMap) {
	      var _this2 = this;

	      var enhanced = {};
	      (0, _index.each)(actionHandlerMap, function (actionHandler, actionType) {
	        var newHandler = function newHandler() {
	          for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
	            params[_key] = arguments[_key];
	          }

	          // inject 1 more param to the handler, and execute the original handler in the application context
	          return actionHandler.apply(_this2, [].concat(params, [_this2.actions]));
	        };
	        enhanced[actionType] = newHandler;
	      });
	      return enhanced;
	    }
	  }, {
	    key: 'updateView',
	    value: function updateView() {
	      var oldVnode = this._vnode;
	      // Inject the createElement function to the render function
	      var newVnode = this.render(_create2.default);

	      var domElem = this._elem;
	      if (!domElem) {
	        // First time rendering
	        domElem = (0, _create_element2.default)(newVnode);
	        (0, _dom.appendChild)(this.root, domElem);
	      } else {
	        // Patch the DOM
	        domElem = (0, _patch2.default)(this._elem, oldVnode, newVnode);
	      }

	      this._elem = domElem;
	      this._vnode = newVnode;
	    }
	  }, {
	    key: 'dispatch',
	    value: function dispatch(action) {
	      this.store.dispatch(action);
	    }
	  }]);

	  return OpalApp;
	}();

	exports.default = OpalApp;

/***/ }
/******/ ]);