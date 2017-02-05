(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Melt", [], factory);
	else if(typeof exports === 'object')
		exports["Melt"] = factory();
	else
		root["Melt"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	var _component = __webpack_require__(1);

	var _component2 = _interopRequireDefault(_component);

	var _index = __webpack_require__(33);

	var _app = __webpack_require__(23);

	var _app2 = _interopRequireDefault(_app);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Melt(options) {
	  return (0, _app2.default)(options);
	}

	Melt.createElement = _component2.default;
	Melt.component = _index.registerComponent;
	Melt.container = _index.registerContainer;
	Melt.directive = _index.registerDirective;
	Melt.app = Melt;

	module.exports = Melt;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createComponent = createComponent;
	exports.default = createElement;

	var _index = __webpack_require__(2);

	var _index2 = _interopRequireDefault(_index);

	var _create_dom = __webpack_require__(32);

	var _create_dom2 = _interopRequireDefault(_create_dom);

	var _patch = __webpack_require__(20);

	var _patch2 = _interopRequireDefault(_patch);

	var _create = __webpack_require__(22);

	var _create2 = _interopRequireDefault(_create);

	var _index3 = __webpack_require__(3);

	var _index4 = __webpack_require__(10);

	var _index5 = __webpack_require__(29);

	var _component_registry = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createComponent(options) {
	  if (!options.render && !options.template) {
	    throw new Error('Components need to have either a render function or a template to get rendered');
	  }

	  var ComponentClass = options.class || _index3.noop;

	  function Component(options) {
	    var _this = this;

	    this._options = options;
	    this._renderFn = options.render;

	    var propsSpec = options.props || {};
	    // Convert props spec to map if is array: ['foo', 'bar']
	    this._propsSpec = {};
	    if ((0, _index3.isArray)(propsSpec)) {
	      (0, _index3.each)(propsSpec, function (name) {
	        _this._propsSpec[name] = true;
	      });
	    } else {
	      this._propsSpec = propsSpec;
	    }

	    ComponentClass.call(this);
	  }

	  Component.prototype = Object.create(ComponentClass.prototype, {
	    constructor: Component
	  });

	  Component.prototype.render = function render(context) {
	    var _this2 = this;

	    // For container, injects the data in context to 'this' to allow the render function to access them
	    if (this._options.isContainer) {
	      (0, _index3.each)(context, function (value, key) {
	        _this2[key] = value;
	      });
	    }

	    if (this._options.template) {
	      // If the props are specified, then allows the template to access the props without using this.props
	      (0, _index3.each)(this.props, function (value, key) {
	        if (_this2._propsSpec[key]) {
	          _this2[key] = value;
	        }
	      });
	    }

	    if (!this._renderFn) {
	      this._renderFn = (0, _index2.default)(this._options.template);
	      options.render = this._renderFn;
	    }
	    return this._renderFn({
	      createElement: createElement,
	      renderCollection: _index4.renderCollection,
	      range: _index3.range,
	      component: this
	    });
	  };

	  Component.prototype.patch = function patch(context) {
	    context = context || { component: this };
	    var oldVnode = this._vnode;
	    var vnode = this.render(context);
	    var domElem = this.elem;
	    if (!domElem) {
	      // First time rendering
	      domElem = (0, _create_dom2.default)(vnode, context);
	    } else {
	      // Patch the DOM
	      domElem = (0, _patch2.default)(domElem, oldVnode, vnode, context);
	    }
	    this.elem = vnode.elem;
	    this._vnode = vnode;

	    return domElem;
	  };

	  return new Component(options);
	}

	function createElement(tag, attributes) {
	  var options = (0, _index3.isObject)(tag) ? tag : (0, _component_registry.getComponent)(tag);
	  var elemTag = options ? createComponent(options) : tag;

	  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }

	  var vnode = (0, _create2.default)(elemTag, attributes, children);
	  if (attributes) {
	    vnode.addLifecycleEventListener(new _index5.DirectiveHandler());
	  }
	  return vnode;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = compile;

	var _index = __webpack_require__(3);

	var _ast_parser = __webpack_require__(8);

	var _codegen = __webpack_require__(14);

	function compile(template) {
	  var ast = (0, _ast_parser.parse)(template);
	  // [variable declarations, statements]
	  var codeSnippet = (0, _codegen.generate)(ast);
	  return createFunction(codeSnippet);
	}

	function createFunction(codeSnippet) {
	  try {
	    // eslint-disable-next-line no-new-func
	    return new Function('$ctx', ';var _h = $ctx.createElement, _c = $ctx.renderCollection, range = $ctx.range;\n        with($ctx.component){return ' + codeSnippet + '};');
	  } catch (error) {
	    (0, _index.warn)('Syntax error:' + codeSnippet);
	    return _index.noop;
	  }
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _debug = __webpack_require__(4);

	Object.keys(_debug).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _debug[key];
	    }
	  });
	});

	var _type = __webpack_require__(5);

	Object.keys(_type).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _type[key];
	    }
	  });
	});

	var _bitset = __webpack_require__(6);

	Object.keys(_bitset).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _bitset[key];
	    }
	  });
	});

	var _string = __webpack_require__(7);

	Object.keys(_string).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _string[key];
	    }
	  });
	});
	exports.noop = noop;
	exports.makeMap = makeMap;
	exports.uniqueId = uniqueId;
	exports.range = range;
	function noop() {}

	function makeMap(str) {
	  var obj = {};
	  var items = str.split(',');
	  for (var i = 0; i < items.length; i++) {
	    obj[items[i]] = true;
	  }
	  return obj;
	}

	function uniqueId() {
	  var date = Date.now();

	  // If created at same millisecond as previous
	  if (date <= uniqueId.previous) {
	    date = ++uniqueId.previous;
	  } else {
	    uniqueId.previous = date;
	  }

	  return date;
	}

	uniqueId.previous = 0;

	function range(start, stop, step) {
	  if (typeof stop === 'undefined') {
	    stop = start;
	    start = 0;
	  }

	  if (typeof step === 'undefined') {
	    step = 1;
	  }

	  var index = -1;
	  var length = Math.max(Math.ceil((stop - start) / (step || 1)), 0);
	  var result = Array(length);

	  while (length--) {
	    result[++index] = start;
	    start += step;
	  }
	  return result;
	}

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
	exports.extend = extend;
	/**
	 * Check if string
	 * @param  {Mixed}  value
	 * @return {Boolean}
	 */
	var ObjProto = Object.prototype;
	var toString = ObjProto.toString;
	var nativeKeys = Object.keys;

	function isString(value) {
	  return typeof value === 'string' || value instanceof String;
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

	/**
	 * Merge the contents of two or more objects together into the first object.
	 * @param obj
	 * @param sources
	 * @returns {*}
	 */
	function extend(obj) {
	  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    sources[_key - 1] = arguments[_key];
	  }

	  if (obj == null || sources.length === 0) {
	    return obj;
	  }

	  for (var i = 0; i < sources.length; i++) {
	    var source = sources[i];
	    var keys = getKeys(sources[i]);
	    for (var j = 0; j < keys.length; j++) {
	      var key = keys[j];
	      var value = source[key];
	      if (isUndefined(value)) {
	        continue;
	      }
	      obj[key] = value;
	    }
	  }
	  return obj;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _type = __webpack_require__(5);

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
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.camelize = camelize;
	exports.capitalize = capitalize;
	function camelize(s) {
	  return s.replace(/(-[a-z])/g, function ($1) {
	    return $1.toUpperCase().replace('-', '');
	  });
	}

	function capitalize(s) {
	  return s.charAt(0).toUpperCase() + s.slice(1);
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.parse = parse;

	var _html_parser = __webpack_require__(9);

	var _index = __webpack_require__(10);

	var _index2 = __webpack_require__(3);

	var _text_parser = __webpack_require__(12);

	var _text_parser2 = _interopRequireDefault(_text_parser);

	var _ast_type = __webpack_require__(13);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var eachRE = /^\s*\(?(\s*\w*\s*,?\s*\w*\s*)\)?\s+in\s+(.+)$/;
	// special attributes that should not be camelized
	var specialAttrRE = /^data-|^aria-/;
	var argSeparator = '.';
	/**
	 * Parse the template into an AST tree
	 * @param template, the html template
	 */
	function parse(template) {
	  var root = void 0,
	      currentParent = void 0;
	  var stack = [];
	  var isInPre = false;
	  (0, _html_parser.parseHtml)(template, {
	    start: function startTag(tagName, attrs, unary) {
	      var tag = tagName.toLowerCase();
	      if ((0, _index.isSpecialTag)(tag)) {
	        throw new Error('Tag is not allowed in the template:' + tagName);
	      }
	      if (tag === 'pre') {
	        isInPre = true;
	      }
	      ensureSingleRoot(root, currentParent);

	      var element = {
	        type: _ast_type.AstElementType.Element,
	        tagName: tag,
	        attrList: attrs,
	        attributes: toAttributeMap(attrs),
	        children: []
	      };

	      if (element.attributes[_ast_type.AstDirective.Each]) {
	        parseEach(element);
	      }
	      if (element.attributes[_ast_type.AstDirective.If]) {
	        parseIf(element);
	      }

	      if (!root) {
	        root = element;
	      }

	      if (currentParent) {
	        currentParent.children.push(element);
	      }

	      if (!unary) {
	        currentParent = element;
	        stack.push(element);
	      }
	    },
	    end: function endTag() {
	      var elem = stack[stack.length - 1];
	      stack.pop();
	      if (elem.tagName === 'pre') {
	        isInPre = false;
	      }
	      currentParent = stack.length > 0 ? stack[stack.length - 1] : null;
	    },
	    chars: function chars(text) {
	      if (!isInPre) {
	        text = text.trim();
	      }
	      if (text.length === 0) {
	        return;
	      }
	      ensureSingleRoot(root, currentParent);

	      var tokens = (0, _text_parser2.default)(text);
	      var textElement = {
	        type: _ast_type.AstElementType.Text,
	        rawValue: text,
	        tokens: tokens
	      };

	      // Template only has the text, add a span to wrap the text
	      if (!root) {
	        root = currentParent = {
	          type: _ast_type.AstElementType.Element,
	          tagName: 'span',
	          children: []
	        };
	      }

	      // Text as a child
	      if (currentParent) {
	        currentParent.children.push(textElement);
	      }
	    }
	  });
	  return root;
	}

	/**
	 * Convert a list of attribute object in form of {name: 'aa', value: 'bb'}
	 * to an object map {aa: bb}
	 * @param attrList
	 */
	function toAttributeMap(attrList) {
	  var map = {};
	  (0, _index2.each)(attrList, function (attr) {
	    var tokens = (0, _text_parser2.default)(attr.value.trim());

	    var attrName = void 0;
	    if (specialAttrRE.test(attr.name)) {
	      attrName = attr.name;
	    } else if (attr.name.indexOf('.') !== -1) {
	      // binding attribute e.g. my-class.*={completed: a > 0} or style.color={'red'}
	      // camelize the first part which is the directive name
	      var parts = attr.name.split(argSeparator);
	      parts[0] = (0, _index2.camelize)(parts[0]);
	      attrName = parts.join(argSeparator);
	    } else {
	      attrName = (0, _index2.camelize)(attr.name);
	    }
	    if ((0, _index2.has)(map, attrName)) {
	      (0, _index2.warn)('Found a duplicated attribute, name: ' + attr.name + ', value:' + attr.value);
	    }

	    var attrInfo = {
	      rawName: attr.name,
	      rawValue: attr.value,
	      tokens: tokens
	    };

	    map[attrName] = attrInfo;
	  });

	  return map;
	}

	function parseIf(element) {
	  var attr = element.attributes[_ast_type.AstDirective.If];
	  delete element.attributes[_ast_type.AstDirective.If];

	  if (!validateDirectiveSyntax(attr, _ast_type.AstDirective.If)) {
	    return;
	  }

	  element.if = {
	    condition: attr.tokens[0].token
	  };
	}

	function parseEach(element) {
	  var attr = element.attributes[_ast_type.AstDirective.Each];
	  delete element.attributes[_ast_type.AstDirective.Each];

	  if (!validateDirectiveSyntax(attr, _ast_type.AstDirective.Each)) {
	    return;
	  }

	  // Supported syntax:
	  // each={value in array}, each={(value,index) in array}
	  // each={value in object}, each={(value,key) in object}
	  var eachStatement = attr.tokens[0].token;
	  eachRE.lastIndex = 0;
	  var matches = eachRE.exec(eachStatement);
	  if (!matches) {
	    (0, _index2.error)('Invalid each statement: ' + eachStatement);
	  } else {
	    element.each = {
	      variables: matches[1].split(',').join(','), // remove the trailing and preceding ','
	      object: matches[2]
	    };
	  }
	}

	function validateDirectiveSyntax(attr, dirType) {
	  if (!attr.rawValue) {
	    (0, _index2.warn)(dirType + ' directive cannot be empty');
	    return false;
	  }

	  if (attr.tokens.length !== 1) {
	    (0, _index2.warn)('The Expression of directive ' + dirType + ': ' + attr.rawValue + ' is invalid');
	    return false;
	  }
	  return true;
	}

	function ensureSingleRoot(root, currentParent) {
	  if (!currentParent && root) {
	    throw new Error('Component template can only have one root element');
	  }
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.parseHtml = parseHtml;

	var _index = __webpack_require__(3);

	var _index2 = __webpack_require__(10);

	// Regular Expressions for parsing tags and attributes
	var startTagRE = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.*]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
	var endTagRE = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
	var attrRE = /([a-zA-Z_:][-a-zA-Z0-9_:.*]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

	// Elements without close Tag
	var unaryTag = (0, _index.makeMap)('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');

	// Block Elements
	var blockTag = (0, _index.makeMap)('address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

	// Inline Elements
	var inlineTag = (0, _index.makeMap)('abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

	// Elements that you can, intentionally, leave open (and which close themselves)
	var closeSelfTag = (0, _index.makeMap)('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

	// Attributes that have their values filled in disabled="disabled"
	var fillAttrs = (0, _index.makeMap)('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

	function parseHtml(html, handler) {
	  var stack = [];
	  var last = html;
	  stack.last = function () {
	    return this[this.length - 1];
	  };

	  while (html) {
	    var index = void 0,
	        chars = void 0,
	        match = void 0;
	    chars = true;

	    // Make sure we're not in a script or style element
	    if (!stack.last() || !(0, _index2.isSpecialTag)(stack.last())) {
	      // Comment
	      if (html.indexOf('<!--') === 0) {
	        index = html.indexOf('-->');

	        if (index >= 0) {
	          if (handler.comment) {
	            handler.comment(html.substring(4, index));
	          }
	          html = html.substring(index + 3);
	          chars = false;
	        }

	        // end tag
	      } else if (html.indexOf('</') === 0) {
	        match = html.match(endTagRE);

	        if (match) {
	          html = html.substring(match[0].length);
	          match[0].replace(endTagRE, parseEndTag);
	          chars = false;
	        }

	        // start tag
	      } else if (html.indexOf('<') === 0) {
	        match = html.match(startTagRE);

	        if (match) {
	          html = html.substring(match[0].length);
	          match[0].replace(startTagRE, parseStartTag);
	          chars = false;
	        }
	      }

	      if (chars) {
	        index = html.indexOf('<');

	        var text = index < 0 ? html : html.substring(0, index);
	        html = index < 0 ? '' : html.substring(index);

	        if (handler.chars) {
	          handler.chars(text);
	        }
	      }
	    } else {
	      html = html.replace(new RegExp('([\\s\\S]*?)</' + stack.last() + '[^>]*>'), function (all, text) {
	        text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, '$1$2');
	        if (handler.chars) {
	          handler.chars(text);
	        }

	        return '';
	      });

	      parseEndTag('', stack.last());
	    }

	    if (html === last) {
	      throw Error('Parse Error: ' + html);
	    }
	    last = html;
	  }

	  // Clean up any remaining tags
	  parseEndTag();

	  function parseStartTag(tag, tagName, rest, unary) {
	    tagName = tagName.toLowerCase();

	    if (blockTag[tagName]) {
	      while (stack.last() && inlineTag[stack.last()]) {
	        parseEndTag('', stack.last());
	      }
	    }

	    if (closeSelfTag[tagName] && stack.last() === tagName) {
	      parseEndTag('', tagName);
	    }

	    unary = unaryTag[tagName] || !!unary;

	    if (!unary) {
	      stack.push(tagName);
	    }

	    if (handler.start) {
	      var attrs = [];

	      rest.replace(attrRE, function (match, name) {
	        var value = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[name] ? name : '';

	        attrs.push({
	          name: name,
	          value: value,
	          escaped: value.replace(/(^|[^\\])"/g, '$1\\"') // "
	        });
	      });

	      if (handler.start) {
	        handler.start(tagName, attrs, unary);
	      }
	    }
	  }

	  function parseEndTag(tag, tagName) {
	    var pos = void 0;
	    // If no tag name is provided, clean shop
	    if (!tagName) {
	      pos = 0;
	    } else {
	      // Find the closest opened tag of the same type
	      for (pos = stack.length - 1; pos >= 0; pos--) {
	        if (stack[pos] === tagName) {
	          break;
	        }
	      }
	    }

	    if (pos >= 0) {
	      // Close all the open elements, up the stack
	      for (var i = stack.length - 1; i >= pos; i--) {
	        if (handler.end) {
	          handler.end(stack[i]);
	        }
	      }

	      // Remove the open elements from the stack
	      stack.length = pos;
	    }
	  }
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _elements = __webpack_require__(11);

	Object.keys(_elements).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _elements[key];
	    }
	  });
	});
	exports.renderCollection = renderCollection;

	var _index = __webpack_require__(3);

	function renderCollection(items, itemRenderer) {
	  var results = [];
	  (0, _index.each)(items, function (v, k) {
	    results.push(itemRenderer(v, k));
	  });
	  return results;
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.namespaceMap = undefined;
	exports.isSvgElement = isSvgElement;
	exports.getSvgAttributeNamespace = getSvgAttributeNamespace;
	exports.isSpecialTag = isSpecialTag;
	exports.isUnaryTag = isUnaryTag;

	var _index = __webpack_require__(3);

	var namespaceMap = exports.namespaceMap = {
	  svg: 'http://www.w3.org/2000/svg',
	  math: 'http://www.w3.org/1998/Math/MathML'
	};

	var svgMap = (0, _index.makeMap)('animate,circle,defs,ellipse,g,line,linearGradient,mask,path,pattern,polygon,polyline,' + 'radialGradient,rect,stop,svg,text,tspan');

	var svgAttributeNamespaces = {
	  ev: 'http://www.w3.org/2001/xml-events',
	  xlink: 'http://www.w3.org/1999/xlink',
	  xml: 'http://www.w3.org/XML/1998/namespace',
	  xmlns: 'http://www.w3.org/2000/xmlns/'
	};

	function isSvgElement(name) {
	  return (0, _index.has)(svgMap, name);
	}

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
	// Special Elements (can contain anything)
	var specialTag = (0, _index.makeMap)('script,style');
	function isSpecialTag(tag) {
	  return specialTag[tag];
	}

	// Elements without close Tag
	var unaryTag = (0, _index.makeMap)('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');
	function isUnaryTag(tag) {
	  return unaryTag[tag];
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = parseText;

	var _ast_type = __webpack_require__(13);

	var startSymbol = '{';
	var endSymbol = '}';
	var startSymbolLength = startSymbol.length;
	var endSymbolLength = endSymbol.length;

	var escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), 'g');
	var escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), 'g');

	function escape(ch) {
	  return '\\\\\\' + ch;
	}

	function unescapeText(text) {
	  return text.replace(escapedStartRegexp, startSymbol).replace(escapedEndRegexp, endSymbol);
	}

	/* Parse the text into tokens, e.g. 'This is {token}' will be parsed to:
	 [
	 {text: 'This is ', type: 0}, 0 - text literal
	 {text: 'token', type: 1}, 1 - expression
	 ]
	 * */
	function parseText(text) {
	  if (!text.length || text.indexOf(startSymbol) === -1) {
	    return [{
	      token: unescapeText(text),
	      type: _ast_type.AstTokenType.Literal
	    }];
	  }

	  var textLen = text.length;
	  var tokens = [];
	  var index = 0;

	  while (index < textLen) {
	    var startIndex = void 0,
	        endIndex = void 0;
	    var str = void 0,
	        exp = void 0;
	    if ((startIndex = text.indexOf(startSymbol, index)) !== -1 && (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) !== -1) {
	      if (index !== startIndex) {
	        str = unescapeText(text.substring(index, startIndex));
	        tokens.push({
	          token: str,
	          type: _ast_type.AstTokenType.Literal
	        });
	      }
	      var iRight = indexOfRightMostEndSymbol(text, endIndex);
	      if (iRight !== -1) {
	        endIndex = iRight;
	      }
	      exp = text.substring(startIndex + startSymbolLength, endIndex);
	      tokens.push({
	        token: exp,
	        type: _ast_type.AstTokenType.Expr
	      });
	      index = endIndex + endSymbolLength;
	    } else {
	      // did not find an interpolation, so we have to add the remainder to the separators array
	      if (index !== text.length) {
	        str = unescapeText(text.substring(index));
	        tokens.push({
	          token: str,
	          type: _ast_type.AstTokenType.Literal
	        });
	      }
	      break;
	    }
	  }
	  return tokens;
	}

	// find the index of the right most endSymbol in order to parse the object literal {{foo:1}} without escaping
	function indexOfRightMostEndSymbol(text, startIndex) {
	  var endSymbolIndex = -1;
	  var i = startIndex;
	  while (i < text.length) {
	    if (text[i] === startSymbol) {
	      break;
	    }

	    if (text[i] === endSymbol) {
	      endSymbolIndex = i;
	      i += endSymbolLength;
	    } else {
	      i++;
	    }
	  }
	  return endSymbolIndex;
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var AstElementType = exports.AstElementType = {
	  Element: 1,
	  Text: 2
	};

	var AstTokenType = exports.AstTokenType = {
	  Literal: 0,
	  Expr: 1
	};

	var AstDirective = exports.AstDirective = {
	  If: 'if',
	  Each: 'each'
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.generate = generate;

	var _ast_type = __webpack_require__(13);

	var _index = __webpack_require__(3);

	var _events = __webpack_require__(15);

	var _events2 = _interopRequireDefault(_events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var eventNameMap = {};
	(0, _index.each)(_events2.default, function (eventName, standardName) {
	  eventNameMap['on' + (0, _index.capitalize)(eventName)] = standardName;
	});

	var funcRE = /([^()]+)(\(.*\))?/;

	/**
	 * Generate the code to create the virtual DOM given the AST
	 * The generated code should be like below:
	 * let node = h('div', { id: 'foo' }, [
	 *   h('a', { href: 'http://google.com' },
	 *     h('span', {}, 'Google'),
	 *     h('b', {}, 'Link')
	 *   )
	 * ])
	 * @param ast, the parsed AST
	 */
	function generate(ast) {
	  return genElement(ast);
	}

	function genElement(element) {
	  // For element
	  if (element.type === _ast_type.AstElementType.Element) {
	    var createElemCode = '_h("' + element.tagName + '",' + genAttributes(element) + ',' + genChildren(element) + ')';

	    // Has Each directive: each="(v, k) in obj"
	    if (element.each) {
	      createElemCode = '_c(' + element.each.object + ',function(' + element.each.variables + '){return ' + createElemCode + '})';
	    }

	    // Has If directive, if="a > 0"
	    if (element.if) {
	      createElemCode = element.if.condition + '?' + createElemCode + ':null';
	    }
	    return createElemCode;
	  }

	  // For text
	  return genText(element.tokens);
	}

	function genAttributes(element) {
	  // Handles the event handlers like on-click
	  var results = [];
	  (0, _index.each)(element.attributes, function (attr, attrName) {
	    if (eventNameMap[attrName] && attr.tokens.length === 1) {
	      var standardEventName = eventNameMap[attrName];
	      var handlerCode = genEventHandler(attr.tokens[0].token);
	      if (handlerCode) {
	        results.push('"' + standardEventName + '":' + handlerCode);
	      } else {
	        (0, _index.warn)('Invalid value found for ' + attr.rawName);
	      }
	    } else {
	      var attrExpr = genText(attr.tokens);
	      results.push('"' + attrName + '":' + attrExpr);
	    }
	  });
	  return '{' + results.join(',') + '}';
	}

	function genChildren(element) {
	  if (!element.children) {
	    return '[]';
	  }

	  var children = element.children;
	  var childrenCodeArray = children.map(function (child) {
	    return genElement(child);
	  });
	  return '[' + childrenCodeArray.join(',') + ']';
	}

	// Convent the tokens array into expression,e.g [{text: '11', type: Literal}, {text: 'name', type: Expr}]
	// will be converted to '11' + name
	function genText(tokens) {
	  return (tokens || []).map(function (item) {
	    return item.type === _ast_type.AstTokenType.Literal ? JSON.stringify(item.token) : item.token;
	  }).join('+');
	}

	// convert event attribute
	//
	// on-click="handleClick"
	// on-click="handleClick(1)"
	//
	// to something like below:
	// var handleClick_rand = function(event){handleClick(1);}
	function genEventHandler(handlerCode) {
	  funcRE.lastIndex = 0;
	  var matches = funcRE.exec(handlerCode);
	  if (!matches) {
	    return null;
	  }

	  var hasParam = matches.length >= 3 && matches[2];
	  var callCode = hasParam ? handlerCode : handlerCode + '($event)';

	  return '(function($event){' + callCode + '}).bind(this)';
	}

/***/ },
/* 15 */
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
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.renderThunk = renderThunk;
	exports.groupByKey = groupByKey;

	var _index = __webpack_require__(3);

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
	  function VNode(settings) {
	    _classCallCheck(this, VNode);

	    /** settings include the following fields
	     type
	     tagName
	     attributes,
	     children
	     */
	    (0, _index.extend)(this, {
	      children: []
	    }, settings);

	    this._lifecycleEventListeners = [];
	    this.addLifecycleEventListener(this.component);

	    var attributes = settings.attributes || {};
	    if ((0, _index.isString)(attributes.key) || (0, _index.isNumber)(attributes.key)) {
	      this.key = attributes.key;
	    }
	    delete attributes.key;

	    this.attributes = attributes;
	    this.props = attributes;
	  }

	  _createClass(VNode, [{
	    key: 'isSameType',
	    value: function isSameType(vnode) {
	      if (this.type !== vnode.type) {
	        return false;
	      }
	      if (!this.isThunk()) {
	        return true;
	      }
	      // check whether it's the same thunk or not
	      // Stateless function component
	      if ((0, _index.isFunction)(this.component)) {
	        return this.renderFn === vnode.renderFn;
	      }
	      // Object style component
	      if (!(0, _index.isUndefined)(vnode.component.selector)) {
	        return this.component.selector === vnode.component.selector;
	      }
	      return this.component === vnode.component;
	    }
	  }, {
	    key: 'isElement',
	    value: function isElement() {
	      return this.type === VNode.Element;
	    }
	  }, {
	    key: 'isText',
	    value: function isText() {
	      return this.type === VNode.Text;
	    }
	  }, {
	    key: 'isThunk',
	    value: function isThunk() {
	      return this.type === VNode.Thunk;
	    }
	  }, {
	    key: 'addLifecycleEventListener',
	    value: function addLifecycleEventListener(listener) {
	      if (!listener) {
	        return;
	      }
	      var listeners = this._lifecycleEventListeners;
	      if (listeners.indexOf(listener) === -1) {
	        listeners.push(listener);
	      }
	    }
	  }, {
	    key: '_notifyListeners',
	    value: function _notifyListeners(callbackName) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (0, _index.each)(this._lifecycleEventListeners, function (listener) {
	        var callback = listener[callbackName];
	        if (callback) {
	          callback.apply(listener, args);
	        }
	      });
	    }
	  }, {
	    key: 'beforeMount',
	    value: function beforeMount() {
	      this._notifyListeners('beforeMount', this);
	    }
	  }, {
	    key: 'mounted',
	    value: function mounted(domElem) {
	      this.elem = domElem;
	      this._notifyListeners('mounted', this);
	    }
	  }, {
	    key: 'unmounted',
	    value: function unmounted() {
	      this._notifyListeners('unmounted', this);
	    }
	  }, {
	    key: 'updated',
	    value: function updated(domElem, oldVnode) {
	      this.elem = domElem;
	      this._notifyListeners('updated', this, oldVnode);
	    }
	  }]);

	  return VNode;
	}();

	exports.default = VNode;


	VNode.Text = 'text';
	VNode.Element = 'element';
	VNode.Empty = 'empty';
	VNode.Thunk = 'thunk';

	function renderThunk(vnode, context) {
	  var data = {
	    props: vnode.attributes,
	    children: vnode.children
	  };
	  var renderedVnode = void 0;
	  if ((0, _index.isFunction)(vnode.component)) {
	    // the stateless function will get props through function params
	    // and it should not have access to the context
	    renderedVnode = vnode.renderFn(data);
	  } else {
	    // the component will get props through this.props
	    (0, _index.extend)(vnode.component, data);
	    renderedVnode = vnode.renderFn.call(vnode.component, context);
	  }
	  return renderedVnode;
	}

	/**
	 * Group an array of virtual elements by their key, using index as a fallback.
	 */
	function groupByKey(children) {
	  return children.map(function (child, i) {
	    var key = (0, _index.isNull)(child) ? i : child.key || i;
	    return {
	      key: String(key),
	      vnode: child,
	      index: i
	    };
	  });
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setAttribute = setAttribute;
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

	var _index = __webpack_require__(3);

	var _elements = __webpack_require__(11);

	function setAttribute(node, key, val) {
	  var ns = (0, _elements.getSvgAttributeNamespace)(key);
	  return ns ? node.setAttributeNS(ns, key, val) : node.setAttribute(key, val);
	}

	function createElement(tagName) {
	  if ((0, _elements.isSvgElement)(tagName)) {
	    return document.createElementNS(_elements.namespaceMap.svg, tagName);
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeAttribute = removeAttribute;
	exports.setAttribute = setAttribute;

	var _index = __webpack_require__(3);

	var _events = __webpack_require__(15);

	var _events2 = _interopRequireDefault(_events);

	var _nodeOp = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function removeAttribute(node, name, oldValue) {
	  var eventType = _events2.default[name];
	  if (eventType && (0, _index.isFunction)(oldValue)) {
	    (0, _nodeOp.removeEventListener)(node, eventType, oldValue);
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
	      (0, _nodeOp.removeEventListener)(node, eventType, oldValue);
	    }
	    (0, _nodeOp.addEventListener)(node, eventType, value);
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
	      (0, _nodeOp.setAttribute)(node, name, value);
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = patchNode;
	exports.patchChildren = patchChildren;

	var _set_attribute = __webpack_require__(19);

	var _create_dom = __webpack_require__(32);

	var _create_dom2 = _interopRequireDefault(_create_dom);

	var _vnode = __webpack_require__(17);

	var _diff = __webpack_require__(21);

	var diffActions = _interopRequireWildcard(_diff);

	var _index = __webpack_require__(3);

	var _nodeOp = __webpack_require__(18);

	var nodeOp = _interopRequireWildcard(_nodeOp);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Compare two virtual nodes and update the dom element
	 */

	function patchNode(domElem, oldVnode, newVnode, context) {
	  context = context || {};
	  newVnode.parentComponent = context.component;
	  // Skip updating this whole sub-tree
	  if (oldVnode === newVnode) {
	    return domElem;
	  }

	  // Remove the DOM
	  if (!(0, _index.isUndefined)(oldVnode) && (0, _index.isUndefined)(newVnode)) {
	    // Unmount the components
	    unmountThunk(oldVnode);
	    nodeOp.removeChild(domElem.parentNode, domElem);
	    return domElem;
	  }

	  // Replace the DOM
	  if (!(0, _index.isNull)(oldVnode) && (0, _index.isNull)(newVnode) || (0, _index.isNull)(oldVnode) && !(0, _index.isNull)(newVnode) || !oldVnode.isSameType(newVnode)) {
	    return replaceNode(domElem, oldVnode, newVnode, context);
	  }

	  // Two nodes with the same type reaching this point

	  // Element
	  var newDomElem = domElem;
	  if (newVnode.isElement()) {
	    if (oldVnode.tagName !== newVnode.tagName) {
	      // Replace the whole DOM element
	      newDomElem = replaceNode(domElem, oldVnode, newVnode, context);
	    } else {
	      // Same tagName, update the attributes
	      updateAttributes(domElem, oldVnode, newVnode);
	      newVnode.updated(domElem, oldVnode);
	      patchChildren(domElem, oldVnode, newVnode, context);
	    }
	  } else if (newVnode.isText()) {
	    // Text
	    if (oldVnode.nodeValue !== newVnode.nodeValue) {
	      (0, _set_attribute.setAttribute)(domElem, 'nodeValue', newVnode.nodeValue, oldVnode.nodeValue);
	    }
	  } else if (newVnode.isThunk()) {
	    newDomElem = updateThunk(domElem, oldVnode, newVnode, context);
	  }
	  return newDomElem;
	}

	function patchChildren(parentElem, oldNode, newNode, context) {
	  var CREATE = diffActions.CREATE,
	      UPDATE = diffActions.UPDATE,
	      MOVE = diffActions.MOVE,
	      REMOVE = diffActions.REMOVE;

	  var oldChildren = (0, _vnode.groupByKey)(oldNode.children);
	  var newChildren = (0, _vnode.groupByKey)(newNode.children);
	  var key = function key(a) {
	    return a.key;
	  };

	  // Make a copy of the references to children to be deleted
	  var domChildNodes = Array.prototype.slice.call(nodeOp.childNodes(parentElem));

	  function effect(type, prev, next, pos) {
	    switch (type) {
	      case CREATE:
	        {
	          var newDomElem = (0, _create_dom2.default)(next.vnode, context);
	          nodeOp.insertBefore(parentElem, newDomElem, nodeOp.childNode(parentElem, pos));
	          break;
	        }
	      case UPDATE:
	        {
	          var domElem = nodeOp.childNode(parentElem, prev.index);
	          patchNode(domElem, prev.vnode, next.vnode, context);
	          break;
	        }
	      case MOVE:
	        {
	          var childDomElem = nodeOp.childNode(parentElem, prev.index);
	          patchNode(childDomElem, prev.vnode, next.vnode, context);
	          nodeOp.insertBefore(parentElem, childDomElem, nodeOp.childNode(parentElem, pos));
	          break;
	        }
	      case REMOVE:
	        {
	          unmountThunk(prev.vnode);
	          nodeOp.removeChild(parentElem, domChildNodes[prev.index]);
	          break;
	        }
	    }
	  }

	  (0, diffActions.default)(oldChildren, newChildren, effect, key);
	}

	function updateThunk(domElem, oldNode, newNode, context) {
	  var oldThunkVnode = oldNode.thunkVnode;
	  var newThunkVnode = (0, _vnode.renderThunk)(newNode, context);
	  newNode.thunkVnode = newThunkVnode;

	  var currentComponent = context.component;
	  context.component = newNode.component;
	  var newDomElem = patchNode(domElem, oldThunkVnode, newThunkVnode, context);
	  context.component = currentComponent;

	  newNode.updated(newDomElem, oldNode);

	  return newDomElem;
	}

	function unmountThunk(vnode) {
	  // Call the lifecycle hook
	  vnode.unmounted();

	  if (vnode.isThunk()) {
	    unmountThunk(vnode.thunkVnode);
	  } else if (vnode.children) {
	    (0, _index.each)(vnode.children, function (child) {
	      return unmountThunk(child);
	    });
	  }
	}
	/**
	 * compare the attributes of the two virtual nodes and update the dom attributes and event handlers
	 * @param domElem
	 * @param oldNode
	 * @param newNode
	 */
	function updateAttributes(domElem, oldNode, newNode) {
	  var oldAttributes = oldNode.attributes;
	  var newAttributes = newNode.attributes;

	  for (var name in newAttributes) {
	    if (newAttributes[name] !== oldAttributes[name]) {
	      (0, _set_attribute.setAttribute)(domElem, name, newAttributes[name], oldAttributes[name]);
	    }
	  }

	  for (var _name in oldAttributes) {
	    if (!(0, _index.has)(newAttributes, _name)) {
	      (0, _set_attribute.removeAttribute)(domElem, _name, oldAttributes[_name]);
	    }
	  }
	}

	function replaceNode(domElem, oldNode, newNode, context) {
	  unmountThunk(oldNode);
	  var newDomElem = (0, _create_dom2.default)(newNode, context);
	  nodeOp.replaceNode(newDomElem, domElem);
	  return newDomElem;
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.REMOVE = exports.MOVE = exports.UPDATE = exports.CREATE = undefined;

	var _index = __webpack_require__(3);

	var _bitset = __webpack_require__(6);

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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = create;

	var _index = __webpack_require__(3);

	var _vnode = __webpack_require__(17);

	var _vnode2 = _interopRequireDefault(_vnode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function create(tag, attributes) {
	  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }

	  children = children.reduce(reduceChildren, []);
	  // Stateless function component
	  if ((0, _index.isFunction)(tag)) {
	    return new _vnode2.default({
	      type: _vnode2.default.Thunk,
	      renderFn: tag,
	      attributes: attributes,
	      children: children,
	      component: tag
	    });
	  }
	  // Object style component
	  if ((0, _index.isObject)(tag)) {
	    return new _vnode2.default({
	      type: _vnode2.default.Thunk,
	      renderFn: tag.render,
	      attributes: attributes,
	      children: children,
	      component: tag
	    });
	  }
	  return new _vnode2.default({
	    type: _vnode2.default.Element,
	    tagName: tag,
	    attributes: attributes,
	    children: children
	  });
	}

	function reduceChildren(acc, vnode) {
	  if ((0, _index.isUndefined)(vnode)) {
	    vnode = 'undefined';
	    (0, _index.warn)('Node value is undefined');
	  }

	  var result;
	  if ((0, _index.isString)(vnode) || (0, _index.isNumber)(vnode)) {
	    result = new _vnode2.default({
	      type: _vnode2.default.Text,
	      nodeValue: vnode
	    });
	  } else if ((0, _index.isNull)(vnode)) {
	    result = new _vnode2.default({
	      type: _vnode2.default.Empty
	    });
	  } else if (Array.isArray(vnode)) {
	    result = vnode.reduce(reduceChildren, []);
	  } else {
	    // Thunk element or element
	    result = vnode;
	  }
	  return acc.concat(result);
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createApp;

	var _index = __webpack_require__(3);

	var _nodeOp = __webpack_require__(18);

	var _index2 = __webpack_require__(24);

	var _index3 = _interopRequireDefault(_index2);

	var _action = __webpack_require__(26);

	var _component = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createApp(options) {
	  var store = void 0,
	      component = void 0,
	      actions = void 0,
	      rootEl = void 0;

	  var dispatch = function dispatch(action) {
	    return store.dispatch(action);
	  };

	  // The root element the the component will be mounted to
	  rootEl = options.el && (0, _nodeOp.query)(options.el);
	  (0, _nodeOp.emptyElement)(rootEl);

	  // the root component which needs to access the model and actions, make it a container
	  options.isContainer = true;
	  component = (0, _component.createComponent)(options);

	  // Generate the action creators
	  actions = {};
	  if (!(0, _index.isFunction)(options.update)) {
	    actions = (0, _action.createActionCreators)((0, _index.getKeys)(options.update));
	    actions = (0, _action.bindActionCreators)(actions, dispatch);
	  }

	  var update = options.update || {};
	  if (!(0, _index.isFunction)(update)) {
	    update = enhanceHandler(update);
	  }
	  store = (0, _index3.default)(options.model, update);
	  store.subscribe(function () {
	    updateView();
	  });

	  function updateView() {
	    var domElem = component.patch(getAppContext());
	    (0, _nodeOp.appendChild)(rootEl, domElem);
	  }

	  /**
	   * Enhances the action handler to allow this.actions to be injected to the handler function as the last argument
	   */
	  function enhanceHandler(actionHandlerMap) {
	    var enhanced = {};
	    (0, _index.each)(actionHandlerMap, function (actionHandler, actionType) {
	      var newHandler = function newHandler() {
	        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
	          params[_key] = arguments[_key];
	        }

	        // inject 1 more param to the handler, and execute the original handler in the application context
	        return actionHandler.apply(undefined, [getAppContext()].concat(params));
	      };
	      enhanced[actionType] = newHandler;
	    });
	    return enhanced;
	  }

	  function getAppContext() {
	    return (0, _index.extend)({
	      model: store.getModel(),
	      dispatch: dispatch,
	      component: component
	    }, actions);
	  }

	  updateView();

	  return (0, _index.extend)({
	    el: rootEl,
	    component: component,
	    update: updateView,
	    getModel: function getModel() {
	      return store.getModel();
	    }
	  }, actions);
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _store = __webpack_require__(25);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _store2.default;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Store = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = createStore;

	var _index = __webpack_require__(3);

	var _action = __webpack_require__(26);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Store = exports.Store = function () {
	  function Store(initialModel, updater) {
	    _classCallCheck(this, Store);

	    this.model = initialModel;
	    this.modelUpdater = updater;

	    this.listeners = [];
	  }

	  _createClass(Store, [{
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

	  return Store;
	}();

	function createStore(model, update) {
	  var modelUpdater = update || _index.noop;
	  if (!(0, _index.isFunction)(modelUpdater)) {
	    modelUpdater = (0, _action.createModelUpdater)(update);
	  }
	  return new Store(model, modelUpdater);
	}

/***/ },
/* 26 */
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

	var _index = __webpack_require__(3);

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
	 * @returns {update}, the update function used by the MeltStore
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
/* 27 */,
/* 28 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var RefDirective = function () {
	  function RefDirective() {
	    _classCallCheck(this, RefDirective);
	  }

	  _createClass(RefDirective, [{
	    key: "updateRef",
	    value: function updateRef(refName, vnode) {
	      var refs = vnode.parentComponent.refs;
	      if (!refs) {
	        refs = vnode.parentComponent.refs = {};
	      }

	      // remove the old ref
	      if (this._refName) {
	        delete refs[this._refName];
	      }

	      if (refName) {
	        refs[refName] = vnode.component || vnode.elem;
	        this._refName = refName;
	      }
	    }
	  }, {
	    key: "attached",
	    value: function attached(binding, vnode) {
	      this.updateRef(binding.value, vnode);
	    }
	  }, {
	    key: "updated",
	    value: function updated(binding, newVnode) {
	      this.updateRef(binding.value, newVnode);
	    }
	  }, {
	    key: "detached",
	    value: function detached(vnode) {
	      this.updateRef(null, vnode);
	    }
	  }]);

	  return RefDirective;
	}();

	exports.default = RefDirective;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DirectiveHandler = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.createDirective = createDirective;

	var _ref = __webpack_require__(28);

	var _ref2 = _interopRequireDefault(_ref);

	var _style = __webpack_require__(30);

	var _style2 = _interopRequireDefault(_style);

	var _css_class = __webpack_require__(34);

	var _css_class2 = _interopRequireDefault(_css_class);

	var _index = __webpack_require__(3);

	var _component_registry = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var specialAttrNames = ['class', 'style'];
	var directives = {
	  ref: _ref2.default,
	  style: _style2.default,
	  class: _css_class2.default
	};

	(0, _index.each)(directives, function (dirClass, dirName) {
	  return (0, _component_registry.registerDirective)(dirName, {
	    class: dirClass,
	    isBuildIn: true
	  });
	});

	function createDirective(options, binding) {
	  var DirectiveClass = void 0;
	  if ((0, _index.isFunction)(options)) {
	    DirectiveClass = options;
	  } else {
	    DirectiveClass = options.class || _index.noop;
	  }

	  function Directive(options) {
	    var _this = this;

	    this._options = options;

	    var propsSpec = options.props || {};
	    // Convert props spec to map if is array: ['foo', 'bar']
	    this._propsSpec = {};
	    if ((0, _index.isArray)(propsSpec)) {
	      (0, _index.each)(propsSpec, function (name) {
	        _this._propsSpec[name] = true;
	      });
	    } else {
	      this._propsSpec = propsSpec;
	    }

	    DirectiveClass.call(this, binding);
	  }

	  Directive.prototype = Object.create(DirectiveClass.prototype, {
	    constructor: Directive
	  });

	  return new Directive(options, binding);
	}

	var LifecycleEvent = {
	  ATTACHED: 'attached',
	  UPDATED: 'updated',
	  DETACHED: 'detached'
	};

	var DirectiveHandler = exports.DirectiveHandler = function () {
	  function DirectiveHandler() {
	    _classCallCheck(this, DirectiveHandler);
	  }

	  _createClass(DirectiveHandler, [{
	    key: '_parseDirectives',
	    value: function _parseDirectives(attrs) {
	      var directives = {};
	      (0, _index.each)(attrs || [], function (attrValue, attrName) {
	        if (specialAttrNames.indexOf(attrName) >= 0) {
	          // Normal attribute binding, not a directive
	          return;
	        }
	        var parts = attrName.split('.');
	        var dirName = parts[0];
	        parts.shift();
	        if ((0, _component_registry.isRegistered)(dirName) || (0, _component_registry.isRegistered)((0, _index.camelize)(dirName))) {
	          directives[attrName] = {
	            name: dirName,
	            value: attrValue,
	            args: parts
	          };
	        }
	      });
	      return directives;
	    }
	  }, {
	    key: '_createDirective',
	    value: function _createDirective(binding) {
	      var dirOption = (0, _component_registry.getComponent)(binding.name);
	      var dir = createDirective(dirOption, binding);
	      dir.binding = binding;
	      return dir;
	    }
	  }, {
	    key: '_callback',
	    value: function _callback(dir, name) {
	      var callback = dir[name];
	      if (callback) {
	        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	          args[_key - 2] = arguments[_key];
	        }

	        callback.apply(dir, args);
	      }
	    }
	  }, {
	    key: 'beforeMount',
	    value: function beforeMount(vnode) {
	      var _this2 = this;

	      vnode.directives = {};
	      (0, _index.each)(this._parseDirectives(vnode.attributes), function (dirBinding, attrName) {
	        var dir = _this2._createDirective(dirBinding);
	        vnode.directives[attrName] = dir;
	        delete vnode.attributes[attrName];
	      });
	    }
	  }, {
	    key: 'mounted',
	    value: function mounted(vnode) {
	      var _this3 = this;

	      (0, _index.each)(vnode.directives || {}, function (dir) {
	        _this3._callback(dir, LifecycleEvent.ATTACHED, dir.binding, vnode);
	      });
	    }
	  }, {
	    key: 'updated',
	    value: function updated(newVnode, oldVnode) {
	      var _this4 = this;

	      var newDirBindings = this._parseDirectives(newVnode.attributes);
	      var oldDirs = oldVnode.directives;
	      var newDirs = {};
	      (0, _index.each)(newDirBindings, function (dirBinding, attrName) {
	        var dir = oldDirs[attrName];
	        if (dir) {
	          // existing directives, copy them over and call updated lifecycle hook
	          // update the binding
	          dir.binding = dirBinding;
	          newDirs[attrName] = dir;
	          _this4._callback(dir, LifecycleEvent.UPDATED, dirBinding, newVnode, oldVnode);
	        } else {
	          newDirs[attrName] = _this4._createDirective(dirBinding);
	          _this4._callback(dir, LifecycleEvent.ATTACHED, dirBinding, newVnode);
	        }
	      });
	      (0, _index.each)(oldDirs, function (dir, attrName) {
	        if (!newDirs[attrName]) {
	          // call detached
	          _this4._callback(dir, LifecycleEvent.DETACHED, oldVnode);
	        }
	      });
	      newVnode.directives = newDirs;
	    }
	  }, {
	    key: 'unmounted',
	    value: function unmounted(vnode) {
	      var _this5 = this;

	      (0, _index.each)(vnode.directives, function (dir) {
	        _this5._callback(dir, LifecycleEvent.DETACHED, vnode);
	      });
	    }
	  }]);

	  return DirectiveHandler;
	}();

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var StyleDirective = function () {
	  function StyleDirective() {
	    _classCallCheck(this, StyleDirective);
	  }

	  _createClass(StyleDirective, [{
	    key: 'updateStyle',
	    value: function updateStyle(binding, domElem) {
	      if (binding.args.length === 0) {
	        throw new Error('Invalid style binding');
	      }

	      this.clearStyle(domElem);

	      var style = {};
	      if (binding.args[0] === '*') {
	        style = binding.value;
	      } else {
	        var styleKey = binding.args[0];
	        style[styleKey] = binding.value;
	      }
	      (0, _index.each)(style, function (value, key) {
	        domElem.style[key] = value;
	      });

	      this.style = style;
	    }
	  }, {
	    key: 'clearStyle',
	    value: function clearStyle(domElem) {
	      if (!this.style) {
	        return;
	      }
	      (0, _index.each)(this.style, function (value, key) {
	        domElem.style.setProperty(key, '');
	      });
	    }
	  }, {
	    key: 'attached',
	    value: function attached(binding, vnode) {
	      this.updateStyle(binding, vnode.elem);
	    }
	  }, {
	    key: 'updated',
	    value: function updated(binding, newVnode) {
	      this.updateStyle(binding, newVnode.elem, this.style);
	    }
	  }, {
	    key: 'detached',
	    value: function detached(vnode) {
	      this.clearStyle(vnode.elem);
	    }
	  }]);

	  return StyleDirective;
	}();

	exports.default = StyleDirective;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.clearRegistry = clearRegistry;
	exports.registerComponent = registerComponent;
	exports.registerContainer = registerContainer;
	exports.registerDirective = registerDirective;
	exports.getComponent = getComponent;
	exports.isRegistered = isRegistered;

	var _index = __webpack_require__(3);

	// Component Management
	var componentRegistry = {};

	function clearRegistry() {
	  (0, _index.each)(componentRegistry, function (componentOptions, name) {
	    if (!componentOptions.isBuildIn) {
	      delete componentRegistry[name]; // only remove the non-build-in components
	    }
	  });
	}

	function registerComponent(name, options, isContainer) {
	  if (componentRegistry[name]) {
	    (0, _index.warn)('Component ' + name + ' is already registered');
	  }
	  options.isContainer = isContainer;
	  options.selector = name;
	  componentRegistry[name] = options;
	  return options;
	}

	function registerContainer(name, options) {
	  return registerComponent(name, options, true);
	}

	function registerDirective(name, options) {
	  if ((0, _index.isFunction)(options)) {
	    // shorthand syntax
	    options = {
	      class: options
	    };
	  }
	  var compOptions = registerComponent(name, options);
	  compOptions.isDirective = true;
	  return compOptions;
	}

	function getComponent(tag) {
	  return (0, _index.isString)(tag) && componentRegistry[tag];
	}

	function isRegistered(name) {
	  return !!getComponent(name);
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createElement;

	var _vnode = __webpack_require__(17);

	var _vnode2 = _interopRequireDefault(_vnode);

	var _index = __webpack_require__(3);

	var _nodeOp = __webpack_require__(18);

	var nodeOp = _interopRequireWildcard(_nodeOp);

	var _set_attribute = __webpack_require__(19);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createElement(vnode, context) {
	  context = context || {};
	  var domElem;
	  vnode.parentComponent = context.component;
	  vnode.beforeMount();
	  switch (vnode.type) {
	    case _vnode2.default.Element:
	      domElem = createHtmlElement(vnode, context);
	      break;
	    case _vnode2.default.Empty:
	      domElem = createEmptyNode();
	      break;
	    case _vnode2.default.Text:
	      domElem = createTextNode(vnode);
	      break;
	    case _vnode2.default.Thunk:
	      domElem = createThunk(vnode, context);
	      break;
	  }
	  vnode.mounted(domElem);
	  return domElem;
	}

	function createThunk(vnode, context) {
	  vnode.thunkVnode = (0, _vnode.renderThunk)(vnode, context);
	  var currentComponent = context.component;

	  context.component = vnode.component;
	  var domElem = createElement(vnode.thunkVnode, context);

	  // recover the component context
	  context.component = currentComponent;
	  return domElem;
	}

	function createHtmlElement(vnode, context) {
	  var tagName = vnode.tagName,
	      children = vnode.children,
	      attributes = vnode.attributes;


	  var elem = nodeOp.createElement(tagName);

	  for (var name in attributes) {
	    (0, _set_attribute.setAttribute)(elem, name, attributes[name]);
	  }

	  children.forEach(function (child) {
	    if ((0, _index.isNull)(child) || (0, _index.isUndefined)(child)) {
	      return;
	    }

	    nodeOp.appendChild(elem, createElement(child, context));
	  });
	  return elem;
	}

	function createTextNode(vnode) {
	  var text = (0, _index.isNumber)(vnode.nodeValue) || (0, _index.isString)(vnode.nodeValue) ? vnode.nodeValue : '';
	  return nodeOp.createTextNode(text);
	}

	function createEmptyNode() {
	  return nodeOp.createElement('noscript');
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _component_registry = __webpack_require__(31);

	Object.keys(_component_registry).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _component_registry[key];
	    }
	  });
	});

	var _component = __webpack_require__(1);

	Object.keys(_component).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _component[key];
	    }
	  });
	});

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(3);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// takes any number of arguments (string/number or object) and add them into the the array according to the following rules:
	// Object: keys will be added to the array if their value evaluates to a truthy value
	// strings are shorthand for {str: true}, thus will be added
	function classNames() {
	  var classes = [];

	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  (0, _index.each)(args, function (value) {
	    if ((0, _index.isString)(value) || (0, _index.isNumber)(value)) {
	      classes.push(value);
	    } else if ((0, _index.isArray)(value)) {
	      Array.prototype.push.apply(classes, classNames.apply(null, value));
	    } else if ((0, _index.isObject)(value)) {
	      (0, _index.each)(value, function (v, k) {
	        if (v) {
	          classes.push(k);
	        }
	      });
	    }
	  });
	  return classes;
	}

	function addClass(domElem) {
	  for (var _len2 = arguments.length, classesToAdd = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    classesToAdd[_key2 - 1] = arguments[_key2];
	  }

	  if (classesToAdd.length === 0) {
	    return;
	  }

	  if (domElem.classList) {
	    (0, _index.each)(classesToAdd, function (cls) {
	      return domElem.classList.add(cls);
	    });
	  } else {
	    (function () {
	      var currentClasses = domElem.className.split(/\s+/);
	      (0, _index.each)(classesToAdd, function (cls) {
	        cls = cls.trim();
	        if (currentClasses.indexOf(cls) === -1) {
	          currentClasses.push(cls);
	        }
	      });
	      domElem.className = currentClasses.join(' ');
	    })();
	  }
	}

	function removeClass(domElem) {
	  for (var _len3 = arguments.length, classesToRemove = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	    classesToRemove[_key3 - 1] = arguments[_key3];
	  }

	  if (!classesToRemove) {
	    return;
	  }
	  if (domElem.classList) {
	    (0, _index.each)(classesToRemove, function (cls) {
	      return domElem.classList.remove(cls);
	    });
	  } else {
	    var currentClasses = domElem.className.split(/\s+/);
	    domElem.className = currentClasses.filter(function (cls) {
	      return classesToRemove.indexOf(cls.trim()) === -1;
	    }).join(' ');
	  }
	}

	var ClassDirective = function () {
	  function ClassDirective() {
	    _classCallCheck(this, ClassDirective);
	  }

	  _createClass(ClassDirective, [{
	    key: 'updateClasses',
	    value: function updateClasses(binding, domElem) {
	      if (binding.args.length === 0) {
	        throw new Error('Invalid class binding');
	      }
	      var value = {};
	      if (binding.args[0] === '*') {
	        value = binding.value;
	        if ((0, _index.isString)(value)) {
	          value = value.split(/\s+/);
	        }
	      } else {
	        value[binding.args[0]] = binding.value;
	      }
	      removeClass.apply(undefined, [domElem].concat(_toConsumableArray(this._oldClasses || [])));
	      var classes = classNames(value);
	      addClass.apply(undefined, [domElem].concat(_toConsumableArray(classes)));

	      this._oldClasses = classes;
	    }
	  }, {
	    key: 'attached',
	    value: function attached(binding, vnode) {
	      this.updateClasses(binding, vnode.elem);
	    }
	  }, {
	    key: 'updated',
	    value: function updated(binding, newVnode) {
	      this.updateClasses(binding, newVnode.elem);
	    }
	  }, {
	    key: 'detached',
	    value: function detached(vnode) {
	      removeClass.apply(undefined, [vnode.elem].concat(_toConsumableArray(this._oldClasses || [])));
	    }
	  }]);

	  return ClassDirective;
	}();

	exports.default = ClassDirective;

/***/ }
/******/ ])
});
;