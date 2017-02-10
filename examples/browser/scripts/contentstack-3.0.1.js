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

	"use strict";
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var Stack = __webpack_require__(1);
	var Utils = __webpack_require__(3);
	var CacheProvider = __webpack_require__(31);

	/**
	 * @method Contentstack
	 * @description Creates an instance of `Contentstack`.
	 * @api public
	 */
	var Contentstack = function() {};

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
	Contentstack.prototype.Stack = function() {
	    var stack = new Stack();
	    return stack.initialize.apply(stack, arguments);
	}

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
	Contentstack.prototype.CachePolicy = CacheProvider.policies;

	/**
	 * Expose `Contentstack`.
	 * @ignore
	 */
	var contentstack = new Contentstack();

	/**
	 * @ignore
	 */
	// set an instance in 'window' for browser.
	if (Utils.isBrowser())
	    window.Contentstack = contentstack;

	// set an instance in exports for node.
	if (typeof module === "object" && module.exports)
	    module.exports = contentstack;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var Request = __webpack_require__(2);
	var Utils = __webpack_require__(3);
	var cache = __webpack_require__(27);
	var Config = __webpack_require__(29);
	var Entry = __webpack_require__(30);
	var Query = __webpack_require__(33);
	var CacheProvider = __webpack_require__(31);

	/**
	 * @constructor Stack
	 * @description An initializer is responsible for instantiating Built.io Contentstack Stack.
	 * @api protected
	 * @ignore
	 */
	function Stack() {
	    this.config = Config;
	}

	/**
	 * @method setPort
	 * @description Sets the port of the host.
	 * @param {Number} port - Port Number
	 * @return Stack
	 * */
	Stack.prototype.setPort = function (port) {
	    if(typeof port === "number") this.config.port = port;
	    return this;
	}

	/**
	 * @method setProtocol
	 * @description Sets the protocol of the host.
	 * @param {String} protocol - http/https protocol
	 * @return Stack
	 * */
	Stack.prototype.setProtocol = function (protocol) {
	    if(typeof protocol === "string" && ~["https", "http"].indexOf(protocol)) this.config.protocol = protocol;
	    return this;
	}

	/**
	 * @method setHost
	 * @description Sets the host of the API server.
	 * @param {String} host - valid ip or host
	 * @return Stack
	 * */
	Stack.prototype.setHost = function (host) {
	    if(typeof host === "string" && host) this.config.host = host;
	    return this;
	}

	/**
	 * Initialize headers and environment.
	 * @api protected
	 * @ignore
	 */
	Stack.prototype.initialize = function () {
	    var self = this;
	    self.cachePolicy = CacheProvider.policies.IGNORE_CACHE;
	    self.provider = CacheProvider.providers('localstorage');
	    switch (arguments.length) {
	        case 1:
	            if (typeof arguments[0] === "object" && typeof arguments[0].api_key === "string" && typeof arguments[0].access_token === "string" && typeof arguments[0].environment === "string") {
	                self.headers = {
	                    api_key: arguments[0].api_key,
	                    access_token: arguments[0].access_token
	                };
	                self.environment = arguments[0].environment;
	                return self;
	            } else {
	                console.error("Kindly provide valid object parameters.");
	            }
	        case 3:
	            if (typeof arguments[0] === "string" && typeof arguments[1] === "string" && typeof arguments[2] === "string") {
	                self.headers = {
	                    api_key: arguments[0],
	                    access_token: arguments[1]
	                };
	                self.environment = arguments[2];
	                return self;
	            } else {
	                console.error("Kindly provide valid string parameters.");
	            }
	        default:
	            console.error("Kindly provide valid parameters to initialize the Built.io Contentstack javascript-SDK Stack.");
	    }
	};

	/**
	 * Get environment UID
	 *
	 * @param {String} env
	 * @param {String} api_key
	 * @api protected
	 * @ignore
	 */

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
	Stack.prototype.setCachePolicy = function(policy) {
	    if(typeof policy === 'number' && policy >= -1 && policy < 4) {
	        if(!this._query) {
	            this.cachePolicy = policy;
	        } else {
	            this.queryCachePolicy = policy;
	        }
	    } else {
	        console.error("Kindly provide the valid policy");
	    }
	    return this;
	};

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
	Stack.prototype.setCacheProvider = function(provider) {
	    if(provider && typeof provider === 'object') {
	        this.provider = provider;

	    }
	    return this;
	};

	/**
	 * @method clearByQuery
	 * @description 'clearByQuery' function to clear the query from the cache.
	 * @example
	 * Stack.clearQuery(query, callback);
	 * @ignore
	 */
	Stack.prototype.clearByQuery = function () {
	    if(this.provider && typeof this.provider.clearByQuery === 'function') {
	        return this.provider.clearByQuery.apply(this.provider, arguments);
	    }
	};

	/**
	 * @method clearByContentType
	 * @description 'clearByContentType' function to clear the query from the cache by specified content type.
	 * @example
	 * Stack.clearByContentType(content_type_uid, callback);
	 * Stack.clearByContentType(content_type_uid, language_uid, callback);
	 * @ignore
	 */
	Stack.prototype.clearByContentType = function () {
	    if(this.provider && typeof this.provider.clearByContentType === 'function') {
	        return this.provider.clearByContentType.apply(this.provider, arguments);
	    }
	};

	/**
	 * @method clearAll
	 * @description 'clearAll' function to clear all the queries from cache.
	 * @example
	 * Stack.clearAll(callback);
	 * @ignore
	 */
	Stack.prototype.clearAll = function () {
	    if(this.provider && typeof this.provider.clearAll === 'function') {
	        return this.provider.clearAll.apply(this.provider, arguments);
	    }
	};

	/**
	 * @method getCacheProvider
	 * @description Returns currently set CacheProvider object.
	 * @example Stack.getCacheProvider();
	 * @returns {Object}
	 */
	Stack.prototype.getCacheProvider = function() {
	    return this.provider;
	};

	/**
	 * @method ContentType
	 * @description Set "ContentType" from the Stack from where you want to retrive the entries.
	 * @param {String} [content_type_uid] - uid of the existing contenttype
	 * @returns {Stack}
	 */
	Stack.prototype.ContentType = function (uid) {
	    if (uid && typeof uid === 'string') {
	        this.content_type_uid = uid;
	    }
	    return this;
	};

	/**
	 * @method Entry
	 * @description Set the Entry Uid which you want to retrive from the Contenttype specified.
	 * @param {String} uid - entry_uid
	 * @example ContentType('blog').Entry('blt1234567890abcef')
	 * @returns {Entry}
	 */
	Stack.prototype.Entry = function (uid) {
	    var entry = new Entry();
	    if (uid && typeof uid === "string") {
	        entry.entry_uid = uid;
	    }
	    return Utils.merge(entry, this);
	};

	/**
	 * @method Query
	 * @description Query instance to provide support for all search queries.
	 * @example ContentType('blog').Query()
	 * @returns {Query}
	 */
	Stack.prototype.Query = function () {
	    var query = new Query();
	    return Utils.merge(query, this);
	};

	/**
	 * @method getLastActivites
	 * @description getLastActivites get all the ContentTypes whose last activity updated.
	 * @example Stack.getLastActivites()
	 * @returns {Stack}
	 * @ignore
	 */
	Stack.prototype.getLastActivities = function () {
	    var query = {
	            method: 'POST',
	            headers: this.headers,
	            url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types,
	            body: {
	                _method: 'GET',
	                only_last_activity: true,
	                environment:this.environment
	            }
	        };
	    return Request(query);
	};

	/**
	 * Expose `Stack`.
	 * @ignore
	 */
	module.exports = Stack;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 */
	var HTTPRequest;
	var Utils = __webpack_require__(3);
	var when = __webpack_require__(5);

	// if script is running under node.js then use node-XMLHttpRequest node modules for the built-in http client to emulate the browser XMLHttpRequest object.
	// else assign XMLHttpRequest object
	if (Utils.isBrowser() && XMLHttpRequest) {
	    HTTPRequest = XMLHttpRequest;
	} else {
	    HTTPRequest = __webpack_require__(26).XMLHttpRequest;
	}

	function Request(options) {
	    var serialize = function(obj, prefix) {
	      var str = [], p;
	      for(p in obj) {
	        if (obj.hasOwnProperty(p)) {
	          var k = prefix ? prefix + "[" + p + "]" : p,
	              v = obj[p];
	          str.push((v !== null && typeof v === "object" && p !== 'query') ?
	            serialize(v, k) :
	            encodeURIComponent(k) + "=" + (p !== 'query' ? encodeURIComponent(v) : JSON.stringify(v)));
	        }
	      }
	      return str.join("&");
	    }
	    
	    var deferred = when.defer();
	    var xhr = new HTTPRequest(),
	        method = "GET",
	        url = options.url,
	        headers = options.headers;

	    if(options.body && typeof options.body === 'object'){
	        delete options.body._method;    
	        var queryParams = serialize(options.body);
	    }
	    
	    
	    //make all calls as GET instead of POST
	    xhr.open(method, url+'?'+queryParams, true);
	    // set headers
	    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	    for (var header in headers) {
	        xhr.setRequestHeader(header, headers[header]);
	    }

	    // send stringify data
	    if (options.body && method == "POST" || method == "PUT") {
	        if (typeof options.body === 'object') {
	            xhr.send(JSON.stringify(options.body));
	        } else {
	            xhr.send(options.body);
	        }
	    } else {
	        xhr.send();
	    }

	    // collect response
	    xhr.onreadystatechange = function() {
	        if (xhr.readyState === 4) {
	            var data = xhr.responseText,
	                error;
	            try {
	                data = JSON.parse(data);
	            } catch (e) {
	                error = {error_code: 141, message: 'Could not parse the response received from the server.'};
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

	/**
	 * Expose `Request`.
	 */
	module.exports = Request;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var when = __webpack_require__(5);
	var utils = {};
	module.exports = exports = utils;

	// check variable type
	exports._type = function(val) {
	    var _typeof,
	        __typeof = typeof val;
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
	exports.mergeDeep = function(target, source) {
	    var self = this;
	    var _merge_recursive = function(target, source) {
	        for (var key in source) {
	            if (self._type(source[key]) == 'object' && self._type(target[key]) == self._type(source[key])) {
	                _merge_recursive(target[key], source[key])
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
	exports.merge = function(target, source) {
	    if (target && source) {
	        for (var key in source) {
	            target[key] = source[key];
	        }
	    }
	    return target;
	};

	// set access token
	exports.setAccessToken = function(entry) {
	    if (typeof entry === 'object') {
	        for (var key in entry) {
	            if (key === "content_type" && entry['url'] && entry['uid']) {
	                entry['url'] += ((~entry['url'].indexOf('?')) ? '&' : '?') + this.token_queryString;
	            } else if (typeof entry[key] === 'string') {
	                entry[key] = entry[key].replace(/https:[/][/](dev-|stag-|)api.(built|contentstack).io[/](.*?)[/]download(.*?)uid=([a-z0-9]+)/gi, function(val) {
	                    return val + '&' + this.token_queryString;
	                }.bind(this));
	            } else if (typeof entry[key] === 'object') {
	                this.setAccessToken(entry[key]);
	            }
	        }
	    }
	    return entry;
	};

	// get data with authtoken
	exports.getData = function(data, token_queryString) {
	    this.token_queryString = 'AUTHTOKEN=' + token_queryString;
	    if (data && Array.isArray(data.entries)) {
	        data.entries.forEach(function(val) {
	            this.setAccessToken(val)
	        }.bind(this));
	    } else if (data && data.entry) {
	        this.setAccessToken(data.entry)
	    }
	    return data;
	};

	// return true if process is running in browser else false
	exports.isBrowser = function() {
	    return (typeof window !== "undefined" && typeof process === "object" && process.title === "browser");
	};


	// return the query from the params
	exports.parseQueryFromParams = function(queryObject, single, toJSON) {
	    if(queryObject && queryObject.requestParams) {
	        var _query = this.merge({}, ((queryObject.requestParams.body) ? queryObject.requestParams.body.query || {} : {}));
	        if(_query.environment_uid) {
	            delete _query.environment_uid;
	            _query.environment = queryObject.environment;
	        }
	        _query.environment = queryObject.environment;
	        return {
	            content_type_uid: queryObject.content_type_uid,
	            locale: _query.locale || 'en-us',
	            query: _query,
	            entry_uid: queryObject.entry_uid,
	            single:  single || "false",
	            toJSON: toJSON || "false",
	            api_key: (queryObject.requestParams.headers) ? queryObject.requestParams.headers.api_key : ""
	        };
	    }
	};

	// returrn the hash value of the query
	exports.getHash = function(query) {
	    try {
	        var hashValue = utils.generateHash(JSON.stringify(query)),
	            keyArray = [];
	        keyArray.push(query.content_type_uid);
	        keyArray.push(query.locale);
	        if(query.entry_uid) keyArray.push(query.entry_uid);
	        keyArray.push(hashValue);
	        return keyArray.join('.');
	    } catch(e) {}
	};

	// return the hash value of the string
	exports.generateHash = function(str) {
	    var hash = 0, i, chr, len;
	    if (str.length === 0) return hash;
	    for (i = 0, len = str.length; i < len; i++) {
	        chr   = str.charCodeAt(i);
	        hash  = ((hash << 5) - hash) + chr;
	        hash |= 0; // Convert to 32bit integer
	    }
	    return ((hash < -1) ? hash * -1 : hash);
	};

	// generate the Result object
	exports.resultWrapper = function(result) {
	    var Result = __webpack_require__(25);
	    if(result && result.entries && typeof result.entries !== 'undefined') {
	        if(result.entries && result.entries.length) {
	            for(var i = 0, _i = result.entries.length; i < _i; i++) {
	                result.entries[i] = Result(result.entries[i]);
	            }
	        } else {
	            result.entries = [];
	        }
	    } else if(result && typeof result.entry !== 'undefined') {
	        result.entry = Result(result.entry);
	    }
	    return result;
	};

	// spread the result object
	exports.spreadResult = function(result) {
	    var _results = [];
	    if(result && typeof result === "object" && Object.keys(result).length) {
	        if(typeof result.entries !== 'undefined') _results.push(result.entries);
	        if(typeof result.schema !== 'undefined') _results.push(result.schema);
	        if(typeof result.count !== 'undefined') _results.push(result.count);
	        if(typeof result.entry !== 'undefined') _results = result.entry;
	    }
	    return _results;
	};

	exports.sendRequest = function (queryObject) {
	    var Request = __webpack_require__(2);
	    var env_uid = queryObject.environment_uid;
	    if (env_uid) {
	        queryObject._query.environment_uid = env_uid;
	    } else {
	        queryObject._query.environment = queryObject.environment;
	    }
	    var deferred = when.defer();
	    var self = queryObject;
	    var continueFlag = false;
	    var cachePolicy = (typeof self.queryCachePolicy !== 'undefined') ? self.queryCachePolicy : self.cachePolicy;
	    var tojson = (typeof self.tojson !== 'undefined') ? self.tojson : false;
	    var isSingle = (self.entry_uid || self.singleEntry) ? true : false;
	    var hashQuery = utils.getHash(utils.parseQueryFromParams(self, isSingle, tojson));
	    var spreadResult;
	    /**
	        for new api v3
	    */
	    if(queryObject && queryObject.requestParams && queryObject.requestParams.body && queryObject.requestParams.body.query){
	        var cloneQueryObj = JSON.parse(JSON.stringify(queryObject.requestParams.body.query));
	        if(typeof cloneQueryObj !== 'object') {
	            cloneQueryObj = JSON.parse(cloneQueryObj);
	        }
	        delete queryObject.requestParams.body.query;
	        queryObject.requestParams.body =  this.merge(queryObject.requestParams.body,cloneQueryObj);
	    }

	    var getCacheCallback = function () {
	        return function (err, entries) {
	            try {
	                if (err) throw err;
	                if (!tojson) entries = utils.resultWrapper(entries);
	                spreadResult = utils.spreadResult(entries);
	                return deferred.resolve(spreadResult);
	            } catch (e) {
	                return deferred.reject(e);
	            }
	        }
	    };

	    var callback = function (continueFlag) {
	        if(continueFlag) {
	            Request(queryObject.requestParams)
	                .then(function (data) {
	                    try {
	                        self.entry_uid = self.tojson = self.queryCachePolicy = undefined;
	                        var entries = {};
	                        if (queryObject.singleEntry) {
	                            queryObject.singleEntry = false;
	                            if(data.schema) entries.schema = data.schema;
	                            if (data.entries && data.entries.length) {
	                                entries.entry = utils.getData(data, queryObject.headers.access_token).entries[0];
	                            } else {
	                                if(cachePolicy === 2) {
	                                    self.provider.get(hashQuery, getCacheCallback());
	                                } else {
	                                    return deferred.reject({ error_code: 141, error_message: 'The requested entry doesn\'t exist.' });
	                                }
	                                return;
	                            }
	                        } else {
	                            entries = utils.getData(data, queryObject.headers.access_token);
	                        }
	                        if(cachePolicy !== -1) {
	                            self.provider.set(hashQuery, entries, function (err) {
	                                try {
	                                    if (err) throw err;
	                                    if(!tojson) entries = utils.resultWrapper(entries);
	                                    spreadResult = utils.spreadResult(entries);
	                                    return deferred.resolve(spreadResult);
	                                } catch(e) {
	                                    return deferred.reject(e);
	                                }
	                            });
	                        } else {
	                            if(!tojson) entries = utils.resultWrapper(entries);
	                            spreadResult = utils.spreadResult(entries);
	                            return deferred.resolve(spreadResult);
	                        }
	                    } catch (e) {
	                        return deferred.reject({
	                            message: e.message
	                        });
	                    }
	                }.bind(self))
	                .catch(function (error) {
	                    if(cachePolicy === 2) {
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
	                    if(err || !_data) {
	                        callback(true);
	                    } else {
	                        if (!tojson) _data = utils.resultWrapper(_data);
	                        spreadResult = utils.spreadResult(_data);
	                        return deferred.resolve(spreadResult);
	                    }
	                } catch(e) {
	                    return deferred.reject(e);
	                }
	            });
	            break;
	        case 2:
	        case 0:
	        case -1:
	            callback(true);
	    };
	    if(cachePolicy !== 3) {
	        return deferred.promise;
	    } else {
	        return {
	            cache: (function () {
	                var Defer = when.defer();
	                self.provider.get(hashQuery, function (err, _data) {
	                    try {
	                        if(err) {
	                            return Defer.reject(err);
	                        } else {
	                            if (!tojson) _data = utils.resultWrapper(_data);
	                            spreadResult = utils.spreadResult(_data);
	                            return Defer.resolve(spreadResult);
	                        }
	                    } catch(e) {
	                        return Defer.reject(e);
	                    }
	                });
	                return Defer.promise;
	            }()),
	            network: (function () {
	                callback(true);
	                return deferred.promise;
	            }()),
	            both: function (_callback_) {
	                self.provider.get(hashQuery, function (err, entries) {
	                    if (!tojson) entries = utils.resultWrapper(entries);
	                    spreadResult = utils.spreadResult(entries);
	                    _callback_(err, spreadResult)
	                });
	                Request(queryObject.requestParams)
	                    .then(function (data) {
	                        try {
	                            self.entry_uid = self.tojson = self.queryCachePolicy = undefined;
	                            var entries = {}, error = null;
	                            if (queryObject.singleEntry) {
	                                queryObject.singleEntry = false;
	                                if(data.schema) entries.schema = data.schema;
	                                if (data.entries && data.entries.length) {
	                                    entries.entry = utils.getData(data, queryObject.headers.access_token).entries[0];
	                                } else {
	                                    error = { error_code: 141, error_message: 'The requested entry doesn\'t exist.' };
	                                }
	                            } else {
	                                entries = utils.getData(data, queryObject.headers.access_token);
	                            }
	                            if(!tojson) entries = utils.resultWrapper(entries);
	                            spreadResult = utils.spreadResult(entries);
	                            _callback_(error, spreadResult);
	                        } catch (e) {
	                            _callback_(e);
	                        }
	                    }.bind(self))
	                    .catch(function (error) {
	                        _callback_(error);
	                    });
	            }

	        };
	    }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

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
	function defaultClearTimeout () {
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
	} ())
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
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
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
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
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
	    while(len) {
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

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */

	/**
	 * Promises/A+ and when() implementation
	 * when is part of the cujoJS family of libraries (http://cujojs.com/)
	 * @author Brian Cavalier
	 * @author John Hann
	 */
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

		var timed = __webpack_require__(6);
		var array = __webpack_require__(11);
		var flow = __webpack_require__(14);
		var fold = __webpack_require__(15);
		var inspect = __webpack_require__(16);
		var generate = __webpack_require__(17);
		var progress = __webpack_require__(18);
		var withThis = __webpack_require__(19);
		var unhandledRejection = __webpack_require__(20);
		var TimeoutError = __webpack_require__(10);

		var Promise = [array, flow, fold, generate, progress,
			inspect, withThis, timed, unhandledRejection]
			.reduce(function(Promise, feature) {
				return feature(Promise);
			}, __webpack_require__(22));

		var apply = __webpack_require__(13)(Promise);

		// Public API

		when.promise     = promise;              // Create a pending promise
		when.resolve     = Promise.resolve;      // Create a resolved promise
		when.reject      = Promise.reject;       // Create a rejected promise

		when.lift        = lift;                 // lift a function to return promises
		when['try']      = attempt;              // call a function and return a promise
		when.attempt     = attempt;              // alias for when.try

		when.iterate     = Promise.iterate;      // DEPRECATED (use cujojs/most streams) Generate a stream of promises
		when.unfold      = Promise.unfold;       // DEPRECATED (use cujojs/most streams) Generate a stream of promises

		when.join        = join;                 // Join 2 or more promises

		when.all         = all;                  // Resolve a list of promises
		when.settle      = settle;               // Settle a list of promises

		when.any         = lift(Promise.any);    // One-winner race
		when.some        = lift(Promise.some);   // Multi-winner race
		when.race        = lift(Promise.race);   // First-to-settle race

		when.map         = map;                  // Array.map() for promises
		when.filter      = filter;               // Array.filter() for promises
		when.reduce      = lift(Promise.reduce);       // Array.reduce() for promises
		when.reduceRight = lift(Promise.reduceRight);  // Array.reduceRight() for promises

		when.isPromiseLike = isPromiseLike;      // Is something promise-like, aka thenable

		when.Promise     = Promise;              // Promise constructor
		when.defer       = defer;                // Create a {promise, resolve, reject} tuple

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
			return function() {
				for(var i=0, l=arguments.length, a=new Array(l); i<l; ++i) {
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
			for(var i=0, l=arguments.length-1, a=new Array(l); i<l; ++i) {
				a[i] = arguments[i+1];
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

			function resolve(x) { p._handler.resolve(x); }
			function reject(x) { p._handler.reject(x); }
			function notify(x) { p._handler.notify(x); }

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
		function join(/* ...promises */) {
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
			return when(promises, function(promises) {
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
			return when(promises, function(promises) {
				return Promise.filter(promises, predicate);
			});
		}

		return when;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(__webpack_require__(9));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

		var env = __webpack_require__(7);
		var TimeoutError = __webpack_require__(10);

		function setTimeout(f, ms, x, y) {
			return env.setTimer(function() {
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
			Promise.prototype.delay = function(ms) {
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
			Promise.prototype.timeout = function(ms, reason) {
				var p = this._beget();
				var h = p._handler;

				var t = setTimeout(onTimeout, ms, reason, p._handler);

				this._handler.visit(h,
					function onFulfill(x) {
						env.clearTimer(t);
						this.resolve(x); // this = h
					},
					function onReject(x) {
						env.clearTimer(t);
						this.reject(x); // this = h
					},
					h.notify);

				return p;
			};

			function onTimeout(reason, h, ms) {
				var e = typeof reason === 'undefined'
					? new TimeoutError('timed out after ' + ms + 'ms')
					: reason;
				h.reject(e);
			}

			return Promise;
		};

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;var require;/* WEBPACK VAR INJECTION */(function(process) {/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	/*global process,document,setTimeout,clearTimeout,MutationObserver,WebKitMutationObserver*/
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
		/*jshint maxcomplexity:6*/

		// Sniff "best" async scheduling option
		// Prefer process.nextTick or MutationObserver, then check for
		// setTimeout, and finally vertx, since its the only env that doesn't
		// have setTimeout

		var MutationObs;
		var capturedSetTimeout = typeof setTimeout !== 'undefined' && setTimeout;

		// Default env
		var setTimer = function(f, ms) { return setTimeout(f, ms); };
		var clearTimer = function(t) { return clearTimeout(t); };
		var asap = function (f) { return capturedSetTimeout(f, 0); };

		// Detect specific env
		if (isNode()) { // Node
			asap = function (f) { return process.nextTick(f); };

		} else if (MutationObs = hasMutationObserver()) { // Modern browser
			asap = initMutationObserver(MutationObs);

		} else if (!capturedSetTimeout) { // vert.x
			var vertxRequire = require;
			var vertx = __webpack_require__(8);
			setTimer = function (f, ms) { return vertx.setTimer(ms, f); };
			clearTimer = vertx.cancelTimer;
			asap = vertx.runOnLoop || vertx.runOnContext;
		}

		return {
			setTimer: setTimer,
			clearTimer: clearTimer,
			asap: asap
		};

		function isNode () {
			return typeof process !== 'undefined' &&
				Object.prototype.toString.call(process) === '[object process]';
		}

		function hasMutationObserver () {
			return (typeof MutationObserver === 'function' && MutationObserver) ||
				(typeof WebKitMutationObserver === 'function' && WebKitMutationObserver);
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
				node.data = (i ^= 1);
			};
		}
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		/**
		 * Custom error type for promises rejected by promise.timeout
		 * @param {string} message
		 * @constructor
		 */
		function TimeoutError (message) {
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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

		var state = __webpack_require__(12);
		var applier = __webpack_require__(13);

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
			Promise.prototype.spread = function(onFulfilled) {
				return this.then(all).then(function(array) {
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
				var l = promises.length>>>0;

				var pending = l;
				var errors = [];

				for (var h, x, i = 0; i < l; ++i) {
					x = promises[i];
					if(x === void 0 && !(i in promises)) {
						--pending;
						continue;
					}

					h = Promise._handler(x);
					if(h.state() > 0) {
						resolver.become(h);
						Promise._visitRemaining(promises, i, h);
						break;
					} else {
						h.visit(resolver, handleFulfill, handleReject);
					}
				}

				if(pending === 0) {
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
					if(this.resolved) { // this === resolver
						return;
					}

					errors.push(e);
					if(--pending === 0) {
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

				var l = promises.length>>>0;
				var nFulfill = 0;
				var nReject;
				var x, i; // reused in both for() loops

				// First pass: count actual array items
				for(i=0; i<l; ++i) {
					x = promises[i];
					if(x === void 0 && !(i in promises)) {
						continue;
					}
					++nFulfill;
				}

				// Compute actual goals
				n = Math.max(n, 0);
				nReject = (nFulfill - n + 1);
				nFulfill = Math.min(n, nFulfill);

				if(n > nFulfill) {
					resolver.reject(new RangeError('some(): array must contain at least '
					+ n + ' item(s), but had ' + nFulfill));
				} else if(nFulfill === 0) {
					resolver.resolve(results);
				}

				// Second pass: observe each array item, make progress toward goals
				for(i=0; i<l; ++i) {
					x = promises[i];
					if(x === void 0 && !(i in promises)) {
						continue;
					}

					Promise._handler(x).visit(resolver, fulfill, reject, resolver.notify);
				}

				return p;

				function fulfill(x) {
					/*jshint validthis:true*/
					if(this.resolved) { // this === resolver
						return;
					}

					results.push(x);
					if(--nFulfill === 0) {
						errors = null;
						this.resolve(results);
					}
				}

				function reject(e) {
					/*jshint validthis:true*/
					if(this.resolved) { // this === resolver
						return;
					}

					errors.push(e);
					if(--nReject === 0) {
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
				return Promise._traverse(predicate, a).then(function(keep) {
					return filterSync(a, keep);
				});
			}

			function filterSync(promises, keep) {
				// Safe because we know all promises have fulfilled if we've made it this far
				var l = keep.length;
				var filtered = new Array(l);
				for(var i=0, j=0; i<l; ++i) {
					if(keep[i]) {
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
				var h = Promise._handler(p);
				if(h.state() === 0) {
					return toPromise(p).then(state.fulfilled, state.rejected);
				}

				h._unreport();
				return state.inspect(h);
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
				return arguments.length > 2 ? ar.call(promises, liftCombine(f), arguments[2])
						: ar.call(promises, liftCombine(f));
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
				return arguments.length > 2 ? arr.call(promises, liftCombine(f), arguments[2])
						: arr.call(promises, liftCombine(f));
			}

			function liftCombine(f) {
				return function(z, x, i) {
					return applyFold(f, void 0, [z,x,i]);
				};
			}
		};

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

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
			return state === 0 ? toPendingState()
				 : state > 0   ? toFulfilledState(handler.value)
				               : toRejectedState(handler.value);
		}

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		makeApply.tryCatchResolve = tryCatchResolve;

		return makeApply;

		function makeApply(Promise, call) {
			if(arguments.length < 2) {
				call = tryCatchResolve;
			}

			return apply;

			function apply(f, thisArg, args) {
				var p = Promise._defer();
				var l = args.length;
				var params = new Array(l);
				callAndResolve({ f:f, thisArg:thisArg, args:args, params:params, i:l-1, call:call }, p._handler);

				return p;
			}

			function callAndResolve(c, h) {
				if(c.i < 0) {
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
			} catch(e) {
				resolver.reject(e);
			}
		}

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));




/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

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
			Promise.prototype.done = function(onResult, onError) {
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
			Promise.prototype['catch'] = Promise.prototype.otherwise = function(onRejected) {
				if (arguments.length < 2) {
					return origCatch.call(this, onRejected);
				}

				if(typeof onRejected !== 'function') {
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
				return function(e) {
					return evaluatePredicate(e, predicate)
						? handler.call(this, e)
						: reject(e);
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
			Promise.prototype['finally'] = Promise.prototype.ensure = function(handler) {
				if(typeof handler !== 'function') {
					return this;
				}

				return this.then(function(x) {
					return runSideEffect(handler, this, identity, x);
				}, function(e) {
					return runSideEffect(handler, this, reject, e);
				});
			};

			function runSideEffect (handler, thisArg, propagate, value) {
				var result = handler.call(thisArg);
				return maybeThenable(result)
					? propagateValue(result, propagate, value)
					: propagate(value);
			}

			function propagateValue (result, propagate, x) {
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
			Promise.prototype['else'] = Promise.prototype.orElse = function(defaultValue) {
				return this.then(void 0, function() {
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
			Promise.prototype['yield'] = function(value) {
				return this.then(function() {
					return value;
				});
			};

			/**
			 * Runs a side effect when this promise fulfills, without changing the
			 * fulfillment value.
			 * @param {function} onFulfilledSideEffect
			 * @returns {Promise}
			 */
			Promise.prototype.tap = function(onFulfilledSideEffect) {
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
			return predicate === Error
				|| (predicate != null && predicate.prototype instanceof Error);
		}

		function maybeThenable(x) {
			return (typeof x === 'object' || typeof x === 'function') && x !== null;
		}

		function identity(x) {
			return x;
		}

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	/** @author Jeff Escalante */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		return function fold(Promise) {

			Promise.prototype.fold = function(f, z) {
				var promise = this._beget();

				this._handler.fold(function(z, x, to) {
					Promise._handler(z).fold(function(x, z, to) {
						to.resolve(f.call(this, z, x));
					}, x, this, to);
				}, z, promise._handler.receiver, promise._handler);

				return promise;
			};

			return Promise;
		};

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

		var inspect = __webpack_require__(12).inspect;

		return function inspection(Promise) {

			Promise.prototype.inspect = function() {
				return inspect(Promise._handler(this));
			};

			return Promise;
		};

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

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
				return unfold(function(x) {
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
				return resolve(x).then(function(seed) {
					return resolve(condition(seed)).then(function(done) {
						return done ? seed : resolve(unspool(seed)).spread(next);
					});
				});

				function next(item, newSeed) {
					return resolve(handler(item)).then(function() {
						return unfold(unspool, condition, handler, newSeed);
					});
				}
			}
		};

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		return function progress(Promise) {

			/**
			 * @deprecated
			 * Register a progress handler for this promise
			 * @param {function} onProgress
			 * @returns {Promise}
			 */
			Promise.prototype.progress = function(onProgress) {
				return this.then(void 0, void 0, onProgress);
			};

			return Promise;
		};

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

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
			Promise.prototype['with'] = Promise.prototype.withThis = function(receiver) {
				var p = this._beget();
				var child = p._handler;
				child.receiver = receiver;
				this._handler.chain(child, receiver);
				return p;
			};

			return Promise;
		};

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));



/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

		var setTimer = __webpack_require__(7).setTimer;
		var format = __webpack_require__(21);

		return function unhandledRejection(Promise) {

			var logError = noop;
			var logInfo = noop;
			var localConsole;

			if(typeof console !== 'undefined') {
				// Alias console to prevent things like uglify's drop_console option from
				// removing console.log/error. Unhandled rejections fall into the same
				// category as uncaught exceptions, and build tools shouldn't silence them.
				localConsole = console;
				logError = typeof localConsole.error !== 'undefined'
					? function (e) { localConsole.error(e); }
					: function (e) { localConsole.log(e); };

				logInfo = typeof localConsole.info !== 'undefined'
					? function (e) { localConsole.info(e); }
					: function (e) { localConsole.log(e); };
			}

			Promise.onPotentiallyUnhandledRejection = function(rejection) {
				enqueue(report, rejection);
			};

			Promise.onPotentiallyUnhandledRejectionHandled = function(rejection) {
				enqueue(unreport, rejection);
			};

			Promise.onFatalRejection = function(rejection) {
				enqueue(throwit, rejection.value);
			};

			var tasks = [];
			var reported = [];
			var running = null;

			function report(r) {
				if(!r.handled) {
					reported.push(r);
					logError('Potentially unhandled rejection [' + r.id + '] ' + format.formatError(r.value));
				}
			}

			function unreport(r) {
				var i = reported.indexOf(r);
				if(i >= 0) {
					reported.splice(i, 1);
					logInfo('Handled previous rejection [' + r.id + '] ' + format.formatObject(r.value));
				}
			}

			function enqueue(f, x) {
				tasks.push(f, x);
				if(running === null) {
					running = setTimer(flush, 0);
				}
			}

			function flush() {
				running = null;
				while(tasks.length > 0) {
					tasks.shift()(tasks.shift());
				}
			}

			return Promise;
		};

		function throwit(e) {
			throw e;
		}

		function noop() {}

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

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
			var s = typeof e === 'object' && e !== null && (e.stack || e.message) ? e.stack || e.message : formatObject(e);
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
			if(s === '[object Object]' && typeof JSON !== 'undefined') {
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
			} catch(e) {
				return defaultValue;
			}
		}

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

		var makePromise = __webpack_require__(23);
		var Scheduler = __webpack_require__(24);
		var async = __webpack_require__(7).asap;

		return makePromise({
			scheduler: new Scheduler(async)
		});

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(__webpack_require__(9));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process) {/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		return function makePromise(environment) {

			var tasks = environment.scheduler;
			var emitRejection = initEmitRejection();

			var objectCreate = Object.create ||
				function(proto) {
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
				function promiseResolve (x) {
					handler.resolve(x);
				}
				/**
				 * Reject this promise with reason, which will be used verbatim
				 * @param {Error|*} reason rejection reason, strongly suggested
				 *   to be an Error type
				 */
				function promiseReject (reason) {
					handler.reject(reason);
				}

				/**
				 * @deprecated
				 * Issue a progress event, notifying all progress listeners
				 * @param {*} x progress event payload to pass to all listeners
				 */
				function promiseNotify (x) {
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
				return isPromise(x) ? x
					: new Promise(Handler, new Async(getHandler(x)));
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
			Promise.prototype.then = function(onFulfilled, onRejected, onProgress) {
				var parent = this._handler;
				var state = parent.join().state();

				if ((typeof onFulfilled !== 'function' && state > 0) ||
					(typeof onRejected !== 'function' && state < 0)) {
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
			Promise.prototype['catch'] = function(onRejected) {
				return this.then(void 0, onRejected);
			};

			/**
			 * Creates a new, pending promise of the same type as this promise
			 * @private
			 * @returns {Promise}
			 */
			Promise.prototype._beget = function() {
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

				if(pending === 0) {
					resolver.become(new Fulfilled(results));
				}

				return new Promise(Handler, resolver);

				function mapAt(i, x, resolver) {
					if(!resolver.resolved) {
						traverseAt(promises, settleAt, i, tryMap(f, x, i), resolver);
					}
				}

				function settleAt(i, x, resolver) {
					results[i] = x;
					if(--pending === 0) {
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
						visitRemaining(promises, i+1, h);
					}
				} else {
					handler(i, x, resolver);
				}
			}

			Promise._visitRemaining = visitRemaining;
			function visitRemaining(promises, start, handler) {
				for(var i=start; i<promises.length; ++i) {
					markAsHandled(getHandler(promises[i]), handler);
				}
			}

			function markAsHandled(h, handler) {
				if(h === handler) {
					return;
				}

				var s = h.state();
				if(s === 0) {
					h.visit(h, void 0, h._unreport);
				} else if(s < 0) {
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
				if(typeof promises !== 'object' || promises === null) {
					return reject(new TypeError('non-iterable passed to race()'));
				}

				// Sigh, race([]) is untestable unless we return *something*
				// that is recognizable without calling .then() on it.
				return promises.length === 0 ? never()
					 : promises.length === 1 ? resolve(promises[0])
					 : runRace(promises);
			}

			function runRace(promises) {
				var resolver = new Pending();
				var i, x, h;
				for(i=0; i<promises.length; ++i) {
					x = promises[i];
					if (x === void 0 && !(i in promises)) {
						continue;
					}

					h = getHandler(x);
					if(h.state() !== 0) {
						resolver.become(h);
						visitRemaining(promises, i+1, h);
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
				if(isPromise(x)) {
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
					return typeof untrustedThen === 'function'
						? new Thenable(untrustedThen, x)
						: new Fulfilled(x);
				} catch(e) {
					return new Rejected(e);
				}
			}

			/**
			 * Handler for a promise that is pending forever
			 * @constructor
			 */
			function Handler() {}

			Handler.prototype.when
				= Handler.prototype.become
				= Handler.prototype.notify // deprecated
				= Handler.prototype.fail
				= Handler.prototype._unreport
				= Handler.prototype._report
				= noop;

			Handler.prototype._state = 0;

			Handler.prototype.state = function() {
				return this._state;
			};

			/**
			 * Recursively collapse handler chain to find the handler
			 * nearest to the fully resolved value.
			 * @returns {object} handler nearest the fully resolved value
			 */
			Handler.prototype.join = function() {
				var h = this;
				while(h.handler !== void 0) {
					h = h.handler;
				}
				return h;
			};

			Handler.prototype.chain = function(to, receiver, fulfilled, rejected, progress) {
				this.when({
					resolver: to,
					receiver: receiver,
					fulfilled: fulfilled,
					rejected: rejected,
					progress: progress
				});
			};

			Handler.prototype.visit = function(receiver, fulfilled, rejected, progress) {
				this.chain(failIfRejected, receiver, fulfilled, rejected, progress);
			};

			Handler.prototype.fold = function(f, z, c, to) {
				this.when(new Fold(f, z, c, to));
			};

			/**
			 * Handler that invokes fail() on any handler it becomes
			 * @constructor
			 */
			function FailIfRejected() {}

			inherit(Handler, FailIfRejected);

			FailIfRejected.prototype.become = function(h) {
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

			Pending.prototype.resolve = function(x) {
				this.become(getHandler(x));
			};

			Pending.prototype.reject = function(x) {
				if(this.resolved) {
					return;
				}

				this.become(new Rejected(x));
			};

			Pending.prototype.join = function() {
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

			Pending.prototype.run = function() {
				var q = this.consumers;
				var handler = this.handler;
				this.handler = this.handler.join();
				this.consumers = void 0;

				for (var i = 0; i < q.length; ++i) {
					handler.when(q[i]);
				}
			};

			Pending.prototype.become = function(handler) {
				if(this.resolved) {
					return;
				}

				this.resolved = true;
				this.handler = handler;
				if(this.consumers !== void 0) {
					tasks.enqueue(this);
				}

				if(this.context !== void 0) {
					handler._report(this.context);
				}
			};

			Pending.prototype.when = function(continuation) {
				if(this.resolved) {
					tasks.enqueue(new ContinuationTask(continuation, this.handler));
				} else {
					if(this.consumers === void 0) {
						this.consumers = [continuation];
					} else {
						this.consumers.push(continuation);
					}
				}
			};

			/**
			 * @deprecated
			 */
			Pending.prototype.notify = function(x) {
				if(!this.resolved) {
					tasks.enqueue(new ProgressTask(x, this));
				}
			};

			Pending.prototype.fail = function(context) {
				var c = typeof context === 'undefined' ? this.context : context;
				this.resolved && this.handler.join().fail(c);
			};

			Pending.prototype._report = function(context) {
				this.resolved && this.handler.join()._report(context);
			};

			Pending.prototype._unreport = function() {
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

			Async.prototype.when = function(continuation) {
				tasks.enqueue(new ContinuationTask(continuation, this));
			};

			Async.prototype._report = function(context) {
				this.join()._report(context);
			};

			Async.prototype._unreport = function() {
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

			Fulfilled.prototype.fold = function(f, z, c, to) {
				runContinuation3(f, z, this, c, to);
			};

			Fulfilled.prototype.when = function(cont) {
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

			Rejected.prototype.fold = function(f, z, c, to) {
				to.become(this);
			};

			Rejected.prototype.when = function(cont) {
				if(typeof cont.rejected === 'function') {
					this._unreport();
				}
				runContinuation1(cont.rejected, this, cont.receiver, cont.resolver);
			};

			Rejected.prototype._report = function(context) {
				tasks.afterQueue(new ReportTask(this, context));
			};

			Rejected.prototype._unreport = function() {
				if(this.handled) {
					return;
				}
				this.handled = true;
				tasks.afterQueue(new UnreportTask(this));
			};

			Rejected.prototype.fail = function(context) {
				this.reported = true;
				emitRejection('unhandledRejection', this);
				Promise.onFatalRejection(this, context === void 0 ? this.context : context);
			};

			function ReportTask(rejection, context) {
				this.rejection = rejection;
				this.context = context;
			}

			ReportTask.prototype.run = function() {
				if(!this.rejection.handled && !this.rejection.reported) {
					this.rejection.reported = true;
					emitRejection('unhandledRejection', this.rejection) ||
						Promise.onPotentiallyUnhandledRejection(this.rejection, this.context);
				}
			};

			function UnreportTask(rejection) {
				this.rejection = rejection;
			}

			UnreportTask.prototype.run = function() {
				if(this.rejection.reported) {
					emitRejection('rejectionHandled', this.rejection) ||
						Promise.onPotentiallyUnhandledRejectionHandled(this.rejection);
				}
			};

			// Unhandled rejection hooks
			// By default, everything is a noop

			Promise.createContext
				= Promise.enterContext
				= Promise.exitContext
				= Promise.onPotentiallyUnhandledRejection
				= Promise.onPotentiallyUnhandledRejectionHandled
				= Promise.onFatalRejection
				= noop;

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

			ContinuationTask.prototype.run = function() {
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

			ProgressTask.prototype.run = function() {
				var q = this.handler.consumers;
				if(q === void 0) {
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

			AssimilateTask.prototype.run = function() {
				var h = this.resolver;
				tryAssimilate(this._then, this.thenable, _resolve, _reject, _notify);

				function _resolve(x) { h.resolve(x); }
				function _reject(x)  { h.reject(x); }
				function _notify(x)  { h.notify(x); }
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
				this.f = f; this.z = z; this.c = c; this.to = to;
				this.resolver = failIfRejected;
				this.receiver = this;
			}

			Fold.prototype.fulfilled = function(x) {
				this.f.call(this.c, this.z, x, this.to);
			};

			Fold.prototype.rejected = function(x) {
				this.to.reject(x);
			};

			Fold.prototype.progress = function(x) {
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
				return (typeof x === 'object' || typeof x === 'function') && x !== null;
			}

			function runContinuation1(f, h, receiver, next) {
				if(typeof f !== 'function') {
					return next.become(h);
				}

				Promise.enterContext(h);
				tryCatchReject(f, h.value, receiver, next);
				Promise.exitContext();
			}

			function runContinuation3(f, x, h, receiver, next) {
				if(typeof f !== 'function') {
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
				if(typeof f !== 'function') {
					return next.notify(x);
				}

				Promise.enterContext(h);
				tryCatchReturn(f, x, receiver, next);
				Promise.exitContext();
			}

			function tryCatch2(f, a, b) {
				try {
					return f(a, b);
				} catch(e) {
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
				} catch(e) {
					next.become(new Rejected(e));
				}
			}

			/**
			 * Same as above, but includes the extra argument parameter.
			 */
			function tryCatchReject3(f, x, y, thisArg, next) {
				try {
					f.call(thisArg, x, y, next);
				} catch(e) {
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
				} catch(e) {
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

			function initEmitRejection() {
				/*global process, self, CustomEvent*/
				if(typeof process !== 'undefined' && process !== null
					&& typeof process.emit === 'function') {
					// Returning falsy here means to call the default
					// onPotentiallyUnhandledRejection API.  This is safe even in
					// browserify since process.emit always returns falsy in browserify:
					// https://github.com/defunctzombie/node-process/blob/master/browser.js#L40-L46
					return function(type, rejection) {
						return type === 'unhandledRejection'
							? process.emit(type, rejection.value, rejection)
							: process.emit(type, rejection);
					};
				} else if(typeof self !== 'undefined' && typeof CustomEvent === 'function') {
					return (function(noop, self, CustomEvent) {
						var hasCustomEvent = false;
						try {
							var ev = new CustomEvent('unhandledRejection');
							hasCustomEvent = ev instanceof CustomEvent;
						} catch (e) {}

						return !hasCustomEvent ? noop : function(type, rejection) {
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
					}(noop, self, CustomEvent));
				}

				return noop;
			}

			return Promise;
		};
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

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
			this.drain = function() {
				self._drain();
			};
		}

		/**
		 * Enqueue a task
		 * @param {{ run:function }} task
		 */
		Scheduler.prototype.enqueue = function(task) {
			this._queue[this._queueLen++] = task;
			this.run();
		};

		/**
		 * Enqueue a task to run after the main task queue
		 * @param {{ run:function }} task
		 */
		Scheduler.prototype.afterQueue = function(task) {
			this._afterQueue[this._afterQueueLen++] = task;
			this.run();
		};

		Scheduler.prototype.run = function() {
			if (!this._running) {
				this._running = true;
				this._async(this.drain);
			}
		};

		/**
		 * Drain the handler queue entirely, and then the after queue
		 */
		Scheduler.prototype._drain = function() {
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

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(9)));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var Utils = __webpack_require__(3);

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
	function Result(object) {
	    if(object) {
	        this.object = function() {
	            return object;
	        }
	    }
	    return this;
	};

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
	Result.prototype.toJSON = function() {
	    return (this.object()) ? Utils.mergeDeep(JSON.parse(JSON.stringify({})), this.object()) : null;
	};

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
	Result.prototype.get = function(key) {
	    if(this.object() && key) {
	        var fields = key.split('.');
	        var value = fields.reduce(function(prev, field) {
	            return prev[field];
	        }, this.object());
	        return value;
	    }
	    return ;
	};

	module.exports = function(object) {
	    return new Result(object);
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 */
	var cacheStorage;
	var Utils = __webpack_require__(3);

	// if script is running under node.js then use node-localStorage node modules for the built-in localStorage to emulate the browser localStorage object.
	// else assign localStorage object
	if (Utils.isBrowser() && localStorage) {
	    cacheStorage = localStorage;
	} else {
	    cacheStorage = __webpack_require__(28);
	}

	exports.get = function (key) {
	    var data = cacheStorage.getItem(key);
	    try {
	        data = JSON.parse(data);
	    } catch (e) {
	        return data;
	    }
	    return data || null;
	};

	exports.set = function (key, data) {
	    if (typeof data === 'object') {
	        cacheStorage.setItem(key, JSON.stringify(data));
	    } else {
	        cacheStorage.setItem(key, data);
	    }
	};

	exports.getStorage = function () {
	    return cacheStorage || null;
	};

	exports.getKeys = function () {
	    return (cacheStorage) ? Object.keys(cacheStorage) : [];
	};


/***/ },
/* 28 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = exports = {
	    protocol: "https",
	    host: "cdn.contentstack.io",
	    port: 443,
	    version: "v3",
	    urls: {
	        content_types: "/content_types/",
	        entries: "/entries/",
	        environments: "/environments/"
	    }
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// 'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var Request = __webpack_require__(2);
	var Utils = __webpack_require__(3);
	var CacheProvider = __webpack_require__(31);

	/**
	 * Helper for expect and only
	 * @api private
	 * @ignore
	 */
	var _extend = function (type) {
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
	function Entry() {
	    this._query = {};
	    return this;
	}

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
	Entry.prototype.only = _extend('only');

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
	Entry.prototype.except = _extend('except');

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
	Entry.prototype.includeReference = function (val) {
	    if (Array.isArray(val) || typeof val === "string") {
	        if(arguments.length){
	            for (var i = 0; i < arguments.length; i++) {
	                this._query['include'] = this._query['include'] || [];
	                this._query['include'] = this._query['include'].concat(arguments[i]);
	            }
	        }
	        return this;
	    } else {
	        console.error("Argument should be a String or an Array.");
	    }
	};

	/**
	 * @method language
	 * @description This method is used set language code, which language's data to be retrieve.
	 * @param {String} language_code - language code. e.g. 'en-us', 'ja-jp', etc.
	 * @example blogEntry.language('en-us')
	 * @returns {Entry}
	 */
	Entry.prototype.language = function (language_code) {
	    if (language_code && typeof language_code === 'string') {
	        this._query['locale'] = language_code;
	        return this;
	    } else {
	        console.error("Argument should be a String.");
	    }
	};

	/**
	 * @method addQuery
	 * @description This method is used to add query to Entry object.
	 * @param {String} key - key of the query
	 * @param {String} value - value of the query
	 * @example blogEntry.addQuery('include_schema',true)
	 * @returns {Entry}
	 */
	Entry.prototype.addQuery = function (key, value) {
	    if (key && value && typeof key === 'string') {
	        this._query[key] = value;
	        return this;
	    } else {
	        console.error("First argument should be a String.");
	    }
	};

	/**
	 * @method includeSchema
	 * @description This method is used to include the schema of the current contenttype in result set along with the entry/entries.
	 * @example blogEntry.includeSchema()
	 * @returns {Entry}
	 */
	Entry.prototype.includeSchema = function () {
	    this._query['include_schema'] = true;
	    return this;
	};

	/**
	 * @method includeOwner
	 * @description This method is used to include the owner of the entry/entries in resultset.
	 * @example blogEntry.includeOwner()
	 * @returns {Entry}
	 */
	Entry.prototype.includeOwner = function () {
	    this._query['include_owner'] = true;
	    return this;
	};

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
	Entry.prototype.toJSON = function () {
	    this.tojson = true;
	    return this;
	};

	/**
	 * @method fetch
	 * @description fetch entry of requested content_type of defined query if present.
	 * @example
	 * blogEntry.fetch()
	 */
	Entry.prototype.fetch = function () {
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
	};

	module.exports = Entry;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var CacheProvider = {};

	module.exports = exports = CacheProvider;

	CacheProvider.providers = function(provider) {
	    if(provider) {
	        return __webpack_require__(32);
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

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var cache = __webpack_require__(27);

	var localStorage = {};
	module.exports = exports = localStorage;

	localStorage.get = function (key, callback) {
	    try {
	        callback(null, cache.get(key));
	    } catch(e) {
	        callback(e);
	    }
	};

	localStorage.set = function (key, value, callback) {
	    try {
	        if(key && value) cache.set(key, value);
	        callback();
	    } catch(e) {
	        callback(e);
	    }
	};

	function clearValuesForKey(keyArray, append) {
	    if(!append && keyArray && keyArray.length) keyArray.push('');
	    var _key,
	        keys = cache.getKeys(),
	        storage = cache.getStorage();
	    if(!keyArray || !keyArray.length) {
	        for(var i = 0, _i = keys.length; i < _i; i++) {
	            delete storage[keys[i]];
	        }
	    } else {
	        _key = keyArray.join('.');
	        for(var i = 0, _i = keys.length; i < _i; i++) {
	            if(keys[i] && keys[i].indexOf(_key) === 0) delete storage[keys[i]];
	        }
	    }
	}

	localStorage.clearByContentType = function () {
	    try {
	        if(arguments.length === 2 || arguments.length === 3) {
	            var args = Array.prototype.slice.call(arguments);
	            var callback = args.splice(-1, 1).pop();
	            var valueArray = [];
	            valueArray.push.apply(valueArray, args);
	            clearValuesForKey(valueArray);
	            callback();
	        }
	    } catch(e) {
	        callback(e);
	    }
	}

	localStorage.clearByQuery = function (query, callback) {
	    try {
	        var keys = cache.getKeys(),
	            storage = cache.getStorage();
	        for(var i = 0, _i = keys.length; i < _i; i++) {
	            if(keys[i] && ~keys[i].indexOf(query)) delete storage[keys[i]];
	        }
	        callback();
	    } catch(e) {
	        callback(e);
	    }
	}

	localStorage.clearAll = function (callback) {
	    try {
	        clearValuesForKey();
	        callback();
	    } catch(e) {
	        callback(e);
	    }
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var Request = __webpack_require__(2);
	var Utils = __webpack_require__(3);
	var Entry = __webpack_require__(30);

	/**
	 * @api private
	 * @ignore
	 */
	var _extend = {
	    compare: function(type) {
	        return function(key, value) {
	            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
	                this._query['query'][key] = this._query['query'][key] || {};
	                this._query['query'][key][type] = value;
	                return this;
	            } else {
	                console.error("Kindly provide valid parameters.");
	            }
	        };
	    },
	    contained: function(bool) {
	        var type = (bool) ? '$in' : '$nin';
	        return function(key, value) {
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
	    exists: function(bool) {
	        return function(key) {
	            if (key && typeof key === 'string') {
	                this._query['query'][key] = this._query['query'][key] || {};
	                this._query['query'][key]['$exists'] = bool;
	                return this;
	            } else {
	                console.error("Kindly provide valid parameters.");
	            }
	        };
	    },
	    logical: function(type) {
	        return function() {
	            var _query = [];
	            for (var i = 0, _i = arguments.length; i < _i; i++) {
	                if (arguments[i] instanceof Query && arguments[i]._query.query) {
	                    _query.push(arguments[i]._query.query);
	                } else if (typeof arguments[i] === "object") {
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
	    sort: function(type) {
	        return function(key) {
	            if (key && typeof key === 'string') {
	                this._query[type] = key;
	                return this;
	            } else {
	                console.error("Argument should be a string.");
	            }
	        };
	    },
	    pagination: function(type) {
	        return function(value) {
	            if (typeof value === 'number') {
	                this._query[type] = value;
	                return this;
	            } else {
	                console.error("Argument should be a number.");
	            }
	        }
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
	function Query() {
	    Entry.call(this);
	    this._query = this._query || {};
	    this._query['query'] = this._query['query'] || {};
	}

	/**
	 * Inherit Entity prototype with Query
	 * @ignore
	 */
	Query.prototype = Object.create(Entry.prototype);

	/**
	 * @method lessThan
	 * @description This method provides only the entries with values less than the specified value for a field.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @param {*} value - The value used to match or compare
	 * @example blogQuery.lessThan('created_at','2015-06-22')
	 * @returns {Query}
	 */
	Query.prototype.lessThan = _extend.compare('$lt');

	/**
	 * @method lessThanOrEqualTo
	 * @description This method provides only the entries with values less than or equal to the specified value for a field.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @param {*} value - The value used to match or compare
	 * @example blogQuery.lessThanOrEqualTo('created_at','2015-03-12')
	 * @returns {Query}
	 */
	Query.prototype.lessThanOrEqualTo = _extend.compare('$lte');

	/**
	 * @method greaterThan
	 * @description This method provides only the entries with values greater than the specified value for a field.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @param {*} value - The value used to match or compare
	 * @example blogQuery.greaterThan('created_at','2015-03-12')
	 * @returns {Query}
	 */
	Query.prototype.greaterThan = _extend.compare('$gt');

	/**
	 * @method greaterThanOrEqualTo
	 * @description This method provides only the entries with values greater than or equal to the specified value for a field.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @param {*} value - The value used to match or compare
	 * @example blogQuery.greaterThanOrEqualTo('created_at', '2015-06-22')
	 * @returns {Query}
	 */
	Query.prototype.greaterThanOrEqualTo = _extend.compare('$gte');


	/**
	 * @method where(equalTo)
	 * @description This method provides only the entries matching the specified value for a field.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @param {*} value - The value used to match or compare
	 * @example blogQuery.where('title','Demo')
	 * @returns {Query}
	 */
	Query.prototype.equalTo = Query.prototype.where = function(key, value) {
	    if (key && value && typeof key === 'string') {
	        this._query['query'][key] = value;
	        return this;
	    } else {
	        console.error("Kindly provide valid parameters.");
	    }
	};

	/**
	 * @method notEqualTo
	 * @description This method provides only the entries with values not equal to the specified value for a field.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @param {*} value - The value used to match or compare
	 * @example blogQuery.notEqualTo('title','Demo')
	 * @returns {Query}
	 */
	Query.prototype.notEqualTo = _extend.compare('$ne');

	/**
	 * @method containedIn
	 * @description This method provides only the entries with values matching the specified values for a field.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @param {*} value - An array of values that are to be used to match or compare
	 * @example blogQuery.containedIn('title', ['Demo', 'Welcome'])
	 * @returns {Query}
	 */
	Query.prototype.containedIn = _extend.contained(true);

	/**
	 * @method notContainedIn
	 * @description This method provides only the entries that do not contain values matching the specified values for a field.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @param {Array} value - An array of values that are to be used to match or compare
	 * @example blogQuery.notContainedIn('title', ['Demo', 'Welcome'])
	 * @returns {Query}
	 */
	Query.prototype.notContainedIn = _extend.contained(false);

	/**
	 * @method exists
	 * @description This method provides only the entries that contains the field matching the specified field uid.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @example blogQuery.exists('featured')
	 * @returns {Query}
	 */
	Query.prototype.exists = _extend.exists(true);

	/**
	 * @method notExists
	 * @description This method provides only the entries that do not contain the field matching the specified field uid.
	 * @param {String} key - uid of the field that is to be taken into consideration
	 * @example blogQuery.notExists('featured')
	 * @returns {Query}
	 */
	Query.prototype.notExists = _extend.exists(false);

	/**
	 * @method ascending
	 * @description This parameter sorts the provided entries in the ascending order on the basis of the specified field.
	 * @param {String} key - field uid based on which the ordering should be done
	 * @example blogQuery.ascending('created_at')
	 * @returns {Query}
	 */
	Query.prototype.ascending = _extend.sort('asc');

	/**
	 * @method descending
	 * @description This method sorts the provided entries in the descending order on the basis of the specified field.
	 * @param {String} key - field uid based on which the ordering should be done.
	 * @example blogQuery.descending('created_at')
	 * @returns {Query}
	 */
	Query.prototype.descending = _extend.sort('desc');


	/**
	 * @method beforeUid
	 * @description This method provides only the entries before the specified entry id.
	 * @param {String} uid - uid of the entry
	 * @example blogQuery.beforeUid('blt1234567890abcdef')
	 * @returns {Query}
	 * @ignore
	 */
	Query.prototype.beforeUid = _extend.sort('before_uid');

	/**
	 * @method afterUid
	 * @description This method provides only the entries after the specified entry id.
	 * @param {String} uid - uid of the entry
	 * @example blogQuery.afterUid('blt1234567890abcdef')
	 * @returns {Query}
	 * @ignore
	 */
	Query.prototype.afterUid = _extend.sort('after_uid');

	/**
	 * @method skip
	 * @description This method skips the specified number of entries.
	 * @param {Number} skip - number of entries to be skipped
	 * @example blogQuery.skip(5)
	 * @returns {Query}
	 */
	Query.prototype.skip = _extend.pagination('skip');

	/**
	 * @method limit
	 * @description This method limits the response by providing only the specified number of entries.
	 * @param {Number} limit - number of entries to be present in the result(at most)
	 * @example blogQuery.limit(10)
	 * @returns {Query}
	 */
	Query.prototype.limit = _extend.pagination('limit');

	/**
	 * @method count
	 * @description This method provides only the number of entries matching the specified filters.
	 * @example blogQuery.count()
	 * @returns {Query}
	 */
	Query.prototype.count = function() {
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
	};

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
	Query.prototype.or = _extend.logical('$or');

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
	Query.prototype.and = _extend.logical('$and');

	/**
	 * @method query
	 * @description This method used to set raw queries on Query instance.
	 * @param {object} query - raw{json} queries to filter the entries in result set.
	 * @returns {Query}
	 */
	Query.prototype.query = function(query) {
	    if (typeof query === "object") {
	        this._query['query'] = Utils.mergeDeep(this._query['query'], query);
	        return this;
	    } else {
	        console.error("Kindly provide valid parameters");
	    }
	};

	/**
	 * @method tags
	 * @description The "tags" parameter allows you to specify an array of tags to search objects.
	 * @param {Array} values - tags
	 * @example blogQuery.tags(['technology', 'business'])
	 * @returns {Query}
	 */
	Query.prototype.tags = function(values) {
	    if (Array.isArray(values)) {
	        this._query['tags'] = values;
	        return this;
	    } else {
	        console.error("Kindly provide valid parameters");
	    }
	};

	/**
	 * @method includeCount
	 * @description This method also includes the total number of entries returned in the response.
	 * @example blogQuery.includeCount()
	 * @returns {Query}
	 */
	Query.prototype.includeCount = function() {
	    this._query['include_count'] = true;
	    return this;
	};

	/**
	 * @method getQuery
	 * @summary returns the raw query which can be used for futher calls(.and/.or).
	 * @description This method provides raw{json} queries based on the filters applied on Query objet.
	 * @example blogQuery.where('title','Demo').getQuery()
	 * @returns {Query}
	 */
	Query.prototype.getQuery = function () {
	    return this._query.query || {};
	};

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
	Query.prototype.regex = function(key, value, options) {
	    if (key && value && typeof key === 'string' && typeof value === 'string') {
	        this._query['query'][key] = {
	            $regex: value
	        };
	        if (options) this._query['query'][key]['$options'] = options;
	        return this;
	    } else {
	        console.error("Kindly provide valid parameters.");
	    }
	};

	/**
	 * @method search
	 * @description This method is used to search data in entries.
	 * @param {string} value - value to search in entries
	 * @example blogQuery.search('Welcome to demo')
	 * @returns {Query}
	 */
	Query.prototype.search = function(value) {
	    if (value && typeof value === 'string') {
	        this._query['typeahead'] = value;
	        return this;
	    } else {
	        console.error("Kindly provide valid parameters.");
	    }
	};

	/**
	 * @method find
	 * @description Provides all the entries which satisfied the query specified.
	 * @example
	 * blogQuery.find()
	 */
	Query.prototype.find = function() {
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
	};

	/**
	 * @method findOne
	 * @description Provides the single entry from the resultset.
	 * @example
	 * blogQuery.findOne()
	 */
	Query.prototype.findOne = function() {
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
	};

	module.exports = Query;


/***/ }
/******/ ]);