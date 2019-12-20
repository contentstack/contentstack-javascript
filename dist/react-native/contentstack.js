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
/******/ 	return __webpack_require__(__webpack_require__.s = 35);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.transform = transform;
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

var _request = __webpack_require__(4);

var _request2 = _interopRequireDefault(_request);

var _result = __webpack_require__(37);

var _result2 = _interopRequireDefault(_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @method addSpread
 * @description method to add the spread.
 */
(function addSpread() {
    if (Promise.prototype.spread) return;
    Promise.prototype.spread = function (fn, errFunc) {
        errFunc = errFunc || function (err) {};
        return this.then(function (args) {
            return fn.apply(fn, args);
        }).catch(function (err) {
            errFunc(err);
        });
    };
})();

function transform(type) {
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
                    var _query2 = this._query[type][arguments[0]] || [];
                    _query2 = _query2.concat(arguments[1]);
                    this._query[type][arguments[0]] = _query2;
                    return this;
                } else {
                    console.error("Kindly provide valid parameters");
                }
                break;
            default:
                console.error("Kindly provide valid parameters");
        }
    };
}

function _type(val) {
    var _typeof = void 0,
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
            asset_uid: queryObject.asset_uid,
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
        if (query.asset_uid) keyArray.push(query.asset_uid);
        keyArray.push(hashValue);
        return keyArray.join('.');
    } catch (e) {}
};

// return the hash value of the string
function generateHash(str) {
    var hash = 0,
        i = void 0,
        chr = void 0,
        len = void 0;
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
    if (result && typeof result.entries !== 'undefined') {
        if (result.entries && result.entries.length) {
            for (var i = 0, _i = result.entries.length; i < _i; i++) {
                result.entries[i] = (0, _result2.default)(result.entries[i]);
            }
        } else {
            result.entries = [];
        }
    } else if (result && result.assets && typeof result.assets !== 'undefined') {
        if (result.assets && result.assets.length) {
            for (var j = 0, _j = result.assets.length; j < _j; j++) {
                result.assets[j] = (0, _result2.default)(result.assets[j]);
            }
        } else {
            result.assets = [];
        }
    } else if (result && typeof result.entry !== 'undefined') {
        result.entry = (0, _result2.default)(result.entry);
    } else if (result && typeof result.asset !== 'undefined') {
        result.asset = (0, _result2.default)(result.asset);
    } else if (result && typeof result.items !== 'undefined') {
        result.items = (0, _result2.default)(result.items).toJSON();
    }

    return result;
};

// // spread the result object
// export function spreadResult(result) {
//     let _results = [];
//     if (result && Object.keys(result).length) {
//         if (typeof result.entries !== 'undefined') _results.push(result.entries);
//         if (typeof result.assets !== 'undefined') _results.push(result.assets);
//         if (typeof result.content_type !== 'undefined' || typeof result.schema !== 'undefined') _results.push(result.content_type || result.schema);
//         if (typeof result.count !== 'undefined') _results.push(result.count);
//         if (typeof result.entry !== 'undefined') _results = result.entry;
//         if (typeof result.asset !== 'undefined') _results = result.asset;
//         if (typeof result.items !== 'undefined') _results.push(result);
//     }
//     return _results;
// };

// spread the result object
function spreadResult(result) {
    var _results = [];
    if (result && Object.keys(result).length) {
        if (typeof result.entries !== 'undefined') {
            _results.push(result.entries);
            if (result.content_type) {
                _results['schema'] = result.content_type;
            }
        }
        if (typeof result.assets !== 'undefined') _results.push(result.assets);
        if (typeof result.content_type !== 'undefined' || typeof result.schema !== 'undefined') _results.push(result.content_type || result.schema);
        if (typeof result.count !== 'undefined') _results.push(result.count);
        if (typeof result.entry !== 'undefined') {
            _results = result.entry;
            if (result.schema) {
                _results['schema'] = result.schema;
            }
        }
        if (typeof result.asset !== 'undefined') _results = result.asset;
        if (typeof result.items !== 'undefined') _results.push(result);
    }
    return _results;
};

function sendRequest(queryObject) {

    var env_uid = queryObject.environment_uid;
    if (env_uid) {
        queryObject._query.environment_uid = env_uid;
    } else {
        if (queryObject._query) {
            queryObject._query.environment = queryObject.environment;
        } else {
            queryObject['_query'] = {};
            queryObject._query['environment'] = queryObject.environment;
        }
    }

    var self = queryObject;
    var continueFlag = false;
    var cachePolicy = typeof self.queryCachePolicy !== 'undefined' ? self.queryCachePolicy : self.cachePolicy;
    var tojson = typeof self.tojson !== 'undefined' ? self.tojson : false;
    var isSingle = self.entry_uid || self.singleEntry || self.asset_uid ? true : false;
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
                    self.entry_uid = self.asset_uid = self.tojson = self.queryCachePolicy = undefined;
                    var entries = {};
                    var syncstack = {};
                    if (queryObject.singleEntry) {
                        queryObject.singleEntry = false;
                        if (data.schema) entries.schema = data.schema;
                        if (data.content_type) {
                            entries.content_type = data.content_type;
                            delete entries.schema;
                        }
                        if (data.entries && data.entries.length) {
                            entries.entry = data.entries[0];
                        } else if (data.assets && data.assets.length) {
                            entries.assets = data.assets[0];
                        } else {
                            if (cachePolicy === 2 && self.provider !== null) {
                                self.provider.get(hashQuery, getCacheCallback());
                            } else {
                                return reject({ error_code: 141, error_message: 'The requested entry doesn\'t exist.' });
                            }
                            return;
                        }
                    } else if (data.items) {
                        syncstack = {
                            items: data.items,
                            pagination_token: data.pagination_token,
                            sync_token: data.sync_token,
                            total_count: data.total_count
                        };
                    } else {
                        entries = data;
                    }

                    if (cachePolicy !== -1 && self.provider !== null) {
                        self.provider.set(hashQuery, entries, function (err) {
                            try {
                                if (err) throw err;
                                if (!tojson) entries = resultWrapper(entries);
                                return resolve(spreadResult(entries));
                            } catch (e) {
                                return reject(e);
                            }
                        });
                        return resolve(spreadResult(entries));
                    }

                    if (Object.keys(syncstack).length) {
                        return resolve(syncstack);
                    }

                    if (!tojson) entries = resultWrapper(entries);
                    return resolve(spreadResult(entries));
                } catch (e) {
                    return reject({
                        message: e.message
                    });
                }
            }.bind(self)).catch(function (error) {
                if (cachePolicy === 2 && self.provider !== null) {
                    self.provider.get(hashQuery, getCacheCallback());
                } else {
                    return reject(error);
                }
            });
        }
    };
    switch (cachePolicy) {
        case 1:
            return new Promise(function (resolve, reject) {
                if (self.provider !== null) {
                    self.provider.get(hashQuery, function (err, _data) {
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
                } else {
                    callback(true, resolve, reject);
                }
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

    if (cachePolicy === 3) {

        var promise = new Promise(function (resolve, reject) {
            if (self.provider !== null) {
                self.provider.get(hashQuery, function (err, _data) {
                    try {
                        if (err || !_data) {
                            reject(err);
                            //reject(Error("It broke"));
                        } else {
                            if (!tojson) _data = resultWrapper(_data);
                            resolve(spreadResult(_data));
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        });

        return promise.then(function () {
            return new Promise(function (resolve, reject) {
                callback(true, resolve, reject);
            });
        }).catch(function (error) {
            return new Promise(function (resolve, reject) {
                callback(true, resolve, reject);
            });
            console.error(error);
        });
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/*import Sync from './modules/sync';*/


var _config = __webpack_require__(11);

var _config2 = _interopRequireDefault(_config);

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _entry = __webpack_require__(7);

var _entry2 = _interopRequireDefault(_entry);

var _assets = __webpack_require__(36);

var _assets2 = _interopRequireDefault(_assets);

var _query = __webpack_require__(8);

var _query2 = _interopRequireDefault(_query);

var _request = __webpack_require__(4);

var _request2 = _interopRequireDefault(_request);

var _cache = __webpack_require__(6);

var cache = _interopRequireWildcard(_cache);

var _index = __webpack_require__(5);

var _index2 = _interopRequireDefault(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
     * @class 
        Stack 
     * @description Initialize an instance of ‘Stack’
     * @example
     * var Stack = Contentstack.Stack('api_key', 'delivery_token', 'environment');
                 OR
     * var Stack = Contentstack.Stack({
     *    'api_key':'stack_api_key',
     *   'access_token':'stack_delivery_token',
     *    'environment':'environment_name'
     * });
     *
     * @returns {Stack}
     * @instance
     */
var Stack = function () {
    function Stack() {
        _classCallCheck(this, Stack);

        for (var _len = arguments.length, stack_arguments = Array(_len), _key = 0; _key < _len; _key++) {
            stack_arguments[_key] = arguments[_key];
        }

        if (stack_arguments[0].region && stack_arguments[0].region != undefined && stack_arguments[0].region != "us") {
            _config2.default['host'] = stack_arguments[0].region + "-" + "cdn.contentstack.com";
        }
        this.config = _config2.default;
        this.cachePolicy = _index2.default.policies.IGNORE_CACHE;
        this.provider = _index2.default.providers('localstorage');
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
     * @memberOf Stack
     * @description Sets the port of the host
     * @param {Number} port - Port Number
     * @return {Stack}
     * @instance
     * */


    _createClass(Stack, [{
        key: 'setPort',
        value: function setPort(port) {
            if (typeof port === "number") this.config.port = port;
            return this;
        }

        /**
         * @method setProtocol
         * @memberOf Stack
         * @description Sets the protocol for the host
         * @param {String} protocol - http/https protocol
         * @return {Stack}
         * @instance
         * */

    }, {
        key: 'setProtocol',
        value: function setProtocol(protocol) {
            if (typeof protocol === "string" && ~["https", "http"].indexOf(protocol)) this.config.protocol = protocol;
            return this;
        }

        /**
         * @method setHost
         * @memberOf Stack
         * @description Sets the host of the API server
         * @param {String} host - valid ip or host
         * @return {Stack}
         * @instance
         * */

    }, {
        key: 'setHost',
        value: function setHost(host) {
            if (typeof host === "string" && host) this.config.host = host;
            return this;
        }

        /**
         * @method setCachePolicy
         * @memberOf Stack
         * @description Allows you to set cache policies
         * @param {Constant} [key=ONLY_NETWORK] - Cache policy to be applied on Stack or Query.
         * @example
         * Stack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
         * Stack.setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK)
         * Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK)
         * Stack.setCachePolicy(Contentstack.CachePolicy.NETWORK_ELSE_CACHE)
         * Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK)
         * @returns {Stack}
         * @instance
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
        * @memberOf Stack
        * @description Allows you to set an object of the cache provider
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
        * @instance
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
         * @memberOf Stack
         * @description 'clearByQuery' function to clear the query from the cache.
         * @example
         * Stack.clearQuery(query, callback);
         * @returns {Stack}
         * @instance
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
         * @memberOf Stack
         * @description 'clearByContentType' function to clear the query from the cache by specified content type.
         * @example
         * Stack.clearByContentType(content_type_uid, callback);
         * Stack.clearByContentType(content_type_uid, language_uid, callback);
         * @returns {Stack}
         * @instance
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
         * @memberOf Stack
         * @description 'clearAll' function to clear all the queries from cache.
         * @example
         * Stack.clearAll(callback);
         * @returns {Stack}
         * @instance   
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
          * @memberOf Stack
          * @description Returns the currently set object of 'CacheProvider'
          * @example Stack.getCacheProvider();
          * @returns {Stack}
          * @instance
          */

    }, {
        key: 'getCacheProvider',
        value: function getCacheProvider() {
            return this.provider;
        }

        /**
          * @method ContentType
          * @memberOf Stack
          * @description Set the content type of which you want to retrieve the entries
          * @param {String} [content_type_uid] - uid of the existing content type
          * @example 
          * let data = Stack.ContentType('blog').Query().toJSON().find()
          *      data
          *      .then(function(result) {
          *           // 'result' content the list of entries of particular content type blog.       
          *      }, function(error) {
          *           // error function
          *      })
          * @returns {Stack}
          * @instance
          */

    }, {
        key: 'ContentType',
        value: function ContentType(uid) {
            if (uid && typeof uid === 'string') {
                this.content_type_uid = uid;
                this.type = "contentType";
            }
            return this;
        }

        /**
            * @method Entry
            * @memberOf Stack
            * @param {String} uid - uid of the entry 
            * @description An initializer is responsible for creating Entry object
            * @returns {Entry}
            * @instance 
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
        * @method fetch
        * @memberOf Stack
        * @description This method returns the complete information of a specific content type.
        * @example
        * let single_contenttype = Stack.ContentType(content_type_uid).fetch()
        *    single_contenttype
        *    .then(function(result) {
        *      // 'result' is a single contentType information.       
        *     }).catch((error) => {
        *        console.log(error)
        *  });
        * @returns {ContentType}
        * @instance 
        */

    }, {
        key: 'fetch',
        value: function fetch() {
            var result = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid,
                body: {
                    _method: 'GET',
                    environment: this.environment
                }
            };
            return (0, _request2.default)(result);
        }

        /**
           * @method Assets
           * @memberOf Stack
           * @param {String} uid - uid of the asset 
           * @description Retrieves all assets of a stack by default. To retrieve a single asset, specify its UID.
           * @example 
           * let data = Stack.Assets('bltsomething123').toJSON().fetch()
           *      data
           *        .then(function(result) {
           *           // ‘result’ is a single asset object of specified uid       
           *      }, function(error) {
           *           // error function
           *      })
           * @example 
           * let data = Stack.Assets().toJSON().find()
           *      data
           *      .then(function(result) {
           *           // ‘result’ will display all assets present in stack       
           *      }, function(error) {
           *           // error function
           *      })
           * @returns {Assets}
           * @instance 
           */

    }, {
        key: 'Assets',
        value: function Assets(uid) {
            this.type = 'asset';
            if (uid && typeof uid === "string") {
                var asset = new _assets2.default();
                asset.asset_uid = uid;
                return Utils.merge(asset, this);
            }
            return this;
        }

        /**
            * @method Query
            * @memberOf Stack
            * @description An initializer is responsible for creating Query object.Provides support for all search queries
            * @returns {Query}
            * @instance  
            */

    }, {
        key: 'Query',
        value: function Query() {
            var query = new _query2.default();
            return Utils.merge(query, this);
        }

        /**
          * @method getLastActivites
          * @memberOf Stack
          * @description getLastActivites get all the ContentTypes whose last activity updated.
          * @example Stack.getLastActivites()
          * @example 
          * let data = Stack.getLastActivites().toJSON().fetch()
          *      data
          *      .then(function(result) {
          *           // 'result' is list of contentTypes whose last activity updated.       
          *      }, function(error) {
          *           // error function
          *      })
          * @returns {Stack}
          * @instance
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

        /**
        * @method getContentTypes
        * @memberOf Stack
        * @param {String} param - Query on contentTypes
        * @description This method returns comprehensive information of all the content types of a particular stack in your account.
        * @example 
        * let data = Stack.getContentTypes({"include_global_field_schema": true})
        *      data
        *      .then(function(result) {
        *           // 'result' is list of contentTypes.       
        *      }, function(error) {
        *           // error function
        *      })
        * @returns {Stack}
        * @instance
        */

    }, {
        key: 'getContentTypes',
        value: function getContentTypes(param) {
            var query = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types,
                body: {
                    _method: 'GET',
                    environment: this.environment
                }
            };
            if (param && param !== undefined) {
                for (var key in param) {
                    query.body[key] = param[key];
                }
            }
            return (0, _request2.default)(query);
        }

        /**
         * @method sync
         * @memberOf Stack
         * @description Syncs your Contentstack data with your app and ensures that the data is always up-to-date by providing delta updates
         * @param {object} params - params is an object that supports ‘locale’, ‘start_date’, ‘content_type_id’, and ‘type’ queries.
         * @example 
         * Stack.sync({'init': true})        // For initializing sync
         * @example 
         * Stack.sync({'init': true, 'locale': 'en-us'})     //For initializing sync with entries of a specific locale
         * @example 
         * Stack.sync({'init': true, 'start_date': '2018-10-22'})    //For initializing sync with entries published after a specific date
         * @example 
         * Stack.sync({'init': true, 'content_type_id': 'session'})   //For initializing sync with entries of a specific content type
         * @example 
         * Stack.sync({'init': true, 'type': 'entry_published'})   //Use the type parameter to get a specific type of content.Supports 'asset_published', 'entry_published', 'asset_unpublished', 'entry_unpublished', 'asset_deleted', 'entry_deleted', 'content_type_deleted'.
         * @example 
         * Stack.sync({'pagination_token': '<btlsomething>'})    // For fetching the next batch of entries using pagination token
         * @example 
         * Stack.sync({'sync_token': '<btlsomething>'})    // For performing subsequent sync after initial sync
         * @returns {promise}
         * @instance
         */

    }, {
        key: 'sync',
        value: function sync(params) {
            this._query = {};
            this._query = Object.assign(this._query, params);
            this.requestParams = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.sync,
                body: {
                    _method: 'GET',
                    query: this._query
                }
            };
            return Utils.sendRequest(this);
        }

        /**
         * @method imageTransform
         * @memberOf Stack
         * @description Performs transformations on images of mentioned url based on transformation parameters 
         * @param {String} url - Image url on which transformations need to be applied.
         * @param {String} params - Object with transformation parameters
         * @example
         * Stack.imageTransform(imageURL, {height: 100, width: 200, disable: "upscale"});
         * @example
         * Stack.imageTransform(imageURL, {crop: "150,100"});
         * @example
         * Stack.imageTransform(imageURL, {format: "png", crop: "150,100"});
         * @returns {string} [Image url with transformation parameters.]
         * @instance
         */

    }, {
        key: 'imageTransform',
        value: function imageTransform(url, params) {
            if (url && typeof url === "string" && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === "object" && params.length === undefined) {
                var queryParams = [];
                for (var operation in params) {
                    queryParams.push(operation + '=' + params[operation]);
                }
                url += url.indexOf("?") <= -1 ? "?" + queryParams.join('&') : "&" + queryParams.join('&');
            }

            return url;
        }
    }]);

    return Stack;
}();

exports.default = Stack;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = Request;

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _http = __webpack_require__(38);

var _http2 = _interopRequireDefault(_http);

var _httpProxyAgent = __webpack_require__(18);

var _httpProxyAgent2 = _interopRequireDefault(_httpProxyAgent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//JS SDK version
var version = '3.8.1';
var environment = void 0,
    api_key = void 0;

function Request(options) {
    return new Promise(function (resolve, reject) {
        var queryParams = void 0;
        var serialize = function serialize(obj, prefix) {

            var str = [],
                p = void 0;
            if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj.length !== undefined) {
                for (var i = 0, _i = obj.length; i < _i; i++) {
                    str.push(prefix + '[]=' + obj[i]);
                }
            } else {
                for (p in obj) {
                    var k = prefix ? prefix + "[" + p + "]" : p,
                        v = obj[p];
                    str.push(v !== null && (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" && p !== 'query' ? serialize(v, k) : k + "=" + encodeURIComponent(p !== 'query' ? v : JSON.stringify(v)));
                }
            }
            return str.join("&");
        };

        var url = options.url,
            headers = options.headers;

        // setting headers
        headers['Content-Type'] = 'application/json; charset=UTF-8';
        headers['X-User-Agent'] = 'contentstack-react-native/' + version;

        if (options.body && _typeof(options.body) === 'object') {
            delete options.body._method;
            if (_typeof(options.body.query) === "object" && Object.keys(options.body.query).length === 0) delete options.body.query;
            queryParams = serialize(options.body);
        }

        (0, _http2.default)(url + '?' + queryParams, {
            method: 'GET',
            headers: headers,
            agent: new _httpProxyAgent2.default('http://local:9089')
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _localstorage = __webpack_require__(34);

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
/* 6 */
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

var _localstorage = __webpack_require__(39);

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
    try {
        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
            _localstorage2.default.setItem(key, JSON.stringify(data));
        } else {
            _localstorage2.default.setItem(key, data);
        }
    } catch (error) {}
};

function getStorage() {
    return _localstorage2.default || null;
};

function getKeys() {
    return _localstorage2.default ? Object.keys(_localstorage2.default) : [];
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _stack = __webpack_require__(1);

var _stack2 = _interopRequireDefault(_stack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class 
  Entry 
* @summary Creates an instance of `Entry`.   
* @description An initializer is responsible for creating Entry object.
* @param {String} uid - uid of the entry
* @example
* let Entry = Stack.ContentType('example').Entry('entry_uid');
* @returns {Entry}
* @instance
*/

var Entry = function () {
    function Entry() {
        _classCallCheck(this, Entry);

        this._query = {};
        /**
         * @method only
         * @memberOf Entry
         * @description Displays values of only the specified fields of entries or assets in the response
         * @param {String} [key=BASE] -  Assets: </br>
         *                                <p>Retrieves specified field of asset</p>
         * @param {String}            -  Entries:</br>
         *                                       <p>- retrieves default fields of the schema.</p>
         *                                       <p>- referenced_content-type-uid : retrieves fields of the referred content type.</p>
         * @param {Array} values - array of fields that you want to display in the response
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
         * @instance
         */
        this.only = Utils.transform('only');
        /**
         * @method except
         * @memberOf Entry
         * @description Displays all data of an entries or assets excluding the data of the specified fields.
         * @param {String} [key=BASE] - BASE (default value) - retrieves default fields of the schema.
                                                             - referenced_content-type-uid - retrieves fields of the referred content type.
         * @param {Array} values - array of fields that you want to skip in the response
         * @example
         * <caption> .except with field uid </caption>
         * Stack.ContentType('contentTypeUid').Query().except('title').toJSON().find()
         * @example
         * <caption> .except with field uid </caption>
         * Stack.ContentType('contentTypeUid').Query().except('BASE','title').toJSON().find()
         * @example
         * <caption> .except with field uids(array) </caption>
         * Stack.ContentType('contentTypeUid').Query().except(['title','description']).toJSON().find()
         * @example
         * <caption> .except with reference_field_uid and field uid </caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('category').except('category','title').toJSON().find()
         * @example
         * <caption> .except with reference_field_uid and field uids(array) </caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('category').except('category', ['title', 'description']).toJSON().find()
         * @returns {Entry}
         * @instance 
         */
        this.except = Utils.transform('except');
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
            * @memberOf Entry
            * @description Fetches the entire content of referenced entry(ies)
            * @example
            * <caption> .includeReference with reference_field_uids as array </caption>
            * var Query = Stack.ContentType(contentTypes.source).Query();
                   Query
                       .includeReference(['reference', 'other_reference'])
                       .toJSON()
                       .find()
                       .then(function success(entries) {
                           //'entries' is  an object used to retrieve data including reference entries.
                       })
            * @example
            * <caption> .includeReference with reference_field_uids </caption>
            * var Query = Stack.ContentType(contentTypes.source).Query(); 
            Query
               .includeReference('reference')
               .toJSON()
               .find()
               .then(function success(entries) {
                   //'entries' is  an object used to retrieve data including particular reference using reference_uid.
               })
            * @returns {Entry}
            * @instance
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
        * Sets the language code of which you want to retrieve data.
        * @param {String} language_code - language code. e.g. 'en-us', 'ja-jp', etc.
        * @memberOf Entry
        * @example 
        * let data = Stack.ContentType(contentTypeUid).Entry(entryUid).language('ja-jp').fetch()
        * data
        *      .then(function(result) {
        *           // 'result' is  an object used to retrieve data of ja-jp language.
        *      }, function(error) {
        *           // error function
        *      })
        *          
        * @returns {Entry}
        * @instance
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
        * @memberOf Entry
        * @description Adds query to Entry object
        * @param {String} key - key of the query
        * @param {String} value - value of the query
        * @example Stack.ContentType(contentTypeUid).Entry(entry_uid).addQuery('include_schema',true)
        * @returns {Entry}
        * @instance
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
         * @memberOf Entry
         * @deprecated since verion 3.3.0
         * @description  Include schema of the current content type along with entry/entries details.
         * @example Stack.ContentType("contentType_uid").Entry("entry_uid").includeSchema().fetch()
         * @returns {Entry}
         * @instance
         */

    }, {
        key: "includeSchema",
        value: function includeSchema() {
            this._query['include_schema'] = true;
            return this;
        }

        /**
         * @method includeReferenceContentTypeUid
         * @memberOf Entry
         * @description  This method also includes the content type UIDs of the referenced entries returned in the response.
         * @example Stack.ContentType("contentType_uid").Entry("entry_uid").includeReferenceContentTypeUID().fetch()
         * @example 
         * Query = Stack.ContentType("contentType_uid").Entry("entry_uid").includeReferenceContentTypeUID().fetch()
         * Query
         *      .toJSON()
         *      .then(function (result) {
         *          let value = result.get(field_uid)
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Entry}
         * @instance
         */

    }, {
        key: "includeReferenceContentTypeUID",
        value: function includeReferenceContentTypeUID() {
            this._query['include_reference_content_type_uid'] = true;
            return this;
        }

        /**
         * @method includeContentType
         * @memberOf Entry
         * @description Include the details of the content type along with the entry/entries details.
         * @example stack.ContentType(contentType_uid).Entry(entry_uid).includeContentType().fetch()
         * @returns {Entry}
         * @instance
         */

    }, {
        key: "includeContentType",
        value: function includeContentType() {
            this._query['include_content_type'] = true;
            return this;
        }

        /**
          * @method includeOwner
          * @memberOf Entry 
          * @description Includes the owner details of the entry/entries
          * @example stack.ContentType(contentType_uid).Entry(entry_uid).includeOwner().fetch()
          * @returns {Entry}
          * @instance
          */

    }, {
        key: "includeOwner",
        value: function includeOwner() {
            this._query['include_owner'] = true;
            return this;
        }

        /**
         * @method toJSON
         * @memberOf Entry 
         * @description Converts your response into plain JavasScript object.Supports both entry and asset queries.
         * @example
         * Query = Stack.ContentType(contentTypeUid).Entry(entryUid).fetch()
         * Query
         *      .toJSON()
         *      .then(function (result) {
         *          let value = result.get(field_uid)
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Entry}
         * @instance
         */

    }, {
        key: "toJSON",
        value: function toJSON() {
            this.tojson = true;
            return this;
        }

        /**
         * @method addParam
         * @memberOf Entry 
         * @description Includes query parameters in your queries.
         * @example var data = Stack.ContentType(contentTypeUid).Entry(entryUid).addParam('include_count', 'true').fetch()
         *      data.then(function (result) {
         *          // 'result' is an object which content the data including count in json object form
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Entry}
         * @instance
         */

    }, {
        key: "addParam",
        value: function addParam(key, value) {
            if (key && value && typeof key === 'string' && typeof value === 'string') {
                this._query[key] = value;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        }

        /**
        * @method fetch
        * @memberOf Entry 
        * @description Fetches a particular entry based on the provided entry UID.
        * @example
        * Stack.ContentType(contentTypeUid).Entry(entryUid).toJSON().fetch()
        * @returns {promise}
        * @instance
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _request = __webpack_require__(4);

var _request2 = _interopRequireDefault(_request);

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _entry = __webpack_require__(7);

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
                this._query['query'][key] = this._query['query']['file_size'] || {};
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
 * @class 
   Query  
 * @description
 * An initializer is responsible for creating Query object.Provides support for all search queries
 * @example
 * <caption>Query instance creation.</caption>
 * let Query = Contentstack.Stack().ContentType('example').Query();
 * let assetQuery =  Contentstack.Stack().Assets().Query();
 * @returns {Query}
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
        * @memberOf Query
        * @description Retrieves entries in which the value of a field is lesser than the provided value
        * @param {String} key - uid of the field
        * @param {*} value - Value used to match or compare
        * @example let blogQuery = Stack().ContentType('example').Query();
        *          let data = blogQuery.lessThan('created_at','2015-06-22').find()
        *          data.then(function (result) {
        *          // result content the data who's 'created_at date' is less than '2015-06-22'
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        * @instance
        */
        _this.lessThan = _extend.compare('$lt');

        /**
        * @method lessThanOrEqualTo
        * @memberOf Query
        * @description Retrieves entries in which the value of a field is lesser than or equal to the provided value.
        * @param {String} key - uid of the field
        * @param {*} value - Value used to match or compare
        * @example let blogQuery = Stack().ContentType('example').Query();
        *          let data = blogQuery.lessThanOrEqualTo('created_at','2015-06-22').find()
        *          data.then(function (result) {
        *          // result contain the data of entries where the 'created_at' date will be less than or equalto '2015-06-22'.
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        * @instance
        */
        _this.lessThanOrEqualTo = _extend.compare('$lte');
        /**
        * @method greaterThan
        * @memberOf Query
        * @description Retrieves entries in which the value for a field is greater than the provided value.
        * @param {String} key - uid of the field
        * @param {*} value -  value used to match or compare
        * @example 
        *          let blogQuery = Stack().ContentType('example').Query();
        *          let data = blogQuery.greaterThan('created_at','2015-03-12').find()
        *                     data.then(function(result) {
        *                       // result contains the data of entries where the 'created_at' date will be greaterthan '2015-06-22'
        *                     },function (error) {
        *                       // error function
        *                     })
        * @returns {Query}
        * @instance
        */
        _this.greaterThan = _extend.compare('$gt');

        /**
         * @method greaterThanOrEqualTo
         * @memberOf Query
         * @description Retrieves entries in which the value for a field is greater than or equal to the provided value.
         * @param {String} key - uid of the field 
         * @param {*} value - Value used to match or compare
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.greaterThanOrEqualTo('created_at','2015-03-12').find()
         *          data.then(function(result) {
         *          // result contains the data of entries where the 'created_at' date will be greaterThan or equalto '2015-06-22'
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
         */
        _this.greaterThanOrEqualTo = _extend.compare('$gte');

        /**
         * @method notEqualTo
         * @memberOf Query
         * @description Retrieves entries in which the value for a field does not match the provided value.
         * @param {String} key - uid of the field 
         * @param {*} value - Value used to match or compare
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.notEqualTo('title','Demo').find()
         *          data.then(function(result) {
         *            // ‘result’ contains the list of entries where value of the ‘title’ field will not be 'Demo'.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
         */
        _this.notEqualTo = _extend.compare('$ne');

        /**
         * @method containedIn
         * @memberOf Query
         * @description Retrieve entries in which the value of a field matches with any of the provided array of values
         * @param {String} key - uid of the field
         * @param {*} value - Array of values that are to be used to match or compare
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.containedIn('title', ['Demo', 'Welcome']).find()
         *          data.then(function(result) {
         *          // ‘result’ contains the list of entries where value of the ‘title’ field will contain either 'Demo' or ‘Welcome’.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
         */
        _this.containedIn = _extend.contained(true);

        /**
          * @method notContainedIn
          * @memberOf Query
          * @description Retrieve entries in which the value of a field does not match with any of the provided array of values.
          * @param {String} key - uid of the field
          * @param {Array} value - Array of values that are to be used to match or compare
          * @example let blogQuery = Stack().ContentType('example').Query();
          *          let data = blogQuery.notContainedIn('title', ['Demo', 'Welcome']).find()
          *          data.then(function(result) {
          *          // 'result' contains the list of entries where value of the title field should not be either "Demo" or ‘Welcome’
          *       },function (error) {
          *          // error function
          *      })
          * @returns {Query}
          * @instance
          */
        _this.notContainedIn = _extend.contained(false);

        /**
        * @method exists 
        * @memberOf Query
        * @description Retrieve entries if value of the field, mentioned in the condition, exists.
        * @param {String} key - uid of the field
        * @example blogQuery.exists('featured')
        * @example let blogQuery = Stack().ContentType('example').Query();
        *          let data = blogQuery.exists('featured').find()
        *          data.then(function(result) {
        *          // ‘result’ contains the list of entries in which "featured" exists.
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        * @instance
        */
        _this.exists = _extend.exists(true);

        /**
        * @method notExists
        * @memberOf Query
        * @description Retrieve entries if value of the field, mentioned in the condition, does not exists.
        * @param {String} key - uid of the field
        * @example blogQuery.notExists('featured')
        * @example let blogQuery = Stack().ContentType('example').Query();
        *          let data = blogQuery.notExists('featured').find()
        *          data.then(function(result) {
        *        // result is the list of non-existing’featured’" data.
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        * @instance
        */
        _this.notExists = _extend.exists(false);

        /**
        * @method ascending
        * @memberOf Query
        * @description Sort fetched entries in the ascending order with respect to a specific field.
        * @param {String} key - field uid based on which the ordering will be done
        * @example let blogQuery = Stack().ContentType('example').Query();
        *          let data = blogQuery.ascending('created_at').find()
        *          data.then(function(result) {
        *           // ‘result’ contains the list of entries which is sorted in ascending order on the basis of ‘created_at’. 
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        * @instance
        */
        _this.ascending = _extend.sort('asc');

        /**
         * @method descending
         * @memberOf Query
         * @description Sort fetched entries in the descending order with respect to a specific field
         * @param {String} key - field uid based on which the ordering will be done.
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.descending('created_at').find()
         *          data.then(function(result) {
         *           // ‘result’ contains the list of entries which is sorted in descending order on the basis of ‘created_at’. 
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
         */
        _this.descending = _extend.sort('desc');

        /**
        * @method beforeUid
        * @memberOf Query
        * @description Sort fetched entries in the descending order with respect to a specific field
        * @param {String} uid - field uid based on which the ordering will be done.
        * @example blogQuery.beforeUid('blt1234567890abcdef')
        * @returns {Query}
        * @instance
        */
        _this.beforeUid = _extend.sort('before_uid');

        /**
         * @method afterUid
         * @memberOf Query
         * @description This method provides only the entries after the specified entry id.
         * @param {String} uid - uid of the entry
         * @example blogQuery.afterUid('blt1234567890abcdef')
         * @returns {Query}
         * @instance
         */
        _this.afterUid = _extend.sort('after_uid');

        /**
        * @method skip
        * @memberOf Query
        * @description Skips at specific number of entries.
        * @param {Number} skip - number of entries to be skipped
        * @example blogQuery.skip(5)
        * @example let blogQuery = Stack().ContentType('example').Query();
        *          let data = blogQuery.skip(5).find()
        *          data.then(function(result) {
        *          // result contains the list of data which is sorted in descending order on 'created_at' bases. 
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        * @instance
        */
        _this.skip = _extend.pagination('skip');

        /**
        * @method limit
        * @memberOf Query
        * @description Returns a specific number of entries based on the set limit
        * @param {Number} limit - maximum number of entries to be returned
        * @example let blogQuery = Stack().ContentType('example').Query();
        *          let data = blogQuery.limit(10).find()
        *          data.then(function(result) {
        *          // result contains the limited number of entries
        *       },function (error) {
        *          // error function
        *      })
        * @returns {Query}
        * @instance
        */
        _this.limit = _extend.pagination('limit');

        /**
        * @method or
        * @memberOf Query
        * @description Retrieves entries that satisfy at least one of the given conditions
        * @param {object} queries - array of Query objects or raw queries
        * @example
        * <caption> .or with Query instances</caption>
        * let Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').find()
        * let Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).find()
        * blogQuery.or(Query1, Query2)
        * @example
        * <caption> .or with raw queries</caption>
        * let Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').getQuery()
        * let Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).getQuery()
        * blogQuery.or(Query1, Query2)
        * @returns {Query}
        * @instance
        */
        _this.or = _extend.logical('$or');

        /**
         * @method and
         * @memberOf Query
         * @description Retrieve entries that satisfy all the provided conditions.
         * @param {object} queries - array of query objects or raw queries.
         * @example
         * <caption> .and with Query instances</caption>
         * let Query1 = Stack.ContentType('blog').Query().where('title', 'Demo')
         * let Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10)
         * blogQuery.and(Query1, Query2)
         * @example
         * <caption> .and with raw queries</caption>
         * let Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').getQuery()
         * let Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).getQuery()
         * blogQuery.and(Query1, Query2)
         * @returns {Query}
         * @instance
         */
        _this.and = _extend.logical('$and');
        return _this;
    }

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

        /**
         * @memberOf Query
         * @description Retrieve entries in which a specific field satisfies the value provided
         * @param {String} key - uid of the field
         * @param {*} value - value used to match or compare
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.where('title','Demo').find()
         *          data.then(function(result) {
         *            // ‘result’ contains the list of entries where value of ‘title’ is equal to ‘Demo’. 
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
         */

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
         * @memberOf Query
         * @description Returns the total number of entries
         * @example blogQuery.count()
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.count().find()
         *          data.then(function(result) {
         *           // ‘result’ contains the total count. 
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
         */

    }, {
        key: 'count',
        value: function count() {
            var host = this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version,
                url = this.type && this.type === 'asset' ? host + this.config.urls.assets : host + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries;
            this._query['count'] = true;
            this.requestParams = {
                method: 'POST',
                headers: this.headers,
                url: url,
                body: {
                    _method: 'GET',
                    query: this._query
                }
            };
            return this;
        }

        /**
         * @method query
         * @memberOf Query
         * @description Retrieve entries based on raw queries
         * @param {object} query - RAW (JSON) queries 
         * @returns {Query}
         * @instance
         * @example 
         * let blogQuery = Stack().ContentType('example').Query();
         * let data = blogQuery.query({"brand": {"$nin_query": {"title": "Apple Inc."}}}).find()
         * data.then(function(result) {
         *    // ‘result’ contains the total count. 
         * },function (error) {
         *    // error function
         * })
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
         * @method referenceIn
         * @memberOf Query
         * @description Retrieve entries that satisfy the query conditions made on referenced fields.
         * @param {Query} query - RAW (JSON) queries 
         * @returns {Query}
         * @instance
         * @example 
         * <caption> referenceIn with Query instances</caption>
         * let blogQuery = Stack().ContentType('example').Query();
         * let Query = Stack.ContentType('blog').Query().where('title', 'Demo')
         * let data = blogQuery.referenceIn("brand", Query).find()
         * data.then(function(result) {
         *    // ‘result’ contains the total count. 
         * },function (error) {
         *    // error function
         * })
         * 
         * @example 
         * <caption> referenceIn with raw queries</caption>
         * let blogQuery = Stack().ContentType('example').Query();
         * let data = blogQuery.referenceIn("brand", {'title': 'Demo'}).find()
         * data.then(function(result) {
         *    // ‘result’ contains the total count. 
         * },function (error) {
         *    // error function
         * })
         */

    }, {
        key: 'referenceIn',
        value: function referenceIn(key, query) {
            var _query = {};
            if (query instanceof Query && query._query.query) {
                _query["$in_query"] = query._query.query;
            } else if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === "object") {
                _query["$in_query"] = query;
            }
            if (this._query['query'][key]) {
                this._query['query'][key] = this._query['query'][key].concat(_query);
            } else {
                this._query['query'][key] = _query;
            }
            return this;
        }

        /**
         * @method referenceNotIn
         * @memberOf Query
         * @description Retrieve entries that does not satisfy the query conditions made on referenced fields.
         * @param {Query} query - RAW (JSON) queries 
         * @returns {Query}
         * @instance
         * @example 
         * <caption> referenceNotIn with Query instances</caption>
         * let blogQuery = Stack().ContentType('example').Query();
         * let data = blogQuery.referenceNotIn("brand", {'title': 'Demo'}).find()
         * data.then(function(result) {
         *    // ‘result’ contains the total count. 
         * },function (error) {
         *    // error function
         * })
         * 
         * @example 
         * <caption> referenceNotIn with raw queries</caption>
         * let blogQuery = Stack().ContentType('example').Query();
         * let Query = Stack.ContentType('blog').Query().where('title', 'Demo')
         * let data = blogQuery.referenceNotIn("brand", Query).find()
         * data.then(function(result) {
         *    // ‘result’ contains the total count. 
         * },function (error) {
         *    // error function
         * })
         */

    }, {
        key: 'referenceNotIn',
        value: function referenceNotIn(key, query) {
            var _query = {};
            if (query instanceof Query && query._query.query) {
                _query["$nin_query"] = query._query.query;
            } else if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === "object") {
                _query["$nin_query"] = query;
            }
            if (this._query['query'][key]) {
                this._query['query'][key] = this._query['query'][key].concat(_query);
            } else {
                this._query['query'][key] = _query;
            }
            return this;
        }

        /**
         * @method tags
         * @memberOf Query
         * @description Retrieves entries based on the provided tags
         * @param {Array} values - tags
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.tags(['technology', 'business']).find()
         *          data.then(function(result) {
         *        // ‘result’ contains list of entries which have tags "’technology’" and ‘"business’".
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
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
         * @method includeReferenceContentTypeUid
         * @memberOf Query
         * @description  This method also includes the content type UIDs of the referenced entries returned in the response.
         * @example Stack.ContentType("contentType_uid").Query().includeReferenceContentTypeUID().find()
         * @example 
         * let blogQuery = Stack.ContentType("contentType_uid").Query();
         *          let data = blogQuery.includeReferenceContentTypeUID().find()
         *          data.then(function(result) {
         *         // ‘result’ contains a list of entries in which content type UIDs is present. 
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
         */

    }, {
        key: 'includeReferenceContentTypeUID',
        value: function includeReferenceContentTypeUID() {
            this._query['include_reference_content_type_uid'] = true;
            return this;
        }

        /**
         * @method includeCount
         * @memberOf Query
         * @description Includes the total number of entries returned in the response.
         * @example blogQuery.includeCount()
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.includeCount().find()
         *          data.then(function(result) {
         *         // ‘result’ contains a list of entries in which count of object is present at array[1] position. 
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
         */

    }, {
        key: 'includeCount',
        value: function includeCount() {
            this._query['include_count'] = true;
            return this;
        }

        /**
         * @method addParam
         * @description Includes query parameters in your queries.
         * @memberOf Query
         * @example var data = blogQuery.addParam('include_count', 'true').fetch()
         *      data.then(function (result) {
         *          // 'result' is an object which content the data including count in json object form
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
         */

    }, {
        key: 'addParam',
        value: function addParam(key, value) {
            if (key && value && typeof key === 'string' && typeof value === 'string') {
                this._query[key] = value;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        }

        /**
         * @method getQuery
         * @memberOf Query
         * @description Returns the raw (JSON) query based on the filters applied on Query object.
         * @example Stack.ContentType('contentType_uid').Query().where('title','Demo').getQuery().find()
         * @returns {Query}
         * @instance
         */

    }, {
        key: 'getQuery',
        value: function getQuery() {
            return this._query.query || {};
        }

        /**
         * @method regex
         * @memberOf Query
         * @description Retrieve entries that match the provided regular expressions
         * @param {String} key - uid of the field
         * @param {*} value - value used to match or compare
         * @param {String} [options] - match or compare value in entry
         * @example
         * <caption> .regex without options</caption>
         * blogQuery.regex('title','^Demo')
         * @example
         * <caption> .regex with options</caption>
         * blogQuery.regex('title','^Demo', 'i')
         * @returns {Query}
         * @instance
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
         * @memberOf Query
         * @description Retrieve entries that have fields which match the provided search value.
         * @param {string} value - value to search in entries
         * @example blogQuery.search('Welcome to demo')
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.search('welcome to demo').find()
         *          data.then(function(result) {
         *         // ‘result’ contains the object that possess the text "’welcome to demo’".
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         * @instance
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
         * @memberOf Query
         * @description Retrieves entries that satisfied the specified query
         * @example let blogQuery = Stack().ContentType('example').Query().find();
         *          blogQuery.then(function(result) {
         *          // result contains the list of object. 
         *       },function (error) {
         *          // error function
         *      })
         * blogQuery.find()
         * @returns {promise}
         * @instance
         */

    }, {
        key: 'find',
        value: function find() {
            var host = this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version,
                url = this.type && this.type === 'asset' ? host + this.config.urls.assets : host + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries;
            this.requestParams = {
                method: 'POST',
                headers: this.headers,
                url: url,
                body: {
                    _method: 'GET',
                    query: this._query
                }
            };
            return Utils.sendRequest(this);
        }

        /**
        * @method findOne
        * @memberOf Query
        * @deprecated since verion 3.3.0
        * @description Retrieve a single entry from the result
        * @example let blogQuery = Stack().ContentType('example').Query().findOne();
        *          blogQuery.then(function(result) {
        *          // result contains the single item object. 
        *       },function (error) {
        *          // error function
        *      })
        * blogQuery.findOne()
        * @returns {promise}
        * @instance
        */

    }, {
        key: 'findOne',
        value: function findOne() {
            var host = this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version,
                url = this.type && this.type === 'asset' ? host + this.config.urls.assets : host + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries;
            this.singleEntry = true;
            this._query.limit = 1;
            this.requestParams = {
                method: 'POST',
                headers: this.headers,
                url: url,
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
/* 9 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var ContentstackRegion = {
    EU: "eu",
    US: "us"
};

exports.default = ContentstackRegion;
//module.exports = ContentstackRegion;

/***/ }),
/* 11 */
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
        sync: "/stacks/sync",
        content_types: "/content_types/",
        entries: "/entries/",
        assets: "/assets/",
        environments: "/environments/"
    }
};

exports.default = config;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
var events_1 = __webpack_require__(17);
var promisify_1 = __importDefault(__webpack_require__(13));
function isAgentBase(v) {
    return Boolean(v) && typeof v.addRequest === 'function';
}
function isHttpAgent(v) {
    return Boolean(v) && typeof v.addRequest === 'function';
}
function isSecureEndpoint() {
    var _ref = new Error(),
        stack = _ref.stack;

    if (typeof stack !== 'string') return false;
    return stack.split('\n').some(function (l) {
        return l.indexOf('(https.js:') !== -1;
    });
}
function createAgent(callback, opts) {
    return new createAgent.Agent(callback, opts);
}
(function (createAgent) {
    /**
     * Base `http.Agent` implementation.
     * No pooling/keep-alive is implemented by default.
     *
     * @param {Function} callback
     * @api public
     */
    var Agent = function (_events_1$EventEmitte) {
        _inherits(Agent, _events_1$EventEmitte);

        function Agent(callback, _opts) {
            _classCallCheck(this, Agent);

            // The callback gets promisified lazily
            var _this = _possibleConstructorReturn(this, (Agent.__proto__ || Object.getPrototypeOf(Agent)).call(this));

            _this.promisifiedCallback = undefined;
            var opts = _opts;
            if (typeof callback === 'function') {
                _this.callback = callback;
            } else if (callback) {
                opts = callback;
            }
            // timeout for the socket to be returned from the callback
            _this.timeout = null;
            if (opts && typeof opts.timeout === 'number') {
                _this.timeout = opts.timeout;
            }
            _this.options = opts || {};
            _this.maxFreeSockets = 1;
            _this.maxSockets = 1;
            _this.sockets = [];
            _this.requests = [];
            return _this;
        }

        _createClass(Agent, [{
            key: "callback",
            value: function callback(req, opts, fn) {
                throw new Error('"agent-base" has no default implementation, you must subclass and override `callback()`');
            }
            /**
             * Called by node-core's "_http_client.js" module when creating
             * a new HTTP request with this Agent instance.
             *
             * @api public
             */

        }, {
            key: "addRequest",
            value: function addRequest(req, _opts) {
                var ownOpts = Object.assign({}, _opts);
                if (typeof ownOpts.secureEndpoint !== 'boolean') {
                    ownOpts.secureEndpoint = isSecureEndpoint();
                }
                // Set default `host` for HTTP to localhost
                if (ownOpts.host == null) {
                    ownOpts.host = 'localhost';
                }
                // Set default `port` for HTTP if none was explicitly specified
                if (ownOpts.port == null) {
                    ownOpts.port = ownOpts.secureEndpoint ? 443 : 80;
                }
                var opts = Object.assign(Object.assign({}, this.options), ownOpts);
                if (opts.host && opts.path) {
                    // If both a `host` and `path` are specified then it's most likely the
                    // result of a `url.parse()` call... we need to remove the `path` portion so
                    // that `net.connect()` doesn't attempt to open that as a unix socket file.
                    delete opts.path;
                }
                delete opts.agent;
                delete opts.hostname;
                delete opts._defaultAgent;
                delete opts.defaultPort;
                delete opts.createConnection;
                // Hint to use "Connection: close"
                // XXX: non-documented `http` module API :(
                req._last = true;
                req.shouldKeepAlive = false;
                // Create the `stream.Duplex` instance
                var timedOut = false;
                var timeout = null;
                var timeoutMs = this.timeout;
                var freeSocket = this.freeSocket;
                function onerror(err) {
                    if (req._hadError) return;
                    req.emit('error', err);
                    // For Safety. Some additional errors might fire later on
                    // and we need to make sure we don't double-fire the error event.
                    req._hadError = true;
                }
                function ontimeout() {
                    timeout = null;
                    timedOut = true;
                    var err = new Error("A \"socket\" was not created for HTTP request before " + timeoutMs + "ms");
                    err.code = 'ETIMEOUT';
                    onerror(err);
                }
                function callbackError(err) {
                    if (timedOut) return;
                    if (timeout !== null) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    onerror(err);
                }
                function onsocket(socket) {
                    var sock = void 0;
                    function onfree() {
                        freeSocket(sock, opts);
                    }
                    if (timedOut) return;
                    if (timeout != null) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    if (isAgentBase(socket) || isHttpAgent(socket)) {
                        // `socket` is actually an `http.Agent` instance, so
                        // relinquish responsibility for this `req` to the Agent
                        // from here on
                        socket.addRequest(req, opts);
                        return;
                    }
                    if (socket) {
                        sock = socket;
                        sock.on('free', onfree);
                        req.onSocket(sock);
                        return;
                    }
                    var err = new Error("no Duplex stream was returned to agent-base for `" + req.method + " " + req.path + "`");
                    onerror(err);
                }
                if (typeof this.callback !== 'function') {
                    onerror(new Error('`callback` is not defined'));
                    return;
                }
                if (!this.promisifiedCallback) {
                    if (this.callback.length >= 3) {
                        // Legacy callback function - convert to a Promise
                        this.promisifiedCallback = promisify_1.default(this.callback);
                    } else {
                        this.promisifiedCallback = this.callback;
                    }
                }
                if (typeof timeoutMs === 'number' && timeoutMs > 0) {
                    timeout = setTimeout(ontimeout, timeoutMs);
                }
                if ('port' in opts && typeof opts.port !== 'number') {
                    opts.port = Number(opts.port);
                }
                try {
                    Promise.resolve(this.promisifiedCallback(req, opts)).then(onsocket, callbackError);
                } catch (err) {
                    Promise.reject(err).catch(callbackError);
                }
            }
        }, {
            key: "freeSocket",
            value: function freeSocket(socket, opts) {
                // TODO reuse sockets
                socket.destroy();
            }
        }, {
            key: "destroy",
            value: function destroy() {}
        }, {
            key: "defaultPort",
            get: function get() {
                if (typeof this.explicitDefaultPort === 'number') {
                    return this.explicitDefaultPort;
                } else {
                    return isSecureEndpoint() ? 443 : 80;
                }
            },
            set: function set(v) {
                this.explicitDefaultPort = v;
            }
        }, {
            key: "protocol",
            get: function get() {
                if (typeof this.explicitProtocol === 'string') {
                    return this.explicitProtocol;
                } else {
                    return isSecureEndpoint() ? 'https:' : 'http:';
                }
            },
            set: function set(v) {
                this.explicitProtocol = v;
            }
        }]);

        return Agent;
    }(events_1.EventEmitter);

    createAgent.Agent = Agent;
})(createAgent || (createAgent = {}));
// So that `instanceof` works correctly
createAgent.prototype = createAgent.Agent.prototype;
module.exports = createAgent;
//# sourceMappingURL=index.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
function promisify(fn) {
    return function (req, opts) {
        var _this = this;

        return new Promise(function (resolve, reject) {
            fn.call(_this, req, opts, function (err, rtn) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rtn);
                }
            });
        });
    };
}
exports.default = promisify;
//# sourceMappingURL=promisify.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens(b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;

  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;

  return [validLen, placeHoldersLen];
}

// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

  var curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

  for (var i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }

  return parts.join('');
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(14);
var ieee754 = __webpack_require__(22);
var isArray = __webpack_require__(16);

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength();

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
        return 42;
      } };
    return arr.foo() === 42 && // typed array instances can be augmented
    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
  } catch (e) {
    return false;
  }
}

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    });
  }
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }
  return createBuffer(that, size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that;
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }
  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return !!(b != null && b._isBuffer);
};

Buffer.compare = function compare(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;
      case 'hex':
        return len >>> 1;
      case 'base64':
        return base64ToBytes(string).length;
      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0;

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
    // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return '';
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;

        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = (typeof Reflect === 'undefined' ? 'undefined' : _typeof(Reflect)) === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function get() {
    return defaultMaxListeners;
  },
  set: function set(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {

  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }var doError = type === 'error';

  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) {
      ReflectApply(listeners[i], this, args);
    }
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)));
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)));
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)));
  }
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)));
  }

  events = this._events;
  if (events === undefined) return this;

  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }

    if (list.length === 1) events[type] = list[0];

    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;

  events = this._events;
  if (events === undefined) return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined) return [];

  var evlistener = events[type];
  if (evlistener === undefined) return [];

  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) {
    copy[i] = arr[i];
  }return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) {
    list[index] = list[index + 1];
  }list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

/**
 * Module dependencies.
 */

var net = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"net\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var tls = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"tls\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var url = __webpack_require__(29);
var Agent = __webpack_require__(12);
var inherits = __webpack_require__(32).inherits;
var debug = __webpack_require__(19)('http-proxy-agent');

/**
 * Module exports.
 */

module.exports = HttpProxyAgent;

/**
 * The `HttpProxyAgent` implements an HTTP Agent subclass that connects to the
 * specified "HTTP proxy server" in order to proxy HTTP requests.
 *
 * @api public
 */

function HttpProxyAgent(opts) {
	if (!(this instanceof HttpProxyAgent)) return new HttpProxyAgent(opts);
	if ('string' == typeof opts) opts = url.parse(opts);
	if (!opts) throw new Error('an HTTP(S) proxy server `host` and `port` must be specified!');
	debug('creating new HttpProxyAgent instance: %o', opts);
	Agent.call(this, opts);

	var proxy = Object.assign({}, opts);

	// if `true`, then connect to the proxy server over TLS. defaults to `false`.
	this.secureProxy = proxy.protocol ? /^https:?$/i.test(proxy.protocol) : false;

	// prefer `hostname` over `host`, and set the `port` if needed
	proxy.host = proxy.hostname || proxy.host;
	proxy.port = +proxy.port || (this.secureProxy ? 443 : 80);

	if (proxy.host && proxy.path) {
		// if both a `host` and `path` are specified then it's most likely the
		// result of a `url.parse()` call... we need to remove the `path` portion so
		// that `net.connect()` doesn't attempt to open that as a unix socket file.
		delete proxy.path;
		delete proxy.pathname;
	}

	this.proxy = proxy;
}
inherits(HttpProxyAgent, Agent);

/**
 * Called when the node-core HTTP client library is creating a new HTTP request.
 *
 * @api public
 */

HttpProxyAgent.prototype.callback = function connect(req, opts, fn) {
	var proxy = this.proxy;

	// change the `http.ClientRequest` instance's "path" field
	// to the absolute path of the URL that will be requested
	var parsed = url.parse(req.path);
	if (null == parsed.protocol) parsed.protocol = 'http:';
	if (null == parsed.hostname) parsed.hostname = opts.hostname || opts.host;
	if (null == parsed.port) parsed.port = opts.port;
	if (parsed.port == 80) {
		// if port is 80, then we can remove the port so that the
		// ":80" portion is not on the produced URL
		delete parsed.port;
	}
	var absolute = url.format(parsed);
	req.path = absolute;

	// inject the `Proxy-Authorization` header if necessary
	if (proxy.auth) {
		req.setHeader('Proxy-Authorization', 'Basic ' + Buffer.from(proxy.auth).toString('base64'));
	}

	// create a socket connection to the proxy server
	var socket;
	if (this.secureProxy) {
		socket = tls.connect(proxy);
	} else {
		socket = net.connect(proxy);
	}

	// at this point, the http ClientRequest's internal `_header` field might have
	// already been set. If this is the case then we'll need to re-generate the
	// string since we just changed the `req.path`
	if (req._header) {
		debug('regenerating stored HTTP header string for request');
		req._header = null;
		req._implicitHeader();
		if (req.output && req.output.length > 0) {
			// Node < 12
			debug('patching connection write() output buffer with updated header');
			// the _header has already been queued to be written to the socket
			var first = req.output[0];
			var endOfHeaders = first.indexOf('\r\n\r\n') + 4;
			req.output[0] = req._header + first.substring(endOfHeaders);
			debug('output buffer: %o', req.output);
		} else if (req.outputData && req.outputData.length > 0) {
			// Node >= 12
			debug('patching connection write() output buffer with updated header');
			var first = req.outputData[0].data;
			// the _header has already been queued to be written to the socket
			var endOfHeaders = first.indexOf('\r\n\r\n') + 4;
			req.outputData[0].data = req._header + first.substring(endOfHeaders);
			debug('output buffer: %o', req.outputData[0].data);
		}
	}

	fn(null, socket);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15).Buffer))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
	// Is firebug? http://stackoverflow.com/a/398120/376773
	typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
	// Is firefox >= v31?
	// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
	// Double check webkit in userAgent just in case we are in a worker
	typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	var c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	var index = 0;
	var lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, function (match) {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log() {
	var _console;

	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	var r = void 0;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {}
	// Swallow
	// XXX (@Qix-) should we be logging these?


	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(20)(exports);

var formatters = module.exports.formatters;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(21);

	Object.keys(env).forEach(function (key) {
		createDebug[key] = env[key];
	});

	/**
 * Active `debug` instances.
 */
	createDebug.instances = [];

	/**
 * The currently active debug mode names, and names to skip.
 */

	createDebug.names = [];
	createDebug.skips = [];

	/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */
	createDebug.formatters = {};

	/**
 * Selects a color for a debug namespace
 * @param {String} namespace The namespace string for the for the debug instance to be colored
 * @return {Number|String} An ANSI color code for the given namespace
 * @api private
 */
	function selectColor(namespace) {
		var hash = 0;

		for (var i = 0; i < namespace.length; i++) {
			hash = (hash << 5) - hash + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */
	function createDebug(namespace) {
		var prevTime = void 0;

		function debug() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			// Disabled?
			if (!debug.enabled) {
				return;
			}

			var self = debug;

			// Set `diff` timestamp
			var curr = Number(new Date());
			var ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			var index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				var formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					var val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			var logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		var index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		var i = void 0;
		var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		var len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			var instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
 * Disable debug output.
 *
 * @return {String} namespaces
 * @api public
 */
	function disable() {
		var namespaces = [].concat(_toConsumableArray(createDebug.names.map(toNamespace)), _toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
			return '-' + namespace;
		}))).join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		var i = void 0;
		var len = void 0;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
 * Convert regexp to namespace
 *
 * @param {RegExp} regxep
 * @return {String} namespace
 * @api private
 */
	function toNamespace(regexp) {
		return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
	}

	/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function TempCtor() {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function (root) {

	/** Detect free variables */
	var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
	var freeModule = ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
		root = freeGlobal;
	}

	/**
  * The `punycode` object.
  * @name punycode
  * @type Object
  */
	var punycode,


	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647,
	    // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	    tMin = 1,
	    tMax = 26,
	    skew = 38,
	    damp = 700,
	    initialBias = 72,
	    initialN = 128,
	    // 0x80
	delimiter = '-',
	    // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	    regexNonASCII = /[^\x20-\x7E]/,
	    // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
	    // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},


	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	    floor = Math.floor,
	    stringFromCharCode = String.fromCharCode,


	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
  * A generic error utility function.
  * @private
  * @param {String} type The error type.
  * @returns {Error} Throws a `RangeError` with the applicable error message.
  */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
  * A generic `Array#map` utility function.
  * @private
  * @param {Array} array The array to iterate over.
  * @param {Function} callback The function that gets called for every array
  * item.
  * @returns {Array} A new array of values returned by the callback function.
  */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
  * A simple `Array#map`-like wrapper to work with domain name strings or email
  * addresses.
  * @private
  * @param {String} domain The domain name or email address.
  * @param {Function} callback The function that gets called for every
  * character.
  * @returns {Array} A new string of characters returned by the callback
  * function.
  */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
  * Creates an array containing the numeric code points of each Unicode
  * character in the string. While JavaScript uses UCS-2 internally,
  * this function will convert a pair of surrogate halves (each of which
  * UCS-2 exposes as separate characters) into a single code point,
  * matching UTF-16.
  * @see `punycode.ucs2.encode`
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode.ucs2
  * @name decode
  * @param {String} string The Unicode input string (UCS-2).
  * @returns {Array} The new array of code points.
  */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) {
					// low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
  * Creates a string based on an array of numeric code points.
  * @see `punycode.ucs2.decode`
  * @memberOf punycode.ucs2
  * @name encode
  * @param {Array} codePoints The array of numeric code points.
  * @returns {String} The new Unicode string (UCS-2).
  */
	function ucs2encode(array) {
		return map(array, function (value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
  * Converts a basic code point into a digit/integer.
  * @see `digitToBasic()`
  * @private
  * @param {Number} codePoint The basic numeric code point value.
  * @returns {Number} The numeric value of a basic code point (for use in
  * representing integers) in the range `0` to `base - 1`, or `base` if
  * the code point does not represent a value.
  */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
  * Converts a digit/integer into a basic code point.
  * @see `basicToDigit()`
  * @private
  * @param {Number} digit The numeric value of a basic code point.
  * @returns {Number} The basic code point whose value (when used for
  * representing integers) is `digit`, which needs to be in the range
  * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
  * used; else, the lowercase form is used. The behavior is undefined
  * if `flag` is non-zero and `digit` has no uppercase form.
  */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
  * Bias adaptation function as per section 3.4 of RFC 3492.
  * https://tools.ietf.org/html/rfc3492#section-3.4
  * @private
  */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
  * Converts a Punycode string of ASCII-only symbols to a string of Unicode
  * symbols.
  * @memberOf punycode
  * @param {String} input The Punycode string of ASCII-only symbols.
  * @returns {String} The resulting string of Unicode symbols.
  */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,

		/** Cached calculation results */
		baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base;; /* no condition */k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;
			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);
		}

		return ucs2encode(output);
	}

	/**
  * Converts a string of Unicode symbols (e.g. a domain name label) to a
  * Punycode string of ASCII-only symbols.
  * @memberOf punycode
  * @param {String} input The string of Unicode symbols.
  * @returns {String} The resulting Punycode string of ASCII-only symbols.
  */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],

		/** `inputLength` will hold the number of code points in `input`. */
		inputLength,

		/** Cached calculation results */
		handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base;; /* no condition */k += base) {
						t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;
		}
		return output.join('');
	}

	/**
  * Converts a Punycode string representing a domain name or an email address
  * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
  * it doesn't matter if you call it on a string that has already been
  * converted to Unicode.
  * @memberOf punycode
  * @param {String} input The Punycoded domain name or email address to
  * convert to Unicode.
  * @returns {String} The Unicode representation of the given Punycode
  * string.
  */
	function toUnicode(input) {
		return mapDomain(input, function (string) {
			return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
		});
	}

	/**
  * Converts a Unicode string representing a domain name or an email address to
  * Punycode. Only the non-ASCII parts of the domain name will be converted,
  * i.e. it doesn't matter if you call it with a domain that's already in
  * ASCII.
  * @memberOf punycode
  * @param {String} input The domain name or email address to convert, as a
  * Unicode string.
  * @returns {String} The Punycode representation of the given domain name or
  * email address.
  */
	function toASCII(input) {
		return mapDomain(input, function (string) {
			return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
		'version': '1.4.1',
		/**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if ("function" == 'function' && _typeof(__webpack_require__(9)) == 'object' && __webpack_require__(9)) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}
})(undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module), __webpack_require__(3)))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    return map(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(26);
exports.encode = exports.stringify = __webpack_require__(27);

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var punycode = __webpack_require__(25);
var util = __webpack_require__(30);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,


// Special case for a simple path URL
simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,


// RFC 2396: characters reserved for delimiting URLs.
// We actually just auto-escape these.
delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],


// RFC 2396: characters not allowed for various reasons.
unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),


// Allowed by RFCs, but cause of XSS attacks.  Always escape these.
autoEscape = ['\''].concat(unwise),

// Characters that are never ever allowed in a hostname.
// Note that any invalid chars are also handled, but these
// are the ones that are *expected* to be seen, so we fast-path
// them.
nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,

// protocols that can allow "unsafe" and "unwise" chars.
unsafeProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that never have a hostname.
hostlessProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that always contain a // bit.
slashedProtocol = {
  'http': true,
  'https': true,
  'ftp': true,
  'gopher': true,
  'file': true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
},
    querystring = __webpack_require__(28);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + (typeof url === 'undefined' ? 'undefined' : _typeof(url)));
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function () {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || query && '?' + query || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function (relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift())) {}
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || result.host && srcPath.length;

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
  isString: function isString(arg) {
    return typeof arg === 'string';
  },
  isObject: function isObject(arg) {
    return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
  },
  isNull: function isNull(arg) {
    return arg === null;
  },
  isNullOrUndefined: function isNullOrUndefined(arg) {
    return arg == null;
  }
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function isBuffer(arg) {
  return arg && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
  var keys = Object.keys(obj);
  var descriptors = {};
  for (var i = 0; i < keys.length; i++) {
    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
  }
  return descriptors;
};

var formatRegExp = /%[sdj%]/g;
exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function (fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;
exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }
  return debugs[set];
};

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\x1B[' + inspect.colors[style][0] + 'm' + str + '\x1B[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};

  array.forEach(function (val, idx) {
    hash[val] = true;
  });

  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) &&
  // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect &&
  // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(31);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(23);

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
};

exports.promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function cb() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args).then(function (ret) {
      process.nextTick(cb, null, ret);
    }, function (rej) {
      process.nextTick(callbackifyOnRejected, rej, cb);
    });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 33 */
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
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cache = __webpack_require__(6);

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
    var _key = void 0,
        keys = cache.getKeys(),
        storage = cache.getStorage();
    if (!keyArray || !keyArray.length) {
        for (var i = 0, _i = keys.length; i < _i; i++) {
            delete storage[keys[i]];
        }
    } else {
        _key = keyArray.join('.');
        for (var _i2 = 0, _i3 = keys.length; _i2 < _i3; _i2++) {
            if (keys[_i2] && keys[_i2].indexOf(_key) === 0) delete storage[keys[_i2]];
        }
    }
}

localStorage.clearByContentType = function () {
    try {
        if (arguments.length === 2 || arguments.length === 3) {
            var args = Array.prototype.slice.call(arguments);
            var _callback = args.splice(-1, 1).pop();
            var valueArray = [];
            valueArray.push.apply(valueArray, args);
            clearValuesForKey(valueArray);
            _callback();
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stack = __webpack_require__(1);

var _stack2 = _interopRequireDefault(_stack);

var _index = __webpack_require__(5);

var _index2 = _interopRequireDefault(_index);

var _contentstackregion = __webpack_require__(10);

var _contentstackregion2 = _interopRequireDefault(_contentstackregion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @class 
 Contentstack 
* @description Creates an instance of `Contentstack`.
* @instance
*/

var Contentstack = function () {
	function Contentstack() {
		_classCallCheck(this, Contentstack);

		/**
   * @memberOf Contentstack
   * @description CachePolicy contains different cache policies constants.
   * @example
   * Contentstack.CachePolicy.IGNORE_CACHE
   * Contentstack.CachePolicy.ONLY_NETWORK
   * Contentstack.CachePolicy.CACHE_ELSE_NETWORK
   * Contentstack.CachePolicy.NETWORK_ELSE_CACHE
   * Contentstack.CachePolicy.CACHE_THEN_NETWORK
   */
		this.CachePolicy = _index2.default.policies;
		this.Region = _contentstackregion2.default;
	}
	/**
 
 * @memberOf Contentstack
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _stack = __webpack_require__(1);

var _stack2 = _interopRequireDefault(_stack);

var _query = __webpack_require__(8);

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class 
  Assets  
* @summary Creates an instance of `Assets`.
* @description Retrieves all assets of a stack by default. To retrieve a single asset, specify its UID.
* @param {String} uid - uid of asset you want to retrieve
* @example 
* let data = Stack.Assets('bltsomething123').toJSON().fetch()
*      data
*      .then(function(result) {
*           // ‘result’ is a single asset object of specified uid       
*      }, function(error) {
*           // error function
*      })
* @example 
* let data = Stack.Assets().toJSON().find()
*      data
*      .then(function(result) {
*           // ‘result’ will display all assets present in stack       
*      }, function(error) {
*           // error function
*      })
* @returns {Assets}
* @instance
*/

var Assets = function () {
    function Assets() {
        _classCallCheck(this, Assets);

        this._query = {};
        this.only = Utils.transform('only');
        return this;
    }

    /**
      * Converts your response into plain JavasScript object
      * @memberOf Assets
      * @example var Query = Stack.ContentType('blog').Query()
       Query   
            .toJSON()
            .find()
            .then(function (result) {
                // 'result' is an object which content the data in json object form
             },function (error) {
                // error function
        })
      * @returns {Assets}
      * @instance
      */

    _createClass(Assets, [{
        key: 'toJSON',
        value: function toJSON() {
            this.tojson = true;
            return this;
        }

        /**
           * Includes query parameters in your queries.
           * @memberOf Assets
           * @example var data = Stack.Assets(assetUid).addParam('include_dimension', 'true').toJSON().fetch()
             *      data.then(function (result) {
             *          // 'result' is an object which content the data including count in json object form
             *       },function (error) {
             *          // error function
             *      })
             * @returns {Assets}
             * @instance
           */

    }, {
        key: 'addParam',
        value: function addParam(key, value) {
            if (key && typeof key === 'string' && value && typeof value === 'string') {
                this._query[key] = value;
                return this;
            } else {
                console.error("Kindly provide a valid parameters.");
            }
        }

        /**
           * Fetches a particular asset based on the provided asset UID.
           * @memberOf Assets
           * @example
           * Stack.Assets('assets_uid').toJSON().fetch()
           * @returns {promise}
           * @instance
           */

    }, {
        key: 'fetch',
        value: function fetch() {
            if (this.asset_uid) {
                this.requestParams = {
                    method: 'POST',
                    headers: this.headers,
                    url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.assets + this.asset_uid,
                    body: {
                        _method: 'GET',
                        query: this._query
                    }
                };
                return Utils.sendRequest(this);
            } else {
                console.error("Kindly provide an asset uid. e.g. .Assets('bltsomething123')");
            }
        }
    }]);

    return Assets;
}();

exports.default = Assets;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Result
 * @summary Creates an instance of `Result`.
 * @description An initializer is responsible for creating Result object.
 * @param {Object} object - API result object
 * @example
 * blogEntry.then(function (result) {
 *      // sucess function
 * },function (error) {
 *      // error function
 * })
 * @example
 * assetQuery.then(function (result) {
 *      // sucess function
 * },function (error) {
 *      // error function
 * })
 * @returns {Result}
 * @instance 
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
     * @memberOf Result
     * @description Converts `Result` to plain javascript object.
     * @example
     * blogEntry.then(function (result) {
     *      result = result[0][0].toJSON()
     * },function (error) {
     *      // error function
     * })
     * @example
     * assetQuery.then(function (result) {
     *      result = result[0][0].toJSON()
     * },function (error) {
     *      // error function
     * })
     * @returns {object}
     * @instance 
     */


    _createClass(Result, [{
        key: 'toJSON',
        value: function toJSON() {
            return this.object() ? Utils.mergeDeep(JSON.parse(JSON.stringify({})), this.object()) : null;
        }

        /**
          * @method get
          * @memberOf Result
          * @description Retrieve details of a field based on the UID provided
          * @param field_uid uid of the field
          * @example
          * blogEntry.then(function (result) {
          *      let value = result[0][0].get(field_uid)
          * },function (error) {
          *      // error function
          * })
          * @example
          * assetQuery.then(function (result) {
          *      let value = result[0][0].get(field_uid)
          * },function (error) {
          *      // error function
          * })
          * @returns {promise}
          * @instance  
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

        /**
        * @method getDownloadUrl
        * @memberOf Result
        * @description Retrieves the download URL based on the disposition value.
        * @param {String} string - disposition value
        * @example
        * assetQuery.then(function (result) {
        *      let value = result[0][0].getDownloadUrl(disposition_value)
        * },function (error) {
        *      // error function
        * })
        * @returns {Object}
        * @instance    
        */

    }, {
        key: 'getDownloadUrl',
        value: function getDownloadUrl(disposition) {
            if (this.object()) {
                var url = this.object().url ? this.object().url : null,
                    _disposition = disposition && typeof disposition === 'string' ? disposition : 'attachment';
                return url ? url + '?disposition=' + _disposition : null;
            }
        }
    }]);

    return Result;
}();

module.exports = function (object) {
    return new Result(object);
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localStorage = __webpack_require__(24);

var _localStorage2 = _interopRequireDefault(_localStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _localStorage2.default;

/***/ })
/******/ ]);