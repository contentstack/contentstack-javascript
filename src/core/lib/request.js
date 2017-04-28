import * as Utils from "./utils.js";
import HTTPRequest from "runtime/http.js";
import when from "runtime/when.js";



export default function Request(options) {
    var serialize = function(obj, prefix) {
      var str = [], p;
      for(p in obj) {
        if (obj.hasOwnProperty(p)) {
          var k = prefix ? prefix + "[" + p + "]" : p,
              v = obj[p];
          str.push((v !== null && typeof v === "object" && p !== 'query') ?
            serialize(v, k) :
            encodeURIComponent(k) + "=" + (p !== 'query' ? encodeURIComponent(v) : JSON.stringify(v)));
        }
      }
      return str.join("&");
    }
    
    var deferred = when.defer();
    var xhr = new HTTPRequest(),
        method = "GET",
        url = options.url,
        headers = options.headers;

    if(options.body && typeof options.body === 'object'){
        delete options.body._method;    
        var queryParams = serialize(options.body);
    }
    
    
    //make all calls as GET instead of POST
    xhr.open(method, url+'?'+queryParams, true);
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