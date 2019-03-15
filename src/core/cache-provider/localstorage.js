import * as cache from './../cache';

let localStorage = {};

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
    let _key,
        keys = cache.getKeys(),
        storage = cache.getStorage();
    if(!keyArray || !keyArray.length) {
        for(let i = 0, _i = keys.length; i < _i; i++) {
            delete storage[keys[i]];
        }
    } else {
        _key = keyArray.join('.');
        for(let i = 0, _i = keys.length; i < _i; i++) {
            if(keys[i] && keys[i].indexOf(_key) === 0) delete storage[keys[i]];
        }
    }
}

localStorage.clearByContentType = function () {
    try {
        if(arguments.length === 2 || arguments.length === 3) {
            let args = Array.prototype.slice.call(arguments);
            let callback = args.splice(-1, 1).pop();
            let valueArray = [];
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
        let keys = cache.getKeys(),
            storage = cache.getStorage();
        for(let i = 0, _i = keys.length; i < _i; i++) {
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
}

export default localStorage;