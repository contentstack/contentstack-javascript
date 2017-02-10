'use strict';
/**
 * Module dependencies.
 * @ignore
 */
var Request = require('./../lib/request');
var Utils = require('./../lib/utils');
var cache = require('./cache');
var Config = require('./../config.js');
var Entry = require('./entry/entry');
var Query = require('./entry/query');
var CacheProvider = require('./cache-provider/index');

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