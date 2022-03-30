import * as Utils from "./utils.js";
import fetch from "runtime/http.js";

//JS SDK version
let version = '{{VERSION}}';
let environment,
    api_key;
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
                            fetchOptions, 
                            resolve, 
                            reject, 
                            fetchOptions.retryDelay, 
                            fetchOptions.retryLimit)
        
    });
}

function wait(retryDelay) {
    return new Promise((resolve) => {
        setTimeout(resolve, retryDelay)
    });
}

function fetchRetry(url, headers, fetchOptions, resolve, reject, retryDelay = 300, retryLimit = 5) {
    var option = Utils.mergeDeep({ 
        method: 'GET',
        headers: headers,
        timeout: 30000,                                
    }, 
    fetchOptions);

    function onError (error) {
        if (retryLimit === 0) {
            reject(error);
        }else {
            var msDelay = retryDelay
            retryLimit = retryLimit - 1
            var retryCount = (fetchOptions.retryLimit - retryLimit)
            if (fetchOptions.retryDelayOptions) {
                if (fetchOptions.retryDelayOptions.base) {
                    msDelay = fetchOptions.retryDelayOptions.base * retryCount
                } else if (fetchOptions.retryDelayOptions.customBackoff) {
                    msDelay = fetchOptions.retryDelayOptions.customBackoff(retryCount, error)
                }
            }
            wait(msDelay)
                .then(() => {
                    return fetchRetry(url, headers, retryDelay, retryLimit, fetchOptions, resolve, reject)
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
                    if (fetchOptions.retryCondition && fetchOptions.retryCondition(response)) {
                        onError(json)     
                    } else {
                        reject(json)
                    }   
                }).catch(() => {
                    reject({status: response.status, statusText: response.statusText})
                });
            }
        }).catch((error) => {
            reject(error)
        });
}