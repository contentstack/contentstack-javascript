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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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

var _when = __webpack_require__(6);

var _when2 = _interopRequireDefault(_when);

var _request = __webpack_require__(1);

var _request2 = _interopRequireDefault(_request);

var _result = __webpack_require__(14);

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

var _http = __webpack_require__(15);

var _http2 = _interopRequireDefault(_http);

var _when = __webpack_require__(6);

var _when2 = _interopRequireDefault(_when);

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _localstorage = __webpack_require__(11);

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

var _config = __webpack_require__(7);

var _config2 = _interopRequireDefault(_config);

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _entry = __webpack_require__(5);

var _entry2 = _interopRequireDefault(_entry);

var _query = __webpack_require__(13);

var _query2 = _interopRequireDefault(_query);

var _request = __webpack_require__(1);

var _request2 = _interopRequireDefault(_request);

var _cache = __webpack_require__(4);

var cache = _interopRequireWildcard(_cache);

var _index = __webpack_require__(2);

var _index2 = _interopRequireDefault(_index);

var _package = __webpack_require__(17);

var Package = _interopRequireWildcard(_package);

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
                        access_token: stack_arguments[0].access_token,
                        "User-Agent": "contentstack-(JS-SDK)/" + Package.version
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
                        access_token: stack_arguments[1],
                        "User-Agent": "contentstack-(JS-SDK)/" + Package.version
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

var _localstorage = __webpack_require__(16);

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

var _q = __webpack_require__(9);

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _q2.default;

/***/ }),
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require

    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

        // CommonJS
    } else if (( false ? "undefined" : _typeof(exports)) === "object" && ( false ? "undefined" : _typeof(module)) === "object") {
        module.exports = definition();

        // RequireJS
    } else if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

        // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

        // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        // Get the `window` object, save the previous Q global
        // and initialize Q as a global.
        var previousQ = global.Q;
        global.Q = definition();

        // Add a noConflict function so Q can be removed from the
        // global namespace.
        global.Q.noConflict = function () {
            global.Q = previousQ;
            return this;
        };
    } else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
    }
})(function () {
    "use strict";

    var hasStacks = false;
    try {
        throw new Error();
    } catch (e) {
        hasStacks = !!e.stack;
    }

    // All code after this point will be filtered from stack traces reported
    // by Q.
    var qStartingLine = captureLine();
    var qFileName;

    // shims

    // used for fallback in "allResolved"
    var noop = function noop() {};

    // Use the fastest possible means to execute a task in a future turn
    // of the event loop.
    var nextTick = function () {
        // linked list of tasks (single, with head node)
        var head = { task: void 0, next: null };
        var tail = head;
        var flushing = false;
        var requestTick = void 0;
        var isNodeJS = false;
        // queue for late tasks, used by unhandled rejection tracking
        var laterQueue = [];

        function flush() {
            /* jshint loopfunc: true */
            var task, domain;

            while (head.next) {
                head = head.next;
                task = head.task;
                head.task = void 0;
                domain = head.domain;

                if (domain) {
                    head.domain = void 0;
                    domain.enter();
                }
                runSingle(task, domain);
            }
            while (laterQueue.length) {
                task = laterQueue.pop();
                runSingle(task);
            }
            flushing = false;
        }
        // runs a single function in the async queue
        function runSingle(task, domain) {
            try {
                task();
            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;
                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        nextTick = function nextTick(task) {
            tail = tail.next = {
                task: task,
                domain: isNodeJS && process.domain,
                next: null
            };

            if (!flushing) {
                flushing = true;
                requestTick();
            }
        };

        if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process.toString() === "[object process]" && process.nextTick) {
            // Ensure Q is in a real Node environment, with a `process.nextTick`.
            // To see through fake Node environments:
            // * Mocha test runner - exposes a `process` global without a `nextTick`
            // * Browserify - exposes a `process.nexTick` function that uses
            //   `setTimeout`. In this case `setImmediate` is preferred because
            //    it is faster. Browserify's `process.toString()` yields
            //   "[object Object]", while in a real Node environment
            //   `process.nextTick()` yields "[object process]".
            isNodeJS = true;

            requestTick = function requestTick() {
                process.nextTick(flush);
            };
        } else if (typeof setImmediate === "function") {
            // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
            if (typeof window !== "undefined") {
                requestTick = setImmediate.bind(window, flush);
            } else {
                requestTick = function requestTick() {
                    setImmediate(flush);
                };
            }
        } else if (typeof MessageChannel !== "undefined") {
            // modern browsers
            // http://www.nonblocking.io/2011/06/windownexttick.html
            var channel = new MessageChannel();
            // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
            // working message ports the first time a page loads.
            channel.port1.onmessage = function () {
                requestTick = requestPortTick;
                channel.port1.onmessage = flush;
                flush();
            };
            var requestPortTick = function requestPortTick() {
                // Opera requires us to provide a message payload, regardless of
                // whether we use it.
                channel.port2.postMessage(0);
            };
            requestTick = function requestTick() {
                setTimeout(flush, 0);
                requestPortTick();
            };
        } else {
            // old browsers
            requestTick = function requestTick() {
                setTimeout(flush, 0);
            };
        }
        // runs a task after all other tasks have been run
        // this is useful for unhandled rejection tracking that needs to happen
        // after all `then`d tasks have been run.
        nextTick.runAfter = function (task) {
            laterQueue.push(task);
            if (!flushing) {
                flushing = true;
                requestTick();
            }
        };
        return nextTick;
    }();

    // Attempt to make generics safe in the face of downstream
    // modifications.
    // There is no situation where this is necessary.
    // If you need a security guarantee, these primordials need to be
    // deeply frozen anyway, and if you don’t need a security guarantee,
    // this is just plain paranoid.
    // However, this **might** have the nice side-effect of reducing the size of
    // the minified code by reducing x.call() to merely x()
    // See Mark Miller’s explanation of what this does.
    // http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
    var call = Function.call;
    function uncurryThis(f) {
        return function () {
            return call.apply(f, arguments);
        };
    }
    // This is equivalent, but slower:
    // uncurryThis = Function_bind.bind(Function_bind.call);
    // http://jsperf.com/uncurrythis

    var array_slice = uncurryThis(Array.prototype.slice);

    var array_reduce = uncurryThis(Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    });

    var array_indexOf = uncurryThis(Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    });

    var array_map = uncurryThis(Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    });

    var object_create = Object.create || function (prototype) {
        function Type() {}
        Type.prototype = prototype;
        return new Type();
    };

    var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

    var object_keys = Object.keys || function (object) {
        var keys = [];
        for (var key in object) {
            if (object_hasOwnProperty(object, key)) {
                keys.push(key);
            }
        }
        return keys;
    };

    var object_toString = uncurryThis(Object.prototype.toString);

    function isObject(value) {
        return value === Object(value);
    }

    // generator related shims

    // FIXME: Remove this function once ES6 generators are in SpiderMonkey.
    function isStopIteration(exception) {
        return object_toString(exception) === "[object StopIteration]" || exception instanceof QReturnValue;
    }

    // FIXME: Remove this helper and Q.return once ES6 generators are in
    // SpiderMonkey.
    var QReturnValue;
    if (typeof ReturnValue !== "undefined") {
        QReturnValue = ReturnValue;
    } else {
        QReturnValue = function QReturnValue(value) {
            this.value = value;
        };
    }

    // long stack traces

    var STACK_JUMP_SEPARATOR = "From previous event:";

    function makeStackTraceLong(error, promise) {
        // If possible, transform the error stack trace by removing Node and Q
        // cruft, then concatenating with the stack trace of `promise`. See #57.
        if (hasStacks && promise.stack && (typeof error === "undefined" ? "undefined" : _typeof(error)) === "object" && error !== null && error.stack && error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1) {
            var stacks = [];
            for (var p = promise; !!p; p = p.source) {
                if (p.stack) {
                    stacks.unshift(p.stack);
                }
            }
            stacks.unshift(error.stack);

            var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
            error.stack = filterStackString(concatedStacks);
        }
    }

    function filterStackString(stackString) {
        var lines = stackString.split("\n");
        var desiredLines = [];
        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];

            if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
                desiredLines.push(line);
            }
        }
        return desiredLines.join("\n");
    }

    function isNodeFrame(stackLine) {
        return stackLine.indexOf("(module.js:") !== -1 || stackLine.indexOf("(node.js:") !== -1;
    }

    function getFileNameAndLineNumber(stackLine) {
        // Named functions: "at functionName (filename:lineNumber:columnNumber)"
        // In IE10 function name can have spaces ("Anonymous function") O_o
        var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
        if (attempt1) {
            return [attempt1[1], Number(attempt1[2])];
        }

        // Anonymous functions: "at filename:lineNumber:columnNumber"
        var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
        if (attempt2) {
            return [attempt2[1], Number(attempt2[2])];
        }

        // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
        var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
        if (attempt3) {
            return [attempt3[1], Number(attempt3[2])];
        }
    }

    function isInternalFrame(stackLine) {
        var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

        if (!fileNameAndLineNumber) {
            return false;
        }

        var fileName = fileNameAndLineNumber[0];
        var lineNumber = fileNameAndLineNumber[1];

        return fileName === qFileName && lineNumber >= qStartingLine && lineNumber <= qEndingLine;
    }

    // discover own file name and line number range for filtering stack
    // traces
    function captureLine() {
        if (!hasStacks) {
            return;
        }

        try {
            throw new Error();
        } catch (e) {
            var lines = e.stack.split("\n");
            var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
            var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
            if (!fileNameAndLineNumber) {
                return;
            }

            qFileName = fileNameAndLineNumber[0];
            return fileNameAndLineNumber[1];
        }
    }

    function deprecate(callback, name, alternative) {
        return function () {
            if (typeof console !== "undefined" && typeof console.warn === "function") {
                console.warn(name + " is deprecated, use " + alternative + " instead.", new Error("").stack);
            }
            return callback.apply(callback, arguments);
        };
    }

    // end of shims
    // beginning of real work

    /**
     * Constructs a promise for an immediate reference, passes promises through, or
     * coerces promises from different systems.
     * @param value immediate reference or promise
     */
    function Q(value) {
        // If the object is already a Promise, return it directly.  This enables
        // the resolve function to both be used to created references from objects,
        // but to tolerably coerce non-promises to promises.
        if (value instanceof Promise) {
            return value;
        }

        // assimilate thenables
        if (isPromiseAlike(value)) {
            return coerce(value);
        } else {
            return fulfill(value);
        }
    }
    Q.resolve = Q;

    /**
     * Performs a task in a future turn of the event loop.
     * @param {Function} task
     */
    Q.nextTick = nextTick;

    /**
     * Controls whether or not long stack traces will be on
     */
    Q.longStackSupport = false;

    // enable long stacks if Q_DEBUG is set
    if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process && process.env && process.env.Q_DEBUG) {
        Q.longStackSupport = true;
    }

    /**
     * Constructs a {promise, resolve, reject} object.
     *
     * `resolve` is a callback to invoke with a more resolved value for the
     * promise. To fulfill the promise, invoke `resolve` with any value that is
     * not a thenable. To reject the promise, invoke `resolve` with a rejected
     * thenable, or invoke `reject` with the reason directly. To resolve the
     * promise to another thenable, thus putting it in the same state, invoke
     * `resolve` with that other thenable.
     */
    Q.defer = defer;
    function defer() {
        // if "messages" is an "Array", that indicates that the promise has not yet
        // been resolved.  If it is "undefined", it has been resolved.  Each
        // element of the messages array is itself an array of complete arguments to
        // forward to the resolved promise.  We coerce the resolution value to a
        // promise using the `resolve` function because it handles both fully
        // non-thenable values and other thenables gracefully.
        var messages = [],
            progressListeners = [],
            resolvedPromise;

        var deferred = object_create(defer.prototype);
        var promise = object_create(Promise.prototype);

        promise.promiseDispatch = function (resolve, op, operands) {
            var args = array_slice(arguments);
            if (messages) {
                messages.push(args);
                if (op === "when" && operands[1]) {
                    // progress operand
                    progressListeners.push(operands[1]);
                }
            } else {
                Q.nextTick(function () {
                    resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
                });
            }
        };

        // XXX deprecated
        promise.valueOf = function () {
            if (messages) {
                return promise;
            }
            var nearerValue = nearer(resolvedPromise);
            if (isPromise(nearerValue)) {
                resolvedPromise = nearerValue; // shorten chain
            }
            return nearerValue;
        };

        promise.inspect = function () {
            if (!resolvedPromise) {
                return { state: "pending" };
            }
            return resolvedPromise.inspect();
        };

        if (Q.longStackSupport && hasStacks) {
            try {
                throw new Error();
            } catch (e) {
                // NOTE: don't try to use `Error.captureStackTrace` or transfer the
                // accessor around; that causes memory leaks as per GH-111. Just
                // reify the stack trace as a string ASAP.
                //
                // At the same time, cut off the first line; it's always just
                // "[object Promise]\n", as per the `toString`.
                promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
            }
        }

        // NOTE: we do the checks for `resolvedPromise` in each method, instead of
        // consolidating them into `become`, since otherwise we'd create new
        // promises with the lines `become(whatever(value))`. See e.g. GH-252.

        function become(newPromise) {
            resolvedPromise = newPromise;
            promise.source = newPromise;

            array_reduce(messages, function (undefined, message) {
                Q.nextTick(function () {
                    newPromise.promiseDispatch.apply(newPromise, message);
                });
            }, void 0);

            messages = void 0;
            progressListeners = void 0;
        }

        deferred.promise = promise;
        deferred.resolve = function (value) {
            if (resolvedPromise) {
                return;
            }

            become(Q(value));
        };

        deferred.fulfill = function (value) {
            if (resolvedPromise) {
                return;
            }

            become(fulfill(value));
        };
        deferred.reject = function (reason) {
            if (resolvedPromise) {
                return;
            }

            become(reject(reason));
        };
        deferred.notify = function (progress) {
            if (resolvedPromise) {
                return;
            }

            array_reduce(progressListeners, function (undefined, progressListener) {
                Q.nextTick(function () {
                    progressListener(progress);
                });
            }, void 0);
        };

        return deferred;
    }

    /**
     * Creates a Node-style callback that will resolve or reject the deferred
     * promise.
     * @returns a nodeback
     */
    defer.prototype.makeNodeResolver = function () {
        var self = this;
        return function (error, value) {
            if (error) {
                self.reject(error);
            } else if (arguments.length > 2) {
                self.resolve(array_slice(arguments, 1));
            } else {
                self.resolve(value);
            }
        };
    };

    /**
     * @param resolver {Function} a function that returns nothing and accepts
     * the resolve, reject, and notify functions for a deferred.
     * @returns a promise that may be resolved with the given resolve and reject
     * functions, or rejected by a thrown exception in resolver
     */
    Q.Promise = promise; // ES6
    Q.promise = promise;
    function promise(resolver) {
        if (typeof resolver !== "function") {
            throw new TypeError("resolver must be a function.");
        }
        var deferred = defer();
        try {
            resolver(deferred.resolve, deferred.reject, deferred.notify);
        } catch (reason) {
            deferred.reject(reason);
        }
        return deferred.promise;
    }

    promise.race = race; // ES6
    promise.all = all; // ES6
    promise.reject = reject; // ES6
    promise.resolve = Q; // ES6

    // XXX experimental.  This method is a way to denote that a local value is
    // serializable and should be immediately dispatched to a remote upon request,
    // instead of passing a reference.
    Q.passByCopy = function (object) {
        //freeze(object);
        //passByCopies.set(object, true);
        return object;
    };

    Promise.prototype.passByCopy = function () {
        //freeze(object);
        //passByCopies.set(object, true);
        return this;
    };

    /**
     * If two promises eventually fulfill to the same value, promises that value,
     * but otherwise rejects.
     * @param x {Any*}
     * @param y {Any*}
     * @returns {Any*} a promise for x and y if they are the same, but a rejection
     * otherwise.
     *
     */
    Q.join = function (x, y) {
        return Q(x).join(y);
    };

    Promise.prototype.join = function (that) {
        return Q([this, that]).spread(function (x, y) {
            if (x === y) {
                // TODO: "===" should be Object.is or equiv
                return x;
            } else {
                throw new Error("Can't join: not the same: " + x + " " + y);
            }
        });
    };

    /**
     * Returns a promise for the first of an array of promises to become settled.
     * @param answers {Array[Any*]} promises to race
     * @returns {Any*} the first promise to be settled
     */
    Q.race = race;
    function race(answerPs) {
        return promise(function (resolve, reject) {
            // Switch to this once we can assume at least ES5
            // answerPs.forEach(function (answerP) {
            //     Q(answerP).then(resolve, reject);
            // });
            // Use this in the meantime
            for (var i = 0, len = answerPs.length; i < len; i++) {
                Q(answerPs[i]).then(resolve, reject);
            }
        });
    }

    Promise.prototype.race = function () {
        return this.then(Q.race);
    };

    /**
     * Constructs a Promise with a promise descriptor object and optional fallback
     * function.  The descriptor contains methods like when(rejected), get(name),
     * set(name, value), post(name, args), and delete(name), which all
     * return either a value, a promise for a value, or a rejection.  The fallback
     * accepts the operation name, a resolver, and any further arguments that would
     * have been forwarded to the appropriate method above had a method been
     * provided with the proper name.  The API makes no guarantees about the nature
     * of the returned object, apart from that it is usable whereever promises are
     * bought and sold.
     */
    Q.makePromise = Promise;
    function Promise(descriptor, fallback, inspect) {
        if (fallback === void 0) {
            fallback = function fallback(op) {
                return reject(new Error("Promise does not support operation: " + op));
            };
        }
        if (inspect === void 0) {
            inspect = function inspect() {
                return { state: "unknown" };
            };
        }

        var promise = object_create(Promise.prototype);

        promise.promiseDispatch = function (resolve, op, args) {
            var result;
            try {
                if (descriptor[op]) {
                    result = descriptor[op].apply(promise, args);
                } else {
                    result = fallback.call(promise, op, args);
                }
            } catch (exception) {
                result = reject(exception);
            }
            if (resolve) {
                resolve(result);
            }
        };

        promise.inspect = inspect;

        // XXX deprecated `valueOf` and `exception` support
        if (inspect) {
            var inspected = inspect();
            if (inspected.state === "rejected") {
                promise.exception = inspected.reason;
            }

            promise.valueOf = function () {
                var inspected = inspect();
                if (inspected.state === "pending" || inspected.state === "rejected") {
                    return promise;
                }
                return inspected.value;
            };
        }

        return promise;
    }

    Promise.prototype.toString = function () {
        return "[object Promise]";
    };

    Promise.prototype.then = function (fulfilled, rejected, progressed) {
        var self = this;
        var deferred = defer();
        var done = false; // ensure the untrusted promise makes at most a
        // single call to one of the callbacks

        function _fulfilled(value) {
            try {
                return typeof fulfilled === "function" ? fulfilled(value) : value;
            } catch (exception) {
                return reject(exception);
            }
        }

        function _rejected(exception) {
            if (typeof rejected === "function") {
                makeStackTraceLong(exception, self);
                try {
                    return rejected(exception);
                } catch (newException) {
                    return reject(newException);
                }
            }
            return reject(exception);
        }

        function _progressed(value) {
            return typeof progressed === "function" ? progressed(value) : value;
        }

        Q.nextTick(function () {
            self.promiseDispatch(function (value) {
                if (done) {
                    return;
                }
                done = true;

                deferred.resolve(_fulfilled(value));
            }, "when", [function (exception) {
                if (done) {
                    return;
                }
                done = true;

                deferred.resolve(_rejected(exception));
            }]);
        });

        // Progress propagator need to be attached in the current tick.
        self.promiseDispatch(void 0, "when", [void 0, function (value) {
            var newValue;
            var threw = false;
            try {
                newValue = _progressed(value);
            } catch (e) {
                threw = true;
                if (Q.onerror) {
                    Q.onerror(e);
                } else {
                    throw e;
                }
            }

            if (!threw) {
                deferred.notify(newValue);
            }
        }]);

        return deferred.promise;
    };

    Q.tap = function (promise, callback) {
        return Q(promise).tap(callback);
    };

    /**
     * Works almost like "finally", but not called for rejections.
     * Original resolution value is passed through callback unaffected.
     * Callback may return a promise that will be awaited for.
     * @param {Function} callback
     * @returns {Q.Promise}
     * @example
     * doSomething()
     *   .then(...)
     *   .tap(console.log)
     *   .then(...);
     */
    Promise.prototype.tap = function (callback) {
        callback = Q(callback);

        return this.then(function (value) {
            return callback.fcall(value).thenResolve(value);
        });
    };

    /**
     * Registers an observer on a promise.
     *
     * Guarantees:
     *
     * 1. that fulfilled and rejected will be called only once.
     * 2. that either the fulfilled callback or the rejected callback will be
     *    called, but not both.
     * 3. that fulfilled and rejected will not be called in this turn.
     *
     * @param value      promise or immediate reference to observe
     * @param fulfilled  function to be called with the fulfilled value
     * @param rejected   function to be called with the rejection exception
     * @param progressed function to be called on any progress notifications
     * @return promise for the return value from the invoked callback
     */
    Q.when = when;
    function when(value, fulfilled, rejected, progressed) {
        return Q(value).then(fulfilled, rejected, progressed);
    }

    Promise.prototype.thenResolve = function (value) {
        return this.then(function () {
            return value;
        });
    };

    Q.thenResolve = function (promise, value) {
        return Q(promise).thenResolve(value);
    };

    Promise.prototype.thenReject = function (reason) {
        return this.then(function () {
            throw reason;
        });
    };

    Q.thenReject = function (promise, reason) {
        return Q(promise).thenReject(reason);
    };

    /**
     * If an object is not a promise, it is as "near" as possible.
     * If a promise is rejected, it is as "near" as possible too.
     * If it’s a fulfilled promise, the fulfillment value is nearer.
     * If it’s a deferred promise and the deferred has been resolved, the
     * resolution is "nearer".
     * @param object
     * @returns most resolved (nearest) form of the object
     */

    // XXX should we re-do this?
    Q.nearer = nearer;
    function nearer(value) {
        if (isPromise(value)) {
            var inspected = value.inspect();
            if (inspected.state === "fulfilled") {
                return inspected.value;
            }
        }
        return value;
    }

    /**
     * @returns whether the given object is a promise.
     * Otherwise it is a fulfilled value.
     */
    Q.isPromise = isPromise;
    function isPromise(object) {
        return object instanceof Promise;
    }

    Q.isPromiseAlike = isPromiseAlike;
    function isPromiseAlike(object) {
        return isObject(object) && typeof object.then === "function";
    }

    /**
     * @returns whether the given object is a pending promise, meaning not
     * fulfilled or rejected.
     */
    Q.isPending = isPending;
    function isPending(object) {
        return isPromise(object) && object.inspect().state === "pending";
    }

    Promise.prototype.isPending = function () {
        return this.inspect().state === "pending";
    };

    /**
     * @returns whether the given object is a value or fulfilled
     * promise.
     */
    Q.isFulfilled = isFulfilled;
    function isFulfilled(object) {
        return !isPromise(object) || object.inspect().state === "fulfilled";
    }

    Promise.prototype.isFulfilled = function () {
        return this.inspect().state === "fulfilled";
    };

    /**
     * @returns whether the given object is a rejected promise.
     */
    Q.isRejected = isRejected;
    function isRejected(object) {
        return isPromise(object) && object.inspect().state === "rejected";
    }

    Promise.prototype.isRejected = function () {
        return this.inspect().state === "rejected";
    };

    //// BEGIN UNHANDLED REJECTION TRACKING

    // This promise library consumes exceptions thrown in handlers so they can be
    // handled by a subsequent promise.  The exceptions get added to this array when
    // they are created, and removed when they are handled.  Note that in ES6 or
    // shimmed environments, this would naturally be a `Set`.
    var unhandledReasons = [];
    var unhandledRejections = [];
    var reportedUnhandledRejections = [];
    var trackUnhandledRejections = true;

    function resetUnhandledRejections() {
        unhandledReasons.length = 0;
        unhandledRejections.length = 0;

        if (!trackUnhandledRejections) {
            trackUnhandledRejections = true;
        }
    }

    function trackRejection(promise, reason) {
        if (!trackUnhandledRejections) {
            return;
        }
        if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                if (array_indexOf(unhandledRejections, promise) !== -1) {
                    process.emit("unhandledRejection", reason, promise);
                    reportedUnhandledRejections.push(promise);
                }
            });
        }

        unhandledRejections.push(promise);
        if (reason && typeof reason.stack !== "undefined") {
            unhandledReasons.push(reason.stack);
        } else {
            unhandledReasons.push("(no stack) " + reason);
        }
    }

    function untrackRejection(promise) {
        if (!trackUnhandledRejections) {
            return;
        }

        var at = array_indexOf(unhandledRejections, promise);
        if (at !== -1) {
            if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && typeof process.emit === "function") {
                Q.nextTick.runAfter(function () {
                    var atReport = array_indexOf(reportedUnhandledRejections, promise);
                    if (atReport !== -1) {
                        process.emit("rejectionHandled", unhandledReasons[at], promise);
                        reportedUnhandledRejections.splice(atReport, 1);
                    }
                });
            }
            unhandledRejections.splice(at, 1);
            unhandledReasons.splice(at, 1);
        }
    }

    Q.resetUnhandledRejections = resetUnhandledRejections;

    Q.getUnhandledReasons = function () {
        // Make a copy so that consumers can't interfere with our internal state.
        return unhandledReasons.slice();
    };

    Q.stopUnhandledRejectionTracking = function () {
        resetUnhandledRejections();
        trackUnhandledRejections = false;
    };

    resetUnhandledRejections();

    //// END UNHANDLED REJECTION TRACKING

    /**
     * Constructs a rejected promise.
     * @param reason value describing the failure
     */
    Q.reject = reject;
    function reject(reason) {
        var rejection = Promise({
            "when": function when(rejected) {
                // note that the error has been handled
                if (rejected) {
                    untrackRejection(this);
                }
                return rejected ? rejected(reason) : this;
            }
        }, function fallback() {
            return this;
        }, function inspect() {
            return { state: "rejected", reason: reason };
        });

        // Note that the reason has not been handled.
        trackRejection(rejection, reason);

        return rejection;
    }

    /**
     * Constructs a fulfilled promise for an immediate reference.
     * @param value immediate reference
     */
    Q.fulfill = fulfill;
    function fulfill(value) {
        return Promise({
            "when": function when() {
                return value;
            },
            "get": function get(name) {
                return value[name];
            },
            "set": function set(name, rhs) {
                value[name] = rhs;
            },
            "delete": function _delete(name) {
                delete value[name];
            },
            "post": function post(name, args) {
                // Mark Miller proposes that post with no name should apply a
                // promised function.
                if (name === null || name === void 0) {
                    return value.apply(void 0, args);
                } else {
                    return value[name].apply(value, args);
                }
            },
            "apply": function apply(thisp, args) {
                return value.apply(thisp, args);
            },
            "keys": function keys() {
                return object_keys(value);
            }
        }, void 0, function inspect() {
            return { state: "fulfilled", value: value };
        });
    }

    /**
     * Converts thenables to Q promises.
     * @param promise thenable promise
     * @returns a Q promise
     */
    function coerce(promise) {
        var deferred = defer();
        Q.nextTick(function () {
            try {
                promise.then(deferred.resolve, deferred.reject, deferred.notify);
            } catch (exception) {
                deferred.reject(exception);
            }
        });
        return deferred.promise;
    }

    /**
     * Annotates an object such that it will never be
     * transferred away from this process over any promise
     * communication channel.
     * @param object
     * @returns promise a wrapping of that object that
     * additionally responds to the "isDef" message
     * without a rejection.
     */
    Q.master = master;
    function master(object) {
        return Promise({
            "isDef": function isDef() {}
        }, function fallback(op, args) {
            return dispatch(object, op, args);
        }, function () {
            return Q(object).inspect();
        });
    }

    /**
     * Spreads the values of a promised array of arguments into the
     * fulfillment callback.
     * @param fulfilled callback that receives variadic arguments from the
     * promised array
     * @param rejected callback that receives the exception if the promise
     * is rejected.
     * @returns a promise for the return value or thrown exception of
     * either callback.
     */
    Q.spread = spread;
    function spread(value, fulfilled, rejected) {
        return Q(value).spread(fulfilled, rejected);
    }

    Promise.prototype.spread = function (fulfilled, rejected) {
        return this.all().then(function (array) {
            return fulfilled.apply(void 0, array);
        }, rejected);
    };

    /**
     * The async function is a decorator for generator functions, turning
     * them into asynchronous generators.  Although generators are only part
     * of the newest ECMAScript 6 drafts, this code does not cause syntax
     * errors in older engines.  This code should continue to work and will
     * in fact improve over time as the language improves.
     *
     * ES6 generators are currently part of V8 version 3.19 with the
     * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
     * for longer, but under an older Python-inspired form.  This function
     * works on both kinds of generators.
     *
     * Decorates a generator function such that:
     *  - it may yield promises
     *  - execution will continue when that promise is fulfilled
     *  - the value of the yield expression will be the fulfilled value
     *  - it returns a promise for the return value (when the generator
     *    stops iterating)
     *  - the decorated function returns a promise for the return value
     *    of the generator or the first rejected promise among those
     *    yielded.
     *  - if an error is thrown in the generator, it propagates through
     *    every following yield until it is caught, or until it escapes
     *    the generator function altogether, and is translated into a
     *    rejection for the promise returned by the decorated generator.
     */
    Q.async = async;
    function async(makeGenerator) {
        return function () {
            // when verb is "send", arg is a value
            // when verb is "throw", arg is an exception
            function continuer(verb, arg) {
                var result;

                // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
                // engine that has a deployed base of browsers that support generators.
                // However, SM's generators use the Python-inspired semantics of
                // outdated ES6 drafts.  We would like to support ES6, but we'd also
                // like to make it possible to use generators in deployed browsers, so
                // we also support Python-style generators.  At some point we can remove
                // this block.

                if (typeof StopIteration === "undefined") {
                    // ES6 Generators
                    try {
                        result = generator[verb](arg);
                    } catch (exception) {
                        return reject(exception);
                    }
                    if (result.done) {
                        return Q(result.value);
                    } else {
                        return when(result.value, callback, errback);
                    }
                } else {
                    // SpiderMonkey Generators
                    // FIXME: Remove this case when SM does ES6 generators.
                    try {
                        result = generator[verb](arg);
                    } catch (exception) {
                        if (isStopIteration(exception)) {
                            return Q(exception.value);
                        } else {
                            return reject(exception);
                        }
                    }
                    return when(result, callback, errback);
                }
            }
            var generator = makeGenerator.apply(this, arguments);
            var callback = continuer.bind(continuer, "next");
            var errback = continuer.bind(continuer, "throw");
            return callback();
        };
    }

    /**
     * The spawn function is a small wrapper around async that immediately
     * calls the generator and also ends the promise chain, so that any
     * unhandled errors are thrown instead of forwarded to the error
     * handler. This is useful because it's extremely common to run
     * generators at the top-level to work with libraries.
     */
    Q.spawn = spawn;
    function spawn(makeGenerator) {
        Q.done(Q.async(makeGenerator)());
    }

    // FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
    /**
     * Throws a ReturnValue exception to stop an asynchronous generator.
     *
     * This interface is a stop-gap measure to support generator return
     * values in older Firefox/SpiderMonkey.  In browsers that support ES6
     * generators like Chromium 29, just use "return" in your generator
     * functions.
     *
     * @param value the return value for the surrounding generator
     * @throws ReturnValue exception with the value.
     * @example
     * // ES6 style
     * Q.async(function* () {
     *      var foo = yield getFooPromise();
     *      var bar = yield getBarPromise();
     *      return foo + bar;
     * })
     * // Older SpiderMonkey style
     * Q.async(function () {
     *      var foo = yield getFooPromise();
     *      var bar = yield getBarPromise();
     *      Q.return(foo + bar);
     * })
     */
    Q["return"] = _return;
    function _return(value) {
        throw new QReturnValue(value);
    }

    /**
     * The promised function decorator ensures that any promise arguments
     * are settled and passed as values (`this` is also settled and passed
     * as a value).  It will also ensure that the result of a function is
     * always a promise.
     *
     * @example
     * var add = Q.promised(function (a, b) {
     *     return a + b;
     * });
     * add(Q(a), Q(B));
     *
     * @param {function} callback The function to decorate
     * @returns {function} a function that has been decorated.
     */
    Q.promised = promised;
    function promised(callback) {
        return function () {
            return spread([this, all(arguments)], function (self, args) {
                return callback.apply(self, args);
            });
        };
    }

    /**
     * sends a message to a value in a future turn
     * @param object* the recipient
     * @param op the name of the message operation, e.g., "when",
     * @param args further arguments to be forwarded to the operation
     * @returns result {Promise} a promise for the result of the operation
     */
    Q.dispatch = dispatch;
    function dispatch(object, op, args) {
        return Q(object).dispatch(op, args);
    }

    Promise.prototype.dispatch = function (op, args) {
        var self = this;
        var deferred = defer();
        Q.nextTick(function () {
            self.promiseDispatch(deferred.resolve, op, args);
        });
        return deferred.promise;
    };

    /**
     * Gets the value of a property in a future turn.
     * @param object    promise or immediate reference for target object
     * @param name      name of property to get
     * @return promise for the property value
     */
    Q.get = function (object, key) {
        return Q(object).dispatch("get", [key]);
    };

    Promise.prototype.get = function (key) {
        return this.dispatch("get", [key]);
    };

    /**
     * Sets the value of a property in a future turn.
     * @param object    promise or immediate reference for object object
     * @param name      name of property to set
     * @param value     new value of property
     * @return promise for the return value
     */
    Q.set = function (object, key, value) {
        return Q(object).dispatch("set", [key, value]);
    };

    Promise.prototype.set = function (key, value) {
        return this.dispatch("set", [key, value]);
    };

    /**
     * Deletes a property in a future turn.
     * @param object    promise or immediate reference for target object
     * @param name      name of property to delete
     * @return promise for the return value
     */
    Q.del = // XXX legacy
    Q["delete"] = function (object, key) {
        return Q(object).dispatch("delete", [key]);
    };

    Promise.prototype.del = // XXX legacy
    Promise.prototype["delete"] = function (key) {
        return this.dispatch("delete", [key]);
    };

    /**
     * Invokes a method in a future turn.
     * @param object    promise or immediate reference for target object
     * @param name      name of method to invoke
     * @param value     a value to post, typically an array of
     *                  invocation arguments for promises that
     *                  are ultimately backed with `resolve` values,
     *                  as opposed to those backed with URLs
     *                  wherein the posted value can be any
     *                  JSON serializable object.
     * @return promise for the return value
     */
    // bound locally because it is used by other methods
    Q.mapply = // XXX As proposed by "Redsandro"
    Q.post = function (object, name, args) {
        return Q(object).dispatch("post", [name, args]);
    };

    Promise.prototype.mapply = // XXX As proposed by "Redsandro"
    Promise.prototype.post = function (name, args) {
        return this.dispatch("post", [name, args]);
    };

    /**
     * Invokes a method in a future turn.
     * @param object    promise or immediate reference for target object
     * @param name      name of method to invoke
     * @param ...args   array of invocation arguments
     * @return promise for the return value
     */
    Q.send = // XXX Mark Miller's proposed parlance
    Q.mcall = // XXX As proposed by "Redsandro"
    Q.invoke = function (object, name /*...args*/) {
        return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
    };

    Promise.prototype.send = // XXX Mark Miller's proposed parlance
    Promise.prototype.mcall = // XXX As proposed by "Redsandro"
    Promise.prototype.invoke = function (name /*...args*/) {
        return this.dispatch("post", [name, array_slice(arguments, 1)]);
    };

    /**
     * Applies the promised function in a future turn.
     * @param object    promise or immediate reference for target function
     * @param args      array of application arguments
     */
    Q.fapply = function (object, args) {
        return Q(object).dispatch("apply", [void 0, args]);
    };

    Promise.prototype.fapply = function (args) {
        return this.dispatch("apply", [void 0, args]);
    };

    /**
     * Calls the promised function in a future turn.
     * @param object    promise or immediate reference for target function
     * @param ...args   array of application arguments
     */
    Q["try"] = Q.fcall = function (object /* ...args*/) {
        return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
    };

    Promise.prototype.fcall = function () /*...args*/{
        return this.dispatch("apply", [void 0, array_slice(arguments)]);
    };

    /**
     * Binds the promised function, transforming return values into a fulfilled
     * promise and thrown errors into a rejected one.
     * @param object    promise or immediate reference for target function
     * @param ...args   array of application arguments
     */
    Q.fbind = function (object /*...args*/) {
        var promise = Q(object);
        var args = array_slice(arguments, 1);
        return function fbound() {
            return promise.dispatch("apply", [this, args.concat(array_slice(arguments))]);
        };
    };
    Promise.prototype.fbind = function () /*...args*/{
        var promise = this;
        var args = array_slice(arguments);
        return function fbound() {
            return promise.dispatch("apply", [this, args.concat(array_slice(arguments))]);
        };
    };

    /**
     * Requests the names of the owned properties of a promised
     * object in a future turn.
     * @param object    promise or immediate reference for target object
     * @return promise for the keys of the eventually settled object
     */
    Q.keys = function (object) {
        return Q(object).dispatch("keys", []);
    };

    Promise.prototype.keys = function () {
        return this.dispatch("keys", []);
    };

    /**
     * Turns an array of promises into a promise for an array.  If any of
     * the promises gets rejected, the whole array is rejected immediately.
     * @param {Array*} an array (or promise for an array) of values (or
     * promises for values)
     * @returns a promise for an array of the corresponding values
     */
    // By Mark Miller
    // http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
    Q.all = all;
    function all(promises) {
        return when(promises, function (promises) {
            var pendingCount = 0;
            var deferred = defer();
            array_reduce(promises, function (undefined, promise, index) {
                var snapshot;
                if (isPromise(promise) && (snapshot = promise.inspect()).state === "fulfilled") {
                    promises[index] = snapshot.value;
                } else {
                    ++pendingCount;
                    when(promise, function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    }, deferred.reject, function (progress) {
                        deferred.notify({ index: index, value: progress });
                    });
                }
            }, void 0);
            if (pendingCount === 0) {
                deferred.resolve(promises);
            }
            return deferred.promise;
        });
    }

    Promise.prototype.all = function () {
        return all(this);
    };

    /**
     * Returns the first resolved promise of an array. Prior rejected promises are
     * ignored.  Rejects only if all promises are rejected.
     * @param {Array*} an array containing values or promises for values
     * @returns a promise fulfilled with the value of the first resolved promise,
     * or a rejected promise if all promises are rejected.
     */
    Q.any = any;

    function any(promises) {
        if (promises.length === 0) {
            return Q.resolve();
        }

        var deferred = Q.defer();
        var pendingCount = 0;
        array_reduce(promises, function (prev, current, index) {
            var promise = promises[index];

            pendingCount++;

            when(promise, onFulfilled, onRejected, onProgress);
            function onFulfilled(result) {
                deferred.resolve(result);
            }
            function onRejected() {
                pendingCount--;
                if (pendingCount === 0) {
                    deferred.reject(new Error("Can't get fulfillment value from any promise, all " + "promises were rejected."));
                }
            }
            function onProgress(progress) {
                deferred.notify({
                    index: index,
                    value: progress
                });
            }
        }, undefined);

        return deferred.promise;
    }

    Promise.prototype.any = function () {
        return any(this);
    };

    /**
     * Waits for all promises to be settled, either fulfilled or
     * rejected.  This is distinct from `all` since that would stop
     * waiting at the first rejection.  The promise returned by
     * `allResolved` will never be rejected.
     * @param promises a promise for an array (or an array) of promises
     * (or values)
     * @return a promise for an array of promises
     */
    Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
    function allResolved(promises) {
        return when(promises, function (promises) {
            promises = array_map(promises, Q);
            return when(all(array_map(promises, function (promise) {
                return when(promise, noop, noop);
            })), function () {
                return promises;
            });
        });
    }

    Promise.prototype.allResolved = function () {
        return allResolved(this);
    };

    /**
     * @see Promise#allSettled
     */
    Q.allSettled = allSettled;
    function allSettled(promises) {
        return Q(promises).allSettled();
    }

    /**
     * Turns an array of promises into a promise for an array of their states (as
     * returned by `inspect`) when they have all settled.
     * @param {Array[Any*]} values an array (or promise for an array) of values (or
     * promises for values)
     * @returns {Array[State]} an array of states for the respective values.
     */
    Promise.prototype.allSettled = function () {
        return this.then(function (promises) {
            return all(array_map(promises, function (promise) {
                promise = Q(promise);
                function regardless() {
                    return promise.inspect();
                }
                return promise.then(regardless, regardless);
            }));
        });
    };

    /**
     * Captures the failure of a promise, giving an oportunity to recover
     * with a callback.  If the given promise is fulfilled, the returned
     * promise is fulfilled.
     * @param {Any*} promise for something
     * @param {Function} callback to fulfill the returned promise if the
     * given promise is rejected
     * @returns a promise for the return value of the callback
     */
    Q.fail = // XXX legacy
    Q["catch"] = function (object, rejected) {
        return Q(object).then(void 0, rejected);
    };

    Promise.prototype.fail = // XXX legacy
    Promise.prototype["catch"] = function (rejected) {
        return this.then(void 0, rejected);
    };

    /**
     * Attaches a listener that can respond to progress notifications from a
     * promise's originating deferred. This listener receives the exact arguments
     * passed to ``deferred.notify``.
     * @param {Any*} promise for something
     * @param {Function} callback to receive any progress notifications
     * @returns the given promise, unchanged
     */
    Q.progress = progress;
    function progress(object, progressed) {
        return Q(object).then(void 0, void 0, progressed);
    }

    Promise.prototype.progress = function (progressed) {
        return this.then(void 0, void 0, progressed);
    };

    /**
     * Provides an opportunity to observe the settling of a promise,
     * regardless of whether the promise is fulfilled or rejected.  Forwards
     * the resolution to the returned promise when the callback is done.
     * The callback can return a promise to defer completion.
     * @param {Any*} promise
     * @param {Function} callback to observe the resolution of the given
     * promise, takes no arguments.
     * @returns a promise for the resolution of the given promise when
     * ``fin`` is done.
     */
    Q.fin = // XXX legacy
    Q["finally"] = function (object, callback) {
        return Q(object)["finally"](callback);
    };

    Promise.prototype.fin = // XXX legacy
    Promise.prototype["finally"] = function (callback) {
        callback = Q(callback);
        return this.then(function (value) {
            return callback.fcall().then(function () {
                return value;
            });
        }, function (reason) {
            // TODO attempt to recycle the rejection with "this".
            return callback.fcall().then(function () {
                throw reason;
            });
        });
    };

    /**
     * Terminates a chain of promises, forcing rejections to be
     * thrown as exceptions.
     * @param {Any*} promise at the end of a chain of promises
     * @returns nothing
     */
    Q.done = function (object, fulfilled, rejected, progress) {
        return Q(object).done(fulfilled, rejected, progress);
    };

    Promise.prototype.done = function (fulfilled, rejected, progress) {
        var onUnhandledError = function onUnhandledError(error) {
            // forward to a future turn so that ``when``
            // does not catch it and turn it into a rejection.
            Q.nextTick(function () {
                makeStackTraceLong(error, promise);
                if (Q.onerror) {
                    Q.onerror(error);
                } else {
                    throw error;
                }
            });
        };

        // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
        var promise = fulfilled || rejected || progress ? this.then(fulfilled, rejected, progress) : this;

        if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process && process.domain) {
            onUnhandledError = process.domain.bind(onUnhandledError);
        }

        promise.then(void 0, onUnhandledError);
    };

    /**
     * Causes a promise to be rejected if it does not get fulfilled before
     * some milliseconds time out.
     * @param {Any*} promise
     * @param {Number} milliseconds timeout
     * @param {Any*} custom error message or Error object (optional)
     * @returns a promise for the resolution of the given promise if it is
     * fulfilled before the timeout, otherwise rejected.
     */
    Q.timeout = function (object, ms, error) {
        return Q(object).timeout(ms, error);
    };

    Promise.prototype.timeout = function (ms, error) {
        var deferred = defer();
        var timeoutId = setTimeout(function () {
            if (!error || "string" === typeof error) {
                error = new Error(error || "Timed out after " + ms + " ms");
                error.code = "ETIMEDOUT";
            }
            deferred.reject(error);
        }, ms);

        this.then(function (value) {
            clearTimeout(timeoutId);
            deferred.resolve(value);
        }, function (exception) {
            clearTimeout(timeoutId);
            deferred.reject(exception);
        }, deferred.notify);

        return deferred.promise;
    };

    /**
     * Returns a promise for the given value (or promised value), some
     * milliseconds after it resolved. Passes rejections immediately.
     * @param {Any*} promise
     * @param {Number} milliseconds
     * @returns a promise for the resolution of the given promise after milliseconds
     * time has elapsed since the resolution of the given promise.
     * If the given promise rejects, that is passed immediately.
     */
    Q.delay = function (object, timeout) {
        if (timeout === void 0) {
            timeout = object;
            object = void 0;
        }
        return Q(object).delay(timeout);
    };

    Promise.prototype.delay = function (timeout) {
        return this.then(function (value) {
            var deferred = defer();
            setTimeout(function () {
                deferred.resolve(value);
            }, timeout);
            return deferred.promise;
        });
    };

    /**
     * Passes a continuation to a Node function, which is called with the given
     * arguments provided as an array, and returns a promise.
     *
     *      Q.nfapply(FS.readFile, [__filename])
     *      .then(function (content) {
     *      })
     *
     */
    Q.nfapply = function (callback, args) {
        return Q(callback).nfapply(args);
    };

    Promise.prototype.nfapply = function (args) {
        var deferred = defer();
        var nodeArgs = array_slice(args);
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };

    /**
     * Passes a continuation to a Node function, which is called with the given
     * arguments provided individually, and returns a promise.
     * @example
     * Q.nfcall(FS.readFile, __filename)
     * .then(function (content) {
     * })
     *
     */
    Q.nfcall = function (callback /*...args*/) {
        var args = array_slice(arguments, 1);
        return Q(callback).nfapply(args);
    };

    Promise.prototype.nfcall = function () /*...args*/{
        var nodeArgs = array_slice(arguments);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };

    /**
     * Wraps a NodeJS continuation passing function and returns an equivalent
     * version that returns a promise.
     * @example
     * Q.nfbind(FS.readFile, __filename)("utf-8")
     * .then(console.log)
     * .done()
     */
    Q.nfbind = Q.denodeify = function (callback /*...args*/) {
        var baseArgs = array_slice(arguments, 1);
        return function () {
            var nodeArgs = baseArgs.concat(array_slice(arguments));
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            Q(callback).fapply(nodeArgs).fail(deferred.reject);
            return deferred.promise;
        };
    };

    Promise.prototype.nfbind = Promise.prototype.denodeify = function () /*...args*/{
        var args = array_slice(arguments);
        args.unshift(this);
        return Q.denodeify.apply(void 0, args);
    };

    Q.nbind = function (callback, thisp /*...args*/) {
        var baseArgs = array_slice(arguments, 2);
        return function () {
            var nodeArgs = baseArgs.concat(array_slice(arguments));
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            function bound() {
                return callback.apply(thisp, arguments);
            }
            Q(bound).fapply(nodeArgs).fail(deferred.reject);
            return deferred.promise;
        };
    };

    Promise.prototype.nbind = function () /*thisp, ...args*/{
        var args = array_slice(arguments, 0);
        args.unshift(this);
        return Q.nbind.apply(void 0, args);
    };

    /**
     * Calls a method of a Node-style object that accepts a Node-style
     * callback with a given array of arguments, plus a provided callback.
     * @param object an object that has the named method
     * @param {String} name name of the method of object
     * @param {Array} args arguments to pass to the method; the callback
     * will be provided by Q and appended to these arguments.
     * @returns a promise for the value or error
     */
    Q.nmapply = // XXX As proposed by "Redsandro"
    Q.npost = function (object, name, args) {
        return Q(object).npost(name, args);
    };

    Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
    Promise.prototype.npost = function (name, args) {
        var nodeArgs = array_slice(args || []);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
        return deferred.promise;
    };

    /**
     * Calls a method of a Node-style object that accepts a Node-style
     * callback, forwarding the given variadic arguments, plus a provided
     * callback argument.
     * @param object an object that has the named method
     * @param {String} name name of the method of object
     * @param ...args arguments to pass to the method; the callback will
     * be provided by Q and appended to these arguments.
     * @returns a promise for the value or error
     */
    Q.nsend = // XXX Based on Mark Miller's proposed "send"
    Q.nmcall = // XXX Based on "Redsandro's" proposal
    Q.ninvoke = function (object, name /*...args*/) {
        var nodeArgs = array_slice(arguments, 2);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
        return deferred.promise;
    };

    Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
    Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
    Promise.prototype.ninvoke = function (name /*...args*/) {
        var nodeArgs = array_slice(arguments, 1);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
        return deferred.promise;
    };

    /**
     * If a function would like to support both Node continuation-passing-style and
     * promise-returning-style, it can end its internal promise chain with
     * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
     * elects to use a nodeback, the result will be sent there.  If they do not
     * pass a nodeback, they will receive the result promise.
     * @param object a result (or a promise for a result)
     * @param {Function} nodeback a Node.js-style callback
     * @returns either the promise or nothing
     */
    Q.nodeify = nodeify;
    function nodeify(object, nodeback) {
        return Q(object).nodeify(nodeback);
    }

    Promise.prototype.nodeify = function (nodeback) {
        if (nodeback) {
            this.then(function (value) {
                Q.nextTick(function () {
                    nodeback(null, value);
                });
            }, function (error) {
                Q.nextTick(function () {
                    nodeback(error);
                });
            });
        } else {
            return this;
        }
    };

    Q.noConflict = function () {
        throw new Error("Q.noConflict only works when Q is used as a global");
    };

    // All code before this point will be filtered from stack traces.
    var qEndingLine = captureLine();

    return Q;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 11 */
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
/* 12 */
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
/* 13 */
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = XMLHttpRequest;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localStorage = __webpack_require__(8);

var _localStorage2 = _interopRequireDefault(_localStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _localStorage2.default;

// import {AsyncStorage} from 'react-native';

// export default class localStorage{
// 	constructor(){

// 	}

// 	getItem(key){
// 		AsyncStorage.getItem(key).then((value) => {
// 	    	return {key:value};
// 	    });
// 	}

// 	setItem(key, data){
// 		return AsyncStorage.setItem(key, data);
// 	}	
// }

/***/ }),
/* 17 */
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
		"localStorage": "1.0.3",
		"q": "1.4.1",
		"when": "3.7.8",
		"xmlhttprequest": "1.8.0"
	}
};

/***/ })
/******/ ]);