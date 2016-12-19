(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
    "protocol": "https",
    "host": "api.contentstack.io",
    "version": "v2",
    "urls": {
        "content_types": "/content_types/",
        "entries": "/entries/",
        "environments": "/environments/"
    }
}

},{}],2:[function(require,module,exports){
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

},{"./utils":3,"xmlhttprequest":9}],3:[function(require,module,exports){
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
},{"_process":10}],4:[function(require,module,exports){
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

},{"./../lib/utils":3,"localStorage":9}],5:[function(require,module,exports){
'use strict';
/**
 * Module dependencies.
 * @ignore
 */
var Request = require('./../../lib/request');
var Utils = require('./../../lib/utils');

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
 * blogEntry.only('category','title')
 * @example
 * <caption> .only with reference_field_uid and field uids(array) </caption>
 * blogEntry.only('category', ['title', 'description'])
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
 * blogEntry.except('category','title')
 * @example
 * <caption> .except with reference_field_uid and field uids(array) </caption>
 * blogEntry.except('category', ['title', 'description'])
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
        this._query['include'] = this._query['include'] || [];
        this._query['include'] = this._query['include'].concat(val);
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
            url: this.config.protocol + "://" + this.config.host + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries + this.entry_uid,
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
 * @example
 * blogEntry.then(function () {
 *      // sucess function
 * },function () {
 *      // error function
 * })
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

},{"./../../lib/request":2,"./../../lib/utils":3}],6:[function(require,module,exports){
'use strict';
/**
 * Module dependencies.
 * @ignore
 */
var Request = require('./../../lib/request');
var Utils = require('./../../lib/utils');
var Entry = require('./entry');

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
            if (value && typeof value === 'number') {
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
 */
Query.prototype.beforeUid = _extend.sort('before_uid');

/**
 * @method afterUid
 * @description This method provides only the entries after the specified entry id.
 * @param {String} uid - uid of the entry
 * @example blogQuery.afterUid('blt1234567890abcdef')
 * @returns {Query}
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
        url: this.config.protocol + "://" + this.config.host + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries,
        body: {
            _method: 'GET',
            query: this._query
        }
    };
    return this;
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
        url: this.config.protocol + "://" + this.config.host + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries,
        body: {
            _method: 'GET',
            query: this._query
        }
    };
    return this;
};

module.exports = Query;

},{"./../../lib/request":2,"./../../lib/utils":3,"./entry":5}],7:[function(require,module,exports){
'use strict';
/**
 * Module dependencies.
 * @ignore
 */
var Request = require('./../lib/request');
var Utils = require('./../lib/utils');
var cache = require('./cache');
var config = require('./../config');
var Entry = require('./entry/entry');
var Query = require('./entry/query');

/**
 * @constructor Stack
 * @description An initializer is responsible for instantiating Built.io Contentstack Stack.
 * @api protected
 * @ignore
 */
function Stack() {
    this.config = config;
}

/**
 * Initialize headers and environment.
 * @api protected
 * @ignore
 */
Stack.prototype.initialize = function () {
    var self = this;
    return function () {
        switch (arguments.length) {
            case 1:
                if (typeof arguments[0] === "object" && typeof arguments[0].api_key === "string" && typeof arguments[0].access_token === "string" && typeof arguments[0].environment === "string") {
                    self.headers = {
                        api_key: arguments[0].api_key,
                        access_token: arguments[0].access_token
                    };
                    self.environment = arguments[0].environment;
                    self._environment(arguments[0].environment, arguments[0].api_key);
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
                    self._environment(arguments[2], arguments[0]);
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
Stack.prototype._environment = function (env, api_key) {
    var self = this,
        key = api_key + '.environment.' + env;
    var environmentUid = cache.get(key);
    if (environmentUid) {
        self.environment_uid = environmentUid;
    } else {
        Request({
            url: self.config.protocol + "://" + self.config.host + '/' + self.config.version + self.config.urls.environments + env,
            headers: self.headers
        }, function (err, data) {
            try {
                if (err) throw err;
                if (data && data.environment && data.environment.uid) {
                    cache.set(key, data.environment.uid);
                    self.environment_uid = data.environment.uid;
                }
            } catch (e) {
                console.error('Could not retrieve the environment due to %s error: ', e.message);
            }
        });
    }
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
 * @returns {Stack}
 */
Stack.prototype.Entry = function (uid) {
    if (uid && typeof uid === "string") {
        this.entry_uid = uid;
    }
    var entry = new Entry();
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
 * Expose `Stack`.
 * @ignore
 */
module.exports = new Stack();

},{"./../config":1,"./../lib/request":2,"./../lib/utils":3,"./cache":4,"./entry/entry":5,"./entry/query":6}],8:[function(require,module,exports){
"use strict";
/**
 * Module dependencies.
 * @ignore
 */
var Stack = require('./src/stack');
var Utils = require('./lib/utils');
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
 * var site = Contentstack.Stack('api_key', 'access_token', 'environment');
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

},{"./lib/utils":3,"./src/stack":7}],9:[function(require,module,exports){

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
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
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
    if (queue.length === 1 && !draining) {
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

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[8]);
