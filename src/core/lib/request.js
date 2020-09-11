import * as Utils from "./utils.js";
import fetch from "runtime/http.js";

//JS SDK version
let version = '{{VERSION}}';
let environment,
    api_key;
let errorRetry = [408, 429]
export default function Request(options, fetchOptions) {
    return new Promise(function(resolve, reject) {
        let queryParams;
        let serialize = function(obj, prefix) {

            let str = [],
                p;
            if (typeof obj === "object" && obj.length !== undefined) {
                for (var i = 0, _i = obj.length; i < _i; i++) {
                    str.push(prefix + '[]=' + obj[i]);
                }
            } else {
                for (p in obj) {
                    let k = prefix ? prefix + "[" + p + "]" : p,
                        v = obj[p];
                    str.push((v !== null && typeof v === "object" && p !== 'query') ?
                        serialize(v, k) :
                        k + "=" + encodeURIComponent(p !== 'query' ? v : JSON.stringify(v)));
                }
            }
            return str.join("&");
        };

        let url = options.url,
            headers = options.headers;

        // setting headers
        headers['Content-Type'] = 'application/json; charset=UTF-8';
        headers['X-User-Agent'] = 'contentstack-{{PLATFORM}}/' + version;

        if (options.body && typeof options.body === 'object') {
            delete options.body._method;
            if (typeof options.body.query === "object" && Object.keys(options.body.query).length === 0) delete options.body.query;
            queryParams = serialize(options.body);
        }

        return fetchRetry(url + '?' + queryParams, 
                            headers, 
                            fetchOptions.retryDelay, 
                            fetchOptions.retryLimit, 
                            fetchOptions, 
                            resolve, 
                            reject)
        
    });
}

function wait(retryDelay) {
    return new Promise((resolve) => {
        setTimeout(resolve, retryDelay)
    });
}

function fetchRetry(url, headers, retryDelay = 2, retryLimit = 5, fetchOptions, resolve, reject) {
    var option = Object.assign({ 
        method: 'GET',
        headers: headers,
        timeout: 3000,                                
    }, 
    fetchOptions);

    function onError (error) {
        if (retryLimit === 0) {
            reject(error);
        }else {
        wait(retryDelay)
            .then(() => {
                return fetchRetry(url, headers, retryDelay, retryLimit - 1, fetchOptions, resolve, reject)
            })
        }
    }
    fetch(url, option)
        .then(function(response) {       
            let data = response.json();      
            if (response.ok && response.status === 200) {
                resolve(data);
            } else {
                data.then((json) => {
                    if (errorRetry.includes(response.status) || response.status >= 500) {
                        onError(json)     
                    } else {
                        reject(json)
                    }   
                });
            }
        }).catch((error) => {
            reject(error)
        });
}