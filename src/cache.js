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
