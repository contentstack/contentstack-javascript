'use strict';
/*
 * Module Dependencies.
 */

var test = require('tape'),
    Contentstack = require('../dist/node/contentstack.js'),
    init = require('./config'),
    Utils = require('./utils.js'),
    when = require('when'),
    Stack = {},
    HTTPRequest = require('xmlhttprequest').XMLHttpRequest;

function Request(options){
    var deferred = when.defer();
    var xhr = new HTTPRequest(),
        method = options.method,
        url = options.url,
        headers = options.headers || {};
    
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
            var data = xhr.responseText,
                error;
            try {
                data = JSON.parse(data);
            } catch (e) {
                error = {error_code: 141, message: 'Could not parse the response received from the server.'};
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                deferred.resolve(data);
            } else {
                deferred.reject(data || error);
            }
        }
    };
    return deferred.promise;

}


module.exports = Request;

