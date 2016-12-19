'use strict';
/**
 * Module dependencies.
 * @ignore
 */
var when = require('when');
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
    var Result = require('./../src/entry/result');
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
    var Request = require('./request');
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