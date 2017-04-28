import config from '../../config';
import * as Utils from './lib/utils';
import Entry from './entry/entry';
import Query from './entry/query';
import Request from  './lib/request';
import * as cache from './cache';
import CacheProvider from './cache-provider/index';

/**
 * Expose `Stack`.
 * @ignore
 */
export default class Stack{

    constructor(...stack_arguments){
        this.config = config;
        this.cachePolicy = CacheProvider.policies.IGNORE_CACHE;
        this.provider = CacheProvider.providers('localstorage');
        switch (stack_arguments.length) {
            case 1:
                if (typeof stack_arguments[0] === "object" && typeof stack_arguments[0].api_key === "string" && typeof stack_arguments[0].access_token === "string" && typeof stack_arguments[0].environment === "string") {
                    this.headers = {
                        api_key: stack_arguments[0].api_key,
                        access_token: stack_arguments[0].access_token
                    };
                    this.environment = stack_arguments[0].environment;
                    return this;
                } else {
                    console.error("Kindly provide valid object parameters.");
                }
            case 3:
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
            default:
                console.error("Kindly provide valid parameters to initialize the Built.io Contentstack javascript-SDK Stack.");
        }

    }

    /**
     * @method setPort
     * @description Sets the port of the host.
     * @param {Number} port - Port Number
     * @return Stack
     * */
    setPort(port){
        if(typeof port === "number") this.config.port = port;
        return this;
    }

    /**
     * @method setProtocol
     * @description Sets the protocol of the host.
     * @param {String} protocol - http/https protocol
     * @return Stack
     * */
    setProtocol(protocol){
        if(typeof protocol === "string" && ~["https", "http"].indexOf(protocol)) this.config.protocol = protocol;
        return this;
    }

    /**
     * @method setHost
     * @description Sets the host of the API server.
     * @param {String} host - valid ip or host
     * @return Stack
     * */
    setHost(host){
        if(typeof host === "string" && host) this.config.host = host;
        return this;
    }

    /**
     * @method setCachePolicy
     * @description setCachePolicy which contains different cache policies.
     * @param {Constant} [key=ONLY_NETWORK] - Cache policy to be applied on Stack or Query.
     * @example
     * Stack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
     * Stack.setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK)
     * Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK)
     * Stack.setCachePolicy(Contentstack.CachePolicy.NETWORK_ELSE_CACHE)
     * Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK)
     * @returns {Stack}
     */
    setCachePolicy(policy){
        if(typeof policy === 'number' && policy >= -1 && policy < 4) {
            if(!this._query) {
                this.cachePolicy = policy;
            } else {
                this.queryCachePolicy = policy;
            }
        } else {
            console.error("Kindly provide the valid policy");
        }
        return this;
    }

    /**
     * @method setCacheProvider
     * @description Set 'Cache Provider' object.
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
     */
    setCacheProvider(provider){
        if(provider && typeof provider === 'object') {
            this.provider = provider;

        }
        return this;
    }

    /**
     * @method clearByQuery
     * @description 'clearByQuery' function to clear the query from the cache.
     * @example
     * Stack.clearQuery(query, callback);
     * @ignore
     */
    clearByQuery(){
        if(this.provider && typeof this.provider.clearByQuery === 'function') {
            return this.provider.clearByQuery.apply(this.provider, arguments);
        }
    }

    /**
     * @method clearByContentType
     * @description 'clearByContentType' function to clear the query from the cache by specified content type.
     * @example
     * Stack.clearByContentType(content_type_uid, callback);
     * Stack.clearByContentType(content_type_uid, language_uid, callback);
     * @ignore
     */
    clearByContentType(){
        if(this.provider && typeof this.provider.clearByContentType === 'function') {
            return this.provider.clearByContentType.apply(this.provider, arguments);
        }
    }

    /**
     * @method clearAll
     * @description 'clearAll' function to clear all the queries from cache.
     * @example
     * Stack.clearAll(callback);
     * @ignore
     */
    clearAll(){
        if(this.provider && typeof this.provider.clearAll === 'function') {
            return this.provider.clearAll.apply(this.provider, arguments);
        }
    }

    /**
     * @method getCacheProvider
     * @description Returns currently set CacheProvider object.
     * @example Stack.getCacheProvider();
     * @returns {Object}
     */
    getCacheProvider(){
        return this.provider;
    }

    /**
     * @method ContentType
     * @description Set "ContentType" from the Stack from where you want to retrive the entries.
     * @param {String} [content_type_uid] - uid of the existing contenttype
     * @returns {Stack}
     */
    ContentType(uid){
        if (uid && typeof uid === 'string') {
            this.content_type_uid = uid;
        }
        return this;
    }

    /**
     * @method Entry
     * @description Set the Entry Uid which you want to retrive from the Contenttype specified.
     * @param {String} uid - entry_uid
     * @example ContentType('blog').Entry('blt1234567890abcef')
     * @returns {Entry}
     */
    Entry(uid){
        var entry = new Entry();
        if (uid && typeof uid === "string") {
            entry.entry_uid = uid;
        }
        return Utils.merge(entry, this);
    }

    /**
     * @method Query
     * @description Query instance to provide support for all search queries.
     * @example ContentType('blog').Query()
     * @returns {Query}
     */
    Query(){
        var query = new Query();
        return Utils.merge(query, this);
    }

    /**
     * @method getLastActivites
     * @description getLastActivites get all the ContentTypes whose last activity updated.
     * @example Stack.getLastActivites()
     * @returns {Stack}
     * @ignore
     */
    getLastActivities(){
        var query = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types,
                body: {
                    _method: 'GET',
                    only_last_activity: true,
                    environment:this.environment
                }
            };
        return Request(query);
    }
    
    
}