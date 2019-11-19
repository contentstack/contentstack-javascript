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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
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

var _request = __webpack_require__(2);

var _request2 = _interopRequireDefault(_request);

var _result = __webpack_require__(15);

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

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


var _config = __webpack_require__(8);

var _config2 = _interopRequireDefault(_config);

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _entry = __webpack_require__(5);

var _entry2 = _interopRequireDefault(_entry);

var _assets = __webpack_require__(14);

var _assets2 = _interopRequireDefault(_assets);

var _query = __webpack_require__(6);

var _query2 = _interopRequireDefault(_query);

var _request = __webpack_require__(2);

var _request2 = _interopRequireDefault(_request);

var _cache = __webpack_require__(4);

var cache = _interopRequireWildcard(_cache);

var _index = __webpack_require__(3);

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


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = Request;

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _http = __webpack_require__(16);

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//JS SDK version
var version = '3.8.0';
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _localstorage = __webpack_require__(12);

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

var _localstorage = __webpack_require__(17);

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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _request = __webpack_require__(2);

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
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 10 */
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
/* 11 */
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
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stack = __webpack_require__(1);

var _stack2 = _interopRequireDefault(_stack);

var _index = __webpack_require__(3);

var _index2 = _interopRequireDefault(_index);

var _contentstackregion = __webpack_require__(7);

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
/* 14 */
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

var _query = __webpack_require__(6);

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
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localStorage = __webpack_require__(9);

var _localStorage2 = _interopRequireDefault(_localStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _localStorage2.default;

/***/ })
/******/ ]);