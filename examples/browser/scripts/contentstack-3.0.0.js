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
	var CacheProvider = __webpack_require__(11);

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
	Contentstack.prototype.Stack = Stack.initialize();

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
	// set an instance in 'window' for browser else exports for node.
	if (Utils.isBrowser()) {
	    window.Contentstack = contentstack;
	} else {
	    module.exports = contentstack;
	}


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
	var cache = __webpack_require__(7);
	var Config = __webpack_require__(9);
	var Entry = __webpack_require__(10);
	var Query = __webpack_require__(13);
	var CacheProvider = __webpack_require__(11);

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
	    return function () {
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
	module.exports = new Stack();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 */
	var HTTPRequest;
	var Utils = __webpack_require__(3);
	var when = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"when\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	// if script is running under node.js then use node-XMLHttpRequest node modules for the built-in http client to emulate the browser XMLHttpRequest object.
	// else assign XMLHttpRequest object
	if (Utils.isBrowser() && XMLHttpRequest) {
	    HTTPRequest = XMLHttpRequest;
	} else {
	    HTTPRequest = __webpack_require__(6).XMLHttpRequest;
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
	var when = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"when\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
	    var Result = __webpack_require__(5);
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
/* 6 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 7 */
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
	    cacheStorage = __webpack_require__(8);
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
/* 8 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 9 */
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// 'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var Request = __webpack_require__(2);
	var Utils = __webpack_require__(3);
	var CacheProvider = __webpack_require__(11);

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
/* 11 */
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
	        return __webpack_require__(12);
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var cache = __webpack_require__(7);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Module dependencies.
	 * @ignore
	 */
	var Request = __webpack_require__(2);
	var Utils = __webpack_require__(3);
	var Entry = __webpack_require__(10);

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
	    if (key && value && typeof key === 'string' && typeof value === 'string') {
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