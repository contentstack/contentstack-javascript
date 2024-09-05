import * as Utils from "./utils.js";
import fetch from "runtime/http.js";

//JS SDK version
let version = '{{VERSION}}';
let environment,
    api_key;
export default function Request(stack, fetchOptions) {
    let requestParams = stack.requestParams;
    return new Promise(function(resolve, reject) {
        let queryParams;
        
        const params = new URLSearchParams();
        let serialize = function (obj, prefix) {
          if (typeof obj === 'object' && obj.length !== undefined) {
            for (let i = 0, _i = obj.length; i < _i; i++) {
              params.append(prefix + '[]', obj[i]);
            }
          } else {
            for (const p in obj) {
              let k = prefix ? prefix + '[' + p + ']' : p,
                v = obj[p];
              v !== null && typeof v === 'object' && p !== 'query'
                ? serialize(v, k)
                : params.append(k, p !== 'query' ? v : JSON.stringify(v));
            }
          }
          return params.toString();
        };

        // setting headers
        requestParams.headers['Content-Type'] = 'application/json; charset=UTF-8';
        requestParams.headers['X-User-Agent'] = 'contentstack-delivery-javascript-{{PLATFORM}}/' + version;

        if (requestParams.body && typeof requestParams.body === 'object') {
            delete requestParams.body._method;
            if (typeof requestParams.body.query === "object" && Object.keys(requestParams.body.query).length === 0) delete requestParams.body.query;
            queryParams = serialize(requestParams.body);
        }

        return fetchRetry(stack, queryParams, 
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

function fetchRetry(stack, queryParams, fetchOptions, resolve, reject, retryDelay = 300, retryLimit = 5) {
    const requestParams = stack.requestParams,
        url = requestParams.url + '?' + queryParams,
        headers = requestParams.headers
    const option = Utils.mergeDeep({ 
        method: 'GET',
        headers: headers,
        timeout: 30000,                                
    }, 
    fetchOptions);

    function onError (error) {
        if (retryLimit === 0) {
            if (fetchOptions.debug)  fetchOptions.logHandler('error', error);
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
                    return fetchRetry(stack, queryParams, fetchOptions, resolve, reject, retryDelay, retryLimit)
                })
                .catch(() => {
                    return fetchRetry(stack, queryParams, fetchOptions, resolve, reject, retryDelay, retryLimit)
                })
        }
    }

    if (fetchOptions.debug)  fetchOptions.logHandler('info', { url: url, option: option});

    let request = {url, option};

    let plugins = stack.plugins;
    if (plugins && plugins !== undefined) {

        for (let index = 0; index < plugins.length; index++) {

            if (typeof plugins[index].onRequest === 'function') {
                request = plugins[index].onRequest(stack, request)
            }
        }
    }

    
    fetch(request.url, request.option)
        .then( function(response) {
            
            if (fetchOptions.debug)  fetchOptions.logHandler('info', response);
            const data = response.json();

            if (response.ok && response.status === 200) {
                data.then(json => {
                    for (let index = 0;  index < plugins.length && typeof plugins[index].onResponse === 'function'; index++)
                        json =  plugins[index].onResponse(stack, request , response, json)

                    resolve(json);
                })

            } else {
                const {status, statusText} = response
                data.then((json) => {
                    const {error_message, error_code, errors} = json
                    const errorDetails = { error_message, error_code, errors, status, statusText }
                    if (fetchOptions.retryCondition && fetchOptions.retryCondition(response)) {
                        onError(errorDetails)
                    } else {
                        if (fetchOptions.debug)  fetchOptions.logHandler('error', errorDetails);
                        reject(errorDetails)
                    }   
                }).catch(() => {
                    if (fetchOptions.debug)  fetchOptions.logHandler('error', {status, statusText});
                    reject({status, statusText})
                });
            }
        }).catch((error) => {
            if (fetchOptions.debug)  fetchOptions.logHandler('error', error);
            reject(error)
        });
}
