"use strict";
/**
 * Module dependencies.
 * @ignore
 */
var Stack = require('./src/stack');
var Utils = require('./lib/utils');
var CacheProvider = require('./src/cache-provider');

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
 * var Stack = Contentstack.Stack('api_key', 'access_token', 'environment');
 *                  OR
 * var Stack = Contentstack.Stack({
 *      'api_key':'bltsomethingapikey',
 *      'access_token':'bltsomethongtoken',
 *      'environment':'environment_name'
 *   });
 *
 * @returns {Stack}
 */
Contentstack.prototype.Stack = function() {
    var stack = new Stack();
    return stack.initialize.apply(stack, arguments);
}

/**
 * @constant CachePolicy
 * @description CachePolicy contains different cache policies constants.
 * @example
 * Contentstack.CachePolicy.IGNORE_CACHE
 * Contentstack.CachePolicy.ONLY_NETWORK
 * Contentstack.CachePolicy.CACHE_ELSE_NETWORK
 * Contentstack.CachePolicy.NETWORK_ELSE_CACHE
 * Contentstack.CachePolicy.CACHE_THEN_NETWORK
 */
Contentstack.prototype.CachePolicy = CacheProvider.policies;

/**
 * Expose `Contentstack`.
 * @ignore
 */
var contentstack = new Contentstack();

/**
 * @ignore
 */
// set an instance in 'window' for browser.
if (Utils.isBrowser())
    window.Contentstack = contentstack;

// set an instance in exports for node.
if (typeof module === "object" && module.exports)
    module.exports = contentstack;