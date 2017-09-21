import * as Utils from "./utils.js";
import fetch from "runtime/http.js";

//JS SDK version
let version = '{{VERSION}}';

export default function Request(options) {
    return new Promise(function (resolve, reject) {
        let queryParams;
        let serialize = function(obj, prefix) {
            let str = [], p;
            for (p in obj) {
                if (obj.hasOwnProperty(p)) {
                    let k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
                    str.push((v !== null && typeof v === "object" && p !== 'query') ?
                    serialize(v, k) :
                    k + "=" + (p !== 'query' ? encodeURIComponent(v) : JSON.stringify(v)));
                }
            }
            return str.join("&");
        };

        let url = options.url, 
            headers = options.headers;

        // setting headers
        headers['Content-Type'] = 'application/json; charset=UTF-8';
        headers['X-User-Agent'] = 'contentstack-(JS-SDK)/'+version;

        if (options.body && typeof options.body === 'object'){
            delete options.body._method;    
            queryParams = serialize(options.body);
        }

        fetch(url + '?' + queryParams, {
            method: 'GET',
            headers: headers
        })
        .then(function (response) {
            if (response.ok && response.status === 200) {
                let data = response.json();
                resolve(data);
            } else {
                reject(response.statusText);
            }
        }).catch(function (error) {
            console.log("Error: ", error);
            reject(error);
        });
    });
}