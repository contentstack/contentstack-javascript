import when from "runtime/when.js";
import Request from  './request';
import Result from '../entry/result';

export function _type(val) {
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
export function mergeDeep(target, source) {
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
export function merge(target, source) {
    if (target && source) {
        for (var key in source) {
            target[key] = source[key];
        }
    }
    return target;
};

// return true if process is running in browser else false
export function isBrowser() {
    return (typeof window !== "undefined" && typeof process === "object" && process.title === "browser");
};


// return the query from the params
export function parseQueryFromParams(queryObject, single, toJSON) {
    if(queryObject && queryObject.requestParams) {
        var _query = merge({}, ((queryObject.requestParams.body) ? queryObject.requestParams.body.query || {} : {}));
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
export function getHash(query) {
    try {
        var hashValue = generateHash(JSON.stringify(query)),
            keyArray = [];
        keyArray.push(query.content_type_uid);
        keyArray.push(query.locale);
        if(query.entry_uid) keyArray.push(query.entry_uid);
        keyArray.push(hashValue);
        return keyArray.join('.');
    } catch(e) {}
};

// return the hash value of the string
export function generateHash(str) {
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
export function resultWrapper(result) {
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
export function spreadResult(result) {
    var _results = [];
    if(result && Object.keys(result).length) {
        if(typeof result.entries !== 'undefined') _results.push(result.entries);
        if(typeof result.schema !== 'undefined') _results.push(result.schema);
        if(typeof result.count !== 'undefined') _results.push(result.count);
        if(typeof result.entry !== 'undefined') _results = result.entry;
    }
    return _results;
};

export function sendRequest (queryObject) {
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
    var hashQuery = getHash(parseQueryFromParams(self, isSingle, tojson));
    //var spreadResult;
    /**
        for new api v3
    */
    if(queryObject && queryObject.requestParams && queryObject.requestParams.body && queryObject.requestParams.body.query){
        var cloneQueryObj = JSON.parse(JSON.stringify(queryObject.requestParams.body.query));
        if(typeof cloneQueryObj !== 'object') {
            cloneQueryObj = JSON.parse(cloneQueryObj);
        }
        delete queryObject.requestParams.body.query;
        queryObject.requestParams.body =  merge(queryObject.requestParams.body,cloneQueryObj);
    }

    var getCacheCallback = function () {
        return function (err, entries) {
            try {
                if (err) throw err;
                if (!tojson) entries = resultWrapper(entries);
                return deferred.resolve(spreadResult(entries));
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
                                entries.entry = data.entries[0];
                            } else {
                                if(cachePolicy === 2) {
                                    self.provider.get(hashQuery, getCacheCallback());
                                } else {
                                    return deferred.reject({ error_code: 141, error_message: 'The requested entry doesn\'t exist.' });
                                }
                                return;
                            }
                        } else {
                            entries = data;
                        }
                        if(cachePolicy !== -1) {
                            self.provider.set(hashQuery, entries, function (err) {
                                try {
                                    if (err) throw err;
                                    if(!tojson) entries = resultWrapper(entries);
                                    return deferred.resolve(spreadResult(entries));
                                } catch(e) {
                                    return deferred.reject(e);
                                }
                            });
                        } else {
                            if(!tojson) entries = resultWrapper(entries);
                            return deferred.resolve(spreadResult(entries));
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
                        if (!tojson) _data = resultWrapper(_data);
                        return deferred.resolve(spreadResult(_data));
                    }
                } catch(e) {
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
                            if (!tojson) _data = resultWrapper(_data);
                            return Defer.resolve(spreadResult(_data));
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
                    if (!tojson) entries = resultWrapper(entries);
                    _callback_(err, spreadResult(entries))
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
                                    entries.entry = data.entries[0];
                                } else {
                                    error = { error_code: 141, error_message: 'The requested entry doesn\'t exist.' };
                                }
                            } else {
                                entries = data;
                            }
                            if(!tojson) entries = resultWrapper(entries);
                            _callback_(error, spreadResult(entries));
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