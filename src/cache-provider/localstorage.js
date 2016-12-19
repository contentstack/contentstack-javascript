'use strict';
/**
 * Module dependencies.
 * @ignore
 */
var cache = require('./../cache');

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