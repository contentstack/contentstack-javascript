(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
    "protocol": "https",
    "host": "api.contentstack.io",
    "version": "v2"
}

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Module dependencies.
 */
var Site = require('./src/site');
var Utils = require('./lib/utils');
/**
 * Creates an instance of `Contentstack`.
 *
 * @constructor
 * @api public
 */
var Contentstack = function() {};

/**
 * @method initialize
 * @description Initialize Built.io Contentstack Javascript SDK
 * @api public
 * @example
 * var site = Contentstack.Site('site_api_key', 'access_token', 'environment');
 *                  OR
 * var site = Contentstack.Site({
 *      'site_api_key':'bltsomethingapikey',
 *      'access_token':'bltsomethongtoken',
 *     'environment':'environment_name'
 *   });
 *
 * @returns {Site}
 */
Contentstack.prototype.Site = Site.initialize();

/**
 * Expose `Contentstack`.
 */
var contentstack = new Contentstack();

// set an instance in 'window' for browser else exports for node.
if (Utils.isBrowser()) {
    window.Contentstack = contentstack;
} else {
    module.exports = contentstack;
}

},{"./lib/utils":4,"./src/site":8}],3:[function(require,module,exports){
'use strict';
/**
 * Module dependencies.
 */
var HTTPRequest;
var Utils = require('./utils');

// if script is running under node.js then use node-XMLHttpRequest node modules for the built-in http client to emulate the browser XMLHttpRequest object.
// else assign XMLHttpRequest object
if (Utils.isBrowser() && XMLHttpRequest) {
    HTTPRequest = XMLHttpRequest;
} else {
    HTTPRequest = require('xmlhttprequest').XMLHttpRequest;
}

function Request(options, callback) {
    var xhr = new HTTPRequest(),
        method = options.method || "GET",
        url = options.url,
        headers = options.headers;

    // make a request
    xhr.open(method, url, true);

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
            var data = xhr.responseText;
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.error('Could not parse the response received from the server.');
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, data);
            } else {
                callback(data, null);
            }
        }
    };
}

/**
 * Expose `Request`.
 */
module.exports = Request;

},{"./utils":4,"xmlhttprequest":9}],4:[function(require,module,exports){
(function (process){
'use strict';
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
    if (Array.isArray(data.entries)) {
        data.entries.forEach(function(val) {
            this.setAccessToken(val)
        }.bind(this));
    } else if (data.entry) {
        this.setAccessToken(data.entry)
    }
    return data;
};

// return true if process is running in browser else false
exports.isBrowser = function() {
    return (typeof window !== "undefined" && typeof process === "object" && process.title === "browser");
};

}).call(this,require('_process'))
},{"_process":10}],5:[function(require,module,exports){
'use strict';
/**
 * Module dependencies.
 */
var Request = require('./../../lib/request');
var Utils = require('./../../lib/utils');

/**
 * Helper for expect and only
 * @api private
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

function Entry() {
    this._query = {};
    return this;
}

/**
 * @method only
 * @description Entry to filter entries.
 * @param {String} key - find key in entry
 * @param {Array} values - match or compare value in entry
 * @returns {Entry}
 * @example .only('title') || .only('BASE','title') ||  .only(['title','description']) || .only('refernce_field_uid','title')
 */
Entry.prototype.only = _extend('only');

/**
 * @method except
 * @description Entry to filter entries.
 * @param {String} key - find key in entry
 * @param {Array} values - match or compare value in entry
 * @returns {Entry}
 * @example .except('title') || .except('BASE','title') ||  .except(['title','description']) || .except('refernce_field_uid','title')
 */
Entry.prototype.except = _extend('except');

/**
 * @method include
 * @description Include reference entries response.
 * @returns {Entry}
 * @example .include(['field_uid1','field_uid2']) || .include('field_uid1','field_uid2')
 */
Entry.prototype.include = function (val) {
    if (Array.isArray(val) || typeof val === "string") {
        this._query['include'] = this._query['include'] || [];
        this._query['include'] = this._query['include'].concat(val);
        return this;
    } else {
        console.error("Argument should be a String or an Array.");
    }
};

/**
 * @method locale
 * @description Set locale code, which locale's data wants to retrieve.
 * @param {String} locale_code - locale code. e.g. 'en-us', 'ja-jp', etc.
 * @returns {Entry}
 * @example .locale('en-us')
 */
Entry.prototype.locale = function (locale_code) {
    if (locale_code && typeof locale_code === 'string') {
        this._query['locale'] = locale_code;
        return this;
    } else {
        console.error("Argument should be a String.");
    }
};

/**
 * @method addQuery
 * @description add query to entity object.
 * @param {String} key - query key
 * @param {String} value - query value
 * @returns {Entry}
 * @example .addQuery('include_schema',true)
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
 * @method schema
 * @description Include schema in entries response.
 * @returns {Entry}
 * @example .include_schema()
 */
Entry.prototype.include_schema = function () {
    this._query['include_schema'] = true;
    return this;
};

/**
 * @method owner
 * @description Include owner in entries response.
 * @returns {Entry}
 * @example .include_owner()
 */
Entry.prototype.include_owner = function () {
    this._query['include_owner'] = true;
    return this;
};

/**
 * @method fetch
 * @description fetch entry of requested form of defined query if present.
 */
Entry.prototype.fetch = function () {
    if (this.entry_uid) {
        this.requestParams = {
            method: 'POST',
            headers: this.headers,
            url: this.config.protocol + "://" + this.config.host + '/' + this.config.version + '/forms/' + this.form_uid + '/entries/' + this.entry_uid,
            body: {
                _method: 'GET',
                query: this._query
            }
        };
        return this;
    } else {
        console.error("Kindly provide an entry uid. e.g. .Entry('bltsomething123')");
    }
};

/**
 * @method then
 * @description Execute query and get data from Built.io Contentstack
 *
 * @returns {function} returns success and fail functions with values respectively.
 */
Entry.prototype.then = function (success, fail) {
    var env_uid = this.environment_uid,
        params = this.requestParams;
    if (env_uid) {
        this._query.environment_uid = env_uid;
    } else {
        this._query.environment = this.environment;
    }
    Request(params, function (err, data) {
        try {
            if (!err) {
                if (this.singleEntry) {
                    var entries = {};
                    if (data.entries && data.entries.length) {
                        entries.entry = Utils.getData(data, this.headers.access_token).entries[0];
                        success(entries);
                    } else {
                        fail({ error_code: 141, error_message: 'The requested entry doesn\'t exist.' })
                    }
                    this.singleEntry = false;
                } else {
                    success(Utils.getData(data, this.headers.access_token));
                }
            } else {
                fail(err);
            }
        } catch (e) {
            fail({
                message: e.message
            });
        }
    }.bind(this));
};

module.exports = Entry;

},{"./../../lib/request":3,"./../../lib/utils":4}],6:[function(require,module,exports){
'use strict';
/**
 * Module dependencies.
 */
var Request = require('./../../lib/request');
var Utils = require('./../../lib/utils');
var Entry = require('./entry');

/**
 * @api private
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
            if (value && typeof value === 'number') {
                this._query[type] = value;
                return this;
            } else {
                console.error("Argument should be a number.");
            }
        }
    }
};

function Query() {
    Entry.call(this);
    this._query = this._query || {};
    this._query['query'] = this._query['query'] || {};
}

/**
 * Inherit Entity prototype with Query
 */
Query.prototype = Object.create(Entry.prototype);

/**
 * @method getQuery
 * @description getQuery is get query object only for $and or $or
 * @returns {Query}
 * @example .where('title','Demo').getQuery()
 */
Query.prototype.getQuery = function () {
    return this._query.query || {};
};

/**
 * @method where
 * @description Query to filter entries.
 * @param {String} key - find key in entry
 * @param {*} value - match or compare value in entry
 * @returns {Query}
 * @example .where('title','Demo')
 */
Query.prototype.where = function(key, value) {
    if (key && value && typeof key === 'string' && typeof value === 'string') {
        this._query['query'][key] = value;
        return this;
    } else {
        console.error("Kindly provide valid parameters.");
    }
};

/**
 * @method regex
 * @description Query to filter entries.
 * @param {String} key - find key in entry
 * @param {*} value - match or compare value in entry
 * @param {String} options - match or compare value in entry
 * @returns {Query}
 * @example .regex('title','/^Demo/')
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
 * @description Query to filter entries.
 * @param {string} value - search in entry
 * @returns {Query}
 * @example .search('Demo')
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
 * @method lessThan
 * @description Check less than.
 * @param {String} key - find key in entry
 * @param {*} value - match or compare value in entry
 * @returns {Query}
 * @example .lessThan('field_uid',123)
 */
Query.prototype.lessThan = _extend.compare('$lt');

/**
 * @method lessThanOrEqualTo
 * @description Check less than or equal to.
 * @param {String} key - find key in entry
 * @param {*} value - match or compare value in entry
 * @returns {Query}
 * @example .lessThanOrEqualTo('field_uid',123)
 */
Query.prototype.lessThanOrEqualTo = _extend.compare('$lte');

/**
 * @method greaterThan
 * @description Check greater than.
 * @param {String} key - find key in entry
 * @param {*} value - match or compare value in entry
 * @returns {Query}
 * @example .greaterThan('field_uid',123)
 */
Query.prototype.greaterThan = _extend.compare('$gt');

/**
 * @method greaterThanOrEqualTo
 * @description Check greater than or equal to.
 * @param {String} key - find key in entry
 * @param {*} value - match or compare value in entry
 * @returns {Query}
 * @example .greaterThanOrEqualTo('field_uid',123)
 */
Query.prototype.greaterThanOrEqualTo = _extend.compare('$gte');

/**
 * @method notEqualTo
 * @description Check not equal.
 * @param {String} key - find key in entry
 * @param {*} value - match or compare value in entry
 * @returns {Query}
 * @example .notEqualTo('title','Demo')
 */
Query.prototype.notEqualTo = _extend.compare('$ne');

/**
 * @method containedIn
 * @description Contained In.
 * @param {String} key - find key in entry
 * @param {*} value - match or compare value in entry
 * @returns {Query}
 * @example .containedIn('title','Demo')
 */
Query.prototype.containedIn = _extend.contained(true);

/**
 * @method notContainedIn
 * @description Not contained in.
 * @param {String} key - find key in entry
 * @param {Array} value - match or compare value in entry
 * @returns {Query}
 * @example .notContainedIn('title','Demo')
 */
Query.prototype.notContainedIn = _extend.contained(false);

/**
 * @method exists
 * @description A value is set for the key.
 * @param {String} key - find key in entry
 * @returns {Query}
 * @example .exists('title')
 */
Query.prototype.exists = _extend.exists(true);

/**
 * @method notExists
 * @description A value is set for the key.
 * @param {String} key - find key in entry
 * @returns {Query}
 * @example .notExists('title')
 */
Query.prototype.notExists = _extend.exists(false);

/**
 * @method or
 * @description A value is set for the key.
 * @param {String} key - find key in entry
 * @returns {Query}
 */
Query.prototype.or = _extend.logical('$or');

/**
 * @method and
 * @description A value is set for the key.
 * @param {String} key - find key in entry
 * @returns {Query}
 */
Query.prototype.and = _extend.logical('$and');

/**
 * @method query
 * @description A value is set for the key.
 * @param {String} query - find key in entry
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
 * @description The "tags" parameter allows you to specify an array o of tags to search objects.
 * @param {Array} values - tags
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
 * @method ascending
 * @description The asc parameter will sort the returned objects in ascending order of the provided field uid.
 * @param {String} key - find key in entry
 * @returns {Query}
 * @example .ascending('title')
 */
Query.prototype.ascending = _extend.sort('asc');

/**
 * @method descending
 * @description The asc parameter will sort the returned objects in descending order of the provided field uid.
 * @param {String} key - find key in entry
 * @returns {Query}
 * @example .descending('title')
 */
Query.prototype.descending = _extend.sort('desc');

/**
 * @method include_count
 * @description Includes the count of the number of entries returned along with the actual entries in response
 * @returns {Query}
 * @example .include_count()
 */
Query.prototype.include_count = function() {
    this._query['include_count'] = true;
    return this;
};

/**
 * @method beforeUid
 * @description before uid.
 * @param {String} uid - UID.
 * @returns {Query}
 * @example .beforeUid('<entry uid>')
 */
Query.prototype.beforeUid = _extend.sort('before_uid');

/**
 * @method afterUid
 * @description after uid.
 * @param {String} uid - UID.
 * @returns {Query}
 * @example .afterUid('<entry uid>')
 */
Query.prototype.afterUid = _extend.sort('after_uid');

/**
 * @method skip
 * @description Skip number of entries from response.
 * @param {Number} skip - number of entries from response.
 * @returns {Query}
 * @example .skip(20)
 */
Query.prototype.skip = _extend.pagination('skip');

/**
 * @method limit
 * @description Set limit of response entries.
 * @param {Number} limit - number of entries in response.
 * @returns {Query}
 * @example .limit(20)
 */
Query.prototype.limit = _extend.pagination('limit');

/**
 * @method count
 * @description Gets only the count of the number of entries that pass the query condition
 * @returns {Query}
 */
Query.prototype.count = function() {
    this._query['count'] = true;
    this.requestParams = {
        method: 'POST',
        headers: this.headers,
        url: this.config.protocol + "://" + this.config.host + '/' + this.config.version + '/forms/' + this.form_uid + '/entries',
        body: {
            _method: 'GET',
            query: this._query
        }
    };
    return this;
};

/**
 * @method find
 * @description Finds entries of requested form of defined query if present.
 */
Query.prototype.find = function() {
    this.requestParams = {
        method: 'POST',
        headers: this.headers,
        url: this.config.protocol + "://" + this.config.host + '/' + this.config.version + '/forms/' + this.form_uid + '/entries',
        body: {
            _method: 'GET',
            query: this._query
        }
    };
    return this;
};

/**
 * @method findOne
 * @description Finds entries of requested form of defined query if present.
 */
Query.prototype.findOne = function() {
    this.singleEntry = true;
    this._query.limit = 1;
    this.requestParams = {
        method: 'POST',
        headers: this.headers,
        url: this.config.protocol + "://" + this.config.host + '/' + this.config.version + '/forms/' + this.form_uid + '/entries',
        body: {
            _method: 'GET',
            query: this._query
        }
    };
    return this;
};

module.exports = Query;

},{"./../../lib/request":3,"./../../lib/utils":4,"./entry":5}],7:[function(require,module,exports){
'use strict';
/**
 * Module dependencies.
 */
var cacheStorage;
var Utils = require('./../lib/utils');

// if script is running under node.js then use node-localStorage node modules for the built-in localStorage to emulate the browser localStorage object.
// else assign localStorage object
if (Utils.isBrowser() && localStorage) {
    cacheStorage = localStorage;
} else {
    cacheStorage = require('localStorage');
}

exports.get = function (key) {
    var data = cacheStorage.getItem(key);
    try {
        data = JSON.parse(data);
    } catch (e) {
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

},{"./../lib/utils":4,"localStorage":9}],8:[function(require,module,exports){
'use strict';
/**
 * Module dependencies.
 */
var Request = require('./../lib/request');
var Utils = require('./../lib/utils');
var siteCache = require('./site-cache');
var config = require('./../config');
var Entry = require('./entry/entry');
var Query = require('./entry/query');

/**
 * Creates an instance of `Site`.
 *
 * An initializer is responsible for instantiating Built.io Contentstack.
 *
 * @constructor
 * @api protected
 */
function Site() {
    this.config = config;
}

/**
 * Initialize headers and environment.
 * @api protected
 */
Site.prototype.initialize = function () {
    var self = this;
    return function () {
        switch (arguments.length) {
            case 1:
                if (typeof arguments[0] === "object" && typeof arguments[0].site_api_key === "string" && typeof arguments[0].access_token === "string" && typeof arguments[0].environment === "string") {
                    self.headers = {
                        site_api_key: arguments[0].site_api_key,
                        access_token: arguments[0].access_token
                    };
                    self.environment = arguments[0].environment;
                    self._environment(arguments[0].environment, arguments[0].site_api_key);
                    return self;
                } else {
                    console.error("Kindly provide object parameters.");
                }
            case 3:
                if (typeof arguments[0] === "string" && typeof arguments[1] === "string" && typeof arguments[2] === "string") {
                    self.headers = {
                        site_api_key: arguments[0],
                        access_token: arguments[1]
                    };
                    self.environment = arguments[2];
                    self._environment(arguments[2], arguments[0]);
                    return self;
                } else {
                    console.error("Kindly provide string parameters.");
                }
            default:
                console.error("Kindly provide valid parameters to initialize the Built.io Contentstack Javascript SDK.");
        }
    };
};

/**
 * Get environment UID
 *
 * @param {String} env
 * @param {String} site_api_key
 * @api protected
 */
Site.prototype._environment = function (env, site_api_key) {
    var self = this,
        environmentCacheKey = site_api_key + '.environment.' + env;
    var cachedData = siteCache.get(environmentCacheKey);
    if (cachedData) {
        self.environment_uid = cachedData;
    } else {
        Request({
            url: self.config.protocol + "://" + self.config.host + '/' + self.config.version + '/environments/' + env,
            headers: self.headers
        }, function (err, data) {
            try {
                if (err) throw err;
                if (data && data.environment && data.environment.uid) {
                    siteCache.set(environmentCacheKey, data.environment.uid);
                    self.environment_uid = data.environment.uid;
                }
            } catch (e) {
                console.error('Could not retrieve the environment due to following error: ' + e.message);
            }
        });
    }
};

/**
 * @method Form
 * @description Site to filter Form.
 * @param {String} uid - form uid (optional)
 * @returns {Site}
 */
Site.prototype.Form = function (uid) {
    if (uid && typeof uid === 'string') {
        this.form_uid = uid;
    }
    return this;
};

/**
 * @method Entry
 * @description Set entry data.
 * @param {String} uid - entry uid
 * @returns {Site}
 */
Site.prototype.Entry = function (uid) {
    if (uid && typeof uid === "string") {
        this.entry_uid = uid;
    }
    var entry = new Entry();
    return Utils.merge(entry, this);
};

/**
 * @method Query
 * @description Site to query entries.
 * @returns {Site}
 */
Site.prototype.Query = function () {
    var query = new Query();
    return Utils.merge(query, this);
};

/**
 * Expose `Site`.
 */
module.exports = new Site();

},{"./../config":1,"./../lib/request":3,"./../lib/utils":4,"./entry/entry":5,"./entry/query":6,"./site-cache":7}],9:[function(require,module,exports){

},{}],10:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
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
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (!draining) {
        setTimeout(drainQueue, 0);
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

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[2]);
