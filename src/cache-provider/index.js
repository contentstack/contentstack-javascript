'use strict';
/**
 * Module dependencies.
 * @ignore
 */
var CacheProvider = {};

module.exports = exports = CacheProvider;

CacheProvider.providers = function(provider) {
    if(provider) {
        return require('./localstorage');
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