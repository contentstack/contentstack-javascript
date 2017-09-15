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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // import when from "runtime/when.js";


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

var _request = __webpack_require__(1);

var _request2 = _interopRequireDefault(_request);

var _result = __webpack_require__(11);

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

    // var deferred = when.defer();
    var self = queryObject;
    var continueFlag = false;
    var cachePolicy = typeof self.queryCachePolicy !== 'undefined' ? self.queryCachePolicy : self.cachePolicy;
    var tojson = typeof self.tojson !== 'undefined' ? self.tojson : false;
    var isSingle = self.entry_uid || self.singleEntry ? true : false;
    var hashQuery = getHash(parseQueryFromParams(self, isSingle, tojson));

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
            return new Promise(function (resolve, reject) {
                try {
                    if (err) throw err;
                    if (!tojson) entries = resultWrapper(entries);
                    resolve(spreadResult(entries));
                } catch (e) {
                    reject(e);
                }
            });
        };
    };

    var callback = function callback(continueFlag, resolve, reject) {
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
                                return reject({ error_code: 141, error_message: 'The requested entry doesn\'t exist.' });
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
                                return resolve(spreadResult(entries));
                            } catch (e) {
                                return reject(e);
                            }
                        });
                    } else {
                        if (!tojson) entries = resultWrapper(entries);
                        return resolve(spreadResult(entries));
                    }
                } catch (e) {
                    return reject({
                        message: e.message
                    });
                }
            }.bind(self)).catch(function (error) {
                if (cachePolicy === 2) {
                    self.provider.get(hashQuery, getCacheCallback());
                } else {
                    return reject(error);
                }
            });
        }
    };

    switch (cachePolicy) {
        case 1:
            self.provider.get(hashQuery, function (err, _data) {
                return new Promise(function (resolve, reject) {
                    try {
                        if (err || !_data) {
                            callback(true, resolve, reject);
                        } else {
                            if (!tojson) _data = resultWrapper(_data);
                            return resolve(spreadResult(_data));
                        }
                    } catch (e) {
                        return reject(e);
                    }
                });
            });
            break;
        case 2:
        case 0:
        case undefined:
        case -1:
            return new Promise(function (resolve, reject) {
                callback(true, resolve, reject);
            });
    };

    if (cachePolicy !== 3) {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    } else {
        return {
            cache: function () {
                return new Promise(function (resolve, reject) {
                    self.provider.get(hashQuery, function (err, _data) {
                        try {
                            if (err) {
                                return reject(err);
                            } else {
                                if (!tojson) _data = resultWrapper(_data);
                                return resolve(spreadResult(_data));
                            }
                        } catch (e) {
                            return reject(e);
                        }
                    });
                });
            }(),
            network: function () {
                return new Promise(function (resolve, reject) {
                    callback(true, resolve, reject);
                });
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = Request;

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _http = __webpack_require__(12);

var _http2 = _interopRequireDefault(_http);

var _package = __webpack_require__(14);

var Package = _interopRequireWildcard(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function Request(options) {
    return new Promise(function (resolve, reject) {
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

        var url = options.url,
            headers = options.headers;

        // setting headers
        headers['Content-Type'] = 'application/json; charset=UTF-8';
        headers['X-User-Agent'] = 'contentstack-(JS-SDK)/' + Package.version;

        if (options.body && _typeof(options.body) === 'object') {
            delete options.body._method;
            var queryParams = serialize(options.body);
        }

        (0, _http2.default)(url + '?' + queryParams, {
            method: 'GET',
            headers: headers
        }).then(function (response) {
            if (response.ok && response.status === 200) {
                var data = response.json();
                resolve(data);
            } else {
                reject(response.statusText);
            }
        }).catch(function (error) {
            console.log("Error: ", error);
            reject(error);
        });
    });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _localstorage = __webpack_require__(8);

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(6);

var _config2 = _interopRequireDefault(_config);

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _entry = __webpack_require__(5);

var _entry2 = _interopRequireDefault(_entry);

var _query = __webpack_require__(10);

var _query2 = _interopRequireDefault(_query);

var _request = __webpack_require__(1);

var _request2 = _interopRequireDefault(_request);

var _cache = __webpack_require__(4);

var cache = _interopRequireWildcard(_cache);

var _index = __webpack_require__(2);

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
/* 4 */
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

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _localstorage = __webpack_require__(13);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
				value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _stack = __webpack_require__(3);

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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cache = __webpack_require__(4);

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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stack = __webpack_require__(3);

var _stack2 = _interopRequireDefault(_stack);

var _index = __webpack_require__(2);

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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _request = __webpack_require__(1);

var _request2 = _interopRequireDefault(_request);

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _entry = __webpack_require__(5);

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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localStorage = __webpack_require__(7);

var _localStorage2 = _interopRequireDefault(_localStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _localStorage2.default;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = {"name":"contentstack","version":"3.1.2","description":"The Built.io Contentstack Javascript SDK","homepage":"https://www.built.io/products/contentstack/overview","author":{"name":"Built.io Contentstack","url":"https://www.built.io/"},"main":"dist/node/contentstack.js","browser":"dist/web/contentstack.js","_id":"contentstack@3.1.1","scripts":{"test":"node test.js","buildnode":"webpack --config webpack/webpack.node.js","buildweb":"webpack -p --config webpack/webpack.web.js","buildreactnative":"webpack --config webpack/webpack.react-native.js","buildall":"npm run buildnode;npm run buildweb;npm run buildreactnative","generate-docs":"node_modules/.bin/jsdoc --configure docs-config.json --verbose"},"repository":{"type":"git","url":"https://github.com/builtio-contentstack/contentstack-javascript.git"},"_shasum":"a328ed07240476a26b31a23261355dc929e1da63","_from":"contentstack@latest","_npmVersion":"3.8.9","_nodeVersion":"6.2.0","_npmUser":{"name":"mynk","email":"mayank@raweng.com"},"maintainers":[{"name":"hiteshbal","email":"hitesh.baldaniya@raweng.com"},{"name":"mynk","email":"mayank@raweng.com"}],"dist":{"shasum":"a328ed07240476a26b31a23261355dc929e1da63","tarball":"https://registry.npmjs.org/contentstack/-/contentstack-3.0.0.tgz"},"license":"MIT","directories":{},"_resolved":"https://registry.npmjs.org/contentstack/-/contentstack-3.0.0.tgz","_npmOperationalInternal":{"host":"packages-18-east.internal.npmjs.com","tmp":"tmp/contentstack-3.0.0.tgz_1477830884275_0.9869455888401717"},"devDependencies":{"babel-core":"6.24.0","babel-loader":"6.4.1","babel-plugin-transform-runtime":"6.23.0","babel-preset-env":"1.3.2","babel-preset-es2015":"6.16.0","babel-preset-es2016":"6.22.0","babel-preset-stage-1":"6.22.0","compression-webpack-plugin":"0.3.1","es3ify-loader":"0.2.0","jshint":"2.6.3","string-replace-webpack-plugin":"0.0.3","tap-json":"0.1.1","tape":"4.4.0","jsdoc":"3.4.0","uglify-js":"2.6.2","webpack":"2.2.1","webpack-md5-hash":"0.0.5","webpack-merge":"0.17.0","babel-runtime":"6.23.0"},"dependencies":{"isomorphic-fetch":"2.2.1","localStorage":"1.0.3"}}

/***/ })
/******/ ]);