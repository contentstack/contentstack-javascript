import Request from './request';
import Result from '../modules/result';

/**
 * @method addSpread
 * @description method to add the spread.
 */
(function addSpread() {
    if (Promise.prototype.spread) return;
    Promise.prototype.spread = function(fn, errFunc) {
        errFunc = errFunc || function(err) {};
        return this.then(function(args) {
            return fn.apply(fn, args);
        }).catch(function(err) {
            errFunc(err);
        });
    };
}());

export function transform(type) {
    return function() {
        this._query[type] = this._query[type] || {};
        switch (arguments.length) {
            case 1:
                if (Array.isArray(arguments[0]) || typeof arguments[0] === "string") {
                    let query = this._query[type]['BASE'] || [];
                    query = query.concat(arguments[0]);
                    this._query[type]['BASE'] = query;
                    return this;
                } else {
                    console.error("Kindly provide valid parameters");
                }
                break;
            case 2:
                if (typeof arguments[0] === "string" && (Array.isArray(arguments[1]) || typeof arguments[1] === "string")) {
                    let query = this._query[type][arguments[0]] || [];
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
}

export function _type(val) {
    let _typeof,
        __typeof = typeof val;
    if (__typeof === "object") {
        _typeof = __typeof;
        if (Array.isArray(val)) {
            __typeof = 'array';
        }
    } else {
        _typeof = __typeof;
    }
    return __typeof;
}

// merge two objects
export function mergeDeep(destination, sourceVar) {
    let self = this;
    let _merge_recursive = function(target, source) {
        for (let key in source) {
            if (self._type(source[key]) == 'object' && self._type(target[key]) == self._type(source[key])) {
                _merge_recursive(target[key], source[key])
            } else if (self._type(source[key]) == 'array' && self._type(target[key]) == self._type(source[key])) {
                target[key] = target[key].concat(source[key]);
            } else {
                target[key] = source[key];
            }
        }
    };
    _merge_recursive(destination, sourceVar);
    return destination;
}

// merge two objects
export function merge(target, source) {
    if (target && source) {
        for (let key in source) {
            target[key] = source[key];
        }
    }
    return target;
}

// return true if process is running in browser else false
export function isBrowser() {
    return (typeof window !== "undefined");
}


// return the query from the params
export function parseQueryFromParams(queryObject, single, toJSON) {
    if (queryObject && queryObject.requestParams) {
        let _query = merge({}, ((queryObject.requestParams.body) ? queryObject.requestParams.body.query || {} : {}));
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
            api_key: (queryObject.requestParams.headers) ? queryObject.requestParams.headers.api_key : ""
        };
    }
}

// return the hash value of the query
export function getHash(query) {
    try {
        let hashValue = generateHash(JSON.stringify(query)),
            keyArray = [];
        keyArray.push(query.content_type_uid);
        keyArray.push(query.locale);
        if (query.entry_uid) keyArray.push(query.entry_uid);
        if (query.asset_uid) keyArray.push(query.asset_uid);
        keyArray.push(hashValue);
        return keyArray.join('.');
    } catch (e) {}
}

// return the hash value of the string
export function generateHash(str) {
    let hash = 0,
        i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return ((hash < -1) ? hash * -1 : hash);
}

// generate the Result object
export function resultWrapper(result) {
    if (result && typeof result.entries !== 'undefined') {
        if (result.entries && result.entries.length) {
            for (let i = 0, _i = result.entries.length; i < _i; i++) {
                result.entries[i] = Result(result.entries[i]);
            }
        } else {
            result.entries = [];
        }
    } else if (result && result.assets && typeof result.assets !== 'undefined') {
        if (result.assets && result.assets.length) {
            for (let j = 0, _j = result.assets.length; j < _j; j++) {
                result.assets[j] = Result(result.assets[j]);
            }
        } else {
            result.assets = [];
        }
    } else if (result && typeof result.entry !== 'undefined') {
        result.entry = Result(result.entry);
    } else if (result && typeof result.asset !== 'undefined') {
        result.asset = Result(result.asset);
    } else if (result && typeof result.items !== 'undefined') {
        result.items = Result(result.items).toJSON();
    }

    return result;
}

// spread the result object
export function spreadResult(result) {
    let _results = [];
    if (result && Object.keys(result).length) {
        if (typeof result.entries !== 'undefined') {
            _results.push(result.entries);
            if(result.content_type){
                _results['schema'] = result.content_type
           }
        }
        if (typeof result.assets !== 'undefined') _results.push(result.assets);
        if (typeof result.content_type !== 'undefined' || typeof result.schema !== 'undefined') _results.push(result.content_type || result.schema);
        if (typeof result.count !== 'undefined') _results.push(result.count);
        if (typeof result.entry !== 'undefined') {
            _results = result.entry;
            if(result.schema){
                _results['schema'] = result.schema
           }
           if(result.content_type){
            _results['content_type'] = result.content_type
       }
        }
        if (typeof result.asset !== 'undefined') _results = result.asset;
        if (typeof result.items !== 'undefined') _results.push(result);
    }
    return _results;
}

export function sendRequest(queryObject, options) {

    let env_uid = queryObject.environment_uid;
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

    let self = queryObject;
    let cachePolicy = (typeof self.queryCachePolicy !== 'undefined') ? self.queryCachePolicy : self.cachePolicy;
    let tojson = (typeof self.tojson !== 'undefined') ? self.tojson : false;
    let isSingle = (self.entry_uid || self.singleEntry || self.asset_uid) ? true : false;
    let hashQuery = getHash(parseQueryFromParams(self, isSingle, tojson));

    /**
    for new api v3
    */
    if (queryObject && queryObject.requestParams && queryObject.requestParams.body && queryObject.requestParams.body.query) {
        let cloneQueryObj = JSON.parse(JSON.stringify(queryObject.requestParams.body.query));
        if (typeof cloneQueryObj !== 'object') {
            cloneQueryObj = JSON.parse(cloneQueryObj);
        }
        delete queryObject.requestParams.body.query;
        queryObject.requestParams.body = merge(queryObject.requestParams.body, cloneQueryObj);

        if (queryObject.live_preview && queryObject.live_preview.enable === true && queryObject.live_preview.live_preview && queryObject.live_preview.live_preview !== "init") {
            queryObject.requestParams.body = merge(queryObject.requestParams.body, {live_preview: queryObject.live_preview.live_preview || "init"});
            cachePolicy = 2; // network else cache
            if(queryObject.requestParams.body['environment']) {
                delete queryObject.requestParams.body['environment'];
            }
            if(queryObject.requestParams.headers['access_token']) 
                delete queryObject.requestParams.headers['access_token'];
            delete queryObject.requestParams.headers['authorization'];
            delete queryObject.requestParams.headers['preview_token'];

            if (queryObject.live_preview.preview_token) {
                queryObject.requestParams.headers['preview_token'] = queryObject.live_preview.preview_token;
                queryObject.requestParams.headers['live_preview'] = queryObject.live_preview.live_preview;
            } else if (queryObject.live_preview.management_token) {
                queryObject.requestParams.headers['authorization'] = queryObject.live_preview.management_token;
            }
        }
    }

    let getCacheCallback = function(resolve, reject) {
        return function(err, entries) {
            try {
                if (err) {
                    return reject(err); // Propagate the error to the parent promise
                }
                if (!tojson) entries = resultWrapper(entries);
                resolve(spreadResult(entries)); // Propagate the result to the parent promise
            } catch (e) {
                reject(e); // Handle any synchronous errors
            }
        };
    };
    

    let callback = function(continueFlag, resolve, reject) {
        if (continueFlag) {
            Request(queryObject, options)
                .then(function(data) {
                    try {
                        self.entry_uid = self.asset_uid = self.tojson = self.queryCachePolicy = undefined;
                        let entries = {};
                        let syncstack = {};
                        if (queryObject.singleEntry) {
                            queryObject.singleEntry = false;
                            if (data.schema) entries.schema = data.schema;
                            if (data.content_type) {
                                entries.content_type = data.content_type;
                                delete entries.schema
                            }
                            if (data.entries && data.entries.length) {
                                entries.entry = data.entries[0];
                            } else if (data.assets && data.assets.length) {
                                entries.assets = data.assets[0];
                            } else {
                                if (cachePolicy === 2 && self.provider !== null) {
                                    self.provider.get(hashQuery, function(err, _data) {
                                        if (err || !_data || (_data.entries.length === 0 && _data.assets.length === 0)) {
                                            return reject({ error_code: 141, error_message: 'The requested entry doesn\'t exist.' });
                                        }
                                        getCacheCallback(resolve, reject)(err, _data);
                                    });
                                    return
                                } else {
                                    return reject({ error_code: 141, error_message: 'The requested entry doesn\'t exist.' });
                                }
                            }
                        } 
                        else if(data.items) {
                            syncstack = {
                                items : data.items,
                                pagination_token : data.pagination_token,
                                sync_token : data.sync_token,
                                total_count : data.total_count
                            }
                        } else {
                            entries = data;
                        }

                        if (cachePolicy !== -1 && self.provider !== null) {
                            self.provider.set(hashQuery, entries, function(err) {
                                try {
                                    if (err) reject(err);
                                    if (!tojson) entries = resultWrapper(entries);
                                    return resolve(spreadResult(entries));
                                } catch (e) {
                                    return reject(e);
                                }
                            });
                            return resolve(spreadResult(entries));
                        } 
                        
                        if(Object.keys(syncstack).length) {
                            return resolve(syncstack);
                        }
                            
                        if (!tojson) {
                            entries = resultWrapper(entries);
                        }
                        return resolve(spreadResult(entries));
                    } catch (e) {
                        return reject({
                            message: e.message
                        });
                    }
                }.bind(self))
                .catch(function(error) {
                    if(error){
                        reject(error);
                    }
                    else if (cachePolicy === 2 && self.provider !== null) {
                        self.provider.get(hashQuery, getCacheCallback(resolve, reject));
                    } 
                });
                
        }
    }
    switch (cachePolicy) {
        case 1:
            return new Promise(async function(resolve, reject) {
                if (self.provider !== null) {
                    await self.provider.get(hashQuery, async function(err, _data) {
                        try {
                            if (err || !_data) {
                                callback(true, resolve, reject);
                            } else {
                                if (!tojson) {
                                    _data = resultWrapper(_data);
                                }
                                return resolve(spreadResult(_data));
                            }
                        } catch (e) {
                            return reject(e);
                        }
                    });
                }else {
                    callback(true, resolve, reject);
                }

            });
        case 2:
        case 0:
        case undefined:
        case -1:
            return new Promise(function(resolve, reject) {
                callback(true, resolve, reject);
            })
    }

    if (cachePolicy === 3) {

        var promise = new Promise(function(resolve, reject) {
                if (self.provider !== null) {
                    self.provider.get(hashQuery, function(err, _data) {
                        try {
                            if (err || !_data) {
                                 reject(err);
                            } else {
                                if (!tojson) {
                                    _data = resultWrapper(_data);
                                }
                                 resolve(spreadResult(_data));
                            }
                        } catch (e) {
                             reject(e);
                        }
                    });
                }
            });

        return promise.then(function() {
                return new Promise(function(resolve, reject) {
                    callback(true, resolve, reject);
                });
              }).catch((error) => {
                return new Promise(function(resolve, reject) {
                    callback(true, resolve, reject);
                });
              })
    }
}
