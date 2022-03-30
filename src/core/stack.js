import config from '../../config';
import * as Utils from './lib/utils';
import Entry from './modules/entry';
import Assets from './modules/assets';
import Query from './modules/query';
import Request from './lib/request';
import CacheProvider from './cache-provider/index';
let errorRetry = [408, 429]

/**
     * @class 
        Stack 
     * @description Initialize an instance of ‘Stack’
     * @param param - Stack configuration.
     * @param param.api_key - Stack API Key.
     * @param param.delivery_token - Stack Delivery token.
     * @param param.environment - Stack Environment name.
     * @param param.region - DB region for Stack.
     * @param param.branch - Name of the branch you want to fetch data from
     * @param param.live_preview - Live preview configuration.
     * @param param.fetchOptions - Custom setting for the request.
     * @param param.fetchOptions.timeout - Set timeout for the request.
     * @param param.fetchOptions.retryLimit - The number of retries before failure. Default is 5
     * @param param.fetchOptions.retryDelay - The number of ms to use for operation retries. Default is 300ms
     * @param param.fetchOptions.retryCondition - A function to determine if the error can be retried. Default retry is on status codes 408, 429.
     * @param param.fetchOptions.retryDelayOptions.base - The base number of milliseconds to use in the exponential backoff for operation retries.
     * @param param.fetchOptions.retryDelayOptions.customBackoff - A custom function that accepts a retry count and error and returns the amount of time to delay in milliseconds.
     * 
     * @example
     * var Stack = Contentstack.Stack({
     *      'api_key':'api_key',
     *      'delivery_token':'delivery_token',
     *      'environment':'environment_name',
     *      'region': 'us',
     *      'fetchOptions': {
     *       
     *      }
     * });
     * 
     * @returns {Stack}
     * @instance
     */
export default class Stack {
    constructor(...stack_arguments) {
        this.fetchOptions = { 
            retryLimit: 5,
            retryCondition: (error) => {
                if (errorRetry.includes(error.status)) {
                    return true;
                }
                return false
            }
         };
        this.config = Utils.mergeDeep({}, config)

        if(stack_arguments[0].region && stack_arguments[0].region !== undefined && stack_arguments[0].region !== "us") {
            this.config['host'] = stack_arguments[0].region+"-"+"cdn.contentstack.com";
        } 

        if (stack_arguments[0].fetchOptions && stack_arguments[0].fetchOptions !== undefined) {
            this.fetchOptions =  Utils.mergeDeep(this.fetchOptions, stack_arguments[0].fetchOptions);
        }
        
        this.cachePolicy = CacheProvider.policies.IGNORE_CACHE;
        this.provider = CacheProvider.providers('localstorage');

        switch (stack_arguments.length) {
            case 1:
                if (typeof stack_arguments[0] === "object" && typeof stack_arguments[0].api_key === "string" && typeof stack_arguments[0].delivery_token === "string" && typeof stack_arguments[0].environment === "string") {
                    this.headers = {
                        api_key: stack_arguments[0].api_key,
                        access_token: stack_arguments[0].delivery_token
                    };
                    if (typeof stack_arguments[0].live_preview == "object") {
                        this.live_preview =  Utils.mergeDeep(this.config.live_preview , stack_arguments[0].live_preview)
                    }
                    if (typeof stack_arguments[0].branch === "string" && stack_arguments[0].branch !== undefined) {
                        this.headers.branch = stack_arguments[0].branch
                    }
                    this.environment = stack_arguments[0].environment;
                    return this;
                } else {
                    console.error("Kindly provide valid object parameters. The specified API Key, Delivery Token, or Environment Name is invalid.");
                }
            case 3:
                console.warn("WARNING! Obsolete function called. Function 'Contentstack.Stack(api_key, delivery_token, environment)' has been deprecated, please use 'Contentstack.Stack({api_key, delivery_token, environment, region, branch, fetchOptions})' function instead!");
                if (typeof stack_arguments[0] === "string" && typeof stack_arguments[1] === "string" && typeof stack_arguments[2] === "string") {
                    this.headers = {
                        api_key: stack_arguments[0],
                        access_token: stack_arguments[1]
                    };
                    this.environment = stack_arguments[2];
                    return this;
                } else {
                    console.error("Kindly provide valid string parameters.");
                }
            case 4:
                console.warn("WARNING! Obsolete function called. Function 'Contentstack.Stack(api_key, delivery_token, environment)' has been deprecated, please use 'Contentstack.Stack({api_key, delivery_token, environment, region, branch, fetchOptions})' function instead!");
                if (typeof stack_arguments[0] === "string" && typeof stack_arguments[1] === "string" && typeof stack_arguments[2] === "string") {
                    this.headers = {
                        api_key: stack_arguments[0],
                        access_token: stack_arguments[1]
                    };
                    this.environment = stack_arguments[2];
                } else {
                    console.error("Kindly provide valid string parameters.");
                }
                if (stack_arguments[3]) {                    
                    if(typeof stack_arguments[3] === "string" && stack_arguments[3] !== undefined && stack_arguments[3] !== "us") {
                        this.config['host'] = stack_arguments[3]+"-"+"cdn.contentstack.com";
                    } else if (typeof stack_arguments[3] === 'object') {
                        this.fetchOptions = Utils.mergeDeep(this.fetchOptions, stack_arguments[3]);
                    }
                }
                return this;
            case 5:
                console.warn("WARNING! Obsolete function called. Function 'Contentstack.Stack(api_key, delivery_token, environment)' has been deprecated, please use 'Contentstack.Stack({api_key, delivery_token, environment, region, branch, fetchOptions})' function instead!");
                if (typeof stack_arguments[0] === "string" && typeof stack_arguments[1] === "string" && typeof stack_arguments[2] === "string") {
                    this.headers = {
                        api_key: stack_arguments[0],
                        access_token: stack_arguments[1]
                    };
                    this.environment = stack_arguments[2];
                } else {
                    console.error("Kindly provide valid string parameters.");
                }

                if (stack_arguments[3]) {
                    if(typeof stack_arguments[3] === "string" && stack_arguments[3] !== undefined && stack_arguments[3] !== "us") {
                        this.config['host'] = stack_arguments[3]+"-"+"cdn.contentstack.com";
                    } else if (typeof stack_arguments[3] === 'object') {
                        this.fetchOptions = Utils.mergeDeep(this.fetchOptions, stack_arguments[3]);
                    }
                }
                if (stack_arguments[4] && typeof stack_arguments[4] === 'object') {
                    this.fetchOptions = Utils.mergeDeep(this.fetchOptions, stack_arguments[4]);
                }
                return this;
            default:
                console.error("Kindly provide valid parameters to initialize the Contentstack javascript-SDK Stack.");
        }

    }

    /**
     * @method setPort
     * @memberOf Stack
     * @description Sets the port of the host
     * @param {Number} port - Port Number
     * @return {Stack}
     * @instance
     * */
    setPort(port) {
        if (typeof port === "number") this.config.port = port;
        return this;
    }

    /**
     * @method setProtocol
     * @memberOf Stack
     * @description Sets the protocol for the host
     * @param {String} protocol - http/https protocol
     * @return {Stack}
     * @instance
     * */
    setProtocol(protocol) {
        if (typeof protocol === "string" && ~["https", "http"].indexOf(protocol)) this.config.protocol = protocol;
        return this;
    }

    /**
     * @method setHost
     * @memberOf Stack
     * @description Sets the host of the API server
     * @param {String} host - valid ip or host
     * @return {Stack}
     * @instance
     * */
    setHost(host) {
        if (typeof host === "string" && host) this.config.host = host;
        return this;
    }

    /**
     * @method setCachePolicy
     * @memberOf Stack
     * @description Allows you to set cache policies
     * @param {Constant} [key=ONLY_NETWORK] - Cache policy to be applied on Stack or Query.
     * @example
     * Stack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
     * Stack.setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK)
     * Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK)
     * Stack.setCachePolicy(Contentstack.CachePolicy.NETWORK_ELSE_CACHE)
     * Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK)
     * @returns {Stack}
     * @instance
     */
    setCachePolicy(policy) {
        if (typeof policy === 'number' && policy >= -1 && policy < 4) {
            if (!this._query) {
                this.cachePolicy = policy;
            } else {
                this.queryCachePolicy = policy;
            }
        } else {
            console.error("Kindly provide the valid policy");
        }
        return this;
    }


    livePreviewQuery(query) {
        if (this.live_preview) {
            this.live_preview.live_preview = query.live_preview;
            this.live_preview.content_type_uid = query.content_type_uid;
        }
    }

     /**
     * @method setCacheProvider
     * @memberOf Stack
     * @description Allows you to set an object of the cache provider
     * @example
     * Stack
     *      .setCacheProvider({
     *          get: function (key, callback) {
     *              // custom logic
     *          },
     *          set: function (key, value, callback) {
     *              // custom logic
     *          }
     *      });
     * @returns {Stack}
     * @instance
     */
    setCacheProvider(provider) {
        if (provider && typeof provider === 'object') {
            this.provider = provider;

        }
        return this;
    }

    /**
     * @method clearByQuery
     * @memberOf Stack
     * @description 'clearByQuery' function to clear the query from the cache.
     * @example
     * Stack.clearQuery(query, callback);
     * @returns {Stack}
     * @instance
     */
    clearByQuery() {
        if (this.provider && typeof this.provider.clearByQuery === 'function') {
            return this.provider.clearByQuery.apply(this.provider, arguments);
        }
    }

    /**
     * @method clearByContentType
     * @memberOf Stack
     * @description 'clearByContentType' function to clear the query from the cache by specified content type.
     * @example
     * Stack.clearByContentType(content_type_uid, callback);
     * Stack.clearByContentType(content_type_uid, language_uid, callback);
     * @returns {Stack}
     * @instance
     */
    clearByContentType() {
        if (this.provider && typeof this.provider.clearByContentType === 'function') {
            return this.provider.clearByContentType.apply(this.provider, arguments);
        }
    }

    /**
     * @method clearAll
     * @memberOf Stack
     * @description 'clearAll' function to clear all the queries from cache.
     * @example
     * Stack.clearAll(callback);
     * @returns {Stack}
     * @instance   
     */
    clearAll() {
        if (this.provider && typeof this.provider.clearAll === 'function') {
            return this.provider.clearAll.apply(this.provider, arguments);
        }
    }

   /**
     * @method getCacheProvider
     * @memberOf Stack
     * @description Returns the currently set object of 'CacheProvider'
     * @example Stack.getCacheProvider();
     * @returns {object}
     * @instance
     */
    getCacheProvider() {
        return this.provider;
    }

   /**
     * @method ContentType
     * @memberOf Stack
     * @description Set the content type of which you want to retrieve the entries
     * @param {String} [content_type_uid] - uid of the existing content type
     * @example 
     * let data = Stack.ContentType('blog').Query().toJSON().find()
     *      data
     *      .then(function(result) {
     *           // 'result' content the list of entries of particular content type blog.       
     *      }, function(error) {
     *           // error function
     *      })
     * @returns {Stack}
     * @instance
     */
    ContentType(uid) {
        if (uid && typeof uid === 'string') {
            this.content_type_uid = uid;
            this.type = "contentType";
        }
        return this;
    }

 /**
     * @method Entry
     * @memberOf ContentType
     * @param {String} uid - uid of the entry 
     * @description An initializer is responsible for creating Entry object
     * @returns {Entry}
     * @instance 
     */
    Entry(uid) {
        let entry = new Entry();
        if (uid && typeof uid === "string") {
            entry.entry_uid = uid;
        }
        return Utils.merge(entry, this);
    }

     /**
     * @method fetch
     * @memberOf ContentType
     * @description This method returns the complete information of a specific content type.
     * @example
     * let single_contenttype = Stack.ContentType(content_type_uid).fetch()
     *    single_contenttype
     *    .then(function(result) {
     *      // 'result' is a single contentType information.       
     *     }).catch((error) => {
     *        console.log(error)
     *  });
     * @returns {promise}
     * @instance 
     */
    fetch(fetchOptions) {
        let result = {
            method: 'POST',
            headers: this.headers,
            url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid,
            body: {
                _method: 'GET',
                environment: this.environment
            }
        };
        var options = Utils.mergeDeep(this.fetchOptions, fetchOptions);
        return Request(result, options);
    }

  /**
     * @method Assets
     * @memberOf Stack
     * @param {String} uid - uid of the asset 
     * @description Retrieves all assets of a stack by default. To retrieve a single asset, specify its UID.
     * @example 
     * // Retrieves all assets
     * let data = Stack.Assets().Query().toJSON().find()
     *      data
     *      .then(function(result) {
     *          // All the asset with limit of 100
     *          // Use skip and limit functions to paginate
     *          // ‘result’ will display all assets present in stack       
     *      }, function(error) {
     *           // error function
     *      })
     * 
     * @example 
     * let data = Stack.Assets('asset_uid').toJSON().fetch()
     *      data
     *        .then(function(result) {
     *           // ‘result’ is a single asset object of specified uid       
     *      }, function(error) {
     *           // error function
     *      })
     * 
     * @returns {Assets}
     * @instance 
     */
    Assets(uid) {
        this.type = 'asset';
        if (uid && typeof uid === "string") {
            let asset = new Assets();
            asset.asset_uid = uid;
            return Utils.merge(asset, this);
        }
        return this;
    }

 /**
     * @method Query
     * @memberOf Stack
     * @description An initializer is responsible for creating Query object.Provides support for all search queries
     * @returns {Query}
     * @instance  
     */
    Query() {
        let query = new Query();
        return Utils.merge(query, this);
    }

   /**
     * @method getLastActivities
     * @memberOf Stack
     * @description getLastActivities get all the ContentTypes whose last activity updated.
     * @example Stack.getLastActivities()
     * @example 
     * let data = Stack.getLastActivities().toJSON().fetch()
     *      data
     *      .then(function(result) {
     *           // 'result' is list of contentTypes whose last activity updated.       
     *      }, function(error) {
     *           // error function
     *      })
     * @returns {promise}
     * @instance
     */
    getLastActivities() {
        let query = {
            method: 'POST',
            headers: this.headers,
            url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types,
            body: {
                _method: 'GET',
                only_last_activity: true,
                environment: this.environment
            }
        };
        return Request(query, this.fetchOptions);
    }

     /**
     * @method getContentTypes
     * @memberOf Stack
     * @param {String} param - Query on contentTypes
     * @description This method returns comprehensive information of all the content types of a particular stack in your account.
     * @example 
     * let data = Stack.getContentTypes({"include_global_field_schema": true})
     *      data
     *      .then(function(result) {
     *           // 'result' is list of contentTypes.       
     *      }, function(error) {
     *           // error function
     *      })
     * @returns {promise}
     * @instance
     */
    getContentTypes(param = {}) { 
        let query = {
            method: 'POST',
            headers: this.headers,
            url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types,
            body: {
                _method: 'GET',
                environment: this.environment
            }
        };
        if(param) {
            for( var key in param) {
                query.body[key] = param[key]    
            }
        }
        return Request(query, this.fetchOptions);
    }

    /**
     * @method sync
     * @memberOf Stack
     * @description Syncs your Contentstack data with your app and ensures that the data is always up-to-date by providing delta updates
     * @param {object} params - params is an object that supports ‘locale’, ‘start_date’, ‘content_type_uid’, and ‘type’ queries.
     * @example 
     * Stack.sync({'init': true})        // For initializing sync
     * @example 
     * Stack.sync({'init': true, 'locale': 'en-us'})     //For initializing sync with entries of a specific locale
     * @example 
     * Stack.sync({'init': true, 'start_date': '2018-10-22'})    //For initializing sync with entries published after a specific date
     * @example 
     * Stack.sync({'init': true, 'content_type_uid': 'session'})   //For initializing sync with entries of a specific content type
     * @example 
     * Stack.sync({'init': true, 'type': 'entry_published'})   //Use the type parameter to get a specific type of content.Supports 'asset_published', 'entry_published', 'asset_unpublished', 'entry_unpublished', 'asset_deleted', 'entry_deleted', 'content_type_deleted'.
     * @example 
     * Stack.sync({'pagination_token': '<page_tkn>'})    // For fetching the next batch of entries using pagination token
     * @example 
     * Stack.sync({'sync_token': '<sync_tkn>'})    // For performing subsequent sync after initial sync
     * @returns {promise}
     * @instance
     */

    sync(params, fetchOptions) {
        this._query = {};
        this._query = Utils.mergeDeep(this._query, params);
        this.requestParams = {
            method: 'POST',
            headers: this.headers,
            url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.sync,
            body: {
                _method: 'GET',
                query: this._query
            }
        }
        var options = Utils.mergeDeep(this.fetchOptions, fetchOptions);
        return Utils.sendRequest(this, options);
    }

    /**
     * @method imageTransform
     * @memberOf Stack
     * @description Performs transformations on images of mentioned url based on transformation parameters 
     * @param {String} url - Image url on which transformations need to be applied.
     * @param {String} params - Object with transformation parameters
     * @example
     * Stack.imageTransform(imageURL, {height: 100, width: 200, disable: "upscale"});
     * @example
     * Stack.imageTransform(imageURL, {crop: "150,100"});
     * @example
     * Stack.imageTransform(imageURL, {format: "png", crop: "150,100"});
     * @returns {string} [Image url with transformation parameters.]
     * @instance
     */
    imageTransform(url, params) {
        if (url && typeof url === "string" && typeof params === "object" && params.length === undefined) {
            let queryParams = [];
            for (const operation in params) {
                queryParams.push(operation + '=' + params[operation]);
            }
            url += (url.indexOf("?") <= -1) ? "?" + queryParams.join('&') : "&" + queryParams.join('&');
        }

        return url;
    }
}