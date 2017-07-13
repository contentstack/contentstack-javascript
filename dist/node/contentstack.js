module.exports =
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports._type = _type;
exports.mergeDeep = mergeDeep;
exports.merge = merge;
exports.isBrowser = isBrowser;
exports.parseQueryFromParams = parseQueryFromParams;
exports.getHash = getHash;
exports.generateHash = generateHash;
exports.resultWrapper = resultWrapper;
exports.spreadResult = spreadResult;
exports.sendRequest = sendRequest;

var _when = __webpack_require__(11);

var _when2 = _interopRequireDefault(_when);

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

var _result = __webpack_require__(32);

var _result2 = _interopRequireDefault(_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _type(val) {
    var _typeof,
        __typeof = typeof val === 'undefined' ? 'undefined' : _typeof2(val);
    switch (__typeof) {
        case 'object':
            _typeof = __typeof;
            if (Array.isArray(val)) {
                __typeof = 'array';
            }
            break;
        default:
            _typeof = __typeof;
    }
    return __typeof;
};

// merge two objects
function mergeDeep(target, source) {
    var self = this;
    var _merge_recursive = function _merge_recursive(target, source) {
        for (var key in source) {
            if (self._type(source[key]) == 'object' && self._type(target[key]) == self._type(source[key])) {
                _merge_recursive(target[key], source[key]);
            } else if (self._type(source[key]) == 'array' && self._type(target[key]) == self._type(source[key])) {
                target[key] = target[key].concat(source[key]);
            } else {
                target[key] = source[key];
            }
        }
    };
    _merge_recursive(target, source);
    return target;
};

// merge two objects
function merge(target, source) {
    if (target && source) {
        for (var key in source) {
            target[key] = source[key];
        }
    }
    return target;
};

// return true if process is running in browser else false
function isBrowser() {
    return typeof window !== "undefined" && (typeof process === 'undefined' ? 'undefined' : _typeof2(process)) === "object" && process.title === "browser";
};

// return the query from the params
function parseQueryFromParams(queryObject, single, toJSON) {
    if (queryObject && queryObject.requestParams) {
        var _query = merge({}, queryObject.requestParams.body ? queryObject.requestParams.body.query || {} : {});
        if (_query.environment_uid) {
            delete _query.environment_uid;
            _query.environment = queryObject.environment;
        }
        _query.environment = queryObject.environment;
        return {
            content_type_uid: queryObject.content_type_uid,
            locale: _query.locale || 'en-us',
            query: _query,
            entry_uid: queryObject.entry_uid,
            single: single || "false",
            toJSON: toJSON || "false",
            api_key: queryObject.requestParams.headers ? queryObject.requestParams.headers.api_key : ""
        };
    }
};

// returrn the hash value of the query
function getHash(query) {
    try {
        var hashValue = generateHash(JSON.stringify(query)),
            keyArray = [];
        keyArray.push(query.content_type_uid);
        keyArray.push(query.locale);
        if (query.entry_uid) keyArray.push(query.entry_uid);
        keyArray.push(hashValue);
        return keyArray.join('.');
    } catch (e) {}
};

// return the hash value of the string
function generateHash(str) {
    var hash = 0,
        i,
        chr,
        len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash < -1 ? hash * -1 : hash;
};

// generate the Result object
function resultWrapper(result) {
    if (result && result.entries && typeof result.entries !== 'undefined') {
        if (result.entries && result.entries.length) {
            for (var i = 0, _i = result.entries.length; i < _i; i++) {
                result.entries[i] = (0, _result2.default)(result.entries[i]);
            }
        } else {
            result.entries = [];
        }
    } else if (result && typeof result.entry !== 'undefined') {
        result.entry = (0, _result2.default)(result.entry);
    }
    return result;
};

// spread the result object
function spreadResult(result) {
    var _results = [];
    if (result && Object.keys(result).length) {
        if (typeof result.entries !== 'undefined') _results.push(result.entries);
        if (typeof result.schema !== 'undefined') _results.push(result.schema);
        if (typeof result.count !== 'undefined') _results.push(result.count);
        if (typeof result.entry !== 'undefined') _results = result.entry;
    }
    return _results;
};

function sendRequest(queryObject) {
    var env_uid = queryObject.environment_uid;
    if (env_uid) {
        queryObject._query.environment_uid = env_uid;
    } else {
        queryObject._query.environment = queryObject.environment;
    }
    var deferred = _when2.default.defer();
    var self = queryObject;
    var continueFlag = false;
    var cachePolicy = typeof self.queryCachePolicy !== 'undefined' ? self.queryCachePolicy : self.cachePolicy;
    var tojson = typeof self.tojson !== 'undefined' ? self.tojson : false;
    var isSingle = self.entry_uid || self.singleEntry ? true : false;
    var hashQuery = getHash(parseQueryFromParams(self, isSingle, tojson));
    //var spreadResult;
    /**
        for new api v3
    */
    if (queryObject && queryObject.requestParams && queryObject.requestParams.body && queryObject.requestParams.body.query) {
        var cloneQueryObj = JSON.parse(JSON.stringify(queryObject.requestParams.body.query));
        if ((typeof cloneQueryObj === 'undefined' ? 'undefined' : _typeof2(cloneQueryObj)) !== 'object') {
            cloneQueryObj = JSON.parse(cloneQueryObj);
        }
        delete queryObject.requestParams.body.query;
        queryObject.requestParams.body = merge(queryObject.requestParams.body, cloneQueryObj);
    }

    var getCacheCallback = function getCacheCallback() {
        return function (err, entries) {
            try {
                if (err) throw err;
                if (!tojson) entries = resultWrapper(entries);
                return deferred.resolve(spreadResult(entries));
            } catch (e) {
                return deferred.reject(e);
            }
        };
    };

    var callback = function callback(continueFlag) {
        if (continueFlag) {
            (0, _request2.default)(queryObject.requestParams).then(function (data) {
                try {
                    self.entry_uid = self.tojson = self.queryCachePolicy = undefined;
                    var entries = {};
                    if (queryObject.singleEntry) {
                        queryObject.singleEntry = false;
                        if (data.schema) entries.schema = data.schema;
                        if (data.entries && data.entries.length) {
                            entries.entry = data.entries[0];
                        } else {
                            if (cachePolicy === 2) {
                                self.provider.get(hashQuery, getCacheCallback());
                            } else {
                                return deferred.reject({ error_code: 141, error_message: 'The requested entry doesn\'t exist.' });
                            }
                            return;
                        }
                    } else {
                        entries = data;
                    }
                    if (cachePolicy !== -1) {
                        self.provider.set(hashQuery, entries, function (err) {
                            try {
                                if (err) throw err;
                                if (!tojson) entries = resultWrapper(entries);
                                return deferred.resolve(spreadResult(entries));
                            } catch (e) {
                                return deferred.reject(e);
                            }
                        });
                    } else {
                        if (!tojson) entries = resultWrapper(entries);
                        return deferred.resolve(spreadResult(entries));
                    }
                } catch (e) {
                    return deferred.reject({
                        message: e.message
                    });
                }
            }.bind(self)).catch(function (error) {
                if (cachePolicy === 2) {
                    self.provider.get(hashQuery, getCacheCallback());
                } else {
                    return deferred.reject(error);
                }
            });
        }
    };

    switch (cachePolicy) {
        case 1:
            self.provider.get(hashQuery, function (err, _data) {
                try {
                    if (err || !_data) {
                        callback(true);
                    } else {
                        if (!tojson) _data = resultWrapper(_data);
                        return deferred.resolve(spreadResult(_data));
                    }
                } catch (e) {
                    return deferred.reject(e);
                }
            });
            break;
        case 2:
        case 0:
        case undefined:
        case -1:
            callback(true);
    };
    if (cachePolicy !== 3) {
        return deferred.promise;
    } else {
        return {
            cache: function () {
                var Defer = _when2.default.defer();
                self.provider.get(hashQuery, function (err, _data) {
                    try {
                        if (err) {
                            return Defer.reject(err);
                        } else {
                            if (!tojson) _data = resultWrapper(_data);
                            return Defer.resolve(spreadResult(_data));
                        }
                    } catch (e) {
                        return Defer.reject(e);
                    }
                });
                return Defer.promise;
            }(),
            network: function () {
                callback(true);
                return deferred.promise;
            }(),
            both: function both(_callback_) {
                self.provider.get(hashQuery, function (err, entries) {
                    if (!tojson) entries = resultWrapper(entries);
                    _callback_(err, spreadResult(entries));
                });
                (0, _request2.default)(queryObject.requestParams).then(function (data) {
                    try {
                        self.entry_uid = self.tojson = self.queryCachePolicy = undefined;
                        var entries = {},
                            error = null;
                        if (queryObject.singleEntry) {
                            queryObject.singleEntry = false;
                            if (data.schema) entries.schema = data.schema;
                            if (data.entries && data.entries.length) {
                                entries.entry = data.entries[0];
                            } else {
                                error = { error_code: 141, error_message: 'The requested entry doesn\'t exist.' };
                            }
                        } else {
                            entries = data;
                        }
                        if (!tojson) entries = resultWrapper(entries);
                        _callback_(error, spreadResult(entries));
                    } catch (e) {
                        _callback_(e);
                    }
                }.bind(self)).catch(function (error) {
                    _callback_(error);
                });
            }

        };
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;var require;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global process,document,setTimeout,clearTimeout,MutationObserver,WebKitMutationObserver*/
(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
		/*jshint maxcomplexity:6*/

		// Sniff "best" async scheduling option
		// Prefer process.nextTick or MutationObserver, then check for
		// setTimeout, and finally vertx, since its the only env that doesn't
		// have setTimeout

		var MutationObs;
		var capturedSetTimeout = typeof setTimeout !== 'undefined' && setTimeout;

		// Default env
		var setTimer = function setTimer(f, ms) {
			return setTimeout(f, ms);
		};
		var clearTimer = function clearTimer(t) {
			return clearTimeout(t);
		};
		var asap = function asap(f) {
			return capturedSetTimeout(f, 0);
		};

		// Detect specific env
		if (isNode()) {
			// Node
			asap = function asap(f) {
				return process.nextTick(f);
			};
		} else if (MutationObs = hasMutationObserver()) {
			// Modern browser
			asap = initMutationObserver(MutationObs);
		} else if (!capturedSetTimeout) {
			// vert.x
			var vertxRequire = require;
			var vertx = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"vertx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
			setTimer = function setTimer(f, ms) {
				return vertx.setTimer(ms, f);
			};
			clearTimer = vertx.cancelTimer;
			asap = vertx.runOnLoop || vertx.runOnContext;
		}

		return {
			setTimer: setTimer,
			clearTimer: clearTimer,
			asap: asap
		};

		function isNode() {
			return typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]';
		}

		function hasMutationObserver() {
			return typeof MutationObserver !== 'undefined' && MutationObserver || typeof WebKitMutationObserver !== 'undefined' && WebKitMutationObserver;
		}

		function initMutationObserver(MutationObserver) {
			var scheduled;
			var node = document.createTextNode('');
			var o = new MutationObserver(run);
			o.observe(node, { characterData: true });

			function run() {
				var f = scheduled;
				scheduled = void 0;
				f();
			}

			var i = 0;
			return function (f) {
				scheduled = f;
				node.data = i ^= 1;
			};
		}
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = Request;

var _utils = __webpack_require__(1);

var Utils = _interopRequireWildcard(_utils);

var _http = __webpack_require__(33);

var _http2 = _interopRequireDefault(_http);

var _when = __webpack_require__(11);

var _when2 = _interopRequireDefault(_when);

var _package = __webpack_require__(35);

var Package = _interopRequireWildcard(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function Request(options) {
    var serialize = function serialize(obj, prefix) {
        var str = [],
            p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
                str.push(v !== null && (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" && p !== 'query' ? serialize(v, k) : k + "=" + (p !== 'query' ? encodeURIComponent(v) : JSON.stringify(v)));
            }
        }
        return str.join("&");
    };

    var deferred = _when2.default.defer();
    var xhr = new _http2.default(),
        method = "GET",
        url = options.url,
        headers = options.headers;

    if (options.body && _typeof(options.body) === 'object') {
        delete options.body._method;
        var queryParams = serialize(options.body);
    }

    //make all calls as GET instead of POST
    xhr.open(method, url + '?' + queryParams, true);
    // set headers
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('X-User-Agent', 'contentstack-(JS-SDK)/' + Package.version);
    for (var header in headers) {
        xhr.setRequestHeader(header, headers[header]);
    }

    // send stringify data
    if (options.body && method == "POST" || method == "PUT") {
        if (_typeof(options.body) === 'object') {
            xhr.send(JSON.stringify(options.body));
        } else {
            xhr.send(options.body);
        }
    } else {
        xhr.send();
    }

    // collect response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var data = xhr.responseText,
                error;
            try {
                data = JSON.parse(data);
            } catch (e) {
                error = { error_code: 141, message: 'Could not parse the response received from the server.' };
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                deferred.resolve(data);
            } else {
                deferred.reject(data || error);
            }
        }
    };
    return deferred.promise;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _localstorage = __webpack_require__(29);

var _localstorage2 = _interopRequireDefault(_localstorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CacheProvider = {};

CacheProvider.providers = function (provider) {
    if (provider) {
        return _localstorage2.default;
    } else {
        console.error("Kindly provide valid provider.");
    }
};

CacheProvider.policies = {
    IGNORE_CACHE: -1,
    ONLY_NETWORK: 0,
    CACHE_ELSE_NETWORK: 1,
    NETWORK_ELSE_CACHE: 2,
    CACHE_THEN_NETWORK: 3
};

exports.default = CacheProvider;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(12);

var _config2 = _interopRequireDefault(_config);

var _utils = __webpack_require__(1);

var Utils = _interopRequireWildcard(_utils);

var _entry = __webpack_require__(10);

var _entry2 = _interopRequireDefault(_entry);

var _query = __webpack_require__(31);

var _query2 = _interopRequireDefault(_query);

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

var _cache = __webpack_require__(9);

var cache = _interopRequireWildcard(_cache);

var _index = __webpack_require__(4);

var _index2 = _interopRequireDefault(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Expose `Stack`.
 * @ignore
 */
var Stack = function () {
    function Stack() {
        _classCallCheck(this, Stack);

        this.config = _config2.default;
        this.cachePolicy = _index2.default.policies.IGNORE_CACHE;
        this.provider = _index2.default.providers('localstorage');

        for (var _len = arguments.length, stack_arguments = Array(_len), _key = 0; _key < _len; _key++) {
            stack_arguments[_key] = arguments[_key];
        }

        switch (stack_arguments.length) {
            case 1:
                if (_typeof(stack_arguments[0]) === "object" && typeof stack_arguments[0].api_key === "string" && typeof stack_arguments[0].access_token === "string" && typeof stack_arguments[0].environment === "string") {
                    this.headers = {
                        api_key: stack_arguments[0].api_key,
                        access_token: stack_arguments[0].access_token
                    };
                    this.environment = stack_arguments[0].environment;
                    return this;
                } else {
                    console.error("Kindly provide valid object parameters.");
                }
            case 3:
                if (typeof stack_arguments[0] === "string" && typeof stack_arguments[1] === "string" && typeof stack_arguments[2] === "string") {
                    this.headers = {
                        api_key: stack_arguments[0],
                        access_token: stack_arguments[1]
                    };
                    this.environment = stack_arguments[2];
                    return this;
                } else {
                    console.error("Kindly provide valid string parameters.");
                }
            default:
                console.error("Kindly provide valid parameters to initialize the Built.io Contentstack javascript-SDK Stack.");
        }
    }

    /**
     * @method setPort
     * @description Sets the port of the host.
     * @param {Number} port - Port Number
     * @return Stack
     * */


    _createClass(Stack, [{
        key: 'setPort',
        value: function setPort(port) {
            if (typeof port === "number") this.config.port = port;
            return this;
        }

        /**
         * @method setProtocol
         * @description Sets the protocol of the host.
         * @param {String} protocol - http/https protocol
         * @return Stack
         * */

    }, {
        key: 'setProtocol',
        value: function setProtocol(protocol) {
            if (typeof protocol === "string" && ~["https", "http"].indexOf(protocol)) this.config.protocol = protocol;
            return this;
        }

        /**
         * @method setHost
         * @description Sets the host of the API server.
         * @param {String} host - valid ip or host
         * @return Stack
         * */

    }, {
        key: 'setHost',
        value: function setHost(host) {
            if (typeof host === "string" && host) this.config.host = host;
            return this;
        }

        /**
         * @method setCachePolicy
         * @description setCachePolicy which contains different cache policies.
         * @param {Constant} [key=ONLY_NETWORK] - Cache policy to be applied on Stack or Query.
         * @example
         * Stack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
         * Stack.setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK)
         * Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK)
         * Stack.setCachePolicy(Contentstack.CachePolicy.NETWORK_ELSE_CACHE)
         * Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK)
         * @returns {Stack}
         */

    }, {
        key: 'setCachePolicy',
        value: function setCachePolicy(policy) {
            if (typeof policy === 'number' && policy >= -1 && policy < 4) {
                if (!this._query) {
                    this.cachePolicy = policy;
                } else {
                    this.queryCachePolicy = policy;
                }
            } else {
                console.error("Kindly provide the valid policy");
            }
            return this;
        }

        /**
         * @method setCacheProvider
         * @description Set 'Cache Provider' object.
         * @example
         * Stack
         *      .setCacheProvider({
         *          get: function (key, callback) {
         *              // custom logic
         *          },
         *          set: function (key, value, callback) {
         *              // custom logic
         *          }
         *      });
         * @returns {Stack}
         */

    }, {
        key: 'setCacheProvider',
        value: function setCacheProvider(provider) {
            if (provider && (typeof provider === 'undefined' ? 'undefined' : _typeof(provider)) === 'object') {
                this.provider = provider;
            }
            return this;
        }

        /**
         * @method clearByQuery
         * @description 'clearByQuery' function to clear the query from the cache.
         * @example
         * Stack.clearQuery(query, callback);
         * @ignore
         */

    }, {
        key: 'clearByQuery',
        value: function clearByQuery() {
            if (this.provider && typeof this.provider.clearByQuery === 'function') {
                return this.provider.clearByQuery.apply(this.provider, arguments);
            }
        }

        /**
         * @method clearByContentType
         * @description 'clearByContentType' function to clear the query from the cache by specified content type.
         * @example
         * Stack.clearByContentType(content_type_uid, callback);
         * Stack.clearByContentType(content_type_uid, language_uid, callback);
         * @ignore
         */

    }, {
        key: 'clearByContentType',
        value: function clearByContentType() {
            if (this.provider && typeof this.provider.clearByContentType === 'function') {
                return this.provider.clearByContentType.apply(this.provider, arguments);
            }
        }

        /**
         * @method clearAll
         * @description 'clearAll' function to clear all the queries from cache.
         * @example
         * Stack.clearAll(callback);
         * @ignore
         */

    }, {
        key: 'clearAll',
        value: function clearAll() {
            if (this.provider && typeof this.provider.clearAll === 'function') {
                return this.provider.clearAll.apply(this.provider, arguments);
            }
        }

        /**
         * @method getCacheProvider
         * @description Returns currently set CacheProvider object.
         * @example Stack.getCacheProvider();
         * @returns {Object}
         */

    }, {
        key: 'getCacheProvider',
        value: function getCacheProvider() {
            return this.provider;
        }

        /**
         * @method ContentType
         * @description Set "ContentType" from the Stack from where you want to retrive the entries.
         * @param {String} [content_type_uid] - uid of the existing contenttype
         * @returns {Stack}
         */

    }, {
        key: 'ContentType',
        value: function ContentType(uid) {
            if (uid && typeof uid === 'string') {
                this.content_type_uid = uid;
            }
            return this;
        }

        /**
         * @method Entry
         * @description Set the Entry Uid which you want to retrive from the Contenttype specified.
         * @param {String} uid - entry_uid
         * @example ContentType('blog').Entry('blt1234567890abcef')
         * @returns {Entry}
         */

    }, {
        key: 'Entry',
        value: function Entry(uid) {
            var entry = new _entry2.default();
            if (uid && typeof uid === "string") {
                entry.entry_uid = uid;
            }
            return Utils.merge(entry, this);
        }

        /**
         * @method Query
         * @description Query instance to provide support for all search queries.
         * @example ContentType('blog').Query()
         * @returns {Query}
         */

    }, {
        key: 'Query',
        value: function Query() {
            var query = new _query2.default();
            return Utils.merge(query, this);
        }

        /**
         * @method getLastActivites
         * @description getLastActivites get all the ContentTypes whose last activity updated.
         * @example Stack.getLastActivites()
         * @returns {Stack}
         * @ignore
         */

    }, {
        key: 'getLastActivities',
        value: function getLastActivities() {
            var query = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types,
                body: {
                    _method: 'GET',
                    only_last_activity: true,
                    environment: this.environment
                }
            };
            return (0, _request2.default)(query);
        }
    }]);

    return Stack;
}();

exports.default = Stack;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		/**
   * Custom error type for promises rejected by promise.timeout
   * @param {string} message
   * @constructor
   */
		function TimeoutError(message) {
			Error.call(this);
			this.message = message;
			this.name = TimeoutError.name;
			if (typeof Error.captureStackTrace === 'function') {
				Error.captureStackTrace(this, TimeoutError);
			}
		}

		TimeoutError.prototype = Object.create(Error.prototype);
		TimeoutError.prototype.constructor = TimeoutError;

		return TimeoutError;
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		makeApply.tryCatchResolve = tryCatchResolve;

		return makeApply;

		function makeApply(Promise, call) {
			if (arguments.length < 2) {
				call = tryCatchResolve;
			}

			return apply;

			function apply(f, thisArg, args) {
				var p = Promise._defer();
				var l = args.length;
				var params = new Array(l);
				callAndResolve({ f: f, thisArg: thisArg, args: args, params: params, i: l - 1, call: call }, p._handler);

				return p;
			}

			function callAndResolve(c, h) {
				if (c.i < 0) {
					return call(c.f, c.thisArg, c.params, h);
				}

				var handler = Promise._handler(c.args[c.i]);
				handler.fold(callAndResolveNext, c, void 0, h);
			}

			function callAndResolveNext(c, x, h) {
				c.params[c.i] = x;
				c.i -= 1;
				callAndResolve(c, h);
			}
		}

		function tryCatchResolve(f, thisArg, args, resolver) {
			try {
				resolver.resolve(f.apply(thisArg, args));
			} catch (e) {
				resolver.reject(e);
			}
		}
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		return {
			pending: toPendingState,
			fulfilled: toFulfilledState,
			rejected: toRejectedState,
			inspect: inspect
		};

		function toPendingState() {
			return { state: 'pending' };
		}

		function toRejectedState(e) {
			return { state: 'rejected', reason: e };
		}

		function toFulfilledState(x) {
			return { state: 'fulfilled', value: x };
		}

		function inspect(handler) {
			var state = handler.state();
			return state === 0 ? toPendingState() : state > 0 ? toFulfilledState(handler.value) : toRejectedState(handler.value);
		}
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.get = get;
exports.set = set;
exports.getStorage = getStorage;
exports.getKeys = getKeys;

var _utils = __webpack_require__(1);

var Utils = _interopRequireWildcard(_utils);

var _localstorage = __webpack_require__(34);

var _localstorage2 = _interopRequireDefault(_localstorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function get(key) {
    var data = _localstorage2.default.getItem(key);
    try {
        data = JSON.parse(data);
    } catch (e) {
        return data;
    }
    return data || null;
};

function set(key, data) {
    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
        _localstorage2.default.setItem(key, JSON.stringify(data));
    } else {
        _localstorage2.default.setItem(key, data);
    }
};

function getStorage() {
    return _localstorage2.default || null;
};

function getKeys() {
    return _localstorage2.default ? Object.keys(_localstorage2.default) : [];
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
				value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(1);

var Utils = _interopRequireWildcard(_utils);

var _stack = __webpack_require__(5);

var _stack2 = _interopRequireDefault(_stack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _extend = function _extend(type) {
				return function () {
								this._query[type] = this._query[type] || {};
								switch (arguments.length) {
												case 1:
																if (Array.isArray(arguments[0]) || typeof arguments[0] === "string") {
																				var query = this._query[type]['BASE'] || [];
																				query = query.concat(arguments[0]);
																				this._query[type]['BASE'] = query;
																				return this;
																} else {
																				console.error("Kindly provide valid parameters");
																}
																break;
												case 2:
																if (typeof arguments[0] === "string" && (Array.isArray(arguments[1]) || typeof arguments[1] === "string")) {
																				var query = this._query[type][arguments[0]] || [];
																				query = query.concat(arguments[1]);
																				this._query[type][arguments[0]] = query;
																				return this;
																} else {
																				console.error("Kindly provide valid parameters");
																}
																break;
												default:
																console.error("Kindly provide valid parameters");
								}
				};
};

/**
 * @summary Creates an instance of `Entry`.
 * @description An initializer is responsible for creating Entry object.
 * @param {String} uid - uid of the entry
 * @example
 * var Entry = Contentstack.Stack().ContentType('example).Entry();
 * @returns {Entry}
 * @ignore
 */

var Entry = function () {
				function Entry() {
								_classCallCheck(this, Entry);

								this._query = {};
								/**
         * @method only
         * @description This method is use to show the selected fields of the entries in resultset.
         * @param {String} [key=BASE] - reference field in the entry/single field in entry
         * @param {Array} values - array of fields to be show in resultset
         * @example
         * <caption> .only with field uid </caption>
         * blogEntry.only('title')
         * @example
         * <caption> .only with field uid </caption>
         * blogEntry.only('BASE','title')
         * @example
         * <caption> .only with field uids(array) </caption>
         * blogEntry.only(['title','description'])
         * @example
         * <caption> .only with reference_field_uid and field uid </caption>
         * blogEntry.includeReference('category').only('category','title')
         * @example
         * <caption> .only with reference_field_uid and field uids(array) </caption>
         * blogEntry.includeReference('category').only('category', ['title', 'description'])
         * @returns {Entry}
         */
								this.only = _extend('only');
								/**
         * @method except
         * @description This method is use to hide the selected fields of the entries in resultset.
         * @param {String} [key=BASE] - reference field in the entry/single field in entry
         * @param {Array} values - array of fields to be show in resultset
         * @example
         * <caption> .except with field uid </caption>
         * blogEntry.except('title')
         * @example
         * <caption> .except with field uid </caption>
         * blogEntry.except('BASE','title')
         * @example
         * <caption> .except with field uids(array) </caption>
         * blogEntry.except(['title','description'])
         * @example
         * <caption> .except with reference_field_uid and field uid </caption>
         * blogEntry.includeReference('category').except('category','title')
         * @example
         * <caption> .except with reference_field_uid and field uids(array) </caption>
         * blogEntry.includeReference('category').except('category', ['title', 'description'])
         * @returns {Entry} */
								this.except = _extend('except');
								return this;
				}

				_createClass(Entry, [{
								key: "setCacheProvider",
								value: function setCacheProvider(provider) {
												if (provider && (typeof provider === "undefined" ? "undefined" : _typeof(provider)) === 'object') {
																this.provider = provider;
												}
												return this;
								}
				}, {
								key: "setCachePolicy",
								value: function setCachePolicy(policy) {
												if (typeof policy === 'number' && policy >= -1 && policy < 4) {
																if (!this._query) {
																				this.cachePolicy = policy;
																} else {
																				this.queryCachePolicy = policy;
																}
												} else {
																console.error("Kindly provide the valid policy");
												}
												return this;
								}

								/**
        * @method includeReference
        * @description This method is use to include referenced entries from the other Contenttype.
        * @example
        * <caption> .includeReference with reference_field_uids as array </caption>
        * blogEntry.includeReference(['category', 'author'])
        * @example
        * <caption> .includeReference with reference_field_uids </caption>
        * blogEntry.includeReference('category', 'author')
        * @returns {Entry}
        */

				}, {
								key: "includeReference",
								value: function includeReference() {
												for (var _len = arguments.length, val = Array(_len), _key = 0; _key < _len; _key++) {
																val[_key] = arguments[_key];
												}

												if (Array.isArray(val) || typeof val === "string") {
																if (arguments.length) {
																				for (var i = 0; i < arguments.length; i++) {
																								this._query['include'] = this._query['include'] || [];
																								this._query['include'] = this._query['include'].concat(arguments[i]);
																				}
																}
																return this;
												} else {
																console.error("Argument should be a String or an Array.");
												}
								}

								/**
         * @method language
         * @description This method is used set language code, which language's data to be retrieve.
         * @param {String} language_code - language code. e.g. 'en-us', 'ja-jp', etc.
         * @example blogEntry.language('en-us')
         * @returns {Entry}
         */

				}, {
								key: "language",
								value: function language(language_code) {
												if (language_code && typeof language_code === 'string') {
																this._query['locale'] = language_code;
																return this;
												} else {
																console.error("Argument should be a String.");
												}
								}

								/**
         * @method addQuery
         * @description This method is used to add query to Entry object.
         * @param {String} key - key of the query
         * @param {String} value - value of the query
         * @example blogEntry.addQuery('include_schema',true)
         * @returns {Entry}
         */

				}, {
								key: "addQuery",
								value: function addQuery(key, value) {
												if (key && value && typeof key === 'string') {
																this._query[key] = value;
																return this;
												} else {
																console.error("First argument should be a String.");
												}
								}

								/**
         * @method includeSchema
         * @description This method is used to include the schema of the current contenttype in result set along with the entry/entries.
         * @example blogEntry.includeSchema()
         * @returns {Entry}
         */

				}, {
								key: "includeSchema",
								value: function includeSchema() {
												this._query['include_schema'] = true;
												return this;
								}

								/**
         * @method includeOwner
         * @description This method is used to include the owner of the entry/entries in resultset.
         * @example blogEntry.includeOwner()
         * @returns {Entry}
         */

				}, {
								key: "includeOwner",
								value: function includeOwner() {
												this._query['include_owner'] = true;
												return this;
								}

								/**
         * @method toJSON
         * @description This method is used to convert the result in to plain javascript object.
         * @example
         * blogEntry
         *      .toJSON()
         *      .then(function (result) {
         *          var value = result.get(field_uid)
        *       },function (error) {
         *          // error function
         *      })
         * @returns {Object}
         */

				}, {
								key: "toJSON",
								value: function toJSON() {
												this.tojson = true;
												return this;
								}

								/**
         * @method fetch
         * @description fetch entry of requested content_type of defined query if present.
         * @example
         * blogEntry.fetch()
         */

				}, {
								key: "fetch",
								value: function fetch() {
												if (this.entry_uid) {
																this.requestParams = {
																				method: 'POST',
																				headers: this.headers,
																				url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries + this.entry_uid,
																				body: {
																								_method: 'GET',
																								query: this._query
																				}
																};
																return Utils.sendRequest(this);
												} else {
																console.error("Kindly provide an entry uid. e.g. .Entry('bltsomething123')");
												}
								}
				}]);

				return Entry;
}();

exports.default = Entry;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _when = __webpack_require__(27);

var _when2 = _interopRequireDefault(_when);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _when2.default;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    protocol: "https",
    host: "cdn.contentstack.io",
    port: 443,
    version: "v3",
    urls: {
        content_types: "/content_types/",
        entries: "/entries/",
        environments: "/environments/"
    }
};

exports.default = config;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// http://www.rajdeepd.com/articles/chrome/localstrg/LocalStorageSample.htm

// NOTE:
// this varies from actual localStorage in some subtle ways

// also, there is no persistence
// TODO persist
(function () {
  "use strict";

  var db;

  function LocalStorage() {}
  db = LocalStorage;

  db.prototype.getItem = function (key) {
    if (this.hasOwnProperty(key)) {
      return String(this[key]);
    }
    return null;
  };

  db.prototype.setItem = function (key, val) {
    this[key] = String(val);
  };

  db.prototype.removeItem = function (key) {
    delete this[key];
  };

  db.prototype.clear = function () {
    var self = this;
    Object.keys(self).forEach(function (key) {
      self[key] = undefined;
      delete self[key];
    });
  };

  db.prototype.key = function (i) {
    i = i || 0;
    return Object.keys(this)[i];
  };

  db.prototype.__defineGetter__('length', function () {
    return Object.keys(this).length;
  });

  if (global.localStorage) {
    module.exports = localStorage;
  } else {
    module.exports = new LocalStorage();
  }
})();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

		var makePromise = __webpack_require__(26);
		var Scheduler = __webpack_require__(15);
		var async = __webpack_require__(2).asap;

		return makePromise({
			scheduler: new Scheduler(async)
		});
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		// Credit to Twisol (https://github.com/Twisol) for suggesting
		// this type of extensible queue + trampoline approach for next-tick conflation.

		/**
   * Async task scheduler
   * @param {function} async function to schedule a single async function
   * @constructor
   */
		function Scheduler(async) {
			this._async = async;
			this._running = false;

			this._queue = this;
			this._queueLen = 0;
			this._afterQueue = {};
			this._afterQueueLen = 0;

			var self = this;
			this.drain = function () {
				self._drain();
			};
		}

		/**
   * Enqueue a task
   * @param {{ run:function }} task
   */
		Scheduler.prototype.enqueue = function (task) {
			this._queue[this._queueLen++] = task;
			this.run();
		};

		/**
   * Enqueue a task to run after the main task queue
   * @param {{ run:function }} task
   */
		Scheduler.prototype.afterQueue = function (task) {
			this._afterQueue[this._afterQueueLen++] = task;
			this.run();
		};

		Scheduler.prototype.run = function () {
			if (!this._running) {
				this._running = true;
				this._async(this.drain);
			}
		};

		/**
   * Drain the handler queue entirely, and then the after queue
   */
		Scheduler.prototype._drain = function () {
			var i = 0;
			for (; i < this._queueLen; ++i) {
				this._queue[i].run();
				this._queue[i] = void 0;
			}

			this._queueLen = 0;
			this._running = false;

			for (i = 0; i < this._afterQueueLen; ++i) {
				this._afterQueue[i].run();
				this._afterQueue[i] = void 0;
			}

			this._afterQueueLen = 0;
		};

		return Scheduler;
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

		var state = __webpack_require__(8);
		var applier = __webpack_require__(7);

		return function array(Promise) {

			var applyFold = applier(Promise);
			var toPromise = Promise.resolve;
			var all = Promise.all;

			var ar = Array.prototype.reduce;
			var arr = Array.prototype.reduceRight;
			var slice = Array.prototype.slice;

			// Additional array combinators

			Promise.any = any;
			Promise.some = some;
			Promise.settle = settle;

			Promise.map = map;
			Promise.filter = filter;
			Promise.reduce = reduce;
			Promise.reduceRight = reduceRight;

			/**
    * When this promise fulfills with an array, do
    * onFulfilled.apply(void 0, array)
    * @param {function} onFulfilled function to apply
    * @returns {Promise} promise for the result of applying onFulfilled
    */
			Promise.prototype.spread = function (onFulfilled) {
				return this.then(all).then(function (array) {
					return onFulfilled.apply(this, array);
				});
			};

			return Promise;

			/**
    * One-winner competitive race.
    * Return a promise that will fulfill when one of the promises
    * in the input array fulfills, or will reject when all promises
    * have rejected.
    * @param {array} promises
    * @returns {Promise} promise for the first fulfilled value
    */
			function any(promises) {
				var p = Promise._defer();
				var resolver = p._handler;
				var l = promises.length >>> 0;

				var pending = l;
				var errors = [];

				for (var h, x, i = 0; i < l; ++i) {
					x = promises[i];
					if (x === void 0 && !(i in promises)) {
						--pending;
						continue;
					}

					h = Promise._handler(x);
					if (h.state() > 0) {
						resolver.become(h);
						Promise._visitRemaining(promises, i, h);
						break;
					} else {
						h.visit(resolver, handleFulfill, handleReject);
					}
				}

				if (pending === 0) {
					resolver.reject(new RangeError('any(): array must not be empty'));
				}

				return p;

				function handleFulfill(x) {
					/*jshint validthis:true*/
					errors = null;
					this.resolve(x); // this === resolver
				}

				function handleReject(e) {
					/*jshint validthis:true*/
					if (this.resolved) {
						// this === resolver
						return;
					}

					errors.push(e);
					if (--pending === 0) {
						this.reject(errors);
					}
				}
			}

			/**
    * N-winner competitive race
    * Return a promise that will fulfill when n input promises have
    * fulfilled, or will reject when it becomes impossible for n
    * input promises to fulfill (ie when promises.length - n + 1
    * have rejected)
    * @param {array} promises
    * @param {number} n
    * @returns {Promise} promise for the earliest n fulfillment values
    *
    * @deprecated
    */
			function some(promises, n) {
				/*jshint maxcomplexity:7*/
				var p = Promise._defer();
				var resolver = p._handler;

				var results = [];
				var errors = [];

				var l = promises.length >>> 0;
				var nFulfill = 0;
				var nReject;
				var x, i; // reused in both for() loops

				// First pass: count actual array items
				for (i = 0; i < l; ++i) {
					x = promises[i];
					if (x === void 0 && !(i in promises)) {
						continue;
					}
					++nFulfill;
				}

				// Compute actual goals
				n = Math.max(n, 0);
				nReject = nFulfill - n + 1;
				nFulfill = Math.min(n, nFulfill);

				if (n > nFulfill) {
					resolver.reject(new RangeError('some(): array must contain at least ' + n + ' item(s), but had ' + nFulfill));
				} else if (nFulfill === 0) {
					resolver.resolve(results);
				}

				// Second pass: observe each array item, make progress toward goals
				for (i = 0; i < l; ++i) {
					x = promises[i];
					if (x === void 0 && !(i in promises)) {
						continue;
					}

					Promise._handler(x).visit(resolver, fulfill, reject, resolver.notify);
				}

				return p;

				function fulfill(x) {
					/*jshint validthis:true*/
					if (this.resolved) {
						// this === resolver
						return;
					}

					results.push(x);
					if (--nFulfill === 0) {
						errors = null;
						this.resolve(results);
					}
				}

				function reject(e) {
					/*jshint validthis:true*/
					if (this.resolved) {
						// this === resolver
						return;
					}

					errors.push(e);
					if (--nReject === 0) {
						results = null;
						this.reject(errors);
					}
				}
			}

			/**
    * Apply f to the value of each promise in a list of promises
    * and return a new list containing the results.
    * @param {array} promises
    * @param {function(x:*, index:Number):*} f mapping function
    * @returns {Promise}
    */
			function map(promises, f) {
				return Promise._traverse(f, promises);
			}

			/**
    * Filter the provided array of promises using the provided predicate.  Input may
    * contain promises and values
    * @param {Array} promises array of promises and values
    * @param {function(x:*, index:Number):boolean} predicate filtering predicate.
    *  Must return truthy (or promise for truthy) for items to retain.
    * @returns {Promise} promise that will fulfill with an array containing all items
    *  for which predicate returned truthy.
    */
			function filter(promises, predicate) {
				var a = slice.call(promises);
				return Promise._traverse(predicate, a).then(function (keep) {
					return filterSync(a, keep);
				});
			}

			function filterSync(promises, keep) {
				// Safe because we know all promises have fulfilled if we've made it this far
				var l = keep.length;
				var filtered = new Array(l);
				for (var i = 0, j = 0; i < l; ++i) {
					if (keep[i]) {
						filtered[j++] = Promise._handler(promises[i]).value;
					}
				}
				filtered.length = j;
				return filtered;
			}

			/**
    * Return a promise that will always fulfill with an array containing
    * the outcome states of all input promises.  The returned promise
    * will never reject.
    * @param {Array} promises
    * @returns {Promise} promise for array of settled state descriptors
    */
			function settle(promises) {
				return all(promises.map(settleOne));
			}

			function settleOne(p) {
				// Optimize the case where we get an already-resolved when.js promise
				//  by extracting its state:
				var handler;
				if (p instanceof Promise) {
					// This is our own Promise type and we can reach its handler internals:
					handler = p._handler.join();
				}
				if (handler && handler.state() === 0 || !handler) {
					// Either still pending, or not a Promise at all:
					return toPromise(p).then(state.fulfilled, state.rejected);
				}

				// The promise is our own, but it is already resolved. Take a shortcut.
				// Since we're not actually handling the resolution, we need to disable
				// rejection reporting.
				handler._unreport();
				return state.inspect(handler);
			}

			/**
    * Traditional reduce function, similar to `Array.prototype.reduce()`, but
    * input may contain promises and/or values, and reduceFunc
    * may return either a value or a promise, *and* initialValue may
    * be a promise for the starting value.
    * @param {Array|Promise} promises array or promise for an array of anything,
    *      may contain a mix of promises and values.
    * @param {function(accumulated:*, x:*, index:Number):*} f reduce function
    * @returns {Promise} that will resolve to the final reduced value
    */
			function reduce(promises, f /*, initialValue */) {
				return arguments.length > 2 ? ar.call(promises, liftCombine(f), arguments[2]) : ar.call(promises, liftCombine(f));
			}

			/**
    * Traditional reduce function, similar to `Array.prototype.reduceRight()`, but
    * input may contain promises and/or values, and reduceFunc
    * may return either a value or a promise, *and* initialValue may
    * be a promise for the starting value.
    * @param {Array|Promise} promises array or promise for an array of anything,
    *      may contain a mix of promises and values.
    * @param {function(accumulated:*, x:*, index:Number):*} f reduce function
    * @returns {Promise} that will resolve to the final reduced value
    */
			function reduceRight(promises, f /*, initialValue */) {
				return arguments.length > 2 ? arr.call(promises, liftCombine(f), arguments[2]) : arr.call(promises, liftCombine(f));
			}

			function liftCombine(f) {
				return function (z, x, i) {
					return applyFold(f, void 0, [z, x, i]);
				};
			}
		};
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		return function flow(Promise) {

			var resolve = Promise.resolve;
			var reject = Promise.reject;
			var origCatch = Promise.prototype['catch'];

			/**
    * Handle the ultimate fulfillment value or rejection reason, and assume
    * responsibility for all errors.  If an error propagates out of result
    * or handleFatalError, it will be rethrown to the host, resulting in a
    * loud stack track on most platforms and a crash on some.
    * @param {function?} onResult
    * @param {function?} onError
    * @returns {undefined}
    */
			Promise.prototype.done = function (onResult, onError) {
				this._handler.visit(this._handler.receiver, onResult, onError);
			};

			/**
    * Add Error-type and predicate matching to catch.  Examples:
    * promise.catch(TypeError, handleTypeError)
    *   .catch(predicate, handleMatchedErrors)
    *   .catch(handleRemainingErrors)
    * @param onRejected
    * @returns {*}
    */
			Promise.prototype['catch'] = Promise.prototype.otherwise = function (onRejected) {
				if (arguments.length < 2) {
					return origCatch.call(this, onRejected);
				}

				if (typeof onRejected !== 'function') {
					return this.ensure(rejectInvalidPredicate);
				}

				return origCatch.call(this, createCatchFilter(arguments[1], onRejected));
			};

			/**
    * Wraps the provided catch handler, so that it will only be called
    * if the predicate evaluates truthy
    * @param {?function} handler
    * @param {function} predicate
    * @returns {function} conditional catch handler
    */
			function createCatchFilter(handler, predicate) {
				return function (e) {
					return evaluatePredicate(e, predicate) ? handler.call(this, e) : reject(e);
				};
			}

			/**
    * Ensures that onFulfilledOrRejected will be called regardless of whether
    * this promise is fulfilled or rejected.  onFulfilledOrRejected WILL NOT
    * receive the promises' value or reason.  Any returned value will be disregarded.
    * onFulfilledOrRejected may throw or return a rejected promise to signal
    * an additional error.
    * @param {function} handler handler to be called regardless of
    *  fulfillment or rejection
    * @returns {Promise}
    */
			Promise.prototype['finally'] = Promise.prototype.ensure = function (handler) {
				if (typeof handler !== 'function') {
					return this;
				}

				return this.then(function (x) {
					return runSideEffect(handler, this, identity, x);
				}, function (e) {
					return runSideEffect(handler, this, reject, e);
				});
			};

			function runSideEffect(handler, thisArg, propagate, value) {
				var result = handler.call(thisArg);
				return maybeThenable(result) ? propagateValue(result, propagate, value) : propagate(value);
			}

			function propagateValue(result, propagate, x) {
				return resolve(result).then(function () {
					return propagate(x);
				});
			}

			/**
    * Recover from a failure by returning a defaultValue.  If defaultValue
    * is a promise, it's fulfillment value will be used.  If defaultValue is
    * a promise that rejects, the returned promise will reject with the
    * same reason.
    * @param {*} defaultValue
    * @returns {Promise} new promise
    */
			Promise.prototype['else'] = Promise.prototype.orElse = function (defaultValue) {
				return this.then(void 0, function () {
					return defaultValue;
				});
			};

			/**
    * Shortcut for .then(function() { return value; })
    * @param  {*} value
    * @return {Promise} a promise that:
    *  - is fulfilled if value is not a promise, or
    *  - if value is a promise, will fulfill with its value, or reject
    *    with its reason.
    */
			Promise.prototype['yield'] = function (value) {
				return this.then(function () {
					return value;
				});
			};

			/**
    * Runs a side effect when this promise fulfills, without changing the
    * fulfillment value.
    * @param {function} onFulfilledSideEffect
    * @returns {Promise}
    */
			Promise.prototype.tap = function (onFulfilledSideEffect) {
				return this.then(onFulfilledSideEffect)['yield'](this);
			};

			return Promise;
		};

		function rejectInvalidPredicate() {
			throw new TypeError('catch predicate must be a function');
		}

		function evaluatePredicate(e, predicate) {
			return isError(predicate) ? e instanceof predicate : predicate(e);
		}

		function isError(predicate) {
			return predicate === Error || predicate != null && predicate.prototype instanceof Error;
		}

		function maybeThenable(x) {
			return ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' || typeof x === 'function') && x !== null;
		}

		function identity(x) {
			return x;
		}
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */
/** @author Jeff Escalante */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		return function fold(Promise) {

			Promise.prototype.fold = function (f, z) {
				var promise = this._beget();

				this._handler.fold(function (z, x, to) {
					Promise._handler(z).fold(function (x, z, to) {
						to.resolve(f.call(this, z, x));
					}, x, this, to);
				}, z, promise._handler.receiver, promise._handler);

				return promise;
			};

			return Promise;
		};
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

		var inspect = __webpack_require__(8).inspect;

		return function inspection(Promise) {

			Promise.prototype.inspect = function () {
				return inspect(Promise._handler(this));
			};

			return Promise;
		};
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		return function generate(Promise) {

			var resolve = Promise.resolve;

			Promise.iterate = iterate;
			Promise.unfold = unfold;

			return Promise;

			/**
    * @deprecated Use github.com/cujojs/most streams and most.iterate
    * Generate a (potentially infinite) stream of promised values:
    * x, f(x), f(f(x)), etc. until condition(x) returns true
    * @param {function} f function to generate a new x from the previous x
    * @param {function} condition function that, given the current x, returns
    *  truthy when the iterate should stop
    * @param {function} handler function to handle the value produced by f
    * @param {*|Promise} x starting value, may be a promise
    * @return {Promise} the result of the last call to f before
    *  condition returns true
    */
			function iterate(f, condition, handler, x) {
				return unfold(function (x) {
					return [x, f(x)];
				}, condition, handler, x);
			}

			/**
    * @deprecated Use github.com/cujojs/most streams and most.unfold
    * Generate a (potentially infinite) stream of promised values
    * by applying handler(generator(seed)) iteratively until
    * condition(seed) returns true.
    * @param {function} unspool function that generates a [value, newSeed]
    *  given a seed.
    * @param {function} condition function that, given the current seed, returns
    *  truthy when the unfold should stop
    * @param {function} handler function to handle the value produced by unspool
    * @param x {*|Promise} starting value, may be a promise
    * @return {Promise} the result of the last value produced by unspool before
    *  condition returns true
    */
			function unfold(unspool, condition, handler, x) {
				return resolve(x).then(function (seed) {
					return resolve(condition(seed)).then(function (done) {
						return done ? seed : resolve(unspool(seed)).spread(next);
					});
				});

				function next(item, newSeed) {
					return resolve(handler(item)).then(function () {
						return unfold(unspool, condition, handler, newSeed);
					});
				}
			}
		};
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		return function progress(Promise) {

			/**
    * @deprecated
    * Register a progress handler for this promise
    * @param {function} onProgress
    * @returns {Promise}
    */
			Promise.prototype.progress = function (onProgress) {
				return this.then(void 0, void 0, onProgress);
			};

			return Promise;
		};
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

		var env = __webpack_require__(2);
		var TimeoutError = __webpack_require__(6);

		function setTimeout(f, ms, x, y) {
			return env.setTimer(function () {
				f(x, y, ms);
			}, ms);
		}

		return function timed(Promise) {
			/**
    * Return a new promise whose fulfillment value is revealed only
    * after ms milliseconds
    * @param {number} ms milliseconds
    * @returns {Promise}
    */
			Promise.prototype.delay = function (ms) {
				var p = this._beget();
				this._handler.fold(handleDelay, ms, void 0, p._handler);
				return p;
			};

			function handleDelay(ms, x, h) {
				setTimeout(resolveDelay, ms, x, h);
			}

			function resolveDelay(x, h) {
				h.resolve(x);
			}

			/**
    * Return a new promise that rejects after ms milliseconds unless
    * this promise fulfills earlier, in which case the returned promise
    * fulfills with the same value.
    * @param {number} ms milliseconds
    * @param {Error|*=} reason optional rejection reason to use, defaults
    *   to a TimeoutError if not provided
    * @returns {Promise}
    */
			Promise.prototype.timeout = function (ms, reason) {
				var p = this._beget();
				var h = p._handler;

				var t = setTimeout(onTimeout, ms, reason, p._handler);

				this._handler.visit(h, function onFulfill(x) {
					env.clearTimer(t);
					this.resolve(x); // this = h
				}, function onReject(x) {
					env.clearTimer(t);
					this.reject(x); // this = h
				}, h.notify);

				return p;
			};

			function onTimeout(reason, h, ms) {
				var e = typeof reason === 'undefined' ? new TimeoutError('timed out after ' + ms + 'ms') : reason;
				h.reject(e);
			}

			return Promise;
		};
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

		var setTimer = __webpack_require__(2).setTimer;
		var format = __webpack_require__(25);

		return function unhandledRejection(Promise) {

			var logError = noop;
			var logInfo = noop;
			var localConsole;

			if (typeof console !== 'undefined') {
				// Alias console to prevent things like uglify's drop_console option from
				// removing console.log/error. Unhandled rejections fall into the same
				// category as uncaught exceptions, and build tools shouldn't silence them.
				localConsole = console;
				logError = typeof localConsole.error !== 'undefined' ? function (e) {
					localConsole.error(e);
				} : function (e) {
					localConsole.log(e);
				};

				logInfo = typeof localConsole.info !== 'undefined' ? function (e) {
					localConsole.info(e);
				} : function (e) {
					localConsole.log(e);
				};
			}

			Promise.onPotentiallyUnhandledRejection = function (rejection) {
				enqueue(report, rejection);
			};

			Promise.onPotentiallyUnhandledRejectionHandled = function (rejection) {
				enqueue(unreport, rejection);
			};

			Promise.onFatalRejection = function (rejection) {
				enqueue(throwit, rejection.value);
			};

			var tasks = [];
			var reported = [];
			var running = null;

			function report(r) {
				if (!r.handled) {
					reported.push(r);
					logError('Potentially unhandled rejection [' + r.id + '] ' + format.formatError(r.value));
				}
			}

			function unreport(r) {
				var i = reported.indexOf(r);
				if (i >= 0) {
					reported.splice(i, 1);
					logInfo('Handled previous rejection [' + r.id + '] ' + format.formatObject(r.value));
				}
			}

			function enqueue(f, x) {
				tasks.push(f, x);
				if (running === null) {
					running = setTimer(flush, 0);
				}
			}

			function flush() {
				running = null;
				while (tasks.length > 0) {
					tasks.shift()(tasks.shift());
				}
			}

			return Promise;
		};

		function throwit(e) {
			throw e;
		}

		function noop() {}
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		return function addWith(Promise) {
			/**
    * Returns a promise whose handlers will be called with `this` set to
    * the supplied receiver.  Subsequent promises derived from the
    * returned promise will also have their handlers called with receiver
    * as `this`. Calling `with` with undefined or no arguments will return
    * a promise whose handlers will again be called in the usual Promises/A+
    * way (no `this`) thus safely undoing any previous `with` in the
    * promise chain.
    *
    * WARNING: Promises returned from `with`/`withThis` are NOT Promises/A+
    * compliant, specifically violating 2.2.5 (http://promisesaplus.com/#point-41)
    *
    * @param {object} receiver `this` value for all handlers attached to
    *  the returned promise.
    * @returns {Promise}
    */
			Promise.prototype['with'] = Promise.prototype.withThis = function (receiver) {
				var p = this._beget();
				var child = p._handler;
				child.receiver = receiver;
				this._handler.chain(child, receiver);
				return p;
			};

			return Promise;
		};
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		return {
			formatError: formatError,
			formatObject: formatObject,
			tryStringify: tryStringify
		};

		/**
   * Format an error into a string.  If e is an Error and has a stack property,
   * it's returned.  Otherwise, e is formatted using formatObject, with a
   * warning added about e not being a proper Error.
   * @param {*} e
   * @returns {String} formatted string, suitable for output to developers
   */
		function formatError(e) {
			var s = (typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object' && e !== null && (e.stack || e.message) ? e.stack || e.message : formatObject(e);
			return e instanceof Error ? s : s + ' (WARNING: non-Error used)';
		}

		/**
   * Format an object, detecting "plain" objects and running them through
   * JSON.stringify if possible.
   * @param {Object} o
   * @returns {string}
   */
		function formatObject(o) {
			var s = String(o);
			if (s === '[object Object]' && typeof JSON !== 'undefined') {
				s = tryStringify(o, s);
			}
			return s;
		}

		/**
   * Try to return the result of JSON.stringify(x).  If that fails, return
   * defaultValue
   * @param {*} x
   * @param {*} defaultValue
   * @returns {String|*} JSON.stringify(x) or defaultValue
   */
		function tryStringify(x, defaultValue) {
			try {
				return JSON.stringify(x);
			} catch (e) {
				return defaultValue;
			}
		}
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		return function makePromise(environment) {

			var tasks = environment.scheduler;
			var emitRejection = initEmitRejection();

			var objectCreate = Object.create || function (proto) {
				function Child() {}
				Child.prototype = proto;
				return new Child();
			};

			/**
    * Create a promise whose fate is determined by resolver
    * @constructor
    * @returns {Promise} promise
    * @name Promise
    */
			function Promise(resolver, handler) {
				this._handler = resolver === Handler ? handler : init(resolver);
			}

			/**
    * Run the supplied resolver
    * @param resolver
    * @returns {Pending}
    */
			function init(resolver) {
				var handler = new Pending();

				try {
					resolver(promiseResolve, promiseReject, promiseNotify);
				} catch (e) {
					promiseReject(e);
				}

				return handler;

				/**
     * Transition from pre-resolution state to post-resolution state, notifying
     * all listeners of the ultimate fulfillment or rejection
     * @param {*} x resolution value
     */
				function promiseResolve(x) {
					handler.resolve(x);
				}
				/**
     * Reject this promise with reason, which will be used verbatim
     * @param {Error|*} reason rejection reason, strongly suggested
     *   to be an Error type
     */
				function promiseReject(reason) {
					handler.reject(reason);
				}

				/**
     * @deprecated
     * Issue a progress event, notifying all progress listeners
     * @param {*} x progress event payload to pass to all listeners
     */
				function promiseNotify(x) {
					handler.notify(x);
				}
			}

			// Creation

			Promise.resolve = resolve;
			Promise.reject = reject;
			Promise.never = never;

			Promise._defer = defer;
			Promise._handler = getHandler;

			/**
    * Returns a trusted promise. If x is already a trusted promise, it is
    * returned, otherwise returns a new trusted Promise which follows x.
    * @param  {*} x
    * @return {Promise} promise
    */
			function resolve(x) {
				return isPromise(x) ? x : new Promise(Handler, new Async(getHandler(x)));
			}

			/**
    * Return a reject promise with x as its reason (x is used verbatim)
    * @param {*} x
    * @returns {Promise} rejected promise
    */
			function reject(x) {
				return new Promise(Handler, new Async(new Rejected(x)));
			}

			/**
    * Return a promise that remains pending forever
    * @returns {Promise} forever-pending promise.
    */
			function never() {
				return foreverPendingPromise; // Should be frozen
			}

			/**
    * Creates an internal {promise, resolver} pair
    * @private
    * @returns {Promise}
    */
			function defer() {
				return new Promise(Handler, new Pending());
			}

			// Transformation and flow control

			/**
    * Transform this promise's fulfillment value, returning a new Promise
    * for the transformed result.  If the promise cannot be fulfilled, onRejected
    * is called with the reason.  onProgress *may* be called with updates toward
    * this promise's fulfillment.
    * @param {function=} onFulfilled fulfillment handler
    * @param {function=} onRejected rejection handler
    * @param {function=} onProgress @deprecated progress handler
    * @return {Promise} new promise
    */
			Promise.prototype.then = function (onFulfilled, onRejected, onProgress) {
				var parent = this._handler;
				var state = parent.join().state();

				if (typeof onFulfilled !== 'function' && state > 0 || typeof onRejected !== 'function' && state < 0) {
					// Short circuit: value will not change, simply share handler
					return new this.constructor(Handler, parent);
				}

				var p = this._beget();
				var child = p._handler;

				parent.chain(child, parent.receiver, onFulfilled, onRejected, onProgress);

				return p;
			};

			/**
    * If this promise cannot be fulfilled due to an error, call onRejected to
    * handle the error. Shortcut for .then(undefined, onRejected)
    * @param {function?} onRejected
    * @return {Promise}
    */
			Promise.prototype['catch'] = function (onRejected) {
				return this.then(void 0, onRejected);
			};

			/**
    * Creates a new, pending promise of the same type as this promise
    * @private
    * @returns {Promise}
    */
			Promise.prototype._beget = function () {
				return begetFrom(this._handler, this.constructor);
			};

			function begetFrom(parent, Promise) {
				var child = new Pending(parent.receiver, parent.join().context);
				return new Promise(Handler, child);
			}

			// Array combinators

			Promise.all = all;
			Promise.race = race;
			Promise._traverse = traverse;

			/**
    * Return a promise that will fulfill when all promises in the
    * input array have fulfilled, or will reject when one of the
    * promises rejects.
    * @param {array} promises array of promises
    * @returns {Promise} promise for array of fulfillment values
    */
			function all(promises) {
				return traverseWith(snd, null, promises);
			}

			/**
    * Array<Promise<X>> -> Promise<Array<f(X)>>
    * @private
    * @param {function} f function to apply to each promise's value
    * @param {Array} promises array of promises
    * @returns {Promise} promise for transformed values
    */
			function traverse(f, promises) {
				return traverseWith(tryCatch2, f, promises);
			}

			function traverseWith(tryMap, f, promises) {
				var handler = typeof f === 'function' ? mapAt : settleAt;

				var resolver = new Pending();
				var pending = promises.length >>> 0;
				var results = new Array(pending);

				for (var i = 0, x; i < promises.length && !resolver.resolved; ++i) {
					x = promises[i];

					if (x === void 0 && !(i in promises)) {
						--pending;
						continue;
					}

					traverseAt(promises, handler, i, x, resolver);
				}

				if (pending === 0) {
					resolver.become(new Fulfilled(results));
				}

				return new Promise(Handler, resolver);

				function mapAt(i, x, resolver) {
					if (!resolver.resolved) {
						traverseAt(promises, settleAt, i, tryMap(f, x, i), resolver);
					}
				}

				function settleAt(i, x, resolver) {
					results[i] = x;
					if (--pending === 0) {
						resolver.become(new Fulfilled(results));
					}
				}
			}

			function traverseAt(promises, handler, i, x, resolver) {
				if (maybeThenable(x)) {
					var h = getHandlerMaybeThenable(x);
					var s = h.state();

					if (s === 0) {
						h.fold(handler, i, void 0, resolver);
					} else if (s > 0) {
						handler(i, h.value, resolver);
					} else {
						resolver.become(h);
						visitRemaining(promises, i + 1, h);
					}
				} else {
					handler(i, x, resolver);
				}
			}

			Promise._visitRemaining = visitRemaining;
			function visitRemaining(promises, start, handler) {
				for (var i = start; i < promises.length; ++i) {
					markAsHandled(getHandler(promises[i]), handler);
				}
			}

			function markAsHandled(h, handler) {
				if (h === handler) {
					return;
				}

				var s = h.state();
				if (s === 0) {
					h.visit(h, void 0, h._unreport);
				} else if (s < 0) {
					h._unreport();
				}
			}

			/**
    * Fulfill-reject competitive race. Return a promise that will settle
    * to the same state as the earliest input promise to settle.
    *
    * WARNING: The ES6 Promise spec requires that race()ing an empty array
    * must return a promise that is pending forever.  This implementation
    * returns a singleton forever-pending promise, the same singleton that is
    * returned by Promise.never(), thus can be checked with ===
    *
    * @param {array} promises array of promises to race
    * @returns {Promise} if input is non-empty, a promise that will settle
    * to the same outcome as the earliest input promise to settle. if empty
    * is empty, returns a promise that will never settle.
    */
			function race(promises) {
				if ((typeof promises === 'undefined' ? 'undefined' : _typeof(promises)) !== 'object' || promises === null) {
					return reject(new TypeError('non-iterable passed to race()'));
				}

				// Sigh, race([]) is untestable unless we return *something*
				// that is recognizable without calling .then() on it.
				return promises.length === 0 ? never() : promises.length === 1 ? resolve(promises[0]) : runRace(promises);
			}

			function runRace(promises) {
				var resolver = new Pending();
				var i, x, h;
				for (i = 0; i < promises.length; ++i) {
					x = promises[i];
					if (x === void 0 && !(i in promises)) {
						continue;
					}

					h = getHandler(x);
					if (h.state() !== 0) {
						resolver.become(h);
						visitRemaining(promises, i + 1, h);
						break;
					} else {
						h.visit(resolver, resolver.resolve, resolver.reject);
					}
				}
				return new Promise(Handler, resolver);
			}

			// Promise internals
			// Below this, everything is @private

			/**
    * Get an appropriate handler for x, without checking for cycles
    * @param {*} x
    * @returns {object} handler
    */
			function getHandler(x) {
				if (isPromise(x)) {
					return x._handler.join();
				}
				return maybeThenable(x) ? getHandlerUntrusted(x) : new Fulfilled(x);
			}

			/**
    * Get a handler for thenable x.
    * NOTE: You must only call this if maybeThenable(x) == true
    * @param {object|function|Promise} x
    * @returns {object} handler
    */
			function getHandlerMaybeThenable(x) {
				return isPromise(x) ? x._handler.join() : getHandlerUntrusted(x);
			}

			/**
    * Get a handler for potentially untrusted thenable x
    * @param {*} x
    * @returns {object} handler
    */
			function getHandlerUntrusted(x) {
				try {
					var untrustedThen = x.then;
					return typeof untrustedThen === 'function' ? new Thenable(untrustedThen, x) : new Fulfilled(x);
				} catch (e) {
					return new Rejected(e);
				}
			}

			/**
    * Handler for a promise that is pending forever
    * @constructor
    */
			function Handler() {}

			Handler.prototype.when = Handler.prototype.become = Handler.prototype.notify // deprecated
			= Handler.prototype.fail = Handler.prototype._unreport = Handler.prototype._report = noop;

			Handler.prototype._state = 0;

			Handler.prototype.state = function () {
				return this._state;
			};

			/**
    * Recursively collapse handler chain to find the handler
    * nearest to the fully resolved value.
    * @returns {object} handler nearest the fully resolved value
    */
			Handler.prototype.join = function () {
				var h = this;
				while (h.handler !== void 0) {
					h = h.handler;
				}
				return h;
			};

			Handler.prototype.chain = function (to, receiver, fulfilled, rejected, progress) {
				this.when({
					resolver: to,
					receiver: receiver,
					fulfilled: fulfilled,
					rejected: rejected,
					progress: progress
				});
			};

			Handler.prototype.visit = function (receiver, fulfilled, rejected, progress) {
				this.chain(failIfRejected, receiver, fulfilled, rejected, progress);
			};

			Handler.prototype.fold = function (f, z, c, to) {
				this.when(new Fold(f, z, c, to));
			};

			/**
    * Handler that invokes fail() on any handler it becomes
    * @constructor
    */
			function FailIfRejected() {}

			inherit(Handler, FailIfRejected);

			FailIfRejected.prototype.become = function (h) {
				h.fail();
			};

			var failIfRejected = new FailIfRejected();

			/**
    * Handler that manages a queue of consumers waiting on a pending promise
    * @constructor
    */
			function Pending(receiver, inheritedContext) {
				Promise.createContext(this, inheritedContext);

				this.consumers = void 0;
				this.receiver = receiver;
				this.handler = void 0;
				this.resolved = false;
			}

			inherit(Handler, Pending);

			Pending.prototype._state = 0;

			Pending.prototype.resolve = function (x) {
				this.become(getHandler(x));
			};

			Pending.prototype.reject = function (x) {
				if (this.resolved) {
					return;
				}

				this.become(new Rejected(x));
			};

			Pending.prototype.join = function () {
				if (!this.resolved) {
					return this;
				}

				var h = this;

				while (h.handler !== void 0) {
					h = h.handler;
					if (h === this) {
						return this.handler = cycle();
					}
				}

				return h;
			};

			Pending.prototype.run = function () {
				var q = this.consumers;
				var handler = this.handler;
				this.handler = this.handler.join();
				this.consumers = void 0;

				for (var i = 0; i < q.length; ++i) {
					handler.when(q[i]);
				}
			};

			Pending.prototype.become = function (handler) {
				if (this.resolved) {
					return;
				}

				this.resolved = true;
				this.handler = handler;
				if (this.consumers !== void 0) {
					tasks.enqueue(this);
				}

				if (this.context !== void 0) {
					handler._report(this.context);
				}
			};

			Pending.prototype.when = function (continuation) {
				if (this.resolved) {
					tasks.enqueue(new ContinuationTask(continuation, this.handler));
				} else {
					if (this.consumers === void 0) {
						this.consumers = [continuation];
					} else {
						this.consumers.push(continuation);
					}
				}
			};

			/**
    * @deprecated
    */
			Pending.prototype.notify = function (x) {
				if (!this.resolved) {
					tasks.enqueue(new ProgressTask(x, this));
				}
			};

			Pending.prototype.fail = function (context) {
				var c = typeof context === 'undefined' ? this.context : context;
				this.resolved && this.handler.join().fail(c);
			};

			Pending.prototype._report = function (context) {
				this.resolved && this.handler.join()._report(context);
			};

			Pending.prototype._unreport = function () {
				this.resolved && this.handler.join()._unreport();
			};

			/**
    * Wrap another handler and force it into a future stack
    * @param {object} handler
    * @constructor
    */
			function Async(handler) {
				this.handler = handler;
			}

			inherit(Handler, Async);

			Async.prototype.when = function (continuation) {
				tasks.enqueue(new ContinuationTask(continuation, this));
			};

			Async.prototype._report = function (context) {
				this.join()._report(context);
			};

			Async.prototype._unreport = function () {
				this.join()._unreport();
			};

			/**
    * Handler that wraps an untrusted thenable and assimilates it in a future stack
    * @param {function} then
    * @param {{then: function}} thenable
    * @constructor
    */
			function Thenable(then, thenable) {
				Pending.call(this);
				tasks.enqueue(new AssimilateTask(then, thenable, this));
			}

			inherit(Pending, Thenable);

			/**
    * Handler for a fulfilled promise
    * @param {*} x fulfillment value
    * @constructor
    */
			function Fulfilled(x) {
				Promise.createContext(this);
				this.value = x;
			}

			inherit(Handler, Fulfilled);

			Fulfilled.prototype._state = 1;

			Fulfilled.prototype.fold = function (f, z, c, to) {
				runContinuation3(f, z, this, c, to);
			};

			Fulfilled.prototype.when = function (cont) {
				runContinuation1(cont.fulfilled, this, cont.receiver, cont.resolver);
			};

			var errorId = 0;

			/**
    * Handler for a rejected promise
    * @param {*} x rejection reason
    * @constructor
    */
			function Rejected(x) {
				Promise.createContext(this);

				this.id = ++errorId;
				this.value = x;
				this.handled = false;
				this.reported = false;

				this._report();
			}

			inherit(Handler, Rejected);

			Rejected.prototype._state = -1;

			Rejected.prototype.fold = function (f, z, c, to) {
				to.become(this);
			};

			Rejected.prototype.when = function (cont) {
				if (typeof cont.rejected === 'function') {
					this._unreport();
				}
				runContinuation1(cont.rejected, this, cont.receiver, cont.resolver);
			};

			Rejected.prototype._report = function (context) {
				tasks.afterQueue(new ReportTask(this, context));
			};

			Rejected.prototype._unreport = function () {
				if (this.handled) {
					return;
				}
				this.handled = true;
				tasks.afterQueue(new UnreportTask(this));
			};

			Rejected.prototype.fail = function (context) {
				this.reported = true;
				emitRejection('unhandledRejection', this);
				Promise.onFatalRejection(this, context === void 0 ? this.context : context);
			};

			function ReportTask(rejection, context) {
				this.rejection = rejection;
				this.context = context;
			}

			ReportTask.prototype.run = function () {
				if (!this.rejection.handled && !this.rejection.reported) {
					this.rejection.reported = true;
					emitRejection('unhandledRejection', this.rejection) || Promise.onPotentiallyUnhandledRejection(this.rejection, this.context);
				}
			};

			function UnreportTask(rejection) {
				this.rejection = rejection;
			}

			UnreportTask.prototype.run = function () {
				if (this.rejection.reported) {
					emitRejection('rejectionHandled', this.rejection) || Promise.onPotentiallyUnhandledRejectionHandled(this.rejection);
				}
			};

			// Unhandled rejection hooks
			// By default, everything is a noop

			Promise.createContext = Promise.enterContext = Promise.exitContext = Promise.onPotentiallyUnhandledRejection = Promise.onPotentiallyUnhandledRejectionHandled = Promise.onFatalRejection = noop;

			// Errors and singletons

			var foreverPendingHandler = new Handler();
			var foreverPendingPromise = new Promise(Handler, foreverPendingHandler);

			function cycle() {
				return new Rejected(new TypeError('Promise cycle'));
			}

			// Task runners

			/**
    * Run a single consumer
    * @constructor
    */
			function ContinuationTask(continuation, handler) {
				this.continuation = continuation;
				this.handler = handler;
			}

			ContinuationTask.prototype.run = function () {
				this.handler.join().when(this.continuation);
			};

			/**
    * Run a queue of progress handlers
    * @constructor
    */
			function ProgressTask(value, handler) {
				this.handler = handler;
				this.value = value;
			}

			ProgressTask.prototype.run = function () {
				var q = this.handler.consumers;
				if (q === void 0) {
					return;
				}

				for (var c, i = 0; i < q.length; ++i) {
					c = q[i];
					runNotify(c.progress, this.value, this.handler, c.receiver, c.resolver);
				}
			};

			/**
    * Assimilate a thenable, sending it's value to resolver
    * @param {function} then
    * @param {object|function} thenable
    * @param {object} resolver
    * @constructor
    */
			function AssimilateTask(then, thenable, resolver) {
				this._then = then;
				this.thenable = thenable;
				this.resolver = resolver;
			}

			AssimilateTask.prototype.run = function () {
				var h = this.resolver;
				tryAssimilate(this._then, this.thenable, _resolve, _reject, _notify);

				function _resolve(x) {
					h.resolve(x);
				}
				function _reject(x) {
					h.reject(x);
				}
				function _notify(x) {
					h.notify(x);
				}
			};

			function tryAssimilate(then, thenable, resolve, reject, notify) {
				try {
					then.call(thenable, resolve, reject, notify);
				} catch (e) {
					reject(e);
				}
			}

			/**
    * Fold a handler value with z
    * @constructor
    */
			function Fold(f, z, c, to) {
				this.f = f;this.z = z;this.c = c;this.to = to;
				this.resolver = failIfRejected;
				this.receiver = this;
			}

			Fold.prototype.fulfilled = function (x) {
				this.f.call(this.c, this.z, x, this.to);
			};

			Fold.prototype.rejected = function (x) {
				this.to.reject(x);
			};

			Fold.prototype.progress = function (x) {
				this.to.notify(x);
			};

			// Other helpers

			/**
    * @param {*} x
    * @returns {boolean} true iff x is a trusted Promise
    */
			function isPromise(x) {
				return x instanceof Promise;
			}

			/**
    * Test just enough to rule out primitives, in order to take faster
    * paths in some code
    * @param {*} x
    * @returns {boolean} false iff x is guaranteed *not* to be a thenable
    */
			function maybeThenable(x) {
				return ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' || typeof x === 'function') && x !== null;
			}

			function runContinuation1(f, h, receiver, next) {
				if (typeof f !== 'function') {
					return next.become(h);
				}

				Promise.enterContext(h);
				tryCatchReject(f, h.value, receiver, next);
				Promise.exitContext();
			}

			function runContinuation3(f, x, h, receiver, next) {
				if (typeof f !== 'function') {
					return next.become(h);
				}

				Promise.enterContext(h);
				tryCatchReject3(f, x, h.value, receiver, next);
				Promise.exitContext();
			}

			/**
    * @deprecated
    */
			function runNotify(f, x, h, receiver, next) {
				if (typeof f !== 'function') {
					return next.notify(x);
				}

				Promise.enterContext(h);
				tryCatchReturn(f, x, receiver, next);
				Promise.exitContext();
			}

			function tryCatch2(f, a, b) {
				try {
					return f(a, b);
				} catch (e) {
					return reject(e);
				}
			}

			/**
    * Return f.call(thisArg, x), or if it throws return a rejected promise for
    * the thrown exception
    */
			function tryCatchReject(f, x, thisArg, next) {
				try {
					next.become(getHandler(f.call(thisArg, x)));
				} catch (e) {
					next.become(new Rejected(e));
				}
			}

			/**
    * Same as above, but includes the extra argument parameter.
    */
			function tryCatchReject3(f, x, y, thisArg, next) {
				try {
					f.call(thisArg, x, y, next);
				} catch (e) {
					next.become(new Rejected(e));
				}
			}

			/**
    * @deprecated
    * Return f.call(thisArg, x), or if it throws, *return* the exception
    */
			function tryCatchReturn(f, x, thisArg, next) {
				try {
					next.notify(f.call(thisArg, x));
				} catch (e) {
					next.notify(e);
				}
			}

			function inherit(Parent, Child) {
				Child.prototype = objectCreate(Parent.prototype);
				Child.prototype.constructor = Child;
			}

			function snd(x, y) {
				return y;
			}

			function noop() {}

			function hasCustomEvent() {
				if (typeof CustomEvent === 'function') {
					try {
						var ev = new CustomEvent('unhandledRejection');
						return ev instanceof CustomEvent;
					} catch (ignoredException) {}
				}
				return false;
			}

			function hasInternetExplorerCustomEvent() {
				if (typeof document !== 'undefined' && typeof document.createEvent === 'function') {
					try {
						// Try to create one event to make sure it's supported
						var ev = document.createEvent('CustomEvent');
						ev.initCustomEvent('eventType', false, true, {});
						return true;
					} catch (ignoredException) {}
				}
				return false;
			}

			function initEmitRejection() {
				/*global process, self, CustomEvent*/
				if (typeof process !== 'undefined' && process !== null && typeof process.emit === 'function') {
					// Returning falsy here means to call the default
					// onPotentiallyUnhandledRejection API.  This is safe even in
					// browserify since process.emit always returns falsy in browserify:
					// https://github.com/defunctzombie/node-process/blob/master/browser.js#L40-L46
					return function (type, rejection) {
						return type === 'unhandledRejection' ? process.emit(type, rejection.value, rejection) : process.emit(type, rejection);
					};
				} else if (typeof self !== 'undefined' && hasCustomEvent()) {
					return function (self, CustomEvent) {
						return function (type, rejection) {
							var ev = new CustomEvent(type, {
								detail: {
									reason: rejection.value,
									key: rejection
								},
								bubbles: false,
								cancelable: true
							});

							return !self.dispatchEvent(ev);
						};
					}(self, CustomEvent);
				} else if (typeof self !== 'undefined' && hasInternetExplorerCustomEvent()) {
					return function (self, document) {
						return function (type, rejection) {
							var ev = document.createEvent('CustomEvent');
							ev.initCustomEvent(type, false, true, {
								reason: rejection.value,
								key: rejection
							});

							return !self.dispatchEvent(ev);
						};
					}(self, document);
				}

				return noop;
			}

			return Promise;
		};
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/** @license MIT License (c) copyright 2010-2014 original author or authors */

/**
 * Promises/A+ and when() implementation
 * when is part of the cujoJS family of libraries (http://cujojs.com/)
 * @author Brian Cavalier
 * @author John Hann
 */
(function (define) {
	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

		var timed = __webpack_require__(22);
		var array = __webpack_require__(16);
		var flow = __webpack_require__(17);
		var fold = __webpack_require__(18);
		var inspect = __webpack_require__(19);
		var generate = __webpack_require__(20);
		var progress = __webpack_require__(21);
		var withThis = __webpack_require__(24);
		var unhandledRejection = __webpack_require__(23);
		var TimeoutError = __webpack_require__(6);

		var Promise = [array, flow, fold, generate, progress, inspect, withThis, timed, unhandledRejection].reduce(function (Promise, feature) {
			return feature(Promise);
		}, __webpack_require__(14));

		var apply = __webpack_require__(7)(Promise);

		// Public API

		when.promise = promise; // Create a pending promise
		when.resolve = Promise.resolve; // Create a resolved promise
		when.reject = Promise.reject; // Create a rejected promise

		when.lift = lift; // lift a function to return promises
		when['try'] = attempt; // call a function and return a promise
		when.attempt = attempt; // alias for when.try

		when.iterate = Promise.iterate; // DEPRECATED (use cujojs/most streams) Generate a stream of promises
		when.unfold = Promise.unfold; // DEPRECATED (use cujojs/most streams) Generate a stream of promises

		when.join = join; // Join 2 or more promises

		when.all = all; // Resolve a list of promises
		when.settle = settle; // Settle a list of promises

		when.any = lift(Promise.any); // One-winner race
		when.some = lift(Promise.some); // Multi-winner race
		when.race = lift(Promise.race); // First-to-settle race

		when.map = map; // Array.map() for promises
		when.filter = filter; // Array.filter() for promises
		when.reduce = lift(Promise.reduce); // Array.reduce() for promises
		when.reduceRight = lift(Promise.reduceRight); // Array.reduceRight() for promises

		when.isPromiseLike = isPromiseLike; // Is something promise-like, aka thenable

		when.Promise = Promise; // Promise constructor
		when.defer = defer; // Create a {promise, resolve, reject} tuple

		// Error types

		when.TimeoutError = TimeoutError;

		/**
   * Get a trusted promise for x, or by transforming x with onFulfilled
   *
   * @param {*} x
   * @param {function?} onFulfilled callback to be called when x is
   *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
   *   will be invoked immediately.
   * @param {function?} onRejected callback to be called when x is
   *   rejected.
   * @param {function?} onProgress callback to be called when progress updates
   *   are issued for x. @deprecated
   * @returns {Promise} a new promise that will fulfill with the return
   *   value of callback or errback or the completion value of promiseOrValue if
   *   callback and/or errback is not supplied.
   */
		function when(x, onFulfilled, onRejected, onProgress) {
			var p = Promise.resolve(x);
			if (arguments.length < 2) {
				return p;
			}

			return p.then(onFulfilled, onRejected, onProgress);
		}

		/**
   * Creates a new promise whose fate is determined by resolver.
   * @param {function} resolver function(resolve, reject, notify)
   * @returns {Promise} promise whose fate is determine by resolver
   */
		function promise(resolver) {
			return new Promise(resolver);
		}

		/**
   * Lift the supplied function, creating a version of f that returns
   * promises, and accepts promises as arguments.
   * @param {function} f
   * @returns {Function} version of f that returns promises
   */
		function lift(f) {
			return function () {
				for (var i = 0, l = arguments.length, a = new Array(l); i < l; ++i) {
					a[i] = arguments[i];
				}
				return apply(f, this, a);
			};
		}

		/**
   * Call f in a future turn, with the supplied args, and return a promise
   * for the result.
   * @param {function} f
   * @returns {Promise}
   */
		function attempt(f /*, args... */) {
			/*jshint validthis:true */
			for (var i = 0, l = arguments.length - 1, a = new Array(l); i < l; ++i) {
				a[i] = arguments[i + 1];
			}
			return apply(f, this, a);
		}

		/**
   * Creates a {promise, resolver} pair, either or both of which
   * may be given out safely to consumers.
   * @return {{promise: Promise, resolve: function, reject: function, notify: function}}
   */
		function defer() {
			return new Deferred();
		}

		function Deferred() {
			var p = Promise._defer();

			function resolve(x) {
				p._handler.resolve(x);
			}
			function reject(x) {
				p._handler.reject(x);
			}
			function notify(x) {
				p._handler.notify(x);
			}

			this.promise = p;
			this.resolve = resolve;
			this.reject = reject;
			this.notify = notify;
			this.resolver = { resolve: resolve, reject: reject, notify: notify };
		}

		/**
   * Determines if x is promise-like, i.e. a thenable object
   * NOTE: Will return true for *any thenable object*, and isn't truly
   * safe, since it may attempt to access the `then` property of x (i.e.
   *  clever/malicious getters may do weird things)
   * @param {*} x anything
   * @returns {boolean} true if x is promise-like
   */
		function isPromiseLike(x) {
			return x && typeof x.then === 'function';
		}

		/**
   * Return a promise that will resolve only once all the supplied arguments
   * have resolved. The resolution value of the returned promise will be an array
   * containing the resolution values of each of the arguments.
   * @param {...*} arguments may be a mix of promises and values
   * @returns {Promise}
   */
		function join() /* ...promises */{
			return Promise.all(arguments);
		}

		/**
   * Return a promise that will fulfill once all input promises have
   * fulfilled, or reject when any one input promise rejects.
   * @param {array|Promise} promises array (or promise for an array) of promises
   * @returns {Promise}
   */
		function all(promises) {
			return when(promises, Promise.all);
		}

		/**
   * Return a promise that will always fulfill with an array containing
   * the outcome states of all input promises.  The returned promise
   * will only reject if `promises` itself is a rejected promise.
   * @param {array|Promise} promises array (or promise for an array) of promises
   * @returns {Promise} promise for array of settled state descriptors
   */
		function settle(promises) {
			return when(promises, Promise.settle);
		}

		/**
   * Promise-aware array map function, similar to `Array.prototype.map()`,
   * but input array may contain promises or values.
   * @param {Array|Promise} promises array of anything, may contain promises and values
   * @param {function(x:*, index:Number):*} mapFunc map function which may
   *  return a promise or value
   * @returns {Promise} promise that will fulfill with an array of mapped values
   *  or reject if any input promise rejects.
   */
		function map(promises, mapFunc) {
			return when(promises, function (promises) {
				return Promise.map(promises, mapFunc);
			});
		}

		/**
   * Filter the provided array of promises using the provided predicate.  Input may
   * contain promises and values
   * @param {Array|Promise} promises array of promises and values
   * @param {function(x:*, index:Number):boolean} predicate filtering predicate.
   *  Must return truthy (or promise for truthy) for items to retain.
   * @returns {Promise} promise that will fulfill with an array containing all items
   *  for which predicate returned truthy.
   */
		function filter(promises, predicate) {
			return when(promises, function (promises) {
				return Promise.filter(promises, predicate);
			});
		}

		return when;
	}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(__webpack_require__(0));

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
 *
 * This can be used with JS designed for browsers to improve reuse of code and
 * allow the use of existing libraries.
 *
 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
 *
 * @author Dan DeFelippi <dan@driverdan.com>
 * @contributor David Ellis <d.f.ellis@ieee.org>
 * @license MIT
 */

var Url = __webpack_require__(40);
var spawn = __webpack_require__(36).spawn;
var fs = __webpack_require__(37);

exports.XMLHttpRequest = function () {
  "use strict";

  /**
   * Private variables
   */

  var self = this;
  var http = __webpack_require__(38);
  var https = __webpack_require__(39);

  // Holds http.js objects
  var request;
  var response;

  // Request settings
  var settings = {};

  // Disable header blacklist.
  // Not part of XHR specs.
  var disableHeaderCheck = false;

  // Set some default headers
  var defaultHeaders = {
    "User-Agent": "node-XMLHttpRequest",
    "Accept": "*/*"
  };

  var headers = {};
  var headersCase = {};

  // These headers are not user setable.
  // The following are allowed but banned in the spec:
  // * user-agent
  var forbiddenRequestHeaders = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "content-transfer-encoding", "cookie", "cookie2", "date", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "via"];

  // These request methods are not allowed
  var forbiddenRequestMethods = ["TRACE", "TRACK", "CONNECT"];

  // Send flag
  var sendFlag = false;
  // Error flag, used when errors occur or abort is called
  var errorFlag = false;

  // Event listeners
  var listeners = {};

  /**
   * Constants
   */

  this.UNSENT = 0;
  this.OPENED = 1;
  this.HEADERS_RECEIVED = 2;
  this.LOADING = 3;
  this.DONE = 4;

  /**
   * Public vars
   */

  // Current state
  this.readyState = this.UNSENT;

  // default ready state change handler in case one is not set or is set late
  this.onreadystatechange = null;

  // Result & response
  this.responseText = "";
  this.responseXML = "";
  this.status = null;
  this.statusText = null;

  // Whether cross-site Access-Control requests should be made using
  // credentials such as cookies or authorization headers
  this.withCredentials = false;

  /**
   * Private methods
   */

  /**
   * Check if the specified header is allowed.
   *
   * @param string header Header to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpHeader = function isAllowedHttpHeader(header) {
    return disableHeaderCheck || header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1;
  };

  /**
   * Check if the specified method is allowed.
   *
   * @param string method Request method to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpMethod = function isAllowedHttpMethod(method) {
    return method && forbiddenRequestMethods.indexOf(method) === -1;
  };

  /**
   * Public methods
   */

  /**
   * Open the connection. Currently supports local server requests.
   *
   * @param string method Connection method (eg GET, POST)
   * @param string url URL for the connection.
   * @param boolean async Asynchronous connection. Default is true.
   * @param string user Username for basic authentication (optional)
   * @param string password Password for basic authentication (optional)
   */
  this.open = function (method, url, async, user, password) {
    this.abort();
    errorFlag = false;

    // Check for valid request method
    if (!isAllowedHttpMethod(method)) {
      throw new Error("SecurityError: Request method not allowed");
    }

    settings = {
      "method": method,
      "url": url.toString(),
      "async": typeof async !== "boolean" ? true : async,
      "user": user || null,
      "password": password || null
    };

    setState(this.OPENED);
  };

  /**
   * Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
   * This does not conform to the W3C spec.
   *
   * @param boolean state Enable or disable header checking.
   */
  this.setDisableHeaderCheck = function (state) {
    disableHeaderCheck = state;
  };

  /**
   * Sets a header for the request or appends the value if one is already set.
   *
   * @param string header Header name
   * @param string value Header value
   */
  this.setRequestHeader = function (header, value) {
    if (this.readyState !== this.OPENED) {
      throw new Error("INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN");
    }
    if (!isAllowedHttpHeader(header)) {
      console.warn("Refused to set unsafe header \"" + header + "\"");
      return;
    }
    if (sendFlag) {
      throw new Error("INVALID_STATE_ERR: send flag is true");
    }
    header = headersCase[header.toLowerCase()] || header;
    headersCase[header.toLowerCase()] = header;
    headers[header] = headers[header] ? headers[header] + ', ' + value : value;
  };

  /**
   * Gets a header from the server response.
   *
   * @param string header Name of header to get.
   * @return string Text of the header or null if it doesn't exist.
   */
  this.getResponseHeader = function (header) {
    if (typeof header === "string" && this.readyState > this.OPENED && response && response.headers && response.headers[header.toLowerCase()] && !errorFlag) {
      return response.headers[header.toLowerCase()];
    }

    return null;
  };

  /**
   * Gets all the response headers.
   *
   * @return string A string with all response headers separated by CR+LF
   */
  this.getAllResponseHeaders = function () {
    if (this.readyState < this.HEADERS_RECEIVED || errorFlag) {
      return "";
    }
    var result = "";

    for (var i in response.headers) {
      // Cookie headers are excluded
      if (i !== "set-cookie" && i !== "set-cookie2") {
        result += i + ": " + response.headers[i] + "\r\n";
      }
    }
    return result.substr(0, result.length - 2);
  };

  /**
   * Gets a request header
   *
   * @param string name Name of header to get
   * @return string Returns the request header or empty string if not set
   */
  this.getRequestHeader = function (name) {
    if (typeof name === "string" && headersCase[name.toLowerCase()]) {
      return headers[headersCase[name.toLowerCase()]];
    }

    return "";
  };

  /**
   * Sends the request to the server.
   *
   * @param string data Optional data to send as request body.
   */
  this.send = function (data) {
    if (this.readyState !== this.OPENED) {
      throw new Error("INVALID_STATE_ERR: connection must be opened before send() is called");
    }

    if (sendFlag) {
      throw new Error("INVALID_STATE_ERR: send has already been called");
    }

    var ssl = false,
        local = false;
    var url = Url.parse(settings.url);
    var host;
    // Determine the server
    switch (url.protocol) {
      case "https:":
        ssl = true;
      // SSL & non-SSL both need host, no break here.
      case "http:":
        host = url.hostname;
        break;

      case "file:":
        local = true;
        break;

      case undefined:
      case null:
      case "":
        host = "localhost";
        break;

      default:
        throw new Error("Protocol not supported.");
    }

    // Load files off the local filesystem (file://)
    if (local) {
      if (settings.method !== "GET") {
        throw new Error("XMLHttpRequest: Only GET method is supported");
      }

      if (settings.async) {
        fs.readFile(url.pathname, "utf8", function (error, data) {
          if (error) {
            self.handleError(error);
          } else {
            self.status = 200;
            self.responseText = data;
            setState(self.DONE);
          }
        });
      } else {
        try {
          this.responseText = fs.readFileSync(url.pathname, "utf8");
          this.status = 200;
          setState(self.DONE);
        } catch (e) {
          this.handleError(e);
        }
      }

      return;
    }

    // Default to port 80. If accessing localhost on another port be sure
    // to use http://localhost:port/path
    var port = url.port || (ssl ? 443 : 80);
    // Add query string if one is used
    var uri = url.pathname + (url.search ? url.search : "");

    // Set the defaults if they haven't been set
    for (var name in defaultHeaders) {
      if (!headersCase[name.toLowerCase()]) {
        headers[name] = defaultHeaders[name];
      }
    }

    // Set the Host header or the server may reject the request
    headers.Host = host;
    if (!(ssl && port === 443 || port === 80)) {
      headers.Host += ":" + url.port;
    }

    // Set Basic Auth if necessary
    if (settings.user) {
      if (typeof settings.password === "undefined") {
        settings.password = "";
      }
      var authBuf = new Buffer(settings.user + ":" + settings.password);
      headers.Authorization = "Basic " + authBuf.toString("base64");
    }

    // Set content length header
    if (settings.method === "GET" || settings.method === "HEAD") {
      data = null;
    } else if (data) {
      headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);

      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "text/plain;charset=UTF-8";
      }
    } else if (settings.method === "POST") {
      // For a post with no data set Content-Length: 0.
      // This is required by buggy servers that don't meet the specs.
      headers["Content-Length"] = 0;
    }

    var options = {
      host: host,
      port: port,
      path: uri,
      method: settings.method,
      headers: headers,
      agent: false,
      withCredentials: self.withCredentials
    };

    // Reset error flag
    errorFlag = false;

    // Handle async requests
    if (settings.async) {
      // Use the proper protocol
      var doRequest = ssl ? https.request : http.request;

      // Request is being sent, set send flag
      sendFlag = true;

      // As per spec, this is called here for historical reasons.
      self.dispatchEvent("readystatechange");

      // Handler for the response
      var responseHandler = function responseHandler(resp) {
        // Set response var to the response we got back
        // This is so it remains accessable outside this scope
        response = resp;
        // Check for redirect
        // @TODO Prevent looped redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
          // Change URL to the redirect location
          settings.url = response.headers.location;
          var url = Url.parse(settings.url);
          // Set host var in case it's used later
          host = url.hostname;
          // Options for the new request
          var newOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: response.statusCode === 303 ? "GET" : settings.method,
            headers: headers,
            withCredentials: self.withCredentials
          };

          // Issue the new request
          request = doRequest(newOptions, responseHandler).on("error", errorHandler);
          request.end();
          // @TODO Check if an XHR event needs to be fired here
          return;
        }

        response.setEncoding("utf8");

        setState(self.HEADERS_RECEIVED);
        self.status = response.statusCode;

        response.on("data", function (chunk) {
          // Make sure there's some data
          if (chunk) {
            self.responseText += chunk;
          }
          // Don't emit state changes if the connection has been aborted.
          if (sendFlag) {
            setState(self.LOADING);
          }
        });

        response.on("end", function () {
          if (sendFlag) {
            // Discard the end event if the connection has been aborted
            setState(self.DONE);
            sendFlag = false;
          }
        });

        response.on("error", function (error) {
          self.handleError(error);
        });
      };

      // Error handler for the request
      var errorHandler = function errorHandler(error) {
        self.handleError(error);
      };

      // Create the request
      request = doRequest(options, responseHandler).on("error", errorHandler);

      // Node 0.4 and later won't accept empty data. Make sure it's needed.
      if (data) {
        request.write(data);
      }

      request.end();

      self.dispatchEvent("loadstart");
    } else {
      // Synchronous
      // Create a temporary file for communication with the other Node process
      var contentFile = ".node-xmlhttprequest-content-" + process.pid;
      var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
      fs.writeFileSync(syncFile, "", "utf8");
      // The async request the other Node process executes
      var execString = "var http = require('http'), https = require('https'), fs = require('fs');" + "var doRequest = http" + (ssl ? "s" : "") + ".request;" + "var options = " + JSON.stringify(options) + ";" + "var responseText = '';" + "var req = doRequest(options, function(response) {" + "response.setEncoding('utf8');" + "response.on('data', function(chunk) {" + "  responseText += chunk;" + "});" + "response.on('end', function() {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText}}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + "response.on('error', function(error) {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + "}).on('error', function(error) {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + (data ? "req.write('" + JSON.stringify(data).slice(1, -1).replace(/'/g, "\\'") + "');" : "") + "req.end();";
      // Start the other Node Process, executing this string
      var syncProc = spawn(process.argv[0], ["-e", execString]);
      while (fs.existsSync(syncFile)) {
        // Wait while the sync file is empty
      }
      var resp = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
      // Kill the child process once the file has data
      syncProc.stdin.end();
      // Remove the temporary file
      fs.unlinkSync(contentFile);

      if (resp.err) {
        self.handleError(resp.err);
      } else {
        response = resp.data;
        self.status = resp.data.statusCode;
        self.responseText = resp.data.text;
        setState(self.DONE);
      }
    }
  };

  /**
   * Called when an error is encountered to deal with it.
   */
  this.handleError = function (error) {
    this.status = 0;
    this.statusText = error;
    this.responseText = error.stack;
    errorFlag = true;
    setState(this.DONE);
    this.dispatchEvent('error');
  };

  /**
   * Aborts a request.
   */
  this.abort = function () {
    if (request) {
      request.abort();
      request = null;
    }

    headers = defaultHeaders;
    this.status = 0;
    this.responseText = "";
    this.responseXML = "";

    errorFlag = true;

    if (this.readyState !== this.UNSENT && (this.readyState !== this.OPENED || sendFlag) && this.readyState !== this.DONE) {
      sendFlag = false;
      setState(this.DONE);
    }
    this.readyState = this.UNSENT;
    this.dispatchEvent('abort');
  };

  /**
   * Adds an event listener. Preferred method of binding to events.
   */
  this.addEventListener = function (event, callback) {
    if (!(event in listeners)) {
      listeners[event] = [];
    }
    // Currently allows duplicate callbacks. Should it?
    listeners[event].push(callback);
  };

  /**
   * Remove an event callback that has already been bound.
   * Only works on the matching funciton, cannot be a copy.
   */
  this.removeEventListener = function (event, callback) {
    if (event in listeners) {
      // Filter will return a new array with the callback removed
      listeners[event] = listeners[event].filter(function (ev) {
        return ev !== callback;
      });
    }
  };

  /**
   * Dispatch any events, including both "on" methods and events attached using addEventListener.
   */
  this.dispatchEvent = function (event) {
    if (typeof self["on" + event] === "function") {
      self["on" + event]();
    }
    if (event in listeners) {
      for (var i = 0, len = listeners[event].length; i < len; i++) {
        listeners[event][i].call(self);
      }
    }
  };

  /**
   * Changes readyState and calls onreadystatechange.
   *
   * @param int state New state
   */
  var setState = function setState(state) {
    if (state == self.LOADING || self.readyState !== state) {
      self.readyState = state;

      if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) {
        self.dispatchEvent("readystatechange");
      }

      if (self.readyState === self.DONE && !errorFlag) {
        self.dispatchEvent("load");
        // @TODO figure out InspectorInstrumentation::didLoadXHR(cookie)
        self.dispatchEvent("loadend");
      }
    }
  };
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cache = __webpack_require__(9);

var cache = _interopRequireWildcard(_cache);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var localStorage = {};

localStorage.get = function (key, callback) {
    try {
        callback(null, cache.get(key));
    } catch (e) {
        callback(e);
    }
};

localStorage.set = function (key, value, callback) {
    try {
        if (key && value) cache.set(key, value);
        callback();
    } catch (e) {
        callback(e);
    }
};

function clearValuesForKey(keyArray, append) {
    if (!append && keyArray && keyArray.length) keyArray.push('');
    var _key,
        keys = cache.getKeys(),
        storage = cache.getStorage();
    if (!keyArray || !keyArray.length) {
        for (var i = 0, _i = keys.length; i < _i; i++) {
            delete storage[keys[i]];
        }
    } else {
        _key = keyArray.join('.');
        for (var i = 0, _i = keys.length; i < _i; i++) {
            if (keys[i] && keys[i].indexOf(_key) === 0) delete storage[keys[i]];
        }
    }
}

localStorage.clearByContentType = function () {
    try {
        if (arguments.length === 2 || arguments.length === 3) {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.splice(-1, 1).pop();
            var valueArray = [];
            valueArray.push.apply(valueArray, args);
            clearValuesForKey(valueArray);
            callback();
        }
    } catch (e) {
        callback(e);
    }
};

localStorage.clearByQuery = function (query, callback) {
    try {
        var keys = cache.getKeys(),
            storage = cache.getStorage();
        for (var i = 0, _i = keys.length; i < _i; i++) {
            if (keys[i] && ~keys[i].indexOf(query)) delete storage[keys[i]];
        }
        callback();
    } catch (e) {
        callback(e);
    }
};

localStorage.clearAll = function (callback) {
    try {
        clearValuesForKey();
        callback();
    } catch (e) {
        callback(e);
    }
};

exports.default = localStorage;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stack = __webpack_require__(5);

var _stack2 = _interopRequireDefault(_stack);

var _index = __webpack_require__(4);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @method Contentstack
 * @description Creates an instance of `Contentstack`.
 * @api public
 */
var Contentstack = function () {
	function Contentstack() {
		_classCallCheck(this, Contentstack);

		/**
   * @constant CachePolicy
   * @description CachePolicy contains different cache policies constants.
   * @example
   * Contentstack.CachePolicy.IGNORE_CACHE
   * Contentstack.CachePolicy.ONLY_NETWORK
   * Contentstack.CachePolicy.CACHE_ELSE_NETWORK
   * Contentstack.CachePolicy.NETWORK_ELSE_CACHE
   * Contentstack.CachePolicy.CACHE_THEN_NETWORK
   */
		this.CachePolicy = _index2.default.policies;
	}

	/**
  * @method Stack
  * @description Initialize "Built.io Contentstack" Stack javascript-SDK instance
  * @api public
  * @example
  * var Stack = Contentstack.Stack('api_key', 'access_token', 'environment');
  *                  OR
  * var Stack = Contentstack.Stack({
  *      'api_key':'bltsomethingapikey',
  *      'access_token':'bltsomethongtoken',
  *      'environment':'environment_name'
  *   });
  *
  * @returns {Stack}
  */


	_createClass(Contentstack, [{
		key: "Stack",
		value: function Stack() {
			for (var _len = arguments.length, stack_arguments = Array(_len), _key = 0; _key < _len; _key++) {
				stack_arguments[_key] = arguments[_key];
			}

			return new (Function.prototype.bind.apply(_stack2.default, [null].concat(stack_arguments)))();
		}
	}]);

	return Contentstack;
}();

module.exports = new Contentstack();

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

var _utils = __webpack_require__(1);

var Utils = _interopRequireWildcard(_utils);

var _entry = __webpack_require__(10);

var _entry2 = _interopRequireDefault(_entry);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _extend = {
    compare: function compare(type) {
        return function (key, value) {
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
                this._query['query'][key] = this._query['query'][key] || {};
                this._query['query'][key][type] = value;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        };
    },
    contained: function contained(bool) {
        var type = bool ? '$in' : '$nin';
        return function (key, value) {
            if (key && value && typeof key === 'string' && Array.isArray(value)) {
                this._query['query'][key] = this._query['query'][key] || {};
                this._query['query'][key][type] = this._query['query'][key][type] || [];
                this._query['query'][key][type] = this._query['query'][key][type].concat(value);
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        };
    },
    exists: function exists(bool) {
        return function (key) {
            if (key && typeof key === 'string') {
                this._query['query'][key] = this._query['query'][key] || {};
                this._query['query'][key]['$exists'] = bool;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        };
    },
    logical: function logical(type) {
        return function () {
            var _query = [];
            for (var i = 0, _i = arguments.length; i < _i; i++) {
                if (arguments[i] instanceof Query && arguments[i]._query.query) {
                    _query.push(arguments[i]._query.query);
                } else if (_typeof(arguments[i]) === "object") {
                    _query.push(arguments[i]);
                }
            }
            if (this._query['query'][type]) {
                this._query['query'][type] = this._query['query'][type].concat(_query);
            } else {
                this._query['query'][type] = _query;
            }
            return this;
        };
    },
    sort: function sort(type) {
        return function (key) {
            if (key && typeof key === 'string') {
                this._query[type] = key;
                return this;
            } else {
                console.error("Argument should be a string.");
            }
        };
    },
    pagination: function pagination(type) {
        return function (value) {
            if (typeof value === 'number') {
                this._query[type] = value;
                return this;
            } else {
                console.error("Argument should be a number.");
            }
        };
    }
};

/**
 * @summary
 * Creates an instance of `Query`.
 * @description
 * An initializer is responsible for creating Query object.
 * @example
 * <caption>Query instance creation.</caption>
 * var Query = Contentstack.Stack().ContentType('example).Query();
 * @ignore
 */

var Query = function (_Entry) {
    _inherits(Query, _Entry);

    function Query() {
        _classCallCheck(this, Query);

        var _this = _possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).call(this));

        _this._query = _this._query || {};
        _this._query['query'] = _this._query['query'] || {};

        /**
         * @method lessThan
         * @description This method provides only the entries with values less than the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.lessThan('created_at','2015-06-22')
         * @returns {Query}
         */
        _this.lessThan = _extend.compare('$lt');

        /**
         * @method lessThanOrEqualTo
         * @description This method provides only the entries with values less than or equal to the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.lessThanOrEqualTo('created_at','2015-03-12')
         * @returns {Query}
         */
        _this.lessThanOrEqualTo = _extend.compare('$lte');

        /**
         * @method greaterThan
         * @description This method provides only the entries with values greater than the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.greaterThan('created_at','2015-03-12')
         * @returns {Query}
         */
        _this.greaterThan = _extend.compare('$gt');

        /**
         * @method greaterThanOrEqualTo
         * @description This method provides only the entries with values greater than or equal to the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.greaterThanOrEqualTo('created_at', '2015-06-22')
         * @returns {Query}
         */
        _this.greaterThanOrEqualTo = _extend.compare('$gte');

        /**
         * @method notEqualTo
         * @description This method provides only the entries with values not equal to the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.notEqualTo('title','Demo')
         * @returns {Query}
         */
        _this.notEqualTo = _extend.compare('$ne');

        /**
         * @method containedIn
         * @description This method provides only the entries with values matching the specified values for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - An array of values that are to be used to match or compare
         * @example blogQuery.containedIn('title', ['Demo', 'Welcome'])
         * @returns {Query}
         */
        _this.containedIn = _extend.contained(true);

        /**
         * @method notContainedIn
         * @description This method provides only the entries that do not contain values matching the specified values for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {Array} value - An array of values that are to be used to match or compare
         * @example blogQuery.notContainedIn('title', ['Demo', 'Welcome'])
         * @returns {Query}
         */
        _this.notContainedIn = _extend.contained(false);

        /**
         * @method exists
         * @description This method provides only the entries that contains the field matching the specified field uid.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @example blogQuery.exists('featured')
         * @returns {Query}
         */
        _this.exists = _extend.exists(true);

        /**
         * @method notExists
         * @description This method provides only the entries that do not contain the field matching the specified field uid.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @example blogQuery.notExists('featured')
         * @returns {Query}
         */
        _this.notExists = _extend.exists(false);

        /**
         * @method ascending
         * @description This parameter sorts the provided entries in the ascending order on the basis of the specified field.
         * @param {String} key - field uid based on which the ordering should be done
         * @example blogQuery.ascending('created_at')
         * @returns {Query}
         */
        _this.ascending = _extend.sort('asc');

        /**
         * @method descending
         * @description This method sorts the provided entries in the descending order on the basis of the specified field.
         * @param {String} key - field uid based on which the ordering should be done.
         * @example blogQuery.descending('created_at')
         * @returns {Query}
         */
        _this.descending = _extend.sort('desc');

        /**
         * @method beforeUid
         * @description This method provides only the entries before the specified entry id.
         * @param {String} uid - uid of the entry
         * @example blogQuery.beforeUid('blt1234567890abcdef')
         * @returns {Query}
         * @ignore
         */
        _this.beforeUid = _extend.sort('before_uid');

        /**
         * @method afterUid
         * @description This method provides only the entries after the specified entry id.
         * @param {String} uid - uid of the entry
         * @example blogQuery.afterUid('blt1234567890abcdef')
         * @returns {Query}
         * @ignore
         */
        _this.afterUid = _extend.sort('after_uid');

        /**
         * @method skip
         * @description This method skips the specified number of entries.
         * @param {Number} skip - number of entries to be skipped
         * @example blogQuery.skip(5)
         * @returns {Query}
         */
        _this.skip = _extend.pagination('skip');

        /**
         * @method limit
         * @description This method limits the response by providing only the specified number of entries.
         * @param {Number} limit - number of entries to be present in the result(at most)
         * @example blogQuery.limit(10)
         * @returns {Query}
         */
        _this.limit = _extend.pagination('limit');

        /**
         * @method or
         * @description This method performs the OR operation on the specified query objects and provides only the matching entries.
         * @param {object} queries - array of Query objects/raw queries to be taken into consideration
         * @example
         * <caption> .or with Query instances</caption>
         * var Query1 = Stack.ContentType('blog').Query().where('title', 'Demo')
         * var Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10)
         * blogQuery.or(Query1, Query2)
         * @example
         * <caption> .or with raw queries</caption>
         * var Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').getQuery()
         * var Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).getQuery()
         * blogQuery.or(Query1, Query2)
         * @returns {Query}
         */
        _this.or = _extend.logical('$or');

        /**
         * @method and
         * @description This method performs the AND operation on the specified query objects and provides only the matching entries.
         * @param {object} queries - array of Query objects/raw queries to be taken into consideration
         * @example
         * <caption> .and with Query instances</caption>
         * var Query1 = Stack.ContentType('blog').Query().where('title', 'Demo')
         * var Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10)
         * blogQuery.and(Query1, Query2)
         * @example
         * <caption> .and with raw queries</caption>
         * var Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').getQuery()
         * var Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).getQuery()
         * blogQuery.and(Query1, Query2)
         * @returns {Query}
         */
        _this.and = _extend.logical('$and');
        return _this;
    }

    /**
     * @method where(equalTo)
     * @description This method provides only the entries matching the specified value for a field.
     * @param {String} key - uid of the field that is to be taken into consideration
     * @param {*} value - The value used to match or compare
     * @example blogQuery.where('title','Demo')
     * @returns {Query}
     */


    _createClass(Query, [{
        key: 'equalTo',
        value: function equalTo(key, value) {
            if (key && typeof key === 'string') {
                this._query['query'][key] = value;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        }
    }, {
        key: 'where',
        value: function where(key, value) {
            if (key && typeof key === 'string') {
                this._query['query'][key] = value;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        }

        /**
         * @method count
         * @description This method provides only the number of entries matching the specified filters.
         * @example blogQuery.count()
         * @returns {Query}
         */

    }, {
        key: 'count',
        value: function count() {
            this._query['count'] = true;
            this.requestParams = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + this.config.host + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries,
                body: {
                    _method: 'GET',
                    query: this._query
                }
            };
            return this;
        }

        /**
         * @method query
         * @description This method used to set raw queries on Query instance.
         * @param {object} query - raw{json} queries to filter the entries in result set.
         * @returns {Query}
         */

    }, {
        key: 'query',
        value: function query(_query2) {
            if ((typeof _query2 === 'undefined' ? 'undefined' : _typeof(_query2)) === "object") {
                this._query['query'] = Utils.mergeDeep(this._query['query'], _query2);
                return this;
            } else {
                console.error("Kindly provide valid parameters");
            }
        }

        /**
         * @method tags
         * @description The "tags" parameter allows you to specify an array of tags to search objects.
         * @param {Array} values - tags
         * @example blogQuery.tags(['technology', 'business'])
         * @returns {Query}
         */

    }, {
        key: 'tags',
        value: function tags(values) {
            if (Array.isArray(values)) {
                this._query['tags'] = values;
                return this;
            } else {
                console.error("Kindly provide valid parameters");
            }
        }

        /**
         * @method includeCount
         * @description This method also includes the total number of entries returned in the response.
         * @example blogQuery.includeCount()
         * @returns {Query}
         */

    }, {
        key: 'includeCount',
        value: function includeCount() {
            this._query['include_count'] = true;
            return this;
        }

        /**
         * @method getQuery
         * @summary returns the raw query which can be used for futher calls(.and/.or).
         * @description This method provides raw{json} queries based on the filters applied on Query objet.
         * @example blogQuery.where('title','Demo').getQuery()
         * @returns {Query}
         */

    }, {
        key: 'getQuery',
        value: function getQuery() {
            return this._query.query || {};
        }

        /**
         * @method regex
         * @description This method provides only the entries matching the regular expression for the specified field.
         * @param {String} key - Uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @param {String} [options] - match or compare value in entry
         * @example
         * <caption> .regex without options</caption>
         * blogQuery.regex('title','^Demo')
         * @example
         * <caption> .regex with options</caption>
         * blogQuery.regex('title','^Demo', 'i')
         * @returns {Query}
         */

    }, {
        key: 'regex',
        value: function regex(key, value, options) {
            if (key && value && typeof key === 'string' && typeof value === 'string') {
                this._query['query'][key] = {
                    $regex: value
                };
                if (options) this._query['query'][key]['$options'] = options;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        }

        /**
         * @method search
         * @description This method is used to search data in entries.
         * @param {string} value - value to search in entries
         * @example blogQuery.search('Welcome to demo')
         * @returns {Query}
         */

    }, {
        key: 'search',
        value: function search(value) {
            if (value && typeof value === 'string') {
                this._query['typeahead'] = value;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        }

        /**
         * @method find
         * @description Provides all the entries which satisfied the query specified.
         * @example
         * blogQuery.find()
         */

    }, {
        key: 'find',
        value: function find() {
            this.requestParams = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries,
                body: {
                    _method: 'GET',
                    query: this._query
                }
            };
            return Utils.sendRequest(this);
        }

        /**
         * @method findOne
         * @description Provides the single entry from the resultset.
         * @example
         * blogQuery.findOne()
         */

    }, {
        key: 'findOne',
        value: function findOne() {
            this.singleEntry = true;
            this._query.limit = 1;
            this.requestParams = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries,
                body: {
                    _method: 'GET',
                    query: this._query
                }
            };
            return Utils.sendRequest(this);
        }
    }]);

    return Query;
}(_entry2.default);

exports.default = Query;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(1);

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @summary Creates an instance of `Result`.
 * @description An initializer is responsible for creating Result object.
 * @param {Object} object - API result object
 * @example
 * blogEntry.then(function (result) {
 *      // sucess function
 * },function (error) {
 *      // error function
 * })
 * @returns {Result}
 */
var Result = function () {
    function Result(object) {
        _classCallCheck(this, Result);

        if (object) {
            this.object = function () {
                return object;
            };
        }
        return this;
    }

    /**
     * @method toJSON
     * @description Converts `Result` to plain javascript object.
     * @example
     * blogEntry.then(function (result) {
     *      result = result.toJSON()
     * },function (error) {
     *      // error function
     * })
     * @returns {object}
     */


    _createClass(Result, [{
        key: 'toJSON',
        value: function toJSON() {
            return this.object() ? Utils.mergeDeep(JSON.parse(JSON.stringify({})), this.object()) : null;
        }

        /**
         * @method get
         * @description `get` to access the key value.
         * @param field_uid
         * @example
         * blogEntry.then(function (result) {
         *      var value = result.get(field_uid)
         * },function (error) {
         *      // error function
         * })
         * @returns {Object}
         */

    }, {
        key: 'get',
        value: function get(key) {
            if (this.object() && key) {
                var fields = key.split('.');
                var value = fields.reduce(function (prev, field) {
                    return prev[field];
                }, this.object());
                return value;
            }
            return;
        }
    }]);

    return Result;
}();

module.exports = function (object) {
    return new Result(object);
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xmlhttprequest = __webpack_require__(28);

var http = _interopRequireWildcard(_xmlhttprequest);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var HTTPRequest = http.XMLHttpRequest;

exports.default = HTTPRequest;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localStorage = __webpack_require__(13);

var _localStorage2 = _interopRequireDefault(_localStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _localStorage2.default;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = {
	"name": "contentstack",
	"version": "3.1.1",
	"description": "The Built.io Contentstack Javascript SDK",
	"homepage": "https://www.built.io/products/contentstack/overview",
	"author": {
		"name": "Built.io Contentstack",
		"url": "https://www.built.io/"
	},
	"main": "dist/node/contentstack.js",
	"_id": "contentstack@3.1.1",
	"scripts": {
		"test": "node test.js",
		"buildnode": "webpack --config webpack/webpack.node.js",
		"buildweb": "webpack -p --config webpack/webpack.web.js",
		"buildreactnative": "webpack --config webpack/webpack.react-native.js",
		"generate-docs": "node_modules/.bin/jsdoc --configure docs-config.json --verbose"
	},
	"repository": {
		"type": "git",
		"url": "https://github.com/builtio-contentstack/contentstack-javascript.git"
	},
	"_shasum": "a328ed07240476a26b31a23261355dc929e1da63",
	"_from": "contentstack@latest",
	"_npmVersion": "3.8.9",
	"_nodeVersion": "6.2.0",
	"_npmUser": {
		"name": "mynk",
		"email": "mayank@raweng.com"
	},
	"maintainers": [
		{
			"name": "hiteshbal",
			"email": "hitesh.baldaniya@raweng.com"
		},
		{
			"name": "mynk",
			"email": "mayank@raweng.com"
		}
	],
	"dist": {
		"shasum": "a328ed07240476a26b31a23261355dc929e1da63",
		"tarball": "https://registry.npmjs.org/contentstack/-/contentstack-3.0.0.tgz"
	},
	"license": "MIT",
	"directories": {},
	"_resolved": "https://registry.npmjs.org/contentstack/-/contentstack-3.0.0.tgz",
	"_npmOperationalInternal": {
		"host": "packages-18-east.internal.npmjs.com",
		"tmp": "tmp/contentstack-3.0.0.tgz_1477830884275_0.9869455888401717"
	},
	"devDependencies": {
		"babel-core": "^6.24.0",
		"babel-loader": "^6.4.1",
		"babel-plugin-transform-runtime": "^6.23.0",
		"babel-preset-env": "^1.3.2",
		"babel-preset-es2015": "^6.16.0",
		"babel-preset-es2016": "^6.22.0",
		"babel-preset-stage-1": "^6.22.0",
		"compression-webpack-plugin": "^0.3.1",
		"es3ify-loader": "^0.2.0",
		"jshint": "~2.6.3",
		"string-replace-webpack-plugin": "0.0.3",
		"tap-json": "^0.1.1",
		"tape": "^4.4.0",
		"jsdoc": "^3.4.0",
		"uglify-js": "^2.6.2",
		"webpack": "^2.2.1",
		"webpack-md5-hash": "^0.0.5",
		"webpack-merge": "^0.17.0"
	},
	"dependencies": {
		"babel-runtime": "^6.23.0",
		"fs": "0.0.1-security",
		"localStorage": "1.0.3",
		"nodemailer": "4.0.1",
		"path": "^0.12.7",
		"q": "1.4.1",
		"when": "3.7.8",
		"xmlhttprequest": "1.8.0"
	}
};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ })
/******/ ]);